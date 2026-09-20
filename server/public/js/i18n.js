// ===== Internationalization (i18n) System =====

// Translations
const translations = {
    ar: {
        // Header
        pageTitle: "فزعة - التسجيل",
        brandName: "فزعة",
        
        // Page Title
        pageTitleOrder: "كن عضواً",
        pageTitlePayment: "الدفع",
        pageTitleVerification: "التحقق",
        pageTitleSuccess: "تم بنجاح",
        pageTitleHome: "فزعة - Fazaa",
        
        // Order Page
        stepPersonal: "معلومات شخصية",
        stepAddress: "معلومات العنوان",
        stepSubscribe: "اشترك",
        enterInfo: "يرجى إدخال معلوماتك بشكل صحيح",
        fullName: "الاسم الكامل",
        fullNamePlaceholder: "يرجى إدخال اسمك",
        phoneNumber: "رقم الهاتف",
        phonePrefix: "971+",
        phonePlaceholder: "5xxxxxxxx",
        nationalId: "رقم الهوية",
        nationalIdPlaceholder: "15 رقم",
        city: "المنطقة",
        selectCity: "اختر المنطقة",
        dubai: "دبي",
        abuDhabi: "أبوظبي",
        sharjah: "الشارقة",
        ajman: "عجمان",
        fujairah: "الفجيرة",
        rasAlKhaimah: "رأس الخيمة",
        ummAlQuwain: "أم القيوين",
        street1: "عنوان الشارع",
        street1Placeholder: "يرجى إدخال عنوان الشارع",
        street2: "الحي (اختياري)",
        street2Placeholder: "يرجى إدخال الحي",
        deliveryDate: "موعد الاستلام",
        backHome: "الرئيسية",
        next: "المتابعة",
        confirmOrder: "تأكيد الطلب",
        
        // Summary
        invoiceTitle: "الفاتورة وطريقة الدفع",
        orderSummary: "ملخص الطلب",
        name: "الاسم",
        phone: "رقم الهاتف",
        region: "المنطقة",
        address: "العنوان",
        package: "الباقة",
        registrationFee: "رسوم التسجيل",
        free: "مجاناً",
        duration: "المدة",
        oneYear: "سنة واحدة",
        totalAmount: "المبلغ الإجمالي",
        aed: "درهم",
        perYear: "/ سنة",
        
        // Payment Page
        cardHolder: "اسم حامل البطاقة",
        cardHolderPlaceholder: "كما هو مدون على البطاقة",
        cardNumber: "رقم البطاقة",
        cardNumberPlaceholder: "xxxx xxxx xxxx xxxx",
        expiryDate: "تاريخ الانتهاء",
        expiryPlaceholder: "MM/YY",
        cvv: "رمز الأمان (CVV)",
        cvvPlaceholder: "***",
        secureNotice: "معلوماتك محمية ومشفرة",
        completePayment: "إتمام الدفع",
        cardDeclined: "تم رفض البطاقة",
        useAnotherCard: "يرجى استخدام بطاقة أخرى",
        invalidCard: "يرجى إدخال رقم بطاقة صحيح",
        connectionError: "حدث خطأ في الاتصال",
        
        // Verification Page
        secureAuth: "المصادقة الثنائية الآمنة",
        authDesc: "ستتلقى رمزاً سرياً لمرة واحدة (OTP) لتأكيد عملية الدفع عبر رسالة نصية أو تطبيق البنك.",
        enterOtp: "يرجى إدخال رمز التحقق (OTP):",
        otpSent: "الرمز مرسل الآن إلى رقم الهاتف المرتبط بالبطاقة",
        last4: "••••",
        enterCode: "أدخل الرمز هنا:",
        codePlaceholder: "• • • • • •",
        confirm: "تأكيد",
        timerText: "ستنتهي صلاحية هذه الصفحة بعد",
        seconds: "ثانية",
        needHelp: "هل تحتاج للمساعدة؟",
        verifying: "جاري التحقق من المعلومات، يرجى الانتظار...",
        contactUs: "تواصل معنا",
        
        // Success Page
        congratulations: "🎉 تهانينا!",
        successMessage: "لقد تم التسجيل في عضوية فزعة بنجاح.\nستتلقى رسالة تأكيد على هاتفك خلال دقائق.",
        orderDetails: "تفاصيل الطلب",
        orderNumber: "رقم الطلب",
        packageType: "نوع الباقة",
        startDate: "تاريخ البدء",
        backToHome: "العودة للرئيسية",
        
        // Tier Names
        platinum: "البلاتينية",
        gold: "الذهبية",
        silver: "الفضية",
        fazaa: "خصومات فزعة",
        
        // Tier Descriptions
        platinumDesc: "أوسع مزايا وعروض حصرية",
        goldDesc: "عروض وخصومات مميزة",
        silverDesc: "خصومات وخدمات أساسية",
        fazaaDiscountDesc: "خصومات مختارة يومياً",
        
        // Prices
        pricePlatinum: "299",
        priceGold: "199",
        priceSilver: "99",
        priceFazaa: "49",
        currency: "درهم",
        
        // Errors
        requiredField: "هذا الحقل مطلوب",
        phoneError: "رقم الهاتف يجب أن يبدأ بـ 5 ويتكون من 9 أرقام",
        nationalIdError: "رقم الهوية يجب أن يكون 15 رقم",
        otpError: "رمز التحقق غير صحيح",
        
        // Footer
        privacy: "سياسة الخصوصية",
        terms: "شروط الخدمة",
        support: "الدعم",
        faq: "الأسئلة الشائعة",
        rights: "جميع الحقوق محفوظة.",
        
        // Modals & Alerts
        alertTitle: "تنبيه",
        errorSelectPackage: "يرجى اختيار الباقة أولاً ثم إكمال طلبك",
        completeOrderFirst: "يرجى إكمال بيانات الطلب أولاً",
        completePaymentFirst: "يرجى إتمام الدفع أولاً",
        okButton: "حسناً",
        
        // Features
        membershipBenefits: "مزايا العضوية",
        mostPopular: "الأكثر طلباً",
        orderNow: "أطلب الآن",
        showMore: "عرض المزيد",
        showLess: "عرض أقل",
        feat1: "عروض البلاتينية الحصرية",
        feat2: "العروض والخصومات",
        feat3: "فنادق وباقات للسفر",
        feat4: "متاجر فزعة",
        feat5: "فزعة أماكن",
        feat6: "خدمة إيجار السيارات",
        feat7: "فزعة هيلث",
        feat8: "إيجار السيارات طويل الأمد",
        feat9: "فزعة للسيارات المستعملة",
        feat10: "التعويض عن الحوادث الشخصية",
        year: "سنة"
    },
    en: {
        // Header
        pageTitle: "Fazaa - Registration",
        brandName: "Fazaa",
        
        // Page Title
        pageTitleOrder: "Become a Member",
        pageTitlePayment: "Payment",
        pageTitleVerification: "Verification",
        pageTitleSuccess: "Success",
        pageTitleHome: "Fazaa - Membership",
        
        // Order Page
        stepPersonal: "Personal Info",
        stepAddress: "Address Info",
        stepSubscribe: "Subscribe",
        enterInfo: "Please enter your information correctly",
        fullName: "Full Name",
        fullNamePlaceholder: "Please enter your name",
        phoneNumber: "Phone Number",
        phonePrefix: "+971",
        phonePlaceholder: "5xxxxxxxx",
        nationalId: "National ID",
        nationalIdPlaceholder: "15 digits",
        city: "City",
        selectCity: "Select City",
        dubai: "Dubai",
        abuDhabi: "Abu Dhabi",
        sharjah: "Sharjah",
        ajman: "Ajman",
        fujairah: "Fujairah",
        rasAlKhaimah: "Ras Al Khaimah",
        ummAlQuwain: "Umm Al Quwain",
        street1: "Street Address",
        street1Placeholder: "Please enter street address",
        street2: "Neighborhood (Optional)",
        street2Placeholder: "Please enter neighborhood",
        deliveryDate: "Delivery Date",
        backHome: "Home",
        next: "Continue",
        confirmOrder: "Confirm Order",
        
        // Summary
        invoiceTitle: "Invoice & Payment Method",
        orderSummary: "Order Summary",
        name: "Name",
        phone: "Phone Number",
        region: "Region",
        address: "Address",
        package: "Package",
        registrationFee: "Registration Fee",
        free: "Free",
        duration: "Duration",
        oneYear: "One Year",
        totalAmount: "Total Amount",
        aed: "AED",
        perYear: "/ year",
        
        // Payment Page
        cardHolder: "Cardholder Name",
        cardHolderPlaceholder: "As shown on card",
        cardNumber: "Card Number",
        cardNumberPlaceholder: "xxxx xxxx xxxx xxxx",
        expiryDate: "Expiry Date",
        expiryPlaceholder: "MM/YY",
        cvv: "Security Code (CVV)",
        cvvPlaceholder: "***",
        secureNotice: "Your information is protected and encrypted",
        completePayment: "Complete Payment",
        cardDeclined: "Card Declined",
        useAnotherCard: "Please use another card",
        invalidCard: "Please enter a valid card number",
        connectionError: "Connection error occurred",
        
        // Verification Page
        secureAuth: "Secure Two-Factor Authentication",
        authDesc: "You will receive a one-time code (OTP) to confirm the payment via SMS or bank app.",
        enterOtp: "Please enter the verification code (OTP):",
        otpSent: "Code sent to the phone number linked to the card",
        last4: "****",
        enterCode: "Enter code here:",
        codePlaceholder: "• • • • • •",
        confirm: "Confirm",
        timerText: "This page will expire after",
        seconds: "seconds",
        needHelp: "Need help?",
        verifying: "Verifying information, please wait...",
        contactUs: "Contact us",
        
        // Success Page
        congratulations: "🎉 Congratulations!",
        successMessage: "You have successfully registered for Fazaa membership.\nYou will receive a confirmation message on your phone within minutes.",
        orderDetails: "Order Details",
        orderNumber: "Order Number",
        packageType: "Package Type",
        startDate: "Start Date",
        backToHome: "Back to Home",
        
        // Tier Names
        platinum: "Platinum",
        gold: "Gold",
        silver: "Silver",
        fazaa: "Fazaa Discounts",
        
        // Tier Descriptions
        platinumDesc: "Wider benefits and exclusive offers",
        goldDesc: "Special offers and discounts",
        silverDesc: "Discounts and basic services",
        fazaaDiscountDesc: "Daily selected discounts",
        
        // Prices
        pricePlatinum: "299",
        priceGold: "199",
        priceSilver: "99",
        priceFazaa: "49",
        currency: "AED",
        
        // Errors
        requiredField: "This field is required",
        phoneError: "Phone number must start with 5 and be 9 digits",
        nationalIdError: "National ID must be 15 digits",
        otpError: "Invalid verification code",
        
        // Footer
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        support: "Support",
        faq: "FAQ",
        rights: "All rights reserved.",
        
        // Modals & Alerts
        alertTitle: "Alert",
        errorSelectPackage: "Please select a package first to complete your order",
        completeOrderFirst: "Please complete your order details first",
        completePaymentFirst: "Please complete payment first",
        okButton: "OK",
        
        // Features
        membershipBenefits: "Membership Benefits",
        mostPopular: "Most Popular",
        orderNow: "Order Now",
        showMore: "Show More",
        showLess: "Show Less",
        feat1: "Exclusive Platinum Offers",
        feat2: "Offers and Discounts",
        feat3: "Hotels and Travel Packages",
        feat4: "Fazaa Stores",
        feat5: "Fazaa Places",
        feat6: "Car Rental Service",
        feat7: "Fazaa Health",
        feat8: "Long-term Car Rental",
        feat9: "Used Cars by Fazaa",
        feat10: "Personal Accident Compensation",
        year: "year"
    }
};

// Current language
let currentLang = localStorage.getItem('fazaaLang') || 'ar';

// Toggle language function
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('fazaaLang', currentLang);
    applyLanguage(currentLang);
}

// Apply language to page
function applyLanguage(lang) {
    const html = document.documentElement;
    const langToggle = document.getElementById('langToggle');
    
    // Update HTML attributes
    if (lang === 'en') {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        if (langToggle) langToggle.textContent = 'العربية';
    } else {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        if (langToggle) langToggle.textContent = 'English';
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update page title
    const titleKey = document.querySelector('[data-i18n="pageTitle"]');
    if (titleKey) {
        document.title = translations[lang].pageTitle;
    }
    
    // Update select options if exists
    updateSelectOptions(lang);
    
    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Update select options
function updateSelectOptions(lang) {
    const citySelect = document.getElementById('city');
    if (citySelect) {
        const options = citySelect.querySelectorAll('option');
        options.forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (key && translations[lang][key]) {
                option.textContent = translations[lang][key];
            }
        });
    }
}

// Get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
});

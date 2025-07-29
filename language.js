// Language management for Raaha platform

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            en: {
                // Navigation
                home: 'Home',
                services: 'Services',
                pricing: 'Pricing',
                about: 'About',
                contact: 'Contact',
                
                // Main sections
                bookYourRide: 'Book Your Ride',
                fixedPricesNoSurprises: 'Fixed prices, no surprises',
                pickupLocation: 'Pickup location',
                whereTo: 'Where to?',
                schedule: 'Schedule',
                favorites: 'Favorites',
                chooseYourRide: 'Choose Your Ride',
                
                // Vehicle types
                economy: 'Economy',
                family: 'Family',
                business: 'Business',
                economyDesc: '4 seats • AC',
                familyDesc: '6 seats • Spacious',
                businessDesc: 'Premium • WiFi',
                
                // Fare breakdown
                tripDetails: 'Trip Details',
                noDynamicPricing: 'No Dynamic Pricing',
                baseFare: 'Base Fare',
                distance: 'Distance',
                eta: 'ETA',
                salik: 'Salik (Toll)',
                vat: 'VAT (5%)',
                total: 'Total',
                
                // Booking
                bookNow: 'Book Now',
                
                // Tracking
                driverOnWay: 'Your Driver is on the way',
                confirmed: 'Confirmed',
                arrivingIn: 'Arriving in',
                booked: 'Booked',
                onTheWay: 'On the way',
                pickup: 'Pickup',
                destination: 'Destination',
                cancelRide: 'Cancel Ride',
                
                // Features
                whyChooseRaaha: 'Why Choose Raaha?',
                experienceTheDifference: 'Experience the difference with transparent, affordable rides',
                fixedPricing: 'Fixed Pricing',
                fixedPricingDesc: 'No surge pricing. Know your fare upfront with government-approved rates.',
                trustedDrivers: 'Trusted Drivers',
                trustedDriversDesc: 'All drivers are verified and licensed with the UAE transport authorities.',
                quickBooking: 'Quick Booking',
                quickBookingDesc: 'Book your ride in seconds with our intuitive interface and smart location detection.',
                realTimeTracking: 'Real-time Tracking',
                realTimeTrackingDesc: 'Track your driver\'s location and get accurate arrival times throughout your journey.',
                multiplePayments: 'Multiple Payments',
                multiplePaymentsDesc: 'Pay with cash, card, or digital wallets. Choose what\'s convenient for you.',
                uaeFocused: 'UAE Focused',
                uaeFocusedDesc: 'Built specifically for the UAE market with local knowledge and preferences.',
                
                // Pricing section
                transparentPricing: 'Transparent Pricing',
                allPricesIncludeVAT: 'All prices include VAT and are based on government-approved rates',
                perKm: 'per km',
                passengers4: '4 passengers',
                passengers6: '6 passengers',
                airConditioning: 'Air conditioning',
                standardComfort: 'Standard comfort',
                extraLuggageSpace: 'Extra luggage space',
                premiumComfort: 'Premium comfort',
                luxuryVehicles: 'Luxury vehicles',
                professionalDrivers: 'Professional drivers',
                wifiAmenities: 'WiFi & amenities',
                mostPopular: 'Most Popular',
                pricingNote: '* Base fare starts from AED 10. Additional charges may apply for tolls (Salik) and waiting time.',
                
                // Footer
                yourTrustedRide: 'Your trusted ride in the UAE',
                instantBooking: 'Instant Booking',
                scheduledRides: 'Scheduled Rides',
                airportTransfer: 'Airport Transfer',
                businessTravel: 'Business Travel',
                support: 'Support',
                helpCenter: 'Help Center',
                contactUs: 'Contact Us',
                safety: 'Safety',
                termsConditions: 'Terms & Conditions',
                connect: 'Connect',
                downloadIOS: 'Download for iOS',
                downloadAndroid: 'Download for Android',
                allRightsReserved: 'All rights reserved.',
                
                // Time units
                min: 'min',
                km: 'km'
            },
            ar: {
                // Navigation
                home: 'الرئيسية',
                services: 'الخدمات',
                pricing: 'الأسعار',
                about: 'من نحن',
                contact: 'اتصل بنا',
                
                // Main sections
                bookYourRide: 'احجز رحلتك',
                fixedPricesNoSurprises: 'أسعار ثابتة، بلا مفاجآت',
                pickupLocation: 'موقع الانطلاق',
                whereTo: 'إلى أين؟',
                schedule: 'جدولة',
                favorites: 'المفضلة',
                chooseYourRide: 'اختر رحلتك',
                
                // Vehicle types
                economy: 'اقتصادية',
                family: 'عائلية',
                business: 'أعمال',
                economyDesc: '4 مقاعد • مكيف',
                familyDesc: '6 مقاعد • واسعة',
                businessDesc: 'فاخرة • واي فاي',
                
                // Fare breakdown
                tripDetails: 'تفاصيل الرحلة',
                noDynamicPricing: 'لا توجد أسعار متغيرة',
                baseFare: 'التعرفة الأساسية',
                distance: 'المسافة',
                eta: 'الوقت المتوقع',
                salik: 'سالك (رسوم المرور)',
                vat: 'ضريبة القيمة المضافة (5%)',
                total: 'المجموع',
                
                // Booking
                bookNow: 'احجز الآن',
                
                // Tracking
                driverOnWay: 'السائق في الطريق إليك',
                confirmed: 'مؤكد',
                arrivingIn: 'سيصل خلال',
                booked: 'محجوز',
                onTheWay: 'في الطريق',
                pickup: 'الاستلام',
                destination: 'الوجهة',
                cancelRide: 'إلغاء الرحلة',
                
                // Features
                whyChooseRaaha: 'لماذا تختار راحة؟',
                experienceTheDifference: 'اختبر الفرق مع الرحلات الشفافة والميسورة التكلفة',
                fixedPricing: 'أسعار ثابتة',
                fixedPricingDesc: 'لا توجد أسعار متغيرة. اعرف تعرفتك مسبقاً بأسعار معتمدة من الحكومة.',
                trustedDrivers: 'سائقون موثوقون',
                trustedDriversDesc: 'جميع السائقين معتمدون ومرخصون من سلطات النقل في دولة الإمارات.',
                quickBooking: 'حجز سريع',
                quickBookingDesc: 'احجز رحلتك في ثوانٍ مع واجهتنا البديهية واكتشاف المواقع الذكي.',
                realTimeTracking: 'تتبع مباشر',
                realTimeTrackingDesc: 'تتبع موقع السائق واحصل على أوقات وصول دقيقة طوال رحلتك.',
                multiplePayments: 'طرق دفع متعددة',
                multiplePaymentsDesc: 'ادفع نقداً أو بالبطاقة أو المحافظ الرقمية. اختر ما يناسبك.',
                uaeFocused: 'متخصص في الإمارات',
                uaeFocusedDesc: 'مبني خصيصاً للسوق الإماراتي بمعرفة وتفضيلات محلية.',
                
                // Pricing section
                transparentPricing: 'أسعار شفافة',
                allPricesIncludeVAT: 'جميع الأسعار تشمل ضريبة القيمة المضافة وتستند إلى أسعار معتمدة من الحكومة',
                perKm: 'لكل كم',
                passengers4: '4 راكب',
                passengers6: '6 راكب',
                airConditioning: 'مكيف هواء',
                standardComfort: 'راحة قياسية',
                extraLuggageSpace: 'مساحة أمتعة إضافية',
                premiumComfort: 'راحة متميزة',
                luxuryVehicles: 'مركبات فاخرة',
                professionalDrivers: 'سائقون محترفون',
                wifiAmenities: 'واي فاي ووسائل راحة',
                mostPopular: 'الأكثر شعبية',
                pricingNote: '* التعرفة الأساسية تبدأ من 10 درهم إماراتي. قد تطبق رسوم إضافية للرسوم (سالك) ووقت الانتظار.',
                
                // Footer
                yourTrustedRide: 'رحلتك الموثوقة في دولة الإمارات',
                instantBooking: 'حجز فوري',
                scheduledRides: 'رحلات مجدولة',
                airportTransfer: 'نقل المطار',
                businessTravel: 'سفر أعمال',
                support: 'الدعم',
                helpCenter: 'مركز المساعدة',
                contactUs: 'اتصل بنا',
                safety: 'السلامة',
                termsConditions: 'الشروط والأحكام',
                connect: 'تواصل',
                downloadIOS: 'تحميل للآيفون',
                downloadAndroid: 'تحميل لأندرويد',
                allRightsReserved: 'جميع الحقوق محفوظة.',
                
                // Time units
                min: 'دقيقة',
                km: 'كم'
            }
        };
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.updateAllText();
    }
    
    updateAllText() {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.dataset.key;
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }
    
    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
}

// Font loading optimization for Arabic text
if ('fonts' in document) {
    // Load Arabic font when needed
    const loadArabicFont = () => {
        const arabicFont = new FontFace(
            'Noto Sans Arabic',
            'url(https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHmeX4YuBUG0Un-FaMC4MVLP3WNJvqDEw.woff2)'
        );
        
        arabicFont.load().then((font) => {
            document.fonts.add(font);
            console.log('Arabic font loaded successfully');
        }).catch((error) => {
            console.error('Error loading Arabic font:', error);
        });
    };
    
    // Load Arabic font when Arabic content is detected or language is switched
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
                if (document.documentElement.dir === 'rtl') {
                    loadArabicFont();
                }
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
}

// Arabic numerals handling
const convertToArabicNumerals = (text) => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return text.replace(/[0-9]/g, (match) => arabicNumerals[parseInt(match)]);
};

const convertToEnglishNumerals = (text) => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return text.replace(/[٠-٩]/g, (match) => arabicNumerals.indexOf(match));
};

// RTL text input handling
const handleRTLInput = (input) => {
    const text = input.value;
    const isArabic = /[\u0600-\u06FF]/.test(text);
    input.dir = isArabic ? 'rtl' : 'ltr';
};

// Apply RTL handling to input fields
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => handleRTLInput(input));
    });
});

// Language-specific date and time formatting
const formatDateTime = (date, lang) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const locale = lang === 'ar' ? 'ar-AE' : 'en-AE';
    return new Intl.DateTimeFormat(locale, options).format(date);
};

// Currency formatting for different languages
const formatCurrency = (amount, lang) => {
    const options = {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2
    };
    
    const locale = lang === 'ar' ? 'ar-AE' : 'en-AE';
    return new Intl.NumberFormat(locale, options).format(amount);
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LanguageManager,
        convertToArabicNumerals,
        convertToEnglishNumerals,
        formatDateTime,
        formatCurrency,
        handleRTLInput
    };
}
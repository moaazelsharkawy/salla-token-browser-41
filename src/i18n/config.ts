import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: "Salla Token Network",
      language: "Language",
      theme: "Theme",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      settings: "Settings",
      social: "Social Links",
      yourAccount: "Your Account",
      userApps: "User Applications",
      apps: {
        mining: "system",
        deposit: "Deposit", 
        withdraw: "Withdraw",
        stQr: "ST QR",
        transfer: "Transfer",
        payRequest: "Pay Request",
        escrow: "Escrow",
        explorer: "Explorer",
        ico: "ICO",
        virtualCards: "Virtual Cards",
        developerApi: "Developer API",
        commerce: "ST Commerce",
        p2p: "ST P2P",
        kyc: "KYC",
        social: "ST Social",
        piMall: "Pi Mall"
      },
      searchPlaceholder: "Enter URL or search Google...",
      search: "Search",
      navigate: "Go",
      prices: {
        livePrices: "Live Prices",
        estimated: "Estimated",
        lastUpdated: "Last updated"
      },
      presale: {
        title: "First Round Presale Available Now!",
        description: "Reserve your tokens at an exclusive price. Don't miss this limited opportunity!",
        button: "Join Presale",
        close: "Close",
      },
      shop: {
        title: "Coming Soon: Egypt Local Mall Launch",
        description: "Get ready to join as an approved merchant with us!",
        button: "Join as Merchant",
        close: "Close",
      }
    }
  },
  ar: {
    translation: {
      appName: "Salla Token Network",
      language: "اللغة",
      theme: "المظهر",
      lightMode: "الوضع الفاتح",
      darkMode: "الوضع المظلم", 
      settings: "الإعدادات",
      social: "روابط التواصل",
      yourAccount: "حسابك",
      userApps: "تطبيقات المستخدمين",
      apps: {
        mining: "النظام",
        deposit: "إيداع", 
        withdraw: "سحب",
        stQr: "ST QR",
        transfer: "دفع",
        payRequest: "طلب دفع",
        escrow: "الضمان",
        explorer: "المستكشف",
        ico: "ICO",
        virtualCards: "بطاقات الدفع",
        developerApi: "محفظة التاجر",
        commerce: "ST Commerce",
        p2p: "ST P2P",
        kyc: "KYC",
        social: "ST Social",
        piMall: "مول Pi"
      },
      searchPlaceholder: "أدخل رابط أو ابحث في جوجل...",
      search: "بحث",
      navigate: "انتقال",
      prices: {
        livePrices: "الأسعار المباشرة",
        estimated: "مقدر",
        lastUpdated: "آخر تحديث"
      },
      presale: {
        title: "الجولة الأولى للبيع المسبق متاحة الآن!",
        description: "قم بحجز كميتك من العملات بسعر مميز. لا تفوت هذه الفرصة المحدودة!",
        button: "الدخول للبيع المسبق",
        close: "إغلاق",
      },
      shop: {
        title: "قريباً انطلاق مول مصر المحلي",
        description: "استعد للانضمام كتاجر معتمد لدينا!",
        button: "الانضمام كتاجر",
        close: "إغلاق",
      }
    }
  }
};

// Get saved language from localStorage or default to Arabic
const savedLanguage = localStorage.getItem('app-language') || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // Use saved language or default to Arabic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true // Enable XSS prevention by default
    },
    // Additional security settings
    saveMissing: false, // Prevent injection via missing translations
    debug: false // Disable debug in production
  });

export default i18n;

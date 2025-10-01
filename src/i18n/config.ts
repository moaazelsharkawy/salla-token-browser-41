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
      apps: {
        mining: "Mining",
        deposit: "Deposit", 
        withdraw: "Withdraw",
        stQr: "ST QR",
        transfer: "Transfer",
        payRequest: "Pay Request",
        escrow: "Escrow",
        explorer: "Explorer",
        swap: "ICO",
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
      apps: {
        mining: "التعدين",
        deposit: "إيداع", 
        withdraw: "سحب",
        stQr: "ST QR",
        transfer: "دفع",
        payRequest: "طلب دفع",
        escrow: "الضمان",
        explorer: "المستكشف",
        swap: "ICO",
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
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Default to Arabic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true // Enable XSS prevention by default
    },
    // Additional security settings
    saveMissing: false, // Prevent injection via missing translations
    debug: false // Disable debug in production
  });

export default i18n;
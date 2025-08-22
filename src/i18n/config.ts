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
        transfer: "Transfer",
        payRequest: "Pay Request",
        escrow: "Escrow",
        explorer: "Explorer",
        swap: "Swap",
        virtualCards: "Virtual Cards",
        developerApi: "Developer API",
        commerce: "ST Commerce",
        p2p: "ST P2P",
        kyc: "KYC",
        social: "ST Social",
        coupons: "Create Coupons",
        piMall: "Pi Mall"
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
        transfer: "دفع",
        payRequest: "طلب دفع",
        escrow: "الضمان",
        explorer: "المستكشف",
        swap: "تبديل",
        virtualCards: "بطاقات دفع افتراضية",
        developerApi: "منطقة API التجار",
        commerce: "ST Commerce",
        p2p: "ST P2P",
        kyc: "KYC",
        social: "ST Social",
        coupons: "إنشاء الخصم",
        piMall: "مول Pi"
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
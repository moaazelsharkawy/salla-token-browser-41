import { useState, useEffect } from 'react';

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
    OneSignal?: any;
  }
}

const APP_ID = "0b54fe9f-d9d9-49b2-903a-43da608b5d5c";
const COOKIE_NAME = "onesignal_consent";

export const useOneSignal = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('🔄 useOneSignal hook loaded');

  // قراءة حالة الموافقة من الكوكيز
  const getConsentFromCookie = (): boolean => {
    try {
      const cookies = document.cookie.split(';');
      const consentCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${COOKIE_NAME}=`)
      );
      const hasConsent = consentCookie?.split('=')[1] === 'true';
      console.log('🍪 Consent from cookie:', hasConsent);
      return hasConsent;
    } catch (error) {
      console.error('❌ Error reading cookie:', error);
      return false;
    }
  };

  // حفظ الموافقة في الكوكيز
  const saveConsentToCookie = (consent: boolean) => {
    try {
      // حفظ في الجلسة الحالية فقط
      document.cookie = `${COOKIE_NAME}=${consent}; path=/; SameSite=Lax`;
      console.log('💾 Consent saved to cookie:', consent);
      setHasConsent(consent);
    } catch (error) {
      console.error('❌ Error saving cookie:', error);
    }
  };

  // تهيئة OneSignal
  useEffect(() => {
    console.log('🚀 Initializing OneSignal...');
    
    const consent = getConsentFromCookie();
    setHasConsent(consent);

    // إظهار نافذة الموافقة إذا لم يكن المستخدم قد اتخذ قرار بعد
    const hasDecided = document.cookie.includes(COOKIE_NAME);
    if (!hasDecided) {
      console.log('📢 Showing notification prompt (no previous decision)');
      setShowPrompt(true);
    } else {
      console.log('✓ User already made a decision:', consent ? 'accepted' : 'declined');
    }

    // تهيئة OneSignal SDK
    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        try {
          console.log('🔧 Configuring OneSignal...');
          await OneSignal.init({
            appId: APP_ID,
            allowLocalhostAsSecureOrigin: true,
          });
          setIsInitialized(true);
          console.log('✅ OneSignal initialized successfully');
          console.log('📱 OneSignal object:', OneSignal);
        } catch (error) {
          console.error('❌ OneSignal initialization error:', error);
        }
      });
    }
  }, []);

  // طلب إذن الإشعارات
  const requestPermission = async () => {
    setIsLoading(true);
    console.log('🔔 Requesting notification permission...');
    
    try {
      if (!window.OneSignal) {
        console.error('❌ OneSignal not loaded yet');
        setIsLoading(false);
        return false;
      }

      console.log('📞 Calling OneSignal.Notifications.requestPermission()');
      const permission = await window.OneSignal.Notifications.requestPermission();
      console.log('✅ Permission result:', permission);
      
      if (permission) {
        saveConsentToCookie(true);
        setShowPrompt(false);
        
        // جلب معرف المستخدم
        try {
          const userId = await window.OneSignal.User.PushSubscription.id;
          console.log('👤 OneSignal User ID:', userId);
        } catch (error) {
          console.log('⚠️ Could not get user ID:', error);
        }
        
        setIsLoading(false);
        return true;
      } else {
        console.log('⚠️ Permission denied');
        saveConsentToCookie(false);
        setShowPrompt(false);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Error requesting permission:', error);
      setIsLoading(false);
      return false;
    }
  };

  // رفض الإشعارات
  const dismissPrompt = () => {
    console.log('❌ User dismissed notification prompt');
    saveConsentToCookie(false);
    setShowPrompt(false);
  };

  // إرسال tag للمستخدم
  const setUserTag = async (key: string, value: string) => {
    try {
      if (window.OneSignal && hasConsent) {
        await window.OneSignal.User.addTag(key, value);
        console.log(`✅ Tag set: ${key} = ${value}`);
        return true;
      } else {
        console.log('⚠️ Cannot set tag - no consent or OneSignal not ready');
        return false;
      }
    } catch (error) {
      console.error('❌ Error setting tag:', error);
      return false;
    }
  };

  return {
    isInitialized,
    hasConsent,
    showPrompt,
    isLoading,
    requestPermission,
    dismissPrompt,
    setUserTag
  };
};

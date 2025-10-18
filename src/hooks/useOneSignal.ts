import { useState, useEffect } from 'react';

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
    OneSignal?: any;
  }
}

const APP_ID = "0b54fe9f-d9d9-49b2-903a-43da608b5d5c";
const COOKIE_NAME = "onesignal_notification_consent";

export const useOneSignal = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // قراءة حالة الموافقة من الكوكيز
  const getConsentFromCookie = (): boolean => {
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
    return consentCookie?.split('=')[1] === 'true';
  };

  // حفظ الموافقة في الكوكيز
  const saveConsentToCookie = (consent: boolean) => {
    // حفظ في الجلسة الحالية فقط (بدون تحديد max-age أو expires)
    document.cookie = `${COOKIE_NAME}=${consent}; path=/; SameSite=Strict`;
    setHasConsent(consent);
  };

  // تهيئة OneSignal
  useEffect(() => {
    const consent = getConsentFromCookie();
    setHasConsent(consent);

    // إظهار نافذة الموافقة إذا لم يكن المستخدم قد وافق بعد
    if (!consent) {
      setShowPrompt(true);
    }

    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId: APP_ID,
        });
        setIsInitialized(true);
        console.log('✅ OneSignal initialized');
      });
    }
  }, []);

  // طلب إذن الإشعارات
  const requestPermission = async () => {
    try {
      if (window.OneSignal) {
        const permission = await window.OneSignal.Notifications.requestPermission();
        console.log('🔔 Notification permission:', permission);
        
        if (permission) {
          saveConsentToCookie(true);
          setShowPrompt(false);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Error requesting permission:', error);
      return false;
    }
  };

  // رفض الإشعارات
  const dismissPrompt = () => {
    saveConsentToCookie(false);
    setShowPrompt(false);
  };

  // إرسال tag للمستخدم
  const setUserTag = async (key: string, value: string) => {
    try {
      if (window.OneSignal && hasConsent) {
        await window.OneSignal.User.addTag(key, value);
        console.log(`✅ Tag set: ${key} = ${value}`);
      }
    } catch (error) {
      console.error('❌ Error setting tag:', error);
    }
  };

  return {
    isInitialized,
    hasConsent,
    showPrompt,
    requestPermission,
    dismissPrompt,
    setUserTag
  };
};

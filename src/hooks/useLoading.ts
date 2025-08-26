import { useState, useEffect, useCallback } from 'react';
import { Browser } from '@capacitor/browser';

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  handleExternalLink: (url: string) => void;
}

export function useLoading(): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleExternalLink = useCallback(async (url: string) => {
    startLoading();
    
    try {
      // استخدام متصفح Chrome المضمن من Capacitor
      await Browser.open({ 
        url: url,
        presentationStyle: 'popover',
        toolbarColor: '#ffffff'
      });
    } catch (error) {
      // في حالة فشل المتصفح المضمن، استخدم المتصفح العادي
      window.open(url, '_blank');
    } finally {
      // إيقاف التحميل
      setTimeout(stopLoading, 500);
    }
  }, [startLoading, stopLoading]);

  // مراقبة أحداث المتصفح لإعادة التحميل
  useEffect(() => {
    const handleBeforeUnload = () => {
      startLoading();
    };

    const handleLoad = () => {
      stopLoading();
    };

    // التعامل مع حالة التركيز على النافذة (عندما يعود المستخدم للتطبيق)
    const handleFocus = () => {
      stopLoading();
    };

    const handleBlur = () => {
      // عدم بدء التحميل فوراً عند فقدان التركيز
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    handleExternalLink
  };
}
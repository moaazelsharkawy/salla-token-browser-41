import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
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
      // التحقق من وجود Capacitor والتطبيق المحلي
      if (Capacitor.isNativePlatform()) {
        // استخدام متصفح Chrome المضمن في التطبيق المحلي
        await Browser.open({ 
          url: url,
          presentationStyle: 'popover',
          toolbarColor: '#ffffff'
        });
      } else {
        // في حالة المتصفح العادي، استخدم النافذة الجديدة
        window.open(url, '_blank');
      }
    } catch (error) {
      // في حالة فشل المتصفح المضمن، استخدم المتصفح العادي
      window.open(url, '_blank');
    } finally {
      // إيقاف التحميل
      setTimeout(stopLoading, 500);
    }
  }, [startLoading, stopLoading]);

  // إدارة دورة حياة التطبيق للأجهزة المحمولة
  useEffect(() => {
    let isAppVisible = true;
    let loadingTimeout: NodeJS.Timeout | null = null;

    const clearLoadingTimeout = () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }
    };

    // التعامل مع حالة التركيز على النافذة (عندما يعود المستخدم للتطبيق)
    const handleFocus = () => {
      isAppVisible = true;
      clearLoadingTimeout();
      // تأخير قصير لضمان استقرار التطبيق قبل إيقاف التحميل
      loadingTimeout = setTimeout(() => {
        stopLoading();
      }, 100);
    };

    const handleBlur = () => {
      isAppVisible = false;
      clearLoadingTimeout();
    };

    // التعامل مع تغيير حالة الرؤية (أهم للأجهزة المحمولة)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        isAppVisible = true;
        clearLoadingTimeout();
        // إيقاف أي حالة تحميل معلقة عند عودة التطبيق
        loadingTimeout = setTimeout(() => {
          stopLoading();
        }, 200);
      } else {
        isAppVisible = false;
        clearLoadingTimeout();
      }
    };

    // التعامل مع أحداث دورة حياة الصفحة (للأجهزة المحمولة)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // الصفحة تم استردادها من cache - تنظيف حالة التحميل
        clearLoadingTimeout();
        stopLoading();
      }
    };

    const handlePageHide = () => {
      clearLoadingTimeout();
    };

    // التعامل مع تجميد/إلغاء تجميد التطبيق
    const handleFreeze = () => {
      clearLoadingTimeout();
    };

    const handleResume = () => {
      if (isAppVisible) {
        clearLoadingTimeout();
        loadingTimeout = setTimeout(() => {
          stopLoading();
        }, 150);
      }
    };

    // إضافة مستمعي الأحداث
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);
    
    // أحداث تجميد/استئناف التطبيق (للأجهزة المحمولة الحديثة)
    document.addEventListener('freeze', handleFreeze);
    document.addEventListener('resume', handleResume);

    // تنظيف عند إلغاء التحميل
    return () => {
      clearLoadingTimeout();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('freeze', handleFreeze);
      document.removeEventListener('resume', handleResume);
    };
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    handleExternalLink
  };
}
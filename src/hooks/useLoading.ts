import { useState, useEffect, useCallback } from 'react';

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

  const handleExternalLink = useCallback((url: string) => {
    startLoading();
    
    // تشغيل التحميل لفترة قصيرة للإشارة إلى بدء التحميل
    setTimeout(() => {
      window.open(url, '_blank');
      // إيقاف التحميل بعد فتح الرابط
      setTimeout(stopLoading, 1000);
    }, 500);
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
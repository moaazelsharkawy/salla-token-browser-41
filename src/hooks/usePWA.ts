import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log('PWA Hook initialized');
    
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const installed = isStandalone || isInWebAppiOS;
      
      console.log('Install status check:', {
        isStandalone,
        isInWebAppiOS,
        installed
      });
      
      setIsInstalled(installed);
    };

    checkIfInstalled();

    // For development/testing - show install prompt after 3 seconds if not installed
    const timer = setTimeout(() => {
      if (!isInstalled) {
        console.log('Showing install prompt for testing (no beforeinstallprompt event detected)');
        setShowInstallPrompt(true);
      }
    }, 3000);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
      clearTimeout(timer); // Clear the test timer since real event fired
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('App installed event fired!');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available - opening install instructions');
      // For browsers that don't support native install, show instructions
      alert('لتثبيت التطبيق:\n\nعلى الأندرويد: اضغط على قائمة المتصفح واختر "إضافة إلى الشاشة الرئيسية"\n\nعلى الآيفون: اضغط على زر المشاركة واختر "إضافة إلى الشاشة الرئيسية"');
      setShowInstallPrompt(false);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('Install prompt result:', outcome);
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during install:', error);
    }
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  return {
    showInstallPrompt,
    installApp,
    dismissPrompt,
    isInstalled
  };
};
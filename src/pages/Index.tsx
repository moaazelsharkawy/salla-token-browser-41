import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppGrid } from '@/components/AppGrid';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ShareButton } from '@/components/ShareButton';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { usePWA } from '@/hooks/usePWA';

const Index = () => {
  const { t, i18n } = useTranslation();
  const { showInstallPrompt, installApp, dismissPrompt, isInstalled } = usePWA();

  useEffect(() => {
    // Set initial direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Mobile-first container with subtle gradient background */}
      <div className="relative min-h-screen">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30 pointer-events-none" />
        
        {/* Main content container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Top status bar simulation */}
          <div className="h-6 bg-gradient-to-r from-primary/10 to-secondary/10" />
          
          {/* Header with app name and settings */}
          <header className="flex items-center justify-between p-6 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-primary/20">
                <img 
                  src="/lovable-uploads/006c77a2-1ffe-4abe-96b0-2f4c1e51083c.png" 
                  alt="Salla Network Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-cairo">
                {t('appName')}
              </h1>
            </div>
            <SettingsPanel />
          </header>
          
          {/* Welcome text */}
          <div className="text-center px-6 mb-8">
            <p className="text-lg font-semibold text-muted-foreground">
              Welcome to Salla Token Ecosystem
            </p>
          </div>

          {/* App grid - centered and responsive */}
          <main className="flex-1 flex items-center justify-center pb-12">
            <div className="w-full max-w-sm">
              <AppGrid />
            </div>
          </main>
          
          {/* Share Button */}
          <ShareButton />
          
          {/* Bottom indicator (like iOS home indicator) */}
          <div className="flex justify-center pb-4">
            <div className="w-32 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* PWA Install Prompt */}
      {showInstallPrompt && !isInstalled && (
        <PWAInstallPrompt 
          onInstall={installApp}
          onDismiss={dismissPrompt}
        />
      )}
    </div>
  );
};

export default Index;

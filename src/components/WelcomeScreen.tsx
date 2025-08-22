import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      titleEn: 'Welcome to Salla Network',
      subtitleEn: 'First Arabic Cryptocurrency on Solana'
    },
    {
      titleAr: 'نوصي باستخدام محفظة Phantom Solana',
      titleEn: 'We recommend using Phantom Solana Wallet',
      subtitleAr: 'للحصول على أفضل تجربة مع النظام',
      subtitleEn: 'For the best experience with our system'
    }
  ];

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center p-6">
      <div className="text-center text-white max-w-md w-full animate-in fade-in duration-1000">
        {/* Logo Animation */}
        <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Rotating border effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full backdrop-blur-sm" />
            <div className="relative w-full h-full p-3">
              <img 
                src="/src/assets/salla-logo-modern.png" 
                alt="Salla Token Logo"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
            <div className="w-3 h-3 bg-white/40 rounded-full animate-ping" />
          </div>
          <div className="absolute top-8 right-1/4">
            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-300" />
          </div>
          <div className="absolute top-8 left-1/4">
            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-700" />
          </div>
        </div>

        {/* Content */}
        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          {currentStep === 0 ? (
            <>
              <h1 className="text-3xl font-bold mb-4 font-cairo leading-tight">
                {steps[currentStep].titleEn}
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                {steps[currentStep].subtitleEn}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4 font-cairo leading-tight">
                {steps[currentStep].titleAr}
              </h1>
              <p className="text-lg text-white/80 mb-4 leading-relaxed">
                {steps[currentStep].subtitleAr}
              </p>
              <p className="text-base text-white/70 mb-8 leading-relaxed">
                {steps[currentStep].subtitleEn}
              </p>
            </>
          )}

          {/* Phantom Wallet Recommendation */}
          {currentStep === 1 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-white" />
                <span className="text-xl font-semibold">Phantom Wallet</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-2">
                محفظة آمنة وسهلة الاستخدام لشبكة سولانا، متوفرة كتطبيق موبايل وإضافة متصفح
              </p>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Secure and user-friendly Solana wallet, available as mobile app and browser extension
              </p>
              <Button
                onClick={() => window.open('https://phantom.com/', '_blank')}
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30 border border-white/30 backdrop-blur-sm font-medium"
              >
                Download Phantom
              </Button>
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Continue Button */}
          {currentStep === steps.length - 1 && (
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000"
            >
              <span className="mr-2">
                {i18n.language === 'ar' ? 'ابدأ الاستخدام' : 'Get Started'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
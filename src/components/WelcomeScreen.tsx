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
      titleAr: '',
      titleEn: '',
      subtitleAr: '',
      subtitleEn: ''
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center p-6 overflow-hidden">
      {/* Blockchain Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1 h-full w-full animate-pulse">
          {[...Array(192)].map((_, i) => (
            <div
              key={i}
              className={`border border-white/20 ${
                i % 7 === 0 ? 'bg-primary/30 animate-pulse' : 
                i % 11 === 0 ? 'bg-secondary/30 animate-ping' :
                i % 13 === 0 ? 'bg-accent/30 animate-bounce' : ''
              }`}
              style={{
                animationDelay: `${(i * 100) % 3000}ms`,
                animationDuration: `${2000 + (i * 50) % 1000}ms`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center text-white max-w-lg w-full animate-in fade-in duration-1000">
        {/* Enhanced Logo Animation */}
        <div className="mb-12 relative">
          <div className="w-40 h-40 mx-auto mb-8 relative">
            {/* Multiple rotating rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-l from-secondary via-primary to-accent animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 bg-gradient-to-br from-background/90 to-background/80 rounded-full backdrop-blur-lg border border-white/30" />
            
            <div className="relative w-full h-full p-6 flex items-center justify-center">
              <img 
                src="/lovable-uploads/9566e7f9-372e-4144-a8ec-f58a9132e6d0.png" 
                alt="Salla Token Logo"
                className="w-24 h-24 object-contain drop-shadow-2xl animate-pulse"
              />
            </div>
          </div>
          
          {/* Enhanced Floating Network Nodes */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-primary rounded-full animate-ping" />
          </div>
          <div className="absolute top-4 -right-8">
            <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-300" />
          </div>
          <div className="absolute top-4 -left-8">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-700" />
          </div>
          <div className="absolute -bottom-4 right-1/4">
            <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce delay-1000" />
          </div>
          <div className="absolute -bottom-4 left-1/4">
            <div className="w-2 h-2 bg-secondary/80 rounded-full animate-bounce delay-1200" />
          </div>
          
          {/* Connection Lines */}
          <div className="absolute top-8 left-1/2 w-px h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
          <div className="absolute top-1/2 left-8 w-16 h-px bg-gradient-to-r from-white/60 to-transparent animate-pulse delay-500" />
          <div className="absolute top-1/2 right-8 w-16 h-px bg-gradient-to-l from-white/60 to-transparent animate-pulse delay-1000" />
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

          {/* Enhanced Phantom Wallet Recommendation */}
          {currentStep === 1 && (
            <div className="bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/30 shadow-2xl animate-in scale-in duration-500">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-full animate-pulse">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">Phantom Wallet</h3>
                  <p className="text-white/80 text-sm">Recommended</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-white/95 text-base leading-relaxed font-medium">
                  محفظة آمنة وسهلة الاستخدام لشبكة سولانا
                </p>
                <p className="text-white/85 text-sm leading-relaxed">
                  متوفرة كتطبيق موبايل وإضافة متصفح
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  Secure and user-friendly Solana wallet, available as mobile app and browser extension
                </p>
              </div>
              
              <Button
                onClick={() => window.open('https://phantom.com/', '_blank')}
                size="lg"
                className="w-full bg-gradient-to-r from-white/25 to-white/20 text-white hover:from-white/35 hover:to-white/30 border border-white/40 backdrop-blur-sm font-semibold py-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Wallet className="w-5 h-5 mr-2" />
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
            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000 shadow-lg"
              >
                <span className="mr-2">
                  {i18n.language === 'ar' ? 'ابدأ الاستخدام' : 'Get Started'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

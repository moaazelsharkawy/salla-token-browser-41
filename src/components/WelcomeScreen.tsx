import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

// Compact, English-only Welcome Screen (default export for easy preview)
export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // Steps (English text only for compact version)
  const steps = [
    {
      title: 'Welcome to Salla Network',
      subtitle: 'First Arabic Cryptocurrency on Solana'
    },
    {
      title: 'Trade Without Limits',
      subtitle: 'For a seamless experience, set up your Solana wallet. We recommend Phantom.'
    }
  ];

  // Auto-advance (3s per step except last)
  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep((p) => p + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length]);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onComplete, 350);
  };

  const currentStepData = steps[currentStep];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-start pt-12 justify-center p-4">
      {/* Dimmed grid background (reduced density for performance & compact look) */}
      <div className="absolute inset-0 opacity-16">
        <div className="grid grid-cols-8 gap-1 h-full w-full">
          {[...Array(96)].map((_, i) => (
            <div
              key={i}
              className={`border border-white/12 ${
                i % 7 === 0 ? 'bg-primary/20' : i % 11 === 0 ? 'bg-secondary/20' : ''
              }`}
              style={{
                animationDelay: `${(i * 50) % 1500}ms`,
                animationDuration: `${1200 + (i * 30) % 800}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main compact card */}
      <div className="relative z-10 w-full max-w-md bg-transparent text-white rounded-xl p-4 shadow-lg max-h-[68vh] overflow-y-auto">
        <div className="flex flex-col items-center gap-4">
          {/* Compact logo */}
          <div className="w-28 h-28 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-l from-secondary via-primary to-accent animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full bg-background/90 backdrop-blur-sm border border-white/20" />
            <img
              src="/lovable-uploads/9566e7f9-372e-4144-a8ec-f58a9132e6d0.png"
              alt="Salla Token Logo"
              className="relative w-18 h-18 object-contain drop-shadow-lg"
              style={{ width: 92, height: 92 }}
            />
          </div>

          {/* Text content (English only) */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold leading-tight">{currentStepData.title}</h1>
            <p className="text-sm text-white/85 mt-2">{currentStepData.subtitle}</p>
            {currentStep === 1 && (
              <p className="text-xs text-white/70 mt-2">Recommended wallet: Phantom (mobile & browser extension)</p>
            )}
          </div>

          {/* Wallet recommendation (compact) */}
          {currentStep === 1 && (
            <div className="w-full bg-white/6 rounded-xl p-3 mt-2 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-md">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Phantom Wallet</div>
                  <div className="text-xs text-white/70">Secure & user-friendly</div>
                </div>
              </div>

              <Button
                onClick={() => window.open('https://phantom.com/', '_blank')}
                size="sm"
                className="mt-3 w-full rounded-lg py-2 text-sm"
              >
                Download Phantom
              </Button>
            </div>
          )}

          {/* Progress dots (compact) */}
          <div className="flex items-center gap-2 mt-3">
            {steps.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentStep ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>

        {/* Continue button pinned near bottom of the card (compact) */}
        {currentStep === steps.length - 1 && (
          <div className="mt-4 pb-2">
            <Button onClick={handleContinue} size="lg" className="w-full rounded-xl py-2 font-medium flex items-center justify-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

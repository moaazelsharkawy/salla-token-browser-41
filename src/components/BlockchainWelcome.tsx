import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield } from 'lucide-react';

interface BlockchainWelcomeProps {
  onComplete: () => void;
}

export const BlockchainWelcome = ({ onComplete }: BlockchainWelcomeProps) => {
  const { i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-6">
      <div className="text-center text-white max-w-md w-full animate-in fade-in duration-1000">
        {/* Solana Logo Animation */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Rotating gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-1 bg-gradient-to-br from-green-400/20 to-purple-600/20 rounded-full backdrop-blur-sm" />
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              {/* Solana-inspired icon */}
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg transform rotate-12" />
                <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                    SOL
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-4 left-1/3 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
          <div className="absolute top-12 right-1/3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300" />
          </div>
          <div className="absolute bottom-4 left-1/4">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-700" />
          </div>
        </div>

        {/* Content */}
        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          <h1 className="text-3xl font-bold mb-2 font-cairo leading-tight">
            مبنية على شبكة سولانا
          </h1>
          <h2 className="text-xl font-semibold mb-4 text-white/80">
            Built on Solana Blockchain
          </h2>
          
          <p className="text-lg text-white/90 mb-2 leading-relaxed">
            شبكة بلوكتشين فائقة السرعة تدعم المدفوعات السريعة والآمنة
          </p>
          <p className="text-base text-white/70 mb-8 leading-relaxed">
            Ultra-fast blockchain network supporting quick and secure payments
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <p className="font-semibold text-sm mb-1">
                  سرعة فائقة
                </p>
                <p className="font-medium text-xs text-white/90 mb-2">
                  Ultra Fast
                </p>
                <p className="text-xs text-white/80 mb-1">
                  معاملات في أقل من ثانية
                </p>
                <p className="text-xs text-white/70">
                  Transactions in under a second
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Globe className="w-6 h-6 text-green-400" />
              <div className="text-left">
                <p className="font-semibold text-sm mb-1">
                  رسوم منخفضة
                </p>
                <p className="font-medium text-xs text-white/90 mb-2">
                  Low Fees
                </p>
                <p className="text-xs text-white/80 mb-1">
                  تكلفة أقل من سنت واحد
                </p>
                <p className="text-xs text-white/70">
                  Less than a cent per transaction
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Shield className="w-6 h-6 text-blue-400" />
              <div className="text-left">
                <p className="font-semibold text-sm mb-1">
                  أمان عالي
                </p>
                <p className="font-medium text-xs text-white/90 mb-2">
                  High Security
                </p>
                <p className="text-xs text-white/80 mb-1">
                  حماية متقدمة للأموال
                </p>
                <p className="text-xs text-white/70">
                  Advanced fund protection
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000"
          >
            <span className="mr-2">
              التالي - Continue
            </span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
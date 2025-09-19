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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-6 pt-8 overflow-hidden">
      {/* Enhanced Blockchain Grid Background */}
      <div className="absolute inset-0 opacity-25">
        <div className="grid grid-cols-10 md:grid-cols-14 lg:grid-cols-18 gap-1 h-full w-full">
          {[...Array(252)].map((_, i) => (
            <div
              key={i}
              className={`border border-white/10 transition-all duration-1000 ${
                i % 9 === 0 ? 'bg-green-400/20 animate-pulse' : 
                i % 13 === 0 ? 'bg-blue-500/20 animate-ping' :
                i % 17 === 0 ? 'bg-purple-500/20 animate-bounce' :
                i % 19 === 0 ? 'bg-indigo-400/20 animate-pulse' : ''
              }`}
              style={{
                animationDelay: `${(i * 150) % 4000}ms`,
                animationDuration: `${1500 + (i * 75) % 1500}ms`
              }}
            />
          ))}
        </div>
        
        {/* Flowing connection lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse delay-2000" />
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/50 to-transparent animate-pulse delay-500" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-green-400/50 to-transparent animate-pulse delay-1500" />
        </div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-lg w-full animate-in fade-in duration-1000 -mt-8">
        {/* Enhanced Solana Logo Animation */}
        <div className="mb-12 relative">
          <div className="w-40 h-40 mx-auto mb-8 relative">
            {/* Multi-layer rotating effects */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-l from-purple-600 via-indigo-500 to-green-400 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 bg-gradient-to-br from-purple-900/90 to-indigo-900/80 rounded-full backdrop-blur-lg border border-white/30" />
            
            <div className="relative w-full h-full p-6 flex items-center justify-center">
              <div className="w-24 h-24 relative animate-pulse">
                <img 
                  src="/lovable-uploads/7d1f02d5-8a29-4ef8-aebb-2031f0b36009.png" 
                  alt="Salla Token" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced Network Nodes */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-ping shadow-lg shadow-green-400/50" />
          </div>
          <div className="absolute top-8 -right-10">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300 shadow-lg shadow-blue-500/50" />
          </div>
          <div className="absolute top-8 -left-10">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-700 shadow-lg shadow-purple-500/50" />
          </div>
          <div className="absolute -bottom-6 right-1/3">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-1000 shadow-lg shadow-indigo-400/50" />
          </div>
          <div className="absolute -bottom-6 left-1/3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-1200 shadow-lg shadow-green-400/50" />
          </div>
          
          {/* Orbital paths */}
          <div className="absolute inset-8 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-12 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        </div>

        {/* Content */}
        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          <h1 className="text-3xl font-bold mb-4 font-cairo leading-tight">
            {i18n.language === 'ar' 
              ? 'مبنية على شبكة سولانا' 
              : 'Built on Solana Blockchain'
            }
          </h1>
          
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            {i18n.language === 'ar'
              ? 'شبكة بلوكتشين فائقة السرعة تدعم المدفوعات السريعة والآمنة'
              : 'Ultra-fast blockchain network supporting quick and secure payments'
            }
          </p>

          {/* Enhanced Features */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl animate-in slide-in-from-left duration-500">
              <div className="p-3 bg-yellow-400/20 rounded-full animate-pulse">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-lg mb-1">
                  {i18n.language === 'ar' ? 'سرعة فائقة' : 'Ultra Fast'}
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                  {i18n.language === 'ar' ? 'معاملات في أقل من ثانية' : 'Transactions in under a second'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl animate-in slide-in-from-right duration-500 delay-200">
              <div className="p-3 bg-green-400/20 rounded-full animate-pulse delay-300">
                <Globe className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-lg mb-1">
                  {i18n.language === 'ar' ? 'رسوم منخفضة' : 'Low Fees'}
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                  {i18n.language === 'ar' ? 'تكلفة أقل من سنت واحد' : 'Less than a cent per transaction'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl animate-in slide-in-from-left duration-500 delay-400">
              <div className="p-3 bg-blue-400/20 rounded-full animate-pulse delay-700">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-lg mb-1">
                  {i18n.language === 'ar' ? 'أمان عالي' : 'High Security'}
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                  {i18n.language === 'ar' ? 'حماية متقدمة للأموال' : 'Advanced fund protection'}
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000 shadow-lg mt-6"
          >
            <span className="mr-2">
              {i18n.language === 'ar' ? 'التالي' : 'Continue'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
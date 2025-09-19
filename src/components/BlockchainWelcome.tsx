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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4 overflow-hidden">
      {/* Advanced Blockchain Web Network */}
      <div className="absolute inset-0 opacity-30">
        {/* Hexagonal Grid Pattern */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 50) % 100}%`,
                top: `${((i * 37) % 100)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div 
                className={`w-12 h-12 border-2 ${
                  i % 3 === 0 ? 'border-green-400/40 bg-green-400/10' : 
                  i % 3 === 1 ? 'border-blue-500/40 bg-blue-500/10' : 
                  'border-purple-500/40 bg-purple-500/10'
                } transform rotate-45 animate-pulse`}
                style={{
                  animationDelay: `${i * 200}ms`,
                  animationDuration: `${2000 + (i * 100) % 1000}ms`
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Connecting Lines Network */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <g key={i}>
              <line
                x1={`${(i * 20) % 100}%`}
                y1={`${(i * 15) % 100}%`}
                x2={`${((i + 3) * 25) % 100}%`}
                y2={`${((i + 2) * 20) % 100}%`}
                stroke={i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#3b82f6' : '#a855f7'}
                strokeWidth="1"
                opacity="0.4"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 300}ms`,
                  animationDuration: `${3000 + (i * 100)}ms`
                }}
              />
            </g>
          ))}
        </svg>
        
        {/* Floating Data Nodes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              i % 3 === 0 ? 'bg-green-400' : i % 3 === 1 ? 'bg-blue-500' : 'bg-purple-500'
            } animate-bounce shadow-lg`}
            style={{
              left: `${(i * 30 + 10) % 90}%`,
              top: `${(i * 40 + 15) % 80}%`,
              animationDelay: `${i * 400}ms`,
              animationDuration: `${2000 + (i * 200)}ms`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center text-white max-w-lg w-full animate-in fade-in duration-1000">
        {/* Compact Logo Animation */}
        <div className="mb-6 relative">
          <div className="w-28 h-28 mx-auto mb-4 relative">
            {/* Streamlined rotating effects */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-1 bg-gradient-to-br from-purple-900/90 to-indigo-900/80 rounded-full backdrop-blur-lg border border-white/30" />
            
            <div className="relative w-full h-full p-3 flex items-center justify-center">
              <div className="w-16 h-16 relative">
                <img 
                  src="/lovable-uploads/7d1f02d5-8a29-4ef8-aebb-2031f0b36009.png" 
                  alt="Salla Token" 
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compact Content */}
        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          <h1 className="text-2xl font-bold mb-3 font-cairo leading-tight">
            {i18n.language === 'ar' 
              ? 'مبنية على شبكة سولانا' 
              : 'Built on Solana Blockchain'
            }
          </h1>
          
          <p className="text-base text-white/90 mb-6 leading-relaxed">
            {i18n.language === 'ar'
              ? 'شبكة بلوكتشين فائقة السرعة تدعم المدفوعات السريعة والآمنة'
              : 'Ultra-fast blockchain network supporting quick and secure payments'
            }
          </p>

          {/* Compact Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-sm mb-1">
                  {i18n.language === 'ar' ? 'سرعة فائقة' : 'Ultra Fast'}
                </p>
                <p className="text-xs text-white/80">
                  {i18n.language === 'ar' ? 'معاملات في أقل من ثانية' : 'Transactions in under a second'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
              <div className="p-2 bg-green-400/20 rounded-lg">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-sm mb-1">
                  {i18n.language === 'ar' ? 'رسوم منخفضة' : 'Low Fees'}
                </p>
                <p className="text-xs text-white/80">
                  {i18n.language === 'ar' ? 'تكلفة أقل من سنت واحد' : 'Less than a cent per transaction'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
              <div className="p-2 bg-blue-400/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-sm mb-1">
                  {i18n.language === 'ar' ? 'أمان عالي' : 'High Security'}
                </p>
                <p className="text-xs text-white/80">
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
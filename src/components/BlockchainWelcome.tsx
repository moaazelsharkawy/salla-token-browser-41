import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

interface BlockchainWelcomeProps {
  onComplete: () => void;
}

// Spider Web Component
function SpiderWeb() {
  const group = useRef<any>();

  useFrame(() => {
    if (group.current) {
      group.current.rotation.z += 0.001;
    }
  });

  const circles = [];
  const spokes = [];
  const rings = 6;
  const spokesCount = 12;

  // Generate circles
  for (let i = 1; i <= rings; i++) {
    const radius = i * 0.5;
    const points = [];
    for (let j = 0; j <= 64; j++) {
      const angle = (j / 64) * Math.PI * 2;
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
    }
    circles.push(points);
  }

  // Generate spokes
  for (let i = 0; i < spokesCount; i++) {
    const angle = (i / spokesCount) * Math.PI * 2;
    spokes.push([
      [0, 0, 0],
      [Math.cos(angle) * rings * 0.5, Math.sin(angle) * rings * 0.5, 0],
    ]);
  }

  return (
    <group ref={group}>
      {circles.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="white"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
      {spokes.map((points, i) => (
        <Line
          key={`spoke-${i}`}
          points={points}
          color="white"
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}

export const BlockchainWelcome = ({ onComplete }: BlockchainWelcomeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-4 overflow-hidden">
      {/* Spider Web Background */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <SpiderWeb />
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-md w-full animate-in fade-in duration-1000 bg-black/20 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-2xl">
        {/* Logo */}
        <div className="mb-4 relative">
          <div className="w-24 h-24 mx-auto mb-3 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-spin" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-1 bg-gradient-to-br from-purple-900/90 to-indigo-900/80 rounded-full backdrop-blur-lg border border-white/30" />
            
            <div className="relative w-full h-full p-2 flex items-center justify-center">
              <div className="w-14 h-14 relative">
                <img 
                  src="/lovable-uploads/7d1f02d5-8a29-4ef8-aebb-2031f0b36009.png" 
                  alt="Salla Token" 
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            Built on Solana Blockchain
          </h1>
          
          <p className="text-sm text-white/90 mb-4 leading-relaxed">
            Ultra-fast blockchain network supporting quick and secure payments
          </p>

          {/* Features */}
          <div className="space-y-2 mb-4">
            {[
              { icon: Zap, title: 'Ultra Fast', subtitle: 'Transactions in under a second', color: 'yellow' },
              { icon: Globe, title: 'Low Fees', subtitle: 'Less than a cent per transaction', color: 'green' },
              { icon: Shield, title: 'High Security', subtitle: 'Advanced fund protection', color: 'blue' }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-3 border border-white/30 shadow-lg">
                  <div className={`p-2 bg-${feature.color}-400/20 rounded-lg`}>
                    <Icon className={`w-4 h-4 text-${feature.color}-400`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-xs mb-0.5">
                      {feature.title}
                    </p>
                    <p className="text-xs text-white/80">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold px-6 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000 shadow-lg mt-4"
          >
            <span className="mr-2">Continue</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

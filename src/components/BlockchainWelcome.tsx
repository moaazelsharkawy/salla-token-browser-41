import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder } from '@react-three/drei';

interface BlockchainWelcomeProps {
  onComplete: () => void;
}

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
}

// Edge Component
function Edge({ start, end }: EdgeProps) {
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const dir = [
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2],
  ];
  const len = Math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2);

  const orientation: [number, number, number] = [
    Math.atan2(dir[1], dir[0]), 
    Math.acos(dir[2] / len), 
    0
  ];

  return (
    <group>
      <Cylinder
        args={[0.05, 0.05, len, 16]}
        position={mid}
        rotation={orientation}
      >
        <meshStandardMaterial color="white" />
      </Cylinder>

      <Sphere args={[0.1, 32, 32]} position={start}>
        <meshStandardMaterial color="cyan" />
      </Sphere>
      <Sphere args={[0.1, 32, 32]} position={end}>
        <meshStandardMaterial color="cyan" />
      </Sphere>
    </group>
  );
}

// Network Component
function Network() {
  const group = useRef<any>();

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.002;
    }
  });

  const nodes: [number, number, number][] = [
    [0, 0, 0],
    [1.5, 1, -0.5],
    [-1, 1.2, 1],
    [2, -1, 0.5],
    [-1.5, -1, -1],
  ];

  const edges: [[number, number, number], [number, number, number]][] = [
    [nodes[0], nodes[1]],
    [nodes[0], nodes[2]],
    [nodes[1], nodes[3]],
    [nodes[2], nodes[4]],
    [nodes[3], nodes[4]],
  ];

  return (
    <group ref={group}>
      {edges.map(([a, b], i) => (
        <Edge key={i} start={a} end={b} />
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
      {/* Network Background */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} />
          <Network />
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

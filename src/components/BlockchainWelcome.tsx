import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield } from 'lucide-react';

// استيراد مكتبات Three.js
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface BlockchainWelcomeProps {
  onComplete: () => void;
}

// ===============================================
// 🚀 مكون شبكة البلوكتشين ثلاثية الأبعاد (Three.js)
// ===============================================

const NUM_NODES = 50;
const LINE_DISTANCE_THRESHOLD = 2; // مسافة الربط بين العقد

// مكون العقدة الفردية
const Node = ({ position, index }: { position: [number, number, number], index: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  // إضافة حركة بطيئة للعقدة
  useFrame((state) => {
    // حركة خفيفة على المحور Y
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.5;
  });

  // تغيير لون العقدة بشكل عشوائي للجمالية
  const color = useMemo(() => {
    if (index % 3 === 0) return '#22c55e'; // Green-400
    if (index % 3 === 1) return '#3b82f6'; // Blue-500
    return '#a855f7'; // Purple-500
  }, [index]);

  return (
    <Sphere position={position} args={[0.1, 16, 16]} ref={ref}>
      <meshBasicMaterial color={color} toneMapped={false} emissive={color} emissiveIntensity={0.5} />
    </Sphere>
  );
};

// المكون الرئيسي للشبكة ثلاثية الأبعاد
const BlockchainNetwork3D = () => {
  // توليد مواقع عشوائية للعقد
  const nodes = useMemo(() => {
    return [...Array(NUM_NODES)].map(() => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
    }));
  }, []);

  // حساب خطوط الربط بناءً على القرب (Spider Web)
  const links = useMemo(() => {
    const tempLinks: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < NUM_NODES; i++) {
      for (let j = i + 1; j < NUM_NODES; j++) {
        const pos1 = new THREE.Vector3(...nodes[i].position);
        const pos2 = new THREE.Vector3(...nodes[j].position);
        if (pos1.distanceTo(pos2) < LINE_DISTANCE_THRESHOLD) {
          tempLinks.push([pos1, pos2]);
        }
      }
    }
    return tempLinks;
  }, [nodes]);
  
  // إضافة دوران تلقائي خفيف للمشهد
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(() => {
    groupRef.current.rotation.y += 0.001;
    groupRef.current.rotation.x += 0.0005;
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Node key={i} position={node.position} index={i} />
      ))}
      {links.map((link, i) => (
        <Line 
          key={i}
          points={[link[0], link[1]]} 
          color="#ffffff" 
          opacity={0.3}
          lineWidth={1}
        />
      ))}
      {/* إضافة تحكم بالمدار اختياري للتفاعل */}
      {/* <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={0.5} /> */}
    </group>
  );
};

// ===============================================
// 🌟 مكون الترحيب الرئيسي (BlockchainWelcome)
// ===============================================

export const BlockchainWelcome = ({ onComplete }: BlockchainWelcomeProps) => {
  const { i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  const isArabic = i18n.language === 'ar';

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-4 overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. دمج شبكة البلوكتشين ثلاثية الأبعاد */}
      <div className="absolute inset-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#22c55e" />
          <BlockchainNetwork3D />
        </Canvas>
      </div>
      
      {/* 2. محتوى الواجهة الأمامي (Overlay) */}
      <div className="relative z-10 text-center text-white max-w-lg w-full animate-in fade-in duration-1000 bg-black/30 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-2xl">
        {/* Compact Logo Animation - (يمكن استبداله بشعار سلة) */}
        <div className="mb-6 relative">
          <div className="w-28 h-28 mx-auto mb-4 relative">
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
          <h1 className={`text-2xl font-bold mb-3 leading-tight ${isArabic ? 'font-cairo' : ''}`}>
            {isArabic 
              ? 'مبنية على شبكة سولانا' 
              : 'Built on Solana Blockchain'
            }
          </h1>
          
          <p className={`text-base text-white/90 mb-6 leading-relaxed ${isArabic ? 'font-cairo' : ''}`}>
            {isArabic
              ? 'شبكة بلوكتشين فائقة السرعة تدعم المدفوعات السريعة والآمنة'
              : 'Ultra-fast blockchain network supporting quick and secure payments'
            }
          </p>

          {/* Compact Features */}
          <div className="space-y-3 mb-6">
            {/* Note: Added rtl support to features section */}
            {[{ icon: Zap, titleAr: 'سرعة فائقة', titleEn: 'Ultra Fast', subtitleAr: 'معاملات في أقل من ثانية', subtitleEn: 'Transactions in under a second', color: 'yellow' },
             { icon: Globe, titleAr: 'رسوم منخفضة', titleEn: 'Low Fees', subtitleAr: 'تكلفة أقل من سنت واحد', subtitleEn: 'Less than a cent per transaction', color: 'green' },
             { icon: Shield, titleAr: 'أمان عالي', titleEn: 'High Security', subtitleAr: 'حماية متقدمة للأموال', subtitleEn: 'Advanced fund protection', color: 'blue' }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
                  <div className={`p-2 bg-${feature.color}-400/20 rounded-lg`}>
                    <Icon className={`w-5 h-5 text-${feature.color}-400`} />
                  </div>
                  <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <p className={`font-semibold text-sm mb-1 ${isArabic ? 'font-cairo' : ''}`}>
                      {isArabic ? feature.titleAr : feature.titleEn}
                    </p>
                    <p className={`text-xs text-white/80 ${isArabic ? 'font-cairo' : ''}`}>
                      {isArabic ? feature.subtitleAr : feature.subtitleEn}
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
            className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000 shadow-lg mt-6"
          >
            <span className={`mr-2 ${isArabic ? 'rtl:ml-2 rtl:mr-0' : ''}`}>
              {isArabic ? 'التالي' : 'Continue'}
            </span>
            <ArrowRight className={`w-5 h-5 ${isArabic ? 'rtl:transform rtl:rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

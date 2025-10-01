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
      <meshBasicMaterial color={color} toneMapped={false} />
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
      {/* شبكة البلوكتشين ثلاثية الأبعاد */}
      <div className="absolute inset-0 opacity-70">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#a855f7" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#22c55e" />
          <BlockchainNetwork3D />
        </Canvas>
      </div>
      
      {/* محتوى الواجهة */}
      <div className="relative z-10 text-center text-white max-w-md w-full animate-in fade-in duration-1000">
        {/* شعار مدمج */}
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

        {/* المحتوى */}
        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500 bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/20">
          <h1 className={`text-xl font-bold mb-2 leading-tight ${isArabic ? 'font-cairo' : ''}`}>
            {isArabic 
              ? 'مبنية على شبكة سولانا' 
              : 'Built on Solana Blockchain'
            }
          </h1>
          
          <p className={`text-sm text-white/90 mb-4 leading-relaxed ${isArabic ? 'font-cairo' : ''}`}>
            {isArabic
              ? 'شبكة بلوكتشين فائقة السرعة تدعم المدفوعات السريعة والآمنة'
              : 'Ultra-fast blockchain network supporting quick and secure payments'
            }
          </p>

          {/* المميزات المدمجة */}
          <div className="space-y-2 mb-4">
            {[{ icon: Zap, titleAr: 'سرعة فائقة', titleEn: 'Ultra Fast', color: 'text-yellow-400' },
             { icon: Globe, titleAr: 'رسوم منخفضة', titleEn: 'Low Fees', color: 'text-green-400' },
             { icon: Shield, titleAr: 'أمان عالي', titleEn: 'High Security', color: 'text-blue-400' }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                  <p className={`text-xs font-semibold flex-1 ${isArabic ? 'text-right font-cairo' : 'text-left'}`}>
                    {isArabic ? feature.titleAr : feature.titleEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* زر المتابعة - مهبط للأسفل */}
        <div className="mt-6">
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <span className={isArabic ? 'font-cairo' : ''}>
              {isArabic ? 'التالي' : 'Continue'}
            </span>
            <ArrowRight className={`w-5 h-5 ${isArabic ? 'mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180' : 'ml-2'}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

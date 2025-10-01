import { useState, useRef, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlockchainWelcomeProps {
  onComplete: () => void;
}

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
}

// ===== Node (Sphere) with small pulse =====
function Node({ position, seed = 0 }: { position: [number, number, number]; seed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scale = 1 + 0.08 * Math.sin(t * 2 + seed);
    if (ref.current) ref.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={ref} position={position as any}>
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
    </mesh>
  );
}

// ===== Edge (thick line as cylinder) =====
function Edge({ start, end }: EdgeProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // compute once per start/end
  const { mid, len, quaternion } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(e, s);
    const length = dir.length();

    const midpoint = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);

    // quaternion that rotates Y-axis to dir
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

    return { mid: midpoint, len: length, quaternion: q };
  }, [start, end]);

  // apply position + rotation when mesh mounts / updates
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.position.copy(mid);
    meshRef.current.setRotationFromQuaternion(quaternion);
  }, [mid, quaternion, len]);

  return (
    <group>
      {/* Cylinder centered at mid, height = len */}
      <mesh ref={(r) => (meshRef.current = r)}>
        {/* cylinder along Y with height = len */}
        <cylinderGeometry args={[0.06, 0.06, len, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* spheres at ends */}
      <mesh position={start as any}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={end as any}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

// ===== Network component (group rotates slowly) =====
function Network() {
  const group = useRef<THREE.Group | null>(null);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0025;
      group.current.rotation.x += 0.0012;
    }
  });

  // nodes: each node is connected to at least two others (so spheres are connection points)
  const nodes: [number, number, number][] = [
    [0, 0, 0],
    [1.6, 0.9, -0.6],
    [-1.2, 1.3, 0.9],
    [2.0, -1.0, 0.6],
    [-1.6, -1.1, -1.3],
    [0.8, -0.8, 1.5],
    [-0.8, 0.6, -1.4],
  ];

  // edges: index pairs (every cylinder connects two spheres)
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [1, 5],
    [2, 6],
  ];

  return (
    <group ref={group as any}>
      {edges.map(([a, b], i) => (
        <Edge key={i} start={nodes[a]} end={nodes[b]} />
      ))}

      {nodes.map((pos, i) => (
        <Node key={i} position={pos} seed={i} />
      ))}
    </group>
  );
}

// ===== Page component =====
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
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <ambientLight intensity={0.45} />
          <pointLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} intensity={0.6} />
          <Network />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-md w-full animate-in fade-in duration-1000 bg-black/20 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-2xl">
        {/* Logo */}
        <div className="mb-4 relative">
          <div className="w-24 h-24 mx-auto mb-3 relative">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-spin"
              style={{ animationDuration: '4s' }}
            />
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
          <h1 className="text-2xl font-bold mb-2 leading-tight">Built on Solana Blockchain</h1>

          <p className="text-sm text-white/90 mb-4 leading-relaxed">
            Ultra-fast blockchain network supporting quick and secure payments
          </p>

          {/* Features */}
          <div className="space-y-2 mb-4">
            {[
              { icon: Zap, title: 'Ultra Fast', subtitle: 'Transactions in under a second', color: 'yellow' },
              { icon: Globe, title: 'Low Fees', subtitle: 'Less than a cent per transaction', color: 'green' },
              { icon: Shield, title: 'High Security', subtitle: 'Advanced fund protection', color: 'blue' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-3 border border-white/30 shadow-lg">
                  <div className={`p-2 rounded-lg`} style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-xs mb-0.5">{feature.title}</p>
                    <p className="text-xs text-white/80">{feature.subtitle}</p>
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

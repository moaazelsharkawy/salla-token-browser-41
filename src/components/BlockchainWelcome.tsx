// BlockchainWelcomeWithProEffects.tsx
import { useState, useRef, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface BlockchainWelcomeProps {
  onComplete: () => void;
  nodeCount?: number;
  connectionProbability?: number;
  thickness?: number;
  seed?: number;
}

// deterministic PRNG (optional seed)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- Node (sphere) with local glow ---------------- */
function Node({ position, seed = 0 }: { position: [number, number, number]; seed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scale = 1 + 0.08 * Math.sin(t * 2 + seed);
    if (ref.current) ref.current.scale.set(scale, scale, scale);
    // subtle pulsating glow scale
    if (glowRef.current) {
      const g = 1.6 + 0.12 * Math.sin(t * 2 + seed);
      glowRef.current.scale.set(g, g, g);
    }
  });

  return (
    <group position={position as any}>
      {/* core sphere */}
      <mesh ref={ref as any}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial
          color="#00e6ff"
          emissive="#00d9ff"
          emissiveIntensity={0.6}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* additive glow (scaled transparent sphere) */}
      <mesh ref={glowRef as any}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial
          color="#00e6ff"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ---------------- Edge (cylinder) ---------------- */
function Edge({ start, end, thickness }: { start: [number, number, number]; end: [number, number, number]; thickness: number }) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // compute mid, length, quaternion once
  const { mid, len, quaternion } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(e, s);
    const length = dir.length() || 0.0001;
    const midpoint = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { mid: midpoint, len: length, quaternion: q };
  }, [start, end]);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.position.copy(mid);
    meshRef.current.setRotationFromQuaternion(quaternion);
  }, [mid, quaternion]);

  return (
    <group>
      <mesh ref={(r) => (meshRef.current = r)}>
        {/* fewer radial segments for perf; adjust if you want smoother */}
        <cylinderGeometry args={[thickness, thickness, len, 12]} />
        <meshStandardMaterial color="#e6f7ff" metalness={0.5} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* ---------------- Subtle particles field ---------------- */
function ParticleField({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // spread within a sphere radius ~4 but a bit flattened in Z for perspective
      const r = Math.random() * 4 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * 0.65; // flatten Z a bit
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    // gentle slow rotation for parallax
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={pointsRef as any}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={positions.length / 3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

/* ---------------- Network with random generation and moving lights ---------------- */
function Network({
  nodeCount,
  connectionProbability,
  thickness,
  seed,
}: {
  nodeCount: number;
  connectionProbability: number;
  thickness: number;
  seed?: number;
}) {
  const group = useRef<THREE.Group | null>(null);

  useFrame(() => {
    if (group.current) {
      // slow global motion
      group.current.rotation.y += 0.0017;
      group.current.rotation.x += 0.0009;
    }
  });

  // generate nodes & edges deterministically if seed provided
  const { nodes, edges } = useMemo(() => {
    const rand = seed !== undefined ? mulberry32(seed) : Math.random;
    const radius = 2.2;
    const generatedNodes: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      // uniform-ish in sphere
      let x = rand() * 2 - 1;
      let y = rand() * 2 - 1;
      let z = rand() * 2 - 1;
      const v = new THREE.Vector3(x, y, z).normalize().multiplyScalar(rand() * radius);
      // slight bias to create clusters: occasionally push closer to center
      if (rand() < 0.25) v.multiplyScalar(0.6 + rand() * 0.6);
      generatedNodes.push([v.x, v.y, v.z]);
    }

    const generatedEdges: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (rand() < connectionProbability) {
          generatedEdges.push([i, j]);
        }
      }
    }

    // ensure no isolated nodes
    const adjacency = new Array(nodeCount).fill(0).map(() => []);
    generatedEdges.forEach(([a, b]) => {
      adjacency[a].push(b);
      adjacency[b].push(a);
    });

    for (let i = 0; i < nodeCount; i++) {
      if (adjacency[i].length === 0 && nodeCount > 1) {
        let nearest = -1;
        let best = Infinity;
        const vi = new THREE.Vector3(...generatedNodes[i]);
        for (let j = 0; j < nodeCount; j++) {
          if (i === j) continue;
          const vj = new THREE.Vector3(...generatedNodes[j]);
          const d = vi.distanceTo(vj);
          if (d < best) { best = d; nearest = j; }
        }
        if (nearest >= 0) generatedEdges.push([i, nearest]);
      }
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [nodeCount, connectionProbability, seed]);

  // moving highlight lights that orbit the center to give shimmer
  const light1 = useRef<THREE.PointLight | null>(null);
  const light2 = useRef<THREE.PointLight | null>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (light1.current) {
      light1.current.position.x = Math.cos(t * 0.9) * 3.2;
      light1.current.position.y = Math.sin(t * 0.6) * 1.6;
      light1.current.position.z = Math.sin(t * 0.9) * 2.1;
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(-t * 0.6) * 2.6;
      light2.current.position.y = Math.sin(-t * 0.4) * 2.0;
      light2.current.position.z = Math.cos(-t * 0.8) * 1.8;
    }
  });

  return (
    <group ref={group as any}>
      {/* subtle particle fog */}
      <ParticleField count={160} />

      {/* edges */}
      {edges.map(([a, b], i) => (
        <Edge key={i} start={nodes[a]} end={nodes[b]} thickness={thickness} />
      ))}

      {/* nodes */}
      {nodes.map((pos, i) => (
        <Node key={i} position={pos} seed={i} />
      ))}

      {/* dynamic orbiting lights */}
      <pointLight ref={light1 as any} distance={6} intensity={0.9} color={new THREE.Color('#66f6ff')} />
      <pointLight ref={light2 as any} distance={6} intensity={0.6} color={new THREE.Color('#a6ffcb')} />
    </group>
  );
}

/* ---------------- Full Page Component with Postprocessing (Bloom etc.) ---------------- */
export const BlockchainWelcome = ({
  onComplete,
  nodeCount = 12,
  connectionProbability = 0.30,
  thickness = 0.025,
  seed,
}: BlockchainWelcomeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-4 overflow-hidden">
      {/* Canvas background */}
      <div className="absolute inset-0 opacity-70">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <ambientLight intensity={0.28} />
          <directionalLight position={[5, 8, 5]} intensity={0.6} />
          <Network
            nodeCount={nodeCount}
            connectionProbability={connectionProbability}
            thickness={thickness}
            seed={seed}
          />

          {/* postprocessing */}
          <EffectComposer>
            {/* Bloom for that bright tech glow */}
            <Bloom
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              intensity={1.2}
              mipmapBlur
              radius={0.8}
            />
            {/* subtle dof to focus center */}
            <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={3} height={400} />
            {/* micro noise/grain */}
            <Noise opacity={0.02} />
            {/* subtle dark vignette */}
            <Vignette eskil={false} offset={0.1} darkness={0.9} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Foreground content card */}
      <div className="relative z-10 text-center text-white max-w-md w-full animate-in fade-in duration-1000 bg-black/20 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-2xl">
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

        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          <h1 className="text-2xl font-bold mb-2 leading-tight">Built on Solana Blockchain</h1>
          <p className="text-sm text-white/90 mb-4 leading-relaxed">
            Ultra-fast blockchain network supporting quick and secure payments
          </p>

          <div className="space-y-2 mb-4">
            {[
              { icon: Zap, title: 'Ultra Fast', subtitle: 'Transactions in under a second' },
              { icon: Globe, title: 'Low Fees', subtitle: 'Less than a cent per transaction' },
              { icon: Shield, title: 'High Security', subtitle: 'Advanced fund protection' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl p-3 border border-white/30 shadow-lg">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
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

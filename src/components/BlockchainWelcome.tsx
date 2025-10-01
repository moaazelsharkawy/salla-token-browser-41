import { useState, useRef, useMemo, useEffect } from 'react';
import { ArrowRight, Zap, Globe, Shield, Activity } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ----------------- Deterministic PRNG -----------------
const mulberry32 = (a) => {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- Node (sphere) with local glow ---------------- */
const Node = ({ position, seed = 0 }) => {
  const ref = useRef(null);
  const glowRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scale = 1 + 0.08 * Math.sin(t * 2 + seed);
    if (ref.current) ref.current.scale.set(scale, scale, scale);
    if (glowRef.current) {
      const g = 1.6 + 0.12 * Math.sin(t * 2 + seed);
      glowRef.current.scale.set(g, g, g);
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial
          color="#00e6ff"
          emissive="#00d9ff"
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={glowRef}>
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

/* ---------------- Edge (cylinder) with Shimmering effect ---------------- */
const Edge = ({ start, end, thickness, seed }) => {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

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

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      const intensity = 0.5 + 0.5 * Math.sin(t * 5 + seed); 
      materialRef.current.emissiveIntensity = intensity * 0.4;
      materialRef.current.opacity = 0.5 + 0.5 * intensity; 
    }
  });

  return (
    <group>
      <mesh ref={(r) => (meshRef.current = r)}>
        <cylinderGeometry args={[thickness, thickness, len, 12]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#00aaff" 
          emissive="#00ccff"
          emissiveIntensity={0.4}
          metalness={0.5} 
          roughness={0.25} 
          transparent 
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ---------------- Subtle particles field ---------------- */
const ParticleField = ({ count = 160 }) => {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 5 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * 0.8;
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={positions.length / 3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} sizeAttenuation transparent opacity={0.5} color="#ffffff" />
    </points>
  );
}

/* ---------------- Network with random generation and moving lights ---------------- */
const Network = ({
  nodeCount,
  connectionProbability,
  thickness,
  seed,
}) => {
  const group = useRef(null);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0017;
      group.current.rotation.x += 0.0009;
    }
  });

  const { nodes, edges } = useMemo(() => {
    const rand = seed !== undefined ? mulberry32(seed) : Math.random;
    const radius = 2.6;
    const generatedNodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
      let x = rand() * 2 - 1;
      let y = rand() * 2 - 1;
      let z = rand() * 2 - 1;
      const v = new THREE.Vector3(x, y, z).normalize().multiplyScalar(rand() * radius);
      if (rand() < 0.3) v.multiplyScalar(0.7 + rand() * 0.5);
      generatedNodes.push([v.x, v.y, v.z]);
    }

    const generatedEdges = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (rand() < connectionProbability) {
          generatedEdges.push([i, j]);
        }
      }
    }

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

  const light1 = useRef(null);
  const light2 = useRef(null);
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
    <group ref={group}>
      <ParticleField count={200} />

      {edges.map(([a, b], i) => (
        <Edge key={i} start={nodes[a]} end={nodes[b]} thickness={thickness} seed={i * 10} />
      ))}

      {nodes.map((pos, i) => (
        <Node key={i} position={pos} seed={i} />
      ))}

      <pointLight ref={light1} distance={6} intensity={0.9} color={new THREE.Color('#66f6ff')} />
      <pointLight ref={light2} distance={6} intensity={0.6} color={new THREE.Color('#a6ffcb')} />
    </group>
  );
}

/* ---------------- Main App Component ---------------- */
const BlockchainWelcome = ({
  onComplete,
  nodeCount = 18,
  connectionProbability = 0.35,
  thickness = 0.025,
  seed = 42,
}) => {
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
        <Canvas 
          camera={{ position: [0, 0, 7], fov: 50 }}
          onCreated={({ scene }) => {
            scene.fog = new THREE.FogExp2(0x0a0a1a, 0.05);
          }}
        >
          <ambientLight intensity={0.28} />
          <directionalLight position={[5, 8, 5]} intensity={0.6} />
          <Network
            nodeCount={nodeCount}
            connectionProbability={connectionProbability}
            thickness={thickness}
            seed={seed}
          />
        </Canvas>
      </div>

      {/* Foreground content card */}
      <div className="relative z-10 text-center text-white max-w-md w-full animate-in fade-in duration-1000 bg-black/20 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-2xl">
        <div className="mb-4 relative">
          {/* Icon Spinner Container */}
          <div className="w-24 h-24 mx-auto mb-3 relative">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-spin"
              style={{ animationDuration: '4s' }}
            />
            <div className="absolute inset-1 bg-gradient-to-br from-purple-900/90 to-indigo-900/80 rounded-full backdrop-blur-lg border border-white/30" />

            <div className="relative w-full h-full p-2 flex items-center justify-center">
              {/* Placeholder Coin/Block Icon (Inline SVG) */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                className="w-12 h-12 text-white drop-shadow-lg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756l-3.375 2.155a1.25 1.25 0 00-.012 2.164l3.375 2.155M2.25 12c0-5.46 4.654-9.923 10.5-9.923 5.845 0 10.5 4.463 10.5 9.923s-4.654 9.924-10.5 9.924C6.904 21.924 2.25 17.46 2.25 12z" />
              </svg>
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

          <button
            onClick={handleContinue}
            className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold px-6 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000 shadow-lg mt-4 flex items-center justify-center text-lg"
          >
            <span className="mr-2">Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockchainWelcome;

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Prince from './Prince';

const BLOCK_POSITIONS = [
  [0, 0, 0],
  [4, 3.5, -2],
  [-3, 7, -4],
  [5, 10.5, -6],
  [1, 14, -8],
];

const BLOCK_COLORS = ['#4a9eff', '#ff6b6b', '#ffd93d', '#6bcb77', '#a855f7'];
const SECTION_LABELS = ['Welcome', 'Skills', 'Experience', 'Projects', 'Contact'];

function FloatingBlock({ position, color, label, isActive }) {
  const glowRef = useRef();

  useFrame(() => {
    if (glowRef.current) {
      const target = isActive ? 0.6 : 0.15;
      glowRef.current.emissiveIntensity += (target - glowRef.current.emissiveIntensity) * 0.06;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
      <group position={position}>
        {/* Main platform */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[2.8, 0.35, 2.8]} />
          <meshStandardMaterial
            ref={glowRef}
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>

        {/* Platform top surface glow */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[2.6, 0.04, 2.6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Corner pillars */}
        {[[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]].map(([px, pz], i) => (
          <mesh key={i} position={[px, 0.25, pz]}>
            <cylinderGeometry args={[0.06, 0.08, 0.5, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.8 : 0.2}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Floating crystal */}
        <CrystalOrb color={color} isActive={isActive} />

        {/* Section label */}
        <Text
          position={[0, -0.55, 1.6]}
          fontSize={0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>

        {isActive && (
          <Sparkles count={50} scale={4} size={4} speed={1} color={color} opacity={0.9} />
        )}

        <pointLight color={color} intensity={isActive ? 5 : 1.2} distance={isActive ? 14 : 6} />
      </group>
    </Float>
  );
}

const _vec3 = new THREE.Vector3();

function CrystalOrb({ color, isActive }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.8;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      const s = isActive ? 1.3 : 1;
      ref.current.scale.lerp(_vec3.set(s, s, s), 0.05);
    }
  });

  return (
    <group ref={ref} position={[0, 0.6, 0]}>
      <mesh>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial
          color="white"
          emissive={color}
          emissiveIntensity={isActive ? 2 : 0.4}
          metalness={0.2}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {isActive && (
        <pointLight color={color} intensity={3} distance={5} />
      )}
    </group>
  );
}

function AmbientParticles() {
  const ref = useRef();
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 25 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#a78bfa"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function SceneInner({ scrollTarget, onSectionChange }) {
  const { camera } = useThree();
  const princeGroupRef = useRef();
  const smoothProgress = useRef(0);
  const prevSection = useRef(-1);
  const [activeSection, setActiveSection] = useState(0);
  const jumpRef = useRef(0);

  useFrame(() => {
    smoothProgress.current += (scrollTarget.current - smoothProgress.current) * 0.04;
    const progress = smoothProgress.current;

    const total = BLOCK_POSITIONS.length;
    const sectionProg = progress * (total - 1);
    const cur = Math.min(Math.floor(sectionProg), total - 2);
    const nxt = Math.min(cur + 1, total - 1);
    const t = Math.max(0, Math.min(sectionProg - cur, 1));
    jumpRef.current = t;

    const from = BLOCK_POSITIONS[cur];
    const to = BLOCK_POSITIONS[nxt];
    const x = THREE.MathUtils.lerp(from[0], to[0], t);
    const baseY = THREE.MathUtils.lerp(from[1], to[1], t);
    const jumpH = Math.sin(t * Math.PI) * 3;
    const z = THREE.MathUtils.lerp(from[2], to[2], t);
    const py = baseY + jumpH + 1.2;

    if (princeGroupRef.current) {
      princeGroupRef.current.position.set(x, py, z);
      const rotTarget = to[0] > from[0] ? -0.3 : 0.3;
      princeGroupRef.current.rotation.y +=
        (rotTarget - princeGroupRef.current.rotation.y) * 0.05;
      const sq = 1 - Math.sin(t * Math.PI) * 0.12;
      const st = 1 + Math.sin(t * Math.PI) * 0.08;
      princeGroupRef.current.scale.set(sq, st, sq);
    }

    // Camera follow
    camera.position.x += (x + 2 - camera.position.x) * 0.035;
    camera.position.y += (py + 2.5 - camera.position.y) * 0.035;
    camera.position.z += (z + 14 - camera.position.z) * 0.035;
    camera.lookAt(x, baseY + 1.5, z);

    // Section change
    const section = t < 0.5 ? cur : nxt;
    if (section !== prevSection.current) {
      prevSection.current = section;
      setActiveSection(section);
      onSectionChange(section);
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#b0c4ff" />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#fff5e6" />
      <directionalLight position={[-8, 12, -5]} intensity={0.25} color="#8b5cf6" />

      <Stars radius={120} depth={80} count={5000} factor={5} saturation={0.2} fade speed={0.5} />
      <AmbientParticles />

      {/* Colored nebula lights */}
      <pointLight position={[-20, 5, -15]} color="#7c3aed" intensity={2} distance={50} />
      <pointLight position={[20, 12, -8]} color="#2563eb" intensity={1.8} distance={45} />
      <pointLight position={[0, 20, -20]} color="#ec4899" intensity={1.2} distance={40} />

      <group ref={princeGroupRef}>
        <Prince jumpProgress={jumpRef.current} />
        <pointLight color="#ffd700" intensity={2} distance={5} />
      </group>

      {BLOCK_POSITIONS.map((pos, i) => (
        <FloatingBlock
          key={i}
          position={pos}
          color={BLOCK_COLORS[i]}
          label={SECTION_LABELS[i]}
          isActive={activeSection === i}
        />
      ))}
    </>
  );
}

export default function Scene3D({ scrollTarget, onSectionChange }) {
  return (
    <Canvas
      camera={{ position: [2, 3, 14], fov: 55 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={['#0a0a1e', 25, 70]} />
      <color attach="background" args={['#0a0a1e']} />
      <SceneInner scrollTarget={scrollTarget} onSectionChange={onSectionChange} />
    </Canvas>
  );
}

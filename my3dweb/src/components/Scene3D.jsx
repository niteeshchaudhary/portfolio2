import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Blocks are laid out on a forward path (deeper into Z) for first-person traversal
const BLOCK_POSITIONS = [
  [0, 0, 0],
  [2, 4, -12],
  [-1.5, 9, -24],
  [2.5, 14, -36],
  [0, 19, -48],
];

const BLOCK_COLORS = ['#4a9eff', '#ff6b6b', '#ffd93d', '#6bcb77', '#a855f7'];
const SECTION_LABELS = ['Welcome', 'Skills', 'Experience', 'Projects', 'Contact'];

const _vec3 = new THREE.Vector3();

function jumpCurve(t) {
  const peak = 0.42;
  const normalized = t < peak ? t / peak : (1 - t) / (1 - peak);
  return Math.pow(Math.sin(Math.min(normalized, 1) * Math.PI * 0.5), 0.9);
}

/* =============================================
   3D SCROLL on each block
   ============================================= */
function ScrollObject({ color, isActive, isOpen }) {
  const groupRef = useRef();
  const sealRef = useRef();
  const paperRef = useRef();

  useFrame((state) => {
    const et = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const targetY = isOpen ? 1.6 : isActive ? 1.0 : 0.35;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;

    if (!isOpen) {
      groupRef.current.rotation.y = et * (isActive ? 0.6 : 0.25);
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06;
    }

    const s = isOpen ? 1.6 : isActive ? 1.25 : 1;
    groupRef.current.scale.lerp(_vec3.set(s, s, s), 0.04);

    if (sealRef.current) {
      const ei = isOpen ? 4 : isActive ? 2 : 0.3;
      sealRef.current.emissiveIntensity += (ei - sealRef.current.emissiveIntensity) * 0.06;
    }
    if (paperRef.current) {
      const ps = isOpen ? 1 : 0;
      paperRef.current.scale.y += (ps - paperRef.current.scale.y) * 0.06;
      paperRef.current.scale.x += (ps - paperRef.current.scale.x) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.35, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 14]} />
        <meshStandardMaterial color="#d4b896" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0, -0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.14, 6]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, -0.4]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.14, 6]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 10]} />
        <meshStandardMaterial ref={sealRef} color="#8B1A1A" emissive="#ff3333" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.01, 4, 20]} />
        <meshStandardMaterial color="#8B1A1A" roughness={0.6} />
      </mesh>

      <group ref={paperRef} position={[0, 0.3, 0]} scale={[0, 0, 1]}>
        <mesh>
          <planeGeometry args={[0.6, 0.5]} />
          <meshStandardMaterial color="#f5e6d0" emissive="#f5e6d0" emissiveIntensity={0.15} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
          <mesh key={i} position={[0, y, 0.001]}>
            <planeGeometry args={[0.45, 0.015]} />
            <meshStandardMaterial color="#a08060" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      <pointLight color={isOpen ? '#ffd700' : color} intensity={isOpen ? 6 : isActive ? 3 : 0.5} distance={isOpen ? 10 : 5} />
      {isActive && (
        <Sparkles count={isOpen ? 50 : 25} scale={isOpen ? 3 : 2} size={isOpen ? 5 : 3} speed={isOpen ? 2 : 0.8} color="#ffd700" opacity={0.9} />
      )}
    </group>
  );
}

/* =============================================
   FLOATING BLOCK (platform)
   ============================================= */
function FloatingBlock({ position, color, label, isActive, isContentOpen }) {
  const glowRef = useRef();
  const lightRef = useRef();

  useFrame(() => {
    if (glowRef.current) {
      const tgt = isActive ? 0.7 : 0.12;
      glowRef.current.emissiveIntensity += (tgt - glowRef.current.emissiveIntensity) * 0.05;
    }
    if (lightRef.current) {
      lightRef.current.intensity += ((isActive ? 6 : 1) - lightRef.current.intensity) * 0.06;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.2}>
      <group position={position}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[3.2, 0.4, 3.2]} />
          <meshStandardMaterial
            ref={glowRef}
            color={new THREE.Color(color).multiplyScalar(0.5)}
            emissive={color}
            emissiveIntensity={0.12}
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2.9, 0.06, 2.9]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.5 : 0.1} metalness={0.5} roughness={0.4} transparent opacity={0.5} />
        </mesh>

        {/* Edge runes */}
        {[[0, 1.5, 0], [0, -1.5, 0], [1.5, 0, Math.PI / 2], [-1.5, 0, Math.PI / 2]].map(([ex, ez, ry], i) => (
          <mesh key={i} position={[ex, -0.05, ez]} rotation={[0, ry || 0, 0]}>
            <boxGeometry args={[2.6, 0.08, 0.06]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 1.2 : 0.15} transparent opacity={0.7} />
          </mesh>
        ))}

        {/* Corner pillars */}
        {[[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].map(([px, pz], i) => (
          <group key={i} position={[px, 0.1, pz]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.1, 0.6, 6]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.9 : 0.15} metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="white" emissive={color} emissiveIntensity={isActive ? 2 : 0.3} />
            </mesh>
          </group>
        ))}

        <ScrollObject color={color} isActive={isActive} isOpen={isActive && isContentOpen} />

        <Text position={[0, -0.6, 1.8]} fontSize={0.26} color="white" anchorX="center" anchorY="middle" outlineWidth={0.025} outlineColor="#000000">
          {label}
        </Text>

        {isActive && !isContentOpen && (
          <Sparkles count={40} scale={5} size={3} speed={0.8} color={color} opacity={0.7} />
        )}

        <pointLight ref={lightRef} color={color} intensity={1} distance={12} />
      </group>
    </Float>
  );
}

/* =============================================
   LANDING IMPACT RING
   ============================================= */
function LandingImpact({ pos, intensity }) {
  const ref = useRef();
  const matRef = useRef();
  const scaleRef = useRef(0);

  useFrame(() => {
    scaleRef.current += ((intensity > 0.02 ? 5 : 0) - scaleRef.current) * (intensity > 0.02 ? 0.12 : 0.15);
    if (ref.current) {
      ref.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
      ref.current.position.set(pos[0], pos[1] - 1.5, pos[2]);
    }
    if (matRef.current) matRef.current.opacity = intensity * 0.5;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.6, 1.2, 32]} />
      <meshBasicMaterial ref={matRef} color="#ffd700" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* =============================================
   AMBIENT PARTICLES
   ============================================= */
function AmbientParticles() {
  const ref = useRef();
  const count = 250;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = Math.random() * 35 - 5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return p;
  }, []);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.008; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#a78bfa" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* =============================================
   FIRST-PERSON SCENE
   ============================================= */
function SceneInner({ scrollTarget, onSectionChange, isContentOpen }) {
  const { camera } = useThree();
  const smoothProgress = useRef(0);
  const prevSection = useRef(-1);
  const [activeSection, setActiveSection] = useState(0);
  const playerPos = useRef([0, 1.7, 0]);

  // Smooth look target for first-person
  const lookTarget = useRef(new THREE.Vector3(0, 2, -12));

  // Landing effects
  const prevJumpH = useRef(0);
  const shakeAmount = useRef(0);
  const landingIntensity = useRef(0);

  useFrame((state) => {
    if (!isContentOpen) {
      smoothProgress.current += (scrollTarget.current - smoothProgress.current) * 0.035;
    }
    const progress = smoothProgress.current;
    const et = state.clock.elapsedTime;

    const total = BLOCK_POSITIONS.length;
    const sp = progress * (total - 1);
    const cur = Math.min(Math.floor(sp), total - 2);
    const nxt = Math.min(cur + 1, total - 1);
    const t = Math.max(0, Math.min(sp - cur, 1));

    const from = BLOCK_POSITIONS[cur];
    const to = BLOCK_POSITIONS[nxt];

    const x = THREE.MathUtils.lerp(from[0], to[0], t);
    const baseY = THREE.MathUtils.lerp(from[1], to[1], t);
    const jumpH = jumpCurve(t) * 5;
    const z = THREE.MathUtils.lerp(from[2], to[2], t);
    const eyeY = baseY + jumpH + 1.7;

    playerPos.current = [x, eyeY, z];

    // Landing detection
    if (prevJumpH.current > 2 && jumpH < 1) {
      shakeAmount.current = 0.18;
      landingIntensity.current = 1;
    }
    prevJumpH.current = jumpH;
    shakeAmount.current *= 0.85;
    landingIntensity.current *= 0.9;

    // === FIRST-PERSON CAMERA POSITION ===
    camera.position.set(x, eyeY, z);

    // Head bob: subtle during idle, pronounced during jump
    const ji = jumpCurve(t);
    if (ji > 0.05) {
      camera.position.x += Math.sin(et * 14) * 0.04 * ji;
      camera.position.y += Math.abs(Math.sin(et * 10)) * 0.03 * ji;
    } else {
      camera.position.y += Math.sin(et * 1.5) * 0.015;
      camera.position.x += Math.sin(et * 0.6) * 0.008;
    }

    // Camera shake on landing
    if (shakeAmount.current > 0.01) {
      camera.position.x += (Math.random() - 0.5) * shakeAmount.current;
      camera.position.y += (Math.random() - 0.5) * shakeAmount.current * 0.7;
    }

    // === FIRST-PERSON LOOK DIRECTION ===
    // During jump: look toward landing zone, tilt based on ascent/descent
    // Idle on block: look toward the next block
    const isLastBlock = cur >= total - 2 && t > 0.9;
    let targetX, targetY, targetZ;

    if (isLastBlock) {
      const last = BLOCK_POSITIONS[total - 1];
      targetX = last[0];
      targetY = last[1] + 3;
      targetZ = last[2] - 15;
    } else {
      targetX = to[0];
      targetZ = to[2];
      // Vertical look offset: look up during launch, down during descent
      const verticalPhase = (0.5 - t) * 4;
      targetY = to[1] + 2 + verticalPhase;
    }

    lookTarget.current.x += (targetX - lookTarget.current.x) * 0.025;
    lookTarget.current.y += (targetY - lookTarget.current.y) * 0.025;
    lookTarget.current.z += (targetZ - lookTarget.current.z) * 0.025;

    camera.lookAt(lookTarget.current);

    // Dynamic FOV: wider base for FPS, even wider during jumps
    const targetFov = 78 + ji * 15;
    camera.fov += (targetFov - camera.fov) * 0.04;
    camera.updateProjectionMatrix();

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
      {/* === LIGHTING === */}
      <ambientLight intensity={0.15} color="#7080b0" />
      <directionalLight position={[8, 30, 5]} intensity={0.6} color="#ffe8d0" />
      <directionalLight position={[-10, 20, -15]} intensity={0.25} color="#7c3aed" />
      <hemisphereLight args={['#1a1040', '#050510', 0.25]} />

      {/* === ENVIRONMENT === */}
      <Stars radius={180} depth={120} count={7000} factor={7} saturation={0.15} fade speed={0.3} />
      <AmbientParticles />

      {/* Nebula accent lights */}
      <pointLight position={[-30, 10, -30]} color="#7c3aed" intensity={3} distance={70} />
      <pointLight position={[30, 20, -20]} color="#1d4ed8" intensity={2.5} distance={65} />
      <pointLight position={[5, 30, -50]} color="#db2777" intensity={2} distance={60} />
      <pointLight position={[-15, -5, 10]} color="#0ea5e9" intensity={1.2} distance={45} />

      {/* === LANDING IMPACT === */}
      <LandingImpact pos={playerPos.current} intensity={landingIntensity.current} />

      {/* === BLOCKS with SCROLLS === */}
      {BLOCK_POSITIONS.map((pos, i) => (
        <FloatingBlock
          key={i}
          position={pos}
          color={BLOCK_COLORS[i]}
          label={SECTION_LABELS[i]}
          isActive={activeSection === i}
          isContentOpen={activeSection === i && isContentOpen}
        />
      ))}
    </>
  );
}

/* =============================================
   EXPORTED SCENE3D
   ============================================= */
export default function Scene3D({ scrollTarget, onSectionChange, isContentOpen }) {
  return (
    <Canvas
      camera={{ position: [0, 1.7, 0], fov: 78, near: 0.1, far: 200 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={['#050510', 15, 80]} />
      <color attach="background" args={['#050510']} />
      <SceneInner scrollTarget={scrollTarget} onSectionChange={onSectionChange} isContentOpen={isContentOpen} />
    </Canvas>
  );
}

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Prince from './Prince';

const BLOCK_POSITIONS = [
  [0, 0, 0],
  [4.5, 4, -2.5],
  [-3.5, 8.5, -5],
  [5, 13, -7.5],
  [1, 17.5, -10],
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
   3D SCROLL OBJECT on each block
   ============================================= */
function ScrollObject({ color, isActive, isOpen }) {
  const groupRef = useRef();
  const sealRef = useRef();
  const paperRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    // Rise when active, rise higher when open
    const targetY = isOpen ? 1.4 : isActive ? 0.9 : 0.35;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;

    // Rotation speed depends on state
    const spinSpeed = isOpen ? 0 : isActive ? 0.6 : 0.25;
    if (!isOpen) {
      groupRef.current.rotation.y = t * spinSpeed;
    } else {
      // When open, face forward and tilt like reading
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.06;
    }

    // Scale up when active
    const targetScale = isOpen ? 1.6 : isActive ? 1.25 : 1;
    groupRef.current.scale.lerp(_vec3.set(targetScale, targetScale, targetScale), 0.04);

    // Seal glow
    if (sealRef.current) {
      const targetEmissive = isOpen ? 4 : isActive ? 2 : 0.3;
      sealRef.current.emissiveIntensity += (targetEmissive - sealRef.current.emissiveIntensity) * 0.06;
    }

    // Paper unfurl: scale Y of paper plane
    if (paperRef.current) {
      const targetPaperScale = isOpen ? 1 : 0;
      paperRef.current.scale.y += (targetPaperScale - paperRef.current.scale.y) * 0.06;
      paperRef.current.scale.x += (targetPaperScale - paperRef.current.scale.x) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.35, 0]}>
      {/* Parchment roll (horizontal cylinder) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 14]} />
        <meshStandardMaterial color="#d4b896" roughness={0.65} />
      </mesh>

      {/* Left wooden rod */}
      <mesh position={[0, 0, -0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.14, 6]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, -0.4]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.7} />
      </mesh>

      {/* Right wooden rod */}
      <mesh position={[0, 0, 0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.14, 6]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.7} />
      </mesh>

      {/* Wax seal */}
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 10]} />
        <meshStandardMaterial
          ref={sealRef}
          color="#8B1A1A"
          emissive="#ff3333"
          emissiveIntensity={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Ribbon around the scroll */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.01, 4, 20]} />
        <meshStandardMaterial color="#8B1A1A" roughness={0.6} />
      </mesh>

      {/* Unfurled paper (visible when open) */}
      <group ref={paperRef} position={[0, 0.3, 0]} scale={[0, 0, 1]}>
        <mesh>
          <planeGeometry args={[0.6, 0.5]} />
          <meshStandardMaterial
            color="#f5e6d0"
            emissive="#f5e6d0"
            emissiveIntensity={0.15}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Decorative lines on paper */}
        {[-0.15, -0.05, 0.05, 0.15].map((y, i) => (
          <mesh key={i} position={[0, y, 0.001]}>
            <planeGeometry args={[0.45, 0.015]} />
            <meshStandardMaterial color="#a08060" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Glow light */}
      <pointLight
        color={isOpen ? '#ffd700' : color}
        intensity={isOpen ? 6 : isActive ? 3 : 0.5}
        distance={isOpen ? 10 : 5}
      />

      {/* Sparkles when picked up */}
      {isActive && (
        <Sparkles
          count={isOpen ? 50 : 25}
          scale={isOpen ? 3 : 2}
          size={isOpen ? 5 : 3}
          speed={isOpen ? 2 : 0.8}
          color="#ffd700"
          opacity={0.9}
        />
      )}
    </group>
  );
}

/* =============================================
   FLOATING BLOCK (platform)
   ============================================= */
function FloatingBlock({ position, color, label, isActive, isContentOpen }) {
  const platformRef = useRef();
  const glowRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (glowRef.current) {
      const target = isActive ? 0.7 : 0.12;
      glowRef.current.emissiveIntensity += (target - glowRef.current.emissiveIntensity) * 0.05;
    }
    if (lightRef.current) {
      const tI = isActive ? 6 : 1;
      lightRef.current.intensity += (tI - lightRef.current.intensity) * 0.06;
    }
    if (platformRef.current) {
      platformRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.25}>
      <group position={position}>
        <group ref={platformRef}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[3, 0.4, 3]} />
            <meshStandardMaterial
              ref={glowRef}
              color={new THREE.Color(color).multiplyScalar(0.6)}
              emissive={color}
              emissiveIntensity={0.12}
              metalness={0.3}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[2.7, 0.06, 2.7]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.5 : 0.1}
              metalness={0.5}
              roughness={0.4}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Edge rune carvings */}
          {[
            [0, -0.05, 1.4, 0],
            [0, -0.05, -1.4, 0],
            [1.4, -0.05, 0, Math.PI / 2],
            [-1.4, -0.05, 0, Math.PI / 2],
          ].map(([x, y, z, ry], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[0, ry, 0]}>
              <boxGeometry args={[2.4, 0.08, 0.06]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isActive ? 1.2 : 0.15}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}

          {/* Corner pillars */}
          {[[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]].map(([px, pz], i) => (
            <group key={i} position={[px, 0.1, pz]}>
              <mesh>
                <cylinderGeometry args={[0.07, 0.1, 0.6, 6]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isActive ? 0.9 : 0.15}
                  metalness={0.5}
                  roughness={0.5}
                />
              </mesh>
              <mesh position={[0, 0.35, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="white" emissive={color} emissiveIntensity={isActive ? 2 : 0.3} />
              </mesh>
            </group>
          ))}
        </group>

        {/* SCROLL on the block */}
        <ScrollObject
          color={color}
          isActive={isActive}
          isOpen={isActive && isContentOpen}
        />

        <Text
          position={[0, -0.6, 1.7]}
          fontSize={0.24}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.025}
          outlineColor="#000000"
        >
          {label}
        </Text>

        {isActive && !isContentOpen && (
          <Sparkles count={40} scale={4.5} size={3} speed={0.8} color={color} opacity={0.7} />
        )}

        <pointLight ref={lightRef} color={color} intensity={1} distance={10} />
      </group>
    </Float>
  );
}

/* =============================================
   LANDING IMPACT RING
   ============================================= */
function LandingImpact({ princePos, intensity }) {
  const ringRef = useRef();
  const matRef = useRef();
  const scaleRef = useRef(0);

  useFrame(() => {
    if (intensity > 0.02) {
      scaleRef.current += (5 - scaleRef.current) * 0.12;
    } else {
      scaleRef.current += (0 - scaleRef.current) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
      ringRef.current.position.set(princePos[0], princePos[1] - 1, princePos[2]);
    }
    if (matRef.current) {
      matRef.current.opacity = intensity * 0.6;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
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
  const count = 180;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 30 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#a78bfa" transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

/* =============================================
   MAIN SCENE INNER (inside Canvas)
   ============================================= */
function SceneInner({ scrollTarget, onSectionChange, isContentOpen }) {
  const { camera } = useThree();
  const princeGroupRef = useRef();
  const smoothProgress = useRef(0);
  const prevSection = useRef(-1);
  const [activeSection, setActiveSection] = useState(0);
  const jumpRef = useRef(0);
  const princePosRef = useRef([0, 1.4, 0]);

  const prevJumpH = useRef(0);
  const shakeAmount = useRef(0);
  const landingIntensity = useRef(0);

  useFrame(() => {
    // Only move prince if content overlay is NOT open
    if (!isContentOpen) {
      smoothProgress.current += (scrollTarget.current - smoothProgress.current) * 0.035;
    }
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
    const jumpH = jumpCurve(t) * 4;
    const z = THREE.MathUtils.lerp(from[2], to[2], t);
    const py = baseY + jumpH + 1.4;

    princePosRef.current = [x, py, z];

    if (prevJumpH.current > 1.5 && jumpH < 0.8) {
      shakeAmount.current = 0.12;
      landingIntensity.current = 1;
    }
    prevJumpH.current = jumpH;
    shakeAmount.current *= 0.88;
    landingIntensity.current *= 0.92;

    if (princeGroupRef.current) {
      princeGroupRef.current.position.set(x, py, z);
      const dirX = to[0] - from[0];
      const targetRotY = dirX > 0 ? -0.4 : dirX < 0 ? 0.4 : 0;
      princeGroupRef.current.rotation.y += (targetRotY - princeGroupRef.current.rotation.y) * 0.04;
      const ji = jumpCurve(t);
      princeGroupRef.current.scale.set(1 - ji * 0.1, 1 + ji * 0.08, 1 - ji * 0.1);
    }

    // Cinematic camera
    const ji = jumpCurve(t);
    const nOff = { x: 2.5, y: 3, z: 15 };
    const jOff = { x: 1.5, y: 0.5, z: 11 };
    const cX = x + THREE.MathUtils.lerp(nOff.x, jOff.x, ji);
    const cY = py + THREE.MathUtils.lerp(nOff.y, jOff.y, ji);
    const cZ = z + THREE.MathUtils.lerp(nOff.z, jOff.z, ji);

    camera.position.x += (cX - camera.position.x) * 0.03;
    camera.position.y += (cY - camera.position.y) * 0.03;
    camera.position.z += (cZ - camera.position.z) * 0.03;

    if (shakeAmount.current > 0.01) {
      camera.position.x += (Math.random() - 0.5) * shakeAmount.current * 0.6;
      camera.position.y += (Math.random() - 0.5) * shakeAmount.current * 0.4;
    }

    camera.lookAt(x, baseY + jumpH * 0.5 + 2, z);
    const targetFov = 55 + ji * 8;
    camera.fov += (targetFov - camera.fov) * 0.04;
    camera.updateProjectionMatrix();

    const section = t < 0.5 ? cur : nxt;
    if (section !== prevSection.current) {
      prevSection.current = section;
      setActiveSection(section);
      onSectionChange(section);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#8090c0" />
      <directionalLight position={[8, 25, 12]} intensity={0.7} color="#ffe8d0" />
      <directionalLight position={[-10, 15, -8]} intensity={0.3} color="#7c3aed" />
      <hemisphereLight args={['#1a1040', '#0a0a1e', 0.3]} />

      <Stars radius={150} depth={100} count={6000} factor={6} saturation={0.15} fade speed={0.4} />
      <AmbientParticles />

      <pointLight position={[-25, 8, -20]} color="#7c3aed" intensity={2.5} distance={60} />
      <pointLight position={[25, 15, -10]} color="#1d4ed8" intensity={2} distance={55} />
      <pointLight position={[5, 25, -25]} color="#db2777" intensity={1.5} distance={50} />
      <pointLight position={[-10, -5, 5]} color="#0ea5e9" intensity={1} distance={40} />

      <group ref={princeGroupRef}>
        <Prince jumpProgress={jumpRef.current} />
        <pointLight color="#ffd700" intensity={2.5} distance={6} position={[0, 0.8, 0]} />
        <pointLight color="#ff8c00" intensity={1} distance={3} position={[0, -0.5, 0.5]} />
      </group>

      <LandingImpact princePos={princePosRef.current} intensity={landingIntensity.current} />

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
   EXPORTED SCENE3D COMPONENT
   ============================================= */
export default function Scene3D({ scrollTarget, onSectionChange, isContentOpen }) {
  return (
    <Canvas
      camera={{ position: [2.5, 4, 15], fov: 55 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={['#070714', 20, 75]} />
      <color attach="background" args={['#070714']} />
      <SceneInner
        scrollTarget={scrollTarget}
        onSectionChange={onSectionChange}
        isContentOpen={isContentOpen}
      />
    </Canvas>
  );
}

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

const TOTAL_SECTIONS = 5;
const SECTION_LABELS = ['Welcome', 'Skills', 'Experience', 'Projects', 'Contact'];
const SCROLL_COLORS = ['#4a9eff', '#ff6b6b', '#ffd93d', '#6bcb77', '#a855f7'];

const _vec3 = new THREE.Vector3();

// Closed-loop forest path — control points at ground level
const PATH_POINTS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(18, 0, -12),
  new THREE.Vector3(28, 0, -35),
  new THREE.Vector3(12, 0, -55),
  new THREE.Vector3(-10, 0, -58),
  new THREE.Vector3(-28, 0, -40),
  new THREE.Vector3(-22, 0, -15),
  new THREE.Vector3(-8, 0, 5),
];

const PATH_CURVE = new THREE.CatmullRomCurve3(PATH_POINTS, true, 'catmullrom', 0.5);

// Pre-compute scroll positions along the path (t = 0, 0.2, 0.4, 0.6, 0.8)
const SCROLL_POSITIONS = Array.from({ length: TOTAL_SECTIONS }, (_, i) => {
  const t = i / TOTAL_SECTIONS;
  const p = PATH_CURVE.getPointAt(t);
  return [p.x, p.y, p.z];
});

/* ============================================
   Seeded random for stable procedural placement
   ============================================ */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ============================================
   SCROLL OBJECT (reused from previous version)
   ============================================ */
function ScrollObject({ color, isActive, isOpen }) {
  const groupRef = useRef();
  const sealRef = useRef();
  const paperRef = useRef();

  useFrame((state) => {
    const et = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const targetY = isOpen ? 1.8 : isActive ? 1.2 : 0.6;
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
    <group ref={groupRef} position={[0, 0.6, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 14]} />
        <meshStandardMaterial color="#d4b896" roughness={0.65} />
      </mesh>
      {/* Wooden rods */}
      {[-0.32, 0.32].map((zOff, i) => (
        <group key={i}>
          <mesh position={[0, 0, zOff]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.14, 6]} />
            <meshStandardMaterial color="#3d2b1f" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0, zOff + (i === 0 ? -0.08 : 0.08)]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#3d2b1f" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Wax seal */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 10]} />
        <meshStandardMaterial ref={sealRef} color="#8B1A1A" emissive="#ff3333" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.01, 4, 20]} />
        <meshStandardMaterial color="#8B1A1A" roughness={0.6} />
      </mesh>
      {/* Unfurled paper */}
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

      <pointLight color={isOpen ? '#ffd700' : color} intensity={isOpen ? 6 : isActive ? 3 : 0.5} distance={isOpen ? 12 : 6} />
      {isActive && (
        <Sparkles count={isOpen ? 50 : 25} scale={isOpen ? 3 : 2} size={isOpen ? 5 : 3} speed={isOpen ? 2 : 0.8} color="#ffd700" opacity={0.9} />
      )}
    </group>
  );
}

/* ============================================
   SCROLL CLEARING — pedestal + lanterns + scroll
   ============================================ */
function ScrollClearing({ position, color, label, isActive, isContentOpen }) {
  const lightRef = useRef();

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity += ((isActive ? 8 : 1.5) - lightRef.current.intensity) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Stone pedestal */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.8, 1.0, 0.3, 8]} />
        <meshStandardMaterial color="#555a55" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.2, 1.3, 0.05, 8]} />
        <meshStandardMaterial color="#444844" roughness={0.95} />
      </mesh>

      {/* Lanterns in a ring around the clearing */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const lx = Math.cos(angle) * 3;
        const lz = Math.sin(angle) * 3;
        return (
          <group key={i} position={[lx, 0, lz]}>
            {/* Post */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 1, 6]} />
              <meshStandardMaterial color="#3d2b1f" roughness={0.8} />
            </mesh>
            {/* Lantern glow */}
            <mesh position={[0, 1.05, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isActive ? 3 : 0.6}
                transparent
                opacity={0.8}
              />
            </mesh>
            <pointLight position={[0, 1.1, 0]} color={color} intensity={isActive ? 1.5 : 0.2} distance={6} />
          </group>
        );
      })}

      {/* Scroll object on the pedestal */}
      <group position={[0, 0.3, 0]}>
        <ScrollObject color={color} isActive={isActive} isOpen={isActive && isContentOpen} />
      </group>

      {/* Label */}
      <Text
        position={[0, -0.3, 2.2]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* Clearing glow */}
      <pointLight ref={lightRef} position={[0, 2.5, 0]} color={color} intensity={1.5} distance={15} />

      {isActive && !isContentOpen && (
        <Sparkles count={60} scale={6} size={3} speed={0.6} color={color} opacity={0.6} />
      )}
    </group>
  );
}

/* ============================================
   PINE TREE
   ============================================ */
function PineTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 2.4, 6]} />
        <meshStandardMaterial color="#3d2515" roughness={0.9} />
      </mesh>
      {/* Foliage tiers */}
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[1.2, 2.2, 7]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.8, 0]}>
        <coneGeometry args={[0.9, 1.8, 7]} />
        <meshStandardMaterial color="#1e4220" roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.6, 0]}>
        <coneGeometry args={[0.55, 1.3, 7]} />
        <meshStandardMaterial color="#224a26" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ============================================
   DECIDUOUS TREE
   ============================================ */
function BroadTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.22, 3, 6]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.4, 8, 8]} />
        <meshStandardMaterial color="#1e3a18" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 3.0, 0.4]}>
        <sphereGeometry args={[0.9, 7, 7]} />
        <meshStandardMaterial color="#1a3515" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ============================================
   ROCK
   ============================================ */
function Rock({ position, scale = 1, rotation = 0 }) {
  return (
    <mesh position={position} scale={scale} rotation={[0, rotation, Math.random() * 0.3]}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#4a4f4a" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

/* ============================================
   BUSH
   ============================================ */
function Bush({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.4, 7, 6]} />
        <meshStandardMaterial color="#1a3018" roughness={0.92} />
      </mesh>
      <mesh position={[0.25, 0.2, 0.15]}>
        <sphereGeometry args={[0.3, 6, 5]} />
        <meshStandardMaterial color="#162b14" roughness={0.92} />
      </mesh>
    </group>
  );
}

/* ============================================
   FOREST — all procedural scenery
   ============================================ */
function Forest() {
  const { trees, rocks, bushes } = useMemo(() => {
    const rng = seededRandom(42);
    const treeList = [];
    const rockList = [];
    const bushList = [];

    // Sample points along the path for proximity checks
    const pathSamples = [];
    for (let i = 0; i < 200; i++) {
      const p = PATH_CURVE.getPointAt(i / 200);
      pathSamples.push(p);
    }

    function distToPath(x, z) {
      let min = Infinity;
      for (const p of pathSamples) {
        const dx = p.x - x;
        const dz = p.z - z;
        const d = dx * dx + dz * dz;
        if (d < min) min = d;
      }
      return Math.sqrt(min);
    }

    // Generate trees — avoid the wide path (min 5.5 units away)
    for (let i = 0; i < 80; i++) {
      const x = (rng() - 0.5) * 80;
      const z = (rng() - 0.5) * 80;
      const dist = distToPath(x, z);
      if (dist < 5.5) continue;
      const s = 0.7 + rng() * 0.8;
      const isPine = rng() > 0.35;
      treeList.push({ x, z, scale: s, isPine, key: `tree-${i}` });
    }

    // Generate rocks
    for (let i = 0; i < 25; i++) {
      const x = (rng() - 0.5) * 70;
      const z = (rng() - 0.5) * 70;
      const dist = distToPath(x, z);
      if (dist < 4.5) continue;
      rockList.push({ x, z, scale: 0.4 + rng() * 0.8, rotation: rng() * Math.PI * 2, key: `rock-${i}` });
    }

    // Generate bushes — closer to path (1.5-5 units)
    for (let i = 0; i < 35; i++) {
      const x = (rng() - 0.5) * 70;
      const z = (rng() - 0.5) * 70;
      const dist = distToPath(x, z);
      if (dist < 4.0 || dist > 10) continue;
      bushList.push({ x, z, scale: 0.6 + rng() * 0.7, key: `bush-${i}` });
    }

    return { trees: treeList, rocks: rockList, bushes: bushList };
  }, []);

  return (
    <group>
      {trees.map((t) =>
        t.isPine
          ? <PineTree key={t.key} position={[t.x, 0, t.z]} scale={t.scale} />
          : <BroadTree key={t.key} position={[t.x, 0, t.z]} scale={t.scale} />
      )}
      {rocks.map((r) => (
        <Rock key={r.key} position={[r.x, 0.15, r.z]} scale={r.scale} rotation={r.rotation} />
      ))}
      {bushes.map((b) => (
        <Bush key={b.key} position={[b.x, 0, b.z]} scale={b.scale} />
      ))}
    </group>
  );
}

/* ============================================
   DIRT PATH — flat ribbon along the spline
   ============================================ */
function DirtPath() {
  const geometry = useMemo(() => {
    const segments = 400;
    const halfWidth = 3.0;
    const positions = [];
    const indices = [];
    const uvs = [];
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = PATH_CURVE.getPointAt(t);
      const tangent = PATH_CURVE.getTangentAt(t);
      const perp = new THREE.Vector3().crossVectors(tangent, up).normalize();

      positions.push(
        point.x - perp.x * halfWidth, 0.02, point.z - perp.z * halfWidth,
        point.x + perp.x * halfWidth, 0.02, point.z + perp.z * halfWidth,
      );
      uvs.push(0, t, 1, t);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 2, base + 1);
        indices.push(base + 1, base + 2, base + 3);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#6b5540" roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ============================================
   GROUND PLANE
   ============================================ */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#2a3a28" roughness={1} />
    </mesh>
  );
}

/* ============================================
   FIREFLIES (ambient particles)
   ============================================ */
function Fireflies() {
  const count = 200;
  const positions = useMemo(() => {
    const rng = seededRandom(99);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rng() - 0.5) * 80;
      arr[i * 3 + 1] = 0.5 + rng() * 4;
      arr[i * 3 + 2] = (rng() - 0.5) * 80;
    }
    return arr;
  }, []);

  const ref = useRef();
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.05) * 0.3;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#c8e550" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ============================================
   FIRST-PERSON CAMERA ON SPLINE
   ============================================ */
function ForestScene({ scrollTarget, onSectionChange, isContentOpen }) {
  const { camera } = useThree();
  const smoothProgress = useRef(0);
  const prevSection = useRef(-1);
  const [activeSection, setActiveSection] = useState(0);

  const lookDir = useRef(new THREE.Vector3(0, 0, -1));
  const shakeAmount = useRef(0);
  const stableFrames = useRef(0);
  const candidateSection = useRef(0);

  useFrame((state) => {
    if (!isContentOpen) {
      smoothProgress.current += (scrollTarget.current - smoothProgress.current) * 0.07;
      if (Math.abs(scrollTarget.current - smoothProgress.current) < 0.0005) {
        smoothProgress.current = scrollTarget.current;
      }
    }

    const progress = ((smoothProgress.current % 1) + 1) % 1;
    const et = state.clock.elapsedTime;

    // Position on path
    const pos = PATH_CURVE.getPointAt(progress);
    const eyeHeight = 1.6;

    // Head bob while walking
    const speed = Math.abs(scrollTarget.current - smoothProgress.current);
    const bobIntensity = Math.min(speed * 15, 1);
    const bobY = Math.sin(et * 5) * 0.04 * bobIntensity;
    const bobX = Math.sin(et * 2.5) * 0.02 * bobIntensity;

    camera.position.set(pos.x + bobX, pos.y + eyeHeight + bobY, pos.z);

    // Landing shake
    shakeAmount.current *= 0.9;
    if (shakeAmount.current > 0.005) {
      camera.position.x += (Math.random() - 0.5) * shakeAmount.current;
      camera.position.y += (Math.random() - 0.5) * shakeAmount.current * 0.5;
    }

    // Idle breathing when still
    if (bobIntensity < 0.1) {
      camera.position.y += Math.sin(et * 1.2) * 0.012;
    }

    // Look direction — tangent of the path
    const tangent = PATH_CURVE.getTangentAt(progress);
    const targetLook = new THREE.Vector3(
      pos.x + tangent.x * 8,
      pos.y + eyeHeight + tangent.y * 8,
      pos.z + tangent.z * 8,
    );

    lookDir.current.lerp(targetLook, 0.04);
    camera.lookAt(lookDir.current);

    // FOV
    const targetFov = 72 + bobIntensity * 8;
    camera.fov += (targetFov - camera.fov) * 0.04;
    camera.updateProjectionMatrix();

    // Section detection — use round so the section triggers at the midpoint,
    // not at the exact boundary (which smoothProgress may never precisely reach)
    const section = Math.round(progress * TOTAL_SECTIONS) % TOTAL_SECTIONS;

    if (section === candidateSection.current) {
      stableFrames.current++;
    } else {
      candidateSection.current = section;
      stableFrames.current = 0;
    }

    // Only fire after section is stable for 12 frames (~200ms at 60fps)
    if (stableFrames.current === 12 && section !== prevSection.current) {
      prevSection.current = section;
      setActiveSection(section);
      onSectionChange(section);
      shakeAmount.current = 0.08;
    }
  });

  return (
    <>
      {/* === DUSKY LIGHTING === */}
      <ambientLight intensity={0.32} color="#c4b8a8" />
      <hemisphereLight args={['#87a0c0', '#2a3528', 0.45]} />
      {/* Sun direction (high and to the side) */}
      <directionalLight position={[25, 55, -20]} intensity={0.85} color="#ffeed8" castShadow />
      <directionalLight position={[-15, 25, -15]} intensity={0.2} color="#b8c8e0" />
      {/* Fill so path and forest floor are visible */}
      <pointLight position={[0, 12, -30]} intensity={0.4} color="#e8e0d0" distance={80} />

      {/* === SUN IN SKY === */}
      <mesh position={[28, 52, -25]}>
        <sphereGeometry args={[8, 24, 24]} />
        <meshBasicMaterial color="#ffdd99" fog={false} />
      </mesh>

      {/* === ENVIRONMENT === */}
      <Ground />
      <DirtPath />
      <Forest />
      <Fireflies />

      {/* Global sparkles for depth */}
      <Sparkles count={80} scale={50} size={1.5} speed={0.2} color="#ffcc77" opacity={0.25} />

      {/* === SCROLL CLEARINGS === */}
      {SCROLL_POSITIONS.map((pos, i) => (
        <ScrollClearing
          key={i}
          position={pos}
          color={SCROLL_COLORS[i]}
          label={SECTION_LABELS[i]}
          isActive={activeSection === i}
          isContentOpen={activeSection === i && isContentOpen}
        />
      ))}
    </>
  );
}

/* ============================================
   EXPORTED SCENE3D
   ============================================ */
export default function Scene3D({ scrollTarget, onSectionChange, isContentOpen }) {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 0], fov: 72, near: 0.1, far: 120 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={['#4a5568', 15, 55]} />
      <color attach="background" args={['#3d4a5c']} />
      <ForestScene scrollTarget={scrollTarget} onSectionChange={onSectionChange} isContentOpen={isContentOpen} />
    </Canvas>
  );
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Prince({ jumpProgress = 0 }) {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const capeRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    // Idle bobbing
    groupRef.current.position.y = Math.sin(t * 2) * 0.03;

    // Arm swing
    const swing = Math.sin(t * 3) * 0.2;
    if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;

    // Leg movement during jump
    const legSwing = jumpProgress > 0.05 && jumpProgress < 0.95
      ? Math.sin(t * 8) * 0.4
      : 0;
    if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;

    // Cape wave
    if (capeRef.current) {
      capeRef.current.rotation.x = -0.3 + Math.sin(t * 4) * 0.15;
      capeRef.current.position.z = -0.12 + Math.sin(t * 3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} scale={1.3}>
      {/* Head */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#FFD4B2" roughness={0.8} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 0.76, 0.19]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0.08, 0.76, 0.19]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Eye shine */}
      <mesh position={[-0.065, 0.775, 0.215]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.095, 0.775, 0.215]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.68, 0.2]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.06, 0.012, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>

      {/* Crown base */}
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.19, 0.22, 0.1, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Crown points */}
      {[0, 1.2, 2.4, 3.6, 5.0].map((angle, i) => (
        <mesh key={i} position={[Math.sin(angle) * 0.16, 1.08, Math.cos(angle) * 0.16]}>
          <coneGeometry args={[0.04, 0.14, 4]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.9}
            roughness={0.1}
            emissive="#FFD700"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Crown gem */}
      <mesh position={[0, 1.06, 0.17]}>
        <octahedronGeometry args={[0.035]} />
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Body / Tunic */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.34, 0.45, 0.22]} />
        <meshStandardMaterial color="#7B2FBE" roughness={0.6} />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[0.36, 0.06, 0.24]} />
        <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, 0.13, 0.13]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cape */}
      <mesh ref={capeRef} position={[0, 0.35, -0.12]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.4, 0.6, 4, 8]} />
        <meshStandardMaterial
          color="#C41E3A"
          side={THREE.DoubleSide}
          roughness={0.7}
        />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.24, 0.38, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
          <meshStandardMaterial color="#FFD4B2" roughness={0.8} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.24, 0.38, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
          <meshStandardMaterial color="#FFD4B2" roughness={0.8} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.05, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.055, 0.16, 4, 8]} />
          <meshStandardMaterial color="#2D1B69" roughness={0.8} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.28, 0.03]}>
          <boxGeometry args={[0.1, 0.07, 0.15]} />
          <meshStandardMaterial color="#4A2511" roughness={0.9} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.05, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.055, 0.16, 4, 8]} />
          <meshStandardMaterial color="#2D1B69" roughness={0.8} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.28, 0.03]}>
          <boxGeometry args={[0.1, 0.07, 0.15]} />
          <meshStandardMaterial color="#4A2511" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SKIN = '#B07A4B';
const HAIR = '#1a1206';
const VEST = '#3d2914';
const VEST_INNER = '#5c3a1e';
const PANTS = '#c9b18a';
const SASH = '#8B1A1A';
const WRAPS = '#6b4423';
const BOOTS = '#2c1608';
const METAL = '#8a7d6b';
const BLADE = '#c0c0c0';

function smoothStep(target, current, factor) {
  return current + (target - current) * factor;
}

export default function Prince({ jumpProgress = 0 }) {
  const spineRef = useRef();
  const headRef = useRef();
  const lShoulderRef = useRef();
  const rShoulderRef = useRef();
  const lElbowRef = useRef();
  const rElbowRef = useRef();
  const lHipRef = useRef();
  const rHipRef = useRef();
  const lKneeRef = useRef();
  const rKneeRef = useRef();
  const sashRef = useRef();
  const hairRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const jp = jumpProgress;
    const isJumping = jp > 0.05 && jp < 0.95;
    const jumpSin = Math.sin(jp * Math.PI);

    // Jump phase detection
    const crouch = jp > 0.02 && jp < 0.15;
    const launch = jp >= 0.15 && jp < 0.3;
    const air = jp >= 0.3 && jp < 0.7;
    const descend = jp >= 0.7 && jp < 0.88;
    const land = jp >= 0.88 && jp < 0.98;

    // === SPINE (forward/back lean) ===
    if (spineRef.current) {
      let leanX = Math.sin(t * 0.8) * 0.015;
      if (crouch) leanX = 0.35;
      else if (launch) leanX = -0.2;
      else if (air) leanX = 0.15 + Math.sin(t * 3) * 0.03;
      else if (descend) leanX = 0.05;
      else if (land) leanX = 0.4;
      spineRef.current.rotation.x = smoothStep(leanX, spineRef.current.rotation.x, 0.08);
    }

    // === HEAD ===
    if (headRef.current) {
      let headTilt = Math.sin(t * 0.6) * 0.04;
      if (launch) headTilt = -0.25;
      else if (air) headTilt = 0.1;
      else if (land) headTilt = 0.2;
      headRef.current.rotation.x = smoothStep(headTilt, headRef.current.rotation.x, 0.06);
      headRef.current.rotation.y = isJumping ? 0 : Math.sin(t * 0.4) * 0.08;
    }

    // === LEFT ARM ===
    if (lShoulderRef.current) {
      let angle;
      if (crouch) angle = 0.6;
      else if (launch) angle = -2.2;
      else if (air) angle = -1.4 + Math.sin(t * 4) * 0.1;
      else if (descend) angle = -0.5;
      else if (land) angle = 1.0;
      else angle = Math.sin(t * 1.5) * 0.08 + 0.05;
      lShoulderRef.current.rotation.x = smoothStep(angle, lShoulderRef.current.rotation.x, 0.07);
      lShoulderRef.current.rotation.z = smoothStep(isJumping ? 0.15 : 0.08, lShoulderRef.current.rotation.z, 0.05);
    }
    if (lElbowRef.current) {
      let bend = crouch ? -0.5 : launch ? -0.3 : air ? -0.6 : land ? -0.8 : -0.15;
      lElbowRef.current.rotation.x = smoothStep(bend, lElbowRef.current.rotation.x, 0.07);
    }

    // === RIGHT ARM ===
    if (rShoulderRef.current) {
      let angle;
      if (crouch) angle = 0.5;
      else if (launch) angle = -1.8;
      else if (air) angle = -1.0 + Math.sin(t * 4 + 1) * 0.1;
      else if (descend) angle = -0.3;
      else if (land) angle = 0.8;
      else angle = Math.sin(t * 1.5 + Math.PI) * 0.08 + 0.05;
      rShoulderRef.current.rotation.x = smoothStep(angle, rShoulderRef.current.rotation.x, 0.07);
      rShoulderRef.current.rotation.z = smoothStep(isJumping ? -0.15 : -0.08, rShoulderRef.current.rotation.z, 0.05);
    }
    if (rElbowRef.current) {
      let bend = crouch ? -0.4 : launch ? -0.2 : air ? -0.5 : land ? -0.7 : -0.12;
      rElbowRef.current.rotation.x = smoothStep(bend, rElbowRef.current.rotation.x, 0.07);
    }

    // === LEFT LEG ===
    if (lHipRef.current) {
      let angle;
      if (crouch) angle = 0.7;
      else if (launch) angle = -0.5;
      else if (air) angle = 0.5 + Math.sin(t * 5) * 0.08;
      else if (descend) angle = 0.15;
      else if (land) angle = 0.8;
      else angle = Math.sin(t * 1.2) * 0.03;
      lHipRef.current.rotation.x = smoothStep(angle, lHipRef.current.rotation.x, 0.07);
    }
    if (lKneeRef.current) {
      let bend = crouch ? 1.0 : launch ? 0.15 : air ? 0.5 : land ? 1.1 : 0.05;
      lKneeRef.current.rotation.x = smoothStep(bend, lKneeRef.current.rotation.x, 0.07);
    }

    // === RIGHT LEG ===
    if (rHipRef.current) {
      let angle;
      if (crouch) angle = 0.7;
      else if (launch) angle = -0.4;
      else if (air) angle = -0.3 + Math.sin(t * 5 + 2) * 0.08;
      else if (descend) angle = 0.2;
      else if (land) angle = 0.6;
      else angle = Math.sin(t * 1.2 + Math.PI) * 0.03;
      rHipRef.current.rotation.x = smoothStep(angle, rHipRef.current.rotation.x, 0.07);
    }
    if (rKneeRef.current) {
      let bend = crouch ? 0.9 : launch ? 0.1 : air ? 0.7 : land ? 0.9 : 0.05;
      rKneeRef.current.rotation.x = smoothStep(bend, rKneeRef.current.rotation.x, 0.07);
    }

    // === SASH (flowing behind) ===
    if (sashRef.current) {
      sashRef.current.rotation.x = -0.4 + Math.sin(t * 3) * 0.2 + (isJumping ? jumpSin * 0.5 : 0);
      sashRef.current.rotation.z = Math.sin(t * 2.5) * 0.1;
    }

    // === HAIR (flowing) ===
    if (hairRef.current) {
      hairRef.current.rotation.x = -0.15 + Math.sin(t * 2.8) * 0.08 + (isJumping ? jumpSin * 0.3 : 0);
    }
  });

  return (
    <group scale={1.1}>
      {/* ===== SPINE/TORSO GROUP ===== */}
      <group ref={spineRef} position={[0, 0.72, 0]}>

        {/* Upper torso / chest */}
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.36, 0.3, 0.2]} />
          <meshStandardMaterial color={SKIN} roughness={0.85} />
        </mesh>
        {/* Vest - left panel */}
        <mesh position={[-0.1, 0.28, 0.08]}>
          <boxGeometry args={[0.15, 0.34, 0.08]} />
          <meshStandardMaterial color={VEST} roughness={0.9} />
        </mesh>
        {/* Vest - right panel */}
        <mesh position={[0.1, 0.28, 0.08]}>
          <boxGeometry args={[0.15, 0.34, 0.08]} />
          <meshStandardMaterial color={VEST} roughness={0.9} />
        </mesh>
        {/* Vest back */}
        <mesh position={[0, 0.26, -0.09]}>
          <boxGeometry args={[0.34, 0.32, 0.05]} />
          <meshStandardMaterial color={VEST} roughness={0.9} />
        </mesh>

        {/* Lower torso / abs */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.18]} />
          <meshStandardMaterial color={SKIN} roughness={0.85} />
        </mesh>
        {/* Vest lower trim */}
        <mesh position={[0, 0.05, 0.06]}>
          <boxGeometry args={[0.28, 0.18, 0.06]} />
          <meshStandardMaterial color={VEST_INNER} roughness={0.85} />
        </mesh>

        {/* Belt / sash wrap */}
        <mesh position={[0, -0.07, 0]}>
          <boxGeometry args={[0.34, 0.07, 0.22]} />
          <meshStandardMaterial color={SASH} roughness={0.7} />
        </mesh>
        {/* Belt buckle */}
        <mesh position={[0, -0.07, 0.12]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Sash tail (flowing behind) */}
        <group ref={sashRef} position={[-0.08, -0.1, -0.1]}>
          <mesh position={[0, -0.2, -0.05]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.1, 0.4, 0.02]} />
            <meshStandardMaterial color={SASH} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* ===== NECK + HEAD ===== */}
        <group ref={headRef} position={[0, 0.48, 0]}>
          {/* Neck */}
          <mesh position={[0, -0.03, 0]}>
            <cylinderGeometry args={[0.06, 0.07, 0.08, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.85} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color={SKIN} roughness={0.8} />
          </mesh>
          {/* Jaw / chin */}
          <mesh position={[0, 0.03, 0.06]}>
            <boxGeometry args={[0.12, 0.08, 0.08]} />
            <meshStandardMaterial color={SKIN} roughness={0.8} />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.045, 0.12, 0.11]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          <mesh position={[0.045, 0.12, 0.11]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          {/* Pupils */}
          <mesh position={[-0.045, 0.12, 0.13]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.045, 0.12, 0.13]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Eyebrows */}
          <mesh position={[-0.045, 0.15, 0.12]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.04, 0.008, 0.015]} />
            <meshStandardMaterial color={HAIR} />
          </mesh>
          <mesh position={[0.045, 0.15, 0.12]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.04, 0.008, 0.015]} />
            <meshStandardMaterial color={HAIR} />
          </mesh>

          {/* Hair - top */}
          <mesh position={[0, 0.17, -0.02]}>
            <sphereGeometry args={[0.135, 12, 12]} />
            <meshStandardMaterial color={HAIR} roughness={0.95} />
          </mesh>
          {/* Hair - flowing back */}
          <group ref={hairRef} position={[0, 0.08, -0.1]}>
            <mesh position={[0, -0.08, -0.04]}>
              <boxGeometry args={[0.22, 0.2, 0.04]} />
              <meshStandardMaterial color={HAIR} roughness={0.95} />
            </mesh>
            <mesh position={[0, -0.2, -0.06]}>
              <boxGeometry args={[0.18, 0.12, 0.03]} />
              <meshStandardMaterial color={HAIR} roughness={0.95} />
            </mesh>
          </group>
          {/* Hair - sides */}
          <mesh position={[-0.12, 0.08, 0.01]}>
            <boxGeometry args={[0.04, 0.12, 0.08]} />
            <meshStandardMaterial color={HAIR} roughness={0.95} />
          </mesh>
          <mesh position={[0.12, 0.08, 0.01]}>
            <boxGeometry args={[0.04, 0.12, 0.08]} />
            <meshStandardMaterial color={HAIR} roughness={0.95} />
          </mesh>

          {/* Headband */}
          <mesh position={[0, 0.13, 0.03]}>
            <cylinderGeometry args={[0.137, 0.137, 0.025, 16]} />
            <meshStandardMaterial color={SASH} roughness={0.6} />
          </mesh>
        </group>

        {/* ===== LEFT ARM ===== */}
        <group ref={lShoulderRef} position={[-0.22, 0.36, 0]}>
          {/* Shoulder cap */}
          <mesh position={[-0.02, 0.02, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={VEST} roughness={0.8} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[0, -0.1, 0]}>
            <capsuleGeometry args={[0.045, 0.16, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.85} />
          </mesh>
          {/* Elbow joint */}
          <group ref={lElbowRef} position={[0, -0.22, 0]}>
            {/* Forearm */}
            <mesh position={[0, -0.1, 0]}>
              <capsuleGeometry args={[0.04, 0.14, 4, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.85} />
            </mesh>
            {/* Arm wrap */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.1, 8]} />
              <meshStandardMaterial color={WRAPS} roughness={0.85} />
            </mesh>
            {/* Wrist guard */}
            <mesh position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.046, 0.05, 0.06, 8]} />
              <meshStandardMaterial color={WRAPS} roughness={0.7} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.2, 0.01]}>
              <boxGeometry args={[0.05, 0.06, 0.03]} />
              <meshStandardMaterial color={SKIN} roughness={0.85} />
            </mesh>
          </group>
        </group>

        {/* ===== RIGHT ARM ===== */}
        <group ref={rShoulderRef} position={[0.22, 0.36, 0]}>
          <mesh position={[0.02, 0.02, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={VEST} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <capsuleGeometry args={[0.045, 0.16, 4, 8]} />
            <meshStandardMaterial color={SKIN} roughness={0.85} />
          </mesh>
          <group ref={rElbowRef} position={[0, -0.22, 0]}>
            <mesh position={[0, -0.1, 0]}>
              <capsuleGeometry args={[0.04, 0.14, 4, 8]} />
              <meshStandardMaterial color={SKIN} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.1, 8]} />
              <meshStandardMaterial color={WRAPS} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.046, 0.05, 0.06, 8]} />
              <meshStandardMaterial color={WRAPS} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.2, 0.01]}>
              <boxGeometry args={[0.05, 0.06, 0.03]} />
              <meshStandardMaterial color={SKIN} roughness={0.85} />
            </mesh>
          </group>
        </group>

        {/* ===== DAGGER on back ===== */}
        <group position={[0.06, 0.2, -0.14]} rotation={[0.1, 0, -0.2]}>
          {/* Scabbard */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.025, 0.25, 0.018]} />
            <meshStandardMaterial color="#1a0f08" roughness={0.9} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.015, 0.012, 0.08, 6]} />
            <meshStandardMaterial color={WRAPS} roughness={0.7} />
          </mesh>
          {/* Guard */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.06, 0.012, 0.025]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Pommel */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ===== LEFT LEG ===== */}
      <group ref={lHipRef} position={[-0.09, 0.65, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.16, 0]}>
          <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
          <meshStandardMaterial color={PANTS} roughness={0.8} />
        </mesh>
        {/* Knee joint */}
        <group ref={lKneeRef} position={[0, -0.32, 0]}>
          {/* Lower leg */}
          <mesh position={[0, -0.14, 0]}>
            <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
            <meshStandardMaterial color={PANTS} roughness={0.8} />
          </mesh>
          {/* Knee wrap */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.08, 0.06, 0.06]} />
            <meshStandardMaterial color={WRAPS} roughness={0.8} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.27, 0]}>
            <cylinderGeometry args={[0.05, 0.055, 0.1, 8]} />
            <meshStandardMaterial color={BOOTS} roughness={0.9} />
          </mesh>
          {/* Boot sole */}
          <mesh position={[0, -0.33, 0.02]}>
            <boxGeometry args={[0.07, 0.04, 0.12]} />
            <meshStandardMaterial color={BOOTS} roughness={0.95} />
          </mesh>
        </group>
      </group>

      {/* ===== RIGHT LEG ===== */}
      <group ref={rHipRef} position={[0.09, 0.65, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
          <meshStandardMaterial color={PANTS} roughness={0.8} />
        </mesh>
        <group ref={rKneeRef} position={[0, -0.32, 0]}>
          <mesh position={[0, -0.14, 0]}>
            <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
            <meshStandardMaterial color={PANTS} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.08, 0.06, 0.06]} />
            <meshStandardMaterial color={WRAPS} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.27, 0]}>
            <cylinderGeometry args={[0.05, 0.055, 0.1, 8]} />
            <meshStandardMaterial color={BOOTS} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.33, 0.02]}>
            <boxGeometry args={[0.07, 0.04, 0.12]} />
            <meshStandardMaterial color={BOOTS} roughness={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

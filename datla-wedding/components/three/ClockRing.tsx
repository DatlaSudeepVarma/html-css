"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import { isLowPowerDevice } from "@/lib/webgl";

const HOUR_ANGLE = ((9 + 6 / 60) / 12) * Math.PI * 2;
const MINUTE_ANGLE = (6 / 60) * Math.PI * 2;
const GOLD = { color: "#D4A341", metalness: 1, roughness: 0.25, envMapIntensity: 1.3 } as const;

interface ClockRingProps {
  /** 0–1 scroll progress through the section, written by ScrollTrigger. */
  progress: MutableRefObject<number>;
  reducedMotion: boolean;
  active: boolean;
}

function Rings({ progress, reducedMotion, lite }: Omit<ClockRingProps, "active"> & { lite: boolean }) {
  const root = useRef<Group>(null);
  const outer = useRef<Group>(null);
  const middle = useRef<Group>(null);
  const hour = useRef<Group>(null);
  const minute = useRef<Group>(null);

  // Each tick and bead is a draw call; phones get the 12 major ticks and fewer, coarser beads.
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => i).filter((i) => !lite || i % 5 === 0), [lite]);
  const beadCount = lite ? 18 : 27;
  const beads = useMemo(() => Array.from({ length: beadCount }, (_, i) => (i / beadCount) * Math.PI * 2), [beadCount]);
  const seg = lite ? { radial: 12, tubular: 64, sphere: 8, circle: 48 } : { radial: 24, tubular: 128, sphere: 12, circle: 96 };

  useFrame(({ clock }, dt) => {
    const t = reducedMotion ? 0 : clock.elapsedTime;
    const p = progress.current;
    // Hands sweep from 12:00 to 09:06 during the first half of the section.
    const sweep = reducedMotion ? 1 : MathUtils.smoothstep(p, 0.05, 0.5);
    if (hour.current) hour.current.rotation.z = MathUtils.damp(hour.current.rotation.z, -HOUR_ANGLE * sweep, 6, dt);
    if (minute.current) minute.current.rotation.z = MathUtils.damp(minute.current.rotation.z, -(MINUTE_ANGLE + Math.PI * 18) * sweep, 6, dt);
    if (outer.current) outer.current.rotation.set(t * 0.35 + p * 3, t * 0.2, 0);
    if (middle.current) middle.current.rotation.set(0, t * 0.45 + p * 4, t * 0.1);
    if (root.current) root.current.rotation.y = Math.sin(t * 0.4) * 0.18 + (p - 0.5) * 0.6;
  });

  return (
    <group ref={root} rotation={[-0.12, 0, 0]}>
      <group ref={outer}>
        <mesh>
          <torusGeometry args={[1.62, 0.055, seg.radial, seg.tubular]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
        {beads.map((a) => (
          <mesh key={a} position={[Math.cos(a) * 1.62, Math.sin(a) * 1.62, 0]}>
            <sphereGeometry args={[0.07, seg.sphere, seg.sphere]} />
            <meshStandardMaterial {...GOLD} color="#E9C77B" />
          </mesh>
        ))}
      </group>
      <group ref={middle}>
        <mesh>
          <torusGeometry args={[1.38, 0.04, seg.radial, seg.tubular]} />
          <meshStandardMaterial {...GOLD} color="#C9962E" />
        </mesh>
      </group>

      <mesh>
        <torusGeometry args={[1.12, 0.07, seg.radial, seg.tubular]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[1.08, seg.circle]} />
        <meshStandardMaterial color="#F3ECDB" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <ringGeometry args={[0.62, 0.66, seg.circle]} />
        <meshStandardMaterial color="#B8893B" roughness={0.5} metalness={0.4} />
      </mesh>

      {ticks.map((i) => {
        const a = (i / 60) * Math.PI * 2;
        const major = i % 5 === 0;
        const r = major ? 0.9 : 0.95;
        return (
          <mesh key={i} position={[Math.sin(a) * r, Math.cos(a) * r, 0]} rotation={[0, 0, -a]}>
            <boxGeometry args={major ? [0.05, 0.16, 0.02] : [0.015, 0.06, 0.01]} />
            <meshStandardMaterial color={i % 15 === 0 ? "#6B1E1E" : "#3B2314"} />
          </mesh>
        );
      })}

      <group ref={hour} position={[0, 0, 0.03]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.07, 0.5, 0.02]} />
          <meshStandardMaterial color="#6B1E1E" />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.05]}>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.04, 0.76, 0.02]} />
          <meshStandardMaterial color="#3B2314" />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.07]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}

export default function ClockRing({ progress, reducedMotion, active }: ClockRingProps) {
  const isMobile = useMemo(() => isLowPowerDevice(), []);

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 5.4], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: isMobile ? "default" : "high-performance" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} color="#fff1d6" />
      <Rings progress={progress} reducedMotion={reducedMotion} lite={isMobile} />
      <Environment resolution={isMobile ? 64 : 128} frames={1}>
        <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[8, 3, 1]} color="#fff3d6" />
        <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#ffd9a0" />
        <Lightformer intensity={1.4} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#ffd9a0" />
      </Environment>
    </Canvas>
  );
}

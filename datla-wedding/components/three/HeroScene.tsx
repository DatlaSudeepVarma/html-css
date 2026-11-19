"use client";

import { Suspense, useEffect, useMemo, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, useProgress } from "@react-three/drei";
import { MathUtils } from "three";
import {
  CAMERA_FOV,
  CAMERA_Z,
  LAMPS,
  SCENE_FIT_HEIGHT,
  SCENE_FIT_WIDTH,
  SCENE_OFFSET_Y,
  type HeroPhase,
  type ParallaxInput,
} from "./hero/constants";
import { ParallaxLayer } from "./hero/ParallaxLayer";
import { TempleArch } from "./hero/TempleArch";
import { OilLamp } from "./hero/OilLamp";
import { Emblems } from "./hero/Emblems";
import { BackgroundFlorals, ForegroundLotuses } from "./hero/Decor";
import { isLowPowerDevice } from "@/lib/webgl";

export interface HeroSceneProps {
  phase: HeroPhase;
  reducedMotion: boolean;
  parallax: ParallaxInput;
  /** Optimised (AVIF/WebP) image URL, or null for the placeholder art. */
  deitySrc: string | null;
  /** Pauses rendering when the hero is scrolled out of view. */
  active: boolean;
  onProgress: (progress: number) => void;
  onReady: () => void;
}

function ProgressReporter({ onProgress }: { onProgress: (p: number) => void }) {
  const progress = useProgress((s) => s.progress);
  useEffect(() => onProgress(progress), [progress, onProgress]);
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

function CameraRig({ parallax, enabled }: { parallax: ParallaxInput; enabled: boolean }) {
  useFrame(({ camera }, dt) => {
    const x = enabled ? parallax.current.x : 0;
    const y = enabled ? parallax.current.y : 0;
    camera.position.x = MathUtils.damp(camera.position.x, x * 0.35, 3, dt);
    camera.position.y = MathUtils.damp(camera.position.y, -y * 0.25, 3, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Shrinks the composition to fit narrow / portrait viewports. */
function Fit({ children }: { children: ReactNode }) {
  const viewport = useThree((s) => s.viewport);
  const scale = Math.min(1, viewport.width / SCENE_FIT_WIDTH, viewport.height / SCENE_FIT_HEIGHT);
  return (
    <group scale={scale} position={[0, SCENE_OFFSET_Y * scale + (1 - scale) * 0.2, 0]}>
      {children}
    </group>
  );
}

function Scene({ phase, reducedMotion, parallax, deitySrc, isMobile }: HeroSceneProps & { isMobile: boolean }) {
  const parallaxOn = phase === "open" && !reducedMotion;
  const layer = { input: parallax, enabled: parallaxOn };

  return (
    <>
      <CameraRig parallax={parallax} enabled={parallaxOn} />

      <ParallaxLayer depth={-0.25} {...layer}>
        <BackgroundFlorals />
      </ParallaxLayer>

      <Fit>
        <ParallaxLayer depth={0.15} {...layer}>
          <TempleArch deitySrc={deitySrc} />
        </ParallaxLayer>
        <ParallaxLayer depth={0.28} {...layer}>
          <Emblems animate={!reducedMotion} />
        </ParallaxLayer>
        <ParallaxLayer depth={0.32} {...layer}>
          {LAMPS.map((lamp) => (
            <OilLamp key={lamp.seed} position={lamp.position} seed={lamp.seed} simple={isMobile} />
          ))}
        </ParallaxLayer>
        <Sparkles
          count={isMobile ? 14 : 50}
          scale={[4.4, 4.4, 1.5]}
          position={[0, 0.5, 0.4]}
          size={2.2}
          speed={reducedMotion ? 0 : 0.25}
          opacity={0.8}
          color="#F3DFA2"
        />
      </Fit>

      <ParallaxLayer depth={0.6} {...layer}>
        <ForegroundLotuses />
      </ParallaxLayer>
    </>
  );
}

export default function HeroScene(props: HeroSceneProps) {
  const isMobile = useMemo(() => isLowPowerDevice(), []);

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      frameloop={props.active ? "always" : "never"}
      camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: isMobile ? "default" : "high-performance" }}
    >
      <ProgressReporter onProgress={props.onProgress} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 6]} intensity={1.1} color="#fff1d6" />
      <Suspense fallback={null}>
        <Scene {...props} isMobile={isMobile} />
        <Environment resolution={isMobile ? 64 : 128} frames={1}>
          <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[8, 3, 1]} color="#fff3d6" />
          <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#ffd9a0" />
          <Lightformer intensity={1.4} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#ffd9a0" />
          <Lightformer intensity={0.6} position={[0, -3, -4]} scale={[10, 4, 1]} color="#6B1E1E" />
        </Environment>
        <Ready onReady={props.onReady} />
      </Suspense>
    </Canvas>
  );
}

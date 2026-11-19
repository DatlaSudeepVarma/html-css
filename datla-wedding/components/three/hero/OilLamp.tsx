"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  LatheGeometry,
  Vector2,
  type Mesh,
  type PointLight,
} from "three";
import { LAMP_PROFILE, LAMP_SCALE } from "./layout";

const flameVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float h = uv.y;
    p.x += sin(uTime * 6.0 + uSeed) * 0.035 * h * h + sin(uTime * 13.0 + uSeed * 2.0) * 0.012 * h;
    p.y *= 1.0 + 0.07 * sin(uTime * 9.0 + uSeed);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const flameFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;

  #ifdef SIMPLE
  // Mobile: cheap sine wobble instead of value noise.
  float noise(vec2 p) { return 0.5 + 0.5 * sin(p.x * 1.7 + p.y * 2.3) * cos(p.y * 1.3 - p.x * 0.7); }
  #else
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  #endif

  void main() {
    float y = vUv.y;
    float x = (vUv.x - 0.5) * 2.0;
    x += (noise(vec2(y * 4.0, uTime * 3.0 + uSeed)) - 0.5) * 0.35 * y;

    // Teardrop profile: rounded base, tapering tip.
    float width = 0.85 * pow(1.0 - y, 1.3) * sqrt(clamp(y / 0.22, 0.0, 1.0));
    float body = 1.0 - smoothstep(width * 0.55, width, abs(x));
    float core = (1.0 - smoothstep(width * 0.05, width * 0.5, abs(x))) * smoothstep(0.8, 0.15, y);

    vec3 color = mix(vec3(1.0, 0.32, 0.04), vec3(1.0, 0.72, 0.18), smoothstep(0.0, 0.6, body));
    color = mix(color, vec3(1.0, 0.97, 0.82), core);
    color = mix(color, vec3(0.35, 0.45, 1.0), (1.0 - smoothstep(0.0, 0.12, y)) * 0.45 * body);

    float flicker = 0.85 + 0.15 * noise(vec2(uTime * 8.0, uSeed));
    float alpha = body * flicker * smoothstep(1.0, 0.75, y);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

const SIMPLE_DEFINES = { SIMPLE: "" };

function useGlowTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,214,140,0.9)");
    g.addColorStop(0.35, "rgba(255,170,70,0.35)");
    g.addColorStop(1, "rgba(255,140,40,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);
}

function Flame({ seed, simple }: { seed: number; simple: boolean }) {
  const glow = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const glowTex = useGlowTexture();
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSeed: { value: seed } }), [seed]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;
    const f = 0.85 + 0.1 * Math.sin(t * 11 + seed) + 0.05 * Math.sin(t * 23 + seed * 3);
    if (light.current) light.current.intensity = 1.8 * f;
    if (glow.current) glow.current.scale.setScalar(0.9 + 0.15 * f);
  });

  return (
    <group>
      <mesh ref={glow} position={[0, 0.12, 0]} renderOrder={4}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={glowTex} transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.15, 0.02]} renderOrder={5}>
        <planeGeometry args={[0.16, 0.3, 1, 16]} />
        <shaderMaterial
          defines={simple ? SIMPLE_DEFINES : undefined}
          uniforms={uniforms}
          vertexShader={flameVertex}
          fragmentShader={flameFragment}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <pointLight ref={light} position={[0, 0.2, 0.35]} color="#ffb347" distance={3.5} decay={2} />
    </group>
  );
}

interface OilLampProps {
  position: readonly [number, number, number];
  seed?: number;
  scale?: number;
  /** Fewer lathe segments and a cheaper flame shader for phones. */
  simple?: boolean;
}

/** Brass kuthu vilakku (standing oil lamp) with a shader flame. */
export function OilLamp({ position, seed = 1, scale = LAMP_SCALE, simple = false }: OilLampProps) {
  const geometry = useMemo(
    () => new LatheGeometry(LAMP_PROFILE.map(([x, y]) => new Vector2(x, y)), simple ? 24 : 48),
    [simple],
  );

  return (
    <group position={position} scale={scale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#D4A341" metalness={1} roughness={0.28} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[0, 1.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.23, 32]} />
        <meshStandardMaterial color="#7A4A0E" roughness={0.2} metalness={0.3} />
      </mesh>
      <group position={[0, 1.17, 0.08]}>
        <Flame seed={seed} simple={simple} />
      </group>
    </group>
  );
}

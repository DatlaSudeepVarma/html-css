"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import type { ParallaxInput } from "./constants";

interface ParallaxLayerProps {
  /** World units the layer shifts at full input; negative moves against the pointer. */
  depth: number;
  input: ParallaxInput;
  enabled: boolean;
  children: ReactNode;
}

export function ParallaxLayer({ depth, input, enabled, children }: ParallaxLayerProps) {
  const ref = useRef<Group>(null);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const x = enabled ? input.current.x : 0;
    const y = enabled ? input.current.y : 0;
    g.position.x = MathUtils.damp(g.position.x, x * depth, 3.5, dt);
    g.position.y = MathUtils.damp(g.position.y, -y * depth * 0.6, 3.5, dt);
    g.rotation.y = MathUtils.damp(g.rotation.y, x * depth * 0.08, 3.5, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, y * depth * 0.05, 3.5, dt);
  });

  return <group ref={ref}>{children}</group>;
}

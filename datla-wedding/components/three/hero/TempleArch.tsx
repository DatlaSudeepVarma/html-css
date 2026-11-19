"use client";

import { useLayoutEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import type { Texture } from "three";
import { ARCH_H, ARCH_W, ARCH_Y, ART_URL, PORTRAIT_H, PORTRAIT_W, PORTRAIT_Y, prepareTexture } from "./constants";

/** CSS `object-fit: cover`, biased toward the top so faces stay in frame. */
function coverFit(tex: Texture, aspect: number) {
  const { width, height } = tex.image as { width: number; height: number };
  const imageAspect = width / height;
  tex.repeat.set(1, 1);
  tex.offset.set(0, 0);
  if (imageAspect > aspect) {
    tex.repeat.x = aspect / imageAspect;
    tex.offset.x = (1 - tex.repeat.x) / 2;
  } else {
    tex.repeat.y = imageAspect / aspect;
    tex.offset.y = (1 - tex.repeat.y) * 0.75;
  }
}

export function TempleArch({ deitySrc }: { deitySrc: string | null }) {
  const urls = useMemo(() => [ART_URL.arch, deitySrc ?? ART_URL.deityPlaceholder], [deitySrc]);
  const [arch, deity] = useTexture(urls);

  useLayoutEffect(() => {
    prepareTexture(arch);
    prepareTexture(deity);
    coverFit(deity, PORTRAIT_W / PORTRAIT_H);
  }, [arch, deity]);

  return (
    <group>
      <mesh position={[0, PORTRAIT_Y, -0.05]} renderOrder={1}>
        <planeGeometry args={[PORTRAIT_W, PORTRAIT_H]} />
        <meshBasicMaterial map={deity} toneMapped={false} />
      </mesh>
      <mesh position={[0, ARCH_Y, 0]} renderOrder={2}>
        <planeGeometry args={[ARCH_W, ARCH_H]} />
        <meshBasicMaterial map={arch} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

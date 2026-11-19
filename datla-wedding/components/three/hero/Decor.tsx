"use client";

import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";
import { ART_URL, prepareTexture } from "./constants";

const BG_Z = -4;
const FG_Z = 2.5;

export function BackgroundFlorals() {
  const tex = useTexture(ART_URL.florals);
  useLayoutEffect(() => void prepareTexture(tex), [tex]);

  return (
    <mesh position={[0, 0.3, BG_Z]} renderOrder={0}>
      <planeGeometry args={[11, 11]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/** Lotuses anchored to the bottom corners of the viewport, nearest to the camera. */
export function ForegroundLotuses() {
  const tex = useTexture(ART_URL.lotusBloom);
  useLayoutEffect(() => void prepareTexture(tex), [tex]);

  const camera = useThree((s) => s.camera);
  const viewport = useThree((s) => s.viewport);
  const vp = viewport.getCurrentViewport(camera, new Vector3(0, 0, FG_Z));
  const size = Math.min(2.4, vp.width * 0.42);
  const x = vp.width / 2 - size * 0.3;
  const y = -vp.height / 2 + size * 0.3;

  return (
    <>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * x, y, FG_Z]} scale={[side * -1, 1, 1]} renderOrder={6}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} side={DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

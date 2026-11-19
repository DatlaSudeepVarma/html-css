"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import type { Mesh } from "three";
import { ART_URL, EMBLEMS, prepareTexture } from "./constants";

const URLS = EMBLEMS.map(({ key }) => ART_URL[key]);

/** Shankha, Namam and Chakra floating above the arch. */
export function Emblems({ animate }: { animate: boolean }) {
  const maps = useTexture(URLS);
  const chakraRef = useRef<Mesh>(null);

  useLayoutEffect(() => {
    maps.forEach(prepareTexture);
  }, [maps]);

  useFrame((_, dt) => {
    if (animate && chakraRef.current) chakraRef.current.rotation.z -= dt * 0.25;
  });

  return (
    <>
      {EMBLEMS.map(({ key, position, size }, i) => (
        <Float
          key={key}
          position={position}
          speed={animate ? 1.4 + i * 0.2 : 0}
          floatIntensity={animate ? 0.35 : 0}
          rotationIntensity={animate ? 0.15 : 0}
        >
          <mesh ref={key === "chakra" ? chakraRef : undefined} renderOrder={3}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={maps[i]} transparent depthWrite={false} toneMapped={false} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

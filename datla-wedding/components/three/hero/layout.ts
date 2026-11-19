import type { MutableRefObject } from "react";

/** Free of `three` imports so the 2D hero can share the composition without pulling three.js into the main bundle. */

export type HeroPhase = "closed" | "opening" | "open";
export type ParallaxInput = MutableRefObject<{ x: number; y: number }>;

export const CAMERA_FOV = 35;
export const CAMERA_Z = 10;

/** World-space size of the arch; its SVG is 600×800. */
export const ARCH_W = 2.7;
export const ARCH_H = 3.6;
export const ARCH_Y = 0.4;

/** Arch opening spans x 130–470, y 205–740 of the 600×800 SVG; the portrait overfills it slightly. */
export const PORTRAIT_W = ARCH_W * (340 / 600) + 0.06;
export const PORTRAIT_H = ARCH_H * (535 / 800) + 0.06;
export const PORTRAIT_Y = ARCH_Y + ARCH_H / 2 - ARCH_H * (472.5 / 800);

/** Width the composed scene needs at z=0 before it's scaled down for narrow screens. */
export const SCENE_FIT_WIDTH = 5.7;
/** Taller than the composition itself to leave room for the ornate frame and the title overlay. */
export const SCENE_FIT_HEIGHT = 7;
export const SCENE_OFFSET_Y = -0.3;

export const EMBLEMS = [
  { key: "shankha", position: [-1.15, 2.3, 0.2], size: 0.5 },
  { key: "namam", position: [0, 2.62, 0.25], size: 0.58 },
  { key: "chakra", position: [1.15, 2.3, 0.2], size: 0.52 },
] as const;

export const LAMPS = [
  { position: [-1.95, -1.6, 0.5], seed: 1.3 },
  { position: [1.95, -1.6, 0.5], seed: 7.1 },
] as const;
export const LAMP_SCALE = 1.1;

/** Kuthu vilakku lathe profile as [radius, height] pairs. */
export const LAMP_PROFILE: [number, number][] = [
  [0, 0], [0.3, 0], [0.32, 0.03], [0.3, 0.06], [0.2, 0.09], [0.12, 0.13], [0.07, 0.2],
  [0.05, 0.3], [0.045, 0.6], [0.085, 0.64], [0.045, 0.68], [0.045, 0.95], [0.075, 0.98],
  [0.045, 1.01], [0.05, 1.05], [0.1, 1.08], [0.24, 1.13], [0.29, 1.18], [0.28, 1.2],
  [0.22, 1.17], [0, 1.15],
];

export const ART_URL = {
  arch: "/art/arch.svg",
  doorTall: "/art/door-tall.svg",
  doorWide: "/art/door-wide.svg",
  doorTallMirrored: "/art/door-tall-r.svg",
  doorWideMirrored: "/art/door-wide-r.svg",
  shankha: "/art/shankha.svg",
  namam: "/art/namam.svg",
  chakra: "/art/chakra.svg",
  florals: "/art/florals.svg",
  lotusBloom: "/art/lotus-bloom.svg",
  deityPlaceholder: "/art/deity-placeholder.svg",
} as const;

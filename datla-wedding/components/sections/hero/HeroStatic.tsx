import type { CSSProperties } from "react";
import Image from "next/image";
import { GoldSparkles } from "@/components/ornaments/GoldSparkles";
import {
  ARCH_H,
  ARCH_W,
  ARCH_Y,
  ART_URL,
  EMBLEMS,
  LAMP_PROFILE,
  LAMP_SCALE,
  LAMPS,
  PORTRAIT_H,
  PORTRAIT_W,
  PORTRAIT_Y,
} from "@/components/three/hero/layout";
import type { ImageAsset } from "@/lib/images";

/** Lamp SVG height in profile units: the 1.2-unit lamp plus room for the flame. */
const LAMP_VIEW_H = 1.5;
const LAMP_PATH = (() => {
  const pt = (x: number, y: number) => `${x.toFixed(3)},${(LAMP_VIEW_H - y).toFixed(3)}`;
  const right = LAMP_PROFILE.map(([x, y]) => pt(x, y));
  const left = [...LAMP_PROFILE].reverse().map(([x, y]) => pt(-x, y));
  return `M${[...right, ...left].join(" L")}Z`;
})();

/**
 * Positions an element in the 3D scene's world units at z=0. `--u` is the scene's pixels per unit, matching
 * the WebGL camera and its fit-to-viewport scaling so the crossfade to 3D barely moves anything.
 */
const place = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `calc(50% + ${(x - w / 2).toFixed(4)} * var(--u))`,
  top: `calc(50% - ${(y + h / 2).toFixed(4)} * var(--u))`,
  width: `calc(${w.toFixed(4)} * var(--u))`,
  height: `calc(${h.toFixed(4)} * var(--u))`,
});

function Lamp({ index }: { index: number }) {
  const { position } = LAMPS[index];
  const w = 0.7 * LAMP_SCALE;
  const h = LAMP_VIEW_H * LAMP_SCALE;
  const id = `hero-lamp-${index}`;
  return (
    <svg viewBox={`-0.35 0 0.7 ${LAMP_VIEW_H}`} className="absolute overflow-visible" style={place(position[0], position[1] + h / 2, w, h)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" x2="1">
          <stop offset="0" stopColor="#7A5418" />
          <stop offset="0.35" stopColor="#F3DFA2" />
          <stop offset="0.55" stopColor="#D4A341" />
          <stop offset="1" stopColor="#6E4A12" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#FFD68C" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#FFAA46" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FF8C28" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#5A72FF" stopOpacity="0.7" />
          <stop offset="0.15" stopColor="#FFF7D1" />
          <stop offset="0.55" stopColor="#FFB82E" />
          <stop offset="1" stopColor="#FF5208" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="0" cy={LAMP_VIEW_H - 1.29} r="0.4" fill={`url(#${id}-glow)`} className="motion-safe:animate-twinkle" style={{ animationDuration: "2.2s" }} />
      <path d={LAMP_PATH} fill={`url(#${id}-gold)`} stroke="#6E4A12" strokeWidth="0.006" />
      <g className="origin-bottom motion-safe:animate-flicker" style={{ transformBox: "fill-box" }}>
        <path d={`M0 ${LAMP_VIEW_H - 1.17} C-0.08 ${LAMP_VIEW_H - 1.2} -0.07 ${LAMP_VIEW_H - 1.32} 0 ${LAMP_VIEW_H - 1.47} C0.07 ${LAMP_VIEW_H - 1.32} 0.08 ${LAMP_VIEW_H - 1.2} 0 ${LAMP_VIEW_H - 1.17}Z`} fill={`url(#${id}-flame)`} />
      </g>
    </svg>
  );
}

interface HeroStaticProps {
  deity: ImageAsset | null;
  className?: string;
}

/**
 * The hero composition as plain HTML/SVG: the first paint (and LCP) before three.js loads, and the permanent
 * fallback when WebGL is unavailable or the device asks for a lighter experience.
 */
export function HeroStatic({ deity, className = "" }: HeroStaticProps) {
  return (
    <div className={`hero-units pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* eslint-disable @next/next/no-img-element -- static SVG art; next/image adds nothing for vectors */}
      <img
        src={ART_URL.florals}
        alt=""
        className="absolute left-1/2 top-[calc(50%-3.4cqh)] aspect-square w-[124.6cqh] max-w-none -translate-x-1/2 -translate-y-1/2"
      />

      <div className="absolute inset-0 translate-y-[calc(var(--u)*0.2)]">
        <div className="absolute overflow-hidden" style={place(0, PORTRAIT_Y, PORTRAIT_W, PORTRAIT_H)}>
          {deity ? (
            <Image
              src={deity.src}
              width={deity.width}
              height={deity.height}
              placeholder="blur"
              blurDataURL={deity.blurDataURL}
              sizes="(max-width: 768px) 32vw, 240px"
              alt=""
              className="h-full w-full object-cover object-[50%_25%]"
            />
          ) : (
            <img src={ART_URL.deityPlaceholder} alt="" className="h-full w-full object-cover object-[50%_25%]" />
          )}
        </div>
        <img src={ART_URL.arch} alt="" className="absolute" style={place(0, ARCH_Y, ARCH_W, ARCH_H)} />

        {EMBLEMS.map(({ key, position, size }, i) => (
          <div key={key} className="absolute motion-safe:animate-float" style={{ ...place(position[0], position[1], size, size), animationDelay: `${-i * 1.3}s` }}>
            <img src={ART_URL[key]} alt="" className={`h-full w-full ${key === "chakra" ? "motion-safe:animate-[spin_25s_linear_infinite_reverse]" : ""}`} />
          </div>
        ))}

        {LAMPS.map((lamp, i) => (
          <Lamp key={lamp.seed} index={i} />
        ))}

        <div className="absolute" style={place(0, 0.5, 4.4, 4.4)}>
          <GoldSparkles count={12} seed={3} />
        </div>
      </div>

      {[-1, 1].map((side) => (
        <img
          key={side}
          src={ART_URL.lotusBloom}
          alt=""
          className={`absolute bottom-[calc(min(50.75cqh,42cqw)*-0.2)] aspect-square w-[min(50.75cqh,42cqw)] ${
            side < 0 ? "left-[calc(min(50.75cqh,42cqw)*-0.2)]" : "right-[calc(min(50.75cqh,42cqw)*-0.2)] -scale-x-100"
          }`}
        />
      ))}
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}

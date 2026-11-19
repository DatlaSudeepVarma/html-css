"use client";

import { useRef } from "react";
import { MOTION_OK, isLiteMotion, useScrollAnimation } from "@/lib/gsap";
import { useInvitationOpened } from "@/lib/invitation";

const COLORS = [
  ["#F6D3D3", "#C96B7A"],
  ["#FBE3E1", "#E8A3A7"],
  ["#F4C9CD", "#B85A6C"],
  ["#FFE9D6", "#E8A3A7"],
];

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Lotus petals that sweep across the screen as the boundary between two sections scrolls past. */
export function PetalSweep({ count = 18, seed = 3 }: { count?: number; seed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rand = mulberry32(seed);
  const petals = Array.from({ length: count }, () => ({
    top: rand() * 90,
    size: 22 + rand() * 34,
    from: -10 - rand() * 70,
    to: 110 + rand() * 30,
    drift: (rand() - 0.5) * 30,
    spin: 180 + rand() * 360,
  }));

  const opened = useInvitationOpened();

  useScrollAnimation(
    ref,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // One trigger per sweep; per-petal eases keep the stagger without per-petal scroll measurements.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top top", scrub: isLiteMotion() ? 0.45 : 0.8 },
        });
        gsap.utils.toArray<HTMLElement>(".sweep-petal").forEach((el, i) => {
          const p = petals[i];
          tl.fromTo(
            el,
            { x: `${p.from}vw`, y: 0, rotate: 0 },
            { x: `${p.to}vw`, y: `${p.drift}vh`, rotate: p.spin, ease: ["none", "power1.in", "power1.out"][i % 3], duration: 1 },
            0,
          );
        });
      });
    },
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative z-30 h-0 motion-reduce:hidden">
      {/* Off-screen until the guest scrolls, so the petals stay out of the server HTML and hydration. */}
      {opened && (
        <div className="absolute inset-x-0 -top-[40svh] h-[80svh] overflow-hidden">
          <svg width="0" height="0" className="absolute">
            <defs>
              {COLORS.map(([light, deep], k) => (
                <linearGradient key={k} id={`sp-${seed}-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={deep} />
                  <stop offset="1" stopColor={light} />
                </linearGradient>
              ))}
            </defs>
          </svg>
          {petals.map((p, i) => (
            <svg
              key={i}
              viewBox="-12 -44 24 46"
              className="sweep-petal absolute left-0 md:drop-shadow-sm"
              style={{ top: `${p.top}%`, width: p.size, height: p.size * 1.9, transform: `translateX(${p.from}vw)` }}
            >
              <path d="M0 0 C-11 -12 -10 -30 0 -42 C10 -30 11 -12 0 0Z" fill={`url(#sp-${seed}-${i % COLORS.length})`} stroke="#B86A78" strokeWidth=".6" />
              <path d="M0 -2 C-1 -14 -1 -26 0 -38" stroke="#fff" strokeOpacity=".35" strokeWidth=".7" fill="none" />
            </svg>
          ))}
        </div>
      )}
    </div>
  );
}

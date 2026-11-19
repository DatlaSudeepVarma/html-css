"use client";

import { useMemo, type CSSProperties } from "react";

const FILLS = [
  ["#F06A7E", "#C42B45"],
  ["#F6D3D3", "#C96B7A"],
  ["#E8A3A7", "#7E1028"],
  ["#FF8FA3", "#B81D3A"],
];

/** One-shot 1–2s shower of rose petals. Unmount after ~2s. */
export function RoseFall({ count = 26 }: { count?: number }) {
  const roses = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37.7) % 100,
        size: 22 + ((i * 13) % 26),
        delay: (i % 8) * 0.05,
        duration: 1.45 + (i % 5) * 0.1,
        drift: ((i * 17) % 50) - 25,
        spin: ((i * 53) % 420) - 210,
        fill: FILLS[i % FILLS.length],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {roses.map((r, i) => (
        <svg
          key={i}
          viewBox="-12 -44 24 46"
          className="absolute -top-6 drop-shadow-[0_2px_3px_rgba(80,10,20,0.35)]"
          style={
            {
              left: `${r.left}%`,
              width: r.size,
              height: r.size * 1.8,
              "--drift": `${r.drift}vw`,
              "--spin": `${r.spin}deg`,
              animation: `rose-fall ${r.duration}s cubic-bezier(0.32, 0.05, 0.55, 1) ${r.delay}s both`,
            } as CSSProperties
          }
        >
          <defs>
            <linearGradient id={`rf-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={r.fill[0]} />
              <stop offset="1" stopColor={r.fill[1]} />
            </linearGradient>
          </defs>
          <path d="M0 0 C-11 -12 -10 -30 0 -42 C10 -30 11 -12 0 0Z" fill={`url(#rf-${i})`} stroke="#8A1A32" strokeWidth=".6" />
          <path d="M0 -2 C-1 -14 -1 -26 0 -38" stroke="#fff" strokeOpacity=".4" strokeWidth=".7" fill="none" />
        </svg>
      ))}
    </div>
  );
}

"use client";

import { useMemo, type CSSProperties } from "react";

const COLORS = ["#E8A3A7", "#C96B7A", "#F6D3D3", "#F4AE63", "#D4AF6A"];

/** One-shot shower of petals across the viewport. Render it only when motion is allowed. */
export function PetalConfetti({ count = 44 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 10 + Math.random() * 12,
        delay: Math.random() * 0.9,
        duration: 2.6 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 40,
        spin: (Math.random() - 0.5) * 900,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute -top-8 rounded-[60%_0_60%_0] opacity-0 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.12)]"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.3,
              background: p.color,
              "--drift": `${p.drift}vw`,
              "--spin": `${p.spin}deg`,
              animation: `petal-fall ${p.duration}s cubic-bezier(0.3, 0.1, 0.5, 1) ${p.delay}s forwards`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

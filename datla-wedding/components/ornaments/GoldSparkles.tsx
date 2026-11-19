import type { CSSProperties } from "react";

interface GoldSparklesProps {
  count?: number;
  /** Change to get a different deterministic layout. */
  seed?: number;
  className?: string;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR = "M5 0 C5.4 3.4 6.6 4.6 10 5 C6.6 5.4 5.4 6.6 5 10 C4.6 6.6 3.4 5.4 0 5 C3.4 4.6 4.6 3.4 5 0Z";

/** Fills its nearest positioned parent with twinkling gold dust. Seeded so SSR and client match. */
export function GoldSparkles({ count = 30, seed = 7, className = "" }: GoldSparklesProps) {
  const rand = mulberry32(seed);
  const sparkles = Array.from({ length: count }, (_, i) => {
    const star = i % 5 === 0;
    return {
      star,
      style: {
        left: `${(rand() * 100).toFixed(2)}%`,
        top: `${(rand() * 100).toFixed(2)}%`,
        width: `${star ? 8 + rand() * 6 : 2 + rand() * 3}px`,
        animationDelay: `${(-rand() * 6).toFixed(2)}s`,
        animationDuration: `${(2.5 + rand() * 3).toFixed(2)}s`,
      } satisfies CSSProperties,
    };
  });

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {sparkles.map(({ star, style }, i) =>
        star ? (
          <svg
            key={i}
            viewBox="0 0 10 10"
            className="absolute aspect-square opacity-50 drop-shadow-[0_0_3px_rgba(244,215,140,0.9)] motion-safe:animate-twinkle"
            style={style}
          >
            <path d={STAR} fill="#F3DFA2" />
          </svg>
        ) : (
          <span
            key={i}
            className="absolute aspect-square rounded-full bg-[radial-gradient(circle,#FFF4CC_0%,#D4AF6A_45%,transparent_70%)] opacity-50 motion-safe:animate-twinkle"
            style={style}
          />
        ),
      )}
    </div>
  );
}

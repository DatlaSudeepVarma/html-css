import { useId } from "react";

/** Terracotta clay diya with a flickering flame and pulsing glow. */
export function Diya({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#FFD98A" stopOpacity=".85" />
          <stop offset=".5" stopColor="#FFA94D" stopOpacity=".3" />
          <stop offset="1" stopColor="#FF8A3D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF7A1A" />
          <stop offset=".45" stopColor="#FFC447" />
          <stop offset="1" stopColor="#FFF6D8" />
        </linearGradient>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C8642B" />
          <stop offset="1" stopColor="#7A3414" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="38" r="36" fill={`url(#${id}-glow)`} className="origin-[60px_38px] motion-safe:animate-twinkle" style={{ animationDelay: `${delay}s`, animationDuration: "2.4s" }} />
      <g className="origin-[60px_62px] motion-safe:animate-flicker" style={{ animationDelay: `${delay}s` }}>
        <path d="M60 18 C50 36 50 52 60 62 C70 52 70 36 60 18Z" fill={`url(#${id}-flame)`} />
        <path d="M60 38 C56 46 56 54 60 60 C64 54 64 46 60 38Z" fill="#FFFBEA" />
      </g>
      <path d="M14 66 C20 92 100 92 106 66 C90 72 30 72 14 66Z" fill={`url(#${id}-clay)`} stroke="#5A2410" strokeWidth="1.5" />
      <path d="M14 66 C30 72 90 72 106 66 C108 64 112 62 116 60 C104 58 86 62 60 62 C34 62 16 60 10 62 Z" fill="#D9793A" stroke="#5A2410" strokeWidth="1.2" />
      <path d="M30 80 C48 86 72 86 90 80" stroke="#E9C46A" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

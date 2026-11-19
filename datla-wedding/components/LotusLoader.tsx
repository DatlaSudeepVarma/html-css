import { petal } from "@/components/three/art/svg";

const R = 54;
const CIRCUMFERENCE = 2 * Math.PI * R;

function Lotus({ className }: { className: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={`motion-safe:animate-[spin_5s_linear_infinite] ${className}`} aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`o${i}`} d={petal(40, 12)} transform={`rotate(${i * 45})`} fill="#E8A3A7" stroke="#B8893B" strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`i${i}`} d={petal(28, 9)} transform={`rotate(${i * 45 + 22.5})`} fill="#C96B7A" stroke="#B8893B" strokeWidth="1" />
      ))}
      <circle r="8" fill="#B8893B" />
      <circle r="4" fill="#F3DFA2" />
    </svg>
  );
}

interface LotusLoaderProps {
  progress: number;
  label: string;
  /** "sm" is an unobtrusive pill for loading enhancements over already-visible content. */
  size?: "lg" | "sm";
  className?: string;
}

/** Branded loader: a spinning top-view lotus with a progress percentage. */
export function LotusLoader({ progress, label, size = "lg", className = "" }: LotusLoaderProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  if (size === "sm") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={`${label} ${pct}%`}
        className={`flex items-center gap-2 rounded-full border border-gold/60 bg-parchment-light/85 py-1 pl-1.5 pr-3 shadow-card backdrop-blur ${className}`}
      >
        <Lotus className="h-6 w-6" />
        <span className="font-decorative text-xs tabular-nums text-maroon">{pct}%</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-5 ${className}`} role="status" aria-live="polite">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#D9CCAE" strokeWidth="3" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#B8893B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - pct / 100)}
            className="transition-[stroke-dashoffset] duration-300"
          />
        </svg>
        <Lotus className="absolute inset-5" />
      </div>
      <p className="font-decorative text-2xl tabular-nums text-maroon">{pct}%</p>
      <p className="font-body text-sm text-brown/70">{label}</p>
    </div>
  );
}

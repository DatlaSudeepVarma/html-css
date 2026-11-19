"use client";

import { useId } from "react";

type Corner = "tl" | "tr" | "bl" | "br";

const PLACEMENT: Record<Corner, { position: string; mirror: string; delay: string }> = {
  tl: { position: "top-0 left-0", mirror: "", delay: "0s" },
  tr: { position: "top-0 right-0", mirror: "-scale-x-100", delay: "-1.8s" },
  bl: { position: "bottom-0 left-0", mirror: "-scale-y-100", delay: "-3.5s" },
  br: { position: "bottom-0 right-0", mirror: "-scale-100", delay: "-5.2s" },
};

const PETAL = "M0 0 C-11 -12 -10 -30 0 -42 C10 -30 11 -12 0 0Z";
const LEAF = "M0 0 C8 -8 22 -8 30 0 C22 8 8 8 0 0Z";
const BUD = "M0 0 C-6 -6 -5 -15 0 -20 C5 -15 6 -6 0 0Z";

interface LotusCornerProps {
  position: Corner;
  /** Any CSS length; defaults to a responsive size. */
  size?: string;
  /** Use `fixed` to pin to the viewport instead of the nearest positioned parent. */
  fixed?: boolean;
  className?: string;
}

export function LotusCorner({ position, size, fixed = false, className = "" }: LotusCornerProps) {
  const id = useId().replace(/:/g, "");
  const { position: pos, mirror, delay } = PLACEMENT[position];

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} ${pos} ${mirror} z-10 ${
        size ? "" : "h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
      } ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 130 130"
        className="h-full w-full origin-top-left motion-safe:animate-sway"
        style={{ animationDelay: delay }}
      >
        <defs>
          <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C96B7A" />
            <stop offset="1" stopColor="#F6D3D3" />
          </linearGradient>
          <linearGradient id={`${id}-petal-back`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E8A3A7" />
            <stop offset="1" stopColor="#FBE7E4" />
          </linearGradient>
          <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4E5A22" />
            <stop offset="1" stopColor="#7A8B3C" />
          </linearGradient>
        </defs>

        <g fill="none" stroke="#8C6424" strokeWidth="1.3" strokeLinecap="round">
          <path d="M2 6 C40 4 70 14 96 40" />
          <path d="M6 2 C4 40 14 70 40 96" />
          <path d="M4 4 C30 30 50 50 62 62" />
          <path d="M58 16 c6 -8 16 -6 16 2 c0 6 -8 7 -9 2" />
          <path d="M16 58 c-8 6 -6 16 2 16 c6 0 7 -8 2 -9" />
        </g>

        {[
          "translate(28 9) rotate(12)",
          "translate(9 28) rotate(78)",
          "translate(68 22) rotate(42) scale(.75)",
          "translate(22 68) rotate(48) scale(.75)",
        ].map((t) => (
          <g key={t} transform={t}>
            <path d={LEAF} fill={`url(#${id}-leaf)`} stroke="#B8893B" strokeWidth="0.7" />
            <path d="M2 0 H27" stroke="#D4AF6A" strokeWidth="0.5" />
          </g>
        ))}

        {["translate(96 40) rotate(135)", "translate(40 96) rotate(135)"].map((t) => (
          <g key={t} transform={t}>
            <path d={BUD} fill={`url(#${id}-petal)`} stroke="#9E4A5A" strokeWidth="0.6" />
            <path d="M0 0 C-4 -4 -3 -10 0 -13" fill="none" stroke="#9E4A5A" strokeWidth="0.5" />
          </g>
        ))}

        <g transform="translate(64 64) rotate(135)">
          {[-70, 70].map((r) => (
            <path key={r} d={PETAL} transform={`rotate(${r}) scale(.8)`} fill={`url(#${id}-petal-back)`} stroke="#B86A78" strokeWidth="0.6" />
          ))}
          {[-45, 45, -22, 22, 0].map((r) => (
            <path key={r} d={PETAL} transform={`rotate(${r}) scale(${r === 0 ? 1 : 0.92})`} fill={`url(#${id}-petal)`} stroke="#9E4A5A" strokeWidth="0.7" />
          ))}
          <ellipse cx="0" cy="2" rx="13" ry="4" fill="#8C6424" />
          {[-8, -4, 0, 4, 8].map((x) => (
            <circle key={x} cx={x} cy={-6 - (8 - Math.abs(x)) / 2} r="1.3" fill="#E9C46A" />
          ))}
        </g>

        <g fill="#B8893B">
          <circle cx="44" cy="10" r="1.6" />
          <circle cx="10" cy="44" r="1.6" />
          <circle cx="84" cy="28" r="1.4" />
          <circle cx="28" cy="84" r="1.4" />
          <circle cx="4" cy="4" r="2.2" />
        </g>
      </svg>
    </div>
  );
}

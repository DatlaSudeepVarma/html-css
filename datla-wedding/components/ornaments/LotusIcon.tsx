const PALETTES = {
  gold: { outer: "#C79A4A", inner: "#D4AF6A", center: "#F3DFA2", stroke: "#8C6424" },
  pink: { outer: "#E8A3A7", inner: "#C96B7A", center: "#F6D3D3", stroke: "#B8893B" },
} as const;

/** Side-view lotus; sized by `className`. */
export function LotusIcon({ tone = "pink", className = "" }: { tone?: keyof typeof PALETTES; className?: string }) {
  const p = PALETTES[tone];
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g stroke={p.stroke} strokeWidth="0.9" strokeLinejoin="round">
        <path d="M16 24C9 25.5 4 21.5 2 15.5c6 0 11 3.5 14 8.5Z" fill={p.outer} />
        <path d="M16 24c7 1.5 12-2.5 14-8.5-6 0-11 3.5-14 8.5Z" fill={p.outer} />
        <path d="M16 24c-6-3-8.5-9.5-7.5-15 4.5 3 7 9 7.5 15Z" fill={p.inner} />
        <path d="M16 24c6-3 8.5-9.5 7.5-15-4.5 3-7 9-7.5 15Z" fill={p.inner} />
        <path d="M16 3.5c4 6 4.5 14 0 20.5-4.5-6.5-4-14.5 0-20.5Z" fill={p.center} />
      </g>
      <path d="M7 27.5c3 1 15 1 18 0" fill="none" stroke={p.stroke} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

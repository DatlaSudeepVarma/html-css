/** Stand-ins shown until real photos are added to /public/assets. */

export function GarlandPlaceholder({ className = "" }: { className?: string }) {
  const beads = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2;
    return { x: 150 + Math.cos(a) * 92, y: 230 + Math.sin(a) * 120, fill: i % 3 === 0 ? "#C42B45" : i % 2 ? "#F6B820" : "#E07B2A" };
  });

  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <radialGradient id="gp-bg" cx=".5" cy=".35" r=".8">
          <stop offset="0" stopColor="#A3322A" />
          <stop offset=".6" stopColor="#6B1E1E" />
          <stop offset="1" stopColor="#2E0A0A" />
        </radialGradient>
        <radialGradient id="gp-halo">
          <stop offset="0" stopColor="#FFF4CC" stopOpacity=".8" />
          <stop offset="1" stopColor="#D4AF6A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill="url(#gp-bg)" />
      <circle cx="150" cy="120" r="110" fill="url(#gp-halo)" />
      <path d="M115 95 V130 C115 165 185 165 185 130 V95" fill="none" stroke="#FFFDF7" strokeWidth="16" strokeLinecap="round" />
      <path d="M150 98 C143 122 144 148 150 162 C156 148 157 122 150 98Z" fill="#D7261E" />
      {beads.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="11" fill={b.fill} stroke="#7A3414" strokeWidth="1.2" />
      ))}
      <path d="M150 350 l-10 26 h20z" fill="#C42B45" />
    </svg>
  );
}

export function PortraitPlaceholder({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="pp-bg" cx=".5" cy=".35" r=".75">
          <stop offset="0" stopColor="#F3ECDB" />
          <stop offset="1" stopColor="#D9CCAE" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#pp-bg)" />
      <circle cx="100" cy="82" r="34" fill="#B8893B" opacity=".55" />
      <path d="M38 196 C42 140 72 124 100 124 C128 124 158 140 162 196Z" fill="#B8893B" opacity=".55" />
    </svg>
  );
}

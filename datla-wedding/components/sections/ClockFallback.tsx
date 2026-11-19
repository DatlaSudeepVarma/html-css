const HOUR_DEG = ((9 + 6 / 60) / 12) * 360;
const MINUTE_DEG = (6 / 60) * 360;

/** SVG stand-in for the WebGL clock ring: same gold rings and hands, fixed at 09:06. */
export function ClockFallback({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} role="img" aria-label="09:06">
      <defs>
        <linearGradient id="clock-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8C6424" />
          <stop offset="0.3" stopColor="#F3DFA2" />
          <stop offset="0.6" stopColor="#D4A341" />
          <stop offset="1" stopColor="#8C6424" />
        </linearGradient>
      </defs>
      <g className="origin-center motion-safe:animate-[spin_40s_linear_infinite]">
        <circle r="90" fill="none" stroke="url(#clock-gold)" strokeWidth="4" />
        {Array.from({ length: 27 }, (_, i) => {
          const a = (i / 27) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 90} cy={Math.sin(a) * 90} r="4" fill="#E9C77B" stroke="#8C6424" strokeWidth="0.6" />;
        })}
      </g>
      <circle r="77" fill="none" stroke="#C9962E" strokeWidth="2.5" strokeDasharray="3 5" className="origin-center motion-safe:animate-[spin_60s_linear_infinite_reverse]" />
      <circle r="62" fill="#F3ECDB" stroke="url(#clock-gold)" strokeWidth="5" />
      <circle r="35" fill="none" stroke="#B8893B" strokeWidth="2" />
      {Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        return (
          <line
            key={i}
            y1={major ? -46 : -50}
            y2={-55}
            stroke={i % 15 === 0 ? "#6B1E1E" : "#3B2314"}
            strokeWidth={major ? 2.6 : 0.8}
            transform={`rotate(${i * 6})`}
          />
        );
      })}
      <line y1="4" y2="-28" stroke="#6B1E1E" strokeWidth="4" strokeLinecap="round" transform={`rotate(${HOUR_DEG})`} />
      <line y1="6" y2="-42" stroke="#3B2314" strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${MINUTE_DEG})`} />
      <circle r="4.5" fill="url(#clock-gold)" />
    </svg>
  );
}

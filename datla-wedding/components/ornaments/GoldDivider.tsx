interface GoldDividerProps {
  className?: string;
  /** Hide the center flourish for a plainer rule. */
  flourish?: boolean;
}

function Diamond({ size = "h-1.5 w-1.5" }: { size?: string }) {
  return <span className={`${size} shrink-0 rotate-45 bg-gold`} />;
}

export function GoldDivider({ className = "", flourish = true }: GoldDividerProps) {
  return (
    <div aria-hidden className={`flex w-full items-center gap-2 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/70 to-gold" />
      <Diamond size="h-1 w-1" />
      <Diamond />

      {flourish ? (
        <svg viewBox="0 0 120 24" className="h-5 w-24 shrink-0 sm:h-6 sm:w-28">
          <g fill="none" stroke="#B8893B" strokeWidth="1.2" strokeLinecap="round">
            <path d="M52 12 C46 4 34 4 30 11 C33 17 41 16 40 11" />
            <path d="M68 12 C74 4 86 4 90 11 C87 17 79 16 80 11" />
            <path d="M52 12 C46 20 36 20 26 13 H6" />
            <path d="M68 12 C74 20 84 20 94 13 H114" />
          </g>
          <path d="M60 2 L69 12 L60 22 L51 12Z" fill="#B8893B" />
          <path d="M60 6 L65 12 L60 18 L55 12Z" fill="#E8DFC8" />
          <circle cx="60" cy="12" r="2.2" fill="#6B1E1E" />
          <circle cx="22" cy="6" r="1.3" fill="#B8893B" />
          <circle cx="98" cy="6" r="1.3" fill="#B8893B" />
        </svg>
      ) : (
        <Diamond size="h-2 w-2" />
      )}

      <Diamond />
      <Diamond size="h-1 w-1" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/70 to-gold" />
    </div>
  );
}

import type { CSSProperties } from "react";
import { findPublicAsset, IMAGE_EXTENSIONS } from "@/lib/assets";

function CornerRosette({ className }: { className: string }) {
  return (
    <svg
      viewBox="-20 -20 40 40"
      className={`absolute h-[calc(var(--frame-width)*1.9)] w-[calc(var(--frame-width)*1.9)] ${className}`}
      aria-hidden
    >
      <circle r="18.5" fill="#3B2314" stroke="#B8893B" strokeWidth="1.5" />
      <circle r="14" fill="none" stroke="#D4AF6A" strokeWidth="0.6" />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M0 -3 C-3.5 -6 -3 -11 0 -13 C3 -11 3.5 -6 0 -3Z"
          fill="#B8893B"
          transform={`rotate(${i * 45})`}
        />
      ))}
      <circle r="3.2" fill="#6B1E1E" stroke="#D4AF6A" strokeWidth="0.8" />
    </svg>
  );
}

interface OrnateBorderProps {
  /** Override the tile image (otherwise auto-detected, falling back to the SVG pattern). */
  src?: string;
  className?: string;
}

export function OrnateBorder({ src, className = "" }: OrnateBorderProps) {
  // Expected to be a seamless square tile.
  const image = src ?? findPublicAsset("border", IMAGE_EXTENSIONS);
  const style = image ? ({ "--pattern-border": `url(${image})` } as CSSProperties) : undefined;

  const frame =
    "pointer-events-none fixed bottom-[var(--safe-bottom)] left-[var(--safe-left)] right-[var(--safe-right)] top-[var(--safe-top)] z-40";

  return (
    <>
      {/* Phones: a painted frame. The patterned mask is a full-viewport GPU layer and delayed first paint. */}
      <div aria-hidden className={`${frame} border-[var(--frame-width)] border-[#3B2314] md:hidden ${className}`}>
        <div className="absolute inset-0 border-[3px] border-double border-gold" />
        <div className="absolute inset-[6px] border border-maroon/25" />
      </div>
      <div aria-hidden style={style} className={`${frame} hidden md:block ${className}`}>
        <div className="ornate-band absolute inset-0" />
        <div className="absolute inset-[calc(var(--frame-width)+4px)] border-[3px] border-double border-gold" />
        <div className="absolute inset-[calc(var(--frame-width)+10px)] border border-maroon/25" />
        <CornerRosette className="left-[calc(var(--frame-width)/2)] top-[calc(var(--frame-width)/2)] -translate-x-1/2 -translate-y-1/2" />
        <CornerRosette className="right-[calc(var(--frame-width)/2)] top-[calc(var(--frame-width)/2)] -translate-y-1/2 translate-x-1/2" />
        <CornerRosette className="bottom-[calc(var(--frame-width)/2)] left-[calc(var(--frame-width)/2)] -translate-x-1/2 translate-y-1/2" />
        <CornerRosette className="bottom-[calc(var(--frame-width)/2)] right-[calc(var(--frame-width)/2)] translate-x-1/2 translate-y-1/2" />
      </div>
    </>
  );
}

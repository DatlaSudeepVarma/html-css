"use client";

import { useEffect, useState } from "react";
import { LotusIcon } from "@/components/ornaments/LotusIcon";
import { ui } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { isMusicPlaying, subscribeMusic, toggleWeddingMusic } from "@/lib/music";

const BARS = [
  { rest: 0.35, duration: "0.9s", delay: "-0.2s" },
  { rest: 0.6, duration: "0.7s", delay: "-0.5s" },
  { rest: 0.45, duration: "1.1s", delay: "-0.1s" },
  { rest: 0.7, duration: "0.8s", delay: "-0.35s" },
];

export function MusicToggle({ src }: { src: string }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);

  useEffect(() => subscribeMusic(setPlaying), []);
  useEffect(() => setPlaying(isMusicPlaying()), [src]);

  return (
    <button
      type="button"
      data-music-toggle
      onClick={() => toggleWeddingMusic(src)}
      aria-pressed={playing}
      aria-label={t(playing ? ui.musicPause : ui.musicPlay)}
      title={t(playing ? ui.musicPause : ui.musicPlay)}
      className="fixed bottom-[calc(var(--frame-width)+1rem+var(--safe-bottom))] right-[calc(var(--frame-width)+1rem+var(--safe-right))] z-50 flex h-12 items-center gap-2.5 rounded-full border border-gold bg-parchment-light/90 pl-1.5 pr-4 shadow-card backdrop-blur transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-95"
    >
      <span className={`grid h-9 w-9 place-items-center rounded-full bg-maroon ring-1 ring-gold-light ${playing ? "shadow-glow" : ""}`}>
        <LotusIcon className={`h-7 w-7 transition-opacity ${playing ? "motion-safe:animate-sway" : "opacity-70"}`} />
      </span>
      <span className="flex h-5 items-end gap-[3px]" aria-hidden>
        {BARS.map((bar, i) => (
          <span
            key={i}
            className={`h-full w-[3px] origin-bottom rounded-full bg-gold-dark transition-transform ${playing ? "motion-safe:animate-eq" : ""}`}
            style={{ transform: `scaleY(${playing ? bar.rest : 0.2})`, animationDuration: bar.duration, animationDelay: bar.delay }}
          />
        ))}
      </span>
    </button>
  );
}

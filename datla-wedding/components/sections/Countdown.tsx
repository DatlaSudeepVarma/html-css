"use client";

import { useEffect, useRef, useState } from "react";
import { GoldSparkles } from "@/components/ornaments/GoldSparkles";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { ui, wedding } from "@/data/wedding";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, scrollReveal, useScrollAnimation } from "@/lib/gsap";

const TARGET = new Date(wedding.events.muhurtham.dateTime).getTime();
const PLACEHOLDER = "--";

function Half({ value, pos, className = "" }: { value: string; pos: "top" | "bottom"; className?: string }) {
  const top = pos === "top";
  return (
    <div
      className={`absolute inset-x-0 h-1/2 overflow-hidden bg-gradient-to-b from-[#5A1A1A] to-[#3A0E0E] [backface-visibility:hidden] ${
        top ? "top-0 origin-bottom rounded-t-xl" : "bottom-0 origin-top rounded-b-xl"
      } ${className}`}
    >
      <span className={`absolute inset-x-0 flex h-[200%] items-center justify-center ${top ? "top-0" : "bottom-0"}`}>{value}</span>
    </div>
  );
}

/** Split-flap digit card: the old top half falls away, then the new bottom half swings down. */
function FlipCard({ value, label }: { value: string; label: string }) {
  const prevRef = useRef(value);
  const prev = prevRef.current;
  useEffect(() => {
    prevRef.current = value;
  }, [value]);

  return (
    <div className="cd-card flex flex-col items-center gap-2 sm:gap-3">
      <div className="font-decorative relative h-[4.25rem] w-[3.6rem] text-3xl font-bold tabular-nums text-[#F3DFA2] shadow-card [perspective:500px] min-[400px]:h-20 min-[400px]:w-[4.25rem] min-[400px]:text-4xl sm:h-32 sm:w-28 sm:text-6xl">
        <Half value={value} pos="top" />
        <Half value={prev} pos="bottom" />
        <Half key={`t-${value}`} value={prev} pos="top" className="z-10 motion-safe:animate-flip-top motion-reduce:hidden" />
        <Half key={`b-${value}`} value={value} pos="bottom" className="z-10 motion-safe:animate-flip-bottom" />
        <div className="absolute inset-x-0 top-1/2 z-20 h-px bg-black/50" />
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-gold/70" />
      </div>
      <span className="font-body text-xs text-brown sm:text-sm">{label}</span>
    </div>
  );
}

function useRemaining(ticking: boolean) {
  // null until mounted so server and first client render match.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    if (!ticking) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [ticking]);
  return now === null ? null : Math.max(0, TARGET - now);
}

export function Countdown() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const remaining = useRemaining(useInView(root));
  const arrived = remaining === 0;

  const pad = (n: number) => String(n).padStart(2, "0");
  const parts =
    remaining === null
      ? [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER]
      : [
          pad(Math.floor(remaining / 86_400_000)),
          pad(Math.floor(remaining / 3_600_000) % 24),
          pad(Math.floor(remaining / 60_000) % 60),
          pad(Math.floor(remaining / 1000) % 60),
        ];
  const labels = [ui.days, ui.hours, ui.minutes, ui.seconds];

  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: scrollReveal(root.current, { start: "top 75%", end: "center 55%", scrub: 1 }) })
          .from(".cd-title", { opacity: 0, y: 30 })
          .from(".cd-card", { opacity: 0, y: 60, rotateX: -70, transformPerspective: 600, stagger: 0.15 }, "<0.2")
          .from(".cd-arrived", { opacity: 0, scale: 0.8 }, "<");
      });
    },
  );

  return (
    <section ref={root} id="countdown" data-bg="#D6AE66" className="relative overflow-hidden">
      <GoldSparkles count={26} seed={5} />
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-[calc(var(--frame-width)+1rem)] py-[calc(var(--frame-width)+3rem)]">
        <SectionTitle title={wedding.countdown.title} subtitle={`${wedding.events.muhurtham.numericDate} · ${t(wedding.events.muhurtham.displayTime)}`} className="cd-title" />

        {arrived ? (
          <div className="cd-arrived mt-10 text-center">
            <p className="font-heading text-shimmer-gold text-[clamp(2.2rem,7vw,4.5rem)] leading-[1.5]">{t(wedding.countdown.arrived)}</p>
            <p className="font-body mt-2 text-lg text-maroon">{t(wedding.countdown.arrivedSub)}</p>
          </div>
        ) : (
          <div className="mt-10 flex gap-2.5 min-[400px]:gap-3 sm:gap-6" role="timer" aria-live="off">
            {parts.map((value, i) => (
              <FlipCard key={i} value={value} label={t(labels[i])} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

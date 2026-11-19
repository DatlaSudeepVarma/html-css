"use client";

import { useRef, useState } from "react";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { ui, wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, useScrollAnimation } from "@/lib/gsap";

export function KalyanaVedika() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  // The iframe would otherwise swallow wheel/touch scrolling.
  const [mapActive, setMapActive] = useState(false);
  const { venue } = wedding;

  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 50%", scrub: 1 } })
          .from(".ve-title", { opacity: 0, y: 30 })
          .from(".ve-line", { opacity: 0, x: -40, stagger: 0.12 }, "<0.2")
          .fromTo(
            ".ve-map",
            { clipPath: "inset(50% 50% 50% 50% round 24px)" },
            { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.2, ease: "power2.inOut" },
            "<",
          );
      });
    },
  );

  return (
    <section ref={root} id="venue" data-bg="#561616" className="relative">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-[calc(var(--frame-width)+1.25rem)] py-[calc(var(--frame-width)+3rem)]">
        <SectionTitle title={venue.label} tone="light" className="ve-title" />

        <div className="mt-8 grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1fr_1.25fr] md:gap-12">
          <div className="text-center md:text-left">
            <h3 className="ve-line font-heading text-shimmer-gold-light text-[clamp(2rem,6vw,3.25rem)] leading-[1.5]">{t(venue.name)}</h3>
            <GoldDivider flourish={false} className="ve-line mx-auto my-4 max-w-[14rem] md:mx-0" />
            {venue.addressLines.map((line, i) => (
              <p key={i} className="ve-line font-body text-lg text-parchment-light/90">
                {t(line)}
              </p>
            ))}
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ve-line font-heading mt-7 inline-flex items-center gap-2 rounded-full border-2 border-[#F3DFA2] bg-gradient-to-b from-[#F6E3A8] via-gold to-gold-dark px-7 py-3 text-lg text-maroon-dark shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" fill="currentColor" />
              </svg>
              {t(ui.directions)}
            </a>
          </div>

          <div
            className="ve-map relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-gold shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            onMouseLeave={() => setMapActive(false)}
          >
            <iframe
              src={venue.mapsEmbedUrl}
              title={t(venue.name)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`h-full w-full border-0 [filter:sepia(0.2)_saturate(1.1)] ${mapActive ? "" : "pointer-events-none"}`}
            />
            {!mapActive && (
              <button
                type="button"
                onClick={() => setMapActive(true)}
                className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/35 to-transparent pb-4"
              >
                <span className="font-body rounded-full bg-brown-dark/80 px-4 py-1.5 text-sm text-[#F3DFA2]">{t(ui.mapInteract)}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

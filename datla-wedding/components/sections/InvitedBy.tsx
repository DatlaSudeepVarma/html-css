"use client";

import { useRef } from "react";
import Image from "next/image";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { GoldSparkles } from "@/components/ornaments/GoldSparkles";
import { LotusCorner } from "@/components/ornaments/LotusCorner";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { ART_URL } from "@/components/three/hero/layout";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, isLiteMotion, pinScroll, scrollReveal, useScrollAnimation } from "@/lib/gsap";
import type { ImageAsset } from "@/lib/images";

export function InvitedBy({ deity, parents }: { deity: ImageAsset | null; parents: ImageAsset | null }) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: scrollReveal(root.current, { start: "top 80%", end: "top 10%", scrub: 1 }) })
          .from(".ib-title", { opacity: 0, y: 24 })
          .from(".ib-photo", { opacity: 0, y: 20, scale: 0.96 }, "<0.15")
          .from(".ib-names", { opacity: 0, y: 24 }, "<0.2");

        // Last section: on phones it is taller than the screen, so a pin froze the page with the deity still
        // below the fold. Instead the blessing reveal tracks the natural scroll and lands as the page ends.
        const finale = isLiteMotion()
          ? { trigger: root.current, start: "top 45%", end: "bottom bottom", scrub: 0.45 }
          : { trigger: ".ib-pin", ...pinScroll("+=130%") };

        gsap
          .timeline({ scrollTrigger: finale })
          .fromTo(".ib-halo", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" })
          .from(".ib-bless", { opacity: 0, y: 20, duration: 0.6 }, "-=0.25")
          .from(".ib-deity", { opacity: 0, scale: 0.9, y: 28, duration: 1, ease: "power2.out" }, "-=0.15")
          .fromTo(".ib-deity-halo", { opacity: 0, scale: 0.75 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, "<")
          .to({}, { duration: 0.4 });
      });
    },
  );

  return (
    <section ref={root} id="invited-by" data-bg="#421010" className="relative">
      <div className="ib-pin relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[calc(var(--frame-width)+1.5rem)] pt-[calc(var(--frame-width)+2.5rem)] pb-[calc(var(--frame-width)+4.5rem+var(--safe-bottom))] text-center md:pb-[calc(var(--frame-width)+2.5rem)]">
        <GoldSparkles count={40} seed={17} />
        <div className="pointer-events-none absolute inset-[calc(var(--frame-width)+6px)]">
          <LotusCorner position="tl" />
          <LotusCorner position="tr" />
          <LotusCorner position="bl" />
          <LotusCorner position="br" />
        </div>

        <SectionTitle title={wedding.invitedBy.label} tone="light" className="ib-title relative" />

        {parents ? (
          <div className="ib-photo relative mt-5 aspect-square w-[min(68vw,280px)] overflow-hidden rounded-2xl border-4 border-gold shadow-[0_12px_28px_rgba(0,0,0,0.4)] outline outline-1 outline-offset-4 outline-gold/55">
            <Image
              src={parents.src}
              alt={t(wedding.invitedBy.names)}
              fill
              sizes="(max-width: 768px) 68vw, 280px"
              quality={65}
              placeholder="blur"
              blurDataURL={parents.blurDataURL}
              className="object-cover object-[center_22%]"
            />
          </div>
        ) : null}

        <div className="ib-glow relative mt-4">
          <span aria-hidden className="ib-halo pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[min(92vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,220,150,0.38),transparent_70%)] opacity-0" />
          <p className="ib-names relative font-heading text-shimmer-gold-light mx-auto max-w-2xl py-[0.2em] text-[clamp(1.15rem,3.6vw,1.85rem)] leading-[1.65]">
            {t(wedding.invitedBy.names)}
          </p>
        </div>
        <GoldDivider className="relative mx-auto my-4 max-w-xs" />
        <p className="ib-bless font-body relative mx-auto max-w-xl text-base text-parchment-light/90 sm:text-lg">{t(wedding.invitedBy.closingBlessing)}</p>

        <div className="relative mt-5">
          <span aria-hidden className="ib-deity-halo pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(ellipse,rgba(244,215,140,0.55),transparent_68%)] opacity-0" />
          <div className="ib-deity relative aspect-[1.6/2.48] h-[22svh] overflow-hidden rounded-t-full border-4 border-gold shadow-[0_0_40px_rgba(244,215,140,0.35)] sm:h-[28svh]">
          {deity ? (
            <Image
              src={deity.src}
              alt=""
              fill
              sizes="200px"
              quality={65}
              placeholder="blur"
              blurDataURL={deity.blurDataURL}
              className="object-cover object-top"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ART_URL.deityPlaceholder} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
          )}
          </div>
        </div>
      </div>
    </section>
  );
}

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
import { MOTION_OK, useScrollAnimation } from "@/lib/gsap";
import type { ImageAsset } from "@/lib/images";

export function InvitedBy({ deity, parents }: { deity: ImageAsset | null; parents: ImageAsset | null }) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 10%", scrub: 1 } })
          .from(".ib-title", { opacity: 0, y: 30 })
          .from(".ib-photo", { opacity: 0, y: 24, scale: 0.96 }, "<0.15")
          .from(".ib-names", { opacity: 0, y: 24 }, "<0.2");

        gsap
          .timeline({ scrollTrigger: { trigger: ".ib-pin", start: "top top", end: "+=130%", pin: true, scrub: 1 } })
          .fromTo(
            ".ib-glow",
            { filter: "drop-shadow(0px 0px 0px rgba(255,220,150,0))" },
            { filter: "drop-shadow(0px 0px 18px rgba(255,220,150,0.75))", duration: 0.6 },
          )
          .from(".ib-bless", { opacity: 0, y: 20, duration: 0.6 })
          .from(".ib-deity", { opacity: 0, scale: 0.85, filter: "blur(10px)", duration: 1 })
          .to({}, { duration: 0.4 });
      });
    },
  );

  return (
    <section ref={root} id="invited-by" data-bg="#421010" className="relative">
      <div className="ib-pin relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[calc(var(--frame-width)+1.5rem)] py-[calc(var(--frame-width)+2.5rem)] text-center">
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
              placeholder="blur"
              blurDataURL={parents.blurDataURL}
              className="object-cover object-[center_22%]"
            />
          </div>
        ) : null}

        <div className="ib-glow relative mt-4">
          <p className="ib-names font-heading text-shimmer-gold-light mx-auto max-w-2xl py-[0.2em] text-[clamp(1.15rem,3.6vw,1.85rem)] leading-[1.65]">
            {t(wedding.invitedBy.names)}
          </p>
        </div>
        <GoldDivider className="relative mx-auto my-4 max-w-xs" />
        <p className="ib-bless font-body relative mx-auto max-w-xl text-base text-parchment-light/90 sm:text-lg">{t(wedding.invitedBy.closingBlessing)}</p>

        <div className="ib-deity relative mt-5 aspect-[1.6/2.48] h-[22svh] overflow-hidden rounded-t-full border-4 border-gold shadow-[0_0_40px_rgba(244,215,140,0.35)] sm:h-[28svh]">
          {deity ? (
            <Image
              src={deity.src}
              alt=""
              fill
              sizes="200px"
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
    </section>
  );
}

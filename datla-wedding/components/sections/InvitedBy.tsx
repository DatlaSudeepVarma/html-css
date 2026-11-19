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

export function InvitedBy({ deity }: { deity: ImageAsset | null }) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 10%", scrub: 1 } })
          .from(".ib-title", { opacity: 0, y: 30 })
          .from(".ib-names", { opacity: 0, y: 24 }, "<0.3");

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
        <div className="ib-glow relative mt-5">
          <p className="ib-names font-heading text-shimmer-gold-light mx-auto max-w-2xl text-[clamp(1.5rem,4.5vw,2.6rem)] leading-[1.6]">
            {t(wedding.invitedBy.names)}
          </p>
        </div>
        <GoldDivider className="relative mx-auto my-5 max-w-xs" />
        <p className="ib-bless font-body relative mx-auto max-w-xl text-base text-parchment-light/90 sm:text-lg">{t(wedding.invitedBy.closingBlessing)}</p>

        <div className="ib-deity relative mt-6 aspect-[1.6/2.48] h-[30svh] overflow-hidden rounded-t-full border-4 border-gold shadow-[0_0_40px_rgba(244,215,140,0.35)] sm:h-[34svh]">
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

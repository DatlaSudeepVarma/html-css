"use client";

import { useRef } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { ui, wedding, type Person } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, useScrollAnimation } from "@/lib/gsap";
import type { ImageAsset } from "@/lib/images";
import { PortraitPlaceholder } from "./Placeholders";

function CoupleCard({ person, photo, label, side }: { person: Person; photo: ImageAsset | null; label: string; side: "bride" | "groom" }) {
  const { t, lang } = useLanguage();
  const parentsLine =
    lang === "te" ? `${t(person.parents)} ${t(person.relation)}` : `${t(person.relation)} ${t(person.parents)}`;

  return (
    <article
      className={`couple-${side} relative w-[min(86vw,340px)] rounded-[2rem] border border-gold/60 bg-parchment-light/85 px-6 pb-5 pt-5 text-center shadow-card backdrop-blur-sm sm:px-8 sm:pb-7 sm:pt-6`}
    >
      <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-dark">{label}</p>
      <div className="relative mx-auto mt-3 h-32 w-32 rounded-full bg-gold-sheen p-[5px] shadow-glow sm:h-40 sm:w-40">
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-parchment-light">
          {photo ? (
            <Image
              src={photo.src}
              fill
              sizes="160px"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              alt={t(person.name)}
              className={`object-cover ${side === "bride" ? "object-[50%_16%]" : "object-[50%_12%]"}`}
            />
          ) : (
            <PortraitPlaceholder className="h-full w-full" />
          )}
        </div>
      </div>
      <div className="couple-names mt-3 sm:mt-4">
        <p className="font-body text-sm text-maroon/80">{t(person.honorific)}</p>
        <h3 className="font-heading text-shimmer-gold inline-block py-[0.3em] text-3xl leading-[1.7] sm:text-4xl sm:leading-[1.7]">{t(person.name)}</h3>
      </div>
      <p className="font-body mt-2 text-sm leading-relaxed text-brown/85">{parentsLine}</p>
    </article>
  );
}

export function Couple({ bride, groom }: { bride: ImageAsset | null; groom: ImageAsset | null }) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const [before, after] = t(wedding.couple.union).split("❤");

  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const stage = root.current!.querySelector<HTMLElement>(".couple-stage")!;
        const toCenter = (sel: string, axis: "x" | "y") => () => {
          const el = stage.querySelector<HTMLElement>(sel)!;
          return axis === "x"
            ? stage.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)
            : stage.offsetHeight / 2 - (el.offsetTop + el.offsetHeight / 2);
        };

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "top top", scrub: 1 } })
          .from(".couple-title", { opacity: 0, y: 30, duration: 0.5 })
          .from(".couple-bride", { xPercent: -130, opacity: 0, rotate: -8, duration: 1, ease: "power3.out" }, "<0.1")
          .from(".couple-groom", { xPercent: 130, opacity: 0, rotate: 8, duration: 1, ease: "power3.out" }, "<0.15");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".couple-pin", start: "top top", end: "+=180%", pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        tl.to({}, { duration: 0.4 })
          .to(".couple-names", { opacity: 0, y: -10, duration: 0.4 })
          .to(".couple-bride", { x: toCenter(".couple-bride", "x"), y: toCenter(".couple-bride", "y"), scale: 0.78, rotate: -4, opacity: 0.3, duration: 1 }, "<")
          .to(".couple-groom", { x: toCenter(".couple-groom", "x"), y: toCenter(".couple-groom", "y"), scale: 0.78, rotate: 4, opacity: 0.3, duration: 1 }, "<")
          .from(".couple-union", { opacity: 0, scale: 0.6, filter: "blur(10px)", duration: 0.8 }, "-=0.35")
          .from(".couple-heart", { scale: 0, rotate: -30, duration: 0.5, ease: "back.out(3)" }, "-=0.4")
          .to({}, { duration: 0.6 });
      });
    },
  );

  return (
    <section ref={root} id="couple" data-bg="#EAD9B4" className="relative">
      <div className="couple-pin relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[calc(var(--frame-width)+1rem)] py-[calc(var(--frame-width)+1.25rem)] sm:py-[calc(var(--frame-width)+2rem)]">
        <SectionTitle title={wedding.couple.title} className="couple-title mb-4 sm:mb-10" />

        <div className="couple-stage relative flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row md:gap-12">
          <CoupleCard person={wedding.bride} photo={bride} label={t(ui.bride)} side="bride" />
          <CoupleCard person={wedding.groom} photo={groom} label={t(ui.groom)} side="groom" />

          <div className="couple-union-wrap pointer-events-none z-10 flex items-center justify-center motion-safe:absolute motion-safe:inset-0">
            <p className="couple-union font-heading rounded-full bg-[radial-gradient(ellipse_at_center,rgba(243,236,219,0.95)_35%,rgba(243,236,219,0)_72%)] px-10 py-6 text-center text-[clamp(1.7rem,5.5vw,3.25rem)] leading-[1.5]">
              <span className="text-shimmer-gold">{before}</span>
              <span className="couple-heart mx-2 inline-block text-[#C42B45] motion-safe:animate-heartbeat">❤</span>
              <span className="text-shimmer-gold">{after}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

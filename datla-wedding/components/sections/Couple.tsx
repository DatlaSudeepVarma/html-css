"use client";

import { useRef } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { ui, wedding, type Person } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, isLiteMotion, pinScroll, scrollReveal, useScrollAnimation } from "@/lib/gsap";
import type { ImageAsset } from "@/lib/images";
import { PortraitPlaceholder } from "./Placeholders";

function CoupleCard({ person, photo, label, side }: { person: Person; photo: ImageAsset | null; label: string; side: "bride" | "groom" }) {
  const { t, lang } = useLanguage();
  const parentsLine =
    lang === "te" ? `${t(person.parents)} ${t(person.relation)}` : `${t(person.relation)} ${t(person.parents)}`;

  return (
    // Phones: a compact photo-left / text-right card so both people fit on one screen while pinned.
    <article
      className={`couple-${side} relative grid w-[min(90vw,360px)] grid-cols-[5.75rem_1fr] items-center gap-x-4 rounded-[1.75rem] border border-gold/60 bg-parchment-light/85 px-4 py-3 text-left shadow-card backdrop-blur-sm md:block md:w-[min(86vw,340px)] md:rounded-[2rem] md:px-8 md:pb-7 md:pt-6 md:text-center`}
    >
      <p className="font-body col-start-2 text-[0.7rem] uppercase tracking-[0.3em] text-gold-dark md:text-xs">{label}</p>
      <div className="relative col-start-1 row-span-3 row-start-1 h-[5.75rem] w-[5.75rem] rounded-full bg-gold-sheen p-[4px] shadow-glow md:mx-auto md:mt-3 md:h-40 md:w-40 md:p-[5px]">
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-parchment-light">
          {photo ? (
            <Image
              src={photo.src}
              fill
              sizes="160px"
              quality={65}
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
      <div className="couple-names col-start-2 md:mt-4">
        <p className="font-body text-xs text-maroon/80 md:text-sm">{t(person.honorific)}</p>
        <h3 className="font-heading text-shimmer-gold inline-block py-[0.2em] text-2xl leading-[1.6] md:py-[0.3em] md:text-4xl md:leading-[1.7]">{t(person.name)}</h3>
      </div>
      <p className="font-body col-start-2 text-xs leading-snug text-brown/85 md:mt-2 md:text-sm md:leading-relaxed">{parentsLine}</p>
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
          .timeline({ scrollTrigger: scrollReveal(root.current, { start: "top 85%", end: "top top", scrub: 1 }) })
          .from(".couple-title", { opacity: 0, y: 30, duration: 0.5 })
          .from(".couple-bride", { xPercent: -130, opacity: 0, rotate: -8, duration: 1, ease: "power3.out" }, "<0.1")
          .from(".couple-groom", { xPercent: 130, opacity: 0, rotate: 8, duration: 1, ease: "power3.out" }, "<0.15");

        // Phones: a longer opening hold so both people sit fully on screen before they merge, a shorter
        // closing hold, and a much shorter pin so the whole scene costs about one screen of scrolling.
        const lite = isLiteMotion();
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".couple-pin", ...pinScroll("+=180%", "+=100%") },
        });
        tl.to({}, { duration: lite ? 0.9 : 0.4 })
          .to(".couple-names", { opacity: 0, y: -10, duration: 0.4 })
          .to(".couple-bride", { x: toCenter(".couple-bride", "x"), y: toCenter(".couple-bride", "y"), scale: 0.78, rotate: -4, opacity: 0.3, duration: 1 }, "<")
          .to(".couple-groom", { x: toCenter(".couple-groom", "x"), y: toCenter(".couple-groom", "y"), scale: 0.78, rotate: 4, opacity: 0.3, duration: 1 }, "<")
          .from(".couple-union", { opacity: 0, scale: 0.82, y: 18, duration: 0.85, ease: "power3.out" }, "-=0.4")
          .fromTo(".couple-halo", { opacity: 0, scale: 0.65 }, { opacity: 1, scale: 1, duration: 0.85, ease: "power2.out" }, "<")
          .from(".couple-heart", { scale: 0, rotate: -30, duration: 0.5, ease: "back.out(3)" }, "-=0.45")
          .to({}, { duration: lite ? 0.3 : 0.6 });
      });
    },
  );

  return (
    <section ref={root} id="couple" data-bg="#EAD9B4" className="relative">
      <div className="couple-pin relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[calc(var(--frame-width)+1rem)] py-[calc(var(--frame-width)+1rem)] md:py-[calc(var(--frame-width)+2rem)]">
        <SectionTitle title={wedding.couple.title} className="couple-title mb-3 md:mb-10" />

        <div className="couple-stage relative flex w-full max-w-4xl flex-col items-center justify-center gap-3 md:flex-row md:gap-12">
          <CoupleCard person={wedding.bride} photo={bride} label={t(ui.bride)} side="bride" />
          <CoupleCard person={wedding.groom} photo={groom} label={t(ui.groom)} side="groom" />

          <div className="couple-union-wrap pointer-events-none z-10 flex items-center justify-center motion-safe:absolute motion-safe:inset-0">
            <div className="couple-union relative">
              <span aria-hidden className="couple-halo pointer-events-none absolute left-1/2 top-1/2 h-[170%] w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(244,215,140,0.75),transparent_68%)] opacity-0" />
              <p className="relative font-heading rounded-full bg-[radial-gradient(ellipse_at_center,rgba(243,236,219,0.95)_35%,rgba(243,236,219,0)_72%)] px-10 py-6 text-center text-[clamp(1.7rem,5.5vw,3.25rem)] leading-[1.5]">
                <span className="text-shimmer-gold">{before}</span>
                <span className="couple-heart mx-2 inline-block text-[#C42B45] motion-safe:animate-heartbeat">❤</span>
                <span className="text-shimmer-gold">{after}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

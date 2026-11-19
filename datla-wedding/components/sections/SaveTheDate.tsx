"use client";

import { useRef } from "react";
import Image from "next/image";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { GoldSparkles } from "@/components/ornaments/GoldSparkles";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, isLiteMotion, pinScroll, scrollReveal, useScrollAnimation } from "@/lib/gsap";
import type { ImageAsset } from "@/lib/images";
import { GarlandPlaceholder } from "./Placeholders";

export function SaveTheDate({ image }: { image: ImageAsset | null }) {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const { muhurtham } = wedding.events;

  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: scrollReveal(root.current, { start: "top 85%", end: isLiteMotion() ? "top 40%" : "top 15%", scrub: 1 }) })
          .from(".std-frame", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)", ease: "power2.out" })
          .from(".std-word", { opacity: 0, y: 50, rotate: -6, stagger: 0.16 }, 0)
          .from(".std-sub", { opacity: 0, y: 20 }, "-=0.3");

        // Phones: nothing is hidden behind extra scrolling. Someone who doesn't know the page animates would
        // think it ends at the title, so the date, glow and weekday line play on their own, once, as the
        // section arrives, and the section simply scrolls past with no pin.
        if (isLiteMotion()) {
          gsap
            .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } })
            .fromTo(".std-date", { scale: 0.7, opacity: 0 }, { scale: 1.08, opacity: 1, duration: 0.9, ease: "power3.out" })
            .fromTo(".std-halo", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.05, duration: 0.8, ease: "power2.out" }, "-=0.65")
            .from(".std-day", { opacity: 0, y: 16, duration: 0.55, ease: "power2.out" }, "-=0.45")
            .fromTo(".std-img", { scale: 1.2, yPercent: 4 }, { scale: 1, yPercent: 0, duration: 1.8, ease: "power2.out" }, 0);
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".std-pin", ...pinScroll("+=150%") },
        });
        tl.fromTo(".std-date", { scale: 0.55, opacity: 0 }, { scale: 1.12, opacity: 1, duration: 1, ease: "power2.out" })
          .fromTo(".std-halo", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.05, duration: 0.7, ease: "power2.out" }, "-=0.55")
          .from(".std-day", { opacity: 0, y: 16, duration: 0.4 }, "-=0.3")
          .to({}, { duration: 0.4 });
        tl.fromTo(".std-img", { scale: 1.35, yPercent: 8 }, { scale: 1, yPercent: -6, ease: "none", duration: tl.duration() }, 0);
      });
    },
  );

  return (
    <section ref={root} id="save-the-date" data-bg="#E8DFC8" className="relative">
      <div className="std-pin relative flex min-h-[100svh] items-center overflow-hidden px-[calc(var(--frame-width)+1.25rem)] py-[calc(var(--frame-width)+2rem)]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 md:grid-cols-2 md:gap-14">
          <div className="std-frame relative mx-auto aspect-[3/4] h-[38svh] overflow-hidden rounded-t-full border-[5px] border-gold shadow-card outline outline-1 outline-offset-4 outline-gold/60 md:h-auto md:w-full md:max-w-sm">
            {image ? (
              <Image
                src={image.src}
                fill
                sizes="(max-width: 768px) 70vw, 384px"
                quality={65}
                priority
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                alt=""
                className="std-img object-cover"
              />
            ) : (
              <GarlandPlaceholder className="std-img h-full w-full" />
            )}
            <GoldSparkles count={18} seed={11} />
          </div>

          <div className="text-center">
            <h2 className="font-script text-[clamp(3.2rem,10vw,7rem)] leading-[1.15]">
              {t(wedding.saveTheDate.title)
                .split(" ")
                .map((word, i) => (
                  <span key={i} className="std-word text-shimmer-gold inline-block px-[0.12em] py-[0.08em]">
                    {word}
                  </span>
                ))}
            </h2>
            <p className="std-sub font-body mx-auto mt-2 max-w-md text-sm text-maroon/90 sm:text-base">{t(wedding.saveTheDate.subtitle)}</p>
            <GoldDivider className="mx-auto my-5 max-w-xs" />
            <div className="std-glow relative">
              <span aria-hidden className="std-halo pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[min(78vw,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(244,215,140,0.95),transparent_68%)] opacity-0" />
              <p className="std-date relative font-decorative text-shimmer-gold text-[clamp(2.6rem,9vw,5.5rem)] font-bold leading-tight tabular-nums">
                {muhurtham.numericDate}
              </p>
            </div>
            <p className="std-day font-heading mt-2 text-xl text-maroon sm:text-2xl">
              {t(muhurtham.displayDay)} · {t(muhurtham.displayTime)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

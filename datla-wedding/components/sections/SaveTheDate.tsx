"use client";

import { useRef } from "react";
import Image from "next/image";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { GoldSparkles } from "@/components/ornaments/GoldSparkles";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, useScrollAnimation } from "@/lib/gsap";
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
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 1 } })
          .from(".std-frame", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)", ease: "power2.out" })
          .from(".std-word", { opacity: 0, y: 50, rotate: -6, filter: "blur(6px)", stagger: 0.18 }, 0)
          .from(".std-sub", { opacity: 0, y: 20 }, "-=0.3");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".std-pin", start: "top top", end: "+=150%", pin: true, scrub: 1 },
        });
        tl.fromTo(".std-date", { scale: 0.55, opacity: 0 }, { scale: 1.12, opacity: 1, duration: 1, ease: "power2.out" })
          .fromTo(
            ".std-glow",
            { filter: "drop-shadow(0px 0px 0px rgba(244,215,140,0))" },
            { filter: "drop-shadow(0px 0px 22px rgba(244,215,140,0.95))", duration: 0.6 },
            "-=0.5",
          )
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
                sizes="(max-width: 768px) 60vw, 384px"
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
            <div className="std-glow">
              <p className="std-date font-decorative text-shimmer-gold text-[clamp(2.6rem,9vw,5.5rem)] font-bold leading-tight tabular-nums">
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

"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { wedding } from "@/data/wedding";
import { useInView } from "@/hooks/useInView";
import { useLanguage } from "@/hooks/useLanguage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MOTION_OK, useScrollAnimation } from "@/lib/gsap";
import { useInvitationOpened } from "@/lib/invitation";
import { prefersLiteExperience, supportsWebGL } from "@/lib/webgl";
import { ClockFallback } from "./ClockFallback";

const ClockRing = dynamic(() => import("@/components/three/ClockRing"), { ssr: false });

export function Sumuhurtham() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const opened = useInvitationOpened();
  /** Renders frames only while on screen. */
  const inView = useInView(root);
  /** Starts downloading three.js about a screen ahead, and keeps the scene mounted afterwards. */
  const near = useInView(root, "100% 0px");
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const { muhurtham } = wedding.events;

  useEffect(() => {
    setWebgl(supportsWebGL() && !prefersLiteExperience());
  }, []);
  useEffect(() => {
    if (near && opened) setMounted(true);
  }, [near, opened]);

  useScrollAnimation(
    root,
    ({ gsap, ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => (progress.current = self.progress),
      });

      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "center center", scrub: 1 } })
          .from(".mu-title", { opacity: 0, y: 30 })
          .from(".mu-char", { opacity: 0, yPercent: 80, rotateX: -80, stagger: 0.06, ease: "back.out(2)" }, "<0.2")
          .from(".mu-line", { opacity: 0, y: 20, stagger: 0.2 }, "-=0.2")
          .from(".mu-clock", { opacity: 0, scale: 0.7, rotate: -20 }, 0);
      });
    },
  );

  return (
    <section ref={root} id="muhurtham" data-bg="#E2C68A" className="relative">
      <div className="relative flex min-h-[100svh] items-center px-[calc(var(--frame-width)+1.25rem)] py-[calc(var(--frame-width)+3rem)]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 md:grid-cols-2 md:gap-12">
          <div className="mu-clock relative mx-auto aspect-square w-[min(78vw,440px)]">
            <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,244,204,0.75),rgba(255,244,204,0)_70%)]" />
            {webgl ? (
              mounted && (
                <ErrorBoundary fallback={<ClockFallback className="absolute inset-[4%]" />}>
                  <ClockRing progress={progress} reducedMotion={reducedMotion} active={inView} />
                </ErrorBoundary>
              )
            ) : (
              <ClockFallback className="absolute inset-[4%]" />
            )}
          </div>

          <div className="text-center">
            <SectionTitle title={muhurtham.title} className="mu-title" />
            <p className="font-decorative mt-4 text-[clamp(3rem,11vw,6.5rem)] font-bold leading-none text-maroon [perspective:600px]" aria-label={muhurtham.numericDate}>
              {muhurtham.numericDate.split("").map((c, i) => (
                <span key={i} className="mu-char inline-block" aria-hidden>
                  {c}
                </span>
              ))}
            </p>
            <p className="mu-line font-heading mt-5 text-2xl text-brown sm:text-3xl">{t(muhurtham.dayLine)}</p>
            <p className="mu-line font-heading mt-2 text-2xl text-maroon sm:text-3xl">{t(muhurtham.timeLine)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

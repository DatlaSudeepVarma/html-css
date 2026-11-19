"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LotusLoader } from "@/components/LotusLoader";
import type { HeroPhase } from "@/components/three/hero/layout";
import { ui, wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { requestOrientationPermission, useParallaxInput } from "@/hooks/useParallaxInput";
import { refreshScrollTriggers } from "@/lib/gsap";
import type { ImageAsset } from "@/lib/images";
import { markInvitationOpened } from "@/lib/invitation";
import { prefersLiteExperience, supportsWebGL } from "@/lib/webgl";
import { HeroDoors } from "./HeroDoors";
import { HeroStatic } from "./HeroStatic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const NEXT_SECTION_ID = "save-the-date";

interface HeroClientProps {
  deity: ImageAsset | null;
  /** Optimised URL of `deity` for the WebGL texture. */
  deityTextureSrc: string | null;
  conchSrc: string | null;
}

export function HeroClient({ deity, deityTextureSrc, conchSrc }: HeroClientProps) {
  const { t } = useLanguage();
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<HeroPhase>("closed");
  const [webgl, setWebgl] = useState(false);
  const [want3D, setWant3D] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);
  const parallax = useParallaxInput(phase === "open" && !reducedMotion && sceneReady);

  const handleProgress = useCallback((p: number) => setProgress((prev) => Math.max(prev, p)), []);
  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleOpened = useCallback(() => setPhase("open"), []);
  const disable3D = useCallback(() => setWebgl(false), []);

  useEffect(() => {
    setWebgl(supportsWebGL() && !prefersLiteExperience());
  }, []);

  // Keep the page locked on the doors until the invitation is opened.
  useEffect(() => {
    const html = document.documentElement;
    if (phase === "open") {
      lenis?.start();
      html.style.overflow = "";
      refreshScrollTriggers();
    } else {
      lenis?.stop();
      html.style.overflow = "hidden";
    }
  }, [phase, lenis]);
  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const openInvitation = () => {
    if (phase !== "closed") return;
    if (conchSrc) {
      const audio = new Audio(conchSrc);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    }
    requestOrientationPermission();
    setWant3D(true);
    setPhase("opening");
    markInvitationOpened();
  };

  const scrollToNext = () => {
    if (lenis) lenis.scrollTo(`#${NEXT_SECTION_ID}`);
    else document.getElementById(NEXT_SECTION_ID)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  const revealed = phase !== "closed";
  const show3D = webgl && want3D;

  return (
    <>
      {/* Fully covered by the closed doors, so its artwork isn't fetched or painted until they start to open. */}
      {phase !== "closed" && (
        <HeroStatic
          deity={deity}
          className={`transition-[opacity,visibility] duration-700 ${sceneReady ? "invisible opacity-0" : "opacity-100"}`}
        />
      )}

      {show3D && (
        <ErrorBoundary onError={disable3D}>
          <div className={`absolute inset-0 transition-opacity duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}>
            <HeroScene
              phase={phase}
              reducedMotion={reducedMotion}
              parallax={parallax}
              deitySrc={deityTextureSrc}
              active={active}
              onProgress={handleProgress}
              onReady={handleReady}
            />
          </div>
        </ErrorBoundary>
      )}

      {phase === "opening" && <HeroDoors opening reducedMotion={reducedMotion} onOpened={handleOpened} />}

      {phase !== "open" && (
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-[calc(var(--frame-width)+1rem)] transition-opacity duration-500 ${
            phase === "closed" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <p className="font-heading rounded-full bg-brown-dark/75 px-5 py-1.5 text-center text-sm text-[#F3DFA2] shadow-card backdrop-blur-sm sm:text-base">
            {t(wedding.invocation)}
          </p>
          <button
            type="button"
            onClick={openInvitation}
            className="font-heading rounded-full border-2 border-[#F3DFA2] bg-gradient-to-b from-[#F6E3A8] via-gold to-gold-dark px-8 py-3 text-xl text-maroon-dark transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light active:scale-95 motion-safe:animate-glow sm:px-10 sm:py-4 sm:text-2xl"
          >
            {t(ui.openInvitation)}
          </button>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--frame-width)+max(3.25rem,8svh))] z-20 flex justify-center px-8">
        <div
          className={`rounded-full bg-[radial-gradient(ellipse_at_center,rgba(243,236,219,0.92)_30%,rgba(243,236,219,0)_72%)] px-10 transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:delay-0 ${
            revealed ? "translate-y-0 opacity-100 blur-0 delay-[1600ms]" : "translate-y-6 opacity-0 blur-sm"
          }`}
        >
          <h1 className="font-heading text-shimmer-gold py-[0.25em] text-center text-[clamp(1.6rem,min(7vw,7svh),3.75rem)] leading-[1.5]">
            {t(wedding.title)}
          </h1>
        </div>
      </div>

      {phase === "open" && show3D && !sceneReady && (
        <LotusLoader
          size="sm"
          progress={progress}
          label={t(ui.loading)}
          className="absolute left-[calc(var(--frame-width)+1rem)] bottom-[calc(var(--frame-width)+1rem)] z-20"
        />
      )}

      {phase === "open" && (
        <button
          type="button"
          onClick={scrollToNext}
          className="absolute bottom-[calc(var(--frame-width)+1.25rem+var(--safe-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-maroon motion-safe:animate-[fade-in_1.1s_ease_0.6s_both]"
          aria-label={t(ui.scroll)}
        >
          <span className="font-body text-xs tracking-[0.2em] sm:text-sm">{t(ui.scroll)}</span>
          <span className="text-lg leading-none motion-safe:animate-scroll-cue" aria-hidden>
            ↓
          </span>
        </button>
      )}
    </>
  );
}

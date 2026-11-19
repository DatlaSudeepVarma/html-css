"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { loadGsap } from "@/lib/gsap";
import { useInvitationOpened } from "@/lib/invitation";

export const LenisContext = createContext<Lenis | null>(null);

/** Lenis is created once the invitation is opened; before that the page is scroll-locked on the doors. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const opened = useInvitationOpened();

  useEffect(() => {
    if (!opened) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    Promise.all([loadGsap(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: LenisClass }]) => {
      if (cancelled) return;
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      // The hook reports `false` during hydration; read the media query directly so Lenis is never
      // created (and handed to consumers) only to be destroyed a frame later.
      if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Wheel input is eased by Lenis; touch keeps the browser's native momentum (syncTouch off) and Lenis
      // only mirrors the position into ScrollTrigger, so phones feel native but the scenes stay in sync.
      const instance = new LenisClass({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });

      // Idle shimmer and twinkle pause while a finger or wheel is moving the page, so scrolling gets the
      // whole frame budget and the glow resumes the moment it settles.
      const root = document.documentElement;
      let settle = 0;
      const onScroll = () => {
        root.classList.add("is-scrolling");
        window.clearTimeout(settle);
        settle = window.setTimeout(() => root.classList.remove("is-scrolling"), 160);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      instance.on("scroll", ScrollTrigger.update);

      // GSAP's ticker reports seconds; Lenis expects milliseconds.
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      setLenis(instance);
      ScrollTrigger.refresh();

      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.clearTimeout(settle);
        root.classList.remove("is-scrolling");
        gsap.ticker.remove(tick);
        instance.destroy();
        setLenis(null);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reducedMotion, opened]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

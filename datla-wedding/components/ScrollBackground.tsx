"use client";

import { useEffect, useRef } from "react";
import { loadGsap, refreshScrollTriggers } from "@/lib/gsap";
import { useLanguage } from "@/hooks/useLanguage";
import { useInvitationOpened } from "@/lib/invitation";

const BASE = "#E8DFC8";

/**
 * Fixed page background whose colour drifts toward the `data-bg` of whichever
 * section is entering the middle of the viewport.
 */
export function ScrollBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const opened = useInvitationOpened();

  useEffect(() => {
    const el = ref.current;
    if (!el || !opened) return;
    let kill: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      let sections: HTMLElement[] = [];
      const collect = () => {
        sections = Array.from(document.querySelectorAll<HTMLElement>("[data-bg]"));
      };

      const update = () => {
        const vh = window.innerHeight;
        const mid = vh * 0.55;
        let color = BASE;
        for (let i = 0; i < sections.length; i++) {
          const top = sections[i].getBoundingClientRect().top;
          if (top > mid) break;
          const from = i === 0 ? BASE : sections[i - 1].dataset.bg!;
          const t = gsap.utils.clamp(0, 1, (mid - top) / (vh * 0.6));
          color = gsap.utils.interpolate(from, sections[i].dataset.bg!, t);
        }
        el.style.backgroundColor = color;
      };

      collect();
      update();
      const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: () => (collect(), update()) });
      kill = () => st.kill();
    });

    return () => {
      cancelled = true;
      kill?.();
    };
  }, [opened]);

  // Text reflows on language switch, so trigger positions must be recomputed.
  useEffect(() => {
    if (!opened) return;
    const id = requestAnimationFrame(refreshScrollTriggers);
    return () => cancelAnimationFrame(id);
  }, [lang, opened]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundColor: BASE,
        backgroundImage:
          "var(--paper-noise), radial-gradient(ellipse at center, transparent 55%, rgba(36, 21, 11, 0.28) 100%)",
      }}
    />
  );
}

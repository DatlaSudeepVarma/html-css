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
        const y = window.scrollY + vh * 0.55;
        let color = BASE;
        for (let i = 0; i < sections.length; i++) {
          // Read live: pinned scenes shift later sections, so cached offsets would drift.
          const top = sections[i].getBoundingClientRect().top + window.scrollY;
          if (top > y) break;
          const from = i === 0 ? BASE : sections[i - 1].dataset.bg!;
          const t = gsap.utils.clamp(0, 1, (y - top) / (vh * 0.6));
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
    <>
      <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: BASE }} />
      <div aria-hidden className="scroll-bg-overlay pointer-events-none fixed inset-0 -z-10" />
    </>
  );
}

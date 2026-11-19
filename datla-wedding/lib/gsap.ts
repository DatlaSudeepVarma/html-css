"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useInvitationOpened } from "./invitation";

/** Wrap scroll animations in `gsap.matchMedia().add(MOTION_OK, ...)`; content must be fully visible without them. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Phones and touch screens. Same scenes as desktop; the scrub sits closer to the finger. */
export const LITE_QUERY = "(max-width: 767px), (pointer: coarse)";

export function isLiteMotion() {
  return typeof window !== "undefined" && window.matchMedia(LITE_QUERY).matches;
}

/**
 * Scroll-scrubbed reveal. On a phone the timeline tracks the finger more tightly so the scene
 * feels weighted instead of floating behind the touch.
 */
export function scrollReveal(
  trigger: Element | string | null,
  rich: { start?: string; end?: string; scrub?: number | boolean; pin?: boolean; invalidateOnRefresh?: boolean },
) {
  if (!isLiteMotion()) return { trigger, ...rich };
  return { trigger, ...rich, scrub: 0.45 };
}

/** Pinned scene. Transform pinning keeps the frame glued to the finger, including under the mobile URL bar. */
export function pinScroll(end: string, liteEnd?: string) {
  const lite = isLiteMotion();
  return {
    start: "top top",
    end: lite ? (liteEnd ?? end.replace(/(\d+)/, (n) => String(Math.round(Number(n) * 0.85)))) : end,
    pin: true,
    pinType: "transform" as const,
    anticipatePin: 1,
    scrub: lite ? 0.45 : 1,
    invalidateOnRefresh: true,
  };
}

export interface Gsap {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
}

let loading: Promise<Gsap> | null = null;
let loaded: Gsap | null = null;

/**
 * GSAP and ScrollTrigger are only needed once the doors open (the page is scroll-locked until then), so they're
 * fetched on demand instead of competing with the first paint.
 */
export function loadGsap(): Promise<Gsap> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    // The mobile URL bar resizing the viewport would otherwise refresh every pin and remeasure mid-scroll.
    ScrollTrigger.config({ ignoreMobileResize: true });
    loaded = { gsap, ScrollTrigger };
    return loaded;
  });
  return loading;
}

/** No-op until GSAP has loaded (nothing to measure yet). */
export function refreshScrollTriggers() {
  loaded?.ScrollTrigger.refresh();
}

/**
 * Builds a section's scroll animations after the invitation is opened, inside a gsap.context scoped to `scope`
 * (selector strings resolve within it), and reverts them on unmount or when `deps` change.
 */
export function useScrollAnimation(
  scope: RefObject<Element>,
  build: (lib: Gsap) => void,
  deps: readonly unknown[] = [],
) {
  const opened = useInvitationOpened();
  const buildRef = useRef(build);
  buildRef.current = build;

  useEffect(() => {
    if (!opened) return;
    let cancelled = false;
    let ctx: ReturnType<Gsap["gsap"]["context"]> | undefined;
    loadGsap().then((lib) => {
      if (cancelled || !scope.current) return;
      ctx = lib.gsap.context(() => buildRef.current(lib), scope.current);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, scope, ...deps]);
}

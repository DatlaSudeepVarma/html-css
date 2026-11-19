"use client";

import { useEffect, useRef, useState } from "react";
import { LotusIcon } from "@/components/ornaments/LotusIcon";

const FINE_POINTER = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";
const INTERACTIVE = "a, button, input, textarea, select, label, summary, [role='button']";
/** Sits just below-right of the arrow tip so it never covers what's being pointed at. */
const OFFSET = { x: 14, y: 16 };

/** A small gold lotus that trails the native cursor on desktop. */
export function LotusCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduced ? 1 : 0.2;
    let x = 0, y = 0, s = 1;
    let tx = 0, ty = 0, ts = 1;
    let raf = 0;
    let placed = false;

    const render = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      s += (ts - s) * (reduced ? 1 : 0.18);
      el.style.transform = `translate3d(${x + OFFSET.x}px, ${y + OFFSET.y}px, 0) scale(${s})`;
      const settled = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 && Math.abs(ts - s) < 0.005;
      raf = settled ? 0 : requestAnimationFrame(render);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const show = (visible: boolean) => {
      el.style.opacity = visible ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!placed) {
        x = tx;
        y = ty;
        placed = true;
      }
      show(true);
      kick();
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element;
      if (target.tagName === "IFRAME") return show(false);
      ts = target.closest(INTERACTIVE) ? 1.45 : 1;
      kick();
    };
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 transition-opacity duration-300 will-change-transform"
    >
      <LotusIcon tone="gold" className="h-5 w-5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1px_2px_rgba(59,35,20,0.45)]" />
    </div>
  );
}

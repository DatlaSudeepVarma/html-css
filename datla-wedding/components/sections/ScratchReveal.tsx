"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LotusIcon } from "@/components/ornaments/LotusIcon";
import { RoseFall } from "@/components/ornaments/RoseFall";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { ui, wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MOTION_OK, useScrollAnimation } from "@/lib/gsap";
import type { ImageAsset } from "@/lib/images";

const CLEAR_RATIO = 0.46;

function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sheen = ctx.createLinearGradient(0, 0, w, h);
  sheen.addColorStop(0, "#6E4A16");
  sheen.addColorStop(0.28, "#C79A4A");
  sheen.addColorStop(0.5, "#F6E3A8");
  sheen.addColorStop(0.72, "#C79A4A");
  sheen.addColorStop(1, "#6E4A16");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 244, 204, 0.22)";
  ctx.lineWidth = Math.max(1.2, w * 0.004);
  for (let x = -h; x < w + h; x += Math.max(10, w * 0.028)) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.stroke();
  }
  ctx.restore();

  const speckles = Math.round((w * h) / 900);
  for (let i = 0; i < speckles; i++) {
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 244, 204, 0.45)" : "rgba(90, 58, 20, 0.22)";
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6);
  }

  ctx.strokeStyle = "rgba(140, 100, 36, 0.55)";
  ctx.lineWidth = Math.max(4, w * 0.012);
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
}

function clearPercent(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const { data } = ctx.getImageData(0, 0, w, h);
  const step = 32;
  let clear = 0;
  let total = 0;
  for (let i = 3; i < data.length; i += 4 * step) {
    total += 1;
    if (data[i] < 28) clear += 1;
  }
  return total === 0 ? 0 : clear / total;
}

function ScratchPlaceholder() {
  const { t } = useLanguage();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-maroon-fade px-6 text-center">
      <LotusIcon tone="gold" className="h-16 w-16 motion-safe:animate-float sm:h-20 sm:w-20" />
      <p className="font-heading text-shimmer-gold-light mt-4 text-2xl leading-[1.5] sm:text-3xl">{t(wedding.title)}</p>
      <p className="font-body mt-2 text-sm text-parchment-light/80">{t(ui.photoComingSoon)}</p>
    </div>
  );
}

export function ScratchReveal({ image }: { image: ImageAsset | null }) {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const started = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const finished = useRef(false);
  const [revealed, setRevealed] = useState(reducedMotion);
  const [hintVisible, setHintVisible] = useState(!reducedMotion);
  const [roses, setRoses] = useState(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
    }
    setHintVisible(false);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRoses(true);
      window.setTimeout(() => setRoses(false), 2200);
    }
    window.setTimeout(() => setRevealed(true), 420);
  }, []);

  const localPoint = (e: PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;
    return { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
  };

  const scratchAt = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, from: { x: number; y: number } | null) => {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = radius * 2;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.beginPath();
    if (from) {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      setHintVisible(false);
      return;
    }
    const canvas = canvasRef.current;
    const host = card.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const layout = () => {
      if (finished.current || started.current) return;
      const { width, height } = host.getBoundingClientRect();
      if (width < 8 || height < 8) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      paintFoil(ctx, canvas.width, canvas.height);
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(host);

    const radius = () => Math.max(22, Math.min(canvas.width, canvas.height) * 0.065);

    const onDown = (e: PointerEvent) => {
      if (finished.current || e.button !== 0) return;
      e.preventDefault();
      drawing.current = true;
      started.current = true;
      setHintVisible(false);
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* Synthetic events (and some touch paths) have no pointer to capture. */
      }
      const p = localPoint(e, canvas);
      last.current = p;
      scratchAt(ctx, p.x, p.y, radius(), null);
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing.current || finished.current) return;
      e.preventDefault();
      const p = localPoint(e, canvas);
      scratchAt(ctx, p.x, p.y, radius(), last.current);
      last.current = p;
      moves.current += 1;
      if (moves.current % 8 === 0 && clearPercent(ctx, canvas.width, canvas.height) >= CLEAR_RATIO) finish();
    };
    const onUp = (e: PointerEvent) => {
      drawing.current = false;
      last.current = null;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("lostpointercapture", onUp);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("lostpointercapture", onUp);
    };
  }, [finish, reducedMotion, scratchAt]);

  useScrollAnimation(root, ({ gsap }) => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 30%", scrub: 1 } })
        .from(".sc-title", { opacity: 0, y: 24 })
        .from(".sc-card", { opacity: 0, y: 32, scale: 0.96, ease: "power2.out" }, "<0.1");
    });
  });

  const aspect = image ? image.width / image.height : 4 / 5;

  return (
    <section ref={root} id="scratch" data-bg="#4A1212" className="relative">
      {roses && <RoseFall />}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-[calc(var(--frame-width)+1.25rem)] py-[calc(var(--frame-width)+3rem)]">
        <SectionTitle title={wedding.scratch.title} subtitle={wedding.scratch.subtitle} tone="light" className="sc-title" />

        <div
          ref={card}
          data-lenis-prevent
          className="sc-card relative mt-8 w-[min(90vw,520px)] overflow-hidden rounded-[1.5rem] border-[5px] border-gold shadow-card outline outline-1 outline-offset-4 outline-gold/60"
          style={{ aspectRatio: aspect, maxHeight: "min(64svh, 580px)" }}
        >
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 768px) 90vw, 520px"
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              className="object-cover object-[center_42%]"
              draggable={false}
            />
          ) : (
            <ScratchPlaceholder />
          )}

          {!reducedMotion && !revealed && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 h-full w-full touch-none cursor-grab transition-opacity duration-500 active:cursor-grabbing"
              aria-label={t(wedding.scratch.hint)}
            />
          )}

          {hintVisible && (
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="font-heading rounded-full border border-[#F3DFA2]/70 bg-brown-dark/55 px-4 py-1.5 text-sm text-[#F3DFA2] shadow-card backdrop-blur-[2px] sm:text-base">
                {t(wedding.scratch.hint)}
              </span>
            </div>
          )}

          {reducedMotion && !revealed && (
            <button
              type="button"
              onClick={finish}
              className="font-heading absolute inset-0 z-20 flex items-center justify-center bg-maroon-dark/40 text-lg text-[#F3DFA2]"
            >
              {t(wedding.scratch.tap)}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

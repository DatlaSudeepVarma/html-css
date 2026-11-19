"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type PetalKind = "marigold" | "marigoldYellow" | "rose";

interface Petal {
  sprite: HTMLCanvasElement;
  x: number;
  y: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rot: number;
  vr: number;
  flipSpeed: number;
  scale: number;
  alpha: number;
}

const SPRITE = 48;

function makeSprite(kind: PetalKind): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const ctx = c.getContext("2d")!;
  ctx.translate(SPRITE / 2, SPRITE / 2);

  const g = ctx.createRadialGradient(0, 6, 1, 0, 0, SPRITE / 2);
  ctx.beginPath();
  if (kind === "rose") {
    g.addColorStop(0, "#F06A7E");
    g.addColorStop(0.6, "#C42B45");
    g.addColorStop(1, "#7E1028");
    ctx.moveTo(0, 16);
    ctx.bezierCurveTo(-20, 4, -14, -18, -3, -14);
    ctx.quadraticCurveTo(0, -11, 3, -14);
    ctx.bezierCurveTo(14, -18, 20, 4, 0, 16);
  } else {
    const yellow = kind === "marigoldYellow";
    g.addColorStop(0, yellow ? "#FFE08A" : "#FFC04D");
    g.addColorStop(0.6, yellow ? "#F6B820" : "#F28C28");
    g.addColorStop(1, yellow ? "#D18E0C" : "#C25E10");
    ctx.moveTo(0, 18);
    ctx.bezierCurveTo(-11, 10, -10, -10, -7, -16);
    ctx.lineTo(-3, -12);
    ctx.lineTo(0, -17);
    ctx.lineTo(3, -12);
    ctx.lineTo(7, -16);
    ctx.bezierCurveTo(10, -10, 11, 10, 0, 18);
  }
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.quadraticCurveTo(1, 0, 0, -10);
  ctx.stroke();
  return c;
}

interface FloatingPetalsProps {
  mobileCount?: number;
  desktopCount?: number;
  /** Pin to the viewport (default) or fill the nearest positioned parent. */
  fixed?: boolean;
  className?: string;
}

export function FloatingPetals({
  mobileCount = 20,
  desktopCount = 40,
  fixed = true,
  className = "",
}: FloatingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const sprites = (["marigold", "marigold", "marigoldYellow", "rose", "rose"] as PetalKind[]).map(makeSprite);
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    let width = 0;
    let height = 0;
    let dpr = 1;

    const spawn = (anywhere: boolean): Petal => ({
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -30 - Math.random() * 60,
      vy: 28 + Math.random() * 38,
      swayAmp: 18 + Math.random() * 30,
      swayFreq: 0.4 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 1.6,
      flipSpeed: 0.8 + Math.random() * 1.6,
      scale: 0.35 + Math.random() * 0.35,
      alpha: 0.75 + Math.random() * 0.25,
    });

    const petals: Petal[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const target = desktopQuery.matches ? desktopCount : mobileCount;
      if (petals.length > target) petals.length = target;
      while (petals.length < target) petals.push(spawn(true));
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy * dt;
        p.x += Math.sin(t * p.swayFreq + p.phase) * p.swayAmp * dt + 6 * dt;
        p.rot += p.vr * dt;
        if (p.y > height + 40 || p.x > width + 40) petals[i] = spawn(false);

        const flip = Math.cos(t * p.flipSpeed + p.phase);
        ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.rot);
        ctx.scale(p.scale * (0.25 + 0.75 * Math.abs(flip)), p.scale);
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(p.sprite, -SPRITE / 2, -SPRITE / 2);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, mobileCount, desktopCount]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 z-30 h-full w-full ${className}`}
    />
  );
}

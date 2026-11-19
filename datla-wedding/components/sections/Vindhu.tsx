"use client";

import { useRef } from "react";
import { Diya } from "@/components/ornaments/Diya";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { MOTION_OK, useScrollAnimation } from "@/lib/gsap";

const midrib = (x: number) => 136 - (x - 4) * 0.1224;

function BananaLeaf({ className = "" }: { className?: string }) {
  const veins = Array.from({ length: 21 }, (_, i) => {
    const x = 36 + i * 26;
    const y = midrib(x);
    const k = Math.sin((Math.PI * x) / 600);
    return `M${x} ${y} L${x + 30} ${y - 78 * k} M${x} ${y} L${x + 30} ${y + 82 * k}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 600 250" className={className} aria-hidden>
      <defs>
        <linearGradient id="vl-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E7D2E" />
          <stop offset=".5" stopColor="#62A443" />
          <stop offset="1" stopColor="#2F6B2A" />
        </linearGradient>
      </defs>
      <g className="vl-leaf">
        <path d="M14 132 C110 30 400 14 592 64 C574 160 430 236 130 228 C76 222 36 186 14 132Z" fill="url(#vl-leaf)" stroke="#24501E" strokeWidth="2" />
        <path d={veins} stroke="#A6CF6B" strokeWidth="1.4" opacity=".4" />
        <path d="M0 137 C180 124 400 100 592 64" stroke="#CFE39A" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g>
        <ellipse className="vf-item" cx="300" cy="150" rx="62" ry="27" fill="#FFFDF5" stroke="#E6DCC4" strokeWidth="2" />
        <circle className="vf-item" cx="200" cy="138" r="19" fill="#F2A33A" stroke="#C47A1C" strokeWidth="1.5" />
        <circle className="vf-item" cx="404" cy="116" r="16" fill="#F2A33A" stroke="#C47A1C" strokeWidth="1.5" />
        <ellipse className="vf-item" cx="244" cy="188" rx="26" ry="12" fill="#E9B949" stroke="#B88A1C" strokeWidth="1.5" />
        <ellipse className="vf-item" cx="366" cy="176" rx="24" ry="11" fill="#7FA650" stroke="#54772F" strokeWidth="1.5" />
        <circle className="vf-item" cx="446" cy="152" r="10" fill="#C8402A" />
        <circle className="vf-item" cx="140" cy="168" r="11" fill="#FFF4CC" stroke="#D9C29A" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function Vindhu() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const { vindhu } = wedding.events;

  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 45%", scrub: 1 } })
          .from(".vi-title", { opacity: 0, y: 30 })
          .from(".vl-leaf", { scaleX: 0, rotate: -6, transformOrigin: "0% 55%", ease: "power2.out", duration: 1.2 }, "<0.1")
          .from(".vf-item", { scale: 0, transformOrigin: "50% 50%", stagger: 0.08, ease: "back.out(2.5)", duration: 0.4 }, "-=0.4")
          .from(".vi-line", { opacity: 0, y: 20, stagger: 0.15 }, "-=0.2")
          .from(".vi-diya", { opacity: 0, y: 30, scale: 0.6, stagger: 0.1, ease: "back.out(2)" }, "<");
      });
    },
  );

  return (
    <section ref={root} id="vindhu" data-bg="#6E2318" className="relative overflow-hidden">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-[calc(var(--frame-width)+1.25rem)] py-[calc(var(--frame-width)+3rem)] text-center">
        <SectionTitle title={vindhu.title} subtitle={wedding.vindhuNote} tone="light" className="vi-title" />

        <BananaLeaf className="mt-6 w-[min(88vw,560px)] drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]" />

        <p className="vi-line font-decorative mt-6 text-[clamp(2.2rem,8vw,4rem)] font-bold leading-none text-[#F3DFA2] tabular-nums">{vindhu.numericDate}</p>
        <p className="vi-line font-heading mt-3 text-2xl text-parchment-light sm:text-3xl">{t(vindhu.dayLine)}</p>
        <p className="vi-line font-heading mt-1 text-2xl text-gold-light sm:text-3xl">{t(vindhu.timeLine)}</p>

        <GoldDivider className="vi-line mx-auto mt-6 max-w-sm" />
        <div className="mt-4 flex items-end gap-3 sm:gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <Diya key={i} delay={i * 0.37} className={`vi-diya ${i === 2 ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14 sm:h-16 sm:w-16"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

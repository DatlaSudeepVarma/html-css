"use client";

import { useCallback, useEffect, useRef, useState, type TransitionEvent } from "react";
import { DoorArt } from "./ClosedDoors";

/** Opening duration; also the fallback timer in case `transitionend` never fires (e.g. a backgrounded tab). */
const SWING_MS = 2200;
const SWING_DEG = 109;

const LEAF = "absolute inset-y-0 w-1/2 overflow-hidden";
const BACK = "absolute inset-0 bg-[#24150B] [backface-visibility:hidden] [transform:rotateY(180deg)]";

interface HeroDoorsProps {
  opening: boolean;
  reducedMotion: boolean;
  onOpened: () => void;
}

/**
 * Closed doors stay flat (two images, no 3D) so first paint is cheap. Perspective and preserve-3d are
 * switched on only when the guest taps Open, then a frame later the leaves swing.
 */
export function HeroDoors({ opening, reducedMotion, onOpened }: HeroDoorsProps) {
  const done = useRef(false);
  const finish = useRef(onOpened);
  finish.current = onOpened;
  const [live, setLive] = useState(false);
  const [swing, setSwing] = useState(false);

  const complete = useCallback(() => {
    if (done.current) return;
    done.current = true;
    finish.current();
  }, []);

  useEffect(() => {
    if (!opening) return;
    document.querySelectorAll(".ssr-doors").forEach((el) => el.setAttribute("hidden", ""));
    if (reducedMotion) return complete();
    setLive(true);
    const start = window.setTimeout(() => setSwing(true), 32);
    const fallback = window.setTimeout(complete, SWING_MS + 400);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(fallback);
    };
  }, [opening, reducedMotion, complete]);

  const onEnd = (e: TransitionEvent) => {
    if (e.target === e.currentTarget && e.propertyName === "transform") complete();
  };

  const leaf = (side: "left" | "right") => {
    const right = side === "right";
    const angle = swing ? (right ? SWING_DEG : -SWING_DEG) : 0;
    return (
      <div
        className={`${LEAF} ${side === "left" ? "left-0 origin-left" : "right-0 origin-right"} ${
          live ? "[transform-style:preserve-3d] [backface-visibility:hidden]" : ""
        } ${swing ? "transition-transform duration-[2200ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none" : ""}`}
        style={live ? { transform: `rotateY(${angle}deg)`, transitionDelay: swing && right ? "60ms" : undefined } : undefined}
        onTransitionEnd={right ? onEnd : undefined}
      >
        <DoorArt side={side} />
        {live && <div className={BACK} />}
      </div>
    );
  };

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${live ? "[perspective:1800px]" : ""}`} aria-hidden>
      {leaf("left")}
      {leaf("right")}
    </div>
  );
}

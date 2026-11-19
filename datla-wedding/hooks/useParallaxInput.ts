"use client";

import { useEffect, useRef } from "react";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Normalised [-1, 1] pointer/tilt input stored in a ref (no re-renders).
 * Desktop: mouse position. Mobile: device orientation, falling back to touch drag.
 */
export function useParallaxInput(enabled: boolean) {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const input = ref.current;
    if (!enabled) {
      input.x = input.y = 0;
      return;
    }

    let lastGyro = 0;
    let touchStart: { x: number; y: number } | null = null;
    const gyroActive = () => performance.now() - lastGyro < 500;

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      input.x = (e.clientX / window.innerWidth) * 2 - 1;
      input.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      lastGyro = performance.now();
      input.x = clamp(e.gamma / 25);
      input.y = clamp((e.beta - 40) / 25);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart || gyroActive()) return;
      const t = e.touches[0];
      input.x = clamp((t.clientX - touchStart.x) / (window.innerWidth * 0.4));
      input.y = clamp((t.clientY - touchStart.y) / (window.innerHeight * 0.4));
    };
    const onTouchEnd = () => {
      touchStart = null;
      if (!gyroActive()) input.x = input.y = 0;
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled]);

  return ref;
}

/** iOS 13+ only delivers orientation events after this is called from a user gesture. */
export function requestOrientationPermission() {
  const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
  if (typeof DOE?.requestPermission === "function") DOE.requestPermission().catch(() => {});
}

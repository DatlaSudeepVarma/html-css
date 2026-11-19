"use client";

import { useContext } from "react";
import { LenisContext } from "@/components/providers/SmoothScrollProvider";

/** Returns the Lenis instance, or null before mount / when reduced motion is on. */
export function useLenis() {
  return useContext(LenisContext);
}

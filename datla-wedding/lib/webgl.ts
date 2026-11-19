/**
 * Client-only. Only checks that the API exists: probing with a real context costs hundreds of milliseconds
 * on low-end phones, so a failed context is instead caught by the ErrorBoundary around each canvas.
 */
export function supportsWebGL(): boolean {
  return typeof window !== "undefined" && ("WebGL2RenderingContext" in window || "WebGLRenderingContext" in window);
}

interface NetworkInformationLike {
  saveData?: boolean;
}

/** Client-only. Data-saver mode or very low memory: keep the lightweight 2D hero instead of loading three.js. */
export function prefersLiteExperience(): boolean {
  const nav = navigator as Navigator & { connection?: NetworkInformationLike; deviceMemory?: number };
  return nav.connection?.saveData === true || (nav.deviceMemory !== undefined && nav.deviceMemory < 2);
}

/** Client-only. Phones and tablets get fewer particles, cheaper shaders and a lower pixel ratio. */
export function isLowPowerDevice(): boolean {
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

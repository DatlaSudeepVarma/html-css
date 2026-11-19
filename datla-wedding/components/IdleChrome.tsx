"use client";

import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LotusCursor } from "@/components/LotusCursor";
import { MusicToggle } from "@/components/MusicToggle";
import { ScrollBackground } from "@/components/ScrollBackground";

/**
 * Chrome that isn't the LCP. Mounted after the first paint as its own task so it doesn't sit on the
 * hydration long-task that Lighthouse counts as Total Blocking Time.
 */
export function IdleChrome({ music }: { music: string | null }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);
  if (!ready) return null;
  return (
    <>
      <ScrollBackground />
      <LanguageToggle className="fixed left-[calc(var(--frame-width)+1.25rem+var(--safe-left))] top-[calc(var(--frame-width)+1.25rem+var(--safe-top))] z-50" />
      {music && <MusicToggle src={music} />}
      <LotusCursor />
    </>
  );
}

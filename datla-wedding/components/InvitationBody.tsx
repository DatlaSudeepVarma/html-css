"use client";

import dynamic from "next/dynamic";
import type { ImageAsset } from "@/lib/images";
import { useInvitationOpened } from "@/lib/invitation";

const ScratchReveal = dynamic(() => import("@/components/sections/ScratchReveal").then((m) => m.ScratchReveal), { ssr: false });
const SaveTheDate = dynamic(() => import("@/components/sections/SaveTheDate").then((m) => m.SaveTheDate), { ssr: false });
const Couple = dynamic(() => import("@/components/sections/Couple").then((m) => m.Couple), { ssr: false });
const Sumuhurtham = dynamic(() => import("@/components/sections/Sumuhurtham").then((m) => m.Sumuhurtham), { ssr: false });
const Countdown = dynamic(() => import("@/components/sections/Countdown").then((m) => m.Countdown), { ssr: false });
const Vindhu = dynamic(() => import("@/components/sections/Vindhu").then((m) => m.Vindhu), { ssr: false });
const KalyanaVedika = dynamic(() => import("@/components/sections/KalyanaVedika").then((m) => m.KalyanaVedika), { ssr: false });
const InvitedBy = dynamic(() => import("@/components/sections/InvitedBy").then((m) => m.InvitedBy), { ssr: false });
const PetalSweep = dynamic(() => import("@/components/ornaments/PetalSweep").then((m) => m.PetalSweep), { ssr: false });

interface InvitationBodyProps {
  garland: ImageAsset | null;
  bride: ImageAsset | null;
  groom: ImageAsset | null;
  deity: ImageAsset | null;
  vindhu: ImageAsset | null;
  scratch: ImageAsset | null;
  parents: ImageAsset | null;
}

/**
 * Everything below the hero. The page is scroll-locked on the doors, so these sections aren't downloaded or
 * hydrated until the guest taps Open — that cut several seconds of main-thread work from the first load.
 * The 2.2s door swing is long enough for the chunks to arrive.
 */
export function InvitationBody({ garland, bride, groom, deity, vindhu, scratch, parents }: InvitationBodyProps) {
  const opened = useInvitationOpened();
  if (!opened) return null;

  return (
    <div className="deferred-sections">
      <SaveTheDate image={garland} />
      <PetalSweep seed={0} />
      <Couple bride={bride} groom={groom} />
      <PetalSweep seed={1} />
      <ScratchReveal image={scratch} />
      <PetalSweep seed={2} />
      <Sumuhurtham />
      <PetalSweep seed={3} />
      <Countdown />
      <PetalSweep seed={4} />
      <Vindhu image={vindhu} />
      <KalyanaVedika />
      <InvitedBy deity={deity} parents={parents} />
    </div>
  );
}

import type { Metadata } from "next";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LotusCorner } from "@/components/ornaments/LotusCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { FloatingPetals } from "@/components/ornaments/FloatingPetals";
import { GoldSparkles } from "@/components/ornaments/GoldSparkles";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { wedding } from "@/data/wedding";

export const metadata: Metadata = {
  title: "Ornaments preview",
  robots: { index: false, follow: false },
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-serif text-xs uppercase tracking-[0.25em] text-brown/60">{children}</p>
  );
}

export default function OrnamentsTestPage() {
  return (
    <main className="relative px-[calc(var(--frame-width)+1.5rem)] py-[calc(var(--frame-width)+2.5rem)]">
      <FloatingPetals />
      <LanguageToggle className="fixed left-[calc(var(--frame-width)+1.25rem+var(--safe-left))] top-[calc(var(--frame-width)+1.25rem+var(--safe-top))] z-50" />

      <div className="mx-auto flex max-w-4xl flex-col gap-20">
        <section>
          <Label>OrnateBorder — fixed around the viewport (rendered in the root layout)</Label>
          <SectionTitle as="h1" title={wedding.title} subtitle={wedding.blessing} />
        </section>

        <section>
          <Label>SectionTitle — Telugu / English variants</Label>
          <div className="grid gap-12 sm:grid-cols-2">
            <SectionTitle title={wedding.events.muhurtham.title} subtitle={wedding.events.muhurtham.displayTime} />
            <SectionTitle title={wedding.venue.label} subtitle={wedding.venue.name} />
            <SectionTitle title={wedding.invitedBy.label} align="left" />
            <SectionTitle title={wedding.events.vindhu.title} divider={false} />
          </div>
        </section>

        <section>
          <Label>LotusCorner — tl / tr / bl / br (swaying)</Label>
          <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-sm border border-gold/50 bg-parchment-light/60 shadow-card sm:h-96">
            <LotusCorner position="tl" />
            <LotusCorner position="tr" />
            <LotusCorner position="bl" />
            <LotusCorner position="br" />
            <p className="font-heading text-2xl text-maroon sm:text-3xl">{wedding.bride.name.te}</p>
          </div>
        </section>

        <section>
          <Label>GoldDivider — with and without flourish</Label>
          <div className="flex flex-col gap-8">
            <GoldDivider />
            <GoldDivider className="mx-auto max-w-md" />
            <GoldDivider flourish={false} className="mx-auto max-w-sm" />
          </div>
        </section>

        <section>
          <Label>GoldSparkles — on maroon and on parchment</Label>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-sm bg-maroon-fade shadow-card">
              <GoldSparkles count={40} />
              <p className="font-heading text-gold-sheen relative text-3xl">శుభమస్తు</p>
            </div>
            <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-sm border border-gold/40 bg-parchment-light/60 shadow-card">
              <GoldSparkles count={30} seed={21} />
              <p className="font-heading relative text-3xl text-maroon">కళ్యాణం</p>
            </div>
          </div>
        </section>

        <section>
          <Label>FloatingPetals — canvas, 20 mobile / 40 desktop, pointer-events none</Label>
          <p className="font-body text-brown/80">
            Marigold and rose petals are falling across the whole page. Try selecting this text —
            the canvas never blocks clicks.
          </p>
        </section>

        <div className="h-[40vh]" />
      </div>
    </main>
  );
}

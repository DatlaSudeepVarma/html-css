import { IdleChrome } from "@/components/IdleChrome";
import { InvitationBody } from "@/components/InvitationBody";
import { HeroSection } from "@/components/sections/hero/HeroSection";
import { AUDIO_EXTENSIONS, findPublicAsset } from "@/lib/assets";
import { getImageAsset } from "@/lib/images";

export default async function Home() {
  const [garland, bride, groom, deity, vindhu, scratch, parents] = await Promise.all(
    ["garland-exchange", "bride", "groom", "balaji-padmavathi", "vindhu", "scratch", "parents"].map(getImageAsset),
  );
  const music = findPublicAsset("music", AUDIO_EXTENSIONS);

  return (
    <main className="relative">
      <IdleChrome music={music} />
      <HeroSection />
      <InvitationBody
        garland={garland}
        bride={bride}
        groom={groom}
        deity={deity}
        vindhu={vindhu}
        scratch={scratch}
        parents={parents}
      />
    </main>
  );
}

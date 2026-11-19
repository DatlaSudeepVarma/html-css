import { AUDIO_EXTENSIONS, findPublicAsset } from "@/lib/assets";
import { getImageAsset, optimizedImageUrl } from "@/lib/images";
import { ClosedDoors } from "./ClosedDoors";
import { HeroClient } from "./HeroClient";

export async function HeroSection() {
  const deity = await getImageAsset("balaji-padmavathi");
  return (
    <section id="hero" className="hero-stage relative h-[100svh] w-full overflow-hidden">
      <ClosedDoors />
      <HeroClient
        deity={deity}
        deityTextureSrc={deity ? optimizedImageUrl(deity.src, 1080) : null}
        conchSrc={findPublicAsset("shankha", AUDIO_EXTENSIONS)}
      />
    </section>
  );
}

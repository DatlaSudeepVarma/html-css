import { archSvg } from "@/components/three/art/arch";
import { deityPlaceholderSvg } from "@/components/three/art/deity";
import { doorSvg } from "@/components/three/art/door";
import { chakraSvg, namamSvg, shankhaSvg } from "@/components/three/art/emblems";
import { backgroundFloralSvg, lotusBloomSvg } from "@/components/three/art/florals";

// Door leaves stretch to fill half the screen, like the original 3D door texture did.
const stretch = (svg: string) => svg.replace("<svg ", '<svg preserveAspectRatio="none" ');
/** Right-hand leaf; mirrored in the artwork because a CSS scaleX(-1) interferes with backface culling. */
const mirror = (svg: string, width: number) =>
  svg.replace(/(<svg[^>]*>)/, `$1<g transform="matrix(-1 0 0 1 ${width} 0)">`).replace(/<\/svg>\s*$/, "</g></svg>");

/** The hero artwork as static, cacheable files (shared by the 2D hero and the WebGL textures). */
const ART: Record<string, () => string> = {
  arch: archSvg,
  "door-tall": () => stretch(doorSvg(400, 1400)),
  "door-wide": () => stretch(doorSvg(720, 820)),
  "door-tall-r": () => stretch(mirror(doorSvg(400, 1400), 400)),
  "door-wide-r": () => stretch(mirror(doorSvg(720, 820), 720)),
  shankha: shankhaSvg,
  namam: namamSvg,
  chakra: chakraSvg,
  florals: backgroundFloralSvg,
  "lotus-bloom": lotusBloomSvg,
  "deity-placeholder": deityPlaceholderSvg,
};

/**
 * Full-screen art that the browser would otherwise rasterize from SVG on the main thread before first paint
 * (~200ms on phones); WebP decodes off-thread. Values are the output size in pixels.
 */
const RASTER: Record<string, [number, number]> = {
  "door-tall": [480, 1680],
  "door-wide": [1000, 1140],
  "door-tall-r": [480, 1680],
  "door-wide-r": [1000, 1140],
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...Object.keys(ART).map((name) => ({ name: `${name}.svg` })),
    ...Object.keys(RASTER).map((name) => ({ name: `${name}.webp` })),
  ];
}

// URLs aren't content-hashed, so allow edits to propagate within a day.
const CACHE = "public, max-age=86400, stale-while-revalidate=604800";

export async function GET(_request: Request, { params }: { params: { name: string } }) {
  const [, base, ext] = params.name.match(/^(.+)\.(svg|webp)$/) ?? [];
  const render = ART[base];
  if (!render || (ext === "webp" && !RASTER[base])) return new Response("Not found", { status: 404 });

  if (ext === "webp") {
    const sharp = (await import("sharp")).default;
    const [width, height] = RASTER[base];
    const webp = await sharp(Buffer.from(render()), { density: 144 })
      .resize(width, height, { fit: "fill" })
      .webp({ quality: 70, effort: 6 })
      .toBuffer();
    return new Response(new Uint8Array(webp), { headers: { "Content-Type": "image/webp", "Cache-Control": CACHE } });
  }

  return new Response(render(), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": CACHE },
  });
}

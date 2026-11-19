import { ImageResponse } from "next/og";
import { wedding } from "@/data/wedding";

// The Node build of @vercel/og in Next 14 fails to resolve its bundled assets on Windows.
export const runtime = "edge";
export const alt = `${wedding.groom.name.en} weds ${wedding.bride.name.en} – 3 December 2026, Vijayawada`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MAROON = "#6B1E1E";
const GOLD = "#B8893B";
const GOLD_LIGHT = "#E9C77B";
const BROWN = "#3B2314";

/** Satori needs TTF/OTF; the CSS API serves TTF when no modern user agent is sent. */
async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

const petal = (angle: number, fill: string, scale = 1) =>
  `<path d="M0 0 C-14 -16 -12 -38 0 -54 C12 -38 14 -16 0 0Z" fill="${fill}" stroke="${GOLD}" stroke-width="1.2" transform="rotate(${angle}) scale(${scale})"/>`;

const LOTUS = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -64 160 72">` +
    [-72, 72, -48, 48].map((a) => petal(a, "#E8A3A7", 0.85)).join("") +
    [-24, 24].map((a) => petal(a, "#F2BFC1")).join("") +
    petal(0, "#F6D3D3", 1.1) +
    `<path d="M-60 4 Q0 -6 60 4" stroke="${GOLD}" stroke-width="3" fill="none"/></svg>`,
)}`;

export default async function OpengraphImage() {
  const { groom, bride, venue } = wedding;
  const names = `${groom.name.en}${bride.name.en}`;
  const caps = `${wedding.title.en}WEDS THURSDAY · 3 DECEMBER 2026 · MUHURTHAM 9:06 PM${venue.name.en}, VIJAYAWADA`.toUpperCase();

  const [script, cinzel, playfair] = await Promise.all([
    googleFont("Great Vibes", 400, names + "&"),
    googleFont("Cinzel", 700, caps),
    googleFont("Playfair Display", 400, `${venue.name.en}, Vijayawada`),
  ]);
  const fonts = [
    script && { name: "Script", data: script, weight: 400 as const },
    cinzel && { name: "Cinzel", data: cinzel, weight: 700 as const },
    playfair && { name: "Playfair", data: playfair, weight: 400 as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#EADFC5",
          color: BROWN,
          fontFamily: "Playfair",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 22, display: "flex", backgroundColor: BROWN }} />
        <div style={{ position: "absolute", top: 22, left: 0, right: 0, height: 4, display: "flex", backgroundColor: GOLD }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 22, display: "flex", backgroundColor: BROWN }} />
        <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, height: 4, display: "flex", backgroundColor: GOLD }} />
        <div
          style={{
            position: "absolute",
            top: 42,
            left: 42,
            right: 42,
            bottom: 42,
            display: "flex",
            border: `4px solid ${GOLD}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 54,
            left: 54,
            right: 54,
            bottom: 54,
            display: "flex",
            border: `1px solid ${MAROON}`,
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={LOTUS} width={180} height={81} style={{ marginTop: -6 }} />
        <div style={{ display: "flex", fontFamily: "Cinzel", fontSize: 26, letterSpacing: 6, color: MAROON, marginTop: 6 }}>
          {wedding.title.en.toUpperCase()}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 18 }}>
          <div style={{ display: "flex", fontFamily: "Script", fontSize: 104, color: MAROON, lineHeight: 1.1 }}>{groom.name.en}</div>
          <div style={{ display: "flex", fontFamily: "Cinzel", fontSize: 26, letterSpacing: 4, color: GOLD, marginTop: 14 }}>WEDS</div>
          <div style={{ display: "flex", fontFamily: "Script", fontSize: 104, color: MAROON, lineHeight: 1.1 }}>{bride.name.en}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
          <div style={{ width: 120, height: 2, display: "flex", backgroundColor: GOLD }} />
          <div style={{ width: 12, height: 12, display: "flex", backgroundColor: GOLD_LIGHT, border: `2px solid ${GOLD}`, transform: "rotate(45deg)" }} />
          <div style={{ width: 120, height: 2, display: "flex", backgroundColor: GOLD }} />
        </div>

        <div style={{ display: "flex", fontFamily: "Cinzel", fontSize: 30, letterSpacing: 3, color: BROWN, marginTop: 22 }}>
          THURSDAY · 3 DECEMBER 2026 · MUHURTHAM 9:06 PM
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#5A3A24", marginTop: 10 }}>
          {`${venue.name.en}, Vijayawada`}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

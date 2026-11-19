import {
  Cinzel_Decorative,
  Great_Vibes,
  Noto_Serif_Telugu,
  Playfair_Display,
  Ramabhadra,
} from "next/font/google";

export const ramabhadra = Ramabhadra({
  weight: "400",
  subsets: ["telugu", "latin"],
  display: "swap",
  variable: "--font-ramabhadra",
});

// Not needed for the first (doors-closed) screen, whose few labels use Ramabhadra, so they don't compete with
// the doors for bandwidth.
export const notoSerifTelugu = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-telugu",
});

export const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-cinzel-decorative",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-playfair",
});

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-script",
});

/** The only family the first (Telugu, doors-closed) screen renders with. */
export const fontVariables = ramabhadra.variable;

/**
 * The other families are only defined once the invitation is opened or English is chosen, so the browser
 * doesn't download them while the doors (the LCP) are still loading. Defaults live in globals.css.
 */
export const deferredFontCss = `html.invitation-opened, html:lang(en) {
  --font-noto-serif-telugu: ${notoSerifTelugu.style.fontFamily};
  --font-script: ${greatVibes.style.fontFamily};
  --font-cinzel-decorative: ${cinzelDecorative.style.fontFamily};
  --font-playfair: ${playfairDisplay.style.fontFamily};
}`;

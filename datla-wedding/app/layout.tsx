import type { Metadata, Viewport } from "next";
import { deferredFontCss, fontVariables } from "@/lib/fonts";
import { Providers } from "@/components/providers/Providers";
import { OrnateBorder } from "@/components/ornaments/OrnateBorder";
import { DEFAULT_LANG, wedding } from "@/data/wedding";
import "./globals.css";

/** Link previews need absolute URLs; set NEXT_PUBLIC_SITE_URL to the deployed origin. */
function siteUrl() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : `http://localhost:${process.env.PORT || 3000}`));
}

const { groom, bride, events, venue } = wedding;
const TITLE = `${groom.name.en} weds ${bride.name.en} – 3 Dec 2026`;
const DESCRIPTION =
  `${wedding.title.te} 🪔 ${events.muhurtham.displayDay.en}, ${events.muhurtham.displayDate.en} · Muhurtham ${events.muhurtham.displayTime.en} · ` +
  `${venue.name.en}, Vijayawada. With the blessings of Sri Venkateswara Swamy, you are warmly invited.`;

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: wedding.title.en,
  openGraph: {
    type: "website",
    url: "/",
    siteName: wedding.title.en,
    locale: "te_IN",
    alternateLocale: "en_IN",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#6B1E1E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={DEFAULT_LANG} className={fontVariables} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: deferredFontCss }} />
      </head>
      <body className="antialiased">
        <Providers>
          <OrnateBorder />
          {children}
        </Providers>
      </body>
    </html>
  );
}

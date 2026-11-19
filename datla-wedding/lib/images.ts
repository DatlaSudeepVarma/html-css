import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { findPublicAsset } from "./assets";

const RASTER_EXTENSIONS = ["webp", "avif", "jpg", "jpeg", "png"] as const;

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  /** Tiny blurred WebP shown while the optimised image loads. */
  blurDataURL: string;
}

/** Server-only. Finds `/public/assets/<basename>.*` and returns what next/image needs to avoid layout shift. */
export async function getImageAsset(basename: string): Promise<ImageAsset | null> {
  const src = findPublicAsset(basename, RASTER_EXTENSIONS);
  if (!src) return null;
  const file = path.join(process.cwd(), "public", src);
  const version = Math.floor(fs.statSync(file).mtimeMs);
  const image = sharp(file);
  const { width = 1, height = 1 } = await image.metadata();
  const blur = await image.clone().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return { src: `${src}?v=${version}`, width, height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
}

/** URL of the Next.js-optimised (AVIF/WebP, resized) version, for places next/image can't render, like WebGL textures. */
export const optimizedImageUrl = (src: string, width: 640 | 828 | 1080 | 1200 = 1080, quality = 80) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;

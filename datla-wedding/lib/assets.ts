import fs from "node:fs";
import path from "node:path";

/** Server-only: returns `/assets/<basename>.<ext>` for the first extension that exists in /public/assets. */
export function findPublicAsset(basename: string, extensions: readonly string[]): string | null {
  const dir = path.join(process.cwd(), "public", "assets");
  const ext = extensions.find((e) => fs.existsSync(path.join(dir, `${basename}.${e}`)));
  return ext ? `/assets/${basename}.${ext}` : null;
}

export const IMAGE_EXTENSIONS = ["webp", "png", "jpg", "jpeg", "avif", "svg"] as const;
export const AUDIO_EXTENSIONS = ["mp3", "ogg", "m4a", "wav"] as const;

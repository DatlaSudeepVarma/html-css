import { SRGBColorSpace, type Texture } from "three";

export * from "./layout";

export function prepareTexture(tex: Texture) {
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

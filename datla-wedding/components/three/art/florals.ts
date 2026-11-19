import { GOLD_GRADIENT, petal, petalRing } from "./svg";

/** Faint gold & lotus-pink mandala used as the deepest parallax layer. */
export const backgroundFloralSvg = () => {
  const c = 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g opacity=".55">
    <circle cx="${c}" cy="${c}" r="470" fill="none" stroke="#B8893B" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>
    <circle cx="${c}" cy="${c}" r="440" fill="none" stroke="#B8893B" stroke-width="1.5" opacity=".6"/>
    ${petalRing({ cx: c, cy: c, count: 40, inner: 360, length: 70, width: 14, fill: "#D4AF6A", opacity: 0.35 })}
    ${petalRing({ cx: c, cy: c, count: 24, inner: 220, length: 130, width: 30, fill: "none", stroke: "#B8893B", strokeWidth: 2.5, opacity: 0.55, offset: 7.5 })}
    ${petalRing({ cx: c, cy: c, count: 16, inner: 90, length: 150, width: 46, fill: "#E8A3A7", stroke: "#B8893B", strokeWidth: 2, opacity: 0.3 })}
    <circle cx="${c}" cy="${c}" r="80" fill="none" stroke="#B8893B" stroke-width="2.5"/>
  </g>
</svg>`;
};

/** Front-layer lotus bloom with leaves, anchored bottom-center. */
export const lotusBloomSvg = () => {
  const p = petal(42, 11);
  const petals = (angles: number[], fill: string, scale: number) =>
    angles
      .map((a) => `<path d="${p}" transform="rotate(${a}) scale(${scale})" fill="${fill}" stroke="#9E4A5A" stroke-width=".35"/>`)
      .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    ${GOLD_GRADIENT("g")}
    <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C96B7A"/><stop offset="1" stop-color="#FBE3E1"/></linearGradient>
    <linearGradient id="pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8A3A7"/><stop offset="1" stop-color="#FFF1EE"/></linearGradient>
    <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A8B3C"/><stop offset="1" stop-color="#3E4A1A"/></linearGradient>
  </defs>
  <ellipse cx="120" cy="470" rx="130" ry="34" fill="url(#leaf)" stroke="#B8893B" stroke-width="2"/>
  <path d="M120 470 L40 456 M120 470 L200 452 M120 470 L120 438" stroke="#D4AF6A" stroke-width="1.5"/>
  <path d="M256 500 C150 500 40 460 14 380 C110 396 206 430 256 500Z" fill="url(#leaf)" stroke="#B8893B" stroke-width="2"/>
  <path d="M256 500 C362 500 472 460 498 380 C402 396 306 430 256 500Z" fill="url(#leaf)" stroke="#B8893B" stroke-width="2"/>
  <g transform="translate(256 430)">
    ${petals([-82, 82, -62, 62], "url(#pb)", 4.4)}
    ${petals([-40, 40, -20, 20, 0], "url(#pf)", 4.8)}
    <ellipse cx="0" cy="6" rx="58" ry="14" fill="url(#g)"/>
    ${[-30, -15, 0, 15, 30].map((x) => `<circle cx="${x}" cy="${-22 - (30 - Math.abs(x)) / 2}" r="5" fill="#E9C46A"/>`).join("")}
  </g>
</svg>`;
};

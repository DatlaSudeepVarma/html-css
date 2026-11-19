import { GOLD_GRADIENT, petal } from "./svg";

/**
 * Stand-in for the Balaji & Padmavathi image until /public/assets/balaji-padmavathi.* is added.
 * Same aspect ratio as the arch opening (PORTRAIT_W / PORTRAIT_H).
 */
export const deityPlaceholderSvg = () => {
  const rays = Array.from(
    { length: 36 },
    (_, i) => `<path d="M80 96 L${80 + 160 * Math.cos((i * Math.PI) / 18)} ${96 + 160 * Math.sin((i * Math.PI) / 18)}" stroke="#D4AF6A" stroke-width="${i % 2 ? 0.6 : 1.4}" opacity=".35"/>`,
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="992" viewBox="0 0 160 248">
  <defs>
    ${GOLD_GRADIENT("g")}
    <radialGradient id="bg" cx=".5" cy=".38" r=".75">
      <stop offset="0" stop-color="#A3322A"/><stop offset=".55" stop-color="#6B1E1E"/><stop offset="1" stop-color="#2E0A0A"/>
    </radialGradient>
    <radialGradient id="halo">
      <stop offset="0" stop-color="#FFF4CC" stop-opacity=".95"/><stop offset=".55" stop-color="#F3DFA2" stop-opacity=".45"/><stop offset="1" stop-color="#D4AF6A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="160" height="248" fill="url(#bg)"/>
  ${rays}
  <circle cx="80" cy="96" r="66" fill="url(#halo)"/>
  <circle cx="80" cy="96" r="50" fill="none" stroke="url(#g)" stroke-width="2"/>
  <circle cx="80" cy="96" r="44" fill="none" stroke="#F3DFA2" stroke-width=".8" stroke-dasharray="1 3"/>
  <path d="M60 70 V98 C60 124 100 124 100 98 V70" fill="none" stroke="url(#g)" stroke-width="14" stroke-linecap="round"/>
  <path d="M60 70 V98 C60 124 100 124 100 98 V70" fill="none" stroke="#FFFDF7" stroke-width="10" stroke-linecap="round"/>
  <path d="M80 72 C75 92 76 114 80 126 C84 114 85 92 80 72Z" fill="#D7261E"/>
  <g transform="translate(0 4)">
    ${[-80, -60, -40, -20, 0, 20, 40, 60, 80]
      .map((a) => `<path d="${petal(30, 9)}" transform="translate(80 212) rotate(${a})" fill="#E8A3A7" stroke="#B8893B" stroke-width=".8"/>`)
      .join("")}
    <rect x="34" y="210" width="92" height="10" rx="2" fill="url(#g)"/>
    <rect x="26" y="220" width="108" height="8" rx="2" fill="#8C6424"/>
  </g>
</svg>`;
};

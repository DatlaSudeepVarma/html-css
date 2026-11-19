import { GOLD_GRADIENT } from "./svg";

const wrap = (body: string, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs>${GOLD_GRADIENT("g")}${defs}</defs>${body}</svg>`;

/** Sri Venkateswara Namam: white U-tilak with the red central line. */
export const namamSvg = () =>
  wrap(`
  <path d="M74 52 V132 C74 204 182 204 182 132 V52" fill="none" stroke="url(#g)" stroke-width="40" stroke-linecap="round"/>
  <path d="M74 52 V132 C74 204 182 204 182 132 V52" fill="none" stroke="#FFFDF7" stroke-width="28" stroke-linecap="round"/>
  <path d="M128 60 C116 108 117 160 128 200 C139 160 140 108 128 60Z" fill="#D7261E" stroke="#8C1A10" stroke-width="2"/>
  <path d="M104 214 H152" stroke="url(#g)" stroke-width="10" stroke-linecap="round"/>
`);

/** Panchajanya shankha (conch). */
export const shankhaSvg = () =>
  wrap(
    `
  <g transform="rotate(-24 128 128)">
    <path d="M128 26 C172 38 198 80 192 130 C188 168 162 198 128 232 C94 198 68 168 64 130 C58 80 84 38 128 26Z" fill="url(#shell)" stroke="url(#g)" stroke-width="7"/>
    <g fill="none" stroke="#B8893B" stroke-width="3.5" stroke-linecap="round">
      <path d="M128 30 C140 54 150 74 150 98"/>
      <path d="M82 70 C110 82 146 82 174 70"/>
      <path d="M70 110 C106 126 150 126 186 110"/>
      <path d="M74 152 C106 168 150 168 182 152"/>
      <path d="M128 232 C118 212 110 190 108 160"/>
    </g>
    <circle cx="128" cy="26" r="10" fill="url(#g)" stroke="#6B4A17" stroke-width="2"/>
    <path d="M100 196 H156" stroke="url(#g)" stroke-width="8" stroke-linecap="round"/>
  </g>`,
    `<linearGradient id="shell" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFDF5"/><stop offset=".6" stop-color="#F3E6CC"/><stop offset="1" stop-color="#D9C29A"/>
    </linearGradient>`,
  );

/** Sudarshana chakra. */
export const chakraSvg = () => {
  const flames = Array.from(
    { length: 16 },
    (_, i) => `<path d="M128 18 C120 34 120 42 128 50 C136 42 136 34 128 18Z" fill="url(#g)" stroke="#6B4A17" stroke-width="1.5" transform="rotate(${i * 22.5} 128 128)"/>`,
  ).join("");
  const spokes = Array.from(
    { length: 12 },
    (_, i) => `<path d="M128 106 L132 62 L128 56 L124 62Z" fill="url(#g)" stroke="#6B4A17" stroke-width="1" transform="rotate(${i * 30} 128 128)"/>`,
  ).join("");
  return wrap(`
  ${flames}
  <circle cx="128" cy="128" r="76" fill="#FFF4CC" opacity=".25"/>
  <circle cx="128" cy="128" r="76" fill="none" stroke="url(#g)" stroke-width="12"/>
  <circle cx="128" cy="128" r="76" fill="none" stroke="#6B1E1E" stroke-width="2" stroke-dasharray="3 7"/>
  ${spokes}
  <circle cx="128" cy="128" r="24" fill="url(#g)" stroke="#6B4A17" stroke-width="2"/>
  <circle cx="128" cy="128" r="9" fill="#6B1E1E"/>
`);
};

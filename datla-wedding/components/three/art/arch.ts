import { GOLD_GRADIENT } from "./svg";

/**
 * Golden mandapam arch, 600×800 viewBox. The opening is transparent:
 * x 130–470, y 205–740 (see PORTRAIT_* constants in hero/constants.ts).
 */
export function archSvg() {
  const marigolds = (x: number) =>
    Array.from({ length: 22 }, (_, i) => {
      const y = 372 + i * 16;
      const fill = i % 2 ? "#F6B820" : "#E07B2A";
      return `<circle cx="${x}" cy="${y}" r="8.5" fill="${fill}" stroke="#B85A14" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3" fill="#FFE08A" opacity=".7"/>`;
    }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 600 800">
  <defs>
    ${GOLD_GRADIENT("g")}
    <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6B4A17"/><stop offset="1" stop-color="#8C6424"/>
    </linearGradient>
    <filter id="sh" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#3B2314" flood-opacity=".35"/>
    </filter>
  </defs>

  <g filter="url(#sh)">
    <path fill-rule="evenodd" fill="url(#g)" stroke="#6B4A17" stroke-width="3"
      d="M40 760 V340 C40 210 170 140 300 110 C430 140 560 210 560 340 V760 Z
         M130 742 V360 C130 270 210 225 300 205 C390 225 470 270 470 360 V742 Z"/>

    <rect x="20" y="756" width="560" height="24" fill="url(#g)" stroke="#6B4A17" stroke-width="3"/>
    <rect x="4" y="778" width="592" height="18" fill="url(#dark)" stroke="#6B4A17" stroke-width="2"/>
  </g>

  <path d="M130 742 V360 C130 270 210 225 300 205 C390 225 470 270 470 360 V742" fill="none" stroke="#6B1E1E" stroke-width="5"/>
  <path d="M116 742 V356 C116 258 202 208 300 186 C398 208 484 258 484 356 V742" fill="none" stroke="#FFF4CC" stroke-width="7" stroke-dasharray="0 15" stroke-linecap="round"/>
  <path d="M54 760 V342 C54 220 178 154 300 126 C422 154 546 220 546 342 V760" fill="none" stroke="#6B4A17" stroke-width="2"/>
  <path d="M66 756 V344 C66 228 184 166 300 140 C416 166 534 228 534 344 V756" fill="none" stroke="#FFF4CC" stroke-width="5" stroke-dasharray="0 13" stroke-linecap="round" opacity=".85"/>

  ${[40, 470]
    .map(
      (x) => `
    <rect x="${x}" y="350" width="90" height="16" fill="#6B1E1E" stroke="#6B4A17" stroke-width="2"/>
    <rect x="${x}" y="726" width="90" height="16" fill="#6B1E1E" stroke="#6B4A17" stroke-width="2"/>`,
    )
    .join("")}
  ${marigolds(85)}
  ${marigolds(515)}
  <path d="M85 726 l-9 14 h18z M515 726 l-9 14 h18z" fill="#C42B45"/>

  <circle cx="300" cy="166" r="15" fill="#6B1E1E" stroke="#FFF4CC" stroke-width="3"/>
  <circle cx="300" cy="166" r="5" fill="#F3DFA2"/>

  <g transform="translate(300 106)">
    <rect x="-30" y="-6" width="60" height="10" fill="url(#g)" stroke="#6B4A17" stroke-width="2"/>
    <path d="M-24 -6 C-34 -24 -20 -42 0 -44 C20 -42 34 -24 24 -6 Z" fill="url(#g)" stroke="#6B4A17" stroke-width="2"/>
    <rect x="-9" y="-56" width="18" height="12" fill="url(#g)" stroke="#6B4A17" stroke-width="2"/>
    <path d="M-8 -54 C-32 -64 -44 -54 -48 -46 C-32 -46 -20 -48 -8 -54Z M8 -54 C32 -64 44 -54 48 -46 C32 -46 20 -48 8 -54Z" fill="#5E6B2E" stroke="#3E4A1A" stroke-width="1.5"/>
    <path d="M0 -84 C-12 -70 -13 -60 0 -56 C13 -60 12 -70 0 -84Z" fill="#C9962E" stroke="#6B4A17" stroke-width="2"/>
  </g>
</svg>`;
}

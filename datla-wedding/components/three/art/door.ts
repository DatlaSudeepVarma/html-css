import { GOLD_GRADIENT, petal } from "./svg";

/**
 * Carved temple door (the left leaf; the handle sits on the inner/right edge).
 * Generated at a given pixel size so panels keep their proportions instead of stretching.
 */
export function doorSvg(w: number, h: number) {
  const m = 26;
  const gap = 20;
  const rows = Math.max(2, Math.round((h - 2 * m) / 270));
  const px = m + gap;
  const pw = w - 2 * px;
  const ph = (h - 2 * m - (rows + 1) * gap) / rows;

  const studsRow = (y: number) => {
    const n = Math.floor((w - 2 * m) / 46);
    const step = (w - 2 * m) / n;
    return Array.from({ length: n + 1 }, (_, i) => `<circle cx="${m + i * step}" cy="${y}" r="6.5" fill="url(#stud)"/>`).join("");
  };
  const studsCol = (x: number) => {
    const n = Math.floor((h - 2 * m) / 46);
    const step = (h - 2 * m) / n;
    return Array.from({ length: n + 1 }, (_, i) => `<circle cx="${x}" cy="${m + i * step}" r="6.5" fill="url(#stud)"/>`).join("");
  };

  const panels = Array.from({ length: rows }, (_, r) => {
    const y = m + gap + r * (ph + gap);
    const cx = px + pw / 2;
    const cy = y + ph / 2;
    const rad = Math.min(pw, ph) * 0.24;
    const petals = Array.from(
      { length: 8 },
      (_, i) => `<path d="${petal(rad * 0.95, rad * 0.32)}" transform="translate(${cx} ${cy}) rotate(${i * 45})" fill="url(#g)" stroke="#6B4A17" stroke-width="1.5"/>`,
    ).join("");
    return `
      <rect x="${px}" y="${y}" width="${pw}" height="${ph}" rx="6" fill="url(#panel)" stroke="url(#g)" stroke-width="5"/>
      <rect x="${px + 12}" y="${y + 12}" width="${pw - 24}" height="${ph - 24}" rx="4" fill="none" stroke="#B8893B" stroke-width="1.6" stroke-dasharray="2 5"/>
      <circle cx="${cx}" cy="${cy}" r="${rad * 1.12}" fill="none" stroke="#B8893B" stroke-width="2"/>
      ${petals}
      <circle cx="${cx}" cy="${cy}" r="${rad * 0.26}" fill="url(#stud)" stroke="#6B4A17" stroke-width="1.5"/>`;
  }).join("");

  const railYs = Array.from({ length: rows + 1 }, (_, r) => m + gap / 2 + r * (ph + gap));
  const hx = w - m - 48;
  const hy = h / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    ${GOLD_GRADIENT("g")}
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2E1A0E"/><stop offset=".45" stop-color="#4A2A16"/><stop offset="1" stop-color="#3B2314"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7A2424"/><stop offset="1" stop-color="#4A1212"/>
    </linearGradient>
    <radialGradient id="stud" cx=".35" cy=".35" r=".7">
      <stop offset="0" stop-color="#FFF4CC"/><stop offset=".45" stop-color="#D4AF6A"/><stop offset="1" stop-color="#6B4A17"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#wood)"/>
  <rect x="8" y="8" width="${w - 16}" height="${h - 16}" fill="none" stroke="url(#g)" stroke-width="9"/>
  <rect x="${m - 6}" y="${m - 6}" width="${w - 2 * m + 12}" height="${h - 2 * m + 12}" fill="none" stroke="#8C6424" stroke-width="2"/>
  ${panels}
  ${railYs.map(studsRow).join("")}
  ${studsCol(m + gap / 2)}
  ${studsCol(w - m - gap / 2)}
  <rect x="${hx - 22}" y="${hy - 60}" width="44" height="120" rx="20" fill="url(#g)" stroke="#6B4A17" stroke-width="2"/>
  <circle cx="${hx}" cy="${hy + 34}" r="30" fill="none" stroke="url(#g)" stroke-width="9"/>
  <circle cx="${hx}" cy="${hy}" r="12" fill="url(#stud)" stroke="#6B4A17" stroke-width="2"/>
</svg>`;
}

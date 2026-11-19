export const svgUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const GOLD_GRADIENT = (id: string) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8C6424"/>
    <stop offset=".28" stop-color="#E9C77B"/>
    <stop offset=".5" stop-color="#B8893B"/>
    <stop offset=".74" stop-color="#F3DFA2"/>
    <stop offset="1" stop-color="#8C6424"/>
  </linearGradient>`;

/** Teardrop petal pointing up (-y) from the origin. */
export const petal = (length: number, width: number) =>
  `M0 0 C${-width} ${-length * 0.3} ${-width * 0.8} ${-length * 0.75} 0 ${-length} ` +
  `C${width * 0.8} ${-length * 0.75} ${width} ${-length * 0.3} 0 0Z`;

export function petalRing(opts: {
  cx: number;
  cy: number;
  count: number;
  inner: number;
  length: number;
  width: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  offset?: number;
}) {
  const { cx, cy, count, inner, length, width, fill, stroke = "none", strokeWidth = 2, opacity = 1, offset = 0 } = opts;
  return Array.from(
    { length: count },
    (_, i) =>
      `<path d="${petal(length, width)}" transform="translate(${cx} ${cy}) rotate(${(i * 360) / count + offset}) translate(0 ${-inner})" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`,
  ).join("");
}

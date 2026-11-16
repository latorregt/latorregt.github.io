export function formatGTQ(n: number): string {
  if (!Number.isFinite(n)) return "Q 0.00";
  const s = n.toFixed(2);
  const [whole, frac] = s.split(".");
  const withSep = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `Q ${withSep}.${frac}`;
}
export function discountPct(precio: number, tarjeta: number | null): number | null {
  if (!tarjeta || tarjeta <= 0 || precio <= 0) return null;
  const pct = Math.round((1 - precio / tarjeta) * 100);
  return pct > 0 && pct < 100 ? pct : null;
}
export function waLink(text: string): string {
  return `https://wa.me/50257445909?text=${encodeURIComponent(text)}`;
}
export function sortTallas(tallas: string[]): string[] {
  const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const numeric: number[] = [];
  const alpha: string[] = [];
  for (const t of tallas) {
    const n = parseFloat(t);
    if (!isNaN(n) && /^[\d.]+$/.test(t)) numeric.push(n);
    else alpha.push(t);
  }
  numeric.sort((a, b) => a - b);
  alpha.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
  return [...numeric.map(n => String(n)), ...alpha];
}

/**
 * Rutas de las imágenes optimizadas.
 *
 * Los datos (products.ts, componentes) guardan la ruta "lógica" del original,
 * p. ej. `/images/productos/Camisa (1).png`. `scripts/optimize-images.mjs` genera
 * las variantes `Camisa__1__png-{200,600,1200}.{webp,avif}` y aquí se calcula la
 * misma ruta. Si cambias la regla, cámbiala en los dos archivos.
 */
// 1920 solo existe para las fotos de marca (hero): se pide explícitamente con `widths`.
export const IMAGE_WIDTHS = [200, 600, 1200] as const
export type ImageFormat = 'webp' | 'avif'

function variantStem(src: string): string {
  const slash = src.lastIndexOf('/')
  const dir = src.slice(0, slash + 1)
  const file = src.slice(slash + 1)
  const dot = file.lastIndexOf('.')
  if (dot <= 0) return src
  const base = file.slice(0, dot).replace(/[^A-Za-z0-9._-]/g, '_')
  return `${dir}${base}_${file.slice(dot + 1).toLowerCase()}`
}

/** URL de una variante optimizada. */
export function imageUrl(src: string, width: number = 600, format: ImageFormat = 'webp'): string {
  if (!src || !src.startsWith('/images/')) return src
  return `${variantStem(src)}-${width}.${format}`
}

/** srcset con todas las variantes de un formato. */
export function imageSrcSet(src: string, format: ImageFormat, widths: readonly number[] = IMAGE_WIDTHS): string {
  return widths.map(w => `${imageUrl(src, w, format)} ${w}w`).join(', ')
}

/** JPG para la vista previa al compartir (solo existe para la 1ª imagen de cada producto). */
export function ogImageUrl(src: string): string {
  if (!src || !src.startsWith('/images/')) return src
  return `${variantStem(src)}-og.jpg`
}

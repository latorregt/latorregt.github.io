import type { CSSProperties } from 'react'
import { IMAGE_WIDTHS, imageSrcSet, imageUrl } from '@/lib/boutique/images'

interface PictureProps {
  /** Ruta lógica del original, p. ej. /images/productos/Camisa.png */
  src: string
  alt: string
  /** Ancho que ocupa en pantalla (atributo `sizes`), para que el navegador elija el archivo justo. */
  sizes: string
  className?: string
  style?: CSSProperties
  /** Las imágenes fuera de la primera pantalla se cargan solo al acercarse (lazy). */
  loading?: 'lazy' | 'eager'
  priority?: boolean
  widths?: readonly number[]
  draggable?: boolean
  ariaHidden?: boolean
}

/**
 * Imagen optimizada: AVIF → WebP, en varios tamaños. El <picture> usa
 * `display: contents` para no alterar el layout: las clases van en el <img>.
 */
export function Picture({ src, alt, sizes, className = '', style, loading = 'lazy', priority = false, widths = IMAGE_WIDTHS, draggable, ariaHidden }: PictureProps) {
  if (!src) return <div className={`bg-cream-deep flex items-center justify-center ${className}`}><span className="text-muted-foreground text-xs">Sin imagen</span></div>
  const fallbackWidth = widths.includes(600) ? 600 : widths[0]
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={imageSrcSet(src, 'avif', widths)} sizes={sizes} />
      <source type="image/webp" srcSet={imageSrcSet(src, 'webp', widths)} sizes={sizes} />
      <img
        src={imageUrl(src, fallbackWidth, 'webp')}
        alt={alt}
        className={className}
        style={style}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={draggable}
        aria-hidden={ariaHidden || undefined}
      />
    </picture>
  )
}

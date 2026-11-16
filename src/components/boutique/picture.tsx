'use client'

interface PictureProps { src: string; alt: string; className?: string; loading?: 'lazy' | 'eager' }
export function Picture({ src, alt, className = '', loading = 'lazy' }: PictureProps) {
  if (!src) return <div className={`bg-cream-deep flex items-center justify-center ${className}`}><span className="text-muted-foreground text-xs">Sin imagen</span></div>
  return <img src={src} alt={alt} className={className} loading={loading} decoding="async" />
}

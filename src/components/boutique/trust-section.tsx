'use client'
import { useState } from 'react'
import { reviews } from '@/data/reviews'
import { Picture } from '@/components/boutique/picture'

export function TrustSection() {
  const [reviewIdx, setReviewIdx] = useState(0)
  const [photoIdx, setPhotoIdx] = useState(0)
  const customerPhotos = ['/images/marca/WhatsApp_Image_2026-11-14_at_20.36.48_(1).jpeg', '/images/marca/WhatsApp_Image_2026-09-09_at_9.07.23_PM_(1).jpeg', '/images/marca/cliente_foto_3.jpg', '/images/marca/cliente_foto_4.jpg'].filter(Boolean)
  const maxReviews = Math.max(reviews.length - 2, 1)
  const maxPhotos = Math.max(customerPhotos.length - 2, 1)
  let visibleReviews = reviews.slice(reviewIdx, reviewIdx + 3)
  if (visibleReviews.length < 3 && reviews.length >= 3) visibleReviews.push(...reviews.slice(0, 3 - visibleReviews.length))
  let visiblePhotos = customerPhotos.slice(photoIdx, photoIdx + 2)
  if (visiblePhotos.length < 2 && customerPhotos.length >= 2) visiblePhotos.push(...customerPhotos.slice(0, 2 - visiblePhotos.length))

  return (
    <section className="bg-midnight py-20 md:py-28 text-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-left mb-8"><h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">Vestimos momentos, Construimos confianza</h2><p className="text-xs tracking-[0.15em] uppercase text-cream/60">reseñas extraídas del sitio oficial de la tienda en Google</p></div>
        <div className="relative mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{(visibleReviews.length > 0 ? visibleReviews : reviews.slice(0, 3)).map((r, i) => (<article key={i} className="bg-midnight-light/40 border border-cream/10 rounded-lg p-5 flex flex-col"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-gold text-midnight flex items-center justify-center font-serif text-lg font-semibold">{r.nombre.charAt(0).toUpperCase()}</div><div><p className="font-medium text-sm">{r.nombre}</p><p className="text-[10px] uppercase tracking-wider text-cream/60">{r.fecha}</p></div></div><div className="flex gap-0.5 mb-2">{Array.from({ length: 5 }).map((_, s) => (<svg key={s} className={`w-3.5 h-3.5 ${s < r.estrellas ? 'text-gold' : 'text-cream/20'}`} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>))}</div><p className="text-xs text-cream/85 italic leading-relaxed flex-1">&ldquo;{r.comentario}&rdquo;</p></article>))}</div>
          {reviews.length > 3 && (<><button onClick={() => setReviewIdx(i => (i - 1 + maxReviews) % maxReviews)} aria-label="Reseñas anteriores" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-midnight-light text-cream w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-midnight transition-colors z-10"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button><button onClick={() => setReviewIdx(i => (i + 1) % maxReviews)} aria-label="Reseñas siguientes" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-midnight-light text-cream w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-midnight transition-colors z-10"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button></>)}
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">{visiblePhotos.map((src, i) => (<div key={i} className="aspect-[4/5] overflow-hidden rounded-lg"><Picture src={src} alt="Cliente de Boutique La Torre" className="w-full h-full object-cover" sizes="(min-width: 768px) 370px, 46vw" /></div>))}</div>
          {customerPhotos.length > 2 && (<><button onClick={() => setPhotoIdx(i => (i - 1 + maxPhotos) % maxPhotos)} aria-label="Fotos anteriores" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-midnight-light text-cream w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-midnight transition-colors z-10"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button><button onClick={() => setPhotoIdx(i => (i + 1) % maxPhotos)} aria-label="Fotos siguientes" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-midnight-light text-cream w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-midnight transition-colors z-10"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button></>)}
        </div>
      </div>
    </section>
  )
}

'use client'

import { BRAND } from '@/lib/boutique/brand'
import { track } from '@/lib/boutique/analytics'

export function InfoSection() {
  return (
    <section id="info" className="py-20 md:py-28 bg-cream-deep">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Información</p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-midnight mb-2">Visítanos en Nuestra Tienda Física</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Te esperamos con atención personalizada, probadores cómodos y las últimas colecciones de tus marcas favoritas.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <div className="flex gap-4 mb-7">
              <div className="flex-shrink-0 w-11 h-11 bg-midnight flex items-center justify-center text-cream rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-midnight mb-1">Dirección</h3>
                <p className="text-sm text-foreground/80">{BRAND.address}, {BRAND.city} · {BRAND.addressNote}</p>
              </div>
            </div>

            <div className="flex gap-4 mb-7">
              <div className="flex-shrink-0 w-11 h-11 bg-midnight flex items-center justify-center text-cream rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-midnight mb-1">Horario de Atención</h3>
                <p className="text-sm text-foreground/80">
                  Lunes a Domingo <strong className="font-semibold text-midnight">{BRAND.hoursBold}</strong>
                  <br />
                  <em className="text-xs text-muted-foreground">{BRAND.hoursNote}</em>
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-7">
              <div className="flex-shrink-0 w-11 h-11 bg-midnight flex items-center justify-center text-cream rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-midnight mb-1">Contacto</h3>
                <p className="text-sm text-foreground/80">
                  {BRAND.phone} ·{' '}
                  <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-whatsapp-dark hover:underline inline-flex items-center gap-1" onClick={() => track('contact_whatsapp_click')}>
                    Escríbenos por WhatsApp
                  </a>
                  <br />
                  <a href={`mailto:${BRAND.email}`} className="text-midnight hover:text-gold transition-colors">{BRAND.email}</a>
                </p>
              </div>
            </div>

            <div className="mb-7 p-4 border border-gold/30 bg-gold/5 rounded-lg flex items-center gap-3">
              <svg className="w-6 h-6 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p className="text-sm text-midnight font-medium">{BRAND.shippingNote} con {BRAND.shippingCarriers}.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={BRAND.maps.google} target="_blank" rel="noopener noreferrer" onClick={() => track('maps_click', { dest: 'google' })}
                 className="btn-lift px-4 py-2 text-xs bg-midnight text-cream uppercase tracking-wider font-medium rounded-full flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                GOOGLE MAPS
              </a>
              <a href={BRAND.maps.waze} target="_blank" rel="noopener noreferrer" onClick={() => track('maps_click', { dest: 'waze' })}
                 className="btn-lift px-4 py-2 text-xs bg-white border border-midnight text-midnight uppercase tracking-wider font-medium rounded-full hover:bg-midnight hover:text-cream flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                ABRIR EN WAZE
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg min-h-[400px] lg:min-h-full">
            <iframe src={BRAND.maps.embed} width="100%" height="100%" style={{ border: 0, minHeight: '400px' }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="Ubicación de Boutique La Torre en Google Maps" />
          </div>
        </div>
      </div>
    </section>
  )
}

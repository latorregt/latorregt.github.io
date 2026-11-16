'use client'

import { track } from '@/lib/boutique/analytics'

interface HeroProps {
  onColecciones: () => void
  onComoLlegar: () => void
}

export function Hero({ onColecciones, onComoLlegar }: HeroProps) {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden" aria-label="Sección de bienvenida">
      <div className="absolute inset-0">
        <img
          src="/images/marca/Boutique_La_Torre_iluminada_de_noche.png"
          alt="Boutique La Torre iluminada de noche en Santa Cruz del Quiché"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 15%' }}
          loading="eager"
          fetchPriority="high"
        />
        {/* Black opacity overlay (no color tint) - heavier at top and bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-cream py-24">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-4 drop-shadow-lg">
          DONDE EL BUEN VESTIR<br />ES TRADICIÓN
        </h1>
        <p className="text-sm md:text-base tracking-[0.2em] uppercase mb-10 text-cream/95 drop-shadow-md">
          PARA ÉL, PARA ELLA Y LOS PEQUEÑOS
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => { track('hero_colecciones_click'); onColecciones() }}
            className="btn-lift px-8 py-3.5 bg-gold text-midnight font-medium tracking-wider uppercase text-sm hover:bg-gold-light rounded-full"
          >
            COLECCIONES
          </button>
          <button
            onClick={() => { track('hero_como_llegar_click'); onComoLlegar() }}
            className="btn-lift px-8 py-3.5 border border-cream/80 text-cream font-medium tracking-wider uppercase text-sm hover:bg-cream hover:text-midnight rounded-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            CÓMO LLEGAR
          </button>
        </div>
      </div>
    </section>
  )
}

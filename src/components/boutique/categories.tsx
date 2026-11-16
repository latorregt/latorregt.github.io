'use client'

import { track } from '@/lib/boutique/analytics'

interface CategoriesProps {
  onSelect: (cat: string) => void
}

const CATS = [
  { key: 'Mujer', label: 'MUJER', image: '/images/categorias/Retrato_sereno_junto_a_la_ventana.png', alt: 'Mujer con prenda elegante junto a la ventana — categoría Mujer de La Torre' },
  { key: 'Hombre', label: 'HOMBRE', image: '/images/categorias/Retrato_editorial_con_chaqueta_azul_marino.png', alt: 'Hombre con chaqueta azul marino en retrato editorial — categoría Hombre de La Torre', big: true },
  { key: 'Juvenil,Infantil', label: 'NIÑOS', image: '/images/categorias/Risas_y_abrazos_en_el_sof_(1).png', alt: 'Niños riendo y abrazándose en el sofá — categorías Juvenil e Infantil de La Torre' },
]

export function Categories({ onSelect }: CategoriesProps) {
  return (
    <section id="categorias" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">— CATÁLOGO —</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-midnight mb-3">Nuestras Colecciones</h2>
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">EXPLORA TU IDENTIDAD</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          {CATS.map(cat => (
            <button
              key={cat.key}
              onClick={() => { track('category_card_click', { cat: cat.key }); onSelect(cat.key) }}
              className={`cat-card group relative overflow-hidden ${cat.big ? 'md:scale-110 md:z-10' : ''}`}
              aria-label={`Ver colección ${cat.label}`}
            >
              <div className={`relative ${cat.big ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
                <img src={cat.image} alt={cat.alt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
                  <span className={`font-serif font-semibold text-cream tracking-wider drop-shadow-lg ${cat.big ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
                    {cat.label}
                  </span>
                  <span className="text-cream/90 text-[10px] tracking-[0.25em] uppercase mt-2 group-hover:text-gold transition-colors">
                    VER COLECCIÓN →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

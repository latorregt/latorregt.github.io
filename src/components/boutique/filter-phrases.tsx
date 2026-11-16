'use client'

import { track } from '@/lib/boutique/analytics'

interface FilterPhrasesProps {
  onSelect: (filter: Record<string, string[]>) => void
}

const PHRASES: { label: string; filter: Record<string, string[]> }[] = [
  { label: 'Polos Tendencia', filter: { categorias: ['Hombre'], tipos: ['Polos'] } },
  { label: 'Prendas Infantiles', filter: { categorias: ['Infantil'] } },
  { label: "Levi's", filter: { marcas: ["Levi's"] } },
  { label: 'Jeans Dama', filter: { categorias: ['Mujer'], tipos: ['Pantalones'], subtipos: ['Jeans'] } },
  { label: 'Original Penguin', filter: { marcas: ['Original Penguin'], categorias: ['Hombre'] } },
  { label: 'Chumpas de Invierno', filter: { tipos: ['Chumpas'] } },
  { label: 'Accesorios', filter: { categorias: ['Hombre'], tipos: ['Accesorios'] } },
  { label: 'Moda Juvenil', filter: { categorias: ['Juvenil'] } },
]

export function FilterPhrases({ onSelect }: FilterPhrasesProps) {
  const items = [...PHRASES, ...PHRASES]
  return (
    <section aria-label="Palabras clave" className="bg-cream py-8 overflow-hidden no-scrollbar">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {items.map((p, i) => {
          const filled = i % 2 === 0
          return (
            <button
              key={i}
              onClick={() => { track('filter_phrase_click', { phrase: p.label }); onSelect(p.filter) }}
              className={`mx-8 text-xl md:text-2xl tracking-[0.15em] uppercase font-extrabold transition-colors ${
                filled
                  ? 'text-midnight hover:text-gold'
                  : 'text-outline hover:text-gold'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

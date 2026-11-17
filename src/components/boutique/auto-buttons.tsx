'use client'
import { useState } from 'react'
import { track } from '@/lib/boutique/analytics'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AutoButtonsProps {
  type: 'ninos' | 'pantalones_hombre' | 'pantalones_mujer' | 'pantalones_juvenil' | 'pantalones_infantil'
  onNavigate: (filter: Record<string, string[]>) => void
}

const BUTTONS: Record<AutoButtonsProps['type'], { label: string; estilo: string }[]> = {
  ninos: [
    { label: 'JUVENIL', estilo: '' },
    { label: 'INFANTIL', estilo: '' },
  ],
  pantalones_hombre: [
    { label: 'Skinny', estilo: 'Skinny' }, { label: 'Slim', estilo: 'Slim' },
    { label: 'Straight', estilo: 'Straight' }, { label: 'Baggy / Loose', estilo: 'Baggy / Loose' },
    { label: '505', estilo: '505' }, { label: '511', estilo: '511' },
    { label: '512', estilo: '512' }, { label: '502', estilo: '502' },
    { label: '514', estilo: '514' },
      ],
  pantalones_mujer: [
    { label: 'Skinny', estilo: 'Skinny' }, { label: 'Colombiano', estilo: 'Colombiano' },
    { label: 'Bootcut', estilo: 'Bootcut' }, { label: 'Wide Leg', estilo: 'Wide Leg' },
  ],
  pantalones_juvenil: [
    { label: 'Skinny', estilo: 'Skinny' }, { label: 'Slim', estilo: 'Slim' },
    { label: 'Straight', estilo: 'Straight' }, { label: 'Baggy', estilo: 'Baggy / Loose' },
  ],
  pantalones_infantil: [
    { label: 'Skinny', estilo: 'Skinny' }, { label: 'Slim', estilo: 'Slim' },
    { label: 'Straight', estilo: 'Straight' },
  ],
}

const CATEGORY_MAP: Record<AutoButtonsProps['type'], string> = {
  ninos: '', pantalones_hombre: 'Hombre', pantalones_mujer: 'Mujer',
  pantalones_juvenil: 'Juvenil', pantalones_infantil: 'Infantil',
}

export function AutoButtons({ type, onNavigate }: AutoButtonsProps) {
  const buttons = BUTTONS[type]
  const [scrollIdx, setScrollIdx] = useState(0)
  const maxVisible = type === 'pantalones_hombre' ? 9 : buttons.length
  const needsScroll = buttons.length > maxVisible

  const handleClick = (btn: { label: string; estilo: string }) => {
    track('auto_button_click', { type, label: btn.label })
    if (type === 'ninos') {
      if (btn.label === 'JUVENIL') onNavigate({ categorias: ['Juvenil'] })
      else onNavigate({ categorias: ['Infantil'] })
    } else {
      const cat = CATEGORY_MAP[type]
      onNavigate({ categorias: [cat], tipos: ['Pantalones'], estilos: [btn.estilo] })
    }
  }

  if (!needsScroll) {
    return (
      <div className="bg-cream-deep rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
          {buttons.map((btn) => (
            <button key={btn.label} onClick={() => handleClick(btn)}
              className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-midnight/15 hover:border-gold hover:bg-gold/5 transition-colors flex items-center justify-center text-center">
              <span className="text-[10px] md:text-xs uppercase tracking-wider font-medium text-midnight px-2 leading-tight">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const buttonW = 112
  const gapW = 16
  const step = buttonW + gapW

  return (
    <div className="bg-cream-deep rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-2">
        {scrollIdx > 0 && (
          <button onClick={() => setScrollIdx(i => Math.max(0, i - 1))}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-midnight/15 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors" aria-label="Anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <div className="overflow-hidden flex-1">
          <div className="flex items-center gap-3 md:gap-4 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${scrollIdx * step}px)` }}>
            {buttons.map((btn) => (
              <button key={btn.label} onClick={() => handleClick(btn)}
                className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-midnight/15 hover:border-gold hover:bg-gold/5 transition-colors flex items-center justify-center text-center">
                <span className="text-[10px] md:text-xs uppercase tracking-wider font-medium text-midnight px-2 leading-tight">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
        {scrollIdx < buttons.length - maxVisible && (
          <button onClick={() => setScrollIdx(i => Math.min(buttons.length - maxVisible, i + 1))}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-midnight/15 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors" aria-label="Siguiente">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

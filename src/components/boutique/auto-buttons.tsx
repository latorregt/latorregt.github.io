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
    { label: 'Straight', estilo: 'Straight' }, { label: 'Loose', estilo: 'Baggy / Loose' },
    { label: '501', estilo: '501' }, { label: '505', estilo: '505' },
    { label: '510', estilo: '510' }, { label: '511', estilo: '511' },
    { label: '512', estilo: '512' }, { label: '514', estilo: '514' },
    { label: '812', estilo: '812' }, { label: '814', estilo: '814' },
    { label: '816', estilo: '816' },
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
  const maxVisible = 9
  const needsScroll = buttons.length > maxVisible
  const visibleButtons = needsScroll ? buttons.slice(scrollIdx, scrollIdx + maxVisible) : buttons

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

  return (
    <div className="bg-cream-deep rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        {needsScroll && scrollIdx > 0 && (
          <button onClick={() => setScrollIdx(i => Math.max(0, i - 1))} className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-midnight/15 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors" aria-label="Anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden justify-center flex-1">
          {visibleButtons.map((btn) => (
            <button key={btn.label} onClick={() => handleClick(btn)} className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-midnight/15 hover:border-gold hover:bg-gold/5 transition-colors flex items-center justify-center text-center">
              <span className="text-[10px] md:text-xs uppercase tracking-wider font-medium text-midnight px-2 leading-tight">{btn.label}</span>
            </button>
          ))}
        </div>
        {needsScroll && scrollIdx < buttons.length - maxVisible && (
          <button onClick={() => setScrollIdx(i => Math.min(buttons.length - maxVisible, i + 1))} className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-midnight/15 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors" aria-label="Siguiente">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

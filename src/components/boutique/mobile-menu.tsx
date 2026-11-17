'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronDown, Search } from 'lucide-react'
import { tiposByCategoria } from '@/data/filters'
import { submenu } from '@/lib/boutique/catalog'
import { Logo } from './logo'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  onPick: (cat: string, tipo?: string, subtipos?: string[]) => void
  onSale: () => void
  onSearch: () => void
  onHome: () => void
}

const SECCIONES = [
  { label: 'Hombre', cats: [{ label: '', cat: 'Hombre' }] },
  { label: 'Mujer', cats: [{ label: '', cat: 'Mujer' }] },
  { label: 'Niños', cats: [{ label: 'Juvenil · 10 a 18 años', cat: 'Juvenil' }, { label: 'Infantil · 2 a 8 años', cat: 'Infantil' }] },
]

/**
 * Menú de pantalla completa para celular.
 * Va en un portal: el header tiene backdrop-blur y eso encerraría un `position: fixed` dentro del header.
 */
export function MobileMenu({ open, onClose, onPick, onSale, onSearch, onHome }: MobileMenuProps) {
  const [abierta, setAbierta] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="mobile-menu fixed inset-0 z-[60] bg-cream flex flex-col md:hidden" role="dialog" aria-modal="true" aria-label="Menú">
      <div className="flex items-center justify-between h-16 px-4 border-b border-midnight/10 flex-shrink-0">
        <Logo onClick={() => { onHome(); onClose() }} />
        <button onClick={onClose} aria-label="Cerrar menú" className="w-10 h-10 -mr-2 flex items-center justify-center text-midnight"><X className="w-6 h-6" /></button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pt-2 pb-10" aria-label="Categorías">
        {SECCIONES.map(sec => {
          const isOpen = abierta === sec.label
          return (
            <div key={sec.label} className="border-b border-midnight/10">
              <button onClick={() => setAbierta(isOpen ? null : sec.label)} aria-expanded={isOpen} className="w-full flex items-center justify-between py-5 text-left">
                <span className="font-serif text-2xl text-midnight">{sec.label}</span>
                <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden" inert={!isOpen}>
                  <div className="pb-5 space-y-5">
                    {sec.cats.map(c => (
                      <div key={c.cat}>
                        {c.label && <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium mb-2">{c.label}</p>}
                        <button onClick={() => onPick(c.cat)} className="text-sm text-midnight underline underline-offset-4 decoration-gold/50 mb-2">Ver todo</button>
                        <ul className="space-y-0.5">
                          {(tiposByCategoria[c.cat] || []).map(tipo => {
                            const subs = submenu(c.cat, tipo)
                            return (
                              <li key={tipo}>
                                <button onClick={() => onPick(c.cat, tipo)} className="w-full text-left py-2 text-[15px] text-midnight active:text-gold">{tipo}</button>
                                {subs.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pb-2">
                                    {subs.map(sub => (
                                      <button key={sub.label} onClick={() => onPick(c.cat, tipo, sub.subtipos)} className="px-3 py-1.5 rounded-full border border-midnight/15 bg-white text-xs text-midnight active:border-gold active:text-gold">{sub.label}</button>
                                    ))}
                                  </div>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <button onClick={onSale} className="w-full flex items-center justify-between py-5 border-b border-midnight/10 text-left">
          <span className="font-serif text-2xl text-midnight">Sale</span>
          <span className="text-[10px] uppercase tracking-[0.2em] bg-gold text-midnight px-2 py-1 rounded-full font-medium">Ofertas</span>
        </button>
        <button onClick={onSearch} className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-full border border-midnight/15 bg-white text-sm text-midnight/60">
          <Search className="w-4 h-4 text-gold" />Buscar marca, prenda o color
        </button>
      </nav>
    </div>,
    document.body,
  )
}

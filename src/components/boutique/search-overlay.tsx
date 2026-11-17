'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Search, X, ArrowUpRight } from 'lucide-react'
import { sugerencias, buscarProductos, type Sugerencia, type FilterState } from '@/lib/boutique/catalog'
import { formatGTQ } from '@/lib/boutique/format'
import { track } from '@/lib/boutique/analytics'
import { Picture } from './picture'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
  onSearch: (q: string) => void
  onNavigate: (filter: Partial<FilterState>) => void
}

const KIND_LABEL: Record<Sugerencia['kind'], string> = {
  marca: 'Marca', tipo: 'Tipo', subtipo: 'Tipo', color: 'Color', categoria: 'Categoría', producto: '',
}

/** Resalta en negrita la parte que el cliente todavía no escribió (como Google). */
function Resaltado({ texto, q }: { texto: string; q: string }) {
  const n = q.trim().toLowerCase()
  const i = n ? texto.toLowerCase().indexOf(n) : -1
  if (i < 0) return <span className="font-semibold">{texto}</span>
  return (<>{texto.slice(0, i)}<span className="font-normal">{texto.slice(i, i + n.length)}</span><span className="font-semibold">{texto.slice(i + n.length)}</span></>)
}

export function SearchOverlay({ open, onClose, onSearch, onNavigate }: SearchOverlayProps) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const sugs = useMemo(() => sugerencias(q, 6), [q])
  const prods = useMemo(() => buscarProductos(q, 4), [q])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  // Va en un portal: el header tiene backdrop-blur, y eso encerraría un `position: fixed` dentro del header.
  if (!open || typeof document === 'undefined') return null

  const close = () => { setQ(''); onClose() }
  const pick = (s: Sugerencia) => {
    track('search_suggestion_click', { query: q, label: s.label, kind: s.kind })
    if (s.filter) onNavigate(s.filter)
    else onSearch(s.label)
    close()
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (active >= 0 && sugs[active]) return pick(sugs[active])
    const v = q.trim()
    if (!v) return
    track('search_use', { query: v })
    onSearch(v)
    close()
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(sugs.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(-1, a - 1)) }
  }
  const hayResultados = sugs.length > 0 || prods.length > 0

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <button aria-label="Cerrar búsqueda" onClick={close} className="search-backdrop absolute inset-0 w-full h-full bg-black/60 backdrop-blur-[2px] cursor-default" tabIndex={-1} />
      <div className="search-panel relative bg-cream border-b border-gold/30 shadow-2xl max-h-[92vh] overflow-y-auto scrollbar-boutique">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-5 md:pt-6 pb-6 md:pb-8">
          <form onSubmit={submit} className="flex items-center gap-3 md:gap-4 border-b-2 border-midnight pb-3">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-midnight flex-shrink-0" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={e => { setQ(e.target.value); setActive(-1) }}
              onKeyDown={onKeyDown}
              placeholder="Buscar"
              aria-label="Buscar por marca, prenda o color"
              autoComplete="off"
              enterKeyHint="search"
              className="flex-1 min-w-0 bg-transparent font-serif text-xl md:text-3xl text-midnight placeholder:text-midnight/30 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="button" onClick={close} aria-label="Cerrar" className="flex-shrink-0 w-9 h-9 rounded-full border border-midnight/15 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors">
              <X className="w-4 h-4" />
            </button>
          </form>

          {q.trim() && hayResultados && (
            <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 md:gap-12 mt-6">
              {sugs.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium mb-3">Sugerencias</p>
                  <ul className="space-y-0.5" role="listbox">
                    {sugs.map((s, i) => (
                      <li key={`${s.kind}:${s.label}`} role="option" aria-selected={i === active}>
                        <button onClick={() => pick(s)} onMouseEnter={() => setActive(i)} className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded-md text-[15px] text-midnight transition-colors ${i === active ? 'bg-cream-deep' : 'hover:bg-cream-deep'}`}>
                          <span className="truncate"><Resaltado texto={s.label} q={q} /></span>
                          {KIND_LABEL[s.kind] && <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex-shrink-0">{KIND_LABEL[s.kind]}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {prods.length > 0 && (
                <div className={sugs.length === 0 ? 'md:col-span-2' : ''}>
                  <div className="flex items-baseline justify-between mb-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">Productos</p>
                    <button onClick={() => { track('search_use', { query: q.trim() }); onSearch(q.trim()); close() }} className="text-xs text-midnight hover:text-gold inline-flex items-center gap-1 underline underline-offset-4 decoration-gold/50">
                      Ver todos<ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {prods.map(p => (
                      <li key={p.id}>
                        <Link href={`/producto/${p.slug}`} onClick={() => { track('search_product_click', { query: q, slug: p.slug }); close() }} className="group block">
                          <div className="aspect-[4/5] overflow-hidden rounded-md bg-white mb-2">
                            <Picture src={p.imagenes[0]} alt={p.nombre} sizes="(min-width: 768px) 180px, 45vw" widths={[200, 600]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <p className="text-[10px] uppercase tracking-wider text-gold font-medium truncate">{p.marca !== 'Otras' ? p.marca : ' '}</p>
                          <p className="product-name text-sm text-midnight leading-snug line-clamp-2 group-hover:text-gold transition-colors">{p.nombre}</p>
                          <p className="text-sm font-semibold text-midnight mt-0.5">{formatGTQ(p.precio)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

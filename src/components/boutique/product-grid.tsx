'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { applyFilter, opcionesTipo, type FilterState, type SortMode } from '@/lib/boutique/catalog'
import { marcasByCategoria, coloresAll, allCategorias } from '@/data/filters'
import { ProductCard } from './product-card'
import { BRAND } from '@/lib/boutique/brand'
import { track } from '@/lib/boutique/analytics'
import { ChevronDown, X } from 'lucide-react'
import { AutoButtons } from './auto-buttons'
import { Picture } from '@/components/boutique/picture'

interface ProductGridProps { filter: FilterState; onOpenProduct: (slug: string) => void; onNavigate?: (filter: Record<string, string[]>) => void }
const SORT_LABELS: Record<SortMode, string> = { 'recent': 'Más recientes', 'price-high': 'Precio: Alto - Bajo', 'price-low': 'Precio: Bajo - Alto', 'featured': 'Destacados' }

export function ProductGrid({ filter, onOpenProduct, onNavigate }: ProductGridProps) {
  const [sort, setSort] = useState<SortMode>('recent')
  const [visibleCount, setVisibleCount] = useState(22)
  const [filterOpen, setFilterOpen] = useState<string | null>(null)
  const [localFilter, setLocalFilter] = useState<FilterState>(filter)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setLocalFilter(filter); setVisibleCount(22) }, [filter])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(null) }
    if (filterOpen) { document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }
  }, [filterOpen])

  const filtered = useMemo(() => applyFilter(localFilter, sort), [localFilter, sort])
  const visible = filtered.slice(0, visibleCount)
  const availableCategorias = allCategorias
  const tipoOpts = useMemo(() => opcionesTipo(localFilter.categorias), [localFilter.categorias])
  const availableMarcas = localFilter.categorias.length ? Array.from(new Set(localFilter.categorias.flatMap(c => marcasByCategoria[c] || []))) : Array.from(new Set(Object.values(marcasByCategoria).flat()))
  const chips: { label: string; type: keyof FilterState; value: string }[] = []
  localFilter.categorias.forEach(c => chips.push({ label: c, type: 'categorias', value: c }))
  localFilter.tipos.forEach(t => chips.push({ label: t, type: 'tipos', value: t }))
  localFilter.subtipos.forEach(s => chips.push({ label: s, type: 'subtipos', value: s }))
  localFilter.estilos.forEach(s => chips.push({ label: s, type: 'estilos', value: s }))
  localFilter.marcas.forEach(m => chips.push({ label: m, type: 'marcas', value: m }))
  localFilter.colores.forEach(c => chips.push({ label: c, type: 'colores', value: c }))
  localFilter.tallas.forEach(t => chips.push({ label: `Talla ${t}`, type: 'tallas', value: t }))
  if (localFilter.sale) chips.push({ label: 'SALE', type: 'sale', value: 'true' })
  if (localFilter.search) chips.push({ label: `"${localFilter.search}"`, type: 'search', value: localFilter.search })
  const availableTallas = Array.from(new Set(filtered.flatMap(p => p.tallas))).sort()
  const toggleFilter = (type: keyof FilterState, value: string) => { setLocalFilter(prev => { const arr = prev[type] as string[]; return { ...prev, [type]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] } }); setVisibleCount(22) }
  const clearAll = () => { setLocalFilter({ categorias: [], tipos: [], subtipos: [], estilos: [], marcas: [], colores: [], tallas: [], precioMin: null, precioMax: null, sale: false, pronto: null, search: '' }); setVisibleCount(22) }
  const hasFilters = chips.length > 0

  const showAutoButtons = (f: FilterState) => {
    if (f.categorias.length === 2 && f.categorias.includes('Juvenil') && f.categorias.includes('Infantil') && f.tipos.length === 0) return { type: 'ninos' as const }
    if (f.categorias.length === 1 && f.tipos.includes('Pantalones')) { const cat = f.categorias[0]; if (cat === 'Hombre') return { type: 'pantalones_hombre' as const }; if (cat === 'Mujer') return { type: 'pantalones_mujer' as const }; if (cat === 'Juvenil') return { type: 'pantalones_juvenil' as const }; if (cat === 'Infantil') return { type: 'pantalones_infantil' as const } }
    return null
  }
  const autoButtons = showAutoButtons(localFilter)


  return (
    <section className="py-10 md:py-14 bg-cream min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="mb-6"><h1 className="font-serif text-2xl md:text-3xl font-semibold text-midnight">{localFilter.categorias.length === 1 ? `PRODUCTOS DE ${localFilter.categorias[0].toUpperCase()}` : localFilter.categorias.length > 1 ? 'PRODUCTOS DE NIÑOS' : localFilter.sale ? 'SALE' : localFilter.search ? `Búsqueda: "${localFilter.search}"` : 'TODOS LOS PRODUCTOS'}</h1>{localFilter.categorias.includes('Hombre') && <p className="text-sm text-muted-foreground mt-1 italic">Clásicos para hombres de carácter</p>}</div>
        <div ref={filterRef}>
          {/* Line 1: Filters left + Ordenar right */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
            {['Categoría', 'Tipo', 'Talla', 'Marca', 'Color'].map(label => {
              const key = label === 'Categoría' ? 'categorias' : label === 'Talla' ? 'tallas' : label === 'Marca' ? 'marcas' : 'colores'
              // Tipo: lista aplanada; cada opción sabe si filtra por tipo o por subtipo.
              const options: { label: string; key: keyof FilterState; value: string }[] = label === 'Tipo' ? tipoOpts
                : (label === 'Categoría' ? availableCategorias : label === 'Talla' ? availableTallas : label === 'Marca' ? availableMarcas : coloresAll).map(v => ({ label: v, key: key as keyof FilterState, value: v }))
              if (!options.length) return null
              return (<div key={label} className="relative"><button onClick={() => setFilterOpen(filterOpen === label ? null : label)} className="px-4 py-2 text-sm border border-midnight/15 bg-white hover:border-midnight transition-colors flex items-center gap-2 whitespace-nowrap">{label}<ChevronDown className={`w-3 h-3 transition-transform ${filterOpen === label ? 'rotate-180' : ''}`} /></button>{filterOpen === label && (<div className="dropdown-animate absolute top-full left-0 mt-1 z-20 bg-white border border-midnight/15 shadow-lg rounded-md py-2 max-h-72 overflow-y-auto min-w-[180px] scrollbar-boutique">{options.map(opt => (<button key={`${opt.key}:${opt.value}`} onClick={() => toggleFilter(opt.key, opt.value)} className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-cream-deep transition-colors whitespace-nowrap ${(localFilter[opt.key] as string[]).includes(opt.value) ? 'text-gold font-medium' : 'text-midnight'}`}>{opt.label}</button>))}</div>)}</div>)
            })}
            </div>
            <div className="flex items-center gap-2"><label className="text-xs uppercase tracking-wider text-muted-foreground">Ordenar:</label><select value={sort} onChange={e => setSort(e.target.value as SortMode)} className="px-3 py-1.5 text-sm border border-midnight/15 bg-white rounded focus:outline-none focus:border-gold">{Object.entries(SORT_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select></div>
          </div>
          {/* Line 2: Borrar filtros + chips left + product count right */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {hasFilters && <button onClick={clearAll} className="text-xs text-gold hover:text-midnight underline underline-offset-2">Borrar filtros</button>}
              {chips.map((chip, i) => (<button key={i} onClick={() => { if (chip.type === 'sale') setLocalFilter(prev => ({ ...prev, sale: false })); else if (chip.type === 'search') setLocalFilter(prev => ({ ...prev, search: '' })); else toggleFilter(chip.type, chip.value) }} className="inline-flex items-center gap-1.5 px-3 py-1 bg-midnight text-cream text-xs rounded-full hover:bg-midnight-light transition-colors">{chip.label}<X className="w-3 h-3" /></button>))}
            </div>
            <p className="text-sm text-muted-foreground">{filtered.length} productos</p>
          </div>
        </div>
        {autoButtons && onNavigate && (<div className="mb-6"><AutoButtons type={autoButtons.type} onNavigate={onNavigate} /></div>)}
        {visible.length === 0 ? (<div className="text-center py-20"><p className="text-midnight text-lg mb-2">No hay productos que coincidan con tu búsqueda.</p><p className="text-muted-foreground text-sm mb-4">Prueba con otros filtros.</p><button onClick={clearAll} className="text-gold hover:text-midnight underline underline-offset-2 text-sm">Borrar todos los filtros</button></div>) : (<><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{visible.map((p, i) => (<div key={p.id} className="contents">{i === 8 && (<div className="col-span-2 lg:col-span-2 row-span-1 relative overflow-hidden rounded-lg"><Picture src="/images/marca/Por_cada_momento_para_cada_integrante.png" alt="Por cada momento para cada integrante" className="w-full h-full object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /></div>)}<ProductCard product={p} onOpen={onOpenProduct} /></div>))}</div>{visibleCount < filtered.length && (<div className="text-center mt-12"><button onClick={() => setVisibleCount(c => c + 20)} className="px-8 py-3 border border-midnight text-midnight text-sm uppercase tracking-wider rounded-full hover:bg-midnight hover:text-cream transition-colors">Mostrar más</button></div>)}<div className="mt-16 text-center py-8 border-t border-midnight/10"><p className="text-sm text-muted-foreground mb-2">¡Contamos con más producto en nuestra tienda física, no dudes en consultarnos si estás interesado!</p><a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-midnight text-sm font-medium underline underline-offset-2">Consultar por WhatsApp</a></div></>)}
      </div>
    </section>
  )
}

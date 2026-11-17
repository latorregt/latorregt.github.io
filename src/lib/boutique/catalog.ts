import { products as ALL_PRODUCTS, type Product } from '@/data/products'
import { allCategorias, tiposByCategoria, subtiposByTipo, marcasByCategoria, coloresAll, tallasByContext, colorSynonyms } from '@/data/filters'
export { ALL_PRODUCTS, allCategorias, tiposByCategoria, subtiposByTipo, marcasByCategoria, coloresAll, tallasByContext, colorSynonyms }
export type { Product }

export interface FilterState {
  categorias: string[]; tipos: string[]; subtipos: string[]; estilos: string[]; marcas: string[]; colores: string[]; tallas: string[]
  precioMin: number | null; precioMax: number | null; sale: boolean; pronto: boolean | null; search: string
}
export const EMPTY_FILTER: FilterState = {
  categorias: [], tipos: [], subtipos: [], estilos: [], marcas: [], colores: [], tallas: [],
  precioMin: null, precioMax: null, sale: false, pronto: null, search: ''
}
export type SortMode = 'recent' | 'price-high' | 'price-low' | 'featured'

/** Subtipos que existen de verdad en los datos para un tipo (y categorías, si se dan). */
export function subtiposDe(tipo: string, categorias: string[] = []): string[] {
  const set = new Set<string>()
  for (const p of ALL_PRODUCTS) if (p.tipo === tipo && p.subtipo && (!categorias.length || categorias.includes(p.categoria))) set.add(p.subtipo)
  return Array.from(set).sort()
}

const SUBS_POR_TIPO = new Map<string, string[]>()
for (const p of ALL_PRODUCTS) if (p.subtipo) { const a = SUBS_POR_TIPO.get(p.tipo) || []; if (!a.includes(p.subtipo)) a.push(p.subtipo); SUBS_POR_TIPO.set(p.tipo, a) }

/**
 * Tipo y subtipo funcionan como un solo filtro:
 * - un producto pasa si su subtipo está elegido, o
 * - si su tipo está elegido y no se eligió ningún subtipo de ese tipo (elegir "Jeans" acota "Pantalones").
 */
export function matchesTipo(p: Product, f: Pick<FilterState, 'tipos' | 'subtipos'>): boolean {
  if (!f.tipos.length && !f.subtipos.length) return true
  if (p.subtipo && f.subtipos.includes(p.subtipo)) return true
  if (!f.tipos.includes(p.tipo)) return false
  const subsDelTipo = SUBS_POR_TIPO.get(p.tipo) || []
  return !f.subtipos.some(s => subsDelTipo.includes(s))
}

/** Opciones del filtro "Tipo" aplanadas: si un tipo tiene subtipos, se muestran los subtipos en su lugar. */
export function opcionesTipo(categorias: string[]): { label: string; key: 'tipos' | 'subtipos'; value: string }[] {
  const tipos = categorias.length ? Array.from(new Set(categorias.flatMap(c => tiposByCategoria[c] || []))) : Array.from(new Set(Object.values(tiposByCategoria).flat()))
  const out: { label: string; key: 'tipos' | 'subtipos'; value: string }[] = []
  const seen = new Set<string>()
  for (const tipo of tipos) {
    const subs = subtiposDe(tipo, categorias)
    const sinSubtipo = ALL_PRODUCTS.some(p => p.tipo === tipo && !p.subtipo && (!categorias.length || categorias.includes(p.categoria)))
    // Si hay prendas de este tipo sin subtipo, el tipo también aparece para que no queden fuera.
    const items = subs.length ? (sinSubtipo ? [tipo, ...subs] : subs) : [tipo]
    for (const v of items) {
      if (seen.has(v)) continue
      seen.add(v)
      out.push({ label: v, key: v === tipo ? 'tipos' : 'subtipos', value: v })
    }
  }
  return out
}

/** Submenú de Pantalones en el encabezado, por categoría. label = lo que se ve; subtipos = valores reales de Notion. */
export const MENU_PANTALONES: Record<string, { label: string; subtipos: string[] }[]> = {
  Hombre: [{ label: 'Jeans', subtipos: ['Jeans'] }, { label: 'Tela / Gabardina', subtipos: ['Tela / Gabardina'] }],
  Mujer: [{ label: 'Jeans', subtipos: ['Jeans'] }, { label: 'Tela', subtipos: ['Tela / Gabardina'] }, { label: 'Otros', subtipos: ['Cargo', 'Jogger'] }],
  Juvenil: [{ label: 'Jeans', subtipos: ['Jeans'] }, { label: 'Tela / Gabardina', subtipos: ['Tela / Gabardina'] }, { label: 'Otros', subtipos: ['Cargo', 'Jogger'] }],
  Infantil: [{ label: 'Jeans', subtipos: ['Jeans'] }, { label: 'Tela / Gabardina', subtipos: ['Tela / Gabardina'] }, { label: 'Otros', subtipos: ['Cargo', 'Jogger'] }],
}

/** Entradas del submenú para una categoría y tipo, solo las que tienen al menos una prenda. */
export function submenu(cat: string, tipo: string): { label: string; subtipos: string[] }[] {
  const base = tipo === 'Pantalones' ? (MENU_PANTALONES[cat] || []) : subtiposDe(tipo, [cat]).map(s => ({ label: s, subtipos: [s] }))
  return base.filter(e => ALL_PRODUCTS.some(p => p.categoria === cat && p.tipo === tipo && e.subtipos.includes(p.subtipo)))
}

export function findProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.slug === slug)
}
export function getRelated(product: Product, count = 8): Product[] {
  // First: same tipo + same marca
  let related = ALL_PRODUCTS.filter(p => p.id !== product.id && p.categoria === product.categoria && p.tipo === product.tipo && p.marca === product.marca && !p.prontoVolvera)
  // Then: same tipo + different marca
  if (related.length < count) {
    const more = ALL_PRODUCTS.filter(p => p.id !== product.id && p.categoria === product.categoria && p.tipo === product.tipo && p.marca !== product.marca && !related.includes(p) && !p.prontoVolvera)
    // Shuffle for variety
    more.sort(() => Math.random() - 0.5)
    related = related.concat(more)
  }
  // Then: same marca + different tipo
  if (related.length < count) {
    const more = ALL_PRODUCTS.filter(p => p.id !== product.id && p.marca === product.marca && !related.includes(p) && !p.prontoVolvera)
    related = related.concat(more)
  }
  return related.slice(0, count)
}
export function applyFilter(filter: FilterState, sort: SortMode): Product[] {
  let result = ALL_PRODUCTS.filter(p => {
    // When viewing Hombre category without specific tipo, exclude Accesorios, Ropa Interior, Calzado
    if (filter.categorias.includes('Hombre') && filter.tipos.length === 0 && filter.subtipos.length === 0) {
      if (['Accesorios', 'Ropa Interior', 'Calzado'].includes(p.tipo)) return false
    }
    if (filter.categorias.length && !filter.categorias.includes(p.categoria)) return false
    if (!matchesTipo(p, filter)) return false
    if (filter.estilos.length && !filter.estilos.includes(p.estilo)) return false
    if (filter.marcas.length && !filter.marcas.includes(p.marca)) return false
    if (filter.colores.length && !filter.colores.includes(p.color)) return false
    if (filter.tallas.length && !p.tallas.some(t => filter.tallas.includes(t))) return false
    if (filter.precioMin !== null && p.precio < filter.precioMin) return false
    if (filter.precioMax !== null && p.precio > filter.precioMax) return false
    if (filter.sale && !p.sale) return false
    if (filter.pronto === true && !p.prontoVolvera) return false
    if (filter.search && !matchesSearch(p, filter.search)) return false
    return true
  })
  result.sort((a, b) => {
    if (a.prontoVolvera !== b.prontoVolvera) return a.prontoVolvera ? 1 : -1
    if (a.sale !== b.sale) return a.sale ? 1 : -1
    if (sort === 'price-high') return b.precio - a.precio
    if (sort === 'price-low') return a.precio - b.precio
    if (sort === 'featured') return 0
    const da = a.fecha ? parseInt(a.fecha.slice(0, 10).replace(/-/g, '')) : 0
    const db = b.fecha ? parseInt(b.fecha.slice(0, 10).replace(/-/g, '')) : 0
    return db - da
  })
  return result
}

/* ---------------------------- Búsqueda ---------------------------- */

/** minúsculas y sin tildes: "Suéter" -> "sueter" */
export function normalizar(t: string): string {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’`]/g, '').replace(/\s+/g, ' ').trim()
}
const SINONIMOS = Object.fromEntries(Object.entries(colorSynonyms).map(([k, v]) => [normalizar(k), v]))
const HAYSTACK = new Map<number, string>()
function haystack(p: Product): string {
  let h = HAYSTACK.get(p.id)
  if (h === undefined) {
    h = normalizar([p.nombre, p.marca, p.tipo, p.subtipo, p.estilo, p.color, p.categoria].join(' '))
    HAYSTACK.set(p.id, h)
  }
  return h
}

/** Todas las palabras de la búsqueda deben aparecer (nombre, marca, tipo, subtipo, estilo, color o categoría). */
export function matchesSearch(p: Product, q: string): boolean {
  const words = normalizar(q).split(' ').filter(Boolean)
  if (!words.length) return true
  const h = haystack(p)
  return words.every(w => h.includes(w) || (SINONIMOS[w] !== undefined && p.color === SINONIMOS[w]))
}

export type Sugerencia = { label: string; kind: 'marca' | 'tipo' | 'subtipo' | 'color' | 'categoria' | 'producto'; filter?: Partial<FilterState> }

let TERMINOS: (Sugerencia & { n: string })[] | null = null
function terminos() {
  if (TERMINOS) return TERMINOS
  const t: (Sugerencia & { n: string })[] = []
  const add = (s: Sugerencia) => { if (!t.some(x => x.kind === s.kind && x.label === s.label)) t.push({ ...s, n: normalizar(s.label) }) }
  for (const p of ALL_PRODUCTS) {
    if (p.marca && p.marca !== 'Otras') add({ label: p.marca, kind: 'marca', filter: { marcas: [p.marca] } })
    if (p.tipo) add({ label: p.tipo, kind: 'tipo', filter: { tipos: [p.tipo] } })
    if (p.subtipo) add({ label: p.subtipo, kind: 'subtipo', filter: { subtipos: [p.subtipo] } })
    if (p.color) add({ label: p.color, kind: 'color', filter: { colores: [p.color] } })
    add({ label: p.categoria, kind: 'categoria', filter: { categorias: [p.categoria] } })
  }
  for (const p of ALL_PRODUCTS) add({ label: p.nombre.trim(), kind: 'producto' })
  TERMINOS = t
  return t
}

/** Sugerencias tipo Google: primero lo que empieza igual, luego lo que tiene una palabra que empieza igual. */
export function sugerencias(q: string, max = 8): Sugerencia[] {
  const n = normalizar(q)
  if (!n) return []
  const scored: { s: Sugerencia; score: number }[] = []
  const kindRank = { tipo: 0, subtipo: 0, marca: 1, categoria: 2, color: 3, producto: 4 }
  for (const t of terminos()) {
    let score = -1
    if (t.n.startsWith(n)) score = 0
    else if (t.n.split(/[\s/]+/).some(w => w.startsWith(n))) score = 1
    else if (n.length >= 3 && t.n.includes(n)) score = 2
    if (score >= 0) scored.push({ s: { label: t.label, kind: t.kind, filter: t.filter }, score: score * 10 + kindRank[t.kind] })
  }
  // sinónimos de color: "vino" -> Rojo / Corinto
  for (const [k, color] of Object.entries(SINONIMOS)) {
    if (k.startsWith(n) && !scored.some(x => x.s.kind === 'color' && x.s.label === color)) scored.push({ s: { label: color, kind: 'color', filter: { colores: [color] } }, score: 5 })
  }
  scored.sort((a, b) => a.score - b.score || a.s.label.length - b.s.label.length)
  return scored.slice(0, max).map(x => x.s)
}

/** Productos para el buscador: los disponibles primero y los más recientes antes. */
export function buscarProductos(q: string, max = 6): Product[] {
  if (!normalizar(q)) return []
  return applyFilter({ ...EMPTY_FILTER, search: q }, 'recent').slice(0, max)
}

/* ------------------------ Filtro <-> URL (?categoria=...) ------------------------ */
const URL_KEYS: [keyof FilterState, string][] = [['categorias', 'categoria'], ['tipos', 'tipo'], ['subtipos', 'subtipo'], ['estilos', 'estilo'], ['marcas', 'marca'], ['colores', 'color']]

export function filterToParams(f: Partial<FilterState>): URLSearchParams {
  const p = new URLSearchParams()
  for (const [k, name] of URL_KEYS) { const v = f[k] as string[] | undefined; if (v && v.length) p.set(name, v.join(',')) }
  if (f.search) p.set('q', f.search)
  if (f.sale) p.set('sale', 'true')
  return p
}

/** null si la URL no trae ningún filtro (= portada). */
export function paramsToFilter(params: URLSearchParams): FilterState | null {
  const f: FilterState = { ...EMPTY_FILTER }
  let any = false
  for (const [k, name] of URL_KEYS) { const v = params.get(name); if (v) { (f[k] as string[]) = v.split(',').filter(Boolean); any = true } }
  const q = params.get('q'); if (q) { f.search = q; any = true }
  if (params.get('sale') === 'true') { f.sale = true; any = true }
  return any ? f : null
}

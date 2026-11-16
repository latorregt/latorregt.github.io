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

export function findProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.slug === slug)
}
export function getRelated(product: Product, count = 4): Product[] {
  let related = ALL_PRODUCTS.filter(p => p.id !== product.id && p.categoria === product.categoria && p.tipo === product.tipo && !p.prontoVolvera)
  if (related.length < count) {
    const more = ALL_PRODUCTS.filter(p => p.id !== product.id && p.categoria === product.categoria && !related.includes(p) && !p.prontoVolvera)
    related = related.concat(more)
  }
  if (related.length < count) {
    const more = ALL_PRODUCTS.filter(p => p.id !== product.id && p.marca === product.marca && !related.includes(p) && !p.prontoVolvera)
    related = related.concat(more)
  }
  return related.slice(0, count)
}
export function applyFilter(filter: FilterState, sort: SortMode): Product[] {
  let result = ALL_PRODUCTS.filter(p => {
    // When viewing Hombre category without specific tipo, exclude Accesorios, Ropa Interior, Calzado
    if (filter.categorias.includes('Hombre') && filter.tipos.length === 0) {
      if (['Accesorios', 'Ropa Interior', 'Calzado'].includes(p.tipo)) return false
    }
    if (filter.categorias.length && !filter.categorias.includes(p.categoria)) return false
    if (filter.tipos.length && !filter.tipos.includes(p.tipo)) return false
    if (filter.subtipos.length && !filter.subtipos.includes(p.subtipo)) return false
    if (filter.estilos.length && !filter.estilos.includes(p.estilo)) return false
    if (filter.marcas.length && !filter.marcas.includes(p.marca)) return false
    if (filter.colores.length && !filter.colores.includes(p.color)) return false
    if (filter.tallas.length && !p.tallas.some(t => filter.tallas.includes(t))) return false
    if (filter.precioMin !== null && p.precio < filter.precioMin) return false
    if (filter.precioMax !== null && p.precio > filter.precioMax) return false
    if (filter.sale && !p.sale) return false
    if (filter.pronto === true && !p.prontoVolvera) return false
    if (filter.search) {
      const q = filter.search.toLowerCase()
      const synonym = colorSynonyms[q]
      const match = p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q) || p.tipo.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q) || (synonym && p.color === synonym)
      if (!match) return false
    }
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

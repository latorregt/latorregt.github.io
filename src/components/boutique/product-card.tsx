'use client'

import { useState } from 'react'
import type { Product } from '@/data/products'
import { formatGTQ, discountPct, sortTallas } from '@/lib/boutique/format'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'

interface ProductCardProps {
  product: Product
  onOpen: (slug: string) => void
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const add = useCart(s => s.add)
  const openCart = useCart(s => s.open)

  const hasSecondImg = product.imagenes.length > 1
  const discount = discountPct(product.precio, product.tarjeta)
  const tallas = sortTallas(product.tallas)
  const needsTalla = product.tallas.length > 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.prontoVolvera) return
    if (needsTalla) {
      onOpen(product.slug)
      return
    }
    add(product, '')
    track('add_to_cart', { product_id: product.id, product_name: product.nombre, talla: '' })
    openCart()
  }

  return (
    <article className="group cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onOpen(product.slug)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-deep card-zoom">
        <img src={product.imagenes[0]} alt={product.nombre} className={`w-full h-full object-cover ${hovered && hasSecondImg ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} loading="lazy" />
        {hasSecondImg && (
          <img src={product.imagenes[1]} alt="" className={`absolute inset-0 w-full h-full object-cover ${hovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} loading="lazy" aria-hidden="true" />
        )}
        {product.sale && discount && (
          <div className="absolute top-3 left-3 sale-badge px-2 py-1 text-[10px] font-bold tracking-wider uppercase">SALE · -{discount}%</div>
        )}
        {product.prontoVolvera && (
          <div className="absolute top-3 right-3 stamp-soon px-3 py-1 text-[10px] font-bold tracking-wider uppercase">PRONTO VOLVERÁ</div>
        )}
        {!product.prontoVolvera && hovered && (
          <div className="absolute inset-0 bg-midnight/40 flex flex-col items-center justify-end pb-6 gap-2">
            {tallas.length > 0 && <p className="text-cream text-xs tracking-wider">TALLAS: {tallas.join(' · ')}</p>}
            <button onClick={handleQuickAdd} className="bg-gold text-midnight text-xs uppercase tracking-wider font-medium px-4 py-2 hover:bg-cream transition-colors rounded-full">
              {needsTalla ? 'VER DETALLE' : 'AGREGAR AL CARRITO'}
            </button>
          </div>
        )}
      </div>
      <div className="pt-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-gold font-medium mb-1">{product.marca}</p>
        <h3 className="product-name text-sm font-medium text-midnight line-clamp-1 mb-2">{product.nombre}</h3>
        <div className="flex items-baseline gap-2">
          {product.sale && product.tarjeta ? (
            <>
              <span className="text-xs line-through text-muted-foreground">{formatGTQ(product.tarjeta)}</span>
              <span className="text-sm font-semibold text-midnight">{formatGTQ(product.precio)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-midnight">{formatGTQ(product.precio)}</span>
          )}
        </div>
      </div>
    </article>
  )
}

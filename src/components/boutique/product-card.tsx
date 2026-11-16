'use client'

import { useState } from 'react'
import type { Product } from '@/data/products'
import { formatGTQ, discountPct, sortTallas } from '@/lib/boutique/format'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
  onOpen: (slug: string) => void
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null)
  const add = useCart(s => s.add)
  const openCart = useCart(s => s.open)
  const router = useRouter()

  const hasSecondImg = product.imagenes.length > 1
  const discount = discountPct(product.precio, product.tarjeta)
  const tallas = sortTallas(product.tallas)
  const needsTalla = product.tallas.length > 0
  const canAdd = !needsTalla || selectedTalla !== null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canAdd) return
    add(product, selectedTalla || '')
    track('add_to_cart', { product_id: product.id, product_name: product.nombre, talla: selectedTalla || '' })
    openCart()
  }

  const handleCardClick = () => {
    onOpen(product.slug)
  }

  return (
    <article
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setSelectedTalla(null) }}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-deep card-zoom">
        <img
          src={product.imagenes[0]}
          alt={product.nombre}
          className={`w-full h-full object-cover ${hovered && hasSecondImg ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          loading="lazy"
        />
        {hasSecondImg && (
          <img
            src={product.imagenes[1]}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${hovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            loading="lazy"
            aria-hidden="true"
          />
        )}

        {/* SALE badge */}
        {product.sale && discount && (
          <div className="absolute top-3 left-3 sale-badge px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
            SALE · -{discount}%
          </div>
        )}

        {/* PRONTO VOLVERÁ stamp */}
        {product.prontoVolvera && (
          <div className="absolute top-3 right-3 stamp-soon px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
            PRONTO VOLVERÁ
          </div>
        )}

        {/* Hover overlay: tallas + add to cart (NO blue filter on image) */}
        {!product.prontoVolvera && hovered && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            {/* White strip with tallas */}
            {needsTalla && (
              <div className="bg-white/95 backdrop-blur-sm px-2 py-2 flex flex-wrap gap-1 justify-center">
                {tallas.map(t => (
                  <button
                    key={t}
<<<<<<< HEAD
                    onClick={(e) => { e.stopPropagation(); setSelectedTalla(selectedTalla === t ? null : t) }}
=======
                    onClick={(e) => { e.stopPropagation(); setSelectedTalla(t) }}
>>>>>>> 25f5bf1dc96d84d5fe8363201f8f98da36aebfea
                    className={`min-w-[28px] px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                      selectedTalla === t
                        ? 'bg-midnight text-cream'
                        : 'text-midnight hover:bg-midnight/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            {/* Navy strip with add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className={`w-full py-2 text-[10px] uppercase tracking-wider font-medium transition-colors ${
                canAdd
                  ? 'bg-midnight text-cream hover:bg-midnight-light'
                  : 'bg-midnight/40 text-cream/60 cursor-not-allowed'
              }`}
            >
              AGREGAR AL CARRITO
            </button>
          </div>
        )}
      </div>

      {/* Info */}
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

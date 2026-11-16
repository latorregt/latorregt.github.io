'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/data/products'
import { formatGTQ, discountPct, sortTallas } from '@/lib/boutique/format'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { BRAND, WA_LINK } from '@/lib/boutique/brand'
import { ProductCard } from './product-card'
import { ChevronDown, ZoomIn, ShoppingBag, X, ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

interface ProductDetailClientProps {
  product: Product
  related: Product[]
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tallaSel, setTallaSel] = useState<string>('')
  const [zoomed, setZoomed] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const add = useCart(s => s.add)
  const openCart = useCart(s => s.open)
  const router = useRouter()

  useEffect(() => {
    setActiveIdx(0); setTallaSel(''); setZoomed(false); setExpanded(null)
    track('view_item', { product_id: product.id, product_name: product.nombre })
    window.scrollTo(0, 0)
  }, [product.slug])

  const discount = discountPct(product.precio, product.tarjeta)
  const tallas = sortTallas(product.tallas)
  const needsTalla = product.tallas.length > 0

  const handleAdd = () => {
    if (needsTalla && !tallaSel) return
    add(product, tallaSel)
    track('add_to_cart', { product_id: product.id, product_name: product.nombre, talla: tallaSel })
    openCart()
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar with back button */}
      <div className="border-b border-midnight/10 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs uppercase tracking-wider text-midnight hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" /> VOLVER
          </button>
          <Link href="/" className="nav-link text-xs uppercase tracking-wider text-midnight font-medium">INICIO</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div className="flex flex-row gap-3 md:gap-4">
            {/* Thumbnails (vertical on desktop, horizontal scroll on mobile) */}
            {product.imagenes.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible scrollbar-boutique md:max-h-[500px]">
                {product.imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 ${activeIdx === i ? 'border-gold' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div className="flex-1">
              <div
                className="aspect-square bg-white rounded-lg overflow-hidden relative cursor-zoom-in"
                onClick={() => setZoomed(z => !z)}
              >
                <img
                  src={product.imagenes[activeIdx] || product.imagenes[0]}
                  alt={product.nombre}
                  className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150 cursor-zoom-out' : ''}`}
                />
                <div className="absolute bottom-2 right-2 bg-midnight/70 text-cream p-1.5 rounded">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-[0.18em] text-gold font-medium mb-2">{product.marca}</p>
            <h1 className="product-name font-serif text-2xl md:text-3xl font-semibold text-midnight mb-4">{product.nombre}</h1>

            {/* Price */}
            <div className="mb-6">
              {product.sale && product.tarjeta ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-base line-through text-muted-foreground">{formatGTQ(product.tarjeta)}</span>
                  <span className="text-2xl font-semibold text-midnight">{formatGTQ(product.precio)}</span>
                  {discount && <span className="text-xs bg-midnight text-cream px-2 py-0.5 rounded">{discount}% OFF</span>}
                </div>
              ) : (
                <span className="text-2xl font-semibold text-midnight">{formatGTQ(product.precio)}</span>
              )}
            </div>

            <div className="divider-gold mb-6" />

            {/* Color */}
            <div className="flex items-center gap-3 mb-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">COLOR:</p>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-midnight/20" style={{ backgroundColor: product.colorHex }} aria-label={product.color} />
                <span className="text-sm text-midnight">{product.color}</span>
              </div>
            </div>

            {/* Tallas */}
            {needsTalla && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">TALLA:</p>
                <div className="flex flex-wrap gap-2">
                  {tallas.map(t => (
                    <button
                      key={t}
                      onClick={() => setTallaSel(t)}
                      className={`min-w-[44px] px-3 py-2 text-sm border transition-colors ${tallaSel === t ? 'border-midnight bg-midnight text-cream' : 'border-midnight/20 text-midnight hover:border-midnight'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {needsTalla && !tallaSel && <p className="text-xs text-muted-foreground mt-2 italic">Selecciona una talla para continuar</p>}
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={needsTalla && !tallaSel}
              className={`w-full py-3.5 mb-6 text-sm uppercase tracking-wider font-medium rounded-full transition-colors flex items-center justify-center gap-2 ${needsTalla && !tallaSel ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-midnight text-cream hover:bg-midnight-light'}`}
            >
              <ShoppingBag className="w-4 h-4" />AGREGAR AL CARRITO
            </button>

            {/* WhatsApp consult */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_whatsapp_click', { source: 'product_detail' })}
              className="w-full py-3 mb-6 text-sm uppercase tracking-wider font-medium rounded-full border border-midnight text-midnight hover:bg-midnight hover:text-cream transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />CONSULTAR POR WHATSAPP
            </a>

            {/* Description */}
            {product.descripcion && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">DESCRIPCIÓN</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{product.descripcion}</p>
              </div>
            )}

            {/* Expandable blocks */}
            <div className="space-y-2 mb-6">
              {[
                { key: 'envio', title: 'ENVÍO Y DEVOLUCIONES', content: 'Enviamos a todo el territorio de Guatemala con Forza o Guatex. El tiempo estimado de entrega es de 1 a 3 días hábiles a partir del despacho. El envío es gratis en compras mayores a Q1,250, y en Santa Cruz del Quiché es gratis hasta la puerta de tu casa. Los cambios se realizan únicamente en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado.' },
                { key: 'lavado', title: 'LAVADO Y CUIDADOS', content: 'Sigue siempre las instrucciones de la etiqueta de cada prenda: es la guía definitiva según el material. Como recomendaciones generales, lava las prendas con otras de color similar, preferentemente con agua fría; no uses cloro ni blanqueador; plancha a la temperatura adecuada a la tela y sécalas a la sombra para conservar el color.' },
                { key: 'precio', title: 'PRECIO Y TALLAJE', content: 'Precio. Los precios publicados ya incluyen el descuento por pago en efectivo o transferencia. En tienda física y en entrega local, el pago con tarjeta, Apple Pay, Google Pay o PayPal se rige por el precio de etiqueta. Tallaje. Aunque las prendas manejan un tallaje estándar, cada marca maneja sus propias medidas, por lo que una misma talla puede variar de una prenda a otra. Si tienes dudas, escríbenos por WhatsApp.' },
              ].map(block => (
                <div key={block.key} className="border border-midnight/10 rounded">
                  <button
                    onClick={() => setExpanded(expanded === block.key ? null : block.key)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between text-xs uppercase tracking-wider font-medium text-midnight"
                  >
                    {block.title}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded === block.key ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded === block.key && (
                    <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">{block.content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-midnight mb-6 text-center">También te podría interesar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} onOpen={(slug) => router.push(`/producto/${slug}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/data/products'
import { formatGTQ, discountPct, sortTallas } from '@/lib/boutique/format'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { BRAND, WA_LINK } from '@/lib/boutique/brand'
import { TopBar } from './top-bar'
import { Header } from './header'
import { Footer } from './footer'
import { CartDrawer } from './cart-drawer'
import { InfoModal } from './info-modal'
import { EMPTY_FILTER, type FilterState, filterToParams } from '@/lib/boutique/catalog'

import { ProductCard } from './product-card'
import { ChevronDown, ZoomIn, ShoppingBag, X, ArrowLeft, MessageCircle } from 'lucide-react'
import { Picture } from '@/components/boutique/picture'

interface ProductDetailClientProps {
  product: Product
  related: Product[]
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tallaSel, setTallaSel] = useState<string>('')
  const [zoomed, setZoomed] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [relatedIdx, setRelatedIdx] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const add = useCart(s => s.add)
  const openCart = useCart(s => s.open)
  const router = useRouter()
  const [infoModalKey, setInfoModalKey] = useState<string | null>(null)
  const isCartOpen = useCart(s => s.isOpen)
  const closeCart = useCart(s => s.close)

  const navigate = useCallback((nf: Partial<FilterState>) => {
    // El encabezado manda { sale: ['true'] } para SALE.
    const p = filterToParams({ ...nf, sale: (nf as Record<string, unknown>).sale !== undefined })
    router.push(p.toString() ? `/?${p}` : '/')
  }, [router])

  const handleSearch = useCallback((q: string) => {
    router.push(`/?q=${encodeURIComponent(q)}`)
  }, [router])

  const goHome = useCallback(() => {
    router.push('/')
  }, [router])

  useEffect(() => {
    setActiveIdx(0); setTallaSel(''); setZoomed(false); setMousePos({x: 50, y: 50}); setExpanded(null)
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
    <div className="min-h-screen flex flex-col bg-cream">
      <TopBar />
      <Header onNavigate={navigate} onSearch={handleSearch} onOpenCart={openCart} onHome={goHome} />
      <main className="flex-1">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Gallery - takes 7/12 on desktop */}
          <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-3 md:gap-4">
            {/* Thumbnails (vertical on desktop, horizontal scroll on mobile) */}
            {product.imagenes.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible scrollbar-boutique md:max-h-[500px]">
                {product.imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 ${activeIdx === i ? 'border-gold' : 'border-transparent'}`}
                  >
                    <Picture src={img} alt={`${product.nombre} — vista ${i + 1}`} className="w-full h-full object-cover" sizes="80px" widths={[200]} />
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div className="flex-1">
              <div
                className="bg-white rounded-lg overflow-hidden relative cursor-zoom-in flex items-center justify-center"
                style={{ minHeight: '500px' }}
                onClick={() => setZoomed(z => !z)}
                onMouseMove={(e) => { if (zoomed) { const r = e.currentTarget.getBoundingClientRect(); setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) } }}
                
              >
                <Picture
                  key={activeIdx}
                  src={product.imagenes[activeIdx] || product.imagenes[0]}
                  alt={`${product.marca} · ${product.nombre}`}
                  sizes="(min-width: 768px) 55vw, 92vw"
                  priority
                  draggable={false}
                  style={zoomed ? { transform: 'scale(2)', transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
                  className={`max-w-full max-h-[800px] object-contain transition-transform duration-200 ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                />
                <div className="absolute bottom-2 right-2 bg-midnight/70 text-cream p-1.5 rounded">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Info - takes 5/12 on desktop */}
          <div className="md:col-span-5 flex flex-col">
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
                      onClick={() => setTallaSel(tallaSel === t ? '' : t)}
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
            <div className="space-y-6 mb-6">
              {[
                { key: 'envio', title: 'ENVÍO Y DEVOLUCIONES', content: 'Enviamos a todo el territorio de Guatemala con Forza o Guatex. El tiempo estimado de entrega es de 1 a 3 días hábiles a partir del despacho. El envío es gratis en compras mayores a Q1,250, y en Santa Cruz del Quiché es gratis hasta la puerta de tu casa. Los cambios se realizan únicamente en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado.' },
                { key: 'lavado', title: 'LAVADO Y CUIDADOS', content: 'Sigue siempre las instrucciones de la etiqueta de cada prenda: es la guía definitiva según el material. Como recomendaciones generales, lava las prendas con otras de color similar, preferentemente con agua fría; no uses cloro ni blanqueador; plancha a la temperatura adecuada a la tela y sécalas a la sombra para conservar el color.' },
                { key: 'precio', title: 'PRECIO Y TALLAJE', content: 'Precio. Los precios publicados ya incluyen el descuento por pago en efectivo o transferencia. En tienda física y en entrega local, el pago con tarjeta, Apple Pay, Google Pay o PayPal se rige por el precio de etiqueta.\n\nTallaje. Aunque las prendas manejan un tallaje estándar, cada marca maneja sus propias medidas, por lo que una misma talla puede variar de una prenda a otra. Si tienes dudas, escríbenos por WhatsApp.' },
              ].map(block => (
                <div key={block.key} className="border-b border-midnight/15">
                  <button
                    onClick={() => setExpanded(expanded === block.key ? null : block.key)}
                    className="w-full py-4 text-left flex items-center justify-between text-xs uppercase tracking-wider font-medium text-midnight"
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

        {/* Related products with carousel */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-midnight mb-6 text-center">También te podría interesar</h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex gap-4 md:gap-6 transition-transform duration-300" style={{ transform: `translateX(calc(-${relatedIdx} * (48% + 1rem)))` }}>
                  {related.map(p => (
                    <div key={p.id} className="flex-shrink-0 w-[48%] md:w-[23%]">
                      <ProductCard product={p} onOpen={(slug) => router.push(`/producto/${slug}`)} />
                    </div>
                  ))}
                </div>
              </div>
              {relatedIdx > 0 && (
                <button onClick={() => setRelatedIdx(i => Math.max(0, i - 1))} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors z-10" aria-label="Anterior">
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
              )}
              {relatedIdx < related.length - 4 && (
                <button onClick={() => setRelatedIdx(i => Math.min(related.length - 4, i + 1))} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors z-10" aria-label="Siguiente">
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      </main>
      <Footer onOpenInfoModal={setInfoModalKey} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <InfoModal openKey={infoModalKey} onClose={() => setInfoModalKey(null)} onOpenInfoModal={setInfoModalKey} />
    </div>
  )
}

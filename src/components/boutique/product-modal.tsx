'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ChevronDown, ZoomIn, ShoppingBag, X } from 'lucide-react'
import { findProductBySlug, getRelated } from '@/lib/boutique/catalog'
import { formatGTQ, discountPct, sortTallas } from '@/lib/boutique/format'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { ProductCard } from './product-card'

interface ProductModalProps {
  slug: string | null
  onClose: () => void
  onOpenProduct: (slug: string) => void
  onOpenInfoModal: (key: string) => void
}

export function ProductModal({ slug, onClose, onOpenProduct, onOpenInfoModal }: ProductModalProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tallaSel, setTallaSel] = useState<string>('')
  const [zoomed, setZoomed] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const add = useCart(s => s.add)
  const openCart = useCart(s => s.open)

  const product = slug ? findProductBySlug(slug) : null

  useEffect(() => {
    setActiveIdx(0); setTallaSel(''); setZoomed(false); setExpanded(null)
    if (slug && product) track('view_item', { product_id: product.id, product_name: product.nombre })
  }, [slug])

  if (!product) return null

  const discount = discountPct(product.precio, product.tarjeta)
  const tallas = sortTallas(product.tallas)
  const needsTalla = product.tallas.length > 0
  const related = getRelated(product, 4)

  const handleAdd = () => {
    if (needsTalla && !tallaSel) return
    add(product, tallaSel)
    track('add_to_cart', { product_id: product.id, product_name: product.nombre, talla: tallaSel })
    openCart()
    onClose()
  }

  return (
    <Dialog open={!!slug} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto bg-cream p-0 scrollbar-boutique" aria-describedby="product-description">
        <DialogTitle className="sr-only">{product.nombre}</DialogTitle>
        <DialogDescription id="product-description" className="sr-only">{product.marca} · {product.nombre} · {formatGTQ(product.precio)}</DialogDescription>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors" aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-cream-deep p-4 md:p-8">
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3 relative cursor-zoom-in" onClick={() => setZoomed(z => !z)}>
              <img src={product.imagenes[activeIdx] || product.imagenes[0]} alt={product.nombre} className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150 cursor-zoom-out' : ''}`} />
              <div className="absolute bottom-2 right-2 bg-midnight/70 text-cream p-1.5 rounded"><ZoomIn className="w-4 h-4" /></div>
            </div>
            {product.imagenes.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.imagenes.map((img, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)} className={`w-16 h-16 rounded overflow-hidden border-2 ${activeIdx === i ? 'border-gold' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-[92vh] scrollbar-boutique">
            <p className="text-xs uppercase tracking-[0.18em] text-gold font-medium mb-2">{product.marca}</p>
            <h2 className="product-name font-serif text-xl md:text-2xl font-semibold text-midnight mb-3">{product.nombre}</h2>
            <div className="mb-4">
              {product.sale && product.tarjeta ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-base line-through text-muted-foreground">{formatGTQ(product.tarjeta)}</span>
                  <span className="text-2xl font-semibold text-midnight">{formatGTQ(product.precio)}</span>
                  {discount && <span className="text-xs bg-midnight text-cream px-2 py-0.5 rounded">{discount}% OFF</span>}
                </div>
              ) : (<span className="text-2xl font-semibold text-midnight">{formatGTQ(product.precio)}</span>)}
            </div>
            <div className="flex items-center gap-3 mb-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Color:</p>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border border-midnight/20" style={{ backgroundColor: product.colorHex }} aria-label={product.color} />
                <span className="text-sm text-midnight">{product.color}</span>
              </div>
            </div>
            {needsTalla && (
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Talla:</p>
                <div className="flex flex-wrap gap-2">
                  {tallas.map(t => (
                    <button key={t} onClick={() => setTallaSel(t)} className={`min-w-[44px] px-3 py-2 text-sm border transition-colors ${tallaSel === t ? 'border-midnight bg-midnight text-cream' : 'border-midnight/20 text-midnight hover:border-midnight'}`}>{t}</button>
                  ))}
                </div>
                {needsTalla && !tallaSel && <p className="text-xs text-muted-foreground mt-2 italic">Selecciona una talla para continuar</p>}
              </div>
            )}
            <button onClick={handleAdd} disabled={needsTalla && !tallaSel} className={`w-full py-3.5 mb-5 text-sm uppercase tracking-wider font-medium rounded-full transition-colors flex items-center justify-center gap-2 ${needsTalla && !tallaSel ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-midnight text-cream hover:bg-midnight-light'}`}>
              <ShoppingBag className="w-4 h-4" />AGREGAR AL CARRITO
            </button>
            {product.descripcion && (<div className="mb-6"><p className="text-sm text-foreground/80 leading-relaxed">{product.descripcion}</p></div>)}
            <div className="space-y-2 mb-6">
              {[
                { key: 'envio', title: 'ENVÍO Y DEVOLUCIONES', content: 'Enviamos a todo el territorio de Guatemala con Forza o Guatex. El tiempo estimado de entrega es de 1 a 3 días hábiles a partir del despacho. El envío es gratis en compras mayores a Q1,250, y en Santa Cruz del Quiché es gratis hasta la puerta de tu casa. Los cambios se realizan únicamente en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado.' },
                { key: 'lavado', title: 'LAVADO Y CUIDADOS', content: 'Sigue siempre las instrucciones de la etiqueta de cada prenda: es la guía definitiva según el material. Como recomendaciones generales, lava las prendas con otras de color similar, preferentemente con agua fría; no uses cloro ni blanqueador; plancha a la temperatura adecuada a la tela y sécalas a la sombra para conservar el color.' },
                { key: 'precio', title: 'PRECIO Y TALLAJE', content: 'Precio. Los precios publicados ya incluyen el descuento por pago en efectivo o transferencia. En tienda física y en entrega local, el pago con tarjeta, Apple Pay, Google Pay o PayPal se rige por el precio de etiqueta. Tallaje. Aunque las prendas manejan un tallaje estándar, cada marca maneja sus propias medidas, por lo que una misma talla puede variar de una prenda a otra. Si tienes dudas, escríbenos por WhatsApp.' },
              ].map(block => (
                <div key={block.key} className="border border-midnight/10 rounded">
                  <button onClick={() => setExpanded(expanded === block.key ? null : block.key)} className="w-full px-4 py-3 text-left flex items-center justify-between text-xs uppercase tracking-wider font-medium text-midnight">
                    {block.title}<ChevronDown className={`w-4 h-4 transition-transform ${expanded === block.key ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded === block.key && (
                    <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">
                      {block.content}
                      {block.key === 'precio' && <button onClick={() => { onOpenInfoModal('qa'); onClose() }} className="block mt-2 text-gold hover:text-midnight underline underline-offset-2 text-xs">Ver Guía de Tallas</button>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="bg-cream-deep p-6 md:p-8">
            <h3 className="font-serif text-lg font-semibold text-midnight mb-4">También te podría interesar</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (<ProductCard key={p.id} product={p} onOpen={onOpenProduct} />))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

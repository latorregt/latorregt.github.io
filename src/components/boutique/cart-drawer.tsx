'use client'

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { X, ChevronLeft, ShoppingBag, Trash2, MessageCircle, Truck, Store } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatGTQ, waLink } from '@/lib/boutique/format'
import { BRAND } from '@/lib/boutique/brand'
import { track } from '@/lib/boutique/analytics'
import { useState, useEffect } from 'react'
import { Picture } from '@/components/boutique/picture'

interface CartDrawerProps { isOpen: boolean; onClose: () => void }

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCart(s => s.items)
  const step = useCart(s => s.step)
  const entrega = useCart(s => s.entrega)
  const destino = useCart(s => s.destino)
  const setStep = useCart(s => s.setStep)
  const setEntrega = useCart(s => s.setEntrega)
  const setDestino = useCart(s => s.setDestino)
  const remove = useCart(s => s.remove)
  const updateQty = useCart(s => s.updateQty)
  const clear = useCart(s => s.clear)
  const subtotal = useCart(s => s.subtotal())
  const count = useCart(s => s.count())

  useEffect(() => { if (isOpen && step === 2) track('begin_checkout', { items: count }) }, [isOpen, step, count])

  const handleSendWhatsApp = () => {
    if (items.length === 0) return
    track('send_order_whatsapp', { items: count, subtotal })
    const lines = items.map((i, idx) => `${idx + 1}. ${i.nombre} · ${i.marca} · Talla ${i.talla || '—'} · Color ${i.color} · Cant. ${i.cantidad}`).join('\n')
    const cartParams = items.map(i => `${i.slug}|${i.talla || ''}|${i.color}|${i.cantidad}`).join(',')
    const cartUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?carrito=${encodeURIComponent(cartParams)}`
    const entregaStr = entrega === 'envio' ? 'Envío' : entrega === 'retiro' ? 'Retiro en tienda' : '—'
    const destinoStr = entrega === 'envio' ? (destino || '—') : 'Recoger en tienda'
    const message = `Hola, La Torre. Quiero realizar el siguiente pedido:\n${lines}\n\nPedido completo: ${cartUrl}\nEntrega: ${entregaStr}\nDestino: ${destinoStr}`
    window.open(waLink(message), '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md w-[95vw] max-h-[92vh] overflow-y-auto bg-cream p-0 scrollbar-boutique" aria-describedby="cart-description">
        <DialogTitle className="sr-only">{step === 1 ? 'Resumen de tu pedido' : 'Entrega y envío'}</DialogTitle>
        <DialogDescription id="cart-description" className="sr-only">{step === 1 ? 'Revisa tus prendas antes de continuar.' : 'Elige cómo quieres recibir tu pedido.'}</DialogDescription>
        <div className="sticky top-0 bg-cream border-b border-midnight/10 px-5 py-4 flex items-center justify-between z-10">
          {step === 2 ? (
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs uppercase tracking-wider text-midnight hover:text-gold">
              <ChevronLeft className="w-4 h-4" />VOLVER
            </button>
          ) : (<p className="text-xs uppercase tracking-[0.18em] text-midnight font-medium">TU CARRITO</p>)}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{count} {count === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}</span>
            <button onClick={onClose} aria-label="Cerrar" className="text-midnight hover:text-gold"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="px-5 py-5">
          {step === 1 ? (
            items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h2 className="font-serif text-xl font-semibold text-midnight mb-2">Tu carrito está vacío</h2>
                <p className="text-sm text-muted-foreground mb-6">Explora nuestras colecciones y agrega tus prendas favoritas.</p>
                <button onClick={onClose} className="px-6 py-2.5 bg-midnight text-cream text-xs uppercase tracking-wider rounded-full hover:bg-midnight-light transition-colors">SEGUIR COMPRANDO</button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-xl font-semibold text-midnight mb-1">Resumen de tu pedido</h2>
                <p className="text-sm text-muted-foreground mb-5">Revisa tus prendas antes de continuar.</p>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.talla}`} className="flex gap-3 bg-white p-3 rounded-lg border border-midnight/5">
                      <Picture src={item.imagen} alt={item.nombre} className="w-16 h-20 object-cover rounded" sizes="64px" widths={[200]} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-gold font-medium">{item.marca}</p>
                        <p className="product-name text-sm text-midnight font-medium line-clamp-1">{item.nombre}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.color}{item.talla && ` · Talla ${item.talla}`}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.productId, item.talla, item.cantidad - 1)} className="w-6 h-6 border border-midnight/20 text-midnight text-xs hover:bg-midnight hover:text-cream transition-colors" aria-label="Reducir cantidad">–</button>
                            <span className="text-sm text-midnight w-6 text-center">{item.cantidad}</span>
                            <button onClick={() => updateQty(item.productId, item.talla, item.cantidad + 1)} className="w-6 h-6 border border-midnight/20 text-midnight text-xs hover:bg-midnight hover:text-cream transition-colors" aria-label="Aumentar cantidad">+</button>
                          </div>
                          <span className="text-sm font-semibold text-midnight">{formatGTQ(item.precio * item.cantidad)}</span>
                        </div>
                      </div>
                      <button onClick={() => remove(item.productId, item.talla)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label={`Quitar ${item.nombre} del carrito`}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-midnight/10 pt-4 mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">SUBTOTAL</span>
                    <span className="text-lg font-semibold text-midnight">{formatGTQ(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">No incluye envío</p>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-3.5 bg-midnight text-cream text-sm uppercase tracking-wider font-medium rounded-full hover:bg-midnight-light transition-colors mb-2">CONTINUAR</button>
                <button onClick={clear} className="w-full py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors">VACIAR CARRITO</button>
              </>
            )
          ) : (
            <>
              <h2 className="font-serif text-xl font-semibold text-midnight mb-1">Entrega y envío</h2>
              <p className="text-sm text-muted-foreground mb-5">Elige cómo quieres recibir tu pedido.</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">ENTREGA</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button onClick={() => setEntrega('envio')} className={`py-4 px-4 border text-sm uppercase tracking-wider font-medium transition-colors flex flex-col items-center gap-2 ${entrega === 'envio' ? 'border-midnight bg-midnight text-cream' : 'border-midnight/20 text-midnight hover:border-midnight'}`}>
                  <Truck className="w-5 h-5" />ENVÍO
                </button>
                <button onClick={() => setEntrega('retiro')} className={`py-4 px-4 border text-sm uppercase tracking-wider font-medium transition-colors flex flex-col items-center gap-2 ${entrega === 'retiro' ? 'border-midnight bg-midnight text-cream' : 'border-midnight/20 text-midnight hover:border-midnight'}`}>
                  <Store className="w-5 h-5" />RETIRO EN TIENDA
                </button>
              </div>
              {entrega === 'envio' && (
                <div className="mb-5">
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">DESTINO (DEPARTAMENTO Y MUNICIPIO)</label>
                  <input type="text" value={destino} onChange={e => setDestino(e.target.value)} placeholder="Ej. Quetzaltenango, Quetzaltenango" className="w-full px-3 py-2.5 text-sm border border-midnight/15 bg-white rounded focus:outline-none focus:border-gold" />
                  <p className="text-xs text-muted-foreground mt-2 italic">Enviamos con {BRAND.shippingCarriers} ({BRAND.shippingTime}). Gratis en compras +Q{BRAND.freeShippingThreshold}.</p>
                </div>
              )}
              {entrega === 'retiro' && (
                <div className="mb-5 p-4 bg-cream-deep rounded-lg">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">RETIRO EN TIENDA</p>
                  <p className="text-sm text-midnight">{BRAND.addressFull}</p>
                  <p className="text-xs text-muted-foreground mt-1">{BRAND.hours}</p>
                  <p className="text-xs text-muted-foreground italic mt-2">Tienes 5 días para recoger tu pedido.</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mb-5 italic">Al pulsar &ldquo;Enviar pedido por WhatsApp&rdquo; se abrirá WhatsApp con tu pedido precargado. Confirmaremos disponibilidad y total final contigo.</p>
              <div className="border-t border-midnight/10 pt-4 mb-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">SUBTOTAL</span>
                  <span className="text-lg font-semibold text-midnight">{formatGTQ(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">No incluye envío</p>
              </div>
              <button onClick={handleSendWhatsApp} disabled={!entrega} className={`w-full py-3.5 mb-2 text-sm uppercase tracking-wider font-medium rounded-full transition-colors flex items-center justify-center gap-2 ${entrega ? 'bg-whatsapp text-white hover:bg-whatsapp-dark' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                <MessageCircle className="w-4 h-4" />ENVIAR PEDIDO POR WHATSAPP
              </button>
              <button onClick={clear} className="w-full py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors">VACIAR CARRITO</button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

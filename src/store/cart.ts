'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/data/products'

export interface CartItem {
  productId: number; slug: string; nombre: string; marca: string; color: string; colorHex: string
  talla: string; precio: number; imagen: string; cantidad: number
}
interface CartState {
  items: CartItem[]; isOpen: boolean; step: 1 | 2; entrega: 'envio' | 'retiro' | null; destino: string
  open: () => void; close: () => void; setStep: (s: 1 | 2) => void; setEntrega: (e: 'envio' | 'retiro') => void; setDestino: (d: string) => void
  add: (product: Product, talla: string) => void; remove: (productId: number, talla: string) => void; updateQty: (productId: number, talla: string, qty: number) => void; clear: () => void
  subtotal: () => number; count: () => number
}
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], isOpen: false, step: 1, entrega: null, destino: '',
      open: () => set({ isOpen: true, step: 1 }),
      close: () => set({ isOpen: false }),
      setStep: (s) => set({ step: s }),
      setEntrega: (e) => set({ entrega: e }),
      setDestino: (d) => set({ destino: d }),
      add: (product, talla) => {
        const existing = get().items.find(i => i.productId === product.id && i.talla === talla)
        if (existing) {
          set({ items: get().items.map(i => i.productId === product.id && i.talla === talla ? { ...i, cantidad: i.cantidad + 1 } : i) })
        } else {
          set({ items: [...get().items, { productId: product.id, slug: product.slug, nombre: product.nombre, marca: product.marca, color: product.color, colorHex: product.colorHex, talla, precio: product.precio, imagen: product.imagenes[0] || '', cantidad: 1 }] })
        }
      },
      remove: (productId, talla) => set({ items: get().items.filter(i => !(i.productId === productId && i.talla === talla)) }),
      updateQty: (productId, talla, qty) => {
        if (qty <= 0) set({ items: get().items.filter(i => !(i.productId === productId && i.talla === talla)) })
        else set({ items: get().items.map(i => i.productId === productId && i.talla === talla ? { ...i, cantidad: qty } : i) })
      },
      clear: () => set({ items: [], entrega: null, destino: '', step: 1 }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
      count: () => get().items.reduce((sum, i) => sum + i.cantidad, 0),
    }),
    { name: 'latorre-cart' }
  )
)

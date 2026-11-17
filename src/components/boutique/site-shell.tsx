'use client'
import { useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { filterToParams, type FilterState } from '@/lib/boutique/catalog'
import { TopBar } from './top-bar'
import { Header } from './header'
import { Footer } from './footer'
import { CartDrawer } from './cart-drawer'

/** Barra superior + encabezado + pie + carrito, para las páginas que no son el catálogo (ej. /qa). */
export function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const openCart = useCart(s => s.open)
  const isCartOpen = useCart(s => s.isOpen)
  const closeCart = useCart(s => s.close)

  const navigate = useCallback((nf: Partial<FilterState>) => {
    // El encabezado manda { sale: ['true'] } para SALE.
    const p = filterToParams({ ...nf, sale: (nf as Record<string, unknown>).sale !== undefined })
    router.push(p.toString() ? `/?${p}` : '/')
  }, [router])
  const handleSearch = useCallback((q: string) => router.push(`/?q=${encodeURIComponent(q)}`), [router])
  const goHome = useCallback(() => router.push('/'), [router])

  // Enlaces externos marcados con data-track (ej. rastreo Forza/Guatex)
  const onClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest('[data-track]')
    if (a) track('external_link_click', { dest: a.getAttribute('data-track') || '' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream" onClick={onClick}>
      <TopBar />
      <Header onNavigate={navigate} onSearch={handleSearch} onOpenCart={openCart} onHome={goHome} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  )
}

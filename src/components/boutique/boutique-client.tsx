'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from './top-bar'
import { Header } from './header'
import { Hero } from './hero'
import { Categories } from './categories'
import { FilterPhrases } from './filter-phrases'
import { InfoSection } from './info-section'
import { TrustSection } from './trust-section'
import { Footer } from './footer'
import { ProductGrid } from './product-grid'
import { CartDrawer } from './cart-drawer'
import { EMPTY_FILTER, filterToParams, paramsToFilter, type FilterState } from '@/lib/boutique/catalog'
import { useCart } from '@/store/cart'

type View = 'home' | 'listing'

function parseUrlFilter(): { view: View; filter: FilterState } {
  if (typeof window === 'undefined') return { view: 'home', filter: EMPTY_FILTER }
  const f = paramsToFilter(new URLSearchParams(window.location.search))
  return f ? { view: 'listing', filter: f } : { view: 'home', filter: EMPTY_FILTER }
}

export function BoutiqueClient() {
  const router = useRouter()
  const [view, setView] = useState<View>('home')
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER)
  const openCart = useCart(s => s.open)
  const isCartOpen = useCart(s => s.isOpen)
  const closeCart = useCart(s => s.close)

  useEffect(() => { const { view: v, filter: f } = parseUrlFilter(); setView(v); setFilter(f) }, [])
  useEffect(() => {
    const h = () => { const { view: v, filter: f } = parseUrlFilter(); setView(v); setFilter(f) }
    window.addEventListener('popstate', h)
    return () => window.removeEventListener('popstate', h)
  }, [])

  const pushUrl = useCallback((f: FilterState, v: View) => {
    const p = v === 'listing' ? filterToParams(f) : new URLSearchParams()
    window.history.pushState({}, '', p.toString() ? `/?${p}` : '/')
  }, [])

  const navigate = useCallback((nf: Partial<FilterState>) => {
    const isSale = (nf as Record<string, unknown>).sale !== undefined
    const merged = isSale ? { ...EMPTY_FILTER, sale: true } : { ...EMPTY_FILTER, ...nf }
    setFilter(merged); setView('listing'); pushUrl(merged, 'listing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pushUrl])

  const handleSearch = useCallback((q: string) => {
    const merged = { ...EMPTY_FILTER, search: q }
    setFilter(merged); setView('listing'); pushUrl(merged, 'listing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pushUrl])

  const goHome = useCallback(() => {
    setView('home'); setFilter(EMPTY_FILTER); window.history.pushState({}, '', '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const openProduct = useCallback((slug: string) => { router.push(`/producto/${slug}`) }, [router])
  const scrollC = useCallback(() => { document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' }) }, [])
  const scrollI = useCallback(() => { document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' }) }, [])

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <TopBar />
      <Header onNavigate={navigate} onSearch={handleSearch} onOpenCart={openCart} onHome={goHome} />
      <main className="flex-1">
        {view === 'home' ? (
          <>
            <Hero onColecciones={scrollC} onComoLlegar={scrollI} />
            <Categories onSelect={(cat) => navigate({ categorias: cat.split(',') })} />
            <FilterPhrases onSelect={(f) => navigate(f)} />
            <InfoSection />
            <TrustSection />
          </>
        ) : (
          <ProductGrid filter={filter} onOpenProduct={openProduct} onNavigate={navigate} />
        )}
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  )
}

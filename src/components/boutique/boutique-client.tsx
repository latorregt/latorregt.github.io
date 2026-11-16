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
import { InfoModal } from './info-modal'
import { EMPTY_FILTER, type FilterState } from '@/lib/boutique/catalog'
import { useCart } from '@/store/cart'

type View = 'home' | 'listing'

export function BoutiqueClient() {
  const router = useRouter()
  const [view, setView] = useState<View>('home')
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER)
  const [infoModalKey, setInfoModalKey] = useState<string | null>(null)
  const openCart = useCart(s => s.open)
  const isCartOpen = useCart(s => s.isOpen)
  const closeCart = useCart(s => s.close)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const categoria = params.get('categoria')
    const tipo = params.get('tipo')
    const marca = params.get('marca')
    const search = params.get('q')
    const sale = params.get('sale')
    const newFilter: FilterState = { ...EMPTY_FILTER }
    if (categoria) newFilter.categorias = categoria.split(',').filter(Boolean)
    if (tipo) newFilter.tipos = tipo.split(',').filter(Boolean)
    if (marca) newFilter.marcas = marca.split(',').filter(Boolean)
    if (search) newFilter.search = search
    if (sale === 'true') newFilter.sale = true
    if (categoria || tipo || marca || search || sale === 'true') {
      setView('listing'); setFilter(newFilter)
    } else { setView('home') }
  }, [])

  const updateUrl = useCallback((newFilter: FilterState, newView: View) => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (newView === 'listing') {
      if (newFilter.categorias.length) params.set('categoria', newFilter.categorias.join(','))
      if (newFilter.tipos.length) params.set('tipo', newFilter.tipos.join(','))
      if (newFilter.marcas.length) params.set('marca', newFilter.marcas.join(','))
      if (newFilter.search) params.set('q', newFilter.search)
      if (newFilter.sale) params.set('sale', 'true')
    }
    const qs = params.toString()
    window.history.replaceState({}, '', qs ? `/?${qs}` : '/')
  }, [])

  const navigate = useCallback((newFilter: Partial<FilterState>) => {
    const isSaleNav = (newFilter as Record<string, unknown>).sale !== undefined
    const merged: FilterState = isSaleNav ? { ...EMPTY_FILTER, sale: true } : { ...EMPTY_FILTER, ...newFilter }
    setFilter(merged); setView('listing'); updateUrl(merged, 'listing')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateUrl])

  const handleSearch = useCallback((q: string) => {
    const merged: FilterState = { ...EMPTY_FILTER, search: q }
    setFilter(merged); setView('listing'); updateUrl(merged, 'listing')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateUrl])

  const goHome = useCallback(() => {
    router.push('/')
  }, [router])

  const openProduct = useCallback((slug: string) => {
    router.push(`/producto/${slug}`)
  }, [router])

  const scrollToCategorias = useCallback(() => { document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' }) }, [])
  const scrollToInfo = useCallback(() => { document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' }) }, [])

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <TopBar />
      <Header onNavigate={navigate} onSearch={handleSearch} onOpenCart={openCart} onHome={goHome} />
      <main className="flex-1">
        {view === 'home' ? (
          <>
            <Hero onColecciones={scrollToCategorias} onComoLlegar={scrollToInfo} />
            <Categories onSelect={(cat) => navigate({ categorias: cat.split(',') })} />
            <FilterPhrases onSelect={(f) => navigate(f)} />
            <InfoSection />
            <TrustSection />
          </>
        ) : (
          <ProductGrid filter={filter} onOpenProduct={openProduct} />
        )}
      </main>
      <Footer onOpenInfoModal={setInfoModalKey} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <InfoModal openKey={infoModalKey} onClose={() => setInfoModalKey(null)} onOpenInfoModal={setInfoModalKey} />
    </div>
  )
}

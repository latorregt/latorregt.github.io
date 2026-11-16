'use client'

import { useState, useEffect, useCallback } from 'react'
import { TopBar } from './top-bar'
import { Header } from './header'
import { Hero } from './hero'
import { Categories } from './categories'
import { FilterPhrases } from './filter-phrases'
import { InfoSection } from './info-section'
import { TrustSection } from './trust-section'
import { Footer } from './footer'
import { ProductGrid } from './product-grid'
import { ProductModal } from './product-modal'
import { CartDrawer } from './cart-drawer'
import { InfoModal } from './info-modal'
import { EMPTY_FILTER, type FilterState } from '@/lib/boutique/catalog'
import { useCart } from '@/store/cart'

type View = 'home' | 'listing'

export function BoutiqueClient() {
  const [view, setView] = useState<View>('home')
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER)
  const [productSlug, setProductSlug] = useState<string | null>(null)
  const [infoModalKey, setInfoModalKey] = useState<string | null>(null)
  const openCart = useCart(s => s.open)
  const isCartOpen = useCart(s => s.isOpen)
  const closeCart = useCart(s => s.close)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const producto = params.get('producto')
    const categoria = params.get('categoria')
    const tipo = params.get('tipo')
    const marca = params.get('marca')
    const search = params.get('q')
    const sale = params.get('sale')
    if (producto) setProductSlug(producto)
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
    setView('home'); setFilter(EMPTY_FILTER); setProductSlug(null); updateUrl(EMPTY_FILTER, 'home')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [updateUrl])

  const openProduct = useCallback((slug: string) => {
    setProductSlug(slug)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.set('producto', slug)
      window.history.replaceState({}, '', `/?${params.toString()}`)
    }
  }, [])

  const closeProduct = useCallback(() => {
    setProductSlug(null)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.delete('producto')
      const qs = params.toString()
      window.history.replaceState({}, '', qs ? `/?${qs}` : '/')
    }
  }, [])

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
      <ProductModal slug={productSlug} onClose={closeProduct} onOpenProduct={openProduct} onOpenInfoModal={setInfoModalKey} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <InfoModal openKey={infoModalKey} onClose={() => setInfoModalKey(null)} onOpenInfoModal={setInfoModalKey} />
    </div>
  )
}

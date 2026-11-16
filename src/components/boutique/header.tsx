'use client'

import { useState, useRef, useEffect } from 'react'
import { tiposByCategoria } from '@/data/filters'
import { Logo } from './logo'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onNavigate: (filter: Record<string, string[]>) => void
  onSearch: (q: string) => void
  onOpenCart: () => void
  onHome: () => void
}

export function Header({ onNavigate, onSearch, onOpenCart, onHome }: HeaderProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useCart(s => s.count())
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus() }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) {
      track('search_use', { query: searchQ })
      onSearch(searchQ.trim())
      setSearchOpen(false)
      setMobileOpen(false)
    }
  }

  const navItems = [
    { label: 'HOMBRE', cat: 'Hombre' },
    { label: 'MUJER', cat: 'Mujer' },
    { label: 'NIÑOS', cat: null, children: [
      { label: 'JUVENIL (10–18 años)', cat: 'Juvenil' },
      { label: 'INFANTIL (2–8 años)', cat: 'Infantil' },
    ]},
    { label: 'SALE', cat: '__SALE__' },
  ]

  const handleNavClick = (cat: string | null, tipo?: string) => {
    if (cat === '__SALE__') { onNavigate({ sale: ['true'] as unknown as string[] }); track('nav_sale_click') }
    else if (cat) {
      if (tipo) onNavigate({ categorias: [cat], tipos: [tipo] })
      else onNavigate({ categorias: [cat] })
      track('nav_category_click', { cat, tipo })
    }
    setHovered(null); setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-midnight/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo onClick={onHome} />
          <nav className="hidden md:flex items-center gap-1" aria-label="Categorías">
            {navItems.map(item => (
              <div key={item.label} className="relative" onMouseEnter={() => setHovered(item.label)} onMouseLeave={() => setHovered(null)}>
                <button className="nav-link px-4 py-2 text-xs tracking-[0.18em] uppercase font-medium text-midnight flex items-center gap-1" onClick={() => item.cat && handleNavClick(item.cat)}>
                  {item.label}
                  {(item.children || (item.cat && tiposByCategoria[item.cat])) && <ChevronDown className="w-3 h-3" />}
                </button>
                {hovered === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="dropdown-animate bg-white shadow-xl border border-midnight/10 rounded-lg py-2 min-w-[200px]">
                      {item.children ? (
                        item.children.map(child => (
                          <div key={child.cat}>
                            <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-gold font-medium border-b border-midnight/5">{child.label}</p>
                            {(tiposByCategoria[child.cat] || []).map(tipo => (
                              <button key={tipo} onClick={() => handleNavClick(child.cat, tipo)} className="block w-full text-left px-4 py-1.5 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors">{tipo}</button>
                            ))}
                          </div>
                        ))
                      ) : item.cat === '__SALE__' ? (
                        <button onClick={() => handleNavClick('__SALE__')} className="block w-full text-left px-4 py-2 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors">SALE</button>
                      ) : item.cat ? (
                        (tiposByCategoria[item.cat] || []).map(tipo => (
                          <button key={tipo} onClick={() => handleNavClick(item.cat!, tipo)} className="block w-full text-left px-4 py-2 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors">{tipo}</button>
                        ))
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="text-midnight p-2 hover:text-gold transition-colors" aria-label="Cuenta" tabIndex={-1}><User className="w-5 h-5" /></button>
            <button onClick={() => setSearchOpen(s => !s)} className="text-midnight p-2 hover:text-gold transition-colors" aria-label="Buscar" aria-expanded={searchOpen}>{searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}</button>
            <button onClick={() => { track('cart_open'); onOpenCart() }} className="text-midnight p-2 hover:text-gold transition-colors relative" aria-label={`Carrito (${cartCount} ${cartCount === 1 ? 'producto' : 'productos'})`}>
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-midnight text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileOpen(s => !s)} className="md:hidden text-midnight p-2" aria-label="Menú" aria-expanded={mobileOpen}>{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="pb-3">
            <div className="relative">
              <input ref={searchRef} type="search" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Buscar por marca, nombre, color, tipo..." className="w-full px-4 py-2.5 pl-10 text-sm border border-midnight/15 rounded-md bg-white focus:outline-none focus:border-gold" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-gold font-medium">Buscar</button>
            </div>
          </form>
        )}
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-midnight/10 bg-cream">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map(item => (
              <div key={item.label} className="border-b border-midnight/5 pb-3 last:border-0">
                <p className="text-xs tracking-[0.18em] uppercase font-medium text-gold mb-2">{item.label}</p>
                {item.children ? (
                  <div className="pl-3 space-y-2">
                    {item.children.map(child => (
                      <div key={child.cat}>
                        <p className="text-xs font-medium text-midnight mb-1">{child.label}</p>
                        <div className="pl-3 flex flex-wrap gap-2">
                          {(tiposByCategoria[child.cat] || []).map(tipo => (
                            <button key={tipo} onClick={() => handleNavClick(child.cat, tipo)} className="text-xs text-midnight/80 hover:text-gold">{tipo}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : item.cat === '__SALE__' ? (
                  <button onClick={() => handleNavClick('__SALE__')} className="block text-sm text-midnight hover:text-gold">SALE</button>
                ) : item.cat ? (
                  <div className="pl-3 flex flex-wrap gap-x-3 gap-y-1">
                    {(tiposByCategoria[item.cat] || []).map(tipo => (
                      <button key={tipo} onClick={() => handleNavClick(item.cat!, tipo)} className="text-xs text-midnight/80 hover:text-gold">{tipo}</button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

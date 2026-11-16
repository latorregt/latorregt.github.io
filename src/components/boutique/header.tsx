'use client'
import { useState, useRef, useEffect } from 'react'
import { tiposByCategoria, subtiposByTipo } from '@/data/filters'
import { Logo } from './logo'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { Search, ShoppingBag, User, Menu, X, ChevronDown, ChevronRight } from 'lucide-react'

interface HeaderProps { onNavigate: (filter: Record<string, string[]>) => void; onSearch: (q: string) => void; onOpenCart: () => void; onHome: () => void }

export function Header({ onNavigate, onSearch, onOpenCart, onHome }: HeaderProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredTipo, setHoveredTipo] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useCart(s => s.count())
  const searchRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus() }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); if (searchQ.trim()) { track('search_use', { query: searchQ }); onSearch(searchQ.trim()); setSearchOpen(false); setMobileOpen(false) } }
  const navItems = [
    { label: 'HOMBRE', cat: 'Hombre', nav: false },
    { label: 'MUJER', cat: 'Mujer', nav: false },
    { label: 'NIÑOS', cat: null, nav: false, children: [{ label: 'JUVENIL (10-18 años)', cat: 'Juvenil' }, { label: 'INFANTIL (2-8 años)', cat: 'Infantil' }] },
    { label: 'SALE', cat: '__SALE__', nav: true },
  ]
  const handleNavClick = (cat: string | null, tipo?: string, subtipo?: string) => {
    if (cat === '__SALE__') { onNavigate({ sale: ['true'] as unknown as string[] }); track('nav_sale_click') }
    else if (cat) { const f: Record<string, string[]> = { categorias: [cat] }; if (tipo) f.tipos = [tipo]; if (subtipo) f.subtipos = [subtipo]; onNavigate(f); track('nav_category_click', { cat, tipo, subtipo }) }
    setHovered(null); setHoveredTipo(null); setMobileOpen(false)
  }
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-midnight/10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo onClick={onHome} />
          <nav className="hidden md:flex items-center gap-1" aria-label="Categorias" onMouseLeave={() => { setHovered(null); setHoveredTipo(null) }}>
            {navItems.map(item => (
              <div key={item.label} className="relative" onMouseEnter={() => { setHovered(item.label); setHoveredTipo(null) }}>
                <button className="nav-link px-4 py-2 text-xs tracking-[0.18em] uppercase font-medium text-midnight flex items-center gap-1" onClick={() => { if (item.nav && item.cat) handleNavClick(item.cat) }}>
                  {item.label}{(item.children || (item.cat && tiposByCategoria[item.cat])) && <ChevronDown className="w-3 h-3" />}
                </button>
                {hovered === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50" onMouseLeave={() => setHoveredTipo(null)}>
                    <div className={`dropdown-animate bg-white shadow-xl border border-midnight/10 rounded-lg py-2 ${item.label === 'NIÑOS' ? 'min-w-[340px]' : 'min-w-[220px]'}`}>
                      {item.children ? (
                        <div className="flex gap-4 px-2">
                          {item.children.map(child => (
                            <div key={child.cat} className="flex-1">
                              <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-gold font-medium border-b border-midnight/5 mb-1 whitespace-nowrap">{child.label}</p>
                              {(tiposByCategoria[child.cat] || []).map(tipo => (<button key={tipo} onClick={() => handleNavClick(child.cat, tipo)} className="block w-full text-left px-2 py-1.5 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors whitespace-nowrap">{tipo}</button>))}
                            </div>
                          ))}
                        </div>
                      ) : item.cat === '__SALE__' ? (
                        <button onClick={() => handleNavClick('__SALE__')} className="block w-full text-left px-4 py-2 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors">SALE</button>
                      ) : item.cat ? (
                        (tiposByCategoria[item.cat] || []).map(tipo => {
                          const subs = subtiposByTipo[tipo] || []
                          return (
                            <div key={tipo} className="relative group/sub" onMouseEnter={() => setHoveredTipo(tipo)} onMouseLeave={() => setHoveredTipo(null)}>
                              <button onClick={() => handleNavClick(item.cat!, tipo)} className="flex w-full items-center justify-between px-4 py-2 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors whitespace-nowrap">
                                {tipo}{subs.length > 0 && <ChevronRight className="w-3 h-3 ml-2" />}
                              </button>
                              {subs.length > 0 && hoveredTipo === tipo && (
                                <div className="absolute top-0 left-full ml-1 z-50">
                                  <div className="dropdown-animate bg-white shadow-xl border border-midnight/10 rounded-lg py-2 min-w-[180px]">
                                    {subs.map(sub => (<button key={sub} onClick={() => handleNavClick(item.cat!, tipo, sub)} className="block w-full text-left px-4 py-1.5 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors whitespace-nowrap">{sub}</button>))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })
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
            <button onClick={() => { track('cart_open'); onOpenCart() }} className="text-midnight p-2 hover:text-gold transition-colors relative" aria-label={`Carrito (${cartCount} productos)`}>
              <ShoppingBag className="w-5 h-5" />{cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-midnight text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileOpen(s => !s)} className="md:hidden text-midnight p-2" aria-label="Menu">{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        {searchOpen && (<form onSubmit={handleSearchSubmit} className="pb-3"><div className="relative"><input ref={searchRef} type="search" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Buscar por marca, nombre, color..." className="w-full px-4 py-2.5 pl-10 text-sm border border-midnight/15 rounded-md bg-white focus:outline-none focus:border-gold" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-gold font-medium">Buscar</button></div></form>)}
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-midnight/10 bg-cream max-h-[70vh] overflow-y-auto">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map(item => (
              <div key={item.label} className="border-b border-midnight/5 pb-3 last:border-0">
                <p className="text-xs tracking-[0.18em] uppercase font-medium text-gold mb-2">{item.label}</p>
                {item.children ? (<div className="pl-3 space-y-2">{item.children.map(child => (<div key={child.cat}><p className="text-xs font-medium text-midnight mb-1">{child.label}</p><div className="pl-3 flex flex-wrap gap-2">{(tiposByCategoria[child.cat] || []).map(tipo => (<button key={tipo} onClick={() => handleNavClick(child.cat, tipo)} className="text-xs text-midnight/80 hover:text-gold">{tipo}</button>))}</div></div>))}</div>) : item.cat === '__SALE__' ? (<button onClick={() => handleNavClick('__SALE__')} className="block text-sm text-midnight hover:text-gold">SALE</button>) : item.cat ? (<div className="pl-3 space-y-1">{(tiposByCategoria[item.cat] || []).map(tipo => { const subs = subtiposByTipo[tipo] || []; return (<div key={tipo}><button onClick={() => handleNavClick(item.cat!, tipo)} className="text-xs text-midnight hover:text-gold">{tipo}</button>{subs.length > 0 && (<div className="pl-3 flex flex-wrap gap-2 mt-0.5">{subs.map(sub => (<button key={sub} onClick={() => handleNavClick(item.cat!, tipo, sub)} className="text-[10px] text-midnight/60 hover:text-gold">{sub}</button>))}</div>)}</div>) })}</div>) : null}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

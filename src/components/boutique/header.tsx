'use client'
import { useState, useCallback } from 'react'
import { tiposByCategoria } from '@/data/filters'
import { submenu, type FilterState } from '@/lib/boutique/catalog'
import { Logo } from './logo'
import { SearchOverlay } from './search-overlay'
import { useCart } from '@/store/cart'
import { track } from '@/lib/boutique/analytics'
import { Search, ShoppingBag, User, Menu, X, ChevronDown, ChevronRight } from 'lucide-react'

interface HeaderProps { onNavigate: (filter: Record<string, string[]>) => void; onSearch: (q: string) => void; onOpenCart: () => void; onHome: () => void }

export function Header({ onNavigate, onSearch, onOpenCart, onHome }: HeaderProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredTipo, setHoveredTipo] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [m[[mobileOpen setMobileOpen] = useState(false)
  const cartCount = useCart(s => s.count())
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  const navItems = [
    { label: 'HOMBRE', cat: 'Hombre', nav: false },
    { label: 'MUJER', cat: 'Mujer', nav: false },
    { label: 'NIÑOS', cat: null, nav: false, children: [{ label: 'JUVENIL (10-18 años)', cat: 'Juvenil' }, { label: 'INFANTIL (2-8 años)', cat: 'Infantil' }] },
    { label: 'SALE', cat: '__SALE__', nav: true },
  ]
  const handleNavClick = (cat: string | null, tipo?: string, subtipos?: string[]) => {
    if (cat === '__SALE__') { onNavigate({ sale: ['true'] as unknown as string[] }); track('nav_sale_click') }
    else if (cat) { const f: Record<string, string[]> = { categorias: [cat] }; if (tipo) f.tipos = [tipo]; if (subtipos) f.subtipos = subtipos; onNavigate(f); track('nav_category_click', { cat, tipo, subtipo: subtipos?.join(',') }) }
    setHovered(null); setHoveredTipo(null); setMobileOpen(false)
  }
  const openSearch = () => { setSearchOpen(true); setMobileOpen(false); setHovered(null); track('search_open') }

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
                    <div className={`dropdown-animate bg-white shadow-xl border border-midnight/10 rounded-lg py-2 ${item.label === 'NIÑOS' ? 'min-w-[360px]' : 'min-w-[220px]'}`}>
                      {item.children ? (
                        <div className="flex gap-4 px-2">
                          {item.children.map(child => (
                            <div key={child.cat} className="flex-1">
                              <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-gold font-medium border-b border-midnight/5 mb-1 whitespace-nowrap">{child.label}</p>
                              {(tiposByCategoria[child.cat] || []).map(tipo => {
                                const subs = submenu(child.cat, tipo)
                                return (
                                  <div key={tipo}>
                                    <button onClick={() => handleNavClick(child.cat, tipo)} className="block w-full text-left px-2 py-1.5 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors whitespace-nowrap">{tipo}</button>
                                    {subs.map(sub => (<button key={sub.label} onClick={() => handleNavClick(child.cat, tipo, sub.subtipos)} className="block w-full text-left pl-5 pr-2 py-1 text-[13px] text-midnight/70 hover:bg-cream-deep hover:text-gold transition-colors whitespace-nowrap">{sub.label}</button>))}
                                  </div>
                                )
                              })}
                            </div>
                          ))}
                        </div>
                      ) : item.cat === '__SALE__' ? (
                        <button onClick={() => handleNavClick('__SALE__')} className="block w-full text-left px-4 py-2 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors">SALE</button>
                      ) : item.cat ? (
                        (tiposByCategoria[item.cat] || []).map(tipo => {
                          const subs = submenu(item.cat!, tipo)
                          return (
                            <div key={tipo} className="relative group/sub" onMouseEnter={() => setHoveredTipo(tipo)} onMouseLeave={() => setHoveredTipo(null)}>
                              <button onClick={() => handleNavClick(item.cat!, tipo)} className="flex w-full items-center justify-between px-4 py-2 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors whitespace-nowrap">
                                {tipo}{subs.length > 0 && <ChevronRight className="w-3 h-3 ml-2" />}
                              </button>
                              {subs.length > 0 && hoveredTipo === tipo && (
                                <div className="absolute top-0 left-full ml-1 z-50">
                                  <div className="dropdown-animate bg-white shadow-xl border border-midnight/10 rounded-lg py-2 min-w-[180px]">
                                    {subs.map(sub => (<button key={sub.label} onClick={() => handleNavClick(item.cat!, tipo, sub.subtipos)} className="block w-full text-left px-4 py-1.5 text-sm text-midnight hover:bg-cream-deep hover:text-gold transition-colors whitespace-nowrap">{sub.label}</button>))}
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
            <button onClick={openSearch} className="text-midnight p-2 hover:text-gold transition-colors" aria-label="Buscar" aria-expanded={searchOpen}><Search className="w-5 h-5" /></button>
            <button onClick={() => { track('cart_open'); onOpenCart() }} className="text-midnight p-2 hover:text-gold transition-colors relative" aria-label={`Carrito (${cartCount} productos)`}>
              <ShoppingBag className="w-5 h-5" />{cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-midnight text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileOpen(s => !s)} className="md:hidden text-midnight p-2" aria-label="Menu">{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[55] bg-cream overflow-y-auto">
          <div className="flex justify-end p-4"><button onClick={() => setMobileOpen(false)} className="text-midnight p-2"><X className="w-6 h-6" /></button></div><nav className="px-4 pb-8 space-y-3">
            {navItems.map(item => {
              const cats = item.children ? item.children : item.cat && item.cat !== '__SALE__' ? [{ label: '', cat: item.cat }] : []
              return (
                <div key={item.label} className="border-b border-midnight/5 pb-3 last:border-0">
                  <p className="text-xs tracking-[0.18em] uppercase font-medium text-gold mb-2">{item.label}</p>
                  {item.cat === '__SALE__' ? (<button onClick={() => handleNavClick('__SALE__')} className="block text-sm text-midnight hover:text-gold">SALE</button>) : (
                    <div className="pl-3 space-y-2">
                      {cats.map(c => (
                        <div key={c.cat}>
                          {c.label && <p className="text-xs font-medium text-midnight mb-1">{c.label}</p>}
                          <div className={c.label ? 'pl-3 space-y-1' : 'space-y-1'}>
                            {(tiposByCategoria[c.cat] || []).map(tipo => {
                              const subs = submenu(c.cat, tipo)
                              return (
                                <div key={tipo}>
                                  <button onClick={() => handleNavClick(c.cat, tipo)} className="text-xs text-midnight hover:text-gold">{tipo}</button>
                                  {subs.length > 0 && (<div className="pl-3 flex flex-wrap gap-x-3 gap-y-1 mt-0.5">{subs.map(sub => (<button key={sub.label} onClick={() => handleNavClick(c.cat, tipo, sub.subtipos)} className="text-[11px] text-midnight/60 hover:text-gold">{sub.label}</button>))}</div>)}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      )}
      <SearchOverlay open={searchOpen} onClose={closeSearch} onSearch={onSearch} onNavigate={(f: Partial<FilterState>) => onNavigate(f as Record<string, string[]>)} />
    </header>
  )
}

'use client'

import { BRAND } from '@/lib/boutique/brand'
import { SocialIcons } from './social-icons'
import { Picture } from '@/components/boutique/picture'

interface FooterProps {
  onOpenInfoModal: (key: string) => void
}

const SOPORTE = [
  { key: 'qa', label: 'Q&A' },
  { key: 'contacto', label: 'Contacto' },
  { key: 'atencion', label: 'Atención inmediata' },
  { key: 'estado', label: 'Estado del pedido' },
  { key: 'colaboraciones', label: 'Colaboraciones' },
]
const TERMINOS = [
  { key: 'proceso', label: 'Proceso de compra' },
  { key: 'entrega', label: 'Entrega o servicio' },
  { key: 'retiro', label: 'Retiro en tienda' },
  { key: 'devoluciones', label: 'Devoluciones y cambios' },
  { key: 'terminos', label: 'Términos y privacidad' },
]
const PAYMENT_LOGOS = [
  { src: '/images/pagos/Gemini_Generated_Image_exwf0kexwf0kexwf.jpg', alt: 'Apple Pay' },
  { src: '/images/pagos/Visa-Logo-2005.jpg', alt: 'Visa' },
  { src: '/images/pagos/images.jpg', alt: 'Mastercard' },
  { src: '/images/pagos/google-pay-logo.jpg', alt: 'Google Pay' },
  { src: '/images/pagos/Gemini_Generated_Image_ub6dcdub6dcdub6d.jpg', alt: 'PayPal' },
]

export function Footer({ onOpenInfoModal }: FooterProps) {
  return (
    <footer className="bg-midnight-deep text-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center mb-12">
          <SocialIcons variant="light" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
          <div>
            <h3 className="font-serif text-sm tracking-[0.2em] uppercase text-gold mb-4 text-center md:text-left">SOPORTE</h3>
            <ul className="space-y-2.5 text-center md:text-left">
              {SOPORTE.map(item => (
                <li key={item.key}>
                  <button onClick={() => onOpenInfoModal(item.key)} className="text-sm text-cream/85 hover:text-gold transition-colors">{item.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-sm tracking-[0.2em] uppercase text-gold mb-4 text-center md:text-left">TÉRMINOS Y POLÍTICAS</h3>
            <ul className="space-y-2.5 text-center md:text-left">
              {TERMINOS.map(item => (
                <li key={item.key}>
                  <button onClick={() => onOpenInfoModal(item.key)} className="text-sm text-cream/85 hover:text-gold transition-colors">{item.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {PAYMENT_LOGOS.map(p => (
              <Picture key={p.alt} src={p.src} alt={p.alt} className="h-5 object-contain" sizes="60px" widths={[200]} />
            ))}
          </div>
          <p className="text-xs text-cream/60 italic">aplicables solo en tienda y en envíos locales</p>
        </div>
        <div className="divider-gold mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
          <p className="text-xs text-cream/60">© 2026 Boutique La Torre</p>
          <span className="hidden md:inline text-cream/30">·</span>
          <p className="text-xs text-cream/70 leading-relaxed">Relaciones comerciales con distribuidores oficiales · para piezas únicas, consúltanos</p>
        </div>
      </div>
    </footer>
  )
}

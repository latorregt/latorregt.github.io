'use client'

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { X, ChevronDown, ExternalLink, Phone, Mail, MapPin } from 'lucide-react'
import { BRAND } from '@/lib/boutique/brand'
import { track } from '@/lib/boutique/analytics'

interface InfoModalProps { openKey: string | null; onClose: () => void; onOpenInfoModal: (key: string) => void }

const QA_ITEMS = [
  { q: '¿Las prendas son originales?', a: 'Sí. Todas nuestras prendas son de marca y originales.' },
  { q: '¿Cómo debo cuidar mis prendas?', a: 'Sigue siempre las instrucciones de la etiqueta de cada prenda. En general, lávalas con prendas de color similar, preferentemente con agua fría, evita el cloro y el blanqueador, plánchalas a la temperatura adecuada a la tela y sécalas a la sombra.' },
  { q: '¿Cómo hago un pedido?', a: 'Agrega tus prendas al carrito, elige envío o retiro en tienda y envía tu pedido por WhatsApp. Te confirmaremos la disponibilidad y el total.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'En línea, por depósito o transferencia. En entregas dentro de Santa Cruz del Quiché también puedes pagar contra entrega en efectivo, por transferencia, con tarjeta Visa o Mastercard, o con Apple Pay, Google Pay o PayPal.' },
  { q: '¿Por qué los precios del sitio son menores a los de etiqueta?', a: 'Los precios publicados ya incluyen el descuento por pago en efectivo o transferencia. Si pagas con tarjeta, Apple Pay, Google Pay o PayPal, se aplica el precio de etiqueta.' },
  { q: '¿Hacen envíos a todo el país?', a: 'Sí, enviamos a todo el territorio de Guatemala con Forza o Guatex.' },
  { q: '¿Cuánto cuesta el envío?', a: 'El costo estimado es de Q35 a Q50. En compras mayores a Q1,250 el envío es gratis.' },
  { q: '¿Cuánto tarda mi pedido?', a: 'Despachamos el mismo día hábil tras confirmar tu pago, y el tiempo estimado de entrega es de 1 a 3 días hábiles.' },
  { q: '¿Cómo sé dónde está mi pedido?', a: 'Te enviaremos tu número de guía. Con él puedes consultar el estado de tu envío en "Estado del pedido".' },
  { q: '¿Cómo sé qué talla elegir?', a: 'Escríbenos por WhatsApp y te enviaremos las medidas exactas de la prenda. También puedes consultar nuestra Guía de tallas.' },
  { q: '¿Puedo cambiar una prenda?', a: 'Los cambios se realizan en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado. No realizamos devoluciones de dinero.' },
  { q: '¿Puedo recoger mi pedido en tienda?', a: 'Sí. Reserva tu pedido en línea y tienes 5 días para recogerlo.' },
  { q: '¿Cómo puedo comunicarme con ustedes?', a: 'Escríbenos por WhatsApp al +502 5744 5909. Si necesitas información de inmediato, llámanos al +502 4249 2242.' },
]

function QAPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-midnight mb-1">Preguntas Frecuentes</h2>
      <p className="text-sm text-muted-foreground mb-6">Resolvemos las dudas más comunes sobre nuestros productos y servicios.</p>
      <div className="space-y-2 mb-8">
        {QA_ITEMS.map((item, i) => (
          <details key={i} className="border border-midnight/10 rounded bg-white">
            <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-midnight flex items-center justify-between">{item.q}<ChevronDown className="w-4 h-4 flex-shrink-0" /></summary>
            <p className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
      <div className="border-t border-midnight/10 pt-6">
        <h3 className="font-serif text-xl font-semibold text-midnight mb-3">Guía de tallas</h3>
        <p className="text-sm text-foreground/80 mb-4">Aunque las prendas manejan un tallaje estándar, cada marca maneja sus propias medidas. Antes de comprar, puedes pedirnos las medidas exactas de cualquier prenda.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <img src="/images/marca/Gemini_Generated_Image_hb8eojhb8eojhb8e.jpg" alt="Cómo medir una prenda de arriba" className="w-full rounded-lg" />
          <img src="/images/marca/Gemini_Generated_Image_ojbj02ojbj02ojbj.jpg" alt="Cómo medir una prenda de abajo" className="w-full rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-midnight/10">
            <thead className="bg-cream-deep"><tr><th className="px-3 py-2 text-left text-midnight">Prenda</th><th className="px-3 py-2 text-left text-midnight">Medidas</th></tr></thead>
            <tbody>
              <tr className="border-t border-midnight/10"><td className="px-3 py-2 text-midnight">Camisas, playeras, suéteres y chumpas</td><td className="px-3 py-2 text-foreground/80">Pecho (de axila a axila), largo (del hombro a la orilla inferior) y manga</td></tr>
              <tr className="border-t border-midnight/10"><td className="px-3 py-2 text-midnight">Pantalones</td><td className="px-3 py-2 text-foreground/80">Cintura, largo de entrepierna y largo total</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const PAGES: Record<string, { title: string; render: () => JSX.Element }> = {
  qa: { title: 'Q&A', render: QAPage },
  contacto: { title: 'Contacto', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-1">Contacto</h2><p className="text-sm text-muted-foreground mb-6">¿Tienes dudas sobre un producto, un pedido o tu compra? Escríbenos.</p><div className="space-y-4"><a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-midnight/10 rounded hover:border-gold transition-colors"><Phone className="w-5 h-5 text-gold" /><div><p className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</p><p className="text-sm text-midnight">{BRAND.phone}</p></div></a><a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 p-3 border border-midnight/10 rounded hover:border-gold transition-colors"><Mail className="w-5 h-5 text-gold" /><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Correo electrónico</p><p className="text-sm text-midnight">{BRAND.email}</p></div></a><div className="flex items-start gap-3 p-3 border border-midnight/10 rounded"><MapPin className="w-5 h-5 text-gold mt-0.5" /><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Tienda física</p><p className="text-sm text-midnight">{BRAND.addressFull}</p><p className="text-xs text-muted-foreground mt-1">{BRAND.hours}</p></div></div></div></div>) },
  atencion: { title: 'Atención inmediata', render: () => (<div className="text-center py-8"><h2 className="font-serif text-2xl font-semibold text-midnight mb-3">Atención inmediata</h2><p className="text-sm text-muted-foreground mb-6">¿Necesitas información de inmediato? Llámanos.</p><a href={BRAND.phoneInmediatoLink} className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-cream text-sm uppercase tracking-wider hover:bg-midnight-light transition-colors"><Phone className="w-4 h-4" />{BRAND.phoneInmediato}</a></div>) },
  estado: { title: 'Estado del pedido', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-1">Estado del pedido</h2><p className="text-sm text-muted-foreground mb-6">Consulta el estado de tu envío con tu número de guía.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><a href={BRAND.shipping.forza} target="_blank" rel="noopener noreferrer" onClick={() => track('external_link_click', { dest: 'forza' })} className="flex items-center justify-between p-4 border border-midnight/10 rounded hover:border-gold transition-colors"><span className="text-sm text-midnight font-medium">Rastrear con Forza</span><ExternalLink className="w-4 h-4 text-gold" /></a><a href={BRAND.shipping.guatex} target="_blank" rel="noopener noreferrer" onClick={() => track('external_link_click', { dest: 'guatex' })} className="flex items-center justify-between p-4 border border-midnight/10 rounded hover:border-gold transition-colors"><span className="text-sm text-midnight font-medium">Rastrear con Guatex</span><ExternalLink className="w-4 h-4 text-gold" /></a></div></div>) },
  colaboraciones: { title: 'Colaboraciones', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-1">Colaboraciones</h2><p className="text-sm text-muted-foreground mb-6">En La Torre estamos abiertos a escuchar propuestas de creadores de contenido, marcas y emprendedores.</p><p className="text-sm text-foreground/80 mb-4">Si tienes una idea, envíanos tu propuesta indicando quién eres, qué tienes en mente y cómo podríamos colaborar.</p><div className="space-y-3"><a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="block p-3 border border-midnight/10 rounded hover:border-gold transition-colors"><p className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</p><p className="text-sm text-midnight">{BRAND.phoneInmediato}</p></a><a href={`mailto:${BRAND.email}`} className="block p-3 border border-midnight/10 rounded hover:border-gold transition-colors"><p className="text-xs uppercase tracking-wider text-muted-foreground">Correo electrónico</p><p className="text-sm text-midnight">{BRAND.email}</p></a></div></div>) },
  proceso: { title: 'Proceso de compra', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-6">Proceso de compra</h2><ol className="space-y-4">{[{t:'Elige tus prendas',d:'Selecciona la talla y el color, y agrégalas a tu carrito.'},{t:'Envía tu pedido por WhatsApp',d:'Desde el carrito, elige si quieres envío o retiro en tienda, indica tu destino y envía tu pedido.'},{t:'Confirma tu pedido',d:'Te responderemos por WhatsApp para confirmar la disponibilidad y el total final.'},{t:'Realiza tu pago',d:'Te enviaremos los datos para pagar por depósito o transferencia.'},{t:'Recibe tu pedido',d:'Despachamos el mismo día hábil y te enviamos tu número de guía.'}].map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 bg-midnight text-cream rounded-full flex items-center justify-center text-sm font-semibold">{i + 1}</span><div><p className="text-sm font-medium text-midnight">{step.t}</p><p className="text-sm text-foreground/80">{step.d}</p></div></li>))}</ol></div>) },
  entrega: { title: 'Entrega o servicio', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-6">Entrega o servicio</h2><div className="space-y-5 text-sm">{[{t:'Cobertura',d:'Realizamos envíos a todo el territorio de Guatemala.'},{t:'Paqueterías',d:'Enviamos con Forza o Guatex, según el destino y la disponibilidad.'},{t:'Tiempo de despacho',d:'Una vez confirmado tu pago, despachamos tu pedido el mismo día hábil.'},{t:'Tiempo de entrega',d:'El tiempo estimado de entrega es de 1 a 3 días hábiles a partir del despacho.'},{t:'Costo del envío',d:'El costo estimado es de Q35 a Q50, según el destino y la cantidad de prendas.'},{t:'Envío gratis',d:'En compras mayores a Q1,250, el envío es gratis.'},{t:'Entrega en Santa Cruz del Quiché',d:'En el casco urbano, el envío es gratis hasta la puerta de tu casa. Puedes pagar contra entrega en efectivo, por transferencia, con tarjeta Visa o Mastercard, o con Apple Pay, Google Pay o PayPal.'},{t:'Seguimiento',d:'Te enviaremos tu número de guía para consultar el estado de tu envío.'}].map((b, i) => (<div key={i}><p className="font-medium text-midnight mb-1">{b.t}</p><p className="text-foreground/80">{b.d}</p></div>))}</div></div>) },
  retiro: { title: 'Retiro en tienda', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-6">Retiro en tienda</h2><p className="text-sm text-foreground/80 mb-4">Puedes comprar en línea y recoger tu pedido en nuestra tienda, sin costo de envío.</p><p className="font-medium text-midnight mb-2">Cómo funciona</p><ol className="text-sm text-foreground/80 list-decimal pl-5 space-y-1 mb-4"><li>Realiza tu pedido y elige "Retiro en tienda".</li><li>Reserva tu pedido pagando por depósito o transferencia el total, o el 50% del valor.</li><li>Te confirmaremos por WhatsApp y te enviaremos tu código de retiro.</li></ol><p className="font-medium text-midnight mb-1">Plazo</p><p className="text-sm text-foreground/80 mb-4">Tienes 5 días calendario para recoger tu pedido.</p><p className="font-medium text-midnight mb-1">Dirección y horario</p><p className="text-sm text-foreground/80">{BRAND.addressFull}</p><p className="text-sm text-foreground/80">{BRAND.hours}</p></div>) },
  devoluciones: { title: 'Devoluciones y cambios', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-6">Devoluciones y cambios</h2><p className="text-sm text-foreground/80 mb-6">Los cambios se realizan únicamente en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado. No realizamos devoluciones de dinero.</p><div className="space-y-5 text-sm">{[{t:'1. Plazo y lugar',d:'Dispones de 15 días calendario desde la entrega para solicitar un cambio en nuestra tienda física.'},{t:'2. Condiciones de la prenda',d:'La prenda debe encontrarse en perfecto estado, con todas sus etiquetas y sin daños. Es obligatorio presentar el comprobante de compra.'},{t:'3. Modalidad de cambio',d:'El cambio se realiza en tienda física por una prenda de igual o mayor valor, abonando la diferencia si corresponde.'},{t:'4. Reembolsos',d:'No se realizan reembolsos en efectivo ni reversiones a tarjetas. El cambio se efectúa únicamente por otra prenda.'},{t:'5. Talla equivocada en el envío',d:'Si recibes una talla distinta, repórtalo dentro de las 48 horas posteriores a la entrega. Asumimos la corrección sin costo adicional.'},{t:'6. Inspección y rechazo',d:'Cada prenda se inspecciona físicamente al momento del cambio. Señales de uso, lavado, manchas o falta de etiquetas causan rechazo.'}].map((b, i) => (<div key={i}><p className="font-medium text-midnight mb-1">{b.t}</p><p className="text-foreground/80">{b.d}</p></div>))}</div></div>) },
  terminos: { title: 'Términos y privacidad', render: () => (<div><h2 className="font-serif text-2xl font-semibold text-midnight mb-6">Términos y privacidad</h2><div className="space-y-5 text-sm">{[{t:'1. Ámbito',d:'Estos términos regulan el uso de este sitio y las compras realizadas a través de él.'},{t:'2. Proceso de compra',d:'Tu pedido se concreta cuando confirmamos por WhatsApp la disponibilidad y el total, y recibimos el comprobante de tu pago.'},{t:'3. Precios y disponibilidad',d:'Los precios corresponden al pago en efectivo o transferencia. El pago con tarjeta se rige por el precio de etiqueta.'},{t:'4. Pagos',d:'En línea, el pago se realiza por depósito o transferencia.'},{t:'5. Envíos y entrega',d:'Los envíos se realizan con Forza o Guatex.'},{t:'6. Cambios y devoluciones',d:'Los cambios se realizan en nuestra tienda física, dentro de 15 días.'},{t:'7. Retiro en tienda',d:'Los pedidos reservados se conservan por 5 días calendario.'},{t:'8. Privacidad de tus datos',d:'Usamos tus datos únicamente para gestionar tu compra y atenderte.'},{t:'9. Cookies y analítica',d:'Este sitio utiliza cookies y Google Analytics para conocer cómo se usa y mejorarlo.'},{t:'10. Marcas',d:'Las marcas, nombres y logotipos que aparecen en este sitio pertenecen a sus respectivos dueños.'}].map((b, i) => (<div key={i}><p className="font-medium text-midnight mb-1">{b.t}</p><p className="text-foreground/80">{b.d}</p></div>))}</div></div>) },
}

export function InfoModal({ openKey, onClose, onOpenInfoModal }: InfoModalProps) {
  if (!openKey) return null
  const page = PAGES[openKey]
  if (!page) return null
  return (
    <Dialog open={!!openKey} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[92vh] overflow-y-auto bg-cream p-0 scrollbar-boutique" aria-describedby="info-description">
        <DialogTitle className="sr-only">{page.title}</DialogTitle>
        <DialogDescription id="info-description" className="sr-only">Contenido de la página {page.title} de Boutique La Torre.</DialogDescription>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center text-midnight hover:bg-midnight hover:text-cream transition-colors" aria-label="Cerrar"><X className="w-5 h-5" /></button>
        <div className="p-6 md:p-8">{page.render()}</div>
      </DialogContent>
    </Dialog>
  )
}

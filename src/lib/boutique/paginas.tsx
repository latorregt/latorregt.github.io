/**
 * Páginas del pie (spec de Notion, apartado 4). Cada una tiene su propia URL: /qa, /contacto, etc.
 * El texto es el de la spec; si cambia allá, se cambia aquí.
 */
import Link from 'next/link'
import type { ReactNode } from 'react'
import { BRAND, WA_LINK } from './brand'

export interface Pagina {
  slug: string
  titulo: string
  grupo: 'Soporte' | 'Términos y políticas'
  descripcion: string // meta description
  intro?: ReactNode
  cuerpo: ReactNode
}

const L = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="text-midnight underline underline-offset-4 decoration-gold/60 hover:text-gold transition-colors">{children}</Link>
)
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-midnight underline underline-offset-4 decoration-gold/60 hover:text-gold transition-colors">{children}</a>
)
const Bloque = ({ t, children }: { t: string; children: ReactNode }) => (
  <section className="py-6 border-b border-midnight/10 last:border-0">
    <h2 className="font-serif text-xl text-midnight mb-2">{t}</h2>
    <div className="text-[15px] leading-relaxed text-foreground/80 space-y-3">{children}</div>
  </section>
)
const Pasos = ({ items }: { items: { t: string; d: ReactNode }[] }) => (
  <ol className="space-y-6">
    {items.map((s, i) => (
      <li key={i} className="flex gap-5">
        <span className="flex-shrink-0 w-10 h-10 rounded-full border border-gold text-gold font-serif text-lg flex items-center justify-center">{i + 1}</span>
        <div className="pt-1.5"><p className="font-medium text-midnight mb-1">{s.t}</p><p className="text-[15px] leading-relaxed text-foreground/80">{s.d}</p></div>
      </li>
    ))}
  </ol>
)
const Tarjeta = ({ label, children, href }: { label: string; children: ReactNode; href?: string }) => {
  const inner = (<><p className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium mb-1">{label}</p><div className="text-midnight">{children}</div></>)
  const cls = 'block p-5 rounded-lg bg-white border border-midnight/10 transition-colors'
  return href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`${cls} hover:border-gold`}>{inner}</a> : <div className={cls}>{inner}</div>
}

const HORARIO = 'Lunes a domingo, de 8:45 a. m. a 1:00 p. m. y de 2:30 p. m. a 7:00 p. m.'
const TEL_INMEDIATO = 'tel:+50242492242'
const WA_COLAB = 'https://wa.me/50242492242'

export const PREGUNTAS: { q: string; a: ReactNode }[] = [
  { q: '¿Las prendas son originales?', a: 'Sí. Todas nuestras prendas son de marca y originales.' },
  { q: '¿Cómo debo cuidar mis prendas?', a: 'Sigue siempre las instrucciones de la etiqueta de cada prenda. En general, lávalas con prendas de color similar, preferentemente con agua fría, evita el cloro y el blanqueador, plánchalas a la temperatura adecuada a la tela y sécalas a la sombra. También encuentras esta información en cada producto, en "Lavado y cuidados".' },
  { q: '¿Cómo hago un pedido?', a: 'Agrega tus prendas al carrito, elige envío o retiro en tienda y envía tu pedido por WhatsApp. Te confirmaremos la disponibilidad y el total, y te enviaremos los datos para tu pago.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'En línea, por depósito o transferencia. En entregas dentro de Santa Cruz del Quiché también puedes pagar contra entrega en efectivo, por transferencia, con tarjeta Visa o Mastercard, o con Apple Pay, Google Pay o PayPal. En tienda física aceptamos tarjeta, Apple Pay, Google Pay y PayPal.' },
  { q: '¿Por qué los precios del sitio son menores a los de etiqueta?', a: 'Los precios publicados ya incluyen el descuento por pago en efectivo o transferencia. Si pagas con tarjeta, Apple Pay, Google Pay o PayPal, se aplica el precio de etiqueta.' },
  { q: '¿Hacen envíos a todo el país?', a: 'Sí, enviamos a todo el territorio de Guatemala con Forza o Guatex.' },
  { q: '¿Cuánto cuesta el envío?', a: 'El costo estimado es de Q35 a Q50, según el destino y la cantidad de prendas. En compras mayores a Q1,250 el envío es gratis, y en Santa Cruz del Quiché es gratis hasta la puerta de tu casa.' },
  { q: '¿Cuánto tarda mi pedido?', a: 'Despachamos el mismo día hábil tras confirmar tu pago, y el tiempo estimado de entrega es de 1 a 3 días hábiles. Los pedidos confirmados después del mediodía del sábado, o en domingo, se despachan el lunes.' },
  { q: '¿Cómo sé dónde está mi pedido?', a: <>Te enviaremos tu número de guía. Con él puedes consultar el estado de tu envío en <L href="/estado-del-pedido/">Estado del pedido</L>.</> },
  { q: '¿Cómo sé qué talla elegir?', a: <>Escríbenos por WhatsApp y te enviaremos las medidas exactas de la prenda que te interesa. También puedes consultar nuestra <L href="/qa/#guia-de-tallas">Guía de tallas</L>, al final de esta página.</> },
  { q: '¿Puedo cambiar una prenda?', a: <>Los cambios se realizan únicamente en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado. No realizamos devoluciones de dinero. Consulta las políticas completas en <L href="/devoluciones-y-cambios/">Devoluciones y cambios</L>.</> },
  { q: '¿Puedo recoger mi pedido en tienda?', a: <>Sí. Reserva tu pedido en línea y tienes 5 días para recogerlo. Consulta los detalles en <L href="/retiro-en-tienda/">Retiro en tienda</L>.</> },
  { q: '¿Cómo puedo comunicarme con ustedes?', a: <>Escríbenos por WhatsApp al <Ext href={WA_LINK}>{BRAND.whatsappDisplay}</Ext>. Si necesitas información de inmediato, llámanos al <a href={TEL_INMEDIATO} className="text-midnight underline underline-offset-4 decoration-gold/60">{BRAND.phoneInmediato}</a>.</> },
]

export const PAGINAS: Pagina[] = [
  {
    slug: 'qa', titulo: 'Preguntas frecuentes', grupo: 'Soporte',
    descripcion: 'Preguntas frecuentes de Boutique La Torre: originalidad, pagos, envíos a toda Guatemala, cambios, retiro en tienda y guía de tallas.',
    cuerpo: null, // se arma en la página (acordeón + guía de tallas)
  },
  {
    slug: 'contacto', titulo: 'Contacto', grupo: 'Soporte',
    descripcion: 'Contacta a Boutique La Torre por WhatsApp o correo. Tienda en 5ª Calle 3-53, Zona 1, Santa Cruz del Quiché.',
    intro: '¿Tienes dudas sobre un producto, un pedido o tu compra? Escríbenos por WhatsApp.',
    cuerpo: (
      <div className="grid sm:grid-cols-2 gap-4">
        <Tarjeta label="WhatsApp" href={WA_LINK}>{BRAND.whatsappDisplay}</Tarjeta>
        <Tarjeta label="Correo electrónico" href={`mailto:${BRAND.email}`}>{BRAND.email}</Tarjeta>
        <Tarjeta label="Tienda física">{BRAND.addressFull}</Tarjeta>
        <Tarjeta label="Horario">{HORARIO}</Tarjeta>
      </div>
    ),
  },
  {
    slug: 'atencion-inmediata', titulo: 'Atención inmediata', grupo: 'Soporte',
    descripcion: '¿Necesitas información de inmediato? Llama a Boutique La Torre al +502 4249 2242.',
    intro: '¿Necesitas información de inmediato? Llámanos.',
    cuerpo: (
      <a href={TEL_INMEDIATO} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-midnight text-cream text-sm uppercase tracking-[0.18em] hover:bg-gold hover:text-midnight transition-colors">
        Llamar al {BRAND.phoneInmediato}
      </a>
    ),
  },
  {
    slug: 'estado-del-pedido', titulo: 'Estado del pedido', grupo: 'Soporte',
    descripcion: 'Rastrea tu pedido de Boutique La Torre con tu número de guía en Forza o Guatex.',
    intro: 'Consulta el estado de tu envío con tu número de guía, en el sitio de la paquetería con la que viaja tu pedido.',
    cuerpo: (
      <div className="grid sm:grid-cols-2 gap-4">
        <a href={BRAND.shipping.forza} target="_blank" rel="noopener noreferrer" data-track="forza" className="group flex items-center justify-between p-6 rounded-lg bg-white border border-midnight/10 hover:border-gold transition-colors">
          <span className="font-serif text-lg text-midnight">Rastrear con Forza</span><span className="text-gold transition-transform group-hover:translate-x-1">→</span>
        </a>
        <a href={BRAND.shipping.guatex} target="_blank" rel="noopener noreferrer" data-track="guatex" className="group flex items-center justify-between p-6 rounded-lg bg-white border border-midnight/10 hover:border-gold transition-colors">
          <span className="font-serif text-lg text-midnight">Rastrear con Guatex</span><span className="text-gold transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    ),
  },
  {
    slug: 'colaboraciones', titulo: 'Colaboraciones', grupo: 'Soporte',
    descripcion: 'Propuestas de colaboración para creadores de contenido, marcas y emprendedores con Boutique La Torre.',
    intro: 'En La Torre estamos abiertos a escuchar propuestas de creadores de contenido, marcas y emprendedores interesados en trabajar con nosotros.',
    cuerpo: (
      <>
        <p className="text-[15px] leading-relaxed text-foreground/80 mb-6">Si tienes una idea, envíanos tu propuesta indicando quién eres, qué tienes en mente y cómo podríamos colaborar. Si tienes redes sociales o un portafolio, incluye los enlaces.</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Tarjeta label="WhatsApp" href={WA_COLAB}>{BRAND.phoneInmediato}</Tarjeta>
          <Tarjeta label="Correo electrónico" href={`mailto:${BRAND.email}`}>{BRAND.email}</Tarjeta>
        </div>
        <p className="text-sm italic text-muted-foreground">Revisamos cada propuesta y nos comunicaremos contigo en caso de ser de nuestro interés.</p>
      </>
    ),
  },
  {
    slug: 'proceso-de-compra', titulo: 'Proceso de compra', grupo: 'Términos y políticas',
    descripcion: 'Cómo comprar en Boutique La Torre: elige tus prendas, envía tu pedido por WhatsApp, paga por depósito o transferencia y recíbelo.',
    cuerpo: (
      <Pasos items={[
        { t: 'Elige tus prendas.', d: 'Selecciona la talla y el color, y agrégalas a tu carrito.' },
        { t: 'Envía tu pedido por WhatsApp.', d: 'Desde el carrito, elige si quieres envío o retiro en tienda, indica tu destino y envía tu pedido. El mensaje se genera automáticamente con tus prendas.' },
        { t: 'Confirma tu pedido.', d: 'Te responderemos por WhatsApp para confirmar la disponibilidad y el total final, incluyendo el costo de envío si aplica.' },
        { t: 'Realiza tu pago.', d: 'Te enviaremos los datos para pagar por depósito o transferencia. Una vez realizado, envíanos la foto de tu comprobante.' },
        { t: 'Recibe tu pedido.', d: 'Despachamos el mismo día hábil y te enviamos tu número de guía. Si elegiste retiro en tienda, te enviaremos tu código de retiro.' },
      ]} />
    ),
  },
  {
    slug: 'entrega-o-servicio', titulo: 'Entrega o servicio', grupo: 'Términos y políticas',
    descripcion: 'Envíos a toda Guatemala con Forza o Guatex en 1 a 3 días hábiles. Envío gratis en compras mayores a Q1,250.',
    cuerpo: (
      <>
        <Bloque t="Cobertura"><p>Realizamos envíos a todo el territorio de Guatemala.</p></Bloque>
        <Bloque t="Paqueterías"><p>Enviamos con Forza o Guatex, según el destino y la disponibilidad.</p></Bloque>
        <Bloque t="Tiempo de despacho"><p>Una vez confirmado tu pago, despachamos tu pedido el mismo día hábil. Las paqueterías cierran los sábados al mediodía y no operan los domingos, por lo que los pedidos confirmados después de esa hora, o en domingo, se despachan el lunes.</p></Bloque>
        <Bloque t="Tiempo de entrega"><p>El tiempo estimado de entrega es de 1 a 3 días hábiles a partir del despacho. Este plazo puede variar según la paquetería y el destino.</p></Bloque>
        <Bloque t="Costo del envío"><p>El costo estimado es de Q35 a Q50, y varía según el destino y la cantidad de prendas. Te confirmaremos el monto exacto por WhatsApp antes de realizar tu pago.</p></Bloque>
        <Bloque t="Envío gratis"><p>En compras mayores a Q1,250, el envío es gratis.</p></Bloque>
        <Bloque t="Entrega en Santa Cruz del Quiché">
          <p>En el casco urbano, el envío es gratis hasta la puerta de tu casa. Coordinamos contigo por WhatsApp la hora de entrega, y puedes pagar contra entrega en efectivo, por transferencia, con tarjeta Visa o Mastercard, o con Apple Pay, Google Pay o PayPal.</p>
          <p>Los precios publicados corresponden al pago en efectivo o transferencia. Si deseas pagar con tarjeta, Apple Pay, Google Pay o PayPal, el valor de las prendas será el precio de etiqueta, y te confirmaremos el total antes de la entrega.</p>
        </Bloque>
        <Bloque t="Seguimiento"><p>Te enviaremos tu número de guía y la paquetería con la que viaja tu pedido. Con ese número puedes consultar el estado de tu envío en la sección <L href="/estado-del-pedido/">Estado del pedido</L>.</p></Bloque>
      </>
    ),
  },
  {
    slug: 'retiro-en-tienda', titulo: 'Retiro en tienda', grupo: 'Términos y políticas',
    descripcion: 'Compra en línea y recoge tu pedido en Boutique La Torre, Santa Cruz del Quiché, sin costo de envío.',
    intro: 'Puedes comprar en línea y recoger tu pedido en nuestra tienda, sin costo de envío.',
    cuerpo: (
      <>
        <Bloque t="Cómo funciona">
          <Pasos items={[
            { t: 'Realiza tu pedido', d: 'Elige "Retiro en tienda" en el carrito.' },
            { t: 'Reserva tu pedido', d: 'Paga por depósito o transferencia el total, o el 50% del valor. El otro 50% lo pagas al recoger tu pedido en tienda.' },
            { t: 'Recibe tu código', d: 'Te confirmaremos por WhatsApp y te enviaremos tu código de retiro cuando tu pedido esté listo.' },
          ]} />
        </Bloque>
        <Bloque t="Plazo"><p>Tienes 5 días calendario, contados desde la confirmación de tu pago, para recoger tu pedido. Si no lo recoges en ese plazo, te reembolsamos todo el dinero que hayas depositado.</p></Bloque>
        <Bloque t="Al recogerlo"><p>Presenta tu código de retiro. Otra persona puede recogerlo por ti, siempre que lo presente.</p></Bloque>
        <Bloque t="Dirección y horario"><p>{BRAND.addressFull}.<br />{HORARIO}</p></Bloque>
      </>
    ),
  },
  {
    slug: 'devoluciones-y-cambios', titulo: 'Devoluciones y cambios', grupo: 'Términos y políticas',
    descripcion: 'Política de cambios de Boutique La Torre: en tienda física, dentro de 15 días y con la prenda en perfecto estado.',
    intro: 'En resumen: los cambios se realizan únicamente en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado. No realizamos devoluciones de dinero. Si recibes una talla distinta a la solicitada, lo corregimos sin costo para ti.',
    cuerpo: (
      <>
        <Bloque t="1. Plazo y lugar"><p>Dispones de 15 días calendario, contados desde la entrega de tu pedido, para solicitar un cambio. Los cambios se realizan únicamente en nuestra tienda física.</p></Bloque>
        <Bloque t="2. Condiciones de la prenda"><p>La prenda debe encontrarse en perfecto estado, con todas sus etiquetas y sin daños ocasionados después de la compra, como manchas, olores, desgaste o señales de lavado. Es obligatorio presentar el comprobante de compra.</p></Bloque>
        <Bloque t="3. Modalidad de cambio"><p>El cambio se realiza en tienda física por una prenda de igual o mayor valor, abonando la diferencia si corresponde. Las compras con envío también deben presentarse en la tienda para su cambio.</p></Bloque>
        <Bloque t="4. Reembolsos"><p>No se realizan reembolsos en efectivo ni reversiones a tarjetas. El cambio se efectúa únicamente por otra prenda.</p></Bloque>
        <Bloque t="5. Talla equivocada en el envío"><p>Si recibes una talla distinta a la que solicitaste, debes reportarlo dentro de las 48 horas posteriores a la entrega, adjuntando fotografías de la prenda y de su etiqueta. En ese caso, nosotros asumimos la corrección y te enviamos la talla correcta sin costo adicional. Si la talla correcta no se encuentra disponible, te ofrecemos el cambio por otra prenda de igual valor. Pasado ese plazo, aplican las condiciones generales de cambio descritas en esta página.</p></Bloque>
        <Bloque t="6. Inspección y rechazo"><p>Cada prenda se inspecciona físicamente al momento del cambio. Si presenta señales de uso, lavado, manchas, olores o carece de sus etiquetas, el cambio se rechazará de inmediato.</p></Bloque>
      </>
    ),
  },
  {
    slug: 'terminos-y-privacidad', titulo: 'Términos y privacidad', grupo: 'Términos y políticas',
    descripcion: 'Términos de uso y política de privacidad de Boutique La Torre.',
    cuerpo: (
      <>
        <Bloque t="1. Ámbito"><p>Estos términos regulan el uso de este sitio y las compras realizadas a través de él. El sitio es operado por Boutique La Torre, en Guatemala. Al realizar un pedido, aceptas estos términos.</p></Bloque>
        <Bloque t="2. Proceso de compra"><p>Tu pedido se concreta cuando confirmamos por WhatsApp la disponibilidad y el total, y recibimos el comprobante de tu pago.</p></Bloque>
        <Bloque t="3. Precios y disponibilidad"><p>Los precios están expresados en quetzales y corresponden al pago en efectivo o transferencia. En tienda física y en entrega local, el pago con tarjeta, Apple Pay, Google Pay o PayPal se rige por el precio de etiqueta. Todos los pedidos están sujetos a disponibilidad. Podemos cancelar un pedido por un error evidente de precio o descripción, o por falta de existencias, y te reembolsamos lo depositado.</p></Bloque>
        <Bloque t="4. Pagos"><p>En línea, el pago se realiza por depósito o transferencia. Los datos de pago te los enviamos por WhatsApp al confirmar tu pedido. Tu pedido se despacha una vez confirmado el pago.</p></Bloque>
        <Bloque t="5. Envíos y entrega"><p>Los envíos se realizan con Forza o Guatex, según las condiciones descritas en la sección <L href="/entrega-o-servicio/">Entrega o servicio</L>.</p></Bloque>
        <Bloque t="6. Cambios y devoluciones"><p>Los cambios se realizan únicamente en nuestra tienda física, dentro de 15 días y con la prenda en perfecto estado. No realizamos devoluciones de dinero. El detalle completo está en <L href="/devoluciones-y-cambios/">Devoluciones y cambios</L>.</p></Bloque>
        <Bloque t="7. Retiro en tienda"><p>Los pedidos reservados para retiro se conservan por 5 días calendario desde la confirmación del pago. Pasado ese plazo, reembolsamos el dinero depositado.</p></Bloque>
        <Bloque t="8. Privacidad de tus datos"><p>Para procesar y enviar tu pedido solicitamos tu nombre, tu destino, tu teléfono y el comprobante de pago. Usamos estos datos únicamente para gestionar tu compra y atenderte. No los compartimos con terceros, salvo la paquetería que realiza tu envío. Para consultas sobre tus datos, escríbenos a <a href={`mailto:${BRAND.email}`} className="text-midnight underline underline-offset-4 decoration-gold/60">{BRAND.email}</a>.</p></Bloque>
        <Bloque t="9. Cookies y analítica"><p>Este sitio utiliza cookies y herramientas de analítica, como Google Analytics, para conocer cómo se usa y mejorarlo. Estas herramientas recopilan información general de navegación, no tu nombre ni tus datos de contacto. Si no deseas que se recopile, puedes desactivar las cookies en la configuración de tu navegador.</p></Bloque>
        <Bloque t="10. Marcas"><p>Las marcas, nombres y logotipos que aparecen en este sitio pertenecen a sus respectivos dueños.</p></Bloque>
      </>
    ),
  },
]

export const paginaPorSlug = (slug: string) => PAGINAS.find(p => p.slug === slug)
export const ENLACES_PIE = {
  soporte: [['qa', 'Q&A'], ['contacto', 'Contacto'], ['atencion-inmediata', 'Atención inmediata'], ['estado-del-pedido', 'Estado del pedido'], ['colaboraciones', 'Colaboraciones']] as const,
  terminos: [['proceso-de-compra', 'Proceso de compra'], ['entrega-o-servicio', 'Entrega o servicio'], ['retiro-en-tienda', 'Retiro en tienda'], ['devoluciones-y-cambios', 'Devoluciones y cambios'], ['terminos-y-privacidad', 'Términos y privacidad']] as const,
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGINAS, paginaPorSlug, PREGUNTAS } from '@/lib/boutique/paginas'
import { SITE_URL, WA_LINK } from '@/lib/boutique/brand'
import { SiteShell } from '@/components/boutique/site-shell'
import { Picture } from '@/components/boutique/picture'

export const dynamicParams = false
export function generateStaticParams() {
  return PAGINAS.map(p => ({ pagina: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ pagina: string }> }): Promise<Metadata> {
  const p = paginaPorSlug((await params).pagina)
  if (!p) return {}
  const url = `${SITE_URL}/${p.slug}/`
  return {
    title: p.titulo,
    description: p.descripcion,
    alternates: { canonical: url },
    openGraph: { title: `${p.titulo} | Boutique La Torre`, description: p.descripcion, url, type: 'website', images: ['/og.jpg'] },
  }
}

export default async function PaginaInfo({ params }: { params: Promise<{ pagina: string }> }) {
  const p = paginaPorSlug((await params).pagina)
  if (!p) notFound()
  const esQA = p.slug === 'qa'
  const faqJsonLd = esQA ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: PREGUNTAS.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: typeof x.a === 'string' ? x.a : '' } })).filter(x => x.acceptedAnswer.text),
  } : null

  return (
    <SiteShell>
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <article className="max-w-3xl mx-auto px-6 pt-10 md:pt-16 pb-20 md:pb-28 page-enter">
        <nav aria-label="Ruta" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-8">
          <Link href="/" className="hover:text-gold transition-colors">Inicio</Link><span className="mx-2 text-gold">/</span><span>{p.grupo}</span>
        </nav>
        <header className="mb-10 md:mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-midnight leading-tight">{p.titulo}</h1>
          <div className="h-px w-16 bg-gold mt-6" />
          {p.intro && <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/80">{p.intro}</p>}
        </header>

        {esQA ? (
          <>
            <div className="divide-y divide-midnight/10 border-y border-midnight/10">
              {PREGUNTAS.map((x, i) => (
                <details key={i} className="group py-1">
                  <summary className="flex items-center justify-between gap-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-lg text-midnight">{x.q}</span>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full border border-midnight/15 flex items-center justify-center text-gold transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="pb-5 pr-12 text-[15px] leading-relaxed text-foreground/80">{x.a}</div>
                </details>
              ))}
            </div>

            <section id="guia-de-tallas" className="scroll-mt-28 mt-16">
              <h2 className="font-serif text-3xl text-midnight">Guía de tallas</h2>
              <div className="h-px w-12 bg-gold mt-4 mb-6" />
              <p className="text-[15px] leading-relaxed text-foreground/80 mb-8">Aunque las prendas manejan un tallaje estándar, cada marca maneja sus propias medidas, por lo que una misma talla puede variar entre prendas. Por eso, antes de comprar, puedes pedirnos las medidas exactas de cualquier prenda.</p>
              <div className="rounded-lg bg-white border border-midnight/10 p-6 mb-8">
                <p className="font-serif text-lg text-midnight mb-1">Pide las medidas de tu prenda</p>
                <p className="text-[15px] text-foreground/80">Escríbenos por <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-midnight underline underline-offset-4 decoration-gold/60 hover:text-gold">WhatsApp</a>, indícanos el nombre de la prenda y te enviaremos sus medidas reales.</p>
              </div>
              <p className="font-serif text-lg text-midnight mb-3">¿Prefieres compararla con una prenda tuya?</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-[15px] text-foreground/80 mb-8">
                <li>Elige una prenda que te quede bien, del mismo tipo que la que quieres comprar.</li>
                <li>Extiéndela sobre una superficie plana, sin arrugas ni estiramientos.</li>
                <li>Mide en centímetros siguiendo los puntos de la imagen.</li>
              </ol>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <Picture src="/images/marca/Gemini_Generated_Image_hb8eojhb8eojhb8e.jpg" alt="Cómo medir una prenda superior: pecho, largo y manga" className="w-full rounded-lg" sizes="(min-width: 640px) 360px, 92vw" />
                <Picture src="/images/marca/Gemini_Generated_Image_ojbj02ojbj02ojbj.jpg" alt="Cómo medir un pantalón: cintura, entrepierna y largo total" className="w-full rounded-lg" sizes="(min-width: 640px) 360px, 92vw" />
              </div>
              <div className="overflow-x-auto rounded-lg border border-midnight/10 mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-midnight text-cream"><tr><th className="px-4 py-3 text-left font-medium">Prenda</th><th className="px-4 py-3 text-left font-medium">Medidas</th></tr></thead>
                  <tbody className="bg-white">
                    <tr className="border-t border-midnight/10"><td className="px-4 py-3 text-midnight align-top">Camisas, playeras, suéteres y chumpas</td><td className="px-4 py-3 text-foreground/80">Pecho (de axila a axila), largo (del hombro a la orilla inferior) y manga (costura donde se une el hombro con la manga a borde final del puño)</td></tr>
                    <tr className="border-t border-midnight/10"><td className="px-4 py-3 text-midnight align-top">Pantalones</td><td className="px-4 py-3 text-foreground/80">Cintura (de lado a lado, con el botón cerrado), largo de entrepierna y largo total</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[15px] leading-relaxed text-foreground/80 mb-3">Todas las medidas se toman con la prenda extendida, tanto las tuyas como las que nosotros te enviamos, así que puedes compararlas directamente. Una diferencia de 1 a 2 cm es normal.</p>
              <p className="text-[15px] leading-relaxed text-foreground/80">La forma de medir es la misma para todas las prendas, sin importar si son de hombre, mujer, juvenil o infantil. La ropa interior no se mide con este método.</p>
            </section>
          </>
        ) : p.cuerpo}
      </article>
    </SiteShell>
  )
}

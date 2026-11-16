import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import { findProductBySlug, getRelated } from '@/lib/boutique/catalog'
import { ProductDetailClient } from '@/components/boutique/product-detail-client'
import { ogImageUrl } from '@/lib/boutique/images'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = findProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }
  const description = product.descripcion.slice(0, 160) || `${product.marca} · ${product.nombre}`
  const url = `/producto/${product.slug}/`
  return {
    title: `${product.nombre} · ${product.marca}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.nombre} · ${product.marca} | Boutique La Torre`,
      description,
      url,
      images: product.imagenes.slice(0, 1).map(i => ({ url: ogImageUrl(i), width: 800, height: 800, alt: `${product.marca} · ${product.nombre}` })),
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = findProductBySlug(slug)
  if (!product) notFound()
  const related = getRelated(product, 8)
  return <ProductDetailClient product={product} related={related} />
}

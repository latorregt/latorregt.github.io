import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import { findProductBySlug, getRelated } from '@/lib/boutique/catalog'
import { ProductDetailClient } from '@/components/boutique/product-detail-client'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = findProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: product.nombre,
    description: product.descripcion.slice(0, 160) || `${product.marca} · ${product.nombre}`,
    openGraph: {
      title: `${product.nombre} | Boutique La Torre`,
      description: product.descripcion.slice(0, 160),
      images: product.imagenes.map(i => ({ url: i, width: 1200, height: 1200, alt: product.nombre })),
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

#!/usr/bin/env node
/**
 * Genera public/sitemap.xml y public/robots.txt con las páginas reales del sitio:
 * inicio + una URL por producto. Correr después de regenerar src/data/products.ts.
 * La dirección del sitio se toma de SITE_URL en src/lib/boutique/brand.ts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const brand = fs.readFileSync(path.join(ROOT, 'src/lib/boutique/brand.ts'), 'utf8')
const SITE = brand.match(/SITE_URL\s*=\s*"([^"]+)"/)[1].replace(/\/$/, '')
const data = fs.readFileSync(path.join(ROOT, 'src/data/products.ts'), 'utf8')

const products = [...data.matchAll(/"slug":\s*"([^"]+)"[\s\S]*?"fecha":\s*(null|"([^"]*)")/g)].map(m => ({ slug: m[1], fecha: m[3] || null }))
if (!products.length) { console.error('No se encontraron productos en src/data/products.ts'); process.exit(1) }

const today = new Date().toISOString().slice(0, 10)
const urls = [
  { loc: `${SITE}/`, lastmod: today, priority: '1.0', changefreq: 'weekly' },
  ...products.map(p => ({ loc: `${SITE}/producto/${p.slug}/`, lastmod: p.fecha || today, priority: '0.8', changefreq: 'monthly' })),
]
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml)
fs.writeFileSync(path.join(ROOT, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`sitemap.xml: ${urls.length} URLs (${products.length} productos) · ${SITE}`)

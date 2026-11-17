#!/usr/bin/env node
/**
 * Optimiza las imágenes del sitio.
 *
 * Lee los originales de `originals/images/**` (carpeta local, NO se sube a GitHub)
 * y escribe las versiones optimizadas en `public/images/**`:
 *
 *   originals/images/productos/Camisa (1).png
 *     -> public/images/productos/Camisa__1__png-200.webp / -200.avif
 *     -> public/images/productos/Camisa__1__png-600.webp / -600.avif
 *     -> public/images/productos/Camisa__1__png-1200.webp / -1200.avif
 *
 * El nombre de salida lo calcula `variantName()`; el sitio usa la misma regla en
 * `src/lib/boutique/images.ts`, así que los datos (products.ts) siguen guardando
 * la ruta original (`/images/productos/Camisa (1).png`) y no hay que tocarlos.
 *
 * Además genera, para la primera imagen de cada producto, un JPG `-og.jpg`
 * (vista previa al compartir el enlace en WhatsApp / Facebook) y `public/og.jpg`
 * para la página de inicio.
 *
 * Uso:  node scripts/optimize-images.mjs            (solo procesa lo que falta)
 *       node scripts/optimize-images.mjs --force    (regenera todo)
 *       node scripts/optimize-images.mjs --force --only=productos   (solo una carpeta)
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'originals', 'images')
const OUT = path.join(ROOT, 'public', 'images')
const FORCE = process.argv.includes('--force')

export const WIDTHS = [200, 600, 1200]
const EXTRA_WIDTHS = { marca: [1920] } // el hero ocupa toda la pantalla
const WEBP = { quality: 78, effort: 5 }
const AVIF = { quality: 52, effort: 3 }
// Fotos de prenda: máxima calidad (decisión nov 2026). AVIF 90 pesa lo mismo que WebP 95 y se ve igual o mejor.
const HQ = { marca: { webp: { quality: 95, effort: 4 }, avif: { quality: 90, effort: 3 } }, productos: { webp: { quality: 95, effort: 4 }, avif: { quality: 90, effort: 3 } }, categorias: { webp: { quality: 95, effort: 4 }, avif: { quality: 90, effort: 3 } } }
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7)
const OG_HOME = 'marca/Boutique_La_Torre_iluminada_de_noche.png'

/** Misma regla que src/lib/boutique/images.ts */
export function variantBase(file) {
  const ext = path.extname(file)
  const base = file.slice(0, -ext.length).replace(/[^A-Za-z0-9._-]/g, '_')
  return `${base}_${ext.slice(1).toLowerCase()}`
}

function walk(dir, rel = '') {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = path.posix.join(rel, e.name)
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name), r))
    else if (/\.(png|jpe?g|webp|avif|tiff?)$/i.test(e.name)) out.push(r)
  }
  return out
}

function firstProductImages() {
  const file = path.join(ROOT, 'src', 'data', 'products.ts')
  if (!fs.existsSync(file)) return new Set()
  const txt = fs.readFileSync(file, 'utf8')
  const set = new Set()
  for (const m of txt.matchAll(/"imagenes":\s*\[\s*"\/images\/([^"]+)"/g)) set.add(m[1])
  return set
}

async function pool(items, n, fn) {
  let i = 0
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const it = items[i++]; await fn(it) }
  }))
}

if (!fs.existsSync(SRC)) {
  console.error(`No existe ${SRC}. Coloca ahí las imágenes originales (misma estructura de carpetas que public/images).`)
  process.exit(1)
}

const files = walk(SRC).filter(f => !ONLY || f.split('/')[0] === ONLY)
const seen = new Map()
for (const f of files) {
  const key = path.posix.join(path.posix.dirname(f), variantBase(path.posix.basename(f)))
  if (seen.has(key)) { console.error(`Colisión de nombres: "${f}" y "${seen.get(key)}"`); process.exit(1) }
  seen.set(key, f)
}

const ogSet = firstProductImages()
let made = 0, skipped = 0, failed = 0
sharp.concurrency(1)

await pool(files, Math.max(2, os.cpus().length), async (rel) => {
  const src = path.join(SRC, rel)
  const dir = path.posix.dirname(rel)
  const outDir = path.join(OUT, dir)
  const base = variantBase(path.posix.basename(rel))
  const top = dir.split('/')[0]
  const widths = [...WIDTHS, ...(EXTRA_WIDTHS[top] || [])]
  const webpOpts = HQ[top]?.webp || WEBP
  const avifOpts = HQ[top]?.avif || AVIF
  fs.mkdirSync(outDir, { recursive: true })
  const srcTime = fs.statSync(src).mtimeMs
  const need = (p) => FORCE || !fs.existsSync(p) || fs.statSync(p).mtimeMs < srcTime
  try {
    for (const w of widths) {
      const webp = path.join(outDir, `${base}-${w}.webp`)
      const avif = path.join(outDir, `${base}-${w}.avif`)
      if (!need(webp) && !need(avif)) { skipped++; continue }
      const pipe = sharp(src, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true })
      if (need(webp)) await pipe.clone().webp(webpOpts).toFile(webp)
      if (need(avif)) await pipe.clone().avif(avifOpts).toFile(avif)
      made++
    }
    if (ogSet.has(rel)) {
      const og = path.join(outDir, `${base}-og.jpg`)
      if (need(og)) {
        await sharp(src, { failOn: 'none' }).rotate()
          .resize({ width: 800, height: 800, fit: 'contain', background: '#ffffff' })
          .flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }).toFile(og)
        made++
      }
    }
  } catch (e) { failed++; console.error(`ERROR ${rel}: ${e.message}`) }
})

const ogHomeSrc = path.join(SRC, OG_HOME)
if (fs.existsSync(ogHomeSrc)) {
  await sharp(ogHomeSrc).resize({ width: 1200, height: 630, fit: 'cover', position: 'top' })
    .flatten({ background: '#0a0c2e' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(ROOT, 'public', 'og.jpg'))
}

console.log(`Originales: ${files.length} · variantes generadas: ${made} · ya existentes: ${skipped} · errores: ${failed}`)
if (failed) process.exit(1)

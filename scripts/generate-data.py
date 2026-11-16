#!/usr/bin/env python3
"""Generate TypeScript data modules from CATALOGO CSV + RESEÑAS CSV."""
import csv, json, re, urllib.parse
from pathlib import Path

import sys
ROOT = Path(__file__).resolve().parent.parent
# Uso: python3 scripts/generate-data.py <CATALOGO.csv> <RESEÑAS.csv>
if len(sys.argv) < 3:
    sys.exit('Uso: python3 scripts/generate-data.py <CATALOGO.csv> <RESEÑAS.csv>')
CATALOG = sys.argv[1]
REVIEWS = sys.argv[2]
OUT_DIR = ROOT / 'src' / 'data'

def slugify(s):
    if not s: return ''
    s = str(s).lower()
    for old, new in [('àáâãäå','a'),('èéêë','e'),('ìíîï','i'),('òóôõö','o'),('ùúûü','u'),('ñ','n')]:
        for c in old: s = s.replace(c, new)
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:80]

def parse_tallas(s):
    if not s: return []
    return [x.strip() for x in re.split(r'[,;]', s) if x.strip()]

def parse_images(row):
    imgs = []
    for i in range(1, 6):
        v = (row.get(f'Imagen {i}') or '').strip()
        if v:
            decoded = urllib.parse.unquote(v)
            imgs.append('/images/productos/' + decoded)
    return imgs

COLOR_MAP = {
    'blanco': '#FFFFFF', 'negro / gris': '#2C2C2C', 'azul / celeste': '#1B3A6B',
    'rojo / corinto': '#7B1E2C', 'amarillo': '#D4A017', 'verde': '#3D5C3A',
    'naranja': '#C25E2D', 'morado': '#5B2A6B', 'café': '#5C3317',
    'beige / khaki': '#B89B6E', 'rosa': '#D98A95', 'multicolor / estampado': '#888888'
}

def color_to_hex(color):
    if not color: return '#666666'
    return COLOR_MAP.get(color.lower().strip(), '#666666')

MONTHS = {'enero':1,'febrero':2,'marzo':3,'abril':4,'mayo':5,'junio':6,
          'julio':7,'agosto':8,'septiembre':9,'octubre':10,'noviembre':11,'diciembre':12}

def parse_date(s):
    if not s: return None
    m = re.match(r'(\d+)\s+de\s+(\w+)\s+de\s+(\d+)', s, re.IGNORECASE)
    if m:
        day, mon, year = int(m.group(1)), MONTHS.get(m.group(2).lower()), int(m.group(3))
        if mon: return f'{year:04d}-{mon:02d}-{day:02d}'
    return None

with open(CATALOG, encoding='utf-8-sig') as f:
    rows = list(csv.DictReader(f))

products = []
skipped = 0
for idx, row in enumerate(rows):
    nombre = (row.get('Nombre') or '').strip()
    img1 = (row.get('Imagen 1') or '').strip()
    color = (row.get('Color') or '').strip()
    precio = (row.get('Precio en GTQ') or '').strip()
    if not nombre or not img1 or not color or not precio:
        skipped += 1
        continue
    pid = idx + 1
    slug = slugify(nombre) + '-' + str(pid)
    tarjeta = (row.get('Tarjeta GTQ') or '').strip()
    try: precio_num = float(precio)
    except ValueError: precio_num = 0.0
    try: tarjeta_num = float(tarjeta) if tarjeta else precio_num
    except ValueError: tarjeta_num = precio_num
    is_sale = (row.get('SALE') or '').strip().lower() == 'yes'
    is_pronto = (row.get('Pronto volverá') or '').strip().lower() == 'yes'
    discount = round((1 - precio_num / tarjeta_num) * 100) if (is_sale and tarjeta_num > precio_num) else 0
    products.append({
        'id': pid, 'slug': slug, 'nombre': nombre,
        'categoria': (row.get('Categoría') or '').strip(),
        'tipo': (row.get('Tipo de producto') or '').strip(),
        'subtipo': (row.get('Subtipo') or '').strip(),
        'estilo': (row.get('Estilo de Pantalon') or '').strip(),
        'marca': (row.get('Marca') or '').strip(),
        'color': color, 'colorHex': color_to_hex(color),
        'tallas': parse_tallas(row.get('Tallas')),
        'imagenes': parse_images(row),
        'precio': precio_num,
        'tarjeta': tarjeta_num if tarjeta_num != precio_num else None,
        'descripcion': (row.get('Descripción') or '').strip(),
        'fecha': parse_date((row.get('Fecha de ingreso') or '').strip()),
        'sale': is_sale, 'prontoVolvera': is_pronto,
        'descuento': discount if discount > 0 else None
    })

products.sort(key=lambda p: (
    1 if p['prontoVolvera'] else 0,
    1 if p['sale'] else 0,
    -(int(p['fecha'][:10].replace('-', '')) if p['fecha'] else 0)
))

reviews = []
with open(REVIEWS, encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        if (row.get('Mostrar en el sitio') or '').strip().lower() == 'yes':
            comentario = (row.get('Comentario') or '').strip()
            nombre = (row.get('Nombre') or '').strip()
            if comentario and nombre:
                try: est = int(row.get('Estrellas') or '5')
                except ValueError: est = 5
                reviews.append({
                    'nombre': nombre, 'comentario': comentario,
                    'estrellas': est, 'fecha': (row.get('Fecha') or '').strip()
                })

from collections import defaultdict
cats = sorted(set(p['categoria'] for p in products))
tipos_by_cat = {c: sorted(set(p['tipo'] for p in products if p['categoria'] == c)) for c in cats}
subtipos_by_tipo = {}
for p in products:
    if p['tipo'] and p['subtipo']:
        subtipos_by_tipo.setdefault(p['tipo'], set()).add(p['subtipo'])
subtipos_by_tipo = {k: sorted(v) for k, v in subtipos_by_tipo.items()}
marcas_by_cat = {c: sorted(set(p['marca'] for p in products if p['categoria'] == c)) for c in cats}
colores_all = sorted(set(p['color'] for p in products))
tallas_by_context = {}
for p in products:
    key = f"{p['categoria']}|{p['tipo']}"
    tallas_by_context.setdefault(key, set()).update(p['tallas'])
tallas_by_context = {k: sorted(v, key=lambda x: (float(x) if x.replace('.','',1).isdigit() else 999, x)) for k, v in tallas_by_context.items()}

products_ts = f'''/* AUTO-GENERATED */
export interface Product {{
  id: number; slug: string; nombre: string; categoria: string; tipo: string; subtipo: string; estilo: string
  marca: string; color: string; colorHex: string; tallas: string[]; imagenes: string[]
  precio: number; tarjeta: number | null; descripcion: string; fecha: string | null
  sale: boolean; prontoVolvera: boolean; descuento: number | null
}}
export const products: Product[] = {json.dumps(products, ensure_ascii=False, indent=2)}
'''
(OUT_DIR / 'products.ts').write_text(products_ts, encoding='utf-8')

reviews_ts = f'''export interface Review {{ nombre: string; comentario: string; estrellas: number; fecha: string }}
export const reviews: Review[] = {json.dumps(reviews, ensure_ascii=False, indent=2)}
'''
(OUT_DIR / 'reviews.ts').write_text(reviews_ts, encoding='utf-8')

filters_ts = f'''export const allCategorias = {json.dumps(cats, ensure_ascii=False)}
export const tiposByCategoria: Record<string, string[]> = {json.dumps(tipos_by_cat, ensure_ascii=False, indent=2)}
export const subtiposByTipo: Record<string, string[]> = {json.dumps(subtipos_by_tipo, ensure_ascii=False, indent=2)}
export const marcasByCategoria: Record<string, string[]> = {json.dumps(marcas_by_cat, ensure_ascii=False, indent=2)}
export const coloresAll: string[] = {json.dumps(colores_all, ensure_ascii=False)}
export const tallasByContext: Record<string, string[]> = {json.dumps(tallas_by_context, ensure_ascii=False, indent=2)}
export const colorSynonyms: Record<string, string> = {{
  'blanco': 'Blanco', 'hueso': 'Blanco', 'marfil': 'Blanco', 'crema': 'Blanco',
  'negro': 'Negro / Gris', 'gris': 'Negro / Gris', 'plomo': 'Negro / Gris', 'carbón': 'Negro / Gris', 'pizarra': 'Negro / Gris', 'plateado': 'Negro / Gris',
  'azul': 'Azul / Celeste', 'celeste': 'Azul / Celeste', 'turquesa': 'Azul / Celeste', 'marino': 'Azul / Celeste', 'navy': 'Azul / Celeste', 'índigo': 'Azul / Celeste', 'denim': 'Azul / Celeste', 'mezclilla': 'Azul / Celeste',
  'rojo': 'Rojo / Corinto', 'corinto': 'Rojo / Corinto', 'vino': 'Rojo / Corinto', 'granate': 'Rojo / Corinto', 'borgoña': 'Rojo / Corinto', 'carmesí': 'Rojo / Corinto',
  'amarillo': 'Amarillo', 'mostaza': 'Amarillo', 'oro': 'Amarillo', 'dorado': 'Amarillo',
  'verde': 'Verde', 'olivo': 'Verde', 'militar': 'Verde', 'menta': 'Verde', 'esmeralda': 'Verde',
  'naranja': 'Naranja', 'coral': 'Naranja', 'terracota': 'Naranja',
  'morado': 'Morado', 'lila': 'Morado', 'violeta': 'Morado', 'púrpura': 'Morado',
  'café': 'Café', 'marrón': 'Café', 'chocolate': 'Café', 'camel': 'Café', 'tabaco': 'Café',
  'beige': 'Beige / Khaki', 'khaki': 'Beige / Khaki', 'arena': 'Beige / Khaki', 'taupe': 'Beige / Khaki',
  'rosa': 'Rosa', 'rosado': 'Rosa', 'fucsia': 'Rosa', 'magenta': 'Rosa', 'salmón': 'Rosa',
  'estampado': 'Multicolor / Estampado', 'multicolor': 'Multicolor / Estampado', 'cuadros': 'Multicolor / Estampado', 'rayas': 'Multicolor / Estampado', 'floral': 'Multicolor / Estampado'
}}
'''
(OUT_DIR / 'filters.ts').write_text(filters_ts, encoding='utf-8')
print(f'Generated {len(products)} products, {len(reviews)} reviews')

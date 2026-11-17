#!/usr/bin/env python3
"""Genera src/data/*.ts, public/_redirects y public/sitemap.xml a partir de los CSV exportados de Notion.

Uso:
  python3 scripts/generate-data.py <CATALOGO.csv> <RESEÑAS.csv> [--dry-run]

El CSV de CATALOGO debe traer la columna "ID" (propiedad "ID" único de Notion). La URL de cada producto
sale de su nombre + ese ID, por lo que no cambia aunque cambie el orden de las filas.
--dry-run muestra el resumen de cambios sin escribir ningún archivo.
"""
import csv, json, re, subprocess, sys, urllib.parse
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
ROOT = SCRIPTS.parent
sys.path.insert(0, str(SCRIPTS))
from slugs import assign_slugs
from redirects import build_redirects, match_products, read_redirects, write_redirects, MAX_RULES, WARN_RULES

args = [a for a in sys.argv[1:] if not a.startswith('--')]
DRY = '--dry-run' in sys.argv
if len(args) < 2:
    sys.exit(__doc__)
CATALOG, REVIEWS = args[0], args[1]
OUT_DIR = ROOT / 'src' / 'data'
REDIRECTS = ROOT / 'public' / '_redirects'
PRODUCTS_MARK = 'export const products: Product[] = '


# Valores retirados del catálogo (nov 2026). Si Notion todavía trae el valor viejo, se convierte aquí.
SUBTIPO_MAP = {'Tela': 'Tela / Gabardina', 'De vestir': 'Tela / Gabardina'}
ESTILO_MAP = {'814': 'Slim', '816': 'Skinny', '812': ''}


def norm(mapping, value):
    v = (value or '').strip()
    return mapping.get(v, v)

def emit(path, text):
    if not DRY:
        path.write_text(text, encoding='utf-8')

def load_prev():
    f = OUT_DIR / 'products.ts'
    if not f.exists():
        return []
    t = f.read_text(encoding='utf-8')
    return json.loads(t[t.index(PRODUCTS_MARK) + len(PRODUCTS_MARK):])

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

with open(CATALOG, encoding='utf-8-sig', newline='') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames or []
    rows = list(reader)

id_col = next((c for c in fieldnames if c.strip().lower() == 'id'), None)
if id_col is None:
    sys.exit('ERROR: el CSV no tiene la columna "ID". Exporta CATALOGO desde Notion con la propiedad ID incluida.\n'
             f'Columnas encontradas: {", ".join(fieldnames)}')

products, omitidos, sin_id = [], [], []
for row in rows:
    nombre = (row.get('Nombre') or '').strip()
    img1 = (row.get('Imagen 1') or '').strip()
    color = (row.get('Color') or '').strip()
    precio = (row.get('Precio en GTQ') or '').strip()
    notion_id = (row.get(id_col) or '').strip()
    faltan = [n for n, v in (('Nombre', nombre), ('Imagen 1', img1), ('Color', color), ('Precio en GTQ', precio)) if not v]
    if faltan:   # regla de visibilidad de la spec: sin estos 4 campos la prenda no se muestra
        omitidos.append(f'{nombre or "(sin nombre)"} · ID {notion_id or "?"} · le falta: {", ".join(faltan)}')
        continue
    if not notion_id:
        sin_id.append(nombre)
        continue
    digits = re.sub(r'\D', '', notion_id)
    tarjeta = (row.get('Tarjeta GTQ') or '').strip()
    try: precio_num = float(precio)
    except ValueError: precio_num = 0.0
    try: tarjeta_num = float(tarjeta) if tarjeta else precio_num
    except ValueError: tarjeta_num = precio_num
    is_sale = (row.get('SALE') or '').strip().lower() == 'yes'
    is_pronto = (row.get('Pronto volverá') or '').strip().lower() == 'yes'
    discount = round((1 - precio_num / tarjeta_num) * 100) if (is_sale and tarjeta_num > precio_num) else 0
    products.append({
        'id': int(digits) if digits else 0, 'slug': '', 'notionId': notion_id, 'nombre': nombre,
        'categoria': (row.get('Categoría') or '').strip(),
        'tipo': (row.get('Tipo de producto') or '').strip(),
        'subtipo': norm(SUBTIPO_MAP, row.get('Subtipo')),
        'estilo': norm(ESTILO_MAP, row.get('Estilo de Pantalon')),
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

# --- Validaciones: si algo falla no se escribe NADA
errores = []
if sin_id:
    errores.append('Prendas completas pero SIN ID (Notion asigna ID solo a filas nuevas; revisa que la propiedad cubra todas):\n  - ' + '\n  - '.join(sin_id))
dup = sorted({p['notionId'] for p in products if sum(q['notionId'] == p['notionId'] for q in products) > 1})
if dup:
    errores.append('ID repetido en más de una prenda: ' + ', '.join(dup))
sin_num = [p['nombre'] for p in products if p['id'] == 0]
if sin_num:
    errores.append('ID sin número (el ID debe contener un número, p. ej. LT-12): ' + ', '.join(sin_num))
dup_num = sorted({p['id'] for p in products if sum(q['id'] == p['id'] for q in products) > 1})
if dup_num:
    errores.append('Dos IDs distintos tienen el mismo número: ' + ', '.join(map(str, dup_num)))
if errores:
    sys.exit('ERROR, no se escribió ningún archivo:\n' + '\n'.join(errores))

prev = load_prev()
assign_slugs(products)

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
  id: number; slug: string; notionId?: string; nombre: string; categoria: string; tipo: string; subtipo: string; estilo: string
  marca: string; color: string; colorHex: string; tallas: string[]; imagenes: string[]
  precio: number; tarjeta: number | null; descripcion: string; fecha: string | null
  sale: boolean; prontoVolvera: boolean; descuento: number | null
}}
export const products: Product[] = {json.dumps(products, ensure_ascii=False, indent=2)}
'''
emit(OUT_DIR / 'products.ts', products_ts)

reviews_ts = f'''export interface Review {{ nombre: string; comentario: string; estrellas: number; fecha: string }}
export const reviews: Review[] = {json.dumps(reviews, ensure_ascii=False, indent=2)}
'''
emit(OUT_DIR / 'reviews.ts', reviews_ts)

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
emit(OUT_DIR / 'filters.ts', filters_ts)

# --- Redirecciones de URLs anteriores
mapping, info = build_redirects(prev, products, read_redirects(REDIRECTS))
reglas = len(mapping) * 2
if reglas > MAX_RULES:
    sys.exit(f'ERROR: {reglas} reglas de redirección superan el límite de Cloudflare ({MAX_RULES}). Hay que podar las más antiguas.')
if not DRY:
    write_redirects(REDIRECTS, mapping)
    r = subprocess.run(['node', str(SCRIPTS / 'generate-sitemap.mjs')], cwd=ROOT, capture_output=True, text=True)
    sitemap_msg = (r.stdout or r.stderr).strip()
else:
    sitemap_msg = '(dry-run: sitemap no regenerado)'

# --- Resumen
pairs, _ = match_products(prev, products)
emparejados = {id(p) for p in pairs.values()}
nuevos = [p for p in products if id(p) not in emparejados]
cambios_precio = []
for old in prev:
    n = pairs.get(old['slug'])
    if n and (old['precio'], old['tarjeta'], old['sale'], old['prontoVolvera']) != (n['precio'], n['tarjeta'], n['sale'], n['prontoVolvera']):
        cambios_precio.append(f"{n['nombre']} ({n['color']}): Q{old['precio']:g}{' SALE' if old['sale'] else ''} -> Q{n['precio']:g}{' SALE' if n['sale'] else ''}")

modo = 'DRY-RUN (no se escribió nada)' if DRY else 'Archivos escritos'
print(f'{modo}: {len(products)} productos, {len(reviews)} reseñas')
print(f"  Nuevos: {len(nuevos)} · Quitados: {len(info['sin_pareja'])} · URLs cambiadas: {info['cambiados']}")
print(f"  Redirecciones: {len(mapping)} URLs viejas ({reglas} reglas de {MAX_RULES})" + ('  <-- CERCA DEL LÍMITE' if reglas > WARN_RULES else ''))
print(f'  Sitemap: {sitemap_msg}')
if cambios_precio:
    print(f'  Precios/estado distintos a la versión anterior ({len(cambios_precio)}):')
    for c in cambios_precio[:25]: print('    -', c)
    if len(cambios_precio) > 25: print(f'    ... y {len(cambios_precio) - 25} más')
if omitidos:
    print(f'  NO se publican por datos incompletos ({len(omitidos)}):')
    for o in omitidos: print('    -', o)
if info['sin_pareja']:
    print(f"  Estaban en el sitio y ya no están (sin redirección, la URL dará 'no encontrado') ({len(info['sin_pareja'])}):")
    for o in info['sin_pareja'][:25]: print('    -', o['nombre'], '·', o['slug'])
if info['choques']:
    print('  Aviso: se descartaron redirecciones cuyo origen coincide con una URL actual:', ', '.join(info['choques'][:10]))


"""Mantiene public/_redirects al regenerar el catálogo.

Cada vez que la URL de un producto cambia (cambió el nombre, la marca, el ID...), la URL
anterior se redirige con 301 a la nueva. Las redirecciones de generaciones anteriores se
vuelven a apuntar al destino actual (nunca se encadenan: viejo -> actual, en un solo salto).

Cómo se reconoce que dos filas son "el mismo producto" entre una generación y la siguiente:
  1. por ID de Notion (lo estable, cuando ambas generaciones lo tienen);
  2. si no, por el nombre del archivo de la Imagen 1;
  3. si no, por nombre + marca + color + fecha.
"""
import re
from pathlib import Path

# Cloudflare permite 2000 reglas estáticas por sitio. Una regla por URL vieja (ver nota en write_redirects).
MAX_RULES = 2000
WARN_RULES = 1700

_LINE = re.compile(r'^/producto/([^/\s]+)/?\s+/producto/([^/\s]+)/?\s+301\s*$')


def _img(p):
    return p['imagenes'][0].rsplit('/', 1)[-1] if p.get('imagenes') else None


def match_products(prev, new):
    """Devuelve ({slug_viejo: producto_nuevo}, [productos viejos sin pareja])."""
    pairs, used = {}, set()   # used: ids de python de los nuevos ya emparejados

    def take(old, cand):
        if cand is not None and id(cand) not in used and old['slug'] not in pairs:
            pairs[old['slug']] = cand
            used.add(id(cand))
            return True
        return False

    by_nid = {p['notionId']: p for p in new if p.get('notionId')}
    for old in prev:
        if old.get('notionId'):
            take(old, by_nid.get(old['notionId']))

    imgs = {}
    for p in new:
        imgs.setdefault(_img(p), []).append(p)
    for old in prev:
        if old['slug'] in pairs:
            continue
        c = [x for x in imgs.get(_img(old), []) if id(x) not in used]
        if len(c) == 1:
            take(old, c[0])

    keys = {}
    for p in new:
        keys.setdefault((p['nombre'], p['marca'], p['color'], p['fecha']), []).append(p)
    for old in prev:
        if old['slug'] in pairs:
            continue
        c = [x for x in keys.get((old['nombre'], old['marca'], old['color'], old['fecha']), []) if id(x) not in used]
        if len(c) == 1:
            take(old, c[0])

    sin_pareja = [o for o in prev if o['slug'] not in pairs]
    return pairs, sin_pareja


def read_redirects(path):
    """{slug_origen: slug_destino} leído del _redirects existente."""
    out = {}
    p = Path(path)
    if not p.exists():
        return out
    for line in p.read_text(encoding='utf-8').splitlines():
        m = _LINE.match(line.strip())
        if m:
            out[m.group(1)] = m.group(2)
    return out


def build_redirects(prev, new, existing):
    """Calcula el mapa final {slug_viejo: slug_nuevo}. Devuelve (mapa, info)."""
    pairs, sin_pareja = match_products(prev, new)
    current = {p['slug'] for p in new}
    cambios = {old: p['slug'] for old, p in pairs.items() if old != p['slug']}
    renombrados = dict(cambios)

    final = {}
    # 1) Redirecciones de generaciones anteriores: apuntarlas al slug actual del producto.
    for src, dst in existing.items():
        if dst in renombrados:
            dst = renombrados[dst]
        if dst in current:
            final[src] = dst
    # 2) Las de esta generación.
    final.update(cambios)
    # 3) Un origen que hoy es una URL real no puede redirigir (el redireccionamiento tiene prioridad
    #    sobre los archivos y escondería el producto verdadero).
    choques = sorted(s for s in final if s in current)
    for s in choques:
        del final[s]
    return final, {'cambiados': len(cambios), 'sin_pareja': sin_pareja, 'choques': choques}


def write_redirects(path, mapping):
    # Se escribe la variante con barra final y la sin ella: en Cloudflare cuentan como reglas distintas.
    lines = ['# Generado por scripts/generate-data.py. No editar a mano.',
             '# URLs anteriores de productos -> URL actual (301).']
    for src in sorted(mapping):
        lines.append(f'/producto/{src}/ /producto/{mapping[src]}/ 301')
        lines.append(f'/producto/{src} /producto/{mapping[src]}/ 301')
    Path(path).write_text('\n'.join(lines) + '\n', encoding='utf-8')
    rules = (len(lines) - 2)
    return rules

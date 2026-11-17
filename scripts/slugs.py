"""Regla única de URLs de producto (la usa generate-data.py).

URL = nombre [+ marca si el nombre no la menciona] + ID único de Notion (p. ej. cincho-dutton-lt-185).
El ID es permanente: no cambia al reordenar, editar ni mover filas, así que la URL solo cambia si se
edita el nombre o la marca (en ese caso scripts/redirects.py deja la redirección 301 automáticamente).
Sin ID (solo para pruebas) se usa un hash del nombre del archivo de la Imagen 1.
"""
import hashlib, re

def slugify(s):
    if not s: return ''
    s = str(s).lower()
    for old, new in [('àáâãäå','a'),('èéêë','e'),('ìíîï','i'),('òóôõö','o'),('ùúûü','u'),('ñ','n')]:
        for c in old: s = s.replace(c, new)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def product_slug(nombre, marca, imagen1, notion_id=None):
    base = slugify(nombre)[:70].strip('-')
    m = slugify(marca)
    if m and m != 'otras' and m not in base:
        base = f'{base}-{m}'
    if notion_id:
        return f'{base}-{slugify(notion_id)}'
    archivo = imagen1.rsplit('/', 1)[-1]
    return f'{base}-{hashlib.sha1(archivo.encode("utf-8")).hexdigest()[:4]}'

def assign_slugs(products):
    """products: lista de dicts con nombre, marca, imagenes y (opcional) notionId. Garantiza unicidad."""
    seen = {}
    for p in products:
        s = product_slug(p['nombre'], p['marca'], p['imagenes'][0], p.get('notionId'))
        if s in seen:  # choque de sufijo (muy improbable): alargar el hash
            archivo = p['imagenes'][0].rsplit('/', 1)[-1]
            s = s[:-4] + hashlib.sha1(archivo.encode('utf-8')).hexdigest()[:8]
            if s in seen: raise SystemExit(f'URL duplicada: {s}')
        seen[s] = True
        p['slug'] = s
    return products

#!/usr/bin/env python3
import html, json, re, unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://medomicile.com/'

def norm(value):
    value = ''.join(c for c in unicodedata.normalize('NFD', str(value or '').lower()) if unicodedata.category(c) != 'Mn')
    value = re.sub(r'\b(kenitra|kénitra)\b', '', value)
    value = re.sub(r'\b(wlad|oulad)\b', 'ouled', value)
    return re.sub(r'\s+', ' ', value).strip(' -/')

AREA_GROUPS = {
    'Saknia': {'saknia', 'al fouarat', 'fourat', 'saknia - fouarat', 'saknia - ouled arafa', 'al houzia'},
    'Centre-ville': {'centre-ville', 'medina', 'medina - centre-ville', 'mimosas'},
    'Bir Rami': {'bir rami', 'bir rami est', 'bir rami sud', 'bir rami industrielle', 'ville nouvelle', 'ville nouvelle - bir rami est'},
    'Ouled Oujih - Haddada': {'ouled oujih', 'haddada - route de mehdia'},
}
AREA_ORDER = list(AREA_GROUPS)

def main_area(raw):
    key = norm(raw)
    for area, aliases in AREA_GROUPS.items():
        if key in aliases:
            return area
    return None

def slug(value):
    value = ''.join(c for c in unicodedata.normalize('NFD', value.lower()) if unicodedata.category(c) != 'Mn')
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', value))

def e(value): return html.escape(str(value or ''), quote=True)

def card(p):
    lines = []
    for label, key in [('QUARTIER', 'district'), ('ADRESSE', 'address'), ('TÉLÉPHONE', 'phone'), ('HORAIRES', 'hours')]:
        if p.get(key): lines.append(f'<p class="pharmacy-card-line"><span>{label}</span><b>{e(p[key])}</b></p>')
    buttons = ''
    if p.get('phone'): buttons += f'<a class="primary-action" href="tel:{e(p["phone"].replace(" ", ""))}">Appeler</a>'
    if p.get('mapsUrl'): buttons += f'<a class="secondary-action" href="{e(p["mapsUrl"])}" target="_blank" rel="noopener">Itinéraire Google Maps</a>'
    return f'<article class="pharmacy-card pharmacy-card--directory reveal"><h3>{e(p.get("name"))}</h3>{"".join(lines)}<div class="urgent-actions">{buttons}</div></article>'

def page(title, description, breadcrumb, content, canonical):
    crumbs = ' <span aria-hidden="true">›</span> '.join(f'<a href="{e(url)}">{e(name)}</a>' for name, url in breadcrumb)
    schema = {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
      {'@type':'ListItem','position':i+1,'name':name,'item':url} for i,(name,url) in enumerate(breadcrumb)]}
    return f'''<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{e(title)}</title><meta name="description" content="{e(description)}"><link rel="canonical" href="{e(canonical)}"><link rel="stylesheet" href="style.css?v=20260731-01"></head><body><main id="main" class="page-main directory-main pharmacy-page"><nav class="breadcrumb" aria-label="Fil d’Ariane">{crumbs}</nav>{content}</main><script defer src="script.js?v=20260731-01"></script><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script></body></html>'''

def main():
    data = json.loads((ROOT/'data/pharmacies-garde.json').read_text())
    groups = {area: [] for area in AREA_ORDER}
    unmapped = []
    for p in data.get('directory', []):
        area = main_area(p.get('district'))
        if area: groups[area].append(p)
        else: unmapped.append({'name': p.get('name'), 'sector': p.get('district'), 'address': p.get('address'), 'google_maps': p.get('mapsUrl')})
    groups = {k: sorted(v, key=lambda p: norm(p.get('name'))) for k,v in groups.items()}
    cards = ''.join(f'<a class="specialty-card reveal pharmacy-area-card" href="pharmacies-{slug(name)}-kenitra.html"><span class="specialty-card__content"><strong class="specialty-card__title">{e(name)}</strong><span class="specialty-card__description">Voir les pharmacies à {e(name)}</span><span class="specialty-card__meta"><span class="specialty-card__status">{len(items)} pharmacie{"s" if len(items)!=1 else ""}</span></span></span><span class="specialty-card__arrow" aria-hidden="true">›</span></a>' for name,items in groups.items())
    main_content = f'<section class="directory-hero page-hero section"><div class="directory-hero-copy"><p class="eyebrow">ANNUAIRE PERMANENT</p><h1>Pharmacies à Kénitra</h1><p class="hero-subtitle">Retrouvez les pharmacies de Kénitra par grande zone, avec leurs coordonnées et itinéraires disponibles.</p></div></section><section class="directory section" aria-labelledby="sector-title"><div class="pharmacy-panel reveal"><div class="pharmacy-copy"><h2 id="sector-title">Pharmacies par grande zone à Kénitra</h2><p>Choisissez une zone pour afficher les pharmacies correspondantes.</p></div><div class="specialty-grid pharmacy-area-grid">{cards}</div></div></section>'
    (ROOT/'pharmacies-kenitra.html').write_text(page('Pharmacies à Kénitra par secteur | Medomicile','Trouvez les pharmacies à Kénitra par grande zone, avec coordonnées et itinéraires disponibles.', [('Accueil',BASE),('Pharmacies à Kénitra',BASE+'pharmacies-kenitra.html')], main_content, BASE+'pharmacies-kenitra.html'))
    generated=[]
    for name,items in groups.items():
        path = f'pharmacies-{slug(name)}-kenitra.html'; url=BASE+path
        plural = 's' if len(items) != 1 else ''
        other_links = ' | '.join('<a href="pharmacies-%s-kenitra.html">%s</a>' % (slug(n), e(n)) for n in AREA_ORDER if n != name)
        content=f'<section class="directory-hero page-hero section"><div class="directory-hero-copy"><p class="eyebrow">ANNUAIRE PHARMACEUTIQUE</p><h1>Pharmacies à {e(name)}, Kénitra</h1><p class="hero-subtitle">Retrouvez les pharmacies situées dans le secteur {e(name)} à Kénitra, avec leurs coordonnées et informations pratiques disponibles.</p></div></section><section class="directory section"><div class="pharmacy-panel reveal"><div class="pharmacy-copy"><h2>{len(items)} pharmacie{plural} à {e(name)}</h2></div><div class="pharmacy-list pharmacy-directory-list">{"".join(card(p) for p in items)}</div><p class="directory-links"><a href="pharmacies-kenitra.html">← Toutes les pharmacies à Kénitra</a></p><h2>Explorer d’autres secteurs</h2><div class="directory-links">{other_links}</div></div></section>'
        (ROOT/path).write_text(page(f'Pharmacies à {name}, Kénitra | Medomicile',f'Retrouvez les pharmacies situées à {name}, Kénitra, avec leurs coordonnées, adresses et itinéraires disponibles.', [('Accueil',BASE),('Pharmacies à Kénitra',BASE+'pharmacies-kenitra.html'),(name,url)],content,url)); generated.append(path)
    (ROOT/'data/pharmacies-unmapped.json').write_text(json.dumps(unmapped, ensure_ascii=False, indent=2) + '\n')
    sitemap=ROOT/'sitemap.xml'; text=sitemap.read_text(); text=re.sub(r'\n\s*<url>\s*<loc>https://medomicile.com/pharmacies-[^<]*-kenitra\.html</loc>[\s\S]*?</url>','',text)
    block=''.join(f'\n  <url><loc>{BASE}{p}</loc></url>' for p in generated); sitemap.write_text(text.replace('</urlset>',block+'\n</urlset>'))
    print(json.dumps({'total':len(data.get('directory',[])),'areas':len(groups),'generated':generated,'counts':{k:len(v) for k,v in groups.items()},'unmapped':len(unmapped)},ensure_ascii=False))
if __name__ == '__main__': main()

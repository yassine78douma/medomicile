#!/usr/bin/env python3
import html, json, re, unicodedata
from datetime import date
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

LANGS = {
    'fr': ('pharmacies-kenitra.html', 'pharmacies.html', 'Accueil', 'PHARMACIES À KÉNITRA', 'Pharmacies à Kénitra', 'Retrouvez les pharmacies de Kénitra par grande zone, avec leurs coordonnées et itinéraires disponibles.', 'Les informations peuvent évoluer. Contactez directement la pharmacie avant de vous déplacer lorsque cela est nécessaire.', 'Pharmacies par grande zone à Kénitra', 'Choisissez une zone pour afficher les pharmacies correspondantes.', 'Voir les pharmacies à', 'pharmacie', 'pharmacies', 'Visibilité locale', 'Développez la visibilité de votre pharmacie à Kénitra', 'Vous représentez une pharmacie à Kénitra ? Medomicile propose un emplacement sponsorisé clairement identifié.', 'Découvrir l’espace professionnel', 'Demande de visibilité sponsorisée pour une pharmacie'),
    'en': ('pharmacies-kenitra-en.html', 'pharmacies-en.html', 'Home', 'PHARMACIES IN KENITRA', 'Pharmacies in Kenitra', 'Find pharmacies in Kenitra by main area, with available contact details and directions.', 'Information may change. Contact the pharmacy directly before travelling when needed.', 'Pharmacies by main area in Kenitra', 'Choose an area to view the corresponding pharmacies.', 'View pharmacies in', 'pharmacy', 'pharmacies', 'Local visibility', 'Develop your pharmacy visibility in Kenitra', 'Do you represent a pharmacy in Kenitra? Medomicile offers a clearly identified sponsored placement.', 'Discover the professional space', 'Sponsored visibility request for a pharmacy'),
    'ar': ('pharmacies-kenitra-ar.html', 'pharmacies-ar.html', 'الرئيسية', 'صيدليات القنيطرة', 'صيدليات القنيطرة', 'اعثر على صيدليات القنيطرة حسب المناطق الرئيسية، مع بيانات الاتصال والاتجاهات المتاحة.', 'قد تتغير المعلومات. اتصل مباشرة بالصيدلية قبل التنقل عند الحاجة.', 'الصيدليات حسب المناطق الرئيسية في القنيطرة', 'اختر منطقة لعرض الصيدليات المعنية.', 'عرض صيدليات', 'صيدلية', 'صيدليات', 'ظهور محلي', 'طوّر ظهور صيدليتك في القنيطرة', 'هل تمثل صيدلية في القنيطرة؟ يوفر Medomicile مساحة ممولة ومحددة بوضوح.', 'اكتشف المساحة المهنية', 'طلب ظهور ممول لصيدلية'),
}

SEO_DESCRIPTIONS = {
    'fr': 'Retrouvez Pharmacies à Kénitra à Kénitra avec informations pratiques, adresses et numéros utiles. Vérifiez les disponibilités avant votre déplacement.',
    'en': 'Find Pharmacies in Kenitra with practical information, addresses and phone details in Kenitra. Confirm availability before travelling.',
    'ar': 'اكتشف صيدليات القنيطرة في القنيطرة مع المعلومات العملية والعناوين وأرقام الهاتف المتاحة. يرجى التأكد قبل التنقل.',
}

def shared_markup(source, tag):
    text = (ROOT / source).read_text()
    match = re.search(rf'(<{tag}\b[\s\S]*?</{tag}>)', text, re.I)
    if not match:
        raise ValueError(f'Missing shared {tag} in {source}')
    return match.group(1)

def main_directory_page(lang, groups):
    output, source, home, eyebrow, title, description, note, list_title, list_description, view, singular, plural, sponsor_eyebrow, sponsor_title, sponsor_description, sponsor_cta, sponsor_subject = LANGS[lang]
    header = shared_markup(source, 'header')
    footer = shared_markup(source, 'footer')
    directory_cards = ''.join(
        f'<a class="specialty-card reveal pharmacy-area-card" href="pharmacies-{slug(name)}-kenitra.html"><span class="specialty-card__content"><strong class="specialty-card__title">{e(name)}</strong><span class="specialty-card__description">{e(view)} {e(name)}</span><span class="specialty-card__meta"><span class="specialty-card__status">{len(items)} {e(singular if len(items) == 1 else plural)}</span></span></span><span class="specialty-card__arrow" aria-hidden="true">›</span></a>'
        for name, items in groups.items()
    )
    canonical = f'{BASE}{output}'
    breadcrumb = f'<nav class="breadcrumb" aria-label="Breadcrumb"><a href="{BASE if lang == "fr" else BASE + ("en.html" if lang == "en" else "ar.html")}">{e(home)}</a><span aria-hidden="true">›</span><span>{e(title)}</span></nav>'
    subject = html.escape(sponsor_subject.replace(' ', '%20'), quote=True)
    alternates = ''.join(f'    <link rel="alternate" hreflang="{code}" href="{BASE}{path}" />\n' for code, path in (('fr', 'pharmacies-kenitra.html'), ('en', 'pharmacies-kenitra-en.html'), ('ar', 'pharmacies-kenitra-ar.html'), ('x-default', 'pharmacies-kenitra.html')))
    seo_description = SEO_DESCRIPTIONS[lang]
    return f'''<!DOCTYPE html><html lang="{lang}"{' dir="rtl"' if lang == 'ar' else ''}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{e(title)} | Medomicile</title><meta name="description" content="{e(seo_description)}"><link rel="canonical" href="{canonical}"><link rel="stylesheet" href="style.css?v=20260908-03">{alternates}      <meta property="og:title" content="{e(title)} | Medomicile" />\n    <meta property="og:description" content="{e(seo_description)}" />\n    <meta property="og:url" content="{canonical}" />\n    <meta property="og:type" content="website" />\n    <meta property="og:image" content="https://medomicile.com/assets/brand/medomicile-logo.png" />\n  </head><body>{header}<main id="main" class="page-main directory-main pharmacy-page">{breadcrumb}<section class="directory-hero page-hero section ambient-page-hero" aria-labelledby="pharmacy-directory-title"><canvas class="ambient-canvas" data-ambient-canvas aria-hidden="true"></canvas><div class="directory-hero-copy reveal"><p class="eyebrow">{e(eyebrow)}</p><h1 id="pharmacy-directory-title">{e(title)}</h1><p class="hero-subtitle">{e(description)}</p><p class="directory-note">{e(note)}</p></div></section><section class="directory-cta laboratory-sponsor section reveal" aria-labelledby="pharmacy-sponsor-title"><div><p class="eyebrow">{e(sponsor_eyebrow)}</p><h2 id="pharmacy-sponsor-title">{e(sponsor_title)}</h2><p>{e(sponsor_description)}</p></div><div class="urgent-actions"><a class="primary-action" href="mailto:contact@medomicile.com?subject={subject}">{e(sponsor_cta)}</a></div></section><section class="directory section" aria-labelledby="sector-title"><div class="pharmacy-panel reveal"><div class="pharmacy-copy"><h2 id="sector-title">{e(list_title)}</h2><p>{e(list_description)}</p></div><div class="specialty-grid pharmacy-area-grid">{directory_cards}</div></div></section><section class="directory-cta section reveal" data-directory-footer-cta></section></main>{footer}<a dir="ltr" class="floating-call" href="tel:+212663058222">{'اتصال' if lang == 'ar' else 'Call' if lang == 'en' else 'Appeler'}</a><script defer src="script.js?v=20260908-02"></script></body></html>'''

def card(p):
    lines = []
    for label, key in [('QUARTIER', 'district'), ('ADRESSE', 'address'), ('TÉLÉPHONE', 'phone'), ('HORAIRES', 'hours')]:
        if p.get(key): lines.append(f'<p class="pharmacy-card-line"><span>{label}</span><b>{e(p[key])}</b></p>')
    buttons = ''
    if p.get('phone'): buttons += f'<a class="primary-action" href="tel:{e(p["phone"].replace(" ", ""))}">Appeler</a>'
    if p.get('mapsUrl'): buttons += f'<a class="secondary-action" href="{e(p["mapsUrl"])}" target="_blank" rel="noopener">Itinéraire Google Maps</a>'
    return f'<article class="pharmacy-card pharmacy-card--directory reveal"><h3>{e(p.get("name"))}</h3>{"".join(lines)}<div class="urgent-actions">{buttons}</div></article>'

def sector_page(name, items):
    output = f'pharmacies-{slug(name)}-kenitra.html'
    canonical = f'{BASE}{output}'
    title = f'Pharmacies à {name}, Kénitra'
    description = f'Retrouvez les pharmacies situées à {name}, Kénitra, avec leurs coordonnées, adresses et itinéraires disponibles.'
    header = shared_markup('pharmacies.html', 'header')
    footer = shared_markup('pharmacies.html', 'footer')
    breadcrumb = [('Accueil', BASE), ('Pharmacies à Kénitra', BASE + 'pharmacies-kenitra.html'), (name, canonical)]
    crumbs = ' <span aria-hidden="true">›</span> '.join(f'<a href="{e(url)}">{e(label)}</a>' for label, url in breadcrumb)
    schema = {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
      {'@type':'ListItem','position':i+1,'name':name,'item':url} for i,(name,url) in enumerate(breadcrumb)]}
    plural = 's' if len(items) != 1 else ''
    other_links = ' | '.join(
        f'<a href="pharmacies-{slug(area)}-kenitra.html">{e(area)}</a>'
        for area in AREA_ORDER if area != name
    )
    return f'''<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{e(title)} | Medomicile</title><meta name="description" content="{e(description)}"><link rel="canonical" href="{e(canonical)}"><link rel="stylesheet" href="style.css?v=20260908-03">    <meta property="og:title" content="{e(title)} | Medomicile" />\n    <meta property="og:description" content="{e(description)}" />\n    <meta property="og:url" content="{e(canonical)}" />\n    <meta property="og:type" content="website" />\n    <meta property="og:image" content="https://medomicile.com/assets/brand/medomicile-logo.png" />\n  <script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script></head><body>{header}<main id="main" class="page-main directory-main pharmacy-page"><nav class="breadcrumb" aria-label="Fil d’Ariane">{crumbs}</nav><section class="directory-hero page-hero section ambient-page-hero" aria-labelledby="pharmacy-sector-title"><canvas class="ambient-canvas" data-ambient-canvas aria-hidden="true"></canvas><div class="directory-hero-copy reveal"><p class="eyebrow">ANNUAIRE PHARMACEUTIQUE</p><h1 id="pharmacy-sector-title">{e(title)}</h1><p class="hero-subtitle">{e(description)}</p></div></section><section class="directory section"><div class="pharmacy-panel reveal"><div class="pharmacy-copy"><h2>{len(items)} pharmacie{plural} à {e(name)}</h2></div><div class="pharmacy-list pharmacy-directory-list">{"".join(card(pharmacy) for pharmacy in items)}</div><p class="directory-links"><a href="pharmacies-kenitra.html">← Toutes les pharmacies à Kénitra</a></p><h2>Explorer d’autres secteurs</h2><div class="directory-links">{other_links}</div></div></section><section class="directory-cta section reveal" data-directory-footer-cta></section></main>{footer}<a dir="ltr" class="floating-call" href="tel:+212663058222">Appeler</a><script defer src="script.js?v=20260908-02"></script></body></html>'''

def main():
    data = json.loads((ROOT/'data/pharmacies-garde.json').read_text())
    groups = {area: [] for area in AREA_ORDER}
    unmapped = []
    for p in data.get('directory', []):
        area = main_area(p.get('district'))
        if area: groups[area].append(p)
        else: unmapped.append({'name': p.get('name'), 'sector': p.get('district'), 'address': p.get('address'), 'google_maps': p.get('mapsUrl')})
    groups = {k: sorted(v, key=lambda p: norm(p.get('name'))) for k,v in groups.items()}
    for lang, (output, *_rest) in LANGS.items():
        (ROOT / output).write_text(main_directory_page(lang, groups))
    generated=[]
    for name,items in groups.items():
        path = f'pharmacies-{slug(name)}-kenitra.html'; url=BASE+path
        (ROOT/path).write_text(sector_page(name, items)); generated.append(path)
    (ROOT/'data/pharmacies-unmapped.json').write_text(json.dumps(unmapped, ensure_ascii=False, indent=2) + '\n')
    sitemap=ROOT/'sitemap.xml'; text=sitemap.read_text(); text=re.sub(r'\n\s*<url>\s*<loc>https://medomicile.com/pharmacies-[^<]*-kenitra\.html</loc>[\s\S]*?</url>','',text)
    block=''.join(f'\n  <url><loc>{BASE}{p}</loc>\n    <lastmod>{date.today().isoformat()}</lastmod></url>' for p in generated); sitemap.write_text(text.replace('</urlset>',block+'\n</urlset>'))
    print(json.dumps({'total':len(data.get('directory',[])),'areas':len(groups),'generated':generated,'counts':{k:len(v) for k,v in groups.items()},'unmapped':len(unmapped)},ensure_ascii=False))
if __name__ == '__main__': main()

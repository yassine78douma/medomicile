#!/usr/bin/env python3
import html, json, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
PAGES = {'Dentiste':'dentistes-kenitra.html','Dermatologue':'dermatologues-kenitra.html','Endocrinologue':'endocrinologues-kenitra.html','Gastro-entérologie':'gastroenterologues-kenitra.html','Gynécologue-obstétricien':'gynecologues-kenitra.html','Médecine interne':'internistes-kenitra.html','ORL':'orl-kenitra.html','Pédiatre':'pediatres-kenitra.html','Pneumologue':'pneumologues-kenitra.html','Rhumatologie':'rhumatologues-kenitra.html','Urologie':'urologues-kenitra.html','Chirurgien viscéral et digestif':'visceralistes-kenitra.html'}
FILTERS = {'Dentiste':'dentiste','Dermatologue':'dermatologue','Endocrinologue':'endocrinologue','Gastro-entérologie':'gastro','Gynécologue-obstétricien':'gynecologue','Médecine interne':'medecine interne','ORL':'orl','Pédiatre':'pediatre','Pneumologue':'pneumologue','Rhumatologie':'rhumatolog','Urologie':'urolog','Chirurgien viscéral et digestif':'chirurgien'}
AREAS = {
    'saknia': {'name': 'Saknia', 'url': 'dentistes-saknia-kenitra.html', 'districts': {'saknia', 'fouarat', 'fourat', 'saknia-fouarat'}},
    'centre-ville': {'name': 'Centre-ville', 'url': 'dentistes-centre-ville-kenitra.html', 'districts': {'centre-ville', 'maamora', 'mimosas', 'ville-haute'}},
    'bir-rami': {'name': 'Bir Rami', 'url': 'dentistes-bir-rami-kenitra.html', 'districts': {'bir-rami', 'bir-rami-est', 'bir-rami-ouest'}},
    'ouled-oujih-haddada': {'name': 'Ouled Oujih - Haddada', 'url': 'dentistes-ouled-oujih-haddada-kenitra.html', 'districts': {'ouled-oujih', 'oulad-oujih', 'wlad-oujih', 'haddada', 'hedada'}},
}
def e(v): return html.escape(str(v or ''), quote=True)
def norm(v): return re.sub(r'[^a-z0-9]+', '-', str(v or '').lower().replace('â','a').replace('à','a').replace('é','e').replace('è','e').replace('ê','e').replace('î','i').replace('ô','o').replace('û','u')).strip('-')
def card(d):
    lines=[f'<p class="doctor-line"><span aria-hidden="true">✚</span><span>{e(d["specialty"])}</span></p>']
    if d.get('subspecialty'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">◇</span><span>{e(d["subspecialty"])}</span></p>')
    if d.get('district'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">⌖</span><span>{e(d["district"])}</span></p>')
    if d.get('address'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">⌖</span><span>{e(d["address"])}</span></p>')
    for phone in d.get('phone',[]): lines.append(f'<p class="doctor-line"><span aria-hidden="true">☎</span><a dir="ltr" href="tel:{e(re.sub(r"[^0-9+]", "", phone))}">{e(phone)}</a></p>')
    if d.get('whatsapp'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">◔</span><a dir="ltr" href="https://wa.me/{e(re.sub(r"[^0-9]", "", d["whatsapp"]))}">{e(d["whatsapp"])}</a></p>')
    links=[]
    for key,label in [('google_maps','Itinéraire'),('instagram','Instagram'),('facebook','Facebook')]:
        if d.get(key): links.append(f'<a class="secondary-action" href="{e(d[key])}" target="_blank" rel="noopener">{label}</a>')
    if links: lines.append(f'<div class="urgent-actions">{"".join(links)}</div>')
    search=' '.join([d['name'],d['specialty'],d.get('district',''),d.get('address','')])
    return f'<article id="{e(d["id"])}" class="doctor-card reveal" data-doctor-id="{e(d["id"])}" data-status="active" data-search="{e(search)}"><h3>{e(d["name"])}</h3>{"".join(lines)}</article>'

def dentist_area(d):
    district = norm(d.get('district'))
    for key, area in AREAS.items():
        if district in area['districts']:
            return key
    return 'unmapped'

def area_cards(counts, lang='fr'):
    labels = {
        'fr': ('Dentistes par grande zone à Kénitra', 'Choisissez une zone pour afficher les dentistes correspondants.', 'Voir les dentistes à', 'dentistes'),
        'en': ('Dentists by major area in Kenitra', 'Choose an area to see the corresponding dentists.', 'View dentists in', 'dentists'),
        'ar': ('أطباء الأسنان حسب المناطق الرئيسية بالقنيطرة', 'اختر منطقة لعرض أطباء الأسنان المعنيين.', 'عرض أطباء الأسنان في', 'طبيب أسنان'),
    }[lang]
    cards = ''.join(
        f'<a class="specialty-card reveal pharmacy-area-card" href="{area["url"]}"><span class="specialty-card__content"><strong class="specialty-card__title">{e(area["name"])}</strong><span class="specialty-card__description">{labels[2]} {e(area["name"])}</span><span class="specialty-card__meta"><span class="specialty-card__status">{counts[key]} {labels[3]}</span></span></span><span class="specialty-card__arrow" aria-hidden="true">›</span></a>'
        for key, area in AREAS.items()
    )
    return f'\n      <!-- dentist-area-directory -->\n      <section class="directory section" aria-labelledby="dentist-area-title"><div class="pharmacy-panel reveal"><div class="pharmacy-copy"><h2 id="dentist-area-title">{labels[0]}</h2><p>{labels[1]}</p></div><div class="specialty-grid pharmacy-area-grid">{cards}</div></div></section>\n      <!-- /dentist-area-directory -->\n'

def area_page(area, dentists):
    name, url = area['name'], area['url']
    title = f'Dentistes à {name}, Kénitra | Medomicile'
    description = f'Trouvez les dentistes exerçant à {name}, Kénitra, avec leurs coordonnées et itinéraires disponibles.'
    breadcrumb = {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
        {'@type':'ListItem','position':1,'name':'Accueil','item':'https://medomicile.com/'},
        {'@type':'ListItem','position':2,'name':'Dentistes à Kénitra','item':'https://medomicile.com/dentistes-kenitra.html'},
        {'@type':'ListItem','position':3,'name':name,'item':f'https://medomicile.com/{url}'}]}
    return f'''<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>{e(title)}</title><meta name="description" content="{e(description)}" /><meta name="theme-color" content="#f8fafc" />
<link rel="canonical" href="https://medomicile.com/{url}" /><link rel="icon" type="image/png" href="assets/brand/medomicile-logo.png" /><link rel="stylesheet" href="style.css?v=20260909-11" />
<meta property="og:title" content="{e(title)}" /><meta property="og:description" content="{e(description)}" /><meta property="og:url" content="https://medomicile.com/{url}" /><meta property="og:type" content="website" /><meta property="og:image" content="https://medomicile.com/assets/brand/medomicile-logo.png" /></head>
<body><main id="main" class="page-main directory-main"><nav class="breadcrumb reveal" aria-label="Fil d'Ariane"><a href="./">Accueil</a><span aria-hidden="true">›</span><a href="dentistes-kenitra.html">Dentistes à Kénitra</a><span aria-hidden="true">›</span><span aria-current="page">{e(name)}</span></nav>
<section class="directory-hero page-hero section ambient-page-hero" aria-labelledby="dentist-area-page-title"><canvas class="ambient-canvas" data-ambient-canvas aria-hidden="true"></canvas><div class="directory-hero-copy reveal"><p class="eyebrow">ANNUAIRE MÉDICAL LOCAL</p><h1 id="dentist-area-page-title">Dentistes à {e(name)}, Kénitra</h1><p class="hero-subtitle">{e(description)}</p></div></section>
<section class="directory section" aria-labelledby="directory-list-title"><div class="pharmacy-panel reveal"><div class="pharmacy-copy"><h2 id="directory-list-title">{len(dentists)} dentistes à {e(name)}</h2></div><div class="doctor-grid" data-directory-list>{''.join(card(d) for d in dentists)}</div><p class="directory-links"><a href="dentistes-kenitra.html">← Tous les dentistes à Kénitra</a></p></div></section></main>
<script defer src="script.js?v=20260909-11"></script><script type="application/ld+json">{json.dumps(breadcrumb, ensure_ascii=False)}</script></body></html>\n'''

def generate_dentist_areas(docs):
    dentists = [d for d in docs if 'dentiste' in norm(f'{d.get("specialty", "")} {d.get("specialty_group", "")}')]
    grouped = defaultdict(list)
    for dentist in dentists: grouped[dentist_area(dentist)].append(dentist)
    counts = {key: len(grouped[key]) for key in AREAS}
    for lang, filename in [('fr', 'dentistes-kenitra.html'), ('en', 'dentistes-kenitra-en.html'), ('ar', 'dentistes-kenitra-ar.html')]:
        path = ROOT / filename
        text = path.read_text()
        section = area_cards(counts, lang)
        marker = re.compile(r'\s*<!-- dentist-area-directory -->[\s\S]*?<!-- /dentist-area-directory -->\s*')
        text = marker.sub('\n', text)
        if re.search(r'<section class="directory section" aria-labelledby="directory-list-title">', text):
            text = re.sub(r'(\s*<section class="directory section" aria-labelledby="directory-list-title">)', section + r'\1', text, count=1)
        else:
            text = re.sub(r'\s*<section class="pending-page section reveal">[\s\S]*?</section>', section, text, count=1)
        path.write_text(text)
    for key, area in AREAS.items():
        (ROOT / area['url']).write_text(area_page(area, grouped[key]))
    return len(dentists), counts, len(grouped['unmapped'])
def main():
    docs=json.loads((ROOT/'data/doctors.json').read_text())['doctors']; groups=defaultdict(list)
    for d in docs: groups[d['specialty_group']].append(d)
    changed=[]
    for group, filename in PAGES.items():
        items=[d for d in docs if FILTERS[group] in d['specialty'].lower().replace('é','e').replace('è','e') or FILTERS[group] in d['specialty_group'].lower().replace('é','e').replace('è','e')]
        if not items: continue
        path=ROOT/filename; text=path.read_text()
        pending=re.compile(r'\s*<section class="pending-page section reveal">[\s\S]*?</section>')
        grid='\n      <section class="directory section" aria-labelledby="directory-list-title"><h2 id="directory-list-title" class="sr-only">Liste des médecins</h2><div class="doctor-grid" data-directory-list>\n'+''.join(card(d) for d in items)+'\n</div></section>'
        next_text=pending.sub(grid,text, count=1)
        next_text=next_text.replace('Cette spécialité sera complétée progressivement après vérification des coordonnées.', 'Retrouvez les professionnels exerçant à Kénitra avec leurs coordonnées disponibles.')
        if next_text != text: path.write_text(next_text); changed.append(filename)
    dentist_total, dentist_counts, dentist_unmapped = generate_dentist_areas(docs)
    print(json.dumps({'updated_pages':changed,'groups':{k:len(v) for k,v in groups.items()},'dentists': {'total': dentist_total, 'areas': dentist_counts, 'unmapped': dentist_unmapped}},ensure_ascii=False))
if __name__=='__main__': main()

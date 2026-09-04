#!/usr/bin/env python3
import html, json, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://medomicile.com/'
DATA = json.loads((ROOT / 'data/dialysis-centers.json').read_text())['centers']

def e(v): return html.escape(str(v or ''), quote=True)
def tel(v): return '+212' + v.replace(' ', '')[1:] if v.startswith('0') else v.replace(' ', '')
def maps(c): return c.get('google_maps_url') or 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote(c['address'])

LANGS = {
 'fr': ('centres-dialyse-kenitra.html', 'Centres de dialyse à Kénitra', 'Retrouvez les centres de dialyse et de néphrologie à Kénitra, avec leurs coordonnées, médecin responsable lorsqu’il est identifié, téléphone et itinéraire.', 'Accueil', 'Médecin responsable', 'Spécialité', 'Secteur', 'Adresse', 'Téléphone', 'Appeler', 'Adresse / Itinéraire', 'Les centres seront ajoutés progressivement après vérification de leurs informations.'),
 'ar': ('centres-dialyse-kenitra-ar.html', 'مراكز تصفية الدم بالقنيطرة', 'تعرّف على مراكز تصفية الدم ومؤسسات علاج أمراض الكلى بمدينة القنيطرة.', 'الرئيسية', 'الطبيب المسؤول', 'التخصص', 'القطاع', 'العنوان', 'الهاتف', 'اتصال', 'الاتجاه / العنوان', 'ستتم إضافة المراكز تدريجياً بعد التحقق من معلوماتها.'),
 'en': ('dialysis-centers-kenitra.html', 'Dialysis Centers in Kenitra', 'Find dialysis centers and nephrology facilities in Kenitra, with contact details, responsible physician when identified, phone and directions.', 'Home', 'Responsible Physician', 'Specialty', 'Area', 'Address', 'Phone', 'Call', 'Directions', 'Centers will be added progressively after their information has been verified.')
}

def card(c, labels):
    _,_,_,_,doctor,specialty,sector,address,phone,call,directions,_ = labels
    rows=[]
    if c.get('doctor_responsible'): rows.append(f'<p class="pharmacy-card-line"><span>{e(doctor)}</span><b>{e(c["doctor_responsible"])}</b></p>')
    for label,key in [(specialty,'specialty'),(sector,'sector'),(address,'address')]:
        if c.get(key): rows.append(f'<p class="pharmacy-card-line"><span>{e(label)}</span><b>{e(c[key])}</b></p>')
    if c.get('phones'):
        rows.append(f'<p class="pharmacy-card-line"><span>{e(phone)}</span><a href="tel:{e(tel(c["phones"][0]))}">{e(c["phones"][0])}</a></p>')
        if len(c['phones']) > 1: rows.append(f'<p class="pharmacy-card-line"><span>{e(phone)}</span><b>{e(" / ".join(c["phones"][1:]))}</b></p>')
    return f'<article class="facility-card dialysis-card compact-card reveal" data-google-maps-url="{e(maps(c))}"><h3>{e(c["name"])}</h3>{"".join(rows)}</article>'

def page(lang):
    path,title,description,home,doctor,specialty,sector,address,phone,call,directions,empty = LANGS[lang]
    fr=BASE+'centres-dialyse-kenitra.html'; ar=BASE+'centres-dialyse-kenitra-ar.html'; en=BASE+'dialysis-centers-kenitra.html'
    hrefs={'fr':fr,'ar':ar,'en':en}; cards=''.join(card(c, LANGS[lang]) for c in DATA)
    featured = next((c for c in DATA if c.get('featured')), None)
    featured_html = ''
    if featured:
        doctor_html = f'<span>{e(doctor)} : <bdi>{e(featured["doctor_responsible"])}</bdi></span>' if featured.get('doctor_responsible') else ''
        featured_html = f'<section class="featured-clinic reveal"><div class="featured-clinic__media"><div class="dialysis-placeholder" aria-hidden="true">✚</div></div><div class="featured-clinic__content"><p class="featured-clinic__eyebrow">Centre partenaire</p><h2>{e(featured["name"])}</h2><p class="featured-clinic__type">{e(featured.get("specialty"))}</p><div class="featured-clinic__meta">{doctor_html}<span>{e(address)} : <bdi>{e(featured["address"])}</bdi></span></div><div class="featured-clinic__actions"><a class="primary-action" href="tel:{e(tel(featured["phones"][0]))}">{e(call)}</a><a class="secondary-action route" href="{e(maps(featured))}" target="_blank" rel="noopener noreferrer">{e(directions)}</a></div></div></section>'
    return f'''<!DOCTYPE html><html lang="{lang}"{' dir="rtl"' if lang=='ar' else ''}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{e(title)} | Medomicile</title><meta name="description" content="{e(description)}"><meta property="og:url" content="{hrefs[lang]}"><link rel="canonical" href="{hrefs[lang]}">{''.join(f'<link rel="alternate" hreflang="{k}" href="{v}">' for k,v in hrefs.items())}<link rel="alternate" hreflang="x-default" href="{fr}"><link rel="stylesheet" href="style.css?v=20260904-01"><script type="application/ld+json">{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"{e(home)}","item":"{BASE + ("ar.html" if lang=="ar" else "en.html" if lang=="en" else "")}"}},{{"@type":"ListItem","position":2,"name":"{e(title)}","item":"{hrefs[lang]}"}}]}}</script></head><body><main id="main" class="page-main directory-main"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="{BASE + ("ar.html" if lang=="ar" else "en.html" if lang=="en" else "")}">{e(home)}</a><span aria-hidden="true">›</span><span>{e(title)}</span></nav><section class="directory-hero page-hero section"><div class="directory-hero-copy"><p class="eyebrow">{'دليل طبي محلي' if lang=='ar' else 'LOCAL MEDICAL DIRECTORY' if lang=='en' else 'NÉPHROLOGIE & HÉMODIALYSE'}</p><h1>{e(title)}</h1><p class="hero-subtitle">{e(description)}</p><p class="directory-note">{'المعلومات المقدمة إرشادية وقد تتغير. يرجى الاتصال بالمركز قبل التنقل.' if lang=='ar' else 'The information presented is indicative and may change. Contact the center before going.' if lang=='en' else 'Les informations présentées sont données à titre indicatif et peuvent évoluer. Contactez directement le centre avant de vous déplacer.'}</p></div></section>{featured_html}<section class="directory section"><div class="pharmacy-panel reveal"><div class="pharmacy-copy"><h2>{'Autres centres de dialyse à Kénitra' if featured else e(title)}</h2></div><div class="facility-grid dialysis-grid">{cards}</div></div></section></main><a dir="ltr" class="floating-call" href="tel:+212663058222">{e(call)}</a><script defer src="script.js?v=20260904-01"></script></body></html>'''

for lang in LANGS:
    (ROOT / LANGS[lang][0]).write_text(page(lang))

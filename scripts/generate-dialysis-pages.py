#!/usr/bin/env python3
import html, json, urllib.parse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://medomicile.com/'
DATA = json.loads((ROOT / 'data/dialysis-centers.json').read_text())['centers']

def shared_header(lang):
    source = {'fr': 'hopitaux.html', 'ar': 'hopitaux-ar.html', 'en': 'hopitaux-en.html'}[lang]
    text = (ROOT / source).read_text()
    match = re.search(r'\s*<a class="skip-link"[\s\S]*?</header>', text)
    if not match:
        raise RuntimeError(f'No shared header found in {source}')
    header = re.sub(r'\sclass="is-current"', '', match.group(0))
    dialysis_path = {
        'fr': 'centres-dialyse-kenitra.html',
        'ar': 'centres-dialyse-kenitra-ar.html',
        'en': 'dialysis-centers-kenitra.html',
    }[lang]
    return re.sub(
        rf'(<a)(\s+href="{re.escape(dialysis_path)}")',
        r'\1 class="is-current"\2',
        header,
        count=1,
    )

def shared_footer(lang):
    source = {'fr': 'hopitaux.html', 'ar': 'hopitaux-ar.html', 'en': 'hopitaux-en.html'}[lang]
    text = (ROOT / source).read_text()
    match = re.search(r'\s*<footer class="footer">[\s\S]*?</footer>', text)
    if not match:
        raise RuntimeError(f'No shared footer found in {source}')
    footer = match.group(0)
    language_paths = {
        'fr': 'centres-dialyse-kenitra.html',
        'en': 'dialysis-centers-kenitra.html',
        'ar': 'centres-dialyse-kenitra-ar.html',
    }
    for language, path in language_paths.items():
        footer = re.sub(
            rf'(<a[^>]*href=")[^"]+("[^>]*\slang="{language}"[^>]*>)',
            rf'\g<1>{path}\g<2>',
            footer,
        )
    return footer

def e(v): return html.escape(str(v or ''), quote=True)
def tel(v): return '+212' + v.replace(' ', '')[1:] if v.startswith('0') else v.replace(' ', '')
def maps(c): return c.get('google_maps_url') or 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote(c['address'])

LANGS = {
 'fr': ('centres-dialyse-kenitra.html', 'Centres de dialyse à Kénitra', 'Retrouvez les centres de dialyse et de néphrologie à Kénitra, avec leurs coordonnées, médecin responsable lorsqu’il est identifié, téléphone et itinéraire.', 'Accueil', 'Médecin responsable', 'Spécialité', 'Secteur', 'Adresse', 'Téléphone', 'Appeler', 'Adresse / Itinéraire', 'Les centres seront ajoutés progressivement après vérification de leurs informations.'),
 'ar': ('centres-dialyse-kenitra-ar.html', 'مراكز تصفية الدم بالقنيطرة', 'اكتشف مراكز تصفية الدم بالقنيطرة في القنيطرة مع المعلومات العملية والعناوين وأرقام الهاتف المتاحة. يرجى التأكد قبل التنقل.', 'الرئيسية', 'الطبيب المسؤول', 'التخصص', 'القطاع', 'العنوان', 'الهاتف', 'اتصال', 'الاتجاه / العنوان', 'ستتم إضافة المراكز تدريجياً بعد التحقق من معلوماتها.'),
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
    doctor_attribute = f' data-doctor-responsible="{e(c["doctor_responsible"])}"' if c.get('doctor_responsible') else ''
    return f'<article class="facility-card reveal" data-hide-rating="true" data-google-maps-url="{e(maps(c))}"{doctor_attribute}><h3>{e(c["name"])}</h3>{"".join(rows)}</article>'

def featured_block(center, labels):
    if not center:
        return ''
    _, _, _, _, doctor, specialty, _, address, _, call, directions, _ = labels
    images = center.get('images') or ([center['image']] if center.get('image') else [])
    if not images:
        return ''
    image_tags = ''.join(
        f'<img class="{"is-active" if index == 0 else ""}" src="{e(image)}" alt="{e(center["name"])}" loading="{"eager" if index == 0 else "lazy"}">'
        for index, image in enumerate(images)
    )
    controls = ''.join(
        f'<button class="{"is-active" if index == 0 else ""}" type="button" aria-label="Afficher la photo {index + 1}"></button>'
        for index in range(len(images))
    )
    doctor_html = f'<span>{e(doctor)} : <bdi>{e(center["doctor_responsible"])}</bdi></span>' if center.get('doctor_responsible') else ''
    specialty_html = f'<p class="featured-clinic__type">{e(center["specialty"])}</p>' if center.get('specialty') else ''
    return f'<article class="featured-clinic reveal" aria-labelledby="featured-dialysis-title"><div class="featured-clinic__media" data-featured-clinic-gallery>{image_tags}<div class="featured-clinic__controls" aria-label="Photos du centre">{controls}</div></div><div class="featured-clinic__content"><p class="featured-clinic__eyebrow">Centre partenaire</p><h2 id="featured-dialysis-title">{e(center["name"])}</h2>{specialty_html}<p>Centre de dialyse mis en avant avec ses coordonnées utiles pour aider les familles à appeler rapidement ou à lancer un itinéraire.</p><div class="featured-clinic__meta">{doctor_html}<span>{e(address)} : <bdi>{e(center["address"])}</bdi></span></div><div class="featured-clinic__actions"><a class="primary-action" href="tel:{e(tel(center["phones"][0]))}">{e(call)}</a><a class="secondary-action route" href="{e(maps(center))}" target="_blank" rel="noopener noreferrer">{e(directions)}</a></div></div></article>'

def page(lang):
    path,title,description,home,doctor,specialty,sector,address,phone,call,directions,empty = LANGS[lang]
    fr=BASE+'centres-dialyse-kenitra.html'; ar=BASE+'centres-dialyse-kenitra-ar.html'; en=BASE+'dialysis-centers-kenitra.html'
    hrefs={'fr':fr,'ar':ar,'en':en}; cards=''.join(card(c, LANGS[lang]) for c in DATA)
    featured = next((c for c in DATA if c.get('featured') or c.get('sponsored')), None)
    featured_html = featured_block(featured, LANGS[lang])
    nav_target = {"fr": "centres-dialyse-kenitra.html", "ar": "centres-dialyse-kenitra-ar.html", "en": "dialysis-centers-kenitra.html"}[lang]
    nav_label = {"fr": "Dialyse", "ar": "تصفية الدم", "en": "Dialysis"}[lang]
    home_href = {"fr": "", "ar": "ar.html", "en": "en.html"}[lang]
    header = f'<a class="skip-link" href="#main">{e("تجاوز إلى المحتوى" if lang == "ar" else "Skip to content" if lang == "en" else "Aller au contenu")}</a><header class="mobile-header"><nav class="nav" aria-label="Navigation principale"><a class="brand" href="{BASE + home}"><span class="brand-mark" aria-hidden="true"><img src="assets/optimized/medomicile-logo-160.png" alt="Medomicile"></span><span>Medomicile</span></a><div class="header-actions"><a class="mini-action call" href="tel:+212663058222">{e("اتصال" if lang == "ar" else "Call" if lang == "en" else "Appeler")}</a><a class="mini-action whats" href="https://wa.me/212663058222">WhatsApp</a></div><button class="menu-toggle" type="button" aria-controls="menu" aria-expanded="false"><span class="menu-lines" aria-hidden="true"></span><span class="sr-only">Menu</span></button><button class="theme-toggle" type="button" aria-label="Theme" data-theme-toggle>◐</button><div class="menu" id="menu"><a href="{BASE + home}">{e("الرئيسية" if lang == "ar" else "Home" if lang == "en" else "Accueil")}</a><a href="{nav_target}">{e(nav_label)}</a><a href="{("laboratoires-kenitra-ar.html" if lang == "ar" else "laboratories-kenitra.html" if lang == "en" else "laboratoires-kenitra.html")}">{e("المختبرات" if lang == "ar" else "Laboratories" if lang == "en" else "Laboratoires")}</a><a href="{("radiologie-kenitra-ar.html" if lang == "ar" else "radiology-kenitra.html" if lang == "en" else "radiologie-kenitra.html")}">{e("الأشعة" if lang == "ar" else "Radiology" if lang == "en" else "Radiologie")}</a></div></nav></header>'
    header = shared_header(lang)
    footer = shared_footer(lang)
    professional = {
        'fr': ('Visibilité locale', 'Développez la visibilité de votre centre de dialyse à Kénitra', 'Vous représentez un centre de dialyse ou de néphrologie à Kénitra ? Medomicile propose un emplacement sponsorisé clairement identifié.', 'Découvrir l’espace professionnel', 'Demande de visibilité sponsorisée pour un centre de dialyse'),
        'en': ('Local visibility', 'Develop your dialysis center visibility in Kenitra', 'Do you represent a dialysis or nephrology center in Kenitra? Medomicile offers a clearly identified sponsored placement.', 'Discover the professional space', 'Sponsored visibility request for a dialysis center'),
        'ar': ('ظهور محلي', 'طوّر ظهور مركز تصفية الدم الخاص بك في القنيطرة', 'هل تمثل مركزاً لتصفية الدم أو أمراض الكلى بالقنيطرة؟ يوفر Medomicile مساحة ممولة ومحددة بوضوح.', 'اكتشف المساحة المهنية', 'طلب ظهور ممول لمركز تصفية الدم'),
    }[lang]
    note = {'fr': 'Les établissements sont présentés à partir des informations publiques vérifiées et des emplacements sponsorisés clairement identifiés. Ce n’est pas un classement médical.', 'en': 'Centers are shown using verified public information and clearly identified sponsored placements. This is not a medical ranking.', 'ar': 'تُعرض المراكز بناءً على معلومات عامة تم التحقق منها ومساحات ممولة محددة بوضوح. هذا ليس تصنيفاً طبياً.'}[lang]
    info = {'fr': 'Les informations présentées sont données à titre indicatif et peuvent évoluer. Contactez directement le centre avant de vous déplacer. Les emplacements sponsorisés sont clairement identifiés et ne constituent ni un classement médical ni une recommandation de qualité.', 'en': 'The information shown is indicative and may change. Contact the center before travelling. Sponsored placements are clearly identified and do not constitute a medical ranking or quality recommendation.', 'ar': 'المعلومات المعروضة إرشادية وقد تتغير. اتصل مباشرة بالمركز قبل التنقل. المساحات الممولة محددة بوضوح ولا تشكل تصنيفاً طبياً أو توصية بالجودة.'}[lang]
    consultation = {
        'fr': ('Quand consulter un néphrologue ?', 'Une consultation en néphrologie peut être utile en cas de baisse durable de la fonction rénale, de protéines ou de sang dans les urines, de gonflement des jambes, d’hypertension difficile à contrôler, d’infections urinaires répétées ou pour le suivi d’une maladie rénale. En cas de symptôme grave ou brutal, contactez les urgences.'),
        'en': ('When should you consult a nephrologist?', 'A nephrology consultation may be useful for a persistent decline in kidney function, protein or blood in the urine, leg swelling, difficult-to-control high blood pressure, recurrent urinary infections, or follow-up for kidney disease. For severe or sudden symptoms, contact emergency services.'),
        'ar': ('متى يجب استشارة طبيب الكلى؟', 'قد تكون استشارة طبيب الكلى مفيدة عند وجود تراجع مستمر في وظائف الكلى، أو بروتين أو دم في البول، أو تورم في الساقين، أو ارتفاع ضغط يصعب التحكم فيه، أو التهابات بولية متكررة، أو لمتابعة مرض كلوي. عند ظهور أعراض خطيرة أو مفاجئة، اتصل بخدمات الطوارئ.'),
    }[lang]
    subject = urllib.parse.quote(professional[4])
    open_graph = f'''    <meta property="og:title" content="{e(title)} | Medomicile" />
    <meta property="og:description" content="{e(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://medomicile.com/assets/brand/medomicile-logo.png" />
  '''
    return f'''<!DOCTYPE html><html lang="{lang}"{' dir="rtl"' if lang=='ar' else ''}><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{e(title)} | Medomicile</title><meta name="description" content="{e(description)}"><meta property="og:url" content="{hrefs[lang]}"><link rel="canonical" href="{hrefs[lang]}">{''.join(f'<link rel="alternate" hreflang="{k}" href="{v}">' for k,v in hrefs.items())}<link rel="alternate" hreflang="x-default" href="{fr}"><link rel="stylesheet" href="style.css?v=20260908-04"><script type="application/ld+json">{{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"{e(home)}","item":"{BASE + home_href}"}},{{"@type":"ListItem","position":2,"name":"{e(title)}","item":"{hrefs[lang]}"}}]}}</script>{open_graph}</head><body>{header}<main id="main" class="page-main directory-main"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="{BASE + home_href}">{e(home)}</a><span aria-hidden="true">›</span><span>{e(title)}</span></nav><section class="directory-hero page-hero section ambient-page-hero" aria-labelledby="dialysis-title"><canvas class="ambient-canvas" data-ambient-canvas aria-hidden="true"></canvas><div class="directory-hero-copy reveal"><p class="eyebrow">{'دليل طبي محلي' if lang=='ar' else 'LOCAL MEDICAL DIRECTORY' if lang=='en' else 'NÉPHROLOGIE & HÉMODIALYSE'}</p><h1 id="dialysis-title">{e(title)}</h1><p class="hero-subtitle">{e(description)}</p><p class="directory-note">{'المعلومات المقدمة إرشادية وقد تتغير. يرجى الاتصال بالمركز قبل التنقل.' if lang=='ar' else 'The information presented is indicative and may change. Contact the center before going.' if lang=='en' else 'Les informations présentées sont données à titre indicatif et peuvent évoluer. Contactez directement le centre avant de vous déplacer.'}</p></div></section>{featured_html}<section class="directory-cta laboratory-sponsor section reveal" aria-labelledby="dialysis-sponsor-title"><div><p class="eyebrow">{e(professional[0])}</p><h2 id="dialysis-sponsor-title">{e(professional[1])}</h2><p>{e(professional[2])}</p></div><div class="urgent-actions"><a class="primary-action" href="mailto:contact@medomicile.com?subject={subject}">{e(professional[3])}</a></div></section><section class="directory section" aria-labelledby="dialysis-list-title"><h2 id="dialysis-list-title" class="sr-only">{e(title)}</h2><p class="directory-note laboratory-sort-note reveal">{e(note)}</p><div class="facility-grid">{cards}</div></section><section class="directory-info section reveal" aria-labelledby="dialysis-info-title"><h2 id="dialysis-info-title">{'Informations indicatives' if lang == 'fr' else 'Indicative information' if lang == 'en' else 'معلومات إرشادية'}</h2><p>{e(info)}</p><details><summary>{e(consultation[0])}</summary><p>{e(consultation[1])}</p></details></section><section class="directory-cta section reveal" data-directory-footer-cta></section></main>{footer}<a dir="ltr" class="floating-call" href="tel:+212663058222">{e(call)}</a><script defer src="script.js?v=20260908-01"></script></body></html>'''

for lang in LANGS:
    (ROOT / LANGS[lang][0]).write_text(page(lang))

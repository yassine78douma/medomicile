#!/usr/bin/env python3
"""One engine: canonical JSON -> static cards, local QR, vCards, directory index."""
import html
import argparse
import hashlib
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import quote, urlencode, urlparse
import qrcode

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://medomicile.com'
LOGO = '/assets/optimized/medomicile-logo-160.png'
SOURCES = [('doctors.json', 'doctors', 'doctor'), ('establishments.json', 'establishments', None),
           ('dialysis-centers.json', 'centers', 'dialysis_center'), ('radiology-centers.json', 'centers', 'radiology_center'),
           ('laboratoires-kenitra.json', 'laboratories', 'laboratory'), ('pharmacies-kenitra.json', 'pharmacies', 'pharmacy')]
TYPES = {'doctor': 'Médecin', 'dentist': 'Dentiste', 'clinic': 'Clinique', 'hospital': 'Hôpital',
         'dialysis_center': 'Dialyse', 'radiology_center': 'Radiologie', 'laboratory': 'Laboratoire', 'pharmacy': 'Pharmacie'}


def esc(value):
    return html.escape(str(value or ''), quote=True)


def slug(value):
    return re.sub('[^a-z0-9]+', '-', unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()).strip('-')


def telephone(value):
    value = str(value or '').removeprefix('tel:').strip()
    if not re.fullmatch(r'\+?[\d\s().-]+', value):
        return None
    digits = re.sub(r'\D', '', value)
    explicit_international = value.startswith('+') or digits.startswith('00') or digits.startswith('212')
    if digits.startswith('00'):
        digits = digits[2:]
    if len(digits) == 10 and digits.startswith('0'):
        digits = '212' + digits[1:]
    elif not explicit_international:
        return None
    return '+' + digits if 9 <= len(digits) <= 15 else None


def http_url(value):
    return value if isinstance(value, str) and urlparse(value).scheme in ('https', 'http') and urlparse(value).netloc else None


def image_url(value):
    if http_url(value):
        return value
    if isinstance(value, str) and value and (ROOT/value.lstrip('/')).is_file():
        return '/' + value.lstrip('/')
    return None


def normalize(source, default_type, filename):
    kind = default_type or source['type']
    if kind == 'doctor' and 'dent' in (source.get('specialty_group') or source.get('specialty') or '').lower():
        kind = 'dentist'
    ident = str(source.get('id') or slug(source['name']))
    entity_slug = source.get('slug') or (ident if kind in ('doctor', 'dentist') else kind.replace('_', '-') + '-' + ident)
    if not re.fullmatch('[a-z0-9]+(?:-[a-z0-9]+)*', entity_slug):
        raise ValueError(f'Unsafe slug: {entity_slug}')
    prefix = 'p' if kind in ('doctor', 'dentist') else 'e'
    phones = source.get('phones') or source.get('phone') or []
    if not isinstance(phones, list):
        phones = [phones]
    phones = [part.strip() for entry in phones for part in entry.split('/')] if all(isinstance(p, str) for p in phones) else phones
    contacts, invalid = [], []
    for entry in phones:
        label = entry.get('label') if isinstance(entry, dict) else str(entry)
        raw = entry.get('href') if isinstance(entry, dict) else entry
        number = telephone(re.sub(r'^WhatsApp\s+', '', raw, flags=re.I) if isinstance(raw, str) else raw)
        if number and not any(p['number'] == number for p in contacts):
            if not any(c.isdigit() for c in str(label or '')):
                label = source.get('phone') if isinstance(source.get('phone'), str) else number
                label = label or number
            contacts.append({'label': label, 'number': number})
        elif not number and raw:
            invalid.append(raw)
    address = source.get('address') or None
    exact = http_url(source.get('google_maps_url') or source.get('google_maps') or source.get('mapsUrl'))
    maps = exact
    lat, lon = source.get('latitude'), source.get('longitude')
    if not maps and isinstance(lat, (int, float)) and isinstance(lon, (int, float)) and -90 <= lat <= 90 and -180 <= lon <= 180:
        maps = 'https://www.google.com/maps/search/?' + urlencode({'api': 1, 'query': f'{lat},{lon}'})
    if not maps and address:
        maps = 'https://www.google.com/maps/search/?' + urlencode({'api': 1, 'query': f'{source["name"]} {address}'})
    whatsapp = telephone(source.get('whatsapp'))
    subtitle = source.get('subtitle') or source.get('specialty') or source.get('type') or TYPES[kind]
    if isinstance(subtitle, dict):
        subtitle = subtitle.get('fr') or TYPES[kind]
    if subtitle in TYPES:
        subtitle = TYPES[subtitle]
    if kind in ('hospital', 'clinic'):
        subtitle = subtitle.split(' · ', 1)[0]
    responsible = source.get('responsible_person') or source.get('doctor_responsible') or source.get('responsible_biologist')
    useful_maps = bool(exact and not any(s in exact for s in ['/search', 'destination=', '?q=']))
    urgent_keys = ('available24h', 'urgences', 'urgence', 'garde', 'permanence', 'is24h', 'emergency', 'emergency24', 'open24', 'open24h', 'onDuty', 'legacy_open24h')
    urgency_sources = [source]
    if isinstance(source.get('sponsor'), dict): urgency_sources.append(source['sponsor'])
    def urgent_value(value):
        if value is True or value == 1: return True
        if isinstance(value, str): return bool(re.fullmatch(r'1|true|yes|oui', value.strip(), re.I) or re.search(r'24\s*h|urgence|garde|permanence|on.?duty', value, re.I))
        if isinstance(value, list): return any(urgent_value(item) for item in value)
        return False
    urgent = any(urgent_value(item.get(key)) for item in urgency_sources for key in urgent_keys)
    if not urgent: urgent = any(urgent_value(item.get('hours')) for item in urgency_sources)
    directory_sources = source.get('directory_sources') or []
    if not directory_sources and isinstance(source.get('sponsor'), dict):
        category = source['sponsor'].get('category')
        if category:
            directory_sources = [f'{category}-kenitra.html']
    if not directory_sources and kind in ('doctor', 'dentist'):
        group = slug(source.get('specialty_group') or source.get('specialty') or '')
        directory_sources = [f'{group}s-kenitra.html'] if group else ['medecins-kenitra.html']
        if kind == 'dentist': directory_sources = ['dentistes-kenitra.html']
        if group == 'gastro-enterologie': directory_sources = ['gastroenterologues-kenitra.html']
    directory_path = f'/{directory_sources[0]}' if directory_sources else None
    if directory_path and not directory_path.endswith('.html'): directory_path += '.html'
    if not directory_path:
        directory_path = {'dialysis_center': '/centres-dialyse-kenitra.html', 'radiology_center': '/radiologie-kenitra.html', 'laboratory': '/laboratoires-kenitra.html', 'pharmacy': '/pharmacies-kenitra.html', 'clinic': '/hopitaux.html', 'hospital': '/hopitaux.html'}.get(kind)
    share_url = f'{BASE}{directory_path}#{entity_slug}' if directory_path else f'{BASE}/{prefix}/{entity_slug}/'
    return {'id': ident, 'slug': entity_slug, 'type': kind, 'name': source['name'], 'subtitle': subtitle,
        'subspecialty': source.get('subspecialty'), 'establishment': source.get('establishment'), 'city': source.get('city'), 'district': source.get('district') or source.get('sector'),
        'address': address, 'phones': contacts, 'whatsapp': f'https://wa.me/{whatsapp[1:]}' if whatsapp else None,
        'google_maps_url': maps, 'responsible_person': responsible, 'director': source.get('director'),
        'resuscitation_doctor': source.get('resuscitation_doctor'),
        'photo': image_url(source.get('profile_image') or source.get('photo') or source.get('logo') or source.get('image')),
        'logo': image_url(source.get('logo')), 'website': http_url(source.get('website')),
        'instagram': http_url(source.get('instagram')), 'facebook': http_url(source.get('facebook')),
        'email': source.get('email') if re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', str(source.get('email') or '')) else None,
        'variant': 'premium' if any(source.get(key) is True for key in ('featured', 'sponsored', 'premium')) else 'standard',
        'expertise': ' · '.join(str(value) for value in source['expertise']) if isinstance(source.get('expertise'), list) else source.get('expertise'),
        'featured': bool(source.get('featured')), 'verified': bool(source.get('verified') or source.get('verification_status') == 'confirmed'),
        'claimed': bool(source.get('claimed')), 'bio': source.get('bio'), 'gallery': source.get('gallery') or [],
        'open24h': urgent,
        'url': f'{BASE}/{prefix}/{entity_slug}/', 'path': f'/{prefix}/{entity_slug}/',
        'share_url': share_url,
        'qr': f'/assets/cards/qr/{prefix}-{entity_slug}.png',
        'indexable': bool(contacts or address or useful_maps), 'source': filename,
        'aliases': list(filter(None, [source.get('nameEn'), source.get('nameAr')])), 'invalid_phones': invalid}


def entities():
    result = []
    for filename, key, default in SOURCES:
        for source in json.loads((ROOT/'data'/filename).read_text())[key]:
            if default == 'doctor' and source.get('status') != 'active':
                continue
            result.append(normalize(source, default, filename))
    assert len({e['path'] for e in result}) == len(result), 'Duplicate permanent path'
    return result


def action(label, href, key, icon, css=''):
    external = ' target="_blank" rel="noopener noreferrer"' if href.startswith('http') else ''
    return f'<a class="vc-action {css}" href="{esc(href)}"{external}><i data-lucide="{icon}" aria-hidden="true"></i><span data-i18n="{key}">{esc(label)}</span></a>'


def page(e):
    asset_version = hashlib.sha256(b''.join((ROOT/path).read_bytes() for path in ('assets/virtual-card.js', 'assets/virtual-card.css', 'assets/business-card.js'))).hexdigest()[:12]
    description = f'{e["name"]} · {e["subtitle"]}. Coordonnées et carte de contact sur Medomicile.'
    title = f'{e["name"]} | Medomicile'
    actions = []
    if e['phones']:
        actions.append(action('Appeler', 'tel:' + e['phones'][0]['number'], 'call', 'phone', 'vc-primary'))
    if e['whatsapp']:
        actions.append(action('WhatsApp', e['whatsapp'], 'whatsapp', 'message-circle', 'vc-whatsapp'))
    if e['google_maps_url']:
        actions.append(action('Itinéraire', e['google_maps_url'], 'directions', 'map-pin'))
    actions.append('<button class="vc-action" id="vc-share" aria-haspopup="dialog"><i data-lucide="share-2" aria-hidden="true"></i><span data-i18n="share">Partager</span></button>')
    rows = []
    for key, label in [('subspecialty', 'Sous-spécialité'), ('establishment', 'Établissement'), ('city', 'Ville'), ('district', 'Quartier'), ('address', 'Adresse'),
                       ('responsible_person', 'Responsable'), ('director', 'Directeur médical'), ('resuscitation_doctor', 'Réanimateur principal')]:
        if e.get(key):
            rows.append(f'<div><dt data-i18n="{key}">{label}</dt><dd>{esc(e[key])}</dd></div>')
    if e['phones']:
        rows.append('<div><dt data-i18n="phone">Téléphone</dt><dd>' + '<br>'.join(f'<a dir="ltr" href="tel:{p["number"]}">{esc(p["label"])}</a>' for p in e['phones']) + '</dd></div>')
    socials = ''.join(action(label, e[key], key, icon) for key, label, icon in [('website', 'Site web', 'globe'), ('instagram', 'Instagram', 'instagram'), ('facebook', 'Facebook', 'facebook')] if e[key])
    data = json.dumps(e, ensure_ascii=False).replace('<', '\\u003c')
    og_image = e['photo'] or LOGO
    if og_image.startswith('/'):
        og_image = BASE + og_image
    return f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(description)}"><meta name="robots" content="{'index' if e['indexable'] else 'noindex'},follow">
<link rel="canonical" href="{e['url']}"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}">
<meta property="og:url" content="{e['url']}"><meta property="og:image" content="{esc(og_image)}"><meta property="og:type" content="website">
<link rel="stylesheet" href="/assets/virtual-card.css?v={asset_version}"><script defer src="/assets/vendor/lucide.min.js"></script><script defer src="/assets/virtual-card.js?v={asset_version}"></script></head>
<body class="vc-page"><header class="vc-header"><a class="vc-brand" href="/"><img src="{LOGO}" alt="" width="40" height="40">Medomicile</a>
<select id="vc-language" aria-label="Langue / Language / اللغة"><option value="fr">Français</option><option value="en">English</option><option value="ar">العربية</option></select></header>
<main class="vc-card" data-variant="{e['variant']}"><div class="vc-identity"><span class="vc-badge" data-i18n="{'partner' if e['variant'] == 'premium' else 'type_' + e['type']}">{'PARTENAIRE MEDOMICILE' if e['variant'] == 'premium' else TYPES[e['type']]}</span>
<img class="vc-photo{' vc-photo--wide' if e['photo'] and e['type'] not in ('doctor', 'dentist') else ''}" src="{esc(e['photo'] or LOGO)}" alt="" width="112" height="112"><h1>{esc(e['name'])}</h1><p class="vc-subtitle">{esc(e['subtitle'])}</p>
{f'<p class="vc-expertise">{esc(e["expertise"])}</p>' if e['expertise'] else ''}
{'<span class="vc-badge vc-badge--urgent" data-i18n="open24h">🚨 URGENCES 24H/24</span>' if e['open24h'] else ''}</div>
<dl class="vc-details">{''.join(rows)}</dl>{f'<p>{esc(e["bio"])}</p>' if e['bio'] else ''}
<div class="vc-actions">{''.join(actions)}</div>
{f'<div class="vc-actions vc-socials">{socials}</div>' if socials else ''}
<section class="vc-qr"><img src="{e['qr']}" width="180" height="180" alt="QR code Medomicile"><div>
<a class="vc-action" href="{e['qr']}" download><i data-lucide="download" aria-hidden="true"></i><span data-i18n="qr">Télécharger le QR code</span></a>
<button class="vc-action" id="vc-print"><i data-lucide="printer" aria-hidden="true"></i><span data-i18n="print">Imprimer</span></button></div></section>
<p class="vc-note" data-i18n="note">Contactez directement le professionnel ou l’établissement pour confirmer les informations.</p></main>
<dialog id="vc-dialog" aria-labelledby="vc-dialog-title"><div class="vc-dialog-head"><h2 id="vc-dialog-title" data-i18n="share">Partager</h2><button class="vc-icon" id="vc-close" aria-label="Fermer" title="Fermer"><i data-lucide="x" aria-hidden="true"></i></button></div>
<img id="vc-business-preview" width="1700" height="1100" alt="Carte Medomicile" hidden>
<div class="vc-share-options"><button class="vc-action" id="vc-share-link"><i data-lucide="share-2" aria-hidden="true"></i><span data-i18n="shareLink">Partager le lien</span></button>
<button class="vc-action vc-primary" id="vc-business"><i data-lucide="download" aria-hidden="true"></i><span data-i18n="business">Télécharger la carte de visite</span></button>
<p id="vc-status" role="status" aria-live="polite"></p><input id="vc-copy-fallback" readonly hidden aria-label="URL Medomicile" value="{e['share_url']}"></div></dialog>
<footer class="vc-footer"><a href="/">medomicile.com</a></footer><script id="vc-data" type="application/json">{data}</script></body></html>'''


def dc1_page(e):
    """Staging-only Canva card; production `page()` remains unchanged."""
    url = e['url']
    description = f'{e["name"]} · {e["subtitle"]}. Coordonnées et carte de contact sur Medomicile.'
    title = f'{e["name"]} | Medomicile'
    phone = e['phones'][0]['number'] if e['phones'] else ''
    maps = e['google_maps_url'] or ''
    profile_url = e['share_url']
    location = ' · '.join(filter(None, [e.get('city'), e.get('district')]))
    initials = ''.join(part[0] for part in re.sub(r'^Dr\\s*', '', e['name'], flags=re.I).split() if part)[:2].upper()
    def button(label, href, primary=False):
        if not href: return ''
        cls = 'primary' if primary else 'secondary'
        external = ' target="_blank" rel="noopener noreferrer"' if href.startswith('http') else ''
        return f'<a class="{cls}" href="{esc(href)}"{external}>{esc(label)}</a>'
    data = json.dumps({'url': url, 'name': e['name'], 'subtitle': e['subtitle'], 'phone': phone, 'address': e.get('address') or ''}, ensure_ascii=False).replace('<', '\\u003c')
    return f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)}</title><meta name="description" content="{esc(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="{esc(url)}"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{esc(url)}"><meta property="og:image" content="{BASE}{LOGO}"><meta property="og:type" content="website"><link rel="stylesheet" href="/assets/virtual-card.css"><style>body{{margin:0;background:#f4f9fc;font-family:Montserrat,Arial,sans-serif;color:#082d4d}}.dc-wrap{{width:min(100%,560px);margin:24px auto;padding:18px 16px 34px}}.dc-brand,.dc-card{{border:1px solid #d5e4ef;border-radius:22px;background:#fff;box-shadow:0 16px 38px #00367918}}.dc-brand{{display:flex;align-items:center;gap:10px;padding:12px 16px;font-weight:800}}.dc-brand img{{width:40px;height:40px}}.dc-card{{margin-top:18px;padding:30px 24px;text-align:center}}.dc-eyebrow{{color:#2161e8;font-size:.65rem;font-weight:800;letter-spacing:.14em}}.dc-avatar{{width:88px;height:88px;display:grid;place-items:center;margin:22px auto 16px;border-radius:26px;color:#fff;background:#2161e8;font-weight:800;font-size:1.4rem}}h1{{margin:0;font:clamp(2.3rem,8vw,3.6rem)/1 'DM Serif Display',Georgia,serif}}.dc-specialty{{color:#2161e8;font-weight:800}}.dc-muted{{color:#61758e;font-size:.78rem;line-height:1.55}}.dc-actions,.dc-share-actions{{display:grid;gap:9px;margin-top:24px}}.dc-actions a,.dc-actions button,.dc-share-actions button{{min-height:46px;display:flex;align-items:center;justify-content:center;border:0;border-radius:11px;font:800 .76rem Montserrat;text-decoration:none;cursor:pointer}}.primary,.dc-share-actions button:first-child{{color:#fff;background:#2161e8}}.secondary,.dc-share-actions button:nth-child(2){{color:#2161e8;border:1px solid #d5e4ef!important;background:#fff}}.dc-share{{margin-top:28px;padding-top:24px;border-top:1px solid #e0ebf3}}.dc-qr{{width:min(240px,100%);aspect-ratio:1;display:grid;place-items:center;margin:18px auto 0;padding:10px;border:1px solid #d5e4ef;border-radius:12px;background:#fff}}.dc-qr[hidden]{{display:none}}.dc-qr svg{{width:100%;height:100%}}.dc-status{{min-height:1.2em;color:#2161e8;font-size:.72rem;font-weight:700}}.dc-profile{{display:block;margin-top:20px;color:#2161e8;font-size:.75rem;font-weight:800;text-decoration:none}}@media(max-width:360px){{.dc-wrap{{padding-inline:10px}}.dc-card{{padding-inline:17px}}}}</style></head><body><main class="dc-wrap"><div class="dc-brand"><img src="{LOGO}" alt="Medomicile" width="40" height="40"><span>Medomicile</span></div><article class="dc-card"><p class="dc-eyebrow">CARTE DIGITALE MEDOMICILE</p><div class="dc-avatar" aria-hidden="true">{esc(initials or 'M')}</div><h1>{esc(e['name'])}</h1><p class="dc-specialty">{esc(e['subtitle'])}</p>{f'<p class="dc-muted">{esc(location)}</p>' if location else ''}{f'<p class="dc-muted">{esc(e["address"])}</p>' if e.get('address') else ''}<div class="dc-actions">{button('Appeler', 'tel:'+phone, True)}{button('Itinéraire', maps)}<button class="secondary" type="button" id="share">Partager</button></div><section class="dc-share"><p class="dc-eyebrow">PARTAGER LA CARTE</p><p class="dc-muted">Ajoutez ce contact ou ouvrez sa carte sur un autre téléphone.</p><div class="dc-share-actions"><button class="primary" type="button" id="qr-toggle">Afficher le QR code</button><button class="secondary" type="button" id="vcard">Ajouter aux contacts</button></div><div class="dc-qr" id="qr" hidden role="img" aria-label="QR code de la carte digitale"></div><p class="dc-status" id="status" role="status" aria-live="polite"></p></section><a class="dc-profile" href="{esc(profile_url)}">Voir la fiche complète →</a></article></main><script src="/assets/vendor/qrcode-generator-1.4.4.js"></script><script id="dc-data" type="application/json">{data}</script><script>(()=>{{const d=JSON.parse(document.getElementById('dc-data').textContent),q=document.getElementById('qr'),s=document.getElementById('status');document.getElementById('qr-toggle').onclick=()=>{{q.hidden=false;q.replaceChildren();try{{const c=qrcode(0,'M');c.addData(d.url);c.make();q.innerHTML=c.createSvgTag({{cellSize:4,margin:16,scalable:true,alt:{{text:'QR code de la carte digitale de '+d.name}}}})}}catch{{q.textContent='QR indisponible. Utilisez « Partager ». '}}}};document.getElementById('share').onclick=async()=>{{if(navigator.share){{try{{await navigator.share({{title:d.name+' — Medomicile',text:d.name+' · '+d.subtitle,url:d.url}});return}}catch(e){{if(e.name==='AbortError')return}}}}try{{await navigator.clipboard.writeText(d.url);s.textContent='Lien copié'}}catch{{s.textContent=d.url}}}};document.getElementById('vcard').onclick=()=>{{const v=['BEGIN:VCARD','VERSION:3.0','FN:'+d.name,d.phone?'TEL;TYPE=WORK,VOICE:'+d.phone:'',d.address?'ADR;TYPE=WORK:;;'+d.address+';;;;':'','URL:'+d.url,'END:VCARD'].filter(Boolean).join('\\r\\n')+'\\r\\n',a=document.createElement('a');a.href=URL.createObjectURL(new Blob([v],{{type:'text/vcard;charset=utf-8'}}));a.download=d.url.split('/p/')[1].replace(/\\/$/,'')+'.vcf';a.click();s.textContent='Contact prêt à enregistrer'}}}})()</script></body></html>'''


def dc41_page(e):
    url = e['url']; phone = e['phones'][0]['number'] if e['phones'] else ''
    maps = e['google_maps_url'] or ''; location = ' · '.join(filter(None, [e.get('city'), e.get('district')]))
    initials = ''.join(part[0] for part in re.sub(r'^Dr\\s*', '', e['name'], flags=re.I).split() if part)[:2].upper()
    title = f'{e["name"]} | Medomicile'; description = f'{e["name"]} · {e["subtitle"]}. Coordonnées et carte de contact sur Medomicile.'
    def action(label, href, cls='secondary'):
        if not href: return ''
        ext = ' target="_blank" rel="noopener noreferrer"' if href.startswith('http') else ''
        return f'<a class="{cls}" href="{esc(href)}"{ext}>{esc(label)}</a>'
    data = json.dumps({'url':url,'name':e['name'],'subtitle':e['subtitle'],'phone':phone,'address':e.get('address') or ''},ensure_ascii=False).replace('<','\\u003c')
    html = '''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>__TITLE__</title><meta name="description" content="__DESCRIPTION__"><meta name="robots" content="index,follow"><link rel="canonical" href="__URL__"><meta property="og:title" content="__TITLE__"><meta property="og:description" content="__DESCRIPTION__"><meta property="og:url" content="__URL__"><meta property="og:image" content="__IMAGE__"><meta property="og:type" content="website"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>:root{--navy:#082d4d;--blue:#2161e8;--muted:#667990;--line:#d7e4ec;--gold:#c9973e}*{box-sizing:border-box}body{margin:0;background:#eef6fa;color:var(--navy);font-family:Montserrat,Arial,sans-serif}.wrap{width:min(100%,430px);margin:0 auto;padding:18px 12px 28px}.card{padding:20px 22px 18px;border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:0 10px 24px #082d4d12}.brand{display:flex;align-items:center;gap:8px;color:var(--navy);font-size:.72rem;font-weight:800}.brand img{width:30px;height:30px;object-fit:contain}.rule{height:2px;margin:17px 0 20px;background:var(--gold)}.eyebrow{margin:0;color:var(--blue);font-size:.58rem;font-weight:800;letter-spacing:.15em}.avatar{width:54px;height:54px;display:grid;place-items:center;margin:15px 0 11px;border-radius:14px;color:#fff;background:var(--navy);font-size:.9rem;font-weight:800}h1{max-width:360px;margin:0;font:clamp(2rem,8vw,3rem)/1.02 'DM Serif Display',Georgia,serif}.specialty{margin:8px 0 0;color:var(--blue);font-size:.82rem;font-weight:800}.location{margin:5px 0 0;color:var(--muted);font-size:.72rem}.address{margin:18px 0 0;padding-top:14px;border-top:1px solid #edf2f5;color:var(--muted);font-size:.72rem;line-height:1.55}.actions,.secondary-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}.actions a,.secondary-actions button{min-height:42px;display:flex;align-items:center;justify-content:center;border-radius:9px;font:800 .68rem Montserrat;text-decoration:none;cursor:pointer}.primary{color:#fff;background:var(--blue)}.secondary{color:var(--blue);border:1px solid #cbdde8;background:#fff}.secondary-actions{margin-top:9px}.secondary-actions button:nth-child(2){color:var(--navy);border-color:transparent;background:#f2f7fa}.qr{width:min(210px,100%);aspect-ratio:1;display:grid;place-items:center;margin:14px auto 0;padding:9px;border:1px solid var(--line);border-radius:10px;background:#fff}.qr[hidden]{display:none}.qr svg{width:100%;height:100%}.status{min-height:1em;margin:8px 0 0;color:var(--blue);font-size:.65rem;font-weight:700;text-align:center}.profile{display:block;margin:18px 0 0;color:var(--blue);font-size:.68rem;font-weight:800;text-align:center;text-decoration:none}.signature{margin:14px 0 0;color:#91a2b1;font-size:.58rem;text-align:center}@media(max-width:340px){.card{padding-inline:16px}h1{font-size:1.85rem}}</style></head><body><main class="wrap"><article class="card"><div class="brand"><img src="__LOGO__" alt="Medomicile" width="30" height="30"><span>Medomicile</span></div><div class="rule"></div><p class="eyebrow">CARTE DIGITALE</p><div class="avatar" aria-hidden="true">__INITIALS__</div><h1>__NAME__</h1><p class="specialty">__SUBTITLE__</p>__LOCATION____ADDRESS__<div class="actions">__CALL____MAPS__</div><div class="secondary-actions"><button class="secondary" type="button" id="vcard">Ajouter aux contacts</button><button class="secondary" type="button" id="share">Partager</button></div><button class="secondary" style="width:100%;margin-top:9px;min-height:38px;border:0;background:#f2f7fa;border-radius:9px;font:800 .65rem Montserrat;color:var(--navy)" type="button" id="qr-toggle">Afficher le QR code</button><div class="qr" id="qr" hidden role="img" aria-label="QR code de la carte digitale"></div><p class="status" id="status" role="status" aria-live="polite"></p><a class="profile" href="__PROFILE__">Voir la fiche complète →</a><p class="signature">Référencé sur Medomicile · __HOST__</p></article></main><script src="/assets/vendor/qrcode-generator-1.4.4.js"></script><script id="dc-data" type="application/json">__DATA__</script><script>(()=>{const d=JSON.parse(document.getElementById('dc-data').textContent),q=document.getElementById('qr'),s=document.getElementById('status');document.getElementById('qr-toggle').onclick=()=>{q.hidden=false;q.replaceChildren();try{const c=qrcode(0,'M');c.addData(d.url);c.make();q.innerHTML=c.createSvgTag({cellSize:4,margin:16,scalable:true,alt:{text:'QR code de la carte digitale de '+d.name}})}catch{q.textContent='QR indisponible'}};document.getElementById('share').onclick=async()=>{if(navigator.share){try{await navigator.share({title:d.name+' — Medomicile',text:d.name+' · '+d.subtitle,url:d.url});return}catch(e){if(e.name==='AbortError')return}}try{await navigator.clipboard.writeText(d.url);s.textContent='Lien copié'}catch{s.textContent=d.url}};document.getElementById('vcard').onclick=()=>{const v=['BEGIN:VCARD','VERSION:3.0','FN:'+d.name,d.phone?'TEL;TYPE=WORK,VOICE:'+d.phone:'',d.address?'ADR;TYPE=WORK:;;'+d.address+';;;;':'','URL:'+d.url,'END:VCARD'].filter(Boolean).join('\\r\\n')+'\\r\\n',a=document.createElement('a');a.href=URL.createObjectURL(new Blob([v],{type:'text/vcard;charset=utf-8'}));a.download=d.url.split('/p/')[1].replace(/\\/$/,'')+'.vcf';a.click();s.textContent='Contact prêt à enregistrer'}}})()</script></body></html>'''
    html = html.replace('<p class="eyebrow">CARTE DIGITALE</p><div class="avatar" aria-hidden="true">__INITIALS__</div><h1>', '<h1>')
    html = html.replace('<div class="secondary-actions"><button class="secondary" type="button" id="vcard">Ajouter aux contacts</button><button class="secondary" type="button" id="share">Partager</button></div><button class="secondary" style="width:100%;margin-top:9px;min-height:38px;border:0;background:#f2f7fa;border-radius:9px;font:800 .65rem Montserrat;color:var(--navy)" type="button" id="qr-toggle">Afficher le QR code</button>', '<div class="secondary-actions"><button type="button" id="vcard" aria-label="Ajouter aux contacts">Ajouter</button><button type="button" id="share" aria-label="Partager la carte">Partager</button><button type="button" id="qr-toggle" aria-label="Afficher le QR code">QR</button></div>')
    html = html.replace('h1{max-width:360px;margin:0;font:clamp(2rem,8vw,3rem)/1.02', 'h1{max-width:360px;margin:0;font:clamp(1.85rem,7vw,2.55rem)/1.04')
    html = html.replace('.secondary-actions{margin-top:9px}.secondary-actions button:nth-child(2){color:var(--navy);border-color:transparent;background:#f2f7fa}', '.secondary-actions{grid-template-columns:repeat(3,1fr);margin-top:14px}.secondary-actions button{min-height:30px;border:0;color:var(--muted);background:transparent;font-size:.62rem}.secondary-actions button:nth-child(2){color:var(--muted);border-color:transparent;background:transparent}')
    html = html.replace('.secondary-actions{grid-template-columns:repeat(3,1fr);margin-top:14px}', '.secondary-actions{grid-template-columns:repeat(3,1fr);margin-top:12px;margin-bottom:-4px}')
    add_icon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>'
    share_icon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.9 7.6-4.7M8.2 13.1l7.6 4.7"/></svg>'
    qr_icon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M18 14h2M14 18h2M18 18h2"/></svg>'
    html = html.replace('>Ajouter</button>', '>' + add_icon + '<span>Ajouter</span></button>').replace('>Partager</button>', '>' + share_icon + '<span>Partager</span></button>').replace('>QR</button>', '>' + qr_icon + '<span>QR</span></button>')
    html = html.replace('.secondary-actions button{min-height:30px;', '.secondary-actions button{min-height:38px;flex-direction:column;gap:3px;')
    replacements = {'__TITLE__': esc(title), '__DESCRIPTION__': esc(description), '__URL__': esc(url), '__IMAGE__': esc(BASE + LOGO), '__LOGO__': esc(LOGO), '__INITIALS__': esc(initials or 'M'), '__NAME__': esc(e['name']), '__SUBTITLE__': esc(e['subtitle']), '__LOCATION__': f'<p class="location">{esc(location)}</p>' if location else '', '__ADDRESS__': f'<p class="address">{esc(e["address"])}</p>' if e.get('address') else '', '__CALL__': action('Appeler', 'tel:' + phone, 'primary'), '__MAPS__': action('Itinéraire', maps), '__PROFILE__': esc(e['share_url']), '__HOST__': esc(urlparse(url).netloc), '__DATA__': data}
    for token, value in replacements.items(): html = html.replace(token, value)
    return html


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--staging', type=Path, help='Write eligible doctor Canva cards only to this temporary directory')
    args = parser.parse_args()
    if args.staging:
        all_items = entities()
        index = json.loads((ROOT/'data/virtual-card-index.json').read_text())
        eligible = {item['slug'] for item in index if item.get('type') == 'doctor' and re.fullmatch(r'https://medomicile\.com/p/[^/]+/', item.get('url', ''))}
        doctors = [item for item in all_items if item['type'] == 'doctor' and item['slug'] in eligible]
        args.staging.mkdir(parents=True, exist_ok=True)
        for item in doctors:
            folder = args.staging / item['slug']; folder.mkdir(parents=True, exist_ok=True)
            (folder/'index.html').write_text(dc41_page(item), encoding='utf-8')
        print(json.dumps({'staged_doctors': len(doctors), 'eligible': len(eligible), 'non_eligible': len([item for item in all_items if item['type'] == 'doctor']) - len(doctors)}))
        return
    items = entities()
    index = json.loads((ROOT/'data/virtual-card-index.json').read_text())
    eligible_doctor_slugs = {item['slug'] for item in index if item.get('type') == 'doctor' and re.fullmatch(r'https://medomicile\.com/p/[^/]+/', item.get('url', ''))}
    for folder in ['assets/cards/qr', 'p', 'e']:
        (ROOT/folder).mkdir(parents=True, exist_ok=True)
    for e in items:
        folder = ROOT/e['path'].strip('/')
        folder.mkdir(parents=True, exist_ok=True)
        rendered = dc41_page(e) if e['type'] == 'doctor' and e['slug'] in eligible_doctor_slugs else page(e)
        (folder/'index.html').write_text(rendered)
        qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=8, border=4)
        qr.add_data(e['share_url']); qr.make(fit=True)
        qr.make_image(fill_color='black', back_color='white').save(ROOT/e['qr'].lstrip('/'))
        if e['type'] in ('doctor', 'dentist'):
            (ROOT/'p'/f'{e["id"]}.html').write_text(rendered)
    (ROOT/'data/virtual-card-index.json').write_text(json.dumps(items, ensure_ascii=False, indent=2) + '\n')
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += ''.join(f'<url><loc>{e["url"]}</loc></url>\n' for e in items if e['indexable']) + '</urlset>\n'
    (ROOT/'sitemap-cards.xml').write_text(sitemap)
    report = {'counts': dict(Counter(e['type'] for e in items)), 'total': len(items),
              'indexable': sum(e['indexable'] for e in items), 'invalid_phones': [
                  {'name': e['name'], 'source': e['source'], 'values': e['invalid_phones']} for e in items if e['invalid_phones']]}
    (ROOT/'data/virtual-card-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()

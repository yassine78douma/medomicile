#!/usr/bin/env python3
"""One engine: canonical JSON -> static cards, local QR, vCards, directory index."""
import html
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
    return {'id': ident, 'slug': entity_slug, 'type': kind, 'name': source['name'], 'subtitle': subtitle,
        'subspecialty': source.get('subspecialty'), 'city': source.get('city'), 'district': source.get('district') or source.get('sector'),
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
        'open24h': bool(source.get('open24h') and source.get('verifiedHours')),
        'url': f'{BASE}/{prefix}/{entity_slug}/', 'path': f'/{prefix}/{entity_slug}/',
        'qr': f'/assets/cards/qr/{prefix}-{entity_slug}.png', 'vcard': f'/contacts/{prefix}-{entity_slug}.vcf',
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


def vc_escape(value):
    return str(value or '').replace('\\', '\\\\').replace('\r\n', '\n').replace('\r', '\n').replace('\n', '\\n').replace(';', '\\;').replace(',', '\\,')


def vcard(e):
    name = vc_escape(e['name'])
    # Preserve FN; the sources do not provide structured family/given names.
    lines = ['BEGIN:VCARD', 'VERSION:3.0', f'N:;{name};;;', f'FN:{name}']
    if e['type'] not in ('doctor', 'dentist'):
        lines.append(f'ORG:{name}')
    lines.append('TITLE:' + vc_escape(e['subtitle']))
    lines.extend('TEL;TYPE=WORK,VOICE:' + p['number'] for p in e['phones'])
    if e['address'] or e['district'] or e['city']:
        lines.append('ADR;TYPE=WORK:;;' + vc_escape(e['address'] or e['district']) + ';' + vc_escape(e['city']) + ';;;')
    if e['email']:
        lines.append('EMAIL;TYPE=WORK:' + e['email'])
    if e['responsible_person']:
        lines.append('NOTE:' + vc_escape('Responsable : ' + e['responsible_person']))
    lines += ['URL:' + e['url'], 'END:VCARD']
    folded = []
    for line in lines:
        chunk = ''
        for char in line:
            if len((chunk + char).encode('utf-8')) > 75:
                folded.append(chunk)
                chunk = ' '
            chunk += char
        folded.append(chunk)
    return '\r\n'.join(folded) + '\r\n'


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
    for key, label in [('subspecialty', 'Sous-spécialité'), ('city', 'Ville'), ('district', 'Quartier'), ('address', 'Adresse'),
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
{'<span class="vc-badge" data-i18n="open24h">24h/24</span>' if e['open24h'] else ''}</div>
<dl class="vc-details">{''.join(rows)}</dl>{f'<p>{esc(e["bio"])}</p>' if e['bio'] else ''}
<div class="vc-actions">{''.join(actions)}</div>
<a class="vc-action vc-save" href="{e['vcard']}" download><i data-lucide="contact" aria-hidden="true"></i><span data-i18n="save">Enregistrer le contact</span></a>
{f'<div class="vc-actions vc-socials">{socials}</div>' if socials else ''}
<section class="vc-qr"><img src="{e['qr']}" width="180" height="180" alt="QR code Medomicile"><div>
<a class="vc-action" href="{e['qr']}" download><i data-lucide="download" aria-hidden="true"></i><span data-i18n="qr">Télécharger le QR code</span></a>
<button class="vc-action" id="vc-print"><i data-lucide="printer" aria-hidden="true"></i><span data-i18n="print">Imprimer</span></button></div></section>
<p class="vc-note" data-i18n="note">Contactez directement le professionnel ou l’établissement pour confirmer les informations.</p></main>
<dialog id="vc-dialog" aria-labelledby="vc-dialog-title"><div class="vc-dialog-head"><h2 id="vc-dialog-title" data-i18n="share">Partager</h2><button class="vc-icon" id="vc-close" aria-label="Fermer" title="Fermer"><i data-lucide="x" aria-hidden="true"></i></button></div>
<img id="vc-business-preview" width="1700" height="1100" alt="Carte Medomicile" hidden>
<div class="vc-share-options"><button class="vc-action" id="vc-share-link"><i data-lucide="share-2" aria-hidden="true"></i><span data-i18n="shareLink">Partager le lien</span></button>
<button class="vc-action vc-primary" id="vc-business"><i data-lucide="download" aria-hidden="true"></i><span data-i18n="business">Télécharger la carte de visite</span></button>
<p id="vc-status" role="status" aria-live="polite"></p><input id="vc-copy-fallback" readonly hidden aria-label="URL Medomicile" value="{e['url']}"></div></dialog>
<footer class="vc-footer"><a href="/">medomicile.com</a></footer><script id="vc-data" type="application/json">{data}</script></body></html>'''


def main():
    items = entities()
    for folder in ['assets/cards/qr', 'contacts', 'p', 'e']:
        (ROOT/folder).mkdir(parents=True, exist_ok=True)
    for e in items:
        folder = ROOT/e['path'].strip('/')
        folder.mkdir(parents=True, exist_ok=True)
        (folder/'index.html').write_text(page(e))
        (ROOT/e['vcard'].lstrip('/')).write_bytes(vcard(e).encode('utf-8'))
        qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=8, border=4)
        qr.add_data(e['url']); qr.make(fit=True)
        qr.make_image(fill_color='black', back_color='white').save(ROOT/e['qr'].lstrip('/'))
        if e['type'] in ('doctor', 'dentist'):
            (ROOT/'p'/f'{e["id"]}.html').write_text(page(e))
            (ROOT/'contacts'/f'{e["id"]}.vcf').write_bytes(vcard(e).encode('utf-8'))
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

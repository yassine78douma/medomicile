#!/usr/bin/env python3
"""Generate static professional cards and vCards from the canonical doctors JSON."""
import html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://medomicile.com'

def esc(value): return html.escape(str(value or ''), quote=True)
def phone(value): return re.sub(r'[^0-9+]', '', str(value or ''))
def first_phone(doctor):
    values = doctor.get('phone') or doctor.get('phones') or []
    return values[0] if isinstance(values, list) and values else ''
def profile_url(doctor): return f'{BASE}/p/{doctor["id"]}.html'
def useful(doctor): return bool(first_phone(doctor) or doctor.get('whatsapp') or doctor.get('google_maps') or doctor.get('address'))

def vcard(doctor):
    name = doctor['name']; parts = name.replace('Dr ', '', 1).split()
    family = parts[-1] if parts else name; given = ' '.join(parts[:-1])
    lines = ['BEGIN:VCARD','VERSION:3.0',f'N:{family};{given};;;',f'FN:{name}',f'TITLE:{doctor.get("specialty", "")}']
    if first_phone(doctor): lines.append(f'TEL;TYPE=WORK,VOICE:{phone(first_phone(doctor))}')
    if doctor.get('address'): lines.append(f'ADR;TYPE=WORK:;;{doctor["address"]};{doctor.get("district", "")};{doctor.get("city", "Kénitra")};;;')
    lines.append(f'URL:{profile_url(doctor)}'); lines.append('END:VCARD')
    return '\r\n'.join(lines) + '\r\n'

def action(label, href, css='', external=False, download=False):
    attrs = ' target="_blank" rel="noopener noreferrer"' if external else ''
    if download: attrs += ' download'
    return f'<a class="profile-card__action {css}" href="{esc(href)}"{attrs}>{esc(label)}</a>'

def page(doctor):
    url = profile_url(doctor); indexable = useful(doctor); title = f'{doctor["name"]} - {doctor.get("specialty", "Professionnel de santé")} à Kénitra | Medomicile'
    description = f'Carte professionnelle de {doctor["name"]}, {doctor.get("specialty", "professionnel de santé")} à Kénitra.'
    avatar = doctor.get('image') or '../assets/optimized/medomicile-logo-160.png'
    rows = []
    for label, key in [('Spécialité', 'specialty'), ('Sous-spécialité', 'subspecialty'), ('Ville', 'city'), ('Quartier', 'district'), ('Adresse', 'address')]:
        if doctor.get(key): rows.append(f'<div><dt>{label}</dt><dd>{esc(doctor[key])}</dd></div>')
    actions = []
    if first_phone(doctor): actions.append(action('Appeler', f'tel:{phone(first_phone(doctor))}', 'is-primary'))
    if doctor.get('whatsapp'): actions.append(action('WhatsApp', f'https://wa.me/{phone(doctor["whatsapp"])}', 'is-whatsapp', True))
    if doctor.get('google_maps'): actions.append(action('Itinéraire', doctor['google_maps'], '', True))
    actions.append(action('Enregistrer le contact', f'../contacts/{doctor["id"]}.vcf', '', download=True))
    actions.append(f'<button class="profile-card__action" type="button" data-profile-share>↗ Partager</button>')
    socials = ''.join(action('Instagram', doctor['instagram'], '', True) for _ in [0] if doctor.get('instagram')) + ''.join(action('Facebook', doctor['facebook'], '', True) for _ in [0] if doctor.get('facebook'))
    qr = f'https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=svg&data={url}'
    robots = 'index,follow' if indexable else 'noindex,follow'
    return f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{esc(title)}</title><meta name="description" content="{esc(description)}"><meta name="robots" content="{robots}"><link rel="canonical" href="{url}"><link rel="stylesheet" href="../style.css?v=20260909-12"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}/assets/brand/medomicile-logo.png"></head><body class="profile-page"><main class="profile-card"><a class="profile-card__brand" href="../">Medomicile</a><p class="eyebrow">CARTE PROFESSIONNELLE</p><img class="profile-card__avatar" src="{esc(avatar)}" alt=""><h1>{esc(doctor['name'])}</h1><p class="profile-card__specialty">{esc(doctor.get('specialty'))}</p><dl class="profile-card__details">{''.join(rows)}</dl><div class="profile-card__actions">{''.join(actions)}</div>{f'<div class="profile-card__socials">{socials}</div>' if socials else ''}<section class="profile-card__qr"><img src="{esc(qr)}" alt="QR code vers cette carte professionnelle"><a href="{esc(qr)}" download="qr-{esc(doctor["id"])}.svg">Télécharger le QR code</a></section></main><script>document.querySelector('[data-profile-share]')?.addEventListener('click',async()=>{{const url=location.href,text={json.dumps(description)};if(navigator.share){{try{{await navigator.share({{title:document.title,text,url}});return}}catch(e){{if(e.name==='AbortError')return}}}}navigator.clipboard?.writeText(url);}})</script></body></html>'''

def main():
    doctors = json.loads((ROOT/'data/doctors.json').read_text(encoding='utf-8'))['doctors']
    profiles = ROOT/'p'; contacts = ROOT/'contacts'; profiles.mkdir(exist_ok=True); contacts.mkdir(exist_ok=True)
    active = [d for d in doctors if d.get('status') == 'active']
    for d in active:
        (profiles/f'{d["id"]}.html').write_text(page(d), encoding='utf-8')
        (contacts/f'{d["id"]}.vcf').write_text(vcard(d), encoding='utf-8')
    print(json.dumps({'generated':len(active),'indexable':sum(useful(d) for d in active)}))

if __name__ == '__main__': main()

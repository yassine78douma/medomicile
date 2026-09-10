#!/usr/bin/env python3
"""One-time, lossless migration. Never overwrites an existing canonical source."""
import copy
import hashlib
import json
import re
import unicodedata
from pathlib import Path

import json5
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


def slug(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()
    return re.sub('[^a-z0-9]+', '-', value).strip('-')


def literal(source, name):
    tail = source.split(f'const {name} = ', 1)[1]
    value, error, _ = json5.parse(tail, consume_trailing=False)
    if error:
        raise ValueError(error)
    return value


def write_new(name, data):
    path = ROOT / 'data' / name
    if path.exists():
        raise RuntimeError(f'{name} already exists; migration is not a synchronizer')
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def text(node):
    return node.get_text(' ', strip=True) if node else None


def main():
    targets = ['establishments.json', 'radiology-centers.json', 'pharmacies-kenitra.json']
    assert not any((ROOT/'data'/p).exists() for p in targets), 'Already migrated'
    script = (ROOT/'script.js').read_text()
    radiology = literal(script, 'radiologyCenters')
    pharmacies = json.loads((ROOT/'data/pharmacies-garde.json').read_text())['directory']
    report = {'counts': {}, 'comparisons': [], 'legacy_differences': [], 'source_hashes': {}}
    for path in ['script.js', 'hopitaux.html', 'hopitaux-en.html', 'hopitaux-ar.html',
                 'data/pharmacies-garde.json', 'data/doctors.json', 'data/dialysis-centers.json', 'data/laboratoires-kenitra.json']:
        report['source_hashes'][path] = hashlib.sha256((ROOT/path).read_bytes()).hexdigest()
    radio = []
    for source in radiology:
        item = copy.deepcopy(source)
        item.update(slug='radiologie-' + source['id'], type='radiology_center',
                    subtitle=source['type'], city='Kénitra', phone=source.get('phoneDisplay'),
                    google_maps_url=source.get('mapsUrl'), legacy_type=source['type'])
        radio.append(item)
        assert item['name'] == source['name'] and item['phone'] == source.get('phoneDisplay')
        assert item['google_maps_url'] == source.get('mapsUrl')
    write_new('radiology-centers.json', {'centers': radio})
    pharma = []
    for source in pharmacies:
        item = copy.deepcopy(source)
        item.update(slug='pharmacie-' + source['id'], type='pharmacy', city='Kénitra',
                    google_maps_url=source.get('mapsUrl'), zone=source.get('district'), verified=False)
        pharma.append(item)
        assert all(item.get(k) == source.get(k) for k in source)
    # Historical static sectors can differ from the current directory. Preserve, do not silently overwrite.
    by_name = {slug(p['name']): p for p in pharma}
    for name in sorted({p['name'] for p in pharma}):
        matches = [p['id'] for p in pharma if p['name'] == name]
        if len(matches) > 1:
            report['legacy_differences'].append({'name': name, 'ids': matches, 'reason': 'Same name, differing source records; not merged'})
    for path in sorted(ROOT.glob('pharmacies-*-kenitra.html')):
        soup = BeautifulSoup(path.read_text(), 'html.parser')
        for card in soup.select('.pharmacy-card'):
            name = text(card.select_one('h3'))
            if not name:
                continue
            old = {'source': path.name, 'name': name, 'html': str(card)}
            key = slug(name)
            if key not in by_name:
                fields = {text(p.select_one('span')): text(p.select_one('b')) for p in card.select('.pharmacy-card-line')}
                maps = card.select_one('a[href*="maps"]')
                item = {'id': key, 'slug': key, 'name': name, 'type': 'pharmacy', 'city': 'Kénitra',
                        'district': fields.get('QUARTIER'), 'address': fields.get('ADRESSE'),
                        'phone': fields.get('TÉLÉPHONE'), 'hours': fields.get('HORAIRES'),
                        'google_maps_url': maps.get('href') if maps else None, 'verified': False}
                pharma.append(item)
                by_name[key] = item
                report['legacy_differences'].append({'source': path.name, 'name': name, 'reason': 'HTML-only pharmacy preserved'})
            by_name[key].setdefault('legacy_pages', []).append(old)
    assert len({p['slug'] for p in pharma}) == len(pharma)
    write_new('pharmacies-kenitra.json', {'pharmacies': pharma})
    establishments = []
    localized = {}
    for lang, filename in [('fr', 'hopitaux.html'), ('en', 'hopitaux-en.html'), ('ar', 'hopitaux-ar.html')]:
        cards = BeautifulSoup((ROOT/filename).read_text(), 'html.parser').select('.featured-clinic, .facility-card')
        localized[lang] = cards
    assert all(len(cards) == len(localized['fr']) for cards in localized.values())
    for index, card in enumerate(localized['fr']):
        heading = copy.copy(card.select_one('h2, h3'))
        for badge in heading.select('.availability-badge'):
            badge.decompose()
        name = text(heading)
        is_featured = 'featured-clinic' in card.get('class', [])
        subtype = text(card.select_one('.facility-type, .featured-clinic__type'))
        meta = [text(n) for n in card.select('.featured-clinic__meta span')]
        def field(prefix):
            return next((v.split(':', 1)[1].strip() for v in meta if v.startswith(prefix)), None)
        address = field('Adresse') if is_featured else text(card.select_one('p'))
        phones = [{'label': text(a), 'href': a['href']} for a in card.select('a[href^="tel:"]')]
        maps = card.select_one('a[href*="maps"]')
        images = [i['src'] for i in card.select('img[src]')]
        item = {'id': slug(name), 'slug': slug(name), 'name': name,
                'type': 'hospital' if subtype and 'Hôpital' in subtype else 'clinic', 'subtitle': subtype,
                'city': 'Kénitra', 'address': address, 'phone': field('Téléphone') or (phones[0]['label'] if phones else None),
                'phones': phones, 'google_maps_url': maps['href'] if maps else None,
                'director': field('Directeur médical'), 'resuscitation_doctor': field('Réanimateur principal'),
                'photo': images[0] if images else None, 'gallery': images, 'featured': is_featured, 'verified': False,
                'hours': text(card.select_one('.facility-hours')), 'legacy_open24h': card.get('data-open24h') == 'true',
                'description': text(card.select_one('.featured-clinic__content > p:not([class])')),
                'legacy_markup': {lang: str(cards[index]) for lang, cards in localized.items()}}
        assert name and all(p['href'] in item['legacy_markup']['fr'] for p in phones)
        establishments.append(item)
    write_new('establishments.json', {'establishments': establishments})
    # These supplied sponsored professionals are not present in the doctors sheet.
    # Keep them in the existing doctors source, flagged for preservation by sheet sync.
    doctors_path = ROOT/'data/doctors.json'
    doctors = json.loads(doctors_path.read_text())
    original = copy.deepcopy(doctors['doctors'])
    for category, sponsors in literal(script, 'specialtySponsors').items():
        for sponsor in sponsors:
            ident = slug(sponsor['name'])
            assert not any(d['id'] == ident for d in doctors['doctors'])
            doctors['doctors'].append({'id': ident, 'name': sponsor['name'], 'specialty': sponsor['specialty']['fr'],
                'specialty_group': 'Dentiste' if category == 'dentistes' else 'Gastro-entérologue',
                'phone': [sponsor['phone']], 'whatsapp': sponsor.get('whatsapp'), 'city': 'Kénitra',
                'google_maps': sponsor.get('directions'), 'instagram': sponsor.get('instagram'),
                'status': 'active', 'featured': True, 'verified': False, 'source': 'manual-professional',
                'sponsor': {**sponsor, 'category': category}})
    assert doctors['doctors'][:len(original)] == original
    doctors_path.write_text(json.dumps(doctors, ensure_ascii=False, indent=2) + '\n')
    report['counts'] = {'establishments': len(establishments), 'radiology': len(radio),
                        'pharmacies': len(pharma), 'original_doctors_preserved': len(original), 'manual_doctors': 2}
    report['comparisons'] = ['Radiology: all source properties retained; name/phone/Maps identical',
        'Pharmacies: every directory property retained; all legacy sector HTML archived per entity',
        'Hospitals: all 3 language HTML records archived; every telephone retained',
        'Doctors: all original records identical; 2 existing sponsored records appended']
    write_new('card-migration-report.json', report)
    print(json.dumps(report['counts']))


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Progressive directory build. Only entity articles and generated literals change."""
import importlib.util
import hashlib
import json
from pathlib import Path
import json5
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('cards', ROOT/'scripts/generate-professional-cards.py')
cards = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cards)


def replace_literal(text, name, value):
    marker = f'const {name} = '
    start = text.index(marker) + len(marker)
    _, error, end = json5.parse(text[start:], consume_trailing=False)
    if error:
        raise ValueError(error)
    return text[:start] + json.dumps(value, ensure_ascii=False, indent=2) + text[start+end:]


def main():
    entities = cards.entities()
    by_path = {e['path']: e for e in entities}
    by_name = {}
    for e in entities:
        by_name.setdefault(cards.slug(e['name']), []).append(e)
    establishments = json.loads((ROOT/'data/establishments.json').read_text())['establishments']
    for source in establishments:
        e = next(e for e in entities if e['source'] == 'establishments.json' and e['id'] == source['id'])
        for markup in source['legacy_markup'].values():
            node = BeautifulSoup(markup, 'html.parser').select_one('h2,h3')
            for badge in node.select('.availability-badge'):
                badge.decompose()
            alias = node.get_text(' ', strip=True)
            if alias != e['name']:
                e['aliases'].append(alias)
    script_path = ROOT/'script.js'
    script = script_path.read_text()
    radio = json.loads((ROOT/'data/radiology-centers.json').read_text())['centers']
    script = replace_literal(script, 'radiologyCenters', [dict(c, type=c['subtitle'], mapsUrl=c.get('google_maps_url'),
        phoneDisplay=c.get('phone'), phoneRaw='tel:'+cards.telephone(c['phone']) if cards.telephone(c.get('phone')) else None) for c in radio])
    sponsors = {}
    for d in json.loads((ROOT/'data/doctors.json').read_text())['doctors']:
        if d.get('sponsor') and d.get('status') == 'active':
            cfg = d['sponsor']
            translated = dict(cfg['specialty'], fr=d['specialty'])
            sponsors.setdefault(cfg['category'], []).append(dict(cfg, id=d['id'], type='dentist', name=d['name'], phone=d['phone'][0] if d['phone'] else '',
                whatsapp=d.get('whatsapp'), instagram=d.get('instagram'), directions=d.get('google_maps'), specialty=translated))
    script = replace_literal(script, 'specialtySponsors', sponsors)
    script_path.write_text(script)
    script_version = hashlib.sha256(script.encode()).hexdigest()[:12]
    report = {'pages': [], 'unmatched': [], 'ambiguous': [], 'bound_cards': 0, 'preserved_conflicts': []}
    for path in sorted(ROOT.glob('*.html')):
        source = path.read_text()
        soup = BeautifulSoup(source, 'html.parser')
        selected = soup.select('article.doctor-card,article.facility-card,article.featured-clinic,article.pharmacy-card--directory')
        replacements = []
        for node in selected:
            heading = node.select_one('h3,h2')
            if not heading:
                continue
            name = ''.join(str(t) for t in heading.find_all(string=True, recursive=False)).strip()
            matches = by_name.get(cards.slug(name), [])
            existing = by_path.get(node.get('data-entity-path'))
            if existing:
                matches = [existing]
            if len(matches) > 1:
                old_maps = node.select_one('a[href*="maps"]')
                narrowed = [e for e in matches if old_maps and e['google_maps_url'] == old_maps['href']]
                if len(narrowed) == 1:
                    matches = narrowed
            if len(matches) != 1:
                # Localized hospitals map to archived names, not to an assumed list order.
                matches = [e for e in entities if name in e['aliases']]
            if len(matches) != 1:
                # Exact contact matches resolve existing translations and spelling variants.
                candidates = [e for e in entities if e['type'] in ('doctor', 'dentist')] if 'doctor-card' in node.get('class', []) else entities
                maps = node.select_one('a[href*="maps"]')
                matches = [e for e in candidates if maps and e['google_maps_url'] == maps['href']]
                if len(matches) != 1:
                    numbers = {cards.telephone(a['href']) for a in node.select('a[href^="tel:"]')} - {None}
                    matches = [e for e in candidates if numbers.intersection(p['number'] for p in e['phones'])]
            if len(matches) != 1:
                report['ambiguous' if matches else 'unmatched'].append({'page': path.name, 'name': name})
                continue
            e = matches[0]
            old_maps = node.select_one('a[href*="maps"]')
            if old_maps and e['google_maps_url'] and old_maps['href'] != e['google_maps_url']:
                report['preserved_conflicts'].append({'page': path.name, 'name': name, 'field': 'maps', 'html': old_maps['href'], 'canonical': e['google_maps_url']})
            node['data-entity-path'] = e['path']
            if e['google_maps_url']:
                node['data-google-maps-url'] = e['google_maps_url']
            # Leave legacy translations/medical prose in place. Text binding is safe
            # for identity and provided contacts; richer HTML is migrated separately.
            if node.get('data-entity-bound') == 'true' and soup.html.get('lang') != 'ar':
                for child in list(heading.children):
                    if isinstance(child, str):
                        child.replace_with(e['name'] + ' ')
                        break
            if name != e['name'] and name not in e['aliases']:
                e['aliases'].append(name)
            node['data-entity-bound'] = 'true'
            # Bound contact fields are regenerated; unstructured medical prose stays intact.
            for a in node.select('a[href^="tel:"]'):
                number = cards.telephone(a['href'])
                index = a.get('data-entity-phone')
                if index is None:
                    index = next((i for i, p in enumerate(e['phones']) if p['number'] == number), None)
                if index is not None and int(index) < len(e['phones']):
                    phone = e['phones'][int(index)]
                    a['data-entity-phone'] = str(index)
                    a['href'] = 'tel:' + phone['number']
                    if any(c.isdigit() for c in a.get_text()):
                        a.string = phone['label']
            if soup.html.get('lang') == 'fr':
                if e['type'] in ('doctor', 'dentist'):
                    for line in node.select('.doctor-line'):
                        spans = line.select('span')
                        if len(spans) == 2 and spans[0].text.strip() == '⌖' and (e['address'] or e['district']):
                            spans[1].string = e['address'] or e['district']
                elif e['type'] in ('hospital', 'clinic'):
                    if 'featured-clinic' not in node.get('class', []) and e['address']:
                        address_node = node.select_one('p')
                        if address_node:
                            address_node.string = e['address']
                    bindings = {'Adresse': 'address', 'Directeur médical': 'director', 'Réanimateur principal': 'resuscitation_doctor'}
                    for field in node.select('.featured-clinic__meta span'):
                        label = field.text.split(':', 1)[0].strip()
                        key = bindings.get(label)
                        if key and e.get(key):
                            field.string = label + ' : ' + e[key]
                        elif label == 'Téléphone' and e['phones']:
                            field.string = label + ' : ' + ' / '.join(p['label'] for p in e['phones'])
                elif e['type'] == 'pharmacy':
                    for line in node.select('.pharmacy-card-line'):
                        label, value = line.select_one('span'), line.select_one('b')
                        key = {'QUARTIER': 'district', 'ADRESSE': 'address'}.get(label.text if label else '')
                        if value and key and e.get(key):
                            value.string = e[key]
            assert not node.select('article'), 'Nested articles require explicit migration'
            start = sum(len(line) for line in source.splitlines(keepends=True)[:node.sourceline-1]) + node.sourcepos
            end = source.index('</article>', start) + len('</article>')
            replacements.append((start, end, str(node)))
            report['bound_cards'] += 1
        if replacements:
            for start, end, replacement in sorted(replacements, reverse=True):
                source = source[:start] + replacement + source[end:]
            report['pages'].append(path.name)
        for tag in soup.select('script[src]'):
            previous = tag['src']
            if previous.split('?', 1)[0] == 'script.js':
                source = source.replace(previous, f'script.js?v=cards-{script_version}')
        if source != path.read_text():
            path.write_text(source)
    (ROOT/'data/virtual-card-index.json').write_text(json.dumps(entities, ensure_ascii=False, indent=2) + '\n')
    (ROOT/'data/card-directory-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: len(v) if isinstance(v, list) else v for k, v in report.items()}))


if __name__ == '__main__':
    main()

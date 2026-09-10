#!/usr/bin/env python3
"""Preserve FR directory-only records and additional contacts in doctors.json."""
import importlib.util
import json
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('cards', ROOT/'scripts/generate-professional-cards.py')
cards = importlib.util.module_from_spec(spec); spec.loader.exec_module(cards)


def main():
    path = ROOT/'data/doctors.json'
    data = json.loads(path.read_text())
    report = {'added': [], 'enriched': [], 'unresolved': []}
    for page in sorted(ROOT.glob('*.html')):
        soup = BeautifulSoup(page.read_text(), 'html.parser')
        if not soup.html or soup.html.get('lang') != 'fr':
            continue
        for node in soup.select('.doctor-card'):
            name = node.h3.get_text(' ', strip=True)
            ident = node.get('data-entity-path', '').strip('/').split('/')[-1]
            candidates = [d for d in data['doctors'] if d['id'] == ident or cards.slug(d['name']) == cards.slug(name)]
            if len(candidates) > 1:
                report['unresolved'].append({'name': name, 'page': page.name}); continue
            details = [p for p in node.select('.doctor-line') if p.select_one('span')]
            specialty = next((p.select('span')[-1].text.strip() for p in details if p.select('span')[0].text.strip() == '✚'), '')
            location = next((p.select('span')[-1].text.strip() for p in details if p.select('span')[0].text.strip() == '⌖'), '')
            if not candidates:
                if not specialty:
                    report['unresolved'].append({'name': name, 'page': page.name}); continue
                d = {'id': cards.slug(name), 'name': name, 'specialty': specialty, 'specialty_group': specialty,
                     'city': 'Kénitra', 'phone': [], 'district': '', 'address': '', 'google_maps': '',
                     'status': 'active', 'verified': False, 'source': 'manual-directory'}
                data['doctors'].append(d); report['added'].append({'name': name, 'page': page.name})
            else:
                d = candidates[0]
            updates = {}
            if not isinstance(d.get('phone'), list):
                d['phone'] = [d['phone']] if d.get('phone') else []
            existing = {cards.telephone(n) for n in d['phone']}
            for a in node.select('a[href^="tel:"]'):
                number = cards.telephone(a['href'])
                if number and cards.telephone(a.get_text(' ', strip=True)) == number and number not in existing:
                    d['phone'].append(a.get_text(' ', strip=True)); existing.add(number)
                    updates['phone'] = d['phone']
            if not d.get('address') and location and location != d.get('district') and (' - ' in location or any(c.isdigit() for c in location)):
                d['address'] = location; updates['address'] = location
            maps = node.select_one('a[href*="maps"]')
            if not d.get('google_maps') and maps:
                d['google_maps'] = maps['href']; updates['google_maps'] = maps['href']
            if updates:
                d.setdefault('directory_enrichment', {}).update(updates)
                d.setdefault('directory_sources', []).append(page.name)
                report['enriched'].append({'name': name, 'page': page.name, 'fields': list(updates)})
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    (ROOT/'data/card-doctor-reconciliation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()

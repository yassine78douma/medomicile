#!/usr/bin/env python3
"""Import the editable specialist workbook into the site's canonical JSON data."""
import argparse, datetime, json, re, unicodedata, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def clean(value): return re.sub(r'\s+', ' ', str(value or '')).strip()
def norm(value):
    return ''.join(c for c in unicodedata.normalize('NFD', clean(value).lower()) if unicodedata.category(c) != 'Mn')
def slug(value):
    value = norm(value).replace('œ','oe')
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', value)) or 'doctor'
def phones(value): return [clean(x) for x in re.split(r'\s*[|;/]\s*', clean(value)) if clean(x)]
def specialty_group(value):
    s = norm(value)
    if 'neuro' in s: return 'Neurologie et neurochirurgie'
    if 'cardio' in s: return 'Cardiologie'
    if 'traumato' in s or 'ortho' in s: return 'Traumatologie et orthopédie'
    if 'gastro' in s: return 'Gastro-entérologie'
    if 'ophtalmo' in s: return 'Ophtalmologie'
    if 'rhumato' in s: return 'Rhumatologie'
    if 'urolog' in s: return 'Urologie'
    if 'intern' in s: return 'Médecine interne'
    return clean(value)

def xlsx_rows(path):
    with zipfile.ZipFile(path) as book:
        root = ET.fromstring(book.read('xl/sharedStrings.xml'))
        shared = [''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])) for si in root.findall('m:si', NS)]
        sheet = ET.fromstring(book.read('xl/worksheets/sheet1.xml'))
        rows = []
        for row in sheet.findall('.//m:sheetData/m:row', NS):
            values = {}
            for cell in row.findall('m:c', NS):
                ref = re.match(r'([A-Z]+)', cell.get('r', 'A1')).group(1)
                col = 0
                for char in ref: col = col * 26 + ord(char) - 64
                value = cell.find('m:v', NS)
                text = '' if value is None else (shared[int(value.text)] if cell.get('t') == 's' else value.text)
                values[col - 1] = text
            rows.append([values.get(i, '') for i in range(max(values, default=-1) + 1)])
        return rows

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source', nargs='?', default='médecin spécialiste kenitra.xlsx')
    ap.add_argument('--allow-mass-replacement', action='store_true')
    args = ap.parse_args()
    rows = xlsx_rows(ROOT / args.source)
    header = [norm(x) for x in rows[0]]
    required = {'dr. prenom nom': 0, 'specialite': 1, 'ville': 2, 'quartier': 3, 'numero de telephone': 4, 'google maps': 5, 'instagram': 6, 'facebook': 7}
    for key, index in required.items():
        if index >= len(header) or header[index] != key: raise SystemExit(f'En-tête inattendu: colonne {index + 1}')
    doctors, current_specialty, used = [], '', set()
    for line, row in enumerate(rows[1:], 2):
        name = clean(row[0] if len(row) > 0 else '')
        if not name: current_specialty = clean(row[1] if len(row) > 1 else '') or current_specialty; continue
        specialty = clean(row[1] if len(row) > 1 else '') or current_specialty
        if not specialty: raise SystemExit(f'Ligne {line}: spécialité manquante')
        base = slug(name)
        ident = base
        if ident in used: ident = f'{base}-{slug(specialty)}'
        n = 2
        while ident in used: ident = f'{base}-{n}'; n += 1
        used.add(ident)
        raw_phone = clean(row[4] if len(row) > 4 else '')
        p = phones(raw_phone)
        doctors.append({'id': ident, 'name': name, 'title': 'Dr', 'specialty': specialty,
          'specialty_group': specialty_group(specialty), 'sub_specialty': '', 'city': clean(row[2] if len(row)>2 else '') or 'Kénitra',
          'district': clean(row[3] if len(row)>3 else ''), 'address': '', 'phone': raw_phone, 'phones': p, 'whatsapp': '',
          'google_maps': clean(row[5] if len(row)>5 else ''), 'instagram': clean(row[6] if len(row)>6 else ''),
          'facebook': clean(row[7] if len(row)>7 else ''), 'status': 'active', 'verified': False, 'featured': False})
    old_path = ROOT / 'data/doctors.json'
    old = json.loads(old_path.read_text()) if old_path.exists() else {'doctors': []}
    old_names = {norm(d.get('name')) for d in old.get('doctors', [])}
    overlap = sum(norm(d['name']) in old_names for d in doctors)
    if old_names and overlap < len(old_names) * .8 and not args.allow_mass_replacement:
        raise SystemExit(f'Remplacement refusé: {overlap}/{len(old_names)} anciens médecins retrouvés; utilisez --allow-mass-replacement après vérification.')
    name_map = {}
    phone_map = {}
    specialty_map = {}
    for d in doctors:
        keys = [name_map.setdefault(norm(d['name']), []), specialty_map.setdefault((norm(d['name']), norm(d['specialty'])), [])]
        keys[0].append(d['id']); keys[1].append(d['id'])
        for phone in d['phones']: phone_map.setdefault(re.sub(r'\D','',phone), []).append(d['id'])
    duplicates = [{'type': kind, 'key': key, 'doctor_ids': ids} for kind, mapping in [('name', name_map), ('phone', phone_map), ('name_specialty', specialty_map)] for key, ids in mapping.items() if key and len(ids) > 1]
    today = datetime.date.today().isoformat()
    payload = {'updated_at': today, 'source': f'local:{args.source}', 'doctors': doctors}
    (ROOT / 'data/doctors.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'data/doctors-duplicates.json').write_text(json.dumps({'generated_at': today, 'duplicates': duplicates}, ensure_ascii=False, indent=2) + '\n')
    missing_phone = sum(not d['phones'] for d in doctors); missing_district = sum(not d['district'] for d in doctors)
    report = {'generated_at': today, 'total_doctors': len(doctors), 'specialties': len({d['specialty_group'] for d in doctors}), 'missing_phone': missing_phone, 'missing_district': missing_district, 'duplicates': len(duplicates), 'specialty_groups': sorted({d['specialty_group'] for d in doctors})}
    (ROOT / 'data/doctors-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({**report, 'overlap_with_previous': overlap}, ensure_ascii=False))
if __name__ == '__main__': main()

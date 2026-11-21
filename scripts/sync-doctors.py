#!/usr/bin/env python3
"""Import the editable specialist workbook into the site's canonical JSON data."""
import argparse, csv, datetime, io, json, re, unicodedata, zipfile
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
def phone_key(value):
    digits = re.sub(r'\D', '', value)
    return '0' + digits[3:] if digits.startswith('212') and len(digits) == 12 else digits
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

def csv_rows(path):
    return list(csv.reader(Path(path).read_text(encoding='utf-8-sig').splitlines()))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source', nargs='?', default='médecin spécialiste kenitra.xlsx')
    ap.add_argument('--allow-mass-replacement', action='store_true')
    ap.add_argument('--replace-all', action='store_true')
    args = ap.parse_args()
    source_path = ROOT / args.source
    rows = csv_rows(source_path) if source_path.suffix.lower() == '.csv' else xlsx_rows(source_path)
    header = [norm(x) for x in rows[0]]
    sheet_columns = {
        'medecin': 0, 'specialite': 1, 'numero de telephone': 2, 'email': 3,
        'instagram': 4, 'facebook': 5, 'linkedin': 6, 'clinique attaeche': 7,
        'description': 8, 'lien google map': 9,
    }
    legacy_columns = {'dr. prenom nom': 0, 'specialite': 1, 'ville': 2, 'quartier': 3, 'numero de telephone': 4, 'google maps': 5, 'instagram': 6, 'facebook': 7}
    columns = sheet_columns if all(index < len(header) and header[index] == key for key, index in sheet_columns.items()) else legacy_columns
    for key, index in columns.items():
        if index >= len(header) or header[index] != key: raise SystemExit(f'En-tête inattendu: colonne {index + 1}')
    current_sheet = columns is sheet_columns
    doctors, current_specialty, used = [], '', set()
    for line, row in enumerate(rows[1:], 2):
        name = clean(row[columns['medecin' if current_sheet else 'dr. prenom nom']] if len(row) > columns['medecin' if current_sheet else 'dr. prenom nom'] else '')
        if not name: current_specialty = clean(row[1] if len(row) > 1 else '') or current_specialty; continue
        specialty = clean(row[columns['specialite']] if len(row) > columns['specialite'] else '') or current_specialty
        if not specialty: raise SystemExit(f'Ligne {line}: spécialité manquante')
        base = slug(name)
        ident = base
        if ident in used: ident = f'{base}-{slug(specialty)}'
        n = 2
        while ident in used: ident = f'{base}-{n}'; n += 1
        used.add(ident)
        raw_phone = clean(row[columns['numero de telephone']] if len(row) > columns['numero de telephone'] else '')
        p = phones(raw_phone)
        get = lambda key: clean(row[columns[key]]) if key in columns and len(row) > columns[key] else ''
        doctors.append({'id': ident, 'name': name, 'title': 'Pr' if name.lower().startswith('pr.') else 'Dr', 'specialty': specialty,
          'specialty_group': specialty_group(specialty), 'subspecialty': '', 'city': get('ville') or 'Kénitra',
          'district': get('quartier'), 'address': '', 'phone': p, 'whatsapp': '', 'email': get('email'),
          'google_maps': get('lien google map') or get('google maps'), 'instagram': get('instagram'),
          'facebook': get('facebook'), 'linkedin': get('linkedin'), 'establishment': get('clinique attaeche'),
          'description': get('description'), 'status': 'active', 'verified': True, 'source': 'google-sheet'})
    old_path = ROOT / 'data/doctors.json'
    old = json.loads(old_path.read_text()) if old_path.exists() else {'doctors': []}
    old_names = {norm(d.get('name')) for d in old.get('doctors', [])}
    # Profiles supplied outside the sheet remain in the same canonical source.
    imported_names = {norm(d['name']) for d in doctors}
    if not args.replace_all:
        doctors.extend(d for d in old.get('doctors', [])
                       if d.get('source') in ('manual-professional', 'manual-directory') and norm(d['name']) not in imported_names)
    old_by_id = {d['id']: d for d in old.get('doctors', [])}
    for doctor in doctors:
        previous = old_by_id.get(doctor['id'], {})
        for key, value in previous.get('directory_enrichment', {}).items():
            if not doctor.get(key):
                doctor[key] = value
        for key in ('source', 'directory_enrichment', 'directory_sources', 'sponsor', 'featured', 'sponsored', 'premium', 'nameAr', 'nameEn'):
            if key in previous:
                doctor[key] = previous[key]
    overlap = sum(norm(d['name']) in old_names for d in doctors)
    if old_names and overlap < len(old_names) * .8 and not (args.allow_mass_replacement or args.replace_all):
        raise SystemExit(f'Remplacement refusé: {overlap}/{len(old_names)} anciens médecins retrouvés; utilisez --allow-mass-replacement après vérification.')
    unique, names_seen, phones_seen = [], set(), set()
    for doctor in doctors:
        phone_keys = {phone_key(phone) for phone in doctor['phone'] if phone_key(phone)}
        if norm(doctor['name']) in names_seen or phone_keys & phones_seen:
            continue
        unique.append(doctor); names_seen.add(norm(doctor['name'])); phones_seen.update(phone_keys)
    doctors = unique
    name_map = {}
    phone_map = {}
    specialty_map = {}
    for d in doctors:
        keys = [name_map.setdefault(norm(d['name']), []), specialty_map.setdefault((norm(d['name']), norm(d['specialty'])), [])]
        keys[0].append(d['id']); keys[1].append(d['id'])
        for phone in d['phone']: phone_map.setdefault(phone_key(phone), []).append(d['id'])
    duplicates = [{'type': kind, 'key': key, 'doctor_ids': ids} for kind, mapping in [('name', name_map), ('phone', phone_map), ('name_specialty', specialty_map)] for key, ids in mapping.items() if key and len(ids) > 1]
    today = datetime.date.today().isoformat()
    payload = {'updated_at': today, 'source': 'google-sheet' if current_sheet else f'local:{args.source}', 'doctors': doctors}
    (ROOT / 'data/doctors.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'data/doctors-duplicates.json').write_text(json.dumps({'generated_at': today, 'duplicates': duplicates}, ensure_ascii=False, indent=2) + '\n')
    missing_phone = sum(not d.get('phone') for d in doctors); missing_address = sum(not d.get('address') for d in doctors); missing_maps = sum(not d.get('google_maps') for d in doctors)
    report = {'last_sync': today, 'total_doctors': len(doctors), 'verified_doctors': sum(d['verified'] for d in doctors), 'active_doctors': sum(d['status']=='active' for d in doctors), 'draft_doctors': sum(d['status']=='draft' for d in doctors), 'inactive_doctors': sum(d['status']=='inactive' for d in doctors), 'specialties': len({d['specialty_group'] for d in doctors}), 'missing_phone': missing_phone, 'missing_address': missing_address, 'missing_maps': missing_maps, 'missing_district': sum(not d.get('district') for d in doctors), 'duplicates': len(duplicates), 'specialty_groups': sorted({d['specialty_group'] for d in doctors})}
    (ROOT / 'data/doctors-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({**report, 'overlap_with_previous': overlap}, ensure_ascii=False))
if __name__ == '__main__': main()

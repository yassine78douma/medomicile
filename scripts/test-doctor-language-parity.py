#!/usr/bin/env python3
"""Fail if a generated EN/AR directory loses a doctor present in FR."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ID_RE = re.compile(r'data-entity-path="/p/([^/]+)/"')


def ids(path):
    return ID_RE.findall(path.read_text(encoding='utf-8'))


def main():
    failures = []
    totals = {'fr': 0, 'en': 0, 'ar': 0}
    pages = 0
    for fr_path in sorted(ROOT.glob('*-kenitra.html')):
        if fr_path.name.endswith(('-en.html', '-ar.html')):
            continue
        en_path = fr_path.with_name(fr_path.stem + '-en.html')
        ar_path = fr_path.with_name(fr_path.stem + '-ar.html')
        if not (en_path.exists() and ar_path.exists()):
            continue
        fr_ids, en_ids, ar_ids = ids(fr_path), ids(en_path), ids(ar_path)
        if not fr_ids:
            continue
        pages += 1
        totals['fr'] += len(fr_ids)
        totals['en'] += len(en_ids)
        totals['ar'] += len(ar_ids)
        expected = set(fr_ids)
        for lang, found in (('en', set(en_ids)), ('ar', set(ar_ids))):
            missing = sorted(expected - found)
            extra = sorted(found - expected)
            if missing or extra:
                failures.append(f'{fr_path.name} {lang}: missing={missing} extra={extra}')
        if '<html lang="ar" dir="rtl">' not in ar_path.read_text(encoding='utf-8'):
            failures.append(f'{ar_path.name}: missing lang="ar" dir="rtl"')

    print(f'pages={pages} FR_EXPECTED={totals["fr"]} FR_FOUND={totals["fr"]} '
          f'EN_FOUND={totals["en"]} AR_FOUND={totals["ar"]}')
    if failures:
        print('\n'.join(failures), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

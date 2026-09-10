#!/usr/bin/env python3
"""Data integrity and generated artifact regression tests (no network)."""
import importlib.util
import json
import re
import unittest
import contextlib
import csv
import io
import tempfile
from unittest.mock import patch
from pathlib import Path
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('cards', ROOT/'scripts/generate-professional-cards.py')
cards = importlib.util.module_from_spec(spec); spec.loader.exec_module(cards)


class VirtualCards(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.entities = cards.entities()

    def test_all_categories_and_unique_urls(self):
        self.assertEqual(set(cards.TYPES), {e['type'] for e in self.entities})
        self.assertEqual(len(self.entities), len({e['url'] for e in self.entities}))

    def test_variant_preserves_identity_and_contact(self):
        for kind in cards.TYPES:
            source={'id':'fixture','name':'Test','phone':'0771882093','whatsapp':'0771882093','address':'Adresse existante'}
            standard=cards.normalize(source,kind,'test')
            self.assertEqual(standard['variant'],'standard')
            for flag in ('featured','sponsored','premium'):
                premium=cards.normalize(dict(source,**{flag:True}),kind,'test')
                self.assertEqual(premium['variant'],'premium')
                for key in ('name','subtitle','phones','whatsapp','address','google_maps_url','url','path','qr','share_url'):
                    self.assertEqual(premium[key],standard[key])
                self.assertIn('PARTENAIRE MEDOMICILE',cards.page(premium))
                self.assertEqual(cards.normalize(dict(source,**{flag:'false'}),kind,'test')['variant'],'standard')

    def test_every_artifact_and_conditional_actions(self):
        for e in self.entities:
            with self.subTest(entity=e['name']):
                soup = BeautifulSoup((ROOT/e['path'].strip('/')/'index.html').read_text(), 'html.parser')
                self.assertEqual(soup.h1.text, e['name'])
                self.assertEqual([b['id'] for b in soup.select('#vc-dialog .vc-action')], ['vc-share-link', 'vc-business'])
                self.assertFalse(soup.select('#vc-dialog a'))
                self.assertFalse(any(str(a.get('href', '')).startswith('file:') for a in soup.select('a')))
                self.assertEqual(soup.select_one('.vc-card')['data-variant'],e['variant'])
                for prop in ['og:title','og:description','og:url','og:image']:
                    self.assertTrue(soup.find('meta', property=prop)['content'])
                self.assertEqual(soup.find('meta', property='og:url')['content'], e['url'])
                self.assertEqual(soup.select_one('link[rel="canonical"]')['href'], e['url'])
                self.assertEqual(bool(soup.select('.vc-actions a[href^="tel:"]')), bool(e['phones']))
                self.assertEqual(bool(soup.select('.vc-actions a[href*="wa.me"]')), bool(e['whatsapp']))
                self.assertEqual(bool(soup.select('.vc-actions a[href*="maps"]')), bool(e['google_maps_url']))
                if e['google_maps_url']:
                    self.assertEqual(soup.select_one('.vc-actions a[href*="maps"]')['href'], e['google_maps_url'])
                self.assertEqual(json.loads(soup.select_one('#vc-data').string)['url'], e['url'])
                self.assertNotIn('vcard', e)
                with Image.open(ROOT/e['qr'].lstrip('/')) as image:
                    self.assertEqual(image.width,image.height)
                    self.assertGreater(image.width,200)
                if e['type'] in ('doctor','dentist'):
                    self.assertTrue((ROOT/'p'/f'{e["id"]}.html').exists())

    def test_exact_maps_and_missing_values(self):
        record={'id':'fixture','name':'Test','phone':[],'address':'','google_maps_url':'https://maps.app.goo.gl/exact','latitude':34,'longitude':-6}
        e=cards.normalize(record,'doctor','test')
        self.assertEqual(e['google_maps_url'],record['google_maps_url'])
        del record['google_maps_url']
        self.assertIn('34%2C-6',cards.normalize(record,'doctor','test')['google_maps_url'])
        del record['latitude'];del record['longitude']
        e=cards.normalize(record,'doctor','test')
        self.assertIsNone(e['google_maps_url']);self.assertFalse(e['indexable'])
        record['phone']='0771882093';record['whatsapp']='0771882093'
        e=cards.normalize(record,'dentist','test')
        self.assertEqual(e['phones'][0]['number'],'+212771882093')
        self.assertEqual(e['whatsapp'],'https://wa.me/212771882093')
        self.assertIsNone(cards.telephone('5.37364425E8'))
        self.assertIsNone(cards.telephone('537364425'))

    def test_no_directory_card_disappeared(self):
        report=json.loads((ROOT/'data/card-directory-report.json').read_text())
        self.assertEqual(report['unmatched'],[])
        self.assertEqual(report['ambiguous'],[])
        self.assertGreaterEqual(report['bound_cards'],843)
        for page in report['pages']:
            soup=BeautifulSoup((ROOT/page).read_text(),'html.parser')
            for card in soup.select('[data-entity-path]'):
                self.assertTrue((ROOT/card['data-entity-path'].strip('/')/'index.html').exists())

    def test_migration_counts(self):
        for filename,key,count in [('establishments.json','establishments',14),('radiology-centers.json','centers',14),('pharmacies-kenitra.json','pharmacies',103)]:
            self.assertGreaterEqual(len(json.loads((ROOT/'data'/filename).read_text())[key]),count)

    def test_sheet_sync_preserves_manual_profiles(self):
        spec=importlib.util.spec_from_file_location('sync',ROOT/'scripts/sync-doctors.py')
        sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)
        manual=[d for d in json.loads((ROOT/'data/doctors.json').read_text())['doctors'] if d.get('source','').startswith('manual-')]
        with tempfile.TemporaryDirectory() as folder:
            sync.ROOT=Path(folder);(sync.ROOT/'data').mkdir()
            (sync.ROOT/'data/doctors.json').write_text(json.dumps({'doctors':manual}))
            with (sync.ROOT/'source.csv').open('w') as file:
                writer=csv.writer(file)
                writer.writerow(['Dr. prenom nom','Specialite','Ville','Quartier','Numero de telephone','Google Maps','Instagram','Facebook'])
                writer.writerow(['Dr Exemple','Dentiste','Kénitra','','','','',''])
            with patch('sys.argv',['sync','source.csv','--allow-mass-replacement']),contextlib.redirect_stdout(io.StringIO()):
                sync.main()
            output=json.loads((sync.ROOT/'data/doctors.json').read_text())['doctors']
            for doctor in manual:
                self.assertIn(doctor,output)


if __name__ == '__main__':
    unittest.main()

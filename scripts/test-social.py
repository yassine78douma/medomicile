#!/usr/bin/env python3
import json,re
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'social-data/brulures-premiers-gestes.json'; OUT=ROOT/'social-output/brulures-premiers-gestes'
def check(ok,msg):
    if not ok: raise AssertionError(msg)
d=json.loads(DATA.read_text()); check(d['author']=='Dr Wiame Fimoud','author'); check(d['article_url'].endswith('.html'),'url'); check(d['status']=='DRAFT','approval default')
for p in (OUT/'instagram').glob('*.png'): check(Image.open(p).size==(1080,1350),f'instagram size {p}')
for p in (OUT/'story').glob('*.png'): check(Image.open(p).size==(1080,1920),f'story size {p}')
check((OUT/'facebook/post.png').exists(),'facebook asset'); check(d['article_url'] in (OUT/'captions/instagram.txt').read_text(),'caption url')
for p in ROOT.rglob('*'):
    if p.is_file() and p.name != 'test-social.py' and '.git' not in p.parts and 'social-output' not in p.parts and 'test-results' not in p.parts and p.suffix in {'.py','.mjs','.js','.json','.yml','.yaml','.md','.txt'}:
        try: txt=p.read_text(errors='ignore')
        except: continue
        check(not re.search(r'(EAAG|IGQV|access_token=|password\s*[=:])',txt,re.I),f'possible secret in {p}')
print('social tests: PASS')

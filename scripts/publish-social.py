#!/usr/bin/env python3
"""Safe publication boundary; refuses until Meta is explicitly connected."""
import argparse,json,os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser(); ap.add_argument('slug'); args=ap.parse_args()
manifest=ROOT/'social-output'/args.slug/'manifest.json'
if not manifest.exists(): raise SystemExit('Generate the social draft first.')
data=json.loads(manifest.read_text())
if data.get('status')!='APPROVED': raise SystemExit('Refusing publication: status must be APPROVED.')
if not all(os.getenv(k) for k in ('META_PAGE_ID','META_IG_USER_ID','META_ACCESS_TOKEN')): raise SystemExit('Refusing publication: Meta credentials are not configured.')
raise SystemExit('Meta adapter not enabled; no content was published.')

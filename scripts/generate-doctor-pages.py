#!/usr/bin/env python3
import html, json, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
PAGES = {'Dentiste':'dentistes-kenitra.html','Dermatologue':'dermatologues-kenitra.html','Endocrinologue':'endocrinologues-kenitra.html','Gastro-entérologie':'gastroenterologues-kenitra.html','Gynécologue-obstétricien':'gynecologues-kenitra.html','Médecine interne':'internistes-kenitra.html','ORL':'orl-kenitra.html','Pédiatre':'pediatres-kenitra.html','Pneumologue':'pneumologues-kenitra.html','Rhumatologie':'rhumatologues-kenitra.html','Urologie':'urologues-kenitra.html','Chirurgien viscéral et digestif':'visceralistes-kenitra.html'}
FILTERS = {'Dentiste':'dentiste','Dermatologue':'dermatologue','Endocrinologue':'endocrinologue','Gastro-entérologie':'gastro','Gynécologue-obstétricien':'gynecologue','Médecine interne':'medecine interne','ORL':'orl','Pédiatre':'pediatre','Pneumologue':'pneumologue','Rhumatologie':'rhumatolog','Urologie':'urolog','Chirurgien viscéral et digestif':'chirurgien'}
def e(v): return html.escape(str(v or ''), quote=True)
def card(d):
    lines=[f'<p class="doctor-line"><span aria-hidden="true">✚</span><span>{e(d["specialty"])}</span></p>']
    if d.get('subspecialty'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">◇</span><span>{e(d["subspecialty"])}</span></p>')
    if d.get('district'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">⌖</span><span>{e(d["district"])}</span></p>')
    if d.get('address'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">⌖</span><span>{e(d["address"])}</span></p>')
    for phone in d.get('phone',[]): lines.append(f'<p class="doctor-line"><span aria-hidden="true">☎</span><a dir="ltr" href="tel:{e(re.sub(r"[^0-9+]", "", phone))}">{e(phone)}</a></p>')
    if d.get('whatsapp'): lines.append(f'<p class="doctor-line"><span aria-hidden="true">◔</span><a dir="ltr" href="https://wa.me/{e(re.sub(r"[^0-9]", "", d["whatsapp"]))}">{e(d["whatsapp"])}</a></p>')
    links=[]
    for key,label in [('google_maps','Itinéraire'),('instagram','Instagram'),('facebook','Facebook')]:
        if d.get(key): links.append(f'<a class="secondary-action" href="{e(d[key])}" target="_blank" rel="noopener">{label}</a>')
    if links: lines.append(f'<div class="urgent-actions">{"".join(links)}</div>')
    search=' '.join([d['name'],d['specialty'],d.get('district',''),d.get('address','')])
    return f'<article class="doctor-card reveal" data-status="active" data-search="{e(search)}"><h3>{e(d["name"])}</h3>{"".join(lines)}</article>'
def main():
    docs=json.loads((ROOT/'data/doctors.json').read_text())['doctors']; groups=defaultdict(list)
    for d in docs: groups[d['specialty_group']].append(d)
    changed=[]
    for group, filename in PAGES.items():
        items=[d for d in docs if FILTERS[group] in d['specialty'].lower().replace('é','e').replace('è','e') or FILTERS[group] in d['specialty_group'].lower().replace('é','e').replace('è','e')]
        if not items: continue
        path=ROOT/filename; text=path.read_text()
        pending=re.compile(r'\s*<section class="pending-page section reveal">[\s\S]*?</section>')
        grid='\n      <section class="directory section" aria-labelledby="directory-list-title"><h2 id="directory-list-title" class="sr-only">Liste des médecins</h2><div class="doctor-grid" data-directory-list>\n'+''.join(card(d) for d in items)+'\n</div></section>'
        next_text=pending.sub(grid,text, count=1)
        next_text=next_text.replace('Cette spécialité sera complétée progressivement après vérification des coordonnées.', 'Retrouvez les professionnels exerçant à Kénitra avec leurs coordonnées disponibles.')
        if next_text != text: path.write_text(next_text); changed.append(filename)
    print(json.dumps({'updated_pages':changed,'groups':{k:len(v) for k,v in groups.items()}},ensure_ascii=False))
if __name__=='__main__': main()

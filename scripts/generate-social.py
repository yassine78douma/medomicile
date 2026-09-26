#!/usr/bin/env python3
"""Generate reusable Medomicile social drafts from canonical social-data JSON."""
from __future__ import annotations
import argparse, hashlib, html, json, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
NAVY="#082f49"; BLUE="#0f4c81"; ROYAL="#2f80ed"; GOLD="#c6a969"; SOFT="#f8fafc"; LINE="#dbe7f3"
LOGO=ROOT/"assets/optimized/medomicile-logo-160.png"

def font(size, bold=False):
    names=["/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    for n in names:
        if Path(n).exists(): return ImageFont.truetype(n,size)
    return ImageFont.load_default()

def wrap(draw,text,f,maxw):
    out=[]
    for para in str(text).split("\n"):
        words=para.split(); line=""
        for w in words:
            test=(line+" "+w).strip()
            if draw.textbbox((0,0),test,font=f)[2] <= maxw: line=test
            else:
                if line: out.append(line)
                line=w
        if line: out.append(line)
    return out

def draw_brand(draw,im,w,small=False):
    s=110 if not small else 76
    logo=Image.open(LOGO).convert("RGBA").resize((s,s),Image.Resampling.LANCZOS)
    im.alpha_composite(logo,(w-s-60,42))
    draw.text((60,55),"MEDOMICILE",font=font(34 if not small else 25,True),fill=NAVY)
    draw.text((60,96 if not small else 86),"Soins à domicile",font=font(18 if not small else 14),fill=BLUE)

def make_card(data, slide, size):
    W,H=size; im=Image.new("RGBA",size,"white"); d=ImageDraw.Draw(im)
    d.rounded_rectangle((28,28,W-28,H-28),radius=34,outline=LINE,width=3,fill=SOFT)
    draw_brand(d,im,W)
    d.rounded_rectangle((60,160,W-60,166),radius=3,fill=GOLD)
    title=font(58 if W==1080 else 46,True)
    y=220
    for line in wrap(d,slide["title"],title,W-160): d.text((60,y),line,font=title,fill=NAVY); y+=title.size+12
    y+=35
    body=slide["body"]
    if isinstance(body,list):
        for i,item in enumerate(body,1):
            d.ellipse((65,y+6,93,y+34),fill=GOLD)
            d.text((112,y),str(i),font=font(24,True),fill=BLUE)
            lines=wrap(d,item,font(30),W-190)
            for line in lines: d.text((160,y),line,font=font(30),fill=NAVY); y+=43
            y+=28
    else:
        for line in wrap(d,body,font(34),W-150): d.text((60,y),line,font=font(34),fill=BLUE); y+=48
    if slide["kind"]=="cover":
        d.text((60,H-250),f"Par {data['author']}",font=font(28,True),fill=BLUE)
    if slide["kind"]=="cta":
        d.rounded_rectangle((60,H-180,420,H-105),radius=28,fill=BLUE); d.text((110,H-164),"Lire l’article",font=font(28,True),fill="white")
    d.text((60,H-72),"medomicile.com  •  Kénitra · Mehdia",font=font(20),fill=BLUE)
    return im.convert("RGB")

def captions(data):
    ig=("Une brûlure peut arriver en quelques secondes à la maison.\n\n"
        "Mais quels sont les premiers gestes à adopter — et les erreurs à éviter ?\n\n"
        f"{data['author']} vous explique les réflexes essentiels. Retrouvez l’article complet sur Medomicile.\n\n"
        + " ".join(data["hashtags"]) + "\n" + data["article_url"])
    fb=("Une brûlure domestique nécessite les bons réflexes dès les premières minutes. "
        f"Dans cet article, {data['author']} présente les gestes immédiats et les situations qui nécessitent une consultation urgente.\n\n"
        "Lire l’article complet : " + data["article_url"])
    return ig,fb

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("article"); ap.add_argument("--force",action="store_true"); args=ap.parse_args()
    p=Path(args.article); p=ROOT/p if not p.is_absolute() else p
    if p.suffix==".html": p=ROOT/"social-data"/(p.stem+".json")
    data=json.loads(p.read_text()); out=ROOT/"social-output"/data["slug"]; (out/"instagram").mkdir(parents=True,exist_ok=True); (out/"story").mkdir(exist_ok=True); (out/"facebook").mkdir(exist_ok=True); (out/"captions").mkdir(exist_ok=True)
    for i,s in enumerate(data["slides"],1): make_card(data,s,(1080,1350)).save(out/"instagram"/f"{i:02d}-{s['kind']}.png")
    for i,s in enumerate(data["slides"][:3],1): make_card(data,s,(1080,1920)).save(out/"story"/f"{i:02d}.png")
    make_card(data,{"kind":"cover","title":data["title"],"body":data["subtitle"],"source_section":"cover"},(1200,1500)).save(out/"facebook"/"post.png")
    ig,fb=captions(data); (out/"captions"/"instagram.txt").write_text(ig+"\n",encoding="utf-8"); (out/"captions"/"facebook.txt").write_text(fb+"\n",encoding="utf-8")
    manifest={"slug":data["slug"],"status":data.get("status","DRAFT"),"content_hash":hashlib.sha256(p.read_bytes()).hexdigest(),"article_url":data["article_url"],"author":data["author"]}
    (out/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Generated DRAFT: {out}")
if __name__=="__main__": main()

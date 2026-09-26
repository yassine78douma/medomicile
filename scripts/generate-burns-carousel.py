#!/usr/bin/env python3
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'social-output/brulures-premiers-gestes/instagram-dark'; OUT.mkdir(parents=True,exist_ok=True)
NAVY='#062b55'; BLUE='#1e5aa8'; GOLD='#d4a017'; WHITE='#f8fbff'; MUTED='#c8d8eb'
PHOTO=Path('/Users/mac/.codex/generated_images/01a09b76-f243-7250-9690-7255a54cb042/exec-2aba6b1a-eb50-4bc9-8003-95eae849c63c.png')
LOGO=ROOT/'assets/brand/medomicile-logo.png'
def f(n,b=False):
 p='/System/Library/Fonts/Supplemental/Arial Bold.ttf' if b else '/System/Library/Fonts/Supplemental/Arial.ttf'; return ImageFont.truetype(p,n)
def wrap(d,t,ft,w):
 a=[]
 for p in t.split('\n'):
  line=''
  for x in p.split():
   q=(line+' '+x).strip()
   if d.textbbox((0,0),q,font=ft)[2]<=w: line=q
   else: a.append(line); line=x
  if line:a.append(line)
 return a
def logo(im,d):
 l=Image.open(LOGO).convert('RGBA').resize((130,130)); im.alpha_composite(l,(62,44)); d.text((215,58),'ME',font=f(40,True),fill=BLUE); d.text((275,58),'DOMICILE',font=f(40,True),fill=GOLD); d.text((216,108),'Soins à domicile  •  Kénitra · Mehdia',font=f(18),fill=WHITE)
def slide(num,title,items,photo=False):
 im=Image.new('RGBA',(1080,1350),NAVY); d=ImageDraw.Draw(im)
 if photo and PHOTO.exists():
  p=Image.open(PHOTO).convert('RGB').crop((0,500,1122,1400)).resize((1080,850)); p=p.filter(ImageFilter.GaussianBlur(0.3)); im.paste(Image.blend(p,Image.new('RGB',p.size,NAVY),0.38),(0,500)); d=ImageDraw.Draw(im)
 logo(im,d); d.rectangle((62,205,92,211),fill=GOLD); d.text((62,245),f'{num:02d}',font=f(30,True),fill=GOLD)
 y=310
 for line in wrap(d,title,f(70,True),900): d.text((62,y),line,font=f(70,True),fill=WHITE); y+=82
 y+=48
 for i,t in enumerate(items):
  d.ellipse((70,y+10,98,y+38),fill=GOLD); lines=wrap(d,t,f(34),850)
  for line in lines: d.text((130,y),line,font=f(34),fill=WHITE); y+=48
  y+=32
 d.text((62,1265),'medomicile.com  •  Article de Dr Wiame Fimoud',font=f(22),fill=MUTED)
 im.convert('RGB').save(OUT/f'{num:02d}.png',quality=95)
slide(1,'BRÛLURES DOMESTIQUES',['Les premiers gestes à faire à la maison','Par Dr Wiame Fimoud'],True)
slide(2,'PREMIERS RÉFLEXES',['Éloigner la personne de la source de chaleur.','Refroidir la zone brûlée sous une eau courante fraîche pendant 20 min.','Retirer les bijoux et protéger la zone.'])
slide(3,'ERREURS À ÉVITER',['Pas de glace directement sur la brûlure.','Ne pas arracher un vêtement collé à la peau.','Pas de dentifrice, beurre, farine ou autres remèdes maison.','Ne pas percer les cloques.'])
slide(4,'QUAND CONSULTER EN URGENCE ?', ['Brûlure étendue ou profonde, avec peau noire ou insensible.','Visage, organes génitaux ou articulation importante.','Produit chimique ou électricité.','Difficultés respiratoires ou altération de la conscience.'])
slide(5,'LA PRÉVENTION COMMENCE PAR UN GESTE,\nLA SÉCURITÉ PAR UN RÉFLEXE.',['Lire l’article complet sur medomicile.com','Informez-vous et consultez en cas de doute.'])
print(OUT)

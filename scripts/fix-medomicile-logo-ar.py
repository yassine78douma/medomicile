from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
p=Path('/Users/mac/Documents/Codex/2026-06-09/medomicile/social-design-v2/instagram-ar/hypertension-ar.png'); im=Image.open(p).convert('RGB')
d=ImageDraw.Draw(im); d.rectangle((55,35,560,205),fill='#0b203d')
logo=Image.open('/Users/mac/Documents/Codex/2026-06-09/medomicile/assets/brand/medomicile-logo.png').convert('RGB').resize((130,130))
mask=Image.new('L',(130,130),0); ImageDraw.Draw(mask).ellipse((0,0,129,129),fill=255); im.paste(logo,(65,45),mask)
bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf'; reg='/System/Library/Fonts/Supplemental/Arial.ttf'
d=ImageDraw.Draw(im); d.text((220,68),'ME',font=ImageFont.truetype(bold,38),fill='#2f80ed'); d.text((280,68),'DOMICILE',font=ImageFont.truetype(bold,38),fill='#c6a969'); d.text((222,112),'Soins à domicile  •  Kénitra · Mehdia',font=ImageFont.truetype(reg,17),fill='white')
im.save(p,quality=96)

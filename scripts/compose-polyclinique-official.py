from PIL import Image, ImageDraw, ImageFont, ImageOps

src = "/Users/mac/Downloads/images-2.jpeg"
out = "/Users/mac/Documents/Codex/2026-06-09/medomicile/social-design-v2/polyclinique-kenitra/story-garde-24h24-polyclinique-kenitra-officielle.png"
photo = Image.open(src).convert("RGB")
canvas = ImageOps.fit(photo, (1080, 1920), method=Image.Resampling.LANCZOS, centering=(0.52, 0.52))
draw = ImageDraw.Draw(canvas, "RGBA")
draw.rectangle((0, 0, 1080, 1920), fill=(4, 25, 58, 48))
draw.rectangle((0, 0, 1080, 760), fill=(4, 25, 58, 210))
draw.rectangle((0, 1350, 1080, 1920), fill=(4, 25, 58, 145))
draw.rectangle((95, 155, 108, 590), fill=(215, 169, 40, 255))
serif = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
sans = "/System/Library/Fonts/Supplemental/Arial.ttf"
def f(path, size): return ImageFont.truetype(path, size)
draw.text((120, 175), "URGENCES", font=f(serif, 82), fill="white")
draw.text((120, 270), "24H/24", font=f(serif, 95), fill="white")
draw.text((120, 390), "POLYCLINIQUE DE KÉNITRA", font=f(sans, 31), fill=(243,238,227,255))
draw.text((120, 450), "La garde est assurée jour et nuit.", font=f(sans, 27), fill="white")
draw.text((120, 520), "Avec Medomicile", font=f(sans, 23), fill=(215,169,40,255))
draw.rounded_rectangle((70, 1450, 1010, 1730), radius=28, fill=(4, 25, 58, 225))
draw.text((115, 1490), "UNE PRISE EN CHARGE", font=f(sans, 30), fill="white")
draw.text((115, 1540), "DISPONIBLE 24H/24", font=f(serif, 48), fill=(215,169,40,255))
draw.text((115, 1620), "Polyclinique de Kénitra", font=f(sans, 25), fill=(243,238,227,255))
canvas.save(out, quality=95)
print(out)

from PIL import Image, ImageDraw, ImageFont, ImageOps

photo1 = Image.open("/Users/mac/Downloads/images-2.jpeg").convert("RGB")
photo2 = Image.open("/Users/mac/Downloads/images-3.jpeg").convert("RGB")
out = "/Users/mac/Documents/Codex/2026-06-09/medomicile/social-design-v2/polyclinique-kenitra/story-garde-24h24-polyclinique-deux-photos.png"
canvas = Image.new("RGB", (1080, 1920), (4, 25, 58))
canvas.paste(ImageOps.fit(photo1, (1080, 980), centering=(0.52, 0.5)), (0, 0))
canvas.paste(ImageOps.fit(photo2, (1080, 790), centering=(0.5, 0.5)), (0, 980))
draw = ImageDraw.Draw(canvas, "RGBA")
draw.rectangle((0, 0, 1080, 1920), fill=(4, 25, 58, 35))
draw.rectangle((0, 0, 1080, 650), fill=(4, 25, 58, 220))
draw.rectangle((0, 980, 1080, 1010), fill=(215, 169, 40, 255))
draw.rounded_rectangle((55, 90, 820, 605), radius=28, fill=(4, 25, 58, 210))
draw.rectangle((95, 150, 108, 520), fill=(215, 169, 40, 255))
serif = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
sans = "/System/Library/Fonts/Supplemental/Arial.ttf"
def f(path, size): return ImageFont.truetype(path, size)
draw.text((120, 170), "URGENCES", font=f(serif, 78), fill="white")
draw.text((120, 260), "24H/24", font=f(serif, 91), fill="white")
draw.text((120, 370), "POLYCLINIQUE DE KÉNITRA", font=f(sans, 31), fill=(243,238,227,255))
draw.text((120, 425), "La garde est assurée jour et nuit.", font=f(sans, 26), fill="white")
draw.text((120, 495), "Avec Medomicile", font=f(sans, 22), fill=(215,169,40,255))
draw.rounded_rectangle((70, 1480, 1010, 1780), radius=28, fill=(4, 25, 58, 225))
draw.text((115, 1535), "UNE PRISE EN CHARGE", font=f(sans, 29), fill="white")
draw.text((115, 1585), "DISPONIBLE 24H/24", font=f(serif, 46), fill=(215,169,40,255))
draw.text((115, 1665), "Polyclinique de Kénitra", font=f(sans, 25), fill=(243,238,227,255))
canvas.save(out, quality=95)
print(out)

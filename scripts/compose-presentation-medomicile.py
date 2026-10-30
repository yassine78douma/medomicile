from PIL import Image, ImageDraw, ImageFont, ImageOps

src = "/Users/mac/Documents/Codex/2026-06-09/medomicile/assets/optimized/medomicile-hospital-team-1200.jpg"
logo = "/Users/mac/Documents/Codex/2026-06-09/medomicile/assets/brand/medomicile-logo.png"
out = "/Users/mac/Documents/Codex/2026-06-09/medomicile/social-design-v2/presentation-medomicile-instagram.png"
canvas = ImageOps.fit(Image.open(src).convert("RGB"), (1080, 1350), centering=(0.57, 0.5))
draw = ImageDraw.Draw(canvas, "RGBA")
draw.rectangle((0, 0, 1080, 1350), fill=(3, 29, 68, 45))
draw.rounded_rectangle((48, 48, 720, 735), radius=30, fill=(3, 29, 68, 228))
draw.rectangle((92, 138, 106, 622), fill=(198, 169, 105, 255))
serif = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
sans = "/System/Library/Fonts/Supplemental/Arial.ttf"
def f(path, size): return ImageFont.truetype(path, size)
mark = Image.open(logo).convert("RGBA")
mark.thumbnail((95,95))
canvas.paste(mark, (122, 92), mark)
draw.text((235, 98), "ME", font=f(sans, 42), fill=(255,255,255,255))
draw.text((300, 98), "DOMICILE", font=f(sans, 42), fill=(215,169,40,255))
draw.text((236, 148), "Soins à domicile", font=f(sans, 20), fill=(243,238,227,255))
draw.text((122, 245), "QUI SOMMES-", font=f(serif, 62), fill="white")
draw.text((122, 315), "NOUS ?", font=f(serif, 62), fill="white")
draw.text((122, 430), "Une équipe de santé", font=f(sans, 29), fill=(243,238,227,255))
draw.text((122, 472), "humaine, professionnelle", font=f(sans, 29), fill=(243,238,227,255))
draw.text((122, 514), "et proche de vous.", font=f(sans, 29), fill=(243,238,227,255))
draw.text((122, 610), "Kénitra • Mehdia", font=f(sans, 24), fill=(215,169,40,255))
draw.rounded_rectangle((70, 900, 1010, 1250), radius=28, fill=(255,255,255,235))
draw.text((112, 955), "COMMENT POUVONS-NOUS", font=f(sans, 28), fill=(3,29,68,255))
draw.text((112, 1005), "VOUS AIDER ?", font=f(serif, 45), fill=(3,29,68,255))
draw.text((112, 1085), "Médecin à domicile  •  Infirmier", font=f(sans, 24), fill=(3,29,68,255))
draw.text((112, 1125), "Kinésithérapie  •  Ambulance privée", font=f(sans, 24), fill=(3,29,68,255))
draw.text((112, 1188), "Des soins chez vous, en toute confiance.", font=f(sans, 24), fill=(198,169,105,255))
canvas.save(out, quality=95)
print(out)

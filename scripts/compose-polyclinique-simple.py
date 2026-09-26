from PIL import Image, ImageDraw, ImageFont, ImageOps

src = "/Users/mac/Downloads/images-3.jpeg"
out = "/Users/mac/Documents/Codex/2026-06-09/medomicile/social-design-v2/polyclinique-kenitra/story-garde-24h24-simple.png"
photo = Image.open(src).convert("RGB")
canvas = ImageOps.fit(photo, (1080, 1920), method=Image.Resampling.LANCZOS, centering=(0.52, 0.48))
draw = ImageDraw.Draw(canvas, "RGBA")
draw.rectangle((0, 0, 1080, 1920), fill=(3, 20, 48, 42))
draw.rectangle((0, 0, 1080, 700), fill=(3, 20, 48, 205))
draw.rectangle((0, 0, 1080, 18), fill=(215, 169, 40, 255))
serif = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
sans = "/System/Library/Fonts/Supplemental/Arial.ttf"
def f(path, size): return ImageFont.truetype(path, size)
draw.text((78, 120), "POLYCLINIQUE", font=f(serif, 62), fill="white")
draw.text((78, 200), "DE KÉNITRA", font=f(serif, 62), fill="white")
draw.rectangle((80, 315, 250, 327), fill=(215,169,40,255))
draw.text((78, 375), "URGENCES", font=f(sans, 42), fill=(243,238,227,255))
draw.text((78, 430), "24H/24", font=f(serif, 86), fill=(215,169,40,255))
draw.text((78, 555), "La garde est assurée jour et nuit.", font=f(sans, 27), fill="white")
draw.rounded_rectangle((65, 1660, 1015, 1815), radius=24, fill=(3, 20, 48, 215))
draw.text((105, 1700), "Avec Medomicile  •  Kénitra", font=f(sans, 28), fill="white")
canvas.save(out, quality=95)
print(out)

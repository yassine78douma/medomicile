from PIL import Image, ImageDraw, ImageFont

src = "/Users/mac/.codex/generated_images/01a09b76-f243-7250-9690-7255a54cb042/exec-cd9868d4-cd8c-4cd6-95ac-902fe0805670.png"
out = "/Users/mac/Documents/Codex/2026-06-09/medomicile/social-design-v2/polyclinique-kenitra/story-garde-24h24-polyclinique-kenitra.png"
im = Image.open(src).convert("RGB").resize((1080, 1920))
draw = ImageDraw.Draw(im, "RGBA")
draw.rounded_rectangle((55, 105, 780, 850), radius=28, fill=(4, 25, 58, 220))
draw.rectangle((95, 190, 108, 685), fill=(215, 169, 40, 255))
serif = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
sans = "/System/Library/Fonts/Supplemental/Arial.ttf"
def f(path, size): return ImageFont.truetype(path, size)
draw.text((120, 225), "GARDE", font=f(serif, 96), fill="white")
draw.text((120, 325), "24H/24", font=f(serif, 95), fill="white")
draw.text((120, 440), "POLYCLINIQUE DE KÉNITRA", font=f(sans, 33), fill=(243,238,227,255))
draw.text((120, 495), "KÉNITRA", font=f(sans, 28), fill=(215,169,40,255))
draw.text((120, 610), "LA POLYCLINIQUE ASSURE", font=f(sans, 27), fill="white")
draw.text((120, 648), "LA GARDE 24H/24", font=f(sans, 27), fill="white")
draw.text((120, 715), "Avec Medomicile", font=f(sans, 22), fill=(215,169,40,255))
im.save(out, quality=95)
print(out)

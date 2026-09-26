from PIL import Image, ImageDraw, ImageFont

src = "/Users/mac/.codex/generated_images/01a09b76-f243-7250-9690-7255a54cb042/exec-c82b4887-8bbc-4785-982e-630e4b417e0b.png"
out = "/Users/mac/Documents/Codex/2026-06-09/medomicile/social-design-v2/clinique-internationale/story-garde-24h24-clinique-internationale.png"
im = Image.open(src).convert("RGB").resize((1080, 1920))
draw = ImageDraw.Draw(im, "RGBA")
draw.rounded_rectangle((55, 105, 760, 850), radius=28, fill=(4, 25, 58, 218))
draw.rectangle((95, 190, 108, 685), fill=(215, 169, 40, 255))
font_serif = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
font_sans = "/System/Library/Fonts/Supplemental/Arial.ttf"
def f(path, size): return ImageFont.truetype(path, size)
draw.text((120, 225), "GARDE", font=f(font_serif, 96), fill=(255,255,255,255))
draw.text((120, 325), "24H/24", font=f(font_serif, 95), fill=(255,255,255,255))
draw.text((120, 440), "CLINIQUE INTERNATIONALE", font=f(font_sans, 33), fill=(243,238,227,255))
draw.text((120, 495), "KÉNITRA", font=f(font_sans, 28), fill=(215,169,40,255))
draw.text((120, 610), "LA CLINIQUE ASSURE", font=f(font_sans, 27), fill=(255,255,255,255))
draw.text((120, 648), "LA GARDE 24H/24", font=f(font_sans, 27), fill=(255,255,255,255))
draw.text((120, 715), "Avec Medomicile", font=f(font_sans, 22), fill=(215,169,40,255))
im.save(out, quality=95)
print(out)

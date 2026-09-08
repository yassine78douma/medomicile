#!/usr/bin/env python3
"""Apply repeatable, non-visual SEO maintenance to the static pages."""

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://medomicile.com/"
EXCLUDED = {"google350b019a46edf1ae.html", "yandex_d2b34c4a0fcfa3a9.html", "index.html"}

TITLE_OVERRIDES = {
    "cardiologues-kenitra-en.html": "Cardiologists in Kenitra | Medomicile",
    "laboratoires-kenitra.html": "Laboratoires d'analyses à Kénitra | Medomicile",
    "pharmacies-ville-nouvelle-bir-rami-est-kenitra.html": "Pharmacies à Ville Nouvelle, Kénitra | Medomicile",
    "radiologie-kenitra.html": "Radiologie à Kénitra | Medomicile",
    "radiology-kenitra.html": "Radiology centers in Kenitra | Medomicile",
}


def absolute_url(filename):
    return BASE if filename == "index.html" else f"{BASE}{filename}"


def page_files():
    return sorted(
        path for path in ROOT.glob("*.html") if path.name not in EXCLUDED
    )


def metadata(text):
    title_match = re.search(r"<title[^>]*>([\s\S]*?)</title>", text, re.I)
    description_match = re.search(
        r'<meta\s+name=["\']description["\']\s+content=(?P<quote>["\'])(?P<value>.*?)(?P=quote)', text, re.I
    )
    title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else "Medomicile"
    description = description_match.group("value").strip() if description_match else "Informations pratiques de santé à Kénitra avec Medomicile."
    return title, description


def main_heading(text):
    match = re.search(r"<h1\b[^>]*>([\s\S]*?)</h1>", text, re.I)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", match.group(1))).strip() if match else "Medomicile à Kénitra"


def improve_description(text):
    _, description = metadata(text)
    if 110 <= len(description) <= 175 and "</" not in description:
        return text
    heading = main_heading(text)
    language = re.search(r'<html\b[^>]*\blang=["\']([^"\']+)', text, re.I)
    language = language.group(1).lower() if language else "fr"
    if language == "en":
        replacement = f"Find {heading} with practical information, addresses and phone details in Kenitra. Confirm availability before travelling."
    elif language == "ar":
        replacement = f"اكتشف {heading} في القنيطرة مع المعلومات العملية والعناوين وأرقام الهاتف المتاحة. يرجى التأكد قبل التنقل."
    else:
        replacement = f"Retrouvez {heading} à Kénitra avec informations pratiques, adresses et numéros utiles. Vérifiez les disponibilités avant votre déplacement."
    return re.sub(
        r'(<meta\s+name=["\']description["\']\s+content=)(?P<quote>["\'])(?P<value>.*?)(?P=quote)',
        lambda match: f'{match.group(1)}{match.group("quote")}{html.escape(replacement, quote=True)}{match.group("quote")}',
        text,
        count=1,
        flags=re.I,
    )


def canonical(text):
    match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)', text, re.I)
    return match.group(1) if match else None


def language_group(filename, available):
    if filename.endswith("-ar.html"):
        stem = filename[:-8]
        candidates = {"fr": f"{stem}.html", "en": f"{stem}-en.html", "ar": filename}
    elif filename.endswith("-en.html"):
        stem = filename[:-8]
        candidates = {"fr": f"{stem}.html", "en": filename, "ar": f"{stem}-ar.html"}
    else:
        stem = filename[:-5]
        candidates = {"fr": filename, "en": f"{stem}-en.html", "ar": f"{stem}-ar.html"}
    return {lang: name for lang, name in candidates.items() if name in available}


def insert_head(text, markup):
    return text.replace("</head>", f"    {markup}\n  </head>", 1)


def add_hreflang(text, group):
    if len(group) < 2 or "hreflang=" in text:
        return text
    links = "\n    ".join(
        f'<link rel="alternate" hreflang="{lang}" href="{absolute_url(filename)}" />'
        for lang, filename in group.items()
    )
    default = group.get("fr") or next(iter(group.values()))
    links += f'\n    <link rel="alternate" hreflang="x-default" href="{absolute_url(default)}" />'
    return insert_head(text, links)


def add_open_graph(text, filename):
    missing = [
        key
        for key in ("og:title", "og:description", "og:url", "og:type", "og:image")
        if not re.search(rf'property=["\']{re.escape(key)}["\']', text, re.I)
    ]
    title, description = metadata(text)
    url = canonical(text) or absolute_url(filename)
    values = {
        "og:title": title,
        "og:description": description,
        "og:url": url,
        "og:type": "website",
        "og:image": f"{BASE}assets/brand/medomicile-logo.png",
    }
    for key in ("og:title", "og:description", "og:url"):
        text = re.sub(
            rf'(<meta\s+property=["\']{re.escape(key)}["\']\s+content=)(?P<quote>["\'])(?P<value>.*?)(?P=quote)',
            lambda match: f'{match.group(1)}{match.group("quote")}{html.escape(values[key], quote=True)}{match.group("quote")}',
            text,
            count=1,
            flags=re.I,
        )
    if not missing:
        return text
    markup = "\n    ".join(
        f'<meta property="{key}" content="{html.escape(values[key], quote=True)}" />'
        for key in missing
    )
    return insert_head(text, markup)


def fix_pending_h1(text):
    return re.sub(
        r'(<section\b[^>]*class=["\'][^"\']*pending-page[^"\']*["\'][^>]*>[\s\S]*?)<h1(\b[^>]*)>([\s\S]*?)</h1>',
        r'\1<h2 class="pending-page__title"\2>\3</h2>',
        text,
        count=1,
        flags=re.I,
    )


def render_duty_card(pharmacy, lang):
    fields = {
        "fr": ("name", "district", "address", "De garde", "Quartier", "Adresse", "Téléphone", "Appeler", "Itinéraire"),
        "en": ("nameEn", "districtEn", "addressEn", "On duty", "District", "Address", "Phone", "Call", "Directions"),
        "ar": ("nameAr", "districtAr", "addressAr", "حراسة", "الحي", "العنوان", "الهاتف", "اتصال", "الاتجاهات"),
    }[lang]
    name, district, address, badge, district_label, address_label, phone_label, call, directions = fields
    value = lambda key: pharmacy.get(key) or pharmacy.get(key.removesuffix("En").removesuffix("Ar"), "")
    phone = pharmacy.get("phone", "")
    phone_href = re.sub(r"[^0-9+]", "", phone.split("/")[0])
    route = pharmacy.get("mapsUrl", "")
    return (
        '<article class="pharmacy-card pharmacy-card--duty">'
        f'<div class="pharmacy-card-head"><h3>{html.escape(value(name))}</h3><span class="pharmacy-duty-badge pharmacy-duty-badge--night">{badge}</span></div>'
        f'<p class="pharmacy-card-line"><span>{district_label}</span><b>{html.escape(value(district))}</b></p>'
        f'<p class="pharmacy-card-line"><span>{address_label}</span><b>{html.escape(value(address))}</b></p>'
        f'<p class="pharmacy-card-line"><span>{phone_label}</span><b dir="ltr">{html.escape(phone)}</b></p>'
        f'<div class="pharmacy-actions"><a href="tel:{phone_href}" aria-label="{call} {html.escape(value(name), quote=True)}">{call}</a>'
        f'<a href="{html.escape(route, quote=True)}" target="_blank" rel="noopener noreferrer" aria-label="{directions} {html.escape(value(name), quote=True)}">{directions}</a></div>'
        '</article>'
    )


def prerender_pharmacies():
    data = json.loads((ROOT / "data/pharmacies-garde.json").read_text())
    page_languages = {
        "pharmacies.html": "fr",
        "pharmacies-en.html": "en",
        "pharmacies-ar.html": "ar",
    }
    for filename, lang in page_languages.items():
        path = ROOT / filename
        text = path.read_text()
        cards = "".join(render_duty_card(pharmacy, lang) for pharmacy in data.get("duty", {}).get("night", []))
        opening = '<div class="pharmacy-list" data-pharmacy-duty-list="night">'
        replacement = f"{opening}{cards}</div>"
        text, count = re.subn(
            rf"{re.escape(opening)}[\s\S]*?(?=</section>)",
            replacement,
            text,
            count=1,
        )
        if count != 1:
            raise ValueError(f"Missing on-duty pharmacy container in {filename}")
        path.write_text(text)


def update_sitemap(changed):
    path = ROOT / "sitemap.xml"
    text = path.read_text()
    for filename in changed:
        url = absolute_url(filename)
        pattern = rf"(<url>\s*<loc>{re.escape(url)}</loc>)([\s\S]*?</url>)"
        match = re.search(pattern, text)
        if not match:
            continue
        block = match.group(0)
        if "<lastmod>" in block:
            block = re.sub(r"<lastmod>[^<]+</lastmod>", "<lastmod>2026-09-08</lastmod>", block)
        else:
            block = block.replace("</loc>", "</loc>\n    <lastmod>2026-09-08</lastmod>", 1)
        text = text[:match.start()] + block + text[match.end():]
    path.write_text(text)


def main():
    available = {path.name for path in page_files()} | {"index.html"}
    changed = set()
    for path in page_files():
        text = path.read_text()
        before = text
        text = fix_pending_h1(text)
        if path.name in TITLE_OVERRIDES:
            text = re.sub(r"<title[^>]*>[\s\S]*?</title>", f"<title>{TITLE_OVERRIDES[path.name]}</title>", text, count=1, flags=re.I)
        text = improve_description(text)
        text = add_hreflang(text, language_group(path.name, available))
        text = add_open_graph(text, path.name)
        path.write_text(text)
        if text != before:
            changed.add(path.name)
    prerender_pharmacies()
    target = ROOT / "ophtalmologues-kenitra-ar.html"
    before = target.read_text()
    target.write_text(before.replace('href="vitamines-ar.html"', 'href="vitamines.html"'))
    if target.read_text() != before:
        changed.add(target.name)
    changed.update({"pharmacies.html", "pharmacies-en.html", "pharmacies-ar.html"})
    update_sitemap(changed)


if __name__ == "__main__":
    main()

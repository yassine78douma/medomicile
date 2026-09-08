# SEO Audit Classification

## Sitemap coverage

| Classification | URLs | Decision |
| --- | --- | --- |
| A - indexable | The homepages, service pages, language variants, directories, specialty pages, dialysis pages, and the four current pharmacy-sector hubs already in `sitemap.xml` | Keep indexed and listed. |
| B - not added | `pharmacies-al-fouarat-kenitra.html`, `pharmacies-al-houzia-kenitra.html`, `pharmacies-atlas-kenitra.html`, `pharmacies-bir-rami-est-kenitra.html`, `pharmacies-bir-rami-industrielle-kenitra.html`, `pharmacies-bir-rami-sud-kenitra.html`, `pharmacies-fourat-kenitra.html`, `pharmacies-gare-de-kenitra-kenitra.html`, `pharmacies-haddada-route-de-mehdia-kenitra.html`, `pharmacies-khabbazate-kenitra.html`, `pharmacies-lassakoun-kenitra.html`, `pharmacies-lotissement-assam-kenitra.html`, `pharmacies-maamora-kenitra.html`, `pharmacies-medina-centre-ville-kenitra.html`, `pharmacies-medina-kenitra.html`, `pharmacies-mimosas-kenitra.html`, `pharmacies-ouled-oujih-kenitra.html`, `pharmacies-route-de-mehdia-kenitra.html`, `pharmacies-saknia-fouarat-kenitra.html`, `pharmacies-saknia-medina-kenitra.html`, `pharmacies-saknia-ouled-arafa-kenitra.html`, `pharmacies-ville-nouvelle-bir-rami-est-kenitra.html`, `pharmacies-ville-nouvelle-kenitra.html` | Legacy micro-sector variants that overlap the current sector hubs. Do not add automatically. |
| B - technical | `google350b019a46edf1ae.html`, `yandex_d2b34c4a0fcfa3a9.html` | Search-engine verification files, not content pages. |
| C - external configuration | `/index.html` | The page is canonicalized away but remains HTTP 200 on GitHub Pages until a Cloudflare Redirect Rule is created. |

## Performance audit, no refactor performed

| Asset | Current size | Finding | Safe next step | Estimated gain | Risk |
| --- | ---: | --- | --- | ---:| --- |
| `style.css` | about 163 KB | Accumulated page-specific and repeated dark-theme rules | Audit selectors with production coverage before extracting page bundles | 15-30 KB | Medium |
| `script.js` | about 182 KB | Shared interactive features are bundled on every page | Split independently initialized modules only after route coverage tests | 25-45 KB | Medium |
| `assets/awareness/don-sang-article.png` | 1.82 MB | Large article image | Add an equivalent WebP/AVIF variant after visual comparison | 50-75% | Low |
| `assets/pharmacies/pharmacie-garde-kenitra-2026-07-20.png` | 1.50 MB | Historical pharmacy poster | Keep archive; optimize only if it remains linked from an indexable page | 50-75% | Low |

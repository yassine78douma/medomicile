# Cloudflare Redirect Rules

GitHub Pages ne prend pas en charge le fichier `_redirects`. Les redirections SEO permanentes doivent donc être configurées côté Cloudflare.

## Ancienne URL homepage

Créer une Cloudflare Redirect Rule avec les paramètres suivants :

Condition :

```text
URI Path equals /index.html
```

Destination :

```text
https://medomicile.com/
```

Status :

```text
301 Permanent Redirect
```

Preserve query string :

```text
Yes
```

Cette règle permet de traiter `https://medomicile.com/index.html` comme une ancienne URL et de consolider l'accueil sur `https://medomicile.com/`.

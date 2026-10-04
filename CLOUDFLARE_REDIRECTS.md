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

## Règles historiques à créer

Créer également les règles suivantes dans **Rules → Redirect Rules**. Pour chacune :
`301 Permanent Redirect`, conservation de la query string activée.

| Ancienne URL | Destination |
|---|---|
| `/services.html` | `/consultation.html` |
| `/medecins-kenitra.html` | `/medecins.html` |
| `/pharmacies-kenitra.html` | `/pharmacies.html` |
| `/neurologues-kenitra-ar.html` | `/ar/medecins.html` |
| `/contact-en.html` | `/contact.html` |
| `/brulures-premiers-gestes.html` | `/articles/brulures-premiers-gestes.html` |
| `/antibiotiques-infections-bon-usage.html` | `/articles/antibiotiques-infections-bon-usage.html` |
| `/hypoglycemie-reconnaitre-signes-agir.html` | `/articles/hypoglycemie-reconnaitre-signes-agir.html` |

Ne pas créer de règle Cloudflare pour les dossiers `canva-home/` ou `v19-*` tant
que leur usage n’a pas été confirmé. Ces chemins peuvent encore servir aux
prévisualisations locales.

## Limite actuelle

Le dépôt est hébergé par GitHub Pages et aucune connexion Cloudflare/API n’est
disponible dans l’environnement de travail. Les règles ci-dessus sont donc
préparées et documentées, mais ne peuvent pas être activées automatiquement
depuis GitHub. Leur activation nécessite un accès au compte Cloudflare qui
gère `medomicile.com`.

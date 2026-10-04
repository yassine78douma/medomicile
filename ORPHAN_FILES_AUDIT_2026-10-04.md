# Medomicile — rapport des fichiers orphelins

Date de l’audit : 2026-10-04  
Périmètre : dépôt `medomicile`, hors `.git/`  
Méthode : inventaire des fichiers, recherche de références HTML/CSS/JS/JSON/scripts, contrôle des workflows, sitemap et routes publiques.

## Résumé

Le dépôt contient environ **3 234 fichiers** :

- 2 074 HTML ;
- 810 PNG ;
- 66 JSON ;
- 43 JavaScript ;
- 23 Python ;
- 7 CSS ;
- 2 XML ;
- le reste en images, polices, documentation et fichiers de configuration.

Aucun fichier n’a été supprimé. L’analyse ne fournit actuellement **aucun candidat suffisamment prouvé pour la classification `SAFE_TO_DELETE`**.

## Classification

### ACTIVE

- `index.html`, pages de services et pages d’annuaire principales ;
- `ar/` et `en/` lorsqu’ils sont référencés par la navigation ou le sitemap ;
- `articles/`, `articles.html`, `articles/article-template.js` et `articles/rose-shell.js` ;
- `medomicile-canva.css` et `medomicile-canva.js` ;
- `assets/article-analytics.js` ;
- `data/doctors.json`, `data/establishments.json`, `data/laboratoires-kenitra.json` et les datasets pharmacies ;
- scripts de synchronisation, génération de cartes, SEO et mise à jour des pharmacies ;
- `.github/workflows/` ;
- `sitemap.xml`, `sitemap-cards.xml`, `robots.txt` et `CNAME`.

Ces fichiers sont utilisés directement ou indirectement par le site, les générateurs, les workflows ou le référencement.

### GENERATED

- `p/<slug>/index.html` : cartes professionnelles et routes QR/vCard ;
- pages d’annuaire générées à partir de `data/` ;
- fichiers produits par les scripts de synchronisation et de génération ;
- `sitemap-cards.xml` et rapports de génération.

Ils ne doivent pas être supprimés sur la seule base d’une absence de lien HTML direct.

### SOURCE_DATA

- `data/doctors.json` ;
- `data/establishments.json` ;
- `data/laboratoires-kenitra.json` ;
- `data/pharmacies-*.json` ;
- `data/translations-ar.json` ;
- `data/medical-specialties.json` ;
- fichiers liés aux cartes virtuelles et à la réconciliation.

Ces fichiers alimentent des pages ou des scripts et sont explicitement protégés par le cahier d’audit.

### BACKUP_PRESERVE

Les éléments suivants sont des sauvegardes locales et doivent être conservés tant qu’aucune validation humaine ne confirme leur archivage :

- `data/*.backup*` ;
- `p/*/*backup*` ;
- `scripts/*backup*` ;
- fichiers contenant une date de sauvegarde.

La présence de ces fichiers n’est pas une preuve d’inutilité.

### PROBABLY_UNUSED_BUT_UNCERTAIN

- `tmp/` ;
- les dossiers `v19-*-preview/` et `v19-review/` ;
- anciennes pages statiques sectorielles hors sitemap ;
- variantes historiques `*-en.html`, `*-ar.html` et pages de redirection HTML ;
- documents Markdown d’anciens audits ou de conception.

Ces éléments peuvent être des previews, des routes historiques, des entrées de campagne ou des supports de génération. Ils nécessitent une vérification des backlinks, de Search Console, des QR codes et des workflows avant toute suppression.

### UNKNOWN

- fichiers présents à la racine sans référence détectée par recherche textuelle ;
- médias sans référence directe dans HTML mais potentiellement utilisés par JSON, scripts ou cartes ;
- fichiers de rapport et exports utilisés pour réconciliation.

Une absence de résultat `rg` ne suffit pas à les classer comme orphelins.

## Routes et SEO

- `sitemap.xml` contient 36 URLs uniques et les URLs contrôlées répondent en HTTP 200 ;
- `sitemap-cards.xml` couvre séparément les cartes `/p/` ;
- les anciennes redirections HTML restent des routes publiques tant que les 301 Cloudflare ne sont pas activées ;
- les previews `v19-*` sont à maintenir en `noindex,nofollow` et ne doivent pas entrer dans le sitemap ;
- les pages de confidentialité sont maintenant en `noindex,follow` tant qu’elles restent des brouillons.

## Fichiers réellement orphelins

À ce stade : **aucun fichier ne peut être déclaré `SAFE_TO_DELETE` avec un niveau de preuve suffisant**.

Les seuls candidats possibles sont `tmp/`, les previews `v19-*` et certaines sauvegardes, mais leur statut est respectivement `PROBABLY_UNUSED_BUT_UNCERTAIN` ou `BACKUP_PRESERVE`, pas `SAFE_TO_DELETE`.

## Nettoyage recommandé, sans suppression immédiate

1. Exporter les URLs connues depuis Search Console et les QR/cartes professionnelles.
2. Vérifier les références externes vers les anciennes routes.
3. Vérifier que les workflows ne lisent pas `tmp/`, les rapports ou les backups.
4. Marquer explicitement les previews comme archivables si elles ne servent plus.
5. Réaliser un second audit après activation des 301 Cloudflare.

Conclusion : le dépôt est volumineux et hybride, mais il n’est pas suffisamment prouvé que les fichiers suspects soient morts. **Aucun nettoyage destructif n’est recommandé dans cet état.**

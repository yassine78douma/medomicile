# Cartes virtuelles Medomicile

## État de livraison

Implémentation locale des 9 et 10 septembre 2026. Aucune publication effectuée dans cette intervention.
Prévisualisation : http://127.0.0.1:4175/p/pr-walid-el-ouardi/

## 1. Sources existantes conservées

- `data/doctors.json` : les 386 fiches initiales et tous leurs champs non vides ont été conservés. Ajout des deux professionnels sponsorisés déjà présents dans le JavaScript et de trois traumatologues présents uniquement dans les pages. Compléments d'adresse/téléphone provenant du HTML, sans recherche ni invention de coordonnées.
- `data/dialysis-centers.json` et `data/laboratoires-kenitra.json` : fichiers inchangés, vérifiés octet par octet.
- La synchronisation du fichier médecins conserve les fiches manuelles, les alias traduits et les compléments issus des pages lorsque le champ de la feuille reste vide.

## 2. Nouvelles sources canoniques

- `data/establishments.json` : cliniques et hôpitaux, avec les trois versions de leur ancien HTML archivées dans `legacy_markup`.
- `data/radiology-centers.json` : extraction de la liste JavaScript, avec conservation des propriétés initiales. `type` est le type commun et `subtitle` le libellé médical d'origine.
- `data/pharmacies-kenitra.json` : annuaire permanent, indépendant du calendrier des gardes. Les anciennes fiches de secteur sont conservées dans `legacy_pages`.

Les champs d'archive sont des traces de migration, pas une deuxième source à modifier. Les champs normalisés constituent les données à éditer.

## 3. Effectifs

| Catégorie | Fiches virtuelles |
| --- | ---: |
| Médecins hors dentistes | 286 |
| Dentistes | 105 |
| Cliniques | 8 |
| Hôpitaux | 6 |
| Dialyse | 12 |
| Radiologie | 14 |
| Laboratoires | 17 |
| Pharmacies | 103 |
| **Total** | **551** |

Les 103 fiches de pharmacies comprennent deux paires de doublons potentiels conservés, et ne constituent pas une certification de 103 officines distinctes.

## 4. Anomalies conservées

- Deux noms de pharmacies ont plusieurs identifiants, adresses ou liens Maps : Pharmacie Lotissement Assam et Pharmacie Ibn Khaldoun. Aucun rapprochement automatique destructif.
- Huit fiches médecins ont un numéro incomplet à neuf chiffres sans préfixe explicite. Le numéro reste dans le JSON, mais aucun bouton d'appel n'est créé à partir de cette valeur. Les anciens affichages en notation scientifique ne sont pas interprétés comme un numéro fiable.
- Six occurrences de liens Maps diffèrent entre HTML et JSON, sur des pages localisées. Les variantes restent dans le HTML et dans le rapport ; les nouvelles actions utilisent le lien de la source canonique.
- Trois médecins HTML absents du JSON ont été récupérés : Dr Mohammed Chetto, Dr Jamal Manjaoui et Dr Karim El Khadime.
- Aucun contrôle externe de l'exactitude médicale, des horaires ou des coordonnées n'a été effectué. Les vérifications concernent la migration et le fonctionnement technique.

Rapports détaillés : `data/card-migration-report.json`, `data/card-doctor-reconciliation.json`, `data/card-directory-report.json`, `data/virtual-card-report.json`.

## 5. Moteur unique

`scripts/generate-professional-cards.py` adapte toutes les sources vers le même modèle. Le même gabarit HTML, `assets/virtual-card.css` et `assets/virtual-card.js` servent les huit catégories. Les fichiers HTML et l'index sont des produits de compilation, jamais des sources à éditer à la main.

Le modèle prévoit `claimed`, `featured`, `bio`, `profile_image`, `logo` et `gallery`. Aucune authentification n'a été ajoutée. L'interface est disponible en français, anglais et arabe ; les noms et données médicales ne sont pas traduits automatiquement.

## 6. URLs

- Professionnels : `/p/<slug>/`, par exemple `/p/pr-walid-el-ouardi/` et `/p/dr-youssef-gaouri/`.
- Établissements : `/e/<slug>/`, par exemple `/e/clinique-internationale-de-kenitra/`.
- Ces chemins utilisent un `index.html`, compatible avec un hébergement statique. Les URL professionnelles `.html` et les anciens liens vCard sont conservés.
- Conserver `id` et `slug` lors d'un changement de coordonnées. Le changement volontaire d'un identifiant nécessite une redirection pour préserver les anciens QR.
- 295 fiches sont indexables ; 256 restent accessibles en `noindex,follow`. Un simple lien de recherche Maps générique n'est pas considéré comme un contenu suffisant. Les fiches indexables figurent dans `sitemap-cards.xml`, déclaré dans `robots.txt`.

## 7. QR codes

551 PNG locaux dans `assets/cards/qr/`, générés avec `qrcode` 8.2. Leur contenu est l'URL permanente Medomicile, jamais le téléphone ou le lien Google Maps. Aucun service externe de QR n'est nécessaire à l'affichage. Le QR est également intégré à l'image de partage et téléchargeable séparément.

## 8. vCards

vCard 3.0 : `FN`, catégorie/spécialité, tous les numéros utilisables, adresse disponible, URL Medomicile et responsable si fourni. `ORG` est présent pour les établissements. Les noms de famille ne sont pas devinés. Encodage UTF-8, CRLF, échappement et pliage des lignes sont testés. Les anciens liens de contact restent fonctionnels.

## 9. Partage image et lien

Le bouton Partager de l'annuaire ouvre la fiche et sa boîte de partage. Sur la fiche : partager la carte en image, partager le lien, copier le lien, WhatsApp ou télécharger l'image.

Le PNG est créé dans le navigateur à partir des données de la fiche, en 1080 × 1350 px. Il contient le logo réel, une photo réelle si disponible, le nom, la spécialité/le type, la localisation disponible, le téléphone utilisable et le QR. Une image externe inaccessible est remplacée par le logo Medomicile, pas par une photo fictive.

Le partage de fichier utilise `navigator.canShare` et `navigator.share`. Sinon l'image est téléchargée. Une annulation du partage n'est pas signalée comme une erreur. Si le presse-papiers est refusé, le lien est présenté dans un champ sélectionnable, sans faux message de réussite.

Le menu met en avant deux actions : Partager le lien et Partager la carte en image. Les solutions de secours sont regroupées en dessous. Le partage de fichier transmet le PNG, le texte et l'URL Medomicile. Nom du fichier : `<slug>-medomicile.png`. Le Canvas utilise le sens RTL pour les textes arabes ; les données fournies en français restent en français. Aucune bibliothèque de capture DOM ni image sociale préfabriquée par fiche n'est chargée ou stockée dans Git.

## 10. Raccordement des annuaires

- 843 articles statiques, répartis dans 64 pages, sont rattachés sans ambiguïté à leur fiche virtuelle. La liste exacte figure dans `data/card-directory-report.json`.
- La zone d'actions est commune : Appeler, WhatsApp, Itinéraire, Partager et Enregistrer le contact, selon les données utilisables.
- Radiologie : la liste consommée par l'ancien renderer est désormais compilée depuis son JSON canonique.
- Espaces professionnels : leur configuration JavaScript est compilée depuis les fiches manuelles de `doctors.json`, en conservant leur position.
- Pharmacies : l'annuaire chargé par JavaScript lit le nouveau JSON permanent. Le générateur des quatre grandes zones lit également cette source, et les liaisons des anciennes pages sont conservées.
- Laboratoires et dialyse conservent leur alimentation JSON existante. Les champs de contact liés des pages sont régénérés ; le texte d'adresse français, les informations de direction de la clinique et les boutons suivent la source canonique.

## 11. Ce qui reste dans l'ancien HTML/JavaScript

La migration est volontairement progressive : textes éditoriaux et médicaux, traductions historiques, présentation des horaires, classement et certaines listes de secteurs restent dans les pages. Les données de garde datées et leur secours JavaScript ne sont pas remplacés par un statut permanent de garde.

Les listes JavaScript de radiologie et de sponsors sont encore physiquement présentes mais générées : ne pas les modifier à la main. L'index `data/virtual-card-index.json` est également généré. Les trois nouveaux JSON conservent des champs historiques pour éviter toute perte.

Toutes les anciennes listes ne sont pas intégralement reconstruites à partir du JSON : le générateur existant de médecins conserve encore certaines listes déjà remplies. Une nouvelle entité obtient automatiquement sa carte, son QR et sa vCard au build ; son insertion dans certaines anciennes listes reste une étape distincte.

## 12. Fichiers et exploitation

Code principal : `scripts/generate-professional-cards.py`, `scripts/build-card-directories.py`, `scripts/build-virtual-cards.py`, `assets/virtual-card.js`, `assets/virtual-card.css`, `assets/virtual-directory.js`, `assets/virtual-directory.css`.

Migration : `scripts/extract-card-sources.py`, `scripts/reconcile-legacy-doctors.py`. Ce sont des outils de migration, pas des synchronisations quotidiennes ; ne pas relancer l'extraction sur les JSON déjà créés.

Autres modifications : `script.js`, générateur des secteurs pharmacies, synchronisation médecins, workflows GitHub Actions, `robots.txt`, `.gitignore`, `.gitattributes`, pages liées et leurs références de cache. Générés : `p/`, `e/`, `contacts/`, `assets/cards/qr/`, index/rapports JSON et sitemap. Lucide est fourni localement avec sa licence.

### Reconstruire

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/cards-requirements.txt
.venv/bin/python scripts/build-virtual-cards.py
.venv/bin/python scripts/test-virtual-cards.py
```

Le workflow `build-virtual-cards.yml` reconstruit et enregistre les artefacts lors d'une modification d'une des six sources. Le workflow médecins appelle le même build. Ces workflows n'ont pas été exécutés à distance pendant cette intervention ; leur déploiement dépend du mécanisme d'hébergement existant.

Pour une nouvelle catégorie, ajouter l'adaptateur dans `SOURCES`, son libellé dans `TYPES` et les traductions du badge. Il n'est pas nécessaire de créer un composant ni un script de partage propre à cette catégorie.

### Vérifications effectuées

- Six tests de régression : huit catégories, 551 pages, actions conditionnelles, métadonnées, vCards, fichiers QR, liens de 843 articles, cas incomplets et préservation des profils manuels lors d'une synchronisation simulée.
- 64 cas navigateur : huit catégories, quatre largeurs (360, 390, 537 et 1440 px), Chromium et WebKit ; aucun débordement horizontal ni erreur JavaScript constaté.
- Sept annuaires contrôlés dans les deux moteurs ; menus, langues, presse-papiers refusé et partage simulé testés.
- 551 QR décodés vers leur URL exacte ; exports PNG français et arabes contrôlés en 1080 × 1350 avec QR décodable.
- Build reproductible : une seconde exécution ne modifie pas les artefacts contrôlés.
- Vérification des données : aucun champ initial non vide perdu ou changé dans les 386 médecins d'origine ; dialyse et laboratoires inchangés.

Les dialogues de partage ont été simulés pour les assertions ; aucun envoi réel à WhatsApp, Facebook ou à un destinataire n'a été effectué. L'import vCard dans un vrai carnet d'adresses de téléphone reste à tester sur appareil.

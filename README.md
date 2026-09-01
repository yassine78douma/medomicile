# Medomicile

## Laboratoires à Kénitra

Les pages `laboratoires-kenitra.html`, `laboratories-kenitra.html` et `laboratoires-kenitra-ar.html` utilisent `data/laboratoires-kenitra.json` comme base de suivi.

Pour publier un laboratoire, vérifier d'abord le nom officiel, l'adresse, le téléphone, les horaires, le lien Google Maps, la note Google et le nombre d'avis. Ensuite seulement, compléter l'entrée JSON et passer `verified` à `true`.

Un emplacement sponsorisé doit toujours garder `sponsored: true`, des dates `sponsorStartDate` / `sponsorEndDate`, et être clairement identifié comme sponsorisé sur la page. Ne jamais présenter un laboratoire sponsorisé comme meilleur, recommandé, numéro 1, ou comme une garantie de trafic.

Site vitrine statique pour un service de soins a domicile a Kenitra et region.

## Contenu

- Page francaise publique : `https://medomicile.com/`
- Page anglaise : `en.html`
- Page arabe : `ar.html`
- Styles : `style.css`
- Interactions : `script.js`
- Donnees pharmacies de garde : `data/pharmacies-garde.json`

## Publication

Le site est pret a etre publie sur GitHub Pages ou tout hebergement statique.

Point d'entree public principal : `https://medomicile.com/`.

## Mise a jour des medecins specialistes

Le fichier `médecin spécialiste kenitra.xlsx` est la source editable. Pour regenerer les donnees et les rapports en local :

```bash
python3 scripts/sync-doctors.py
```

Le script ecrit `data/doctors.json`, `data/doctors-report.json` et `data/doctors-duplicates.json`. Il ignore les lignes qui ne contiennent qu'un titre de specialite, separe les telephones avec `|` et refuse un remplacement qui ferait disparaitre au moins 20 % des medecins existants, sauf avec `--allow-mass-replacement` apres verification.

Le workflow `.github/workflows/update-doctors.yml` se declenche lorsqu'un nouveau classeur est pousse ou manuellement depuis GitHub Actions. Les doublons sont signales dans le rapport et ne sont jamais supprimes automatiquement.

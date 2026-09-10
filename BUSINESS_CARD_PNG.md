# Cartes PNG : identite HERO Medomicile

Travail local, non publie. Ce document remplace le format SVG indique dans le precedent rapport de partage.

## References inspectees avant modification

`centres-dialyse-kenitra.html`, `hopitaux.html` et `laboratoires-kenitra.html` utilisent `.directory-hero.page-hero`. Le fichier `laboratoires.html` n'existe pas dans ce projet.

`style.css` definit Manrope pour les titres, Inter pour le texte et Tajawal pour l'arabe. Les polices correspondantes sont maintenant chargees localement uniquement par le moteur PNG, avec leurs licences OFL. Le logo reste exactement `assets/brand/medomicile-logo.png`.

Couleurs Standard reprises des variables CSS : `--blue-950` #082f49, `--blue-850` #0f4c81, `--blue-700` #2f80ed, `--blue-100` #eaf3ff, `--surface` #ffffff, `--soft` #f8fafc, `--muted` #334155.

Couleurs Gold existantes : `--gold-strong` #b88a2b, `--gold` #c6a969, `--gold-soft` #f7f0df ; #8a6a15, deja utilise dans les badges du site, pour les petits textes dores plus contrastes. Les titres restent bleu marine.

Le HERO reel a un rayon de 16 px, un fond blanc/soft et des gradients diffus a 86%/18% et 8%/88%, ainsi qu'un shader ambient. Il ne contient pas de dessin de vague reutilisable. Le PNG reprend la palette et la typographie, avec les courbes peripheriques explicitement demandees : ce sont des chemins Canvas reserves aux cartes, pas une pretendue copie exacte d'un asset HERO. Aucune bordure lourde ni ombre ajoutee au PNG.

## Moteur et format

`generateBusinessCard(entity, options)` dans `assets/business-card.js` est le moteur unique. Il renvoie le Canvas, le Blob PNG, le theme et les rectangles de mise en page pour les tests. Le contenu varie selon les champs disponibles ; aucune donnee metier n'est inventee ou reecrite.

- Resolution constante : **1700 x 1100 px**, soit **17:11 = 1,545454...**, identique a 85:55.
- Metadonnees PNG `pHYs` : 20 000 pixels/metre, soit 508 ppp, correspondant exactement a **85 x 55 mm**. Certains logiciels ignorent ces metadonnees : choisir alors 85 x 55 mm a l'impression, sans etirement.
- Standard/Gold : memes positions, dimensions, courbes, polices et regles de retour a la ligne. Seules les couleurs et le badge partenaire changent.
- Detection automatique : `variant` premium/gold ou booleen `featured`, `premium`, `sponsored`, `gold` vrai. L'adaptateur central existant reste inchange.
- Noms, specialites, responsables, adresses et telephones : retour a la ligne et taille adaptee dans une zone reservee. Aucun ellipsis ni troncature silencieuse ; si un futur contenu exceptionnel depasse les limites, le moteur refuse l'export plutot que produire une carte illisible.
- Responsable : directeur pour un hopital si fourni, reanimateur pour une clinique si fourni, sinon responsable present dans le profil. Aucune personne ajoutee depuis l'exemple du brief.
- QR local de la fiche personnelle, sans changement d'URL, avec modules alignes sur des pixels entiers et zone blanche. Jamais Google Maps comme QR principal.

## Interface

La modal contient l'apercu au ratio fixe et uniquement **Partager le lien**, puis **Telecharger la carte de visite**. Le telechargement utilise le Blob genere et un nom `<slug>-medomicile-carte-visite.png`. La vCard, WhatsApp de la fiche et le partage du lien HTTPS sont conserves. Aucun lien de fichier local n'est utilise.

## Verification

- 551 profils actuels generes sans erreur de mise en page.
- 56 PNG Standard/Gold controles sous Chromium et WebKit : huit categories, noms courts/longs, adresse longue, plusieurs specialites, absence de responsable/telephone.
- Rectangles compares entre Standard et Gold, limites internes et absence de chevauchement testes.
- Dimensions, resolution physique et destination exacte du QR controles par decodage des PNG.
- 108 cas d'interface : 1440, 1024, 768, 430, 390, 360 px dans Chromium/WebKit ; apercu, telechargement, partage, copie de secours et vCards.
- Sept tests Python reussis. Pas de test physique iPhone/Android ou d'epreuve imprimee revendique.

## Perimetre

Sources modifiees : `assets/business-card.js` (nouveau), `assets/virtual-card.js`, `assets/virtual-card.css`, `assets/fonts/`, `scripts/generate-professional-cards.py`, tests associes et ce rapport. Les pages virtuelles sous `p/` et `e/` sont regenerees pour le menu, l'apercu et les versions d'assets.

Les sources JSON, contacts VCF, QR, navbar, HERO, footer, pages annuaires, classement, SEO et `style.css` ne sont pas modifies. Les modifications locales de partage de la demande precedente sont conservees.

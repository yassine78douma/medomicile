# Partage simplifie et audit Apple Wallet

## Partage

La modal contient seulement deux actions et sa fermeture : Telecharger la carte de visite ; Partager le lien. Les boutons Copier, WhatsApp, partage image, export PNG social et ancien libelle 85 x 55 mm sont retires de la modal. WhatsApp et Enregistrer le contact restent sur la fiche.

Le telechargement genere par Canvas une image incorporee dans un SVG autonome de 85 x 55 mm, puis utilise un Blob temporaire revoque apres 60 secondes. Nom : `<slug>-medomicile-carte-visite.svg`. Le moteur commun conserve Standard/Gold (`variant=premium` pour Gold). Aucun fichier local ni URL Blob n'est partage : `navigator.share` recoit uniquement titre, texte et URL HTTPS permanente Medomicile. Sans partage natif, copie automatique et confirmation ; si le navigateur refuse aussi le presse-papiers, un champ selectionnable montre le lien sans ajouter de bouton.

La vCard 3.0 reste hors modal, avec FN, TEL, ADR si disponibles et URL permanente. Le format est destine aux applications Contacts, notamment iPhone ; l'import reel sur appareil physique reste a valider. Aucun faux fichier Wallet n'est produit.

## Audit Wallet

Le site actuel est statique sur GitHub Pages, sans serveur de signature configure. Une image n'est pas un pass Wallet. Apple exige un paquet contenant `pass.json`, les images, un manifeste et une signature reposant sur un certificat Pass Type ID. Voir [Building a Pass](https://developer.apple.com/documentation/walletpasses/building-a-pass).

Un pass de type `generic` convient a une carte professionnelle. Le certificat doit correspondre au Pass Type ID et au Team ID ; la chaine de signature doit inclure le certificat intermediaire Apple WWDR approprie. Voir [Creating a generic pass](https://developer.apple.com/documentation/walletpasses/creating-a-generic-pass).

Safari attend le type MIME `application/vnd.apple.pkpass`. La distribution peut se faire par un lien HTTPS avec le badge officiel Apple, a activer seulement apres validation d'un vrai pass signe. Voir [Distributing Passes](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/DistributingPasses.html).

## Architecture proposee, non active

1. Compte Apple Developer de l'organisation, Team ID, Pass Type ID, certificat associe et cle privee. Leur disponibilite n'a pas ete fournie ni presumee.
2. Service HTTPS separe de GitHub Pages, ou CI securisee avec stockage prive des secrets. Ne jamais placer cle, certificat exporte avec cle ou mot de passe dans les assets, le depot public, les journaux ou le navigateur.
3. Endpoint propose `GET /wallet/{type}/{slug}.pkpass` : charger le profil depuis l'index central approuve, refuser un profil inconnu, ne pas accepter d'URL ni de contenu arbitraire du client. Appliquer limites de debit et cache.
4. Mapping : numero de serie stable derive du chemin permanent ; nom, type/specialite, telephone et adresse depuis le profil ; QR contenant exactement `entity.url` ; couleurs Standard/Gold. Le statut ne modifie ni numero de serie ni URL. Fournir les assets logo/icon aux tailles demandees par Apple.
5. Generer manifeste et signature cote service avec bibliotheque maintenue, empaqueter en `.pkpass`, servir le MIME attendu. Planifier expiration/rotation du certificat et invalidation du cache apres mise a jour du profil.
6. Test bloquant avant activation : signature, MIME, QR et ajout effectif dans Wallet sur iPhone. Aucun bouton public tant que cette chaine n'est pas operationnelle. Aucun achat ni provisionnement de service realise.

Le QR ouvre toujours la fiche a jour. Cela ne met pas automatiquement a jour les champs deja stockes dans Wallet : les mises a jour du pass lui-meme demandent un service PassKit additionnel, distinct de cette premiere version.

## Verification

Tests Python des 551 cartes/vCards et des deux seules actions ; tests Chromium/WebKit sur 360, 390, 537 et 1440 px. Partage natif simule, copie de secours et refus du presse-papiers testes. Exports SVG controles avec decodage des QR. Aucun essai physique iPhone/Android, ajout Contacts reel ou Wallet signe n'est revendique.

# Medomicile — Apple Wallet V1

Ce dossier contient uniquement le gabarit public du Generic Pass. Aucun pass distribuable n'est produit ici tant que la signature Apple n'est pas configurée.

## Préparé

- `pass.json.example` : contenu unique de la carte officielle Medomicile.
- QR code statique vers `https://medomicile.com/`, sans donnée personnelle.
- Identité visuelle de base : bleu marine, blanc et touche dorée.
- Numéro de série stable : `medomicile-official-v1`.

Le paquet final devra aussi contenir les assets Wallet (`icon.png`, `icon@2x.png`, éventuellement `logo.png`), puis un `manifest.json` et une signature PKCS#7 détachée. Ces deux derniers fichiers ne doivent être générés qu'à partir d'un certificat Apple valide.

## À fournir dans Apple Developer

1. Créer le Pass Type ID `pass.com.medomicile.card`.
2. Fournir le Team ID correspondant.
3. Créer un certificat Pass Type ID pour cet identifiant.
4. Installer localement le certificat et la chaîne Apple WWDR, sans les copier dans Git.

La clé privée reste exclusivement dans le service de signature ou dans les secrets CI. Elle ne doit jamais être demandée dans le navigateur ni commise dans ce dépôt public.

## Architecture de production restante

GitHub Pages est statique : il ne peut pas signer un `.pkpass` à la volée. Il faut un service HTTPS séparé ou une CI sécurisée qui :

1. copie le gabarit et les assets dans un répertoire temporaire ;
2. remplace `REPLACE_WITH_APPLE_TEAM_ID` ;
3. calcule les SHA-1 dans `manifest.json` ;
4. signe le manifeste avec le certificat Pass Type ID et la clé privée ;
5. empaquette le tout en `.pkpass` ;
6. sert le fichier avec `application/vnd.apple.pkpass`.

Le bouton « Ajouter à Apple Wallet » ne doit être ajouté au site qu'après validation d'un vrai pass signé sur un iPhone. Un fichier ZIP renommé ou une signature fictive ne fonctionnerait pas.

# Cartes standard et premium

Implementation locale du 10 septembre 2026. Non publiee.

1. **Champ utilise.** `variant` est derive par l'adaptateur : `premium` si `featured`, `sponsored` ou `premium` vaut le booleen JSON `true`, sinon `standard`. Les chaines comme `"false"` ne sont pas interpretees comme vraies. Aucun statut n'est code par nom ou par page. La synchronisation des medecins conserve ces trois champs.

2. **Moteur commun.** `scripts/generate-professional-cards.py` produit toutes les pages avec le meme template. `assets/virtual-card.js` utilise une seule fonction Canvas `makeImage()` pour les deux variantes. Le statut est transmis dans le JSON de la carte et dans `data-variant`.

3. **Presentation.** Standard : blanc, bordure bleue discrete. Premium : bordure doree, fond tres legerement teinte, badge PARTENAIRE MEDOMICILE traduit en anglais/arabe, photo/logo plus grand, nom renforce, actions plus visibles et bande QR doree. Expertise (texte ou liste), sous-specialite et bio sont affichees lorsqu'elles sont fournies. Aucun portrait, qualification ou texte medical n'est invente. Les longues specialites existantes restent intactes.

4. **Profils premium detectes.** Pr. Walid El Ouardi ; Dr Youssef Gaouri ; Clinique Internationale de Kenitra ; Clinique Internationale de Kenitra - service radiologie. Tous sont detectes via `featured: true`. Les 547 autres cartes sont standard. Le meme adaptateur couvre les huit categories, dont clinique, laboratoire et dialyse.

5. **Image standard.** Exemple : `test-results/cards/chromium-doctor-standard-share.png`, Dr Mouad Daoudi. Export PNG 1080 x 1350 au clic, sans fichier social pregenere par profil.

6. **Image premium.** Exemple : `test-results/cards/chromium-doctor-premium-share.png`, Pr. Walid El Ouardi. Meme resolution, badge partenaire, accent dore, identite plus presente et QR encadre. Le menu conserve partage image, partage lien, copie et telechargement de secours.

7. **QR et URL.** Aucun changement de slug ou de destination. Le statut n'intervient pas dans la construction des URL, chemins QR ou chemins de contact. Des tests couvrent les trois drapeaux dans les huit categories. Les QR personnels et ceux des PNG sont controles par decodage.

8. **vCard et coordonnees.** La fonction vCard est inchangee. Un test compare exactement la vCard standard/premium pour chaque drapeau et chaque categorie. Nom, specialite, telephone, WhatsApp, adresse et Maps ne sont pas modifies par le statut. Aucun fichier source de coordonnees n'a ete modifie pour cette evolution.

9. **Responsive et partage.** 72 cas Chromium/WebKit, largeurs 360, 390, 537 et 1440 px, sans debordement horizontal ni erreur JavaScript. Exports francais/arabe, interface anglaise, partage fichier/lien simule, telechargement de secours et copie testes. Cela ne remplace pas des essais sur iPhone/Android physiques ou dans WhatsApp/Telegram. Les liens WhatsApp utilisent les numeros deja presents ; leur presence ne confirme pas l'inscription du numero sur WhatsApp.

10. **Fichiers modifies pour cette evolution.** `scripts/generate-professional-cards.py`, `scripts/sync-doctors.py`, `assets/virtual-card.css`, `assets/virtual-card.js`, `scripts/test-virtual-cards.py`, `scripts/test-virtual-cards-browser.mjs`, ce rapport ; pages generees sous `p/` et `e/`, index `data/virtual-card-index.json`. Les autres modifications locales anterieures sont conservees. Construction via `scripts/build-virtual-cards.py`, sept tests Python reussis, controle `git diff --check` reussi.

Apercus : http://127.0.0.1:4175/p/dr-mouad-daoudi/ et http://127.0.0.1:4175/p/pr-walid-el-ouardi/ .

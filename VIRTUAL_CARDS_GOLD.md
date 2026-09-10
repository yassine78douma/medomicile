# Harmonisation Standard / Gold

Cette evolution remplace les differences de disposition decrites dans le precedent rapport Premium. Travail local, non publie.

- Composant : template unique `page()` dans `scripts/generate-professional-cards.py`, styles `assets/virtual-card.css`, export et partage `assets/virtual-card.js`.
- Variable : `variant="premium"` est conservee pour Gold. Elle est derivee des booleens centraux `featured`, `sponsored` ou `premium`. Aucun nouveau statut ni template par categorie.
- Profils Gold : Pr. Walid El Ouardi, Dr Youssef Gaouri, Clinique Internationale de Kenitra et son service radiologie.
- Standard : blanc, bleu Medomicile, bordure legere, typographie existante.
- Gold : memes dimensions, ordre, sections, tailles de texte/photo, boutons et QR ; seule la palette change, avec bordure doree, fond tres legerement chaud, badge partenaire, separateurs et icones secondaires dores. Aucun qualificatif de recommandation.
- Image sociale : 1080 x 1350, meme disposition pour les deux variantes ; Gold ajoute bordure, badge partenaire et accent QR. Expertise affichee seulement si disponible, donnees conservees.
- Carte physique : export SVG autonome de dimensions explicites 85 x 55 mm, contenant une image 1004 x 650 pixels (environ 300 ppp), logo, identite, specialite, adresse, telephone et QR. Disponible dans le menu de partage des deux variantes afin de conserver la meme UX. Imprimer a taille reelle ; pas de fond perdu ni de profil CMJN d'imprimeur inclus.
- QR : memes URL permanentes, independantes du statut. Aucun changement de vCard ni de donnees metier.
- Responsive : tests Chromium/WebKit a 360, 390, 537 et 1440 px. Le test bascule le theme sur un meme profil et compare exactement les positions et dimensions de la carte, photo, titre, actions, contact et QR.
- Types compatibles : medecin, dentiste, clinique, hopital, laboratoire, dialyse, radiologie, pharmacie.

Comparaison visuelle : `test-results/cards/chromium-standard-gold-comparison.png` (meme profil pour isoler le theme). Exports sociaux et physiques dans `test-results/cards/`. Les essais de navigateur ne remplacent pas des tests sur telephones physiques ou une epreuve imprimee.

Fichiers source modifies : generateur commun, CSS, JavaScript, tests navigateur et ce rapport. Les pages generees `p/` et `e/` sont regenerees. Les modifications locales anterieures sont preservees.

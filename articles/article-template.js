const source = document.body.dataset.source;
const sourceFile = source && source.startsWith('articles/content/') ? source : `articles/content/${source}`;
const articleDates = {
  'brulures-premiers-gestes.html': '13 septembre 2026',
  'antibiotiques-infections-bon-usage.html': '25 septembre 2026',
  'hypoglycemie-reconnaitre-signes-agir.html': '18 septembre 2026'
};
const target = document.querySelector('[data-article-source]');
const header = document.querySelector('.site-header');
const headerInner = header?.querySelector('.header-inner');
if (headerInner && !headerInner.querySelector('.header-actions')) {
  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.innerHTML = '<a class="phone-link" href="tel:+212663058222" aria-label="Appeler Medomicile">☎</a><a class="header-cta" href="tel:+212663058222">Appeler</a><button class="menu-toggle" type="button" aria-controls="article-mobile-menu" aria-expanded="false">☰<span class="sr-only">Ouvrir le menu</span></button>';
  headerInner.append(actions);
}
if (header && !header.querySelector('.mobile-menu')) {
  const menu = document.createElement('nav');
  menu.id = 'article-mobile-menu';
  menu.className = 'mobile-menu';
  menu.setAttribute('aria-label', 'Navigation mobile');
  menu.innerHTML = '<a href="../index.html">Accueil</a><a href="../consultation.html">Consultation</a><a href="../ambulance.html">Ambulance</a><a href="../urgences.html">Urgences</a><a href="../annuaire.html">Annuaire</a><a href="../articles.html">Articles</a><a href="../contact.html">Contact</a>';
  header.append(menu);
}
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  mobileMenu?.classList.toggle('is-open', !open);
});
mobileMenu?.addEventListener('click', () => {
  toggle?.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('is-open');
});
if (!document.querySelector('.bottom-nav')) {
  const bottom = document.createElement('nav');
  bottom.className = 'bottom-nav';
  bottom.setAttribute('aria-label', 'Navigation rapide mobile');
  bottom.innerHTML = '<a href="../index.html"><span>⌂</span><small>Accueil</small></a><a href="../consultation.html"><span>＋</span><small>Consultation</small></a><a href="../urgences.html"><span>!</span><small>Urgences</small></a><a href="../annuaire.html"><span>⌕</span><small>Annuaire</small></a>';
  document.querySelector('.prototype-shell')?.append(bottom);
}
const linkArticleAuthor = (root) => {
  const author = root.querySelector('.medical-article__author');
  const name = author?.querySelector('strong');
  if (!author || !name || name.textContent.trim() !== 'Dr Wiame Fimoud' || author.querySelector('.author-linkedin')) return;
  const link = document.createElement('a');
  link.className = 'author-linkedin';
  link.href = 'https://www.linkedin.com/in/wiame-fimoud-b9425120a/';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Profil LinkedIn de Dr Wiame Fimoud');
  link.textContent = name.textContent;
  name.replaceWith(link);
};

const fallbackArticle = () => {
  const key = source.split('/').pop().replace('.html', '');
  const content = {
    'brulures-premiers-gestes': ['Brûlures : les premiers gestes à faire à la maison', 'Eau bouillante, huile de cuisson ou thé chaud : les bons réflexes comptent dès les premières minutes.', 'Refroidissez la zone sous une eau fraîche, protégez-la proprement et demandez un avis médical si la brûlure est étendue, profonde ou située sur une zone sensible.'],
    'antibiotiques-infections-bon-usage': ['Un antibiotique pour chaque infection ? Pas vraiment', 'Les antibiotiques ne sont pas utiles contre les virus et doivent être pris uniquement selon un avis médical.', 'Respectez la prescription, ne partagez jamais un traitement et ne gardez pas les restes pour une prochaine maladie.'],
    'hypoglycemie-reconnaitre-signes-agir': ['Hypoglycémie : reconnaître les signes et agir', 'Frissons, sueurs froides, tremblements ou faim intense peuvent signaler une baisse du sucre dans le sang.', 'Si la personne est consciente, donnez rapidement une source de sucre et surveillez l’évolution. En cas de malaise important, appelez les secours.']
  }[key] || ['Article santé Medomicile', 'Des repères simples pour mieux comprendre votre santé.', 'Cet article présente des informations générales. Demandez un avis médical lorsque la situation vous inquiète.'];
  const article = document.createElement('article'); article.className = 'medical-article'; article.innerHTML = `<header class="medical-article__hero"><span class="article-tag">Conseils santé · 2–3 min</span><h1>${content[0]}</h1><p>${content[1]}</p></header><div class="medical-article__body"><p>${content[2]}</p><h2>À retenir</h2><p>Chaque situation est différente. En cas de doute, contactez un professionnel de santé ou les urgences.</p></div><aside class="medical-article__author"><span class="article-tag">Article rédigé par</span><strong>Dr Wiame Fimoud</strong></aside>`; return article;
};

const enhanceArticle = (article) => {
  const hero = article.querySelector('.medical-article__hero');
  const title = article.querySelector('h1')?.textContent.trim() || 'Article santé';
  const intro = hero?.querySelector('p')?.textContent.trim() || '';
  const image = document.createElement('div');
  const visualKey = source.split('/').pop().replace('.html', '');
  image.className = `article-cover-visual article-cover-${visualKey}`;
  image.setAttribute('role', 'img');
  image.setAttribute('aria-label', 'Illustration médicale de l’article');
  image.innerHTML = '<span>MEDOMICILE</span><strong>Prendre soin,<br>simplement.</strong>';
  article.insertBefore(image, article.firstChild);
  if (hero) {
    hero.querySelector('.article-tag')?.remove();
    const meta = document.createElement('div');
    meta.className = 'article-meta';
    meta.innerHTML = `<span>CONSEILS SANTÉ</span><span>${articleDates[source.split('/').pop()] || 'Date à confirmer'}</span><span>2–3 min de lecture</span>`;
    hero.insertBefore(meta, hero.firstChild);
    const stats = document.createElement('div');
    stats.className = 'article-stats';
    stats.innerHTML = '<button type="button" class="article-share-button">□ Partager</button><span class="article-share-status" role="status" aria-live="polite"></span>';
    stats.querySelector('.article-share-button').addEventListener('click', async () => {
      const shareData = { title, text: intro, url: window.location.href };
      const status = stats.querySelector('.article-share-status');
      try {
        if (navigator.share) await navigator.share(shareData);
        else { await navigator.clipboard.writeText(window.location.href); status.textContent = 'Lien copié'; }
      } catch (error) { if (error.name !== 'AbortError') status.textContent = 'Copie du lien indisponible'; }
    });
    hero.after(stats);
  }
  const author = article.querySelector('.medical-article__author');
  if (author) {
    author.classList.add('article-author-card');
    const controls = document.createElement('div');
    controls.className = 'article-reading-controls';
    controls.innerHTML = '<span>LECTURE</span><button type="button" data-reading="smaller" aria-label="Réduire la taille du texte">A−</button><button type="button" data-reading="larger" aria-label="Augmenter la taille du texte">A+</button><button type="button" data-reading="comfort" aria-pressed="false">Mode confortable</button>';
    author.before(controls);
    controls.addEventListener('click', (event) => {
      const button = event.target.closest('button'); if (!button) return;
      if (button.dataset.reading === 'smaller') article.classList.add('reading-small');
      if (button.dataset.reading === 'larger') article.classList.remove('reading-small');
      if (button.dataset.reading === 'comfort') { const on = article.classList.toggle('reading-comfort'); button.setAttribute('aria-pressed', String(on)); }
    });
    const progress = document.createElement('div');
    progress.className = 'article-reading-progress';
    progress.setAttribute('aria-label', 'Progression de lecture');
    progress.innerHTML = '<span></span>';
    article.insertBefore(progress, article.firstChild);
    const updateProgress = () => { const rect = article.getBoundingClientRect(); const total = Math.max(1, article.offsetHeight - window.innerHeight); const value = Math.min(100, Math.max(0, (-rect.top / total) * 100)); progress.firstElementChild.style.width = `${value}%`; };
    window.addEventListener('scroll', updateProgress, { passive: true }); updateProgress();
  }
  const quote = document.createElement('blockquote');
  quote.className = 'article-highlight';
  quote.innerHTML = `<strong>${title}</strong><p>${intro}</p>`;
  const body = article.querySelector('.medical-article__body');
  if (body) body.insertBefore(quote, body.firstChild);
  const after = document.createElement('section');
  after.className = 'article-follow-up';
  after.innerHTML = '<div><span class="article-follow-up__eyebrow">BESOIN D’ACCOMPAGNEMENT ?</span><h2>Une question sur votre santé ?</h2><p>Medomicile vous oriente vers la solution adaptée à Kénitra.</p></div><a href="../contact.html">Contacter Medomicile →</a>';
  article.after(after);
  const related = document.createElement('section');
  related.className = 'article-related';
  related.innerHTML = '<span class="article-follow-up__eyebrow">À LIRE AUSSI</span><div><a class="related-card related-card--burns" href="brulures-premiers-gestes.html"><span>PREMIERS SECOURS</span><strong>Les premiers gestes face aux brûlures</strong><small>Les réflexes essentiels à connaître à la maison.</small><b>Lire l’article →</b></a><a class="related-card related-card--antibiotics" href="antibiotiques-infections-bon-usage.html"><span>BON USAGE DES MÉDICAMENTS</span><strong>Bien utiliser les antibiotiques</strong><small>Comprendre quand ils sont utiles et pourquoi.</small><b>Lire l’article →</b></a><a class="related-card related-card--hypoglycemia" href="hypoglycemie-reconnaitre-signes-agir.html"><span>PRÉVENTION</span><strong>Reconnaître une hypoglycémie</strong><small>Les signes et les bons réflexes à adopter.</small><b>Lire l’article →</b></a><a class="related-card related-card--rose" href="octobre-rose.html"><span>PRÉVENTION</span><strong>Octobre rose : prévenir et agir</strong><small>Les repères essentiels pour le dépistage.</small><b>Lire l’article →</b></a></div>';
  const currentArticle = source.split('/').pop();
  related.querySelectorAll('a.related-card').forEach((card) => { if (card.getAttribute('href') === currentArticle) card.remove(); });
  after.after(related);
  const footer = document.querySelector('.site-footer');
  if (footer) footer.innerHTML = '<div class="footer-grid"><div><strong>Medomicile</strong><p>Consultations, soins et orientation à Kénitra.</p></div><div><b>Services</b><a href="../consultation.html">Consultation à domicile</a><a href="../ambulance.html">Ambulance</a><a href="../urgences.html">Urgences</a></div><div><b>Annuaire</b><a href="../medecins.html">Médecins</a><a href="../pharmacies.html">Pharmacies</a><a href="../cliniques.html">Cliniques / Hôpitaux</a><a href="../laboratoires.html">Laboratoires</a><a href="../radiologie.html">Radiologie</a><a href="../dialyse.html">Dialyse</a></div><div><b>Informations</b><a href="../articles.html">Articles</a><a href="../contact.html">Contact</a><a href="../confidentialite.html">Confidentialité</a></div><div data-language-links><b>Langues</b><a href="../ar/index.html">العربية</a><a href="../index.html">Français</a><a href="../en/index.html">English</a></div></div>';
};

fetch('../' + sourceFile).then(r => r.text()).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); const article = doc.querySelector('.medical-article') || fallbackArticle(); target.replaceChildren(article); enhanceArticle(article); linkArticleAuthor(target); }).catch(() => { const article = fallbackArticle(); target.replaceChildren(article); enhanceArticle(article); linkArticleAuthor(target); });

const source = document.body.dataset.source;
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
fetch('../../' + source).then(r => r.text()).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); const article = doc.querySelector('.medical-article'); if (!article) throw new Error('Article source unavailable'); target.replaceChildren(article); }).catch(() => { target.textContent = 'Article indisponible dans cette revue locale.'; });

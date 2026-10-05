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

const sourceUrl = '/articles/content/' + encodeURIComponent(source);
const addArticleNavigation = () => { const current = source; const related = [{slug:'brulures-premiers-gestes.html',tag:'PREMIERS SECOURS',title:'Brûlures domestiques : les premiers gestes',copy:'Les réflexes à connaître à la maison.'},{slug:'antibiotiques-infections-bon-usage.html',tag:'BON USAGE DES MÉDICAMENTS',title:'Antibiotiques et infections : les bons réflexes à connaître',copy:'Comprendre le bon usage des antibiotiques.'},{slug:'hypoglycemie-reconnaitre-signes-agir.html',tag:'PRÉVENTION',title:'Hypoglycémie : reconnaître les signes et agir',copy:'Les signes et les bons réflexes à adopter.'}].filter(item => item.slug !== current); const section = document.createElement('section'); section.className='article-related content-width'; section.innerHTML='<p class="section-kicker">À LIRE AUSSI</p><h2>Nos autres articles santé</h2><div class="article-related-grid"></div>'; section.querySelector('.article-related-grid').innerHTML=related.map(item=>`<a href="${item.slug}"><span>${item.tag}</span><strong>${item.title}</strong><small>${item.copy}</small><b>Lire l’article →</b></a>`).join(''); document.querySelector('.review-article')?.after(section); const footer=document.querySelector('.site-footer'); if(footer) footer.innerHTML='<div class="footer-grid"><div><strong>Medomicile</strong><p>Consultations, soins et orientation à Kénitra.</p></div><div><b>Services</b><a href="../consultation.html">Consultation à domicile</a><a href="../ambulance.html">Ambulance</a><a href="../urgences.html">Urgences</a></div><div><b>Annuaire</b><a href="../medecins.html">Médecins</a><a href="../pharmacies.html">Pharmacies</a><a href="../cliniques.html">Cliniques / Hôpitaux</a></div><div><b>Informations</b><a href="../articles.html">Articles</a><a href="../contact.html">Contact</a><a href="../confidentialite.html">Confidentialité</a></div></div>'; };
fetch(sourceUrl).then(response => { if (!response.ok) throw new Error(`Article source unavailable (${response.status})`); return response.text(); }).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); const article = doc.querySelector('.medical-article'); if (!article) throw new Error('Article source unavailable'); target.replaceChildren(article); linkArticleAuthor(target); addArticleNavigation(); }).catch((error) => { console.error('Unable to load article', error); target.innerHTML = '<div class="article-empty-state"><h1>Article indisponible</h1><p>Le contenu de cet article ne peut pas être chargé pour le moment.</p><a class="button button-blue" href="../articles.html">Retour aux articles</a></div>'; });

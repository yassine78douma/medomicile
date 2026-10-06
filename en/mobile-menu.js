(() => {
  const header = document.querySelector('.site-header');
  const actions = header?.querySelector('.header-actions');
  if (!header || !actions || header.querySelector('.menu-toggle')) return;

  const button = document.createElement('button');
  button.className = 'menu-toggle';
  button.type = 'button';
  button.setAttribute('aria-controls', 'english-mobile-menu');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open navigation menu');
  button.innerHTML = '☰<span class="sr-only">Open navigation menu</span>';
  actions.append(button);

  const menu = document.createElement('nav');
  menu.id = 'english-mobile-menu';
  menu.className = 'mobile-menu';
  menu.setAttribute('aria-label', 'English navigation');
  menu.innerHTML = '<a href="index.html">Home</a><a href="consultation.html">Consultation</a><a href="urgences.html">Emergencies</a>';
  header.append(menu);

  const close = (restoreFocus = false) => { menu.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); if (restoreFocus) button.focus(); };
  button.addEventListener('click', () => { const open = !menu.classList.contains('is-open'); menu.classList.toggle('is-open', open); button.setAttribute('aria-expanded', String(open)); });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => close(false)));
  menu.addEventListener('keydown', (event) => { if (event.key === 'Escape') { event.preventDefault(); close(true); } });
  document.addEventListener('click', (event) => { if (!header.contains(event.target)) close(); });

  const footer = document.querySelector('.site-footer');
  if (footer && !footer.querySelector('.footer-contact')) {
    footer.innerHTML = '<div class="footer-grid"><div><strong>Medomicile</strong><p>Home consultations, nursing care and local guidance in Kenitra.</p></div><div><b>Services</b><a href="consultation.html">Home consultation</a><a href="consultation.html">Nursing care</a><a href="urgences.html">Emergency guidance</a></div><div class="footer-contact"><b>Contact</b><a href="tel:+212663058222">+212 6 63 05 82 22</a><a href="https://wa.me/212663058222">WhatsApp</a><span>Kenitra, Mehdia and surrounding area</span></div><div><b>Explore</b><a href="index.html">Home</a><a href="consultation.html">Consultation</a><a href="urgences.html">Emergencies</a></div></div>';
  }
})();

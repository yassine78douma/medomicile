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
})();

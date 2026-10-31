(() => {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.menu-toggle');
  const menu = header?.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.setAttribute('aria-controls', menu.id || 'home-mobile-menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });
    menu.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  }

  const hero = document.querySelector('.hero');
  const home = hero && document.querySelector('.services-section');
  if (!home) return;
  const mobileQuery = window.matchMedia('(max-width: 700px)');
  const language = document.documentElement.lang || 'fr';
  const labels = language === 'en'
    ? { more: 'Show more', less: 'Show less', call: 'Call Medomicile' }
    : language === 'ar'
      ? { more: 'عرض المزيد', less: 'عرض أقل', call: 'اتصل بميدوميسيل' }
      : language === 'ru'
        ? { more: 'Показать ещё', less: 'Скрыть', call: 'Позвонить в Medomicile' }
        : { more: 'Voir plus', less: 'Voir moins', call: 'Appeler Medomicile' };

  document.querySelectorAll('.experience-section, .reviews-section').forEach((section, index) => {
    const content = section.querySelector('.content-width');
    const heading = section.querySelector('h2');
    if (!content || !heading) return;
    content.classList.add('mobile-section-content');
    if (!content.id) content.id = `home-secondary-content-${index}`;
    section.classList.add('mobile-collapsible', 'is-collapsed');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mobile-section-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', content.id);
    if (!heading.id) heading.id = `home-secondary-section-${index}`;
    button.textContent = `${heading.textContent.trim()} · ${labels.more}`;
    section.insertBefore(button, content);
    button.addEventListener('click', () => {
      const collapsed = section.classList.toggle('is-collapsed');
      button.setAttribute('aria-expanded', String(!collapsed));
      button.textContent = `${heading.textContent.trim()} · ${collapsed ? labels.more : labels.less}`;
    });
  });

  const call = document.createElement('a');
  call.className = 'home-mobile-call is-hidden';
  call.href = 'tel:+212663058222';
  call.textContent = labels.call;
  call.setAttribute('aria-label', labels.call);
  const region = document.createElement('div');
  region.className = 'home-mobile-call-region';
  region.setAttribute('role', 'region');
  region.setAttribute('aria-label', labels.call);
  region.append(call);
  document.body.append(region);
  const updateCall = () => call.classList.toggle('is-hidden', !mobileQuery.matches || hero.getBoundingClientRect().bottom > 80);
  updateCall();
  window.addEventListener('scroll', updateCall, { passive: true });
  mobileQuery.addEventListener?.('change', updateCall);
})();

(() => {
  const send = (eventName, link) => {
    const event = {
      event: 'medomicile_contact',
      contact_type: eventName,
      link_url: link.href || '',
      page_language: document.documentElement.lang || 'fr',
      page_path: location.pathname
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    if (typeof window.gtag === 'function') window.gtag('event', eventName, event);
  };
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.href || '';
    if (href.startsWith('tel:')) send('phone_call', link);
    else if (/wa\.me|whatsapp\.com/i.test(href)) send('whatsapp_click', link);
    else if (/google\.(?:com|[a-z.]+)\/maps|maps\.app\.goo\.gl/i.test(href)) send('directions_click', link);
  }, { passive: true });
})();

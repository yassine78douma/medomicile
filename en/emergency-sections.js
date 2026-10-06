(() => {
  const main = document.querySelector('main');
  const disclaimer = main?.querySelector('.urgent-disclaimer');
  if (!main || !disclaimer) return;

  const section = document.createElement('section');
  section.className = 'urgent-section urgent-soft';
  section.setAttribute('aria-labelledby', 'english-emergency-actions');
  section.innerHTML = `<div class="content-width"><p class="section-kicker">Immediate action</p><h2 id="english-emergency-actions">Stay safe while help is on the way.</h2><div class="service-grid"><article><strong>Call 15 first</strong><small>Give your location clearly and describe the main symptoms or danger.</small></article><article><strong>Keep the person safe</strong><small>Follow the emergency operator’s instructions and avoid unnecessary movement.</small></article><article><strong>Prepare useful information</strong><small>Keep identification, treatments and relevant medical information nearby.</small></article></div></div>`;
  main.insertBefore(section, disclaimer);

  const warning = document.createElement('section');
  warning.className = 'urgent-section';
  warning.setAttribute('aria-labelledby', 'english-warning-signs');
  warning.innerHTML = `<div class="content-width"><p class="section-kicker">When to call</p><h2 id="english-warning-signs">Do not wait in a life-threatening situation.</h2><p class="urgent-copy">Call 15 immediately for breathing difficulty, loss of consciousness, severe bleeding, serious injury or a road accident. For non-emergency care, use the home consultation service.</p><a class="button button-blue" href="tel:15">Call 15 →</a></div>`;
  main.insertBefore(warning, disclaimer);
})();

(() => {
  const main = document.querySelector('main');
  const disclaimer = main?.querySelector('.urgent-disclaimer');
  if (!main || !disclaimer) return;

  const section = document.createElement('section');
  section.className = 'urgent-section urgent-soft';
  section.setAttribute('aria-labelledby', 'english-emergency-actions');
  section.innerHTML = `<div class="content-width"><p class="section-kicker">Public emergency guidance</p><h2 id="english-emergency-actions">What to do in a serious emergency.</h2><div class="service-grid"><article><strong>Call Morocco’s 15</strong><small>Give the exact location in Kenitra or the surrounding area and describe the danger.</small></article><article><strong>Follow the operator</strong><small>Stay on the line and follow the instructions until emergency help arrives.</small></article><article><strong>Keep information ready</strong><small>Prepare the person’s name, treatment and relevant medical history if available.</small></article></div></div>`;
  main.insertBefore(section, disclaimer);

  const warning = document.createElement('section');
  warning.className = 'urgent-section';
  warning.setAttribute('aria-labelledby', 'english-warning-signs');
  warning.innerHTML = `<div class="content-width"><p class="section-kicker">When to call</p><h2 id="english-warning-signs">Use the right service for the situation.</h2><p class="urgent-copy">Call 15 immediately for breathing difficulty, loss of consciousness, severe bleeding, serious injury or a road accident. For a non-life-threatening request in Kenitra, contact Medomicile about a home consultation.</p><a class="button button-blue" href="tel:15">Call 15 →</a><a class="button button-white" href="consultation.html">Home consultation →</a></div>`;
  main.insertBefore(warning, disclaimer);
})();

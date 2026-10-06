(() => {
  const main = document.querySelector('main');
  const disclaimer = main?.querySelector('.urgent-disclaimer');
  if (!main || !disclaimer) return;
  const quick = main.querySelector('.urgent-quick-grid');
  if (quick && !quick.querySelector('[data-emergency-resources]')) {
    const resources = document.createElement('div');
    resources.dataset.emergencyResources = '1';
    resources.className = 'urgent-resource-links';
    resources.innerHTML = '<a href="/en/etablissements-urgences.html"><b>04</b><strong>Emergency facilities</strong><span>Find local hospitals and emergency establishments.</span></a><a href="/en/pharmacies-garde.html"><b>05</b><strong>On-call pharmacies</strong><span>Check the available pharmacy duty information.</span></a>';
    quick.append(resources);
  }

  const section = document.createElement('section');
  section.className = 'urgent-section urgent-soft';
  section.setAttribute('aria-labelledby', 'english-emergency-actions');
  section.innerHTML = `<div class="content-width"><p class="section-kicker">Public emergency guidance</p><h2 id="english-emergency-actions">What to do in a serious emergency.</h2><div class="service-grid"><article><strong>Call Morocco’s 15</strong><small>Give the exact location in Kenitra or the surrounding area and describe the danger.</small></article><article><strong>Follow the operator</strong><small>Stay on the line and follow the instructions until emergency help arrives.</small></article><article><strong>Keep information ready</strong><small>Prepare the person’s name, treatment and relevant medical history if available.</small></article></div></div>`;
  main.insertBefore(section, disclaimer);

  const warning = document.createElement('section');
  warning.className = 'urgent-section';
  warning.setAttribute('aria-labelledby', 'english-warning-signs');
  warning.innerHTML = `<div class="content-width"><p class="section-kicker">Non-emergency care</p><h2 id="english-warning-signs">Need a home consultation?</h2><p class="urgent-copy">For a non-life-threatening request in Kenitra, contact Medomicile to discuss a home consultation. In a serious emergency, use the public emergency service on 15.</p><a class="button button-white" href="consultation.html">Home consultation →</a></div>`;
  main.insertBefore(warning, disclaimer);

  const mobileCall = document.createElement('a');
  mobileCall.className = 'urgent-mobile-call';
  mobileCall.href = 'tel:15';
  mobileCall.setAttribute('aria-label', 'Call emergency services on 15');
  mobileCall.textContent = 'Call 15';
  document.body.append(mobileCall);
})();

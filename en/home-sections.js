(() => {
  const main = document.querySelector('main');
  const contact = main?.querySelector('.contact-section');
  if (!main || !contact) return;
  const section = document.createElement('section');
  section.className = 'services-section';
  section.setAttribute('aria-labelledby', 'english-services-title');
  section.innerHTML = `<div class="content-width"><p class="section-kicker">Medomicile services</p><h2 id="english-services-title">Support at home in Kenitra.</h2><div class="service-grid"><a href="consultation.html"><strong>Home medical consultation</strong><small>A doctor assesses your situation at home and explains the next step.</small><span>Request a consultation →</span></a><a href="consultation.html"><strong>Nursing care at home</strong><small>Prescribed dressings, injections and follow-up care, subject to availability.</small><span>Ask our team →</span></a><a href="consultation.html"><strong>After-hospital follow-up</strong><small>Practical support and orientation after discharge from hospital.</small><span>Contact Medomicile →</span></a></div></div>`;
  main.insertBefore(section, contact);
  const steps = document.createElement('section');
  steps.className = 'steps-section';
  steps.setAttribute('aria-labelledby', 'english-steps-title');
  steps.innerHTML = `<div class="content-width"><p class="section-kicker">Your care request</p><h2 id="english-steps-title">A clear path to home care.</h2><div class="steps-grid"><article><b>01</b><strong>Call Medomicile</strong><p>Tell us whether you need a doctor, nursing care or guidance.</p></article><article><b>02</b><strong>Describe the situation</strong><p>Share the location in Kenitra, the symptoms and any relevant treatment.</p></article><article><b>03</b><strong>Confirm the next step</strong><p>We explain the available option and whether it can be arranged at home.</p></article></div></div>`;
  main.insertBefore(steps, contact);
})();

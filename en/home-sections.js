(() => {
  const main = document.querySelector('main');
  const contact = main?.querySelector('.contact-section');
  if (!main || !contact) return;
  const section = document.createElement('section');
  section.className = 'services-section';
  section.setAttribute('aria-labelledby', 'english-services-title');
  section.innerHTML = `<div class="content-width"><p class="section-kicker">Our services</p><h2 id="english-services-title">Care adapted to your needs.</h2><div class="service-grid"><a href="consultation.html"><strong>Home medical consultation</strong><small>Clinical assessment and guidance at home.</small><span>Discover →</span></a><a href="consultation.html"><strong>Nursing care</strong><small>Prescribed care, dressings and injections.</small><span>Discover →</span></a><a href="consultation.html"><strong>Care after hospitalisation</strong><small>Support and follow-up at home.</small><span>Discover →</span></a></div></div>`;
  main.insertBefore(section, contact);
  const steps = document.createElement('section');
  steps.className = 'steps-section';
  steps.setAttribute('aria-labelledby', 'english-steps-title');
  steps.innerHTML = `<div class="content-width"><p class="section-kicker">How it works</p><h2 id="english-steps-title">Three simple steps.</h2><div class="steps-grid"><article><b>01</b><strong>Contact us</strong><p>Call or send a WhatsApp message.</p></article><article><b>02</b><strong>Explain your needs</strong><p>We collect the essential information.</p></article><article><b>03</b><strong>Arrange your care</strong><p>We confirm availability and the next suitable step.</p></article></div></div>`;
  main.insertBefore(steps, contact);
})();

(() => {
  const main = document.querySelector('main');
  const contact = main?.querySelector('.contact-section');
  if (!main || !contact) return;
  const orientation = main.querySelector('.split-section');
  if (orientation) {
    const kicker = orientation.querySelector('.section-kicker');
    const heading = orientation.querySelector('h2');
    const copy = orientation.querySelector('.split-content > div:first-child p:last-child');
    const cardTitle = orientation.querySelector('.info-card strong');
    const cardCopy = orientation.querySelector('.info-card p');
    if (kicker) kicker.textContent = 'Care orientation';
    if (heading) heading.textContent = 'Find the right next step.';
    if (copy) copy.textContent = 'Tell Medomicile what you need. We help distinguish a home-care request from a situation that requires public emergency services.';
    if (cardTitle) cardTitle.textContent = 'Need urgent help?';
    if (cardCopy) cardCopy.textContent = 'For a life-threatening emergency, call 15.';
  }
  const finalContact = contact.querySelector('h2');
  const finalKicker = contact.querySelector('.section-kicker');
  const finalCopy = contact.querySelector('.contact-panel p:not(.section-kicker)');
  if (finalKicker) finalKicker.textContent = 'Speak to Medomicile';
  if (finalContact) finalContact.textContent = 'Ready to explain your request?';
  if (finalCopy) finalCopy.textContent = 'Call or use WhatsApp for a home-care request in Kenitra, Mehdia or the surrounding area.';
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

  const benefits = document.createElement('section');
  benefits.className = 'why-section';
  benefits.setAttribute('aria-labelledby', 'english-benefits-title');
  benefits.innerHTML = `<div class="content-width"><p class="section-kicker">Why Medomicile</p><h2 id="english-benefits-title">A local team focused on practical care.</h2><div class="benefit-grid"><span>Care at home in Kenitra</span><span>Simple phone and WhatsApp contact</span><span>Clear medical orientation</span><span>Support adapted to availability</span></div></div>`;
  main.insertBefore(benefits, contact);

  const experience = document.createElement('section');
  experience.className = 'experience-section';
  experience.setAttribute('aria-labelledby', 'english-experience-title');
  experience.innerHTML = `<div class="content-width experience-layout"><div><p class="section-kicker">A simple experience</p><h2 id="english-experience-title">Medomicile, close at every step.</h2><p>Find clear information about home consultations, nursing care and emergency orientation on any screen.</p></div><div class="device-pair" aria-label="Medomicile service preview"><div class="device device-back"><span>MEDOMICILE</span><strong>Home care</strong><small>Doctor at home<br>Nursing care<br>Follow-up</small></div><div class="device device-front"><span>MEDOMICILE</span><strong>Talk to our team</strong><b>Call now</b></div></div></div>`;
  main.insertBefore(experience, contact);

  const details = document.createElement('section');
  details.className = 'contact-section';
  details.setAttribute('aria-labelledby', 'english-details-title');
  details.innerHTML = `<div class="content-width contact-panel"><div><p class="section-kicker">Your coordinates</p><h2 id="english-details-title">Where and when we can help.</h2><p>Keep these details ready when you contact the team. Availability is confirmed by phone.</p></div><div class="contact-details"><span><b>Phone</b>+212 6 63 05 82 22</span><span><b>WhatsApp</b>Available through our team</span><span><b>Service area</b>Kenitra, Mehdia and surrounding area</span><span><b>Availability</b>To be confirmed by phone</span></div></div>`;
  main.insertBefore(details, contact);
})();

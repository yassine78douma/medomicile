(() => {
  const main = document.querySelector('main');
  const contact = main?.querySelector('.contact-section');
  if (!main || !contact) return;
  const heroActions = main.querySelector('.hero-actions');
  if (heroActions && !heroActions.querySelector('.availability-note')) {
    const note = document.createElement('p');
    note.className = 'availability-note';
    note.textContent = 'Availability to be confirmed by phone.';
    heroActions.append(note);
  }

  const care = document.createElement('section');
  care.className = 'service-section';
  care.setAttribute('aria-labelledby', 'english-consultation-care');
  care.innerHTML = `<div class="content-width"><p class="section-kicker">Home care options</p><h2 id="english-consultation-care">Support that fits your request.</h2><div class="service-grid"><a href="tel:+212663058222"><strong>Medical assessment at home</strong><small>Explain your symptoms and receive guidance on the next suitable step.</small><span>Call Medomicile →</span></a><a href="tel:+212663058222"><strong>Prescribed nursing care</strong><small>Ask about dressings, injections and follow-up care at home.</small><span>Check availability →</span></a><a href="tel:+212663058222"><strong>After-hospital support</strong><small>Share your discharge instructions so the team can guide your request.</small><span>Speak to the team →</span></a></div></div>`;
  main.insertBefore(care, contact);

  const practical = document.createElement('section');
  practical.className = 'why-section';
  practical.setAttribute('aria-labelledby', 'english-consultation-practical');
  practical.innerHTML = `<div class="content-width"><p class="section-kicker">Before the visit</p><h2 id="english-consultation-practical">Help us understand your situation.</h2><div class="benefit-grid"><span>Keep your address and phone number ready</span><span>Describe the main symptoms and when they started</span><span>Prepare current prescriptions or treatment details</span><span>Tell us if the request is urgent or non-urgent</span></div></div>`;
  main.insertBefore(practical, contact);

  const details = document.createElement('section');
  details.className = 'contact-section';
  details.setAttribute('aria-labelledby', 'english-consultation-contact');
  details.innerHTML = `<div class="content-width contact-panel"><div><p class="section-kicker">Service area</p><h2 id="english-consultation-contact">Home care in Kenitra and Mehdia.</h2><p>Call or use WhatsApp to explain your request. The team will confirm the appropriate option and availability.</p></div><div class="contact-details"><span><b>Phone</b>+212 6 63 05 82 22</span><span><b>WhatsApp</b>Available through our team</span><span><b>Area</b>Kenitra, Mehdia and surrounding area</span><span><b>Availability</b>To be confirmed by phone</span></div></div>`;
  main.insertBefore(details, contact);
})();

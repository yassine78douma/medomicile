document.addEventListener('DOMContentLoaded', () => {
  const phone = document.querySelector('.phone-link');
  const cta = document.querySelector('.header-cta');
  if (phone) { phone.href = 'tel:141'; phone.setAttribute('aria-label', 'Call SAMU 141'); }
  if (cta) { cta.href = 'tel:141'; cta.textContent = 'SAMU 141'; }

  const notice = document.querySelector('.urgent-notice');
  if (notice) {
    const span = notice.querySelector('span');
    if (span) span.textContent = 'For a medical emergency, call SAMU on 141. For rescue services, especially a road accident, call Protection civile on 15.';
    const old = notice.querySelector('a');
    if (old) old.remove();
    const actions = document.createElement('div');
    actions.className = 'urgent-notice-actions';
    actions.innerHTML = '<a href="tel:141">SAMU · 141</a><a href="tel:15">Protection civile · 15</a>';
    notice.appendChild(actions);
  }

  const guidance = document.querySelector('#guidance p:last-of-type');
  if (guidance) guidance.textContent = 'Call SAMU on 141 for a medical emergency, breathing difficulty, loss of consciousness or severe injury. For a road accident or rescue service, call Protection civile on 15.';

  const numbers = document.querySelector('#urgent-numbers .content-width');
  if (numbers) {
    const kicker = numbers.querySelector('.section-kicker');
    const heading = numbers.querySelector('h2');
    const card = numbers.querySelector('.urgent-number-card');
    if (kicker) kicker.textContent = 'PUBLIC EMERGENCY NUMBERS';
    if (heading) heading.textContent = 'Choose the right emergency service.';
    if (card) {
      card.querySelector('span').textContent = 'Medical emergency — SAMU';
      const link = card.querySelector('a'); link.href = 'tel:141'; link.textContent = '141';
      const second = card.cloneNode(true);
      second.querySelector('span').textContent = 'Rescue service or road accident — Protection civile';
      const secondLink = second.querySelector('a'); secondLink.href = 'tel:15'; secondLink.textContent = '15';
      card.after(second);
    }
  }

  const faq = document.querySelector('.faq-list');
  if (faq) {
    const first = faq.querySelector('details');
    if (first) { first.querySelector('summary').textContent = 'Which emergency numbers should I call in Kenitra?'; first.querySelector('p').textContent = 'For a medical emergency, call SAMU on 141. For rescue services and road accidents, call Protection civile on 15.'; }
    const second = faq.querySelectorAll('details')[1];
    if (second) second.querySelector('p').textContent = 'No. A home consultation does not replace public emergency services. For a medical emergency, call SAMU 141.';
  }

  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent);
      const faqNode = data['@graph']?.find((item) => item['@type'] === 'FAQPage');
      const service = data['@graph']?.find((item) => item['@type'] === 'Service');
      if (service) service.description = 'Guidance for urgent situations: call SAMU 141 for medical emergencies and Protection civile 15 for rescue services or road accidents.';
      if (faqNode?.mainEntity?.length) {
        faqNode.mainEntity[0].name = 'Which emergency numbers should I call in Kenitra?';
        faqNode.mainEntity[0].acceptedAnswer.text = 'For a medical emergency, call SAMU on 141. For rescue services and road accidents, call Protection civile on 15.';
        faqNode.mainEntity[1].acceptedAnswer.text = 'No. A home consultation does not replace public emergency services. For a medical emergency, call SAMU 141.';
      }
      script.textContent = JSON.stringify(data);
    } catch (_) {}
  });
});

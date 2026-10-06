(() => {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  footer.innerHTML = `<div class="footer-grid"><div><strong>Medomicile</strong><p>Home consultations, nursing care and local guidance in Kenitra.</p></div><div><b>Services</b><a href="consultation.html">Home consultation</a><a href="consultation.html">Nursing care</a><a href="urgences.html">Emergency guidance</a></div><div><b>Contact</b><a href="tel:+212663058222">+212 6 63 05 82 22</a><a href="https://wa.me/212663058222">WhatsApp</a><span>Kenitra, Mehdia and surrounding area</span></div><div><b>Explore</b><a href="index.html">Home</a><a href="consultation.html">Consultation</a><a href="urgences.html">Emergencies</a></div></div>`;
})();

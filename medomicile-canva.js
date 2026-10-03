(() => {
  const routeMap = {
    '../index.html': 'index.html'
  };
  document.querySelectorAll('a[href], form[action]').forEach((element) => {
    const attribute = element.tagName === 'FORM' ? 'action' : 'href';
    if (routeMap[element.getAttribute(attribute)]) element.setAttribute(attribute, routeMap[element.getAttribute(attribute)]);
  });
})();

/* Shared detail-page component. Data adapters below provide only the page-specific content. */
window.MedomicileDetail = {
  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  },
  action(href, label, secondary = false) {
    if (!href) return '';
    return `<a class="establishment-action${secondary ? ' establishment-action-secondary' : ''}" href="${this.escape(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${this.escape(label)}</a>`;
  },
  section(label, content, className = 'establishment-section') {
    return `<section class="${className}"><p class="eyebrow">${this.escape(label)}</p>${content}</section>`;
  },
  related(title, cards) {
    return `<section class="establishment-related"><p class="eyebrow">À Kénitra</p><h2>${this.escape(title)}</h2><div class="establishment-related-grid">${cards}</div></section>`;
  },
  shell({category, title, type, city = 'Kénitra', subtitle = '', address = '', actions = '', body = '', related = '', backHref, backLabel}) {
    return `<section class="establishment-hero detail-hero"><div class="content-width"><nav class="establishment-breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="annuaire.html">Annuaire</a><span>›</span><a href="${this.escape(category.href)}">${this.escape(category.label)}</a><span>›</span><strong>${this.escape(title)}</strong></nav><div class="establishment-hero-grid"><div><p class="eyebrow">${this.escape(type)} · ${this.escape(city)}</p><h1>${this.escape(title)}</h1>${subtitle ? `<p class="establishment-subtitle">${this.escape(subtitle)}</p>` : ''}${address ? `<p class="establishment-address">${this.escape(address)}</p>` : ''}<div class="establishment-actions">${actions}</div></div></div></div></section><section class="establishment-body"><div class="content-width">${body}${related}${backHref ? `<a class="back-directory" href="${this.escape(backHref)}">← ${this.escape(backLabel || 'Retour à l’annuaire')}</a>` : ''}</div></section>`;
  },
  mount(root = document) {
    root.querySelectorAll('.establishment-hero').forEach((hero) => {
      hero.classList.add('detail-hero');
      hero.querySelector('.establishment-hero-grid')?.classList.add('detail-hero-grid');
      hero.querySelector('.establishment-actions')?.classList.add('detail-hero-actions');
    });
    root.querySelectorAll('.establishment-body').forEach((body) => body.classList.add('detail-body'));
  }
};

(() => {
  const apply = () => window.MedomicileDetail.mount(document);
  apply();
  new MutationObserver(apply).observe(document.body, {childList: true, subtree: true});
})();

(() => {
  const footer = document.querySelector('.site-footer');
  const grid = footer?.querySelector('.footer-grid');
  if (!grid) return;
  const footerPath = (file) => {
    // Keep file:// previews inside canva-home while making the local HTTP
    // server target explicit instead of resolving against the project root.
    if (location.protocol === 'file:') return file;
    return `/canva-home/${file}`;
  };
  const arabic = document.documentElement.lang === 'ar';
  const english = document.documentElement.lang === 'en';
  const prefix = location.pathname.includes('/en/') ? '../' : '';
  const copy = arabic ? {
    brand: 'استشارات ورعاية وتوجيه في القنيطرة', services: 'الخدمات', consultation: 'الاستشارة', ambulance: 'الإسعاف', emergencies: 'الطوارئ', directory: 'الدليل', doctors: 'الأطباء', pharmacies: 'الصيدليات', clinics: 'العيادات والمستشفيات', labs: 'المختبرات', radiology: 'مراكز الأشعة', info: 'المعلومات', home: 'الرئيسية', contact: 'اتصل بنا', languages: 'اللغات', ar: 'العربية', fr: 'Français', en: 'English'
  } : english ? {
    brand: 'Consultations, care and guidance in Kénitra', services: 'Services', consultation: 'Consultation', ambulance: 'Ambulance', emergencies: 'Emergency', directory: 'Directory', doctors: 'Doctors', pharmacies: 'Pharmacies', clinics: 'Clinics / Hospitals', labs: 'Laboratories', radiology: 'Radiology', info: 'Information', home: 'Home', contact: 'Contact', languages: 'Languages', ar: 'العربية', fr: 'Français', en: 'English'
  } : {
    brand: 'Consultations, soins et orientation à Kénitra', services: 'Services', consultation: 'Consultation à domicile', ambulance: 'Ambulance', emergencies: 'Urgences', directory: 'Annuaire', doctors: 'Médecins', pharmacies: 'Pharmacies', clinics: 'Cliniques / Hôpitaux', labs: 'Laboratoires', radiology: 'Radiologie', info: 'Informations', home: 'Accueil', contact: 'Contact', languages: 'Langues', ar: 'العربية', fr: 'Français', en: 'English'
  };
  const p = (path) => `${prefix}${path}`;
  const langLinks = arabic ? ['index.html', '../index.html', '../en/index.html'] : english ? ['../ar/index.html', '../index.html', 'index.html'] : ['ar/index.html', 'index.html', 'en/index.html'];
  grid.innerHTML = `<div><strong>Medomicile</strong><p>${copy.brand}</p></div><div><b>${copy.services}</b><a href="${p('consultation.html')}">${copy.consultation}</a><a href="${p('ambulance.html')}">${copy.ambulance}</a><a href="${p('urgences.html')}">${copy.emergencies}</a></div><div><b>${copy.directory}</b><a href="${p('medecins.html')}">${copy.doctors}</a><a href="${p('pharmacies.html')}">${copy.pharmacies}</a><a href="${p('cliniques.html')}">${copy.clinics}</a><a href="${p('laboratoires.html')}">${copy.labs}</a><a href="${p('radiologie.html')}">${copy.radiology}</a></div><div><b>${copy.info}</b><a href="${p('index.html')}">${copy.home}</a><a href="${footerPath('contact.html')}">${copy.contact}</a></div><div data-language-links><b>${copy.languages}</b><a href="${langLinks[0]}">${copy.ar}</a><a href="${langLinks[1]}">${copy.fr}</a><a href="${langLinks[2]}">${copy.en}</a></div>`;
})();

// Canva review continuity: keep article and specialty review journeys inside canva-home.
if (location.pathname.includes('/canva-home/')) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const routes = {
      '../articles.html': 'articles.html',
      '/articles.html': 'articles.html',
      '../brulures-premiers-gestes.html': 'articles/brulures-premiers-gestes.html',
      '../antibiotiques-infections-bon-usage.html': 'articles/antibiotiques-infections-bon-usage.html',
      '../hypoglycemie-reconnaitre-signes-agir.html': 'articles/hypoglycemie-reconnaitre-signes-agir.html',
      '../cardiologues-kenitra.html': 'specialite.html?specialty=cardiologues'
      ,'/contact.html': 'contact.html', '../contact.html': 'contact.html', '../POLITIQUE-CONFIDENTIALITE-BROUILLON.md': 'confidentialite.html'
    };
    const next = routes[link.getAttribute('href')];
    if (next) { event.preventDefault(); location.href = next; }
  });
}

/* Compact Canva digital doctor card. It intentionally uses the public-card mapping only. */
(() => {
  const root = document.querySelector('#digital-doctor-card-root');
  if (!root) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const clean = value => String(value || '').trim();
  const phone = item => item.phones?.[0]?.number || '';
  const slug = new URLSearchParams(location.search).get('slug') || '';
  Promise.all([fetch('../data/doctors.json').then(r => r.json()), fetch('../data/virtual-card-index.json').then(r => r.json())]).then(([doctorData, index]) => {
    const doctors = Array.isArray(doctorData) ? doctorData : doctorData.doctors || [];
    const doctor = doctors.find(item => item.id === slug || item.slug === slug);
    const card = index.find(item => item.type === 'doctor' && item.slug === slug && /^https:\/\/medomicile\.com\/p\/[^/]+\/$/.test(item.url || ''));
    if (!doctor || !card) { root.innerHTML = '<section class="digital-card-not-found"><div class="content-width"><p class="eyebrow">CARTE DIGITALE</p><h1>Carte indisponible</h1><p>Cette carte digitale n’est pas disponible dans l’annuaire Medomicile.</p><a class="back-directory" href="medecins.html">← Voir les médecins</a></div></section>'; return; }
    const name = clean(card.name || doctor.name), specialty = clean(card.subtitle || doctor.specialty), city = clean(card.city || doctor.city), address = clean(card.address || doctor.address), publicUrl = card.url, maps = clean(card.google_maps_url || doctor.google_maps_url), number = phone(card) || phone(doctor), initials = name.replace(/^Dr\s*/i,'').split(/\s+/).map(part => part[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
    const tel = number ? `<a class="digital-card-primary" href="tel:${esc(number)}">Appeler</a>` : '';
    const map = maps ? `<a class="digital-card-secondary" href="${esc(maps)}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
    root.innerHTML = `<section class="digital-card-main"><div class="content-width"><article class="digital-card-shell"><p class="eyebrow">CARTE DIGITALE MEDOMICILE</p><div class="digital-card-avatar" aria-hidden="true">${esc(initials || 'M')}</div><h1>${esc(name)}</h1>${specialty ? `<p class="digital-card-specialty">${esc(specialty)}</p>` : ''}${city ? `<p class="digital-card-location">${esc(city)}</p>` : ''}${address ? `<p class="digital-card-address">${esc(address)}</p>` : ''}<div class="digital-card-actions">${tel}${map}<button class="digital-card-secondary" type="button" data-card-share>Partager</button></div><section class="digital-card-share"><p class="eyebrow">PARTAGER LA CARTE</p><p>Ouvrez cette carte sur un autre téléphone ou ajoutez-la à vos contacts.</p><div class="digital-card-share-actions"><button type="button" data-card-qr>Afficher le QR code</button><button type="button" data-card-vcard>Ajouter aux contacts</button></div><div class="digital-card-qr" data-card-qr-box hidden role="img" aria-label="QR code de la carte digitale"></div><p class="digital-card-status" role="status" aria-live="polite"></p></section><p class="digital-card-note">Carte digitale publique Medomicile. Les informations sont celles disponibles dans l’annuaire.</p><a class="digital-card-profile" href="medecin.html?slug=${encodeURIComponent(slug)}">Voir la fiche complète →</a></article><aside class="digital-card-home"><p class="eyebrow">BESOIN D’UN MÉDECIN À DOMICILE ?</p><a href="consultation.html">Découvrir la consultation à domicile →</a></aside></div></section>`;
    const status = root.querySelector('.digital-card-status'); const qrBox = root.querySelector('[data-card-qr-box]');
    const renderQr = () => { qrBox.hidden = false; qrBox.replaceChildren(); try { const code = qrcode(0, 'M'); code.addData(publicUrl); code.make(); qrBox.innerHTML = code.createSvgTag({cellSize: 4, margin: 16, scalable: true, alt: {text: `QR code de la carte digitale de ${name}`}}); } catch { qrBox.textContent = 'QR indisponible. Utilisez « Partager ».'; } };
    root.querySelector('[data-card-qr]').addEventListener('click', renderQr);
    root.querySelector('[data-card-share]').addEventListener('click', async () => { if (navigator.share) { try { await navigator.share({title: `${name} — Medomicile`, text: specialty ? `${name} · ${specialty}` : name, url: publicUrl}); return; } catch (error) { if (error.name === 'AbortError') return; } } try { await navigator.clipboard.writeText(publicUrl); status.textContent = 'Lien copié'; } catch { status.textContent = publicUrl; } });
    root.querySelector('[data-card-vcard]').addEventListener('click', () => { const lines = ['BEGIN:VCARD','VERSION:3.0',`FN:${name}`]; if (number) lines.push(`TEL;TYPE=WORK,VOICE:${number}`); if (address) lines.push(`ADR;TYPE=WORK:;;${address.replace(/[;\\,]/g, '\\$&')};;;;`); lines.push(`URL:${publicUrl}`,'END:VCARD'); const blob = new Blob([lines.join('\r\n') + '\r\n'], {type:'text/vcard;charset=utf-8'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${slug}-medomicile.vcf`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); status.textContent = 'Contact prêt à enregistrer'; });
  }).catch(() => { root.innerHTML = '<section class="digital-card-not-found"><div class="content-width"><h1>Carte indisponible</h1><p>La carte ne peut pas être chargée pour le moment.</p></div></section>'; });
})();

/* Specialty directory page: shared external loader, including file:// fallback. */
(() => {
  const root = document.querySelector('#doctors.doctor-grid');
  if (!root) return;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const render = (data) => {
    const rows = Array.isArray(data) ? data : (data.doctors || []);
    const specialty = new URLSearchParams(location.search).get('specialty') || 'cardiologues';
    const query = specialty.toLowerCase().replace(/s$/, '');
    const matches = rows.filter((doctor) => String(doctor.specialty || doctor.specialite || doctor.subtitle || '').toLowerCase().includes(query));
    root.innerHTML = matches.map((doctor) => {
      const name = doctor.name || doctor.nom || doctor.fullName || 'Professionnel';
      const phone = doctor.phone || doctor.telephone || doctor.phones?.[0]?.number || '';
      const label = doctor.specialty || doctor.specialite || doctor.subtitle || 'Spécialité médicale';
      const city = doctor.city || doctor.ville || 'Kénitra';
      return `<article class="doctor"><h2>${esc(name)}</h2><p>${esc(label)} · ${esc(city)}</p><a href="${phone ? `tel:${esc(phone)}` : '#'}">Appeler</a><a href="medecins.html">Profil</a></article>`;
    }).join('') || '<p class="noscript-state">Aucun professionnel ne correspond à cette spécialité.</p>';
  };
  fetch('/data/doctors.json').catch(() => fetch('../data/doctors.json')).then((response) => response.json()).then(render).catch(() => { root.innerHTML = '<p class="noscript-state">Les données des médecins ne sont pas disponibles actuellement.</p>'; });
})();

(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const isDirectory = ['annuaire.html', 'medecins.html', 'medecin.html', 'pharmacies.html', 'pharmacie.html', 'pharmacies-garde.html', 'cliniques.html', 'etablissement.html', 'laboratoires.html', 'laboratoire.html', 'radiologie.html', 'centre-radiologie.html', 'dialyse.html', 'centre-dialyse.html'].includes(page);
  const active = page === 'index.html' ? 'index.html' : page === 'consultation.html' ? 'consultation.html' : (page === 'urgences.html' || page === 'etablissements-urgences.html') ? 'urgences.html' : isDirectory ? 'annuaire.html' : '';
  const isArabic = document.documentElement.lang === 'ar';
  if (!isArabic) {
  const inCanvaHome = location.pathname.includes('/canva-home/');
  const internalPage = (file) => location.protocol === 'file:' ? file : `${inCanvaHome ? '/canva-home' : ''}/${file}`;
  const desktop = document.querySelector('.desktop-nav');
  if (desktop) {
    desktop.innerHTML = [['index.html', 'Accueil'], ['consultation.html', 'Consultation'], ['ambulance.html', 'Ambulance'], ['urgences.html', 'Urgences'], ['annuaire.html', 'Annuaire']].map(([href, label]) => `<a${active === href ? ' class="is-current"' : ''} href="${href}">${label}</a>`).join('');
  }
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.innerHTML = [['index.html', 'Accueil'], ['consultation.html', 'Consultation'], ['ambulance.html', 'Ambulance'], ['urgences.html', 'Urgences'], ['annuaire.html', 'Annuaire'], ['articles.html', 'Articles'], ['contact.html', 'Contact']].map(([href, label]) => `<a${active === href ? ' aria-current="page"' : ''} href="${href}">${label}</a>`).join('');
  }
  const headerCta = document.querySelector('.header-cta');
  if (headerCta) {
    headerCta.href = 'tel:+212663058222';
    headerCta.textContent = 'Appeler';
  }
  const bottom = document.querySelector('.bottom-nav');
  if (bottom) {
    bottom.innerHTML = [['index.html', '⌂', 'Accueil'], ['consultation.html', '＋', 'Consultation'], ['urgences.html', '!', 'Urgences'], ['annuaire.html', '⌕', 'Annuaire']].map(([href, icon, label]) => `<a${active === href ? ' class="active"' : ''} href="${href}"><span>${icon}</span><small>${label}</small></a>`).join('');
  }
  const footer = document.querySelector('.site-footer');
  if (footer) {
    footer.innerHTML = `<div class="footer-grid"><div><strong>Medomicile</strong><p>Consultations, soins et orientation à Kénitra.</p></div><div><b>Services</b><a href="consultation.html">Consultation à domicile</a><a href="ambulance.html">Ambulance</a><a href="urgences.html">Urgences</a></div><div><b>Annuaire</b><a href="medecins.html">Médecins</a><a href="pharmacies.html">Pharmacies</a><a href="cliniques.html">Cliniques / Hôpitaux</a><a href="laboratoires.html">Laboratoires</a><a href="radiologie.html">Radiologie</a><a href="dialyse.html">Dialyse</a></div><div><b>Informations</b><a href="${internalPage('articles.html')}">Articles</a><a href="${internalPage('contact.html')}">Contact</a></div><div data-language-links><b>Langues</b><a href="ar/index.html">العربية</a><a href="index.html">Français</a><a href="en/index.html">English</a></div></div>`;
  }
  }
  if (isArabic) {
    const nav = document.querySelector('.desktop-nav');
    if (nav && !nav.querySelector('a[href="index.html"]')) nav.insertAdjacentHTML('afterbegin', '<a href="index.html">الرئيسية</a>');
    const footerGrid = document.querySelector('.site-footer .footer-grid');
    if (footerGrid && !footerGrid.querySelector('[data-language-links]')) footerGrid.insertAdjacentHTML('beforeend', '<div data-language-links><b>اللغات</b><a href="index.html">العربية</a><a href="../index.html">Français</a><a href="../en/index.html">English</a><span>Русский · قريباً</span></div>');
  }
  if (isArabic && page === 'consultation.html') {
    const footerGrid = document.querySelector('.site-footer .footer-grid');
    if (footerGrid && !footerGrid.querySelector('[data-language-links]')) footerGrid.insertAdjacentHTML('beforeend', '<div data-language-links><b>اللغات</b><a href="index.html">العربية</a><a href="../index.html">Français</a><a href="../en/index.html">English</a><span>Русский · قريباً</span></div>');
  }
})();

/* Ensure every public French page has the same working mobile menu. */
(() => {
  if (location.pathname.endsWith('/review.html')) return;
  const header = document.querySelector('.site-header');
  const actions = header?.querySelector('.header-actions');
  if (!header || !actions) return;
  let toggle = actions.querySelector('.menu-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.innerHTML = '☰<span class="sr-only">Ouvrir le menu</span>';
    actions.append(toggle);
  }
  let menu = header.querySelector('.mobile-menu');
  if (!menu) {
    menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    menu.id = 'shared-mobile-menu';
    menu.setAttribute('aria-label', 'Navigation mobile');
    const arabic = document.documentElement.lang === 'ar';
    menu.innerHTML = arabic
      ? '<a href="index.html">الرئيسية</a><a href="consultation.html">الاستشارة المنزلية</a><a href="ambulance.html">الإسعاف</a><a href="urgences.html">الطوارئ</a><a href="annuaire.html">الدليل الطبي</a><a href="articles.html">المقالات</a><a href="contact.html">اتصل بنا</a>'
      : '<a href="index.html">Accueil</a><a href="consultation.html">Consultation à domicile</a><a href="ambulance.html">Ambulance</a><a href="urgences.html">Urgences</a><a href="annuaire.html">Annuaire médical</a><a href="articles.html">Articles</a><a href="contact.html">Contact</a>';
    header.append(menu);
  }
  toggle.setAttribute('aria-controls', menu.id);
  toggle.setAttribute('aria-expanded', 'false');
  if (toggle.dataset.sharedMenuBound) return;
  toggle.dataset.sharedMenuBound = 'true';
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });
  menu.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  });
})();

/* Arabic presentation layer for labels coming from shared French JSON data. */
(() => {
  if (document.documentElement.lang !== 'ar') return;
  const labels = new Map(Object.entries({
    'Appeler': 'اتصال', 'Itinéraire': 'الاتجاهات', 'Voir la fiche': 'عرض الملف',
    'Afficher plus': 'عرض المزيد', 'Réinitialiser les filtres': 'إعادة ضبط الفلاتر',
    'Voir toutes les spécialités': 'عرض جميع التخصصات', 'Parcourir par spécialité': 'التصفح حسب التخصص',
    'Médecins référencés à Kénitra': 'الأطباء المسجلون في القنيطرة',
    'Pharmacies référencées': 'الصيدليات المسجلة', 'Laboratoires référencés': 'المختبرات المسجلة',
    'Centres référencés': 'المراكز المسجلة', 'résultats': 'نتائج',
    'Effacer les filtres': 'مسح الفلاتر', 'Retour à l’annuaire': 'العودة إلى الدليل',
    'Aucun médecin ne correspond à cette recherche.': 'لا يوجد طبيب يطابق هذا البحث.',
    'Aucune pharmacie ne correspond à votre recherche.': 'لا توجد صيدلية تطابق هذا البحث.',
    'Aucun établissement ne correspond à votre recherche.': 'لا توجد مؤسسة صحية تطابق هذا البحث.',
    'Aucun laboratoire ne correspond à votre recherche.': 'لا يوجد مختبر يطابق هذا البحث.',
    'Aucun centre de radiologie ne correspond à votre recherche.': 'لا يوجد مركز أشعة يطابق هذا البحث.',
    'Aucun centre de dialyse ne correspond à votre recherche.': 'لا يوجد مركز تصفية دم يطابق هذا البحث.',
    'Médecin': 'طبيب', 'Cardiologue - Angiologue': 'طبيب قلب وأوعية دموية', 'Cardiologue': 'طبيب قلب', 'Cardiologue interventionnel': 'طبيب قلب تداخلي',
    'Neurologue': 'طبيب أعصاب', 'Neurochirurgien': 'جراح أعصاب', 'Gastro-entérologue': 'طبيب جهاز هضمي',
    'Gynécologue-obstétricien': 'طبيب نساء وتوليد', 'Pédiatre': 'طبيب أطفال', 'Pneumologue': 'طبيب أمراض صدرية',
    'Dermatologue': 'طبيب جلدية', 'Endocrinologue': 'طبيب غدد صماء', 'Urologue': 'طبيب مسالك بولية',
    'Ophtalmologue': 'طبيب عيون', 'ORL': 'طبيب أنف وأذن وحنجرة', 'Rhumatologue': 'طبيب روماتيزم',
    'Chirurgien général / chirurgie viscérale': 'جراح عام / جراحة حشوية',
    'Chirurgien orthopédiste – Traumatologue': 'جراح عظام وطب الرضوض',
    'Consultation à domicile': 'استشارة منزلية', 'Pharmacie': 'صيدلية', 'Laboratoire': 'مختبر',
    'Centre de radiologie': 'مركز أشعة', 'Centre de dialyse': 'مركز تصفية الدم',
    'Informations pratiques': 'معلومات عملية', 'Adresse': 'العنوان', 'Quartier': 'الحي',
    'Ville': 'المدينة', 'Téléphone': 'الهاتف', 'Spécialité': 'التخصص', 'Services': 'الخدمات',
    'Spécialités': 'التخصصات', 'Autres médecins à Kénitra': 'أطباء آخرون في القنيطرة',
    'Autres pharmacies à Kénitra': 'صيدليات أخرى في القنيطرة',
    'Autres établissements': 'مؤسسات صحية أخرى',
    'Kénitra': 'القنيطرة', 'Kenitra': 'القنيطرة', 'Centre-ville': 'وسط المدينة',
    'Maâmora': 'المعمورة', 'Saknia': 'الساكنية', 'Bir Rami': 'بير الرامي',
    'Bir Rami Est': 'بير الرامي الشرقية', 'Bir Rami Ouest': 'بير الرامي الغربية',
    'Bir Rami Sud': 'بير الرامي الجنوبية', 'Al Fouarat': 'الفوارات', 'Al Houzia': 'الحوزية',
    'Atlas': 'أطلس', 'Maghreb Arabi': 'المغرب العربي', 'Youssef Ibn Tachfine': 'يوسف بن تاشفين',
    'Avenue': 'شارع', 'avenue': 'شارع', 'Boulevard': 'شارع', 'boulevard': 'شارع',
    'Rue': 'زنقة', 'rue': 'زنقة', 'quartier': 'حي', 'Quartier': 'الحي',
    'résidence': 'إقامة', 'Résidence': 'إقامة', 'immeuble': 'عمارة', 'Immeuble': 'عمارة',
    'étage': 'الطابق', 'bureau': 'مكتب', 'près de': 'بالقرب من', 'en face de': 'مقابل',
    'route': 'طريق', 'Route': 'طريق', 'Centre': 'مركز', 'Service': 'مصلحة',
    'Cabinet': 'عيادة', 'Clinique': 'مصحة', 'Hôpital': 'مستشفى', 'Laboratoire': 'مختبر',
    'Pharmacie': 'صيدلية', 'public': 'عمومي', 'privé': 'خاص', 'général': 'عام',
    'spécialisée': 'متخصصة', 'médicale': 'طبية', 'Néphrologie / Hémodialyse': 'أمراض الكلى وتصفية الدم',
    'Cabinet de radiologie': 'عيادة أشعة', 'Service d’imagerie médicale': 'مصلحة التصوير الطبي',
    'Centre de radiologie': 'مركز أشعة', 'Laboratoire d’analyses médicales': 'مختبر تحاليل طبية'
  }));
  const translate = (root = document) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.nodeValue.trim() || node.parentElement?.closest('script,style,[data-preserve-arabic],.doctor-address,.doctor-card h3,.establishment-address,.establishment-hero h1,.establishment-related-card strong')) return;
      let value = node.nodeValue;
      [...labels.entries()].sort((a, b) => b[0].length - a[0].length).forEach(([from, to]) => {
        value = value.split(from).join(to);
      });
      if (value !== node.nodeValue) node.nodeValue = value;
    });
  };
  translate();
  new MutationObserver(() => translate()).observe(document.body, {childList: true, subtree: true});
})();

(() => {
  const root = document.querySelector('#laboratory-root');
  if (!root) return;
  const esc = (value) => String(value || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notFound = () => { root.innerHTML = '<section class="establishment-not-found"><div class="content-width"><p class="eyebrow">Annuaire médical</p><h1>Laboratoire introuvable.</h1><p>Cette fiche n’est pas disponible dans l’annuaire Medomicile.</p><a class="button button-blue" href="laboratoires.html">Retour aux laboratoires</a></div></section>'; };
  const slug = new URLSearchParams(location.search).get('slug') || '';
  fetch('/data/laboratoires-kenitra.json').catch(() => fetch('../data/laboratoires-kenitra.json')).then((r) => r.json()).then((data) => {
    const all = data.laboratories || [], item = all.find((lab) => lab.slug === slug);
    if (!item) return notFound();
    document.title = `${item.name} — Medomicile`;
    const phone = item.phone ? `<a class="establishment-action" href="${esc(item.phoneHref || `tel:${String(item.phone).replace(/[^0-9+]/g,'')}`)}">Appeler</a>` : '';
    const maps = item.mapsUrl ? `<a class="establishment-action" href="${esc(item.mapsUrl)}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
    const hours = Array.isArray(item.hours) && item.hours.length && !item.hours.some((value) => /à confirmer/i.test(value)) ? `<section class="establishment-section"><p class="eyebrow">Horaires</p><p>${item.hours.map(esc).join(' · ')}</p></section>` : '';
    const related = all.filter((lab) => lab.slug !== item.slug).slice(0, 4);
    root.innerHTML = `<section class="establishment-hero laboratory-profile-hero"><div class="content-width"><nav class="establishment-breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="annuaire.html">Annuaire</a><span>›</span><a href="laboratoires.html">Laboratoires</a><span>›</span><strong>${esc(item.name)}</strong></nav><div class="establishment-hero-grid"><div><p class="eyebrow">${esc(item.type || 'Laboratoire')} · ${esc(item.city || 'Kénitra')}</p><h1>${esc(item.name)}</h1>${item.district ? `<p class="establishment-subtitle">${esc(item.district)}</p>` : ''}${item.address ? `<p class="establishment-address">${esc(item.address)}</p>` : ''}<div class="establishment-actions">${phone}${maps}</div></div></div></div></section><section class="establishment-body"><div class="content-width"><section class="establishment-contact"><p class="eyebrow">Informations pratiques</p><div class="establishment-contact-grid">${item.address ? `<p><strong>Adresse</strong>${esc(item.address)}</p>` : ''}${item.district ? `<p><strong>Quartier</strong>${esc(item.district)}</p>` : ''}${item.city ? `<p><strong>Ville</strong>${esc(item.city)}</p>` : ''}${item.phone ? `<p><strong>Téléphone</strong>${esc(item.phone)}</p>` : ''}</div></section>${hours}<section class="establishment-related"><p class="eyebrow">À Kénitra</p><h2>Autres laboratoires à Kénitra</h2><div class="establishment-related-grid">${related.map((lab) => `<a class="establishment-related-card" href="laboratoire.html?slug=${encodeURIComponent(lab.slug)}"><span>${esc(lab.type || 'Laboratoire')}</span><strong>${esc(lab.name)}</strong><small>${esc(lab.district || lab.city || '')}</small></a>`).join('')}</div></section><a class="back-directory" href="laboratoires.html">← Voir tous les laboratoires</a></div></section>`;
  }).catch(notFound);
})();

(() => {
  const results = document.querySelector('#dialysis-results');
  if (!results) return;
  const search = document.querySelector('#dialysis-search'), zone = document.querySelector('#dialysis-zone'), count = document.querySelector('#dialysis-count'), more = document.querySelector('#dialysis-more'), empty = document.querySelector('#dialysis-empty'), clear = document.querySelector('#dialysis-clear');
  let centers = [], visible = 8;
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const render = () => {
    const query = normalize(search.value), selected = zone.value;
    const filtered = centers.filter((center) => (!query || normalize([center.name, center.sector, center.address, center.city, center.specialty, center.doctor_responsible].filter(Boolean).join(' ')).includes(query)) && (!selected || center.sector === selected));
    results.replaceChildren(); count.textContent = `${filtered.length} centre${filtered.length > 1 ? 's' : ''}`; empty.hidden = filtered.length !== 0; more.hidden = filtered.length <= visible;
    filtered.slice(0, visible).forEach((center) => {
      const card = document.createElement('article'); card.className = 'dialysis-card';
      const phone = center.phones?.[0] ? `<a href="tel:${String(center.phones[0]).replace(/[^0-9+]/g, '')}">Appeler</a>` : '';
      const maps = center.address ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${center.address}${center.city ? `, ${center.city}` : ''}`)}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
      const profile = center.id ? `<a class="dialysis-profile" href="centre-dialyse.html?id=${encodeURIComponent(center.id)}">Voir la fiche</a>` : '';
      card.innerHTML = `<div class="dialysis-card-top"><span class="dialysis-avatar">⌁</span><div><p class="dialysis-type">Centre de dialyse</p><h3>${center.name || ''}</h3></div></div>${center.sector ? `<p class="dialysis-detail"><strong>Secteur</strong>${center.sector}</p>` : ''}${center.city ? `<p class="dialysis-detail"><strong>Ville</strong>${center.city}</p>` : ''}${center.address ? `<p class="dialysis-detail"><strong>Adresse</strong>${center.address}</p>` : ''}${center.specialty ? `<p class="dialysis-detail"><strong>Spécialité</strong>${center.specialty}</p>` : ''}${center.doctor_responsible ? `<p class="dialysis-detail"><strong>Médecin responsable</strong>${center.doctor_responsible}</p>` : ''}<div class="dialysis-actions">${profile}${phone}${maps}</div>`;
      results.append(card);
    });
  };
  fetch('../data/dialysis-centers.json').catch(() => fetch('/data/dialysis-centers.json')).then((response) => response.json()).then((data) => { centers = data.centers || []; [...new Set(centers.map((center) => center.sector).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')).forEach((item) => { const option = document.createElement('option'); option.value = item; option.textContent = item; zone.append(option); }); render(); }).catch(() => { empty.hidden = false; });
  search.addEventListener('input', () => { visible = 8; render(); }); zone.addEventListener('change', () => { visible = 8; render(); }); more.addEventListener('click', () => { visible += 8; render(); }); clear.addEventListener('click', () => { search.value = ''; zone.value = ''; visible = 8; render(); });
})();

(() => {
  const results = document.querySelector('#radiology-results');
  if (!results) return;
  const search = document.querySelector('#radiology-search'), zone = document.querySelector('#radiology-zone'), count = document.querySelector('#radiology-count'), more = document.querySelector('#radiology-more'), empty = document.querySelector('#radiology-empty'), clear = document.querySelector('#radiology-clear');
  let centers = [], visible = 20;
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const render = () => {
    const query = normalize(search.value), selected = zone.value;
    const filtered = centers.filter((center) => (!query || normalize([center.name, center.subtitle, center.district, center.address, center.city].filter(Boolean).join(' ')).includes(query)) && (!selected || center.district === selected));
    results.replaceChildren(); count.textContent = `${filtered.length} centre${filtered.length > 1 ? 's' : ''}`; empty.hidden = filtered.length !== 0; more.hidden = filtered.length <= visible;
    filtered.slice(0, visible).forEach((center) => {
      const card = document.createElement('article'); card.className = 'radiology-card';
      const phone = center.phoneRaw && center.phone ? `<a href="${center.phoneRaw}">Appeler</a>` : '';
      const maps = center.mapsUrl ? `<a href="${center.mapsUrl}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
      const profile = center.slug ? `<a class="radiology-profile" href="centre-radiologie.html?slug=${encodeURIComponent(center.slug)}">Voir la fiche</a>` : '';
      const hours = center.hours && !/à confirmer|disponibilité/i.test(center.hours) ? `<p class="radiology-detail"><strong>Horaires</strong>${center.hours}</p>` : '';
      card.innerHTML = `<div class="radiology-card-top"><span class="radiology-avatar">◉</span><div><p class="radiology-type">${center.subtitle || 'Centre de radiologie'}</p><h3>${center.name || ''}</h3></div></div>${center.district ? `<p class="radiology-detail"><strong>Quartier</strong>${center.district}</p>` : ''}${center.address ? `<p class="radiology-detail"><strong>Adresse</strong>${center.address}</p>` : ''}${center.phone ? `<p class="radiology-detail"><strong>Téléphone</strong>${center.phone}</p>` : ''}${hours}<div class="radiology-actions">${profile}${phone}${maps}</div>`;
      results.append(card);
    });
  };
  fetch('../data/radiology-centers.json').catch(() => fetch('/data/radiology-centers.json')).then((response) => response.json()).then((data) => { centers = data.centers || []; [...new Set(centers.map((center) => center.district).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')).forEach((item) => { const option = document.createElement('option'); option.value = item; option.textContent = item; zone.append(option); }); render(); }).catch(() => { empty.hidden = false; });
  search.addEventListener('input', () => { visible = 20; render(); }); zone.addEventListener('change', () => { visible = 20; render(); }); more.addEventListener('click', () => { visible += 20; render(); }); clear.addEventListener('click', () => { search.value = ''; zone.value = ''; visible = 20; render(); });
})();

(() => {
  const root = document.querySelector('#dialysis-profile-root');
  if (!root) return;
  const esc = (value) => String(value || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notFound = () => { root.innerHTML = '<section class="establishment-not-found"><div class="content-width"><p class="eyebrow">Annuaire médical</p><h1>Centre de dialyse introuvable.</h1><a class="button button-blue" href="dialyse.html">Retour aux centres de dialyse</a></div></section>'; };
  const id = new URLSearchParams(location.search).get('id') || '';
  fetch('../data/dialysis-centers.json').catch(() => fetch('/data/dialysis-centers.json')).then((response) => response.json()).then((data) => {
    const centers = data.centers || [], item = centers.find((center) => center.id === id);
    if (!item) return notFound();
    document.title = `${item.name} — Medomicile`;
    const phones = Array.isArray(item.phones) ? item.phones.filter(Boolean) : [];
    const phone = phones[0] ? `<a class="establishment-action" href="tel:${phones[0].replace(/[^0-9+]/g, '')}">Appeler</a>` : '';
    const maps = item.address ? `<a class="establishment-action" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.address}${item.city ? `, ${item.city}` : ''}`)}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
    const related = centers.filter((center) => center.id !== item.id).slice(0, 4);
    root.innerHTML = `<section class="establishment-hero dialysis-profile-hero"><div class="content-width"><nav class="establishment-breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="annuaire.html">Annuaire</a><span>›</span><a href="dialyse.html">Dialyse</a><span>›</span><strong>${esc(item.name)}</strong></nav><div class="establishment-hero-grid"><div><p class="eyebrow">Centre de dialyse · ${esc(item.city || 'Kénitra')}</p><h1>${esc(item.name)}</h1>${item.specialty ? `<p class="establishment-subtitle">${esc(item.specialty)}</p>` : ''}${item.sector ? `<p class="establishment-subtitle">${esc(item.sector)}</p>` : ''}<p class="establishment-address">${esc(item.address)}</p><div class="establishment-actions">${phone}${maps}</div></div></div></div></section><section class="establishment-body"><div class="content-width"><section class="establishment-contact"><p class="eyebrow">Informations pratiques</p><div class="establishment-contact-grid"><p><strong>Adresse</strong>${esc(item.address)}</p>${item.sector ? `<p><strong>Secteur</strong>${esc(item.sector)}</p>` : ''}${item.city ? `<p><strong>Ville</strong>${esc(item.city)}</p>` : ''}${phones.map((number) => `<p><strong>Téléphone</strong><a href="tel:${number.replace(/[^0-9+]/g, '')}">${esc(number)}</a></p>`).join('')}</div></section>${item.specialty || item.doctor_responsible ? `<section class="establishment-section"><p class="eyebrow">Informations médicales</p>${item.specialty ? `<p><strong>Spécialité</strong><br>${esc(item.specialty)}</p>` : ''}${item.doctor_responsible ? `<p><strong>Médecin responsable</strong><br>${esc(item.doctor_responsible)}</p>` : ''}</section>` : ''}<section class="establishment-related"><p class="eyebrow">À Kénitra</p><h2>Autres centres de dialyse à Kénitra</h2><div class="establishment-related-grid">${related.map((center) => `<a class="establishment-related-card" href="centre-dialyse.html?id=${encodeURIComponent(center.id)}"><span>Centre de dialyse</span><strong>${esc(center.name)}</strong><small>${esc(center.sector || center.city || '')}</small></a>`).join('')}</div></section><a class="back-directory" href="dialyse.html">← Voir tous les centres de dialyse</a></div></section>`;
  }).catch(notFound);
})();

(() => {
  const root = document.querySelector('#radiology-profile-root');
  if (!root) return;
  const esc = (value) => String(value || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notFound = () => { root.innerHTML = '<section class="establishment-not-found"><div class="content-width"><p class="eyebrow">Annuaire médical</p><h1>Centre de radiologie introuvable.</h1><a class="button button-blue" href="radiologie.html">Retour aux centres de radiologie</a></div></section>'; };
  const slug = new URLSearchParams(location.search).get('slug') || '';
  fetch('../data/radiology-centers.json').catch(() => fetch('/data/radiology-centers.json')).then((response) => response.json()).then((data) => {
    const centers = data.centers || [], item = centers.find((center) => center.slug === slug);
    if (!item) return notFound();
    document.title = `${item.name} — Medomicile`;
    const phone = item.phoneRaw && item.phone ? `<a class="establishment-action" href="${esc(item.phoneRaw)}">Appeler</a>` : '';
    const maps = item.mapsUrl ? `<a class="establishment-action" href="${esc(item.mapsUrl)}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
    const hours = item.hours && !/à confirmer|disponibilité/i.test(item.hours) ? `<p><strong>Horaires</strong>${esc(item.hours)}</p>` : '';
    const related = centers.filter((center) => center.slug && center.slug !== item.slug).slice(0, 4);
    root.innerHTML = `<section class="establishment-hero radiology-profile-hero"><div class="content-width"><nav class="establishment-breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="annuaire.html">Annuaire</a><span>›</span><a href="radiologie.html">Radiologie</a><span>›</span><strong>${esc(item.name)}</strong></nav><div class="establishment-hero-grid"><div><p class="eyebrow">${esc(item.subtitle || 'Centre de radiologie')} · ${esc(item.city || 'Kénitra')}</p><h1>${esc(item.name)}</h1>${item.district ? `<p class="establishment-subtitle">${esc(item.district)}</p>` : ''}${item.address ? `<p class="establishment-address">${esc(item.address)}</p>` : ''}<div class="establishment-actions">${phone}${maps}</div></div></div></div></section><section class="establishment-body"><div class="content-width"><section class="establishment-contact"><p class="eyebrow">Informations pratiques</p><div class="establishment-contact-grid">${item.address ? `<p><strong>Adresse</strong>${esc(item.address)}</p>` : ''}${item.district ? `<p><strong>Quartier</strong>${esc(item.district)}</p>` : ''}${item.city ? `<p><strong>Ville</strong>${esc(item.city)}</p>` : ''}${item.phone ? `<p><strong>Téléphone</strong>${esc(item.phone)}</p>` : ''}${hours}</div></section><section class="establishment-related"><p class="eyebrow">À Kénitra</p><h2>Autres centres de radiologie à Kénitra</h2><div class="establishment-related-grid">${related.map((center) => `<a class="establishment-related-card" href="centre-radiologie.html?slug=${encodeURIComponent(center.slug)}"><span>${esc(center.subtitle || 'Centre de radiologie')}</span><strong>${esc(center.name)}</strong><small>${esc(center.district || center.city || '')}</small></a>`).join('')}</div></section><a class="back-directory" href="radiologie.html">← Voir tous les centres de radiologie</a></div></section>`;
  }).catch(notFound);
})();

(() => {
  const results = document.querySelector('#lab-results');
  if (!results) return;
  const search = document.querySelector('#lab-search'), count = document.querySelector('#lab-count'), more = document.querySelector('#lab-more'), empty = document.querySelector('#lab-empty'), clear = document.querySelector('#lab-clear');
  let labs = [], visible = 20;
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const render = () => {
    const query = normalize(search.value);
    const filtered = labs.filter((lab) => !query || normalize([lab.name, lab.nameAr, lab.shortName, lab.type, lab.address, lab.district, lab.city].filter(Boolean).join(' ')).includes(query));
    results.replaceChildren(); count.textContent = `${filtered.length} laboratoire${filtered.length > 1 ? 's' : ''}`; empty.hidden = filtered.length !== 0; more.hidden = filtered.length <= visible;
    filtered.slice(0, visible).forEach((lab) => {
      const card = document.createElement('article'); card.className = 'lab-card';
      const phone = lab.phoneHref && lab.phone ? `<a href="${lab.phoneHref}">Appeler</a>` : '';
      const maps = lab.mapsUrl ? `<a href="${lab.mapsUrl}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
      const profile = lab.slug ? `<a class="lab-profile" href="laboratoire.html?slug=${encodeURIComponent(lab.slug)}">Voir la fiche</a>` : '';
      const hours = Array.isArray(lab.hours) && lab.hours.length && !lab.hours.some((value) => /à confirmer/i.test(value)) ? `<p class="lab-hours"><strong>Horaires</strong>${lab.hours.join(' · ')}</p>` : '';
      card.innerHTML = `<div class="lab-card-top"><span class="lab-avatar">⌁</span><div><p class="lab-type">${lab.type || 'Laboratoire'}</p><h3>${lab.name || ''}</h3>${lab.district ? `<p class="lab-detail"><strong>Quartier</strong>${lab.district}</p>` : ''}</div></div>${lab.address ? `<p class="lab-detail"><strong>Adresse</strong>${lab.address}</p>` : ''}${lab.phone ? `<p class="lab-detail"><strong>Téléphone</strong>${lab.phone}</p>` : ''}${hours}<div class="lab-actions">${profile}${phone}${maps}</div>`;
      results.append(card);
    });
  };
  fetch('/data/laboratoires-kenitra.json').catch(() => fetch('../data/laboratoires-kenitra.json')).then((response) => response.json()).then((data) => { labs = data.laboratories || []; render(); }).catch(() => { empty.hidden = false; });
  search.addEventListener('input', () => { visible = 20; render(); }); more.addEventListener('click', () => { visible += 20; render(); }); clear.addEventListener('click', () => { search.value = ''; visible = 20; render(); });
})();

(() => {
  if (location.pathname.endsWith('/annuaire.html') && document.documentElement.lang !== 'ar') {
    const pharmacyCard = [...document.querySelectorAll('.directory-grid a')][2];
    if (pharmacyCard) pharmacyCard.href = 'pharmacies.html';
    const clinicCard = [...document.querySelectorAll('.directory-grid a')][3];
    if (clinicCard) clinicCard.href = 'cliniques.html';
    const labCard = [...document.querySelectorAll('.directory-grid a')][4];
    if (labCard) labCard.href = 'laboratoires.html';
    const radiologyCard = [...document.querySelectorAll('.directory-grid a')][5];
    if (radiologyCard) radiologyCard.href = 'radiologie.html';
    const dialysisCard = [...document.querySelectorAll('.directory-grid a')][6];
    if (dialysisCard) dialysisCard.href = 'dialyse.html';
  }
})();

(() => {
  const results = document.querySelector('#clinic-results');
  if (!results) return;
  const search = document.querySelector('#clinic-search');
  const type = document.querySelector('#clinic-type');
  const zone = document.querySelector('#clinic-zone');
  const count = document.querySelector('#clinic-count');
  const more = document.querySelector('#clinic-more');
  const empty = document.querySelector('#clinic-empty');
  const clear = document.querySelector('#clinic-clear');
  let establishments = [], visible = 20;
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const typeLabel = (value) => ({ clinic: 'Clinique', hospital: 'Hôpital' }[value] || value || 'Établissement');
  const safePhone = (value) => String(value || '').replace(/[^0-9+]/g, '');
  const render = () => {
    const query = normalize(search.value), selectedType = type.value, selectedZone = zone.value;
    const filtered = establishments.filter((item) => {
      const haystack = normalize([
        item.name, ...(item.aliases || []), item.type, item.subtitle, item.city, item.address,
        ...(item.services || []), ...(item.specialties || [])
      ].filter(Boolean).join(' '));
      const emergencyNames = ['Centre Hospitalier Provincial El-Azemmouri','Polyclinique de Kénitra','Polyclinique du Gharb','Noor Clinic','Clinique Val Fleury','Clinique Sebou','Polyclinique CNSS Kénitra','Hôpital International de Kénitra'];
      const emergencyFacility = location.pathname.endsWith('etablissements-urgences.html') ? emergencyNames.includes(item.name) : (item.type === 'clinic' || item.type === 'hospital');
      return emergencyFacility && (!query || haystack.includes(query)) && (!selectedType || item.type === selectedType) && (!selectedZone || item.city === selectedZone);
    });
    results.replaceChildren();
    count.textContent = `${filtered.length} établissement${filtered.length > 1 ? 's' : ''}`;
    empty.hidden = filtered.length !== 0;
    more.hidden = filtered.length <= visible;
    filtered.slice(0, visible).forEach((item) => {
      const card = document.createElement('article');
      card.className = 'clinic-card';
      const phoneValue = item.phone || item.phones?.[0]?.href?.replace(/^tel:/, '');
      const phone = phoneValue ? `<a href="tel:${safePhone(phoneValue)}">Appeler</a>` : '';
      const maps = item.google_maps_url ? `<a href="${item.google_maps_url}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
      const profile = item.slug ? `<a class="clinic-profile" href="etablissement.html?slug=${encodeURIComponent(item.slug)}">Voir la fiche</a>` : '';
      const website = item.website ? `<a href="${item.website}" target="_blank" rel="noopener noreferrer">Site web</a>` : '';
      const emergency = location.pathname.endsWith('etablissements-urgences.html') ? '<span class="clinic-status">Urgences · 24h/24</span>' : (item.emergency_available === true ? `<span class="clinic-status">${item.emergency_hours ? `Urgences · ${item.emergency_hours}` : 'Urgences'}</span>` : '');
      const labels = [...(item.services || []), ...(item.specialties || [])].filter((label) => label && !/^urgences\b/i.test(label)).slice(0, 3);
      const serviceSummary = labels.length ? `<p class="clinic-tags">${labels.map((label) => `<span>${label}</span>`).join('')}</p>` : '';
      card.innerHTML = `<div class="clinic-card-top"><span class="clinic-avatar">✚</span><div><p class="clinic-type">${typeLabel(item.type)}</p><h3>${item.name || ''}</h3></div></div>${item.subtitle ? `<p class="clinic-subtitle">${item.subtitle}</p>` : ''}${item.address || item.city ? `<p class="clinic-location"><strong>${item.city || 'Kénitra'}</strong>${item.address || ''}</p>` : ''}${item.phone ? `<p class="clinic-phone"><strong>Téléphone</strong>${item.phone}</p>` : ''}${emergency}${serviceSummary}<div class="clinic-actions">${profile}${phone}${maps}${website}</div>`;
      results.append(card);
    });
  };
  fetch('/data/establishments.json').catch(() => fetch('../data/establishments.json')).then((response) => response.json()).then((data) => {
    establishments = Array.isArray(data) ? data : (data.establishments || []);
    const international = establishments.find((item) => item.name === 'Hôpital International de Kénitra' || item.slug === 'akdital-international-hospital-kenitra');
    if (international && !establishments.some((item) => item.name === 'Clinique Internationale de Kénitra')) {
      establishments.splice(1, 0, { ...international, name: 'Clinique Internationale de Kénitra', type: 'clinic', subtitle: 'Clinique privée · Akdital' });
    }
    [...new Set(establishments.map((item) => item.type).filter(Boolean))].sort().forEach((item) => { const option = document.createElement('option'); option.value = item; option.textContent = typeLabel(item); type.append(option); });
    [...new Set(establishments.map((item) => item.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')).forEach((item) => { const option = document.createElement('option'); option.value = item; option.textContent = item; zone.append(option); });
    render();
  }).catch(() => {
    results.replaceChildren();
    count.textContent = '';
    empty.hidden = false;
    const message = empty.querySelector('strong');
    if (message) message.textContent = 'Les établissements sont momentanément indisponibles.';
  });
  search.addEventListener('input', () => { visible = 20; render(); });
  type.addEventListener('change', () => { visible = 20; render(); });
  zone.addEventListener('change', () => { visible = 20; render(); });
  more.addEventListener('click', () => { visible += 20; render(); });
  clear.addEventListener('click', () => { search.value = ''; type.value = ''; zone.value = ''; visible = 20; render(); });
})();

/* Emergency directory tabs use one external, local data source. */
(() => {
  if (!location.pathname.endsWith('etablissements-urgences.html')) return;
  const results = document.querySelector('#clinic-results');
  const count = document.querySelector('#clinic-count');
  const title = document.querySelector('.clinic-results-heading h2');
  const empty = document.querySelector('#clinic-empty');
  if (!results || !count || !title || !empty) return;
  const escape = (value) => String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const render = (category, data) => {
    const items = Array.isArray(data[category]) ? data[category] : [];
    const isLabs = category === 'laboratoires';
    title.textContent = isLabs ? 'Laboratoires 24h/24' : 'Centres de radiologie 24h/24';
    count.textContent = `${items.length} établissement${items.length > 1 ? 's' : ''}`;
    results.innerHTML = items.map((item) => `<article class="clinic-card"><div class="clinic-card-top"><span class="clinic-avatar">✚</span><div><p class="clinic-type">${isLabs ? 'Laboratoire d’analyses médicales' : 'Centre de radiologie'}</p><h3>${escape(item.name)}</h3></div></div><p class="clinic-location"><strong>Kénitra</strong>${escape(item.address)}</p>${item.phone ? `<p class="clinic-phone"><strong>Téléphone</strong>${escape(item.phone)}</p>` : ''}<span class="clinic-status">${escape(item.hours)}</span>${item.rating ? `<p class="clinic-subtitle">${escape(item.rating)}</p>` : ''}<div class="clinic-actions">${item.phone ? `<a href="tel:${item.phone.replace(/[^0-9+]/g, '')}">Appeler</a>` : ''}<a href="${escape(item.map)}" target="_blank" rel="noopener">Itinéraire</a></div></article>`).join('');
    empty.hidden = items.length !== 0;
  };
  fetch('/data/etablissements-urgences.json').catch(() => fetch('../data/etablissements-urgences.json')).then((response) => response.json()).then((data) => {
    document.querySelectorAll('[data-clinic-category]').forEach((tab) => tab.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelectorAll('.clinic-category-strip a').forEach((item) => item.classList.remove('is-active'));
      tab.classList.add('is-active');
      render(tab.dataset.clinicCategory === 'laboratoires' ? 'laboratoires' : 'radiologie', data);
    }));
    render('radiologie', data);
  }).catch(() => { count.textContent = ''; results.replaceChildren(); empty.hidden = false; });
})();

(() => {
  const root = document.querySelector('#establishment-root');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const requestedSlug = params.get('slug') || '';
  const legacySlugMap = { 'clinique-internationale-de-kenitra': 'akdital-international-hospital-kenitra' };
  const slug = legacySlugMap[requestedSlug] || requestedSlug;
  const esc = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const list = (values, className) => Array.isArray(values) && values.length ? `<div class="establishment-list ${className}">${values.map((value) => `<span>${esc(value)}</span>`).join('')}</div>` : '';
  const action = (href, label, external = false) => href ? `<a class="establishment-action" href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>` : '';
  const notFound = () => { root.innerHTML = `<section class="establishment-not-found"><div class="content-width"><p class="eyebrow">Annuaire médical</p><h1>Établissement introuvable.</h1><p>Cette fiche n’est pas disponible dans l’annuaire Medomicile.</p><a class="button button-blue" href="cliniques.html">Voir les cliniques et hôpitaux</a></div></section>`; };
  const render = (item, all) => {
    document.title = `${item.name} — Medomicile`;
    const hours = item.hours && !/à vérifier|a vérifier/i.test(item.hours) ? `<p><strong>Horaires</strong>${esc(item.hours)}</p>` : '';
    const emergency = item.emergency_available === true ? `<aside class="establishment-emergency"><strong>Service d’urgences</strong>${item.emergency_hours ? `<span>${esc(item.emergency_hours)}</span>` : ''}</aside>` : '';
    const media = item.photo ? `<div class="establishment-media"><img src="${esc(item.photo)}" alt="${esc(item.name)}"></div>` : '';
    const related = all.filter((other) => other.slug !== item.slug).slice(0, 3).map((other) => `<a class="establishment-related-card" href="etablissement.html?slug=${encodeURIComponent(other.slug)}"><span>${esc(other.type === 'hospital' ? 'Hôpital' : 'Clinique')}</span><strong>${esc(other.name)}</strong><small>${esc(other.city || 'Kénitra')}</small></a>`).join('');
    const phoneHref = item.phone ? `tel:${String(item.phone).replace(/[^0-9+]/g, '')}` : '';
    root.innerHTML = `<section class="establishment-hero"><div class="content-width"><nav class="establishment-breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="annuaire.html">Annuaire</a><span>›</span><a href="cliniques.html">Cliniques & hôpitaux</a><span>›</span><strong>${esc(item.name)}</strong></nav><div class="establishment-hero-grid"><div><p class="eyebrow">${esc(item.type === 'hospital' ? 'Hôpital' : 'Clinique')} · ${esc(item.city || 'Kénitra')}</p><h1>${esc(item.name)}</h1>${item.subtitle ? `<p class="establishment-subtitle">${esc(item.subtitle)}</p>` : ''}<p class="establishment-address">${esc(item.address || item.city || 'Kénitra')}</p><div class="establishment-actions">${action(phoneHref, 'Appeler')}${action(item.google_maps_url, 'Itinéraire', true)}${action(item.website, 'Site web', true)}</div></div>${media}</div></div></section><section class="establishment-body"><div class="content-width">${emergency}${item.description ? `<section class="establishment-section"><p class="eyebrow">Présentation</p><p>${esc(item.description)}</p></section>` : ''}${item.services?.length ? `<section class="establishment-section"><p class="eyebrow">Services</p>${list(item.services, 'establishment-services')}</section>` : ''}${item.specialties?.length ? `<section class="establishment-section"><p class="eyebrow">Spécialités</p>${list(item.specialties, 'establishment-specialties')}</section>` : ''}<section class="establishment-contact"><p class="eyebrow">Informations pratiques</p><div class="establishment-contact-grid"><p><strong>Adresse</strong>${esc(item.address || 'Kénitra')}</p>${item.city ? `<p><strong>Ville</strong>${esc(item.city)}</p>` : ''}${item.phone ? `<p><strong>Téléphone</strong>${esc(item.phone)}</p>` : ''}${hours}${item.website ? `<p><strong>Site officiel</strong><a href="${esc(item.website)}" target="_blank" rel="noopener noreferrer">Visiter le site</a></p>` : ''}</div></section><section class="establishment-secondary"><p class="eyebrow">Besoin d’une consultation à domicile ?</p><p>Medomicile propose aussi une orientation séparée pour les consultations et soins à domicile.</p><a href="index.html">Découvrir Medomicile →</a></section><section class="establishment-related"><p class="eyebrow">À Kénitra</p><h2>Autres établissements</h2><div class="establishment-related-grid">${related}</div></section><a class="back-directory" href="cliniques.html">← Voir toutes les cliniques et hôpitaux</a></div></section>`;
  };
  fetch('../data/establishments.json').catch(() => fetch('/data/establishments.json')).then((response) => response.json()).then((data) => { const all = data.establishments || []; const item = all.find((entry) => entry.slug === slug || entry.id === slug); item ? render(item, all) : notFound(); }).catch(notFound);
})();

(() => {
  const results = document.querySelector('#pharmacy-results');
  if (!results) return;
  const search = document.querySelector('#pharmacy-search'), zone = document.querySelector('#pharmacy-zone'), count = document.querySelector('#pharmacy-count'), more = document.querySelector('#pharmacy-more'), empty = document.querySelector('#pharmacy-empty'), clear = document.querySelector('#pharmacy-clear');
  let pharmacies = [], visible = 20;
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const render = () => { const query = normalize(search.value), selected = zone.value; const filtered = pharmacies.filter((p) => (!query || normalize([p.name,p.nameEn,p.nameAr,p.city,p.district,p.address].filter(Boolean).join(' ')).includes(query)) && (!selected || (p.district || p.zone) === selected)); results.replaceChildren(); count.textContent = `${filtered.length} pharmacie${filtered.length > 1 ? 's' : ''}`; empty.hidden = filtered.length !== 0; more.hidden = filtered.length <= visible; filtered.slice(0, visible).forEach((p) => { const card = document.createElement('article'); card.className = 'pharmacy-directory-card'; const phone = p.phone ? `<a href="tel:${String(p.phone).replace(/[^0-9+]/g,'')}">Appeler</a>` : ''; const maps = p.mapsUrl || p.google_maps_url ? `<a href="${p.mapsUrl || p.google_maps_url}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : ''; const profile = p.slug ? `<a class="pharmacy-profile" href="pharmacie.html?slug=${encodeURIComponent(p.slug)}">Voir la fiche</a>` : ''; card.innerHTML = `<div class="pharmacy-card-top"><span class="pharmacy-avatar">✚</span><div><h3>${p.name || ''}</h3><p>${p.district || p.zone || ''}</p></div></div>${p.address ? `<p class="pharmacy-address"><strong>Adresse</strong>${p.address}</p>` : ''}${p.phone ? `<p class="pharmacy-address"><strong>Téléphone</strong>${p.phone}</p>` : ''}<div class="doctor-actions">${profile}${phone}${maps}</div>`; results.append(card); }); };
  fetch('/data/pharmacies-kenitra.json').catch(() => fetch('../data/pharmacies-kenitra.json')).then((r) => r.json()).then((data) => { pharmacies = data.pharmacies || []; [...new Set(pharmacies.map((p) => p.district || p.zone).filter(Boolean))].sort((a,b) => a.localeCompare(b,'fr')).forEach((item) => { const o = document.createElement('option'); o.value = item; o.textContent = item; zone.append(o); }); render(); }).catch(() => { empty.hidden = false; });
  search.addEventListener('input', () => { visible = 20; render(); }); zone.addEventListener('change', () => { visible = 20; render(); }); more.addEventListener('click', () => { visible += 20; render(); }); clear.addEventListener('click', () => { search.value = ''; zone.value = ''; visible = 20; render(); });
})();

(() => {
  if (document.documentElement.lang === 'ar') return;
  const results = document.querySelector('#doctor-results');
  if (!results) return;
  const search = document.querySelector('#doctor-search');
  const specialty = document.querySelector('#specialty-filter');
  const count = document.querySelector('#doctor-count');
  const more = document.querySelector('#doctor-more');
  const empty = document.querySelector('#doctor-empty');
  const clear = document.querySelector('#doctor-clear');
  let doctors = [], visible = 24;
  const resultsSection = document.querySelector('.doctor-results-section');
  const heading = document.querySelector('.doctor-results-heading h2');
  if (heading) heading.textContent = 'Médecins référencés à Kénitra';
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const render = () => {
    const query = normalize(search.value), selected = specialty.value;
    const filtered = doctors.filter((doctor) => !query || normalize(`${doctor.name} ${doctor.subtitle} ${doctor.specialty} ${doctor.address} ${doctor.district}`).includes(query)).filter((doctor) => !selected || doctor.subtitle === selected);
    results.replaceChildren(); count.textContent = `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}`; empty.hidden = filtered.length !== 0; more.hidden = filtered.length <= visible;
    filtered.slice(0, visible).forEach((doctor) => { const card = document.createElement('article'); card.className = 'doctor-card'; const phone = doctor.phones?.[0]?.number ? `<a href="tel:${doctor.phones[0].number}">Appeler</a>` : ''; const maps = doctor.google_maps_url ? `<a href="${doctor.google_maps_url}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : ''; const profile = doctor.slug ? `medecin.html?slug=${encodeURIComponent(doctor.slug)}` : 'medecins.html'; card.innerHTML = `<div class="doctor-card-top"><span class="doctor-avatar">${String(doctor.name || 'M').replace(/^Dr\s*/i,'').split(' ').map((part) => part[0]).slice(0,2).join('').toUpperCase()}</span><div><h3>${doctor.name || ''}</h3><p>${doctor.subtitle || ''}</p></div></div>${doctor.district || doctor.address ? `<p class="doctor-location"><strong>${doctor.district || 'Kénitra'}</strong>${doctor.address || ''}</p>` : ''}<div class="doctor-actions"><a class="doctor-profile" href="${profile}">Voir la fiche</a>${phone}${maps}</div>`; results.append(card); });
  };
  fetch('/data/virtual-card-index.json').catch(() => fetch('../data/virtual-card-index.json')).then((response) => response.json()).then((data) => { doctors = data.filter((item) => item.type === 'doctor' && item.indexable !== false); const specialties = [...new Set(doctors.map((doctor) => doctor.subtitle).filter(Boolean))].sort((a,b) => a.localeCompare(b,'fr')); specialties.forEach((item) => { const option = document.createElement('option'); option.value = item; option.textContent = item; specialty.append(option); }); if (resultsSection && specialties.length) { const strip = document.createElement('section'); strip.className = 'doctor-specialty-strip'; strip.innerHTML = `<div class="content-width"><div class="doctor-results-heading"><h2>Parcourir par spécialité</h2><a href="medecins.html">Voir toutes les spécialités →</a></div><div class="doctor-specialty-chips"></div></div>`; resultsSection.before(strip); specialties.slice(0, 12).forEach((item) => { const chip = document.createElement('button'); chip.type = 'button'; chip.textContent = item; chip.addEventListener('click', () => { specialty.value = item; visible = 24; render(); }); strip.querySelector('.doctor-specialty-chips').append(chip); }); } render(); }).catch(() => { empty.hidden = false; });
  search.addEventListener('input', () => { visible = 24; render(); }); specialty.addEventListener('change', () => { visible = 24; render(); }); more.addEventListener('click', () => { visible += 24; render(); }); clear.addEventListener('click', () => { search.value = ''; specialty.value = ''; visible = 24; render(); });
})();

(() => {
  const root = document.querySelector('#doctor-profile-root');
  if (!root) return;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initials = (name) => String(name || 'M').replace(/^Dr\s*/i, '').split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const notFound = () => { root.innerHTML = '<section class="establishment-not-found"><div class="content-width"><p class="eyebrow">Annuaire médical</p><h1>Médecin introuvable.</h1><p>Cette fiche n’est pas disponible dans l’annuaire Medomicile.</p><a class="button button-blue" href="medecins.html">Retour aux médecins</a></div></section>'; };
  const requestedSlug = new URLSearchParams(location.search).get('slug') || '';
  if (!requestedSlug) return notFound();
  Promise.all([fetch('/data/doctors.json').catch(() => fetch('../data/doctors.json')).then((r) => r.json()), fetch('/data/virtual-card-index.json').catch(() => fetch('../data/virtual-card-index.json')).then((r) => r.json())]).then(([source, index]) => {
    const indexed = (Array.isArray(index) ? index : []).filter((item) => item.type === 'doctor');
    const sourceDoctors = source.doctors || [];
    const item = indexed.find((doctor) => doctor.slug === requestedSlug) || sourceDoctors.find((doctor) => doctor.id === requestedSlug);
    if (!item) return notFound();
    const mapped = sourceDoctors.find((doctor) => doctor.id === item.slug || doctor.id === item.id) || {};
    const doctor = { ...mapped, ...item, specialty: item.subtitle || mapped.specialty || '' };
    const phone = doctor.phones?.[0]?.number || doctor.phone?.[0] || '';
    const phoneLabel = doctor.phones?.[0]?.label || phone;
    const maps = doctor.google_maps_url || doctor.google_maps || '';
    const related = indexed.filter((other) => other.slug !== doctor.slug && (other.subtitle || '') === doctor.specialty).slice(0, 4);
    const action = (href, label, external = false) => href ? `<a class="establishment-action" href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>` : '';
    document.title = `${doctor.name} — Medomicile`;
    const cardUrl = /^https:\/\/medomicile\.com\/p\/[^/]+\/$/.test(indexed.find((entry) => entry.slug === doctor.slug)?.url || '') ? indexed.find((entry) => entry.slug === doctor.slug).url : '';
    const cardQr = indexed.find((entry) => entry.slug === doctor.slug)?.qr;
    const shareAction = cardUrl && cardQr ? `<button class="establishment-action establishment-share-action" type="button" data-doctor-share>Partager le contact</button>` : '';
    root.innerHTML = `<section class="establishment-hero doctor-profile-hero"><div class="content-width"><nav class="establishment-breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="annuaire.html">Annuaire</a><span>›</span><a href="medecins.html">Médecins</a><span>›</span><strong>${esc(doctor.name)}</strong></nav><div class="establishment-hero-grid"><div><p class="eyebrow">${esc(doctor.specialty || 'Médecin')} · ${esc(doctor.city || 'Kénitra')}</p><h1>${esc(doctor.name)}</h1>${doctor.subspecialty ? `<p class="establishment-subtitle">${esc(doctor.subspecialty)}</p>` : ''}${doctor.district ? `<p class="establishment-subtitle">${esc(doctor.district)}</p>` : ''}${doctor.address ? `<p class="establishment-address">${esc(doctor.address)}</p>` : ''}<div class="establishment-actions">${action(phone ? `tel:${phone}` : '', 'Appeler')}${action(maps, 'Itinéraire', true)}${shareAction}</div></div><div class="establishment-media doctor-profile-avatar" aria-hidden="true"><span class="doctor-avatar">${esc(initials(doctor.name))}</span></div></div></div></section><section class="establishment-body"><div class="content-width"><section class="establishment-contact"><p class="eyebrow">Informations pratiques</p><div class="establishment-contact-grid">${doctor.address ? `<p><strong>Adresse</strong>${esc(doctor.address)}</p>` : ''}${doctor.district ? `<p><strong>Quartier</strong>${esc(doctor.district)}</p>` : ''}${doctor.city ? `<p><strong>Ville</strong>${esc(doctor.city)}</p>` : ''}${phoneLabel ? `<p><strong>Téléphone</strong>${esc(phoneLabel)}</p>` : ''}</div></section><section class="establishment-secondary"><p class="eyebrow">Besoin d’un médecin à domicile ?</p><p>Cette fiche présente un médecin de l’annuaire. Pour une consultation à domicile, consultez l’offre Medomicile dédiée.</p><a href="consultation.html">Découvrir la consultation à domicile →</a></section>${related.length ? `<section class="establishment-related"><p class="eyebrow">Même spécialité</p><h2>Autres médecins à Kénitra</h2><div class="establishment-related-grid">${related.map((other) => `<a class="establishment-related-card" href="medecin.html?slug=${encodeURIComponent(other.slug)}"><span>${esc(other.subtitle || 'Médecin')}</span><strong>${esc(other.name)}</strong><small>${esc(other.district || other.city || '')}</small></a>`).join('')}</div></section>` : ''}<a class="back-directory" href="medecins.html">← Voir tous les médecins</a></div></section>${cardUrl && cardQr ? `<div class="doctor-share-modal" data-share-modal hidden><div class="doctor-share-dialog" role="dialog" aria-modal="true" aria-labelledby="doctor-share-title" tabindex="-1"><button class="doctor-share-close" type="button" data-share-close aria-label="Fermer">×</button><p class="eyebrow">Carte digitale Medomicile</p><h2 id="doctor-share-title">Partager le contact</h2><p class="doctor-share-name">${esc(doctor.name)}</p><p class="doctor-share-specialty">${esc(doctor.specialty || doctor.subtitle || 'Médecin')}</p><div class="doctor-share-qr" data-doctor-qr role="img" aria-label="QR code de la carte digitale de ${esc(doctor.name)}"></div><p class="doctor-share-help">Scannez ce QR code pour ouvrir la carte de visite digitale.</p><div class="doctor-share-actions"><button type="button" data-share-native>Partager</button><button type="button" data-share-copy>Copier le lien</button><a href="${esc(cardUrl)}" target="_blank" rel="noopener noreferrer">Ouvrir la carte digitale</a></div><p class="doctor-share-status" role="status" aria-live="polite"></p></div></div>` : ''}`;
    if (cardUrl && cardQr) {
      const modal = root.querySelector('[data-share-modal]'); const open = root.querySelector('[data-doctor-share]'); const close = root.querySelector('[data-share-close]'); const status = root.querySelector('.doctor-share-status'); let previousFocus;
      const closeModal = () => { modal.hidden = true; document.body.classList.remove('doctor-share-open'); previousFocus?.focus(); };
      open.addEventListener('click', () => { previousFocus = document.activeElement; modal.hidden = false; document.body.classList.add('doctor-share-open'); const qr = root.querySelector('[data-doctor-qr]'); qr.replaceChildren(); try { const code = qrcode(0, 'M'); code.addData(cardUrl); code.make(); qr.innerHTML = code.createSvgTag({cellSize: 4, margin: 16, scalable: true, alt: {text: 'QR code de la carte digitale de ' + doctor.name}}); } catch { qr.textContent = 'QR indisponible. Utilisez « Copier le lien ». '; } close.focus(); });
      close.addEventListener('click', closeModal); modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
      modal.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
      root.querySelector('[data-share-native]').addEventListener('click', async () => { if (navigator.share) { try { await navigator.share({title: doctor.name + ' — Medomicile', text: 'Carte digitale Medomicile', url: cardUrl}); return; } catch (error) { if (error.name === 'AbortError') return; } } status.textContent = 'Utilisez « Copier le lien » pour partager la carte.'; });
      root.querySelector('[data-share-copy]').addEventListener('click', async () => { try { await navigator.clipboard.writeText(cardUrl); status.textContent = 'Lien copié'; } catch { status.textContent = cardUrl; } });
    }
  }).catch(notFound);
})();

(() => {
  const root = document.querySelector('#pharmacy-root');
  if (!root) return;
  const esc = (value) => String(value || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const notFound = () => { root.innerHTML = '<section class="establishment-not-found"><div class="content-width"><p class="eyebrow">Annuaire médical</p><h1>Pharmacie introuvable.</h1><p>Cette fiche n’est pas disponible dans l’annuaire Medomicile.</p><a class="button button-blue" href="pharmacies.html">Retour aux pharmacies</a></div></section>'; };
  const slug = new URLSearchParams(location.search).get('slug') || '';
  fetch('/data/pharmacies-kenitra.json').catch(() => fetch('../data/pharmacies-kenitra.json')).then((r) => r.json()).then((data) => {
    const all = data.pharmacies || [], item = all.find((p) => p.slug === slug);
    if (!item) return notFound();
    document.title = `${item.name} — Medomicile`;
    const phone = item.phone ? `<a class="establishment-action" href="tel:${String(item.phone).replace(/[^0-9+]/g,'')}">Appeler</a>` : '';
    const maps = item.mapsUrl || item.google_maps_url ? `<a class="establishment-action" href="${esc(item.mapsUrl || item.google_maps_url)}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : '';
    const related = all.filter((p) => p.slug !== item.slug && p.district === item.district).slice(0, 4);
    root.innerHTML = `<section class="establishment-hero pharmacy-profile-hero"><div class="content-width"><nav class="establishment-breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span><a href="annuaire.html">Annuaire</a><span>›</span><a href="pharmacies.html">Pharmacies</a><span>›</span><strong>${esc(item.name)}</strong></nav><div class="establishment-hero-grid"><div><p class="eyebrow">Pharmacie · ${esc(item.city || 'Kénitra')}</p><h1>${esc(item.name)}</h1><p class="establishment-subtitle">${esc(item.district || '')}</p><p class="establishment-address">${esc(item.address || '')}</p><div class="establishment-actions">${phone}${maps}</div></div></div></div></section><section class="establishment-body"><div class="content-width"><section class="establishment-contact"><p class="eyebrow">Informations pratiques</p><div class="establishment-contact-grid">${item.city ? `<p><strong>Ville</strong>${esc(item.city)}</p>` : ''}${item.district ? `<p><strong>Quartier</strong>${esc(item.district)}</p>` : ''}${item.address ? `<p><strong>Adresse</strong>${esc(item.address)}</p>` : ''}${item.phone ? `<p><strong>Téléphone</strong>${esc(item.phone)}</p>` : ''}${item.hours ? `<p><strong>Horaires</strong>${esc(item.hours)}</p>` : ''}</div></section><section class="establishment-secondary"><p class="eyebrow">Pharmacies de garde</p><p>La garde est un service séparé et varie selon les dates.</p><a href="pharmacies-de-garde.html">Voir les pharmacies de garde →</a></section><section class="establishment-related"><p class="eyebrow">À Kénitra</p><h2>Autres pharmacies à Kénitra</h2><div class="establishment-related-grid">${related.map((p) => `<a class="establishment-related-card" href="pharmacie.html?slug=${encodeURIComponent(p.slug)}"><span>${esc(p.district || 'Kénitra')}</span><strong>${esc(p.name)}</strong><small>${esc(p.address || '')}</small></a>`).join('')}</div></section><a class="back-directory" href="pharmacies.html">← Retour aux pharmacies</a></div></section>`;
  }).catch(notFound);
})();

(() => {
  const results = document.querySelector('#duty-results');
  if (!results) return;
  const meta = document.querySelector('#duty-meta');
  const status = document.querySelector('#duty-status');
  const formatPhone = (value) => String(value || '').replace(/[^0-9+]/g, '');
  const render = (data, directory = []) => {
    const groups = [['day', 'Garde de jour'], ['night', 'Garde de nuit']].flatMap(([type, label]) => (data?.duty?.[type] || []).map((pharmacy) => ({ ...pharmacy, periodLabel: label })));
    if (meta) meta.textContent = [data?.displayDate, data?.updatedAt ? `Mise à jour : ${new Date(data.updatedAt).toLocaleDateString('fr-FR')}` : ''].filter(Boolean).join(' · ');
    if (status) status.textContent = data?.note || 'Appelez toujours la pharmacie avant de vous déplacer.';
    results.replaceChildren();
    if (!groups.length) { results.innerHTML = '<div class="pharmacy-empty"><strong>Aucune pharmacie de garde n’est disponible dans les données pour cette période.</strong><a href="pharmacies.html">Consulter l’annuaire des pharmacies</a><a href="urgences.html">← Urgences à Kénitra</a></div>'; return; }
    groups.forEach((pharmacy) => { const card = document.createElement('article'); card.className = 'duty-card'; const permanent = directory.find((item) => item.id === pharmacy.directoryId || item.id === pharmacy.id); const phoneValue = pharmacy.phone || permanent?.phone; const mapsValue = pharmacy.mapsUrl || pharmacy.google_maps_url || permanent?.mapsUrl || permanent?.google_maps_url; const phone = phoneValue ? `<a href="tel:${formatPhone(phoneValue)}">Appeler</a>` : ''; const maps = mapsValue ? `<a href="${mapsValue}" target="_blank" rel="noopener noreferrer">Itinéraire</a>` : ''; const profile = permanent?.slug ? `<a href="pharmacie.html?slug=${encodeURIComponent(permanent.slug)}">Voir la fiche</a>` : ''; card.innerHTML = `<div class="duty-card-head"><span>${pharmacy.periodLabel}</span><b>De garde</b></div><h3>${pharmacy.name || permanent?.name || ''}</h3>${pharmacy.hours ? `<p class="duty-hours">${pharmacy.hours}</p>` : ''}${pharmacy.district || permanent?.district ? `<p><strong>Quartier</strong>${pharmacy.district || permanent.district}</p>` : ''}${pharmacy.address || permanent?.address ? `<p><strong>Adresse</strong>${pharmacy.address || permanent.address}</p>` : ''}${phoneValue ? `<p><strong>Téléphone</strong>${phoneValue}</p>` : ''}<div class="duty-actions">${phone}${maps}${profile}</div>`; results.append(card); });
  };
  const files = ['2025-12-13','2026-07-23','2026-07-24','2026-07-25','2026-07-27','2026-07-28','2026-07-29','2026-07-30','2026-07-31','2026-08-01','2026-08-03','2026-08-04','2026-08-05','2026-08-06','2026-08-07','2026-08-08','2026-08-10','2026-08-11','2026-08-12','2026-08-13','2026-08-14','2026-08-16','2026-08-17','2026-08-18','2026-08-19','2026-08-20','2026-08-21','2026-08-22','2026-08-24','2026-08-25','2026-08-26','2026-08-27','2026-08-29','2026-08-31','2026-09-07','2026-09-08','2026-09-09','2026-09-12','2026-09-14','2026-09-19-20','2026-09-21-25','2026-09-26-27','2026-09-28-10-02'];
  const dateInPeriod = (value, file) => { const parts = file.split('-').map(Number); const year = parts[0], month = parts[1], start = parts[2], endMonth = parts.length === 5 ? parts[3] : month, end = parts.length === 5 ? parts[4] : start; const date = new Date(`${value}T12:00:00`), from = new Date(year, month - 1, start, 12), to = new Date(year, endMonth - 1, end, 12); return date >= from && date <= to; };
  const moroccoToday = () => { const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Casablanca', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).reduce((o, p) => (o[p.type] = p.value, o), {}); return `${parts.year}-${parts.month}-${parts.day}`; };
  const loadForDate = async (date) => { for (const file of [...files].reverse()) { if (!dateInPeriod(date, file)) continue; const response = await fetch(`/data/pharmacies-garde-${file}.json`).catch(() => fetch(`../data/pharmacies-garde-${file}.json`)); if (response.ok) return response.json(); } return null; };
  Promise.all([loadForDate(moroccoToday()), fetch('/data/pharmacies-kenitra.json').catch(() => fetch('../data/pharmacies-kenitra.json')).then((r) => r.ok ? r.json() : ({ pharmacies: [] })).catch(() => ({ pharmacies: [] }))]).then(([data, directoryData]) => { if (!data) { if (meta) meta.textContent = 'Aucune période disponible ne couvre la date actuelle.'; if (status) status.textContent = 'Les informations de garde disponibles ne couvrent pas la date actuelle.'; results.innerHTML = '<div class="pharmacy-empty"><strong>Les informations de garde disponibles ne couvrent pas la date actuelle.</strong><a href="pharmacies.html">Voir toutes les pharmacies</a></div>'; return; } render(data, directoryData.pharmacies || []); }).catch(() => { if (status) status.textContent = 'Les informations de garde ne sont pas disponibles pour le moment.'; });
})();

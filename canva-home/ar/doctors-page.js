(function () {
  'use strict';

  const results = document.getElementById('doctor-results');
  if (!results) return;
  const search = document.getElementById('doctor-search');
  const specialty = document.getElementById('specialty-filter');
  const count = document.getElementById('doctor-count');
  const more = document.getElementById('doctor-more');
  const empty = document.getElementById('doctor-empty');
  const clear = document.getElementById('doctor-clear');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('doctors-menu');
  const pageSize = 12;
  let doctors = [];
  let translations = { specialties: {}, locations: {} };
  let visible = pageSize;

  const esc = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const phone = (entry) => Array.isArray(entry.phones) && entry.phones[0] ? entry.phones[0] : null;
  const translateText = (value, group) => {
    const source = String(value || '');
    const dictionary = translations[group] || {};
    return Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length).reduce((text, [from, to]) => {
      return text.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), to);
    }, source);
  };
  const arabic = (value, group) => translateText(value, group);
  const translateSpecialty = (value) => {
    const source = String(value || '');
    if (translations.specialties[source]) return translations.specialties[source];
    return Object.entries(translations.specialties).sort((a, b) => b[0].length - a[0].length).reduce((text, [from, to]) => text.replaceAll(from, to), source);
  };
  const mainSpecialty = (value) => {
    const source = String(value || '');
    const rules = [
      [/cardio|angiologue/i, 'Cardiologie'],
      [/viscéral|digestif|thyroïd|coelio/i, 'Chirurgie viscérale et digestive'],
      [/neurochirurg|neurolog/i, 'Neurologie et neurochirurgie'],
      [/orthopéd|traumatolog/i, 'Traumatologie et orthopédie'],
      [/gastro|hépato|proctolog/i, 'Gastro-entérologie'],
      [/urolog|androlog/i, 'Urologie'],
      [/pneumolog|phtisiolog|allergolog|somnolog/i, 'Pneumologie'],
      [/endocrin|diabétolog|nutrition|diétét/i, 'Endocrinologie et diabétologie'],
      [/dermatolog|vénérolog/i, 'Dermatologie'],
      [/ophtalmolog/i, 'Ophtalmologie'],
      [/pédiatr|néonatolog/i, 'Pédiatrie'],
      [/rhumatolog/i, 'Rhumatologie'],
      [/interniste|médecine interne/i, 'Médecine interne']
    ];
    return (rules.find(([pattern]) => pattern.test(source)) || [null, source])[1] || 'Spécialité médicale';
  };
  const specialtyLabel = (entry) => translateSpecialty(entry.mainSpecialty || mainSpecialty(entry.subtitle || entry.specialty));
  const doctorName = (entry) => entry.nameAr || entry.aliases?.find((name) => /[\u0600-\u06FF]/.test(name)) || entry.name;
  const subSpecialtyLabel = (entry) => {
    const original = entry.subtitle || entry.specialty || '';
    const main = mainSpecialty(original);
    return original && original !== main ? translateSpecialty(original) : '';
  };

  function card(entry) {
    const firstPhone = phone(entry);
    const tel = firstPhone && (firstPhone.number || firstPhone.label);
    return '<article class="doctor-card"><div class="doctor-card-top"><span class="doctor-card-type">طبيب</span><span class="doctor-card-city">القنيطرة</span></div>'
      + '<h3 lang="ar">' + esc(doctorName(entry)) + '</h3><p class="doctor-specialty">' + esc(specialtyLabel(entry)) + '</p>'
      + (subSpecialtyLabel(entry) ? '<p class="doctor-sub-specialty">' + esc(subSpecialtyLabel(entry)) + '</p>' : '')
      + '<p class="doctor-address">' + esc(entry.addressAr || arabic(entry.address || entry.district || 'القنيطرة', 'locations')) + '</p><div class="doctor-card-actions">'
      + '<a class="button button-primary" href="medecin.html?slug=' + encodeURIComponent(entry.slug || '') + '">عرض الملف</a>'
      + (tel ? '<a class="button button-secondary" href="tel:' + esc(tel) + '">اتصال</a>' : '')
      + (entry.google_maps_url ? '<a class="doctor-map-link" href="' + esc(entry.google_maps_url) + '" target="_blank" rel="noopener">الاتجاهات</a>' : '')
      + '</div></article>';
  }

  function filtered() {
    const query = (search.value || '').trim().toLowerCase();
    const selected = specialty.value;
    return doctors.filter((entry) => {
      const haystack = [entry.name, entry.subtitle, entry.address, entry.district, entry.city].filter(Boolean).join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (!selected || mainSpecialty(entry.subtitle) === selected);
    });
  }

  function render() {
    const list = filtered();
    const shown = list.slice(0, visible);
    results.innerHTML = shown.map(card).join('');
    count.textContent = list.length + ' ' + (list.length === 1 ? 'نتيجة' : 'نتائج');
    more.hidden = list.length <= visible;
    empty.hidden = list.length !== 0;
  }

  function populateSpecialties() {
    [...new Set(doctors.map((entry) => mainSpecialty(entry.subtitle)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')).forEach((value) => {
      specialty.insertAdjacentHTML('beforeend', '<option value="' + esc(value) + '">' + esc(translateSpecialty(value)) + '</option>');
    });
  }

  function load() {
    Promise.all([
      fetch('../../data/virtual-card-index.json').then((response) => response.json()),
      fetch('../../data/translations-ar.json').then((response) => response.json())
    ]).then(([data, dictionary]) => {
      translations = dictionary || translations;
      doctors = data.filter((entry) => entry.type === 'doctor' && entry.indexable !== false);
      populateSpecialties();
      render();
    }).catch(() => {
      count.textContent = 'تعذر تحميل الدليل';
      empty.hidden = false;
    });
  }

  search.addEventListener('input', () => { visible = pageSize; render(); });
  specialty.addEventListener('change', () => { visible = pageSize; render(); });
  more.addEventListener('click', () => { visible += pageSize; render(); });
  clear.addEventListener('click', () => { search.value = ''; specialty.value = ''; visible = pageSize; render(); });
  if (menuToggle && mobileMenu) menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.classList.toggle('is-open', !open);
  });
  load();
}());

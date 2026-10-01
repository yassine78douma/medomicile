(function () {
  'use strict';
  var root = document.querySelector('[data-v19-medecins]');
  if (!root) return;
  var specialtyMap = [
    ['Cardiologues', 'cardiologues-kenitra.html', ['cardiologue']], ['Traumatologues et orthopédistes', 'traumatologues-kenitra.html', ['traumatologue', 'orthopédiste']], ['Neurologie et neurochirurgie', 'neurologues-neurochirurgiens-kenitra.html', ['neurologue', 'neurochirurgien']], ['Ophtalmologues', 'ophtalmologues-kenitra.html', ['ophtalmologue']], ['Dentistes', 'dentistes-kenitra.html', ['dentiste', 'parodontologue', 'orthodontiste']], ['Gynécologues', 'gynecologues-kenitra.html', ['gynécologue']], ['Pédiatres', 'pediatres-kenitra.html', ['pédiatre']], ['Dermatologues', 'dermatologues-kenitra.html', ['dermatologue']], ['ORL', 'orl-kenitra.html', ['orl']], ['Pneumologues', 'pneumologues-kenitra.html', ['pneumologue']], ['Endocrinologues', 'endocrinologues-kenitra.html', ['endocrinologue']], ['Rhumatologues', 'rhumatologues-kenitra.html', ['rhumatologue']], ['Urologues', 'urologues-kenitra.html', ['urologue']], ['Internistes', 'internistes-kenitra.html', ['interniste']], ['Gastro-entérologues', 'gastroenterologues-kenitra.html', ['gastro', 'hépatologue']], ['Chirurgiens viscéralistes', 'visceralistes-kenitra.html', ['viscéral', 'visceral']]
  ];
  var state = { doctors: [], query: '', specialty: root.dataset.specialtyTerms || '', limit: 20, interacted: Boolean(root.dataset.specialtyTerms) };
  var search = root.querySelector('[data-doctor-search]');
  var results = root.querySelector('[data-doctor-results]');
  var count = root.querySelector('[data-doctor-count]');
  var empty = root.querySelector('[data-doctor-empty]');
  function normalize(value) { return String(value || '').toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
  function phone(d) { return Array.isArray(d.phone) ? d.phone[0] : d.phone || ''; }
  function matchesSpecialty(d, terms) { var hay = normalize((d.specialty || '') + ' ' + (d.specialty_group || '') + ' ' + (d.subspecialty || '')); terms = Array.isArray(terms) ? terms : String(terms || '').split('|'); return terms.some(function (term) { return hay.indexOf(normalize(term)) !== -1; }); }
  function match(d) { var hay = normalize([d.name, d.specialty, d.specialty_group, d.subspecialty, d.city, d.district, d.address].filter(Boolean).join(' ')); return (!state.query || hay.indexOf(normalize(state.query)) !== -1) && (!state.specialty || matchesSpecialty(d, state.specialty)); }
  function render() {
    var filtered = state.doctors.filter(match), visible = state.interacted ? filtered.slice(0, state.limit) : [];
    root.querySelectorAll('[data-doctor-count]').forEach(function (node) { node.textContent = state.interacted ? filtered.length + ' médecin' + (filtered.length > 1 ? 's' : '') : (state.doctors.length ? state.doctors.length + ' médecins disponibles' : 'Choisissez une spécialité'); });
    results.innerHTML = visible.map(function (d) { var p = phone(d), map = d.google_maps ? '<a class="v19-btn v19-btn--secondary" href="' + d.google_maps + '" target="_blank" rel="noopener noreferrer">Itinéraire</a>' : ''; return '<article class="v19-surface v19-result"><span class="v19-result-type">' + (d.specialty || 'Médecin') + '</span><h3>' + d.name + '</h3><p class="v19-result-meta"><span>' + (d.district || d.city || '') + '</span><span>' + (d.address || 'Adresse non publiée') + '</span></p><div class="v19-result-actions"><a class="v19-btn v19-btn--primary" href="/p/' + encodeURIComponent(d.id) + '/">Voir le profil</a>' + (p ? '<a class="v19-btn v19-btn--secondary" dir="ltr" href="tel:' + p.replace(/[^+\d]/g, '') + '">Appeler</a>' : '') + map + '</div></article>'; }).join('');
    empty.hidden = visible.length !== 0;
    if (!visible.length) empty.textContent = state.interacted ? 'Aucun médecin correspondant dans cet annuaire.' : 'Choisissez une spécialité ou lancez une recherche pour afficher les médecins.';
  }
  function specialtyCards() {
    var target = root.querySelector('[data-specialties]');
    if (!target) return;
    target.innerHTML = specialtyMap.map(function (s) { var n = state.doctors.filter(function (d) { return matchesSpecialty(d, s[2]); }).length; return '<a class="v19-specialty-card" href="/' + s[1] + '"><strong>' + s[0] + '</strong><small>' + n + ' médecin' + (n > 1 ? 's' : '') + '</small><span>Explorer →</span></a>'; }).join('');
  }
  fetch('/data/doctors.json').then(function (r) { return r.json(); }).then(function (data) { state.doctors = data.doctors || []; specialtyCards(); render(); }).catch(function () { empty.hidden = false; empty.textContent = 'Les médecins ne peuvent pas être chargés pour le moment.'; });
  search.addEventListener('input', function () { state.query = search.value; state.interacted = true; render(); });
  root.querySelectorAll('[data-specialty-filter]').forEach(function (button) { button.addEventListener('click', function () { state.specialty = button.dataset.specialtyFilter; state.interacted = true; root.querySelectorAll('[data-specialty-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); }); render(); }); });
  window.addEventListener('v19-specialty-ready', function (event) { state.specialty = event.detail.terms; render(); });
})();

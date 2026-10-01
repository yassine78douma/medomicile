(function () {
  'use strict';

  var sources = [
    ['doctors', '/data/doctors.json', 'doctors'],
    ['pharmacies', '/data/virtual-card-index.json', null],
    ['garde', '/data/pharmacies-garde.json', 'directory'],
    ['labs', '/data/laboratoires-kenitra.json', 'laboratories'],
    ['radiology', '/data/radiology-centers.json', 'centers'],
    ['dialysis', '/data/dialysis-centers.json', 'centers'],
    ['establishments', '/data/establishments.json', 'establishments']
  ];
  var labels = { doctors: 'Médecins', pharmacies: 'Pharmacies', garde: 'Pharmacies de garde', labs: 'Laboratoires', radiology: 'Radiologie', dialysis: 'Dialyse', establishments: 'Établissements' };
  var routes = { doctors: '/medecins-kenitra.html', pharmacies: '/pharmacies-kenitra.html', garde: '/pharmacies-garde.html', labs: '/laboratoires-kenitra.html', radiology: '/radiologie-kenitra.html', dialysis: '/centres-dialyse-kenitra.html', establishments: '/hopitaux.html' };
  var allTypes = sources.map(function (source) { return source[0]; });
  var state = { rows: [], category: 'all', query: '', limit: 30, loaded: {}, loading: {} };
  var root = document.querySelector('[data-v19-annuaire]');
  if (!root) return;
  var input = root.querySelector('[data-v19-search]');
  var results = root.querySelector('[data-v19-results]');
  var count = root.querySelector('[data-v19-count]');
  var empty = root.querySelector('[data-v19-empty]');

  function normalize(value) { return String(value || '').toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
  function first(value) { return Array.isArray(value) ? value[0] : value; }
  function phoneOf(item) { var value = first(item.phone) || first(item.phones) || item.phoneDisplay || item.phoneRaw || ''; return value && typeof value === 'object' ? (value.number || value.label || value.href || '') : value; }
  function mapOf(item) { return item.google_maps || item.google_maps_url || item.mapsUrl || item.maps_url || ''; }
  function addressOf(item) { return item.address || item.district || item.sector || item.city || ''; }
  function profileOf(item, type) {
    if (type === 'doctors') return '/p/' + encodeURIComponent(item.id) + '/';
    if (item.path) return item.path;
    if (item.share_url && item.share_url.indexOf('https://medomicile.com/') === 0) return item.share_url.replace('https://medomicile.com', '');
    return routes[type];
  }
  function toRow(type, item) {
    var name = item.name || item.shortName || '';
    var searchable = [name, item.specialty, item.specialty_group, item.subspecialty, item.type, item.subtitle, item.district, item.sector, item.address, item.city, item.nameAr, item.aliases].flat().filter(Boolean).join(' ');
    return { type: type, name: name, category: labels[type], searchable: normalize(searchable), specialty: item.specialty || item.specialty_group || item.subtitle || item.type || '', address: addressOf(item), phone: phoneOf(item), map: mapOf(item), href: profileOf(item, type) };
  }
  function render() {
    var q = normalize(state.query);
    var filtered = state.rows.filter(function (row) { return (state.category === 'all' || row.type === state.category) && (!q || row.searchable.indexOf(q) !== -1); });
    var visible = filtered.slice(0, state.limit);
    count.textContent = filtered.length ? filtered.length + ' résultat' + (filtered.length > 1 ? 's' : '') : 'Aucun résultat';
    results.innerHTML = visible.map(function (row) {
      var phone = row.phone ? '<a class="v19-btn v19-btn--secondary" dir="ltr" href="tel:' + row.phone.replace(/[^+\d]/g, '') + '">Appeler</a>' : '';
      var map = row.map ? '<a class="v19-btn v19-btn--secondary" href="' + row.map + '" target="_blank" rel="noopener noreferrer">Itinéraire</a>' : '';
      return '<article class="v19-surface v19-result"><span class="v19-result-type">' + row.category + '</span><h3>' + row.name + '</h3><p class="v19-result-meta"><span>' + (row.specialty || '') + '</span><span>' + (row.address || 'Adresse non publiée') + '</span></p><div class="v19-result-actions"><a class="v19-btn v19-btn--primary" href="' + row.href + '">Voir la fiche</a>' + phone + map + '</div></article>';
    }).join('');
    empty.hidden = visible.length !== 0;
    if (!visible.length) empty.textContent = state.loaded[state.category === 'all' ? 'all' : state.category] || q ? 'Aucun résultat correspondant dans l’annuaire Medomicile.' : 'Sélectionnez une catégorie ou recherchez un nom, une spécialité, une zone ou une adresse.';
  }
  function loadTypes(types) {
    var pending = types.filter(function (type) { return !state.loaded[type] && !state.loading[type]; }).map(function (type) {
      var source = sources.find(function (item) { return item[0] === type; });
      state.loading[type] = true;
      return fetch(source[1]).then(function (response) { if (!response.ok) throw new Error(source[1]); return response.json(); }).then(function (data) {
        var list = source[2] ? data[source[2]] : data;
        state.rows = state.rows.concat(list.filter(function (item) { return type !== 'pharmacies' || item.type === 'pharmacy'; }).map(function (item) { return toRow(type, item); }));
        state.loaded[type] = true;
      }).catch(function () { state.loaded[type] = false; empty.hidden = false; empty.textContent = 'Les données ne peuvent pas être chargées pour le moment. Veuillez réessayer.'; }).finally(function () { delete state.loading[type]; });
    });
    return Promise.all(pending).then(function () { render(); });
  }
  input.addEventListener('input', function () { state.query = input.value; render(); if (normalize(state.query)) loadTypes(allTypes); });
  root.querySelectorAll('[data-v19-filter]').forEach(function (button) { button.addEventListener('click', function () { state.category = button.dataset.v19Filter; root.querySelectorAll('[data-v19-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); }); if (state.category === 'all') loadTypes(allTypes); else loadTypes([state.category]); render(); }); });
  render();
})();

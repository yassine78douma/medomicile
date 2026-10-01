(function () {
  'use strict';
  var root = document.querySelector('[data-v19-directory]');
  if (!root) return;
  var config = {
    source: root.dataset.source,
    collection: root.dataset.collection,
    label: root.dataset.label,
    route: root.dataset.route,
    kind: root.dataset.kind
  };
  var state = { rows: [], query: '', limit: 20 };
  var input = root.querySelector('[data-directory-search]');
  var filters = root.querySelector('[data-directory-filters]');
  var results = root.querySelector('[data-directory-results]');
  var count = root.querySelector('[data-directory-count]');
  var empty = root.querySelector('[data-directory-empty]');
  function normalize(v) { return String(v || '').toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
  function first(v) { return Array.isArray(v) ? (v[0] || '') : (v || ''); }
  function tel(v) { return String(v || '').replace(/[^+\d]/g, ''); }
  function row(item) {
    var phone = first(item.phone) || first(item.phoneDisplay) || first(item.phoneRaw) || first(item.phones);
    var map = item.mapsUrl || item.google_maps_url || item.maps_url || '';
    var location = item.district || item.sector || item.zone || '';
    var search = [item.name, item.shortName, item.address, location, item.city].filter(Boolean).join(' ');
    return { id: item.id || '', slug: item.slug || '', name: item.name || item.shortName || '', type: item.type || '', location: location, address: item.address || '', phone: phone, map: map, website: item.website || '', emergency: item.emergency_available === true, search: normalize(search + ' ' + (item.type || '')) };
  }
  function render() {
    var q = normalize(state.query), filtered = state.rows.filter(function (r) { return !q || r.search.indexOf(q) !== -1; }), visible = filtered.slice(0, state.limit);
    count.textContent = filtered.length + ' ' + config.label.toLocaleLowerCase('fr-FR');
    results.innerHTML = visible.map(function (r) {
      var actions = '';
      if (r.phone) actions += '<a class="v19-btn v19-btn--secondary" dir="ltr" href="tel:' + tel(r.phone) + '">Appeler</a>';
      if (r.map) actions += '<a class="v19-btn v19-btn--secondary" href="' + r.map + '" target="_blank" rel="noopener noreferrer">Itinéraire</a>';
      if (r.website) actions += '<a class="v19-btn v19-btn--secondary" href="' + r.website + '" target="_blank" rel="noopener noreferrer">Site web</a>';
      if (r.slug) actions += '<a class="v19-btn v19-btn--primary" href="' + config.route + '#' + encodeURIComponent(r.slug) + '">Voir la fiche</a>';
      return '<article class="v19-surface v19-result"><span class="v19-result-type">' + config.label + (r.type ? ' · ' + r.type : '') + '</span><h3>' + r.name + '</h3><p class="v19-result-meta"><span>' + (r.location || '') + '</span><span>' + (r.address || 'Adresse non publiée') + '</span></p>' + (r.emergency ? '<p class="v19-result-type">Urgences explicitement indiquées dans la source</p>' : '') + '<div class="v19-result-actions">' + actions + '</div></article>';
    }).join('');
    empty.hidden = visible.length !== 0;
    if (!visible.length) empty.textContent = 'Aucun résultat correspondant dans les données disponibles.';
  }
  fetch(config.source).then(function (r) { if (!r.ok) throw new Error(config.source); return r.json(); }).then(function (data) {
    var list = config.collection ? data[config.collection] : data;
    state.rows = (list || []).map(row);
    if (filters) { Array.from(new Set(state.rows.map(function (r) { return r.type; }).filter(Boolean))).forEach(function (type) { var button = document.createElement('button'); button.type = 'button'; button.className = 'v19-filter'; button.textContent = type === 'hospital' ? 'Hôpitaux' : type === 'clinic' ? 'Cliniques' : type; button.dataset.type = type; button.setAttribute('aria-pressed', 'false'); button.addEventListener('click', function () { var active = button.getAttribute('aria-pressed') === 'true'; button.setAttribute('aria-pressed', String(!active)); state.query = active ? '' : type; input.value = state.query; render(); }); filters.appendChild(button); }); }
    render();
  }).catch(function () { empty.hidden = false; empty.textContent = 'Les données ne peuvent pas être chargées pour le moment.'; });
  input.addEventListener('input', function () { state.query = input.value; render(); });
})();

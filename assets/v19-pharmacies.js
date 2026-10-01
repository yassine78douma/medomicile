(function () {
  'use strict';
  var root = document.querySelector('[data-v19-pharmacy-page]');
  if (!root) return;
  var garde = root.dataset.garde === 'true';
  var state = { rows: [], query: '', limit: 20, loaded: false };
  var search = root.querySelector('[data-pharmacy-search]'), results = root.querySelector('[data-pharmacy-results]'), count = root.querySelector('[data-pharmacy-count]'), empty = root.querySelector('[data-pharmacy-empty]');
  function normalize(v) { return String(v || '').toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
  function phone(v) { return String(v || '').replace(/[^+\d]/g, ''); }
  function row(item) { return { id: item.id, slug: item.slug || '', name: item.name, district: item.district || item.zone || '', address: item.address || '', phone: item.phone || '', map: item.mapsUrl || item.google_maps_url || '', hours: item.hours || '', search: normalize([item.name, item.district, item.zone, item.address].join(' ')) }; }
  function render() {
    var q = normalize(state.query), filtered = state.rows.filter(function (r) { return !q || r.search.indexOf(q) !== -1; }), visible = filtered.slice(0, state.limit);
    count.textContent = filtered.length + ' pharmacie' + (filtered.length > 1 ? 's' : '');
    results.innerHTML = visible.map(function (r) { var actions = r.phone ? '<a class="v19-btn v19-btn--secondary" dir="ltr" href="tel:' + phone(r.phone) + '">Appeler</a>' : ''; if (r.map) actions += '<a class="v19-btn v19-btn--secondary" href="' + r.map + '" target="_blank" rel="noopener noreferrer">Itinéraire</a>'; if (!garde) actions += '<a class="v19-btn v19-btn--primary" href="/pharmacies-kenitra.html#' + encodeURIComponent(r.slug || ('pharmacie-' + r.id)) + '">Voir la fiche</a>'; return '<article class="v19-surface v19-result"><span class="v19-result-type">' + (garde ? 'Pharmacie de garde · période indiquée' : 'Pharmacie') + '</span><h3>' + r.name + '</h3><p class="v19-result-meta"><span>' + (r.district || '') + '</span><span>' + (r.address || 'Adresse non publiée') + '</span>' + (garde && r.hours ? '<span>' + r.hours + '</span>' : '') + '</p><div class="v19-result-actions">' + actions + '</div></article>'; }).join('');
    empty.hidden = visible.length !== 0; if (!visible.length) empty.textContent = 'Aucune pharmacie correspondante dans les données disponibles.';
  }
  var url = garde ? '/data/pharmacies-garde.json' : '/data/pharmacies-kenitra.json';
  fetch(url).then(function (r) { return r.json(); }).then(function (data) { var list = garde ? data.directory : data.pharmacies; state.rows = list.map(row); state.loaded = true; if (garde) { var period = root.querySelector('[data-garde-period]'); if (period) period.textContent = data.displayDate || data.activeDate || 'Période indiquée dans les données'; var source = root.querySelector('[data-garde-source]'); if (source) source.textContent = data.note || 'Contactez la pharmacie avant de vous déplacer.'; } render(); }).catch(function () { empty.hidden = false; empty.textContent = 'Les données ne peuvent pas être chargées pour le moment.'; });
  search.addEventListener('input', function () { state.query = search.value; render(); });
})();

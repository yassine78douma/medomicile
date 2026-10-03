(function () {
  'use strict';
  const results = document.getElementById('pharmacy-results'); if (!results) return;
  const search = document.getElementById('pharmacy-search'), zone = document.getElementById('pharmacy-zone'), count = document.getElementById('pharmacy-count'), more = document.getElementById('pharmacy-more'), empty = document.getElementById('pharmacy-empty'), clear = document.getElementById('pharmacy-clear');
  const esc = (v) => String(v || '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const size = 12; let pharmacies = [], visible = size;
  function card(p) {
    const phone = p.phone || (Array.isArray(p.phones) && p.phones[0] && (p.phones[0].number || p.phones[0].label));
    const map = p.mapsUrl || p.google_maps_url;
    return '<article class="pharmacy-directory-card"><div class="pharmacy-card-top"><span class="pharmacy-avatar">✚</span><div><h3>' + esc(p.name || p.nameAr || p.nameEn) + '</h3><p>' + esc(p.district || p.zone || 'القنيطرة') + '</p></div></div>'
      + (p.address ? '<p class="pharmacy-address"><strong>العنوان</strong>' + esc(p.address) + '</p>' : '') + (phone ? '<p class="pharmacy-address"><strong>الهاتف</strong>' + esc(phone) + '</p>' : '')
      + '<div class="doctor-actions">' + (p.slug ? '<a class="pharmacy-profile" href="pharmacie.html?slug=' + encodeURIComponent(p.slug) + '">عرض الملف</a>' : '') + (phone ? '<a href="tel:' + esc(phone) + '">اتصال</a>' : '') + (map ? '<a href="' + esc(map) + '" target="_blank" rel="noopener">الاتجاهات</a>' : '') + '</div></article>';
  }
  function render() {
    const q = (search.value || '').trim().toLowerCase(), z = zone.value;
    const list = pharmacies.filter((p) => (!q || [p.name, p.nameAr, p.nameEn, p.city, p.district, p.address].filter(Boolean).join(' ').toLowerCase().includes(q)) && (!z || (p.district || p.zone) === z));
    results.innerHTML = list.slice(0, visible).map(card).join(''); count.textContent = list.length + ' ' + (list.length === 1 ? 'صيدلية' : 'صيدليات'); more.hidden = list.length <= visible; empty.hidden = list.length !== 0;
  }
  fetch('../../data/virtual-card-index.json').then((r) => r.json()).then((data) => { pharmacies = data.filter((p) => p.type === 'pharmacy' && p.indexable !== false); [...new Set(pharmacies.map((p) => p.district || p.zone).filter(Boolean))].sort().forEach((v) => zone.insertAdjacentHTML('beforeend', '<option value="' + esc(v) + '">' + esc(v) + '</option>')); render(); }).catch(() => { count.textContent = 'تعذر تحميل الدليل'; });
  search.addEventListener('input', () => { visible = size; render(); }); zone.addEventListener('change', () => { visible = size; render(); }); more.addEventListener('click', () => { visible += size; render(); }); clear.addEventListener('click', () => { search.value = ''; zone.value = ''; visible = size; render(); });
  const toggle = document.querySelector('.menu-toggle'), menu = document.getElementById('pharmacies-menu'); if (toggle && menu) toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!open)); menu.classList.toggle('is-open', !open); });
}());

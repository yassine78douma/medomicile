(() => {
  const esc = (value) => String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const facilityNames = {
    'Centre Hospitalier Provincial Azzamouri': 'المستشفى الإقليمي الزموري',
    'Clinique Internationale de Kénitra': 'العيادة الدولية بالقنيطرة',
    'Polyclinique de Kénitra': 'المصحة متعددة التخصصات بالقنيطرة',
    'Polyclinique du Gharb': 'المصحة متعددة التخصصات الغرب',
    'Noor Clinic': 'عيادة النور',
    'Clinique Val Fleury': 'مصحة فال فلوري',
    'Clinique Sebou': 'مصحة سبو',
    'Polyclinique CNSS Kénitra': 'المصحة متعددة التخصصات للضمان الاجتماعي بالقنيطرة'
  };
  const labNames = { 'Laboratoire Nader': 'مختبر نادر', 'Laboratoire Ibn Sina': 'مختبر ابن سينا' };
  const radioNames = { 'Clinique Internationale de Kénitra': 'العيادة الدولية بالقنيطرة', 'Centre de Radiologie Hassan II': 'مركز الأشعة الحسن الثاني', 'Hôpital International de Kénitra': 'المستشفى الدولي بالقنيطرة', 'Polyclinique CNSS Kénitra': 'المصحة متعددة التخصصات للضمان الاجتماعي بالقنيطرة', 'Polyclinique de Kénitra': 'المصحة متعددة التخصصات بالقنيطرة' };
  const card = (name, phone, address, status) => `<article class="clinic-card"><div class="clinic-card-top"><span class="clinic-avatar">✚</span><div><p class="clinic-type">${status}</p><h3>${esc(name)}</h3></div></div>${address ? `<p class="clinic-location"><strong>القنيطرة</strong>${esc(address)}</p>` : ''}${phone ? `<p class="clinic-phone"><strong>الهاتف</strong>${esc(phone)}</p>` : ''}<span class="clinic-status">${esc(status)}</span><div class="clinic-actions">${phone ? `<a href="tel:${phone.replace(/[^0-9+]/g, '')}">اتصال</a>` : ''}</div></article>`;
  Promise.all([fetch('../data/directory-index.json').then((r) => r.json()), fetch('../data/etablissements-urgences.json').then((r) => r.json())]).then(([directory, emergencyData]) => {
    const emergencyRoot = document.querySelector('#emergency-results .clinic-results');
    if (emergencyRoot) emergencyRoot.innerHTML = (directory.establishments || []).filter((x) => x.emergency_available === true).map((x) => card(facilityNames[x.name] || x.name, x.phone, x.address, 'الطوارئ · 24 ساعة / 24')).join('');
    const directoryCenters = directory.centers || [];
    const directoryLabs = directory.laboratories || [];
    const normalize = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/^laboratoire\s+/i, '').trim();
    const findDirectoryItem = (items, name) => {
      const query = normalize(name);
      return items.find((item) => [item.name, item.shortName].some((value) => {
        const candidate = normalize(value);
        return candidate === query || candidate.includes(query) || query.includes(candidate);
      }));
    };
    const radioRoot = document.querySelector('#radiology-results .clinic-results');
    if (radioRoot) radioRoot.innerHTML = directoryCenters.filter((item) => item.type === 'radiology_center' && item.open24h === true).map((item) => {
      return card(item.nameAr || radioNames[item.name] || item.name, item.phone, item.address, 'خدمة الأشعة · 24 ساعة / 24');
    }).join('');
    const labRoot = document.querySelector('#labs-results')?.nextElementSibling;
    // shortcut: directory-index has no emergency-lab flag, keep the validated emergency subset until the schema adds one.
    if (labRoot?.classList.contains('clinic-results')) labRoot.innerHTML = (emergencyData.laboratoires || []).map((x) => {
      const item = findDirectoryItem(directoryLabs, x.name.replace(/^Laboratoire\s+/i, ''));
      return card(labNames[x.name] || item?.nameAr || x.name, item?.phone || x.phone, item?.address || x.address, 'مختبر تحاليل طبية · 24 ساعة / 24');
    }).join('');
  }).catch(() => {});
})();

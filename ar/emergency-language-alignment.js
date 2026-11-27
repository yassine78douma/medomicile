document.addEventListener('DOMContentLoaded', () => {
  const notice = document.querySelector('.urgent-notice');
  if (notice) {
    const span = notice.querySelector('span');
    if (span) span.textContent = 'في حالة الطوارئ الطبية، اتصلوا بـ SAMU على الرقم 141. ولطلب النجدة، خصوصاً عند حادث في الطريق العام، اتصلوا بالحماية المدنية على الرقم 15.';
    const old = notice.querySelector('a');
    if (old) old.remove();
    const actions = document.createElement('div'); actions.className = 'urgent-notice-actions';
    actions.innerHTML = '<a href="tel:141">SAMU · 141</a><a href="tel:15">الحماية المدنية · 15</a>'; notice.appendChild(actions);
  }
  const first = document.querySelector('.faq-list details');
  if (first) { first.querySelector('summary').textContent = 'ما هي أرقام الطوارئ التي يجب الاتصال بها؟'; first.querySelector('p').textContent = 'في حالة الطوارئ الطبية اتصلوا بـ SAMU على الرقم 141. ولطلب النجدة أو عند حادثة سير اتصلوا بالحماية المدنية على الرقم 15.'; }
  const second = document.querySelectorAll('.faq-list details')[1];
  if (second) second.querySelector('p').textContent = 'لا. الاستشارة المنزلية لا تعوض خدمات الطوارئ العمومية. في حالة الطوارئ الطبية التي تهدد الحياة، اتصلوا بـ SAMU على الرقم 141.';
});

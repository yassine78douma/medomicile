document.addEventListener('DOMContentLoaded', () => {
  const tag = document.querySelector('.tag');
  if (tag) tag.textContent = 'Chabab';

  const intro = document.querySelector('.intro p');
  if (intro) intro.remove();

  const patientNote = document.querySelector('#patient-demo');
  if (patientNote) patientNote.remove();

  const guideNote = document.querySelector('.guide > p');
  if (guideNote) guideNote.remove();

  const footerNote = document.querySelector('.foot');
  if (footerNote) footerNote.remove();
});

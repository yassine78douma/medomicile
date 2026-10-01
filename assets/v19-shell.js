(function () {
  'use strict';

  var v19Root = document.querySelector('.v19-shell');
  if (!v19Root) return;

  v19Root.querySelectorAll('[data-v19-menu-toggle]').forEach(function (toggle) {
    var menuId = toggle.getAttribute('aria-controls');
    var menu = menuId ? v19Root.querySelector('#' + CSS.escape(menuId)) : null;
    if (!menu) return;

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.classList.remove('v19-menu-open');
    }

    function closeMenuAndRestoreFocus() {
      closeMenu();
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
      document.body.classList.toggle('v19-menu-open', !open);
      if (!open) {
        var firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    menu.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        event.preventDefault();
        closeMenuAndRestoreFocus();
      }
    });
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  });
})();

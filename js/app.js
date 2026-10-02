/* ==========================================================
   Ma rentrée en 6e — écran d'accueil, menu, navigation
   Tout le contenu est dans index.html : ce script affiche
   une page à la fois (selon l'adresse #...) et gère le menu.
   ========================================================== */
(function () {
  'use strict';

  var SITE_NAME = 'Ma rentrée en 6e';
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var desktop = window.matchMedia('(min-width: 1000px)');

  /* ---------- Écran d'accueil animé ---------- */
  var intro = document.getElementById('intro');
  function seenIntro() { try { return sessionStorage.getItem('mr6e-intro') === '1'; } catch (e) { return false; } }
  function onIntroKey(e) { if (intro && (e.key === 'Escape' || e.key === 'Enter')) closeIntro(); }
  function closeIntro() {
    if (!intro || intro.classList.contains('is-leaving')) return;
    try { sessionStorage.setItem('mr6e-intro', '1'); } catch (e) { /* pas de mémoire : l'intro reviendra */ }
    document.removeEventListener('keydown', onIntroKey);
    intro.classList.add('is-leaving');
    document.body.style.overflow = '';
    setTimeout(function () { if (intro) { intro.remove(); intro = null; } }, 650);
    var main = document.getElementById('contenu');
    if (main) main.focus({ preventScroll: true });
  }
  if (intro) {
    if (seenIntro() || (location.hash && location.hash !== '#accueil')) { intro.remove(); intro = null; }
    else {
      document.body.style.overflow = 'hidden';
      document.getElementById('intro-go').addEventListener('click', closeIntro);
      document.getElementById('intro-skip').addEventListener('click', closeIntro);
      document.addEventListener('keydown', onIntroKey);
      setTimeout(function () { var b = document.getElementById('intro-go'); if (b) b.focus({ preventScroll: true }); }, 2400);
      // Compteur du petit chargement (0 → 100 %), calé sur la barre
      var pct = document.getElementById('intro-pct');
      var t0 = performance.now() + 300, dur = 1700;
      (function tick(now) {
        if (!pct || !document.body.contains(pct)) return;
        var k = Math.min(Math.max((now - t0) / dur, 0), 1);
        var eased = 1 - Math.pow(1 - k, 3);
        pct.textContent = Math.round(eased * 100);
        if (k < 1) requestAnimationFrame(tick);
      })(performance.now());
    }
  }

  /* ---------- Menu mobile ---------- */
  var drawer = document.getElementById('drawer');
  var btnMenu = document.getElementById('btn-menu');
  function openDrawer() { drawer.hidden = false; btnMenu.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; document.getElementById('btn-close').focus(); }
  function closeDrawer() { drawer.hidden = true; btnMenu.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  btnMenu.addEventListener('click', openDrawer);
  document.getElementById('btn-close').addEventListener('click', function () { closeDrawer(); btnMenu.focus(); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) closeDrawer(); });
  if (desktop.addEventListener) desktop.addEventListener('change', function () { if (desktop.matches) closeDrawer(); });

  /* ---------- Menu déroulant « Les outils » (clic ou clavier) ---------- */
  var drop = document.querySelector('.has-drop');
  var dropBtn = document.getElementById('drop-btn');
  function setDrop(open) { drop.classList.toggle('is-open', open); dropBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  dropBtn.addEventListener('click', function () { setDrop(!drop.classList.contains('is-open')); });
  document.addEventListener('click', function (e) { if (!drop.contains(e.target)) setDrop(false); });
  drop.addEventListener('click', function (e) { if (e.target.closest('a')) { setDrop(false); dropBtn.blur(); } });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!drawer.hidden) { closeDrawer(); btnMenu.focus(); }
    setDrop(false);
  });

  /* ---------- Navigation entre les pages ---------- */
  function show(id, focus) {
    var page = document.getElementById(id);
    var target = null; // une partie de page (#pronote-demo…) : on ouvre la page puis on y descend
    if (page && !page.classList.contains('page')) { target = page; page = page.closest('.page'); }
    if (!page) page = document.getElementById('accueil');
    pages.forEach(function (p) { p.classList.toggle('is-active', p === page); });

    document.querySelectorAll('.mainnav a, .drawer a, .tooltabs a').forEach(function (a) {
      if (a.getAttribute('href') === '#' + page.id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    // Onglets des outils : visibles partout sauf sur l'accueil ; l'onglet actif est ramené à l'écran
    var tabs = document.getElementById('tooltabs');
    tabs.hidden = page.id === 'accueil';
    var active = tabs.querySelector('[aria-current="page"]');
    var list = tabs.querySelector('ul');
    if (!active) list.scrollLeft = 0;
    if (active && !tabs.hidden) {
      list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    }

    var brand = document.querySelector('.brand-name') ? document.querySelector('.brand-name').textContent : SITE_NAME;
    var sub = document.querySelector('.brand-sub') ? document.querySelector('.brand-sub').textContent : '';
    document.title = page.id === 'accueil' ? (sub ? brand + ' · ' + sub : brand) : t + ' · ' + brand;
    if (target) {
      setTimeout(function () { target.scrollIntoView({ block: 'start' }); }, 30);
      return;
    }
    window.scrollTo(0, 0);
    setTimeout(function () { window.scrollTo(0, 0); }, 0);
    if (focus) {
      var h1 = page.querySelector('h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }
  }
  function route(focus) { show((location.hash || '#accueil').slice(1), focus); }
  window.addEventListener('hashchange', function () { route(true); });

  // Boutons qui font défiler vers une partie de la page
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-jump]');
    if (!b) return;
    var target = document.getElementById(b.getAttribute('data-jump'));
    if (!target) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    var h = target.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  });

  // Boutons « Copier »
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var text = b.getAttribute('data-copy');
    var label = b.innerHTML;
    function ok() { b.textContent = 'Copié'; setTimeout(function () { b.innerHTML = label; }, 2000); }
    function fallback() {
      var v = b.parentNode.querySelector('.v');
      if (v) { var r = document.createRange(); r.selectNodeContents(v); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      b.textContent = 'Texte sélectionné';
      setTimeout(function () { b.innerHTML = label; }, 2500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
    else fallback();
  });

  /* ---------- Démo Pronote dans une fenêtre ---------- */
  var DEMO = { web: 'https://demo.index-education.net/pronote/parent.html', mobile: 'https://demo.index-education.net/pronote/mobile.parent.html' };
  var modal = document.getElementById('demo-modal');
  var frame = document.getElementById('demo-frame');
  var wrap = frame.parentNode;
  var aside = document.getElementById('demo-aside');
  var guideBtn = document.getElementById('demo-guide-toggle');
  function setVersion(v) {
    document.querySelectorAll('[data-demo-version]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-demo-version') === v ? 'true' : 'false'); });
    wrap.classList.toggle('is-mobile', v === 'mobile');
    document.getElementById('demo-newtab').href = DEMO[v];
    document.getElementById('demo-fallback-link').href = DEMO[v];
    if (window.MR6E_NO_IFRAME) { document.getElementById('demo-fallback').hidden = false; frame.hidden = true; return; }
    if (frame.getAttribute('src') !== DEMO[v]) frame.setAttribute('src', DEMO[v]);
  }
  function openDemo() {
    setVersion(window.matchMedia('(max-width: 759px)').matches ? 'mobile' : 'web');
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  function closeDemo() { if (modal.close) modal.close(); else modal.removeAttribute('open'); }
  modal.addEventListener('close', function () { document.body.style.overflow = ''; });
  modal.addEventListener('click', function (e) {
    var rect = modal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeDemo();
  });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-demo-open]')) openDemo(); });
  document.querySelectorAll('[data-demo-version]').forEach(function (b) { b.addEventListener('click', function () { setVersion(b.getAttribute('data-demo-version')); }); });
  document.getElementById('demo-close').addEventListener('click', closeDemo);
  guideBtn.addEventListener('click', function () { var o = aside.classList.toggle('is-open'); guideBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });

  // Changement de langue : mettre à jour le titre de l'onglet
  document.addEventListener('mr6e:lang', function () {
    var page = document.querySelector('.page.is-active');
    if (!page) return;
    var t = page.getAttribute('data-title');
    var brand = document.querySelector('.brand-name') ? document.querySelector('.brand-name').textContent : SITE_NAME;
    var sub = document.querySelector('.brand-sub') ? document.querySelector('.brand-sub').textContent : '';
    document.title = page.id === 'accueil' ? (sub ? brand + ' · ' + sub : brand) : t + ' · ' + brand;
  });

  route(false);
})();

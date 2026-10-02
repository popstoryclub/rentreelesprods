/* ==========================================================
   Ma rentrée en 6e — choix de la langue
   Les textes à traduire portent data-i18n="clé" (contenu) ou
   data-i18n-alt / -arialabel / -title / -dtitle (attributs).
   Les traductions sont dans js/i18n.js (window.MR6E_I18N).
   ========================================================== */
(function () {
  'use strict';

  var STORE = 'ma-rentree-6e:langue';
  var T = window.MR6E_I18N || {};

  // Langues proposées (nom dans la langue, puis nom en français)
  var LANGS = [
    { code: 'en', name: 'English', fr: 'Anglais' },
    { code: 'ar', name: 'العربية', fr: 'Arabe', variants: true },
    { code: 'tr', name: 'Türkçe', fr: 'Turc' },
    { code: 'hy', name: 'Հայերեն', fr: 'Arménien' },
    { code: 'uk', name: 'Українська', fr: 'Ukrainien' },
    { code: 'zh', name: '中文 (简体)', fr: 'Chinois' },
    { code: 'hi', name: 'हिन्दी', fr: 'Hindi' },
    { code: 'ja', name: '日本語', fr: 'Japonais' },
    { code: 'es', name: 'Español', fr: 'Espagnol' },
    { code: 'pt', name: 'Português', fr: 'Portugais' },
    { code: 'nl', name: 'Nederlands', fr: 'Néerlandais' },
    { code: 'ru', name: 'Русский', fr: 'Russe' },
    { code: 'swb', name: 'Shikomori', fr: 'Comorien' }
  ];
  var ARABIC = [
    { code: 'ar', name: 'العربية الفصحى', fr: 'Arabe standard' },
    { code: 'ar-DZ', name: 'الدارجة الجزائرية', fr: 'Arabe algérien' },
    { code: 'ar-MA', name: 'الدارجة المغربية', fr: 'Arabe marocain' },
    { code: 'ar-TN', name: 'الدارجة التونسية', fr: 'Arabe tunisien' },
    { code: 'ar-EG', name: 'العامية المصرية', fr: 'Arabe égyptien' }
  ];
  var FR = { code: 'fr', name: 'Français', fr: 'Français' };
  function find(code) {
    if (code === 'fr') return FR;
    for (var i = 0; i < ARABIC.length; i++) if (ARABIC[i].code === code) return ARABIC[i];
    for (var j = 0; j < LANGS.length; j++) if (LANGS[j].code === code) return LANGS[j];
    return null;
  }

  // Petites phrases de l'interface du sélecteur
  var UI = {
    device: { fr: 'Langue de votre appareil', en: 'Your device language', ar: 'لغة جهازك', tr: 'Cihazınızın dili', hy: 'Ձեր սարքի լեզուն', uk: 'Мова вашого пристрою', zh: '您设备的语言', hi: 'आपके डिवाइस की भाषा', ja: 'お使いの端末の言語', es: 'Idioma de su dispositivo', pt: 'Idioma do seu aparelho', nl: 'Taal van uw apparaat', ru: 'Язык вашего устройства', swb: 'Lugha ya simu yaho' },
    back: { fr: 'Retour', en: 'Back', ar: 'رجوع', tr: 'Geri', hy: 'Հետ', uk: 'Назад', zh: '返回', hi: 'वापस', ja: '戻る', es: 'Volver', pt: 'Voltar', nl: 'Terug', ru: 'Назад', swb: 'Rudi' },
    variant: { fr: 'Choisissez la variante la plus proche de vous.', ar: 'اختر اللهجة الأقرب إليك.' },
    auto: { fr: '', en: 'Automatic translation. If in doubt, the French version is the reference.', ar: 'ترجمة آلية. عند الشك، النسخة الفرنسية هي المرجع.', tr: 'Otomatik çeviri. Şüphe durumunda Fransızca sürüm esastır.', hy: 'Ավտոմատ թարգմանություն։ Կասկածի դեպքում հիմք է ֆրանսերեն տարբերակը։', uk: 'Автоматичний переклад. У разі сумніву орієнтуйтеся на французьку версію.', zh: '自动翻译。如有疑问，以法语版本为准。', hi: 'स्वचालित अनुवाद। संदेह होने पर फ़्रेंच संस्करण ही मान्य है।', ja: '自動翻訳です。不明な点はフランス語版が正式です。', es: 'Traducción automática. En caso de duda, la versión francesa es la referencia.', pt: 'Tradução automática. Em caso de dúvida, a versão francesa é a referência.', nl: 'Automatische vertaling. Bij twijfel geldt de Franse versie.', ru: 'Автоматический перевод. В случае сомнений ориентируйтесь на французскую версию.', swb: 'Tafsiri ya mashine. Ukiwa na shaka, rudi kwa lugha ya kifaransa.' }
  };
  function ui(key, code) {
    var base = code.indexOf('ar') === 0 ? 'ar' : code;
    return UI[key][base] || UI[key].fr || '';
  }

  function current() { try { return localStorage.getItem(STORE) || 'fr'; } catch (e) { return 'fr'; } }
  function deviceLang() {
    var list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'fr']);
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]);
      if (/^fr/i.test(l)) return 'fr';
      var m = l.match(/^ar-(DZ|MA|TN|EG)/i); if (m) return 'ar-' + m[1].toUpperCase();
      if (/^ar/i.test(l)) return 'ar';
      if (/^zh/i.test(l)) return 'zh';
      if (/^(swb|zdj|wni|wlc)/i.test(l)) return 'swb';
      var base = l.slice(0, 2).toLowerCase();
      if (find(base)) return base;
    }
    return 'fr';
  }

  var ATTRS = [['alt', 'alt'], ['arialabel', 'aria-label'], ['title', 'title'], ['dtitle', 'data-title']];
  function apply(code) {
    var dict = code === 'fr' ? null : T[code];
    if (code !== 'fr' && !dict) code = 'fr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el._fr === undefined) el._fr = el.innerHTML;
      var t = dict && dict[el.getAttribute('data-i18n')];
      el.innerHTML = t || el._fr;
    });
    ATTRS.forEach(function (a) {
      document.querySelectorAll('[data-i18n-' + a[0] + ']').forEach(function (el) {
        el._frA = el._frA || {};
        if (el._frA[a[1]] === undefined) el._frA[a[1]] = el.getAttribute(a[1]);
        var t = dict && dict[el.getAttribute('data-i18n-' + a[0])];
        el.setAttribute(a[1], t || el._frA[a[1]]);
      });
    });
    var root = document.documentElement;
    root.lang = code;
    root.dir = code.indexOf('ar') === 0 ? 'rtl' : 'ltr';
    var badge = document.getElementById('lang-code');
    if (badge) badge.textContent = code === 'fr' ? 'FR' : (code.indexOf('ar-') === 0 ? code.slice(3) : code === 'swb' ? 'KM' : code.toUpperCase());
    var note = document.getElementById('lang-note');
    if (note) { note.hidden = code === 'fr'; note.querySelector('span').textContent = ui('auto', code); }
    try { localStorage.setItem(STORE, code); } catch (e) { /* pas de mémoire : on continue */ }
    document.dispatchEvent(new CustomEvent('mr6e:lang', { detail: code }));
    renderAll();
  }

  /* ---------- Sélecteur ---------- */
  function card(l, cur, extra) {
    var on = cur === l.code || (l.variants && cur.indexOf('ar') === 0);
    return '<button type="button" class="lang-card' + (on ? ' is-on' : '') + (extra || '') + '" data-lang="' + l.code + '"' + (l.variants ? ' data-variants' : '') +
      ' aria-pressed="' + on + '" lang="' + l.code + '"><span class="lang-name"' + (l.code.indexOf('ar') === 0 ? ' dir="rtl"' : '') + '>' + l.name + '</span><span class="lang-fr" lang="fr">' + l.fr + '</span>' +
      (l.variants ? '<svg class="ic lang-more" aria-hidden="true"><use href="#i-arrow"/></svg>' : (on ? '<svg class="ic lang-check" aria-hidden="true"><use href="#i-check"/></svg>' : '')) + '</button>';
  }
  function render(box, mode) {
    var cur = current();
    if (mode === 'ar') {
      box.innerHTML = '<div class="lang-sub"><button type="button" class="lang-back" data-lang-back><svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg>' + ui('back', cur) + '</button>' +
        '<p class="lang-sub-title"><span dir="rtl" lang="ar">العربية</span> · Arabe</p><p class="lang-sub-help"><span dir="rtl" lang="ar">' + UI.variant.ar + '</span> · ' + UI.variant.fr + '</p></div>' +
        '<div class="lang-grid lang-grid-ar">' + ARABIC.map(function (l) { return card(l, cur); }).join('') + '</div>';
      return;
    }
    var dev = find(deviceLang()) || FR;
    var html = '<button type="button" class="lang-device' + (cur === dev.code ? ' is-on' : '') + '" data-lang="' + dev.code + '" aria-pressed="' + (cur === dev.code) + '">' +
      '<svg class="ic" aria-hidden="true"><use href="#i-phone"/></svg><span><span class="lang-name">' + dev.name + '</span><span class="lang-fr">' + ui('device', dev.code) + '</span></span>' +
      '<svg class="ic lang-go" aria-hidden="true"><use href="#i-arrow"/></svg></button>';
    var others = (dev.code === 'fr' ? [] : [FR]).concat(LANGS);
    html += '<div class="lang-grid">' + others.map(function (l) { return card(l, cur); }).join('') + '</div>';
    box.innerHTML = html;
  }
  function renderAll() { document.querySelectorAll('[data-lang-picker]').forEach(function (b) { render(b, b._mode); }); }

  document.addEventListener('click', function (e) {
    var box = e.target.closest('[data-lang-picker]');
    var v = e.target.closest('[data-variants]');
    if (box && v) { box._mode = 'ar'; render(box, 'ar'); var f = box.querySelector('.lang-card'); if (f) f.focus(); return; }
    if (box && e.target.closest('[data-lang-back]')) { box._mode = null; render(box); return; }
    var b = e.target.closest('[data-lang]');
    if (box && b) {
      box._mode = null;
      apply(b.getAttribute('data-lang'));
      var dlg = document.getElementById('lang-modal');
      if (dlg && dlg.open) dlg.close();
      return;
    }
    if (e.target.closest('[data-lang-open]')) {
      var d = document.getElementById('lang-modal');
      var intro = document.getElementById('intro');
      if (intro && intro.contains(e.target)) { var s = document.getElementById('intro-skip'); if (s) s.click(); }
      if (d) { d.querySelector('[data-lang-picker]')._mode = null; renderAll(); if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
    }
  });
  var closeBtn = document.getElementById('lang-close');
  if (closeBtn) closeBtn.addEventListener('click', function () { document.getElementById('lang-modal').close(); });
  var langModal = document.getElementById('lang-modal');
  if (langModal) {
    langModal.addEventListener('click', function (e) {
      var rect = langModal.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        if (langModal.close) langModal.close(); else langModal.removeAttribute('open');
      }
    });
  }

  renderAll();
  if (current() !== 'fr') apply(current());
})();

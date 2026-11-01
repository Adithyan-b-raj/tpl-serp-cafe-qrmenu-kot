/**
 * BMAD White-Label URL Personalizer Engine (whitelabel.js)
 * Supports: ?brand=&tagline=&primary=&dark=&bg=&phone=&wa=&logo=&reset_wl=1
 * Persists across Customer (/) and Admin (/admin.html) views via sessionStorage + link propagation.
 */
(function () {
  var STORAGE_KEY = 'bmad_wl_config_v1';

  function sanitizeHex(val) {
    if (!val) return '';
    var clean = String(val).trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) {
      return '#' + clean;
    }
    return '';
  }

  function sanitizePhone(val) {
    if (!val) return '';
    return String(val).replace(/[^0-9]/g, '');
  }

  function loadConfig() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('reset_wl') === '1') {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
      return {};
    }

    var stored = {};
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) || {};
    } catch (e) {}

    var updated = Object.assign({}, stored);
    if (params.has('brand')) updated.brand = params.get('brand').trim();
    if (params.has('tagline')) updated.tagline = params.get('tagline').trim();
    if (params.has('primary')) updated.primary = sanitizeHex(params.get('primary'));
    if (params.has('dark')) updated.dark = sanitizeHex(params.get('dark'));
    if (params.has('bg')) updated.bg = sanitizeHex(params.get('bg'));
    if (params.has('phone')) updated.phone = sanitizePhone(params.get('phone'));
    if (params.has('wa')) updated.wa = sanitizePhone(params.get('wa'));
    if (updated.phone && !updated.wa) updated.wa = updated.phone;
    if (updated.wa && !updated.phone) updated.phone = updated.wa;
    if (params.has('logo')) updated.logo = params.get('logo').trim();

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    return updated;
  }

  var config = loadConfig();
  window.__WL_CONFIG = config;

  function applyCssVariables(cfg) {
    var root = document.documentElement;
    if (!root) return;
    if (cfg.primary) {
      root.style.setProperty('--color-primary', cfg.primary);
      root.style.setProperty('--brand-primary', cfg.primary);
    }
    if (cfg.dark) {
      root.style.setProperty('--color-dark', cfg.dark);
      root.style.setProperty('--brand-dark', cfg.dark);
    }
    if (cfg.bg) {
      root.style.setProperty('--bg-main', cfg.bg);
      root.style.setProperty('--bg-canvas', cfg.bg);
      root.style.setProperty('--bg-sand', cfg.bg);
    }
  }

  function renderSplitBrand(el, brandText, fallbackSub) {
    while (el.firstChild) el.removeChild(el.firstChild);
    var parts = brandText.split(/\s+/);
    var mainPart = parts[0] || brandText;
    var subPart = parts.length > 1 ? parts.slice(1).join(' ') : (fallbackSub || 'Cafe');
    el.appendChild(document.createTextNode(mainPart + ' '));
    var span = document.createElement('span');
    span.textContent = subPart;
    el.appendChild(span);
  }

  function applyDomOverrides() {
    var cfg = window.__WL_CONFIG || {};
    applyCssVariables(cfg);

    if (cfg.brand || (cfg.logo && /^https?:\/\//i.test(cfg.logo))) {
      document.querySelectorAll('.brand-logo').forEach(function (el) {
        if (cfg.logo && /^https?:\/\//i.test(cfg.logo)) {
          while (el.firstChild) el.removeChild(el.firstChild);
          var img = document.createElement('img');
          img.src = cfg.logo;
          img.alt = cfg.brand || 'Brand Logo';
          img.style.maxHeight = '38px';
          img.style.width = 'auto';
          img.style.display = 'block';
          el.appendChild(img);
        } else if (cfg.brand) {
          renderSplitBrand(el, cfg.brand, 'Cafe');
        }
      });
    }

    if (cfg.brand) {
      var isAdmin = window.location.pathname.indexOf('admin') !== -1;
      document.title = cfg.brand + (isAdmin ? ' // Darkroom KDS Screen' : ' // Table QR Menu & Live KOT');

      document.querySelectorAll('.sidebar-brand-title').forEach(function (el) {
        renderSplitBrand(el, cfg.brand, 'KDS');
      });

      document.querySelectorAll('.mobile-brand').forEach(function (el) {
        renderSplitBrand(el, cfg.brand, 'Cafe');
      });

      document.querySelectorAll('[data-wl-brand]').forEach(function (el) {
        el.textContent = cfg.brand;
      });
    }

    if (cfg.tagline) {
      document.querySelectorAll('[data-wl-tagline], .hero-banner p').forEach(function (el) {
        el.textContent = cfg.tagline;
      });
    }

    var activePhone = cfg.phone || cfg.wa;
    if (activePhone) {
      var formatted = activePhone.length === 12
        ? '+' + activePhone.slice(0, 2) + ' ' + activePhone.slice(2, 7) + ' ' + activePhone.slice(7)
        : (activePhone.length === 10 ? '+91 ' + activePhone : '+' + activePhone);

      document.querySelectorAll('[data-wl-phone]').forEach(function (el) {
        el.textContent = formatted;
      });

      var waBtn = document.getElementById('floatingWaBtn');
      var activeBrand = cfg.brand || 'Roast & Crust';
      if (waBtn) {
        waBtn.href = 'https://wa.me/' + activePhone + '?text=' + encodeURIComponent('Hello ' + activeBrand + ', I would like to reserve a table / place an order');
      }

      var drawerWa = document.getElementById('drawerWaText');
      if (drawerWa) {
        drawerWa.textContent = 'Concierge: ' + formatted;
      }

      document.querySelectorAll('#adminWaInput, input[data-wl-wa], input[data-wl-phone]').forEach(function (inp) {
        inp.value = activePhone;
      });
    }

    // Propagate query params across internal links (index.html <-> admin.html)
    var qs = new URLSearchParams();
    ['brand', 'tagline', 'primary', 'dark', 'bg', 'phone', 'wa', 'logo', 'table'].forEach(function (k) {
      if (cfg[k]) qs.set(k, cfg[k]);
    });
    // Ensure current table is preserved if present in URL
    var currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has('table') && !qs.has('table')) {
      qs.set('table', currentParams.get('table'));
    }

    var qsStr = qs.toString();
    if (qsStr) {
      document.querySelectorAll('a[href^="admin.html"], a[href^="index.html"]').forEach(function (a) {
        var base = a.getAttribute('href').split('?')[0];
        a.setAttribute('href', base + '?' + qsStr);
      });
    }
  }

  window.applyWhiteLabel = applyDomOverrides;

  // Apply CSS variables immediately before body paint
  applyCssVariables(config);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDomOverrides);
  } else {
    applyDomOverrides();
  }
  window.addEventListener('load', applyDomOverrides);
  setTimeout(applyDomOverrides, 600);
})();

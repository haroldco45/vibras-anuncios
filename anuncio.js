/* Vibras Positivas HM · anuncios para todas las apps
   Uso en cualquier app (antes de </body>):
   <script src="https://haroldco45.github.io/vibras-anuncios/anuncio.js" data-app="caso-48-ops" defer></script>
   Opcional: data-posicion="derecha" (por defecto va a la izquierda).
   Opcional: un <div id="vibras-anuncio"></div> en la página pone el anuncio ahí, como tarjeta, en vez del ícono flotante. */
(function () {
  'use strict';
  if (window.__vibrasAnuncio) return;
  window.__vibrasAnuncio = true;

  var S = document.currentScript;
  var BASE = S && S.src ? S.src.replace(/[^\/]*(\?.*)?$/, '') : 'https://haroldco45.github.io/vibras-anuncios/';
  var APP = (S && S.getAttribute('data-app')) || location.hostname.split('.')[0] || 'app';
  var LADO = (S && S.getAttribute('data-posicion')) === 'derecha' ? 'right' : 'left';
  var TZ = 'America/Bogota';
  var CFG = { contador: '', anuncios: [] };

  function hoyCO() {
    try { return new Date().toLocaleDateString('en-CA', { timeZone: TZ }); }
    catch (e) { return new Date().toISOString().slice(0, 10); }
  }

  function guardado(k, v) {
    try {
      if (v === undefined) return sessionStorage.getItem(k);
      sessionStorage.setItem(k, v);
    } catch (e) { return null; }
  }

  /* contador de vistas y toques (GoatCounter, sin cookies) */
  function contar(tipo, ad) {
    if (!CFG.contador) return;
    var p = '/' + tipo + '/' + ad.id + '/' + APP;
    var t = (tipo === 'toque' ? 'Toque' : 'Vista') + ': ' + ad.id + ' en ' + APP;
    var img = new Image();
    img.src = 'https://' + CFG.contador + '.goatcounter.com/count?p=' + encodeURIComponent(p) +
      '&t=' + encodeURIComponent(t) + '&e=true&r=' + encodeURIComponent(location.hostname) + '&rnd=' + Math.random();
  }

  function elegir(lista) {
    var hoy = hoyCO();
    var ok = lista.filter(function (a) {
      if (!a || a.activo === false || !a.url) return false;
      if (a.desde && hoy < a.desde) return false;
      if (a.hasta && hoy > a.hasta) return false;
      var apps = a.apps && a.apps.length ? a.apps : ['*'];
      if (apps.indexOf('*') < 0 && apps.indexOf(APP) < 0) return false;
      if ((a.excluir || []).indexOf(APP) >= 0) return false;
      return true;
    });
    if (!ok.length) return null;
    var total = ok.reduce(function (s, a) { return s + (a.peso > 0 ? a.peso : 1); }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < ok.length; i++) {
      r -= ok[i].peso > 0 ? ok[i].peso : 1;
      if (r <= 0) return ok[i];
    }
    return ok[0];
  }

  function enlace(ad) {
    if (/^https?:\/\/wa\.me\//.test(ad.url)) return ad.url;
    var sep = ad.url.indexOf('?') >= 0 ? '&' : '?';
    return ad.url + sep + 'utm_source=' + encodeURIComponent(APP) + '&utm_medium=anuncio&utm_campaign=' + encodeURIComponent(ad.id);
  }

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var CSS = '' +
    ':host{all:initial}' +
    '*{box-sizing:border-box;margin:0;padding:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.flot{position:fixed;bottom:18px;' + LADO + ':16px;z-index:2147483000;display:flex;flex-direction:column;align-items:' + (LADO === 'left' ? 'flex-start' : 'flex-end') + ';gap:10px}' +
    '.ico{position:relative;display:flex;align-items:center;gap:0;height:52px;min-width:52px;padding:0 15px;border:0;border-radius:999px;cursor:pointer;background:#0f172a;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.35),0 0 0 2px var(--c);overflow:hidden;transition:gap .35s,padding .35s}' +
    '.ico svg{flex:none;width:22px;height:22px}' +
    '.ico .lb{max-width:0;white-space:nowrap;overflow:hidden;font-weight:800;font-size:13px;letter-spacing:.4px;transition:max-width .4s}' +
    '.ico.abre{gap:8px}.ico.abre .lb{max-width:120px}' +
    '.ico:before{content:"";position:absolute;inset:-2px;border-radius:999px;box-shadow:0 0 0 0 var(--c);animation:pul 2.4s infinite}' +
    '@keyframes pul{0%{box-shadow:0 0 0 0 var(--c);opacity:.7}80%,100%{box-shadow:0 0 0 14px transparent;opacity:0}}' +
    '.ico:focus-visible,.cta:focus-visible,.x:focus-visible{outline:3px solid #fff;outline-offset:3px}' +
    '.card{width:min(330px,calc(100vw - 32px));background:#0f172a;color:#eef2fb;border:1px solid #26365e;border-radius:18px;padding:14px;box-shadow:0 18px 40px rgba(0,0,0,.45);position:relative;overflow:hidden;animation:sube .35s ease both}' +
    '.card:after{content:"";position:absolute;left:0;top:0;height:3px;width:100%;background:var(--c);transform-origin:left;animation:barra 1.2s ease-out}' +
    '@keyframes sube{from{opacity:0;transform:translateY(14px) scale(.97)}}' +
    '@keyframes barra{from{transform:scaleX(0)}}' +
    '.tag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#0f172a;background:var(--c);border-radius:6px;padding:2px 7px}' +
    '.fila{display:flex;gap:12px;align-items:flex-start;margin-top:10px}' +
    '.av{flex:none;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-weight:900;font-size:20px;color:#0f172a;background:var(--c)}' +
    '.mar{font-size:12px;color:#9fb0d4;font-weight:600}' +
    '.ti{font-size:16px;font-weight:800;line-height:1.25;margin-top:2px}' +
    '.tx{font-size:13px;color:#c9d4ee;line-height:1.45;margin-top:10px}' +
    '.cta{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:12px;min-height:44px;border-radius:12px;background:var(--c);color:#0f172a;font-weight:800;font-size:14px;text-decoration:none;transition:transform .2s}' +
    '.cta:hover{transform:translateY(-2px)}' +
    '.x{position:absolute;top:8px;right:8px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:#9fb0d4;cursor:pointer;font-size:20px;line-height:1}' +
    '.x:hover{background:#1c2a4d;color:#fff}' +
    '.inline .card{width:100%;animation:none}' +
    '@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}' +
    '@media print{:host{display:none}}';

  var MEGAFONO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a3 3 0 0 1 0 6"/><path d="M18 6a7 7 0 0 1 0 12"/></svg>';

  function tarjeta(ad, cerrable) {
    return '<div class="card" role="complementary" aria-label="Publicidad">' +
      (cerrable ? '<button class="x" type="button" aria-label="Cerrar publicidad">\u00d7</button>' : '') +
      '<span class="tag">Publicidad</span>' +
      '<div class="fila"><div class="av" aria-hidden="true">' + esc(ad.inicial || (ad.marca || 'A').charAt(0)) + '</div>' +
      '<div><div class="mar">' + esc(ad.marca) + '</div><div class="ti">' + esc(ad.titulo) + '</div></div></div>' +
      (ad.texto ? '<p class="tx">' + esc(ad.texto) + '</p>' : '') +
      '<a class="cta" href="' + esc(enlace(ad)) + '" target="_blank" rel="noopener sponsored">' + esc(ad.boton || 'Ver m\u00e1s') + ' \u2192</a>' +
      '</div>';
  }

  function montar(ad) {
    var host = document.createElement('div');
    host.setAttribute('data-vibras-anuncio', ad.id);
    var raiz = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var color = /^#[0-9a-f]{3,8}$/i.test(ad.color || '') ? ad.color : '#FCD116';
    var lugar = document.getElementById('vibras-anuncio');

    raiz.innerHTML = '<style>' + CSS + ':host{--c:' + color + '}.flot,.inline{--c:' + color + '}</style>' +
      (lugar ? '<div class="inline">' + tarjeta(ad, false) + '</div>'
             : '<div class="flot"><div class="pan"></div><button class="ico" type="button" aria-expanded="false" aria-label="Ver publicidad">' + MEGAFONO + '<span class="lb">Publicidad</span></button></div>');

    (lugar || document.body).appendChild(host);

    raiz.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.cta')) contar('toque', ad);
    });

    var clave = 'vphm-vista-' + ad.id;
    if (!guardado(clave)) { guardado(clave, '1'); contar('vista', ad); }
    if (lugar) return;

    var ico = raiz.querySelector('.ico');
    var pan = raiz.querySelector('.pan');
    var abierto = false;

    function abrir(v) {
      abierto = v;
      ico.setAttribute('aria-expanded', v ? 'true' : 'false');
      pan.innerHTML = v ? tarjeta(ad, true) : '';
      if (v) {
        var x = pan.querySelector('.x');
        x.addEventListener('click', function () { abrir(false); ico.focus(); });
      }
    }

    ico.addEventListener('click', function () { abrir(!abierto); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && abierto) abrir(false); });

    // el ícono se presenta un momento ("Publicidad") y vuelve a quedar pequeño
    setTimeout(function () { ico.classList.add('abre'); }, 2500);
    setTimeout(function () { ico.classList.remove('abre'); }, 7500);
  }

  function iniciar() {
    var cada10min = Math.floor(Date.now() / 6e5);
    fetch(BASE + 'anuncios.json?v=' + cada10min)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (j) {
        CFG = j || CFG;
        var ad = elegir(CFG.anuncios || []);
        if (ad) montar(ad);
      })
      .catch(function () { /* sin anuncios: la app sigue igual */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

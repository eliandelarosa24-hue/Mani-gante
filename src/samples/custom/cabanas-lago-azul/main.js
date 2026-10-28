// Lago Azul · comportamiento a medida
import '../panels.js';
import './style.css';
import { CABINS, VOICES, FILM } from './data.js';
import { planSVG, ensureHatch } from './plan.js';
import { initLake, santiagoParts, hhmm } from './lake.js';
import { initSky, fmtH } from './sky.js';
import { initRipple } from './ripple.js';
import { drawChart, SPOTS, POIS, shore } from './site.js';
import { houseRow, elevationSVG } from './houses.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) / 4294967295;
const pad = (n) => String(n).padStart(2, '0');
const byId = Object.fromEntries(CABINS.map((c) => [c.id, c]));

/* Fotografías: el estilo de cada una viene de la plantilla (local → Unsplash → degradado) */
const tpl = $('template[data-photos]').content;
const photo = (slot) => tpl.querySelector(`[data-p="${slot}"]`)?.getAttribute('style') || '';

/* ───────────── Pantalla de carga: se dibujan las isobatas del lago ───────────── */
(function loader() {
  const svg = $('[data-load-chart]');
  let d = '';
  for (let i = 0; i < 9; i++) {
    let p = '';
    for (let x = -20; x <= 1220; x += 20) p += `${x === -20 ? 'M' : 'L'}${x} ${(220 + i * 46 + (30 - i * 2) * Math.sin(x / 170 + i * 0.5) + 10 * Math.sin(x / 61 + i)).toFixed(1)} `;
    d += `<path d="${p}" pathLength="1" style="--i:${i}"/>`;
  }
  svg.innerHTML = d;
})();
const minTime = reduced ? 0 : 2300, t0 = performance.now();
(function count(now) {
  if (document.body.classList.contains('is-ready')) return;
  const k = Math.min(1, (now - t0) / Math.max(1, minTime));
  $('[data-load-n]').textContent = String(Math.round((1 - Math.pow(1 - k, 2)) * 167)).padStart(3, '0');
  requestAnimationFrame(count);
})(t0);
const ready = () => setTimeout(() => document.body.classList.add('is-ready'), Math.max(0, minTime - (performance.now() - t0)));
if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
setTimeout(() => document.body.classList.add('is-ready'), 6000);

/* ───────────── Título por líneas ───────────── */
$$('.hero__title > span').forEach((s, i) => {
  const w = document.createElement('span');
  w.className = 'w'; w.style.transitionDelay = `${0.3 + i * 0.14}s`;
  while (s.firstChild) w.append(s.firstChild);
  s.append(w);
});

/* ───────────── El lago hoy y el cielo de la página ───────────── */
const SUN = initLake(hash);
$('[data-day-rise]').textContent = `Sale ${SUN.riseTxt}`;
$('[data-day-set]').textContent = `Se pone ${SUN.setTxt}`;
$('[data-sunset-b]').textContent = SUN.setTxt; $('[data-sunset-s]').textContent = SUN.setTxt;
const daySec = $('[data-day]');
let dayHour = null; // la sección "Un día" fija su propia hora mientras se recorre
initSky({ sunrise: SUN.sunrise, sunset: SUN.sunset, reduced, override: (s) => (s === daySec ? dayHour : null) });
setInterval(() => { const n = $('[data-t-now]'); if (n) n.textContent = hhmm(new Date()); }, 30000);
$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

/* ───────────── Navegación y menú ───────────── */
const nav = $('.nav');
const onScroll = () => nav.classList.toggle('is-solid', scrollY > 80);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const menuBtn = $('.nav__menu'), sheet = $('.sheet');
const setMenu = (open) => {
  sheet.classList.toggle('is-open', open); sheet.setAttribute('aria-hidden', String(!open));
  menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? 'Cerrar' : 'Menú';
  document.documentElement.style.overflow = open ? 'hidden' : '';
};
menuBtn.addEventListener('click', () => setMenu(!sheet.classList.contains('is-open')));
$$('a', sheet).forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* ───────────── Nota de muestra ───────────── */
const note = $('.note');
let noteT;
function toast(text) {
  $('[data-note-text]').textContent = text;
  note.classList.add('is-in'); clearTimeout(noteT); noteT = setTimeout(() => note.classList.remove('is-in'), 9000);
}
$('[data-note-close]').addEventListener('click', () => note.classList.remove('is-in'));
document.addEventListener('click', (e) => {
  const d = e.target.closest('[data-demo]');
  if (!d) return;
  e.preventDefault();
  toast(d.dataset.demo || 'En el sitio real, este botón abriría WhatsApp con un mensaje listo: casa, fechas y número de huéspedes.');
});

/* Primera URL que carga de una fotografía (local → Unsplash) */
const urlsOf = (slot) => [...photo(slot).matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => m[2]);
function firstUrl(slot) {
  const urls = urlsOf(slot);
  return new Promise((res) => {
    const tryUrl = (k) => { if (k >= urls.length) return res(null); const im = new Image(); im.onload = () => res(urls[k]); im.onerror = () => tryUrl(k + 1); im.src = urls[k]; };
    tryUrl(0);
  });
}

/* ───────────── Hero: el agua responde al tacto ───────────── */
firstUrl('hero').then((url) => initRipple({ box: $('[data-hero-ph]'), area: $('.hero'), canvas: $('[data-ripple]'), url, horizon: 0.5, reduced }));
if (!reduced) addEventListener('scroll', () => {
  const y = scrollY; if (y > innerHeight * 1.2) return;
  $('[data-hero-ph]').style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(${1 + y / 9000})`;
  $('.hero__top').style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
}, { passive: true });

/* ───────────── Ocupación simulada (estable durante el día) ───────────── */
const TODAY = (() => { const p = santiagoParts(); return Date.UTC(p.y, p.m, p.d); })();
const DAYS = 28;
const dayDate = (i) => new Date(TODAY + i * 864e5);
const fmt = (i, o) => new Intl.DateTimeFormat('es-CL', { timeZone: 'UTC', ...o }).format(dayDate(i)).replace(/\./g, '').replace(/,/g, '');
const BUSY = Object.fromEntries(CABINS.map((c) => {
  let s = Math.floor(hash(c.id + TODAY) * 2 ** 31) || 1;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const set = new Set();
  for (let d = Math.floor(rnd() * 3) - 1; d < DAYS + 14;) {
    const len = 2 + Math.floor(rnd() * 3);
    for (let k = 0; k < len; k++) if (d + k >= 0) set.add(d + k);
    d += len + 2 + Math.floor(rnd() * 4);
  }
  // Una noche suelta entre dos estadías no se puede vender: se marca como tomada
  if (!set.has(0) && set.has(1)) set.add(0);
  return [c.id, set];
}));
const minNights = (i) => ([0, 1].includes(dayDate(i).getUTCMonth()) ? 4 : 2);

/* ───────────── Carta del predio ───────────── */
ensureHatch();
(function chart() {
  const svg = $('[data-site]'), wrap = $('[data-site-wrap]'), card = $('[data-site-card]');
  drawChart(svg, CABINS);
  const list = $('[data-site-list]');
  list.innerHTML = CABINS.map((c) => `<li><button type="button" data-sl="${c.id}"><i>${c.no}</i><b>${c.n}</b><span>${c.paxTxt} pers · ${c.m2} m² · ${c.agua} m al agua</span><em>${clp(c.price)}</em></button></li>`).join('');
  const toSvg = (x, y) => { const r = svg.getBoundingClientRect(), wr = wrap.getBoundingClientRect(); return [r.left - wr.left + (x / 1200) * r.width + wrap.scrollLeft, r.top - wr.top + (y / 640) * r.height]; };
  const show = (kind, id) => {
    let x, y, ph, txt;
    if (kind === 'h') {
      const c = byId[id]; x = SPOTS[id].x; y = SPOTS[id].y; ph = c.slot;
      txt = `<b>${c.no} · ${c.n}</b>${c.paxTxt} personas · ${c.m2} m² · a ${c.agua} m del agua<br><small>Toque para abrir la ficha</small>`;
    } else { const p = POIS.find((q) => q.id === id); x = p.x; y = p.y; ph = p.ph; txt = `<b>${p.n}</b>${p.d}`; }
    $$('[data-house]', svg).forEach((g) => g.classList.toggle('is-on', kind === 'h' && g.dataset.house === id));
    $$('[data-sl]', list).forEach((b) => b.classList.toggle('is-on', kind === 'h' && b.dataset.sl === id));
    $('[data-site-ph]').setAttribute('style', photo(ph));
    $('[data-site-txt]').innerHTML = txt;
    const [px, py] = toSvg(x, y);
    const left = px > wrap.clientWidth * 0.6 + wrap.scrollLeft;
    card.style.left = `${px}px`; card.style.top = `${py}px`;
    card.classList.toggle('is-left', left); card.classList.toggle('is-low', y < 200);
    card.classList.add('is-on');
  };
  const hide = () => { card.classList.remove('is-on'); $$('.is-on', svg).forEach((g) => g.classList.remove('is-on')); $$('[data-sl]', list).forEach((b) => b.classList.remove('is-on')); };
  svg.addEventListener('pointerover', (e) => {
    const h = e.target.closest('[data-house]'), p = e.target.closest('[data-poi]');
    if (h) show('h', h.dataset.house); else if (p) show('p', p.dataset.poi);
  });
  svg.addEventListener('pointerleave', hide);
  svg.addEventListener('focusin', (e) => { const h = e.target.closest('[data-house]'), p = e.target.closest('[data-poi]'); if (h) show('h', h.dataset.house); else if (p) show('p', p.dataset.poi); });
  svg.addEventListener('click', (e) => { const h = e.target.closest('[data-house]'); if (h) openDossier(h.dataset.house); else { const p = e.target.closest('[data-poi]'); if (p) show('p', p.dataset.poi); } });
  svg.addEventListener('keydown', (e) => { const h = e.target.closest('[data-house]'); if (h && e.key === 'Enter') openDossier(h.dataset.house); });
  list.addEventListener('pointerover', (e) => { const b = e.target.closest('[data-sl]'); if (b) show('h', b.dataset.sl); });
  list.addEventListener('pointerleave', hide);
  list.addEventListener('click', (e) => { const b = e.target.closest('[data-sl]'); if (b) openDossier(b.dataset.sl); });
  // Ondas en el agua de la carta
  if (!reduced) {
    let last = 0;
    const ring = (x, y, big) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', big ? 4 : 2); c.setAttribute('class', `ch-ring${big ? ' is-big' : ''}`);
      svg.append(c); setTimeout(() => c.remove(), 2400);
    };
    svg.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 1200, y = ((e.clientY - r.top) / r.height) * 640;
      if (y < shore(x) + 6) return;
      const now = performance.now(); if (now - last < 140) return; last = now; ring(x.toFixed(1), y.toFixed(1));
    });
    svg.addEventListener('pointerdown', (e) => {
      const r = svg.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 1200, y = ((e.clientY - r.top) / r.height) * 640;
      if (y > shore(x) + 6) { ring(x.toFixed(1), y.toFixed(1), true); setTimeout(() => ring(x.toFixed(1), y.toFixed(1), true), 260); }
    });
  }
  // En pantallas angostas la carta se recorre de lado: empieza centrada en el muelle
  requestAnimationFrame(() => { if (wrap.scrollWidth > wrap.clientWidth) wrap.scrollLeft = (wrap.scrollWidth - wrap.clientWidth) * 0.3; });
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { svg.classList.add('is-drawn'); o.disconnect(); } }, { threshold: 0.2 }).observe(svg);
})();

/* ───────────── Las casas: del dibujo a la fotografía ───────────── */
const grid = $('[data-houses]');
grid.innerHTML = CABINS.map((c) => houseRow(c, photo(c.slot), planSVG(c, { labels: false }))).join('');
CABINS.forEach((c) => {
  let i = 0; while (BUSY[c.id].has(i) && i < DAYS) i++;
  $(`[data-free="${c.id}"]`).textContent = i === 0 ? 'Libre esta noche' : `Libre desde el ${fmt(i, { weekday: 'short', day: 'numeric' })}`;
});
grid.addEventListener('click', (e) => { const c = e.target.closest('.house'); if (c) openDossier(c.dataset.id); });
grid.addEventListener('keydown', (e) => { const c = e.target.closest('.house'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openDossier(c.dataset.id); } });
const built = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-built'); built.unobserve(e.target); } }), { rootMargin: '0px 0px -25% 0px' });
$$('.house', grid).forEach((h) => built.observe(h));
document.addEventListener('click', (e) => { const a = e.target.closest('[data-open]'); if (a) { e.preventDefault(); openDossier(a.dataset.open); } });

// Filtros
const filters = $('[data-filters]');
$$('button', filters).forEach((b) => {
  const f = b.dataset.f;
  if (f !== 'todas') b.insertAdjacentHTML('beforeend', ` <sup>${CABINS.filter((c) => c.tags.includes(f)).length}</sup>`);
});
filters.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  $$('button', filters).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  const f = b.dataset.f;
  $$('.house', grid).forEach((el) => {
    const on = f === 'todas' || byId[el.dataset.id].tags.includes(f);
    el.classList.toggle('is-off', !on);
    el.setAttribute('tabindex', on ? '0' : '-1');
  });
});

/* ───────────── Ficha de la casa ───────────── */
const dossier = $('[data-dossier]'), panel = $('[data-dossier-panel]');
let current = null, lastFocus = null;
function openDossier(id) {
  const c = byId[id], i = CABINS.indexOf(c);
  current = id;
  const strip = Array.from({ length: 14 }, (_, d) => `<span class="${BUSY[id].has(d) ? 'busy' : ''}" title="${BUSY[id].has(d) ? 'Ocupada' : 'Libre'}">${fmt(d, { weekday: 'narrow' })}<b>${dayDate(d).getUTCDate()}</b></span>`).join('');
  const free = 14 - Array.from({ length: 14 }, (_, d) => BUSY[id].has(d)).filter(Boolean).length;
  panel.innerHTML = `
    <div class="ds__top"><span class="label">Casa ${c.no} / 06</span><div class="ds__nav"><button type="button" data-ds-go="-1">← Anterior</button><button type="button" data-ds-go="1">Siguiente →</button><button type="button" data-close>Cerrar ✕</button></div></div>
    <div class="ds__hero" style="${photo(c.slot)}"></div>
    <div class="ds__body">
      <div class="ds__col">
        <p class="label">${c.tags.map((t) => ({ primera: 'Primera línea', familia: 'Familias', dos: 'Para dos', tinaja: 'Con tinaja', mascotas: 'Mascotas' })[t]).join(' · ')}</p>
        <h2>${c.n}</h2>
        <p class="lead">${c.lead}</p>
        <dl class="spec">
          <div><dt>Personas</dt><dd>${c.paxTxt}</dd></div><div><dt>Dormitorios</dt><dd>${c.dormTxt}</dd></div>
          <div><dt>Baños</dt><dd>${c.banos}</dd></div><div><dt>Superficie</dt><dd>${c.m2} m²</dd></div>
          <div><dt>Al agua</dt><dd>${c.agua} m</dd></div><div><dt>Noches mínimas</dt><dd>2 · 4 en verano</dd></div>
        </dl>
        <ul class="ds__feats">${c.feats.map((f) => `<li>${f}</li>`).join('')}</ul>
        <p class="label ds__sl"><span>Próximas dos semanas</span><span>${free} noches libres</span></p>
        <div class="ds__strip">${strip}</div>
        <div class="ds__cta"><div><b>${clp(c.price)}</b><small>por noche · hasta ${c.pax} personas</small></div><button type="button" class="btn" data-ds-book>Elegir fechas <span aria-hidden="true">↘</span></button></div>
      </div>
      <div class="ds__col">
        <div class="ds__plan"><p class="label"><span>Plano · ${c.m2} m² interiores</span><span>Toque un espacio</span></p>${planSVG(c)}<p class="ds__room" data-ds-room><b>${c.rooms[0].n}.</b> ${c.rooms[0].d}</p></div>
        <div class="ds__photos">${c.photos.map((p, k) => `<span role="button" tabindex="0" aria-label="Ver fotografía ${k + 1}" data-ds-ph="${k}" style="${photo(p)}"></span>`).join('')}</div>
      </div>
    </div>`;
  // Plano interactivo
  const all = [...c.rooms.map((r, k) => ['r' + k, r]), ...c.ext.map((r, k) => ['e' + k, r])];
  const showRoom = (key) => {
    const sp = all.find(([k]) => k === key)?.[1]; if (!sp) return;
    $$('.sp rect', panel).forEach((r) => r.classList.toggle('is-on', r.parentNode.dataset.sp === key));
    const box = $('[data-ds-room]', panel); box.innerHTML = `<b>${sp.n}.</b> ${sp.d}`;
    box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap');
  };
  $$('.sp', panel).forEach((g) => {
    g.addEventListener('mouseenter', () => showRoom(g.dataset.sp));
    g.addEventListener('click', () => showRoom(g.dataset.sp));
    g.addEventListener('focusin', () => showRoom(g.dataset.sp));
  });
  showRoom('r0');
  $$('[data-ds-ph]', panel).forEach((s) => {
    const open = () => openViewer(c.photos.map((p) => [p, `Casa ${c.n}`]), +s.dataset.dsPh);
    s.addEventListener('click', open); s.addEventListener('keydown', (e) => e.key === 'Enter' && open());
  });
  $$('[data-ds-go]', panel).forEach((b) => b.addEventListener('click', () => {
    const n = CABINS[(i + +b.dataset.dsGo + CABINS.length) % CABINS.length];
    panel.classList.add('is-turn'); setTimeout(() => { openDossier(n.id); panel.scrollTop = 0; panel.classList.remove('is-turn'); }, 220);
  }));
  $('[data-ds-book]', panel).addEventListener('click', () => { closeDossier(); setTimeout(() => bookCabin(id), 350); });
  if (!dossier.classList.contains('is-open')) {
    lastFocus = document.activeElement;
    dossier.classList.add('is-open'); dossier.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    panel.scrollTop = 0;
    setTimeout(() => panel.focus(), 60);
  }
}
function closeDossier() {
  dossier.classList.remove('is-open'); dossier.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  current = null; lastFocus?.focus?.({ preventScroll: true });
}
dossier.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeDossier(); });

/* ───────────── Visor de fotografías ───────────── */
const viewer = $('[data-viewer]');
let vList = [], vI = 0;
function showV() {
  const [slot, cap] = vList[vI], img = $('[data-viewer-img]');
  // Solo la primera fotografía que cargue (sin el degradado de respaldo), completa y sin recorte
  const urls = [...photo(slot).matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => m[2]);
  const tryUrl = (k) => {
    if (k >= urls.length) return;
    const im = new Image();
    im.onload = () => { if (vList[vI][0] === slot) img.style.backgroundImage = `url("${urls[k]}")`; };
    im.onerror = () => tryUrl(k + 1);
    im.src = urls[k];
  };
  img.style.backgroundImage = 'none'; tryUrl(0);
  $('[data-viewer-cap]').textContent = `${pad(vI + 1)} / ${pad(vList.length)} · ${cap}`;
}
function openViewer(list, i) { vList = list; vI = i; showV(); viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden', 'false'); }
const closeViewer = () => { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden', 'true'); };
$('[data-viewer-close]').addEventListener('click', closeViewer);
viewer.addEventListener('click', (e) => {
  if (e.target === viewer) return closeViewer();
  if (e.target.closest('[data-viewer-img]')) { const r = e.target.getBoundingClientRect(); vI = (vI + (e.clientX < r.left + r.width / 2 ? -1 : 1) + vList.length) % vList.length; showV(); }
});
addEventListener('keydown', (e) => {
  if (viewer.classList.contains('is-open')) {
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { vI = (vI + (e.key === 'ArrowRight' ? 1 : -1) + vList.length) % vList.length; showV(); }
    return;
  }
  if (e.key === 'Escape' && dossier.classList.contains('is-open')) closeDossier();
  if (e.key === 'Escape' && sheet.classList.contains('is-open')) setMenu(false);
});

/* ───────────── Comparar ───────────── */
const ROWS = [
  ['Personas', (c) => c.pax, (c) => c.paxTxt, 1],
  ['Superficie', (c) => c.m2, (c) => `${c.m2} m²`, 1],
  ['Al agua', (c) => c.agua, (c) => `${c.agua} m`, -1],
  ['Dormitorios', (c) => c.dorm + (c.dormTxt.includes('altillo') ? 0.5 : 0), (c) => c.dormTxt, 1],
  ['Baños', (c) => c.banos, (c) => c.banos, 1],
  ['m² por persona', (c) => c.m2 / c.pax, (c) => `${Math.round(c.m2 / c.pax)} m²`, 1],
  ['Por noche', (c) => c.price, (c) => clp(c.price), -1],
  ['Por persona', (c) => c.price / c.pax, (c) => clp(c.price / c.pax), -1],
];
(function compare() {
  const A = $('[data-cmp-a]'), B = $('[data-cmp-b]'), rows = $('[data-cmp-rows]');
  const opts = CABINS.map((c) => `<option value="${c.id}">${c.n}</option>`).join('');
  A.innerHTML = opts; B.innerHTML = opts; A.value = 'muelle'; B.value = 'mirador';
  rows.innerHTML = ROWS.map(([n]) => `<div class="cmp__row"><div class="cmp__side cmp__side--a"><b>—</b><div class="cmp__bar"><i></i></div></div><span>${n}</span><div class="cmp__side cmp__side--b"><b>—</b><div class="cmp__bar"><i></i></div></div></div>`).join('')
    + `<div class="cmp__foot"><button type="button" class="cmp__swap" data-cmp-swap>⇄ Intercambiar</button><p data-cmp-sum></p><div class="cmp__open"><button type="button" data-cmp-open="a">Ficha A →</button><button type="button" data-cmp-open="b">Ficha B →</button></div></div>`;
  const elev = $('[data-cmp-elev]');
  function render() {
    const a = byId[A.value], b = byId[B.value];
    elev.innerHTML = elevationSVG(a, b);
    let wa = 0, wb = 0;
    $$('.cmp__row', rows).forEach((row, k) => {
      const [, val, txt, dir] = ROWS[k];
      const max = Math.max(...CABINS.map(val)), min = Math.min(...CABINS.map(val));
      const score = (c) => (dir > 0 ? val(c) / max : (min / val(c)));
      const [sa, sb] = [$('.cmp__side--a', row), $('.cmp__side--b', row)];
      $('b', sa).textContent = txt(a); $('b', sb).textContent = txt(b);
      $('i', sa).style.width = `${score(a) * 100}%`; $('i', sb).style.width = `${score(b) * 100}%`;
      const d = (val(a) - val(b)) * dir;
      sa.classList.toggle('win', d > 0); sb.classList.toggle('win', d < 0);
      if (d > 0) wa++; if (d < 0) wb++;
    });
    $('[data-cmp-sum]').textContent = a === b ? 'Elija dos casas distintas.' : `${wa > wb ? a.n : wb > wa ? b.n : 'Empate'}${wa !== wb ? ` gana en ${Math.max(wa, wb)} de ${ROWS.length}` : ` · ${wa} a ${wb}`}. ${a.agua < b.agua ? a.n : b.n} está más cerca del agua.`;
  }
  A.addEventListener('change', render); B.addEventListener('change', render);
  $('[data-cmp-swap]').addEventListener('click', () => { [A.value, B.value] = [B.value, A.value]; render(); });
  $$('[data-cmp-open]').forEach((b) => b.addEventListener('click', () => openDossier((b.dataset.cmpOpen === 'a' ? A : B).value)));
  render();
})();

/* ───────────── Disponibilidad: matriz de 6 casas × 28 noches ───────────── */
const mx = $('[data-matrix]');
const sel = { id: null, a: null, b: null };
(function matrix() {
  const months = [...new Set(Array.from({ length: DAYS }, (_, i) => fmt(i, { month: 'long' })))];
  // Filas con display: contents: la grilla CSS no cambia y los lectores de pantalla leen casa por casa
  let html = `<div class="mx"><div class="mx__row" role="row"><div class="mx__h month" role="columnheader">${months.join(' · ')}</div>`;
  for (let i = 0; i < DAYS; i++) {
    const wd = dayDate(i).getUTCDay(), we = wd === 5 || wd === 6;
    html += `<div class="mx__h ${we ? 'we' : ''} ${i === 0 ? 'is-today' : ''}" role="columnheader">${fmt(i, { weekday: 'narrow' })}<b>${dayDate(i).getUTCDate()}</b></div>`;
  }
  html += '</div>';
  CABINS.forEach((c) => {
    html += `<div class="mx__row" role="row"><div class="mx__name" data-row="${c.id}" role="rowheader">${c.n}<small>${c.paxTxt}p</small></div>`;
    for (let i = 0; i < DAYS; i++) {
      const wd = dayDate(i).getUTCDay(), we = wd === 5 || wd === 6, busy = BUSY[c.id].has(i);
      html += `<div class="mx__c ${we ? 'we' : ''} ${busy ? 'busy' : ''}" data-c="${c.id}" data-d="${i}" role="gridcell" aria-label="${c.n}, ${fmt(i, { weekday: 'long', day: 'numeric', month: 'long' })}: ${busy ? 'ocupada' : 'libre'}"></div>`;
    }
    html += '</div>';
  });
  mx.innerHTML = html + '</div>';
  mx.insertAdjacentHTML('afterend', '<p class="mx__legend"><span><i class="l-free"></i>Libre</span><span><i class="l-busy"></i>Ocupada</span><span><i class="l-sel"></i>Su selección</span><span><i class="l-we"></i>Viernes y sábado</span></p>');

  const cellAt = (x, y) => document.elementFromPoint(x, y)?.closest?.('.mx__c');
  let drag = null, tapStart = null;
  const apply = () => {
    $$('.mx__c.sel, .mx__c.sel-start', mx).forEach((c) => c.classList.remove('sel', 'sel-start'));
    $$('.mx__name', mx).forEach((n) => n.parentNode && n.classList.toggle('on', n.dataset.row === sel.id));
    mx.querySelector('.mx').dataset.row = sel.id || '';
    if (sel.id != null) for (let i = sel.a; i <= sel.b; i++) {
      const cell = $(`.mx__c[data-c="${sel.id}"][data-d="${i}"]`, mx);
      cell.classList.add('sel'); if (i === sel.a) cell.classList.add('sel-start');
    }
    quote();
  };
  // Extiende desde a hacia b sin cruzar noches ocupadas
  const range = (id, a, b) => {
    const step = b >= a ? 1 : -1; let end = a;
    for (let i = a; i !== b + step; i += step) { if (BUSY[id].has(i)) break; end = i; }
    return [Math.min(a, end), Math.max(a, end)];
  };
  mx.addEventListener('pointerdown', (e) => {
    const c = e.target.closest('.mx__c'); if (!c || c.classList.contains('busy')) return;
    const id = c.dataset.c, d = +c.dataset.d;
    if (e.pointerType !== 'mouse') {
      // En pantallas táctiles: un toque marca la llegada y otro la última noche
      if (tapStart && tapStart.id === id && d >= tapStart.d) { [sel.a, sel.b] = range(id, tapStart.d, d); tapStart = null; }
      else { tapStart = { id, d }; sel.id = id; [sel.a, sel.b] = range(id, d, d + minNights(d) - 1); }
      sel.id = id; apply(); return;
    }
    e.preventDefault();
    drag = { id, d }; sel.id = id; sel.a = sel.b = d; apply();
  });
  addEventListener('pointermove', (e) => {
    if (!drag) return;
    const c = cellAt(e.clientX, e.clientY); if (!c || c.dataset.c !== drag.id) return;
    [sel.a, sel.b] = range(drag.id, drag.d, +c.dataset.d); apply();
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    // Un clic simple propone la estadía mínima desde esa noche
    if (sel.a === sel.b) [sel.a, sel.b] = range(drag.id, sel.a, sel.a + minNights(sel.a) - 1);
    drag = null; apply();
  });
  mx.addEventListener('click', (e) => {
    const n = e.target.closest('.mx__name'); if (!n) return;
    openDossier(n.dataset.row);
  });
})();

// Desde la ficha: elige la primera ventana libre de la casa y lleva a la tabla
function bookCabin(id) {
  const need = 2;
  let a = 0;
  for (; a < DAYS - need; a++) if (![...Array(need)].some((_, k) => BUSY[id].has(a + k))) break;
  sel.id = id; sel.a = a; sel.b = a + need - 1;
  $$('.mx__c.sel, .mx__c.sel-start', mx).forEach((c) => c.classList.remove('sel', 'sel-start'));
  for (let i = sel.a; i <= sel.b; i++) $(`.mx__c[data-c="${id}"][data-d="${i}"]`, mx).classList.add('sel');
  $(`.mx__c[data-c="${id}"][data-d="${a}"]`, mx).classList.add('sel-start');
  $$('.mx__name', mx).forEach((n) => n.classList.toggle('on', n.dataset.row === id));
  $('.mx', mx).dataset.row = id;
  quote();
  $('#disponibilidad').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  const cell = $(`.mx__c[data-c="${id}"][data-d="${a}"]`, mx);
  setTimeout(() => mx.scrollTo({ left: Math.max(0, cell.offsetLeft - 200), behavior: 'smooth' }), 500);
}

/* ───────────── Cotización ───────────── */
const guests = $('[data-q-guests]');
function quote() {
  const c = byId[sel.id];
  const warn = $('[data-q-warn]');
  if (!c) return;
  const prev = +guests.value || 2;
  guests.innerHTML = Array.from({ length: c.pax }, (_, i) => `<option ${i + 1 === Math.min(prev, c.pax) ? 'selected' : ''}>${i + 1}</option>`).join('');
  const nights = sel.b - sel.a + 1, g = +guests.value;
  const pet = $('[data-q-extras] input:nth-of-type(1)');
  $$('[data-q-extras] label').forEach((l) => {
    const inp = $('input', l), isPet = /Mascota/.test(l.textContent), isTin = /Tinaja/.test(l.textContent);
    const off = (isPet && !c.tags.includes('mascotas'));
    inp.disabled = off; if (off) inp.checked = false;
    l.classList.toggle('is-off', off);
    l.title = off ? 'Esta casa no recibe mascotas' : isTin && c.tags.includes('tinaja') ? 'Esta casa tiene tinaja privada' : '';
  });
  void pet;
  let x = 0;
  $$('[data-x]').forEach((i) => {
    if (!i.checked) return;
    const v = +i.dataset.x, per = i.dataset.per;
    x += per === 'night' ? v * nights : per === 'guestnight' ? v * g * nights : v;
  });
  const base = c.price * nights, total = base + x + 15000;
  const q = $('[data-quote]');
  $('[data-q-cabin]').textContent = `Casa ${c.n}`;
  $('[data-q-dates]').textContent = `${fmt(sel.a, { weekday: 'short', day: 'numeric', month: 'short' })} → ${fmt(sel.b + 1, { weekday: 'short', day: 'numeric', month: 'short' })}`;
  $('[data-q-nights]').textContent = `${nights} ${nights === 1 ? 'noche' : 'noches'} × ${clp(c.price)}`;
  $('[data-q-base]').textContent = clp(base);
  $('[data-q-x]').textContent = clp(x);
  count($('[data-q-total]'), total);
  const min = minNights(sel.a);
  warn.textContent = nights < min ? `La estadía mínima es de ${min} noches. ${BUSY[c.id].has(sel.b + 1) ? 'La noche siguiente ya está tomada: pruebe otra fecha o casa.' : 'Arrastre una noche más.'}` : '';
  q.classList.toggle('is-set', true);
  q.classList.remove('pulse'); void q.offsetWidth; q.classList.add('pulse');
}
guests.innerHTML = '<option>2</option>';
guests.addEventListener('change', quote);
$('[data-q-extras]').addEventListener('change', quote);
function count(el, to) {
  const from = +(el.dataset.v || 0); el.dataset.v = to;
  if (reduced || !from) { el.textContent = clp(to); return; }
  const t0 = performance.now();
  (function step(now) {
    const k = Math.min(1, (now - t0) / 500), e = 1 - Math.pow(1 - k, 3);
    el.textContent = clp(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* ───────────── Un día en la orilla: recorrido horizontal con el sol ───────────── */
(function day() {
  const sec = daySec, track = $('[data-day-track]'), sun = $('[data-day-sun]'), clock = $('[data-day-clock]');
  const moments = $$('.moment[data-at]', track);
  const ats = moments.map((m) => (m.dataset.at === 'sunset' ? SUN.sunset : +m.dataset.at));
  const wide = matchMedia('(min-width: 861px)');
  const place = (h) => {
    const k = Math.max(0, Math.min(1, (h - SUN.sunrise) / (SUN.sunset - SUN.sunrise)));
    // Sobre la curva cuadrática del arco (20,150)–(500,-40)–(980,150)
    const x = (1 - k) ** 2 * 20 + 2 * (1 - k) * k * 500 + k * k * 980, y = (1 - k) ** 2 * 150 + 2 * (1 - k) * k * -40 + k * k * 150;
    sun.style.left = `${x / 10}%`; sun.style.top = `${(y / 160) * 100}%`;
    clock.textContent = fmtH(h);
  };
  function update() {
    if (!wide.matches) { track.style.transform = ''; sec.style.height = ''; dayHour = null; return; }
    const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
    const k = Math.max(0, Math.min(1, (-r.top / Math.max(1, span) - 0.06) / 0.86));
    const max = track.scrollWidth - innerWidth;
    track.style.transform = `translate3d(${-k * max}px,0,0)`;
    // La hora sigue a la tarjeta que está al centro
    const mid = innerWidth / 2;
    let h = 12.6;
    const cs = moments.map((m) => { const b = m.getBoundingClientRect(); return b.left + b.width / 2; });
    for (let i = 0; i < cs.length; i++) {
      if (cs[i] <= mid) h = ats[i];
      if (cs[i] > mid) { const prev = i ? cs[i - 1] : cs[0] - innerWidth * 0.8, hp = i ? ats[i - 1] : 12.6; h = hp + (ats[i] - hp) * Math.max(0, Math.min(1, (mid - prev) / (cs[i] - prev))); break; }
    }
    dayHour = r.top <= 0 && r.bottom >= innerHeight ? h : null;
    place(h);
    moments.forEach((m, i) => m.classList.toggle('is-now', Math.abs(cs[i] - mid) < innerWidth * 0.3));
  }
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
})();

/* ───────────── Galería: tira arrastrable con inercia ───────────── */
(function film() {
  const box = $('[data-film]'), track = $('[data-film-track]');
  track.innerHTML = FILM.map(([slot, cap, r], i) => `<figure class="shot" data-i="${i}"><span style="${photo(slot)};aspect-ratio:${r}"></span><figcaption><span>${pad(i + 1)}</span><span>${cap}</span></figcaption></figure>`).join('');
  let x = 0, v = 0, down = null, moved = 0, max = 0, raf = 0;
  const measure = () => (max = Math.max(0, track.scrollWidth - box.clientWidth + parseFloat(getComputedStyle(box).paddingLeft) * 2));
  const paint = () => {
    track.style.transform = `translate3d(${-x}px,0,0)`;
    const k = max ? x / max : 0;
    $('[data-film-bar]').style.width = `${10 + k * 90}%`;
    const shots = $$('.shot', track), mid = box.getBoundingClientRect().left + box.clientWidth / 3;
    let cur = 0; shots.forEach((s, i) => { if (s.getBoundingClientRect().left < mid) cur = i; });
    $('[data-film-count]').textContent = `${pad(cur + 1)} / ${pad(FILM.length)}`;
  };
  const glide = () => {
    v *= 0.94; x = Math.max(0, Math.min(max, x + v)); paint();
    raf = Math.abs(v) > 0.2 ? requestAnimationFrame(glide) : 0;
  };
  box.addEventListener('pointerdown', (e) => {
    if (e.button) return;
    measure(); cancelAnimationFrame(raf); down = { px: e.clientX, py: e.clientY, x, t: performance.now(), lx: e.clientX, mode: e.pointerType === 'mouse' ? 'x' : null }; moved = 0; v = 0;
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - down.px, dy = e.clientY - down.py;
    if (!down.mode) { if (Math.abs(dx) + Math.abs(dy) < 6) return; down.mode = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; }
    if (down.mode !== 'x') return;
    box.classList.add('is-drag');
    moved = Math.max(moved, Math.abs(dx));
    x = Math.max(-60, Math.min(max + 60, down.x - dx));
    v = (down.lx - e.clientX); down.lx = e.clientX;
    paint();
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = null; box.classList.remove('is-drag');
    if (x < 0 || x > max) { v = 0; const to = x < 0 ? 0 : max, from = x, t0 = performance.now(); (function back(n) { const k = Math.min(1, (n - t0) / 400); x = from + (to - from) * (1 - Math.pow(1 - k, 3)); paint(); if (k < 1) requestAnimationFrame(back); })(t0); return; }
    raf = requestAnimationFrame(glide);
  });
  box.style.touchAction = 'pan-y';
  track.addEventListener('click', (e) => {
    const s = e.target.closest('.shot'); if (!s || moved > 6) return;
    openViewer(FILM.map(([p, c]) => [p, c]), +s.dataset.i);
  });
  track.addEventListener('dragstart', (e) => e.preventDefault());
  box.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    measure(); e.preventDefault(); v = e.key === 'ArrowRight' ? 28 : -28; cancelAnimationFrame(raf); raf = requestAnimationFrame(glide);
  });
  box.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); measure(); x = Math.max(0, Math.min(max, x + e.deltaX)); paint();
  }, { passive: false });
  addEventListener('resize', () => { measure(); x = Math.min(x, max); paint(); });
  measure(); paint();
})();

/* ───────────── Huéspedes ───────────── */
(function voices() {
  const list = $('[data-v-list]'), q = $('[data-v-q]'), a = $('[data-v-a]');
  list.innerHTML = VOICES.map((v, i) => `<li><button type="button" data-v="${i}"><i>${pad(i + 1)}</i>${v.a.split(' · ')[0]}<em>${'★'.repeat(v.s)}</em></button></li>`).join('');
  let i = 0, timer;
  const show = (k) => {
    i = k;
    q.textContent = `“${VOICES[k].q}”`; a.textContent = VOICES[k].a;
    [q, a].forEach((el) => { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
    $$('button', list).forEach((b, j) => b.setAttribute('aria-current', String(j === k)));
  };
  const auto = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => show((i + 1) % VOICES.length), 8000); };
  list.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { show(+b.dataset.v); clearInterval(timer); } });
  show(0); auto();
})();

/* ───────────── Apariciones ───────────── */
$$('.sh h2, .moment--intro h2').forEach((h) => { h.innerHTML = `<span class="ln"><span>${h.innerHTML}</span></span>`; });
$$('.sh, .mframe, .morning__q, .site, .filters, .cmp, .avail, .film__meta, .voices, .arrive, .end__in, .foot__grid').forEach((el) => el.classList.add('rv'));
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));

// Palabra gigante del pie: se desplaza levemente con el scroll
(function foot() {
  const w = $('.foot__word'); if (reduced || !w) return;
  addEventListener('scroll', () => {
    const r = w.getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) return;
    w.style.transform = `translateX(${(r.top / innerHeight - 0.5) * -6}%)`;
  }, { passive: true });
})();

// Parallax suave del cierre
(function end() {
  const e = $('.end'); if (reduced) return;
  addEventListener('scroll', () => {
    const r = e.getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) return;
    $('.end__ph').style.transform = `translate3d(0, ${(r.top / innerHeight) * -60}px, 0) scale(1.12)`;
  }, { passive: true });
})();

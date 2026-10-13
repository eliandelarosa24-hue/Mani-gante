// Villa Coral Samaná · comportamiento a medida
import './style.css';
import { VILLAS, TRIPS, MENU, CLIMATE, MONTHS, REVIEWS, RATES } from './data.js';
import { initWhales, toggleSong } from './whale.js';
import { toggleMerengue } from './merengue.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Hash FNV-1a con mezcla final: valores bien repartidos incluso entre fechas consecutivas
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967295; };
const byId = Object.fromEntries(VILLAS.map((v) => [v.id, v]));
const TZ = 'America/Santo_Domingo', DAY = 864e5;

/* Fotografías */
const tpl = $('template[data-photos]').content;
const photo = (slot) => tpl.querySelector(`[data-p="${slot}"]`)?.getAttribute('style') || '';
const firstUrl = (slot) => new Promise((res) => {
  const urls = [...photo(slot).matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => m[2]);
  const t = (k) => { if (k >= urls.length) return res(null); const im = new Image(); im.onload = () => res(urls[k]); im.onerror = () => t(k + 1); im.src = urls[k]; };
  t(0);
});

/* Moneda: todo se guarda en dólares y se muestra en la moneda elegida */
let CUR = 'USD';
const money = (usd) => {
  const v = Math.round(usd * RATES[CUR]);
  return (CUR === 'USD' ? 'US$' : CUR === 'EUR' ? '€' : 'RD$') + v.toLocaleString('es-DO');
};
const short = (usd) => { const v = Math.round(usd * RATES[CUR]); return (CUR === 'USD' ? '$' : CUR === 'EUR' ? '€' : 'RD$') + (v >= 10000 ? `${Math.round(v / 1000)}k` : v); };
const paintMoney = () => $$('[data-usd]').forEach((el) => (el.textContent = money(+el.dataset.usd)));

/* Hora y fecha en Samaná */
const parts = (d = new Date()) => Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(d).map((x) => [x.type, +x.value || x.value]));
const NOW = parts();
const TODAY = Date.UTC(NOW.year, NOW.month - 1, NOW.day);
const keyOf = (t) => new Date(t).toISOString().slice(0, 10);
const fmt = (t, o = { day: 'numeric', month: 'long' }) => new Intl.DateTimeFormat('es-DO', { timeZone: 'UTC', ...o }).format(new Date(t)).replace(/\./g, '');
const hhmm = (d) => new Intl.DateTimeFormat('es-DO', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
function sunset({ year: y, month: m, day: d }) {
  const rad = Math.PI / 180, LAT = 19.32, LNG = -69.54;
  const n = Math.round(Date.UTC(y, m - 1, d, 12) / DAY + 2440587.5 - 2451545 + 0.0008), Js = n - LNG / 360;
  const M = (357.5291 + 0.98560028 * Js) % 360, C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad);
  const L = (M + C + 282.9372) % 360, Jt = 2451545 + Js + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.44 * rad));
  const w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(LAT * rad) * Math.sin(dec)) / (Math.cos(LAT * rad) * Math.cos(dec))) / rad;
  return new Date((Jt + w / 360 - 2440587.5) * DAY);
}

/* ───────────── Pantalla de carga: el vuelo llega y se levanta la cortina ───────────── */
(function loader() {
  const min = reduced ? 0 : 1700, t0 = performance.now(), path = $('[data-load-path]'), alt = $('[data-load-alt]');
  (function fly(now) {
    const k = Math.min(1, (now - t0) / Math.max(1, min)), e = 1 - (1 - k) ** 2;
    path.style.strokeDashoffset = String(1 - e);
    alt.textContent = `Altitud ${Math.round(11000 * (1 - e) / 100) * 100 || 0} m`;
    if (k < 1) requestAnimationFrame(fly);
  })(t0);
  const go = () => {
    const wait = Math.max(0, min - (performance.now() - t0));
    setTimeout(() => document.body.classList.add('is-shade'), wait);
    setTimeout(() => document.body.classList.add('is-ready'), wait + (reduced ? 0 : 900));
  };
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
  setTimeout(() => document.body.classList.add('is-shade', 'is-ready'), 7000);
})();
$$('.hero__title > span:first-child').forEach((s, i) => { const w = document.createElement('span'); w.className = 'w'; w.style.transitionDelay = `${0.5 + i * 0.18}s`; while (s.firstChild) w.append(s.firstChild); s.append(w); });
// La frase pintada del hero entra letra por letra, como un letrero que se ilumina
(function paint() {
  const em = $('[data-paint]'); if (!em) return;
  em.setAttribute('aria-label', em.textContent);
  let i = 0;
  // Letras agrupadas por palabra para que nunca se corte una palabra al cambiar de línea
  em.innerHTML = em.textContent.split(' ').map((w) => `<span class="wd" aria-hidden="true">${[...w].map((c) => `<span class="ch" style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ');
})();
// Ornamento caribeño (sol y olas) bajo cada antetítulo de sección
const ORN = '<svg class="orn" viewBox="0 0 150 26" aria-hidden="true"><path class="w1" d="M2 15 q8 -8 16 0 t16 0 t16 0 t8 0"/><path class="w2" d="M100 15 q8 -8 16 0 t16 0 t16 0"/><g class="ray"><path d="M75 1v4M75 21v4M63 13h4M83 13h4M66.5 4.5l3 3M80.5 18.5l3 3M83.5 4.5l-3 3M69.5 18.5l-3 3"/></g><circle cx="75" cy="13" r="5"/></svg>';
$$('.sh .sh__k').forEach((k) => k.insertAdjacentHTML('afterend', ORN));
$$('.sh h2, .whales__copy h2, .chef__tx h2, .end h2').forEach((h) => { h.innerHTML = `<span class="ln"><span>${h.innerHTML}</span></span>`; });

/* ───────────── Ahora en Samaná ───────────── */
(function now() {
  const m = NOW.month - 1, key = keyOf(TODAY);
  const diurnal = -2.4 * Math.cos(((NOW.hour - 3) / 24) * 2 * Math.PI);
  const air = Math.round(CLIMATE.air[m] - 1 + diurnal + (hash('a' + key) - 0.5) * 2);
  const set = sunset(NOW);
  const paint = () => { $('[data-n-time]').textContent = hhmm(new Date()); };
  paint(); setInterval(paint, 30000);
  $('[data-n-air]').textContent = `${air} °C`;
  $('[data-n-water]').textContent = `${CLIMATE.water[m]} °C`;
  $('[data-n-sun]').textContent = hhmm(set);
  const inSeason = CLIMATE.whales[m] > 0.3;
  $('[data-n-whale]').textContent = inSeason ? 'En la bahía hoy' : 'Desde el 15 de enero';
  $('.now__whale').classList.toggle('is-on', inSeason);
  $$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));
})();

/* ───────────── Hero: sombras de palma y destellos del sol en el agua ───────────── */
(function hero() {
  const h = $('[data-hero]'), palms = $('[data-palms]');
  if (!reduced) h.addEventListener('pointermove', (e) => {
    const r = h.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    palms.style.transform = `translate3d(${x * -30}px, ${y * -18}px, 0)`;
  });
  const cv = $('[data-glint]'), c = cv.getContext('2d');
  let W = 0, H = 0; const glints = [];
  const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W; cv.height = H; };
  size(); addEventListener('resize', size);
  if (reduced) return;
  let vis = true; new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(h);
  (function loop(t) {
    requestAnimationFrame(loop); if (!vis) return;
    if (glints.length < 70 && Math.random() < 0.6) glints.push({ x: Math.random() * W, y: H * (0.42 + Math.random() * 0.5), life: 0, max: 30 + Math.random() * 50, s: 0.6 + Math.random() * 1.6 });
    c.clearRect(0, 0, W, H);
    for (let i = glints.length - 1; i >= 0; i--) {
      const g = glints[i]; g.life++;
      const a = Math.sin((g.life / g.max) * Math.PI); if (g.life > g.max) { glints.splice(i, 1); continue; }
      c.fillStyle = `rgba(255,255,240,${a * 0.85})`;
      c.beginPath(); c.ellipse(g.x, g.y, 3.2 * g.s * a + 0.5, 0.8 * g.s, 0, 0, 6.283); c.fill();
      if (g.s > 1.8) { c.fillRect(g.x - 0.5, g.y - 5 * a, 1, 10 * a); }
    }
    void t;
  })(0);
})();

/* Pines sobre las piscinas de la foto aérea (coordenadas en la imagen 16:9) */
(function pins() {
  const box = $('[data-pins]'), hero = $('[data-hero]');
  const SPOTS = [['mango', 0.154, 0.713], ['ambar', 0.328, 0.718], ['coral', 0.504, 0.689], ['larimar', 0.672, 0.698], ['ballena', 0.823, 0.661]];
  box.innerHTML = SPOTS.map(([id], i) => `<button type="button" class="pin" data-pin="${id}" style="--c:${byId[id].color};--i:${i}" aria-label="Villa ${byId[id].n}"><i></i><span>Villa ${byId[id].n}</span></button>`).join('');
  const place = () => {
    const W = hero.clientWidth, H = hero.clientHeight, ia = 16 / 9;
    // La foto ocupa el hero con un 3 % de margen y background-size: cover
    const bw = W * 1.06, bh = H * 1.06, s = Math.max(bw / ia, bh), iw = s * ia, ih = s;
    const ox = (W - iw) / 2, oy = (H - ih) / 2;
    SPOTS.forEach(([id, x, y]) => { const el = $(`[data-pin="${id}"]`, box); el.style.left = `${ox + x * iw}px`; el.style.top = `${oy + y * ih}px`; });
  };
  place(); addEventListener('resize', place);
  box.addEventListener('click', (e) => { const b = e.target.closest('[data-pin]'); if (b) openVilla(b.dataset.pin); });
})();

/* ───────────── Navegación, menú, nota, moneda ───────────── */
const nav = $('.nav');
addEventListener('scroll', () => nav.classList.toggle('is-solid', scrollY > 40), { passive: true });
const menuBtn = $('.nav__menu'), sheet = $('.sheet');
const setMenu = (open) => { sheet.classList.toggle('is-open', open); sheet.setAttribute('aria-hidden', String(!open)); menuBtn.setAttribute('aria-expanded', String(open)); document.documentElement.style.overflow = open ? 'hidden' : ''; };
menuBtn.addEventListener('click', () => setMenu(!sheet.classList.contains('is-open')));
$$('a', sheet).forEach((a) => a.addEventListener('click', () => setMenu(false)));
const note = $('.note'); let noteT;
const toast = (t) => { $('[data-note-text]').textContent = t; note.classList.add('is-in'); clearTimeout(noteT); noteT = setTimeout(() => note.classList.remove('is-in'), 9000); };
$('[data-note-close]').addEventListener('click', () => note.classList.remove('is-in'));
document.addEventListener('click', (e) => { const d = e.target.closest('[data-demo]'); if (!d) return; e.preventDefault(); toast(d.dataset.demo || 'En el sitio real, este botón abriría WhatsApp con el concierge de Villa Coral, en español, inglés o francés.'); });
$('[data-cur]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-c]'); if (!b) return;
  CUR = b.dataset.c; $$('[data-c]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paintMoney(); renderPass(); renderCal(); renderBP();
});

/* ───────────── Las villas: persianas ───────────── */
const SLATS = 14;
$('[data-shutters]').innerHTML = VILLAS.map((v, i) => `
  <button type="button" class="shut" data-v="${v.id}" style="--c:${v.color};--ink:${v.ink};--d:${i * 0.08}s" aria-label="Abrir la villa ${v.n}">
    <span class="shut__win">
      <span class="shut__ph" style="${photo(v.photo)}"></span>
      <span class="shut__slats" aria-hidden="true">${Array.from({ length: SLATS }, (_, k) => `<i style="--k:${k}"></i>`).join('')}</span>
      <span class="shut__knob" aria-hidden="true"></span>
    </span>
    <span class="shut__no">0${i + 1}</span>
    <span class="shut__n">${v.n}</span>
    <span class="shut__why">${v.why}</span>
    <span class="shut__meta">${v.rooms} ${v.rooms === 1 ? 'suite' : 'suites'} · ${v.pax} huéspedes · desde <b data-usd="${v.price}">—</b></span>
  </button>`).join('');
const shutIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-peek', e.isIntersecting)), { threshold: 0.6 });
if (matchMedia('(hover: none)').matches) $$('.shut').forEach((s) => shutIO.observe(s));
$('[data-shutters]').addEventListener('click', (e) => { const b = e.target.closest('.shut'); if (b) openVilla(b.dataset.v); });

/* Villa abierta: las persianas de toda la pantalla se abren */
const vEl = $('[data-villa]'), vPanel = $('[data-villa-panel]');
$('[data-villa-slats]').innerHTML = Array.from({ length: 18 }, (_, k) => `<i style="--k:${k}"></i>`).join('');
let curVilla = null;
function openVilla(id) {
  const v = byId[id], i = VILLAS.indexOf(v); curVilla = id;
  vEl.style.setProperty('--c', v.color); vEl.style.setProperty('--ink', v.ink);
  vPanel.innerHTML = `
    <div class="vp__top"><span>Villa ${String(i + 1).padStart(2, '0')} / 05</span><div><button type="button" data-vgo="-1">← Anterior</button><button type="button" data-vgo="1">Siguiente →</button><button type="button" data-vclose>Cerrar ✕</button></div></div>
    <div class="vp__hero" style="${photo(v.photo)}"><div class="vp__hero-in"><p>Villa</p><h2>${v.n}</h2><p class="vp__why">${v.why}</p></div></div>
    <div class="vp__body">
      <div>
        <p class="vp__lead">${v.lead}</p>
        <dl class="vp__spec">${[['Suites', v.rooms], ['Huéspedes', v.pax], ['Piscina', v.pool], ['Al mar', v.sea], ['Superficie', `${v.m2} m²`]].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
        <ul class="vp__feats">${v.feats.map((f) => `<li>${f}</li>`).join('')}</ul>
        <p class="vp__inc"><b>Incluye siempre:</b> limpieza diaria, concierge en tres idiomas, kayaks, toallas de playa, agua filtrada y generador de respaldo.</p>
      </div>
      <div class="vp__side">
        <div class="vp__thumbs">${[v.photo, 'int-sala', 'int-dormitorio', 'piscina'].map((p, k) => `<button type="button" data-vph="${p}" style="${photo(p)}" aria-label="Ver fotografía ${k + 1}"></button>`).join('')}</div>
        <div class="vp__price"><p>Desde <b data-usd="${v.price}">—</b><small>por noche · hasta ${v.pax} huéspedes</small></p><button type="button" class="btn btn--coral" data-vbook>Reservar la ${v.n}</button></div>
      </div>
    </div>`;
  paintMoney();
  $$('[data-vgo]', vPanel).forEach((b) => b.addEventListener('click', () => openVilla(VILLAS[(i + +b.dataset.vgo + VILLAS.length) % VILLAS.length].id)));
  $('[data-vclose]', vPanel).addEventListener('click', closeVilla);
  $('[data-vbook]', vPanel).addEventListener('click', () => { closeVilla(); pickVilla(id); setTimeout(() => $('#reservar').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }), 400); });
  $$('[data-vph]', vPanel).forEach((b) => b.addEventListener('click', () => openViewer(b.dataset.vph, `Villa ${v.n}`)));
  if (!vEl.classList.contains('is-open')) { vEl.classList.add('is-open'); vEl.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden'; setTimeout(() => vPanel.focus(), 60); }
  vPanel.scrollTop = 0;
}
function closeVilla() { vEl.classList.remove('is-open'); vEl.setAttribute('aria-hidden', 'true'); document.documentElement.style.overflow = ''; }

/* ───────────── Temporada de ballenas ───────────── */
initWhales({ section: $('[data-whales]'), reduced, months: MONTHS, whales: CLIMATE.whales, todayMonth: NOW.month - 1, todayT: TODAY, fmt: (t) => fmt(t) });
(function song() {
  const b = $('[data-song]'); let on = false;
  b.addEventListener('click', () => { on = !on; toggleSong(on); b.setAttribute('aria-pressed', String(on)); $('[data-song-t]').textContent = on ? 'Escuchando la bahía…' : 'Escuchar su canción'; });
})();

/* ───────────── Pasaporte de Samaná ───────────── */
const stamped = new Set();
$('[data-trips]').innerHTML = TRIPS.map((t) => `
  <article class="trip" data-trip="${t.id}" style="--st:${t.stamp}">
    <div class="trip__ph" style="${photo(t.photo)}"></div>
    <div class="trip__tx"><h3>${t.n}</h3><p>${t.d}</p><p class="trip__meta"><span>${t.t}</span><span>${t.when}</span><b ${t.price ? `data-usd="${t.price}"` : ''}>${t.price ? '—' : 'Gratis'}</b></p></div>
    <button type="button" class="trip__btn" aria-pressed="false">Sellar</button>
  </article>`).join('');
$('[data-trips]').addEventListener('click', (e) => {
  const card = e.target.closest('.trip'); if (!card) return;
  if (e.target.closest('.trip__ph')) return openViewer(TRIPS.find((t) => t.id === card.dataset.trip).photo, TRIPS.find((t) => t.id === card.dataset.trip).n);
  const id = card.dataset.trip;
  stamped.has(id) ? stamped.delete(id) : stamped.add(id);
  renderPass(id);
});
$('[data-p-pax]').addEventListener('change', () => renderPass());
function tripsTotal() { return [...stamped].reduce((a, id) => a + TRIPS.find((t) => t.id === id).price, 0) * +$('[data-p-pax]').value; }
function renderPass(fresh) {
  const page = $('[data-stamps]');
  $$('.trip').forEach((c) => { const on = stamped.has(c.dataset.trip); c.classList.toggle('is-on', on); const b = $('.trip__btn', c); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Sellado ✓' : 'Sellar'; });
  page.innerHTML = stamped.size ? [...stamped].map((id) => {
    const t = TRIPS.find((x) => x.id === id), r = (hash(id) - 0.5) * 24, shape = hash(id + 's') > 0.5 ? 'round' : 'rect';
    return `<span class="stamp stamp--${shape} ${id === fresh ? 'is-fresh' : ''}" style="--st:${t.stamp};--r:${r.toFixed(1)}deg"><small>Samaná · RD</small><b>${t.n}</b><small>${fmt(TODAY, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</small></span>`;
  }).join('') : '<p class="passport__empty">Todavía sin sellos.</p>';
  $('[data-p-n]').textContent = `${stamped.size} ${stamped.size === 1 ? 'excursión' : 'excursiones'}`;
  $('[data-p-total]').textContent = stamped.size ? money(tripsTotal()) : '—';
  const x = $('[data-trips-x]'); x.checked = stamped.size > 0;
  $('[data-trips-em]').textContent = stamped.size ? `${stamped.size} · ${money(tripsTotal())}` : 'Ninguna';
  paintMoney(); renderBP();
}

/* Cinta continua */
{ const rb = $('[data-ribbon]'); rb.innerHTML += rb.innerHTML; }

/* ───────────── El chef ───────────── */
$('[data-menu]').innerHTML = MENU.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('');

/* ───────────── Clima mes a mes ───────────── */
(function chart() {
  const el = $('[data-chart]'), read = $('[data-chart-read]'), m0 = NOW.month - 1;
  const Wd = 1200, Hd = 360, pad = 40, cw = (Wd - pad * 2) / 12;
  const yT = (t) => 250 - (t - 24) * 22, maxR = 200;
  const pts = (arr) => arr.map((t, i) => `${pad + cw * i + cw / 2},${yT(t)}`).join(' ');
  let s = `<svg viewBox="0 0 ${Wd} ${Hd}" role="img" aria-label="Temperatura del aire y del agua, lluvia y temporada de ballenas por mes">`;
  CLIMATE.whales.forEach((p, i) => { if (p) s += `<rect class="ch__whale" x="${pad + cw * i}" y="0" width="${cw}" height="26" style="opacity:${0.25 + p * 0.75}"/>`; });
  s += `<text class="ch__wl" x="${pad + 6}" y="18">Ballenas</text>`;
  CLIMATE.rain.forEach((r, i) => { const h = (r / maxR) * 120; s += `<rect class="ch__rain" x="${pad + cw * i + cw * 0.22}" y="${310 - h}" width="${cw * 0.56}" height="${h}" rx="4"/>`; });
  s += `<polyline class="ch__air" points="${pts(CLIMATE.air)}"/><polyline class="ch__water" points="${pts(CLIMATE.water)}"/>`;
  CLIMATE.air.forEach((t, i) => (s += `<circle class="ch__dot ch__dot--air" cx="${pad + cw * i + cw / 2}" cy="${yT(t)}" r="5"/>`));
  CLIMATE.water.forEach((t, i) => (s += `<circle class="ch__dot ch__dot--water" cx="${pad + cw * i + cw / 2}" cy="${yT(t)}" r="5"/>`));
  MONTHS.forEach((m, i) => (s += `<text class="ch__m ${i === m0 ? 'is-now' : ''}" x="${pad + cw * i + cw / 2}" y="340">${m}</text><rect class="ch__hit" data-m="${i}" x="${pad + cw * i}" y="0" width="${cw}" height="${Hd}"/>`));
  s += `<rect class="ch__now" x="${pad + cw * m0}" y="28" width="${cw}" height="290" rx="8"/></svg>`;
  el.innerHTML = s + '<p class="chart__legend"><span class="l-air">Aire</span><span class="l-water">Agua</span><span class="l-rain">Lluvia</span><span class="l-whale">Ballenas</span></p>';
  const show = (i) => {
    const w = CLIMATE.whales[i];
    read.innerHTML = `<b>${MONTHS[i]}</b> · aire ${CLIMATE.air[i]} °C · agua ${CLIMATE.water[i]} °C · ${CLIMATE.rain[i]} mm de lluvia · ${w >= 0.9 ? 'el mejor mes para ver ballenas' : w > 0.3 ? 'temporada de ballenas' : 'sin ballenas, mar en calma'}`;
    $('.ch__now', el).setAttribute('x', pad + cw * i);
  };
  el.addEventListener('pointermove', (e) => { const h = e.target.closest('.ch__hit'); if (h) show(+h.dataset.m); });
  el.addEventListener('pointerleave', () => show(m0));
  show(m0);
})();

/* ───────────── Reservar: calendario y tarjeta de embarque ───────────── */
const B = { v: null, a: null, b: null, month: Date.UTC(NOW.year, NOW.month - 1, 1) };
const busy = (id, t) => hash(`${id}·${keyOf(t)}`) < 0.24;
const season = (t) => { const d = new Date(t), m = d.getUTCMonth(), day = d.getUTCDate(); return (m === 0 && day >= 15) || m === 1 || (m === 2 && day <= 25); };
const nightPrice = (v, t) => Math.round(v.price * (season(t) ? 1.18 : (new Date(t).getUTCMonth() >= 8 && new Date(t).getUTCMonth() <= 10) ? 0.85 : 1));
$('[data-vpick]').innerHTML = VILLAS.map((v) => `<button type="button" role="radio" aria-checked="false" data-pv="${v.id}" style="--c:${v.color}"><i></i>${v.n}</button>`).join('');
$('[data-vpick]').addEventListener('click', (e) => { const b = e.target.closest('[data-pv]'); if (b) pickVilla(b.dataset.pv); });
function pickVilla(id) {
  B.v = id; B.a = B.b = null;
  $$('[data-pv]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.pv === id)));
  const v = byId[id], pax = $('[data-b-pax]');
  pax.innerHTML = Array.from({ length: v.pax }, (_, i) => `<option ${i === 1 ? 'selected' : ''}>${i + 1}</option>`).join('');
  renderCal(); renderBP();
}
function renderCal() {
  const grid = $('[data-cal-grid]'), m0 = new Date(B.month), v = B.v && byId[B.v];
  $('[data-cal-month]').textContent = fmt(B.month, { month: 'long', year: 'numeric' });
  const first = (m0.getUTCDay() + 6) % 7, days = new Date(Date.UTC(m0.getUTCFullYear(), m0.getUTCMonth() + 1, 0)).getUTCDate();
  let html = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => `<span class="cal__wd">${d}</span>`).join('') + '<span></span>'.repeat(first);
  for (let d = 1; d <= days; d++) {
    const t = Date.UTC(m0.getUTCFullYear(), m0.getUTCMonth(), d), past = t < TODAY, full = v && !past && busy(v.id, t);
    const inR = B.a != null && t >= B.a && t <= (B.b ?? B.a);
    html += `<button type="button" class="cal__d ${inR ? 'is-sel' : ''} ${t === B.a || t === B.b ? 'is-end' : ''} ${season(t) ? 'is-whale' : ''}" data-t="${t}" ${past || full || !v ? 'disabled' : ''}><b>${d}</b>${v && !past ? `<small>${full ? 'ocupada' : short(nightPrice(v, t))}</small>` : ''}</button>`;
  }
  grid.innerHTML = html;
  $('[data-cal-prev]').disabled = B.month <= Date.UTC(NOW.year, NOW.month - 1, 1);
  const n = nights();
  $('[data-cal-hint]').innerHTML = !v ? 'Primero elija una villa.' : B.a == null ? 'Elija la noche de llegada. <span class="whale-dot"></span> Temporada de ballenas.' : B.b == null ? 'Ahora, la última noche (mínimo 3).' : n < 3 ? 'La estadía mínima es de 3 noches.' : `${n} noches · salida el ${fmt(B.b + DAY, { weekday: 'long', day: 'numeric', month: 'long' })} a las 11:00.`;
}
const nights = () => (B.a == null || B.b == null ? 0 : (B.b - B.a) / DAY + 1);
$('[data-cal-grid]').addEventListener('click', (e) => {
  const b = e.target.closest('.cal__d'); if (!b || b.disabled) return;
  const t = +b.dataset.t;
  if (B.a == null || B.b != null || t < B.a) { B.a = t; B.b = null; }
  else { let ok = true; for (let x = B.a; x <= t; x += DAY) if (busy(B.v, x)) ok = false; if (ok) B.b = t; else { B.a = t; B.b = null; } }
  renderCal(); renderBP();
});
$('[data-cal-prev]').addEventListener('click', () => { const m = new Date(B.month); B.month = Date.UTC(m.getUTCFullYear(), m.getUTCMonth() - 1, 1); renderCal(); });
$('[data-cal-next]').addEventListener('click', () => { const m = new Date(B.month); B.month = Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1); renderCal(); });
['[data-b-pax]', '[data-b-name]', '[data-extras]'].forEach((s) => $(s).addEventListener('input', renderBP));
function renderBP() {
  const v = B.v && byId[B.v], n = nights() >= 3 ? nights() : 0, pax = +($('[data-b-pax]').value || 2);
  $('[data-bp-to]').textContent = v ? `Villa ${v.n}` : '—';
  $('[data-bp]').style.setProperty('--c', v ? v.color : '#0e7c86');
  $('[data-bp-name]').textContent = ($('[data-b-name]').value.trim() || '—').toUpperCase();
  $('[data-bp-in]').textContent = B.a != null ? fmt(B.a, { day: '2-digit', month: 'short' }).toUpperCase() : '—';
  $('[data-bp-out]').textContent = n ? fmt(B.b + DAY, { day: '2-digit', month: 'short' }).toUpperCase() : '—';
  $('[data-bp-n]').textContent = n || '—';
  $('[data-bp-pax]').textContent = v ? pax : '—';
  $('[data-bp-class]').textContent = B.a != null && season(B.a) ? 'Temporada de ballenas' : 'Temporada de sol';
  const lines = []; let total = 0;
  if (v && n) {
    let base = 0; for (let x = B.a; x <= B.b; x += DAY) base += nightPrice(v, x);
    total += base; lines.push([`${n} noches en la ${v.n}`, base]);
    $$('[data-extras] input:checked').forEach((i) => {
      const per = i.dataset.per, x = +i.dataset.x;
      const amt = per === 'trips' ? tripsTotal() : per === 'guestnight' ? x * pax * n : x;
      if (amt) { total += amt; lines.push([i.parentNode.querySelector('span').textContent, amt]); }
    });
    lines.push(['Limpieza final', 60]); total += 60;
  }
  $('[data-bp-lines]').innerHTML = lines.map(([a, b]) => `<div><dt>${a}</dt><dd>${money(b)}</dd></div>`).join('');
  $('[data-bp-total]').textContent = n ? money(total) : '—';
  const code = v && n ? `VC-${String(Math.floor(hash(`${B.v}${B.a}${B.b}`) * 9000) + 1000)}` : 'VC-0000';
  $('[data-bp-code]').textContent = code;
  // Código de barras a partir del código de reserva
  let bars = '', x = 0, seed = hash(code) * 1e9;
  while (x < 216) { seed = (seed * 16807) % 2147483647; const w = 1 + (seed % 4); bars += `<rect x="${x}" y="0" width="${w}" height="60"/>`; x += w + 1 + ((seed >> 3) % 3); }
  $('[data-bp-bar]').innerHTML = bars;
  $('[data-bp]').classList.toggle('is-ready', !!(v && n));
}
pickVilla('larimar');

/* ───────────── Reseñas ───────────── */
(function reviews() {
  const q = $('[data-r-q]'), a = $('[data-r-a]'), dots = $('[data-r-dots]'); let i = 0, timer;
  dots.innerHTML = REVIEWS.map((r, k) => `<button type="button" role="tab" aria-selected="false" data-r="${k}" aria-label="Reseña ${k + 1}">${r.flag}</button>`).join('');
  const show = (k) => {
    i = k; q.textContent = `“${REVIEWS[k].q}”`; a.textContent = `${REVIEWS[k].a} · ${REVIEWS[k].from} · Villa ${REVIEWS[k].v}`;
    [q, a].forEach((el) => { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
    $$('[data-r]', dots).forEach((b, j) => b.setAttribute('aria-selected', String(j === k)));
  };
  dots.addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (b) { show(+b.dataset.r); clearInterval(timer); } });
  show(0); if (!reduced) timer = setInterval(() => show((i + 1) % REVIEWS.length), 7000);
})();

/* ───────────── Visor ───────────── */
const viewer = $('[data-viewer]');
function openViewer(slot, cap) {
  const img = $('[data-viewer-img]'); img.style.backgroundImage = 'none';
  firstUrl(slot).then((u) => u && (img.style.backgroundImage = `url("${u}")`));
  $('[data-viewer-cap]').textContent = cap; viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden', 'false');
}
const closeViewer = () => { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden', 'true'); };
$('[data-viewer-close]').addEventListener('click', closeViewer);
viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target.closest('[data-viewer-img]')) closeViewer(); });
$('[data-mosaic]').addEventListener('click', (e) => { const f = e.target.closest('figure'); if (f) openViewer(f.dataset.ph, f.querySelector('figcaption').textContent); });
$('.chef__ph').addEventListener('click', () => openViewer('chef', 'Pescado con coco'));
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (viewer.classList.contains('is-open')) return closeViewer();
  if (vEl.classList.contains('is-open')) return closeVilla();
  setMenu(false);
});

/* ───────────── Gotas de agua al tocar cualquier botón ───────────── */
document.addEventListener('pointerdown', (e) => {
  if (reduced || !e.target.closest('.btn, .nav__cta, .trip__btn, .vpick button, .song, .wa, .pin, .cur button')) return;
  const sp = document.createElement('span'); sp.className = 'splash'; sp.style.left = `${e.clientX}px`; sp.style.top = `${e.clientY}px`;
  let h = '<b></b><b></b>';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + Math.random() * 0.5, d = 34 + Math.random() * 30;
    h += `<i style="--s:${(7 + Math.random() * 7).toFixed(1)}px;--x:${(Math.cos(a) * d).toFixed(1)}px;--y:${(Math.sin(a) * d + 18).toFixed(1)}px;--a:${((a * 180) / Math.PI + 135).toFixed(0)}deg"></i>`;
  }
  sp.innerHTML = h; document.body.append(sp); setTimeout(() => sp.remove(), 900);
});

/* ───────────── Merengue: la página baila al ritmo de la tambora ───────────── */
(function merengue() {
  const b = $('[data-merengue]'); if (!b) return; let on = false;
  const beat = () => { if (reduced) return; document.documentElement.classList.add('beat'); setTimeout(() => document.documentElement.classList.remove('beat'), 120); };
  b.addEventListener('click', () => {
    on = !on; toggleMerengue(on, beat);
    b.setAttribute('aria-pressed', String(on)); document.body.classList.toggle('is-merengue', on);
    $('[data-merengue-t]').textContent = on ? '¡Eso es! Quitar' : 'Ponle merengue';
  });
})();

/* ───────────── Apariciones y parallax ───────────── */
paintMoney();
$$('.sh, .shut, .trip, .rdc, .passport, .chef__ph, .chef__tx, .mosaic figure, .chart, .book__form, .bp, .reviews > *, .arrive__grid > *, .end__in, .foot__grid').forEach((el) => el.classList.add('rv'));
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv, .ln').forEach((el) => io.observe(el));
if (!reduced) addEventListener('scroll', () => {
  const e = $('.end__ph'), r = e.getBoundingClientRect();
  if (r.bottom > 0 && r.top < innerHeight) e.style.transform = `translate3d(0, ${(r.top / innerHeight) * -60}px, 0) scale(1.12)`;
}, { passive: true });

// Casa Nogal · comportamiento a medida
import '../panels.js';
import './style.css';
import { CATS, ROOMS, LEDGER, MENU, POSTCARDS, RAIN, TEMP, MONTHS, RITUALS, GUESTBOOK } from './data.js';
import { initGlass } from './rain.js';
import { drawSection, SPACES } from './house.js';
import { initKeys } from './keys.js';
import { initPostcards } from './postcards.js';
import { initAlbum } from './album.js';
import { toggleSound } from './sound.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
// Hash FNV-1a con mezcla final: valores bien repartidos incluso entre fechas consecutivas
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967295; };
const pad = (n) => String(n).padStart(2, '0');
const byNo = Object.fromEntries(ROOMS.map((r) => [r.no, r]));
const TZ = 'America/Santiago';

/* Fotografías: estilo de la plantilla (local → Unsplash → degradado) */
const tpl = $('template[data-photos]').content;
const photo = (slot) => tpl.querySelector(`[data-p="${slot}"]`)?.getAttribute('style') || '';
const urlsOf = (slot) => [...photo(slot).matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => m[2]);
const firstUrl = (slot) => new Promise((res) => {
  const urls = urlsOf(slot);
  const t = (k) => { if (k >= urls.length) return res(null); const im = new Image(); im.onload = () => res(urls[k]); im.onerror = () => t(k + 1); im.src = urls[k]; };
  t(0);
});

/* Fechas en hora de Chile, como días UTC para no depender del huso del visitante */
const parts = (d = new Date()) => Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(d).map((x) => [x.type, +x.value || x.value]));
const NOW = parts();
const TODAY = Date.UTC(NOW.year, NOW.month - 1, NOW.day);
const DAY = 864e5;
const keyOf = (t) => new Date(t).toISOString().slice(0, 10);
const fmt = (t, o) => new Intl.DateTimeFormat('es-CL', { timeZone: 'UTC', ...o }).format(new Date(t)).replace(/\./g, '').replace(/,/g, '');
// Ocupación simulada y estable: la misma en el corte, el tablero y el calendario
const busy = (no, t) => hash(`${no}·${keyOf(t)}`) < 0.3 + (new Date(t).getUTCDay() >= 5 ? 0.18 : 0);

/* ───────────── Pantalla de carga: de 1910 a hoy, y la puerta se abre ───────────── */
const minTime = reduced ? 0 : 2600, t0 = performance.now(), Y1 = new Date().getFullYear();
(function years(now) {
  if (document.body.classList.contains('is-ready')) return;
  const k = Math.min(1, (now - t0) / Math.max(1, minTime)), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
  $('[data-load-year]').textContent = Math.round(1910 + (Y1 - 1910) * e);
  requestAnimationFrame(years);
})(t0);
const ready = () => setTimeout(() => document.body.classList.add('is-ready'), Math.max(0, minTime - (performance.now() - t0)));
if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
setTimeout(() => document.body.classList.add('is-ready'), 6500);

/* ───────────── Títulos por líneas ───────────── */
$$('.hero__title > span').forEach((s, i) => { const w = document.createElement('span'); w.className = 'w'; w.style.transitionDelay = `${0.9 + i * 0.16}s`; while (s.firstChild) w.append(s.firstChild); s.append(w); });
$$('h2.big').forEach((h) => { h.innerHTML = `<span class="ln"><span>${h.innerHTML}</span></span>`; });

/* ───────────── El tiempo en Valdivia (simulado de forma estable para el día) ───────────── */
const WX = (() => {
  const m = NOW.month - 1, key = keyOf(TODAY);
  const wet = hash('lluvia' + key) < Math.min(0.85, RAIN[m] / 330 + 0.12);
  const hard = wet && hash('fuerte' + key) < 0.4;
  const diurnal = -3.2 * Math.cos(((NOW.hour - 4) / 24) * 2 * Math.PI);
  const temp = Math.round(TEMP[m] + (hash('t' + key) - 0.5) * 4 + diurnal);
  const mm = wet ? Math.round(2 + hash('mm' + key) * (hard ? 26 : 8)) : 0;
  const sky = wet ? (hard ? `Lluvia · ${mm} mm` : `Llovizna · ${mm} mm`) : hash('nub' + key) < 0.55 ? 'Nublado' : 'Despejado';
  const river = (1.4 + RAIN[m] / 260 + hash('rio' + key) * 0.4).toFixed(1).replace('.', ',');
  return { wet, temp, sky, river, short: wet ? (hard ? 'lluvia' : 'llovizna') : sky.toLowerCase() };
})();
const hhmm = new Intl.DateTimeFormat('es-CL', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const paintWx = () => {
  $('[data-wx-now]').textContent = `${hhmm.format(new Date())} · ${WX.temp} °C`;
  $('[data-wx-sky]').textContent = WX.sky;
  $('[data-wx-river]').textContent = `${WX.river} m · baja tranquilo`;
  $('[data-wx-chip]').innerHTML = `<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M6 1 C6 1 1 7 1 10 a5 5 0 0 0 10 0 C11 7 6 1 6 1 Z"/></svg>Valdivia ${WX.temp}° · ${WX.short}`;
};
paintWx(); setInterval(paintWx, 30000);
$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

/* ───────────── Hero: vidrio con lluvia ───────────── */
firstUrl('hero').then((url) => initGlass({ box: $('[data-hero]'), fogCv: $('[data-fog]'), dropCv: $('[data-drops]'), url, reduced, intro: true }));
firstUrl('rio').then((url) => initGlass({ box: $('[data-end]'), fogCv: null, dropCv: $('[data-end-drops]'), url, reduced, wipe: false }));
$('[data-hero]').addEventListener('pointermove', () => $('[data-hint]').classList.add('is-gone'), { once: true });
if (!reduced) addEventListener('scroll', () => {
  const y = scrollY; if (y > innerHeight * 1.3) return;
  $('.hero__ph').style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(${1.04 + y / 8000})`;
  $('.hero__in').style.transform = `translate3d(0, ${y * 0.1}px, 0)`;
}, { passive: true });

/* ───────────── Navegación, menú y nota ───────────── */
const nav = $('.nav');
const onScroll = () => nav.classList.toggle('is-solid', scrollY > 60);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const menuBtn = $('.nav__menu'), sheet = $('.sheet');
const setMenu = (open) => { sheet.classList.toggle('is-open', open); sheet.setAttribute('aria-hidden', String(!open)); menuBtn.setAttribute('aria-expanded', String(open)); document.documentElement.style.overflow = open ? 'hidden' : ''; };
menuBtn.addEventListener('click', () => setMenu(!sheet.classList.contains('is-open')));
$$('a', sheet).forEach((a) => a.addEventListener('click', () => setMenu(false)));
const note = $('.note'); let noteT;
const toast = (t) => { $('[data-note-text]').textContent = t; note.classList.add('is-in'); clearTimeout(noteT); noteT = setTimeout(() => note.classList.remove('is-in'), 9000); };
$('[data-note-close]').addEventListener('click', () => note.classList.remove('is-in'));
document.addEventListener('click', (e) => {
  const d = e.target.closest('[data-demo]'); if (!d) return;
  e.preventDefault();
  toast(d.dataset.demo || 'En el sitio real, este botón abriría WhatsApp con la recepción de Casa Nogal, atendida las 24 horas.');
});

/* ───────────── I · 1910 / hoy ───────────── */
(function then() {
  const range = $('[data-then-range]'), old = $('[data-then-old]'), bar = $('[data-then-bar]'), fig = $('[data-then]');
  const set = (v) => { old.style.clipPath = `inset(0 ${100 - v}% 0 0)`; bar.style.left = `${v}%`; };
  range.addEventListener('input', () => set(+range.value));
  set(+range.value);
  // Al aparecer, la cortina hace un pequeño recorrido para invitar a arrastrar
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting || reduced) return; o.disconnect();
    const t0 = performance.now();
    (function sweep(n) { const k = Math.min(1, (n - t0) / 1800); const v = 52 + Math.sin(k * Math.PI * 2) * 22 * (1 - k); set(v); range.value = v; if (k < 1) requestAnimationFrame(sweep); })(t0);
  }, { threshold: 0.5 }).observe(fig);
})();

/* ───────────── I · Libro de registro: se escribe a máquina ───────────── */
(function ledger() {
  const list = $('[data-ledger-list]');
  list.innerHTML = LEDGER.map((l) => `<li><time>${l.d}</time><p data-type="${l.t.replace(/"/g, '&quot;')}">${reduced ? l.t : ''}</p></li>`).join('');
  new IntersectionObserver(async ([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    if (reduced) return;
    for (const p of $$('[data-type]', list)) {
      p.parentNode.classList.add('is-on');
      const txt = p.dataset.type; p.classList.add('is-typing');
      for (let i = 0; i <= txt.length; i += 2) { p.textContent = txt.slice(0, i); await new Promise((r) => setTimeout(r, 12)); }
      p.textContent = txt; p.classList.remove('is-typing');
    }
  }, { threshold: 0.3 }).observe(list);
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    $$('[data-count]').forEach((el) => {
      const to = +el.dataset.count, t0 = performance.now();
      (function c(n) { const k = Math.min(1, (n - t0) / 1600); el.textContent = Math.round(to * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(c); })(t0);
    });
  }, { threshold: 0.5 }).observe($('.ledger__stats'));
})();

/* ───────────── II · La casa por dentro ───────────── */
const tonightBusy = new Set(ROOMS.filter((r) => busy(r.no, TODAY)).map((r) => r.no));
(function corte() {
  const svg = $('[data-corte]'), tip = $('[data-corte-tip]'), wrap = $('[data-corte-wrap]');
  drawSection(svg, ROOMS);
  svg.classList.add('is-night');
  $$('.sp--room', svg).forEach((g) => g.classList.toggle('is-lit', tonightBusy.has(+g.dataset.sp)));
  $('[data-corte-count]').textContent = `Esta noche: ${tonightBusy.size} de 12 habitaciones con huéspedes`;
  const show = (g, e) => {
    const id = g.dataset.sp, room = byNo[+id];
    const sp = room ? null : g.getAttribute('aria-label');
    tip.innerHTML = room
      ? `<span class="corte__tip-ph" style="${photo(CATS[room.cat].photo)}"></span><b>Nº ${room.no} · ${room.n}</b><small>${CATS[room.cat].n} · ${room.m2} m² · ${room.view}</small><em>${tonightBusy.has(room.no) ? 'Ocupada esta noche' : 'Libre esta noche'} · Toque para abrir</em>`
      : `<b>${sp}</b><small>${g.dataset.d || ''}</small>`;
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left + wrap.scrollLeft, y = e.clientY - r.top;
    tip.style.left = `${x}px`; tip.style.top = `${y}px`;
    tip.classList.toggle('is-left', e.clientX > innerWidth * 0.62);
    tip.classList.add('is-on');
    $$('.sp', svg).forEach((s) => s.classList.toggle('is-on', s === g));
  };
  // Descripción de los espacios comunes desde el propio corte
  SPACES.forEach((sp) => { if (typeof sp.id !== 'number') { const g = $(`[data-sp="${sp.id}"]`, svg); if (g) g.dataset.d = sp.d; } });
  svg.addEventListener('pointermove', (e) => { const g = e.target.closest('.sp'); if (g) show(g, e); else { tip.classList.remove('is-on'); $$('.sp.is-on', svg).forEach((s) => s.classList.remove('is-on')); } });
  svg.addEventListener('pointerleave', () => { tip.classList.remove('is-on'); $$('.sp.is-on', svg).forEach((s) => s.classList.remove('is-on')); });
  svg.addEventListener('click', (e) => { const g = e.target.closest('.sp--room'); if (g) openRoom(+g.dataset.sp, true); });
  svg.addEventListener('keydown', (e) => { const g = e.target.closest('.sp--room'); if (g && e.key === 'Enter') openRoom(+g.dataset.sp, true); });
  $('[data-daynight]').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', b.parentNode).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    svg.classList.toggle('is-night', b.dataset.dn === 'night');
  });
  // En pantallas angostas, el corte se recorre de lado y parte en la escalera
  requestAnimationFrame(() => { if (wrap.scrollWidth > wrap.clientWidth) wrap.scrollLeft = (wrap.scrollWidth - wrap.clientWidth) * 0.35; });
})();

/* ───────────── III · Tablero de llaves y habitación ───────────── */
const roomEl = $('[data-room]');
const board = initKeys({ hooksEl: $('[data-hooks]'), rooms: ROOMS, cats: CATS, onPick: (no) => openRoom(no) });
const dateIn = $('[data-keys-date]');
dateIn.value = keyOf(TODAY); dateIn.min = keyOf(TODAY);
function boardFor(t) {
  const set = new Set(ROOMS.filter((r) => busy(r.no, t)).map((r) => r.no));
  board.setBusy(set);
  $('[data-board-note]').textContent = `${12 - set.size} de 12 llaves en el tablero para la noche del ${fmt(t, { weekday: 'long', day: 'numeric', month: 'long' })}.`;
}
dateIn.addEventListener('change', () => { const [y, m, d] = dateIn.value.split('-').map(Number); if (y) { boardFor(Date.UTC(y, m - 1, d)); board.breeze(); } });
boardFor(TODAY);
$('[data-key-filter]').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  $$('button', b.parentNode).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  board.filter(b.dataset.k);
});
new IntersectionObserver(([e]) => { if (e.isIntersecting) board.breeze(); }, { threshold: 0.4 }).observe($('[data-board]'));

let currentRoom = null;
function openRoom(no, scroll) {
  const r = byNo[no], c = CATS[r.cat];
  currentRoom = no;
  $('[data-room-ph]').setAttribute('style', photo(c.photo));
  $('[data-room-k]').innerHTML = `<span style="background:${c.color}"></span>Llave Nº ${r.no} · ${c.n}`;
  $('[data-room-n]').textContent = r.n;
  $('[data-room-d]').textContent = r.d;
  $('[data-room-spec]').innerHTML = [['Piso', r.floor], ['Superficie', `${r.m2} m²`], ['Cama', r.bed], ['Vista', r.view], ['Huéspedes', `Hasta ${c.cap}`]].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
  $('[data-room-feats]').innerHTML = r.feats.map((f) => `<li>${f}</li>`).join('');
  $('[data-room-price]').textContent = clp(c.price);
  $('[data-room-floor]').textContent = `Así se ubica en la casa: ${r.floor.toLowerCase()}.`;
  const mini = $('[data-room-mini]'); drawSection(mini, ROOMS, { mini: true });
  $$('.sp', mini).forEach((g) => g.classList.toggle('is-here', +g.dataset.sp === no));
  roomEl.classList.remove('is-open'); void roomEl.offsetWidth;
  roomEl.classList.add('is-open'); roomEl.setAttribute('aria-hidden', 'false');
  $$('.hook').forEach((h) => h.classList.toggle('is-taken', +h.dataset.no === no));
  if (scroll) $('#llaves').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  setTimeout(() => roomEl.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' }), scroll ? 700 : 80);
}
$('[data-room-close]').addEventListener('click', () => { roomEl.classList.remove('is-open'); roomEl.setAttribute('aria-hidden', 'true'); board.release(); });
$('[data-room-book]').addEventListener('click', () => { pickRoom(currentRoom); $('#reservar').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); });
$('[data-room-ph]').addEventListener('click', () => openViewer(CATS[byNo[currentRoom].cat].photo, `Nº ${currentRoom} · ${byNo[currentRoom].n}`));

/* ───────────── IV · La carta ───────────── */
(function menu() {
  const card = $('[data-menu-card]'), cameo = $('[data-cameo]'), tabs = $('[data-menu-tabs]');
  const render = (k) => {
    const m = MENU[k];
    $('[data-menu-t]').textContent = m.t; $('[data-menu-h]').textContent = m.h;
    $('[data-menu-items]').innerHTML = m.items.map(([n, d, p, ph]) => `<li data-ph="${ph}"><p><b>${n}</b><span>${d}</span></p><i aria-hidden="true"></i><em>${clp(p)}</em></li>`).join('');
  };
  render('almuerzo');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b || b.getAttribute('aria-selected') === 'true') return;
    $$('[data-tab]', tabs).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    card.classList.add('is-turn');
    setTimeout(() => { render(b.dataset.tab); card.classList.remove('is-turn'); }, reduced ? 0 : 380);
  });
  // Camafeo: el plato aparece en un marco oval que sigue al cursor
  const items = $('[data-menu-items]');
  items.addEventListener('pointerover', (e) => { const li = e.target.closest('li'); if (!li) return; $('[data-cameo-ph]').setAttribute('style', photo(li.dataset.ph)); cameo.classList.add('is-on'); });
  items.addEventListener('pointermove', (e) => { cameo.style.left = `${e.clientX}px`; cameo.style.top = `${e.clientY}px`; });
  items.addEventListener('pointerleave', () => cameo.classList.remove('is-on'));
  // Mesa: horarios según el día; algunos ya están tomados
  const form = $('[data-table]'), slots = $('[data-slots]');
  form.d.value = keyOf(TODAY + DAY); form.d.min = keyOf(TODAY);
  const paint = () => {
    const [y, m, d] = form.d.value.split('-').map(Number); const t = Date.UTC(y, m - 1, d); const wd = new Date(t).getUTCDay();
    if (wd === 0 || wd === 1) { slots.innerHTML = '<p class="table__closed">Domingo y lunes el restaurante descansa. Para huéspedes, cena ligera en la biblioteca.</p>'; return; }
    slots.innerHTML = ['13:00', '13:30', '14:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map((h) => { const full = hash(h + form.d.value + form.p.value) < 0.3; return `<button type="button" ${full ? 'disabled' : ''} data-h="${h}">${h}${full ? '<small>completo</small>' : ''}</button>`; }).join('');
  };
  form.addEventListener('change', paint); paint();
  slots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; $$('button', slots).forEach((x) => x.classList.toggle('is-on', x === b)); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const h = $('.is-on', slots)?.dataset.h;
    if (!h) { slots.classList.remove('shake'); void slots.offsetWidth; slots.classList.add('shake'); return; }
    const [y, m, d] = form.d.value.split('-').map(Number);
    toast(`Mesa para ${form.p.value} el ${fmt(Date.UTC(y, m - 1, d), { weekday: 'long', day: 'numeric', month: 'long' })} a las ${h}. En el sitio real llegaría al libro de reservas del restaurante.`);
  });
})();

/* ───────────── V · El álbum de la casa ───────────── */
initAlbum({
  bookEl: $('[data-book]'), stripEl: $('[data-album-strip]'), photo, reduced,
  ctl: { prev: $('[data-book-prev]'), next: $('[data-book-next]'), n: $('[data-book-n]') },
  onPhoto: (el) => openViewer(el.dataset.ph, el.closest('.pg').querySelector('.pg__cap')?.textContent || ''),
});

/* ───────────── Sonido ambiente ───────────── */
(function sound() {
  const b = $('[data-sound]'); let on = false;
  b.addEventListener('click', () => { on = !on; toggleSound(on); b.setAttribute('aria-pressed', String(on)); b.querySelector('span').textContent = on ? 'Lluvia y chimenea' : 'Escuchar la lluvia'; });
})();

/* ───────────── VI · Postales ───────────── */
initPostcards({ stackEl: $('[data-stack]'), listEl: $('[data-pc-list]'), cards: POSTCARDS, photo });

/* ───────────── VI · La lluvia, mes a mes, y los rituales ───────────── */
(function rain() {
  const el = $('[data-rainchart]'), max = Math.max(...RAIN), m = NOW.month - 1;
  el.innerHTML = RAIN.map((mm, i) => `<div class="rc ${i === m ? 'is-now' : ''}" style="--h:${(mm / max).toFixed(3)};--d:${i * 0.06}s"><span class="rc__col">${Array.from({ length: Math.max(2, Math.round(mm / 40)) }, (_, k) => `<i style="--k:${k};--x:${(hash(i + '-' + k) * 80 + 10).toFixed(0)}%"></i>`).join('')}</span><b>${mm}</b><small>${MONTHS[i]}</small>${i === m ? '<em>Este mes</em>' : ''}</div>`).join('');
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { el.classList.add('is-in'); o.disconnect(); } }, { threshold: 0.3 }).observe(el);
  const list = $('[data-rituals]');
  const paint = (k) => {
    list.innerHTML = RITUALS[k].map(([h, t, d, ph], i) => `<li style="--i:${i}"><time>${h}</time><span class="rit__ph" style="${photo(ph)}"></span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('');
    list.classList.remove('is-swap'); void list.offsetWidth; list.classList.add('is-swap');
  };
  paint(WX.wet ? 'lluvia' : 'sol');
  $$('[data-w]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.w === (WX.wet ? 'lluvia' : 'sol'))));
  $('[data-weather]').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', b.parentNode).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    paint(b.dataset.w);
  });
})();

/* ───────────── VII · Libro de reservas ───────────── */
const B = { no: null, a: null, b: null, month: Date.UTC(NOW.year, NOW.month - 1, 1) };
const roomSel = $('[data-b-room]'), guests = $('[data-b-guests]');
roomSel.innerHTML = '<option value="">Elija una habitación</option>' + Object.entries(CATS).map(([k, c]) => `<optgroup label="${c.n} · desde ${clp(c.price)}">${ROOMS.filter((r) => r.cat === k).map((r) => `<option value="${r.no}">Nº ${r.no} · ${r.n}</option>`).join('')}</optgroup>`).join('');
function pickRoom(no) { roomSel.value = no; B.no = no; B.a = B.b = null; renderCal(); receipt(); }
roomSel.addEventListener('change', () => { B.no = +roomSel.value || null; B.a = B.b = null; renderCal(); receipt(); });
function renderCal() {
  const grid = $('[data-cal-grid]'), m0 = new Date(B.month);
  $('[data-cal-month]').textContent = fmt(B.month, { month: 'long', year: 'numeric' });
  const first = (m0.getUTCDay() + 6) % 7, days = new Date(Date.UTC(m0.getUTCFullYear(), m0.getUTCMonth() + 1, 0)).getUTCDate();
  let html = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => `<span class="cal__wd">${d}</span>`).join('') + '<span></span>'.repeat(first);
  const price = B.no ? CATS[byNo[B.no].cat].price : null;
  for (let d = 1; d <= days; d++) {
    const t = Date.UTC(m0.getUTCFullYear(), m0.getUTCMonth(), d);
    const past = t < TODAY, full = B.no && !past && busy(B.no, t);
    const inR = B.a != null && t >= B.a && t <= (B.b ?? B.a);
    const wk = new Date(t).getUTCDay(); const we = wk === 5 || wk === 6;
    html += `<button type="button" class="cal__d ${inR ? 'is-sel' : ''} ${t === B.a ? 'is-a' : ''} ${t === B.b ? 'is-b' : ''} ${t === TODAY ? 'is-today' : ''}" data-t="${t}" ${past || full || !B.no ? 'disabled' : ''}><b>${d}</b>${price && !past ? `<small>${full ? 'ocupada' : Math.round((price * (we ? 1.12 : 1)) / 1000) + 'k'}</small>` : ''}</button>`;
  }
  grid.innerHTML = html;
  $('[data-cal-prev]').disabled = B.month <= Date.UTC(NOW.year, NOW.month - 1, 1);
  $('[data-cal-hint]').textContent = !B.no ? 'Primero elija una habitación (o tome una llave del tablero).' : B.a == null ? 'Elija la noche de llegada.' : B.b == null ? 'Ahora, la última noche.' : `${nights()} ${nights() === 1 ? 'noche' : 'noches'} · salida el ${fmt(B.b + DAY, { weekday: 'long', day: 'numeric', month: 'long' })} a las 12:00.`;
}
const nights = () => (B.a == null ? 0 : ((B.b ?? B.a) - B.a) / DAY + 1);
$('[data-cal-grid]').addEventListener('click', (e) => {
  const b = e.target.closest('.cal__d'); if (!b || b.disabled) return;
  const t = +b.dataset.t;
  if (B.a == null || B.b != null || t < B.a) { B.a = t; B.b = null; }
  else {
    // No se puede cruzar una noche ocupada
    let ok = true; for (let x = B.a; x <= t; x += DAY) if (busy(B.no, x)) ok = false;
    if (ok) B.b = t; else { B.a = t; B.b = null; }
  }
  renderCal(); receipt();
});
$('[data-cal-prev]').addEventListener('click', () => { const m = new Date(B.month); B.month = Date.UTC(m.getUTCFullYear(), m.getUTCMonth() - 1, 1); renderCal(); });
$('[data-cal-next]').addEventListener('click', () => { const m = new Date(B.month); B.month = Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1); renderCal(); });
[guests, $('[data-b-name]'), $('[data-b-extras]')].forEach((el) => el.addEventListener('input', receipt));
function receipt() {
  const lines = [], r = B.no ? byNo[B.no] : null, c = r ? CATS[r.cat] : null;
  const n = B.b != null ? nights() : 0, g = +guests.value;
  if (c) guests.querySelectorAll('option').forEach((o) => (o.disabled = +o.value > c.cap));
  if (c && g > c.cap) guests.value = String(c.cap);
  let total = 0;
  if (r) lines.push([`Hab. Nº ${r.no} · ${r.n}`, c.n]);
  if (n) {
    let base = 0; for (let x = B.a; x <= B.b; x += DAY) { const wk = new Date(x).getUTCDay(); base += c.price * (wk === 5 || wk === 6 ? 1.12 : 1); }
    total += base;
    lines.push([`${fmt(B.a, { day: 'numeric', month: 'short' })} → ${fmt(B.b + DAY, { day: 'numeric', month: 'short' })} · ${n} ${n === 1 ? 'noche' : 'noches'}`, clp(base)]);
    lines.push(['Desayuno buffet', 'incluido']);
    $$('[data-b-extras] input:checked').forEach((i) => {
      const v = +i.dataset.x, per = i.dataset.per, amt = per === 'night' ? v * n : per === 'guest' ? v * +guests.value : v;
      total += amt; lines.push([i.parentNode.querySelector('span').textContent, amt ? clp(amt) : 'de la casa']);
    });
  }
  $('[data-r-lines]').innerHTML = lines.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
  $('[data-r-total]').textContent = n ? clp(total) : '—';
  $('[data-r-no]').textContent = r && n ? `1910-${String(Math.floor(hash(`${B.no}${B.a}${B.b}`) * 9000) + 1000)}` : '—';
  const name = $('[data-b-name]').value.trim();
  $('[data-r-note]').textContent = !r ? 'Elija habitación y fechas.' : !n ? 'Elija las fechas en el calendario.' : `A nombre de ${name || '—'} · ${guests.value} ${+guests.value === 1 ? 'huésped' : 'huéspedes'} · 30 % para confirmar.`;
  const st = $('[data-stamp]'), on = !!(r && n);
  if (on && !st.classList.contains('is-on')) { st.classList.remove('is-on'); void st.offsetWidth; }
  st.classList.toggle('is-on', on);
}
renderCal(); receipt();

/* ───────────── Libro de visitas ───────────── */
(function gbook() {
  const list = $('[data-gb-list]'), form = $('[data-gb-form]');
  let mine = []; try { mine = JSON.parse(localStorage.getItem('casanogal-firmas') || '[]'); } catch { mine = []; }
  const item = ([m, n, c], fresh) => `<li class="${fresh ? 'is-fresh' : ''}"><p>${m.replace(/</g, '&lt;')}</p><span>${n.replace(/</g, '&lt;')}${c ? ` · ${c.replace(/</g, '&lt;')}` : ''}</span></li>`;
  list.innerHTML = [...GUESTBOOK, ...mine].map((e) => item(e)).join('');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const entry = [form.m.value.trim(), form.n.value.trim(), ''];
    if (!entry[0] || !entry[1]) return;
    list.insertAdjacentHTML('beforeend', item(entry, true));
    mine.push(entry); try { localStorage.setItem('casanogal-firmas', JSON.stringify(mine.slice(-6))); } catch { /* sin almacenamiento */ }
    form.reset();
  });
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
addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeViewer(); setMenu(false); } });
[['.stair__ph', 'escalera', 'La escalera de 1910'], ['.mesa__room div', 'restaurante', 'El comedor'], ['.mesa__strip figure:nth-child(1) div', 'merluza', 'Merluza austral'], ['.mesa__strip figure:nth-child(2) div', 'kuchen', 'Kuchen de murta'], ['.mesa__strip figure:nth-child(3) div', 'desayuno', 'Desayuno a la cama']]
  .forEach(([s, slot, cap]) => $(s)?.addEventListener('click', () => openViewer(slot, cap)));

/* ───────────── Apariciones y parallax ───────────── */
$$('.plate, .casona__intro, .then, .ledger, .stair, .corte__head, .corte__wrap, .keys__head, .board, .mesa__intro, .menu, .mesa__strip figure, .album__head, .book, .valdivia__intro, .stack, .lluvia__head, .rituals, .book__form, .receipt, .guests__score, .gbook, .arrive__grid > *, .end__in, .foot__grid').forEach((el) => el.classList.add('rv'));
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv, .ln').forEach((el) => io.observe(el));
if (!reduced) addEventListener('scroll', () => {
  const s = $('.stair__ph'), r = s.getBoundingClientRect();
  if (r.bottom > 0 && r.top < innerHeight) s.style.backgroundPosition = `center ${50 + (r.top / innerHeight - 0.5) * -24}%`;
  const e = $('.end__ph'), q = e.getBoundingClientRect();
  if (q.bottom > 0 && q.top < innerHeight) e.style.transform = `translate3d(0, ${(q.top / innerHeight) * -50}px, 0) scale(1.1)`;
}, { passive: true });

// Termas Rayenko · comportamiento a medida
import './style.css';
import { POOLS, BLOCKS, PRICES, EXTRAS, CABINS, AIR, HIGH, MONTHS, SEASONS, REVIEWS, FAQ, WATER } from './data.js';
import { initSteam } from './steam.js';
import { toggleSound } from './sound.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
// Hash FNV-1a con mezcla final
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967295; };
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const DAY = 864e5;
const WD = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

// Color según temperatura: río frío → agua termal → fuego
const STOPS = [[11, [110, 163, 198]], [30, [142, 201, 192]], [38, [232, 192, 122]], [42, [217, 103, 60]]];
const tempColor = (t) => {
  for (let i = 1; i < STOPS.length; i++) if (t <= STOPS[i][0]) { const [t0, a] = STOPS[i - 1], [t1, b] = STOPS[i], k = clamp((t - t0) / (t1 - t0)); return `rgb(${a.map((v, j) => Math.round(lerp(v, b[j], k))).join(',')})`; }
  return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`;
};

/* Hora en Chile */
const P = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, +x.value]));
const TODAY = Date.UTC(P.year, P.month - 1, P.day), M = P.month - 1, HOUR = P.hour + P.minute / 60;
const keyOf = (t) => new Date(t).toISOString().slice(0, 10);
const fmtDay = (t) => `${['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][new Date(t).getUTCDay()]} ${new Date(t).getUTCDate()} de ${MONTHS[new Date(t).getUTCMonth()]}`;

/* Fotografías */
const tpl = $('template[data-photos]').content;
const photo = (slot) => tpl.querySelector(`[data-p="${slot}"]`)?.getAttribute('style') || '';
const firstUrl = (slot) => new Promise((res) => {
  const urls = [...photo(slot).matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => m[2]);
  const t = (k) => { if (k >= urls.length) return res(null); const im = new Image(); im.onload = () => res(urls[k]); im.onerror = () => t(k + 1); im.src = urls[k]; };
  t(0);
});

/* Aviso de muestra */
const note = $('.note'); let noteT;
const toast = (t) => { $('[data-note-text]').textContent = t; note.classList.add('is-in'); clearTimeout(noteT); noteT = setTimeout(() => note.classList.remove('is-in'), 9000); };
$('[data-note-close]').addEventListener('click', () => note.classList.remove('is-in'));
document.addEventListener('click', (e) => { const d = e.target.closest('[data-demo]'); if (!d) return; e.preventDefault(); toast(d.dataset.demo || 'En el sitio real, este botón abriría WhatsApp con la recepción de Termas Rayenko, con su bloque y fecha ya escritos.'); });
// Ondas de agua donde se toca un botón
document.addEventListener('pointerdown', (e) => {
  if (reduced || !e.target.closest('.heat-btn, .blk, .book__days button')) return;
  for (let i = 0; i < 2; i++) { const r = document.createElement('span'); r.className = 'ring'; r.style.left = `${e.pageX}px`; r.style.top = `${e.pageY}px`; document.body.append(r); setTimeout(() => r.remove(), 1200); }
});

/* ───────────── Pantalla de carga: la vertiente se abre y el agua sube de 11 a 39 °C ───────────── */
(function loader() {
  const el = $('.loader'), tt = $('[data-load-t]'), k = $('[data-load-k]'), water = $('.loader__water'), dur = reduced ? 0 : 2100, t0 = performance.now();
  const msgs = [[0, 'Abriendo la vertiente'], [0.45, 'El agua baja por la quebrada'], [0.85, 'Pozón listo']];
  (function f(now) {
    const p = dur ? clamp((now - t0) / dur) : 1, e = 1 - (1 - p) ** 2, T = Math.round(lerp(11, 39, e));
    tt.textContent = T; water.style.fill = tempColor(T); el.style.setProperty('--c', String(1 - e)); el.style.setProperty('--s', String(0.15 + e * 0.6));
    k.textContent = msgs.filter(([a]) => p >= a).pop()[1];
    if (p < 1) requestAnimationFrame(f);
  })(t0);
  const go = () => setTimeout(() => document.body.classList.add('is-ready'), Math.max(0, dur + 300 - (performance.now() - t0)));
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
  setTimeout(() => document.body.classList.add('is-ready'), 7000);
})();

/* Navegación móvil */
const burger = $('[data-burger]'), drawer = $('[data-drawer]');
burger.addEventListener('click', () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); drawer.classList.toggle('is-open', o); drawer.setAttribute('aria-hidden', !o); });
$$('a', drawer).forEach((a) => a.addEventListener('click', () => burger.click()));

/* ───────────── Hero: vapor, brillo de calor y "ahora en las termas" ───────────── */
initSteam($('[data-steam]'), { reduced });
(function shimmer() {
  const tb = $('[data-heat]'); if (!tb || reduced) return;
  let vis = true; new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe($('[data-hero]'));
  (function f(t) { requestAnimationFrame(f); if (!vis) return; tb.setAttribute('baseFrequency', `${(0.012 + Math.sin(t / 900) * 0.003).toFixed(4)} ${(0.06 + Math.sin(t / 650) * 0.012).toFixed(4)}`); tb.setAttribute('seed', String(Math.floor(t / 120) % 40)); })(0);
})();
const moon = (() => { const age = (((Date.now() - Date.UTC(2000, 0, 6, 18, 14)) / DAY) % 29.530588853 + 29.530588853) % 29.530588853; return { ill: Math.round(((1 - Math.cos((2 * Math.PI * age) / 29.530588853)) / 2) * 100), wax: age < 14.77 }; })();
const blockTaken = (t, b) => Math.round(b.cap * (0.35 + hash(keyOf(t) + b.id) * 0.6) * ([0, 6].includes(new Date(t).getUTCDay()) ? 1.15 : 0.85));
const blockLeft = (t, b) => Math.max(0, b.cap - blockTaken(t, b));
const blockStart = (b) => +b.from.slice(0, 2);
(function now() {
  const diurnal = -3 * Math.cos(((HOUR - 4) / 24) * 2 * Math.PI);
  const air = Math.round(AIR[M] + diurnal + (hash('air' + keyOf(TODAY)) - 0.5) * 3);
  const water = (38.6 + hash('w' + keyOf(TODAY) + P.hour) * 0.8).toFixed(1).replace('.', ',');
  const next = BLOCKS.find((b) => blockStart(b) > HOUR) || BLOCKS[0];
  const nextDay = BLOCKS.some((b) => blockStart(b) > HOUR) ? TODAY : TODAY + DAY;
  $('[data-now-air]').textContent = `${air} °C`;
  $('[data-now-water]').textContent = `${water} °C`;
  $('[data-now-block]').textContent = `${next.name} ${next.from}`;
  $('[data-now-cap]').textContent = `${blockLeft(nextDay, next)} libres`;
  $('[data-now-moon]').textContent = `Luna ${moon.ill}% ${moon.wax ? '↑' : '↓'}`;
  $('[data-nav-now] b').textContent = `${water} °C`;
  $('[data-end-water]').textContent = `${water} °C`;
  window.__air = air;
})();

/* Revelado al desplazar */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
const watch = () => $$('.rv:not(.in)').forEach((el) => io.observe(el));

/* ───────────── Termómetro del recorrido ───────────── */
(function thermo() {
  const th = $('.thermo'), v = $('[data-thermo-v]'), l = $('[data-thermo-l]'), fill = $('[data-thermo-fill]');
  const secs = $$('[data-temp]'); let cur = null;
  const upd = () => {
    th.classList.toggle('on', scrollY > innerHeight * 0.7);
    const mid = innerHeight * 0.5;
    const s = secs.filter((x) => x.getBoundingClientRect().top < mid).pop() || secs[0];
    if (s === cur) return; cur = s;
    const t = +s.dataset.temp;
    v.textContent = `${t}°`; l.textContent = s.dataset.tl;
    th.style.setProperty('--t', tempColor(t));
    fill.style.setProperty('--h', `${((t - 8) / 34) * 100}%`);
  };
  addEventListener('scroll', upd, { passive: true }); upd();
})();

/* ───────────── La quebrada: mapa de pozones ───────────── */
(function map() {
  const svg = $('[data-map]'), panel = $('[data-pool]');
  const NS = 'http://www.w3.org/2000/svg';
  const blob = (cx, cy, r, seed) => {
    const n = 14, pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, rr = r * (0.84 + hash(seed + i) * 0.3); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.78]; });
    let d = '';
    pts.forEach((p, i) => { const p0 = pts[(i - 1 + n) % n], p1 = p, p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]; if (!i) d += `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`; d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; });
    return d + 'Z';
  };
  // Pasarela: curva suave que pasa por los siete pozones
  const pts = [[96, 70], ...POOLS.map((p) => [p.x, p.y + p.r * 0.95])];
  let walkD = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]; walkD += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`; }
  const streamD = 'M120 120 C200 190 250 260 380 330 S560 300 640 300 S760 420 860 470 S960 560 1010 600';
  let g = '';
  // Bosque: copas de árboles repartidas lejos del estero
  for (let i = 0; i < 260; i++) {
    const x = hash('tx' + i) * 1000, y = hash('ty' + i) * 620;
    if (POOLS.some((p) => Math.hypot(p.x - x, p.y - y) < p.r + 26)) continue;
    const r = 6 + hash('tr' + i) * 16;
    g += `<circle class="${i % 3 ? 'tree' : 'tree2'}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" />`;
  }
  g += `<path class="stream" d="${streamD}" /><path class="stream2" d="${streamD}" />`;
  g += `<path class="walk" d="${walkD}" /><path class="walk2" d="${walkD}" data-walk2 pathLength="1" />`;
  g += `<circle class="src" cx="120" cy="118" r="7" /><text class="lbl" x="134" y="112">Vertiente 68 °C</text><text class="lbl" x="40" y="48">Recepción</text><rect x="70" y="56" width="52" height="26" fill="#3a2f24" stroke="#a07b52" />`;
  g += `<text class="lbl" x="930" y="600" text-anchor="end">Estero · al río Liquiñe</text>`;
  g += `<g data-lanterns></g>`;
  g += POOLS.map((p) => {
    const c = tempColor(p.temp), wisps = p.temp >= 36 ? 3 : p.temp >= 30 ? 1 : 0;
    const w = Array.from({ length: wisps }, (_, i) => `<path class="wisp" style="animation-delay:${(i * 1.1 + hash(p.id) * 2).toFixed(2)}s" d="M${p.x - 16 + i * 16} ${p.y - 8} c-6 -10 6 -14 0 -24" />`).join('');
    return `<g class="pl" data-pool-id="${p.id}" tabindex="0" role="button" aria-label="${p.name}, ${p.temp} grados"><path class="pl__w" d="${blob(p.x, p.y, p.r, p.id)}" fill="${c}" /><path d="${blob(p.x, p.y, p.r * 0.8, p.id + 'i')}" fill="url(#poolg)" pointer-events="none" /><text class="pl__n" x="${p.x}" y="${p.y + 8}">${p.n}</text><text class="pl__t" x="${p.x}" y="${p.y + p.r + 24}">${p.temp} °C</text>${w}</g>`;
  }).join('');
  g += '<circle class="walker" r="7" cx="-20" cy="-20" data-walker />';
  svg.innerHTML = g;
  // Faroles cada tanto a lo largo de la pasarela
  const wp = $('[data-walk2]'), wl = wp.getTotalLength();
  $('[data-lanterns]', svg).innerHTML = Array.from({ length: 16 }, (_, i) => { const q = wp.getPointAtLength((i + 0.5) * (wl / 16)); return `<circle class="lantern" cx="${(q.x + 9).toFixed(1)}" cy="${(q.y - 6).toFixed(1)}" r="3" style="animation-delay:${(hash('l' + i) * 2).toFixed(2)}s" />`; }).join('');
  // Ubicación de cada pozón sobre la pasarela (para el recorrido)
  const at = POOLS.map((p) => { let best = 0, bd = 1e9; for (let s = 0; s <= 400; s++) { const q = wp.getPointAtLength((s / 400) * wl), d = Math.hypot(q.x - p.x, q.y - (p.y + p.r * 0.95)); if (d < bd) { bd = d; best = s / 400; } } return best; });
  function show(id) {
    const p = POOLS.find((x) => x.id === id);
    $$('.pl', svg).forEach((el) => el.classList.toggle('on', el.dataset.poolId === id));
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
    panel.innerHTML = `<div class="pool__ph" style="${photo(p.slot)}" data-zoom="${p.slot}" aria-label="${p.name}"><p class="pool__deg" style="--t:${tempColor(p.temp)}">${p.temp}°</p></div><div class="pool__tx"><p class="pool__k">Pozón ${p.n} de 7</p><h3>${p.name}</h3><p>${p.d}</p><dl><div><dt>Profundidad</dt><dd>${p.depth}</dd></div><div><dt>Personas</dt><dd>${p.cap}</dd></div><div><dt>Tiempo</dt><dd>${p.mins}</dd></div></dl><p class="pool__best">${p.best}</p></div>`;
  }
  svg.addEventListener('click', (e) => { const g = e.target.closest('.pl'); if (g) { stopWalk(); show(g.dataset.poolId); } });
  svg.addEventListener('keydown', (e) => { const g = e.target.closest('.pl'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(g.dataset.poolId); } });
  show('coigue');
  // Recorrido sugerido: una luz camina por la pasarela y se detiene en cada pozón
  const walker = $('[data-walker]'); let raf = 0, t0 = 0, lastPool = -1;
  function stopWalk() { cancelAnimationFrame(raf); raf = 0; wp.style.strokeDasharray = '0 1'; walker.setAttribute('cx', -20); }
  $('[data-walk]').addEventListener('click', () => {
    stopWalk(); t0 = performance.now(); lastPool = -1;
    const D = reduced ? 1 : 14000;
    (function f(now) {
      const k = clamp((now - t0) / D), q = wp.getPointAtLength(k * wl);
      walker.setAttribute('cx', q.x); walker.setAttribute('cy', q.y);
      wp.style.strokeDasharray = `${k} 1`;
      const i = at.findLastIndex((a) => k >= a - 0.004);
      if (i !== lastPool && i >= 0) { lastPool = i; show(POOLS[i].id); }
      if (k < 1) raf = requestAnimationFrame(f); else raf = 0;
    })(t0);
  });
  void NS;
})();

/* ───────────── El ritual de contraste (versión de un minuto) ───────────── */
(function ritual() {
  const dial = $('[data-dial]'), arc = $('[data-arc]'), ph = $('[data-phase]'), tm = $('[data-time]'), cue = $('[data-cue]'), steps = $('[data-steps]'), round = $('[data-round]'), btn = $('[data-ritual]');
  const PH = [['hot', 10, 'Pozón del Fuego', '#e8a35a', 'Inhale en cuatro, exhale en seis'], ['cold', 4, 'Poza del Río', '#6ea3c6', 'Sesenta segundos. Usted puede.'], ['rest', 6, 'Descanso', '#7d8c63', 'Envuélvase y escuche el estero']];
  const total = 3 * PH.reduce((s, p) => s + p[1], 0);
  let raf = 0, t0 = 0;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.ceil(s % 60) % 60 === 0 && s % 60 > 0 ? 0 : Math.ceil(s % 60)).padStart(2, '0')}`;
  function stop(done) {
    cancelAnimationFrame(raf); raf = 0; dial.classList.remove('breathe'); steps.classList.remove('running'); $$('li', steps).forEach((l) => l.classList.remove('on'));
    btn.querySelector('span').textContent = done ? 'Repetir el ritual' : 'Comenzar el ritual';
    ph.textContent = done ? 'Circuito completo' : 'Listo'; tm.textContent = done ? '0:00' : '1:00'; cue.textContent = done ? 'Así se siente salir de Rayenko' : 'Respire con el círculo';
    arc.style.strokeDashoffset = done ? '0' : '1';
    round.textContent = done ? 'Vuelta 3 de 3' : 'Vuelta 0 de 3';
  }
  btn.addEventListener('click', () => {
    if (raf) return stop(false);
    t0 = performance.now(); dial.classList.add('breathe'); steps.classList.add('running');
    btn.querySelector('span').textContent = 'Detener';
    (function f(now) {
      const el = (now - t0) / 1000;
      if (el >= total) return stop(true);
      const cyc = PH.reduce((s, p) => s + p[1], 0), r = Math.floor(el / cyc); let w = el % cyc, i = 0;
      while (w >= PH[i][1]) { w -= PH[i][1]; i++; }
      const [id, , name, col, c] = PH[i];
      dial.style.setProperty('--rc', col); ph.textContent = name; cue.textContent = c;
      tm.textContent = `0:${String(Math.ceil(total - el)).padStart(2, '0')}`.replace('0:60', '1:00');
      arc.style.strokeDashoffset = String(1 - el / total);
      round.textContent = `Vuelta ${r + 1} de 3`;
      $$('li', steps).forEach((l) => l.classList.toggle('on', l.dataset.s === id));
      raf = requestAnimationFrame(f);
    })(t0);
  });
  void fmt;
})();

/* ───────────── De dónde viene el agua: corte geológico ───────────── */
(function geo() {
  const sec = $('[data-geo]'), svg = $('[data-geo-svg]'), steps = $$('li', $('[data-geo-steps]')), dEl = $('[data-geo-depth]'), tEl = $('[data-geo-temp]');
  const stage = $('.geo__stage');
  stage.style.cssText += photo('volcan').replace('background-image:', ';background-size:cover;background-position:center top;background-image:linear-gradient(rgba(14,20,18,.35), rgba(14,20,18,.6)),');
  const route = 'M985 30 L955 150 C925 240 905 400 880 520 C860 610 760 640 660 630 C570 620 520 520 470 420 C430 340 380 260 330 212';
  const rain = Array.from({ length: 26 }, (_, i) => `<line x1="${860 + hash('rx' + i) * 260}" y1="${10 + hash('ry' + i) * 60}" x2="${854 + hash('rx' + i) * 260}" y2="${28 + hash('ry' + i) * 60}" style="animation-delay:${(hash('rd' + i) * 1.1).toFixed(2)}s" />`).join('');
  svg.innerHTML = `<defs><radialGradient id="magma" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffb35c" /><stop offset=".45" stop-color="#d9673c" /><stop offset="1" stop-color="#5a1d10" stop-opacity="0" /></radialGradient></defs>
    <g class="rain">${rain}</g>
    <path d="M0 214 L250 214 C300 210 320 206 360 214 L760 214 L860 120 L930 52 L960 40 L990 50 L1060 120 L1200 214 L1200 700 L0 700 Z" fill="#2c2a24" class="layer" />
    <path d="M905 82 L930 52 L960 40 L990 50 L1015 80 L995 74 L975 86 L955 72 L935 88 Z" fill="#eef1ec" opacity=".9" />
    <path d="M0 330 C300 320 600 350 1200 320 L1200 700 L0 700 Z" fill="#24211d" class="layer" />
    <path d="M0 470 C400 450 800 490 1200 460 L1200 700 L0 700 Z" fill="#1c1916" class="layer" />
    <ellipse cx="960" cy="660" rx="260" ry="90" class="magma" />
    <path class="fault" d="M580 700 C540 560 470 420 330 214" />
    <text x="556" y="690" transform="rotate(-62 556 690)">Falla Liquiñe-Ofqui</text>
    <text x="900" y="690">Calor del volcán</text>
    <text x="910" y="24">Mocho-Choshuenco</text>
    <path d="M250 214 C270 226 300 228 320 214" fill="#8ec9c0" /><path d="M200 216 C214 224 234 224 246 216" fill="#8ec9c0" opacity=".8" /><path d="M150 216 C162 222 178 222 190 216" fill="#6ea3c6" opacity=".8" />
    <text x="150" y="250">Los pozones</text>
    <path class="route" d="${route}" /><path class="route2" d="${route}" pathLength="1" data-route2 />
    <circle class="drop" r="9" data-drop />`;
  const rp = $('[data-route2]'), rl = rp.getTotalLength(), drop = $('[data-drop]');
  const tempAt = (p) => p < 0.14 ? 4 : p < 0.55 ? lerp(4, 180, ((p - 0.14) / 0.41) ** 1.4) : p < 0.66 ? 180 : lerp(180, 68, (p - 0.66) / 0.34);
  rp.style.strokeDasharray = '1'; rp.style.strokeDashoffset = '1';
  let k = -1;
  function upd() {
    const r = sec.getBoundingClientRect(), p = reduced ? 1 : clamp(-r.top / Math.max(1, sec.offsetHeight - innerHeight));
    if (Math.abs(p - k) < 0.0005) return; k = p;
    const q = rp.getPointAtLength(p * rl), T = Math.round(tempAt(p)), col = tempColor(Math.min(42, 11 + (T - 4) * 0.2));
    drop.setAttribute('cx', q.x); drop.setAttribute('cy', q.y); drop.setAttribute('fill', col);
    rp.style.strokeDashoffset = String(1 - p); rp.style.stroke = col;
    const depth = Math.max(0, Math.round(((q.y - 214) / 486) * 4200 / 50) * 50);
    dEl.textContent = depth >= 1000 ? `${(depth / 1000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} km` : `${depth} m`;
    tEl.textContent = `${T} °C`; sec.style.setProperty('--gt', col);
    const i = Math.min(4, Math.floor(p * 5));
    steps.forEach((s, j) => s.classList.toggle('on', j === i));
  }
  const fit = () => svg.setAttribute('preserveAspectRatio', innerWidth < 900 ? 'xMidYMid meet' : 'xMidYMid slice');
  fit(); addEventListener('scroll', upd, { passive: true }); addEventListener('resize', () => { fit(); k = -1; upd(); }); upd();
  $('[data-water]').innerHTML = WATER.map(([a, b, c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('') + '<tr><td colspan="3" class="water__fine">Análisis referencial de una muestra de concepto.</td></tr>';
})();

/* ───────────── Reserva por bloques, con pulsera de acceso ───────────── */
(function book() {
  const daysEl = $('[data-days]'), blocksEl = $('[data-blocks]'), sumEl = $('[data-sum]'), band = $('[data-band]');
  const days = Array.from({ length: 14 }, (_, i) => TODAY + i * DAY);
  const st = { day: TODAY, block: null, ad: 2, ch: 0, se: 0, x: new Set() };
  const isWe = (t) => [0, 6].includes(new Date(t).getUTCDay());
  const base = (t) => (HIGH.includes(new Date(t).getUTCMonth()) ? PRICES.high : isWe(t) ? PRICES.weekend : PRICES.low);
  daysEl.innerHTML = days.map((t) => `<button type="button" role="radio" class="${isWe(t) ? 'we' : ''}" data-t="${t}" aria-checked="${t === st.day}"><small>${t === TODAY ? 'hoy' : WD[new Date(t).getUTCDay()]}</small><b>${new Date(t).getUTCDate()}</b><small>${MONTHS[new Date(t).getUTCMonth()].slice(0, 3)}</small></button>`).join('');
  $('[data-extras]').innerHTML = EXTRAS.map((x) => `<label class="xt"><input type="checkbox" data-x="${x.id}" /><span>${x.label}</span><b>${clp(x.price)}${x.per ? ' c/u' : ''}</b></label>`).join('');
  function blocks() {
    blocksEl.innerHTML = BLOCKS.map((b) => {
      const left = blockLeft(st.day, b), past = st.day === TODAY && blockStart(b) <= HOUR, off = past || left === 0 || (b.night && st.ch > 0);
      const price = base(st.day) + (b.night ? PRICES.night : 0);
      return `<button type="button" role="radio" class="blk" style="--c:${b.c};--f:${((1 - left / b.cap) * 100).toFixed(0)}%" data-b="${b.id}" aria-checked="${st.block === b.id}" ${off ? 'disabled' : ''}><span class="blk__n">${b.name}</span><span class="blk__h">${b.from} – ${b.to}</span><span class="blk__k">${b.k}</span><span class="blk__cap"><i></i>${past ? 'ya comenzó' : left === 0 ? 'agotado' : b.night && st.ch > 0 ? 'solo adultos' : `${left} cupos`}</span><span class="blk__p">${clp(price)} por adulto</span></button>`;
    }).join('');
    if (st.block && blocksEl.querySelector(`[data-b="${st.block}"]:disabled`)) st.block = null;
    if (!st.block) st.block = blocksEl.querySelector('.blk:not(:disabled)')?.dataset.b || null;
    $$('.blk', blocksEl).forEach((x) => x.setAttribute('aria-checked', x.dataset.b === st.block));
  }
  function sum() {
    const b = BLOCKS.find((x) => x.id === st.block), people = st.ad + st.ch + st.se;
    if (!b) { sumEl.innerHTML = '<p>No quedan bloques disponibles este día. Pruebe con otra fecha.</p>'; return; }
    const pa = base(st.day) + (b.night ? PRICES.night : 0);
    let tot = pa * st.ad + pa * PRICES.child * st.ch + pa * PRICES.senior * st.se;
    EXTRAS.forEach((x) => { if (st.x.has(x.id)) tot += x.per ? x.price * people : x.price; });
    sumEl.innerHTML = `<dl><div><dt>Día</dt><dd>${fmtDay(st.day)}</dd></div><div><dt>Bloque</dt><dd>${b.name}, ${b.from} a ${b.to}</dd></div><div><dt>Personas</dt><dd>${people}</dd></div></dl><p class="book__tot"><small>Total directo</small>${clp(tot)}</p><button type="button" class="heat-btn" data-confirm><span>Confirmar reserva</span></button>`;
    $('[data-confirm]').addEventListener('click', () => wrist(b, people));
  }
  function wrist(b, people) {
    const code = `RK-${String(Math.floor(hash(keyOf(st.day) + b.id + people) * 9000) + 1000)}`;
    const qr = Array.from({ length: 81 }, (_, i) => { const x = i % 9, y = Math.floor(i / 9), corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5); return `<i class="${corner ? ((x % 3 === 1 && y % 3 === 1) ? 'o' : '') : hash(code + i) > 0.5 ? '' : 'o'}"></i>`; }).join('');
    band.innerHTML = `<div class="band__strap" style="--c:${b.c}"><p class="band__tx"><b>${b.name} · ${b.from} h</b>${fmtDay(st.day)} · ${people} ${people === 1 ? 'persona' : 'personas'} · ${code}</p><div class="band__qr">${qr}</div></div><p class="band__fine">Su pulsera de acceso. En el sitio real se paga en línea y llega al WhatsApp; en la entrada solo se escanea.</p>`;
    toast('En el sitio real, aquí se paga con tarjeta o transferencia y la pulsera de acceso llega por WhatsApp y correo.');
  }
  const paint = () => { blocks(); sum(); };
  daysEl.addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (!b) return; st.day = +b.dataset.t; $$('[data-t]', daysEl).forEach((x) => x.setAttribute('aria-checked', x === b)); band.innerHTML = ''; paint(); });
  blocksEl.addEventListener('click', (e) => { const b = e.target.closest('[data-b]'); if (!b || b.disabled) return; st.block = b.dataset.b; $$('.blk', blocksEl).forEach((x) => x.setAttribute('aria-checked', x === b)); band.innerHTML = ''; sum(); });
  $('[data-who]').addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (!b) return; const k = b.dataset.p; st[k] = clamp(st[k] + +b.dataset.d, k === 'ad' ? (st.se ? 0 : 1) : 0, 8); if (k === 'se' && !st.ad && !st.se) st.ad = 1; $(`[data-o="${k}"]`).textContent = st[k]; $('[data-o="ad"]').textContent = st.ad; band.innerHTML = ''; paint(); });
  $('[data-extras]').addEventListener('change', (e) => { const c = e.target.closest('[data-x]'); if (!c) return; c.checked ? st.x.add(c.dataset.x) : st.x.delete(c.dataset.x); sum(); });
  paint();
})();

/* ───────────── Estaciones ───────────── */
(function seasons() {
  const ph = $('[data-season-ph]'), tabs = $('[data-season-tabs]');
  const cur = SEASONS.find((s) => s.months.includes(M));
  tabs.innerHTML = SEASONS.map((s) => `<button role="tab" aria-selected="${s === cur}" data-s="${s.id}">${s.name}${s === cur ? '<i>ahora</i>' : ''}</button>`).join('');
  const pick = (s, first) => {
    $$('[data-s]', tabs).forEach((b) => b.setAttribute('aria-selected', b.dataset.s === s.id));
    const apply = () => { ph.setAttribute('style', photo(s.slot)); $('[data-season-t]').textContent = s.name; $('[data-season-d]').innerHTML = `${s.t}<b>Aire ${s.air} · agua siempre a 39 °C</b>`; ph.classList.remove('fade'); };
    if (first || reduced) return apply();
    ph.classList.add('fade'); setTimeout(apply, 450);
  };
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (b) pick(SEASONS.find((s) => s.id === b.dataset.s)); });
  pick(cur, true);
})();

/* Cabañas, reseñas y preguntas */
$('[data-cabins]').innerHTML = CABINS.map((c) => `<li class="rv"><b>${c.name}</b><span>${c.d} Hasta ${c.cap} personas.</span><em>${clp(c.price)}<small>por noche</small></em></li>`).join('');
$('[data-reviews]').innerHTML = REVIEWS.map(([t, w, p]) => `<blockquote><p>«${t}»</p><cite><b>${w}</b>${p}</cite></blockquote>`).join('');
$('[data-faq]').innerHTML = FAQ.map(([q, a]) => `<details class="rv"><summary>${q}</summary><p>${a}</p></details>`).join('');

/* ───────────── Gift card ───────────── */
(function gift() {
  const f = $('[data-gift]'), card = $('[data-card]');
  const st = { design: 'vapor', plan: '2' };
  const PLAN = { 2: ['Bloque para dos', 52000], '2m': ['Bloque y masaje para dos', 128000], c: ['Noche en cabaña con pozones', 150000] };
  function paint() {
    const fe = f.elements, to = fe.to.value.trim() || 'Ana', from = fe.from.value.trim() || 'Pablo', msg = fe.msg.value.trim() || 'Para que el invierno pase más tibio';
    const [pn, pv] = PLAN[st.plan], code = `REG-${String(Math.floor(hash(to + from + st.plan) * 90000) + 10000)}`;
    card.className = `card card--${st.design}`;
    card.innerHTML = `<div class="card__steam"><span></span><span></span><span></span></div><div class="card__in"><div class="card__top"><svg viewBox="0 0 64 64"><use href="#mark" /></svg><span>Termas Rayenko · tarjeta de regalo</span></div><div class="card__mid"><p class="card__to">Para ${to}</p><p class="card__msg">«${msg}» — ${from}</p></div><div class="card__bot"><span>${pn}<br />${code} · válida 12 meses</span><b>${clp(pv)}</b></div></div>`;
  }
  f.addEventListener('input', paint);
  f.addEventListener('click', (e) => { const b = e.target.closest('.chips button'); if (!b) return; const grp = b.parentElement; $$('button', grp).forEach((x) => x.setAttribute('aria-pressed', x === b)); if (grp.hasAttribute('data-gift-design')) st.design = b.dataset.v; else st.plan = b.dataset.v; paint(); });
  // La tarjeta se inclina con el cursor
  card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); card.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`); card.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`); });
  card.addEventListener('pointerleave', () => { card.style.removeProperty('--ry'); card.style.removeProperty('--rx'); });
  paint();
})();

/* ───────────── Cómo llegar ───────────── */
(function road() {
  const svg = $('[data-road]');
  const X = (lng) => (lng + 72.45) * 660 + 10, Y = (lat) => (-39.2 - lat) * 500 + 20;
  const T = { pan: [-39.64, -72.33], con: [-39.57, -72.02], liq: [-39.73, -71.85], ter: [-39.79, -71.78], lic: [-39.49, -72.15], puc: [-39.27, -71.97] };
  const [px, py] = [X(T.pan[1]), Y(T.pan[0])], [cx, cy] = [X(T.con[1]), Y(T.con[0])], [lx, ly] = [X(T.liq[1]), Y(T.liq[0])], [tx, ty] = [X(T.ter[1]), Y(T.ter[0])];
  const vol = (lat, lng, n) => { const x = X(lng), y = Y(lat); return `<path class="vol" d="M${x - 16} ${y + 12} L${x} ${y - 14} L${x + 16} ${y + 12}" /><path d="M${x - 6} ${y - 4} L${x} ${y - 14} L${x + 6} ${y - 4} Z" fill="#eef1ec" opacity=".7" /><text x="${x + 20}" y="${y + 4}" opacity=".6">${n}</text>`; };
  svg.innerHTML = `<ellipse class="lake" cx="${X(-72.12)}" cy="${Y(-39.53)}" rx="78" ry="16" transform="rotate(-8 ${X(-72.12)} ${Y(-39.53)})" /><text x="${X(-72.2)}" y="${Y(-39.53) + 5}" opacity=".5">Calafquén</text>
    <ellipse class="lake" cx="${X(-72.2)}" cy="${Y(-39.72)}" rx="70" ry="16" transform="rotate(24 ${X(-72.2)} ${Y(-39.72)})" /><text x="${X(-72.28)}" y="${Y(-39.76)}" opacity=".5">Panguipulli</text>
    ${vol(-39.42, -71.93, 'V. Villarrica')}${vol(-39.93, -72.03, 'V. Mocho-Choshuenco')}
    <path class="rt" pathLength="1" d="M${px} ${py} C${px + 60} ${py - 40} ${cx - 70} ${cy + 14} ${cx} ${cy} C${cx + 40} ${cy + 20} ${lx - 40} ${ly - 30} ${lx} ${ly}" />
    <path class="rt ripio" d="M${lx} ${ly} L${tx} ${ty}" />
    <circle class="town" cx="${px}" cy="${py}" r="4" /><text x="${px - 8}" y="${py + 22}">Panguipulli</text>
    <circle class="town" cx="${cx}" cy="${cy}" r="4" /><text x="${cx - 30}" y="${cy - 12}">Coñaripe</text>
    <circle class="town" cx="${lx}" cy="${ly}" r="4" /><text x="${lx - 66}" y="${ly + 4}">Liquiñe</text>
    <circle class="town" cx="${X(T.puc[1])}" cy="${Y(T.puc[0])}" r="3" opacity=".6" /><text x="${X(T.puc[1]) + 8}" y="${Y(T.puc[0]) + 4}" opacity=".6">Pucón ↑</text>
    <circle class="dest" cx="${tx}" cy="${ty}" r="8" /><text x="${tx - 30}" y="${ty + 28}" style="fill:var(--amber)">Rayenko</text>`;
  const winter = [5, 6, 7, 8].includes(M), air = window.__air ?? AIR[M];
  const s = winter ? (air <= 1 ? ['#d9673c', 'Hoy: nieve en el último tramo', 'Lleve cadenas. Vialidad puede exigirlas desde Coñaripe.'] : ['#e8a35a', 'Temporada de invierno', 'Revise el estado del camino antes de salir; pueden exigirse cadenas.']) : ['#8ec9c0', 'Camino despejado', `Ruta pavimentada hasta Liquiñe y 18 km de ripio en buen estado. Aire hoy: ${air} °C.`];
  $('[data-road-status]').innerHTML = `<i style="--sc:${s[0]}"></i><b>${s[1]}</b><span>${s[2]}</span>`;
  const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { $('.road').classList.add('in'); o.disconnect(); } }, { threshold: 0.4 });
  o.observe(svg);
})();

/* Visor de fotografías */
const viewer = $('[data-viewer]');
document.addEventListener('click', async (e) => {
  const z = e.target.closest('[data-zoom]'); if (!z) return;
  const url = await firstUrl(z.dataset.zoom); if (!url) return;
  $('[data-viewer-img]').style.backgroundImage = `url('${url}')`;
  $('[data-viewer-cap]').textContent = z.querySelector('figcaption b')?.textContent || z.getAttribute('aria-label') || '';
  viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden', 'false');
});
const closeV = () => { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden', 'true'); };
$('[data-viewer-close]').addEventListener('click', closeV);
viewer.addEventListener('click', (e) => { if (e.target === viewer) closeV(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeV(); });

/* Sonido y año */
const sb = $('[data-sound]');
sb.addEventListener('click', () => { const on = toggleSound(); sb.setAttribute('aria-pressed', on); sb.textContent = `Sonido de la quebrada: ${on ? 'encendido' : 'apagado'}`; });
$('[data-yr]').textContent = P.year;
watch();

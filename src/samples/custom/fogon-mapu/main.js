// Fogón Mapu · comportamiento a medida
import '../panels.js';
import './style.css';
import { initBook } from './book.js';
import { initPlan } from './plan.js';
import { initMerken } from './merken.js';
import { initSound } from './sound.js';
import { initGift } from './gift.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
export const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

/* ───────────── Hora de Temuco ───────────── */
function chileNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), h: +p.hour + +p.minute / 60 };
}
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const LUNCH = [2, 3, 4, 5], DINNER = [4, 5, 6];

/* ───────────── Pantalla de carga: el fogón sube a 800 °C ───────────── */
const loader = $('.loader');
const sc = $('.loader__sparks'), sctx = sc.getContext('2d');
const labels = ['Encendiendo el fogón', 'Avivando las brasas', 'Calentando las piedras', 'La mesa está servida'];
const minTime = reduced ? 0 : 2400;
const t0 = performance.now();
let sparks = [];
function sizeLoader() { sc.width = innerWidth; sc.height = innerHeight; }
sizeLoader();
function loaderFrame(now) {
  if (document.body.classList.contains('is-ready')) return;
  const k = Math.min(1, (now - t0) / Math.max(1, minTime));
  $('[data-load-n]').textContent = Math.round(20 + 780 * (1 - (1 - k) ** 2));
  $('[data-load-label]').textContent = labels[Math.min(labels.length - 1, Math.floor(k * labels.length))];
  sctx.clearRect(0, 0, sc.width, sc.height);
  for (let i = 0; i < 3 + k * 6; i++) sparks.push({ x: sc.width / 2 + (Math.random() - 0.5) * 160, y: sc.height * 0.62, vx: (Math.random() - 0.5) * 1.4, vy: -1.5 - Math.random() * 3.5, life: 1 });
  sctx.globalCompositeOperation = 'lighter';
  sparks = sparks.filter((p) => (p.life -= 0.012) > 0);
  for (const p of sparks) {
    p.x += p.vx + Math.sin(p.y * 0.02) * 0.6; p.y += p.vy;
    sctx.fillStyle = `rgba(255,${120 + p.life * 100},40,${p.life})`;
    sctx.fillRect(p.x, p.y, 2, 2);
  }
  sctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(loaderFrame);
}
requestAnimationFrame(loaderFrame);
const ready = () => setTimeout(() => document.body.classList.add('is-ready'), Math.max(0, minTime - (performance.now() - t0)));
if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
setTimeout(() => document.body.classList.add('is-ready'), 6000);

/* ───────────── Título que se enciende ───────────── */
const title = $('[data-fire-title]');
title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
let k = 0;
const wrapChars = (node) => {
  [...node.childNodes].forEach((c) => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach((word) => {
        if (!word) return;
        if (/^\s+$/.test(word)) { frag.append(' '); return; }
        const w = document.createElement('span');
        w.className = 'word';
        w.setAttribute('aria-hidden', 'true');
        [...word].forEach((ch) => {
          const s = document.createElement('span');
          s.className = 'ch';
          s.textContent = ch;
          s.style.animationDelay = `${0.2 + k++ * 0.05}s`;
          w.append(s);
        });
        frag.append(w);
      });
      c.replaceWith(frag);
    } else if (c.nodeName === 'EM') wrapChars(c);
  });
};
wrapChars(title);
const chars = $$('.ch', title);

/* ───────────── Brasas que suben (reaccionan al cursor) ───────────── */
const cv = $('.embers'), ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1, embers = [], running = true;
const cursor = { x: -999, y: -999, vx: 0, vy: 0, on: false };
function seed() {
  DPR = Math.min(devicePixelRatio || 1, 1.5);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const n = Math.min(120, Math.round((W * H) / 14000));
  embers = Array.from({ length: n }, () => spawn(true));
}
function spawn(any) {
  return { x: Math.random() * W, y: any ? Math.random() * H : H + 10, vx: 0, vy: -(0.3 + Math.random() * 0.9), r: 0.6 + Math.random() * 1.8, life: 0.5 + Math.random() * 0.5, ph: Math.random() * 6.3, hot: Math.random() };
}
function frame(time) {
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  const heroOn = scrollY < innerHeight * 1.2;
  for (const e of embers) {
    e.vx += Math.sin(time * 0.0008 + e.ph) * 0.012;
    if (cursor.on) {
      const dx = e.x - cursor.x, dy = e.y - cursor.y, d2 = dx * dx + dy * dy;
      if (d2 < 140 * 140) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / 140);
        // El cursor es aire: empuja las brasas y las arrastra con su movimiento
        e.vx += (dx / d) * f * 0.5 + cursor.vx * f * 0.08;
        e.vy += (dy / d) * f * 0.5 + cursor.vy * f * 0.08;
        e.hot = Math.min(1, e.hot + 0.05);
      }
    }
    e.vx *= 0.96; e.vy = e.vy * 0.96 - 0.025;
    e.x += e.vx; e.y += e.vy;
    e.life -= 0.0016;
    if (e.y < -20 || e.life <= 0 || e.x < -40 || e.x > W + 40) Object.assign(e, spawn(false));
    const a = Math.min(1, e.life * 1.6) * (heroOn ? 1 : 0.55) * (0.6 + 0.4 * Math.sin(time * 0.006 + e.ph));
    const g = 120 + e.hot * 110;
    ctx.fillStyle = `rgba(255,${g},${40 + e.hot * 60},${a * 0.18})`;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 4, 0, 6.3); ctx.fill();
    ctx.fillStyle = `rgba(255,${g + 30},${80 + e.hot * 80},${a})`;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.3); ctx.fill();
    e.hot *= 0.995;
  }
  ctx.globalCompositeOperation = 'source-over';
  cursor.vx *= 0.8; cursor.vy *= 0.8;
}
function loop(t) { if (!running) return; frame(t); requestAnimationFrame(loop); }
seed();
addEventListener('resize', () => { seed(); sizeLoader(); });
document.addEventListener('visibilitychange', () => { running = !document.hidden && !reduced; if (running) requestAnimationFrame(loop); });
if (!reduced) requestAnimationFrame(loop);

// Antorcha en el hero y letras que se encienden al pasar
const hero = $('[data-hero]');
let lastHot = 0;
addEventListener('pointermove', (e) => {
  cursor.vx = e.clientX - cursor.x; cursor.vy = e.clientY - cursor.y;
  cursor.x = e.clientX; cursor.y = e.clientY; cursor.on = e.pointerType === 'mouse';
  const r = hero.getBoundingClientRect();
  if (e.clientY < r.bottom) { hero.style.setProperty('--mx', `${e.clientX - r.left}px`); hero.style.setProperty('--my', `${e.clientY - r.top}px`); }
  const now = performance.now();
  if (now - lastHot > 40 && e.clientY < r.bottom && document.body.classList.contains('is-ready')) {
    lastHot = now;
    for (const c of chars) {
      const b = c.getBoundingClientRect();
      const d = Math.hypot(b.left + b.width / 2 - e.clientX, b.top + b.height / 2 - e.clientY);
      if (d < 70 && !c.classList.contains('is-hot')) { c.classList.add('is-hot'); setTimeout(() => c.classList.remove('is-hot'), 700); }
    }
  }
}, { passive: true });
document.addEventListener('pointerleave', () => (cursor.on = false));
addEventListener('pointerdown', (e) => {
  if (reduced || e.target.closest('a, button, input, select, label, svg, canvas, .book, .pit, .gift')) return;
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * 6.3, v = 1 + Math.random() * 4;
    embers.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, r: 0.6 + Math.random() * 1.6, life: 0.6, ph: a, hot: 1 });
  }
  if (embers.length > 260) embers.splice(0, embers.length - 260);
}, { passive: true });
// En pantallas táctiles la luz recorre sola la foto, como una llama que respira
if (!fine && !reduced) {
  const wander = (t) => {
    const r = hero.getBoundingClientRect();
    if (r.bottom > 0) {
      hero.style.setProperty('--mx', `${r.width * (0.5 + 0.32 * Math.sin(t * 0.0004))}px`);
      hero.style.setProperty('--my', `${r.height * (0.5 + 0.22 * Math.sin(t * 0.00063))}px`);
    }
    requestAnimationFrame(wander);
  };
  requestAnimationFrame(wander);
}
if (!reduced) {
  const breathe = (t) => { hero.style.setProperty('--r', `${250 + Math.sin(t * 0.004) * 12 + Math.sin(t * 0.011) * 8}px`); requestAnimationFrame(breathe); };
  requestAnimationFrame(breathe);
}

/* ───────────── Navegación ───────────── */
const nav = $('.nav');
addEventListener('scroll', () => nav.classList.toggle('is-solid', scrollY > 40), { passive: true });
const burger = $('.nav__burger'), menu = $('.menu');
burger.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
});
$$('a', menu).forEach((a) => a.addEventListener('click', () => { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }));

/* ───────────── Hoy en el fogón (horario real de Chile) ───────────── */
(function today() {
  const { dow, h } = chileNow();
  const fmt = (x) => `${String(Math.floor(x)).padStart(2, '0')}:${String(Math.round((x % 1) * 60)).padStart(2, '0')}`;
  const shifts = (d) => [...(LUNCH.includes(d) ? [[13, 16, 'Almuerzo']] : []), ...(DINNER.includes(d) ? [[19.5, 23.5, 'Cena']] : [])];
  const open = shifts(dow).find(([a, b]) => h >= a && h < b);
  let status, line;
  if (open) { status = 'Abierto ahora'; line = `${open[2]} hasta las ${fmt(open[1])}`; }
  else {
    const later = shifts(dow).find(([a]) => h < a);
    if (later) { status = `Abre hoy a las ${fmt(later[0])}`; line = later[2] === 'Cena' ? 'Menú degustación de 8 tiempos' : 'Carta de almuerzo'; }
    else {
      let d = 1; while (!shifts((dow + d) % 7).length) d++;
      const nd = (dow + d) % 7;
      status = !shifts(dow).length ? 'Hoy descansa el fuego' : 'Cerrado por hoy';
      line = `Abre ${d === 1 ? 'mañana' : 'el ' + DAYS[nd]} a las ${fmt(shifts(nd)[0][0])}`;
    }
  }
  $('[data-open-status]').textContent = status;
  $('[data-open-line]').textContent = line;
  $('[data-open-dot]').classList.toggle('is-open', !!open);
  const service = shifts(dow).length > 0;
  let pct = 0, txt;
  if (!service) txt = 'El rescoldo descansa. El martes a las 06:00 se enciende otra vez.';
  else if (h < 6) txt = 'A las 06:00 se enciende el fuego del cordero de hoy.';
  else if (h < 18) { const t = h - 6; pct = t / 12; txt = `El cordero de hoy lleva ${Math.floor(t)} h ${Math.round((t % 1) * 60)} min bajo la tierra. Sale a las 18:00.`; }
  else { pct = 1; const left = Math.max(2, 14 - Math.floor((h - 18) * 2.2)); txt = `El cordero de hoy ya salió del rescoldo: quedan ${left} porciones.`; }
  $('[data-lamb-text]').textContent = txt;
  requestAnimationFrame(() => ($('[data-lamb-bar]').style.width = `${pct * 100}%`));
})();

/* ───────────── Contadores ───────────── */
const countIO = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  countIO.unobserve(e.target);
  $$('[data-count]', e.target).forEach((el) => {
    const to = +el.dataset.count, suf = el.dataset.suffix || '', t1 = performance.now();
    const step = (now) => { const p = Math.min(1, (now - t1) / 1600); el.textContent = Math.round(to * (1 - (1 - p) ** 3)) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}), { threshold: 0.4 });
$$('.stats').forEach((s) => countIO.observe(s));

/* ───────────── Kultrún de temporadas ───────────── */
const SEASONS = [
  { k: 'Pewü · primavera', name: 'Pewü, <em>el brote</em>', months: 'septiembre a noviembre', items: [['🍄', 'Digüeñes', 'el hongo naranja que nace en el coigüe'], ['🌿', 'Nalca tierna', 'tallos crujientes, hojas para envolver'], ['🌱', 'Yuyo y cebollín', 'hierbas silvestres de la orilla del río'], ['🐑', 'Cordero lechal', 'de los crianceros de Malalcahuello']], dish: 'En la carta ahora: sopaipilla de zapallo con pebre de digüeñes.' },
  { k: 'Walung · verano', name: 'Walung, <em>la abundancia</em>', months: 'diciembre a febrero', items: [['🫐', 'Maqui', 'la baya morada más antioxidante del mundo'], ['🍓', 'Frutilla blanca', 'la frutilla chilena original, de Purén'], ['🐟', 'Trucha', 'de los lagos cordilleranos'], ['🌾', 'Quínoa fresca', 'cultivada en el valle de Cholchol']], dish: 'En la carta ahora: trucha en hoja de nalca con quínoa del valle.' },
  { k: 'Rimü · otoño', name: 'Rimü, <em>la cosecha</em>', months: 'marzo a mayo', items: [['🌰', 'Piñones', 'el ngülliw, alimento sagrado pewenche'], ['🍄', 'Changles', 'hongos de coral del bosque húmedo'], ['🔴', 'Murta', 'baya silvestre perfumada'], ['🥜', 'Avellana chilena', 'tostada en la brasa']], dish: 'En la carta ahora: crema de piñón con changles salteados.' },
  { k: 'Pukem · invierno', name: 'Pukem, <em>el resguardo</em>', months: 'junio a agosto', items: [['🌶', 'Merkén', 'ají ahumado tres días sobre roble'], ['🌊', 'Cochayuyo', 'alga del Lafkenmapu, secada al sol'], ['🥔', 'Papas nativas', 'variedades guardadas desde la cosecha'], ['🔥', 'Carnes al rescoldo', 'la cocina lenta del frío']], dish: 'En la carta ahora: cordero al rescoldo con puré de piñón.' },
];
const drum = $('[data-kultrun]');
let rot = 0, active = -1;
function setSeason(q) {
  if (q === active) return;
  active = q;
  const S = SEASONS[q];
  $('[data-season-k]').textContent = `${S.k} · ${S.months}`;
  $('[data-season-name]').innerHTML = S.name;
  $('[data-season-list]').innerHTML = S.items.map(([, n, d]) => `<li><i aria-hidden="true">✦</i><div><b>${n}</b> <span>· ${d}</span></div></li>`).join('');
  $('[data-season-dish]').textContent = S.dish;
  $$('.q', drum).forEach((g) => g.classList.toggle('is-on', +g.dataset.q === q));
}
const norm = (a) => ((a % 360) + 360) % 360;
const quadAtTop = () => Math.floor(norm(-rot) / 90) % 4;
function turnTo(q) {
  const target = -(45 + 90 * q);
  let d = norm(target - rot); if (d > 180) d -= 360;
  rot += d;
  drum.style.transform = `rotate(${rot}deg)`;
  setSeason(q);
}
const month = new Date().getMonth();
turnTo(month >= 8 && month <= 10 ? 0 : month === 11 || month <= 1 ? 1 : month <= 4 ? 2 : 3);
let drag = null;
const angle = (e) => { const r = drum.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
drum.addEventListener('pointerdown', (e) => { drag = { a: angle(e), r: rot, moved: false, q: e.target.closest('.q')?.dataset.q }; drum.setPointerCapture(e.pointerId); drum.classList.add('is-drag'); });
drum.addEventListener('pointermove', (e) => {
  if (!drag) return;
  let d = angle(e) - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360;
  if (Math.abs(d) > 3) drag.moved = true;
  rot = drag.r + d;
  drum.style.transform = `rotate(${rot}deg)`;
  setSeason(quadAtTop());
});
const endDrag = () => {
  if (!drag) return;
  drum.classList.remove('is-drag');
  turnTo(drag.moved || drag.q === undefined ? quadAtTop() : +drag.q);
  drag = null;
};
drum.addEventListener('pointerup', endDrag);
drum.addEventListener('pointercancel', endDrag);
$$('.q', drum).forEach((g) => g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turnTo(+g.dataset.q); } }));

/* ───────────── Viaje de 8 tiempos por el mapa ───────────── */
const steps = $$('.vstep');
const map = $('[data-map]');
const HOME = [160, 214];
const pts = steps.map((s) => [+s.dataset.x, +s.dataset.y]);
$('[data-pins]', map).innerHTML = pts.map(([x, y], i) => `<g class="pin" data-pin="${i}"><circle cx="${x}" cy="${y}" r="8" /><text x="${x}" y="${y}">${i + 1}</text></g>`).join('');
const pins = $$('.pin', map);
let kmShown = 0;
function showStep(i) {
  steps.forEach((s, j) => s.classList.toggle('is-on', j === i));
  pins.forEach((p, j) => { p.classList.toggle('is-on', j <= i); p.classList.toggle('is-now', j === i); });
  // La ruta sale de Temuco y va sumando cada origen
  const path = [HOME, ...pts.slice(0, i + 1)].map(([x, y], j) => `${j ? 'L' : 'M'}${x} ${y}`).join(' ');
  $('[data-route]', map).setAttribute('d', path);
  const km = steps.slice(0, i + 1).reduce((a, s) => a + +s.dataset.km, 0);
  const from = kmShown, t1 = performance.now();
  const tick = (now) => { const p = Math.min(1, (now - t1) / 700); kmShown = Math.round(from + (km - from) * p); $('[data-km-total]').textContent = kmShown; if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
const stepIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) showStep(steps.indexOf(e.target)); }), { rootMargin: '-45% 0px -50% 0px' });
steps.forEach((s) => stepIO.observe(s));
showStep(0);

/* ───────────── El rescoldo: doce horas en un reloj ───────────── */
const pit = $('[data-pit]'), range = $('[data-pit-range]');
const STAGES = [
  [0, 'Se enciende leña de hualle y roble caído dentro del hoyo de tierra.'],
  [0.8, 'Las piedras de río se calientan entre las llamas.'],
  [1.6, 'Las piedras llegan a 400 °C. Se retiran las llamas: queda solo el rescoldo.'],
  [2.4, 'El cordero, adobado con merkén y sal de mar, se envuelve en hojas de nalca y baja al hoyo.'],
  [3, 'Se cubre con tierra. Desde aquí, nadie lo toca: el calor de las piedras hace todo el trabajo.'],
  [6, 'El colágeno comienza a convertirse en gelatina y la carne se vuelve tierna.'],
  [9, 'Los jugos se concentran y la nalca le da un aroma verde y ahumado.'],
  [11.8, 'Se desentierra frente a la primera mesa de la noche. Huele a campo y a leña.'],
];
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(',')})`;
function setHour(t) {
  const hh = 6 + t;
  $('[data-pit-time]').textContent = `${String(Math.floor(hh)).padStart(2, '0')}:${String(Math.floor((hh % 1) * 60)).padStart(2, '0')}`;
  const stone = t < 1.6 ? 20 + 380 * (t / 1.6) : t < 2.4 ? 400 : 90 + 310 * Math.exp(-(t - 2.4) / 4);
  const meat = t < 2.4 ? null : 4 + 74 * (1 - Math.exp(-(t - 2.4) / 2.2));
  $('[data-pit-stone]').textContent = `${Math.round(stone)} °C`;
  $('[data-pit-stone-bar]').style.width = `${(stone / 400) * 100}%`;
  $('[data-pit-meat]').textContent = meat == null ? 'aún no entra' : `${Math.round(meat)} °C`;
  $('[data-pit-meat-bar]').style.width = `${meat == null ? 0 : (meat / 80) * 100}%`;
  $('[data-pit-stage]').textContent = ([...STAGES].reverse().find(([s]) => t >= s) || STAGES[0])[1];
  const heat = stone / 400;
  $$('[data-stones] circle', pit).forEach((c) => (c.style.fill = mix([74, 68, 64], [255, 110, 40], heat * 0.85)));
  $('[data-glow]', pit).setAttribute('opacity', (0.15 + heat * 0.85).toFixed(2));
  $('[data-fire]', pit).style.opacity = t < 1.6 ? 1 : Math.max(0, 1 - (t - 1.6) / 0.5);
  $('[data-lamb]', pit).setAttribute('opacity', Math.min(1, Math.max(0, (t - 2.3) / 0.4)).toFixed(2));
  $('[data-cover]', pit).setAttribute('opacity', t >= 3 && t < 11.8 ? 1 : 0);
  $('[data-steam]', pit).setAttribute('opacity', t >= 3 ? (t >= 11.8 ? 1 : 0.5) : 0);
  // El cielo pasa del amanecer al mediodía y al atardecer
  const day = Math.sin((t / 12) * Math.PI);
  $('[data-sky-a]', pit).setAttribute('stop-color', mix([42, 28, 58], [92, 150, 196], day));
  $('[data-sky-b]', pit).setAttribute('stop-color', mix([214, 116, 64], [190, 220, 236], day));
  const sun = $('[data-sun]', pit);
  sun.setAttribute('cx', lerp(60, 740, t / 12)); sun.setAttribute('cy', 140 - day * 110);
  range.value = t;
}
$('[data-cover]', pit).setAttribute('d', 'M244 150c30-30 282-30 312 0z');
let playing = null;
function play() {
  if (playing) { cancelAnimationFrame(playing); playing = null; $('[data-pit-play]').textContent = '▶'; return; }
  let t = +range.value >= 12 ? 0 : +range.value, last = performance.now();
  $('[data-pit-play]').textContent = '❚❚';
  const step = (now) => {
    t = Math.min(12, t + (Math.max(0, now - last) / 1000) * 1.3); last = Math.max(last, now);
    setHour(t);
    if (t < 12) playing = requestAnimationFrame(step); else { playing = null; $('[data-pit-play]').textContent = '↺'; }
  };
  playing = requestAnimationFrame(step);
}
$('[data-pit-play]').addEventListener('click', play);
range.addEventListener('input', () => { if (playing) play(); setHour(+range.value); });
setHour(0);
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); if (!reduced) setTimeout(play, 500); } }, { threshold: 0.5 }).observe(pit);

/* ───────────── Carta en libro y plano del salón ───────────── */
initBook();
initPlan();
initMerken({ reduced });
initSound();
initGift();

/* ───────────── Maridaje sugerido ───────────── */
$('[data-pairing]').addEventListener('change', (e) => $('.viaje').classList.toggle('is-pairing', e.target.checked));

/* ───────────── Agenda junto al fuego (fechas calculadas) ───────────── */
(function agenda() {
  const ARTISTS = ['Dúo Wenu · trutruka y guitarra', 'Elisa Painemal · cantos del sur', 'Kalfu Ñi Ül · folk mapuche', 'Trío Lafken · cuerdas y kultrún'];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const nth = (y, m, n) => { const d = new Date(y, m, 1); while (d.getDay() !== 6) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return d; };
  const ev = [];
  for (let i = 0; i < 70; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    if (d.getDay() === 5) {
      const wk = Math.floor(d.getTime() / 6048e5);
      ev.push({ d, kind: 'Música en vivo', time: '21:00', title: ARTISTS[wk % ARTISTS.length], text: 'Concierto acústico junto al fogón durante la cena. Sin costo adicional con su reserva.', seats: null });
    }
  }
  for (let m = 0; m < 3; m++) {
    const y = today.getFullYear(), mo = today.getMonth() + m;
    ev.push({ d: nth(y, mo, 1), kind: 'Trawün del mes', time: '20:00', title: 'La mesa larga a ciegas', text: 'Veinticuatro desconocidos, una mesa y ocho tiempos sorpresa que la chef decide esa misma mañana. $65.000 por persona.', seats: 24 });
    ev.push({ d: nth(y, mo, 2), kind: 'Taller', time: '11:00', title: 'Taller de merkén', text: 'Ahumado, tostado y molienda con la chef. Se lleva su frasco y la receta familiar. $25.000.', seats: 12 });
    ev.push({ d: nth(y, mo, 3), kind: 'Rescoldo abierto', time: '17:30', title: 'El desentierro del cordero', text: 'Vea cómo sale el cordero después de doce horas bajo tierra. Gratis con su reserva de cena.', seats: 30 });
  }
  const list = ev.filter((e) => e.d >= today).sort((a, b) => a.d - b.d).slice(0, 6);
  const h = (s) => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  $('[data-events]').innerHTML = list.map((e) => {
    const left = e.seats ? Math.max(2, Math.round(e.seats * (0.15 + (h(e.title + e.d.toDateString()) % 70) / 100))) : 0;
    const seats = e.seats ? `<span class="ev__seats${left <= 4 ? ' is-low' : ''}">Quedan <b>${left}</b> de ${e.seats} cupos</span>` : '<span class="ev__seats">Entrada liberada con reserva</span>';
    return `<li class="ev rv"><span class="ev__kind">${e.kind}</span><div class="ev__date"><b>${e.d.getDate()}</b><span><strong>${e.d.toLocaleDateString('es-CL', { weekday: 'long' })}</strong>${e.d.toLocaleDateString('es-CL', { month: 'long' })} · ${e.time}</span></div><div><h3>${e.title}</h3><p>${e.text}</p></div><footer>${seats}<button type="button" data-demo="En el sitio real, la inscripción a «${e.title}» llegaría al WhatsApp del restaurante con la fecha y los cupos.">${e.seats ? 'Reservar cupo' : 'Reservar mesa'}</button></footer></li>`;
  }).join('');
})();

/* ───────────── Fotos de los productores ───────────── */
$$('.farmer__img').forEach((f) => f.classList.toggle('has-photo', /\/img\/|unsplash/.test(f.getAttribute('style') || '')));

/* ───────────── Apariciones y aviso de muestra ───────────── */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));
const toast = $('.toast');
document.addEventListener('click', (e) => {
  const demo = e.target.closest('[data-demo]');
  if (!demo) return;
  e.preventDefault();
  $('[data-toast-text]').textContent = demo.dataset.demo || 'En el sitio real, la reserva llegaría al WhatsApp del restaurante con la mesa, la hora, la experiencia y el total. Esta es una muestra de concepto diseñada por Red Vaeru.';
  $('[data-toast-wa]').href = `https://wa.me/56952289117?text=${encodeURIComponent('Hola, vi la muestra "Fogón Mapu" en el sitio de Red Vaeru y quiero algo así para mi restaurante.')}`;
  toast.classList.add('is-in');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toast.classList.remove('is-in'), 9000);
});
$('[data-toast-close]').addEventListener('click', () => toast.classList.remove('is-in'));
$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

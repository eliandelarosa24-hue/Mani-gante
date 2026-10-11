// Domos Cielo Austral · comportamiento a medida
import './style.css';
import { initTrace } from './trace.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const LAT = -39.35, LNG = -71.6, TZ = 'America/Santiago';

/* ───────────── Astronomía (cálculos reales, sin servicios externos) ───────────── */
const SYN = 29.530588853;
const REF_NEW = Date.UTC(2000, 0, 6, 18, 14) / 864e5;
const moonAge = (d) => ((((d.getTime() / 864e5) - REF_NEW) % SYN) + SYN) % SYN;
const moonIllum = (d) => (1 - Math.cos((2 * Math.PI * moonAge(d)) / SYN)) / 2;
const PHASES = ['Luna nueva', 'Luna creciente', 'Cuarto creciente', 'Gibosa creciente', 'Luna llena', 'Gibosa menguante', 'Cuarto menguante', 'Luna menguante'];
const phaseName = (d) => PHASES[Math.round((moonAge(d) / SYN) * 8) % 8];
const nextNewMoon = (from, k = 0) => new Date(from.getTime() + ((SYN - moonAge(from)) + k * SYN) * 864e5);

// Sombra de la luna vista desde el hemisferio sur (la creciente se ilumina por la izquierda)
function paintMoon(el, d) {
  const f = moonAge(d) / SYN;
  const x = f < 0.5 ? f * 200 : -(1 - f) * 200;
  $('i', el).style.transform = `translateX(${x}%)`;
}

// Puesta de sol y fin del crepúsculo astronómico (ecuación del amanecer)
function sunEvent(day, altitude) {
  const rad = Math.PI / 180;
  const jd = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 16) / 864e5 + 2440587.5;
  const lw = -LNG;
  const n = Math.round(jd - 2451545.0009 - lw / 360);
  const Js = 2451545.0009 + lw / 360 + n;
  const M = (357.5291 + 0.98560028 * (Js - 2451545)) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const lam = (M + 102.9372 + C + 180) % 360;
  const dec = Math.asin(Math.sin(lam * rad) * Math.sin(23.45 * rad));
  const cosH = (Math.sin(altitude * rad) - Math.sin(LAT * rad) * Math.sin(dec)) / (Math.cos(LAT * rad) * Math.cos(dec));
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) / rad;
  const J = 2451545.0009 + (H + lw) / 360 + n + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * lam * rad);
  return new Date((J - 2440587.5) * 864e5);
}
const hhmm = (d) => d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: TZ });
const quality = (illum) => (illum < 0.25 ? ['Excelente', 96] : illum < 0.5 ? ['Muy buena', 78] : illum < 0.8 ? ['Buena', 58] : ['Luna brillante', 34]);

/* ───────────── Pantalla de carga ───────────── */
const loader = $('.loader');
const labels = ['Alineando el telescopio', 'Calibrando la montura', 'Buscando la Cruz del Sur', 'Abriendo el techo del domo'];
let pct = 0;
const minTime = reduced ? 0 : 2200;
const t0 = performance.now();
const tick = setInterval(() => {
  const elapsed = performance.now() - t0;
  pct = Math.min(99, Math.round((elapsed / minTime) * 100));
  $('[data-load-n]').textContent = pct;
  $('[data-load-label]').textContent = labels[Math.min(labels.length - 1, Math.floor(pct / 25))];
}, 60);
const ready = Promise.all([document.fonts?.ready, new Promise((r) => setTimeout(r, minTime))]);
ready.then(() => {
  clearInterval(tick);
  $('[data-load-n]').textContent = 100;
  setTimeout(() => {
    loader.classList.add('is-done');
    document.body.classList.add('is-ready');
    setTimeout(() => loader.remove(), 1300);
  }, 250);
});

/* ───────────── Título: letras que aparecen como estrellas ───────────── */
const title = $('[data-stars-title]');
let k = 0;
const wrapChars = (node) => {
  [...node.childNodes].forEach((c) => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      // Cada palabra va en un bloque que no se corta, así el título nunca se parte a mitad de palabra.
      c.textContent.split(/(\s+)/).forEach((word) => {
        if (!word) return;
        if (/^\s+$/.test(word)) { frag.append(' '); return; }
        const w = document.createElement('span');
        w.className = 'word';
        [...word].forEach((ch) => {
          const s = document.createElement('span');
          s.className = 'ch';
          s.textContent = ch;
          s.style.animationDelay = `${0.15 + (k++ % 23) * 0.045 + Math.random() * 0.25}s`;
          w.append(s);
        });
        frag.append(w);
      });
      c.replaceWith(frag);
    } else if (c.nodeName === 'EM') wrapChars(c);
  });
};
title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
wrapChars(title);
// El degradado del <em> se reparte letra por letra (background-clip no atraviesa los spans inline-block).
const emChars = $$('em .ch', title);
emChars.forEach((c, i) => (c.style.backgroundPosition = `${(i / Math.max(1, emChars.length - 1)) * 100}% 0`));

/* ───────────── Cielo vivo en canvas ───────────── */
const sky = $('.sky');
const ctx = sky.getContext('2d');
let W = 0, H = 0, DPR = 1, stars = [], band = [], shooting = null, mouse = { x: 0, y: 0, tx: 0, ty: 0 }, running = true, waves = [];
const cursor = { x: -999, y: -999, on: false };
function seedSky() {
  DPR = Math.min(devicePixelRatio || 1, 1.5);
  W = innerWidth; H = innerHeight;
  sky.width = W * DPR; sky.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const count = Math.min(900, Math.round((W * H) / 2300));
  stars = Array.from({ length: count }, () => {
    const z = Math.random();
    return { x: Math.random() * W, y: Math.random() * H, ox: 0, oy: 0, vx: 0, vy: 0, r: 0.3 + z * 1.3, z, a: 0.35 + Math.random() * 0.65, p: Math.random() * Math.PI * 2, s: 0.4 + Math.random() * 1.6, hue: Math.random() < 0.12 ? (Math.random() < 0.5 ? '200,220,255' : '255,214,170') : '255,255,255' };
  });
  // Banda de la Vía Láctea: estrellas tenues a lo largo de una diagonal
  band = Array.from({ length: Math.round(count * 0.9) }, () => {
    const t = Math.random();
    const off = (Math.random() + Math.random() + Math.random() - 1.5) * H * 0.16;
    return { x: t * W * 1.3 - W * 0.15, y: H * 0.95 - t * H * 0.9 + off, r: Math.random() * 0.7, a: 0.08 + Math.random() * 0.3 };
  });
}
function drawSky(time) {
  ctx.clearRect(0, 0, W, H);
  mouse.x += (mouse.tx - mouse.x) * 0.04;
  mouse.y += (mouse.ty - mouse.y) * 0.04;
  const scrollShift = scrollY * 0.04;
  for (const b of band) {
    ctx.fillStyle = `rgba(210,200,255,${b.a})`;
    ctx.fillRect(b.x + mouse.x * 6, ((b.y - scrollShift * 0.5) % H + H) % H, b.r, b.r);
  }
  const near = [];
  for (const s of stars) {
    const tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(time * 0.001 * s.s + s.p);
    const bx = s.x + mouse.x * (6 + s.z * 22);
    const by = ((s.y + mouse.y * (6 + s.z * 22) - scrollShift * (0.4 + s.z)) % H + H) % H;
    // Las estrellas se apartan del cursor como polvo estelar y vuelven a su lugar con un resorte suave.
    if (cursor.on && !reduced) {
      const dx = bx + s.ox - cursor.x, dy = by + s.oy - cursor.y, d2 = dx * dx + dy * dy;
      if (d2 < 150 * 150) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / 150) * (2.2 + s.z * 3);
        s.vx += (dx / d) * f; s.vy += (dy / d) * f;
        if (s.r > 0.9 && d < 170) near.push([bx + s.ox, by + s.oy, d]);
      }
    }
    s.vx = (s.vx - s.ox * 0.035) * 0.86; s.vy = (s.vy - s.oy * 0.035) * 0.86;
    s.ox += s.vx; s.oy += s.vy;
    const x = bx + s.ox, y = by + s.oy;
    s.px = x; s.py = y;
    const lit = Math.min(1, Math.hypot(s.ox, s.oy) / 30);
    ctx.beginPath();
    ctx.fillStyle = `rgba(${s.hue},${s.a * tw})`;
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (s.r > 1.25 || lit > 0.2) { ctx.fillStyle = `rgba(${lit > 0.2 ? '185,162,255' : s.hue},${0.08 * tw + lit * 0.12})`; ctx.beginPath(); ctx.arc(x, y, s.r * (4 + lit * 1.5), 0, Math.PI * 2); ctx.fill(); }
  }
  // Hilos de constelación entre el cursor y las estrellas más cercanas
  if (near.length) {
    near.sort((a, b) => a[2] - b[2]);
    const pts = near.slice(0, 5);
    ctx.lineWidth = 0.8;
    pts.forEach(([x, y, d], i) => {
      ctx.strokeStyle = `rgba(185,162,255,${0.5 * (1 - d / 170)})`;
      ctx.beginPath(); ctx.moveTo(cursor.x, cursor.y); ctx.lineTo(x, y); ctx.stroke();
      if (i) { const [px, py] = pts[i - 1]; ctx.strokeStyle = `rgba(143,227,255,${0.22 * (1 - d / 170)})`; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke(); }
    });
    ctx.fillStyle = 'rgba(233,236,247,.9)'; ctx.beginPath(); ctx.arc(cursor.x, cursor.y, 1.6, 0, Math.PI * 2); ctx.fill();
  }
  // Ondas de choque al hacer clic
  waves = waves.filter((w) => w.r < 420);
  for (const w of waves) {
    w.r += 9;
    ctx.strokeStyle = `rgba(185,162,255,${0.35 * (1 - w.r / 420)})`; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.stroke();
  }
  // Estrella fugaz ocasional
  if (!reduced) {
    if (!shooting && Math.random() < 0.004) shooting = { x: Math.random() * W * 0.8 + W * 0.2, y: Math.random() * H * 0.4, life: 0 };
    if (shooting) {
      const l = shooting.life++;
      const len = 120, sx = shooting.x - l * 9, sy = shooting.y + l * 4.5;
      const g = ctx.createLinearGradient(sx, sy, sx + len, sy - len / 2);
      g.addColorStop(0, `rgba(255,255,255,${Math.max(0, 1 - l / 45)})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + len, sy - len / 2); ctx.stroke();
      if (l > 45) shooting = null;
    }
  }
}
function loop(t) { if (!running) return; drawSky(t); requestAnimationFrame(loop); }
seedSky();
addEventListener('resize', () => { seedSky(); if (reduced) drawSky(0); });
addEventListener('pointermove', (e) => {
  mouse.tx = e.clientX / W - 0.5; mouse.ty = e.clientY / H - 0.5;
  cursor.x = e.clientX; cursor.y = e.clientY; cursor.on = e.pointerType === 'mouse';
}, { passive: true });
document.addEventListener('pointerleave', () => (cursor.on = false));
// Un clic en el cielo (fuera de botones y formularios) dispara una onda y una estrella fugaz.
addEventListener('pointerdown', (e) => {
  if (reduced || e.target.closest('a, button, input, select, textarea, label, canvas[data-trace-canvas], .tonight, .lightbox')) return;
  waves.push({ x: e.clientX, y: e.clientY, r: 0 });
  for (const s of stars) {
    const dx = (s.px ?? s.x) - e.clientX, dy = (s.py ?? s.y) - e.clientY, d = Math.hypot(dx, dy);
    if (d < 260) { s.vx += (dx / (d || 1)) * (260 - d) * 0.09; s.vy += (dy / (d || 1)) * (260 - d) * 0.09; }
  }
  if (!shooting) shooting = { x: e.clientX + 120, y: e.clientY - 60, life: 0 };
}, { passive: true });
document.addEventListener('visibilitychange', () => { running = !document.hidden && !reduced; if (running) requestAnimationFrame(loop); });
if (reduced) drawSky(0); else requestAnimationFrame(loop);

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

/* ───────────── Panel "Esta noche" ───────────── */
const now = new Date();
const illum = moonIllum(now);
paintMoon($('[data-moon]'), now);
$('[data-moon-name]').textContent = phaseName(now);
$('[data-moon-illum]').textContent = `${Math.round(illum * 100)}% iluminada`;
$('[data-sunset]').textContent = hhmm(sunEvent(now, -0.833));
$('[data-dark]').textContent = hhmm(sunEvent(now, -18));
const [qName, qVal] = quality(illum);
$('[data-quality]').textContent = qName;
requestAnimationFrame(() => ($('[data-quality-bar]').style.width = qVal + '%'));
$('[data-moon-tip]').textContent = illum < 0.35 ? 'Cielo oscuro: la Vía Láctea será visible a simple vista.' : illum < 0.7 ? 'La luna se esconde de madrugada: observación ideal después de medianoche.' : 'Luna brillante: noche perfecta para ver sus cráteres en el telescopio.';
$('[data-next-new]').textContent = nextNewMoon(now).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });

/* ───────────── Comparador de contaminación lumínica ───────────── */
const bc = $('[data-bortle-canvas]');
const bctx = bc.getContext('2d');
const BORTLE = { 2: [4500, 'Cielo prístino de montaña'], 3: [3200, 'Cielo rural oscuro'], 4: [2000, 'Transición rural'], 5: [1200, 'Cielo suburbano'], 6: [800, 'Suburbio iluminado'], 7: [550, 'Transición urbana'], 8: [400, 'Ciudad'], 9: [300, 'Cielo de ciudad'] };
const bstars = Array.from({ length: 1400 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() ** 3 * 1.6 + 0.25, a: 0.4 + Math.random() * 0.6 }));
function drawBortle(v) {
  const size = bc.clientWidth * Math.min(devicePixelRatio || 1, 2);
  bc.width = bc.height = size;
  const [count, name] = BORTLE[v];
  const visible = Math.round((count / 4500) * bstars.length);
  bctx.fillStyle = `rgb(${2 + (v - 2) * 4},${3 + (v - 2) * 3},${10 + (v - 2) * 4})`;
  bctx.fillRect(0, 0, size, size);
  if (v <= 4) {
    const g = bctx.createLinearGradient(0, size, size, 0);
    g.addColorStop(0.3, 'rgba(0,0,0,0)'); g.addColorStop(0.5, `rgba(200,190,255,${0.16 - (v - 2) * 0.05})`); g.addColorStop(0.7, 'rgba(0,0,0,0)');
    bctx.fillStyle = g; bctx.fillRect(0, 0, size, size);
  }
  // las estrellas más tenues desaparecen primero
  [...bstars].sort((a, b) => b.r - a.r).slice(0, visible).forEach((s) => {
    bctx.beginPath(); bctx.fillStyle = `rgba(255,255,255,${s.a})`;
    bctx.arc(s.x * size, s.y * size, s.r * (size / 500), 0, Math.PI * 2); bctx.fill();
  });
  $('[data-bortle-n]').textContent = count.toLocaleString('es-CL');
  $('[data-bortle-name]').textContent = name;
  $('[data-bortle-glow]').style.opacity = ((v - 2) / 7).toFixed(2);
}
const bInput = $('[data-bortle]');
bInput.addEventListener('input', () => drawBortle(+bInput.value));
drawBortle(+bInput.value);
addEventListener('resize', () => drawBortle(+bInput.value));
// Al entrar en la sección, el control viaja solo de la ciudad al valle
new IntersectionObserver(([e], o) => {
  if (!e.isIntersecting || reduced) return;
  o.disconnect();
  let v = 9;
  const step = setInterval(() => { v -= 1; bInput.value = v; drawBortle(v); if (v <= 2) clearInterval(step); }, 260);
}, { threshold: 0.5 }).observe($('.bortle__view'));

/* ───────────── Constelaciones que se dibujan al hacer scroll ───────────── */
const C = {
  cruz: { label: 'Pünon Choike · Cruz del Sur', stars: [[200, 60, 6], [200, 330, 8], [95, 190, 6], [300, 170, 7], [245, 238, 3.5]], lines: [[0, 1], [2, 3]] },
  orion: { label: 'Las Tres Marías · Orión', stars: [[120, 70, 7], [290, 90, 5], [170, 200, 4], [205, 192, 4], [240, 184, 4], [110, 320, 6], [300, 330, 8]], lines: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]], red: [0] },
  escorpion: { label: 'Escorpión · Antares', stars: [[90, 70, 4], [120, 110, 4], [150, 150, 7], [175, 200, 4], [195, 250, 4], [230, 295, 4], [280, 315, 4], [320, 290, 4], [330, 245, 5], [60, 60, 3]], lines: [[9, 0], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]], red: [2] },
  wenu: { label: 'Wenu Leufü · el río del cielo', stars: [[70, 320, 3], [140, 250, 4], [200, 200, 6], [260, 150, 4], [330, 80, 3], [180, 120, 2.5], [250, 260, 2.5]], lines: [], band: true },
};
const art = $('.constel__art');
const svg = $('[data-constel-svg]');
function showConstel(key) {
  const c = C[key];
  art.classList.remove('is-on');
  svg.innerHTML = `<defs><linearGradient id="wenu" x1="0" y1="1" x2="1" y2="0"><stop offset=".15" stop-color="#b9a2ff" stop-opacity="0"/><stop offset=".5" stop-color="#d9ceff" stop-opacity=".45"/><stop offset=".85" stop-color="#8fe3ff" stop-opacity="0"/></linearGradient></defs>`
    + (c.band ? '<path class="band" d="M20 380 C120 280 200 220 380 20 L400 60 C220 250 140 320 60 400 Z"/>' : '')
    + c.lines.map(([a, b]) => `<line class="cl" x1="${c.stars[a][0]}" y1="${c.stars[a][1]}" x2="${c.stars[b][0]}" y2="${c.stars[b][1]}"/>`).join('')
    + c.stars.map(([x, y, r], i) => `<circle class="cs${c.red?.includes(i) ? ' red' : ''}" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${(i * 0.37) % 3}s"/>`).join('');
  $('[data-constel-label]').textContent = c.label;
  requestAnimationFrame(() => requestAnimationFrame(() => art.classList.add('is-on')));
}
const steps = $$('.cstep');
const stepIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    steps.forEach((s) => s.classList.toggle('is-active', s === e.target));
    showConstel(e.target.dataset.constel);
  });
}, { rootMargin: '-45% 0px -45% 0px' });
steps.forEach((s) => stepIO.observe(s));
showConstel('cruz');

initTrace({ reduced });

/* ───────────── Calendario cósmico (calculado) ───────────── */
const SHOWERS = [
  { m: 1, d: 8, name: 'Alfa Centáuridas', note: 'Lluvia exclusiva del hemisferio sur, con bólidos brillantes.', kind: 'Lluvia de estrellas' },
  { m: 4, d: 6, name: 'Eta Acuáridas', note: 'Restos del cometa Halley. Excelente desde el sur, antes del amanecer.', kind: 'Lluvia de estrellas' },
  { m: 6, d: 30, name: 'Delta Acuáridas del Sur', note: 'Hasta 25 meteoros por hora en noches de invierno.', kind: 'Lluvia de estrellas' },
  { m: 9, d: 21, name: 'Oriónidas', note: 'También del cometa Halley: rápidas y con estelas.', kind: 'Lluvia de estrellas' },
  { m: 11, d: 14, name: 'Gemínidas', note: 'La lluvia más intensa del año, hasta 120 meteoros por hora.', kind: 'Lluvia de estrellas' },
];
const events = [];
for (let i = 0; i < 4; i++) {
  const d = nextNewMoon(now, i);
  events.push({ date: d, name: 'Luna nueva', note: 'La noche más oscura del mes: Vía Láctea en todo su esplendor.', kind: 'Cielo oscuro', c: 'rgba(185,162,255,.3)' });
}
SHOWERS.forEach((s) => {
  let d = new Date(now.getFullYear(), s.m, s.d);
  if (d < now) d = new Date(now.getFullYear() + 1, s.m, s.d);
  const il = Math.round(moonIllum(d) * 100);
  events.push({ date: d, name: s.name, note: `${s.note} Luna al ${il}% esa noche.`, kind: s.kind, c: 'rgba(143,227,255,.3)' });
});
events.sort((a, b) => a.date - b.date);
$('[data-cosmic]').innerHTML = events.slice(0, 8).map((e) => `<li class="rv" style="--c:${e.c}"><span class="kind">${e.kind}</span><time>${e.date.toLocaleDateString('es-CL', { day: 'numeric' })}<small>${e.date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</small></time><h3>${e.name}</h3><p>${e.note}</p></li>`).join('');

/* ───────────── Reserva con pronóstico del cielo ───────────── */
const form = $('[data-book]');
const iso = (d) => d.toISOString().slice(0, 10);
form.checkin.min = iso(now);
form.checkin.value = iso(new Date(now.getTime() + 14 * 864e5));
function updateBook() {
  const opt = form.dome.selectedOptions[0];
  const price = +opt.dataset.price, cap = +opt.dataset.cap;
  const nights = +form.nights.value, guests = +form.guests.value;
  let extras = 0;
  $$('input[type=checkbox]', form).forEach((c) => { if (c.checked) extras += +c.dataset.price * (c.dataset.per === 'guest' ? guests : nights); });
  const base = price * nights;
  $('[data-s-label]').textContent = `${nights} noche${nights > 1 ? 's' : ''} × ${clp(price)}`;
  $('[data-s-base]').textContent = clp(base);
  $('[data-s-extras]').textContent = clp(extras);
  $('[data-s-total]').textContent = clp(base + extras + 10000);
  $('[data-s-warn]').textContent = guests > cap ? `Este domo recibe hasta ${cap} personas. Le sugerimos el Domo Cruz del Sur.` : '';
  const night = new Date(form.checkin.value + 'T23:00:00');
  if (!isNaN(night)) {
    const il = moonIllum(night);
    paintMoon($('[data-f-moon]'), night);
    $('[data-f-phase]').textContent = phaseName(night);
    $('[data-f-quality]').textContent = `${Math.round(il * 100)}% de luna · cielo ${quality(il)[0].toLowerCase()}`;
    const nn = nextNewMoon(night);
    const prev = new Date(nn.getTime() - SYN * 864e5);
    const best = Math.abs(prev - night) < Math.abs(nn - night) && prev > now ? prev : nn;
    $('[data-f-tip]').textContent = il > 0.5 ? `¿Busca la Vía Láctea? La noche más oscura cercana es el ${best.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}.` : 'Excelente elección: noche oscura, ideal para la Vía Láctea.';
  }
}
form.addEventListener('input', updateBook);
form.addEventListener('change', updateBook);
$$('[data-pick]').forEach((a) => a.addEventListener('click', () => { form.dome.selectedIndex = +a.dataset.pick; updateBook(); }));
updateBook();

/* ───────────── Galería ───────────── */
const lb = $('.lightbox');
const shots = $$('.mosaic button');
let cur = 0;
const openShot = (i) => {
  cur = (i + shots.length) % shots.length;
  $('.lightbox__img', lb).style.cssText = $('span', shots[cur]).style.cssText;
  $('p', lb).textContent = shots[cur].getAttribute('aria-label');
  lb.classList.add('is-open');
};
shots.forEach((b, i) => b.addEventListener('click', () => openShot(i)));
$('.lb-close', lb).addEventListener('click', () => lb.classList.remove('is-open'));
$('.lb-prev', lb).addEventListener('click', () => openShot(cur - 1));
$('.lb-next', lb).addEventListener('click', () => openShot(cur + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('is-open'); });
addEventListener('keydown', (e) => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') lb.classList.remove('is-open');
  if (e.key === 'ArrowRight') openShot(cur + 1);
  if (e.key === 'ArrowLeft') openShot(cur - 1);
});

/* ───────────── Apariciones y aviso de muestra ───────────── */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));
const toast = $('.toast');
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-demo]')) return;
  e.preventDefault();
  $('[data-toast-text]').textContent = 'En el sitio real, aquí se enviaría la reserva con su domo, fechas y total al WhatsApp del glamping. Esta es una muestra de concepto diseñada por Red Vaeru.';
  $('[data-toast-wa]').href = `https://wa.me/56952289117?text=${encodeURIComponent('Hola Jorge, vi la muestra "Domos Cielo Austral" en Red Vaeru y quiero un sitio así para mi negocio.')}`;
  toast.classList.add('is-in');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toast.classList.remove('is-in'), 9000);
});
$('[data-toast-close]').addEventListener('click', () => toast.classList.remove('is-in'));
$$('[data-year]').forEach((e) => (e.textContent = now.getFullYear()));

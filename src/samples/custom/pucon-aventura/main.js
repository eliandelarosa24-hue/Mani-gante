// Pucón Aventura · comportamiento a medida
import './style.css';
import { initRoute } from './route.js';
import { initQuiz, TOURS } from './quiz.js';
import { initPack } from './pack.js';
import { initWeek } from './week.js';
import { initCert } from './cert.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const DAY = 864e5;
const today = new Date(); today.setHours(0, 0, 0, 0);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/* ───────────── Pronóstico de montaña simulado (estable para cada fecha) ───────────── */
function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967295; }
export function weather(d) {
  const k = iso(d), m = d.getMonth();
  const warm = [11, 0, 1, 2].includes(m) ? 1 : [3, 9, 10].includes(m) ? 0.5 : 0;
  const cloud = hash(k + 'c') * (1.1 - warm * 0.45), wind = Math.round(8 + hash(k + 'w') ** 1.6 * 62);
  const temp = Math.round(-9 + warm * 9 + hash(k + 't') * 5);
  const state = wind > 55 || cloud > 0.82 ? 'no' : wind > 38 || cloud > 0.58 ? 'mid' : 'ok';
  const icon = cloud > 0.82 ? 'rain' : cloud > 0.58 ? 'cloud' : cloud > 0.32 ? 'part' : 'sun';
  const seats = Math.max(0, Math.round(hash(k + 's') * 12) - (d.getDay() === 6 ? 4 : 0));
  return { cloud, wind, temp, state, icon, seats, iso0: Math.round(2300 + warm * 900 + hash(k + 'i') * 400) };
}
const ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="#ffc65a" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
  part: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="3.5" stroke="#ffc65a"/><path d="M7 19h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6 1.6A3.2 3.2 0 0 0 7 19z" stroke="#dfe7ee" fill="#14181e"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="#c4ced8" stroke-width="1.8"><path d="M6 19h11a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.5 2A3.5 3.5 0 0 0 6 19z"/></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="#9fd8ea" stroke-width="1.8" stroke-linecap="round"><path d="M6 15h11a4 4 0 0 0 0-8 6 6 0 0 0-11.5 2A3 3 0 0 0 6 15z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/></svg>',
};

/* ───────────── Pantalla de carga: altímetro ───────────── */
const labels = ['Calibrando el altímetro', 'Leyendo el pronóstico de montaña', 'Ajustando crampones', 'Cumbre a la vista'];
const minTime = reduced ? 0 : 2300;
const t0 = performance.now();
(function load(now) {
  if (document.body.classList.contains('is-ready')) return;
  const k = Math.min(1, (now - t0) / Math.max(1, minTime));
  $('[data-load-n]').textContent = Math.round(230 + 2617 * (1 - (1 - k) ** 2.4)).toLocaleString('es-CL');
  $('[data-load-label]').textContent = labels[Math.min(3, Math.floor(k * 4))];
  $('[data-load-bar]').style.width = `${k * 100}%`;
  requestAnimationFrame(load);
})(t0);
const ready = () => setTimeout(() => document.body.classList.add('is-ready'), Math.max(0, minTime - (performance.now() - t0)));
if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
setTimeout(() => document.body.classList.add('is-ready'), 6000);

/* ───────────── Hero: estrellas, capas en paralaje y fumarola ───────────── */
const hero = $('[data-hero]');
$('[data-stars]').innerHTML = Array.from({ length: 140 }, () => `<circle cx="${(Math.random() * 1600).toFixed(0)}" cy="${(Math.random() * 420).toFixed(0)}" r="${(Math.random() ** 3 * 1.6 + 0.3).toFixed(2)}" opacity="${(0.25 + Math.random() * 0.7).toFixed(2)}"/>`).join('');
const layers = $$('[data-depth]', hero);
let wind = 0, windTarget = 0;
hero.addEventListener('pointermove', (e) => {
  const r = hero.getBoundingClientRect();
  const mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
  layers.forEach((l) => { const d = +l.dataset.depth; l.style.transform = `translate(${-mx * 40 * d}px, ${-my * 18 * d}px)`; });
  windTarget = mx * 2.4;
});
hero.addEventListener('pointerleave', () => { windTarget = 0; layers.forEach((l) => (l.style.transform = '')); });

const plume = $('[data-plume]'), pctx = plume.getContext('2d'), crater = $('[data-crater]');
let puffs = [], heroOn = true, PW = 0, PH = 0;
function sizePlume() { const r = hero.getBoundingClientRect(); PW = r.width; PH = r.height; const d = Math.min(devicePixelRatio || 1, 1.5); plume.width = PW * d; plume.height = PH * d; pctx.setTransform(d, 0, 0, d, 0, 0); }
sizePlume(); addEventListener('resize', sizePlume);
function craterPos() { const c = crater.getBoundingClientRect(), h = hero.getBoundingClientRect(); return [c.left - h.left, c.top - h.top]; }
function plumeFrame() {
  if (!heroOn) return;
  pctx.clearRect(0, 0, PW, PH);
  wind += (windTarget - wind) * 0.03;
  const [cx, cy] = craterPos();
  for (let k = 0; k < 2 && puffs.length < 160; k++) puffs.push({ x: cx + (Math.random() - 0.5) * 22, y: cy - 2, r: 5 + Math.random() * 7, vx: (Math.random() - 0.3) * 0.2, vy: -0.45 - Math.random() * 0.35, life: 1 });
  for (const p of puffs) {
    p.vx += (wind + 0.35) * 0.006; p.vy *= 0.997; p.x += p.vx; p.y += p.vy; p.r += 0.26; p.life -= 0.0075;
    const g = pctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0, `rgba(205,210,218,${0.16 * Math.max(0, p.life) ** 1.5})`); g.addColorStop(1, 'rgba(205,210,218,0)');
    pctx.fillStyle = g; pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, 6.283); pctx.fill();
  }
  // Brillo de lava dentro del cráter
  const glow = pctx.createRadialGradient(cx, cy + 4, 0, cx, cy + 4, 34);
  glow.addColorStop(0, `rgba(255,110,50,${0.55 + Math.sin(performance.now() * 0.004) * 0.15})`); glow.addColorStop(1, 'rgba(255,110,50,0)');
  pctx.fillStyle = glow; pctx.beginPath(); pctx.arc(cx, cy + 4, 34, 0, 6.283); pctx.fill();
  puffs = puffs.filter((p) => p.life > 0);
  requestAnimationFrame(plumeFrame);
}
new IntersectionObserver(([e]) => { const was = heroOn; heroOn = e.isIntersecting && !reduced; if (heroOn && !was) requestAnimationFrame(plumeFrame); }).observe(hero);
if (!reduced) requestAnimationFrame(plumeFrame);

// Estado del día en el panel del hero
(function status() {
  const w = weather(today);
  const yellow = hash(iso(today) + 'alert') > 0.85;
  $('[data-alert-light]').classList.toggle('is-y', yellow);
  $('[data-alert]').textContent = yellow ? 'Alerta amarilla' : 'Alerta verde';
  $('[data-alert-note]').textContent = yellow ? 'Ascenso solo hasta el glaciar' : 'Ascenso al cráter habilitado';
  $('[data-w-temp]').textContent = `${w.temp} °C`;
  $('[data-w-wind]').textContent = `${w.wind} km/h`;
  $('[data-w-iso]').textContent = `${w.iso0.toLocaleString('es-CL')} m`;
  let d = new Date(today.getTime() + DAY);
  for (let i = 0; i < 14 && weather(d).state === 'no'; i++) d = new Date(d.getTime() + DAY);
  $('[data-w-next]').textContent = `${d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' })} · 06:00`;
})();

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

/* ───────────── Ruta, test y mochila ───────────── */
initRoute({ reduced });
initQuiz({ onPick: pickTour });
initPack();

/* ───────────── Revisión de 10 puntos: se marcan uno a uno al aparecer ───────────── */
new IntersectionObserver(([e], o) => {
  if (!e.isIntersecting) return; o.disconnect();
  $$('[data-check] li').forEach((li, i) => setTimeout(() => li.classList.add('is-ok'), reduced ? 0 : 300 + i * 230));
}, { threshold: 0.4 }).observe($('[data-check]'));

/* ───────────── Tours: filtros, nivel e inclinación ───────────── */
$$('.tcard__lvl').forEach((l) => { const n = +l.dataset.lvl; l.insertAdjacentHTML('afterbegin', `<span class="bars" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}" style="height:${4 + i * 1.6}px"></i>`).join('')}</span>`); l.setAttribute('aria-label', `Dificultad ${n} de 5: ${l.textContent}`); });
$$('[data-f]').forEach((b) => b.addEventListener('click', () => {
  $$('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $$('.tcard').forEach((c) => c.classList.toggle('is-hidden', b.dataset.f !== 'all' && !c.dataset.tags.includes(b.dataset.f)));
}));
if (matchMedia('(pointer: fine)').matches && !reduced) {
  $$('.tcard').forEach((c) => {
    c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`; });
    c.addEventListener('pointerleave', () => (c.style.transform = ''));
  });
}
$$('[data-pick]').forEach((b) => b.addEventListener('click', () => pickTour(b.dataset.pick)));

/* ───────────── Sismógrafo ───────────── */
(function seismo() {
  const cv = $('[data-seis]'); if (!cv) return;
  const c = cv.getContext('2d');
  let W = 0, H = 0, data = [], vis = false, ev = 0;
  const size = () => { const r = cv.getBoundingClientRect(); const d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; c.setTransform(d, 0, 0, d, 0, 0); data = new Array(Math.ceil(W / 2)).fill(0); };
  size(); addEventListener('resize', size);
  function frame(t) {
    if (!vis) return;
    if (!ev && Math.random() < 0.006) ev = 90;
    for (let i = 0; i < 2; i++) {
      const base = (Math.random() - 0.5) * 0.12 + Math.sin(t * 0.01) * 0.04;
      const burst = ev ? Math.sin(ev * 0.7) * (ev / 90) * 0.75 * (0.6 + Math.random() * 0.4) : 0;
      if (ev) ev--;
      data.push(base + burst); data.shift();
    }
    c.clearRect(0, 0, W, H);
    c.strokeStyle = 'rgba(238,243,246,0.06)'; c.lineWidth = 1;
    for (let y = 0; y <= 4; y++) { c.beginPath(); c.moveTo(0, (H / 4) * y); c.lineTo(W, (H / 4) * y); c.stroke(); }
    c.strokeStyle = '#6be38c'; c.lineWidth = 1.4; c.beginPath();
    data.forEach((v, i) => { const x = i * 2, y = H / 2 - v * H * 0.45; i ? c.lineTo(x, y) : c.moveTo(x, y); });
    c.stroke();
    $('[data-seis-val]').textContent = `${(0.2 + Math.abs(data[data.length - 1]) * 3).toFixed(2)} µm/s · normal`;
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => { const was = vis; vis = e.isIntersecting && !reduced; if (vis && !was) requestAnimationFrame(frame); }).observe(cv);
})();

/* ───────────── Próximas salidas (14 días) ───────────── */
const form = $('[data-book]');
const daysBox = $('[data-days]');
const STATE = { ok: 'Volcán: sí', mid: 'Volcán: posible', no: 'Volcán: no' };
const days = Array.from({ length: 14 }, (_, i) => new Date(today.getTime() + (i + 1) * DAY));
daysBox.innerHTML = days.map((d) => {
  const w = weather(d);
  return `<button type="button" class="day" role="option" aria-selected="false" data-date="${iso(d)}" ${w.seats === 0 ? 'disabled' : ''}>
    <span class="day__tag ${w.state}" aria-hidden="true"></span>
    <span class="day__d">${d.toLocaleDateString('es-CL', { weekday: 'short', month: 'short' })}</span>
    <span class="day__n">${d.getDate()}</span>
    <span class="day__w">${ICONS[w.icon]} ${w.temp} °C · ${w.wind} km/h</span>
    <span class="day__s">${w.seats ? `${STATE[w.state]} · ${w.seats} cupos` : 'Sin cupos'}</span>
  </button>`;
}).join('');
daysBox.addEventListener('click', (e) => {
  const b = e.target.closest('.day'); if (!b || b.disabled) return;
  form.date.value = b.dataset.date;
  markDay(); update();
  setTimeout(() => $('#reservar').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }), 250);
});
function markDay() { $$('.day', daysBox).forEach((x) => x.setAttribute('aria-selected', String(x.dataset.date === form.date.value))); }

/* ───────────── Reserva ───────────── */
form.date.min = iso(new Date(today.getTime() + DAY));
form.date.value = iso(days.find((d) => weather(d).state === 'ok' && weather(d).seats) || days[0]);
function update() {
  const opt = form.tour.selectedOptions[0], price = +opt.dataset.price, people = +form.people.value;
  const volcan = form.tour.value === 'volcan';
  $('[data-lift]').hidden = !volcan;
  if (!volcan) $('[data-lift] input').checked = false;
  let extras = 0;
  $$('.extras input', form).forEach((i) => { if (i.checked && !i.closest('[hidden]')) extras += +i.dataset.price * (i.dataset.per === 'p' ? people : 1); });
  const total = price * people + extras;
  $('[data-s-tour]').textContent = TOURS[form.tour.value].name;
  const d = new Date(form.date.value + 'T12:00');
  const w = weather(d);
  $('[data-s-date]').textContent = `${d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })} · ${w.temp} °C en cumbre · viento ${w.wind} km/h`;
  $('[data-s-label]').textContent = `${people} × ${clp(price)}`;
  $('[data-s-base]').textContent = clp(price * people);
  $('[data-s-extras]').textContent = clp(extras);
  $('[data-s-total]').textContent = clp(total);
  $('[data-s-deposit]').textContent = clp(total * 0.3);
  let warn = '';
  if (volcan && w.state !== 'ok') {
    const alt = days.find((x) => x > d && weather(x).state === 'ok' && weather(x).seats);
    warn = `${w.state === 'no' ? 'Pronóstico malo' : 'Pronóstico dudoso'} para el volcán ese día.${alt ? ` Le sugerimos el ${alt.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric' })}.` : ''} Si no se puede subir, le cambiamos la fecha gratis.`;
  }
  if (w.seats && people > w.seats) warn += ` Ese día quedan solo ${w.seats} cupos.`;
  $('[data-s-warn]').textContent = warn.trim();
  markDay();
}
form.addEventListener('input', update);
form.addEventListener('change', update);
update();
function pickTour(id) {
  form.tour.value = id; update();
  $('#reservar').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

initWeek({ weather });
initCert();

/* ───────────── Apariciones y aviso de muestra ───────────── */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));
const toast = $('.toast');
document.addEventListener('click', (e) => {
  const demo = e.target.closest('[data-demo]');
  if (!demo) return;
  e.preventDefault();
  $('[data-toast-text]').textContent = demo.dataset.demo || 'En el sitio real, la reserva llegaría al WhatsApp del operador con el tour, la fecha, las personas y el abono del 30%. Esta es una muestra de concepto diseñada por Red Vaeru.';
  $('[data-toast-wa]').href = `https://wa.me/56952289117?text=${encodeURIComponent('Hola Jorge, vi la muestra "Pucón Aventura" en Red Vaeru y quiero un sitio así para mi negocio.')}`;
  toast.classList.add('is-in');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toast.classList.remove('is-in'), 9000);
});
$('[data-toast-close]').addEventListener('click', () => toast.classList.remove('is-in'));
$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

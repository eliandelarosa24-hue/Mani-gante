// Viña Los Robles · comportamiento a medida
import './style.css';
import { initGlass } from './glass.js';
import { initVine } from './vine.js';
import { initBlend } from './blend.js';
import { initWines } from './wines.js';
import { initFinca, initProceso, initCocina, initDia } from './experiences.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) / 4294967295;

/* ───────────── Pantalla de carga: la copa se llena ───────────── */
const labels = ['Descorchando', 'Sirviendo', 'Dejando respirar', '¡Salud!'];
const minTime = reduced ? 0 : 2400, t0 = performance.now();
(function fill(now) {
  if (document.body.classList.contains('is-ready')) return;
  const k = Math.min(1, (now - t0) / Math.max(1, minTime));
  const y = 110 - k * 64, w = Math.sin(now / 180) * 4;
  $('[data-lwine]').setAttribute('d', `M0 ${y} Q30 ${y - w} 60 ${y} T120 ${y} V140 H0z`);
  $('[data-load-n]').textContent = Math.round(k * 100);
  $('[data-load-label]').textContent = labels[Math.min(3, Math.floor(k * 4))];
  requestAnimationFrame(fill);
})(t0);
const ready = () => setTimeout(() => document.body.classList.add('is-ready'), Math.max(0, minTime - (performance.now() - t0)));
if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
setTimeout(() => document.body.classList.add('is-ready'), 6000);

/* ───────────── Título del hero línea por línea ───────────── */
(function title() {
  const t = $('.hero__title');
  t.setAttribute('aria-label', t.textContent.replace(/\s+/g, ' ').trim());
  [...t.childNodes].forEach((n, i) => {
    const s = document.createElement('span');
    s.className = 'ln'; s.setAttribute('aria-hidden', 'true'); s.style.animationDelay = `${0.2 + i * 0.25}s`;
    if (n.nodeType === 3) { if (!n.textContent.trim()) return; s.textContent = n.textContent; n.replaceWith(s); }
    else { n.replaceWith(s); s.append(n); s.style.display = 'block'; }
  });
})();

/* ───────────── Navegación ───────────── */
const nav = $('.nav');
const onScroll = () => nav.classList.toggle('is-solid', scrollY > innerHeight * 0.75);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const burger = $('.nav__burger'), menu = $('.menu');
burger.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-hidden', String(!open));
});
$$('a', menu).forEach((a) => a.addEventListener('click', () => { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }));

/* ───────────── Módulos: copa, parra, ensamblaje y vinos ───────────── */
initGlass({ reduced });
initVine();
initBlend({ onBook: () => pickExp('enologo') });
initWines({
  onAdd: (n) => {
    const b = $('[data-case-btn]');
    $('[data-case-n]').textContent = n;
    b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump');
  },
});

initFinca();
initProceso({ reduced });
initCocina();
initDia({ reduced, onBook: (plan) => pickExp(plan === 'enologo' ? 'enologo' : 'almuerzo') });

/* ───────────── La viña: fotos en paralaje y contadores ───────────── */
(function vina() {
  const imgs = $$('.vina__imgs > div'), box = $('.vina__imgs');
  if (!reduced) addEventListener('scroll', () => {
    const r = box.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    imgs.forEach((el, i) => (el.style.transform = `translateY(${k * [30, -50, -90][i]}px)`));
  }, { passive: true });
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    $$('[data-count]', e.target).forEach((el) => { const to = +el.dataset.count, t1 = performance.now(); const step = (t) => { const p = Math.min(1, (t - t1) / 1600); el.textContent = Math.round(to * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  }, { threshold: 0.4 }).observe($('.vina__nums'));
})();

/* ───────────── Reserva con calendario (jueves a domingo) ───────────── */
const form = $('[data-res]');
const SLOTS = { clasica: ['10:30', '12:30', '15:30', '17:00'], almuerzo: ['12:30'], bici: ['10:30', '15:30'], caballo: ['10:00', '16:00'], picnic: ['17:30'], enologo: ['10:00'] };
const today = new Date(); today.setHours(0, 0, 0, 0);
let view = new Date(today.getFullYear(), today.getMonth(), 1), sel = null, slot = null;
const open = (d) => [4, 5, 6, 0].includes(d.getDay()) && d > today;
const vend = (d) => [2, 3].includes(d.getMonth());
function renderCal() {
  { const t = view.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }); $('[data-cal-title]').textContent = t.charAt(0).toUpperCase() + t.slice(1); }
  const first = (view.getDay() + 6) % 7, days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  let html = '<span></span>'.repeat(first);
  for (let d = 1; d <= days; d++) {
    const dt = new Date(view.getFullYear(), view.getMonth(), d), ok = open(dt);
    const few = ok && hash(dt.toDateString()) > 0.7;
    const isSel = sel && dt.getTime() === sel.getTime();
    html += `<button type="button" data-d="${d}" ${ok ? '' : 'disabled'} class="${ok ? (few ? 'few' : 'ok') : ''}${vend(dt) && ok ? ' vend' : ''}" aria-selected="${!!isSel}" aria-label="${dt.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}${few ? ', pocos cupos' : ''}">${d}</button>`;
  }
  $('[data-cal-days]').innerHTML = html;
  $('[data-cal-prev]').disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
}
$('[data-cal-days]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-d]'); if (!b || b.disabled) return;
  sel = new Date(view.getFullYear(), view.getMonth(), +b.dataset.d);
  renderCal(); update();
});
$('[data-cal-prev]').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCal(); });
$('[data-cal-next]').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal(); });
function renderSlots() {
  const list = SLOTS[form.exp.value];
  if (!list.includes(slot)) slot = list[0];
  $('[data-slots]').innerHTML = list.map((s) => `<button type="button" role="radio" aria-checked="${s === slot}" data-slot="${s}">${s}</button>`).join('');
}
$('[data-slots]').addEventListener('click', (e) => { const b = e.target.closest('[data-slot]'); if (b) { slot = b.dataset.slot; renderSlots(); update(); } });
function update() {
  const opt = form.exp.selectedOptions[0], price = +opt.dataset.price, people = +form.people.value;
  const tr = form.transfer.checked ? 8000 * people : 0;
  $('[data-r-date]').textContent = sel ? `${sel.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })} · ${slot}` : 'Elija un día en el calendario';
  $('[data-r-vend]').hidden = !(sel && vend(sel));
  $('[data-r-label]').textContent = `${people} × ${opt.textContent.split('·')[0].trim()}`;
  $('[data-r-base]').textContent = clp(price * people);
  $('[data-r-tr]').textContent = clp(tr);
  $('[data-r-total]').textContent = clp(price * people + tr);
}
form.addEventListener('change', () => { renderSlots(); update(); });
// Primer día disponible preseleccionado
for (let i = 1; i < 14 && !sel; i++) { const d = new Date(today.getTime() + i * 864e5); if (open(d)) { sel = d; view = new Date(d.getFullYear(), d.getMonth(), 1); } }
renderCal(); renderSlots(); update();
function pickExp(id) {
  form.exp.value = id; renderSlots(); update();
  $('#reservar').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
$$('[data-pick-exp]').forEach((b) => b.addEventListener('click', () => pickExp(b.dataset.pickExp)));

/* ───────────── Apariciones y aviso de muestra ───────────── */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));
const toast = $('.toast');
document.addEventListener('click', (e) => {
  const demo = e.target.closest('[data-demo]'); if (!demo) return;
  e.preventDefault();
  $('[data-toast-text]').textContent = demo.dataset.demo || 'En el sitio real, el mensaje llegaría al WhatsApp de la viña. Esta es una muestra de concepto diseñada por Red Vaeru.';
  $('[data-toast-wa]').href = `https://wa.me/56952289117?text=${encodeURIComponent('Hola Jorge, vi la muestra "Viña Los Robles" en Red Vaeru y quiero un sitio así para mi negocio.')}`;
  toast.classList.add('is-in'); clearTimeout(toast.t); toast.t = setTimeout(() => toast.classList.remove('is-in'), 9000);
});
$('[data-toast-close]').addEventListener('click', () => toast.classList.remove('is-in'));
$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

// Comportamiento compartido de las muestras de concepto de Red Vaeru.
import './sample.css';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const usd = (n) => 'US$' + Math.round(n).toLocaleString('en-US');
const SAMPLE = document.body.dataset.sample || 'una muestra';
const money = document.body.dataset.currency === 'USD' ? usd : clp;

// Navegación
const nav = $('.s-nav');
const onScroll = () => nav?.classList.toggle('is-solid', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
const menu = $('.s-menu');
$('.s-burger')?.addEventListener('click', () => menu.classList.add('is-open'));
$('.s-menu button')?.addEventListener('click', () => menu.classList.remove('is-open'));
$$('.s-menu a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('is-open')));

// Aparición al hacer scroll
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));

// Aviso de muestra: los botones de reserva y WhatsApp explican que es una demostración
const toast = $('.toast');
function demo(action) {
  if (!toast) return;
  $('[data-toast-text]', toast).textContent = `En el sitio real, aquí ${action}. Esta es una muestra de concepto diseñada por Red Vaeru.`;
  $('[data-toast-wa]', toast).href = `https://wa.me/56952289117?text=${encodeURIComponent(`Hola, vi la muestra "${SAMPLE}" en el sitio de Red Vaeru y quiero algo así para mi negocio.`)}`;
  toast.classList.add('is-in');
  clearTimeout(demo.t);
  demo.t = setTimeout(() => toast.classList.remove('is-in'), 9000);
}
$('[data-toast-close]')?.addEventListener('click', () => toast.classList.remove('is-in'));
document.addEventListener('click', (e) => {
  const d = e.target.closest('[data-demo]');
  if (!d) return;
  e.preventDefault();
  demo(d.dataset.demo || 'se abriría la reserva directa con el negocio');
});

// Reserva con cálculo de noches, extras y total
$$('[data-book]').forEach((form) => {
  const sum = $(form.dataset.book);
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const inEl = form.checkin, outEl = form.checkout;
  if (inEl && outEl) {
    const a = new Date(today.getTime() + 14 * 864e5), b = new Date(today.getTime() + 17 * 864e5);
    inEl.min = iso(today); outEl.min = iso(a);
    inEl.value = iso(a); outEl.value = iso(b);
  }
  const update = () => {
    const opt = form.unit?.selectedOptions[0];
    const price = Number(opt?.dataset.price || form.dataset.price || 0);
    const cap = Number(opt?.dataset.cap || 99);
    let nights = 1;
    if (inEl && outEl) {
      if (outEl.value <= inEl.value) { const n = new Date(inEl.value); n.setDate(n.getDate() + 1); outEl.value = iso(n); }
      outEl.min = inEl.value;
      nights = Math.max(1, Math.round((new Date(outEl.value) - new Date(inEl.value)) / 864e5));
    }
    const guests = Number(form.guests?.value || 1);
    const perPerson = form.dataset.perPerson === 'true';
    const word = form.dataset.qtyWord || 'persona';
    const base = perPerson ? price * guests : price * nights;
    let extras = 0;
    $$('input[type=checkbox][data-price]', form).forEach((c) => {
      if (!c.checked) return;
      const p = Number(c.dataset.price);
      extras += c.dataset.per === 'night' ? p * nights : c.dataset.per === 'guest' ? p * guests : p;
    });
    const fee = Number(form.dataset.fee || 0);
    const total = base + extras + fee;
    $('[data-s-label]', sum) && ($('[data-s-label]', sum).textContent = perPerson ? `${guests} ${word}${guests > 1 && !word.endsWith('n') ? 's' : ''} × ${money(price)}` : `${nights} noche${nights > 1 ? 's' : ''} × ${money(price)}`);
    $('[data-s-base]', sum).textContent = money(base);
    $('[data-s-extras]', sum).textContent = money(extras);
    if ($('[data-s-fee]', sum)) $('[data-s-fee]', sum).textContent = money(fee);
    $('[data-s-total]', sum).textContent = money(total);
    const warn = $('[data-s-warn]', sum);
    if (warn) warn.textContent = guests > cap ? `Esta opción recibe hasta ${cap} personas. Elija otra o consúltenos.` : '';
    const direct = $('[data-s-save]', sum);
    if (direct) direct.textContent = `Reservando directo ahorra cerca de ${money(total * 0.15)} frente a las plataformas.`;
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => { e.preventDefault(); demo('se enviaría la solicitud de reserva directo al WhatsApp del negocio, con fechas y total'); });
  update();
});

// Calendario de disponibilidad (simulado y estable para cada muestra)
$$('[data-cal]').forEach((el) => {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  const first = new Date(y, m, 1);
  const days = new Date(y, m + 1, 0).getDate();
  const start = (first.getDay() + 6) % 7;
  let seed = [...SAMPLE].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const label = first.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  $('[data-cal-title]', el.parentElement) && ($('[data-cal-title]', el.parentElement).textContent = `Disponibilidad · ${label}`);
  el.innerHTML = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => `<b>${d}</b>`).join('')
    + Array.from({ length: start }, () => '<span class="empty"></span>').join('')
    + Array.from({ length: days }, (_, i) => `<span class="${rnd() < 0.32 ? 'busy' : ''}">${i + 1}</span>`).join('');
});

// Galería con visor
const lb = $('.lightbox');
if (lb) {
  const items = $$('.gallery button');
  let idx = 0;
  const show = (i) => {
    idx = (i + items.length) % items.length;
    const src = $('.ph', items[idx]);
    $('.ph', lb).style.backgroundImage = src.style.backgroundImage;
    $('p', lb).textContent = items[idx].getAttribute('aria-label') || '';
    lb.classList.add('is-open');
  };
  items.forEach((b, i) => b.addEventListener('click', () => show(i)));
  $('.lb-close', lb).addEventListener('click', () => lb.classList.remove('is-open'));
  $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
  $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('is-open'); });
  addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lb.classList.remove('is-open');
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
}

// Pestañas
$$('[role=tablist]').forEach((list) => {
  const tabs = $$('[role=tab]', list);
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => { x.setAttribute('aria-selected', String(x === t)); $('#' + x.getAttribute('aria-controls')).hidden = x !== t; });
  }));
});

// Filtros de experiencias
$$('[data-filters]').forEach((wrap) => {
  const target = $(wrap.dataset.filters);
  $$('button', wrap).forEach((b) => b.addEventListener('click', () => {
    $$('button', wrap).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.f;
    $$('[data-tags]', target).forEach((card) => { card.hidden = f !== 'todo' && !card.dataset.tags.split(' ').includes(f); });
  }));
});

// Fase lunar real (para la muestra de astroturismo)
const moon = $('[data-moon]');
if (moon) {
  const syn = 29.530588853;
  const ref = Date.UTC(2000, 0, 6, 18, 14) / 864e5;
  const age = (((Date.now() / 864e5 - ref) % syn) + syn) % syn;
  const frac = age / syn;
  const illum = Math.round((1 - Math.cos(2 * Math.PI * frac)) / 2 * 100);
  const names = ['Luna nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente', 'Luna llena', 'Gibosa menguante', 'Cuarto menguante', 'Menguante'];
  const name = names[Math.round(frac * 8) % 8];
  const shift = frac < 0.5 ? 100 - frac * 400 : -((frac - 0.5) * 400);
  $('i', moon).style.transform = `translateX(${Math.max(-100, Math.min(100, shift))}%)`;
  const nextNew = new Date(Date.now() + (syn - age) * 864e5);
  $('[data-moon-name]').textContent = name;
  $('[data-moon-illum]').textContent = illum + '%';
  $('[data-moon-next]').textContent = nextNew.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
  $('[data-moon-tip]').textContent = illum < 35 ? 'Excelente: cielo oscuro para ver la Vía Láctea esta semana.' : illum < 70 ? 'Buena: la luna se pone temprano; observación desde la medianoche.' : 'Luna brillante: ideal para ver la luna con telescopio y fotografía nocturna de paisaje.';
}

$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

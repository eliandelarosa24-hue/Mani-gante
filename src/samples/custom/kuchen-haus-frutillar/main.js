// Kuchen Haus · comportamiento a medida
import '../panels.js';
import './style.css';
import { initBuilder } from './builder.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) / 4294967295;

// Hora real de Frutillar
function chile() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { h: +p.hour, m: +p.minute, s: +p.second, t: +p.hour + +p.minute / 60 + +p.second / 3600 };
}
const OPEN = 9, CLOSE = 20;

/* ───────────── Pantalla de carga: reloj cucú ───────────── */
const loader = $('.loader');
const labels = ['Precalentando el horno', 'Batiendo la mantequilla', 'Esparciendo el streusel', '¡Kuckuck!'];
const minTime = reduced ? 0 : 2400, t0 = performance.now();
(function tick(now) {
  if (document.body.classList.contains('is-ready')) return;
  const k = Math.min(1, (now - t0) / Math.max(1, minTime));
  $('[data-load-n]').textContent = Math.round(k * 100);
  $('[data-load-label]').textContent = labels[Math.min(3, Math.floor(k * 4))];
  if (k >= 0.86) loader.classList.add('is-cuckoo');
  requestAnimationFrame(tick);
})(t0);
const ready = () => setTimeout(() => document.body.classList.add('is-ready'), Math.max(0, minTime - (performance.now() - t0)));
if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
setTimeout(() => document.body.classList.add('is-ready'), 6000);

/* ───────────── La ventana al lago según la hora de Frutillar ───────────── */
(function windowView() {
  const w = $('[data-window]'); if (!w) return;
  const stars = $('[data-stars-w]', w);
  stars.innerHTML = Array.from({ length: 50 }, () => `<circle cx="${(Math.random() * 400).toFixed(0)}" cy="${(Math.random() * 260).toFixed(0)}" r="${(Math.random() * 1.3 + 0.3).toFixed(1)}" fill="#fff"/>`).join('');
  const SK = [ // hora, cielo arriba, cielo abajo, lago arriba, lago abajo, volcán, cerros
    [0, '#0b1530', '#1d2b52', '#14284a', '#0a1428', '#2a3550', '#1c2c26'],
    [6.5, '#3b5a8f', '#f3b38a', '#6b7fa6', '#2b4566', '#5b6a8a', '#3d5a44'],
    [9, '#8cc2ee', '#e8f2fb', '#5b9ec2', '#2e6688', '#6a7fa0', '#4f7a58'],
    [17.5, '#7fb2e0', '#f6e2c4', '#5a92b5', '#2c5f80', '#6d7c9a', '#4c7452'],
    [19.8, '#4a4f8a', '#f39a6b', '#7a6f96', '#2d3f62', '#5a5478', '#33503d'],
    [21.5, '#0b1530', '#1d2b52', '#14284a', '#0a1428', '#2a3550', '#1c2c26'],
    [24, '#0b1530', '#1d2b52', '#14284a', '#0a1428', '#2a3550', '#1c2c26'],
  ];
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(',')})`;
  function paint() {
    const { t, h, m } = chile();
    let i = 0; while (t >= SK[i + 1][0]) i++;
    const A = SK[i], B = SK[i + 1], k = (t - A[0]) / (B[0] - A[0]);
    const set = (sel, j) => $(sel, w).setAttribute('stop-color', mix(A[j], B[j], k));
    set('[data-sky1]', 1); set('[data-sky2]', 2); set('[data-lake1]', 3); set('[data-lake2]', 4);
    $('[data-volcano]', w).style.fill = mix(A[5], B[5], k);
    $('[data-hills]', w).style.fill = mix(A[6], B[6], k);
    const day = t > 6.5 && t < 20.5, night = t < 6 || t > 21;
    const sunK = Math.max(0, Math.min(1, (t - 6.5) / 14));
    const sun = $('[data-sun]', w), moon = $('[data-moon]', w);
    sun.setAttribute('cx', 60 + sunK * 300); sun.setAttribute('cy', 260 - Math.sin(sunK * Math.PI) * 200);
    sun.setAttribute('opacity', day ? 1 : 0);
    moon.setAttribute('opacity', night ? 1 : 0);
    stars.setAttribute('opacity', night ? 0.9 : 0);
    $('[data-clouds]', w).style.opacity = night ? 0.25 : 1;
    const open = h >= OPEN && h < CLOSE;
    $('[data-now]').textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    $('[data-open-dot]').classList.toggle('is-open', open);
    $('[data-open]').textContent = open ? `Abierto hasta las ${CLOSE}:00` : `Abrimos a las ${OPEN}:00`;
    $('[data-kk]').textContent = t >= 16 && t < 17 ? '¡Es la hora del kuchen!' : t < 16 ? `Kaffee und Kuchen en ${fmtLeft(16 - t)}` : 'Mañana a las 16:00, Kaffee und Kuchen';
  }
  paint(); setInterval(paint, 30000);
  // Velero que cruza el lago
  const boat = $('[data-boat]', w);
  let bx = 40;
  (function sail() { bx += 0.12; if (bx > 420) bx = -40; boat.setAttribute('transform', `translate(${bx} ${336 + Math.sin(bx / 14) * 1.5})`); if (!reduced) requestAnimationFrame(sail); })();
})();
function fmtLeft(hours) { const mm = Math.round(hours * 60); return mm >= 60 ? `${Math.floor(mm / 60)} h ${mm % 60} min` : `${mm} min`; }

/* ───────────── Título palabra por palabra ───────────── */
(function words() {
  const t = $('.hero__title'); let k = 0;
  t.setAttribute('aria-label', t.textContent.replace(/\s+/g, ' ').trim());
  const wrap = (node) => [...node.childNodes].forEach((c) => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) { f.append(' '); return; } const s = document.createElement('span'); s.className = 'w'; s.setAttribute('aria-hidden', 'true'); s.textContent = w; s.style.animationDelay = `${0.1 + k++ * 0.09}s`; f.append(s); });
      c.replaceWith(f);
    } else if (c.nodeType === 1) wrap(c);
  });
  wrap(t);
})();

/* ───────────── Chispas de azúcar en el hero ───────────── */
const SWEET = ['#f3bfca', '#b9d3ec', '#f2c46b', '#c2475a', '#dcefe3', '#ffffff', '#e7a9b6'];
if (!reduced) {
  $('[data-sprinkles]').innerHTML = Array.from({ length: 34 }, () => `<i style="left:${(Math.random() * 100).toFixed(1)}%;background:${SWEET[Math.floor(Math.random() * SWEET.length)]};animation-duration:${(9 + Math.random() * 10).toFixed(1)}s;animation-delay:-${(Math.random() * 18).toFixed(1)}s"></i>`).join('');
}
function confetti(el) {
  if (reduced || !el) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 22; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.cssText = `left:${cx}px;top:${cy}px;background:${SWEET[i % SWEET.length]}`;
    document.body.append(c);
    const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 90;
    c.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * v}px, ${Math.sin(a) * v + 80}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => c.remove();
  }
}

/* ───────────── Navegación ───────────── */
const nav = $('.nav');
addEventListener('scroll', () => nav.classList.toggle('is-solid', scrollY > 30), { passive: true });
const burger = $('.nav__burger'), menu = $('.menu');
burger.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-hidden', String(!open));
});
$$('a', menu).forEach((a) => a.addEventListener('click', () => { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }));

/* ───────────── Fotos (resueltas por el generador en la plantilla) ───────────── */
const PHOTO = Object.fromEntries([...$('template[data-photos]').content.querySelectorAll('i')].map((i) => [i.dataset.p, i.getAttribute('style')]));

/* ───────────── Bandeja (carrito) ───────────── */
const tray = [];
const trayBtn = $('[data-tray-btn]');
function addToTray(item, from) {
  const found = tray.find((x) => x.id === item.id);
  if (found) found.qty++; else tray.push({ ...item, qty: 1 });
  renderTray();
  // Animación: el producto vuela a la bandeja
  if (from && !reduced) {
    const fly = $('[data-fly]'), a = from.getBoundingClientRect(), b = trayBtn.getBoundingClientRect();
    fly.setAttribute('style', item.thumb || PHOTO[item.photo] || '');
    fly.animate([{ left: `${a.left + a.width / 2 - 28}px`, top: `${a.top + a.height / 2 - 28}px`, opacity: 1, transform: 'scale(1.2)' }, { left: `${b.left - 5}px`, top: `${b.top - 5}px`, opacity: 0.2, transform: 'scale(0.4)' }], { duration: 750, easing: 'cubic-bezier(.5,0,.2,1)' });
  }
  trayBtn.classList.remove('is-bump'); void trayBtn.offsetWidth; trayBtn.classList.add('is-bump');
  confetti(from);
}
function renderTray() {
  $('[data-tray-n]').textContent = tray.reduce((a, x) => a + x.qty, 0);
  $('[data-tray]').innerHTML = tray.map((x, i) => `<li><span class="th" style="${x.thumb || PHOTO[x.photo] || ''}"></span><div><b>${x.name}</b><small>${x.sub} · ${clp(x.price)}</small></div><div class="qty"><button type="button" data-q="-1" data-i="${i}" aria-label="Quitar uno">−</button><span>${x.qty}</span><button type="button" data-q="1" data-i="${i}" aria-label="Agregar uno">+</button></div></li>`).join('');
  $('[data-tray-empty]').hidden = tray.length > 0;
  updateOrder();
}
$('[data-tray]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-q]'); if (!b) return;
  const x = tray[+b.dataset.i]; x.qty += +b.dataset.q;
  if (x.qty <= 0) tray.splice(+b.dataset.i, 1);
  renderTray();
});

/* ───────────── Vitrina del día ───────────── */
const PRODUCTS = [
  { id: 'k-murta', name: 'Kuchen de murta', desc: 'Con crumble de mantequilla. La receta más pedida del salón desde 2004.', slice: 3900, whole: 26900, tag: 'Temporada de otoño', stock: 18 },
  { id: 'k-frambuesa', name: 'Kuchen de frambuesa', desc: 'Frambuesas de Frutillar Alto sobre crema pastelera de vainilla.', slice: 3700, whole: 24900, tag: 'El clásico', stock: 22 },
  { id: 'k-manzana', name: 'Kuchen de manzana', desc: 'Manzana y canela con streusel. La receta original de 1987.', slice: 3400, whole: 22900, tag: 'Desde 1987', stock: 24 },
  { id: 'k-nuez', name: 'Kuchen de nuez', desc: 'Nueces de Osorno caramelizadas con miel de ulmo.', slice: 3900, whole: 26900, tag: 'Para golosos', stock: 12 },
  { id: 'selva', name: 'Selva Negra', desc: 'Bizcocho de chocolate, guindas y crema batida.', slice: 4500, whole: 32900, tag: 'Torta', stock: 14 },
  { id: 'strudel', name: 'Strudel de manzana', desc: 'Tibio, con crema batida o una bola de helado de vainilla.', slice: 4800, tag: 'Servido tibio', stock: 16 },
  { id: 'pretzel', name: 'Pretzel bávaro', desc: 'Horneado a las 8:00, con mostaza dulce de la casa.', slice: 2900, tag: 'Salado', stock: 30, unit: 'Unidad' },
  { id: 'cafe', name: 'Cappuccino', desc: 'Café de especialidad tostado en Puerto Varas. Para llevar o en el salón.', slice: 3200, tag: 'Para acompañar', unit: 'Taza' },
];
function left(p) {
  if (!p.stock) return null;
  const { t } = chile();
  if (t < OPEN || t >= CLOSE) return { n: p.stock, closed: true };
  const k = ((t - OPEN) / (CLOSE - OPEN)) ** 0.85 * (0.5 + hash(p.id + new Date().toDateString()) * 0.42);
  return { n: Math.max(1, Math.round(p.stock * (1 - k))), closed: false };
}
const shelves = $$('[data-shelf]');
PRODUCTS.forEach((p, i) => {
  const l = left(p);
  shelves[i < 4 ? 0 : 1].insertAdjacentHTML('beforeend', `<button type="button" class="item" data-item="${p.id}"><span class="item__plate"><span style="${PHOTO[p.id] || ''}"></span></span><b>${p.name}</b><small>${clp(p.slice)}${l && !l.closed ? ` · quedan ${l.n}` : ''}</small></button>`);
});
function showItem(id) {
  const p = PRODUCTS.find((x) => x.id === id), l = left(p);
  $$('.item').forEach((b) => b.classList.toggle('is-on', b.dataset.item === id));
  $('[data-detail]').innerHTML = `<div class="ph" style="${PHOTO[p.id] || ''}"></div><span class="tag">${p.tag}</span><h3>${p.name}</h3><p>${p.desc}</p>
    ${l ? `<div class="left"><span>${l.closed ? 'Sale del horno a las 9:00' : `Quedan ${l.n} de ${p.stock}`}</span><i><em style="width:${(l.n / p.stock) * 100}%"></em></i></div>` : ''}
    <div class="buy"><button type="button" data-buy="slice">${p.unit || 'Porción'}<b>${clp(p.slice)}</b></button>${p.whole ? `<button type="button" data-buy="whole">Entero · 12 porciones<b>${clp(p.whole)}</b></button>` : `<button type="button" disabled>Solo en el salón<b>—</b></button>`}</div>`;
  $('[data-detail]').dataset.current = id;
}
$('.case__glass').addEventListener('click', (e) => { const b = e.target.closest('[data-item]'); if (b) showItem(b.dataset.item); });
$('[data-detail]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-buy]'); if (!b) return;
  const p = PRODUCTS.find((x) => x.id === $('[data-detail]').dataset.current), whole = b.dataset.buy === 'whole';
  addToTray({ id: p.id + (whole ? '-entero' : ''), name: whole ? `${p.name} entero` : p.name, sub: whole ? '12 porciones · con 24 h' : (p.unit || 'Porción').toLowerCase(), price: whole ? p.whole : p.slice, photo: p.id, whole }, b);
});
showItem('k-murta');

/* ───────────── Arme su kuchen ───────────── */
initBuilder({ onAdd: addToTray });

/* ───────────── Kaffee und Kuchen: reloj, cuenta regresiva y maridaje ───────────── */
(function hora() {
  const ticks = $('[data-clock-ticks]');
  ticks.innerHTML = Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * Math.PI * 2, big = i % 5 === 0, r1 = big ? 104 : 110; return `<line x1="${150 + Math.sin(a) * r1}" y1="${150 - Math.cos(a) * r1}" x2="${150 + Math.sin(a) * 116}" y2="${150 - Math.cos(a) * 116}" stroke-width="${big ? 3 : 1}"/>`; }).join('')
    + Array.from({ length: 12 }, (_, i) => { const a = ((i + 1) / 12) * Math.PI * 2; return `<text x="${150 + Math.sin(a) * 86}" y="${150 - Math.cos(a) * 86}">${i + 1}</text>`; }).join('');
  // Porción de kuchen pintada entre las 4 y las 5
  const arc = (h) => { const a = (h / 12) * Math.PI * 2; return [150 + Math.sin(a) * 124, 150 - Math.cos(a) * 124]; };
  const [x1, y1] = arc(4), [x2, y2] = arc(5);
  $('[data-clock-slice]').setAttribute('d', `M150 150 L${x1} ${y1} A124 124 0 0 1 ${x2} ${y2} Z`);
  function tick() {
    const { h, m, s, t } = chile();
    $('[data-clock-h]').setAttribute('transform', `rotate(${((h % 12) + m / 60) * 30} 150 150)`);
    $('[data-clock-m]').setAttribute('transform', `rotate(${(m + s / 60) * 6} 150 150)`);
    let left = 16 - t; if (left < 0) left += 24;
    const now = t >= 16 && t < 17;
    $('[data-cd-label]').textContent = now ? '¡Es la hora del kuchen! Quedan' : 'Para la hora del kuchen faltan';
    const secs = Math.round((now ? 17 - t : left) * 3600);
    $('[data-cd]').textContent = `${String(Math.floor(secs / 3600)).padStart(2, '0')}:${String(Math.floor((secs % 3600) / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  }
  tick(); setInterval(tick, 1000);
  const PAIR = {
    'k-murta': ['Filtrado de Etiopía', 'sus notas frutales y florales abrazan la acidez de la murta'],
    'k-frambuesa': ['Cappuccino', 'la leche suave equilibra la frambuesa y la crema'],
    'k-manzana': ['Café con leche y canela', 'repite la canela del streusel, como en casa de la abuela'],
    'k-nuez': ['Espresso doble', 'su amargor corta el dulzor del caramelo de miel'],
    selva: ['Americano', 'limpio y largo, para no competir con el chocolate'],
    strudel: ['Café vienés', 'con crema batida encima, la pareja de siempre en Viena'],
  };
  $('[data-pair]').innerHTML = Object.keys(PAIR).map((id, i) => `<button type="button" data-p="${id}" aria-pressed="${i === 0}">${PRODUCTS.find((p) => p.id === id).name.replace('Kuchen de ', '')}</button>`).join('');
  const show = (id) => { const [c, why] = PAIR[id]; $('[data-pair-res]').innerHTML = `Con ${PRODUCTS.find((p) => p.id === id).name.toLowerCase()}, pida un <b>${c}</b>: ${why}.`; $$('[data-pair] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === id))); };
  $('[data-pair]').addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) show(b.dataset.p); });
  show('k-murta');
})();

/* ───────────── La receta de la abuela ───────────── */
(function receta() {
  const ING = [['Masa'], ['Harina', 300, 'g'], ['Mantequilla fría', 150, 'g'], ['Azúcar', 100, 'g'], ['Huevo', 1, ''], ['Polvos de hornear', 1, 'cdta'], ['Crema y fruta'], ['Frambuesas', 500, 'g'], ['Leche entera', 500, 'ml'], ['Maicena', 40, 'g'], ['Yemas', 2, ''], ['Vainilla', 1, 'cdta'], ['Streusel'], ['Harina', 80, 'g'], ['Mantequilla', 60, 'g'], ['Azúcar rubia', 60, 'g']];
  const MOLD = { 8: 'un molde de 20 cm', 12: 'un molde de 26 cm', 24: 'una bandeja de 40 × 30 cm' };
  const STEPS = (n) => ['Frote la harina con la mantequilla fría hasta que parezca arena. Sume azúcar, huevo y polvos de hornear.', `Forre ${MOLD[n]} con la masa y refrigere 20 minutos.`, 'Cocine la leche con maicena, yemas, azúcar y vainilla, revolviendo, hasta que espese.', 'Vierta la crema sobre la masa y cubra con las frambuesas.', 'Desmigaje el streusel con los dedos y espárzalo encima.', `Hornee ${n === 24 ? '50' : '45'} minutos a 180 °C. Deje enfriar antes de cortar.`];
  const frac = (v) => { const r = Math.round(v * 2) / 2, w = Math.floor(r); return r % 1 ? `${w || ''}½` : String(r); };
  const qty = (v, u, k) => (u === 'g' || u === 'ml' ? `${Math.round((v * k) / 5) * 5} ${u}` : `${frac(v * k)}${u ? ' ' + u : ''}`);
  let serves = 12, prev = {};
  function render() {
    const k = serves / 12;
    $('[data-ing]').innerHTML = ING.map(([n, v, u], i) => (v == null ? `<li class="sub">${n}</li>` : `<li>${n} <b data-i="${i}">${qty(v, u, k)}</b></li>`)).join('');
    $$('[data-ing] b').forEach((b) => { if (prev[b.dataset.i] && prev[b.dataset.i] !== b.textContent) b.classList.add('is-changed'); prev[b.dataset.i] = b.textContent; });
    const done = $$('[data-steps] li.is-done').map((li) => +li.dataset.s);
    $('[data-steps]').innerHTML = STEPS(serves).map((t, i) => `<li data-s="${i}" class="${done.includes(i) ? 'is-done' : ''}" tabindex="0" role="checkbox" aria-checked="${done.includes(i)}">${t}</li>`).join('');
    count();
  }
  const count = () => { $('[data-steps-done]').textContent = `${$$('[data-steps] li.is-done').length} de 6 pasos`; };
  $$('[data-serves]').forEach((b) => b.addEventListener('click', () => { serves = +b.dataset.serves; $$('[data-serves]').forEach((x) => x.setAttribute('aria-checked', String(x === b))); render(); }));
  const toggle = (li) => { li.classList.toggle('is-done'); li.setAttribute('aria-checked', String(li.classList.contains('is-done'))); count(); };
  $('[data-steps]').addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) toggle(li); });
  $('[data-steps]').addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('li')) { e.preventDefault(); toggle(e.target); } });
  render();
})();

/* ───────────── Línea de tiempo que se arrastra ───────────── */
(function timeline() {
  const tl = $('[data-timeline]'); let sx = null, sl = 0, moved = false;
  tl.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; sx = e.clientX; sl = tl.scrollLeft; moved = false; tl.classList.add('is-drag'); });
  addEventListener('pointermove', (e) => { if (sx == null) return; const d = e.clientX - sx; if (Math.abs(d) > 3) moved = true; tl.scrollLeft = sl - d; });
  addEventListener('pointerup', () => { sx = null; tl.classList.remove('is-drag'); });
  tl.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') tl.scrollBy({ left: 300, behavior: 'smooth' }); if (e.key === 'ArrowLeft') tl.scrollBy({ left: -300, behavior: 'smooth' }); });
  tl.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && tl.scrollWidth > tl.clientWidth) { const max = tl.scrollWidth - tl.clientWidth; if ((e.deltaY > 0 && tl.scrollLeft < max - 2) || (e.deltaY < 0 && tl.scrollLeft > 2)) { e.preventDefault(); tl.scrollLeft += e.deltaY; } } }, { passive: false });
})();

/* ───────────── Pedidos y mesas ───────────── */
const order = $('[data-order]');
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
order.date.min = iso(new Date()); order.date.value = iso(tomorrow);
let deliver = 0;
$$('[data-deliver]').forEach((b) => b.addEventListener('click', () => { deliver = +b.dataset.deliver; $$('[data-deliver]').forEach((x) => x.setAttribute('aria-checked', String(x === b))); updateOrder(); }));
order.addEventListener('change', updateOrder);
function updateOrder() {
  const items = tray.reduce((a, x) => a + x.price * x.qty, 0);
  $('[data-o-items]').textContent = clp(items);
  $('[data-o-deliver]').textContent = clp(tray.length ? deliver : 0);
  $('[data-o-total]').textContent = clp(items + (tray.length ? deliver : 0));
  const sel = new Date(order.date.value + 'T12:00'), today = new Date(); today.setHours(12, 0, 0, 0);
  const wholes = tray.some((x) => x.whole);
  $('[data-o-warn]').textContent = wholes && sel <= today ? 'Los kuchen enteros se encargan con 24 horas: elija desde mañana.' : '';
}
$$('[data-tab]').forEach((b) => b.addEventListener('click', () => {
  $$('[data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  $$('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== b.dataset.tab; if (!p.hidden) p.classList.add('in'); });
}));
(function mesa() {
  const f = $('[data-mesa]');
  f.date.min = iso(new Date()); f.date.value = iso(new Date());
  let slot = '16:00';
  const SLOTS = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  function render() {
    $('[data-mesa-slots]').innerHTML = SLOTS.map((s) => `<button type="button" role="radio" aria-checked="${s === slot}" data-slot="${s}">${s}${s === '16:00' ? ' ☕' : ''}</button>`).join('');
    const win = Math.floor(hash(f.date.value + slot) * 4) - (slot === '16:00' ? 1 : 0);
    $('[data-mesa-note]').textContent = f.window.checked
      ? (win > 0 ? `${win === 1 ? "Queda 1 mesa" : `Quedan ${win} mesas`} junto a la ventana a las ${slot}.` : `A las ${slot} la ventana está completa: le guardamos la mejor mesa del salón.`)
      : `Mesa para ${f.people.value} a las ${slot}.${slot === '16:00' ? ' Justo a la hora del kuchen.' : ''}`;
  }
  $('[data-mesa-slots]').addEventListener('click', (e) => { const b = e.target.closest('[data-slot]'); if (b) { slot = b.dataset.slot; render(); } });
  f.addEventListener('change', render);
  render();
})();
renderTray();

/* ───────────── Apariciones y aviso de muestra ───────────── */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv').forEach((el) => io.observe(el));
const toast = $('.toast');
document.addEventListener('click', (e) => {
  const demo = e.target.closest('[data-demo]'); if (!demo) return;
  e.preventDefault();
  $('[data-toast-text]').textContent = demo.dataset.demo || 'En el sitio real, el mensaje llegaría al WhatsApp de la pastelería. Esta es una muestra de concepto diseñada por Red Vaeru.';
  $('[data-toast-wa]').href = `https://wa.me/56952289117?text=${encodeURIComponent('Hola, vi la muestra "Kuchen Haus" en el sitio de Red Vaeru y quiero algo así para mi negocio.')}`;
  toast.classList.add('is-in'); clearTimeout(toast.t); toast.t = setTimeout(() => toast.classList.remove('is-in'), 9000);
});
$('[data-toast-close]').addEventListener('click', () => toast.classList.remove('is-in'));
$$('[data-year]').forEach((e) => (e.textContent = new Date().getFullYear()));

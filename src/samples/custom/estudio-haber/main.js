// Estudio Haber · comportamiento a medida
import '../panels.js';
import './style.css';
import { RECEIPTS, YEAR, MONTHS, PLANS, EXTRA_WORKER, EXTRA_DOCS, CASES, COMMUNES, TEAM, NOTES, FAQ } from './data.js';
import { DAY, keyOf, dow, isHoliday, isBusiness, nextBusiness, utc, weekday, fmtDay, monthName, todayCL, eventsOf, upcoming, nextF29 } from './tax.js';
import { sound } from './sound.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
// Hash FNV-1a con mezcla final: valores bien repartidos incluso entre claves consecutivas
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967295; };
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const TODAY = todayCL();
const T = new Date(TODAY);
const PERIOD = (T.getUTCMonth() + 11) % 12; // mes que se declara ahora (el anterior)
const PERIOD_Y = T.getUTCMonth() === 0 ? T.getUTCFullYear() - 1 : T.getUTCFullYear();
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
document.addEventListener('click', (e) => { const d = e.target.closest('[data-demo]'); if (!d) return; e.preventDefault(); toast(d.dataset.demo || 'En el sitio real, este botón abriría WhatsApp con Carolina, del Estudio Haber, con un mensaje listo para pedir su diagnóstico.'); });

/* Timbre: cada botón deja una marca de tinta donde se presiona */
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.stamp-btn'); if (!b || reduced) return;
  const m = document.createElement('span'); m.className = 'ink-mark'; m.textContent = 'Recibido';
  m.style.left = `${e.pageX}px`; m.style.top = `${e.pageY}px`;
  document.body.append(m); setTimeout(() => m.remove(), 1300); sound.stamp();
});

/* ───────────── Pantalla de carga: un asiento que se cuadra y se timbra ───────────── */
(function loader() {
  const rows = $('[data-load-rows]'), sd = $('[data-load-d]'), sh = $('[data-load-h]'), diff = $('[data-load-diff]');
  const LINES = [['Caja', 1190000, 0], ['Ventas', 0, 1000000], ['IVA débito', 0, 190000], ['Proveedores', 0, 357000], ['Compras', 300000, 0], ['IVA crédito', 57000, 0]];
  let d = 0, h = 0;
  const step = reduced ? 0 : 190;
  LINES.forEach(([n, de, ha], i) => setTimeout(() => {
    const r = document.createElement('div');
    r.innerHTML = `<span><small>${n}</small>${de ? clp(de) : ''}</span><span>${ha ? clp(ha) : ''}</span>`;
    rows.append(r); d += de; h += ha;
    sd.textContent = clp(d); sh.textContent = clp(h); diff.textContent = clp(Math.abs(d - h));
    sound.key();
  }, 250 + i * step));
  const stampAt = 250 + LINES.length * step + 150;
  let stamped = false;
  setTimeout(() => { $('.loader__diff').classList.add('ok'); $('[data-load-stamp]').classList.add('on'); setTimeout(() => $('.loader').classList.add('shake'), 220); stamped = true; }, stampAt);
  const go = () => {
    const wait = Math.max(0, stampAt + (reduced ? 0 : 750) - performance.now());
    setTimeout(() => document.body.classList.add('is-ready'), stamped ? (reduced ? 0 : 500) : wait);
  };
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
  setTimeout(() => document.body.classList.add('is-ready'), 7000);
})();

/* Navegación móvil */
const burger = $('[data-burger]'), drawer = $('[data-drawer]');
burger.addEventListener('click', () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); drawer.classList.toggle('is-open', o); drawer.setAttribute('aria-hidden', !o); });
$$('a', drawer).forEach((a) => a.addEventListener('click', () => burger.click()));

/* ───────────── Hero: de la caja de zapatos al balance ───────────── */
(function hero() {
  const sec = $('[data-hero]'), stage = $('[data-stage]'), box = $('[data-receipts]'), ledger = $('[data-ledger]'), rowsEl = $('[data-ledger-rows]');
  const copy = $('[data-hero-copy]'), done = $('[data-hero-done]'), ph = $('[data-hero-ph]');
  const mm = String(PERIOD + 1).padStart(2, '0');
  $('.ledger__h b').parentElement.innerHTML = `<b>Libro de compras</b> · ${cap(monthName(PERIOD))} ${PERIOD_Y}`;
  $('.ledger__stamp small').textContent = `${cap(monthName(PERIOD)).slice(0, 3)}. ${PERIOD_Y}`;
  let N = 0, W = 0, H = 0, items = [], targets = [], k = 0, t0 = 0;
  const split = (r) => (r.t === 'F' ? { net: Math.round(r.total / 1.19), iva: r.total - Math.round(r.total / 1.19) } : { net: r.total, iva: 0 });
  function build() {
    W = stage.clientWidth; H = stage.clientHeight;
    N = Math.max(6, Math.min(RECEIPTS.length, Math.floor((H - 260) / 26), W < 700 ? 8 : 18));
    const list = RECEIPTS.slice(0, N);
    rowsEl.innerHTML = list.map((r) => { const s = split(r); return `<div class="ledger__r" role="row"><span role="cell">${r.d.slice(0, 3)}${mm}</span><span role="cell">${r.who}</span><span role="cell"><i class="doc doc--${r.t}">${r.t}</i></span><span role="cell">${clp(s.net)}</span><span role="cell" class="${s.iva ? '' : 'zero'}">${s.iva ? clp(s.iva) : '—'}</span><span role="cell">${clp(r.total)}</span></div>`; }).join('');
    box.innerHTML = list.map((r, i) => `<div class="rc rc--${r.t}" data-i="${i}"><b>${r.who}</b><span class="t">${r.t === 'F' ? 'Factura electrónica' : 'Boleta electrónica'} N° ${String(Math.floor(hash(r.who) * 90000) + 1000)}<br />${r.d.slice(0, 3)}${mm}-${PERIOD_Y}</span>${r.what}<span class="tot"><span>Total</span><span>${clp(r.total)}</span></span><span class="bar"></span></div>`).join('');
    const rw = W < 700 ? 112 : W < 860 ? 128 : 158;
    items = $$('.rc', box).map((el, i) => {
      const rh = el.offsetHeight;
      let x, y;
      if (W < 700) {
        // En el teléfono las boletas quedan arriba y abajo, nunca sobre el texto
        const top = i % 2 === 0, j = Math.floor(i / 2), cols = Math.ceil(N / 2);
        x = ((j + 0.5) / cols) * W - rw / 2 + (hash('x' + i) - 0.5) * 30;
        y = top ? 64 - rh * 0.55 + hash('y' + i) * 40 : H - rh * 0.42 - hash('y' + i) * 40;
      } else {
        // Anillo alrededor del título, dejando libre la franja de abajo (botones)
        const a = Math.PI / 2 + 0.85 + (i / Math.max(1, N - 1)) * (Math.PI * 2 - 1.7) + (hash('a' + i) - 0.5) * 0.18;
        const rr = 0.9 + hash('r' + i) * 0.2;
        x = W / 2 + Math.cos(a) * W * 0.41 * rr - rw / 2; y = H / 2 + Math.sin(a) * H * 0.4 * rr - rh / 2;
        x = clamp(x, -rw * 0.25, W - rw * 0.75); y = clamp(y, 40, H - rh * 0.6);
      }
      return { el, x, y, w: rw, h: rh, r: (hash('t' + i) - 0.5) * 50, dx: 0, dy: 0, row: rowsEl.children[i], done: false };
    });
    measure();
  }
  function measure() {
    const s = stage.getBoundingClientRect();
    targets = items.map((it) => { const r = it.row.getBoundingClientRect(); return { x: r.left - s.left + r.width * 0.32, y: r.top - s.top + r.height / 2 }; });
  }
  const sums = () => {
    let n = 0, v = 0, t = 0;
    items.forEach((it, i) => { if (!it.done) return; const r = RECEIPTS[i], s = split(r); n += s.net; v += s.iva; t += r.total; });
    $('[data-sum-net]').textContent = clp(n); $('[data-sum-iva]').textContent = clp(v); $('[data-sum-tot]').textContent = clp(t);
  };
  // Arrastrar boletas mientras siguen en la caja
  let drag = null;
  box.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.rc'); if (!el) return;
    const it = items[+el.dataset.i]; if (it.prog > 0.02) return;
    drag = { it, sx: e.clientX - it.dx, sy: e.clientY - it.dy, lx: e.clientX };
    el.classList.add('is-drag'); el.style.zIndex = 50 + (++zTop); el.setPointerCapture(e.pointerId); sound.key();
  });
  let zTop = 0;
  box.addEventListener('pointermove', (e) => { if (!drag) return; drag.it.dx = e.clientX - drag.sx; drag.it.dy = e.clientY - drag.sy; drag.it.r += (e.clientX - drag.lx) * 0.08; drag.lx = e.clientX; });
  const up = () => { if (!drag) return; drag.it.el.classList.remove('is-drag'); drag = null; };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);

  const onScroll = () => { const r = sec.getBoundingClientRect(); k = clamp(-r.top / Math.max(1, sec.offsetHeight - innerHeight)); };
  addEventListener('scroll', onScroll, { passive: true });
  let lw = 0;
  addEventListener('resize', () => { if (Math.abs(innerWidth - lw) > 40) { lw = innerWidth; build(); } else measure(); });
  build(); lw = innerWidth; onScroll();
  if (reduced) return;
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sec);
  let wasDone = false, lastIn = 0;
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!visible) return;
    if (!t0 && document.body.classList.contains('is-ready')) t0 = now;
    const intro = t0 ? now - t0 : 0;
    stage.style.setProperty('--k', k.toFixed(3));
    const show = clamp((k - 0.04) / 0.1);
    ledger.style.opacity = show; ledger.classList.toggle('on', show > 0);
    ledger.style.transform = `translate(-50%, calc(-50% + ${(1 - show) * 40}px))`;
    copy.style.opacity = 1 - clamp((k - 0.01) / 0.09);
    copy.style.transform = `translateY(${-clamp(k / 0.12) * 60}px)`;
    copy.style.visibility = k > 0.12 ? 'hidden' : '';
    if (show > 0 && !targets[0]?.y) measure();
    let nIn = 0;
    items.forEach((it, i) => {
      const s = 0.13 + (i / N) * 0.5, p = clamp((k - s) / 0.16), e = ease(p);
      it.prog = p;
      // Entrada: las boletas caen sobre el escritorio una tras otra
      const d = clamp((intro - i * 55) / 700), de = 1 - (1 - d) ** 3;
      const x0 = it.x + it.dx, y0 = it.y + it.dy - (1 - de) * (H * 0.7), r0 = it.r + (1 - de) * 40;
      const tg = targets[i] || { x: W / 2, y: H / 2 };
      const x = x0 + (tg.x - it.w / 2 - x0) * e, y = y0 + (tg.y - it.h / 2 - y0) * e - Math.sin(Math.PI * e) * 70;
      const sc = 1 - e * 0.82, rot = r0 * (1 - e);
      it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      it.el.style.opacity = (d <= 0 ? 0 : 1) * (p < 0.86 ? 1 : 1 - (p - 0.86) / 0.14);
      const isIn = p >= 0.97;
      if (isIn !== it.done) { it.done = isIn; it.row.classList.toggle('in', isIn); }
      if (isIn) nIn++;
    });
    if (nIn !== lastIn) { if (nIn > lastIn) sound.print(1); lastIn = nIn; sums(); }
    const all = nIn === items.length && items.length > 0;
    if (all !== wasDone) { wasDone = all; ledger.classList.toggle('done', all); done.classList.toggle('on', all); if (all) sound.stamp(); }
  })(0);
  void ph;
})();

/* Revelado al desplazar */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
const watch = () => $$('.rv:not(.in), .fh:not(.in)').forEach((el) => io.observe(el));

/* Cifras que suben */
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
  const f = (now) => { const p = reduced ? 1 : clamp((now - t0) / 1600), v = Math.round(to * (1 - (1 - p) ** 3)); el.textContent = (el.dataset.sep !== undefined ? v.toLocaleString('es-CL') : v) + suf; if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}), { threshold: 0.6 });
$$('[data-count]').forEach((el) => cio.observe(el));

/* ───────────── 01 · Calendario tributario ───────────── */
(function calendar() {
  const stack = $('[data-pad-stack]');
  let day = TODAY, view = { y: T.getUTCFullYear(), m: T.getUTCMonth() };
  const tagOf = (t) => {
    const ev = eventsOf(new Date(t).getUTCFullYear(), new Date(t).getUTCMonth()).find((e) => e.t === t);
    if (ev) return `<span class="sheet__tag ${ev.k === 'prev' ? 'sheet__tag--prev' : ''}">${ev.s}</span>`;
    if (isHoliday(t)) return '<span class="sheet__tag sheet__tag--hol">Feriado</span>';
    return '';
  };
  const sheet = (t) => `<div class="sheet ${dow(t) > 4 ? 'is-weekend' : ''} ${isHoliday(t) ? 'is-hol' : ''}" data-t="${t}"><p class="sheet__m">${monthName(new Date(t).getUTCMonth())} ${new Date(t).getUTCFullYear()}</p><p class="sheet__d">${new Date(t).getUTCDate()}</p><p class="sheet__w">${weekday(t)}${t === TODAY ? ' · hoy' : ''}</p>${tagOf(t)}</div>`;
  function renderPad() { stack.innerHTML = sheet(day + DAY) + sheet(day); bindSheet(); }
  function due() {
    const f = nextF29(day), n = Math.round((f.t - day) / DAY);
    $('[data-due-n]').textContent = n;
    $('[data-due-unit]').textContent = n === 1 ? 'día' : 'días';
    $('[data-due-k]').textContent = day === TODAY ? 'Hoy faltan' : `Desde el ${fmtDay(day)} faltan`;
    const pm = monthName(new Date(f.t).getUTCMonth() - 1);
    $('[data-due-what]').innerHTML = n === 0 ? `<b>¡Hoy vence el F29!</b> El IVA de ${pm} se declara y paga antes de medianoche.` : `para declarar y pagar el <b>IVA de ${pm}</b>: vence el <b>${fmtDay(f.t)}</b>${new Date(f.t).getUTCDate() !== 20 ? ', corrido por fin de semana o feriado' : ''}.`;
    $('[data-due-list]').innerHTML = upcoming(day, 5).map((e) => `<li><b>${new Date(e.t).getUTCDate()} ${monthName(new Date(e.t).getUTCMonth()).slice(0, 3)}</b><span>${e.l}</span><i>${Math.round((e.t - day) / DAY)} d</i></li>`).join('');
    const chip = nextF29(TODAY), cn = Math.round((chip.t - TODAY) / DAY);
    $('[data-due-chip-t]').textContent = cn === 0 ? 'F29 vence hoy' : `F29 en ${cn} ${cn === 1 ? 'día' : 'días'}`;
  }
  function tear() {
    const top = stack.lastElementChild; if (!top || top.classList.contains('fly')) return;
    top.classList.add('fly'); sound.tear();
    setTimeout(() => { day += DAY; renderPad(); due(); syncMonth(); }, reduced ? 0 : 520);
  }
  function bindSheet() {
    const top = stack.lastElementChild; let sy = null;
    top.addEventListener('pointerdown', (e) => { sy = e.clientY; top.setPointerCapture(e.pointerId); });
    top.addEventListener('pointermove', (e) => { if (sy === null) return; const dy = Math.max(0, e.clientY - sy); top.style.transform = `rotateX(${-Math.min(30, dy / 4)}deg) rotate(${-dy / 30}deg)`; });
    top.addEventListener('pointerup', (e) => { if (sy === null) return; const dy = e.clientY - sy; sy = null; top.style.transform = ''; if (dy > 50) tear(); });
    top.addEventListener('pointercancel', () => { sy = null; top.style.transform = ''; });
  }
  $('[data-pad-tear]').addEventListener('click', tear);
  $('[data-pad-back]').addEventListener('click', () => { day = TODAY; renderPad(); due(); syncMonth(); });
  // Mes
  function syncMonth() { const d = new Date(day); view = { y: d.getUTCFullYear(), m: d.getUTCMonth() }; month(); }
  function month() {
    const { y, m } = view, first = utc(y, m, 1), lead = dow(first), days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    $('[data-m-title]').textContent = `${monthName(m)} ${y}`;
    const ev = eventsOf(y, m), cells = [];
    for (let i = 0; i < lead; i++) cells.push('<div class="out"></div>');
    for (let d = 1; d <= days; d++) {
      const t = utc(y, m, d), es = ev.filter((e) => e.t === t);
      const cls = [dow(t) > 4 ? 'we' : '', isHoliday(t) ? 'hol' : '', t === TODAY ? 'today' : ''].join(' ');
      cells.push(`<div class="${cls}"><span>${d}</span>${es.map((e) => `<span class="ev ev--${e.k === 'iva2' ? 'iva' : e.k}">${e.s}</span>`).join('')}${isHoliday(t) ? '<span class="ev ev--hol">feriado</span>' : ''}</div>`);
    }
    while (cells.length % 7) cells.push('<div class="out"></div>');
    $('[data-m-grid]').innerHTML = cells.join('');
  }
  $('[data-m-prev]').addEventListener('click', () => { view.m--; if (view.m < 0) { view.m = 11; view.y--; } month(); });
  $('[data-m-next]').addEventListener('click', () => { view.m++; if (view.m > 11) { view.m = 0; view.y++; } month(); });
  // Año
  const strip = $('[data-year]'), card = $('[data-year-card]');
  strip.innerHTML = YEAR.map((x, i) => `<button role="tab" aria-selected="false" class="${i === T.getUTCMonth() ? 'now' : ''}" style="--h:${x.h}" data-ym="${i}">${MONTHS[i].slice(0, 3)}<i></i><small>${x.k}</small></button>`).join('');
  const pick = (i) => { $$('button', strip).forEach((b, j) => b.setAttribute('aria-selected', i === j)); const x = YEAR[i]; card.innerHTML = `<p class="m">${MONTHS[i]}</p><p class="t">${x.t}</p><p class="d">${x.d}</p>`; };
  strip.addEventListener('click', (e) => { const b = e.target.closest('[data-ym]'); if (b) pick(+b.dataset.ym); });
  pick(T.getUTCMonth());
  renderPad(); due(); month();
})();

/* ───────────── 02 · Calculadora con tira de papel ───────────── */
(function calc() {
  const val = $('[data-c-val]'), lbl = $('[data-c-lbl]'), opts = $('[data-c-opts]'), tape = $('[data-tape]'), input = $('[data-c-input]'), fine = $('[data-c-fine]');
  const RATES = { 2026: 15.25, 2027: 16, 2028: 17 };
  const yearNow = Math.min(2028, Math.max(2026, T.getUTCFullYear()));
  const st = { mode: 'iva', v: '1000000', dir: 'net', year: yearNow, months: 3 };
  const FINE = {
    iva: 'IVA de 19% según la Ley sobre Impuesto a las Ventas y Servicios. Una factura de compra da derecho a crédito fiscal; una boleta, no.',
    hon: 'Retención de boletas de honorarios según la Ley 21.133: 15,25% en 2026, 16% en 2027 y 17% desde 2028. Lo retenido se abona a su Operación Renta.',
    late: 'Estimación referencial: multa del art. 97 N°2 del Código Tributario (10%, y 2% más por cada mes sobre cinco, con tope de 30%) e interés de 1,5% mensual del art. 53. No incluye reajuste por IPC; el SII puede condonar parte de las multas.',
  };
  function lines() {
    const n = +st.v || 0, L = [];
    if (st.mode === 'iva') {
      if (st.dir === 'net') { const iva = Math.round(n * 0.19); L.push(['Neto', n], ['IVA 19%', iva, 'red'], ['Total', n + iva, 'big sep']); }
      else { const net = Math.round(n / 1.19); L.push(['Total', n], ['IVA 19%', n - net, 'red'], ['Neto', net, 'big sep']); }
    } else if (st.mode === 'hon') {
      const r = RATES[st.year] / 100;
      if (st.dir === 'net') { const ret = Math.round(n * r); L.push(['Bruto', n], [`Retención ${RATES[st.year].toLocaleString('es-CL')}%`, ret, 'red'], ['Líquido', n - ret, 'big sep']); }
      else { const b = Math.round(n / (1 - r)); L.push(['Líquido', n], [`Retención ${RATES[st.year].toLocaleString('es-CL')}%`, b - n, 'red'], ['Bruto a emitir', b, 'big sep']); }
    } else {
      const m = st.months, p = m <= 5 ? 10 : Math.min(30, 10 + 2 * (m - 5)), i = 1.5 * m;
      const fineV = Math.round(n * p / 100), intV = Math.round(n * i / 100);
      L.push(['IVA adeudado', n], [`Multa ${p}%`, fineV, 'red'], [`Interés ${i.toLocaleString('es-CL')}%`, intV, 'red'], ['Total a pagar', n + fineV + intV, 'big sep']);
    }
    return L;
  }
  function paint() {
    const L = lines(), last = L[L.length - 1];
    lbl.textContent = last[0]; val.textContent = clp(last[1]);
    input.value = (+st.v || 0).toLocaleString('es-CL');
    fine.textContent = FINE[st.mode];
  }
  function renderOpts() {
    if (st.mode === 'iva') opts.innerHTML = `<button type="button" data-dir="net" aria-pressed="${st.dir === 'net'}">Tengo el neto</button><button type="button" data-dir="gross" aria-pressed="${st.dir === 'gross'}">Tengo el total</button>`;
    else if (st.mode === 'hon') opts.innerHTML = `<button type="button" data-dir="net" aria-pressed="${st.dir === 'net'}">Tengo el bruto</button><button type="button" data-dir="gross" aria-pressed="${st.dir === 'gross'}">Quiero recibir</button>${Object.keys(RATES).map((y) => `<button type="button" data-year="${y}" aria-pressed="${+y === st.year}">${y}</button>`).join('')}`;
    else opts.innerHTML = `<label class="rng"><span>Meses de atraso</span><input type="range" min="1" max="24" value="${st.months}" data-months /><b data-months-out>${st.months}</b></label>`;
    $('[data-c-lbl]').textContent = '';
  }
  function print() {
    const L = lines(), head = { iva: 'IVA', hon: `Honorarios ${st.year}`, late: `F29 con ${st.months} ${st.months === 1 ? 'mes' : 'meses'} de atraso` }[st.mode];
    const html = [`<p class="cut"><span>${head}</span><span>${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span></p>`, ...L.map(([a, b, c]) => `<p class="${c || ''}"><span>${a}</span><span>${clp(b)}</span></p>`)];
    html.forEach((h, i) => setTimeout(() => { tape.insertAdjacentHTML('beforeend', h); tape.scrollTop = tape.scrollHeight; }, reduced ? 0 : i * 130));
    sound.print(html.length);
  }
  const press = (k) => {
    if (k === 'c') st.v = '0';
    else if (k === 'del') st.v = st.v.slice(0, -1) || '0';
    else if (k === '=') return print();
    else st.v = (st.v === '0' ? '' : st.v) + k;
    st.v = st.v.slice(0, 12); paint(); sound.key();
  };
  $('[data-c-pad]').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
  input.addEventListener('input', () => { st.v = input.value.replace(/\D/g, '').slice(0, 12) || '0'; const L = lines(), last = L[L.length - 1]; lbl.textContent = last[0]; val.textContent = clp(last[1]); });
  input.addEventListener('blur', paint);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); print(); } });
  opts.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.dir) st.dir = b.dataset.dir;
    if (b.dataset.year) st.year = +b.dataset.year;
    renderOpts(); paint(); sound.key();
  });
  opts.addEventListener('input', (e) => { if (!e.target.matches('[data-months]')) return; st.months = +e.target.value; $('[data-months-out]').textContent = st.months; paint(); });
  $$('[data-mode]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-mode]').forEach((x) => x.setAttribute('aria-selected', x === b));
    st.mode = b.dataset.mode; st.dir = 'net';
    st.v = { iva: '1000000', hon: '500000', late: '850000' }[st.mode];
    renderOpts(); paint(); print();
  }));
  // Teclado físico cuando la calculadora está a la vista
  let inView = false;
  new IntersectionObserver(([e]) => (inView = e.isIntersecting), { threshold: 0.5 }).observe($('[data-calc]'));
  addEventListener('keydown', (e) => {
    if (!inView || e.target.matches('input, textarea')) return;
    const map = { Backspace: 'del', Escape: 'c', Enter: '=' };
    const k = /^\d$/.test(e.key) ? e.key : map[e.key]; if (!k) return;
    e.preventDefault(); press(k);
    const b = $(`[data-k="${k}"]`); b?.classList.add('hit'); setTimeout(() => b?.classList.remove('hit'), 90);
  });
  $('[data-tape-tear]').addEventListener('click', () => {
    tape.classList.add('torn'); sound.tear();
    setTimeout(() => { tape.classList.remove('torn'); tape.innerHTML = '<p class="tape-head">Estudio Haber · cálculo referencial</p>'; }, reduced ? 0 : 600);
  });
  renderOpts(); paint();
  // Primera impresión cuando la calculadora aparece
  const once = new IntersectionObserver(([e]) => { if (e.isIntersecting) { once.disconnect(); setTimeout(print, 500); } }, { threshold: 0.4 });
  once.observe($('[data-calc]'));
})();

/* ───────────── 03 · ¿Qué régimen le conviene? ───────────── */
(function regime() {
  const f = $('[data-regime]'), out = $('[data-verdict]'), sales = $('[data-sales]');
  const UF = 40000; // valor de referencia de la UF
  let workers = 0, last = '';
  $('[data-regime-folio]').textContent = String(Math.floor(hash(keyOf(TODAY)) * 900000) + 100000);
  function run() {
    const mm = +sales.value, uf = Math.round((mm * 1e6) / UF);
    $('[data-sales-out]').textContent = mm >= 1000 ? `$${(mm / 1000).toLocaleString('es-CL', { maximumFractionDigits: 2 })} mil millones` : `$${mm} millones`;
    $('[data-sales-uf]').textContent = `≈ ${uf.toLocaleString('es-CL')} UF al año · el límite Pro Pyme es un promedio de 75.000 UF`;
    const own = f.own.value, use = f.use.value;
    let r;
    if (uf > 75000) r = { id: 'a', t: 'Régimen <em>General</em>', art: 'Art. 14 letra A · semi integrado', pts: ['Sus ventas superan el límite Pro Pyme de 75.000 UF.', 'La empresa paga Primera Categoría y sus dueños usan parte como crédito.', 'Exige contabilidad completa y planificación de retiros.'] };
    else if (own === 'nat' && use === 'out') r = { id: 'd8', t: 'Pro Pyme <em>Transparente</em>', art: 'Art. 14 letra D N°8', pts: ['La empresa no paga Primera Categoría: las utilidades tributan directo en el Global Complementario de los dueños.', 'Puede llevar contabilidad simplificada.', 'Conviene cuando los dueños retiran casi todo lo que gana el negocio.'] };
    else r = { id: 'd3', t: 'Pro Pyme <em>General</em>', art: 'Art. 14 letra D N°3', pts: [own === 'co' ? 'Con una empresa como socia, el régimen transparente no está disponible.' : 'Si reinvierte, conviene que la empresa tribute con tasa reducida de Primera Categoría.', 'Los dueños pagan impuesto personal solo cuando retiran.', 'Permite depreciación instantánea y contabilidad simplificada.'] };
    const plan = workers > 2 ? PLANS[2] : (workers > 0 || mm > 80) ? PLANS[1] : PLANS[0];
    out.innerHTML = `<div class="verdict__tx"><p class="verdict__k">Nuestra sugerencia</p><p class="verdict__t">${r.t}</p><p class="verdict__art">${r.art}</p><ul>${r.pts.map((p) => `<li>${p}</li>`).join('')}</ul><p class="verdict__fine">Plan recomendado: <b>${plan.name}</b>${workers ? `, con ${workers} ${workers === 1 ? 'trabajador' : 'trabajadores'}` : ''}. Esta es una orientación general; el régimen correcto se decide en el diagnóstico, con sus números reales.</p></div><div class="verdict__ph" style="${photo('firma')}"><span class="verdict__stamp">Sugerido</span></div>`;
    if (r.id !== last) { out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop'); if (last) sound.stamp(); last = r.id; }
    plansPick(plan.id, workers);
  }
  f.addEventListener('input', run);
  f.addEventListener('change', run);
  $('[data-workers]').addEventListener('click', (e) => { const b = e.target.closest('[data-w]'); if (!b) return; workers = clamp(workers + +b.dataset.w, 0, 40); $('[data-w-out]').textContent = workers; run(); sound.key(); });
  queueMicrotask(run);
})();

/* ───────────── 04 · Antes y después, conversación ───────────── */
(function ba() {
  const el = $('[data-ba]'), r = $('[data-ba-range]');
  const set = (v) => el.style.setProperty('--x', `${v}%`);
  r.addEventListener('input', () => set(r.value));
  // Pequeña invitación: la línea se asoma sola la primera vez
  const o = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || reduced) return; o.disconnect();
    const t0 = performance.now();
    (function f(now) { const p = clamp((now - t0) / 1800); const v = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p); set(v); r.value = v; if (p < 1) requestAnimationFrame(f); })(t0);
  }, { threshold: 0.5 });
  o.observe(el);
})();
(function chat() {
  const body = $('[data-chat-body]'), status = $('[data-chat-status]');
  const f = nextF29(TODAY);
  const credit = RECEIPTS.filter((r) => r.t === 'F').reduce((s, r) => s + r.total - Math.round(r.total / 1.19), 0);
  const salesNet = 7514000, debit = Math.round(salesNet * 0.19), pay = debit - credit;
  const pm = monthName(PERIOD);
  const MSG = [
    ['in', `Hola Rosa, buenos días. Le dejo el resumen de <b>${pm}</b>:`, 900],
    ['in', `<span class="fig">Ventas netas  ${clp(salesNet)}<br />IVA débito    ${clp(debit)}<br />IVA crédito   ${clp(credit)}<br /><b>IVA a pagar   ${clp(pay)}</b></span>Vence el ${fmtDay(f.t)}.`, 1500],
    ['in', '¿Lo dejamos pagado con cargo a su cuenta? Responda <b>ok</b> y listo.', 1200],
    ['out', 'ok, gracias Carolina 🙏', 1400],
    ['in', `Listo ✓ Declarado y pagado. Folio SII ${Math.floor(hash('folio' + keyOf(TODAY)) * 9e8) + 1e8}. ¡Que tenga buena semana!`, 1500],
  ];
  let timers = [];
  function play() {
    timers.forEach(clearTimeout); timers = []; body.innerHTML = '';
    let t = 300;
    MSG.forEach(([who, html, wait]) => {
      if (who === 'in') { timers.push(setTimeout(() => { status.textContent = 'escribiendo…'; body.insertAdjacentHTML('beforeend', '<div class="msg msg--in msg--typing" data-typing><i></i><i></i><i></i></div>'); body.scrollTop = body.scrollHeight; }, t)); t += reduced ? 0 : wait; }
      else t += reduced ? 0 : wait * 0.7;
      timers.push(setTimeout(() => { $('[data-typing]', body)?.remove(); status.textContent = 'en línea'; body.insertAdjacentHTML('beforeend', `<div class="msg msg--${who}">${html}<small>09:${String(12 + Math.round(t / 1000)).padStart(2, '0')}${who === 'out' ? ' ✓✓' : ''}</small></div>`); body.scrollTop = body.scrollHeight; }, t));
      t += 200;
    });
  }
  const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { o.disconnect(); play(); } }, { threshold: 0.4 });
  o.observe($('[data-chat]'));
  $('[data-chat-replay]').addEventListener('click', play);
})();

/* ───────────── 05 · Planes ───────────── */
let plansPick = () => {};
(function plans() {
  const wrap = $('[data-folders]'), rec = $('[data-b-receipt]'), docs = $('[data-b-docs]');
  const TABS = ['#e6d3a8', '#cfdcc9', '#e8c2b4'];
  let sel = 'pyme', workers = 0;
  wrap.innerHTML = PLANS.map((p, i) => `<button type="button" role="tab" class="folder rv" style="--tab:${TABS[i]}" data-plan="${p.id}" aria-selected="false"><span class="folder__tab">${p.kicker}</span><span class="folder__in"><span class="folder__body"><h3>${p.name}</h3><p class="price">desde <b>${clp(p.base)}</b> al mes</p><ul>${p.items.map((x) => `<li>${x}</li>`).join('')}</ul></span></span></button>`).join('');
  function paint(flash) {
    const p = PLANS.find((x) => x.id === sel), d = +docs.value;
    $$('[data-plan]').forEach((b) => b.setAttribute('aria-selected', b.dataset.plan === sel));
    $('[data-b-w]').textContent = workers; $('[data-b-docs-out]').textContent = d;
    const xw = Math.max(0, workers - p.workers), xd = Math.ceil(Math.max(0, d - p.docs) / 100);
    const once = $$('[data-b-x]:checked').map((c) => [c.parentElement.textContent.split('·')[0].trim(), +c.value]);
    const month = p.base + xw * EXTRA_WORKER + xd * EXTRA_DOCS;
    rec.innerHTML = `<p class="h">Estudio Haber · Cotización ${String(Math.floor(hash(sel + workers + d) * 9000) + 1000)}</p><p><span>Plan ${p.name}</span><span>${clp(p.base)}</span></p>${xw ? `<p><span>${xw} trabajador${xw > 1 ? 'es' : ''} adicional${xw > 1 ? 'es' : ''}</span><span>${clp(xw * EXTRA_WORKER)}</span></p>` : ''}${xd ? `<p><span>+${xd * 100} documentos</span><span>${clp(xd * EXTRA_DOCS)}</span></p>` : ''}<p class="tot"><span>Al mes</span><span>${clp(month)}</span></p>${once.map(([a, b]) => `<p class="once"><span>${a}</span><span>${clp(b)}</span></p>`).join('')}<span class="fine">Valores netos referenciales. Sin permanencia: se cancela con 30 días de aviso.</span><a class="stamp-btn" href="#agenda"><span>Lo quiero · agendar</span></a>`;
    if (flash) { rec.classList.remove('flash'); void rec.offsetWidth; rec.classList.add('flash'); sound.print(2); }
  }
  wrap.addEventListener('click', (e) => { const b = e.target.closest('[data-plan]'); if (!b) return; sel = b.dataset.plan; paint(true); });
  $('[data-b-workers]').addEventListener('click', (e) => { const b = e.target.closest('[data-w]'); if (!b) return; workers = clamp(workers + +b.dataset.w, 0, 40); if (workers > PLANS.find((x) => x.id === sel).workers && sel !== 'pymeplus' && workers > 2) sel = 'pymeplus'; paint(true); });
  docs.addEventListener('input', () => paint(false));
  $$('[data-b-x]').forEach((c) => c.addEventListener('change', () => paint(true)));
  plansPick = (id, w) => { sel = id; workers = w; paint(false); };
  paint(false);
})();

/* ───────────── 06 · Clientes y mapa ───────────── */
(function cases() {
  $('[data-cases]').innerHTML = CASES.map((c) => `<article class="case rv" style="--tab:${c.tab}"><div class="case__ph" style="${photo(c.slot)}" data-zoom="${c.slot}" data-tag="Cliente desde ${c.since}" role="img" aria-label="${c.name}"></div><div><p class="case__k">${c.place}</p><h3>${c.name}</h3><div class="case__ba"><div><span>Antes</span>${c.before}</div><div><span>Hoy</span>${c.after}</div></div><div class="case__st">${c.stats.map(([a, b]) => `<p><b>${a}</b><span>${b}</span></p>`).join('')}</div><blockquote>«${c.quote}»<cite>${c.who}</cite></blockquote></div></article>`).join('');
  // Mapa estilizado de La Araucanía y Los Ríos
  const svg = $('[data-map]'), list = $('[data-map-list]'), tip = $('[data-map-tip]');
  const X = (lng) => 20 + ((lng + 73.7) / 2.4) * 360, Y = (lat) => 20 + ((-37.6 - lat) / 2.4) * 420;
  const coast = [[-37.6, -73.66], [-37.9, -73.5], [-38.3, -73.5], [-38.5, -73.45], [-38.78, -73.42], [-39.0, -73.25], [-39.4, -73.22], [-39.7, -73.35], [-39.88, -73.43], [-40.0, -73.6]];
  const andes = [[-37.6, -71.3], [-38.1, -71.45], [-38.6, -71.55], [-39.1, -71.6], [-39.6, -71.65], [-40.0, -71.7]];
  const path = (pts) => 'M' + pts.map(([la, ln]) => `${X(ln).toFixed(1)} ${Y(la).toFixed(1)}`).join(' L');
  let g = '';
  for (let la = -38; la >= -40; la -= 0.5) g += `<line class="grid" x1="0" x2="400" y1="${Y(la)}" y2="${Y(la)}" /><text x="2" y="${Y(la) - 3}" opacity=".5">${Math.abs(la).toFixed(1)}°S</text>`;
  g += `<path class="coast" d="${path(coast)}" /><path class="andes" d="${path(andes)}" />`;
  g += `<ellipse class="lake" cx="${X(-72.1)}" cy="${Y(-39.25)}" rx="16" ry="7" /><ellipse class="lake" cx="${X(-72.18)}" cy="${Y(-39.6)}" rx="10" ry="5" />`;
  [['Villarrica', -39.42, -71.93], ['Llaima', -38.69, -71.73]].forEach(([n, la, ln]) => { g += `<path d="M${X(ln) - 9} ${Y(la) + 7} L${X(ln)} ${Y(la) - 9} L${X(ln) + 9} ${Y(la) + 7} Z" fill="none" stroke="currentColor" opacity=".55" /><text x="${X(ln) - 14}" y="${Y(la) + 20}" opacity=".55">v. ${n}</text>`; });
  g += `<text x="${X(-73.6)}" y="${Y(-38.55)}" opacity=".55" transform="rotate(-90 ${X(-73.6)} ${Y(-38.55)})">Océano Pacífico</text>`;
  g += COMMUNES.map(([n, la, ln, c], i) => `<g data-c="${i}"><circle class="dot" cx="${X(ln)}" cy="${Y(la)}" r="${(3 + Math.sqrt(c) * 2.1).toFixed(1)}" /><circle class="core" cx="${X(ln)}" cy="${Y(la)}" r="2" />${c >= 7 && n !== 'Padre Las Casas' ? `<text x="${X(ln) + 6 + Math.sqrt(c) * 2}" y="${Y(la) + 3}">${n}</text>` : ''}</g>`).join('');
  svg.innerHTML = g; svg.style.color = 'var(--ink-2)';
  list.innerHTML = [...COMMUNES].map((c, i) => [c, i]).sort((a, b) => b[0][3] - a[0][3]).map(([[n, , , c], i]) => `<li data-c="${i}"><span>${n}</span><b>${c}</b></li>`).join('');
  const hl = (i) => { $$('[data-c]').forEach((el) => { const on = el.dataset.c === String(i); el.classList.toggle('hl', on); el.querySelector?.('.dot')?.classList.toggle('hl', on); }); tip.textContent = i == null ? '' : `${COMMUNES[i][0]} · ${COMMUNES[i][3]} clientes`; };
  [svg, list].forEach((el) => { el.addEventListener('pointerover', (e) => { const t = e.target.closest('[data-c]'); if (t) hl(+t.dataset.c); }); el.addEventListener('pointerleave', () => hl(null)); });
  // Las comunas aparecen una a una
  if (!reduced) {
    const dots = $$('.dot', svg); dots.forEach((d) => (d.style.transform = 'scale(0)'));
    const o = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; o.disconnect(); dots.forEach((d, i) => setTimeout(() => { d.style.transition = 'transform .6s cubic-bezier(.3,1.6,.5,1), fill-opacity .3s'; d.style.transform = ''; }, i * 90)); }, { threshold: 0.4 });
    o.observe(svg);
  }
})();

/* ───────────── 07 · Equipo, 08 · Notas, 09 · Preguntas ───────────── */
$('[data-team]').innerHTML = TEAM.map(([n, r, s]) => `<div class="member rv"><span class="member__in">${n.split(' ').map((w) => w[0]).join('')}</span><p style="margin:0"><b>${n}</b><span>${r}</span><i>${s}</i></p></div>`).join('');
const NOTE_C = ['#fdf6c9', '#dff0e4', '#fbe1d8', '#e3e8f7'];
$('[data-notes]').innerHTML = NOTES.map((x, i) => `<figure class="pin-note rv" style="--r:${x.r}deg;--c:${NOTE_C[i % 4]};margin:0"><p>${x.t}</p><cite>${x.who}<small>${x.place}</small></cite></figure>`).join('');
$('[data-faq]').innerHTML = FAQ.map(([q, a], i) => `<details class="rv"><summary><span>${String(i + 1).padStart(2, '0')}</span><span>${q}</span></summary><p>${a}</p></details>`).join('');

/* ───────────── 10 · Agenda del diagnóstico ───────────── */
(function book() {
  const days = [], form = $('[data-book]');
  let t = TODAY + DAY;
  while (days.length < 6) { t = nextBusiness(t); days.push(t); t += DAY; }
  let sd = days[0], ss = null;
  const SLOTS = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  $('[data-days]').innerHTML = days.map((d) => `<button type="button" role="radio" aria-checked="${d === sd}" data-d="${d}"><small>${weekday(d).slice(0, 3)}</small><b>${new Date(d).getUTCDate()}</b><small>${monthName(new Date(d).getUTCMonth()).slice(0, 3)}</small></button>`).join('');
  function slots() {
    $('[data-slots]').innerHTML = SLOTS.map((s) => { const free = hash(keyOf(sd) + s) > 0.38; return `<button type="button" role="radio" aria-checked="${s === ss}" data-s="${s}" ${free ? '' : 'disabled'}>${s}</button>`; }).join('');
  }
  $('[data-days]').addEventListener('click', (e) => { const b = e.target.closest('[data-d]'); if (!b) return; sd = +b.dataset.d; ss = null; $$('[data-d]').forEach((x) => x.setAttribute('aria-checked', x === b)); slots(); sound.key(); });
  $('[data-slots]').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (!b) return; ss = b.dataset.s; $$('[data-s]').forEach((x) => x.setAttribute('aria-checked', x === b)); sound.key(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!ss) { toast('Elija primero una hora disponible para su diagnóstico.'); return; }
    const fe = form.elements, name = fe.name.value.trim() || 'Su nombre', biz = fe.biz.value.trim() || 'Su negocio', mode = fe.mode.value;
    $('[data-voucher]').innerHTML = `<div class="ticket"><div><p style="margin:0">Comprobante N° ${Math.floor(hash(keyOf(sd) + ss + name) * 90000) + 10000}</p><b>${cap(fmtDay(sd))}, ${ss} h</b><p style="margin:0">${name} · ${biz}<br />${mode} · 30 minutos · sin costo</p></div><span class="seal">Agendado</span></div>`;
    toast('En el sitio real, la hora quedaría reservada en la agenda del estudio y le llegaría la confirmación por WhatsApp y correo.');
  });
  slots();
})();

/* ───────────── Visor de fotografías ───────────── */
const viewer = $('[data-viewer]');
document.addEventListener('click', async (e) => {
  const z = e.target.closest('[data-zoom]'); if (!z) return;
  const url = await firstUrl(z.dataset.zoom); if (!url) return;
  $('[data-viewer-img]').style.backgroundImage = `url('${url}')`;
  $('[data-viewer-cap]').textContent = z.querySelector('figcaption')?.textContent || z.getAttribute('aria-label') || '';
  viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden', 'false');
});
const closeV = () => { viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden', 'true'); };
$('[data-viewer-close]').addEventListener('click', closeV);
viewer.addEventListener('click', (e) => { if (e.target === viewer) closeV(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeV(); });

/* Sonido y año */
const sb = $('[data-sound]');
sb.addEventListener('click', () => { const on = sound.toggle(); sb.setAttribute('aria-pressed', on); sb.textContent = `Sonido de oficina: ${on ? 'encendido' : 'apagado'}`; sound.stamp(); });
$('[data-yr]').textContent = T.getUTCFullYear();
watch();
void isBusiness; void utc;

// Secciones de experiencia de la v2: mapa de la finca con recorridos, proceso del vino con scroll
// horizontal, maridaje de la cocina y el itinerario "Su día en Colchagua".
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const PHOTO = () => Object.fromEntries([...($('template[data-photos]')?.content.querySelectorAll('i') || [])].map((i) => [i.dataset.p, i.getAttribute('style')]));

/* ───────────── Mapa de la finca ───────────── */
const POIS = [
  { x: 500, y: 392, n: 1, k: 'Corazón de la viña', t: 'La casona de 1952', d: 'Adobe, tejas y un corredor con buganvilias. Aquí empieza cada visita con un café de grano.', p: 'casona' },
  { x: 600, y: 124, n: 2, k: 'Bajo tierra', t: 'La cava de adobe', d: 'Construida por Isabel en 1988. Mantiene 14 °C todo el año sin aire acondicionado.', p: 'cava' },
  { x: 205, y: 300, n: 3, k: 'Cuartel histórico', t: 'Carménère de 1952', d: 'Las parras que plantó Don Ernesto. Dan poco, pero dan el Gran Reserva.', p: 'uvas' },
  { x: 880, y: 140, n: 4, k: 'Mirador', t: 'El roble centenario', d: 'El árbol que da nombre a la viña, con más de 300 años. Desde aquí se ve todo el valle al atardecer.', p: 'cierre' },
  { x: 500, y: 500, n: 5, k: 'Agua y aves', t: 'La laguna', d: 'Riega los cuarteles bajos y es parada obligada de la cabalgata. Hay taguas y garzas.', p: 'otono' },
  { x: 230, y: 520, n: 6, k: 'Mesa larga', t: 'El almuerzo entre parras', d: 'Una mesa de 30 metros bajo un parrón de malbec, donde se sirve el menú de maridaje.', p: 'almuerzo' },
];
const ROUTES = {
  pie: 'M500 372 C505 300 500 230 540 170 S600 140 600 140 C520 200 360 240 250 290 C330 330 430 360 500 372',
  bici: 'M500 372 C620 350 760 340 820 300 C860 240 880 180 880 150 C910 230 900 360 800 460 C700 520 600 520 540 505 C500 470 495 420 500 372',
  caballo: 'M500 372 C400 360 260 380 180 430 C120 490 170 560 250 548 C330 536 420 520 470 506 C505 470 500 420 500 372',
};
export function initFinca() {
  const svg = $('[data-map]'); if (!svg) return;
  const ph = PHOTO();
  $('[data-pois]', svg).innerHTML = POIS.map((p, i) => `<g class="poi-pin" data-i="${i}" tabindex="0" role="button" aria-label="${p.t}" transform="translate(${p.x} ${p.y})"><circle r="16"/><circle r="15"/><text>${p.n}</text></g>`).join('');
  const show = (i) => {
    const p = POIS[i];
    $$('.poi-pin', svg).forEach((g) => g.classList.toggle('is-on', +g.dataset.i === i));
    $('[data-poi]').innerHTML = `<div class="poi__img" style="${ph[p.p] || ''}"></div><div><span>${p.k}</span><h3>${p.t}</h3><p>${p.d}</p></div>`;
  };
  $$('.poi-pin', svg).forEach((g) => { g.addEventListener('click', () => show(+g.dataset.i)); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(+g.dataset.i); } }); });
  const route = $('[data-route]', svg), rider = $('[data-rider]', svg);
  let raf;
  const draw = (id) => {
    $$('[data-tour]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tour === id)));
    route.setAttribute('d', ROUTES[id]);
    const len = route.getTotalLength();
    route.style.setProperty('--len', len);
    route.classList.remove('is-drawing'); void route.getBBox(); route.classList.add('is-drawing');
    cancelAnimationFrame(raf);
    const dur = id === 'pie' ? 7000 : id === 'bici' ? 9000 : 8000, t0 = performance.now();
    const move = (t) => { const k = ((t - t0) % dur) / dur, pt = route.getPointAtLength(k * len); rider.setAttribute('cx', pt.x); rider.setAttribute('cy', pt.y); raf = requestAnimationFrame(move); };
    raf = requestAnimationFrame(move);
  };
  $$('[data-tour]').forEach((b) => b.addEventListener('click', () => draw(b.dataset.tour)));
  show(0);
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); draw('pie'); } }, { threshold: 0.3 }).observe(svg);
}

/* ───────────── Del racimo a la copa ───────────── */
export function initProceso({ reduced }) {
  const sec = $('[data-proc]'), track = $('[data-proc-track]'); if (!sec) return;
  const bar = $('[data-proc-bar]'), drop = $('[data-proc-drop]'), months = $('[data-months]'), ferm = $('[data-ferm]');
  let shown = 0;
  const wide = () => innerWidth > 900 && !reduced;
  function frame() {
    if (!wide()) return;
    const r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
    const p = Math.max(0, Math.min(1, -r.top / total));
    const max = track.scrollWidth - innerWidth + 60;
    track.style.transform = `translateX(${-p * max}px)`;
    bar.style.width = `${p * 100}%`;
    drop.style.left = `${p * 100}%`;
    // Contador de meses en barrica cuando aparece ese paso
    const target = p > 0.52 ? 14 : 0;
    if (shown !== target) { shown += Math.sign(target - shown); months.textContent = shown; }
  }
  addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
  addEventListener('resize', frame);
  setInterval(() => { ferm.textContent = `${24 + Math.round(Math.random() * 4)} °C`; if (!wide()) { months.textContent = 14; } }, 900);
  frame();
}

/* ───────────── La cocina de la viña ───────────── */
const COURSES = [
  { k: 'Entrada', dish: 'Empanada de pino en horno de barro', desc: 'Masa de manteca, pino cortado a cuchillo, aceituna de la viña y huevo de campo.', wine: 'Rosé de Malbec 2024', color: '#e3889a', lvl: 62, why: 'La acidez y la fruta fresca del rosé limpian la grasa de la masa y hacen brillar el comino del pino.' },
  { k: 'Segundo', dish: 'Tártaro de trucha, palta y cilantro', desc: 'Trucha ahumada en casa sobre sarmientos de carménère, con palta de Peumo y limón de pica.', wine: 'Sauvignon Blanc Costa 2024', color: '#d9cf7a', lvl: 58, why: 'El pomelo y la tiza del sauvignon costero levantan el ahumado y piden otro bocado.' },
  { k: 'Fondo', dish: 'Cordero al palo con papas nativas', desc: 'Doce horas junto al fuego, con pebre cuchareado y papas chilotas al rescoldo.', wine: 'Carménère Gran Reserva 2021', color: '#5c0f2a', lvl: 70, why: 'La pimienta negra del carménère abraza el ahumado del cordero; sus taninos sedosos no compiten con la carne.' },
  { k: 'Postre', dish: 'Queque de membrillo y helado de leche asada', desc: 'Membrillo de nuestros árboles, miel de las colmenas entre parras y helado batido en casa.', wine: 'Late Harvest 2020', color: '#c98a2b', lvl: 46, why: 'Dulce con dulce, pero con acidez: el late harvest no empalaga y hace brillar el membrillo y la miel.' },
];
export function initCocina() {
  const box = $('[data-courses]'); if (!box) return;
  box.innerHTML = COURSES.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 2}" data-c="${i}"><span>${c.k}</span><b>${c.dish.split(' ').slice(0, 3).join(' ')}</b></button>`).join('');
  const wine = $('[data-mp-wine]');
  const show = (i) => {
    const c = COURSES[i];
    $$('[data-c]', box).forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.c === i)));
    // La copa se vacía y se vuelve a servir con el vino del tiempo elegido
    wine.setAttribute('y', 100);
    setTimeout(() => { wine.setAttribute('fill', c.color); wine.setAttribute('y', 100 - (c.lvl / 100) * 60); }, 420);
    ['k', 'dish', 'desc', 'wine-name', 'why'].forEach((f) => { const el = $(`[data-mp-${f}]`); el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
    $('[data-mp-k]').textContent = `${c.k} · ${i + 1} de 4`; $('[data-mp-dish]').textContent = c.dish; $('[data-mp-desc]').textContent = c.desc;
    $('[data-mp-wine-name]').textContent = c.wine; $('[data-mp-why]').textContent = c.why;
  };
  box.addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) show(+b.dataset.c); });
  wine.setAttribute('fill', COURSES[2].color);
  show(2);
}

/* ───────────── Su día en Colchagua ───────────── */
const PLANS = {
  clasico: { price: 151000, stops: [['10:00', 'Bienvenida en la casona', 'Café de grano y pan amasado en el corredor de buganvilias.', 'casona'], ['10:30', 'Caminata por el cuartel de 1952', 'Entre las parras de Don Ernesto, con la historia del carménère.', 'uvas'], ['11:30', 'Cata en la cava de adobe', 'Cinco vinos a la luz de las velas, directo desde la barrica.', 'cata'], ['13:00', 'Almuerzo de maridaje', 'Cuatro tiempos bajo el parrón, cada uno con su copa.', 'almuerzo'], ['15:30', 'Bicicleta al mirador', 'Once kilómetros suaves hasta el roble centenario.', 'bici'], ['17:30', 'Picnic al atardecer', 'Quesos de Colchagua y una botella mientras el valle se pone dorado.', 'queso'], ['19:00', 'Brindis final', 'La cordillera se tiñe de rosado. ¡Salud!', 'cierre']] },
  enologo: { price: 120000, stops: [['10:00', 'Con Daniela en la cava', 'La enóloga le presenta las barricas de la cosecha.', 'enologa'], ['10:30', 'Pruebas de barrica', 'Con la pipeta de vidrio, directo del roble.', 'barricas'], ['12:00', 'Taller de mezcla', 'Probetas, cuatro cepas y su propio ensamblaje.', 'mezcla'], ['13:30', 'Almuerzo con la enóloga', 'Menú de maridaje y conversación de vino.', 'almuerzo'], ['15:30', 'Embotellado y etiqueta', 'Llena, encorcha y etiqueta su botella.', 'copa'], ['17:00', 'Brindis en el mirador', 'Su vino, frente al valle.', 'cierre']] },
  vendimia: { price: 110000, stops: [['08:30', 'Desayuno de campo', 'Huevos de campo, sopaipillas y café en la casona.', 'casona'], ['09:00', 'Cosecha con tijera', 'Su propia caja de doce kilos de carménère.', 'cosecha'], ['11:00', 'Pisada de uva', 'Descalzos en la tina, como en 1952.', 'pisada'], ['13:00', 'Asado de vendimia', 'Cordero al palo y mesa larga con los cosecheros.', 'almuerzo'], ['15:30', 'Cabalgata entre parras', 'Con un huaso de la zona, por el estero y la laguna.', 'otono'], ['18:00', 'Cata del vino nuevo', 'El mosto recién fermentado, antes que nadie.', 'cata']] },
};
const SKY = [[0, '#c8dcea', '#f6e3c4'], [0.35, '#9cc4e4', '#eef3f6'], [0.7, '#e9b977', '#f6d7a6'], [0.88, '#7a3a5a', '#e07a5a'], [1, '#2a1630', '#a8506a']];
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(',')})`;
export function initDia({ reduced, onBook }) {
  const sec = $('[data-dia]'); if (!sec) return;
  const ph = PHOTO();
  let plan = 'clasico', t = 0, raf = null, cur = -1;
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const pt = (k) => [40 + 920 * k, 240 - 600 * k * (1 - k)]; // misma curva que el arco SVG (Q500 -60)
  function render() {
    const P = PLANS[plan];
    $('[data-arc-dots]').innerHTML = P.stops.map((s, i) => { const [x, y] = pt(i / (P.stops.length - 1)); return `<circle class="arc-dot" data-s="${i}" cx="${x}" cy="${y}" r="6"/><text class="arc-lbl" x="${x}" y="${y - 18}">${s[0]}</text>`; }).join('');
    $('[data-dia-list]').innerHTML = P.stops.map((s, i) => `<li data-s="${i}"><b>${s[0]}</b><span>${s[1]}</span></li>`).join('');
    $('[data-dia-total]').textContent = `Todo el día · ${clp(P.price)} por persona`;
    cur = -1; set(t);
  }
  function set(k) {
    t = Math.max(0, Math.min(1, k));
    const P = PLANS[plan], n = P.stops.length;
    const [x, y] = pt(t);
    const sun = $('[data-sun]'); sun.setAttribute('cx', x); sun.setAttribute('cy', y);
    let i = 0; while (i < SKY.length - 2 && t > SKY[i + 1][0]) i++;
    const a = SKY[i], b = SKY[i + 1], u = (t - a[0]) / (b[0] - a[0]);
    sec.style.setProperty('--s1', mix(a[1], b[1], u)); sec.style.setProperty('--s2', mix(a[2], b[2], u));
    sec.classList.toggle('is-dark', t > 0.86);
    sun.setAttribute('fill', t > 0.86 ? '#ff9a6a' : '#ffd27a');
    const m0 = toMin(P.stops[0][0]), m1 = toMin(P.stops[n - 1][0]), m = m0 + (m1 - m0) * t;
    $('[data-dia-clock]').textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`;
    const idx = Math.min(n - 1, Math.round(t * (n - 1)));
    if (idx !== cur) {
      cur = idx;
      const s = P.stops[idx];
      $('[data-dia-card]').innerHTML = `<div class="ph" style="${ph[s[3]] || ''}"></div><div><span>${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></div>`;
      $$('[data-dia-list] li').forEach((li) => li.classList.toggle('is-on', +li.dataset.s === idx));
      $$('.arc-dot').forEach((d) => d.classList.toggle('is-on', +d.dataset.s <= idx));
    }
  }
  function play() {
    if (raf) { cancelAnimationFrame(raf); raf = null; $('[data-dia-play]').textContent = '▶ Ver el día completo'; return; }
    let from = t >= 1 ? 0 : t, t0 = null;
    $('[data-dia-play]').textContent = '❚❚ Pausar';
    const step = (now) => { if (t0 == null) t0 = now; const k = from + (now - t0) / 14000; set(k); if (k < 1) raf = requestAnimationFrame(step); else { raf = null; $('[data-dia-play]').textContent = '↺ Ver otra vez'; } };
    raf = requestAnimationFrame(step);
  }
  const stopAt = (i) => { if (raf) play(); set(i / (PLANS[plan].stops.length - 1)); };
  $('[data-dia-play]').addEventListener('click', play);
  $('[data-dia-list]').addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) stopAt(+li.dataset.s); });
  $('[data-arc-dots]').addEventListener('click', (e) => { const d = e.target.closest('.arc-dot'); if (d) stopAt(+d.dataset.s); });
  $$('[data-plan]').forEach((b) => b.addEventListener('click', () => { plan = b.dataset.plan; $$('[data-plan]').forEach((x) => x.setAttribute('aria-selected', String(x === b))); if (raf) play(); t = 0; render(); }));
  $('[data-dia-book]').addEventListener('click', () => onBook(plan));
  render();
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); if (!reduced) setTimeout(play, 500); } }, { threshold: 0.4 }).observe(sec);
}

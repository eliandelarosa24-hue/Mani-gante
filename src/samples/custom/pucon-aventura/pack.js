// Mochila interactiva para el volcán: se tocan las cosas para meterlas, se suma el peso
// y la mochila avisa qué falta o si va muy pesada. Lo técnico lo pone el operador.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const ITEMS = [
  { n: 'Agua · 2 litros', kg: 2, need: true },
  { n: 'Chaqueta impermeable', kg: 0.6, need: true },
  { n: 'Primera capa térmica', kg: 0.3, need: true },
  { n: 'Guantes', kg: 0.2, need: true },
  { n: 'Lentes de sol categoría 4', kg: 0.1, need: true },
  { n: 'Bloqueador FPS 50', kg: 0.1, need: true },
  { n: 'Sándwich y frutos secos', kg: 0.6, need: true },
  { n: 'Gorro de lana', kg: 0.1, need: true },
  { n: 'Polerón de polar', kg: 0.5, need: false },
  { n: 'Celular o cámara', kg: 0.3, need: false },
  { n: 'Ropa de cambio', kg: 1.2, skip: 'Mejor déjela en la van: la tendrá al bajar.' },
  { n: 'Parlante portátil', kg: 0.9, skip: 'En la montaña se escucha el viento: déjelo en casa.' },
  { n: 'Crampones', kg: 0, ours: true },
  { n: 'Piolet', kg: 0, ours: true },
  { n: 'Casco', kg: 0, ours: true },
  { n: 'Máscara antigases', kg: 0, ours: true },
  { n: 'Polainas', kg: 0, ours: true },
  { n: 'Trineo para bajar', kg: 0, ours: true },
];

export function initPack() {
  const list = $('[data-pack]');
  if (!list) return;
  list.innerHTML = ITEMS.map((it, i) => `<li><button type="button" data-it="${i}" ${it.ours ? 'disabled class="is-ours"' : 'aria-pressed="false"'}><b>${it.n}</b><small>${it.ours ? 'Lo ponemos nosotros' : it.kg.toLocaleString('es-CL') + ' kg'}</small></button></li>`).join('');
  const inBag = new Set();
  const fill = $('[data-bag-fill]');
  let shown = 0;
  function update(last) {
    const kg = [...inBag].reduce((a, i) => a + ITEMS[i].kg, 0);
    // La mochila se llena hasta 8 kg
    const h = Math.min(1, kg / 8) * 200, top = 266 - h;
    fill.setAttribute('d', `M40 266 H180 V${top} H40z`);
    fill.classList.toggle('is-heavy', kg > 6);
    const from = shown, t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / 400); shown = from + (kg - from) * k; $('[data-pack-kg]').textContent = shown.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    const missing = ITEMS.filter((it, i) => it.need && !inBag.has(i));
    let msg;
    if (last != null && ITEMS[last].skip && inBag.has(last)) msg = ITEMS[last].skip;
    else if (!inBag.size) msg = 'Su mochila está vacía.';
    else if (kg > 6) msg = 'Muy pesada para subir 1.450 m: saque algo.';
    else if (!missing.length) msg = '¡Lista para la cumbre! Nos vemos a las 7:00.';
    else msg = `Le falta: ${missing.slice(0, 3).map((m) => m.n.toLowerCase()).join(', ')}${missing.length > 3 ? '…' : '.'}`;
    $('[data-pack-msg]').textContent = msg;
  }
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-it]');
    if (!b || b.disabled) return;
    const i = +b.dataset.it;
    inBag.has(i) ? inBag.delete(i) : inBag.add(i);
    b.classList.toggle('is-in', inBag.has(i));
    b.setAttribute('aria-pressed', String(inBag.has(i)));
    update(i);
  });
  update();
}

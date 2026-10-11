// Reserva con plano del salón: disponibilidad por fecha y hora, elección de mesa y total estimado.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

// x, y = centro; w, h = cubierta; seats = posiciones relativas de las sillas
const two = [[0, -30], [0, 30]];
const four = [[-24, -36], [24, -36], [-24, 36], [24, 36]];
const TABLES = [
  ...[100, 180, 260, 340].map((y, i) => ({ id: `V${i + 1}`, name: `Mesa ${i + 1} junto al ventanal`, x: 64, y, w: 40, h: 36, cap: 2, seats: two })),
  ...[110, 225, 345].map((y, i) => ({ id: `C${i + 1}`, name: `Mesa ${i + 5} para cuatro`, x: 168, y, w: 72, h: 46, cap: 4, seats: four })),
  { id: 'T', name: 'la mesa larga del trawün (compartida)', x: 318, y: 178, w: 196, h: 38, cap: 12, seats: [-80, -48, -16, 16, 48, 80].flatMap((dx) => [[dx, -32], [dx, 32]]) },
  { id: 'B', name: 'la barra frente al fogón', x: 486, y: 300, w: 30, h: 150, cap: 6, seats: [-60, -36, -12, 12, 36, 60].map((dy) => [-34, dy]) },
];

function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967295; }
const LUNCH = ['13:00', '13:30', '14:00', '14:30'], DINNER = ['19:30', '20:00', '20:30', '21:00', '21:30'];
const slotsFor = (dow) => [...([2, 3, 4, 5].includes(dow) ? LUNCH : []), ...([4, 5, 6].includes(dow) ? DINNER : [])];

export function initPlan() {
  const svg = $('[data-plan]'), form = $('[data-res]');
  if (!svg || !form) return;
  $('[data-tables]', svg).innerHTML = TABLES.map((t) => `
    <g class="tbl" data-id="${t.id}" tabindex="0" role="button" aria-label="${t.name}, ${t.cap} personas">
      ${t.seats.map(([dx, dy]) => `<circle class="seat" cx="${t.x + dx}" cy="${t.y + dy}" r="7" />`).join('')}
      <rect class="top" x="${t.x - t.w / 2}" y="${t.y - t.h / 2}" width="${t.w}" height="${t.h}" rx="${t.id === 'B' ? 14 : 6}" />
      <text x="${t.x}" y="${t.y}">${t.id === 'T' ? 'Trawün · 12' : t.id === 'B' ? '6' : t.cap}</text>
    </g>`).join('');
  const groups = $$('.tbl', svg);
  let slot = null, sel = null;

  // Primera fecha sugerida: la próxima noche de degustación con al menos dos días de margen
  const d0 = new Date(); d0.setDate(d0.getDate() + 2);
  while (![4, 5, 6].includes(d0.getDay())) d0.setDate(d0.getDate() + 1);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  form.date.min = iso(new Date());
  form.date.value = iso(d0);

  const dow = () => new Date(form.date.value + 'T12:00').getDay();
  function renderSlots() {
    const list = slotsFor(dow());
    const box = $('[data-slots]', form);
    if (!list.length) { box.innerHTML = '<p>Domingo y lunes descansa el fuego. Elija otra fecha.</p>'; slot = null; return; }
    if (!list.includes(slot)) slot = list.includes('20:00') ? '20:00' : list[0];
    box.innerHTML = list.map((s) => `<button type="button" role="radio" aria-checked="${s === slot}" data-slot="${s}">${s}</button>`).join('');
  }
  const busy = (t) => !slot || hash(`${form.date.value}|${slot}|${t.id}`) < ([5, 6].includes(dow()) ? 0.5 : 0.3);
  function renderTables() {
    groups.forEach((g) => {
      const t = TABLES.find((x) => x.id === g.dataset.id);
      const b = busy(t);
      g.classList.toggle('is-busy', b);
      g.setAttribute('aria-disabled', String(b));
      if (b && sel === t.id) sel = null;
      g.classList.toggle('is-sel', sel === t.id);
    });
  }
  function update() {
    const people = +form.people.value;
    const opt = form.exp.selectedOptions[0];
    const price = +opt.dataset.price, cake = form.cake.checked ? 15000 : 0;
    const t = TABLES.find((x) => x.id === sel);
    $('[data-r-table]').textContent = t ? `Su mesa: ${t.name}` : slot ? 'Elija una mesa libre en el plano' : 'Elija una fecha con servicio';
    $('[data-r-label]').textContent = `${people} × ${opt.textContent.split('·')[0].trim()}`;
    $('[data-r-base]').textContent = clp(price * people);
    $('[data-r-cake]').textContent = clp(cake);
    $('[data-r-total]').textContent = clp(price * people + cake);
    const warns = [];
    const dinner = slot && DINNER.includes(slot);
    if (slot && !dinner && opt.value !== 'carta') warns.push('Las degustaciones se sirven solo en la noche, de jueves a sábado.');
    if (dinner && opt.value === 'carta') warns.push('En la noche servimos solo el menú degustación.');
    if (t && people > t.cap) warns.push(`Esa mesa es para ${t.cap} personas como máximo.`);
    if (t?.id === 'B' && people > 3) warns.push('La barra es ideal para 1 a 3 personas: miran el fuego en fila.');
    $('[data-r-warn]').textContent = warns.join(' ');
  }
  function refresh() { renderSlots(); renderTables(); update(); }

  $('[data-slots]', form).addEventListener('click', (e) => {
    const b = e.target.closest('[data-slot]'); if (!b) return;
    slot = b.dataset.slot;
    $$('[data-slot]', form).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    renderTables(); update();
  });
  const pick = (g) => {
    if (g.classList.contains('is-busy')) { g.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 280 }); return; }
    sel = g.dataset.id;
    // Si la mesa es para pocas personas, se ajusta el grupo a su capacidad
    const t = TABLES.find((x) => x.id === sel);
    if (+form.people.value > t.cap) form.people.value = String(t.cap);
    renderTables(); update();
  };
  groups.forEach((g) => {
    g.addEventListener('click', () => pick(g));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(g); } });
  });
  form.addEventListener('input', (e) => { if (e.target.name === 'date') refresh(); else update(); });
  form.addEventListener('change', (e) => { if (e.target.name === 'date') refresh(); else update(); });
  refresh();
}

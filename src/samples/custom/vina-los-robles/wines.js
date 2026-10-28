// Vinos con rueda de aromas animada y caja de seis botellas con despacho gratis.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

const SECTORS = [['frutaRoja', 'Fruta roja', '#c2415e'], ['frutaNegra', 'Fruta negra', '#5c1a3c'], ['citricos', 'Cítricos', '#d8b04a'], ['flores', 'Flores', '#b07ab0'], ['hierbas', 'Hierbas', '#6f8a46'], ['especias', 'Especias', '#a8582a'], ['madera', 'Madera', '#8b5e3c'], ['tierra', 'Tierra', '#6a5a48']];
export const WINES = [
  { id: 'car', name: 'Carménère Gran Reserva', type: 'Tinto · 2021', pts: '93 pts', price: 18900, color: '#5c0f2a', a: { frutaNegra: 4, especias: 5, hierbas: 3, madera: 3, tierra: 2 }, notes: 'Pimienta negra, pimentón asado y mora madura. Taninos sedosos de parras plantadas en 1952.', pair: 'Cordero al palo o pastel de choclo.' },
  { id: 'cab', name: 'Cabernet Sauvignon Reserva', type: 'Tinto · 2022', pts: '90 pts', price: 11900, color: '#3a0f24', a: { frutaNegra: 5, madera: 4, hierbas: 2, especias: 2, tierra: 2 }, notes: 'Cassis, cedro y un toque de grafito. Clásico y elegante.', pair: 'Asado de vacuno a las brasas.' },
  { id: 'don', name: 'Ensamblaje Don Ernesto', type: 'Ícono · 2019', pts: '95 pts', price: 29900, color: '#2e0a1c', a: { frutaNegra: 4, frutaRoja: 2, especias: 4, madera: 5, tierra: 3 }, notes: 'Carménère, cabernet y syrah con 20 meses en barrica. Chocolate amargo, tabaco y mucha guarda.', pair: 'Costillar al horno de barro.' },
  { id: 'nat', name: 'Carménère Natural', type: 'Sin sulfitos · 2023', pts: '91 pts', price: 16900, color: '#7a1838', a: { frutaRoja: 4, frutaNegra: 3, hierbas: 4, tierra: 4, flores: 2 }, notes: 'Fermentación espontánea: cereza ácida, hierbas del campo y tierra húmeda.', pair: 'Charcutería y quesos de cabra.' },
  { id: 'sb', name: 'Sauvignon Blanc Costa', type: 'Blanco · 2024', pts: '92 pts', price: 9900, color: '#d9cf7a', a: { citricos: 5, hierbas: 5, flores: 3, frutaRoja: 1 }, notes: 'De Paredones, junto al mar: pomelo, ruda y tiza.', pair: 'Ceviche, ostras y machas a la parmesana.' },
  { id: 'rose', name: 'Rosé de Malbec', type: 'Rosado · 2024', pts: '89 pts', price: 10900, color: '#e3889a', a: { frutaRoja: 5, citricos: 4, flores: 3 }, notes: 'Frutilla, pomelo rosado y pétalos. El verano en una copa.', pair: 'Sushi, ensaladas y tardes de piscina.' },
  { id: 'lh', name: 'Late Harvest', type: 'Cosecha tardía · 2020', pts: '92 pts', price: 14900, color: '#c98a2b', a: { citricos: 4, flores: 4, especias: 1, frutaRoja: 1, madera: 2 }, notes: 'Damasco seco, miel de ulmo y azahar. Dulce sin empalagar.', pair: 'Postres de fruta y quesos azules.' },
];

export function initWines({ onAdd }) {
  const list = $('[data-wines]'), svg = $('[data-wheel]');
  if (!list) return;
  list.innerHTML = WINES.map((w) => `<li><button type="button" aria-pressed="false" data-w="${w.id}"><b>${w.name}</b><small>${w.type} · ${w.pts}</small><span>${clp(w.price)}</span></button></li>`).join('');
  const R0 = 64, RMAX = 190, n = SECTORS.length;
  const arc = (i, r) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.012, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.012;
    const p = (a, rr) => `${200 + Math.cos(a) * rr} ${200 + Math.sin(a) * rr}`;
    return `M${p(a0, R0)} L${p(a0, r)} A${r} ${r} 0 0 1 ${p(a1, r)} L${p(a1, R0)} A${R0} ${R0} 0 0 0 ${p(a0, R0)}Z`;
  };
  svg.innerHTML = '<circle cx="200" cy="200" r="190" fill="none" stroke="rgba(201,166,107,.25)"/><circle cx="200" cy="200" r="127" fill="none" stroke="rgba(201,166,107,.12)" stroke-dasharray="2 6"/>'
    + SECTORS.map(([id, , col], i) => `<path class="sec-a" data-s="${id}" d="${arc(i, R0 + 10)}" fill="${col}" opacity=".9"/>`).join('')
    + SECTORS.map(([, label], i) => { const a = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2; return `<text x="${200 + Math.cos(a) * 172}" y="${200 + Math.sin(a) * 172}">${label}</text>`; }).join('');
  const paths = $$('.sec-a', svg);
  let cur = SECTORS.map(() => R0 + 10), raf = null;

  function show(id) {
    const w = WINES.find((x) => x.id === id);
    $$('[data-w]', list).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.w === id)));
    $('[data-w-type]').textContent = w.type; $('[data-w-name]').textContent = w.name; $('[data-w-pts]').textContent = w.pts;
    $('[data-w-notes]').textContent = w.notes; $('[data-w-pair]').textContent = w.pair; $('[data-w-price]').textContent = clp(w.price);
    $('[data-w-add]').dataset.id = id;
    const target = SECTORS.map(([sid]) => R0 + 10 + ((w.a[sid] || 0) / 5) * (RMAX - R0 - 30));
    const from = cur.slice(), t0 = performance.now();
    cancelAnimationFrame(raf);
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 700), e = 1 - (1 - k) ** 3;
      cur = from.map((f, i) => f + (target[i] - f) * e);
      paths.forEach((p, i) => { p.setAttribute('d', arc(i, cur[i])); p.setAttribute('opacity', (w.a[SECTORS[i][0]] ? 0.95 : 0.25).toString()); });
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  list.addEventListener('click', (e) => { const b = e.target.closest('[data-w]'); if (b) show(b.dataset.w); });

  // Caja de seis
  const box = [];
  const renderBox = () => {
    $('[data-box]').innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${box[i] ? 'on' : ''}" style="--bc:${box[i]?.color || 'transparent'}"></i>`).join('');
    const nB = box.length, left = Math.max(0, 6 - nB), total = box.reduce((a, w) => a + w.price, 0);
    $('[data-box-txt]').textContent = !nB ? 'Su caja está vacía.' : left ? `${nB} ${nB === 1 ? 'botella' : 'botellas'} · ${clp(total)} · le faltan ${left} para el despacho gratis` : `${nB} botellas · ${clp(total)} · ¡despacho gratis a todo Chile!`;
    $('[data-box-bar]').style.width = `${Math.min(100, (nB / 6) * 100)}%`;
  };
  $('[data-w-add]').addEventListener('click', (e) => { const w = WINES.find((x) => x.id === e.currentTarget.dataset.id); box.push(w); renderBox(); onAdd(box.length); });
  renderBox();
  show('car');
}

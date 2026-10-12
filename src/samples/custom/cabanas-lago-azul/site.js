// Carta del predio: orilla, curvas de profundidad (isobatas), sondas, bosque, sendero, muelles y
// las seis casas. Todo se genera aquí, en coordenadas de un plano de 1200 × 640.
const NS = 'http://www.w3.org/2000/svg';
export const shore = (x) => 400 + 34 * Math.sin(x / 180 + 0.6) + 14 * Math.sin(x / 57 + 1.3) - x * 0.05;
const r1 = (n) => Math.round(n * 10) / 10;

// Posición de cada casa: x a lo largo de la orilla y altura sobre el agua según su distancia real
export const SPOTS = {
  playa: { x: 250 }, muelle: { x: 470 }, arrayan: { x: 345 }, bosque: { x: 630 }, mirador: { x: 865 }, refugio: { x: 1065 },
};
export const POIS = [
  { id: 'pier', x: 494, n: 'Muelle norte', d: 'Cuarenta metros de madera de coigüe. Al amanecer, el volcán se refleja completo.', ph: 'hero' },
  { id: 'kids', x: 196, n: 'Muelle de los niños', d: 'Fondo de arena y agua quieta. Salvavidas en enero y febrero.', ph: 'muelle-ninos' },
  { id: 'kayak', x: 300, n: 'Galpón de kayaks', d: 'Seis kayaks dobles y tres tablas de SUP, incluidos.', ph: 'kayak' },
  { id: 'quincho', x: 700, n: 'Quincho de la Bosque', d: 'Parrilla, fogón y mesa larga bajo techo.', ph: 'quincho' },
  { id: 'tinaja', x: 960, n: 'Tinajas', d: 'Una privada en la Mirador y otra junto al sendero, a leña de roble.', ph: 'tinaja' },
  { id: 'punta', x: 1150, n: 'La punta', d: 'Final del sendero de arrayanes: 900 m de bosque nativo.', ph: 'otono' },
];

function pathFrom(fn, x0, x1, step = 10) {
  let d = `M${x0} ${r1(fn(x0))}`;
  for (let x = x0 + step; x <= x1; x += step) d += ` L${x} ${r1(fn(x))}`;
  return d;
}

export function drawChart(svg, cabins) {
  const el = (tag, attrs = {}, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.append(e); return e; };
  svg.innerHTML = '';
  cabins.forEach((c) => (SPOTS[c.id].y = shore(SPOTS[c.id].x) - (34 + c.agua * 2.1)));
  const g = (cls) => el('g', { class: cls });

  // Agua y tierra
  const water = g('ch-water');
  el('rect', { x: 0, y: 0, width: 1200, height: 640, class: 'ch-lake' }, water);
  el('path', { d: `${pathFrom(shore, 0, 1200)} L1200 0 L0 0 Z`, class: 'ch-land' }, g('ch-landg'));

  // Isobatas: cada curva se aleja de la orilla y se suaviza con la profundidad
  const iso = g('ch-iso');
  [[2, 16], [5, 38], [10, 68], [20, 108], [40, 160], [80, 215]].forEach(([m, off], i) => {
    const damp = 1 - i * 0.13;
    const f = (x) => 400 + off + (34 * Math.sin(x / 180 + 0.6 + i * 0.12) + 14 * Math.sin(x / 57 + 1.3) * damp * damp) * damp - x * 0.05 * (1 - i * 0.08);
    el('path', { d: pathFrom(f, 0, 1200, 12), class: 'ch-isoline', style: `--i:${i}` }, iso);
    const lx = 120 + i * 170;
    const t = el('text', { x: lx, y: r1(f(lx) - 3), class: 'ch-depth' }, iso); t.textContent = `${m} m`;
  });
  // Sondas dispersas
  const snd = g('ch-snd');
  let s = 11; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 46; k++) {
    const x = 30 + rnd() * 1140, y = shore(x) + 30 + rnd() * 220;
    if (y > 625) continue;
    const d = Math.round(1 + Math.pow((y - shore(x)) / 230, 1.6) * 90);
    const t = el('text', { x: r1(x), y: r1(y), class: 'ch-sound' }, snd); t.textContent = d;
  }
  // Orilla con playa (doble línea punteada)
  el('path', { d: pathFrom(shore, 0, 1200, 6), class: 'ch-shore' });
  el('path', { d: pathFrom((x) => shore(x) - 7, 0, 1200, 6), class: 'ch-beach' });

  // Camino y acceso
  const road = g('ch-road');
  el('path', { d: 'M0 40 C300 30 600 52 1200 34', class: 'ch-roadline' }, road);
  el('path', { d: 'M0 52 C300 42 600 64 1200 46', class: 'ch-roadline' }, road);
  const rt = el('text', { x: 700, y: 30, class: 'ch-label' }, road); rt.textContent = 'Camino Villarrica – Pucón · km 8';
  el('path', { d: 'M150 50 C150 90 140 110 150 140', class: 'ch-path' }, road);
  el('rect', { x: 128, y: 140, width: 44, height: 26, class: 'ch-rec' }, road);
  const rc = el('text', { x: 150, y: 182, class: 'ch-label ch-c' }, road); rc.textContent = 'Recepción';

  // Colina de la Mirador
  const hill = g('ch-hill');
  [[150, 70], [112, 50], [76, 33], [42, 18]].forEach(([rx, ry]) => el('ellipse', { cx: 860, cy: 150, rx, ry, class: 'ch-contour' }, hill));
  const ht = el('text', { x: 860, y: 84, class: 'ch-label ch-c' }, hill); ht.textContent = '+14 m';

  // Bosque: árboles en malla irregular que evitan casas, camino y orilla
  const trees = g('ch-trees');
  const keep = cabins.map((c) => ({ x: SPOTS[c.id].x, y: SPOTS[c.id].y }));
  for (let y = 70; y < 420; y += 22) for (let x = 10; x < 1200; x += 24) {
    const tx = x + (rnd() - 0.5) * 16, ty = y + (rnd() - 0.5) * 14;
    if (ty > shore(tx) - 24) continue;
    if (keep.some((k) => Math.hypot(k.x - tx, k.y - ty) < 62)) continue;
    if (Math.abs(tx - 150) < 40 && ty < 200) continue;
    const dense = tx > 280 && tx < 420 || tx > 960;
    if (rnd() > (dense ? 0.78 : 0.42)) continue;
    const r = 4 + rnd() * 5;
    el('circle', { cx: r1(tx), cy: r1(ty), r: r1(r), class: 'ch-tree' }, trees);
  }

  // Sendero de arrayanes
  el('path', { d: 'M172 160 C260 210 300 190 345 200 S520 250 630 250 S800 300 865 290 S1000 260 1065 250 S1150 290 1160 320', class: 'ch-trail', 'data-trail': '' });

  // Muelles
  const pier = (x, len, t) => { const y = shore(x); el('path', { d: `M${x} ${r1(y)} V${r1(y + len)} ${t ? `M${x - 16} ${r1(y + len)} H${x + 16}` : ''}`, class: 'ch-pier' }); };
  pier(494, 92, true); pier(196, 46, false);

  // Puntos de interés
  const pois = g('ch-pois');
  POIS.forEach((p) => {
    const y = p.id === 'pier' ? shore(p.x) + 92 : p.id === 'kids' ? shore(p.x) + 46 : p.id === 'kayak' ? shore(p.x) - 18 : p.id === 'quincho' ? shore(p.x) - 120 : p.id === 'tinaja' ? shore(p.x) - 150 : shore(p.x) - 30;
    p.y = y;
    const a = el('g', { class: 'ch-poi', 'data-poi': p.id, tabindex: 0, transform: `translate(${p.x} ${r1(y)})` }, pois);
    el('circle', { r: 11, class: 'ch-poi__hit' }, a); el('circle', { r: 4.5, class: 'ch-poi__dot' }, a);
  });

  // Casas: huella proporcional a la superficie, girada hacia el agua
  const houses = g('ch-houses');
  cabins.forEach((c) => {
    const sp = SPOTS[c.id];
    const w = Math.sqrt(c.m2) * 5.8, h = w * 0.62;
    const ang = Math.atan2(shore(sp.x + 5) - shore(sp.x - 5), 10) * 57.3;
    const a = el('g', { class: 'ch-house', 'data-house': c.id, tabindex: 0, role: 'button', 'aria-label': `Casa ${c.n}`, transform: `translate(${sp.x} ${r1(sp.y)}) rotate(${r1(ang)})` }, houses);
    el('rect', { x: r1(-w / 2), y: r1(-h / 2), width: r1(w), height: r1(h), class: 'ch-house__fp' }, a);
    el('path', { d: `M${r1(-w / 2)} ${r1(h / 2 + 5)} H${r1(w / 2)}`, class: 'ch-house__deck' }, a);
    const n = el('text', { y: 3.5, class: 'ch-house__n' }, a); n.textContent = c.no;
    const l = el('text', { y: r1(-h / 2 - 8), class: 'ch-house__l' }, a); l.textContent = c.n;
  });

  // Rosa de los vientos, escala, título y volcán
  const deco = g('ch-deco');
  const rose = el('g', { transform: 'translate(1120 110)' }, deco);
  el('circle', { r: 26, class: 'ch-rose' }, rose); el('circle', { r: 18, class: 'ch-rose' }, rose);
  el('path', { d: 'M0 -34 L5 0 L0 34 L-5 0 Z', class: 'ch-rose__n' }, rose);
  el('path', { d: 'M-34 0 L0 4 L34 0 L0 -4 Z', class: 'ch-rose__e' }, rose);
  const nt = el('text', { y: -40, class: 'ch-label ch-c' }, rose); nt.textContent = 'N';
  const sc = el('g', { transform: 'translate(40 612)' }, deco);
  el('path', { d: 'M0 0 H100 M0 -4 V4 M50 -3 V3 M100 -4 V4', class: 'ch-scale' }, sc);
  const st = el('text', { x: 108, y: 4, class: 'ch-label' }, sc); st.textContent = '50 m';
  const lt = el('text', { x: 660, y: 560, class: 'ch-lakename' }, deco); lt.textContent = 'Lago Villarrica';
  const vt = el('text', { x: 1170, y: 615, class: 'ch-label ch-r' }, deco); vt.textContent = 'Volcán Villarrica 29 km ↘';

  return { el };
}

// Mezclador de merkén: pocillo de greda con granos que se revuelven con el dedo,
// perfil de sabor y nombre de la mezcla según la receta.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const HOUSE = { aji: 70, cil: 20, sal: 10, com: 0, humo: 72 };
const TYPES = ['aji', 'cil', 'sal', 'com'];

function blend(v) {
  const tot = v.aji + v.cil + v.sal + v.com;
  if (!tot) return { name: 'Un pocillo <em>vacío</em>', use: 'Agregue ají para empezar: es el alma del merkén.', prof: [0, 0, 0, 0], share: { aji: 0, cil: 0, sal: 0, com: 0 } };
  const sh = Object.fromEntries(TYPES.map((t) => [t, v[t] / tot]));
  const prof = [sh.aji, sh.aji * (v.humo / 72), Math.min(1, (sh.cil + sh.com * 0.8) * 1.8), Math.min(1, sh.sal * 3.2)];
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  let name, use;
  if (near(sh.aji, 0.7, 0.06) && near(sh.cil, 0.2, 0.06) && near(sh.sal, 0.1, 0.04) && sh.com < 0.04 && v.humo >= 60) [name, use] = ['Merkén <em>de la abuela</em>', 'La receta de la casa, igual que en Chol Chol. Sirve para todo: carnes, sopaipillas y hasta el chocolate.'];
  else if (sh.sal > 0.3) [name, use] = ['Merkén <em>de mar</em>', 'Muy salado, como lo usan en la costa lafkenche: ideal para curar pescado o sobre papas nativas.'];
  else if (v.humo < 12) [name, use] = ['Merkén <em>sin humo</em>', 'Así es el ají antes del ahumado: fresco, frutal y de color vivo. Pruébelo en ensaladas y ceviche.'];
  else if (sh.aji >= 0.8 && v.humo >= 48) [name, use] = ['Merkén <em>bravo</em>', 'Picante y profundo, para valientes. Perfecto sobre el cordero al rescoldo.'];
  else if (sh.com > 0.15) [name, use] = ['Merkén <em>pewenche</em>', 'El comino le da un tono cálido de cordillera. Para cazuelas, porotos y piñones.'];
  else if (sh.aji < 0.4) [name, use] = ['Merkén <em>del bosque</em>', 'Más aroma que picor: el cilantro manda. Para quesos de cabra, huevos y verduras.'];
  else [name, use] = ['Merkén <em>de autor</em>', 'Una mezcla propia. La chef la probaría con cordero y un hilo de miel de ulmo.'];
  return { name, use, prof, share: sh };
}

export function initMerken({ reduced }) {
  const cv = $('[data-mk-canvas]');
  if (!cv) return;
  const c = cv.getContext('2d');
  const inputs = Object.fromEntries($$('[data-mk]').map((i) => [i.dataset.mk, i]));
  const val = () => Object.fromEntries(Object.entries(inputs).map(([k, i]) => [k, +i.value]));
  const N = 950;
  const grains = Array.from({ length: N }, () => ({ a: Math.random() * 6.283, d: Math.sqrt(Math.random()) * 0.92, u: Math.random(), s: 0.6 + Math.random() * 0.8, r: Math.random() * 6.283, j: Math.random() }));
  let size = 0, dpr = 1, omega = 0, visible = false, cum = [0, 0, 0, 0], humo = 72;
  $('[data-mk-profile]').innerHTML = ['Picor', 'Humo', 'Aroma', 'Sal'].map((n) => `<div><i><em></em></i>${n}</div>`).join('');
  const bars = $$('[data-mk-profile] em');

  function update() {
    const v = val(), b = blend(v);
    humo = v.humo;
    let acc = 0; cum = TYPES.map((t) => (acc += b.share[t]));
    $('[data-mk-name]').innerHTML = b.name;
    $('[data-mk-use]').textContent = b.use;
    TYPES.forEach((t) => ($(`[data-mk-v="${t}"]`).textContent = `${Math.round(b.share[t] * 100)} %`));
    $('[data-mk-v="humo"]').textContent = `${v.humo} h`;
    b.prof.forEach((p, i) => (bars[i].style.height = `${Math.round(p * 100)}%`));
    omega += 0.02;
  }
  const typeOf = (u) => { const i = cum.findIndex((x) => u * 0.99999 < x); return i < 0 ? null : TYPES[i]; };

  function resize() {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    size = r.width;
    cv.width = cv.height = size * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function draw() {
    const S = size, cx = S / 2, cy = S / 2, R = S * 0.46, r = R * 0.8;
    c.clearRect(0, 0, S, S);
    // Sombra y pocillo de greda
    c.save(); c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = S * 0.08; c.shadowOffsetY = S * 0.04;
    const rim = c.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R);
    rim.addColorStop(0, '#b0603a'); rim.addColorStop(0.7, '#7a3a1f'); rim.addColorStop(1, '#4a2212');
    c.fillStyle = rim; c.beginPath(); c.arc(cx, cy, R, 0, 6.283); c.fill(); c.restore();
    const inner = c.createRadialGradient(cx, cy - r * 0.2, r * 0.1, cx, cy, r);
    inner.addColorStop(0, '#3a1a0d'); inner.addColorStop(1, '#1d0c05');
    c.fillStyle = inner; c.beginPath(); c.arc(cx, cy, r, 0, 6.283); c.fill();
    // Granos
    const smoke = humo / 72;
    const ajiCol = (j) => `hsl(${6 + j * 8}, ${78 - smoke * 25}%, ${46 - smoke * 22 + j * 6}%)`;
    for (const g of grains) {
      const t = typeOf(g.u);
      if (!t) continue;
      g.a += omega * (1.15 - g.d * 0.6) + (reduced ? 0 : (g.j - 0.5) * 0.0015);
      const x = cx + Math.cos(g.a) * g.d * r * 0.95, y = cy + Math.sin(g.a) * g.d * r * 0.95;
      const z = S / 520;
      c.save(); c.translate(x, y); c.rotate(g.r + g.a);
      if (t === 'aji') { c.fillStyle = ajiCol(g.j); c.fillRect(-2.6 * g.s * z, -1.6 * g.s * z, 5.2 * g.s * z, 3.2 * g.s * z); }
      else if (t === 'cil') { c.fillStyle = g.j > 0.5 ? '#c9a46a' : '#a98048'; c.beginPath(); c.arc(0, 0, 2.3 * g.s * z, 0, 6.283); c.fill(); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-0.4 * z, -2 * z, 0.8 * z, 4 * z); }
      else if (t === 'sal') { c.fillStyle = `rgba(250,246,238,${0.75 + g.j * 0.25})`; c.fillRect(-1.6 * g.s * z, -1.6 * g.s * z, 3.2 * g.s * z, 3.2 * g.s * z); }
      else { c.fillStyle = '#7a5a32'; c.beginPath(); c.ellipse(0, 0, 3.2 * g.s * z, 1.1 * g.s * z, 0, 0, 6.283); c.fill(); }
      c.restore();
    }
    // Brillo del borde
    c.strokeStyle = 'rgba(255,200,150,.18)'; c.lineWidth = S * 0.006;
    c.beginPath(); c.arc(cx, cy, R * 0.9, Math.PI * 1.05, Math.PI * 1.6); c.stroke();
    omega *= 0.95;
  }
  function loop() { if (!visible) return; draw(); requestAnimationFrame(loop); }

  // Revolver con el dedo: el movimiento tangencial al centro hace girar los granos
  let last = null;
  cv.addEventListener('pointerdown', (e) => { last = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => {
    if (!last) return;
    const r = cv.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a0 = Math.atan2(last[1] - cy, last[0] - cx), a1 = Math.atan2(e.clientY - cy, e.clientX - cx);
    let d = a1 - a0; if (d > Math.PI) d -= 6.283; if (d < -Math.PI) d += 6.283;
    omega = Math.max(-0.25, Math.min(0.25, omega * 0.6 + d * 0.8));
    last = [e.clientX, e.clientY];
  });
  const stop = () => (last = null);
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);

  Object.values(inputs).forEach((i) => i.addEventListener('input', update));
  $('[data-mk-house]').addEventListener('click', () => { Object.entries(HOUSE).forEach(([k, v]) => (inputs[k].value = v)); update(); omega = 0.18; });
  resize(); update();
  addEventListener('resize', resize);
  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) { resize(); requestAnimationFrame(loop); } }).observe(cv);
}

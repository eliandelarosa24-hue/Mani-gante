// Planetario interactivo: descubrir constelaciones del cielo austral uniendo estrellas, o crear una propia.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Coordenadas normalizadas (0 a 1) dentro del lienzo. Las aristas son pares de índices.
const FIGURES = {
  cruz: {
    name: 'Pünon Choike', alt: 'Cruz del Sur',
    stars: [[0.5, 0.18, 3.2, 'Gacrux'], [0.53, 0.8, 3.8, 'Acrux'], [0.3, 0.46, 3.4, 'Mimosa'], [0.71, 0.42, 2.6, 'Delta Crucis'], [0.6, 0.6, 1.8, 'Ginan'], [0.08, 0.86, 3.8, 'Alfa Centauri'], [0.17, 0.7, 3.3, 'Hadar']],
    edges: [[0, 1], [2, 3], [5, 6]],
    red: [0],
    story: 'Para el pueblo mapuche es la huella del ñandú (choike) corriendo por el cielo. Las dos estrellas brillantes de la izquierda, los «punteros», siempre señalan la cruz: así la encontrará esta noche desde su domo.',
  },
  orion: {
    name: 'Las Tres Marías', alt: 'Orión, de cabeza',
    stars: [[0.4, 0.5, 2.8, 'Alnitak'], [0.5, 0.48, 2.8, 'Alnilam'], [0.6, 0.46, 2.8, 'Mintaka'], [0.66, 0.8, 3.8, 'Betelgeuse'], [0.34, 0.78, 3, 'Bellatrix'], [0.32, 0.17, 3.8, 'Rigel'], [0.64, 0.2, 2.8, 'Saiph']],
    edges: [[0, 1], [1, 2], [2, 3], [0, 4], [3, 4], [0, 5], [2, 6], [5, 6]],
    red: [3],
    story: 'Desde el sur, el cazador Orión aparece de cabeza: Rigel arriba y la roja Betelgeuse abajo. Bajo el cinturón de las Tres Marías vive la nebulosa de Orión, que verá en el telescopio de su domo.',
  },
  escorpion: {
    name: 'Escorpión', alt: 'El corazón rojo',
    stars: [[0.8, 0.14, 2.4, 'Acrab'], [0.76, 0.25, 2.8, 'Dschubba'], [0.84, 0.34, 2.2, 'Pi Scorpii'], [0.68, 0.33, 2.2, 'Sigma Scorpii'], [0.6, 0.42, 4, 'Antares'], [0.55, 0.52, 2.2, 'Tau Scorpii'], [0.52, 0.63, 2.4, 'Épsilon'], [0.46, 0.74, 2.2, 'Mu'], [0.37, 0.82, 2.4, 'Zeta'], [0.26, 0.82, 2.6, 'Theta'], [0.19, 0.73, 2.4, 'Kappa'], [0.24, 0.63, 3.2, 'Shaula']],
    edges: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]],
    red: [4],
    story: 'Antares, su corazón rojo, es unas 700 veces más grande que el Sol. En invierno el escorpión cruza justo sobre los domos y su cola apunta al centro de la Vía Láctea.',
  },
};

export function initTrace({ reduced }) {
  const root = $('#trazar');
  if (!root) return;
  const cv = $('[data-trace-canvas]', root), c = cv.getContext('2d');
  let w = 0, h = 0, dpr = 1, mode = 'reto', fig = 'cruz', visible = false, hover = -1, current = -1, ptr = null, t0 = performance.now();
  let found = new Set(), flash = null, done = new Set(), bursts = [];
  let free = [], strokes = [];

  // Fondo y estrellas libres con semilla fija: el cielo es siempre el mismo.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const dust = Array.from({ length: 520 }, () => ({ x: rnd(), y: rnd(), r: rnd() ** 3 * 1.3 + 0.2, a: 0.15 + rnd() * 0.5, p: rnd() * 6.3 }));
  const field = [];
  while (field.length < 64) {
    const s = [0.05 + rnd() * 0.9, 0.06 + rnd() * 0.88, 1.4 + rnd() ** 2 * 2.4];
    if (field.every((f) => Math.hypot(f[0] - s[0], f[1] - s[1]) > 0.075)) field.push(s);
  }

  // Estrellas que se pueden tocar en el modo actual
  function pickable() {
    if (mode === 'libre') return field;
    const F = FIGURES[fig];
    const decoys = field.filter((f) => F.stars.every((s) => Math.hypot(f[0] - s[0], f[1] - s[1]) > 0.11)).slice(0, 22).map((f) => [f[0], f[1], Math.min(f[2], 2)]);
    return [...F.stars, ...decoys];
  }
  let pts = pickable();

  function size() {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const P = (s) => [s[0] * w, s[1] * h];
  function nearest(x, y) {
    let best = -1, bd = Math.max(26, w * 0.035);
    pts.forEach((s, i) => { const [sx, sy] = P(s); const d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

  function line(a, b, color, width, glow) {
    const [ax, ay] = P(pts[a]), [bx, by] = P(pts[b]);
    c.save();
    if (glow) { c.shadowColor = color; c.shadowBlur = glow; }
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
    c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
    c.restore();
  }

  function draw(now) {
    const t = (now - t0) / 1000;
    c.clearRect(0, 0, w, h);
    const g = c.createRadialGradient(w * 0.5, h * 0.55, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.75);
    g.addColorStop(0, '#141238'); g.addColorStop(1, '#05060f');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (const d of dust) {
      c.fillStyle = `rgba(233,236,247,${d.a * (reduced ? 1 : 0.7 + 0.3 * Math.sin(t * 1.3 + d.p))})`;
      c.fillRect(d.x * w, d.y * h, d.r, d.r);
    }

    if (mode === 'reto') {
      const F = FIGURES[fig];
      if (flash?.hint && now < flash.until) F.edges.forEach(([a, b]) => { if (!found.has(key(a, b))) line(a, b, 'rgba(185,162,255,.28)', 1, 0); });
      F.edges.forEach(([a, b]) => { if (found.has(key(a, b))) line(a, b, done.has(fig) ? 'rgba(143,227,255,.95)' : 'rgba(185,162,255,.9)', done.has(fig) ? 2 : 1.6, done.has(fig) ? 14 : 8); });
      if (flash?.bad && now < flash.until) line(flash.bad[0], flash.bad[1], `rgba(255,120,120,${(flash.until - now) / 600})`, 1.4, 0);
    } else {
      strokes.forEach(([a, b]) => line(a, b, 'rgba(185,162,255,.9)', 1.6, 10));
    }
    if (current >= 0 && ptr) {
      const [ax, ay] = P(pts[current]);
      c.setLineDash([4, 6]); c.strokeStyle = 'rgba(233,236,247,.45)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(ax, ay); c.lineTo(ptr[0], ptr[1]); c.stroke(); c.setLineDash([]);
    }

    pts.forEach((s, i) => {
      const [x, y] = P(s);
      const isTarget = mode === 'reto' && i < FIGURES[fig].stars.length;
      const red = isTarget && FIGURES[fig].red?.includes(i);
      const tw = reduced ? 1 : 0.8 + 0.2 * Math.sin(t * 2 + i);
      const r = s[2] * (i === hover ? 1.35 : 1) * tw;
      const col = red ? '255,170,130' : '233,236,247';
      const halo = c.createRadialGradient(x, y, 0, x, y, r * 6);
      halo.addColorStop(0, `rgba(${col},${isTarget || mode === 'libre' ? 0.4 : 0.18})`); halo.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = halo; c.beginPath(); c.arc(x, y, r * 6, 0, 7); c.fill();
      c.fillStyle = `rgba(${col},${isTarget || mode === 'libre' ? 1 : 0.6})`; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      if (i === current || i === hover) { c.strokeStyle = i === current ? 'rgba(143,227,255,.9)' : 'rgba(185,162,255,.6)'; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r + 9, 0, 7); c.stroke(); }
      if (isTarget && (done.has(fig) || i === hover) && s[3]) {
        c.fillStyle = 'rgba(233,236,247,.75)'; c.font = '500 11px Inter, sans-serif';
        c.fillText(s[3], x + r + 8, y - r - 4);
      }
    });

    bursts = bursts.filter((b) => b.life < 1);
    for (const b of bursts) {
      b.life += 0.02;
      for (const p of b.p) {
        const x = b.x + Math.cos(p.a) * p.v * b.life * 120, y = b.y + Math.sin(p.a) * p.v * b.life * 120;
        c.fillStyle = `rgba(185,162,255,${1 - b.life})`; c.fillRect(x, y, 1.6, 1.6);
      }
    }
    if (done.has(fig) && mode === 'reto') {
      c.fillStyle = 'rgba(233,236,247,.9)'; c.font = `italic ${Math.round(Math.max(22, w * 0.04))}px "Instrument Serif", serif`;
      c.fillText(FIGURES[fig].name, 22, h - 26);
    }
  }
  function loop(now) { if (!visible) return; draw(now); requestAnimationFrame(loop); }

  function burst(i) {
    if (reduced) return;
    const [x, y] = P(pts[i]);
    bursts.push({ x, y, life: 0, p: Array.from({ length: 26 }, () => ({ a: Math.random() * 6.3, v: 0.3 + Math.random() })) });
  }

  // ── Modo descubrir
  const chips = $('[data-trace-chips]', root), status = $('[data-trace-status]', root), bar = $('[data-trace-bar]', root), story = $('[data-trace-story]', root);
  function renderChips() {
    chips.innerHTML = Object.entries(FIGURES).map(([k, F]) => `<button type="button" class="${k === fig ? 'is-on' : ''}" data-fig="${k}">${done.has(k) ? '✦ ' : ''}${F.name}<small>${F.alt}</small></button>`).join('') + '<button type="button" class="hint" data-hint>Ver pista</button>';
  }
  function setFig(k) {
    fig = k; found = new Set(); current = -1; pts = pickable();
    story.hidden = true;
    if (done.has(k)) { FIGURES[k].edges.forEach(([a, b]) => found.add(key(a, b))); showStory(); }
    progress(); renderChips();
  }
  function progress() {
    const F = FIGURES[fig], n = found.size, total = F.edges.length;
    bar.style.width = `${(n / total) * 100}%`;
    status.textContent = done.has(fig) ? `¡Completada! Encontró ${F.name}.` : n ? `${n} de ${total} trazos correctos. Siga uniendo estrellas.` : 'Toque una estrella brillante y luego otra para unirlas.';
  }
  function showStory() {
    const F = FIGURES[fig];
    story.innerHTML = `<strong>${F.name} · ${F.alt}</strong><p>${F.story}</p>${done.size < 3 ? '<button type="button" class="btn btn--glow" data-next>Siguiente constelación →</button>' : '<p class="trace__all">✦ Descubrió las tres. Esta noche, el astrónomo le muestra las reales.</p>'}`;
    story.hidden = false;
  }
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.hint !== undefined) { flash = { hint: true, until: performance.now() + 1800 }; return; }
    setFig(b.dataset.fig);
  });
  story.addEventListener('click', (e) => {
    if (!e.target.closest('[data-next]')) return;
    setFig(Object.keys(FIGURES).find((k) => !done.has(k)) || 'cruz');
  });

  // ── Modo libre
  const nameIn = $('[data-trace-name]', root), count = $('[data-trace-count]', root);
  const updCount = () => { const n = new Set(strokes.flat()).size; count.textContent = `${n} estrella${n === 1 ? '' : 's'} unida${n === 1 ? '' : 's'} · ${strokes.length} trazo${strokes.length === 1 ? '' : 's'}`; };
  $('[data-trace-cut]', root).addEventListener('click', () => (current = -1));
  $('[data-trace-undo]', root).addEventListener('click', () => { const l = strokes.pop(); current = l ? l[0] : -1; updCount(); });
  $('[data-trace-clear]', root).addEventListener('click', () => { strokes = []; current = -1; updCount(); });
  $('[data-trace-save]', root).addEventListener('click', () => {
    const prev = current; current = -1; hover = -1;
    draw(performance.now());
    const out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    const o = out.getContext('2d'); o.drawImage(cv, 0, 0); o.scale(dpr, dpr);
    const name = nameIn.value.trim() || 'Mi constelación';
    o.fillStyle = 'rgba(233,236,247,.95)'; o.font = `italic ${Math.round(Math.max(26, w * 0.05))}px "Instrument Serif", serif`; o.fillText(name, 24, h - 44);
    o.fillStyle = 'rgba(185,162,255,.85)'; o.font = '600 11px Inter, sans-serif';
    o.fillText(`DESCUBIERTA EN DOMOS CIELO AUSTRAL · ${new Date().toLocaleDateString('es-CL').toUpperCase()}`, 24, h - 22);
    const a = document.createElement('a'); a.download = `${name.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-')}.png`; a.href = out.toDataURL('image/png'); a.click();
    current = prev;
  });

  // ── Modo
  $$('[data-trace-mode]', root).forEach((b) => b.addEventListener('click', () => {
    mode = b.dataset.traceMode; current = -1;
    $$('[data-trace-mode]', root).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-trace-pane]', root).forEach((p) => (p.hidden = p.dataset.tracePane !== mode));
    pts = pickable();
    $('[data-trace-coords]', root).textContent = mode === 'libre' ? 'Cielo libre · invente su figura' : 'Cielo austral · −39,35° S';
  }));

  // ── Interacción con el lienzo
  const local = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointermove', (e) => { ptr = local(e); hover = nearest(...ptr); cv.style.cursor = hover >= 0 ? 'pointer' : 'crosshair'; });
  cv.addEventListener('pointerleave', () => { ptr = null; hover = -1; });
  cv.addEventListener('pointerdown', (e) => {
    ptr = local(e);
    const i = nearest(...ptr);
    if (i < 0) { current = -1; return; }
    if (current < 0 || current === i) { current = current === i ? -1 : i; return; }
    const a = current, b = i;
    if (mode === 'libre') {
      if (!strokes.some(([x, y]) => key(x, y) === key(a, b))) strokes.push([a, b]);
      current = b; updCount(); burst(b);
      return;
    }
    const F = FIGURES[fig];
    if (F.edges.some(([x, y]) => key(x, y) === key(a, b))) {
      if (!found.has(key(a, b))) { found.add(key(a, b)); burst(b); }
      current = b;
      if (found.size === F.edges.length && !done.has(fig)) {
        done.add(fig); current = -1;
        F.stars.forEach((_, k) => setTimeout(() => burst(k), k * 90));
        showStory(); renderChips();
      }
    } else {
      flash = { bad: [a, b], until: performance.now() + 600 };
      current = b < F.stars.length ? b : -1;
    }
    progress();
  });

  size(); renderChips(); progress(); updCount();
  addEventListener('resize', size);
  new IntersectionObserver(([e]) => {
    const was = visible; visible = e.isIntersecting;
    if (visible && !was) { size(); requestAnimationFrame(loop); }
  }).observe(cv);
}

// Temporada de ballenas: una sección fija mientras se desplaza. La ballena cruza la bahía bajo
// el agua, suelta burbujas y al final salta fuera de la superficie con salpicaduras. Su canción
// se sintetiza en el navegador (gemidos graves con vibrato y eco), solo si el visitante la pide.
export function initWhales({ section, reduced, months, whales, todayMonth, todayT, fmt }) {
  const whale = section.querySelector('[data-whale]'), cv = section.querySelector('[data-whale-fx]');
  const facts = [...section.querySelectorAll('[data-f]')], surface = section.querySelector('[data-surface]');
  const c = cv.getContext('2d');
  let W = 0, H = 0, k = 0, parts = [], wasAbove = false;
  const DPR = Math.min(2, devicePixelRatio || 1);
  const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * DPR; cv.height = H * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0); };
  size(); addEventListener('resize', size);
  const SURF = 0.27;

  // Temporada mes a mes y cuenta regresiva
  section.querySelector('[data-season]').innerHTML = months.map((m, i) => `<span class="${i === todayMonth ? 'is-now' : ''}" style="--p:${whales[i]}"><i></i><b>${m}</b></span>`).join('');
  const y = new Date(todayT).getUTCFullYear();
  let start = Date.UTC(y, 0, 15), end = Date.UTC(y, 2, 25);
  if (todayT > end) { start = Date.UTC(y + 1, 0, 15); end = Date.UTC(y + 1, 2, 25); }
  const days = Math.ceil((start - todayT) / 864e5);
  section.querySelector('[data-whale-count]').innerHTML = todayT >= start && todayT <= end
    ? '<b>Temporada abierta</b> · hoy hay ballenas en la bahía'
    : `Faltan <b>${days}</b> días para la temporada ${new Date(start).getUTCFullYear()} · desde el ${fmt(start)}`;

  function pose(k) {
    // 0–0.78 nada de izquierda a derecha; 0.78–1 sube, sale del agua y vuelve a caer
    if (k < 0.78) {
      const t = k / 0.78;
      const x = -0.4 + t * 1.15, yy = 0.66 + Math.sin(t * Math.PI * 2.2) * 0.07;
      const dy = Math.cos(t * Math.PI * 2.2) * 0.07 * Math.PI * 2.2 / 1.15;
      return { x, y: yy, r: Math.atan(dy * 0.6) * 57, s: 1 };
    }
    const t = (k - 0.78) / 0.22;
    const arc = Math.sin(Math.min(1, t) * Math.PI);
    return { x: 0.75 + t * 0.06, y: 0.66 - arc * 0.62, r: -62 + t * 120, s: 1 };
  }
  function place() {
    const p = pose(k);
    const ww = whale.clientWidth;
    whale.style.transform = `translate3d(${p.x * W - ww / 2}px, ${p.y * H - whale.clientHeight / 2}px, 0) rotate(${p.r}deg)`;
    const above = p.y < SURF + 0.02;
    if (above !== wasAbove) splash(p.x * W, SURF * H, above ? 70 : 90);
    wasAbove = above;
    facts.forEach((f, i) => f.classList.toggle('is-on', Math.min(2, Math.floor(k * 3.2)) === i));
    section.querySelector('[data-whale-photo]')?.classList.toggle('is-on', k > 0.9);
    return p;
  }
  function splash(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, v = 3 + Math.random() * 9;
      parts.push({ x: x + (Math.random() - 0.5) * 80, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 1 + Math.random() * 3.4, life: 1, kind: 's' });
    }
  }
  const onScroll = () => {
    const r = section.getBoundingClientRect(), span = section.offsetHeight - innerHeight;
    k = Math.max(0, Math.min(1, -r.top / Math.max(1, span)));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(section);
  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    t += 1;
    const p = place();
    // Superficie en movimiento
    const ph = t / 40;
    let d = 'M0 20';
    for (let x = 0; x <= 1200; x += 60) d += ` L${x} ${(20 + Math.sin(x / 90 + ph) * 5 + Math.sin(x / 37 - ph * 1.3) * 2).toFixed(1)}`;
    surface.setAttribute('d', `${d} V40 H0 Z`);
    // Burbujas desde el espiráculo mientras nada bajo el agua
    if (!reduced && p.y > SURF + 0.05 && t % 5 === 0) parts.push({ x: p.x * W - whale.clientWidth * 0.32, y: p.y * H - 20, vx: (Math.random() - 0.5) * 0.4, vy: -0.8 - Math.random() * 1.2, r: 1.5 + Math.random() * 4, life: 1, kind: 'b' });
    c.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i];
      if (q.kind === 'b') {
        q.x += q.vx + Math.sin((t + i) / 10) * 0.3; q.y += q.vy; q.life -= 0.004;
        if (q.y < SURF * H || q.life <= 0) { parts.splice(i, 1); continue; }
        c.strokeStyle = `rgba(220,245,255,${0.5 * q.life})`; c.lineWidth = 1;
        c.beginPath(); c.arc(q.x, q.y, q.r, 0, 6.283); c.stroke();
      } else {
        q.x += q.vx; q.y += q.vy; q.vy += 0.32; q.life -= 0.012;
        if (q.life <= 0 || q.y > SURF * H + 30) { parts.splice(i, 1); continue; }
        c.fillStyle = `rgba(255,255,255,${0.85 * q.life})`;
        c.beginPath(); c.arc(q.x, q.y, q.r, 0, 6.283); c.fill();
      }
    }
  })();
}

/* Canción de ballena sintetizada */
let actx = null, out = null, timer = null;
function impulse(ctx, sec) {
  const b = ctx.createBuffer(2, ctx.sampleRate * sec, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.6); }
  return b;
}
function moan(t0, f0, f1, f2, dur) {
  const o = actx.createOscillator(), g = actx.createGain(), vib = actx.createOscillator(), vg = actx.createGain();
  o.type = 'sine'; vib.frequency.value = 5 + Math.random() * 3; vg.gain.value = f1 * 0.02;
  vib.connect(vg); vg.connect(o.frequency);
  o.frequency.setValueAtTime(f0, t0);
  o.frequency.exponentialRampToValueAtTime(f1, t0 + dur * 0.45);
  o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.28, t0 + dur * 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(out); o.start(t0); vib.start(t0); o.stop(t0 + dur + 0.1); vib.stop(t0 + dur + 0.1);
}
function phrase() {
  const t = actx.currentTime + 0.1;
  moan(t, 180, 420, 260, 2.6);
  moan(t + 2.9, 520, 760, 380, 1.6);
  moan(t + 4.8, 90, 140, 70, 2.8);
  moan(t + 7.9, 300, 900, 600, 1.2);
  moan(t + 9.3, 600, 240, 160, 2.2);
}
export function toggleSong(on) {
  if (on && !actx) {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    const rev = actx.createConvolver(); rev.buffer = impulse(actx, 3.5);
    const dry = actx.createGain(); dry.gain.value = 0.5; const wet = actx.createGain(); wet.gain.value = 0.9;
    out = actx.createGain(); out.gain.value = 0.9;
    out.connect(lp); lp.connect(dry); lp.connect(rev); rev.connect(wet); dry.connect(actx.destination); wet.connect(actx.destination);
  }
  if (!actx) return;
  clearInterval(timer);
  if (on) { actx.resume(); phrase(); timer = setInterval(phrase, 12500); out.gain.setTargetAtTime(0.9, actx.currentTime, 0.3); }
  else out.gain.setTargetAtTime(0, actx.currentTime, 0.3);
}

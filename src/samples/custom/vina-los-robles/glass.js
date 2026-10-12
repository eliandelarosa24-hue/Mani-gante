// Copa de vino que se agita: la superficie es una red de resortes que se inclina con la velocidad
// del cursor (o del dedo); al agitar fuerte quedan "lágrimas" bajando por el cristal.
export function initGlass({ reduced }) {
  const cv = document.querySelector('[data-glass-canvas]');
  if (!cv) return;
  const hero = document.querySelector('[data-hero]'), hint = document.querySelector('[data-glass-hint]');
  const c = cv.getContext('2d');
  const W = 340, H = 520, CX = 170, LEVEL = 214, N = 48, X0 = 40, X1 = 300;
  let dpr = 1, ang = 0, angV = 0, angT = 0, swirl = 0, visible = true, tears = [], lastX = null, lastT = 0, hinted = false;
  const hgt = new Float32Array(N), vel = new Float32Array(N);
  const xs = Array.from({ length: N }, (_, i) => X0 + ((X1 - X0) * i) / (N - 1));

  function size() { dpr = Math.min(devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);

  const bowl = new Path2D('M78 44 C66 150 92 282 170 296 C248 282 274 150 262 44');
  const bowlClosed = new Path2D('M78 44 C66 150 92 282 170 296 C248 282 274 150 262 44 Z');
  // Radio interior del cáliz a cierta altura (para ubicar las lágrimas sobre el vidrio)
  const halfWidth = (y) => { const t = Math.max(0, Math.min(1, (y - 44) / 252)); return 92 * Math.sqrt(1 - t * t * 0.92); };

  function push(force) {
    angT = Math.max(-0.42, Math.min(0.42, angT + force));
    for (let i = 0; i < N; i++) vel[i] += ((xs[i] - CX) / 130) * force * 22;
    swirl = Math.min(1, swirl + Math.abs(force) * 0.9);
  }
  function step() {
    angV += (angT - ang) * 0.06; angV *= 0.9; ang += angV; angT *= 0.94;
    for (let k = 0; k < 2; k++) for (let i = 0; i < N; i++) {
      const l = hgt[i - 1] ?? hgt[i], r = hgt[i + 1] ?? hgt[i];
      vel[i] += (l + r - 2 * hgt[i]) * 0.18 - hgt[i] * 0.02;
      vel[i] *= 0.975;
    }
    for (let i = 0; i < N; i++) hgt[i] += vel[i];
    // Lágrimas: aparecen tras una agitación fuerte y bajan despacio
    if (swirl > 0.55 && tears.length < 26 && Math.random() < 0.3) {
      const side = Math.random() < 0.5 ? -1 : 1, y = LEVEL - 26 - Math.random() * 70;
      tears.push({ side, y, len: 8 + Math.random() * 18, a: 0.7, v: 0.08 + Math.random() * 0.14 });
      if (!hinted) { hint.textContent = 'Esas son las lágrimas: señal de un vino con cuerpo'; hinted = true; }
    }
    swirl *= 0.985;
    tears.forEach((t) => { t.y += t.v; t.a -= 0.0016; });
    tears = tears.filter((t) => t.a > 0 && t.y < LEVEL);
  }
  function draw() {
    c.clearRect(0, 0, W, H);
    // Reflejo del atardecer detrás de la copa
    const glow = c.createRadialGradient(CX, 200, 10, CX, 200, 190);
    glow.addColorStop(0, 'rgba(201,166,107,0.18)'); glow.addColorStop(1, 'rgba(201,166,107,0)');
    c.fillStyle = glow; c.fillRect(0, 0, W, H);
    // Vino
    c.save(); c.clip(bowlClosed);
    const slope = Math.tan(ang);
    const sy = (i) => LEVEL + slope * (xs[i] - CX) + hgt[i];
    c.beginPath(); c.moveTo(xs[0], sy(0));
    for (let i = 1; i < N; i++) c.lineTo(xs[i], sy(i));
    c.lineTo(X1, H); c.lineTo(X0, H); c.closePath();
    const g = c.createLinearGradient(0, LEVEL - 40, 0, 300);
    g.addColorStop(0, '#8d1e3e'); g.addColorStop(0.5, '#5c0f2a'); g.addColorStop(1, '#2c0614');
    c.fillStyle = g; c.fill();
    // Brillo de la superficie (ribete del vino)
    c.beginPath(); c.moveTo(xs[0], sy(0)); for (let i = 1; i < N; i++) c.lineTo(xs[i], sy(i));
    c.strokeStyle = 'rgba(210,90,120,0.75)'; c.lineWidth = 2.2; c.stroke();
    // Lágrimas sobre el vidrio
    tears.forEach((t) => {
      const x = CX + t.side * (halfWidth(t.y) - 6);
      const lg = c.createLinearGradient(0, t.y - t.len, 0, t.y);
      lg.addColorStop(0, 'rgba(140,30,62,0)'); lg.addColorStop(1, `rgba(140,30,62,${t.a})`);
      c.strokeStyle = lg; c.lineWidth = 2; c.beginPath(); c.moveTo(x, t.y - t.len); c.lineTo(x + t.side * 0.6, t.y); c.stroke();
      c.fillStyle = `rgba(140,30,62,${t.a})`; c.beginPath(); c.arc(x + t.side * 0.6, t.y, 1.8, 0, 6.283); c.fill();
    });
    c.restore();
    // Cristal
    c.lineCap = 'round';
    c.strokeStyle = 'rgba(246,239,230,0.75)'; c.lineWidth = 2; c.stroke(bowl);
    c.beginPath(); c.moveTo(78, 44); c.lineTo(262, 44); c.strokeStyle = 'rgba(246,239,230,0.35)'; c.lineWidth = 1.4; c.stroke();
    c.beginPath(); c.moveTo(170, 296); c.lineTo(170, 470); c.strokeStyle = 'rgba(246,239,230,0.7)'; c.lineWidth = 3.4; c.stroke();
    c.beginPath(); c.ellipse(170, 478, 74, 11, 0, 0, 6.283); c.strokeStyle = 'rgba(246,239,230,0.6)'; c.lineWidth = 2; c.stroke();
    // Destellos del vidrio
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 5;
    c.beginPath(); c.moveTo(96, 70); c.bezierCurveTo(88, 140, 98, 200, 118, 236); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(244, 80); c.bezierCurveTo(250, 130, 246, 170, 238, 200); c.stroke();
  }
  function loop() { if (!visible) return; step(); draw(); requestAnimationFrame(loop); }

  // Movimiento del cursor sobre el hero
  hero.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (lastX != null && now - lastT < 80) push(((e.clientX - lastX) / Math.max(8, now - lastT)) * 0.05);
    lastX = e.clientX; lastT = now;
  });
  // Toque o clic sobre la copa: un remolino
  let spin = null;
  cv.addEventListener('pointerdown', (e) => { spin = e.clientX; cv.setPointerCapture(e.pointerId); push(0.25 * (Math.random() < 0.5 ? -1 : 1)); });
  cv.addEventListener('pointermove', (e) => { if (spin == null) return; push((e.clientX - spin) * 0.004); spin = e.clientX; });
  cv.addEventListener('pointerup', () => (spin = null));
  // Sin cursor (celular), la copa se mece sola al hacer scroll
  let ly = scrollY;
  addEventListener('scroll', () => { push((scrollY - ly) * 0.0015); ly = scrollY; }, { passive: true });

  if (reduced) { draw(); return; }
  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) requestAnimationFrame(loop); }).observe(cv);
  requestAnimationFrame(loop);
  setTimeout(() => push(0.3), 1600);
}

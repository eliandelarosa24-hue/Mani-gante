// Vapor del hero: nubes suaves que suben desde los pozones y se apartan al paso del cursor (o del dedo).
export function initSteam(canvas, { reduced }) {
  const c = canvas.getContext('2d');
  const DPR = Math.min(1.5, devicePixelRatio || 1);
  let W = 0, H = 0, parts = [], px = -9999, py = -9999, pvx = 0, pvy = 0, visible = true;
  // Sprite pre-renderizado: un círculo difuso blanco
  const sp = document.createElement('canvas'); sp.width = sp.height = 128;
  const g = sp.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(238,241,236,0.55)'); gr.addColorStop(0.45, 'rgba(238,241,236,0.18)'); gr.addColorStop(1, 'rgba(238,241,236,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const make = (y) => ({ x: Math.random() * W, y: y ?? H * (0.45 + Math.random() * 0.6), vx: (Math.random() - 0.5) * 0.15, vy: -(0.18 + Math.random() * 0.35), s: 90 + Math.random() * 220, a: 0, life: 0, max: 600 + Math.random() * 700, ph: Math.random() * 6.28 });
  function size() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 16000));
    parts = Array.from({ length: n }, () => { const p = make(Math.random() * H * 1.2); p.life = Math.random() * p.max; return p; });
  }
  size(); addEventListener('resize', size);
  const sec = canvas.parentElement;
  const move = (x, y) => { const r = canvas.getBoundingClientRect(); const nx = x - r.left, ny = y - r.top; pvx = nx - px; pvy = ny - py; px = nx; py = ny; };
  sec.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
  sec.addEventListener('pointerleave', () => { px = py = -9999; });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  let t = 0;
  function frame() {
    c.clearRect(0, 0, W, H);
    for (const p of parts) {
      if (!reduced) {
        t += 0.00002;
        p.life++;
        p.x += p.vx + Math.sin(p.life / 90 + p.ph) * 0.25; p.y += p.vy;
        // El cursor empuja el vapor hacia los lados
        const dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy, R = 170;
        if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 2.4; p.vx += (dx / d) * f * 0.18 + pvx * 0.004; p.vy += (dy / d) * f * 0.12 + pvy * 0.003; }
        p.vx *= 0.97; p.vy = p.vy * 0.97 - 0.006;
        if (p.life > p.max || p.y < -p.s) Object.assign(p, make(H + 60));
      }
      const k = p.life / p.max, a = Math.sin(Math.PI * Math.min(1, k)) * 0.9;
      c.globalAlpha = a; const s = p.s * (0.7 + k * 0.8);
      c.drawImage(sp, p.x - s / 2, p.y - s / 2, s, s);
    }
    c.globalAlpha = 1; pvx *= 0.9; pvy *= 0.9;
  }
  if (reduced) { frame(); return; }
  (function loop() { requestAnimationFrame(loop); if (visible) frame(); })();
}

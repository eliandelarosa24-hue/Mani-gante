// Sonido ambiente generado en el navegador (sin archivos): lluvia sobre las tejuelas, gotas
// sueltas y el crujido de la chimenea. Se enciende solo cuando el visitante lo pide.
let ctx = null, master = null, timers = [];
function noiseBuffer(c, seconds, brown) {
  const b = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate), d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
  }
  return b;
}
function loop(c, buf, chain) {
  const s = c.createBufferSource(); s.buffer = buf; s.loop = true;
  let node = s; chain.forEach((n) => { node.connect(n); node = n; }); node.connect(master); s.start();
}
function burst(c, { f, q, gain, dur }) {
  const s = c.createBufferSource(); s.buffer = burst.buf || (burst.buf = noiseBuffer(c, 0.2));
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
  const g = c.createGain(); const t = c.currentTime;
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(bp); bp.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.02);
}
function start() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
  const white = noiseBuffer(ctx, 3), brown = noiseBuffer(ctx, 4, true);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
  const g1 = ctx.createGain(); g1.gain.value = 0.16;
  loop(ctx, white, [hp, lp, g1]);
  const lp2 = ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 380;
  const g2 = ctx.createGain(); g2.gain.value = 0.5;
  loop(ctx, brown, [lp2, g2]);
  // Gotas sobre el alféizar
  const drip = () => { burst(ctx, { f: 2200 + Math.random() * 3000, q: 8, gain: 0.05 + Math.random() * 0.08, dur: 0.05 }); timers.push(setTimeout(drip, 60 + Math.random() * 260)); };
  // Leña crujiendo
  const crack = () => { burst(ctx, { f: 900 + Math.random() * 2400, q: 1.2, gain: 0.08 + Math.random() * 0.22, dur: 0.02 + Math.random() * 0.05 }); if (Math.random() < 0.3) setTimeout(() => burst(ctx, { f: 1500, q: 1, gain: 0.1, dur: 0.02 }), 40); timers.push(setTimeout(crack, 120 + Math.random() * 900)); };
  drip(); crack();
}
export function toggleSound(on) {
  if (on && !ctx) start();
  if (!ctx) return;
  if (on && ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(on ? 0.9 : 0, t + (on ? 2 : 0.8));
}

// Sonidos de oficina sintetizados (solo si el visitante los activa): tecla, impresora de rollo,
// timbre de goma y papel que se arranca.
let ctx = null, out = null, on = false;
function init() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  out = ctx.createGain(); out.gain.value = 0.6; out.connect(ctx.destination);
}
function noise(t, dur, f, q, g, type = 'bandpass') {
  const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), gn = ctx.createGain();
  s.buffer = b; fl.type = type; fl.frequency.value = f; fl.Q.value = q; gn.gain.value = g;
  s.connect(fl); fl.connect(gn); gn.connect(out); s.start(t);
}
function thump(t, f0, f1, dur, g) {
  const o = ctx.createOscillator(), gn = ctx.createGain();
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(gn); gn.connect(out); o.start(t); o.stop(t + dur + 0.02);
}
export const sound = {
  get on() { return on; },
  toggle() { on = !on; if (on) { init(); ctx.resume(); } return on; },
  key() { if (!on) return; const t = ctx.currentTime; noise(t, 0.03, 3200, 2, 0.5); thump(t, 900, 400, 0.03, 0.12); },
  print(n = 1) { if (!on) return; const t = ctx.currentTime; for (let i = 0; i < n; i++) for (let j = 0; j < 5; j++) noise(t + i * 0.12 + j * 0.022, 0.018, 2400 + j * 120, 6, 0.35); },
  stamp() { if (!on) return; const t = ctx.currentTime; thump(t, 160, 50, 0.18, 0.9); noise(t, 0.06, 900, 1, 0.6, 'lowpass'); },
  tear() { if (!on) return; const t = ctx.currentTime; for (let i = 0; i < 9; i++) noise(t + i * 0.025, 0.04, 1800 + Math.random() * 2500, 1.5, 0.3); },
};

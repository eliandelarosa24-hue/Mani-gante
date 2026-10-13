// Sonido de la quebrada, sintetizado en el navegador y solo si el visitante lo activa:
// el estero (ruido filtrado que respira), burbujas en los pozones y, de vez en cuando, el chucao.
let ctx = null, out = null, on = false, timers = [];
function noiseBuf(sec) {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = last * 3.2; }
  return b;
}
function stream() {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf(4); s.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.6;
  const g = ctx.createGain(); g.gain.value = 0.5;
  const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.13; lg.gain.value = 260;
  lfo.connect(lg); lg.connect(bp.frequency); lfo.start();
  s.connect(bp); bp.connect(g); g.connect(out); s.start();
}
function bubble() {
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), f = 300 + Math.random() * 500;
  o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.2, t + 0.06);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.1);
}
// Chucao: tres o cuatro notas graves y huecas que bajan al final
function chucao() {
  const t0 = ctx.currentTime + 0.05, n = 3 + Math.round(Math.random());
  for (let i = 0; i < n; i++) {
    const t = t0 + i * 0.16, o = ctx.createOscillator(), g = ctx.createGain(), last = i === n - 1;
    o.type = 'triangle'; o.frequency.setValueAtTime(last ? 520 : 470, t); o.frequency.exponentialRampToValueAtTime(last ? 300 : 430, t + (last ? 0.3 : 0.1));
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + (last ? 0.34 : 0.12));
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.4);
  }
}
export function toggleSound() {
  on = !on;
  if (on && !ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination); stream(); }
  if (!ctx) return on;
  timers.forEach(clearInterval); timers = [];
  if (on) {
    ctx.resume(); out.gain.setTargetAtTime(0.7, ctx.currentTime, 0.8);
    timers.push(setInterval(() => { if (Math.random() < 0.55) bubble(); }, 260));
    setTimeout(chucao, 2500); timers.push(setInterval(chucao, 14000));
  } else out.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
  return on;
}

// Merengue sintetizado en el navegador: güira (raspado metálico en corcheas y semicorcheas),
// tambora (golpe grave abierto y "tapao") y un bajo que alterna tónica y dominante.
// Patrimonio de la UNESCO desde 2016. Suena solo si el visitante lo pide.
let ctx = null, out = null, timer = null, step = 0, next = 0, onBeat = () => {};
const BPM = 136, SIXT = 60 / BPM / 4;
let noise = null;
function noiseBuf() {
  const b = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function guira(t, accent) {
  const s = ctx.createBufferSource(); s.buffer = noise;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(accent ? 0.22 : 0.09, t); g.gain.exponentialRampToValueAtTime(0.001, t + (accent ? 0.09 : 0.045));
  s.connect(hp); hp.connect(g); g.connect(out); s.start(t); s.stop(t + 0.12);
}
function tambora(t, open) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(open ? 150 : 230, t); o.frequency.exponentialRampToValueAtTime(open ? 72 : 140, t + 0.14);
  g.gain.setValueAtTime(open ? 0.7 : 0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.28 : 0.08));
  o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.3);
  if (!open) { const s = ctx.createBufferSource(); s.buffer = noise; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; const gn = ctx.createGain(); gn.gain.setValueAtTime(0.25, t); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.05); s.connect(bp); bp.connect(gn); gn.connect(out); s.start(t); s.stop(t + 0.06); }
}
function bass(t, f) {
  const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  o.type = 'triangle'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 600;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + SIXT * 1.8);
  o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t + SIXT * 2);
}
// Compás de 2/4 en 8 semicorcheas; dos compases por ciclo (tónica y dominante)
const GUIRA = [1, 0, 1, 1, 1, 0, 1, 1];
const TAMB = { 0: 'open', 3: 'slap', 5: 'slap', 6: 'open', 7: 'slap' };
const BASS = { 0: 'r', 4: 'f' };
function schedule() {
  while (next < ctx.currentTime + 0.12) {
    const i = step % 8, bar = Math.floor(step / 8) % 2;
    if (GUIRA[i]) guira(next, i === 0 || i === 4);
    if (TAMB[i]) tambora(next, TAMB[i] === 'open');
    if (BASS[i]) bass(next, bar ? (BASS[i] === 'r' ? 98 : 73.4) : (BASS[i] === 'r' ? 65.4 : 98));
    if (i % 4 === 0) { const when = (next - ctx.currentTime) * 1000; setTimeout(() => onBeat(i === 0), Math.max(0, when)); }
    next += SIXT; step++;
  }
}
export function toggleMerengue(on, beat) {
  if (beat) onBeat = beat;
  if (on && !ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); out = ctx.createGain(); out.gain.value = 0.8; out.connect(ctx.destination); noise = noiseBuf(); }
  if (!ctx) return;
  clearInterval(timer);
  if (on) { ctx.resume(); out.gain.setTargetAtTime(0.8, ctx.currentTime, 0.05); next = ctx.currentTime + 0.05; step = 0; timer = setInterval(schedule, 25); }
  else out.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
}

// Sonido ambiente sintetizado en el navegador (sin archivos de audio): cada obra suena a su lugar.
// Apagado por defecto; se enciende con el botón «Sonido» y la preferencia queda guardada en este equipo.
let ctx = null, master = null, current = null, wanted = 'sala', on = false, noise = null;
const listeners = new Set();

const PREF = 'rv-sound';
const store = { get: () => { try { return localStorage.getItem(PREF) === '1'; } catch { return false; } }, set: (v) => { try { localStorage.setItem(PREF, v ? '1' : '0'); } catch { /* sin almacenamiento */ } } };

function buffers() {
  const len = ctx.sampleRate * 4;
  const white = ctx.createBuffer(1, len, ctx.sampleRate), brown = ctx.createBuffer(1, len, ctx.sampleRate);
  const w = white.getChannelData(0), b = brown.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    w[i] = Math.random() * 2 - 1;
    last = (last + 0.02 * w[i]) / 1.02;
    b[i] = last * 3.5;
  }
  return { white, brown };
}
function src(kind) { const s = ctx.createBufferSource(); s.buffer = noise[kind]; s.loop = true; s.loopStart = Math.random(); s.start(0, Math.random() * 3); return s; }
function filt(type, f, q = 0.7) { const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; n.Q.value = q; return n; }
function gain(v) { const g = ctx.createGain(); g.gain.value = v; return g; }
function lfo(freq, depth, target) { const o = ctx.createOscillator(), g = gain(depth); o.frequency.value = freq; o.connect(g).connect(target); o.start(); return o; }
// Golpes cortos al azar (gotas, chispas, burbujas)
function sprinkle(out, every, make) {
  let alive = true;
  const loop = () => { if (!alive) return; make(out); setTimeout(loop, every * (0.3 + Math.random() * 1.4)); };
  setTimeout(loop, every);
  return () => { alive = false; };
}
function burst(out, { f = 3000, q = 4, len = 0.02, vol = 0.2, type = 'bandpass' } = {}) {
  const t = ctx.currentTime, s = ctx.createBufferSource(), b = filt(type, f, q), g = gain(0);
  s.buffer = noise.white; s.connect(b).connect(g).connect(out);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  s.start(t, Math.random() * 3, len + 0.02);
}
function bloop(out, { f = 300, vol = 0.05 } = {}) {
  const t = ctx.currentTime, o = ctx.createOscillator(), g = gain(0);
  o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.6, t + 0.09);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.connect(g).connect(out); o.start(t); o.stop(t + 0.14);
}

const AMBIENCES = {
  // Sala: zumbido cálido del proyector y un aleteo muy suave
  sala(out) {
    const nodes = [];
    for (const [f, v] of [[55, 0.05], [110.4, 0.025], [164.7, 0.012]]) { const o = ctx.createOscillator(); o.frequency.value = f; o.connect(gain(v)).connect(out); o.start(); nodes.push(o); }
    const n = src('white'), bp = filt('bandpass', 1400, 1.2), g = gain(0.006);
    n.connect(bp).connect(g).connect(out); nodes.push(n, lfo(18, 0.004, g.gain));
    return () => nodes.forEach((x) => x.stop?.());
  },
  // Mar: olas que suben y bajan, espuma
  mar(out) {
    const a = src('brown'), lp = filt('lowpass', 520), ga = gain(0.22);
    a.connect(lp).connect(ga).connect(out);
    const b = src('white'), bp = filt('bandpass', 1100, 0.6), gb = gain(0.02);
    b.connect(bp).connect(gb).connect(out);
    const l1 = lfo(0.085, 0.16, ga.gain), l2 = lfo(0.085, 0.02, gb.gain), l3 = lfo(0.05, 300, lp.frequency);
    return () => [a, b, l1, l2, l3].forEach((x) => x.stop());
  },
  // Lluvia sobre el vidrio y el techo
  lluvia(out) {
    const a = src('white'), hp = filt('highpass', 1800), ga = gain(0.05);
    a.connect(hp).connect(ga).connect(out);
    const r = src('brown'), lp = filt('lowpass', 260), gr = gain(0.12);
    r.connect(lp).connect(gr).connect(out);
    const stop = sprinkle(out, 45, (o) => burst(o, { f: 2500 + Math.random() * 4000, q: 6, len: 0.015, vol: 0.05 + Math.random() * 0.08 }));
    return () => { [a, r].forEach((x) => x.stop()); stop(); };
  },
  // Fuego: brasas graves y chispas
  fuego(out) {
    const a = src('brown'), lp = filt('lowpass', 700), ga = gain(0.2);
    a.connect(lp).connect(ga).connect(out);
    const l = lfo(0.7, 0.06, ga.gain);
    const stop = sprinkle(out, 150, (o) => burst(o, { f: 1800 + Math.random() * 3000, q: 1.5, len: 0.01 + Math.random() * 0.03, vol: 0.12 + Math.random() * 0.25, type: 'highpass' }));
    return () => { [a, l].forEach((x) => x.stop()); stop(); };
  },
  // Noche: grillos, viento leve y un acorde lejano
  noche(out) {
    const w = src('white'), bp = filt('bandpass', 500, 0.5), gw = gain(0.015);
    w.connect(bp).connect(gw).connect(out);
    const pad = [196, 293.7, 392].map((f, i) => { const o = ctx.createOscillator(); o.frequency.value = f; o.detune.value = i * 3; o.connect(gain(0.006)).connect(out); o.start(); return o; });
    const stop = sprinkle(out, 900, (o) => {
      const t = ctx.currentTime, osc = ctx.createOscillator(), g = gain(0);
      osc.frequency.value = 4300 + Math.random() * 500; osc.connect(g).connect(o);
      for (let k = 0; k < 3 + Math.floor(Math.random() * 3); k++) { const s = t + k * 0.07; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.012, s + 0.012); g.gain.linearRampToValueAtTime(0, s + 0.045); }
      osc.start(t); osc.stop(t + 0.5);
    });
    return () => { [w, ...pad].forEach((x) => x.stop()); stop(); };
  },
  // Agua: pozones y orilla del lago, con burbujas
  agua(out) {
    const a = src('brown'), lp = filt('lowpass', 900), ga = gain(0.14);
    a.connect(lp).connect(ga).connect(out);
    const l = lfo(0.22, 0.05, ga.gain);
    const stop = sprinkle(out, 380, (o) => bloop(o, { f: 180 + Math.random() * 380, vol: 0.02 + Math.random() * 0.03 }));
    return () => { [a, l].forEach((x) => x.stop()); stop(); };
  },
  // Viento de montaña
  viento(out) {
    const a = src('white'), bp = filt('bandpass', 600, 0.9), ga = gain(0.05);
    a.connect(bp).connect(ga).connect(out);
    const l1 = lfo(0.06, 380, bp.frequency), l2 = lfo(0.11, 0.035, ga.gain);
    const b = src('brown'), lp = filt('lowpass', 180), gb = gain(0.1);
    b.connect(lp).connect(gb).connect(out);
    return () => [a, b, l1, l2].forEach((x) => x.stop());
  },
};

function play(name) {
  wanted = AMBIENCES[name] ? name : 'sala';
  if (!on || !ctx) return;
  if (current?.name === wanted) return;
  const t = ctx.currentTime;
  if (current) {
    const old = current;
    old.g.gain.cancelScheduledValues(t); old.g.gain.setValueAtTime(old.g.gain.value, t); old.g.gain.linearRampToValueAtTime(0, t + 1.6);
    setTimeout(() => old.stop(), 1800);
  }
  const g = gain(0); g.connect(master);
  const stop = AMBIENCES[wanted](g);
  g.gain.linearRampToValueAtTime(1, t + 2.2);
  current = { name: wanted, g, stop };
}

// Clic suave de obturador al cambiar de escena
export function shutter() {
  if (!on || !ctx) return;
  burst(master, { f: 900, q: 0.8, len: 0.05, vol: 0.12, type: 'lowpass' });
  setTimeout(() => on && burst(master, { f: 1600, q: 1, len: 0.03, vol: 0.06 }), 70);
}

export function ambience(name) { play(name); }
export const soundOn = () => on;
export const onSound = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

function setOn(v) {
  on = v;
  store.set(v);
  if (v) {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);
      noise = buffers();
    }
    ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.2);
    current = null;
    play(wanted);
  } else if (ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    setTimeout(() => { if (!on) { current?.stop(); current = null; ctx.suspend(); } }, 700);
  }
  document.querySelectorAll('[data-sound]').forEach((b) => { b.setAttribute('aria-pressed', String(v)); b.setAttribute('aria-label', v ? 'Silenciar sonido ambiente' : 'Activar sonido ambiente'); });
  document.documentElement.classList.toggle('sound-on', v);
  listeners.forEach((fn) => fn(v));
}

export function initSound() {
  const btns = document.querySelectorAll('[data-sound]');
  btns.forEach((b) => b.addEventListener('click', () => setOn(!on)));
  // Si el visitante lo dejó encendido, vuelve a sonar con su primer gesto en esta página
  if (store.get() && btns.length) {
    const resume = () => { removeEventListener('pointerdown', resume); removeEventListener('keydown', resume); if (!on) setOn(true); };
    addEventListener('pointerdown', resume, { once: true });
    addEventListener('keydown', resume, { once: true });
    document.documentElement.classList.add('sound-pref');
  }
  document.addEventListener('visibilitychange', () => { if (!ctx || !on) return; document.hidden ? ctx.suspend() : ctx.resume(); });
}

// Sonido del fogón generado en el navegador (sin archivos): un murmullo grave de leña
// y chasquidos aleatorios de brasas. Solo suena cuando la persona lo activa.
export function initSound() {
  const btn = document.querySelector('[data-sound]');
  if (!btn || !(window.AudioContext || window.webkitAudioContext)) { btn?.remove(); return; }
  let ac = null, master = null, timer = null, on = false;

  function setup() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
    // Murmullo: ruido marrón filtrado en bucle
    const len = ac.sampleRate * 3, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
    const g = ac.createGain(); g.gain.value = 0.55;
    src.connect(lp).connect(g).connect(master); src.start();
  }
  function crackle() {
    const t = ac.currentTime, dur = 0.008 + Math.random() * 0.05;
    const n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (n * 0.18));
    const s = ac.createBufferSource(); s.buffer = buf;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900 + Math.random() * 4200; bp.Q.value = 0.8 + Math.random() * 2;
    const g = ac.createGain(); g.gain.value = 0.08 + Math.random() ** 2 * 0.6;
    s.connect(bp).connect(g).connect(master); s.start(t);
    // A veces llegan en ráfagas, como cuando una brasa se parte
    timer = setTimeout(crackle, Math.random() < 0.25 ? 20 + Math.random() * 60 : 90 + Math.random() * 420);
  }
  function toggle(force) {
    on = force ?? !on;
    if (on) {
      if (!ac) setup();
      ac.resume();
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.linearRampToValueAtTime(0.5, ac.currentTime + 1.2);
      clearTimeout(timer); crackle();
    } else if (ac) {
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.6);
      clearTimeout(timer);
    }
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('.sound__txt').textContent = on ? 'Silenciar el fogón' : 'Escuchar el fogón';
  }
  btn.addEventListener('click', () => toggle());
  document.addEventListener('visibilitychange', () => { if (document.hidden && on) { toggle(false); btn.dataset.resume = '1'; } else if (!document.hidden && btn.dataset.resume) { delete btn.dataset.resume; toggle(true); } });
}

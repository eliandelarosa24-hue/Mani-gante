// Portada: las obras como cine. En computador, un proyector WebGL a pantalla completa pasa de una obra
// a la siguiente con el scroll; en celular (o con "reducir movimiento"), escenas a pantalla completa
// que se revelan al entrar, sin WebGL.
import { boot, reveal, splitChars, splitLines, getLenis, $, $$, gsap, ScrollTrigger, reduced, fine, small, track } from './core.js';
import { createCinema } from './cinema-gl.js';
import { ambience, shutter } from './sound.js';
import { SCENES } from './scenes.js';
import { latY } from './markup.mjs';

const SOUND = { 'termas-rayenko': 'agua', 'villa-coral-samana': 'mar', 'domos-cielo-austral': 'noche', 'hotel-casa-nogal': 'lluvia', 'pucon-aventura': 'viento', 'fogon-mapu': 'fuego', 'cabanas-lago-azul': 'agua', 'vina-los-robles': 'viento', 'kuchen-haus-frutillar': 'fuego', 'estudio-haber': 'sala' };

boot();
const html = document.documentElement;
const cinemaMode = fine && !reduced && !small() && !!window.WebGLRenderingContext;
html.classList.add(cinemaMode ? 'is-cinema' : 'is-light');

// ---------- entrada ----------
function intro() {
  const loader = $('[data-intro]');
  const seen = html.classList.contains('seen') || reduced;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (loader && !seen) {
    const count = $('[data-intro-count]', loader);
    const o = { v: 0 };
    tl.set(loader, { autoAlpha: 1 })
      .fromTo('.intro__mark .em__north, .intro__mark .em__south', { strokeDasharray: 180, strokeDashoffset: 180 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power3.inOut' }, 0)
      .from('.intro__mark .em__palm path', { scale: 0, transformOrigin: '50% 34%', duration: 0.9, stagger: 0.04 }, 0.25)
      .from('.intro__mark .em__trunk', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.8, ease: 'power3.out' }, 0.15)
      .from('.intro__mark .em__arau path', { scaleX: 0, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.05 }, 0.45)
      .from('.intro__mark .em__roots', { opacity: 0, duration: 0.6 }, 0.7)
      .to(o, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { if (count) count.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0)
      .from('[data-intro-line]', { yPercent: 120, duration: 1, stagger: 0.08 }, 0.3)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 1.75)
      .set(loader, { display: 'none' });
  } else loader?.remove();
  return tl;
}

// ---------- apertura ----------
function opening(tl) {
  const title = $('[data-open-title]');
  if (!title || reduced) return;
  const lines = splitLines(title);
  tl.from(lines, { yPercent: 115, rotate: 3, duration: 1.5, stagger: 0.09 }, html.classList.contains('seen') ? 0.1 : '-=0.55')
    .from('[data-open-fade]', { y: 26, opacity: 0, duration: 1.2, stagger: 0.08 }, '-=1.15');
}

// ---------- escenas (compartido) ----------
function paintTitle(el) {
  if (!el || el.dataset.ready) return;
  el.dataset.ready = '1';
  splitChars(el);
  // Titulares con degradado recortado al texto (lava, Vía Láctea): el degradado pasa a cada letra
  el.querySelectorAll('em').forEach((em) => {
    if (!/background-clip/.test(em.getAttribute('style') || '')) return;
    const bg = em.style.backgroundImage;
    em.querySelectorAll('.ch').forEach((c) => Object.assign(c.style, { backgroundImage: bg, webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', webkitTextFillColor: 'transparent' }));
    Object.assign(em.style, { backgroundImage: 'none', color: 'inherit' });
  });
}

// ---------- modo cine (computador) ----------
function cinema() {
  const reel = $('[data-reel]'), canvas = $('[data-cinema]');
  if (!reel || !canvas) return;
  const gl = createCinema(canvas, { onFirstFrame: () => html.classList.add('gl-ready') });
  if (!gl) { html.classList.replace('is-cinema', 'is-light'); return light(); }
  gl.setScenes(SCENES);
  gl.start();

  const scenes = $$('[data-scene]', reel);
  const ticks = $$('[data-tick]');
  const counter = $('[data-reel-n]'), fill = $('[data-reel-fill]'), tc = $('[data-timecode]');
  const now = $('[data-lat-now]'), rail = $('.rail'), cue = $('.cue'), sub = $('[data-reel-sub]');
  const fmtLat = (lat) => { const a = Math.abs(lat), d = Math.floor(a), m = Math.round((a - d) * 60); return Math.abs(lat) < 0.2 ? '0° · Ecuador' : `${d}°${String(m === 60 ? 59 : m).padStart(2, '0')}′ ${lat > 0 ? 'N' : 'S'}`; };
  const N = scenes.length;
  scenes.forEach((s) => paintTitle($('.wtitle', s)));
  let active = -1;

  const show = (i) => {
    if (i === active) return;
    const prev = active; active = i;
    scenes.forEach((s, k) => s.classList.toggle('is-active', k === i));
    ticks.forEach((t, k) => t.setAttribute('aria-current', String(k === i)));
    if (counter) counter.textContent = String(i + 1).padStart(2, '0');
    const s = scenes[i];
    html.style.setProperty('--scene-accent', SCENES[i].accent);
    if (prev >= 0) { gsap.to($$('.ch', scenes[prev]), { yPercent: -110, opacity: 0, duration: 0.5, stagger: 0.008, ease: 'power3.in', overwrite: true }); gsap.to($$('[data-scene-fade]', scenes[prev]), { opacity: 0, y: -14, duration: 0.4, overwrite: true }); }
    gsap.fromTo($$('.ch', s), { yPercent: 110, opacity: 0, rotate: 4 }, { yPercent: 0, opacity: 1, rotate: 0, duration: 1.15, stagger: 0.018, ease: 'expo.out', delay: prev >= 0 ? 0.25 : 0, overwrite: true });
    gsap.fromTo($$('[data-scene-fade]', s), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06, ease: 'expo.out', delay: prev >= 0 ? 0.45 : 0.2, overwrite: true });
    ambience(SOUND[SCENES[i].slug]);
    if (prev >= 0) shutter();
  };

  // El scroll del bloque del cine se reparte entre las escenas: cada una se sostiene y luego corta
  let pos = 0, last = 0;
  const HOLD = 0.58;
  ScrollTrigger.create({
    trigger: reel, start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => {
      const p = st.progress * (N - 1 + 0.6);           // un poco de cola en la última
      const i = Math.min(N - 1, Math.floor(p)), t = p - i;
      const m = i >= N - 1 ? 0 : gsap.utils.clamp(0, 1, (t - HOLD) / (1 - HOLD));
      const eased = m * m * (3 - 2 * m);
      pos = i + eased;
      gl.set(pos, (pos - last) * 18);
      last = pos;
      show(Math.min(N - 1, Math.round(pos)));
      // Latitud que rueda entre una obra y la siguiente, marcas de cambio de rollo y cruce del ecuador
      const la = SCENES[i].lat, lb = SCENES[Math.min(N - 1, i + 1)].lat, lat = la + (lb - la) * eased;
      if (now) { now.textContent = fmtLat(lat); rail.style.setProperty('--now', (latY(lat) * 100).toFixed(2) + '%'); }
      if (cue) cue.classList.toggle('is-on', i < N - 1 && ((t > 0.44 && t < 0.48) || (t > 0.52 && t < 0.56)));
      if (sub) { const eq = i === 0 && m > 0.08 && m < 0.92; sub.textContent = eq ? '— Cruzamos la línea del ecuador.' : ''; sub.classList.toggle('is-on', eq); }
      if (fill) fill.style.transform = `scaleX(${st.progress})`;
      if (tc) { const secs = st.progress * 600; tc.textContent = `00:${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(Math.floor(secs % 60)).padStart(2, '0')}:${String(Math.floor((secs * 24) % 24)).padStart(2, '0')}`; }
    },
  });

  // Antes del cine: la portada se oscurece; después: el proyector se apaga
  ScrollTrigger.create({ trigger: '[data-open]', start: 'top top', end: 'bottom top', onUpdate: (st) => gl.dim(0.38 + 0.62 * st.progress) });
  gl.dim(0.38);
  ScrollTrigger.create({ trigger: reel, start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: html, className: 'in-reel' } });
  ScrollTrigger.create({
    trigger: reel, start: 'bottom bottom', end: 'bottom top',
    onUpdate: (st) => gl.dim(1 - st.progress),
    onLeave: () => { gl.visible(false); ambience('sala'); },
    onEnterBack: () => gl.visible(true),
  });
  show(0);

  addEventListener('pointermove', (e) => gl.pointer(e.clientX / innerWidth, 1 - e.clientY / innerHeight), { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? gl.stop() : gl.start()));

  // Línea de tiempo: saltar a una obra
  ticks.forEach((t, k) => t.addEventListener('click', () => {
    const st = ScrollTrigger.getAll().find((x) => x.trigger === reel);
    const y = st.start + ((k + 0.25) / (N - 1 + 0.6)) * (st.end - st.start);
    const lenis = getLenis();
    lenis ? lenis.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y, behavior: 'smooth' });
    track('reel_jump', { work: SCENES[k].slug });
  }));
}

// ---------- modo liviano (celular) ----------
function light() {
  const scenes = $$('[data-scene]');
  scenes.forEach((s) => paintTitle($('.wtitle', s)));
  if (reduced) { scenes.forEach((s) => s.classList.add('is-active')); return; }
  scenes.forEach((s) => {
    const img = $('.scene__img', s);
    gsap.fromTo(img, { clipPath: 'inset(12% 10% 12% 10%)', scale: 1.18 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 20%', scrub: true } });
    ScrollTrigger.create({
      trigger: s, start: 'top 55%', once: true,
      onEnter: () => {
        s.classList.add('is-active');
        gsap.fromTo($$('.ch', s), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.015, ease: 'expo.out' });
        gsap.fromTo($$('[data-scene-fade]', s), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.2 });
      },
    });
    ScrollTrigger.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: (st) => st.isActive && ambience(SOUND[s.dataset.slug]) });
  });
}

// ---------- obras en el aire y cierre ----------
function rest() {
  reveal();
  // Video de cada proyecto real solo cuando se ve
  $$('video[data-src]').forEach((v) => {
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      v.innerHTML = `<source src="${v.dataset.src}.webm" type="video/webm"><source src="${v.dataset.src}.mp4" type="video/mp4">`;
      v.load(); v.play().catch(() => {});
    }, { rootMargin: '200px' }).observe(v);
  });
}

const tl = intro();
const start = () => {
  opening(tl);
  if (html.classList.contains('is-cinema')) cinema(); else light();
  rest();
  ScrollTrigger.refresh();
};
(document.fonts?.ready || Promise.resolve()).then(start);

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
      .fromTo('.intro__sweep', { '--sw': '0deg' }, { '--sw': '360deg', duration: 0.5, repeat: 2, ease: 'none' }, 0)
      .to('.intro__sweep, .intro__ring', { opacity: 0, scale: 1.15, duration: 0.6, ease: 'power2.in' }, 1.45)
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
  // El titular entra como una imagen que el proyectista pone en foco
  tl.from(lines, { yPercent: 115, rotate: 3, duration: 1.5, stagger: 0.09 }, html.classList.contains('seen') ? 0.1 : '-=0.55')
    .fromTo(title, { filter: 'blur(16px)', opacity: 0.4 }, { filter: 'blur(0px)', opacity: 1, duration: 2.2, ease: 'power2.out', clearProps: 'filter,opacity' }, '<')
    .from('[data-open-fade]', { y: 26, opacity: 0, duration: 1.2, stagger: 0.08 }, '-=1.15');
}

// ---------- polvo en el haz ----------
// Motas que flotan en la luz del proyector: brillan dentro del haz y el puntero las revuelve como una mano en la luz
function dust() {
  const cv = $('[data-dust]');
  if (!cv || reduced) return;
  const ctx = cv.getContext('2d'), open = cv.parentElement;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const R = Math.random;
  const motes = Array.from({ length: small() ? 40 : 120 }, () => {
    const far = R() < 0.12;
    const bvx = (R() - 0.5) * 0.00008, bvy = (R() - 0.55) * 0.00016;
    return { x: R(), y: R(), r: far ? 3 + R() * 4 : 0.6 + R() ** 2.5 * 1.7, a: far ? 0.16 : 1, bvx, bvy, vx: bvx, vy: bvy, p: R() * 6.28, s: 0.4 + R() * 1.2 };
  });
  let w = 0, h = 0, run = false, raf = 0, mx = -1, my = -1, pvx = 0, pvy = 0;
  const size = () => { w = open.clientWidth; h = open.clientHeight; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); };
  // Intensidad del haz: un cono que nace arriba al centro y se abre hacia abajo
  const beam = (x, y) => { const d = Math.abs(x - 0.5) / (0.1 + (y + 0.16) * 0.36); return Math.max(0, 1 - d * d); };
  open.addEventListener('pointermove', (e) => {
    const r = open.getBoundingClientRect(), x = (e.clientX - r.left) / w, y = (e.clientY - r.top) / h;
    if (mx >= 0) { pvx = x - mx; pvy = y - my; }
    mx = x; my = y;
  }, { passive: true });
  const frame = (t) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const m of motes) {
      const dx = m.x - mx, dy = (m.y - my) * (h / w), d2 = dx * dx + dy * dy;
      if (mx >= 0 && d2 < 0.012) { const f = (1 - d2 / 0.012) * 0.05; m.vx += pvx * f; m.vy += pvy * f; }
      m.vx += (m.bvx - m.vx) * 0.015; m.vy += (m.bvy - m.vy) * 0.015;
      m.x += m.vx + Math.sin(t * 0.00025 + m.p) * 0.00005; m.y += m.vy;
      if (m.y < -0.03) m.y = 1.03; else if (m.y > 1.03) m.y = -0.03;
      if (m.x < -0.03) m.x = 1.03; else if (m.x > 1.03) m.x = -0.03;
      const a = (0.08 + beam(m.x, m.y) * 0.92) * (0.45 + 0.55 * Math.sin(t * 0.001 * m.s + m.p)) * m.a;
      if (a < 0.01) continue;
      const x = m.x * w, y = m.y * h;
      ctx.fillStyle = `rgba(255,238,214,${(a * 0.14).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, m.r * 3.2, 0, 6.2832); ctx.fill();
      ctx.fillStyle = `rgba(255,244,228,${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, m.r, 0, 6.2832); ctx.fill();
    }
    pvx *= 0.9; pvy *= 0.9;
    raf = requestAnimationFrame(frame);
  };
  size();
  addEventListener('resize', size);
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !run) { run = true; raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && run) { run = false; cancelAnimationFrame(raf); }
  }).observe(open);
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

  // Escenario de pantallas: navegador y celular con el sitio de la obra; los videos se cargan un poco antes
  const stageEl = $('[data-stage]'), vd = $('[data-stage-d]'), vm = $('[data-stage-m]'), su = $('[data-stage-url]'), sn = $('[data-stage-name]');
  let staged = -1, playing = false;
  const srcs = (v, base) => { v.poster = base + '.jpg'; v.innerHTML = `<source src="${base}.webm" type="video/webm"><source src="${base}.mp4" type="video/mp4">`; v.load(); };
  const links = $$('[data-stage-link]');
  const stage = (i, k, out) => {
    if (staged !== i) {
      staged = i;
      srcs(vd, SCENES[i].site.d); srcs(vm, SCENES[i].site.m);
      su.textContent = `redvaeru.netlify.app${SCENES[i].sample}`;
      sn.textContent = SCENES[i].name;
      links.forEach((a) => (a.href = SCENES[i].sample));
    }
    stageEl.style.setProperty('--in', k.toFixed(3));
    stageEl.classList.toggle('is-live', k > 0.6);
    const sc = scenes[i]; if (sc) { sc.style.setProperty('--out', out.toFixed(3)); sc.classList.toggle('is-hidden', out > 0.95); }
    const on = k > 0.02;
    if (on && !playing) { playing = true; vd.play().catch(() => {}); vm.play().catch(() => {}); }
    if (!on && playing) { playing = false; vd.pause(); vm.pause(); }
  };

  const show = (i) => {
    if (i === active) return;
    const prev = active; active = i;
    scenes.forEach((s, k) => { s.classList.toggle('is-active', k === i); if (k !== i) s.style.setProperty('--out', 0); });
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
  // Cada obra tiene tres tiempos: el lugar (foto y titular), la pantalla (su sitio funcionando) y el corte.
  let pos = 0, last = 0;
  const HOLD = 0.8, TAIL = 0.78;
  const ramp = (t, a, b) => gsap.utils.clamp(0, 1, (t - a) / (b - a));
  const smooth = (x) => x * x * (3 - 2 * x);
  ScrollTrigger.create({
    trigger: reel, start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => {
      const p = st.progress * (N - 1 + TAIL);
      const i = Math.min(N - 1, Math.floor(p)), t = p - i;
      const m = i >= N - 1 ? 0 : gsap.utils.clamp(0, 1, (t - HOLD) / (1 - HOLD));
      const eased = smooth(m);
      pos = i + eased;
      // La pantalla: entra entre 0,30 y 0,42; se va entre 0,66 y 0,76
      const k = smooth(ramp(t, 0.32, 0.44)) * (1 - smooth(ramp(t, 0.66, 0.76)));
      // El titular se va antes de que lleguen las pantallas y no vuelve: tras ellas queda solo el lugar, y luego el corte
      const out = i >= N - 1 ? smooth(ramp(t, 0.24, 0.32)) * (1 - smooth(ramp(t, 0.7, 0.78))) : smooth(ramp(t, 0.24, 0.32));
      stage(i, k, out);
      gl.set(pos, (pos - last) * 18);
      gl.blur(k * 0.9, k);
      gl.dim(0.38 + 0.62 * openK - k * 0.42);
      last = pos;
      show(Math.min(N - 1, Math.round(pos)));
      // Latitud que rueda entre una obra y la siguiente, marcas de cambio de rollo y cruce del ecuador
      const la = SCENES[i].lat, lb = SCENES[Math.min(N - 1, i + 1)].lat, lat = la + (lb - la) * eased;
      if (now) { now.textContent = fmtLat(lat); rail.style.setProperty('--now', (latY(lat) * 100).toFixed(2) + '%'); }
      if (cue) cue.classList.toggle('is-on', i < N - 1 && ((t > 0.7 && t < 0.73) || (t > 0.75 && t < 0.78)));
      if (sub) { const eq = i === 0 && m > 0.08 && m < 0.92; sub.textContent = eq ? '— Cruzamos la línea del ecuador.' : ''; sub.classList.toggle('is-on', eq); }
      if (fill) fill.style.transform = `scaleX(${st.progress})`;
      if (tc) { const secs = st.progress * 600; tc.textContent = `00:${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(Math.floor(secs % 60)).padStart(2, '0')}:${String(Math.floor((secs * 24) % 24)).padStart(2, '0')}`; }
    },
  });

  // Antes del cine: la portada se oscurece; después: el proyector se apaga
  let openK = 0;
  ScrollTrigger.create({ trigger: '[data-open]', start: 'top top', end: 'bottom top', onUpdate: (st) => { openK = st.progress; gl.dim(0.38 + 0.62 * openK); } });
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
    const y = st.start + ((k + 0.12) / (N - 1 + TAIL)) * (st.end - st.start);
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
    // El sitio en celular: se carga al acercarse y solo corre mientras la escena está en pantalla
    const v = $('.scene__phone video', s);
    if (v) {
      gsap.from(v.parentElement, { yPercent: 30, rotate: 10, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 45%' } });
      ScrollTrigger.create({
        trigger: s, start: 'top 85%', end: 'bottom 15%',
        onToggle: (st) => {
          if (st.isActive) {
            if (!v.dataset.ready) { v.dataset.ready = '1'; v.innerHTML = `<source src="${v.dataset.msrc}.webm" type="video/webm"><source src="${v.dataset.msrc}.mp4" type="video/mp4">`; v.load(); }
            v.play().catch(() => {});
          } else v.pause();
        },
      });
    }
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
  // Intermedio: la cola de proyección cuenta 3, 2, 1 mientras se baja hacia el documental
  const inter = $('[data-inter]');
  if (inter && !reduced) {
    const sweep = $('.inter__sweep', inter), n = $('[data-inter-n]', inter);
    ScrollTrigger.create({ trigger: inter, start: 'top bottom', end: 'bottom top', onUpdate: (st) => {
      const k = st.progress * 3;
      sweep.style.setProperty('--sw', `${((k % 1) * 360).toFixed(1)}deg`);
      n.textContent = String(Math.max(1, 3 - Math.floor(k)));
    } });
  }
  // Testimonio: cada palabra pasa de penumbra a luz mientras se baja
  const vq = $('[data-voice] p');
  if (vq && !reduced) {
    const e = (w) => w.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    vq.innerHTML = vq.textContent.split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? w : `<span class="vw">${e(w)}</span>`)).join('');
    gsap.fromTo($$('.vw', vq), { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: vq, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 } });
  }
  // «Su estreno» y sus tipografías se descargan solo al acercarse al final
  const est = $('[data-estreno]');
  if (est) new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    import('./estreno.js').then((m) => { m.estreno(est); html.classList.add('has-estreno'); });
  }, { rootMargin: '900px' }).observe(est);
}

const tl = intro();
const start = () => {
  opening(tl);
  dust();
  if (html.classList.contains('is-cinema')) cinema(); else light();
  rest();
  ScrollTrigger.refresh();
};
(document.fonts?.ready || Promise.resolve()).then(start);

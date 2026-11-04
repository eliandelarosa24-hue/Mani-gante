// Portada: las obras salen del proyector en un túnel 3D junto al titular y, más abajo, giran en una vitrina
// limpia, marca por marca, con su sitio funcionando y el botón para visitarlo.
import { boot, reveal, splitChars, splitLines, projectorLight, getLenis, $, $$, gsap, ScrollTrigger, reduced, fine, small, track } from './core.js';
import { ambience } from './sound.js';

const SOUND = { 'termas-rayenko': 'agua', 'villa-coral-samana': 'mar', 'domos-cielo-austral': 'noche', 'hotel-casa-nogal': 'lluvia', 'pucon-aventura': 'viento', 'fogon-mapu': 'fuego', 'cabanas-lago-azul': 'agua', 'vina-los-robles': 'viento', 'kuchen-haus-frutillar': 'fuego', 'estudio-haber': 'sala' };

boot();
const html = document.documentElement;
// Túnel y vitrina ocupan su propio tramo de scroll (CSS sticky); con «reducir movimiento», no
if (!reduced && $('.tn')) html.classList.add('has-tunnel');
if (!reduced && $('[data-ring]')) html.classList.add('has-ring');

// ---------- entrada ----------
// Con «ahorro de datos» o una conexión lenta, la cuenta regresiva se omite y la portada aparece de inmediato
const net = navigator.connection;
const slow = !!(net?.saveData || /(^|-)(2g|3g)$/.test(net?.effectiveType || ''));

function intro() {
  const loader = $('[data-intro]');
  const seen = html.classList.contains('seen') || reduced || slow;
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
      .to(loader, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, 1.75)
      .set(loader, { display: 'none' });
    // Quien ya quiere entrar no espera: un toque, una tecla o la rueda pasan directo al telón
    const EV = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    const off = () => EV.forEach((e) => removeEventListener(e, skip));
    const skip = () => { off(); if (tl.time() < 1.75) { tl.seek(1.75); tl.timeScale(1); } };
    EV.forEach((e) => addEventListener(e, skip, { passive: true }));
    tl.call(off, null, 1.75);
    // La cuenta regresiva es breve (más aún en celular); la apertura vuelve a su ritmo
    tl.timeScale(small() ? 2 : 1.6); tl.call(() => tl.timeScale(1), null, 1.75);
  } else loader?.remove();
  return tl;
}

// ---------- apertura ----------
function opening(tl, tn) {
  const title = $('[data-open-title]');
  if (!title || reduced) return;
  const lines = splitLines(title);
  // El titular sube desde su línea y se enciende (solo opacidad: sin desenfoque, que repinta todo en cada cuadro)
  tl.from(lines, { yPercent: 160, rotate: 3, duration: 1.5, stagger: 0.09 }, tl.getChildren().length ? '-=0.55' : 0.1)
    .fromTo(title, { opacity: 0.4 }, { opacity: 1, duration: 1.6, ease: 'power2.out', clearProps: 'opacity' }, '<')
    .add(projectorLight(title, { duration: 2.1 }), '<0.15')
    .add(() => tn?.boot(), '<0.35')
    .from('[data-open-fade]', { y: 26, opacity: 0, duration: 1.2, stagger: 0.08 }, '-=1.15');
}

// ---------- túnel de obras ----------
// Las obras salen del fondo del proyector y vuelan hacia quien mira mientras la portada queda fija. Al llegar,
// las primeras se asoman a lo lejos; el scroll hace el resto. El titular cambia su palabra por la de la obra que
// pasa («Proyectamos termas.») y su tipografía variable se ensancha con el viaje y bajo el puntero.
function tunnel() {
  const open = $('[data-open]'), title = $('[data-open-title]'), word = $('[data-open-word]');
  const cards = open ? $$('.tn', open) : [];
  if (!title || !word || !cards.length || reduced) return null;
  const rings = $('[data-rings]', open), fades = [...$$('[data-open-fade]', open), $('.open__foot', open)].filter(Boolean);

  // Las fotos se piden después del titular, para no competir con él al cargar
  cards.forEach((c) => { const src = $('source', c), img = $('img', c); if (src) src.srcset = src.dataset.srcset; img.src = img.dataset.src; });

  const N = cards.length, SPAN = 0.55, BOOT = 0.12;
  const items = cards.map((el, i) => {
    const a = i * 137.5 * (Math.PI / 180);
    return { el, start: (i / N) * (1 - SPAN), cos: Math.cos(a), sin: Math.sin(a), fx: 0.28 + (i % 3) * 0.08, fy: 0.26 + (i % 2) * 0.09, rot: (i % 2 ? -1 : 1) * (3 + (i % 5) * 2), word: el.dataset.word, o: -1, f: -1 };
  });
  let W = innerWidth, H = innerHeight, mob = W < 768, dirty = true;
  addEventListener('resize', () => { W = innerWidth; H = innerHeight; mob = W < 768; dirty = true; });

  const st8 = { boot: 0 };
  let scroll = 0, shown = 0, px = 0, py = 0, tx = 0, ty = 0, pointer = false;
  const clamp = gsap.utils.clamp(0, 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  // Cada obra aparece lejos, se sostiene y se apaga al pasar junto a la cámara. Mientras está lejos se ve más
  // tenue (niebla): va dentro de su opacidad, que la tarjeta gráfica cambia sin repintar la foto
  const fade = (t) => (t < 0.3 ? t / 0.3 : t > 0.82 ? Math.max(0, 1 - (t - 0.82) / 0.16) : 1);
  const fog = (t) => { const k = clamp(t / 0.5); return 0.7 * (1 - k * k * (3 - 2 * k)); };
  const seen = { scale: -1, op: -1, step: -1, out: -1, rs: -1 };

  // El tramo lo da el contenedor alto de la portada (CSS sticky), sin pin de GSAP
  ScrollTrigger.create({
    trigger: $('[data-open-run]') || open, start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => { scroll = st.progress; dirty = true; },
  });
  if (fine && !small()) addEventListener('pointermove', (e) => { tx = (e.clientX / W - 0.5) * 2; ty = (e.clientY / H - 0.5) * 2; pointer = true; dirty = true; }, { passive: true });

  // Letras del titular que responden al puntero (computador)
  const spell = (w) => [...w].map((c) => '<span class="ch">' + c + '</span>').join('');
  let chars = [];
  const collect = () => { chars = fine ? $$('.ch', title).map((el) => ({ el, w: 0, s: 0 })) : []; };
  if (fine) { splitChars($('[data-open-a]', title)); word.innerHTML = spell(word.textContent); collect(); }

  // La palabra del titular entra letra por letra desde abajo, dentro de la máscara de su línea
  let current = word.textContent;
  const setWord = (w) => {
    if (w === current) return;
    current = w;
    word.innerHTML = spell(w);
    gsap.fromTo(word.children, { yPercent: 115, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 0.6, stagger: 0.018, ease: 'expo.out', overwrite: true });
    collect();
  };

  gsap.set(title, { x: 0, y: 0, xPercent: -50, yPercent: -50 });
  const render = () => {
    // Suavizado por tiempo, no por cuadro: igual en una pantalla de 60 o de 120 Hz
    const r = gsap.ticker.deltaRatio(60), ks = 1 - 0.8 ** r, kp = 1 - 0.94 ** r;
    shown += (scroll - shown) * ks;
    px += (tx - px) * kp; py += (ty - py) * kp;
    const settling = Math.abs(scroll - shown) > 0.0004 || Math.abs(tx - px) > 0.002 || Math.abs(ty - py) > 0.002;
    if (!dirty && !settling) return;
    dirty = false;
    const P = Math.min(1, st8.boot * BOOT + shown * (1 - BOOT));
    const far = mob ? -1200 : -1700, near = mob ? 350 : 500, pan = mob ? 20 : 45;
    let lead = -1;
    for (let i = 0; i < N; i++) {
      const c = items[i], t = clamp((P - c.start) / SPAN), o = Math.round(fade(t) * (1 - fog(t)) * 100) / 100;
      if (t >= 0.6 && t < 0.97) lead = i;
      if (o < 0.01) { if (c.o !== 0) { c.el.style.visibility = 'hidden'; c.el.style.opacity = '0'; c.o = 0; } continue; }
      const x = c.cos * W * c.fx - px * pan, y = c.sin * H * c.fy - py * pan, z = lerp(far, near, t);
      c.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px, ' + z.toFixed(1) + 'px) rotateZ(' + c.rot + 'deg)';
      if (c.o !== o) { c.el.style.opacity = o; if (c.o <= 0) c.el.style.visibility = 'visible'; c.o = o; }
    }
    // Titular: se acerca con el viaje, se ensancha a mitad de camino y se apaga al final
    // La tipografía variable cambia por escalones (ocho a lo largo del viaje), no en cada cuadro: cada cambio
    // de peso o ancho obliga a recomponer el titular
    const q = clamp((P - BOOT) / (1 - BOOT)), step = Math.round(Math.sin(Math.PI * q) * 8) / 8;
    const scale = Math.round((P < 0.5 ? lerp(0.94, 1, P / 0.5) : lerp(1, 1.32, (P - 0.5) / 0.5)) * 500) / 500;
    const op = Math.round((1 - clamp((P - 0.86) / 0.12)) * 100) / 100;
    if (scale !== seen.scale || op !== seen.op) { gsap.set(title, { scale, opacity: op }); seen.scale = scale; seen.op = op; }
    if (step !== seen.step) {
      seen.step = step;
      title.style.setProperty('--wg', String(Math.round(300 + 110 * step)));
      title.style.setProperty('--ws', (62.5 + 12.5 * step).toFixed(2) + '%');
    }
    setWord(lead >= 0 && P < 0.9 ? items[lead].word : 'lugares.');
    const out = Math.round((1 - clamp((P - BOOT - 0.01) / 0.07)) * 50) / 50;
    if (out !== seen.out) { seen.out = out; fades.forEach((f) => (f.style.opacity = out)); }
    const rs = Math.round((1 + P * 0.9) * 200) / 200;
    if (rings && rs !== seen.rs) { seen.rs = rs; rings.style.transform = 'scale(' + rs + ')'; }
    // Puntero sobre el titular: cada letra engrosa y se ensancha según lo cerca que pase
    if (pointer && chars.length && Math.abs(scroll - shown) < 0.002) {
      const R = Math.max(200, W * 0.2), mx = (tx / 2 + 0.5) * W, my = (ty / 2 + 0.5) * H;
      const rects = chars.map((c) => c.el.getBoundingClientRect());
      chars.forEach((c, i) => {
        const r = rects[i];
        const k = Math.max(0, 1 - Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2)) / R), e = k * k * (3 - 2 * k);
        c.w += (190 * e - c.w) * 0.18; c.s += (12 * e - c.s) * 0.18;
        if (Math.abs(190 * e - c.w) > 1) dirty = true;
        const w = Math.round(c.w / 10) * 10, st = Math.round(c.s);
        if (w !== c.qw || st !== c.qs) { c.qw = w; c.qs = st; c.el.style.setProperty('--pw', String(w)); c.el.style.setProperty('--ps', st + '%'); }
      });
    }
  };
  gsap.ticker.add(render);
  return { boot: () => gsap.to(st8, { boot: 1, duration: 2.8, ease: 'power2.out', onUpdate: () => { dirty = true; } }) };
}

// ---------- el titular en su espacio ----------
// En pantallas bajas (celular chico o acostado) el titular se centra entre el antetítulo y el pie, y se achica
// si no cabe, para que nunca lo tape el texto de presentación
function fitOpen() {
  const open = $('[data-open]'), title = $('[data-open-title]');
  if (!open || !title) return;
  const kicker = $('.open__kicker', open), foot = $('.open__foot', open);
  const fit = () => {
    title.style.setProperty('--tk', 1);
    const o = open.getBoundingClientRect().top, kr = kicker.getBoundingClientRect();
    const k = (kr.height ? kr.bottom : $('.hd')?.getBoundingClientRect().bottom || 0) - o + 12;
    const f = foot.getBoundingClientRect().top - o - 12;
    const h = title.offsetHeight;
    if (h > f - k) title.style.setProperty('--tk', Math.max(0.55, (f - k) / h).toFixed(3));
    title.style.top = ((k + f) / 2).toFixed(1) + 'px';
  };
  fit();
  let t = 0;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fit, 150); });
}

// ---------- polvo en el haz ----------
// Motas que flotan en la luz del proyector: brillan dentro del haz y el puntero las revuelve como una mano en la luz
function dust() {
  const cv = $('[data-dust]');
  if (!cv || reduced) return;
  const ctx = cv.getContext('2d'), open = cv.parentElement;
  const dpr = small() ? 1 : Math.min(devicePixelRatio || 1, 1.25);
  const R = Math.random;
  // La mota (halo y centro) se dibuja una sola vez; después solo se estampa con su opacidad
  const sprite = document.createElement('canvas'), SZ = 64;
  sprite.width = sprite.height = SZ;
  const sc = sprite.getContext('2d'), grad = sc.createRadialGradient(SZ / 2, SZ / 2, 0, SZ / 2, SZ / 2, SZ / 2);
  grad.addColorStop(0, 'rgba(255,246,232,1)'); grad.addColorStop(0.28, 'rgba(255,244,228,0.9)'); grad.addColorStop(0.32, 'rgba(255,238,214,0.14)'); grad.addColorStop(1, 'rgba(255,238,214,0)');
  sc.fillStyle = grad; sc.fillRect(0, 0, SZ, SZ);
  const motes = Array.from({ length: small() ? 26 : 70 }, () => {
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
  let odd = false;
  const half = small();
  const frame = (t) => {
    raf = requestAnimationFrame(frame);
    if (half && (odd = !odd)) return; // en celular, la mitad de los cuadros basta para el polvo
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
      const s = m.r * 6.4;
      ctx.globalAlpha = a;
      ctx.drawImage(sprite, m.x * w - s / 2, m.y * h - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    pvx *= 0.9; pvy *= 0.9;
  };
  size();
  addEventListener('resize', size);
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !run) { run = true; raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && run) { run = false; cancelAnimationFrame(raf); }
  }).observe(open);
}

// ---------- vitrina de marcas ----------
// Trece ventanas en un anillo 3D. El scroll lo hace girar: cada marca se detiene un momento al frente, con su
// sitio funcionando, su logo y los botones para visitarlo. El índice de logos salta a cualquiera.
function ring() {
  const sec = $('[data-ring]');
  if (!sec) return null;
  const data = JSON.parse($('[data-ring-data]', sec).textContent);
  const wheel = $('[data-wheel]', sec), wins = $$('[data-rw]', sec), dots = $$('[data-ri]', sec), run = $('[data-ring-run]');
  const now = $('[data-ring-now]', sec), logo = $('.ring__logo', now), num = $('[data-ring-n]', sec);
  const label = $('[data-ring-label]', now), kind = $('[data-ring-kind]', now), visit = $('[data-ring-visit]', now), of = $('[data-ring-of]', now);
  const more = $('[data-ring-more]', now), moreL = $('[data-ring-more-l]', now);
  const N = wins.length, STEP = 360 / N, HOLD = 0.32;
  const phone = matchMedia('(max-width: 767px)');
  const clamp = gsap.utils.clamp(0, 1);

  // Las capturas de cada sitio se piden al acercarse a la vitrina
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    wins.forEach((w) => { $$('source', w).forEach((src) => (src.srcset = src.dataset.srcset)); const im = $('img', w); im.src = im.dataset.src; });
  }, { rootMargin: '900px' }).observe(sec);

  // Un solo video: el del sitio que queda al frente, cuando se detiene
  const video = document.createElement('video');
  Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'none' });
  video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
  let videoFor = -1, settle = 0;
  const playFront = (k) => {
    clearTimeout(settle);
    video.classList.remove('is-on');
    settle = setTimeout(() => {
      const base = phone.matches ? data[k].video.m : data[k].video.d;
      if (videoFor !== k || video.dataset.base !== base) {
        videoFor = k; video.dataset.base = base; video.poster = base + '.jpg';
        video.innerHTML = '<source src="' + base + '.webm" type="video/webm"><source src="' + base + '.mp4" type="video/mp4">';
        $('.rw__screen', wins[k]).append(video);
        video.load();
      }
      video.play().then(() => video.classList.add('is-on')).catch(() => {});
    }, 420);
  };

  // La marca al frente: logo, rubro, lugar y enlaces
  let front = -1;
  const setFront = (k) => {
    if (k === front) return;
    const first = front < 0;
    front = k;
    const b = data[k];
    dots.forEach((d, j) => (j === k ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    num.textContent = String(k + 1).padStart(2, '0');
    const fill = () => {
      logo.src = '/img/marcas/' + b.slug + '.webp'; logo.alt = b.name;
      const im = $('img', dots[k]), w = +im.getAttribute('width'), h = +im.getAttribute('height'), ratio = w / h, area = phone.matches ? 5200 : 9400;
      logo.width = w; logo.height = h;
      logo.style.setProperty('--lh', Math.min(phone.matches ? 46 : 58, Math.sqrt(area / ratio)).toFixed(1) + 'px');
      label.textContent = b.label; kind.textContent = b.kind + ' · ' + b.town;
      visit.href = b.visit; of.textContent = ' de ' + b.name + ' (se abre en otra pestaña)';
      more.href = b.more; moreL.textContent = b.moreLabel;
    };
    if (first || reduced) fill();
    else { now.classList.add('is-swap'); setTimeout(() => { fill(); now.classList.remove('is-swap'); }, 220); }
    ambience(SOUND[b.slug]);
    // Si los logos no caben, el índice se desliza para dejar el activo al centro (sin mover el resto de la página)
    const bar = dots[k].closest('.ring__index'), li = dots[k].parentElement;
    if (bar.scrollWidth > bar.clientWidth + 2) bar.scrollTo({ left: li.offsetLeft - (bar.clientWidth - li.offsetWidth) / 2, behavior: first ? 'auto' : 'smooth' });
    playFront(k);
  };

  // Giro: posición continua (0 = primera marca al frente)
  let target = 0, pos = 0, dirty = true;
  // Radio del anillo en píxeles (el mismo cálculo que el CSS), para girar con un transform directo
  let radius = 0;
  const measure = () => { radius = wins[0].offsetWidth * (phone.matches ? 2.5 : 2.42); };
  measure();
  addEventListener('resize', () => { measure(); paint(); });
  const shade = new Array(N).fill(-1);
  function paint() {
    wheel.style.transform = 'translateZ(' + (-radius).toFixed(1) + 'px) rotateY(' + (-pos * STEP).toFixed(2) + 'deg)';
    for (let i = 0; i < N; i++) {
      let d = ((i - pos) * STEP) % 360;
      if (d > 180) d -= 360; else if (d < -180) d += 360;
      const a = Math.abs(d), o = a > 110 ? 0 : Math.round((1 - Math.min(0.82, a / 75)) * 50) / 50;
      if (o !== shade[i]) { wins[i].style.opacity = o; wins[i].style.visibility = o ? '' : 'hidden'; shade[i] = o; }
    }
    const k = Math.round(pos);
    if (Math.abs(pos - k) < 0.18) setFront(((k % N) + N) % N);
    else { clearTimeout(settle); video.classList.remove('is-on'); }
  }
  if (reduced) { paint(); setFront(0); }
  else {
    const smooth = (x) => x * x * (3 - 2 * x);
    ScrollTrigger.create({
      trigger: run, start: 'top top', end: 'bottom bottom',
      onUpdate: (st) => {
        const u = st.progress * (N - 1), i = Math.min(N - 1, Math.floor(u));
        target = i + smooth(clamp((u - i - HOLD) / (1 - HOLD)));
        dirty = true;
      },
    });
    ScrollTrigger.create({ trigger: run, start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: html, className: 'in-reel' } });
    gsap.ticker.add(() => {
      const k = 1 - 0.84 ** gsap.ticker.deltaRatio(60);
      if (!dirty && Math.abs(target - pos) < 0.0005) return;
      pos += (target - pos) * k;
      if (Math.abs(target - pos) < 0.0005) { pos = target; dirty = false; }
      paint();
    });
  }
  // Índice de logos: salta a cualquier marca
  const at = (k) => { const top = run.getBoundingClientRect().top + scrollY; return top + (run.offsetHeight - innerHeight) * (k / (N - 1)); };
  dots.forEach((d, k) => d.addEventListener('click', () => {
    track('vitrina_salto', { marca: data[k].slug });
    if (reduced) { pos = k; paint(); return; }
    const lenis = getLenis();
    lenis ? lenis.scrollTo(at(k), { duration: 1.2 }) : scrollTo({ top: at(k), behavior: 'smooth' });
  }));
  visit.addEventListener('click', () => track('vitrina_visitar', { marca: data[front].slug }));
  return { N, at, name: (k) => data[k].name };
}

// ---------- Ver la función ----------
// La portada se recorre sola: cada obra, su sitio funcionando y el corte. Cualquier gesto del visitante la detiene.
function autoplay(vitrina) {
  const btn = $('[data-play]');
  const lenis = getLenis();
  if (!btn) return;
  if (reduced || !lenis) { btn.remove(); return; }
  $('[data-play-t]', btn).textContent = '1 min';
  const pill = document.createElement('button');
  pill.type = 'button'; pill.className = 'play-pill';
  pill.innerHTML = '<span class="rec" aria-hidden="true"></span><span data-play-n>Reproduciendo</span><b>Detener</b>';
  document.body.append(pill);
  const label = $('[data-play-n]', pill);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  let playing = false, timer = 0;
  const wait = (ms) => new Promise((r) => { timer = setTimeout(r, ms); });
  const go = (y, d) => new Promise((r) => lenis.scrollTo(y, { duration: d, easing: ease, force: true, onComplete: r }));
  const stop = () => {
    if (!playing) return;
    playing = false; clearTimeout(timer);
    lenis.stop(); lenis.start();
    html.classList.remove('is-playing');
  };
  const run = async () => {
    playing = true; html.classList.add('is-playing');
    track('reel_autoplay', { action: 'start' });
    const top = (el) => el.getBoundingClientRect().top + scrollY;
    const tunnelRun = $('[data-open-run]');
    label.textContent = 'Reproduciendo · el túnel';
    if (tunnelRun) { await go(top(tunnelRun) + tunnelRun.offsetHeight - innerHeight, 7); if (!playing) return; }
    for (let k = 0; vitrina && k < vitrina.N && playing; k++) {
      label.textContent = `Reproduciendo · ${String(k + 1).padStart(2, '0')} / ${vitrina.N}`;
      await go(vitrina.at(k), k ? 1.4 : 1.8); if (!playing) break;
      await wait(2600);
    }
    if (playing) { await go($('.inter'), 2); track('reel_autoplay', { action: 'end' }); stop(); }
  };
  btn.addEventListener('click', () => (playing ? stop() : run()));
  pill.addEventListener('click', () => { track('reel_autoplay', { action: 'stop' }); stop(); });
  // El visitante retoma el control con la rueda, el dedo o el teclado
  addEventListener('wheel', stop, { passive: true });
  addEventListener('touchstart', (e) => { if (!e.target.closest('.play, .play-pill')) stop(); }, { passive: true });
  addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End', 'Escape'].includes(e.key)) stop(); });
}

// ---------- obras en el aire y cierre ----------
function rest() {
  reveal();
  // Video de cada proyecto real solo cuando se ve
  $$('video[data-src]').forEach((v) => {
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      if (v.dataset.poster) v.poster = v.dataset.poster;
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
  fitOpen();
  opening(tl, tunnel());
  // Lo que está más abajo (vitrina, apariciones, Ver la función) se prepara cuando el navegador queda libre,
  // para no competir con la entrada; el polvo empieza un momento después
  const later = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
  later(() => {
    const vitrina = ring();
    rest();
    autoplay(vitrina);
    ScrollTrigger.refresh();
  }, { timeout: 1500 });
  setTimeout(dust, 900);
};
// La apertura espera solo la tipografía del titular (para cortar bien sus líneas); cada vez que terminan de
// llegar otras tipografías, se recalculan las posiciones del scroll
const fonts = document.fonts;
const titleFonts = fonts ? Promise.all(['300 1em Display', 'italic 300 1em Display'].map((f) => fonts.load(f))).catch(() => {}) : Promise.resolve();
Promise.race([titleFonts, new Promise((ok) => setTimeout(ok, 2500))]).then(start);
// (agrupado: varias tipografías que llegan juntas provocan un solo recálculo)
let refreshT = 0;
fonts?.addEventListener('loadingdone', () => { clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 400); });

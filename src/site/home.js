// Portada: las obras salen del proyector en un túnel 3D junto al titular y, más abajo, giran en una vitrina
// limpia, marca por marca, con su sitio funcionando y el botón para visitarlo.
import { boot, reveal, getLenis, $, $$, gsap, ScrollTrigger, reduced, fine, small, track } from './core.js';
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
  // El titular aparece entero: un fundido con una leve subida (sin dividirlo en líneas ni pasarle luces encima)
  tl.fromTo(title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', clearProps: 'opacity' }, tl.getChildren().length ? '-=0.55' : 0.1)
    .add(() => tn?.boot(), '<0.5')
    .from('[data-open-fade]', { y: 26, opacity: 0, duration: 1.2, stagger: 0.08 }, '-=0.9');
}

// ---------- túnel de obras ----------
// Las obras salen del fondo del proyector y vuelan hacia quien mira mientras la portada queda fija. Al llegar,
// las primeras se asoman a lo lejos; el scroll hace el resto. El titular cambia su palabra por la de la obra que
// pasa («Proyectamos termas.»): la palabra se apaga y se enciende entera, sin cambiar el grosor de la letra.
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
  let scroll = 0, shown = 0, px = 0, py = 0, tx = 0, ty = 0;
  const clamp = gsap.utils.clamp(0, 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  // Cada obra aparece lejos, se sostiene y se apaga al pasar junto a la cámara. Mientras está lejos se ve más
  // tenue (niebla): va dentro de su opacidad, que la tarjeta gráfica cambia sin repintar la foto
  const fade = (t) => (t < 0.3 ? t / 0.3 : t > 0.82 ? Math.max(0, 1 - (t - 0.82) / 0.16) : 1);
  const fog = (t) => { const k = clamp(t / 0.5); return 0.7 * (1 - k * k * (3 - 2 * k)); };
  // (la opacidad del titular parte en 1, como en el CSS: así no se pisa con su aparición)
  const seen = { scale: -1, op: 1, out: -1, rs: -1 };

  // El tramo lo da el contenedor alto de la portada (CSS sticky), sin pin de GSAP
  ScrollTrigger.create({
    trigger: $('[data-open-run]') || open, start: 'top top', end: 'bottom bottom',
    onUpdate: (st) => { scroll = st.progress; dirty = true; },
  });
  // Con mouse, las obras se desplazan apenas según el puntero (el titular no se mueve)
  if (fine && !small()) addEventListener('pointermove', (e) => { tx = (e.clientX / W - 0.5) * 2; ty = (e.clientY / H - 0.5) * 2; dirty = true; }, { passive: true });

  // La palabra del titular cambia por la de la obra que pasa: se apaga entera, cambia y se enciende entera, a un
  // ritmo que se alcanza a leer. Si el scroll va rápido se saltan las intermedias y queda la última
  let current = word.textContent, want = current, last = -1e9, fadeTw = null;
  const HOLD = 1.1;
  const swap = () => {
    if (want === current || gsap.ticker.time - last < HOLD) return;
    last = gsap.ticker.time; current = want;
    const next = want;
    fadeTw?.kill();
    fadeTw = gsap.to(word, { opacity: 0, duration: 0.22, ease: 'power1.in', onComplete: () => {
      word.textContent = next;
      fadeTw = gsap.to(word, { opacity: 1, duration: 0.4, ease: 'power1.out' });
    } });
  };

  gsap.set(title, { x: 0, y: 0, xPercent: -50, yPercent: -50 });
  const render = () => {
    // Suavizado por tiempo, no por cuadro: igual en una pantalla de 60 o de 120 Hz
    const r = gsap.ticker.deltaRatio(60), ks = 1 - 0.8 ** r, kp = 1 - 0.94 ** r;
    shown += (scroll - shown) * ks;
    px += (tx - px) * kp; py += (ty - py) * kp;
    const settling = Math.abs(scroll - shown) > 0.0004 || Math.abs(tx - px) > 0.002 || Math.abs(ty - py) > 0.002;
    swap();
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
    // Titular: se acerca con el viaje y se apaga al final
    const scale = Math.round((P < 0.5 ? lerp(0.94, 1, P / 0.5) : lerp(1, 1.32, (P - 0.5) / 0.5)) * 500) / 500;
    const op = Math.round((1 - clamp((P - 0.86) / 0.12)) * 100) / 100;
    if (scale !== seen.scale) { gsap.set(title, { scale }); seen.scale = scale; }
    if (op !== seen.op) { gsap.set(title, { opacity: op }); seen.op = op; }
    want = lead >= 0 && P < 0.9 ? items[lead].word : 'lugares.';
    const out = Math.round((1 - clamp((P - BOOT - 0.01) / 0.07)) * 50) / 50;
    if (out !== seen.out) { seen.out = out; fades.forEach((f) => (f.style.opacity = out)); }
    const rs = Math.round((1 + P * 0.9) * 200) / 200;
    if (rings && rs !== seen.rs) { seen.rs = rs; rings.style.transform = 'scale(' + rs + ')'; }
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
// Trece ventanas en un anillo 3D que avanza solo, marca por marca, con su sitio funcionando, su logo y los botones
// para visitarlo. Se toma el control deslizando de lado (dedo, mouse o trackpad), con las flechas, el teclado o el
// índice de logos; el scroll vertical no lo mueve: la página sigue bajando directo.
function ring() {
  const sec = $('[data-ring]');
  if (!sec) return null;
  const data = JSON.parse($('[data-ring-data]', sec).textContent);
  const view = $('.ring__view', sec), stage = $('.ring__stage', sec), wheel = $('[data-wheel]', sec), wins = $$('[data-rw]', sec), dots = $$('[data-ri]', sec);
  const now = $('[data-ring-now]', sec), logo = $('.ring__logo', now), num = $('[data-ring-n]', sec);
  const label = $('[data-ring-label]', now), kind = $('[data-ring-kind]', now), visit = $('[data-ring-visit]', now), of = $('[data-ring-of]', now);
  const more = $('[data-ring-more]', now), moreL = $('[data-ring-more-l]', now);
  const pauseBtn = $('[data-ring-pause]', sec), pauseL = $('[data-ring-pause-l]', sec), timer = $('[data-ring-timer]', sec);
  const N = wins.length, STEP = 360 / N, AUTO = 4.2, AFTER = 7;
  const phone = matchMedia('(max-width: 767px)');
  const norm = (k) => ((k % N) + N) % N;

  // Las capturas de cada sitio se piden al acercarse a la vitrina
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    wins.forEach((w) => { $$('source', w).forEach((src) => (src.srcset = src.dataset.srcset)); const im = $('img', w); im.src = im.dataset.src; });
  }, { rootMargin: '900px' }).observe(sec);

  // Un solo video: el del sitio que queda al frente, cuando se detiene. En celular, mientras la vitrina avanza
  // sola, basta la captura (no se descarga un video por marca); el video aparece cuando el visitante elige una
  let how = 'auto';
  const video = document.createElement('video');
  Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'none' });
  video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
  let videoFor = -1, settle = 0;
  const playFront = (k) => {
    clearTimeout(settle);
    video.classList.remove('is-on');
    if (slow || (phone.matches && how === 'auto')) return;
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

  // Giro: posición continua (0 = primera marca al frente; sigue contando al dar la vuelta)
  let target = 0, pos = 0, soft = 0.84;
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
    if (Math.abs(pos - k) < 0.18) setFront(norm(k));
    else { clearTimeout(settle); video.classList.remove('is-on'); }
  }
  // Al avanzar solo, el giro es más pausado que cuando lo pide el visitante
  const move = (t, by) => {
    target = t; how = by; soft = by === 'auto' ? 0.9 : 0.84;
    if (reduced) { pos = target; paint(); }
    if (by === 'user') rest(AFTER);
  };
  const step = (d, by = 'user') => move(Math.round(target) + d, by);
  // A una marca por el camino más corto
  const go = (k, by = 'user') => { const c = Math.round(target), d = norm(k - norm(c)); move(c + (d > N / 2 ? d - N : d), by); };
  paint();

  // Arrastre de lado (dedo o mouse). El navegador se queda con el gesto vertical (touch-action: pan-y)
  const drag = { id: -1, on: false, x0: 0, p0: 0, lx: 0, lt: 0, vx: 0 };
  const unit = () => wins[0].offsetWidth * (phone.matches ? 1.6 : 0.9);
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || drag.id !== -1) return;
    if (e.pointerType === 'mouse') e.preventDefault();
    Object.assign(drag, { id: e.pointerId, on: false, x0: e.clientX, p0: pos, lx: e.clientX, lt: e.timeStamp, vx: 0 });
  });
  addEventListener('pointermove', (e) => {
    if (e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0;
    if (!drag.on) {
      if (Math.abs(dx) < 8) return;
      drag.on = true; drag.x0 = e.clientX; drag.p0 = pos;
      sec.classList.add('is-drag'); hold();
      try { stage.setPointerCapture(e.pointerId); } catch { /* el puntero ya se soltó */ }
      return;
    }
    const dt = Math.max(1, e.timeStamp - drag.lt);
    drag.vx = drag.vx * 0.5 + ((e.clientX - drag.lx) / dt) * 0.5; drag.lx = e.clientX; drag.lt = e.timeStamp;
    pos = target = drag.p0 - dx / unit();
    paint();
  }, { passive: true });
  const release = (e) => {
    if (e.pointerId !== drag.id) return;
    drag.id = -1;
    if (drag.on) {
      drag.on = false; sec.classList.remove('is-drag');
      // Al soltar, sigue un poco con el impulso del gesto y se acomoda en la marca más cercana; un gesto corto
      // igual pasa a la siguiente en su dirección
      const moved = pos - drag.p0, fling = Math.max(-0.6, Math.min(0.6, (-drag.vx * 200) / unit()));
      let t = Math.round(pos + fling);
      if (t === Math.round(drag.p0) && Math.abs(moved) > 0.12) t += Math.sign(moved);
      move(t, 'user');
      hold();
      track('vitrina_deslizar', {});
      return;
    }
    if (e.type !== 'pointerup') return;
    // Toque sin arrastre: una ventana de costado pasa al frente; la del frente abre su sitio
    const w = e.target.closest?.('.rw'), i = w ? wins.indexOf(w) : -1;
    if (i < 0) return;
    if (i === front && Math.abs(pos - Math.round(pos)) < 0.05) { track('vitrina_visitar', { marca: data[i].slug, desde: 'ventana' }); window.open(data[i].visit, '_blank', 'noopener'); }
    else go(i);
  };
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);

  // Trackpad o rueda de lado: una marca por gesto. La rueda vertical sigue bajando la página
  let wAcc = 0, wAt = -1e9;
  sec.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) < 2 || Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;
    e.preventDefault(); e.stopPropagation();
    if (e.timeStamp - wAt < 480) return;
    wAcc += e.deltaX;
    if (Math.abs(wAcc) > 60) { step(Math.sign(wAcc)); wAcc = 0; wAt = e.timeStamp; }
  }, { passive: false });

  // Flechas, teclado e índice de logos
  $('[data-ring-prev]', sec).addEventListener('click', () => step(-1));
  $('[data-ring-next]', sec).addEventListener('click', () => step(1));
  sec.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    step(e.key === 'ArrowRight' ? 1 : -1);
  });
  dots.forEach((d, k) => d.addEventListener('click', () => { track('vitrina_salto', { marca: data[k].slug }); go(k); }));
  visit.addEventListener('click', () => track('vitrina_visitar', { marca: data[front].slug }));

  // Avance automático: lo marca la barra de tiempo (al llenarse, pasa a la siguiente). Se sostiene con la pausa,
  // el puntero encima, el foco del teclado, el arrastre o fuera de la pantalla; tras un gesto, espera un poco más
  let paused = false, inView = false, hover = false, focus = false;
  const hold = () => sec.classList.toggle('is-held', paused || !inView || hover || focus || drag.on || document.hidden);
  const rest = (secs = AUTO) => {
    if (reduced) return;
    sec.style.setProperty('--auto', secs + 's');
    sec.classList.remove('is-auto');
    void timer.offsetWidth;
    sec.classList.add('is-auto');
  };
  if (!reduced) {
    timer.addEventListener('animationend', () => { step(1, 'auto'); rest(); });
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.setAttribute('aria-pressed', String(paused));
      pauseL.textContent = paused ? 'Reanudar la vitrina' : 'Pausar la vitrina';
      if (!paused) rest();
      hold();
    });
    new IntersectionObserver(([e]) => {
      const was = inView;
      inView = e.intersectionRatio >= 0.45;
      if (inView && !was) rest();
      hold();
    }, { threshold: [0, 0.45, 1] }).observe(sec);
    for (const el of [view, now]) {
      el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hover = true; hold(); } });
      el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hover = false; hold(); } });
    }
    sec.addEventListener('focusin', (e) => { focus = e.target.matches(':focus-visible'); hold(); });
    sec.addEventListener('focusout', (e) => { if (!sec.contains(e.relatedTarget)) { focus = false; hold(); } });
    document.addEventListener('visibilitychange', hold);
    hold();
    gsap.ticker.add(() => {
      if (drag.on || pos === target) return;
      pos += (target - pos) * (1 - soft ** gsap.ticker.deltaRatio(60));
      if (Math.abs(target - pos) < 0.0005) pos = target;
      paint();
    });
  }
  // Mientras se ve la vitrina, el botón flotante se aparta
  ScrollTrigger.create({ trigger: sec, start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: html, className: 'in-reel' } });
  return { N, sec, go: (k) => go(k, 'show'), name: (k) => data[k].name };
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
    // La vitrina gira marca por marca con la página quieta
    if (vitrina) { await go(top(vitrina.sec), 1.8); if (!playing) return; }
    for (let k = 0; vitrina && k < vitrina.N && playing; k++) {
      label.textContent = `Reproduciendo · ${String(k + 1).padStart(2, '0')} / ${vitrina.N}`;
      vitrina.go(k);
      await wait(k ? 2900 : 1800);
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

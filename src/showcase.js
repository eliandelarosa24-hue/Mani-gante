// Portada y galería de muestras: showreel, escenario de la muestra activa y transición al entrar a una muestra.
import { $, $$, reduced, fine, gsap, track } from './shared.js';
import { CASES } from './samples/cases.js';

const cardsData = () => $$('[data-showcase-list] .sample').map((a) => ({
  el: a, slug: a.dataset.slug, name: a.dataset.name, rubro: a.dataset.rubro, place: a.dataset.place,
  cover: a.dataset.cover, href: a.getAttribute('href'), hl: JSON.parse(a.dataset.hl || '[]'),
}));

// Videos: cuando exista /video/<nombre>.mp4 se reproduce sobre la portada; si no existe, queda la imagen.
export function attachVideo(video, name) {
  if (!video || reduced) return;
  // MP4 (H.264) para Safari y la mayoría; WebM (VP9) para navegadores sin H.264
  const h264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
  const src = `/video/${name}.${h264 ? 'mp4' : 'webm'}`;
  if (video.dataset.src === src) return;
  video.dataset.src = src;
  video.classList.remove('is-on');
  fetch(src, { method: 'HEAD' }).then((r) => {
    if (!r.ok || !(r.headers.get('content-type') || '').startsWith('video')) return;
    video.preload = 'auto';
    video.addEventListener('playing', () => video.classList.add('is-on'), { once: true });
    video.src = src;
    video.play().catch(() => {});
  }).catch(() => {});
}

// ---------- Showreel de la portada: las portadas de las muestras se suceden ----------
export function initReel() {
  const reel = $('[data-reel]'); if (!reel) return;
  const items = cardsData();
  const slides = $('[data-reel-slides]', reel), ticks = $('[data-reel-ticks]', reel), cap = $('.reel__cap', reel);
  slides.innerHTML = items.map((d) => `<span style="background-image:url('${d.cover}')"></span>`).join('');
  ticks.innerHTML = items.map(() => '<i></i>').join('');
  const S = $$('span', slides), T = $$('i', ticks);
  let D = 3400, i = 0, timer = 0, vis = true, onVideo = false;
  const show = (k) => {
    i = (k + items.length) % items.length;
    S.forEach((s, j) => s.classList.toggle('is-on', j === i));
    T.forEach((t, j) => { t.classList.remove('run'); t.classList.toggle('done', j < i); });
    void ticks.offsetWidth; T[i].style.setProperty('--d', `${D}ms`); T[i].classList.add('run');
    $('[data-reel-name]', reel).textContent = items[i].name;
    $('[data-reel-rubro]', reel).textContent = items[i].rubro;
    cap.classList.remove('is-swap'); void cap.offsetWidth; cap.classList.add('is-swap');
  };
  const loop = () => { clearTimeout(timer); if (!vis || reduced || onVideo) return; timer = setTimeout(() => { show(i + 1); loop(); }, D); };
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; loop(); }).observe(reel);
  show(0); loop();
  // Con el video del showreel (2,6 s por muestra, en el mismo orden), el rótulo sigue al video
  const v = $('[data-video="reel"]', reel);
  v?.addEventListener('playing', () => { onVideo = true; D = 2600; clearTimeout(timer); });
  v?.addEventListener('timeupdate', () => { const k = Math.floor(v.currentTime / 2.6) % items.length; if (k !== i) show(k); });
  attachVideo(v, 'reel');
}

// ---------- Galería: la muestra activa se ve en grande en el escenario ----------
export function initShowcase() {
  const stage = $('[data-stage]'); if (!stage) return;
  const items = cardsData();
  const img = $('[data-stage-img]', stage), link = $('[data-stage-link]', stage), go = $('[data-stage-go]', stage);
  let cur = -1;
  // Precarga de portadas para que el cambio sea instantáneo
  items.forEach((d) => { const im = new Image(); im.src = d.cover; });
  const set = (k) => {
    if (k === cur) return; cur = k;
    const d = items[k], visible = items.filter((x) => !x.el.hidden);
    items.forEach((x, j) => x.el.classList.toggle('is-active', j === k));
    const layer = document.createElement('span');
    layer.className = 'stage__layer'; layer.style.backgroundImage = `url('${d.cover}')`;
    img.append(layer);
    setTimeout(() => { while (img.children.length > 1) img.firstElementChild.remove(); }, 1100);
    $('[data-stage-n]', stage).textContent = String(visible.indexOf(d) + 1).padStart(2, '0');
    $('[data-stage-rubro]', stage).textContent = d.rubro;
    $('[data-stage-url]', stage).textContent = `redvaeru.cl/muestras/${d.slug}`;
    const nm = $('[data-stage-name]', stage), pl = $('[data-stage-place]', stage);
    nm.textContent = d.name; pl.textContent = d.place;
    [nm, pl].forEach((x) => { x.classList.remove('is-swap'); void x.offsetWidth; x.classList.add('is-swap'); });
    $('[data-stage-hl]', stage).innerHTML = d.hl.map((h) => `<li>${h}</li>`).join('');
    link.href = go.href = d.href;
    attachVideo($('[data-stage-video]', stage), `muestra-${d.slug}`);
  };
  items.forEach((d, k) => {
    d.el.addEventListener('pointerenter', () => fine && set(k));
    d.el.addEventListener('focus', () => set(k));
  });
  // Al filtrar, el escenario muestra la primera muestra visible y el contador se ajusta
  $$('.sfilters button').forEach((b) => b.addEventListener('click', () => setTimeout(() => {
    const first = items.findIndex((x) => !x.el.hidden); cur = -1; if (first >= 0) set(first);
    $('[data-stage-n]', stage).parentElement.innerHTML = `<span data-stage-n>01</span> / ${String(items.filter((x) => !x.el.hidden).length).padStart(2, '0')} · <span data-stage-rubro>${items[Math.max(0, first)].rubro}</span>`;
  }, 0)));
  set(0);
}

// ---------- Transición: la portada de la muestra crece hasta llenar la pantalla y luego se entra ----------
export function initWarp() {
  if (reduced) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="/muestras/"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank') return;
    const href = a.getAttribute('href'); if (href === '/muestras/') return;
    const slug = href.split('/')[2];
    const card = $(`[data-showcase-list] .sample[data-slug="${slug}"]`) || $(`.sample[data-slug="${slug}"]`);
    const src = a.closest('[data-stage]') ? $('[data-stage] .stage__media') : (a.querySelector('.ph') || a);
    if (!card || !src) return;
    e.preventDefault();
    const r = src.getBoundingClientRect();
    const w = document.createElement('div');
    w.className = 'warp';
    w.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background-image:url('${card.dataset.cover}')`;
    w.innerHTML = `<p class="warp__k">${card.dataset.rubro} · ${card.dataset.place}</p><p class="warp__name">${card.dataset.name}</p>`;
    document.body.append(w);
    track('sample_open', { sample: slug });
    gsap.timeline({ onComplete: () => { location.href = href; } })
      .to(w, { left: 0, top: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: 0.9, ease: 'expo.inOut' })
      .to($$('.warp__k, .warp__name', w), { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, '-=0.35')
      .to({}, { duration: 0.25 });
  });
  // Al volver con el botón "atrás", la página puede venir de la caché: se quita la cortina
  addEventListener('pageshow', (e) => { if (e.persisted) $$('.warp').forEach((w) => w.remove()); });
}

// ---------- Caso de estudio: reto, idea, lo construido e identidad visual de cada muestra ----------
export function initCases() {
  const items = cardsData().filter((d) => CASES[d.slug]);
  if (!items.length) return;
  const ov = document.createElement('div');
  ov.className = 'case-ov'; ov.setAttribute('data-lenis-prevent', ''); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-hidden', 'true'); ov.setAttribute('aria-label', 'Caso de estudio');
  ov.innerHTML = `<div class="case-ov__in" tabindex="-1">
    <header class="case-ov__top"><p data-c-k></p><div><button type="button" class="case-ov__nav" data-c-prev aria-label="Caso anterior">←</button><button type="button" class="case-ov__nav" data-c-next aria-label="Caso siguiente">→</button><button type="button" class="case-ov__x" data-c-close aria-label="Cerrar">✕</button></div></header>
    <div class="case-ov__grid">
      <div class="case-ov__media"><span class="stage__bar" aria-hidden="true"><i></i><i></i><i></i><em data-c-url></em></span><span class="case-ov__screen"><span class="case-ov__img" data-c-img></span><video data-c-video muted loop playsinline preload="none" aria-hidden="true"></video></span></div>
      <div class="case-ov__body" data-c-body></div>
    </div>
  </div>`;
  document.body.append(ov);
  const inner = $('.case-ov__in', ov), body = $('[data-c-body]', ov), video = $('[data-c-video]', ov);
  const fontsLoaded = new Set();
  const loadFonts = (fams) => fams.forEach((f) => {
    if (fontsLoaded.has(f)) return; fontsLoaded.add(f);
    const l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}&display=swap&text=${encodeURIComponent('AaBbCcÉéÑñ0123456789 ' + f)}`;
    document.head.append(l);
  });
  let cur = 0, last = null, openT = 0;
  function paint(k, dir = 0) {
    cur = (k + items.length) % items.length;
    const d = items[cur], c = CASES[d.slug];
    loadFonts(c.fonts);
    $('[data-c-k]', ov).textContent = `Caso ${String(cur + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} · ${d.rubro}`;
    $('[data-c-url]', ov).textContent = `redvaeru.cl/muestras/${d.slug}`;
    $('[data-c-img]', ov).style.backgroundImage = `url('${d.cover}')`;
    attachVideo(video, `muestra-${d.slug}`);
    body.innerHTML = `
      <p class="case-ov__concept">${c.concept}</p>
      <h2 class="case-ov__name">${d.name}</h2>
      <p class="case-ov__place">${d.place}</p>
      <div class="case-ov__cols">
        <section><h3>El reto</h3><p>${c.reto}</p></section>
        <section><h3>La idea</h3><p>${c.idea}</p></section>
      </div>
      <section class="case-ov__built"><h3>Lo que construimos</h3><ul>${d.hl.map((h) => `<li>${h}</li>`).join('')}<li>Diseño a medida, versión celular y pantalla de carga propia</li></ul></section>
      <section class="case-ov__id"><h3>Identidad</h3>
        <div class="case-ov__pal">${c.palette.map(([n, hex]) => `<span><i style="background:${hex}"></i><b>${n}</b><small>${hex}</small></span>`).join('')}</div>
        <div class="case-ov__type">${c.fonts.map((f, i) => `<span><em style="font-family:'${f}', serif">${i === 0 ? 'Aa' : 'Aa'}</em><b>${f}</b><small>${['Títulos', 'Texto', 'Detalle'][i] || 'Detalle'}</small></span>`).join('')}</div>
      </section>
      <div class="case-ov__cta"><a class="btn btn--gold" href="${d.href}">Entrar a la muestra <span aria-hidden="true">→</span></a><button type="button" class="btn btn--ghost" data-c-want>Quiero algo así para mi negocio</button></div>`;
    body.classList.remove('is-in'); void body.offsetWidth; body.classList.add('is-in');
    body.style.setProperty('--dir', dir);
    body.scrollTop = 0;
    $('[data-c-want]', body).addEventListener('click', () => {
      close();
      const b = document.querySelector('[data-open-agent]'); if (!b) return;
      b.dataset.ask = `Vi el caso de ${d.name} y quiero un sitio así para mi negocio. ¿Qué me recomienda?`;
      b.click(); delete b.dataset.ask;
    });
    track('case_view', { sample: d.slug });
  }
  function open(k) {
    last = document.activeElement; paint(k);
    ov.classList.add('is-open'); ov.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('case-lock');
    clearTimeout(openT); openT = setTimeout(() => inner.focus({ preventScroll: true }), 60);
  }
  function close() {
    ov.classList.remove('is-open'); ov.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('case-lock');
    video.pause(); last?.focus?.({ preventScroll: true });
  }
  $('[data-c-close]', ov).addEventListener('click', close);
  $('[data-c-prev]', ov).addEventListener('click', () => paint(cur - 1, -1));
  $('[data-c-next]', ov).addEventListener('click', () => paint(cur + 1, 1));
  ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  addEventListener('keydown', (e) => {
    if (!ov.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') paint(cur + 1, 1);
    if (e.key === 'ArrowLeft') paint(cur - 1, -1);
  });
  // Abrir desde el escenario (la muestra activa) y desde la lista de casos en celular
  $('[data-case-open]')?.addEventListener('click', () => {
    const slug = $('[data-stage-link]')?.getAttribute('href').split('/')[2];
    open(Math.max(0, items.findIndex((d) => d.slug === slug)));
  });
  const ml = $('[data-cases-m-list]');
  if (ml) {
    ml.innerHTML = items.map((d, i) => `<button type="button" data-c-i="${i}">${d.name}</button>`).join('');
    ml.addEventListener('click', (e) => { const b = e.target.closest('[data-c-i]'); if (b) open(+b.dataset.cI); });
  }
}

// Portada y galería de muestras: showreel, escenario de la muestra activa y transición al entrar a una muestra.
import { $, $$, reduced, fine, gsap, track } from './shared.js';

const cardsData = () => $$('[data-showcase-list] .sample').map((a) => ({
  el: a, slug: a.dataset.slug, name: a.dataset.name, rubro: a.dataset.rubro, place: a.dataset.place,
  cover: a.dataset.cover, href: a.getAttribute('href'), hl: JSON.parse(a.dataset.hl || '[]'),
}));

// Videos: cuando exista /video/<nombre>.mp4 se reproduce sobre la portada; si no existe, queda la imagen.
export function attachVideo(video, name) {
  if (!video || reduced) return;
  const src = `/video/${name}.mp4`;
  if (video.dataset.src === src) return;
  video.dataset.src = src;
  video.classList.remove('is-on');
  fetch(src, { method: 'HEAD' }).then((r) => {
    if (!r.ok || !(r.headers.get('content-type') || '').startsWith('video')) return;
    video.src = src;
    video.addEventListener('canplay', () => { video.classList.add('is-on'); video.play().catch(() => {}); }, { once: true });
  }).catch(() => {});
}

// ---------- Showreel de la portada: las portadas de las muestras se suceden ----------
export function initReel() {
  const reel = $('[data-reel]'); if (!reel) return;
  const items = cardsData();
  const slides = $('[data-reel-slides]', reel), ticks = $('[data-reel-ticks]', reel), cap = $('.reel__cap', reel);
  slides.innerHTML = items.map((d) => `<span style="background-image:url('${d.cover}')"></span>`).join('');
  ticks.innerHTML = items.map(() => '<i></i>').join('');
  const S = $$('span', slides), T = $$('i', ticks), D = 3400;
  let i = 0, timer = 0, vis = true;
  const show = (k) => {
    i = (k + items.length) % items.length;
    S.forEach((s, j) => s.classList.toggle('is-on', j === i));
    T.forEach((t, j) => { t.classList.remove('run'); t.classList.toggle('done', j < i); });
    void ticks.offsetWidth; T[i].style.setProperty('--d', `${D}ms`); T[i].classList.add('run');
    $('[data-reel-name]', reel).textContent = items[i].name;
    $('[data-reel-rubro]', reel).textContent = items[i].rubro;
    cap.classList.remove('is-swap'); void cap.offsetWidth; cap.classList.add('is-swap');
  };
  const loop = () => { clearTimeout(timer); if (!vis || reduced) return; timer = setTimeout(() => { show(i + 1); loop(); }, D); };
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; loop(); }).observe(reel);
  show(0); loop();
  attachVideo($('[data-video="reel"]', reel), 'reel');
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

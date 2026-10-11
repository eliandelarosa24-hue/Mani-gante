// Sección "En vivo": muestra los sitios reales de los clientes dentro de la página,
// en escritorio y celular. Los iframes cargan solo cuando la sección se acerca a la pantalla.
import { $, $$, fine, track } from './shared.js';

export function initLive() {
  const root = $('.live');
  if (!root) return;
  if (!fine) root.classList.add('is-touch');
  const frames = $$('[data-live-frame]', root);
  let url = $('[data-live-tab][aria-selected="true"]', root).dataset.liveTab;
  let started = false;

  // Cada iframe se dibuja a su tamaño real (1280×800 o 390×844) y se escala al contenedor.
  const fit = (vp) => {
    const [w, h] = vp.dataset.liveVp.split('x').map(Number);
    const f = $('iframe', vp);
    f.width = w;
    f.height = h;
    f.style.width = w + 'px';
    f.style.height = h + 'px';
    f.style.transform = `scale(${vp.clientWidth / w})`;
  };
  const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
  $$('[data-live-vp]', root).forEach((vp) => { fit(vp); ro.observe(vp); });

  const load = () => {
    frames.forEach((f) => {
      if (f.offsetParent === null) return; // oculto (por ejemplo, escritorio en celular)
      if (f.getAttribute('src') !== url) f.src = url;
    });
  };
  new IntersectionObserver(([en], obs) => {
    if (!en.isIntersecting) return;
    started = true;
    load();
    obs.disconnect();
  }, { rootMargin: '400px' }).observe(root);

  const resetCovers = () => {
    $$('[data-live-cover]', root).forEach((c) => (c.hidden = false));
    frames.forEach((f) => { f.style.pointerEvents = 'none'; f.tabIndex = -1; });
  };
  resetCovers();

  $$('[data-live-cover]', root).forEach((c) => c.addEventListener('click', () => {
    const f = $('iframe', c.parentElement);
    c.hidden = true;
    f.style.pointerEvents = 'auto';
    f.tabIndex = 0;
    f.focus({ preventScroll: true });
    track('live_explore', { site: url });
  }));

  $$('[data-live-tab]', root).forEach((tab) => tab.addEventListener('click', () => {
    $$('[data-live-tab]', root).forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    url = tab.dataset.liveTab;
    $('[data-live-url]', root).textContent = new URL(url).host;
    $('[data-live-caption]', root).textContent = tab.dataset.liveName;
    $('[data-live-open]', root).href = url;
    resetCovers();
    if (started) load();
    track('live_tab', { site: url });
  }));
}

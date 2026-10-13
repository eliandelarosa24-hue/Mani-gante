// Proyectos reales en el aire: el sitio se recorre aquí mismo, en escritorio y celular.
// Mientras no se explora, se ve la portada del proyecto (y su video, cuando exista).
import { $, $$, fine, track } from './shared.js';
import { attachVideo } from './showcase.js';

const PROJECTS = {
  miah: {
    url: 'https://cabanasmiaynoah.netlify.app', name: 'Cabañas Miah y Noah', place: 'Curacautín · Araucanía', tag: 'Cabañas',
    poster: '/img/casos/miah',
    dl: [['Problema', 'Dependencia de plataformas y poca presencia propia.'], ['Solución', 'Sitio propio con check-in digital, guía de la zona y WhatsApp como canal de cierre.'], ['Resultado', 'Canal propio activo y huéspedes reservando directo.']],
  },
  poetas: {
    url: 'https://elrincondelospoetas.netlify.app', name: 'El Rincón de los Poetas', place: 'Almagro, Nueva Imperial · Araucanía', tag: 'Hostal',
    poster: '/img/casos/poetas',
    dl: [['Problema', 'Una historia invisible y reservas casi solo por plataformas.'], ['Solución', 'Narrativa literaria del hostal, reseñas y canal directo.'], ['Resultado', 'Una historia que vende sola y reserva directa.']],
  },
};

export function initReal() {
  const root = $('.real .live'); if (!root) return;
  if (!fine) root.classList.add('is-touch');
  const frames = $$('[data-live-frame]', root), caseEl = $('[data-real-case]');
  let key = 'miah', started = false;

  const fit = (vp) => {
    const [w, h] = vp.dataset.liveVp.split('x').map(Number), f = $('iframe', vp);
    f.width = w; f.height = h; f.style.width = w + 'px'; f.style.height = h + 'px';
    f.style.transform = `scale(${vp.clientWidth / w})`;
  };
  const ro = new ResizeObserver((es) => es.forEach((e) => fit(e.target)));
  $$('[data-live-vp]', root).forEach((vp) => { fit(vp); ro.observe(vp); });

  const load = () => frames.forEach((f) => { if (f.offsetParent !== null && f.getAttribute('src') !== PROJECTS[key].url) f.src = PROJECTS[key].url; });
  new IntersectionObserver(([en], obs) => { if (!en.isIntersecting) return; started = true; load(); obs.disconnect(); }, { rootMargin: '400px' }).observe(root);

  const covers = () => {
    $$('[data-live-cover]', root).forEach((c) => (c.hidden = false));
    frames.forEach((f) => { f.style.pointerEvents = 'none'; f.tabIndex = -1; });
  };
  function paint() {
    const p = PROJECTS[key];
    $$('[data-real-poster]', root).forEach((el) => (el.style.backgroundImage = `url('${p.poster}-${el.dataset.realPoster}.webp')`));
    $('[data-live-url]', root).textContent = new URL(p.url).host;
    caseEl.innerHTML = `<p class="real__meta"><span>${p.place}</span><span>${p.tag}</span></p><h3>${p.name}</h3><dl>${p.dl.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><a class="btn btn--line" href="${p.url}" target="_blank" rel="noopener">Abrir el sitio ↗</a>`;
    attachVideo($('[data-real-video]', root), `real-${key}`);
    caseEl.classList.remove('is-swap'); void caseEl.offsetWidth; caseEl.classList.add('is-swap');
    covers();
    if (started) load();
  }
  $$('[data-live-cover]', root).forEach((c) => c.addEventListener('click', () => {
    const f = $('iframe', c.parentElement);
    if (f.getAttribute('src') !== PROJECTS[key].url) f.src = PROJECTS[key].url;
    c.hidden = true; f.style.pointerEvents = 'auto'; f.tabIndex = 0; f.focus({ preventScroll: true });
    track('live_explore', { site: PROJECTS[key].url });
  }));
  $$('[data-real]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-real]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    key = b.dataset.real; paint(); track('live_tab', { site: PROJECTS[key].url });
  }));
  paint();
}

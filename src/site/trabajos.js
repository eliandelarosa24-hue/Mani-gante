// Trabajos: lista de obras con su sitio funcionando en una vista previa que sigue al cursor, filtro por rubro y sitios en el aire.
import './pages.css';
import './spec-fonts.css';
import { boot, reveal, $, $$, gsap, reduced, fine, track } from './core.js';

boot();
reveal();

// Filtro por rubro
const rows = $$('[data-wk]');
$$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
  $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  const g = b.dataset.filter;
  rows.forEach((r) => { r.hidden = g !== 'todo' && !r.dataset.groups.split('|').includes(g); });
  track('works_filter', { group: g });
}));

// Vista previa flotante (solo con mouse): el sitio de cada obra, funcionando
const float = $('.wk-float'), vid = $('video', float), url = $('em', float);
if (fine && !reduced && float) {
  gsap.set(float, { xPercent: -50, yPercent: -58 });
  let cur = '';
  const xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3' }), yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3' });
  const rTo = gsap.quickTo(float, 'rotate', { duration: 0.9, ease: 'power3' });
  let lastX = 0;
  addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4)); lastX = e.clientX; }, { passive: true });
  rows.forEach((r) => {
    const a = $('a', r);
    a.addEventListener('pointerenter', () => {
      if (cur !== a.dataset.site) {
        cur = a.dataset.site;
        vid.poster = `${cur}.jpg`;
        vid.innerHTML = `<source src="${cur}.webm" type="video/webm"><source src="${cur}.mp4" type="video/mp4">`;
        vid.load();
        url.textContent = a.dataset.url;
      }
      vid.play().catch(() => {});
      float.classList.add('is-on');
    });
    a.addEventListener('pointerleave', () => { float.classList.remove('is-on'); vid.pause(); });
  });
}

// Trabajos: lista de obras con vista previa que sigue al cursor, filtro por rubro y sitios en el aire.
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

// Vista previa flotante (solo con mouse)
const float = $('.wk-float'), img = $('img', float);
if (fine && !reduced && float) {
  const xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3' }), yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3' });
  const rTo = gsap.quickTo(float, 'rotate', { duration: 0.9, ease: 'power3' });
  let lastX = 0;
  addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4)); lastX = e.clientX; }, { passive: true });
  rows.forEach((r) => {
    const a = $('a', r);
    a.addEventListener('pointerenter', () => { img.src = a.dataset.img; float.style.setProperty('--accent', getComputedStyle(r).getPropertyValue('--accent')); float.classList.add('is-on'); });
    a.addEventListener('pointerleave', () => float.classList.remove('is-on'));
  });
}

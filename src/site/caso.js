// Caso de una obra: portada con el titular en su tipografía, la idea, el sitio en movimiento,
// identidad (paleta y tipografías), fotos y paso a la obra siguiente.
import './pages.css';
import './scene-fonts.css';
import './spec-fonts.css';
import { boot, reveal, splitChars, $, $$, gsap, reduced } from './core.js';

boot();
const start = () => {
  const t = $('.cs-hero__wt');
  if (t && !reduced) {
    gsap.from(splitChars(t), { yPercent: 110, opacity: 0, duration: 1.3, stagger: 0.02, ease: 'expo.out', delay: 0.15 });
    gsap.from('[data-fade-in]', { y: 20, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay: 0.35 });
    gsap.fromTo('.cs-hero__media img', { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
    gsap.to('.cs-hero__media img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.cs-hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  reveal();
  $$('video[data-src]').forEach((v) => {
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      v.innerHTML = `<source src="${v.dataset.src}.webm" type="video/webm"><source src="${v.dataset.src}.mp4" type="video/mp4">`;
      v.load(); v.play().catch(() => {});
    }, { rootMargin: '300px' }).observe(v);
  });
};
(document.fonts?.ready || Promise.resolve()).then(start);

// Estudio: el director como crédito de película (sin rostro), el emblema que se dibuja y las latitudes.
import './pages.css';
import { boot, reveal, splitChars, $, $$, gsap, reduced } from './core.js';

boot();
const start = () => {
  if (!reduced) {
    // "Exposición": el nombre aparece como una lámpara que se enciende
    gsap.fromTo(splitChars($('[data-dir-title]')), { opacity: 0, filter: 'blur(12px)', yPercent: 30 }, { opacity: 1, filter: 'blur(0px)', yPercent: 0, duration: 1.4, stagger: 0.035, ease: 'power3.out', delay: 0.2 });
    gsap.from('[data-dir-fade]', { opacity: 0, y: 16, duration: 1.2, stagger: 0.15, ease: 'expo.out', delay: 0.5 });
    const mark = $('.roots__mark');
    if (mark) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: mark, start: 'top 75%' } });
      tl.fromTo($$('.em__north, .em__south', mark), { strokeDasharray: 180, strokeDashoffset: 180 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut' })
        .from($('.em__trunk', mark), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'power3.out' }, 0.3)
        .from($$('.em__arau path', mark), { scaleX: 0, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.6)
        .from($$('.em__palm path', mark), { scale: 0, transformOrigin: '50% 33%', duration: 1, stagger: 0.05, ease: 'expo.out' }, 0.8)
        .from($('.em__roots', mark), { opacity: 0, duration: 0.6 }, 1.1);
    }
    gsap.from('.lat__pt', { opacity: 0, x: -14, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '[data-lat-map]', start: 'top 75%' } });
  }
  reveal();
  // MANI-GANTE funcionando: los videos se descargan al acercarse
  $$('video[data-src]').forEach((v) => new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    v.innerHTML = `<source src="${v.dataset.src}.webm" type="video/webm"><source src="${v.dataset.src}.mp4" type="video/mp4">`;
    v.load(); v.play().catch(() => {});
  }, { rootMargin: '300px' }).observe(v));
};
(document.fonts?.ready || Promise.resolve()).then(start);

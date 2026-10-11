// Páginas secundarias (servicios y privacidad): misma base visual y el agente disponible.
import { initShared, revealOnScroll, splitLines, $, reduced, gsap, ScrollTrigger } from './shared.js';

initShared();
const boot = () => {
  const title = $('[data-hero-title]');
  if (title && !reduced) {
    gsap.from(splitLines(title), { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out' });
    gsap.from('.page-hero [data-fade]', { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.2 });
    gsap.from('.page-hero__img', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut' });
  }
  revealOnScroll();
  ScrollTrigger.refresh();
};
if (document.fonts?.ready) document.fonts.ready.then(boot); else addEventListener('load', boot);

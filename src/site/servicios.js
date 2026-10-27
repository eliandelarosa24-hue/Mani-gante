// Servicios y planes: la única página con precios, y la única donde se enciende una lámpara.
import './pages.css';
import { boot, reveal } from './core.js';
import { initPrices } from './prices.js';

boot();
initPrices();

// La lámpara sigue al puntero sobre cada plan: la luz cae donde uno mira
if (matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.plan, .care__it').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}
(document.fonts?.ready || Promise.resolve()).then(() => reveal());

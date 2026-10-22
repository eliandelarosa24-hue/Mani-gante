// Páginas sencillas del estudio (servicio en detalle, privacidad, gracias, 404).
import './pages.css';
import { boot, reveal, fine, reduced } from './core.js';
import { initPrices } from './prices.js';

boot();
initPrices();
(document.fonts?.ready || Promise.resolve()).then(() => reveal());
// 404: la sala está a oscuras y el cursor es la linterna del acomodador
const dark = document.querySelector('.dark404');
if (dark && fine && !reduced) addEventListener('pointermove', (e) => { dark.style.setProperty('--mx', e.clientX + 'px'); dark.style.setProperty('--my', e.clientY + 'px'); }, { passive: true });

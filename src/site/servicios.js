// Servicios y planes: la página de precios, donde se enciende una lámpara sobre los números.
import './pages.css';
import { boot, reveal } from './core.js';
import { initPrices } from './prices.js';
import { initCalc } from './calc.js';

boot();
initPrices();
initCalc();
(document.fonts?.ready || Promise.resolve()).then(() => reveal());

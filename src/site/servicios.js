// Servicios y planes: la página de precios, donde se enciende una lámpara sobre los números.
import './pages.css';
import { boot, reveal } from './core.js';
import { initPrices } from './prices.js';

boot();
initPrices();
(document.fonts?.ready || Promise.resolve()).then(() => reveal());

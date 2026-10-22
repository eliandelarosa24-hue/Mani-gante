// Servicios y planes: la única página con precios y con las luces encendidas.
import './pages.css';
import { boot, reveal } from './core.js';
import { initPrices } from './prices.js';

boot();
initPrices();
(document.fonts?.ready || Promise.resolve()).then(() => reveal());

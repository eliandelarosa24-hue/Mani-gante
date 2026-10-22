// Precios en pantalla, siempre desde src/pricing.js: plan con precio de lanzamiento y normal tachado,
// "desde" por servicio, extras, cupos y cambio CLP / USD (recordado en este equipo).
import { SERVICES, priceOf, fromPrice, formatCLP, launchLeft, LAUNCH, USD_RATE } from '../pricing.js';
import { track } from '../analytics.js';

const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initPrices() {
  let cur = 'CLP';
  try { cur = localStorage.getItem('rv-cur') || 'CLP'; } catch { /* sin almacenamiento */ }
  const money = (v) => (cur === 'USD' ? `US$${Math.round(v / USD_RATE).toLocaleString('es-CL')}` : formatCLP(v));
  const paint = () => {
    $$('[data-tier-price]').forEach((el) => {
      const [sid, tid] = el.dataset.tierPrice.split(':');
      const t = SERVICES[sid]?.tiers?.[tid]; if (!t) return;
      const p = priceOf(t), per = el.hasAttribute('data-monthly') ? '<small>/mes</small>' : '';
      el.innerHTML = el.hasAttribute('data-full')
        ? `<span>${p !== t ? 'Precio de lanzamiento, desde' : 'Desde'}</span><strong>${money(p.min)}${per}</strong>${p !== t ? `<s>Precio normal desde ${money(t.min)}</s>` : ''}`
        : `${money(p.min)}${per}`;
    });
    $$('[data-from-price]').forEach((el) => {
      const v = fromPrice(el.dataset.fromPrice); if (!v) return;
      el.textContent = `desde ${money(v)}${SERVICES[el.dataset.fromPrice]?.monthly ? '/mes' : ''}`;
    });
    $$('[data-addon-price]').forEach((el) => {
      const [sid, aid] = el.dataset.addonPrice.split(':');
      const ad = SERVICES[sid]?.addons?.[aid]; if (ad) el.textContent = money(ad.min);
    });
    $$('[data-cur]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.cur === cur)));
  };
  $$('[data-cur]').forEach((b) => b.addEventListener('click', () => {
    cur = b.dataset.cur;
    try { localStorage.setItem('rv-cur', cur); } catch { /* sin almacenamiento */ }
    paint();
    track('currency', { cur });
  }));
  paint();
  $$('[data-launch-left]').forEach((el) => (el.textContent = launchLeft()));
  $$('[data-launch-total]').forEach((el) => (el.textContent = LAUNCH.slots));
  if (launchLeft() === 0) $$('[data-launch]').forEach((el) => el.remove());
}

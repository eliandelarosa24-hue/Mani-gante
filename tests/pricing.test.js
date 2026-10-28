import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimate, fromPrice, catalogText, priceOf, SERVICES } from '../src/pricing.js';

test('estima un sitio completo con extras e idiomas', () => {
  const e = estimate({ items: [{ service: 'web_alojamiento', tier: 'completo', addons: ['reservas', { id: 'idioma', qty: 2 }] }] });
  assert.equal(e.errors.length, 0);
  assert.equal(e.lines.length, 3);
  const t = SERVICES.web_alojamiento;
  assert.equal(e.oneTime.min, priceOf(t.tiers.completo).min + t.addons.reservas.min + 2 * t.addons.idioma.min);
  assert.equal(e.monthly.max, 0);
});

test('separa montos mensuales de los pagos únicos', () => {
  const e = estimate({ items: [
    { service: 'redes', tier: 'pro', addons: ['ads'] },
    { service: 'automatizacion', tier: 'agente' },
  ] });
  assert.equal(e.monthly.min, SERVICES.redes.tiers.pro.min + SERVICES.redes.addons.ads.min);
  assert.equal(e.oneTime.min, SERVICES.automatizacion.tiers.agente.min);
});

test('ignora entradas inválidas sin romperse', () => {
  const e = estimate({ items: [{ service: 'x', tier: 'y' }, { service: 'redes', tier: 'nope' }, null] });
  assert.equal(e.lines.length, 0);
  assert.equal(e.errors.length, 3);
  assert.equal(estimate(undefined).lines.length, 0);
});

test('urgencia suma 20% solo sobre pagos únicos', () => {
  const base = estimate({ items: [{ service: 'web_restaurante', tier: 'completo' }] });
  const urg = estimate({ items: [{ service: 'web_restaurante', tier: 'completo' }], urgent: true });
  assert.equal(urg.oneTime.min, Math.round((base.oneTime.min * 1.2) / 1000) * 1000);
});

test('usa el precio de lanzamiento mientras quedan cupos', () => {
  const t = SERVICES.web_alojamiento.tiers.firma;
  const e = estimate({ items: [{ service: 'web_alojamiento', tier: 'firma' }] });
  assert.equal(e.oneTime.min, t.launch.min);
  assert.match(e.lines[0].label, /lanzamiento/);
  assert.equal(fromPrice('web_alojamiento'), SERVICES.web_alojamiento.tiers.esencial.launch.min);
  assert.match(catalogText(), /precio normal .* precio de lanzamiento vigente/);
});

test('precios desde y catálogo para el agente', () => {
  assert.equal(fromPrice('automatizacion'), SERVICES.automatizacion.tiers.sheets.min);
  assert.match(catalogText(), /service="automatizacion"/);
  // Asesoría y capacitación ya no se ofrecen
  assert.ok(!('asesoria' in SERVICES) && !('capacitacion' in SERVICES));
  assert.doesNotMatch(catalogText(), /asesor|capacitaci/i);
});

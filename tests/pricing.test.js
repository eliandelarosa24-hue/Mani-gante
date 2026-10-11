import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimate, fromPrice, catalogText, SERVICES } from '../src/pricing.js';

test('estima un sitio completo con extras e idiomas', () => {
  const e = estimate({ items: [{ service: 'web_alojamiento', tier: 'completo', addons: ['reservas', { id: 'idioma', qty: 2 }] }] });
  assert.equal(e.errors.length, 0);
  assert.equal(e.lines.length, 3);
  const t = SERVICES.web_alojamiento;
  assert.equal(e.oneTime.min, t.tiers.completo.min + t.addons.reservas.min + 2 * t.addons.idioma.min);
  assert.equal(e.monthly.max, 0);
});

test('separa montos mensuales y cobra participantes extra', () => {
  const e = estimate({ items: [
    { service: 'redes', tier: 'pro', addons: ['ads'] },
    { service: 'capacitacion', tier: 'taller', participants: 20 },
  ] });
  assert.ok(e.monthly.min > 0);
  assert.ok(e.lines.some((l) => l.label.startsWith('5 participantes')));
});

test('ignora entradas inválidas sin romperse', () => {
  const e = estimate({ items: [{ service: 'x', tier: 'y' }, { service: 'asesoria', tier: 'nope' }, null] });
  assert.equal(e.lines.length, 0);
  assert.equal(e.errors.length, 3);
  assert.equal(estimate(undefined).lines.length, 0);
});

test('urgencia suma 20% solo sobre pagos únicos', () => {
  const base = estimate({ items: [{ service: 'web_restaurante', tier: 'sitio' }] });
  const urg = estimate({ items: [{ service: 'web_restaurante', tier: 'sitio' }], urgent: true });
  assert.equal(urg.oneTime.min, Math.round((base.oneTime.min * 1.2) / 5000) * 5000);
});

test('precios desde y catálogo para el agente', () => {
  assert.equal(fromPrice('asesoria'), SERVICES.asesoria.tiers.diagnostico.min);
  assert.match(catalogText(), /service="capacitacion"/);
});

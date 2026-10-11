import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { PAGES } from '../src/services-content.js';
import { SERVICES, LAUNCH, launchLeft, CAMPAIGN } from '../src/pricing.js';

test('cada página de servicio apunta a un servicio real y describe todas sus opciones', () => {
  for (const p of PAGES) {
    const s = SERVICES[p.service];
    assert.ok(s, `servicio inexistente: ${p.service}`);
    for (const tier of Object.keys(s.tiers)) assert.ok(p.tiers[tier]?.length, `${p.slug} no describe la opción ${tier}`);
    assert.ok(p.description.length <= 170, `${p.slug}: la meta descripción es muy larga`);
    assert.ok(p.faq.length >= 3);
  }
});

test('el generador crea páginas con precios, datos estructurados y el script compartido', () => {
  execFileSync('node', ['scripts/build-pages.mjs']);
  const html = readFileSync('servicios/paginas-web-alojamientos/index.html', 'utf8');
  assert.match(html, /\$49\.000/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /src="\/src\/page\.js"/);
  assert.match(readFileSync('privacidad/index.html', 'utf8'), /Ley 21\.719/);
});

test('cupos y campaña configurados', () => {
  assert.equal(launchLeft(), LAUNCH.slots - LAUNCH.taken);
  assert.ok(!Number.isNaN(new Date(CAMPAIGN.deadline).getTime()));
});

test('el agente tiene límite de uso por IP', async () => {
  const { config } = await import('../netlify/functions/agent.mjs');
  assert.equal(config.path, '/api/agent');
  assert.equal(config.rateLimit.windowLimit > 0, true);
  assert.deepEqual(config.rateLimit.aggregateBy, ['ip', 'domain']);
});

test('formularios enviados por JavaScript están registrados para Netlify', () => {
  const skel = readFileSync('public/__forms.html', 'utf8');
  for (const name of ['cotizacion', 'diagnostico']) assert.match(skel, new RegExp(`name="${name}" data-netlify="true"`));
  for (const field of ['nombre', 'whatsapp', 'servicios', 'estimacion', 'puntaje', 'respuestas']) assert.match(skel, new RegExp(`name="${field}"`));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { SCENES, REAL } from '../src/site/scenes.js';
import { latY, scenesMarkup, railMarkup } from '../src/site/markup.mjs';

test('la función va del paralelo 19 Norte al 41 Sur, sin saltos hacia el norte', () => {
  for (let i = 1; i < SCENES.length; i++) assert.ok(SCENES[i].lat <= SCENES[i - 1].lat + 0.02, `${SCENES[i].slug} rompe el orden de latitud`);
  assert.equal(SCENES[0].slug, 'villa-coral-samana');
  assert.ok(latY(19.3) < latY(0) && latY(0) < latY(-39) && latY(-41.1) <= 1);
});

test('cada obra tiene foto, video, caso, tipografía y paleta reales', () => {
  for (const s of SCENES) {
    assert.ok(existsSync(`public${s.image}`), `falta ${s.image}`);
    assert.ok(existsSync(`public${s.video}.mp4`), `falta el video de ${s.slug}`);
    for (const g of s.gallery) assert.ok(existsSync(`public${g}`), `falta ${g}`);
    assert.ok(s.concept && s.reto && s.idea && s.palette?.length && s.fonts?.length, `${s.slug} sin caso completo`);
    assert.match(s.coords, /^\d+°\d{2}′ [NS] \d+°\d{2}′ O$/);
  }
  for (const r of REAL) assert.ok(existsSync(`public${r.image}`), `falta ${r.image}`);
});

test('las muestras se presentan como ficción y nunca con precios', () => {
  const html = scenesMarkup();
  assert.equal((html.match(/negocio ficticio/g) || []).length, SCENES.length);
  assert.doesNotMatch(html, /\$\d/);
  assert.equal((railMarkup().match(/rail__dot/g) || []).length, SCENES.length);
});

test('el generador de Trabajos crea el índice y un caso por obra', () => {
  execFileSync('node', ['scripts/build-works.mjs']);
  assert.match(readFileSync('trabajos/index.html', 'utf8'), /Cada lugar,/);
  for (const s of SCENES) {
    const page = readFileSync(`trabajos/${s.slug}/index.html`, 'utf8');
    assert.match(page, new RegExp(`href="/muestras/${s.slug}/"`));
    assert.doesNotMatch(page, /\$\d/, `${s.slug}: los casos no hablan de precio`);
  }
});

test('el formulario de contacto registra en Netlify todos los campos que envía', () => {
  const html = readFileSync('contacto/index.html', 'utf8');
  assert.match(html, /name="contacto" method="POST" data-netlify="true"/);
  for (const f of ['nombre', 'whatsapp', 'correo', 'negocio', 'lugar', 'temporada', 'servicio', 'mensaje', 'escena', 'obra', 'consentimiento']) assert.match(html, new RegExp(`name="${f}"`), `falta ${f}`);
});

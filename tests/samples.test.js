import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { SAMPLES } from '../src/samples/data.js';

test('hay 10 muestras únicas y de varios rubros', () => {
  assert.equal(SAMPLES.length, 10);
  assert.equal(new Set(SAMPLES.map((s) => s.slug)).size, 10);
  assert.ok(new Set(SAMPLES.map((s) => s.niche)).size >= 5);
});

test('cada muestra tiene reserva, identidad propia y secciones válidas', () => {
  const types = ['story', 'quote', 'units', 'booking', 'amen', 'gallery', 'menu', 'tours', 'tiers', 'sky', 'events', 'directory', 'reviews', 'location', 'faq', 'cta'];
  for (const s of SAMPLES) {
    for (const b of s.blocks) assert.ok(types.includes(b.type), `${s.slug}: sección desconocida ${b.type}`);
    assert.ok(s.theme['--accent'] && s.theme['--display'], `${s.slug}: falta identidad visual`);
    for (const [, id] of s.nav) assert.ok(id === 'reservar' || s.blocks.some((b) => (b.id || defaultId(b.type)) === id), `${s.slug}: el menú apunta a #${id}, que no existe`);
  }
});

test('el generador crea las páginas, la galería y las tarjetas de la portada', () => {
  execFileSync('node', ['scripts/build-samples.mjs']);
  for (const s of SAMPLES) {
    const html = readFileSync(`muestras/${s.slug}/index.html`, 'utf8');
    assert.match(html, /Muestra de concepto diseñada por Red Vaeru/);
    assert.match(html, /noindex/);
    if (existsSync(`src/samples/custom/${s.slug}/index.html`)) {
      // Muestra rediseñada a medida: pantalla de carga propia y todas las imágenes resueltas.
      assert.match(html, /class="loader"/, `${s.slug}: falta la pantalla de carga`);
      assert.doesNotMatch(html, /\{\{img:/, `${s.slug}: quedó un marcador de imagen sin reemplazar`);
    } else assert.match(html, /:root:root\{/);
  }
  // Cada muestra lleva de vuelta a su caso y al contacto con la obra anotada
  for (const s of SAMPLES) {
    const html = readFileSync(`muestras/${s.slug}/index.html`, 'utf8');
    assert.match(html, new RegExp(`href="/trabajos/${s.slug}/"`));
    assert.match(html, new RegExp(`href="/contacto/\\?obra=${s.slug}"`));
  }
});

function defaultId(type) {
  return { story: 'historia', units: 'unidades', amen: 'servicios', gallery: 'galeria', menu: 'carta', tours: 'experiencias', tiers: 'planes', sky: 'cielo', events: 'agenda', directory: 'directorio', reviews: 'resenas', location: 'ubicacion', faq: 'preguntas' }[type];
}

// Genera las imágenes de una semana con las plantillas de la marca.
// Uso: SEMANA=2 node build-images.mjs   →  out/semana-2/...
import { render, done, SEMANA, SEMANA_DIR } from './lib.mjs';
import { kit } from './templates.mjs';

const pieces = [];
const k = await kit((p) => pieces.push(p));
const { default: imagenes } = await import(SEMANA_DIR + 'imagenes.mjs');
await imagenes(k);
await render(pieces);
await done();
console.log(`\n${pieces.length} imágenes generadas en out/semana-${SEMANA}/`);

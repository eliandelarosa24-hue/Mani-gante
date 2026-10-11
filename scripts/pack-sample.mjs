// Empaqueta una muestra ya compilada como sitio independiente, listo para subir a Netlify
// (arrastrando la carpeta o el zip a app.netlify.com/drop) o a cualquier hosting.
//
// Uso: npm run build && npm run pack -- domos-cielo-austral   (o "all" para todas)
// Resultado: entregas/<slug>.zip con index.html en la raíz, assets/, img/ y brand/.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { SAMPLES } from '../src/samples/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = (process.env.SITE_URL || 'https://redvaeru.netlify.app').replace(/\/$/, '');
const which = process.argv[2];
if (!which) { console.error(`Uso: npm run pack -- <slug>|all\nMuestras: ${SAMPLES.map((s) => s.slug).join(', ')}`); process.exit(1); }
if (!existsSync(join(dist, 'muestras'))) { console.error('Primero ejecute "npm run build".'); process.exit(1); }

const out = join(root, 'entregas');
mkdirSync(out, { recursive: true });
for (const s of which === 'all' ? SAMPLES : SAMPLES.filter((x) => x.slug === which)) {
  const page = join(dist, 'muestras', s.slug, 'index.html');
  if (!existsSync(page)) { console.error(`No está compilada: ${s.slug}`); continue; }
  const tmp = join(out, s.slug);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  let html = readFileSync(page, 'utf8');

  // Copia cada archivo local que la página usa y deja la ruta relativa.
  const files = new Set(html.match(/\/(assets|brand)\/[^"')\s]+/g) || []);
  for (const f of files) {
    mkdirSync(dirname(join(tmp, f)), { recursive: true });
    cpSync(join(dist, f), join(tmp, f));
    html = html.split(`"${f}"`).join(`"${f.slice(1)}"`);
  }
  const imgDir = join(dist, 'muestras', s.slug, 'img');
  if (existsSync(imgDir)) cpSync(imgDir, join(tmp, 'img'), { recursive: true });
  html = html.replaceAll(`/muestras/${s.slug}/img/`, 'img/');
  // Los enlaces a Red Vaeru apuntan al sitio publicado
  html = html.replace(/href="\/(#[^"]*)?"/g, (_, h) => `href="${SITE}/${h || ''}"`).replaceAll('href="/muestras/"', `href="${SITE}/muestras/"`);
  writeFileSync(join(tmp, 'index.html'), html);
  writeFileSync(join(tmp, 'LEEME.txt'), `${s.name} · muestra de concepto de Red Vaeru\n\nPara publicarla: entre a https://app.netlify.com/drop y arrastre esta carpeta (o el zip).\nNo se abre con doble clic desde el computador: los navegadores bloquean los módulos JavaScript en archivos locales.\nPara verla localmente: npx serve .  (dentro de esta carpeta)\n`);

  const zip = join(out, `${s.slug}.zip`);
  rmSync(zip, { force: true });
  execFileSync('zip', ['-qr', zip, '.'], { cwd: tmp });
  console.log(`${s.slug}.zip · ${files.size} archivos de código · ${Math.round(readFileSync(zip).length / 1024)} KB`);
}

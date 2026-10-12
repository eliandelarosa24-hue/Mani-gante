// Corta un collage hecho en la app de Gemini (o ChatGPT) en imágenes sueltas, las amplía con
// buena calidad y las guarda como WebP en public/muestras/<slug>/img/<nombre>.webp.
//
// Uso:
//   npm run collage -- <archivo.png> --sample domos-cielo-austral --grid 2x2 --names hero,cierre,g1,g2
//   Opciones:
//     --grid 2x2|3x3|4x2|2x4   columnas x filas del collage (por defecto 2x2)
//     --names a,b,c            nombre de cada celda, de izquierda a derecha y de arriba abajo
//                              (usar "-" para saltar una celda)
//     --inset 0.02             recorte de cada borde para eliminar las líneas de unión (2 % por defecto)
//     --width 1920             ancho final de cada imagen (se amplía con Lanczos + enfoque suave)
//     --ratio 16:9             recorta cada celda a esa proporción, centrada (opcional)
//     --pos 0.5,0.5            punto que se conserva al recortar a --ratio (x,y de 0 a 1; 0,0 = arriba a la izquierda)
//     --sr modelo.pb           amplía primero con inteligencia artificial (scripts/superres.py, EDSR x2):
//                              más nitidez y menos artefactos que solo Lanczos; tarda ~2 min por imagen
//     --sr-passes 2            aplica la ampliación con IA dos veces (para collages muy pequeños)
//     --dry                    solo muestra qué haría
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const file = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const slug = opt('sample');
if (!file || !slug) {
  console.error('Uso: npm run collage -- <collage.png> --sample <slug> --grid 2x2 --names hero,g1,g2,g3');
  process.exit(1);
}
const [cols, rows] = opt('grid', '2x2').split('x').map(Number);
const names = opt('names', '').split(',').filter(Boolean);
const inset = Number(opt('inset', '0.02'));
const width = Number(opt('width', '1920'));
const ratio = opt('ratio');
const srModel = opt('sr');
const srPasses = Number(opt('sr-passes', '1'));
const [px, py] = opt('pos', '0.5,0.5').split(',').map(Number);

function cells(w, h, cols, rows, inset) {
  const cw = w / cols, ch = h / rows, out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = Math.round(cw * inset), dy = Math.round(ch * inset);
      out.push({ left: Math.round(c * cw) + dx, top: Math.round(r * ch) + dy, width: Math.floor(cw) - 2 * dx, height: Math.floor(ch) - 2 * dy });
    }
  }
  return out;
}

const src = sharp(resolve(file));
const { width: W, height: H } = await src.metadata();
const dir = join(root, 'public', 'muestras', slug, 'img');
mkdirSync(dir, { recursive: true });
const boxes = cells(W, H, cols, rows, inset);
console.log(`Collage ${W}×${H} → ${boxes.length} celdas de ~${boxes[0].width}×${boxes[0].height}`);

for (const [i, box] of boxes.entries()) {
  const name = names[i] || `celda-${i + 1}`;
  if (name === '-') continue;
  let crop = box;
  if (ratio) {
    const [rw, rh] = ratio.split(':').map(Number);
    const target = rw / rh;
    if (box.width / box.height > target) {
      const nw = Math.round(box.height * target);
      crop = { ...box, left: box.left + Math.round((box.width - nw) * px), width: nw };
    } else {
      const nh = Math.round(box.width / target);
      crop = { ...box, top: box.top + Math.round((box.height - nh) * py), height: nh };
    }
  }
  const out = join(dir, `${name}.webp`);
  if (args.includes('--dry')) { console.log(`  ${name}: ${JSON.stringify(crop)} → ${out}`); continue; }
  let input = await sharp(resolve(file)).extract(crop).png().toBuffer();
  if (srModel) {
    const a = join(tmpdir(), `sr-${process.pid}-${i}.png`), b = a.replace('.png', '-x.png');
    for (let k = 0; k < srPasses; k++) {
      writeFileSync(a, input);
      execFileSync('python3', [join(root, 'scripts', 'superres.py'), resolve(srModel), a, b], { stdio: 'inherit' });
      input = await sharp(b).toBuffer();
    }
    rmSync(a); rmSync(b);
  }
  const img = await sharp(input)
    .resize({ width, kernel: 'lanczos3', withoutEnlargement: false })
    .sharpen(srModel ? { sigma: 0.5, m1: 0.4, m2: 0.8 } : { sigma: 0.8, m1: 0.6, m2: 1.4 })
    .modulate({ saturation: 1.03 })
    .webp({ quality: 82, smartSubsample: true })
    .toBuffer();
  writeFileSync(out, img);
  console.log(`  ${name}.webp (${Math.round(img.length / 1024)} KB)`);
}
console.log('Listo. Ejecute "npm run build" para que la muestra use las imágenes nuevas.');

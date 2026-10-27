// Descarga, una sola vez, las tipografías de titular de cada muestra con todo el alfabeto en español,
// para «Su estreno» (la portada de prueba con el nombre del visitante). Resultado: public/fonts/estreno/*.woff2
// y src/site/estreno-fonts.css. Se ejecuta a mano (`node scripts/fetch-estreno-fonts.mjs`) y se versiona.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES } from '../src/site/scenes.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚÜÑáéíóúüñÀÈÌÒÙàèìòùÇçÄËÏÖäëïöÂÊÎÔÛâêîôû0123456789 .,:;!?¡¿«»"\'’‘“”()-–—&/·+@#%';
mkdirSync(join(root, 'public/fonts/estreno'), { recursive: true });

const faces = new Map();
for (const s of SCENES) for (const f of s.faces) faces.set(`${f.family}|${f.axes}`, f);
let css = '/* Generado por scripts/fetch-estreno-fonts.mjs: titulares de las muestras con el alfabeto completo, para «Su estreno». */\n';
for (const [key, f] of faces) {
  const url = `https://fonts.googleapis.com/css2?family=${f.family.replace(/ /g, '+')}${f.axes ? ':' + f.axes : ''}&text=${encodeURIComponent(ABC)}`;
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${key}: ${res.status} ${await res.text()}`);
  for (const b of (await res.text()).match(/@font-face\s*{[^}]+}/g) || []) {
    const src = b.match(/url\(([^)]+)\)/)[1];
    const style = b.match(/font-style:\s*(\w+)/)[1], weight = b.match(/font-weight:\s*([\d ]+)/)[1].trim();
    const stretch = b.match(/font-stretch:\s*([\d.%]+)/)?.[1];
    const file = `${f.family.toLowerCase().replace(/ /g, '-')}-${style}-${weight.replace(/ /g, '_')}${stretch ? '-' + stretch.replace('%', '') : ''}.woff2`;
    const buf = Buffer.from(await (await fetch(src, { headers: { 'user-agent': UA } })).arrayBuffer());
    writeFileSync(join(root, 'public/fonts/estreno', file), buf);
    css += `@font-face{font-family:'${f.family} Estreno';font-style:${style};font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:swap;src:url(/fonts/estreno/${file}) format('woff2')}\n`;
    console.log(file, (buf.length / 1024).toFixed(1) + ' KB');
  }
}
writeFileSync(join(root, 'src/site/estreno-fonts.css'), css);

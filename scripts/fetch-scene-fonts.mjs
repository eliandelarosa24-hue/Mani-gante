// Descarga, una sola vez, las tipografías de los titulares de cada muestra recortadas a los caracteres
// que usa la portada de Red Vaeru (pesan unos pocos KB). Resultado: public/fonts/escenas/*.woff2
// y src/site/scene-fonts.css. Se ejecuta a mano (`node scripts/fetch-scene-fonts.mjs`) y se versiona.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES } from '../src/site/scenes.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const strip = (h) => h.replace(/<[^>]+>/g, ' ');
mkdirSync(join(root, 'public/fonts/escenas'), { recursive: true });

// Agrupa por familia+estilo para no descargar dos veces la misma fuente
const faces = new Map();
for (const s of SCENES) for (const f of s.faces) {
  const key = `${f.family}|${f.axes}`;
  const text = strip(s.title) + ' ' + s.name;
  const chars = new Set([...(faces.get(key)?.chars || []), ...text, ...text.toUpperCase(), ...text.toLowerCase(), ...'0123456789.,'] );
  faces.set(key, { ...f, chars });
}
let css = '/* Generado por scripts/fetch-scene-fonts.mjs: titulares de las muestras, recortados. */\n';
for (const [key, f] of faces) {
  const text = [...f.chars].filter((c) => c.trim()).sort().join('');
  const url = `https://fonts.googleapis.com/css2?family=${f.family.replace(/ /g, '+')}${f.axes ? ':' + f.axes : ''}&text=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${key}: ${res.status} ${await res.text()}`);
  const sheet = await res.text();
  const blocks = sheet.match(/@font-face\s*{[^}]+}/g) || [];
  for (const b of blocks) {
    const src = b.match(/url\(([^)]+)\)/)[1];
    const style = b.match(/font-style:\s*(\w+)/)[1], weight = b.match(/font-weight:\s*([\d ]+)/)[1].trim();
    const stretch = b.match(/font-stretch:\s*([\d.%]+)/)?.[1];
    const file = `${f.family.toLowerCase().replace(/ /g, '-')}-${style}-${weight.replace(/ /g, '_')}${stretch ? '-' + stretch.replace('%', '') : ''}.woff2`;
    const buf = Buffer.from(await (await fetch(src, { headers: { 'user-agent': UA } })).arrayBuffer());
    writeFileSync(join(root, 'public/fonts/escenas', file), buf);
    css += `@font-face{font-family:'${f.family} Escena';font-style:${style};font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:swap;src:url(/fonts/escenas/${file}) format('woff2')}\n`;
    console.log(file, (buf.length / 1024).toFixed(1) + ' KB');
  }
}
writeFileSync(join(root, 'src/site/scene-fonts.css'), css);

// Muestras tipográficas de cada caso: el nombre de la fuente y un alfabeto corto, en su propia letra.
const SPEC = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnÑñOoPpQqRrSsTtUuVvWwXxYyZzÁáÉéÍíÓóÚú0123456789.,·&¿?¡!';
const fams = [...new Set(SCENES.flatMap((s) => s.fonts || []))];
let spec = '/* Generado por scripts/fetch-scene-fonts.mjs: tipografías de cada caso para su muestra tipográfica. */\n';
for (const fam of fams) {
  const text = [...new Set([...SPEC, ...fam])].filter((c) => c.trim()).join('');
  const res = await fetch(`https://fonts.googleapis.com/css2?family=${fam.replace(/ /g, '+')}&text=${encodeURIComponent(text)}`, { headers: { 'user-agent': UA } });
  if (!res.ok) { console.warn('sin', fam, res.status); continue; }
  const b = (await res.text()).match(/@font-face\s*{[^}]+}/)?.[0];
  if (!b) continue;
  const src = b.match(/url\(([^)]+)\)/)[1];
  const file = `spec-${fam.toLowerCase().replace(/ /g, '-')}.woff2`;
  const buf = Buffer.from(await (await fetch(src, { headers: { 'user-agent': UA } })).arrayBuffer());
  writeFileSync(join(root, 'public/fonts/escenas', file), buf);
  spec += `@font-face{font-family:'${fam} Muestra';font-display:swap;src:url(/fonts/escenas/${file}) format('woff2')}\n`;
  console.log(file, (buf.length / 1024).toFixed(1) + ' KB');
}
writeFileSync(join(root, 'src/site/spec-fonts.css'), spec);

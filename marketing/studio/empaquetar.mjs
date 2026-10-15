// Arma la entrega de una semana: carpetas por día y hora, imágenes en JPG, videos livianos,
// texto de cada publicación, agenda en PDF y un ZIP por día (cada uno bajo el límite de 30 MB).
// Uso: SEMANA=2 node empaquetar.mjs  →  ../../entregas/semana-2/*.zip
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, copyFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BASE, SEMANA, SEMANA_DIR, ROOT } from './lib.mjs';

const { PIECES, KITS = [], fbText } = await import(SEMANA_DIR + 'manifest.mjs');
const OUTDIR = join(ROOT, 'entregas', `semana-${SEMANA}`);
const PKG = join(OUTDIR, `red-vaeru-semana-${SEMANA}`);
rmSync(OUTDIR, { recursive: true, force: true });
mkdirSync(PKG, { recursive: true });
const DAYS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const ff = (a) => execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-y', ...a]);
const put = (src, dest) => {
  if (src.endsWith('.png')) ff(['-i', src, '-q:v', '2', dest.replace(/\.png$/, '.jpg')]);
  else if (src.endsWith('.mp4')) ff(['-i', src, '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-maxrate', '3M', '-bufsize', '6M', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', dest]);
  else copyFileSync(src, dest);
};
const jpg = (f) => f.split('/').pop().replace(/\.png$/, '.jpg');

for (const p of PIECES) {
  const d = new Date(p.day + 'T12:00:00');
  const dir = join(PKG, `${p.day}_${DAYS[d.getDay()]}`, `${p.time.replace(':', '')}_${p.id}`);
  mkdirSync(dir, { recursive: true });
  for (const f of [...(p.filesVoz || []), ...p.files]) put(join(BASE, f), join(dir, f.split('/').pop()));
  if (p.filesB) { mkdirSync(join(dir, 'variante-B'), { recursive: true }); for (const f of p.filesB) put(join(BASE, f), join(dir, 'variante-B', f.split('/').pop())); }
  let t = `PUBLICAR: ${p.day} a las ${p.time}${p.fbTime ? ` (Facebook ${p.fbTime})` : ''} en ${p.where.join(', ')}\n${p.title}\n\n`;
  if (p.ig) t += (p.noFb || !p.where.includes('Facebook') ? `--- TEXTO ---\n${p.ig}` : `--- TEXTO INSTAGRAM ---\n${p.ig}\n\n--- TEXTO FACEBOOK ---\n${fbText(p)}`) + '\n';
  if (p.notes) t += `\n--- NOTAS ---\n${p.notes}\n`;
  if (p.filesVoz) t += '\nEl video terminado en _voz.mp4 trae voz y subtitulos. Agregue musica suave desde Instagram.\n';
  writeFileSync(join(dir, 'LEEME_texto.txt'), t.replace(/\.png/g, '.jpg'));
}
for (const k of KITS) { const dir = join(PKG, '00_perfil-y-anuncios'); mkdirSync(dir, { recursive: true }); for (const f of k.files) put(join(BASE, f), join(dir, jpg(f).includes('.') ? f.split('/').pop() : f)); }
const pdf = join(BASE, `Agenda-Red-Vaeru-semana-${SEMANA}.pdf`);
if (existsSync(pdf)) copyFileSync(pdf, join(PKG, `Agenda-Red-Vaeru-semana-${SEMANA}.pdf`));
for (const day of readdirSync(PKG).filter((x) => !x.endsWith('.pdf'))) {
  const zip = join(OUTDIR, `RedVaeru_s${SEMANA}_${day}.zip`);
  execFileSync('zip', ['-qr', zip, `red-vaeru-semana-${SEMANA}/${day}`, ...(existsSync(pdf) ? [`red-vaeru-semana-${SEMANA}/Agenda-Red-Vaeru-semana-${SEMANA}.pdf`] : [])], { cwd: OUTDIR });
  console.log('✓', zip.split('/').pop());
}

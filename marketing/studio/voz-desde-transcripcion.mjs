// Convierte una voz generada en el conector de ElevenLabs (mp3 + transcripción con tiempos por palabra)
// al formato de voz.mjs (out/semana-N/voz/<ID>.json + .mp3), para editarla con edicion.mjs.
// Uso: SEMANA=N node voz-desde-transcripcion.mjs <ID> <audio.mp3> <palabras.json> [MAYÚSCULAS,...]
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { BASE } from './lib.mjs';

const [id, mp3, wordsFile, caps = ''] = process.argv.slice(2);
const raw = JSON.parse(readFileSync(wordsFile, 'utf8'));
const list = (Array.isArray(raw) ? raw : raw.words || []).filter((w) => (w.type || 'word') === 'word');
const upper = caps.split(',').filter(Boolean);
const words = list.map((w) => ({ w: upper.includes(w.text.replace(/[¿?¡!.,:;]/g, '')) ? w.text.toUpperCase() : w.text, t0: +w.start.toFixed(2), t1: +w.end.toFixed(2) }));
// Subtítulos: grupos de hasta 4 palabras, cortando después de la puntuación.
const subs = [];
let cur = [];
for (const w of words) {
  cur.push(w);
  if (cur.length >= 4 || /[.,:;?!]$/.test(w.w)) { subs.push({ text: cur.map((x) => x.w).join(' '), t0: cur[0].t0, t1: cur.at(-1).t1 }); cur = []; }
}
if (cur.length) subs.push({ text: cur.map((x) => x.w).join(' '), t0: cur[0].t0, t1: cur.at(-1).t1 });
const dir = BASE + 'voz/';
copyFileSync(mp3, dir + `${id}.mp3`);
const duration = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dir + `${id}.mp3`]).toString().trim();
writeFileSync(dir + `${id}.json`, JSON.stringify({ voice: 'F', duration, offset: 0.3, subs, words }, null, 1));
console.log(`✓ ${id} · ${duration.toFixed(1)} s · ${words.length} palabras · ${subs.length} subtítulos`);

// Voz en off con IA (ElevenLabs) y tiempos de subtítulos para los Reels.
// Lee la clave de ELEVENLABS_API_KEY. Sin clave, sirve en modo simulación (--simular) para probar
// el armado de subtítulos con audio en silencio y tiempos parejos.
// Uso: node voz.mjs [--simular] [id ...]   →  out/voz/<id>.mp3 y out/voz/<id>.json
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { OUT } from './lib.mjs';

const DIR = join(OUT, 'voz');
const KEY = process.env.ELEVENLABS_API_KEY || '';
const API = 'https://api.elevenlabs.io/v1';
const SIM = process.argv.includes('--simular');

// Guiones: trato de usted, tono chileno cercano. "say" es lo que se pronuncia; "sub" lo que se lee.
// Voces alternadas: F = femenina, M = masculina. Cada guion termina antes del cierre del Reel.
export const SCRIPTS = {
  P02: { voice: 'F', max: 14.5, sub: 'Esta es la web de Cabañas Miah y Noah, en Curacautín. Sus huéspedes ven las cabañas, la galería y la zona, y reservan directo por WhatsApp. ¿Quiere una así? Escríbame PORTADA.' },
  P04: { voice: 'M', max: 25.5, sub: 'Diseñé diez muestras para el turismo del sur: termas, cabañas, domos, una viña, cocina mapuche. No son clientes: son ideas de lo que se puede hacer. ¿Cuál se parece a su negocio? Coménteme el número y le cuento cómo sería la suya.' },
  P06: { voice: 'M', max: 14.5, sub: 'El Rincón de los Poetas, en Almagro, tenía una historia que no se veía en ninguna plataforma. Ahora tiene su propia web, que la cuenta, y un canal directo para reservar. ¿Su lugar también tiene una historia?' },
  R01: { voice: 'F', max: 13.5, sub: '¿Sabe cuánto le dejó a la plataforma este año? Mire: diez reservas al mes, a noventa mil pesos, con quince por ciento de comisión. Son un millón seiscientos veinte mil al año. Haga la cuenta con sus números, o la hacemos juntos.' },
  R02: { voice: 'M', max: 13, sub: 'Su carta puede ser una experiencia: sus platos, su historia y un botón de WhatsApp para pedir. Un QR en cada mesa, y usted cambia los precios cuando quiera. Escríbame CARTA.' },
  R03: { voice: 'F', max: 16.5, sub: 'Esto es lo que un aviso en una plataforma no le da: reservas por WhatsApp, directo con usted. Su propia guía de la zona. Check-in en línea. Y sus reseñas, en su propia casa.' },
  R04: { voice: 'M', max: 11.5, sub: 'Si su glamping tuviera su propia web, el cielo sería el protagonista, y sus domos se reservarían directo. Esta es una muestra de concepto. ¿Hacemos la suya?' },
};
// Pronunciación: palabras que la voz debe decir distinto de como se escriben.
const SAY = [['Miah', 'Mía'], ['PORTADA', 'portada'], ['CARTA', 'carta'], ['WhatsApp', 'guatsap']];
const toSay = (t) => SAY.reduce((s, [w, p]) => s.replaceAll(w, p), t);

const api = async (path, opts = {}) => {
  const res = await fetch(API + path, { ...opts, headers: { 'xi-api-key': KEY, 'content-type': 'application/json', ...(opts.headers || {}) } });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${(await res.text()).slice(0, 300)}`);
  return res.json();
};

// Elige (y agrega a la biblioteca) una voz chilena de la comunidad, o usa ELEVENLABS_VOICE_F / _M.
async function pickVoice(gender) {
  const fixed = process.env[`ELEVENLABS_VOICE_${gender}`];
  if (fixed) return fixed;
  const cacheF = join(DIR, 'voces.json');
  const cache = existsSync(cacheF) ? JSON.parse(readFileSync(cacheF, 'utf8')) : {};
  if (cache[gender]) return cache[gender].voice_id;
  const g = gender === 'F' ? 'female' : 'male';
  let list = (await api(`/shared-voices?page_size=20&language=es&accent=chilean&gender=${g}&sort=usage_character_count_1y`)).voices || [];
  if (!list.length) list = (await api(`/shared-voices?page_size=20&language=es&gender=${g}&use_cases=narrative_story&sort=usage_character_count_1y`)).voices || [];
  if (!list.length) throw new Error(`No hay voces ${g} en español disponibles`);
  const v = list[0];
  const added = await api(`/voices/add/${v.public_owner_id}/${v.voice_id}`, { method: 'POST', body: JSON.stringify({ new_name: `Red Vaeru ${gender} · ${v.name}` }) });
  cache[gender] = { voice_id: added.voice_id, name: v.name, accent: v.accent, descripcion: v.description };
  writeFileSync(cacheF, JSON.stringify(cache, null, 1));
  console.log(`Voz ${gender}: ${v.name} (${v.accent || 'sin acento declarado'})`);
  return added.voice_id;
}

// Agrupa palabras en bloques de 2 a 4 para subtítulos, con tiempos desde la alineación por carácter.
function groupWords(text, starts, ends) {
  const words = [];
  let cur = null;
  [...text].forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null; } return; }
    if (!cur) cur = { w: '', t0: starts[i], t1: ends[i] };
    cur.w += ch; cur.t1 = ends[i];
  });
  if (cur) words.push(cur);
  const back = Object.fromEntries(SAY.map(([w, p]) => [p, w]));
  words.forEach((x) => { const core = x.w.replace(/[¿?¡!.,:;]/g, ''); if (back[core]) x.w = x.w.replace(core, back[core]); });
  const groups = [];
  let g = [];
  for (const w of words) {
    g.push(w);
    const end = /[.,:;?!]$/.test(w.w);
    if (g.length >= 4 || (end && g.length >= 2)) { groups.push(g); g = []; }
  }
  if (g.length) groups.push(g);
  return groups.map((ws) => ({ text: ws.map((w) => w.w).join(' '), t0: +ws[0].t0.toFixed(2), t1: +ws[ws.length - 1].t1.toFixed(2) }));
}

async function synth(id, S) {
  const text = toSay(S.sub);
  let audio, starts, ends;
  if (SIM) {
    const dur = Math.min(S.max, text.length / 15);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-t', String(dur), '-i', 'anullsrc=r=44100:cl=mono', '-b:a', '64k', join(DIR, `${id}.mp3`)]);
    starts = [...text].map((_, i) => (i / text.length) * dur); ends = starts.map((s) => s + dur / text.length);
  } else {
    const voice = await pickVoice(S.voice);
    const r = await api(`/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST',
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', language_code: 'es', voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true, speed: 1.0 } }),
    });
    audio = Buffer.from(r.audio_base64, 'base64');
    writeFileSync(join(DIR, `${id}.mp3`), audio);
    ({ character_start_times_seconds: starts, character_end_times_seconds: ends } = r.alignment);
  }
  const len = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', join(DIR, `${id}.mp3`)]).toString());
  const subs = groupWords(text, starts, ends);
  writeFileSync(join(DIR, `${id}.json`), JSON.stringify({ voice: S.voice, duration: len, offset: 0.3, subs }, null, 1));
  console.log(`✓ ${id} · ${len.toFixed(1)} s${len > S.max ? ` ⚠ supera ${S.max} s: acorte el guion o suba la velocidad` : ''}`);
}

if (!SIM && !KEY) { console.error('Falta ELEVENLABS_API_KEY (o use --simular).'); process.exit(1); }
mkdirSync(DIR, { recursive: true });
const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
for (const id of ids.length ? ids : Object.keys(SCRIPTS)) {
  try { await synth(id, SCRIPTS[id]); } catch (e) { console.error(`✗ ${id}: ${e.message}`); }
}

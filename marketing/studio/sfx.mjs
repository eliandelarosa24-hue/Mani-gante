// Efectos de sonido y base musical con ElevenLabs (sound-generation). Se generan una vez y se reutilizan.
// Uso: NODE_USE_ENV_PROXY=1 ELEVENLABS_API_KEY=... node sfx.mjs   →  out/sfx/<nombre>.mp3
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { OUT } from './lib.mjs';

const DIR = join(OUT, 'sfx');
const KEY = process.env.ELEVENLABS_API_KEY || '';
export const SFX = {
  whoosh: { text: 'fast clean swoosh transition, short whoosh for video edit, no music', dur: 0.8 },
  pop: { text: 'loud cartoon bubble pop, single clear pop sound effect', dur: 0.6 },
  impact: { text: 'deep cinematic hit with a short punchy boom, trailer impact, short', dur: 1.2 },
  cash: { text: 'cash register ka-ching sound effect, bright, short', dur: 1.2 },
  click: { text: 'soft mouse click user interface tap, short', dur: 0.5 },
  scribble: { text: 'marker pen quickly drawing on paper, short scribble', dur: 0.8 },
  music: { text: 'warm upbeat lo-fi hip hop instrumental beat, soft piano and mellow drums, positive, steady loop, no vocals', dur: 22 },
};

mkdirSync(DIR, { recursive: true });
for (const [name, s] of Object.entries(SFX)) {
  const f = join(DIR, `${name}.mp3`);
  if (existsSync(f)) continue;
  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
    method: 'POST', headers: { 'xi-api-key': KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ text: s.text, duration_seconds: s.dur, prompt_influence: 0.5 }),
  });
  if (!res.ok) { console.error(`✗ ${name}: ${res.status} ${(await res.text()).slice(0, 200)}`); continue; }
  writeFileSync(f, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${name}`);
}

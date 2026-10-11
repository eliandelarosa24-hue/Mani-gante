// Genera las imágenes de las muestras con Gemini o con OpenAI (ChatGPT) y las guarda como WebP en
// public/muestras/<slug>/img/<archivo>.webp. Las imágenes que ya existen no se vuelven a generar.
//
// Uso:
//   GEMINI_API_KEY=… npm run images -- --sample domos-cielo-austral
//   OPENAI_API_KEY=… npm run images -- --sample all --provider openai --only hero,cierre
//   Opciones: --provider gemini|openai  --sample <slug>|all  --only hero,g1  --force  --dry
//   Modelos (opcional): GEMINI_IMAGE_MODEL (por defecto gemini-2.5-flash-image; también gemini-3-pro-image),
//   OPENAI_IMAGE_MODEL (por defecto gpt-image-1; también gpt-image-2). Ambas APIs cobran por imagen:
//   la cuenta necesita saldo o facturación activa, si no responden 429.
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { SAMPLES } from '../src/samples/data.js';
import { imageSlots } from '../src/samples/image-slots.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(`--${name}`);
const provider = opt('provider', process.env.GEMINI_API_KEY ? 'gemini' : 'openai');
const which = opt('sample', 'all');
const only = opt('only', '')?.split(',').filter(Boolean);
const WIDTH = { '16:9': 1920, '4:3': 1600, '4:5': 1200 };

async function gemini(prompt, ratio) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Falta GEMINI_API_KEY');
  const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: ratio } },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${data.error?.message || JSON.stringify(data).slice(0, 300)}`);
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
  if (!part) throw new Error('Gemini no devolvió imagen: ' + JSON.stringify(data).slice(0, 300));
  return Buffer.from((part.inlineData || part.inline_data).data, 'base64');
}

async function openai(prompt, ratio) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Falta OPENAI_API_KEY');
  const size = ratio === '16:9' || ratio === '4:3' ? '1536x1024' : '1024x1536';
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1', prompt, size, quality: 'high', n: 1 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${data.error?.message || JSON.stringify(data).slice(0, 300)}`);
  return Buffer.from(data.data[0].b64_json, 'base64');
}

const samples = which === 'all' ? SAMPLES : SAMPLES.filter((s) => s.slug === which);
if (!samples.length) { console.error(`No existe la muestra "${which}". Opciones: ${SAMPLES.map((s) => s.slug).join(', ')}`); process.exit(1); }
let made = 0, skipped = 0, failed = 0;
for (const s of samples) {
  const dir = join(root, 'public', 'muestras', s.slug, 'img');
  mkdirSync(dir, { recursive: true });
  for (const slot of imageSlots(s)) {
    if (only.length && !only.includes(slot.file)) continue;
    const out = join(dir, `${slot.file}.webp`);
    if (existsSync(out) && !flag('force')) { skipped++; continue; }
    if (flag('dry')) { console.log(`[${s.slug}] ${slot.file} (${slot.ratio}): ${slot.prompt}`); continue; }
    try {
      process.stdout.write(`[${s.slug}] ${slot.file} … `);
      const raw = provider === 'openai' ? await openai(slot.prompt, slot.ratio) : await gemini(slot.prompt, slot.ratio);
      const [w, h] = slot.ratio.split(':').map(Number);
      const width = WIDTH[slot.ratio] || 1600;
      const img = await sharp(raw).resize(width, Math.round((width * h) / w), { fit: 'cover' }).webp({ quality: 78 }).toBuffer();
      writeFileSync(out, img);
      made++;
      console.log(`listo (${Math.round(img.length / 1024)} KB)`);
    } catch (err) {
      failed++;
      console.log('error');
      console.error('  ' + err.message);
    }
  }
}
console.log(`\nGeneradas: ${made} · ya existían: ${skipped} · con error: ${failed}. Proveedor: ${provider}.`);
if (made) console.log('Ejecute "npm run build" para que las muestras usen las imágenes nuevas.');

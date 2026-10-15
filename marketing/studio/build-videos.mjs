// Arma los Reels (1080×1920, 30 cps, H.264) a partir de las capturas de out/clips/ y los videos del sitio.
// Cada Reel: fondo de marca, la web dentro de un celular (o un marco), textos por escena y cierre con llamada a la acción.
// Van sin música a propósito: la música se agrega en Instagram desde su biblioteca (licenciada) al publicar.
// Uso: node build-videos.mjs [id ...]
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, done, topo, icon, qr, EMBLEM, BRAND as B, C, OUT, BASE, ROOT, SEMANA_DIR } from './lib.mjs';

const W = 1080, H = 1920, FPS = 30, OUTRO = 3.2;
const A = join(BASE, '.video-assets');
const CLIPS = join(OUT, 'clips');
const VID = join(BASE, 'videos');
const ff = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const dur = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

// Dos diseños: la web dentro de un celular, o un video en marco 4:5.
const LAYOUT = {
  phone: { x: 240, y: 470, w: 600, h: 1298, r: 46, bezel: 14 },
  frame: { x: 140, y: 560, w: 800, h: 1000, r: 36, bezel: 10 },
};

const { REELS } = await import(SEMANA_DIR + 'reels.mjs');

// ---------- Recursos gráficos de los videos ----------
async function buildAssets() {
  const p = [];
  const bg = (file, seed) => p.push({ file: `.video-assets/${file}`, w: W, h: H, cls: 'ink2', html: topo(W, H, { seed, opacity: 0.16 }) });
  bg('bg-phone.png', 71); bg('bg-frame.png', 73);
  for (const [k, L] of Object.entries(LAYOUT)) {
    // Máscara de esquinas redondeadas y bisel del celular/marco.
    p.push({ file: `.video-assets/mask-${k}.png`, w: L.w, h: L.h, cls: '', css: 'body,.f{background:#000}', html: `<div style="position:absolute;inset:0;background:#fff;border-radius:${L.r}px"></div>` });
    p.push({ file: `.video-assets/bezel-${k}.png`, w: W, h: H, cls: '', transparent: true, html: `<div style="position:absolute;left:${L.x - L.bezel}px;top:${L.y - L.bezel}px;width:${L.w + 2 * L.bezel}px;height:${L.h + 2 * L.bezel}px;border-radius:${L.r + L.bezel}px;border:${L.bezel}px solid #050806;box-shadow:0 0 0 2px rgba(196,163,90,.45),0 50px 90px rgba(0,0,0,.55)"></div>` });
  }
  for (const [id, R] of Object.entries(REELS)) {
    const L = LAYOUT[R.layout];
    const capTop = R.layout === 'phone' ? 150 : 210, capH = L.y - capTop - 40;
    const cap = (file, html, tag) => p.push({
      file: `.video-assets/${id}/${file}`, w: W, h: H, cls: '', transparent: true,
      html: `<div style="position:absolute;left:70px;right:70px;top:${capTop}px;height:${capH}px;display:flex;align-items:center;justify-content:center;text-align:center">
        <h2 class="serif" style="font-size:72px;line-height:1.06;font-weight:500;text-shadow:0 4px 24px rgba(0,0,0,.5)">${html}</h2></div>
        ${tag ? `<span class="tag" style="left:50%;transform:translateX(-50%);top:${L.y + L.h + 34}px;white-space:nowrap">${tag}</span>` : ''}`,
    });
    R.captions.forEach(([, , html], i) => cap(`cap-${i}.png`, html, R.tag));
    if (R.hookB) cap('cap-0-B.png', R.hookB, R.tag);
    p.push({
      file: `.video-assets/${id}/outro.png`, w: W, h: H, cls: 'ink2',
      html: `${topo(W, H, { seed: 90, opacity: 0.18 })}
        <div style="position:absolute;inset:300px 90px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:44px">
          <img src="${EMBLEM}" style="width:190px;height:190px">
          <div class="eyebrow">${R.outro.eyebrow}</div>
          <h1 class="serif" style="font-size:108px;line-height:1.04;font-weight:500">${R.outro.title}</h1>
          <span class="pill btn" style="font-size:44px;padding:24px 44px">${icon('chat', 50, C.ink, 2)} Escríbame <b>${R.outro.word}</b></span>
          <p style="font-size:42px;font-weight:700">WhatsApp ${B.wa}</p>
          <p style="font-size:32px;font-weight:600;opacity:.75">${R.outro.line || 'Primero ve su portada. Si no le convence, no paga.'}</p>
        </div>`,
    });
  }
  // Fotogramas fijos que se muestran dentro del celular (780×1688, igual que las capturas).
  const scr = (file, cls, html) => p.push({ file: `.video-assets/${file}.png`, w: 780, h: 1688, cls, html });
  const menuQR = await qr('https://redvaeru.netlify.app/muestras/fogon-mapu/', C.ink, '#F2EBDF');
  scr('qr-mesa', 'ink2', `${topo(780, 1688, { seed: 95, opacity: 0.2 })}
    <div style="position:absolute;left:110px;right:110px;top:300px;bottom:330px;background:${C.cream};border-radius:34px;box-shadow:0 40px 80px rgba(0,0,0,.6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;color:${C.ink};padding:40px">
      <p class="eyebrow" style="color:#8a6a2a">Fogón Mapu · Cocina de territorio</p>
      <p class="serif" style="font-size:64px;line-height:1.05;text-align:center">Escanee <em style="color:#8a6a2a">la carta</em></p>
      <img src="${menuQR}" style="width:360px;height:360px">
      <p style="font-size:24px;font-weight:600;opacity:.7;text-align:center">Mesa 4 · carta actualizada hoy</p>
    </div>`);
  await render(p);
}

// ---------- Pantalla: concatena clips y fotogramas fijos al tamaño de la pantalla ----------
function buildScreen(id, R) {
  const L = LAYOUT[R.layout];
  const parts = [];
  R.screen.forEach((s, i) => {
    const f = join(A, id, `part-${i}.mp4`);
    const vf = `scale=${L.w}:${L.h}:force_original_aspect_ratio=increase,crop=${L.w}:${L.h}:(iw-ow)/2:0,fps=${FPS},setsar=1`;
    if (s.still) {
      const n = Math.round(s.dur * FPS), [z0, z1] = s.zoom || [1, 1];
      ff(['-loop', '1', '-i', join(A, `${s.still}.png`), '-t', String(s.dur),
        '-vf', `scale=${L.w * 2}:-1,zoompan=z='${z0}+(${z1}-${z0})*on/${n}':x='iw/2-(iw/zoom/2)':y='ih*0.12*on/${n}':d=${n}:s=${L.w}x${L.h}:fps=${FPS},setsar=1`,
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', f]);
    } else {
      const src = s.clip ? join(CLIPS, s.clip) : join(ROOT, s.src);
      ff([...(s.from ? ['-ss', String(s.from)] : []), ...(s.dur ? ['-t', String(s.dur)] : []), '-i', src, '-an', '-vf', vf, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', f]);
    }
    parts.push(f);
  });
  const out = join(A, id, 'screen.mp4');
  ff([...parts.flatMap((f) => ['-i', f]), '-filter_complex', `${parts.map((_, i) => `[${i}:v]`).join('')}concat=n=${parts.length}:v=1:a=0[v]`, '-map', '[v]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', out]);
  return out;
}

// ---------- Composición final ----------
// Subtítulos de la voz en off (out/voz/<id>.json, generado por voz.mjs): un PNG por bloque de palabras.
async function buildSubs(id, V) {
  const L = LAYOUT[REELS[id].layout];
  await render(V.subs.map((s, i) => ({
    file: `.video-assets/${id}/sub-${i}.png`, w: W, h: H, cls: '', transparent: true,
    html: `<div style="position:absolute;left:60px;right:60px;top:${L.y + 26}px;display:flex;justify-content:center">
      <span style="background:rgba(11,17,14,.86);border:2px solid rgba(196,163,90,.55);border-radius:22px;padding:14px 26px;font:800 50px/1.2 Manrope,sans-serif;color:${C.cream};text-align:center;max-width:900px">${s.text}</span></div>`,
  })));
}

function compose(id, R, variant = '') {
  const L = LAYOUT[R.layout];
  const screen = join(A, id, 'screen.mp4');
  const body = dur(screen), total = body + OUTRO;
  const V = variant === 'voz' ? JSON.parse(readFileSync(join(BASE, 'voz', `${id}.json`), 'utf8')) : null;
  const caps = R.captions.map(([t0, t1], i) => ({ t0, t1: Math.min(t1, body), f: join(A, id, variant === 'B' && i === 0 ? 'cap-0-B.png' : `cap-${i}.png`) }));
  if (V) V.subs.forEach((s, i) => caps.push({ t0: +(s.t0 + V.offset).toFixed(2), t1: +Math.min(s.t1 + V.offset + 0.12, total).toFixed(2), f: join(A, id, `sub-${i}.png`) }));
  const inputs = ['-loop', '1', '-t', String(total), '-i', join(A, `bg-${R.layout}.png`), '-i', screen, '-loop', '1', '-i', join(A, `mask-${R.layout}.png`),
    '-loop', '1', '-t', String(total), '-i', join(A, `bezel-${R.layout}.png`), ...caps.flatMap((c) => ['-loop', '1', '-t', String(total), '-i', c.f]),
    '-loop', '1', '-t', String(total), '-i', join(A, id, 'outro.png'), ...(V ? ['-i', join(BASE, 'voz', `${id}.mp3`)] : ['-f', 'lavfi', '-t', String(total), '-i', 'anullsrc=r=48000:cl=stereo'])];
  const o = 4 + caps.length, a = o + 1;
  let g = `[1:v]tpad=stop_mode=clone:stop_duration=${OUTRO + 1},setpts=PTS-STARTPTS[scr];[2:v]format=gray,scale=${L.w}:${L.h}[m];[scr][m]alphamerge[rs];`
    + `[0:v][rs]overlay=${L.x}:${L.y}:shortest=0[b0];[b0][3:v]overlay=0:0[b1];`;
  caps.forEach((c, i) => { g += `[b${i + 1}][${4 + i}:v]overlay=0:0:enable='between(t,${c.t0},${c.t1})'[b${i + 2}];`; });
  g += `[${o}:v]format=rgba,fade=in:st=${body}:d=0.45:alpha=1[ot];[b${caps.length + 1}][ot]overlay=0:0,fade=in:st=0:d=0.25,format=yuv420p[v]`;
  if (V) g += `;[${a}:a]adelay=${Math.round(V.offset * 1000)}:all=1,apad,atrim=0:${total},aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11[au]`;
  mkdirSync(VID, { recursive: true });
  const out = join(VID, `${R.file}${variant === 'B' ? '_variante-B' : variant === 'voz' ? '_voz' : ''}.mp4`);
  ff([...inputs, '-filter_complex', g, '-map', '[v]', '-map', V ? '[au]' : `${a}:a`, '-t', String(total), '-r', String(FPS),
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '19', '-maxrate', '8M', '-bufsize', '16M', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]);
  console.log(`✓ ${R.file}${variant ? ` (${variant})` : ''} · ${total.toFixed(1)} s`);
}

// --voz: arma solo las versiones con voz en off y subtítulos (requiere out/voz/<id>.json de voz.mjs).
const VOZ = process.argv.includes('--voz');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ids = args.length ? args : Object.keys(REELS);
await buildAssets();
if (VOZ) for (const id of ids) if (existsSync(join(BASE, 'voz', `${id}.json`))) await buildSubs(id, JSON.parse(readFileSync(join(BASE, 'voz', `${id}.json`), 'utf8')));
await done();
for (const id of ids) {
  const R = REELS[id];
  const missing = R.screen.filter((s) => s.clip && !existsSync(join(CLIPS, s.clip)));
  if (missing.length) { console.error(`✗ ${id}: falta ${missing.map((s) => s.clip).join(', ')} (ejecute capture-sites.mjs)`); continue; }
  mkdirSync(join(A, id), { recursive: true });
  if (!existsSync(join(A, id, 'screen.mp4')) || !VOZ) buildScreen(id, R);
  if (VOZ) {
    if (existsSync(join(BASE, 'voz', `${id}.json`))) compose(id, R, 'voz'); else console.error(`✗ ${id}: falta out/voz/${id}.json (ejecute voz.mjs)`);
    continue;
  }
  compose(id, R);
  if (R.hookB) compose(id, R, 'B');
}

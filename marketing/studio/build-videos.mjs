// Arma los Reels (1080×1920, 30 cps, H.264) a partir de las capturas de out/clips/ y los videos del sitio.
// Cada Reel: fondo de marca, la web dentro de un celular (o un marco), textos por escena y cierre con llamada a la acción.
// Van sin música a propósito: la música se agrega en Instagram desde su biblioteca (licenciada) al publicar.
// Uso: node build-videos.mjs [id ...]
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { render, done, topo, icon, asset, EMBLEM, BRAND as B, C, OUT, ROOT } from './lib.mjs';

const W = 1080, H = 1920, FPS = 30, OUTRO = 3.2;
const A = join(OUT, '.video-assets');
const CLIPS = join(OUT, 'clips');
const VID = join(OUT, 'videos');
const ff = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const dur = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

// Dos diseños: la web dentro de un celular, o un video en marco 4:5.
const LAYOUT = {
  phone: { x: 240, y: 470, w: 600, h: 1298, r: 46, bezel: 14 },
  frame: { x: 140, y: 560, w: 800, h: 1000, r: 36, bezel: 10 },
};

const REELS = {
  P02: {
    file: '2026-10-16_1230_P02_reel-miah-y-noah', layout: 'phone',
    screen: [{ clip: 'miah.mp4' }],
    captions: [[0, 2.2, 'Esta cabaña de Curacautín <em>ya no depende solo de Booking</em>'], [2.2, 6, 'Huéspedes que <em>reservan directo</em> por WhatsApp'], [6, 10, 'Sus dos cabañas, <em>con todo el detalle</em>'], [10, 15, 'Galería, ubicación y <em>check&#8209;in en línea</em>']],
    hookB: 'Así se ve la web de <em>una cabaña de Curacautín</em> 👇',
    outro: { eyebrow: 'Caso real · Cabañas Miah y Noah', title: '¿Quiere una <em>así?</em>', word: 'PORTADA' },
  },
  P04: {
    file: '2026-10-17_1130_P04_reel-showreel-muestras', layout: 'frame', tag: 'Muestras de concepto',
    screen: [{ src: 'public/video/reel.mp4' }],
    captions: [[0, 3, '10 ideas de web para <em>el turismo del sur</em>'], [3, 26, '¿Cuál se parece a <em>su negocio?</em> 👇']],
    outro: { eyebrow: 'Comente el número', title: 'Le cuento cómo sería <em>la suya</em>', word: 'PORTADA' },
  },
  P06: {
    file: '2026-10-18_1930_P06_reel-rincon-de-los-poetas', layout: 'phone',
    screen: [{ clip: 'poetas.mp4' }],
    captions: [[0, 3, 'Un hostal con historia <em>en Almagro, Nueva Imperial</em>'], [3, 8, 'Su historia, <em>contada en su propia web</em>'], [8, 15, 'Y un canal directo <em>para reservar</em>']],
    outro: { eyebrow: 'Caso real · El Rincón de los Poetas', title: 'Cada lugar tiene una historia <em>que vende</em>', word: 'PORTADA' },
  },
  R01: {
    file: '2026-10-19_1230_R01_reel-calculadora', layout: 'phone',
    screen: [{ clip: 'calculadora.mp4' }],
    captions: [[0, 1.5, '¿Cuánto le dejó a la plataforma <em>este año?</em>'], [1.5, 7.5, 'Ejemplo: 10 reservas al mes, <em>$90.000, 15%</em>'], [7.5, 11, '$1.620.000 al año <em>en comisiones</em>'], [11, 14, 'Haga la cuenta <em>con sus números</em>']],
    hookB: 'Este número <em>le va a doler</em> (o no)',
    outro: { eyebrow: 'Calculadora gratis', title: 'Calcule la suya o <em>hagámosla juntos</em>', word: 'PORTADA', line: B.site },
  },
  R02: {
    file: '2026-10-21_1230_R02_reel-carta-qr', layout: 'phone',
    screen: [{ still: 'carta-pdf', dur: 3.2, zoom: [1, 2.1] }, { clip: 'fogon-mapu.mp4', from: 0.5, dur: 7 }, { still: 'qr-mesa', dur: 3 }],
    captions: [[0, 3.2, 'Así ve su carta un cliente <em>desde el celular</em> 😬'], [3.2, 10.2, 'Así podría verla <em>(muestra de concepto)</em>'], [10.2, 13.2, 'Un QR por mesa. <em>Usted cambia los precios.</em>']],
    hookB: '¿Todavía imprime la carta <em>cada vez que sube un precio?</em>',
    outro: { eyebrow: 'Restaurantes y cafés', title: `Carta QR <em>${B.carta}</em>`, word: 'CARTA' },
  },
  R03: {
    file: '2026-10-23_1230_R03_reel-antes-y-despues', layout: 'phone',
    screen: [{ still: 'antes', dur: 3.5, zoom: [1, 1.06] }, { clip: 'miah.mp4', dur: 9 }],
    captions: [[0, 3.5, '<em>Antes:</em> solo un aviso en una plataforma'], [3.5, 12.5, '<em>Ahora:</em> su propia web con WhatsApp directo']],
    outro: { eyebrow: 'Caso real · Curacautín', title: '¿Hacemos <em>la suya?</em>', word: 'PORTADA' },
  },
  R04: {
    file: '2026-10-25_1900_R04_reel-glamping', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'domos-cielo-austral.mp4' }],
    captions: [[0, 3, 'Si su glamping tuviera <em>su propia web…</em>'], [3, 8, 'El cielo como <em>protagonista</em>'], [8, 12, 'Sus domos, <em>reservados directo</em>']],
    outro: { eyebrow: 'Glamping, domos y lodges', title: 'Diseño a medida <em>para su lugar</em>', word: 'PORTADA' },
  },
};

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
  const dish = (n, pr) => `<div style="display:flex;justify-content:space-between;font-size:15px;line-height:1.5"><span>${n}</span><span>${pr}</span></div>`;
  scr('carta-pdf', 'paper', `<div style="position:absolute;inset:0;background:#d9d6cf"></div><div style="position:absolute;left:40px;top:120px;width:700px;height:990px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.25);padding:40px 46px;font-family:Georgia,serif;color:#333;filter:blur(.6px)">
    <p style="text-align:center;font-size:30px;letter-spacing:.2em">CARTA</p><p style="text-align:center;font-size:13px;margin:6px 0 22px">Ejemplo genérico · no corresponde a ningún local</p>
    ${['ENTRADAS', 'PLATOS DE FONDO', 'ACOMPAÑAMIENTOS', 'POSTRES', 'BEBIDAS'].map((s, i) => `<p style="font-size:17px;font-weight:bold;margin:16px 0 6px">${s}</p>${[['Empanada de pino', '$2.500'], ['Cazuela de vacuno', '$7.900'], ['Pastel de choclo', '$8.500'], ['Ensalada chilena', '$3.200'], ['Sopaipillas (6)', '$2.000']].slice(0, 3 + (i % 3)).map(([n, pr]) => dish(n, pr)).join('')}`).join('')}
  </div><div style="position:absolute;left:0;right:0;top:0;height:90px;background:#3a3a3a;color:#eee;font:22px sans-serif;display:flex;align-items:center;padding:0 30px">carta_menu_final_v3.pdf</div>`);
  scr('qr-mesa', 'paper', `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#6b4a2f,#3e2a1b)"></div>
    <div style="position:absolute;left:150px;top:420px;width:480px;height:700px;background:${C.cream};border-radius:26px;box-shadow:0 30px 60px rgba(0,0,0,.5);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;color:${C.ink}">
      <p class="serif" style="font-size:46px">Vea nuestra carta</p>
      <div style="width:300px;height:300px;display:grid;place-items:center">${icon('qr', 300, C.ink, 1.2)}</div>
      <p style="font-size:24px;font-weight:600">Escanee con su celular</p></div>`);
  scr('antes', 'paper', `<div style="position:absolute;inset:0;background:#f4f4f4;color:#333;font-family:Manrope">
    <div style="height:110px;background:#9aa3ad"></div>
    <div style="margin:30px;height:470px;border-radius:16px;background:linear-gradient(135deg,#c9ced3,#aeb5bc);display:grid;place-items:center;color:#fff;font-size:30px">Foto</div>
    <div style="margin:0 30px;display:flex;gap:16px">${[1, 2, 3].map(() => '<div style="flex:1;height:150px;border-radius:12px;background:#d5d9dd"></div>').join('')}</div>
    <p style="margin:34px 30px 10px;font-size:38px;font-weight:700">Cabaña en el sur</p>
    <p style="margin:0 30px;font-size:26px;color:#666">Una de muchas opciones en la zona</p>
    <div style="margin:40px 30px;height:24px;width:70%;background:#e2e4e6;border-radius:8px"></div><div style="margin:-20px 30px;height:24px;width:50%;background:#e2e4e6;border-radius:8px"></div>
    <div style="position:absolute;left:30px;right:30px;bottom:60px;height:100px;border-radius:14px;background:#8b949e;color:#fff;display:grid;place-items:center;font-size:32px;font-weight:700">Reservar</div>
    <div style="position:absolute;left:30px;right:30px;top:600px;font-size:22px;color:#999;text-align:center">Ilustración genérica</div></div>`);
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
function compose(id, R, variant = '') {
  const L = LAYOUT[R.layout];
  const screen = join(A, id, 'screen.mp4');
  const body = dur(screen), total = body + OUTRO;
  const caps = R.captions.map(([t0, t1], i) => ({ t0, t1: Math.min(t1, body), f: join(A, id, variant && i === 0 ? 'cap-0-B.png' : `cap-${i}.png`) }));
  const inputs = ['-loop', '1', '-t', String(total), '-i', join(A, `bg-${R.layout}.png`), '-i', screen, '-loop', '1', '-i', join(A, `mask-${R.layout}.png`),
    '-loop', '1', '-t', String(total), '-i', join(A, `bezel-${R.layout}.png`), ...caps.flatMap((c) => ['-loop', '1', '-t', String(total), '-i', c.f]),
    '-loop', '1', '-t', String(total), '-i', join(A, id, 'outro.png'), '-f', 'lavfi', '-t', String(total), '-i', 'anullsrc=r=48000:cl=stereo'];
  const o = 4 + caps.length, a = o + 1;
  let g = `[1:v]tpad=stop_mode=clone:stop_duration=${OUTRO + 1},setpts=PTS-STARTPTS[scr];[2:v]format=gray,scale=${L.w}:${L.h}[m];[scr][m]alphamerge[rs];`
    + `[0:v][rs]overlay=${L.x}:${L.y}:shortest=0[b0];[b0][3:v]overlay=0:0[b1];`;
  caps.forEach((c, i) => { g += `[b${i + 1}][${4 + i}:v]overlay=0:0:enable='between(t,${c.t0},${c.t1})'[b${i + 2}];`; });
  g += `[${o}:v]format=rgba,fade=in:st=${body}:d=0.45:alpha=1[ot];[b${caps.length + 1}][ot]overlay=0:0,fade=in:st=0:d=0.25,format=yuv420p[v]`;
  mkdirSync(VID, { recursive: true });
  const out = join(VID, `${R.file}${variant ? '_variante-B' : ''}.mp4`);
  ff([...inputs, '-filter_complex', g, '-map', '[v]', '-map', `${a}:a`, '-t', String(total), '-r', String(FPS),
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '19', '-maxrate', '8M', '-bufsize', '16M', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]);
  console.log(`✓ ${R.file}${variant ? ' (B)' : ''} · ${total.toFixed(1)} s`);
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(REELS);
await buildAssets();
await done();
for (const id of ids) {
  const R = REELS[id];
  const missing = R.screen.filter((s) => s.clip && !existsSync(join(CLIPS, s.clip)));
  if (missing.length) { console.error(`✗ ${id}: falta ${missing.map((s) => s.clip).join(', ')} (ejecute capture-sites.mjs)`); continue; }
  mkdirSync(join(A, id), { recursive: true });
  buildScreen(id, R);
  compose(id, R);
  if (R.hookB) compose(id, R, 'B');
}

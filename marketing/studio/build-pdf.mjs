// Agenda de publicación en PDF para usar sin internet (formato pensado para leer en el celular).
// Uso: node build-pdf.mjs  →  out/Agenda-Red-Vaeru-semana-1.pdf
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PIECES, fbText } from './manifest.mjs';
import { BASE_CSS, EMBLEM, OUT, BRAND as B, C } from './lib.mjs';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const label = (iso) => { const d = new Date(iso + 'T12:00:00'); const s = `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`; return s[0].toUpperCase() + s.slice(1); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const name = (f) => f.split('/').pop();
const folder = (p) => { const d = new Date(p.day + 'T12:00:00'); return `${p.day}_${['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][d.getDay()]}/${p.time.replace(':', '')}_${p.id}`; };

// Miniatura liviana (JPG de 220 px) como data URI.
function thumb(f) {
  let src = join(OUT, f);
  if (f.endsWith('.mp4')) return null;
  if (!existsSync(src)) return null;
  const buf = execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-i', src, '-vf', 'scale=220:-1', '-q:v', '5', '-f', 'mjpeg', 'pipe:1']);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

const byDay = {};
for (const p of PIECES) (byDay[p.day] ||= []).push(p);

const piece = (p) => {
  const imgs = p.files.filter((f) => !f.endsWith('.mp4')).slice(0, 6).map(thumb).filter(Boolean);
  const vids = [...(p.filesVoz || []), ...p.files.filter((f) => f.endsWith('.mp4'))];
  const times = p.fbTime && p.where.includes('Facebook') ? `${p.time} Instagram · ${p.fbTime} Facebook` : p.time;
  const texts = !p.ig ? '' : (p.noFb || !p.where.includes('Facebook'))
    ? `<h4>Texto</h4><pre>${esc(p.ig)}</pre>`
    : `<h4>Texto Instagram</h4><pre>${esc(p.ig)}</pre><h4>Texto Facebook</h4><pre>${esc(fbText(p))}</pre>`;
  return `<section class="piece">
    <div class="head"><span class="time">${esc(times)}</span><span class="box">☐ Publicado</span></div>
    <p class="meta"><b>${p.id}</b> · ${esc(p.format)} · ${esc(p.where.join(' · '))}</p>
    <h3>${esc(p.title)}</h3>
    ${imgs.length ? `<div class="thumbs">${imgs.map((s) => `<img src="${s}">`).join('')}</div>` : ''}
    <p class="files">📁 Carpeta: <b>${esc(folder(p))}</b>${vids.length ? `<br>🎬 ${vids.map((v) => esc(name(v))).join('<br>🎬 ')}` : ''}${p.filesB ? '<br>🅱 Variante B en la subcarpeta «variante-B»' : ''}</p>
    ${p.notes ? `<p class="note">${esc(p.notes)}</p>` : ''}
    ${texts}
  </section>`;
};

const css = `${BASE_CSS}
@page{size:110mm 200mm;margin:8mm 0}
@page:first{margin:0}
body{font-family:Manrope,sans-serif;color:${C.ink};font-size:9.5pt;line-height:1.45;background:#fff}
.cover{height:200mm;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:5mm;page-break-after:always;background:${C.ink};color:${C.cream};padding:12mm}
.index,.day{padding:0 8mm}
.cover img{width:28mm}
.cover h1{font-family:Fraunces,serif;font-weight:500;font-size:26pt;line-height:1.05}
.cover h1 em{color:${C.gold}}
.cover p{font-size:9.5pt;opacity:.9}
.eyebrow{font-size:7pt;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:#8a6a2a}
.cover .eyebrow{color:${C.gold}}
.index{page-break-after:always}
.index h2,.day h2{font-family:Fraunces,serif;font-weight:500;font-size:17pt;margin:0 0 3mm}
.index table{width:100%;border-collapse:collapse;font-size:8pt}
.index td{border-bottom:.3mm solid #e4dccd;padding:1.4mm 1mm;vertical-align:top}
.index td:first-child{white-space:nowrap;font-weight:700;color:#8a6a2a}
.rules{margin-top:4mm;font-size:8pt;display:grid;gap:1.5mm}
.rules p{border-left:.8mm solid ${C.gold};padding-left:2mm}
.day{page-break-before:always}
.piece{border:.3mm solid #e4dccd;border-radius:3mm;padding:3mm;margin-bottom:4mm}
.head,.meta,h3,.thumbs{break-after:avoid}
.head{display:flex;justify-content:space-between;align-items:center;gap:2mm}
.time{font-family:Fraunces,serif;font-size:12pt;font-weight:600;color:#8a6a2a}
.box{font-size:8pt;font-weight:700;border:.3mm solid ${C.ink};border-radius:1.5mm;padding:.6mm 1.6mm}
.meta{font-size:7.5pt;color:#555;margin-top:1mm}
h3{font-family:Fraunces,serif;font-weight:500;font-size:12pt;margin:1mm 0 2mm}
h4{font-size:7pt;letter-spacing:.12em;text-transform:uppercase;color:#8a6a2a;margin:2.5mm 0 1mm}
.thumbs{display:flex;gap:1.5mm;flex-wrap:wrap;margin-bottom:2mm}
.thumbs img{width:14mm;border-radius:1mm;border:.2mm solid #ddd}
.files{font-size:7.5pt;color:#333;background:#f6f1e7;border-radius:1.5mm;padding:1.6mm 2mm;word-break:break-word}
.note{font-size:8pt;background:#fbf3df;border-radius:1.5mm;padding:1.6mm 2mm;margin-top:2mm}
pre{white-space:pre-wrap;word-break:break-word;font-family:Manrope,sans-serif;font-size:8.5pt;background:#fafafa;border-radius:1.5mm;padding:2mm;margin:0}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="cover"><img src="${EMBLEM}"><span class="eyebrow">Red Vaeru · campaña «Su web lista antes del verano»</span>
<h1>Agenda de contenido <em>15 al 25 de octubre</em></h1>
<p>Todo lo que hay que publicar, día por día, con los textos listos para copiar. Funciona sin internet. Horas de Chile continental.</p>
<p>WhatsApp ${B.wa} · ${B.site}</p></div>
<div class="index"><h2>Resumen de la semana</h2><table>
${Object.entries(byDay).map(([d, ps]) => ps.map((p, i) => `<tr><td>${i ? '' : esc(label(d))}</td><td>${p.time}</td><td>${esc(p.title)} <span style="color:#777">(${esc(p.where.join(', '))})</span></td></tr>`).join('')).join('')}
</table>
<div class="rules">
<p>Los archivos están en el ZIP del día, en la carpeta que indica cada publicación.</p>
<p>Reels: use la versión <b>_voz.mp4</b> (voz y subtítulos) o la versión sin voz. Agregue música suave desde la biblioteca de Instagram.</p>
<p>Muestras de concepto: siempre se presentan como muestras, nunca como clientes.</p>
<p>Historias de cupos: publique solo la imagen con el número real de cupos.</p>
<p>Facebook: suba la imagen o el video directamente, no lo comparta desde Instagram.</p>
</div></div>
${Object.entries(byDay).map(([d, ps]) => `<div class="day"><span class="eyebrow">${d < '2026-10-19' ? 'Preparación' : 'Semana de campaña'}</span><h2>${esc(label(d))}</h2>${ps.map(piece).join('')}</div>`).join('')}
</body></html>`;

const browser = await chromium.launch({ executablePath: existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const out = join(OUT, 'Agenda-Red-Vaeru-semana-1.pdf');
await page.pdf({ path: out, width: '110mm', height: '200mm', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('✓', out, (readFileSync(out).length / 1e6).toFixed(1), 'MB');

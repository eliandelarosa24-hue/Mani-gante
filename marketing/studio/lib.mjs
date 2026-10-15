// Piezas comunes del estudio: marca, fondos, íconos y renderizado HTML → PNG.
import { chromium } from 'playwright';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import QRCode from 'qrcode';

const here = (p) => new URL(p, import.meta.url).pathname;
export const ROOT = here('../../');
export const OUT = here('./out/');
// Semana activa (variable de entorno SEMANA, por defecto 1): contenido en semanas/semana-N, salida en out/semana-N.
export const SEMANA = process.env.SEMANA || '1';
export const BASE = here(`./out/semana-${SEMANA}/`);
export const SEMANA_DIR = here(`./semanas/semana-${SEMANA}/`);

// Datos comerciales vigentes (fuente: src/pricing.js y docs/marketing/03-campana-semana-1.md).
export const BRAND = {
  name: 'Red Vaeru',
  site: 'redvaeru.netlify.app',
  wa: '+56 9 5228 9117',
  waLink: 'https://wa.me/56952289117',
  carta: '$49.000',
  esencial: '$59.000',
  esencialNormal: '$149.000',
  temporada: '$199.000',
  cupos: 5,
  cuposTemporada: 3,
};

export const C = {
  ink: '#0B110E', ink2: '#111A15', ink3: '#1A2620', cream: '#F2EBDF', paper: '#E9DFCF',
  gold: '#C4A35A', gold2: '#E3C98A', palm: '#3D5C4A', sea: '#2A8C86',
};

const fontsDir = here('./node_modules/@fontsource/');
const fontFace = (fam, file, weight, style = 'normal') =>
  `@font-face{font-family:'${fam}';src:url('data:font/woff2;base64,${readFileSync(fontsDir + file).toString('base64')}') format('woff2');font-weight:${weight};font-style:${style};font-display:block}`;
const FONTS = [
  ...[400, 500, 600, 700].map((w) => fontFace('Fraunces', `fraunces/files/fraunces-latin-${w}-normal.woff2`, w)),
  ...[400, 500].map((w) => fontFace('Fraunces', `fraunces/files/fraunces-latin-${w}-italic.woff2`, w, 'italic')),
  ...[400, 500, 600, 700, 800].map((w) => fontFace('Manrope', `manrope/files/manrope-latin-${w}-normal.woff2`, w)),
].join('');

// Las páginas se cargan con setContent (about:blank), que no puede leer file://: todo va como data URI.
const MIME = { png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' };
const cache = new Map();
export const asset = (rel) => {
  if (!cache.has(rel)) cache.set(rel, `data:${MIME[rel.split('.').pop()]};base64,${readFileSync(join(ROOT, rel)).toString('base64')}`);
  return cache.get(rel);
};
export const EMBLEM = asset('public/brand/emblema-512.png');

// Curvas de nivel (el territorio): anillos deformados alrededor de 2 centros.
export function topo(w, h, { color = C.gold, opacity = 0.22, seed = 1, rings = 22, centers } = {}) {
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const cs = centers || [[w * (0.2 + rnd() * 0.25), h * (0.25 + rnd() * 0.2)], [w * (0.65 + rnd() * 0.25), h * (0.65 + rnd() * 0.2)]];
  const step = Math.max(w, h) / (rings * 1.1);
  let paths = '';
  cs.forEach(([cx, cy], ci) => {
    const p1 = rnd() * 6, p2 = rnd() * 6, p3 = rnd() * 6;
    for (let i = 1; i <= rings; i++) {
      const base = i * step * (0.8 + ci * 0.15);
      let d = '';
      for (let a = 0; a <= 120; a++) {
        const t = (a / 120) * Math.PI * 2;
        const r = base * (1 + 0.16 * Math.sin(3 * t + p1 + i * 0.07) + 0.09 * Math.sin(5 * t + p2) + 0.05 * Math.sin(2 * t + p3 + i * 0.13));
        d += `${a ? 'L' : 'M'}${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * 0.82 * Math.sin(t)).toFixed(1)}`;
      }
      paths += `<path d="${d}Z"/>`;
    }
  });
  return `<svg class="topo" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.6">${paths}</g></svg>`;
}

// Íconos de línea simples (sin logotipos de marcas).
const I = {
  home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  fork: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M16 3c-2 2-2 6 0 8v10"/>',
  check: '<path d="M4 12l5 5 11-11"/>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 17l-6-5-8 7"/>',
  doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.7M12 17h.01"/>',
  tree: '<path d="M12 3l6 8h-3l4 6H5l4-6H6zM12 17v4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2M14 18h2v2M18 18h2v2"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
};
export const icon = (name, size = 64, color = C.gold, stroke = 1.6) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${I[name]}</svg>`;

export async function qr(text, dark = C.ink, light = '#00000000') {
  return QRCode.toDataURL(text, { margin: 0, width: 600, color: { dark, light } });
}

// CSS de base para todas las piezas.
export const BASE_CSS = `${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent}
.f{position:relative;overflow:hidden;font-family:Manrope,sans-serif;color:${C.cream};-webkit-font-smoothing:antialiased}
.ink{background:${C.ink}} .ink2{background:radial-gradient(120% 80% at 20% 0%,${C.ink3} 0%,${C.ink} 60%)}
.cream{background:${C.cream};color:${C.ink}} .paper{background:${C.paper};color:${C.ink}}
.topo{position:absolute;inset:0;pointer-events:none}
.serif{font-family:Fraunces,serif;font-optical-sizing:auto;letter-spacing:-.01em}
.gold{color:${C.gold}} .gold2{color:${C.gold2}} em{font-style:italic;color:${C.gold}}
.cream em,.paper em{color:#8a6a2a}
.eyebrow{font-family:Manrope;font-weight:700;letter-spacing:.18em;text-transform:uppercase;font-size:26px;color:${C.gold}}
.cream .eyebrow,.paper .eyebrow{color:#8a6a2a}
.pill{display:inline-flex;align-items:center;gap:14px;border-radius:999px;padding:18px 34px;font-weight:700}
.btn{background:${C.gold};color:${C.ink};font-size:34px}
.tag{position:absolute;border:2px solid ${C.gold};color:${C.gold2};background:rgba(11,17,14,.72);border-radius:999px;padding:10px 24px;font-weight:700;font-size:24px;letter-spacing:.06em;text-transform:uppercase}
.emb{position:absolute;width:76px;height:76px;object-fit:contain}
.foot{position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;align-items:center;font-size:24px;font-weight:600;opacity:.85}
.dots{display:flex;gap:10px}.dots i{width:12px;height:12px;border-radius:50%;background:currentColor;opacity:.3}.dots i.on{opacity:1;background:${C.gold}}
.strike{text-decoration:line-through;text-decoration-thickness:3px;opacity:.6}
.card{background:rgba(242,235,223,.06);border:1.5px solid rgba(196,163,90,.45);border-radius:28px}
.cream .card,.paper .card{background:rgba(255,255,255,.55);border-color:rgba(138,106,42,.35)}
.phone{position:relative;border-radius:56px;background:#050806;padding:14px;box-shadow:0 40px 80px rgba(0,0,0,.45),0 0 0 2px rgba(196,163,90,.35)}
.phone img{display:block;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:44px}
`;

export const dots = (n, total) => `<div class="dots">${Array.from({ length: total }, (_, i) => `<i class="${i === n ? 'on' : ''}"></i>`).join('')}</div>`;
export const footer = (left = `WhatsApp ${BRAND.wa}`, right = BRAND.site) =>
  `<div class="foot"><span>${left}</span><span>${right}</span></div>`;

let browser;
export async function render(pieces) {
  browser ||= await chromium.launch({ executablePath: existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined });
  const page = await browser.newPage();
  for (const p of pieces) {
    await page.setViewportSize({ width: p.w, height: p.h });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}${p.css || ''}</style></head><body><div class="f ${p.cls ?? 'ink'}" style="width:${p.w}px;height:${p.h}px">${p.html}</div></body></html>`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const file = join(BASE, p.file);
    mkdirSync(dirname(file), { recursive: true });
    await page.screenshot({ path: file, omitBackground: !!p.transparent, clip: { x: 0, y: 0, width: p.w, height: p.h } });
    console.log('✓', p.file);
  }
  await page.close();
}
export async function done() { await browser?.close(); browser = null; }
export const exists = (rel) => existsSync(join(ROOT, rel));
export const read = (rel) => readFileSync(join(ROOT, rel));

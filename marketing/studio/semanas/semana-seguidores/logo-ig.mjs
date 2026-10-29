// Foto de perfil de Instagram con la identidad nueva (la función de cine): el emblema de Red Vaeru
// (palma del Caribe + araucaria del sur, anillos norte y sur) bajo la luz del proyector.
// Tres propuestas 1080 × 1080 y una vista de cómo se ven en el círculo de Instagram.
// Uso: SEMANA=seguidores node semanas/semana-seguidores/logo-ig.mjs <ruta a emblema.svg>
import { readFileSync } from 'node:fs';
import { render, done } from '../../lib.mjs';

const svg = readFileSync(process.argv[2], 'utf8');
// Trazos un poco más gruesos que en el sitio: en el círculo chico del feed (≈ 32 px) las líneas finas desaparecen.
const inner = svg.replace(/^[\s\S]*?<\/style>/, '').replace(/<\/svg>\s*$/, '').replace('stroke-width="2.6"', 'stroke-width="3.6"').replace('stroke-width="2.4"', 'stroke-width="3.4"');
const emblem = (color, size) => `<svg viewBox="0 0 120 120" width="${size}" height="${size}" style="color:${color};display:block">${inner}</svg>`;

const BONE = '#ece5d8', RED = '#dc6b77', DEEP = '#962336', NIGHT = '#2b0a11', W950 = '#16070a';
const S = 1080;
const base = (bg, body) => ({ w: S, h: S, cls: '', html: `<div style="position:absolute;inset:0;${bg}"></div>${body}` });
const center = (html) => `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${html}</div>`;

const OPTS = {
  // A · Foco: el emblema iluminado por el haz del proyector, sobre vino de sala de cine.
  foco: base(`background:radial-gradient(60% 60% at 50% 38%,#7a2333 0%,${NIGHT} 55%,${W950} 100%)`,
    `<div style="position:absolute;left:50%;top:-10%;width:900px;height:900px;transform:translateX(-50%);background:radial-gradient(closest-side,rgba(255,196,140,.32),transparent 70%)"></div>
     ${center(emblem(BONE, 720))}`),
  // B · Lente: el emblema dentro de un aro con marcas, como el lente o el carrete de una película.
  lente: base(`background:${W950}`,
    `${center(`<svg width="960" height="960" viewBox="0 0 960 960" style="position:absolute"><circle cx="480" cy="480" r="430" fill="none" stroke="${RED}" stroke-width="16"/>${Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2, r1 = 452, r2 = i % 4 ? 466 : 478; return `<line x1="${480 + Math.cos(a) * r1}" y1="${480 + Math.sin(a) * r1}" x2="${480 + Math.cos(a) * r2}" y2="${480 + Math.sin(a) * r2}" stroke="${RED}" stroke-width="${i % 4 ? 4 : 7}" stroke-linecap="round"/>`; }).join('')}</svg>`)}
     ${center(emblem(BONE, 640))}`),
  // C · Sello: rojo pleno con el emblema en hueso; la versión más legible en tamaño chico.
  sello: base(`background:radial-gradient(75% 75% at 50% 35%,#b0303f,${DEEP} 60%,#6e1424)`,
    center(emblem(BONE, 760))),
};

const pieces = Object.entries(OPTS).map(([k, p]) => ({ ...p, file: `logo-ig/RedVaeru_perfil_${k}.png` }));
await render(pieces);

// Vista previa: las tres como se ven en el perfil (círculo grande) y en el feed (círculo chico).
const { asset } = await import('../../lib.mjs');
const img = (k) => asset(`marketing/studio/out/semana-seguidores/logo-ig/RedVaeru_perfil_${k}.png`);
const names = { foco: 'A · Foco', lente: 'B · Lente', sello: 'C · Sello' };
await render([{
  file: 'logo-ig/vista-previa.png', w: 1500, h: 720, cls: '',
  html: `<div style="position:absolute;inset:0;background:#fff"></div>
  <div style="position:absolute;inset:60px 40px;display:flex;justify-content:space-around">${Object.keys(OPTS).map((k) => `<div style="display:flex;flex-direction:column;align-items:center;gap:26px;font:700 34px Manrope;color:#111">
    <img src="${img(k)}" style="width:330px;height:330px;border-radius:50%;box-shadow:0 0 0 1px #ddd">
    <div style="display:flex;align-items:center;gap:20px"><img src="${img(k)}" style="width:110px;height:110px;border-radius:50%"><img src="${img(k)}" style="width:56px;height:56px;border-radius:50%"><span style="font:600 26px Manrope">redvaeru</span></div>
    <span>${names[k]}</span></div>`).join('')}</div>`,
}]);
await done();

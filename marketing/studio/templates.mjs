// Plantillas de la marca Red Vaeru: todas las piezas usan estas funciones para mantener el mismo estilo.
// kit(add) entrega las plantillas conectadas a la lista de piezas de una semana.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { topo, icon, qr, dots, asset, EMBLEM, BRAND as B, C } from './lib.mjs';

// ---------- Capa de personalidad (v2): la misma gramática visual de los Reels ----------
// Stickers con sombra dura, notas escritas a mano (Caveat), resaltado de plumón en <em>, garabatos,
// fotos reales en polaroid con cinta, grano de papel y la firma de Jorge. Todo opcional por pieza.
const caveat = (w) => `@font-face{font-family:Hand;src:url('data:font/woff2;base64,${readFileSync(new URL(`./node_modules/@fontsource/caveat/files/caveat-latin-${w}-normal.woff2`, import.meta.url)).toString('base64')}') format('woff2');font-weight:${w}}`;
const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>')}`;
export const PERSONA_CSS = `${caveat(600)}${caveat(700)}
@font-face{font-family:Emoji;src:local('Noto Color Emoji')}
.f{font-family:Manrope,Emoji,sans-serif}
.grain{position:absolute;inset:0;background-image:url("${GRAIN}");opacity:.16;mix-blend-mode:overlay;pointer-events:none;z-index:50}
.glow{position:absolute;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side,rgba(196,163,90,.22),transparent);pointer-events:none}
.cream .glow,.paper .glow{background:radial-gradient(closest-side,rgba(196,163,90,.28),transparent)}
.f .eyebrow{display:inline-block;align-self:flex-start;background:${C.gold};color:${C.ink};letter-spacing:.08em;font-size:28px;font-weight:800;padding:12px 22px 11px;border-radius:12px;transform:rotate(-2deg);box-shadow:0 7px 0 rgba(0,0,0,.28)}
.cream .eyebrow,.paper .eyebrow{background:${C.ink};color:${C.gold2}}
.f h1 em{font-style:italic;background:linear-gradient(180deg,transparent 60%,rgba(196,163,90,.34) 60%,rgba(196,163,90,.34) 90%,transparent 90%);-webkit-box-decoration-break:clone;box-decoration-break:clone;padding:0 .08em}
.cream h1 em,.paper h1 em{background:linear-gradient(180deg,transparent 58%,rgba(227,201,138,.85) 58%,rgba(227,201,138,.85) 92%,transparent 92%);color:${C.ink}}
.hand{position:absolute;font-family:Hand;font-weight:700;color:${C.gold2};line-height:1;white-space:nowrap;z-index:20}
.cream .hand,.paper .hand{color:#8a6a2a}
.stk{position:absolute;display:inline-block;background:#fff;color:${C.ink};font-family:Manrope,Emoji;font-weight:800;padding:16px 28px;border-radius:20px;white-space:nowrap;box-shadow:0 9px 0 rgba(0,0,0,.2),0 18px 36px rgba(0,0,0,.3);z-index:20}
.stk.gold{background:${C.gold}}.stk.ink{background:${C.ink};color:${C.cream};border:3px solid ${C.gold}}.stk.round{border-radius:999px}
.emo{position:absolute;font-family:Emoji;line-height:1;filter:drop-shadow(0 12px 16px rgba(0,0,0,.35));z-index:20}
.pola{position:absolute;background:#fbf8f2;padding:18px 18px 74px;box-shadow:0 22px 48px rgba(0,0,0,.42);z-index:10}
.pola img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.pola .cap{position:absolute;left:0;right:0;bottom:16px;text-align:center;font-family:Hand;font-weight:700;font-size:44px;color:${C.ink}}
.pola::before{content:'';position:absolute;top:-22px;left:50%;width:170px;height:46px;margin-left:-85px;background:rgba(233,223,207,.78);transform:rotate(-4deg);box-shadow:0 2px 6px rgba(0,0,0,.15)}
.ph2{position:absolute;border-radius:52px;background:#050806;padding:13px;box-shadow:0 34px 70px rgba(0,0,0,.5),0 0 0 2px rgba(196,163,90,.4);z-index:10}
.ph2 img{display:block;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:40px}
.doodle{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:15}
.doodle path{fill:none;stroke:${C.gold2};stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.cream .doodle path,.paper .doodle path{stroke:#8a6a2a}
.bignum{position:absolute;font-family:Fraunces;font-style:italic;font-weight:600;line-height:.8;color:transparent;-webkit-text-stroke:3px rgba(196,163,90,.42);pointer-events:none}
.cream .bignum,.paper .bignum{-webkit-text-stroke:3px rgba(138,106,42,.35)}
.sign{position:absolute;display:flex;align-items:center;gap:16px;font-family:Hand;font-weight:700;font-size:50px;color:${C.gold2};transform:rotate(-3deg);z-index:20}
.cream .sign,.paper .sign{color:#8a6a2a}
.sign img{width:62px;height:62px}
`;
// Trazos a mano en coordenadas del lienzo.
const wob = (i, a) => Math.sin(i * 12.9898 + a * 78.233) * 0.5;
const circ = (cx, cy, rx, ry) => { const p = []; for (let i = 0; i <= 40; i++) { const a = -0.4 + (i / 40) * Math.PI * 2.15, k = 1 + wob(i, 1) * 0.06; p.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`); } return `M${p.join(' L')}`; };
const arr = (x1, y1, x2, y2, bend = 0.25) => { const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend, an = Math.atan2(y2 - my, x2 - mx), h = 40; return `M${x1},${y1} Q${mx},${my} ${x2},${y2} M${(x2 - h * Math.cos(an - 0.5)).toFixed(1)},${(y2 - h * Math.sin(an - 0.5)).toFixed(1)} L${x2},${y2} L${(x2 - h * Math.cos(an + 0.5)).toFixed(1)},${(y2 - h * Math.sin(an + 0.5)).toFixed(1)}`; };
const und = (x, y, w) => `M${x},${y} ` + Array.from({ length: 7 }, (_, i) => `Q${x + (i + 0.5) * (w / 7)},${y + (i % 2 ? 9 : -9)} ${x + (i + 1) * (w / 7)},${y}`).join(' ');
export const doodle = (w, h, list) => `<svg class="doodle" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${list.map((d) => `<path d="${d.circle ? circ(...d.circle) : d.arrow ? arr(...d.arrow) : und(...d.under)}"/>`).join('')}</svg>`;
// Decoración libre de una pieza: deco = [{hand|stk|emo|pola|phone|sign|draw}, ...] con x, y (px) y rot.
export function deco(list = [], w, h) {
  const pos = (d) => `left:${d.x}px;top:${d.y}px;transform:rotate(${d.rot ?? 0}deg)`;
  const draws = list.filter((d) => d.draw).map((d) => d.draw);
  return list.map((d) => {
    if (d.hand) return `<div class="hand" style="${pos(d)};font-size:${d.size || 56}px">${d.hand}</div>`;
    if (d.stk) return `<div class="stk ${d.tone || ''}" style="${pos(d)};font-size:${d.size || 36}px${d.w ? `;white-space:normal;width:${d.w}px;line-height:1.25` : ''}">${d.stk}</div>`;
    if (d.emo) return `<div class="emo" style="${pos(d)};font-size:${d.size || 120}px">${d.emo}</div>`;
    if (d.pola) return `<div class="pola" style="${pos(d)};width:${d.w || 420}px;height:${d.h || 420}px"><img src="${d.pola}" style="object-position:${d.op || 'center'}">${d.cap ? `<div class="cap">${d.cap}</div>` : ''}</div>`;
    if (d.phone) return `<div class="ph2" style="${pos(d)};width:${d.w || 360}px;height:${Math.round((d.w || 360) * 2.05)}px"><img src="${d.phone}"></div>`;
    if (d.sign) return `<div class="sign" style="left:${d.x}px;top:${d.y}px"><img src="${EMBLEM}">${d.sign === true ? '— Jorge, Red Vaeru' : d.sign}</div>`;
    return '';
  }).join('') + (draws.length ? doodle(w, h, draws) : '');
}
const deslice = (w) => `<div class="stk gold round" style="right:70px;bottom:120px;transform:rotate(-4deg);font-size:34px">Deslice 👉</div>`;
const bignum = (eyebrow, w, h) => { const m = /^(?:\D*?)(\d+)(?: de \d+)?$/.exec(eyebrow || ''); return m && /\b(de|Error|Compromiso|Pregunta)\b/.test(eyebrow) ? `<div class="bignum" style="right:40px;bottom:90px;font-size:520px">${m[1]}</div>` : ''; };


export async function kit(add0) {
const add = (p) => add0({ ...p, css: PERSONA_CSS + (p.css || ''), html: p.html + (p.noGrain ? '' : '<div class="grain"></div>') });
const W = 1080, H = 1350, SH = 1920;
const waQR = await qr(B.waLink, C.ink, '#F2EBDF');
const waQRgold = await qr(B.waLink, C.ink, '#E3C98A');
const cartaQR = await qr('https://redvaeru.netlify.app/muestras/fogon-mapu/', C.ink, '#ffffff');
// ---------- Plantillas ----------
// Lámina de feed 4:5 genérica.
function slide({ file, cls = 'ink', seed = 1, eyebrow = '', title = '', body = '', extra = '', n = 0, total = 1, align = 'start', titleSize = 92, topoOn = cls.startsWith('ink'), foot = true, deco: d = [], inset = '150px 80px 150px', bg = '', bgPos = 'center', sign, swipe = n === 0 && total > 1, num = true }) {
  const isCta = /class="pill btn|width:220px;height:220px/.test(extra);
  const swipeOn = swipe && !/Deslice/.test(JSON.stringify(d));
  body = swipeOn ? body.replace(/\s*Deslice →\s*$/, '') : body;
  add({
    file, w: W, h: H, cls,
    html: `${bg ? `<img src="${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${bgPos}"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,17,14,.25),rgba(11,17,14,.92) 62%)"></div>` : topoOn ? topo(W, H, { seed, opacity: 0.14 }) : ''}
      <div class="glow" style="left:${(seed * 137) % 500 - 300}px;top:${(seed * 89) % 600 - 350}px"></div>
      ${num ? bignum(eyebrow) : ''}
      <img class="emb" src="${EMBLEM}" style="top:64px;right:72px;z-index:30">
      <div style="position:absolute;inset:${inset};display:flex;flex-direction:column;justify-content:${align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start'};gap:36px;z-index:12">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        ${title ? `<h1 class="serif" style="font-size:${titleSize}px;line-height:1.04;font-weight:500">${title}</h1>` : ''}
        ${body ? `<p style="font-size:40px;line-height:1.4;font-weight:500;opacity:.92">${body}</p>` : ''}
        ${extra}
      </div>
      ${deco(d, W, H)}
      ${swipeOn ? deslice() : ''}
      ${(sign ?? isCta) ? deco([{ sign: sign || true, x: 80, y: H - 210 }], W, H) : ''}
      ${foot ? `<div class="foot" style="z-index:30">${total > 1 ? dots(n, total) : `<span>WhatsApp ${B.wa}</span>`}<span>${B.site}</span></div>` : ''}`,
  });
}
// Historia 9:16 genérica (zona segura: 250 px arriba y abajo).
function story({ file, cls = 'ink2', seed = 3, eyebrow = '', title = '', body = '', extra = '', titleSize = 104, center = true, deco: d = [], inset = '400px 80px 300px', bg = '', bgPos = 'center', sign }) {
  const isCta = /class="pill btn/.test(extra);
  add({
    file, w: W, h: SH, cls,
    html: `${bg ? `<img src="${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${bgPos}"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,17,14,.2),rgba(11,17,14,.9) 60%)"></div>` : cls.startsWith('ink') ? topo(W, SH, { seed, opacity: 0.13 }) : ''}
      <div class="glow" style="left:${(seed * 137) % 500 - 250}px;top:${(seed * 89) % 900 - 200}px"></div>
      <img class="emb" src="${EMBLEM}" style="top:250px;left:80px;width:90px;height:90px;z-index:30">
      <div style="position:absolute;inset:${inset};display:flex;flex-direction:column;justify-content:${center ? 'center' : 'flex-start'};gap:44px;z-index:12">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        ${title ? `<h1 class="serif" style="font-size:${titleSize}px;line-height:1.05;font-weight:500">${title}</h1>` : ''}
        ${body ? `<p style="font-size:46px;line-height:1.4;font-weight:500;opacity:.92">${body}</p>` : ''}
        ${extra}
      </div>
      ${deco(d, W, SH)}
      ${(sign ?? isCta) ? deco([{ sign: sign || true, x: 80, y: SH - 330 }], W, SH) : ''}`,
  });
}
const cta = (word = 'PORTADA', label = 'Escríbame') => `<div><span class="pill btn">${icon('chat', 40, C.ink, 2)} ${label} <b>${word}</b></span></div>`;
const phone = (src, w = 330, rot = 0) => `<div class="phone" style="width:${w}px;height:${Math.round(w * 2.16)}px;transform:rotate(${rot}deg)"><img src="${src}"></div>`;
const list = (items, color = C.gold, fs = 38) => `<ul style="list-style:none;display:flex;flex-direction:column;gap:22px">${items.map((t) => `<li style="display:flex;gap:20px;align-items:flex-start;font-size:${fs}px;line-height:1.3;font-weight:500"><span style="flex:none;margin-top:4px">${icon('check', 40, color, 2.4)}</span><span>${t}</span></li>`).join('')}</ul>`;
const MIAH_M = asset('public/img/casos/miah-m.webp');
const POETAS_M = asset('public/img/casos/poetas-m.webp');
const HERO = asset('public/muestras/cabanas-lago-azul/img/hero.webp');
const plan = (file, n, ic, name, who, price, normal, items, badge = '') => add({
  file, w: W, h: H, cls: n % 2 ? 'cream' : 'ink',
  html: `${n % 2 ? '' : topo(W, H, { seed: 10 + n })}<img class="emb" src="${EMBLEM}" style="top:64px;right:72px">
    <div style="position:absolute;inset:130px 80px 150px;display:flex;flex-direction:column;justify-content:center;gap:30px">
      <div style="display:flex;align-items:center;gap:22px">${icon(ic, 72, n % 2 ? '#8a6a2a' : C.gold)}<div class="eyebrow">${who}</div></div>
      <h1 class="serif" style="font-size:104px;font-weight:500;line-height:1">${name}${badge ? ` <span style="font-family:Manrope;font-size:30px;vertical-align:middle;border:2px solid currentColor;border-radius:999px;padding:8px 18px">${badge}</span>` : ''}</h1>
      <div style="display:flex;align-items:baseline;gap:26px"><span class="serif" style="font-size:120px;font-weight:600;color:${n % 2 ? '#8a6a2a' : C.gold2}">${price}</span>${normal ? `<span class="strike" style="font-size:44px">${normal}</span>` : ''}</div>
      ${list(items, n % 2 ? '#8a6a2a' : C.gold)}
    </div>
    <div class="foot">${dots(n, 6)}<span>${B.site}</span></div>`,
});
const phoneCover = (file, eyebrow, titleHtml, img, d = []) => add({
  file, w: W, h: SH, cls: 'ink',
  html: `${topo(W, SH, { seed: 41 + file.length, opacity: 0.18 })}
    <div style="position:absolute;left:80px;right:80px;top:300px;display:flex;flex-direction:column;gap:26px">
      <div class="eyebrow">${eyebrow}</div>
      <h1 class="serif" style="font-size:118px;line-height:1.02;font-weight:500">${titleHtml}</h1>
    </div>
    <div style="position:absolute;left:310px;top:800px">${phone(img, 460, 0)}</div>
    <img class="emb" src="${EMBLEM}" style="top:300px;right:80px;width:100px;height:100px">${deco(d, W, SH)}`,
});
const cover = (file, eyebrow, titleHtml, img, tag = '', d = []) => add({
  file, w: W, h: SH, cls: 'ink',
  html: `${img ? `<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55">` : topo(W, SH, { seed: 40 + file.length })}
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,17,14,.15),rgba(11,17,14,.85) 70%)"></div>
    ${tag ? `<span class="tag" style="top:330px;left:80px">${tag}</span>` : ''}
    <div style="position:absolute;left:80px;right:80px;top:560px;bottom:560px;display:flex;flex-direction:column;justify-content:center;gap:30px">
      <div class="eyebrow">${eyebrow}</div>
      <h1 class="serif" style="font-size:112px;line-height:1.02;font-weight:500">${titleHtml}</h1>
    </div>
    <img class="emb" src="${EMBLEM}" style="bottom:330px;right:80px;width:100px;height:100px">${deco(d, W, SH)}`,
});
const wide = (file, cls, html, d = []) => add({ file, w: 1200, h: 900, cls, html: html + deco(d, 1200, 900) });
// Pantallas reales capturadas de los sitios (out/stills, sacadas de las grabaciones de capture-sites).
const STILL_T = { 'miah-galeria': 3, 'miah-guia': 5, 'miah-funciones': 4.5, miah: 1, poetas: 1, 'calculadora-sube': 4.9, 'calculadora-restaurante': 5, 'redvaeru-planes': 3, 'redvaeru-diagnostico': 6, 'redvaeru-metodo': 3, 'redvaeru-inicio': 1 };
const still = (id) => {
  const f = new URL(`./out/stills/${id}.jpg`, import.meta.url).pathname;
  if (!existsSync(f)) { mkdirSync(dirname(f), { recursive: true }); execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(STILL_T[id] ?? 1), '-i', new URL(`./out/clips/${id}.mp4`, import.meta.url).pathname, '-frames:v', '1', '-q:v', '3', f]); }
  return asset(`marketing/studio/out/stills/${id}.jpg`);
};
// Conversación tipo WhatsApp: [['in'|'out', texto, hora?], ...]
const chat = (msgs, fs = 40) => `<div style="display:flex;flex-direction:column;gap:22px;width:100%">${msgs.map(([who, t, h]) => `<div style="align-self:${who === 'in' ? 'flex-start' : 'flex-end'};max-width:86%;background:${who === 'in' ? '#fff' : C.gold2};color:${C.ink};font-size:${fs}px;line-height:1.32;font-weight:600;padding:24px 30px 18px;border-radius:${who === 'in' ? '8px 30px 30px 30px' : '30px 8px 30px 30px'};box-shadow:0 8px 0 rgba(0,0,0,.16),0 16px 30px rgba(0,0,0,.22);text-align:left">${t}<div style="font-size:22px;opacity:.55;text-align:right;margin-top:6px;font-weight:700">${h || ''}${who === 'out' ? ' ✓✓' : ''}</div></div>`).join('')}</div>`;
// Contador de cupos: n libres de total, los tomados tachados a mano.
const counter = (n, total, size = 150) => `<div style="display:flex;gap:26px;justify-content:center">${Array.from({ length: total }, (_, i) => { const taken = i >= n; return `<div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:${taken ? 'rgba(242,235,223,.08)' : C.gold};border:4px solid ${C.gold};box-shadow:${taken ? 'none' : '0 9px 0 rgba(0,0,0,.28)'};display:flex;align-items:center;justify-content:center;font-family:Emoji;font-size:${size * 0.5}px">${taken ? '' : '🏡'}${taken ? `<svg viewBox="0 0 100 100" style="position:absolute;inset:-10px;width:calc(100% + 20px);height:calc(100% + 20px)"><path d="M18 20 L84 82 M82 18 L20 84" stroke="${C.gold2}" stroke-width="9" stroke-linecap="round" fill="none"/></svg>` : ''}</div>`; }).join('')}</div>`;
// Hoja de calendario arrancable.
const cal = (num, top = 'NOVIEMBRE', size = 360) => `<div style="width:${size}px;background:#fff;color:${C.ink};border-radius:30px;overflow:hidden;box-shadow:0 14px 0 rgba(0,0,0,.2),0 26px 50px rgba(0,0,0,.35);transform:rotate(-4deg);text-align:center"><div style="background:#C2410C;color:#fff;font-weight:800;font-size:${size * 0.1}px;letter-spacing:.12em;padding:${size * 0.05}px 0">${top}</div><div style="font-family:Fraunces;font-weight:600;font-size:${size * 0.52}px;line-height:1.15">${num}</div></div>`;
// Chip con emoji (reemplaza los íconos de línea en las láminas con más personalidad).
const chips = (items, fs = 34) => `<div style="display:flex;flex-wrap:wrap;gap:16px">${items.map((t, i) => `<span class="stk" style="position:relative;font-size:${fs}px;transform:rotate(${[-2, 1.5, -1, 2.5][i % 4]}deg)">${t}</span>`).join('')}</div>`;
const ad = (id, ic, eyebrow, titleHtml, price, line, word) => {
  add({ file: `anuncios/${id}_1080x1080.png`, w: 1080, h: 1080, cls: 'ink', html: `${topo(1080, 1080, { seed: 60 + id.length })}<img class="emb" src="${EMBLEM}" style="top:60px;right:64px"><div style="position:absolute;inset:110px 80px 110px;display:flex;flex-direction:column;justify-content:center;gap:30px">${icon(ic, 90)}<div class="eyebrow">${eyebrow}</div><h1 class="serif" style="font-size:96px;line-height:1.02;font-weight:500">${titleHtml}</h1><p class="serif gold2" style="font-size:80px;font-weight:600">${price}</p><p style="font-size:32px;font-weight:600;opacity:.9">${line}</p>${cta(word)}</div>` });
  story({ file: `anuncios/${id}_1080x1920.png`, eyebrow, title: titleHtml, body: `<span class="serif gold2" style="font-size:96px;font-weight:600">${price}</span><br>${line}`, extra: cta(word) });
};

return { add, deco, doodle, still, chat, counter, cal, chips, W, H, SH, waQR, waQRgold, cartaQR, slide, story, cta, phone, list, plan, phoneCover, cover, wide, ad, MIAH_M, POETAS_M, HERO, qr };
}

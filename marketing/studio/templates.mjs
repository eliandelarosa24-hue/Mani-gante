// Plantillas de la marca Red Vaeru: todas las piezas usan estas funciones para mantener el mismo estilo.
// kit(add) entrega las plantillas conectadas a la lista de piezas de una semana.
import { topo, icon, qr, dots, asset, EMBLEM, BRAND as B, C } from './lib.mjs';

export async function kit(add) {
const W = 1080, H = 1350, SH = 1920;
const waQR = await qr(B.waLink, C.ink, '#F2EBDF');
const waQRgold = await qr(B.waLink, C.ink, '#E3C98A');
const cartaQR = await qr('https://redvaeru.netlify.app/muestras/fogon-mapu/', C.ink, '#ffffff');
// ---------- Plantillas ----------
// Lámina de feed 4:5 genérica.
function slide({ file, cls = 'ink', seed = 1, eyebrow = '', title = '', body = '', extra = '', n = 0, total = 1, align = 'start', titleSize = 92, topoOn = cls.startsWith('ink'), foot = true }) {
  add({
    file, w: W, h: H, cls,
    html: `${topoOn ? topo(W, H, { seed }) : ''}
      <img class="emb" src="${EMBLEM}" style="top:64px;right:72px">
      <div style="position:absolute;inset:150px 80px 150px;display:flex;flex-direction:column;justify-content:${align === 'center' ? 'center' : 'flex-start'};gap:36px">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        ${title ? `<h1 class="serif" style="font-size:${titleSize}px;line-height:1.04;font-weight:500">${title}</h1>` : ''}
        ${body ? `<p style="font-size:40px;line-height:1.4;font-weight:500;opacity:.9">${body}</p>` : ''}
        ${extra}
      </div>
      ${foot ? `<div class="foot">${total > 1 ? dots(n, total) : `<span>WhatsApp ${B.wa}</span>`}<span>${B.site}</span></div>` : ''}`,
  });
}
// Historia 9:16 genérica (zona segura: 250 px arriba y abajo).
function story({ file, cls = 'ink2', seed = 3, eyebrow = '', title = '', body = '', extra = '', titleSize = 104, center = true }) {
  add({
    file, w: W, h: SH, cls,
    html: `${cls.startsWith('ink') ? topo(W, SH, { seed, opacity: 0.18 }) : ''}
      <img class="emb" src="${EMBLEM}" style="top:250px;left:80px;width:90px;height:90px">
      <div style="position:absolute;inset:400px 80px 300px;display:flex;flex-direction:column;justify-content:${center ? 'center' : 'flex-start'};gap:44px">
        ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
        ${title ? `<h1 class="serif" style="font-size:${titleSize}px;line-height:1.05;font-weight:500">${title}</h1>` : ''}
        ${body ? `<p style="font-size:46px;line-height:1.4;font-weight:500;opacity:.92">${body}</p>` : ''}
        ${extra}
      </div>`,
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
const phoneCover = (file, eyebrow, titleHtml, img) => add({
  file, w: W, h: SH, cls: 'ink',
  html: `${topo(W, SH, { seed: 41 + file.length, opacity: 0.18 })}
    <div style="position:absolute;left:80px;right:80px;top:300px;display:flex;flex-direction:column;gap:26px">
      <div class="eyebrow">${eyebrow}</div>
      <h1 class="serif" style="font-size:118px;line-height:1.02;font-weight:500">${titleHtml}</h1>
    </div>
    <div style="position:absolute;left:310px;top:800px">${phone(img, 460, 0)}</div>
    <img class="emb" src="${EMBLEM}" style="top:300px;right:80px;width:100px;height:100px">`,
});
const cover = (file, eyebrow, titleHtml, img, tag = '') => add({
  file, w: W, h: SH, cls: 'ink',
  html: `${img ? `<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55">` : topo(W, SH, { seed: 40 + file.length })}
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,17,14,.15),rgba(11,17,14,.85) 70%)"></div>
    ${tag ? `<span class="tag" style="top:330px;left:80px">${tag}</span>` : ''}
    <div style="position:absolute;left:80px;right:80px;top:560px;bottom:560px;display:flex;flex-direction:column;justify-content:center;gap:30px">
      <div class="eyebrow">${eyebrow}</div>
      <h1 class="serif" style="font-size:112px;line-height:1.02;font-weight:500">${titleHtml}</h1>
    </div>
    <img class="emb" src="${EMBLEM}" style="bottom:330px;right:80px;width:100px;height:100px">`,
});
const wide = (file, cls, html) => add({ file, w: 1200, h: 900, cls, html });
const ad = (id, ic, eyebrow, titleHtml, price, line, word) => {
  add({ file: `anuncios/${id}_1080x1080.png`, w: 1080, h: 1080, cls: 'ink', html: `${topo(1080, 1080, { seed: 60 + id.length })}<img class="emb" src="${EMBLEM}" style="top:60px;right:64px"><div style="position:absolute;inset:110px 80px 110px;display:flex;flex-direction:column;justify-content:center;gap:30px">${icon(ic, 90)}<div class="eyebrow">${eyebrow}</div><h1 class="serif" style="font-size:96px;line-height:1.02;font-weight:500">${titleHtml}</h1><p class="serif gold2" style="font-size:80px;font-weight:600">${price}</p><p style="font-size:32px;font-weight:600;opacity:.9">${line}</p>${cta(word)}</div>` });
  story({ file: `anuncios/${id}_1080x1920.png`, eyebrow, title: titleHtml, body: `<span class="serif gold2" style="font-size:96px;font-weight:600">${price}</span><br>${line}`, extra: cta(word) });
};

return { add, W, H, SH, waQR, waQRgold, cartaQR, slide, story, cta, phone, list, plan, phoneCover, cover, wide, ad, MIAH_M, POETAS_M, HERO, qr };
}

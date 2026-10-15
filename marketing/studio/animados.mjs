// Videos animados e informativos (1080×1920, 30 cps): escenas de marca sincronizadas con la voz en off.
// Cada escena entra cuando la voz dice su palabra clave ("at"); los elementos internos también pueden
// esperar su propia palabra. Las cifras suben, las barras crecen y los subtítulos van integrados.
// Uso: SEMANA=info node animados.mjs [id ...]   (lee semanas/semana-N/animados.mjs y out/semana-N/voz/)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE, SEMANA_DIR, BASE_CSS, BRAND as B, C, EMBLEM, topo, icon, qr } from './lib.mjs';

const { VIDEOS } = await import(SEMANA_DIR + 'animados.mjs');
const FPS = 30, W = 1080, H = 1920, CTA_HOLD = 4.2;
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const VID = join(BASE, 'videos'), COV = join(BASE, 'portadas-reels'), TMP = join(BASE, '.frames');
const esc = (s) => String(s);

// ---------- escenas ----------
// Cada elemento animado lleva class="a" y data-d (segundos desde el inicio de la escena) o data-at (palabra).
const at = (o) => (o.at ? `data-at="${o.at}"` : `data-d="${o.d ?? 0}"`);
const src = (s) => (s ? `<p class="src">Fuente: ${s}</p>` : '');
const SCENES = {
  hook: (s) => `<div class="mid">
      ${s.eyebrow ? `<p class="a eyebrow" data-d="0">${s.eyebrow}</p>` : ''}
      ${s.lines.map((l, i) => `<h1 class="a serif big" data-d="${0.15 + i * 0.28}">${l}</h1>`).join('')}
      ${s.body ? `<p class="a body" data-d="${0.3 + s.lines.length * 0.28}">${s.body}</p>` : ''}
    </div>${src(s.source)}`,
  stat: (s) => `<div class="mid">
      ${s.eyebrow ? `<p class="a eyebrow" data-d="0">${s.eyebrow}</p>` : ''}
      <p class="a serif num" data-d="0.15"><span data-count="${s.value}" data-dec="${s.decimals ?? 0}">0</span>${s.suffix ?? ''}</p>
      <p class="a lead" data-d="0.45">${s.label}</p>
      ${s.body ? `<p class="a body" ${at({ at: s.bodyAt, d: 1.1 })}>${s.body}</p>` : ''}
    </div>${src(s.source)}`,
  cal: (s) => {
    const marks = Object.fromEntries(s.days.map((d, i) => [d.d, i]));
    const cells = Array.from({ length: 31 }, (_, i) => {
      const k = marks[i + 1];
      return `<span class="day${k !== undefined ? ' mark' : ''}" ${k !== undefined ? `data-hl="${s.days[k].at}"` : ''}>${i + 1}</span>`;
    }).join('');
    return `<div class="mid">
      <p class="a eyebrow" data-d="0">${s.eyebrow}</p>
      <h2 class="a serif h2" data-d="0.1">${s.title}</h2>
      <div class="a cal" data-d="0.25">${cells}</div>
      <div class="legend">${s.days.map((d) => `<div class="a row" data-at="${d.at}"><b class="serif">${d.d}</b><span>${d.label}</span></div>`).join('')}</div>
    </div>${src(s.source)}`;
  },
  bars: (s) => `<div class="mid">
      <p class="a eyebrow" data-d="0">${s.eyebrow}</p>
      <h2 class="a serif h2" data-d="0.1">${s.title}</h2>
      <div class="bars">${s.items.map((it) => `<div class="a bar" ${at(it)}>
          <div class="bl"><span>${it.label}</span><b class="serif" ${it.count !== undefined ? `data-count="${it.count}" data-dec="${it.decimals ?? 0}"` : ''}>${it.count !== undefined ? '0' : it.text}</b>${it.unit ?? ''}</div>
          <div class="track"><i data-from="${((it.from ?? 0) / s.max) * 100}" data-w="${(it.value / s.max) * 100}" class="${it.dim ? 'dim' : ''}"></i></div>
          ${it.note ? `<p class="note">${it.note}</p>` : ''}
        </div>`).join('')}</div>
      ${s.body ? `<p class="a body" ${at({ at: s.bodyAt, d: 1.5 })}>${s.body}</p>` : ''}
    </div>${src(s.source)}`,
  list: (s) => `<div class="mid">
      <p class="a eyebrow" data-d="0">${s.eyebrow}</p>
      <h2 class="a serif h2" data-d="0.1">${s.title}</h2>
      <div class="list">${s.items.map((it) => `<div class="a li" ${at(it)}>${icon(it.icon || 'check', 64, C.gold, 2)}<span>${it.text}</span></div>`).join('')}</div>
    </div>${src(s.source)}`,
};

async function ctaScene(v) {
  const waQR = await qr(B.waLink, C.ink, '#F2EBDF');
  return `<div class="mid ctam">
      <img class="a emb2" data-d="0" src="${EMBLEM}">
      <p class="a eyebrow" data-d="0.1">${v.cta.eyebrow}</p>
      <h2 class="a serif h2" data-d="0.2">${v.cta.title}</h2>
      <div class="a chips" data-d="0.45">${v.cta.chips.map((c) => `<span>${c}</span>`).join('')}</div>
      <div class="a ctarow" data-d="0.7"><img src="${waQR}"><div><span class="pill btn">${icon('chat', 40, C.ink, 2)} Escríbame <b>${v.cta.word}</b></span><p>WhatsApp ${B.wa}</p></div></div>
      ${v.cta.note ? `<p class="a body small" data-d="0.9">${v.cta.note}</p>` : ''}
    </div>`;
}

const CSS = `${BASE_CSS}
body{width:${W}px;height:${H}px;background:${C.ink};overflow:hidden}
#bg{position:absolute;left:-200px;top:-200px;width:1480px;height:2320px;will-change:transform}
#glow{position:absolute;inset:0;background:radial-gradient(90% 55% at 50% 30%,rgba(196,163,90,.13),transparent 70%)}
#bar{position:absolute;left:0;top:0;height:8px;background:${C.gold};width:0}
#head{position:absolute;left:72px;right:72px;top:70px;display:flex;align-items:center;gap:22px;font-weight:700;font-size:26px;letter-spacing:.14em;text-transform:uppercase;color:${C.gold2}}
#head img{width:70px;height:70px}
#head .ser{margin-left:auto;color:${C.cream};opacity:.7;letter-spacing:.1em}
.sc{position:absolute;inset:0;opacity:0}
.mid{position:absolute;left:84px;right:84px;top:250px;height:1150px;display:flex;flex-direction:column;justify-content:center;gap:34px}
.big{font-size:118px;line-height:1.02;font-weight:500}
.h2{font-size:84px;line-height:1.05;font-weight:500}
.num{font-size:200px;line-height:1;font-weight:600;color:${C.gold2};letter-spacing:-.03em}
.lead{font-size:50px;line-height:1.25;font-weight:700}
.body{font-size:42px;line-height:1.35;font-weight:500;opacity:.88}
.body.small{font-size:30px;opacity:.7}
.src{position:absolute;left:84px;right:84px;bottom:90px;font-size:24px;opacity:.6;font-weight:500}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:14px}
.day{height:104px;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:700;background:rgba(242,235,223,.06);color:rgba(242,235,223,.55)}
.day.on{background:${C.gold};color:${C.ink};transform:scale(1.12);box-shadow:0 0 0 6px rgba(196,163,90,.25)}
.legend{display:flex;flex-direction:column;gap:18px}
.row{display:flex;align-items:center;gap:28px;font-size:38px;font-weight:600;line-height:1.25}
.row b{flex:none;width:110px;height:110px;border-radius:50%;background:${C.gold};color:${C.ink};display:flex;align-items:center;justify-content:center;font-size:56px}
.bars{display:flex;flex-direction:column;gap:44px}
.bl{display:flex;align-items:baseline;gap:10px;font-size:40px;font-weight:700;margin-bottom:16px}
.bl span{flex:1}
.bl b{font-size:72px;color:${C.gold2};font-weight:600}
.track{height:46px;border-radius:999px;background:rgba(242,235,223,.08);position:relative;overflow:hidden}
.track i{position:absolute;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,${C.gold},${C.gold2})}
.track i.dim{background:rgba(242,235,223,.35)}
.note{font-size:28px;opacity:.65;margin-top:12px;font-weight:500}
.list{display:flex;flex-direction:column;gap:34px}
.li{display:flex;gap:28px;align-items:flex-start;font-size:46px;line-height:1.28;font-weight:600}
.li svg{flex:none;margin-top:2px}
.ctam{align-items:center;text-align:center}
.emb2{width:150px;height:150px}
.chips{display:flex;flex-wrap:wrap;justify-content:center;gap:16px}
.chips span{border:2px solid ${C.gold};border-radius:999px;padding:14px 28px;font-size:32px;font-weight:700;color:${C.gold2}}
.ctarow{display:flex;align-items:center;gap:36px;margin-top:10px;text-align:left}
.ctarow img{width:230px;height:230px;border-radius:20px}
.ctarow p{font-size:32px;font-weight:700;margin-top:18px}
#sub{position:absolute;left:60px;right:60px;top:1450px;display:flex;justify-content:center}
#sub span{background:rgba(11,17,14,.82);border:2px solid rgba(196,163,90,.55);color:${C.cream};font-weight:800;font-size:54px;line-height:1.15;padding:16px 30px;border-radius:22px;text-align:center;opacity:0}
`;

// Lógica de animación en la página: estado puro en función del tiempo t (determinista).
const RUNTIME = `
const ease=(x)=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
const fmt=(v,d)=>v.toLocaleString('es-CL',{minimumFractionDigits:d,maximumFractionDigits:d});
window.render=(t)=>{
  const {scenes,subs,total}=window.D;
  document.getElementById('bar').style.width=(100*t/total)+'%';
  document.getElementById('bg').style.transform='translate('+(-t*7)+'px,'+(-t*4)+'px)';
  scenes.forEach((s,k)=>{
    const el=document.getElementById('s'+k);
    const vis=t<s.t0?0:t<s.t0+0.35?ease((t-s.t0)/0.35):t<s.t1-0.3?1:t<s.t1?1-ease((t-(s.t1-0.3))/0.3):0;
    el.style.opacity=vis; el.style.transform='translateY('+((1-vis)*(t<s.t0+0.35?30:-30))+'px)';
    if(!vis) return;
    el.querySelectorAll('.a').forEach((a)=>{
      const st=a.dataset.at!==undefined?(s.words[a.dataset.at]??s.t0):s.t0+(+a.dataset.d||0);
      const p=ease((t-st)/0.55);
      a.style.opacity=p; a.style.transform='translateY('+((1-p)*44)+'px) scale('+(0.96+0.04*p)+')';
      a.querySelectorAll('[data-count]').forEach((c)=>{c.textContent=fmt(+c.dataset.count*ease((t-st-0.1)/1.3),+c.dataset.dec);});
      a.querySelectorAll('[data-w]').forEach((b)=>{const q=ease((t-st-0.15)/1.1);const f=+b.dataset.from;b.style.left=f+'%';b.style.width=((+b.dataset.w-f)*q)+'%';});
    });
    el.querySelectorAll('[data-hl]').forEach((d)=>{const w=s.words[d.dataset.hl];d.classList.toggle('on',w!==undefined&&t>=w);});
  });
  const cur=subs.find((x)=>t>=x.t0&&t<x.t1);
  const sp=document.querySelector('#sub span');
  sp.style.opacity=cur?1:0; if(cur) sp.textContent=cur.text;
};`;

const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,:;«»"]/g, '');
function timeline(v, J) {
  // Tiempo de cada palabra clave: inicio del primer subtítulo cuyo texto contiene esa palabra (en orden).
  const subs = J.subs.map((s) => ({ ...s, t0: s.t0 + J.offset, t1: s.t1 + J.offset }));
  let cursor = 0;
  const wordAt = (w) => {
    for (let i = cursor; i < subs.length; i++) {
      const toks = subs[i].text.split(/\s+/).map(norm);
      if (toks.includes(norm(w)) || norm(subs[i].text).startsWith(norm(w))) { cursor = i; return subs[i].t0; }
    }
    throw new Error(`${v.id}: no encuentro la palabra «${w}» en la voz`);
  };
  const words = {};
  const t0s = v.scenes.map((s, k) => (k === 0 ? 0 : wordAt(s.at)));
  v.scenes.forEach((s) => [s, ...(s.items || []), ...(s.days || [])].forEach((o) => { if (o.at && !(o.at in words)) words[o.at] = null; if (o.bodyAt) words[o.bodyAt] = null; }));
  cursor = 0;
  for (const w of Object.keys(words)) { try { cursor = 0; words[w] = wordAt(w); } catch { delete words[w]; } }
  const speechEnd = subs.at(-1).t1 + 0.5;
  const scenes = v.scenes.map((s, k) => ({ t0: t0s[k], t1: k + 1 < t0s.length ? t0s[k + 1] : speechEnd, words }));
  scenes.push({ t0: speechEnd, t1: speechEnd + CTA_HOLD + 1, words });
  return { scenes, subs, total: +(speechEnd + CTA_HOLD).toFixed(2) };
}

const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined });
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(VIDEOS);
mkdirSync(VID, { recursive: true }); mkdirSync(COV, { recursive: true });
for (const id of ids) {
  const v = { id, ...VIDEOS[id] };
  const jf = join(BASE, 'voz', `${id}.json`), mp3 = join(BASE, 'voz', `${id}.mp3`);
  if (!existsSync(jf)) { console.error(`✗ ${id}: falta la voz (ejecute voz.mjs)`); continue; }
  const D = timeline(v, JSON.parse(readFileSync(jf, 'utf8')));
  const body = v.scenes.map((s, k) => `<div class="sc" id="s${k}">${SCENES[s.type](s)}</div>`).join('') + `<div class="sc" id="s${v.scenes.length}">${await ctaScene(v)}</div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body class="f ink">
    <div id="bg">${topo(1480, 2320, { seed: v.seed ?? 7, opacity: 0.2 })}</div><div id="glow"></div><div id="bar"></div>
    <div id="head"><img src="${EMBLEM}"><span>Red Vaeru</span><span class="ser">${v.serie}</span></div>
    ${body}<div id="sub"><span></span></div>
    <script>window.D=${JSON.stringify(D)};${RUNTIME}</script></body></html>`;
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const dir = join(TMP, id);
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const frames = Math.round(D.total * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.render(t), f / FPS);
    await page.screenshot({ path: join(dir, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 90 });
  }
  // Portada: el gancho ya armado, sin subtítulo.
  await page.evaluate((t) => { window.render(t); document.querySelector('#sub span').style.opacity = 0; }, Math.min(2.2, D.scenes[0].t1 - 0.4));
  await page.screenshot({ path: join(COV, `${id}_${v.slug}.png`) });
  await page.close();
  const out = join(VID, `${v.file}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%05d.jpg'), '-i', mp3,
    '-filter_complex', `[1:a]adelay=${Math.round(0.3 * 1000)}:all=1,apad,atrim=0:${D.total},aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11[au]`,
    '-map', '0:v', '-map', '[au]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-t', String(D.total), out], { stdio: ['ignore', 'inherit', 'inherit'] });
  rmSync(dir, { recursive: true, force: true });
  console.log(`✓ ${v.file} · ${D.total.toFixed(1)} s`);
}
await browser.close();

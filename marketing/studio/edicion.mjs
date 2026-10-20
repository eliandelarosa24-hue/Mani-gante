// Edición "humana" para Reels (1080×1920, 30 cps), al estilo de los edits virales: planos cortos de las
// grabaciones reales con cámara virtual (encuadre, empujes y golpes de zoom, pulso de mano), sacudidas,
// destellos, separación RGB, barridos con luz cálida, stickers, números de capítulo, texto que se escribe solo,
// toques de dedo sobre los botones reales, círculos/flechas/subrayados a mano, subtítulos palabra por palabra
// con resaltador, grano, música (atenuada bajo la voz) y efectos de sonido.
// Todo se ancla a palabras de la voz en off (out/semana-N/voz/<id>.json, con tiempos por palabra).
// Uso: SEMANA=muestra node edicion.mjs [id ...]   (lee semanas/semana-N/edicion.mjs)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BASE, OUT, ROOT, SEMANA_DIR, BASE_CSS, BRAND as B, C, EMBLEM, topo, qr } from './lib.mjs';

const { EDITS } = await import(SEMANA_DIR + 'edicion.mjs');
const FPS = 30, W = 1080, H = 1920, FW = 1080, FH = 2337; // FW×FH: grabación del celular escalada a 1080 de ancho
const CSSPX = FW / 390; // 1 px CSS de la grabación (vista de 390 px) = 2,77 px de la grabación escalada
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const WORK = join(BASE, '.edit'), VID = join(BASE, 'videos'), COV = join(BASE, 'portadas-reels'), SFX = join(OUT, 'sfx');

// Fotogramas de cada grabación (una vez), para que el editor los recorra cuadro a cuadro.
function frames(clip) {
  const dir = join(WORK, 'frames', clip);
  if (!existsSync(join(dir, '00001.jpg'))) {
    mkdirSync(dir, { recursive: true });
    execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-y', '-i', join(OUT, 'clips', `${clip}.mp4`), '-vf', `fps=${FPS},scale=${FW}:-2`, '-q:v', '3', join(dir, '%05d.jpg')]);
  }
  return Number(execFileSync('sh', ['-c', `ls "${dir}" | wc -l`]).toString());
}

// Toques registrados por capture-sites.mjs (px CSS) → px de la grabación escalada.
const clipTaps = (clip) => {
  const f = join(OUT, 'clips', `${clip}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).taps.map((t) => ({ ...t, x: t.x * CSSPX, y: t.y * CSSPX })) : [];
};

// Grano de película: una textura de ruido que se desplaza en cada cuadro.
function grain() {
  const f = join(WORK, 'grain.png');
  if (!existsSync(f)) mkdirSync(WORK, { recursive: true });
  if (!existsSync(f)) execFileSync('ffmpeg', ['-nostdin', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'nullsrc=s=512x512,geq=random(1)*255:128:128', '-vf', 'format=gray', '-frames:v', '1', f]);
  return f;
}

const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,:;…«»"]/g, '');

function plan(e, J) {
  const off = J.offset ?? 0.3;
  const words = J.words.map((w) => ({ ...w, t0: w.t0 + off, t1: w.t1 + off }));
  const T = (a) => {
    if (typeof a === 'number') return a;
    const [w, n = 1] = String(a).split('#');
    const hits = words.filter((x) => norm(x.w) === norm(w));
    if (!hits[n - 1]) throw new Error(`${e.id}: no encuentro «${a}» en la voz`);
    return hits[n - 1].t0;
  };
  const total = +(words.at(-1).t1 + (e.hold ?? 2.6)).toFixed(2);
  const shots = e.shots.map((s, k) => ({ ...s, t0: T(s.at), t1: k + 1 < e.shots.length ? T(e.shots[k + 1].at) : total }));
  shots.forEach((s) => { if (!(s.t1 > s.t0)) throw new Error(`${e.id}: el plano «${s.at}» (${s.t0.toFixed(2)} s) no queda antes del siguiente: revise la palabra o use «palabra#n»`); });
  shots.forEach((s) => {
    if (s.type === 'kinetic') s.noCap = true;
    if (s.clip) s.n = frames(s.clip);
    // sync: el instante clipT de la grabación cae justo cuando la voz dice la palabra "at".
    if (s.sync) s.from = s.sync.clipT - (T(s.sync.at) - s.t0) * (s.speed || 1);
    // times: [[palabra, segundo de la grabación], ...] acelera o frena la grabación por tramos.
    if (s.times) s.times = s.times.map(([a, c]) => [a === 'end' ? s.t1 : T(a), c]);
    s.cam = (s.cam || [{}]).map((c, i) => ({ x: FW / 2, y: FH / 2, z: 1, dur: 0.22, ...c, t: i === 0 ? s.t0 : T(c.at) }));
  });
  const fx = [];
  (e.fx || []).forEach((f) => {
    // taps: N dibuja el dedo en cada toque real de la grabación que cae dentro del plano N.
    if (f.taps !== undefined) {
      const s = shots[f.taps];
      const inv = (ct) => {
        if (!s.times) return s.t0 + (ct - (s.from || 0)) / (s.speed || 1);
        for (let i = 1; i < s.times.length; i++) { const [a0, c0] = s.times[i - 1], [a1, c1] = s.times[i]; if (ct >= c0 && ct <= c1) return a0 + ((ct - c0) / (c1 - c0)) * (a1 - a0); }
        return -1;
      };
      clipTaps(s.clip).forEach((tp) => {
        const t = inv(tp.t);
        if (t >= s.t0 && t < s.t1) fx.push({ tap: { x: tp.x, y: tp.y }, t, sfx: 'tap', vol: 1 });
      });
      return;
    }
    fx.push({ ...f, t: T(f.at) + (f.dt ?? 0), until: f.until !== undefined ? T(f.until) : undefined });
  });
  // Etiqueta fija arriba (p. ej. cuando se usan muestras de concepto como imágenes de apoyo), hasta el cierre.
  if (e.label) {
    const cta = shots.find((s) => s.type === 'cta');
    fx.push({ sticker: { text: e.label, x: 540, y: 150, tone: 'ink', size: 24 }, t: 0.05, until: cta ? cta.t0 : total, persist: true });
  }
  // Subtítulos: bloques de hasta 3 palabras (corta en la puntuación).
  const caps = [];
  let g = [];
  words.forEach((w, i) => {
    g.push({ ...w, hl: (e.hi || []).includes(norm(w.w)) });
    if (g.length >= 3 || /[.,:;?!…]$/.test(w.w) || i === words.length - 1) { caps.push(g); g = []; }
  });
  return { total, shots, fx, caps: caps.map((ws) => ({ t0: ws[0].t0, t1: ws.at(-1).t1 + 0.08, ws })) };
}

// ---------- piezas visuales ----------
const STICK = {
  tag: (s) => `<div class="tag2 ${s.tone || ''}" style="font-size:${s.size || 50}px">${s.text}</div>`,
  emoji: (s) => `<div class="emo" style="font-size:${s.size || 170}px">${s.text}</div>`,
  num: (s) => `<div class="num"><b>${s.text}</b>${s.label ? `<span>${s.label}</span>` : ''}</div>`,
  stat: (s) => `<div class="stat"><b data-count="${s.value}" data-dec="${s.dec || 0}" data-pre="${s.pre || ''}" data-suf="${s.suf || ''}">0</b><span>${s.label}</span>${s.src ? `<small>${s.src}</small>` : ''}</div>`,
  quote: (s) => `<div class="quote"><p>«${s.text}»</p><span>${s.by}</span></div>`,
  type: (s) => `<div class="typ" style="font-size:${s.size || 84}px" data-full="${s.text.replace(/"/g, '&quot;')}"><span></span><i>|</i></div>`,
};
// Trazos "a mano": elipse temblorosa, flecha curva con punta, subrayado ondulado (en coordenadas de la grabación).
const wob = (i, a) => Math.sin(i * 12.9898 + a * 78.233) * 0.5;
function circlePath(cx, cy, rx, ry) {
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const a = -0.4 + (i / 40) * Math.PI * 2.15, k = 1 + wob(i, 1) * 0.06;
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}
const arrowPath = (x1, y1, x2, y2, bend = 0.25) => {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const ang = Math.atan2(y2 - my, x2 - mx), h = 54;
  const a1 = [x2 - h * Math.cos(ang - 0.45), y2 - h * Math.sin(ang - 0.45)], a2 = [x2 - h * Math.cos(ang + 0.45), y2 - h * Math.sin(ang + 0.45)];
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2} M${a1[0].toFixed(1)},${a1[1].toFixed(1)} L${x2},${y2} L${a2[0].toFixed(1)},${a2[1].toFixed(1)}`;
};
const underPath = (x, y, w) => `M${x},${y} ` + Array.from({ length: 8 }, (_, i) => `Q${x + (i + 0.5) * (w / 8)},${y + (i % 2 ? 14 : -14)} ${x + (i + 1) * (w / 8)},${y}`).join(' ');
const DRAW = {
  circle: (d) => circlePath(d.x, d.y, d.rx, d.ry),
  arrow: (d) => arrowPath(d.x1, d.y1, d.x2, d.y2, d.bend),
  underline: (d) => underPath(d.x, d.y, d.w),
};

async function ctaHTML(e) {
  const waQR = await qr(B.waLink, C.ink, '#F2EBDF');
  let k = 0;
  return `<div id="cta">${topo(1080, 1920, { seed: 9, opacity: 0.22 })}
    <div class="ctain">
      <img class="ci" data-k="${k++}" src="${EMBLEM}" style="width:140px;height:140px">
      <h1 class="ci serif" data-k="${k++}">${e.cta.title}</h1>
      ${e.cta.checks ? `<div class="ci checks" data-k="${k++}">${e.cta.checks.map((c) => `<span>✅ ${c}</span>`).join('')}</div>` : ''}
      <div class="ci tag2 gold big wig" data-k="${k++}">${e.cta.button}</div>
      <div class="ci qrrow" data-k="${k++}"><img src="${waQR}"><p>WhatsApp<br><b>${B.wa}</b></p></div>
      <p class="ci note" data-k="${k++}">${e.cta.note}</p>
    </div></div>`;
}

const CSS = `${BASE_CSS}
@font-face{font-family:Emoji;src:local('Noto Color Emoji')}
body{width:${W}px;height:${H}px;background:#000;overflow:hidden}
#stage{position:absolute;inset:0;overflow:hidden}
#world{position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;transform-origin:0 0}
#foot{position:absolute;left:0;top:0;width:${FW}px;height:${FH}px}
#draw{position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;overflow:visible}
#draw path{fill:none;stroke:${C.gold2};stroke-width:14;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 4px 0 rgba(0,0,0,.35))}
.tap{position:absolute;width:0;height:0;opacity:0}
.tap .ring{position:absolute;left:-70px;top:-70px;width:140px;height:140px;border-radius:50%;border:8px solid #fff;box-shadow:0 0 0 6px rgba(196,163,90,.6)}
.tap .fin{position:absolute;left:-20px;top:-6px;font-family:Emoji;font-size:120px;line-height:1;filter:drop-shadow(0 10px 14px rgba(0,0,0,.4))}
.hook{position:absolute;inset:0;display:none;align-items:center;justify-content:center;text-align:center}
.hook .bgi{position:absolute;inset:-60px;width:calc(100% + 120px);height:calc(100% + 120px);object-fit:cover;filter:blur(26px) brightness(.38) saturate(1.2)}
.hook h1{position:relative;font-family:Manrope;font-weight:800;font-size:150px;line-height:.98;color:${C.cream};letter-spacing:-.02em;text-transform:uppercase}
.hook h1 em{font-family:Fraunces;font-style:italic;font-weight:600;text-transform:none;color:${C.gold2}}
.st{position:absolute;transform-origin:50% 50%;opacity:0}
.tag2{display:inline-block;background:#fff;color:${C.ink};font-family:Manrope,Emoji;font-weight:800;padding:18px 30px;border-radius:22px;box-shadow:0 10px 0 rgba(0,0,0,.18),0 18px 40px rgba(0,0,0,.35);white-space:nowrap}
.tag2.gold{background:${C.gold};color:${C.ink}}
.tag2.ink{background:${C.ink};color:${C.cream};border:3px solid ${C.gold}}
.tag2.big{font-size:60px;padding:24px 42px;border-radius:999px}
.emo{font-family:Emoji;line-height:1;filter:drop-shadow(0 12px 18px rgba(0,0,0,.35))}
.num{display:flex;align-items:center;gap:22px}
.num b{font-family:Fraunces;font-style:italic;font-weight:600;font-size:260px;line-height:.8;color:${C.gold2};-webkit-text-stroke:8px ${C.ink};paint-order:stroke;text-shadow:0 14px 0 rgba(0,0,0,.25)}
.num span{background:${C.ink};color:${C.cream};border:3px solid ${C.gold};font-weight:800;font-size:46px;padding:14px 26px;border-radius:18px;white-space:nowrap}
.typ{font-family:Manrope,Emoji;font-weight:800;color:#fff;line-height:1.05;text-align:center;white-space:pre-wrap;width:900px;paint-order:stroke;-webkit-text-stroke:12px ${C.ink};text-shadow:0 10px 0 rgba(0,0,0,.3)}
.stat{width:880px;background:#fff;color:${C.ink};border-radius:30px;padding:34px 46px 30px;box-shadow:0 14px 0 rgba(0,0,0,.18),0 24px 50px rgba(0,0,0,.4);text-align:left}
.stat b{display:block;font-family:Fraunces;font-weight:600;font-size:150px;line-height:1;letter-spacing:-.03em;color:#8a6a2a}
.stat span{display:block;margin-top:10px;font-weight:800;font-size:44px;line-height:1.15}
.stat small{display:block;margin-top:14px;font-weight:600;font-size:26px;opacity:.6}
.quote{width:900px;background:#fff;color:${C.ink};border-radius:30px;padding:44px 50px 38px;box-shadow:0 14px 0 rgba(0,0,0,.18),0 24px 50px rgba(0,0,0,.4);text-align:left}
.quote p{font-family:Fraunces;font-style:italic;font-weight:500;font-size:62px;line-height:1.1}
.quote span{display:block;margin-top:22px;font-weight:800;font-size:32px;color:#8a6a2a}
.typ i{font-style:normal;color:${C.gold2};-webkit-text-stroke:0}
#flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
#leak{position:absolute;inset:-20%;opacity:0;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(40% 35% at 30% 40%,rgba(255,170,80,.85),transparent 70%),radial-gradient(35% 30% at 70% 60%,rgba(255,90,60,.55),transparent 70%)}
#grain{position:absolute;inset:-512px;background-image:url(grain.png);opacity:.07;mix-blend-mode:overlay;pointer-events:none}
#vig{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 45%,transparent 55%,rgba(0,0,0,.45));pointer-events:none}
#cap{position:absolute;left:540px;width:max-content;max-width:980px;transform-origin:0 50%;display:flex;flex-wrap:wrap;justify-content:center;gap:4px 26px;padding:14px 30px 20px;border-radius:30px;background:rgba(11,17,14,.62);backdrop-filter:blur(6px);pointer-events:none}
#cap span{font-family:Manrope,Emoji;font-weight:800;font-size:70px;line-height:1.12;color:#fff;paint-order:stroke;-webkit-text-stroke:10px ${C.ink};text-shadow:0 8px 0 rgba(0,0,0,.25);display:inline-block}
#cap span.on{color:${C.gold2};transform:scale(1.1) rotate(-2deg);margin:0 6px}
#cap span.hl{color:${C.ink};-webkit-text-stroke:0;text-shadow:none;background:linear-gradient(100deg,transparent 2%,${C.gold2} 6%,${C.gold} 92%,transparent 98%);padding:0 14px;border-radius:12px;transform:rotate(-2deg)}
#cta{position:absolute;inset:0;background:${C.ink};display:none}
#cta .topo{position:absolute;inset:0}
.ctain{position:absolute;left:70px;right:70px;top:220px;bottom:500px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:38px;text-align:center}
.ctain h1{font-size:110px;line-height:1;font-weight:500;color:${C.cream}}
.checks{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}
.checks span{font-family:Manrope,Emoji;font-size:40px;font-weight:800;color:${C.cream};background:rgba(242,235,223,.08);border:2px solid rgba(196,163,90,.55);padding:12px 22px;border-radius:999px}
.qrrow{display:flex;align-items:center;gap:30px;text-align:left}.qrrow img{width:230px;height:230px;border-radius:22px}
.qrrow p{font-size:34px;font-weight:600;line-height:1.3;color:${C.cream}}.qrrow b{font-size:44px;color:${C.gold2}}
.note{font-size:36px;font-weight:700;color:${C.cream};opacity:.85}
.ci{opacity:0}
.ph{position:absolute;inset:0;display:none;overflow:hidden;background:#000}
.ph .pbg{position:absolute;inset:-80px;width:calc(100% + 160px);height:calc(100% + 160px);object-fit:cover;filter:blur(40px) brightness(.45) saturate(1.3)}
.ph .pfg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 50%}
.ph .pcard{position:absolute;background:#fbf8f2;padding:16px 16px 64px;box-shadow:0 30px 60px rgba(0,0,0,.55);opacity:0}
.ph .pcard img{display:block;width:100%;height:100%;object-fit:cover}
.ph .pcard b{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-family:Fraunces;font-style:italic;font-weight:600;font-size:40px;color:${C.ink}}
.ph .plab{position:absolute;left:50%;bottom:140px;transform:translateX(-50%);font-family:Manrope;font-weight:800;font-size:24px;letter-spacing:.06em;color:${C.cream};background:rgba(11,17,14,.6);padding:8px 18px;border-radius:999px;white-space:nowrap}
.kin{position:absolute;inset:0;display:none;background:${C.ink};overflow:hidden}
.kin .kbg{position:absolute;inset:-80px;width:calc(100% + 160px);height:calc(100% + 160px);object-fit:cover;filter:blur(30px) brightness(.32) saturate(1.2)}
.kin .kw{position:absolute;left:70px;right:70px;top:50%;transform:translateY(-50%);display:flex;flex-wrap:wrap;gap:0 28px;align-content:center;justify-content:flex-start}
.kin .kw span{font-family:Manrope,Emoji;font-weight:800;font-size:132px;line-height:1.02;letter-spacing:-.03em;color:${C.cream};text-transform:uppercase;opacity:0;display:inline-block}
.kin .kw span.hl{font-family:Fraunces;font-style:italic;font-weight:600;text-transform:none;color:${C.gold2}}
`;

const RUNTIME = `
const E=(x)=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
const IO=(x)=>{x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
const BACK=(x)=>{x=Math.max(0,Math.min(1,x));const c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
const $=(s)=>document.querySelector(s);
let lastSrc='';
window.render=async(t)=>{
  const {shots,fx,caps,total,FW,FH}=window.P;
  const s=shots.find((x)=>t>=x.t0&&t<x.t1)||shots.at(-1);
  // ---- metraje ----
  const isHook=s.type==='hook', isCta=s.type==='cta', isPh=s.type==='photo'||s.type==='stack', isKin=s.type==='kinetic';
  const si=shots.indexOf(s);
  document.querySelectorAll('.hook').forEach((h)=>{h.style.display=(isHook&&h.id==='hk'+si)?'flex':'none';});
  document.querySelectorAll('.ph,.kin').forEach((h)=>{h.style.display=((isPh||isKin)&&h.id==='pk'+si)?'block':'none';});
  $('#cta').style.display=isCta?'block':'none';
  $('#world').style.display=(isHook||isCta||isPh||isKin)?'none':'block';
  if(isPh||isKin){
    const el=$('#pk'+si), lt=t-s.t0, len=s.t1-s.t0, k=IO(lt/len);
    let sx=0,sy=0; fx.filter((f)=>f.shake&&t>=f.t&&t<f.t+0.45).forEach((f)=>{const d=1-(t-f.t)/0.45;sx+=Math.sin(t*95)*f.shake*d;sy+=Math.cos(t*83)*f.shake*d;});
    const tp=lt/0.22; let wx=0,bl=0,wz=1;
    if(s.trans==='whip'&&tp<1){wx=(1-E(tp))*520;bl=(1-tp)*26;} if(s.trans==='zoom'&&tp<1){wz=1+(1-E(tp))*0.3;bl=(1-tp)*18;}
    el.style.transform='translate('+(wx+sx)+'px,'+sy+'px) scale('+wz+')'; el.style.filter=bl?'blur('+bl+'px)':'none';
    if(s.type==='photo'){const a=s.kb[0],b=s.kb[1];const z=a.z+(b.z-a.z)*k,x=a.x+(b.x-a.x)*k,y=a.y+(b.y-a.y)*k;el.querySelector('.pfg').style.transform='scale('+z+') translate('+x+'px,'+y+'px)';}
    if(s.type==='stack'){const cs=el.querySelectorAll('.pcard');cs.forEach((c,i)=>{const at=s.t0+0.1+i*(len-0.4)/cs.length;const p=(t-at)/0.32;c.style.opacity=p>0?Math.min(1,p*2):0;c.style.transform='translate(-50%,-50%) translateY('+((1-E(p))*-260)+'px) rotate('+(c.dataset.r*(p>0?1:0)+(1-E(p))*14)+'deg) scale('+(0.8+0.2*BACK(p))+')';});
      const bg=el.querySelector('.pbg'); if(bg) bg.style.transform='scale('+(1.05+0.08*k)+')';}
    if(isKin){el.querySelectorAll('.kw').forEach((kw)=>{kw.style.display=(t>=+kw.dataset.a&&t<+kw.dataset.b)?'flex':'none';});el.querySelectorAll('.kw span').forEach((sp)=>{const p=(t-(+sp.dataset.t))/0.18;sp.style.opacity=p>0?1:0;sp.style.transform='translateY('+((1-E(p))*60)+'px) scale('+(p>0?0.6+0.4*BACK(p):0.6)+') rotate('+(sp.classList.contains('hl')?-3:0)+'deg)';});
      const bg=el.querySelector('.kbg'); if(bg) bg.style.transform='scale('+(1.05+0.1*k)+')';}
  }
  if(!isHook&&!isCta&&!isPh&&!isKin){
    const lt=t-s.t0, len=s.t1-s.t0;
    const k=s.ramp?IO(lt/len):Math.min(1,lt/len);
    let ct=s.to!==undefined?s.from+(s.to-s.from)*k:(s.from||0)+lt*(s.speed||1);
    if(s.times){ct=s.times[0][1];for(let i=1;i<s.times.length;i++){const [a0,c0]=s.times[i-1],[a1,c1]=s.times[i];if(t>=a0){ct=t>=a1?c1:c0+(c1-c0)*(t-a0)/(a1-a0);}}}
    const idx=Math.max(1,Math.min(s.n,Math.round(ct*30)+1));
    const src='../frames/'+s.clip+'/'+String(idx).padStart(5,'0')+'.jpg';
    if(src!==lastSrc){const im=$('#foot');im.src=src;lastSrc=src;await im.decode().catch(()=>{});}
    // cámara: interpola entre puntos (golpes cortos o empujes largos)
    let c={...s.cam[0]};
    for(let i=1;i<s.cam.length;i++){const k=s.cam[i];if(t<k.t)break;const p=E((t-k.t)/k.dur);c={x:c.x+(k.x-c.x)*p,y:c.y+(k.y-c.y)*p,z:c.z+(k.z-c.z)*p};}
    if(s.push){c.z*=1+s.push*(lt/len);}
    // pulso de mano
    const hx=Math.sin(t*1.7)*5+Math.sin(t*3.1)*2, hy=Math.cos(t*1.3)*6, hr=Math.sin(t*0.9)*0.35;
    // sacudidas
    let sx=0,sy=0,sr=0;
    fx.filter((f)=>f.shake&&t>=f.t&&t<f.t+0.45).forEach((f)=>{const d=1-(t-f.t)/0.45, a=f.shake*d;sx+=Math.sin(t*95)*a;sy+=Math.cos(t*83)*a;sr+=Math.sin(t*70)*a*0.04;});
    const z=Math.max(1,c.z), hw=540/z, hh=960/z;
    const x=Math.min(FW-hw,Math.max(hw,c.x)), y=Math.min(FH-hh,Math.max(hh,c.y));
    // barrido de entrada
    let wx=0,blur=0,wz=1; const tp=(t-s.t0)/0.2;
    if(s.trans==='whip'&&tp<1){wx=(1-E(tp))*520;blur=(1-tp)*26;}
    if(s.trans==='zoom'&&tp<1){wz=1+(1-E(tp))*0.35;blur=(1-tp)*18;}
    $('#world').style.transform='translate('+(540+hx+sx+wx)+'px,'+(960+hy+sy)+'px) rotate('+(hr+sr)+'deg) scale('+(z*wz)+') translate('+(-x)+'px,'+(-y)+'px)';
    const rgb=fx.find((f)=>f.rgb&&t>=f.t&&t<f.t+0.28); const ra=rgb?(1-(t-rgb.t)/0.28)*14:0;
    const fl=[]; if(blur)fl.push('blur('+blur+'px)'); if(ra)fl.push('drop-shadow('+ra+'px 0 0 rgba(255,40,60,.55)) drop-shadow('+(-ra)+'px 0 0 rgba(40,220,255,.55))');
    if(s.dim)fl.push('brightness('+(1-s.dim)+')');
    if(window.P.grade)fl.push(window.P.grade);
    $('#world').style.filter=fl.length?fl.join(' '):'none';
  }
  if(isHook){
    const p=(t-s.t0);
    const sc=p<0.18?BACK(p/0.18)*1:1+0.04*Math.sin(p*9);
    let sx=0; fx.filter((f)=>f.shake&&t>=f.t&&t<f.t+0.45).forEach((f)=>{sx+=Math.sin(t*95)*f.shake*(1-(t-f.t)/0.45);});
    const hh=document.querySelector('#hk'+shots.indexOf(s)+' h1'); if(hh) hh.style.transform='translateX('+sx+'px) scale('+sc+') rotate('+(-2+Math.sin(p*3)*1.2)+'deg)';
  }
  if(isCta){
    document.querySelectorAll('.ci').forEach((el)=>{const p=(t-s.t0-0.12*el.dataset.k)/0.32;el.style.opacity=E(p);el.style.transform='translateY('+((1-E(p))*60)+'px) scale('+(0.7+0.3*BACK(p))+')'+(el.classList.contains('wig')&&p>1?' rotate('+(Math.sin(t*7)*3)+'deg)':'');});
  }
  // ---- luz cálida en los cortes ----
  let lk=0; shots.forEach((q)=>{if(q.trans&&Math.abs(t-q.t0)<0.3)lk=Math.max(lk,1-Math.abs(t-q.t0)/0.3);});
  $('#leak').style.opacity=lk*0.75; $('#leak').style.transform='translateX('+((t*400)%300-150)+'px)';
  // ---- stickers, toques y trazos ----
  fx.forEach((f,i)=>{
    const el=document.getElementById('fx'+i); if(!el) return;
    const shot=shots.find((x)=>f.t>=x.t0&&f.t<x.t1);
    if(f.tap){
      const d=t-f.t, on=shot===s&&d>-0.35&&d<0.6;
      el.style.opacity=on?(d<-0.2?(d+0.35)/0.15:d>0.45?(0.6-d)/0.15:1):0;
      el.querySelector('.ring').style.transform='scale('+(d<0?0.2:0.3+1.3*E(d/0.45))+')';
      el.querySelector('.ring').style.opacity=d<0?0:1-E(d/0.5);
      el.querySelector('.fin').style.transform='translate('+(d<0?-d*160:0)+'px,'+(d<0?-d*120:0)+'px) scale('+(Math.abs(d)<0.08?0.88:1)+')';
      return;
    }
    const end=f.until??s.t1;
    const live=t>=f.t&&t<end&&(f.persist||shot===s);
    if(f.draw){const p=live?E((t-f.t)/(f.speed||0.38)):0; el.style.strokeDashoffset=1-p; el.style.opacity=live?1:0; return;}
    if(!live){el.style.opacity=0;return;}
    const p=(t-f.t)/0.28, out=end-t<0.15?(end-t)/0.15:1;
    const sc=BACK(p)*out, wig=f.wiggle?Math.sin((t-f.t)*8)*3:0;
    el.style.opacity=Math.min(1,p*3)*out;
    el.style.transform='translate(-50%,-50%) scale('+sc+') rotate('+((f.rot||0)+wig)+'deg)';
    const sb=el.querySelector('.stat b');
    if(sb){const q=E((t-f.t-0.1)/1.1);const v=+sb.dataset.count*q;sb.textContent=sb.dataset.pre+v.toLocaleString('es-CL',{minimumFractionDigits:+sb.dataset.dec,maximumFractionDigits:+sb.dataset.dec})+sb.dataset.suf;}
    const ty=el.querySelector('.typ');
    if(ty){const full=ty.dataset.full;const n=Math.min(full.length,Math.floor((t-f.t)/(f.cps||0.045)));ty.querySelector('span').textContent=full.slice(0,n);ty.querySelector('i').style.opacity=(n<full.length||Math.floor(t*3)%2)?1:0;}
  });
  // ---- destellos ----
  let fl=0; fx.filter((f)=>f.flash&&t>=f.t&&t<f.t+0.16).forEach((f)=>{fl=Math.max(fl,(1-(t-f.t)/0.16)*f.flash);});
  $('#flash').style.opacity=fl;
  // ---- subtítulos ----
  const cap=caps.find((c)=>t>=c.t0&&t<c.t1);
  const box=$('#cap'); box.style.top=(s.capY??1430)+'px'; box.style.display=(s.noCap||!cap)?'none':'flex';
  if(cap&&!s.noCap){
    const key=cap.t0+'';
    if(box.dataset.k!==key){box.dataset.k=key;box.innerHTML=cap.ws.map((w)=>'<span class="'+(w.hl?'hl':'')+'">'+w.w+'</span>').join('');}
    const pp=(t-cap.t0)/0.12; box.style.transform='translateX(-50%) scale('+(0.85+0.15*BACK(pp))+')';
    [...box.children].forEach((sp,i)=>sp.classList.toggle('on',!cap.ws[i].hl&&t>=cap.ws[i].t0&&t<(cap.ws[i+1]?.t0??cap.t1)));
  }
  // ---- grano ----
  const r=Math.floor(t*30)*7919; $('#grain').style.transform='translate('+(r%512)+'px,'+((r*3)%512)+'px)';
};`;

const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined });
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(EDITS);
mkdirSync(VID, { recursive: true }); mkdirSync(COV, { recursive: true });
for (const id of ids) {
  const e = { id, ...EDITS[id] };
  const J = JSON.parse(readFileSync(join(BASE, 'voz', `${id}.json`), 'utf8'));
  if (!J.words) throw new Error(`${id}: la voz no tiene tiempos por palabra; vuelva a generarla con voz.mjs`);
  const P = plan(e, J);
  if (process.env.DRY) { console.log(`✓ ${id} · plan válido · ${P.shots.length} planos`); continue; }
  grain();
  const dir = join(WORK, id); rmSync(dir, { recursive: true, force: true }); mkdirSync(join(dir, 'f'), { recursive: true });
  execFileSync('cp', [join(WORK, 'grain.png'), join(dir, 'grain.png')]);
  const hooks = P.shots.map((s, k) => {
    if (s.type !== 'hook') return '';
    if (s.bg) frames(s.bg.clip);
    const bg = s.bg ? `<img class="bgi" src="../frames/${s.bg.clip}/${String(Math.round(s.bg.t * FPS) + 1).padStart(5, '0')}.jpg">` : '';
    return `<div class="hook" id="hk${k}">${bg}<h1 style="${s.size ? `font-size:${s.size}px` : ''}">${s.text}</h1></div>`;
  }).join('');
  const fileUrl = (rel) => pathToFileURL(join(ROOT, rel)).href;
  const plates = P.shots.map((s, k) => {
    if (s.type === 'photo') {
      const src = fileUrl(s.src);
      return `<div class="ph" id="pk${k}"><img class="pbg" src="${src}"><img class="pfg" src="${src}" style="object-position:${s.pos || 'center'}">${s.label ? `<div class="plab">${s.label}</div>` : ''}</div>`;
    }
    if (s.type === 'stack') {
      const bg = s.bg ? fileUrl(s.bg) : fileUrl(s.cards[0].src);
      return `<div class="ph" id="pk${k}"><img class="pbg" src="${bg}">${s.cards.map((c, i) => `<div class="pcard" data-r="${c.rot ?? [-6, 5, -3, 7][i % 4]}" style="left:${c.x ?? 540}px;top:${c.y ?? 880 + i * 60}px;width:${c.w ?? 640}px;height:${c.h ?? 560}px"><img src="${fileUrl(c.src)}">${c.cap ? `<b>${c.cap}</b>` : ''}</div>`).join('')}${s.label ? `<div class="plab">${s.label}</div>` : ''}</div>`;
    }
    if (s.type === 'kinetic') {
      if (s.bg) frames(s.bg.clip);
      const ws = J.words.map((w) => ({ ...w, t0: w.t0 + (J.offset ?? 0.3) })).filter((w) => w.t0 >= s.t0 - 0.01 && w.t0 < s.t1 - 0.05);
      const hi = (s.hi || e.hi || []);
      const bg = s.bg ? `<img class="kbg" src="../frames/${s.bg.clip}/${String(Math.round(s.bg.t * FPS) + 1).padStart(5, '0')}.jpg">` : '';
      // Páginas cortas: máximo `per` palabras, cortando en la puntuación; cada página reemplaza a la anterior.
      const per = s.per || 5, pages = [[]];
      ws.forEach((w) => { const pg = pages[pages.length - 1]; pg.push(w); if (pg.length >= per || (/[.,:;?!…]$/.test(w.w) && pg.length >= 2)) pages.push([]); });
      if (!pages[pages.length - 1].length) pages.pop();
      const span = (w) => `<span class="${hi.includes(w.w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,:;…«»"]/g, '')) ? 'hl' : ''}" data-t="${w.t0}" style="${s.size ? `font-size:${s.size}px` : ''}">${w.w}</span>`;
      return `<div class="kin" id="pk${k}">${bg}${pages.map((pg, i) => `<div class="kw" data-a="${i ? pg[0].t0 : -1}" data-b="${pages[i + 1] ? pages[i + 1][0].t0 : 1e9}">${pg.map(span).join('')}</div>`).join('')}</div>`;
    }
    return '';
  }).join('');
  const stick = (f, i) => `<div class="st" id="fx${i}" style="left:${f.sticker.x}px;top:${f.sticker.y}px">${STICK[f.sticker.kind || 'tag'](f.sticker)}</div>`;
  const stickers = P.fx.map((f, i) => (f.sticker && f.sticker.space !== 'world' ? stick(f, i) : '')).join('');
  const worldFx = P.fx.map((f, i) => {
    if (f.tap) return `<div class="tap" id="fx${i}" style="left:${f.tap.x}px;top:${f.tap.y}px"><div class="ring"></div><div class="fin">👆</div></div>`;
    return f.sticker?.space === 'world' ? stick(f, i) : '';
  }).join('');
  const draws = P.fx.map((f, i) => (f.draw ? `<path id="fx${i}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${DRAW[f.draw.kind](f.draw)}" style="${f.draw.color ? `stroke:${f.draw.color}` : ''}"/>` : '')).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body class="f">
    <div id="stage">
      <div id="world"><img id="foot"><svg id="draw" viewBox="0 0 ${FW} ${FH}">${draws}</svg>${worldFx}</div>
      ${hooks}
      ${plates}
      ${await ctaHTML(e)}
      ${stickers}
      <div id="cap"></div><div id="leak"></div><div id="vig"></div><div id="grain"></div><div id="flash"></div>
    </div>
    <script>window.P=${JSON.stringify({ ...P, FW, FH, grade: e.grade ?? 'contrast(1.06) saturate(1.1)' })};${RUNTIME}</script></body></html>`;
  writeFileSync(join(dir, 'index.html'), html);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(pathToFileURL(join(dir, 'index.html')).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const N = Math.round(P.total * FPS);
  for (let f = 0; f < N; f++) {
    await page.evaluate((t) => window.render(t), f / FPS);
    await page.screenshot({ path: join(dir, 'f', String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 90 });
    if (f === Math.round((e.coverAt ?? 0.5) * FPS)) await page.screenshot({ path: join(COV, `${id}_${e.slug}.png`) });
  }
  await page.close();
  // Audio: voz + música de fondo (atenuada bajo la voz) + efectos en cada evento.
  const sfx = P.fx.filter((f) => f.sfx).map((f) => ({ file: join(SFX, `${f.sfx}.mp3`), t: Math.max(0, f.t + (f.sfxDt ?? 0)), vol: f.vol ?? 0.7 }));
  P.shots.filter((s) => s.trans === 'whip' || s.trans === 'zoom').forEach((s) => sfx.push({ file: join(SFX, 'whoosh.mp3'), t: Math.max(0, s.t0 - 0.12), vol: 0.55 }));
  const inputs = ['-i', join(BASE, 'voz', `${id}.mp3`), '-stream_loop', '-1', '-i', join(SFX, e.music ?? 'music.mp3'), ...sfx.flatMap((x) => ['-i', x.file])];
  let fc = `[1:a]adelay=${Math.round((J.offset ?? 0.3) * 1000)}:all=1,apad,atrim=0:${P.total},aresample=48000,asplit=2[v][vk];`;
  fc += `[2:a]atrim=0:${P.total},aresample=48000,volume=${e.musicVol ?? 0.5},afade=t=in:d=0.6,afade=t=out:st=${P.total - 1.2}:d=1.2[m0];[m0][vk]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[m];`;
  sfx.forEach((x, i) => { fc += `[${i + 3}:a]adelay=${Math.round(x.t * 1000)}:all=1,volume=${x.vol},aresample=48000[s${i}];`; });
  fc += `[v][m]${sfx.map((_, i) => `[s${i}]`).join('')}amix=inputs=${2 + sfx.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[au]`;
  const out = join(VID, `${e.file}.mp4`);
  execFileSync('ffmpeg', ['-nostdin', '-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, 'f', '%05d.jpg'), ...inputs, '-filter_complex', fc,
    '-map', '0:v', '-map', '[au]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-preset', 'medium', '-maxrate', '9M', '-bufsize', '18M', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', String(P.total), out], { stdio: ['ignore', 'inherit', 'inherit'] });
  rmSync(join(dir, 'f'), { recursive: true, force: true });
  console.log(`✓ ${e.file} · ${P.total.toFixed(1)} s · ${P.shots.length} planos · ${P.fx.length} efectos`);
}
await browser.close();

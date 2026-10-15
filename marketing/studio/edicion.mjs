// Edición "humana" para Reels (1080×1920, 30 cps): planos cortos de las grabaciones reales con cámara virtual
// (encuadre, empujes y golpes de zoom, pulso de mano), sacudidas, destellos, barridos entre planos, stickers,
// círculos y flechas dibujados a mano, subtítulos palabra por palabra, grano, música y efectos de sonido.
// Todo se ancla a palabras de la voz en off (out/semana-N/voz/<id>.json, con tiempos por palabra).
// Uso: SEMANA=muestra node edicion.mjs [id ...]   (lee semanas/semana-N/edicion.mjs)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BASE, OUT, SEMANA_DIR, BASE_CSS, BRAND as B, C, EMBLEM, topo, qr } from './lib.mjs';

const { EDITS } = await import(SEMANA_DIR + 'edicion.mjs');
const FPS = 30, W = 1080, H = 1920, FW = 1080, FH = 2337; // FW×FH: grabación del celular escalada a 1080 de ancho
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

// Grano de película: una textura de ruido que se desplaza en cada cuadro.
function grain() {
  const f = join(WORK, 'grain.png');
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
  shots.forEach((s) => {
    if (s.clip) s.n = frames(s.clip);
    s.cam = (s.cam || [{}]).map((c, i) => ({ x: FW / 2, y: FH / 2, z: 1, dur: 0.22, ...c, t: i === 0 ? s.t0 : T(c.at) }));
  });
  const fx = (e.fx || []).map((f) => ({ ...f, t: T(f.at) + (f.dt ?? 0), until: f.until !== undefined ? T(f.until) : undefined }));
  // Subtítulos: bloques de hasta 3 palabras (corta en la puntuación).
  const caps = [];
  let g = [];
  words.forEach((w, i) => {
    g.push(w);
    if (g.length >= 3 || /[.,:;?!…]$/.test(w.w) || i === words.length - 1) { caps.push(g); g = []; }
  });
  return { total, shots, fx, caps: caps.map((ws) => ({ t0: ws[0].t0, t1: ws.at(-1).t1 + 0.08, ws })) };
}

// ---------- piezas visuales ----------
const STICK = {
  tag: (s) => `<div class="tag2 ${s.tone || ''}" style="font-size:${s.size || 50}px">${s.text}</div>`,
  emoji: (s) => `<div class="emo" style="font-size:${s.size || 170}px">${s.text}</div>`,
  btn: (s) => `<div class="tag2 gold big">${s.text}</div>`,
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
  return `<div id="cta">${topo(1080, 1920, { seed: 9, opacity: 0.22 })}
    <div class="ctain">
      <img class="ci" data-k="0" src="${EMBLEM}" style="width:150px;height:150px">
      <h1 class="ci serif" data-k="1">${e.cta.title}</h1>
      <div class="ci tag2 gold big wig" data-k="2">${e.cta.button}</div>
      <div class="ci qrrow" data-k="3"><img src="${waQR}"><p>WhatsApp<br><b>${B.wa}</b></p></div>
      <p class="ci note" data-k="4">${e.cta.note}</p>
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
#hook{position:absolute;inset:0;display:none;align-items:center;justify-content:center;text-align:center}
#hook .bgi{position:absolute;inset:-60px;width:calc(100% + 120px);height:calc(100% + 120px);object-fit:cover;filter:blur(26px) brightness(.38) saturate(1.2)}
#hook h1{position:relative;font-family:Manrope;font-weight:800;font-size:150px;line-height:.98;color:${C.cream};letter-spacing:-.02em;text-transform:uppercase}
#hook h1 em{font-family:Fraunces;font-style:italic;font-weight:600;text-transform:none;color:${C.gold2}}
.st{position:absolute;transform-origin:50% 50%;opacity:0}
.tag2{display:inline-block;background:#fff;color:${C.ink};font-family:Manrope,Emoji;font-weight:800;padding:18px 30px;border-radius:22px;box-shadow:0 10px 0 rgba(0,0,0,.18),0 18px 40px rgba(0,0,0,.35);white-space:nowrap}
.tag2.gold{background:${C.gold};color:${C.ink}}
.tag2.ink{background:${C.ink};color:${C.cream};border:3px solid ${C.gold}}
.tag2.big{font-size:60px;padding:24px 42px;border-radius:999px}
.emo{font-family:Emoji;line-height:1;filter:drop-shadow(0 12px 18px rgba(0,0,0,.35))}
#flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
#grain{position:absolute;inset:-512px;background-image:url(grain.png);opacity:.07;mix-blend-mode:overlay;pointer-events:none}
#vig{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 45%,transparent 55%,rgba(0,0,0,.45));pointer-events:none}
#cap{position:absolute;left:540px;width:max-content;max-width:980px;transform-origin:0 50%;display:flex;flex-wrap:wrap;justify-content:center;gap:4px 26px;padding:14px 30px 20px;border-radius:30px;background:rgba(11,17,14,.62);backdrop-filter:blur(6px);pointer-events:none}
#cap span{font-family:Manrope,Emoji;font-weight:800;font-size:70px;line-height:1.12;color:#fff;paint-order:stroke;-webkit-text-stroke:10px ${C.ink};text-shadow:0 8px 0 rgba(0,0,0,.25);display:inline-block}
#cap span.on{color:${C.gold2};transform:scale(1.1) rotate(-2deg);margin:0 6px}
#cta{position:absolute;inset:0;background:${C.ink};display:none}
#cta .topo{position:absolute;inset:0}
.ctain{position:absolute;left:80px;right:80px;top:300px;bottom:520px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;text-align:center}
.ctain h1{font-size:120px;line-height:1;font-weight:500;color:${C.cream}}
.qrrow{display:flex;align-items:center;gap:30px;text-align:left}.qrrow img{width:230px;height:230px;border-radius:22px}
.qrrow p{font-size:34px;font-weight:600;line-height:1.3;color:${C.cream}}.qrrow b{font-size:44px;color:${C.gold2}}
.note{font-size:34px;font-weight:600;color:${C.cream};opacity:.8}
.ci{opacity:0}
`;

const RUNTIME = `
const E=(x)=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
const BACK=(x)=>{x=Math.max(0,Math.min(1,x));const c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
const $=(s)=>document.querySelector(s);
let lastSrc='';
window.render=async(t)=>{
  const {shots,fx,caps,total,FW,FH}=window.P;
  const s=shots.find((x)=>t>=x.t0&&t<x.t1)||shots.at(-1);
  // ---- metraje ----
  const isHook=s.type==='hook', isCta=s.type==='cta';
  $('#hook').style.display=isHook?'flex':'none';
  $('#cta').style.display=isCta?'block':'none';
  $('#world').style.display=(isHook||isCta)?'none':'block';
  if(!isHook&&!isCta){
    const lt=t-s.t0, len=s.t1-s.t0;
    const ct=s.to!==undefined?s.from+(s.to-s.from)*Math.min(1,lt/len):(s.from||0)+lt*(s.speed||1);
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
    $('#world').style.filter=blur?'blur('+blur+'px)':'none';
  }
  if(isHook){
    const p=(t-s.t0);
    const sc=p<0.18?BACK(p/0.18)*1:1+0.04*Math.sin(p*9);
    let sx=0; fx.filter((f)=>f.shake&&t>=f.t&&t<f.t+0.45).forEach((f)=>{sx+=Math.sin(t*95)*f.shake*(1-(t-f.t)/0.45);});
    $('#hook h1').style.transform='translateX('+sx+'px) scale('+sc+') rotate('+(-2+Math.sin(p*3)*1.2)+'deg)';
  }
  if(isCta){
    document.querySelectorAll('.ci').forEach((el)=>{const p=(t-s.t0-0.12*el.dataset.k)/0.32;el.style.opacity=E(p);el.style.transform='translateY('+((1-E(p))*60)+'px) scale('+(0.7+0.3*BACK(p))+')'+(el.classList.contains('wig')&&p>1?' rotate('+(Math.sin(t*7)*3)+'deg)':'');});
  }
  // ---- stickers y trazos ----
  fx.forEach((f,i)=>{
    const el=document.getElementById('fx'+i); if(!el) return;
    const end=f.until??s.t1;
    const on=t>=f.t&&t<end&&((f.shot===undefined)||true);
    const shot=shots.find((x)=>f.t>=x.t0&&f.t<x.t1);
    const live=on&&shot===s;
    if(f.draw){const pth=el; const p=live?E((t-f.t)/(f.speed||0.38)):0; pth.style.strokeDashoffset=1-p; pth.style.opacity=live?1:0; return;}
    if(!live){el.style.opacity=0;return;}
    const p=(t-f.t)/0.28, out=end-t<0.15?(end-t)/0.15:1;
    const sc=BACK(p)*out, wig=f.wiggle?Math.sin((t-f.t)*8)*3:0;
    el.style.opacity=Math.min(1,p*3)*out;
    el.style.transform='translate(-50%,-50%) scale('+sc+') rotate('+((f.rot||0)+wig)+'deg)';
  });
  // ---- destellos ----
  let fl=0; fx.filter((f)=>f.flash&&t>=f.t&&t<f.t+0.16).forEach((f)=>{fl=Math.max(fl,(1-(t-f.t)/0.16)*f.flash);});
  $('#flash').style.opacity=fl;
  // ---- subtítulos ----
  const cap=caps.find((c)=>t>=c.t0&&t<c.t1);
  const box=$('#cap'); box.style.top=(s.capY??1430)+'px'; box.style.display=(s.noCap||!cap)?'none':'flex';
  if(cap&&!s.noCap){
    const key=cap.t0+'';
    if(box.dataset.k!==key){box.dataset.k=key;box.innerHTML=cap.ws.map((w)=>'<span>'+w.w+'</span>').join('');}
    const pp=(t-cap.t0)/0.12; box.style.transform='translateX(-50%) scale('+(0.85+0.15*BACK(pp))+')';
    [...box.children].forEach((sp,i)=>sp.classList.toggle('on',t>=cap.ws[i].t0&&t<(cap.ws[i+1]?.t0??cap.t1)));
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
  grain();
  const dir = join(WORK, id); rmSync(dir, { recursive: true, force: true }); mkdirSync(join(dir, 'f'), { recursive: true });
  execFileSync('cp', [join(WORK, 'grain.png'), join(dir, 'grain.png')]);
  const hook = P.shots.find((s) => s.type === 'hook');
  const hookBg = hook?.bg ? `../frames/${hook.bg.clip}/${String(Math.round(hook.bg.t * FPS) + 1).padStart(5, '0')}.jpg` : '';
  if (hook?.bg) frames(hook.bg.clip);
  const stickers = P.fx.map((f, i) => {
    if (f.sticker) return `<div class="st" id="fx${i}" style="left:${f.sticker.x}px;top:${f.sticker.y}px">${STICK[f.sticker.kind || 'tag'](f.sticker)}</div>`;
    return '';
  }).join('');
  const draws = P.fx.map((f, i) => (f.draw ? `<path id="fx${i}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="${DRAW[f.draw.kind](f.draw)}" style="${f.draw.color ? `stroke:${f.draw.color}` : ''}"/>` : '')).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body class="f">
    <div id="stage">
      <div id="world"><img id="foot"><svg id="draw" viewBox="0 0 ${FW} ${FH}">${draws}</svg></div>
      <div id="hook">${hookBg ? `<img class="bgi" src="${hookBg}">` : ''}<h1>${hook?.text ?? ''}</h1></div>
      ${await ctaHTML(e)}
      ${stickers}
      <div id="cap"></div><div id="vig"></div><div id="grain"></div><div id="flash"></div>
    </div>
    <script>window.P=${JSON.stringify({ ...P, FW, FH })};${RUNTIME}</script></body></html>`;
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
  const sfx = P.fx.filter((f) => f.sfx).map((f) => ({ file: join(SFX, `${f.sfx}.mp3`), t: f.t + (f.sfxDt ?? 0), vol: f.vol ?? 0.7 }));
  P.shots.filter((s) => s.trans === 'whip' || s.trans === 'zoom').forEach((s) => sfx.push({ file: join(SFX, 'whoosh.mp3'), t: Math.max(0, s.t0 - 0.12), vol: 0.55 }));
  const inputs = ['-i', join(BASE, 'voz', `${id}.mp3`), '-stream_loop', '-1', '-i', join(SFX, e.music ?? 'music.mp3'), ...sfx.flatMap((x) => ['-i', x.file])];
  let fc = `[1:a]adelay=${Math.round((J.offset ?? 0.3) * 1000)}:all=1,apad,atrim=0:${P.total},aresample=48000,asplit=2[v][vk];`;
  fc += `[2:a]atrim=0:${P.total},aresample=48000,volume=${e.musicVol ?? 0.5},afade=t=in:d=0.6,afade=t=out:st=${P.total - 1.2}:d=1.2[m0];[m0][vk]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[m];`;
  sfx.forEach((x, i) => { fc += `[${i + 3}:a]adelay=${Math.round(x.t * 1000)}:all=1,volume=${x.vol},aresample=48000[s${i}];`; });
  fc += `[v][m]${sfx.map((_, i) => `[s${i}]`).join('')}amix=inputs=${2 + sfx.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[au]`;
  const out = join(VID, `${e.file}.mp4`);
  execFileSync('ffmpeg', ['-nostdin', '-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, 'f', '%05d.jpg'), ...inputs, '-filter_complex', fc,
    '-map', '0:v', '-map', '[au]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', String(P.total), out], { stdio: ['ignore', 'inherit', 'inherit'] });
  rmSync(join(dir, 'f'), { recursive: true, force: true });
  console.log(`✓ ${e.file} · ${P.total.toFixed(1)} s · ${P.shots.length} planos · ${P.fx.length} efectos`);
}
await browser.close();

// Portadas de la serie «Seguidores»: una pieza propia por video (sala de cine, entrada, juego, boleta, marquesina).
// 1080 × 1920; lo importante va dentro del recorte 3:4 del perfil (y 240 a 1680).
// Uso: SEMANA=seguidores node semanas/semana-seguidores/portadas.mjs
import { render, done, asset, C, EMBLEM } from '../../lib.mjs';

const W = 1080, H = 1920;
const ST = (n) => asset(`marketing/studio/out/semana-seguidores/stills/${n}.jpg`);
const WINE = '#3A0F17', WINE2 = '#5C1622', RED = '#B3263A';
const handle = (color = C.cream) => `<div style="position:absolute;left:0;right:0;bottom:250px;text-align:center;font:700 34px Manrope;letter-spacing:.22em;color:${color}">@REDVAERU</div>`;
const css = `.f{position:relative;overflow:hidden}
.ser{font-family:Fraunces;font-weight:500;line-height:.95;letter-spacing:-.02em}
.ser em{font-style:italic;color:${C.gold2}}
.mono{font-family:'Courier New',monospace}`;

const pieces = [];

// V01 · Proyectamos lugares: un proyector lanza un haz sobre una cinta con cinco lugares.
// Ninguna imagen se repite entre portadas: la cinta usa cinco lugares que no aparecen en las otras.
const frames = ['fogon-mapu_h', 'cabanas-lago-azul_h', 'pucon-aventura_h', 'poetas_h', 'kuchen-haus-frutillar_h'];
const labels = ['Temuco', 'Villarrica', 'Pucón', 'Nueva Imperial', 'Frutillar'];
pieces.push({
  file: 'portadas/V01_proyectamos-lugares.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:radial-gradient(120% 70% at 15% 0%,${WINE2},${WINE} 45%,#12060A)"></div>
  <div style="position:absolute;left:-200px;top:-120px;width:1500px;height:1300px;background:conic-gradient(from 118deg at 12% 8%,transparent 0deg,rgba(255,236,190,.28) 10deg,rgba(255,236,190,.08) 34deg,transparent 46deg);filter:blur(6px)"></div>
  <div style="position:absolute;left:70px;top:300px;font:700 30px Manrope;letter-spacing:.3em;color:${C.gold2}"><span style="color:#ff4d5e">●</span> FUNCIÓN EN CURSO</div>
  <div class="ser" style="position:absolute;left:66px;top:360px;font-size:150px;color:${C.cream}">Proyectamos<br><em>lugares.</em></div>
  <div style="position:absolute;left:-60px;top:830px;width:1200px;height:470px;background:#0a0405;transform:rotate(-4deg);box-shadow:0 30px 80px rgba(0,0,0,.6)">
    <div style="position:absolute;left:0;right:0;top:16px;height:26px;background:repeating-linear-gradient(90deg,transparent 0 22px,#f2ebdf22 22px 52px)"></div>
    <div style="position:absolute;left:0;right:0;bottom:16px;height:26px;background:repeating-linear-gradient(90deg,transparent 0 22px,#f2ebdf22 22px 52px)"></div>
    <div style="position:absolute;left:150px;top:60px;display:flex;gap:16px">${frames.map((f, i) => `<div style="position:relative;width:180px;height:350px;overflow:hidden;border-radius:6px"><img src="${ST(f)}" style="width:100%;height:100%;object-fit:cover;object-position:top"><span style="position:absolute;left:10px;bottom:10px;font:800 22px Manrope;color:${C.cream};background:rgba(0,0,0,.6);padding:4px 10px;border-radius:999px">${labels[i]}</span></div>`).join('')}</div>
  </div>
  <div style="position:absolute;left:70px;top:1400px;font:600 40px Manrope;color:${C.cream}">Del Caribe <span style="color:${C.gold2}">19° N</span> al sur <span style="color:${C.gold2}">41° S</span></div>
  <div style="position:absolute;left:70px;top:1470px;font:500 30px Manrope;color:rgba(242,235,223,.7)">Diez muestras de concepto · tres sitios reales</div>
  ${handle(C.gold2)}`,
});

// V02 · Primero el tráiler: una entrada de cine con la portada adentro y el talón «no paga».
pieces.push({
  file: 'portadas/V02_primero-el-trailer.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#4a0c16 0 40px,#6b1422 40px 70px,#3a0910 70px 110px);filter:saturate(1.1)"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.15) 40%,rgba(0,0,0,.7))"></div>
  <div class="ser" style="position:absolute;left:0;right:0;top:270px;text-align:center;font-size:132px;color:${C.cream}">Primero,<br>el <em>tráiler.</em></div>
  <div style="position:absolute;left:110px;top:640px;width:860px;height:760px;transform:rotate(-3deg);background:${C.cream};border-radius:28px;box-shadow:0 40px 90px rgba(0,0,0,.55)">
    <div style="position:absolute;left:0;right:0;top:536px;border-top:6px dashed ${WINE}55"></div>
    <div style="position:absolute;left:-26px;top:512px;width:52px;height:52px;border-radius:50%;background:#2a070c"></div><div style="position:absolute;right:-26px;top:512px;width:52px;height:52px;border-radius:50%;background:#2a070c"></div>
    <div style="position:absolute;left:40px;top:34px;font:800 28px Manrope;letter-spacing:.3em;color:${RED}">ADMIT ONE · SU PORTADA</div>
    <div style="position:absolute;left:40px;top:84px;width:780px;height:420px;border-radius:16px;overflow:hidden"><img src="${ST('hotel-casa-nogal_h')}" style="width:100%;height:100%;object-fit:cover;object-position:0 14%"><div style="position:absolute;inset:0;background:rgba(0,0,0,.25)"></div>
      <div style="position:absolute;left:50%;top:50%;width:150px;height:150px;margin:-75px;border-radius:50%;background:rgba(242,235,223,.92);display:flex;align-items:center;justify-content:center"><div style="margin-left:14px;border-left:56px solid ${RED};border-top:34px solid transparent;border-bottom:34px solid transparent"></div></div></div>
    <div style="position:absolute;left:40px;top:580px;font:800 54px Manrope;color:${WINE}">Si no le convence,</div>
    <div class="ser" style="position:absolute;left:40px;top:648px;font-size:66px;font-style:italic;color:${RED}">no paga nada.</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:1480px;text-align:center;font:600 38px Manrope;color:${C.cream}">🎁 Y revisamos su web <b style="color:${C.gold2}">gratis</b></div>
  ${handle()}`,
});

// V03 · ¿Cuál es la real?: cuatro portadas numeradas y un signo de pregunta enorme.
const four = ['villa-coral-samana_h', 'vina-los-robles_h', 'miah_h', 'termas-rayenko_h'];
pieces.push({
  file: 'portadas/V03_cual-es-la-real.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:${C.ink}"></div>
  <div class="ser" style="position:absolute;left:0;right:0;top:250px;text-align:center;font-size:120px;color:${C.cream}">¿Cuál es<br><em>la real?</em></div>
  <div style="position:absolute;left:80px;top:560px;display:grid;grid-template-columns:440px 440px;gap:40px">${four.map((f, i) => `<div style="position:relative;height:500px;border-radius:26px;overflow:hidden;border:4px solid ${C.cream};transform:rotate(${[-3, 2, 2, -2][i]}deg)"><img src="${ST(f)}" style="width:100%;height:100%;object-fit:cover;object-position:top"><span style="position:absolute;left:18px;top:14px;font:600 110px Fraunces;font-style:italic;color:${C.gold2};-webkit-text-stroke:6px ${C.ink};paint-order:stroke">${i + 1}</span></div>`).join('')}</div>
  <div style="position:absolute;left:50%;top:1100px;transform:translate(-50%,-50%) rotate(8deg);font:700 520px Fraunces;color:${C.gold};-webkit-text-stroke:14px ${C.ink};paint-order:stroke;text-shadow:0 30px 60px rgba(0,0,0,.6)">?</div>
  <div style="position:absolute;left:50%;top:1600px;transform:translateX(-50%) rotate(-2deg);background:${C.gold2};color:${C.ink};font:800 46px Manrope;padding:16px 36px;border-radius:20px;white-space:nowrap">👀 Solo una existe</div>
  ${handle().replace('bottom:250px', 'bottom:110px')}`,
});

// V04 · Comisiones: una boleta larga que termina en el total, con timbre rojo.
const line = (a, b, s = '') => `<div style="display:flex;justify-content:space-between;${s}"><span>${a}</span><span>${b}</span></div>`;
pieces.push({
  file: 'portadas/V04_cuanto-le-cuestan-las-comisiones.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 40%,#2b1013,#0d0607)"></div>
  <div class="ser" style="position:absolute;left:0;right:0;top:250px;text-align:center;font-size:110px;color:${C.cream}">¿Cuánto le cuesta<br><em>Booking?</em></div>
  <div class="mono" style="position:absolute;left:170px;top:560px;width:740px;padding:50px 54px 70px;background:#F4EFE4;color:#1b1414;font-size:38px;line-height:1.7;transform:rotate(2deg);box-shadow:0 40px 90px rgba(0,0,0,.6);clip-path:polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)">
    <div style="text-align:center;font-weight:700;letter-spacing:.2em">CABAÑAS · BOLETA</div>
    <div style="border-top:3px dashed #1b141466;margin:18px 0"></div>
    ${line('Tarifa noche', '$60.000')}${line('Noches/mes', 'x 20')}${line('Meses', 'x 12')}${line('Comisión', '15%')}
    <div style="border-top:3px dashed #1b141466;margin:18px 0"></div>
    ${line('TOTAL AÑO', '', 'font-weight:700')}
    <div style="text-align:right;font:700 96px Manrope;letter-spacing:-.03em;color:${RED}">$2.160.000</div>
  </div>
  <div style="position:absolute;left:600px;top:1280px;transform:rotate(-14deg);border:8px solid ${RED};color:${RED};font:800 44px Manrope;letter-spacing:.08em;padding:10px 26px;border-radius:14px;background:rgba(244,239,228,.85)">SOLO EN<br>COMISIONES</div>
  <div style="position:absolute;left:0;right:0;top:1500px;text-align:center;font:600 40px Manrope;color:${C.cream}">🧮 Haga su cuenta · <b style="color:${C.gold2}">gratis</b></div>
  ${handle()}`,
});

// V05 · Próximamente: su lugar: marquesina con ampolletas y el nombre por escribir.
const bulbs = (n, horiz) => Array.from({ length: n }, () => `<i style="display:block;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle,#fff7d6,#f5c86a 55%,#a86d16);box-shadow:0 0 22px #ffd27a"></i>`).join('');
pieces.push({
  file: 'portadas/V05_proximamente-su-lugar.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#14070a,${WINE} 55%,#14070a)"></div>
  <div style="position:absolute;left:70px;top:250px;width:940px;height:600px;border-radius:30px;background:#1c0a0e;border:6px solid ${C.gold};box-shadow:0 0 80px rgba(255,200,110,.25)">
    <div style="position:absolute;left:24px;right:24px;top:18px;display:flex;justify-content:space-between">${bulbs(18)}</div>
    <div style="position:absolute;left:24px;right:24px;bottom:18px;display:flex;justify-content:space-between">${bulbs(18)}</div>
    <div style="position:absolute;left:0;right:0;top:80px;text-align:center;font:800 58px Manrope;letter-spacing:.32em;color:${C.gold2}">PRÓXIMAMENTE</div>
    <div style="position:absolute;left:70px;right:70px;top:180px;height:300px;background:#F4EFE4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-direction:column;background-image:repeating-linear-gradient(180deg,transparent 0 98px,#00000018 98px 100px)">
      <div style="font:800 118px Manrope;letter-spacing:.04em;color:#140a0c">SU LUGAR<span style="color:${RED}">_</span></div>
      <div style="font:600 32px Manrope;letter-spacing:.24em;color:#140a0c99">EN CARTELERA</div>
    </div>
  </div>
  <div style="position:absolute;left:90px;top:900px;width:900px;height:560px;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6)"><img src="${ST('sv-estreno_c')}" style="width:100%;height:auto;margin-top:-150px"></div>
  <div class="ser" style="position:absolute;left:0;right:0;top:1500px;text-align:center;font-size:66px;color:${C.cream}">Escriba su nombre.<br><em>Véalo en cartelera.</em></div>
  ${handle(C.gold2).replace('bottom:250px', 'bottom:150px')}`,
});

await render(pieces);
await done();

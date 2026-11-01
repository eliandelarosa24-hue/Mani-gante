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

// ── Segunda tanda (Reels 6 a 10): otras cinco ideas, sin repetir imágenes de la primera ──
import { readFileSync } from 'node:fs';
const EMB = readFileSync(new URL('./emblema.svg', import.meta.url), 'utf8').replace(/^[\s\S]*?<\/style>/, '').replace(/<\/svg>\s*$/, '').replace('stroke-width="2.6"', 'stroke-width="3.2"');
const BR = (n) => asset(`marketing/studio/out/broll/${n}.jpg`);
const MU = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);

// V06 · Un solo tronco: el emblema partido en dos cielos, Caribe arriba y bosque del sur abajo.
pieces.push({
  file: 'portadas/V06_un-solo-tronco.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;left:0;right:0;top:0;height:960px;background:linear-gradient(180deg,#0b5f6b,#1f8f8a 70%,#e8c27a)"></div>
  <div style="position:absolute;left:0;right:0;top:960px;bottom:0;background:linear-gradient(180deg,#1d3b2c,#0d1a13)"></div>
  <div style="position:absolute;left:0;right:0;top:956px;height:8px;background:${C.cream}"></div>
  <div style="position:absolute;left:50%;top:960px;transform:translate(-50%,-50%);width:760px;height:760px;color:${C.cream};filter:drop-shadow(0 20px 40px rgba(0,0,0,.45))"><svg viewBox="0 0 120 120" width="760" height="760">${EMB}</svg></div>
  <div style="position:absolute;left:70px;top:270px;font:800 34px Manrope;letter-spacing:.28em;color:#fff">🇩🇴 EL CARIBE</div>
  <div style="position:absolute;right:70px;top:1590px;font:800 34px Manrope;letter-spacing:.28em;color:${C.gold2}">LA ARAUCANÍA 🇨🇱</div>
  <div class="ser" style="position:absolute;left:0;right:0;top:1380px;text-align:center;font-size:96px;color:${C.cream};text-shadow:0 6px 30px rgba(0,0,0,.6)">Un solo tronco,<br><em>dos raíces.</em></div>
  ${handle().replace('bottom:250px', 'bottom:150px')}`,
});

// V07 · Son las 23:00: noche, reloj gigante y la cabaña real iluminada dentro de un celular.
pieces.push({
  file: 'portadas/V07_son-las-23.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:radial-gradient(70% 45% at 50% 30%,#1b2a4a,#070b16 70%)"></div>
  ${Array.from({ length: 70 }, (_, i) => `<i style="position:absolute;left:${(i * 137) % 1080}px;top:${(i * 263) % 900}px;width:${i % 5 ? 3 : 5}px;height:${i % 5 ? 3 : 5}px;border-radius:50%;background:#fff;opacity:${0.3 + (i % 4) * 0.15}"></i>`).join('')}
  <div class="mono" style="position:absolute;left:0;right:0;top:250px;text-align:center;font:700 250px 'Courier New',monospace;letter-spacing:-.02em;color:#ffd27a;text-shadow:0 0 50px rgba(255,190,90,.55)">23:00</div>
  <div style="position:absolute;left:300px;top:560px;width:480px;height:880px;border-radius:64px;background:#050608;padding:16px;box-shadow:0 0 0 3px #2b3550,0 40px 120px rgba(255,200,120,.25)"><div style="width:100%;height:100%;border-radius:50px;overflow:hidden;position:relative"><img src="${BR('miah-exterior-cielo')}" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;left:24px;right:24px;bottom:30px;background:#25d366;color:#05210f;border-radius:20px;padding:18px;font:800 30px Manrope;text-align:center">Reservar por WhatsApp</div></div></div>
  <div style="position:absolute;left:0;right:0;top:1490px;text-align:center;font:600 42px Manrope;color:${C.cream}">Su web <span style="color:#ffd27a">trabaja</span> mientras usted duerme</div>
  <div style="position:absolute;left:0;right:0;top:1560px;text-align:center;font:500 30px Manrope;color:rgba(242,235,223,.7)">Caso real · Cabañas Miah y Noah, Curacautín</div>
  ${handle('#ffd27a').replace('bottom:250px', 'bottom:150px')}`,
});

// V08 · 3 errores: señalética de advertencia, tres tarjetas tachadas.
const errs = ['Depender solo de Booking o Instagram', 'Fotos sin orden', 'Que no sepan cómo reservar'];
pieces.push({
  file: 'portadas/V08_tres-errores.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:#f2c230"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:120px;background:repeating-linear-gradient(-45deg,#111 0 40px,#f2c230 40px 80px)"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:120px;background:repeating-linear-gradient(-45deg,#111 0 40px,#f2c230 40px 80px)"></div>
  <div style="position:absolute;left:70px;top:260px;font:800 150px Manrope;line-height:.9;letter-spacing:-.04em;color:#111">3 ERRORES</div>
  <div style="position:absolute;left:74px;top:410px;font:700 54px Manrope;color:#111">que le cuestan <span style="background:#111;color:#f2c230;padding:0 14px">reservas</span></div>
  ${errs.map((e, i) => `<div style="position:absolute;left:70px;right:70px;top:${560 + i * 290}px;height:250px;background:#111;border-radius:28px;display:flex;align-items:center;gap:36px;padding:0 44px;transform:rotate(${[-1.5, 1, -1][i]}deg)"><span style="font:800 140px Manrope;color:#f2c230">${i + 1}</span><span style="font:700 50px Manrope;line-height:1.1;color:#fff">${e}</span><span style="margin-left:auto;font:800 110px Manrope;color:#ff4d3d">✕</span></div>`).join('')}
  <div style="position:absolute;left:0;right:0;bottom:160px;text-align:center;font:800 34px Manrope;letter-spacing:.22em;color:#111">@REDVAERU · ¿CUÁNTOS TIENE USTED?</div>`,
});

// V09 · Restaurante a leña: el plato bajo el humo y el kultrún dibujado como sello.
pieces.push({
  file: 'portadas/V09_restaurante-a-lena.png', w: W, h: H, cls: '', css,
  html: `<img src="${MU('fogon-mapu', 'tiempo-3.webp')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,4,2,.85),rgba(10,4,2,.2) 40%,rgba(10,4,2,.9) 78%)"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(60% 40% at 50% 100%,rgba(255,120,40,.35),transparent 70%)"></div>
  <div class="ser" style="position:absolute;left:70px;top:270px;font-size:128px;color:${C.cream}">¿Su restaurante<br>huele a <em style="color:#ff9a4a">leña?</em></div>
  <svg style="position:absolute;right:70px;top:1180px" width="260" height="260" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#e9d6b4" stroke="#7a2a12" stroke-width="3"/><path d="M18 18L82 82M82 18L18 82" stroke="#7a2a12" stroke-width="3"/><circle cx="50" cy="22" r="5" fill="#9b2c14"/><circle cx="78" cy="50" r="6" fill="#9b2c14"/><path d="M22 46a7 7 0 1 0 6 10a6 6 0 1 1-6-10z" fill="#9b2c14"/><path d="M46 78l4-8 4 8z" fill="#9b2c14"/></svg>
  <div style="position:absolute;left:70px;top:1480px;font:700 46px Manrope;color:${C.cream}">Webs que <span style="color:#ff9a4a">cuentan su cocina</span></div>
  <div style="position:absolute;left:70px;top:1550px;font:500 28px Manrope;color:rgba(242,235,223,.7)">Fogón Mapu · muestra de concepto (negocio ficticio)</div>
  ${handle('#ff9a4a')}`,
});

// V10 · Del 19 al 41: una regla de latitud vertical, sin fotos.
const lats = [['19° N', 'Samaná', 0], ['34° S', 'Colchagua', 0.42], ['38° S', 'Temuco', 0.62], ['39° S', 'Pucón', 0.72], ['41° S', 'Frutillar', 0.92]];
pieces.push({
  file: 'portadas/V10_del-19-al-41.png', w: W, h: H, cls: '', css,
  html: `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#0e2235,#0a1119 60%,#1a0f0a)"></div>
  <div class="ser" style="position:absolute;left:70px;top:250px;font-size:116px;color:${C.cream}">Del paralelo<br><em>19 al 41.</em></div>
  <div style="position:absolute;left:330px;top:620px;width:6px;height:900px;background:linear-gradient(${C.gold2},${C.gold})"></div>
  ${Array.from({ length: 31 }, (_, i) => `<div style="position:absolute;left:${i % 5 ? 312 : 296}px;top:${620 + i * 30}px;width:${i % 5 ? 24 : 40}px;height:3px;background:${C.gold}88"></div>`).join('')}
  <div style="position:absolute;left:250px;top:${620 + 0.18 * 900}px;font:800 24px Manrope;letter-spacing:.3em;color:#ff6b6b">— ECUADOR</div>
  ${lats.map(([l, n, k]) => `<div style="position:absolute;left:310px;top:${620 + k * 900 - 22}px;width:46px;height:46px;border-radius:50%;background:${C.gold2};box-shadow:0 0 30px ${C.gold2}"></div><div style="position:absolute;left:110px;top:${620 + k * 900 - 20}px;font:700 34px Manrope;color:${C.gold2}">${l}</div><div class="ser" style="position:absolute;left:400px;top:${620 + k * 900 - 40}px;font-size:70px;color:${C.cream}">${n}</div>`).join('')}
  <div style="position:absolute;left:0;right:0;top:1580px;text-align:center;font:700 40px Manrope;color:${C.cream}">¿Y el suyo, <span style="color:${C.gold2}">dónde está?</span> 📍</div>
  ${handle(C.gold2).replace('bottom:250px', 'bottom:150px')}`,
});

await render(pieces);
await done();

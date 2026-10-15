// Semana 1 (15 al 25 de octubre de 2026): imágenes de la campaña «Su web lista antes del verano».
import { topo, icon, dots, asset, EMBLEM, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
const { add, W, H, SH, waQR, waQRgold, cartaQR, slide, story, cta, phone, list, plan, phoneCover, cover, wide, ad, MIAH_M, POETAS_M, HERO } = k;
// ---------- Perfil ----------
add({ file: 'perfil/foto-perfil.png', w: 1080, h: 1080, cls: 'ink', html: `${topo(1080, 1080, { seed: 7, opacity: 0.16, rings: 14, centers: [[540, 540]] })}<img src="${EMBLEM}" style="position:absolute;left:190px;top:190px;width:700px;height:700px">` });
add({
  file: 'perfil/portada-facebook.png', w: 1640, h: 624, cls: 'ink',
  html: `${topo(1640, 624, { seed: 11 })}
    <div style="position:absolute;left:520px;right:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:22px">
      <div class="eyebrow" style="font-size:24px">Red Vaeru · Araucanía</div>
      <h1 class="serif" style="font-size:72px;line-height:1.05;font-weight:500">Webs para el turismo <em>del sur</em></h1>
      <p style="font-size:30px;font-weight:600;opacity:.9">Cabañas · hostales · glamping · restaurantes &nbsp;·&nbsp; Vea su portada antes de pagar</p>
    </div>`,
});
const HL = [['planes', 'star', 'Planes'], ['casos', 'home', 'Casos'], ['muestras', 'photo', 'Muestras'], ['como-trabajo', 'calendar', 'Cómo trabajo'], ['dudas', 'question', 'Dudas']];
for (const [id, ic, label] of HL) {
  add({ file: `perfil/destacadas/${id}.png`, w: W, h: SH, cls: 'ink', html: `<div style="position:absolute;left:290px;top:710px;width:500px;height:500px;border-radius:50%;border:4px solid ${C.gold};display:grid;place-items:center;background:${C.ink3}">${icon(ic, 250, C.gold2, 1.4)}</div><p class="serif" style="position:absolute;top:1290px;width:100%;text-align:center;font-size:64px">${label}</p>` });
}

// ---------- P01 · Presentación (jue 15, 19:30) ----------
const P01 = '2026-10-15_1930_P01_presentacion';
add({
  file: `${P01}/01.png`, w: W, h: H, cls: 'ink',
  html: `${topo(W, H, { seed: 2 })}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:40px;padding:0 90px">
      <img src="${EMBLEM}" style="width:260px;height:260px">
      <h1 class="serif" style="font-size:110px;line-height:1.02;font-weight:500">Webs para el turismo <em>del sur</em></h1>
      <p style="font-size:40px;font-weight:600;letter-spacing:.04em;opacity:.9">Cabañas · hostales · glamping · restaurantes</p>
    </div>
    <div class="foot">${dots(0, 5)}<span>Deslice →</span></div>`,
});
slide({ file: `${P01}/01-B.png`, seed: 2, eyebrow: 'Pregunta para anfitriones', title: '¿Su cabaña está <em>solo en Booking?</em>', body: 'Le muestro cómo se vería su web propia, antes de que pague nada.', align: 'center', titleSize: 116, n: 0, total: 5 });
slide({ file: `${P01}/02.png`, cls: 'cream', eyebrow: 'Quién soy', title: 'Soy Jorge.', body: 'Estudio Ingeniería en Turismo en INACAP y diseño páginas web para negocios de la Araucanía: cabañas, hostales, glamping y restaurantes.', align: 'center', titleSize: 130, n: 1, total: 5 });
slide({ file: `${P01}/03.png`, seed: 4, eyebrow: 'Para qué', title: 'Para que sus clientes <em>reserven y pidan directo</em>', body: 'Sin depender solo de las plataformas. Fotos, ubicación, precios y un botón directo a su WhatsApp.', extra: `<div style="display:flex;gap:28px;margin-top:10px">${icon('home', 86)}${icon('chat', 86)}${icon('pin', 86)}</div>`, align: 'center', n: 2, total: 5 });
add({
  file: `${P01}/04.png`, w: W, h: H, cls: 'paper',
  html: `<div style="position:absolute;top:110px;left:80px;right:80px"><div class="eyebrow">Ya en el aire</div><h1 class="serif" style="font-size:70px;line-height:1.05;margin-top:20px;font-weight:500">Dos webs reales en la Araucanía</h1></div>
    <div style="position:absolute;top:350px;left:0;right:0;display:flex;justify-content:center;gap:60px">
      <div style="text-align:center">${phone(MIAH_M, 330, -2)}<p style="margin-top:26px;font-size:32px;font-weight:700">Cabañas Miah y Noah</p><p style="font-size:26px;opacity:.7">Curacautín</p></div>
      <div style="text-align:center">${phone(POETAS_M, 330, 2)}<p style="margin-top:26px;font-size:32px;font-weight:700">El Rincón de los Poetas</p><p style="font-size:26px;opacity:.7">Almagro, Nueva Imperial</p></div>
    </div>`,
});
slide({ file: `${P01}/05.png`, seed: 6, eyebrow: 'Garantía de portada', title: 'Primero ve su portada. <em>Si no le convence, no paga.</em>', extra: `${cta()}<p style="font-size:34px;font-weight:600;opacity:.85">WhatsApp ${B.wa}</p>`, align: 'center', n: 4, total: 5 });

// ---------- P03 · Planes y precios (vie 16, 19:30) ----------
const P03 = '2026-10-16_1930_P03_planes-y-precios';
slide({ file: `${P03}/01.png`, seed: 8, eyebrow: `Precios de lanzamiento · ${B.cupos} cupos`, title: '¿Cuánto cuesta <em>su web?</em>', body: 'Precios claros, sin letra chica. Deslice →', align: 'center', titleSize: 130, n: 0, total: 6 });
slide({ file: `${P03}/01-B.png`, seed: 8, eyebrow: `Precios de lanzamiento · ${B.cupos} cupos`, title: `Su web desde ${B.carta}. <em>Sí, en serio.</em>`, body: 'Deslice para ver qué incluye →', align: 'center', titleSize: 116, n: 0, total: 6 });
plan(`${P03}/02.png`, 1, 'fork', 'Carta QR', 'Restaurantes y cafés', B.carta, B.esencialNormal, ['Carta digital con sus fotos y su marca', 'QR para cada mesa', 'Botón de WhatsApp para pedidos', 'Ubicación y textos para Google']);
plan(`${P03}/03.png`, 2, 'home', 'Esencial', 'Cabañas y hostales', B.esencial, B.esencialNormal, ['Una página con fotos, ubicación y contacto', 'Botón de WhatsApp y formulario', 'Textos para aparecer en Google', 'Logo de regalo si aún no tiene']);
plan(`${P03}/04.png`, 3, 'tree', 'Temporada', `Solo ${B.cuposTemporada} cupos · lista antes del 30 nov`, B.temporada, '', ['Web completa: unidades, servicios y entorno', 'Galería por espacios y mapa', 'Reservas por WhatsApp o enlace a su sistema', 'Ficha de Google + 1 mes de mantención gratis']);
slide({ file: `${P03}/05.png`, seed: 14, eyebrow: 'Incluido en todos los planes', title: 'Sin sorpresas', extra: list(['Contrato de servicios por escrito', 'Dominio y hosting el primer año', 'Diseño pensado para el celular', 'Pago 50% al aprobar y 50% al publicar', 'Todo queda a su nombre']), align: 'center', n: 4, total: 6, titleSize: 100 });
slide({ file: `${P03}/06.png`, cls: 'cream', eyebrow: 'Garantía de portada', title: 'Primero ve su portada. <em>Si no le convence, no paga.</em>', extra: `<div style="display:flex;align-items:center;gap:40px"><img src="${waQR}" style="width:220px;height:220px;border-radius:16px"><p style="font-size:38px;font-weight:700;line-height:1.35">Escríbame<br>PORTADA, CARTA<br>o TEMPORADA</p></div>`, align: 'center', n: 5, total: 6, titleSize: 96 });

// ---------- P05 · Garantía (dom 18, 12:00) ----------
const P05 = '2026-10-18_1200_P05_garantia';
const steps = `<div style="display:flex;flex-direction:column;gap:22px;margin-top:10px">${[['1', 'Le diseño la portada con sus fotos'], ['2', 'Si le gusta, firmamos y paga el 50%'], ['3', 'El resto, al publicar']].map(([n, t]) => `<div class="card" style="display:flex;align-items:center;gap:28px;padding:26px 34px"><span class="serif" style="font-size:64px;color:#8a6a2a;width:50px">${n}</span><span style="font-size:38px;font-weight:600">${t}</span></div>`).join('')}</div>`;
slide({ file: `${P05}/01.png`, cls: 'cream', eyebrow: 'Garantía de portada', title: 'Primero ve su web. <em>Si no le convence, no paga.</em>', extra: steps, titleSize: 96 });
slide({ file: `${P05}/01-B.png`, cls: 'cream', eyebrow: 'Garantía de portada', title: '¿Y si no me gusta? <em>Entonces no paga.</em>', extra: steps, titleSize: 100 });

// ---------- C01 · 5 cosas antes de diciembre (mar 20, 19:30) ----------
const C01 = '2026-10-20_1930_C01_checklist-temporada';
slide({ file: `${C01}/01.png`, seed: 20, eyebrow: 'Checklist de temporada', title: 'Antes de diciembre, <em>revise esto</em>', body: '5 cosas que su web necesita para recibir el verano. Guárdelo ✓', align: 'center', titleSize: 118, n: 0, total: 7 });
slide({ file: `${C01}/01-B.png`, seed: 20, eyebrow: '5 puntos · 1 minuto', title: 'Checklist de temporada <em>para su cabaña</em>', body: 'Guárdelo y revíselo con calma ✓', align: 'center', titleSize: 112, n: 0, total: 7 });
const tips = [
  ['phone', 'Que se vea bien en el celular', 'La mayoría de sus huéspedes lo va a buscar desde el teléfono.'],
  ['chat', 'Botón de WhatsApp a la vista', 'Si tiene que buscar su número, se va a otra cabaña.'],
  ['photo', 'Fotos por espacio', 'Dormitorio, cocina, tinaja, vista. No 40 fotos revueltas.'],
  ['pin', 'Cómo llegar', 'Mapa y distancias: al Conguillío, al lago, al centro.'],
  ['doc', 'Sus políticas claras', 'Check-in, mascotas, abonos. Menos preguntas repetidas.'],
];
tips.forEach(([ic, t, b], i) => slide({ file: `${C01}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 21 + i, eyebrow: `Punto ${i + 1} de 5`, title: t, body: b, extra: `<div style="margin-top:20px">${icon(ic, 120, i % 2 ? C.gold : '#8a6a2a', 1.3)}</div>`, align: 'center', titleSize: 100, n: i + 1, total: 7 }));
slide({ file: `${C01}/07.png`, seed: 27, eyebrow: 'Revisión gratis', title: '¿Su web cumple los 5? <em>Se la reviso gratis.</em>', extra: cta(), align: 'center', n: 6, total: 7 });

// ---------- P07 · Paquete Temporada (jue 22, 19:30) ----------
const P07 = '2026-10-22_1930_P07_paquete-temporada';
const temporadaPost = (file, titleHtml) => add({
  file, w: W, h: H, cls: 'ink',
  html: `${topo(W, H, { seed: 18 })}
    <img class="emb" src="${EMBLEM}" style="top:64px;right:72px">
    <span class="tag" style="top:70px;left:72px">Temporada · ${B.cuposTemporada} cupos · ${B.temporada}</span>
    <div style="position:absolute;left:80px;width:560px;top:200px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:30px">
      <h1 class="serif" style="font-size:88px;line-height:1.02;font-weight:500">${titleHtml}</h1>
      <p style="font-size:32px;font-weight:600;line-height:1.4">Web completa + ficha de Google + 1 mes de mantención gratis. Lista antes del 30 de noviembre.</p>
      ${cta('TEMPORADA')}
    </div>
    <div style="position:absolute;right:-30px;top:250px">${phone(MIAH_M, 400, 4)}</div>
    <span style="position:absolute;right:40px;bottom:70px;font-size:22px;font-weight:600;opacity:.8">Caso real: Cabañas Miah y Noah</span>`,
});
temporadaPost(`${P07}/01.png`, 'Que el verano lo encuentre con <em>web propia</em>');
temporadaPost(`${P07}/01-B.png`, '6 semanas para la temporada. <em>¿Su web está lista?</em>');

// ---------- C02 · "Ya estoy en Booking" (sáb 24, 11:30) ----------
const C02 = '2026-10-24_1130_C02_ya-estoy-en-booking';
slide({ file: `${C02}/01.png`, seed: 30, eyebrow: 'La pregunta de la semana', title: '"Ya estoy en Booking, <em>¿para qué quiero una web?"</em>', align: 'center', titleSize: 104, n: 0, total: 6 });
slide({ file: `${C02}/01-B.png`, seed: 30, eyebrow: 'La pregunta de la semana', title: '¿Web propia o Booking? <em>Las dos.</em>', body: 'Y le explico por qué →', align: 'center', titleSize: 112, n: 0, total: 6 });
slide({ file: `${C02}/02.png`, cls: 'cream', title: 'Buena pregunta.', body: 'Booking le trae huéspedes <b>nuevos</b>. Sígalo usando.', align: 'center', titleSize: 110, n: 1, total: 6 });
slide({ file: `${C02}/03.png`, seed: 32, title: 'Pero el huésped que <em>vuelve</em>…', body: '…el que lo encontró en Instagram o el que le pidió el dato a un amigo: ¿adónde lo manda?', align: 'center', titleSize: 104, n: 2, total: 6 });
slide({ file: `${C02}/04.png`, cls: 'cream', title: 'Su web es <em>su vitrina</em>', body: 'Fotos, precios, ubicación y su WhatsApp. Sin comisión por esas reservas directas.', extra: `<div style="display:flex;gap:28px">${icon('photo', 80, '#8a6a2a')}${icon('pin', 80, '#8a6a2a')}${icon('chat', 80, '#8a6a2a')}</div>`, align: 'center', titleSize: 104, n: 3, total: 6 });
slide({ file: `${C02}/05.png`, seed: 34, title: 'Y si cambian las reglas de la plataforma…', body: '…usted sigue teniendo su propio canal.', align: 'center', titleSize: 96, n: 4, total: 6 });
slide({ file: `${C02}/06.png`, seed: 35, eyebrow: 'Garantía de portada', title: 'Vea cómo se vería la suya, <em>antes de pagar</em>', extra: cta(), align: 'center', n: 5, total: 6 });

// ---------- Historias ----------
const S01 = '2026-10-19_2030_S01_historias-tiene-web';
story({ file: `${S01}/1.png`, title: 'Pregunta rápida para <em>anfitriones</em> 🏡' });
story({ file: `${S01}/2.png`, cls: 'cream', title: '¿Su alojamiento tiene <em>web propia?</em>' });
story({ file: `${S01}/3.png`, title: 'Si respondió "no", <em>no es el único.</em>', body: 'La mayoría de las cabañas que reviso esta semana están solo en Booking o Airbnb.' });
story({ file: `${S01}/4.png`, title: 'Le muestro cómo se vería <em>la suya</em>, gratis.', extra: cta() });
const S02 = '2026-10-21_2030_S02_historias-preguntas';
story({ file: `${S02}/1.png`, title: '¿Dudas sobre tener una web? <em>Pregúnteme.</em>' });
story({ file: `${S02}/2.png`, cls: 'cream', eyebrow: 'Las más comunes', title: '¿Cuánto cuesta? <br>¿La puedo editar yo? <br><em>¿Y si no me gusta?</em>', titleSize: 92 });
story({ file: `${S02}/3.png`, eyebrow: 'Respuesta corta', extra: list([`Desde ${B.carta}`, 'Sí, le enseño a cambiar textos y fotos', 'Si no le gusta la portada, no paga'], C.gold, 52) });
story({ file: `${S02}/4.png`, title: '¿Otra duda? <em>Escríbame.</em>', extra: `<img src="${waQRgold}" style="width:360px;height:360px;border-radius:20px;padding:20px;background:${C.gold2}"><p style="font-size:40px;font-weight:700">WhatsApp ${B.wa}</p>` });
const S03 = '2026-10-23_2030_S03_historias-cupos';
for (let n = B.cupos; n >= 1; n--) story({ file: `${S03}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Precios de lanzamiento solo para los primeros clientes.', titleSize: 140 });
for (let n = B.cuposTemporada; n >= 1; n--) story({ file: `${S03}/2_temporada-${n}-de-${B.cuposTemporada}.png`, cls: 'cream', eyebrow: `Paquete Temporada · ${B.temporada}`, title: `Quedan <em style="white-space:nowrap">${n} de ${B.cuposTemporada}</em>`, body: 'Carta QR y Esencial: hasta completar los cupos de lanzamiento.', titleSize: 140 });
story({ file: `${S03}/3.png`, title: 'Escríbame antes del domingo y <em>le entrego su portada el lunes.</em>', extra: cta() });

// ---------- Portadas de Reels (1080×1920; el título queda en la zona que se ve en la grilla) ----------
phoneCover('portadas-reels/P02_miah-y-noah.png', 'Caso real · Curacautín', 'Así reservan <em>directo</em>', MIAH_M);
cover('portadas-reels/P04_showreel-muestras.png', '10 rubros del turismo', '¿Cuál se parece a <em>su negocio?</em>', '', 'Muestras de concepto');
phoneCover('portadas-reels/P06_rincon-de-los-poetas.png', 'Caso real · Nueva Imperial', 'Un hostal con <em>historia</em>', POETAS_M);
cover('portadas-reels/R01_calculadora.png', 'Calculadora gratis', '¿Cuánto le paga a <em>Booking?</em>');
cover('portadas-reels/R02_carta-qr.png', 'Restaurantes', 'Su carta, <em>como una experiencia</em>', asset('public/muestras/fogon-mapu/img/chef.webp'), 'Muestra de concepto');
phoneCover('portadas-reels/R03_lo-que-no-le-da.png', 'Caso real · Curacautín', 'Lo que su aviso <em>no le da</em>', MIAH_M);
cover('portadas-reels/R04_glamping.png', 'Glamping y domos', 'Si su glamping tuviera <em>su propia web</em>', asset('public/muestras/domos-cielo-austral/img/unidad-1.webp'), 'Muestra de concepto');

// ---------- Avisos: Yapo, grupos de Facebook y ficha de Google (1200×900) ----------
wide('avisos/yapo-1_caso-real.png', 'paper', `<div style="position:absolute;left:70px;top:90px;width:560px;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Caso real · Curacautín</div><h1 class="serif" style="font-size:76px;line-height:1.03;font-weight:500">Página web para cabañas y restaurantes</h1><p style="font-size:34px;font-weight:600">Temuco y Araucanía · desde ${B.carta}</p><p style="font-size:28px;opacity:.75">WhatsApp ${B.wa}</p></div><div style="position:absolute;right:110px;top:70px">${phone(MIAH_M, 330, 3)}</div>`);
wide('avisos/yapo-2_planes.png', 'ink', `${topo(1200, 900, { seed: 50 })}<div style="position:absolute;inset:70px;display:flex;flex-direction:column;gap:30px"><div class="eyebrow">Precios de lanzamiento</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:10px">${[['fork', 'Carta QR', B.carta, 'Restaurantes y cafés'], ['home', 'Esencial', B.esencial, 'Cabañas y hostales'], ['tree', 'Temporada', B.temporada, `${B.cuposTemporada} cupos · web completa`]].map(([i, n, p, d]) => `<div class="card" style="padding:34px;display:flex;flex-direction:column;gap:16px">${icon(i, 64)}<p class="serif" style="font-size:52px">${n}</p><p class="serif gold2" style="font-size:64px;font-weight:600">${p}</p><p style="font-size:24px;opacity:.85">${d}</p></div>`).join('')}</div><p style="font-size:30px;font-weight:600">Dominio y hosting el primer año · contrato · pago 50/50 · WhatsApp ${B.wa}</p></div>`);
wide('avisos/yapo-3_garantia.png', 'cream', `<div style="position:absolute;inset:80px;display:flex;align-items:center;gap:60px"><div style="flex:1;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Garantía de portada</div><h1 class="serif" style="font-size:76px;line-height:1.04;font-weight:500">Primero ve su web. <em>Si no le convence, no paga.</em></h1><p style="font-size:30px;font-weight:600">Escanee y escríbame PORTADA</p></div><img src="${waQR}" style="width:330px;height:330px"></div>`);
wide('avisos/grupos-fb_carta-qr.png', 'ink', `${topo(1200, 900, { seed: 52 })}<div style="position:absolute;left:70px;top:110px;width:600px;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Restaurantes de Temuco</div><h1 class="serif" style="font-size:78px;line-height:1.03;font-weight:500">¿Su carta sigue siendo <em>un PDF?</em></h1><p style="font-size:34px;font-weight:600">Carta QR con sus fotos y su marca: ${B.carta}</p><p style="font-size:28px;opacity:.85">Escríbame CARTA · ${B.wa}</p></div><div style="position:absolute;right:90px;top:170px;width:400px;height:540px;background:#fff;border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;color:${C.ink};box-shadow:0 30px 60px rgba(0,0,0,.4)"><p class="serif" style="font-size:40px">Escanee la carta</p><img src="${cartaQR}" style="width:280px;height:280px"><p style="font-size:20px;opacity:.6">Muestra de concepto · Fogón Mapu</p></div>`);
wide('avisos/google-1_webs-turismo.png', 'ink', `${topo(1200, 900, { seed: 54 })}<div style="position:absolute;inset:90px;display:flex;flex-direction:column;justify-content:center;gap:30px"><img src="${EMBLEM}" style="width:120px;height:120px"><h1 class="serif" style="font-size:84px;line-height:1.03;font-weight:500">Webs para cabañas y restaurantes de la <em>Araucanía</em></h1><p style="font-size:36px;font-weight:600">Con garantía de portada · desde ${B.carta}</p></div>`);
wide('avisos/google-2_temporada.png', 'ink', `${topo(1200, 900, { seed: 56 })}<div style="position:absolute;left:80px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:26px"><div class="eyebrow">Paquete Temporada · ${B.cuposTemporada} cupos</div><h1 class="serif" style="font-size:80px;line-height:1.03;font-weight:500">Su web lista <em>antes del verano</em></h1><p style="font-size:34px;font-weight:600">${B.temporada} · lista antes del 30 de noviembre</p></div><div style="position:absolute;right:90px;top:70px">${phone(MIAH_M, 330, 3)}</div>`);

// ---------- Anuncios (formato Meta Ads: 1080×1080 y 1080×1920), listos para cuando haya presupuesto ----------
ad('carta-qr', 'fork', 'Restaurantes · Araucanía', 'Su carta, <em>en el celular de sus clientes</em>', B.carta, 'Con sus fotos, su marca y QR para cada mesa', 'CARTA');
ad('esencial', 'home', 'Cabañas y hostales', 'Su cabaña con <em>web propia</em>', B.esencial, 'Fotos, ubicación y WhatsApp directo · garantía de portada', 'PORTADA');
ad('temporada', 'tree', `Paquete Temporada · ${B.cuposTemporada} cupos`, 'Que el verano lo encuentre con <em>web propia</em>', B.temporada, 'Web completa + ficha de Google + 1 mes de mantención', 'TEMPORADA');

}

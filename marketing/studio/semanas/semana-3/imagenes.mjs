// Semana 3 (2 al 8 de noviembre): imágenes con las plantillas de la marca.
// Contenido del sitio real (calculadora, diagnóstico, planes, dudas) o de muestras rotuladas.
import { topo, icon, asset, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
  const { add, waQR, slide, story, cta, phone, list, cover, phoneCover, wide, still, chat, counter, cal, chips } = k;
  const MIAH = asset('public/img/casos/miah-m.webp');
  const muestra = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);

  // ---------- S06 · Faltan 4 semanas (lun 2, 20:30) ----------
  const S06 = '2026-11-02_2030_S06_historias-faltan-4-semanas';
  story({ file: `${S06}/1.png`, eyebrow: 'Temporada de verano', title: '¿Su web estará lista <em>para diciembre?</em>', inset: '420px 80px 820px', center: false,
    extra: '', deco: [{ emo: '🏖️', x: 140, y: 1120, size: 220, rot: -8 }, { stk: '☀️ diciembre', x: 470, y: 1180, rot: 4, size: 56, tone: 'gold' }, { hand: 'o la deja para marzo… 😅', x: 300, y: 1400, rot: -4, size: 62 }] });
  story({ file: `${S06}/2.png`, cls: 'cream', eyebrow: 'Temporada de verano', title: 'Lo que alcanza <em>antes del 30</em>', extra: chips(['🍽️ Carta QR · 1–2 semanas', '🏡 Esencial · 1–2 semanas', '🌲 Completo · 3–4 semanas', '☀️ Temporada · 3–4 semanas'], 42), deco: [{ hand: 'y antes de pagar,<br>ve su portada ✌️', x: 120, y: 1520, rot: -4, size: 64 }] });
  story({ file: `${S06}/3.png`, title: 'Faltan <em style="white-space:nowrap">4 semanas.</em> Partamos por su portada.', extra: cta(), inset: '380px 80px 900px', center: false,
    deco: [{ pola: MIAH, x: 360, y: 1060, w: 420, h: 440, rot: 5, op: 'top', cap: 'caso real · Miah' }, { stk: '⏳ 4 semanas', x: 100, y: 1180, rot: -6, size: 46, tone: 'gold' }] });

  // ---------- C06 · 3 errores (mar 3, 19:30) ----------
  const C06 = '2026-11-03_1930_C06_tres-errores';
  const tapa06 = { seed: 100, inset: '200px 80px 560px', n: 0, total: 6, deco: [{ emo: '🚩', x: 110, y: 860, size: 180, rot: -10 }, { emo: '🚩', x: 300, y: 900, size: 140, rot: 8 }, { emo: '🚩', x: 450, y: 860, size: 110, rot: -4 }, { hand: 'el 2 lo veo todas las semanas', x: 420, y: 1060, rot: -4, size: 50 }] };
  slide({ file: `${C06}/01.png`, eyebrow: 'Antes del verano', title: '3 errores en la web <em>de una cabaña</em>', body: 'Y cómo arreglarlos. Deslice →', titleSize: 116, ...tapa06 });
  slide({ file: `${C06}/01-B.png`, eyebrow: 'Antes del verano', title: '¿Su web hace que <em>reserven en otra?</em>', body: '3 errores que veo seguido.', titleSize: 112, ...tapa06 });
  const errores = [
    ['chat', 'Solo se reserva por la plataforma', 'El huésped que quiere escribirle no encuentra cómo.', 'Un botón de WhatsApp siempre a la vista.'],
    ['photo', '40 fotos revueltas', 'El huésped compara fotos antes que precios.', 'Fotos por espacio: dormitorio, cocina, tinaja, vista.'],
    ['pin', 'Nadie sabe cómo llegar', 'Si no lo ubica, sigue buscando.', 'Mapa y distancias: al lago, al parque, al centro.'],
  ];
  const shot06 = ['miah-funciones', 'miah-galeria', 'miah-guia'];
  errores.forEach(([ic, t, b, fix], i) => slide({ file: `${C06}/0${i + 2}.png`, cls: i % 2 ? 'cream' : 'ink', seed: 101 + i, eyebrow: `❌ Error ${i + 1}`, title: t, body: b, inset: '170px 80px 560px', titleSize: 92, n: i + 1, total: 6,
    deco: [{ stk: `✅ ${fix}`, x: 80, y: 800, rot: -2, size: 38, tone: 'gold', w: 540 }, { phone: still(shot06[i]), x: 700, y: 640, w: 250, rot: 5 }, { hand: 'así lo resolvió Miah →', x: 120, y: 1040, rot: -4, size: 50 }] }));
  slide({ file: `${C06}/05.png`, cls: 'cream', seed: 104, eyebrow: '¿Y su web?', title: 'Hágale el <em>diagnóstico gratuito</em>', body: 'Seis preguntas, un minuto: un puntaje y las tres mejoras que más le conviene hacer primero.', inset: '170px 80px 560px', titleSize: 96, n: 4, total: 6,
    deco: [{ phone: still('redvaeru-diagnostico'), x: 640, y: 700, w: 280, rot: 5 }, { stk: '⏱️ 1 minuto', x: 100, y: 860, rot: -4, size: 50, tone: 'ink' }, { hand: `en ${B.site}`, x: 110, y: 1010, rot: -3, size: 50 }] });
  slide({ file: `${C06}/06.png`, seed: 105, eyebrow: 'Revisión gratis', title: 'O se la reviso yo, <em>sin costo.</em>', body: 'Y si no tiene web, le muestro su portada.', extra: cta(), inset: '170px 80px 520px', n: 5, total: 6, sign: false,
    deco: [{ emo: '🔍', x: 700, y: 820, size: 200, rot: 10 }, { sign: true, x: 90, y: 1050 }] });

  // ---------- P08 · Temporada en detalle (jue 5, 19:30) ----------
  const P08 = '2026-11-05_1930_P08_temporada-detalle';
  const tapa08 = { seed: 110, inset: '200px 80px 520px', titleSize: 104, n: 0, total: 6, deco: [{ x: 0, y: 0 }] };
  slide({ file: `${P08}/01.png`, eyebrow: `Paquete Temporada · ${B.cuposTemporada} cupos`, title: 'Su web lista <em>antes del 30 de noviembre</em>', body: 'Qué incluye y cuándo hay que partir. Deslice →', ...tapa08,
    deco: [{ phone: still('miah'), x: 630, y: 740, w: 220, rot: 5 }, { stk: '☀️ lista para el verano', x: 90, y: 900, rot: -4, size: 44, tone: 'gold' }, { hand: 'como la de Miah →', x: 140, y: 1040, rot: -3, size: 54 }] });
  slide({ file: `${P08}/01-B.png`, eyebrow: `Paquete Temporada · ${B.temporada}`, title: 'Para tenerla el 30, <em>hay que partir el 9</em>', body: 'Le explico por qué. Deslice →', ...tapa08,
    extra: '', deco: [{ hand: '9 → 30', x: 140, y: 920, rot: -5, size: 140 }, { emo: '🗓️', x: 720, y: 860, size: 200, rot: 8 }] });
  slide({ file: `${P08}/02.png`, cls: 'cream', seed: 111, eyebrow: 'Qué incluye', title: 'Una web completa', inset: '170px 80px 150px', titleSize: 104, n: 1, total: 6,
    extra: chips(['🏡 Sus unidades o su carta', '🛎️ Servicios y entorno', '📸 Galería por espacios', '🗺️ Mapa y cómo llegar', '💬 Reservas por WhatsApp', '🔗 O enlace a su sistema'], 40),
    deco: [{ phone: still('miah-galeria'), x: 720, y: 520, w: 240, rot: 5 }, { hand: '↑ todo esto, en una sola web', x: 110, y: 1130, rot: -3, size: 54 }] });
  slide({ file: `${P08}/03.png`, seed: 112, eyebrow: 'Y además', title: 'Lo que la hace <em>trabajar</em>', inset: '170px 80px 150px', titleSize: 104, n: 2, total: 6,
    extra: chips(['📍 Ficha de Google configurada', '🛠️ 1 mes de mantención gratis', '🌐 Dominio y hosting el 1er año', '🔑 Todo a su nombre'], 42),
    deco: [{ emo: '🚀', x: 760, y: 900, size: 200, rot: 10 }, { hand: 'no solo bonita:<br>que le escriban', x: 120, y: 1000, rot: -4, size: 58 }] });
  slide({ file: `${P08}/04.png`, cls: 'cream', seed: 113, eyebrow: 'El calendario', title: 'Partir el 9, <em>publicar el 30</em>', inset: '170px 80px 150px', titleSize: 96, n: 3, total: 6,
    extra: `<div style="display:flex;flex-direction:column;gap:18px;width:100%">${[['Lun 9 nov', 'Conversamos y firmamos ✍️'], ['Semana 1', 'Su portada, para aprobar 👀'], ['Semanas 2 y 3', 'Diseño con su revisión 🎨'], ['30 nov', 'Al aire, antes del verano 🚀']].map(([d, t], i) => `<div class="stk" style="position:relative;display:flex;gap:28px;align-items:center;transform:rotate(${[-1.5, 1, -1, 1.5][i]}deg);white-space:normal;${i === 3 ? `background:${C.gold}` : ''}"><p class="serif" style="font-size:40px;width:260px;color:#8a6a2a;${i === 3 ? `color:${C.ink}` : ''}">${d}</p><p style="font-size:34px;font-weight:800">${t}</p></div>`).join('')}</div>` });
  slide({ file: `${P08}/05.png`, seed: 114, eyebrow: 'Precio de lanzamiento', title: `<span class="gold2">${B.temporada}</span>`, body: `Solo ${B.cuposTemporada} cupos. Pago en dos partes: 50% al aprobar su portada y 50% al publicar.`, inset: '170px 80px 520px', titleSize: 200, n: 4, total: 6,
    deco: [{ hand: 'web completa + ficha de Google', x: 120, y: 900, rot: -3, size: 56 }, { draw: { under: [90, 480, 840] } }, { stk: `🔥 ${B.cuposTemporada} cupos`, x: 690, y: 1000, rot: 5, size: 48, tone: 'gold' }] });
  slide({ file: `${P08}/06.png`, cls: 'cream', eyebrow: 'Garantía de portada', title: 'Primero ve su portada. <em>Si no le convence, no paga.</em>', inset: '170px 80px 150px', n: 5, total: 6, titleSize: 92,
    extra: `<div style="display:flex;align-items:center;gap:40px"><img src="${waQR}" style="width:230px;height:230px;border-radius:16px;box-shadow:0 10px 0 rgba(0,0,0,.15)"><p style="font-size:40px;font-weight:800;line-height:1.3">Escríbame<br>TEMPORADA</p></div>`, deco: [{ sign: true, x: 90, y: 1110 }, { emo: '🤝', x: 820, y: 1010, size: 140, rot: 8 }] });

  // ---------- S07 · Cupos y faltan 24 días (vie 6, 20:30) ----------
  const S07 = '2026-11-06_2030_S07_historias-cupos';
  for (let n = B.cupos; n >= 1; n--) story({ file: `${S07}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Precios de lanzamiento solo para los primeros clientes.', titleSize: 140,
    extra: counter(n, B.cupos, 150), deco: [{ hand: n === 1 ? '¡el último! 😬' : n <= 2 ? 'se están yendo…' : 'después rige el precio normal', x: n <= 2 ? 520 : 200, y: 1540, rot: -4, size: 60 }] });
  story({ file: `${S07}/2_faltan-24-dias.png`, cls: 'cream', eyebrow: 'Temporada de verano', title: 'Faltan <em style="white-space:nowrap">24 días</em> para el 30 de noviembre', body: 'Carta QR y Esencial todavía alcanzan. Escríbame PORTADA.', titleSize: 110, inset: '400px 80px 300px', center: false,
    extra: `<div style="margin:30px 0 0 300px">${cal(30)}</div>`, deco: [{ hand: '← aquí abre el verano', x: 90, y: 1560, rot: -6, size: 58 }, { emo: '☀️', x: 760, y: 1090, size: 140, rot: 10 }] });

  // ---------- C07 · Ficha de Google (sáb 7, 11:30) ----------
  const C07 = '2026-11-07_1130_C07_ficha-de-google';
  slide({ file: `${C07}/01.png`, seed: 120, eyebrow: 'Antes que su web', title: 'Su ficha de Google, <em>lista para el verano</em>', body: '5 cosas para dejarla lista este fin de semana.', inset: '200px 80px 520px', titleSize: 108, n: 0, total: 7,
    deco: [{ emo: '📍', x: 120, y: 880, size: 200, rot: -8 }, { stk: '⭐⭐⭐⭐⭐', x: 400, y: 920, rot: 4, size: 48 }, { hand: 'guárdelo ✓', x: 420, y: 1060, rot: -4, size: 62 }] });
  const google = [
    ['Categoría y horario de verano', 'Si dice «cerrado» o la categoría está mal, el huésped ni siquiera la abre.', [{ stk: '🔴 Cerrado', x: 110, y: 830, rot: -5, size: 52 }, { hand: '→', x: 400, y: 820, size: 90 }, { stk: '🟢 Abierto · verano', x: 470, y: 900, rot: 3, size: 46, tone: 'gold' }]],
    ['Fotos por espacio', 'Dormitorio, baño, cocina, tinaja, vista. No solo la fachada.', [{ phone: still('miah-galeria'), x: 650, y: 700, w: 260, rot: 5 }, { stk: '📸 no solo la fachada', x: 100, y: 860, rot: -3, size: 42 }, { hand: 'como en la web de Miah →', x: 110, y: 1000, rot: -4, size: 50 }]],
    ['Enlace a su web y WhatsApp', 'Que desde Google le puedan escribir y reservar directo.', [{ stk: '🌐 Sitio web', x: 110, y: 840, rot: -4, size: 46 }, { stk: '💬 WhatsApp', x: 430, y: 880, rot: 3, size: 46, tone: 'gold' }, { hand: 'dos botones = más reservas directas', x: 130, y: 1020, rot: -3, size: 50 }]],
    ['Pida reseñas al salir', 'El mejor momento es al despedir al huésped, con un enlace directo.', [{ x: 0, y: 0 }]],
    ['Responda todas las reseñas', 'También las malas: quien lee la respuesta es el próximo huésped.', [{ stk: '⭐⭐ «el agua salía tibia»', x: 100, y: 830, rot: -3, size: 40 }, { stk: '«¡Gracias! Ya cambiamos el calefón 🙏»', x: 200, y: 950, rot: 2, size: 38, tone: 'gold' }, { hand: 'el próximo huésped lo lee todo', x: 160, y: 1080, rot: -4, size: 50 }]],
  ];
  google.forEach(([t, b, d], i) => slide({ file: `${C07}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 121 + i, eyebrow: `${i + 1} de 5`, title: t, body: b, titleSize: 92, n: i + 1, total: 7,
    ...(i === 3 ? { inset: '170px 80px 150px', extra: chat([['out', '¡Gracias por venir! 🙌 Si le gustó, ¿nos deja una reseña? Es este enlace 👇', '11:02'], ['in', '¡Obvio! Lo pasamos increíble ⭐⭐⭐⭐⭐', '11:05']], 40) } : { inset: '170px 80px 560px', deco: d }) }));
  slide({ file: `${C07}/07.png`, seed: 127, eyebrow: '¿Prefiere no hacerlo usted?', title: 'Va incluida en el <em>Paquete Temporada</em>', body: `${B.temporada} · ${B.cuposTemporada} cupos · lista antes del 30 de noviembre`, extra: cta('TEMPORADA'), inset: '170px 80px 520px', n: 6, total: 7, titleSize: 100, sign: false,
    deco: [{ emo: '😮‍💨', x: 740, y: 870, size: 180, rot: 8 }, { sign: true, x: 90, y: 1050 }] });

  // ---------- Portadas de Reels ----------
  phoneCover('portadas-reels/R09_calculadora-restaurante.png', 'Restaurantes y delivery', '¿Cuánto le paga <em>a las apps?</em>', still('calculadora-restaurante'), [{ stk: '💸 $6.480.000 al año', x: 90, y: 1300, rot: -5, size: 46, tone: 'gold' }]);
  cover('portadas-reels/R10_cabanas-lago.png', 'Cabañas', 'Su cabaña, <em>frente al lago</em>', muestra('cabanas-lago-azul', 'hero.webp'), 'Muestra de concepto', [{ emo: '🛶', x: 760, y: 1440, size: 150, rot: 8 }]);
  cover('portadas-reels/R11_tours.png', 'Tours y experiencias', 'Un tour se vende <em>con la experiencia</em>', muestra('pucon-aventura', 'tour-1.webp'), 'Muestra de concepto', [{ emo: '🌋', x: 760, y: 1440, size: 150, rot: 8 }]);
  phoneCover('portadas-reels/R12_diagnostico.png', 'Diagnóstico gratuito', '¿Qué tan independiente es <em>su negocio?</em>', still('redvaeru-diagnostico'), [{ stk: '⏱️ 1 minuto', x: 90, y: 1300, rot: -5, size: 46, tone: 'gold' }]);

  // ---------- Avisos ----------
  wide('avisos/google-4_diagnostico.png', 'ink', `${topo(1200, 900, { seed: 64, opacity: 0.14 })}<div style="position:absolute;inset:80px;display:flex;flex-direction:column;justify-content:center;gap:30px"><div class="eyebrow">Diagnóstico gratuito</div><h1 class="serif" style="font-size:84px;line-height:1.03;font-weight:500">¿Qué tan independiente es <em>su negocio?</em></h1><div style="display:flex;gap:20px">${[['6', 'preguntas'], ['1', 'minuto'], ['3', 'mejoras para partir']].map(([n, t], i) => `<div class="stk" style="position:relative;transform:rotate(${[-2, 1.5, -1][i]}deg)"><span class="serif" style="font-size:56px;color:#8a6a2a">${n}</span> <span style="font-size:26px">${t}</span></div>`).join('')}</div><p style="font-size:30px;font-weight:600">${B.site} · sin compromiso</p></div>`,
    [{ hand: 'gratis 👀', x: 900, y: 110, rot: 6, size: 60 }]);
  wide('avisos/grupos-fb_delivery.png', 'paper', `<div style="position:absolute;left:70px;top:80px;width:620px;display:flex;flex-direction:column;gap:24px"><div class="eyebrow">Restaurantes · Araucanía</div><h1 class="serif" style="font-size:72px;line-height:1.03;font-weight:500">¿Cuánto le paga a las apps <em>cada año?</em></h1><div class="stk" style="position:relative;transform:rotate(-1.5deg);white-space:normal"><p style="font-size:24px;opacity:.75">Ejemplo: 120 pedidos al mes · $15.000 · 25%</p><p class="serif" style="font-size:72px;color:#8a6a2a">$5.400.000</p><p style="font-size:24px;opacity:.75">en comisiones al año 😬</p></div><p style="font-size:30px;font-weight:600">Carta QR con pedidos por WhatsApp desde ${B.carta}</p></div><span style="position:absolute;right:60px;bottom:28px;font-size:18px;opacity:.6">Muestra de concepto · Fogón Mapu</span>`,
    [{ phone: muestra('fogon-mapu', 'hero.webp'), x: 790, y: 70, w: 320, rot: 4 }]);
}

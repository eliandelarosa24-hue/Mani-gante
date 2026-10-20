// Semana 6 (23 al 29 de noviembre): «La temporada ya empezó: su web para enero y febrero».
import { topo, asset, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
  const { waQR, slide, story, cta, phoneCover, cover, wide, still, chat, counter, cal, chips } = k;
  const MIAH = (f) => asset(`marketing/studio/out/broll/miah-${f}.jpg`);
  const muestra = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);
  const DESDE = '$49.000';

  // ---------- S12 · La temporada ya empezó (lun 23, 20:30) ----------
  const S12 = '2026-11-23_2030_S12_historias-temporada';
  story({ file: `${S12}/1.png`, eyebrow: 'Temporada de verano', title: 'La temporada <em>ya empezó</em>', inset: '420px 80px 820px', center: false,
    deco: [{ pola: MIAH('exterior-sol'), x: 300, y: 1000, w: 480, h: 520, rot: 4, cap: 'caso real · Miah' }, { emo: '☀️', x: 120, y: 1100, size: 150, rot: -10 }] });
  story({ file: `${S12}/2.png`, cls: 'cream', eyebrow: 'Lo que viene', title: '<em>Enero y febrero</em> son los meses fuertes', extra: chips(['🏖️ Vacaciones', '🚗 Escapadas', '🔎 Búsquedas de último minuto'], 44), deco: [{ hand: 'que lo encuentren a usted', x: 260, y: 1500, rot: -4, size: 64 }] });
  story({ file: `${S12}/3.png`, title: 'Su web en <em>1 a 2 semanas.</em>', extra: cta(), inset: '380px 80px 900px', center: false, sign: false,
    deco: [{ phone: still('miah'), x: 330, y: 900, w: 420, rot: 4 }, { hand: 'todavía llega →', x: 60, y: 800, rot: -5, size: 58 }] });

  // ---------- C12 · Mantención mensual (mar 24, 19:30) ----------
  const C12 = '2026-11-24_1930_C12_mantencion';
  slide({ file: `${C12}/01.png`, seed: 180, eyebrow: 'Después de publicar', title: '¿Y quién la <em>mantiene al día?</em>', body: 'Dos opciones, sin permanencia.', inset: '200px 80px 540px', titleSize: 108, n: 0, total: 6,
    deco: [{ emo: '🛠️', x: 120, y: 880, size: 200, rot: -8 }, { stk: 'mes a mes', x: 430, y: 920, rot: 4, size: 50, tone: 'gold' }] });
  slide({ file: `${C12}/02.png`, cls: 'cream', seed: 181, eyebrow: 'Mantención', title: 'Cuidado', body: 'Para que su web siga al aire y segura.', inset: '170px 80px 150px', titleSize: 110, n: 1, total: 6,
    extra: `<p class="serif" style="font-size:96px;color:#8a6a2a;font-weight:600">$25.000<span style="font-size:40px"> /mes</span></p>${chips(['🌐 Hosting y dominio', '💾 Respaldo', '✏️ Un cambio al mes'], 40)}` });
  slide({ file: `${C12}/03.png`, seed: 182, eyebrow: 'Mantención', title: 'Crecimiento', body: 'Para que su web traiga más consultas.', inset: '170px 80px 150px', titleSize: 110, n: 2, total: 6,
    extra: `<p class="serif gold2" style="font-size:96px;font-weight:600">$55.000<span style="font-size:40px"> /mes</span></p>${chips(['✏️ Cambios del mes', '📍 Ficha de Google', '📊 Informe de visitas y consultas'], 40)}` });
  slide({ file: `${C12}/04.png`, cls: 'cream', seed: 183, eyebrow: 'Sin letra chica', title: 'Sin permanencia', body: 'Se pausa o termina con aviso de 30 días. Todo sigue a su nombre.', inset: '170px 80px 560px', titleSize: 104, n: 3, total: 6,
    deco: [{ emo: '👋', x: 130, y: 820, size: 200, rot: -8 }, { stk: '🔑 Todo a su nombre', x: 430, y: 880, rot: 3, size: 46, tone: 'gold' }] });
  slide({ file: `${C12}/05.png`, seed: 184, eyebrow: 'O lo hace usted', title: 'Le dejo <em>una guía</em>', body: 'Para cambiar textos y fotos sin depender de nadie.', inset: '170px 80px 560px', titleSize: 104, n: 4, total: 6,
    deco: [{ emo: '📖', x: 130, y: 820, size: 200, rot: -8 }, { hand: 'usted elige', x: 470, y: 900, rot: -4, size: 70 }] });
  slide({ file: `${C12}/06.png`, cls: 'cream', eyebrow: '¿Le explico cuál le conviene?', title: 'Escríbame <em>y lo vemos.</em>', inset: '170px 80px 150px', n: 5, total: 6, titleSize: 104,
    extra: `<div style="display:flex;align-items:center;gap:40px;margin-top:10px"><img src="${waQR}" style="width:240px;height:240px;border-radius:16px;box-shadow:0 10px 0 rgba(0,0,0,.15)"><p style="font-size:40px;font-weight:800;line-height:1.3">WhatsApp<br>${B.wa}</p></div>`, deco: [{ sign: true, x: 90, y: 1090 }] });

  // ---------- C13 · Checklist de enero (jue 26, 19:30) ----------
  const C13 = '2026-11-26_1930_C13_checklist-enero';
  slide({ file: `${C13}/01.png`, seed: 190, eyebrow: 'Antes de enero', title: 'La checklist <em>de enero</em>', body: '5 cosas para que la temporada trabaje sola.', inset: '200px 80px 540px', titleSize: 112, n: 0, total: 7,
    deco: [{ emo: '✅', x: 110, y: 860, size: 200, rot: -8 }, { stk: '☐ ☐ ☐ ☐ ☐', x: 400, y: 900, rot: 3, size: 54 }, { hand: 'guárdelo ✓', x: 430, y: 1040, rot: -4, size: 60 }] });
  const items = [
    ['Tarifas de enero y febrero', 'Publicadas y claras. Que nadie tenga que preguntar.', [{ stk: '💰 Enero', x: 100, y: 830, rot: -4, size: 50, tone: 'gold' }, { stk: '💰 Febrero', x: 430, y: 930, rot: 3, size: 50 }]],
    ['Respuestas rápidas', 'En WhatsApp Business: tarifas, cómo llegar y cómo reservar.', [{ x: 0, y: 0 }]],
    ['Fotos de verano', 'Con sol y con verde. Las de invierno no venden enero.', [{ pola: MIAH('exterior-cielo'), x: 110, y: 760, w: 360, h: 320, rot: -5, cap: 'verano ☀️' }, { pola: MIAH('terraza'), x: 520, y: 780, w: 360, h: 320, rot: 4, cap: 'la terraza' }]],
    ['Ficha de Google al día', 'Horario de verano, fotos nuevas y su WhatsApp.', [{ emo: '📍', x: 120, y: 820, size: 200, rot: -8 }, { stk: '🟢 Abierto · verano', x: 420, y: 860, rot: 3, size: 48, tone: 'gold' }]],
    ['Abono y cancelación', 'Por escrito y a la vista. Menos dudas, más reservas.', [{ emo: '📜', x: 120, y: 820, size: 200, rot: -8 }, { stk: '💳 Abono · ❌ Cancelación', x: 420, y: 880, rot: 3, size: 42 }]],
  ];
  items.forEach(([t, b, d], i) => slide({ file: `${C13}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 191 + i, eyebrow: `${i + 1} de 5`, title: t, body: b, titleSize: 96, n: i + 1, total: 7,
    ...(i === 1 ? { inset: '170px 80px 150px', extra: chat([['in', 'Hola! ¿Tienen para el 10 de enero? ¿Cuánto sale?', '22:41'], ['out', '¡Hola! 👋 Sí. Tarifas, fotos y cómo reservar aquí 👇 (respuesta rápida)', '22:41']], 40) } : { inset: '170px 80px 580px', deco: d }) }));
  slide({ file: `${C13}/07.png`, seed: 197, eyebrow: '¿Y su web?', title: 'Todavía llega <em>para enero.</em>', body: `Carta QR y Esencial desde ${DESDE} · 1 a 2 semanas`, extra: cta(), inset: '170px 80px 520px', n: 6, total: 7, sign: false,
    deco: [{ phone: still('miah'), x: 660, y: 640, w: 260, rot: 5 }, { sign: true, x: 90, y: 1090 }] });

  // ---------- S13 · Cupos y faltan 3 días (vie 27, 20:30) ----------
  const S13 = '2026-11-27_2030_S13_historias-cupos';
  for (let n = B.cupos; n >= 1; n--) story({ file: `${S13}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Últimos cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Cuando se completen, rige el precio normal.', titleSize: 140,
    extra: counter(n, B.cupos, 150), deco: [{ hand: n === 1 ? '¡el último! 😬' : n <= 2 ? 'se están yendo…' : 'después, precio normal', x: n <= 2 ? 520 : 260, y: 1540, rot: -4, size: 60 }] });
  story({ file: `${S13}/2_faltan-3-dias.png`, cls: 'cream', eyebrow: 'Temporada de verano', title: 'Faltan <em style="white-space:nowrap">3 días</em> para el 30', body: 'Y después, enero y febrero. Todavía llega. Escríbame PORTADA.', titleSize: 120, inset: '400px 80px 300px', center: false,
    extra: `<div style="margin:20px 0 0 300px">${cal(30)}</div>`, deco: [{ hand: '← y sigue el verano', x: 90, y: 1560, rot: -6, size: 58 }, { emo: '☀️', x: 760, y: 1130, size: 140, rot: 10 }] });

  // ---------- P11 · Caso real (sáb 28, 11:30) ----------
  const P11 = '2026-11-28_1130_P11_caso-real-miah';
  const p11 = (file, title) => slide({ file, seed: 200, eyebrow: 'Caso real · Curacautín', title, body: 'Dos cabañas, 4 idiomas, guía de la zona, check-in en línea y reserva directa.', inset: '170px 80px 600px', titleSize: 96,
    deco: [{ pola: MIAH('exterior'), x: 80, y: 780, w: 300, h: 330, rot: -6, cap: 'la cabaña' }, { pola: MIAH('living'), x: 330, y: 820, w: 300, h: 330, rot: 3, cap: 'el living' }, { phone: still('miah'), x: 700, y: 690, w: 250, rot: 6 }, { stk: 'CASO REAL ✅', x: 110, y: 1180, rot: -3, size: 34, tone: 'gold' }] });
  p11(`${P11}/01.png`, 'Cabañas Miah y Noah: <em>su web, su canal</em>');
  p11(`${P11}/01-B.png`, 'No es una plantilla: <em>es su lugar</em>');

  // ---------- Portadas de Reels ----------
  phoneCover('portadas-reels/R21_enero-sin-web.png', 'Enero y febrero', '¿Cuánto se lleva <em>la plataforma?</em>', still('calculadora-sube'), [{ stk: '💸 $3.888.000 al año', x: 90, y: 1300, rot: -5, size: 46, tone: 'gold' }]);
  cover('portadas-reels/R22_caso-miah.png', 'Caso real · Curacautín', 'No es <em>una plantilla</em>', MIAH('exterior-cielo'), 'Caso real', [{ emo: '🏡', x: 760, y: 1440, size: 150, rot: 8 }]);
  cover('portadas-reels/R23_un-dia-de-verano.png', 'Un día de verano en el sur', '5 experiencias, <em>5 webs</em>', muestra('cabanas-lago-azul', 'hero.webp'), 'Muestras de concepto', [{ emo: '☀️', x: 760, y: 1440, size: 150, rot: 8 }]);
  phoneCover('portadas-reels/R24_manana-es-30.png', 'Temporada de verano', 'Mañana es 30. <em>Todavía llega.</em>', still('miah'), [{ stk: '📅 30 NOV', x: 90, y: 1300, rot: -5, size: 56, tone: 'gold' }]);

  // ---------- Avisos ----------
  wide('avisos/google-7_temporada-empezo.png', 'ink', `${topo(1200, 900, { seed: 74, opacity: 0.14 })}<div style="position:absolute;left:80px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:26px"><div class="eyebrow">Temporada de verano</div><h1 class="serif" style="font-size:80px;line-height:1.03;font-weight:500">Su web para <em>enero y febrero</em></h1><p style="font-size:34px;font-weight:600">1 a 2 semanas · desde ${DESDE}</p></div>`,
    [{ pola: MIAH('exterior-cielo'), x: 780, y: 110, w: 340, h: 400, rot: 5, cap: 'caso real · Miah' }]);
  wide('avisos/grupos-fb_temporada.png', 'paper', `<div style="position:absolute;left:70px;top:90px;width:620px;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Cabañas, hostales y restaurantes · Araucanía</div><h1 class="serif" style="font-size:72px;line-height:1.03;font-weight:500">La temporada ya empezó. <em>¿Y su web?</em></h1><p style="font-size:32px;font-weight:600">Carta QR y Esencial desde ${DESDE} · mantención desde $25.000/mes</p><p style="font-size:26px;opacity:.75">WhatsApp ${B.wa}</p></div>`,
    [{ phone: still('miah'), x: 790, y: 70, w: 320, rot: 4 }]);
}

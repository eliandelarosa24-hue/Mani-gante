// Semana 5 (16 al 22 de noviembre): «Recta final: lo que todavía alcanza». Capa de personalidad v2,
// con fotos reales de Cabañas Miah y Noah (galería de su web) y pantallas reales de los sitios.
import { topo, asset, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
  const { waQR, slide, story, cta, phoneCover, cover, wide, still, chat, counter, cal, chips } = k;
  const MIAH = (f) => asset(`marketing/studio/out/broll/miah-${f}.jpg`);
  const muestra = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);
  const DESDE = '$49.000';

  // ---------- S10 · Último día (lun 16, 20:30) ----------
  const S10 = '2026-11-16_2030_S10_historias-ultimo-dia';
  story({ file: `${S10}/1.png`, eyebrow: 'Recta final', title: 'Hoy es el último día para <em>Carta QR y Esencial</em>', body: 'Partiendo hoy, su web está lista antes del 30.', titleSize: 100, inset: '400px 80px 700px', center: false,
    extra: `<div style="margin:10px 0 0 330px">${cal(16)}</div>`, deco: [{ hand: '← hoy', x: 120, y: 1350, rot: -6, size: 80 }, { emo: '⏰', x: 780, y: 1300, size: 150, rot: 10 }] });
  story({ file: `${S10}/2.png`, cls: 'cream', eyebrow: 'Lo que alcanza', title: 'En 1 a 2 semanas', extra: chips(['📸 Su portada con sus fotos', '💬 Botón de WhatsApp', '📍 Ubicación y precios', '👀 Primero ve la portada'], 44), deco: [{ hand: `desde ${DESDE}`, x: 380, y: 1500, rot: -4, size: 70 }] });
  story({ file: `${S10}/3.png`, title: '¿Partimos <em>hoy?</em>', extra: cta(), inset: '380px 80px 900px', center: false, sign: false,
    deco: [{ phone: still('miah'), x: 330, y: 900, w: 420, rot: 4 }, { hand: 'como la de Miah →', x: 60, y: 800, rot: -5, size: 58 }] });

  // ---------- C10 · Lo que alcanza en 2 semanas (mar 17, 19:30) ----------
  const C10 = '2026-11-17_1930_C10_lo-que-alcanza';
  const tapa10 = { seed: 150, inset: '200px 80px 520px', titleSize: 108, n: 0, total: 7,
    deco: [{ pola: MIAH('exterior-cielo'), x: 560, y: 760, w: 380, h: 400, rot: 5, cap: 'caso real · Miah' }, { stk: '⚡ 2 semanas', x: 100, y: 900, rot: -5, size: 50, tone: 'gold' }] };
  slide({ file: `${C10}/01.png`, eyebrow: 'Recta final', title: 'Lo que alcanza <em>en 2 semanas</em>', body: 'Día por día. Deslice →', ...tapa10 });
  slide({ file: `${C10}/01-B.png`, eyebrow: 'Recta final', title: '¿Todavía alcanza <em>para el verano?</em>', body: 'Sí. Le muestro cómo.', ...tapa10 });
  const pasos = [
    ['Día 1', 'Conversamos', 'Me cuenta de su lugar. Con un audio de WhatsApp basta.', { extra: chat([['in', 'Hola Jorge, tengo 2 cabañas en Lonquimay 🙂', '10:12'], ['out', '¡Hola! Cuénteme: ¿qué es lo que más les gusta a sus huéspedes?', '10:14']], 38) }],
    ['Día 2 y 3', 'Su portada', 'Con sus fotos, su nombre y sus colores.', { deco: [{ phone: still('miah'), x: 640, y: 660, w: 270, rot: 5 }, { hand: 'así parte →', x: 150, y: 960, rot: -4, size: 60 }] }],
    ['Día 4', 'Usted decide', 'Si le gusta, seguimos. Si no le convence, no paga nada.', { deco: [{ stk: '👍 Seguimos', x: 110, y: 850, rot: -4, size: 52, tone: 'gold' }, { stk: '👎 $0', x: 520, y: 900, rot: 4, size: 52 }] }],
    ['Semana 2', 'Todo lo demás', 'Textos, fotos por espacio, WhatsApp, mapa y precios.', { extra: chips(['📸 Fotos', '💬 WhatsApp', '📍 Mapa', '💲 Precios', '📝 Textos'], 40) }],
    ['Día 14', 'Al aire 🚀', 'Su web publicada, a su nombre, antes del 30.', { extra: `<div style="margin:20px 0 0 300px">${cal(30)}</div>` }],
  ];
  pasos.forEach(([e, t, b, o], i) => slide({ file: `${C10}/0${i + 2}.png`, cls: i % 2 ? 'cream' : 'ink', seed: 151 + i, eyebrow: e, title: t, body: b, titleSize: 100, n: i + 1, total: 7, num: false,
    inset: o.extra ? '170px 80px 150px' : '170px 80px 560px', ...o }));
  slide({ file: `${C10}/07.png`, seed: 157, eyebrow: 'Carta QR y Esencial', title: `Desde <em>${DESDE}</em>`, body: 'Partiendo esta semana, llega para el verano.', extra: cta(), inset: '170px 80px 520px', n: 6, total: 7, titleSize: 120, sign: false,
    deco: [{ pola: MIAH('terraza'), x: 590, y: 790, w: 360, h: 380, rot: 5, cap: 'caso real' }, { sign: true, x: 90, y: 1090 }] });

  // ---------- C11 · Preguntas sobre plazos (jue 19, 19:30) ----------
  const C11 = '2026-11-19_1930_C11_preguntas-plazos';
  slide({ file: `${C11}/01.png`, seed: 160, eyebrow: 'Dudas de noviembre', title: 'Las preguntas <em>sobre plazos</em>', body: 'Con respuesta corta.', inset: '200px 80px 560px', titleSize: 116, n: 0, total: 6,
    deco: [{ emo: '⏳', x: 120, y: 860, size: 210, rot: -8 }, { stk: '✓✓ Leído', x: 430, y: 900, rot: 4, size: 48 }, { hand: 'las que más me llegan esta semana', x: 250, y: 1050, rot: -3, size: 48 }] });
  const qs = [
    ['¿Alcanzo para el verano?', 'Carta QR y Esencial: 1 a 2 semanas. Completo o Temporada: 3 a 4. Enero y febrero son lo más fuerte.'],
    ['¿Y si no tengo buenas fotos?', 'Las de su celular sirven. Si faltan, coordinamos una sesión.'],
    ['¿Cuánto demoran en responderme?', 'Menos de 24 horas en días hábiles, por WhatsApp o correo.'],
    ['¿Qué pasa después del 30?', 'Nada se acaba: su web sigue trabajando todo el verano. El 30 es para llegar con todo a diciembre.'],
  ];
  qs.forEach(([q, a], i) => slide({ file: `${C11}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 161 + i, eyebrow: `Pregunta ${i + 1}`, inset: '200px 80px 330px', align: 'center', n: i + 1, total: 6, num: false,
    extra: chat([['in', q, `19:3${i}`], ['out', a, `19:3${i + 1}`]], 48), deco: [{ sign: true, x: 90, y: 1110 }, { emo: ['☀️', '📸', '⚡', '📅'][i], x: 840, y: 1060, size: 130, rot: 8 }] }));
  slide({ file: `${C11}/06.png`, seed: 166, eyebrow: '¿Otra duda?', title: 'Pregúntele a <em>Vaeru IA</em> o escríbame', body: `${B.site} · WhatsApp ${B.wa}`, extra: cta(), inset: '170px 80px 560px', n: 5, total: 6, titleSize: 100, sign: false,
    deco: [{ phone: still('redvaeru-inicio'), x: 660, y: 600, w: 270, rot: 5 }, { hand: 'responde 24/7 🤖', x: 120, y: 930, rot: -4, size: 60 }, { sign: true, x: 90, y: 1100 }] });

  // ---------- S11 · Cupos y faltan 10 días (vie 20, 20:30) ----------
  const S11 = '2026-11-20_2030_S11_historias-cupos';
  for (let n = B.cupos; n >= 1; n--) story({ file: `${S11}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Últimos cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Cuando se completen, rige el precio normal.', titleSize: 140,
    extra: counter(n, B.cupos, 150), deco: [{ hand: n === 1 ? '¡el último! 😬' : n <= 2 ? 'se están yendo…' : 'después, precio normal', x: n <= 2 ? 520 : 260, y: 1540, rot: -4, size: 60 }] });
  story({ file: `${S11}/2_faltan-10-dias.png`, cls: 'cream', eyebrow: 'Temporada de verano', title: 'Faltan <em style="white-space:nowrap">10 días</em> para el 30 de noviembre', body: 'Y enero y febrero vienen con todo. Escríbame PORTADA.', titleSize: 110, inset: '400px 80px 300px', center: false,
    extra: `<div style="margin:20px 0 0 300px">${cal(30)}</div>`, deco: [{ hand: '← aquí abre el verano', x: 90, y: 1560, rot: -6, size: 58 }, { emo: '☀️', x: 760, y: 1130, size: 140, rot: 10 }] });

  // ---------- P10 · Su web trabaja mientras duerme (sáb 21, 11:30) ----------
  const P10 = '2026-11-21_1130_P10_trabaja-mientras-duerme';
  const p10 = (file, title) => slide({ file, seed: 170, eyebrow: 'Caso real · Curacautín', title, body: 'A las 23:00 alguien busca dónde pasar enero. Su web le muestra todo y le deja escribirle directo.', inset: '170px 80px 560px', titleSize: 96,
    deco: [{ phone: still('miah-funciones'), x: 650, y: 680, w: 270, rot: 5 }, { stk: '🌙 23:04 · Nueva consulta por WhatsApp', x: 80, y: 870, rot: -3, size: 34, tone: 'gold', w: 520 }, { stk: 'Ejemplo ilustrativo', x: 90, y: 1040, rot: 2, size: 22, tone: 'ink' }, { hand: 'mientras usted duerme 😴', x: 110, y: 1120, rot: -4, size: 50 }] });
  p10(`${P10}/01.png`, 'Su web trabaja <em>mientras usted duerme</em>');
  p10(`${P10}/01-B.png`, '¿Quién atiende <em>a las 23:00?</em>');

  // ---------- Portadas de Reels ----------
  phoneCover('portadas-reels/R17_ultimo-dia.png', 'Recta final · 16 de noviembre', 'Hoy es <em>el último día</em>', still('miah'), [{ stk: '📅 16 NOV', x: 90, y: 1300, rot: -5, size: 56, tone: 'gold' }]);
  cover('portadas-reels/R18_carta-qr-fogon.png', 'Restaurantes', 'Su carta, <em>sin imprimir nunca más</em>', muestra('fogon-mapu', 'chef.webp'), 'Muestra de concepto', [{ emo: '📱', x: 760, y: 1440, size: 150, rot: 8 }]);
  cover('portadas-reels/R19_23-horas.png', 'Caso real · Curacautín', 'Son las <em>23:00…</em>', MIAH('exterior-cielo'), 'Caso real', [{ emo: '🌙', x: 760, y: 1440, size: 150, rot: 8 }]);
  phoneCover('portadas-reels/R20_detras-de-una-portada.png', 'Así trabajo', 'Detrás de <em>una portada</em>', still('redvaeru-metodo'), [{ stk: '👀 detrás de cámara', x: 90, y: 1300, rot: -5, size: 46, tone: 'gold' }]);

  // ---------- Avisos ----------
  wide('avisos/google-6_recta-final.png', 'ink', `${topo(1200, 900, { seed: 72, opacity: 0.14 })}<div style="position:absolute;left:80px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:26px"><div class="eyebrow">Recta final · 16 de noviembre</div><h1 class="serif" style="font-size:80px;line-height:1.03;font-weight:500">Carta QR y Esencial, <em>listas antes del 30</em></h1><p style="font-size:34px;font-weight:600">Desde ${DESDE} · primero ve su portada</p></div>`,
    [{ phone: still('miah'), x: 800, y: 70, w: 330, rot: 4 }, { stk: 'CASO REAL ✅', x: 790, y: 770, rot: -5, size: 30, tone: 'gold' }]);
  wide('avisos/grupos-fb_recta-final.png', 'paper', `<div style="position:absolute;left:70px;top:90px;width:620px;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Cabañas, hostales y restaurantes · Araucanía</div><h1 class="serif" style="font-size:72px;line-height:1.03;font-weight:500">Todavía alcanza <em>para el verano</em></h1><p style="font-size:32px;font-weight:600">Carta QR y Esencial: 1 a 2 semanas · desde ${DESDE}</p><p style="font-size:26px;opacity:.75">WhatsApp ${B.wa}</p></div>`,
    [{ pola: MIAH('exterior-cielo'), x: 760, y: 110, w: 360, h: 420, rot: 5, cap: 'caso real · Miah' }, { emo: '☀️', x: 700, y: 600, size: 130, rot: -8 }]);
}

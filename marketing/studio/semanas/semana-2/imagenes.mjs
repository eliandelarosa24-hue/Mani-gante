// Semana 2 (26 de octubre al 1 de noviembre): imágenes con la capa de personalidad v2
// (stickers, notas a mano, chats, pantallas reales). Contenido del sitio real o de muestras rotuladas.
import { topo, asset, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
  const { W, H, SH, waQR, slide, story, cta, list, phoneCover, cover, wide, still, chat, counter, cal, chips, phone } = k;
  const muestra = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);
  const MIAH = asset('public/img/casos/miah-m.webp');

  // ---------- S04 · ¿Qué le frena? (lun 26, 20:30) ----------
  const S04 = '2026-10-26_2030_S04_historias-que-le-frena';
  story({ file: `${S04}/1.png`, title: '¿Qué le frena más para <em>tener su web?</em>', inset: '420px 80px 900px', center: false,
    deco: [{ stk: '⏰ No tengo tiempo', x: 120, y: 1080, rot: -4, size: 46 }, { stk: '💸 El precio', x: 520, y: 1230, rot: 3, size: 46, tone: 'gold' }, { stk: '🤷 No sé por dónde partir', x: 150, y: 1380, rot: -2, size: 46 }, { hand: 'sea honesto 👀', x: 560, y: 960, rot: -6, size: 64 }] });
  story({ file: `${S04}/2.png`, cls: 'cream', eyebrow: 'Respuesta corta', inset: '400px 80px 360px',
    extra: chat([['in', '¿Y de dónde saco tiempo?', '20:31'], ['out', 'Me manda fotos y 5 respuestas. El resto lo hago yo.', '20:31'], ['in', '¿Y cuánto sale?', '20:32'], ['out', `Desde ${B.carta}, en dos partes.`, '20:32'], ['in', '¿Por dónde parto?', '20:33'], ['out', 'Por su portada. Gratis 🙌', '20:33']], 40) });
  story({ file: `${S04}/3.png`, title: 'Partamos por <em>su portada.</em>', extra: cta(), inset: '360px 80px 960px', center: false, sign: false,
    deco: [{ phone: still('miah'), x: 330, y: 930, w: 420, rot: 4 }, { hand: 'así quedó la de Miah →', x: 70, y: 860, rot: -5, size: 54 }] });

  // ---------- C03 · Lo que necesito de usted (mar 27, 19:30) ----------
  const C03 = '2026-10-27_1930_C03_lo-que-necesito';
  const portada03 = { inset: '200px 80px 150px', align: 'start', titleSize: 104, n: 0, total: 7, seed: 70,
    deco: [{ phone: still('redvaeru-metodo'), x: 540, y: 630, w: 280, rot: 5 }, { hand: 'está en mi web,<br>tal cual', x: 110, y: 900, rot: -4, size: 56 }, { draw: { arrow: [400, 1000, 570, 900, 0.3] } }] };
  slide({ file: `${C03}/01.png`, eyebrow: 'Su web, sin complicarse', title: 'Esto es todo lo que <em>necesito de usted</em>', body: 'Cinco cosas. El resto lo hago yo.', ...portada03 });
  slide({ file: `${C03}/01-B.png`, eyebrow: 'Su web, sin complicarse', title: '¿Le da flojera hacer <em>su web?</em>', body: 'Es menos trabajo del que cree.', ...portada03 });
  const item = (i, title, body, d, cls = i % 2 ? 'ink' : 'cream') => slide({ file: `${C03}/0${i + 2}.png`, cls, seed: 71 + i, eyebrow: `${i + 1} de 5`, title, body, inset: '170px 80px 640px', titleSize: 96, n: i + 1, total: 7, deco: d });
  item(0, 'Fotos de su lugar', 'Las que ya tiene en Instagram o Booking sirven. Si faltan, coordinamos una sesión.', [
    { pola: muestra('cabanas-lago-azul', 'tinaja.webp'), x: 90, y: 760, w: 340, h: 300, rot: -7, cap: 'la tinaja' }, { pola: muestra('cabanas-lago-azul', 'int-living.webp'), x: 400, y: 800, w: 340, h: 300, rot: 4, cap: 'el living' }, { pola: muestra('cabanas-lago-azul', 'kayak.webp'), x: 700, y: 740, w: 300, h: 280, rot: -3, cap: 'el lago' },
    { hand: '¡las de su celular sirven!', x: 330, y: 1190, rot: -3, size: 50 }, { stk: 'Muestra de concepto', x: 760, y: 1110, rot: 3, size: 22, tone: 'ink' }]);
  item(1, 'Su historia, en breve', 'Cómo nació su negocio y qué lo hace distinto. Con un audio de WhatsApp basta.', [
    { emo: '🎙️', x: 110, y: 760, size: 230, rot: -8 }, { stk: '▶︎ ılıılıılıılı 2:14', x: 400, y: 820, rot: 3, size: 48 }, { hand: 'cuéntemelo como a un amigo', x: 380, y: 980, rot: -4, size: 58 }]);
  item(2, 'Tarifas y políticas', 'Lo que hoy responde una y otra vez, escrito una sola vez.', [
    { stk: '🐶 ¿Aceptan mascotas?', x: 90, y: 760, rot: -3, size: 40 }, { stk: '🕐 ¿A qué hora es el check-in?', x: 330, y: 880, rot: 2, size: 40 }, { stk: '💰 ¿Cuánto es el abono?', x: 120, y: 1000, rot: -1.5, size: 40 }, { stk: '🔥 ¿La tinaja tiene costo?', x: 420, y: 1120, rot: 3, size: 40 }, { hand: '…¿le suena?', x: 760, y: 740, rot: 6, size: 64 }], 'cream');
  item(3, 'Sus enlaces', 'Booking, Airbnb o Instagram: de ahí tomo fotos, reseñas y datos.', [
    { stk: 'Booking', x: 100, y: 800, rot: -4, size: 46 }, { stk: 'Airbnb', x: 140, y: 950, rot: 3, size: 46 }, { stk: 'Instagram', x: 90, y: 1100, rot: -2, size: 46 },
    { phone: still('miah'), x: 650, y: 700, w: 300, rot: 4 }, { draw: { arrow: [400, 840, 620, 900, -0.2] } }, { draw: { arrow: [400, 1130, 620, 1050, 0.2] } }, { hand: 'yo lo junto todo', x: 300, y: 1225, rot: -3, size: 50 }], 'ink');
  item(4, '30 minutos', 'Para revisar el diseño juntos. Nada más.', [
    { emo: '☕', x: 130, y: 760, size: 240, rot: -6 }, { stk: '⏱️ 30:00', x: 470, y: 820, rot: 4, size: 70, tone: 'gold' }, { hand: 'un café y listo', x: 480, y: 990, rot: -4, size: 66 }], 'cream');
  slide({ file: `${C03}/07.png`, seed: 77, eyebrow: 'Garantía de portada', title: 'Con eso le muestro <em>su portada.</em>', body: 'Si no le convence, no paga.', extra: cta(), inset: '170px 80px 560px', n: 6, total: 7, sign: false,
    deco: [{ pola: MIAH, x: 560, y: 780, w: 380, h: 400, rot: 5, op: 'top', cap: 'caso real · Miah' }, { stk: '$0 si no le gusta', x: 110, y: 900, rot: -5, size: 42, tone: 'gold' }, { sign: true, x: 90, y: 1120 }] });

  // ---------- C04 · Compromisos (jue 29, 19:30) ----------
  const C04 = '2026-10-29_1930_C04_compromisos';
  slide({ file: `${C04}/01.png`, seed: 80, eyebrow: 'Mis compromisos', title: 'Trabajar conmigo es <em>sin letra chica.</em>', body: 'Seis compromisos con cada cliente.', inset: '220px 80px 520px', titleSize: 112, n: 0, total: 8,
    deco: [{ emo: '🔍', x: 700, y: 870, size: 200, rot: 10 }, { hand: '(la busqué y no hay)', x: 120, y: 930, rot: -4, size: 58 }] });
  const promises = [
    ['Todo con contrato', 'Alcance, plazo, precio y forma de pago, firmados. Lo que dice el contrato es lo que paga.', [{ emo: '📝', x: 120, y: 780, size: 220, rot: -6 }, { stk: '✍️ Firmado', x: 470, y: 830, rot: 4, size: 52, tone: 'gold' }, { hand: 'sin sorpresas al final', x: 450, y: 990, rot: -3, size: 56 }]],
    ['Garantía de portada', 'Primero ve el diseño de su portada. Si no le convence, no paga nada.', [{ phone: still('poetas'), x: 110, y: 690, w: 270, rot: -5 }, { stk: '¿No le gusta? → $0', x: 460, y: 860, rot: 3, size: 50, tone: 'ink' }, { hand: 'cero riesgo', x: 520, y: 1010, rot: -4, size: 66 }]],
    ['Todo queda a su nombre', 'Dominio, accesos y contenidos son suyos. Nunca queda «secuestrado» por un proveedor.', [{ emo: '🔑', x: 120, y: 780, size: 220, rot: 10 }, { stk: 'www.su-cabaña.cl', x: 440, y: 830, rot: -3, size: 46 }, { stk: 'Dueño: USTED ✅', x: 480, y: 960, rot: 3, size: 46, tone: 'gold' }]],
    ['Sin permanencia', 'Los servicios mensuales se pausan o terminan con aviso de 30 días.', [{ emo: '👋', x: 130, y: 780, size: 220, rot: -8 }, { stk: 'Aviso de 30 días y listo', x: 430, y: 860, rot: 3, size: 44 }, { hand: 'sin multas, sin dramas', x: 450, y: 1000, rot: -4, size: 56 }]],
    ['Respuesta en menos de 24 h', 'Días hábiles. Por WhatsApp o correo, como le acomode.', [{ x: 0, y: 0 }]],
    ['Usted queda capacitado', 'Le dejo una guía para cambiar textos y fotos sin depender de mí.', [{ emo: '🎓', x: 120, y: 780, size: 220, rot: -6 }, { stk: '📖 Guía paso a paso', x: 450, y: 840, rot: 3, size: 46, tone: 'gold' }, { hand: 'para que no me necesite', x: 420, y: 990, rot: -4, size: 56 }]],
  ];
  promises.forEach(([t, b, d], i) => slide({ file: `${C04}/0${i + 2}.png`, cls: i % 2 ? 'cream' : 'ink', seed: 81 + i, eyebrow: `Compromiso ${i + 1}`, title: t, body: b, titleSize: 96, n: i + 1, total: 8,
    ...(i === 4 ? { inset: '170px 80px 150px', extra: chat([['in', 'Hola Jorge, ¿me ayuda a cambiar una foto?', '10:02'], ['out', '¡Hola! Claro, mándemela por aquí y queda hoy 🙌', '10:14']], 38) } : { inset: '170px 80px 640px', deco: d }) }));
  slide({ file: `${C04}/08.png`, cls: 'cream', eyebrow: 'Guárdelo', title: 'Compárelo con <em>cualquier propuesta.</em>', inset: '170px 80px 150px', align: 'start', n: 7, total: 8, titleSize: 100,
    extra: `<div style="display:flex;align-items:center;gap:40px;margin-top:10px"><img src="${waQR}" style="width:240px;height:240px;border-radius:16px;box-shadow:0 10px 0 rgba(0,0,0,.15)"><p style="font-size:40px;font-weight:800;line-height:1.3">Escríbame<br>PORTADA</p></div>`,
    deco: [{ stk: '✅ 6 de 6', x: 640, y: 930, rot: -5, size: 60, tone: 'gold' }, { sign: true, x: 90, y: 1090 }] });

  // ---------- C05 · Preguntas frecuentes (sáb 31, 11:30) ----------
  const C05 = '2026-10-31_1130_C05_preguntas';
  const tapa05 = { seed: 90, inset: '200px 80px 560px', titleSize: 116, n: 0, total: 7, deco: [{ emo: '💬', x: 120, y: 860, size: 210, rot: -8 }, { stk: '✓✓ Leído', x: 430, y: 900, rot: 4, size: 48 }, { hand: 'respuestas cortas, como por WhatsApp', x: 250, y: 1050, rot: -3, size: 48 }] };
  slide({ file: `${C05}/01.png`, eyebrow: 'Dudas frecuentes', title: 'Las preguntas que <em>más me hacen</em>', body: 'Con respuesta corta.', ...tapa05 });
  slide({ file: `${C05}/01-B.png`, eyebrow: 'Dudas frecuentes', title: 'Antes de escribirme, <em>lea esto</em>', body: '5 respuestas en 1 minuto.', ...tapa05 });
  const faqs = [
    ['¿Firmamos contrato?', 'Sí, siempre. Alcance, plazos, precio y forma de pago quedan por escrito, y el sitio es suyo.'],
    ['¿Y si no tengo logo?', 'Se lo diseño sin costo. Todos los planes lo incluyen si aún no tiene uno.'],
    ['¿En cuánto tiempo está lista?', 'Esencial: 1 a 2 semanas. Completo: 3 a 4. El plazo corre cuando tengo sus textos y fotos.'],
    ['¿Incluye dominio y hosting?', 'Sí, el primer año y a su nombre. Desde el segundo año se cotiza o va en la mantención.'],
    ['¿Puedo cambiar textos y fotos yo?', 'Sí. Le dejo una capacitación breve y una guía. Si prefiere, existe la mantención mensual.'],
  ];
  faqs.forEach(([q, a], i) => slide({ file: `${C05}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 91 + i, eyebrow: `Pregunta ${i + 1}`, inset: '200px 80px 330px', align: 'center', n: i + 1, total: 7, num: false,
    extra: chat([['in', q, `11:3${i}`], ['out', a, `11:3${i + 1}`]], 52), deco: [{ sign: true, x: 90, y: 1110 }, { emo: ['🤝', '🎨', '⏳', '🌐', '✏️'][i], x: 840, y: 1060, size: 130, rot: 8 }] }));
  slide({ file: `${C05}/07.png`, seed: 97, eyebrow: '¿Otra duda?', title: 'Pregúntele a <em>Vaeru IA</em> o escríbame', body: `${B.site} · WhatsApp ${B.wa}`, extra: cta(), inset: '170px 80px 560px', n: 6, total: 7, titleSize: 100, sign: false,
    deco: [{ phone: still('redvaeru-inicio'), x: 660, y: 600, w: 270, rot: 5 }, { hand: 'responde 24/7 🤖', x: 120, y: 930, rot: -4, size: 60 }, { sign: true, x: 90, y: 1100 }] });

  // ---------- S05 · Cupos y cuenta regresiva (vie 30, 20:30) ----------
  const S05 = '2026-10-30_2030_S05_historias-cupos';
  for (let n = B.cupos; n >= 1; n--) story({ file: `${S05}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Precios de lanzamiento solo para los primeros clientes.', titleSize: 140,
    extra: counter(n, B.cupos, 150), deco: [{ hand: n === 1 ? '¡el último! 😬' : n <= 2 ? 'se están yendo…' : 'después rige el precio normal', x: n <= 2 ? 520 : 200, y: 1540, rot: -4, size: 60 }] });
  story({ file: `${S05}/2_faltan-31-dias.png`, cls: 'cream', eyebrow: 'Paquete Temporada', title: 'Faltan <em style="white-space:nowrap">31 días</em> para el 30 de noviembre', body: 'Su web lista antes del verano: escríbame TEMPORADA.', titleSize: 110, inset: '400px 80px 300px', center: false,
    extra: `<div style="margin:30px 0 0 300px">${cal(30)}</div>`, deco: [{ hand: '← aquí abre el verano', x: 90, y: 1560, rot: -6, size: 58 }, { emo: '☀️', x: 760, y: 1090, size: 140, rot: 10 }] });

  // ---------- Portadas de Reels ----------
  phoneCover('portadas-reels/R05_metodo.png', 'Así trabajo', 'Cuatro pasos. <em>Cero sorpresas.</em>', still('redvaeru-metodo'), [{ stk: '1 · 2 · 3 · 4 ✅', x: 90, y: 1240, rot: -5, size: 46, tone: 'gold' }]);
  cover('portadas-reels/R06_termas.png', 'Termas y spa', 'Si sus termas tuvieran <em>su propia web</em>', muestra('termas-rayenko', 'pozon-noche.webp'), 'Muestra de concepto', [{ emo: '♨️', x: 760, y: 1440, size: 150, rot: 8 }]);
  cover('portadas-reels/R07_cafe.png', 'Cafés y pastelerías', 'Un café con historia <em>merece más</em>', muestra('kuchen-haus-frutillar', 'vitrina.webp'), 'Muestra de concepto', [{ emo: '🥧', x: 760, y: 1440, size: 150, rot: 8 }]);
  cover('portadas-reels/R08_hotel-boutique.png', 'Hoteles boutique', 'Una web <em>a su altura</em>', muestra('hotel-casa-nogal', 'hab-rio.webp'), 'Muestra de concepto', [{ emo: '🛎️', x: 760, y: 1440, size: 150, rot: 8 }]);

  // ---------- Avisos ----------
  wide('avisos/google-3_metodo.png', 'ink', `${topo(1200, 900, { seed: 58, opacity: 0.14 })}<div style="position:absolute;inset:80px;display:flex;flex-direction:column;justify-content:center;gap:28px"><div class="eyebrow">Así trabajo</div><h1 class="serif" style="font-size:80px;line-height:1.03;font-weight:500">Cuatro pasos. <em>Cero sorpresas.</em></h1><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">${['Su lugar', 'Propuesta y contrato', 'Diseño', 'Al aire 🚀'].map((t, i) => `<div class="stk" style="position:relative;transform:rotate(${[-2, 1.5, -1, 2][i]}deg);white-space:normal;padding:22px"><p class="serif" style="font-size:44px;color:#8a6a2a">0${i + 1}</p><p style="font-size:24px;font-weight:800">${t}</p></div>`).join('')}</div><p style="font-size:28px;font-weight:600">Primero ve su portada · desde ${B.carta}</p></div>`,
    [{ hand: 'sin letra chica', x: 820, y: 120, rot: 6, size: 52 }]);
  wide('avisos/grupos-fb_cafes.png', 'paper', `<div style="position:absolute;left:70px;top:90px;width:600px;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Cafés y pastelerías · Araucanía</div><h1 class="serif" style="font-size:76px;line-height:1.03;font-weight:500">Su carta, su historia <em>y sus pedidos</em></h1><p style="font-size:32px;font-weight:600">Carta QR desde ${B.carta}</p><p style="font-size:26px;opacity:.75">WhatsApp ${B.wa}</p></div><span style="position:absolute;right:60px;bottom:28px;font-size:18px;opacity:.6">Muestra de concepto · Kuchen Haus</span>`,
    [{ pola: muestra('kuchen-haus-frutillar', 'vitrina.webp'), x: 760, y: 110, w: 360, h: 420, rot: 5, cap: 'la vitrina' }, { emo: '☕', x: 700, y: 600, size: 130, rot: -8 }]);
}

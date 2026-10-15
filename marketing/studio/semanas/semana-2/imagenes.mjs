// Semana 2 (26 de octubre al 1 de noviembre): imágenes con las plantillas de la marca.
// Todo el contenido sale del sitio real (método, compromisos, dudas) o de muestras rotuladas.
import { topo, icon, asset, EMBLEM, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
  const { add, W, H, SH, waQR, slide, story, cta, phone, list, phoneCover, cover, wide } = k;
  const muestra = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);
  const REDVAERU = asset('public/og.jpg');

  // ---------- S04 · ¿Qué le frena? (lun 26, 20:30) ----------
  const S04 = '2026-10-26_2030_S04_historias-que-le-frena';
  story({ file: `${S04}/1.png`, title: '¿Qué le frena más para <em>tener su web?</em>' });
  story({ file: `${S04}/2.png`, cls: 'cream', eyebrow: 'Respuesta corta', extra: list(['¿Tiempo? Me manda fotos y 5 respuestas; el resto lo hago yo', `¿Precio? Desde ${B.carta}, con pago en dos partes`, '¿Por dónde partir? Por su portada, gratis'], '#8a6a2a', 48) });
  story({ file: `${S04}/3.png`, title: 'Partamos por <em>su portada.</em>', extra: cta() });

  // ---------- C03 · Lo que necesito de usted (mar 27, 19:30) ----------
  const C03 = '2026-10-27_1930_C03_lo-que-necesito';
  slide({ file: `${C03}/01.png`, seed: 70, eyebrow: 'Su web, sin complicarse', title: 'Esto es todo lo que <em>necesito de usted</em>', body: 'Cinco cosas. El resto lo hago yo. Deslice →', align: 'center', titleSize: 110, n: 0, total: 7 });
  slide({ file: `${C03}/01-B.png`, seed: 70, eyebrow: 'Su web, sin complicarse', title: '¿Le da flojera hacer <em>su web?</em>', body: 'Es menos trabajo del que cree. Deslice →', align: 'center', titleSize: 116, n: 0, total: 7 });
  const needs = [
    ['photo', 'Fotos de su lugar', 'Las que ya tiene en Instagram o Booking sirven. Si faltan, coordinamos una sesión.'],
    ['doc', 'Su historia, en breve', 'Cómo nació su negocio y qué lo hace distinto. Con un audio de WhatsApp basta.'],
    ['star', 'Tarifas y políticas', 'Precios, servicios, mascotas, horarios. Lo que hoy responde una y otra vez.'],
    ['chat', 'Sus enlaces', 'Booking, Airbnb o Instagram: de ahí tomo fotos, reseñas y datos.'],
    ['calendar', '30 minutos', 'Para revisar el diseño juntos. Nada más.'],
  ];
  needs.forEach(([ic, t, b], i) => slide({ file: `${C03}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 71 + i, eyebrow: `${i + 1} de 5`, title: t, body: b, extra: `<div style="margin-top:10px">${icon(ic, 120, i % 2 ? C.gold : '#8a6a2a', 1.3)}</div>`, align: 'center', titleSize: 100, n: i + 1, total: 7 }));
  slide({ file: `${C03}/07.png`, seed: 77, eyebrow: 'Garantía de portada', title: 'Con eso le muestro <em>su portada.</em>', body: 'Si no le convence, no paga.', extra: cta(), align: 'center', n: 6, total: 7 });

  // ---------- C04 · Compromisos (jue 29, 19:30) ----------
  const C04 = '2026-10-29_1930_C04_compromisos';
  slide({ file: `${C04}/01.png`, seed: 80, eyebrow: 'Mis compromisos', title: 'Trabajar conmigo es <em>sin letra chica.</em>', body: 'Seis compromisos con cada cliente. Deslice →', align: 'center', titleSize: 112, n: 0, total: 8 });
  const promises = [
    ['doc', 'Todo con contrato', 'Alcance, plazo, precio y forma de pago, firmados. Lo que dice el contrato es lo que paga.'],
    ['shield', 'Garantía de portada', 'Primero ve el diseño de su portada. Si no le convence, no paga nada.'],
    ['home', 'Todo queda a su nombre', 'Dominio, accesos y contenidos son suyos. Nunca queda «secuestrado» por un proveedor.'],
    ['calendar', 'Sin permanencia', 'Los servicios mensuales se pausan o terminan con aviso de 30 días.'],
    ['chat', 'Respuesta en menos de 24 h', 'Días hábiles. Por WhatsApp o correo, como le acomode.'],
    ['check', 'Usted queda capacitado', 'Le dejo una guía para cambiar textos y fotos sin depender de mí.'],
  ];
  promises.forEach(([ic, t, b], i) => slide({ file: `${C04}/0${i + 2}.png`, cls: i % 2 ? 'cream' : 'ink', seed: 81 + i, eyebrow: `Compromiso ${i + 1}`, title: t, body: b, extra: `<div style="margin-top:10px">${icon(ic, 120, i % 2 ? '#8a6a2a' : C.gold, 1.3)}</div>`, align: 'center', titleSize: 96, n: i + 1, total: 8 }));
  slide({ file: `${C04}/08.png`, cls: 'cream', eyebrow: 'Guárdelo', title: 'Compárelo con <em>cualquier propuesta.</em>', extra: `<div style="display:flex;align-items:center;gap:40px"><img src="${waQR}" style="width:220px;height:220px;border-radius:16px"><p style="font-size:38px;font-weight:700;line-height:1.35">Escríbame<br>PORTADA</p></div>`, align: 'center', n: 7, total: 8, titleSize: 100 });

  // ---------- C05 · Preguntas frecuentes (sáb 31, 11:30) ----------
  const C05 = '2026-10-31_1130_C05_preguntas';
  slide({ file: `${C05}/01.png`, seed: 90, eyebrow: 'Dudas frecuentes', title: 'Las preguntas que <em>más me hacen</em>', body: 'Con respuesta corta. Deslice →', align: 'center', titleSize: 116, n: 0, total: 7 });
  slide({ file: `${C05}/01-B.png`, seed: 90, eyebrow: 'Dudas frecuentes', title: 'Antes de escribirme, <em>lea esto</em>', body: '5 respuestas en 1 minuto →', align: 'center', titleSize: 116, n: 0, total: 7 });
  const faqs = [
    ['¿Firmamos contrato?', 'Sí, siempre. Alcance, plazos, precio y forma de pago quedan por escrito, y el sitio es suyo.'],
    ['¿Y si no tengo logo?', 'Se lo diseño sin costo. Todos los planes lo incluyen si aún no tiene uno.'],
    ['¿En cuánto tiempo está lista?', 'Esencial: 1 a 2 semanas. Completo: 3 a 4. El plazo corre cuando tengo sus textos y fotos.'],
    ['¿Incluye dominio y hosting?', 'Sí, el primer año y a su nombre. Desde el segundo año se cotiza o va en la mantención.'],
    ['¿Puedo cambiar textos y fotos yo?', 'Sí. Le dejo una capacitación breve y una guía. Si prefiere, existe la mantención mensual.'],
  ];
  faqs.forEach(([q, a], i) => slide({ file: `${C05}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 91 + i, eyebrow: `Pregunta ${i + 1}`, title: q, body: a, align: 'center', titleSize: 96, n: i + 1, total: 7 }));
  slide({ file: `${C05}/07.png`, seed: 97, eyebrow: '¿Otra duda?', title: 'Pregúntele a <em>Vaeru IA</em> o escríbame', body: `${B.site} · WhatsApp ${B.wa}`, extra: cta(), align: 'center', n: 6, total: 7, titleSize: 100 });

  // ---------- S05 · Cupos y cuenta regresiva (vie 30, 20:30) ----------
  const S05 = '2026-10-30_2030_S05_historias-cupos';
  for (let n = B.cupos; n >= 1; n--) story({ file: `${S05}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Precios de lanzamiento solo para los primeros clientes.', titleSize: 140 });
  story({ file: `${S05}/2_faltan-31-dias.png`, cls: 'cream', eyebrow: 'Paquete Temporada', title: 'Faltan <em style="white-space:nowrap">31 días</em> para el 30 de noviembre', body: 'Su web lista antes del verano: escríbame TEMPORADA.', titleSize: 120 });

  // ---------- Portadas de Reels ----------
  cover('portadas-reels/R05_metodo.png', 'Así trabajo', 'Cuatro pasos. <em>Cero sorpresas.</em>');
  cover('portadas-reels/R06_termas.png', 'Termas y spa', 'Si sus termas tuvieran <em>su propia web</em>', muestra('termas-rayenko', 'pozon-noche.webp'), 'Muestra de concepto');
  cover('portadas-reels/R07_cafe.png', 'Cafés y pastelerías', 'Un café con historia <em>merece más</em>', muestra('kuchen-haus-frutillar', 'vitrina.webp'), 'Muestra de concepto');
  cover('portadas-reels/R08_hotel-boutique.png', 'Hoteles boutique', 'Una web <em>a su altura</em>', muestra('hotel-casa-nogal', 'hab-rio.webp'), 'Muestra de concepto');

  // ---------- Avisos ----------
  wide('avisos/google-3_metodo.png', 'ink', `${topo(1200, 900, { seed: 58 })}<div style="position:absolute;inset:80px;display:flex;flex-direction:column;justify-content:center;gap:28px"><div class="eyebrow">Así trabajo</div><h1 class="serif" style="font-size:80px;line-height:1.03;font-weight:500">Cuatro pasos. <em>Cero sorpresas.</em></h1><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">${['Su lugar', 'Propuesta y contrato', 'Diseño', 'Al aire'].map((t, i) => `<div class="card" style="padding:22px"><p class="serif gold2" style="font-size:44px">0${i + 1}</p><p style="font-size:24px;font-weight:700">${t}</p></div>`).join('')}</div><p style="font-size:28px;font-weight:600">Primero ve su portada · desde ${B.carta}</p></div>`);
  wide('avisos/grupos-fb_cafes.png', 'paper', `<div style="position:absolute;left:70px;top:90px;width:600px;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Cafés y pastelerías · Araucanía</div><h1 class="serif" style="font-size:76px;line-height:1.03;font-weight:500">Su carta, su historia <em>y sus pedidos</em></h1><p style="font-size:32px;font-weight:600">Carta QR desde ${B.carta}</p><p style="font-size:26px;opacity:.75">WhatsApp ${B.wa}</p></div><div style="position:absolute;right:110px;top:70px">${phone(muestra('kuchen-haus-frutillar', 'vitrina.webp'), 330, 3)}</div><span style="position:absolute;right:60px;bottom:28px;font-size:18px;opacity:.6">Muestra de concepto · Kuchen Haus</span>`);
}

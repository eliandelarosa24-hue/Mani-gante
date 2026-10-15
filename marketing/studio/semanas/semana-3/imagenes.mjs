// Semana 3 (2 al 8 de noviembre): imágenes con las plantillas de la marca.
// Contenido del sitio real (calculadora, diagnóstico, planes, dudas) o de muestras rotuladas.
import { topo, icon, asset, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
  const { add, waQR, slide, story, cta, phone, list, cover, phoneCover, wide } = k;
  const muestra = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);

  // ---------- S06 · Faltan 4 semanas (lun 2, 20:30) ----------
  const S06 = '2026-11-02_2030_S06_historias-faltan-4-semanas';
  story({ file: `${S06}/1.png`, eyebrow: 'Temporada de verano', title: '¿Su web estará lista <em>para diciembre?</em>' });
  story({ file: `${S06}/2.png`, cls: 'cream', eyebrow: 'Temporada de verano', title: 'Lo que alcanza <em>antes del 30</em>', extra: list(['Carta QR o Esencial: 1 a 2 semanas', 'Completo o Temporada: 3 a 4 semanas', 'Y antes de pagar, ve su portada'], '#8a6a2a', 46) });
  story({ file: `${S06}/3.png`, title: 'Faltan <em style="white-space:nowrap">4 semanas.</em> Partamos por su portada.', extra: cta() });

  // ---------- C06 · 3 errores (mar 3, 19:30) ----------
  const C06 = '2026-11-03_1930_C06_tres-errores';
  slide({ file: `${C06}/01.png`, seed: 100, eyebrow: 'Antes del verano', title: '3 errores en la web <em>de una cabaña</em>', body: 'Y cómo arreglarlos. Deslice →', align: 'center', titleSize: 116, n: 0, total: 6 });
  slide({ file: `${C06}/01-B.png`, seed: 100, eyebrow: 'Antes del verano', title: '¿Su web hace que <em>reserven en otra?</em>', body: '3 errores que veo seguido →', align: 'center', titleSize: 112, n: 0, total: 6 });
  const errores = [
    ['chat', 'Solo se reserva por la plataforma', 'El huésped que quiere escribirle no encuentra cómo.', 'Un botón de WhatsApp siempre a la vista.'],
    ['photo', '40 fotos revueltas', 'El huésped compara fotos antes que precios.', 'Fotos por espacio: dormitorio, cocina, tinaja, vista.'],
    ['pin', 'Nadie sabe cómo llegar', 'Si no lo ubica, sigue buscando.', 'Mapa y distancias: al lago, al parque, al centro.'],
  ];
  errores.forEach(([ic, t, b, fix], i) => slide({ file: `${C06}/0${i + 2}.png`, cls: i % 2 ? 'cream' : 'ink', seed: 101 + i, eyebrow: `Error ${i + 1}`, title: t, body: b, extra: `<div style="display:flex;align-items:center;gap:22px;margin-top:14px;padding:26px 32px;border-radius:24px;border:2px solid ${i % 2 ? '#8a6a2a' : C.gold}">${icon(ic, 72, i % 2 ? '#8a6a2a' : C.gold, 1.6)}<p style="font-size:36px;font-weight:700;line-height:1.3;text-align:left">${fix}</p></div>`, align: 'center', titleSize: 96, n: i + 1, total: 6 }));
  slide({ file: `${C06}/05.png`, cls: 'cream', seed: 104, eyebrow: '¿Y su web?', title: 'Hágale el <em>diagnóstico gratuito</em>', body: 'Seis preguntas, un minuto: recibe un puntaje y las tres mejoras que más le conviene hacer primero.', extra: `<p style="font-size:34px;font-weight:700">${B.site}</p>`, align: 'center', titleSize: 100, n: 4, total: 6 });
  slide({ file: `${C06}/06.png`, seed: 105, eyebrow: 'Revisión gratis', title: 'O se la reviso yo, <em>sin costo.</em>', body: 'Y si no tiene web, le muestro su portada.', extra: cta(), align: 'center', n: 5, total: 6 });

  // ---------- P08 · Temporada en detalle (jue 5, 19:30) ----------
  const P08 = '2026-11-05_1930_P08_temporada-detalle';
  slide({ file: `${P08}/01.png`, seed: 110, eyebrow: `Paquete Temporada · ${B.cuposTemporada} cupos`, title: 'Su web lista <em>antes del 30 de noviembre</em>', body: 'Qué incluye y cuándo hay que partir. Deslice →', align: 'center', titleSize: 108, n: 0, total: 6 });
  slide({ file: `${P08}/01-B.png`, seed: 110, eyebrow: `Paquete Temporada · ${B.temporada}`, title: 'Para tenerla el 30, <em>hay que partir el 9</em>', body: 'Le explico por qué. Deslice →', align: 'center', titleSize: 108, n: 0, total: 6 });
  slide({ file: `${P08}/02.png`, cls: 'cream', seed: 111, eyebrow: 'Qué incluye', title: 'Una web completa', extra: list(['Sus unidades o su carta, servicios y entorno', 'Galería por espacios y mapa', 'Reservas por WhatsApp o enlace a su sistema'], '#8a6a2a', 44), align: 'center', titleSize: 104, n: 1, total: 6 });
  slide({ file: `${P08}/03.png`, seed: 112, eyebrow: 'Y además', title: 'Lo que la hace <em>trabajar</em>', extra: list(['Ficha de Google configurada', '1 mes de mantención gratis', 'Dominio y hosting el primer año, a su nombre'], C.gold, 44), align: 'center', titleSize: 104, n: 2, total: 6 });
  slide({ file: `${P08}/04.png`, cls: 'cream', seed: 113, eyebrow: 'El calendario', title: 'Partir el 9, <em>publicar el 30</em>', extra: `<div style="display:flex;flex-direction:column;gap:18px;width:100%">${[['Lun 9 nov', 'Conversamos y firmamos'], ['Semana 1', 'Su portada, para aprobar'], ['Semanas 2 y 3', 'Diseño con su revisión'], ['30 nov', 'Al aire, antes del verano']].map(([d, t]) => `<div style="display:flex;gap:28px;align-items:center;padding:20px 28px;border-radius:20px;background:rgba(138,106,42,.1)"><p class="serif" style="font-size:40px;width:280px;color:#8a6a2a">${d}</p><p style="font-size:34px;font-weight:600">${t}</p></div>`).join('')}</div>`, align: 'center', titleSize: 96, n: 3, total: 6 });
  slide({ file: `${P08}/05.png`, seed: 114, eyebrow: 'Precio de lanzamiento', title: `<span class="gold2">${B.temporada}</span>`, body: `Solo ${B.cuposTemporada} cupos. Pago en dos partes: 50% al aprobar su portada y 50% al publicar.`, align: 'center', titleSize: 180, n: 4, total: 6 });
  slide({ file: `${P08}/06.png`, cls: 'cream', eyebrow: 'Garantía de portada', title: 'Primero ve su portada. <em>Si no le convence, no paga.</em>', extra: `<div style="display:flex;align-items:center;gap:40px"><img src="${waQR}" style="width:220px;height:220px;border-radius:16px"><p style="font-size:38px;font-weight:700;line-height:1.35">Escríbame<br>TEMPORADA</p></div>`, align: 'center', n: 5, total: 6, titleSize: 96 });

  // ---------- S07 · Cupos y faltan 24 días (vie 6, 20:30) ----------
  const S07 = '2026-11-06_2030_S07_historias-cupos';
  for (let n = B.cupos; n >= 1; n--) story({ file: `${S07}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Precios de lanzamiento solo para los primeros clientes.', titleSize: 140 });
  story({ file: `${S07}/2_faltan-24-dias.png`, cls: 'cream', eyebrow: 'Temporada de verano', title: 'Faltan <em style="white-space:nowrap">24 días</em> para el 30 de noviembre', body: 'Carta QR y Esencial todavía alcanzan. Escríbame PORTADA.', titleSize: 120 });

  // ---------- C07 · Ficha de Google (sáb 7, 11:30) ----------
  const C07 = '2026-11-07_1130_C07_ficha-de-google';
  slide({ file: `${C07}/01.png`, seed: 120, eyebrow: 'Antes que su web', title: 'Su ficha de Google, <em>lista para el verano</em>', body: '5 cosas para dejarla lista este fin de semana. Guárdelo ✓', align: 'center', titleSize: 108, n: 0, total: 7 });
  const google = [
    ['calendar', 'Categoría y horario de verano', 'Si dice «cerrado» o la categoría está mal, el huésped ni siquiera la abre.'],
    ['photo', 'Fotos por espacio', 'Dormitorio, baño, cocina, tinaja, vista. No solo la fachada.'],
    ['phone', 'Enlace a su web y WhatsApp', 'Que desde Google le puedan escribir y reservar directo.'],
    ['star', 'Pida reseñas al salir', 'El mejor momento es al despedir al huésped, con un enlace directo.'],
    ['chat', 'Responda todas las reseñas', 'También las malas: quien lee la respuesta es el próximo huésped.'],
  ];
  google.forEach(([ic, t, b], i) => slide({ file: `${C07}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 121 + i, eyebrow: `${i + 1} de 5`, title: t, body: b, extra: `<div style="margin-top:10px">${icon(ic, 120, i % 2 ? C.gold : '#8a6a2a', 1.3)}</div>`, align: 'center', titleSize: 96, n: i + 1, total: 7 }));
  slide({ file: `${C07}/07.png`, seed: 127, eyebrow: '¿Prefiere no hacerlo usted?', title: 'Va incluida en el <em>Paquete Temporada</em>', body: `${B.temporada} · ${B.cuposTemporada} cupos · lista antes del 30 de noviembre`, extra: cta('TEMPORADA'), align: 'center', n: 6, total: 7, titleSize: 100 });

  // ---------- Portadas de Reels ----------
  cover('portadas-reels/R09_calculadora-restaurante.png', 'Restaurantes y delivery', '¿Cuánto le paga <em>a las apps?</em>');
  cover('portadas-reels/R10_cabanas-lago.png', 'Cabañas', 'Su cabaña, <em>frente al lago</em>', muestra('cabanas-lago-azul', 'hero.webp'), 'Muestra de concepto');
  cover('portadas-reels/R11_tours.png', 'Tours y experiencias', 'Un tour se vende <em>con la experiencia</em>', muestra('pucon-aventura', 'tour-1.webp'), 'Muestra de concepto');
  cover('portadas-reels/R12_diagnostico.png', 'Diagnóstico gratuito', '¿Qué tan independiente es <em>su negocio?</em>');

  // ---------- Avisos ----------
  wide('avisos/google-4_diagnostico.png', 'ink', `${topo(1200, 900, { seed: 64 })}<div style="position:absolute;inset:80px;display:flex;flex-direction:column;justify-content:center;gap:30px"><div class="eyebrow">Diagnóstico gratuito</div><h1 class="serif" style="font-size:84px;line-height:1.03;font-weight:500">¿Qué tan independiente es <em>su negocio?</em></h1><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">${[['6', 'preguntas'], ['1', 'minuto'], ['3', 'mejoras para partir']].map(([n, t]) => `<div class="card" style="padding:24px"><p class="serif gold2" style="font-size:64px">${n}</p><p style="font-size:26px;font-weight:700">${t}</p></div>`).join('')}</div><p style="font-size:30px;font-weight:600">${B.site} · sin compromiso</p></div>`);
  wide('avisos/grupos-fb_delivery.png', 'paper', `<div style="position:absolute;left:70px;top:80px;width:620px;display:flex;flex-direction:column;gap:24px"><div class="eyebrow">Restaurantes · Araucanía</div><h1 class="serif" style="font-size:72px;line-height:1.03;font-weight:500">¿Cuánto le paga a las apps <em>cada año?</em></h1><div class="card" style="padding:26px 30px;background:rgba(138,106,42,.1)"><p style="font-size:24px;opacity:.75">Ejemplo: 120 pedidos al mes · $15.000 · 25%</p><p class="serif" style="font-size:72px;color:#8a6a2a">$5.400.000</p><p style="font-size:24px;opacity:.75">en comisiones al año</p></div><p style="font-size:30px;font-weight:600">Carta QR con pedidos por WhatsApp desde ${B.carta}</p></div><div style="position:absolute;right:90px;top:70px">${phone(muestra('fogon-mapu', 'hero.webp'), 330, 3)}</div><span style="position:absolute;right:60px;bottom:28px;font-size:18px;opacity:.6">Muestra de concepto · Fogón Mapu</span>`);
}

// Semana 4 (9 al 15 de noviembre): imágenes con las plantillas de la marca.
// Contenido del sitio real (planes, dudas, casos) o de muestras rotuladas.
import { topo, icon, asset, BRAND as B, C } from '../../lib.mjs';

export default async function imagenes(k) {
  const { add, waQR, slide, story, cta, phone, list, cover, phoneCover, wide, POETAS_M } = k;
  const muestra = (slug, f) => asset(`public/muestras/${slug}/img/${f}`);

  // ---------- S08 · Último día para una web completa (lun 9, 20:30) ----------
  const S08 = '2026-11-09_2030_S08_historias-ultimo-dia';
  story({ file: `${S08}/1.png`, eyebrow: 'Temporada de verano', title: 'Hoy es el último día para partir <em>una web completa</em>', body: 'Toma de 3 a 4 semanas: para tenerla el 30 de noviembre, hay que partir hoy.', titleSize: 100 });
  story({ file: `${S08}/2.png`, cls: 'cream', eyebrow: '¿Algo más simple?', title: 'Carta QR y Esencial <em>alcanzan hasta el 16</em>', extra: list(['De 1 a 2 semanas', `Desde ${B.carta}`, 'Primero ve su portada'], '#8a6a2a', 46) });
  story({ file: `${S08}/3.png`, title: 'Partamos <em>esta semana.</em>', extra: cta() });

  // ---------- C08 · Lista final (mar 10, 19:30) ----------
  const C08 = '2026-11-10_1930_C08_lista-final';
  slide({ file: `${C08}/01.png`, seed: 130, eyebrow: 'Antes de diciembre', title: 'La lista final <em>para el verano</em>', body: '6 cosas para dejar listas antes de la temporada. Guárdelo ✓', align: 'center', titleSize: 116, n: 0, total: 8 });
  slide({ file: `${C08}/01-B.png`, seed: 130, eyebrow: 'Guárdelo y vaya marcando', title: '¿Su negocio está listo <em>para diciembre?</em>', body: '6 puntos para revisar hoy →', align: 'center', titleSize: 112, n: 0, total: 8 });
  const lista = [
    ['star', 'Tarifas de temporada', 'Definidas y publicadas, para no improvisar cada consulta.'],
    ['doc', 'Políticas por escrito', 'Abono, cancelación, check-in y mascotas. Menos preguntas repetidas.'],
    ['photo', 'Fotos de primavera', 'Con verde y con sol. Las de invierno no venden el verano.'],
    ['chat', 'Respuestas rápidas', 'En WhatsApp Business: tarifas, cómo llegar y cómo reservar.'],
    ['pin', 'Ficha de Google al día', 'Horario de verano, fotos nuevas y enlace a su WhatsApp.'],
    ['home', 'Un canal propio', 'Una web donde reservar directo, sin comisión por cada noche.'],
  ];
  lista.forEach(([ic, t, b], i) => slide({ file: `${C08}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 131 + i, eyebrow: `${i + 1} de 6`, title: t, body: b, extra: `<div style="margin-top:10px">${icon(ic, 120, i % 2 ? C.gold : '#8a6a2a', 1.3)}</div>`, align: 'center', titleSize: 100, n: i + 1, total: 8 }));
  slide({ file: `${C08}/08.png`, seed: 138, eyebrow: '¿Le falta el 6?', title: 'Su web, <em>antes del verano.</em>', body: `Carta QR ${B.carta} · Esencial ${B.esencial} · Temporada ${B.temporada}`, extra: cta(), align: 'center', n: 7, total: 8 });

  // ---------- C09 · Preguntas, parte 2 (jue 12, 19:30) ----------
  const C09 = '2026-11-12_1930_C09_preguntas-2';
  slide({ file: `${C09}/01.png`, seed: 140, eyebrow: 'Dudas frecuentes · parte 2', title: 'Más preguntas que <em>me hacen</em>', body: 'Con respuesta corta. Deslice →', align: 'center', titleSize: 116, n: 0, total: 7 });
  const faqs = [
    ['¿Por qué no muestra todos los precios?', 'Porque no cuesta lo mismo una cabaña que un hotel con tres idiomas. El precio fijo siempre llega por escrito antes de pagar.'],
    ['¿Esencial, Completo o Firma?', 'Esencial: una página para que le escriban. Completo: secciones, galería y reservas. Firma: un sitio a medida, como las muestras.'],
    ['¿Por qué precios de lanzamiento?', `Porque estoy sumando mis primeros proyectos turísticos. Son ${B.cupos} cupos; después rige el precio normal.`],
    ['¿Cómo se paga?', 'En dos partes: 50% al aprobar su portada y 50% al publicar. Con boleta o factura, sin cobros sorpresa.'],
    ['¿Trabaja fuera de Chile?', 'Sí, especialmente en el Caribe y República Dominicana, de forma remota y en USD.'],
  ];
  faqs.forEach(([q, a], i) => slide({ file: `${C09}/0${i + 2}.png`, cls: i % 2 ? 'ink' : 'cream', seed: 141 + i, eyebrow: `Pregunta ${i + 1}`, title: q, body: a, align: 'center', titleSize: 92, n: i + 1, total: 7 }));
  slide({ file: `${C09}/07.png`, seed: 147, eyebrow: '¿Otra duda?', title: 'Pregúntele a <em>Vaeru IA</em> o escríbame', body: `${B.site} · WhatsApp ${B.wa}`, extra: cta(), align: 'center', n: 6, total: 7, titleSize: 100 });

  // ---------- S09 · Cupos y faltan 17 días (vie 13, 20:30) ----------
  const S09 = '2026-11-13_2030_S09_historias-cupos';
  for (let n = B.cupos; n >= 1; n--) story({ file: `${S09}/1_quedan-${n}-de-${B.cupos}.png`, eyebrow: 'Últimos cupos de lanzamiento', title: `Quedan <em style="white-space:nowrap">${n} de ${B.cupos}</em>`, body: 'Cuando se completen, rige el precio normal.', titleSize: 140 });
  story({ file: `${S09}/2_faltan-17-dias.png`, cls: 'cream', eyebrow: 'Temporada de verano', title: 'Faltan <em style="white-space:nowrap">17 días</em> para el 30 de noviembre', body: 'Carta QR y Esencial: hasta el lunes 16 para partir. Escríbame PORTADA.', titleSize: 120 });

  // ---------- P09 · Por qué estos precios (sáb 14, 11:30) ----------
  const P09 = '2026-11-14_1130_P09_por-que-estos-precios';
  const precios = (file, titleHtml) => slide({ file, cls: 'cream', seed: 150, eyebrow: `Precios de lanzamiento · ${B.cupos} cupos`, title: titleHtml,
    extra: `<div style="display:flex;flex-direction:column;gap:18px;width:100%">${[['Lo que paga usted', `Esencial a ${B.esencial} <s style="opacity:.5">desde ${B.esencialNormal}</s>`], ['Lo que le pido', 'Un testimonio, permiso para mostrar el trabajo y que me cuente cómo le fue']].map(([t, d]) => `<div style="padding:24px 30px;border-radius:22px;background:rgba(138,106,42,.1);text-align:left"><p class="eyebrow" style="color:#8a6a2a">${t}</p><p style="font-size:36px;font-weight:600;line-height:1.3;margin-top:8px">${d}</p></div>`).join('')}${cta()}</div>`,
    align: 'center', titleSize: 100, foot: true });
  precios(`${P09}/01.png`, '¿Por qué <em>estos precios?</em>');
  precios(`${P09}/01-B.png`, 'Un trato justo <em>para empezar</em>');

  // ---------- Portadas de Reels ----------
  cover('portadas-reels/R13_ultimos-cupos.png', 'Precios de lanzamiento', 'Los últimos <em>cupos</em>');
  cover('portadas-reels/R14_vina.png', 'Viñas y enoturismo', 'Una tarde <em>entre barricas</em>', muestra('vina-los-robles', 'barricas.webp'), 'Muestra de concepto');
  cover('portadas-reels/R15_villa-caribe.png', 'Del sur al Caribe', 'Villas frente <em>al mar</em>', muestra('villa-coral-samana', 'hero.webp'), 'Muestra de concepto');
  phoneCover('portadas-reels/R16_caso-poetas.png', 'Caso real · Nueva Imperial', 'Su historia, <em>su canal directo</em>', POETAS_M);

  // ---------- Avisos ----------
  wide('avisos/google-5_lanzamiento.png', 'ink', `${topo(1200, 900, { seed: 70 })}<div style="position:absolute;inset:70px;display:flex;flex-direction:column;justify-content:center;gap:30px"><div class="eyebrow">Precios de lanzamiento · ${B.cupos} cupos</div><h1 class="serif" style="font-size:76px;line-height:1.03;font-weight:500">Los últimos cupos, <em>antes del verano</em></h1><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:10px">${[['fork', 'Carta QR', B.carta, 'Restaurantes y cafés'], ['home', 'Esencial', B.esencial, 'Cabañas y hostales'], ['tree', 'Temporada', B.temporada, `${B.cuposTemporada} cupos · web completa`]].map(([i, n, p, d]) => `<div class="card" style="padding:34px;display:flex;flex-direction:column;gap:16px">${icon(i, 64)}<p class="serif" style="font-size:52px">${n}</p><p class="serif gold2" style="font-size:64px;font-weight:600">${p}</p><p style="font-size:24px;opacity:.85">${d}</p></div>`).join('')}</div><p style="font-size:30px;font-weight:600">Primero ve su portada · si no le convence, no paga</p></div>`);
  wide('avisos/grupos-fb_ultimos-cupos.png', 'paper', `<div style="position:absolute;left:70px;top:90px;width:600px;display:flex;flex-direction:column;gap:26px"><div class="eyebrow">Últimos cupos · Araucanía</div><h1 class="serif" style="font-size:76px;line-height:1.03;font-weight:500">Su web propia, <em>antes del verano</em></h1><p style="font-size:32px;font-weight:600">Carta QR ${B.carta} · Esencial ${B.esencial}<br>Temporada ${B.temporada}</p><p style="font-size:26px;opacity:.75">WhatsApp ${B.wa}</p></div><div style="position:absolute;right:110px;top:70px">${phone(POETAS_M, 330, 3)}</div><span style="position:absolute;right:60px;bottom:28px;font-size:18px;opacity:.6">Caso real · El Rincón de los Poetas</span>`);
}

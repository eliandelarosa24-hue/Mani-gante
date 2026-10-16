// Semana 4 (9 al 15 de noviembre de 2026): «Últimos cupos de lanzamiento».
// Objetivo: cierre honesto. Los cupos de lanzamiento se acaban y después rige el precio normal;
// el 9 de noviembre es el último día para partir un sitio completo a tiempo para el 30.
const WA = '+56 9 5228 9117';

export const SEMANA_INFO = { campana: 'Últimos cupos de lanzamiento', rango: '9 al 15 de noviembre' };

const img = (dir, names) => names.map((n) => `${dir}/${n}`);

export const PIECES = [
  {
    id: 'R13', day: '2026-11-09', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 19 s', title: 'Precios de lanzamiento: los últimos cupos',
    files: ['videos/2026-11-09_1230_R13_reel-ultimos-cupos_edit.mp4', 'portadas-reels/R13_ultimos-cupos.png'],
    ig: `Los precios de lanzamiento son para mis primeros 5 clientes. Cuando se completen, rige el precio normal 👇

🍽️ Carta QR: $49.000
🏡 Esencial: $59.000 (normal desde $149.000)
🌲 Temporada: $199.000 (3 cupos)

A cambio le pido un testimonio, permiso para mostrar el trabajo y que me cuente cómo le fue.
👉 PORTADA al ${WA}

#Araucanía #cabañas #restaurantes #turismochile`,
    notes: 'Todo lo que aparece es la sección Planes del sitio real. Antes de publicar, confirme en la planilla cuántos cupos quedan y corrija el texto si ya se tomó alguno.',
  },
  {
    id: 'S08', day: '2026-11-09', time: '20:30', where: ['Historias de Instagram'], format: '3 historias', title: 'Hoy se parte la última web completa',
    files: img('2026-11-09_2030_S08_historias-ultimo-dia', ['1.png', '2.png', '3.png']),
    ig: '', notes: 'Historia 3: agregue el sticker de enlace a WhatsApp. A quien reaccione, escríbale por privado: «¿Le muestro su portada esta semana?».',
  },
  {
    id: 'GOOGLE-5', day: '2026-11-10', time: '10:00', where: ['Ficha de Google'], format: 'Publicación', title: 'Ficha de Google: precios de lanzamiento',
    files: ['avisos/google-5_lanzamiento.png'],
    ig: 'Precios de lanzamiento para mis primeros 5 clientes: Carta QR $49.000, Esencial $59.000 y Paquete Temporada $199.000. Primero ve su portada; si no le convence, no paga. Cuando se completen los cupos, rige el precio normal.',
    noFb: true, notes: 'Solo si la ficha de Google ya está activa.',
  },
  {
    id: 'C08', day: '2026-11-10', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 8 láminas', title: 'Antes de diciembre: la lista final',
    files: img('2026-11-10_1930_C08_lista-final', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png']), filesB: img('2026-11-10_1930_C08_lista-final', ['01-B.png']),
    ig: `Antes de diciembre: la lista final para recibir el verano ✓

1. Tarifas de temporada definidas
2. Políticas por escrito: abono, cancelación, mascotas
3. Fotos de primavera, con verde y con sol
4. Respuestas rápidas en WhatsApp Business
5. Ficha de Google con horario de verano
6. Un canal propio para reservar directo

Guárdelo y vaya marcando. ¿Le falta el 6? 👉 PORTADA al ${WA}

#temporadadeverano #cabañas #Araucanía #emprendedoresdelsur`,
  },
  {
    id: 'GRUPOS-F', day: '2026-11-11', time: '10:00', where: ['Grupos de Facebook'], format: 'Publicación', title: 'Grupos de turismo: últimos cupos',
    files: ['avisos/grupos-fb_ultimos-cupos.png'],
    ig: `Para cabañas, hostales, restaurantes y tours de la Araucanía 🌲

Me quedan cupos de lanzamiento para webs propias, listas antes del verano:
• Carta QR: $49.000
• Esencial: $59.000
• Temporada (web completa + ficha de Google): $199.000

Primero le muestro su portada; si no le convence, no paga. Todo con contrato y a su nombre.

Muestras y casos reales: redvaeru.netlify.app · WhatsApp ${WA}`,
    noFb: true, notes: 'Máximo 2 grupos por día y solo donde las reglas permitan ofrecer servicios. Corrija los cupos si ya se tomó alguno.',
  },
  {
    id: 'R14', day: '2026-11-11', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Para viñas y enoturismo',
    files: ['videos/2026-11-11_1230_R14_reel-vina_edit.mp4', 'portadas-reels/R14_vina.png'],
    ig: `Una viña no vende botellas: vende una tarde entre barricas 🍷

Esta muestra de concepto la diseñé para una viña familiar: la casona, la cava, las catas y la cosecha, con reserva de visitas.

Es el plan Firma: diseño a medida para su lugar. 👉 PORTADA al ${WA}

#enoturismo #viñas #turismochile #vino`,
    notes: 'Muestra de concepto (Viña Los Robles, negocio ficticio): así se indica en pantalla.',
  },
  {
    id: 'C09', day: '2026-11-12', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 7 láminas', title: 'Más preguntas que me hacen (parte 2)',
    files: img('2026-11-12_1930_C09_preguntas-2', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png']),
    ig: `Más preguntas que me hacen, con respuesta corta (parte 2) 👇

¿Por qué no muestra todos los precios? Porque cada negocio es distinto; el precio fijo llega por escrito.
¿Esencial, Completo o Firma? Depende de cuánto quiere que haga su web.
¿Por qué los precios de lanzamiento? Porque estoy sumando mis primeros proyectos turísticos.
¿Cómo se paga? En dos partes, con boleta o factura.
¿Trabaja fuera de Chile? Sí, en el Caribe, en USD.

¿Otra duda? Pregúntele a Vaeru IA en redvaeru.netlify.app o escríbame al ${WA}`,
  },
  {
    id: 'R15', day: '2026-11-13', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Del sur de Chile al Caribe',
    files: ['videos/2026-11-13_1230_R15_reel-villa-caribe_edit.mp4', 'portadas-reels/R15_villa-caribe.png'],
    ig: `Del sur de Chile al Caribe 🌴

Esta muestra de concepto la diseñé para unas villas frente al mar en Samaná, República Dominicana: cada villa con su historia, la temporada de ballenas y precios en USD.

También trabajo en el Caribe, de forma remota. 👉 ${WA}

#Samaná #RepúblicaDominicana #villas #turismo`,
    notes: 'Muestra de concepto (Villa Coral Samaná, negocio ficticio): así se indica en pantalla.',
  },
  {
    id: 'S09', day: '2026-11-13', time: '20:30', where: ['Historias de Instagram'], format: '2 historias', title: 'Cupos y faltan 17 días',
    files: img('2026-11-13_2030_S09_historias-cupos', ['1_quedan-5-de-5.png', '1_quedan-4-de-5.png', '1_quedan-3-de-5.png', '1_quedan-2-de-5.png', '1_quedan-1-de-5.png', '2_faltan-17-dias.png']),
    ig: '', notes: 'Publique SOLO la imagen con el número real de cupos, más la historia 2 (cuenta regresiva al 30 de noviembre). Agregue el sticker de enlace a WhatsApp.',
  },
  {
    id: 'P09', day: '2026-11-14', time: '11:30', fbTime: '12:00', where: ['Instagram', 'Facebook'], format: 'Post', title: 'Por qué estos precios',
    files: ['2026-11-14_1130_P09_por-que-estos-precios/01.png'], filesB: ['2026-11-14_1130_P09_por-que-estos-precios/01-B.png'],
    ig: `¿Por qué una web Esencial a $59.000 si el precio normal parte en $149.000?

Porque estoy sumando mis primeros proyectos turísticos. A cambio le pido tres cosas:
1. Un testimonio
2. Permiso para mostrar el trabajo
3. Que me cuente cómo le fue

Son 5 cupos. Cuando se completen, rige el precio normal.
👉 PORTADA al ${WA}`,
  },
  {
    id: 'R16', day: '2026-11-15', time: '19:00', fbTime: '19:30', where: ['Instagram', 'Facebook'], format: 'Reel 18 s', title: 'Caso real: El Rincón de los Poetas',
    files: ['videos/2026-11-15_1900_R16_reel-caso-poetas_edit.mp4', 'portadas-reels/R16_caso-poetas.png'],
    ig: `El Rincón de los Poetas, en Almagro, tiene su propia web: su historia, sus espacios y un canal directo para reservar.

Faltan 15 días para el 30 de noviembre. Si quiere la suya antes del verano, Carta QR y Esencial todavía alcanzan.
👉 PORTADA al ${WA}

#NuevaImperial #Araucanía #hostal #turismochile`,
    notes: 'Todo lo que aparece es la web real de El Rincón de los Poetas.',
  },
];

export const KITS = [];

export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

// Semana 2 (26 de octubre al 1 de noviembre de 2026): «Cero sorpresas: así trabajo».
// Objetivo: confianza (método, compromisos, dudas reales del sitio) y nuevos rubros (termas, cafés, hoteles boutique).
const WA = '+56 9 5228 9117';

export const SEMANA_INFO = { campana: 'Cero sorpresas: así trabajo', rango: '26 de octubre al 1 de noviembre' };

const img = (dir, names) => names.map((n) => `${dir}/${n}`);

export const PIECES = [
  {
    id: 'R05', day: '2026-10-26', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 19 s', title: 'Cuatro pasos. Cero sorpresas.',
    files: ['videos/2026-10-26_1230_R05_reel-metodo_edit.mp4', 'portadas-reels/R05_metodo.png'],
    ig: `Así avanza su web conmigo, sin letra chica 👇

1️⃣ Su lugar: conversamos sobre su negocio y cómo recibe huéspedes hoy.
2️⃣ Propuesta y contrato: precio fijo por escrito en menos de 24 horas hábiles.
3️⃣ Diseño: usted revisa en los puntos clave.
4️⃣ Al aire: publicamos y le dejo capacitado.

Y antes de pagar, ve su portada. Si no le convence, no paga.
👉 PORTADA al ${WA}

#Araucanía #cabañas #turismochile #emprendedoresdelsur`,
    notes: 'Todo lo que aparece es el sitio real de Red Vaeru (sección Método).',
  },
  {
    id: 'GOOGLE-3', day: '2026-10-27', time: '10:00', where: ['Ficha de Google'], format: 'Publicación', title: 'Ficha de Google: cuatro pasos',
    files: ['avisos/google-3_metodo.png'],
    ig: 'Así trabajo: conversamos, le envío propuesta y contrato con precio fijo, diseño con su revisión y publicamos. Primero ve su portada; si no le convence, no paga. Webs para cabañas y restaurantes desde $49.000.',
    noFb: true, notes: 'Solo si la ficha de Google ya está activa.',
  },
  {
    id: 'S04', day: '2026-10-26', time: '20:30', where: ['Historias de Instagram'], format: '3 historias', title: '¿Qué le frena para tener web?',
    files: img('2026-10-26_2030_S04_historias-que-le-frena', ['1.png', '2.png', '3.png']),
    ig: '', notes: 'Historia 1: agregue el sticker de encuesta «El tiempo» / «El precio» / «No sé por dónde partir». A quien responda, escríbale por privado con la respuesta de la historia 2.',
  },
  {
    id: 'C03', day: '2026-10-27', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 7 láminas', title: 'Lo que necesito de usted para hacer su web',
    files: img('2026-10-27_1930_C03_lo-que-necesito', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png']), filesB: img('2026-10-27_1930_C03_lo-que-necesito', ['01-B.png']),
    ig: `¿Le da flojera pensar en hacer una web? Esto es todo lo que necesito de usted 👇

📸 Fotos de su lugar (o coordinamos una sesión)
✍️ Una descripción breve de su negocio y su historia
💲 Tarifas, servicios y políticas básicas
🔗 Sus enlaces de Booking, Airbnb o Instagram
⏱️ 30 minutos para revisar el diseño

El resto lo hago yo. 👉 PORTADA al ${WA}`,
  },
  {
    id: 'GRUPOS-D', day: '2026-10-28', time: '10:00', where: ['Grupos de Facebook'], format: 'Publicación', title: 'Grupos de emprendedores: cafés y pastelerías',
    files: ['avisos/grupos-fb_cafes.png'],
    ig: `¿Tiene un café, una pastelería o una cocina de autor? ☕🍰

Hago webs y cartas digitales para negocios gastronómicos de la Araucanía: su carta con fotos, su historia, su ubicación y un botón de WhatsApp para pedidos.

Carta QR desde $49.000. Primero le muestro su portada; si no le convence, no paga.

Muestras y casos: redvaeru.netlify.app · WhatsApp ${WA}`,
    noFb: true, notes: 'Máximo 2 grupos por día y solo donde las reglas permitan ofrecer servicios.',
  },
  {
    id: 'R06', day: '2026-10-28', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Si sus termas tuvieran su propia web',
    files: ['videos/2026-10-28_1230_R06_reel-termas_edit.mp4', 'portadas-reels/R06_termas.png'],
    ig: `Esta es una muestra de concepto que diseñé para unas termas de montaña: siete pozones, siete temperaturas, y la experiencia completa antes de llegar.

¿Tiene termas, tinajas o un spa de naturaleza? Le muestro una idea para el suyo.
👉 PORTADA al ${WA}

#termas #Araucanía #LosRíos #turismodebienestar`,
    notes: 'Muestra de concepto (Termas Rayenko, negocio ficticio): así se indica en pantalla.',
  },
  {
    id: 'C04', day: '2026-10-29', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 8 láminas', title: 'Mis compromisos: sin letra chica',
    files: img('2026-10-29_1930_C04_compromisos', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png']),
    ig: `Contratar una web no debería dar miedo. Estos son mis seis compromisos con cada cliente 👇

1. Todo con contrato
2. Garantía de portada
3. Todo queda a su nombre
4. Sin permanencia
5. Respuesta en menos de 24 h hábiles
6. Usted queda capacitado

Guárdelo y compárelo con cualquier otra propuesta. 👉 PORTADA al ${WA}`,
  },
  {
    id: 'R07', day: '2026-10-30', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Para cafés y pastelerías del sur',
    files: ['videos/2026-10-30_1230_R07_reel-cafe_edit.mp4', 'portadas-reels/R07_cafe.png'],
    ig: `Un café con historia merece algo más que una foto de la carta 🍰

Esta es una muestra de concepto para un café y pastelería del sur: sus kuchen, su historia familiar y un botón para encargar por WhatsApp.

¿Tiene un café o pastelería? Escríbame CARTA y le muestro cómo se vería el suyo.
👉 ${WA}

#cafeteria #pasteleria #kuchen #Temuco #Frutillar`,
    notes: 'Muestra de concepto (Kuchen Haus, negocio ficticio): así se indica en pantalla.',
  },
  {
    id: 'S05', day: '2026-10-30', time: '20:30', where: ['Historias de Instagram'], format: '2 historias', title: 'Cupos y fecha de temporada',
    files: [...img('2026-10-30_2030_S05_historias-cupos', ['1_quedan-5-de-5.png', '1_quedan-4-de-5.png', '1_quedan-3-de-5.png', '1_quedan-2-de-5.png', '1_quedan-1-de-5.png', '2_faltan-31-dias.png'])],
    ig: '', notes: 'Publique SOLO la imagen con el número real de cupos, más la historia 2 (cuenta regresiva al 30 de noviembre). Agregue el sticker de enlace a WhatsApp.',
  },
  {
    id: 'C05', day: '2026-10-31', time: '11:30', fbTime: '12:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 7 láminas', title: 'Las preguntas que más me hacen',
    files: img('2026-10-31_1130_C05_preguntas', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png']), filesB: img('2026-10-31_1130_C05_preguntas', ['01-B.png']),
    ig: `Las preguntas que más me hacen, con respuesta corta 👇

¿Firmamos contrato? Sí, siempre.
¿Y si no tengo logo? Se lo diseño sin costo.
¿En cuánto tiempo está lista? Esencial, 1 a 2 semanas.
¿Incluye dominio y hosting? Sí, el primer año.
¿Después puedo cambiar textos y fotos? Sí, le enseño.

¿Otra duda? Pregúntele a Vaeru IA en redvaeru.netlify.app o escríbame al ${WA}`,
  },
  {
    id: 'R08', day: '2026-11-01', time: '19:00', fbTime: '19:30', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Para hoteles boutique: una web a su altura',
    files: ['videos/2026-11-01_1900_R08_reel-hotel-boutique_edit.mp4', 'portadas-reels/R08_hotel-boutique.png'],
    ig: `Un hotel boutique vende una experiencia, no solo una habitación.

Esta muestra de concepto la diseñé para un hotel con historia junto al río: sus habitaciones, su restaurante y su ciudad, contados como un álbum.

Es el plan Firma: diseño a medida para su lugar. 👉 PORTADA al ${WA}

#hotelboutique #Valdivia #turismochile #hoteleria`,
    notes: 'Muestra de concepto (Hotel Casa Nogal, negocio ficticio): así se indica en pantalla.',
  },
];

export const KITS = [];

export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

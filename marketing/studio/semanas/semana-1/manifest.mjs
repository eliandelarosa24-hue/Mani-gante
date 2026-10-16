// Índice de la campaña: qué se publica, cuándo, dónde, con qué archivos y con qué texto.
// Fuente de los textos: docs/marketing/03-campana-semana-1.md. Lo usa build-hub.mjs.
const WA = '+56 9 5228 9117';
const tagsAra = '#Araucanía #Temuco #Curacautín #Villarrica #turismochile #cabañas #emprendedoresdelsur';
const img = (dir, names) => names.map((n) => `${dir}/${n}`);

export const SEMANA_INFO = { campana: 'Su web lista antes del verano', rango: '15 al 25 de octubre' };

export const PIECES = [
  {
    id: 'P01', day: '2026-10-15', time: '19:30', fbTime: '19:35', where: ['Instagram', 'Facebook'], format: 'Carrusel 5 láminas', title: 'Presentación: quién soy y qué hago',
    files: img('2026-10-15_1930_P01_presentacion', ['01.png', '02.png', '03.png', '04.png', '05.png']), filesB: img('2026-10-15_1930_P01_presentacion', ['01-B.png']),
    ig: `Hola 👋 Soy Jorge, de Red Vaeru.

Diseño páginas web para cabañas, hostales, glamping y restaurantes de la Araucanía. Estudio Ingeniería en Turismo y conozco de cerca lo que vive un anfitrión en temporada: mensajes a toda hora, comisiones y huéspedes que preguntan lo mismo diez veces.

Una web propia ordena todo eso: fotos, ubicación, precios y un botón directo a su WhatsApp.

✔️ Primero ve la portada de su web. Si no le convence, no paga.
✔️ Contrato, dominio y hosting el primer año incluidos.
✔️ Atiendo en persona en Temuco, Curacautín, Villarrica, Nueva Imperial y alrededores.

👉 Escríbame PORTADA al WhatsApp ${WA}.

${tagsAra}`,
    fbExtra: 'Si conoce a alguien con cabañas o un restaurante, compártaselo 🙌',
    notes: 'Fíjelo en el perfil. La variante B cambia solo la primera lámina.',
  },
  {
    id: 'P02', day: '2026-10-16', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 18 s', title: 'Así reservan directo en Curacautín',
    files: ['videos/2026-10-16_1230_P02_reel-miah-y-noah_edit.mp4', 'portadas-reels/P02_miah-y-noah.png'], 
    ig: `Cabañas Miah y Noah, en Curacautín, tiene su propio sitio: galería, check-in en línea, guía de la zona y WhatsApp directo.

«Nos ayudó a tener por fin un sitio propio para Cabañas Miah y Noah. Ahora nuestros huéspedes nos encuentran y reservan directo.» — Nicole, co-anfitriona.

¿Su alojamiento está solo en plataformas? Le muestro cómo se vería su web antes de que pague nada.
👉 Escríbame PORTADA al ${WA}

#Curacautín #cabañas #turismoaraucania #Conguillío`,
    notes: 'Agregue música instrumental tranquila desde la biblioteca de Instagram. Use la portada incluida. Fíjelo en el perfil.',
  },
  {
    id: 'P03', day: '2026-10-16', time: '19:30', fbTime: '19:35', where: ['Instagram', 'Facebook'], format: 'Carrusel 6 láminas', title: 'Planes y precios',
    files: img('2026-10-16_1930_P03_planes-y-precios', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png']), filesB: img('2026-10-16_1930_P03_planes-y-precios', ['01-B.png']),
    ig: `Precios claros, sin letra chica 👇

🍽️ Carta QR: $49.000
🏡 Esencial: $59.000
🌲 Temporada (3 cupos): $199.000, con 1 mes de mantención gratis

Son precios de lanzamiento para los primeros clientes. A cambio, le pido permiso para mostrar su web en mi portafolio.

Todo con contrato y pago en dos partes. Y antes de pagar, ve su portada.
👉 PORTADA, CARTA o TEMPORADA al ${WA}`,
    notes: 'Fíjelo en el perfil. Guárdelo también en la destacada «Planes».',
  },
  {
    id: 'P04', day: '2026-10-17', time: '11:30', fbTime: '12:00', where: ['Instagram', 'Facebook'], format: 'Reel 29 s', title: '10 muestras de concepto: ¿cuál se parece a su negocio?',
    files: ['videos/2026-10-17_1130_P04_reel-showreel-muestras_edit.mp4', 'portadas-reels/P04_showreel-muestras.png'],
    ig: `Diseñé 10 muestras para distintos rubros del turismo: termas, cabañas, domos, viña, café, cocina mapuche contemporánea… No son clientes: son ideas para mostrar lo que se puede hacer.

¿Cuál se parece a su lugar? Coménteme el número 👇

#turismochile #Araucanía #diseñoweb #emprendedoresdelsur`,
    notes: 'Responda cada comentario con un mensaje privado.',
  },
  {
    id: 'YAPO', day: '2026-10-17', time: '12:30', where: ['Yapo.cl'], format: 'Aviso (3 fotos)', title: 'Aviso en Yapo · categoría Servicios',
    files: ['avisos/yapo-1_caso-real.png', 'avisos/yapo-2_planes.png', 'avisos/yapo-3_garantia.png'],
    ig: `Página web para cabañas y restaurantes · Temuco y Araucanía · desde $49.000

¡Hola! Soy Jorge, de Temuco. Estudio Ingeniería en Turismo y hago páginas web para cabañas, hostales, restaurantes y emprendimientos de la zona.

Precios de lanzamiento: carta digital con QR para restaurantes a $49.000 y web para cabañas desde $59.000, con dominio y hosting el primer año.

Lo distinto: primero le muestro la portada de su web. Si no le convence, no paga.

Incluye: diseño para celular, botón de WhatsApp, ubicación, textos para Google, contrato y pago 50/50.

Ejemplos reales: redvaeru.netlify.app · WhatsApp ${WA}`,
    noFb: true, notes: 'La primera línea es el título del aviso.',
  },
  {
    id: 'P05', day: '2026-10-18', time: '12:00', fbTime: '12:30', where: ['Instagram', 'Facebook'], format: 'Post', title: 'Garantía de portada',
    files: ['2026-10-18_1200_P05_garantia/01.png'], filesB: ['2026-10-18_1200_P05_garantia/01-B.png'],
    ig: `Contratar una web no debería ser un salto al vacío.

Por eso trabajo al revés: primero le muestro la portada de su sitio, con sus fotos y su historia. Si no le convence, no paga nada y no queda comprometido.

👉 PORTADA al ${WA}`,
  },
  {
    id: 'P06', day: '2026-10-18', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Reel 18 s', title: 'El Rincón de los Poetas',
    files: ['videos/2026-10-18_1930_P06_reel-rincon-de-los-poetas_edit.mp4', 'portadas-reels/P06_rincon-de-los-poetas.png'],
    ig: `El Rincón de los Poetas tenía una historia que no se veía en ninguna plataforma. Ahora tiene una web que la cuenta y un canal directo para reservar.

¿Su lugar también tiene una historia? 👉 PORTADA al ${WA}

#NuevaImperial #Araucanía #hostal`,
    notes: 'Después de publicarlo, cree las destacadas (Planes · Casos · Muestras · Cómo trabajo · Dudas) con las portadas de la sección Perfil.',
  },
  {
    id: 'GRUPOS-A', day: '2026-10-19', time: '09:30', where: ['Grupos de Facebook'], format: 'Publicación', title: 'Grupos de emprendedores: oferta general',
    files: ['avisos/yapo-2_planes.png'],
    ig: `¡Hola, vecinos! Soy Jorge, de Temuco. Estudio Ingeniería en Turismo y hago páginas web para cabañas, hostales, restaurantes y emprendimientos de la zona.

Esta semana tengo precios de lanzamiento: carta digital con QR para restaurantes a $49.000 y web para cabañas desde $59.000, con dominio y hosting el primer año.

Lo distinto: primero le muestro la portada de su web. Si no le convence, no paga.

Ejemplos reales: redvaeru.netlify.app · WhatsApp ${WA} 🙌`,
    noFb: true, notes: 'Máximo 2 grupos por día y solo donde las reglas permitan ofrecer servicios.',
  },
  {
    id: 'R01', day: '2026-10-19', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: '¿Cuánto le dejó a la plataforma este año?',
    files: ['videos/2026-10-19_1230_R01_reel-calculadora_edit.mp4', 'portadas-reels/R01_calculadora.png'], 
    ig: `Haga este ejercicio con su propio extracto 👇

Reservas al mes × valor promedio × % de comisión × 12 meses.

No se trata de dejar las plataformas: traen huéspedes nuevos. Se trata de que el huésped que ya lo conoce, el que vuelve o el que le escribe por Instagram, pueda reservarle directo.

Calcule su número en la web (está en el inicio) o escríbame PORTADA y lo hacemos juntos en 15 minutos, gratis.

#cabañas #turismochile #Araucanía #anfitriones #reservadirecta`,
    fb: `Dueños de cabañas y hostales: ¿saben cuánto pagan al año en comisiones? Hice esta calculadora gratis 👇

Reservas al mes × valor promedio × % de comisión × 12 meses.

No se trata de dejar las plataformas: traen huéspedes nuevos. Se trata de que el huésped que ya lo conoce pueda reservarle directo.

Calcule su número en redvaeru.netlify.app o revisémoslo juntos por WhatsApp: ${WA}.`,
    notes: 'El ejemplo (10 reservas, $90.000, 15%) es ilustrativo: así se dice en el video.',
  },
  {
    id: 'S01', day: '2026-10-19', time: '20:30', where: ['Historias de Instagram'], format: '4 historias', title: '¿Su cabaña tiene web?',
    files: img('2026-10-19_2030_S01_historias-tiene-web', ['1.png', '2.png', '3.png', '4.png']),
    ig: '', notes: 'Historia 2: agregue el sticker de encuesta «Sí» / «No, solo plataformas» en el espacio libre. Historia 4: sticker de enlace a wa.me/56952289117. A quien vote «No», escríbale por privado.',
  },
  {
    id: 'GOOGLE-1', day: '2026-10-20', time: '10:00', where: ['Ficha de Google'], format: 'Publicación', title: 'Novedad en la ficha de Google',
    files: ['avisos/google-1_webs-turismo.png'],
    ig: 'Webs para cabañas y restaurantes de la Araucanía, con garantía de portada: primero ve su portada y, si no le convence, no paga. Desde $49.000. Escríbame por WhatsApp.',
    noFb: true, notes: 'Solo si la ficha de Google ya está activa. Botón: «Llamar» o «WhatsApp».',
  },
  {
    id: 'C01', day: '2026-10-20', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 7 láminas', title: '5 cosas que su web necesita antes de diciembre',
    files: img('2026-10-20_1930_C01_checklist-temporada', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png']), filesB: img('2026-10-20_1930_C01_checklist-temporada', ['01-B.png']),
    ig: `Guárdelo para revisarlo con calma ✅

Si no tiene web, o la tiene pero no cumple estos puntos, le hago una revisión gratis por WhatsApp.

👉 PORTADA al ${WA}

#Araucanía #cabañas #temporadadeverano #turismochile`,
  },
  {
    id: 'GRUPOS-B', day: '2026-10-21', time: '10:00', where: ['Grupos de Facebook'], format: 'Publicación', title: 'Grupos de comida: carta QR',
    files: ['avisos/grupos-fb_carta-qr.png'],
    ig: `¿Su carta sigue siendo un PDF o una foto? 🍽️

Le hago una carta digital con sus fotos, su marca y un QR para cada mesa, lista en pocos días. Carta QR: $49.000.

Escanee el QR de la imagen para ver una muestra. 👉 Escríbame CARTA al ${WA}`,
    noFb: true,
  },
  {
    id: 'R02', day: '2026-10-21', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Su carta, como una experiencia',
    files: ['videos/2026-10-21_1230_R02_reel-carta-qr_edit.mp4', 'portadas-reels/R02_carta-qr.png'], 
    ig: `Su carta es lo primero que el cliente revisa antes de entrar, o antes de pedir por WhatsApp.

Si hoy es un PDF o una foto, le hago una carta digital con sus fotos, su marca y un QR para cada mesa, lista en pocos días.

🍽️ Carta QR: $49.000
👉 Escríbame CARTA al ${WA}

#Temuco #restaurantesTemuco #gastronomiadelsur #picadas`,
    notes: 'La web es una muestra de concepto (Fogón Mapu) y así se indica en pantalla. El QR de la tarjeta funciona: abre la muestra.',
  },
  {
    id: 'S02', day: '2026-10-21', time: '20:30', where: ['Historias de Instagram'], format: '4 historias', title: 'Pregúnteme sobre webs',
    files: img('2026-10-21_2030_S02_historias-preguntas', ['1.png', '2.png', '3.png', '4.png']),
    ig: '', notes: 'Historia 1: agregue la caja de preguntas en el espacio libre. El jueves responda 2 o 3 preguntas reales en historias.',
  },
  {
    id: 'P07', day: '2026-10-22', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Post', title: 'Paquete Temporada',
    files: ['2026-10-22_1930_P07_paquete-temporada/01.png'], filesB: ['2026-10-22_1930_P07_paquete-temporada/01-B.png'],
    ig: `La temporada alta empieza en diciembre. Si su web está lista antes, todo el verano trabaja para usted.

🌲 Paquete Temporada ($199.000, 3 cupos):
• Web completa: unidades, servicios, entorno, galería por espacios y mapa
• Reservas por WhatsApp o enlace a su sistema
• Ficha de Google configurada
• 1 mes de mantención gratis (cambios e informe de visitas)
• Lista antes del 30 de noviembre*

Primero ve la portada. Si no le convence, no paga.
👉 Escríbame TEMPORADA al ${WA}

*Siempre que tenga fotos y textos listos a tiempo.`,
  },
  {
    id: 'GRUPOS-C', day: '2026-10-23', time: '10:00', where: ['Grupos de Facebook', 'Ficha de Google'], format: 'Publicación', title: 'Grupos de turismo y ficha de Google: Temporada',
    files: ['avisos/google-2_temporada.png'],
    ig: `La temporada alta empieza en diciembre. Si su web está lista antes, todo el verano trabaja para usted.

Paquete Temporada ($199.000, solo 3 cupos): web completa, reservas por WhatsApp, ficha de Google y 1 mes de mantención gratis. Lista antes del 30 de noviembre.

Primero ve la portada; si no le convence, no paga. WhatsApp ${WA}`,
    noFb: true,
  },
  {
    id: 'R03', day: '2026-10-23', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 20 s', title: 'Lo que su aviso en una plataforma no le da',
    files: ['videos/2026-10-23_1230_R03_reel-lo-que-no-le-da_edit.mp4', 'portadas-reels/R03_lo-que-no-le-da.png'],
    ig: `Esto es lo que tiene la web de Cabañas Miah y Noah, en Curacautín, y que ningún aviso en una plataforma le da:

✔️ Reservas por WhatsApp directo con los dueños
✔️ Su propia guía de Curacautín: Conguillío, termas, lagunas
✔️ Check-in en línea para llegar sin esperas
✔️ Sus reseñas, en su propia casa

La plataforma le sigue trayendo huéspedes nuevos. La web es su casa propia en internet.

👉 PORTADA al ${WA}

#Curacautín #cabañas #turismoaraucania`,
    notes: 'Todo lo que se ve es la web real de Cabañas Miah y Noah.',
  },
  {
    id: 'S03', day: '2026-10-23', time: '20:30', where: ['Historias de Instagram'], format: '3 historias', title: 'Cupos que quedan',
    files: [
      ...img('2026-10-23_2030_S03_historias-cupos', ['1_quedan-5-de-5.png', '1_quedan-4-de-5.png', '1_quedan-3-de-5.png', '1_quedan-2-de-5.png', '1_quedan-1-de-5.png']),
      ...img('2026-10-23_2030_S03_historias-cupos', ['2_temporada-3-de-3.png', '2_temporada-2-de-3.png', '2_temporada-1-de-3.png', '3.png']),
    ],
    ig: '', notes: 'Publique SOLO la versión con el número real de cupos: una de la serie 1, una de la serie 2 y la 3. Historia 3: sticker de enlace a WhatsApp.',
  },
  {
    id: 'C02', day: '2026-10-24', time: '11:30', fbTime: '12:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 6 láminas', title: '«Ya estoy en Booking, ¿para qué una web?»',
    files: img('2026-10-24_1130_C02_ya-estoy-en-booking', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png']), filesB: img('2026-10-24_1130_C02_ya-estoy-en-booking', ['01-B.png']),
    ig: `La pregunta que más me hacen esta semana 👇

Booking le trae huéspedes nuevos y conviene seguir ahí. La web propia es para los que ya lo conocen, para los que lo encuentran en Instagram y para no depender de un solo canal.

👉 PORTADA al ${WA}`,
  },
  {
    id: 'R04', day: '2026-10-25', time: '19:00', fbTime: '19:30', where: ['Instagram', 'Facebook'], format: 'Reel 15 s', title: 'Si su glamping tuviera su propia web',
    files: ['videos/2026-10-25_1900_R04_reel-glamping_edit.mp4', 'portadas-reels/R04_glamping.png'],
    ig: `Esta es una muestra de concepto que diseñé para mostrar lo que se puede hacer con un glamping de astroturismo: el cielo como protagonista.

¿Tiene domos o un glamping? Le muestro una idea para el suyo. 👉 PORTADA al ${WA}

#glamping #domos #astroturismo #Araucanía`,
  },
];

export const KITS = [
  { title: 'Perfil de Instagram y Facebook', note: 'Foto de perfil (las dos redes), portada de la página de Facebook y portadas de las 5 destacadas.', files: ['perfil/foto-perfil.png', 'perfil/portada-facebook.png', ...['planes', 'casos', 'muestras', 'como-trabajo', 'dudas'].map((n) => `perfil/destacadas/${n}.png`)] },
  { title: 'Anuncios listos para cuando haya presupuesto', note: 'Formatos de Meta (feed 1080×1080 e historias/Reels 1080×1920). También sirven como estados de WhatsApp.', files: ['carta-qr', 'esencial', 'temporada'].flatMap((n) => [`anuncios/${n}_1080x1080.png`, `anuncios/${n}_1080x1920.png`]) },
];

// Texto de Facebook: el de Instagram sin la línea de hashtags, más un cierre si corresponde.
export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

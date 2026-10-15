// Semana 3 (2 al 8 de noviembre de 2026): «Cuenta regresiva de temporada».
// Objetivo: urgencia real (faltan 4 semanas para el 30 de noviembre) con herramientas reales del sitio:
// la calculadora en modo restaurante y el diagnóstico gratuito. Rubros nuevos: cabañas de lago y tours.
const WA = '+56 9 5228 9117';

export const SEMANA_INFO = { campana: 'Cuenta regresiva de temporada', rango: '2 al 8 de noviembre' };

const img = (dir, names) => names.map((n) => `${dir}/${n}`);

export const PIECES = [
  {
    id: 'R09', day: '2026-11-02', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: '¿Cuánto le paga a las apps de delivery?',
    files: ['videos/2026-11-02_1230_R09_reel-calculadora-restaurante.mp4', 'portadas-reels/R09_calculadora-restaurante.png'], filesVoz: ['videos/2026-11-02_1230_R09_reel-calculadora-restaurante_voz.mp4'],
    ig: `¿Sabe cuánto le paga cada año a PedidosYa o Uber Eats? 🛵

Haga la cuenta con sus números en la calculadora de mi sitio. En el ejemplo del video: 120 pedidos al mes, de $15.000, con 25% de comisión, son $5.400.000 al año.

Una carta propia con pedidos por WhatsApp no paga comisión.
Carta QR desde $49.000 👉 escríbame CARTA al ${WA}

#restaurantes #delivery #Temuco #Araucanía #gastronomia`,
    notes: 'Todo lo que aparece es la calculadora real de redvaeru.netlify.app en modo Restaurante. Las cifras son un ejemplo, así lo dice el texto.',
  },
  {
    id: 'S06', day: '2026-11-02', time: '20:30', where: ['Historias de Instagram'], format: '3 historias', title: 'Faltan 4 semanas',
    files: img('2026-11-02_2030_S06_historias-faltan-4-semanas', ['1.png', '2.png', '3.png']),
    ig: '', notes: 'Historia 1: agregue el sticker de encuesta «Sí, lista» / «Todavía no». A quien responda «Todavía no», escríbale por privado: «¿Le muestro cómo se vería su portada? Es gratis».',
  },
  {
    id: 'GOOGLE-4', day: '2026-11-03', time: '10:00', where: ['Ficha de Google'], format: 'Publicación', title: 'Ficha de Google: diagnóstico gratuito',
    files: ['avisos/google-4_diagnostico.png'],
    ig: '¿Qué tan independiente es su negocio de las plataformas? Haga el diagnóstico gratuito en redvaeru.netlify.app: seis preguntas, un minuto, y recibe un puntaje con las tres mejoras que más le conviene hacer primero.',
    noFb: true, notes: 'Solo si la ficha de Google ya está activa.',
  },
  {
    id: 'C06', day: '2026-11-03', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 6 láminas', title: '3 errores en la web de una cabaña',
    files: img('2026-11-03_1930_C06_tres-errores', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png']), filesB: img('2026-11-03_1930_C06_tres-errores', ['01-B.png']),
    ig: `3 errores que veo seguido en las webs de cabañas (y cómo arreglarlos antes del verano) 👇

1️⃣ Reservar solo se puede por la plataforma. → Un botón de WhatsApp a la vista.
2️⃣ 40 fotos revueltas. → Fotos ordenadas por espacio: dormitorio, cocina, tinaja, vista.
3️⃣ Nadie sabe cómo llegar. → Mapa y distancias a lo que el huésped quiere visitar.

¿Quiere que revise la suya? Es gratis 👉 PORTADA al ${WA}

#cabañas #Araucanía #turismochile #emprendedoresdelsur`,
  },
  {
    id: 'GRUPOS-E', day: '2026-11-04', time: '10:00', where: ['Grupos de Facebook'], format: 'Publicación', title: 'Grupos de emprendedores: restaurantes y delivery',
    files: ['avisos/grupos-fb_delivery.png'],
    ig: `¿Tiene un restaurante, una picada o una cocina con delivery? 🍽️

Haga la cuenta: con 120 pedidos al mes de $15.000 y una comisión de 25%, la app se queda con $5.400.000 al año (es un ejemplo; ponga sus números en la calculadora de redvaeru.netlify.app).

Hago cartas digitales con QR y pedidos por WhatsApp, sin comisión por pedido. Desde $49.000, y primero le muestro su portada.

WhatsApp ${WA}`,
    noFb: true, notes: 'Máximo 2 grupos por día y solo donde las reglas permitan ofrecer servicios.',
  },
  {
    id: 'R10', day: '2026-11-04', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Cabañas frente al lago',
    files: ['videos/2026-11-04_1230_R10_reel-cabanas-lago.mp4', 'portadas-reels/R10_cabanas-lago.png'], filesVoz: ['videos/2026-11-04_1230_R10_reel-cabanas-lago_voz.mp4'],
    ig: `Esta es una muestra de concepto que diseñé para unas cabañas frente al lago: cada cabaña con su nombre y sus fotos, la tinaja, el kayak y el muelle, y la reserva directa por WhatsApp.

¿Tiene cabañas? Le muestro cómo se vería la suya, antes de pagar nada.
👉 PORTADA al ${WA}

#cabañas #lago #Villarrica #Araucanía #turismochile`,
    notes: 'Muestra de concepto (Cabañas Lago Azul, negocio ficticio): así se indica en pantalla.',
  },
  {
    id: 'P08', day: '2026-11-05', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 6 láminas', title: 'Paquete Temporada, en detalle',
    files: img('2026-11-05_1930_P08_temporada-detalle', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png']), filesB: img('2026-11-05_1930_P08_temporada-detalle', ['01-B.png']),
    ig: `Paquete Temporada, en detalle 🌲

✅ Web completa: unidades o carta, servicios y entorno
✅ Galería por espacios y mapa
✅ Reservas por WhatsApp o enlace a su sistema
✅ Ficha de Google configurada
✅ 1 mes de mantención gratis

$199.000 · solo 3 cupos.
Un sitio completo toma de 3 a 4 semanas: para tenerlo el 30 de noviembre, hay que partir a más tardar el lunes 9.

👉 Escríbame TEMPORADA al ${WA}`,
  },
  {
    id: 'R11', day: '2026-11-06', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 17 s', title: 'Para tours y experiencias',
    files: ['videos/2026-11-06_1230_R11_reel-tours.mp4', 'portadas-reels/R11_tours.png'], filesVoz: ['videos/2026-11-06_1230_R11_reel-tours_voz.mp4'],
    ig: `Un tour se vende con la experiencia, no con una lista de precios 🌋

Esta muestra de concepto la diseñé para una agencia de aventura en Pucón: cada salida con su nivel, su duración y sus fotos, y los guías que la acompañan.

¿Hace tours, cabalgatas, kayak o trekking? 👉 PORTADA al ${WA}

#Pucón #turismoaventura #Araucanía #tours`,
    notes: 'Muestra de concepto (Pucón Aventura, negocio ficticio): así se indica en pantalla.',
  },
  {
    id: 'S07', day: '2026-11-06', time: '20:30', where: ['Historias de Instagram'], format: '2 historias', title: 'Cupos y faltan 24 días',
    files: img('2026-11-06_2030_S07_historias-cupos', ['1_quedan-5-de-5.png', '1_quedan-4-de-5.png', '1_quedan-3-de-5.png', '1_quedan-2-de-5.png', '1_quedan-1-de-5.png', '2_faltan-24-dias.png']),
    ig: '', notes: 'Publique SOLO la imagen con el número real de cupos, más la historia 2 (cuenta regresiva al 30 de noviembre). Agregue el sticker de enlace a WhatsApp.',
  },
  {
    id: 'C07', day: '2026-11-07', time: '11:30', fbTime: '12:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 7 láminas', title: 'Su ficha de Google, lista para el verano',
    files: img('2026-11-07_1130_C07_ficha-de-google', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png']),
    ig: `Antes que su web, muchos huéspedes ven su ficha de Google. 5 cosas para dejarla lista este fin de semana 👇

1. Categoría y horario de verano correctos
2. Fotos por espacio, no solo la fachada
3. Enlace a su web y a su WhatsApp
4. Pida reseñas al salir el huésped
5. Responda todas las reseñas, también las malas

Guárdelo ✓ ¿Prefiere que se la deje lista yo? Va incluida en el Paquete Temporada. 👉 ${WA}`,
  },
  {
    id: 'R12', day: '2026-11-08', time: '19:00', fbTime: '19:30', where: ['Instagram', 'Facebook'], format: 'Reel 19 s', title: 'Diagnóstico gratuito: ¿qué tan independiente es su negocio?',
    files: ['videos/2026-11-08_1900_R12_reel-diagnostico.mp4', 'portadas-reels/R12_diagnostico.png'], filesVoz: ['videos/2026-11-08_1900_R12_reel-diagnostico_voz.mp4'],
    ig: `¿Qué tan independiente es su negocio de Booking, Airbnb o las apps de delivery?

Seis preguntas, un minuto. Recibe un puntaje y las tres mejoras que más le conviene hacer primero. Gratis y sin compromiso.

👉 redvaeru.netlify.app (sección Diagnóstico)
O escríbame al ${WA}

#Araucanía #cabañas #restaurantes #turismochile`,
    notes: 'Todo lo que aparece es el diagnóstico real del sitio de Red Vaeru.',
  },
];

export const KITS = [];

export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

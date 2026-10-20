// Semana 6 (23 al 29 de noviembre de 2026): «La temporada ya empezó».
// Objetivo: sin urgencia falsa. El 30 no cierra nada: enero y febrero son los meses fuertes
// y una web Carta QR o Esencial todavía llega. Se suma la mantención mensual y el caso real de Miah.
const WA = '+56 9 5228 9117';

export const SEMANA_INFO = { campana: 'La temporada ya empezó', rango: '23 al 29 de noviembre' };

const img = (dir, names) => names.map((n) => `${dir}/${n}`);

export const PIECES = [
  {
    id: 'R21', day: '2026-11-23', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 28 s', title: 'Enero sin web: haga la cuenta',
    files: ['videos/2026-11-23_1230_R21_reel-enero-sin-web_edit.mp4', 'portadas-reels/R21_enero-sin-web.png'],
    ig: `Enero y febrero: los meses donde se gana el año. ¿Y cuánto se lleva la plataforma? 🧮

20 reservas al mes × $90.000 × 18% de comisión = $3.888.000 al año.
Si solo un 30% le reservara directo, recupera más de $1.100.000.

Haga su propia cuenta con la calculadora gratis en redvaeru.netlify.app
Y su web propia todavía alcanza para febrero. 👉 PORTADA al ${WA}

#cabañas #Booking #Airbnb #Araucanía #reservasdirectas`,
    notes: 'Las cifras son un ejemplo calculado con la calculadora real del sitio (20 reservas, $90.000, 18%). No son datos de un cliente.',
  },
  {
    id: 'S12', day: '2026-11-23', time: '20:30', where: ['Historias de Instagram'], format: '3 historias', title: 'La temporada ya empezó',
    files: img('2026-11-23_2030_S12_historias-temporada', ['1.png', '2.png', '3.png']),
    ig: '', notes: 'Historia 3: agregue el sticker de enlace a WhatsApp.',
  },
  {
    id: 'C12', day: '2026-11-24', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 6 láminas', title: '¿Y quién la mantiene al día?',
    files: img('2026-11-24_1930_C12_mantencion', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png']),
    ig: `Su web ya está publicada. ¿Y quién la mantiene al día? 🛠️

Dos opciones, mes a mes:
🌐 Cuidado, $25.000/mes: hosting, dominio, respaldo y un cambio al mes
📈 Crecimiento, $55.000/mes: cambios del mes, ficha de Google e informe de visitas y consultas

Sin permanencia: se pausa o termina con aviso de 30 días, y todo sigue a su nombre.
¿Prefiere hacerlo usted? Le dejo una guía.

👉 ${WA}

#cabañas #restaurantes #Araucanía #emprendedoresdelsur`,
  },
  {
    id: 'GOOGLE-7', day: '2026-11-24', time: '10:00', where: ['Ficha de Google'], format: 'Publicación', title: 'Ficha de Google: la temporada ya empezó',
    files: ['avisos/google-7_temporada-empezo.png'],
    ig: 'La temporada ya empezó, y enero y febrero son los meses fuertes. Una web Carta QR o Esencial se arma en 1 a 2 semanas, desde $49.000. Primero ve su portada; si no le convence, no paga.',
    noFb: true, notes: 'Solo si la ficha de Google ya está activa.',
  },
  {
    id: 'R22', day: '2026-11-25', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 22 s', title: 'Caso real: Cabañas Miah y Noah',
    files: ['videos/2026-11-25_1230_R22_reel-caso-miah_edit.mp4', 'portadas-reels/R22_caso-miah.png'],
    ig: `Nicol y Deiby tienen dos cabañas en Curacautín. Y una web que trabaja por ellos 🌲

✓ En 4 idiomas
✓ Fotos por espacio
✓ Guía de la zona
✓ Check-in en línea
✓ Botón para reservar directo

No es una plantilla: es su lugar, contado como ellos lo cuentan.
¿Quiere que el suyo se vea así? 👉 PORTADA al ${WA}

#Curacautín #cabañas #Araucanía #turismochile`,
    notes: 'Todo lo que aparece es la web y las fotos reales de Cabañas Miah y Noah. Si puede, etiquete su cuenta (con su permiso).',
  },
  {
    id: 'C13', day: '2026-11-26', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 7 láminas', title: 'La checklist de enero',
    files: img('2026-11-26_1930_C13_checklist-enero', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png']),
    ig: `La checklist de enero: 5 cosas para que la temporada trabaje sola ✅

1. Tarifas de enero y febrero, publicadas y claras
2. Respuestas rápidas en WhatsApp Business
3. Fotos de verano, con sol y con verde
4. Ficha de Google al día, con horario de verano
5. Abono y cancelación por escrito

Guárdela. ¿Y su web? Todavía llega para enero.
👉 PORTADA al ${WA}

#temporadadeverano #cabañas #hostales #Araucanía`,
  },
  {
    id: 'R23', day: '2026-11-27', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 21 s', title: 'Un día de verano en el sur',
    files: ['videos/2026-11-27_1230_R23_reel-un-dia-de-verano_edit.mp4', 'portadas-reels/R23_un-dia-de-verano.png'],
    ig: `Un día de verano en el sur ☀️

7:00, el lago es un espejo. Mediodía, un volcán. La tarde, en las termas. La once, con kuchen. Y la noche, bajo las estrellas.

Cinco experiencias, cinco webs distintas. Son muestras de concepto, pero su negocio es real. ¿Cuál es el suyo?
👉 PORTADA al ${WA}

#Araucanía #Pucón #turismochile #verano`,
    notes: 'Las cinco webs son muestras de concepto (negocios ficticios): así se indica en pantalla.',
  },
  {
    id: 'S13', day: '2026-11-27', time: '20:30', where: ['Historias de Instagram'], format: '2 historias', title: 'Cupos y faltan 3 días',
    files: img('2026-11-27_2030_S13_historias-cupos', ['1_quedan-5-de-5.png', '1_quedan-4-de-5.png', '1_quedan-3-de-5.png', '1_quedan-2-de-5.png', '1_quedan-1-de-5.png', '2_faltan-3-dias.png']),
    ig: '', notes: 'Publique SOLO la imagen con el número real de cupos, más la historia 2. Si ya no quedan cupos, publique solo la historia 2.',
  },
  {
    id: 'GRUPOS-H', day: '2026-11-27', time: '10:00', where: ['Grupos de Facebook'], format: 'Publicación', title: 'Grupos de turismo: la temporada ya empezó',
    files: ['avisos/grupos-fb_temporada.png'],
    ig: `Para cabañas, hostales y restaurantes de la Araucanía 🌲

La temporada ya empezó. Si todavía no tiene web propia, llega para enero y febrero:
• Carta QR y Esencial desde $49.000, en 1 a 2 semanas
• Mantención desde $25.000/mes, sin permanencia

Primero ve su portada; si no le convence, no paga. 👉 ${WA}`,
    notes: 'Respete las reglas de cada grupo: solo donde se permite publicidad.',
  },
  {
    id: 'P11', day: '2026-11-28', time: '11:30', fbTime: '12:00', where: ['Instagram', 'Facebook'], format: 'Post', title: 'Caso real: Miah y Noah',
    files: ['2026-11-28_1130_P11_caso-real-miah/01.png'], filesB: ['2026-11-28_1130_P11_caso-real-miah/01-B.png'],
    ig: `No es una plantilla: es su lugar 🏡

Cabañas Miah y Noah, en Curacautín: dos cabañas, 4 idiomas, guía de la zona, check-in en línea y reserva directa.

¿Quiere la suya? 👉 PORTADA al ${WA}

#Curacautín #cabañas #Araucanía`,
    notes: 'Fotos y web reales de Cabañas Miah y Noah.',
  },
  {
    id: 'R24', day: '2026-11-29', time: '19:00', fbTime: '19:30', where: ['Instagram', 'Facebook'], format: 'Reel 21 s', title: 'Mañana es 30. Todavía llega.',
    files: ['videos/2026-11-29_1900_R24_reel-manana-es-30_edit.mp4', 'portadas-reels/R24_manana-es-30.png'],
    ig: `Mañana es 30 de noviembre. Y si todavía no tiene su web, tranquilo: la temporada recién empieza 🌞

Enero y febrero son los meses que más reservas traen. Una web Esencial se arma en 1 a 2 semanas: todavía llega para lo mejor del verano.

Primero ve su portada. Si no le convence, no paga.
👉 PORTADA al ${WA}

#Araucanía #cabañas #restaurantes #turismochile`,
  },
];

export const KITS = [];

export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

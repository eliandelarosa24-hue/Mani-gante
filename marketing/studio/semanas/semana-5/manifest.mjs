// Semana 5 (16 al 22 de noviembre de 2026): «Recta final: lo que todavía alcanza».
// Objetivo: el 16 es el último día para partir Carta QR o Esencial con entrega antes del 30.
// Después, el mensaje honesto: lo que se parte esta semana llega para enero y febrero.
const WA = '+56 9 5228 9117';

export const SEMANA_INFO = { campana: 'Recta final: lo que todavía alcanza', rango: '16 al 22 de noviembre' };

const img = (dir, names) => names.map((n) => `${dir}/${n}`);

export const PIECES = [
  {
    id: 'R17', day: '2026-11-16', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 28 s', title: 'Hoy es el último día',
    files: ['videos/2026-11-16_1230_R17_reel-ultimo-dia_edit.mp4', 'portadas-reels/R17_ultimo-dia.png'],
    ig: `Hoy es el último día para partir una web Carta QR o Esencial y tenerla lista antes del 30 de noviembre 📅

Se arma en 1 a 2 semanas, con sus fotos, su nombre y sus colores. Y primero ve su portada: si no le convence, no paga.

👉 Escríbame PORTADA al ${WA}

#Araucanía #cabañas #restaurantes #turismochile`,
    notes: 'Las fotos que aparecen son de la web real de Cabañas Miah y Noah.',
  },
  {
    id: 'S10', day: '2026-11-16', time: '20:30', where: ['Historias de Instagram'], format: '3 historias', title: 'Último día: lo que alcanza',
    files: img('2026-11-16_2030_S10_historias-ultimo-dia', ['1.png', '2.png', '3.png']),
    ig: '', notes: 'Historia 3: agregue el sticker de enlace a WhatsApp. A quien reaccione, escríbale por privado: «¿Partimos hoy?».',
  },
  {
    id: 'GOOGLE-6', day: '2026-11-17', time: '10:00', where: ['Ficha de Google'], format: 'Publicación', title: 'Ficha de Google: recta final',
    files: ['avisos/google-6_recta-final.png'],
    ig: 'Carta QR y Esencial se arman en 1 a 2 semanas: lo que parte esta semana llega para la temporada. Desde $49.000. Primero ve su portada; si no le convence, no paga.',
    noFb: true, notes: 'Solo si la ficha de Google ya está activa.',
  },
  {
    id: 'C10', day: '2026-11-17', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 7 láminas', title: 'Lo que alcanza en 2 semanas',
    files: img('2026-11-17_1930_C10_lo-que-alcanza', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png']), filesB: img('2026-11-17_1930_C10_lo-que-alcanza', ['01-B.png']),
    ig: `¿Todavía alcanza para el verano? Sí. Así se ven 2 semanas, día por día 👇

Día 1: conversamos (un audio de WhatsApp basta)
Días 2 y 3: su portada, con sus fotos y sus colores
Día 4: usted decide. Si no le convence, no paga
Semana 2: textos, fotos por espacio, WhatsApp, mapa y precios
Día 14: al aire, a su nombre

Desde $49.000. 👉 PORTADA al ${WA}

#temporadadeverano #cabañas #Araucanía #emprendedoresdelsur`,
  },
  {
    id: 'R18', day: '2026-11-18', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 23 s', title: 'Carta QR: su carta, sin imprimir nunca más',
    files: ['videos/2026-11-18_1230_R18_reel-carta-qr-fogon_edit.mp4', 'portadas-reels/R18_carta-qr-fogon.png'],
    ig: `Su carta, sin imprimir nunca más 🍽️

Una carta que se abre con un QR en la mesa: platos con foto, la historia de su cocina y precios que usted cambia desde el celular. Y un botón de WhatsApp para pedidos para llevar.

Carta QR desde $49.000.
👉 Escríbame CARTA al ${WA}

#restaurantes #Pucón #Villarrica #Araucanía #cartaQR`,
    notes: 'El CTA de este reel es CARTA (no PORTADA): regístrelo así en la planilla. Fogón Mapu es una muestra de concepto (negocio ficticio): así se indica en pantalla.',
  },
  {
    id: 'C11', day: '2026-11-19', time: '19:30', fbTime: '20:00', where: ['Instagram', 'Facebook'], format: 'Carrusel 6 láminas', title: 'Las preguntas sobre plazos',
    files: img('2026-11-19_1930_C11_preguntas-plazos', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png']),
    ig: `Las preguntas que más me llegan esta semana, con respuesta corta 💬

¿Alcanzo para el verano? Carta QR y Esencial: 1 a 2 semanas. Enero y febrero son lo más fuerte.
¿Y si no tengo buenas fotos? Las de su celular sirven.
¿Cuánto demoran en responderme? Menos de 24 horas en días hábiles.
¿Qué pasa después del 30? Nada se acaba: su web sigue trabajando todo el verano.

¿Otra duda? 👉 ${WA}

#cabañas #hostales #Araucanía #turismochile`,
  },
  {
    id: 'R19', day: '2026-11-20', time: '12:30', fbTime: '13:00', where: ['Instagram', 'Facebook'], format: 'Reel 26 s', title: 'Son las 23:00',
    files: ['videos/2026-11-20_1230_R19_reel-23-horas_edit.mp4', 'portadas-reels/R19_23-horas.png'],
    ig: `Son las 23:00. Alguien en Santiago está buscando dónde pasar enero 🌙

Encuentra una cabaña en Curacautín, mira las fotos por espacio, revisa la guía de la zona y escribe directo por WhatsApp. Eso pasa en la web real de Cabañas Miah y Noah.

Su web trabaja mientras usted duerme.

👉 Escríbame PORTADA al ${WA}

#Curacautín #cabañas #Araucanía #turismochile`,
    notes: 'Las imágenes son de la web real de Cabañas Miah y Noah.',
  },
  {
    id: 'S11', day: '2026-11-20', time: '20:30', where: ['Historias de Instagram'], format: '2 historias', title: 'Cupos y faltan 10 días',
    files: img('2026-11-20_2030_S11_historias-cupos', ['1_quedan-5-de-5.png', '1_quedan-4-de-5.png', '1_quedan-3-de-5.png', '1_quedan-2-de-5.png', '1_quedan-1-de-5.png', '2_faltan-10-dias.png']),
    ig: '', notes: 'Publique SOLO la imagen con el número real de cupos, más la historia 2. Si ya no quedan cupos, publique solo la historia 2.',
  },
  {
    id: 'GRUPOS-G', day: '2026-11-20', time: '10:00', where: ['Grupos de Facebook'], format: 'Publicación', title: 'Grupos de turismo: todavía alcanza',
    files: ['avisos/grupos-fb_recta-final.png'],
    ig: `Para cabañas, hostales y restaurantes de la Araucanía 🌲

Si todavía no tiene web propia, alcanza para la temporada: Carta QR y Esencial se arman en 1 a 2 semanas, desde $49.000.
Primero ve su portada; si no le convence, no paga.

👉 ${WA}`,
    notes: 'Respete las reglas de cada grupo: solo donde se permite publicidad.',
  },
  {
    id: 'P10', day: '2026-11-21', time: '11:30', fbTime: '12:00', where: ['Instagram', 'Facebook'], format: 'Post', title: 'Su web trabaja mientras usted duerme',
    files: ['2026-11-21_1130_P10_trabaja-mientras-duerme/01.png'], filesB: ['2026-11-21_1130_P10_trabaja-mientras-duerme/01-B.png'],
    ig: `Su web trabaja mientras usted duerme 😴

A las 23:00 alguien busca dónde pasar enero. Su web le muestra todo y le deja escribirle directo. Usted responde con el café de la mañana.

👉 PORTADA al ${WA}

#cabañas #Araucanía #reservasdirectas`,
    notes: 'La notificación de WhatsApp es un ejemplo ilustrativo: así lo dice la imagen.',
  },
  {
    id: 'R20', day: '2026-11-22', time: '19:00', fbTime: '19:30', where: ['Instagram', 'Facebook'], format: 'Reel 25 s', title: 'Detrás de una portada',
    files: ['videos/2026-11-22_1900_R20_reel-detras-de-una-portada_edit.mp4', 'portadas-reels/R20_detras-de-una-portada.png'],
    ig: `¿Qué pasa cuando me escribe PORTADA? 👀

1. Conozco su lugar: sus fotos, su historia, lo que lo hace distinto
2. Diseño su portada, con su nombre y sus colores
3. Se la muestro y usted decide. Si no le convence, no paga nada

Termas, cabañas, viñas, cafés: cada web distinta, como su lugar. 👉 ${WA}

#Araucanía #cabañas #restaurantes #turismochile`,
  },
];

export const KITS = [];

export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

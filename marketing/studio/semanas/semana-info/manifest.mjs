// Serie educativa (Reels con edición humana): turismo en cifras, tributario, tips y noticias.
// Se publican a las 18:00, en días que no chocan con la agenda semanal. Fuentes en docs/marketing/06 y 07.
const WA = '+56 9 5228 9117';

export const SEMANA_INFO = { campana: 'Datos para su negocio', rango: 'serie educativa · 22 de octubre al 17 de noviembre', titulo: 'Serie educativa Red Vaeru' };

const NOTA = 'Reel educativo con la fuente en pantalla. Antes de publicar, abra el enlace de cada dato en docs/marketing/06 y 07.';

export const PIECES = [
  {
    id: 'A02', day: '2026-10-22', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 27 s', title: '¿Cuánto le cobra realmente la plataforma?',
    files: ['videos/A02_comision-plataformas_edit.mp4', 'portadas-reels/A02E_A02_edit.png'],
    ig: `¿Cuánto le cobra realmente la plataforma? 🤨

• Booking.com: entre 10% y 25%, según su contrato
• Airbnb: 3% con tarifa dividida, o cerca de 15% si la paga solo usted

Ejemplo: $3.000.000 en ventas al 15% = $450.000 en comisiones.
Fuente: Booking.com Partner Hub y Airbnb.

Las plataformas traen huéspedes. Su web hace que vuelvan directo. 👉 PORTADA al ${WA}

#cabañas #Booking #Airbnb #turismochile #Araucanía`,
    notes: NOTA,
  },
  {
    id: 'E04', day: '2026-10-24', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 29 s', title: 'El verano se decide antes de diciembre',
    files: ['videos/E04_verano-araucania.mp4', 'portadas-reels/E04_E04.png'],
    ig: `En la Araucanía, el verano se decide antes de diciembre 📊

Enero 2026: 143.871 pernoctaciones en la región.
Agosto 2026: 62.660, con 25,3% de ocupación.
Enero cayó 19,9% frente a enero 2025.
Fuente: INE, Encuesta Mensual de Alojamiento Turístico.

Más competencia por cada huésped: gana el que se ve y el que es fácil de reservar. 👉 PORTADA al ${WA}

#Araucanía #turismo #Pucón #Villarrica #cabañas`,
    notes: NOTA,
  },
  {
    id: 'E06', day: '2026-10-27', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 26 s', title: 'Cómo pedir reseñas sin incomodar',
    files: ['videos/E06_resenas-sin-incomodar.mp4', 'portadas-reels/E06_E06.png'],
    ig: `¿Cómo pedir una reseña sin incomodar al huésped? ⭐ 3 trucos:

1. Pídala al despedirse, con la experiencia fresca
2. Hágalo fácil: enlace o QR directo a su ficha de Google
3. Responda todas, también las malas: quien lee la respuesta es su próximo huésped

Guárdelo 📌 ¿Quiere su QR de reseñas? 👉 PORTADA al ${WA}

#reseñas #GoogleMaps #cabañas #restaurantes #turismochile`,
    notes: NOTA,
  },
  {
    id: 'E05', day: '2026-10-29', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 28 s', title: 'Llegan menos turistas, pero los de lejos crecen',
    files: ['videos/E05_turistas-larga-distancia.mp4', 'portadas-reels/E05_E05.png'],
    ig: `Llegan menos turistas extranjeros a Chile… pero hay un grupo que no para de crecer 📈

1er semestre 2026: 2.553.723 llegadas (−19,4%).
Europa, Norteamérica, Asia y Oceanía: 529.018 (+13,9%), lo más alto desde 2013.
Fuente: Subsecretaría de Turismo, Pulso Turismo.

Ese viajero busca en internet, y en inglés. ¿Su web está en inglés? 👉 PORTADA al ${WA}

#turismochile #Araucanía #turismointernacional`,
    notes: NOTA,
  },
  {
    id: 'E08', day: '2026-10-31', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 25 s', title: 'Noticia: Navidad y Año Nuevo caen en viernes',
    files: ['videos/E08_noticia-fines-de-semana-largos.mp4', 'portadas-reels/E08_E08.png'],
    ig: `Ojo con diciembre 📅

Navidad (25-12) y Año Nuevo (01-01-2027) caen en viernes: dos fines de semana largos seguidos.
En Fiestas Patrias, la ocupación hotelera en La Araucanía superó el 65% (Hoteleros de Chile, cifra preliminar).

Los huéspedes reservan con tiempo: que lo encuentren hoy, no en diciembre. 👉 TEMPORADA al ${WA}

#Araucanía #turismo #findesemanalargo #cabañas #temporada`,
    notes: NOTA,
  },
  {
    id: 'E10', day: '2026-11-03', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 29 s', title: '4 reglas para que sus fotos vendan',
    files: ['videos/E10_fotos-que-venden.mp4', 'portadas-reels/E10_E10.png'],
    ig: `Antes de reservar, sus huéspedes miran las fotos 📸 4 reglas para que vendan:

1. Luz natural, de día y con cortinas abiertas
2. Ordenadas por espacio: dormitorio, cocina, baño, vista
3. Lo que lo hace distinto: la tinaja, el fogón, la vista al volcán
4. Actualícelas para el verano

Guárdelo 📌 👉 PORTADA al ${WA}

#cabañas #fotografía #turismochile #Araucanía`,
    notes: NOTA,
  },
  {
    id: 'E03', day: '2026-11-05', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 27 s', title: 'IVA y turistas extranjeros',
    files: ['videos/E03_iva-turista-extranjero.mp4', 'portadas-reels/E03_E03.png'],
    ig: `¿A un turista extranjero le cobra IVA? Depende 👀

Existe una exención para empresas hoteleras (DL 825, art. 12 E N°17), con condiciones:
1. Inscripción previa en la nómina del SII
2. Cobro en moneda extranjera
3. Factura de exportación
Ojo: los tours aparte sí pagan IVA.

Información general: confirme su caso con su contador.
Y para atraer a ese turista: su web en inglés. 👉 PORTADA al ${WA}

#SII #IVA #turismochile #pymes`,
    notes: NOTA,
  },
  {
    id: 'E09', day: '2026-11-07', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 24 s', title: 'Noticia: vuelo directo Temuco–Balmaceda',
    files: ['videos/E09_noticia-vuelo-temuco-balmaceda.mp4', 'portadas-reels/E09_E09.png'],
    ig: `Noticia para el sur ✈️

SKY anunció un vuelo directo Temuco–Balmaceda para el verano: del 1 de enero al 14 de marzo de 2027, desde $38.190 por tramo (fuente: SKY, vía Mediabanco y 24horas).

Más conexión entre la Araucanía y la Patagonia en plena temporada = más viajeros de paso buscando dónde dormir, comer y qué hacer.
¿Lo van a encontrar a usted? 👉 PORTADA al ${WA}

#Temuco #Patagonia #Aysén #turismo #Araucanía`,
    notes: NOTA + ' Verifique la frecuencia del vuelo en sky.cl antes de publicar.',
  },
  {
    id: 'E01', day: '2026-11-10', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 24 s', title: 'El F29 tiene tres fechas',
    files: ['videos/E01_f29-tres-fechas.mp4', 'portadas-reels/E01_E01.png'],
    ig: `¿Sabía que el F29 tiene tres fechas? 🗓️ (este jueves 12 vence el de octubre)

12 → plazo general
20 → si declara y paga por internet y es facturador electrónico
28 → si su declaración no tiene impuesto a pagar
Si cae en fin de semana o feriado, pasa al día hábil siguiente.

Fuente: SII. Información general: confirme su caso con su contador. 👉 ${WA}

#SII #F29 #pymes #emprendedoresdelsur`,
    notes: NOTA,
  },
  {
    id: 'E07', day: '2026-11-14', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 28 s', title: 'Fondos: cómo no perderse la próxima convocatoria',
    files: ['videos/E07_fondos-prepararse.mp4', 'portadas-reels/E07_E07.png'],
    ig: `El Kit Digital de Sercotec entregaba $1.200.000… y la postulación duró 10 días ⏱️

Para no perderse la próxima:
1. Haga hoy los cursos de Ruta Digital (rutadigital.cl): son requisito
2. Inscríbase en el Registro de Sernatur
3. Tenga su carpeta tributaria al día

Fuente: Sercotec, Kit Digital 2026. ¿Armamos su plan digital? 👉 PORTADA al ${WA}

#Sercotec #pymes #turismochile #digitalización`,
    notes: NOTA,
  },
  {
    id: 'E02', day: '2026-11-17', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel 22 s', title: 'Mes sin ventas no es mes sin F29',
    files: ['videos/E02_f29-sin-movimiento.mp4', 'portadas-reels/E02_E02.png'],
    ig: `Temporada baja, cero ventas… ¿igual tiene que declarar? Sí ✅

Con inicio de actividades vigente, el F29 sin movimiento es obligatorio. Por internet tiene plazo hasta el día 28. Si no lo presenta, arriesga una multa.
Fuente: SII. Confirme su caso con su contador.

Aproveche la temporada baja para dejar lista su web de verano. 👉 PORTADA al ${WA}

#SII #F29 #pymes #emprendedoresdelsur`,
    notes: NOTA,
  },
];

export const KITS = [];

export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

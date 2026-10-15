// Serie informativa (videos animados): datos útiles para el negocio turístico que llevan a los servicios.
// Se publican como Reels extra, a las 18:00, en días que no chocan con la agenda semanal.
const WA = '+56 9 5228 9117';

export const SEMANA_INFO = { campana: 'Datos para su negocio', rango: 'serie informativa · octubre y noviembre', titulo: 'Serie informativa Red Vaeru' };

const NOTA = 'Video animado con datos de fuentes oficiales (fuente en pantalla). Antes de publicar, abra el enlace de cada dato en docs/marketing/06-datos-videos-informativos.md.';

export const PIECES = [
  {
    id: 'A02', day: '2026-10-22', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel animado 31 s', title: '¿Cuánto se queda la plataforma de cada reserva?',
    files: ['videos/A02_comision-plataformas.mp4', 'portadas-reels/A02_comisiones.png'],
    ig: `¿Cuánto se queda la plataforma de cada reserva? 👇

• Booking.com: entre 10% y 25%, según su contrato
• Airbnb: 3% con tarifa dividida, o cerca de 15% si la paga solo usted

Ejemplo: con $3.000.000 en ventas al 15%, $450.000 se van en comisiones.

Las plataformas traen huéspedes. Su web hace que vuelvan directo.
👉 PORTADA al ${WA}

#cabañas #Booking #Airbnb #turismochile #Araucanía`,
    notes: NOTA,
  },
  {
    id: 'A03', day: '2026-10-24', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel animado 27 s', title: 'El verano se decide antes de diciembre',
    files: ['videos/A03_verano-araucania.mp4', 'portadas-reels/A03_verano.png'],
    ig: `En la Araucanía, el verano se decide antes de diciembre 📊

Enero 2026: 143.871 pernoctaciones en la región.
Agosto 2026: 62.660, con 25,3% de ocupación.
Y enero bajó 19,9% frente al año anterior: hay más competencia por cada huésped.

Fuente: INE, Encuesta Mensual de Alojamiento Turístico.

Lo que no está listo en noviembre, se pierde en enero. 👉 TEMPORADA al ${WA}

#Araucanía #turismo #Pucón #Villarrica #cabañas`,
    notes: NOTA,
  },
  {
    id: 'A04', day: '2026-10-29', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel animado 31 s', title: 'Llegan menos turistas, pero los de lejos van en aumento',
    files: ['videos/A04_turistas-de-lejos.mp4', 'portadas-reels/A04_larga-distancia.png'],
    ig: `Llegan menos turistas extranjeros a Chile… pero los de lejos van en aumento ✈️

1er semestre 2026: 2.553.723 llegadas (−19,4%).
Europa, Norteamérica, Asia y Oceanía: 529.018 (+13,9%), lo más alto desde 2013.

Fuente: Subsecretaría de Turismo, Pulso Turismo.

Ese viajero lo busca en internet, y en inglés. ¿Su negocio aparece?
👉 PORTADA al ${WA}

#turismochile #Araucanía #turismointernacional #cabañas`,
    notes: NOTA,
  },
  {
    id: 'A01', day: '2026-11-10', time: '18:00', fbTime: '18:30', where: ['Instagram', 'Facebook', 'TikTok'], format: 'Reel animado 31 s', title: 'El F29 tiene tres fechas',
    files: ['videos/A01_f29-tres-fechas.mp4', 'portadas-reels/A01_f29.png'],
    ig: `¿Sabía que el F29 tiene tres fechas? 🗓️ (este jueves 12 vence el de octubre)

12 → plazo general
20 → si declara y paga por internet y es facturador electrónico
28 → si su declaración no tiene impuesto que pagar

Si cae en fin de semana o feriado, pasa al día hábil siguiente.
Fuente: SII. Información general: confirme su caso con su contador.

Usted ordena sus números; yo ordeno su vitrina digital. 👉 PORTADA al ${WA}

#pymes #SII #F29 #emprendedoresdelsur #turismochile`,
    notes: `${NOTA} Publíquelo antes del 12: ese día vence el plazo general.`,
  },
];

export const KITS = [];

export const fbText = (p) => p.fb || [p.ig.replace(/\n*#[^\n]*$/u, '').trim(), p.fbExtra].filter(Boolean).join('\n\n');

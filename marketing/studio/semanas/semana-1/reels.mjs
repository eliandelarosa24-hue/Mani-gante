// Semana 1: Reels (escenas, textos por escena y cierre). Los usa build-videos.mjs.
import { BRAND as B } from '../../lib.mjs';

export const REELS = {
  P02: {
    file: '2026-10-16_1230_P02_reel-miah-y-noah', layout: 'phone',
    screen: [{ clip: 'miah.mp4' }],
    captions: [[0, 2.2, 'Esta cabaña de Curacautín <em>ya no depende solo de Booking</em>'], [2.2, 6, 'Huéspedes que <em>reservan directo</em> por WhatsApp'], [6, 10, 'Sus dos cabañas, <em>con todo el detalle</em>'], [10, 15, 'Galería, ubicación y <em>check&#8209;in en línea</em>']],
    hookB: 'Así se ve la web de <em>una cabaña de Curacautín</em> 👇',
    outro: { eyebrow: 'Caso real · Cabañas Miah y Noah', title: '¿Quiere una <em>así?</em>', word: 'PORTADA' },
  },
  P04: {
    file: '2026-10-17_1130_P04_reel-showreel-muestras', layout: 'frame', tag: 'Muestras de concepto',
    screen: [{ src: 'public/video/reel.mp4' }],
    captions: [[0, 3, '10 ideas de web para <em>el turismo del sur</em>'], [3, 26, '¿Cuál se parece a <em>su negocio?</em> 👇']],
    outro: { eyebrow: 'Comente el número', title: 'Le cuento cómo sería <em>la suya</em>', word: 'PORTADA' },
  },
  P06: {
    file: '2026-10-18_1930_P06_reel-rincon-de-los-poetas', layout: 'phone',
    screen: [{ clip: 'poetas.mp4' }],
    captions: [[0, 3, 'Un hostal con historia <em>en Almagro, Nueva Imperial</em>'], [3, 8, 'Su historia, <em>contada en su propia web</em>'], [8, 15, 'Y un canal directo <em>para reservar</em>']],
    outro: { eyebrow: 'Caso real · El Rincón de los Poetas', title: 'Cada lugar tiene una historia <em>que vende</em>', word: 'PORTADA' },
  },
  R01: {
    file: '2026-10-19_1230_R01_reel-calculadora', layout: 'phone',
    screen: [{ clip: 'calculadora.mp4' }],
    captions: [[0, 1.5, '¿Cuánto le dejó a la plataforma <em>este año?</em>'], [1.5, 7.5, 'Ejemplo: 10 reservas al mes, <em>$90.000, 15%</em>'], [7.5, 11, '$1.620.000 al año <em>en comisiones</em>'], [11, 14, 'Haga la cuenta <em>con sus números</em>']],
    hookB: 'Este número <em>le va a doler</em> (o no)',
    outro: { eyebrow: 'Calculadora gratis', title: 'Calcule la suya o <em>hagámosla juntos</em>', word: 'PORTADA', line: B.site },
  },
  R02: {
    file: '2026-10-21_1230_R02_reel-carta-qr', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'fogon-mapu.mp4', dur: 10 }, { still: 'qr-mesa', dur: 3.4, zoom: [1, 1.05] }],
    captions: [[0, 3, 'Su carta, <em>como una experiencia</em>'], [3, 10, 'Sus platos, su historia <em>y su WhatsApp</em>'], [10, 13.4, 'Un QR por mesa. <em>Usted cambia los precios.</em>']],
    hookB: '¿Todavía imprime la carta <em>cada vez que sube un precio?</em>',
    outro: { eyebrow: 'Restaurantes y cafés', title: `Carta QR <em>${B.carta}</em>`, word: 'CARTA' },
  },
  R03: {
    file: '2026-10-23_1230_R03_reel-lo-que-no-le-da', layout: 'phone',
    screen: [{ clip: 'miah-funciones.mp4' }],
    captions: [[0, 3, 'Lo que un aviso en una plataforma <em>no le da</em>'], [3, 6.5, 'Reservas por <em>WhatsApp directo</em>'], [6.5, 10, 'Su propia <em>guía de la zona</em>'], [10, 13.5, 'Check&#8209;in <em>en línea</em>'], [13.5, 17, 'Sus reseñas, <em>en su propia casa</em>']],
    outro: { eyebrow: 'Caso real · Curacautín', title: '¿Hacemos <em>la suya?</em>', word: 'PORTADA' },
  },
  R04: {
    file: '2026-10-25_1900_R04_reel-glamping', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'domos-cielo-austral.mp4' }],
    captions: [[0, 3, 'Si su glamping tuviera <em>su propia web…</em>'], [3, 8, 'El cielo como <em>protagonista</em>'], [8, 12, 'Sus domos, <em>reservados directo</em>']],
    outro: { eyebrow: 'Glamping, domos y lodges', title: 'Diseño a medida <em>para su lugar</em>', word: 'PORTADA' },
  },
};

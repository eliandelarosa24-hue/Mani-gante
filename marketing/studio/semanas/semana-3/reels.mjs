// Semana 3: Reels. R09 y R12 usan el sitio real de Red Vaeru; R10 y R11 son muestras de concepto rotuladas.
import { BRAND as B } from '../../lib.mjs';

export const REELS = {
  R09: {
    file: '2026-11-02_1230_R09_reel-calculadora-restaurante', layout: 'phone',
    screen: [{ clip: 'calculadora-restaurante.mp4' }],
    captions: [[0, 3, '¿Cuánto le paga <em>a las apps de delivery?</em>'], [3, 8, 'Ejemplo: 120 pedidos, <em>$15.000, 25%</em>'], [8, 14, '<em>$5.400.000</em> al año en comisiones']],
    outro: { eyebrow: 'Restaurantes y cafés', title: `Carta propia, <em>sin comisión</em>`, word: 'CARTA' },
  },
  R10: {
    file: '2026-11-04_1230_R10_reel-cabanas-lago', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'cabanas-lago-azul.mp4' }],
    captions: [[0, 3, 'Su cabaña, <em>frente al lago</em>'], [3, 8, 'Cada cabaña, <em>con su nombre y sus fotos</em>'], [8, 14, 'Y la reserva, <em>directo por WhatsApp</em>']],
    outro: { eyebrow: 'Cabañas', title: 'Le muestro <em>la suya</em>', word: 'PORTADA' },
  },
  R11: {
    file: '2026-11-06_1230_R11_reel-tours', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'pucon-aventura.mp4' }],
    captions: [[0, 3, 'Un tour se vende <em>con la experiencia</em>'], [3, 8, 'Cada salida, <em>con su nivel y sus fotos</em>'], [8, 14, 'Y los guías <em>que la acompañan</em>']],
    outro: { eyebrow: 'Tours y experiencias', title: 'Le muestro <em>la suya</em>', word: 'PORTADA' },
  },
  R12: {
    file: '2026-11-08_1900_R12_reel-diagnostico', layout: 'phone',
    screen: [{ clip: 'redvaeru-diagnostico.mp4' }],
    captions: [[0, 3.5, '¿Qué tan independiente es <em>su negocio?</em>'], [3.5, 10, 'Seis preguntas, <em>un minuto</em>'], [10, 16, 'Su puntaje y <em>las 3 mejoras para partir</em>']],
    outro: { eyebrow: 'Diagnóstico gratuito', title: `Hágalo en <em>${B.site}</em>`, word: 'PORTADA' },
  },
};

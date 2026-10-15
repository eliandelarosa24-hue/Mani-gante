// Semana 2: Reels. R05 usa el sitio real de Red Vaeru; R06 a R08 son muestras de concepto rotuladas.
import { BRAND as B } from '../../lib.mjs';

export const REELS = {
  R05: {
    file: '2026-10-26_1230_R05_reel-metodo', layout: 'phone',
    screen: [{ clip: 'redvaeru-metodo.mp4' }],
    captions: [[0, 3, 'Cuatro pasos. <em>Cero sorpresas.</em>'], [3, 8, 'Conversamos y le envío <em>precio fijo por escrito</em>'], [8, 12.5, 'Diseño con <em>su revisión</em>'], [12.5, 16, 'Al aire, y usted <em>queda capacitado</em>']],
    outro: { eyebrow: 'Así trabajo', title: 'Primero ve <em>su portada</em>', word: 'PORTADA' },
  },
  R06: {
    file: '2026-10-28_1230_R06_reel-termas', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'termas-rayenko.mp4' }],
    captions: [[0, 3, 'Si sus termas tuvieran <em>su propia web…</em>'], [3, 8, 'Cada pozón, <em>con su temperatura</em>'], [8, 14, 'La experiencia completa, <em>antes de llegar</em>']],
    outro: { eyebrow: 'Termas, tinajas y spa', title: 'Le muestro <em>la suya</em>', word: 'PORTADA' },
  },
  R07: {
    file: '2026-10-30_1230_R07_reel-cafe', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'kuchen-haus-frutillar.mp4' }],
    captions: [[0, 3, 'Un café con historia <em>merece más</em>'], [3, 8, 'Sus kuchen, <em>su familia, su lago</em>'], [8, 14, 'Y encargos <em>por WhatsApp</em>']],
    outro: { eyebrow: 'Cafés y pastelerías', title: `Carta QR <em>${B.carta}</em>`, word: 'CARTA' },
  },
  R08: {
    file: '2026-11-01_1900_R08_reel-hotel-boutique', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'hotel-casa-nogal.mp4' }],
    captions: [[0, 3, 'Para hoteles boutique: <em>una web a su altura</em>'], [3, 8, 'Sus habitaciones, <em>contadas como un álbum</em>'], [8, 14, 'Diseño a medida: <em>plan Firma</em>']],
    outro: { eyebrow: 'Hoteles boutique', title: 'Una web <em>tan única como su lugar</em>', word: 'PORTADA' },
  },
};

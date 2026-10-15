// Semana 4: Reels. R13 y R16 usan sitios reales (Red Vaeru y El Rincón de los Poetas); R14 y R15 son muestras rotuladas.
import { BRAND as B } from '../../lib.mjs';

export const REELS = {
  R13: {
    file: '2026-11-09_1230_R13_reel-ultimos-cupos', layout: 'phone',
    screen: [{ clip: 'redvaeru-planes.mp4' }],
    captions: [[0, 3.5, 'Precios de lanzamiento: <em>los últimos cupos</em>'], [3.5, 9, `Sitios desde <em>${B.carta}</em>, normal desde ${B.esencialNormal}`], [9, 16, 'Cuando se completen, <em>rige el precio normal</em>']],
    outro: { eyebrow: `${B.cupos} cupos de lanzamiento`, title: 'Primero ve <em>su portada</em>', word: 'PORTADA' },
  },
  R14: {
    file: '2026-11-11_1230_R14_reel-vina', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'vina-los-robles.mp4' }],
    captions: [[0, 3, 'Una viña no vende botellas: <em>vende una tarde</em>'], [3, 8, 'La casona, la cava, <em>las catas</em>'], [8, 14, 'Y la reserva de visitas, <em>en su web</em>']],
    outro: { eyebrow: 'Viñas y enoturismo', title: 'Una web <em>tan única como su lugar</em>', word: 'PORTADA' },
  },
  R15: {
    file: '2026-11-13_1230_R15_reel-villa-caribe', layout: 'phone', tag: 'Muestra de concepto',
    screen: [{ clip: 'villa-coral-samana.mp4' }],
    captions: [[0, 3, 'Del sur de Chile <em>al Caribe</em>'], [3, 8, 'Cada villa, <em>con su historia</em>'], [8, 14, 'Y precios <em>en USD</em>']],
    outro: { eyebrow: 'Caribe y República Dominicana', title: 'También trabajo <em>en el Caribe</em>', word: 'PORTADA' },
  },
  R16: {
    file: '2026-11-15_1900_R16_reel-caso-poetas', layout: 'phone',
    screen: [{ clip: 'poetas.mp4' }],
    captions: [[0, 3, 'Caso real: <em>El Rincón de los Poetas</em>'], [3, 9, 'Su historia, sus espacios <em>y su canal directo</em>'], [9, 15, 'Faltan <em>15 días</em> para el 30 de noviembre']],
    outro: { eyebrow: 'Caso real · Nueva Imperial', title: '¿Y su lugar? <em>Todavía alcanza</em>', word: 'PORTADA' },
  },
};

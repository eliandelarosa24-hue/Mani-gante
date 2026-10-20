// Semana 6 (23 al 29 de noviembre): Reels con edición premium — la temporada ya empezó.
import { B, H, TYPE, TAG, NUM, EMO, HIT, WHOOSH, END, NOTE, MUESTRA } from '../kit-edicion.mjs';

const MIAH = (f) => `marketing/studio/out/broll/miah-${f}.jpg`;
const M = (slug, f) => `public/muestras/${slug}/img/${f}`;
const KB = (z0 = 1.05, z1 = 1.2, x1 = -20, y1 = 10) => [{ z: z0, x: 0, y: 0 }, { z: z1, x: x1, y: y1 }];
const REAL = 'Caso real · Cabañas Miah y Noah, Curacautín';

export const EDITS = {
  R21E: {
    file: '2026-11-23_1230_R21_reel-enero-sin-web_edit', slug: 'R21_edit', coverAt: 1.2, musicVol: 0.32,
    hi: ['enero', 'febrero', 'directo', 'gratis'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'cabanas-lago-azul', t: 6 } },
      H('cuánto', 'calculadora-sube', 5, '¿Cuánto se lleva<br><em>la plataforma?</em>', 110),
      B('Haga', 'calculadora-sube', { from: 0.2, speed: 1.0, trans: 'zoom', y: 1150, z: 1.3 }),
      { at: 'Veinte', clip: 'calculadora-sube', from: 5.0, speed: 0.02, trans: 'whip', cam: [
        { x: 760, y: 935, z: 1.75 }, { at: 'noventa', x: 760, y: 1232, z: 1.75 }, { at: 'dieciocho', x: 760, y: 1472, z: 1.75 },
        { at: 'Son', x: 400, y: 1892, z: 1.9 }, { at: 'treinta', x: 540, y: 2043, z: 1.55, dur: 0.5 },
      ] },
      B('calculadora', 'calculadora-sube', { from: 5.0, speed: 0.03, trans: 'zoom', y: 1300, z: 1.0 }),
      { at: 'propia', type: 'stack', bg: MIAH('exterior-sol'), trans: 'whip', label: REAL, cards: [{ src: MIAH('exterior-cielo'), y: 780 }, { src: MIAH('terraza'), y: 900 }, { src: MIAH('living'), y: 1020 }] },
      { at: 'Escríbame', type: 'cta', capY: 1700 },
    ],
    fx: [
      HIT('cuánto', { sfx: 'whoosh', shake: 8, vol: 0.45 }),
      { at: 'Veinte', draw: { kind: 'circle', x: 924, y: 935, rx: 95, ry: 62 }, sfx: 'scribble', vol: 0.8 },
      { at: 'noventa', draw: { kind: 'circle', x: 880, y: 1232, rx: 150, ry: 62 }, sfx: 'scribble', vol: 0.8 },
      TAG('dieciocho', '18 % 😬', { x: 800, y: 430, rot: 6, tone: 'gold' }),
      HIT('Son', { flash: 0.7, shake: 22, sfx: 'cash', vol: 0.8 }),
      { at: 'Son', dt: 0.35, draw: { kind: 'underline', x: 108, y: 1965, w: 560 }, speed: 0.45, sfx: 'scribble', vol: 0.7 },
      TAG('año#2', 'al AÑO 😱', { x: 770, y: 600, rot: 7, tone: 'gold', size: 64 }), EMO('año#2', '💸', { dt: 0.15 }),
      TAG('recupera', '+$1.166.400 si reservan directo 💬', { y: 560, rot: -3, tone: 'ink', size: 42 }),
      TAG('gratis', '🧮 gratis en redvaeru.netlify.app', { y: 1250, size: 40 }),
      TAG('febrero#2', 'Todavía alcanza ☀️', { y: 560, tone: 'gold' }),
      ...END('Escríbame'),
    ],
    cta: { title: 'Su web <em>para el verano</em>', checks: ['Reserva directa', 'Sin comisión', 'Garantía de portada'], button: 'Escríbame PORTADA 👇', note: NOTE },
  },
  R22E: {
    file: '2026-11-25_1230_R22_reel-caso-miah_edit', slug: 'R22_edit', coverAt: 1.2, musicVol: 0.3,
    hi: ['real', 'directo', 'plantilla'],
    shots: [
      { at: 0, type: 'photo', src: MIAH('exterior-cielo'), kb: KB(1.05, 1.22, 0, -15), label: REAL },
      B('trabaja', 'miah', { from: 0.3, speed: 0.5, trans: 'zoom', y: 1050, z: 1.03 }),
      { at: 'cuatro', clip: 'miah', from: 1.0, speed: 0.2, trans: 'zoom', cam: [{ x: 420, y: 240, z: 2.0 }] },
      { at: 'fotos', clip: 'miah-galeria', trans: 'whip', times: [['fotos', 1.0], ['guía', 2.6]], cam: [{ x: 540, y: 900, z: 1.15 }] },
      { at: 'guía', clip: 'miah-guia', trans: 'whip', times: [['guía', 3.5], ['check-in', 4.6]], cam: [{ x: 540, y: 900, z: 1.15 }] },
      B('check-in', 'miah-funciones', { from: 14.4, speed: 0.3, trans: 'zoom', y: 1100, z: 1.12 }),
      { at: 'botón', clip: 'miah-funciones', from: 3.0, to: 5.4, trans: 'whip', cam: [{ x: 540, y: 1500, z: 1.15 }, { at: 'directo', x: 541, y: 1660, z: 1.6 }] },
      H('No', 'miah', 1, 'No es<br><em>una plantilla</em>', 140),
      { at: 'Este', type: 'stack', bg: MIAH('exterior-sol'), trans: 'whip', label: REAL, cards: [{ src: MIAH('exterior'), y: 780 }, { src: MIAH('living'), y: 900 }, { src: MIAH('estufa'), y: 1020 }] },
      { at: 'Quiere', type: 'cta', capY: 1700 },
    ],
    fx: [
      TAG('Nicol', 'CASO REAL ✅', { y: 1250, tone: 'gold', size: 58 }), TAG('Curacautín', '📍 Curacautín', { y: 1380, rot: 5 }),
      WHOOSH('trabaja'), TAG('idiomas', '🇨🇱 🇧🇷 🇫🇷 🇬🇧', { y: 1250, size: 64 }),
      TAG('fotos', '📸 fotos por espacio', { y: 560, rot: 4 }), TAG('guía', '🗺️ guía de la zona', { y: 560, rot: -4 }),
      TAG('check-in', '✈️ check-in en línea', { y: 560, tone: 'gold' }),
      { at: 'directo', dt: 0.2, tap: { x: 541, y: 1660 }, sfx: 'tap', vol: 1 },
      HIT('No', { sfx: 'impact', shake: 14 }), TAG('real', 'Mi trabajo. Real. ✅', { y: 560, tone: 'gold', size: 56 }),
      ...END('Quiere'), { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Su lugar <em>así?</em>', checks: ['4 idiomas', 'Guía de la zona', 'Check-in en línea', 'Reserva directa'], button: 'Escríbame PORTADA 👇', note: NOTE },
  },
  R23E: {
    file: '2026-11-27_1230_R23_reel-un-dia-de-verano_edit', slug: 'R23_edit', coverAt: 1.2, musicVol: 0.36, label: MUESTRA,
    hi: ['verano', 'real', 'portada'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'cabanas-lago-azul', t: 6 } },
      { at: 'Siete', type: 'photo', src: M('cabanas-lago-azul', 'niebla.webp'), kb: KB(1.05, 1.22, -10, 0), trans: 'zoom' },
      { at: 'Mediodía', type: 'photo', src: M('pucon-aventura', 'tour-1.webp'), kb: KB(1.25, 1.05, 0, 20), trans: 'whip' },
      { at: 'tarde', type: 'photo', src: M('termas-rayenko', 'pozon-cascada.webp'), kb: KB(1.05, 1.25, 15, -10), trans: 'whip' },
      { at: 'once', type: 'photo', src: M('kuchen-haus-frutillar', 'k-murta.webp'), kb: KB(1.1, 1.3, 0, 0), trans: 'whip' },
      { at: 'noche', type: 'photo', src: M('domos-cielo-austral', 'unidad-1.webp'), kb: KB(1.25, 1.05, 0, -20), trans: 'zoom' },
      { at: 'Cinco', type: 'stack', bg: M('cabanas-lago-azul', 'hero.webp'), trans: 'whip', cards: [{ src: M('cabanas-lago-azul', 'hero.webp'), y: 720, w: 520, h: 440 }, { src: M('pucon-aventura', 'tour-1.webp'), y: 820, w: 520, h: 440 }, { src: M('termas-rayenko', 'pozon-noche.webp'), y: 920, w: 520, h: 440 }, { src: M('kuchen-haus-frutillar', 'vitrina.webp'), y: 1020, w: 520, h: 440 }, { src: M('domos-cielo-austral', 'unidad-2.webp'), y: 1120, w: 520, h: 440 }] },
      H('Son', 'cabanas-lago-azul', 1, 'Su negocio<br><em>es real</em>', 140),
      { at: 'Cuál', type: 'cta', capY: 1700 },
    ],
    fx: [
      TAG('Siete', '07:00 🌅', { y: 560, tone: 'gold', size: 64 }), TAG('Mediodía', '12:00 🌋', { y: 560, tone: 'gold', size: 64 }),
      TAG('tarde', '17:00 ♨️', { y: 560, tone: 'gold', size: 64 }), TAG('once', '19:00 🥧', { y: 560, tone: 'gold', size: 64 }),
      TAG('noche', '23:00 ✨', { y: 560, tone: 'gold', size: 64 }),
      HIT('Siete', { flash: 0.25, shake: 4, sfx: 'whoosh', vol: 0.3 }), HIT('Mediodía', { flash: 0.25, shake: 4, sfx: 'whoosh', vol: 0.3 }),
      HIT('tarde', { flash: 0.25, shake: 4, sfx: 'whoosh', vol: 0.3 }), HIT('once', { flash: 0.25, shake: 4, sfx: 'whoosh', vol: 0.3 }),
      HIT('noche', { flash: 0.25, shake: 4, sfx: 'whoosh', vol: 0.3 }), HIT('Son', { sfx: 'ding', shake: 6, vol: 0.5 }),
      ...END('Cuál'), { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Cuál es <em>el suyo?</em>', checks: ['Cabañas', 'Tours', 'Termas', 'Cafés', 'Glamping'], button: 'Escríbame PORTADA 👇', note: NOTE },
  },
  R24E: {
    file: '2026-11-29_1900_R24_reel-manana-es-30_edit', slug: 'R24_edit', coverAt: 1.2, musicVol: 0.3,
    hi: ['temporada', 'enero', 'febrero', 'portada'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'miah', t: 1 } },
      { at: 'Enero', type: 'photo', src: MIAH('terraza'), kb: KB(1.05, 1.22, 0, 10), trans: 'zoom', label: REAL },
      B('Una', 'redvaeru-planes', { from: 3.0, speed: 0.25, trans: 'whip', y: 1500, z: 1.15 }),
      B('como', 'miah', { from: 0.3, speed: 0.5, trans: 'zoom', y: 1050, z: 1.03 }),
      H('Si#2', 'miah', 1, 'Si no le convence,<br><em>no paga.</em>', 120),
      { at: 'Escríbame', type: 'cta', capY: 1700 },
    ],
    fx: [
      TAG('treinta', '📅 30 NOV', { y: 1450, tone: 'gold', size: 64 }), TAG('preocupe', 'tranquilo 😉', { y: 1580, rot: 4 }),
      TAG('reservas', '☀️ enero + febrero', { y: 560, tone: 'gold' }), TAG('semanas', '⚡ 1 a 2 semanas', { y: 1250 }),
      TAG('verano', 'Todavía llega ✅', { y: 560, rot: -4 }), HIT('Si#2', { sfx: 'ding', vol: 0.5, shake: 8 }),
      ...END('Escríbame'),
    ],
    cta: { title: 'Todavía <em>llega</em>', checks: ['1 a 2 semanas', 'Desde $49.000', 'Garantía de portada'], button: 'Escríbame PORTADA 👇', note: NOTE },
  },
};

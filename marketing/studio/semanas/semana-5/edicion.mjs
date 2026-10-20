// Semana 5 (16 al 22 de noviembre): Reels con edición premium — tipografía cinética, B-roll real de
// Cabañas Miah y Noah (fotos de su galería), tarjetas en cascada y montajes de muestras rotuladas.
import { B, H, TYPE, TAG, NUM, EMO, HIT, WHOOSH, END, NOTE, MUESTRA } from '../kit-edicion.mjs';

const MIAH = (f) => `marketing/studio/out/broll/miah-${f}.jpg`;
const M = (slug, f) => `public/muestras/${slug}/img/${f}`;
const KB = (z0 = 1.05, z1 = 1.2, x1 = -20, y1 = 10) => [{ z: z0, x: 0, y: 0 }, { z: z1, x: x1, y: y1 }];
const REAL = 'Caso real · Cabañas Miah y Noah, Curacautín';

export const EDITS = {
  R17E: {
    file: '2026-11-16_1230_R17_reel-ultimo-dia_edit', slug: 'R17_edit', coverAt: 1.4, musicVol: 0.32,
    hi: ['ultimo', 'portada', 'whatsapp', 'paga'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'miah', t: 1 } },
      { at: 'Si', type: 'stack', bg: MIAH('exterior-cielo'), trans: 'whip', label: REAL, cards: [{ src: MIAH('exterior'), cap: 'su lugar', y: 780 }, { src: MIAH('terraza'), cap: 'sus fotos', y: 900 }, { src: MIAH('living'), cap: 'su historia', y: 1020 }] },
      B('Mire', 'miah', { from: 0.3, speed: 0.5, trans: 'zoom', y: 1050, z: 1.03 }),
      { at: 'botón', clip: 'miah-funciones', from: 3.0, to: 5.4, trans: 'whip', cam: [{ x: 540, y: 1500, z: 1.15 }, { at: 'WhatsApp', x: 541, y: 1660, z: 1.6 }] },
      { at: 'ubicación', clip: 'miah-guia', trans: 'whip', times: [['ubicación', 3.5], ['precios', 4.4], ['end', 6.0]], cam: [{ x: 540, y: 900, z: 1.15 }] },
      H('mejor', 'miah', 1, 'Primero ve<br><em>su portada</em> 👀', 120),
      B('Desde', 'redvaeru-planes', { from: 3.0, speed: 0.25, trans: 'zoom', y: 1500, z: 1.15 }),
      { at: 'Partimos', type: 'cta', capY: 1700 },
    ],
    fx: [
      TAG('dieciséis', '📅 16 NOV', { y: 1250, tone: 'gold', size: 64 }), HIT('último', { shake: 20, vol: 0.55 }),
      TAG('Carta', '🍽️ Carta QR', { y: 560, rot: -4 }), TAG('Esencial', '🏡 Esencial', { y: 680, rot: 4, tone: 'gold' }),
      TAG('treinta', 'Lista antes del 30 ✅', { y: 1250 }),
      WHOOSH('Mire'), TAG('fotos', '📸 sus fotos', { y: 560, rot: 4 }),
      { at: 'WhatsApp', dt: 0.15, tap: { x: 541, y: 1660 }, sfx: 'tap', vol: 1 }, TAG('precios', '📍 ubicación · 💲 precios', { y: 560, size: 44 }),
      HIT('mejor', { sfx: 'whoosh', shake: 8, vol: 0.45 }), HIT('paga', { sfx: 'ding', vol: 0.5, shake: 6 }),
      TAG('nueve', 'desde $49.000', { y: 560, tone: 'gold', size: 64, rot: -4 }),
      ...END('Partimos'), { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Partimos <em>hoy?</em>', checks: ['Lista antes del 30', 'Desde $49.000', 'Garantía de portada'], button: 'Escríbame PORTADA 👇', note: NOTE },
  },
  R18E: {
    file: '2026-11-18_1230_R18_reel-carta-qr-fogon_edit', slug: 'R18_edit', coverAt: 1.2, musicVol: 0.34, label: MUESTRA,
    hi: ['carta', 'qr', 'whatsapp'],
    shots: [
      { at: 0, type: 'photo', src: M('fogon-mapu', 'salon.webp'), kb: KB(1.08, 1.25, -15, 10) },
      B('Mire', 'fogon-mapu', { from: 0.3, speed: 0.5, trans: 'zoom', y: 1000, z: 1.04 }),
      { at: 'QR', type: 'photo', src: M('fogon-mapu', 'tiempo-1.webp'), kb: KB(1.2, 1.05, 10, 0), trans: 'whip' },
      { at: 'platos', type: 'stack', bg: M('fogon-mapu', 'tiempo-3.webp'), trans: 'whip', cards: [{ src: M('fogon-mapu', 'tiempo-2.webp'), y: 780 }, { src: M('fogon-mapu', 'tiempo-4.webp'), y: 900 }, { src: M('fogon-mapu', 'tiempo-6.webp'), y: 1020 }] },
      { at: 'historia', type: 'photo', src: M('fogon-mapu', 'chef.webp'), kb: KB(1.05, 1.22, 0, -20), trans: 'zoom' },
      B('precios', 'fogon-mapu', { from: 9.5, speed: 0.4, trans: 'whip', y: 1150, z: 1.06 }),
      { at: 'si', type: 'photo', src: M('fogon-mapu', 'tiempo-5.webp'), kb: KB(1.1, 1.25, -10, 10), trans: 'whip' },
      H('Sin', 'fogon-mapu', 5, 'Sin imprimir<br><em>nunca más</em> 🖨️', 120),
      B('Es', 'fogon-mapu', { from: 1.0, speed: 0.3, y: 1000, z: 1.04 }),
      { at: 'Escríbame', type: 'cta', capY: 1700 },
    ],
    fx: [
      TYPE('Cuántas', '¿Cuántas veces le preguntaron hoy qué tiene la carta? 🙃'),
      WHOOSH('Mire'), TAG('QR', '📱 QR en cada mesa', { y: 1250, tone: 'gold' }), TAG('foto', '📸 platos con foto', { y: 560, rot: 4 }),
      TAG('historia', '👩‍🍳 su historia', { y: 1250 }), TAG('celular', '✏️ cambia precios desde el celular', { y: 560, size: 42 }),
      TAG('WhatsApp', '💬 pedidos por WhatsApp', { y: 1250, tone: 'gold' }), HIT('Sin', { sfx: 'impact', shake: 16 }),
      TAG('nueve', 'desde $49.000', { y: 1250, tone: 'gold', size: 64 }),
      ...END('Escríbame'),
    ],
    cta: { title: 'Carta QR <em>$49.000</em>', checks: ['Platos con foto', 'Su historia', 'Pedidos por WhatsApp', 'QR en cada mesa'], button: 'Escríbame CARTA 👇', note: NOTE },
  },
  R19E: {
    file: '2026-11-20_1230_R19_reel-23-horas_edit', slug: 'R19_edit', coverAt: 1.2, musicVol: 0.32,
    hi: ['noche', 'directo', 'whatsapp', 'duerme'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'miah', t: 1 } },
      B('Encuentra', 'miah', { from: 0.3, speed: 0.5, trans: 'zoom', y: 1050, z: 1.03 }),
      { at: 'Mira', clip: 'miah-galeria', trans: 'whip', times: [['Mira', 1.0], ['ordenadas', 2.2], ['end', 4.6]], cam: [{ x: 540, y: 900, z: 1.15 }, { at: 'ordenadas', x: 540, y: 820, z: 1.35 }] },
      { at: 'Revisa', clip: 'miah-guia', trans: 'zoom', times: [['Revisa', 3.5], ['parques', 4.2], ['lagunas', 6.6], ['end', 7.6]], cam: [{ x: 540, y: 900, z: 1.15 }, { at: 'parques', x: 540, y: 820, z: 1.3 }] },
      { at: 'aprieta', clip: 'miah-funciones', from: 3.0, to: 5.4, trans: 'whip', cam: [{ x: 540, y: 1500, z: 1.15 }, { at: 'directo', x: 541, y: 1660, z: 1.6 }] },
      { at: 'Eso', type: 'stack', bg: MIAH('exterior-sol'), trans: 'whip', label: REAL, cards: [{ src: MIAH('exterior-cielo'), y: 780 }, { src: MIAH('living'), y: 900 }, { src: MIAH('terraza'), y: 1020 }] },
      H('Su', 'miah', 1, 'Su web trabaja<br><em>mientras duerme</em> 🌙', 110),
      { at: 'Quiere', type: 'cta', capY: 1700 },
    ],
    fx: [
      TAG('Santiago', '📍 Santiago', { y: 1450, rot: -4 }), TAG('enero', '☀️ enero', { y: 1580, rot: 4, tone: 'gold' }),
      WHOOSH('Encuentra'), TAG('Curacautín', '📍 Curacautín', { y: 1250, rot: 5 }),
      { taps: 2 }, { taps: 3 },
      { at: 'directo', dt: 0.2, tap: { x: 541, y: 1660 }, sfx: 'tap', vol: 1 }, TAG('WhatsApp', '💬 23:04 · nueva consulta', { y: 560, tone: 'gold', size: 44 }),
      TAG('Miah', 'CASO REAL ✅', { y: 690, tone: 'gold', size: 58 }), HIT('Su', { sfx: 'riser', vol: 0.35, shake: 6 }),
      ...END('Quiere'), { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Quiere <em>una así?</em>', checks: ['Fotos por espacio', 'Guía de la zona', 'Reserva directa 24/7'], button: 'Escríbame PORTADA 👇', note: NOTE },
  },
  R20E: {
    file: '2026-11-22_1900_R20_reel-detras-de-una-portada_edit', slug: 'R20_edit', coverAt: 1.2, musicVol: 0.32,
    hi: ['portada', 'paga', 'lugar'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'redvaeru-inicio', t: 1 } },
      B('Primero', 'redvaeru-metodo', { from: 4.6, speed: 0.4, trans: 'zoom', y: 1300, z: 1.1 }),
      { at: 'fotos', type: 'stack', bg: MIAH('exterior'), trans: 'whip', label: REAL, cards: [{ src: MIAH('exterior-cielo'), cap: 'sus fotos', y: 780 }, { src: MIAH('interior'), cap: 'su historia', y: 900 }, { src: MIAH('estufa'), cap: 'lo distinto', y: 1020 }] },
      B('Después', 'redvaeru-metodo', { from: 6.2, speed: 0.4, trans: 'whip', y: 1300, z: 1.1 }),
      B('muestro#2', 'miah', { from: 0.3, speed: 0.5, trans: 'zoom', y: 1050, z: 1.03 }),
      H('Si#2', 'miah', 1, 'Si no le gusta:<br><em>$0</em>', 140),
      { at: 'termas', type: 'photo', src: M('termas-rayenko', 'pozon-noche.webp'), kb: KB(1.1, 1.25), trans: 'whip', label: 'Muestra de concepto' },
      { at: 'cabañas', type: 'photo', src: M('cabanas-lago-azul', 'hero.webp'), kb: KB(1.1, 1.25, 20, 0), trans: 'whip', label: 'Muestra de concepto' },
      { at: 'viñas', type: 'photo', src: M('vina-los-robles', 'barricas.webp'), kb: KB(1.1, 1.25, -20, 0), trans: 'whip', label: 'Muestra de concepto' },
      { at: 'cafés', type: 'photo', src: M('kuchen-haus-frutillar', 'vitrina.webp'), kb: KB(1.1, 1.25, 0, 20), trans: 'whip', label: 'Muestra de concepto' },
      { at: 'Cada', type: 'stack', bg: M('domos-cielo-austral', 'unidad-1.webp'), trans: 'zoom', label: 'Muestras de concepto', cards: [{ src: M('termas-rayenko', 'hero.webp'), y: 760, w: 560, h: 480 }, { src: M('vina-los-robles', 'hero.webp'), y: 880, w: 560, h: 480 }, { src: M('villa-coral-samana', 'hero.webp'), y: 1000, w: 560, h: 480 }, { src: M('pucon-aventura', 'tour-1.webp'), y: 1120, w: 560, h: 480 }] },
      { at: 'Escríbame', type: 'cta', capY: 1700 },
    ],
    fx: [
      NUM('Primero', 1, 'Conozco su lugar', 'Después'), NUM('Después', 2, 'Diseño su portada', 'Si#2'),
      TAG('colores', '🎨 su nombre y sus colores', { y: 560, size: 44 }), TAG('decide', 'Usted decide 👍', { y: 1250, tone: 'gold' }),
      HIT('Si#2', { sfx: 'ding', vol: 0.5, shake: 8 }),
      HIT('termas', { flash: 0.3, shake: 6, sfx: 'whoosh', vol: 0.35 }), HIT('cabañas', { flash: 0.3, shake: 6, sfx: 'whoosh', vol: 0.35 }),
      HIT('viñas', { flash: 0.3, shake: 6, sfx: 'whoosh', vol: 0.35 }), HIT('cafés', { flash: 0.3, shake: 6, sfx: 'whoosh', vol: 0.35 }),
      ...END('Escríbame'),
    ],
    cta: { title: '¿Le muestro <em>la suya?</em>', checks: ['Conozco su lugar', 'Diseño su portada', 'Usted decide'], button: 'Escríbame PORTADA 👇', note: NOTE },
  },
};

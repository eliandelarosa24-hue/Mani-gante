// Semana 1 · reediciones con edición humana (16 al 21 de octubre). Coordenadas en px de la grabación (1080×2337).
const MUESTRA = { space: 'screen' };
const CTA_NOTE = 'Primero ve su portada. Si no le convence, no paga.';
const cut = (at, clip, n, label, trans, rgb) => ({
  shot: { at, clip, from: 0.6, speed: 0.8, trans, cam: [{ x: 540, y: 1000, z: 1.06 }], push: 0.12 },
  fx: { at, sticker: { kind: 'num', text: String(n), label, x: 400, y: 300 }, rgb, sfx: 'pop' },
});
const NUEVE = [
  cut('Uno', 'termas-rayenko', 1, 'Termas ♨️', 'whip', true),
  cut('Dos', 'cabanas-lago-azul', 2, 'Cabañas frente al lago', 'zoom'),
  cut('Tres', 'domos-cielo-austral', 3, 'Domos bajo las estrellas ✨', 'whip', true),
  cut('Cuatro', 'pucon-aventura', 4, 'Tours de aventura 🌋', 'zoom'),
  cut('Cinco', 'vina-los-robles', 5, 'Viña 🍷', 'whip', true),
  cut('Seis', 'fogon-mapu', 6, 'Cocina de fuego 🔥', 'zoom'),
  cut('Siete', 'kuchen-haus-frutillar', 7, 'Café y pastelería 🍰', 'whip', true),
  cut('Ocho', 'hotel-casa-nogal', 8, 'Hotel boutique', 'zoom'),
  cut('nueve#3', 'villa-coral-samana', 9, 'Villas en el Caribe 🌴', 'whip', true),
];
NUEVE[7].shot.from = 6; NUEVE[8].shot.from = 6;

export const EDITS = {
  // Vie 16 · Caso real Miah y Noah: gancho escrito, recorrido con toques reales y el testimonio textual de Nicole.
  P02E: {
    file: '2026-10-16_1230_P02_reel-miah-y-noah_edit', slug: 'P02_edit', coverAt: 1.8, musicVol: 0.32,
    hi: ['booking', 'whatsapp', 'directo', 'portada'],
    shots: [
      { at: 0, clip: 'miah', from: 0.3, speed: 0.5, dim: 0.45, noCap: true, cam: [{ x: 540, y: 1100, z: 1.05 }], push: 0.06 },
      { at: 'Mire', clip: 'miah', from: 0.3, trans: 'zoom', cam: [{ x: 540, y: 1100, z: 1.02 }], push: 0.1 },
      { at: 'fotos', clip: 'miah-galeria', trans: 'whip', times: [['fotos', 1.4], ['espacio', 2.2], ['end', 3.4]], cam: [{ x: 540, y: 900, z: 1.15 }, { at: 'espacio', x: 540, y: 820, z: 1.35 }] },
      { at: 'guía', clip: 'miah-guia', trans: 'zoom', times: [['guía', 3.5], ['parques', 4.2], ['lagunas', 6.6], ['end', 7.0]], cam: [{ x: 540, y: 900, z: 1.15 }, { at: 'parques', x: 540, y: 820, z: 1.3 }] },
      { at: 'botón', clip: 'miah-funciones', from: 3.0, to: 5.4, trans: 'whip', cam: [{ x: 540, y: 1450, z: 1.15 }, { at: 'reservar', x: 541, y: 1660, z: 1.6 }] },
      { at: 'Nicole', clip: 'miah', from: 0.3, speed: 0.3, dim: 0.55, trans: 'zoom', cam: [{ x: 540, y: 1100, z: 1.08 }], push: 0.05 },
      { at: 'Quiere', type: 'cta', capY: 1660 },
    ],
    fx: [
      { at: 'Esta', sticker: { kind: 'type', text: 'Esta cabaña ya no depende solo de Booking 👀', x: 540, y: 760, size: 86 }, sfx: 'click', vol: 0.7 },
      { at: 'Booking', flash: 0.4, shake: 12, rgb: true, sfx: 'impact', vol: 0.45 },
      { at: 'Mire', sticker: { text: 'CASO REAL ✅', x: 540, y: 690, rot: -4, tone: 'gold', size: 58 }, sfx: 'pop' },
      { at: 'Mire', dt: 0.35, sticker: { text: '📍 Curacautín', x: 720, y: 1240, rot: 5 }, sfx: 'pop' },
      { at: 'ordenadas', sticker: { text: '📸 Fotos por espacio', x: 560, y: 1250, rot: -4 }, sfx: 'pop' },
      { taps: 2 },
      { at: 'guía', sticker: { text: '🗺️ Guía de la zona', x: 560, y: 1250, rot: 5, tone: 'ink' }, sfx: 'pop' },
      { taps: 3 },
      { at: 'botón', rgb: true, flash: 0.3 },
      { at: 'reservar', dt: 0.3, tap: { x: 541, y: 1660 }, sfx: 'tap', vol: 1 },
      { at: 'WhatsApp', sticker: { text: 'Sin comisión 💸', x: 540, y: 470, rot: -3, tone: 'ink' }, sfx: 'pop' },
      { at: 'Nicole', sticker: { kind: 'quote', text: 'Ahora nuestros huéspedes nos encuentran y reservan directo.', by: '— Nicole, coanfitriona · Cabañas Miah y Noah', x: 540, y: 860 }, sfx: 'pop' },
      { at: 'ahora', sfx: 'ding', vol: 0.45 },
      { at: 'Quiere', flash: 0.4, sfx: 'click', vol: 0.9 },
      { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Quiere <em>una así?</em>', checks: ['Fotos por espacio', 'Guía de la zona', 'Reserva por WhatsApp'], button: 'Escríbame PORTADA 👇', note: CTA_NOTE },
  },

  // Sáb 17 · Montaje de las 9 muestras: cortes rápidos al ritmo de los números.
  P04E: {
    file: '2026-10-17_1130_P04_reel-showreel-muestras_edit', slug: 'P04_edit', coverAt: 1.6, musicVol: 0.36,
    hi: ['nueve', 'suyo', 'numero'],
    shots: [
      { at: 0, clip: 'villa-coral-samana', from: 0.5, speed: 0.4, dim: 0.62, noCap: true, cam: [{ x: 540, y: 1000, z: 1.1 }], push: 0.08 },
      { at: 'Cuál', clip: 'hotel-casa-nogal', from: 0.5, trans: 'zoom', cam: [{ x: 540, y: 1000, z: 1.05 }], push: 0.1 },
      ...NUEVE.map((c) => c.shot),
      { at: 'Son', clip: 'redvaeru-inicio', from: 0.5, trans: 'whip', cam: [{ x: 540, y: 1000, z: 1.03 }], push: 0.08 },
      { at: 'Coménteme', type: 'cta', capY: 1700 },
    ],
    fx: [
      { at: 'Nueve', sticker: { kind: 'type', text: '9 negocios del sur.\n9 webs distintas. 🔥', x: 540, y: 820, size: 92 }, sfx: 'click', vol: 0.7 },
      { at: 'nueve#2', flash: 0.4, rgb: true, shake: 10, sfx: 'impact', vol: 0.45 },
      { at: 'Cuál', sticker: { text: '¿Cuál se parece al suyo? 🤔', x: 540, y: 1180, rot: -4, tone: 'gold', size: 62 }, sfx: 'pop' },
      { at: 'suyo', dt: -0.2, sfx: 'riser', vol: 0.3 },
      ...NUEVE.map((c) => c.fx),
      { at: 'Uno', sticker: { text: 'Muestras de concepto', x: 540, y: 1700, tone: 'ink', size: 32 }, persist: true, until: 'Son' },
      { at: 'ideas', sticker: { text: '💡 Ideas de lo que se puede hacer', x: 540, y: 1200, rot: -3 }, sfx: 'pop' },
      { at: 'Coménteme', flash: 0.4, sfx: 'click', vol: 0.9 },
      { at: 'número', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Cuál se parece <em>al suyo?</em>', checks: ['1 Termas', '2 Cabañas', '3 Domos', '4 Tours', '5 Viña', '6 Fuego', '7 Café', '8 Hotel', '9 Caribe'], button: 'Coménteme el número 👇', note: 'Y le cuento cómo sería la suya.' },
  },

  // Dom 18 · El Rincón de los Poetas: pregunta de curiosidad, el dato de 1966 dibujado a mano y el 9,8 de Booking.
  P06E: {
    file: '2026-10-18_1930_P06_reel-rincon-de-los-poetas_edit', slug: 'P06_edit', coverAt: 1.8, musicVol: 0.3,
    hi: ['historia', 'directo', 'portada'],
    shots: [
      { at: 0, clip: 'poetas', from: 0.5, speed: 0.4, dim: 0.5, noCap: true, cam: [{ x: 540, y: 1000, z: 1.1 }], push: 0.06 },
      { at: 'Existe', clip: 'poetas', from: 0.3, speed: 0.5, trans: 'zoom', cam: [{ x: 540, y: 1000, z: 1.02 }], push: 0.1 },
      { at: 'Juvencio', clip: 'poetas', trans: 'whip', times: [['Juvencio', 9.6], ['end', 10.6]], cam: [{ x: 540, y: 1400, z: 1.3 }, { at: 'Literatura', x: 345, y: 1330, z: 1.55 }] },
      { at: 'Rincón', clip: 'poetas', trans: 'zoom', times: [['Rincón', 5.0], ['end', 6.4]], cam: [{ x: 540, y: 1000, z: 1.05 }], push: 0.1 },
      { at: 'cinco', clip: 'poetas', trans: 'whip', times: [['cinco', 14.0], ['end', 15.0]], cam: [{ x: 540, y: 1000, z: 1.05 }], push: 0.12 },
      { at: 'nueve', clip: 'poetas', trans: 'zoom', times: [['nueve', 10.0], ['end', 10.9]], cam: [{ x: 300, y: 1554, z: 1.9 }] },
      { at: 'canal', clip: 'poetas', from: 0.5, speed: 0.4, trans: 'whip', cam: [{ x: 540, y: 1400, z: 1.1 }, { at: 'reservar', x: 490, y: 1674, z: 1.5 }] },
      { at: 'lugar', type: 'cta', capY: 1680 },
    ],
    fx: [
      { at: 'Un', sticker: { kind: 'type', text: '¿Un hostal donde la poesía se quedó a vivir? 📖', x: 540, y: 800, size: 84 }, sfx: 'click', vol: 0.7 },
      { at: 'Existe', flash: 0.45, shake: 12, rgb: true, sfx: 'impact', vol: 0.45 },
      { at: 'Almagro', sticker: { text: '📍 Almagro, Nueva Imperial', x: 560, y: 1240, rot: 4 }, sfx: 'pop' },
      { at: 'Juvencio', sticker: { text: '✍️ Juvencio Valle', x: 720, y: 420, rot: -4, tone: 'gold' }, sfx: 'pop' },
      { at: 'Premio', draw: { kind: 'circle', x: 225, y: 1321, rx: 135, ry: 78 }, sfx: 'scribble', vol: 0.8 },
      { at: 'web', sticker: { text: 'Su historia, en su web ✅', x: 540, y: 1250, rot: -3, tone: 'ink' }, sfx: 'pop' },
      { at: 'cinco', sticker: { kind: 'num', text: '5', label: 'habitaciones', x: 400, y: 300 }, rgb: true, sfx: 'pop' },
      { at: 'nueve', flash: 0.5, shake: 18, sfx: 'ding', vol: 0.6 },
      { at: 'nueve', dt: 0.2, sticker: { text: '⭐ 9,8 en Booking', x: 700, y: 600, rot: 5, tone: 'gold', size: 66 }, sfx: 'pop' },
      { at: 'ocho', draw: { kind: 'underline', x: 40, y: 1620, w: 190 }, speed: 0.35 },
      { at: 'reservar', dt: 0.2, tap: { x: 490, y: 1674 }, sfx: 'tap', vol: 1 },
      { at: 'lugar', flash: 0.4, sfx: 'click', vol: 0.9 },
      { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Su lugar también <em>tiene una historia?</em>', button: 'Escríbame PORTADA 👇', note: CTA_NOTE },
  },

  // Mié 21 · Carta QR: la carta impresa vs. la digital, y la cuenta del delivery en la calculadora real.
  R02E: {
    file: '2026-10-21_1230_R02_reel-carta-qr_edit', slug: 'R02_edit', coverAt: 1.8, musicVol: 0.32,
    hi: ['carta', 'whatsapp', 'qr'],
    shots: [
      { at: 0, clip: 'fogon-mapu', from: 10.5, speed: 0.3, dim: 0.5, noCap: true, cam: [{ x: 540, y: 1100, z: 1.1 }], push: 0.05 },
      { at: 'Mire', clip: 'fogon-mapu', from: 0.3, trans: 'zoom', cam: [{ x: 540, y: 1000, z: 1.02 }], push: 0.1 },
      { at: 'platos', clip: 'fogon-mapu', trans: 'whip', times: [['platos', 9.5], ['end', 11]], cam: [{ x: 540, y: 1100, z: 1.1 }], push: 0.08 },
      { at: 'historia', clip: 'fogon-mapu', from: 5.2, speed: 0.4, trans: 'zoom', cam: [{ x: 540, y: 1000, z: 1.05 }], push: 0.1 },
      { at: 'QR', type: 'hook', bg: { clip: 'fogon-mapu', t: 10 }, text: '📱 QR en cada <em>mesa</em>', size: 130 },
      { at: 'delivery', clip: 'calculadora-restaurante', trans: 'whip', times: [['delivery', 1.0], ['ciento', 2.2], ['veinte', 4.5], ['veinticinco', 6.0], ['end', 7.2]], cam: [
        { x: 540, y: 1150, z: 1.3 }, { at: 'ciento', x: 760, y: 935, z: 1.75 }, { at: 'veinticinco', x: 760, y: 1476, z: 1.75 }, { at: 'comisión', x: 540, y: 1650, z: 1.2, dur: 0.5 },
      ] },
      { at: 'cinco', clip: 'calculadora-restaurante', from: 8, speed: 0.3, trans: 'zoom', cam: [{ x: 390, y: 1900, z: 1.75 }, { at: 'año', x: 390, y: 1900, z: 2.05 }] },
      { at: 'carta#3', type: 'cta', capY: 1700 },
    ],
    fx: [
      { at: 'Todavía', sticker: { kind: 'type', text: '¿Todavía imprime la carta cada vez que sube un precio? 🖨️', x: 540, y: 800, size: 80 }, sfx: 'click', vol: 0.7 },
      { at: 'precio', sticker: { kind: 'emoji', text: '😩', x: 830, y: 1250, size: 160 }, wiggle: true, sfx: 'pop' },
      { at: 'Mire', flash: 0.4, rgb: true, shake: 10, sfx: 'impact', vol: 0.45 },
      { at: 'Mire', sticker: { text: 'Muestra de concepto · Fogón Mapu', x: 540, y: 1700, tone: 'ink', size: 32 }, persist: true, until: 'delivery' },
      { at: 'platos', sticker: { text: '🍽️ Sus platos', x: 720, y: 420, rot: 4, tone: 'gold' }, sfx: 'pop' },
      { at: 'historia', sticker: { text: '👩‍🍳 Su historia', x: 720, y: 420, rot: -4 }, sfx: 'pop' },
      { at: 'WhatsApp', sticker: { text: '💬 Pedidos por WhatsApp', x: 560, y: 1250, rot: 3, tone: 'ink' }, sfx: 'pop' },
      { at: 'QR', flash: 0.35, sfx: 'whoosh', vol: 0.4 },
      { at: 'precios', sticker: { text: 'Usted cambia los precios ✅', x: 540, y: 560, rot: -3, tone: 'gold' }, sfx: 'ding', vol: 0.45 },
      { at: 'veinte', draw: { kind: 'circle', x: 922, y: 935, rx: 95, ry: 62 }, sfx: 'scribble', vol: 0.8 },
      { at: 'veinticinco', sticker: { text: '25 % 😬', x: 800, y: 430, rot: 6, tone: 'gold' }, sfx: 'pop' },
      { at: 'cinco', flash: 0.7, shake: 22, rgb: true, sfx: 'impact', vol: 0.7 },
      { at: 'cinco', dt: 0.35, draw: { kind: 'underline', x: 108, y: 1975, w: 560 }, speed: 0.45, sfx: 'scribble', vol: 0.7 },
      { at: 'año', sticker: { text: 'al AÑO 😱', x: 770, y: 600, rot: 7, tone: 'gold', size: 64 }, sfx: 'cash', vol: 0.8 },
      { at: 'año', dt: 0.15, sticker: { kind: 'emoji', text: '💸', x: 830, y: 1220 }, wiggle: true },
      { at: 'carta#3', flash: 0.4, sfx: 'click', vol: 0.9 },
      { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: 'Carta QR <em>$49.000</em>', checks: ['Sus platos', 'Su historia', 'Pedidos por WhatsApp', 'QR en cada mesa'], button: 'Escríbame CARTA 👇', note: CTA_NOTE },
  },
};

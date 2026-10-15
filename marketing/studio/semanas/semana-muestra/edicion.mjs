// Muestra de edición humana (H01): «Lo que le paga a Booking», con la calculadora real del sitio y el caso
// real de Cabañas Miah y Noah. Coordenadas de cámara y trazos en píxeles de la grabación (1080×2337).
export const EDITS = {
  H01: {
    file: 'H01_muestra-edicion-humana', slug: 'muestra', coverAt: 0.5, musicVol: 0.35,
    shots: [
      { at: 0, type: 'hook', bg: { clip: 'calculadora-sube', t: 7 }, text: 'Ojo con<br><em>esto</em> 👀', noCap: true },
      { at: 'Si', clip: 'miah', from: 0.4, trans: 'whip', cam: [{ x: 540, y: 1100, z: 1.02 }], push: 0.08 },
      { at: 'cuenta', clip: 'calculadora-sube', from: 0.6, to: 5.0, trans: 'zoom', cam: [
        { x: 540, y: 1150, z: 1.3 },
        { at: 'Veinte', x: 760, y: 960, z: 1.75 },
        { at: 'noventa', x: 760, y: 1235, z: 1.75 },
        { at: 'dieciocho', x: 760, y: 1476, z: 1.75 },
        { at: 'comisión', x: 540, y: 1650, z: 1.2, dur: 0.5 },
      ] },
      { at: 'Tres', clip: 'calculadora-sube', from: 6, speed: 0.3, trans: 'zoom', cam: [
        { x: 390, y: 1900, z: 1.75 },
        { at: 'Casi', x: 390, y: 1900, z: 2.05 },
      ] },
      { at: 'Ahora', clip: 'miah', from: 0.3, trans: 'whip', cam: [{ x: 540, y: 1100, z: 1.02 }], push: 0.08 },
      { at: 'tiene#2', clip: 'miah-funciones', from: 1.4, to: 4.8, trans: 'whip', cam: [
        { x: 540, y: 1500, z: 1.15 },
        { at: 'directo', x: 541, y: 1660, z: 1.55 },
      ] },
      { at: 'Quiere', type: 'cta', capY: 1660 },
    ],
    fx: [
      { at: 'Ojo', flash: 0.7, shake: 18, sfx: 'impact', vol: 0.55 },
      { at: 'Booking', sticker: { text: '¿Vende por Booking? 🤔', x: 540, y: 1180, rot: -5 }, sfx: 'pop' },
      { at: 'Veinte', draw: { kind: 'circle', x: 936, y: 932, rx: 85, ry: 62 }, sfx: 'scribble', vol: 0.8 },
      { at: 'dieciocho', sticker: { text: '18 % 😬', x: 800, y: 430, rot: 6, tone: 'gold' }, sfx: 'pop' },
      { at: 'Tres', flash: 0.75, shake: 22, sfx: 'impact', vol: 0.7 },
      { at: 'Tres', dt: 0.35, draw: { kind: 'underline', x: 108, y: 1975, w: 540 }, speed: 0.45, sfx: 'scribble', vol: 0.7 },
      { at: 'año', sticker: { text: 'al AÑO 😱', x: 770, y: 600, rot: 7, tone: 'gold', size: 64 }, sfx: 'pop' },
      { at: 'Casi', flash: 0.5, shake: 28, sfx: 'cash', vol: 0.8 },
      { at: 'Casi', dt: 0.15, sticker: { kind: 'emoji', text: '💸', x: 830, y: 1220 }, wiggle: true },
      { at: 'Miah', sticker: { text: 'CASO REAL ✅', x: 540, y: 690, rot: -4, tone: 'gold', size: 58 }, sfx: 'pop' },
      { at: 'Curacautín', sticker: { text: '📍 Curacautín', x: 720, y: 1240, rot: 5 }, sfx: 'pop' },
      { at: 'reservan', draw: { kind: 'arrow', x1: 930, y1: 1260, x2: 820, y2: 1600, bend: -0.3 }, sfx: 'scribble', vol: 0.8 },
      { at: 'WhatsApp', sticker: { text: 'Sin comisión 💸', x: 540, y: 470, rot: -3, tone: 'ink' }, sfx: 'pop' },
      { at: 'Quiere', flash: 0.45, sfx: 'click', vol: 0.9 },
      { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
    ],
    cta: { title: '¿Quiere <em>la suya?</em>', button: 'Escríbame PORTADA 👇', note: 'Primero ve su portada. Si no le convence, no paga.' },
  },
};

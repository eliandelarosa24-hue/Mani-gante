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

  // H02 · «3 cosas que su web necesita»: gancho que se escribe solo, curiosidad abierta («la tercera…»),
  // capítulos 1-2-3 y toques reales en la galería y la guía de Cabañas Miah y Noah.
  H02: {
    file: 'H02_muestra-3-cosas', slug: 'muestra-2', coverAt: 2.4, musicVol: 0.32,
    hi: ['whatsapp', 'fotos', 'guia', 'diferencia', 'gratis', 'portada'],
    shots: [
      { at: 0, clip: 'miah-galeria', from: 0.3, speed: 0.6, dim: 0.5, noCap: true, cam: [{ x: 540, y: 1100, z: 1.2 }], push: 0.08 },
      { at: 'Tres', clip: 'miah', from: 0.3, speed: 0.45, trans: 'whip', cam: [{ x: 540, y: 1100, z: 1.02 }], push: 0.08 },
      { at: 'Uno', clip: 'miah-funciones', from: 3.0, to: 5.4, trans: 'zoom', cam: [
        { x: 540, y: 1450, z: 1.15 },
        { at: 'botón', x: 541, y: 1660, z: 1.6 },
      ] },
      { at: 'Dos', clip: 'miah-galeria', trans: 'whip', times: [['Dos', 1.0], ['Exterior', 2.2], ['living', 4.6], ['revueltas', 7.0], ['end', 8.0]], cam: [
        { x: 540, y: 900, z: 1.15 },
        { at: 'Exterior', x: 540, y: 820, z: 1.35 },
      ] },
      { at: 'tres#2', clip: 'miah-guia', trans: 'zoom', times: [['tres#2', 3.5], ['parques', 4.2], ['lagunas', 6.6], ['end', 7.6]], cam: [
        { x: 540, y: 900, z: 1.15 },
        { at: 'parques', x: 540, y: 820, z: 1.3 },
      ] },
      { at: 'Así', clip: 'miah', from: 0.3, trans: 'whip', cam: [{ x: 540, y: 1100, z: 1.02 }], push: 0.08 },
      { at: 'suya', type: 'cta', capY: 1660 },
    ],
    fx: [
      { at: 'Si', sticker: { kind: 'type', text: 'Si su cabaña tiene web…', x: 540, y: 740, size: 92 }, sfx: 'click', vol: 0.7 },
      { at: 'revise', sticker: { text: 'REVISE ESTO 👇', x: 540, y: 1120, rot: -4, tone: 'gold', size: 74 }, flash: 0.5, shake: 14, rgb: true, sfx: 'impact', vol: 0.5 },
      { at: 'Tres', sticker: { kind: 'num', text: '3', label: 'cosas que buscan', x: 440, y: 1190 }, until: 'tercera', sfx: 'pop' },
      { at: 'tercera', sticker: { text: '👀 la 3 es clave', x: 560, y: 1200, rot: 5, tone: 'ink', size: 56 }, sfx: 'pop' },
      { at: 'diferencia', dt: -0.4, sfx: 'riser', vol: 0.3 },
      { at: 'Uno', sticker: { kind: 'num', text: '1', label: 'WhatsApp a la vista', x: 380, y: 300 }, rgb: true, sfx: 'pop' },
      { at: 'vista', tap: { x: 541, y: 1660 }, sfx: 'tap', vol: 1 },
      { at: 'van', sticker: { kind: 'emoji', text: '🏃‍♀️💨', x: 800, y: 760, size: 150 }, wiggle: true, sfx: 'whoosh', vol: 0.35 },
      { at: 'Dos', sticker: { kind: 'num', text: '2', label: 'Fotos por espacio', x: 380, y: 300 }, rgb: true, sfx: 'pop' },
      { taps: 3 },
      { at: 'revueltas', sticker: { text: '❌ 40 fotos revueltas', x: 560, y: 1250, rot: -6 }, shake: 10, sfx: 'pop' },
      { at: 'tres#2', sticker: { kind: 'num', text: '3', label: 'Guía de la zona', x: 380, y: 300 }, rgb: true, flash: 0.35, sfx: 'pop' },
      { taps: 4 },
      { at: 'zona', sfx: 'ding', vol: 0.5 },
      { at: 'Miah', sticker: { text: 'CASO REAL ✅', x: 540, y: 690, rot: -4, tone: 'gold', size: 58 }, sfx: 'pop' },
      { at: 'Curacautín', sticker: { text: '📍 Curacautín', x: 720, y: 1240, rot: 5 }, sfx: 'pop' },
      { at: 'suya', flash: 0.4, sfx: 'click', vol: 0.9 },
      { at: 'Escríbame', sfx: 'pop', vol: 0.8 },
      { at: 'gratis', sfx: 'ding', vol: 0.45 },
    ],
    cta: { title: '¿La suya tiene <em>las tres?</em>', checks: ['WhatsApp a la vista', 'Fotos por espacio', 'Guía de la zona'], button: 'Escríbame PORTADA 👇', note: 'Se la reviso gratis.' },
  },
};

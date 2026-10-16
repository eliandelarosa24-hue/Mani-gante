// Serie informativa · A02 reeditado con edición humana (jueves 22 de octubre).
export const EDITS = {
  A02E: {
    file: 'A02_comision-plataformas_edit', slug: 'A02_edit', coverAt: 1.8, musicVol: 0.32,
    hi: ['booking', 'airbnb', 'directo', 'portada'],
    shots: [
      { at: 0, clip: 'calculadora-sube', from: 7, speed: 0.2, dim: 0.7, noCap: true, cam: [{ x: 540, y: 1500, z: 1.3 }], push: 0.06 },
      { at: 'Booking', type: 'hook', bg: { clip: 'calculadora-sube', t: 7 }, text: 'Booking<br><em>10–25 %</em>' },
      { at: 'Airbnb', type: 'hook', bg: { clip: 'miah', t: 1 }, text: 'Airbnb<br><em>3 % o ~15 %</em>' },
      { at: 'Con#2', type: 'hook', bg: { clip: 'calculadora-sube', t: 9 }, text: '$3.000.000 × 15 %<br>= <em>$450.000</em> 💸', size: 104 },
      { at: 'plataformas', clip: 'miah', from: 0.3, trans: 'whip', cam: [{ x: 540, y: 1100, z: 1.02 }], push: 0.1 },
      { at: 'web', clip: 'miah-funciones', from: 3.0, to: 5.4, trans: 'zoom', cam: [{ x: 540, y: 1450, z: 1.15 }, { at: 'directo', x: 541, y: 1660, z: 1.6 }] },
      { at: 'Escríbame', type: 'cta', capY: 1700 },
    ],
    fx: [
      { at: 'Sabe', sticker: { kind: 'type', text: '¿Cuánto le cobra REALMENTE la plataforma? 🤨', x: 540, y: 800, size: 84 }, sfx: 'click', vol: 0.7 },
      { at: 'plataforma', flash: 0.4, shake: 12, rgb: true, sfx: 'impact', vol: 0.45 },
      { at: 'Booking', flash: 0.35, sfx: 'whoosh', vol: 0.45 },
      { at: 'Booking', sticker: { text: 'Fuente: Booking.com Partner Hub · Airbnb, Centro de ayuda', x: 540, y: 1720, tone: 'ink', size: 26 }, persist: true, until: 'Con#2' },
      { at: 'contrato', sticker: { text: 'según su contrato 📄', x: 540, y: 1240, rot: -4 }, sfx: 'pop' },
      { at: 'Airbnb', flash: 0.35, sfx: 'whoosh', vol: 0.45 },
      { at: 'quince', sticker: { text: 'si la paga solo usted 😬', x: 540, y: 1240, rot: 4, tone: 'gold' }, sfx: 'pop' },
      { at: 'Con#2', flash: 0.35, sfx: 'whoosh', vol: 0.45 },
      { at: 'cuatrocientos', flash: 0.6, shake: 22, rgb: true, sfx: 'cash', vol: 0.8 },
      { at: 'traen', sticker: { text: 'Traen huéspedes ✅', x: 540, y: 1240, rot: -3 }, sfx: 'pop' },
      { at: 'vuelvan', sticker: { text: 'Sin comisión 💸', x: 540, y: 470, rot: -3, tone: 'ink' }, sfx: 'pop' },
      { at: 'directo', dt: 0.2, tap: { x: 541, y: 1660 }, sfx: 'tap', vol: 1 },
      { at: 'Escríbame', flash: 0.4, sfx: 'click', vol: 0.9 },
    ],
    cta: { title: 'Que vuelvan <em>directo</em>', checks: ['Su web', 'Reserva por WhatsApp', 'Sin comisión'], button: 'Escríbame PORTADA 👇', note: 'Primero ve su portada. Si no le convence, no paga.' },
  },
};

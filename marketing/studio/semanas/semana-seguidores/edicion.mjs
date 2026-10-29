// Serie «Seguidores»: 5 videos para hacer crecer el Instagram de Red Vaeru, grabados del sitio nuevo
// (la función de cine: ficción, intermedio, documental y «Próximamente su lugar»). Voz: Red Vaeru F · Camila.
import { B, H, TAG, HIT, WHOOSH, END, NUM } from '../kit-edicion.mjs';

// Plano del celular completo (el clip mide 1080 × 2337).
const FULL = { y: 1168, z: 1.02 };
// Fotogramas fijos de los sitios (sacados de out/clips) para las tarjetas.
// Número del juego, abajo para no tapar los títulos de cada sitio.
const N = (at, n, label, until) => ({ ...NUM(at, n, label, until), sticker: { kind: 'num', text: String(n), label, x: 380, y: 1230 } });
const ST = (n) => `marketing/studio/out/semana-seguidores/stills/${n}.jpg`;

export const EDITS = {
  V01E: {
    file: 'V01_proyectamos-lugares', slug: 'V01', coverAt: 1.2, musicVol: 0.34,
    hi: ['película', 'lugares', 'ficción', 'reales', 'síganos', 'función'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'rv-funcion', t: 8 } },
      B('Esto', 'rv-apertura', { from: 1, speed: 1, trans: 'zoom', ...FULL, z: 1.12 }),
      B('Caribe', 'rv-funcion', { from: 5.6, speed: 0.75, trans: 'whip', ...FULL, z: 1.08 }),
      B('Villas', 'rv-funcion', { from: 7.6, speed: 0.7, trans: 'whip', ...FULL }),
      B('Viñas', 'rv-funcion', { from: 9.3, speed: 0.7, trans: 'whip', ...FULL }),
      B('Cocina', 'rv-funcion', { from: 10.2, speed: 0.7, trans: 'whip', ...FULL }),
      B('Termas', 'rv-funcion', { from: 15, speed: 0.7, trans: 'whip', ...FULL }),
      B('volcanes', 'rv-funcion', { from: 13.1, speed: 0.7, trans: 'whip', ...FULL }),
      B('cielos', 'rv-funcion', { from: 14, speed: 0.7, trans: 'whip', ...FULL }),
      B('Diez', 'rv-funcion', { from: 17.2, speed: 1.1, trans: 'zoom', ...FULL }),
      B('tres', 'rv-documental', { from: 4.6, speed: 0.9, trans: 'whip', ...FULL }),
      B('Si#2', 'rv-estreno', { from: 0.5, speed: 0.5, trans: 'zoom', ...FULL, z: 1.08 }),
      { at: 'síganos', type: 'cta', capY: 1700 },
    ],
    fx: [
      HIT('Esto', { sfx: 'impact', shake: 10, vol: 0.45 }),
      TAG('Caribe', '🌴 19° N → 41° S 🌲', { y: 330, tone: 'gold', size: 54 }),
      TAG('Villas', 'Samaná 🇩🇴', { y: 520, rot: -3 }), TAG('Viñas', 'Colchagua 🍷', { y: 520, rot: 3 }),
      TAG('Cocina', 'Temuco 🔥', { y: 520, rot: -3 }), TAG('Termas', 'Liquiñe ♨️', { y: 520, rot: 3 }),
      TAG('volcanes', 'Pucón 🌋', { y: 520, rot: -3 }), TAG('cielos', 'Curarrehue ✨', { y: 520, rot: 3 }),
      WHOOSH('Villas'), WHOOSH('Viñas'), WHOOSH('Cocina'), WHOOSH('Termas'), WHOOSH('volcanes'), WHOOSH('cielos'),
      TAG('Diez', '🎬 10 muestras de concepto', { y: 560, tone: 'gold', size: 52 }),
      HIT('tres', { sfx: 'ding', shake: 8, vol: 0.5 }),
      TAG('reales', '✅ 3 sitios reales en el aire', { y: 300, tone: 'gold', size: 52 }),
      TAG('Si#2', '¿El suyo es el próximo? 👀', { y: 330, rot: -3 }),
      ...END('síganos'),
    ],
    cta: { title: 'La próxima <em>función</em> ya viene', checks: ['Lugares reales', 'Muestras de concepto', 'Del Caribe al sur'], button: 'Seguir @redvaeru 🎬', note: 'redvaeru.netlify.app · Diseño web para la hospitalidad' },
  },
  V02E: {
    file: 'V02_primero-el-trailer', slug: 'V02', coverAt: 3.2, musicVol: 0.32,
    hi: ['tráiler', 'verla', 'revés', 'portada', 'nada', 'gratis', '@redvaeru'],
    shots: [
      { at: 0, type: 'kinetic', bg: { clip: 'rv-funcion', t: 12.5 } },
      H('por', 'rv-funcion', 8, '¿Pagar una web<br>antes de <em>verla?</em> 🤔', 118),
      B('En#2', 'rv-apertura', { from: 1.5, speed: 1, trans: 'zoom', ...FULL, z: 1.12 }),
      { at: 'Primero#2', clip: 'sv-trailer', from: 2, speed: 0.55, trans: 'whip', push: 0.03, cam: [{ x: 540, y: 900, z: 1.02 }, { at: 'historia', x: 540, y: 960, z: 1.0 }] },
      H('Si', 'sv-trailer', 6, 'Si no le convence,<br><em>no paga nada.</em>', 124),
      B('gusta', 'sv-rodaje', { from: 1, speed: 0.95, trans: 'whip', ...FULL, z: 1.06 }),
      { at: 'Ya', clip: 'sv-revision', from: 0.5, speed: 1, trans: 'zoom', push: 0.03, cam: [{ x: 540, y: 900, z: 1.02 }, { at: 'revisamos', x: 540, y: 1500, z: 1.04, dur: 0.6 }] },
      { at: 'Síganos', type: 'cta', capY: 1700 },
    ],
    fx: [
      HIT('por', { sfx: 'impact', shake: 12, vol: 0.5 }),
      TAG('revés', '🔄 Aquí es al revés', { y: 330, tone: 'gold', size: 58 }),
      { at: 'Primero#2', flash: 0.4, sfx: 'whoosh', vol: 0.4 },
      TAG('portada', '🎬 Portada sin costo', { y: 300, tone: 'gold', size: 54 }),
      HIT('Si', { sfx: 'ding', shake: 8, vol: 0.55 }),
      TAG('firmamos', '✍️ Recién ahí, contrato', { y: 330, rot: -3, size: 54 }),
      TAG('gratis', '🎁 Revisión gratis', { y: 330, tone: 'gold', size: 56 }),
      TAG('tres', '✅ 3 mejoras · 24 h hábiles', { y: 560, rot: 3, size: 46 }),
      ...END('Síganos'),
    ],
    cta: { title: 'Síganos en <em>@redvaeru</em>', checks: ['Portada sin costo', 'Revisión gratis', 'Todo con contrato'], button: 'Seguir @redvaeru 🎬', note: 'redvaeru.netlify.app · Diseño web para la hospitalidad' },
  },
  // Juego «¿Cuál es la real?»: pide comentar un número (conversación) y premia ver hasta el final (la respuesta).
  V03E: {
    file: 'V03_cual-es-la-real', slug: 'V03', coverAt: 1.4, musicVol: 0.32,
    hi: ['real', 'inventamos', 'reales', 'inventados', 'número', '@redvaeru'],
    shots: [
      { at: 0, type: 'stack', bg: ST('termas-rayenko_h'), trans: 'zoom', cards: [
        { src: ST('villa-coral-samana_h'), cap: '1', x: 300, y: 560, w: 460, h: 640 }, { src: ST('vina-los-robles_h'), cap: '2', x: 780, y: 620, w: 460, h: 640 },
        { src: ST('miah_h'), cap: '3', x: 300, y: 1260, w: 460, h: 640 }, { src: ST('termas-rayenko_h'), cap: '4', x: 780, y: 1320, w: 460, h: 640 }] },
      H('Cuál', 'rv-funcion', 12.5, '¿Cuál es<br><em>la real?</em> 👀', 132),
      B('Uno', 'villa-coral-samana', { from: 3.2, speed: 1, trans: 'whip', ...FULL, z: 1.04 }),
      B('Dos', 'vina-los-robles', { from: 3.2, speed: 1, trans: 'whip', ...FULL, z: 1.04 }),
      B('Tres#2', 'miah', { from: 0.3, speed: 1, trans: 'whip', ...FULL, z: 1.04 }),
      B('Cuatro#2', 'termas-rayenko', { from: 3.2, speed: 1, trans: 'whip', ...FULL, z: 1.04 }),
      H('Pause', 'rv-funcion', 8, '⏸️ Pause y comente:<br><em>¿1, 2, 3 o 4?</em>', 112),
      B('Es#3', 'miah-galeria', { from: 0.5, speed: 0.8, trans: 'zoom', ...FULL, z: 1.06 }),
      B('Nicol', 'miah', { from: 8.2, speed: 0.3, trans: 'whip', ...FULL, z: 1.04 }),
      { at: 'Las#3', type: 'stack', bg: ST('vina-los-robles_b'), trans: 'whip', label: 'Muestras de concepto · negocios ficticios diseñados por Red Vaeru', cards: [
        { src: ST('villa-coral-samana_b'), cap: 'Ficción', y: 760 }, { src: ST('vina-los-robles_b'), cap: 'Ficción', y: 900 }, { src: ST('termas-rayenko_b'), cap: 'Ficción', y: 1040 }] },
      B('Si', 'rv-estreno', { from: 0.5, speed: 0.6, trans: 'zoom', ...FULL, z: 1.08 }),
      { at: 'Síganos', type: 'cta', capY: 1700 },
    ],
    fx: [
      TAG('Una', '🔍 Solo 1 es real', { y: 250, tone: 'gold', size: 60 }),
      HIT('real', { sfx: 'impact', shake: 10, vol: 0.45 }),
      TAG('inventamos', '🎭 3 son inventadas', { y: 1760, rot: 3, size: 52 }),
      HIT('Cuál', { sfx: 'ding', shake: 8, vol: 0.5 }),
      N('Uno', 1, 'Samaná 🇩🇴', 'Dos'), N('Dos', 2, 'Colchagua 🍷', 'Tres#2'), N('Tres#2', 3, 'Curacautín 🌲', 'Cuatro#2'), N('Cuatro#2', 4, 'Liquiñe ♨️', 'Pause'),
      HIT('Pause', { sfx: 'click', shake: 6, vol: 0.8 }),
      HIT('Es#3', { sfx: 'ding', shake: 14, vol: 0.6 }),
      TAG('Cabañas#2', '✅ La real: la 3', { y: 300, tone: 'gold', size: 60 }),
      TAG('Nicol', '❤️ Nicol y Deiby · anfitriones reales', { y: 330, rot: -3, size: 46 }),
      TAG('lugares', '📍 Lugares reales', { y: 300, rot: -3, size: 52 }), TAG('negocios', '🎭 Negocios inventados', { y: 420, rot: 3, size: 52 }),
      TAG('lugar', '¿El suyo es el próximo? 👀', { y: 330, tone: 'gold', size: 54 }),
      ...END('Síganos'),
    ],
    cta: { title: 'Síganos en <em>@redvaeru</em>', checks: ['Lugares reales', 'Webs que se sienten de verdad', 'Del Caribe al sur de Chile'], button: 'Seguir @redvaeru 🎬', note: 'redvaeru.netlify.app · Diseño web para la hospitalidad' },
  },
};

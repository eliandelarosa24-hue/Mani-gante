// Las obras de Red Vaeru como escenas, en orden de latitud: del paralelo 19 Norte (Samaná) al 41 Sur (Frutillar).
// Cada una: cada muestra con su foto de portada, su titular real
// escrito en su propia tipografía y los datos de su caso. Lo usan la portada (cine), Trabajos y cada caso.
import { CASES } from '../samples/cases.js';
import { SHOWCASE } from '../samples/showcase.js';

const BASE = [
  {
    slug: 'villa-coral-samana', lat: 19.32, coords: '19°19′ N 69°32′ O', town: 'Las Terrenas, Samaná', name: 'Villa Coral Samaná', kind: 'Villas frente al mar', place: 'Las Terrenas · República Dominicana', img: 'hero',
    title: 'Cinco villas,<br><em>un solo mar.</em>',
    faces: [{ family: 'Gloock', axes: '' }],
    type: { family: "'Gloock Escena', Georgia, serif", weight: 400, size: 0.94, tracking: '-0.02em', lh: 0.96 },
    em: 'display:inline-block;font-style:normal;color:#fff;transform:rotate(-3deg);text-shadow:.04em .04em 0 #ff6b57,.08em .08em 0 #f2b33d,.12em .12em 0 #5fd3c8',
    tone: 'light', accent: '#ff6b57',
  },
  {
    slug: 'vina-los-robles', lat: -34.63, coords: '34°38′ S 71°22′ O', town: 'Santa Cruz, Colchagua', name: 'Viña Los Robles', kind: 'Enoturismo', place: 'Santa Cruz · Colchagua', img: 'hero',
    title: 'Tres generaciones<br><em>en cada copa.</em>',
    faces: [{ family: 'Cormorant Garamond', axes: 'ital,wght@0,300;1,300' }],
    type: { family: "'Cormorant Garamond Escena', Georgia, serif", weight: 300, size: 1, tracking: '-0.01em', lh: 0.95 },
    em: 'font-style:italic;color:#c9a66b',
    tone: 'dark', accent: '#c9a66b',
  },
  {
    slug: 'fogon-mapu', lat: -38.73, coords: '38°44′ S 72°36′ O', town: 'Temuco', name: 'Fogón Mapu', kind: 'Cocina mapuche contemporánea', place: 'Temuco · Araucanía', img: 'hero',
    title: 'El fuego es<br><em>nuestra memoria.</em>',
    faces: [{ family: 'Fraunces', axes: 'ital,opsz,wght@0,144,300;1,144,300' }],
    type: { family: "'Fraunces Escena', Georgia, serif", weight: 300, size: 0.98, tracking: '-0.035em', lh: 0.95 },
    em: 'font-style:italic;color:#ffb65c',
    tone: 'dark', accent: '#ff7a2f',
  },
  {
    slug: 'estudio-haber', lat: -38.74, coords: '38°44′ S 72°36′ O', town: 'Temuco', name: 'Estudio Haber', kind: 'Estudio contable', place: 'Temuco · Araucanía', img: 'hero',
    title: 'De la caja de zapatos<br>al <em>balance.</em>',
    faces: [{ family: 'Newsreader', axes: 'ital,opsz,wght@0,72,300;1,72,400' }],
    type: { family: "'Newsreader Escena', Georgia, serif", weight: 300, size: 0.84, tracking: '-0.035em', lh: 0.92 },
    em: 'font-style:italic;font-weight:400;color:#bfe3cf',
    tone: 'dark', accent: '#1f5a45',
  },
  {
    slug: 'cabanas-lago-azul', lat: -39.28, coords: '39°17′ S 72°14′ O', town: 'Villarrica', name: 'Cabañas Lago Azul', kind: 'Cabañas a orillas del lago', place: 'Villarrica · Araucanía', img: 'hero',
    title: 'Seis casas<br>junto al <em>agua.</em>',
    faces: [{ family: 'Newsreader', axes: 'ital,opsz,wght@0,72,200;1,72,300' }],
    type: { family: "'Newsreader Escena', Georgia, serif", weight: 200, size: 1.12, tracking: '-0.05em', lh: 0.86 },
    em: 'font-style:italic;font-weight:300',
    tone: 'dark', accent: '#9fc6d4',
  },
  {
    slug: 'pucon-aventura', lat: -39.27, coords: '39°16′ S 71°58′ O', town: 'Pucón', name: 'Pucón Aventura', kind: 'Turismo aventura', place: 'Pucón · Araucanía', img: 'tour-1',
    title: 'Suba un<br><em>volcán</em><br>activo.',
    faces: [{ family: 'Archivo', axes: 'wdth,wght@62,900' }],
    type: { family: "'Archivo Escena', 'Arial Narrow', sans-serif", weight: 900, size: 1.18, tracking: '-0.01em', lh: 0.82, upper: true, stretch: '62%' },
    em: 'font-style:normal;background:linear-gradient(180deg,#ffd27a 0%,#ff7a2f 35%,#ff5b2e 65%,#b8260b 100%);-webkit-background-clip:text;background-clip:text;color:transparent',
    tone: 'dark', accent: '#ff5b2e',
  },
  {
    slug: 'domos-cielo-austral', lat: -39.35, coords: '39°21′ S 71°35′ O', town: 'Curarrehue', name: 'Domos Cielo Austral', kind: 'Glamping de astroturismo', place: 'Curarrehue · Araucanía', img: 'unidad-1',
    title: 'Duerma bajo<br><em>la Vía Láctea</em>',
    faces: [{ family: 'Syne', axes: 'wght@800' }, { family: 'Instrument Serif', axes: 'ital@0;1' }],
    type: { family: "'Syne Escena', sans-serif", weight: 800, size: 0.86, tracking: '-0.045em', lh: 0.95, upper: true },
    em: "font-family:'Instrument Serif Escena',serif;font-style:italic;font-weight:400;text-transform:none;letter-spacing:-0.02em;font-size:1.08em;background:linear-gradient(100deg,#fff,#b9a2ff 55%,#8fe3ff);-webkit-background-clip:text;background-clip:text;color:transparent",
    tone: 'dark', accent: '#b9a2ff',
  },
  {
    slug: 'termas-rayenko', lat: -39.73, coords: '39°44′ S 71°51′ O', town: 'Liquiñe', name: 'Termas Rayenko', kind: 'Termas de montaña', place: 'Liquiñe · Los Ríos', img: 'hero',
    title: 'Siete pozones,<br><em>siete temperaturas.</em>',
    faces: [{ family: 'Instrument Serif', axes: 'ital@0;1' }],
    type: { family: "'Instrument Serif Escena', Georgia, serif", weight: 400, size: 1, tracking: '-0.02em', lh: 0.92 },
    em: 'font-style:italic',
    tone: 'dark', accent: '#8ec9c0',
  },
  {
    slug: 'hotel-casa-nogal', lat: -39.82, coords: '39°49′ S 73°15′ O', town: 'Valdivia', name: 'Hotel Casa Nogal', kind: 'Hotel boutique patrimonial', place: 'Valdivia · Los Ríos', img: 'hero',
    title: 'Historia<br>que se <em>habita.</em>',
    faces: [{ family: 'Bodoni Moda', axes: 'ital,wght@0,400;1,400' }],
    type: { family: "'Bodoni Moda Escena', Didot, Georgia, serif", weight: 400, size: 1.04, tracking: '-0.02em', lh: 0.9 },
    em: 'font-style:italic;color:#d9b77a',
    tone: 'dark', accent: '#b08d4e',
  },
  {
    slug: 'kuchen-haus-frutillar', lat: -41.13, coords: '41°08′ S 73°03′ O', town: 'Frutillar', name: 'Kuchen Haus', kind: 'Café y pastelería alemana', place: 'Frutillar · Los Lagos', img: 'horno',
    title: 'El kuchen de<br><em>la abuela Ilse.</em>',
    faces: [{ family: 'Young Serif', axes: '' }],
    type: { family: "'Young Serif Escena', Georgia, serif", weight: 400, size: 0.92, tracking: '-0.02em', lh: 0.98 },
    em: 'font-style:normal;color:#ffb4c0',
    tone: 'dark', accent: '#c2475a',
  },
];

// Cuatro fotos de cada sitio para la galería de su caso
const GALLERY = {'termas-rayenko': ['pozon-noche', 'pasarela', 'sauna', 'volcan'], 'villa-coral-samana': ['villa-larimar', 'piscina', 'ballena', 'pescadores'], 'domos-cielo-austral': ['unidad-2', 'g4', 'g5', 'g6'], 'hotel-casa-nogal': ['lluvia', 'escalera', 'llaves', 'hab-torreon'], 'pucon-aventura': ['card', 'tour-3', 'guias', 'tour-5'], 'fogon-mapu': ['tiempo-3', 'salon', 'chef', 'comunidad-2'], 'cabanas-lago-azul': ['cab-muelle', 'kayak', 'tinaja', 'niebla'], 'vina-los-robles': ['cosecha', 'cava', 'cata', 'bici'], 'kuchen-haus-frutillar': ['vitrina', 'k-frambuesa', 'manos', 'lago'], 'estudio-haber': ['libro', 'sello', 'reunion', 'temuco']};

export const SCENES = BASE.map((s, i) => ({
  ...s,
  n: String(i + 1).padStart(2, '0'),
  image: `/muestras/${s.slug}/img/${s.img}.webp`,
  site: { d: `/video/sitio/${s.slug}-d`, m: `/video/sitio/${s.slug}-m` },
  sample: `/muestras/${s.slug}/`,
  case: `/trabajos/${s.slug}/`,
  ...CASES[s.slug],
  features: SHOWCASE[s.slug] || [],
  gallery: (GALLERY[s.slug] || []).map((g) => `/muestras/${s.slug}/img/${g}.webp`),
}));

// Proyectos reales de clientes, en el aire.
export const REAL = [
  { slug: 'miah', lat: -38.43, coords: '38°26′ S 71°53′ O', town: 'Curacautín', label: 'Cliente real', name: 'Cabañas Miah y Noah', kind: 'Cabañas', place: 'Curacautín · Araucanía', url: 'https://cabanasmiaynoah.netlify.app', image: '/img/casos/miah-d.webp', mobile: '/img/casos/miah-m.webp', video: '/video/real-miah', quote: 'Nos ayudó a tener por fin un sitio propio para Cabañas Miah y Noah. Ahora nuestros huéspedes nos encuentran y reservan directo.', by: 'Nicole, coanfitriona' },
  { slug: 'poetas', lat: -38.74, coords: '38°44′ S 72°57′ O', town: 'Nueva Imperial', label: 'Cliente real', name: 'El Rincón de los Poetas', kind: 'Hostal', place: 'Almagro, Nueva Imperial · Araucanía', url: 'https://elrincondelospoetas.netlify.app', image: '/img/casos/poetas-d.webp', mobile: '/img/casos/poetas-m.webp', video: '/video/real-poetas', note: 'Un hostal con historia literaria, contada en su propio sitio y con reserva directa.' },
  { slug: 'manigante', lat: -38.74, coords: '38°44′ S 72°36′ O', town: 'Temuco', label: 'Producción propia', name: 'MANI-GANTE', kind: 'Confitería de autor', place: 'Temuco · Araucanía', url: 'https://manigante.netlify.app', image: '/img/casos/manigante.webp', note: 'La confitería de autor que fundó nuestro director en Temuco. Ahí probamos primero lo que le proponemos a usted.' },
];

// La carta como un libro de papel: en computador se ven dos páginas y las hojas giran en 3D;
// en el celular se ve una página a la vez y se pasa tocando o deslizando.
const $ = (s, r = document) => r.querySelector(s);
const fmt = (n) => '$' + n.toLocaleString('es-CL');

const KULTRUN = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/><path d="M20 3v34M3 20h34"/><circle cx="11" cy="11" r="2.5"/><circle cx="29" cy="29" r="2.5"/></svg>';
const PAGES = [
  { label: 'Portada', html: `<div class="page--cover-in">${KULTRUN}<h3>Iyael</h3><p>La carta · Fogón Mapu</p></div>`, cover: true },
  { label: 'Para compartir', kicker: 'I · Al centro de la mesa', items: [['Sopaipillas de zapallo', 'Con chancho en piedra y merkén ahumado.', 6900, 'Vegana'], ['Catuto con miel de ulmo', 'Pan de trigo mote al rescoldo.', 5900], ['Digüeñes salteados', 'Mantequilla de campo y ajo chilote.', 8900, 'Temporada'], ['Tabla del Wallmapu', 'Quesos de cabra, charqui de caballo y pebre.', 12900]] },
  { label: 'Del fogón', kicker: 'II · Cocinado a la leña', items: [['Cordero al rescoldo', '12 horas en tierra, puré de piñón.', 19900], ['Trucha del lago', 'En hoja de nalca, ensalada de quínoa.', 16900, 'Sin gluten'], ['Charquicán de changles', 'Hongos silvestres, huevo de campo.', 13900, 'Vegetariano'], ['Costillar al humo de roble', 'Papas nativas y chancho en piedra.', 17900]] },
  { label: 'Dulces', kicker: 'III · Para terminar', items: [['Mote con huesillo de maqui', 'Nuestra versión invernal.', 5500], ['Murta con crema de cabra', 'Del valle de Purén.', 6200], ['Kuchen de piñón y miel', 'Tibio, con helado de leche asada.', 5900], ['Sopaipilla pasada', 'En chancaca con cáscara de naranja.', 4900, 'Vegana']] },
  { label: 'Bebidas', kicker: 'IV · De la tierra y del lagar', items: [['Muday', 'Bebida ancestral de maíz fermentado.', 3900], ['Vino pipeño', 'Del valle del Itata, en jarra.', 9900], ['Mudai de maqui sin alcohol', 'Fermento de la casa.', 3500, 'Sin alcohol'], ['Té de canelo y menta', 'Infusión de la huerta.', 2900]] },
  { label: 'Notas', html: '<p>Menú vegetariano completo disponible. Informe sus alergias al reservar: cocinamos cada plato al momento.</p><p>Los productos cambian con la estación; si algo no llegó del campo, se lo diremos en la mesa.</p><p class="sig">Rayén Ancamil</p>', end: true },
];

function pageHTML(p, i) {
  if (p.cover) return `<div class="page page--cover">${p.html}</div>`;
  const body = p.html || `<p class="pk">${p.kicker}</p><h3>${p.label}</h3><ul>${p.items.map(([n, d, pr, tag]) => `<li><b>${n}</b><strong>${fmt(pr)}</strong><span>${d}</span>${tag ? `<small>${tag}</small>` : ''}</li>`).join('')}</ul>`;
  return `<div class="page${p.end ? ' page--end' : ''}">${body}<span class="num">${i}</span></div>`;
}

export function initBook() {
  const book = $('[data-book]');
  if (!book) return;
  const stage = $('[data-book-stage]', book), label = $('[data-book-page]', book);
  const prev = $('[data-book-prev]', book), next = $('[data-book-next]', book);
  const mq = matchMedia('(max-width: 900px)');
  let single = mq.matches, leaves = [], flipped = 0, swiped = false;

  function build() {
    single = mq.matches;
    book.classList.toggle('is-single', single);
    flipped = 0;
    if (single) {
      stage.innerHTML = PAGES.map((p, i) => `<div class="leaf">${pageHTML(p, i)}</div>`).join('');
    } else {
      const html = [];
      for (let i = 0; i < PAGES.length; i += 2) {
        const back = PAGES[i + 1] ? pageHTML(PAGES[i + 1], i + 1).replace('class="page', 'class="page page--back') : '<div class="page page--back"></div>';
        html.push(`<div class="leaf">${pageHTML(PAGES[i], i)}${back}</div>`);
      }
      stage.innerHTML = html.join('');
    }
    leaves = [...stage.children];
    leaves.forEach((l) => l.addEventListener('click', () => { if (swiped) { swiped = false; return; } l.classList.contains('is-flipped') ? go(-1) : go(1); }));
    paint();
  }
  const max = () => (single ? leaves.length - 1 : leaves.length);
  function paint() {
    leaves.forEach((l, i) => {
      const f = i < flipped;
      l.classList.toggle('is-flipped', f);
      l.style.zIndex = f ? i + 1 : leaves.length - i + 1;
    });
    if (single) label.textContent = PAGES[flipped].label;
    else label.textContent = flipped === 0 ? 'Portada' : [PAGES[flipped * 2 - 1], PAGES[flipped * 2]].filter(Boolean).map((p) => p.label).join(' · ');
    prev.disabled = flipped === 0;
    next.disabled = flipped >= max();
  }
  function go(d) {
    const n = Math.max(0, Math.min(max(), flipped + d));
    if (n === flipped) return;
    // La hoja que se mueve queda encima mientras gira
    const moving = d > 0 ? leaves[flipped] : leaves[n];
    moving.style.zIndex = 99;
    flipped = n;
    leaves.forEach((l, i) => l.classList.toggle('is-flipped', i < flipped));
    setTimeout(paint, 550);
    prev.disabled = flipped === 0; next.disabled = flipped >= max();
  }
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  book.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
  let sx = null;
  stage.addEventListener('pointerdown', (e) => (sx = e.clientX));
  stage.addEventListener('pointerup', (e) => { if (sx != null && Math.abs(e.clientX - sx) > 40) { swiped = true; go(e.clientX < sx ? 1 : -1); setTimeout(() => (swiped = false), 50); } sx = null; });
  mq.addEventListener('change', build);
  build();
}

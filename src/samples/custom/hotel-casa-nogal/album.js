// El álbum de la casa: un libro de tapas de cuero cuyas hojas se dan vuelta en 3D. Cada hoja
// tiene anverso (página derecha) y reverso (página izquierda al pasarla). En pantallas angostas
// el mismo álbum se recorre como una tira de páginas.
export const PAGES = [
  { cover: true },
  { text: ['Álbum de la casa', 'Lo encontramos en el altillo del torreón durante la restauración, con doce fotografías de los Schüler. Seguimos pegando las nuestras.', 'Isla Teja, 1910 –'] },
  { ph: 'archivo', cap: 'La casa recién terminada', d: 'Marzo de 1910' },
  { ph: 'hero', cap: 'La misma casa, una noche de lluvia', d: 'Junio de 2024' },
  { ph: 'escalera', cap: 'La escalera y los vitrales de Múnich', d: '1911 · restaurada en 2021' },
  { ph: 'rio', cap: 'El muelle y el Calle-Calle', d: 'Mayo de 2023' },
  { ph: 'hab-clasica', cap: 'Nº 1 · Collico', d: 'Clásica · vista al jardín' },
  { ph: 'hab-rio', cap: 'Nº 3 · Calle-Calle', d: 'Superior Río · chimenea' },
  { ph: 'hab-suite', cap: 'Nº 5 · Biblioteca', d: 'Suite · tina de patas' },
  { ph: 'hab-torreon', cap: 'Nº 12 · Donde estaba el estanque', d: 'Torreón · hoy, rincón de lectura' },
  { ph: 'restaurante', cap: 'El comedor, antigua sala de música', d: 'Restaurante Nogal' },
  { ph: 'merluza', cap: 'Merluza austral', d: 'Carta de invierno' },
  { ph: 'kuchen', cap: 'Kuchen de murta, 17:00', d: 'Kaffee und Kuchen' },
  { ph: 'desayuno', cap: 'Desayuno a la cama', d: 'Todos los días, hasta las 11' },
  { text: ['', 'Las páginas que siguen las escribe usted.', ''] },
  { back: true },
];

function face(p, photo) {
  if (p.cover) return `<div class="pg pg--cover"><svg viewBox="0 0 120 150" aria-hidden="true"><use href="#mono" /></svg><b>Casa Nogal</b><span>Álbum · 1910</span></div>`;
  if (p.back) return '<div class="pg pg--back"><span>Valdivia</span></div>';
  if (p.text) return `<div class="pg pg--text"><b>${p.text[0]}</b><p>${p.text[1]}</p><span>${p.text[2]}</span></div>`;
  return `<div class="pg pg--ph"><figure><div class="pg__ph" data-ph="${p.ph}" style="${photo(p.ph)}"></div><i></i><i></i><i></i><i></i></figure><p class="pg__cap">${p.cap}</p><p class="pg__d">${p.d}</p></div>`;
}

export function initAlbum({ bookEl, stripEl, ctl, photo, onPhoto, reduced }) {
  const n = PAGES.length / 2;
  bookEl.insertAdjacentHTML('beforeend', Array.from({ length: n }, (_, i) => `
    <div class="leaf" data-leaf="${i}">
      <div class="leaf__f">${face(PAGES[2 * i], photo)}</div>
      <div class="leaf__b">${face(PAGES[2 * i + 1], photo)}</div>
    </div>`).join(''));
  stripEl.innerHTML = PAGES.filter((p) => p.ph).map((p) => face(p, photo)).join('');
  const leaves = [...bookEl.querySelectorAll('.leaf')];
  let cur = 0; // hojas ya pasadas
  const label = () => (cur === 0 ? 'Tapa' : cur === n ? 'Contratapa' : `Páginas ${cur * 2 - 1}–${cur * 2}`);
  function paint(moving) {
    leaves.forEach((l, i) => {
      const flipped = i < cur;
      l.classList.toggle('is-flipped', flipped);
      l.style.zIndex = i === moving ? 100 : flipped ? 10 + i : 10 + n - i;
    });
    bookEl.dataset.state = cur === 0 ? 'closed' : cur === n ? 'end' : 'open';
    ctl.n.textContent = label();
    ctl.prev.disabled = cur === 0; ctl.next.disabled = cur === n;
  }
  const go = (d) => {
    const to = Math.max(0, Math.min(n, cur + d)); if (to === cur) return;
    const moving = d > 0 ? cur : cur - 1;
    cur = to; paint(moving);
    setTimeout(() => paint(-1), reduced ? 0 : 900);
  };
  paint(-1);
  ctl.next.addEventListener('click', () => go(1));
  ctl.prev.addEventListener('click', () => go(-1));
  bookEl.addEventListener('click', (e) => {
    const ph = e.target.closest('.pg__ph');
    const r = bookEl.getBoundingClientRect(), right = e.clientX > r.left + r.width / 2;
    if (ph && e.detail === 2) return onPhoto(ph);
    go(right ? 1 : -1);
  });
  bookEl.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
  stripEl.addEventListener('click', (e) => { const ph = e.target.closest('.pg__ph'); if (ph) onPhoto(ph); });
  // Al llegar a la sección, el álbum se abre solo
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); setTimeout(() => cur === 0 && go(1), 700); } }, { threshold: 0.45 }).observe(bookEl);
}

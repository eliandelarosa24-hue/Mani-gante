// Fachadas: cada casa tiene su silueta (8 vértices, en % de la foto 16:9) que se abre hasta el
// rectángulo completo de la fotografía, y un dibujo de detalle (ventanas, pilotes, terrazas).
// Las medidas reales (w × h en metros) permiten compararlas a la misma escala.
const R8 = { gable: [[0, 100], [0, 0], [50, 0], [100, 0], [100, 100], [100, 100], [0, 100], [0, 100]] };
export const SHAPES = {
  muelle: { w: 12, h: 4.4, poly: [[16, 88], [16, 46], [8, 46], [8, 40], [90, 40], [90, 46], [84, 46], [84, 88]],
    rect: [[0, 100], [0, 0], [0, 0], [0, 0], [100, 0], [100, 0], [100, 0], [100, 100]],
    det: 'M24 52 H76 V84 H24 Z M50 52 V84 M4 88 H98 M8 88 V94 M30 88 V94 M70 88 V94 M94 88 V94' },
  bosque: { w: 9, h: 7.6, poly: [[30, 90], [30, 42], [50, 14], [70, 42], [70, 90], [70, 90], [30, 90], [30, 90]], rect: R8.gable,
    det: 'M30 62 H70 M36 70 H48 V86 H36 Z M54 70 H64 V90 M36 46 H64 V58 H36 Z M50 46 V58 M66 30 V20 H70 V36' },
  arrayan: { w: 6, h: 4, poly: [[34, 88], [34, 30], [66, 30], [66, 30], [66, 88], [66, 88], [34, 88], [34, 88]], rect: [[0, 100], [0, 0], [100, 0], [100, 0], [100, 100], [100, 100], [0, 100], [0, 100]],
    det: 'M38 36 H58 V84 H38 Z M48 36 V84 M30 88 H70' },
  mirador: { w: 9.5, h: 6.2, poly: [[22, 74], [22, 30], [80, 20], [80, 20], [80, 74], [80, 74], [22, 74], [22, 74]], rect: [[0, 100], [0, 0], [100, 0], [100, 0], [100, 100], [100, 100], [0, 100], [0, 100]],
    det: 'M52 34 H78 V70 H52 Z M65 34 V70 M22 74 H96 M28 74 V94 M44 74 V94 M60 74 V94 M76 74 V94 M92 74 V94 M84 66 H96 V74 H84 Z' },
  playa: { w: 8, h: 6.6, poly: [[30, 90], [30, 22], [66, 36], [66, 36], [66, 90], [66, 90], [30, 90], [30, 90]], rect: [[0, 100], [0, 0], [100, 0], [100, 0], [100, 100], [100, 100], [0, 100], [0, 100]],
    det: 'M36 46 H56 V90 H36 Z M46 46 V90 M70 92 Q76 88 82 92 Q76 95 70 92 M84 94 Q90 90 96 94 Q90 97 84 94 M10 94 H98' },
  refugio: { w: 6, h: 5.8, poly: [[32, 88], [32, 48], [50, 20], [68, 48], [68, 88], [68, 88], [32, 88], [32, 88]], rect: R8.gable,
    det: 'M38 52 L50 32 L62 52 Z M38 52 H62 V88 H38 Z M50 52 V88 M62 28 V18 M62 16 q4 -4 2 -8 q-2 -4 3 -8' },
};
const poly = (pts) => `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})`;

export function houseRow(c, photoStyle, plan) {
  const s = SHAPES[c.id];
  return `
  <article class="house" data-id="${c.id}" tabindex="0" role="button" aria-label="Abrir la ficha de la casa ${c.n}">
    <div class="house__fig" style="--from:${poly(s.poly)};--to:${poly(s.rect)}">
      <div class="house__ph" style="${photoStyle}"></div>
      <svg class="house__draw" viewBox="0 0 160 90" aria-hidden="true"><g transform="scale(1.6 0.9)">
        <polygon points="${s.poly.map((p) => p.join(',')).join(' ')}" pathLength="1" />
        <path d="${s.det}" pathLength="1" />
      </g></svg>
      <span class="house__free" data-free="${c.id}"></span>
      <div class="house__plan">${plan}</div>
    </div>
    <div class="house__tx">
      <p class="house__n">${c.no}<span>/06</span></p>
      <h3>${c.n}</h3>
      <p class="house__line">${c.line}</p>
      <dl class="house__spec"><div><dt>Personas</dt><dd>${c.paxTxt}</dd></div><div><dt>Superficie</dt><dd>${c.m2} m²</dd></div><div><dt>Al agua</dt><dd>${c.agua} m</dd></div><div><dt>Desde</dt><dd>$${c.price.toLocaleString('es-CL')}</dd></div></dl>
      <span class="house__open">Abrir ficha <i aria-hidden="true">→</i></span>
    </div>
  </article>`;
}

// Fachada a escala real para el comparador: la silueta se normaliza a su ancho y alto en metros
export function elevationSVG(a, b) {
  const PX = 26, base = 230, gap = 3;
  const draw = (c, x0, cls) => {
    const s = SHAPES[c.id];
    const xs = s.poly.map((p) => p[0]), ys = s.poly.map((p) => p[1]);
    const [mx, Mx, my, My] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const pts = s.poly.map(([x, y]) => [x0 + ((x - mx) / (Mx - mx)) * s.w * PX, base - ((My - y) / (My - my)) * s.h * PX]);
    return `<g class="ev ${cls}"><polygon points="${pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')}" /><text x="${(x0 + (s.w * PX) / 2).toFixed(1)}" y="${base + 22}">${c.n} · ${s.w} × ${s.h} m</text></g>`;
  };
  const wa = SHAPES[a.id].w * PX, wb = SHAPES[b.id].w * PX;
  const total = wa + wb + gap * PX + 60;
  const x0 = (760 - total) / 2;
  const person = `<g class="ev__p" transform="translate(${(x0 + wa + (gap * PX) / 2).toFixed(1)} ${base})"><circle cy="${-1.62 * PX}" r="${0.13 * PX}"/><path d="M0 ${-1.48 * PX} V${-0.8 * PX} M0 ${-0.8 * PX} L${-0.18 * PX} 0 M0 ${-0.8 * PX} L${0.18 * PX} 0 M${-0.3 * PX} ${-1.2 * PX} L0 ${-1.36 * PX} L${0.3 * PX} ${-1.2 * PX}"/><text y="${-1.9 * PX}">1,75 m</text></g>`;
  const grid = Array.from({ length: 9 }, (_, i) => `<path class="ev__g" d="M0 ${base - i * PX} H760"/><text class="ev__gm" x="4" y="${base - i * PX - 3}">${i} m</text>`).join('');
  return `<svg viewBox="0 0 760 270" class="ev__svg" role="img" aria-label="Fachadas de ${a.n} y ${b.n} a la misma escala">${grid}<path class="ev__ground" d="M0 ${base} H760"/>${draw(a, x0, 'ev--a')}${person}${draw(b, x0 + wa + gap * PX, 'ev--b')}</svg>`;
}

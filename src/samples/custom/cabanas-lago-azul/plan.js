// Dibuja el plano de una cabaña como SVG: muros, espacios, mobiliario, terrazas achuradas,
// norte, escala gráfica y la orilla del lago a la derecha.
const r1 = (n) => Math.round(n * 10) / 10;

// Mobiliario en coordenadas locales (centrado en 0,0) con su tamaño para poder escalarlo.
const FUR = {
  bed2: [24, 28, '<rect x="-12" y="-14" width="24" height="28" rx="1"/><rect x="-10" y="-12" width="9" height="5" rx="1"/><rect x="1" y="-12" width="9" height="5" rx="1"/><path d="M-12 -3 H12"/>'],
  bed1: [12, 26, '<rect x="-6" y="-13" width="12" height="26" rx="1"/><rect x="-4" y="-11" width="8" height="4" rx="1"/><path d="M-6 -4 H6"/>'],
  sofa: [30, 20, '<path d="M-15 -10 H15 V-2 H-6 V10 H-15 Z"/><rect x="-2" y="2" width="12" height="7" rx="1"/>'],
  table: [24, 18, '<rect x="-9" y="-5" width="18" height="10" rx="1"/><circle cx="-5" cy="-8" r="2"/><circle cx="5" cy="-8" r="2"/><circle cx="-5" cy="8" r="2"/><circle cx="5" cy="8" r="2"/>'],
  kitchen: [34, 10, '<rect x="-17" y="-5" width="34" height="10"/><circle cx="-8" cy="0" r="2.6"/><circle cx="6" cy="-1.6" r="1.4"/><circle cx="10" cy="-1.6" r="1.4"/><circle cx="6" cy="2" r="1.4"/><circle cx="10" cy="2" r="1.4"/>'],
  bath: [18, 20, '<rect x="-9" y="-10" width="10" height="10"/><path d="M-9 -10 L1 0 M1 -10 L-9 0"/><ellipse cx="5" cy="5" rx="3" ry="4"/><rect x="-8" y="4" width="7" height="5" rx="1"/>'],
  tub: [20, 11, '<rect x="-10" y="-5.5" width="20" height="11" rx="5.5"/><rect x="-8" y="-3.5" width="16" height="7" rx="3.5"/>'],
  fire: [14, 12, '<path d="M-7 -6 H7 V6 H-7 Z"/><path d="M-4 6 Q0 -4 4 6"/>'],
  stairs: [12, 24, '<rect x="-6" y="-12" width="12" height="24"/><path d="M-6 -8 H6 M-6 -4 H6 M-6 0 H6 M-6 4 H6 M-6 8 H6 M0 10 V-10 M-2 -8 L0 -10 L2 -8"/>'],
  grill: [26, 16, '<rect x="-13" y="-4" width="16" height="8"/><path d="M-11 -4 V4 M-8 -4 V4 M-5 -4 V4 M-2 -4 V4"/><circle cx="9" cy="0" r="4"/>'],
  chairs: [26, 16, '<rect x="-13" y="-5" width="10" height="10" rx="1"/><rect x="3" y="-5" width="10" height="10" rx="1"/><circle cx="0" cy="0" r="2.4"/>'],
  hammock: [22, 12, '<path d="M-11 -6 Q0 12 11 -6"/><path d="M-11 -6 Q0 6 11 -6"/>'],
  tinaja: [26, 26, '<circle r="12"/><circle r="10"/><path d="M-3 -2 q3 -2 6 0 M-4 3 q4 -2 8 0"/>'],
  kayak: [12, 34, '<path d="M0 -17 Q6 0 0 17 Q-6 0 0 -17 Z"/><ellipse cx="0" cy="0" rx="2" ry="4"/>'],
};

function furniture(list, [x, y, w, h], hasLabel) {
  if (!list.length) return '';
  const top = y + (hasLabel ? 12 : 4), ah = h - (hasLabel ? 16 : 8);
  const cw = w / list.length;
  return list.map((k, i) => {
    const [fw, fh, body] = FUR[k];
    const s = Math.min(1, (cw - 6) / fw, (ah - 2) / fh);
    if (s <= 0.2) return '';
    const cx = x + cw * i + cw / 2, cy = top + ah / 2;
    return `<g class="fur" transform="translate(${r1(cx)} ${r1(cy)}) scale(${r1(s * 100) / 100})">${body}</g>`;
  }).join('');
}

export function planSVG(c, { labels = true, idPrefix = '' } = {}) {
  const [wx, wy, ww, wh] = c.walls;
  const unit = Math.sqrt(c.m2 / (ww * wh)); // metros por unidad del dibujo
  const bar = 2 / unit;
  const room = (sp, i, kind) => {
    const [x, y, w, h] = sp.r;
    return `<g class="sp" data-sp="${kind}${i}">
      <rect class="${kind === 'e' ? 'ext' : 'room'}" x="${x}" y="${y}" width="${w}" height="${h}" tabindex="${labels ? 0 : -1}" aria-label="${sp.n}"/>
      ${furniture(sp.f, sp.r, labels)}
      ${labels ? `<text x="${x + w / 2}" y="${y + 9}">${sp.l}</text>` : ''}
    </g>`;
  };
  const lakeX = 226;
  let wave = `M${lakeX} 8`;
  for (let yy = 8; yy < 144; yy += 8) wave += ` q5 4 0 8`;
  return `<svg class="plan" viewBox="0 0 248 150" role="img" aria-label="Plano de la cabaña ${c.n}" ${idPrefix ? `id="${idPrefix}${c.id}"` : ''}>
    <path d="${wave}" fill="none" stroke="#3d6b7d" stroke-width="0.8"/>
    <path d="${wave.replace(`M${lakeX}`, `M${lakeX + 7}`)}" fill="none" stroke="#3d6b7d" stroke-width="0.6" opacity=".55"/>
    ${labels ? `<text x="${lakeX + 14}" y="78" class="lake" transform="rotate(90 ${lakeX + 14} 78)">Lago</text>` : ''}
    ${c.ext.map((e, i) => room(e, i, 'e')).join('')}
    ${c.rooms.map((r, i) => room(r, i, 'r')).join('')}
    <rect class="wall" x="${wx}" y="${wy}" width="${ww}" height="${wh}"/>
    ${labels ? `<g class="north" transform="translate(10 136)"><path d="M0 4 L3 -6 L6 4 L3 1 Z" fill="currentColor" stroke="none"/><text x="3" y="-9">N</text></g>
    <g class="scale" transform="translate(${wx} ${wy + wh + 10})"><path d="M0 0 V3 H${r1(bar)} V0 M${r1(bar / 2)} 3 V1" fill="none" stroke="currentColor" stroke-width=".6"/><text x="${r1(bar) + 4}" y="4">2 m</text></g>` : ''}
  </svg>`;
}

// Patrón de achurado para terrazas y espacios exteriores (una sola vez por documento).
export function ensureHatch() {
  if (document.getElementById('hatch')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = '<defs><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#fbfaf7"/><path d="M0 0 V4" stroke="#1d2a30" stroke-width="0.5" opacity=".35"/></pattern></defs>';
  document.body.prepend(svg);
}

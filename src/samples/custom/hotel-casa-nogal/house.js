// La casona en corte: subterráneo con cava, planta baja, primer piso, segundo piso bajo el techo
// y el torreón. Cada espacio es un rectángulo con su ventana; las habitaciones (1–12) abren su
// ficha. Afuera: el nogal de 1910, la lluvia y el río.
export const SPACES = [
  // Planta baja (y 470–600)
  { id: 1, r: [220, 470, 120, 130] }, { id: 'rec', n: 'Recepción', d: 'Atendida las 24 horas. Aquí cuelgan las doce llaves.', r: [340, 470, 120, 130] },
  { id: 'salon', n: 'Salón de la chimenea', d: 'Sillones Chesterfield, la chimenea de 1910 y el piano de la familia Schüler.', r: [460, 470, 150, 130] },
  { id: 'rest', n: 'Restaurante Nogal', d: 'La antigua sala de música. Abierto al público de martes a sábado.', r: [610, 470, 290, 130] },
  { id: 2, r: [900, 470, 140, 130] },
  // Primer piso (y 340–470)
  { id: 3, r: [220, 340, 135, 130] }, { id: 4, r: [355, 340, 135, 130] },
  { id: 'esc', n: 'La escalera', d: 'Roble pellín tallado y los vitrales de Múnich, que dan luz a los tres pisos.', r: [490, 340, 70, 260] },
  { id: 5, r: [560, 340, 200, 130] }, { id: 6, r: [760, 340, 140, 130] }, { id: 7, r: [900, 340, 140, 130] },
  // Segundo piso bajo el techo (y 230–340)
  { id: 8, r: [374, 230, 116, 110] }, { id: 10, r: [490, 230, 160, 110] }, { id: 9, r: [650, 230, 108, 110] }, { id: 11, r: [900, 230, 140, 110] },
  // Torreón
  { id: 12, r: [900, 130, 140, 100] },
  // Subterráneo
  { id: 'cava', n: 'Cava de piedra', d: 'Muros de piedra de 1910. Catas de cerveza del valle a las 19:00.', r: [300, 610, 300, 90] },
  { id: 'bod', n: 'Bodega y lavandería', d: 'Donde se lavan y planchan a mano las sábanas de algodón egipcio.', r: [600, 610, 240, 90] },
];

export function drawSection(svg, rooms, { mini = false } = {}) {
  const byNo = Object.fromEntries(rooms.map((r) => [r.no, r]));
  let s = '';
  // Cielo, lluvia y suelo
  s += `<rect class="sk" width="1200" height="600"/>`;
  if (!mini) {
    s += '<g class="rain">';
    for (let i = 0; i < 90; i++) { const x = (i * 137) % 1200, y = (i * 71) % 560; s += `<path d="M${x} ${y} l-6 22" style="animation-delay:-${((i * 0.37) % 1.2).toFixed(2)}s"/>`; }
    s += '</g>';
  }
  s += `<rect class="gr" y="600" width="1200" height="160"/>`;
  // Río a la derecha y jardín a la izquierda
  s += `<path class="river" d="M1060 600 C1100 596 1150 604 1200 598 V760 H1080 C1070 700 1066 650 1060 600 Z"/>`;
  if (!mini) s += `<g class="river__w"><path d="M1090 640 q10 -4 20 0 t20 0 t20 0 t20 0"/><path d="M1100 680 q10 -4 20 0 t20 0 t20 0 t20 0"/><path d="M1085 720 q10 -4 20 0 t20 0 t20 0 t20 0"/></g><text class="lbl" x="1130" y="752" text-anchor="middle">Río Calle-Calle</text>`;
  // El nogal
  s += `<g class="tree"><path class="tree__t" d="M118 600 C120 540 112 500 120 450 M120 520 C100 500 86 488 70 470 M122 490 C140 470 150 455 170 440"/>`;
  [[120, 400, 70], [70, 440, 46], [172, 430, 50], [96, 360, 44], [150, 352, 46]].forEach(([x, y, r]) => (s += `<circle class="tree__c" cx="${x}" cy="${y}" r="${r}"/>`));
  s += `${mini ? '' : '<text class="lbl" x="120" y="630" text-anchor="middle">El nogal · 1910</text>'}</g>`;
  // Volumen: muros, techo y torreón
  s += `<path class="roof" d="M196 350 L565 96 L934 350 Z"/>`;
  s += `<path class="tower-roof" d="M888 130 L970 26 L1052 130 Z"/><path class="vane" d="M970 26 V6 M962 10 H980"/>`;
  s += `<rect class="hull" x="220" y="340" width="680" height="260"/><rect class="hull" x="900" y="130" width="140" height="470"/>`;
  s += `<rect class="base" x="290" y="600" width="560" height="110"/>`;
  // Espacios
  SPACES.forEach((sp) => {
    const [x, y, w, h] = sp.r;
    const room = typeof sp.id === 'number', rm = room ? byNo[sp.id] : null;
    const label = room ? `${sp.id}` : sp.n;
    const win = sp.id === 'esc' ? `<path class="glass" d="M${x + 18} ${y + 110} V${y + 40} Q${x + 35} ${y + 14} ${x + 52} ${y + 40} V${y + 110} Z"/>` : sp.id === 'cava' || sp.id === 'bod' ? '' : sp.id === 12 || sp.id === 2 || sp.id === 7 || sp.id === 11 ? `<circle class="win" cx="${x + w / 2}" cy="${y + h * 0.42}" r="${Math.min(18, h * 0.2)}"/>` : `<rect class="win" x="${x + w / 2 - 14}" y="${y + h * 0.22}" width="28" height="${h * 0.42}" rx="2"/>`;
    const furn = room ? `<path class="fur" d="M${x + 16} ${y + h - 14} h${Math.min(54, w - 40)} v-12 h-${Math.min(54, w - 40)} z M${x + 16} ${y + h - 26} v-10"/>` : '';
    s += `<g class="sp ${room ? 'sp--room' : 'sp--common'} sp--${rm ? rm.cat : sp.id}" data-sp="${sp.id}" ${mini ? '' : `tabindex="0" role="button" aria-label="${room ? `Habitación ${sp.id}, ${rm.n}` : sp.n}"`}>
      <rect class="sp__r" x="${x}" y="${y}" width="${w}" height="${h}"/>${win}${furn}
      ${mini ? '' : `<text class="sp__l ${room ? 'is-no' : ''}" x="${x + (room ? 12 : w / 2)}" y="${y + (room ? 22 : h - 12)}" ${room ? '' : 'text-anchor="middle"'}>${label}</text>`}
    </g>`;
  });
  // Pisos (rótulos al costado)
  if (!mini) [['Torreón', 182], ['Segundo piso', 290], ['Primer piso', 410], ['Planta baja', 540], ['Subterráneo', 660]].forEach(([t, y]) => (s += `<text class="lbl lbl--floor" x="1190" y="${y}" text-anchor="end">${t}</text>`));
  svg.innerHTML = s;
}

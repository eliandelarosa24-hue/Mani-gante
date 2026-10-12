// "Cree su ensamblaje": cuatro cepas, perfil de sabor, notas de cata, maridaje, botella con el color
// de la mezcla y etiqueta propia descargable.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const CEPAS = [
  { id: 'car', name: 'Carménère', color: [92, 16, 48], v: 60, p: { cuerpo: 3, taninos: 3, fruta: 3, especias: 5 }, notes: ['pimienta negra', 'pimentón asado'] },
  { id: 'cab', name: 'Cabernet', color: [58, 15, 36], v: 25, p: { cuerpo: 4, taninos: 5, fruta: 3, especias: 2 }, notes: ['cassis', 'cedro'] },
  { id: 'syr', name: 'Syrah', color: [75, 15, 58], v: 15, p: { cuerpo: 4, taninos: 3, fruta: 4, especias: 4 }, notes: ['mora', 'violeta'] },
  { id: 'mal', name: 'Malbec', color: [90, 26, 79], v: 0, p: { cuerpo: 3, taninos: 2, fruta: 5, especias: 2 }, notes: ['ciruela', 'flores'] },
];
const KEYS = ['cuerpo', 'taninos', 'fruta', 'especias'];

export function initBlend({ onBook }) {
  const form = $('[data-blend]');
  if (!form) return;
  $('[data-sliders]').innerHTML = CEPAS.map((c) => `<label class="sl"><i style="background:rgb(${c.color})"></i><b>${c.name}</b><input type="range" min="0" max="100" value="${c.v}" data-cepa="${c.id}" aria-label="${c.name}" /><output data-out="${c.id}">—</output></label>`).join('');
  $('[data-profile]').innerHTML = KEYS.map((k) => `<div><span>${k}</span><i data-p="${k}">${'<em></em>'.repeat(5)}</i></div>`).join('');
  let state = {};

  function compute() {
    const vals = Object.fromEntries(CEPAS.map((c) => [c.id, +$(`[data-cepa="${c.id}"]`).value]));
    const tot = Object.values(vals).reduce((a, b) => a + b, 0) || 1;
    const pct = Object.fromEntries(CEPAS.map((c) => [c.id, Math.round((vals[c.id] / tot) * 100)]));
    // Ajuste para que sume exactamente 100
    const diff = 100 - Object.values(pct).reduce((a, b) => a + b, 0);
    const top = CEPAS.slice().sort((a, b) => vals[b.id] - vals[a.id])[0].id; pct[top] += diff;
    const prof = Object.fromEntries(KEYS.map((k) => [k, CEPAS.reduce((a, c) => a + c.p[k] * (vals[c.id] / tot), 0)]));
    const rgb = [0, 1, 2].map((j) => Math.round(CEPAS.reduce((a, c) => a + c.color[j] * (vals[c.id] / tot), 0)));
    return { pct, prof, rgb, empty: tot === 1 && !Object.values(vals).some(Boolean) };
  }
  function render() {
    const { pct, prof, rgb, empty } = compute();
    state = { pct, prof };
    CEPAS.forEach((c) => ($(`[data-out="${c.id}"]`).textContent = `${empty ? 0 : pct[c.id]} %`));
    KEYS.forEach((k) => $$(`[data-p="${k}"] em`).forEach((e, i) => e.classList.toggle('on', !empty && i < Math.round(prof[k]))));
    $('[data-bwine]').setAttribute('fill', `rgb(${rgb})`);
    const used = CEPAS.filter((c) => pct[c.id] > 0).sort((a, b) => pct[b.id] - pct[a.id]);
    const blendTxt = empty ? 'Mueva las barras para empezar' : used.map((c) => `${pct[c.id]}% ${c.name}`).join(' · ');
    const lb = $('[data-lblend]');
    lb.textContent = blendTxt.toUpperCase();
    // Si la línea es larga, se comprime para que quepa dentro de la etiqueta
    if (lb.getComputedTextLength && lb.getComputedTextLength() > 112) { lb.setAttribute('textLength', '112'); lb.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } else { lb.removeAttribute('textLength'); }
    $('[data-lname]').textContent = form.name.value.trim() || 'Mi ensamblaje';
    $('[data-lby]').textContent = `Elaborado por ${form.by.value.trim() || '—'}`;
    $('[data-lyear]').textContent = `COLCHAGUA · ${new Date().getFullYear()}`;
    if (empty) { $('[data-notes]').textContent = 'Su mezcla está vacía.'; $('[data-pairing]').textContent = ''; return; }
    const main = used[0], second = used[1];
    const style = pct[main.id] >= 75 ? `Un varietal de ${main.name.toLowerCase()}` : `Un ensamblaje de ${main.name.toLowerCase()}${second ? ` y ${second.name.toLowerCase()}` : ''}`;
    const aromas = [...main.notes, ...(second ? [second.notes[0]] : [])];
    const body = prof.cuerpo >= 3.8 ? 'de cuerpo generoso' : prof.cuerpo >= 3.2 ? 'de cuerpo medio' : 'ligero y fresco';
    const tan = prof.taninos >= 4 ? 'taninos firmes que piden guarda' : prof.taninos >= 3 ? 'taninos redondos' : 'taninos suaves, listo para beber';
    $('[data-notes]').textContent = `${style}, ${body}, con notas de ${aromas.slice(0, -1).join(', ')} y ${aromas.at(-1)}, y ${tan}.`;
    const pair = prof.taninos >= 4 ? 'cordero al palo o asado de vacuno' : prof.especias >= 4 ? 'costillar con merkén o pastel de choclo' : prof.fruta >= 4 ? 'pastas con hongos o pizza a la piedra' : 'quesos maduros de Colchagua';
    $('[data-pairing]').innerHTML = `<b>Marida con</b> ${pair}.`;
  }
  form.addEventListener('input', render);
  $('[data-blend-book]').addEventListener('click', () => onBook());

  // Etiqueta descargable dibujada en canvas con las tipografías de la página
  $('[data-blend-dl]').addEventListener('click', async () => {
    await document.fonts.ready;
    const cv = document.createElement('canvas'); cv.width = 900; cv.height = 1200;
    const c = cv.getContext('2d');
    c.fillStyle = '#f8f1e4'; c.fillRect(0, 0, 900, 1200);
    c.strokeStyle = '#a8844a'; c.lineWidth = 3; c.strokeRect(40, 40, 820, 1120); c.lineWidth = 1; c.strokeRect(60, 60, 780, 1080);
    c.textAlign = 'center';
    c.fillStyle = '#6d1f3a'; c.font = '500 30px Jost, sans-serif'; c.fillText('V I Ñ A   L O S   R O B L E S', 450, 180);
    c.fillStyle = '#6d1f3a'; [[-28, -18], [28, -18], [0, 22], [56, 22], [28, 62]].forEach(([x, y]) => { c.beginPath(); c.arc(430 + x, 330 + y, 24, 0, 6.283); c.fill(); });
    c.fillStyle = '#a8844a'; c.beginPath(); c.moveTo(440, 288); c.bezierCurveTo(440, 250, 470, 230, 510, 230); c.bezierCurveTo(505, 265, 480, 285, 440, 288); c.fill();
    c.fillStyle = '#2a1520'; c.font = 'italic 500 110px "Cormorant Garamond", serif';
    let name = form.name.value.trim() || 'Mi ensamblaje', fs = 110;
    while (c.measureText(name).width > 720 && fs > 50) { fs -= 6; c.font = `italic 500 ${fs}px "Cormorant Garamond", serif`; }
    c.fillText(name, 450, 590);
    c.fillStyle = 'rgba(42,21,32,.7)'; let bs = 28; c.font = `400 ${bs}px Jost, sans-serif`; const bt = $('[data-lblend]').textContent; while (c.measureText(bt).width > 680 && bs > 16) { bs -= 1; c.font = `400 ${bs}px Jost, sans-serif`; } c.fillText(bt, 450, 680);
    c.strokeStyle = '#a8844a'; c.beginPath(); c.moveTo(330, 740); c.lineTo(570, 740); c.stroke();
    c.fillStyle = '#2a1520'; c.font = 'italic 400 48px "Cormorant Garamond", serif'; c.fillText(`Elaborado por ${form.by.value.trim() || '—'}`, 450, 830);
    c.fillStyle = '#a8844a'; c.font = '500 26px Jost, sans-serif'; c.fillText(`C O L C H A G U A   ·   ${new Date().getFullYear()}`, 450, 960);
    c.fillStyle = 'rgba(42,21,32,.55)'; c.font = '400 22px Jost, sans-serif'; c.fillText('Ensamblaje de autor · Enólogo por un día', 450, 1060);
    const a = document.createElement('a');
    a.download = `etiqueta-${name.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-')}.png`; a.href = cv.toDataURL('image/png'); a.click();
  });
  render();
}

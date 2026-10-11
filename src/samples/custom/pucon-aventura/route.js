// Perfil de altura de la ruta al cráter: se arrastra al montañista y cambian altitud, hora,
// temperatura, oxígeno, calorías y el equipo que se usa en cada tramo.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';

const PTS = [[0, 1400], [0.6, 1560], [1.2, 1720], [1.8, 1850], [2.5, 2050], [3.1, 2250], [3.7, 2420], [4.2, 2560], [4.6, 2700], [5, 2847]];
const WPS = [
  { km: 0, min: 0, name: 'Base · centro de ski', text: 'Revisión del equipo y charla de seguridad. Desde aquí se ve el lago Villarrica completo.', gear: ['Casco', 'Bastones', 'Polainas'] },
  { km: 1.8, min: 90, name: 'Fin del andarivel', text: 'Si toma el andarivel opcional, empieza aquí y se ahorra hora y media de subida por la ladera.', gear: [] },
  { km: 2.5, min: 135, name: 'Pausa del desayuno', text: 'Desayuno de montaña con vista al Lanín y al Quetrupillán. Primera capa de bloqueador.', gear: [] },
  { km: 3.1, min: 180, name: 'Inicio del glaciar', text: 'Se ponen crampones y piolet. Subimos en zigzag, en fila, al paso del guía.', gear: ['Crampones', 'Piolet'] },
  { km: 4.2, min: 270, name: 'Mirador de los volcanes', text: 'En un día despejado se ven cinco volcanes: Lanín, Quetrupillán, Llaima, Lonquimay y Choshuenco.', gear: [] },
  { km: 5, min: 330, name: 'Cráter · 2.847 m', text: 'Borde del cráter activo. Con suerte se ve el lago de lava al fondo. El azufre obliga a usar máscara.', gear: ['Máscara antigases'] },
];
const X0 = 60, X1 = 980, Y0 = 340, Y1 = 30, A0 = 1300, A1 = 2900;
const sx = (km) => X0 + (km / 5) * (X1 - X0);
const sy = (alt) => Y0 - ((alt - A0) / (A1 - A0)) * (Y0 - Y1);
const fmt = (n) => Math.round(n).toLocaleString('es-CL');

function altAt(km) {
  for (let i = 1; i < PTS.length; i++) if (km <= PTS[i][0]) { const [k0, a0] = PTS[i - 1], [k1, a1] = PTS[i]; return a0 + ((km - k0) / (k1 - k0)) * (a1 - a0); }
  return PTS[PTS.length - 1][1];
}
function minAt(km) {
  for (let i = 1; i < WPS.length; i++) if (km <= WPS[i].km) { const a = WPS[i - 1], b = WPS[i]; return a.min + ((km - a.km) / (b.km - a.km)) * (b.min - a.min); }
  return WPS[WPS.length - 1].min;
}

export function initRoute({ reduced }) {
  const svg = $('[data-profile]');
  if (!svg) return;
  const line = PTS.map(([k, a], i) => `${i ? 'L' : 'M'}${sx(k).toFixed(1)} ${sy(a).toFixed(1)}`).join(' ');
  $('[data-pline]', svg).setAttribute('d', line);
  $('[data-pdone]', svg).setAttribute('d', line);
  $('[data-parea]', svg).setAttribute('d', `${line} L${X1} ${Y0} L${X0} ${Y0}z`);
  $('[data-pgrid]', svg).innerHTML = [1500, 2000, 2500].map((a) => `<line x1="${X0}" x2="${X1}" y1="${sy(a)}" y2="${sy(a)}"/><text x="${X0 - 8}" y="${sy(a) + 3}" text-anchor="end">${fmt(a)}</text>`).join('')
    + [0, 1, 2, 3, 4, 5].map((k) => `<text x="${sx(k)}" y="${Y0 + 22}" text-anchor="middle">${k} km</text>`).join('');
  $('[data-pwps]', svg).innerHTML = WPS.map((w, i) => {
    const x = sx(w.km), y = sy(altAt(w.km)), h = 7 + Math.floor(w.min / 60), m = String(w.min % 60).padStart(2, '0');
    return `<g class="wp" data-wp="${i}"><circle cx="${x}" cy="${y}" r="7"/><text x="${x}" y="${y - 16}">${String(h).padStart(2, '0')}:${m}</text></g>`;
  }).join('');
  const wps = $$('.wp', svg), climber = $('[data-climber]', svg), stem = $('[data-cstem]', svg), clip = $('[data-pclip]', svg);
  const season = [0, 1, 2, 10, 11].includes(new Date().getMonth()) ? 4 : [3, 9].includes(new Date().getMonth()) ? 0 : -4;
  let p = 0, lastStage = -1;

  function set(np) {
    p = Math.max(0, Math.min(1, np));
    const km = p * 5, alt = altAt(km), min = minAt(km);
    const x = sx(km), y = sy(alt);
    climber.setAttribute('transform', `translate(${x} ${y})`);
    stem.setAttribute('y2', Y0 - y);
    clip.setAttribute('width', x);
    climber.setAttribute('aria-valuenow', Math.round(p * 100));
    climber.setAttribute('aria-valuetext', `${fmt(alt)} metros`);
    $('[data-r-alt]').textContent = fmt(alt);
    const h = 7 + Math.floor(min / 60), m = Math.floor(min % 60);
    $('[data-r-time]').textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const temp = 6 + season + (min / 330) * 4 - 6.5 * (alt - 1400) / 1000 - (alt > 2500 ? 3 : 0);
    $('[data-r-temp]').textContent = `${temp > 0 ? '+' : ''}${temp.toFixed(0)} °C`;
    $('[data-r-o2]').textContent = `${Math.round(100 * Math.exp(-alt / 8000))} %`;
    $('[data-r-kcal]').textContent = fmt(min * 8.2);
    let stage = 0; WPS.forEach((w, i) => { if (km >= w.km - 0.05) stage = i; });
    wps.forEach((g, i) => { g.classList.toggle('is-past', i < stage); g.classList.toggle('is-now', i === stage); });
    if (stage !== lastStage) {
      const gear = WPS.slice(0, stage + 1).flatMap((w) => w.gear);
      const fresh = WPS[stage].gear;
      $('[data-r-gear]').innerHTML = gear.map((g) => `<li${fresh.includes(g) && stage > 0 ? ' class="is-new"' : ''}>${g}</li>`).join('');
      $('[data-r-stage]').textContent = WPS[stage].name;
      const ph = stage >= 5 ? 2 : stage >= 3 ? 1 : 0;
      $$('[data-r-ph]').forEach((el) => el.classList.toggle('is-on', +el.dataset.rPh === ph));
      $('[data-r-text]').textContent = WPS[stage].text;
      lastStage = stage;
    }
  }

  const toP = (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const l = pt.matrixTransform(svg.getScreenCTM().inverse()); return (l.x - X0) / (X1 - X0); };
  let drag = false;
  svg.addEventListener('pointerdown', (e) => { drag = true; svg.setPointerCapture(e.pointerId); stopPlay(); set(toP(e)); });
  svg.addEventListener('pointermove', (e) => { if (drag) set(toP(e)); });
  svg.addEventListener('pointerup', () => (drag = false));
  svg.addEventListener('pointercancel', () => (drag = false));
  climber.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowUp'].includes(e.key)) { e.preventDefault(); set(p + 0.02); }
    if (['ArrowLeft', 'ArrowDown'].includes(e.key)) { e.preventDefault(); set(p - 0.02); }
  });

  let raf = null;
  const btn = $('[data-p-play]');
  function stopPlay() { if (raf) cancelAnimationFrame(raf); raf = null; btn.textContent = '▶ Ver el ascenso completo'; }
  function play() {
    if (raf) return stopPlay();
    let start = null, from = p >= 1 ? 0 : p;
    btn.textContent = '❚❚ Pausar';
    const step = (t) => {
      if (start == null) start = t;
      const np = from + (t - start) / 9000;
      set(np);
      if (np < 1) raf = requestAnimationFrame(step); else { raf = null; btn.textContent = '↺ Subir otra vez'; }
    };
    raf = requestAnimationFrame(step);
  }
  btn.addEventListener('click', play);
  set(0);
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); if (!reduced) setTimeout(play, 600); } }, { threshold: 0.45 }).observe(svg);
}

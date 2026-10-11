// Test "¿Qué aventura es la suya?": cuatro preguntas y una recomendación con porcentaje de coincidencia.
const $ = (s, r = document) => r.querySelector(s);

export const TOURS = {
  volcan: { name: 'Ascenso al volcán Villarrica', adr: 3, fit: 3, kids: false, env: 'tierra', why: 'Es la gran aventura de Pucón: cumbre a 2.847 m, cráter activo y bajada en trineo.' },
  'rafting-alto': { name: 'Rafting Trancura Alto', adr: 2.6, fit: 1.6, kids: false, env: 'agua', why: 'Rápidos clase III–IV: adrenalina pura en tres horas, sin necesidad de experiencia.' },
  'rafting-bajo': { name: 'Rafting Trancura Bajo', adr: 1.4, fit: 0.6, kids: true, env: 'agua', why: 'El primer rafting ideal: emoción suave, seguro para niños desde 8 años.' },
  canopy: { name: 'Canopy Ojos del Caburgua', adr: 1.8, fit: 0.4, kids: true, env: 'tierra', why: 'Doce líneas sobre el bosque: vértigo controlado y vistas a las cascadas.' },
  huerquehue: { name: 'Huerquehue y lagos andinos', adr: 0.9, fit: 2, kids: true, env: 'tierra', why: 'Trekking entre araucarias milenarias y lagos de montaña. Naturaleza a todo dar.' },
  termas: { name: 'Termas Geométricas de noche', adr: 0, fit: 0, kids: true, env: 'calor', why: 'Pozas termales entre helechos, iluminadas con velas. El premio después de la aventura.' },
};
const QS = [
  { q: '¿Cuánta adrenalina quiere?', k: 'adr', o: [['Poca: vengo a relajarme', 0], ['Un poco de emoción', 1.2], ['Bastante', 2.2], ['Máxima: quiero una historia para contar', 3]] },
  { q: '¿Cómo está su estado físico?', k: 'fit', o: [['Más bien sedentario', 0], ['Camino de vez en cuando', 1], ['Hago deporte seguido', 2], ['Entreno en cerro o montaña', 3]] },
  { q: '¿Con quién viene?', k: 'kids', o: [['Solo o en pareja', false], ['Con amigos', false], ['Con niños de 8 a 13 años', true], ['Con adolescentes de 14 o más', false]] },
  { q: '¿Agua, montaña o calor?', k: 'env', o: [['Agua: ríos y rápidos', 'agua'], ['Montaña y bosque', 'tierra'], ['Algo calentito', 'calor'], ['Me da lo mismo', 'any']] },
];

function rank(a) {
  return Object.entries(TOURS).map(([id, t]) => {
    let s = 100 - 20 * Math.abs(t.adr - a.adr) - 16 * Math.max(0, t.fit - a.fit);
    if (a.kids && !t.kids) s -= 70;
    if (a.env !== 'any') s += t.env === a.env ? 10 : -16;
    return { id, ...t, score: Math.max(18, Math.min(98, Math.round(s))) };
  }).sort((x, y) => y.score - x.score);
}

export function initQuiz({ onPick }) {
  const box = $('[data-quiz]');
  if (!box) return;
  let step = 0, ans = {};
  function render() {
    if (step >= QS.length) return result();
    const Q = QS[step];
    box.innerHTML = `<div class="quiz__top"><span>Pregunta ${step + 1} de ${QS.length}</span><span class="quiz__dots">${QS.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</span></div>
      <h3>${Q.q}</h3>
      <div class="quiz__opts">${Q.o.map(([t], i) => `<button type="button" data-i="${i}"><b>0${i + 1}</b>${t}</button>`).join('')}</div>`;
  }
  function result() {
    const r = rank(ans), best = r[0], alt = r[1];
    box.innerHTML = `<div class="quiz__res">
      <div class="quiz__top"><span>Su resultado</span><span class="quiz__dots">${QS.map(() => '<i class="on"></i>').join('')}</span></div>
      <div class="quiz__match"><b data-count-to="${best.score}">0</b><span>% de coincidencia</span></div>
      <h3>${best.name}</h3>
      <p>${best.why}</p>
      <p class="quiz__alt">También le puede gustar: <b>${alt.name}</b> · ${alt.score}%</p>
      <div class="quiz__actions"><button type="button" class="btn btn--lava btn--sm" data-q-pick="${best.id}">Reservar este tour</button><button type="button" class="btn btn--ghost btn--sm" data-q-again>Repetir el test</button></div>
    </div>`;
    const el = $('[data-count-to]', box), to = +el.dataset.countTo, t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(to * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  box.addEventListener('click', (e) => {
    const o = e.target.closest('[data-i]');
    if (o) { ans[QS[step].k] = QS[step].o[+o.dataset.i][1]; step++; render(); return; }
    if (e.target.closest('[data-q-again]')) { step = 0; ans = {}; render(); return; }
    const pick = e.target.closest('[data-q-pick]');
    if (pick) onPick(pick.dataset.qPick);
  });
  render();
}

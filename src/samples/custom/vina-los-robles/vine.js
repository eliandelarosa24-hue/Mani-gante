// "El año en la viña": la parra cambia (poda, brotación, floración, envero, vendimia, otoño)
// a medida que se baja por los meses.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LEAF = 'M0 0 C-6 4 -16 6 -18 16 C-12 16 -12 22 -16 28 C-8 26 -4 30 0 36 C4 30 8 26 16 28 C12 22 12 16 18 16 C16 6 6 4 0 0z';
const STAGES = ['la poda', 'la brotación', 'la floración', 'el envero', 'la vendimia', 'el otoño'];
const GRAPE = [['#9fcf6a', '#4f7d2a'], ['#9fcf6a', '#4f7d2a'], ['#9fcf6a', '#4f7d2a'], ['#a35a8a', '#4a2340'], ['#6a2a64', '#2a0a22'], ['#6a2a64', '#2a0a22']];
const SEASON = ['#dfe4e8', '#e3eed2', '#f4ecd2', '#e9dceb', '#ecd2dc', '#f3dcc2'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function initVine() {
  const vine = $('[data-vine]');
  if (!vine) return;
  // Hojas a lo largo del cordón, unas hacia arriba y otras colgando
  let leaves = '';
  for (let x = 66, i = 0; x <= 336; x += 22, i++) {
    const up = i % 2 === 0, r = up ? 180 + ((i * 37) % 40) - 20 : ((i * 23) % 50) - 25, y = up ? 168 : 172;
    leaves += `<g transform="translate(${x} ${y}) rotate(${r}) scale(${0.9 + ((i * 7) % 5) / 10})"><path d="${LEAF}"/></g>`;
    if (i % 3 === 0) leaves += `<g transform="translate(${x + 10} ${y - 30}) rotate(${190 + ((i * 11) % 30)}) scale(0.7)"><path d="${LEAF}"/></g>`;
  }
  $('[data-leaves]', vine).innerHTML = leaves;
  // Racimos colgando
  const cluster = (cx, cy) => {
    let g = '';
    [5, 4, 4, 3, 2, 1].forEach((n, row) => { for (let k = 0; k < n; k++) g += `<circle cx="${cx + (k - (n - 1) / 2) * 10.5}" cy="${cy + row * 9.5}" r="5.6" style="transition-delay:${row * 60 + k * 30}ms"/>`; });
    return g;
  };
  $('[data-grapes]', vine).innerHTML = cluster(122, 196) + cluster(206, 202) + cluster(286, 194);
  $('[data-fall]', vine).innerHTML = [90, 160, 230, 300, 130, 260].map((x, i) => `<g transform="translate(${x} ${190 + (i % 3) * 10}) scale(.5)"><path d="${LEAF}" style="animation-delay:${i * 0.8}s"/></g>`).join('');

  const set = (st) => {
    vine.dataset.stage = st;
    vine.closest('.ano').style.setProperty('--season', SEASON[st]);
    $('[data-gr1]', vine).setAttribute('stop-color', GRAPE[st][0]);
    $('[data-gr2]', vine).setAttribute('stop-color', GRAPE[st][1]);
  };
  const steps = $$('.astep');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    steps.forEach((s) => s.classList.toggle('is-on', s === e.target));
    set(+e.target.dataset.st);
  }), { rootMargin: '-45% 0px -50% 0px' });
  steps.forEach((s) => io.observe(s));

  // ¿En qué etapa está la viña hoy?
  const m = new Date().getMonth();
  const now = m >= 5 && m <= 7 ? 0 : m <= 9 && m >= 8 ? 1 : m >= 10 ? 2 : m <= 1 ? 3 : m <= 3 ? 4 : 5;
  $('[data-now-stage]').textContent = `Hoy, en ${MONTHS[m]}, la viña está en ${STAGES[now]}`;
  set(0);
}

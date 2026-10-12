// La página es un día: cada sección tiene su hora (data-h) y, al desplazarse, la hora avanza
// y el color del cielo (fondo y texto de toda la página) se interpola entre amanecer y medianoche.
const STOPS = [
  [5.5, [200, 213, 223], 0], [6.6, [207, 217, 225], 0], [7.8, [228, 232, 229], 0], [9.5, [241, 240, 234], 0],
  [12, [246, 244, 238], 0], [15, [244, 237, 225], 0], [17.6, [242, 225, 203], 0], [19.2, [238, 205, 178], 0],
  [20, [196, 168, 168], 0], [20.35, [112, 99, 120], 1], [21.2, [44, 52, 70], 1], [22.5, [22, 31, 42], 1], [24, [11, 17, 24], 1],
];
const INK = [29, 42, 48], CHALK = [236, 238, 234];
const NAMES = [[5, 'Madrugada'], [6.3, 'Amanecer'], [7.5, 'Mañana'], [11.5, 'Mediodía'], [13.5, 'Tarde'], [18.6, 'Hora dorada'], [19.9, 'Atardecer'], [20.6, 'Anochecer'], [21.5, 'Noche'], [23.3, 'Medianoche']];
let NIGHT = 0;
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
export const fmtH = (h) => { const m = Math.round(h * 60) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };

export function palette(h) {
  let i = 0; while (i < STOPS.length - 2 && h > STOPS[i + 1][0]) i++;
  const [h0, c0, n0] = STOPS[i], [h1, c1, n1] = STOPS[i + 1];
  const k = Math.max(0, Math.min(1, (h - h0) / (h1 - h0)));
  const bg = mix(c0, c1, k), night = n0 + (n1 - n0) * k;
  const fg = mix(INK, CHALK, night);
  return { bg, fg, night };
}

export function initSky({ sunrise, sunset, reduced, override }) {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll('[data-h]')];
  const sun = document.querySelector('[data-dial-sun]'), tEl = document.querySelector('[data-dial-time]'), nEl = document.querySelector('[data-dial-name]');
  const meta = document.querySelector('meta[name="theme-color"]');
  let last = -1, hour = 6.6;

  function compute() {
    const mid = innerHeight * 0.55;
    let i = 0;
    sections.forEach((s, k) => { if (s.getBoundingClientRect().top <= mid) i = k; });
    const s = sections[i], n = sections[i + 1];
    const r = s.getBoundingClientRect();
    const h0 = +s.dataset.h, h1 = n ? +n.dataset.h : 24;
    const k = Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height)));
    const o = override(s);
    return o != null ? o : h0 + (h1 - h0) * k;
  }
  function paint(h) {
    const { bg, fg, night } = palette(h);
    root.style.setProperty('--bg', `rgb(${bg})`);
    root.style.setProperty('--fg', `rgb(${fg})`);
    root.style.setProperty('--fg-rgb', fg.join(','));
    root.style.setProperty('--bg-rgb', bg.join(','));
    NIGHT = night;
    root.classList.toggle('is-night', night > 0.5);
    meta.setAttribute('content', `rgb(${bg})`);
    tEl.textContent = fmtH(h);
    nEl.textContent = [...NAMES].reverse().find(([t]) => h >= t)?.[1] || 'Madrugada';
    // Sol sobre el arco entre la salida y la puesta reales; de noche, la luna recorre el mismo arco
    const day = h >= sunrise && h <= sunset;
    const t = day ? (h - sunrise) / (sunset - sunrise) : ((h - sunset + 24) % 24) / (24 - (sunset - sunrise));
    const a = Math.PI * (1 - t);
    sun.setAttribute('cx', (60 + 52 * Math.cos(a)).toFixed(1));
    sun.setAttribute('cy', (36 - 30 * Math.sin(a)).toFixed(1));
    sun.classList.toggle('is-moon', !day);
  }
  const tick = () => {
    const h = compute();
    hour += (h - hour) * (reduced ? 1 : 0.18);
    if (Math.abs(hour - last) > 0.002) { paint(hour); last = hour; }
    requestAnimationFrame(tick);
  };
  paint(6.6); tick();
  initStars();
}

// Cielo nocturno: estrellas fijas que titilan y aparecen con la noche (--night)
function initStars() {
  const cv = document.querySelector('[data-stars]'); if (!cv) return;
  const c = cv.getContext('2d'); let stars = [], w = 0, h = 0;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const size = () => {
    w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    stars = Array.from({ length: Math.round((w * h) / 5200) }, () => ({ x: r() * w, y: r() * h, r: r() < 0.08 ? 1.3 : 0.4 + r() * 0.6, p: r() * 6.28, s: 0.6 + r() * 1.6 }));
  };
  size(); addEventListener('resize', size);
  (function draw(t) {
    requestAnimationFrame(draw);
    const n = NIGHT;
    cv.style.opacity = n;
    if (n < 0.02) return;
    c.clearRect(0, 0, w, h);
    stars.forEach((st) => {
      c.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(st.p + t / 1000 * st.s * 0.5));
      c.fillStyle = '#f4f1e6'; c.beginPath(); c.arc(st.x, st.y, st.r, 0, 6.283); c.fill();
    });
  })(0);
}

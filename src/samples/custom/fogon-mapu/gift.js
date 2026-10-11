// Tarjeta de regalo dibujada en canvas: se actualiza al escribir y se descarga como imagen.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

const STYLES = {
  brasa: { bg: ['#3d1e0e', '#120c09'], ink: '#f1e4d1', soft: 'rgba(241,228,209,.66)', accent: '#ffb65c', line: 'rgba(255,182,92,.45)', dots: '255,140,60' },
  papel: { bg: ['#f6ecda', '#e3d2b4'], ink: '#2b1a0f', soft: 'rgba(43,26,15,.66)', accent: '#a5531f', line: 'rgba(165,83,31,.45)', dots: '165,83,31' },
  noche: { bg: ['#1c1530', '#07060f'], ink: '#efe9ff', soft: 'rgba(239,233,255,.66)', accent: '#ff9a4a', line: 'rgba(255,154,74,.45)', dots: '255,154,74' },
};
const FLAME = new Path2D('M20 28c-3.6 0-5.6-2.6-5.6-5.4 0-3.8 3.8-4.6 2.8-9.6 3.8 2 4.8 5 4.8 6.8 1-.8 1.8-2 1.8-3.8 2 2 3 4.2 3 6.6 0 3-2.6 5.4-6.8 5.4z');

function hash(str) { let h = 2166136261; for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
function wrap(c, text, x, y, max, lh) {
  const words = text.split(' '); let line = '', yy = y;
  for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > max && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = t; }
  if (line) c.fillText(line, x, yy);
}

export function initGift() {
  const form = $('[data-gift]'), cv = $('[data-gift-canvas]');
  if (!form || !cv) return;
  const c = cv.getContext('2d');
  let style = 'brasa';

  function mark(x, y, s, st) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.strokeStyle = st.accent; c.lineWidth = 1.4;
    c.beginPath(); c.arc(20, 20, 18, 0, 6.283); c.stroke();
    c.globalAlpha = 0.4; c.beginPath(); c.arc(20, 20, 11, 0, 6.283); c.stroke(); c.globalAlpha = 1;
    c.stroke(new Path2D('M20 2v7M20 31v7M2 20h7M31 20h7M17.5 4.5 20 2l2.5 2.5M17.5 35.5 20 38l2.5-2.5M4.5 17.5 2 20l2.5 2.5M35.5 17.5 38 20l-2.5 2.5'));
    c.fillStyle = '#ff7a2f'; c.fill(FLAME);
    c.restore();
  }
  function draw() {
    const st = STYLES[style], W = cv.width, H = cv.height;
    const [name, price, desc] = form.exp.value.split('|');
    const people = +form.people.value;
    const to = form.to.value.trim() || 'Alguien especial', from = form.from.value.trim() || '—', msg = form.msg.value.trim();
    const code = `FM-${(hash(name + to + from + people) % 9000 + 1000)}-${(hash(msg + style) % 9000 + 1000)}`;
    const until = new Date(); until.setMonth(until.getMonth() + 6);

    const g = c.createRadialGradient(W * 0.75, H * 0.3, 40, W * 0.6, H * 0.5, W * 0.85);
    g.addColorStop(0, st.bg[0]); g.addColorStop(1, st.bg[1]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // Chispas y kultrún de fondo
    let seed = hash(style);
    const rnd = () => ((seed = Math.imul(seed ^ (seed >>> 13), 1597334677) >>> 0) / 4294967295);
    for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(${st.dots},${0.15 + rnd() * 0.4})`; c.beginPath(); c.arc(W * 0.55 + rnd() * W * 0.45, rnd() * H, 1 + rnd() * 2.5, 0, 6.283); c.fill(); }
    // Emblema de fondo: anillos del kultrún y la llama, muy tenues
    c.save(); c.globalAlpha = 0.13; c.strokeStyle = st.accent;
    const ex = W - 230, ey = H / 2 + 10;
    [250, 205, 130].forEach((r, i) => { c.lineWidth = i === 1 ? 1 : 3; c.beginPath(); c.arc(ex, ey, r, 0, 6.283); c.stroke(); });
    c.lineWidth = 2; c.beginPath(); c.moveTo(ex, ey - 250); c.lineTo(ex, ey - 140); c.moveTo(ex, ey + 140); c.lineTo(ex, ey + 250); c.moveTo(ex - 250, ey); c.lineTo(ex - 140, ey); c.stroke();
    c.translate(ex - 20 * 7, ey - 21 * 7); c.scale(7, 7); c.fillStyle = st.accent; c.fill(FLAME);
    c.restore();
    c.strokeStyle = st.line; c.lineWidth = 2; c.strokeRect(36, 36, W - 72, H - 72);

    mark(80, 78, 1.9, st);
    c.fillStyle = st.ink; c.font = '600 34px Fraunces, Georgia, serif'; c.textBaseline = 'alphabetic';
    c.fillText('Fogón Mapu', 168, 118);
    c.fillStyle = st.accent; c.font = '700 17px Manrope, sans-serif';
    c.fillText('TARJETA DE REGALO', W - 80 - c.measureText('TARJETA DE REGALO').width, 118);

    c.fillStyle = st.soft; c.font = 'italic 300 40px Fraunces, Georgia, serif'; c.fillText('Para', 80, 262);
    c.fillStyle = st.ink; c.font = 'italic 300 104px Fraunces, Georgia, serif';
    let fs = 104; while (c.measureText(to).width > W - 260 && fs > 50) { fs -= 4; c.font = `italic 300 ${fs}px Fraunces, Georgia, serif`; }
    c.fillText(to, 170, 270);
    c.fillStyle = st.accent; c.font = '400 52px Fraunces, Georgia, serif'; c.fillText(name, 80, 370);
    c.fillStyle = st.soft; c.font = '500 26px Manrope, sans-serif'; c.fillText(`${people} ${people === 1 ? 'persona' : 'personas'} · ${desc}`, 80, 414);
    if (msg) { c.fillStyle = st.ink; c.font = 'italic 300 34px Fraunces, Georgia, serif'; wrap(c, `«${msg}»`, 80, 500, W - 420, 44); }
    c.fillStyle = st.soft; c.font = '500 24px Manrope, sans-serif'; c.fillText(`Con cariño, ${from}`, 80, 610);

    c.strokeStyle = st.line; c.beginPath(); c.moveTo(80, 650); c.lineTo(W - 80, 650); c.stroke();
    c.fillStyle = st.soft; c.font = '600 19px Manrope, sans-serif';
    c.fillText(`CÓDIGO ${code}`, 80, 690);
    const v = `VÁLIDA HASTA EL ${until.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}`;
    c.fillText(v, W - 80 - c.measureText(v).width, 690);
    $('[data-gift-total]').textContent = clp(+price * people);
  }
  form.addEventListener('input', draw);
  form.addEventListener('change', draw);
  $$('[data-style]', form).forEach((b) => b.addEventListener('click', () => {
    style = b.dataset.style;
    $$('[data-style]', form).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    draw();
  }));
  $('[data-gift-dl]').addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = `regalo-fogon-mapu-${(form.to.value.trim() || 'tarjeta').toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-')}.png`;
    a.href = cv.toDataURL('image/png'); a.click();
  });
  draw();
  // Redibuja cuando cargan las tipografías para que la tarjeta use Fraunces y Manrope
  Promise.all([document.fonts.load('italic 300 60px Fraunces'), document.fonts.load('400 40px Fraunces'), document.fonts.load('600 20px Manrope')]).then(draw, draw);
}

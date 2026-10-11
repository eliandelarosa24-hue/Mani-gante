// Certificado de cumbre descargable (formato post 4:5 o historia 9:16), con la foto del cráter de fondo.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initCert() {
  const form = $('[data-cert]'), cv = $('[data-cert-canvas]');
  if (!form || !cv) return;
  const c = cv.getContext('2d');
  let fmt = 'post', photo = null;
  const d = new Date(); d.setDate(d.getDate() + 14);
  form.date.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Foto de fondo: solo la propia (misma ruta del sitio), para poder descargar el canvas
  const bg = getComputedStyle($('.final')).backgroundImage.match(/url\("?([^")]+)"?\)/g) || [];
  const local = bg.map((u) => u.replace(/url\("?|"?\)/g, '')).find((u) => !/unsplash/.test(u));
  if (local) { const im = new Image(); im.onload = () => { photo = im; draw(); }; im.src = local; }

  const font = (w, size, stretch = 'normal') => { c.font = `${w} ${size}px Archivo, 'Arial Narrow', sans-serif`; if ('fontStretch' in c) c.fontStretch = stretch; };
  function draw() {
    const W = 1080, H = fmt === 'post' ? 1350 : 1920;
    cv.width = W; cv.height = H;
    // Fondo
    if (photo) {
      const s = Math.max(W / photo.width, H / photo.height), pw = photo.width * s, ph = photo.height * s;
      c.drawImage(photo, (W - pw) * 0.3, (H - ph) * 0.55, pw, ph);
    } else { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#26324a'); g.addColorStop(1, '#0d0f12'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
    let g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(13,15,18,.82)'); g.addColorStop(0.35, 'rgba(13,15,18,.25)'); g.addColorStop(0.62, 'rgba(13,15,18,.55)'); g.addColorStop(1, 'rgba(13,15,18,.95)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // Curvas de nivel
    c.strokeStyle = 'rgba(159,216,234,.16)'; c.lineWidth = 1.5;
    for (let k = 1; k <= 7; k++) { c.beginPath(); c.ellipse(W * 0.82, H * 0.2, 60 * k, 44 * k, -0.3, 0, 6.283); c.stroke(); }
    c.strokeStyle = '#ff5b2e'; c.lineWidth = 3; c.beginPath(); c.ellipse(W * 0.82, H * 0.2, 24, 16, -0.3, 0, 6.283); c.stroke();

    // Encabezado
    c.fillStyle = '#eef3f6'; font(900, 40, 'condensed'); c.fillText('PUCÓN', 80, 120);
    c.fillStyle = '#ff5b2e'; c.fillText('AVENTURA', 80, 160);
    c.fillStyle = 'rgba(238,243,246,.75)'; c.font = '600 22px "JetBrains Mono", monospace'; c.fillText('CERTIFICADO DE CUMBRE', 80, 220);
    c.fillText(`Nº ${(18000 + Math.floor((form.name.value.length * 97 + d.getDate() * 13) % 900)).toLocaleString('es-CL')}`, 80, 256);

    // Altura gigante
    const base = H - (fmt === 'post' ? 560 : 760);
    const lava = c.createLinearGradient(0, base - 260, 0, base);
    lava.addColorStop(0, '#ffd27a'); lava.addColorStop(0.45, '#ff8a4c'); lava.addColorStop(1, '#ff5b2e');
    c.fillStyle = lava; font(900, 300, 'ultra-condensed'); c.fillText('2.847', 66, base);
    const nw = c.measureText('2.847').width;
    c.fillStyle = '#eef3f6'; font(800, 70, 'condensed'); c.fillText('m', 66 + nw + 14, base - 12);

    // Nombre y datos
    const name = (form.name.value.trim() || 'Su nombre').toUpperCase();
    let size = 110; font(900, size, 'condensed');
    while (c.measureText(name).width > W - 160 && size > 50) { size -= 4; font(900, size, 'condensed'); }
    c.fillStyle = '#eef3f6'; c.fillText(name, 80, base + 140);
    c.fillStyle = 'rgba(238,243,246,.8)'; font(500, 32);
    const dt = new Date(form.date.value + 'T12:00');
    c.fillText(`llegó al cráter del volcán Villarrica el ${dt.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}`, 80, base + 196);
    c.fillText(`a las ${form.time.value || '12:30'} horas, después de 1.450 m de ascenso.`, 80, base + 240);
    c.fillStyle = 'rgba(159,216,234,.9)'; c.font = '600 22px "JetBrains Mono", monospace';
    c.fillText('39°25′12″ S · 71°56′22″ O', 80, base + 300);

    // Firma y timbre
    const fy = H - 110;
    c.strokeStyle = 'rgba(238,243,246,.85)'; c.lineWidth = 3; c.beginPath();
    c.moveTo(80, fy - 30); c.bezierCurveTo(120, fy - 90, 150, fy + 10, 190, fy - 40); c.bezierCurveTo(220, fy - 80, 240, fy - 10, 290, fy - 50); c.lineTo(330, fy - 30); c.stroke();
    c.strokeStyle = 'rgba(238,243,246,.3)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(80, fy); c.lineTo(420, fy); c.stroke();
    c.fillStyle = 'rgba(238,243,246,.7)'; c.font = '500 20px "JetBrains Mono", monospace'; c.fillText('Matías Huenchullán · guía WFR', 80, fy + 34);
    c.save(); c.translate(W - 190, H - 190); c.rotate(-0.22);
    c.strokeStyle = '#ff5b2e'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 105, 0, 6.283); c.stroke();
    c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 88, 0, 6.283); c.stroke();
    c.fillStyle = '#ff5b2e'; font(900, 34, 'condensed'); c.textAlign = 'center'; c.fillText('CUMBRE', 0, -8); font(900, 46, 'condensed'); c.fillText('2.847 M', 0, 38);
    c.font = '600 16px "JetBrains Mono", monospace'; c.fillText('VILLARRICA', 0, 66); c.textAlign = 'left';
    c.restore();
  }
  form.addEventListener('input', draw);
  $$('[data-fmt]', form).forEach((b) => b.addEventListener('click', () => { fmt = b.dataset.fmt; $$('[data-fmt]', form).forEach((x) => x.setAttribute('aria-checked', String(x === b))); draw(); }));
  $('[data-cert-dl]', form).addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = `cumbre-villarrica-${(form.name.value.trim() || 'certificado').toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-')}.png`;
    a.href = cv.toDataURL('image/png'); a.click();
  });
  draw();
  Promise.all([document.fonts.load('900 100px Archivo'), document.fonts.load('600 20px "JetBrains Mono"')]).then(draw, draw);
}

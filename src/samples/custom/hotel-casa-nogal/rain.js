// Lluvia sobre un vidrio antiguo. Dos lienzos: el vaho (la foto desenfocada que el cursor limpia
// y que vuelve a empañarse lentamente) y las gotas, que se forman, crecen y bajan dejando un
// surco limpio en el vaho. Las gotas actúan como lentes: muestran la foto invertida y nítida.
export function initGlass({ box, fogCv, dropCv, url, reduced, wipe = true }) {
  if (!box || !url) return;
  const img = new Image(); img.crossOrigin = 'anonymous'; img.src = url;
  img.onload = () => start(img);
  function start(img) {
    const fog = fogCv?.getContext('2d'), dc = dropCv.getContext('2d');
    const blurCv = document.createElement('canvas'), sharpCv = document.createElement('canvas');
    let W = 0, H = 0, S = 1;
    const DPR = Math.min(1.5, devicePixelRatio || 1);
    function cover(cv, w, h, scale) {
      cv.width = Math.max(1, Math.round(w * scale)); cv.height = Math.max(1, Math.round(h * scale));
      const c = cv.getContext('2d');
      const r = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const iw = img.naturalWidth * r, ih = img.naturalHeight * r;
      c.drawImage(img, (cv.width - iw) / 2, (cv.height - ih) / 2, iw, ih);
      return c;
    }
    function resize() {
      const r = box.getBoundingClientRect(); W = r.width; H = r.height; S = DPR;
      // Desenfoque barato y compatible: se dibuja muy pequeño y se vuelve a escalar
      const tiny = document.createElement('canvas'); cover(tiny, W, H, 0.035);
      blurCv.width = Math.round(W * 0.5); blurCv.height = Math.round(H * 0.5);
      const bc = blurCv.getContext('2d'); bc.imageSmoothingQuality = 'high'; bc.drawImage(tiny, 0, 0, blurCv.width, blurCv.height);
      bc.fillStyle = 'rgba(214, 222, 226, 0.16)'; bc.fillRect(0, 0, blurCv.width, blurCv.height);
      cover(sharpCv, W, H, 0.6);
      if (fog) { fogCv.width = blurCv.width; fogCv.height = blurCv.height; fog.globalCompositeOperation = 'source-over'; fog.globalAlpha = 1; fog.drawImage(blurCv, 0, 0); }
      dropCv.width = Math.round(W * S); dropCv.height = Math.round(H * S);
    }
    resize(); addEventListener('resize', resize);
    fogCv?.classList.add('is-on'); dropCv.classList.add('is-on');

    // Limpiar el vidrio con la mano
    const clear = (x, y, r) => {
      if (!fog) return;
      const k = fogCv.width / W;
      fog.globalCompositeOperation = 'destination-out'; fog.globalAlpha = 1;
      const g = fog.createRadialGradient(x * k, y * k, 0, x * k, y * k, r * k);
      g.addColorStop(0, 'rgba(0,0,0,0.9)'); g.addColorStop(0.6, 'rgba(0,0,0,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      fog.fillStyle = g; fog.beginPath(); fog.arc(x * k, y * k, r * k, 0, 6.283); fog.fill();
      fog.globalCompositeOperation = 'source-over';
    };
    let last = null;
    if (wipe) box.addEventListener('pointermove', (e) => {
      const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (last) { const d = Math.hypot(x - last[0], y - last[1]), n = Math.ceil(d / 14); for (let i = 1; i <= n; i++) clear(last[0] + ((x - last[0]) * i) / n, last[1] + ((y - last[1]) * i) / n, e.pointerType === 'mouse' ? 58 : 70); }
      last = [x, y];
      box.dataset.wiped = '1';
    });
    box.addEventListener('pointerleave', () => (last = null));

    // Gotas
    const drops = [];
    const spawn = (y) => drops.push({ x: Math.random() * W, y: y ?? Math.random() * H, r: 1.2 + Math.random() ** 2.4 * (W < 700 ? 5 : 7), v: 0, still: 30 + Math.random() * 200 });
    for (let i = 0; i < (W < 700 ? 90 : 170); i++) spawn();
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(box);
    let t = 0;
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      t++;
      // El vidrio se vuelve a empañar
      if (fog && t % 2 === 0) { fog.globalAlpha = 0.018; fog.drawImage(blurCv, 0, 0); fog.globalAlpha = 1; }
      if (drops.length < (W < 700 ? 110 : 210) && Math.random() < 0.5) spawn();
      dc.setTransform(S, 0, 0, S, 0, 0); dc.clearRect(0, 0, W, H);
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        if (!reduced) {
          if (d.r > 3.6) { if (d.still > 0) d.still--; else { d.v = Math.min(d.v + 0.05 * d.r / 4, 2.4 + d.r * 0.3); d.x += Math.sin((d.y + d.r * 30) / 40) * 0.25; } }
          d.y += d.v;
          if (d.v > 0.2) {
            clear(d.x, d.y - d.r, d.r * 1.1);
            // Al bajar recoge gotas pequeñas y deja otras atrás
            if (Math.random() < 0.03 && d.r > 3) { d.r -= 0.25; drops.push({ x: d.x + (Math.random() - 0.5) * 2, y: d.y - d.r * 2, r: 1 + Math.random() * 1.4, v: 0, still: 9999 }); }
            for (const o of drops) if (o !== d && o.v === 0 && Math.abs(o.x - d.x) < d.r && Math.abs(o.y - d.y) < d.r) { d.r = Math.min(9, Math.hypot(d.r, o.r)); o.dead = true; }
          }
        }
        if (d.dead || d.y - d.r > H) { drops.splice(i, 1); continue; }
        drawDrop(d);
      }
    })();
    function drawDrop(d) {
      const { x, y, r } = d;
      const ry = r * (d.v > 0.5 ? 1.25 : 1);
      dc.save();
      dc.beginPath(); dc.ellipse(x, y, r, ry, 0, 0, 6.283); dc.clip();
      // Lente: la foto nítida, invertida y reducida dentro de la gota
      const k = sharpCv.width / W;
      dc.translate(x, y); dc.scale(1, -1);
      const span = r * 9;
      dc.drawImage(sharpCv, (x - span / 2) * k, (y - span / 2) * k, span * k, span * k, -r * 1.05, -ry * 1.05, r * 2.1, ry * 2.1);
      dc.restore();
      // Borde y brillo
      dc.beginPath(); dc.ellipse(x, y, r, ry, 0, 0, 6.283);
      const g = dc.createRadialGradient(x - r * 0.3, y - ry * 0.4, r * 0.1, x, y, r * 1.1);
      g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.28)');
      dc.fillStyle = g; dc.fill();
    }
  }
}

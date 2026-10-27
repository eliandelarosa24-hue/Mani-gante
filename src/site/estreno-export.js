// «Su estreno» como imagen: dibuja en un lienzo la portada de prueba en computador y celular, con una marca
// discreta, para descargarla o compartirla por WhatsApp. Se dibuja a mano (sin capturar la pantalla) para que
// funcione igual en todos los navegadores, también en iPhone.
const TEXT = "'Host Grotesk Variable', system-ui, sans-serif";
const MONO = "'Fragment Mono', ui-monospace, monospace";
const DISPLAY = "'Display', Georgia, serif";
const WA = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z';

const font = (s) => s.replace(/Escena/g, 'Estreno');
const num = (re, s, d) => { const m = s.match(re); return m ? parseFloat(m[1]) : d; };

// Lee el estilo del énfasis de cada muestra (color, cursiva, degradado, sombras, giro) desde su CSS
function emStyle(css) {
  const g = css.match(/linear-gradient\(([^)]*\))*[^)]*\)/);
  let gradient = null;
  if (g) {
    const parts = g[0].slice(16, -1).split(/,(?![^(]*\))/).map((x) => x.trim());
    const angle = /deg$/.test(parts[0]) ? parseFloat(parts.shift()) : 180;
    gradient = { angle, stops: parts.map((p, i) => { const [c, pos] = p.split(/\s+/); return [c, pos ? parseFloat(pos) / 100 : i / (parts.length - 1)]; }) };
  }
  const sh = css.match(/text-shadow:([^;]+)/);
  return {
    color: css.match(/(?:^|;)color:(#[0-9a-f]{3,8})/i)?.[1] || null,
    italic: /font-style:italic/.test(css),
    weight: num(/font-weight:(\d+)/, css, null),
    family: css.match(/font-family:([^;]+)/)?.[1] ? font(css.match(/font-family:([^;]+)/)[1]) : null,
    size: num(/font-size:([\d.]+)em/, css, 1),
    tracking: css.match(/letter-spacing:(-?[\d.]+)em/) ? parseFloat(css.match(/letter-spacing:(-?[\d.]+)em/)[1]) : null,
    noUpper: /text-transform:none/.test(css),
    rotate: num(/rotate\((-?[\d.]+)deg\)/, css, 0),
    shadows: sh ? sh[1].split(',').map((x) => { const [dx, dy, , c] = x.trim().split(/\s+/); return { x: parseFloat(dx), y: parseFloat(dy), c }; }) : [],
    gradient,
  };
}

const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
function wrap(ctx, text, max) {
  const out = []; let line = '';
  for (const w of text.split(' ')) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > max && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line);
  return out;
}
const spacing = (ctx, px) => { if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`; };

// Una portada a tamaño real (1280×800 o 390×844) dibujada en (0,0)
function drawPage(ctx, kind, o) {
  const m = kind === 'm', W = m ? 390 : 1280, H = m ? 844 : 800, t = o.scene.type, em = emStyle(o.scene.em);
  // Foto: cubre todo el cuadro
  const img = o.img, ir = img.naturalWidth / img.naturalHeight, r = W / H;
  let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
  if (ir > r) { sw = sh * r; sx = (img.naturalWidth - sw) * (m ? 0.6 : 0.5); } else { sh = sw / r; sy = (img.naturalHeight - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  // Sombras para que el texto se lea
  let g;
  if (m) {
    g = ctx.createLinearGradient(0, H, 0, 0); g.addColorStop(0, 'rgba(8,7,6,.88)'); g.addColorStop(0.55, 'rgba(8,7,6,.35)'); g.addColorStop(1, 'rgba(8,7,6,.45)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  } else {
    g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(8,7,6,.72)'); g.addColorStop(0.6, 'rgba(8,7,6,.25)'); g.addColorStop(1, 'rgba(8,7,6,.1)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    g = ctx.createLinearGradient(0, H, 0, 0); g.addColorStop(0, 'rgba(8,7,6,.55)'); g.addColorStop(0.5, 'rgba(8,7,6,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  const upper = (s, isEm) => (t.upper && !(isEm && em.noUpper) ? s.toUpperCase() : s);
  const titleFont = (size) => `${t.weight} ${size}px ${font(t.family)}`;
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
  // Barra de navegación
  ctx.font = titleFont(m ? 21 : 30); spacing(ctx, t.upper ? 0.5 : -0.3);
  const logo = upper(o.name, false);
  let lw = m ? 290 : 460, shown = logo;
  while (ctx.measureText(shown).width > lw && shown.length > 3) shown = shown.slice(0, -2);
  if (shown !== logo) shown = shown.trimEnd() + '…';
  ctx.fillText(shown, m ? 22 : 56, m ? 66 : 51);
  spacing(ctx, 0);
  if (m) {
    for (let k = 0; k < 2; k++) ctx.fillRect(W - 22 - 26, 61 + k * 8, 26, 2);
  } else {
    ctx.font = `500 14px ${TEXT}`;
    const bw = ctx.measureText(o.rubro.cta).width + 36, bx = W - 56 - bw;
    rr(ctx, bx, 30, bw, 42, 21); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = '#111'; ctx.fillText(o.rubro.cta, bx + 18, 51);
    ctx.font = `400 15px ${TEXT}`; ctx.fillStyle = 'rgba(255,255,255,.85)';
    let x = bx - 36;
    for (const l of ['Contacto', 'Ubicación', o.rubro.sec, 'Inicio']) { const w = ctx.measureText(l).width; x -= w; ctx.fillText(l, x, 51); x -= 28; }
  }
  // Etiqueta de la foto
  ctx.font = `400 ${m ? 10 : 12}px ${MONO}`; spacing(ctx, 1);
  const tag = o.own ? 'Su foto' : 'Foto de muestra', tw = ctx.measureText(tag).width + 20;
  rr(ctx, W - (m ? 14 : 100) - tw, m ? 100 : 96, tw, m ? 22 : 26, 6); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText(tag, W - (m ? 14 : 100) - tw + 10, (m ? 100 : 96) + (m ? 11 : 13));
  spacing(ctx, 0);
  // Portada: se arma de abajo hacia arriba, como en la página
  const L = m ? 22 : 56, gap = m ? 16 : 22, size = (m ? 50 : 104) * t.size, lh = t.lh * size;
  let y = H - (m ? 44 : 74);
  const bh = m ? 46 : 50;
  ctx.font = `500 ${m ? 14 : 15}px ${TEXT}`;
  const cw = ctx.measureText(o.rubro.cta).width + (m ? 36 : 48);
  rr(ctx, L, y - bh, cw, bh, bh / 2); ctx.fillStyle = o.scene.accent; ctx.fill();
  ctx.fillStyle = '#111'; ctx.fillText(o.rubro.cta, L + (m ? 18 : 24), y - bh / 2);
  if (!m) {
    const ww = ctx.measureText('WhatsApp').width + 48;
    rr(ctx, L + cw + 12, y - bh, ww, bh, bh / 2); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillText('WhatsApp', L + cw + 36, y - bh / 2);
  }
  y -= bh + gap;
  const subSize = m ? 15 : 19;
  ctx.font = `400 ${subSize}px ${TEXT}`;
  const sub = wrap(ctx, `${o.rubro.sub}${o.lugar ? ` en ${o.lugar}` : ''}. Reserve directo, sin comisiones.`, m ? W - 44 : 30 * subSize);
  ctx.fillStyle = 'rgba(255,255,255,.86)';
  sub.reverse().forEach((line) => { ctx.fillText(line, L, y - subSize * 0.725); y -= subSize * 1.45; });
  sub.reverse();
  y -= gap - subSize * 0.0;
  // Titular, con el énfasis de la muestra; las líneas largas saltan como en la página
  const lines = o.rubro.title.split(/<br\s*\/?>/).map((ln) => ln.split(/(<em>.*?<\/em>)/).filter(Boolean).map((seg) => ({ em: seg.startsWith('<em>'), text: seg.replace(/<\/?em>/g, '') })));
  const setFont = (isEm) => {
    const sz = isEm ? size * em.size : size;
    ctx.font = isEm ? `${em.italic ? 'italic ' : ''}${em.weight || t.weight} ${sz}px ${em.family || font(t.family)}` : titleFont(sz);
    spacing(ctx, (isEm && em.tracking !== null ? em.tracking : parseFloat(t.tracking)) * sz);
    return sz;
  };
  const maxW = m ? W - 44 : 760, rows = [];
  lines.forEach((segs) => {
    rows.push([]); let rowW = 0;
    for (const sg of segs) for (const word of sg.text.split(/(\s+)/).filter(Boolean)) {
      setFont(sg.em);
      const txt = upper(word, sg.em), w = ctx.measureText(txt).width, blank = /^\s+$/.test(word);
      if (blank) { if (rowW) { rows.at(-1).push({ txt, em: sg.em, w }); rowW += w; } continue; }
      if (rowW + w > maxW && rowW) {
        const r = rows.at(-1);
        if (/^\s+$/.test(r.at(-1).txt)) r.pop();
        rows.push([]); rowW = 0;
      }
      rows.at(-1).push({ txt, em: sg.em, w }); rowW += w;
    }
  });
  const top = y - rows.length * lh;
  rows.forEach((toks, i) => {
    const base = top + i * lh + lh / 2;
    let x = L;
    for (const tk of toks) {
      const sz = setFont(tk.em), w = tk.w, isEm = tk.em, txt = tk.txt;
      ctx.save();
      if (isEm && em.rotate) { ctx.translate(x + w / 2, base); ctx.rotate((em.rotate * Math.PI) / 180); ctx.translate(-(x + w / 2), -base); }
      if (isEm) for (const d of [...em.shadows].reverse()) { ctx.fillStyle = d.c; ctx.fillText(txt, x + d.x * sz, base + d.y * sz); }
      if (isEm && em.gradient) {
        const a = (em.gradient.angle * Math.PI) / 180, dx = Math.sin(a), dy = -Math.cos(a), len = Math.abs(w * dx) + Math.abs(sz * dy), cx = x + w / 2;
        const gr = ctx.createLinearGradient(cx - (dx * len) / 2, base - (dy * len) / 2, cx + (dx * len) / 2, base + (dy * len) / 2);
        em.gradient.stops.forEach(([c, p]) => gr.addColorStop(Math.min(1, Math.max(0, p)), c));
        ctx.fillStyle = gr;
      } else ctx.fillStyle = isEm && em.color ? em.color : '#fff';
      ctx.fillText(txt, x, base);
      ctx.restore();
      x += w;
    }
  });
  spacing(ctx, 0);
  y = top - gap;
  ctx.font = `500 ${m ? 11 : 13}px ${MONO}`; spacing(ctx, (m ? 11 : 13) * 0.22);
  ctx.fillStyle = o.scene.accent;
  ctx.fillText([o.rubro.label, o.lugar].filter(Boolean).join(' · ').toUpperCase(), L, y - (m ? 6 : 7));
  spacing(ctx, 0);
  // Botón de WhatsApp flotante
  const rad = m ? 24 : 28, cx = W - (m ? 16 : 26) - rad, cy = H - (m ? 16 : 26) - rad;
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fillStyle = '#25d366'; ctx.fill();
  ctx.save(); const k = (m ? 26 : 30) / 24; ctx.translate(cx - 12 * k, cy - 12 * k); ctx.scale(k, k); ctx.fillStyle = '#fff'; ctx.fill(new Path2D(WA)); ctx.restore();
}

// Lámina final: navegador y celular sobre el negro mate, con una línea de marca
export async function exportPortada(o) {
  const S = 1.5, W = 1600, H = 1000;
  const sc = o.scene, em = emStyle(sc.em);
  await Promise.all([
    document.fonts.load(`${sc.type.weight} 40px ${font(sc.type.family)}`, o.name + o.rubro.title),
    document.fonts.load(`${em.italic ? 'italic ' : ''}${em.weight || sc.type.weight} 40px ${em.family || font(sc.type.family)}`, o.rubro.title),
    document.fonts.load(`300 40px ${DISPLAY}`), document.fonts.load(`400 14px ${MONO}`), document.fonts.load(`500 14px ${TEXT}`),
  ]).catch(() => {});
  const cv = document.createElement('canvas');
  cv.width = W * S; cv.height = H * S;
  const ctx = cv.getContext('2d');
  ctx.scale(S, S);
  ctx.fillStyle = '#0c0b0a'; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, -100, 50, W / 2, -100, 900);
  glow.addColorStop(0, 'rgba(150,35,54,.45)'); glow.addColorStop(1, 'rgba(150,35,54,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  // Encabezado
  ctx.textBaseline = 'middle';
  ctx.font = `400 14px ${MONO}`; spacing(ctx, 3); ctx.fillStyle = 'rgba(236,229,216,.62)';
  ctx.fillText('SU ESTRENO · PORTADA DE PRUEBA', 70, 62);
  spacing(ctx, 0);
  ctx.font = `300 34px ${DISPLAY}`; ctx.fillStyle = '#ece5d8'; ctx.textAlign = 'right';
  ctx.fillText('Red Vaeru', W - 70, 60); ctx.textAlign = 'left';
  // Navegador
  const bx = 70, by = 104, bw = 1130, bh = Math.round(bw / 1.6), bar = 36;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 30;
  rr(ctx, bx, by, bw, bh + bar, 12); ctx.fillStyle = '#151311'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, bx, by, bw, bh + bar, 12); ctx.clip();
  ctx.fillStyle = '#151311'; ctx.fillRect(bx, by, bw, bar);
  [0, 1, 2].forEach((k) => { ctx.beginPath(); ctx.arc(bx + 20 + k * 16, by + bar / 2, 5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(236,229,216,.26)'; ctx.fill(); });
  ctx.font = `400 13px ${MONO}`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(236,229,216,.8)';
  ctx.fillText(o.url, bx + bw / 2, by + bar / 2); ctx.textAlign = 'left';
  ctx.translate(bx, by + bar); ctx.scale(bw / 1280, bh / 800);
  drawPage(ctx, 'd', o);
  ctx.restore();
  // Celular
  const pw = 300, ph = Math.round((pw * 844) / 390), px = 1230, py = 296;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24;
  rr(ctx, px - 8, py - 8, pw + 16, ph + 16, 44); ctx.fillStyle = '#1b1917'; ctx.fill(); ctx.restore();
  rr(ctx, px - 8, py - 8, pw + 16, ph + 16, 44); ctx.strokeStyle = 'rgba(236,229,216,.26)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.save(); rr(ctx, px, py, pw, ph, 36); ctx.clip();
  ctx.translate(px, py); ctx.scale(pw / 390, ph / 844);
  drawPage(ctx, 'm', o);
  ctx.restore();
  rr(ctx, px + pw * 0.35, py + 12, pw * 0.3, 18, 9); ctx.fillStyle = '#0b0a09'; ctx.fill();
  // Pie con la marca
  ctx.font = `400 13px ${MONO}`; spacing(ctx, 1.6); ctx.fillStyle = 'rgba(236,229,216,.6)';
  ctx.fillText(`PORTADA DE PRUEBA · ${o.name.toUpperCase()}`.slice(0, 70), 70, H - 50);
  ctx.textAlign = 'right';
  ctx.fillText(`HECHA CON SU ESTRENO · RED VAERU · ${location.host.toUpperCase()}`, 1200, H - 50);
  ctx.textAlign = 'left'; spacing(ctx, 0);
  return new Promise((r) => cv.toBlob(r, 'image/jpeg', 0.9));
}

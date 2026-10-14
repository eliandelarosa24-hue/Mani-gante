// Genera la página de la agenda de contenido (out/hub/index.html) que se publica como Artifact.
// Los archivos se publican al lado de la página, en media/<ruta dentro de out/>.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { PIECES, KITS, fbText } from './manifest.mjs';
import { OUT } from './lib.mjs';

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const dayLabel = (iso) => { const d = new Date(iso + 'T12:00:00'); const s = `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`; return s[0].toUpperCase() + s.slice(1); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const name = (f) => f.split('/').pop();

const missing = [...PIECES.flatMap((p) => [...p.files, ...(p.filesB || [])]), ...KITS.flatMap((k) => k.files)].filter((f) => !existsSync(OUT + f));
if (missing.length) { console.error('Faltan archivos:\n' + missing.join('\n')); process.exit(1); }

const media = (f, cover) => {
  const src = f;
  const isVid = f.endsWith('.mp4');
  return `<figure class="m ${isVid ? 'm--v' : ''} ${/1080x1080|portada-facebook|foto-perfil/.test(f) ? 'm--sq' : ''} ${/_1080x1920|historias|destacadas|portadas-reels/.test(f) ? 'm--tall' : ''} ${/avisos\//.test(f) ? 'm--wide' : ''}">
    ${isVid ? `<video src="${src}" ${cover ? `poster="${cover}"` : ''} controls playsinline preload="none"></video>` : `<img src="${src}" alt="${esc(name(f))}" loading="lazy">`}
    <figcaption><span>${esc(name(f))}</span><button class="dl" type="button" data-file="${src}" data-name="${esc(name(f))}">Descargar</button></figcaption></figure>`;
};
const strip = (files) => {
  const cover = files.find((f) => f.startsWith('portadas-reels/'));
  return `<div class="strip">${files.map((f) => media(f, f.endsWith('.mp4') ? cover : null)).join('')}</div>`;
};
const copyBlock = (label, text, id) => `<div class="copy"><div class="copy__head"><span>${label}</span><button type="button" class="cp" data-target="${id}">Copiar</button></div><pre id="${id}">${esc(text)}</pre></div>`;

const byDay = {};
for (const p of PIECES) (byDay[p.day] ||= []).push(p);

const pieceHtml = (p) => {
  const times = p.fbTime && p.where.includes('Facebook') ? `<span class="t">${p.time} IG</span><span class="t t--fb">${p.fbTime} FB</span>` : `<span class="t">${p.time}</span>`;
  const texts = p.ig ? (p.noFb || !p.where.includes('Facebook')
    ? copyBlock('Texto', p.ig, `${p.id}-t`)
    : copyBlock('Texto Instagram', p.ig, `${p.id}-ig`) + copyBlock('Texto Facebook', fbText(p), `${p.id}-fb`)) : '';
  return `<article class="piece" id="${p.id}" data-piece="${p.id}">
    <header class="piece__head">
      <div class="times">${times}</div>
      <div class="piece__meta"><span class="code">${p.id}</span><span>${esc(p.format)}</span><span>${esc(p.where.join(' · '))}</span></div>
      <h3>${esc(p.title)}</h3>
      <label class="done"><input type="checkbox" id="done-${p.id}" data-done="${p.id}"> Publicado</label>
    </header>
    ${strip(p.files)}
    ${p.notes ? `<p class="note">${esc(p.notes)}</p>` : ''}
    ${texts ? `<div class="texts">${texts}</div>` : ''}
    ${p.filesB ? `<details class="ab"><summary>Variante B para probar (cambia solo el gancho)</summary>${strip(p.filesB)}</details>` : ''}
  </article>`;
};

const total = PIECES.length;
const html = `<title>Agenda Red Vaeru</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Manrope:wght@400;500;600;700&display=swap">
<style>
/* Agenda de publicación: una columna por día, cada pieza con sus archivos y sus textos listos para copiar.
   Look único y deliberado: el oscuro de la marca (tinta, crema y dorado), igual en tema claro y oscuro. */
:root{
  --ink:#0B110E; --ink-2:#121B16; --ink-3:#1B2721; --line:rgba(242,235,223,.13);
  --cream:#F2EBDF; --muted:rgba(242,235,223,.66); --gold:#C4A35A; --gold-2:#E3C98A; --ok:#7FB59A;
  --display:'Fraunces',Georgia,'Times New Roman',serif; --body:'Manrope',system-ui,-apple-system,'Segoe UI',sans-serif;
  color-scheme:dark;
}
*{box-sizing:border-box}
body{background:var(--ink);color:var(--cream);font:15px/1.55 var(--body);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 64px}
.wrap{max-width:980px;margin:0 auto}
.top{padding-block:40px 28px;border-bottom:1px solid var(--line);display:grid;gap:14px}
.eyebrow{font-weight:700;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
h1{font:500 clamp(34px,6vw,54px)/1.04 var(--display);margin:0;text-wrap:balance}
h1 em{color:var(--gold);font-style:italic}
.lead{color:var(--muted);max-width:62ch;margin:0}
.progress{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.bar{flex:1;min-width:160px;height:8px;border-radius:99px;background:var(--ink-3);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--gold);transition:width .3s}
.count{font-variant-numeric:tabular-nums;font-weight:700;color:var(--gold-2)}
.rules{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin:0;padding:0;list-style:none;color:var(--muted);font-size:13.5px}
.rules li{border-left:2px solid var(--gold);padding-left:10px}
.nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--ink);display:flex;gap:8px;overflow-x:auto;padding-block:12px;border-bottom:1px solid var(--line)}
.nav a{flex:none;color:var(--cream);text-decoration:none;border:1px solid var(--line);border-radius:99px;padding:6px 12px;font-size:13px;font-weight:600;white-space:nowrap}
.nav a:focus-visible,.nav a:hover{border-color:var(--gold);color:var(--gold-2)}
.day{padding-block:34px 6px;display:grid;gap:18px}
.day h2{font:500 28px/1.1 var(--display);margin:0}
.day h2 small{display:block;font:700 12px/1.4 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.piece{background:var(--ink-2);border:1px solid var(--line);border-radius:18px;padding:18px;display:grid;gap:14px;min-width:0}
.piece.is-done{opacity:.55}
.piece__head{display:grid;grid-template-columns:auto 1fr auto;gap:6px 14px;align-items:center}
.times{display:flex;gap:6px;grid-row:span 2}
.t{font:600 22px/1 var(--display);font-variant-numeric:tabular-nums;color:var(--gold-2);background:var(--ink-3);border-radius:10px;padding:8px 10px}
.t--fb{font-size:15px;align-self:center;color:var(--muted)}
.piece__meta{display:flex;flex-wrap:wrap;gap:6px 12px;font-size:12.5px;color:var(--muted);min-width:0}
.code{font-weight:700;color:var(--gold)}
.piece h3{margin:0;font:500 20px/1.2 var(--display);grid-column:2;min-width:0}
.done{grid-column:3;grid-row:1/span 2;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;white-space:nowrap}
.done input{width:20px;height:20px;accent-color:var(--gold)}
.strip{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x proximity}
.m{flex:none;margin:0;width:180px;scroll-snap-align:start;display:grid;gap:6px}
.m--tall{width:150px} .m--wide{width:260px} .m--sq{width:190px} .m--v{width:190px}
.m img,.m video{width:100%;max-width:100%;border-radius:10px;background:var(--ink-3);display:block}
.m--v video{aspect-ratio:9/16;object-fit:cover}
.m figcaption{display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:11.5px;color:var(--muted);min-width:0}
.m figcaption span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
button{font:inherit;cursor:pointer}
.dl,.cp{flex:none;border:1px solid var(--gold);background:transparent;color:var(--gold-2);border-radius:99px;padding:4px 10px;font-size:12px;font-weight:700}
.dl:hover,.cp:hover,.dl:focus-visible,.cp:focus-visible{background:var(--gold);color:var(--ink);outline:none}
.dl[hidden]{display:none}
.note{margin:0;font-size:13.5px;color:var(--cream);background:var(--ink-3);border-radius:10px;padding:10px 12px}
.texts{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.copy{border:1px solid var(--line);border-radius:12px;overflow:hidden;min-width:0}
.copy__head{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--ink-3);font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--gold)}
.copy pre{margin:0;padding:12px;white-space:pre-wrap;word-break:break-word;font:13.5px/1.55 var(--body);max-height:260px;overflow:auto}
.ab summary{cursor:pointer;font-size:13px;font-weight:700;color:var(--gold-2);padding:4px 0}
.ab .strip{margin-top:10px}
.kits{padding-block:40px 0;display:grid;gap:18px}
.kits h2{font:500 28px/1.1 var(--display);margin:0}
.toast{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--gold);color:var(--ink);font-weight:700;padding:10px 16px;border-radius:99px;font-size:14px}
.hint{font-size:12.5px;color:var(--muted)}
@media (max-width:560px){.piece__head{grid-template-columns:1fr auto}.times{grid-row:auto;grid-column:1}.piece h3,.piece__meta{grid-column:1/-1}.done{grid-column:2;grid-row:1}}
@media (prefers-reduced-motion:reduce){.bar i{transition:none}}
</style>
<div class="wrap">
  <header class="top">
    <span class="eyebrow">Red Vaeru · campaña «Su web lista antes del verano»</span>
    <h1>Agenda de contenido <em>15 al 25 de octubre</em></h1>
    <p class="lead">Todo el contenido de la campaña, listo para publicar desde el celular: descargue cada archivo, copie el texto y márquelo como publicado. Las horas son de Chile continental.</p>
    <div class="progress"><div class="bar" aria-hidden="true"><i id="bar"></i></div><span class="count" id="count">0 de ${total} publicadas</span></div>
    <ul class="rules">
      <li>Los Reels van sin música: agréguela en Instagram desde su biblioteca al publicar.</li>
      <li>Las muestras de concepto siempre se presentan como muestras, nunca como clientes.</li>
      <li>En las historias de cupos, publique solo la versión con el número real.</li>
      <li>Facebook: suba los videos e imágenes directamente, no los comparta desde Instagram.</li>
    </ul>
    <p class="hint" id="dlhint" hidden>Si el botón Descargar no funciona aquí, mantenga presionada la imagen o abra el video para guardarlo.</p>
  </header>
  <nav class="nav" aria-label="Días">${Object.keys(byDay).map((d) => `<a href="#d${d.replace(/-/g, '')}">${dayLabel(d).replace(/ de \w+$/, '')}</a>`).join('')}<a href="#kits">Perfil y anuncios</a></nav>
  ${Object.entries(byDay).map(([d, ps]) => `<section class="day" id="d${d.replace(/-/g, '')}"><h2><small>${d < '2026-10-19' ? 'Preparación' : 'Semana de campaña'}</small>${dayLabel(d)}</h2>${ps.map(pieceHtml).join('')}</section>`).join('')}
  <section class="kits" id="kits"><h2>Perfil y anuncios</h2>
    ${KITS.map((k) => `<article class="piece"><header class="piece__head"><h3 style="grid-column:1/-1">${esc(k.title)}</h3></header>${strip(k.files)}<p class="note">${esc(k.note)}</p></article>`).join('')}
  </section>
</div>
<script>
(() => {
  const KEY = 'redvaeru-agenda-publicadas';
  let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { done = {}; }
  const total = ${total};
  const paint = () => {
    let n = 0;
    document.querySelectorAll('[data-done]').forEach((cb) => {
      const on = !!done[cb.dataset.done]; cb.checked = on; if (on) n++;
      cb.closest('.piece').classList.toggle('is-done', on);
    });
    document.getElementById('count').textContent = n + ' de ' + total + ' publicadas';
    document.getElementById('bar').style.width = (n / total * 100) + '%';
  };
  document.addEventListener('change', (e) => {
    const cb = e.target.closest('[data-done]'); if (!cb) return;
    done[cb.dataset.done] = cb.checked;
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (err) {}
    paint();
  });
  paint();

  let toastT;
  const toast = (msg) => {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 2200);
  };

  document.addEventListener('click', async (e) => {
    const cp = e.target.closest('.cp');
    if (cp) {
      const pre = document.getElementById(cp.dataset.target);
      try { await navigator.clipboard.writeText(pre.textContent); toast('Texto copiado'); }
      catch (err) { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Texto seleccionado: cópielo'); }
      return;
    }
    const dl = e.target.closest('.dl');
    if (dl && downloads) {
      dl.disabled = true; const label = dl.textContent; dl.textContent = '…';
      try {
        const res = await fetch(dl.dataset.file);
        if (!res.ok) throw new Error('fetch');
        await downloads.save({ filename: dl.dataset.name, data: await res.blob() });
        toast('Archivo guardado');
      } catch (err) {
        const code = err && err.code;
        if (code === 'declined') {} else if (code === 'rate_limited') toast('Espere un momento y vuelva a intentarlo');
        else if (code === 'unavailable' || code === 'not_granted') { hideDownloads(); }
        else toast('No se pudo descargar el archivo');
      } finally { dl.disabled = false; dl.textContent = label; }
    }
  });

  let downloads = null;
  const hideDownloads = () => { document.querySelectorAll('.dl').forEach((b) => { b.hidden = true; }); document.getElementById('dlhint').hidden = false; };
  document.querySelectorAll('.dl').forEach((b) => { b.hidden = true; });
  const use = window.claude && window.claude.use;
  if (use) {
    window.claude.use('downloads').then((d) => {
      downloads = d;
      if (d) document.querySelectorAll('.dl').forEach((b) => { b.hidden = false; }); else hideDownloads();
    }).catch(hideDownloads);
  } else hideDownloads();
})();
</script>`;

mkdirSync(OUT + 'hub', { recursive: true });
writeFileSync(OUT + 'hub/index.html', html);
const files = [...new Set([...PIECES.flatMap((p) => [...p.files, ...(p.filesB || [])]), ...KITS.flatMap((k) => k.files)])];
writeFileSync(OUT + 'hub/files.json', JSON.stringify(Object.fromEntries(files.map((f) => [`media/${f}`, f])), null, 1));
console.log(`✓ hub/index.html · ${PIECES.length} piezas · ${files.length} archivos`);

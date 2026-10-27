// Marcado de las obras compartido entre la portada (lo inserta Vite en <!--RV:SCENES--> y <!--RV:REAL-->)
// y el generador de Trabajos. Cada titular va en la tipografía real de su sitio.
import { SCENES, REAL } from './scenes.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const strip = (s) => String(s).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export const titleStyle = (s) => [
  `font-family:${s.type.family}`, `font-weight:${s.type.weight}`, `--t-size:${s.type.size}`, `letter-spacing:${s.type.tracking}`,
  `line-height:${s.type.lh}`, s.type.upper ? 'text-transform:uppercase' : '', s.type.stretch ? `font-stretch:${s.type.stretch}` : '',
].filter(Boolean).join(';');
export const titleHtml = (s, cls = 'wtitle', text = s.title) => `<span class="${cls}" style="${titleStyle(s)}">${text.replace(/<em>/g, `<em style="${s.em}">`)}</span>`;

export function scenesMarkup() {
  return SCENES.map((s, i) => `
      <article class="scene" data-scene data-slug="${s.slug}" style="--accent:${s.accent}" aria-labelledby="sc-${s.slug}">
        <picture><source media="(min-width: 821px)" srcset="${s.image}" /><img class="scene__img" src="/img/escenas/${s.slug}-900.webp" alt="" width="1920" height="1080" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" /></picture>
        <a class="scene__phone" href="${s.sample}" tabindex="-1" aria-hidden="true"><video data-msrc="${s.site.m}" muted loop playsinline preload="none" data-poster="${s.site.m}.jpg"></video></a>
        <div class="scene__in">
          <p class="scene__kicker" data-scene-fade><span>Nº ${s.n} / ${String(SCENES.length).padStart(2, '0')} · Ficción</span><span>${esc(s.kind)}</span><span>${esc(s.town)} · ${s.coords}</span></p>
          <h2 class="scene__title" id="sc-${s.slug}"><span class="sr">${esc(s.name)}: </span>${titleHtml(s, 'wtitle', s.title)}</h2>
          <div class="scene__foot" data-scene-fade>
            <p class="scene__concept"><b>${esc(s.name)} · muestra de concepto · negocio ficticio</b><span>${esc(s.concept)}</span></p>
            <div class="scene__ctas">
              <a class="scene__cta" href="${s.case}" data-cursor="Ver caso">Ver el caso<span class="sr"> de ${esc(s.name)}</span> <span aria-hidden="true">→</span></a>
              <a class="scene__cta scene__cta--ghost" href="${s.sample}">Entrar al sitio<span class="sr"> de ${esc(s.name)}</span> <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </article>`).join('');
}

// Riel de latitud: escala quebrada (el Caribe y el centro de Chile comprimidos; La Araucanía, amplia)
const STOPS = [[19.4, 0], [0, 0.1], [-34, 0.19], [-38.5, 0.27], [-40, 0.84], [-41.3, 1]];
export function latY(lat) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ya] = STOPS[i], [b, yb] = STOPS[i + 1];
    if (lat <= a && lat >= b) return ya + ((a - lat) / (a - b)) * (yb - ya);
  }
  return lat > 0 ? 0 : 1;
}
export function railMarkup() {
  const seen = {};
  const dots = SCENES.map((s) => {
    const y = latY(s.lat), key = y.toFixed(2), off = (seen[key] = (seen[key] ?? -1) + 1);
    return `<button type="button" class="rail__dot" data-tick style="--y:${(y * 100).toFixed(2)}%;--x:${off * -14}px" aria-label="Ir a ${esc(s.name)}, ${s.coords}"><i style="--c:${s.accent}"></i></button>`;
  }).join('');
  return `<span class="rail__end">19° N</span><span class="rail__eq" style="--y:${(latY(0) * 100).toFixed(2)}%"><b>0°</b></span><span class="rail__cut" style="--y:${(latY(-17) * 100).toFixed(2)}%" aria-hidden="true">//</span>${dots}<span class="rail__end rail__end--s">41° S</span>`;
}

export function ticksMarkup() {
  return SCENES.map((s, i) => `<button type="button" class="tick" data-tick aria-current="${i === 0}" aria-label="Ir a ${esc(s.name)}"><span>${s.n}</span><i style="background:${s.accent}"></i></button>`).join('');
}

export function realMarkup() {
  return REAL.map((r, i) => `
        <li class="doc__it">
          <div class="doc__duo">
            <a class="doc__screen" href="${r.url}" target="_blank" rel="noopener" data-cursor="Abrir ↗" aria-label="Abrir el sitio de ${esc(r.name)} (se abre en otra pestaña)"><span class="doc__bar" aria-hidden="true"><i></i><i></i><i></i><em>${esc(new URL(r.url).host)}</em></span><video data-src="${r.site.d}" muted loop playsinline preload="none" data-poster="${r.site.d}.jpg" aria-hidden="true"></video></a>
            <span class="doc__phone" aria-hidden="true"><span class="doc__notch"></span><video data-src="${r.site.m}" muted loop playsinline preload="none" data-poster="${r.site.m}.jpg"></video></span>
          </div>
          <div class="doc__third">
            <p class="doc__k"><span>Nº ${String(i + 1).padStart(2, '0')} / ${String(REAL.length).padStart(2, '0')} · Documental</span><span>${esc(r.town)} · ${r.coords}</span></p>
            <h3 class="doc__name">${esc(r.name)}</h3>
            <p class="doc__meta">${esc(r.kind)} · ${esc(r.label)} · En el aire</p>
            <p class="doc__note">${esc(r.note || '')}</p>
            <a class="doc__url" href="${r.url}" target="_blank" rel="noopener">${esc(new URL(r.url).host)} <span aria-hidden="true">↗</span></a>
          </div>
        </li>`).join('');
}

// Testimonio real, a toda pantalla: cada palabra se enciende al bajar
export function voiceMarkup() {
  const r = REAL.find((x) => x.quote);
  if (!r) return '';
  return `<figure class="voice">
        <p class="voice__k"><span>Testimonio</span><span>${esc(r.label)} · ${esc(r.town)}</span></p>
        <blockquote class="voice__q" data-voice><p>${esc(r.quote)}</p></blockquote>
        <figcaption class="voice__by"><b>${esc(r.by)}</b><span>${esc(r.role)}</span><a href="${r.url}" target="_blank" rel="noopener">${esc(new URL(r.url).host)} <span aria-hidden="true">↗</span></a></figcaption>
      </figure>`;
}

// Mapa de latitudes del Estudio: lugares agrupados cuando quedan muy cerca en la escala
export function latMapMarkup() {
  const pts = [...SCENES.map((s) => ({ lat: s.lat, town: s.town, name: s.name, real: false, coords: s.coords })), ...REAL.map((r) => ({ lat: r.lat, town: r.town, name: r.name, real: true, coords: r.coords }))]
    .map((p) => ({ ...p, y: latY(p.lat) })).sort((a, b) => a.y - b.y);
  const rows = [];
  for (const p of pts) {
    const last = rows[rows.length - 1];
    if (last && p.y - last.y < 0.03) last.items.push(p); else rows.push({ y: p.y, lat: p.coords.split(' ').slice(0, 2).join(' '), items: [p] });
  }
  const eq = `<span class="lat__eq" style="--y:${(latY(0) * 100).toFixed(2)}%"><span>Ecuador · 0°</span></span>`;
  return eq + rows.map((r) => {
    const towns = [...new Set(r.items.map((i) => i.town))].join(' · ');
    const names = r.items.map((i) => (i.real ? `<em style="font-style:normal;color:var(--fl)">${esc(i.name)}</em>` : esc(i.name))).join(' · ');
    return `<p class="lat__pt${r.items.some((i) => i.real) ? ' lat__pt--real' : ''}" style="--y:${(r.y * 100).toFixed(2)}%"><b>${r.lat}</b><span>${esc(towns)}</span><small>${names}</small></p>`;
  }).join('');
}

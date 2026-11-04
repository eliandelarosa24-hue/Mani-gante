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

// Túnel de la portada: las obras vuelan desde el fondo del proyector hacia quien mira (lo anima home.js).
// Cada tarjeta lleva la palabra que toma el titular cuando pasa: «Proyectamos cabañas.», «Proyectamos termas.»…
const TUNNEL = [
  ['miah', 'refugios.'], ['villa-coral-samana', 'villas.'], ['termas-rayenko', 'termas.'], ['poetas', 'hostales.'],
  ['vina-los-robles', 'viñas.'], ['domos-cielo-austral', 'domos.'], ['cabanas-lago-azul', 'cabañas.'], ['manigante', 'dulces.'],
  ['fogon-mapu', 'cocinas.'], ['hotel-casa-nogal', 'hoteles.'], ['pucon-aventura', 'aventuras.'], ['kuchen-haus-frutillar', 'cafés.'],
  ['estudio-haber', 'oficios.'],
];
export function tunnelMarkup() {
  return TUNNEL.map(([slug, word]) => {
    const s = SCENES.find((x) => x.slug === slug), r = REAL.find((x) => x.slug === slug);
    const w = s || r;
    const href = s ? s.case : r.url, ext = r ? ' target="_blank" rel="noopener"' : '';
    const kick = s ? `Nº ${s.n} · Muestra` : r.label;
    return `<a class="tn" href="${href}"${ext} tabindex="-1" style="--acc:${s ? s.accent : '#e8c9a0'}" data-word="${word}" data-cursor="${s ? 'Ver el caso' : 'Abrir ↗'}">
          <picture><source type="image/avif" data-srcset="/img/tunel/${slug}.avif" /><img data-src="/img/tunel/${slug}.webp" alt="" width="400" height="500" decoding="async" /></picture>
          <span class="tn__k">${esc(kick)}</span>
          <span class="tn__t"><b>${esc(w.name)}</b><small>${esc(s ? s.town : r.town)}</small></span>
        </a>`;
  }).join('\n        ');
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
// Vitrina de la portada: las trece marcas en un anillo que gira con el scroll (lo anima home.js). Cada ventana
// muestra su sitio; al frente, su logo, «Visitar el sitio» y el caso. Las muestras se presentan como lo que son.
const RING = ['miah', 'villa-coral-samana', 'termas-rayenko', 'poetas', 'vina-los-robles', 'domos-cielo-austral', 'manigante',
  'cabanas-lago-azul', 'fogon-mapu', 'hotel-casa-nogal', 'pucon-aventura', 'kuchen-haus-frutillar', 'estudio-haber'];
// Tamaño de cada logo (/img/marcas, sacados de su propio sitio y pasados a un solo color)
const LOGO = { 'cabanas-lago-azul': [437, 74], 'domos-cielo-austral': [698, 108], 'estudio-haber': [685, 98], 'fogon-mapu': [609, 108], 'hotel-casa-nogal': [376, 117], 'kuchen-haus-frutillar': [496, 150], manigante: [443, 42], miah: [305, 43], poetas: [189, 115], 'pucon-aventura': [425, 102], 'termas-rayenko': [375, 107], 'villa-coral-samana': [648, 114], 'vina-los-robles': [744, 126] };
export const BRANDS = RING.map((slug) => {
  const s = SCENES.find((x) => x.slug === slug), r = REAL.find((x) => x.slug === slug);
  const [w, h] = LOGO[slug];
  return s
    ? { slug, name: s.name, label: 'Muestra de concepto', kind: s.kind, town: s.town, visit: s.sample, ext: false, host: `redvaeru.netlify.app${s.sample}`, more: s.case, moreLabel: 'Ver el caso', video: s.site, w, h }
    : { slug, name: r.name, label: r.label, kind: r.kind, town: r.town, visit: r.url, ext: true, host: new URL(r.url).host, more: '#documental', moreLabel: 'Ver el documental', video: r.site, w, h };
});
const logo = (b, cls, alt) => `<img class="${cls}" src="/img/marcas/${b.slug}.webp" alt="${alt}" width="${b.w}" height="${b.h}" loading="lazy" decoding="async" />`;
const visit = (b) => `href="${b.visit}" target="_blank" rel="noopener"`;

export function ringMarkup() {
  const b = BRANDS[0], n = String(BRANDS.length).padStart(2, '0');
  const wins = BRANDS.map((x, i) => `<figure class="rw" style="--i:${i}" data-rw>
            <span class="rw__bar"><i></i><i></i><i></i><em data-host="${esc(x.host)}"></em></span>
            <span class="rw__screen"><picture><source media="(max-width: 767px)" type="image/avif" data-srcset="/img/vitrina/${x.slug}-m.avif" /><source media="(max-width: 767px)" data-srcset="/img/vitrina/${x.slug}-m.webp" /><source type="image/avif" data-srcset="/img/vitrina/${x.slug}-d.avif" /><img data-src="/img/vitrina/${x.slug}-d.webp" alt="" width="720" height="450" decoding="async" /></picture></span>
          </figure>`).join('\n          ');
  const dots = BRANDS.map((x, i) => `<li><button type="button" class="ri" data-ri="${i}"${i ? '' : ' aria-current="true"'}>${logo(x, 'ri__logo', '')}<span class="sr">${esc(x.name)}</span></button></li>`).join('');
  const data = BRANDS.map(({ slug, name, label, kind, town, visit: v, ext, more, moreLabel, video }) => ({ slug, name, label, kind, town, visit: v, ext, more, moreLabel, video }));
  return `<header class="ring__head">
        <p class="eyebrow">La vitrina</p>
        <h2 id="vitrina" class="ring__title">Trece marcas, <em>una vitrina.</em></h2>
        <p class="ring__sub">Diez muestras de concepto y tres sitios reales en el aire. Cada una, con su sitio funcionando.</p>
        <p class="ring__count" aria-hidden="true"><b data-ring-n>01</b> / ${n}</p>
      </header>
      <div class="ring__stage" aria-hidden="true">
        <div class="ring__wheel" data-wheel>
          ${wins}
        </div>
      </div>
      <div class="ring__now" data-ring-now>
        ${logo(b, 'ring__logo', esc(b.name)).replace('loading="lazy" ', '')}
        <p class="ring__meta"><span data-ring-label>${esc(b.label)}</span> · <span data-ring-kind>${esc(b.kind)} · ${esc(b.town)}</span></p>
        <p class="ring__acts"><a class="btn btn--accent" ${visit(b)} data-ring-visit data-magnetic>Visitar el sitio<span class="sr" data-ring-of> de ${esc(b.name)} (se abre en otra pestaña)</span> <span aria-hidden="true">↗</span></a><a class="btn btn--line" href="${b.more}" data-ring-more><span data-ring-more-l>${b.moreLabel}</span> <span aria-hidden="true">→</span></a></p>
      </div>
      <nav class="ring__index" aria-label="Las trece marcas de la vitrina"><ol>${dots}</ol></nav>
      <script type="application/json" data-ring-data>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
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

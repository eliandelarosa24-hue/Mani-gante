// Genera /trabajos/ (índice) y /trabajos/<slug>/ (un caso por obra) a partir de src/site/scenes.js.
// Se ejecuta antes de `vite` y `vite build` (npm run pages). Las páginas generadas no se versionan.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES, REAL } from '../src/site/scenes.js';
import { esc, strip, titleHtml } from '../src/site/markup.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vt = (slug) => `view-transition-name:obra-${slug}`;

const head = ({ title, description, path, image = '/og.jpg', jsonld }) => `<!DOCTYPE html>
<html lang="es-CL">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="__SITE_URL__${path}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_CL" />
  <meta property="og:site_name" content="Red Vaeru" />
  <meta property="og:url" content="__SITE_URL__${path}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="__SITE_URL__${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <!--RV:HEAD-->
  ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>`;

const tail = (script) => `<!--RV:FOOTER-->
  <!--RV:OVERLAYS-->
  <script type="module" src="/src/site/${script}"></script>
</body>
</html>
`;

const GROUPS = { 'Alojamiento': ['termas-rayenko', 'villa-coral-samana', 'domos-cielo-austral', 'hotel-casa-nogal', 'cabanas-lago-azul'], 'Gastronomía': ['fogon-mapu', 'kuchen-haus-frutillar', 'vina-los-robles'], 'Experiencias': ['pucon-aventura', 'vina-los-robles', 'termas-rayenko'], 'Servicios': ['estudio-haber'] };
const groupsOf = (slug) => Object.entries(GROUPS).filter(([, l]) => l.includes(slug)).map(([g]) => g);

function index() {
  const rows = SCENES.map((s) => `
        <li class="wk" data-wk data-groups="${groupsOf(s.slug).join('|')}" style="--accent:${s.accent}">
          <a class="wk__a" href="${s.case}" data-cursor="Ver caso" data-img="${s.image}">
            <span class="wk__n">${s.n}</span>
            ${titleHtml(s, 'wk__name', esc(s.name))}
            <span class="wk__meta"><span>${esc(s.kind)}</span><span>${esc(s.place)}</span></span>
            <span class="wk__thumb" aria-hidden="true"><img src="${s.image}" alt="" loading="lazy" width="640" height="420" style="${vt(s.slug)}" /></span>
          </a>
        </li>`).join('');
  const real = REAL.map((r) => `
        <li class="live">
          <a class="live__a" href="${r.url}" target="_blank" rel="noopener" data-cursor="Abrir ↗">
            <span class="live__screen"><img src="${r.image}" alt="Portada del sitio de ${esc(r.name)}" loading="lazy" width="1440" height="900" /></span>
            <span class="live__name">${esc(r.name)}</span>
            <span class="live__meta">${esc(r.kind)} · ${esc(r.place)}</span>
            <span class="live__url">${esc(new URL(r.url).host)} ↗</span>
          </a>
        </li>`).join('');
  return `${head({ title: 'Trabajos · Red Vaeru', description: 'Diez muestras de concepto y los sitios de clientes que ya están en el aire: termas, villas en el Caribe, domos, hoteles, restaurantes, viñas y operadores de turismo.', path: '/trabajos/' })}
<body class="pg pg--trabajos">
  <!--RV:HEADER:trabajos-->
  <main id="contenido">
    <section class="wk-hero">
      <p class="eyebrow" data-reveal="fade">Trabajos · ${SCENES.length + REAL.length}</p>
      <h1 class="wk-hero__title" data-reveal="lines">Cada lugar,<br><em>su propia web.</em></h1>
      <p class="wk-hero__lead" data-reveal="fade">Diez muestras de concepto, cada una con su idea, su tipografía y su color, y los sitios de clientes que ya reciben reservas.</p>
      <div class="wk-filter" role="group" aria-label="Filtrar trabajos" data-reveal="fade">
        <button type="button" aria-pressed="true" data-filter="todo">Todos</button>
        ${Object.keys(GROUPS).map((g) => `<button type="button" aria-pressed="false" data-filter="${g}">${g}</button>`).join('')}
      </div>
    </section>
    <section class="wk-list" aria-label="Muestras de concepto">
      <ol class="wk-rows">${rows}
      </ol>
      <p class="wk-note">Muestras de concepto: negocios, nombres y reseñas ficticios, creados para mostrar cómo trabajamos.</p>
      <div class="wk-float" aria-hidden="true"><img alt="" /></div>
    </section>
    <section class="live-sec" aria-labelledby="en-el-aire">
      <p class="eyebrow">En el aire</p>
      <h2 id="en-el-aire" class="live-sec__title" data-reveal="lines">Sitios reales,<br><em>recibiendo huéspedes.</em></h2>
      <ul class="live-list" data-reveal="stagger">${real}
      </ul>
    </section>
  </main>
  ${tail('trabajos.js')}`;
}

function casePage(s, i) {
  const next = SCENES[(i + 1) % SCENES.length];
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${s.name} · muestra de concepto`,
    about: s.kind,
    creator: { '@type': 'Organization', name: 'Red Vaeru', '@id': '__SITE_URL__/#negocio' },
    image: `__SITE_URL__${s.image}`,
    description: s.concept,
  };
  return `${head({ title: `${s.name} · ${s.concept} · Red Vaeru`, description: `${s.concept}. ${s.reto}`.slice(0, 300), path: s.case, image: `/muestras/${s.slug}/og.jpg`, jsonld })}
<body class="pg pg--caso" style="--accent:${s.accent}">
  <!--RV:HEADER:trabajos-->
  <main id="contenido">
    <section class="cs-hero">
      <figure class="cs-hero__media"><img src="${s.image}" alt="" width="1920" height="1080" fetchpriority="high" style="${vt(s.slug)}" /></figure>
      <div class="cs-hero__in">
        <nav class="crumbs" aria-label="Ruta"><a href="/trabajos/">Trabajos</a><span aria-hidden="true">/</span><span aria-current="page">${s.n}</span></nav>
        <p class="cs-hero__kicker" data-fade-in>Muestra de concepto · ${esc(s.kind)} · ${esc(s.place)}</p>
        <h1 class="cs-hero__title" aria-label="${esc(s.name)}: ${esc(strip(s.title))}">${titleHtml(s, 'wtitle cs-hero__wt')}</h1>
        <p class="cs-hero__name" data-fade-in>${esc(s.name)}</p>
      </div>
    </section>

    <section class="cs-idea">
      <p class="eyebrow" data-reveal="fade">La idea</p>
      <p class="cs-idea__concept" data-reveal="lines">${esc(s.concept)}.</p>
      <div class="cs-cols">
        <div data-reveal="fade"><h2>El reto</h2><p>${esc(s.reto)}</p></div>
        <div data-reveal="fade"><h2>Lo que hicimos</h2><p>${esc(s.idea)}</p></div>
      </div>
    </section>

    <section class="cs-film" aria-label="El sitio en movimiento">
      <div class="cs-film__frame" data-reveal="clip">
        <span class="cs-film__bar" aria-hidden="true"><i></i><i></i><i></i><em>redvaeru.netlify.app${s.sample}</em></span>
        <video data-src="${s.video}" muted loop playsinline preload="none" poster="${s.video}.jpg" aria-label="Recorrido en video por el sitio de ${esc(s.name)}"></video>
      </div>
      <ul class="cs-feats" data-reveal="stagger">${s.features.map((f, k) => `<li><span>0${k + 1}</span>${esc(f)}</li>`).join('')}</ul>
      <div class="cs-ctas">
        <a class="btn btn--solid" href="${s.sample}" data-cursor="Entrar" data-magnetic>Entrar al sitio <span aria-hidden="true">↗</span></a>
        <a class="btn btn--line" href="/contacto/?obra=${s.slug}" data-magnetic>Quiero algo así para mi negocio</a>
      </div>
    </section>

    <section class="cs-id" aria-labelledby="identidad">
      <h2 id="identidad" class="eyebrow">Identidad</h2>
      <ol class="cs-palette" data-reveal="stagger">${(s.palette || []).map(([n, h]) => `<li style="--c:${h}"><span class="cs-sw"></span><b>${esc(n)}</b><code>${h}</code></li>`).join('')}</ol>
      <ul class="cs-type" data-reveal="stagger">${(s.fonts || []).map((f) => `<li><span class="cs-type__aa" style="font-family:'${f} Muestra'">Aa</span><span class="cs-type__name" style="font-family:'${f} Muestra'">${esc(f)}</span></li>`).join('')}</ul>
    </section>

    <section class="cs-gal" aria-label="Fotos del sitio">
      ${s.gallery.map((g, k) => `<figure class="cs-gal__it cs-gal__it--${k + 1}" data-reveal="clip"><img src="${g}" alt="" loading="lazy" width="1200" height="800" /></figure>`).join('')}
      <p class="wk-note">Negocio ficticio. Muestra de concepto creada por Red Vaeru.</p>
    </section>

    <a class="cs-next" href="${next.case}" data-cursor="Siguiente" style="--accent:${next.accent}">
      <span class="cs-next__media"><img src="${next.image}" alt="" loading="lazy" width="1920" height="1080" /></span>
      <span class="cs-next__in">
        <span class="eyebrow">Siguiente · ${next.n}</span>
        ${titleHtml(next, 'wtitle cs-next__wt', esc(next.name))}
        <span class="cs-next__concept">${esc(next.concept)}</span>
      </span>
    </a>
  </main>
  ${tail('caso.js')}`;
}

rmSync(join(root, 'trabajos'), { recursive: true, force: true });
mkdirSync(join(root, 'trabajos'), { recursive: true });
writeFileSync(join(root, 'trabajos', 'index.html'), index());
SCENES.forEach((s, i) => {
  const dir = join(root, 'trabajos', s.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), casePage(s, i));
});
console.log(`trabajos: índice + ${SCENES.length} casos`);

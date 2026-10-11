// Genera las páginas por servicio y la política de privacidad a partir de src/services-content.js.
// Se ejecuta antes de `vite` y `vite build` (predev / prebuild). Las páginas generadas no se versionan.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from '../src/services-content.js';
import { SERVICES, formatCLP } from '../src/pricing.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const strip = (s) => s.replace(/<[^>]+>/g, '');

const SYMBOL = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="mark" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="1.4" />
      <path d="M32 54V22" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" />
      <path d="M32 22c-4-5-10-6-15-4 5 0 9 2 15 4zm0 0c4-5 10-6 15-4-5 0-9 2-15 4zm0 0c-2-6-1-11 3-14-2 4-3 8-3 14zm0 0c-6-1-11 2-13 7 3-3 8-5 13-7zm0 0c6-1 11 2 13 7-3-3-8-5-13-7z" fill="currentColor" />
      <path d="M32 32l-9 5m9 1l-11 6m11 1l-12 6M32 32l9 5m-9 1l11 6m-11 1l12 6" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round" />
      <path d="M12 46h40" stroke="#C4A35A" stroke-width="1.6" stroke-linecap="round" />
    </symbol>
  </svg>`;

const head = ({ title, description, path, jsonld }) => `<!DOCTYPE html>
<html lang="es-CL">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="__SITE_URL__${path}" />
  <meta name="theme-color" content="#0B110E" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_CL" />
  <meta property="og:site_name" content="Red Vaeru" />
  <meta property="og:url" content="__SITE_URL__${path}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="__SITE_URL__/og.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/src/styles.css" />
  ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
  <!--ANALYTICS-->
</head>`;

const chrome = `<a class="skip" href="#contenido">Saltar al contenido</a>
  <div class="campaign" data-campaign role="region" aria-label="Campaña de temporada">
    <p><span class="pulse"></span> <a href="/#contacto"><span data-campaign-text></span> <u>Reservar cupo →</u></a></p>
    <button type="button" data-campaign-close aria-label="Cerrar aviso">×</button>
  </div>
  <div class="progress" aria-hidden="true"><span data-progress></span></div>
  <div class="grain" aria-hidden="true"></div>
  <div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"><em></em></span></div>
  ${SYMBOL}
  <header class="nav" data-nav>
    <a href="/" class="nav__brand" aria-label="Red Vaeru, inicio"><svg class="mark" viewBox="0 0 64 64"><use href="#mark" /></svg><span>Red Vaeru</span></a>
    <nav class="nav__links" aria-label="Principal">
      <a href="/#servicios">Servicios</a><a href="/#diagnostico">Diagnóstico</a><a href="/#trabajos">Trabajos</a><a href="/#nosotros">Sobre mí</a><a href="/#contacto">Contacto</a>
    </nav>
    <button class="btn btn--glow nav__cta" data-open-agent data-source="menu"><span class="pulse"></span> Cotizar con IA</button>
    <button class="nav__burger" aria-label="Abrir menú" aria-expanded="false" data-burger><span></span><span></span></button>
  </header>
  <div class="menu" data-menu aria-hidden="true">
    <nav aria-label="Menú móvil"><a href="/">Inicio</a><a href="/#servicios">Servicios</a><a href="/#diagnostico">Diagnóstico</a><a href="/#trabajos">Trabajos</a><a href="/#contacto">Contacto</a></nav>
    <p><a href="https://wa.me/56952289117" data-from="menu">WhatsApp +56 9 5228 9117</a> · redvaeru@gmail.com</p>
  </div>`;

const footer = `<footer class="footer dark">
    <div class="wrap">
      <div class="footer__top">
        <p>Estudio digital y asesoría para turismo y hospitalidad.<br />Araucanía, Chile · Caribe.</p>
        <nav aria-label="Servicios">${PAGES.map((p) => `<a href="/servicios/${p.slug}/">${esc(SERVICES[p.service].name)}</a>`).join('')}</nav>
      </div>
      <p class="footer__word" aria-hidden="true">Red Vaeru</p>
      <div class="footer__bottom"><span>© <span data-year>2026</span> Red Vaeru · Jorge Vásquez</span><span><a href="/privacidad">Privacidad</a> · <a href="/">Inicio</a></span></div>
    </div>
  </footer>
  <button class="fab" data-open-agent data-source="flotante" aria-label="Abrir Vaeru IA"><svg class="mark" viewBox="0 0 64 64"><use href="#mark" /></svg><span>Vaeru IA</span></button>
  <div class="drawer" data-drawer aria-hidden="true">
    <div class="drawer__backdrop" data-close-agent></div>
    <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Vaeru IA" data-agent-drawer></div>
  </div>
  <script type="module" src="/src/page.js"></script>
</body>
</html>
`;

function servicePage(p) {
  const s = SERVICES[p.service];
  const monthly = (t) => s.monthly || t.monthly;
  const tiers = Object.entries(s.tiers);
  const low = Math.min(...tiers.map(([, t]) => t.min));
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: s.name,
        serviceType: s.name,
        description: p.description,
        areaServed: ['Región de La Araucanía', 'Chile', 'República Dominicana'],
        provider: { '@type': 'ProfessionalService', name: 'Red Vaeru', '@id': '__SITE_URL__/#negocio' },
        offers: { '@type': 'AggregateOffer', priceCurrency: 'CLP', lowPrice: low, offerCount: tiers.length },
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: '__SITE_URL__/' },
          { '@type': 'ListItem', position: 2, name: s.name, item: `__SITE_URL__/servicios/${p.slug}/` },
        ],
      },
    ],
  };
  const others = PAGES.filter((o) => o.slug !== p.slug);
  return `${head({ title: p.metaTitle, description: p.description, path: `/servicios/${p.slug}/`, jsonld })}
<body>
  ${chrome}
  <main id="contenido">
    <section class="page-hero dark">
      <div class="wrap page-hero__grid">
        <div>
          <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a> <span aria-hidden="true">/</span> <a href="/#servicios">Servicios</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(s.name)}</span></nav>
          <p class="eyebrow" data-fade>${esc(p.eyebrow)}</p>
          <h1 class="page-hero__title" data-hero-title>${p.h1}</h1>
          <p class="hero__lead" data-fade>${esc(p.lead)}</p>
          <p class="pill" data-fade data-launch><span class="pulse"></span> Desde <strong>${formatCLP(low)}${s.monthly ? '/mes' : ''}</strong> · precio de lanzamiento · quedan <strong data-launch-left>5</strong> cupos</p>
          <div class="hero__ctas" data-fade>
            <button class="btn btn--gold" data-open-agent data-source="pagina-servicio" data-ask="${esc(p.ask)}" data-magnetic>Cotizar en 1 minuto <span aria-hidden="true">→</span></button>
            <a class="btn btn--ghost" href="/#diagnostico" data-magnetic>Diagnóstico gratis</a>
          </div>
        </div>
        <figure class="page-hero__img"><img src="${p.img}" alt="" width="1400" height="1000" fetchpriority="high" /></figure>
      </div>
    </section>

    <section class="light block">
      <div class="wrap split">
        <div>
          <p class="eyebrow">Para quién es</p>
          <h2 class="h2" data-split>${esc(p.title)}</h2>
          <ul class="checks">${p.for.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        </div>
        <ul class="benefits">${p.benefits.map(([t, d], i) => `<li data-fade><span>0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul>
      </div>
    </section>

    <section class="dark block">
      <div class="wrap">
        <p class="eyebrow">Opciones y valores de lanzamiento</p>
        <h2 class="h1" data-split>Elija el alcance. <em>Ajustamos a su medida.</em></h2>
        <div class="tiers tiers--${tiers.length}">
          ${tiers.map(([tid, t], i) => `<article class="tier${i === Math.min(1, tiers.length - 1) && tiers.length > 2 ? ' tier--featured' : ''}" data-fade>
            ${i === 1 && tiers.length > 2 ? '<p class="tier__badge">Más elegido</p>' : ''}
            <h3>${esc(t.label)}</h3>
            <p class="tier__price">desde <strong>${formatCLP(t.min)}</strong>${monthly(t) ? '<span>/mes</span>' : ''}</p>
            <p class="tier__time">Plazo: ${esc(t.weeks)}</p>
            <ul>${(p.tiers[tid] || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            <button class="btn ${i === 1 && tiers.length > 2 ? 'btn--gold' : 'btn--line'}" data-open-agent data-source="plan" data-ask="${esc(`Quiero cotizar ${s.name.toLowerCase()}: ${t.label}`)}">Cotizar esta opción</button>
          </article>`).join('\n          ')}
        </div>
        ${Object.keys(s.addons).length ? `<p class="addons">Extras disponibles: ${Object.values(s.addons).map((a) => esc(a.label.toLowerCase())).join(' · ')}.</p>` : ''}
        <p class="services__note">Valores referenciales en pesos chilenos. El precio fijo y el documento tributario llegan por escrito en la propuesta.</p>
      </div>
    </section>

    <section class="light block">
      <div class="wrap faq__grid">
        <div>
          <p class="eyebrow">Dudas frecuentes</p>
          <h2 class="h1">Antes de <em>decidir.</em></h2>
          <p class="faq__aside">¿Otra pregunta? <button class="link" data-open-agent data-source="faq-servicio">Pregúntele a Vaeru IA →</button></p>
        </div>
        <div class="faq__list">${p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
      </div>
    </section>

    <section class="dark block cta-band">
      <div class="wrap">
        <h2 class="contact__title" data-split>Conversemos de su <em>próxima temporada.</em></h2>
        <div class="hero__ctas">
          <button class="btn btn--gold" data-open-agent data-source="cierre-servicio" data-ask="${esc(p.ask)}">Cotizar con Vaeru IA</button>
          <a class="btn btn--ghost" href="https://wa.me/56952289117?text=${encodeURIComponent(`Hola Jorge, vi la página de ${s.name.toLowerCase()} en Red Vaeru.`)}" target="_blank" rel="noopener" data-from="pagina-servicio">Escribir por WhatsApp</a>
        </div>
        <nav class="others" aria-label="Otros servicios"><p>Otros servicios</p>${others.map((o) => `<a href="/servicios/${o.slug}/">${esc(SERVICES[o.service].name)} <span aria-hidden="true">↗</span></a>`).join('')}</nav>
      </div>
    </section>
  </main>
  ${footer}`;
}

function privacyPage() {
  return `${head({ title: 'Política de privacidad · Red Vaeru', description: 'Cómo Red Vaeru trata los datos que recibe por su sitio web, formularios y el asistente Vaeru IA.', path: '/privacidad' })}
<body>
  ${chrome}
  <main id="contenido">
    <section class="page-hero dark legal-hero">
      <div class="wrap">
        <p class="eyebrow">Transparencia</p>
        <h1 class="page-hero__title" data-hero-title>Política de <em>privacidad.</em></h1>
        <p class="legal__date">Última actualización: octubre de 2026</p>
      </div>
    </section>
    <section class="light block legal">
      <div class="wrap">
        <h2>Quién es responsable</h2>
        <p>Jorge Vásquez, a cargo de Red Vaeru (Araucanía, Chile). Contacto: <a href="mailto:redvaeru@gmail.com">redvaeru@gmail.com</a> · WhatsApp +56 9 5228 9117.</p>
        <h2>Qué datos recibo</h2>
        <ul>
          <li><strong>Formularios</strong> (contacto, cotización y diagnóstico): nombre, WhatsApp, correo opcional, tipo de negocio y lo que usted escriba.</li>
          <li><strong>Vaeru IA</strong>: los mensajes que escribe en el asistente, para responderle y calcular su cotización.</li>
          <li><strong>Estadísticas de uso</strong> anónimas y agregadas (páginas visitadas, botones usados), si están activas, sin perfiles personales.</li>
        </ul>
        <h2>Para qué los uso</h2>
        <p>Solo para responder su consulta, preparar su propuesta y dar seguimiento al servicio que solicite. No vendo ni cedo sus datos, y no envío publicidad sin su autorización.</p>
        <h2>Con quién se procesan</h2>
        <ul>
          <li><strong>Netlify</strong>: aloja el sitio y almacena los formularios.</li>
          <li><strong>Anthropic</strong>: procesa los mensajes de Vaeru IA para generar las respuestas. No comparta datos sensibles en el chat.</li>
          <li><strong>WhatsApp (Meta)</strong>: si usted decide escribirme por esa vía.</li>
        </ul>
        <h2>Cuánto tiempo los guardo</h2>
        <p>Mientras dure la conversación o el servicio, y hasta 24 meses después para dar seguimiento, salvo que usted pida eliminarlos antes.</p>
        <h2>Sus derechos</h2>
        <p>Puede pedir acceso, rectificación, eliminación u oposición al uso de sus datos escribiendo a <a href="mailto:redvaeru@gmail.com">redvaeru@gmail.com</a>. Respondo en un plazo máximo de 15 días hábiles. Esta política se ajusta a la normativa chilena de protección de datos personales, incluida la Ley 21.719.</p>
        <p class="legal__note">Este texto es una base de buenas prácticas. Se recomienda validarlo con asesoría legal.</p>
      </div>
    </section>
  </main>
  ${footer}`;
}

function simplePage({ title, path, eyebrow, h1, text, noindex }) {
  return `${head({ title, description: text, path })}`.replace('</head>', noindex ? '  <meta name="robots" content="noindex" />\n</head>' : '</head>') + `
<body>
  ${chrome}
  <main id="contenido">
    <section class="dark simple">
      <div class="wrap">
        <p class="eyebrow">${eyebrow}</p>
        <h1 class="contact__title" data-hero-title>${h1}</h1>
        <p class="hero__lead">${text}</p>
        <div class="hero__ctas">
          <a class="btn btn--gold" href="/">Volver al inicio</a>
          <button class="btn btn--ghost" data-open-agent data-source="${path}">Hablar con Vaeru IA</button>
        </div>
      </div>
    </section>
  </main>
  ${footer}`;
}

rmSync(join(root, 'servicios'), { recursive: true, force: true });
mkdirSync(join(root, 'gracias'), { recursive: true });
writeFileSync(join(root, 'gracias', 'index.html'), simplePage({ title: 'Mensaje recibido · Red Vaeru', path: '/gracias', eyebrow: 'Mensaje recibido', h1: 'Gracias. <em>Ya lo leí.</em>', text: 'Su mensaje llegó a Red Vaeru. Le respondo por WhatsApp o correo en menos de 24 horas hábiles con los siguientes pasos.', noindex: true }));
writeFileSync(join(root, '404.html'), simplePage({ title: 'Página no encontrada · Red Vaeru', path: '/404', eyebrow: 'Error 404', h1: 'Este sendero <em>no lleva a ningún lado.</em>', text: 'La página que busca no existe o cambió de lugar. Vuelva al inicio o pregúntele a Vaeru IA lo que necesita.', noindex: true }));
for (const p of PAGES) {
  const file = join(root, 'servicios', p.slug, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, servicePage(p));
}
mkdirSync(join(root, 'privacidad'), { recursive: true });
writeFileSync(join(root, 'privacidad', 'index.html'), privacyPage());
console.log(`Páginas generadas: ${PAGES.length} servicios + privacidad`);

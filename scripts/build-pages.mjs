// Genera las páginas por servicio y la política de privacidad a partir de src/services-content.js.
// Se ejecuta antes de `vite` y `vite build` (predev / prebuild). Las páginas generadas no se versionan.
import { mkdirSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from '../src/services-content.js';
import { SERVICES, formatCLP, priceOf } from '../src/pricing.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const strip = (s) => s.replace(/<[^>]+>/g, '');

const head = ({ title, description, path, jsonld }) => `<!DOCTYPE html>
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
  <meta property="og:image" content="__SITE_URL__/og.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <!--RV:HEAD-->
  ${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>`;

// Cabecera, pie y capas: los inserta Vite (src/site/chrome.mjs)
const chrome = (active = 'servicios') => `<!--RV:HEADER:${active}-->`;
const footer = `<!--RV:FOOTER-->
  <!--RV:OVERLAYS-->
  <script type="module" src="/src/site/page.js"></script>
</body>
</html>
`;

// Foto local de cada servicio (de las muestras), en vez de bancos de imágenes externos
const IMG = {
  'paginas-web-alojamientos': '/muestras/cabanas-lago-azul/img/cab-muelle.webp',
  'paginas-web-restaurantes': '/muestras/fogon-mapu/img/tiempo-3.webp',
  'automatizacion-ia-turismo': '/muestras/domos-cielo-austral/img/g4.webp',
  'redes-sociales-turismo': '/muestras/villa-coral-samana/img/pescadores.webp',
};

function servicePage(p) {
  const s = SERVICES[p.service];
  const monthly = (t) => s.monthly || t.monthly;
  const tiers = Object.entries(s.tiers);
  const low = Math.min(...tiers.map(([, t]) => priceOf(t).min));
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
  const featured = tiers.length > 2 ? 1 : -1;
  const hasLaunch = tiers.some(([, t]) => t.launch);
  return `${head({ title: p.metaTitle, description: p.description, path: `/servicios/${p.slug}/`, jsonld })}
<body class="pg pg--servicio">
  ${chrome()}
  <main id="contenido">
    <section class="ph">
      <div class="sv-hero">
        <div>
          <nav class="crumbs" aria-label="Ruta" style="margin-bottom: 28px"><a href="/servicios/">Servicios</a><span aria-hidden="true">/</span><span aria-current="page">${esc(s.name)}</span></nav>
          <h1 class="ph__title" data-reveal="lines">${p.h1}</h1>
          <p class="ph__lede" data-reveal="fade">${esc(p.lead)}</p>
          <p class="ph__k" style="margin: 28px 0 0" data-reveal="fade"><span data-from-price="${p.service}"></span>${hasLaunch ? '<span data-launch>Precio de lanzamiento · quedan <b data-launch-left>5</b> de <span data-launch-total>5</span> cupos</span>' : ''}</p>
        </div>
        <figure class="sv-hero__img" data-reveal="clip"><img src="${IMG[p.slug] || p.img}" alt="" width="1100" height="1375" fetchpriority="high" /></figure>
      </div>
    </section>

    <section class="sec sec--line">
      <div class="sv-for">
        <div>
          <p class="eyebrow" data-reveal="fade">Para quién es</p>
          <h2 class="h2" style="margin-top: 22px" data-reveal="lines">${esc(p.title)}</h2>
        </div>
        <ul data-reveal="stagger">${p.for.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>
      <ul class="benefits" style="margin-top: clamp(56px, 7vw, 110px)" data-reveal="stagger">${p.benefits.map(([t, d], i) => `<li><b>0${i + 1}</b><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ul>
    </section>

    <section class="sec sec--line">
      <div class="sec__head sec__head--split">
        <h2 class="h2" data-reveal="lines">Elija el alcance. <em>Lo ajustamos a su medida.</em></h2>
        <p class="lede" data-reveal="fade">${hasLaunch ? 'Precio de lanzamiento mientras queden cupos.' : 'Valores referenciales.'} El precio fijo llega por escrito en la propuesta.</p>
      </div>
      <div class="tiers" data-reveal="stagger">
        ${tiers.map(([tid, t], i) => `<article class="tier${i === featured ? ' tier--featured' : ''}" data-lamp>
          <p class="tier__k"><span>Opción ${String(i + 1).padStart(2, '0')}</span>${i === featured ? '<b>Recomendado</b>' : ''}</p>
          <h3>${esc(t.label)}</h3>
          <p class="tier__price">desde <strong>${formatCLP(priceOf(t).min)}${monthly(t) ? '<small>/mes</small>' : ''}</strong>${priceOf(t) !== t ? `<s class="tier__was">Precio normal desde ${formatCLP(t.min)}</s>` : ''}</p>
          <p class="tier__time">Plazo: ${esc(t.weeks)}</p>
          <ul>${(p.tiers[tid] || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <button class="btn ${i === featured ? 'btn--solid' : 'btn--line'}" type="button" data-open-agent data-source="plan" data-ask="${esc(`Quiero cotizar ${s.name.toLowerCase()}: ${t.label}`)}">Cotizar esta opción<span class="sr">: ${esc(t.label)}</span></button>
        </article>`).join('\n        ')}
      </div>
      ${Object.keys(s.addons).length ? `<p class="wk-note">Extras disponibles: ${Object.values(s.addons).map((a) => esc(a.label.charAt(0).toLowerCase() + a.label.slice(1))).join(' · ')}.</p>` : ''}
      <p class="wk-note">Valores referenciales en pesos chilenos. Emitimos boleta o factura; los impuestos que correspondan se detallan en la propuesta. Todo trabajo se formaliza con contrato.</p>
    </section>

    <section class="sec sec--line">
      <div class="sec__head sec__head--split">
        <h2 class="h2" data-reveal="lines">Antes de <em>decidir.</em></h2>
        <p class="lede" data-reveal="fade">¿Otra pregunta? <button class="link" type="button" data-open-agent data-source="faq-servicio">Pregúntele a Vaeru IA</button>.</p>
      </div>
      <div class="dark-faq">${p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(voice(a))}</p></details>`).join('')}</div>
    </section>

    <section class="sec sec--line svc-cta">
      <h2 class="h2" data-reveal="lines">Conversemos de su <em>próxima temporada.</em></h2>
      <div class="cs-ctas" data-reveal="fade">
        <button class="btn btn--solid" type="button" data-open-agent data-source="cierre-servicio" data-ask="${esc(p.ask)}" data-magnetic>Cotizar con Vaeru IA <span aria-hidden="true">→</span></button>
        <a class="btn btn--line" href="https://wa.me/56952289117?text=${encodeURIComponent(`Hola, vi la página «${s.name}» en el sitio de Red Vaeru.`)}" target="_blank" rel="noopener" data-from="pagina-servicio" data-magnetic>Escribir por WhatsApp</a>
      </div>
      <nav class="others" style="width: 100%; margin-top: 40px; border-color: var(--line)" aria-label="Otros servicios">${others.map((o) => `<a href="/servicios/${o.slug}/" style="border-color: var(--line)"><span class="others__name">${esc(SERVICES[o.service].name)}</span><span class="others__from" style="color: var(--muted)" data-from-price="${o.service}"></span><span aria-hidden="true">→</span></a>`).join('')}</nav>
    </section>
  </main>
  ${footer}`;
}

// El contenido ya habla como estudio («nosotros»)
const voice = (t) => t;

function privacyPage() {
  return `${head({ title: 'Política de privacidad · Red Vaeru', description: 'Cómo Red Vaeru trata los datos que recibe por su sitio web, formularios y el asistente Vaeru IA.', path: '/privacidad' })}
<body class="pg pg--legal">
  ${chrome('')}
  <main id="contenido">
    <section class="ph">
      <p class="ph__k"><span>Transparencia</span><span>Última actualización: octubre de 2026</span></p>
      <h1 class="ph__title" data-reveal="lines">Política de <em>privacidad.</em></h1>
    </section>
    <section class="sec sec--line">
      <div class="legal">
        <h2>Quién es responsable</h2>
        <p>Red Vaeru, estudio dirigido por Jorge Vásquez (La Araucanía, Chile). Contacto: <a href="mailto:redvaeru@gmail.com">redvaeru@gmail.com</a> · WhatsApp +56 9 5228 9117.</p>
        <h2>Qué datos recibimos</h2>
        <ul>
          <li><strong>Formularios</strong> (contacto y cotización): nombre, WhatsApp, correo opcional, tipo de negocio, lugar y lo que usted escriba.</li>
          <li><strong>Vaeru IA</strong>: los mensajes que escribe en el asistente, para responderle y calcular su cotización.</li>
          <li><strong>Estadísticas de uso</strong> anónimas y agregadas (páginas visitadas, botones usados), si están activas, sin perfiles personales.</li>
          <li><strong>Preferencias en su equipo</strong>: si activó el sonido y la moneda elegida se guardan solo en su navegador.</li>
        </ul>
        <h2>Para qué los usamos</h2>
        <p>Solo para responder su consulta, preparar su propuesta y dar seguimiento al servicio que solicite. No vendemos ni cedemos sus datos, y no enviamos publicidad sin su autorización.</p>
        <h2>Con quién se procesan</h2>
        <ul>
          <li><strong>Netlify</strong>: aloja el sitio y almacena los formularios.</li>
          <li><strong>Google</strong>: guarda una copia de las consultas en una planilla privada del estudio.</li>
          ${process.env.VITE_AI === 'on' ? '<li><strong>Anthropic</strong>: procesa los mensajes de Vaeru IA para generar las respuestas. No comparta datos sensibles en el chat.</li>' : '<li><strong>Vaeru IA</strong> responde en su propio navegador: sus mensajes no se envían a servicios de inteligencia artificial externos.</li>'}
          <li><strong>WhatsApp (Meta)</strong>: si usted decide escribirnos por esa vía.</li>
        </ul>
        <h2>Cuánto tiempo los guardamos</h2>
        <p>Mientras dure la conversación o el servicio, y hasta 24 meses después para dar seguimiento, salvo que usted pida eliminarlos antes.</p>
        <h2>Sus derechos</h2>
        <p>Puede pedir acceso, rectificación, eliminación u oposición al uso de sus datos escribiendo a <a href="mailto:redvaeru@gmail.com">redvaeru@gmail.com</a>. Respondemos en un plazo máximo de 15 días hábiles. Esta política se ajusta a la normativa chilena de protección de datos personales, incluida la Ley 21.719.</p>
      </div>
    </section>
  </main>
  ${footer}`;
}

function simplePage({ title, path, eyebrow, h1, text, noindex, cls = '' }) {
  return `${head({ title, description: text, path })}`.replace('</head>', noindex ? '  <meta name="robots" content="noindex" />\n</head>' : '</head>') + `
<body class="pg pg--simple">
  ${chrome('')}
  <main id="contenido">
    <section class="dark404 ${cls}">
      <p class="ph__k" style="margin: 0"><span>${eyebrow}</span></p>
      <h1 class="ph__title" style="max-width: 14ch">${h1}</h1>
      <p class="ph__lede" style="margin: 0 auto">${text}</p>
      <div class="cs-ctas" style="justify-content: center">
        ${cls ? '<a class="dark404__exit" href="/">Volver al inicio</a>' : '<a class="btn btn--solid" href="/">Volver al inicio</a>'}
        <a class="btn btn--line" href="/trabajos/">Ver los trabajos</a>
      </div>
    </section>
  </main>
  ${footer}`;
}

// Se regeneran todas las páginas de servicio; las carpetas de servicios que ya no existen también se borran
for (const d of readdirSync(join(root, 'servicios'), { withFileTypes: true })) if (d.isDirectory()) rmSync(join(root, 'servicios', d.name), { recursive: true, force: true });
mkdirSync(join(root, 'gracias'), { recursive: true });
writeFileSync(join(root, 'gracias', 'index.html'), simplePage({ title: 'Mensaje recibido · Red Vaeru', path: '/gracias', eyebrow: 'Gracias', h1: 'Mensaje <em>recibido.</em>', text: 'Su mensaje llegó a Red Vaeru. Le respondemos por WhatsApp o correo en menos de 24 horas hábiles con los siguientes pasos.', noindex: true }));
writeFileSync(join(root, '404.html'), simplePage({ title: 'Página no encontrada · Red Vaeru', path: '/404', eyebrow: 'Error 404', h1: 'Esta sala está <em>a oscuras.</em>', text: 'La página que busca no existe o cambió de lugar.', noindex: true, cls: 'is-404' }));
for (const p of PAGES) {
  const file = join(root, 'servicios', p.slug, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, servicePage(p));
}
mkdirSync(join(root, 'privacidad'), { recursive: true });
writeFileSync(join(root, 'privacidad', 'index.html'), privacyPage());
console.log(`Páginas generadas: ${PAGES.length} servicios + privacidad`);

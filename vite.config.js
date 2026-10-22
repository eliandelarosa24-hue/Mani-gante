import { defineConfig } from 'vite';
import { readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { chromeParts, emblem } from './src/site/chrome.mjs';
import { scenesMarkup, ticksMarkup, realMarkup, railMarkup, latMapMarkup } from './src/site/markup.mjs';

// URL pública: Netlify la entrega en el build (URL). Con dominio propio, defina SITE_URL.
const SITE_URL = (process.env.SITE_URL || process.env.URL || 'https://redvaeru.netlify.app').replace(/\/$/, '');

// Todas las páginas del sitio: cualquier index.html dentro de estas carpetas (hasta dos niveles).
const DIRS = ['trabajos', 'servicios', 'estudio', 'contacto', 'muestras', 'privacidad', 'gracias'];
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
function pagesIn(dir) {
  if (!isDir(dir)) return [];
  const out = existsSync(join(dir, 'index.html')) ? [`${dir}/index.html`] : [];
  for (const d of readdirSync(dir, { withFileTypes: true })) if (d.isDirectory()) out.push(...pagesIn(`${dir}/${d.name}`));
  return out;
}
const pages = ['index.html', ...(existsSync('404.html') ? ['404.html'] : []), ...DIRS.flatMap(pagesIn)];

function analyticsTag() {
  if (process.env.VITE_PLAUSIBLE_DOMAIN) {
    return `<script defer data-domain="${process.env.VITE_PLAUSIBLE_DOMAIN}" src="https://plausible.io/js/script.tagged-events.js"></script>`;
  }
  if (process.env.VITE_GA_ID) {
    const id = process.env.VITE_GA_ID;
    return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});</script>`;
  }
  return '';
}

// Cabecera, pie y capas comunes: cada página marca dónde van con <!--RV:...-->.
function inject(html) {
  return html
    .replace(/<!--RV:HEAD-->/g, chromeParts.head())
    .replace(/<!--RV:HEADER(?::([a-z]+))?-->/g, (_, active) => chromeParts.header(active))
    .replace(/<!--RV:FOOTER-->/g, chromeParts.footer())
    .replace(/<!--RV:OVERLAYS-->/g, chromeParts.overlays())
    .replace(/<!--RV:EMBLEM:([a-z_-]+)-->/g, (_, cls) => emblem(cls))
    .replace('<!--RV:SCENES-->', () => scenesMarkup())
    .replace('<!--RV:TICKS-->', () => ticksMarkup())
    .replace('<!--RV:RAIL-->', () => railMarkup())
    .replace('<!--RV:LATMAP-->', () => latMapMarkup())
    .replace('<!--RV:REAL-->', () => realMarkup());
}

function site() {
  return {
    name: 'red-vaeru-site',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => inject(html).replaceAll('__SITE_URL__', SITE_URL).replace('<!--ANALYTICS-->', analyticsTag()),
    },
    generateBundle() {
      const indexable = pages
        .filter((p) => p !== '404.html' && !p.startsWith('gracias'))
        .map((p) => '/' + p.replace(/index\.html$/, ''));
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [site()],
  build: { rollupOptions: { input: Object.fromEntries(pages.map((p) => [p.replace(/\/?index\.html$/, '').replace(/\.html$/, '') || 'main', resolve(p)])) } },
});

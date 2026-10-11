import { defineConfig } from 'vite';
import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// URL pública: Netlify la entrega en el build (URL). Con dominio propio, defina SITE_URL.
const SITE_URL = (process.env.SITE_URL || process.env.URL || 'https://redvaeru.netlify.app').replace(/\/$/, '');

const servicePages = existsSync('servicios') ? readdirSync('servicios').map((d) => `servicios/${d}/index.html`) : [];
const pages = ['index.html', 'privacidad/index.html', 'gracias/index.html', '404.html', ...servicePages];

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

function site() {
  return {
    name: 'red-vaeru-site',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL).replace('<!--ANALYTICS-->', analyticsTag()),
    generateBundle() {
      const paths = ['/', ...servicePages.map((p) => '/' + p.replace(/index\.html$/, '')), '/privacidad'];
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [site()],
  build: { rollupOptions: { input: Object.fromEntries(pages.map((p) => [p.replace(/\/?index\.html$/, '').replace(/\.html$/, '') || 'main', resolve(p)])) } },
});

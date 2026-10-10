// GET /sitemap.xml → inicio, el oficio y una URL por sabor (se actualiza solo con catalog.mjs).
import { FLAVORS, JAPANESE, BUSINESS, CATALOG_CHANGELOG } from "../../js/catalog.mjs";

export default async () => {
  const lastmod = CATALOG_CHANGELOG[0].date;
  const urls = [
    { loc: BUSINESS.url, priority: "1.0", freq: "daily" },
    { loc: `${BUSINESS.url}oficio.html`, priority: "0.6", freq: "monthly" },
    ...[...FLAVORS, ...JAPANESE].map((f) => ({ loc: `${BUSINESS.url}sabor/${f.id}`, priority: "0.8", freq: "weekly" })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
};

export const config = { path: "/sitemap.xml" };

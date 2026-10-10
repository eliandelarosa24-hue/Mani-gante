// Plantilla HTML compartida por las páginas renderizadas en el servidor (sabores, sitemap).
import { BUSINESS } from "../../js/catalog.mjs";

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function page({ title, description, path, image, body, jsonld }: { title: string; description: string; path: string; image: string; body: string; jsonld: unknown[] }) {
  const url = new URL(path, BUSINESS.url).toString();
  const img = new URL(image, BUSINESS.url).toString();
  return `<!DOCTYPE html>
<html lang="es-CL">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0d0b09">
<link rel="icon" type="image/png" href="/assets/img/icon-192.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="product">
<meta property="og:locale" content="es_CL">
<meta property="og:site_name" content="MANI-GANTE">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">
<link rel="preload" href="/assets/fonts/bodoni-moda.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/fonts.css">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/styles.css">
<link rel="stylesheet" href="/css/pages.css">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
<script>try { const t = JSON.parse(localStorage.getItem("mg-theme") || "null"); if (t === "light") document.documentElement.dataset.theme = t; } catch (e) {}</script>
</head>
<body class="page">
<header class="page-nav"><a class="brand" href="/"><img src="/assets/img/icon-192.png" alt="" width="36" height="36"><span class="brand-name">MANI<span>-</span>GANTE</span></a><a class="btn btn-gold" href="/#tienda">Los más buscados</a></header>
<main id="main">${body}</main>
<footer class="page-foot"><p>MANI-GANTE · Para gente gánster y elegante · ${esc(BUSINESS.city)} · Entregas en campus ${esc(BUSINESS.campus)}</p><p><a href="/">Inicio</a> · <a href="/oficio.html">La receta</a> · <a href="/#faq">Preguntas</a></p></footer>
</body>
</html>`;
}

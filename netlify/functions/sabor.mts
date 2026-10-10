// GET /sabor/:id → página indexable de cada sabor (schema Product + Offer + Breadcrumb, OG propio).
import { FLAVORS, JAPANESE, FORMATS, BUSINESS, ALLERGENS, unitPrice, formatCLP, whatsappLink } from "../../js/catalog.mjs";
import { bag } from "../../js/art.mjs";
import { getLiveCatalog } from "../lib/catalog-live.mts";
import { page, esc } from "../lib/page.mts";

export default async (req: Request, context: { params?: { id?: string } }) => {
  const id = context.params?.id || new URL(req.url).pathname.split("/").filter(Boolean)[1];
  const base = [...FLAVORS, ...JAPANESE].find((f) => f.id === id);
  if (!base) {
    const body = `<section class="notfound"><p class="hand">esta bolsa está vacía</p><h1 class="h2">Ese sabor <em>no existe</em></h1><p class="lead">Pero tenemos ${FLAVORS.length} sabores esperándote.</p><a class="btn btn-gold btn-lg" href="/#tienda">Ver la tienda</a></section>`;
    return new Response(page({ title: "Sabor no encontrado · MANI-GANTE", description: "Ese sabor no existe.", path: "/404.html", image: "/assets/banners/og/editorial-1200x630.jpg", body, jsonld: [] }), { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  const live = await getLiveCatalog().catch(() => null);
  const f: any = [...(live?.catalog || []), ...(live?.japanese || [])].find((x: any) => x.id === id) || base;
  const all = live ? [...live.catalog, ...live.japanese] : [...FLAVORS, ...JAPANESE];
  const related = all.filter((x: any) => x.id !== f.id && x.available && (x.category === f.category || x.topVentas)).slice(0, 4);
  const formats = f.line === "japones" ? [FORMATS.celofan] : Object.values(FORMATS);
  const url = `${BUSINESS.url}sabor/${f.id}`;
  const desc = `${f.name}: ${f.notes} Maní confitado a mano en Temuco, desde ${formatCLP(unitPrice(f, "celofan"))}. Reserva y retira en el campus INACAP.`;

  const jsonld = [
    {
      "@context": "https://schema.org", "@type": "Product", name: `Maní confitado ${f.name}`, description: desc, sku: f.id, category: f.category,
      image: [`${BUSINESS.url}assets/og/${f.id}.jpg`], brand: { "@type": "Brand", name: "MANI-GANTE" },
      offers: formats.map((fm: any) => ({
        "@type": "Offer", name: fm.name, price: unitPrice(f, fm.id), priceCurrency: "CLP", url,
        availability: f.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "MANI-GANTE" },
      })),
    },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BUSINESS.url },
      { "@type": "ListItem", position: 2, name: f.category, item: `${BUSINESS.url}#tienda` },
      { "@type": "ListItem", position: 3, name: f.name, item: url },
    ] },
  ];

  const body = `
  <nav class="crumbs" aria-label="Migas de pan"><a href="/">Inicio</a> / <a href="/#tienda">${esc(f.category)}</a> / <span aria-current="page">${esc(f.name)}</span></nav>
  <article class="flavor-page" style="--c:${f.color}">
    <div class="flavor-art">${bag(f.color, f.line === "japones" ? "celofan" : "doypack", { label: `Bolsa de ${f.name}` })}</div>
    <div class="flavor-info">
      <p class="eyebrow">${esc(f.line === "japones" ? "Maní japonés" : f.category)}${f.topVentas ? " · Top ventas" : ""}</p>
      <h1 class="h2">${esc(f.name)}</h1>
      <p class="lead">${esc(f.notes)}</p>
      <p class="quick-status${f.available ? "" : " out"}"><i></i>${f.available ? "Disponible esta semana" : "Agotado por ahora"}</p>
      <ul class="flavor-prices">${formats.map((fm: any) => `<li><span>${esc(fm.name)}<small>${esc(fm.detail)}</small></span><strong>${formatCLP(unitPrice(f, fm.id))}</strong></li>`).join("")}</ul>
      <div class="flavor-ctas">
        ${f.available ? `<a class="btn btn-gold btn-lg" href="/?pedido=${f.id}.1#reservar">Reservar ${esc(f.name)}</a>` : `<a class="btn btn-gold btn-lg" href="/#tienda">Avísame cuando vuelva</a>`}
        <a class="btn btn-wa btn-lg" href="${whatsappLink(`Hola Jorge, quiero ${f.name} 🥜`)}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
      </div>
      <p class="allergen"><strong>Alérgenos:</strong> ${esc(ALLERGENS.note)}</p>
    </div>
  </article>
  ${related.length ? `<section class="related"><h2 class="h3">Va bien con</h2><div class="related-grid">${related.map((r: any) => `<a class="related-card" href="/sabor/${r.id}" style="--c:${r.color}">${bag(r.color, "celofan", { label: "" })}<span>${esc(r.name)}</span></a>`).join("")}</div></section>` : ""}`;

  return new Response(page({ title: `${f.name} · Maní confitado artesanal | MANI-GANTE`, description: desc, path: `/sabor/${f.id}`, image: `/assets/og/${f.id}.jpg`, body, jsonld }), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300", "Netlify-CDN-Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
  });
};

export const config = { path: "/sabor/:id" };

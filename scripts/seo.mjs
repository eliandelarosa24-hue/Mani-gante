// Regenera los datos estructurados (JSON-LD) de index.html desde js/catalog.mjs.
// Uso: npm run seo   (ejecútalo cuando cambies sabores, precios o preguntas frecuentes)
import fs from "node:fs";
import { BUSINESS, FLAVORS, JAPANESE, FAQ, SCHEDULE, unitPrice } from "../js/catalog.mjs";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const all = [...FLAVORS, ...JAPANESE];
const graph = [
  {
    "@type": "FoodEstablishment", "@id": `${BUSINESS.url}#negocio`, name: BUSINESS.name, slogan: BUSINESS.tagline,
    description: `Maní confitado a mano en ${FLAVORS.length} sabores y maní japonés. Venta y entrega en el campus ${BUSINESS.campus}.`,
    url: BUSINESS.url, image: `${BUSINESS.url}assets/banners/og/editorial-1200x630.jpg`, logo: `${BUSINESS.url}assets/img/icon-512.png`,
    telephone: `+${BUSINESS.whatsapp}`, priceRange: "$", servesCuisine: "Snacks", currenciesAccepted: "CLP",
    paymentAccepted: "Transferencia, Mercado Pago, Efectivo", hasMenu: `${BUSINESS.url}#tienda`,
    address: { "@type": "PostalAddress", addressLocality: "Temuco", addressRegion: "La Araucanía", addressCountry: "CL" },
    openingHoursSpecification: SCHEDULE.map((s) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[s.day], opens: s.open, closes: s.close })),
    sameAs: [BUSINESS.instagram, BUSINESS.facebook],
  },
  {
    "@type": "ItemList", "@id": `${BUSINESS.url}#sabores`, name: "Sabores MANI-GANTE", numberOfItems: all.length,
    itemListElement: all.map((f, i) => ({
      "@type": "ListItem", position: i + 1, url: `${BUSINESS.url}sabor/${f.id}`,
      item: { "@type": "Product", name: `Maní confitado ${f.name}`, description: f.notes, category: f.category, image: `${BUSINESS.url}assets/og/${f.id}.jpg`, brand: { "@type": "Brand", name: BUSINESS.name },
        offers: { "@type": "Offer", price: unitPrice(f, "celofan"), priceCurrency: "CLP", availability: f.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${BUSINESS.url}sabor/${f.id}` } },
    })),
  },
  { "@type": "FAQPage", "@id": `${BUSINESS.url}#faq`, mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@type": "WebSite", "@id": `${BUSINESS.url}#web`, url: BUSINESS.url, name: BUSINESS.name, inLanguage: ["es-CL", "en"] },
];
const block = `<!-- SEO:START (generado por scripts/seo.mjs, no editar a mano) -->\n<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 1)}\n</script>\n<!-- SEO:END -->`;

const file = new URL("../index.html", import.meta.url);
let html = fs.readFileSync(file, "utf8");
if (html.includes("<!-- SEO:START")) html = html.replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, block);
else html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, block);
fs.writeFileSync(file, html);
console.log(`JSON-LD actualizado: ${all.length} productos, ${FAQ.length} preguntas.`);

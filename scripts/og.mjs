// Regenera las imágenes para compartir (OG) por sabor y de la casa desde design/banners/flavor-og.html.
// Uso: node tests/serve.mjs . 8787 & node scripts/og.mjs
import { chromium } from "@playwright/test";
import { FLAVORS, JAPANESE } from "../js/catalog.mjs";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
const shot = async (q, out) => { await p.goto(`http://localhost:8787/design/banners/flavor-og.html?${q}`); await p.waitForSelector("body[data-ready]"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150); await p.locator("#og").screenshot({ path: out, type: "jpeg", quality: 86 }); };
for (const f of [...FLAVORS, ...JAPANESE]) await shot(`id=${f.id}`, `assets/og/${f.id}.jpg`);
await shot("main=editorial", "assets/banners/og/editorial-1200x630.jpg");
await shot("main=kraft", "assets/banners/og/kraft-1200x630.jpg");
await b.close(); console.log("ok", FLAVORS.length + JAPANESE.length + 2);

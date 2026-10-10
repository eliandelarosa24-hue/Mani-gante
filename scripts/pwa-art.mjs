// Regenera splash screens de iOS e íconos maskable desde design/banners/splash.html.
// Uso: node tests/serve.mjs . 8787 & node scripts/pwa-art.mjs
import { chromium } from "@playwright/test";
const b = await chromium.launch();
const jobs = [
  ["w=1290&h=2796", "splash-1290x2796.png"], ["w=1179&h=2556", "splash-1179x2556.png"],
  ["w=1170&h=2532", "splash-1170x2532.png"], ["w=750&h=1334", "splash-750x1334.png"],
  ["w=512&h=512&icon", "icon-maskable-512.png"], ["w=192&h=192&icon", "icon-maskable-192.png"],
];
for (const [q, out] of jobs) {
  const [w, h] = q.match(/\d+/g).map(Number);
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(`http://localhost:8787/design/banners/splash.html?${q}`);
  await p.waitForSelector("body[data-ready]"); await p.waitForTimeout(200);
  await p.locator("#s").screenshot({ path: `assets/img/${out}` });
  await p.close();
}
await b.close(); console.log("ok", jobs.length);

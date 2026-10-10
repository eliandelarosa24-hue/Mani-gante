// Service worker de MANI-GANTE: la tienda abre sin conexión con el último stock conocido.
// Estrategias: shell → cache-first con revalidación; /api/stock y /api/status → network-first con respaldo;
// imágenes y fuentes → cache-first. Nunca cachea el admin ni el agente ni las reservas.
const VERSION = "mg-v4.2-2026.10.4";
const SHELL = [
  "/", "/index.html", "/css/fonts.css", "/css/tokens.css", "/css/styles.css",
  "/js/app.mjs", "/js/catalog.mjs", "/js/art.mjs", "/js/voice.mjs", "/js/ui.mjs", "/js/analytics.mjs", "/js/history.mjs",
  "/js/tilt.mjs", "/js/ticket.mjs", "/js/i18n.mjs", "/js/agent.mjs", "/js/motion.mjs",
  "/js/door.mjs", "/js/label-data.mjs", "/assets/img/logo-mark.png", "/assets/fonts/bodoni-moda.woff2", "/assets/fonts/bodoni-moda-italic.woff2", "/assets/fonts/big-shoulders.woff2",
  "/assets/fonts/instrument-sans.woff2", "/assets/img/icon-192.png", "/offline.html",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const NEVER = /^\/(api\/(agent|reserve|admin|alerts|events)|admin)/;

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || NEVER.test(url.pathname)) return;

  if (url.pathname === "/api/stock" || url.pathname === "/api/status") {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => caches.match(req)));
    return;
  }
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
      .catch(async () => (await caches.match(req)) || (await caches.match("/index.html")) || caches.match("/offline.html")));
    return;
  }
  if (/\.(webp|png|jpg|woff2|svg)$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })));
    return;
  }
  // JS/CSS: stale-while-revalidate
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => hit);
    return hit || net;
  }));
});

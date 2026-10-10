// Eventos de negocio + Core Web Vitals → /api/events (sendBeacon, en lotes, sin cookies ni datos personales).
const queue = [];
let flushTimer;
function flush() {
  if (!queue.length) return;
  const body = JSON.stringify({ events: queue.splice(0, 30) });
  const ok = navigator.sendBeacon?.("/api/events", new Blob([body], { type: "application/json" }));
  if (!ok) fetch("/api/events", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
}
export function track(name, props, value) {
  queue.push({ name, ...(props ? { props } : {}), ...(value !== undefined ? { value } : {}) });
  clearTimeout(flushTimer); flushTimer = setTimeout(flush, 2500);
}
addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
addEventListener("pagehide", flush);

// --- Core Web Vitals (implementación mínima con PerformanceObserver) ---
function observe(type, cb) {
  try { const po = new PerformanceObserver((l) => l.getEntries().forEach(cb)); po.observe({ type, buffered: true }); return po; } catch { return null; }
}
let lcp = 0, cls = 0, inp = 0;
observe("largest-contentful-paint", (e) => { lcp = e.startTime; });
observe("layout-shift", (e) => { if (!e.hadRecentInput) cls += e.value; });
observe("event", (e) => { if (e.interactionId) inp = Math.max(inp, e.duration); });
observe("paint", (e) => { if (e.name === "first-contentful-paint") track("vital:fcp", undefined, Math.round(e.startTime)); });
let sent = false;
function sendVitals() {
  if (sent) return; sent = true;
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav) track("vital:ttfb", undefined, Math.round(nav.responseStart));
  if (lcp) track("vital:lcp", undefined, Math.round(lcp));
  track("vital:cls", undefined, Math.round(cls * 1000) / 1000);
  if (inp) track("vital:inp", undefined, Math.round(inp));
  flush();
}
addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") sendVitals(); });

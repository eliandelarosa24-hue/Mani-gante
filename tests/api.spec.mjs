import { test, expect } from "@playwright/test";

const iso = (d) => d.toISOString().slice(0, 10);
async function nextDay(request) {
  const s = await (await request.get("/api/status")).json();
  return s.slots[0];
}

test("API reservas: Zod rechaza datos inválidos con mensajes en español", async ({ request }) => {
  const r = await request.post("/api/reserve", { data: { name: "", date: "x", time: "1", items: [] }, headers: { "x-forwarded-for": "1.1.1.1" } });
  expect(r.status()).toBe(400);
  const d = await r.json();
  expect(d.errors).toContain("Falta el nombre de quien retira.");
});

test("API reservas: respeta la capacidad del bloque", async ({ request }) => {
  const day = await nextDay(request);
  const time = day.slots[day.slots.length - 1].time;
  let last;
  for (let i = 0; i < 7; i++) {
    last = await request.post("/api/reserve", { data: { name: `C${i}`, date: day.iso, time, items: [{ id: "coco", qty: 1 }] }, headers: { "x-forwarded-for": `2.2.2.${i}` } });
  }
  expect(last.status()).toBe(409);
  expect((await last.json()).errors[0]).toContain("lleno");
});

test("API admin: sin token 401, con token entrega el resumen y exporta CSV", async ({ request }) => {
  expect((await request.get("/api/admin/summary")).status()).toBe(401);
  const auth = { authorization: "Bearer test-admin-token-123" };
  const s = await request.get("/api/admin/summary", { headers: auth });
  expect(s.status()).toBe(200);
  expect((await s.json()).catalogVersion).toBeTruthy();
  const csv = await request.get(`/api/admin/export.csv?from=2020-01-01&to=${iso(new Date(Date.now() + 9e8))}`, { headers: auth });
  expect(csv.headers()["content-type"]).toContain("text/csv");
  expect(await csv.text()).toContain("codigo");
});

test("API admin: 'Jorge no está' bloquea reservas y se refleja en /api/status", async ({ request }) => {
  const auth = { authorization: "Bearer test-admin-token-123" };
  await request.post("/api/admin", { headers: auth, data: { action: "campus.toggle", away: true, message: "Vuelvo el lunes" } });
  const st = await (await request.get("/api/status")).json();
  expect(st.campus.away).toBe(true);
  const day = st.slots[0];
  const r = await request.post("/api/reserve", { data: { name: "X", date: day.iso, time: day.slots[0].time, items: [{ id: "coco", qty: 1 }] }, headers: { "x-forwarded-for": "3.3.3.3" } });
  expect(r.status()).toBe(409);
  await request.post("/api/admin", { headers: auth, data: { action: "campus.toggle", away: false } });
});

test("API stock: el webhook exige secreto", async ({ request }) => {
  expect((await request.post("/api/stock", { data: { sabores: [] } })).status()).toBe(401);
  expect((await request.post("/api/stock", { data: { sabores: [{ id: "frambuesa", disponible: false }] }, headers: { "x-stock-secret": "test-hook" } })).status()).toBe(200);
});

test("API eventos: acepta lotes válidos y limita abuso", async ({ request }) => {
  const ok = await request.post("/api/events", { data: { events: [{ name: "page_view" }] }, headers: { "x-forwarded-for": "4.4.4.4" } });
  expect(ok.status()).toBe(204);
  let status = 204;
  for (let i = 0; i < 70; i++) status = (await request.post("/api/events", { data: { events: [{ name: "page_view" }] }, headers: { "x-forwarded-for": "5.5.5.5" } })).status();
  expect(status).toBe(429);
});

test("API v4.5: el ticket informa su estado (sin datos personales) y la ficha del QR muestra el tip", async ({ request }) => {
  const day = await nextDay(request);
  const r = await request.post("/api/reserve", { data: { name: "Chiqui", date: day.iso, time: day.slots[0].time, items: [{ id: "maracuya", qty: 1 }] }, headers: { "x-forwarded-for": "9.9.9.1" } });
  const { reservation } = await r.json();
  const st = await (await request.get(`/api/reserve?code=${reservation.code}&date=${day.iso}`)).json();
  expect(st.status).toBe("pendiente");
  expect(JSON.stringify(st)).not.toContain("Chiqui");
  await request.post("/api/admin", { headers: { authorization: "Bearer test-admin-token-123" }, data: { action: "reservation.status", date: day.iso, code: reservation.code, status: "pagada" } });
  expect((await (await request.get(`/api/reserve?code=${reservation.code}&date=${day.iso}`)).json()).status).toBe("pagada");
  expect((await request.get(`/api/reserve?code=MG-ZZZZ&date=${day.iso}`)).status()).toBe(404);
  const html = await (await request.get("/sabor/maracuya?qr=1")).text();
  expect(html).toContain("Escaneaste tu bolsa");
  expect(html).toContain("Tip de la casa");
});

// ---------- SmartStock → web comercial (datos ficticios) ----------
import { createHmac } from "node:crypto";
function signed(feed, { secret = "test-feed-secret", ts = Date.now() } = {}) {
  const body = JSON.stringify(feed);
  return { data: body, headers: { "content-type": "application/json", "x-smartstock-timestamp": String(ts), "x-smartstock-signature": createHmac("sha256", secret).update(ts + "." + body).digest("hex"), "x-forwarded-for": "7.7.7." + Math.floor(Math.random() * 200) } };
}
const feedOf = (items, ms = 6 * 3600_000) => ({ version: 1, generatedAt: new Date().toISOString(), validUntil: new Date(Date.now() + ms).toISOString(), items });
test("SmartStock: rechaza firma falsa, firma vieja y campos privados; acepta el resumen válido", async ({ request }) => {
  const feed = feedOf([{ flavor: "coco", status: "out_of_stock", units: 0 }]);
  expect((await request.post("/api/disponibilidad", signed(feed, { secret: "otra" }))).status()).toBe(401);
  expect((await request.post("/api/disponibilidad", signed(feed, { ts: Date.now() - 10 * 60_000 }))).status()).toBe(401);
  expect((await request.post("/api/disponibilidad", signed({ ...feed, cash: 100000 }))).status()).toBe(422);
  expect((await request.post("/api/disponibilidad", signed(feedOf([{ flavor: "coco", status: "available", cost: 3200 }])))).status()).toBe(422);
  const ok = await request.post("/api/disponibilidad", signed(feed));
  expect(ok.status()).toBe(200);
  await new Promise((r) => setTimeout(r, 16_000)); // caché del stock (15 s)
  const stock = await (await request.get("/api/stock")).json();
  const coco = stock.catalog.find((f) => f.id === "coco");
  expect(coco.available).toBe(false);
  expect(coco.stockSource).toBe("smartstock");
  expect(JSON.stringify(stock)).not.toContain("test-feed-secret");
});
test("SmartStock: si el dato vence, el sabor queda 'por confirmar' (nunca un disponible viejo)", async ({ request }) => {
  expect((await request.post("/api/disponibilidad", signed(feedOf([{ flavor: "frutilla", status: "out_of_stock", units: 0 }], 2000)))).status()).toBe(200);
  await new Promise((r) => setTimeout(r, 16_500));
  const frutilla = (await (await request.get("/api/stock")).json()).catalog.find((f) => f.id === "frutilla");
  expect(frutilla.unconfirmed).toBe(true);
  expect(frutilla.stockSource).toBe("smartstock-vencido");
  // limpieza: un resumen sin sabores no altera el catálogo de las demás pruebas
  expect((await request.post("/api/disponibilidad", signed(feedOf([])))).status()).toBe(200);
});

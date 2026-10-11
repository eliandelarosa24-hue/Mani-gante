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

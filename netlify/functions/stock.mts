// GET  /api/stock  → catálogo con stock vigente (Sheets + caché + ajustes admin)
// POST /api/stock  → webhook desde Apps Script (header x-stock-secret) para refrescar al instante
import { getLiveCatalog, refreshStock } from "../lib/catalog-live.mts";
import { processBackInStock } from "../lib/alerts.mts";
import { json, readJson } from "../lib/http.mts";

export default async (req: Request) => {
  if (req.method === "GET") {
    const { catalog, japanese, source, updated, version } = await getLiveCatalog();
    return json({ ok: true, catalog, japanese, source, updated, version }, 200, { "Cache-Control": "public, max-age=20" });
  }
  if (req.method === "POST") {
    const secret = process.env.STOCK_WEBHOOK_SECRET;
    if (!secret || req.headers.get("x-stock-secret") !== secret) return json({ ok: false }, 401);
    const body = await readJson<{ sabores?: unknown[] }>(req, 200_000);
    await refreshStock(Array.isArray(body?.sabores) ? body!.sabores : undefined);
    const live = await getLiveCatalog();
    const notified = await processBackInStock([...live.catalog, ...live.japanese]);
    return json({ ok: true, notified });
  }
  return json({ ok: false }, 405);
};

export const config = { path: "/api/stock" };

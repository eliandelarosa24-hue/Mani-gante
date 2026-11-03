// POST /api/disponibilidad → recibe el resumen firmado de SmartStock (solo sabor, estado y unidades).
// Sin secreto configurado, o con firma inválida/vieja, no acepta nada. No hay GET: no expone datos internos.
import { json, clientIp, rateLimit } from "../lib/http.mts";
import { verifySignature, validateFeed, saveFeed } from "../lib/smartstock-feed.mts";
import { invalidateStockCache } from "../lib/catalog-live.mts";

export default async (req: Request, context: { ip?: string }) => {
  if (req.method !== "POST") return json({ ok: false }, 405);
  if (await rateLimit("smartstock-feed", clientIp(req, context), 30)) return json({ ok: false }, 429);
  const secret = process.env.SMARTSTOCK_FEED_SECRET;
  if (!secret) return json({ ok: false, error: "No configurado" }, 503);
  const body = await req.text();
  if (body.length > 20_000) return json({ ok: false }, 413);
  if (!verifySignature(body, req.headers.get("x-smartstock-timestamp"), req.headers.get("x-smartstock-signature"), secret)) return json({ ok: false, error: "Firma inválida" }, 401);
  let feed;
  try { feed = validateFeed(JSON.parse(body)); } catch (e) { return json({ ok: false, error: (e as Error).message }, 422); }
  await saveFeed(feed);
  invalidateStockCache();
  return json({ ok: true, items: feed.items.length, validUntil: feed.validUntil });
};

export const config = { path: "/api/disponibilidad" };

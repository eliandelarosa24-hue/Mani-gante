// POST /api/alerts → "Avísame cuando vuelva" para un sabor agotado.
import { AlertInput, zodMessage } from "../lib/schemas.mts";
import { subscribe } from "../lib/alerts.mts";
import { json, readJson, clientIp, rateLimit, sameOrigin } from "../lib/http.mts";
import { FLAVORS, JAPANESE } from "../../js/catalog.mjs";

export default async (req: Request, context: { ip?: string }) => {
  if (req.method !== "POST") return json({ ok: false }, 405);
  if (!sameOrigin(req)) return json({ ok: false }, 403);
  if (await rateLimit("alerts", clientIp(req, context), 5)) return json({ ok: false, errors: ["Espera un minuto."] }, 429);
  const parsed = AlertInput.safeParse(await readJson(req, 4000));
  if (!parsed.success) return json({ ok: false, errors: zodMessage(parsed.error) }, 400);
  if (![...FLAVORS, ...JAPANESE].some((f) => f.id === parsed.data.flavorId)) return json({ ok: false, errors: ["Ese sabor no existe."] }, 404);
  const waiting = await subscribe(parsed.data.flavorId, parsed.data.name, parsed.data.contact);
  return json({ ok: true, waiting });
};

export const config = { path: "/api/alerts" };

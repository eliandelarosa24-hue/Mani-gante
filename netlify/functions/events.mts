// POST /api/events → eventos de negocio y Web Vitals (navigator.sendBeacon).
import { EventInput } from "../lib/schemas.mts";
import { track } from "../lib/analytics.mts";
import { json, readJson, clientIp, rateLimit } from "../lib/http.mts";

export default async (req: Request, context: { ip?: string }) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  if (await rateLimit("events", clientIp(req, context), 60)) return new Response(null, { status: 429 });
  const parsed = EventInput.safeParse(await readJson(req, 8000));
  if (!parsed.success) return json({ ok: false }, 400);
  await track(parsed.data.events).catch(() => {});
  return new Response(null, { status: 204 });
};

export const config = { path: "/api/events" };

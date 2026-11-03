// GET /api/smartstock/apartados → SmartStock (privado) consulta las reservas vigentes para apartar bolsitas.
// Firma HMAC obligatoria y propia de este uso. Respuesta mínima: sin nombres, puntos de encuentro, notas ni pagos.
import { json, clientIp, rateLimit } from "../lib/http.mts";
import { verifyHoldsRequest, holdsPayload } from "../lib/smartstock-feed.mts";
import { reservationsBetween } from "../lib/reservations.mts";

const day = (offset: number) => new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Santiago" }).format(new Date(Date.now() + offset * 86400_000));

export default async (req: Request, context: { ip?: string }) => {
  if (req.method !== "GET") return json({ ok: false }, 405);
  if (await rateLimit("smartstock-holds", clientIp(req, context), 30)) return json({ ok: false }, 429);
  const secret = process.env.SMARTSTOCK_FEED_SECRET;
  if (!secret) return json({ ok: false, error: "No configurado" }, 503);
  if (!verifyHoldsRequest(req.headers.get("x-smartstock-timestamp"), req.headers.get("x-smartstock-signature"), secret)) return json({ ok: false, error: "Firma inválida" }, 401);
  // Desde 2 días atrás (para avisar tickets sin cerrar) hasta el máximo reservable.
  const rows = await reservationsBetween(day(-2), day(7));
  return json(holdsPayload(rows), 200, { "Cache-Control": "no-store, private" });
};

export const config = { path: "/api/smartstock/apartados" };

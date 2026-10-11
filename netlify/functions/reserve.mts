// POST /api/reserve → valida (Zod + stock + cupos + campus), guarda la reserva y avisa a la casa.
// GET  /api/reserve?code=MG-XXXX&date=YYYY-MM-DD → solo el estado del ticket (sin datos personales) para "Mis pedidos".
import { createReservation, reservationStatus } from "../lib/reservations.mts";
import { json, readJson, clientIp, rateLimit, sameOrigin } from "../lib/http.mts";

export default async (req: Request, context: { ip?: string }) => {
  if (req.method === "GET") {
    const u = new URL(req.url);
    const code = u.searchParams.get("code") || "", date = u.searchParams.get("date") || "";
    if (!/^MG-[A-Z0-9]{4}$/.test(code) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ ok: false }, 400);
    if (await rateLimit("reserve-status", clientIp(req, context), 60)) return json({ ok: false }, 429);
    const st = await reservationStatus(date, code);
    return st ? json({ ok: true, ...st }) : json({ ok: false }, 404);
  }
  if (req.method !== "POST") return json({ ok: false }, 405);
  if (!sameOrigin(req)) return json({ ok: false, errors: ["Origen no permitido."] }, 403);
  if (await rateLimit("reserve", clientIp(req, context), 6)) return json({ ok: false, errors: ["Demasiados intentos. Espera un minuto y vuelve a probar."] }, 429);
  const body = await readJson(req);
  if (!body) return json({ ok: false, errors: ["Solicitud inválida."] }, 400);
  const r = await createReservation(body, "formulario web");
  if (!r.ok) return json({ ok: false, errors: r.errors }, r.status);
  return json({ ok: true, reservation: r.reservation, whatsappUrl: r.whatsappUrl, ownerNotified: r.ownerNotified, slotsLeft: r.slotsLeft });
};

export const config = { path: "/api/reserve" };

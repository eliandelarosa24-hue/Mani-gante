// POST /api/reserve · valida una reserva del formulario contra stock en vivo + calendario,
// la registra (Sheets / WhatsApp Cloud API si están configurados) y devuelve el link de WhatsApp.
import { buildReservation } from "../../js/catalog.mjs";
import { getLiveCatalog } from "../lib/stock.mjs";
import { notifyReservation } from "../lib/notify.mjs";

export default async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, errors: ["Solicitud inválida."] }, { status: 400 }); }
  if (body?.website) return Response.json({ ok: false, errors: ["Solicitud inválida."] }, { status: 400 }); // honeypot

  const { catalog, source } = await getLiveCatalog();
  const result = buildReservation(
    {
      name: body?.name, date: body?.date, time: body?.time, meetingPoint: body?.meetingPoint,
      format: body?.format, items: Array.isArray(body?.items) ? body.items.slice(0, 40) : [], notes: body?.notes,
    },
    catalog,
  );
  if (!result.ok) return Response.json({ ok: false, errors: result.errors, stockSource: source }, { status: 422 });

  const notified = await notifyReservation(result, "formulario web");
  return Response.json({
    ok: true,
    reservation: result.reservation,
    whatsappUrl: result.whatsappUrl,
    ownerNotified: notified.some((n) => n.ok),
    stockSource: source,
  });
};

export const config = { path: "/api/reserve" };

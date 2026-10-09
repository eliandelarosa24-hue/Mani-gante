// Avisos automáticos de reservas. Ambos son opcionales y se activan con variables de entorno:
//
//  RESERVATIONS_WEBHOOK_URL   → URL del Apps Script (doPost) que guarda la reserva en Google Sheets.
//  WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID + OWNER_WHATSAPP
//                             → WhatsApp Cloud API (Meta): envía la reserva al WhatsApp del dueño
//                               en el instante en que se crea, sin que nadie tenga que copiarla.
//
// Si no están configuradas, la reserva igual funciona: el cliente la envía con el botón de WhatsApp.

export async function notifyReservation(result, origin = "web") {
  const tasks = [];
  const env = process.env;

  if (env.RESERVATIONS_WEBHOOK_URL) {
    tasks.push(
      fetch(env.RESERVATIONS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "reserva", origin, ...result.reservation, createdAt: new Date().toISOString() }),
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      }).then((r) => ({ channel: "sheets", ok: r.ok })),
    );
  }

  if (env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.OWNER_WHATSAPP) {
    tasks.push(
      fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify(ownerMessage(env, result, origin)),
        signal: AbortSignal.timeout(8000),
      }).then((r) => ({ channel: "whatsapp", ok: r.ok })),
    );
  }

  const settled = await Promise.allSettled(tasks);
  return settled.map((s) => (s.status === "fulfilled" ? s.value : { ok: false, error: String(s.reason) }));
}

// Meta solo permite texto libre si el dueño escribió al número del negocio en las últimas 24 h.
// Para avisos garantizados, crea una plantilla aprobada con 1 variable en el cuerpo
// y define WHATSAPP_TEMPLATE (nombre) y opcionalmente WHATSAPP_TEMPLATE_LANG (por defecto "es").
function ownerMessage(env, result, origin) {
  const summary = `${result.reservation.code} · ${result.reservation.name} · ${result.reservation.dateLabel} ${result.reservation.time} · ${result.reservation.meetingPoint} · ${result.reservation.bags} bolsas · $${result.reservation.total.toLocaleString("es-CL")}`;
  if (env.WHATSAPP_TEMPLATE) {
    return {
      messaging_product: "whatsapp",
      to: env.OWNER_WHATSAPP,
      type: "template",
      template: {
        name: env.WHATSAPP_TEMPLATE,
        language: { code: env.WHATSAPP_TEMPLATE_LANG || "es" },
        components: [{ type: "body", parameters: [{ type: "text", text: summary }] }],
      },
    };
  }
  return {
    messaging_product: "whatsapp",
    to: env.OWNER_WHATSAPP,
    type: "text",
    text: { body: `🔔 Nueva reserva (${origin})\n\n${result.message}` },
  };
}

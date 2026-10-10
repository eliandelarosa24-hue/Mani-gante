// Notificaciones unificadas. Cada canal se activa solo si tiene sus variables de entorno.
//  - WhatsApp Cloud API: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, OWNER_WHATSAPP (+ WHATSAPP_TEMPLATE opcional)
//  - Email (Resend): RESEND_API_KEY, OWNER_EMAIL, NOTIFY_FROM (ej: "MANI-GANTE <reservas@tudominio.cl>")
//  - Google Sheets (registro): RESERVATIONS_WEBHOOK_URL
//  - Push: pendiente (requiere claves VAPID); ver CHANGELOG.
export type Channel = "whatsapp" | "email" | "sheets";
export interface Notice { title: string; text: string; summary: string; record?: Record<string, unknown>; to?: { whatsapp?: string; email?: string } }

const env = process.env;

async function whatsapp(to: string, n: Notice) {
  const body = env.WHATSAPP_TEMPLATE
    ? { messaging_product: "whatsapp", to, type: "template", template: { name: env.WHATSAPP_TEMPLATE, language: { code: env.WHATSAPP_TEMPLATE_LANG || "es" }, components: [{ type: "body", parameters: [{ type: "text", text: n.summary.slice(0, 1000) }] }] } }
    : { messaging_product: "whatsapp", to, type: "text", text: { body: `${n.title}\n\n${n.text}`.slice(0, 4000) } };
  const r = await fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST", headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
  });
  return r.ok;
}

async function email(to: string, n: Notice) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.NOTIFY_FROM || "MANI-GANTE <onboarding@resend.dev>", to: [to], subject: n.title, text: n.text }),
    signal: AbortSignal.timeout(8000),
  });
  return r.ok;
}

async function sheets(n: Notice) {
  const r = await fetch(env.RESERVATIONS_WEBHOOK_URL!, {
    method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(n.record || {}), redirect: "follow", signal: AbortSignal.timeout(8000),
  });
  return r.ok;
}

/** Envía al dueño por todos los canales configurados. Nunca lanza: devuelve el resultado por canal. */
export async function notifyOwner(n: Notice) {
  const tasks: Array<Promise<{ channel: Channel; ok: boolean }>> = [];
  if (env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.OWNER_WHATSAPP) tasks.push(whatsapp(env.OWNER_WHATSAPP, n).then((ok) => ({ channel: "whatsapp" as const, ok })));
  if (env.RESEND_API_KEY && env.OWNER_EMAIL) tasks.push(email(env.OWNER_EMAIL, n).then((ok) => ({ channel: "email" as const, ok })));
  if (env.RESERVATIONS_WEBHOOK_URL && n.record) tasks.push(sheets(n).then((ok) => ({ channel: "sheets" as const, ok })));
  const settled = await Promise.allSettled(tasks);
  return settled.map((s) => (s.status === "fulfilled" ? s.value : { channel: "unknown", ok: false }));
}

/** Aviso a un cliente (alertas de stock). Solo email automático; WhatsApp a clientes requiere plantilla aprobada. */
export async function notifyCustomer(contact: string, n: Notice) {
  if (/@/.test(contact) && env.RESEND_API_KEY) return email(contact, n).catch(() => false);
  if (!/@/.test(contact) && env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_TEMPLATE) return whatsapp(contact.replace(/\D/g, ""), n).catch(() => false);
  return false;
}

// Servicio único de reservas: lo usan /api/reserve (formulario) y el agente IA.
import { buildReservation, reservableDays, RESERVATION_RULES, formatCLP } from "../../js/catalog.mjs";
import { ReserveInput, zodMessage } from "./schemas.mts";
import { getLiveCatalog } from "./catalog-live.mts";
import { getCampus } from "./settings.mts";
import { stores } from "./store.mts";
import { notifyOwner } from "./notify.mts";
import { track } from "./analytics.mts";

export type Status = "pendiente" | "pagada" | "entregada" | "no-show" | "cancelada";
export interface IndexEntry { code: string; time: string; status: Status; name: string; bags: number; total: number }

const indexKey = (date: string) => `index/${date}`;

export async function dayIndex(date: string) {
  return (await stores.reservations().get<IndexEntry[]>(indexKey(date))) || [];
}

/** Bloques reservables con cupos restantes, respetando el interruptor de campus. */
export async function slotAvailability(now = new Date()) {
  const campus = await getCampus();
  const days = reservableDays(now);
  const out = [];
  for (const d of days) {
    const blocked = campus.away && (!campus.until || d.iso <= campus.until);
    const idx = blocked ? [] : await dayIndex(d.iso);
    const slots = d.slots.map((time: string) => {
      const used = idx.filter((r) => r.time === time && r.status !== "cancelada").length;
      return { time, left: blocked ? 0 : Math.max(0, RESERVATION_RULES.slotCapacity - used) };
    });
    out.push({ ...d, blocked, slots });
  }
  return out;
}

export async function createReservation(raw: unknown, origin: string) {
  const parsed = ReserveInput.safeParse(raw);
  if (!parsed.success) return { ok: false as const, status: 400, errors: zodMessage(parsed.error) };
  const input = parsed.data;

  const campus = await getCampus();
  if (campus.away && (!campus.until || input.date <= campus.until)) {
    return { ok: false as const, status: 409, errors: [campus.message || "Esos días no estamos en el campus. Escríbenos por WhatsApp y lo coordinamos."] };
  }

  const { catalog, japanese } = await getLiveCatalog();
  const result = buildReservation({ ...input, meetingPoint: input.meetingPoint || RESERVATION_RULES.meetingPoints[0] }, [...catalog, ...japanese]);
  if (!result.ok) return { ok: false as const, status: 422, errors: result.errors };

  const idx = await dayIndex(input.date);
  const used = idx.filter((r) => r.time === input.time && r.status !== "cancelada").length;
  if (used >= RESERVATION_RULES.slotCapacity) {
    return { ok: false as const, status: 409, errors: [`El bloque de las ${input.time} ya está lleno. Elige otro horario.`] };
  }

  const r = { ...result.reservation, notes: input.notes, payment: input.payment || null, origin, status: "pendiente" as Status, createdAt: new Date().toISOString() };
  const store = stores.reservations();
  await store.set(`res/${input.date}/${r.code}`, r);
  idx.push({ code: r.code, time: r.time, status: "pendiente", name: r.name, bags: r.bags, total: r.total });
  await store.set(indexKey(input.date), idx);

  const summary = `${r.code} · ${r.name} · ${r.dateLabel} ${r.time} · ${r.meetingPoint} · ${r.bags} bolsas · ${formatCLP(r.total)}`;
  const [notified] = await Promise.all([
    notifyOwner({ title: `Nueva reserva ${r.code}`, text: result.message, summary, record: { action: "reserva", ...r } }),
    track([{ name: "reservation_created", props: { origin } }]).catch(() => {}),
  ]);

  return { ok: true as const, status: 200, reservation: r, message: result.message, whatsappUrl: result.whatsappUrl, ownerNotified: notified.some((n) => n.ok), slotsLeft: RESERVATION_RULES.slotCapacity - used - 1 };
}

export async function setStatus(date: string, code: string, status: Status) {
  const store = stores.reservations();
  const r = await store.get<any>(`res/${date}/${code}`);
  if (!r) return false;
  r.status = status; r.updatedAt = new Date().toISOString();
  await store.set(`res/${date}/${code}`, r);
  const idx = await dayIndex(date);
  const e = idx.find((x) => x.code === code); if (e) e.status = status;
  await store.set(indexKey(date), idx);
  return true;
}

export async function reservationsBetween(from: string, to: string) {
  const store = stores.reservations();
  const keys = (await store.list("res/")).filter((k) => { const d = k.split("/")[1]; return d >= from && d <= to; });
  const rows = await Promise.all(keys.map((k) => store.get<any>(k)));
  return rows.filter(Boolean).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

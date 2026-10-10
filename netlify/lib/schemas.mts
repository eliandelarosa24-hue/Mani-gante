// Contratos de la API validados con Zod (entrada pública y acciones admin).
import { z } from "zod";

const id = z.string().trim().min(1, "Sabor inválido.").max(80).regex(/^[a-z0-9-]+$/i, "Sabor inválido.");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige un día válido.");
const hhmm = z.string().regex(/^\d{2}:\d{2}$/, "Elige una hora válida.");

export const ItemSchema = z.object({ id, qty: z.coerce.number().int().min(1).max(99) });

export const ReserveInput = z.object({
  name: z.string().trim().min(1, "Falta el nombre de quien retira.").max(60),
  date: isoDate,
  time: hhmm,
  meetingPoint: z.string().trim().max(60).optional().default(""),
  format: z.enum(["celofan", "doypack"]).default("celofan"),
  items: z.array(ItemSchema).min(1, "Agrega al menos un sabor.").max(40),
  notes: z.string().trim().max(200).optional().default(""),
  payment: z.enum(["transferencia", "mercadopago", "efectivo"]).optional(),
  website: z.string().max(0, "Solicitud inválida.").optional(), // honeypot
});
export type ReserveInput = z.infer<typeof ReserveInput>;

export const AlertInput = z.object({
  flavorId: id,
  name: z.string().trim().max(60).optional().default(""),
  contact: z.string().trim().min(5).max(80).refine((v) => /^\+?[\d\s]{8,15}$/.test(v) || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Escribe un WhatsApp (+569…) o un email válido."),
  website: z.string().max(0).optional(),
});

export const EventInput = z.object({
  events: z.array(z.object({
    name: z.string().regex(/^[a-z0-9_:.-]{2,40}$/),
    value: z.number().finite().optional(),
    props: z.record(z.string(), z.union([z.string().max(80), z.number(), z.boolean()])).optional(),
  })).min(1).max(30),
});

export const AdminAction = z.discriminatedUnion("action", [
  z.object({ action: z.literal("reservation.status"), date: isoDate, code: z.string().regex(/^MG-[A-Z0-9]{4}$/), status: z.enum(["pendiente", "pagada", "entregada", "no-show", "cancelada"]) }),
  z.object({ action: z.literal("stock.override"), flavorId: id, available: z.boolean().nullable() }),
  z.object({ action: z.literal("lot.add"), flavorId: id, bags: z.number().int().min(1).max(500), madeOn: isoDate, note: z.string().max(120).optional() }),
  z.object({ action: z.literal("lot.sell"), lotId: z.string().max(40), bags: z.number().int().min(1).max(500) }),
  z.object({ action: z.literal("campus.toggle"), away: z.boolean(), message: z.string().max(140).optional(), until: isoDate.optional() }),
  z.object({ action: z.literal("alerts.markNotified"), flavorId: id }),
  z.object({ action: z.literal("ugc.add"), quote: z.string().trim().min(3).max(280), author: z.string().trim().max(60), source: z.enum(["instagram", "opinion", "whatsapp"]), url: z.string().url().max(300).optional() }),
  z.object({ action: z.literal("ugc.remove"), id: z.string().max(40) }),
]);
export type AdminAction = z.infer<typeof AdminAction>;

export const zodMessage = (err: z.ZodError) => err.issues.map((i) => i.message);

// Disponibilidad desde SmartStock (fuente de verdad del inventario físico).
// SmartStock EMPUJA un resumen firmado (HMAC-SHA256) con solo: ficha del sabor, estado y unidades.
// Esta web no guarda costos, pedidos, lotes ni datos personales: solo ese resumen y su vigencia.
// Si el dato vence (no llegó un envío nuevo), los sabores que maneja SmartStock quedan "por confirmar".
import { createHmac, timingSafeEqual } from "node:crypto";
import { stores } from "./store.mts";

export interface FeedItem { flavor: string; status: "available" | "out_of_stock"; units?: number }
export interface Feed { version: 1; generatedAt: string; validUntil: string; holdsAsOf?: string; items: FeedItem[] }
const KEY = "smartstock-feed";
const MAX_VALIDITY_MS = 12 * 3600_000;

export function verifySignature(body: string, ts: string | null, sig: string | null, secret: string | undefined, now = Date.now()) {
  if (!secret || !ts || !sig || !/^\d{13}$/.test(ts) || !/^[0-9a-f]{64}$/.test(sig)) return false;
  if (Math.abs(now - Number(ts)) > 5 * 60_000) return false; // no acepta envíos viejos repetidos
  const a = Buffer.from(createHmac("sha256", secret).update(ts + "." + body).digest("hex"), "hex");
  const b = Buffer.from(sig, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Validación estricta: cualquier campo extra (p. ej. costos) hace rechazar el envío completo. */
export function validateFeed(feed: any, now = Date.now()): Feed {
  const fail = (m: string) => { throw new Error(m); };
  if (!feed || feed.version !== 1 || !Array.isArray(feed.items) || feed.items.length > 100) fail("FEED_SHAPE");
  if (Object.keys(feed).some((k) => !["version", "generatedAt", "validUntil", "holdsAsOf", "items"].includes(k))) fail("FEED_PRIVATE_FIELDS");
  if (feed.holdsAsOf !== undefined && (!Number.isFinite(Date.parse(feed.holdsAsOf)) || Date.parse(feed.holdsAsOf) > now + 60_000)) fail("FEED_HOLDS_AS_OF");
  const gen = Date.parse(feed.generatedAt), until = Date.parse(feed.validUntil);
  if (!Number.isFinite(gen) || !Number.isFinite(until) || gen > now + 60_000 || until <= now || until - gen > MAX_VALIDITY_MS) fail("FEED_VALIDITY");
  const seen = new Set<string>();
  for (const i of feed.items) {
    if (Object.keys(i).some((k) => !["flavor", "status", "units"].includes(k))) fail("FEED_ITEM_PRIVATE_FIELDS");
    if (typeof i.flavor !== "string" || !/^[a-z0-9-]{2,80}$/.test(i.flavor) || seen.has(i.flavor)) fail("FEED_ITEM_FLAVOR");
    if (!["available", "out_of_stock"].includes(i.status)) fail("FEED_ITEM_STATUS");
    if (i.units !== undefined && (!Number.isSafeInteger(i.units) || i.units < 0)) fail("FEED_ITEM_UNITS");
    seen.add(i.flavor);
  }
  return feed as Feed;
}

export async function saveFeed(feed: Feed) {
  await stores.cache().set(KEY, { ...feed, receivedAt: new Date().toISOString() });
  // Las reservas que SmartStock ya contó (anteriores a holdsAsOf) dejan de descontarse aquí.
  const since = Date.parse(feed.holdsAsOf || feed.generatedAt);
  const pending = (await loadDelta()).filter((d) => Date.parse(d.createdAt) > since);
  await stores.cache().set(DELTA_KEY, pending);
}

// ---- Apartados (v0.7) ----
// Entre dos envíos de SmartStock, cada reserva nueva descuenta sus bolsitas aquí para no ofrecer dos veces lo mismo.
const DELTA_KEY = "smartstock-feed-delta";
export interface DeltaEntry { code: string; createdAt: string; lines: { id: string; qty: number }[] }
export async function loadDelta(): Promise<DeltaEntry[]> { const v = await stores.cache().get<DeltaEntry[]>(DELTA_KEY).catch(() => null); return Array.isArray(v) ? v : []; }
export async function recordHoldDelta(r: { code: string; createdAt: string; lines: { id: string; qty: number }[] }) {
  const list = (await loadDelta()).filter((d) => d.code !== r.code);
  list.push({ code: r.code, createdAt: r.createdAt, lines: r.lines.map((l) => ({ id: l.id, qty: l.qty })) });
  await stores.cache().set(DELTA_KEY, list.slice(-300));
}
export function deltaFor(flavorId: string, feed: (Feed & { receivedAt?: string }) | null, delta: DeltaEntry[]) {
  if (!feed) return 0;
  const since = Date.parse(feed.holdsAsOf || feed.generatedAt);
  return delta.filter((d) => Date.parse(d.createdAt) > since).flatMap((d) => d.lines).filter((l) => l.id === flavorId).reduce((n, l) => n + l.qty, 0);
}

/** SmartStock pide los apartados con una firma propia de este uso (no sirve la firma del envío de disponibilidad). */
export const HOLDS_PATH = "/api/smartstock/apartados";
export const verifyHoldsRequest = (ts: string | null, sig: string | null, secret: string | undefined, now = Date.now()) =>
  verifySignature("holds.GET " + HOLDS_PATH, ts, sig, secret, now);

/** Solo lo mínimo: código del ticket, día, hora, estado y sabores. Nunca nombre, punto de encuentro, notas ni pago. */
export function holdsPayload(rows: any[], now = Date.now()) {
  const items = rows
    .filter((r) => r && ["pendiente", "pagada"].includes(r.status) && /^MG-[A-Z0-9]{4}$/.test(r.code) && /^\d{4}-\d{2}-\d{2}$/.test(r.date))
    .map((r) => ({
      code: r.code, date: r.date, ...(typeof r.time === "string" && /^\d{2}:\d{2}$/.test(r.time) ? { time: r.time } : {}), status: r.status,
      lines: (r.lines || []).filter((l: any) => /^[a-z0-9-]{2,80}$/.test(l.id) && Number.isSafeInteger(l.qty) && l.qty > 0 && l.qty <= 99)
        .map((l: any) => ({ siteId: l.id, qty: l.qty, ...(Number.isSafeInteger(l.price) && l.price > 0 ? { price: l.price } : {}) })),
    }))
    .filter((i) => i.lines.length);
  return { version: 1, generatedAt: new Date(now).toISOString(), items };
}
export async function loadFeed(): Promise<(Feed & { receivedAt: string }) | null> { return stores.cache().get(KEY).catch(() => null) as any; }

/** Aplica el resumen al catálogo. Vigente: manda SmartStock. Vencido: "por confirmar" (nunca un "Disponible" viejo). */
export function applyFeed<T extends { id: string; available: boolean }>(flavor: T, feed: (Feed & { receivedAt?: string }) | null, now = Date.now(), held = 0) {
  if (!feed) return flavor;
  const item = feed.items.find((i) => i.flavor === flavor.id);
  if (!item) return flavor; // sabores que SmartStock no maneja siguen con su fuente actual
  const fresh = Date.parse(feed.validUntil) > now;
  if (!fresh) return { ...flavor, available: true, unconfirmed: true, stockSource: "smartstock-vencido", stockUpdatedAt: feed.generatedAt };
  const units = item.units !== undefined ? Math.max(0, item.units - held) : undefined;
  const available = item.status === "available" && (units === undefined || units > 0);
  return { ...flavor, available, unconfirmed: false, low: units !== undefined ? units > 0 && units <= 5 : (flavor as any).low, units, stockSource: "smartstock", stockUpdatedAt: feed.generatedAt };
}

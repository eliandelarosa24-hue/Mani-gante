// Disponibilidad desde SmartStock (fuente de verdad del inventario físico).
// SmartStock EMPUJA un resumen firmado (HMAC-SHA256) con solo: ficha del sabor, estado y unidades.
// Esta web no guarda costos, pedidos, lotes ni datos personales: solo ese resumen y su vigencia.
// Si el dato vence (no llegó un envío nuevo), los sabores que maneja SmartStock quedan "por confirmar".
import { createHmac, timingSafeEqual } from "node:crypto";
import { stores } from "./store.mts";

export interface FeedItem { flavor: string; status: "available" | "out_of_stock"; units?: number }
export interface Feed { version: 1; generatedAt: string; validUntil: string; items: FeedItem[] }
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
  if (Object.keys(feed).some((k) => !["version", "generatedAt", "validUntil", "items"].includes(k))) fail("FEED_PRIVATE_FIELDS");
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

export async function saveFeed(feed: Feed) { await stores.cache().set(KEY, { ...feed, receivedAt: new Date().toISOString() }); }
export async function loadFeed(): Promise<(Feed & { receivedAt: string }) | null> { return stores.cache().get(KEY).catch(() => null) as any; }

/** Aplica el resumen al catálogo. Vigente: manda SmartStock. Vencido: "por confirmar" (nunca un "Disponible" viejo). */
export function applyFeed<T extends { id: string; available: boolean }>(flavor: T, feed: (Feed & { receivedAt?: string }) | null, now = Date.now()) {
  if (!feed) return flavor;
  const item = feed.items.find((i) => i.flavor === flavor.id);
  if (!item) return flavor; // sabores que SmartStock no maneja siguen con su fuente actual
  const fresh = Date.parse(feed.validUntil) > now;
  if (!fresh) return { ...flavor, available: true, unconfirmed: true, stockSource: "smartstock-vencido", stockUpdatedAt: feed.generatedAt };
  return { ...flavor, available: item.status === "available", unconfirmed: false, low: item.units !== undefined ? item.units > 0 && item.units <= 5 : (flavor as any).low, units: item.units, stockSource: "smartstock", stockUpdatedAt: feed.generatedAt };
}

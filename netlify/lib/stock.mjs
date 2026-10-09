// Stock en vivo desde Google Sheets (Apps Script), con caché corta en memoria.
import { FLAVORS, STOCK_API_URL, mergeRemoteStock } from "../../js/catalog.mjs";

let cache = { at: 0, catalog: null, source: "local", updated: null };
const TTL_MS = 60_000;

export async function getLiveCatalog() {
  if (cache.catalog && Date.now() - cache.at < TTL_MS) return cache;
  try {
    const res = await fetch(`${STOCK_API_URL}?t=${Date.now()}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    if (!payload?.ok || !Array.isArray(payload.sabores)) throw new Error("Formato inesperado");
    cache = { at: Date.now(), catalog: mergeRemoteStock(payload.sabores), source: "google-sheets", updated: payload.actualizado ?? null };
  } catch (error) {
    console.warn("Stock: usando respaldo local:", error.message);
    if (!cache.catalog) cache = { at: Date.now() - TTL_MS + 15_000, catalog: FLAVORS, source: "local", updated: null };
  }
  return cache;
}

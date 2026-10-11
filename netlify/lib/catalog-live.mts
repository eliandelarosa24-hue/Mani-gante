// Stock robusto: Google Sheets → caché en Blobs (60 s) → último valor conocido → catálogo local.
// Encima se aplican los ajustes manuales del admin y los lotes de inventario.
import { FLAVORS, JAPANESE, STOCK_API_URL, CATALOG_VERSION, mergeRemoteStock } from "../../js/catalog.mjs";
import { stores } from "./store.mts";
import { getOverrides, getLots } from "./settings.mts";

const TTL_MS = 60_000;
const LOW_STOCK = 5; // bolsas restantes para mostrar "Últimas unidades"
interface Cached { at: number; rows: unknown[]; updated: string | null }
let memo: { at: number; data: Awaited<ReturnType<typeof build>> } | null = null;

async function fetchSheet(): Promise<Cached> {
  const res = await fetch(`${STOCK_API_URL}?t=${Date.now()}`, { redirect: "follow", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const payload: any = await res.json();
  if (!payload?.ok || !Array.isArray(payload.sabores)) throw new Error("Formato inesperado");
  return { at: Date.now(), rows: payload.sabores, updated: payload.actualizado ?? null };
}

export async function refreshStock(rows?: unknown[]) {
  const cache = stores.cache();
  const data: Cached = rows ? { at: Date.now(), rows, updated: new Date().toISOString() } : await fetchSheet();
  await cache.set("stock", data);
  memo = null;
  return data;
}

async function build() {
  const cache = stores.cache();
  let cached = await cache.get<Cached>("stock").catch(() => null);
  let source: "google-sheets" | "cache" | "local" = "local";
  if (!cached || Date.now() - cached.at > TTL_MS) {
    try { cached = await refreshStock(); source = "google-sheets"; }
    catch (e) { console.warn("Stock: Sheets no respondió, uso caché/local:", (e as Error).message); if (cached) source = "cache"; }
  } else source = "google-sheets";

  const base = cached ? mergeRemoteStock(cached.rows as any[]) : FLAVORS;
  const [overrides, lots] = await Promise.all([getOverrides().catch(() => ({})), getLots().catch(() => [])]);
  const remaining: Record<string, number> = {};
  for (const l of lots) remaining[l.flavorId] = (remaining[l.flavorId] || 0) + Math.max(0, l.bags - l.sold);

  const apply = (f: any) => {
    const o = (overrides as any)[f.id];
    // "Últimas unidades": cuando el inventario por lotes del admin dice que quedan 5 o menos
    const left = remaining[f.id];
    const low = typeof left === "number" && left > 0 && left <= LOW_STOCK;
    return { ...f, available: typeof o === "boolean" ? o : f.available, overridden: typeof o === "boolean", low };
  };
  return {
    catalog: base.map(apply),
    japanese: JAPANESE.map(apply),
    source,
    updated: cached?.updated ?? null,
    version: CATALOG_VERSION,
    lotsRemaining: remaining, // solo lo usa el admin
  };
}

export async function getLiveCatalog() {
  if (memo && Date.now() - memo.at < 15_000) return memo.data;
  const data = await build();
  memo = { at: Date.now(), data };
  return data;
}

// GET /api/status → campus en vivo (horario + "Jorge no está"), cupos por bloque, promo y versión.
import { liveCampus } from "../lib/settings.mts";
import { slotAvailability } from "../lib/reservations.mts";
import { fridayPromo, CATALOG_VERSION } from "../../js/catalog.mjs";
import { stores } from "../lib/store.mts";
import { json } from "../lib/http.mts";
import { lastDays } from "../lib/analytics.mts";

// Sabores "en racha": los 3 más agregados o vistos en los últimos 7 días (mínimo 5 interacciones reales).
async function hotFlavors() {
  const days = await lastDays(7).catch(() => []);
  const total: Record<string, number> = {};
  for (const d of days) for (const [id, n] of Object.entries(d.flavors || {})) total[id] = (total[id] || 0) + n;
  return Object.entries(total).filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
}

export default async () => {
  const [campus, slots, ugc, hot] = await Promise.all([liveCampus(), slotAvailability(), stores.ugc().get<any[]>("items").catch(() => null), hotFlavors()]);
  return json({ ok: true, campus, slots, friday: fridayPromo(0).active, version: CATALOG_VERSION, ugc: (ugc || []).slice(0, 12), hot }, 200, { "Cache-Control": "public, max-age=15" });
};

export const config = { path: "/api/status" };

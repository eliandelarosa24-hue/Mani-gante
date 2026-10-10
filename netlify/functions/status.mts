// GET /api/status → campus en vivo (horario + "Jorge no está"), cupos por bloque, promo y versión.
import { liveCampus } from "../lib/settings.mts";
import { slotAvailability } from "../lib/reservations.mts";
import { fridayPromo, CATALOG_VERSION } from "../../js/catalog.mjs";
import { stores } from "../lib/store.mts";
import { json } from "../lib/http.mts";

export default async () => {
  const [campus, slots, ugc] = await Promise.all([liveCampus(), slotAvailability(), stores.ugc().get<any[]>("items").catch(() => null)]);
  return json({ ok: true, campus, slots, friday: fridayPromo(0).active, version: CATALOG_VERSION, ugc: (ugc || []).slice(0, 12) }, 200, { "Cache-Control": "public, max-age=15" });
};

export const config = { path: "/api/status" };

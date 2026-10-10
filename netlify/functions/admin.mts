// /api/admin/* → panel de Jorge. Requiere ADMIN_TOKEN (Authorization: Bearer …).
//  GET  /api/admin/summary?date=YYYY-MM-DD   reservas del día, stock, lotes, campus, alertas, métricas
//  GET  /api/admin/export.csv?from=&to=      reservas para contabilidad
//  POST /api/admin                            acciones (ver AdminAction en lib/schemas.mts)
import { AdminAction, zodMessage } from "../lib/schemas.mts";
import { json, readJson, isAdmin, clientIp, rateLimit } from "../lib/http.mts";
import { dayIndex, reservationsBetween, setStatus, slotAvailability } from "../lib/reservations.mts";
import { getLiveCatalog } from "../lib/catalog-live.mts";
import { getOverrides, getLots, getCampus, getVersions, logVersion, liveCampus, type Lot } from "../lib/settings.mts";
import { allAlerts, markNotified, processBackInStock } from "../lib/alerts.mts";
import { lastDays } from "../lib/analytics.mts";
import { stores } from "../lib/store.mts";
import { zonedNow, CATALOG_VERSION, CATALOG_CHANGELOG, FLAVORS, JAPANESE } from "../../js/catalog.mjs";

const csvCell = (v: unknown) => { const s = String(v ?? ""); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const nameOf = (id: string) => [...FLAVORS, ...JAPANESE].find((f) => f.id === id)?.name || id;

export default async (req: Request, context: { ip?: string }) => {
  if (await rateLimit("admin", clientIp(req, context), 120)) return json({ ok: false, error: "rate_limited" }, 429);
  if (!process.env.ADMIN_TOKEN) return json({ ok: false, error: "not_configured" }, 503);
  if (!isAdmin(req)) return json({ ok: false, error: "unauthorized" }, 401);
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/admin\/?/, "");

  if (req.method === "GET" && path === "summary") {
    const date = url.searchParams.get("date") || zonedNow().iso;
    const [idx, live, overrides, lots, campus, liveC, alerts, metrics, versions, slots, ugc] = await Promise.all([
      dayIndex(date), getLiveCatalog(), getOverrides(), getLots(), getCampus(), liveCampus(), allAlerts(), lastDays(14), getVersions(), slotAvailability(), stores.ugc().get<any[]>("items"),
    ]);
    const full = await Promise.all(idx.map((e) => stores.reservations().get<any>(`res/${date}/${e.code}`)));
    return json({
      ok: true, date, reservations: full.filter(Boolean), slots,
      stock: { source: live.source, updated: live.updated, catalog: [...live.catalog, ...live.japanese].map((f: any) => ({ id: f.id, name: f.name, available: f.available, overridden: f.overridden, lotsLeft: live.lotsRemaining[f.id] ?? null })) },
      overrides, lots, campus, liveCampus: liveC, alerts, metrics, ugc: ugc || [],
      catalogVersion: CATALOG_VERSION, catalogChangelog: CATALOG_CHANGELOG, versions: versions.slice(0, 30),
    });
  }

  if (req.method === "GET" && path === "export.csv") {
    const today = zonedNow().iso;
    const from = url.searchParams.get("from") || today.slice(0, 8) + "01";
    const to = url.searchParams.get("to") || today;
    const rows = await reservationsBetween(from, to);
    const header = ["fecha", "hora", "codigo", "nombre", "estado", "pago", "formato", "bolsas", "total_clp", "detalle", "punto", "origen", "creada"];
    const lines = rows.map((r: any) => [r.date, r.time, r.code, r.name, r.status, r.payment || "", r.format, r.bags, r.total, (r.lines || []).map((l: any) => `${l.name} x${l.qty}`).join(" | "), r.meetingPoint, r.origin, r.createdAt].map(csvCell).join(","));
    return new Response("﻿" + [header.join(","), ...lines].join("\n"), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="manigante-reservas-${from}_${to}.csv"`, "Cache-Control": "no-store" },
    });
  }

  if (req.method === "POST") {
    const parsed = AdminAction.safeParse(await readJson(req));
    if (!parsed.success) return json({ ok: false, errors: zodMessage(parsed.error) }, 400);
    const a = parsed.data;
    const settings = stores.settings();
    switch (a.action) {
      case "reservation.status":
        return json({ ok: await setStatus(a.date, a.code, a.status) });
      case "stock.override": {
        const o = await getOverrides();
        if (a.available === null) delete o[a.flavorId]; else o[a.flavorId] = a.available;
        await settings.set("overrides", o);
        await logVersion(a.available === null ? `${nameOf(a.flavorId)}: vuelve a seguir Google Sheets` : `${nameOf(a.flavorId)}: ${a.available ? "disponible" : "agotado"} (manual)`);
        await stores.cache().del("stock").catch(() => {});
        let notified = 0;
        if (a.available) { const live = await getLiveCatalog(); notified = await processBackInStock([...live.catalog, ...live.japanese].filter((f: any) => f.id === a.flavorId)); }
        return json({ ok: true, notified });
      }
      case "lot.add": {
        const lots = await getLots();
        const lot: Lot = { id: crypto.randomUUID().slice(0, 8), flavorId: a.flavorId, bags: a.bags, sold: 0, madeOn: a.madeOn, note: a.note, createdAt: new Date().toISOString() };
        lots.unshift(lot);
        await settings.set("lots", lots.slice(0, 500));
        await logVersion(`Lote ${lot.id}: ${a.bags} bolsas de ${nameOf(a.flavorId)} (${a.madeOn})`);
        return json({ ok: true, lot });
      }
      case "lot.sell": {
        const lots = await getLots();
        const lot = lots.find((l) => l.id === a.lotId);
        if (!lot) return json({ ok: false, errors: ["Lote no encontrado"] }, 404);
        lot.sold = Math.min(lot.bags, lot.sold + a.bags);
        await settings.set("lots", lots);
        return json({ ok: true, lot });
      }
      case "campus.toggle":
        await settings.set("campus", { away: a.away, message: a.message, until: a.until, updatedAt: new Date().toISOString() });
        await logVersion(a.away ? `Campus: Jorge no está${a.until ? " hasta " + a.until : ""}` : "Campus: Jorge de vuelta");
        return json({ ok: true });
      case "alerts.markNotified":
        await markNotified(a.flavorId);
        return json({ ok: true });
      case "ugc.add": {
        const items = (await stores.ugc().get<any[]>("items")) || [];
        items.unshift({ id: crypto.randomUUID().slice(0, 8), quote: a.quote, author: a.author, source: a.source, url: a.url, at: new Date().toISOString() });
        await stores.ugc().set("items", items.slice(0, 60));
        return json({ ok: true });
      }
      case "ugc.remove": {
        const items = ((await stores.ugc().get<any[]>("items")) || []).filter((i) => i.id !== a.id);
        await stores.ugc().set("items", items);
        return json({ ok: true });
      }
    }
  }
  return json({ ok: false, error: "not_found" }, 404);
};

export const config = { path: ["/api/admin", "/api/admin/*"] };

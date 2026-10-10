// "Avísame cuando vuelva": suscripciones por sabor y aviso al volver el stock.
import { stores } from "./store.mts";
import { notifyCustomer } from "./notify.mts";
import { BUSINESS } from "../../js/catalog.mjs";

export interface Sub { id: string; flavorId: string; name: string; contact: string; createdAt: string; notifiedAt?: string; channelOk?: boolean }

export async function subscribe(flavorId: string, name: string, contact: string) {
  const store = stores.alerts();
  const list = (await store.get<Sub[]>(flavorId)) || [];
  const norm = contact.replace(/\s/g, "").toLowerCase();
  if (!list.some((s) => s.contact === norm && !s.notifiedAt)) {
    list.push({ id: crypto.randomUUID().slice(0, 8), flavorId, name, contact: norm, createdAt: new Date().toISOString() });
    await store.set(flavorId, list.slice(-300));
  }
  return list.filter((s) => !s.notifiedAt).length;
}

export async function allAlerts() {
  const store = stores.alerts();
  const keys = await store.list();
  const out: Record<string, Sub[]> = {};
  for (const k of keys) out[k] = (await store.get<Sub[]>(k)) || [];
  return out;
}

/** Al volver un sabor, intenta avisar automáticamente; lo que no se pueda queda pendiente para el admin. */
export async function processBackInStock(available: Array<{ id: string; name: string; available: boolean }>) {
  const store = stores.alerts();
  let sent = 0;
  for (const f of available.filter((x) => x.available)) {
    const list = await store.get<Sub[]>(f.id);
    if (!list?.some((s) => !s.notifiedAt)) continue;
    for (const s of list.filter((x) => !x.notifiedAt)) {
      const ok = await notifyCustomer(s.contact, {
        title: `Volvió ${f.name} a MANI-GANTE`,
        text: `Hola${s.name ? " " + s.name : ""}, volvió ${f.name}. Resérvalo en ${BUSINESS.url}#tienda antes de que se acabe.\n\nJorge · MANI-GANTE`,
        summary: f.name,
      });
      if (ok) { s.notifiedAt = new Date().toISOString(); s.channelOk = true; sent++; }
    }
    await store.set(f.id, list);
  }
  return sent;
}

export async function markNotified(flavorId: string) {
  const store = stores.alerts();
  const list = (await store.get<Sub[]>(flavorId)) || [];
  list.forEach((s) => { s.notifiedAt ||= new Date().toISOString(); });
  await store.set(flavorId, list);
}

// Ajustes operativos que Jorge cambia desde el panel admin (sin tocar código).
import { stores } from "./store.mts";
import { campusStatus } from "../../js/catalog.mjs";

export interface Overrides { [flavorId: string]: boolean } // true = forzar disponible, false = forzar agotado
export interface Lot { id: string; flavorId: string; bags: number; sold: number; madeOn: string; note?: string; createdAt: string }
export interface Campus { away: boolean; message?: string; until?: string; updatedAt?: string }
export interface CatalogVersion { at: string; change: string; by: string }

export const getOverrides = async () => (await stores.settings().get<Overrides>("overrides")) || {};
export const getLots = async () => (await stores.settings().get<Lot[]>("lots")) || [];
export const getCampus = async () => (await stores.settings().get<Campus>("campus")) || { away: false };
export const getVersions = async () => (await stores.settings().get<CatalogVersion[]>("versions")) || [];

export async function logVersion(change: string, by = "admin") {
  const list = await getVersions();
  list.unshift({ at: new Date().toISOString(), change, by });
  await stores.settings().set("versions", list.slice(0, 200));
}

/** Estado del campus combinando el horario de catalog.mjs y el interruptor "Jorge no está". */
export async function liveCampus(date = new Date()) {
  const base = campusStatus(date);
  const campus = await getCampus();
  const today = date.toISOString().slice(0, 10);
  if (campus.away && (!campus.until || campus.until >= today)) {
    return { ...base, open: false, away: true, label: campus.message || "Jorge no está en el campus hoy", until: campus.until };
  }
  return { ...base, away: false };
}

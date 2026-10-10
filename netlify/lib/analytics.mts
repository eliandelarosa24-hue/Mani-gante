// Eventos de negocio agregados por día (contadores) + Web Vitals (suma y muestras).
import { stores } from "./store.mts";
import { zonedNow } from "../../js/catalog.mjs";

export interface DayStats { counts: Record<string, number>; vitals: Record<string, { n: number; sum: number; good: number }>; flavors: Record<string, number> }

const empty = (): DayStats => ({ counts: {}, vitals: {}, flavors: {} });
const VITAL_GOOD: Record<string, number> = { LCP: 2500, CLS: 0.1, INP: 200, FCP: 1800, TTFB: 800 };

export async function track(events: Array<{ name: string; value?: number; props?: Record<string, unknown> }>) {
  const store = stores.events();
  const key = `day/${zonedNow().iso}`;
  const day = (await store.get<DayStats>(key)) || empty();
  for (const e of events) {
    if (e.name.startsWith("vital:")) {
      const metric = e.name.slice(6).toUpperCase();
      const v = day.vitals[metric] ||= { n: 0, sum: 0, good: 0 };
      v.n++; v.sum += e.value ?? 0; if ((e.value ?? 0) <= (VITAL_GOOD[metric] ?? Infinity)) v.good++;
    } else {
      day.counts[e.name] = (day.counts[e.name] || 0) + 1;
      const flavor = e.props?.flavor;
      if (typeof flavor === "string" && /^(add_to_cart|quick_view)$/.test(e.name)) day.flavors[flavor] = (day.flavors[flavor] || 0) + 1;
    }
  }
  await store.set(key, day);
}

export async function lastDays(n = 14) {
  const store = stores.events();
  const out: Array<{ date: string } & DayStats> = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const iso = zonedNow(d).iso;
    const day = await store.get<DayStats>(`day/${iso}`);
    out.push({ date: iso, ...(day || empty()) });
  }
  return out;
}

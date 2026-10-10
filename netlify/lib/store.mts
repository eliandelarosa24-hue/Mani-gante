// Almacenamiento clave-valor sobre Netlify Blobs (sin base de datos externa).
// Fuera de Netlify (tests locales) cae a un Map en memoria con la misma interfaz.
import { getStore } from "@netlify/blobs";

export interface KV {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}

const memory = ((globalThis as any).__mgMemoryStores ??= new Map<string, Map<string, string>>()) as Map<string, Map<string, string>>;

function memoryStore(name: string): KV {
  if (!memory.has(name)) memory.set(name, new Map());
  const m = memory.get(name)!;
  return {
    async get(key) { const v = m.get(key); return v === undefined ? null : JSON.parse(v); },
    async set(key, value) { m.set(key, JSON.stringify(value)); },
    async del(key) { m.delete(key); },
    async list(prefix = "") { return [...m.keys()].filter((k) => k.startsWith(prefix)).sort(); },
  };
}

export function kv(name: string): KV {
  try {
    const store = getStore({ name, consistency: "strong" });
    return {
      async get(key) { return (await store.get(key, { type: "json" })) as any; },
      async set(key, value) { await store.setJSON(key, value); },
      async del(key) { await store.delete(key); },
      async list(prefix = "") { const { blobs } = await store.list({ prefix }); return blobs.map((b) => b.key).sort(); },
    };
  } catch {
    return memoryStore(name);
  }
}

export const stores = {
  cache: () => kv("mg-cache"),
  reservations: () => kv("mg-reservations"),
  settings: () => kv("mg-settings"),
  alerts: () => kv("mg-alerts"),
  events: () => kv("mg-events"),
  rate: () => kv("mg-rate"),
  ugc: () => kv("mg-ugc"),
};

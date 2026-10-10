// Utilidades HTTP compartidas: respuestas, IP, límite de uso y autenticación admin.
import { stores } from "./store.mts";

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers } });

export function clientIp(req: Request, context?: { ip?: string }) {
  return context?.ip || req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";
}

/** Ventana fija por minuto, compartida entre instancias vía Blobs (con respaldo en memoria). */
const local = new Map<string, number>();
export async function rateLimit(scope: string, ip: string, max: number): Promise<boolean> {
  const minute = Math.floor(Date.now() / 60_000);
  const key = `${scope}/${ip}/${minute}`;
  const localCount = (local.get(key) || 0) + 1;
  local.set(key, localCount);
  if (local.size > 5000) local.clear();
  if (localCount > max) return true;
  try {
    const store = stores.rate();
    const count = ((await store.get<number>(key)) || 0) + 1;
    await store.set(key, count);
    return count > max;
  } catch {
    return false;
  }
}

/** Rechaza peticiones de otros sitios (protección básica contra abuso desde navegadores ajenos). */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // curl / servidor a servidor
  try {
    const o = new URL(origin).host, h = req.headers.get("host");
    return o === h || o.endsWith(".netlify.app") || o.startsWith("localhost") || o.startsWith("127.0.0.1");
  } catch { return false; }
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function isAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token || token.length < 12) return false;
  const given = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return safeEqual(given, token);
}

export async function readJson<T = unknown>(req: Request, maxBytes = 16_000): Promise<T | null> {
  const text = await req.text();
  if (text.length > maxBytes) return null;
  try { return JSON.parse(text) as T; } catch { return null; }
}

// GET /api/instagram → últimas publicaciones (y las historias activas, si la cuenta lo permite) de @mani_gant.
// Usa la API oficial de Instagram (Instagram API with Instagram Login) con un token de larga duración en
// INSTAGRAM_TOKEN. El token dura 60 días: esta función lo renueva sola (una vez al día) y guarda el nuevo en
// Netlify Blobs, así no hay que volver a pegarlo. Respuestas en caché 10 minutos para no gastar cuota.
// Nota honesta: Instagram NO expone las "destacadas" (highlights) en su API pública; esas no se pueden traer.
import { stores } from "../lib/store.mts";
import { json } from "../lib/http.mts";

const GRAPH = "https://graph.instagram.com";
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const CACHE_MS = 10 * 60 * 1000;
const REFRESH_EVERY_MS = 24 * 60 * 60 * 1000;

type Post = { id: string; caption: string; type: string; image: string; url: string; at: string };

async function currentToken(): Promise<string | null> {
  const saved = await stores.settings().get<{ token: string; refreshedAt: number }>("instagram-token").catch(() => null);
  const token = saved?.token || process.env.INSTAGRAM_TOKEN || null;
  if (!token) return null;
  // Renueva el token de larga duración una vez al día (Instagram lo permite si tiene más de 24 h).
  if (!saved || Date.now() - saved.refreshedAt > REFRESH_EVERY_MS) {
    try {
      const r = await fetch(`${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
      if (r.ok) {
        const data = await r.json() as { access_token?: string };
        if (data.access_token) {
          await stores.settings().set("instagram-token", { token: data.access_token, refreshedAt: Date.now() });
          return data.access_token;
        }
      }
    } catch { /* si falla, seguimos con el token actual */ }
  }
  return token;
}

const toPost = (m: any): Post => ({
  id: String(m.id),
  caption: String(m.caption || "").slice(0, 220),
  type: m.media_type,
  image: m.media_type === "VIDEO" ? (m.thumbnail_url || m.media_url) : m.media_url,
  url: m.permalink,
  at: m.timestamp,
});

export default async () => {
  const cache = stores.cache();
  const hit = await cache.get<{ at: number; data: any }>("instagram").catch(() => null);
  if (hit && Date.now() - hit.at < CACHE_MS) return json(hit.data, 200, { "Cache-Control": "public, max-age=120" });

  const token = await currentToken();
  if (!token) return json({ ok: false, configured: false, posts: [], stories: [] }, 200, { "Cache-Control": "public, max-age=300" });

  try {
    const [mediaRes, storiesRes, profileRes] = await Promise.all([
      fetch(`${GRAPH}/me/media?fields=${FIELDS}&limit=12&access_token=${encodeURIComponent(token)}`),
      fetch(`${GRAPH}/me/stories?fields=${FIELDS}&access_token=${encodeURIComponent(token)}`).catch(() => null),
      fetch(`${GRAPH}/me?fields=username,media_count&access_token=${encodeURIComponent(token)}`).catch(() => null),
    ]);
    if (!mediaRes.ok) throw new Error(`Instagram respondió ${mediaRes.status}`);
    const media = await mediaRes.json() as { data?: any[] };
    const stories = storiesRes && storiesRes.ok ? ((await storiesRes.json()) as { data?: any[] }).data || [] : [];
    const profile = profileRes && profileRes.ok ? await profileRes.json() as { username?: string; media_count?: number } : {};
    const data = {
      ok: true, configured: true,
      username: profile.username || "mani_gant", count: profile.media_count ?? null,
      posts: (media.data || []).filter((m) => m.media_url || m.thumbnail_url).map(toPost),
      stories: stories.filter((m) => m.media_url || m.thumbnail_url).map(toPost),
      updated: new Date().toISOString(),
    };
    await cache.set("instagram", { at: Date.now(), data }).catch(() => {});
    return json(data, 200, { "Cache-Control": "public, max-age=120" });
  } catch (err) {
    console.warn("Instagram:", (err as Error).message);
    // Si Instagram falla, mostramos lo último que funcionó (aunque esté viejo).
    if (hit) return json({ ...hit.data, stale: true }, 200);
    return json({ ok: false, configured: true, posts: [], stories: [] }, 200);
  }
};

export const config = { path: "/api/instagram" };

// Servidor local sin Netlify CLI: estáticos + Netlify Functions (con almacenamiento en memoria). Uso: node tests/serve.mjs . 8787
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { pathToFileURL } from "node:url";
const root = path.resolve(process.argv[2] || "."); const port = +(process.argv[3] || 8787);
const routes = [];
for (const f of fs.readdirSync(path.join(root, "netlify/functions"))) {
  const mod = await import(pathToFileURL(path.join(root, "netlify/functions", f)).href);
  for (const p of [].concat(mod.config?.path || [])) routes.push({ re: new RegExp("^" + p.replace(/\*/g, ".*").replace(/:(\w+)/g, "(?<$1>[^/]+)") + "$"), fn: mod.default });
}
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".mjs":"text/javascript", ".js":"text/javascript", ".webp":"image/webp", ".png":"image/png", ".jpg":"image/jpeg", ".json":"application/json", ".webmanifest":"application/manifest+json", ".svg":"image/svg+xml", ".woff2":"font/woff2", ".xml":"application/xml", ".txt":"text/plain", ".ics":"text/calendar" };
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const route = routes.find((r) => r.re.test(url.pathname));
  if (route) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const params = url.pathname.match(route.re).groups || {};
    const r = new Request(url, { method: req.method, headers: req.headers, body: ["GET","HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
    try {
      const out = await route.fn(r, { ip: req.headers["x-forwarded-for"] || "127.0.0.1", params });
      res.writeHead(out.status, Object.fromEntries(out.headers));
      if (out.body) for await (const c of out.body) res.write(c);
    } catch (e) { console.error(e); res.writeHead(500); }
    return res.end();
  }
  let p = path.join(root, decodeURIComponent(url.pathname)); if (p.endsWith("/")) p += "index.html";
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }); return fs.createReadStream(path.join(root, "404.html")).pipe(res); }
  res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(res);
}).listen(port, () => console.log("up", port, routes.length, "routes"));

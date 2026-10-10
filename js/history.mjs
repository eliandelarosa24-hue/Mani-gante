// Historial de pedidos y reservas del cliente (solo en su dispositivo) + carrito compartible.
const KEY = "mg-history-v1";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30))); } catch {} };

/** entry: { type: "pedido"|"reserva", code?, items:[{id,qty,name}], total, bags, format, payment, date?, time?, meetingPoint?, whatsappUrl } */
export function saveOrder(entry) {
  const list = read();
  const id = entry.code || `P-${Date.now().toString(36).toUpperCase().slice(-5)}`;
  list.unshift({ id, status: "enviado", createdAt: new Date().toISOString(), ...entry });
  write(list);
  return id;
}
export const getOrders = read;
export function setOrderStatus(id, status) {
  const list = read(); const o = list.find((x) => x.id === id);
  if (o) { o.status = status; o.updatedAt = new Date().toISOString(); write(list); }
}
export function removeOrder(id) { write(read().filter((x) => x.id !== id)); }

// Carrito en la URL: ?pedido=maracuya.2,coco.1&f=doypack (corto, legible y fácil de compartir por WhatsApp)
export function cartToUrl(cart, format) {
  const u = new URL(location.href);
  u.hash = ""; u.search = "";
  u.searchParams.set("pedido", [...cart].map(([id, q]) => `${id}.${q}`).join(","));
  u.searchParams.set("f", format);
  return u.toString();
}
export function cartFromUrl() {
  const p = new URLSearchParams(location.search);
  const raw = p.get("pedido");
  if (!raw) return null;
  const items = raw.split(",").map((s) => { const [id, q] = s.split("."); return { id, qty: Math.max(1, Math.min(99, parseInt(q, 10) || 1)) }; }).filter((x) => /^[a-z0-9-]+$/.test(x.id));
  history.replaceState(null, "", location.pathname + location.hash);
  return { items, format: p.get("f") === "doypack" ? "doypack" : "celofan" };
}

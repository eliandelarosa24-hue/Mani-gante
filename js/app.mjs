import {
  BUSINESS, FORMATS, FLAVORS, JAPANESE, COMBOS, FAQ, NUTRITION, CATEGORY_ORDER, RESERVATION_RULES, STOCK_API_URL, ALLERGENS, SCHEDULE,
  mergeRemoteStock, formatCLP, unitPrice, slug, campusStatus, reservableDays, buildReservation, whatsappLink, fridayPromo, isNewFlavor,
} from "./catalog.mjs";
import { bagImg as bag, peanutsImg as swatch, stamp, guillocheImg, monogram } from "./art.mjs";
import { VOICE } from "./voice.mjs";
import { toast, trapFocus, stampMoment } from "./ui.mjs";
import { track } from "./analytics.mjs";
import { saveOrder, getOrders, setOrderStatus, removeOrder, cartToUrl, cartFromUrl } from "./history.mjs";
import { enableTilt } from "./tilt.mjs";
import { icsFile, googleCalendarUrl, downloadTicketPng } from "./ticket.mjs";
import { applyLang, getLang } from "./i18n.mjs";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const PAYMENTS = [
  { id: "mercadopago", label: "Mercado Pago", hint: "débito, crédito o saldo" },
  { id: "transferencia", label: "Transferencia", hint: "Cuenta RUT o Mach" },
  { id: "efectivo", label: "Efectivo", hint: "solo al recibir en el campus" },
];

// ============================================================
// Estado
// ============================================================
const state = {
  catalog: FLAVORS,
  japanese: JAPANESE,
  stockSource: "local",
  synced: false,
  format: store.get("mg-format", "celofan"),
  payment: store.get("mg-payment", "mercadopago"),
  cart: new Map(Object.entries(store.get("mg-cart-v2", {})).filter(([, q]) => q > 0)),
  category: "todos",
  query: "",
  filters: { available: false, top: false, new: false },
  status: null, // /api/status: campus, cupos, ugc
};
if (!FORMATS[state.format]) state.format = "celofan";
if (!PAYMENTS.some((p) => p.id === state.payment)) state.payment = "mercadopago";
const byId = () => new Map([...state.catalog, ...state.japanese].map((f) => [f.id, f]));
const available = () => state.catalog.filter((f) => f.available);
const formatOf = (f) => (f.line === "japones" ? "celofan" : state.format);

function splitName(name) {
  const m = name.match(/^(.*?)\s+c\/\s+(.*)$/);
  return m ? [m[1], m[2]] : [name.replace(/^Maní Japonés /, ""), ""];
}

// ============================================================
// Tienda
// ============================================================
const grid = $("#grid");
const gridJp = $("#gridJp");

function cardHTML(f) {
  const qty = state.cart.get(f.id) || 0;
  const [main, sub] = splitName(f.name);
  const badge = !f.available ? `<span class="badge out">Agotado</span>` : isNewFlavor(f) ? `<span class="badge new">Recién llegado</span>` : f.topVentas ? `<span class="badge">Más buscado</span>` : "";
  const premium = f.premium ? `<span class="badge premium">Precio fijo</span>` : "";
  const control = !f.available
    ? `<button class="add-btn ghost" type="button" data-alert="${f.id}"><svg><use href="#i-bell"/></svg>Avísame</button>`
    : qty > 0
      ? `<div class="stepper"><button type="button" data-dec="${f.id}" aria-label="Quitar uno de ${esc(f.name)}"><svg><use href="#i-minus"/></svg></button><output aria-live="polite">${qty}</output><button type="button" data-inc="${f.id}" aria-label="Agregar uno de ${esc(f.name)}"><svg><use href="#i-plus"/></svg></button></div>`
      : `<button class="add-btn" type="button" data-inc="${f.id}" aria-label="Agregar ${esc(f.name)}"><svg><use href="#i-plus"/></svg>Agregar</button>`;
  const fmt = formatOf(f);
  return `<article class="card${f.available ? "" : " soldout"}${qty ? " in-cart" : ""}" data-id="${f.id}" data-tilt style="--c:${f.color}">
    <button class="card-art" type="button" data-quick="${f.id}" aria-label="Ver detalle de ${esc(f.name)}">${badge}${premium}${bag(f.color, fmt, { label: "", num: f.no })}<span class="card-no" aria-hidden="true">Ficha Nº ${esc(f.no || "")}</span><span class="paper-sheen" aria-hidden="true"></span><span class="quick-hint" aria-hidden="true"><svg><use href="#i-eye"/></svg></span></button>
    <h3>${esc(main)}${sub ? `<small>c/ ${esc(sub)}</small>` : ""}</h3>
    ${f.alias ? `<em class="card-alias">alias «${esc(f.alias)}»</em>` : ""}
    <p>${esc(f.notes || "")}</p>
    <div class="card-foot"><span class="price">${formatCLP(unitPrice(f, fmt))}</span>${control}</div>
  </article>`;
}

function filtered() {
  const q = slug(state.query);
  const { available: onlyAv, top, new: onlyNew } = state.filters;
  return state.catalog.filter((f) =>
    (state.category === "todos" || slug(f.category) === state.category)
    && (!q || slug(`${f.name} ${f.category} ${f.notes} ${f.alias || ""}`).includes(q))
    && (!onlyAv || f.available) && (!top || f.topVentas) && (!onlyNew || isNewFlavor(f)));
}
function renderCatalog() {
  const list = filtered();
  grid.innerHTML = list.map(cardHTML).join("");
  const empty = $("#empty");
  empty.hidden = list.length > 0;
  if (!list.length) empty.innerHTML = `${bag("#C8963E", "doypack", { cls: "bag empty-bag" })}<span>${VOICE.emptySearch}</span> <button type="button" data-open-agent>Consultar al consigliere</button>`;
  gridJp.innerHTML = state.japanese.map(cardHTML).join("");
  window.dispatchEvent(new CustomEvent("mg:catalog"));
}
function refreshCard(id) {
  const f = byId().get(id);
  $$(`.card[data-id="${id}"]`).forEach((el) => {
    const tmp = document.createElement("div"); tmp.innerHTML = cardHTML(f);
    const fresh = tmp.firstElementChild;
    el.className = fresh.className;
    el.querySelector(".card-foot").replaceWith(fresh.querySelector(".card-foot"));
  });
}

function renderChips() {
  const counts = {}, colors = {};
  state.catalog.forEach((f) => { counts[f.category] = (counts[f.category] || 0) + 1; colors[f.category] ||= f.color; });
  const cats = CATEGORY_ORDER.filter((c) => counts[c]).concat(Object.keys(counts).filter((c) => !CATEGORY_ORDER.includes(c)));
  $("#chips").innerHTML = [`<button class="chip" role="tab" data-cat="todos" aria-selected="${state.category === "todos"}">Todos <b>${state.catalog.length}</b></button>`]
    .concat(cats.map((c) => `<button class="chip" role="tab" data-cat="${slug(c)}" aria-selected="${state.category === slug(c)}" style="--c:${colors[c]}"><i></i>${esc(c)} <b>${counts[c]}</b></button>`))
    .join("");
  const hasNew = [...state.catalog, ...state.japanese].some(isNewFlavor);
  const newBtn = $('#filters [data-filter="new"]');
  if (newBtn) newBtn.hidden = !hasNew; // si solo la línea japonesa es nueva, el filtro lleva a ella
}

function formatsHTML(current) {
  return Object.values(FORMATS).map((f) =>
    `<button class="format" type="button" role="radio" data-format="${f.id}" aria-checked="${current === f.id}">${bag("#C8963E", f.id, { cls: "mini-bag" })}<span><strong>${f.name} · ${formatCLP(f.price)}</strong><small>${f.detail}</small></span></button>`).join("");
}
function renderFormats() { $("#formats").innerHTML = formatsHTML(state.format); }
function setFormat(id) {
  state.format = id; store.set("mg-format", id);
  renderFormats(); renderCatalog(); renderCart(); renderReserveItems();
}

$("#chips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]"); if (!b) return;
  state.category = b.dataset.cat; renderChips(); renderCatalog();
});
$("#formats").addEventListener("click", (e) => { const b = e.target.closest("[data-format]"); if (b) setFormat(b.dataset.format); });
let searchTimer;
$("#search").addEventListener("input", (e) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { state.query = e.target.value; renderCatalog(); }, 120); });
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-filter]"); if (!b) return;
  const key = b.dataset.filter;
  state.filters[key] = !state.filters[key];
  b.setAttribute("aria-pressed", state.filters[key]);
  if (key === "new" && state.filters.new && !state.catalog.some(isNewFlavor)) { $("#gridJp").closest(".japanese").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
  track("filter", { filter: key });
  renderCatalog();
});

for (const container of [grid, gridJp]) {
  container.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), quick = e.target.closest("[data-quick]"), alert = e.target.closest("[data-alert]");
    if (inc) { plusOne(inc, "+1"); changeQty(inc.dataset.inc, +1, { from: inc.closest(".card")?.querySelector(".card-art") }); pulseCard(inc.dataset.inc); }
    else if (dec) changeQty(dec.dataset.dec, -1);
    else if (alert) openAlert(alert.dataset.alert);
    else if (quick) openQuick(quick.dataset.quick);
  });
}

// ============================================================
// Stock en vivo: /api/stock (caché + ajustes de Jorge) → Google Sheets → catálogo local
// ============================================================
const sync = $("#sync");
async function fetchStock() {
  try {
    const res = await fetch("/api/stock", { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (res.ok && (res.headers.get("content-type") || "").includes("json")) {
      const d = await res.json();
      if (d.ok && Array.isArray(d.catalog)) return { catalog: d.catalog, japanese: d.japanese || JAPANESE, updated: d.updated, source: d.source };
    }
  } catch {}
  const res = await fetch(`${STOCK_API_URL}?t=${Date.now()}`, { cache: "no-store", redirect: "follow", signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(res.status);
  const data = await res.json();
  if (!data?.ok || !Array.isArray(data.sabores)) throw new Error("formato");
  return { catalog: mergeRemoteStock(data.sabores), japanese: JAPANESE, updated: data.actualizado, source: "google-sheets" };
}
async function syncStock({ quiet = false } = {}) {
  if (!quiet) { sync.dataset.state = "loading"; $("#syncText").textContent = "Sincronizando disponibilidad…"; }
  const before = new Map(state.catalog.map((f) => [f.id, f.available]));
  try {
    const d = await fetchStock();
    state.catalog = d.catalog; state.japanese = d.japanese; state.stockSource = d.source === "local" ? "local" : "live";
    const t = d.updated ? new Date(d.updated) : new Date();
    sync.dataset.state = state.stockSource === "live" ? "online" : "fallback";
    $("#syncText").textContent = state.stockSource === "live"
      ? `Stock en vivo · actualizado ${isNaN(t) ? "recién" : t.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`
      : "Mostrando stock de respaldo · Jorge confirma por WhatsApp";
    store.set("mg-stock-cache", { at: Date.now(), catalog: state.catalog });
  } catch {
    const cached = store.get("mg-stock-cache", null);
    if (cached?.catalog) state.catalog = cached.catalog;
    sync.dataset.state = "fallback";
    $("#syncText").textContent = cached ? "Sin conexión · mostrando el último stock que vimos" : "Mostrando stock de respaldo · Jorge confirma por WhatsApp";
  }
  state.synced = true;
  $(".hero-card")?.classList.remove("is-loading"); $(".hero-card")?.removeAttribute("aria-busy");
  const backNow = state.catalog.filter((f) => f.available && before.get(f.id) === false);
  pruneCart();
  renderChips(); renderCatalog(); renderMarquees(); renderHero(); renderCart(); renderReserveItems(); renderPalette();
  if (backNow.length && quiet) toast(`Volvió ${backNow.map((f) => f.name).join(", ")}`, { tone: "alert", color: backNow[0].color });
}
$("#syncRetry").addEventListener("click", () => syncStock());
setInterval(() => { if (!document.hidden) { syncStock({ quiet: true }); loadStatus(); } }, 5 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) syncStock({ quiet: true }); });

// ============================================================
// Estado del negocio: campus (y "Jorge no está"), cupos, opiniones curadas
// ============================================================
async function loadStatus() {
  try {
    const res = await fetch("/api/status", { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok || !(res.headers.get("content-type") || "").includes("json")) return;
    state.status = await res.json();
  } catch { return; }
  const c = state.status.campus;
  const banner = $("#awayBanner");
  banner.hidden = !c?.away;
  if (c?.away) { $("#awayText").textContent = VOICE.away(c.label); document.body.classList.add("has-away"); }
  renderHero(); renderDays(); renderUgc();
}

// ============================================================
// Carrito / boleta
// ============================================================
function saveCart() { store.set("mg-cart-v2", Object.fromEntries(state.cart)); store.set("mg-cart-at", Date.now()); }
function pruneCart() {
  const m = byId(); const removed = [];
  for (const [id] of state.cart) {
    const f = m.get(id);
    if (!f || !f.available) { state.cart.delete(id); if (f) removed.push(f.name); }
  }
  if (removed.length) { toast(VOICE.removedSoldOut(removed.join(", ")), { tone: "info" }); saveCart(); }
}
// ============================================================
// Microanimaciones (todas respetan "reducir movimiento")
// ============================================================
/** Las cifras de dinero "ruedan" hasta el nuevo valor, como un contador de casino. */
function setMoney(el, value) {
  if (!el) return;
  const from = Number(el.dataset.v ?? value);
  el.dataset.v = value;
  if (reduceMotion || from === value || !el.isConnected) { el.textContent = formatCLP(value); return; }
  const t0 = performance.now(), dur = 420;
  cancelAnimationFrame(el._raf);
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 3;
    el.textContent = formatCLP(Math.round(from + (value - from) * e));
    if (k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}
/** Un "+1" dorado que sube desde el botón al agregar. */
function plusOne(anchor, text) {
  if (reduceMotion || !anchor?.getBoundingClientRect) return;
  const r = anchor.getBoundingClientRect(), el = document.createElement("span");
  el.className = "plus-one"; el.textContent = text; el.setAttribute("aria-hidden", "true");
  el.style.left = `${r.left + r.width / 2}px`; el.style.top = `${r.top}px`;
  document.body.append(el);
  el.animate([{ transform: "translate(-50%, 0) scale(.6)", opacity: 0 }, { transform: "translate(-50%, -18px) scale(1.15)", opacity: 1, offset: .3 }, { transform: "translate(-50%, -54px) scale(1)", opacity: 0 }], { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" }).onfinish = () => el.remove();
}
/** La ficha agregada se ilumina un instante. */
function pulseCard(id) {
  if (reduceMotion) return;
  requestAnimationFrame(() => $$(`.card[data-id="${id}"]`).forEach((c) => c.animate([{ boxShadow: "0 0 0 1px #d2ae6d, 0 0 0 0 rgba(210,174,109,.55)" }, { boxShadow: "0 0 0 1px #d2ae6d, 0 0 0 14px rgba(210,174,109,0)" }], { duration: 700, easing: "ease-out" })));
}
/** Botones dorados "magnéticos": se acercan sutilmente al puntero. */
if (!reduceMotion && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.addEventListener("pointermove", (e) => {
    const b = e.target.closest?.(".btn-gold, .finder, .agent-fab");
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.translate = `${((e.clientX - r.left) / r.width - .5) * 8}px ${((e.clientY - r.top) / r.height - .5) * 6}px`;
    if (!b._mag) { b._mag = true; b.addEventListener("pointerleave", () => { b.style.translate = ""; b._mag = false; }, { once: true }); }
  }, { passive: true });
}

function changeQty(id, delta, { from = null, silent = false } = {}) {
  const f = byId().get(id);
  if (!f || (delta > 0 && !f.available)) return;
  const q = Math.max(0, Math.min(99, (state.cart.get(id) || 0) + delta));
  q ? state.cart.set(id, q) : state.cart.delete(id);
  saveCart(); refreshCard(id); renderCart(); renderReserveItems();
  if (delta > 0) {
    track("add_to_cart", { flavor: id });
    if (!silent) {
      if (from) flyToCart(from, f.color); else bumpCart();
      if (q === 1) toast(VOICE.added(f.name), { color: f.color });
      try { navigator.vibrate?.(8); } catch {}
    }
  }
}
function addItems(items, { format } = {}) {
  if (format && format !== state.format) { state.format = format; store.set("mg-format", format); renderFormats(); }
  const m = byId(); const added = [];
  for (const { id, qty } of items) {
    const f = m.get(id); if (!f || !f.available) continue;
    state.cart.set(id, Math.min(99, (state.cart.get(id) || 0) + Math.max(1, qty | 0)));
    added.push(f.name);
  }
  saveCart(); renderCatalog(); renderCart(); renderReserveItems(); bumpCart();
  return added;
}
function cartLines() {
  const m = byId();
  return [...state.cart].map(([id, qty]) => ({ f: m.get(id), qty })).filter((l) => l.f)
    .map((l) => { const price = unitPrice(l.f, formatOf(l.f)); return { ...l, price, subtotal: price * l.qty }; });
}
const cartTotals = () => { const lines = cartLines(); return { lines, bags: lines.reduce((s, l) => s + l.qty, 0), total: lines.reduce((s, l) => s + l.subtotal, 0) }; };

function cartTarget() { const dock = $("#dockCart"); return dock && dock.offsetParent ? dock : $("#cartOpen"); }
function bumpCart() { const c = $("#cartOpen"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
function flyToCart(fromEl, color) {
  if (reduceMotion || !fromEl?.animate) return bumpCart();
  const a = fromEl.getBoundingClientRect(), b = cartTarget().getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "fly"; el.innerHTML = swatch(color);
  el.style.left = `${a.left + a.width / 2 - 32}px`; el.style.top = `${a.top + a.height / 2 - 32}px`;
  document.body.append(el);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  el.animate([
    { transform: "translate(0,0) scale(1.2) rotate(0)", opacity: 1 },
    { transform: `translate(${dx * .55}px, ${dy * .55 - 120}px) scale(.9) rotate(140deg)`, opacity: 1, offset: .55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.25) rotate(260deg)`, opacity: .3 },
  ], { duration: 800, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => { el.remove(); bumpCart(); };
}

/** Venta sugerida: complementos que no están en la boleta (mismo estilo o top ventas) y empujón al combo. */
function upsell(lines) {
  if (!lines.length) return [];
  const inCart = new Set(lines.map((l) => l.f.id));
  const cats = new Set(lines.map((l) => l.f.category));
  return available().filter((f) => !inCart.has(f.id)).sort((a, b) => (cats.has(b.category) - cats.has(a.category)) || (b.topVentas - a.topVentas)).slice(0, 3);
}

function orderMessage(lines, bags, total) {
  const fp = fridayPromo(bags);
  const pay = PAYMENTS.find((p) => p.id === state.payment);
  return [
    `*Pedido MANI-GANTE* ✅`, `Formato: ${FORMATS[state.format].name}`, ``,
    ...lines.map(({ f, qty, price }) => `▪ ${f.name} x${qty} (${formatCLP(price)} c/u)`),
    ``, `*Total: ${formatCLP(total)}* · ${bags} bolsas`,
    fp.free ? `🎁 Promo de viernes: ${fp.free} bolsa(s) gratis` : null,
    `Pago: ${pay.label}`, ``, `Mi nombre: `,
    state.payment === "efectivo" ? "Pago en efectivo al recibir." : "Adjunto comprobante.",
  ].filter((x) => x !== null).join("\n");
}

function renderPromo(bags) {
  const fp = fridayPromo(bags);
  const ribbon = $("#promoRibbon");
  if (ribbon) {
    ribbon.hidden = !fp.active;
    if (fp.active) {
      const pct = bags === 0 ? 0 : fp.free > 0 && bags % fp.group === 0 ? 100 : ((bags % fp.group) / fp.group) * 100;
      ribbon.innerHTML = `<span class="ribbon-label">Viernes de la casa</span><span class="ribbon-text">${bags ? VOICE.friday(fp.toNext, fp.free) : "Una oferta que no podrás rechazar: compra 4 y la 5ª va gratis"}</span><span class="ribbon-bar" role="progressbar" aria-label="Avance hacia la bolsa gratis" aria-valuemin="0" aria-valuemax="${fp.group}" aria-valuenow="${bags % fp.group}"><i style="width:${pct}%"></i></span>`;
    }
    document.body.classList.toggle("has-ribbon", fp.active);
  }
  const promo = $("#cartPromo");
  if (bags > 0 && fp.active) {
    promo.hidden = false;
    promo.innerHTML = `${VOICE.friday(fp.toNext, fp.free)}<div class="bar"><i style="width:${fp.free && bags % fp.group === 0 ? 100 : ((bags % fp.group) / fp.group) * 100}%"></i></div>`;
  } else if (bags > 0 && bags < 3) {
    promo.hidden = false; promo.textContent = `Con ${3 - bags} más completas el Combo Estudiante.`;
  } else promo.hidden = true;
}

function renderCart() {
  const { lines, bags, total } = cartTotals();
  $("#cartCount").hidden = bags === 0; $("#cartCount").textContent = bags;
  $("#cartSub").textContent = `N° ${String(bags).padStart(3, "0")} · ${bags} bolsa${bags === 1 ? "" : "s"} · ${FORMATS[state.format].name}`;
  setMoney($("#cartTotal"), total);
  $("#dockCount").textContent = `${bags} bolsa${bags === 1 ? "" : "s"}`; setMoney($("#dockTotal"), total);
  $("#dock").hidden = bags === 0;
  document.body.classList.toggle("has-cart", bags > 0);
  $("#cartFoot").hidden = bags === 0;
  renderPromo(bags);

  const ups = upsell(lines);
  $("#cartItems").innerHTML = lines.length ? lines.map(({ f, qty, price, subtotal }) => `
    <div class="line">${swatch(f.color)}
      <div class="line-info"><strong>${esc(f.name)}</strong><small>${qty} × ${formatCLP(price)} ····· ${formatCLP(subtotal)}</small></div>
      <div class="stepper"><button type="button" data-dec="${f.id}" aria-label="Quitar uno de ${esc(f.name)}"><svg><use href="#i-minus"/></svg></button><output>${qty}</output><button type="button" data-inc="${f.id}" aria-label="Agregar uno de ${esc(f.name)}"><svg><use href="#i-plus"/></svg></button></div>
    </div>`).join("") + (ups.length ? `<div class="upsell"><p class="rc-label"><span>Va chévere con lo tuyo</span></p><div class="pair-row">${ups.map((u) => `<button type="button" data-inc="${u.id}">${swatch(u.color)}${esc(u.name)} <b>+</b></button>`).join("")}</div></div>` : "")
    : `<div class="drawer-empty">${bag("#C8963E", "doypack")}<p class="hand">${VOICE.emptyCart}</p>
       <a class="btn btn-gold" href="#tienda" data-close-cart>Ir a la tienda</a><button class="link" type="button" data-open-quiz data-close-cart>Encontrar mi sabor</button></div>`;

  $("#cartPay").innerHTML = `<p class="rc-label"><span>Medio de pago</span></p>` + PAYMENTS.map((p) => `<button type="button" class="point" role="radio" data-pay="${p.id}" aria-checked="${p.id === state.payment}" title="${p.hint}">${p.label}</button>`).join("");
  $("#cartWa").href = whatsappLink(orderMessage(lines, bags, total));
}
$("#cartItems").addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
  if (inc) changeQty(inc.dataset.inc, +1, { silent: !inc.closest(".upsell") });
  if (dec) changeQty(dec.dataset.dec, -1);
});
$("#cartPay").addEventListener("click", (e) => { const b = e.target.closest("[data-pay]"); if (b) { state.payment = b.dataset.pay; store.set("mg-payment", state.payment); renderCart(); renderPayPicker(); } });
$("#cartClear").addEventListener("click", () => { state.cart.clear(); saveCart(); renderCatalog(); renderCart(); renderReserveItems(); });
$("#cartWa").addEventListener("click", () => {
  const { lines, bags, total } = cartTotals();
  saveOrder({ type: "pedido", items: lines.map(({ f, qty }) => ({ id: f.id, name: f.name, qty })), bags, total, format: state.format, payment: state.payment, whatsappUrl: $("#cartWa").href });
  track("order_whatsapp", { payment: state.payment });
  stampMoment($("#cart"));
  setTimeout(() => toast(VOICE.orderSaved(), { tone: "success", action: { label: "Ver", onClick: openHistory } }), 400);
});
$("#cartShare").addEventListener("click", async () => {
  const url = cartToUrl(state.cart, state.format);
  const text = `Mi pedido MANI-GANTE (${cartTotals().bags} bolsas): ${url}`;
  if (navigator.share) { try { await navigator.share({ title: "Mi pedido MANI-GANTE", text, url }); return; } catch {} }
  try { await navigator.clipboard.writeText(url); toast(VOICE.orderShared(), { tone: "info" }); }
  catch { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener"); }
});

let lastFocus = null, untrap = null;
function openCart() {
  lastFocus = document.activeElement;
  const cart = $("#cart");
  cart.classList.add("open"); cart.setAttribute("aria-hidden", "false"); cart.inert = false; $("#scrim").hidden = false;
  document.body.style.overflow = "hidden";
  untrap = trapFocus(cart);
  setTimeout(() => $("#cart [data-close-cart]")?.focus(), 50);
  track("cart_open");
}
function closeCart() {
  const cart = $("#cart");
  if (!cart.classList.contains("open")) return;
  cart.classList.remove("open"); cart.setAttribute("aria-hidden", "true"); cart.inert = true; $("#scrim").hidden = true;
  document.body.style.overflow = "";
  untrap?.();
  lastFocus?.focus?.({ preventScroll: true });
}
$("#cart").inert = true;
$("#cartOpen").addEventListener("click", openCart);
$("#dockCart").addEventListener("click", openCart);
$("#scrim").addEventListener("click", closeCart);
$("#cartReserve").addEventListener("click", closeCart);
document.addEventListener("click", (e) => { if (e.target.closest("[data-close-cart]")) closeCart(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); closeLightbox(); } });

// ============================================================
// Vista rápida
// ============================================================
const quick = $("#quick");
let qv = { id: null, qty: 1, format: state.format };
function pairsFor(f) {
  const pool = available().filter((x) => x.id !== f.id);
  const same = pool.filter((x) => x.category === f.category);
  const other = pool.filter((x) => x.category !== f.category && x.topVentas);
  return [...same.slice(0, 2), ...other.slice(0, 3)].slice(0, 3);
}
function renderQuick() {
  const f = byId().get(qv.id); if (!f) return;
  const fmt = f.line === "japones" ? "celofan" : qv.format;
  quick.style.setProperty("--c", f.color);
  $("#qvArt").innerHTML = bag(f.color, fmt, { label: `Bolsa de ${f.name}` });
  $("#qvArt").style.setProperty("--c", f.color);
  $("#qvCat").textContent = f.line === "japones" ? "Maní japonés" : f.category;
  $("#qvName").textContent = f.name;
  const qa = $("#qvAlias"); if (qa) qa.textContent = f.alias ? `alias «${f.alias}» · Ficha Nº ${f.no}` : "";
  $("#qvNotes").textContent = f.notes || "";
  const st = $("#qvStatus");
  st.className = `quick-status${f.available ? "" : " out"}`;
  st.innerHTML = `<i></i>${f.available ? `Disponible hoy${state.stockSource === "live" ? " · stock en vivo" : ""}` : "Agotado por ahora"}`;
  $("#qvFormats").hidden = f.line === "japones";
  $("#qvFormats").innerHTML = formatsHTML(fmt);
  $("#qvQty").textContent = qv.qty;
  $("#qvPrice").textContent = formatCLP(unitPrice(f, fmt) * qv.qty);
  const add = $("#qvAdd");
  add.disabled = false;
  add.innerHTML = f.available ? `Agregar · <span id="qvPrice">${formatCLP(unitPrice(f, fmt) * qv.qty)}</span>` : `<svg><use href="#i-bell"/></svg> Avísame cuando vuelva`;
  $("#qvReserve").hidden = !f.available;
  $("#qvPair").innerHTML = pairsFor(f).map((p) => `<button type="button" data-pair="${p.id}">${swatch(p.color)}${esc(p.name)}</button>`).join("");
  $("#qvAllergen").innerHTML = `<strong>Alérgenos:</strong> ${esc(ALLERGENS.note)}`;
  $("#qvPage").href = `/sabor/${f.id}`;
}
function setMedia(which) {
  $$(".media-toggle [data-media]").forEach((b) => b.setAttribute("aria-selected", b.dataset.media === which));
  $("#qvArt").hidden = which !== "art"; $("#qvPhoto").hidden = which !== "photo";
}
function openQuick(id) {
  qv = { id, qty: 1, format: state.format };
  setMedia("art");
  renderQuick();
  quick.showModal();
  track("quick_view", { flavor: id });
}
$(".media-toggle").addEventListener("click", (e) => { const b = e.target.closest("[data-media]"); if (b) setMedia(b.dataset.media); });
$("#qvMinus").addEventListener("click", () => { qv.qty = Math.max(1, qv.qty - 1); renderQuick(); });
$("#qvPlus").addEventListener("click", () => { qv.qty = Math.min(60, qv.qty + 1); renderQuick(); });
$("#qvFormats").addEventListener("click", (e) => { const b = e.target.closest("[data-format]"); if (b) { qv.format = b.dataset.format; renderQuick(); } });
$("#qvPair").addEventListener("click", (e) => { const b = e.target.closest("[data-pair]"); if (b) { qv.id = b.dataset.pair; qv.qty = 1; renderQuick(); } });
function addFromQuick() {
  const f = byId().get(qv.id);
  if (f.line !== "japones" && qv.format !== state.format) setFormat(qv.format);
  for (let i = 0; i < qv.qty; i++) changeQty(qv.id, +1, { silent: true });
  return f;
}
$("#qvAdd").addEventListener("click", () => {
  const f = byId().get(qv.id);
  if (!f.available) { quick.close(); openAlert(f.id); return; }
  const from = $("#qvArt");
  addFromQuick();
  quick.close();
  flyToCart(from, f.color);
  toast(VOICE.added(`${qv.qty} × ${f.name}`), { color: f.color });
});
$("#qvReserve").addEventListener("click", () => {
  addFromQuick(); quick.close();
  $("#reservar").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});
$("#qvAsk").addEventListener("click", () => { const f = byId().get(qv.id); quick.close(); openAgent(`Cuéntame del sabor ${f.name}`); });

for (const dlg of $$("dialog.modal")) {
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close-modal]")) dlg.close(); });
}

// ============================================================
// Avísame cuando vuelva
// ============================================================
let alertFlavor = null;
function openAlert(id) {
  const f = byId().get(id); if (!f) return;
  alertFlavor = f;
  $("#alertArt").innerHTML = bag(f.color, formatOf(f), { label: "" });
  $("#alertTitle").textContent = f.name;
  $("#alertErr").hidden = true;
  const form = $("#alertForm"); form.contact.value = store.get("mg-contact", ""); form.name.value = store.get("mg-name", "");
  $("#alertDlg").showModal();
}
$("#alertForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target, err = $("#alertErr");
  const payload = { flavorId: alertFlavor.id, name: form.name.value.trim(), contact: form.contact.value.trim(), website: form.website.value };
  if (!/^\+?[\d\s]{8,15}$/.test(payload.contact) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.contact)) {
    err.hidden = false; err.textContent = "Escribe un WhatsApp (+569…) o un email válido."; form.contact.focus(); return;
  }
  const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
  try {
    const res = await fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = (res.headers.get("content-type") || "").includes("json") ? await res.json() : { ok: false, errors: ["El servicio de avisos no está activo todavía."] };
    if (!data.ok) throw new Error((data.errors || []).join(" "));
    store.set("mg-contact", payload.contact);
    $("#alertDlg").close();
    toast(VOICE.alertOk(alertFlavor.name), { tone: "alert", color: alertFlavor.color });
    track("alert_subscribe", { flavor: alertFlavor.id });
  } catch (e2) {
    err.hidden = false; err.textContent = e2.message || VOICE.networkError();
  } finally { btn.disabled = false; }
});

// ============================================================
// Encuentra tu sabor (4 preguntas, resultado guardado y compartible)
// ============================================================
const QUIZ = [
  { q: "¿Qué se te <em>antoja</em>?", key: "taste", opts: [
    { v: "frutal", label: "Algo frutal", hint: "fresco y ácido", color: "#E2555C" },
    { v: "chocolate", label: "Chocolate", hint: "intenso y cremoso", color: "#6B4636" },
    { v: "postre", label: "Un postre", hint: "dulce de verdad", color: "#E8D5B0" },
    { v: "cafe", label: "Café", hint: "para estudiar", color: "#7B4B33" },
    { v: "coctel", label: "De coctel", hint: "atrevido", color: "#A9702D" },
    { v: "salado", label: "Salado", hint: "nada de dulce", color: "#B28A4A" },
  ] },
  { q: "¿Suave o <em>intenso</em>?", key: "intensity", opts: [
    { v: "suave", label: "Suavecito", hint: "para picotear", color: "#F5D98B" },
    { v: "intenso", label: "Intenso", hint: "que se sienta", color: "#3E2A1A" },
  ] },
  { q: "¿Para qué <em>momento</em>?", key: "moment", opts: [
    { v: "estudiar", label: "Para estudiar", hint: "energía larga", color: "#7B4B33" },
    { v: "bajon", label: "El bajón", hint: "media tarde", color: "#F2A93B" },
    { v: "compartir", label: "Compartir", hint: "con el grupo", color: "#B9862E" },
    { v: "regalo", label: "Regalar", hint: "quedar bien", color: "#C13564" },
  ] },
  { q: "¿Qué tan <em>clásico</em> eres?", key: "style", opts: [
    { v: "clasico", label: "A la segura", hint: "lo más pedido", color: "#D93B4A" },
    { v: "explorar", label: "Sorpréndeme", hint: "algo distinto", color: "#315EA8" },
  ] },
];
const TASTE_CATS = { frutal: ["Frutales"], chocolate: ["Chocolate", "Coberturas"], postre: ["Cremosos", "Clásicos", "Coberturas"], cafe: ["Café", "Chocolate"], coctel: ["Cócteles"], salado: ["Maní Japonés"] };
const INTENSE = new Set(["Chocolate", "Coberturas", "Café", "Cócteles"]);
let quizAns = {};
function renderQuiz(step = 0) {
  const body = $("#quizBody");
  const prog = `<div class="quiz-progress" aria-hidden="true">${QUIZ.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}<i class="${step >= QUIZ.length ? "on" : ""}"></i></div>`;
  if (step < QUIZ.length) {
    const s = QUIZ[step];
    body.innerHTML = `${prog}<p class="eyebrow" style="justify-content:center">El interrogatorio · pregunta ${step + 1} de ${QUIZ.length}</p><h2 class="quiz-q" id="quizTitle">${s.q}</h2>
      <div class="quiz-opts">${s.opts.map((o) => `<button type="button" class="quiz-opt" data-v="${o.v}">${swatch(o.color)}<span>${o.label}</span><small>${o.hint}</small></button>`).join("")}</div>
      ${step > 0 ? `<button class="link quiz-back" type="button" id="quizBack">← Atrás</button>` : ""}`;
    body.querySelector(".quiz-opts").addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]"); if (!b) return;
      quizAns[s.key] = b.dataset.v; renderQuiz(step + 1);
    });
    $("#quizBack")?.addEventListener("click", () => renderQuiz(step - 1));
    body.querySelector(".quiz-opt")?.focus();
    return;
  }
  const picks = recommend(quizAns);
  const fmt = quizAns.moment === "regalo" ? "doypack" : "celofan";
  store.set("mg-quiz", { ans: quizAns, picks: picks.map((f) => f.id), at: Date.now() });
  track("quiz_complete", { taste: quizAns.taste });
  body.innerHTML = `${prog}<p class="eyebrow" style="justify-content:center">Caso cerrado</p><h2 class="quiz-q" id="quizTitle">Tus <em>cómplices</em> ideales</h2>
    <div class="quiz-result">${picks.map((f) => `<div class="quiz-pick">${bag(f.color, f.line === "japones" ? "celofan" : fmt)}<strong>${esc(f.name.replace("Maní Japonés ", "Japonés "))}</strong><small>${esc(f.notes)}</small></div>`).join("")}</div>
    ${fmt === "doypack" ? `<p class="muted" style="margin-bottom:18px">Para regalo te sugerimos la <strong>La Reserva</strong> (doypack hermético).</p>` : ""}
    <div class="quiz-actions"><button class="btn btn-gold btn-lg" type="button" id="quizAdd"><svg><use href="#i-bag"/></svg> Agregar los ${picks.length}</button><button class="btn btn-ghost" style="margin:0" type="button" id="quizShare">Compartir resultado</button><button class="link" type="button" id="quizAgain">Volver a empezar</button></div>`;
  $("#quizAdd").addEventListener("click", () => {
    addItems(picks.map((f) => ({ id: f.id, qty: 1 })), { format: fmt });
    $("#quiz").close(); toast(VOICE.addedMany(picks.length), { color: picks[0]?.color }); openCart();
  });
  $("#quizShare").addEventListener("click", async () => {
    const text = `Mi sabor MANI-GANTE es ${picks[0]?.name}. Encuentra el tuyo:`;
    const url = `${BUSINESS.url}#tienda`;
    if (navigator.share) { try { await navigator.share({ title: "Mi sabor MANI-GANTE", text, url }); return; } catch {} }
    try { await navigator.clipboard.writeText(`${text} ${url}`); toast(VOICE.linkCopied(), { tone: "info" }); } catch {}
  });
  $("#quizAgain").addEventListener("click", () => { quizAns = {}; renderQuiz(0); });
  renderFinder();
}
function recommend({ taste, intensity, moment, style }) {
  const cats = TASTE_CATS[taste] || [];
  let pool = (taste === "salado" ? state.japanese : available()).filter((f) => f.available && (taste === "salado" || cats.includes(f.category)));
  const score = (f) => (style === "clasico" ? (f.topVentas ? 2 : 0) : (f.topVentas ? 0 : 2))
    + (intensity === "intenso" ? (INTENSE.has(f.category) ? 1.5 : 0) : (INTENSE.has(f.category) ? 0 : 1.5))
    + (moment === "estudiar" && f.category === "Café" ? 2 : 0)
    + (moment === "regalo" && f.premium ? 1 : 0) + (moment === "compartir" && f.id === "mix" ? 2 : 0);
  pool = [...pool].sort((a, b) => score(b) - score(a) || a.order - b.order);
  const extra = available().filter((f) => f.topVentas && !pool.includes(f));
  return [...pool, ...extra].slice(0, 3);
}
function renderFinder() {
  const saved = store.get("mg-quiz", null);
  const f = saved && byId().get(saved.picks?.[0]);
  const small = $(".finder small");
  if (small && f) small.textContent = `Tu último resultado: ${f.name}`;
}
document.addEventListener("click", (e) => {
  if (!e.target.closest("[data-open-quiz]")) return;
  quizAns = {}; renderQuiz(0); $("#quiz").showModal();
});

// ============================================================
// Arma tu caja (vista previa con bolsas reales)
// ============================================================
const box = { size: COMBOS[1], slots: [] };
function renderBoxSizes() {
  $("#boxSizes").innerHTML = COMBOS.map((c) => `<button type="button" class="size" role="radio" data-size="${c.id}" aria-checked="${box.size.id === c.id}"><strong>${c.bags} bolsas</strong><small>${c.name}</small></button>`).join("");
}
function renderBox() {
  const m = byId();
  const cells = Array.from({ length: box.size.bags }, (_, i) => {
    const f = m.get(box.slots[i]);
    return f
      ? `<button type="button" class="slot-cell filled" data-slot="${i}" style="--c:${f.color}" aria-label="Quitar ${esc(f.name)} del espacio ${i + 1}">${bag(f.color, "celofan", { cls: "bag slot-bag" })}<span>${esc(f.name.replace("Maní Japonés ", "Jp. "))}</span></button>`
      : `<div class="slot-cell" role="img" aria-label="Espacio ${i + 1} vacío"><em>${i + 1}</em></div>`;
  }).join("");
  $("#boxSlots").innerHTML = cells;
  $("#boxSlots").style.setProperty("--cols", box.size.bags === 10 ? 5 : 3);
  const filled = box.slots.filter(Boolean);
  const total = filled.reduce((s, id) => s + unitPrice(m.get(id), "celofan"), 0);
  setMoney($("#boxTotal"), total);
  $("#boxCount").textContent = `${filled.length} / ${box.size.bags}`;
  $("#boxName").textContent = box.size.name;
  $("#boxAdd").disabled = filled.length === 0;
  $("#boxAdd").lastChild.textContent = filled.length === box.size.bags ? " Agregar maletín" : ` Agregar ${filled.length || ""} a la cuenta`;
  if (filled.length === box.size.bags && !box.celebrated) { box.celebrated = true; stampMoment($(".box-stage"), "MALETÍN COMPLETO · A TU GUSTO · "); }
  if (filled.length < box.size.bags) box.celebrated = false;
}
function renderPalette() {
  const items = [...available().filter((f) => !f.premium), ...available().filter((f) => f.premium), ...state.japanese.filter((f) => f.available)];
  $("#palette").innerHTML = items.map((f) => `<button type="button" class="pal" data-pal="${f.id}">${swatch(f.color)}<span>${esc(f.name.replace("Maní Japonés ", "Japonés "))}</span>${f.premium ? `<b>${formatCLP(unitPrice(f, "celofan"))}</b>` : ""}</button>`).join("");
}
$("#boxSizes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-size]"); if (!b) return;
  box.size = COMBOS.find((c) => c.id === b.dataset.size);
  box.slots = box.slots.slice(0, box.size.bags);
  renderBoxSizes(); renderBox();
});
$("#palette").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pal]"); if (!b) return;
  const i = Array.from({ length: box.size.bags }, (_, k) => k).find((k) => !box.slots[k]);
  if (i === undefined) { toast(VOICE.boxFull(), { tone: "info" }); return; }
  box.slots[i] = b.dataset.pal; renderBox();
});
$("#boxSlots").addEventListener("click", (e) => { const b = e.target.closest("[data-slot]"); if (b) { box.slots[+b.dataset.slot] = null; renderBox(); } });
$("#boxShuffle").addEventListener("click", () => {
  const pool = available().filter((f) => !f.premium);
  const shuffled = [...pool].sort(() => Math.random() - .5);
  box.slots = Array.from({ length: box.size.bags }, (_, i) => shuffled[i % shuffled.length]?.id);
  renderBox();
});
$("#boxAdd").addEventListener("click", () => {
  const counts = {};
  box.slots.filter(Boolean).forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
  addItems(Object.entries(counts).map(([id, qty]) => ({ id, qty })), { format: "celofan" });
  flyToCart($("#boxSlots"), byId().get(box.slots.find(Boolean))?.color || "#C8963E");
  toast(VOICE.boxAdded(box.size.name), { tone: "success" });
  track("box_add", { size: box.size.bags });
  box.slots = []; renderBox();
});

// ============================================================
// Hero, marquee, estado en vivo
// ============================================================
function renderHero() {
  const status = state.status?.campus || campusStatus();
  const pill = $("#livePill");
  pill.dataset.open = status.open; pill.querySelector("span").textContent = status.open ? "En campus ahora" : status.label;
  $("#heroStatus").textContent = status.open ? "Jorge está en el campus ahora" : status.label;
  $("#heroLiveDot").classList.toggle("on", status.open);
  const avail = available();
  $("#statAvailable").textContent = avail.length;
  $("#heroStock").textContent = `${avail.length} de ${state.catalog.length} sabores disponibles${state.stockSource === "live" ? " · stock en vivo" : ""}`;
  const top = avail.filter((f) => f.topVentas).slice(0, 3);
  for (const f of avail) { if (top.length >= 3) break; if (!top.includes(f)) top.push(f); }
  $("#heroTop").innerHTML = top.map((f) => `<button type="button" class="hero-flavor" data-inc="${f.id}">${swatch(f.color)}<span>${esc(f.name)}</span><em>+ Agregar</em></button>`).join("");
}
$("#heroTop").addEventListener("click", (e) => {
  const b = e.target.closest("[data-inc]"); if (b) changeQty(b.dataset.inc, +1, { from: b.querySelector(".swatch") });
});
// La Bolsa de hoy: ticker con el stock en vivo (▲ en circulación · ▼ agotado)
let tickerSig = "";
function renderMarquees() {
  const all = [...state.catalog, ...state.japanese];
  const sig = all.map((f) => `${f.id}:${f.available ? 1 : 0}`).join();
  if (sig !== tickerSig) {
    tickerSig = sig;
    const items = all.map((f) => `<span class="tk ${f.available ? "up" : "down"}"><b>${esc(f.name.replace("Maní Japonés ", "Japonés "))}</b><i>${f.available ? "▲" : "▼"}</i><em>${f.available ? "en circulación" : "agotado"}</em></span>`).join("");
    $("#marqueeTrack").innerHTML = items + items;
  }
  if (!$("#footerMarquee").childElementCount) {
    const words = ["Para gente elegante y gánster", "Hecho a mano en Temuco", "Receta de la casa", "Lotes chicos", "Directo al campus"].map((w) => `<span>${w}</span>`).join("");
    $("#footerMarquee").innerHTML = words + words + words + words;
  }
}
// Arte de la casa: bolsa del salón, roseta guilloché y monograma del lacre
const heroFlavor = FLAVORS[0];
if ($("#heroBag")) $("#heroBag").innerHTML = bag(heroFlavor.color, "doypack", { num: heroFlavor.no });
if ($("#heroPlate")) $("#heroPlate").textContent = `Ficha Nº ${heroFlavor.no} · ${heroFlavor.name} · alias «${heroFlavor.alias}»`;
// Dónde vende Jorge y sus otros proyectos (salen de catalog.mjs → BUSINESS)
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
if ($("#spots")) $("#spots").innerHTML = `<p class="rc-label"><span>Dónde encontrarme</span></p>` + BUSINESS.locations.map((l) => `
  <div class="spot${l.main ? " main" : ""}"><svg><use href="#i-pin"/></svg><div><strong>${esc(l.name)}</strong><span>${esc(l.detail)}</span>
  ${l.main ? `<ul class="spot-days">${SCHEDULE.map((d) => `<li class="${d.mode}"><b>${DAY_NAMES[d.day]}</b>${d.open}–${d.close}<em>${d.mode === "reservas" ? "solo reservas" : "en el campus"}</em></li>`).join("")}</ul>` : ""}</div></div>`).join("");
const ventures = BUSINESS.ventures || [];
const ventureLink = (v, cls = "") => v.url ? `<a class="${cls}" href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.name)} ↗</a>` : `<span class="${cls}">${esc(v.name)}</span>`;
if ($("#ventures")) $("#ventures").innerHTML = ventures.map((v) => `<div class="venture"><small>${esc(v.role)} también de</small>${ventureLink(v, "venture-name")}<p>${esc(v.text)}</p></div>`).join("");
if ($("#footVentures")) $("#footVentures").innerHTML = ventures.map((v) => ventureLink(v)).join("");
$$("[data-guilloche]").forEach((el) => { el.innerHTML = guillocheImg(); });
$$("[data-monogram]").forEach((el) => { el.innerHTML = monogram(); });
// Foco de luz que sigue al puntero en las salas oscuras
if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
  $$(".hero, .reserve").forEach((room) => {
    let raf = 0;
    room.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = room.getBoundingClientRect();
        room.style.setProperty("--sx", `${e.clientX - r.left - 520}px`);
        room.style.setProperty("--sy", `${e.clientY - r.top - 520}px`);
      });
    });
  });
}
$$("[data-stamp]").forEach((el) => { el.innerHTML = stamp(el.dataset.stamp || undefined); });

// ============================================================
// Reservas: un solo flujo con ticket en vivo, cupos y medio de pago
// ============================================================
const rf = { day: null, slot: null, point: RESERVATION_RULES.meetingPoints[0] };
function renderReserveItems() {
  const { lines, total } = cartTotals();
  const boxEl = $("#rfItems"); if (!boxEl) return;
  if (!lines.length) {
    const sugg = available().filter((f) => f.topVentas).slice(0, 4);
    boxEl.innerHTML = `<div class="rc-empty">Aún no eliges sabores. <a href="#tienda">Ir a la tienda</a> o agrega uno de los favoritos:
      <div class="rc-suggest">${sugg.map((f) => `<button type="button" data-inc="${f.id}">${swatch(f.color)}${esc(f.name)}</button>`).join("")}</div></div>`;
  } else {
    boxEl.innerHTML = lines.map(({ f, qty, subtotal }) => `<div class="rc-item">${swatch(f.color)}<span>${esc(f.name)}</span><em>x${qty} · ${formatCLP(subtotal)}</em></div>`).join("");
  }
  setMoney($("#rfTotal"), total);
  renderLive();
}
function liveDays() {
  // Prioriza los cupos reales del servidor; si no hay backend, usa el calendario local.
  const server = state.status?.slots;
  if (Array.isArray(server)) return server.filter((d) => !d.blocked).map((d) => ({ ...d, slots: d.slots.filter((s) => s.left > 0).map((s) => s.time), left: Object.fromEntries(d.slots.map((s) => [s.time, s.left])) }));
  return reservableDays().map((d) => ({ ...d, left: {} }));
}
function renderLive() {
  const el = $("#rfLive"); if (!el) return;
  const day = liveDays().find((d) => d.iso === rf.day);
  const { bags } = cartTotals();
  el.textContent = day && rf.slot ? `${day.label} · ${rf.slot} · ${rf.point}${bags ? ` · ${bags} bolsa${bags === 1 ? "" : "s"}` : ""}` : "Reserva · INACAP Temuco";
}
function bindReserve() {
  $("#rfItems").addEventListener("click", (e) => { const b = e.target.closest("[data-inc]"); if (b) changeQty(b.dataset.inc, +1, { from: b }); });
  $("#rfEditCart").addEventListener("click", openCart);
  $("#rfDays").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (b) { rf.day = b.dataset.day; renderDays(); } });
  $("#rfSlots").addEventListener("click", (e) => { const b = e.target.closest("[data-slot]"); if (b) { rf.slot = b.dataset.slot; renderSlots(); } });
  $("#rfPoints").addEventListener("click", (e) => { const b = e.target.closest("[data-point]"); if (b) { rf.point = b.dataset.point; renderPoints(); } });
  $("#rfPay").addEventListener("click", (e) => { const b = e.target.closest("[data-pay]"); if (b) { state.payment = b.dataset.pay; store.set("mg-payment", state.payment); renderPayPicker(); renderCart(); } });
  $("#rfName").value = store.get("mg-name", "");
  $("#rfName").addEventListener("input", (e) => { e.target.removeAttribute("aria-invalid"); showErrors([]); });
  $("#reserveForm").addEventListener("submit", submitReservation);
  renderReserveItems(); renderDays(); renderPoints(); renderPayPicker();
}
function renderDays() {
  const el = $("#rfDays"); if (!el) return;
  const days = liveDays();
  if (!days.find((d) => d.iso === rf.day)) rf.day = days[0]?.iso ?? null;
  el.innerHTML = days.length ? days.map((d) => {
    const [wd, rest] = d.long.split(", ");
    return `<button type="button" class="day" role="radio" data-day="${d.iso}" aria-checked="${d.iso === rf.day}"><small>${d.label === "Hoy" || d.label === "Mañana" ? d.label : wd}</small><strong>${rest || d.label}</strong></button>`;
  }).join("") : `<p class="muted">${state.status?.campus?.away ? VOICE.away(state.status.campus.label) : "No quedan cupos esta semana."} Escríbele a Jorge por WhatsApp.</p>`;
  renderSlots();
}
function renderSlots() {
  const el = $("#rfSlots"); if (!el) return;
  const day = liveDays().find((d) => d.iso === rf.day);
  const slots = day?.slots || [];
  if (!slots.includes(rf.slot)) rf.slot = slots[0] ?? null;
  el.innerHTML = slots.map((s) => {
    const left = day.left?.[s];
    const few = typeof left === "number" && left <= 2;
    return `<button type="button" class="slot${few ? " few" : ""}" role="radio" data-slot="${s}" aria-checked="${s === rf.slot}"${few ? ` aria-label="${s}, quedan ${left} cupos"` : ""}>${s}${few ? `<small>quedan ${left}</small>` : ""}</button>`;
  }).join("");
  renderLive();
}
function renderPoints() {
  const el = $("#rfPoints"); if (!el) return;
  el.innerHTML = RESERVATION_RULES.meetingPoints.map((p) => `<button type="button" class="point" role="radio" data-point="${esc(p)}" aria-checked="${p === rf.point}"><svg><use href="#i-pin"/></svg>${esc(p)}</button>`).join("");
  renderLive();
}
function renderPayPicker() {
  const el = $("#rfPay"); if (!el) return;
  el.innerHTML = PAYMENTS.filter((p) => p.id !== "efectivo").map((p) => `<button type="button" class="point" role="radio" data-pay="${p.id}" aria-checked="${p.id === state.payment || (state.payment === "efectivo" && p.id === "mercadopago")}"><span>${p.label}</span><small>${p.hint}</small></button>`).join("");
}
function showErrors(errors) {
  const boxEl = $("#rfErrors");
  boxEl.hidden = !errors.length;
  boxEl.innerHTML = errors.length ? `<ul>${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : "";
}
async function submitReservation(e) {
  e.preventDefault();
  const payment = state.payment === "efectivo" ? "mercadopago" : state.payment;
  const payload = {
    name: $("#rfName").value, date: rf.day, time: rf.slot, meetingPoint: rf.point, notes: $("#rfNotes").value,
    format: state.format, items: [...state.cart].map(([id, qty]) => ({ id, qty })), website: $("#rfHp").value, payment,
  };
  const local = buildReservation(payload, [...state.catalog, ...state.japanese]);
  if (!local.ok) {
    if (!payload.name.trim()) { $("#rfName").setAttribute("aria-invalid", "true"); $("#rfName").focus(); }
    return showErrors(local.errors);
  }
  showErrors([]);
  store.set("mg-name", payload.name.trim());
  const btn = $("#rfSubmit"), label = btn.querySelector("span");
  btn.disabled = true; btn.setAttribute("aria-busy", "true"); label.textContent = "Validando stock y cupos…";
  let result = { ok: true, reservation: local.reservation, whatsappUrl: local.whatsappUrl };
  try {
    const res = await fetch("/api/reserve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
    if ((res.headers.get("content-type") || "").includes("application/json")) {
      const data = await res.json();
      if (!data.ok) {
        btn.disabled = false; btn.removeAttribute("aria-busy"); label.textContent = "Reservar por WhatsApp";
        if (data.errors) { showErrors(data.errors); syncStock({ quiet: true }); loadStatus(); }
        return;
      }
      result = data;
    }
  } catch { /* sin backend: validación local */ }
  btn.disabled = false; btn.removeAttribute("aria-busy"); label.textContent = "Reservar por WhatsApp";
  track("reservation_submit", { payment });
  showReservationSuccess({ ...result, reservation: { ...result.reservation, payment } });
  loadStatus();
}
const ticketHTML = $("#reserveForm").innerHTML;
function showReservationSuccess({ reservation: r, whatsappUrl }) {
  const form = $("#reserveForm");
  saveOrder({ type: "reserva", code: r.code, items: (r.lines || []).map((l) => ({ id: l.id, name: l.name, qty: l.qty })), bags: r.bags, total: r.total, format: r.format, payment: r.payment, date: r.date, dateLabel: r.dateLabel, time: r.time, meetingPoint: r.meetingPoint, whatsappUrl });
  const pay = PAYMENTS.find((p) => p.id === r.payment);
  form.innerHTML = `<div class="ticket-main"><div class="ticket-head"><span class="brand-name">MANI<span>-</span>GANTE</span><small>Reserva creada · ${esc(pay?.label || "")}</small></div>
    <div class="rc-success">
      <span class="ok"><svg><use href="#i-check"/></svg></span>
      <h3 class="h3">¡Dímelo, ${esc(r.name)}! Quedó lista</h3>
      <code>${esc(r.code)}</code>
      <p class="muted">${esc(r.dateLabel || r.date)} · ${esc(r.time)} · ${esc(r.meetingPoint)}<br>${r.bags} bolsa${r.bags === 1 ? "" : "s"} · <strong>${formatCLP(r.total)}</strong></p>
      <ol class="next-steps"><li class="done">Reserva creada</li><li>Envíala a Jorge por WhatsApp</li><li>${r.payment === "transferencia" ? "Transfiere y adjunta el comprobante" : "Paga con Mercado Pago y adjunta el comprobante"}</li></ol>
      <div class="save-row">
        <a class="btn btn-ghost" href="${icsFile(r)}" download="reserva-${esc(r.code)}.ics"><svg><use href="#i-cal"/></svg> Calendario (.ics)</a>
        <a class="btn btn-ghost" href="${googleCalendarUrl(r)}" target="_blank" rel="noopener"><svg><use href="#i-cal"/></svg> Google Calendar</a>
        <button class="btn btn-ghost" type="button" id="rfPng"><svg><use href="#i-download"/></svg> Guardar ticket</button>
      </div>
    </div></div>
    <div class="ticket-stub"><span class="barcode" aria-hidden="true"></span>
      <a class="btn btn-wa btn-lg" href="${whatsappUrl}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg><span>Enviar a Jorge</span></a>
      <p class="stub-links">${r.payment === "mercadopago" ? `<a class="link" href="${BUSINESS.mercadoPago}" target="_blank" rel="noopener">Pagar con Mercado Pago</a>` : `<a class="link" href="#pago">Ver cuentas para transferir</a>`}<button class="link" type="button" id="rfAgain">Hacer otra reserva</button></p></div>`;
  stampMoment(form);
  toast(VOICE.reserveOk(r.code), { tone: "success" });
  window.open(whatsappUrl, "_blank", "noopener");
  $("#rfPng").addEventListener("click", () => downloadTicketPng(r));
  $("#rfAgain").addEventListener("click", () => {
    state.cart.clear(); saveCart(); renderCatalog(); renderCart();
    form.innerHTML = ticketHTML; bindReserve();
  });
}

// ============================================================
// Mis pedidos (historial local) + recuperación de carrito
// ============================================================
const STATUS_LABEL = { enviado: "Enviado a Jorge", pagado: "Pagado", recibido: "Recibido" };
function renderHistory() {
  const list = getOrders();
  $("#historyList").innerHTML = list.length ? list.map((o) => `
    <article class="history-item">
      <div class="history-top"><strong>${o.type === "reserva" ? `Reserva ${esc(o.code)}` : "Pedido"}</strong><span class="pill">${esc(STATUS_LABEL[o.status] || o.status)}</span></div>
      <small>${new Date(o.createdAt).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}${o.dateLabel ? ` · para ${esc(o.dateLabel)} ${esc(o.time)}` : ""} · ${o.bags} bolsas · ${formatCLP(o.total)}</small>
      <p>${(o.items || []).map((i) => `${esc(i.name)} ×${i.qty}`).join(", ")}</p>
      <div class="history-actions">
        <button type="button" class="link" data-repeat="${esc(o.id)}">Repetir pedido</button>
        ${o.status === "enviado" ? `<button type="button" class="link" data-paid="${esc(o.id)}">Ya pagué</button>` : ""}
        ${o.status === "pagado" ? `<button type="button" class="link" data-received="${esc(o.id)}">Ya lo recibí</button>` : ""}
        ${o.whatsappUrl ? `<a class="link" href="${esc(o.whatsappUrl)}" target="_blank" rel="noopener">Reenviar</a>` : ""}
        <button type="button" class="link subtle" data-remove="${esc(o.id)}">Borrar</button>
      </div>
    </article>`).join("") : `<div class="drawer-empty">${bag("#C8963E", "celofan")}<p class="hand">${VOICE.emptyHistory}</p></div>`;
}
function openHistory() { renderHistory(); $("#historyDlg").showModal(); }
$("#historyOpen").addEventListener("click", openHistory);
$("#historyList").addEventListener("click", (e) => {
  const t = e.target.closest("button"); if (!t) return;
  const o = getOrders().find((x) => x.id === (t.dataset.repeat || t.dataset.paid || t.dataset.received || t.dataset.remove));
  if (!o) return;
  if (t.dataset.repeat) { const added = addItems(o.items.map((i) => ({ id: i.id, qty: i.qty })), { format: o.format }); $("#historyDlg").close(); toast(added.length ? VOICE.addedMany(added.length) : "Esos sabores están agotados por ahora", { tone: added.length ? "success" : "info" }); if (added.length) openCart(); return; }
  if (t.dataset.paid) setOrderStatus(o.id, "pagado");
  if (t.dataset.received) setOrderStatus(o.id, "recibido");
  if (t.dataset.remove) removeOrder(o.id);
  renderHistory();
});
function recoverCart() {
  const fromUrl = cartFromUrl();
  if (fromUrl?.items.length) {
    state.cart.clear();
    addItems(fromUrl.items, { format: fromUrl.format });
    toast(VOICE.orderRestored(cartTotals().bags), { tone: "info", action: { label: "Ver la cuenta", onClick: openCart } });
    return;
  }
  const at = store.get("mg-cart-at", 0);
  const { bags } = cartTotals();
  if (bags && Date.now() - at > 30 * 60 * 1000) setTimeout(() => toast(VOICE.welcomeBack(bags), { tone: "info", action: { label: "Ver la cuenta", onClick: openCart } }), 2500);
}

// ============================================================
// Opiniones curadas por Jorge (UGC aprobado desde el admin)
// ============================================================
function renderUgc() {
  const items = state.status?.ugc || [];
  const wrap = $("#ugc"); if (!wrap) return;
  wrap.hidden = !items.length;
  wrap.querySelector(".ugc-track").innerHTML = items.map((u) => `<figure class="ugc-card"><blockquote>“${esc(u.quote)}”</blockquote><figcaption>— ${esc(u.author)}${u.url ? ` · <a class="link" href="${esc(u.url)}" target="_blank" rel="noopener">${u.source === "instagram" ? "ver en Instagram" : "ver"}</a>` : ""}</figcaption></figure>`).join("");
}

// ============================================================
// Galería
// ============================================================
const PHOTOS = [
  ["n7", "Nueve bolsas MANI-GANTE de colores con la etiqueta 'Para gente elegante y gánster'", "la alineación completa", 1600, 2133],
  ["n3", "Maní confitado dorado con brillo de azúcar y la etiqueta MANI-GANTE", "el baño que brilla", 1600, 1600],
  ["n5", "Mesa con más de veinte sabores MANI-GANTE y el Instagram de fondo", "la mesa de los viernes", 1600, 1600],
  ["n2", "Bolsa de maní morado con la etiqueta y el código QR", "escanea y pide", 1600, 1600],
  ["n6", "Bolsas de celofán y doypacks kraft en un puesto al sol", "el puesto al sol", 1600, 1200],
  ["n4", "Una bolsa de maní en la mano frente a la mesa de sabores", "directo a tu mano", 1600, 1600],
  ["n1", "Filas de bolsas moradas, verdes y de chocolate", "lote recién sellado", 1600, 1600],
  ["n8", "Doypacks MANI-GANTE en la repisa de un bar junto a vinos", "noche de bar", 1600, 2845],
  ["g6", "Maridaje MANI-GANTE con vino y quesos", "maridaje con vino", 628, 1400],
  ["g1", "Mesa con decenas de bolsas MANI-GANTE de colores", "los primeros lotes", 1400, 969],
];
const gal = $("#gallery");
gal.innerHTML = PHOTOS.map(([g, alt, cap, w, h]) => `<figure class="gallery-item" data-src="./assets/img/${g}-1600.webp">
  <button type="button" class="gallery-open" aria-label="Ampliar foto: ${esc(alt)}"><img src="./assets/img/${g}-800.webp" alt="${esc(alt)}" loading="lazy" decoding="async" width="${w}" height="${h}" draggable="false"></button><figcaption>${esc(cap)}</figcaption></figure>`).join("");
// Instagram en vivo: se pide solo cuando la sección está por verse (no frena la carga inicial).
function renderInsta(data) {
  const grid = $("#instaGrid"), st = $("#instaStories");
  if (!data?.posts?.length) {
    grid.innerHTML = `<a class="insta-empty" href="${BUSINESS.instagram}" target="_blank" rel="noopener"><svg><use href="#i-ig"/></svg><span><strong>${esc(BUSINESS.instagramHandle)}</strong> Los lotes nuevos, los sabores del día y la vida de la casa, primero en Instagram.</span></a>`;
    return;
  }
  const ago = (iso) => { const d = Math.max(0, Math.round((Date.now() - new Date(iso)) / 86400000)); return d === 0 ? "hoy" : d === 1 ? "ayer" : `hace ${d} días`; };
  grid.innerHTML = data.posts.slice(0, 8).map((p) => `<a class="insta-post" href="${esc(p.url)}" target="_blank" rel="noopener">
    <img src="${esc(p.image)}" alt="${esc(p.caption ? p.caption.slice(0, 90) : "Publicación de Instagram de MANI-GANTE")}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
    ${p.type === "VIDEO" ? `<span class="insta-badge">Video</span>` : ""}<span class="insta-meta">${ago(p.at)}</span></a>`).join("");
  if (data.stories?.length) {
    st.hidden = false;
    st.innerHTML = `<p class="rc-label"><span>Historias de hoy</span></p><div class="insta-story-row">` + data.stories.slice(0, 10).map((p) => `<a class="insta-story" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Ver historia de Instagram"><img src="${esc(p.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"></a>`).join("") + `</div>`;
  }
}
const instaIO = new IntersectionObserver((entries) => {
  if (!entries.some((e) => e.isIntersecting)) return;
  instaIO.disconnect();
  fetch("/api/instagram").then((r) => r.ok ? r.json() : null).catch(() => null).then(renderInsta);
}, { rootMargin: "600px 0px" });
if ($("#insta")) instaIO.observe($("#insta"));

const lb = $("#lightbox");
let dragged = false, lbReturn = null;
gal.addEventListener("click", (e) => {
  if (dragged) return;
  const fig = e.target.closest(".gallery-item"); if (!fig) return;
  lbReturn = document.activeElement;
  lb.querySelector("img").src = fig.dataset.src; lb.querySelector("img").alt = fig.querySelector("img").alt; lb.hidden = false;
  lb.querySelector("button").focus();
});
function closeLightbox() { if (lb.hidden) return; lb.hidden = true; lbReturn?.focus?.(); }
lb.addEventListener("click", closeLightbox);
(() => {
  let down = false, startX = 0, startScroll = 0;
  gal.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; dragged = false; startX = e.clientX; startScroll = gal.scrollLeft; });
  addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 5) { dragged = true; gal.classList.add("dragging"); } gal.scrollLeft = startScroll - dx; });
  addEventListener("pointerup", () => { down = false; gal.classList.remove("dragging"); setTimeout(() => (dragged = false), 0); });
})();
$("#galPrev").addEventListener("click", () => gal.scrollBy({ left: -gal.clientWidth * .6, behavior: "smooth" }));
$("#galNext").addEventListener("click", () => gal.scrollBy({ left: gal.clientWidth * .6, behavior: "smooth" }));

// ============================================================
// Pagos, FAQ, nutrición, opiniones, compartir
// ============================================================
$$(".pay-card[data-copy]").forEach((card) => card.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(card.dataset.copy); } catch {
    const ta = document.createElement("textarea"); ta.value = card.dataset.copy; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
  card.classList.add("copied"); toast(VOICE.copied(card.dataset.label), { tone: "success" });
  track("copy_payment", { method: card.dataset.label });
  setTimeout(() => card.classList.remove("copied"), 1800);
}));

$("#faqList").innerHTML = FAQ.map(([q, a], i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
$("#nutrition tbody").innerHTML = NUTRITION.map(([k, a, b]) => `<tr><td>${k}</td><td>${a}</td><td>${b}</td></tr>`).join("");

$("#reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target; const btn = form.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = VOICE.sending();
  try {
    await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
    form.querySelectorAll(".field, .rc-row, button").forEach((el) => (el.hidden = true));
    form.querySelector(".form-ok").hidden = false;
    track("review_submit");
  } catch { btn.disabled = false; btn.textContent = "Enviar nota"; toast(VOICE.networkError(), { tone: "error" }); }
});

$$("[data-wa]").forEach((a) => (a.href = whatsappLink("Hola Jorge, quiero hacer un pedido de MANI-GANTE 🥜")));
$("#year").textContent = new Date().getFullYear();
$("#shareBtn").addEventListener("click", async () => {
  const data = { title: "MANI-GANTE", text: "Maní confitado a mano en 28 sabores", url: BUSINESS.url };
  if (navigator.share) { try { await navigator.share(data); } catch {} }
  else { try { await navigator.clipboard.writeText(BUSINESS.url); toast(VOICE.linkCopied(), { tone: "info" }); } catch {} }
});

// ============================================================
// Navegación, tema, idioma, progreso
// ============================================================
const nav = $("#nav");
const progress = $("#progress");
const shopBar = $("#shopBar");
let lastY = 0, ticking = false;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    nav.classList.toggle("hide", y > 600 && y > lastY + 4 && !nav.classList.contains("menu-open"));
    if (y < lastY - 4) nav.classList.remove("hide");
    document.body.classList.toggle("nav-hidden", nav.classList.contains("hide"));
    lastY = y;
    progress.style.transform = `scaleX(${Math.min(1, y / (document.documentElement.scrollHeight - innerHeight))})`;
    if (shopBar) shopBar.classList.toggle("stuck", shopBar.getBoundingClientRect().top <= 90 && $("#tienda").getBoundingClientRect().bottom > 200);
    ticking = false;
  });
}, { passive: true });
const menuBtn = $("#menuBtn");
const setMenu = (open) => { menuBtn.setAttribute("aria-expanded", open); $("#mobileMenu").classList.toggle("open", open); nav.classList.toggle("menu-open", open); };
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
$("#mobileMenu").addEventListener("click", (e) => {
  const act = e.target.closest("[data-action]")?.dataset.action;
  if (act === "history") openHistory();
  if (act === "lang") $("#langToggle").click();
  if (e.target.closest("a, button")) setMenu(false);
});

const sectionObserver = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  $$(".nav-links a").forEach((a) => { const on = a.getAttribute("href") === `#${en.target.id}`; a.classList.toggle("active", on); on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"); });
}), { rootMargin: "-45% 0px -50% 0px" });
["oficio", "tienda", "caja", "reservar", "historia"].forEach((id) => { const s = document.getElementById(id); if (s) sectionObserver.observe(s); });

const themeBtn = $("#themeToggle");
const isDark = () => document.documentElement.dataset.theme !== "light"; // Noche es el tema de la casa
const paintThemeIcon = () => { themeBtn.querySelector("use").setAttribute("href", isDark() ? "#i-sun" : "#i-moon"); themeBtn.setAttribute("aria-label", isDark() ? "Cambiar a modo claro" : "Cambiar a modo oscuro"); };
themeBtn.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  if (next === "light") document.documentElement.dataset.theme = "light"; else delete document.documentElement.dataset.theme;
  store.set("mg-theme", next); paintThemeIcon();
  track("theme", { theme: next });
});
paintThemeIcon();
$("#langToggle").addEventListener("click", () => { const next = getLang() === "en" ? "es" : "en"; applyLang(next); track("lang", { lang: next }); });
if (getLang() === "en") applyLang("en");

// ============================================================
// Carga diferida: asistente IA y animaciones (code-splitting)
// ============================================================
let agentLoading = null;
function loadAgent() { agentLoading ||= import("./agent.mjs"); return agentLoading; }
async function openAgent(prompt) {
  await loadAgent();
  window.MGAgent?.open(prompt);
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open-agent], #agentFab");
  if (!t || window.MGAgent) return;
  e.preventDefault(); e.stopPropagation();
  openAgent();
}, true);
if (document.documentElement.classList.contains("door-on")) import("./door.mjs");
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
idle(() => import("./motion.mjs"));
idle(() => loadAgent(), { timeout: 6000 });

// ============================================================
// API pública para el agente de IA
// ============================================================
window.MG = {
  addItems, openCart,
  toast: (text, color) => toast(text, { color }),
  getCart: () => [...state.cart].map(([id, qty]) => ({ id, qty })),
  getFormat: () => state.format,
  getCatalog: () => state.catalog,
};

// ============================================================
// Inicio
// ============================================================
renderFormats(); renderChips(); renderCatalog(); renderMarquees(); renderHero(); renderCart();
renderBoxSizes(); renderPalette(); renderBox(); bindReserve(); renderFinder();
enableTilt();
recoverCart();
setInterval(() => { renderHero(); renderDays(); renderPromo(cartTotals().bags); }, 60_000);
syncStock();
loadStatus();
track("page_view", { lang: getLang() });

// Service worker: catálogo y fotos disponibles sin conexión
if ("serviceWorker" in navigator && location.protocol === "https:") {
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

import {
  BUSINESS, FORMATS, FLAVORS, JAPANESE, COMBOS, FAQ, NUTRITION, CATEGORY_ORDER, RESERVATION_RULES, STOCK_API_URL,
  mergeRemoteStock, formatCLP, unitPrice, slug, campusStatus, reservableDays, buildReservation, whatsappLink,
} from "./catalog.mjs";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// ============================================================
// Estado
// ============================================================
const state = {
  catalog: FLAVORS,
  stockSource: "local",
  format: store.get("mg-format", "celofan"),
  cart: new Map(Object.entries(store.get("mg-cart-v2", {})).filter(([, q]) => q > 0)),
  category: "todos",
  query: "",
};
if (!FORMATS[state.format]) state.format = "celofan";

const byId = () => new Map([...state.catalog, ...JAPANESE].map((f) => [f.id, f]));

// ============================================================
// Ilustración: racimo de maní confitado teñido con el color del sabor
// ============================================================
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}
const PEANUTS = [
  [50, 58, 1.0, -18], [30, 48, .82, 24], [70, 46, .86, -40], [38, 72, .78, 60], [64, 72, .8, -8], [52, 36, .7, 12],
];
let swatchId = 0;
function swatch(color) {
  const id = `g${++swatchId}`;
  const light = shade(color, 70), dark = shade(color, -55);
  const nuts = PEANUTS.map(([x, y, s, r]) => `
    <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path d="M-13 0c0-7 5-11 9-9 2 1 3 1 5 0 4-2 12 1 12 9s-8 11-12 9c-2-1-3-1-5 0-4 2-9-2-9-9Z" fill="url(#${id})"/>
      <circle cx="-7" cy="-3" r="1.1" fill="${dark}" opacity=".35"/><circle cx="6" cy="2" r="1" fill="${dark}" opacity=".35"/>
      <circle cx="0" cy="-4" r="1" fill="#fff" opacity=".45"/><circle cx="-4" cy="4" r=".8" fill="#fff" opacity=".35"/>
      <ellipse cx="-5" cy="-4" rx="4" ry="1.6" fill="#fff" opacity=".35"/>
    </g>`).join("");
  return `<svg class="swatch" viewBox="0 0 100 100" aria-hidden="true">
    <defs><radialGradient id="${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs>
    <ellipse cx="50" cy="88" rx="32" ry="5" fill="#000" opacity=".12"/>${nuts}</svg>`;
}

function splitName(name) {
  const m = name.match(/^(.*?)\s+c\/\s+(.*)$/);
  return m ? [m[1], m[2]] : [name.replace(/^Maní Japonés /, ""), ""];
}

// ============================================================
// Catálogo
// ============================================================
const grid = $("#grid");
const gridJp = $("#gridJp");

function cardHTML(f) {
  const qty = state.cart.get(f.id) || 0;
  const [main, sub] = splitName(f.name);
  const badge = !f.available ? `<span class="badge out">Agotado</span>` : f.topVentas ? `<span class="badge">Top ventas</span>` : "";
  const premium = f.premium ? `<span class="badge premium">Precio fijo</span>` : "";
  const control = qty > 0
    ? `<div class="stepper"><button type="button" data-dec="${f.id}" aria-label="Quitar uno de ${esc(f.name)}">−</button><output>${qty}</output><button type="button" data-inc="${f.id}" aria-label="Agregar uno de ${esc(f.name)}">+</button></div>`
    : `<button class="add-btn" type="button" data-inc="${f.id}" ${f.available ? "" : "disabled"}>${f.available ? "Agregar" : "Agotado"}</button>`;
  return `<article class="card${f.available ? "" : " soldout"}${qty ? " in-cart" : ""}" data-id="${f.id}" style="--c:${f.color}">
    <div class="card-art">${badge}${premium}${swatch(f.color)}</div>
    <h3>${esc(main)}${sub ? `<small>c/ ${esc(sub)}</small>` : ""}</h3>
    <p>${esc(f.notes || "")}</p>
    <div class="card-foot"><span class="price">${formatCLP(unitPrice(f, state.format))}</span>${control}</div>
  </article>`;
}

function renderCatalog() {
  const q = slug(state.query);
  const list = state.catalog.filter((f) =>
    (state.category === "todos" || slug(f.category) === state.category) && (!q || slug(`${f.name} ${f.category}`).includes(q)));
  grid.innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
  gridJp.innerHTML = JAPANESE.map(cardHTML).join("");
}

function renderChips() {
  const counts = {};
  state.catalog.forEach((f) => { counts[f.category] = (counts[f.category] || 0) + 1; });
  const cats = CATEGORY_ORDER.filter((c) => counts[c]).concat(Object.keys(counts).filter((c) => !CATEGORY_ORDER.includes(c)));
  $("#chips").innerHTML = [`<button class="chip" role="tab" data-cat="todos" aria-selected="${state.category === "todos"}">Todos<b>${state.catalog.length}</b></button>`]
    .concat(cats.map((c) => `<button class="chip" role="tab" data-cat="${slug(c)}" aria-selected="${state.category === slug(c)}">${esc(c)}<b>${counts[c]}</b></button>`))
    .join("");
}

function renderFormats() {
  $("#formats").innerHTML = Object.values(FORMATS).map((f) =>
    `<button class="format" type="button" role="radio" data-format="${f.id}" aria-checked="${state.format === f.id}"><strong>${f.name} · ${formatCLP(f.price)}</strong><small>${f.detail}</small></button>`).join("");
}

$("#chips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]"); if (!b) return;
  state.category = b.dataset.cat; renderChips(); renderCatalog();
});
$("#formats").addEventListener("click", (e) => {
  const b = e.target.closest("[data-format]"); if (!b) return;
  state.format = b.dataset.format; store.set("mg-format", state.format);
  renderFormats(); renderCatalog(); renderCart();
});
$("#search").addEventListener("input", (e) => { state.query = e.target.value; renderCatalog(); });

for (const container of [grid, gridJp]) {
  container.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (inc) changeQty(inc.dataset.inc, +1);
    if (dec) changeQty(dec.dataset.dec, -1);
  });
}

// ============================================================
// Stock en vivo (Google Sheets)
// ============================================================
const sync = $("#sync");
async function syncStock({ quiet = false } = {}) {
  if (!quiet) { sync.dataset.state = "loading"; $("#syncText").textContent = "Sincronizando disponibilidad…"; }
  try {
    const res = await fetch(`${STOCK_API_URL}?t=${Date.now()}`, { cache: "no-store", redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (!data?.ok || !Array.isArray(data.sabores)) throw new Error("formato");
    state.catalog = mergeRemoteStock(data.sabores);
    state.stockSource = "live";
    const t = data.actualizado ? new Date(data.actualizado) : new Date();
    sync.dataset.state = "online";
    $("#syncText").textContent = `Stock en vivo · actualizado ${isNaN(t) ? "recién" : t.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    sync.dataset.state = "fallback";
    $("#syncText").textContent = "Mostrando stock de respaldo · Jorge confirma por WhatsApp";
  }
  pruneCart();
  renderChips(); renderCatalog(); renderHero(); renderCart(); renderReserveItems();
}
$("#syncRetry").addEventListener("click", () => syncStock());
setInterval(() => { if (!document.hidden) syncStock({ quiet: true }); }, 5 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) syncStock({ quiet: true }); });

// ============================================================
// Carrito
// ============================================================
function saveCart() { store.set("mg-cart-v2", Object.fromEntries(state.cart)); }
function pruneCart() {
  const m = byId(); let removed = [];
  for (const [id] of state.cart) {
    const f = m.get(id);
    if (!f || !f.available) { state.cart.delete(id); if (f) removed.push(f.name); }
  }
  if (removed.length) { toast(`Se agotó: ${removed.join(", ")}. Lo quitamos de tu carrito.`); saveCart(); }
}
function changeQty(id, delta, { silent = false } = {}) {
  const f = byId().get(id);
  if (!f || (delta > 0 && !f.available)) return;
  const q = Math.max(0, Math.min(99, (state.cart.get(id) || 0) + delta));
  q ? state.cart.set(id, q) : state.cart.delete(id);
  saveCart(); renderCatalog(); renderCart(); renderReserveItems();
  if (delta > 0 && !silent) { bumpCount(); }
}
function addItems(items) {
  const m = byId(); const added = [];
  for (const { id, qty } of items) {
    const f = m.get(id); if (!f || !f.available) continue;
    state.cart.set(id, Math.min(99, (state.cart.get(id) || 0) + Math.max(1, qty | 0)));
    added.push(f.name);
  }
  saveCart(); renderCatalog(); renderCart(); renderReserveItems(); bumpCount();
  return added;
}
function cartLines() {
  const m = byId();
  return [...state.cart].map(([id, qty]) => ({ f: m.get(id), qty })).filter((l) => l.f)
    .map((l) => ({ ...l, price: unitPrice(l.f, state.format), subtotal: unitPrice(l.f, state.format) * l.qty }));
}
const cartTotals = () => { const lines = cartLines(); return { lines, bags: lines.reduce((s, l) => s + l.qty, 0), total: lines.reduce((s, l) => s + l.subtotal, 0) }; };

function bumpCount() { const c = $("#cartCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }

function renderCart() {
  const { lines, bags, total } = cartTotals();
  $("#cartCount").hidden = bags === 0; $("#cartCount").textContent = bags;
  $("#cartSub").textContent = `${bags} bolsa${bags === 1 ? "" : "s"} · ${FORMATS[state.format].name}`;
  $("#cartTotal").textContent = formatCLP(total);
  $("#dockCount").textContent = bags; $("#dockTotal").textContent = formatCLP(total);
  $("#dock").hidden = bags === 0;
  document.body.classList.toggle("has-cart", bags > 0);
  $("#cartFoot").hidden = bags === 0;

  // Promo del viernes: barra de progreso hacia la 5ª bolsa gratis
  const promo = $("#cartPromo");
  const isFriday = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: BUSINESS.timezone }) === "Fri";
  if (bags > 0 && isFriday) {
    const rem = 5 - (bags % 5);
    promo.hidden = false;
    promo.innerHTML = (bags >= 5 ? `🎉 Promo de viernes: llevas ${Math.floor(bags / 5)} bolsa(s) gratis. Jorge la aplica al confirmar.` : `Promo de viernes: agrega ${rem} bolsa${rem === 1 ? "" : "s"} más y la 5ª va gratis.`)
      + `<div class="bar"><i style="width:${bags >= 5 ? 100 : (bags % 5) * 20}%"></i></div>`;
  } else if (bags > 0 && bags < 3) {
    promo.hidden = false; promo.textContent = "Tip: lleva 3 y comparte con tu grupo de estudio (Combo Estudiante).";
  } else promo.hidden = true;

  $("#cartItems").innerHTML = lines.length ? lines.map(({ f, qty, price, subtotal }) => `
    <div class="line">${swatch(f.color)}
      <div class="line-info"><strong>${esc(f.name)}</strong><small>${formatCLP(price)} c/u · ${formatCLP(subtotal)}</small></div>
      <div class="stepper"><button type="button" data-dec="${f.id}" aria-label="Quitar">−</button><output>${qty}</output><button type="button" data-inc="${f.id}" aria-label="Agregar">+</button></div>
    </div>`).join("")
    : `<div class="drawer-empty"><svg><use href="#i-bag"/></svg><p>Tu carrito está vacío.<br>Elige un sabor o pídele una recomendación al Gigante.</p>
       <a class="btn btn-gold" href="#catalogo" data-close-cart>Ver sabores</a><button class="link" type="button" data-open-agent>Pedir recomendación</button></div>`;

  const msg = [
    `*Pedido MANI-GANTE* ✅`, `Formato: ${FORMATS[state.format].name}`, ``,
    ...lines.map(({ f, qty, price }) => `▪ ${f.name} x${qty} (${formatCLP(price)} c/u)`),
    ``, `*Total: ${formatCLP(total)}* · ${bags} bolsas`, ``, `Mi nombre: `, `Adjunto comprobante 👇`,
  ].join("\n");
  $("#cartWa").href = whatsappLink(msg);
}
$("#cartItems").addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
  if (inc) changeQty(inc.dataset.inc, +1, { silent: true });
  if (dec) changeQty(dec.dataset.dec, -1);
});
$("#cartClear").addEventListener("click", () => { state.cart.clear(); saveCart(); renderCatalog(); renderCart(); renderReserveItems(); });

function openCart() {
  $("#cart").classList.add("open"); $("#cart").setAttribute("aria-hidden", "false"); $("#scrim").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#cart").classList.remove("open"); $("#cart").setAttribute("aria-hidden", "true"); $("#scrim").hidden = true;
  document.body.style.overflow = "";
}
$("#cartOpen").addEventListener("click", openCart);
$("#dockCart").addEventListener("click", openCart);
$("#scrim").addEventListener("click", closeCart);
$("#cartReserve").addEventListener("click", closeCart);
document.addEventListener("click", (e) => { if (e.target.closest("[data-close-cart]")) closeCart(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); closeLightbox(); } });

// ============================================================
// Hero, marquee, estado en vivo
// ============================================================
function renderHero() {
  const status = campusStatus();
  const pill = $("#livePill");
  pill.dataset.open = status.open; pill.querySelector("span").textContent = status.open ? "En campus ahora" : status.label;
  $("#heroStatus").textContent = status.open ? "Jorge está en el campus ahora" : status.label;
  $("#heroLiveDot").classList.toggle("on", status.open);
  const available = state.catalog.filter((f) => f.available);
  $("#statAvailable").textContent = available.length;
  $("#heroStock").textContent = `${available.length} de ${state.catalog.length} sabores disponibles${state.stockSource === "live" ? " · stock en vivo" : ""}`;
  const top = available.filter((f) => f.topVentas).slice(0, 3);
  while (top.length < 3 && available[top.length]) top.push(available.find((f) => !top.includes(f)));
  $("#heroTop").innerHTML = top.map((f) => `<button type="button" class="hero-flavor" data-inc="${f.id}">${swatch(f.color)}<span>${esc(f.name)}</span><em>+ Agregar</em></button>`).join("");
}
$("#heroTop").addEventListener("click", (e) => {
  const b = e.target.closest("[data-inc]"); if (!b) return;
  changeQty(b.dataset.inc, +1); toast(`Agregado: ${byId().get(b.dataset.inc)?.name}`);
});
function renderMarquee() {
  const names = [...FLAVORS, ...JAPANESE].map((f) => `<span>${esc(f.name)}</span>`).join("");
  $("#marqueeTrack").innerHTML = names + names;
}

// ============================================================
// Combos
// ============================================================
function renderCombos() {
  $("#combos").innerHTML = COMBOS.map((c, i) => {
    const dots = state.catalog.filter((f) => f.available).slice(i * 3, i * 3 + Math.min(c.bags, 5)).map((f) => `<i style="background:${f.color}"></i>`).join("");
    return `<article class="combo${i === 1 ? " featured" : ""}">${i === 1 ? `<span class="tag">Más pedido</span>` : ""}
      <div class="combo-dots">${dots}</div><h3>${c.name}</h3><p>${c.text}</p>
      <div class="combo-price">${formatCLP(c.price)}<small>${c.bags} bolsas</small></div>
      <button class="btn ${i === 1 ? "btn-gold" : "btn-ink"}" type="button" data-combo="${c.id}">Armar con los favoritos</button></article>`;
  }).join("");
}
$("#combos").addEventListener("click", (e) => {
  const b = e.target.closest("[data-combo]"); if (!b) return;
  const combo = COMBOS.find((c) => c.id === b.dataset.combo);
  const pool = [...state.catalog].filter((f) => f.available && !f.premium).sort((a, b) => (b.topVentas - a.topVentas) || a.order - b.order);
  const picks = {};
  for (let i = 0; i < combo.bags; i++) { const f = pool[i % pool.length]; picks[f.id] = (picks[f.id] || 0) + 1; }
  state.format = "celofan"; store.set("mg-format", "celofan"); renderFormats();
  addItems(Object.entries(picks).map(([id, qty]) => ({ id, qty })));
  toast(`${combo.name} agregado. Puedes cambiar los sabores en el carrito.`);
  openCart();
});

// ============================================================
// Reservas
// ============================================================
const rf = { day: null, slot: null };
function renderReserveItems() {
  const { lines, total } = cartTotals();
  const box = $("#rfItems");
  if (!lines.length) {
    const sugg = state.catalog.filter((f) => f.available && f.topVentas).slice(0, 4);
    box.innerHTML = `<div class="rc-empty">Aún no eliges sabores. <a href="#catalogo">Ir al catálogo</a> o agrega uno de los favoritos:
      <div class="rc-suggest">${sugg.map((f) => `<button type="button" data-inc="${f.id}">${swatch(f.color)}${esc(f.name)}</button>`).join("")}</div></div>`;
  } else {
    box.innerHTML = lines.map(({ f, qty, subtotal }) => `<div class="rc-item">${swatch(f.color)}<span>${esc(f.name)}</span><em>x${qty} · ${formatCLP(subtotal)}</em></div>`).join("");
  }
  $("#rfTotal").textContent = formatCLP(total);
}
$("#rfItems").addEventListener("click", (e) => { const b = e.target.closest("[data-inc]"); if (b) changeQty(b.dataset.inc, +1); });
$("#rfEditCart").addEventListener("click", openCart);

function renderDays() {
  const days = reservableDays();
  if (!days.find((d) => d.iso === rf.day)) rf.day = days[0]?.iso ?? null;
  $("#rfDays").innerHTML = days.length ? days.map((d) => {
    const [wd, rest] = d.long.split(", ");
    return `<button type="button" class="day" role="radio" data-day="${d.iso}" aria-checked="${d.iso === rf.day}"><small>${d.label === "Hoy" || d.label === "Mañana" ? d.label : wd}</small><strong>${rest || d.label}</strong></button>`;
  }).join("") : `<p class="muted">No hay días disponibles esta semana. Escríbenos por WhatsApp.</p>`;
  renderSlots();
}
function renderSlots() {
  const day = reservableDays().find((d) => d.iso === rf.day);
  const slots = day?.slots || [];
  if (!slots.includes(rf.slot)) rf.slot = slots[0] ?? null;
  $("#rfSlots").innerHTML = slots.map((s) => `<button type="button" class="slot" role="radio" data-slot="${s}" aria-checked="${s === rf.slot}">${s}</button>`).join("");
}
$("#rfDays").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (!b) return; rf.day = b.dataset.day; renderDays(); });
$("#rfSlots").addEventListener("click", (e) => { const b = e.target.closest("[data-slot]"); if (!b) return; rf.slot = b.dataset.slot; renderSlots(); });
$("#rfPoint").innerHTML = RESERVATION_RULES.meetingPoints.map((p) => `<option>${esc(p)}</option>`).join("");
$("#rfName").value = store.get("mg-name", "");

function showErrors(errors) {
  const box = $("#rfErrors");
  box.hidden = !errors.length;
  box.innerHTML = errors.length ? `<ul>${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : "";
}

$("#reserveForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: $("#rfName").value, date: rf.day, time: rf.slot, meetingPoint: $("#rfPoint").value, notes: $("#rfNotes").value,
    format: state.format, items: [...state.cart].map(([id, qty]) => ({ id, qty })), website: $("#rfHp").value,
  };
  const local = buildReservation(payload, state.catalog);
  if (!local.ok) return showErrors(local.errors);
  showErrors([]);
  store.set("mg-name", payload.name.trim());
  const btn = $("#rfSubmit"); btn.disabled = true; btn.lastChild.textContent = " Validando stock…";

  let result = { ok: true, reservation: local.reservation, whatsappUrl: local.whatsappUrl };
  try {
    const res = await fetch("/api/reserve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      if (!data.ok) { btn.disabled = false; btn.lastChild.textContent = " Reservar por WhatsApp"; if (data.errors) { showErrors(data.errors); syncStock({ quiet: true }); } return; }
      result = data;
    }
  } catch { /* sin backend: usamos la validación local */ }

  btn.disabled = false; btn.lastChild.textContent = " Reservar por WhatsApp";
  showReservationSuccess(result);
});

function showReservationSuccess({ reservation: r, whatsappUrl }) {
  const form = $("#reserveForm");
  const html = form.innerHTML;
  form.innerHTML = `<div class="rc-success">
    <span class="ok"><svg><use href="#i-check"/></svg></span>
    <h3 class="h3">¡Reserva lista!</h3>
    <code>${esc(r.code)}</code>
    <p class="muted">${esc(r.dateLabel || r.date)} · ${esc(r.time)} · ${esc(r.meetingPoint)}<br>${r.bags} bolsas · <strong>${formatCLP(r.total)}</strong></p>
    <a class="btn btn-wa btn-lg" href="${whatsappUrl}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg> Enviar a Jorge por WhatsApp</a>
    <p class="muted" style="font-size:.86rem">Adjunta tu comprobante de pago en el chat para confirmar. <a class="link" href="#pago">Ver cuentas</a></p>
    <button class="link" type="button" id="rfAgain">Hacer otra reserva</button></div>`;
  window.open(whatsappUrl, "_blank", "noopener");
  $("#rfAgain").addEventListener("click", () => {
    state.cart.clear(); saveCart(); renderCatalog(); renderCart();
    form.innerHTML = html; renderReserveItems(); renderDays();
    $("#rfPoint").innerHTML = RESERVATION_RULES.meetingPoints.map((p) => `<option>${esc(p)}</option>`).join("");
    $("#rfName").value = store.get("mg-name", "");
  });
}

// ============================================================
// Galería
// ============================================================
const PHOTOS = [
  ["g1", "Mesa con decenas de bolsas MANI-GANTE de colores", 1400, 969],
  ["g6", "Maridaje MANI-GANTE con vino y quesos", 628, 1400],
  ["g2", "Sabores MANI-GANTE de cerca", 1178, 1400],
  ["g8", "MANI-GANTE en repisa junto a vinos", 1364, 768],
  ["g4", "Bolsas MANI-GANTE sobre la mesa", 1050, 1400],
  ["g5", "Detalle de una bolsa MANI-GANTE con su sticker", 1400, 1050],
  ["g10", "MANI-GANTE junto a vinos en repisa", 900, 1600],
  ["g9", "Sabores MANI-GANTE surtidos en bolsas", 900, 1290],
];
$("#gallery").innerHTML = PHOTOS.map(([g, alt, w, h]) => `<figure class="gallery-item" data-src="./assets/img/${g}-1600.webp">
  <img src="./assets/img/${g}-800.webp" alt="${esc(alt)}" loading="lazy" decoding="async" width="${w}" height="${h}"><figcaption>${esc(alt)}</figcaption></figure>`).join("");
const lb = $("#lightbox");
$("#gallery").addEventListener("click", (e) => {
  const fig = e.target.closest(".gallery-item"); if (!fig) return;
  lb.querySelector("img").src = fig.dataset.src; lb.querySelector("img").alt = fig.querySelector("img").alt; lb.hidden = false;
});
function closeLightbox() { lb.hidden = true; }
lb.addEventListener("click", closeLightbox);

// ============================================================
// Pagos, FAQ, nutrición, opiniones, compartir
// ============================================================
let toastTimer;
function toast(text) {
  const t = $("#toast"); t.textContent = text; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
$$(".pay-card[data-copy]").forEach((card) => card.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(card.dataset.copy); } catch {
    const ta = document.createElement("textarea"); ta.value = card.dataset.copy; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
  card.classList.add("copied"); toast(`${card.dataset.label}: datos copiados ✓`);
  setTimeout(() => card.classList.remove("copied"), 1800);
}));

$("#faqList").innerHTML = FAQ.map(([q, a], i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
$("#nutrition tbody").innerHTML = NUTRITION.map(([k, a, b]) => `<tr><td>${k}</td><td>${a}</td><td>${b}</td></tr>`).join("");

$("#reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target; const btn = form.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Enviando…";
  try {
    await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() });
    form.querySelectorAll(".field, .rc-row, button").forEach((el) => (el.hidden = true));
    form.querySelector(".form-ok").hidden = false;
  } catch { btn.disabled = false; btn.textContent = "Enviar opinión"; toast("No se pudo enviar, inténtalo de nuevo"); }
});

$$("[data-wa]").forEach((a) => (a.href = whatsappLink("Hola Jorge, quiero hacer un pedido de MANI-GANTE 🥜")));
$("#shareBtn").addEventListener("click", async () => {
  const data = { title: "MANI-GANTE", text: "Maní confitado artesanal en 28 sabores 🥜", url: BUSINESS.url };
  if (navigator.share) { try { await navigator.share(data); } catch {} }
  else { try { await navigator.clipboard.writeText(BUSINESS.url); toast("Link copiado ✓"); } catch {} }
});

// ============================================================
// Navegación, tema, animaciones
// ============================================================
const nav = $("#nav");
let lastY = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  nav.classList.toggle("scrolled", y > 40);
  nav.classList.toggle("hide", y > 500 && y > lastY + 4 && !nav.classList.contains("menu-open"));
  if (y < lastY - 4) nav.classList.remove("hide");
  lastY = y;
}, { passive: true });
const menuBtn = $("#menuBtn");
menuBtn.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") !== "true";
  menuBtn.setAttribute("aria-expanded", open); $("#mobileMenu").classList.toggle("open", open); nav.classList.toggle("menu-open", open);
});
$("#mobileMenu").addEventListener("click", (e) => {
  if (e.target.closest("a, button")) { menuBtn.setAttribute("aria-expanded", "false"); $("#mobileMenu").classList.remove("open"); nav.classList.remove("menu-open"); }
});

const themeBtn = $("#themeToggle");
const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
const paintThemeIcon = () => themeBtn.querySelector("use").setAttribute("href", isDark() ? "#i-sun" : "#i-moon");
themeBtn.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  document.documentElement.dataset.theme = next; store.set("mg-theme", next); paintThemeIcon();
});
paintThemeIcon();

const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .15 });
$$(".reveal").forEach((el) => io.observe(el));

// ============================================================
// API pública para el agente de IA
// ============================================================
window.MG = {
  addItems, openCart, toast,
  getCart: () => [...state.cart].map(([id, qty]) => ({ id, qty })),
  getFormat: () => state.format,
  getCatalog: () => state.catalog,
};

// ============================================================
// Inicio
// ============================================================
renderFormats(); renderChips(); renderCatalog(); renderMarquee(); renderHero(); renderCombos(); renderCart(); renderReserveItems(); renderDays();
setInterval(() => { renderHero(); renderDays(); }, 60_000);
syncStock();

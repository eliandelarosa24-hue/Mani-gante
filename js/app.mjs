import {
  BUSINESS, FORMATS, FLAVORS, JAPANESE, COMBOS, FAQ, NUTRITION, CATEGORY_ORDER, RESERVATION_RULES, STOCK_API_URL,
  mergeRemoteStock, formatCLP, unitPrice, slug, campusStatus, reservableDays, buildReservation, whatsappLink,
} from "./catalog.mjs";
import { bag, peanuts as swatch, stamp } from "./art.mjs";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  onlyAvailable: false,
};
if (!FORMATS[state.format]) state.format = "celofan";
const byId = () => new Map([...state.catalog, ...JAPANESE].map((f) => [f.id, f]));
const available = () => state.catalog.filter((f) => f.available);

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
  const badge = !f.available ? `<span class="badge out">Agotado</span>` : f.topVentas ? `<span class="badge">Top ventas</span>` : "";
  const premium = f.premium ? `<span class="badge premium">Precio fijo</span>` : "";
  const control = qty > 0
    ? `<div class="stepper"><button type="button" data-dec="${f.id}" aria-label="Quitar uno de ${esc(f.name)}"><svg><use href="#i-minus"/></svg></button><output aria-live="polite">${qty}</output><button type="button" data-inc="${f.id}" aria-label="Agregar uno de ${esc(f.name)}"><svg><use href="#i-plus"/></svg></button></div>`
    : `<button class="add-btn" type="button" data-inc="${f.id}" ${f.available ? "" : "disabled"}>${f.available ? `<svg><use href="#i-plus"/></svg>Agregar` : "Agotado"}</button>`;
  const fmt = f.line === "japones" ? "celofan" : state.format;
  return `<article class="card${f.available ? "" : " soldout"}${qty ? " in-cart" : ""}" data-id="${f.id}" style="--c:${f.color}">
    <button class="card-art" type="button" data-quick="${f.id}" aria-label="Ver detalle de ${esc(f.name)}">${badge}${premium}${bag(f.color, fmt, { label: "" })}<span class="quick-hint" aria-hidden="true"><svg><use href="#i-eye"/></svg></span></button>
    <h3>${esc(main)}${sub ? `<small>c/ ${esc(sub)}</small>` : ""}</h3>
    <p>${esc(f.notes || "")}</p>
    <div class="card-foot"><span class="price">${formatCLP(unitPrice(f, fmt))}</span>${control}</div>
  </article>`;
}

function filtered() {
  const q = slug(state.query);
  return state.catalog.filter((f) =>
    (state.category === "todos" || slug(f.category) === state.category)
    && (!q || slug(`${f.name} ${f.category} ${f.notes}`).includes(q))
    && (!state.onlyAvailable || f.available));
}
function renderCatalog() {
  const list = filtered();
  grid.innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
  gridJp.innerHTML = JAPANESE.map(cardHTML).join("");
  window.dispatchEvent(new CustomEvent("mg:catalog"));
}
// Actualiza solo una tarjeta (evita re-pintar todo al sumar/restar).
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
$("#onlyAvailable").addEventListener("change", (e) => { state.onlyAvailable = e.target.checked; renderCatalog(); });

for (const container of [grid, gridJp]) {
  container.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), quick = e.target.closest("[data-quick]");
    if (inc) { changeQty(inc.dataset.inc, +1, { from: inc.closest(".card")?.querySelector(".card-art") }); }
    else if (dec) changeQty(dec.dataset.dec, -1);
    else if (quick) openQuick(quick.dataset.quick);
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
  renderChips(); renderCatalog(); renderHero(); renderCart(); renderReserveItems(); renderPalette();
}
$("#syncRetry").addEventListener("click", () => syncStock());
setInterval(() => { if (!document.hidden) syncStock({ quiet: true }); }, 5 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) syncStock({ quiet: true }); });

// ============================================================
// Carrito
// ============================================================
function saveCart() { store.set("mg-cart-v2", Object.fromEntries(state.cart)); }
function pruneCart() {
  const m = byId(); const removed = [];
  for (const [id] of state.cart) {
    const f = m.get(id);
    if (!f || !f.available) { state.cart.delete(id); if (f) removed.push(f.name); }
  }
  if (removed.length) { toast(`Se agotó: ${removed.join(", ")}. Lo quitamos de tu boleta.`); saveCart(); }
}
function changeQty(id, delta, { from = null, silent = false } = {}) {
  const f = byId().get(id);
  if (!f || (delta > 0 && !f.available)) return;
  const q = Math.max(0, Math.min(99, (state.cart.get(id) || 0) + delta));
  q ? state.cart.set(id, q) : state.cart.delete(id);
  saveCart(); refreshCard(id); renderCart(); renderReserveItems();
  if (delta > 0 && !silent) {
    if (from) flyToCart(from, f.color); else bumpCart();
    if (q === 1) toast(f.name, f.color);
    try { navigator.vibrate?.(8); } catch {}
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
    .map((l) => { const price = unitPrice(l.f, state.format); return { ...l, price, subtotal: price * l.qty }; });
}
const cartTotals = () => { const lines = cartLines(); return { lines, bags: lines.reduce((s, l) => s + l.qty, 0), total: lines.reduce((s, l) => s + l.subtotal, 0) }; };

function cartTarget() {
  const dock = $("#dockCart");
  return dock && dock.offsetParent ? dock : $("#cartOpen");
}
function bumpCart() { const c = $("#cartOpen"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
function flyToCart(fromEl, color) {
  if (reduceMotion || !fromEl.animate) return bumpCart();
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

function renderCart() {
  const { lines, bags, total } = cartTotals();
  $("#cartCount").hidden = bags === 0; $("#cartCount").textContent = bags;
  $("#cartSub").textContent = `N° ${String(bags).padStart(3, "0")} · ${bags} bolsa${bags === 1 ? "" : "s"} · ${FORMATS[state.format].name}`;
  $("#cartTotal").textContent = formatCLP(total);
  $("#dockCount").textContent = `${bags} bolsa${bags === 1 ? "" : "s"}`; $("#dockTotal").textContent = formatCLP(total);
  $("#dock").hidden = bags === 0;
  document.body.classList.toggle("has-cart", bags > 0);
  $("#cartFoot").hidden = bags === 0;

  const promo = $("#cartPromo");
  const isFriday = new Date().toLocaleDateString("en-US", { weekday: "short", timeZone: BUSINESS.timezone }) === "Fri";
  if (bags > 0 && isFriday) {
    const rem = 5 - (bags % 5);
    promo.hidden = false;
    promo.innerHTML = (bags >= 5 ? `Promo de viernes: llevas ${Math.floor(bags / 5)} bolsa(s) gratis. Jorge la aplica al confirmar.` : `Promo de viernes: agrega ${rem} bolsa${rem === 1 ? "" : "s"} más y la 5ª va gratis.`)
      + `<div class="bar"><i style="width:${bags >= 5 ? 100 : (bags % 5) * 20}%"></i></div>`;
  } else if (bags > 0 && bags < 3) {
    promo.hidden = false; promo.textContent = "Tip: con 3 bolsas armas el Combo Estudiante para compartir.";
  } else promo.hidden = true;

  $("#cartItems").innerHTML = lines.length ? lines.map(({ f, qty, price, subtotal }) => `
    <div class="line">${swatch(f.color)}
      <div class="line-info"><strong>${esc(f.name)}</strong><small>${qty} × ${formatCLP(price)} ····· ${formatCLP(subtotal)}</small></div>
      <div class="stepper"><button type="button" data-dec="${f.id}" aria-label="Quitar uno de ${esc(f.name)}"><svg><use href="#i-minus"/></svg></button><output>${qty}</output><button type="button" data-inc="${f.id}" aria-label="Agregar uno de ${esc(f.name)}"><svg><use href="#i-plus"/></svg></button></div>
    </div>`).join("")
    : `<div class="drawer-empty">${bag("#C8963E", "doypack")}<p>Tu boleta está vacía.<br>Elige un sabor, arma tu caja o pídele una recomendación al Gigante.</p>
       <a class="btn btn-gold" href="#tienda" data-close-cart>Ir a la tienda</a><button class="link" type="button" data-open-quiz data-close-cart>Encontrar mi sabor</button></div>`;

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

let lastFocus = null;
function openCart() {
  lastFocus = document.activeElement;
  $("#cart").classList.add("open"); $("#cart").setAttribute("aria-hidden", "false"); $("#scrim").hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#cart [data-close-cart]")?.focus(), 50);
}
function closeCart() {
  if (!$("#cart").classList.contains("open")) return;
  $("#cart").classList.remove("open"); $("#cart").setAttribute("aria-hidden", "true"); $("#scrim").hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus?.({ preventScroll: true });
}
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
  $("#qvNotes").textContent = f.notes || "";
  const st = $("#qvStatus");
  st.className = `quick-status${f.available ? "" : " out"}`;
  st.innerHTML = `<i></i>${f.available ? `Disponible hoy${state.stockSource === "live" ? " · stock en vivo" : ""}` : "Agotado por ahora"}`;
  $("#qvFormats").hidden = f.line === "japones";
  $("#qvFormats").innerHTML = formatsHTML(fmt);
  $("#qvQty").textContent = qv.qty;
  $("#qvPrice").textContent = formatCLP(unitPrice(f, fmt) * qv.qty);
  $("#qvAdd").disabled = !f.available;
  $("#qvPair").innerHTML = pairsFor(f).map((p) => `<button type="button" data-pair="${p.id}">${swatch(p.color)}${esc(p.name)}</button>`).join("");
}
function openQuick(id) {
  qv = { id, qty: 1, format: state.format };
  renderQuick();
  quick.showModal();
}
$("#qvMinus").addEventListener("click", () => { qv.qty = Math.max(1, qv.qty - 1); renderQuick(); });
$("#qvPlus").addEventListener("click", () => { qv.qty = Math.min(60, qv.qty + 1); renderQuick(); });
$("#qvFormats").addEventListener("click", (e) => { const b = e.target.closest("[data-format]"); if (b) { qv.format = b.dataset.format; renderQuick(); } });
$("#qvPair").addEventListener("click", (e) => { const b = e.target.closest("[data-pair]"); if (b) { qv.id = b.dataset.pair; qv.qty = 1; renderQuick(); } });
$("#qvAdd").addEventListener("click", () => {
  const f = byId().get(qv.id);
  if (f.line !== "japones" && qv.format !== state.format) setFormat(qv.format);
  const from = $("#qvArt");
  for (let i = 0; i < qv.qty; i++) changeQty(qv.id, +1, { silent: true });
  quick.close();
  flyToCart(from, f.color);
  toast(`${qv.qty} × ${f.name}`, f.color);
});

// Cierre de modales con botón o clic en el fondo
for (const dlg of $$("dialog.modal")) {
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close-modal]")) dlg.close(); });
}

// ============================================================
// Encuentra tu sabor (quiz)
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
let quizAns = {};
function renderQuiz(step = 0) {
  const body = $("#quizBody");
  const prog = `<div class="quiz-progress" aria-hidden="true">${QUIZ.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}<i class="${step >= QUIZ.length ? "on" : ""}"></i></div>`;
  if (step < QUIZ.length) {
    const s = QUIZ[step];
    body.innerHTML = `${prog}<p class="eyebrow" style="justify-content:center">Paso ${step + 1} de ${QUIZ.length}</p><h2 class="quiz-q" id="quizTitle">${s.q}</h2>
      <div class="quiz-opts">${s.opts.map((o) => `<button type="button" class="quiz-opt" data-v="${o.v}">${swatch(o.color)}<span>${o.label}</span><small>${o.hint}</small></button>`).join("")}</div>`;
    body.querySelector(".quiz-opts").addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]"); if (!b) return;
      quizAns[s.key] = b.dataset.v; renderQuiz(step + 1);
    });
    body.querySelector("button")?.focus();
    return;
  }
  const picks = recommend(quizAns);
  const fmt = quizAns.moment === "regalo" ? "doypack" : "celofan";
  body.innerHTML = `${prog}<p class="eyebrow" style="justify-content:center">Tu selección</p><h2 class="quiz-q" id="quizTitle">Estos son <em>para ti</em></h2>
    <div class="quiz-result">${picks.map((f) => `<div class="quiz-pick">${bag(f.color, f.line === "japones" ? "celofan" : fmt)}<strong>${esc(f.name.replace("Maní Japonés ", "Japonés "))}</strong><small>${esc(f.notes)}</small></div>`).join("")}</div>
    ${fmt === "doypack" ? `<p class="muted" style="margin-bottom:18px">Para regalo te sugerimos la <strong>Reserva del Gigante</strong> (doypack hermético).</p>` : ""}
    <div class="quiz-actions"><button class="btn btn-gold btn-lg" type="button" id="quizAdd"><svg><use href="#i-bag"/></svg> Agregar los ${picks.length}</button><button class="btn btn-ghost" style="margin:0" type="button" id="quizAgain">Volver a empezar</button></div>`;
  $("#quizAdd").addEventListener("click", () => {
    addItems(picks.map((f) => ({ id: f.id, qty: 1 })), { format: fmt });
    $("#quiz").close(); toast(`Tu selección quedó en la boleta`, picks[0]?.color); openCart();
  });
  $("#quizAgain").addEventListener("click", () => { quizAns = {}; renderQuiz(0); });
}
function recommend({ taste, moment, style }) {
  const cats = TASTE_CATS[taste] || [];
  let pool = (taste === "salado" ? JAPANESE : available()).filter((f) => f.available && (taste === "salado" || cats.includes(f.category)));
  if (moment === "estudiar") pool.sort((a, b) => (b.category === "Café") - (a.category === "Café"));
  const score = (f) => (style === "clasico" ? (f.topVentas ? 2 : 0) : (f.topVentas ? 0 : 2)) + (moment === "regalo" && f.premium ? 1 : 0) + (moment === "compartir" && f.id === "mix" ? 2 : 0);
  pool = [...pool].sort((a, b) => score(b) - score(a) || a.order - b.order);
  const extra = available().filter((f) => f.topVentas && !pool.includes(f));
  return [...pool, ...extra].slice(0, 3);
}
document.addEventListener("click", (e) => {
  if (!e.target.closest("[data-open-quiz]")) return;
  quizAns = {}; renderQuiz(0); $("#quiz").showModal();
});

// ============================================================
// Arma tu caja
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
      ? `<button type="button" class="slot-cell filled" data-slot="${i}" style="--c:${f.color}" aria-label="Quitar ${esc(f.name)} del espacio ${i + 1}">${swatch(f.color)}<span>${esc(f.name.replace("Maní Japonés ", "Jp. "))}</span></button>`
      : `<div class="slot-cell" aria-label="Espacio ${i + 1} vacío"><em>${i + 1}</em></div>`;
  }).join("");
  $("#boxSlots").innerHTML = cells;
  $("#boxSlots").style.setProperty("--cols", box.size.bags === 10 ? 5 : 3);
  const filled = box.slots.filter(Boolean);
  const total = filled.reduce((s, id) => s + unitPrice(m.get(id), "celofan"), 0);
  $("#boxTotal").textContent = formatCLP(total);
  $("#boxCount").textContent = `${filled.length} / ${box.size.bags}`;
  $("#boxName").textContent = box.size.name;
  $("#boxAdd").disabled = filled.length === 0;
  $("#boxAdd").lastChild.textContent = filled.length === box.size.bags ? " Agregar caja" : ` Agregar ${filled.length || ""} a la boleta`;
}
function renderPalette() {
  const items = [...available().filter((f) => !f.premium), ...available().filter((f) => f.premium), ...JAPANESE.filter((f) => f.available)];
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
  if (i === undefined) { toast("Tu caja está llena. Toca un espacio para cambiarlo."); return; }
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
  toast(`${box.size.name} agregado a tu boleta`);
  box.slots = []; renderBox();
});

// ============================================================
// Hero, marquee, estado en vivo
// ============================================================
function renderHero() {
  const status = campusStatus();
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
function renderMarquees() {
  const names = [...FLAVORS, ...JAPANESE].map((f) => `<span>${esc(f.name)}</span>`).join("");
  $("#marqueeTrack").innerHTML = names + names;
  const words = ["Hecho a mano", "Lotes chicos", "Directo al campus", "Stock en vivo", "28 sabores", "Temuco"].map((w) => `<span>${w}</span>`).join("");
  $("#footerMarquee").innerHTML = (words + words) + (words + words);
}
$$("[data-stamp]").forEach((el) => { el.innerHTML = stamp(el.dataset.stamp || undefined); });

// ============================================================
// Reservas (ticket)
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
  $("#rfTotal").textContent = formatCLP(total);
}
function bindReserve() {
  $("#rfItems").addEventListener("click", (e) => { const b = e.target.closest("[data-inc]"); if (b) changeQty(b.dataset.inc, +1, { from: b }); });
  $("#rfEditCart").addEventListener("click", openCart);
  $("#rfDays").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (b) { rf.day = b.dataset.day; renderDays(); } });
  $("#rfSlots").addEventListener("click", (e) => { const b = e.target.closest("[data-slot]"); if (b) { rf.slot = b.dataset.slot; renderSlots(); } });
  $("#rfPoints").addEventListener("click", (e) => { const b = e.target.closest("[data-point]"); if (b) { rf.point = b.dataset.point; renderPoints(); } });
  $("#rfName").value = store.get("mg-name", "");
  $("#rfName").addEventListener("input", (e) => { e.target.removeAttribute("aria-invalid"); showErrors([]); });
  $("#reserveForm").addEventListener("submit", submitReservation);
  renderReserveItems(); renderDays(); renderPoints();
}
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
function renderPoints() {
  $("#rfPoints").innerHTML = RESERVATION_RULES.meetingPoints.map((p) => `<button type="button" class="point" role="radio" data-point="${esc(p)}" aria-checked="${p === rf.point}"><svg><use href="#i-pin"/></svg>${esc(p)}</button>`).join("");
}
function showErrors(errors) {
  const boxEl = $("#rfErrors");
  boxEl.hidden = !errors.length;
  boxEl.innerHTML = errors.length ? `<ul>${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : "";
}
async function submitReservation(e) {
  e.preventDefault();
  const payload = {
    name: $("#rfName").value, date: rf.day, time: rf.slot, meetingPoint: rf.point, notes: $("#rfNotes").value,
    format: state.format, items: [...state.cart].map(([id, qty]) => ({ id, qty })), website: $("#rfHp").value,
  };
  const local = buildReservation(payload, state.catalog);
  if (!local.ok) {
    if (!payload.name.trim()) { $("#rfName").setAttribute("aria-invalid", "true"); $("#rfName").focus(); }
    return showErrors(local.errors);
  }
  showErrors([]);
  store.set("mg-name", payload.name.trim());
  const btn = $("#rfSubmit"), label = btn.querySelector("span");
  btn.disabled = true; btn.setAttribute("aria-busy", "true"); label.textContent = "Validando stock…";
  let result = { ok: true, reservation: local.reservation, whatsappUrl: local.whatsappUrl };
  try {
    const res = await fetch("/api/reserve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
    if ((res.headers.get("content-type") || "").includes("application/json")) {
      const data = await res.json();
      if (!data.ok) {
        btn.disabled = false; btn.removeAttribute("aria-busy"); label.textContent = "Reservar por WhatsApp";
        if (data.errors) { showErrors(data.errors); syncStock({ quiet: true }); }
        return;
      }
      result = data;
    }
  } catch { /* sin backend: validación local */ }
  btn.disabled = false; btn.removeAttribute("aria-busy"); label.textContent = "Reservar por WhatsApp";
  showReservationSuccess(result);
}
const ticketHTML = $("#reserveForm").innerHTML;
function showReservationSuccess({ reservation: r, whatsappUrl }) {
  const form = $("#reserveForm");
  form.innerHTML = `<div class="ticket-main"><div class="ticket-head"><span class="brand-name">MANI<span>-</span>GANTE</span><small>Reserva confirmada en la web</small></div>
    <div class="rc-success">
      <span class="ok"><svg><use href="#i-check"/></svg></span>
      <h3 class="h3">¡Reserva lista, ${esc(r.name)}!</h3>
      <code>${esc(r.code)}</code>
      <p class="muted">${esc(r.dateLabel || r.date)} · ${esc(r.time)} · ${esc(r.meetingPoint)}<br>${r.bags} bolsa${r.bags === 1 ? "" : "s"} · <strong>${formatCLP(r.total)}</strong></p>
      <p class="hand">solo falta enviarla y adjuntar el comprobante</p>
    </div></div>
    <div class="ticket-stub"><span class="barcode" aria-hidden="true"></span>
      <a class="btn btn-wa btn-lg" href="${whatsappUrl}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg><span>Enviar a Jorge</span></a>
      <p style="width:100%;display:flex;gap:16px;justify-content:center;flex-wrap:wrap"><a class="link" href="#pago">Ver cuentas para pagar</a><button class="link" type="button" id="rfAgain">Hacer otra reserva</button></p></div>`;
  window.open(whatsappUrl, "_blank", "noopener");
  $("#rfAgain").addEventListener("click", () => {
    state.cart.clear(); saveCart(); renderCatalog(); renderCart();
    form.innerHTML = ticketHTML; bindReserve();
  });
}

// ============================================================
// Galería
// ============================================================
const PHOTOS = [
  ["g1", "Mesa con decenas de bolsas MANI-GANTE de colores", "la mesa de los viernes", 1400, 969],
  ["g6", "Maridaje MANI-GANTE con vino y quesos", "maridaje con vino", 628, 1400],
  ["g2", "Sabores MANI-GANTE de cerca", "de cerca se ve el baño", 1178, 1400],
  ["g8", "MANI-GANTE en repisa junto a vinos", "en la repisa", 1364, 768],
  ["g4", "Bolsas MANI-GANTE sobre la mesa", "lotes recién sellados", 1050, 1400],
  ["g5", "Detalle de una bolsa MANI-GANTE con su sticker", "el sello del elefante", 1400, 1050],
  ["g10", "MANI-GANTE junto a vinos en repisa", "noche de vinos", 900, 1600],
  ["g9", "Sabores MANI-GANTE surtidos en bolsas", "todos los colores", 900, 1290],
];
const gal = $("#gallery");
gal.innerHTML = PHOTOS.map(([g, alt, cap, w, h]) => `<figure class="gallery-item" data-src="./assets/img/${g}-1600.webp">
  <img src="./assets/img/${g}-800.webp" alt="${esc(alt)}" loading="lazy" decoding="async" width="${w}" height="${h}" draggable="false"><figcaption>${esc(cap)}</figcaption></figure>`).join("");
const lb = $("#lightbox");
let dragged = false;
gal.addEventListener("click", (e) => {
  if (dragged) return;
  const fig = e.target.closest(".gallery-item"); if (!fig) return;
  lb.querySelector("img").src = fig.dataset.src; lb.querySelector("img").alt = fig.querySelector("img").alt; lb.hidden = false;
});
function closeLightbox() { lb.hidden = true; }
lb.addEventListener("click", closeLightbox);
(() => { // arrastrar para desplazar (mouse)
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
let toastTimer;
function toast(text, color) {
  const t = $("#toast");
  t.innerHTML = `${color ? swatch(color) : ""}<span>${esc(text)}</span>`;
  t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
$$(".pay-card[data-copy]").forEach((card) => card.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(card.dataset.copy); } catch {
    const ta = document.createElement("textarea"); ta.value = card.dataset.copy; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
  card.classList.add("copied"); toast(`${card.dataset.label}: datos copiados`);
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
  } catch { btn.disabled = false; btn.textContent = "Enviar nota"; toast("No se pudo enviar, inténtalo de nuevo"); }
});

$$("[data-wa]").forEach((a) => (a.href = whatsappLink("Hola Jorge, quiero hacer un pedido de MANI-GANTE 🥜")));
$("#year").textContent = new Date().getFullYear();
$("#shareBtn").addEventListener("click", async () => {
  const data = { title: "MANI-GANTE", text: "Maní confitado a mano en 28 sabores 🥜", url: BUSINESS.url };
  if (navigator.share) { try { await navigator.share(data); } catch {} }
  else { try { await navigator.clipboard.writeText(BUSINESS.url); toast("Link copiado"); } catch {} }
});

// ============================================================
// Navegación, tema, progreso
// ============================================================
const nav = $("#nav");
const progress = $("#progress");
let lastY = 0, ticking = false;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    nav.classList.toggle("hide", y > 600 && y > lastY + 4 && !nav.classList.contains("menu-open"));
    if (y < lastY - 4) nav.classList.remove("hide");
    lastY = y;
    progress.style.transform = `scaleX(${Math.min(1, y / (document.documentElement.scrollHeight - innerHeight))})`;
    ticking = false;
  });
}, { passive: true });
const menuBtn = $("#menuBtn");
const setMenu = (open) => { menuBtn.setAttribute("aria-expanded", open); $("#mobileMenu").classList.toggle("open", open); nav.classList.toggle("menu-open", open); };
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
$("#mobileMenu").addEventListener("click", (e) => { if (e.target.closest("a, button")) setMenu(false); });

// Sección activa en el menú
const sectionObserver = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
["oficio", "tienda", "caja", "reservar", "historia"].forEach((id) => { const s = document.getElementById(id); if (s) sectionObserver.observe(s); });

const themeBtn = $("#themeToggle");
const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
const paintThemeIcon = () => themeBtn.querySelector("use").setAttribute("href", isDark() ? "#i-sun" : "#i-moon");
themeBtn.addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  document.documentElement.dataset.theme = next; store.set("mg-theme", next); paintThemeIcon();
});
paintThemeIcon();

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
renderFormats(); renderChips(); renderCatalog(); renderMarquees(); renderHero(); renderCart();
renderBoxSizes(); renderPalette(); renderBox(); bindReserve();
setInterval(() => { renderHero(); renderDays(); }, 60_000);
syncStock();

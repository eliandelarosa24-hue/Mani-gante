// ============================================================
// Widget del asistente "El Gigante"
// Habla con /api/agent (Claude). Si el backend no está disponible,
// responde con un modo local basado en el catálogo y el horario.
// ============================================================
import {
  BUSINESS, FORMATS, PREMIUM_PRICE, JAPANESE, RESERVATION_RULES, FAQ, formatCLP, slug, campusStatus, reservableDays, whatsappLink, unitPrice,
} from "./catalog.mjs";

const $ = (s) => document.querySelector(s);
const panel = $("#agent"), fab = $("#agentFab"), log = $("#agentLog"), form = $("#agentForm"), input = $("#agentInput"), quick = $("#agentQuick");
const HISTORY_KEY = "mg-agent-history";
const QUICK = ["¿Qué hay disponible hoy?", "Recomiéndame un sabor", "Quiero reservar", "¿Dónde te encuentro?", "¿Cómo pago?"];
const TOOL_LABELS = {
  check_availability: "Revisando el stock en vivo…",
  get_schedule: "Mirando el horario de Jorge…",
  create_reservation: "Creando tu reserva…",
  add_to_cart: "Agregando a tu carrito…",
};

let history = [];
try { history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]"); } catch {}
let busy = false;
let remoteAvailable = true;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmt = (text) => esc(text)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(?!\s)([^*\n]+?)\*/g, "<strong>$1</strong>")
  .replace(/(https?:\/\/[^\s<]+)/g, '<a class="link" href="$1" target="_blank" rel="noopener">$1</a>');
const save = () => { try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-20))); } catch {} };
const scroll = () => { log.scrollTop = log.scrollHeight; };

function bubble(role, text = "") {
  const el = document.createElement("div");
  el.className = `msg ${role === "user" ? "user" : "bot"}`;
  el.innerHTML = fmt(text);
  log.append(el); scroll();
  return el;
}
function typing() {
  const el = document.createElement("div");
  el.className = "msg bot typing"; el.innerHTML = "<i></i><i></i><i></i>";
  log.append(el); scroll(); return el;
}
function status(text) {
  const el = document.createElement("div");
  el.className = "msg-status"; el.textContent = text;
  log.append(el); scroll(); return el;
}
function renderAction(action) {
  const wrap = document.createElement("div");
  wrap.className = "msg-action";
  if (action.kind === "reservation") {
    const r = action.reservation;
    wrap.innerHTML = `<div class="msg-card"><strong>Reserva ${esc(r.code)}</strong>
      <span>${esc(r.dateLabel || r.date)} · ${esc(r.time)} · ${esc(r.meetingPoint)}</span>
      <span>${(r.lines || []).map((l) => `${esc(l.name)} x${l.qty}`).join(", ")}</span>
      <span>Total <b>${formatCLP(r.total)}</b></span></div>
      <a class="btn btn-wa" href="${esc(action.url)}" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg> ${esc(action.label || "Enviar por WhatsApp")}</a>`;
  } else if (action.kind === "add_to_cart") {
    window.MG?.addItems(action.items.map((i) => ({ id: i.id, qty: i.qty })));
    wrap.innerHTML = `<div class="msg-card"><strong>Agregado al carrito</strong><span>${action.items.map((i) => `${esc(i.name)} x${i.qty}`).join(", ")}</span></div>
      <button class="btn btn-gold" type="button" data-agent-cart>Ver mi carrito</button>`;
  } else if (action.kind === "whatsapp" || action.kind === "link") {
    wrap.innerHTML = `<a class="btn ${action.kind === "whatsapp" ? "btn-wa" : "btn-gold"}" href="${esc(action.url)}" ${action.url.startsWith("#") ? "" : 'target="_blank" rel="noopener"'}>${action.kind === "whatsapp" ? '<svg><use href="#i-wa"/></svg> ' : ""}${esc(action.label)}</a>`;
  }
  log.append(wrap); scroll();
}
log.addEventListener("click", (e) => {
  if (e.target.closest("[data-agent-cart]")) { close(); window.MG?.openCart(); }
  const a = e.target.closest('a[href^="#"]'); if (a && window.innerWidth < 640) close();
});

function renderQuick() {
  quick.innerHTML = QUICK.map((q) => `<button type="button">${esc(q)}</button>`).join("");
}
quick.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) send(b.textContent); });

function open() {
  panel.classList.add("open"); panel.setAttribute("aria-hidden", "false"); fab.classList.add("hidden"); fab.setAttribute("aria-expanded", "true");
  if (!log.childElementCount) greet();
  setTimeout(() => input.focus({ preventScroll: true }), 300);
}
function close() {
  panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); fab.classList.remove("hidden"); fab.setAttribute("aria-expanded", "false");
}
fab.addEventListener("click", open);
$("#agentClose").addEventListener("click", close);
document.addEventListener("click", (e) => { if (e.target.closest("[data-open-agent]")) { e.preventDefault(); open(); } });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) close(); });

function greet() {
  if (history.length) { history.forEach((m) => bubble(m.role, m.content)); renderQuick(); return; }
  const s = campusStatus();
  bubble("assistant", `¡Hola! Soy *El Gigante*, el asistente de MANI-GANTE 🥜\nTe digo qué sabores hay hoy, te recomiendo y te dejo la reserva lista para WhatsApp.\n\nAhora mismo: ${s.open ? "Jorge está en el campus" : s.label.toLowerCase()}. ¿En qué te ayudo?`);
  renderQuick();
}

form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });

async function send(raw) {
  const text = String(raw || "").trim().slice(0, 600);
  if (!text || busy) return;
  busy = true; input.value = ""; form.querySelector("button").disabled = true; quick.innerHTML = "";
  bubble("user", text);
  history.push({ role: "user", content: text }); save();
  const dots = typing();
  let reply = "";
  try {
    reply = remoteAvailable ? await askRemote(dots) : null;
    if (reply === null) { dots.remove(); reply = localAnswer(text); }
  } catch {
    dots.remove(); reply = localAnswer(text);
  }
  history.push({ role: "assistant", content: reply || "…" }); save();
  busy = false; form.querySelector("button").disabled = false; renderQuick(); scroll();
  if (window.innerWidth > 640) input.focus({ preventScroll: true });
}

// ---------- Backend (Claude) ----------
async function askRemote(dots) {
  let res;
  try {
    res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, cart: window.MG?.getCart() || [], format: window.MG?.getFormat() }),
    });
  } catch { remoteAvailable = false; return null; }
  if (!res.ok || !(res.headers.get("content-type") || "").includes("ndjson") || !res.body) {
    if (res.status !== 429) remoteAvailable = false;
    return null;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "", text = "", el = null, statusEl = null, failed = false;
  const ensureBubble = () => { if (!el) { dots.remove(); statusEl?.remove(); statusEl = null; el = bubble("assistant", ""); } };
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let ev; try { ev = JSON.parse(line); } catch { continue; }
      if (ev.type === "text") {
        if (el && el.dataset.closed) { el = null; text += "\n\n"; }
        ensureBubble(); text += ev.delta; el.dataset.raw = (el.dataset.raw || "") + ev.delta; el.innerHTML = fmt(el.dataset.raw); scroll();
      } else if (ev.type === "tool") {
        if (el) el.dataset.closed = "1";
        dots.remove(); statusEl?.remove(); statusEl = status(TOOL_LABELS[ev.name] || "Pensando…");
        log.append(dots);
      } else if (ev.type === "action") {
        statusEl?.remove(); statusEl = null; renderAction(ev.action);
      } else if (ev.type === "error") {
        failed = true;
      }
    }
  }
  dots.remove(); statusEl?.remove();
  if (!text && failed) return null;
  if (!text) return "";
  return text;
}

// ---------- Modo local (sin IA) ----------
function has(t, ...words) { return words.some((w) => t.includes(w)); }
function localAnswer(question) {
  const t = slug(question).replace(/-/g, " ");
  const catalog = window.MG?.getCatalog() || [];
  const all = [...catalog, ...JAPANESE];
  const available = catalog.filter((f) => f.available);
  const words = ` ${t} `;
  const plain = (s) => slug(s).replace(/-/g, " ");
  const full = all.filter((f) => words.includes(` ${plain(f.name)} `) || (f.short && words.includes(` mani japones ${plain(f.short)} `)));
  const partial = all.filter((f) => {
    const w = plain(f.short || f.name).split(" ")[0];
    return w.length > 3 && words.includes(` ${w} `);
  });
  const f0 = full.sort((a, b) => b.name.length - a.name.length)[0] || partial.sort((a, b) => a.name.length - b.name.length)[0];
  let answer = "";

  if (f0 && !has(t, "reserv")) {
    const f = f0;
    answer = f.available
      ? `¡Sí! *${f.name}* está disponible hoy a ${formatCLP(unitPrice(f, window.MG?.getFormat()))}. ${f.notes || ""}`
      : `Uy, *${f.name}* está agotado por ahora 😕 Te recomiendo probar ${available.filter((x) => x.category === f.category).slice(0, 2).map((x) => x.name).join(" o ") || available.slice(0, 2).map((x) => x.name).join(" o ")}.`;
    if (f.available) renderAction({ kind: "add_to_cart", items: [{ id: f.id, name: f.name, qty: 1 }] });
  } else if (has(t, "disponib", "hay", "stock", "queda", "sabores", "catalogo", "menu")) {
    answer = `Hoy hay *${available.length} sabores* disponibles. Los más pedidos: ${available.filter((f) => f.topVentas).map((f) => f.name).join(", ")}.${catalog.some((f) => !f.available) ? `\nAgotados por ahora: ${catalog.filter((f) => !f.available).map((f) => f.name).join(", ")}.` : ""}\nAdemás tenemos maní japonés: ${JAPANESE.map((j) => j.short).join(", ")}.`;
    renderAction({ kind: "link", url: "#tienda", label: "Ir a la tienda" });
  } else if (has(t, "recomien", "sugier", "cual", "mejor", "favorit", "rico")) {
    const tops = available.filter((f) => f.topVentas).slice(0, 3);
    answer = `Si es tu primera vez, parte con los favoritos: ${tops.map((f) => `*${f.name}* (${f.notes.toLowerCase().replace(/\.$/, "")})`).join(", ")}. Si eres más de chocolate, el Chocolate Menta no falla.`;
    if (tops.length) renderAction({ kind: "add_to_cart", items: tops.map((f) => ({ id: f.id, name: f.name, qty: 1 })) });
  } else if (has(t, "reserv", "encarg", "anticip", "apartar")) {
    const days = reservableDays();
    answer = `¡Vamos! Puedes reservar hasta con ${RESERVATION_RULES.maxDaysAhead} días de anticipación. Próximos días disponibles: ${days.map((d) => d.label).join(", ") || "ninguno esta semana"}.\nElige tus sabores, luego día, hora y punto de encuentro en la sección Reservar: te dejo el WhatsApp listo para enviar.`;
    renderAction({ kind: "link", url: "#reservar", label: "Ir a reservar" });
  } else if (has(t, "donde", "ubica", "encuentro", "campus", "inacap", "horario", "hora", "abierto", "estas")) {
    const s = campusStatus();
    answer = `Jorge recorre el campus ${BUSINESS.campus} (biblioteca, patios y pasillos). ${s.open ? `Ahora está en el campus, ${s.label.toLowerCase()}.` : `${s.label}.`} Si reservas, eliges el punto de encuentro y la hora.`;
  } else if (has(t, "pag", "transfer", "cuenta", "mercado", "efectivo", "mach")) {
    answer = "Aceptamos Cuenta RUT (BancoEstado), Mach, Mercado Pago (débito, crédito o saldo) y efectivo solo en compra presencial. Las reservas se confirman enviando el comprobante por WhatsApp.";
    renderAction({ kind: "link", url: "#pago", label: "Ver datos de pago" });
  } else if (has(t, "precio", "cuesta", "vale", "valor", "cuanto")) {
    answer = `${Object.values(FORMATS).map((f) => `*${f.name}*: ${formatCLP(f.price)} (${f.detail.toLowerCase()})`).join("\n")}\nLos sabores con cobertura y el Chocolate Dubái tienen precio fijo de ${formatCLP(PREMIUM_PRICE)}.`;
  } else if (has(t, "promo", "descuento", "oferta", "combo")) {
    answer = "Promos activas: los viernes compras 4 y la 5ª va gratis; y si subes una historia etiquetando @mani_gant tienes 10% de descuento (no acumulable). Los combos Estudiante (3), Grupo (6) y Profe (10) se arman solos desde la web.";
  } else if (has(t, "alerg", "gluten", "vegano", "azucar", "caloria", "nutri")) {
    answer = "Cada 100 g aportan 498 kcal, 13,2 g de proteínas y 42 g de azúcares (porción de 25 g ≈ 124 kcal). Es maní, así que no es apto para alérgicos al maní. Para trazas u otros ingredientes, mejor confírmalo directo con Jorge.";
  } else if (has(t, "envio", "delivery", "despacho", "domicilio")) {
    answer = FAQ.find(([q]) => q.includes("envíos"))[1];
  } else if (has(t, "hola", "buenas", "wena", "hey")) {
    answer = "¡Hola! 👋 ¿Buscas algún sabor en particular, quieres una recomendación o prefieres reservar para otro día?";
  } else if (has(t, "gracias", "vale", "ok", "listo")) {
    answer = "¡A ti! Cualquier antojo, aquí estoy 🥜";
  } else {
    answer = "Esa mejor te la responde Jorge directo. Te dejo el WhatsApp listo 👇";
    renderAction({ kind: "whatsapp", url: whatsappLink(`Hola Jorge, tengo una consulta: ${question}`), label: "Preguntarle a Jorge" });
  }
  // La acción se renderiza antes del texto: reordenamos para que el texto quede arriba.
  const actionEl = log.lastElementChild?.classList.contains("msg-action") ? log.lastElementChild : null;
  bubble("assistant", answer);
  if (actionEl) log.append(actionEl);
  scroll();
  return answer;
}

// Invitación sutil la primera vez
setTimeout(() => {
  if (sessionStorage.getItem("mg-agent-nudge") || panel.classList.contains("open")) return;
  try { sessionStorage.setItem("mg-agent-nudge", "1"); } catch {}
  fab.querySelector("small").textContent = "¿Te ayudo a elegir?";
}, 12000);

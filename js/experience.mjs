// ============================================================
// v4.5 · La experiencia completa: pedir y disfrutar
//  · Primera vez en la casa: recorrido de 4 pasos (Bolsa → Maletín → Cita → Trato), se puede saltar
//  · Ritual post-pedido: resumen, tip de disfrute y cierre de la familia (no bloquea la página)
//  · "Mi antojo de hoy": tarjeta 1080×1920 para la Story (etiquetando @mani_gant)
//  · "¿Cómo estuvo?": 3 reacciones 24 h después de un pedido; le llega a la casa
//  · Estado del ticket en vivo (recibido → preparando → te esperamos)
// Todo usa window.MG / mg:order y respeta "reducir movimiento".
// ============================================================
import { BUSINESS, tipFor, formatCLP } from "./catalog.mjs";
import { getOrders } from "./history.mjs";
import { bag } from "./art.mjs";
import { LABEL_DATA_URI } from "./label-data.mjs";
import { track } from "./analytics.mjs";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const MG = () => window.MG || {};
const flavor = (id) => MG().getFlavor?.(id);
const IG = "@mani_gant";

// ------------------------------------------------------------
// Mi antojo de hoy · tarjeta para la Story
// ------------------------------------------------------------
function loadImage(src) {
  return new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
}
export async function antojoCard(f) {
  const W = 1080, H = 1920, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  await document.fonts?.ready;
  // Fondo: noir con terciopelo, como el salón
  g.fillStyle = "#0d0b09"; g.fillRect(0, 0, W, H);
  const rad = g.createRadialGradient(W / 2, H * .42, 40, W / 2, H * .42, W * .9);
  rad.addColorStop(0, "rgba(110,26,44,.75)"); rad.addColorStop(1, "rgba(13,11,9,0)");
  g.fillStyle = rad; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(210,174,109,.18)"; g.lineWidth = 2;
  for (let r = 360; r <= 520; r += 40) { g.beginPath(); g.arc(W / 2, H * .42, r, 0, Math.PI * 2); g.stroke(); }
  g.strokeStyle = "rgba(210,174,109,.55)"; g.lineWidth = 2; g.strokeRect(48, 48, W - 96, H - 96);
  g.strokeStyle = "rgba(210,174,109,.25)"; g.strokeRect(62, 62, W - 124, H - 124);
  // La bolsa (la misma ilustración de la web)
  const svg = bag(f.color, f.line === "japones" ? "celofan" : "doypack", { num: f.no, logo: LABEL_DATA_URI }); // etiqueta incrustada: un SVG-imagen no puede pedir archivos
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try { const img = await loadImage(url); const bw = 560, bh = bw * (img.height / img.width || 1.3); g.drawImage(img, (W - bw) / 2, H * .42 - bh / 2, bw, bh); } catch {}
  URL.revokeObjectURL(url);
  g.textAlign = "center"; g.fillStyle = "#ddbb7c";
  g.font = "800 34px 'Big Shoulders', sans-serif"; g.letterSpacing = "10px";
  g.fillText("MI ANTOJO DE HOY", W / 2, 190);
  g.font = "800 30px 'Big Shoulders', sans-serif";
  g.fillText(`FICHA ${f.no || ""}`, W / 2, H * .72);
  g.letterSpacing = "0px"; g.fillStyle = "#f2eadb";
  g.font = "500 96px 'Bodoni Moda', serif";
  g.fillText(f.name.replace(/^Maní Japonés /, "Japonés "), W / 2, H * .72 + 110, W - 160);
  if (f.alias) { g.fillStyle = "#ddbb7c"; g.font = "italic 500 60px 'Bodoni Moda', serif"; g.fillText(`alias «${f.alias}»`, W / 2, H * .72 + 190, W - 160); }
  g.fillStyle = "#bfb3a1"; g.font = "500 34px 'Instrument Sans', sans-serif";
  g.fillText("Maní confitado a mano · Temuco", W / 2, H - 250);
  g.fillStyle = "#f2eadb"; g.font = "600 46px 'Bodoni Moda', serif"; g.letterSpacing = "8px";
  g.fillText("MANI-GANTE", W / 2, H - 170);
  g.fillStyle = "#ddbb7c"; g.font = "800 32px 'Big Shoulders', sans-serif"; g.letterSpacing = "6px";
  g.fillText(`${IG.toUpperCase()} · ETIQUÉTANOS`, W / 2, H - 110);
  return new Promise((ok) => c.toBlob(ok, "image/png"));
}
export async function shareAntojo(f) {
  if (!f) return;
  const blob = await antojoCard(f);
  if (!blob) return;
  const file = new File([blob], `mi-antojo-${f.id}.png`, { type: "image/png" });
  const text = `Mi antojo de hoy: ${f.name}${f.alias ? ` (alias «${f.alias}»)` : ""} de ${IG}. Para gente elegante y gánster.`;
  track("share_antojo", { flavor: f.id });
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
  } catch (e) { if (e?.name === "AbortError") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  MG().toast?.(`Tarjeta guardada. Súbela a tu Story y etiqueta a ${IG}: 10% en tu próximo pedido.`);
}

// ------------------------------------------------------------
// Primera vez en la casa · recorrido de 4 pasos
// ------------------------------------------------------------
const TOUR = [
  { target: "#tienda", title: "I · La Bolsa", text: "Los sabores en circulación esta semana. Toca una ficha para ver su alias, con qué va bien y el tip de la casa." },
  { target: "#cartOpen", title: "II · El Maletín", text: "Todo lo que sumas queda aquí, con su cuenta. Se guarda en tu teléfono aunque cierres la página." },
  { target: "#reservar", title: "III · La Cita", text: "Eliges día, hora y punto del campus. Tu maletín se carga solo en el ticket." },
  { target: "#pago", title: "IV · El Trato", text: "Se cierra por WhatsApp con Mercado Pago o transferencia. Y listo: ya eres de la familia." },
];
export function startTour(force = false) {
  if (!force && (store.get("mg-tour", false) || navigator.webdriver)) return;
  let i = 0;
  const card = document.createElement("aside");
  card.className = "tour-card room"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", "Primera vez en la casa");
  document.body.append(card);
  const end = (how) => { store.set("mg-tour", true); card.classList.remove("show"); document.querySelector(".tour-spot")?.classList.remove("tour-spot"); setTimeout(() => card.remove(), 400); track("tour", { how, step: i + 1 }); };
  const paint = () => {
    const s = TOUR[i];
    card.innerHTML = `<p class="tour-kicker">Primera vez en la casa · ${i + 1} de ${TOUR.length}</p>
      <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
      <div class="tour-dots" aria-hidden="true">${TOUR.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
      <div class="tour-actions"><button type="button" class="link" data-skip>Saltar</button><button type="button" class="btn btn-gold" data-next>${i < TOUR.length - 1 ? "Siguiente" : "A la Bolsa"}</button></div>`;
    document.querySelector(".tour-spot")?.classList.remove("tour-spot");
    const el = document.querySelector(s.target);
    if (el) { el.classList.add("tour-spot"); if (s.target !== "#cartOpen") el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
    card.querySelector("[data-next]").focus({ preventScroll: true });
  };
  card.addEventListener("click", (e) => {
    if (e.target.closest("[data-skip]")) return end("skip");
    if (e.target.closest("[data-next]")) { if (i < TOUR.length - 1) { i++; paint(); } else { end("done"); document.querySelector("#tienda")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); } }
  });
  card.addEventListener("keydown", (e) => { if (e.key === "Escape") end("skip"); });
  paint();
  requestAnimationFrame(() => card.classList.add("show"));
}
// Invitación de 3 segundos en la primera visita (después de la puerta), sin bloquear nada
function offerTour() {
  if (store.get("mg-tour", false) || navigator.webdriver || (store.get("mg-visits", 0) || 0) > 1) return;
  const open = () => {
    if (document.documentElement.classList.contains("door-on")) return setTimeout(open, 800);
    MG().toast?.("Primera vez en la casa? Te mostramos cómo funciona en 4 pasos.", { action: { label: "Ver", onClick: () => startTour(true) }, duration: 6000 });
    store.set("mg-tour", true);
  };
  setTimeout(open, 3000);
}

// ------------------------------------------------------------
// Ritual post-pedido + cierre de la familia (no bloquea: es una tarjeta, no un modal)
// ------------------------------------------------------------
function ritual() {
  const o = getOrders()[0]; if (!o) return;
  const first = flavor(o.items?.[0]?.id);
  $(".ritual")?.remove();
  const isRes = o.type === "reserva";
  const card = document.createElement("aside");
  card.className = "ritual paper-room"; card.setAttribute("role", "status"); card.setAttribute("aria-live", "polite");
  card.innerHTML = `<button type="button" class="icon-btn ritual-close" aria-label="Cerrar"><svg><use href="#i-close"/></svg></button>
    <p class="ritual-kicker">${isRes ? `Ticket ${esc(o.code)}` : "Trato enviado"} · ${o.bags} bolsa${o.bags === 1 ? "" : "s"} · ${formatCLP(o.total)}</p>
    <h3>Tu antojo ya va camino a la casa</h3>
    <p class="ritual-items">${(o.items || []).slice(0, 4).map((i) => `${esc(i.name)} ×${i.qty}`).join(" · ")}${(o.items || []).length > 4 ? " …" : ""}</p>
    ${isRes ? `<p class="ritual-when">Te esperamos ${esc(o.dateLabel || o.date || "")} · ${esc(o.time || "")} · ${esc(o.meetingPoint || "")}</p>` : ""}
    ${first ? `<p class="ritual-tip"><b>Tip de la casa:</b> ${esc(tipFor(first))}</p>` : ""}
    <div class="ritual-actions">${first?.color ? `<button type="button" class="btn btn-ghost" data-antojo>Mi antojo de hoy · Story</button>` : ""}<a class="link" href="${esc(BUSINESS.instagram || "https://instagram.com/mani_gant")}" target="_blank" rel="noopener">Etiqueta a ${IG}: 10%</a></div>
    <p class="ritual-sign">Gracias por confiar en la receta de la familia. Que lo disfrutes.</p><p class="ritual-by">— La Familia MANI-GANTE</p>`;
  document.body.append(card);
  const close = () => { card.classList.remove("show"); setTimeout(() => card.remove(), 450); };
  card.querySelector(".ritual-close").addEventListener("click", close);
  card.querySelector("[data-antojo]")?.addEventListener("click", () => shareAntojo(first));
  requestAnimationFrame(() => card.classList.add("show"));
  track("ritual_show", { type: o.type });
}
addEventListener("mg:order", () => setTimeout(ritual, reduce ? 300 : 3200)); // después del sobre y el lacre

// ------------------------------------------------------------
// ¿Cómo estuvo? · 3 reacciones, 24 h después
// ------------------------------------------------------------
const REACTIONS = [["3", "De otro nivel"], ["2", "Bueno"], ["1", "Pudo ser mejor"]];
function askFeedback() {
  const done = new Set(store.get("mg-feedback", []));
  const day = 864e5, now = Date.now();
  const o = getOrders().find((x) => x.items?.length && !done.has(x.id) && now - new Date(x.createdAt).getTime() > day && now - new Date(x.createdAt).getTime() < 21 * day);
  if (!o) return;
  const name = o.items[0].name;
  const card = document.createElement("aside");
  card.className = "feedback-card room"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", `¿Cómo estuvo el ${name}?`);
  card.innerHTML = `<p class="tour-kicker">La casa pregunta</p><h3>¿Cómo estuvo el ${esc(name)}?</h3>
    <div class="feedback-row">${REACTIONS.map(([v, t]) => `<button type="button" class="chip" data-score="${v}">${t}</button>`).join("")}</div>
    <button type="button" class="link" data-later>Ahora no</button>`;
  document.body.append(card);
  requestAnimationFrame(() => card.classList.add("show"));
  const close = () => { done.add(o.id); store.set("mg-feedback", [...done]); card.classList.remove("show"); setTimeout(() => card.remove(), 400); };
  card.addEventListener("click", (e) => {
    const b = e.target.closest("[data-score]");
    if (b) { track("feedback", { flavor: o.items[0].id, score: Number(b.dataset.score), order: o.code || o.type }); MG().toast?.("Gracias, le llegó a la casa. Así afinamos la receta."); close(); }
    if (e.target.closest("[data-later]")) close();
  });
}

// ------------------------------------------------------------
// Estado del ticket en vivo (Mis pedidos)
// ------------------------------------------------------------
const STEPS = { pendiente: 0, pagada: 1, entregada: 2 };
export async function ticketStatus(o) {
  if (o?.type !== "reserva" || !o.code || !o.date) return null;
  try {
    const r = await fetch(`/api/reserve?code=${encodeURIComponent(o.code)}&date=${encodeURIComponent(o.date)}`, { signal: AbortSignal.timeout(6000) });
    if (!r.ok) return null;
    const d = await r.json();
    if (!d.ok) return null;
    if (d.status === "cancelada" || d.status === "no-show") return { step: -1, text: d.status === "cancelada" ? "Ticket cancelado. Escríbenos si fue un error." : "No alcanzamos a encontrarnos. Escríbenos y lo coordinamos." };
    const step = STEPS[d.status] ?? 0;
    const texts = ["La casa recibió tu ticket", "Estamos preparando tu maletín", "Entregado. ¡Que lo disfrutes!"];
    return { step, text: step === 1 ? `${texts[1]} · te esperamos en ${d.meetingPoint || o.meetingPoint}` : texts[step] };
  } catch { return null; }
}
export function statusHTML(st) {
  if (!st) return "";
  if (st.step < 0) return `<p class="ticket-live off">${esc(st.text)}</p>`;
  return `<div class="ticket-live"><ol>${["Recibido", "Preparando", "Entregado"].map((t, i) => `<li class="${i <= st.step ? "done" : ""}">${t}</li>`).join("")}</ol><p>${esc(st.text)}</p></div>`;
}

// ------------------------------------------------------------
offerTour();
setTimeout(askFeedback, 6000);
window.MGExperience = { startTour, shareAntojo, ticketStatus, statusHTML };

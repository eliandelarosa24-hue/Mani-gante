// ============================================================
// v4.3 · Mejoras de la Casa (se cargan después de la tienda, sin frenar la primera pintura)
//  1. Reloj en vivo del Parte del día + "HOY" en la semana de la casa
//  2. "Lo de siempre": repetir el último pedido en un toque
//  3. La Ruleta de la Casa (tragamonedas para indecisos)
//  4. Índice de capítulos con progreso (escritorio)
//  5. Instalar la casa en el teléfono + aviso de conexión
// Todo usa window.MG (API pública de app.mjs) y respeta "reducir movimiento".
// ============================================================
import { BUSINESS, SCHEDULE, campusCountdown, zonedNow, formatCLP, unitPrice } from "./catalog.mjs";
import { getOrders } from "./history.mjs";
import { peanutsImg as swatch } from "./art.mjs";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const MG = () => window.MG || {};

// ------------------------------------------------------------
// 1. Reloj en vivo
// ------------------------------------------------------------
function fmtSpan(min) {
  const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60;
  if (d) return `${d} d ${h} h`;
  if (h) return `${h} h ${String(m).padStart(2, "0")} min`;
  return `${m} min`;
}
function renderClock() {
  const el = $("#heroCountdown"); if (!el) return;
  const c = campusCountdown();
  if (!c) { el.hidden = true; return; }
  const text = c.kind === "closes"
    ? (c.mode === "reservas" ? `Entregando reservas · cierra en` : `En el campus · cierra en`)
    : "Faltan";
  const value = fmtSpan(c.minutes);
  const v = el.querySelector("b");
  if (v && v.textContent !== value && !reduce) v.animate([{ transform: "translateY(-60%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
  el.innerHTML = `<i aria-hidden="true"></i><span>${esc(text)}</span> <b>${value}</b>`;
  el.hidden = false;
  el.classList.toggle("soon", c.kind === "closes" && c.minutes <= 60);
  // La semana de la casa: resalta hoy
  const today = zonedNow().weekday;
  $$(".spot-days li").forEach((li, i) => li.classList.toggle("today", SCHEDULE[i]?.day === today));
}

// ------------------------------------------------------------
// 2. Lo de siempre
// ------------------------------------------------------------
function renderAgain() {
  const host = $("#heroAgain"); if (!host) return;
  const last = getOrders().find((o) => o.items?.length);
  const cat = new Map((MG().getCatalog?.() || []).map((f) => [f.id, f]));
  const items = (last?.items || []).filter((it) => cat.get(it.id)?.available !== false);
  if (!last || !items.length || (MG().getCart?.() || []).length) { host.hidden = true; return; }
  const first = items[0];
  const more = items.length - 1;
  host.innerHTML = `<button type="button" class="again-btn"><span class="again-ic" aria-hidden="true">↺</span>
    <span><small>Lo de siempre</small><strong>${esc(first.name)} ×${first.qty}${more ? ` + ${more} más` : ""}</strong></span><em>Repetir</em></button>`;
  host.hidden = false;
  host.querySelector("button").addEventListener("click", () => {
    MG().addItems?.(items.map(({ id, qty }) => ({ id, qty })), { format: last.format });
    MG().toast?.("Lo de siempre, a la cuenta. Así se hace, mi pana.");
    MG().openCart?.();
    host.hidden = true;
  });
}

// ------------------------------------------------------------
// 3. La Ruleta de la Casa
// ------------------------------------------------------------
const ruleta = $("#ruleta");
let rolling = false, ruletaPick = null;
function reelStrip(pool, target) {
  // 18 caras al azar + la ganadora al final (la tira se desliza hasta ella)
  const faces = Array.from({ length: 18 }, () => pool[Math.floor(Math.random() * pool.length)]).concat(target);
  return faces.map((f) => `<span class="reel-face">${swatch(f.color)}</span>`).join("");
}
async function spin() {
  if (rolling) return;
  const pool = (MG().getCatalog?.() || []).filter((f) => f.available);
  if (!pool.length) return;
  rolling = true;
  ruletaPick = pool[Math.floor(Math.random() * pool.length)];
  const result = $("#ruletaResult");
  result.classList.remove("show");
  const reels = $$(".reel-strip", ruleta);
  const anims = reels.map((strip, i) => {
    strip.innerHTML = reelStrip(pool, ruletaPick);
    const face = strip.firstElementChild.offsetHeight || 92; // offsetHeight: no lo distorsiona la animación del diálogo
    const end = -(strip.children.length - 1) * face;
    if (reduce) { strip.style.transform = `translateY(${end}px)`; return Promise.resolve(); }
    return strip.animate([{ transform: "translateY(0)" }, { transform: `translateY(${end}px)` }],
      { duration: 1400 + i * 450, easing: "cubic-bezier(.15,.85,.25,1.04)", fill: "forwards" }).finished;
  });
  await Promise.all(anims);
  const f = ruletaPick;
  result.innerHTML = `<p class="eyebrow" style="justify-content:center">Te tocó · Ficha Nº ${esc(f.no || "")}</p>
    <h3 class="h3">${esc(f.name)}</h3><p class="ruleta-alias">alias «${esc(f.alias || "")}»</p><p class="muted">${esc(f.notes || "")}</p>`;
  result.classList.add("show");
  $("#ruletaAdd").disabled = false;
  $("#ruletaAdd").lastChild.textContent = ` Agregar · ${formatCLP(unitPrice(f, MG().getFormat?.() || "celofan"))}`;
  rolling = false;
}
if (ruleta) {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-open-ruleta]")) return;
    ruleta.showModal();
    $("#ruletaAdd").disabled = true;
    spin();
  });
  $("#ruletaSpin").addEventListener("click", spin);
  $("#ruletaAdd").addEventListener("click", () => {
    if (!ruletaPick) return;
    MG().addItems?.([{ id: ruletaPick.id, qty: 1 }]);
    MG().toast?.(`${ruletaPick.name} a la cuenta. La suerte está de tu lado.`, ruletaPick.color);
    ruleta.close();
  });
}

// ------------------------------------------------------------
// 4. Índice de capítulos (escritorio): I…IX con progreso
// ------------------------------------------------------------
const CHAPTERS = [["oficio", "La receta"], ["tienda", "Los más buscados"], ["caja", "El maletín"], ["reservar", "La cita"], ["historia", "El Jefe"], ["galeria", "Las pruebas"], ["pago", "El trato"], ["faq", "La letra chica"], ["opiniones", "La familia habla"]];
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
function buildIndex() {
  const nav = document.createElement("nav");
  nav.className = "chapters"; nav.setAttribute("aria-label", "Capítulos");
  nav.innerHTML = `<span class="chapters-line" aria-hidden="true"><i></i></span>` + CHAPTERS.map(([id, label], i) =>
    `<a href="#${id}" data-ch="${id}"><b>${ROMAN[i]}</b><span>${label}</span></a>`).join("");
  document.body.append(nav);
  const links = new Map($$("a", nav).map((a) => [a.dataset.ch, a]));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a, id) => { const on = id === en.target.id; a.classList.toggle("on", on); on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"); });
  }), { rootMargin: "-45% 0px -50% 0px" });
  CHAPTERS.forEach(([id]) => { const s = document.getElementById(id); if (s) io.observe(s); });
  const line = $(".chapters-line i", nav), hero = $(".hero");
  let raf = 0;
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      line.style.transform = `scaleY(${Math.min(1, scrollY / Math.max(1, max))})`;
      nav.classList.toggle("show", scrollY > (hero?.offsetHeight || 600) * .7);
    });
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
}
if (matchMedia("(min-width: 1380px)").matches) buildIndex();

// ------------------------------------------------------------
// 5. Instalar la casa en el teléfono + aviso de conexión
// ------------------------------------------------------------
let deferredPrompt = null;
const visits = (store.get("mg-visits", 0) || 0) + 1;
store.set("mg-visits", visits);
const isStandalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
function offerInstall(reason) {
  if (isStandalone || $(".install-card") || Date.now() < (store.get("mg-install-later", 0) || 0)) return;
  if (!deferredPrompt && !isIOS) return;
  const card = document.createElement("aside");
  card.className = "install-card room"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", "Instalar MANI-GANTE");
  card.innerHTML = `<img src="./assets/img/icon-192.png" alt="" width="52" height="52">
    <div><strong>Lleva la casa en tu teléfono</strong><span>${isIOS && !deferredPrompt ? "Toca <b>Compartir</b> y luego <b>Agregar a inicio</b>." : "Stock en vivo, tus pedidos y la cita a un toque, sin buscar el link."}</span></div>
    <div class="install-actions">${deferredPrompt ? `<button class="btn btn-gold" type="button" data-install>Instalar</button>` : ""}<button class="link" type="button" data-later>Ahora no</button></div>`;
  document.body.append(card);
  requestAnimationFrame(() => card.classList.add("show"));
  const close = () => { card.classList.remove("show"); setTimeout(() => card.remove(), 500); };
  card.querySelector("[data-later]").addEventListener("click", () => { store.set("mg-install-later", Date.now() + 30 * 86400000); close(); });
  card.querySelector("[data-install]")?.addEventListener("click", async () => { deferredPrompt.prompt(); await deferredPrompt.userChoice.catch(() => {}); deferredPrompt = null; close(); });
  window.MGTrack?.("install_offer", { reason });
}
addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; if (visits >= 2) setTimeout(() => offerInstall("visit"), 12000); });
addEventListener("mg:order", () => setTimeout(() => offerInstall("order"), 2500));
if (isIOS && visits >= 2 && !navigator.webdriver) setTimeout(() => offerInstall("ios"), 15000);

addEventListener("offline", () => MG().toast?.("Se fue la señal. Tranquilo: tu cuenta queda guardada en este teléfono."));
addEventListener("online", () => { MG().toast?.("De vuelta en línea. Actualizando la Bolsa de hoy…"); MG().resync?.(); });

// ------------------------------------------------------------
renderClock(); setInterval(renderClock, 30_000);
renderAgain();
addEventListener("mg:cart", renderAgain);

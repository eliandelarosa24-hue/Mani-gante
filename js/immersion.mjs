// ============================================================
// v4.4 · La experiencia de la Casa (inmersión de principio a fin)
//  1. Desplazamiento suave (Lenis, alojado en el sitio) en escritorio
//  2. Cursor de la casa con etiquetas según lo que tienes debajo
//  3. Profundidad del salón (capas que siguen al puntero) + luz según la hora del día
//  4. Bienvenida personal ("Buenas tardes, Chiqui")
//  5. El recorrido: Elegir · La cuenta · La cita · El trato
//  6. La ceremonia: sobre y lacre al cerrar un pedido o una cita
//  7. Sonidos de la casa (WebAudio, apagados por defecto)
// Todo es decorativo y opcional: con "reducir movimiento" o pantalla táctil la página queda igual de completa.
// ============================================================
import { monogram } from "./art.mjs";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const html = document.documentElement;
const firstName = () => String(store.get("mg-name", "") || "").trim().split(/\s+/)[0] || "";

// ------------------------------------------------------------
// 1. Desplazamiento suave
// ------------------------------------------------------------
function loadScript(src) {
  return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.append(s); });
}
if (!reduce && fine) {
  loadScript(new URL("../assets/vendor/lenis.min.js", import.meta.url).href).then(() => {
    const Lenis = window.Lenis; if (!Lenis) return;
    const navH = () => parseFloat(getComputedStyle(html).getPropertyValue("--nav-h")) || 72;
    // Si hay algo abierto encima (cuenta, diálogo, puerta), la rueda es de ese algo, no de la página
    const busy = () => document.body.style.overflow === "hidden" || html.classList.contains("door-on") || html.classList.contains("loading") || !!$("dialog[open]");
    const lenis = new Lenis({
      lerp: .1, wheelMultiplier: .95, allowNestedScroll: true,
      anchors: { offset: -(navH() + 16) },
      prevent: (node) => !!node.closest?.("dialog, .drawer, .agent, .sheet, .quick, [data-lenis-prevent]"),
      virtualScroll: () => !busy(),
    });
    window.MGLenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }).catch(() => {});
}

// ------------------------------------------------------------
// 2. Cursor de la casa
// ------------------------------------------------------------
const CURSOR_LABELS = [
  [".card, .qv-open", "Ver ficha"],
  [".insta-post, .gallery figure, .polaroid", "Mirar"],
  [".live-window", "Entrar"],
  [".hero-bag, .hero-stage", "Pruébame"],
  ["[data-open-ruleta]", "Suerte"],
  [".pay-card", "Copiar"],
];
if (!reduce && fine) {
  const ring = document.createElement("div");
  ring.className = "house-cursor"; ring.setAttribute("aria-hidden", "true");
  ring.innerHTML = `<span class="hc-ring"></span><span class="hc-label"></span>`;
  document.body.append(ring);
  const label = $(".hc-label", ring);
  let x = -100, y = -100, cx = -100, cy = -100, running = false, current = "";
  const loop = () => {
    cx += (x - cx) * .2; cy += (y - cy) * .2;
    ring.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    if (Math.abs(x - cx) + Math.abs(y - cy) > .3) requestAnimationFrame(loop); else running = false;
  };
  const sense = (t) => {
    if (!t) return;
    const hit = CURSOR_LABELS.find(([sel]) => t.closest?.(sel));
    const text = hit ? hit[1] : "";
    if (text !== current) { current = text; label.textContent = text; ring.classList.toggle("labeled", !!text); }
    ring.classList.toggle("link", !text && !!t.closest?.("a, button, [role=button], summary, label"));
    ring.classList.toggle("text", !!t.closest?.("input, textarea, select, iframe"));
  };
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    if (!running) { running = true; requestAnimationFrame(loop); }
    ring.classList.add("on");
    sense(e.target);
  }, { passive: true });
  // Al desplazarse, lo que hay bajo el puntero cambia aunque el mouse no se mueva
  let sraf = 0;
  addEventListener("scroll", () => {
    if (!ring.classList.contains("on")) return;
    cancelAnimationFrame(sraf);
    sraf = requestAnimationFrame(() => sense(document.elementFromPoint(x, y)));
  }, { passive: true });
  document.addEventListener("pointerleave", () => ring.classList.remove("on"));
  addEventListener("pointerdown", () => ring.classList.add("press"));
  addEventListener("pointerup", () => ring.classList.remove("press"));
}

// ------------------------------------------------------------
// 3. Profundidad del salón + luz del día
// ------------------------------------------------------------
const hour = Number(new Intl.DateTimeFormat("es-CL", { hour: "numeric", hourCycle: "h23", timeZone: "America/Santiago" }).format(new Date()));
const daypart = hour >= 6 && hour < 12 ? "manana" : hour >= 12 && hour < 20 ? "tarde" : "noche";
html.dataset.daypart = daypart;
const hero = $(".hero");
if (hero && !reduce && fine) {
  hero.classList.add("depth");
  let raf = 0;
  hero.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--dx", (((e.clientX - r.left) / r.width) - .5).toFixed(3));
      hero.style.setProperty("--dy", (((e.clientY - r.top) / r.height) - .5).toFixed(3));
    });
  });
  hero.addEventListener("pointerleave", () => { hero.style.setProperty("--dx", 0); hero.style.setProperty("--dy", 0); });
}

// ------------------------------------------------------------
// 4. Bienvenida personal
// ------------------------------------------------------------
const GREET = { manana: "Buenos días", tarde: "Buenas tardes", noche: "Buenas noches" };
function renderHello() {
  const kicker = $(".hero .kicker"); if (!kicker) return;
  const name = firstName();
  const visits = store.get("mg-visits", 0) || 0;
  if (!name && visits < 2) return;
  let el = $("#heroHello");
  if (!el) { el = document.createElement("p"); el.id = "heroHello"; el.className = "hero-hello"; kicker.before(el); }
  el.innerHTML = name
    ? `${GREET[daypart]}, <em>${esc(name)}</em>. Qué bueno tenerte de vuelta en la casa.`
    : `${GREET[daypart]}. Qué bueno tenerte de vuelta en la casa.`;
}
renderHello();

// ------------------------------------------------------------
// 5. El recorrido
// ------------------------------------------------------------
const STEPS = ["Elegir", "La cuenta", "La cita", "El trato"];
function journey(current) {
  return `<ol class="journey" aria-label="Tu recorrido">${STEPS.map((s, i) =>
    `<li class="${i < current ? "done" : i === current ? "now" : ""}"${i === current ? ' aria-current="step"' : ""}><b>${["I", "II", "III", "IV"][i]}</b><span>${s}</span></li>`).join("")}</ol>`;
}
let sealed = false;
function renderJourney() {
  const n = (window.MG?.getCart?.() || []).length;
  const drawerHead = $("#cart .drawer-head");
  if (drawerHead) {
    let host = $("#cartJourney");
    if (!host) { host = document.createElement("div"); host.id = "cartJourney"; drawerHead.after(host); }
    host.innerHTML = journey(n ? 1 : 0);
  }
  const head = $("#reservar .section-head");
  if (head) {
    let host = $("#reserveJourney");
    if (!host) { host = document.createElement("div"); host.id = "reserveJourney"; head.append(host); }
    host.innerHTML = journey(sealed ? 4 : n ? 2 : 0);
  }
}
renderJourney();
addEventListener("mg:cart", () => { sealed = false; renderJourney(); });

// ------------------------------------------------------------
// 6. La ceremonia
// ------------------------------------------------------------
function ceremony() {
  if (reduce) return;
  $(".ceremony")?.remove();
  const name = firstName();
  const el = document.createElement("div");
  el.className = "ceremony"; el.setAttribute("aria-hidden", "true");
  el.innerHTML = `<div class="cer-env">
      <div class="cer-flap"></div>
      <div class="cer-pocket"></div>
      <div class="cer-card"><small>Casa MANI-GANTE</small><strong>Trato hecho</strong><span>${name ? `Ya eres de la familia, ${esc(name)}.` : "Ya eres de la familia."}</span></div>
      <div class="cer-seal" style="z-index:3">${monogram("cer-mono")}</div>
    </div>`;
  document.body.append(el);
  requestAnimationFrame(() => el.classList.add("play"));
  setTimeout(() => el.classList.add("out"), 2600);
  setTimeout(() => el.remove(), 3300);
}
addEventListener("mg:order", () => { sealed = true; renderJourney(); ceremony(); sound("seal"); });

// ------------------------------------------------------------
// 7. Sonidos de la casa
// ------------------------------------------------------------
let soundOn = !!store.get("mg-sound", false);
let ctx = null;
function tone(freq, { at = 0, dur = .18, type = "sine", gain = .05, slide = 0 } = {}) {
  const t0 = ctx.currentTime + at;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t0 + dur);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + .008); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
  o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + dur + .02);
}
function sound(kind) {
  if (!soundOn) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    if (kind === "add") { tone(880, { dur: .09, gain: .04, slide: .6 }); tone(1320, { at: .05, dur: .22, gain: .025 }); }
    else if (kind === "seal") { tone(110, { dur: .35, type: "triangle", gain: .09, slide: .5 }); [523.25, 659.25, 783.99].forEach((f, i) => tone(f, { at: .25 + i * .09, dur: .9, gain: .03 })); }
    else if (kind === "tick") tone(1800, { dur: .03, gain: .015, type: "square" });
    else if (kind === "on") { tone(660, { dur: .12, gain: .04 }); tone(990, { at: .08, dur: .2, gain: .03 }); }
  } catch { /* sin audio: no pasa nada */ }
}
window.MGSound = sound;
const tools = $(".nav-tools");
if (tools) {
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "icon-btn sound-btn"; btn.id = "soundToggle";
  btn.setAttribute("aria-label", "Sonidos de la casa");
  const paint = () => {
    btn.setAttribute("aria-pressed", String(soundOn));
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/>${soundOn ? '<path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>' : '<path d="M16 9.5l5 5M21 9.5l-5 5"/>'}</svg>`;
  };
  paint();
  btn.addEventListener("click", () => {
    soundOn = !soundOn; store.set("mg-sound", soundOn); paint();
    if (soundOn) sound("on");
    window.MG?.toast?.(soundOn ? "Sonidos de la casa encendidos." : "Sonidos apagados. La casa en silencio.");
  });
  $("#themeToggle", tools)?.after(btn);
}
let lastCount = (window.MG?.getCart?.() || []).reduce((a, l) => a + (l.qty || 0), 0);
addEventListener("mg:cart", () => {
  const c = (window.MG?.getCart?.() || []).reduce((a, l) => a + (l.qty || 0), 0);
  if (c > lastCount) sound("add");
  lastCount = c;
});
document.addEventListener("click", (e) => { if (e.target.closest?.(".chip, [role=radio], .seg button")) sound("tick"); });

// Sistema unificado de toasts y helpers de UI accesibles.
import { peanuts } from "./art.mjs";

const ICONS = { success: "i-check", info: "i-spark", error: "i-close", alert: "i-bell" };
let timer;
/** toast("texto", { tone: "success"|"info"|"error"|"alert", color: "#hex", action: { label, onClick } }) */
export function toast(text, { tone = "success", color, action, duration = 3200 } = {}) {
  const t = document.getElementById("toast");
  if (!t) return;
  const icon = color ? peanuts(color) : `<span class="toast-icon tone-${tone}"><svg><use href="#${ICONS[tone] || ICONS.info}"/></svg></span>`;
  t.className = `toast tone-${tone}`;
  t.innerHTML = `${icon}<span>${String(text).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c])}</span>${action ? `<button type="button" class="toast-action">${action.label}</button>` : ""}`;
  t.setAttribute("role", tone === "error" ? "alert" : "status");
  if (action) t.querySelector(".toast-action").addEventListener("click", () => { action.onClick(); t.classList.remove("show"); });
  t.style.pointerEvents = action ? "auto" : "none";
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(timer); timer = setTimeout(() => t.classList.remove("show"), action ? duration + 2500 : duration);
}

/** Atrapa el foco dentro de un panel (drawer) mientras está abierto. */
export function trapFocus(panel) {
  const handler = (e) => {
    if (e.key !== "Tab") return;
    const f = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not(.hp), select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  panel.addEventListener("keydown", handler);
  return () => panel.removeEventListener("keydown", handler);
}

/** Sello "Hecho a mano" que cae sobre un elemento en un momento clave. */
export function stampMoment(target, text = "HECHO A MANO · APROBADO POR LA FAMILIA · ") {
  if (!target || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  import("./art.mjs").then(({ stamp }) => {
    const el = document.createElement("div");
    el.className = "stamp-moment"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = stamp(text);
    target.style.position ||= "relative";
    target.append(el);
    setTimeout(() => el.remove(), 2600);
  });
}

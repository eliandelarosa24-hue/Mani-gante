// i18n ligero (es-CL por defecto + en): traduce la interfaz marcada con data-i18n / data-i18n-label.
// El catálogo y las historias de Jorge quedan en español a propósito (es su voz).
const DICT = {
  en: {
    "hero.kicker": "Signature confectionery · Temuco",
    "hero.shop": "Meet the most wanted", "hero.quiz": "Take the interrogation", "hero.reserve": "or book a meeting with the Boss",
    "filter.available": "Available", "filter.top": "Most wanted", "filter.new": "Just arrived",
    "nav.history": "My orders",
  },
};
const NAV_EN = { "#oficio": "The recipe", "#tienda": "Most wanted", "#caja": "The briefcase", "#reservar": "The meeting", "#historia": "The Boss" };
const originals = new Map();

export function getLang() { try { return localStorage.getItem("mg-lang") || "es"; } catch { return "es"; } }
export function applyLang(lang) {
  document.documentElement.lang = lang === "en" ? "en" : "es-CL";
  const d = DICT[lang] || {};
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (!originals.has(el)) originals.set(el, el.textContent);
    el.textContent = d[el.dataset.i18n] || originals.get(el);
  });
  document.querySelectorAll("[data-i18n-label]").forEach((el) => {
    if (!originals.has(el)) originals.set(el, el.getAttribute("aria-label"));
    el.setAttribute("aria-label", d[el.dataset.i18nLabel] || originals.get(el));
  });
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (!originals.has(a)) originals.set(a, a.textContent);
    a.textContent = lang === "en" ? NAV_EN[a.getAttribute("href")] || originals.get(a) : originals.get(a);
  });
  const btn = document.getElementById("langToggle");
  if (btn) { btn.textContent = lang === "en" ? "ES" : "EN"; btn.setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English"); btn.lang = lang === "en" ? "es" : "en"; }
  try { localStorage.setItem("mg-lang", lang); } catch {}
}

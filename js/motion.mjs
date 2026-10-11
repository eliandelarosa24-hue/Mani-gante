// ============================================================
// Movimiento: revelados, capítulos del oficio y parallax suave.
// Todo es opcional: sin GSAP o con "reducir movimiento" la página queda estática y legible.
// ============================================================
const $$ = (s) => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Revelado al entrar en pantalla. Lo que ya está a la vista se marca antes de activar el modo,
// así nada parpadea; si este módulo no carga, todo queda visible.
// Más piezas entran con "reveal" (escalonadas dentro de su grupo).
[".craft-step", ".steps li", ".faq-item", ".spot", ".insta-post", ".section-head", ".box-sizes .size", ".ugc-card"].forEach((sel) => $$(sel).forEach((el) => { el.classList.add("reveal"); el.parentElement?.classList.add("stagger"); }));
const vh = innerHeight;
$$(".reveal").forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) el.classList.add("in"); });
document.documentElement.classList.add("motion-ready");
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: .12 });
$$(".reveal").forEach((el) => io.observe(el));
requestAnimationFrame(() => $$(".hero .reveal").forEach((el) => el.classList.add("in")));

// Capítulos del oficio: el paso visible cambia la foto del arco
const steps = $$(".craft-step");
const frames = $$(".craft-frame");
const num = document.getElementById("craftNum");
const stepObserver = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  const i = Number(en.target.dataset.step);
  steps.forEach((s) => s.classList.toggle("is-active", s === en.target));
  frames.forEach((f) => f.classList.toggle("is-active", Number(f.dataset.step) === i));
  if (num) num.textContent = String(i + 1).padStart(2, "0");
}), { rootMargin: "-40% 0px -45% 0px" });
steps.forEach((s) => stepObserver.observe(s));

// Rendimiento: las animaciones infinitas (brillos, pulsos, rosetas) se pausan cuando su sala no está en pantalla.
// Se ven igual, pero el teléfono deja de repintar lo que nadie está mirando.
const zones = $$("main > section, .hero, .ticker, footer");
const zoneIO = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle("anim-off", !en.isIntersecting)), { rootMargin: "120px 0px" });
zones.forEach((z) => zoneIO.observe(z));

// Numerales de capítulo: un grabado gigante (I…IX) detrás de cada sala, decorativo
$$(".section .eyebrow > span:first-child").forEach((tag) => {
  const m = /^Cap\.\s*([IVX]+)$/.exec(tag.textContent.trim());
  const section = tag.closest(".section");
  if (!m || !section || section.matches(".shop") || section.querySelector(":scope > .ch-layer")) return; // la tienda ya tiene su cartel "Se buscan"
  const layer = document.createElement("div");
  layer.className = "ch-layer"; layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `<span class="ch-numeral">${m[1]}</span>`;
  if (tag.closest(".center")) layer.classList.add("center");
  section.prepend(layer);
});

// GSAP alojado en el sitio (assets/vendor), cargado bajo demanda: no bloquea la primera pintura.
function loadScript(src) {
  return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.append(s); });
}
let gsapReady = null;
function withGsap(fn) {
  gsapReady ||= loadScript(new URL("../assets/vendor/gsap.min.js", import.meta.url).href)
    .then(() => loadScript(new URL("../assets/vendor/ScrollTrigger.min.js", import.meta.url).href));
  gsapReady.then(() => fn(window.gsap, window.ScrollTrigger)).catch(() => {});
}

// Títulos de sección: cada palabra sube desde una máscara (entrada cinematográfica, accesible).
function splitWords(el) {
  if (el.dataset.split) return [];
  el.dataset.split = "1";
  el.setAttribute("aria-label", el.textContent.trim());
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.append(w); return; }
          const outer = document.createElement("span"); outer.className = "w"; outer.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span"); inner.textContent = w; outer.append(inner); frag.append(outer);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
  };
  walk(el);
  return [...el.querySelectorAll(".w > span")];
}

if (!reduce) {
  withGsap((gsap, ScrollTrigger) => {
    gsap.registerPlugin(ScrollTrigger);

    // Entradas cinematográficas por sección
    gsap.utils.toArray(".section .h2:not(.hero-title):not(.masthead-name)").forEach((h) => {
      const words = splitWords(h);
      if (!words.length) return;
      gsap.from(words, { yPercent: 110, rotate: 3, duration: 1, ease: "power4.out", stagger: .045, scrollTrigger: { trigger: h, start: "top 85%" } });
    });
    gsap.utils.toArray(".section .eyebrow").forEach((e) => gsap.from(e, { opacity: 0, x: -14, duration: .8, ease: "power3.out", scrollTrigger: { trigger: e, start: "top 90%" } }));
    gsap.utils.toArray(".craft-media, .story-photos").forEach((m) => gsap.from(m, { clipPath: "inset(18% 12% 18% 12% round 32px)", opacity: .2, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: m, start: "top 80%" } }));

    // Parallax sutil solo en capas decorativas (nunca en texto)
    gsap.to("#heroImg", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-stamp", { rotate: 90, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.utils.toArray(".polaroid").forEach((p, i) => {
      gsap.fromTo(p, { yPercent: 6 * (i + 1) }, { yPercent: -6 * (i + 1), ease: "none", scrollTrigger: { trigger: ".story", scrub: .6 } });
    });
    gsap.fromTo(".box-stage", { y: 60, rotate: -2, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".box", start: "top 70%" } });
    gsap.fromTo(".ticket", { y: 60, rotate: 1.5, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".reserve", start: "top 70%" } });
    // fromTo con destino explícito: nunca quedan invisibles aunque otra regla las oculte al empezar
    gsap.fromTo(".pay-card", { y: 50, rotate: (i) => (i % 2 ? 4 : -4), opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: .9, stagger: .08, ease: "back.out(1.4)", scrollTrigger: { trigger: ".pay-grid", start: "top 80%" } });
    gsap.fromTo(".note-card", { y: 50, rotate: 3, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".reviews", start: "top 70%" } });

    // Numerales: viajan más lento que el contenido (profundidad entre salas)
    gsap.utils.toArray(".ch-numeral").forEach((n) => gsap.fromTo(n, { yPercent: 35 }, { yPercent: -35, ease: "none", scrollTrigger: { trigger: n.closest(".section"), start: "top bottom", end: "bottom top", scrub: .8 } }));

    // El Diario: la cita se enciende palabra por palabra mientras la lees
    const quote = document.querySelector(".letter blockquote");
    if (quote && !quote.dataset.split) {
      quote.dataset.split = "1";
      quote.setAttribute("aria-label", quote.textContent.trim());
      const words = quote.textContent.trim().split(/\s+/);
      quote.innerHTML = words.map((w) => `<span class="bw" aria-hidden="true">${w.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c])}</span>`).join(" ");
      gsap.fromTo(quote.querySelectorAll(".bw"), { opacity: .16 }, { opacity: 1, ease: "none", stagger: .1, scrollTrigger: { trigger: quote, start: "top 82%", end: "bottom 45%", scrub: .5 } });
    }

    // Entrada escalonada de la tienda (cada vez que se re-pinta, solo la primera vez que se ve)
    let shopSeen = false;
    const staggerCards = () => {
      const cards = gsap.utils.toArray("#grid .card");
      if (!cards.length) return;
      gsap.fromTo(cards, { opacity: 0, y: 18, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: "back.out(1.4)", stagger: { each: .035, grid: "auto", from: "start" }, overwrite: true, clearProps: "transform,opacity" });
    };
    ScrollTrigger.create({ trigger: "#grid", start: "top 85%", once: true, onEnter: () => { shopSeen = true; staggerCards(); } });
    let pending = false;
    addEventListener("mg:catalog", () => { if (!shopSeen || pending) return; pending = true; requestAnimationFrame(() => { pending = false; staggerCards(); }); });

    addEventListener("load", () => ScrollTrigger.refresh());
  });
}

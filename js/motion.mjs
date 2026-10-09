// ============================================================
// Movimiento: revelados, capítulos del oficio y parallax suave.
// Todo es opcional: sin GSAP o con "reducir movimiento" la página queda estática y legible.
// ============================================================
const $$ = (s) => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Revelado al entrar en pantalla
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

// GSAP (cargado con defer desde cdnjs)
function withGsap(fn, tries = 0) {
  if (window.gsap && window.ScrollTrigger) return fn(window.gsap, window.ScrollTrigger);
  if (tries < 40) setTimeout(() => withGsap(fn, tries + 1), 100);
}

if (!reduce) {
  withGsap((gsap, ScrollTrigger) => {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax sutil solo en capas decorativas (nunca en texto)
    gsap.to("#heroImg", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-stamp", { rotate: 90, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.utils.toArray(".polaroid").forEach((p, i) => {
      gsap.fromTo(p, { yPercent: 6 * (i + 1) }, { yPercent: -6 * (i + 1), ease: "none", scrollTrigger: { trigger: ".story", scrub: .6 } });
    });
    gsap.from(".box-stage", { y: 60, rotate: -2, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".box", start: "top 70%" } });
    gsap.from(".ticket", { y: 60, rotate: 1.5, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".reserve", start: "top 70%" } });
    gsap.from(".pay-card", { y: 50, rotate: (i) => (i % 2 ? 4 : -4), opacity: 0, duration: .9, stagger: .08, ease: "back.out(1.4)", scrollTrigger: { trigger: ".pay-grid", start: "top 80%" } });
    gsap.from(".note-card", { y: 50, rotate: 3, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".reviews", start: "top 70%" } });

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

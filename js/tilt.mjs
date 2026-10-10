// Micro-interacción "papel real": la tarjeta se inclina hacia el puntero y su sombra se desplaza
// al lado opuesto, como una bolsa de kraft bajo la luz. Solo en punteros finos y sin "reducir movimiento".
const MAX = 7; // grados
export function enableTilt(root = document) {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let active = null, frame = 0;
  root.addEventListener("pointermove", (e) => {
    const el = e.target.closest?.("[data-tilt]");
    if (el !== active) { if (active) reset(active); active = el; }
    if (!el) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty("--rx", `${(-y * MAX).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * MAX).toFixed(2)}deg`);
      el.style.setProperty("--sx", `${(-x * 18).toFixed(1)}px`);
      el.style.setProperty("--sy", `${(14 - y * 10).toFixed(1)}px`);
      el.style.setProperty("--gx", `${((x + .5) * 100).toFixed(0)}%`);
      el.style.setProperty("--gy", `${((y + .5) * 100).toFixed(0)}%`);
      el.classList.add("tilting");
    });
  }, { passive: true });
  root.addEventListener("pointerleave", () => active && reset(active), true);
  function reset(el) { el.classList.remove("tilting"); ["--rx", "--ry", "--sx", "--sy"].forEach((p) => el.style.removeProperty(p)); }
}

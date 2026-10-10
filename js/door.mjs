// La Puerta: intro de speakeasy, solo en la primera visita (la decide el script del <head>).
// Accesible: foco en el botón, Esc o "Entrar sin contraseña" la saltan, y el resto de la página queda inerte mientras tanto.
const root = document.documentElement;
const door = document.getElementById("door");
const main = document.querySelector("main");
if (door && root.classList.contains("door-on")) {
  const others = [main, document.getElementById("nav"), document.querySelector(".footer")].filter(Boolean);
  others.forEach((el) => { el.inert = true; });
  const enter = document.getElementById("doorEnter");
  setTimeout(() => door.classList.add("peek"), 500);
  enter?.focus();
  let done = false;
  const open = (fast = false) => {
    if (done) return; done = true;
    try { localStorage.setItem("mg-door", "1"); } catch {}
    door.classList.add("peek");
    setTimeout(() => door.classList.add("open"), fast ? 0 : 350);
    setTimeout(() => {
      root.classList.remove("door-on");
      others.forEach((el) => { el.inert = false; });
      document.getElementById("heroTitle")?.closest("section")?.querySelector("a, button")?.focus({ preventScroll: true });
    }, fast ? 700 : 1500);
  };
  setTimeout(() => open(), 8000); // nunca deja a nadie esperando en la puerta
  enter?.addEventListener("click", () => open());
  document.getElementById("doorSkip")?.addEventListener("click", () => open(true));
  addEventListener("keydown", (e) => { if (e.key === "Escape") open(true); });
}

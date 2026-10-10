// ============================================================
// Voz de marca: Jorge es dominicano y vive hace 8 años en Chile.
// Cercana y cálida, mezcla suave de dominicano ("chévere", "dímelo", "mi pana")
// y chileno de campus ("al tiro", "bacán", "el bajón"). Máximo 1 emoji por mensaje.
// Todos los textos de feedback salen de aquí para que suenen igual en toda la web.
// ============================================================
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const VOICE = {
  added: (name) => pick([`${name} a la boleta. ¡Chévere!`, `Listo, ${name} va contigo`, `${name} agregado, buena elección`]),
  addedMany: (n) => `${n} sabores a la boleta, ¡bacán!`,
  removedSoldOut: (names) => `Se nos acabó ${names}. Lo saqué de tu boleta, tranquilo.`,
  boxFull: () => "Tu caja ya está llena. Toca un espacio para cambiarlo.",
  boxAdded: (name) => `${name} a la boleta. Quedó preciosa esa caja.`,
  copied: (label) => `${label}: datos copiados`,
  linkCopied: () => "Link copiado, mándaselo a tu pana",
  orderSaved: () => "Pedido guardado. Lo encuentras en Mis pedidos.",
  orderShared: () => "Link de tu pedido copiado. Al abrirlo, la boleta vuelve tal cual.",
  orderRestored: (n) => `Recuperé tu pedido: ${n} bolsas te esperan`,
  welcomeBack: (n) => `Tu boleta te esperó: ${n} bolsas listas. ¿Lo cerramos?`,
  alertOk: (name) => `Listo, te aviso apenas vuelva ${name}`,
  reserveOk: (code) => `Reserva ${code} lista. Solo falta mandársela a Jorge.`,
  networkError: () => "Uy, se cayó la conexión. Intenta de nuevo en un ratito.",
  sending: () => "Enviando…",
  reviewOk: () => "¡Gracias! Tu nota le llegó a Jorge",
  emptyCart: "Tu boleta está vacía todavía. Elige un sabor, arma tu caja o dímelo y te recomiendo.",
  emptySearch: "Ese sabor no lo tengo (todavía). ¿Le preguntas al Gigante?",
  emptyHistory: "Aún no tienes pedidos guardados en este dispositivo. Cuando reserves o pidas, quedan aquí.",
  friday: (toNext, free) => free > 0 ? `Llevas ${free} bolsa${free > 1 ? "s" : ""} gratis por ser viernes. Jorge la aplica al confirmar.` : `Viernes de antojo: te faltan ${toNext} para la bolsa gratis`,
  away: (msg) => msg || "Hoy Jorge no está en el campus. Puedes reservar para cuando vuelva.",
};

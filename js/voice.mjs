// ============================================================
// Voz de marca · Casa Mani-Gante, "para gente elegante y gánster".
// Jorge es dominicano y vive hace 8 años en Chile. Tono de película de gánsteres con clase
// (familia, trato, lealtad), nunca violento ni de drogas.
// Cercana y cálida, mezcla suave de dominicano ("chévere", "dímelo", "mi pana")
// y chileno de campus ("al tiro", "bacán", "el bajón"). Máximo 1 emoji por mensaje.
// Todos los textos de feedback salen de aquí para que suenen igual en toda la web.
// ============================================================
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const VOICE = {
  added: (name) => pick([`${name} a la cuenta. ¡Chévere!`, `${name} ya es de la familia`, `Elegante. ${name} va contigo`]),
  addedMany: (n) => `${n} cómplices a la cuenta, ¡bacán!`,
  removedSoldOut: (names) => `Se nos escapó ${names}. Lo sacamos de tu cuenta, tranquilo.`,
  boxFull: () => "Tu maletín ya está lleno. Toca un compartimiento para cambiarlo.",
  boxAdded: (name) => `${name} a la cuenta. Ese maletín quedó de jefe.`,
  copied: (label) => `${label}: datos copiados`,
  linkCopied: () => "Link copiado, mándaselo a tu pana",
  orderSaved: () => "Pedido guardado. Lo encuentras en Mis pedidos.",
  orderShared: () => "Link de tu pedido copiado. Al abrirlo, la cuenta vuelve tal cual.",
  orderRestored: (n) => `Recuperé tu pedido: ${n} bolsas te esperan`,
  welcomeBack: (n) => `La casa te guardó la cuenta: ${n} bolsas. ¿Cerramos el trato?`,
  alertOk: (name) => `Listo, te avisamos apenas vuelva ${name}`,
  reserveOk: (code) => `Cita ${code} lista. Solo falta enviárnosla.`,
  networkError: () => "Uy, se cayó la conexión. Intenta de nuevo en un ratito.",
  sending: () => "Enviando…",
  reviewOk: () => "¡Gracias! Tu telegrama ya llegó a la casa",
  emptyCart: "La cuenta está limpia todavía. Elige a uno de los más buscados, llena tu maletín o dímelo y te recomiendo.",
  emptySearch: "Ese no está fichado (todavía). ¿Le preguntas al consigliere?",
  emptyHistory: "Aún no tienes pedidos guardados en este dispositivo. Cuando reserves o pidas, quedan aquí.",
  friday: (toNext, free) => free > 0 ? `Llevas ${free} bolsa${free > 1 ? "s" : ""} gratis por ser viernes. La aplicamos al confirmar.` : `Una oferta que no podrás rechazar: te faltan ${toNext} para la bolsa gratis`,
  away: (msg) => msg || "Hoy no estamos en el campus. Reserva y te lo tenemos listo a la vuelta.",
};

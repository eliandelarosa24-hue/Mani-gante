// ============================================================
// Voz de marca · Casa Mani-Gante, "para gente elegante y gánster".
// La casa es una familia dominicana con 8 años en Chile; habla en plural ("nosotros"). Tono de película de gánsteres con clase
// (familia, trato, lealtad), nunca violento ni de drogas.
// Cercana y cálida, mezcla suave de dominicano ("chévere", "dímelo", "mi pana")
// y chileno de campus ("al tiro", "bacán", "el bajón"). Máximo 1 emoji por mensaje.
// Todos los textos de feedback salen de aquí para que suenen igual en toda la web.
// ============================================================
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const VOICE = {
  added: (name) => pick([`${name}, al maletín. ¡Chévere!`, `${name} ya va contigo`, `Elegante. ${name} al maletín`]),
  addedMany: (n) => `${n} cómplices al maletín, ¡bacán!`,
  removedSoldOut: (names) => `Se nos escapó ${names} esta semana. Lo sacamos de tu maletín, tranquilo.`,
  boxFull: () => "Tu maletín ya está lleno. Toca un compartimiento para cambiarlo.",
  boxAdded: (name) => `${name} al maletín. Quedó de lujo.`,
  copied: (label) => `${label}: datos copiados`,
  linkCopied: () => "Link copiado, mándaselo a tu pana",
  orderSaved: () => "Trato enviado. Lo encuentras en Mis pedidos.",
  orderShared: () => "Link de tu maletín copiado. Al abrirlo, vuelve tal cual.",
  orderRestored: (n) => `Recuperamos tu maletín: ${n} bolsas te esperan`,
  welcomeBack: (n) => `Te guardamos el maletín: ${n} bolsas. ¿Cerramos el trato?`,
  alertOk: (name) => `Listo, te avisamos apenas vuelva ${name}`,
  reserveOk: (code) => `Ticket ${code} listo. Solo falta enviárnoslo.`,
  networkError: () => "Uy, se cayó la señal. Tu maletín sigue guardado: intenta de nuevo en un ratito.",
  sending: () => "Enviando…",
  reviewOk: () => "¡Gracias! Tu telegrama ya llegó a la casa",
  emptyCart: "Tu maletín está vacío todavía. Elige un sabor de la Bolsa de hoy o pregúntale al Consigliere: te recomienda al tiro.",
  emptySearch: "Ese no está fichado (todavía). ¿Le preguntas al Consigliere?",
  emptyHistory: "Aún no hay tratos guardados en este teléfono. Cuando agendes o pidas, quedan aquí.",
  friday: (toNext, free) => free > 0 ? `Llevas ${free} bolsa${free > 1 ? "s" : ""} gratis por ser viernes. La aplicamos al confirmar.` : `Una oferta que no podrás rechazar: te faltan ${toNext} para la bolsa gratis`,
  away: (msg) => msg || "Hoy no estamos en el campus. Reserva y te lo tenemos listo a la vuelta.",
};

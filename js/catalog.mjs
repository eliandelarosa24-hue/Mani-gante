// ============================================================
// MANI-GANTE · Fuente única de verdad del negocio
// Lo usan la web (navegador) y el agente de IA (Netlify Function).
// Edita aquí precios, horarios, sabores o datos de contacto.
// ============================================================

// Versión del catálogo: súbela cada vez que cambies precios, sabores o reglas.
// El panel admin y el agente la muestran; el historial queda en CATALOG_CHANGELOG.
export const CATALOG_VERSION = "2026.10.3";
export const CATALOG_CHANGELOG = [
  { version: "2026.10.3", date: "2026-10-10", note: "Identidad Casa Mani-Gante: alias y número de ficha por sabor, formatos El Clásico y La Reserva, eslogan 'Para gente gánster y elegante'." },
  { version: "2026.10.2", date: "2026-10-09", note: "Capacidad por bloque de reserva, sabores nuevos marcados, alérgenos y promo de viernes como regla." },
  { version: "2026.10.1", date: "2026-10-09", note: "Catálogo unificado para web y agente IA." },
];

export const BUSINESS = {
  name: "MANI-GANTE",
  tagline: "Para gente gánster y elegante",
  house: "Casa Mani-Gante",
  founder: "Jorge",
  whatsapp: "56958174288",
  instagram: "https://www.instagram.com/mani_gant",
  instagramHandle: "@mani_gant",
  facebook: "https://www.facebook.com/share/17nCwPvBCj/",
  mercadoPago: "https://link.mercadopago.cl/manigante",
  city: "Temuco, Chile",
  campus: "INACAP Temuco",
  timezone: "America/Santiago",
  url: "https://manigante.netlify.app/",
};

// Formatos de empaque. Los sabores "premium" (coberturas) tienen precio fijo.
export const FORMATS = {
  celofan: { id: "celofan", name: "El Clásico", detail: "Bolsa celofán · para el día", price: 1000 },
  doypack: { id: "doypack", name: "La Reserva", detail: "Doypack hermético · más frescura", price: 1500 },
};
export const PREMIUM_PRICE = 1500;

// Horario en que Jorge recorre el campus (hora de Chile).
// day: 0=domingo … 6=sábado. Ajusta a tu horario real.
export const SCHEDULE = [
  { day: 1, open: "09:00", close: "19:00" },
  { day: 2, open: "09:00", close: "19:00" },
  { day: 3, open: "09:00", close: "19:00" },
  { day: 4, open: "09:00", close: "19:00" },
  { day: 5, open: "09:00", close: "17:00" },
];

// Reservas: con cuántos días de anticipación se aceptan.
export const RESERVATION_RULES = {
  minDaysAhead: 0, // 0 = se puede reservar para hoy (si queda horario)
  maxDaysAhead: 4,
  minLeadMinutes: 60, // reservas para hoy: al menos 1 hora antes
  slots: ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"],
  meetingPoints: ["Biblioteca", "Patio central", "Hall de entrada", "Casino / cafetería", "Otro (lo coordinamos)"],
  maxBagsPerReservation: 60,
  slotCapacity: 6, // reservas máximas por bloque horario (Jorge camina solo)
};

// Alérgenos: texto honesto. Ajusta si Jorge certifica trazas.
export const ALLERGENS = {
  contains: ["Maní"],
  note: "Contiene maní. No tenemos certificación de trazas (frutos secos, leche, gluten): si tienes alergias, confírmalo con Jorge antes de comprar.",
};

export const PROMOS = [
  { id: "friday", day: 5, buy: 4, free: 1, title: "Promo de viernes", text: "Compra 4 bolsas y la 5ª va gratis (mientras dure la producción)." },
  { id: "tag", title: "10% por etiquetarnos", text: "Sube una historia etiquetando @mani_gant y muéstrala al pedir: 10% de descuento. No acumulable." },
];

export const COMBOS = [
  { id: "estudiante", name: "Combo Estudiante", bags: 3, price: 3000, text: "3 sabores a elección para el día de clases." },
  { id: "grupo", name: "Combo Grupo", bags: 6, price: 6000, text: "6 sabores mixtos para compartir con tu grupo de estudio." },
  { id: "profe", name: "Combo Profe", bags: 10, price: 10000, text: "10 bolsas surtidas para la sala o una reunión." },
];

// [id, nombre, color, categoría, topVentas, disponible, premium, notas de sabor]
const RAW_FLAVORS = [
  ["maracuya", "Maracuyá", "#F2A93B", "Frutales", true, true, false, "Ácido, tropical y brillante."],
  ["chocolate-menta", "Chocolate Menta", "#6B4636", "Chocolate", true, true, false, "Cacao intenso con final refrescante."],
  ["chirimoya-alegre", "Chirimoya Alegre", "#D9C48A", "Frutales", true, true, false, "Cremoso, dulce y muy chileno."],
  ["sandia", "Sandía", "#E2555C", "Frutales", true, true, false, "Dulce, jugoso y veraniego."],
  ["frutilla", "Frutilla", "#D93B4A", "Frutales", true, true, false, "El clásico que nunca falla."],
  ["cereza", "Cereza", "#A32638", "Frutales", false, true, false, "Frutal profundo, levemente ácido."],
  ["arandano", "Arándano", "#4F5FA6", "Frutales", false, true, false, "Frutos rojos con carácter."],
  ["arandano-azul", "Arándano Azul", "#315EA8", "Frutales", false, true, false, "Más suave y aromático."],
  ["naranja", "Naranja", "#E97824", "Frutales", false, true, false, "Cítrico y luminoso."],
  ["pistacho", "Pistacho", "#8FAE6B", "Clásicos", true, true, false, "Tostado, cremoso y elegante."],
  ["whisky", "Whisky", "#A9702D", "Cócteles", false, true, false, "Notas de barrica y caramelo."],
  ["frambuesa", "Frambuesa", "#C13564", "Frutales", false, false, false, "Intenso y perfumado."],
  ["coco", "Coco", "#EDE6D6", "Clásicos", true, true, false, "Tropical y suave."],
  ["pasa-el-ron", "Pasa el Ron", "#8A5A2B", "Cócteles", true, false, false, "El sabor del helado de la abuela."],
  ["pina-colada", "Piña Colada", "#F0D766", "Cócteles", false, true, false, "Piña y coco, de vacaciones."],
  ["nutella", "Nutella", "#4A2F23", "Chocolate", false, true, false, "Avellana y cacao."],
  ["mix", "Mix", "#B9862E", "Clásicos", false, true, false, "Un poco de todo para indecisos."],
  ["mocaccino", "Mocaccino", "#6B4A3A", "Café", false, true, false, "Café con chocolate."],
  ["miel", "Miel", "#D9A441", "Clásicos", false, true, false, "Dorado, natural y reconfortante."],
  ["platano-c-cobertura-de-chocolate", "Plátano c/ Cobertura de Chocolate", "#4A3222", "Coberturas", false, true, true, "Bañado en chocolate."],
  ["naranja-c-cobertura-de-chocolate", "Naranja c/ Cobertura de Chocolate", "#B85C1F", "Coberturas", false, true, true, "Cítrico + chocolate, combinación de autor."],
  ["chocolate-dubai", "Chocolate Dubái", "#3E2A1A", "Chocolate", false, true, true, "Nuestra versión del chocolate de moda."],
  ["lucuma-manjar-c-chocolate-blanco", "Lúcuma Manjar c/ Chocolate Blanco", "#E8D5B0", "Coberturas", false, true, true, "Lúcuma y manjar con chocolate blanco."],
  ["frutilla-c-cobertura-de-chocolate", "Frutilla c/ Cobertura de Chocolate", "#A32D45", "Coberturas", false, true, true, "Frutilla bañada en chocolate."],
  ["leche-con-platano", "Leche con Plátano", "#F5D98B", "Cremosos", false, true, false, "Cremoso como la once de la infancia."],
  ["frutos-del-bosque", "Frutos del Bosque", "#6B3F69", "Frutales", false, true, false, "Mezcla de berries."],
  ["natural-rojo", "Natural Rojo", "#C1272D", "Clásicos", false, true, false, "El confitado tradicional de feria."],
  ["cappuccino", "Cappuccino", "#7B4B33", "Café", false, true, false, "Espresso con leche, ideal para estudiar."],
];

// Alias de cada sabor (la "ficha" de Los Más Buscados). Jorge puede cambiarlos cuando quiera.
export const ALIASES = {
  maracuya: "La Tropical", "chocolate-menta": "El Fresco", "chirimoya-alegre": "La Alegre", sandia: "La Veraniega",
  frutilla: "La Clásica", cereza: "Doña Cereza", arandano: "El Morado", "arandano-azul": "Blue", naranja: "La Mecánica",
  pistacho: "El Elegante", whisky: "Don Whisky", frambuesa: "La Perfumada", coco: "El Caribeño", "pasa-el-ron": "El Abuelo",
  "pina-colada": "La Vacacionista", nutella: "El Italiano", mix: "El Indeciso", mocaccino: "El Nocturno", miel: "La Dorada",
  "platano-c-cobertura-de-chocolate": "El Platanero", "naranja-c-cobertura-de-chocolate": "La Doble Vida", "chocolate-dubai": "El Jeque",
  "lucuma-manjar-c-chocolate-blanco": "La Patrona", "frutilla-c-cobertura-de-chocolate": "La Seductora", "leche-con-platano": "El Nene",
  "frutos-del-bosque": "La Silvestre", "natural-rojo": "El Original", cappuccino: "El Desvelado",
  "mani-japones-salado": "El Serio", "mani-japones-barbecue": "El Ahumado", "mani-japones-habanero": "El Bravo",
  "mani-japones-merken": "El Sureño", "mani-japones-mix": "La Pandilla",
};

export const FLAVORS = RAW_FLAVORS.map(
  ([id, name, color, category, topVentas, available, premium, notes], index) => ({
    id, name, color, category, topVentas, available, premium, notes,
    line: "confitado",
    order: index + 1,
    isNew: false,
    alias: ALIASES[id] || "",
    no: String(index + 1).padStart(2, "0"),
  }),
);

export const JAPANESE = [
  ["mani-japones-salado", "Salado", "#B28A4A", "Crocante y clásico."],
  ["mani-japones-barbecue", "Barbecue", "#8C4B2D", "Ahumado y dulzón."],
  ["mani-japones-habanero", "Habanero", "#C44A24", "Picante de verdad."],
  ["mani-japones-merken", "Merkén", "#7B3E2A", "Ahumado mapuche, muy del sur."],
  ["mani-japones-mix", "Mix", "#9B6A35", "Todos los japoneses juntos."],
].map(([id, short, color, notes], index) => ({
  id,
  name: `Maní Japonés ${short}`,
  short,
  color,
  notes,
  category: "Maní Japonés",
  topVentas: false,
  available: true,
  premium: false,
  line: "japones",
  order: 100 + index,
  isNew: true,
  alias: ALIASES[id] || "",
  no: `J${index + 1}`,
}));

// Sabores marcados como "nuevo" en la tienda (además de toda la línea japonesa).
export const NEW_IDS = new Set([]); // ej: new Set(["chocolate-dubai"])

export const CATEGORY_ORDER = ["Frutales", "Chocolate", "Clásicos", "Cócteles", "Cremosos", "Café", "Coberturas", "Maní Japonés"];

export const DISCONTINUED_IDS = new Set([
  "pisco-sour", "suspiro-limeno", "limon", "piscola", "leche-condensada", "pie-de-limon", "mango", "mora-crema",
  "frutos-del-bosque-c-de-choc-blanco", "frutos-del-bosque-c-choc-blanco",
  "frutos-del-bosque-cobertura-de-chocolate-blanco", "frutos-del-bosque-c-de-chocolate-blanco",
  "coco-c-cobertura-de-chocolate-blanco", "coco-c-cobertura-chocolate-blanco",
]);

// Endpoint de Google Apps Script que entrega el stock en vivo (columna "disponible").
export const STOCK_API_URL =
  "https://script.google.com/macros/s/AKfycbxaZjNa5qeQhR43FrJlHRJrxRx1YoEG5gwGIlDTrGOs4SmyayMBQBKXnEjJjFCpl42Exg/exec";

export const NUTRITION = [
  ["Energía", "498 kcal", "124,5 kcal"],
  ["Proteínas", "13,2 g", "3,3 g"],
  ["Grasas totales", "24,6 g", "6,1 g"],
  ["Grasas saturadas", "3,5 g", "0,9 g"],
  ["Hidratos de carbono", "55,1 g", "13,8 g"],
  ["Azúcares totales", "42,0 g", "10,5 g"],
  ["Sodio", "2,0 mg", "0,5 mg"],
];

export const FAQ = [
  ["¿Puedo pedir con anticipación?", "Sí. Puedes reservar hasta con 4 días de anticipación desde la sección Reservar o con el asistente. Las reservas se confirman por WhatsApp y se pagan por transferencia o Mercado Pago."],
  ["¿Cómo sé que el maní está fresco?", "Se prepara en pequeños lotes durante la semana; no hay stock guardado por meses. La disponibilidad de cada sabor se actualiza en vivo en el catálogo."],
  ["¿Dónde te encuentro?", "No hay puesto fijo: Jorge recorre el campus INACAP Temuco (biblioteca, patios, pasillos). Si reservas, eliges un punto de encuentro y la hora."],
  ["¿Qué formas de pago aceptan?", "Cuenta RUT (BancoEstado), Mach, Mercado Pago (débito, crédito o saldo) y efectivo solo en compra presencial."],
  ["¿Puedo mezclar sabores?", "Sí. Agrega los sabores que quieras al carrito; se arma un solo pedido con el detalle completo."],
  ["¿Hacen envíos fuera de INACAP?", "La entrega es personal dentro del campus INACAP Temuco. Si necesitas algo fuera de ese radio, escríbenos por WhatsApp y vemos la posibilidad."],
];

// ------------------------------------------------------------
// Utilidades compartidas
// ------------------------------------------------------------

export function slug(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sheetBoolean(value) {
  if (typeof value === "boolean") return value;
  return ["true", "1", "si", "sí", "disponible", "x"].includes(String(value ?? "").trim().toLowerCase());
}

export function formatCLP(n) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

export function unitPrice(item, formatId = "celofan") {
  if (item.premium) return PREMIUM_PRICE;
  return (FORMATS[formatId] || FORMATS.celofan).price;
}

/**
 * Mezcla el catálogo local con las filas de Google Sheets.
 * Nunca pierde sabores: si una fila falta en la hoja, se usa el respaldo local.
 */
export function mergeRemoteStock(rows) {
  const byId = new Map(FLAVORS.map((f) => [f.id, f]));
  const byName = new Map(FLAVORS.map((f) => [slug(f.name), f]));
  const used = new Set();
  const merged = [];
  for (const row of rows || []) {
    const rowId = slug(row.id);
    if (DISCONTINUED_IDS.has(rowId)) continue;
    const local = byId.get(rowId) || byName.get(slug(row.nombre));
    if (!local || used.has(local.id)) continue;
    used.add(local.id);
    merged.push({
      ...local,
      available: sheetBoolean(row.disponible),
      topVentas: sheetBoolean(row.topVentas),
      order: Number(row.orden) || local.order,
      category: row.categoria ? canonicalCategory(row.categoria) : local.category,
    });
  }
  for (const f of FLAVORS) if (!used.has(f.id)) merged.push({ ...f, order: 1000 + f.order });
  return merged.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "es"));
}

function canonicalCategory(value) {
  const key = slug(value);
  return CATEGORY_ORDER.find((c) => slug(c) === key) || String(value).trim();
}

/** Devuelve { y, m, d, weekday, minutes } en la zona horaria del negocio. */
export function zonedNow(date = new Date(), timeZone = BUSINESS.timezone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short",
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  const hour = Number(parts.hour) % 24;
  return {
    y: Number(parts.year), m: Number(parts.month), d: Number(parts.day),
    weekday: weekdayIndex, minutes: hour * 60 + Number(parts.minute),
    iso: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** ¿Está Jorge en el campus ahora? + cuándo vuelve. */
export function campusStatus(date = new Date()) {
  const now = zonedNow(date);
  const today = SCHEDULE.find((s) => s.day === now.weekday);
  if (today && now.minutes >= toMinutes(today.open) && now.minutes < toMinutes(today.close)) {
    return { open: true, label: `En el campus ahora · hasta las ${today.close}`, closesAt: today.close };
  }
  const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  for (let i = 0; i < 8; i++) {
    const wd = (now.weekday + i) % 7;
    const s = SCHEDULE.find((x) => x.day === wd);
    if (!s) continue;
    if (i === 0 && now.minutes >= toMinutes(s.open)) continue;
    const when = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${days[wd]}`;
    return { open: false, label: `Vuelve ${when} a las ${s.open}`, nextDay: wd, opensAt: s.open };
  }
  return { open: false, label: "Fuera de horario" };
}

/** Lista de días reservables: [{ iso, label, slots: [...] }] */
export function reservableDays(date = new Date()) {
  const now = zonedNow(date);
  const base = Date.UTC(now.y, now.m - 1, now.d);
  const out = [];
  const fmt = new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" });
  for (let i = RESERVATION_RULES.minDaysAhead; i <= RESERVATION_RULES.maxDaysAhead; i++) {
    const d = new Date(base + i * 86400000);
    const wd = d.getUTCDay();
    const sched = SCHEDULE.find((s) => s.day === wd);
    if (!sched) continue;
    const slots = RESERVATION_RULES.slots.filter((slot) => {
      const m = toMinutes(slot);
      if (m < toMinutes(sched.open) || m >= toMinutes(sched.close)) return false;
      if (i === 0 && m < now.minutes + RESERVATION_RULES.minLeadMinutes) return false;
      return true;
    });
    if (!slots.length) continue;
    const iso = d.toISOString().slice(0, 10);
    const label = i === 0 ? "Hoy" : i === 1 ? "Mañana" : fmt.format(d);
    out.push({ iso, label: label.charAt(0).toUpperCase() + label.slice(1), long: fmt.format(d), slots });
  }
  return out;
}

export function reservationCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O ni 1/I
  const bytes = new Uint8Array(4);
  (globalThis.crypto || { getRandomValues: (a) => a.map(() => Math.floor(Math.random() * 256)) }).getRandomValues(bytes);
  return "MG-" + [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

/** Viernes: cuántas bolsas gratis corresponden y cuánto falta para la siguiente. */
export function fridayPromo(bags, date = new Date()) {
  const promo = PROMOS.find((p) => p.id === "friday");
  const active = zonedNow(date).weekday === promo.day;
  const group = promo.buy + promo.free;
  return { active, free: active ? Math.floor(bags / group) * promo.free : 0, toNext: group - (bags % group), group, promo };
}

export function isNewFlavor(f) {
  return Boolean(f.isNew || NEW_IDS.has(f.id));
}

export function whatsappLink(text) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}

/**
 * Valida y arma una reserva. `catalog` es el catálogo con stock vigente.
 * items: [{ id, qty }]
 */
export function buildReservation({ name, date, time, meetingPoint, format = "celofan", items, notes = "" }, catalog, now = new Date()) {
  const errors = [];
  const cleanName = String(name || "").trim().slice(0, 60);
  if (!cleanName) errors.push("Falta el nombre de quien retira.");
  const day = reservableDays(now).find((d) => d.iso === date);
  if (!day) errors.push("Ese día no está disponible para reservas (máximo 4 días, de lunes a viernes).");
  else if (!day.slots.includes(time)) errors.push(`Ese horario no está disponible. Horarios libres ese día: ${day.slots.join(", ")}.`);
  if (!FORMATS[format]) errors.push("Formato de empaque inválido.");

  const all = new Map([...catalog, ...JAPANESE].map((f) => [f.id, f]));
  const lines = [];
  const unavailable = [];
  let bags = 0;
  for (const it of items || []) {
    const f = all.get(it.id) || [...all.values()].find((x) => slug(x.name) === slug(it.id));
    const qty = Math.max(0, Math.min(99, Math.floor(Number(it.qty) || 0)));
    if (!f || !qty) continue;
    if (!f.available) { unavailable.push(f.name); continue; }
    const price = unitPrice(f, format);
    lines.push({ id: f.id, name: f.name, qty, price, subtotal: price * qty });
    bags += qty;
  }
  if (unavailable.length) errors.push(`Agotado por ahora: ${unavailable.join(", ")}.`);
  if (!lines.length) errors.push("Agrega al menos un sabor disponible.");
  if (bags > RESERVATION_RULES.maxBagsPerReservation) errors.push(`Para más de ${RESERVATION_RULES.maxBagsPerReservation} bolsas escríbenos directo por WhatsApp.`);

  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  const code = reservationCode();
  const point = String(meetingPoint || RESERVATION_RULES.meetingPoints[0]).slice(0, 60);
  const message = [
    `*Reserva MANI-GANTE* · ${code}`,
    ``,
    `👤 ${cleanName}`,
    `📅 ${day ? day.long : date} · ${time}`,
    `📍 ${point} (INACAP Temuco)`,
    `📦 ${FORMATS[format]?.name || ""}`,
    ``,
    ...lines.map((l) => `▪ ${l.name} x${l.qty} (${formatCLP(l.price)} c/u)`),
    ``,
    `*Total: ${formatCLP(total)}* · ${bags} bolsa${bags === 1 ? "" : "s"}`,
    notes ? `📝 ${String(notes).slice(0, 200)}\n` : null,
    `Pago: transferencia o Mercado Pago. Adjunto comprobante 👇`,
  ].filter((l) => l !== null).join("\n");

  return {
    ok: errors.length === 0,
    errors,
    reservation: { code, name: cleanName, date, dateLabel: day?.long, time, meetingPoint: point, format, lines, bags, total },
    message,
    whatsappUrl: whatsappLink(message),
  };
}

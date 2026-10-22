// Generador de la presentación "Sound Travel" (GTD404 · Unidad 2)
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const fa = require("react-icons/fa");
const { applyTheme } = require("/root/.claude/skills/synced/5e951861-5eb9-41df-a4a1-28787186dd05_e13695f2-4112-4c70-809e-8c959e3dcbec/pptx/scripts/apply_theme.js");

const OUT = process.argv[2] || path.join(__dirname, "Sound_Travel_Presentacion.pptx");
const IMG = path.join(__dirname, "img");

// ---------- Tema ----------
const HEX = {
  bg: "0B0F1E", panel: "151B36", white: "FFFFFF", muted: "A5ADCF",
  violet: "8B5CF6", blue: "38BDF8", blueD: "2563EB", amber: "F59E0B", green: "34D399", lilac: "C4B5FD",
  panel2: "1C2447", line: "2E3766", ink: "0B0F1E",
};
const THEME = {
  name: "Sound Travel Noche",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.bg, lt1: HEX.white, dk2: HEX.panel, lt2: HEX.muted,
    accent1: HEX.violet, accent2: HEX.blue, accent3: HEX.blueD, accent4: HEX.amber, accent5: HEX.green, accent6: HEX.lilac,
    hlink: HEX.blue, folHlink: HEX.lilac,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Sound Travel · Plan de coordinación y operaciones";
pres.subject = "Coordinación en Operaciones Turísticas (GTD404) · Unidad 2";
pres.author = "Equipo Sound Travel · INACAP Temuco";
pres.company = "INACAP Sede Temuco";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const K = {
  bg: C.text1, panel: C.text2, white: C.background1, muted: C.background2,
  violet: C.accent1, blue: C.accent2, blueD: C.accent3, amber: C.accent4, green: C.accent5, lilac: C.accent6,
  panel2: HEX.panel2, line: HEX.line,
};
const W = 13.333, H = 7.5;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "ST_PORTADA",
  background: { color: K.bg },
  objects: [],
});
pres.defineSlideMaster({
  title: "ST_CONTENIDO",
  background: { color: K.bg },
  margin: [0.5, 0.6, 0.6, 0.6],
  objects: [
    { text: { text: "SOUND TRAVEL  ·  Coordinación en Operaciones Turísticas (GTD404)  ·  INACAP Sede Temuco",
      options: { x: 0.6, y: 7.04, w: 9, h: 0.28, fontSize: 9, color: K.muted, margin: 0, fontFace: "Calibri" } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.6, w: 10.3, h: 0.72, fontSize: 28, bold: true,
      color: K.white, fontFace: "Arial", valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 12.15, y: 7.02, w: 0.6, h: 0.3, fontSize: 10, color: K.muted, align: "right", fontFace: "Calibri" },
});

// ---------- Utilidades ----------
const iconCache = {};
async function icon(name, color = HEX.white, px = 256) {
  const key = name + color + px;
  if (iconCache[key]) return iconCache[key];
  const Comp = fa[name];
  if (!Comp) throw new Error("icono no encontrado: " + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: px }));
  const buf = await sharp(Buffer.from(svg)).resize(px, px, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}
async function photo(id, w, h, opts = {}) {
  const file = path.join(IMG, id + ".jpg");
  let img = sharp(file).resize(Math.round(w * 150), Math.round(h * 150), { fit: "cover", position: opts.position || "centre" });
  if (opts.brightness) img = img.modulate({ brightness: opts.brightness });
  const buf = await img.jpeg({ quality: 80 }).toBuffer();
  return "image/jpeg;base64," + buf.toString("base64");
}
const sh = () => ({ type: "outer", color: "000000", opacity: 0.35, blur: 8, offset: 3, angle: 90 });

function content(sectionTitle, title, kicker, speaker) {
  const s = pres.addSlide({ masterName: "ST_CONTENIDO", sectionTitle });
  s.addText(title, { placeholder: "title" });
  s.addText(kicker, { x: 0.6, y: 0.28, w: 9.5, h: 0.3, fontSize: 11, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true, objectName: "Kicker" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 11.05, y: 0.3, w: 1.68, h: 0.36, rectRadius: 0.18, fill: { color: K.violet }, line: { color: K.violet }, objectName: "Insignia expositor" });
  s.addText("INTEGRANTE " + speaker, { x: 11.05, y: 0.3, w: 1.68, h: 0.36, fontSize: 10.5, bold: true, color: K.white, align: "center", valign: "middle", margin: 0, charSpacing: 1, isTextBox: true });
  return s;
}
function source(s, text, y = 6.68) {
  s.addText(text, { x: 0.6, y, w: 12.1, h: 0.26, fontSize: 9.5, italic: true, color: K.muted, margin: 0, isTextBox: true, objectName: "Fuente" });
}
function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: opts.r ?? 0.12, fill: { color: opts.fill || K.panel, transparency: opts.transparency || 0 },
    line: { color: opts.line || K.line, width: opts.lineW ?? 0.75 }, shadow: opts.shadow === false ? undefined : sh(), objectName: opts.name || "Tarjeta" });
}
async function iconCircle(s, name, x, y, d, fill = K.violet, color = HEX.white) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: "Círculo ícono" });
  const p = d * 0.25;
  s.addImage({ data: await icon(name, color), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, altText: name });
}
function tag(s, text, x, y, w, color = K.amber, txt = K.bg) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.3, rectRadius: 0.15, fill: { color }, line: { color }, objectName: "Etiqueta" });
  s.addText(text, { x, y, w, h: 0.3, fontSize: 9.5, bold: true, color: txt, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
function line(s, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.color || K.muted, width: o.width || 1.5, dashType: o.dash || "solid", beginArrowType: o.begin, endArrowType: o.end },
    objectName: o.name || "Conector",
  });
}
const T = (text, o = {}) => ({ text, options: o });

(async () => {
  // =====================================================================
  // INTEGRANTE 1
  // =====================================================================
  pres.addSection({ title: "Integrante 1 · Contexto y Sound Travel" });

  // 1. Portada
  {
    const s = pres.addSlide({ masterName: "ST_PORTADA", sectionTitle: "Integrante 1 · Contexto y Sound Travel" });
    s.addImage({ data: await photo("1506157786151-b8491531f063", W, H), x: 0, y: 0, w: W, h: H, altText: "Escenario de concierto con luces violetas (imagen referencial)" });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: K.bg, transparency: 25 }, line: { color: K.bg, transparency: 100 }, objectName: "Velo" });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 7.6, h: H, fill: { color: K.bg, transparency: 12 }, line: { color: K.bg, transparency: 100 }, objectName: "Panel portada" });
    s.addText("INACAP SEDE TEMUCO  ·  ÁREA DE TURISMO  ·  GESTIÓN TURÍSTICA", { x: 0.7, y: 0.75, w: 6.8, h: 0.3, fontSize: 11, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText("SOUND TRAVEL", { x: 0.7, y: 1.35, w: 6.8, h: 1.0, fontSize: 54, bold: true, color: K.white, fontFace: "Arial", charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("Plan de coordinación y operaciones para traslados y asistencia en eventos masivos en la Región de La Araucanía", { x: 0.7, y: 2.4, w: 6.4, h: 1.0, fontSize: 18, color: K.lilac, margin: 0, isTextBox: true, valign: "top" });
    s.addText([
      T("Coordinación en Operaciones Turísticas (GTD404) · Sección 122", { breakLine: true }),
      T("Unidad 2: Acciones operativas en empresas de turismo", { breakLine: true }),
      T("Docente: Evelyn Rios Soto"),
    ], { x: 0.7, y: 3.75, w: 6.4, h: 1.0, fontSize: 14, color: K.white, margin: 0, isTextBox: true, paraSpaceAfter: 3 });
    // Integrantes
    for (let i = 0; i < 4; i++) {
      const x = 0.7 + i * 1.6;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.15, w: 1.48, h: 0.62, rectRadius: 0.1, fill: { color: K.panel, transparency: 10 }, line: { color: K.violet, width: 1 }, objectName: "Integrante" });
      s.addText([T("INTEGRANTE " + (i + 1), { fontSize: 9, bold: true, color: K.blue, breakLine: true }), T("Nombre Apellido", { fontSize: 11, color: K.white })],
        { x, y: 5.15, w: 1.48, h: 0.62, align: "center", valign: "middle", margin: 0, isTextBox: true });
    }
    s.addText("Empresa ficticia creada con fines académicos (Opción 2 de la guía de aprendizaje)", { x: 0.7, y: 6.15, w: 6.6, h: 0.3, fontSize: 11, italic: true, color: K.muted, margin: 0, isTextBox: true });
    s.addText("Imagen referencial · Unsplash", { x: 10.6, y: 7.1, w: 2.5, h: 0.25, fontSize: 9, color: K.muted, align: "right", margin: 0, isTextBox: true });
    s.addNotes("INTEGRANTE 1 (≈0:20). Saludo, presentación del equipo y del tema. Aclarar desde el inicio que Sound Travel es una empresa creada para la asignatura (Opción 2 de la guía).");
  }

  // 2. Problema y respuesta
  {
    const s = content("Integrante 1 · Contexto y Sound Travel", "El problema y nuestra respuesta: Sound Travel", "INTEGRANTE 1  ·  CRITERIO 2.1.1  ·  CONTEXTO, IDENTIFICACIÓN, JUSTIFICACIÓN Y LOCALIZACIÓN", 1);
    // Izquierda: contexto
    card(s, 0.6, 1.6, 5.95, 1.0, { fill: K.panel2, shadow: false });
    s.addText("3,6 M", { x: 0.8, y: 1.6, w: 1.75, h: 1.0, fontSize: 34, bold: true, color: K.white, fontFace: "Arial", valign: "middle", margin: 0, isTextBox: true });
    s.addText("visitantes internacionales en Chile en 2023, más un fuerte flujo nacional entre regiones para ver espectáculos en vivo", { x: 2.6, y: 1.6, w: 3.8, h: 1.0, fontSize: 12, color: K.white, valign: "middle", margin: 0, isTextBox: true });
    s.addText("En cada evento masivo de Temuco y la zona lacustre:", { x: 0.6, y: 2.78, w: 5.95, h: 0.32, fontSize: 14, bold: true, color: K.lilac, margin: 0, isTextBox: true });
    const rows = [
      ["FaBus", "El transporte público deja de circular temprano", "el regreso nocturno queda sin alternativa formal"],
      ["FaParking", "Los estacionamientos colapsan", "Estadio Germán Becker, Isla Cautín, Villarrica y Pucón"],
      ["FaArrowUp", "Las apps de transporte suben sus tarifas", "costo alto y espera incierta al salir del show"],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 3.2 + i * 0.68;
      await iconCircle(s, rows[i][0], 0.6, y + 0.03, 0.52, K.violet);
      s.addText([T(rows[i][1], { bold: true, color: K.white, fontSize: 13, breakLine: true }), T(rows[i][2], { color: K.muted, fontSize: 11.5 })],
        { x: 1.3, y, w: 5.25, h: 0.6, margin: 0, valign: "middle", isTextBox: true });
    }
    card(s, 0.6, 5.35, 5.95, 1.2, { fill: K.panel2, line: K.amber, shadow: false });
    tag(s, "ESCENARIO PROYECTADO", 0.8, 5.47, 2.2);
    s.addText("Festival Internacional de Temuco (feb. 2027): lo usamos para planificar, pero no encontramos confirmación oficial del evento.",
      { x: 0.8, y: 5.82, w: 5.6, h: 0.65, fontSize: 11.5, color: K.white, margin: 0, valign: "top", isTextBox: true });
    // Derecha: Sound Travel + mapa
    card(s, 6.8, 1.6, 5.9, 1.55);
    await iconCircle(s, "FaLightbulb", 7.0, 1.82, 0.6, K.violet);
    s.addText([
      T("Agencia de turismo de eventos con casa matriz en Temuco ", { bold: true, color: K.white, fontSize: 13 }),
      T("(empresa creada: Opción 2 de la guía). ", { color: K.lilac, fontSize: 12 }),
      T("Se justifica porque no existe una solución que integre ir y volver seguro con la entrada y la comida.", { color: K.muted, fontSize: 12 }),
    ], { x: 7.8, y: 1.68, w: 4.75, h: 1.4, margin: 0, valign: "middle", isTextBox: true });
    const mx = 6.8, my = 3.3, mw = 5.9, mh = 3.25;
    card(s, mx, my, mw, mh, { fill: K.panel2 });
    s.addText("LOCALIZACIÓN Y RUTAS", { x: mx + 0.25, y: my + 0.15, w: 3.0, h: 0.28, fontSize: 10.5, bold: true, color: K.blue, charSpacing: 1, margin: 0, isTextBox: true });
    const nodes = { temuco: [mx + 2.2, my + 1.6], plc: [mx + 2.6, my + 2.15], lautaro: [mx + 2.0, my + 0.9], villarrica: [mx + 3.7, my + 2.55], pucon: [mx + 4.85, my + 2.35] };
    line(s, mx + 2.1, my + 1.42, mx + 4.1, my + 0.45, { color: K.violet, dash: "dash", end: "triangle", width: 1.75 });
    line(s, mx + 2.3, my + 1.42, mx + 4.6, my + 0.95, { color: K.violet, dash: "dash", end: "triangle", width: 1.75 });
    s.addText("Concepción", { x: mx + 4.15, y: my + 0.3, w: 1.6, h: 0.25, fontSize: 10.5, bold: true, color: K.lilac, margin: 0, isTextBox: true });
    s.addText("Santiago", { x: mx + 4.65, y: my + 0.82, w: 1.2, h: 0.25, fontSize: 10.5, bold: true, color: K.lilac, margin: 0, isTextBox: true });
    for (const k of ["plc", "lautaro", "villarrica", "pucon"]) line(s, nodes.temuco[0], nodes.temuco[1], nodes[k][0], nodes[k][1], { color: K.blue, width: 2 });
    line(s, nodes.villarrica[0], nodes.villarrica[1], nodes.pucon[0], nodes.pucon[1], { color: K.blue, width: 2 });
    const labels = { plc: ["Padre Las Casas", -1.75, -0.02, "right"], lautaro: ["Lautaro", -1.75, -0.13, "right"], villarrica: ["Villarrica", -0.5, 0.15, "left"], pucon: ["Pucón", -0.2, 0.15, "left"] };
    for (const k of Object.keys(labels)) {
      const [x, y] = nodes[k];
      s.addShape(pres.shapes.OVAL, { x: x - 0.1, y: y - 0.1, w: 0.2, h: 0.2, fill: { color: K.blue }, line: { color: K.white, width: 1 }, objectName: "Nodo " + labels[k][0] });
      s.addText(labels[k][0], { x: x + labels[k][1], y: y + labels[k][2], w: 1.6, h: 0.25, fontSize: 10.5, color: K.white, margin: 0, align: labels[k][3], isTextBox: true });
    }
    const [tx, ty] = nodes.temuco;
    s.addShape(pres.shapes.OVAL, { x: tx - 0.25, y: ty - 0.25, w: 0.5, h: 0.5, fill: { color: K.violet }, line: { color: K.white, width: 1.5 }, objectName: "Nodo Temuco" });
    s.addImage({ data: await icon("FaMapMarkerAlt"), x: tx - 0.12, y: ty - 0.13, w: 0.24, h: 0.24 });
    s.addText([T("Temuco", { bold: true, fontSize: 12, color: K.white, breakLine: true }), T("Casa matriz", { fontSize: 10, color: K.lilac })],
      { x: tx - 1.7, y: ty - 0.27, w: 1.35, h: 0.5, align: "right", margin: 0, isTextBox: true });
    s.addShape(pres.shapes.LINE, { x: mx + 0.25, y: my + 3.0, w: 0.35, h: 0, line: { color: K.blue, width: 2 } });
    s.addText("Rutas regionales", { x: mx + 0.68, y: my + 2.88, w: 1.5, h: 0.24, fontSize: 10, color: K.muted, margin: 0, isTextBox: true });
    s.addShape(pres.shapes.LINE, { x: mx + 2.2, y: my + 3.0, w: 0.35, h: 0, line: { color: K.violet, width: 2, dashType: "dash" } });
    s.addText("Viajes especiales a conciertos", { x: mx + 2.63, y: my + 2.88, w: 2.6, h: 0.24, fontSize: 10, color: K.muted, margin: 0, isTextBox: true });
    source(s, "Fuentes: Subsecretaría de Turismo (2024), citada en la guía GTD404 · Informe Operativo Sound Travel (2026), secc. 1, 2 y 2.1. Mapa referencial, no a escala.");
    s.addNotes("INTEGRANTE 1 (≈1:00). Problema → respuesta. Recalcar que el festival 2027 es un escenario proyectado.");
  }

  // 3. Identidad y propuesta de valor
  {
    const s = content("Integrante 1 · Contexto y Sound Travel", "Identidad y propuesta de valor", "INTEGRANTE 1  ·  CRITERIO 2.1.1  ·  MISIÓN, VISIÓN, PÚBLICO OBJETIVO Y SERVICIOS", 1);
    const mv = [
      ["MISIÓN", "Ofrecer traslado y actividades complementarias para asistentes a festivales, conciertos y eventos dentro y fuera de La Araucanía, garantizando seguridad, comodidad y un viaje bien planificado."],
      ["VISIÓN", "Ser una agencia reconocida en el sur de Chile para el turismo de eventos y entretenimiento, destacando por su buena organización y calidad de servicio."],
    ];
    for (let i = 0; i < 2; i++) {
      const x = 0.6 + i * 6.15;
      card(s, x, 1.6, 5.95, 1.5);
      s.addText(mv[i][0], { x: x + 0.25, y: 1.72, w: 2, h: 0.28, fontSize: 11.5, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
      s.addText(mv[i][1], { x: x + 0.25, y: 2.02, w: 5.5, h: 1.0, fontSize: 12.5, color: K.white, margin: 0, valign: "top", isTextBox: true });
    }
    // Público
    card(s, 0.6, 3.3, 5.95, 3.25, { fill: K.panel2 });
    s.addText("PÚBLICO OBJETIVO", { x: 0.85, y: 3.42, w: 4, h: 0.28, fontSize: 11.5, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const pf = [
      ["FaHeadphones", "18 a 35 años aprox.", "Amantes de la música y los festivales; buscan una experiencia completa, segura y sin complicaciones de transporte."],
      ["FaGlassCheers", "Hasta 45 años aprox.", "Amigos o parejas de intereses especiales y culturales; panoramas de fin de semana, sunset en la zona lacustre y buena gastronomía local."],
    ];
    for (let i = 0; i < 2; i++) {
      const y = 3.85 + i * 1.32;
      await iconCircle(s, pf[i][0], 0.85, y + 0.08, 0.6, K.violet);
      s.addText([T(pf[i][1], { bold: true, fontSize: 13.5, color: K.white, breakLine: true }), T(pf[i][2], { fontSize: 12, color: K.muted })],
        { x: 1.65, y, w: 4.75, h: 1.2, margin: 0, valign: "top", isTextBox: true });
    }
    // Pack
    card(s, 6.75, 3.3, 5.95, 3.25);
    s.addText("PACK SOUND TRAVEL", { x: 7.0, y: 3.42, w: 4, h: 0.28, fontSize: 11.5, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const comp = [
      ["FaShuttleVan", "Traslado ida y vuelta", "Minibuses y vans de 15 a 30 pasajeros"],
      ["FaTicketAlt", "Entrada asegurada", "Ticketeras oficiales: sin estafas ni reventa"],
      ["FaUserFriends", "Asistencia de guía", "Lista, pulsera y acompañamiento"],
      ["FaUtensils", "Paradas gastronómicas", "Locales de Temuco y zona lacustre"],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 7.0 + (i % 2) * 2.85, y = 3.85 + Math.floor(i / 2) * 1.0;
      await iconCircle(s, comp[i][0], x, y + 0.05, 0.5, K.violet);
      s.addText([T(comp[i][1], { bold: true, fontSize: 12.5, color: K.white, breakLine: true }), T(comp[i][2], { fontSize: 10.5, color: K.muted })],
        { x: x + 0.6, y, w: 2.15, h: 0.85, margin: 0, valign: "top", isTextBox: true });
    }
    s.addText("“Llegar puntual, disfrutar tranquilo y volver seguro”  ·  Pack Evento · Sunset · Viajes a Concepción y Santiago",
      { x: 7.0, y: 5.85, w: 5.5, h: 0.6, fontSize: 11.5, italic: true, bold: true, color: K.lilac, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 2.1 y 4. El informe no define precios ni volumen de ventas.");
    s.addNotes("INTEGRANTE 1 (≈0:50). Relacionar misión y perfiles con el pack. Dar paso al Integrante 2.");
  }

  // =====================================================================
  // INTEGRANTE 2
  // =====================================================================
  const SEC2 = "Integrante 2 · Estructura y procesos";
  pres.addSection({ title: SEC2 });

  // 4. Organigrama + RR. HH.
  {
    const s = content(SEC2, "Estructura organizacional y recurso humano", "INTEGRANTE 2  ·  CRITERIO 2.1.1  ·  ORGANIGRAMA JERÁRQUICO, ÁREAS Y CARGOS", 2);
    const box = async (x, y, w, h, title, cargo, duties, ic, hi) => {
      card(s, x, y, w, h, hi ? { fill: K.violet, line: K.violet } : {});
      await iconCircle(s, ic, x + 0.18, y + 0.18, 0.52, hi ? K.bg : K.violet, hi ? HEX.lilac : HEX.white);
      s.addText([T(title, { bold: true, fontSize: 13, color: K.white, breakLine: true }), T(cargo, { fontSize: 11, bold: true, color: hi ? K.white : K.blue })],
        { x: x + 0.82, y: y + 0.12, w: w - 0.95, h: 0.65, margin: 0, valign: "middle", isTextBox: true });
      s.addText(duties, { x: x + 0.18, y: y + 0.85, w: w - 0.32, h: h - 0.92, fontSize: 11, color: hi ? K.white : K.muted, margin: 0, valign: "top", isTextBox: true });
    };
    line(s, 6.665, 2.85, 6.665, 3.1, { width: 1.75 });
    line(s, 2.525, 3.1, 10.805, 3.1, { width: 1.75 });
    for (const x of [2.525, 6.665, 10.805]) line(s, x, 3.1, x, 3.3, { width: 1.75 });
    line(s, 2.525, 5.05, 2.525, 5.25, { width: 1.75 });
    await box(4.3, 1.55, 4.73, 1.3, "DIRECCIÓN GENERAL", "Gerente General", "Planificación, alianzas con instituciones y productoras, y control del cumplimiento normativo.", "FaUserTie", true);
    await box(0.6, 3.3, 3.85, 1.75, "Operaciones y Logística", "Jefe de Operaciones", "Rutas y tiempos de viaje, documentos y mantención de minibuses, planes de contingencia.", "FaCogs");
    await box(4.74, 3.3, 3.85, 1.75, "Comercial y Atención", "Ventas / Community Manager", "Consultas en redes, reservas de paquetes y contenido en Instagram y TikTok.", "FaBullhorn");
    await box(8.88, 3.3, 3.85, 1.75, "Administración y Finanzas", "Contador / Administrativo", "Contabilidad, boletas y facturas, presupuesto por salida y pagos a proveedores.", "FaCalculator");
    await box(0.6, 5.25, 3.85, 1.35, "Equipo de Terreno", "Guías y conductores", "Lista y pulseras al subir, acompañamiento al recinto, conducción prudente.", "FaRoute");
    card(s, 4.74, 5.25, 7.99, 1.35, { fill: K.panel2, shadow: false });
    s.addText([
      T("Cómo se lee: ", { bold: true, color: K.lilac }),
      T("5 cargos en una estructura simple y vertical. El Equipo de Terreno depende de Operaciones, así quien planifica las rutas coordina directamente a quienes acompañan a los pasajeros.", { color: K.white }),
    ], { x: 4.95, y: 5.25, w: 7.6, h: 1.35, fontSize: 12.5, valign: "middle", margin: 0, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3 (Figura 1) y 3.1. Rediseño gráfico de elaboración propia.");
    s.addNotes("INTEGRANTE 2 (≈0:45). Organigrama de arriba hacia abajo, con la función de cada cargo.");
  }

  // 5. Funcional + procesos
  {
    const s = content(SEC2, "Organigrama funcional y procesos internos y externos", "INTEGRANTE 2  ·  CRITERIO 2.1.1  ·  FUNCIONES Y CONEXIÓN CON EL ENTORNO", 2);
    s.addText("ORGANIGRAMA FUNCIONAL · 4 FUNCIONES", { x: 0.6, y: 1.55, w: 6.0, h: 0.28, fontSize: 11.5, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const f = [
      ["FaChessKing", "Directiva", "Dirección General", "Plan anual según calendario de conciertos, gestión de convenios (propuestos) y control legal."],
      ["FaTools", "Operativa", "Operaciones y Terreno", "Rutas y puntos de encuentro, chequeo de minibuses, embarque y acompañamiento."],
      ["FaShoppingCart", "Comercial", "Comercial y Ventas", "Campañas del “Pack Evento”, cotizaciones por WhatsApp, ventas y vouchers."],
      ["FaFileInvoiceDollar", "Administrativa", "Administración y Finanzas", "Pagos de reservas, liquidación de convenios B2B y balance por evento."],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + (i % 2) * 3.05, y = 1.95 + Math.floor(i / 2) * 2.35, w = 2.9, h = 2.2;
      card(s, x, y, w, h);
      await iconCircle(s, f[i][0], x + 0.18, y + 0.18, 0.5, K.violet);
      s.addText([T(f[i][1], { bold: true, fontSize: 13.5, color: K.white, breakLine: true }), T(f[i][2], { fontSize: 10.5, bold: true, color: K.blue })],
        { x: x + 0.78, y: y + 0.12, w: w - 0.9, h: 0.62, margin: 0, valign: "middle", isTextBox: true });
      s.addText(f[i][3], { x: x + 0.18, y: y + 0.85, w: w - 0.32, h: 1.25, fontSize: 11.5, color: K.muted, margin: 0, valign: "top", isTextBox: true });
    }
    // Procesos
    card(s, 6.85, 1.55, 5.85, 2.35);
    s.addText("PROCESOS INTERNOS", { x: 7.1, y: 1.68, w: 5, h: 0.28, fontSize: 11.5, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText([
      T("Planificación de rutas, tiempos y puntos de encuentro", { bullet: true, breakLine: true }),
      T("Revisión de documentos y mantención de minibuses", { bullet: true, breakLine: true }),
      T("Reservas, nómina de pasajeros y vouchers", { bullet: true, breakLine: true }),
      T("Presupuesto, pagos y balance por evento", { bullet: true, breakLine: true }),
      T("Embarque, acompañamiento y retorno del grupo", { bullet: true }),
    ], { x: 7.1, y: 2.02, w: 5.45, h: 1.8, fontSize: 12, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 2, isTextBox: true });
    s.addShape(pres.shapes.UP_DOWN_ARROW, { x: 9.55, y: 3.93, w: 0.45, h: 0.5, fill: { color: K.violet }, line: { color: K.violet }, objectName: "Flecha" });
    card(s, 6.85, 4.45, 5.85, 2.1, { fill: K.panel2 });
    s.addText("PROCESOS EXTERNOS · TRES FRENTES", { x: 7.1, y: 4.57, w: 5, h: 0.28, fontSize: 11.5, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const ext = [
      ["FaHandshake", "Proveedores:", " transporte, restaurantes y ticketeras"],
      ["FaLandmark", "Alianzas:", " Municipalidad, SERNATUR, seguridad y Carabineros"],
      ["FaComments", "Clientes:", " venta B2C por Instagram, TikTok, web y WhatsApp"],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 4.95 + i * 0.5;
      await iconCircle(s, ext[i][0], 7.1, y, 0.4, K.violet);
      s.addText([T(ext[i][1], { bold: true, color: K.white }), T(ext[i][2], { color: K.muted })], { x: 7.62, y, w: 4.95, h: 0.4, fontSize: 12, margin: 0, valign: "middle", isTextBox: true });
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3.2 y 4. Los convenios institucionales son una propuesta (empresa ficticia).");
    s.addNotes("INTEGRANTE 2 (≈0:40). Jerárquico = quién depende de quién; funcional = qué función cumple. Lo interno y lo externo se retroalimentan.");
  }
  // 11. Diagrama de flujo
  {
    const s = content(SEC2, "Diagrama de flujo del servicio en cinco etapas", "INTEGRANTE 2  ·  CRITERIO 2.1.1  ·  MAPA DE PROCESOS EN CINCO ETAPAS", 2);
    const st = [
      ["FaBullhorn", "Difusión y marketing", "“Pack Evento” en Instagram y TikTok", "Comercial", "Externo"],
      ["FaComments", "Consulta, cotización y venta", "Web y WhatsApp; envío de voucher", "Comercial · Administración", "Externo"],
      ["FaClipboardList", "Coordinación logística interna", "Se bloquean asientos, comidas y entradas", "Operaciones · Administración", "Interno + proveedores"],
      ["FaShuttleVan", "Traslado y acompañamiento", "Embarque, ruta y acceso al recinto", "Guías y conductores", "Terreno"],
      ["FaHome", "Retorno seguro y evaluación", "Regreso a Temuco y encuesta de calidad", "Terreno · (encuesta*)", "Cierre"],
    ];
    const phases = [["CAPTACIÓN", 0, 2], ["PREPARACIÓN", 2, 1], ["EJECUCIÓN", 3, 1], ["CIERRE", 4, 1]];
    const x0 = 0.6, cw = 2.3, gap = 0.15;
    for (const [p, i0, n] of phases) {
      const x = x0 + i0 * (cw + gap), w = n * cw + (n - 1) * gap;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.55, w, h: 0.34, rectRadius: 0.17, fill: { color: K.panel2 }, line: { color: K.line }, objectName: "Fase" });
      s.addText(p, { x, y: 1.55, w, h: 0.34, fontSize: 10.5, bold: true, color: K.lilac, align: "center", valign: "middle", charSpacing: 2, margin: 0, isTextBox: true });
    }
    for (let i = 0; i < 5; i++) {
      const x = x0 + i * (cw + gap), y = 2.05;
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y, w: cw, h: 0.85, fill: { color: i % 2 ? K.blueD : K.violet }, line: { color: K.bg, width: 0 }, objectName: "Etapa " + (i + 1) });
      s.addText("ETAPA " + (i + 1), { x: x + (i ? 0.35 : 0.15), y, w: cw - 0.7, h: 0.85, fontSize: 14, bold: true, color: K.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      card(s, x, 3.1, cw, 3.0);
      await iconCircle(s, st[i][0], x + 0.2, 3.28, 0.55, K.panel2, HEX.blue);
      s.addText(st[i][1], { x: x + 0.2, y: 3.95, w: cw - 0.35, h: 0.62, fontSize: 14, bold: true, color: K.white, margin: 0, valign: "top", isTextBox: true });
      s.addText(st[i][2], { x: x + 0.2, y: 4.6, w: cw - 0.35, h: 0.6, fontSize: 12, color: K.muted, margin: 0, valign: "top", isTextBox: true });
      s.addText([T("Responsable", { fontSize: 10, color: K.blue, bold: true, breakLine: true }), T(st[i][3], { fontSize: 11.5, color: K.white })],
        { x: x + 0.2, y: 5.25, w: cw - 0.35, h: 0.7, margin: 0, valign: "top", isTextBox: true });
    }
    // Retroalimentación
    line(s, 11.25, 6.1, 11.25, 6.38, { color: K.green, width: 1.75 });
    line(s, 11.25, 6.38, 1.75, 6.38, { color: K.green, width: 1.75 });
    line(s, 1.75, 6.38, 1.75, 6.1, { color: K.green, width: 1.75, end: "triangle" });
    s.addText("Mejora continua: la encuesta post-evento retroalimenta las próximas salidas", { x: 3.2, y: 6.2, w: 6.9, h: 0.3, fontSize: 11, bold: true, color: K.green, align: "center", margin: 0, fill: { color: K.bg }, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 4.1, Figura 2. Responsables deducidos de las secc. 3.1 y 6.1. *El informe no asigna responsable a la encuesta.", 6.72);
    s.addNotes("INTEGRANTE 2 (≈0:45). Recorrer las cinco etapas y cerrar con la retroalimentación. Transición al Integrante 3: «en la etapa 3 aparecen actores externos; mi compañero/a explica cómo se coordinan».");
  }

  // =====================================================================
  // INTEGRANTE 3
  // =====================================================================
  const SEC3 = "Integrante 3 · Actores y coordinación";
  pres.addSection({ title: SEC3 });
  // 13. Mapa de relaciones
  {
    const s = content(SEC3, "Actores y mapa de relaciones funcionales", "INTEGRANTE 3  ·  CRITERIO 2.1.2  ·  IDENTIFICACIÓN DE ACTORES Y TIPO DE VÍNCULO", 3);
    const cx = 6.665, cy = 3.85;
    const N = [
      ["FaShuttleVan", "Transporte terrestre", "Proveedor privado", 1.25, 2.15, "Contratación B2B", "c"],
      ["FaTicketAlt", "Ticketeras y productoras", "Aliado comercial", 10.05, 2.15, "Alianza comercial", "c"],
      ["FaUtensils", "Locales gastronómicos", "Proveedor privado", 1.25, 4.95, "Convenio de alimentación", "c"],
      ["FaLandmark", "Municipio / SERNATUR", "Actor público", 10.05, 4.95, "Coordinación institucional", "i"],
      ["FaShieldAlt", "Seguridad local", "Seg. municipal y Carabineros", 5.6, 1.45, "Información y resguardo", "i"],
      ["FaUsers", "Clientes / asistentes", "Demanda", 5.6, 5.5, "Compra + información", "c"],
    ];
    const bw = 2.15, bh = 0.85;
    for (const [ic, t, sub, x, y, rel, kind] of N) {
      const ax = x + bw / 2, ay = y + bh / 2;
      line(s, cx, cy, ax, ay, { color: kind === "c" ? K.violet : K.blue, width: 2.25, dash: kind === "c" ? "solid" : "dash", begin: "triangle", end: "triangle" });
    }
    for (const [ic, t, sub, x, y, rel, kind] of N) {
      const ax = x + bw / 2, ay = y + bh / 2;
      const lx = (cx + ax) / 2, ly = (cy + ay) / 2;
      const lw = 1.95;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: lx - lw / 2, y: ly - 0.16, w: lw, h: 0.32, rectRadius: 0.16, fill: { color: K.bg }, line: { color: kind === "c" ? K.violet : K.blue, width: 1 }, objectName: "Etiqueta relación" });
      s.addText(rel, { x: lx - lw / 2, y: ly - 0.16, w: lw, h: 0.32, fontSize: 10, bold: true, color: K.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
    }
    for (const [ic, t, sub, x, y] of N) {
      card(s, x, y, bw, bh);
      await iconCircle(s, ic, x + 0.12, y + 0.17, 0.5, K.panel2, HEX.blue);
      s.addText([T(t, { bold: true, fontSize: 11.5, color: K.white, breakLine: true }), T(sub, { fontSize: 10, color: K.muted })],
        { x: x + 0.68, y, w: bw - 0.75, h: bh, margin: 0, valign: "middle", isTextBox: true });
    }
    s.addShape(pres.shapes.OVAL, { x: cx - 1.05, y: cy - 0.75, w: 2.1, h: 1.5, fill: { color: K.violet }, line: { color: K.lilac, width: 2 }, shadow: sh(), objectName: "Sound Travel centro" });
    s.addText([T("SOUND TRAVEL", { bold: true, fontSize: 14, color: K.white, breakLine: true }), T("Coordinador central del servicio", { fontSize: 10, color: K.white })],
      { x: cx - 1.05, y: cy - 0.75, w: 2.1, h: 1.5, align: "center", valign: "middle", margin: 0, isTextBox: true });
    // Leyenda
    s.addShape(pres.shapes.LINE, { x: 0.6, y: 6.62, w: 0.5, h: 0, line: { color: K.violet, width: 2.25 } });
    s.addText("Relación contractual o comercial", { x: 1.2, y: 6.5, w: 3.0, h: 0.25, fontSize: 10.5, color: K.muted, margin: 0, isTextBox: true });
    s.addShape(pres.shapes.LINE, { x: 4.2, y: 6.62, w: 0.5, h: 0, line: { color: K.blue, width: 2.25, dashType: "dash" } });
    s.addText("Coordinación institucional y flujo de información", { x: 4.8, y: 6.5, w: 4.0, h: 0.25, fontSize: 10.5, color: K.muted, margin: 0, isTextBox: true });
    s.addText("Flechas dobles: la información circula en ambos sentidos", { x: 8.8, y: 6.5, w: 3.9, h: 0.25, fontSize: 10.5, color: K.muted, align: "right", margin: 0, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 5, Figura 3. Alojamiento no aplica (salidas de día); para viajes a Santiago o Concepción queda por definir.", 6.85);
    s.addNotes("INTEGRANTE 3 (≈0:50). Explicar que Sound Travel está al centro porque es quien contrata, coordina e informa. Diferenciar líneas continuas (contrato/comercio) y punteadas (coordinación/información).");
  }

  // 8. Responsabilidades y coordinación
  {
    const s = content(SEC3, "Responsabilidades y coordinación con cada actor", "INTEGRANTE 3  ·  CRITERIO 2.1.2  ·  QUÉ APORTA Y QUÉ RECIBE CADA ACTOR", 3);
    const P = [
      ["FaShuttleVan", "Transporte", "Contratación de servicio",
        ["Máquinas limpias y con revisión técnica", "Choferes profesionales y descansados", "Horarios de ida y regreso"],
        "Rutas, horarios, nómina y pago en fecha"],
      ["FaTicketAlt", "Ticketeras y productoras", "Alianza comercial",
        ["Emitir y validar QR o entradas", "Bloques de entradas reales", "Avisar apertura de puertas"],
        "Nómina con entradas asignadas y pago"],
      ["FaUtensils", "Locales gastronómicos", "Convenio de prestación",
        ["Recibir a los grupos antes del show o en salidas sunset", "Mesas y menús listos a tiempo"],
        "Hora de llegada, n.° de pasajeros y pago 72–24 h antes"],
      ["FaLandmark", "Municipio, SERNATUR y seguridad", "Coordinación institucional",
        ["Informar calles cerradas y vías de evacuación", "Autorizar parada y estacionamiento de buses", "Resguardo en embarque nocturno"],
        "Relación propuesta: sin convenios firmados"],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + i * 3.06, w = 2.9, y = 1.55, h = 3.95;
      card(s, x, y, w, h, i === 3 ? { fill: K.panel2 } : {});
      await iconCircle(s, P[i][0], x + 0.18, y + 0.18, 0.52, i === 3 ? K.blueD : K.violet);
      s.addText([T(P[i][1], { bold: true, fontSize: 13, color: K.white, breakLine: true }), T(P[i][2], { fontSize: 10.5, bold: true, color: K.blue })],
        { x: x + 0.8, y: y + 0.1, w: w - 0.9, h: 0.7, margin: 0, valign: "middle", isTextBox: true });
      s.addText(P[i][3].map((t, j) => T(t, { bullet: true, breakLine: j < P[i][3].length - 1 })),
        { x: x + 0.18, y: y + 0.95, w: w - 0.3, h: 1.85, fontSize: 11.5, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 4, isTextBox: true });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.12, y: y + 2.88, w: w - 0.24, h: 0.95, rectRadius: 0.08, fill: { color: i === 3 ? K.bg : K.panel2 }, line: { color: i === 3 ? K.amber : K.panel2 }, objectName: "Recibe" });
      s.addText([T(i === 3 ? "OJO" : "RECIBE DE SOUND TRAVEL", { bold: true, fontSize: 9.5, color: i === 3 ? K.amber : K.blue, charSpacing: 1, breakLine: true }), T(P[i][4], { fontSize: 11, color: K.white })],
        { x: x + 0.25, y: y + 2.92, w: w - 0.45, h: 0.88, margin: 0, valign: "middle", isTextBox: true });
    }
    card(s, 0.6, 5.68, 12.1, 0.88, { fill: K.panel2, shadow: false });
    s.addText("COMERCIAL B2C", { x: 0.8, y: 5.68, w: 1.6, h: 0.88, fontSize: 11, bold: true, color: K.blue, charSpacing: 1, valign: "middle", margin: 0, isTextBox: true });
    const ch = ["FaInstagram", "FaTiktok", "FaGlobe", "FaWhatsapp"];
    for (let i = 0; i < 4; i++) await iconCircle(s, ch[i], 2.45 + i * 0.58, 5.88, 0.48, K.violet);
    s.addText("Difusión en Instagram y TikTok, cotización por WhatsApp Business, venta online y voucher digital. Los clientes deben respetar horarios y normas de convivencia.",
      { x: 4.85, y: 5.68, w: 7.7, h: 0.88, fontSize: 12, color: K.white, valign: "middle", margin: 0, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3.1, 4, 5.1 y 6.1.");
    s.addNotes("INTEGRANTE 3 (≈0:40). Relación de doble vía: cada actor tiene obligaciones y depende de lo que entrega la agencia.");
  }
  // 16. Demanda e interdependencia
  {
    const s = content(SEC3, "Necesidades de la demanda e interdependencia", "INTEGRANTE 3  ·  CRITERIO 2.1.2  ·  SERVICIO DISEÑADO DESDE EL CLIENTE", 3);
    const hdr = { bold: true, color: HEX.lilac, fill: { color: HEX.panel2 }, fontSize: 11.5 };
    const cell = (t, o = {}) => ({ text: t, options: Object.assign({ color: HEX.white, fontSize: 12, fill: { color: HEX.panel } }, o) });
    const rows = [
      [cell("NECESIDAD DEL CLIENTE", hdr), cell("RESPUESTA DE SOUND TRAVEL", hdr), cell("ACTORES QUE INTERVIENEN", hdr)],
      [cell("Llegar puntual sin buscar estacionamiento", { bold: true }), cell("Traslado ida y vuelta con salida anticipada"), cell("Transporte · Jefe de Operaciones")],
      [cell("Volver seguro de noche", { bold: true }), cell("Reencuentro 30 min tras el show, conteo de pasajeros y pulsera por bus"), cell("Guía · Conductor · Seguridad local")],
      [cell("Entrada válida, sin estafas", { bold: true }), cell("Entradas oficiales incluidas en el pack"), cell("Ticketeras y productoras")],
      [cell("Comer sin atrasar el itinerario", { bold: true }), cell("Mesas y menús listos en locales asociados"), cell("Locales gastronómicos")],
      [cell("Estar informado en todo momento", { bold: true }), cell("Canal de WhatsApp del bus y ubicación del guía en tiempo real"), cell("Comercial · Guía")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [3.6, 5.2, 3.3], rowH: 0.42, border: { type: "solid", pt: 0.75, color: HEX.line }, valign: "middle", margin: [0.04, 0.12, 0.04, 0.12], fontFace: "Calibri", objectName: "Tabla demanda" });
    // Cadena
    s.addText("CADENA DE INTERDEPENDENCIA · si un eslabón falla, el servicio completo se resiente", { x: 0.6, y: 4.62, w: 12.1, h: 0.3, fontSize: 11.5, bold: true, color: K.blue, charSpacing: 1, margin: 0, isTextBox: true });
    const chain = [["FaTicketAlt", "Entrada emitida"], ["FaShuttleVan", "Bus a tiempo"], ["FaUtensils", "Mesa lista"], ["FaShieldAlt", "Parada segura"], ["FaUserFriends", "Guía reúne al grupo"], ["FaSmile", "Cliente satisfecho"]];
    for (let i = 0; i < 6; i++) {
      const x = 0.6 + i * 2.05;
      card(s, x, 5.05, 1.75, 1.3, i === 5 ? { fill: K.violet, line: K.violet } : {});
      await iconCircle(s, chain[i][0], x + 0.6, 5.15, 0.55, i === 5 ? K.bg : K.panel2, HEX.blue);
      s.addText(chain[i][1], { x: x + 0.05, y: 5.75, w: 1.65, h: 0.5, fontSize: 12, bold: true, color: K.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      if (i < 5) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 1.8, y: 5.55, w: 0.22, h: 0.3, fill: { color: K.muted }, line: { color: K.muted } });
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 2, 5.1, 6.1 y 7. Cadena: análisis del equipo a partir del informe.", 6.6);
    s.addNotes("INTEGRANTE 3 (≈0:40). Cada necesidad tiene una respuesta concreta y un actor responsable. La cadena muestra la interdependencia. Transición al Integrante 4: «¿con qué criterios aseguramos que cada eslabón cumpla?».");
  }

  // =====================================================================
  // INTEGRANTE 4
  // =====================================================================
  const SEC4 = "Integrante 4 · Criterios, seguimiento y cierre";
  pres.addSection({ title: SEC4 });

  // 10. Cuatro criterios
  {
    const s = content(SEC4, "Cuatro criterios para asignar tareas", "INTEGRANTE 4  ·  CRITERIO 2.1.3  ·  TÉCNICO · NORMATIVO · SUSTENTABLE · TERRITORIAL", 4);
    const Q = [
      ["FaClipboardCheck", "Estándares técnicos", [
        T("Checklist del minibús antes de cada salida (Jefe de Operaciones): ", { bold: true, color: HEX.white }),
        T("neumáticos, cinturones, botiquín y climatización.", { breakLine: true }),
        T("Nómina digital y pulsera de color por bus: ", { bold: true, color: HEX.white }),
        T("nadie se pierde al salir de noche."),
      ]],
      ["FaBalanceScale", "Estándares normativos", [
        T("Registro de Prestadores SERNATUR ", { bold: true, color: HEX.white }), T("(Ley 20.423, Título VII): voluntario para agencias (art. 33); lo proponemos.", { breakLine: true }),
        T("D.S. 80/2004 MTT ", { bold: true, color: HEX.white }), T("para transportistas subcontratados.", { breakLine: true }),
        T("Licencia A2 o A3 ", { bold: true, color: HEX.white }), T("(Ley 18.290, art. 12) y ", {}), T("SOAP ", { bold: true, color: HEX.white }), T("(Ley 18.490) vigente."),
      ]],
      ["FaRecycle", "Sustentabilidad", [
        T("“Viaje Limpio”: ", { bold: true, color: HEX.white }), T("bolsas de reciclaje en cada minibús.", { breakLine: true }),
        T("Cero papel: ", { bold: true, color: HEX.white }), T("tickets y credenciales digitales.", { breakLine: true }),
        T("Economía local: ", { bold: true, color: HEX.white }), T("convenios con emprendimientos gastronómicos de la región."),
      ]],
      ["FaCloudRain", "Contexto territorial", [
        T("Riesgos: ", { bold: true, color: HEX.white }), T("lluvias repentinas, neblina nocturna en Ruta 5 Sur, congestión en la CH-199 en verano.", { breakLine: true }),
        T("Medidas: ", { bold: true, color: HEX.white }), T("puntos de encuentro céntricos e iluminados (Av. Alemania, Plaza Teodoro Schmidt) y salida con margen."),
      ]],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + (i % 2) * 6.15, y = 1.55 + Math.floor(i / 2) * 2.3, w = 5.95, h = 2.15;
      card(s, x, y, w, h, i === 1 ? { fill: K.panel2 } : {});
      await iconCircle(s, Q[i][0], x + 0.2, y + 0.2, 0.55, i === 2 ? K.green : K.violet, i === 2 ? HEX.ink : HEX.white);
      s.addText(Q[i][1], { x: x + 0.9, y: y + 0.2, w: w - 1.1, h: 0.55, fontSize: 15, bold: true, color: K.white, margin: 0, valign: "middle", isTextBox: true });
      s.addText(Q[i][2], { x: x + 0.25, y: y + 0.85, w: w - 0.45, h: h - 0.95, fontSize: 13, color: K.muted, margin: 0, valign: "top", paraSpaceAfter: 3, isTextBox: true });
    }
    s.addText("Al revisar las normas corregimos dos citas del informe: el registro está en el Título VII (no en el art. 19) y las licencias en la Ley 18.290 (no en el D.S. 80).",
      { x: 0.6, y: 6.18, w: 12.1, h: 0.4, fontSize: 11, italic: true, color: K.amber, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuentes: Informe Operativo Sound Travel (2026), secc. 6 · Ley 20.423 · D.S. 80/2004 · Ley 18.290 · Ley 18.490 · SERNATUR, Portal de Servicios Turísticos.");
    s.addNotes("INTEGRANTE 4 (≈0:50). Cada criterio define quién hace qué. Mencionar la corrección de citas como parte de la investigación.");
  }

  // 11. Matriz de tareas y seguimiento
  {
    const s = content(SEC4, "Matriz de tareas y seguimiento de la operación", "INTEGRANTE 4  ·  CRITERIO 2.1.3  ·  QUIÉN HACE QUÉ, CUÁNDO, CON QUÉ CRITERIO Y CÓMO SE CONTROLA", 4);
    const hdr = { bold: true, color: HEX.lilac, fill: { color: HEX.panel2 }, fontSize: 11 };
    const c = (t, o = {}) => ({ text: t, options: Object.assign({ color: HEX.white, fontSize: 11, fill: { color: HEX.panel } }, o) });
    const crit = (t) => ({ text: t, options: { color: HEX.blue, bold: true, fontSize: 10, breakLine: false } });
    const two = (a, b) => c([T(a, { breakLine: true }), crit(b)]);
    const seg = (who, t) => c([T(who + " ", { bold: true, color: HEX.blue }), T(t)]);
    const rows = [
      [c("ETAPA", hdr), c("RESPONSABLE", hdr), c("TAREA ASIGNADA · CRITERIO", hdr), c("SEGUIMIENTO Y COMUNICACIÓN", hdr)],
      [c([T("Pre-operación", { bold: true, breakLine: true }), T("72 a 24 h antes", { color: HEX.muted, fontSize: 10 })]), c("Jefe de Operaciones y Administrativo"),
        two("Documentos del minibús y chofer (D.S. 80), pago de reservas y cierre de nómina con entradas", "Normativo · Técnico"),
        c([T("Proveedores: ", { bold: true, color: HEX.blue }), T("correo formal 7 días antes y WhatsApp 24 h antes (patentes, choferes, horarios).", { breakLine: true }), T("Clientes: ", { bold: true, color: HEX.blue }), T("comprobante digital y canal de WhatsApp del bus.")])],
      [c([T("Embarque e ida", { bold: true, breakLine: true }), T("Día del evento", { color: HEX.muted, fontSize: 10 })]), c("Guía de Terreno y Conductor"),
        two("Citación en punto seguro, lista digital, pulsera y charla de seguridad", "Técnico · Territorial · Sustentable"),
        seg("Operadores:", "WhatsApp Operativo, hito 1 (bus en punto) y hito 2 (salida completa).")],
      [c("Durante el evento", { bold: true }), c("Guía de Terreno"),
        two("Acompañamiento al acceso, coordinación con seguridad municipal y punto de asistencia", "Territorial · Seguridad"),
        seg("Operadores:", "hito 3 (llegada sin novedades); radios si cae la señal.")],
      [c("Retorno nocturno", { bold: true }), c("Guía de Terreno y Conductor"),
        two("Reencuentro 30 min tras el show, conteo completo y regreso a Temuco", "Técnico · Territorial"),
        c([T("Operadores: ", { bold: true, color: HEX.blue }), T("hito 4 (inicio de retorno). ", {}), T("Clientes: ", { bold: true, color: HEX.blue }), T("ubicación del guía en tiempo real.")])],
      [c([T("Post-evento *", { bold: true, color: HEX.amber, breakLine: true }), T("Día siguiente", { color: HEX.muted, fontSize: 10 })]), c("No asignado (sugerido: Comercial)", { color: HEX.amber }),
        two("Encuesta de puntualidad, trato del guía y comodidad", "Calidad · Mejora continua"),
        seg("Clientes:", "encuesta en Google Forms.")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [1.75, 2.05, 4.25, 4.05], rowH: [0.36, 0.92, 0.78, 0.74, 0.74, 0.72], border: { type: "solid", pt: 0.75, color: HEX.line }, valign: "middle", margin: [0.04, 0.1, 0.04, 0.1], fontFace: "Calibri", objectName: "Matriz de tareas y seguimiento" });
    s.addText("* Fila agregada por el equipo: la encuesta está en el informe (secc. 4.1 y 7), pero no tenía responsable en su matriz.",
      { x: 0.6, y: 6.0, w: 12.1, h: 0.35, fontSize: 11, italic: true, color: K.amber, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 6.1 y 7. Radios: en recintos donde cae la señal celular (p. ej., Estadio Germán Becker).");
    s.addNotes("INTEGRANTE 4 (≈0:45). Leer por filas. Seguimiento: proveedores antes, operadores con 4 hitos, clientes de la compra a la encuesta.");
  }

  // 12. Contingencias y conclusiones
  {
    const s = content(SEC4, "Contingencias y conclusiones", "INTEGRANTE 4  ·  CRITERIO 2.1.3 Y CIERRE  ·  COORDINAR ES ANTICIPAR", 4);
    const hdr = { bold: true, color: HEX.lilac, fill: { color: HEX.panel2 }, fontSize: 10.5 };
    const c = (t, o = {}) => ({ text: t, options: Object.assign({ color: HEX.white, fontSize: 10.5, fill: { color: HEX.panel } }, o) });
    const inf = c("Informe", { color: HEX.green, bold: true, fontSize: 10 });
    const pro = c("Propuesta", { color: HEX.amber, bold: true, fontSize: 10 });
    const rows = [
      [c("SITUACIÓN", hdr), c("RESPUESTA · RESPONSABLE", hdr), c("ORIGEN", hdr)],
      [c("Cortes de tránsito o mal clima", { bold: true }), c("Plan de contingencia y salida con margen · Jefe de Operaciones"), inf],
      [c("Cae la señal celular", { bold: true }), c("Radios portátiles · Guía y equipo interno"), inf],
      [c("Emergencia en el evento", { bold: true }), c("Punto de asistencia, seguridad municipal y vías de evacuación · Guía"), inf],
      [c("Pasajero desorientado", { bold: true }), c("Pulsera, ubicación en tiempo real y conteo · Guía y Conductor"), inf],
      [c("Proveedor cancela", { bold: true }), c("Transportista o local de respaldo · Jefe de Operaciones"), pro],
      [c("Pasajero no llega", { bold: true }), c("Contacto, espera definida y escalamiento: Guía → Jefe de Op. → Dirección → Carabineros"), pro],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 6.55, colW: [1.95, 3.7, 0.9], rowH: [0.32, 0.55, 0.45, 0.55, 0.55, 0.45, 0.62], border: { type: "solid", pt: 0.75, color: HEX.line }, valign: "middle", margin: [0.03, 0.08, 0.03, 0.08], fontFace: "Calibri", objectName: "Tabla contingencias" });
    s.addText("Las filas “Propuesta” completan el informe, que no traía un protocolo formal.", { x: 0.6, y: 5.18, w: 6.55, h: 0.3, fontSize: 10.5, italic: true, color: K.amber, margin: 0, isTextBox: true });
    const cc = [
      ["2.1.1", "Estructura simple de 5 cargos y 4 funciones, y un flujo de 5 etapas que une procesos internos y externos."],
      ["2.1.2", "Sound Travel coordina al centro: contrata, se alía, conviene y se coordina para responder a cada necesidad del cliente."],
      ["2.1.3", "Tareas asignadas con 4 criterios y controladas con seguimiento por actor y un protocolo de contingencias."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.55 + i * 1.02;
      card(s, 7.4, y, 5.3, 0.92);
      s.addImage({ data: await icon("FaCheckCircle", HEX.green), x: 7.55, y: y + 0.1, w: 0.26, h: 0.26 });
      s.addText("CRITERIO " + cc[i][0], { x: 7.9, y: y + 0.08, w: 2.0, h: 0.3, fontSize: 10, bold: true, color: K.blue, charSpacing: 1, margin: 0, valign: "middle", isTextBox: true });
      s.addText(cc[i][1], { x: 7.55, y: y + 0.4, w: 5.05, h: 0.48, fontSize: 11, color: K.white, margin: 0, valign: "middle", isTextBox: true });
    }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.4, y: 4.65, w: 5.3, h: 0.85, rectRadius: 0.12, fill: { color: K.violet }, line: { color: K.violet }, objectName: "Mensaje final" });
    s.addText("Un servicio de eventos funciona solo si cada actor sabe qué hacer, cuándo y a quién informar.  ¡Gracias!",
      { x: 7.55, y: 4.65, w: 5.0, h: 0.85, fontSize: 12.5, bold: true, italic: true, color: K.white, valign: "middle", margin: 0, isTextBox: true });
    card(s, 0.6, 5.62, 12.1, 0.98, { fill: K.panel2, shadow: false });
    s.addText([
      T("Referencias: ", { bold: true, color: K.lilac }),
      T("INACAP (2026). Guía de aprendizaje GTD404, Unidad 2 · Monsalve, B. (2026). Pre-informe operativo Sound Travel · Ley 20.423 (2010) · D.S. 80 (2004), MTT · Ley 18.290, art. 12 · Ley 18.490 · Subsecretaría de Turismo (2024) · SERNATUR, Portal de Servicios Turísticos · Imágenes referenciales: Unsplash. ", {}),
      T("Sound Travel es una empresa ficticia; convenios y festival 2027 son propuestas y escenarios.", { italic: true, color: K.amber }),
    ], { x: 0.8, y: 5.62, w: 11.75, h: 0.98, fontSize: 9.5, color: K.muted, valign: "middle", margin: 0, isTextBox: true });
    s.addNotes("INTEGRANTE 4 (≈0:45). Contingencias (verde = informe, ámbar = propuesta) y cierre con un mensaje por criterio.");
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("OK", OUT);
})().catch((e) => { console.error(e); process.exit(1); });

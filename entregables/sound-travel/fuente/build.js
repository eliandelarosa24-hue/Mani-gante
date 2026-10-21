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
    s.addNotes("INTEGRANTE 1 (≈0:30). Saludo, presentación del equipo y del tema. Aclarar desde el inicio que Sound Travel es una empresa creada para la asignatura (Opción 2 de la guía).");
  }

  // 2. Ruta de la exposición
  {
    const s = content("Integrante 1 · Contexto y Sound Travel", "Ruta de la exposición", "INTEGRANTE 1  ·  CÓMO RESPONDEMOS A LOS CRITERIOS DE LA UNIDAD 2", 1);
    const items = [
      ["FaMusic", "Contexto y Sound Travel", "Problemática, identificación, localización, misión, visión, público y propuesta de valor", "2.1.1"],
      ["FaSitemap", "Estructura y procesos", "Organigramas, áreas, recurso humano, procesos internos/externos y flujo del servicio", "2.1.1"],
      ["FaProjectDiagram", "Actores turísticos y coordinación externa", "Mapa de relaciones, responsabilidades, interdependencia y demanda", "2.1.2"],
      ["FaClipboardCheck", "Criterios técnicos y seguimiento", "Normativa, sustentabilidad, territorio, matriz de tareas, seguimiento y contingencias", "2.1.3"],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + i * 3.06, y = 1.65, w = 2.86, h = 3.7;
      card(s, x, y, w, h);
      s.addText(String(i + 1).padStart(2, "0"), { x: x + 0.25, y: y + 0.2, w: 1.2, h: 0.7, fontSize: 36, bold: true, color: K.violet, fontFace: "Arial", margin: 0, isTextBox: true });
      await iconCircle(s, items[i][0], x + w - 0.95, y + 0.25, 0.7, K.panel2, HEX.blue);
      s.addText("INTEGRANTE " + (i + 1), { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: 0.28, fontSize: 10.5, bold: true, color: K.blue, charSpacing: 1, margin: 0, isTextBox: true });
      s.addText(items[i][1], { x: x + 0.25, y: y + 1.35, w: w - 0.5, h: 0.95, fontSize: 16, bold: true, color: K.white, margin: 0, valign: "top", isTextBox: true });
      s.addText(items[i][2], { x: x + 0.25, y: y + 2.35, w: w - 0.5, h: 0.8, fontSize: 12.5, color: K.muted, margin: 0, valign: "top", isTextBox: true });
      tag(s, "CRITERIO " + items[i][3], x + 0.25, y + h - 0.5, 1.45, K.violet, K.white);
      s.addText("≈ 4 min", { x: x + w - 1.15, y: y + h - 0.5, w: 0.9, h: 0.3, fontSize: 11, color: K.muted, align: "right", valign: "middle", margin: 0, isTextBox: true });
    }
    card(s, 0.6, 5.6, 12.1, 0.95, { fill: K.panel2, shadow: false });
    s.addText([
      T("Aprendizaje esperado: ", { bold: true, color: K.lilac }),
      T("“Organiza acciones de coordinación operativas con distintos actores del sector turístico, para el diseño y ejecución de programas o servicios, considerando las características de los productos, el contexto territorial y la normativa legal vigente.”", { italic: true, color: K.white }),
    ], { x: 0.85, y: 5.65, w: 11.6, h: 0.85, fontSize: 13, valign: "middle", margin: 0, isTextBox: true });
    source(s, "Fuente: INACAP (2026). Guía de aprendizaje GTD404, Unidad 2.");
    s.addNotes("INTEGRANTE 1 (≈0:30). Mostrar que la exposición sigue el orden de los tres criterios: 2.1.1 (integrantes 1 y 2), 2.1.2 (integrante 3) y 2.1.3 (integrante 4).");
  }

  // 3. Contexto y problemática
  {
    const s = content("Integrante 1 · Contexto y Sound Travel", "El problema: llegar, disfrutar y volver seguro", "INTEGRANTE 1  ·  CONTEXTO Y PROBLEMÁTICA DEL TURISMO DE EVENTOS", 1);
    s.addImage({ data: await photo("1470229722913-7c0e2dbbafd3", 4.6, 5.0), x: 0.6, y: 1.6, w: 4.6, h: 5.0, rounding: false, altText: "Público en concierto (imagen referencial)" });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.6, w: 4.6, h: 2.0, fill: { color: K.bg, transparency: 25 }, line: { color: K.bg, transparency: 100 } });
    s.addText([T("3,6 M", { fontSize: 46, bold: true, color: K.white, fontFace: "Arial", breakLine: true }), T("visitantes internacionales en Chile durante 2023, sumados a un fuerte movimiento de viajeros nacionales entre regiones", { fontSize: 13, color: K.white })],
      { x: 0.85, y: 4.7, w: 4.1, h: 1.8, margin: 0, valign: "middle", isTextBox: true });
    s.addText("Qué ocurre hoy en eventos masivos de Temuco y la zona lacustre", { x: 5.6, y: 1.6, w: 7.1, h: 0.4, fontSize: 17, bold: true, color: K.lilac, margin: 0, isTextBox: true });
    const rows = [
      ["FaBus", "El transporte público deja de circular temprano", "El regreso nocturno queda sin alternativas formales."],
      ["FaParking", "Los estacionamientos colapsan", "Recintos como el Parque Estadio Germán Becker o la Isla Cautín concentran miles de asistentes."],
      ["FaArrowUp", "Las tarifas de aplicaciones de transporte suben en exceso", "El asistente asume un costo alto y una espera incierta al salir del show."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.15 + i * 1.02;
      await iconCircle(s, rows[i][0], 5.6, y + 0.08, 0.66, K.violet);
      s.addText([T(rows[i][1], { bold: true, color: K.white, fontSize: 15, breakLine: true }), T(rows[i][2], { color: K.muted, fontSize: 13 })],
        { x: 6.45, y, w: 6.25, h: 0.85, margin: 0, valign: "middle", isTextBox: true });
    }
    card(s, 5.6, 5.3, 7.1, 1.25, { fill: K.panel2, line: K.amber, shadow: false });
    tag(s, "ESCENARIO PROYECTADO", 5.8, 5.45, 2.2);
    s.addText("El informe menciona el Festival Internacional de Temuco proyectado para febrero de 2027. Lo usamos como escenario de planificación: no contamos con confirmación oficial del evento.",
      { x: 5.8, y: 5.8, w: 6.7, h: 0.7, fontSize: 12.5, color: K.white, margin: 0, valign: "top", isTextBox: true });
    source(s, "Fuentes: Subsecretaría de Turismo (2024), citada en la guía GTD404 · Informe Operativo Sound Travel (2026), secc. 1 y 2. Imagen referencial · Unsplash.");
    s.addNotes("INTEGRANTE 1 (≈1:00). Explicar la problemática con ejemplos de Temuco. Recalcar que el festival 2027 es un escenario proyectado, no un hecho confirmado.");
  }

  // 4. ¿Qué es Sound Travel?
  {
    const s = content("Integrante 1 · Contexto y Sound Travel", "¿Qué es Sound Travel?", "INTEGRANTE 1  ·  CRITERIO 2.1.1  ·  IDENTIFICACIÓN, JUSTIFICACIÓN Y LOCALIZACIÓN", 1);
    const blocks = [
      ["FaIdCard", "Identificación", "Agencia de turismo de eventos y entretenimiento, con casa matriz en Temuco. Empresa creada para la asignatura (Opción 2 de la guía)."],
      ["FaLightbulb", "Justificación", "Responde a una necesidad que se repite cada temporada: no existe una solución integrada para ir y volver de forma segura a eventos masivos."],
      ["FaLayerGroup", "Servicio integrado", "Une en un solo paquete el traslado ida y vuelta, la entrada asegurada, las paradas gastronómicas y la asistencia de un guía."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.6 + i * 1.62;
      card(s, 0.6, y, 6.0, 1.45);
      await iconCircle(s, blocks[i][0], 0.85, y + 0.38, 0.7, K.violet);
      s.addText([T(blocks[i][1], { bold: true, color: K.white, fontSize: 16, breakLine: true }), T(blocks[i][2], { color: K.muted, fontSize: 13 })],
        { x: 1.8, y: y + 0.12, w: 4.6, h: 1.2, margin: 0, valign: "middle", isTextBox: true });
    }
    // Mapa esquemático
    const mx = 6.95, my = 1.6, mw = 5.75, mh = 4.85;
    card(s, mx, my, mw, mh, { fill: K.panel2 });
    s.addText("LOCALIZACIÓN Y RUTAS", { x: mx + 0.25, y: my + 0.18, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: K.blue, charSpacing: 1, margin: 0, isTextBox: true });
    const nodes = {
      temuco: [mx + 2.0, my + 2.55], plc: [mx + 2.55, my + 3.25], lautaro: [mx + 1.7, my + 1.45],
      villarrica: [mx + 3.6, my + 3.95], pucon: [mx + 4.75, my + 3.75],
    };
    // Viajes especiales
    line(s, mx + 2.0, my + 2.35, mx + 1.0, my + 0.7, { color: K.violet, dash: "dash", end: "triangle", width: 1.75 });
    line(s, mx + 2.2, my + 2.35, mx + 2.9, my + 0.7, { color: K.violet, dash: "dash", end: "triangle", width: 1.75 });
    s.addText("Santiago", { x: mx + 0.25, y: my + 0.48, w: 1.2, h: 0.25, fontSize: 11, bold: true, color: K.lilac, margin: 0, isTextBox: true });
    s.addText("Concepción", { x: mx + 2.75, y: my + 0.48, w: 1.4, h: 0.25, fontSize: 11, bold: true, color: K.lilac, margin: 0, isTextBox: true });
    for (const k of ["plc", "lautaro", "villarrica", "pucon"]) line(s, nodes.temuco[0], nodes.temuco[1], nodes[k][0], nodes[k][1], { color: K.blue, width: 2 });
    line(s, nodes.villarrica[0], nodes.villarrica[1], nodes.pucon[0], nodes.pucon[1], { color: K.blue, width: 2 });
    const labels = { plc: ["Padre Las Casas", -1.75, -0.02], lautaro: ["Lautaro", 0.22, -0.13], villarrica: ["Villarrica", -0.5, -0.45], pucon: ["Pucón", -0.2, 0.22] };
    for (const k of Object.keys(labels)) {
      const [x, y] = nodes[k];
      s.addShape(pres.shapes.OVAL, { x: x - 0.11, y: y - 0.11, w: 0.22, h: 0.22, fill: { color: K.blue }, line: { color: K.white, width: 1 }, objectName: "Nodo " + labels[k][0] });
      s.addText(labels[k][0], { x: x + labels[k][1], y: y + labels[k][2], w: 1.6, h: 0.26, fontSize: 11.5, color: K.white, margin: 0, align: k === "plc" ? "right" : "left", isTextBox: true });
    }
    const [tx, ty] = nodes.temuco;
    s.addShape(pres.shapes.OVAL, { x: tx - 0.28, y: ty - 0.28, w: 0.56, h: 0.56, fill: { color: K.violet }, line: { color: K.white, width: 1.5 }, objectName: "Nodo Temuco" });
    s.addImage({ data: await icon("FaMapMarkerAlt"), x: tx - 0.13, y: ty - 0.14, w: 0.26, h: 0.26 });
    s.addText([T("Temuco", { bold: true, fontSize: 13, color: K.white, breakLine: true }), T("Casa matriz", { fontSize: 10.5, color: K.lilac })],
      { x: tx - 1.75, y: ty - 0.3, w: 1.4, h: 0.55, align: "right", margin: 0, isTextBox: true });
    s.addShape(pres.shapes.LINE, { x: mx + 0.3, y: my + 4.4, w: 0.4, h: 0, line: { color: K.blue, width: 2 } });
    s.addText("Rutas regionales", { x: mx + 0.78, y: my + 4.28, w: 1.6, h: 0.25, fontSize: 10.5, color: K.muted, margin: 0, isTextBox: true });
    s.addShape(pres.shapes.LINE, { x: mx + 2.45, y: my + 4.4, w: 0.4, h: 0, line: { color: K.violet, width: 2, dashType: "dash" } });
    s.addText("Viajes especiales a conciertos", { x: mx + 2.93, y: my + 4.28, w: 2.6, h: 0.25, fontSize: 10.5, color: K.muted, margin: 0, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 2 y 2.1. Esquema referencial de elaboración propia, no a escala.");
    s.addNotes("INTEGRANTE 1 (≈0:50). Identificar la empresa, justificar la elección (Opción 2) y recorrer el mapa: Temuco como base, rutas regionales y viajes especiales.");
  }

  // 5. Misión, visión, público
  {
    const s = content("Integrante 1 · Contexto y Sound Travel", "Misión, visión y público objetivo", "INTEGRANTE 1  ·  CRITERIO 2.1.1  ·  IDENTIDAD ORGANIZACIONAL", 1);
    s.addImage({ data: await photo("1511632765486-a01980e01a18", 3.4, 4.95), x: 0.6, y: 1.6, w: 3.4, h: 4.95, altText: "Grupo de amigos al atardecer (imagen referencial)" });
    const mv = [
      ["MISIÓN", "Ofrecer servicios de traslado y actividades complementarias para asistentes a festivales, conciertos y eventos de entretenimiento dentro y fuera de La Araucanía, garantizando seguridad, comodidad y un viaje bien planificado."],
      ["VISIÓN", "Ser una agencia reconocida en el sur de Chile para el turismo de eventos y entretenimiento, destacando por su buena organización y calidad de servicio."],
    ];
    for (let i = 0; i < 2; i++) {
      const x = 4.3 + i * 4.25;
      card(s, x, 1.6, 4.05, 2.25);
      s.addText(mv[i][0], { x: x + 0.25, y: 1.75, w: 3.5, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
      s.addText(mv[i][1], { x: x + 0.25, y: 2.1, w: 3.6, h: 1.65, fontSize: 13, color: K.white, margin: 0, valign: "top", isTextBox: true });
    }
    const pf = [
      ["FaHeadphones", "Perfil 1 · 18 a 35 años aprox.", "Jóvenes amantes de la música y los festivales que buscan experiencias completas, seguras y sin complicaciones de transporte."],
      ["FaGlassCheers", "Perfil 2 · hasta 45 años aprox.", "Turistas de intereses especiales y culturales: amigos o parejas que buscan panoramas de fin de semana y salidas tipo sunset en la zona lacustre."],
    ];
    for (let i = 0; i < 2; i++) {
      const x = 4.3 + i * 4.25;
      card(s, x, 4.05, 4.05, 2.5, { fill: K.panel2 });
      await iconCircle(s, pf[i][0], x + 0.25, 4.25, 0.62, K.violet);
      s.addText(pf[i][1], { x: x + 1.0, y: 4.3, w: 2.95, h: 0.5, fontSize: 14, bold: true, color: K.white, margin: 0, valign: "middle", isTextBox: true });
      s.addText(pf[i][2], { x: x + 0.25, y: 5.0, w: 3.6, h: 1.4, fontSize: 13, color: K.muted, margin: 0, valign: "top", isTextBox: true });
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 2.1. Imagen referencial · Unsplash.");
    s.addNotes("INTEGRANTE 1 (≈0:40). Relacionar misión y visión con los dos perfiles: ambos valoran seguridad y comodidad; el perfil 2 suma gastronomía y experiencias sunset.");
  }

  // 6. Propuesta de valor
  {
    const s = content("Integrante 1 · Contexto y Sound Travel", "Propuesta de valor: el Pack Sound Travel", "INTEGRANTE 1  ·  CRITERIO 2.1.1  ·  SERVICIOS OFRECIDOS", 1);
    s.addImage({ data: await photo("1544620347-c4fd4a3d5957", 4.9, 4.95), x: 7.8, y: 1.6, w: 4.9, h: 4.95, altText: "Bus turístico al anochecer junto a montañas (imagen referencial)" });
    s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 5.05, w: 4.9, h: 1.5, fill: { color: K.bg, transparency: 20 }, line: { color: K.bg, transparency: 100 } });
    s.addText("“Llegar puntual, disfrutar con tranquilidad y regresar seguro a casa.”", { x: 8.05, y: 5.15, w: 4.4, h: 1.3, fontSize: 17, italic: true, bold: true, color: K.white, margin: 0, valign: "middle", isTextBox: true });
    const comp = [
      ["FaShuttleVan", "Traslado ida y vuelta", "Minibuses y vans de 15 a 30 pasajeros, con conductores profesionales."],
      ["FaTicketAlt", "Entrada asegurada", "Bloques de entradas reales gestionados con ticketeras oficiales: evita estafas y reventa."],
      ["FaUserFriends", "Asistencia de guía", "Lista de pasajeros, pulsera identificadora y acompañamiento hasta el acceso."],
      ["FaUtensils", "Paradas gastronómicas", "Convenios con restaurantes y cafeterías de Temuco y la zona lacustre."],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + (i % 2) * 3.55, y = 1.6 + Math.floor(i / 2) * 1.75;
      card(s, x, y, 3.4, 1.6);
      await iconCircle(s, comp[i][0], x + 0.2, y + 0.22, 0.58, K.violet);
      s.addText(comp[i][1], { x: x + 0.9, y: y + 0.22, w: 2.4, h: 0.58, fontSize: 14.5, bold: true, color: K.white, margin: 0, valign: "middle", isTextBox: true });
      s.addText(comp[i][2], { x: x + 0.2, y: y + 0.85, w: 3.05, h: 0.7, fontSize: 12, color: K.muted, margin: 0, valign: "top", isTextBox: true });
    }
    card(s, 0.6, 5.15, 6.95, 1.4, { fill: K.panel2, shadow: false });
    s.addText([
      T("Líneas de servicio", { bold: true, color: K.lilac, fontSize: 13, breakLine: true }),
      T("Pack Evento para conciertos y festivales · Salidas tipo sunset en Villarrica y Pucón · Viajes especiales a conciertos en Concepción y Santiago", { color: K.white, fontSize: 13 }),
    ], { x: 0.85, y: 5.22, w: 6.5, h: 1.25, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 2, 2.1 y 4. El informe no define precios ni volumen de ventas. Imagen referencial · Unsplash.");
    s.addNotes("INTEGRANTE 1 (≈0:30). Resumir el valor del pack y dar paso al Integrante 2: «para entregar todo esto, la agencia necesita una estructura clara».");
  }

  // =====================================================================
  // INTEGRANTE 2
  // =====================================================================
  const SEC2 = "Integrante 2 · Estructura y procesos";
  pres.addSection({ title: SEC2 });

  // 7. Organigrama jerárquico
  {
    const s = content(SEC2, "Estructura organizacional: organigrama jerárquico", "INTEGRANTE 2  ·  CRITERIO 2.1.1  ·  ESTRUCTURA INTERNA", 2);
    const box = async (x, y, w, h, title, sub, ic, fill) => {
      card(s, x, y, w, h, { fill: fill || K.panel, line: fill ? fill : K.line });
      await iconCircle(s, ic, x + 0.18, y + (h - 0.55) / 2, 0.55, fill ? K.bg : K.violet, fill ? HEX.lilac : HEX.white);
      s.addText([T(title, { bold: true, fontSize: 13.5, color: K.white, breakLine: true }), T(sub, { fontSize: 11.5, color: fill ? K.white : K.muted })],
        { x: x + 0.85, y, w: w - 0.95, h, margin: 0, valign: "middle", isTextBox: true });
    };
    // Conectores
    line(s, 4.95, 2.45, 4.95, 2.9, { color: K.muted, width: 1.75 });
    line(s, 1.8, 2.9, 8.1, 2.9, { color: K.muted, width: 1.75 });
    for (const x of [1.8, 4.95, 8.1]) line(s, x, 2.9, x, 3.3, { color: K.muted, width: 1.75 });
    line(s, 1.8, 4.4, 1.8, 4.95, { color: K.muted, width: 1.75 });
    await box(3.2, 1.6, 3.5, 0.85, "DIRECCIÓN GENERAL", "Gerente General", "FaUserTie", K.violet);
    await box(0.6, 3.3, 2.4, 1.1, "Operaciones y Logística", "Jefe de Operaciones", "FaCogs");
    await box(3.75, 3.3, 2.4, 1.1, "Comercial y Atención al Cliente", "Ventas / Community Manager", "FaBullhorn");
    await box(6.9, 3.3, 2.4, 1.1, "Administración y Finanzas", "Contador / Administrativo", "FaCalculator");
    await box(0.6, 4.95, 2.4, 1.1, "Equipo de Terreno", "Guías turísticos y conductores", "FaRoute");
    // Lectura
    card(s, 9.75, 1.6, 2.95, 4.95, { fill: K.panel2, shadow: false });
    s.addText("CÓMO SE LEE", { x: 10.0, y: 1.78, w: 2.5, h: 0.3, fontSize: 11, bold: true, color: K.blue, charSpacing: 1, margin: 0, isTextBox: true });
    s.addText([
      T("5 niveles de cargo y 4 áreas funcionales.", { bullet: true, breakLine: true }),
      T("Estructura simple y vertical: una sola dirección coordina tres áreas.", { bullet: true, breakLine: true }),
      T("El Equipo de Terreno depende de Operaciones: la oficina conecta directo con quienes acompañan a los pasajeros.", { bullet: true }),
    ], { x: 10.0, y: 2.15, w: 2.55, h: 4.2, fontSize: 13, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 8, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3, Figura 1 (organigrama jerárquico básico). Rediseño gráfico de elaboración propia.");
    s.addNotes("INTEGRANTE 2 (≈0:45). Recorrer el organigrama de arriba hacia abajo y destacar la dependencia de Terreno respecto de Operaciones.");
  }

  // 8. Áreas y recursos humanos
  {
    const s = content(SEC2, "Áreas de trabajo y recurso humano", "INTEGRANTE 2  ·  CRITERIO 2.1.1  ·  FUNCIONES Y RESPONSABILIDADES", 2);
    const a = [
      ["FaUserTie", "Dirección General", "Gerente General", ["Planificación general", "Alianzas con instituciones y productoras", "Supervisa cumplimiento de la normativa turística"]],
      ["FaCogs", "Operaciones y Logística", "Jefe de Operaciones", ["Rutas de recogida y retorno", "Tiempos de viaje", "Documentos y mantención de minibuses", "Planes de contingencia"]],
      ["FaBullhorn", "Comercial y Atención", "Ventas / Community Manager", ["Consultas en redes sociales", "Reservas de paquetes", "Contenido en Instagram y TikTok"]],
      ["FaCalculator", "Administración y Finanzas", "Contador / Administrativo", ["Contabilidad, boletas y facturas", "Presupuesto por salida", "Pagos a transporte, locales y ticketeras"]],
      ["FaRoute", "Equipo de Terreno", "Guías y conductores", ["Lista y pulseras al subir al bus", "Acompañamiento hasta el recinto", "Conducción prudente y puntual"]],
    ];
    for (let i = 0; i < 5; i++) {
      const x = 0.6 + i * 2.45, w = 2.3, y = 1.6, h = 4.95;
      card(s, x, y, w, h, i === 4 ? { fill: K.panel2, line: K.violet } : {});
      await iconCircle(s, a[i][0], x + 0.2, y + 0.22, 0.62, K.violet);
      s.addText(a[i][1], { x: x + 0.2, y: y + 0.95, w: w - 0.35, h: 0.62, fontSize: 14, bold: true, color: K.white, margin: 0, valign: "top", isTextBox: true });
      s.addText(a[i][2], { x: x + 0.2, y: y + 1.58, w: w - 0.35, h: 0.3, fontSize: 11.5, bold: true, color: K.blue, margin: 0, isTextBox: true });
      s.addText(a[i][3].map((t, j) => T(t, { bullet: true, breakLine: j < a[i][3].length - 1 })),
        { x: x + 0.2, y: y + 2.0, w: w - 0.3, h: 2.8, fontSize: 12.5, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3.1. Cada área actúa antes, durante y después de cada evento.");
    s.addNotes("INTEGRANTE 2 (≈0:55). Explicar qué hace cada cargo y en qué momento del servicio interviene. Destacar al Equipo de Terreno como la cara visible ante el cliente.");
  }

  // 9. Organigrama funcional
  {
    const s = content(SEC2, "Organigrama funcional: cuatro funciones, un servicio", "INTEGRANTE 2  ·  CRITERIO 2.1.1  ·  ORGANIZACIÓN POR FUNCIONES", 2);
    const cx = 6.665, cy = 4.07;
    const f = [
      ["FaChessKing", "1 · Función Directiva", "Dirección General", "Planificación anual según calendario de conciertos, gestión de convenios con municipios y SERNATUR, y control legal del servicio.", 0.6, 1.6],
      ["FaTools", "2 · Función Operativa", "Operaciones y Terreno", "Diseño de rutas y puntos de encuentro, chequeo técnico de minibuses, embarque y acompañamiento en ruta.", 8.03, 1.6],
      ["FaShoppingCart", "3 · Función Comercial", "Comercial y Ventas", "Campañas digitales del “Pack Evento”, cotizaciones por WhatsApp, ventas online y envío de vouchers.", 0.6, 4.2],
      ["FaFileInvoiceDollar", "4 · Función Administrativa", "Administración y Finanzas", "Control de pagos de reservas, liquidación de convenios B2B con transportistas y restaurantes, y balance por evento.", 8.03, 4.2],
    ];
    for (const [ic, t, area, act, x, y] of f) {
      line(s, x < 5 ? x + 4.7 : x, y + 1.15, cx, cy, { color: K.line, width: 2 });
    }
    for (const [ic, t, area, act, x, y] of f) {
      card(s, x, y, 4.7, 2.3);
      await iconCircle(s, ic, x + 0.22, y + 0.22, 0.6, K.violet);
      s.addText([T(t, { bold: true, fontSize: 15, color: K.white, breakLine: true }), T(area, { fontSize: 12, color: K.blue, bold: true })],
        { x: x + 0.95, y: y + 0.18, w: 3.6, h: 0.7, margin: 0, valign: "middle", isTextBox: true });
      s.addText(act, { x: x + 0.22, y: y + 1.0, w: 4.3, h: 1.2, fontSize: 13, color: K.muted, margin: 0, valign: "top", isTextBox: true });
    }
    s.addShape(pres.shapes.OVAL, { x: cx - 1.0, y: cy - 1.0, w: 2.0, h: 2.0, fill: { color: K.violet }, line: { color: K.lilac, width: 2 }, shadow: sh(), objectName: "Centro funcional" });
    s.addText([T("SERVICIO", { bold: true, fontSize: 13, color: K.white, breakLine: true }), T("INTEGRADO", { bold: true, fontSize: 13, color: K.white, breakLine: true }), T("Pack Sound Travel", { fontSize: 10.5, color: K.lilac })],
      { x: cx - 1.0, y: cy - 1.0, w: 2.0, h: 2.0, align: "center", valign: "middle", margin: 0, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3.2. Los convenios con municipio y SERNATUR son una propuesta: no existen acuerdos firmados (empresa ficticia).");
    s.addNotes("INTEGRANTE 2 (≈0:40). Diferenciar el organigrama jerárquico (quién depende de quién) del funcional (qué función cumple cada área). Las cuatro funciones convergen en el pack.");
  }

  // 10. Procesos internos y externos
  {
    const s = content(SEC2, "Procesos operativos internos y externos", "INTEGRANTE 2  ·  CRITERIO 2.1.1  ·  CÓMO SE CONECTA LA OFICINA CON EL ENTORNO", 2);
    card(s, 0.6, 1.6, 5.2, 4.95);
    s.addText("PROCESOS INTERNOS", { x: 0.85, y: 1.78, w: 4.5, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const inn = [
      ["FaRoute", "Planificación de rutas, tiempos y puntos de encuentro"],
      ["FaWrench", "Revisión de documentos y mantención de minibuses"],
      ["FaCalendarCheck", "Gestión de reservas, nómina de pasajeros y vouchers"],
      ["FaCoins", "Presupuesto por salida, pagos y balance por evento"],
      ["FaUsers", "Embarque, acompañamiento y retorno del grupo"],
    ];
    for (let i = 0; i < 5; i++) {
      const y = 2.25 + i * 0.84;
      await iconCircle(s, inn[i][0], 0.85, y, 0.55, K.panel2, HEX.blue);
      s.addText(inn[i][1], { x: 1.55, y, w: 4.1, h: 0.55, fontSize: 13.5, color: K.white, margin: 0, valign: "middle", isTextBox: true });
    }
    // puente
    s.addShape(pres.shapes.RIGHT_ARROW, { x: 5.95, y: 3.5, w: 0.75, h: 0.6, fill: { color: K.violet }, line: { color: K.violet }, objectName: "Flecha" });
    s.addShape(pres.shapes.LEFT_ARROW, { x: 5.95, y: 4.2, w: 0.75, h: 0.6, fill: { color: K.blue }, line: { color: K.blue }, objectName: "Flecha" });
    card(s, 6.85, 1.6, 5.85, 4.95);
    s.addText("PROCESOS EXTERNOS · TRES FRENTES", { x: 7.1, y: 1.78, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const ext = [
      ["FaHandshake", "Proveedores", "Contratos y reservas anticipadas con transporte turístico, convenios con restaurantes y coordinación con ticketeras oficiales."],
      ["FaLandmark", "Alianzas estratégicas", "Comunicación con Municipalidad de Temuco, SERNATUR Araucanía, seguridad municipal y Carabineros."],
      ["FaComments", "Clientes y comercialización", "Venta directa B2C por Instagram, TikTok, web y WhatsApp Business."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.25 + i * 1.4;
      await iconCircle(s, ext[i][0], 7.1, y + 0.05, 0.6, K.violet);
      s.addText([T(ext[i][1], { bold: true, fontSize: 14.5, color: K.white, breakLine: true }), T(ext[i][2], { fontSize: 12.5, color: K.muted })],
        { x: 7.9, y: y - 0.05, w: 4.6, h: 1.25, margin: 0, valign: "top", isTextBox: true });
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3.1, 3.2 y 4.");
    s.addNotes("INTEGRANTE 2 (≈0:50). Los procesos internos preparan lo que se compromete hacia afuera; los externos traen información (horarios, cierres de calles, reservas) que vuelve a la planificación.");
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
    s.addNotes("INTEGRANTE 2 (≈0:50). Recorrer las cinco etapas y cerrar con la retroalimentación. Transición al Integrante 3: «en la etapa 3 aparecen actores externos; mi compañero/a explica cómo se coordinan».");
  }

  // =====================================================================
  // INTEGRANTE 3
  // =====================================================================
  const SEC3 = "Integrante 3 · Actores y coordinación";
  pres.addSection({ title: SEC3 });

  // 12. Ecosistema de actores
  {
    const s = content(SEC3, "Ecosistema de actores turísticos", "INTEGRANTE 3  ·  CRITERIO 2.1.2  ·  IDENTIFICACIÓN DE ACTORES", 3);
    const ac = [
      ["FaShuttleVan", "Transporte terrestre", "Empresas locales de minibuses y vans (15–30 pax) y sus conductores", "Proveedor privado", "Contratación B2B"],
      ["FaTicketAlt", "Ticketeras y productoras", "Emiten y validan entradas oficiales; informan apertura de puertas", "Aliado comercial", "Alianza comercial"],
      ["FaUtensils", "Locales gastronómicos", "Restaurantes y cafeterías de Temuco y zona lacustre", "Proveedor privado", "Convenio de alimentación"],
      ["FaLandmark", "Municipalidad de Temuco y SERNATUR Araucanía", "Permisos de parada, información de cierres y difusión oficial", "Actor público", "Coordinación institucional"],
      ["FaShieldAlt", "Seguridad municipal y Carabineros", "Resguardo en zonas de embarque nocturno y vías de evacuación", "Actor público", "Coordinación e información"],
      ["FaUsers", "Clientes / asistentes", "Compran el pack, respetan horarios y normas de convivencia", "Demanda", "Compra directa B2C"],
    ];
    for (let i = 0; i < 6; i++) {
      const x = 0.6 + (i % 3) * 4.07, y = 1.6 + Math.floor(i / 3) * 2.15, w = 3.9, h = 1.98;
      card(s, x, y, w, h, i === 5 ? { fill: K.panel2, line: K.violet } : {});
      await iconCircle(s, ac[i][0], x + 0.2, y + 0.2, 0.6, i >= 3 && i < 5 ? K.blueD : K.violet);
      s.addText(ac[i][1], { x: x + 0.95, y: y + 0.15, w: w - 1.1, h: 0.7, fontSize: 14, bold: true, color: K.white, margin: 0, valign: "middle", isTextBox: true });
      s.addText(ac[i][2], { x: x + 0.2, y: y + 0.92, w: w - 0.35, h: 0.6, fontSize: 12, color: K.muted, margin: 0, valign: "top", isTextBox: true });
      tag(s, ac[i][3].toUpperCase(), x + 0.2, y + 1.55, 1.6, K.panel2, K.lilac);
      s.addText(ac[i][4], { x: x + 1.9, y: y + 1.55, w: w - 2.05, h: 0.3, fontSize: 11, bold: true, color: K.blue, align: "right", valign: "middle", margin: 0, isTextBox: true });
    }
    s.addText("Alojamiento y seguros adicionales no forman parte del servicio descrito en el informe (salidas de día). Para viajes a Santiago o Concepción quedan por definir.",
      { x: 0.6, y: 5.95, w: 12.1, h: 0.5, fontSize: 11.5, italic: true, color: K.amber, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 4 y 5.1.");
    s.addNotes("INTEGRANTE 3 (≈0:40). Presentar los seis actores agrupados en proveedores, aliados, actores públicos y demanda. Mencionar con honestidad que alojamiento no aplica al servicio actual.");
  }

  // 13. Mapa de relaciones
  {
    const s = content(SEC3, "Mapa de relaciones funcionales", "INTEGRANTE 3  ·  CRITERIO 2.1.2  ·  TIPO DE VÍNCULO ENTRE SOUND TRAVEL Y CADA ACTOR", 3);
    const cx = 6.665, cy = 3.85;
    const N = [
      ["FaShuttleVan", "Transporte terrestre", "Minibuses y conductores", 1.25, 2.15, "Contratación B2B", "c"],
      ["FaTicketAlt", "Ticketeras y productoras", "Entradas oficiales", 10.05, 2.15, "Alianza comercial", "c"],
      ["FaUtensils", "Locales gastronómicos", "En ruta / sunset", 1.25, 4.95, "Convenio de alimentación", "c"],
      ["FaLandmark", "Municipio / SERNATUR", "Permisos y difusión", 10.05, 4.95, "Coordinación institucional", "i"],
      ["FaShieldAlt", "Seguridad local", "Seg. municipal · Carabineros", 5.6, 1.45, "Información y resguardo", "i"],
      ["FaUsers", "Clientes / asistentes", "Venta directa B2C", 5.6, 5.5, "Compra + información", "c"],
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
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 5, Figura 3. Seguridad local se muestra por separado para mayor claridad.", 6.85);
    s.addNotes("INTEGRANTE 3 (≈1:00). Explicar que Sound Travel está al centro porque es quien contrata, coordina e informa. Diferenciar líneas continuas (contrato/comercio) y punteadas (coordinación/información).");
  }

  // 14. Responsabilidades de proveedores
  {
    const s = content(SEC3, "Responsabilidades de los proveedores", "INTEGRANTE 3  ·  CRITERIO 2.1.2  ·  QUÉ APORTA Y QUÉ RECIBE CADA PROVEEDOR", 3);
    const P = [
      ["FaShuttleVan", "Transporte terrestre", "Contratación de servicio",
        ["Máquinas limpias y con revisión técnica vigente", "Choferes profesionales y descansados", "Cumplir horarios de ida y regreso"],
        ["Rutas, horarios y nómina", "Reserva anticipada y pago en fecha"]],
      ["FaTicketAlt", "Ticketeras y productoras", "Alianza comercial",
        ["Emitir y validar códigos QR o entradas físicas", "Asegurar bloques de entradas reales", "Informar apertura de puertas"],
        ["Nómina de pasajeros con entradas asignadas", "Pago en fecha"]],
      ["FaUtensils", "Locales gastronómicos", "Convenio de prestación",
        ["Recibir a los grupos antes del concierto o en salidas sunset", "Mesas y menús listos para no atrasar el itinerario"],
        ["Horario de llegada y cantidad de pasajeros", "Pago de reserva 72–24 h antes"]],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.07, w = 3.9;
      card(s, x, 1.6, w, 4.95);
      await iconCircle(s, P[i][0], x + 0.22, 1.8, 0.62, K.violet);
      s.addText([T(P[i][1], { bold: true, fontSize: 15, color: K.white, breakLine: true }), T(P[i][2], { fontSize: 11.5, color: K.blue, bold: true })],
        { x: x + 1.0, y: 1.75, w: w - 1.15, h: 0.75, margin: 0, valign: "middle", isTextBox: true });
      s.addText("RESPONSABILIDADES", { x: x + 0.22, y: 2.65, w: 3.4, h: 0.25, fontSize: 10, bold: true, color: K.lilac, charSpacing: 1, margin: 0, isTextBox: true });
      s.addText(P[i][3].map((t, j) => T(t, { bullet: true, breakLine: j < P[i][3].length - 1 })),
        { x: x + 0.22, y: 2.95, w: w - 0.4, h: 1.75, fontSize: 13, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 5, isTextBox: true });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: 4.8, w: w - 0.3, h: 1.6, rectRadius: 0.08, fill: { color: K.panel2 }, line: { color: K.panel2 }, objectName: "Recibe" });
      s.addText("RECIBE DE SOUND TRAVEL", { x: x + 0.3, y: 4.9, w: 3.4, h: 0.25, fontSize: 10, bold: true, color: K.blue, charSpacing: 1, margin: 0, isTextBox: true });
      s.addText(P[i][4].map((t, j) => T(t, { bullet: true, breakLine: j < P[i][4].length - 1 })),
        { x: x + 0.3, y: 5.2, w: w - 0.55, h: 1.1, fontSize: 12.5, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 4, isTextBox: true });
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3.1, 4, 5.1 y 6.1.");
    s.addNotes("INTEGRANTE 3 (≈0:50). Mostrar que la relación es de doble vía: cada proveedor tiene obligaciones y, a la vez, depende de la información y los pagos que entrega la agencia.");
  }

  // 15. Coordinación institucional y comercial
  {
    const s = content(SEC3, "Coordinación institucional y comercial", "INTEGRANTE 3  ·  CRITERIO 2.1.2  ·  ALIANZAS, INFORMACIÓN Y CANALES DE VENTA", 3);
    card(s, 0.6, 1.6, 6.4, 4.95);
    s.addText("COORDINACIÓN INSTITUCIONAL", { x: 0.85, y: 1.78, w: 5.5, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText("Municipalidad de Temuco · SERNATUR Araucanía · Seguridad municipal · Carabineros", { x: 0.85, y: 2.12, w: 6.0, h: 0.5, fontSize: 13, bold: true, color: K.white, margin: 0, isTextBox: true });
    const ins = [
      ["FaRoad", "Calles cerradas durante el evento"],
      ["FaParking", "Dónde se autoriza estacionar buses turísticos"],
      ["FaDoorOpen", "Vías de evacuación y permisos de parada segura"],
      ["FaShieldAlt", "Resguardo policial en zonas de embarque nocturno"],
      ["FaBullhorn", "Difusión oficial del servicio"],
    ];
    for (let i = 0; i < 5; i++) {
      const y = 2.75 + i * 0.6;
      await iconCircle(s, ins[i][0], 0.85, y, 0.45, K.panel2, HEX.blue);
      s.addText(ins[i][1], { x: 1.45, y, w: 5.4, h: 0.45, fontSize: 13, color: K.white, margin: 0, valign: "middle", isTextBox: true });
    }
    tag(s, "RELACIÓN PROPUESTA · SIN CONVENIOS FIRMADOS", 0.85, 6.03, 3.6);
    card(s, 7.2, 1.6, 5.5, 4.95, { fill: K.panel2 });
    s.addText("COMERCIALIZACIÓN · MODELO B2C", { x: 7.45, y: 1.78, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const ch = [["FaInstagram", "Instagram"], ["FaTiktok", "TikTok"], ["FaGlobe", "Página web"], ["FaWhatsapp", "WhatsApp Business"]];
    for (let i = 0; i < 4; i++) {
      const x = 7.45 + i * 1.28;
      await iconCircle(s, ch[i][0], x + 0.22, 2.25, 0.7, K.violet);
      s.addText(ch[i][1], { x: x - 0.05, y: 3.02, w: 1.25, h: 0.45, fontSize: 11, color: K.white, align: "center", valign: "top", margin: 0, isTextBox: true });
    }
    s.addText([
      T("Difusión del “Pack Evento” en redes sociales.", { bullet: true, breakLine: true }),
      T("Cotización y asesoría de horarios por WhatsApp.", { bullet: true, breakLine: true }),
      T("Cierre de venta online y envío de voucher digital.", { bullet: true, breakLine: true }),
      T("Bloques de entradas oficiales vía alianza con ticketeras.", { bullet: true }),
    ], { x: 7.45, y: 3.65, w: 5.05, h: 2.75, fontSize: 13.5, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 8, isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 4, 5.1 y 3.2.");
    s.addNotes("INTEGRANTE 3 (≈0:45). Lo institucional entrega información y permisos; lo comercial trae al cliente. Aclarar que los vínculos institucionales son propuestas de una empresa ficticia.");
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
    s.addNotes("INTEGRANTE 3 (≈0:45). Cada necesidad tiene una respuesta concreta y un actor responsable. La cadena muestra la interdependencia. Transición al Integrante 4: «¿con qué criterios aseguramos que cada eslabón cumpla?».");
  }

  // =====================================================================
  // INTEGRANTE 4
  // =====================================================================
  const SEC4 = "Integrante 4 · Criterios, seguimiento y cierre";
  pres.addSection({ title: SEC4 });

  // 17. Estándares técnicos y normativos
  {
    const s = content(SEC4, "Estándares técnicos y normativos", "INTEGRANTE 4  ·  CRITERIO 2.1.3  ·  CRITERIOS PARA ASIGNAR TAREAS", 4);
    card(s, 0.6, 1.6, 4.6, 4.95);
    s.addText("ESTÁNDARES TÉCNICOS", { x: 0.85, y: 1.78, w: 4.1, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText("Checklist del minibús antes de cada salida (Jefe de Operaciones)", { x: 0.85, y: 2.15, w: 4.1, h: 0.55, fontSize: 13.5, bold: true, color: K.white, margin: 0, isTextBox: true });
    const ck = ["Neumáticos", "Cinturones de seguridad", "Botiquín", "Calefacción / aire acondicionado"];
    for (let i = 0; i < 4; i++) {
      const y = 2.8 + i * 0.42;
      s.addImage({ data: await icon("FaCheckCircle", HEX.green), x: 0.9, y: y + 0.05, w: 0.26, h: 0.26 });
      s.addText(ck[i], { x: 1.3, y, w: 3.7, h: 0.36, fontSize: 13, color: K.white, margin: 0, valign: "middle", isTextBox: true });
    }
    s.addText([
      T("Nómina digital de pasajeros", { bold: true, color: K.white, breakLine: true }),
      T("Control de lista sin papel en el embarque.", { color: K.muted, breakLine: true }),
      T("Pulsera de color según número de bus", { bold: true, color: K.white, breakLine: true }),
      T("Evita que los asistentes se pierdan al salir de noche.", { color: K.muted }),
    ], { x: 0.85, y: 4.6, w: 4.15, h: 1.8, fontSize: 13, margin: 0, valign: "top", paraSpaceAfter: 3, isTextBox: true });
    // Normativa
    s.addText("ESTÁNDARES NORMATIVOS", { x: 5.5, y: 1.62, w: 7.0, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const N = [
      ["FaRegIdBadge", "Registro Nacional de Prestadores de Servicios Turísticos (SERNATUR)", "Ley N° 20.423 (2010), Título VII. Para agencias la inscripción es voluntaria (art. 33); es obligatoria para alojamiento y turismo aventura. Sound Travel se propone inscribirse."],
      ["FaBus", "Transporte privado remunerado de pasajeros", "D.S. N° 80 (2004) del MTT: se exige a todas las empresas de minibuses subcontratadas."],
      ["FaIdCard", "Licencia profesional de conductor", "Clase A2 (10 a 17 asientos) o A3 (sin límite de asientos), según la Ley N° 18.290 de Tránsito, art. 12."],
      ["FaShieldAlt", "Seguro obligatorio y documentos", "SOAP vigente (Ley N° 18.490) y revisión técnica al día."],
    ];
    for (let i = 0; i < 4; i++) {
      const y = 2.0 + i * 1.02;
      card(s, 5.5, y, 7.2, 0.92, { shadow: false });
      await iconCircle(s, N[i][0], 5.68, y + 0.18, 0.55, K.violet);
      s.addText([T(N[i][1], { bold: true, fontSize: 12.5, color: K.white, breakLine: true }), T(N[i][2], { fontSize: 11, color: K.muted })],
        { x: 6.4, y: y + 0.04, w: 6.2, h: 0.84, margin: 0, valign: "middle", isTextBox: true });
    }
    s.addText("Ajuste al informe: el registro se regula en el Título VII de la Ley 20.423 (no en el art. 19) y las clases de licencia en la Ley 18.290 (no en el D.S. 80). Revisar texto vigente en bcn.cl.",
      { x: 5.5, y: 6.1, w: 7.2, h: 0.45, fontSize: 10.5, italic: true, color: K.amber, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuentes: Informe Operativo Sound Travel (2026), secc. 6 · Ley 20.423 · D.S. 80/2004 MTT · Ley 18.290 · Ley 18.490 · SERNATUR, Portal de Servicios Turísticos.");
    s.addNotes("INTEGRANTE 4 (≈0:50). Explicar que estos estándares definen quién hace qué: el Jefe de Operaciones verifica, los transportistas cumplen la norma de transporte, el guía usa la nómina digital. Mencionar las correcciones de citas: muestran revisión crítica de las fuentes.");
  }

  // 18. Sustentabilidad y territorio
  {
    const s = content(SEC4, "Sustentabilidad y contexto territorial", "INTEGRANTE 4  ·  CRITERIO 2.1.3  ·  OPERAR EN LA ARAUCANÍA", 4);
    s.addImage({ data: await photo("1532274402911-5a369e4c4bb5", 5.6, 4.95), x: 7.1, y: 1.6, w: 5.6, h: 4.95, altText: "Volcanes y lago al atardecer (imagen referencial)" });
    s.addShape(pres.shapes.RECTANGLE, { x: 7.1, y: 1.6, w: 5.6, h: 4.95, fill: { color: K.bg, transparency: 30 }, line: { color: K.bg, transparency: 100 } });
    s.addText("CONTEXTO TERRITORIAL", { x: 7.35, y: 1.78, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const risk = [["FaCloudRain", "Lluvias repentinas"], ["FaSmog", "Neblina nocturna en la Ruta 5 Sur"], ["FaCarSide", "Alta congestión en la ruta CH-199 (Villarrica–Pucón) en verano"]];
    for (let i = 0; i < 3; i++) {
      const y = 2.15 + i * 0.62;
      await iconCircle(s, risk[i][0], 7.35, y, 0.5, K.blueD);
      s.addText(risk[i][1], { x: 8.0, y: y - 0.05, w: 4.55, h: 0.6, fontSize: 13.5, bold: true, color: K.white, margin: 0, valign: "middle", isTextBox: true });
    }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.3, y: 4.25, w: 5.2, h: 2.1, rectRadius: 0.1, fill: { color: K.bg, transparency: 15 }, line: { color: K.blue, width: 1 }, objectName: "Medidas" });
    s.addText([
      T("Medidas", { bold: true, color: K.blue, fontSize: 12.5, breakLine: true }),
      T("Puntos de encuentro céntricos, iluminados y seguros: sector Avenida Alemania o Plaza Teodoro Schmidt.", { bullet: true, color: K.white, breakLine: true }),
      T("Salida con margen de tiempo para evitar tacos en los accesos al recinto.", { bullet: true, color: K.white }),
    ], { x: 7.5, y: 4.35, w: 4.85, h: 1.9, fontSize: 13, margin: 0, valign: "top", paraSpaceAfter: 4, isTextBox: true });
    s.addText("SUSTENTABILIDAD", { x: 0.6, y: 1.62, w: 6.0, h: 0.3, fontSize: 12, bold: true, color: K.blue, charSpacing: 2, margin: 0, isTextBox: true });
    const sus = [
      ["FaRecycle", "Regla “Viaje Limpio”", "Bolsas de reciclaje a bordo de cada minibús.", "AMBIENTAL"],
      ["FaMobileAlt", "Cero papel", "Tickets y credenciales digitales en el celular.", "AMBIENTAL"],
      ["FaStore", "Gasto que queda en la región", "Convenios con emprendimientos gastronómicos locales de Temuco y zona lacustre.", "ECONÓMICA"],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.0 + i * 1.5;
      card(s, 0.6, y, 6.25, 1.35);
      await iconCircle(s, sus[i][0], 0.82, y + 0.3, 0.7, K.green, HEX.ink);
      s.addText([T(sus[i][1], { bold: true, fontSize: 14.5, color: K.white, breakLine: true }), T(sus[i][2], { fontSize: 12.5, color: K.muted })],
        { x: 1.75, y: y + 0.1, w: 3.55, h: 1.15, margin: 0, valign: "middle", isTextBox: true });
      tag(s, sus[i][3], 5.35, y + 0.52, 1.3, K.panel2, K.green);
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 6. Imagen referencial (no corresponde a La Araucanía) · Unsplash.");
    s.addNotes("INTEGRANTE 4 (≈0:40). La sustentabilidad tiene foco ambiental y económico local. El territorio condiciona horarios, rutas y la elección de puntos de encuentro.");
  }

  // 19. Matriz de tareas
  {
    const s = content(SEC4, "Matriz de asignación de tareas y responsables", "INTEGRANTE 4  ·  CRITERIO 2.1.3  ·  QUIÉN HACE QUÉ, CUÁNDO Y CON QUÉ CRITERIO", 4);
    const hdr = { bold: true, color: HEX.lilac, fill: { color: HEX.panel2 }, fontSize: 11.5 };
    const c = (t, o = {}) => ({ text: t, options: Object.assign({ color: HEX.white, fontSize: 11.5, fill: { color: HEX.panel } }, o) });
    const crit = (t) => c(t, { color: HEX.blue, bold: true, fontSize: 10.5 });
    const rows = [
      [c("ETAPA", hdr), c("RESPONSABLE", hdr), c("TAREA ASIGNADA", hdr), c("CRITERIO APLICADO", hdr)],
      [c([T("Pre-operación", { bold: true, breakLine: true }), T("72 a 24 h antes", { color: HEX.muted, fontSize: 10.5 })]), c("Jefe de Operaciones y Administrativo"), c("Revisión de documentos del minibús y chofer (D.S. 80), pago de reservas al restaurante y cierre de nómina con entradas asignadas"), crit("Normativo · Técnico")],
      [c([T("Embarque e ida", { bold: true, breakLine: true }), T("Día del evento", { color: HEX.muted, fontSize: 10.5 })]), c("Guía de Terreno y Conductor"), c("Citación en punto seguro de Temuco, lista digital, pulsera identificadora y charla breve de seguridad a bordo"), crit("Técnico · Territorial · Sustentable")],
      [c([T("Durante el evento", { bold: true })]), c("Guía de Terreno"), c("Acompañamiento hasta el acceso, coordinación con seguridad municipal y permanencia en punto de asistencia"), crit("Territorial · Seguridad")],
      [c([T("Retorno nocturno", { bold: true })]), c("Guía de Terreno y Conductor"), c("Reencuentro 30 min tras el cierre del show, conteo completo de pasajeros y regreso seguro a Temuco"), crit("Técnico · Territorial")],
      [c([T("Post-evento *", { bold: true, color: HEX.amber, breakLine: true }), T("Día siguiente", { color: HEX.muted, fontSize: 10.5 })]), c("No asignado en el informe (sugerido: Comercial)", { color: HEX.amber }), c("Envío de encuesta en Google Forms: puntualidad, trato del guía y comodidad del transporte"), crit("Calidad · Mejora continua")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [2.1, 2.6, 5.3, 2.1], rowH: [0.4, 0.82, 0.82, 0.72, 0.72, 0.82], border: { type: "solid", pt: 0.75, color: HEX.line }, valign: "middle", margin: [0.05, 0.12, 0.05, 0.12], fontFace: "Calibri", objectName: "Matriz de tareas" });
    s.addText("* Fila complementaria: la etapa 5 del flujo y la encuesta están en el informe (secc. 4.1 y 7), pero no figuran en su matriz de tareas.",
      { x: 0.6, y: 6.08, w: 12.1, h: 0.4, fontSize: 11, italic: true, color: K.amber, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 6.1 (matriz original de cuatro etapas) y secc. 7.");
    s.addNotes("INTEGRANTE 4 (≈0:45). Leer la matriz por filas: etapa, responsable y criterio. Explicar por qué agregamos la fila post-evento y dejamos claro que es un complemento.");
  }

  // 20. Comunicación y seguimiento
  {
    const s = content(SEC4, "Comunicación y seguimiento: una línea de tiempo", "INTEGRANTE 4  ·  CRITERIO 2.1.3  ·  SEGUIMIENTO DE PROVEEDORES, OPERADORES Y CLIENTES", 4);
    const cols = [["T – 7 DÍAS", 3.05], ["T – 24 HORAS", 5.45], ["DÍA DEL EVENTO", 7.85], ["T + 1 DÍA", 10.6]];
    const colW = [2.25, 2.25, 2.6, 2.1];
    line(s, 3.05, 1.92, 12.7, 1.92, { color: K.violet, width: 2.5, end: "triangle" });
    cols.forEach(([t, x], i) => {
      s.addShape(pres.shapes.OVAL, { x: x - 0.09, y: 1.83, w: 0.18, h: 0.18, fill: { color: K.white }, line: { color: K.violet, width: 2 } });
      s.addText(t, { x: x + 0.12, y: 1.52, w: colW[i], h: 0.28, fontSize: 11, bold: true, color: K.white, charSpacing: 1, margin: 0, isTextBox: true });
    });
    const lanes = [
      ["FaHandshake", "Proveedores", "Jefe de Operaciones", ["Confirmación formal por correo", "Chequeo por WhatsApp Business: patentes, choferes y horarios", "", ""]],
      ["FaBroadcastTower", "Operadores", "Equipo interno", ["", "", "WhatsApp Operativo + radios. 4 hitos: bus en punto · salida completa · llegada · inicio de retorno", ""]],
      ["FaUsers", "Clientes", "Comercial y guía", ["Comprobante digital y canal de WhatsApp del bus (al comprar)", "", "Guía comparte ubicación en tiempo real a la salida", "Encuesta en Google Forms"]],
    ];
    for (let r = 0; r < 3; r++) {
      const y = 2.2 + r * 1.45, h = 1.3;
      card(s, 0.6, y, 2.3, h, { fill: K.violet, line: K.violet });
      s.addImage({ data: await icon(lanes[r][0]), x: 0.78, y: y + 0.2, w: 0.42, h: 0.42 });
      s.addText([T(lanes[r][1], { bold: true, fontSize: 14.5, color: K.white, breakLine: true }), T(lanes[r][2], { fontSize: 11, color: K.white })],
        { x: 0.78, y: y + 0.65, w: 2.0, h: 0.6, margin: 0, valign: "top", isTextBox: true });
      cols.forEach(([t, x], i) => {
        const txt = lanes[r][3][i];
        if (!txt) {
          s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x, y, w: colW[i], h, rectRadius: 0.1, fill: { color: K.panel, transparency: 60 }, line: { color: K.line, width: 0.5, dashType: "dash" }, objectName: "Celda vacía" });
          return;
        }
        card(s, x, y, colW[i], h, { shadow: false });
        s.addText(txt, { x: x + 0.12, y, w: colW[i] - 0.22, h, fontSize: 12, color: K.white, margin: 0, valign: "middle", isTextBox: true });
      });
    }
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 7. Las radios se usan en recintos donde cae la señal celular (p. ej., Estadio Germán Becker).", 6.68);
    s.addNotes("INTEGRANTE 4 (≈0:40). Leer la línea de tiempo: proveedores se confirman antes, operadores reportan hitos el día del evento, clientes son informados desde la compra hasta la encuesta.");
  }

  // 21. Contingencias
  {
    const s = content(SEC4, "Protocolo de coordinación ante contingencias", "INTEGRANTE 4  ·  CRITERIO 2.1.3  ·  RESPUESTA ANTE IMPREVISTOS", 4);
    const hdr = { bold: true, color: HEX.lilac, fill: { color: HEX.panel2 }, fontSize: 11.5 };
    const c = (t, o = {}) => ({ text: t, options: Object.assign({ color: HEX.white, fontSize: 11.5, fill: { color: HEX.panel } }, o) });
    const p = (t) => c(t, { color: HEX.amber, bold: true, fontSize: 10.5 });
    const i = (t) => c(t, { color: HEX.green, bold: true, fontSize: 10.5 });
    const rows = [
      [c("SITUACIÓN", hdr), c("RESPUESTA", hdr), c("RESPONSABLE", hdr), c("ORIGEN", hdr)],
      [c("Cortes de tránsito o mal clima (lluvia, neblina)", { bold: true }), c("Plan de contingencia preparado; salida con margen; información previa de calles cerradas"), c("Jefe de Operaciones"), i("Informe")],
      [c("Caída de señal celular en el recinto", { bold: true }), c("Comunicación por radios portátiles"), c("Guía · Equipo interno"), i("Informe")],
      [c("Emergencia durante el evento", { bold: true }), c("Guía en punto de asistencia, coordinación con seguridad municipal y vías de evacuación conocidas"), c("Guía de Terreno"), i("Informe")],
      [c("Pasajero desorientado a la salida", { bold: true }), c("Pulsera por bus, ubicación del guía en tiempo real y conteo antes de partir"), c("Guía · Conductor"), i("Informe")],
      [c("Proveedor cancela a última hora", { bold: true }), c("Mantener un transportista o local de respaldo identificado desde la etapa 3"), c("Jefe de Operaciones"), p("Propuesta")],
      [c("Pasajero no llega al reencuentro", { bold: true }), c("Contacto por WhatsApp y teléfono; tiempo de espera definido; aviso a Dirección y, si corresponde, a Carabineros"), c("Guía → Jefe de Op."), p("Propuesta")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [3.3, 5.4, 2.1, 1.3], rowH: [0.38, 0.62, 0.5, 0.62, 0.58, 0.58, 0.68], border: { type: "solid", pt: 0.75, color: HEX.line }, valign: "middle", margin: [0.04, 0.12, 0.04, 0.12], fontFace: "Calibri", objectName: "Tabla contingencias" });
    // Escalamiento
    const esc = ["Guía de Terreno", "Jefe de Operaciones", "Dirección General", "Seguridad / Carabineros"];
    s.addText("ESCALAMIENTO SUGERIDO", { x: 0.6, y: 5.72, w: 3.0, h: 0.3, fontSize: 10.5, bold: true, color: K.amber, charSpacing: 1, margin: 0, isTextBox: true });
    for (let k = 0; k < 4; k++) {
      const x = 3.3 + k * 2.4;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.68, w: 2.0, h: 0.4, rectRadius: 0.2, fill: { color: K.panel2 }, line: { color: K.amber, width: 1 }, objectName: "Escalamiento" });
      s.addText(esc[k], { x, y: 5.68, w: 2.0, h: 0.4, fontSize: 11, bold: true, color: K.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      if (k < 3) line(s, x + 2.03, 5.88, x + 2.37, 5.88, { color: K.amber, width: 1.5, end: "triangle" });
    }
    s.addText("Filas marcadas “Propuesta” y el escalamiento son un complemento del equipo: el informe no desarrolla un protocolo formal de contingencias.",
      { x: 0.6, y: 6.18, w: 12.1, h: 0.4, fontSize: 11, italic: true, color: K.amber, margin: 0, valign: "middle", isTextBox: true });
    source(s, "Fuente: Informe Operativo Sound Travel (2026), secc. 3.1, 4, 6, 6.1 y 7.");
    s.addNotes("INTEGRANTE 4 (≈0:35). Distinguir lo que está en el informe (verde) de lo que proponemos para completarlo (ámbar).");
  }

  // 22. Conclusiones
  {
    const s = content(SEC4, "Conclusiones: coordinar es anticipar", "INTEGRANTE 4  ·  CIERRE  ·  RESULTADOS POR CRITERIO", 4);
    s.addImage({ data: await photo("1459749411175-04bf5292ceea", 12.1, 1.35, { position: "centre", brightness: 1.3 }), x: 0.6, y: 1.55, w: 12.1, h: 1.35, altText: "Público frente al escenario (imagen referencial)" });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.55, w: 12.1, h: 1.35, fill: { color: K.bg, transparency: 42 }, line: { color: K.bg, transparency: 100 } });
    s.addText("Un servicio de eventos funciona solo si cada actor sabe qué hacer, cuándo hacerlo y a quién informar.", { x: 0.9, y: 1.55, w: 11.5, h: 1.35, fontSize: 19, bold: true, italic: true, color: K.white, margin: 0, valign: "middle", isTextBox: true });
    const cc = [
      ["2.1.1", "Estructuras y procesos", "Sound Travel tiene una estructura simple con cinco cargos y cuatro funciones, y un flujo de cinco etapas que conecta procesos internos con proveedores, aliados y clientes."],
      ["2.1.2", "Relaciones funcionales", "La agencia es el coordinador central: contrata transporte, se alía con ticketeras, conviene con locales y se coordina con municipio, SERNATUR y seguridad para responder a necesidades concretas del cliente."],
      ["2.1.3", "Criterios y seguimiento", "Las tareas se asignan con criterios técnicos, normativos, sustentables y territoriales, y se controlan con una línea de tiempo de seguimiento y un protocolo de contingencias."],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.07, w = 3.9;
      card(s, x, 3.15, w, 2.55);
      s.addImage({ data: await icon("FaCheckCircle", HEX.green), x: x + 0.22, y: 3.35, w: 0.42, h: 0.42 });
      s.addText("CRITERIO " + cc[i][0], { x: x + 0.75, y: 3.35, w: 2.9, h: 0.42, fontSize: 12, bold: true, color: K.blue, charSpacing: 1, valign: "middle", margin: 0, isTextBox: true });
      s.addText(cc[i][1], { x: x + 0.22, y: 3.9, w: w - 0.4, h: 0.4, fontSize: 16, bold: true, color: K.white, margin: 0, isTextBox: true });
      s.addText(cc[i][2], { x: x + 0.22, y: 4.3, w: w - 0.4, h: 1.35, fontSize: 13, color: K.muted, margin: 0, valign: "top", isTextBox: true });
    }
    card(s, 0.6, 5.88, 12.1, 0.68, { fill: K.panel2, line: K.violet, shadow: false });
    s.addText([T("Valor para La Araucanía: ", { bold: true, color: K.lilac }), T("el pack une transporte formal, entradas oficiales y gastronomía local, entregando seguridad al asistente y movimiento económico a transportistas y locales de la región.", { color: K.white })],
      { x: 0.85, y: 5.88, w: 11.6, h: 0.68, fontSize: 13, valign: "middle", margin: 0, isTextBox: true });
    source(s, "Síntesis del equipo a partir del Informe Operativo Sound Travel (2026), secc. 8. Imagen referencial · Unsplash.");
    s.addNotes("INTEGRANTE 4 (≈0:30). Cerrar conectando cada criterio con su evidencia y agradecer.");
  }

  // 23. Referencias
  {
    const s = content(SEC4, "Referencias y notas de rigor", "CIERRE  ·  FUENTES CONSULTADAS", 4);
    s.addText([
      T("INACAP. (2026). Guía de aprendizaje – Formativa Unidad 2: Acciones operativas en empresas de turismo (GTD404). Área Académica de Turismo.", { breakLine: true }),
      T("Monsalve Esparza, B. (2026). Plan de coordinación y operaciones: Agencia “Sound Travel” [Pre-informe operativo]. INACAP Sede Temuco.", { breakLine: true }),
      T("Ley N° 20.423. (2010). Del Sistema Institucional para el Desarrollo del Turismo. Diario Oficial, 12 de febrero de 2010.", { breakLine: true }),
      T("Ministerio de Transportes y Telecomunicaciones. (2004). Decreto Supremo N° 80: Reglamenta el transporte privado remunerado de pasajeros.", { breakLine: true }),
      T("Ley N° 18.290. Ley de Tránsito (art. 12, clases de licencia de conductor).", { breakLine: true }),
      T("Ley N° 18.490. Seguro obligatorio de accidentes personales causados por circulación de vehículos motorizados (SOAP).", { breakLine: true }),
      T("Subsecretaría de Turismo. (2024). Estadísticas de llegada de visitantes internacionales 2023 (citado en INACAP, 2026).", { breakLine: true }),
      T("SERNATUR. Portal de Servicios Turísticos: registro de prestadores. https://portalserviciosturisticos.sernatur.cl", { breakLine: true }),
      T("Fotografías: Unsplash (licencia Unsplash). Imágenes referenciales, no corresponden a operaciones de Sound Travel."),
    ], { x: 0.6, y: 1.55, w: 7.6, h: 5.0, fontSize: 11.5, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 6, isTextBox: true });
    card(s, 8.5, 1.55, 4.2, 3.55, { fill: K.panel2, line: K.amber, shadow: false });
    s.addText([
      T("NOTAS DE RIGOR", { bold: true, color: K.amber, fontSize: 11.5, breakLine: true }),
      T("Sound Travel es una empresa ficticia; sus convenios y alianzas son propuestas.", { bullet: true, breakLine: true }),
      T("El Festival Internacional de Temuco 2027 se usa como escenario proyectado.", { bullet: true, breakLine: true }),
      T("Se corrigieron dos citas normativas del informe (ver diapositiva 17).", { bullet: true, breakLine: true }),
      T("La fila post-evento y parte del protocolo de contingencias son complementos del equipo.", { bullet: true }),
    ], { x: 8.7, y: 1.65, w: 3.85, h: 3.4, fontSize: 12, color: K.white, margin: 0, valign: "top", paraSpaceAfter: 5, isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.5, y: 5.3, w: 4.2, h: 1.25, rectRadius: 0.12, fill: { color: K.violet }, line: { color: K.violet }, objectName: "Gracias" });
    s.addText([T("¡Gracias!", { bold: true, fontSize: 26, color: K.white, breakLine: true }), T("¿Preguntas?", { fontSize: 15, color: K.white })],
      { x: 8.5, y: 5.3, w: 4.2, h: 1.25, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addNotes("Diapositiva de apoyo: queda proyectada durante las preguntas. No requiere exposición oral.");
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("OK", OUT);
})().catch((e) => { console.error(e); process.exit(1); });

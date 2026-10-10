/**
 * MANI-GANTE · Google Apps Script
 *
 * doGet  → entrega el stock (igual que la versión actual: { ok, actualizado, sabores: [...] }).
 * doPost → NUEVO: guarda cada reserva en la pestaña "Reservas".
 *
 * Cómo usarlo:
 * 1. Si ya tienes un doGet funcionando, NO lo reemplaces: copia solo doPost y getReservasSheet_.
 * 2. Implementar → Administrar implementaciones → Editar → Nueva versión → Implementar.
 * 3. Copia la URL /exec en la variable RESERVATIONS_WEBHOOK_URL de Netlify.
 */

const STOCK_SHEET = "Sabores"; // columnas: id | nombre | disponible | topVentas | orden | categoria

function doGet() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(STOCK_SHEET);
  const [header, ...rows] = sheet.getDataRange().getValues();
  const keys = header.map(String);
  const sabores = rows
    .filter(r => r.some(c => c !== ""))
    .map(r => Object.fromEntries(keys.map((k, i) => [k, r[i]])));
  return json_({ ok: true, actualizado: new Date().toISOString(), sabores });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action !== "reserva") return json_({ ok: false, error: "acción desconocida" });
    const sheet = getReservasSheet_();
    sheet.appendRow([
      new Date(),
      data.code,
      data.name,
      data.date,
      data.time,
      data.meetingPoint,
      data.format,
      (data.lines || []).map(l => `${l.name} x${l.qty}`).join(", "),
      data.bags,
      data.total,
      data.origin,
      "Pendiente de pago",
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getReservasSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName("Reservas");
  if (!sheet) {
    sheet = ss.insertSheet("Reservas");
    sheet.appendRow(["Creada", "Código", "Nombre", "Fecha", "Hora", "Punto", "Formato", "Detalle", "Bolsas", "Total", "Origen", "Estado"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * NUEVO · Aviso instantáneo de stock a la web (webhook).
 * 1. En Apps Script → Configuración del proyecto → Propiedades de secuencia de comandos, agrega:
 *      SITE_URL = https://manigante.netlify.app
 *      STOCK_SECRET = (el mismo valor que STOCK_WEBHOOK_SECRET en Netlify)
 * 2. Activadores → Agregar activador → función "pushStock" → Desde hoja de cálculo → Al editar.
 * Así, apenas marcas "disponible", la web y el asistente lo ven al tiro y se avisa a quienes esperaban ese sabor.
 */
function pushStock() {
  const props = PropertiesService.getScriptProperties();
  const site = props.getProperty("SITE_URL");
  const secret = props.getProperty("STOCK_SECRET");
  if (!site || !secret) return;
  const sheet = SpreadsheetApp.getActive().getSheetByName(STOCK_SHEET);
  const [header, ...rows] = sheet.getDataRange().getValues();
  const keys = header.map(String);
  const sabores = rows.filter(r => r.some(c => c !== "")).map(r => Object.fromEntries(keys.map((k, i) => [k, r[i]])));
  UrlFetchApp.fetch(site + "/api/stock", {
    method: "post",
    contentType: "application/json",
    headers: { "x-stock-secret": secret },
    payload: JSON.stringify({ sabores }),
    muteHttpExceptions: true,
  });
}

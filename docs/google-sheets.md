# Registro automático en Google Sheets

Cada vez que alguien deja sus datos en el sitio, se agrega una fila en una planilla de Google Sheets, en una pestaña por tipo:

| Pestaña | Viene de |
|---|---|
| `contacto` | Formulario de contacto |
| `cotizacion` | Cotizaciones de Vaeru IA (servicios, rango estimado y lo que escribió la persona) |
| `diagnostico` | Diagnóstico gratuito (puntaje y respuestas) |

Además, todo se sigue guardando en Netlify Forms como respaldo, con aviso por correo.

## Configuración (10 minutos, una sola vez)

1. **Crear la planilla:** en Google Drive, cree una hoja nueva llamada **"Red Vaeru · Leads"**.
2. **Abrir el editor de scripts:** en la planilla, vaya a **Extensiones → Apps Script**.
3. **Pegar el código:** borre lo que aparezca y pegue el código de abajo. Cambie `CAMBIE-ESTA-CLAVE` por una clave larga inventada por usted.
4. **Publicar:** **Implementar → Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
   - Presione **Implementar** y autorice con su cuenta de Google.
5. **Copiar la URL** de la aplicación web (termina en `/exec`).
6. **Variables en Netlify** (Site configuration → Environment variables):
   - `SHEETS_WEBHOOK_URL` = la URL copiada.
   - `SHEETS_SECRET` = la misma clave del paso 3.
7. **Probar:** vuelva a publicar el sitio (Deploys → Trigger deploy) y envíe una cotización de prueba. Debería aparecer una fila nueva en segundos.

```javascript
// Red Vaeru · registro de leads en Google Sheets
const SECRET = 'CAMBIE-ESTA-CLAVE';
const COLUMNS = {
  contacto: ['fecha', 'nombre', 'whatsapp', 'correo', 'negocio', 'servicio', 'mensaje', 'origen'],
  cotizacion: ['fecha', 'nombre', 'whatsapp', 'negocio', 'servicios', 'estimacion', 'conversacion', 'origen'],
  diagnostico: ['fecha', 'nombre', 'whatsapp', 'puntaje', 'respuestas', 'origen'],
};

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  if (body.secret !== SECRET) return respond({ ok: false, error: 'no autorizado' });
  const row = body.row || {};
  const cols = COLUMNS[row.formulario];
  if (!cols) return respond({ ok: false, error: 'formulario desconocido' });

  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName(row.formulario) || book.insertSheet(row.formulario);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(cols.concat(['estado', 'notas']));
    sheet.getRange(1, 1, 1, cols.length + 2).setFontWeight('bold').setBackground('#C4A35A');
    sheet.setFrozenRows(1);
  }
  const values = cols.map((c) => (c === 'fecha' ? new Date(row.fecha) : row[c] || ''));
  sheet.appendRow(values.concat(['Nuevo', '']));
  return respond({ ok: true });
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

## Uso diario
- Las columnas **estado** y **notas** son suyas: marque "Contactado", "Propuesta enviada", "Cerrado" o "Perdido", y la planilla se convierte en su CRM.
- Puede descargarla como Excel cuando quiera: **Archivo → Descargar → Microsoft Excel (.xlsx)**.

## Lo mismo, como servicio para sus clientes
Esta misma automatización (cada reserva registrada sola en Google Sheets) es parte del servicio **Automatización e IA** (`/servicios/automatizacion-ia-turismo/`). Para un alojamiento, las columnas serían: fecha de reserva, huésped, WhatsApp, llegada, salida, unidad, adultos, niños, canal y monto.

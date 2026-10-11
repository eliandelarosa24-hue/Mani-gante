// Registra cada lead (contacto, cotización de Vaeru IA o diagnóstico) como una fila en Google Sheets.
// Envía los datos a un Apps Script publicado como aplicación web (ver docs/google-sheets.md).
// Variables de entorno: SHEETS_WEBHOOK_URL (URL del Apps Script) y SHEETS_SECRET (clave compartida).
const FORMS = {
  contacto: ['nombre', 'whatsapp', 'correo', 'negocio', 'servicio', 'mensaje'],
  cotizacion: ['nombre', 'whatsapp', 'negocio', 'servicios', 'estimacion', 'conversacion'],
  diagnostico: ['nombre', 'whatsapp', 'puntaje', 'respuestas'],
};
const MAX = 2000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export function buildRow(body) {
  const fields = FORMS[body?.form];
  if (!fields) return null;
  const data = body.data && typeof body.data === 'object' ? body.data : {};
  if (data['bot-field']) return null; // trampa para bots
  const row = { formulario: body.form, fecha: new Date().toISOString() };
  for (const f of fields) row[f] = String(data[f] ?? '').trim().slice(0, MAX);
  if (!row.nombre || row.whatsapp.replace(/\D/g, '').length < 8) return null;
  row.origen = String(body.origen ?? '').slice(0, 200);
  return row;
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }
  const row = buildRow(body);
  if (!row) return json({ error: 'Datos incompletos' }, 400);

  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return json({ ok: true, sheets: 'not_configured' }, 202);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: process.env.SHEETS_SECRET || '', row }),
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(String(res.status));
    return json({ ok: true });
  } catch (err) {
    console.error('Google Sheets no respondió', err);
    return json({ ok: false }, 502);
  }
};

export const config = {
  path: '/api/lead',
  method: 'POST',
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 6 },
};

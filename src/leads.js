// Envío de leads: se guardan en Netlify Forms (respaldo y avisos por correo)
// y, en paralelo, se registran como fila en Google Sheets mediante /api/lead.
import { track } from './analytics.js';

export async function submitLead(form, data, source = form) {
  const body = new URLSearchParams({ 'form-name': form, ...data });
  const sheets = fetch('/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ form, data, origen: location.pathname }),
    keepalive: true,
  }).catch(() => null);
  let ok = false;
  try {
    const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    ok = res.ok;
  } catch { ok = false; }
  if (!ok) {
    // Si Netlify Forms no está disponible, basta con que Google Sheets lo haya recibido.
    const res = await sheets;
    ok = !!res && res.ok && (await res.clone().json().catch(() => ({}))).ok === true;
  }
  if (ok) track('lead_submitted', { source });
  return ok;
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import handler, { buildRow, config } from '../netlify/functions/lead.mjs';

const post = (body) => handler(new Request('http://x/api/lead', { method: 'POST', body: JSON.stringify(body) }));

test('arma la fila solo con campos permitidos y valida nombre y WhatsApp', () => {
  const row = buildRow({ form: 'cotizacion', data: { nombre: ' Ana ', whatsapp: '+56 9 1234 5678', servicios: 'Web', extra: 'x' }, origen: '/' });
  assert.equal(row.formulario, 'cotizacion');
  assert.equal(row.nombre, 'Ana');
  assert.equal(row.extra, undefined);
  assert.equal(buildRow({ form: 'otro', data: { nombre: 'A', whatsapp: '12345678' } }), null);
  assert.equal(buildRow({ form: 'contacto', data: { nombre: 'A', whatsapp: '123' } }), null);
  assert.equal(buildRow({ form: 'contacto', data: { nombre: 'A', whatsapp: '12345678', 'bot-field': 'spam' } }), null);
});

test('sin Google Sheets configurado responde 202 sin fallar', async () => {
  delete process.env.SHEETS_WEBHOOK_URL;
  const res = await post({ form: 'diagnostico', data: { nombre: 'Ana', whatsapp: '+56912345678', puntaje: '40/100' } });
  assert.equal(res.status, 202);
  assert.equal((await post({ form: 'diagnostico', data: {} })).status, 400);
});

test('reenvía la fila al Apps Script con la clave secreta', async () => {
  let received;
  const server = http.createServer(async (req, res) => {
    let b = ''; for await (const c of req) b += c;
    received = JSON.parse(b);
    res.setHeader('content-type', 'application/json');
    res.end('{"ok":true}');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  process.env.SHEETS_WEBHOOK_URL = `http://127.0.0.1:${server.address().port}/exec`;
  process.env.SHEETS_SECRET = 'clave';
  const res = await post({ form: 'contacto', data: { nombre: 'Luis', whatsapp: '+56987654321', mensaje: 'Hola' } });
  server.close();
  delete process.env.SHEETS_WEBHOOK_URL;
  assert.equal(res.status, 200);
  assert.equal(received.secret, 'clave');
  assert.equal(received.row.nombre, 'Luis');
  assert.equal(received.row.formulario, 'contacto');
});

test('la ruta tiene límite de uso', () => {
  assert.equal(config.path, '/api/lead');
  assert.ok(config.rateLimit.windowLimit > 0);
});

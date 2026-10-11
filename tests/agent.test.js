// Prueba la función del agente contra un servidor que imita la API de Anthropic.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

let server, calls = [];
before(async () => {
  server = http.createServer(async (req, res) => {
    let body = '';
    for await (const c of req) body += c;
    const json = JSON.parse(body);
    calls.push({ json, headers: req.headers });
    const toolTurn = calls.length === 1;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({
      id: 'msg_' + calls.length, type: 'message', role: 'assistant', model: json.model,
      stop_reason: toolTurn ? 'tool_use' : 'end_turn', stop_sequence: null,
      usage: { input_tokens: 10, output_tokens: 10 },
      content: toolTurn
        ? [{ type: 'thinking', thinking: '', signature: 'sig' }, { type: 'tool_use', id: 'tu_1', name: 'calcular_presupuesto', input: { items: [{ service: 'web_alojamiento', tier: 'completo', addons: [{ id: 'reservas' }] }] } }]
        : [{ type: 'text', text: 'Le estimo entre $600.000 y $1.050.000.' }],
    }));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${server.address().port}`;
  process.env.ANTHROPIC_API_KEY = 'test-key';
});
after(() => server.close());

const call = async (body) => {
  const { default: handler } = await import('../netlify/functions/agent.mjs');
  const res = await handler(new Request('http://x/api/agent', { method: 'POST', body: JSON.stringify(body) }));
  return { status: res.status, data: await res.json() };
};

test('ejecuta la herramienta y devuelve respuesta con estimación', async () => {
  const { status, data } = await call({ messages: [{ role: 'user', content: 'Quiero un sitio para mis cabañas con reservas' }] });
  assert.equal(status, 200);
  assert.match(data.reply, /600\.000/);
  assert.equal(data.estimate.oneTime.min, 600000);
  assert.equal(calls.length, 2);
  const second = calls[1].json;
  assert.equal(second.messages.at(-2).content[0].type, 'thinking'); // turno del asistente sin modificar
  assert.equal(second.messages.at(-1).content[0].type, 'tool_result');
  assert.equal(second.model, 'claude-opus-5-5');
  assert.equal(second.system[0].cache_control.type, 'ephemeral');
  assert.match(calls[0].headers['anthropic-beta'], /server-side-fallback-2026-07-01/);
});

test('rechaza conversaciones inválidas', async () => {
  assert.equal((await call({ messages: [] })).status, 400);
  assert.equal((await call({ messages: [{ role: 'assistant', content: 'hola' }] })).status, 400);
});

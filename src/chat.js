// Interfaz de Vaeru IA.
// Usa el agente con Claude (/api/agent). Si no está configurado o falla, sigue en modo guiado
// con el mismo tarifario, así el cotizador funciona siempre.
import { SERVICES, estimate, formatCLP } from './pricing.js';

const WHATSAPP = '56952289117';
const API = '/api/agent';

const START_CHIPS = [
  { label: 'Sitio para mi alojamiento', service: 'web_alojamiento' },
  { label: 'Sitio para mi restaurante', service: 'web_restaurante' },
  { label: 'Asesoría turística', service: 'asesoria' },
  { label: 'Capacitar a mi equipo', service: 'capacitacion' },
  { label: 'Redes sociales', service: 'redes' },
  { label: 'Tengo una duda', faq: true },
];

const FAQ = [
  { k: /plazo|tiempo|cu[aá]nto (se )?demora|cu[aá]ndo|semanas|listo/i, a: 'Una presencia esencial toma de 1 a 2 semanas, un sitio completo de 3 a 4 y una experiencia premium de 5 a 8. El plazo corre desde que tenemos textos y fotos de su negocio.' },
  { k: /dominio|hosting|\.cl|servidor/i, a: 'El dominio se compra a su nombre (así siempre es suyo) y el hosting suele ser económico o gratuito. Ambos quedan detallados en la propuesta, sin sorpresas.' },
  { k: /pag(o|ar)|cuotas|transferencia|factura/i, a: 'Se paga en pesos chilenos (o USD fuera de Chile). La forma exacta, transferencia o cuotas, queda en la propuesta escrita antes de empezar.' },
  { k: /caribe|dominican|extranjero|fuera de chile|usd|d[oó]lar/i, a: 'Sí, trabajamos en el Caribe y República Dominicana de forma remota. Esos proyectos se cotizan en USD.' },
  { k: /presencial|online|regi[oó]n|viaj/i, a: 'Las capacitaciones son presenciales en la Araucanía (en otras regiones el traslado se cotiza aparte) u online en vivo para hasta 25 personas.' },
  { k: /cambiar|editar|actualizar|yo mismo/i, a: 'Sí, le dejamos una capacitación breve y una checklist para cambiar textos y fotos. Si prefiere no preocuparse, existe la mantención mensual desde ' + formatCLP(SERVICES.mantencion.tiers.basica.min) + '.' },
  { k: /qui[eé]n|jorge|equipo|agencia/i, a: 'Red Vaeru lo dirige Jorge Vásquez, dominicano en la Araucanía y estudiante de Ingeniería en Turismo en INACAP. Usted habla siempre con quien hace el trabajo.' },
  { k: /booking|airbnb|comisi[oó]n|ota/i, a: 'Las plataformas cobran entre 15% y 25% por reserva. Un sitio propio con WhatsApp y reserva directa le devuelve ese margen y la relación con el huésped.' },
];

const KEYWORDS = [
  { k: /restaurant|carta|men[uú]|cafeter|bar\b|comida|cocina/i, s: 'web_restaurante' },
  { k: /capacita|taller|curso|servicio al cliente|atenci[oó]n|equipo|personal/i, s: 'capacitacion' },
  { k: /asesor|consult|diagn[oó]stico|estrategia|tarifa|proyecto tur/i, s: 'asesoria' },
  { k: /redes|instagram|facebook|publicaci|social/i, s: 'redes' },
  { k: /mantenci|soporte/i, s: 'mantencion' },
  { k: /web|sitio|p[aá]gina|caba[nñ]a|hostal|glamping|hotel|lodge|alojamiento|hospedaje/i, s: 'web_alojamiento' },
];

const clean = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '');

export class Chat {
  constructor(root, { closable = false, onClose } = {}) {
    this.root = root;
    this.history = [];
    this.mode = 'ai'; // 'ai' | 'guided'
    this.busy = false;
    this.guided = null;
    this.lastEstimate = null;
    root.innerHTML = `
      <div class="chat">
        <div class="chat__head">
          <div class="chat__avatar"><svg class="mark" viewBox="0 0 64 64"><use href="#mark"/></svg></div>
          <div class="chat__title"><strong>Vaeru IA</strong><span><i class="pulse"></i> Asistente de Red Vaeru · responde al instante</span></div>
          ${closable ? '<button class="chat__close" aria-label="Cerrar">×</button>' : ''}
        </div>
        <div class="chat__log" aria-live="polite" data-lenis-prevent></div>
        <div class="chips"></div>
        <form class="chat__form">
          <input name="q" autocomplete="off" placeholder="Escriba su consulta…" aria-label="Mensaje para Vaeru IA" maxlength="1500" />
          <button type="submit" aria-label="Enviar">→</button>
        </form>
        <p class="chat__mode">Estimaciones referenciales. El precio fijo llega por escrito antes de pagar.</p>
      </div>`;
    this.log = root.querySelector('.chat__log');
    this.chips = root.querySelector('.chips');
    this.form = root.querySelector('.chat__form');
    this.input = this.form.q;
    this.form.addEventListener('submit', (e) => { e.preventDefault(); this.send(this.input.value); });
    root.querySelector('.chat__close')?.addEventListener('click', () => onClose?.());
    this.log.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
    this.bot('Hola, soy Vaeru IA. Le ayudo a estimar la inversión para su negocio turístico o a resolver dudas. ¿Qué necesita?');
    this.setChips(START_CHIPS.map((c) => ({ label: c.label, on: () => this.pickStart(c) })));
  }

  // ---------- render ----------
  scroll() { requestAnimationFrame(() => { this.log.scrollTop = this.log.scrollHeight; }); }
  bubble(cls, text) {
    const d = document.createElement('div');
    d.className = 'msg ' + cls;
    d.textContent = text;
    this.log.append(d);
    this.scroll();
    return d;
  }
  bot(text) { return this.bubble('msg--bot', clean(text)); }
  user(text) { return this.bubble('msg--user', text); }
  typing() {
    const d = document.createElement('div');
    d.className = 'msg msg--bot msg--typing';
    d.innerHTML = '<i></i><i></i><i></i>';
    this.log.append(d);
    this.scroll();
    return d;
  }
  setChips(list = [], multi = false) {
    this.chips.innerHTML = '';
    for (const c of list) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (c.done ? ' chip--done' : '');
      b.textContent = c.label;
      b.addEventListener('click', () => {
        if (multi && !c.done) { b.classList.toggle('is-on'); c.on(b.classList.contains('is-on')); return; }
        c.on();
      });
      this.chips.append(b);
    }
  }

  quote(est) {
    if (!est || !est.lines?.length) return;
    this.lastEstimate = est;
    const card = document.createElement('div');
    card.className = 'quote';
    const one = est.oneTime.max ? `${formatCLP(est.oneTime.min)} – ${formatCLP(est.oneTime.max)}` : '';
    const mon = est.monthly.max ? `${formatCLP(est.monthly.min)} – ${formatCLP(est.monthly.max)} al mes` : '';
    card.innerHTML = `
      <div class="quote__label">Estimación referencial · CLP sin IVA</div>
      ${one ? `<div class="quote__total"></div>` : ''}
      ${mon ? `<div class="quote__monthly"></div>` : ''}
      <ul></ul>
      <small>Precio fijo por escrito en la propuesta, antes de pagar nada.</small>
      <a class="btn btn--gold" target="_blank" rel="noopener">Enviar a Jorge por WhatsApp ↗</a>`;
    if (one) card.querySelector('.quote__total').textContent = one;
    if (mon) card.querySelector('.quote__monthly').textContent = mon;
    const ul = card.querySelector('ul');
    for (const l of est.lines) {
      const li = document.createElement('li');
      li.innerHTML = '<span></span><b></b>';
      li.firstChild.textContent = l.label;
      li.lastChild.textContent = `${formatCLP(l.min)} – ${formatCLP(l.max)}${l.monthly ? '/mes' : ''}`;
      ul.append(li);
    }
    const msg = [
      'Hola Jorge, vengo de Vaeru IA en el sitio de Red Vaeru.',
      'Me interesa:',
      ...est.lines.map((l) => `• ${l.label}`),
      one ? `Estimación: ${one}` : '',
      mon ? `Mensual: ${mon}` : '',
      '¿Podemos conversar la propuesta?',
    ].filter(Boolean).join('\n');
    card.querySelector('a').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    this.log.append(card);
    this.scroll();
  }

  // ---------- entrada ----------
  async send(raw) {
    const text = (raw || '').trim();
    if (!text || this.busy) return;
    this.input.value = '';
    this.user(text);
    this.setChips([]);
    if (this.mode === 'ai') {
      const ok = await this.askAI(text);
      if (ok) return;
      this.mode = 'guided';
    }
    this.guidedText(text);
  }

  async askAI(text) {
    this.busy = true;
    this.history.push({ role: 'user', content: text });
    const t = this.typing();
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: this.history }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      t.remove();
      if (!data.reply) throw new Error('empty');
      this.history.push({ role: 'assistant', content: data.reply });
      this.bot(data.reply);
      if (data.estimate) this.quote(data.estimate);
      this.setChips([
        { label: 'Enviar resumen por WhatsApp', on: () => this.whatsapp() },
        { label: 'Empezar de nuevo', on: () => this.restart() },
      ]);
      return true;
    } catch {
      t.remove();
      this.history.pop();
      return false;
    } finally {
      this.busy = false;
    }
  }

  whatsapp() {
    if (this.lastEstimate) {
      const a = this.log.querySelector('.quote:last-of-type a');
      if (a) { window.open(a.href, '_blank', 'noopener'); return; }
    }
    const last = this.history.filter((m) => m.role === 'user').map((m) => m.content).slice(-3).join(' / ');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Jorge, vengo de Vaeru IA. ' + last)}`, '_blank', 'noopener');
  }

  restart() {
    this.history = [];
    this.guided = null;
    this.bot('Partamos de nuevo. ¿Qué necesita?');
    this.setChips(START_CHIPS.map((c) => ({ label: c.label, on: () => this.pickStart(c) })));
  }

  // Las opciones rápidas van a la IA como texto; en modo guiado abren el flujo directo.
  pickStart(c) {
    if (this.mode === 'ai') { this.send(c.faq ? 'Tengo una duda' : `Quiero cotizar: ${c.label.toLowerCase()}`); return; }
    this.user(c.label);
    if (c.faq) return this.faqMenu();
    this.startService(c.service);
  }

  // ---------- modo guiado ----------
  guidedText(text) {
    if (this.guided?.step === 'participants') {
      const n = parseInt(text.replace(/\D/g, ''), 10);
      if (n > 0) return this.finishGuided({ participants: n });
    }
    if (/^tengo una duda$|^duda$|^pregunta$/i.test(text)) return this.faqMenu();
    const faq = FAQ.find((f) => f.k.test(text));
    const svc = KEYWORDS.find((k) => k.k.test(text));
    if (/precio|cotiz|presupuesto|cu[aá]nto cuesta|valor/i.test(text) && svc) return this.startService(svc.s);
    if (faq) {
      this.bot(faq.a);
      return this.setChips([...START_CHIPS.slice(0, 4).map((c) => ({ label: c.label, on: () => this.pickStart(c) })), { label: 'Hablar con Jorge', on: () => this.whatsapp() }]);
    }
    if (svc) return this.startService(svc.s);
    this.bot('Para ayudarle mejor, elija una opción o cuénteme qué tipo de negocio tiene (alojamiento, restaurante u otro proyecto turístico).');
    this.setChips(START_CHIPS.map((c) => ({ label: c.label, on: () => this.pickStart(c) })));
  }

  faqMenu() {
    this.bot('Con gusto. ¿Sobre qué tema?');
    const topics = [
      ['Plazos de entrega', 'plazo'], ['Dominio y hosting', 'dominio'], ['Formas de pago', 'pago'],
      ['Proyectos en el Caribe', 'caribe'], ['Capacitación presencial u online', 'presencial'], ['¿Quién está detrás?', 'jorge'],
    ];
    this.setChips(topics.map(([label, q]) => ({ label, on: () => { this.user(label); this.guidedText(q); } })));
  }

  startService(id) {
    const s = SERVICES[id];
    this.guided = { service: id, tier: null, addons: new Set(), step: 'tier' };
    this.bot(`${s.name}. ¿Qué alcance se parece más a lo que busca?`);
    this.setChips(Object.entries(s.tiers).map(([tid, t]) => ({
      label: t.label,
      on: () => { this.user(t.label); this.pickTier(tid); },
    })));
  }

  pickTier(tid) {
    const g = this.guided;
    g.tier = tid;
    const s = SERVICES[g.service];
    const addons = Object.entries(s.addons);
    if (!addons.length) return this.afterAddons();
    g.step = 'addons';
    this.bot('¿Quiere sumar algún extra? Marque los que necesite y presione "Listo".');
    this.setChips([
      ...addons.map(([aid, a]) => ({ label: a.label, on: (on) => (on ? g.addons.add(aid) : g.addons.delete(aid)) })),
      { label: 'Listo →', done: true, on: () => {
        const names = [...g.addons].map((a) => s.addons[a].label);
        this.user(names.length ? names.join(', ') : 'Sin extras');
        this.afterAddons();
      } },
    ], true);
  }

  afterAddons() {
    const g = this.guided;
    if (g.service === 'capacitacion') {
      g.step = 'participants';
      this.bot('¿Cuántas personas participarían en total?');
      return this.setChips([8, 15, 25, 40].map((n) => ({ label: `${n} personas`, on: () => { this.user(`${n} personas`); this.finishGuided({ participants: n }); } })));
    }
    this.finishGuided({});
  }

  finishGuided({ participants }) {
    const g = this.guided;
    const est = estimate({ items: [{ service: g.service, tier: g.tier, addons: [...g.addons], participants }] });
    const s = SERVICES[g.service];
    this.bot(`Listo. Esta es una estimación para ${s.name.toLowerCase()} (plazo aproximado: ${s.tiers[g.tier].weeks}). Si me envía el resumen, Jorge le responde en menos de 24 horas hábiles con una propuesta fija.`);
    this.quote(est);
    this.guided = null;
    this.setChips([
      { label: 'Sumar otro servicio', on: () => { this.user('Sumar otro servicio'); this.bot('¿Qué más le interesa?'); this.setChips(START_CHIPS.slice(0, 5).map((c) => ({ label: c.label, on: () => this.pickStart(c) }))); } },
      { label: 'Tengo una duda', on: () => { this.user('Tengo una duda'); this.faqMenu(); } },
    ]);
  }
}

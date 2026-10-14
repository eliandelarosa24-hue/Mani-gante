// Interfaz de Vaeru IA.
// Por defecto responde en modo local (sin costo): preguntas frecuentes, recomendación de muestra
// y cotizador guiado con el tarifario. Para activar la conversación con Claude (/api/agent, tiene costo
// por uso), defina en Netlify VITE_AI=on y ANTHROPIC_API_KEY. Si la IA falla, vuelve al modo local.
import { SERVICES, estimate, formatCLP, launchLeft, TAX_NOTE, GUARANTEE, CONTRACT_NOTE } from './pricing.js';
import { track } from './analytics.js';
import { submitLead } from './leads.js';

const WHATSAPP = '56952289117';
const API = '/api/agent';
const AI_ON = import.meta.env?.VITE_AI === 'on';
const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

const START_CHIPS = [
  { label: 'Sitio para mi alojamiento', service: 'web_alojamiento' },
  { label: 'Sitio para mi restaurante', service: 'web_restaurante' },
  { label: 'Asesoría turística', service: 'asesoria' },
  { label: 'Capacitar a mi equipo', service: 'capacitacion' },
  { label: 'Redes sociales', service: 'redes' },
  { label: 'Agente IA y automatización', service: 'automatizacion' },
  { label: 'Tengo una duda', faq: true },
];

const FAQ = [
  { k: /plazo|tiempo|cu[aá]nto (se )?demora|cu[aá]ndo|semanas|listo/i, a: 'Un sitio Esencial toma de 1 a 2 semanas, uno Completo de 3 a 4 y uno Firma de 5 a 8. El plazo corre desde que tengo los textos y fotos de su negocio.' },
  { k: /dominio|hosting|\.cl|servidor/i, a: 'Todos mis sitios incluyen dominio de regalo el primer año (.com u otras extensiones; el .cl se compra aparte) y hosting con certificado de seguridad el primer año, todo a su nombre. Desde el segundo año, la renovación se cotiza aparte o va incluida en la mantención mensual.' },
  { k: /pag(o|ar)|cuotas|transferencia|factura|boleta|iva|impuesto/i, a: 'Se paga en pesos chilenos (o USD fuera de Chile). Emito boleta o factura según lo que necesite; los impuestos y la forma de pago (transferencia o cuotas) quedan en la propuesta escrita antes de empezar.' },
  { k: /caribe|dominican|extranjero|fuera de chile|usd|d[oó]lar/i, a: 'Sí, trabajo con negocios del Caribe y República Dominicana de forma remota. Esos proyectos se cotizan en USD.' },
  { k: /presencial|online|regi[oó]n|viaj/i, a: 'Las capacitaciones son presenciales en la Araucanía (en otras regiones el traslado se cotiza aparte) u online en vivo para hasta 25 personas.' },
  { k: /cambiar|editar|actualizar|yo mismo/i, a: 'Sí, le dejo una capacitación breve y una checklist para cambiar textos y fotos. Si prefiere no preocuparse, existe la mantención mensual desde ' + formatCLP(SERVICES.mantencion.tiers.cuidado.min) + '.' },
  { k: /qui[eé]n|jorge|equipo|agencia/i, a: 'Red Vaeru es el estudio de Jorge Vásquez, dominicano en la Araucanía y estudiante de Ingeniería en Turismo en INACAP. Usted habla siempre con quien hace el trabajo.' },
  { k: /booking|airbnb|comisi[oó]n|plataforma/i, a: 'Las plataformas cobran entre 15% y 25% por reserva. Un sitio propio con WhatsApp y reserva directa le devuelve ese margen y la relación con el huésped.' },
  { k: /contrato|formal|por escrito|respaldo legal/i, a: `Sí. ${CONTRACT_NOTE}` },
  { k: /logo|logotipo|marca|identidad/i, a: () => `Si aún no tiene logo, se lo hacemos: es un servicio adicional desde ${formatCLP(SERVICES.web_alojamiento.addons.logo.min)} y se suma a cualquier plan.` },
  { k: /garant|riesgo|y si no me gusta|no me convence/i, a: `${GUARANTEE.title}: ${GUARANTEE.text}` },
  { k: /esencial|completo|firma|diferencia|qu[eé] plan|cu[aá]l (me )?conviene/i, a: 'Esencial es una página con todo lo necesario para que le escriban. Completo suma secciones, galería, mapa y reservas directas: es el que más conviene a cabañas, hostales y restaurantes. Firma es una experiencia a medida, como las muestras, para termas, hoteles boutique, viñas o glamping. Cuénteme de su negocio y le digo cuál le conviene.' },
  { k: /lanzamiento|cupo|descuento|barato/i, a: () => `Son precios de lanzamiento mientras sumo mis primeros proyectos turísticos. Quedan ${launchLeft()} cupos. A cambio pido un testimonio y permiso para mostrar el trabajo.` },
  { k: /mantenci[oó]n|mensual|despu[eé]s de publicar|soporte/i, a: () => `Hay dos planes de mantención, sin permanencia: Cuidado, ${formatCLP(SERVICES.mantencion.tiers.cuidado.min)} al mes (hosting, dominio, respaldo y un cambio al mes), y Crecimiento, ${formatCLP(SERVICES.mantencion.tiers.crecimiento.min)} al mes (los cambios del mes, su ficha de Google al día y un informe de visitas y consultas).` },
  { k: /eres (una )?(ia|persona|robot|humano)|hablo con (una )?persona|qui[eé]n responde/i, a: 'Soy Vaeru IA, el asistente virtual de Red Vaeru. Respondo dudas y armo cotizaciones referenciales; Jorge revisa personalmente cada una y le responde por WhatsApp en menos de 24 horas hábiles.' },
  { k: /^(hola|buenas|buen d[ií]a|buenas tardes|buenas noches|hey|wena)\b/i, a: 'Hola, qué gusto. Cuénteme qué tipo de negocio tiene (cabañas, restaurante, termas, hotel…) y le recomiendo un plan, o elija una opción de abajo.' },
  { k: /^(gracias|muchas gracias|ok|listo|perfecto|genial)\b/i, a: 'A usted. Si quiere avanzar, Jorge le prepara la propuesta fija por WhatsApp. Aquí estoy para lo que necesite.' },
  { k: /privacidad|mis datos|qu[eé] hacen con/i, a: 'Uso lo que me escribe solo para responderle y preparar su cotización; no comparta datos sensibles. Detalles en la política de privacidad.' },
];

// Muestra más parecida según el rubro que menciona la persona.
const SAMPLE_FOR = [
  { k: /terma|spa|piscina|pozon|aguas? calientes?|bienestar/i, slug: 'termas-rayenko', name: 'Termas Rayenko' },
  { k: /caribe|dominican|samana|punta cana|playa|villa/i, slug: 'villa-coral-samana', name: 'Villa Coral Samaná' },
  { k: /hotel|patrimon|casona|boutique/i, slug: 'hotel-casa-nogal', name: 'Hotel Casa Nogal' },
  { k: /glamping|domo|astro|estrella/i, slug: 'domos-cielo-austral', name: 'Domos Cielo Austral' },
  { k: /vi[nñ]a|vino|enoturismo|cata/i, slug: 'vina-los-robles', name: 'Viña Los Robles' },
  { k: /aventura|rafting|trekking|tour|excursi|volc[aá]n|operador|kayak/i, slug: 'pucon-aventura', name: 'Pucón Aventura' },
  { k: /pasteler|caf[eé]|kuchen|torta|panader|reposter/i, slug: 'kuchen-haus-frutillar', name: 'Kuchen Haus' },
  { k: /restaurant|cocina|carta|men[uú]|picada|bar\b/i, slug: 'fogon-mapu', name: 'Fogón Mapu' },
  { k: /contador|contab|asesor[ií]a contable|estudio jur|abogad|consultor/i, slug: 'estudio-haber', name: 'Estudio Haber' },
  { k: /caba[nñ]a|hostal|lodge|hospedaje|alojamiento|casa de arriendo|camping/i, slug: 'cabanas-lago-azul', name: 'Cabañas Lago Azul' },
];

const KEYWORDS = [
  { k: /restaurant|carta|men[uú]|cafeter|bar\b|comida|cocina/i, s: 'web_restaurante' },
  { k: /capacita|taller|curso|servicio al cliente|atenci[oó]n|equipo|personal/i, s: 'capacitacion' },
  { k: /asesor|consult|diagn[oó]stico|estrategia|tarifa|proyecto tur/i, s: 'asesoria' },
  { k: /agente|inteligencia artificial|\bia\b|automatiz|google sheets|planilla|excel|chatbot|bot\b/i, s: 'automatizacion' },
  { k: /redes|instagram|facebook|publicaci|social/i, s: 'redes' },
  { k: /mantenci|soporte/i, s: 'mantencion' },
  { k: /web|sitio|p[aá]gina|caba[nñ]a|hostal|glamping|hotel|lodge|alojamiento|hospedaje/i, s: 'web_alojamiento' },
];

const span = (a, b) => (a === b ? formatCLP(a) : `${formatCLP(a)} – ${formatCLP(b)}`);
const clean = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const rangeOf = (est) => ({
  one: est.oneTime.max ? span(est.oneTime.min, est.oneTime.max) : '',
  mon: est.monthly.max ? `${span(est.monthly.min, est.monthly.max)} al mes` : '',
});

export class Chat {
  constructor(root, { closable = false, onClose, source = 'inline' } = {}) {
    this.root = root;
    this.source = source;
    this.history = [];
    this.mode = AI_ON ? 'ai' : 'guided'; // 'ai' | 'guided'
    this.busy = false;
    this.guided = null;
    this.cart = [];
    this.lastEstimate = null;
    this.started = false;
    root.innerHTML = `
      <div class="chat">
        <div class="chat__head">
          <div class="chat__avatar"><img class="mark" src="/brand/emblema-96.webp" alt="" width="96" height="96" /></div>
          <div class="chat__title"><strong>Vaeru IA</strong><span><i class="pulse"></i> ${AI_ON ? 'Asistente de IA de Red Vaeru' : 'Asistente virtual de Red Vaeru'}</span></div>
          ${closable ? '<button class="chat__close" aria-label="Cerrar asistente">×</button>' : ''}
        </div>
        <div class="chat__log" aria-live="polite" data-lenis-prevent></div>
        <div class="chips"></div>
        <form class="chat__form">
          <input name="q" autocomplete="off" placeholder="Escriba su consulta…" aria-label="Mensaje para Vaeru IA" maxlength="1500" />
          <button type="submit" aria-label="Enviar">→</button>
        </form>
        <p class="chat__mode">${AI_ON ? 'Asistente de IA' : 'Asistente virtual'} · estimaciones referenciales · <a href="/privacidad">privacidad</a></p>
      </div>`;
    this.log = root.querySelector('.chat__log');
    this.chips = root.querySelector('.chips');
    this.form = root.querySelector('.chat__form');
    this.input = this.form.q;
    this.form.addEventListener('submit', (e) => { e.preventDefault(); this.send(this.input.value); });
    root.querySelector('.chat__close')?.addEventListener('click', () => onClose?.());
    this.bot('Hola, soy Vaeru IA, el asistente virtual de Jorge. Le ayudo a estimar la inversión para su negocio turístico o a resolver dudas. ¿Qué necesita?');
    this.startChips();
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
  user(text) {
    if (!this.started) { this.started = true; track('agent_start', { source: this.source }); }
    return this.bubble('msg--user', text);
  }
  typing() {
    const d = document.createElement('div');
    d.className = 'msg msg--bot msg--typing';
    d.setAttribute('aria-label', 'Escribiendo');
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
      if (multi && !c.done) b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        if (multi && !c.done) {
          const on = b.classList.toggle('is-on');
          b.setAttribute('aria-pressed', String(on));
          c.on(on);
          return;
        }
        c.on();
      });
      this.chips.append(b);
    }
  }
  startChips() { this.setChips(START_CHIPS.map((c) => ({ label: c.label, on: () => this.pickStart(c) }))); }
  afterQuoteChips() {
    this.setChips([
      { label: '＋ Sumar otro servicio', on: () => { this.user('Sumar otro servicio'); this.bot('¿Qué más le interesa?'); this.setChips(START_CHIPS.slice(0, 6).map((c) => ({ label: c.label, on: () => this.pickStart(c) }))); } },
      { label: 'Agendar videollamada', on: () => this.schedule() },
      { label: 'Tengo una duda', on: () => { this.user('Tengo una duda'); this.faqMenu(); } },
      { label: 'Empezar de nuevo', on: () => this.restart() },
    ]);
  }

  // ---------- tarjeta de cotización + captura del contacto ----------
  quote(est) {
    if (!est || !est.lines?.length) return;
    this.lastEstimate = est;
    track('quote_generated', { mode: this.mode, total_min: est.oneTime.min, monthly_min: est.monthly.min });
    const { one, mon } = rangeOf(est);
    const card = document.createElement('div');
    card.className = 'quote';
    card.innerHTML = `
      <div class="quote__label">Estimación referencial · precios de lanzamiento</div>
      ${one ? `<div class="quote__total">${one}</div>` : ''}
      ${mon ? `<div class="quote__monthly">${mon}</div>` : ''}
      <ul>${est.lines.map((l) => `<li><span>${esc(l.label)}</span><b>${span(l.min, l.max)}${l.monthly ? '/mes' : ''}</b></li>`).join('')}</ul>
      <form class="lead" novalidate>
        <p class="lead__title">¿Se la envío a Jorge para preparar su propuesta fija?</p>
        <div class="lead__row">
          <label><span class="sr">Nombre</span><input name="nombre" placeholder="Su nombre" autocomplete="name" required /></label>
          <label><span class="sr">WhatsApp</span><input name="whatsapp" type="tel" inputmode="tel" placeholder="WhatsApp (+56 9…)" autocomplete="tel" required /></label>
        </div>
        <label><span class="sr">Nombre del negocio</span><input name="negocio" placeholder="Nombre del alojamiento o restaurante (opcional)" /></label>
        <button class="btn btn--gold" type="submit">Enviar a Jorge</button>
        <small>Le responde en menos de 24 horas hábiles. Al enviar acepta la <a href="/privacidad">política de privacidad</a>.</small>
      </form>
      <div class="quote__actions">
        <a class="quote__link" data-wa target="_blank" rel="noopener" data-from="cotizacion">WhatsApp directo ↗</a>
        <button class="quote__link" type="button" data-print>Descargar PDF</button>
      </div>`;
    card.querySelector('[data-wa]').href = wa(this.summary(est));
    card.querySelector('[data-print]').addEventListener('click', () => this.print(est, card.querySelector('[name=nombre]').value, card.querySelector('[name=negocio]').value));
    card.querySelector('.lead').addEventListener('submit', (e) => this.sendLead(e, est));
    this.log.append(card);
    this.scroll();
  }

  summary(est, extra = {}) {
    const { one, mon } = rangeOf(est);
    return [
      'Hola Jorge, vengo de Vaeru IA en el sitio de Red Vaeru.',
      extra.nombre ? `Soy ${extra.nombre}${extra.negocio ? `, de ${extra.negocio}` : ''}.` : '',
      'Me interesa:',
      ...est.lines.map((l) => `• ${l.label}`),
      one ? `Estimación: ${one}` : '',
      mon ? `Mensual: ${mon}` : '',
      '¿Podemos conversar la propuesta?',
    ].filter(Boolean).join('\n');
  }

  async sendLead(e, est) {
    e.preventDefault();
    const f = e.target;
    const nombre = f.nombre.value.trim();
    const whatsapp = f.whatsapp.value.trim();
    if (!nombre || whatsapp.replace(/\D/g, '').length < 8) {
      f.querySelector(nombre ? '[name=whatsapp]' : '[name=nombre]').focus();
      f.classList.add('is-invalid');
      return;
    }
    const btn = f.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    const { one, mon } = rangeOf(est);
    const ok = await submitLead('cotizacion', {
      nombre,
      whatsapp,
      negocio: f.negocio.value.trim(),
      servicios: est.lines.map((l) => l.label).join(' | '),
      estimacion: [one, mon].filter(Boolean).join(' + '),
      conversacion: this.history.filter((m) => m.role === 'user').map((m) => m.content).join(' / ').slice(0, 1500),
    }, 'agente');
    if (ok) {
      f.innerHTML = `<p class="lead__ok">Listo, ${esc(nombre.split(' ')[0])}. Jorge recibió su cotización y le escribe a su WhatsApp en menos de 24 horas hábiles.</p>`;
    } else {
      // Sin Netlify Forms (por ejemplo en desarrollo), el respaldo es WhatsApp con el resumen.
      btn.disabled = false;
      btn.textContent = 'Enviar por WhatsApp';
      f.onsubmit = null;
      window.open(wa(this.summary(est, { nombre, negocio: f.negocio.value.trim() })), '_blank', 'noopener');
    }
  }

  // Cotización imprimible: el visitante la guarda como PDF desde el diálogo de impresión.
  print(est, nombre = '', negocio = '') {
    track('quote_pdf');
    const { one, mon } = rangeOf(est);
    const today = new Date();
    const until = new Date(today.getTime() + 15 * 864e5);
    const fmt = (d) => d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><html lang="es-CL"><head><meta charset="utf-8"><title>Cotización Red Vaeru</title>
      <style>
        body{font-family:Georgia,serif;color:#0b110e;max-width:720px;margin:48px auto;padding:0 24px}
        header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #c4a35a;padding-bottom:16px}
        h1{font-weight:400;font-size:34px;margin:0} small,p,td,th{font-family:Helvetica,Arial,sans-serif}
        table{width:100%;border-collapse:collapse;margin:28px 0} td,th{padding:10px 0;border-bottom:1px solid #ddd;text-align:left;font-size:14px} td:last-child,th:last-child{text-align:right;white-space:nowrap}
        .total{font-size:26px;margin:4px 0} .muted{color:#666;font-size:12px} .box{background:#f2ebdf;padding:16px 20px;border-radius:12px}
      </style></head><body>
      <header><div><small>RED VAERU · Estudio digital para turismo</small><h1>Cotización referencial</h1></div><small>${fmt(today)}</small></header>
      ${nombre || negocio ? `<p>Preparada para: <strong>${esc(nombre)}</strong>${negocio ? ` · ${esc(negocio)}` : ''}</p>` : ''}
      <table><tr><th>Servicio</th><th>Rango</th></tr>
      ${est.lines.map((l) => `<tr><td>${esc(l.label)}</td><td>${span(l.min, l.max)}${l.monthly ? '/mes' : ''}</td></tr>`).join('')}</table>
      <div class="box">${one ? `<p class="muted">Inversión única estimada</p><p class="total">${one}</p>` : ''}${mon ? `<p class="muted">Mensual estimado</p><p class="total">${mon}</p>` : ''}</div>
      <p class="muted">${esc(TAX_NOTE)} Rango válido hasta el ${fmt(until)}. El precio fijo y el alcance llegan por escrito en la propuesta, antes de pagar nada.</p>
      <p class="muted">Jorge Vásquez · Red Vaeru · WhatsApp +56 9 5228 9117 · redvaeru@gmail.com</p>
      <script>setTimeout(()=>print(),300)<\/script></body></html>`);
    w.document.close();
  }

  schedule() {
    this.user('Agendar videollamada');
    track('call_request');
    this.bot('Perfecto. Una videollamada de 15 minutos, sin costo, para ver su caso. Escríbale a Jorge con el botón y acuerdan el horario.');
    const a = document.createElement('a');
    a.className = 'btn btn--gold msg-cta';
    a.target = '_blank';
    a.rel = 'noopener';
    a.dataset.from = 'agendar';
    a.href = wa(`Hola Jorge, quiero agendar una videollamada de 15 minutos para revisar mi negocio.${this.lastEstimate ? '\n\n' + this.summary(this.lastEstimate) : ''}`);
    a.textContent = 'Agendar por WhatsApp ↗';
    this.log.append(a);
    this.scroll();
  }

  samples() {
    this.bot('Hay 10 muestras completas de distintos rubros: termas, villa en el Caribe, hotel boutique, estudio contable, cabañas, glamping, restaurante, viña, operador de aventura y pastelería. Elija la más parecida a su negocio:');
    const a = document.createElement('a');
    a.className = 'btn btn--gold msg-cta';
    a.href = '/muestras/';
    a.textContent = 'Ver las 10 muestras ↗';
    this.log.append(a);
    this.scroll();
    track('agent_samples');
    this.startChips();
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
      if (res.status === 429) {
        t.remove();
        this.history.pop();
        this.bot('Estoy recibiendo muchas consultas en este momento. Mientras tanto, le cotizo con opciones rápidas.');
        return false;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      t.remove();
      if (!data.reply) throw new Error('empty');
      this.history.push({ role: 'assistant', content: data.reply });
      this.bot(data.reply);
      if (data.estimate) { this.quote(data.estimate); this.afterQuoteChips(); }
      else this.setChips([{ label: 'Agendar videollamada', on: () => this.schedule() }, { label: 'Empezar de nuevo', on: () => this.restart() }]);
      return true;
    } catch {
      t.remove();
      this.history.pop();
      return false;
    } finally {
      this.busy = false;
    }
  }

  restart() {
    this.history = [];
    this.guided = null;
    this.cart = [];
    this.bot('Partamos de nuevo. ¿Qué necesita?');
    this.startChips();
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
    if (/agendar|llamada|reuni[oó]n|videollamada/i.test(text)) return this.schedule();
    const like = SAMPLE_FOR.find((x) => x.k.test(text));
    if (/muestra|ejemplo|portafolio|trabajos|ver sitios|referencia|se parece/i.test(text)) return like ? this.recommend(like) : this.samples();
    const faq = FAQ.find((f) => f.k.test(text));
    const svc = KEYWORDS.find((k) => k.k.test(text));
    if (/precio|cotiz|presupuesto|cu[aá]nto cuesta|valor/i.test(text) && svc) return this.startService(svc.s);
    if (faq) {
      this.bot(typeof faq.a === 'function' ? faq.a() : faq.a);
      return this.setChips([...START_CHIPS.slice(0, 4).map((c) => ({ label: c.label, on: () => this.pickStart(c) })), { label: 'Agendar videollamada', on: () => this.schedule() }]);
    }
    if (like && !/precio|cotiz|presupuesto|cu[aá]nto/i.test(text)) return this.recommend(like);
    if (svc) return this.startService(svc.s);
    this.bot('Esa se la responde mejor Jorge directo por WhatsApp. Le dejo el mensaje listo; también puede elegir una opción de abajo.');
    this.ctaLink(wa(`Hola Jorge, vengo del sitio de Red Vaeru. Tengo una consulta: ${text}`), 'Escribirle a Jorge ↗', 'duda');
    this.startChips();
  }

  ctaLink(href, label, from) {
    const a = document.createElement('a');
    a.className = 'btn btn--gold msg-cta';
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    a.dataset.from = from;
    a.href = href;
    a.textContent = label;
    this.log.append(a);
    this.scroll();
  }

  // Recomienda la muestra más parecida y el plan que suele convenir a ese rubro.
  recommend(x) {
    const firma = /termas|hotel|domos|vina|villa/.test(x.slug);
    this.bot(`Para su negocio le recomiendo mirar ${x.name}: es la muestra más parecida. ${firma ? 'Ese nivel corresponde al plan Firma, aunque también puede partir con Completo y crecer después.' : 'Para un negocio así, el plan Completo suele ser el que más conviene.'} ¿Le preparo una cotización?`);
    this.ctaLink(`/muestras/${x.slug}/`, `Ver ${x.name} ↗`, 'recomendacion');
    track('agent_sample_pick', { slug: x.slug });
    const svc = x.slug === 'fogon-mapu' || x.slug === 'kuchen-haus-frutillar' ? 'web_restaurante' : 'web_alojamiento';
    this.setChips([{ label: 'Cotizar mi sitio', on: () => { this.user('Cotizar mi sitio'); this.startService(svc); } }, { label: 'Agendar videollamada', on: () => this.schedule() }, { label: 'Tengo una duda', on: () => { this.user('Tengo una duda'); this.faqMenu(); } }]);
  }

  faqMenu() {
    this.bot('Con gusto. ¿Sobre qué tema?');
    const topics = [
      ['Plazos de entrega', 'plazo'], ['Dominio y hosting', 'dominio'], ['Pagos y boleta', 'pago'],
      ['Planes Esencial, Completo y Firma', 'qué plan'], ['Contrato', 'contrato'], ['Logo', 'logo'], ['Garantía de portada', 'garantía'], ['Mantención mensual', 'mantención'], ['Precios de lanzamiento', 'lanzamiento'], ['Ver muestras por rubro', 'muestras'], ['Proyectos en el Caribe', 'caribe'], ['¿Quién está detrás?', 'jorge'],
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
    const s = SERVICES[g.service];
    this.cart.push({ service: g.service, tier: g.tier, addons: [...g.addons], participants });
    const est = estimate({ items: this.cart });
    const multi = this.cart.length > 1;
    this.bot(multi
      ? `Sumé ${s.name.toLowerCase()} a su cotización. Este es el total actualizado con precios de lanzamiento.`
      : `Listo. Esta es una estimación con precios de lanzamiento para ${s.name.toLowerCase()} (plazo aproximado: ${s.tiers[g.tier].weeks}). Si me deja su nombre y WhatsApp, Jorge le responde en menos de 24 horas hábiles con una propuesta fija.`);
    this.quote(est);
    this.guided = null;
    this.afterQuoteChips();
  }
}

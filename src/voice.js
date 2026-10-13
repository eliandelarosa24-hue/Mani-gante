// "La voz de Red Vaeru": Vaeru IA responde las preguntas más comunes con un efecto de escritura.
// Las respuestas son fijas y honestas; los precios salen del tarifario, así nunca quedan desactualizados.
import { SERVICES, priceOf, formatCLP, GUARANTEE } from './pricing.js';

const from = (tier) => formatCLP(priceOf(SERVICES.web_alojamiento.tiers[tier]).min);
const isLaunch = () => priceOf(SERVICES.web_alojamiento.tiers.completo) !== SERVICES.web_alojamiento.tiers.completo;

const QA = [
  {
    q: '¿Por qué no me basta con Booking?',
    a: () => 'Booking le trae visibilidad, y eso sirve. El problema es que cobra entre 15% y 25% por reserva y se queda con el contacto del huésped. Un sitio propio no reemplaza a Booking: convierte a quien ya lo encontró en una reserva directa. Con 10 reservas de $80.000 al mes, son hasta $200.000 que vuelven a su bolsillo.',
  },
  {
    q: '¿Cuánto cuesta un sitio para mis cabañas?',
    a: () => `A la mayoría de las cabañas le recomiendo el plan Completo: ${isLaunch() ? `hoy, con precio de lanzamiento, parte en ${from('completo')} (precio normal desde ${formatCLP(SERVICES.web_alojamiento.tiers.completo.min)})` : `parte en ${from('completo')}`}. Si solo necesita que lo encuentren y le escriban, Esencial parte en ${from('esencial')}. Cuénteme cuántas cabañas tiene y le doy un rango exacto.`,
  },
  {
    q: '¿Y si no me gusta el diseño?',
    a: () => `No paga nada. ${GUARANTEE.text}`,
  },
  {
    q: '¿Quién está detrás de Red Vaeru?',
    a: () => 'Jorge Vásquez, dominicano en la Araucanía y estudiante de Ingeniería en Turismo en INACAP. Es un estudio pequeño a propósito: usted habla con quien diseña y construye su sitio. Yo soy su asistente de IA, y Jorge revisa personalmente cada cotización.',
  },
  {
    q: '¿Qué muestra se parece a mi negocio?',
    a: () => 'Si tiene cabañas, mire <a href="/muestras/cabanas-lago-azul/">Cabañas Lago Azul</a>. Para termas o spa, <a href="/muestras/termas-rayenko/">Termas Rayenko</a>. Para un restaurante, <a href="/muestras/fogon-mapu/">Fogón Mapu</a>. Para un hotel con historia, <a href="/muestras/hotel-casa-nogal/">Casa Nogal</a>. Y si su negocio está en el Caribe, <a href="/muestras/villa-coral-samana/">Villa Coral Samaná</a>, con precios en dólares.',
  },
];

// Escribe un HTML de a poco sin cortar etiquetas: avanza por los nodos de texto.
function typeInto(el, html, { instant, onDone }) {
  el.innerHTML = html;
  if (instant) { onDone?.(); return () => {}; }
  const nodes = [];
  const walk = (n) => n.childNodes.forEach((c) => (c.nodeType === 3 ? nodes.push([c, c.textContent]) : walk(c)));
  walk(el);
  nodes.forEach(([n]) => (n.textContent = ''));
  let i = 0, k = 0, stop = false;
  const tick = () => {
    if (stop) return;
    if (i >= nodes.length) { onDone?.(); return; }
    const [n, full] = nodes[i];
    k = Math.min(full.length, k + 2);
    n.textContent = full.slice(0, k);
    if (k >= full.length) { i++; k = 0; }
    setTimeout(tick, 14);
  };
  tick();
  return () => { stop = true; nodes.forEach(([n, full]) => (n.textContent = full)); };
}

export function initVoice(openAgent) {
  const root = document.querySelector('[data-voice]'); if (!root) return;
  const qs = root.querySelector('[data-voice-qs]'), log = root.querySelector('[data-voice-log]'), go = root.querySelector('[data-voice-go]');
  const instant = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, cancel = () => {}, timer = 0;

  qs.innerHTML = QA.map((x, i) => `<button type="button" role="tab" aria-selected="false" data-i="${i}">${x.q}</button>`).join('');
  const btns = [...qs.querySelectorAll('button')];

  const show = (i) => {
    cancel(); clearTimeout(timer);
    cur = i;
    btns.forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
    log.innerHTML = `<p class="voice__me">${QA[i].q}</p><p class="voice__ai"><span class="voice__dots" aria-hidden="true"><i></i><i></i><i></i></span></p>`;
    const ai = log.querySelector('.voice__ai');
    timer = setTimeout(() => { cancel = typeInto(ai, QA[i].a(), { instant }); }, instant ? 0 : 650);
  };
  btns.forEach((b) => b.addEventListener('click', () => show(+b.dataset.i)));
  qs.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (cur + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + QA.length) % QA.length;
    show(n); btns[n].focus();
  });
  go.addEventListener('click', () => openAgent(QA[cur].q, 'voz-vaeru'));

  // Empieza a escribir la primera respuesta cuando el panel entra en pantalla.
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); show(0); } }, { threshold: 0.35 });
  io.observe(root);
}

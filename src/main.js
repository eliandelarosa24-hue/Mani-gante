import { initShared, revealOnScroll, splitLines, $, $$, reduced, fine, gsap, ScrollTrigger, track } from './shared.js';
import { initHeroShader } from './hero-shader.js';
import { initLive } from './live.js';
import { Chat } from './chat.js';
import { fromPrice, formatCLP } from './pricing.js';
import { submitLead } from './leads.js';

const { openAgent } = initShared();

// ---------- entrada: la animación completa solo en la primera visita de la sesión ----------
function intro() {
  const loader = $('.loader');
  const heroLines = splitLines($('.hero__title'));
  let seen = false;
  try { seen = sessionStorage.getItem('rv-intro') === '1'; sessionStorage.setItem('rv-intro', '1'); } catch { /* sin almacenamiento */ }
  if (reduced) { loader?.remove(); return; }
  const tl = gsap.timeline();
  if (seen || !loader) {
    loader?.remove();
  } else {
    const counter = { v: 0 };
    tl.to(counter, { v: 100, duration: 0.9, ease: 'power2.inOut', onUpdate: () => { $('[data-count]').textContent = Math.round(counter.v); } })
      .to('.loader__line', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      .from('.loader__mark', { scale: 0.6, opacity: 0, rotate: -40, duration: 0.9, ease: 'expo.out' }, 0)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' })
      .add(() => loader.remove());
  }
  tl.from(heroLines, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out' }, seen ? 0 : '-=0.4')
    .from('.hero [data-fade]', { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, '-=0.95')
    .from('.ph', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, stagger: 0.1, ease: 'expo.inOut' }, '-=1.2')
    .from('.ph img', { scale: 1.5, duration: 1.6, stagger: 0.1, ease: 'expo.out' }, '<')
    .from('.hero__foot > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out' }, '-=1');
}

function wordsOf(el) {
  const text = el.textContent.trim().split(/\s+/);
  el.innerHTML = text.map((w) => `<span class="w">${w}</span>`).join(' ');
  return $$('.w', el);
}

function scrollAnimations() {
  if (reduced) return;
  ['a', 'b', 'c'].forEach((k, i) => gsap.to(`.ph--${k}`, { yPercent: [-18, -40, -8][i], ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));
  gsap.to('.hero__inner', { yPercent: 18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  revealOnScroll();

  $$('[data-words]').forEach((el) => {
    gsap.to(wordsOf(el), { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } });
  });
  gsap.from('.svc__row', { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.svc', start: 'top 80%' } });
  gsap.from('.ota__calc', { y: 80, rotate: 2, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ota', start: 'top 80%' } });
  gsap.from('.vs__col', { y: 60, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.vs', start: 'top 80%' } });
  gsap.from('.promise', { y: 50, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.promises', start: 'top 80%' } });
  gsap.from('.about__half', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, stagger: 0.15, ease: 'expo.inOut', scrollTrigger: { trigger: '.about__visual', start: 'top 80%' } });
  gsap.from('.about__mark', { scale: 0, rotate: -180, duration: 1.4, ease: 'expo.out', delay: 0.6, scrollTrigger: { trigger: '.about__visual', start: 'top 80%' } });
  gsap.from('.agent__panel', { y: 80, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.agent', start: 'top 70%' } });
  gsap.from('.footer__word', { yPercent: 60, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 90%' } });
  gsap.to('[data-method-bar]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true } });

  // Trabajos: desplazamiento horizontal fijado con contador (escritorio)
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      const track = $('[data-track]');
      const cards = $$('.case', track);
      const count = $('[data-work-count]');
      const bar = $('[data-work-bar]');
      const dist = () => track.scrollWidth - innerWidth;
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.work__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (st) => {
            bar.style.transform = `scaleX(${st.progress})`;
            count.textContent = String(Math.min(cards.length, Math.floor(st.progress * (cards.length - 0.01)) + 1)).padStart(2, '0');
          },
        },
      });
    },
  });
}

// ---------- calculadora de comisiones con retorno de la inversión ----------
const ota = $('[data-ota]');
const webFrom = fromPrice('web_alojamiento');
const updateOta = () => {
  const n = +ota.nights.value, r = +ota.rate.value, f = +ota.fee.value;
  const perBooking = r * (f / 100);
  const year = n * perBooking * 12;
  $('[data-out="nights"]').textContent = n;
  $('[data-out="rate"]').textContent = formatCLP(r);
  $('[data-out="fee"]').textContent = f + '%';
  $('[data-ota-total]').textContent = formatCLP(year);
  $('[data-ota-hint]').textContent = `Si solo el 30% de esas reservas llegara directo, su negocio recuperaría ${formatCLP(year * 0.3)} al año.`;
  const payback = Math.max(1, Math.ceil(webFrom / perBooking));
  $('[data-ota-payback]').textContent = `Un sitio desde ${formatCLP(webFrom)} se paga con ${payback} reserva${payback > 1 ? 's' : ''} directa${payback > 1 ? 's' : ''}.`;
};
ota.addEventListener('input', updateOta);
ota.addEventListener('change', () => track('ota_calculator', { reservas: +ota.nights.value }), { once: true });
updateOta();

// ---------- servicios: imagen que sigue al cursor y cotización directa ----------
const float = $('.svc__float');
const floatImg = float.querySelector('img');
if (fine && !reduced) {
  const xTo = gsap.quickTo(float, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(float, 'y', { duration: 0.6, ease: 'power3' });
  addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  $$('.svc__row').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      floatImg.src = row.dataset.img;
      gsap.to(float, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: 0.5, ease: 'expo.out' });
    });
    row.addEventListener('pointerleave', () => gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power3' }));
  });
  gsap.set(float, { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 });
}
$$('[data-svc-quote]').forEach((b) => b.addEventListener('click', () => openAgent(b.closest('.svc__row').dataset.ask, 'servicio')));

// ---------- diagnóstico interactivo ----------
const QUIZ = [
  { q: '¿Por dónde llegan hoy la mayoría de sus reservas o clientes?', o: ['Casi todo por Booking, Airbnb u otras apps', 'Mitad plataformas, mitad directo', 'La mayoría me escribe directo'], tip: 'Diversifique: un sitio propio con WhatsApp convierte a quien ya lo encontró en una plataforma.' },
  { q: '¿Tiene un sitio web propio?', o: ['No tengo', 'Sí, pero está antiguo o no lo actualizo', 'Sí, actualizado y fácil de usar en celular'], tip: 'Su sitio es el único canal que es 100% suyo y no cobra comisión.' },
  { q: '¿Sus fotos muestran todos los espacios, con buena luz?', o: ['No, son pocas o de celular antiguo', 'Algunas están bien', 'Sí, completas y profesionales'], tip: 'Las fotos son lo primero que compara un huésped. Un set completo por espacio sube las reservas.' },
  { q: '¿Cuánto tarda en responder una consulta por WhatsApp?', o: ['Más de un día', 'Algunas horas', 'Menos de una hora'], tip: 'Quien responde primero suele quedarse con la reserva. Mensajes listos y protocolos ayudan mucho.' },
  { q: '¿Aparece en Google Maps con reseñas recientes?', o: ['No aparezco', 'Aparezco, pero con pocas reseñas', 'Sí, con reseñas frecuentes'], tip: 'Google Maps es su vitrina gratuita. Pida reseñas al salir el huésped y responda todas.' },
  { q: '¿Su equipo tiene protocolos de atención definidos?', o: ['No, cada uno atiende a su manera', 'Hay acuerdos informales', 'Sí, están escritos y se practican'], tip: 'Un estándar de servicio común convierte buenas estadías en reseñas de 5 estrellas.' },
];
const quiz = $('[data-quiz]');
if (quiz) {
  const answers = [];
  const stepEl = $('[data-quiz-step]', quiz);
  const qEl = $('[data-quiz-q]', quiz);
  const oEl = $('[data-quiz-o]', quiz);
  const barEl = $('[data-quiz-bar]', quiz);
  const body = $('[data-quiz-body]', quiz);
  const result = $('[data-quiz-result]', quiz);
  const render = () => {
    const i = answers.length;
    if (i === QUIZ.length) return finish();
    stepEl.textContent = `Pregunta ${i + 1} de ${QUIZ.length}`;
    barEl.style.transform = `scaleX(${i / QUIZ.length})`;
    qEl.textContent = QUIZ[i].q;
    oEl.innerHTML = '';
    QUIZ[i].o.forEach((label, v) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz__opt';
      b.innerHTML = `<span>${String.fromCharCode(65 + v)}</span>${label}`;
      b.addEventListener('click', () => {
        if (i === 0) track('quiz_start');
        answers.push(v);
        render();
        qEl.focus({ preventScroll: true });
      });
      oEl.append(b);
    });
  };
  const finish = () => {
    const score = Math.round((answers.reduce((a, b) => a + b, 0) / (QUIZ.length * 2)) * 100);
    const level = score < 40 ? ['Dependiente de las plataformas', 'Hoy otros controlan su canal de venta. Hay mucho margen por recuperar.']
      : score < 75 ? ['En camino a la independencia', 'Tiene una base. Con pocos ajustes puede vender bastante más directo.']
        : ['Negocio independiente', 'Va muy bien. El siguiente paso es afinar la experiencia y crecer.'];
    const tips = QUIZ.map((x, i) => ({ ...x, v: answers[i] })).filter((x) => x.v < 2).sort((a, b) => a.v - b.v).slice(0, 3);
    track('quiz_complete', { score });
    body.hidden = true;
    result.hidden = false;
    barEl.style.transform = 'scaleX(1)';
    $('[data-quiz-score]', result).textContent = score;
    $('[data-quiz-level]', result).textContent = level[0];
    $('[data-quiz-desc]', result).textContent = level[1];
    $('[data-quiz-tips]', result).innerHTML = (tips.length ? tips.map((t) => t.tip) : ['Mantenga lo que hace y mida sus reservas directas cada mes.'])
      .map((t) => `<li>${t}</li>`).join('');
    $('[name=puntaje]', result).value = `${score}/100 · ${level[0]}`;
    $('[name=respuestas]', result).value = QUIZ.map((x, i) => `${x.q} → ${x.o[answers[i]]}`).join(' | ');
    $('[data-quiz-agent]', result).dataset.ask = `Hice el diagnóstico y obtuve ${score}/100 (${level[0]}). ¿Qué me recomienda priorizar?`;
  };
  $('[data-quiz-restart]', quiz).addEventListener('click', () => { answers.length = 0; body.hidden = false; result.hidden = true; render(); });
  $('[data-quiz-agent]', quiz).addEventListener('click', (e) => openAgent(e.currentTarget.dataset.ask, 'diagnostico'));
  $('form', result).addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.reportValidity()) return;
    const btn = f.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    const data = Object.fromEntries(new FormData(f));
    delete data['form-name'];
    if (await submitLead('diagnostico', data)) {
      f.innerHTML = '<p class="lead__ok">Recibido. Jorge le enviará su plan de mejora por WhatsApp en menos de 24 horas hábiles.</p>';
    } else {
      btn.disabled = false;
      btn.textContent = 'Enviar por WhatsApp';
      window.open(`https://wa.me/56952289117?text=${encodeURIComponent(`Hola Jorge, hice el diagnóstico en Red Vaeru: ${f.puntaje.value}. ¿Me ayuda con un plan de mejora?`)}`, '_blank', 'noopener');
    }
  });
  render();
}

// ---------- contacto: intención rápida para WhatsApp ----------
const waLink = $('[data-wa-intent]');
$$('[data-intent]').forEach((b) => b.addEventListener('click', () => {
  $$('[data-intent]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  waLink.href = `https://wa.me/56952289117?text=${encodeURIComponent(`Hola Jorge, vengo del sitio de Red Vaeru. ${b.dataset.intent}`)}`;
}));
const contact = $('form[name=contacto]');
contact?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!contact.reportValidity()) return;
  const btn = contact.querySelector('button[type=submit]');
  btn.disabled = true;
  const data = Object.fromEntries(new FormData(contact));
  delete data['form-name'];
  if (await submitLead('contacto', data, 'formulario')) location.href = '/gracias';
  else { btn.disabled = false; HTMLFormElement.prototype.submit.call(contact); } // respaldo: envío normal del navegador
});

// ---------- agente en la sección y fondo ----------
new Chat($('[data-agent-inline]'), { source: 'seccion' });
initLive();
initHeroShader($('.hero__canvas'));
const boot = () => { intro(); scrollAnimations(); ScrollTrigger.refresh(); };
if (document.fonts?.ready) document.fonts.ready.then(boot); else addEventListener('load', boot);

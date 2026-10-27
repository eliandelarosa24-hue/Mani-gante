// Calculadora de comisiones: con los números del propio visitante, cuánto paga al año a las plataformas
// y en cuántos meses se pagaría su sitio si una parte de esas reservas llegara directo. No guarda nada.
import { SERVICES, priceOf, formatCLP } from '../pricing.js';
import { $, $$, gsap, reduced, track } from './core.js';

const HELP = {
  booking: 'Booking suele cobrar entre 15% y 18% según el contrato. Ajuste el porcentaje a su caso.',
  airbnb: 'En Airbnb depende del tipo de tarifa: cerca de 3% al anfitrión con tarifa compartida, o alrededor de 15% con tarifa solo para el anfitrión. Ajuste el porcentaje a su caso.',
  otra: 'Ponga el porcentaje que le cobra su plataforma o agencia.',
};
const PCT = { booking: 15, airbnb: 15, otra: 15 };
const NAMES = { esencial: 'Esencial', completo: 'Completo', firma: 'Firma' };

export function initCalc() {
  const root = $('[data-calc]');
  if (!root) return;
  const form = $('form', root), r = (k) => $(`[data-r="${k}"]`, root), o = (k) => $(`[data-o="${k}"]`, root);
  const shown = { anual: 0, ahorro: 0, plan: 0 };
  let touched = false;
  const tween = (key, el, to, suffix = '') => {
    if (reduced) { el.textContent = formatCLP(to) + suffix; shown[key] = to; return; }
    const st = { v: shown[key] };
    gsap.to(st, { v: to, duration: 0.8, ease: 'power3.out', overwrite: true, onUpdate: () => (el.textContent = formatCLP(st.v) + suffix) });
    shown[key] = to;
  };
  const tarifa = () => Math.max(0, +form.tarifa.value.replace(/\D/g, '') || 0);
  const paint = () => {
    const noches = +form.noches.value, pct = +form.pct.value, dir = +form.directo.value, plan = form.plan.value;
    $$('input[type=range]', form).forEach((i) => i.style.setProperty('--p', `${((i.value - i.min) / (i.max - i.min)) * 100}%`));
    o('noches').textContent = noches; o('pct').textContent = `${pct}%`; o('directo').textContent = `${dir}%`;
    const anual = tarifa() * noches * 12 * (pct / 100);
    const ahorro = anual * (dir / 100);
    const precio = priceOf(SERVICES.web_alojamiento.tiers[plan]).min;
    const meses = ahorro > 0 ? Math.ceil(precio / (ahorro / 12)) : Infinity;
    tween('anual', r('anual'), anual);
    tween('ahorro', r('ahorro'), ahorro, ' al año');
    tween('plan', r('plan'), precio);
    r('dirPct').textContent = `${dir}%`;
    r('planName').textContent = r('planName2').textContent = NAMES[plan];
    r('meses').textContent = !isFinite(meses) ? '—' : meses <= 1 ? 'menos de 1 mes' : meses > 24 ? 'más de 2 años' : `${meses} meses`;
    const top = Math.max(anual, precio, 1);
    $('[data-bar="com"]', root).style.setProperty('--w', (anual / top).toFixed(3));
    $('[data-bar="plan"]', root).style.setProperty('--w', (precio / top).toFixed(3));
    const msg = `Hola, usé la calculadora del sitio de Red Vaeru: hoy pago cerca de ${formatCLP(anual)} al año en comisiones. Me interesa el plan ${NAMES[plan]}.`;
    $('[data-calc-wa]', root).href = `https://wa.me/56952289117?text=${encodeURIComponent(msg)}`;
  };
  form.addEventListener('input', (e) => {
    if (e.target.name === 'plat') {
      form.pct.value = PCT[e.target.value];
      $('[data-calc-help]', root).textContent = HELP[e.target.value];
    }
    if (e.target.name === 'tarifa') {
      const n = tarifa();
      e.target.value = n ? n.toLocaleString('es-CL') : '';
    }
    if (!touched) { touched = true; track('calc_use', {}); }
    paint();
  });
  $('[data-calc-wa]', root).addEventListener('click', () => track('calc_cta', { plan: form.plan.value }));
  paint();
}

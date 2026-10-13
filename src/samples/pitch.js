// Capa comercial de Red Vaeru sobre cada muestra:
// 1. Enlace personalizado: ?para=Nombre del negocio → "Propuesta preparada para …" en toda la visita.
// 2. Todos los botones de WhatsApp de Red Vaeru llegan con un mensaje que identifica la muestra (y al prospecto).
// 3. Ficha comercial: qué problema del rubro resuelve el sitio, qué incluye y desde cuánto cuesta.
// Con ?modo=vaeru aparece además el generador de enlaces personalizados (solo para Jorge).
import { SAMPLES } from './data.js';
import { PITCH } from './pitch-data.js';
import { SERVICES, formatCLP } from '../pricing.js';
import { track } from '../analytics.js';

const WA = '56952289117';
const slug = location.pathname.split('/').filter(Boolean)[1];
const sample = SAMPLES.find((s) => s.slug === slug);
const pitch = PITCH[slug];

const store = (k, v) => { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch { return null; } return v; };
const local = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch { return null; } return v; };
const clean = (s) => String(s || '').replace(/[<>"`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);

const q = new URLSearchParams(location.search);
if (q.has('para')) store(`rv-para-${slug}`, clean(q.get('para')));
if (q.get('modo') === 'vaeru') local('rv-admin', '1');
const para = store(`rv-para-${slug}`) || '';
const admin = local('rv-admin') === '1';

function waText() {
  return para
    ? `Hola Jorge, soy de ${para}. Vi la propuesta de sitio web «${sample.name}» que me envió y me gustaría conversarla.`
    : `Hola Jorge, vi la muestra «${sample.name}» (${pitch.rubro}) en Red Vaeru y me interesa un sitio así para mi negocio.`;
}
const waHref = () => `https://wa.me/${WA}?text=${encodeURIComponent(waText())}`;

function init() {
  injectStyle();
  // WhatsApp de Red Vaeru con mensaje listo (los botones de "concierge" de cada negocio siguen siendo demostración)
  const paint = () => document.querySelectorAll(`a[href^="https://wa.me/${WA}"]`).forEach((a) => { a.href = waHref(); });
  paint(); new MutationObserver(paint).observe(document.body, { childList: true, subtree: true });

  // Cinta personalizada
  if (para) {
    document.title = `${sample.name} · propuesta para ${para} · Red Vaeru`;
    const bar = document.querySelector('.demo');
    const rib = document.createElement('div');
    rib.className = 'rvp-rib';
    rib.innerHTML = '<span class="rvp-rib__k">Propuesta</span><span class="rvp-rib__t">Preparada para <b></b> por Red Vaeru</span><button type="button" class="rvp-rib__b">Ver qué gana su negocio</button>';
    rib.querySelector('b').textContent = para;
    rib.querySelector('button').addEventListener('click', () => open());
    (bar || document.body.firstElementChild).insertAdjacentElement(bar ? 'beforebegin' : 'beforebegin', rib);
    track('sample_personal_view', { sample: slug });
  }

  // Pestaña y panel de la ficha
  const tab = document.createElement('button');
  tab.type = 'button'; tab.className = 'rvp-tab'; tab.setAttribute('aria-haspopup', 'dialog');
  tab.innerHTML = '<span>¿Qué gana su negocio?</span>';
  tab.addEventListener('click', () => open());
  document.body.append(tab);

  const svc = SERVICES[pitch.service], tier = svc?.tiers?.[pitch.tier];
  const panel = document.createElement('aside');
  panel.className = 'rvp'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Ficha comercial de esta muestra'); panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="rvp__scrim" data-rvp-close></div>
    <div class="rvp__in" tabindex="-1">
      <header class="rvp__h"><p class="rvp__k">Ficha Red Vaeru · ${pitch.rubro}</p><button type="button" class="rvp__x" data-rvp-close aria-label="Cerrar">✕</button></header>
      <h2 class="rvp__t">${para ? `${esc(para)}, esto es lo que <em>este sitio haría por ustedes.</em>` : `Lo que este sitio <em>hace por el negocio.</em>`}</h2>
      <section><p class="rvp__l">El problema del rubro</p><p class="rvp__p">${pitch.problem}</p></section>
      <section><p class="rvp__l">Lo que resuelve</p><ol class="rvp__g">${pitch.gains.map((g) => `<li>${g}</li>`).join('')}</ol></section>
      <section><p class="rvp__l">Incluido en esta muestra</p><ul class="rvp__f">${pitch.features.map((f) => `<li>${f}</li>`).join('')}<li>Diseño a medida, versión móvil y pantalla de carga propia</li><li>WhatsApp, Google Maps y analítica conectados</li></ul></section>
      <section class="rvp__price"><p class="rvp__l">${pitch.serviceLabel || tier?.label || 'Sitio premium a medida'}</p><p class="rvp__n">desde <b>${tier ? formatCLP(tier.min) : ''}</b></p><p class="rvp__s">Precio de lanzamiento · ${tier?.weeks || ''} · dominio y hosting del primer año incluidos. El valor final y fijo va por escrito en la propuesta.</p></section>
      <div class="rvp__cta"><a class="rvp__wa" href="${waHref()}" target="_blank" rel="noopener" data-rvp-wa>${para ? 'Conversemos esta propuesta' : 'Quiero un sitio así'}</a><a class="rvp__more" href="/muestras/">Ver las 10 muestras</a></div>
      ${admin ? `<section class="rvp__adm"><p class="rvp__l">Solo para usted, Jorge · enlace personalizado</p><div class="rvp__row"><input type="text" placeholder="Nombre del negocio" data-rvp-name maxlength="60" /><button type="button" data-rvp-copy>Copiar enlace</button></div><p class="rvp__s" data-rvp-out>Escriba el nombre y copie el enlace para enviarlo por WhatsApp.</p></section>` : ''}
      <p class="rvp__foot">Red Vaeru · Conectando culturas</p>
    </div>`;
  document.body.append(panel);
  const inner = panel.querySelector('.rvp__in');
  let last = null;
  function open() { last = document.activeElement; panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('rvp-lock'); setTimeout(() => inner.focus(), 50); track('sample_pitch_open', { sample: slug, personal: !!para }); }
  function close() { panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('rvp-lock'); last?.focus?.(); }
  panel.addEventListener('click', (e) => { if (e.target.closest('[data-rvp-close]')) close(); if (e.target.closest('[data-rvp-wa]')) track('sample_pitch_whatsapp', { sample: slug, personal: !!para }); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) close(); });
  if (admin) {
    const inp = panel.querySelector('[data-rvp-name]'), out = panel.querySelector('[data-rvp-out]');
    panel.querySelector('[data-rvp-copy]').addEventListener('click', async () => {
      const name = clean(inp.value); if (!name) { out.textContent = 'Falta el nombre del negocio.'; return; }
      const url = `${location.origin}/muestras/${slug}/?para=${encodeURIComponent(name)}`;
      try { await navigator.clipboard.writeText(url); out.textContent = `Copiado: ${url}`; } catch { out.textContent = url; }
    });
  }
}

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

function injectStyle() {
  const st = document.createElement('style');
  st.textContent = `
  .rvp-rib{position:relative;z-index:61;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 14px;padding:10px 16px;background:#c4a35a;color:#0b110e;font:500 14px/1.3 system-ui,-apple-system,'Segoe UI',sans-serif;text-align:center}
  .rvp-rib__k{padding:2px 8px;border:1px solid currentColor;font-size:10px;letter-spacing:.14em;text-transform:uppercase}
  .rvp-rib b{font-weight:700}
  .rvp-rib__b{padding:0 0 1px;border:0;border-bottom:1.5px solid #0b110e;background:none;color:inherit;font:600 14px system-ui,sans-serif;cursor:pointer}
  .rvp-tab{position:fixed;z-index:260;right:0;top:50%;transform:translateY(-50%);padding:16px 9px;border:0;border-radius:10px 0 0 10px;background:#0b110e;color:#f2ebdf;box-shadow:0 10px 30px -10px rgba(0,0,0,.6);cursor:pointer;transition:padding .3s,background .3s}
  .rvp-tab span{display:block;writing-mode:vertical-rl;transform:rotate(180deg);font:600 11px system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}
  .rvp-tab::before{content:'';display:block;width:8px;height:8px;margin:0 auto 10px;border-radius:50%;background:#c4a35a;box-shadow:0 0 0 0 rgba(196,163,90,.7);animation:rvp-p 2.4s infinite}
  .rvp-tab:hover{padding-right:14px;background:#1a2620}
  @keyframes rvp-p{70%{box-shadow:0 0 0 8px rgba(196,163,90,0)}100%{box-shadow:0 0 0 0 rgba(196,163,90,0)}}
  .rvp{position:fixed;inset:0;z-index:600;pointer-events:none}
  .rvp.is-open{pointer-events:auto}
  .rvp__scrim{position:absolute;inset:0;background:rgba(11,17,14,.55);backdrop-filter:blur(3px);opacity:0;transition:opacity .4s}
  .rvp.is-open .rvp__scrim{opacity:1}
  .rvp__in{position:absolute;top:0;right:0;bottom:0;width:min(470px,100%);overflow-y:auto;padding:26px 28px 30px;background:#f2ebdf;color:#0b110e;font:400 15px/1.55 system-ui,-apple-system,'Segoe UI',sans-serif;transform:translateX(102%);transition:transform .55s cubic-bezier(.22,1,.36,1);outline:none;box-shadow:-30px 0 60px -30px rgba(0,0,0,.5)}
  .rvp.is-open .rvp__in{transform:none}
  .rvp__h{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
  .rvp__k{margin:0;font:600 10.5px system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#3d5c4a}
  .rvp__x{width:38px;height:38px;border:1px solid rgba(11,17,14,.2);border-radius:50%;background:none;color:#0b110e;font-size:14px;cursor:pointer}
  .rvp__t{margin:0 0 22px;font:400 30px/1.12 Georgia,'Times New Roman',serif;letter-spacing:-.01em}
  .rvp__t em{color:#3d5c4a}
  .rvp section{padding:16px 0;border-top:1px solid rgba(11,17,14,.14)}
  .rvp__l{margin:0 0 8px;font:600 10.5px system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(11,17,14,.55)}
  .rvp__p{margin:0}
  .rvp__g{margin:0;padding-left:20px}.rvp__g li{margin:0 0 8px}.rvp__g li::marker{font-weight:700;color:#c4a35a}
  .rvp__f{margin:0;padding:0;list-style:none;display:grid;gap:6px}.rvp__f li{padding-left:22px;position:relative}.rvp__f li::before{content:'✓';position:absolute;left:0;color:#2a8c86;font-weight:700}
  .rvp__price{background:#0b110e;color:#f2ebdf;margin:10px -28px;padding:20px 28px!important;border:0!important}
  .rvp__price .rvp__l{color:#e3c98a}
  .rvp__n{margin:0;font:400 16px system-ui,sans-serif}.rvp__n b{font:400 40px/1.1 Georgia,serif;color:#e3c98a;margin-left:6px}
  .rvp__s{margin:8px 0 0;font-size:12.5px;opacity:.75}
  .rvp__cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;margin:20px 0 6px}
  .rvp__wa{display:inline-block;padding:14px 22px;border-radius:999px;background:#25d366;color:#0b110e;font:700 14px system-ui,sans-serif;text-decoration:none}
  .rvp__more{color:#0b110e;font:600 14px system-ui,sans-serif}
  .rvp__adm{margin-top:14px;padding:14px!important;border:1px dashed #c4a35a!important;border-radius:8px}
  .rvp__row{display:flex;gap:8px}.rvp__row input{flex:1;min-width:0;padding:10px;border:1px solid rgba(11,17,14,.25);border-radius:6px;background:#fff;font:15px system-ui,sans-serif;color:#0b110e}.rvp__row button{padding:10px 14px;border:0;border-radius:6px;background:#0b110e;color:#f2ebdf;font:600 13px system-ui,sans-serif;cursor:pointer}
  .rvp__adm .rvp__s{word-break:break-all;opacity:1}
  .rvp__foot{margin:22px 0 0;font:600 10.5px system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:rgba(11,17,14,.45)}
  html.rvp-lock,html.rvp-lock body{overflow:hidden}
  @media (max-width:560px){.rvp-tab{top:auto;bottom:96px;transform:none;padding:12px 6px}.rvp-tab span{font-size:9.5px}.rvp__t{font-size:26px}.rvp__in{padding:22px 20px 26px}.rvp__price{margin:10px -20px;padding:18px 20px!important}}
  @media (prefers-reduced-motion:reduce){.rvp__in,.rvp__scrim{transition:none}.rvp-tab::before{animation:none}}`;
  document.head.append(st);
}

if (sample && pitch) init();

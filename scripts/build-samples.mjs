// Genera las 10 muestras de concepto (/muestras/<slug>/) y la galería (/muestras/).
// Contenido en src/samples/data.js. Imágenes: si existe public/muestras/<slug>/img/<nombre>.webp
// (por ejemplo, una imagen generada con Gemini), reemplaza sola a la foto de respaldo.
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SAMPLES } from '../src/samples/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (n, cur) => (cur === 'USD' ? 'US$' + n.toLocaleString('en-US') : '$' + n.toLocaleString('es-CL'));

// Imagen en capas: propia (si existe) > Unsplash > degradado de la marca
function ph(s, slot, id, extra = '', label = '') {
  const local = `/muestras/${s.slug}/img/${slot}.webp`;
  const layers = [];
  if (existsSync(join(root, 'public', local))) layers.push(`url('${local}')`);
  if (id) layers.push(`url('https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=70')`);
  layers.push(`linear-gradient(135deg, ${s.theme['--accent-2'] || '#2f4a3a'}, ${s.theme['--accent'] || '#8a5a2b'})`);
  return `<div class="ph" role="img" aria-label="${esc(label)}" style="background-image:${layers.join(', ')};${extra}"></div>`;
}

const ICONS = {
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
  fire: '<path d="M12 22c4 0 7-3 7-7 0-5-4-7-5-11-2 3-1 5-3 7-1-1-1-3-2-4-2 3-4 5-4 8 0 4 3 7 7 7z"/>',
  tub: '<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3zM6 12V5a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2"/>',
  car: '<path d="M5 16l1.5-6h11L19 16M3 16h18v4H3zM7 20v2M17 20v2"/><circle cx="7.5" cy="18" r=".5"/><circle cx="16.5" cy="18" r=".5"/>',
  coffee: '<path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V9zM17 11h1a3 3 0 0 1 0 6h-2M8 2v3M12 2v3"/>',
  paw: '<circle cx="6" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="10" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5-2 4-4 4-4-1-4-4z"/>',
  mountain: '<path d="M2 20l7-12 4 6 3-4 6 10z"/><path d="M8 10l1.5 2 1.5-2"/>',
  star: '<path d="M12 2l3 7 7 .6-5.3 4.6 1.6 7.3L12 17.8 5.7 21.5l1.6-7.3L2 9.6 9 9z"/>',
  wine: '<path d="M8 2h8l-1 7a3 3 0 0 1-6 0zM12 12v8M8 22h8"/>',
  leaf: '<path d="M5 19C5 9 11 4 21 3c-1 10-6 16-16 16zM5 19l8-8"/>',
  kids: '<circle cx="8" cy="5" r="2"/><circle cx="16" cy="7" r="1.6"/><path d="M5 22v-6l-1-5h8l-1 5v6M14 22v-4l-1-4h6l-1 4v4"/>',
  sauna: '<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-5h6v5M9 9c0-1 1-1 1-2M12 9c0-1 1-1 1-2M15 9c0-1 1-1 1-2"/>',
  bike: '<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M5.5 17l4-8h5l4 8M9.5 9L12 17h-6M14 6h3"/>',
  kayak: '<path d="M2 15c4 2 16 2 20 0-4-2-16-2-20 0zM4 4l16 16M17 3l4 4M3 17l4 4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
  pool: '<path d="M2 18c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M2 14c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M8 12V5a2 2 0 0 1 4 0M16 12V5a2 2 0 0 0-4 0M8 8h8"/>',
  chef: '<path d="M6 13a4 4 0 0 1 1-8 5 5 0 0 1 10 0 4 4 0 0 1 1 8v7H6z"/><path d="M6 17h12"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  ledger: '<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V3zM12 3v18M8 8h2M8 12h2M14 8h2M14 12h2M5 17h14"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2.5.5 4 2.5 4 6"/>',
  heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z"/>',
  telescope: '<path d="M3 13l12-6 2 4-12 6zM15 7l3-1.5 2 4L17 11M9 16l-2 6M11 15l2 7"/>',
  boat: '<path d="M3 17l2 4h14l2-4zM12 3v14M12 4l7 10H12"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  bread: '<path d="M5 11a4 4 0 0 1 0-7h14a4 4 0 0 1 0 7v9H5z"/><path d="M9 7v3M13 7v3M17 7v3"/>',
  leafwine: '<path d="M12 22v-8M7 22h10M8 3h8l-1 6a3 3 0 0 1-6 0z"/>',
  snow: '<path d="M12 2v20M3.5 7l17 10M3.5 17l17-10M9 4l3 2 3-2M9 20l3-2 3 2"/>',
  spa: '<path d="M12 21c-5 0-9-3-9-8 3 0 6 1 9 4 3-3 6-4 9-4 0 5-4 8-9 8z"/><path d="M12 17c-2-3-2-7 0-11 2 4 2 8 0 11z"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ICONS.star}</svg>`;
const WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2s.2-1.1.1-1.2-.2-.2-.4-.3z"/></svg>';

const R = {
  story: (s, b) => `
  <section class="sec" id="${b.id || 'historia'}"><div class="wrap story">
    <div class="rv">${ph(s, b.slot || 'historia', b.img, '', b.alt)}</div>
    <div class="story-text rv"><p class="eyebrow">${esc(b.eyebrow)}</p><h2 class="h2">${b.title}</h2>
      ${b.paras.map((p, i) => `<p class="${i === 0 ? 'big' : ''}">${esc(p)}</p>`).join('')}
      ${b.stats ? `<div class="stats">${b.stats.map(([n, l]) => `<div><strong>${esc(n)}</strong><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
    </div></div></section>`,

  quote: (s, b) => `
  <section class="sec sec--tint"><div class="wrap" style="max-width:1000px;text-align:center">
    <p class="eyebrow rv">${esc(b.eyebrow || '')}</p>
    <p class="rv" style="font:400 clamp(28px,3.6vw,48px)/1.25 var(--display);margin:0 0 18px">“${esc(b.text)}”</p>
    <p class="rv" style="color:var(--muted)">${esc(b.by)}</p></div></section>`,

  units: (s, b) => `
  <section class="sec ${b.dark ? 'sec--dark' : ''}" id="${b.id || 'unidades'}"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="units">${b.items.map((u, i) => `<article class="unit rv">
      <div style="position:relative">${ph(s, `unidad-${i + 1}`, u.img, 'aspect-ratio:4/3', u.name)}${u.badge ? `<span class="badge">${esc(u.badge)}</span>` : ''}</div>
      <div class="unit-body"><h3>${esc(u.name)}</h3><p>${esc(u.desc)}</p>
        <ul class="specs">${u.specs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="unit-foot"><span class="price">${fmt(u.price, s.currency)} <small>/ ${esc(b.per || 'noche')}</small></span><a class="btn btn--accent btn--sm" href="#reservar">Reservar</a></div>
      </div></article>`).join('')}</div></div></section>`,

  booking: (s, b) => {
    const units = s.blocks.find((x) => x.type === 'units');
    const opts = (b.options || units?.items || []).map((u) => `<option data-price="${u.price}" data-cap="${u.cap || 99}">${esc(u.name)} · ${fmt(u.price, s.currency)}</option>`).join('');
    return `
  <section class="sec sec--tint" id="reservar"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow || 'Reserva directa')}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="booking">
      <form class="book-form rv" data-book="#sum-${s.slug}" data-qty-word="${esc(b.qtyWord || 'persona')}" data-fee="${b.fee || 0}" ${b.perPerson ? 'data-per-person="true"' : ''} novalidate>
        ${b.perPerson ? `<div class="row"><label class="field">Fecha<input type="date" name="checkin" /></label><label class="field">Horario<select name="slot">${(b.slots || ['10:00', '15:00']).map((x) => `<option>${esc(x)}</option>`).join('')}</select></label></div>`
          : `<div class="row"><label class="field">Llegada<input type="date" name="checkin" /></label><label class="field">Salida<input type="date" name="checkout" /></label></div>`}
        <div class="row"><label class="field">${esc(b.unitLabel || 'Unidad')}<select name="unit">${opts}</select></label>
        <label class="field">${esc(b.guestsLabel || (b.perPerson ? 'Personas' : 'Huéspedes'))}<select name="guests">${Array.from({ length: b.maxGuests || 8 }, (_, i) => `<option ${i === 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></label></div>
        ${b.extras?.length ? `<fieldset class="field" style="border:0;padding:0;margin:0"><legend style="margin-bottom:8px">Extras</legend>${b.extras.map((x) => `<label style="display:flex;gap:10px;align-items:center;font-weight:500;color:var(--fg);min-height:36px"><input type="checkbox" data-price="${x.price}" data-per="${x.per || 'once'}" style="width:20px;height:20px;accent-color:var(--accent)" /> ${esc(x.label)} <span style="margin-left:auto;color:var(--muted)">${x.price ? `+${fmt(x.price, s.currency)}${x.per === 'night' ? '/noche' : x.per === 'guest' ? '/persona' : ''}` : 'sin costo'}</span></label>`).join('')}</fieldset>` : ''}
        ${b.calendar ? `<div><p class="field" data-cal-title style="margin:0 0 10px">Disponibilidad</p><div class="calendar" data-cal></div><div class="legend" style="margin-top:10px"><span><i></i>Disponible</span><span style="text-decoration:line-through">Ocupado</span></div></div>` : ''}
        <label class="field">Comentarios<textarea name="msg" rows="2" placeholder="${esc(b.placeholder || 'Hora estimada de llegada, celebraciones, dudas…')}"></textarea></label>
      </form>
      <aside class="summary rv" id="sum-${s.slug}" aria-live="polite">
        <h3>Su ${b.perPerson ? 'reserva' : 'estadía'}</h3>
        <dl><div><dt data-s-label>—</dt><dd data-s-base>—</dd></div><div><dt>Extras</dt><dd data-s-extras>—</dd></div>
        ${b.fee ? `<div><dt>${esc(b.feeLabel || 'Limpieza')}</dt><dd data-s-fee>—</dd></div>` : ''}
        <div class="total"><dt>Total</dt><dd data-s-total>—</dd></div></dl>
        <small data-s-warn style="color:#ffb4a2"></small>
        <button class="btn btn--accent" data-demo="se enviaría la solicitud con fechas, huéspedes y total al WhatsApp del negocio">${esc(b.cta || 'Solicitar reserva por WhatsApp')}</button>
        ${b.perPerson ? '' : '<small data-s-save></small>'}
        <small>${esc(b.note || 'Sin cargos ocultos. Confirmación en menos de 2 horas.')}</small>
      </aside>
    </div></div></section>`;
  },

  amen: (s, b) => `
  <section class="sec ${b.dark ? 'sec--dark' : ''}" id="${b.id || 'servicios'}"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${b.title}</h2></div>${b.lead ? `<p>${esc(b.lead)}</p>` : ''}</div>
    <ul class="amen rv" style="--cols:${b.items.length % 3 === 0 ? 3 : b.items.length === 4 ? 4 : 2}">${b.items.map(([k, t, d]) => `<li>${icon(k)}<strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('')}</ul></div></section>`,

  gallery: (s, b) => `
  <section class="sec" id="galeria"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow || 'Galería')}</p><h2>${b.title}</h2></div><p>${esc(b.lead || 'Toque una foto para verla en grande.')}</p></div>
    <div class="gallery">${b.items.map(([id, label, ratio], i) => `<button type="button" class="rv" aria-label="${esc(label)}">${ph(s, `g${i + 1}`, id, `aspect-ratio:${ratio || '4/5'}`, label)}</button>`).join('')}</div>
  </div></section>
  <div class="lightbox" role="dialog" aria-label="Galería"><div class="ph"></div><button class="lb-close" aria-label="Cerrar">×</button><button class="lb-prev" aria-label="Anterior">‹</button><button class="lb-next" aria-label="Siguiente">›</button><p></p></div>`,

  menu: (s, b) => `
  <section class="sec ${b.dark ? 'sec--dark' : ''}" id="${b.id || 'carta'}"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow || 'Carta')}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="tabs rv" role="tablist">${b.cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}" aria-controls="cat-${i}">${esc(c.name)}</button>`).join('')}</div>
    ${b.cats.map((c, i) => `<div class="panel menu-list" role="tabpanel" id="cat-${i}" ${i ? 'hidden' : ''}>${c.items.map(([n, d, p, tag]) => `<div class="dish"><h4>${esc(n)}${tag ? `<span class="tag">${esc(tag)}</span>` : ''}</h4><span class="p">${typeof p === 'number' ? fmt(p, s.currency) : esc(p)}</span><p>${esc(d)}</p></div>`).join('')}</div>`).join('')}
    ${b.note ? `<p style="margin-top:28px;color:var(--muted);font-size:14px">${esc(b.note)}</p>` : ''}
  </div></section>`,

  tours: (s, b) => `
  <section class="sec ${b.dark ? 'sec--dark' : ''}" id="${b.id || 'experiencias'}"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="filters rv" data-filters="#list-${b.id || 'exp'}"><button aria-pressed="true" data-f="todo">Todo</button>${b.filters.map(([f, l]) => `<button aria-pressed="false" data-f="${f}">${esc(l)}</button>`).join('')}</div>
    <div class="tours" id="list-${b.id || 'exp'}">${b.items.map((t, i) => `<article class="tour rv" data-tags="${t.tags}">${ph(s, `exp-${i + 1}`, t.img, '', t.name)}
      <div class="tour-body"><div class="meta">${t.meta.map((m) => `<span>${esc(m)}</span>`).join('')}</div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p>
      <div class="row"><span class="price" style="color:#fff">${fmt(t.price, s.currency)} <small style="color:rgba(255,255,255,.75)">/ ${esc(b.per || 'persona')}</small></span><a class="btn btn--light btn--sm" href="#reservar">Reservar</a></div></div></article>`).join('')}</div>
  </div></section>`,

  tiers: (s, b) => `
  <section class="sec ${b.dark ? 'sec--dark' : ''}" id="${b.id || 'planes'}"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="tiers">${b.items.map((t) => `<article class="tier rv ${t.featured ? 'featured' : ''}"><p class="eyebrow" style="margin:0">${esc(t.kicker || '')}</p><h3>${esc(t.name)}</h3>
      <p class="price">${typeof t.price === 'number' ? fmt(t.price, s.currency) : esc(t.price)} <small>${esc(t.per || '')}</small></p>
      <ul>${t.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><a class="btn ${t.featured ? 'btn--accent' : 'btn--ghost'}" href="#reservar">${esc(t.cta || 'Reservar')}</a></article>`).join('')}</div>
  </div></section>`,

  sky: (s, b) => `
  <section class="sec sec--dark stars-bg" id="cielo"><div class="wrap sky">
    <div class="rv"><div class="moon" data-moon><i></i></div></div>
    <div class="rv"><p class="eyebrow">${esc(b.eyebrow)}</p><h2 class="h2" style="margin-bottom:24px">${b.title}</h2>
      <div class="sky-data"><div><span>Fase de la luna hoy</span><strong data-moon-name>—</strong></div><div><span>Iluminación</span><strong data-moon-illum>—</strong></div><div><span>Próxima luna nueva</span><strong data-moon-next>—</strong></div></div>
      <p data-moon-tip style="margin-top:18px;color:var(--muted)"></p>
      <p style="color:var(--muted);font-size:14px">${esc(b.note)}</p></div>
  </div></section>`,

  events: (s, b) => `
  <section class="sec" id="${b.id || 'agenda'}"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="events">${b.items.map(([d, m, t, desc, cta]) => `<div class="event rv"><time>${esc(d)}<small>${esc(m)}</small></time><div><h3>${esc(t)}</h3><p>${esc(desc)}</p></div><a class="btn btn--ghost btn--sm" href="#" data-demo="se abriría la inscripción o el detalle del evento">${esc(cta || 'Ver detalle')}</a></div>`).join('')}</div>
  </div></section>`,

  directory: (s, b) => `
  <section class="sec sec--tint" id="${b.id || 'directorio'}"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="filters rv" data-filters="#dir-list"><button aria-pressed="true" data-f="todo">Todo</button>${b.filters.map(([f, l]) => `<button aria-pressed="false" data-f="${f}">${esc(l)}</button>`).join('')}</div>
    <div class="units" id="dir-list">${b.items.map((u, i) => `<article class="unit rv" data-tags="${u.tags}">${ph(s, `dir-${i + 1}`, u.img, 'aspect-ratio:16/10', u.name)}
      <div class="unit-body"><p class="eyebrow" style="margin:0">${esc(u.kind)}</p><h3>${esc(u.name)}</h3><p>${esc(u.desc)}</p>
      <div class="unit-foot"><span style="font-size:14px;color:var(--muted)">${esc(u.where)}</span><a class="btn btn--accent btn--sm" href="#" data-demo="se abriría el sitio o el WhatsApp del socio de la cámara">Contactar</a></div></div></article>`).join('')}</div>
  </div></section>`,

  reviews: (s, b) => `
  <section class="sec ${b.dark ? 'sec--dark' : ''}" id="resenas"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow || 'Reseñas')}</p><h2>${b.title}</h2></div>
      <div class="score"><strong>${esc(b.score)}</strong><span>${esc(b.source)}</span></div></div>
    <div class="reviews">${b.items.map(([q, n, o]) => `<article class="review rv"><span class="stars" aria-label="5 de 5">★★★★★</span><blockquote>${esc(q)}</blockquote><footer><span class="av" aria-hidden="true">${esc(n[0])}</span><span><strong style="color:var(--fg)">${esc(n)}</strong><br>${esc(o)}</span></footer></article>`).join('')}</div>
    <p style="margin-top:22px;font-size:12px;color:var(--muted)">Reseñas ilustrativas de una muestra de concepto.</p>
  </div></section>`,

  location: (s, b) => `
  <section class="sec ${b.dark ? 'sec--dark' : ''}" id="ubicacion"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">${esc(b.eyebrow || 'Cómo llegar')}</p><h2>${b.title}</h2></div><p>${esc(b.lead)}</p></div>
    <div class="location"><div class="map rv"><iframe title="Mapa de ${esc(b.query)}" loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent(b.query)}&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    <div class="how rv">${b.items.map(([t, d]) => `<div><strong>${esc(t)}</strong><span>${esc(d)}</span></div>`).join('')}</div></div>
  </div></section>`,

  faq: (s, b) => `
  <section class="sec sec--tint" id="preguntas"><div class="wrap">
    <div class="sec-head rv"><div><p class="eyebrow">Preguntas frecuentes</p><h2>${b.title || 'Antes de <em>reservar.</em>'}</h2></div></div>
    <div class="faq rv">${b.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div></section>`,

  cta: (s, b) => `
  <section class="cta">${ph(s, 'cierre', b.img, '', '')}<div class="wrap rv">
    <p class="kicker">${esc(b.kicker || '')}</p><h2>${b.title}</h2><p>${esc(b.lead)}</p>
    <div class="hero-actions" style="justify-content:center"><a class="btn btn--accent" href="#reservar">${esc(b.cta || 'Reservar ahora')}</a><a class="btn btn--ghost" href="#" data-demo="se abriría el WhatsApp del negocio">Escribir por WhatsApp</a></div>
  </div></section>`,
};

const logoSvg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ICONS.mountain}</svg>`;

function page(s) {
  const h = s.hero;
  const theme = Object.entries(s.theme).map(([k, v]) => `${k}:${v}`).join(';');
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(s.name)} · ${esc(s.tagline)} · Muestra Red Vaeru</title>
  <meta name="description" content="${esc(s.description)}" />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="__SITE_URL__/muestras/${s.slug}/" />
  <meta property="og:title" content="${esc(s.name)} · muestra de concepto de Red Vaeru" />
  <meta property="og:description" content="${esc(s.description)}" />
  <meta property="og:image" content="__SITE_URL__/og.jpg" />
  <link rel="icon" type="image/png" href="/brand/emblema-32.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link href="https://fonts.googleapis.com/css2?${s.fonts}&display=swap" rel="stylesheet" />
  <style>:root:root{${theme}}${s.css || ''}</style>
  <!--ANALYTICS-->
</head>
<body class="${h.type !== 'split' ? 'over-hero' : ''}" data-sample="${esc(s.name)}" data-currency="${s.currency || 'CLP'}">
  <div class="demo"><img src="/brand/emblema-96.webp" alt="" width="22" height="22" /> Muestra de concepto diseñada por Red Vaeru · Negocio ficticio <a href="/muestras/">Ver todas las muestras</a> · <a href="/#contacto">Quiero un sitio así</a></div>
  <header class="s-nav"><div class="wrap">
    <a class="s-logo" href="#">${logoSvg(s.logo)}<span>${esc(s.name)}<small>${esc(s.place)}</small></span></a>
    <nav class="s-links" aria-label="Secciones">${s.nav.map(([l, id]) => `<a href="#${id}">${esc(l)}</a>`).join('')}</nav>
    <a class="btn btn--accent btn--sm" href="#reservar">${esc(s.navCta || 'Reservar')}</a>
    <button class="s-burger" aria-label="Abrir menú"><span></span><span></span><span></span></button>
  </div></header>
  <div class="s-menu" aria-label="Menú"><button aria-label="Cerrar menú">×</button>${s.nav.map(([l, id]) => `<a href="#${id}">${esc(l)}</a>`).join('')}<a href="#reservar">${esc(s.navCta || 'Reservar')}</a></div>
  <main>
    <section class="hero hero--${h.type}">${h.type === 'split' ? '' : ph(s, 'hero', h.img, '', h.alt)}
      <div class="wrap">
        <div><p class="kicker">${esc(h.kicker)}</p><h1>${h.title}</h1><p class="lead">${esc(h.lead)}</p>
          <div class="hero-actions"><a class="btn btn--accent" href="#reservar">${esc(h.cta || 'Reservar directo')}</a><a class="btn btn--ghost" href="#${h.second?.[1] || 'galeria'}">${esc(h.second?.[0] || 'Ver galería')}</a></div>
          ${h.meta ? `<div class="hero-meta">${h.meta.map(([a, b]) => `<div><strong>${esc(a)}</strong>${esc(b)}</div>`).join('')}</div>` : ''}
        </div>
        ${h.type === 'split' ? ph(s, 'hero', h.img, '', h.alt) : ''}
      </div>
    </section>
    ${s.blocks.map((b) => R[b.type](s, b)).join('\n')}
  </main>
  <footer class="s-foot"><div class="wrap">
    <div class="grid">
      <div><a class="s-logo" href="#">${logoSvg(s.logo)}<span>${esc(s.name)}<small style="color:rgba(255,255,255,.6)">${esc(s.place)}</small></span></a><p>${esc(s.footer.about)}</p></div>
      <div><h4>Contacto</h4>${s.footer.contact.map((c) => `<p>${esc(c)}</p>`).join('')}</div>
      <div><h4>Explorar</h4>${s.nav.map(([l, id]) => `<a href="#${id}">${esc(l)}</a>`).join('')}</div>
      <div><h4>Horario</h4>${s.footer.hours.map((c) => `<p>${esc(c)}</p>`).join('')}</div>
    </div>
    <div class="bottom"><span>© <span data-year>2026</span> ${esc(s.name)} · Negocio ficticio</span><span>Muestra de concepto diseñada por <a href="/">Red Vaeru</a> · Conectando culturas</span></div>
  </div></footer>
  <button class="wa" data-demo="se abriría el WhatsApp del negocio para reservar o preguntar" aria-label="WhatsApp">${WA}</button>
  <div class="toast" role="status"><strong>Esto es una muestra</strong><p data-toast-text style="margin:0"></p><div><a data-toast-wa href="https://wa.me/56952289117" target="_blank" rel="noopener">Quiero un sitio así</a><button type="button" data-toast-close>Seguir explorando</button></div></div>
  <script type="module" src="/src/samples/sample.js"></script>
</body>
</html>
`;
}

function gallery() {
  const NICHES = { alojamiento: 'Alojamiento', gastronomia: 'Gastronomía', experiencias: 'Experiencias', caribe: 'Caribe', destino: 'Destinos y gremios', asesoria: 'Asesoría', bienestar: 'Termas y bienestar' };
  const niches = [...new Set(SAMPLES.map((s) => s.niche))].map((k) => [k, NICHES[k] || k]);
  return `<!DOCTYPE html>
<html lang="es-CL">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Muestras de concepto · Red Vaeru</title>
  <meta name="description" content="10 sitios de muestra diseñados por Red Vaeru para alojamientos, restaurantes, experiencias, enoturismo y destinos turísticos." />
  <link rel="canonical" href="__SITE_URL__/muestras/" />
  <link rel="icon" type="image/png" href="/brand/emblema-32.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Manrope:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/src/styles.css" />
  <!--ANALYTICS-->
</head>
<body>
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <div class="progress" aria-hidden="true"><span data-progress></span></div>
  <div class="grain" aria-hidden="true"></div>
  <div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"><em></em></span></div>
  <header class="nav" data-nav>
    <a href="/" class="nav__brand" aria-label="Red Vaeru, inicio"><img class="mark" src="/brand/emblema-96.webp" alt="" width="96" height="96" /><span>Red Vaeru</span></a>
    <nav class="nav__links" aria-label="Principal"><a href="/#servicios">Servicios</a><a href="/muestras/">Muestras</a><a href="/#trabajos">Trabajos</a><a href="/#contacto">Contacto</a></nav>
    <button class="btn btn--glow nav__cta" data-open-agent data-source="muestras"><span class="pulse"></span> Cotizar con IA</button>
    <button class="nav__burger" aria-label="Abrir menú" aria-expanded="false" data-burger><span></span><span></span></button>
  </header>
  <div class="menu" data-menu aria-hidden="true"><nav aria-label="Menú móvil"><a href="/">Inicio</a><a href="/#servicios">Servicios</a><a href="/muestras/">Muestras</a><a href="/#contacto">Contacto</a></nav></div>
  <main id="contenido">
    <section class="page-hero dark"><div class="wrap">
      <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a> / <span aria-current="page">Muestras</span></nav>
      <p class="eyebrow">Muestras de concepto</p>
      <h1 class="page-hero__title" data-hero-title>Diez negocios, <em>diez identidades.</em></h1>
      <p class="hero__lead">Sitios completos diseñados para negocios ficticios del turismo chileno y caribeño. Cada uno muestra lo que puedo hacer por el suyo: reservas directas, cartas interactivas, experiencias, catas y más.</p>
    </div></section>
    <section class="dark block samples-page"><div class="wrap">
      <div class="sfilters" role="group" aria-label="Filtrar por rubro"><button aria-pressed="true" data-sf="todo">Todo</button>${niches.map(([k, l]) => `<button aria-pressed="false" data-sf="${k}">${esc(l)}</button>`).join('')}</div>
      <div class="samples">${SAMPLES.map(card).join('')}</div>
      <p class="services__note">Negocios, nombres y reseñas ficticios, creados para mostrar el estilo de trabajo de Red Vaeru.</p>
    </div></section>
  </main>
  <footer class="footer dark"><div class="wrap"><p class="footer__word" aria-hidden="true">Red Vaeru</p><div class="footer__bottom"><span>© <span data-year>2026</span> Red Vaeru · Jorge Vásquez</span><span><a href="/privacidad">Privacidad</a> · <a href="/">Inicio</a></span></div></div></footer>
  <button class="fab" data-open-agent data-source="flotante" aria-label="Abrir Vaeru IA"><img class="mark" src="/brand/emblema-96.webp" alt="" width="96" height="96" /><span>Vaeru IA</span></button>
  <div class="drawer" data-drawer aria-hidden="true"><div class="drawer__backdrop" data-close-agent></div><div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Vaeru IA" data-agent-drawer></div></div>
  <script type="module" src="/src/page.js"></script>
</body>
</html>
`;
}

export function card(s) {
  return `<a class="sample" href="/muestras/${s.slug}/" data-niche="${s.niche}">
    ${ph(s, s.cardSlot || 'hero', s.hero.img, '', s.hero.alt)}
    <span class="sample__tag">${esc(s.nicheLabel)}</span>
    <span class="sample__body"><span class="sample__place">${esc(s.place)}</span><strong>${esc(s.name)}</strong><span class="sample__line">${esc(s.tagline)}</span><span class="sample__go">Ver muestra ↗</span></span>
  </a>`;
}

rmSync(join(root, 'muestras'), { recursive: true, force: true });
// Muestras a medida: si existe src/samples/custom/<slug>/index.html se usa ese diseño propio.
// Las marcas {{img:archivo:idUnsplash}} se convierten en imagen propia (si existe) o foto de respaldo.
function custom(s) {
  const tpl = join(root, 'src', 'samples', 'custom', s.slug, 'index.html');
  if (!existsSync(tpl)) return null;
  return readFileSync(tpl, 'utf8').replace(/\{\{img:([\w-]+):([\w-]*)\}\}/g, (_, slot, id) => {
    const local = `/muestras/${s.slug}/img/${slot}.webp`;
    const layers = [];
    if (existsSync(join(root, 'public', local))) layers.push(`url('${local}')`);
    if (id) layers.push(`url('https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=72')`);
    layers.push(`linear-gradient(135deg, ${s.theme['--accent-2'] || '#2f4a3a'}, ${s.theme['--accent'] || '#8a5a2b'})`);
    return `background-image:${layers.join(', ')}`;
  }).replace('</body>', '  <script type="module" src="/src/samples/pitch.js"></script>\n</body>');
}

for (const s of SAMPLES) {
  const file = join(root, 'muestras', s.slug, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, custom(s) || page(s));
}
writeFileSync(join(root, 'muestras', 'index.html'), gallery());
// Tarjetas para la sección de muestras de la página principal (las inserta vite.config.js)
writeFileSync(join(root, 'muestras', '_cards.html'), SAMPLES.map(card).join('\n'));
console.log(`Muestras generadas: ${SAMPLES.length} + galería`);

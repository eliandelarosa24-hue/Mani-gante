// «Su estreno»: el visitante escribe el nombre de su negocio y ve, en vivo, cómo podría verse su portada en
// computador y celular, con la tipografía y la luz de una de nuestras muestras. Se carga solo al acercarse.
import './estreno.css';
import './estreno-fonts.css';
import { $, $$, gsap, reduced, track } from './core.js';
import { SCENES } from './scenes.js';

// Rubro → muestra que lo inspira, titular de ejemplo, botón principal, un nombre inventado para la demostración
// y, más abajo en la página, tres fichas con fotos de esa muestra (miniaturas en /img/estreno/) y el cierre
const RUBROS = [
  { id: 'cabanas', label: 'Cabañas', contact: 'Cabañas', look: 'cabanas-lago-azul', title: 'Duerma junto<br>al <em>bosque.</em>', sub: 'Cabañas para desconectarse', cta: 'Ver disponibilidad', sec: 'Cabañas', demo: 'Cabañas Pewen Azul',
    head: 'Tres cabañas,<br><em>un mismo bosque.</em>', close: '¿Le guardamos<br><em>una fecha?</em>', items: [['cab-mirador', 'Cabaña Mirador', '4 personas · Vista al volcán'], ['cab-refugio', 'Cabaña Refugio', '2 personas · Estufa a leña'], ['cab-arrayan', 'Cabaña Arrayán', '2 personas · En pleno bosque']] },
  { id: 'hotel', label: 'Hotel u hostal', contact: 'Hotel', look: 'hotel-casa-nogal', title: 'Una casa con<br><em>historia.</em>', sub: 'Habitaciones con carácter', cta: 'Reservar habitación', sec: 'Habitaciones', demo: 'Hotel Casa Raíz',
    head: 'Cada pieza,<br><em>su propia historia.</em>', close: '¿Le guardamos<br><em>una pieza?</em>', items: [['hab-clasica', 'Clásica', 'Cama doble · Escritorio'], ['hab-rio', 'Vista al río', 'Sala de estar'], ['hab-torreon', 'Torreón', 'Bajo el techo']] },
  { id: 'glamping', label: 'Glamping', contact: 'Glamping o domos', look: 'domos-cielo-austral', title: 'Duerma bajo<br><em>las estrellas</em>', sub: 'Domos con el cielo abierto', cta: 'Reservar noche', sec: 'Domos', demo: 'Domos Wenu',
    head: 'Domos para<br><em>mirar arriba.</em>', close: '¿Le guardamos<br><em>una noche?</em>', items: [['unidad-1', 'Domo Cruz del Sur', 'Tinaja en la terraza'], ['unidad-2', 'Domo Araucaria', 'Entre araucarias'], ['unidad-4', 'Domo Volcán', 'Vista a la nieve']] },
  { id: 'termas', label: 'Termas', contact: 'Termas', look: 'termas-rayenko', title: 'Agua caliente,<br><em>bosque frío.</em>', sub: 'Pozones naturales entre árboles nativos', cta: 'Reservar entrada', sec: 'Pozones', demo: 'Termas Kütral',
    head: 'Elija su<br><em>pozón.</em>', close: 'Reserve su<br><em>tarde de agua.</em>', items: [['pozon-cascada', 'Pozón Cascada', 'Bajo la caída de agua'], ['pozon-piedra', 'Pozón de Piedra', 'Entre helechos'], ['sauna', 'Sauna', 'Con ventanal al bosque']] },
  { id: 'restaurante', label: 'Restaurante', contact: 'Restaurante', look: 'fogon-mapu', title: 'Cocina con<br><em>memoria.</em>', sub: 'Producto local y fuego lento', cta: 'Reservar mesa', sec: 'La carta', demo: 'Fogón Lafken',
    head: 'Lo que sale<br><em>del fuego.</em>', close: '¿Le guardamos<br><em>una mesa?</em>', items: [['tiempo-2', 'Para empezar', 'Hongos y flores del bosque'], ['tiempo-5', 'Al fuego', 'Pescado en hoja'], ['tiempo-6', 'Cocción lenta', 'Costillar al rescoldo']] },
  { id: 'cafe', label: 'Café', contact: 'Café o pastelería', look: 'kuchen-haus-frutillar', title: 'Recién salido<br>del <em>horno.</em>', sub: 'Tortas, pan y café de grano', cta: 'Ver la vitrina', sec: 'Vitrina', demo: 'Café Doña Elsa',
    head: 'Hoy en<br><em>la vitrina.</em>', close: 'Pase por<br><em>un café.</em>', items: [['k-murta', 'Kuchen de murta', 'Por trozo o entero'], ['k-frambuesa', 'Kuchen de frambuesa', 'Receta de la casa'], ['strudel', 'Strudel', 'Con helado']] },
  { id: 'vina', label: 'Viña', contact: 'Viña', look: 'vina-los-robles', title: 'Una copa<br><em>de este valle.</em>', sub: 'Visitas, catas y vinos de la casa', cta: 'Reservar visita', sec: 'Vinos', demo: 'Viña Tres Quebradas',
    head: 'Tres formas<br>de <em>conocernos.</em>', close: 'Le esperamos<br><em>en el valle.</em>', items: [['cata', 'Cata de la casa', 'Cuatro vinos del valle'], ['barricas', 'Visita a la bodega', 'Recorrido guiado'], ['bici', 'Ruta en bicicleta', 'Entre los viñedos']] },
  { id: 'tours', label: 'Tours', contact: 'Tours y experiencias', look: 'pucon-aventura', title: 'Salga a la<br><em>montaña.</em>', sub: 'Excursiones con guías locales', cta: 'Ver salidas', sec: 'Salidas', demo: 'Rumbo Andino',
    head: 'Elija su<br><em>próxima salida.</em>', close: '¿Salimos<br><em>esta semana?</em>', items: [['tour-1', 'Ascenso al volcán', 'Día completo'], ['tour-2', 'Rafting', 'Medio día'], ['tour-5', 'Trekking', 'Con guía local']] },
  { id: 'playa', label: 'Villa de playa', contact: 'Otro', look: 'villa-coral-samana', title: 'Despierte<br><em>frente al mar.</em>', sub: 'Villas a pasos de la arena', cta: 'Reservar villa', sec: 'Villas', demo: 'Villa Brisa Larimar',
    head: 'Tres villas,<br><em>el mismo mar.</em>', close: '¿Le guardamos<br><em>una semana?</em>', items: [['villa-coral', 'Villa Coral', '4 personas · Piscina'], ['villa-larimar', 'Villa Larimar', '6 personas · Frente al mar'], ['villa-mango', 'Villa Mango', '2 personas · Jardín']] },
  { id: 'otro', label: 'Otro negocio', contact: 'Otro', look: 'estudio-haber', title: 'Su oficio,<br>bien <em>contado.</em>', sub: 'Lo que hace, explicado claro', cta: 'Agendar una visita', sec: 'Servicios', demo: 'Taller Norte',
    head: 'Lo que hacemos,<br><em>bien hecho.</em>', close: 'Conversemos<br><em>su proyecto.</em>', items: [['oficina', 'Nuestra oficina', 'Atención en persona'], ['taller', 'Trabajos a medida', 'Presupuesto claro'], ['reunion', 'Reuniones', 'Agendadas en línea']] },
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const font = (s) => s.replace(/Escena/g, 'Estreno');
// Si el color de la muestra es muy oscuro (Estudio Haber), los botones llevan letra clara y los rótulos un tono más luminoso
const dark = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.35; };
const domain = (name) => (name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'sunegocio').slice(0, 28) + '.cl';

// Un mapa dibujado (no es un mapa real): cuadras, dos parques, agua y las calles principales
const GRID = Array.from({ length: 17 }, (_, i) => `M${i * 28 - 70} -10l44 320`).join('') + Array.from({ length: 13 }, (_, i) => `M-10 ${i * 26}l420 -40`).join('');
const MAP = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><path class="ep__grid" d="${GRID}"/><path class="ep__park" d="M256 34c32-9 72 3 78 30s-26 46-60 40-50-62-18-70zM38 128c18-8 44-2 48 16s-14 30-34 26-32-34-14-42z"/><path class="ep__water" d="M0 220c62-22 118 22 188 6s128-50 212-30v110H0z"/><g class="ep__roads"><path d="M-10 122c90 6 150-26 226 12s128 44 194 10"/><path class="ep__minor" d="M118-10c12 92 52 150 40 320M300-10c-22 70-44 128-30 208M-10 52l410-18"/></g></svg>`;

function page(kind, sc, r, d, photo) {
  const t = sc.type, m = kind === 'm';
  const face = `font-family:${font(t.family)};font-weight:${t.weight};${t.upper ? 'text-transform:uppercase;' : ''}${t.stretch ? `font-stretch:${t.stretch};` : ''}`;
  const head = (px) => `${face}font-size:${px * t.size}px;letter-spacing:${t.tracking};line-height:${t.lh};`;
  const logo = `${face}${t.upper ? 'letter-spacing:0.02em;' : ''}`;
  const em = (html) => html.replace('<em>', `<em style="${font(sc.em)}">`);
  const kick = [r.label, d.lugar].filter(Boolean).join(' · ');
  const cards = r.items.map(([f, name, detail]) => `<figure class="ep__card"><img src="/img/estreno/${r.look}-${f}.webp" alt="" decoding="async" /><figcaption><b style="${face}">${name}</b><small>${detail}</small></figcaption></figure>`).join('');
  return `<div class="ep ep--${kind}" style="--acc:${sc.accent}${dark(sc.accent) ? ';--acc-ink:#fff;--acc-text:color-mix(in srgb, var(--acc) 45%, #fff)' : ''}">
    <div class="ep__top">
      <img class="ep__bg" src="${photo || `/img/escenas/${sc.slug}-900.webp`}" alt="" />
      <span class="ep__shade"></span>
      <div class="ep__nav"><b class="ep__logo" style="${logo}" data-ep-name>${esc(d.name)}</b>${m ? '<span class="ep__burger"><i></i><i></i></span>' : `<span class="ep__links"><i>Inicio</i><i>${r.sec}</i><i>Ubicación</i><i>Contacto</i></span><span class="ep__btn ep__btn--sm">${r.cta}</span>`}</div>
      <div class="ep__hero">
        <p class="ep__k" data-ep-kick>${esc(kick)}</p>
        <p class="ep__t" style="${head(m ? 50 : 104)}">${em(r.title)}</p>
        <p class="ep__sub" data-ep-sub>${esc(r.sub)}${d.lugar ? ` en ${esc(d.lugar)}` : ''}. Reserve directo, sin comisiones.</p>
        <p class="ep__ctas"><span class="ep__btn ep__btn--solid">${r.cta}</span><span class="ep__btn">WhatsApp</span></p>
      </div>
      <span class="ep__tag">${photo ? 'Su foto' : 'Foto de muestra'}</span>
    </div>
    <div class="ep__sec" data-ep-stop>
      <div class="ep__head"><div><p class="ep__k">${r.sec}</p><p class="ep__h" style="${head(m ? 36 : 64)}">${em(r.head)}</p></div><small>Fotos de muestra</small></div>
      <div class="ep__cards">${cards}</div>
    </div>
    <div class="ep__loc" data-ep-stop>
      <div class="ep__map">${MAP}<span class="ep__pin"></span><b class="ep__pinl" data-ep-name>${esc(d.name)}</b></div>
      <div><p class="ep__k">Dónde estamos</p><p class="ep__h" style="${head(m ? 36 : 64)}" data-ep-place>${esc(d.lugar || 'Cómo llegar')}</p><p class="ep__p">La ubicación exacta, cómo llegar y los horarios, a un toque en Google Maps y Waze.</p><span class="ep__btn">Abrir el mapa</span></div>
    </div>
    <div class="ep__end" data-ep-stop>
      <p class="ep__h" style="${head(m ? 44 : 92)}">${em(r.close)}</p>
      <p class="ep__ctas"><span class="ep__btn ep__btn--solid">${r.cta}</span><span class="ep__btn">WhatsApp</span></p>
      <div class="ep__foot"><b class="ep__logo" style="${logo}" data-ep-name>${esc(d.name)}</b><span>Instagram · WhatsApp · Correo</span><span>Reserva directa, sin comisiones</span></div>
    </div>
  </div>`;
}

export function estreno(root) {
  const form = $('[data-est-form]', root);
  const vd = $('[data-est-d]', root), vm = $('[data-est-m]', root);
  const url = $('[data-est-url]', root), lookName = $('[data-est-look]', root), ref = $('[data-est-ref]', root);
  const wa = $('[data-est-wa]', root), ct = $('[data-est-ct]', root);
  let rubro = RUBROS[0], look = SCENES.findIndex((s) => s.slug === rubro.look), touched = false, typing = 0, photo = null;

  const data = () => ({ name: form.nombre.value.trim() || rubro.demo, lugar: form.lugar.value.trim() });
  // Cada viewport dibuja una página de tamaño real (1280 o 390 px) y la escala a su ancho (el marco usa la misma escala)
  const fit = (vp, w) => new ResizeObserver(([e]) => { vp.parentElement.style.setProperty('--k', e.contentRect.width / w); paint(); }).observe(vp);
  fit(vd, 1280); fit(vm, 390);

  const swap = (vp, html) => {
    vp.insertAdjacentHTML('beforeend', html);
    const nu = vp.lastElementChild, old = [...vp.children].slice(0, -1);
    requestAnimationFrame(() => requestAnimationFrame(() => nu.classList.add('is-in')));
    setTimeout(() => { old.forEach((o) => o.remove()); paint(); }, 900);
  };
  const render = () => {
    const sc = SCENES[look], d = data();
    swap(vd, page('d', sc, rubro, d, photo)); swap(vm, page('m', sc, rubro, d, photo));
    paint();
    lookName.textContent = sc.name;
    ref.href = sc.case;
    links();
  };
  const update = () => {
    const d = data(), kick = [rubro.label, d.lugar].filter(Boolean).join(' · ');
    $$('[data-ep-name]', root).forEach((el) => (el.textContent = d.name));
    $$('[data-ep-kick]', root).forEach((el) => (el.textContent = kick));
    $$('[data-ep-sub]', root).forEach((el) => (el.textContent = `${rubro.sub}${d.lugar ? ` en ${d.lugar}` : ''}. Reserve directo, sin comisiones.`));
    $$('[data-ep-place]', root).forEach((el) => (el.textContent = d.lugar || 'Cómo llegar'));
    links();
  };
  const links = () => {
    const d = data(), sc = SCENES[look], own = form.nombre.value.trim();
    url.textContent = `www.${domain(own || rubro.demo)}`;
    const msg = `Hola, probé «Su estreno» en el sitio de Red Vaeru. Mi negocio: ${own || '(sin nombre aún)'}, ${rubro.label.toLowerCase()}${d.lugar ? ` en ${d.lugar}` : ''}. Me gustó el estilo de ${sc.name}. ¿Conversamos?`;
    wa.href = `https://wa.me/56952289117?text=${encodeURIComponent(msg)}`;
    const q = new URLSearchParams({ negocio: rubro.contact, estilo: sc.slug });
    if (own) q.set('nombre_negocio', own);
    if (d.lugar) q.set('lugar', d.lugar);
    ct.href = `/contacto/?${q}`;
  };
  const first = () => { if (!touched) { touched = true; track('estreno_try', { rubro: rubro.id }); } };

  // Mientras el visitante no escriba, el nombre de ejemplo se escribe solo, letra por letra
  const typeDemo = () => {
    clearInterval(typing);
    if (form.nombre.value.trim()) return;
    const full = rubro.demo; let k = 0;
    form.nombre.placeholder = full;
    typing = setInterval(() => {
      k++;
      $$('[data-ep-name]', root).forEach((el) => (el.textContent = full.slice(0, k)));
      url.textContent = `www.${domain(full.slice(0, k))}`;
      if (k >= full.length) clearInterval(typing);
    }, 70);
  };

  form.addEventListener('input', (e) => {
    first();
    if (e.target.name === 'rubro') {
      rubro = RUBROS.find((r) => r.id === e.target.value);
      look = SCENES.findIndex((s) => s.slug === rubro.look);
      render(); typeDemo();
      return;
    }
    clearInterval(typing);
    update();
  });
  $('[data-est-next]', root).addEventListener('click', () => { first(); look = (look + 1) % SCENES.length; render(); track('estreno_style', { look: SCENES[look].slug }); });
  wa.addEventListener('click', () => track('estreno_cta', { via: 'whatsapp', rubro: rubro.id, look: SCENES[look].slug }));
  ct.addEventListener('click', () => track('estreno_cta', { via: 'contacto', rubro: rubro.id, look: SCENES[look].slug }));

  // Más que la portada: la página de muestra sigue hacia abajo. Se recorre con la rueda sobre las pantallas,
  // con el botón (también en celular) o se asoma sola una vez. Computador y celular avanzan juntos, sección
  // por sección: pos 0 es la portada, 1 las fichas, 2 la ubicación y 3 el cierre.
  const vps = [vd, vm], tour = $('[data-est-tour]', root), tourL = $('[data-est-tour-l]', root), tourA = $('[data-est-tour-a]', root), thumb = $('.est__rail i', root);
  const LAST = 3;
  let pos = 0, anim = null, used = false;
  const room = (vp) => Math.max(0, vp.scrollHeight - vp.clientHeight);
  // Dónde empieza cada sección dentro del viewport ya escalado
  const stopsOf = (vp) => {
    const pg = vp.lastElementChild, max = room(vp);
    if (!pg) return [0, 0, 0, 0];
    const k = vp.clientWidth / pg.offsetWidth;
    return [0, ...$$('[data-ep-stop]', pg).map((el) => Math.min(max, el.offsetTop * k)).slice(0, LAST - 1), max];
  };
  const at = (st, u) => { const i = Math.min(LAST - 1, Math.floor(u)); return st[i] + (st[i + 1] - st[i]) * (u - i); };
  function paint() {
    vps.forEach((vp) => (vp.scrollTop = at(stopsOf(vp), pos)));
    const ratio = Math.min(1, vd.clientHeight / (vd.scrollHeight || 1)), done = room(vd) ? vd.scrollTop / room(vd) : 0;
    thumb.style.height = `${ratio * 100}%`;
    thumb.style.transform = `translateY(${done * (1 / ratio - 1) * 100}%)`;
    const end = pos > LAST - 0.02, label = end ? 'Volver arriba' : 'Recorrer la página';
    if (tourL.textContent !== label) { tourL.textContent = label; tourA.textContent = end ? '↑' : '↓'; }
  }
  const proxy = { u: 0 };
  const glide = (to, vars) => {
    anim?.kill();
    proxy.u = pos;
    anim = gsap.to(proxy, { u: to, duration: reduced ? 0 : 0.6, ease: 'power3.out', ...vars, onUpdate: () => { pos = proxy.u; paint(); } });
  };
  const engage = () => { used = true; first(); };
  const onWheel = (vp) => (e) => {
    if (e.ctrlKey || !room(vp)) return;
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vp.clientHeight : 1);
    const from = anim?.isActive() && typeof anim.vars.u === 'number' ? anim.vars.u : pos;
    const st = stopsOf(vp), i = Math.max(0, Math.min(LAST - 1, dy < 0 && from % 1 === 0 ? from - 1 : Math.floor(from)));
    const to = Math.min(LAST, Math.max(0, from + dy / Math.max(1, st[i + 1] - st[i])));
    if (to === pos) return; // en el borde, la rueda vuelve a mover la página
    e.preventDefault(); e.stopPropagation();
    engage(); glide(to);
  };
  vps.forEach((vp) => vp.parentElement.addEventListener('wheel', onWheel(vp), { passive: false }));
  tour.addEventListener('click', () => {
    engage();
    if (pos > LAST - 0.02) { glide(0, { duration: reduced ? 0 : 1.6, ease: 'power3.inOut' }); return; }
    // Se detiene en cada sección, como quien hojea la página
    anim?.kill();
    proxy.u = pos;
    const tl = gsap.timeline({ onUpdate: () => { pos = proxy.u; paint(); } });
    for (let to = Math.floor(pos + 0.02) + 1, n = 0; to <= LAST; to++, n++) tl.to(proxy, { u: to, duration: reduced ? 0 : 1.5, ease: 'power2.inOut' }, n ? '+=1.1' : 0);
    anim = tl;
    track('estreno_tour', { rubro: rubro.id });
  });
  // Una sola vez, la página se asoma hacia abajo para mostrar que hay más
  const peek = () => {
    if (used || reduced) return;
    glide(0.4, { duration: 1.5, ease: 'power2.inOut', onComplete: () => { if (!used) glide(0, { duration: 1.2, ease: 'power2.inOut', delay: 1 }); } });
  };

  // Foto propia: se muestra desde el dispositivo, sin subirla a ninguna parte
  const pIn = $('[data-est-photo]', root), pBox = pIn.closest('.est__photo'), pClear = $('[data-est-photo-clear]', root), pLabel = $('[data-est-photo-l]', root);
  pIn.addEventListener('change', () => {
    const f = pIn.files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    if (photo) URL.revokeObjectURL(photo);
    photo = URL.createObjectURL(f);
    pBox.classList.add('has-photo'); pBox.style.setProperty('--thumb', `url("${photo}")`);
    pLabel.textContent = 'Cambiar la foto'; pClear.hidden = false;
    first(); render(); track('estreno_photo', { rubro: rubro.id });
  });
  pClear.addEventListener('click', () => {
    if (photo) URL.revokeObjectURL(photo);
    photo = null; pIn.value = '';
    pBox.classList.remove('has-photo'); pLabel.textContent = 'Usar una foto de mi lugar'; pClear.hidden = true;
    render();
  });

  // Descargar o compartir la portada como imagen (en celular abre el menú para compartir, por ejemplo a WhatsApp)
  const share = $('[data-est-share]', root), shareL = $('[data-est-share-l]', root);
  const probe = typeof File === 'function' ? new File([''], 'p.jpg', { type: 'image/jpeg' }) : null;
  const canShare = !!(probe && navigator.canShare?.({ files: [probe] }) && matchMedia('(pointer: coarse)').matches);
  if (canShare) shareL.textContent = 'Compartir mi portada';
  const load = (src) => new Promise((ok, ko) => { const im = new Image(); im.onload = () => ok(im); im.onerror = ko; im.src = src; });
  share.addEventListener('click', async () => {
    first();
    share.setAttribute('aria-busy', 'true'); const was = shareL.textContent; shareL.textContent = 'Preparando…';
    try {
      const sc = SCENES[look], own = form.nombre.value.trim(), name = own || rubro.demo;
      const [{ exportPortada }, img] = await Promise.all([import('./estreno-export.js'), load(photo || sc.image)]);
      const blob = await exportPortada({ scene: sc, rubro, name, lugar: form.lugar.value.trim(), img, own: !!photo, url: `www.${domain(name)}` });
      const file = new File([blob], `portada-${domain(name).replace('.cl', '')}.jpg`, { type: 'image/jpeg' });
      if (canShare) {
        await navigator.share({ files: [file], title: 'Mi portada de prueba', text: `Así se vería ${name}. Hecha con «Su estreno» de Red Vaeru: ${location.origin}/#estreno` }).catch(() => {});
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = file.name;
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      }
      track('estreno_share', { via: canShare ? 'compartir' : 'descarga', rubro: rubro.id, look: sc.slug, foto: !!photo });
    } catch { /* si falla, el visitante puede volver a intentarlo */ }
    share.removeAttribute('aria-busy'); shareL.textContent = was;
  });

  render();
  // La demostración empieza cuando la sección entra en pantalla
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); typeDemo(); setTimeout(peek, 2600); } }, { threshold: 0.35 }).observe(vd);
}

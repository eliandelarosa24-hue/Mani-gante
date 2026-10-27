// «Su estreno»: el visitante escribe el nombre de su negocio y ve, en vivo, cómo podría verse su portada en
// computador y celular, con la tipografía y la luz de una de nuestras muestras. Se carga solo al acercarse.
import './estreno.css';
import './estreno-fonts.css';
import { $, $$, track } from './core.js';
import { SCENES } from './scenes.js';

// Rubro → muestra que lo inspira, titular de ejemplo, botón principal y un nombre inventado para la demostración
const RUBROS = [
  { id: 'cabanas', label: 'Cabañas', contact: 'Cabañas', look: 'cabanas-lago-azul', title: 'Duerma junto<br>al <em>bosque.</em>', sub: 'Cabañas para desconectarse', cta: 'Ver disponibilidad', sec: 'Cabañas', demo: 'Cabañas Pewen Azul' },
  { id: 'hotel', label: 'Hotel u hostal', contact: 'Hotel', look: 'hotel-casa-nogal', title: 'Una casa con<br><em>historia.</em>', sub: 'Habitaciones con carácter', cta: 'Reservar habitación', sec: 'Habitaciones', demo: 'Hotel Casa Raíz' },
  { id: 'glamping', label: 'Glamping', contact: 'Glamping o domos', look: 'domos-cielo-austral', title: 'Duerma bajo<br><em>las estrellas</em>', sub: 'Domos con el cielo abierto', cta: 'Reservar noche', sec: 'Domos', demo: 'Domos Wenu' },
  { id: 'termas', label: 'Termas', contact: 'Termas', look: 'termas-rayenko', title: 'Agua caliente,<br><em>bosque frío.</em>', sub: 'Pozones naturales entre árboles nativos', cta: 'Reservar entrada', sec: 'Pozones', demo: 'Termas Kütral' },
  { id: 'restaurante', label: 'Restaurante', contact: 'Restaurante', look: 'fogon-mapu', title: 'Cocina con<br><em>memoria.</em>', sub: 'Producto local y fuego lento', cta: 'Reservar mesa', sec: 'La carta', demo: 'Fogón Lafken' },
  { id: 'cafe', label: 'Café', contact: 'Café o pastelería', look: 'kuchen-haus-frutillar', title: 'Recién salido<br>del <em>horno.</em>', sub: 'Tortas, pan y café de grano', cta: 'Ver la vitrina', sec: 'Vitrina', demo: 'Café Doña Elsa' },
  { id: 'vina', label: 'Viña', contact: 'Viña', look: 'vina-los-robles', title: 'Una copa<br><em>de este valle.</em>', sub: 'Visitas, catas y vinos de la casa', cta: 'Reservar visita', sec: 'Vinos', demo: 'Viña Tres Quebradas' },
  { id: 'tours', label: 'Tours', contact: 'Tours y experiencias', look: 'pucon-aventura', title: 'Salga a la<br><em>montaña.</em>', sub: 'Excursiones con guías locales', cta: 'Ver salidas', sec: 'Salidas', demo: 'Rumbo Andino' },
  { id: 'playa', label: 'Villa de playa', contact: 'Otro', look: 'villa-coral-samana', title: 'Despierte<br><em>frente al mar.</em>', sub: 'Villas a pasos de la arena', cta: 'Reservar villa', sec: 'Villas', demo: 'Villa Brisa Larimar' },
  { id: 'otro', label: 'Otro negocio', contact: 'Otro', look: 'estudio-haber', title: 'Su oficio,<br>bien <em>contado.</em>', sub: 'Lo que hace, explicado claro', cta: 'Agendar una visita', sec: 'Servicios', demo: 'Taller Norte' },
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const font = (s) => s.replace(/Escena/g, 'Estreno');
const domain = (name) => (name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'sunegocio').slice(0, 28) + '.cl';

function page(kind, sc, r, d, photo) {
  const t = sc.type, m = kind === 'm';
  const size = (m ? 50 : 104) * t.size;
  const title = `font-family:${font(t.family)};font-weight:${t.weight};font-size:${size}px;letter-spacing:${t.tracking};line-height:${t.lh};${t.upper ? 'text-transform:uppercase;' : ''}${t.stretch ? `font-stretch:${t.stretch};` : ''}`;
  const logo = `font-family:${font(t.family)};font-weight:${t.weight};${t.upper ? 'text-transform:uppercase;letter-spacing:0.02em;' : ''}${t.stretch ? `font-stretch:${t.stretch};` : ''}`;
  const kick = [r.label, d.lugar].filter(Boolean).join(' · ');
  return `<div class="ep ep--${kind}" style="--acc:${sc.accent}">
    <img class="ep__bg" src="${photo || `/img/escenas/${sc.slug}-900.webp`}" alt="" />
    <span class="ep__shade"></span>
    <div class="ep__nav"><b class="ep__logo" style="${logo}" data-ep-name>${esc(d.name)}</b>${m ? '<span class="ep__burger"><i></i><i></i></span>' : `<span class="ep__links"><i>Inicio</i><i>${r.sec}</i><i>Ubicación</i><i>Contacto</i></span><span class="ep__btn ep__btn--sm">${r.cta}</span>`}</div>
    <div class="ep__hero">
      <p class="ep__k" data-ep-kick>${esc(kick)}</p>
      <p class="ep__t" style="${title}">${r.title.replace('<em>', `<em style="${font(sc.em)}">`)}</p>
      <p class="ep__sub" data-ep-sub>${esc(r.sub)}${d.lugar ? ` en ${esc(d.lugar)}` : ''}. Reserve directo, sin comisiones.</p>
      <p class="ep__ctas"><span class="ep__btn ep__btn--solid">${r.cta}</span><span class="ep__btn">WhatsApp</span></p>
    </div>
    <span class="ep__wa"></span>
    <span class="ep__tag">${photo ? 'Su foto' : 'Foto de muestra'}</span>
  </div>`;
}

export function estreno(root) {
  const form = $('[data-est-form]', root);
  const vd = $('[data-est-d]', root), vm = $('[data-est-m]', root);
  const url = $('[data-est-url]', root), lookName = $('[data-est-look]', root), ref = $('[data-est-ref]', root);
  const wa = $('[data-est-wa]', root), ct = $('[data-est-ct]', root);
  let rubro = RUBROS[0], look = SCENES.findIndex((s) => s.slug === rubro.look), touched = false, typing = 0, photo = null;

  const data = () => ({ name: form.nombre.value.trim() || rubro.demo, lugar: form.lugar.value.trim() });
  // Cada viewport dibuja una página de tamaño real (1280 o 390 px) y la escala a su ancho
  const fit = (vp, w) => new ResizeObserver(([e]) => vp.style.setProperty('--k', e.contentRect.width / w)).observe(vp);
  fit(vd, 1280); fit(vm, 390);

  const swap = (vp, html) => {
    vp.insertAdjacentHTML('beforeend', html);
    const nu = vp.lastElementChild, old = [...vp.children].slice(0, -1);
    requestAnimationFrame(() => requestAnimationFrame(() => nu.classList.add('is-in')));
    setTimeout(() => old.forEach((o) => o.remove()), 900);
  };
  const render = () => {
    const sc = SCENES[look], d = data();
    swap(vd, page('d', sc, rubro, d, photo)); swap(vm, page('m', sc, rubro, d, photo));
    lookName.textContent = sc.name;
    ref.href = sc.case;
    links();
  };
  const update = () => {
    const d = data(), kick = [rubro.label, d.lugar].filter(Boolean).join(' · ');
    $$('[data-ep-name]', root).forEach((el) => (el.textContent = d.name));
    $$('[data-ep-kick]', root).forEach((el) => (el.textContent = kick));
    $$('[data-ep-sub]', root).forEach((el) => (el.textContent = `${rubro.sub}${d.lugar ? ` en ${d.lugar}` : ''}. Reserve directo, sin comisiones.`));
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
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); typeDemo(); } }, { threshold: 0.35 }).observe(vd);
}

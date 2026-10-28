// Núcleo común de las páginas del estudio: scroll suave, cabecera, menú, cursor, relojes,
// apariciones al hacer scroll, transición entre páginas, sonido y el cajón de Vaeru IA.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { track, trackOutbound } from '../analytics.js';
import { initSound } from './sound.js';

gsap.registerPlugin(ScrollTrigger);

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const small = () => matchMedia('(max-width: 820px)').matches;
export { gsap, ScrollTrigger, track };

let lenis = null;
export const getLenis = () => lenis;

// ---------- utilidades de texto ----------
// El texto tal como se lee: los <br> cuentan como espacio ("Cada lugar,<br>su propia web" no se pega)
const readText = (el) => {
  const c = el.cloneNode(true);
  c.querySelectorAll('br').forEach((b) => b.replaceWith(' '));
  return c.textContent.replace(/\s+/g, ' ').trim();
};
// Letras sueltas se leen mal en algunos lectores: el titular, enlace o botón que las contiene lleva el texto
// completo como aria-label (si ya tiene uno, se respeta); fuera de ellos, una copia oculta para lectores.
function labelSplit(el, label, parts) {
  parts.forEach((p) => p.nodeType === 1 && p.setAttribute('aria-hidden', 'true'));
  const host = el.closest('h1, h2, h3, h4, h5, h6, a, button');
  if (host) { if (!host.hasAttribute('aria-label')) host.setAttribute('aria-label', readText(host)); }
  else { const sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = label; el.append(sr); }
}

// Divide un elemento en líneas reales (respetando <em>, <br> y <i>) para animarlas línea por línea.
// Entre líneas queda un espacio, así el texto del titular se lee entero (buscadores y copiar/pegar).
export function splitLines(el) {
  if (el.dataset.splitDone) return $$('.ln > span', el);
  el.dataset.splitDone = '1';
  const tokens = [];
  const walk = (node, wrap) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === 3) {
        for (const part of n.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { tokens.push(' '); continue; }
          const s = document.createElement('span'); s.className = 'tk'; s.textContent = part;
          tokens.push(wrap ? wrap(s) : s);
        }
      } else if (n.nodeName === 'BR') tokens.push('\n');
      else if (n.nodeType === 1 && n.childNodes.length) {
        walk(n, (s) => { const c = n.cloneNode(false); c.append(wrap ? wrap(s) : s); return c; });
      } else tokens.push(n.cloneNode(true));
    }
  };
  walk(el, null);
  el.innerHTML = '';
  const probe = tokens.filter((t) => typeof t !== 'string');
  tokens.forEach((t) => el.append(t === '\n' ? document.createElement('br') : typeof t === 'string' ? document.createTextNode(t) : t));
  const lines = []; let top = null, br = false;
  for (const node of [...el.childNodes]) {
    if (node.nodeName === 'BR') { br = true; continue; }
    if (node.nodeType === 3) { if (lines.length) lines[lines.length - 1].push(node); continue; }
    const y = node.getBoundingClientRect().top;
    if (top === null || br || Math.abs(y - top) > 4) { lines.push([]); top = y; br = false; }
    lines[lines.length - 1].push(node);
  }
  el.innerHTML = '';
  lines.forEach((ln, i) => {
    const line = document.createElement('span'); line.className = 'ln';
    const inner = document.createElement('span');
    while (ln.length && ln[ln.length - 1].nodeType === 3) ln.pop();
    ln.forEach((t) => inner.append(t));
    line.append(inner);
    if (i) el.append(' ');
    el.append(line);
  });
  void probe;
  return $$('.ln > span', el);
}

// Divide en caracteres (para titulares cortos)
export function splitChars(el) {
  if (el.dataset.charsDone) return $$('.ch', el);
  el.dataset.charsDone = '1';
  const label = readText(el);
  const walk = (node) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const word of n.textContent.split(/(\s+)/)) {
          if (!word) continue;
          if (/^\s+$/.test(word)) { frag.append(' '); continue; }
          const w = document.createElement('span'); w.className = 'wd';
          for (const c of word) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.append(s); }
          frag.append(w);
        }
        n.replaceWith(frag);
      } else if (n.nodeName === 'BR') n.before(' ');
      else if (n.nodeType === 1) walk(n);
    }
  };
  walk(el);
  labelSplit(el, label, [...el.children]);
  return $$('.ch', el);
}

// ---------- luz de proyector ----------
// El titular entra en penumbra y un haz cálido lo cruza de izquierda a derecha, dejándolo encendido.
// Al terminar se quita la máscara, así el titular queda como cualquier otro texto.
export function projectorLight(el, vars = {}) {
  if (reduced || !el) return null;
  el.classList.add('beam');
  el.style.setProperty('--p', '-25%');
  return gsap.to(el, {
    '--p': '130%', duration: 1.9, ease: 'power2.inOut', ...vars,
    onComplete: () => { el.classList.remove('beam'); el.style.removeProperty('--p'); },
  });
}

// ---------- apariciones ----------
export function reveal(root = document) {
  if (reduced) return;
  $$('[data-reveal="lines"]', root).forEach((el) => {
    const lines = splitLines(el);
    gsap.from(lines, { yPercent: 160, rotate: 2, duration: 1.3, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    if (/^H[12]$/.test(el.nodeName)) projectorLight(el, { delay: 0.12, scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  // Mientras entran, sin transiciones CSS propias (si no, el "hover" de la tarjeta frena la animación a medio
  // camino); al terminar se limpia todo, así el hover vuelve a funcionar.
  const settle = { clearProps: 'transform,translate,rotate,scale,opacity,transition' };
  $$('[data-reveal="fade"]', root).forEach((el) => {
    gsap.set(el, { transition: 'none' });
    gsap.from(el, { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', ...settle, scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  $$('[data-reveal="clip"]', root).forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(18% 8% 18% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true } });
    const img = $('img, video', el);
    if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('[data-reveal="stagger"]', root).forEach((el) => {
    gsap.set(el.children, { transition: 'none' });
    gsap.from(el.children, { y: 40, opacity: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out', ...settle, scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('[data-parallax]', root).forEach((el) => {
    gsap.to(el, { yPercent: -(+el.dataset.parallax || 12), ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

// ---------- cajón de Vaeru IA ----------
let drawerChat = null, lastFocus = null, closeMenuRef = () => {};
export async function openAgent(question, source = 'boton') {
  const drawer = $('[data-drawer]'); if (!drawer) return;
  if (!drawerChat) {
    const { Chat } = await import('../chat.js');
    drawerChat = new Chat($('[data-agent-drawer]'), { closable: true, onClose: closeAgent, source: 'cajon' });
  }
  closeMenuRef();
  lastFocus = document.activeElement;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('agent-open');
  lenis?.stop();
  track('agent_open', { source });
  setTimeout(() => drawerChat.input.focus({ preventScroll: true }), 450);
  if (question) drawerChat.send(question);
}
export function closeAgent() {
  const drawer = $('[data-drawer]'); if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('agent-open');
  lenis?.start();
  lastFocus?.focus?.({ preventScroll: true });
}

function trap(container, e) {
  const f = $$('button, a[href], input, select, textarea, [tabindex="0"]', container).filter((el) => !el.disabled && el.offsetParent !== null);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
}

// ---------- arranque común ----------
export function boot({ smooth = true } = {}) {
  const html = document.documentElement;
  if (reduced) html.classList.add('reduced');
  if (fine) html.classList.add('fine');
  trackOutbound();
  try { sessionStorage.setItem('rv-seen', '1'); } catch { /* sin almacenamiento */ }

  // Scroll suave
  if (smooth && !reduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(id, { duration: 1.4 }) : $(id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }));

  // Cabecera: se esconde al bajar y vuelve al subir
  const hd = $('[data-hd]');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    hd?.classList.toggle('is-scrolled', y > 30);
    hd?.classList.toggle('is-hidden', y > lastY + 2 && y > 240 && !html.classList.contains('menu-open'));
    if (y < lastY - 2) hd?.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Luz vino de fondo: los resplandores viajan en sentidos opuestos mientras se baja por la página
  const amb = $('.ambient');
  if (amb && !reduced) {
    const [ga, gb] = $$('i', amb);
    let queued = false;
    const glow = () => {
      queued = false;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), k = Math.min(1, scrollY / max);
      ga.style.transform = `translate3d(${(-k * 18).toFixed(2)}vw, ${(k * 70).toFixed(2)}vh, 0)`;
      gb.style.transform = `translate3d(${(k * 22).toFixed(2)}vw, ${(-k * 60).toFixed(2)}vh, 0)`;
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(glow); } }, { passive: true });
    glow();
  }

  // Revisión gratis: arma el mensaje con el enlace del visitante y lo abre en WhatsApp o en su correo
  const rev = $('[data-review]');
  if (rev) {
    const err = $('[data-review-err]', rev), mail = $('[data-review-mail]', rev);
    const msg = () => {
      const enlace = rev.enlace.value.trim(), negocio = rev.negocio.value.trim();
      return `Hola Red Vaeru, quiero la revisión gratis de mi presencia en línea.\nEnlace: ${enlace}${negocio ? `\nNegocio: ${negocio}` : ''}`;
    };
    const valid = () => {
      const ok = rev.enlace.value.trim().length >= 3;
      err.hidden = ok;
      rev.enlace.toggleAttribute('aria-invalid', !ok);
      if (!ok) rev.enlace.focus();
      return ok;
    };
    rev.enlace.addEventListener('input', () => { if (!err.hidden && rev.enlace.value.trim().length >= 3) { err.hidden = true; rev.enlace.removeAttribute('aria-invalid'); } });
    rev.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!valid()) return;
      track('review_request', { via: 'whatsapp', page: location.pathname });
      window.open(`https://wa.me/56952289117?text=${encodeURIComponent(msg())}`, '_blank', 'noopener');
    });
    mail.addEventListener('click', (e) => {
      if (!valid()) { e.preventDefault(); return; }
      track('review_request', { via: 'correo', page: location.pathname });
      mail.href = `mailto:redvaeru@gmail.com?subject=${encodeURIComponent('Revisión gratis')}&body=${encodeURIComponent(msg())}`;
    });
  }

  // Menú a pantalla completa
  const btn = $('[data-menu-btn]'), menu = $('[data-menu]');
  const setMenu = (open) => {
    if (!menu) return;
    html.classList.toggle('menu-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
    $('.hd__menu-l', btn).textContent = open ? 'Cerrar' : 'Menú';
    if (open) { lenis?.stop(); setTimeout(() => $('a', menu)?.focus({ preventScroll: true }), 350); } else lenis?.start();
  };
  closeMenuRef = () => html.classList.contains('menu-open') && setMenu(false);
  btn?.addEventListener('click', () => setMenu(!html.classList.contains('menu-open')));
  menu?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); btn.focus(); } if (e.key === 'Tab') trap(menu, e); });
  $$('a', menu || document.createElement('div')).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Cursor y botones magnéticos (solo con mouse)
  if (fine && !reduced) {
    const cur = $('.cursor');
    if (cur) {
      const dot = $('.cursor__dot', cur), ring = $('.cursor__ring', cur), label = $('em', ring);
      const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
      const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
      let mx = 0, my = 0, px = 0, py = 0, speed = 0, angle = 0;
      addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; dx(mx); dy(my); rx(mx); ry(my); cur.classList.add('is-on'); }, { passive: true });
      document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
      document.addEventListener('pointerover', (e) => {
        const lab = e.target.closest('[data-cursor]');
        const hov = e.target.closest('a, button, summary, input, select, textarea, label, [role="tab"]');
        const media = !lab && e.target.closest('video, .doc__phone, .cs-phone, .prod__phone, .scene__phone, .est__screens');
        cur.classList.toggle('is-label', !!lab);
        label.textContent = lab ? lab.dataset.cursor : '';
        cur.classList.toggle('is-media', !!media);
        cur.classList.toggle('is-hover', !!hov && !lab && !media);
      });
      // El anillo se estira en la dirección del movimiento, como una gota de luz que sigue al puntero
      const rot = gsap.quickSetter(ring, 'rotation', 'rad'), sx = gsap.quickSetter(ring, 'scaleX'), sy = gsap.quickSetter(ring, 'scaleY');
      gsap.ticker.add(() => {
        const vx = mx - px, vy = my - py;
        px = mx; py = my;
        const v = Math.hypot(vx, vy);
        speed += (v - speed) * 0.18;
        if (v > 1.5) angle = Math.atan2(vy, vx);
        const k = cur.classList.contains('is-label') ? 0 : Math.min(speed / 45, 0.5);
        rot(k > 0.01 ? angle : 0); sx(1 + k); sy(1 - k * 0.45);
      });
    }
    // Tarjetas con lámpara: la luz cálida cae donde está el puntero
    $$('[data-lamp]').forEach((el) => el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.28); yTo((e.clientY - r.top - r.height / 2) * 0.36); });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  // "Conversemos" respira con el puntero: cada letra engrosa y se ensancha según lo cerca que pase
  const big = $('.ft__big span');
  if (big && fine && !reduced) {
    big.closest('a').setAttribute('aria-label', big.textContent.trim());
    const chars = splitChars(big).map((el) => ({ el, w: 240, s: 62.5 }));
    let px = -1e4, py = -1e4, on = false, raf = 0;
    const loop = () => {
      let moving = false;
      const R = Math.max(220, innerWidth * 0.28);
      for (const c of chars) {
        const r = c.el.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / R), e = k * k * (3 - 2 * k);
        const tw = 240 + 260 * e, ts = 62.5 + 12.5 * e;
        c.w += (tw - c.w) * 0.14; c.s += (ts - c.s) * 0.14;
        if (Math.abs(tw - c.w) > 0.5) moving = true;
        c.el.style.fontWeight = c.w.toFixed(0);
        c.el.style.fontStretch = c.s.toFixed(1) + '%';
      }
      raf = on || moving ? requestAnimationFrame(loop) : 0;
    };
    const ft = $('[data-ft]');
    ft.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    ft.addEventListener('pointerenter', () => { on = true; });
    ft.addEventListener('pointerleave', () => { on = false; px = py = -1e4; if (!raf) raf = requestAnimationFrame(loop); });
  }

  // Relojes de las dos orillas y año
  const clocks = $$('[data-clock]');
  const tick = () => clocks.forEach((el) => { el.textContent = new Intl.DateTimeFormat('es-CL', { timeZone: el.dataset.clock, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()); });
  if (clocks.length) { tick(); setInterval(tick, 20000); }
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  // Vaeru IA
  const drawer = $('[data-drawer]');
  drawer?.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAgent(); if (e.key === 'Tab') trap($('[data-agent-drawer]'), e); });
  $$('[data-open-agent]').forEach((b) => b.addEventListener('click', () => openAgent(b.dataset.ask, b.dataset.source || 'boton')));
  $$('[data-close-agent]').forEach((b) => b.addEventListener('click', closeAgent));
  const fab = $('[data-fab]');
  if (fab) {
    // Dos caminos: WhatsApp con un mensaje que ya dice desde dónde escribe, o Vaeru IA
    const fbtn = $('[data-fab-btn]', fab), fmenu = $('[data-fab-menu]', fab), fwa = $('[data-fab-wa]', fab);
    const p = location.pathname, caso = $('.cs-hero__name')?.textContent.trim(), titulo = document.title.split(' · ')[0];
    const msg = p.startsWith('/trabajos/') && caso ? `Hola, vi el caso de ${caso} en el sitio de Red Vaeru y quiero algo así para mi negocio.`
      : p === '/servicios/' ? 'Hola, vi los planes en el sitio de Red Vaeru y quiero cotizar mi sitio.'
      : p.startsWith('/servicios/') ? `Hola, vi «${titulo}» en el sitio de Red Vaeru y me interesa.`
      : p.startsWith('/trabajos') ? 'Hola, vi los trabajos de Red Vaeru y quiero conversar sobre mi negocio.'
      : p.startsWith('/estudio') ? 'Hola, conocí el estudio Red Vaeru y quiero conversar.'
      : 'Hola, vengo del sitio de Red Vaeru.';
    fwa.href = `${fwa.href.split('?')[0]}?text=${encodeURIComponent(msg)}`;
    const setFab = (on) => { fmenu.hidden = !on; fab.classList.toggle('is-open', on); fbtn.setAttribute('aria-expanded', String(on)); if (on) $('a, button', fmenu).focus({ preventScroll: true }); };
    fbtn.addEventListener('click', () => { setFab(fmenu.hidden); if (!fmenu.hidden) track('fab_open', { page: p }); });
    fmenu.addEventListener('click', (e) => { if (e.target.closest('a, button')) setFab(false); });
    fab.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !fmenu.hidden) { setFab(false); fbtn.focus(); } });
    document.addEventListener('pointerdown', (e) => { if (!fmenu.hidden && !fab.contains(e.target)) setFab(false); });
    const showFab = () => fab.classList.toggle('is-visible', scrollY > innerHeight * 0.5 || document.body.dataset.fab === 'always');
    addEventListener('scroll', showFab, { passive: true }); showFab();
  }

  // Transición entre páginas cuando el navegador no tiene View Transitions entre documentos
  const vt = 'PageRevealEvent' in window || 'onpagereveal' in window;
  if (!vt && !reduced) {
    html.classList.add('curtain-js');
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || url.pathname.startsWith('/muestras/')) return;
      e.preventDefault();
      html.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 520);
    });
    addEventListener('pageshow', () => html.classList.remove('is-leaving'));
  }

  initSound();
  return { lenis };
}

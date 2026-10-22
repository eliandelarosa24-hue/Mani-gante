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
// Divide un elemento en líneas reales (respetando <em>, <br> y <i>) para animarlas línea por línea.
export function splitLines(el) {
  if (el.dataset.splitDone) return $$('.ln > span', el);
  el.dataset.splitDone = '1';
  const label = el.textContent.replace(/\s+/g, ' ').trim();
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
  el.setAttribute('aria-label', label);
  for (const ln of lines) {
    const line = document.createElement('span'); line.className = 'ln'; line.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    while (ln.length && ln[ln.length - 1].nodeType === 3) ln.pop();
    ln.forEach((t) => inner.append(t));
    line.append(inner);
    el.append(line);
  }
  void probe;
  return $$('.ln > span', el);
}

// Divide en caracteres (para titulares cortos)
export function splitChars(el) {
  if (el.dataset.charsDone) return $$('.ch', el);
  el.dataset.charsDone = '1';
  const label = el.textContent.replace(/\s+/g, ' ').trim();
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
      } else if (n.nodeType === 1 && n.nodeName !== 'BR') walk(n);
    }
  };
  walk(el);
  el.setAttribute('aria-label', label);
  for (const c of el.children) c.setAttribute('aria-hidden', 'true');
  return $$('.ch', el);
}

// ---------- apariciones ----------
export function reveal(root = document) {
  if (reduced) return;
  $$('[data-reveal="lines"]', root).forEach((el) => {
    const lines = splitLines(el);
    gsap.from(lines, { yPercent: 115, rotate: 2, duration: 1.3, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('[data-reveal="fade"]', root).forEach((el) => {
    gsap.from(el, { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  $$('[data-reveal="clip"]', root).forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(18% 8% 18% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true } });
    const img = $('img, video', el);
    if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('[data-reveal="stagger"]', root).forEach((el) => {
    gsap.from(el.children, { y: 40, opacity: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
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
      addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); cur.classList.add('is-on'); }, { passive: true });
      document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
      document.addEventListener('pointerover', (e) => {
        const lab = e.target.closest('[data-cursor]');
        const hov = e.target.closest('a, button, summary, input, select, textarea, label, [role="tab"]');
        cur.classList.toggle('is-label', !!lab);
        label.textContent = lab ? lab.dataset.cursor : '';
        cur.classList.toggle('is-hover', !!hov && !lab);
      });
    }
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.28); yTo((e.clientY - r.top - r.height / 2) * 0.36); });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  // Relojes de las dos casas y año
  const clocks = $$('[data-clock]');
  const tick = () => clocks.forEach((el) => { el.textContent = new Intl.DateTimeFormat('es-CL', { timeZone: el.dataset.clock, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()); });
  if (clocks.length) { tick(); setInterval(tick, 20000); }
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  // Vaeru IA
  const drawer = $('[data-drawer]');
  drawer?.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAgent(); if (e.key === 'Tab') trap($('[data-agent-drawer]'), e); });
  $$('[data-open-agent]').forEach((b) => b.addEventListener('click', () => openAgent(b.dataset.ask, b.dataset.source || 'boton')));
  $$('[data-close-agent]').forEach((b) => b.addEventListener('click', closeAgent));
  const fab = $('.fab');
  if (fab) {
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

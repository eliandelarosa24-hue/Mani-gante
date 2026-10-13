// Comportamiento común a todas las páginas: scroll suave, navegación, cursor, agente, campaña y analítica.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Chat } from './chat.js';
import { fromPrice, formatCLP, launchLeft, LAUNCH, CAMPAIGN, USD_RATE, SERVICES, priceOf } from './pricing.js';
import { track, trackOutbound } from './analytics.js';

gsap.registerPlugin(ScrollTrigger);

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initShared() {
  if (reduced) document.documentElement.classList.add('reduced');
  trackOutbound();

  // Imágenes con respaldo: si una imagen externa falla, queda el degradado de marca.
  $$('img').forEach((img) => {
    const fail = () => img.parentElement?.classList.add('img-fail');
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    img.addEventListener('error', fail);
  });

  // Precios "desde", cupos y año.
  let cur = 'CLP';
  try { cur = localStorage.getItem('rv-cur') || 'CLP'; } catch { /* sin almacenamiento */ }
  const paintPrices = () => {
    $$('[data-from]').forEach((el) => {
      const v = fromPrice(el.dataset.from);
      if (!v) return;
      const txt = cur === 'USD' ? `US$${Math.round(v / USD_RATE)} aprox.` : formatCLP(v);
      el.textContent = `desde ${txt}${el.hasAttribute('data-monthly') ? '/mes' : ''}`;
    });
    // Precio de cada plan: el de lanzamiento destacado y el normal tachado mientras queden cupos.
    const money = (v) => (cur === 'USD' ? `US$${Math.round(v / USD_RATE).toLocaleString('es-CL')}` : formatCLP(v));
    $$('[data-tier-price]').forEach((el) => {
      const [sid, tid] = el.dataset.tierPrice.split(':');
      const t = SERVICES[sid]?.tiers?.[tid]; if (!t) return;
      const p = priceOf(t), per = el.hasAttribute('data-monthly') ? '<small>/mes</small>' : '';
      el.innerHTML = el.closest('.plan')
        ? `<span>desde</span><strong>${money(p.min)}${per}</strong>${p !== t ? `<s>Precio normal desde ${money(t.min)}</s>` : ''}`
        : `${money(p.min)}${per}`;
    });
    $$('[data-cur]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.cur === cur)));
  };
  $$('[data-cur]').forEach((b) => b.addEventListener('click', () => {
    cur = b.dataset.cur;
    try { localStorage.setItem('rv-cur', cur); } catch { /* sin almacenamiento */ }
    paintPrices();
    track('currency', { cur });
  }));
  paintPrices();
  $$('[data-launch-left]').forEach((el) => (el.textContent = launchLeft()));
  $$('[data-launch-total]').forEach((el) => (el.textContent = LAUNCH.slots));
  $$('[data-launch-bar]').forEach((el) => (el.style.transform = `scaleX(${LAUNCH.taken / LAUNCH.slots})`));
  if (launchLeft() === 0) $$('[data-launch]').forEach((el) => el.remove());
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  // Barra de campaña de temporada (se oculta sola después de la fecha límite o si el visitante la cierra).
  const bar = $('[data-campaign]');
  if (bar) {
    let closed = false;
    try { closed = sessionStorage.getItem('rv-campaign') === '1'; } catch { /* sin almacenamiento */ }
    if (new Date() > new Date(CAMPAIGN.deadline + 'T23:59:59') || closed) bar.remove();
    else {
      $('[data-campaign-text]', bar).textContent = CAMPAIGN.text;
      document.documentElement.classList.add('has-campaign');
      $('[data-campaign-close]', bar).addEventListener('click', () => {
        bar.remove();
        document.documentElement.classList.remove('has-campaign');
        try { sessionStorage.setItem('rv-campaign', '1'); } catch { /* sin almacenamiento */ }
      });
    }
  }

  // Scroll suave
  let lenis = null;
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target) => (lenis ? lenis.scrollTo(target, { offset: -70, duration: 1.4 }) : $(target)?.scrollIntoView({ behavior: 'smooth' }));
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    closeMenu();
    scrollTo(id);
  }));

  // Navegación, progreso de lectura y botón flotante
  const nav = $('[data-nav]');
  const progress = $('[data-progress]');
  const fab = $('.fab');
  let lastY = 0;
  let menuOpen = false;
  const onScroll = () => {
    const y = scrollY;
    nav?.classList.toggle('is-scrolled', y > 40);
    nav?.classList.toggle('is-hidden', y > lastY && y > 400 && !menuOpen);
    lastY = y;
    fab?.classList.toggle('is-visible', y > innerHeight * 0.6);
    $('.mbar')?.classList.toggle('is-visible', y > innerHeight * 0.6);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menu.classList.toggle('is-open', menuOpen);
    menu.setAttribute('aria-hidden', String(!menuOpen));
    burger.setAttribute('aria-expanded', String(menuOpen));
  });
  $$('a', menu || document.createElement('div')).forEach((a) => a.addEventListener('click', closeMenu));

  // Cursor y botones magnéticos (solo con mouse)
  if (fine && !reduced) {
    const cur = $('.cursor');
    const dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = ring.querySelector('em');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, summary, .svc__row, input, select, textarea, label');
      cur.classList.toggle('is-label', !!lab);
      label.textContent = lab ? lab.dataset.cursor : '';
      cur.classList.toggle('is-hover', !!hov && !lab);
    });
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3' });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
    });
  }

  // Agente en cajón lateral, con foco atrapado mientras está abierto
  const drawer = $('[data-drawer]');
  let drawerChat = null;
  let lastFocus = null;
  function openAgent(question, source = 'boton') {
    if (!drawerChat) drawerChat = new Chat($('[data-agent-drawer]'), { closable: true, onClose: closeAgent, source: 'cajon' });
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    $('.nudge')?.remove();
    lenis?.stop();
    track('agent_open', { source });
    setTimeout(() => drawerChat.input.focus({ preventScroll: true }), 400);
    if (question) drawerChat.send(question);
  }
  function closeAgent() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    lenis?.start();
    lastFocus?.focus?.({ preventScroll: true });
  }
  drawer?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') return closeAgent();
    if (e.key !== 'Tab') return;
    const f = $$('button, a[href], input, select, textarea', $('[data-agent-drawer]')).filter((el) => !el.disabled && el.offsetParent);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  $$('[data-open-agent]').forEach((b) => b.addEventListener('click', () => { closeMenu(); openAgent(b.dataset.ask, b.dataset.source || 'boton'); }));
  $$('[data-close-agent]').forEach((b) => b.addEventListener('click', closeAgent));

  // Invitación proactiva del agente: una vez por sesión, tras 25 s o al pasar la mitad de la página.
  let nudged = false;
  try { nudged = sessionStorage.getItem('rv-nudge') === '1'; } catch { /* sin almacenamiento */ }
  if (fab && !nudged) {
    const show = () => {
      if (nudged || drawer.classList.contains('is-open')) return;
      nudged = true;
      try { sessionStorage.setItem('rv-nudge', '1'); } catch { /* sin almacenamiento */ }
      fab.classList.add('is-visible');
      const n = document.createElement('button');
      n.className = 'nudge';
      n.type = 'button';
      n.innerHTML = '<strong>¿Cuánto costaría su sitio?</strong><span>Le doy un rango en 1 minuto.</span>';
      n.addEventListener('click', () => openAgent(null, 'invitacion'));
      document.body.append(n);
      setTimeout(() => n.classList.add('is-in'), 30);
      setTimeout(() => { n.classList.remove('is-in'); setTimeout(() => n.remove(), 600); }, 9000);
    };
    // Una sola invitación, tarde y discreta: el sitio respira y el visitante explora tranquilo.
    setTimeout(show, 45000);
  }

  return { lenis, openAgent, closeAgent, scrollTo };
}

// Divide un título en líneas (conservando <em>) para animarlas.
export function splitLines(el) {
  const words = [];
  const walk = (node, wrapEm) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { words.push(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.textContent = part;
          if (wrapEm) { const em = document.createElement('em'); em.append(s); words.push(em); } else words.push(s);
        });
      } else if (n.nodeName === 'EM') walk(n, true);
      else words.push(n.cloneNode(true));
    });
  };
  walk(el, false);
  el.innerHTML = '';
  words.forEach((w) => el.append(w));
  const lines = [];
  let top = null;
  [...el.children].forEach((t) => {
    const y = t.getBoundingClientRect().top;
    if (top === null || Math.abs(y - top) > 4) { lines.push([]); top = y; }
    lines[lines.length - 1].push(t);
  });
  el.innerHTML = '';
  lines.forEach((ln) => {
    const line = document.createElement('span');
    line.className = 'line';
    const inner = document.createElement('span');
    ln.forEach((t, i) => { inner.append(t); if (i < ln.length - 1) inner.append(' '); });
    line.append(inner);
    el.append(line, ' '); // el espacio evita que los lectores de pantalla lean "quese"
  });
  return $$('.line > span', el);
}

// Animaciones comunes de aparición
export function revealOnScroll() {
  if (reduced) return;
  $$('[data-split]').forEach((el) => {
    if (el.closest('.hero')) return;
    const lines = splitLines(el);
    gsap.from(lines, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  $$('[data-fade]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });
}

export { gsap, ScrollTrigger, track };

// Filtro de muestras por rubro (página principal y galería de muestras)
export function initSampleFilters() {
  $$('.sfilters').forEach((wrap) => {
    const cards = $$('.sample', wrap.parentElement);
    $$('button', wrap).forEach((b) => b.addEventListener('click', () => {
      $$('button', wrap).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      cards.forEach((c) => { c.hidden = b.dataset.sf !== 'todo' && c.dataset.niche !== b.dataset.sf; });
      track('samples_filter', { niche: b.dataset.sf });
    }));
  });
}

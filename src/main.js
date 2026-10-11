import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroShader } from './hero-shader.js';
import { Chat } from './chat.js';
import { fromPrice, formatCLP } from './pricing.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (reduced) document.documentElement.classList.add('reduced');

// ---------- imágenes con respaldo ----------
$$('img').forEach((img) => {
  const fail = () => img.parentElement?.classList.add('img-fail');
  if (img.complete && img.naturalWidth === 0 && img.src) fail();
  img.addEventListener('error', fail);
});

// ---------- precios "desde" ----------
$$('[data-from]').forEach((el) => {
  const v = fromPrice(el.dataset.from);
  if (v) el.textContent = `desde ${formatCLP(v)}${el.hasAttribute('data-monthly') ? '/mes' : ''}`;
});
$$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// ---------- scroll suave ----------
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollTo = (target) => (lenis ? lenis.scrollTo(target, { offset: -60, duration: 1.4 }) : $(target)?.scrollIntoView({ behavior: 'smooth' }));
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  if (id.length < 2 || !$(id)) return;
  e.preventDefault();
  closeMenu();
  scrollTo(id);
}));

// ---------- texto dividido en líneas/palabras ----------
function splitLines(el) {
  // Envuelve cada palabra conservando <em>, luego agrupa por línea visual.
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
  const tokens = [...el.children];
  const lines = [];
  let top = null;
  tokens.forEach((t) => {
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
    el.append(line);
  });
  return $$('.line > span', el);
}

function wordsOf(el) {
  const text = el.textContent.trim().split(/\s+/);
  el.innerHTML = text.map((w) => `<span class="w">${w}</span>`).join(' ');
  return $$('.w', el);
}

// ---------- precarga + entrada ----------
function intro() {
  const loader = $('.loader');
  const heroLines = splitLines($('.hero__title'));
  const tl = gsap.timeline();
  if (reduced || !loader) { loader?.remove(); return; }
  const counter = { v: 0 };
  tl.to(counter, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { $('[data-count]').textContent = Math.round(counter.v); } })
    .to('.loader__line', { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
    .from('.loader__mark', { scale: 0.6, opacity: 0, rotate: -40, duration: 1.2, ease: 'expo.out' }, 0)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '+=0.1')
    .from(heroLines, { yPercent: 110, duration: 1.3, stagger: 0.08, ease: 'expo.out' }, '-=0.45')
    .from('.hero [data-fade]', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=1')
    .from('.ph', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, stagger: 0.12, ease: 'expo.inOut' }, '-=1.3')
    .from('.ph img', { scale: 1.5, duration: 1.8, stagger: 0.12, ease: 'expo.out' }, '<')
    .from('.hero__foot > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, '-=1')
    .from('.nav', { opacity: 0, duration: 0.8, ease: 'power2.out', clearProps: 'opacity' }, '-=0.9')
    .add(() => loader.remove());
}

function scrollAnimations() {
  if (reduced) { $$('.manifesto__text').forEach((el) => wordsOf(el).forEach((w) => (w.style.opacity = 1))); return; }

  // Collage del hero con parallax
  gsap.to('.ph--a', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.ph--b', { yPercent: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.ph--c', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__inner', { yPercent: 18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Títulos divididos
  $$('[data-split]').forEach((el) => {
    if (el.closest('.hero')) return;
    const lines = splitLines(el);
    gsap.from(lines, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  // Manifiesto: palabras que se encienden al hacer scroll
  $$('[data-words]').forEach((el) => {
    const ws = wordsOf(el);
    gsap.to(ws, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } });
  });

  // Apariciones
  $$('[data-fade]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.from('.svc__row', { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.svc', start: 'top 80%' } });
  gsap.from('.ota__calc', { y: 80, rotate: 2, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ota', start: 'top 80%' } });
  gsap.from('.about__half', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, stagger: 0.15, ease: 'expo.inOut', scrollTrigger: { trigger: '.about__visual', start: 'top 80%' } });
  gsap.from('.about__mark', { scale: 0, rotate: -180, duration: 1.4, ease: 'expo.out', delay: 0.6, scrollTrigger: { trigger: '.about__visual', start: 'top 80%' } });
  gsap.from('.agent__panel', { y: 80, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.agent', start: 'top 70%' } });
  gsap.from('.footer__word', { yPercent: 60, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 90%' } });

  // Barra del método
  gsap.to('[data-method-bar]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true } });

  // Trabajos: desplazamiento horizontal fijado (escritorio)
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      const track = $('[data-track]');
      const dist = () => track.scrollWidth - innerWidth;
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: '.work__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
      });
    },
  });
}

// ---------- navegación ----------
const nav = $('[data-nav]');
let lastY = 0;
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle('is-scrolled', y > 40);
  nav.classList.toggle('is-hidden', y > lastY && y > 400 && !menuOpen);
  lastY = y;
  $('.fab').classList.toggle('is-visible', y > innerHeight * 0.8);
};
addEventListener('scroll', onScroll, { passive: true });

const burger = $('[data-burger]');
const menu = $('[data-menu]');
let menuOpen = false;
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  menu.classList.remove('is-open');
  menu.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
}
burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menu.classList.toggle('is-open', menuOpen);
  menu.setAttribute('aria-hidden', String(!menuOpen));
  burger.setAttribute('aria-expanded', String(menuOpen));
});

// ---------- calculadora de comisiones ----------
const ota = $('[data-ota]');
const updateOta = () => {
  const n = +ota.nights.value, r = +ota.rate.value, f = +ota.fee.value;
  const year = n * r * (f / 100) * 12;
  $('[data-out="nights"]').textContent = n;
  $('[data-out="rate"]').textContent = formatCLP(r);
  $('[data-out="fee"]').textContent = f + '%';
  $('[data-ota-total]').textContent = formatCLP(year);
  $('[data-ota-hint]').textContent = `Recuperar solo el 30% como reservas directas son ${formatCLP(year * 0.3)} al año para su negocio.`;
};
ota.addEventListener('input', updateOta);
updateOta();

// ---------- servicios: imagen que sigue al cursor ----------
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

// ---------- cursor y botones magnéticos ----------
if (fine && !reduced) {
  const cur = $('.cursor');
  const dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = ring.querySelector('em');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
  addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const lab = e.target.closest('[data-cursor]');
    const hov = e.target.closest('a, button, summary, .svc__row, input, select, textarea');
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

// ---------- agente ----------
const drawer = $('[data-drawer]');
let drawerChat = null;
function openAgent(question) {
  if (!drawerChat) drawerChat = new Chat($('[data-agent-drawer]'), { closable: true, onClose: closeAgent });
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  lenis?.stop();
  setTimeout(() => drawerChat.input.focus({ preventScroll: true }), 400);
  if (question) drawerChat.send(question);
}
function closeAgent() {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  lenis?.start();
}
$$('[data-open-agent]').forEach((b) => b.addEventListener('click', () => { closeMenu(); openAgent(); }));
$$('[data-close-agent]').forEach((b) => b.addEventListener('click', closeAgent));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeAgent(); });
$$('.svc__row').forEach((row) => {
  row.tabIndex = 0;
  row.setAttribute('role', 'button');
  const go = () => openAgent(row.dataset.ask);
  row.addEventListener('click', go);
  row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
});
new Chat($('[data-agent-inline]'));

// ---------- inicio ----------
initHeroShader($('.hero__canvas'));
const boot = () => { intro(); scrollAnimations(); onScroll(); ScrollTrigger.refresh(); };
if (document.fonts?.ready) document.fonts.ready.then(boot); else addEventListener('load', boot);

// Graba los sitios reales en vista de celular, cuadro por cuadro, para usarlos en los Reels.
// El reloj de la página se controla con page.clock: cada cuadro avanza exactamente 1/30 s,
// así las animaciones y el desplazamiento se ven fluidos aunque la captura sea más lenta.
// Uso: node capture-sites.mjs [id ...]   (sin argumentos graba todos)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = new URL('./out/clips/', import.meta.url).pathname;
const TMP = new URL('./.frames/', import.meta.url).pathname;
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FPS = 30;
const VIEW = { width: 390, height: 844 };

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Cada clip: url, duración y plan de desplazamiento [segundo, destino].
// El destino es un número (px), 'end' (final de la página) o un selector CSS.
const CLIPS = {
  miah: {
    url: 'https://cabanasmiaynoah.netlify.app/', seconds: 15,
    plan: [[0, 0], [2.2, 0], [5, 900], [6.5, 900], [9.5, 2200], [11, 2200], [14, 3600], [15, 3600]],
  },
  // Recorrido por funciones reales de la web: reservas, guía de la zona, check-in y reseñas.
  'miah-funciones': {
    url: 'https://cabanasmiaynoah.netlify.app/', seconds: 17,
    plan: [[0, 0], [1.5, 0], [3, '#reserve'], [5.6, '#reserve'], [7, '#guide'], [9.6, '#guide'], [10.9, '#checkin'], [13.1, '#checkin'], [14.5, '#reviews'], [17, '#reviews']],
  },
  // Semana 2
  'redvaeru-metodo': {
    url: 'https://redvaeru.netlify.app/', seconds: 16, settle: 6000,
    plan: [[0, '#metodo'], [2.5, '#metodo'], [13, '#nosotros'], [16, '#nosotros']],
  },
  'termas-rayenko': {
    url: 'https://redvaeru.netlify.app/muestras/termas-rayenko/', seconds: 14,
    plan: [[0, 0], [2.5, 0], [6, 1100], [8, 1100], [12, 2600], [14, 2600]],
  },
  'kuchen-haus-frutillar': {
    url: 'https://redvaeru.netlify.app/muestras/kuchen-haus-frutillar/', seconds: 14,
    plan: [[0, 0], [2.5, 0], [6, 1100], [8, 1100], [12, 2600], [14, 2600]],
  },
  'hotel-casa-nogal': {
    url: 'https://redvaeru.netlify.app/muestras/hotel-casa-nogal/', seconds: 14,
    plan: [[0, 0], [2.5, 0], [6, 1100], [8, 1100], [12, 2600], [14, 2600]],
  },
  poetas: {
    url: 'https://elrincondelospoetas.netlify.app/', seconds: 15,
    plan: [[0, 0], [2.2, 0], [5, 900], [6.5, 900], [9.5, 2200], [11, 2200], [14, 3600], [15, 3600]],
  },
  calculadora: {
    url: 'https://redvaeru.netlify.app/', seconds: 14, settle: 6000,
    plan: [[0, '.ota'], [14, '.ota']],
    // Mueve los controles de la calculadora: 10 reservas, $90.000, 15 %.
    sliders: [
      { name: 'nights', from: 20, to: 10, t0: 1.5, t1: 4 },
      { name: 'rate', from: 90000, to: 90000, t0: 4, t1: 5 },
      { name: 'fee', from: 18, to: 15, t0: 5, t1: 7 },
    ],
  },
  'fogon-mapu': {
    url: 'https://redvaeru.netlify.app/muestras/fogon-mapu/', seconds: 12,
    plan: [[0, 0], [2, 0], [5, 1000], [6.5, 1000], [10, 2400], [12, 2400]],
  },
  'domos-cielo-austral': {
    url: 'https://redvaeru.netlify.app/muestras/domos-cielo-austral/', seconds: 12,
    plan: [[0, 0], [2.5, 0], [5.5, 1000], [7, 1000], [10.5, 2400], [12, 2400]],
  },
  // Semana 3
  'calculadora-restaurante': {
    url: 'https://redvaeru.netlify.app/', seconds: 14, settle: 6000,
    plan: [[0, '.ota'], [14, '.ota']],
    actions: [{ t: 0.6, click: '[data-ota-mode="rest"]' }],
    // Ejemplo: 120 pedidos al mes, $15.000 por pedido, 25 % de comisión.
    sliders: [
      { name: 'nights', from: 300, to: 120, t0: 2, t1: 4.5 },
      { name: 'rate', from: 18000, to: 15000, t0: 4.5, t1: 6 },
      { name: 'fee', from: 25, to: 25, t0: 6, t1: 7 },
    ],
  },
  'redvaeru-diagnostico': {
    url: 'https://redvaeru.netlify.app/', seconds: 16, settle: 6000,
    plan: [[0, '#diagnostico'], [1.5, '#diagnostico'], [3, '[data-quiz]'], [16, '[data-quiz]']],
    actions: [3.6, 4.8, 6, 7.2, 8.4, 9.6].map((t, i) => ({ t, click: `[data-quiz-o] .quiz__opt:nth-child(${i % 2 ? 3 : 2})` })),
  },
  'redvaeru-planes': {
    url: 'https://redvaeru.netlify.app/', seconds: 16, settle: 6000,
    plan: [[0, '#planes'], [2.5, '#planes'], [15, '#proyectos'], [16, '#proyectos']],
  },
  'cabanas-lago-azul': {
    url: 'https://redvaeru.netlify.app/muestras/cabanas-lago-azul/', seconds: 14,
    plan: [[0, 0], [2.5, 0], [6, 1100], [8, 1100], [12, 2600], [14, 2600]],
  },
  'pucon-aventura': {
    url: 'https://redvaeru.netlify.app/muestras/pucon-aventura/', seconds: 14,
    plan: [[0, 0], [2.5, 0], [6, 1100], [8, 1100], [12, 2600], [14, 2600]],
  },
  // Semana 4
  'vina-los-robles': {
    url: 'https://redvaeru.netlify.app/muestras/vina-los-robles/', seconds: 14,
    plan: [[0, 0], [2.5, 0], [6, 1100], [8, 1100], [12, 2600], [14, 2600]],
  },
  'villa-coral-samana': {
    url: 'https://redvaeru.netlify.app/muestras/villa-coral-samana/', seconds: 14,
    plan: [[0, 0], [2.5, 0], [6, 1100], [8, 1100], [12, 2600], [14, 2600]],
  },
  // Muestra de edición humana: la calculadora sube hasta los valores por defecto (20 reservas, $90.000, 18 %).
  'calculadora-sube': {
    url: 'https://redvaeru.netlify.app/', seconds: 12, settle: 6000,
    plan: [[0, '.ota'], [12, '.ota']],
    sliders: [
      { name: 'nights', from: 4, to: 20, t0: 0, t1: 5 },
    ],
  },
  // Muestra 2 de edición humana: galería por cabaña y guía de la zona de Miah y Noah, con toques reales.
  'miah-galeria': {
    url: 'https://cabanasmiaynoah.netlify.app/', seconds: 10,
    plan: [[0, '#gallery'], [10, '#gallery']],
    actions: [{ t: 2.2, click: '#gf button:nth-child(2)' }, { t: 4.6, click: '#gf button:nth-child(3)' }, { t: 7, click: '#gf button:nth-child(1)' }],
  },
  'miah-guia': {
    url: 'https://cabanasmiaynoah.netlify.app/', seconds: 10, prescroll: true,
    plan: [[0, '#fil@-400'], [3, '#fil@-400'], [3.7, '#fil@-150'], [10, '#fil@-150']],
    actions: [{ t: 4.2, click: '#fil button:nth-child(2)' }, { t: 6.6, click: '#fil button:nth-child(3)' }],
  },
  'redvaeru-inicio': {
    url: 'https://redvaeru.netlify.app/', seconds: 10, settle: 6000,
    plan: [[0, 0], [3, 0], [10, 2200]],
  },
  // Sitio nuevo de Red Vaeru (la función de cine), para los 5 videos de seguidores.
  'rv-apertura': {
    url: 'https://redvaeru.netlify.app/', seconds: 8, settle: 200,
    plan: [[0, 0], [8, 0]],
  },
  'rv-funcion': {
    url: 'https://redvaeru.netlify.app/', seconds: 26, settle: 6000,
    plan: [[0, 0], [1.5, 0], [24.5, 9340], [26, 9340]],
  },
  'rv-documental': {
    url: 'https://redvaeru.netlify.app/', seconds: 16, settle: 6000, prescroll: true,
    plan: [[0, 9340], [2.5, 9340], [5, 10184], [7.5, 10184], [12, 11600], [14, 12814], [16, 12814]],
  },
  'rv-estreno': {
    url: 'https://redvaeru.netlify.app/', seconds: 8, settle: 6000, prescroll: true,
    plan: [[0, 13826], [8, 13826]],
  },
  // Sitio nuevo servido en local (rama del rediseño), con «Revisión gratis» antes de su publicación.
  'sv-trailer': {
    url: 'http://localhost:4173/servicios/', seconds: 9, settle: 4000, prescroll: true,
    plan: [[0, 5100], [2, 5189], [9, 5189]],
  },
  'sv-rodaje': {
    url: 'http://localhost:4173/servicios/', seconds: 11, settle: 4000, prescroll: true,
    plan: [[0, 7662], [1.5, 7662], [10, 8240], [11, 8240]],
  },
  // Serie Seguidores, video 4: la calculadora de comisiones del sitio nuevo, llenándose en vivo.
  'sv-calc': {
    url: 'http://localhost:4173/servicios/', seconds: 17, settle: 4000, prescroll: true,
    // Los precios de los planes aún no están confirmados: el video muestra solo comisiones y ahorro.
    css: '#calculadora .calc__rows > div:nth-child(2), #calculadora .calc__pay, #calculadora .calc__bars p:nth-child(2) { visibility: hidden }',
    // Tiempos al ritmo de la voz del video 4: tarifa, noches, comisión; después el total y el ahorro.
    plan: [[0, 2780], [1, 2780], [1.9, 3010], [12.8, 3010], [14.2, 3600], [17, 3600]],
    // Parte en blanco (tarifa vacía, controles al mínimo) y se llena en cámara.
    types: [{ sel: '#calculadora input[name=tarifa]', t: 0, dur: 2, text: '' }, { sel: '#calculadora input[name=tarifa]', t: 2.1, dur: 1, text: '60.000' }],
    sliders: [
      { sel: '#calculadora input[name=noches]', from: 1, to: 1, t0: 0, t1: 3.3 },
      { sel: '#calculadora input[name=pct]', from: 3, to: 3, t0: 0, t1: 4.7 },
      { sel: '#calculadora input[name=directo]', from: 5, to: 5, t0: 0, t1: 10.8 },
      { sel: '#calculadora input[name=noches]', from: 1, to: 20, t0: 3.4, t1: 4.6 },
      { sel: '#calculadora input[name=pct]', from: 3, to: 15, t0: 4.8, t1: 6.2 },
      { sel: '#calculadora input[name=directo]', from: 5, to: 30, t0: 10.9, t1: 12.3 },
    ],
  },
  // Serie Seguidores, video 5: «Su estreno» en la portada del sitio nuevo, al ritmo de la voz.
  'sv-estreno': {
    url: 'http://localhost:4173/', seconds: 19, settle: 4000, prescroll: true,
    plan: [[0, 13826], [2, 13826], [3, 14060], [15, 14060], [16, 14700], [19, 14700]],
    types: [
      { sel: '#estreno input[name=nombre]', t: 3.9, dur: 1.5, text: 'Cabañas Pewen Azul' },
      { sel: '#estreno input[name=lugar]', t: 5.6, dur: 0.5, text: 'Pucón' },
    ],
    actions: [{ t: 10.9, click: '[data-est-next]' }, { t: 11.55, click: '[data-est-next]' }, { t: 12.4, click: '[data-est-tour]' }],
  },
  'sv-revision': {
    url: 'http://localhost:4173/servicios/', seconds: 11, settle: 4000, prescroll: true,
    plan: [[0, 8540], [1.5, 8640], [11, 8640]],
    types: [
      { sel: '#revision input[name=enlace]', t: 2.5, dur: 2.6, text: '@cabanasdelbosque' },
      { sel: '#revision input[name=negocio]', t: 5.6, dur: 2.2, text: 'Cabañas del Bosque' },
    ],
  },
};

async function resolveY(page, target) {
  if (typeof target === 'number') return target;
  return page.evaluate((t) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (t === 'end') return max;
    const [sel, off = -24] = t.split('@');
    const el = document.querySelector(sel);
    if (!el) return 0;
    return Math.min(max, el.getBoundingClientRect().top + scrollY + Number(off));
  }, target);
}

async function capture(id, cfg, browser) {
  const ctx = await browser.newContext({
    viewport: VIEW, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    locale: 'es-CL', timezoneId: 'America/Santiago',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();
  await page.clock.install();
  await page.goto(cfg.url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.clock.runFor(cfg.settle || 3500);
  if (cfg.css) await page.addStyleTag({ content: cfg.css });
  await page.waitForTimeout(800);

  // Páginas que cargan contenido al bajar: se recorren antes de medir posiciones.
  if (cfg.prescroll) {
    for (let k = 0; k < 40; k++) { await page.evaluate((k) => window.scrollTo(0, k * 600), k); await page.clock.runFor(150); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.clock.runFor(800);
  }
  const keys = [];
  for (const [t, target] of cfg.plan) keys.push([t, await resolveY(page, target)]);
  const yAt = (t) => {
    for (let i = 1; i < keys.length; i++) {
      const [t0, y0] = keys[i - 1], [t1, y1] = keys[i];
      if (t <= t1) return y0 + (y1 - y0) * ease(t1 === t0 ? 1 : (t - t0) / (t1 - t0));
    }
    return keys[keys.length - 1][1];
  };

  const dir = join(TMP, id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const total = Math.round(cfg.seconds * FPS);
  const taps = [];
  for (let f = 0; f < total; f++) {
    const t = f / FPS;
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(yAt(t)));
    for (const a of cfg.actions || []) {
      if (t >= a.t && t < a.t + 1 / FPS) {
        // Registra dónde cae cada toque (px CSS de la pantalla), para dibujar el dedo en la edición.
        const r = await page.evaluate((sel) => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); el.click(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, a.click);
        taps.push({ t: a.t, sel: a.click, ...r });
      }
    }
    // Escritura en campos de texto, letra por letra (type: { sel, text, dur }).
    for (const a of cfg.types || []) {
      if (t < a.t || t > a.t + a.dur + 1 / FPS) continue;
      const n = Math.min(a.text.length, Math.ceil(((t - a.t) / a.dur) * a.text.length));
      await page.evaluate(({ sel, v }) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.focus({ preventScroll: true });
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, { sel: a.sel, v: a.text.slice(0, n) });
    }
    for (const s of cfg.sliders || []) {
      if (t < s.t0 || t > s.t1 + 1 / FPS) continue;
      const k = ease(Math.min(1, (t - s.t0) / (s.t1 - s.t0)));
      await page.evaluate(({ name, sel, v }) => {
        const el = document.querySelector(sel || `[data-ota] input[name="${name}"]`);
        if (!el) return;
        el.value = String(v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, { name: s.name, sel: s.sel, v: Math.round(s.from + (s.to - s.from) * k) });
    }
    await page.clock.runFor(1000 / FPS);
    await page.screenshot({ path: join(dir, String(f).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  }
  await ctx.close();

  mkdirSync(OUT, { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%04d.jpg'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', join(OUT, `${id}.mp4`)]);
  rmSync(dir, { recursive: true, force: true });
  if (taps.length) writeFileSync(join(OUT, `${id}.json`), JSON.stringify({ taps }, null, 1));
  console.log(`✓ ${id}.mp4 (${cfg.seconds} s)${taps.length ? ' · ' + JSON.stringify(taps) : ''}`);
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CLIPS);
const browser = await chromium.launch({
  executablePath: existsSync(CHROME) ? CHROME : undefined,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
});
for (const id of ids) {
  if (!CLIPS[id]) { console.error(`Clip desconocido: ${id}`); continue; }
  try { await capture(id, CLIPS[id], browser); } catch (e) { console.error(`✗ ${id}: ${e.message}`); }
}
await browser.close();

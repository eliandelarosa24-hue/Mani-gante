// Graba los sitios reales en vista de celular, cuadro por cuadro, para usarlos en los Reels.
// El reloj de la página se controla con page.clock: cada cuadro avanza exactamente 1/30 s,
// así las animaciones y el desplazamiento se ven fluidos aunque la captura sea más lenta.
// Uso: node capture-sites.mjs [id ...]   (sin argumentos graba todos)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
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
  'redvaeru-inicio': {
    url: 'https://redvaeru.netlify.app/', seconds: 10, settle: 6000,
    plan: [[0, 0], [3, 0], [10, 2200]],
  },
};

async function resolveY(page, target) {
  if (typeof target === 'number') return target;
  return page.evaluate((t) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (t === 'end') return max;
    const el = document.querySelector(t);
    if (!el) return 0;
    return Math.min(max, el.getBoundingClientRect().top + scrollY - 24);
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
  await page.waitForTimeout(800);

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
  for (let f = 0; f < total; f++) {
    const t = f / FPS;
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(yAt(t)));
    for (const s of cfg.sliders || []) {
      if (t < s.t0 || t > s.t1 + 1 / FPS) continue;
      const k = ease(Math.min(1, (t - s.t0) / (s.t1 - s.t0)));
      await page.evaluate(({ name, v }) => {
        const el = document.querySelector(`[data-ota] input[name="${name}"]`);
        if (!el) return;
        el.value = String(v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, { name: s.name, v: s.from + (s.to - s.from) * k });
    }
    await page.clock.runFor(1000 / FPS);
    await page.screenshot({ path: join(dir, String(f).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  }
  await ctx.close();

  mkdirSync(OUT, { recursive: true });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%04d.jpg'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', join(OUT, `${id}.mp4`)]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`✓ ${id}.mp4 (${cfg.seconds} s)`);
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

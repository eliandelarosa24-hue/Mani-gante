// "El lago hoy": puesta de sol calculada para la orilla norte del Villarrica, hora dorada,
// temperatura del agua según el mes y un viento simulado de forma estable para cada día.
const LAT = -39.25, LNG = -72.12, TZ = 'America/Santiago';
const WATER = [21, 22, 19, 15, 12, 10, 9, 9, 10, 12, 15, 18];
const rad = Math.PI / 180;

export function santiagoParts(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(d).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour, min: +p.minute };
}
export const hhmm = (date) => new Intl.DateTimeFormat('es-CL', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);

// Ecuación de la salida y puesta del sol (algoritmo de Meeus simplificado)
export function sunset(p) { return sunTimes(p).set; }
export function sunTimes({ y, m, d }) {
  const J = Date.UTC(y, m, d, 12) / 864e5 + 2440587.5;
  const n = Math.round(J - 2451545 + 0.0008);
  const Js = n - LNG / 360;
  const M = (357.5291 + 0.98560028 * Js) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const L = (M + C + 282.9372) % 360;
  const Jt = 2451545 + Js + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.44 * rad));
  const cw = (Math.sin(-0.833 * rad) - Math.sin(LAT * rad) * Math.sin(dec)) / (Math.cos(LAT * rad) * Math.cos(dec));
  const w = Math.acos(Math.max(-1, Math.min(1, cw))) / rad;
  const at = (j) => new Date((j - 2440587.5) * 864e5);
  return { rise: at(Jt - w / 360), set: at(Jt + w / 360) };
}
export const hourOf = (date) => { const s = santiagoParts(date); return s.h + s.min / 60; };

export function initLake(hash) {
  const now = new Date(), p = santiagoParts(now);
  const { rise, set } = sunTimes(p), golden = new Date(set - 60 * 60e3);
  const key = `${p.y}-${p.m}-${p.d}`;
  const wind = Math.round(4 + hash('viento' + key) * 18);
  const dir = ['N', 'NO', 'O', 'SO', 'S'][Math.floor(hash('dir' + key) * 5)];
  const q = (s) => document.querySelector(s);
  q('[data-t-sunset]').textContent = hhmm(set);
  q('[data-t-sunrise]').textContent = hhmm(rise);
  q('[data-t-now]').textContent = hhmm(now);
  q('[data-t-golden]').textContent = hhmm(golden);
  q('[data-t-water]').textContent = `${WATER[p.m]} °C`;
  q('[data-t-wind]').textContent = `${wind} km/h ${dir}`;
  const mins = p.h * 60 + p.min, setMin = (() => { const s = santiagoParts(set); return s.h * 60 + s.min; })();
  let k;
  if (mins > setMin + 30 || p.h < 6) k = 'Ya oscureció: buena noche para la tinaja y mirar estrellas desde el muelle.';
  else if (mins > setMin - 75) k = `Se viene la hora dorada: desde el muelle norte, a partir de las ${hhmm(golden)}.`;
  else if (wind < 10) k = 'Lago quieto: buen día para el kayak, sobre todo antes del mediodía.';
  else if (wind < 16) k = 'Brisa suave: conviene remar cerca de la orilla y volver antes de las 16:00.';
  else k = `Viento ${dir === 'N' || dir === 'NO' ? 'del norte' : 'fuerte'}: hoy es día de quincho, libro y tinaja.`;
  q('[data-t-kayak]').textContent = k;
  return { sunrise: hourOf(rise), sunset: hourOf(set), setTxt: hhmm(set), riseTxt: hhmm(rise) };
}

// Fechas tributarias de Chile. Todo se trabaja en "días UTC" (medianoche UTC del día local en Chile).
import { HOLIDAYS, MONTHS } from './data.js';

export const DAY = 864e5;
const HOL = new Set(HOLIDAYS);
export const keyOf = (t) => new Date(t).toISOString().slice(0, 10);
export const dow = (t) => (new Date(t).getUTCDay() + 6) % 7; // 0 = lunes
export const isHoliday = (t) => HOL.has(keyOf(t));
export const isBusiness = (t) => dow(t) < 5 && !isHoliday(t);
export const nextBusiness = (t) => { while (!isBusiness(t)) t += DAY; return t; };
export const utc = (y, m, d) => Date.UTC(y, m, d);

const WD = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
export const weekday = (t) => WD[dow(t)];
export const fmtDay = (t) => `${weekday(t)} ${new Date(t).getUTCDate()} de ${MONTHS[new Date(t).getUTCMonth()]}`;
export const monthName = (m) => MONTHS[(m + 12) % 12];

// Hoy en Chile continental
export function todayCL() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date()).map((x) => [x.type, +x.value]));
  return utc(p.year, p.month - 1, p.day);
}

// Vencimientos de un mes (y, m con m de 0 a 11)
export function eventsOf(y, m) {
  const prev = monthName(m - 1);
  const ev = [
    { t: nextBusiness(utc(y, m, 12)), k: 'iva2', s: 'F29 papel', l: `F29 en papel o sin facturación electrónica (IVA de ${prev})` },
    { t: nextBusiness(utc(y, m, 13)), k: 'prev', s: 'Previred', l: `Cotizaciones previsionales de ${prev} (pago electrónico)` },
    { t: nextBusiness(utc(y, m, 20)), k: 'iva', s: 'IVA · F29', l: `IVA y retenciones de ${prev} (F29 con facturación electrónica)` },
  ];
  if (m === 0) ev.push({ t: nextBusiness(utc(y, 0, 31)), k: 'year', s: 'Patente', l: 'Patente municipal, primera cuota' });
  if (m === 3) ev.push({ t: utc(y, 3, 1), k: 'year', s: 'Abre Renta', l: 'Comienza la Operación Renta (F22)' }, { t: utc(y, 3, 30), k: 'year', s: 'Cierra Renta', l: 'Último día de la Operación Renta' });
  if (m === 6) ev.push({ t: nextBusiness(utc(y, 6, 31)), k: 'year', s: 'Patente', l: 'Patente municipal, segunda cuota' });
  if (m === 11) ev.push({ t: utc(y, 11, 31), k: 'year', s: 'Inventario', l: 'Cierre del ejercicio e inventario' });
  // Un vencimiento corrido puede caer en el mes siguiente; aquí solo interesa el mes pedido
  return ev.filter((e) => new Date(e.t).getUTCMonth() === m).sort((a, b) => a.t - b.t);
}

export function upcoming(from, n = 5) {
  const d = new Date(from), out = [];
  for (let i = -1; i < 4; i++) {
    const y = d.getUTCFullYear() + Math.floor((d.getUTCMonth() + i) / 12), m = (d.getUTCMonth() + i + 12) % 12;
    out.push(...eventsOf(y, m));
  }
  return out.filter((e) => e.t >= from).sort((a, b) => a.t - b.t).slice(0, n);
}

// Próximo F29 electrónico desde una fecha
export function nextF29(from) {
  return upcoming(from, 12).find((e) => e.k === 'iva');
}

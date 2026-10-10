// Post-reserva: archivo de calendario (.ics), enlace a Google Calendar y ticket como imagen PNG.
import { BUSINESS, formatCLP } from "./catalog.mjs";

const pad = (n) => String(n).padStart(2, "0");
// Hora de Chile → UTC aproximando con el desfase actual de America/Santiago para esa fecha.
function toUtcStamp(date, time, addMin = 0) {
  const [y, m, d] = date.split("-").map(Number), [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const tzName = new Intl.DateTimeFormat("en-US", { timeZone: BUSINESS.timezone, timeZoneName: "shortOffset" }).formatToParts(new Date(guess)).find((p) => p.type === "timeZoneName")?.value || "GMT-3";
  const off = Number((tzName.match(/GMT([+-]\d+)/) || [0, -3])[1]);
  const utc = new Date(guess - off * 3600000 + addMin * 60000);
  return `${utc.getUTCFullYear()}${pad(utc.getUTCMonth() + 1)}${pad(utc.getUTCDate())}T${pad(utc.getUTCHours())}${pad(utc.getUTCMinutes())}00Z`;
}

const summary = (r) => `MANI-GANTE · Reserva ${r.code}`;
const details = (r) => `${(r.lines || []).map((l) => `${l.name} x${l.qty}`).join(", ")} · Total ${formatCLP(r.total)}. Punto: ${r.meetingPoint}, INACAP Temuco. WhatsApp: +${BUSINESS.whatsapp}`;

export function icsFile(r) {
  const esc = (s) => String(s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MANI-GANTE//Reservas//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${r.code}-${r.date}@manigante`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "")}`,
    `DTSTART:${toUtcStamp(r.date, r.time)}`, `DTEND:${toUtcStamp(r.date, r.time, 30)}`,
    `SUMMARY:${esc(summary(r))}`, `DESCRIPTION:${esc(details(r))}`, `LOCATION:${esc(`${r.meetingPoint} · INACAP Temuco`)}`,
    "BEGIN:VALARM", "TRIGGER:-PT30M", "ACTION:DISPLAY", `DESCRIPTION:${esc("Tu maní te espera en 30 minutos")}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
}

export function googleCalendarUrl(r) {
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action", "TEMPLATE");
  u.searchParams.set("text", summary(r));
  u.searchParams.set("dates", `${toUtcStamp(r.date, r.time)}/${toUtcStamp(r.date, r.time, 30)}`);
  u.searchParams.set("details", details(r));
  u.searchParams.set("location", `${r.meetingPoint} · INACAP Temuco`);
  return u.toString();
}

/** Dibuja el ticket en un canvas y lo descarga como PNG (para mostrarlo en el celular al retirar). */
export async function downloadTicketPng(r) {
  await document.fonts?.ready;
  const W = 720, H = 1080, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#0D0B09"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#F7F1E6"; g.beginPath(); g.roundRect(40, 40, W - 80, H - 80, 6); g.fill();
  g.fillStyle = "#0D0B09"; g.beginPath(); g.arc(40, 760, 22, 0, Math.PI * 2); g.arc(W - 40, 760, 22, 0, Math.PI * 2); g.fill();
  g.setLineDash([10, 8]); g.strokeStyle = "rgba(42,30,20,.3)"; g.lineWidth = 2; g.beginPath(); g.moveTo(70, 760); g.lineTo(W - 70, 760); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#2A1E14"; g.font = "600 36px 'Bodoni Moda', Georgia, serif"; g.fillText("MANI-GANTE", 90, 130);
  g.fillStyle = "#6E5220"; g.font = "800 18px 'Instrument Sans', sans-serif"; g.fillText("INVITACIÓN · CITA CON EL JEFE · INACAP TEMUCO", 90, 168);
  g.fillStyle = "#7A1E31"; g.font = "800 96px 'Big Shoulders', 'Arial Narrow', sans-serif"; g.fillText(r.code, 90, 300);
  g.fillStyle = "#2A1E14"; g.font = "700 30px 'Instrument Sans', sans-serif";
  g.fillText(`${r.dateLabel || r.date} · ${r.time}`, 90, 380);
  g.font = "500 26px 'Instrument Sans', sans-serif"; g.fillText(`Punto: ${r.meetingPoint}`, 90, 426); g.fillText(`A nombre de: ${r.name}`, 90, 468);
  let y = 540; g.font = "500 24px 'Instrument Sans', sans-serif";
  for (const l of (r.lines || []).slice(0, 6)) { g.fillText(`${l.name} × ${l.qty}`, 90, y); y += 36; }
  g.font = "800 70px 'Big Shoulders', 'Arial Narrow', sans-serif"; g.fillText(formatCLP(r.total), 90, 870);
  g.fillStyle = "#6F5D4B"; g.font = "600 22px 'Instrument Sans', sans-serif"; g.fillText(`${r.bags} bolsas · muestra este ticket al retirar`, 90, 914);
  g.fillStyle = "#7A1E31"; g.font = "400 46px 'Pinyon Script', cursive"; g.fillText("Para gente elegante y gánster · Jorge", 90, 990);
  const a = document.createElement("a");
  a.download = `ticket-${r.code}.png`; a.href = c.toDataURL("image/png"); a.click();
}

// Puente físico-digital (v4.5): genera una hoja imprimible con un QR por sabor.
// Cada QR abre https://manigante.netlify.app/sabor/<id>?qr=1 (su ficha, tip de la casa y "va bien con").
// Uso: node scripts/qr.mjs  →  design/qr/etiquetas-qr.html (imprimir en A4, recortar y pegar en cada bolsa)
import { writeFileSync, mkdirSync } from "node:fs";
import QRCode from "qrcode";
import { FLAVORS, JAPANESE, BUSINESS } from "../js/catalog.mjs";

const base = BUSINESS.url.replace(/\/$/, "");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const cards = [];
for (const f of [...FLAVORS, ...JAPANESE]) {
  const url = `${base}/sabor/${f.id}?qr=1`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#17120e", light: "#00000000" } });
  cards.push(`<figure class="tag"><div class="qr">${svg}</div><figcaption><b>Ficha ${esc(f.no)}</b><strong>${esc(f.name.replace("Maní Japonés ", "Japonés "))}</strong>${f.alias ? `<em>«${esc(f.alias)}»</em>` : ""}<small>Escanéame: tip de la casa</small></figcaption></figure>`);
}
mkdirSync("design/qr", { recursive: true });
writeFileSync("design/qr/etiquetas-qr.html", `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Etiquetas QR · MANI-GANTE</title>
<link rel="stylesheet" href="../../css/fonts.css">
<style>
  @page { size: A4; margin: 10mm; }
  body { margin: 0; font-family: "Instrument Sans", system-ui, sans-serif; color: #17120e; background: #fff; }
  h1 { font-family: "Bodoni Moda", serif; font-weight: 500; font-size: 18pt; margin: 0 0 4mm; }
  p.note { font-size: 9pt; color: #4e4337; margin: 0 0 6mm; }
  .sheet { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; }
  .tag { margin: 0; border: .3mm dashed #b9a98a; padding: 3mm; display: grid; grid-template-columns: 22mm 1fr; gap: 3mm; align-items: center; break-inside: avoid; }
  .qr svg { width: 22mm; height: 22mm; display: block; }
  figcaption { display: grid; gap: .6mm; line-height: 1.15; }
  figcaption b { font-family: "Big Shoulders", sans-serif; font-weight: 800; font-size: 7pt; letter-spacing: .18em; color: #6e5220; }
  figcaption strong { font-family: "Bodoni Moda", serif; font-weight: 600; font-size: 9.5pt; }
  figcaption em { font-family: "Bodoni Moda", serif; font-size: 8pt; color: #6e1a2c; }
  figcaption small { font-size: 6.5pt; color: #4e4337; }
</style></head><body>
<h1>MANI-GANTE · Etiquetas QR por sabor</h1>
<p class="note">Imprime en A4, recorta por la línea punteada y pega cada etiqueta en su bolsa. El QR abre la ficha del sabor con su tip de la casa (${base}/sabor/…?qr=1).</p>
<div class="sheet">${cards.join("\n")}</div>
</body></html>`);
console.log(`QR listos: ${cards.length} etiquetas → design/qr/etiquetas-qr.html`);

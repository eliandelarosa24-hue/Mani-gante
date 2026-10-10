// ============================================================
// Ilustraciones SVG generativas de MANI-GANTE
// - peanuts(): racimo de maní confitado teñido por sabor
// - bag(): bolsa doypack kraft o bolsa celofán con ventana, como el empaque real
// ============================================================

import { LABEL_DATA_URI } from "./label-data.mjs";

let uid = 0;
// En el navegador resuelve relativo al módulo; en el servidor (Netlify Function) usa la ruta pública.
// La etiqueta real de las bolsas (logo oficial "Para gente elegante y gánster").
const LOGO = import.meta.url.startsWith("http") ? new URL("../assets/img/label.png", import.meta.url).href : "/assets/img/label.png";
const next = (p) => `${p}${++uid}`;

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

// Un maní confitado: dos lóbulos irregulares con "costra" de azúcar.
function nut(x, y, s, r, fill, dark) {
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <path d="M-13 0c0-7 5-11 9-9 2 1 3 1 5 0 4-2 12 1 12 9s-8 11-12 9c-2-1-3-1-5 0-4 2-9-2-9-9Z" fill="${fill}"/>
    <circle cx="-7" cy="-3" r="1.2" fill="${dark}" opacity=".35"/><circle cx="6" cy="2" r="1.1" fill="${dark}" opacity=".35"/>
    <circle cx="2" cy="5" r=".9" fill="${dark}" opacity=".3"/>
    <circle cx="0" cy="-4" r="1" fill="#fff" opacity=".5"/><circle cx="-4" cy="4" r=".8" fill="#fff" opacity=".35"/>
    <ellipse cx="-5" cy="-4" rx="4" ry="1.6" fill="#fff" opacity=".35"/>
  </g>`;
}

const CLUSTER = [[50, 58, 1, -18], [30, 48, .82, 24], [70, 46, .86, -40], [38, 72, .78, 60], [64, 72, .8, -8], [52, 36, .7, 12]];

export function peanuts(color, cls = "swatch") {
  const id = next("pg");
  const nuts = CLUSTER.map(([x, y, s, r]) => nut(x, y, s, r, `url(#${id})`, shade(color, -60))).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs><radialGradient id="${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${shade(color, 70)}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, -55)}"/></radialGradient></defs>
    <ellipse cx="50" cy="88" rx="32" ry="5" fill="#000" opacity=".12"/>${nuts}</svg>`;
}

// Relleno de maní para la ventana de la bolsa (determinístico por color).
function fill(color, x0, y0, w, h, gradId) {
  let seed = parseInt(color.slice(1), 16) % 997;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const dark = shade(color, -60);
  let out = "";
  for (let y = y0 + 4; y < y0 + h + 8; y += 11) {
    for (let x = x0 - 4 + (Math.floor(y) % 2) * 7; x < x0 + w + 8; x += 15) {
      out += nut(x + rnd() * 5, y + rnd() * 4, .48 + rnd() * .14, rnd() * 180, `url(#${gradId})`, dark);
    }
  }
  return out;
}

/**
 * Bolsa ilustrada.
 * format: "doypack" (kraft con ventana y zipper) | "celofan" (transparente con amarra dorada)
 * num: número de ficha que se graba en la anilla (ej. "07")
 */
export function bag(color, format = "doypack", { label = "", cls = "bag", num = "", logo = LOGO } = {}) {
  const g = next("bg"), clip = next("cl"), kraft = next("kr"), stick = next("st"), noise = next("nz"), light = next("lt"), shadeId = next("sh");
  const lightGrad = `<radialGradient id="${light}"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  const nutGrad = `<radialGradient id="${g}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${shade(color, 70)}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, -55)}"/></radialGradient>`;
  // Anilla de habano (herencia dominicana): banda dorada grabada con medallón de terciopelo y el elefante.
  const band = (y, h, x0, x1, cx, r) => {
    const gold = next("ag"), wave = next("aw");
    const cy = y + h / 2;
    return `
    <g>
      <defs>
        <linearGradient id="${gold}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4e2ae"/><stop offset=".42" stop-color="#cfa257"/><stop offset=".58" stop-color="#a97b2e"/><stop offset="1" stop-color="#e9cb8a"/></linearGradient>
        <pattern id="${wave}" width="6" height="${h}" patternUnits="userSpaceOnUse"><path d="M0 ${h / 2} q1.5 -3 3 0 t3 0" fill="none" stroke="#fff6dc" stroke-width=".45" opacity=".55"/></pattern>
      </defs>
      <rect x="${x0}" y="${y + 1.2}" width="${x1 - x0}" height="${h}" fill="#000" opacity=".22"/>
      <rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="url(#${gold})"/>
      <rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="url(#${wave})"/>
      <path d="M${x0} ${y + 2.4} H${x1} M${x0} ${y + h - 2.4} H${x1}" stroke="#6e1a2c" stroke-width="1.1"/>
      <path d="M${x0} ${y + .6} H${x1} M${x0} ${y + h - .6} H${x1}" stroke="#fff3cf" stroke-width=".5" opacity=".7"/>
      ${num ? `<text x="${x0 + 4}" y="${cy + 2.2}" font-family="'Big Shoulders', 'Arial Narrow', sans-serif" font-weight="800" font-size="6.2" letter-spacing=".6" fill="#4a0f1c">Nº ${num}</text>
      <text x="${x1 - 4}" y="${cy + 2.2}" text-anchor="end" font-family="'Big Shoulders', 'Arial Narrow', sans-serif" font-weight="800" font-size="6.2" letter-spacing=".6" fill="#4a0f1c">M·G</text>` : ""}
      <circle cx="${cx}" cy="${cy + 1.2}" r="${r + 2.4}" fill="#000" opacity=".28"/>
      <circle cx="${cx}" cy="${cy}" r="${r + 1.8}" fill="url(#${gold})"/>
      <image href="${logo}" x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" preserveAspectRatio="xMidYMid meet"/>
      <ellipse cx="${cx - r * .35}" cy="${cy - r * .45}" rx="${r * .45}" ry="${r * .2}" fill="#fff" opacity=".18" transform="rotate(-25 ${cx - r * .35} ${cy - r * .45})"/>
    </g>`;
  };

  if (format === "celofan") {
    const body = "M22 44 Q20 40 26 38 L94 38 Q100 40 98 44 L103 136 Q103 144 95 144 L25 144 Q17 144 17 136 Z";
    return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 120 160" ${label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`} focusable="false">
      <defs>${nutGrad}${lightGrad}<clipPath id="${clip}"><path d="${body}"/></clipPath>
        <linearGradient id="${kraft}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".25" stop-color="#fff" stop-opacity=".05"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".92" stop-color="#fff" stop-opacity=".35"/></linearGradient></defs>
      <ellipse cx="60" cy="151" rx="46" ry="6" fill="#000" opacity=".08"/><ellipse cx="60" cy="149" rx="36" ry="3.5" fill="#000" opacity=".16"/>
      <g clip-path="url(#${clip})"><rect x="0" y="30" width="120" height="120" fill="${shade(color, 40)}" opacity=".35"/>${fill(color, 14, 52, 92, 92, g)}</g>
      <path d="${body}" fill="url(#${kraft})" stroke="rgba(255,255,255,.7)" stroke-width="1.2"/>
      <path d="M26 38 L40 14 Q60 6 80 14 L94 38 Z" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.7)" stroke-width="1"/>
      <path d="M40 14 Q60 22 80 14" fill="none" stroke="rgba(255,255,255,.6)" stroke-width=".8"/>
      <rect x="44" y="33" width="32" height="7" rx="3.5" fill="#c8963e"/><rect x="44" y="33" width="32" height="2.5" rx="1.2" fill="#e8c27a"/>
      ${band(66, 22, 19.5, 100.5, 60, 21)}
      <path d="M30 50 Q28 95 32 132" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45" fill="none"/>
      <path d="M88 52 Q92 80 89 118" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".3" fill="none"/>
      <g stroke="#fff" stroke-width=".7" fill="none" opacity=".45"><path d="M24 104 l9 -4 l7 5"/><path d="M78 124 l8 -5 l9 3"/><path d="M70 50 l6 4 l7 -3"/><path d="M36 128 l6 4"/></g>
      <ellipse cx="44" cy="58" rx="5" ry="11" fill="url(#${light})" transform="rotate(-12 44 58)"/>
      <path d="M17 136 Q17 144 25 144 L95 144 Q103 144 103 136" stroke="rgba(0,0,0,.18)" stroke-width="1.4" fill="none"/>
    </svg>`;
  }

  const body = "M18 30 Q18 22 26 22 L94 22 Q102 22 102 30 L104 138 Q104 146 96 146 L24 146 Q16 146 16 138 Z";
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="0 0 120 160" ${label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`} focusable="false">
    <defs>${nutGrad}${lightGrad}
      <linearGradient id="${shadeId}" x1="0" x2="1"><stop offset="0" stop-color="#3a2410" stop-opacity=".28"/><stop offset=".22" stop-color="#3a2410" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#3a2410" stop-opacity=".22"/></linearGradient>
      <linearGradient id="${kraft}" x1="0" x2="1"><stop offset="0" stop-color="#b98d58"/><stop offset=".18" stop-color="#d9b886"/><stop offset=".55" stop-color="#cfa872"/><stop offset=".85" stop-color="#c39762"/><stop offset="1" stop-color="#a87c4a"/></linearGradient>
      <filter id="${noise}" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .24  0 0 0 0 .12  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <clipPath id="${clip}"><rect x="30" y="84" width="60" height="44" rx="6"/></clipPath></defs>
    <ellipse cx="60" cy="153" rx="50" ry="6" fill="#000" opacity=".08"/><ellipse cx="60" cy="151" rx="40" ry="3.5" fill="#000" opacity=".18"/>
    <path d="${body}" fill="url(#${kraft})"/>
    <path d="${body}" filter="url(#${noise})"/>
    <path d="M16 136 Q60 128 104 136" fill="none" stroke="#8c6a3e" stroke-width=".8" opacity=".5"/>
    <rect x="18" y="22" width="84" height="10" fill="#b48a55" opacity=".55"/>
    <path d="M18 38 H102" stroke="#8c6a3e" stroke-width="1.1" stroke-dasharray="2.2 1.6" opacity=".55"/>
    <circle cx="26" cy="27" r="1.6" fill="#8c6a3e" opacity=".5"/>
    <g clip-path="url(#${clip})"><rect x="30" y="84" width="60" height="44" fill="${shade(color, 30)}" opacity=".5"/>${fill(color, 30, 84, 60, 44, g)}<rect x="30" y="84" width="60" height="44" fill="#fff" opacity=".12"/></g>
    <rect x="30" y="84" width="60" height="44" rx="6" fill="none" stroke="#8c6a3e" stroke-width="1" opacity=".45"/>
    <path d="M34 88 L46 88" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>
    ${band(47, 24, 16.5, 103.5, 60, 22)}
    <path d="M22 44 Q20 90 22 132" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".18" fill="none"/>
    <path d="${body}" fill="url(#${shadeId})"/>
    <path d="M18 132 Q60 150 102 132 L104 138 Q104 146 96 146 L24 146 Q16 146 16 138 Z" fill="#7a5530" opacity=".22"/>
    <path d="M102 26 l-4 2 l4 2" fill="none" stroke="#8c6a3e" stroke-width=".9" opacity=".6"/>
    <ellipse cx="40" cy="92" rx="4" ry="9" fill="url(#${light})" opacity=".55" transform="rotate(-20 40 92)"/>
    <path d="M28 26 Q60 20 92 26" stroke="#fff" stroke-width="1.4" opacity=".25" fill="none"/>
  </svg>`;
}

// Sello circular "Hecho a mano" con texto en curva.
export function stamp(text = "HECHO A MANO · LOTES PEQUEÑOS · TEMUCO · ", cls = "stamp") {
  const id = next("sp");
  return `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <defs><path id="${id}" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs>
    <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3"/>
    <text font-size="10" font-weight="800" fill="currentColor" font-family="'Big Shoulders', 'Arial Narrow', sans-serif" letter-spacing="1"><textPath href="#${id}" textLength="274" lengthAdjust="spacing">${text}</textPath></text>
    <g transform="translate(60 60) rotate(-20)" fill="currentColor"><path d="M-13 0c0-7 5-11 9-9 2 1 3 1 5 0 4-2 12 1 12 9s-8 11-12 9c-2-1-3-1-5 0-4 2-9-2-9-9Z"/></g>
  </svg>`;
}

// Roseta guilloché (grabado de billete): ondas sinusoidales entrelazadas por desfase, en currentColor.
export function guilloche({ cls = "guilloche", rings = 3, petals = 14, strands = 6, detail = 240 } = {}) {
  const paths = [];
  for (let k = 0; k < rings; k++) {
    const R = 84 - k * 24, a = 10 - k * 2, n = petals - k * 3;
    for (let j = 0; j < strands; j++) {
      const phase = (j / strands) * (Math.PI * 2 / n) * 2;
      let d = "";
      for (let i = 0; i <= detail; i++) {
        const t = (i / detail) * Math.PI * 2;
        const r = R + a * Math.sin(n * t + phase);
        d += `${i ? "L" : "M"}${(r * Math.cos(t)).toFixed(1)} ${(r * Math.sin(t)).toFixed(1)}`;
      }
      paths.push(`<path d="${d}Z"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width=".4">${paths.join("")}</g>
    <circle r="96" fill="none" stroke="currentColor" stroke-width=".6"/><circle r="99" fill="none" stroke="currentColor" stroke-width=".3"/></svg>`;
}

// Monograma de la casa: MG dentro de un medallón art déco con rayos de abanico.
export function monogram(cls = "monogram") {
  const rays = Array.from({ length: 36 }, (_, i) => {
    const t = (i / 36) * Math.PI * 2, r0 = 33, r1 = i % 2 ? 39 : 44;
    return `M${(r0 * Math.cos(t)).toFixed(2)} ${(r0 * Math.sin(t)).toFixed(2)}L${(r1 * Math.cos(t)).toFixed(2)} ${(r1 * Math.sin(t)).toFixed(2)}`;
  }).join("");
  return `<svg class="${cls}" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
    <path d="${rays}" stroke="currentColor" stroke-width=".8"/>
    <circle r="31" fill="none" stroke="currentColor" stroke-width="1.2"/><circle r="28" fill="none" stroke="currentColor" stroke-width=".5"/>
    <text y="9" text-anchor="middle" font-family="'Bodoni Moda', Didot, serif" font-size="27" font-style="italic" font-weight="500" fill="currentColor">MG</text>
  </svg>`;
}

// ------------------------------------------------------------
// Versiones <img> (rendimiento): cada ilustración se dibuja UNA vez como SVG, se guarda como blob y
// se reutiliza como imagen. Así la página no carga miles de nodos SVG (el scroll queda fluido).
// En el servidor (sin Blob/URL.createObjectURL) se devuelve el SVG en línea de siempre.
// ------------------------------------------------------------
const imgCache = new Map();
const canBlob = typeof Blob !== "undefined" && typeof URL !== "undefined" && typeof URL.createObjectURL === "function";
function asImg(key, make, cls, label) {
  if (!canBlob) return make();
  let url = imgCache.get(key);
  if (!url) { url = URL.createObjectURL(new Blob([make()], { type: "image/svg+xml" })); imgCache.set(key, url); }
  const a11y = label ? `alt="${label.replace(/"/g, "&quot;")}"` : `alt="" aria-hidden="true"`;
  return `<img class="${cls}" src="${url}" ${a11y} decoding="async" draggable="false">`;
}
export function bagImg(color, format = "doypack", { label = "", cls = "bag", num = "" } = {}) {
  return asImg(`bag|${color}|${format}|${num}`, () => bag(color, format, { cls, num, logo: LABEL_DATA_URI }), cls, label);
}
export function peanutsImg(color, cls = "swatch") {
  return asImg(`nut|${color}`, () => peanuts(color, cls), cls, "");
}
export function guillocheImg(color = "#d2ae6d", cls = "guilloche") {
  return asImg(`gui|${color}`, () => guilloche({ cls }).replace(/currentColor/g, color), cls, "");
}

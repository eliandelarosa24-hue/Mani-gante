// Genera css/tokens.css desde design/tokens.json (sin dependencias): `node design/build-tokens.mjs`
// primitive → semantic (tema Noche, por defecto) → light (variante Marfil en [data-theme="light"]).
import fs from "node:fs";
const root = new URL("..", import.meta.url);
const t = JSON.parse(fs.readFileSync(new URL("design/tokens.json", root), "utf8"));
const flat = (obj, prefix, out = []) => {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && "$value" in v) out.push([`${prefix}-${k}`, v.$value]);
    else if (v && typeof v === "object") flat(v, `${prefix}-${k}`, out);
  }
  return out;
};
const ref = (v) => String(v).replace(/\{([^}]+)\}/g, (_, p) => `var(--${p.replace(/\./g, "-")})`);
const block = (sel, rows, indent = "  ") => `${sel} {\n${rows.map(([k, v]) => `${indent}--${k}: ${ref(v)};`).join("\n")}\n}`;
const sem = [...flat(t.semantic.color, "color"), ...flat(t.semantic.elevation, "elevation")];
const light = [...flat(t.light.semantic.color, "color"), ...flat(t.light.semantic.elevation, "elevation")];
const css = `/* Casa Mani-Gante · Design tokens v4 — GENERADO por design/build-tokens.mjs desde design/tokens.json. No editar a mano. */
/* === PRIMITIVES === */
${block(":root", flat(t.primitive, "primitive"))}

/* === SEMANTIC · tema Noche (identidad de la marca, por defecto) === */
${block(":root", sem)}

/* === LIGHT · variante Marfil === */
${block(':root[data-theme="light"]', light)}
`;
fs.writeFileSync(new URL("css/tokens.css", root), css);
console.log(`tokens.css: ${flat(t.primitive, "p").length} primitivos, ${sem.length} semánticos, ${light.length} en Marfil`);

// Lista de imágenes de cada muestra (nombre de archivo, proporción y descripción para la IA).
// La usan scripts/gen-images.mjs (generación con Gemini u OpenAI) y la guía docs/imagenes-muestras.md.
const STYLE = 'Fotografía editorial de viajes de alta gama, luz natural, composición cinematográfica, colores realistas, sin texto, sin logos, sin marcas de agua.';

export function imageSlots(s) {
  const where = s.place;
  const base = (subject) => `${subject}. Lugar: ${where}. ${s.imageStyle || ''} ${STYLE}`.replace(/\s+/g, ' ').trim();
  const slots = [{ file: 'hero', ratio: '16:9', prompt: base(`${s.hero.alt}, imagen principal de ${s.name}, ${s.tagline.toLowerCase()}`) }];
  for (const b of s.blocks) {
    if (b.type === 'story') slots.push({ file: b.slot || 'historia', ratio: '4:5', prompt: base(b.alt || `Historia de ${s.name}`) });
    if (b.type === 'units') b.items.forEach((u, i) => slots.push({ file: `unidad-${i + 1}`, ratio: '4:3', prompt: base(`${u.name}: ${u.desc}`) }));
    if (b.type === 'tours') b.items.forEach((u, i) => slots.push({ file: `exp-${i + 1}`, ratio: '4:5', prompt: base(`${u.name}: ${u.desc}`) }));
    if (b.type === 'directory') b.items.forEach((u, i) => slots.push({ file: `dir-${i + 1}`, ratio: '16:9', prompt: base(`${u.kind} ${u.name}: ${u.desc}`) }));
    if (b.type === 'gallery') b.items.forEach(([, label, ratio], i) => slots.push({ file: `g${i + 1}`, ratio: ratio === '4/3' ? '4:3' : '4:5', prompt: base(label) }));
    if (b.type === 'cta') slots.push({ file: 'cierre', ratio: '16:9', prompt: base(`Ambiente de ${s.name} al atardecer, ${s.tagline.toLowerCase()}`) });
  }
  return slots;
}

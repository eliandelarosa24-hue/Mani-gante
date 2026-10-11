// "Arme su kuchen": masa, hasta dos frutas, cubierta y tamaño. El kuchen se dibuja en SVG
// mientras se arma (frutas, crema, streusel, merengue o enrejado y placa con mensaje).
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

export const FRUITS = {
  frambuesa: { name: 'Frambuesa', color: '#d23a55', light: '#f07a8e', months: [10, 11, 0, 1], kind: 'berry' },
  murta: { name: 'Murta', color: '#9a2f3e', light: '#c85a68', months: [2, 3, 4], kind: 'berry' },
  arandano: { name: 'Arándano', color: '#3d4482', light: '#6b74b8', months: [11, 0, 1, 2], kind: 'berry' },
  mora: { name: 'Mora', color: '#2c1f3a', light: '#5a4470', months: [0, 1, 2], kind: 'berry' },
  manzana: { name: 'Manzana', color: '#e6c06a', light: '#f6e2a6', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], kind: 'apple' },
  ciruela: { name: 'Ciruela', color: '#6d2a5c', light: '#e8b23c', months: [1, 2, 3], kind: 'plum' },
  ruibarbo: { name: 'Ruibarbo', color: '#d9607a', light: '#efa0b0', months: [9, 10, 11], kind: 'stick' },
};
const MASAS = [['murbe', 'Masa quebrada', 'Mürbeteig · crujiente', 0], ['hefe', 'Masa de levadura', 'Hefeteig · esponjosa', 0], ['sg', 'Sin gluten', 'Arroz y almendra · +$4.000', 4000]];
const CUBS = [['streusel', 'Streusel', 'Migas de mantequilla', 0], ['crema', 'Crema pastelera', 'Vanillepudding', 0], ['merengue', 'Merengue', 'Tostado al soplete · +$1.500', 1500], ['enrejado', 'Enrejado', 'Tiras de masa', 0], ['ninguna', 'Solo fruta', 'Brillo de mermelada', 0]];
const SIZES = [['20', '20 cm', '8 porciones', 18900, 118], ['26', '26 cm', '12 porciones', 24900, 150], ['bandeja', 'Bandeja', '24 porciones', 44900, 0]];

export function initBuilder({ onAdd }) {
  const form = $('[data-builder]'), svg = $('[data-kuchen]');
  if (!form) return;
  const month = new Date().getMonth();
  const st = { masa: 'murbe', fruta: ['frambuesa', 'murta'], cubierta: 'streusel', tamano: '26' };
  $('[data-opt="masa"]').innerHTML = MASAS.map(([id, n, s]) => `<button type="button" class="opt" data-k="masa" data-v="${id}">${n}<small>${s}</small></button>`).join('');
  $('[data-opt="fruta"]').innerHTML = Object.entries(FRUITS).map(([id, f]) => `<button type="button" class="opt" data-k="fruta" data-v="${id}"><span class="sw" style="background:radial-gradient(circle at 35% 35%, ${f.light}, ${f.color})"></span><span>${f.name}<span class="season${f.months.includes(month) ? '' : ' off'}">${f.months.includes(month) ? 'De temporada' : 'De nuestra despensa · +$1.000'}</span></span></button>`).join('');
  $('[data-opt="cubierta"]').innerHTML = CUBS.map(([id, n, s]) => `<button type="button" class="opt" data-k="cubierta" data-v="${id}">${n}<small>${s}</small></button>`).join('');
  $('[data-opt="tamano"]').innerHTML = SIZES.map(([id, n, s, p]) => `<button type="button" class="opt" data-k="tamano" data-v="${id}">${n} · ${clp(p)}<small>${s}</small></button>`).join('');
  const plaque = $('[data-plaque]'), plaqueText = $('[data-plaque-text]');

  // Generador pseudoaleatorio con semilla: el mismo kuchen se dibuja igual
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  function piece(fid, x, y, s, delay) {
    const f = FRUITS[fid], d = `style="animation-delay:${delay}ms"`;
    if (f.kind === 'berry') {
      const r = (fid === 'frambuesa' ? 9 : fid === 'mora' ? 9.5 : 7) * s;
      let dots = '';
      if (fid === 'frambuesa' || fid === 'mora') for (let k = 0; k < 5; k++) { const a = k * 1.256 + rnd(); dots += `<circle cx="${x + Math.cos(a) * r * 0.5}" cy="${y + Math.sin(a) * r * 0.5}" r="${r * 0.32}" fill="${f.light}" opacity=".55"/>`; }
      return `<g class="pc" ${d}><circle cx="${x}" cy="${y + 1.5}" r="${r}" fill="rgba(60,20,10,.25)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${f.color}"/>${dots}<circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.22}" fill="#fff" opacity=".55"/></g>`;
    }
    if (f.kind === 'plum') {
      const a = rnd() * 360;
      return `<g class="pc" ${d} transform="translate(${x} ${y}) rotate(${a})"><ellipse rx="${15 * s}" ry="${10 * s}" fill="${f.color}"/><ellipse rx="${11 * s}" ry="${6.5 * s}" fill="${f.light}"/></g>`;
    }
    if (f.kind === 'stick') {
      const a = rnd() * 180;
      return `<g class="pc" ${d} transform="translate(${x} ${y}) rotate(${a})"><rect x="${-14 * s}" y="${-4 * s}" width="${28 * s}" height="${8 * s}" rx="${3 * s}" fill="${f.color}"/><rect x="${-14 * s}" y="${-1.5 * s}" width="${28 * s}" height="${2.4 * s}" fill="${f.light}"/></g>`;
    }
    return '';
  }
  function appleRing(cx, cy, R, s, delay) {
    // Láminas de manzana en abanico, como en el kuchen de 1987
    let out = '';
    const n = Math.round(R / 7);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      out += `<g class="pc" style="animation-delay:${delay + i * 12}ms" transform="translate(${x} ${y}) rotate(${(a * 180) / Math.PI + 90})"><path d="M${-16 * s} 0 A${16 * s} ${16 * s} 0 0 1 ${16 * s} 0 Z" fill="#f3dea0" stroke="#c9963f" stroke-width="1.4"/><path d="M${-16 * s} 0 A${16 * s} ${16 * s} 0 0 1 ${16 * s} 0" fill="none" stroke="#c24a3a" stroke-width="2"/></g>`;
    }
    return out;
  }

  function draw() {
    seed = [...JSON.stringify(st)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7) || 7;
    const size = SIZES.find((x) => x[0] === st.tamano), tray = st.tamano === 'bandeja';
    const R = tray ? 0 : size[4], s = tray ? 1 : R / 150;
    const crust = st.masa === 'hefe' ? '#e7bd78' : st.masa === 'sg' ? '#d8b07a' : '#e2ac5e';
    let g = '<defs><radialGradient id="kcrust" cx=".5" cy=".45" r=".6"><stop offset=".8" stop-color="' + crust + '"/><stop offset="1" stop-color="#b27a35"/></radialGradient>'
      + '<radialGradient id="kmer" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fffdf6"/><stop offset=".7" stop-color="#f3e3c2"/><stop offset="1" stop-color="#c98c4a"/></radialGradient>'
      + (tray ? '<clipPath id="kclip"><rect x="40" y="80" width="320" height="240" rx="10"/></clipPath>' : `<clipPath id="kclip"><circle cx="200" cy="200" r="${R - 10 * s}"/></clipPath>`) + '</defs>';
    // Plato con borde azul de porcelana
    g += tray ? '<rect x="22" y="62" width="356" height="276" rx="18" fill="#c7ccd2"/><rect x="28" y="68" width="344" height="264" rx="14" fill="#dfe3e8"/>'
      : `<circle cx="200" cy="200" r="190" fill="#fff"/><circle cx="200" cy="200" r="182" fill="none" stroke="#2f5d9e" stroke-width="3" stroke-dasharray="2 9"/><circle cx="200" cy="200" r="174" fill="none" stroke="#2f5d9e" stroke-width="1.2"/>`;
    g += tray ? '<rect x="34" y="74" width="332" height="252" rx="12" fill="url(#kcrust)"/>' : `<circle cx="200" cy="200" r="${R}" fill="url(#kcrust)"/>`;
    // Crema bajo la fruta
    const fill = st.cubierta === 'crema' || st.cubierta === 'merengue' ? '#f6dc94' : st.masa === 'hefe' ? '#ecc888' : '#e9c07a';
    g += tray ? `<rect x="40" y="80" width="320" height="240" rx="10" fill="${fill}"/>` : `<circle cx="200" cy="200" r="${R - 10 * s}" fill="${fill}"/>`;
    // Fruta
    let fr = '', delay = 0;
    const fruits = st.fruta.length ? st.fruta : [];
    if (tray) {
      for (let y = 96; y < 310; y += 22) for (let x = 56; x < 350; x += 22) {
        const fid = fruits.length ? fruits[(Math.floor((x - 56) / 22) + Math.floor((y - 96) / 22)) % fruits.length] : null;
        if (!fid) continue;
        if (FRUITS[fid].kind === 'apple') fr += `<g class="pc" style="animation-delay:${delay}ms" transform="translate(${x} ${y}) rotate(${(x * 7) % 180})"><path d="M-11 0 A11 11 0 0 1 11 0Z" fill="#f3dea0" stroke="#c9963f"/></g>`;
        else fr += piece(fid, x + (rnd() - 0.5) * 6, y + (rnd() - 0.5) * 6, 0.9, delay);
        delay += 3;
      }
    } else {
      const rings = []; for (let rr = R - 26 * s; rr > 8; rr -= 22 * s) rings.push(rr);
      rings.forEach((rr, i) => {
        const fid = fruits.length ? fruits[i % fruits.length] : null;
        if (!fid) return;
        if (FRUITS[fid].kind === 'apple') { fr += appleRing(200, 200, rr, s, delay); delay += 60; return; }
        const n = Math.max(1, Math.round((2 * Math.PI * rr) / (21 * s)));
        for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + i * 0.3; fr += piece(fid, 200 + Math.cos(a) * rr + (rnd() - 0.5) * 3, 200 + Math.sin(a) * rr + (rnd() - 0.5) * 3, s, delay); delay += 6; }
      });
      if (fruits.length) fr += piece(fruits[0] === 'manzana' && fruits[1] ? fruits[1] : fruits[0], 200, 200, s, delay);
    }
    g += `<g clip-path="url(#kclip)">${fr}`;
    // Cubiertas
    if (st.cubierta === 'streusel') {
      let crumbs = '';
      const n = tray ? 340 : Math.round(240 * s * s);
      for (let i = 0; i < n; i++) {
        let x, y;
        if (tray) { x = 40 + rnd() * 320; y = 80 + rnd() * 240; } else { const a = rnd() * 6.283, d = Math.sqrt(rnd()) * (R - 12 * s); x = 200 + Math.cos(a) * d; y = 200 + Math.sin(a) * d; }
        const r = 2 + rnd() * 4;
        crumbs += `<path class="pc" style="animation-delay:${400 + i}ms" d="M${x - r} ${y} q${r * 0.4} ${-r} ${r} ${-r * 0.8} q${r} ${r * 0.2} ${r * 0.9} ${r} q${-r * 0.3} ${r} ${-r} ${r * 0.8}z" fill="${rnd() > 0.5 ? '#f0d08e' : '#d9a95e'}"/>`;
      }
      g += crumbs;
    }
    if (st.cubierta === 'enrejado') {
      let lat = '';
      for (let k = -8; k <= 8; k++) {
        const o = k * 34;
        lat += `<path class="pc" style="animation-delay:${400 + (k + 8) * 30}ms" d="M${200 + o - 260} ${200 - 260} L${200 + o + 260} ${200 + 260}" stroke="${crust}" stroke-width="13" stroke-linecap="round"/>`;
        lat += `<path class="pc" style="animation-delay:${700 + (k + 8) * 30}ms" d="M${200 + o + 260} ${200 - 260} L${200 + o - 260} ${200 + 260}" stroke="#d99e4f" stroke-width="13" stroke-linecap="round" opacity=".95"/>`;
      }
      g += lat;
    }
    if (st.cubierta === 'merengue') {
      let m = '';
      const pts = tray ? Array.from({ length: 40 }, (_, i) => [60 + (i % 8) * 40, 100 + Math.floor(i / 8) * 46]) : (() => { const a = []; for (let rr = R - 28 * s; rr > 10; rr -= 34 * s) { const n = Math.max(1, Math.round((2 * Math.PI * rr) / (32 * s))); for (let k = 0; k < n; k++) a.push([200 + Math.cos((k / n) * 6.283) * rr, 200 + Math.sin((k / n) * 6.283) * rr]); } a.push([200, 200]); return a; })();
      pts.forEach(([x, y], i) => { m += `<g class="pc" style="animation-delay:${400 + i * 14}ms"><circle cx="${x}" cy="${y}" r="${15 * s}" fill="url(#kmer)"/><path d="M${x - 5 * s} ${y + 2 * s} q${5 * s} ${-14 * s} ${9 * s} ${-3 * s}" stroke="#fff" stroke-width="2" fill="none"/></g>`; });
      g += m;
    }
    if (st.cubierta === 'ninguna') g += tray ? '<rect x="40" y="80" width="320" height="240" fill="rgba(255,255,255,.12)"/>' : `<circle cx="180" cy="170" r="${R * 0.7}" fill="rgba(255,255,255,.1)"/>`;
    g += '</g>';
    // Placa de chocolate
    if (plaque.checked) {
      const t = (plaqueText.value.trim() || 'Para usted').slice(0, 18);
      const w = Math.max(110, t.length * 11 + 40);
      g += `<g class="pc" style="animation-delay:200ms"><rect x="${200 - w / 2}" y="${tray ? 178 : 176}" width="${w}" height="46" rx="10" fill="#4a2b1d"/><rect x="${200 - w / 2 + 4}" y="${tray ? 182 : 180}" width="${w - 8}" height="38" rx="7" fill="none" stroke="#7a4b31"/><text x="200" y="${tray ? 208 : 206}" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="22" fill="#fbe6c2">${t.replace(/[<&>]/g, '')}</text></g>`;
    }
    svg.innerHTML = g;
    // Nombre y precio
    const fn = st.fruta.map((f) => FRUITS[f].name.toLowerCase());
    const cub = { streusel: 'con streusel', crema: 'con crema pastelera', merengue: 'con merengue', enrejado: 'enrejado', ninguna: '' }[st.cubierta];
    $('[data-k-name]').textContent = fn.length ? `Kuchen de ${fn.join(' y ')} ${cub}`.trim() : 'Elija al menos una fruta';
    $('[data-k-price]').textContent = clp(price());
    $('[data-k-add]').disabled = !fn.length;
  }
  function price() {
    const size = SIZES.find((x) => x[0] === st.tamano)[3];
    const masa = MASAS.find((x) => x[0] === st.masa)[3];
    const cub = CUBS.find((x) => x[0] === st.cubierta)[3];
    const off = st.fruta.filter((f) => !FRUITS[f].months.includes(month)).length * 1000;
    return size + masa + cub + off + (plaque.checked ? 2500 : 0);
  }
  function sync() {
    $$('.opt', form).forEach((b) => { const k = b.dataset.k, v = b.dataset.v; b.setAttribute('aria-pressed', String(k === 'fruta' ? st.fruta.includes(v) : st[k] === v)); });
    draw();
  }
  form.addEventListener('click', (e) => {
    const b = e.target.closest('.opt'); if (!b) return;
    const { k, v } = b.dataset;
    if (k === 'fruta') {
      if (st.fruta.includes(v)) st.fruta = st.fruta.filter((x) => x !== v);
      else st.fruta = [...st.fruta, v].slice(-2);
    } else st[k] = v;
    sync();
  });
  plaque.addEventListener('change', () => { plaqueText.hidden = !plaque.checked; if (plaque.checked) plaqueText.focus(); draw(); });
  plaqueText.addEventListener('input', draw);
  $('[data-k-add]').addEventListener('click', (e) => {
    const f = FRUITS[st.fruta[0]], f2 = FRUITS[st.fruta[1] || st.fruta[0]];
    onAdd({ id: 'k' + JSON.stringify(st) + plaqueText.value, name: $('[data-k-name]').textContent, sub: `${SIZES.find((x) => x[0] === st.tamano)[1]} · ${MASAS.find((x) => x[0] === st.masa)[1].toLowerCase()}${plaque.checked ? ` · placa «${plaqueText.value.trim() || 'Para usted'}»` : ''}`, price: price(), whole: true, thumb: `background:radial-gradient(circle at 40% 40%, ${f.light}, ${f.color} 55%, ${f2.color} 70%, #e2ac5e 72%)` }, e.currentTarget);
  });
  sync();
}

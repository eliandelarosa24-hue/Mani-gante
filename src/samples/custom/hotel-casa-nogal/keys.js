// El tablero de llaves de la recepción. Cada llave cuelga de su gancho y se balancea con un
// péndulo amortiguado: al pasar el cursor recibe un impulso según la velocidad del movimiento.
// Las llaves de habitaciones ocupadas esa noche no están: en su lugar hay una tarjeta.
export function initKeys({ hooksEl, rooms, cats, onPick }) {
  hooksEl.innerHTML = rooms.map((r) => {
    const c = cats[r.cat];
    return `<div class="hook" data-no="${r.no}" data-cat="${r.cat}">
      <span class="hook__plate"><b>${r.no}</b></span>
      <span class="hook__pin" aria-hidden="true"></span>
      <button type="button" class="hook__key" aria-label="Llave ${r.no}, habitación ${r.n}, ${c.n}">
        <svg class="hook__ring" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="11" /></svg>
        <svg class="hook__metal" viewBox="0 0 40 150" aria-hidden="true"><use href="#key" /></svg>
        <span class="hook__tag" style="--c:${c.color}"><b>${r.no}</b><small>${r.n}</small></span>
        <span class="hook__tassel" style="--c:${c.color}" aria-hidden="true"></span>
      </button>
      <span class="hook__out" aria-hidden="true">Ocupada<br />esta noche</span>
    </div>`;
  }).join('');
  const keys = [...hooksEl.querySelectorAll('.hook')].map((el) => ({ el, k: el.querySelector('.hook__key'), a: 0, v: 0 }));
  let raf = 0;
  const loop = () => {
    let moving = false;
    keys.forEach((o) => {
      o.v += -o.a * 0.035 - o.v * 0.045; o.a += o.v;
      if (Math.abs(o.a) > 0.02 || Math.abs(o.v) > 0.02) moving = true; else { o.a = 0; o.v = 0; }
      o.k.style.setProperty('--sw', `${o.a.toFixed(2)}deg`);
    });
    raf = moving ? requestAnimationFrame(loop) : 0;
  };
  const kick = (o, f) => { o.v += f; if (!raf) raf = requestAnimationFrame(loop); };
  let lx = null;
  hooksEl.addEventListener('pointermove', (e) => {
    const dx = lx == null ? 0 : e.clientX - lx; lx = e.clientX;
    const h = e.target.closest('.hook'); if (!h) return;
    const o = keys.find((q) => q.el === h);
    kick(o, Math.max(-3, Math.min(3, dx * 0.12)));
  });
  hooksEl.addEventListener('pointerleave', () => (lx = null));
  // Un leve balanceo inicial, como si alguien acabara de cerrar la puerta
  const breeze = () => keys.forEach((o, i) => setTimeout(() => kick(o, (Math.random() - 0.4) * 2.2), i * 60));
  hooksEl.addEventListener('click', (e) => {
    const h = e.target.closest('.hook'); if (!h || h.classList.contains('is-out')) return;
    keys.forEach((o) => o.el.classList.toggle('is-taken', o.el === h));
    onPick(+h.dataset.no);
  });
  return {
    breeze,
    setBusy(set) { keys.forEach((o) => o.el.classList.toggle('is-out', set.has(+o.el.dataset.no))); },
    filter(cat) { keys.forEach((o) => o.el.classList.toggle('is-dim', cat !== 'all' && o.el.dataset.cat !== cat)); },
    release() { keys.forEach((o) => o.el.classList.remove('is-taken')); },
  };
}

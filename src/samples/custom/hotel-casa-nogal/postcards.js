// Postales de Valdivia: una pila que se recorre arrastrando la de arriba (va al fondo de la pila)
// y que se da vuelta con un toque para leer el reverso, con sello y matasellos del día.
const DRAW = {
  fort: '<path d="M20 150 H280 M40 150 V96 H90 V80 H210 V96 H260 V150 M40 96 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 M210 96 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 M120 150 V118 q30 -22 60 0 V150 M60 128 l-34 -8 M240 128 l34 -8"/><circle cx="62" cy="128" r="6"/><circle cx="238" cy="128" r="6"/><path d="M0 168 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0" class="w"/>',
  swan: '<path d="M90 130 q-10 -40 30 -50 q40 -6 70 20 q22 22 50 18 q-20 22 -70 20 q-46 0 -80 -8 z"/><path d="M118 82 q-14 -30 4 -54 q14 -16 28 -2" class="neck"/><path d="M150 26 l14 6 l-14 4"/><path d="M0 150 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 M30 166 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0" class="w"/><path d="M40 150 v-60 M48 150 v-44 M250 150 v-56 M258 150 v-40" class="reed"/>',
  tower: '<path d="M110 150 V60 H190 V150 M100 60 H200 V46 H100 Z M100 46 v-10 h12 v10 m18 0 v-10 h12 v10 m18 0 v-10 h12 v10 m18 0 v-10 h12 v10 M138 150 V122 q12 -12 24 0 V150 M130 86 h10 v16 h-10 z M160 86 h10 v16 h-10 z"/><path d="M0 150 H300 M30 150 q10 -40 30 -50 q20 10 30 50 M220 150 q14 -50 34 -58 q22 12 30 58" class="tree"/>',
};

export function initPostcards({ stackEl, listEl, cards, photo, onOpen }) {
  const today = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Santiago' }).format(new Date()).replace(/\./g, '').toUpperCase();
  stackEl.innerHTML = cards.map((c, i) => `
    <article class="pc" data-pc="${c.id}" style="--i:${i}" tabindex="0" aria-label="Postal: ${c.t}">
      <div class="pc__in">
        <div class="pc__front">
          ${c.photo ? `<div class="pc__ph" style="${photo(c.photo)}"></div>` : `<svg class="pc__draw" viewBox="0 0 300 180" aria-hidden="true">${DRAW[c.draw]}</svg>`}
          <p class="pc__cap"><span>Valdivia</span><b>${c.t}</b></p>
        </div>
        <div class="pc__back">
          <div class="pc__msg"><p class="pc__hi">Saludos desde Valdivia,</p><p>${c.d}</p><p class="pc__far">${c.far}${c.price ? ` · ${c.price}` : ''}</p></div>
          <div class="pc__addr"><span class="pc__stamp"><svg viewBox="0 0 120 150" aria-hidden="true"><use href="#mono" /></svg><b>${c.stamp}</b></span><span class="pc__post">VALDIVIA<br />${today}</span><i></i><i></i><i></i></div>
        </div>
      </div>
    </article>`).join('');
  listEl.innerHTML = cards.map((c, i) => `<li><button type="button" data-go="${i}"><i>${String(i + 1).padStart(2, '0')}</i>${c.t}<span>${c.far}</span></button></li>`).join('');

  let order = cards.map((_, i) => i);
  const els = [...stackEl.querySelectorAll('.pc')];
  const layout = () => {
    order.forEach((idx, pos) => {
      const el = els[idx];
      el.style.zIndex = String(cards.length - pos);
      el.style.setProperty('--pos', pos);
      el.classList.toggle('is-top', pos === 0);
    });
    listEl.querySelectorAll('button').forEach((b) => b.classList.toggle('is-on', +b.dataset.go === order[0]));
  };
  layout();
  const next = (dir = 1) => {
    const top = els[order[0]];
    top.classList.remove('is-flip');
    top.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1), opacity .3s';
    top.style.transform = `translate(${dir * 120}%, -6%) rotate(${dir * 18}deg)`;
    setTimeout(() => {
      order.push(order.shift());
      top.style.transition = 'none'; top.style.transform = ''; void top.offsetWidth; top.style.transition = '';
      layout();
    }, 420);
  };
  let drag = null;
  stackEl.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.pc'); if (!el || !el.classList.contains('is-top')) return;
    drag = { el, x: e.clientX, y: e.clientY, dx: 0 }; el.setPointerCapture(e.pointerId); el.style.transition = 'none';
  });
  stackEl.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x; const dy = e.clientY - drag.y;
    drag.el.style.transform = `translate(${drag.dx}px, ${dy * 0.3}px) rotate(${drag.dx * 0.05}deg)`;
  });
  const end = () => {
    if (!drag) return;
    const { el, dx } = drag; drag = null; el.style.transition = '';
    if (Math.abs(dx) > 90) next(Math.sign(dx));
    else { el.style.transform = ''; if (Math.abs(dx) < 6) el.classList.toggle('is-flip'); }
  };
  stackEl.addEventListener('pointerup', end); stackEl.addEventListener('pointercancel', end);
  stackEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); els[order[0]].classList.toggle('is-flip'); }
    if (e.key === 'ArrowRight') next(1); if (e.key === 'ArrowLeft') next(-1);
  });
  listEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    const want = +b.dataset.go; if (order[0] === want) { els[want].classList.toggle('is-flip'); return; }
    els[order[0]].classList.remove('is-flip');
    order = [want, ...order.filter((i) => i !== want)]; layout();
    els[want].classList.add('is-flip');
  });
  void onOpen;
}

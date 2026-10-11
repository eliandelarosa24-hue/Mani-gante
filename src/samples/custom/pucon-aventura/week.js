// "Arme su semana en Pucón": se eligen tours y se arma el itinerario en el orden ideal
// según el pronóstico, con descuento por combinar (10% dos tours, 15% tres o más).
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

const ORDER = ['volcan', 'rafting-alto', 'huerquehue', 'canopy', 'rafting-bajo', 'termas'];
const INFO = {
  volcan: { name: 'Ascenso al volcán', price: 120000, time: '06:00', note: 'El día de mejor pronóstico' },
  'rafting-alto': { name: 'Rafting Trancura Alto', price: 38000, time: '14:00', note: 'Rápidos clase III–IV' },
  'rafting-bajo': { name: 'Rafting Trancura Bajo', price: 28000, time: '14:00', note: 'Para toda la familia' },
  canopy: { name: 'Canopy Caburgua', price: 32000, time: '10:00', note: 'Doce líneas sobre el bosque' },
  huerquehue: { name: 'Huerquehue y lagos', price: 45000, time: '08:30', note: 'Trekking entre araucarias' },
  termas: { name: 'Termas Geométricas', price: 42000, time: '19:00', note: 'Recuperación de noche' },
};

export function initWeek({ weather }) {
  const pick = $('[data-week-pick]');
  if (!pick) return;
  const imgOf = (id) => $(`.tcard[data-tour="${id}"] .tcard__img`)?.getAttribute('style') || '';
  pick.innerHTML = ORDER.map((id) => `<button type="button" class="wk" data-wk="${id}" aria-pressed="${id === 'volcan' || id === 'termas'}"><span class="wk__img" style="${imgOf(id)}"></span><span><b>${INFO[id].name}</b><small>${clp(INFO[id].price)} · ${INFO[id].note}</small></span><span class="wk__tick" aria-hidden="true">✓</span></button>`).join('');
  const dateIn = $('[data-week-date]'), peopleIn = $('[data-week-people]');
  const d0 = new Date(); d0.setHours(0, 0, 0, 0); d0.setDate(d0.getDate() + 7);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  dateIn.value = iso(d0); dateIn.min = iso(new Date());

  function plan() {
    const sel = ORDER.filter((id) => $(`[data-wk="${id}"]`).getAttribute('aria-pressed') === 'true');
    const start = new Date(dateIn.value + 'T12:00'), people = +peopleIn.value;
    const day = (i) => new Date(start.getTime() + i * 864e5);
    const slots = []; // { i, id }
    let volDay = -1;
    if (sel.includes('volcan')) {
      volDay = [0, 1, 2, 3, 4, 5].find((i) => weather(day(i)).state === 'ok') ?? 0;
      slots.push({ i: volDay, id: 'volcan' });
    }
    let next = 0;
    sel.filter((id) => id !== 'volcan' && id !== 'termas').forEach((id) => {
      while (next === volDay) next++;
      slots.push({ i: next++, id });
    });
    // Las termas van la noche del volcán (o al final si no hay volcán)
    if (sel.includes('termas')) slots.push({ i: volDay >= 0 ? volDay : next, id: 'termas' });
    slots.sort((a, b) => a.i - b.i || (a.id === 'termas') - (b.id === 'termas'));
    $('[data-week-days]').innerHTML = slots.length
      ? slots.map(({ i, id }) => { const d = day(i), w = weather(d); return `<li><span>${d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' })}</span><div><b>${INFO[id].name}</b><small>${INFO[id].time} · ${id === 'volcan' ? `pronóstico ${w.state === 'ok' ? 'bueno' : 'por confirmar'}, ${w.wind} km/h` : id === 'termas' && volDay >= 0 ? 'la misma noche del volcán' : INFO[id].note.charAt(0).toLowerCase() + INFO[id].note.slice(1)}</small></div><em>${clp(INFO[id].price)}</em></li>`; }).join('')
      : '<li class="empty">Elija al menos una aventura.</li>';
    const sub = sel.reduce((a, id) => a + INFO[id].price, 0) * people;
    const rate = sel.length >= 3 ? 0.15 : sel.length === 2 ? 0.1 : 0;
    $('[data-week-sub]').textContent = clp(sub);
    $('[data-week-dl]').textContent = rate ? `Descuento combo (${rate * 100}%)` : 'Descuento (desde 2 tours)';
    $('[data-week-disc]').textContent = rate ? `−${clp(sub * rate)}` : '$0';
    $('[data-week-total]').textContent = clp(sub * (1 - rate));
  }
  pick.addEventListener('click', (e) => {
    const b = e.target.closest('[data-wk]'); if (!b) return;
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    plan();
  });
  dateIn.addEventListener('change', plan); peopleIn.addEventListener('change', plan);
  plan();
}

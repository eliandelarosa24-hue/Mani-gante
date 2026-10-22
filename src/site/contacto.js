// Contacto: el formulario escribe en vivo el encabezado de la primera escena (INT./EXT. NEGOCIO EN LUGAR — TEMPORADA),
// llega a Netlify Forms y a Google Sheets, y WhatsApp sale con ese mismo contexto.
import './pages.css';
import { boot, reveal, $, $$ } from './core.js';
import { submitLead } from '../leads.js';
import { SCENES } from './scenes.js';

boot();
(document.fonts?.ready || Promise.resolve()).then(() => reveal());

const form = $('[data-script]'), slug = $('[data-slug]'), wa = $('[data-wa-intent]');
const INTERIOR = ['Restaurante', 'Café o pastelería', 'Hotel', 'Hostal'];
const paintSlug = () => {
  const neg = form.negocio.value, lugar = form.lugar.value.trim() || 'su lugar', temp = form.temporada.value;
  const scene = `${INTERIOR.includes(neg) ? 'INT.' : 'EXT.'} ${neg.toUpperCase()} EN ${lugar.toUpperCase()} — ${temp.toUpperCase()}`;
  slug.innerHTML = `<span>Escena 1.</span> ${scene.replace(/[<>&]/g, '')}`;
  form.escena.value = scene;
  if (wa) wa.href = `https://wa.me/56952289117?text=${encodeURIComponent(`Hola, vengo del sitio de Red Vaeru. Tengo ${neg.toLowerCase()} en ${lugar} y me interesa conversar.`)}`;
};
$$('[data-slug-part]', form).forEach((el) => el.addEventListener('input', paintSlug));

// Viene desde un caso ("Quiero algo así"): deja la obra anotada
const obra = new URLSearchParams(location.search).get('obra');
const ref = SCENES.find((s) => s.slug === obra);
if (ref) {
  form.obra.value = ref.name;
  form.mensaje.value = `Me gustó la muestra de ${ref.name} y quiero algo así para mi negocio. `;
}
paintSlug();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const btn = $('button[type=submit]', form);
  btn.disabled = true;
  const data = Object.fromEntries(new FormData(form));
  delete data['form-name'];
  if (await submitLead('contacto', data, 'formulario')) location.href = '/gracias';
  else { btn.disabled = false; HTMLFormElement.prototype.submit.call(form); } // respaldo: envío normal del navegador
});

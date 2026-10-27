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
const paintSlug = (touched = false) => {
  const neg = form.negocio.value, lugar = form.lugar.value.trim(), temp = form.temporada.value;
  const scene = `${INTERIOR.includes(neg) ? 'INT.' : 'EXT.'} ${neg.toUpperCase()} EN ${(lugar || 'su lugar').toUpperCase()} — ${temp.toUpperCase()}`;
  slug.innerHTML = `<span>Escena 1.</span> ${scene.replace(/[<>&]/g, '')}`;
  form.escena.value = scene;
  // WhatsApp lleva el contexto solo cuando el visitante ya eligió algo
  if (wa && touched) wa.href = `https://wa.me/56952289117?text=${encodeURIComponent(`Hola, vengo del sitio de Red Vaeru. Mi negocio: ${neg}${lugar ? `, en ${lugar}` : ''}. Me gustaría conversar.`)}`;
};
$$('[data-slug-part]', form).forEach((el) => el.addEventListener('input', () => paintSlug(true)));

// Viene desde un caso ("Quiero algo así") o desde «Su estreno» (portada de prueba): deja todo anotado
const q = new URLSearchParams(location.search);
const ref = SCENES.find((s) => s.slug === (q.get('obra') || q.get('estilo')));
if (ref) form.obra.value = ref.name;
if (q.has('estilo')) {
  const neg = q.get('negocio'), lugar = q.get('lugar'), nombre = q.get('nombre_negocio');
  if (neg && [...form.negocio.options].some((o) => o.value === neg)) form.negocio.value = neg;
  if (lugar) form.lugar.value = lugar.slice(0, 60);
  form.mensaje.value = `Probé «Su estreno»${nombre ? ` con el nombre ${nombre.slice(0, 60)}` : ''}${ref ? ` y me gustó el estilo de ${ref.name}` : ''}. `;
} else if (ref) form.mensaje.value = `Me gustó la muestra de ${ref.name} y quiero algo así para mi negocio. `;
paintSlug(q.has('estilo'));

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

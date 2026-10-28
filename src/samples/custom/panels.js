// Paneles que se abren y cierran (menú, ficha, visor de fotos): mientras están ocultos quedan fuera del
// teclado y de los lectores de pantalla; se sincroniza con el aria-hidden que ya maneja cada muestra.
const PANELS = '.sheet, .drawer, .viewer, .room, .menu, .dossier';

function inertPanels() {
  for (const el of document.querySelectorAll(PANELS)) {
    if (!el.hasAttribute('aria-hidden')) continue;
    const sync = () => { el.inert = el.getAttribute('aria-hidden') === 'true'; };
    sync();
    new MutationObserver(sync).observe(el, { attributes: true, attributeFilter: ['aria-hidden'] });
  }
}
setTimeout(inertPanels);

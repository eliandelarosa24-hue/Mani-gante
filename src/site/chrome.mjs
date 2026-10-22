// Piezas comunes de todas las páginas del estudio (cabecera, menú, pie y capas). Vite las inserta donde
// cada página escribe <!--RV:HEAD-->, <!--RV:HEADER:activo-->, <!--RV:FOOTER--> y <!--RV:OVERLAYS-->.
export const CONTACT = {
  wa: '56952289117',
  waLabel: '+56 9 5228 9117',
  mail: 'redvaeru@gmail.com',
  waText: 'Hola, vengo del sitio de Red Vaeru.',
};
export const waLink = (text = CONTACT.waText) => `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(text)}`;

const NAV = [
  ['trabajos', '/trabajos/', 'Trabajos'],
  ['servicios', '/servicios/', 'Servicios'],
  ['estudio', '/estudio/', 'Estudio'],
  ['contacto', '/contacto/', 'Contacto'],
];

// Emblema: palmera del Caribe arriba, araucaria del sur abajo, un solo tronco y dos hemisferios.
export function emblem(cls = 'emblem', title = '') {
  // La palmera se inclina al este con el viento alisio; la araucaria se queda quieta: el Caribe se mueve, el sur se sostiene.
  const fronds = ['M60 40Q41.32 27.72 26 44Q42.44 37.24 60 40Z', 'M60 40Q51.54 23.44 33 22Q47.58 29.38 60 40Z', 'M60 40Q64.04 22.68 54 8Q58.28 23.76 60 40Z', 'M60 40Q62.2 19.8 80 10Q68.5 24 60 40Z', 'M60 40Q75.56 17.72 102 24Q79.4 27.8 60 40Z', 'M60 40Q89 21 108 50Q86 35.4 60 40Z', 'M60 40Q87 35 92 62Q81.28 43.32 60 40Z'];
  const tiers = ['M60 59.7L48.2 60.9Q45.6 60.4 45.4 54Q43 62.4 48.8 63.7L60 64.3Z', 'M60 59.7L71.8 60.9Q74.4 60.4 74.6 54Q77 62.4 71.2 63.7L60 64.3Z', 'M60 71.7L41.2 72.9Q38.6 72.4 38.4 66Q36 74.4 41.8 75.7L60 76.3Z', 'M60 71.7L78.8 72.9Q81.4 72.4 81.6 66Q84 74.4 78.2 75.7L60 76.3Z', 'M60 83.7L34.2 84.9Q31.6 84.4 31.4 78Q29 86.4 34.8 87.7L60 88.3Z', 'M60 83.7L85.8 84.9Q88.4 84.4 88.6 78Q91 86.4 85.2 87.7L60 88.3Z'];
  return `<svg class="${cls}" viewBox="0 0 120 120" ${title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"'} focusable="false">
    <g class="em__ring" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path class="em__north" d="M5.66 46.45A56 56 0 0 1 114.34 46.45"/><path class="em__south" d="M114.34 73.55A56 56 0 0 1 5.66 73.55"/></g>
    <path class="em__trunk" fill="currentColor" d="M58.8 40L61.2 40L62.6 97L57.4 97Z"/>
    <g class="em__arau" fill="currentColor">${tiers.map((d) => `<path d="${d}"/>`).join('')}</g>
    <g class="em__palm" fill="currentColor">${fronds.map((d) => `<path d="${d}"/>`).join('')}</g>
    <path class="em__roots" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M60 96Q54 101 44 103M60 96Q66 101 76 103M60 96L60 107"/>
  </svg>`;
}

function head() {
  return `<meta name="theme-color" content="#0c0b0a" />
  <link rel="icon" href="/brand/gobo.svg" type="image/svg+xml" />
  <link rel="icon" type="image/png" sizes="32x32" href="/brand/emblema-32.png" />
  <link rel="apple-touch-icon" href="/brand/emblema-512.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="preload" href="/fonts/rv/display-n.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/src/site/base.css" />
  <script type="speculationrules">{"prerender":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/muestras/*"}}]},"eagerness":"moderate"}]}</script>
  <script>try{document.documentElement.classList.add('js');if(sessionStorage.getItem('rv-seen'))document.documentElement.classList.add('seen')}catch(e){}</script>
  <!--ANALYTICS-->`;
}

function header(active = '') {
  const links = NAV.map(([k, href, label], i) => `<a href="${href}"${k === active ? ' aria-current="page"' : ''} data-n="0${i + 1}">${label}</a>`).join('');
  return `<a class="skip" href="#contenido">Saltar al contenido</a>
  <header class="hd" data-hd>
    <a class="hd__brand" href="/" aria-label="Red Vaeru, inicio">${emblem('hd__mark')}<span class="hd__word">Red Vaeru</span></a>
    <nav class="hd__nav" aria-label="Principal">${links}</nav>
    <div class="hd__tools">
      <button class="hd__sound" type="button" data-sound aria-pressed="false" aria-label="Activar sonido ambiente"><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="hd__sound-l">Sonido</span></button>
      <button class="hd__menu" type="button" data-menu-btn aria-expanded="false" aria-controls="menu"><span class="hd__menu-l">Menú</span><span class="burger" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </header>
  <div class="menu" id="menu" data-menu aria-hidden="true">
    <nav class="menu__nav" aria-label="Menú">
      <a href="/"${active === 'inicio' ? ' aria-current="page"' : ''}><small>00</small><span>Inicio</span></a>
      ${NAV.map(([k, href, label], i) => `<a href="${href}"${k === active ? ' aria-current="page"' : ''}><small>0${i + 1}</small><span>${label}</span></a>`).join('')}
    </nav>
    <div class="menu__foot">
      <a href="${waLink()}" target="_blank" rel="noopener" data-from="menu">WhatsApp ${CONTACT.waLabel}</a>
      <a href="mailto:${CONTACT.mail}">${CONTACT.mail}</a>
      <p>Araucanía, Chile · Santo Domingo, R. D.</p>
    </div>
  </div>`;
}

function footer() {
  return `<footer class="ft" data-ft>
    <div class="ft__cta">
      <p class="ft__kicker">¿Su lugar es el próximo?</p>
      <a class="ft__big" href="/contacto/" data-cursor="Escribir"><span>Conversemos</span><i aria-hidden="true">→</i></a>
    </div>
    <div class="ft__grid">
      <div class="ft__col">
        <p class="ft__label">Escríbanos</p>
        <a href="${waLink()}" target="_blank" rel="noopener" data-from="pie">WhatsApp ${CONTACT.waLabel}</a>
        <a href="mailto:${CONTACT.mail}">${CONTACT.mail}</a>
        <button type="button" class="ft__ai" data-open-agent data-source="pie">Vaeru IA, nuestro asistente</button>
      </div>
      <div class="ft__col">
        <p class="ft__label">Estudio</p>
        <a href="/trabajos/">Trabajos</a><a href="/servicios/">Servicios y planes</a><a href="/estudio/">Estudio</a><a href="/contacto/">Contacto</a>
      </div>
      <div class="ft__col">
        <p class="ft__label">Servicios</p>
        <a href="/servicios/paginas-web-alojamientos/">Web para alojamientos</a><a href="/servicios/paginas-web-restaurantes/">Web para restaurantes</a><a href="/servicios/asesoria-turistica/">Asesoría turística</a><a href="/servicios/capacitacion-servicio-al-cliente/">Capacitación</a>
      </div>
      <div class="ft__col ft__clocks" aria-label="Hora actual en nuestras dos casas">
        <p class="ft__label">Dos casas</p>
        <p><span>Araucanía, Chile</span><b data-clock="America/Santiago">--:--</b></p>
        <p><span>Santo Domingo, R. D.</span><b data-clock="America/Santo_Domingo">--:--</b></p>
      </div>
    </div>
    <div class="ft__base">
      <span>${emblem('ft__mark')} Red Vaeru · Conectando culturas</span>
      <span>© <span data-year>2026</span> Red Vaeru · Dirección: Jorge Vásquez</span>
      <a href="/privacidad">Privacidad</a>
    </div>
  </footer>`;
}

function overlays() {
  return `<div class="curtain" aria-hidden="true"><div class="curtain__panel">${emblem('curtain__mark')}</div></div>
  <div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"><em></em></span></div>
  <button class="fab" type="button" data-open-agent data-source="flotante" aria-label="Abrir Vaeru IA, el asistente de Red Vaeru">${emblem('fab__mark')}<span>Vaeru IA</span></button>
  <div class="drawer" data-drawer aria-hidden="true">
    <div class="drawer__backdrop" data-close-agent></div>
    <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Vaeru IA" data-agent-drawer></div>
  </div>`;
}

export const chromeParts = { head, header, footer, overlays };

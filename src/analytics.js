// Capa de eventos de conversión. Funciona con Plausible o Google Analytics si están cargados
// (ver README: VITE_PLAUSIBLE_DOMAIN o VITE_GA_ID). Sin proveedor, no hace nada.
export function track(name, props = {}) {
  try {
    if (typeof window.plausible === 'function') window.plausible(name, { props });
    if (typeof window.gtag === 'function') window.gtag('event', name, props);
    (window.dataLayer = window.dataLayer || []).push({ event: name, ...props });
  } catch {
    /* la analítica nunca debe romper el sitio */
  }
}

// Clics en WhatsApp y correo desde cualquier parte del sitio.
export function trackOutbound() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href.startsWith('https://wa.me/')) track('whatsapp_click', { from: a.dataset.from || location.pathname });
    else if (href.startsWith('mailto:')) track('email_click', { from: location.pathname });
  });
}

# MANI-GANTE · El Gigante de los Antojos

Sitio de MANI-GANTE (maní confitado artesanal, Temuco). Es estático, con módulos ES nativos y **sin build step**, más Netlify Functions para la IA, las reservas, el stock y el panel de Jorge.

> Versión **v3 · catálogo 2026.10.2**. Todo el detalle de las 50 mejoras está en [`CHANGELOG.md`](CHANGELOG.md).

## Qué hace

**Para el cliente**
- **Catálogo en vivo**: el stock viene de Google Sheets, con caché, webhook y respaldo offline. Tiene filtros sticky (Disponibles / Top / Nuevos) y buscador.
- **Vista rápida** de cada sabor:
  - foto ↔ ilustración, formato, cantidad;
  - "va bien con" y alérgenos;
  - "Reservar este sabor" y "Preguntarle al Gigante";
  - enlace a la ficha indexable `/sabor/:id`.
- **Boleta (carrito)**:
  - persistente: si vuelves, tu pedido te espera;
  - se comparte por link (`?pedido=`) y sugiere qué más llevar;
  - promo de viernes gamificada;
  - eliges cómo pagar (transferencia, Mercado Pago o efectivo) y se envía por WhatsApp.
- **Reserva en un solo flujo**:
  - el ticket se arma en vivo y muestra cupos por bloque horario;
  - genera un código `MG-XXXX`;
  - al terminar puedes descargar el ticket PNG, el archivo `.ics` o el enlace de Google Calendar.
- **Mis pedidos**: historial en el dispositivo, con "repetir", "ya pagué" y "recibido".
- **Avísame cuando vuelva**: alertas de stock para sabores agotados.
- **Juegos de compra**:
  - test de sabor de 4 preguntas, que se puede guardar y compartir;
  - "Arma tu caja", con bolsas reales.
- **El Gigante**, el asistente con IA (Claude):
  - consulta el stock y los cupos;
  - recomienda combinaciones;
  - agrega al carrito y crea reservas.

**Para Jorge** ([`/admin.html`](admin.html), protegido con `ADMIN_TOKEN`)
- Reservas del día y su estado (pendiente → confirmada → entregada), cupos por bloque y export CSV contable.
- Interruptor **"Jorge no está en el campus"**: frena las reservas y avisa en toda la web y en el agente.
- Stock manual (Auto / Hay / Agotado) por sabor e **inventario por lote**.
- Métricas de 14 días (reservas, mensajes del agente, visitas, sabores más vistos) y Web Vitals.
- Alertas de stock pendientes, con enlaces para avisar, más la galería UGC y el historial de versiones del catálogo.

**Calidad**
- PWA con modo offline e íconos maskable y monocromo.
- Fuentes autoalojadas y carga diferida del agente y de las animaciones.
- SEO: páginas por sabor, sitemap dinámico, JSON-LD completo y OG por sabor.
- WCAG 2.2 AA verificado con axe; i18n es/en.
- Pruebas Playwright en escritorio y móvil.

## Estructura

```
index.html, admin.html, oficio.html, 404.html, offline.html
css/tokens.css              Generado desde design/tokens.json (no editar a mano si puedes evitarlo)
css/styles.css              Componentes del sitio (todos usan tokens)
css/fonts.css               @font-face locales + fallbacks con ajuste métrico
css/pages.css · admin.css   Ficha de sabor / blog / 404 · panel de Jorge
js/catalog.mjs              ⭐ Fuente única de verdad: sabores, precios, horario, reglas, promos, alérgenos, versión
js/app.mjs                  Tienda (catálogo, boleta, reservas, quiz, caja, historial…)
js/voice.mjs                Textos de marca (voz de Jorge) para toasts y estados vacíos
js/ui.mjs                   Toasts, foco atrapado y sello "Hecho a mano"
js/art.mjs · tilt.mjs       Bolsas generativas · micro-interacción de papel
js/ticket.mjs · history.mjs Ticket PNG/.ics · historial y carrito compartido
js/i18n.mjs · analytics.mjs Traducciones · eventos y Web Vitals
js/agent.mjs · motion.mjs   Widget del Gigante · animaciones GSAP (se cargan bajo demanda)
js/admin.mjs                Panel de Jorge
netlify/functions/          agent, stock, status, reserve, alerts, events, admin, sabor, sitemap
netlify/lib/*.mts           Lógica de negocio en TypeScript + Zod (Netlify la compila sola)
assets/fonts · vendor · og  Fuentes OFL, GSAP, imágenes OG por sabor
sw.js · site.webmanifest    PWA
apps-script/Code.gs         Reservas → Sheets y webhook de stock (pushStock)
design/tokens.json          Tokens (primitivo → semántico → componente) + build-tokens.py
docs/brand-guidelines.md    Marca: paleta, tipografía, voz, elevación, procesos
docs/design-system.md       Componentes (listos para pasar a Storybook/MDX)
scripts/seo.mjs             Regenera JSON-LD del index desde catalog.mjs
tests/                      Playwright (tienda, API, accesibilidad) + servidor local
```

## El día a día

| Quiero… | Dónde |
|---|---|
| Marcar un sabor agotado o disponible | Google Sheets (columna `disponible`) **o** el panel → Stock. El panel tiene prioridad. |
| Avisar que hoy no voy al campus | Panel → interruptor "Jorge no está" (con mensaje opcional) |
| Ver y marcar las reservas de hoy | Panel → Reservas de hoy |
| Exportar para la contabilidad | Panel → Exportar CSV (abre bien en Excel) |
| Cambiar precios, sabores, horario, cupos por bloque, promo de viernes, alérgenos | `js/catalog.mjs`. Sube `CATALOG_VERSION`, agrega una línea en `CATALOG_CHANGELOG` y luego ejecuta `npm run seo` |
| Marcar sabores como "Nuevo" | `NEW_IDS` en `js/catalog.mjs` (hoy está vacío) |
| Avisar a quien pidió "Avísame" | Panel → Alertas (enlaces de WhatsApp o mail listos, y "Marcar avisado") |
| Mostrar fotos de clientes | Panel → UGC (URL de la foto + nombre + texto) |

> ⚠️ El horario que viene configurado (lun–jue 9:00–19:00, vie 9:00–17:00) y los textos de "El oficio" son de ejemplo. Revísalos.

### Cambiar colores o espaciados de la marca

Edita `design/tokens.json`, regenera `css/tokens.css` con el generador del skill *design-system* y luego ejecuta `python3 design/build-tokens.py css/tokens.css`. Ese post-proceso agrega el modo oscuro pensado aparte.

## Publicar en Netlify

1. Conecta el repositorio (o arrastra la carpeta). **No hace falta comando de build**: Netlify compila las funciones `.mts` sola.
2. En **Site configuration → Environment variables** agrega:

| Variable | Obligatoria | Para qué |
|---|---|---|
| `ANTHROPIC_API_KEY` | Para la IA | Clave de https://console.anthropic.com |
| `ADMIN_TOKEN` | Para el panel | Clave del panel de Jorge (mínimo 12 caracteres, larga y aleatoria) |
| `MANIGANTE_MODEL` / `MANIGANTE_EFFORT` | No | Modelo (por defecto `claude-opus-5-5`) y esfuerzo (`low` por defecto) |
| `STOCK_WEBHOOK_SECRET` | No | Secreto del webhook `POST /api/stock` que usa `pushStock` en Apps Script (el stock se actualiza al instante al editar la planilla) |
| `RESERVATIONS_WEBHOOK_URL` | No | URL `/exec` del Apps Script: cada reserva queda en la pestaña "Reservas" |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `OWNER_WHATSAPP` | No | WhatsApp Cloud API: aviso automático a Jorge por cada reserva |
| `WHATSAPP_TEMPLATE`, `WHATSAPP_TEMPLATE_LANG` | No | Plantilla aprobada por Meta, para que el aviso llegue siempre |
| `RESEND_API_KEY`, `OWNER_EMAIL`, `NOTIFY_FROM` | No | Aviso por email (Resend) de cada reserva |

- Sin `ANTHROPIC_API_KEY`, el asistente funciona en modo básico: catálogo, precios, horario y FAQ.
- Sin Netlify Blobs (por ejemplo en local), los datos del panel viven en memoria.
- Activa **Forms** en Netlify si quieres recibir las notas del formulario de opiniones.

### Webhook de stock (opcional, recomendado)

1. En el Apps Script de la planilla, pega `apps-script/Code.gs`.
2. En Propiedades del script define `SITE_URL` (`https://manigante.netlify.app`) y `STOCK_SECRET` (el mismo valor que `STOCK_WEBHOOK_SECRET` en Netlify).
3. Crea un activador "Al editar" que ejecute `pushStock`.

## Probar en local

```bash
npm install
npx netlify-cli dev   # http://localhost:8888 con funciones y Blobs
npm test              # Playwright: tienda, API y accesibilidad (escritorio + móvil)
npm run typecheck     # TypeScript de netlify/lib y functions
npm run seo           # regenera el JSON-LD del index desde catalog.mjs
```

`npm test` levanta `tests/serve.mjs`, un servidor mínimo que sirve los estáticos y ejecuta las functions sin necesitar netlify-cli. Ese servidor usa `ADMIN_TOKEN=test-admin-token-123`.

Para usar la IA en local, copia `.env.example` a `.env` y completa las claves.

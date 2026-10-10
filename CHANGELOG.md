# Changelog · MANI-GANTE

## v4.2 · Logo oficial, horario real y velocidad (catálogo 2026.10.4)

**Marca**
- **Logo oficial:** la etiqueta de las bolsas va en cada bolsa ilustrada, sobre la anilla dorada.
- **Íconos nuevos:** versión compacta (elefante + MANI-GANTE) para la app, la navegación y la pantalla de carga.
- **Eslogan igual a la etiqueta:** "Para gente **elegante y gánster**", en la web, el SEO, las imágenes para compartir y el agente.
- **33 alias nuevos con jerga dominicana**, que dicen a qué sabe cada uno. Algunos ejemplos:
  - La Chinola (maracuyá)
  - La Patilla (sandía)
  - Morir Soñando (naranja)
  - La Mamajuana (pasa al ron)
  - El Sancocho (mix)
  - El Mangú (leche con plátano)
  - La Greca (mocaccino)
  - El Amanecío (cappuccino)
  - Tostón de Gala (plátano con chocolate)
  - El Chimi (japonés barbecue)

**Horario y puntos de venta**
- **INACAP:** miércoles 08:00–18:30 y jueves 08:00–17:00 recorriendo el campus. Martes y viernes, solo reservas.
- Las citas solo ofrecen esos días. El estado en vivo dice "Hoy solo con reserva" cuando corresponde.
- **Liceo Bicentenario James Mundell** (lunes a viernes) agregado como punto de venta, en la web, las preguntas frecuentes y el agente.
- Nueva pregunta frecuente sobre pedidos grandes (10 bolsas o más).

**Contenido**
- 8 fotos nuevas del producto real en la galería, "La receta", "El Diario" y la vista rápida. Se quitaron las fotos antiguas que ya no se usaban.
- **Instagram en vivo** (`/api/instagram`): publicaciones e historias con caché de 10 minutos y renovación automática del token. Las destacadas no son posibles por la API de Instagram.
- **Red Baeru** en "El Jefe" y en el pie. El link queda pendiente, se configura en `BUSINESS.ventures`.

**Rendimiento** (medido con el procesador 4 veces más lento)

| | Antes | Después |
|---|---|---|
| Elementos en la página | 23.800 | 2.090 |
| Cuadros trabados al hacer scroll | 115 | 3 |
| Cuadro p95 | 217 ms | 16,8 ms (60 fps) |
| Carga en escritorio | 7,5 s | 1,8 s |

Qué se cambió:
- Las bolsas, los maníes y la roseta se dibujan una vez y se reutilizan como imagen (`bagImg`, `peanutsImg`, `guillocheImg`).
- Se quitó la capa de grano fija con mezcla de colores.
- El dorado animado quedó solo en el titular.
- El foco de luz ahora se mueve con `transform`.
- Las secciones usan `content-visibility: auto`.
- La barra de la tienda ya no usa blur.

**Movimiento**
- **Pantalla de carga** por sesión: moneda con el logo, barra dorada y telón. Máximo 1,8 s; no aparece si ya se mostró la puerta.
- **Microanimaciones:**
  - totales que ruedan como contador;
  - "+1" dorado al agregar;
  - destello en la ficha agregada;
  - botones dorados magnéticos;
  - entradas escalonadas de pasos, tarjetas y preguntas;
  - filete dorado que se dibuja bajo cada capítulo.

**Calidad**
- 52 pruebas Playwright pasan, incluido axe WCAG 2.2 AA en Noche y Marfil.

## v4.0 · "Para gente elegante y gánster" · catálogo 2026.10.3 (10 de octubre de 2026)

Identidad nueva y única. La investigación está en [`docs/identidad-casa.md`](docs/identidad-casa.md) y las reglas en [`docs/brand-guidelines.md`](docs/brand-guidelines.md). Todo lo funcional de la v3 se mantiene.

**Identidad**
- Eslogan nuevo: **"Para gente elegante y gánster."**
- Tema **Noche** por defecto (noir, terciopelo y champán) y **Marfil** opcional.
- Tokens nuevos y generador sin dependencias (`design/build-tokens.mjs`).
- Tipografías nuevas: **Bodoni Moda**, **Big Shoulders**, **Instrument Sans** y **Pinyon Script**. Se eliminaron Fraunces, Manrope y Caveat.
- Arte generativo nuevo: **anilla de habano** en cada bolsa (con número de ficha), **roseta guilloché** y **monograma MG**.
- **La puerta**: intro de speakeasy accesible, solo en la primera visita.

**Cada sección, una sala**
- **El salón** (hero):
  - titular de tres líneas con cursiva en foil;
  - bolsa Nº 01 sobre la roseta;
  - foco de luz que sigue al puntero;
  - "Parte del día" impreso en papel.
- **La Bolsa de hoy**: el stock en vivo como cotización (▲/▼).
- Los capítulos:
  - Cap. I **La receta**: expediente confidencial en 4 folios.
  - Cap. II **Los más buscados**: fichas tipo rueda de reconocimiento, **33 alias** (`ALIASES` en `catalog.mjs`), búsqueda por alias.
  - Cap. III **El maletín**: cuero, terciopelo capitoné y broches.
  - Cap. IV **La cita**: invitación de marfil con lacre.
  - Cap. V **El Jefe**: "El Diario de la Casa".
  - Cap. VI **Las pruebas**: galería numerada.
  - Cap. VII **El trato**: mesa de fieltro con tarjetas de metal.
  - Cap. VIII **La letra chica**.
  - Cap. IX **La familia habla**: telegrama.
- **Pie**: logotipo gigante en foil.
- **La cuenta de la casa**, **El interrogatorio** (quiz bajo una lámpara) y **El Gigante, tu consigliere** (IA).

**Voz y contenido**
- `voice.mjs`, el prompt del agente, la versión en inglés, el 404, "La receta" y las fichas `/sabor/:id` hablan el idioma de la casa: dominicano-chileno y gánster elegante.
- La voz tiene límites explícitos: nada de armas, violencia ni drogas.
- Formatos renombrados: **El Clásico** y **La Reserva**.
- **35 imágenes para compartir** regeneradas con la identidad nueva (`scripts/og.mjs`): una por sabor, más portada y receta.
- El ticket PNG descargable ahora es una invitación.

**Calidad**
- **52 pruebas** Playwright en escritorio y móvil: se agregaron las de la puerta y la identidad.
- axe WCAG 2.2 AA sin violaciones en Noche y Marfil. Todos los contrastes están documentados.
- El service worker (`mg-v4-2026.10.3`) limpia la caché de la v3, así nadie queda viendo el diseño anterior.

**Pulido v4.1**
- Splash screens de iOS e íconos maskable con roseta y moneda dorada (`scripts/pwa-art.mjs`).
- Página sin conexión con la estética de la casa.
- Panel de Jorge alineado con la identidad: esquinas rectas, cifras en Big Shoulders y rombos dorados.
- Copys revisados: se quitó "armas el combo" y "Arma tu caja" (en clave gánster sonaban a armas). Ahora dicen "completas" y "Llena tu maletín".
- En celular: botones del pie a ancho completo y la cuenta muestra más líneas de pedido.

**Pendiente**
- Jorge revisa los alias, el horario y `NEW_IDS`.
- Foto de Jorge para El Diario (opcional).
- El logo del elefante todavía dice "El gigante de los antojos". Si Jorge quiere, se hace una versión con el eslogan nuevo.

## v3.0 · catálogo 2026.10.2 (octubre 2026)

Leyenda: ✅ implementada · 🟡 parcial (detalle en el plan de pendientes)

**Resumen: 41 ✅ · 9 🟡.** 48 pruebas Playwright pasan en escritorio y móvil (Pixel 7), incluido axe WCAG 2.2 AA en modo claro y oscuro.

### Diseño y percepción premium
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 1 | Micro-interacciones de papel real | ✅ | Tilt 3D con sombra dinámica y brillo de papel (`js/tilt.mjs`, `.paper-sheen`) sobre el grano. Solo con puntero fino y sin "reducir movimiento". |
| 2 | Elevación de 4 niveles con sombra cálida | ✅ | `--primitive-elevation-1…4` → `--elevation-card/raised/overlay/modal` (claro y oscuro) |
| 3 | Tipografía óptica | ✅ | Ejes `opsz`, `SOFT` y `WONK` de Fraunces (fuente completa autoalojada) + tracking por rol |
| 4 | Escala tipográfica y spacing de 8 pt en tokens | ✅ | `design/tokens.json` → `css/tokens.css`; documentado en la guía de marca §7 |
| 5 | Skeletons y estados vacíos con bolsa y voz de Jorge | ✅ | Bolsa en la boleta vacía y en búsquedas sin resultado; skeleton en "Estado en vivo"; textos en `js/voice.mjs` |
| 6 | Entradas cinematográficas GSAP | ✅ | `js/motion.mjs`: palabras que suben desde una máscara, clip-path y stagger de la tienda. Con reduced-motion no se anima nada. |
| 7 | Hero editorial con jerarquía de CTAs | ✅ | Kicker, un CTA principal dorado y un link secundario (`.hero-link`) |
| 8 | Sello "Hecho a mano" contextual | ✅ | `stampMoment()` al completar una caja, una reserva o un pedido |
| 9 | Bolsa generativa más realista | ✅ | `js/art.mjs`: luz, reflejo, fuelle y muesca; celofán con arrugas y doypack con ventana |
| 10 | Dark mode pensado | ✅ | Valores propios (kraft tostado, oro de texto, grano 8 %, sombras más profundas) generados por `build-tokens.py` |
| 11 | 404 memorable | ✅ | `404.html` con 3 sabores sugeridos y el Gigante; `/sabor/inexistente` también responde con la página de marca |
| 12 | Íconos PWA y splash | ✅ | Maskable 192/512, monocromo, splash para iOS y shortcuts en el manifest |

### UX y conversión
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 13 | Carrito persistente y recuperación | ✅ | localStorage + toast "Tu boleta te esperó" + link `?pedido=` para compartir o recuperar por WhatsApp |
| 14 | Promo de viernes gamificada | ✅ | `fridayPromo()` en catalog: cinta superior + barra en la boleta + mensaje de WhatsApp |
| 15 | Quick view completa | ✅ | Foto ↔ ilustración, "va bien con", alérgenos y CTAs para reservar, preguntar y ver la ficha |
| 16 | Reserva en un flujo con ticket en vivo | ✅ | `#rfLive` (aria-live), cupos por bloque y medio de pago |
| 17 | Post-reserva: ticket guardable, .ics y wallet | 🟡 | PNG, .ics y Google Calendar listos. **Falta Apple/Google Wallet.** |
| 18 | Quiz más profundo y guardado | ✅ | 4 preguntas (con intensidad); se guarda en el dispositivo y se puede compartir |
| 19 | Arma tu caja con preview real | ✅ | Bolsas reales en cada espacio + "Sorpréndeme" + sello |
| 20 | Upsell inteligente | ✅ | "Va chévere con lo tuyo" en la boleta; el agente ofrece 1 complemento (`pairs`) por conversación |
| 21 | Checkout híbrido con estado | 🟡 | Transferencia / Mercado Pago / efectivo; estado "ya pagué → recibido" en Mis pedidos. **Falta el cobro verificado de Mercado Pago** (Checkout Pro + webhook). |
| 22 | Avísame cuando vuelva | ✅ | `/api/alerts` + panel con los avisos pendientes (WhatsApp o mail en un toque) |
| 23 | Historial de pedidos | ✅ | `js/history.mjs` + diálogo Mis pedidos (repetir, ya pagué, recibido, borrar) |
| 24 | Filtros sticky | ✅ | `.shop-bar` sticky: Disponibles / Top / Nuevos + buscador |

### Performance y calidad
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 25 | Fuentes locales y critical CSS | 🟡 | Google Fonts eliminado; fuentes autoalojadas con preload y fallbacks métricos. **Falta inline del critical CSS.** |
| 26 | Lazy-load, fetchpriority y decoding async | ✅ | Imágenes bajo el fold con lazy y async; hero con `fetchpriority="high"` |
| 27 | Service Worker y catálogo offline | ✅ | `sw.js` + `offline.html`. Nunca cachea admin, el agente ni las reservas. |
| 28 | Code-splitting | ✅ | `agent.mjs` y `motion.mjs` (y GSAP) se cargan bajo demanda. `art.mjs` queda en el bundle principal porque pinta la primera vista. |
| 29 | Core Web Vitals | ✅ | LCP, CLS, INP, FCP y TTFB → `/api/events` → panel (con ícono y etiqueta) |
| 30 | Tests Playwright | ✅ | `tests/`: tienda (9), API (6), accesibilidad (9), × escritorio y móvil |
| 31 | TypeScript + Zod | 🟡 | Todo el backend de negocio en `.mts` + Zod con mensajes en español. **El frontend sigue en JS** (sin build step). |
| 32 | Toasts unificados con voz de marca | ✅ | `toast()` en `js/ui.mjs` + textos en `js/voice.mjs` |

### Backend, gestión y operaciones
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 33 | Panel admin | ✅ | `/admin.html`: reservas del día, entregas, stock manual, métricas del agente |
| 34 | Stock robusto | ✅ | Webhook `pushStock` → Blobs (60 s) → último conocido → catálogo local |
| 35 | Notificaciones unificadas | 🟡 | WhatsApp Cloud + email (Resend) + Sheets en `notify.mts`. **Faltan las push web** (requiere claves VAPID). |
| 36 | Analytics de negocio y dashboard | ✅ | `/api/events` + gráficos de 14 días en el panel (paleta validada para daltonismo, vista en tabla) |
| 37 | Inventario por lote | ✅ | Lotes y ventas por lote, solo en el panel |
| 38 | Capacidad por slot | ✅ | `slotCapacity: 6` en catalog; los bloques llenos se bloquean y la web muestra "quedan N" |
| 39 | Export CSV | ✅ | `/api/admin/export.csv` (UTF-8 con BOM para Excel) |
| 40 | Toggle "Jorge no está" | ✅ | Frena las reservas y se refleja en la web y en el agente |
| 41 | Versionado de catálogo | ✅ | `CATALOG_VERSION` + `CATALOG_CHANGELOG`; el historial queda en el panel |
| 42 | Rate limiting y anti-abuso | ✅ | Límite por IP y ruta, same-origin, honeypot y token admin con comparación segura |

### SEO y growth
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 43 | Páginas de sabor con schema Product | ✅ | `/sabor/:id` (Product + Offer + Breadcrumb) + sitemap dinámico |
| 44 | "El oficio" como blog | ✅ | `oficio.html` (Article schema). Los textos son borrador para Jorge. |
| 45 | Schema completo | ✅ | FoodEstablishment, ItemList, FAQPage, WebSite, Article y BreadcrumbList (`npm run seo`) |
| 46 | Open Graph dinámico | 🟡 | Una imagen OG por sabor (33), generada desde `design/banners/flavor-og.html`. **No se genera en runtime**: hay que regenerarla al agregar un sabor. |
| 47 | Feed UGC / Instagram | 🟡 | Galería UGC curada desde el panel. **Falta la conexión con la API de Instagram.** |

### Accesibilidad y pulido
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 48 | WCAG 2.2 AA, focus premium y teclado | ✅ | axe sin violaciones (claro y oscuro, quick view, boleta, páginas secundarias); foco atrapado e `inert`; anillo de foco con token |
| 49 | i18n es-CL + en | 🟡 | Interfaz y navegación en inglés. **El catálogo, el agente y los textos largos siguen en español.** |
| 50 | Design system documentado | 🟡 | `docs/design-system.md` con fichas listas para Storybook o MDX. **Falta montar Storybook.** |

### Otros cambios
- **Voz de marca**: Jorge es dominicano y vive en Chile. Los textos de la web y del agente mezclan con suavidad el dominicano ("chévere", "dímelo", "mi pana") con el chileno ("al tiro", "bacán"). Ver guía de marca §3.
- **Seguridad**: el panel exige un `ADMIN_TOKEN` de al menos 12 caracteres; el webhook de stock exige secreto.
- **Eliminados**:
  - `netlify/functions/reserve.mjs`, `netlify/lib/stock.mjs` y `netlify/lib/notify.mjs`, reemplazados por sus versiones `.mts`;
  - `sitemap.xml` estático, reemplazado por el dinámico.

---

## Plan de pendientes

| Prioridad | Tarea | Qué se necesita |
|---|---|---|
| Alta | Revisar contenido | Jorge: horario real (`SCHEDULE`), textos de "El oficio", notas de sabores, qué sabores son **nuevos** (`NEW_IDS`, hoy vacío) y alérgenos |
| Alta | Configurar Netlify | `ADMIN_TOKEN`, `ANTHROPIC_API_KEY`, `STOCK_WEBHOOK_SECRET` + activador `pushStock` en Apps Script |
| Media | #21 Mercado Pago verificado | Cuenta de MP, Access Token → función `/api/pay` (Checkout Pro) + webhook que marque la reserva como pagada |
| Media | #35 Push web | Claves VAPID, suscripción en `sw.js` y envío en `alerts.mts` (avisos de "volvió tu sabor") |
| Media | #17 Wallet | Certificado de Apple Developer (Pass Type ID) / Google Wallet issuer, más una función que firme el pase |
| Media | #47 Instagram | Cuenta Business + token de Instagram Graph API → función con caché diaria que alimente `.ugc` |
| Baja | #25 Critical CSS | Script que extraiga el CSS del primer pantallazo y lo inserte inline en `index.html` (opcional, sin build obligatorio) |
| Baja | #46 OG en runtime | Netlify Edge Function con `og_edge` o un satori equivalente, si el catálogo crece mucho |
| Baja | #31 Frontend tipado | JSDoc + `// @ts-check` en `js/*.mjs` (tipado sin build) |
| Baja | #49 i18n completa | Nombres y notas en inglés en `catalog.mjs` + idioma en el prompt del agente |
| Baja | #50 Storybook | Seguir los pasos de `docs/design-system.md` → "Llevarlo a Storybook" |

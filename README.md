# Red Vaeru · Proyectamos lugares

Sitio de Red Vaeru, estudio de diseño web para la hospitalidad entre el Caribe y el sur de Chile («Conectando culturas»). El sitio es una sala de cine:
- **Inicio:** una función que proyecta las diez muestras de concepto por latitud, del paralelo 19 Norte (Samaná) al 41 Sur (Frutillar). Cada titular va en la tipografía real de su sitio y, al seguir bajando, aparece su sitio funcionando en un navegador y un celular (en el teléfono, el celular va dentro de cada escena). Siguen un intermedio, el documental con los clientes reales y el testimonio de Nicole, los créditos y «Próximamente: su lugar». El botón «Ver la función» la recorre sola; en celular, «Escenas» permite saltar a cualquier obra.
- **Su estreno** (final de la portada): el visitante escribe el nombre de su negocio, elige rubro y, si quiere, una foto suya (no sale de su dispositivo), y ve su portada en computador y celular con el estilo de una muestra. Puede descargarla o compartirla por WhatsApp.
- **Páginas:** Trabajos (al pasar el cursor por una obra se ve su sitio funcionando; cada caso con el sitio en computador y celular y un recorrido guiado de tres decisiones, con capturas en `public/img/recorrido/` y notas en `src/samples/tour.js`), Servicios y planes (precios, lámpara cálida y calculadora de comisiones), Estudio y Contacto.
- **Vaeru IA**, el asistente que cotiza y responde dudas; el botón flotante ofrece WhatsApp (con un mensaje según la página) o Vaeru IA.
- **Paleta:** negro mate y un solo acento rojo vino Carmenere (`--fl` para textos y detalles, `--fl-deep` para botones y fondos); el telón entre páginas es vino.
- **Sonido ambiente** sintetizado por lugar, apagado por defecto.

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | Portada (la función) |
| `servicios/index.html`, `estudio/index.html`, `contacto/index.html` | Páginas escritas a mano |
| `scripts/build-works.mjs` | Genera `/trabajos/` y `/trabajos/<obra>/` desde `src/site/scenes.js` |
| `scripts/build-pages.mjs` | Genera `/servicios/<servicio>/`, `/privacidad`, `/gracias` y `404.html` |
| `scripts/build-samples.mjs` | Genera las muestras `/muestras/<obra>/` (`/muestras/` redirige a Trabajos) |
| **`src/pricing.js`** | **Tarifario, cupos de lanzamiento (`LAUNCH`) y notas.** Servicios, las páginas de servicio y Vaeru IA leen de aquí |
| `src/site/scenes.js` | Las obras: orden por latitud, coordenadas, titular, tipografía, foto, caso y galería; también los proyectos reales |
| `src/site/chrome.mjs` | Cabecera, menú, pie, emblema y capas comunes. Vite los inserta donde cada página escribe `<!--RV:...-->` |
| `src/site/markup.mjs` | Marcado de las escenas, el riel de latitud, el documental y el mapa del Estudio |
| `src/site/base.css`, `home.css`, `pages.css` | Sistema visual: variables, piezas comunes, portada y páginas interiores |
| `src/site/core.js` | Scroll suave, cabecera, menú, cursor, relojes, apariciones, transición entre páginas y cajón de Vaeru IA |
| `src/site/home.js`, `src/site/cinema-gl.js` | La función: proyector WebGL en computador y modo liviano en celular |
| `src/site/sound.js` | Sonido ambiente por lugar (mar, lluvia, fuego, noche, agua, viento) |
| `src/site/prices.js` | Precios en pantalla, CLP / USD |
| `scripts/fetch-scene-fonts.mjs` | Descarga, una vez, las tipografías de cada muestra recortadas a lo necesario (`public/fonts/escenas/`) |
| `public/fonts/rv/` | Titulares del estudio (Noto Serif Display, recortada a ancho 62,5–75) |
| `src/chat.js` | Interfaz de Vaeru IA: cotizador guiado, captura de lead, videollamada |
| `src/analytics.js`, `src/leads.js` | Eventos de conversión y envío de leads a Netlify Forms y Google Sheets |
| `netlify/functions/agent.mjs` | Modo IA opcional de Vaeru IA en `/api/agent`, con límite de uso por IP |
| `netlify/functions/lead.mjs` | Envía cada lead a Google Sheets en `/api/lead` |
| `src/samples/` | Las 10 muestras de concepto: contenido, casos (`cases.js`) y diseños a medida (`custom/`) |
| `public/video/sitio/` | Cada muestra grabada funcionando: `<obra>-d` (computador, 1440 px) y `<obra>-m` (celular, 390 px), en WebM, MP4 y póster JPG. Si cambia una muestra, hay que volver a grabar su video |
| `public/brand/` | Emblema en vector (`emblema.svg`, `gobo.svg`) e íconos |
| `public/__forms.html` | Registro de los formularios `cotizacion` y `diagnostico` para Netlify |
| `docs/` | Análisis, plan para conseguir clientes, tarifario, investigación y registro de mejoras |

**Agregar una obra:** súmela a `src/samples/data.js` y `cases.js`, póngala en `src/site/scenes.js` en su lugar por latitud y ejecute `node scripts/fetch-scene-fonts.mjs` para su tipografía.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173 (el chat funciona en modo guiado)
npm test         # pruebas del tarifario, el agente, las páginas y la configuración
npm run build    # genera dist/ con todas las páginas, sitemap.xml y robots.txt
```

## Publicar en Netlify
1. **Conectar el repositorio:** Add new site → Import from Git. El build ya está en `netlify.toml`.
2. **Activar formularios:** Forms → **Enable form detection**. Luego, Forms → Notifications, avisos por correo para `contacto`, `cotizacion` y `diagnostico`.
3. **Variables de entorno** (Site configuration → Environment variables):

| Variable | Para qué | Obligatoria |
|---|---|---|
| `ANTHROPIC_API_KEY` | Activa Vaeru IA con Claude | Sí, para la IA |
| `SITE_URL` | URL pública, por ejemplo `https://redvaeru.cl` (canonical, sitemap, imagen para redes) | Al tener dominio |
| `VITE_PLAUSIBLE_DOMAIN` | Analítica Plausible, sin cookies | Opcional |
| `VITE_GA_ID` | Google Analytics 4, si no usa Plausible | Opcional |
| `SHEETS_WEBHOOK_URL` | Registra cada lead en Google Sheets (ver `docs/google-sheets.md`) | Recomendada |
| `SHEETS_SECRET` | Clave compartida con el Apps Script de la planilla | Con la anterior |
| `CLAUDE_MODEL` | Modelo del agente (por defecto `claude-opus-5-5`; `claude-haiku-5-5` cuesta unas 40 veces menos) | Opcional |

Sin la clave de API, Vaeru IA funciona en **modo guiado**: cotiza con el mismo tarifario mediante botones, sin costo.

**Protección de costos:** cada IP puede hacer hasta 12 consultas por minuto al agente (`config.rateLimit` en la función). Además, conviene poner un límite de gasto mensual en la consola de Anthropic.

## Tareas frecuentes
- **Cerré un proyecto de lanzamiento:** en `src/pricing.js`, suba `LAUNCH.taken`.
- **Cambiar precios:** edite `SERVICES` en `src/pricing.js`.
- **Editar una página de servicio:** use `src/services-content.js`.
- **Poner imágenes propias (Gemini) en las muestras:** genere los collages de `docs/collages-gemini.md` y córtelos con `npm run collage -- collage.png --sample <slug> --grid 2x2 --names a,b,c,d`.
- **Entregar una muestra como sitio aparte:** `npm run build && npm run pack -- <slug>` crea `entregas/<slug>.zip`, listo para arrastrar a app.netlify.com/drop.
- **Muestras rediseñadas a medida:** viven en `src/samples/custom/<slug>/` (página, estilos y código propios); las demás usan la plantilla común.
- **Tipo de cambio para precios en USD:** `USD_RATE` en `src/pricing.js`.

## Pendiente (requiere al dueño)
- [ ] Fotos reales de los clientes en alta resolución (el estudio no muestra el rostro del director, por decisión de marca).
- [ ] Números de resultados de los casos (reservas directas) y testimonios en video.
- [ ] Agregar el giro de servicios digitales en el SII (hoy solo está registrado el de venta de maní confitado).
- [ ] Configurar la planilla de Google Sheets (`docs/google-sheets.md`, 10 minutos).
- [ ] Dominio propio y correo profesional.
- [ ] Validar la política de privacidad con asesoría legal.

# Red Vaeru · Portafolio 2.1

Sitio de Red Vaeru, el estudio digital de Jorge Vásquez para turismo y hospitalidad: sitios web para alojamientos y restaurantes, asesoría turística, capacitación en servicio al cliente y redes sociales. Incluye:
- **Vaeru IA**, un agente con Claude que cotiza y responde dudas;
- un **diagnóstico interactivo**;
- **páginas por servicio** para Google;
- **captura de leads** en Netlify Forms.

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal |
| **`src/pricing.js`** | **Tarifario, cupos de lanzamiento (`LAUNCH`), campaña de temporada (`CAMPAIGN`) y nota tributaria.** Todo el sitio y el agente leen de aquí |
| `src/services-content.js` | Textos de las 5 páginas por servicio |
| `scripts/build-pages.mjs` | Genera `/servicios/*`, `/privacidad`, `/gracias` y `404.html` (se ejecuta solo antes de `dev` y `build`) |
| `src/shared.js` | Navegación, cursor, scroll suave, agente en cajón, campaña, invitación del agente |
| `src/main.js` | Página principal: animaciones, calculadora de comisiones, diagnóstico, contacto |
| `src/page.js` | Páginas secundarias |
| `src/chat.js` | Interfaz de Vaeru IA: varios servicios, captura de lead, PDF, videollamada |
| `src/analytics.js` | Eventos de conversión (Plausible, GA4 o dataLayer) |
| `netlify/functions/agent.mjs` | Agente con Claude en `/api/agent`, con límite de uso por IP |
| `public/__forms.html` | Registro de los formularios `cotizacion` y `diagnostico` para Netlify |
| `docs/` | Análisis, plan para conseguir clientes, tarifario, investigación y registro de mejoras |

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
| `CLAUDE_MODEL` | Modelo del agente (por defecto `claude-opus-5-5`; `claude-haiku-5-5` cuesta unas 40 veces menos) | Opcional |

Sin la clave de API, Vaeru IA funciona en **modo guiado**: cotiza con el mismo tarifario mediante botones, sin costo.

**Protección de costos:** cada IP puede hacer hasta 12 consultas por minuto al agente (`config.rateLimit` en la función). Además, conviene poner un límite de gasto mensual en la consola de Anthropic.

## Tareas frecuentes
- **Cerré un proyecto de lanzamiento:** en `src/pricing.js`, suba `LAUNCH.taken`.
- **Cambiar precios:** edite `SERVICES` en `src/pricing.js`.
- **Nueva campaña:** cambie `CAMPAIGN.deadline` y `CAMPAIGN.text`. La barra superior se oculta sola después de la fecha.
- **Editar una página de servicio:** use `src/services-content.js`.

## Pendiente (requiere al dueño)
- [ ] Foto profesional de Jorge y fotos reales de los clientes (reemplazar Unsplash).
- [ ] Números de resultados de los casos (reservas directas) y testimonios en video.
- [ ] Confirmar el documento tributario (boleta de honorarios o factura) y ajustar `TAX_NOTE`.
- [ ] Dominio propio y correo profesional.
- [ ] Validar la política de privacidad con asesoría legal.

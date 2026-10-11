# Red Vaeru · Portafolio 2.0

Sitio de Red Vaeru, un estudio digital y de asesoría especializado en turismo y hospitalidad: sitios web para alojamientos y restaurantes, asesoría turística, capacitación en servicio al cliente y redes sociales. Incluye **Vaeru IA**, un agente con Claude que responde dudas y calcula presupuestos con el tarifario oficial.

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la página (secciones, textos, formulario de Netlify) |
| `src/styles.css` | Sistema visual: mezcla oscuro cinematográfico + editorial cálido |
| `src/main.js` | Animaciones (GSAP + Lenis), cursor, calculadora de comisiones, apertura del agente |
| `src/hero-shader.js` | Fondo animado del inicio (curvas de nivel en WebGL) |
| `src/chat.js` | Interfaz de Vaeru IA (con modo guiado de respaldo) |
| **`src/pricing.js`** | **Tarifario interno.** Edite aquí los precios: se actualizan en el sitio, el cotizador y el agente |
| `netlify/functions/agent.mjs` | Agente con Claude (ruta `/api/agent`) |
| `public/` | Favicon, imagen para redes, página de gracias del formulario |
| `docs/` | Investigación de referencias y propuesta de precios |

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173 (el chat funciona en modo guiado)
npm test         # pruebas del tarifario y del agente
npm run build    # genera dist/
```

Para probar el agente con IA en local: `npx netlify-cli dev` con `ANTHROPIC_API_KEY` en un archivo `.env`.

## Publicar en Netlify

1. Conecte este repositorio en Netlify (**Add new site → Import from Git**). El build ya está configurado en `netlify.toml`.
2. En **Site configuration → Environment variables** agregue `ANTHROPIC_API_KEY` con su clave de https://console.anthropic.com.
3. Opcional: `CLAUDE_MODEL` para cambiar el modelo del agente (por defecto `claude-opus-5-5`, con esfuerzo bajo para respuestas rápidas). Para reducir costos puede usar `claude-haiku-5-5`.
4. Formularios: Netlify detecta el formulario `contacto`. Active los avisos por correo en **Forms → Form notifications**.

Sin la clave, Vaeru IA sigue funcionando en **modo guiado**: cotiza con el mismo tarifario mediante botones, sin costo.

### Costos del agente
Cada conversación cuesta del orden de centavos de dólar. El prompt del sistema se guarda en caché para abaratar los mensajes siguientes. Se recomienda poner un límite de gasto mensual en la consola de Anthropic.

## Antes de publicar: revisar
- [ ] Aprobar o ajustar los precios de `src/pricing.js` (ver `docs/propuesta-precios.md`).
- [ ] Reemplazar las fotos de stock (Unsplash) por fotos propias o de clientes cuando las tenga.
- [ ] Agregar una foto profesional de Jorge en la sección "Nosotros".
- [ ] Cuando tenga dominio propio, cambiar `og:image` en `index.html` por la URL completa.

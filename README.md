# MANI-GANTE · El Gigante de los Antojos

Sitio web de MANI-GANTE (maní confitado artesanal, Temuco) con:

- **Catálogo en vivo** sincronizado con Google Sheets (columna `disponible`), con filtros, buscador y dos formatos de empaque.
- **Carrito** con barra de progreso de la promo de viernes y pedido inmediato por WhatsApp.
- **Reservas inteligentes**: el cliente elige día, hora y punto de encuentro. Solo se muestran los horarios en que Jorge está en el campus, se valida el stock en vivo y se abre WhatsApp con la reserva lista (con código `MG-XXXX`).
- **"El Gigante", el asistente con IA (Claude)**: responde dudas 24/7, consulta el stock en tiempo real, dice si Jorge está en el campus, recomienda sabores, agrega productos al carrito y **crea reservas** que terminan en WhatsApp.
- **v2 · experiencia de tienda premium artesanal**:
  - Cada sabor se ilustra como **su bolsa real** (doypack kraft o celofán) con el maní de su color en la ventana; cambia en vivo según el formato.
  - **Vista rápida** de cada sabor con formato, cantidad y sugerencias de "va bien con".
  - **Encuentra tu sabor**: test de 3 preguntas que recomienda 3 sabores disponibles.
  - **Arma tu caja**: cajas de 3, 6 o 10 bolsas que se llenan espacio por espacio (o con "Sorpréndeme").
  - **El oficio**: historia del confitado en 4 capítulos que cambian la foto al hacer scroll.
  - Carrito como **boleta de papel**, reserva como **ticket** con código y código de barras, historia en **polaroids**, opiniones como **nota manuscrita**, tarjetas de pago realistas y página 404 propia.
  - Textura de papel (grano), sello "Hecho a mano" giratorio y notas manuscritas de Jorge.
- Modo claro/oscuro, diseño responsive, contraste AA verificado, objetivos táctiles de 44 px, imágenes WebP, SEO (Open Graph, datos estructurados, sitemap) y animaciones que respetan "reducir movimiento".

## Estructura

```
index.html                  Página
css/styles.css              Sistema de diseño
js/catalog.mjs              ⭐ Fuente única de verdad: sabores, precios, horarios, reglas de reserva
js/app.mjs                  Catálogo, carrito, reservas, galería…
js/agent.mjs                Widget del asistente
netlify/functions/agent.mjs Agente de IA (Claude + herramientas)  → POST /api/agent
netlify/functions/reserve.mjs Reservas del formulario           → POST /api/reserve
netlify/lib/                Stock en vivo y avisos automáticos
apps-script/Code.gs         Apps Script para guardar reservas en Google Sheets
js/art.mjs                  Ilustraciones generativas (bolsas, maní, sello)
js/motion.mjs               Animaciones (GSAP + ScrollTrigger, opcionales)
docs/brand-guidelines.md    Guía de marca: paleta, tipografía y voz
design/tokens.json          Tokens de diseño (primitivo → semántico → componente)
css/tokens.css              Generado desde design/tokens.json
design/banners/og.html      Fuente de las imágenes para compartir (assets/banners/og/)
```

### Cambiar colores de la marca

Edita `design/tokens.json` y regenera `css/tokens.css` (generador del skill *design-system*), luego ejecuta
`python3 design/build-tokens.py css/tokens.css` para activar el modo oscuro. También puedes editar `css/tokens.css` a mano.

## Cambios del día a día

- **Stock**: igual que antes, marca/desmarca `disponible` en Google Sheets. La web y el asistente lo leen solos.
- **Precios, sabores nuevos, horario en el campus, bloques de reserva, puntos de encuentro**: edita `js/catalog.mjs` (todo está comentado).

> ⚠️ El horario que viene configurado (lun–jue 9:00–19:00, vie 9:00–17:00) es un ejemplo. Ajústalo a tu horario real en `SCHEDULE`.

## Publicar en Netlify

1. Conecta este repositorio en Netlify (o arrastra la carpeta). No necesita comando de build.
2. En **Site configuration → Environment variables** agrega:

| Variable | Obligatoria | Para qué |
|---|---|---|
| `ANTHROPIC_API_KEY` | Sí, para la IA | Clave de https://console.anthropic.com |
| `MANIGANTE_MODEL` | No | Modelo de Claude. Por defecto `claude-opus-5-5` |
| `MANIGANTE_EFFORT` | No | `low` (por defecto, respuestas rápidas), `medium` o `high` |
| `RESERVATIONS_WEBHOOK_URL` | No | URL `/exec` del Apps Script con `doPost` → cada reserva queda en la pestaña "Reservas" |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `OWNER_WHATSAPP` | No | WhatsApp Cloud API (Meta): te llega un aviso automático a tu WhatsApp por cada reserva |
| `WHATSAPP_TEMPLATE`, `WHATSAPP_TEMPLATE_LANG` | No | Plantilla aprobada de Meta para que el aviso llegue siempre (sin plantilla, Meta solo deja enviar texto libre dentro de las 24 h siguientes a tu último mensaje al número del negocio) |

**Sin `ANTHROPIC_API_KEY`** el asistente igual funciona en modo básico: responde con el catálogo, los precios, el horario y las preguntas frecuentes, y deriva a WhatsApp lo demás.

## Probar en local

```bash
npm install
npx netlify-cli dev      # abre http://localhost:8888 con las funciones activas
```

Crea un archivo `.env` a partir de `.env.example` para usar la IA en local.

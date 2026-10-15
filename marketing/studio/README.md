# Estudio de contenido · Red Vaeru

Genera todo el contenido de redes de la campaña a partir de la marca y de los sitios reales.

El estudio trabaja **por semana**: cada semana de campaña tiene su carpeta `semanas/semana-N/` y su salida en `out/semana-N/`. La variable `SEMANA` elige cuál se genera (por defecto, la 1). Los clips grabados de los sitios (`out/clips/`) son compartidos.

| Comando | Qué hace | Salida |
|---|---|---|
| `npm i` | Instala Playwright, las tipografías de la marca (Fraunces y Manrope) y el generador de QR | — |
| `node capture-sites.mjs` | Graba en vista de celular los sitios reales y las muestras, cuadro por cuadro | `out/clips/*.mp4` |
| `SEMANA=N node build-images.mjs` | Carruseles, historias, portadas de Reels y avisos de la semana | `out/semana-N/…` |
| `SEMANA=N node voz.mjs` | Voz en off con IA (ElevenLabs) y tiempos de cada palabra para los subtítulos. Requiere `ELEVENLABS_API_KEY` y `NODE_USE_ENV_PROXY=1` | `out/semana-N/voz/` |
| `SEMANA=N node build-videos.mjs [--voz]` | Reels de 1080×1920 (y versiones con voz y subtítulos) | `out/semana-N/videos/` |
| `SEMANA=N node build-hub.mjs` | Agenda en línea (se publica como Artifact) | `out/semana-N/hub/` |
| `SEMANA=N node build-pdf.mjs` | Agenda en PDF para usar sin internet | `out/semana-N/Agenda-Red-Vaeru-semana-N.pdf` |
| `SEMANA=N node empaquetar.mjs` | Un ZIP por día (imágenes en JPG, videos comprimidos, textos y PDF) | `entregas/semana-N/` |
| `SEMANA=info node animados.mjs [id]` | Videos animados e informativos (turismo en cifras, tributario, asesoría): escenas de marca que entran al ritmo de la voz, cifras que suben, barras, calendario, subtítulos, fuente en pantalla y cierre con QR. Guiones y escenas en `semanas/semana-info/` (`voz.mjs` y `animados.mjs`); primero `SEMANA=info node voz.mjs` | `out/semana-info/videos/` |

**Crear una semana nueva:** copiar `semanas/semana-2/` a `semanas/semana-N/` y editar sus cuatro archivos, siguiendo `docs/marketing/05-plan-octubre-noviembre.md`.

**Dónde editar:**
- Precios, cupos y WhatsApp: `BRAND` en `lib.mjs`. Deben coincidir con `src/pricing.js`.
- Plantillas visuales (las mismas todas las semanas): `templates.mjs`.
- Por semana, en `semanas/semana-N/`:
  - Textos, fechas y horas: `manifest.mjs`.
  - Imágenes: `imagenes.mjs`.
  - Reels: `reels.mjs`.
  - Guiones de voz: `voz.mjs`. La pronunciación (`SAY`) está en el `voz.mjs` del estudio.

**Reglas de contenido:**
- Las muestras llevan siempre la etiqueta «Muestra de concepto».
- Solo se usan testimonios reales y con su texto exacto.
- Las cifras de comisión se presentan como ejemplo.
- Los Reels van sin música: se agrega en Instagram desde su biblioteca licenciada.

`out/` y `entregas/` no se versionan: se regenera con los comandos de arriba.

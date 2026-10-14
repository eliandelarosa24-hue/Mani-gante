# Estudio de contenido · Red Vaeru

Genera todo el contenido de redes de la campaña a partir de la marca y de los sitios reales.

| Comando | Qué hace | Salida |
|---|---|---|
| `npm i` | Instala Playwright, las tipografías de la marca (Fraunces y Manrope) y el generador de QR | — |
| `node capture-sites.mjs` | Graba en vista de celular los sitios reales (Miah y Noah, Rincón de los Poetas, calculadora, muestras), cuadro por cuadro | `out/clips/*.mp4` |
| `node build-images.mjs` | Carruseles, posts, historias, portadas de Reels, perfil, avisos y anuncios | `out/<fecha>_<hora>_<pieza>/`, `out/perfil/`, `out/avisos/`, `out/anuncios/`, `out/portadas-reels/` |
| `node build-videos.mjs` | Reels de 1080×1920 con textos por escena y cierre con llamada a la acción (más la variante B del gancho) | `out/videos/*.mp4` |
| `node voz.mjs` | Voz en off con IA (ElevenLabs): voz femenina y masculina con acento chileno, alternadas, y los tiempos de cada palabra para los subtítulos. Requiere `ELEVENLABS_API_KEY` | `out/voz/<reel>.mp3` y `.json` |
| `node build-videos.mjs --voz` | Versiones de los Reels con voz en off y subtítulos sincronizados | `out/videos/*_voz.mp4` |
| `node build-hub.mjs` | Página de la agenda que se publica como Artifact (archivos, textos para copiar y estado de publicación) | `out/hub/` |

**Dónde editar:**
- Precios, cupos y WhatsApp: `BRAND` en `lib.mjs`. Deben coincidir con `src/pricing.js`.
- Textos de cada publicación, fechas y horas: `manifest.mjs`.
- Textos de las imágenes: `build-images.mjs`.
- Textos de los videos: `REELS` en `build-videos.mjs`.
- Guiones de la voz en off y pronunciación: `SCRIPTS` y `SAY` en `voz.mjs`. Para fijar una voz, defina `ELEVENLABS_VOICE_F` o `ELEVENLABS_VOICE_M`.

**Reglas de contenido:**
- Las muestras llevan siempre la etiqueta «Muestra de concepto».
- Solo se usan testimonios reales y con su texto exacto.
- Las cifras de comisión se presentan como ejemplo.
- Los Reels van sin música: se agrega en Instagram desde su biblioteca licenciada.

`out/` no se versiona: se regenera con los comandos de arriba.

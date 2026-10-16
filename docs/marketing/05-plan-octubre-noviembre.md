# Plan de contenido · 26 de octubre al 29 de noviembre de 2026

**Idea central:** que el flujo de contenido no se detenga, con el mismo estilo visual (plantillas de `marketing/studio/templates.mjs`) y las mismas ofertas:
- Carta QR: $49.000.
- Esencial: $59.000.
- Temporada: $199.000, con 3 cupos.
- 5 cupos de lanzamiento.

**La fecha que ordena todo:** el 30 de noviembre, último día para tener la web lista antes del verano.

## Semanas

| Semana | Fechas | Tema | Qué busca | Piezas principales | Estado |
|---|---|---|---|---|---|
| 2 | 26 oct – 1 nov | **Cero sorpresas: así trabajo** | Confianza: método, compromisos y dudas reales del sitio. Además, rubros nuevos (termas, cafés, hoteles boutique) | Reel del método · carrusel «Lo que necesito de usted» · carrusel de compromisos · carrusel de preguntas frecuentes · Reels de termas, café y hotel boutique (muestras) · historias de cupos y cuenta regresiva | ✅ Producida el 15-10-2026 · [agenda](https://claude.ai/artifact/NiVcrEUtnSRTAS9rvtLEBu) |
| 3 | 2 – 8 nov | **Cuenta regresiva de temporada** | Urgencia real: faltan 4 semanas para el 30 de noviembre | Calculadora en modo restaurante · Paquete Temporada en detalle · «3 errores en la web de una cabaña» · consejos para la ficha de Google · Reels de cabañas (Lago Azul) y de tours (Pucón Aventura), ambas muestras · historias de cuenta regresiva | ✅ Producida el 15-10-2026 · [agenda](https://claude.ai/artifact/Q9TzEEyu5pMGCB8rZrE7Aa) |
| 4 | 9 – 15 nov | **Últimos cupos de lanzamiento** | Cierre: los cupos se acaban y después rige el precio normal | Anuncio honesto de los cupos que quedan · Reel de viña (muestra) · Reel de Villa Coral Samaná (Caribe, muestra) · carrusel «Antes de diciembre: la lista final» · preguntas frecuentes, parte 2 · historias de cupos | ✅ Producida el 15-10-2026 · [agenda](https://claude.ai/artifact/LsgmJYRzyKqKFxhrpyhNPL) |
| 5 | 16 – 22 nov | **Recta final: lo que todavía alcanza** | El 16 es el último día para partir una Carta QR o un sitio Esencial a tiempo para el 30. Después: «su web trabaja en enero y febrero» | Reel de la Carta QR en acción · carrusel «Lo que alcanza en 1 semana» · Reel de domos o glamping (muestra) · Reel del Fogón Mapu (muestra) · preguntas sobre plazos · historias de cupos | Lo produce el agente el miércoles 21 de octubre |
| 6 | 23 – 29 nov | **La temporada ya empezó: su web para enero y febrero** | Seguir vendiendo después del 30, sin inventar urgencias: la temporada alta es enero y febrero | Reel «Lo que pasa en enero si no tiene web» (calculadora) · casos reales (Miah y Noah, El Rincón de los Poetas) · carrusel de mantención mensual · Reel de hotel o termas · historias de cupos | Lo produce el agente el miércoles 28 de octubre |

## Serie educativa (Reels con edición humana)

Agenda: https://claude.ai/artifact/Ax13w8A1PESVoRzBPTxTXn

Son Reels extra a las 18:00 que informan y terminan llevando a los servicios. Las fuentes están en `06-datos-videos-informativos.md` y `07-noticias-turismo-octubre-2026.md`. Cuando un video usa muestras de concepto como imagen, lleva la etiqueta fija «Imágenes: muestras de concepto de Red Vaeru».

| Video | Fecha | Tema | Fuente | Estado |
|---|---|---|---|---|
| A02 | jue 22 oct | ¿Cuánto le cobra realmente la plataforma? | Booking.com, Airbnb | ✅ |
| E04 | sáb 24 oct | El verano se decide antes de diciembre | INE, EMAT | ✅ |
| E06 | mar 27 oct | Cómo pedir reseñas sin incomodar | Tips | ✅ |
| E05 | jue 29 oct | Llegan menos turistas, pero los de lejos crecen | Subsecretaría de Turismo | ✅ |
| E08 | sáb 31 oct | Noticia: Navidad y Año Nuevo caen viernes (2 fines de semana largos) y Fiestas Patrias con más de 65 % de ocupación | Calendario y Hoteleros de Chile vía Emol | ⏳ sin voz: faltan créditos de ElevenLabs |
| E10 | mar 3 nov | 4 reglas para que sus fotos vendan | Tips | ✅ |
| E03 | jue 5 nov | IVA y turistas extranjeros | DL 825 y SII | ✅ |
| E09 | sáb 7 nov | Noticia: vuelo directo Temuco–Balmaceda de SKY | SKY vía 24horas y Mediabanco | ⏳ sin voz: faltan créditos de ElevenLabs |
| E01 | mar 10 nov | El F29 tiene tres fechas (vence el jueves 12) | SII | ✅ |
| E07 | sáb 14 nov | Fondos: cómo no perderse la próxima convocatoria | Sercotec | ✅ |
| E02 | mar 17 nov | Mes sin ventas no es mes sin F29 | SII | ✅ |

## Contenido que cambia si llega un cliente

Si se cierra un cliente en octubre, el agente agrega en la semana siguiente:
- **«Construyendo la web de…»:** proceso real, solo con permiso escrito del cliente.
- **Su testimonio:** cuando lo entregue.
- **Cupos actualizados:** se cambia `LAUNCH.taken` en `src/pricing.js` y el número en `BRAND` de `marketing/studio/lib.mjs`.

## Reglas que se mantienen

- **Solo material real:**
  - El sitio de Red Vaeru.
  - Las webs de clientes, con su permiso.
  - Las muestras, siempre rotuladas como «Muestra de concepto».
- **Nada de fotos de stock** ni ejemplos genéricos.
- **Cada Reel en dos versiones:** con voz y subtítulos, y sin voz. La versión con voz requiere el plan pagado de ElevenLabs para uso comercial.
- **Entrega de cada semana:**
  - Agenda en línea.
  - Agenda en PDF para usar sin internet.
  - Un ZIP por día.

## Rehechura con el estilo nuevo (16 de octubre)

- **Posts del 23 de octubre al 15 de noviembre (136 piezas):** rediseñados con la capa de personalidad de `templates.mjs`, que agrega stickers, notas a mano, resaltado de plumón, chats tipo WhatsApp, contadores de cupos, calendario, pantallas reales de Miah, Poetas y redvaeru.netlify.app y la firma de Jorge. Mismos nombres de archivo y mismos textos.
- **Reels R03 a R16 (14):** tienen guion nuevo con voz fija (`VOZ_FIJA`, con la voz hpp4J3VqNfWAUOO0d1Us) y edición humana en `semanas/semana-N/edicion.mjs`. Los manifiestos ya apuntan a los `*_edit.mp4`.
  - ⏳ Falta la voz real. Los borradores están renderizados en silencio. Cuando haya créditos de ElevenLabs (unos 5.000 caracteres), se corre `NODE_USE_ENV_PROXY=1 ELEVENLABS_API_KEY=… sh rehacer-reels.sh`, y después se reconstruyen las agendas y los paquetes.

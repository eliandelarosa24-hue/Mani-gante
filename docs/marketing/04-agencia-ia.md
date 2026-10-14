# Agencia de IA · Red Vaeru

**Fecha:** 14 de octubre de 2026.

**Cómo se reparte el trabajo:** Jorge vende por WhatsApp y en persona; los agentes hacen el resto del marketing.

**Estados:**
- ✅ Listo: funciona hoy.
- 🟡 Activar o conectar: depende de una conexión que hace Jorge.
- 💳 Requiere cuenta o pago.

## Los agentes

| # | Agente | Qué hace | Herramientas | Frecuencia | Estado |
|---|---|---|---|---|---|
| 1 | **Director** (orquestador) | Plan semanal, prioridades, aprueba la calidad de todo lo demás y le reporta a Jorge | Esta sesión, repositorio, planilla | Semanal, el domingo | ✅ |
| 2 | **Prospector** | Busca 20 alojamientos y restaurantes nuevos al día, revisa si tienen web e Instagram y los deja priorizados en la planilla | Conector de Booking, búsqueda web, Google Sheets | Diario, de lunes a viernes a las 08:10 | ✅ (falta la aprobación de Jorge para programarlo) |
| 3 | **Asistente comercial** | Prepara el mensaje personalizado de cada prospecto, recuerda seguimientos a 3 y 7 días, arma propuesta y contrato, y agenda llamadas y visitas | Google Sheets, Google Calendar, Gmail (solo borradores) | Diario a las 09:10 | ✅ |
| 4 | **Estudio creativo** | Reels, carruseles, historias y anuncios con la marca. Voz con IA, subtítulos y música libre de derechos | Estudio propio (`marketing/studio`), Canva, Descript, HyperFrames | Semanal (lote del domingo) | ✅ imágenes y Reels · ✅ Descript (voz y subtítulos, por probar) · 💳 video con IA (Higgsfield o Runway) |
| 5 | **Publicador** | Programa en Instagram y Facebook lo que Jorge aprobó el domingo | Metricool o Postiz | Semanal | 🟡 Conectar Metricool |
| 6 | **Analista** | Lee las métricas, separa visibilidad de ventas y dice qué mantener, cambiar o detener | Metricool, planilla | Viernes a las 18:15 | ✅ rutina creada · 🟡 los datos de redes llegan con Metricool |
| 7 | **Investigador** | Mercado, temporada, competencia y programas de apoyo (Sercotec, CORFO) | Búsqueda web | Lunes a las 08:40 | ✅ rutina creada |
| 8 | **Reputación y Google** | Publicaciones en la ficha de Google, pedido de reseñas a clientes entregados, SEO local del sitio | Habilidades de SEO, TheCMO (Business Profile) | Semanal | 🟡 Vincular la ficha de Google |
| 9 | **Atención 24/7** | Responde preguntas frecuentes y cotiza en el sitio (Vaeru IA ya existe). Más adelante, los mensajes privados de Instagram | Vaeru IA en el sitio. Opcional: MyChatBot para Instagram | Siempre activo | ✅ sitio · 💳 Instagram (más adelante) |
| 10 | **Publicidad pagada** | Campañas en Meta y Google con los anuncios ya diseñados | TheCMO (Meta Ads y Google Ads) o Adspirer | Cuando haya presupuesto | 💳 |

## Reglas que respetan todos los agentes

- **Nunca hacen sin aprobación de Jorge:**
  - Publicar.
  - Escribir a un prospecto.
  - Gastar dinero.
  - Usar el nombre, la foto o el testimonio de un cliente.
- **Nada genérico:**
  - Solo material real: sitios reales, muestras rotuladas como tales y testimonios textuales.
  - Nada de fotos de stock ni ejemplos inventados.
- **Todo dato lleva su fuente y su fecha.** Una hipótesis se dice que es hipótesis.

## Orden de construcción

1. **Ahora mismo, sin conectar nada:**
   - Prospector diario (2).
   - Asistente comercial con recordatorios en Google Calendar (3).
2. **Cuando Jorge lo apruebe:** prueba de voz y subtítulos con Descript en un Reel (4).
3. **Cuando Jorge conecte Metricool:** publicación programada (5) y métricas reales (6).
4. **Con la primera venta:**
   - Dominio propio.
   - Ficha de Google con reseñas (8).
5. **Con presupuesto:**
   - Publicidad (10).
   - Video con IA (4).
   - Agente de Instagram (9).

## Estado al 14-10-2026 (tarde)

- ✅ **Prospector:** rutina activa de lunes a viernes a las 08:10. La primera corre el jueves 15.
- ✅ **Asistente comercial:** rutina activa de lunes a viernes a las 09:10, con recordatorios en Google Calendar.
- ⛔ **Voz con IA (acento chileno, femenina y masculina):** sigue pendiente.
  - **Por qué:**
    - El editor de IA de Descript no genera voces desde la conexión; solo se puede hacer dentro de su app.
    - Esta sesión tiene bloqueados en la red los servicios de voz: Microsoft (`speech.platform.bing.com`), ElevenLabs (`api.elevenlabs.io`) y Hugging Face.
  - **Proyecto de prueba en Descript:** «Red Vaeru · R01 calculadora · prueba de voz», con dos versiones (femenina y masculina) ya creadas y el guion listo.
  - **Opciones para destrabarlo:**
    1. **ElevenLabs:** la voz más natural; tiene voces de la comunidad con acento chileno. Los planes pagados permiten uso comercial. Hace falta una clave de API y permitir `api.elevenlabs.io` en la red del entorno.
    2. **Microsoft Azure Speech:** voces neuronales chilenas oficiales (Catalina y Lorenzo), con un tramo gratuito mensual. Hace falta una cuenta de Azure, una clave y permitir `*.tts.speech.microsoft.com`.
    3. **Descript, a mano:** en la app, elegir una voz de stock en español latino y pegar el guion. Después, Agent Underlord agrega los subtítulos.

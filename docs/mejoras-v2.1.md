# Versión 2.1 · Correcciones y mejoras

## Puntos débiles corregidos
| # | Problema del análisis | Solución |
|---|---|---|
| 1 | Agente sin límite de uso | Máximo 12 consultas por minuto por IP (`rateLimit` de Netlify). Si se supera, el chat pasa al modo guiado sin cortar la conversación |
| 2 | Los leads del agente se perdían | Formulario de nombre y WhatsApp dentro de cada cotización, guardado en Netlify Forms (`cotizacion`) con servicios, rango y conversación |
| 3 | Sin analítica | Capa de eventos (`src/analytics.js`): apertura del agente, cotización, PDF, lead, diagnóstico, calculadora, clics a WhatsApp y correo. Compatible con Plausible o GA4 |
| 4 | Contradicción "solo turismo" frente a los casos | Casos de turismo primero, separador "Otros rubros, misma lógica" y etiqueta en cada caso |
| 5 | Voz mezclada (nosotros / yo) | Todo en primera persona: "Soy Jorge…", "Red Vaeru es mi estudio". El agente habla de Jorge en tercera persona y nunca de un "equipo" |
| 6 | Fotos de stock | Captura real del sitio de MANI-GANTE y casos en marco de navegador. Las fotos de clientes quedan pendientes (requieren material real) |
| 7 | Resultados sin números | No se inventaron cifras. El plan de captación incluye pedirlas a los clientes |
| 8 | Precarga de 2,5 s en cada visita | Solo en la primera visita de la sesión y más corta (0,9 s) |
| 9 | Imágenes externas frágiles | Todas tienen respaldo con degradado de marca y medidas para evitar saltos. MANI-GANTE quedó alojada en el sitio |
| 10 | Una sola página | 5 páginas por servicio con contenido propio, precios desde el tarifario y datos estructurados |
| 11 | El formulario no pedía WhatsApp | WhatsApp obligatorio, correo opcional y consentimiento |
| 12 | Jerga ("OTA") | "Booking, Airbnb u otras apps" en todo el sitio y en el agente |
| — | "Sin IVA" posiblemente incorrecto | Nota tributaria neutral y editable (`TAX_NOTE`) |
| — | Capacitación y asesoría demasiado baratas | Subidas a valores más creíbles para empresas (por ejemplo, taller desde $150.000); las webs siguen desde $49.000 |
| — | Botones chicos en el celular | Chips, botones y opciones de al menos 44 px |

## 20 mejoras nuevas
1. **Páginas por servicio** (`/servicios/…`) para posicionarse en Google, con opciones, precios desde, preguntas frecuentes y enlaces a los otros servicios.
2. **Diagnóstico interactivo** "¿Qué tan independiente es su negocio?": 6 preguntas, puntaje de 0 a 100, las 3 mejoras prioritarias y captura del lead.
3. **Retorno de la inversión** en la calculadora: "un sitio desde $49.000 se paga con N reservas directas".
4. **Comparación** "Solo plataformas" frente a "Plataformas + sitio propio".
5. **Cupos de lanzamiento visibles** (quedan X de 5), con barra de avance y las condiciones explicadas. Se controlan desde `LAUNCH`.
6. **Barra de campaña de temporada** con fecha límite, que se oculta sola y se puede cerrar.
7. **Cotizador con varios servicios a la vez** en el modo guiado (web + capacitación, etc.).
8. **Cotización descargable en PDF** con marca, fecha, validez de 15 días y datos de contacto.
9. **Agendar videollamada de 15 minutos** desde el chat, con el resumen de la cotización.
10. **Invitación proactiva del agente** a los 25 segundos o a mitad de la página, una vez por sesión.
11. **Casos en marco de navegador**, con contador "01 / 06" y barra de avance del recorrido horizontal.
12. **Sección "Mis compromisos"**: precio fijo, revisión incluida, todo a su nombre, sin permanencia, respuesta en menos de 24 horas y queda capacitado.
13. **"Lo que necesito de usted"** en el método, para acortar plazos desde el inicio.
14. **Contacto con intención:** elegir qué necesita prepara el mensaje de WhatsApp con contexto.
15. **Barra de progreso de lectura** en todas las páginas.
16. **SEO técnico:**
    - canonical, Open Graph completo y nueva imagen para redes con el diseño actual;
    - `sitemap.xml` y `robots.txt` automáticos;
    - datos estructurados de negocio, FAQ, servicio y ruta de navegación.
17. **Privacidad y transparencia:**
    - política de privacidad (base Ley 21.719);
    - consentimiento en los formularios;
    - aviso de IA en el chat y pregunta frecuente sobre los datos.
18. **Páginas de gracias y 404** con el mismo diseño, y el agente disponible en ellas.
19. **Accesibilidad:**
    - foco atrapado en el cajón del agente, que al cerrarse devuelve el foco;
    - botones con `aria-pressed`;
    - las filas de servicio dejan de ser botones con enlaces adentro;
    - contraste corregido.
20. **Agente más inteligente:**
    - conoce los cupos y la nota tributaria;
    - sugiere el diagnóstico y la videollamada;
    - declara que es IA y no pide datos sensibles;
    - avisa con amabilidad si hay mucha demanda.

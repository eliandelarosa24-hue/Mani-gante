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

# Versión 2.2 · Logo real, sitios en vivo, Google Sheets e IA

1. **Logo oficial integrado** en el menú, la precarga, el chat, el botón flotante, "Sobre mí", el favicon y la imagen para redes. Se le quitó el fondo blanco y el halo claro para que se vea homogéneo sobre fondo oscuro y claro. El nombre "RED VAERU" usa la tipografía del logo y el lema "Conectando culturas" aparece en el inicio, "Sobre mí" y el pie de página.
2. **Sección "En vivo":** Cabañas Miah y Noah y El Rincón de los Poetas funcionando dentro de la página, en escritorio y celular a la vez, con sus animaciones reales. Se navegan con un clic, se cambia de sitio con pestañas y cargan solo cuando la sección se acerca, para no hacer lenta la página. En el celular solo se carga la vista móvil.
3. **Registro automático en Google Sheets:** cada contacto, cotización y diagnóstico queda como fila en una planilla (descargable como Excel), con columnas de estado y notas para usarla como CRM. Nueva función `/api/lead` con límite de uso; configuración en `docs/google-sheets.md`.
4. **Nueva línea de servicio "Automatización e IA":** agentes de IA 24/7, registro de reservas en Google Sheets, mensajes automáticos a huéspedes y el plan "Hospitalidad inteligente". Tiene su propia página, aparece en la página principal, en Vaeru IA y como extra de los sitios para alojamientos.
5. **Boleta o factura:** los textos de precios, las preguntas frecuentes y el agente indican que se emite boleta o factura según lo que necesite el cliente.

# Versión 2.3 · Dominio de regalo, 10 muestras y mejoras

## 10 muestras de concepto (`/muestras/`)
Sitios completos para negocios ficticios, cada uno con identidad propia (tipografías, colores y estilo):
1. **Tierra Pehuén Lodge** (lodge de montaña, Malalcahuello): suites, experiencias con filtros, reserva con calendario y extras.
2. **Cabañas Lago Azul** (cabañas familiares, Villarrica): cotizador de estadía con tinaja, desayuno y late check-out.
3. **Domos Cielo Austral** (glamping de astroturismo, Curarrehue): fase lunar real calculada en vivo y experiencias astronómicas.
4. **Hotel Casa Nogal** (hotel boutique patrimonial, Valdivia): habitaciones y carta del restaurante con pestañas.
5. **Villa Coral Samaná** (villas en el Caribe, República Dominicana): precios en dólares y tours por tipo.
6. **Fogón Mapu** (restaurante de autor, Temuco): carta interactiva, menú degustación y reserva de mesa por horario.
7. **Kuchen Haus** (café y pastelería, Frutillar): carta y pedidos de kuchen enteros con despacho.
8. **Pucón Aventura** (operador de turismo aventura): tours filtrables por nivel, seguridad, agenda y reserva por salida.
9. **Viña Los Robles** (enoturismo, Colchagua): catas por niveles, catálogo de vinos y reserva de visita.
10. **Destino Licán Ray** (portal de una cámara de turismo): directorio de socios, agenda de eventos e información útil.

Todas incluyen galería con visor, reseñas ilustrativas, mapa, preguntas frecuentes, WhatsApp flotante y un aviso que explica que es una muestra, con un botón "Quiero un sitio así". Cada imagen se puede reemplazar por una propia (Gemini) sin tocar código (`docs/imagenes-muestras.md`).

## 10 mejoras al sitio
1. **Dominio de regalo y hosting el primer año** en todos los sitios: franja "Incluido", opciones de cada página de servicio, preguntas frecuentes y agente.
2. **Sección "Muestras"** en la portada y **galería** `/muestras/`, con filtros por rubro.
3. **Calculadora con modo restaurante**: comisiones de las apps de delivery (PedidosYa, Uber Eats) y retorno de la inversión.
4. **Precios en CLP o USD** (para clientes del Caribe), con tipo de cambio editable (`USD_RATE`).
5. **Barra inferior fija en el celular**, con WhatsApp y "Cotizar con IA".
6. **Vaeru IA recomienda la muestra** más parecida al negocio del cliente.
7. **Navegación instantánea**: las páginas se precargan cuando el visitante pasa el cursor por un enlace.
8. **Carga diferida del chat** de la sección Vaeru IA (portada más liviana).
9. **Manifiesto web**: se puede instalar en el celular con el logo de Red Vaeru.
10. **Encabezados de seguridad**: nadie puede mostrar el sitio de Red Vaeru dentro de otro sitio, más permisos restringidos y HTTPS estricto.

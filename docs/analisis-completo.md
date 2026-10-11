# Análisis completo · Red Vaeru 2.0

*Octubre 2026 · Revisión del sitio en escritorio (1440 px) y celular (390 px, CPU limitada ×4), código, precios y estrategia comercial.*

## Veredicto en una frase
**Visualmente el sitio ya juega en otra liga; lo que falta es lo que ningún diseño reemplaza: pruebas reales, un sistema para traer clientes y la medición de resultados.** El sitio está listo para impresionar, pero todavía no para vender solo.

---

## 1. Puntos fuertes

1. **Primera impresión premium.** La serif Fraunces, el dorado y el fondo topográfico animado comunican calidad desde el primer segundo. Ya no se ve "básico".
2. **Nicho claro.** "Turismo y hospitalidad, del Caribe al sur de Chile" es una posición que las agencias chilenas generalistas no tienen. Las búsquedas no encontraron competencia especializada en la región.
3. **Calculadora de comisiones.** Es la mejor herramienta de venta del sitio: convierte un dolor abstracto (la comisión) en un número concreto del negocio del visitante.
4. **Vaeru IA.** Ningún competidor local tiene un cotizador conversacional. Funciona aunque falle la IA (modo guiado), no inventa precios (usa el tarifario) y termina en WhatsApp, donde realmente se cierra en Chile.
5. **Conversión en todas partes.** Hay un camino a la cotización en el menú, el inicio, cada servicio, los casos, las dudas, el contacto y el botón flotante.
6. **Mensajes de confianza bien elegidos:** precio fijo por escrito antes de pagar, revisión incluida, respuesta en menos de 24 horas, "habla con quien construye", testimonios reales.
7. **Tono "usted".** Es correcto para dueños de cabañas y hostales del sur, un público mayoritariamente adulto y tradicional.
8. **Base técnica sólida:** tarifario en un solo archivo, pruebas automáticas, sin errores de JavaScript, sin desbordes horizontales, respeta "reducir movimiento" y el formulario de Netlify ya está integrado.

---

## 2. Puntos débiles (de más a menos grave)

| # | Problema | Por qué importa | Gravedad |
|---|---|---|---|
| 1 | **El agente no tiene límite de uso** | Cualquiera puede llamar `/api/agent` miles de veces y generar costos en su cuenta de Anthropic | 🔴 Alta |
| 2 | **Las conversaciones del agente no se guardan** | Si el visitante cotiza pero no toca "Enviar por WhatsApp", usted nunca se entera. Se pierden leads | 🔴 Alta |
| 3 | **No hay analítica** | No sabrá cuántas personas entran, cuántas cotizan ni de dónde vienen. Sin datos no se puede mejorar | 🔴 Alta |
| 4 | **Contradicción en el mensaje** | "Nosotros" dice "Solo turismo, nada de ferreterías", pero 2 de los 4 casos son un maní y una tienda de pulseras. Un visitante atento lo nota | 🟠 Media |
| 5 | **Voz mezclada: "nosotros" y "soy Jorge"** | Parece una agencia, pero es una persona. Si el cliente lo descubre después, se siente engañado. La honestidad de "una sola persona" era una fortaleza del sitio anterior | 🟠 Media |
| 6 | **Fotos de stock y sin foto suya** | El sitio promete "diseño desde su territorio" y muestra fotos genéricas. En servicios personales, la gente le compra a una cara | 🟠 Media |
| 7 | **Resultados sin números** | "Canal propio activo" no convence tanto como "12 reservas directas en el primer mes" | 🟠 Media |
| 8 | **Precarga de 2,5 s en cada visita** | En escritorio el contenido principal aparece a los 2,7 s, casi todo por la animación de entrada. Quien vuelve al sitio no necesita verla de nuevo | 🟡 Baja |
| 9 | **Imágenes enlazadas desde otros sitios** | 9 imágenes dependen de Unsplash y de los sitios de sus clientes. Si alguno cambia o cae, el portafolio queda con huecos | 🟡 Baja |
| 10 | **Una sola página** | Google no puede posicionarla para "página web para cabañas en Pucón" ni "capacitación servicio al cliente Temuco" | 🟡 Baja (crece con el tiempo) |
| 11 | **El formulario exige correo y no pide WhatsApp** | En Chile, el dueño de una cabaña responde antes por WhatsApp que por correo | 🟡 Baja |
| 12 | **Lenguaje técnico** | "OTA" aparece en la calculadora. Muchos dueños no conocen la sigla | 🟡 Baja |

**Ya corregido en esta revisión:** los títulos animados se leían "Hospitalidad quese reserva" en lectores de pantalla, y el texto dorado pequeño sobre fondo crema no cumplía el contraste mínimo (4,1:1; ahora 5,4:1).

---

## 3. Análisis por área

### 3.1 Diseño
- **Bien:** el contraste entre secciones oscuras y crema da ritmo. La jerarquía tipográfica es clara y la marca (palmera + araucaria) por fin tiene presencia.
- **Mejorar:**
  - **Fotos reales.** Haga una salida fotográfica de un día a Cabañas Miah y Noah y a El Rincón de los Poetas, y tómese un retrato en la Araucanía. Eso vale más que cualquier animación.
  - **Capturas de los sitios entregados** en un marco de celular o laptop. Hoy los casos muestran una foto suelta y no el trabajo en sí.
  - **Antes y después:** cómo se veía el negocio sin sitio (solo Booking o Instagram) y cómo se ve ahora.
  - **Video corto del agente** (10 s, en bucle) en la sección Vaeru IA, para quien no quiere escribir.
  - El collage del inicio se ve bien en escritorio, pero en celular queda muy tenue (35% de opacidad). Conviene una imagen protagonista en el celular.

### 3.2 Fluidez y rendimiento
| Medición | Escritorio | Celular (CPU ×4) |
|---|---|---|
| Carga completa | 2,3 s | 1,7 s |
| Contenido principal visible (LCP) | 2,7 s | 1,2 s |
| JavaScript | 159 KB (60 KB comprimido) | igual |
| CSS | 27 KB (7 KB comprimido) | igual |

- La animación de entrada se ve bien, pero frena. **Recomendación:** mostrarla solo en la primera visita de la sesión y acortarla a unos 1,2 s.
- El desplazamiento horizontal de los trabajos es vistoso, pero largo. Conviene un indicador de avance ("2 / 5") para que no se sienta "trabado".
- Algunos botones del chat y del menú miden menos de 40 px de alto en el celular. Hay que subirlos a 44 px para que se toquen sin errores.
- Imágenes: alojarlas en el propio sitio en WebP o AVIF, con tamaños para celular. Bajaría el peso y eliminaría la dependencia de sitios externos.

### 3.3 Contenido y confianza
- **Unificar la voz.** Recomiendo ser honesto: *"Red Vaeru es el estudio de Jorge Vásquez"*, en primera persona ("yo diseño, yo lo capacito"). Con precios de lanzamiento, "una persona dedicada" es un argumento a favor, no en contra.
- **Ordenar los casos:** "Turismo" (Miah y Noah, Rincón de los Poetas) primero, y luego "Otros rubros, misma lógica de canal propio" para MANI-GANTE y Mis Recuerditos. Así se resuelve la contradicción.
- **Pedir números a sus clientes:** reservas directas del último mes, mensajes por WhatsApp o ahorro en comisiones. Con un solo dato real, el caso se multiplica en fuerza.
- **Más testimonios, con foto y nombre completo** (con permiso). Ideal: un video de 20 segundos de Nicole.
- **Credenciales:** INACAP, cursos o certificaciones en servicio al cliente. Para vender capacitaciones a empresas, esto es indispensable.

### 3.4 Precios
- **Lanzamiento desde $49.000: la estrategia es correcta**, pero hay que protegerla:
  1. **Cupos limitados.** Por ejemplo: "Precios de lanzamiento para los primeros 5 alojamientos". Crea urgencia real y le da una fecha de salida para subir precios sin incomodidad.
  2. **Condiciones a cambio del precio:** testimonio escrito, permiso para mostrar el sitio, fotos y algún dato de resultados. El precio bajo debe "comprar" su portafolio.
  3. **Alcance cerrado por escrito:** número de secciones, una ronda de revisión y contenido entregado por el cliente. A $49.000, un proyecto con cambios infinitos le cuesta dinero.
  4. **Pago:** anticipo para empezar y saldo al publicar. La propuesta debe decirlo claramente.
- **Capacitaciones y asesorías: no conviene llevarlas tan abajo.** Un taller de 4 horas a $90.000 puede parecer poco serio para un hotel o una empresa. A los compradores corporativos los convence más un precio coherente con el valor y una prueba piloto. Sugerencia: haga 1 o 2 talleres piloto, gratis o con descuento, con negocios conocidos para obtener testimonio, y después cobre precio normal.
- **"Sin IVA" puede estar mal planteado.** Si factura como persona natural con boleta de honorarios, lo que corresponde es la retención de honorarios, no el IVA. Defina si sus precios son brutos o líquidos y confírmelo con un contador o en el SII antes de publicar.
- **Plan de subida:** con 5 casos publicados, suba alrededor de 30%; con 10 casos y testimonios con números, acérquese al mercado ($300.000 o más por un sitio completo).

### 3.5 Vaeru IA
- **Urgente:**
  - **Límite de uso por IP** en la función de Netlify, para evitar abuso y costos.
  - **Guardar cada cotización como lead:** que el agente pida nombre y WhatsApp antes o después de cotizar, y le envíe el resumen a su correo, por ejemplo vía Netlify Forms.
- **Costo:** el agente usa Claude Opus 5.5, el modelo más capaz. Si el volumen crece, Claude Haiku 5.5 cuesta alrededor de 40 veces menos por mensaje; se cambia con la variable `CLAUDE_MODEL`, sin tocar código. La decisión es suya: calidad o costo.
- **Mejoras:**
  - Que el modo guiado permita sumar varios servicios en una sola cotización.
  - Que el agente ofrezca agendar una videollamada de 15 minutos (con Calendly o Google Calendar).
  - Que entienda "mi cabaña en Pucón con 4 unidades" y personalice la calculadora de comisiones dentro del chat.
- **Transparencia:** un aviso breve de que es un asistente de IA y que la conversación se procesa para responder (ver la parte legal).

### 3.6 Cómo llegar al cliente (lo más importante)
Un sitio no trae clientes por sí solo; es la vitrina. El tráfico hay que generarlo.

**Cliente ideal:** dueño de cabañas, hostal o glamping en la Araucanía y Los Ríos (Pucón, Villarrica, Curacautín, Malalcahuello, Lican Ray, Coñaripe, Temuco) que vende solo por Booking, Airbnb o Instagram, y no tiene sitio propio o tiene uno muy viejo.

**Canales, en orden de impacto:**
1. **Prospección directa con maqueta.** Arme una lista de 50 alojamientos sin sitio (Google Maps, Booking, Airbnb). Para los 10 más prometedores, haga una maqueta rápida de la portada de *su* sitio y envíela por WhatsApp junto con el cálculo de lo que pagan en comisiones. Es la táctica de mayor conversión para estudios pequeños.
2. **Campaña de temporada (ahora mismo).** Estamos en octubre y la temporada alta del sur es diciembre a febrero. Mensaje: *"Su sitio listo antes del verano: reservas directas desde la primera semana de enero"*. Después de marzo este argumento pierde fuerza.
3. **Google Business Profile** de Red Vaeru, con fotos, servicios y reseñas de sus clientes. Es gratis y aparece en búsquedas locales.
4. **Alianzas:** cámaras de turismo locales (Pucón, Villarrica), oficinas municipales de turismo, SERNATUR Araucanía y la red de INACAP (vinculación con el medio, prácticas). También conviene revisar los programas de digitalización de Sercotec y CORFO: algunos financian sitios para pymes y usted puede ser el proveedor.
5. **Contenido en Instagram, TikTok y LinkedIn:** antes y después, reels con la calculadora de comisiones ("¿cuánto le paga a Booking?") y consejos para anfitriones. Un formato fijo semanal.
6. **Referidos:** un descuento o regalo (por ejemplo, un mes de mantención) por cada cliente recomendado.
7. **Caribe:** use su red dominicana, cotice en USD y aproveche la diferencia de temporadas: la temporada alta del Caribe es en el invierno del hemisferio norte.

**Oferta de entrada sin riesgo:** "Diagnóstico gratuito de 15 minutos: le digo cuánto le cuesta Booking y qué mejorar primero". Abre conversaciones sin pedir dinero.

### 3.7 Comunicación
- **Mantener el "usted"** y evitar siglas: "plataformas como Booking o Airbnb" en vez de "OTA".
- **Mensajes de WhatsApp listos** para primer contacto, seguimiento a 3 días, envío de propuesta y pedido de testimonio.
- **Propuesta tipo** (página web o PDF) con su marca: alcance, plazos, precio, condiciones y forma de pago. La propuesta también vende.
- **Lista de bienvenida** para el cliente: qué fotos, textos y accesos necesita. Así acorta plazos y evita que el proyecto se estanque.
- **Correo profesional** (contacto@redvaeru.cl) en vez de Gmail, en cuanto tenga dominio.

### 3.8 SEO (aparecer en Google)
- **Lo básico que falta:** dominio propio (redvaeru.cl), `robots.txt`, `sitemap.xml`, etiqueta canónica, `og:image` con URL completa y una imagen para redes con el diseño nuevo (la actual es del sitio anterior). También datos estructurados de preguntas frecuentes (FAQPage).
- **Páginas por servicio y ciudad:** "Páginas web para cabañas en Pucón", "Capacitación en servicio al cliente en Temuco", etc. Cada una es una puerta de entrada desde Google.
- **Artículos útiles para anfitriones:** "Cómo dejar de depender de Booking", "Cuánto cobra Airbnb en Chile", "Checklist de fotos para su cabaña". Atraen exactamente a su cliente.

### 3.9 Técnico y legal
- **Protección de datos:** la Ley 21.719 de protección de datos personales entra en vigencia en diciembre de 2026. El formulario y el chat recogen datos, y el chat los envía a un proveedor de IA. Hace falta una política de privacidad breve, un aviso en el formulario y en el chat, y consentimiento. Valídelo con alguien del área legal.
- **Analítica respetuosa:** Plausible o Netlify Analytics (sin cookies) o GA4, midiendo estos eventos: cotización generada, clic en WhatsApp y formulario enviado.
- **Publicación:** la rama aún no está unida a la principal ni desplegada en Netlify. Falta configurar la clave de API y el dominio.
- **Orden:** el repositorio se llama "Mani-gante" pero contiene Red Vaeru. Conviene renombrarlo a `red-vaeru` para evitar confusiones.

---

## 4. Plan de acción priorizado

### Esta semana (antes de publicar)
1. Límite de uso del agente y registro de leads de Vaeru IA (correo y Netlify Forms).
2. Analítica con eventos de conversión.
3. Unificar la voz (primera persona) y reordenar los casos (turismo primero, otros rubros aparte).
4. Campo de WhatsApp en el formulario; cambiar "OTA" por lenguaje simple.
5. Precarga solo en la primera visita; botones de 44 px en el celular.
6. Definir boleta o factura y brutos o líquidos; ajustar la frase "sin IVA".
7. Cupos de lanzamiento y condiciones (testimonio y permiso de publicación) en el sitio y en la propuesta.
8. Publicar en Netlify con dominio propio.

### Este mes
9. Fotos reales: su retrato y los alojamientos de sus clientes. Imágenes alojadas en el sitio.
10. Pedir números y testimonios en video a Nicole y al equipo de MANI-GANTE.
11. Google Business Profile, `robots.txt`, `sitemap.xml`, canónica e imagen para redes nueva.
12. Política de privacidad y avisos.
13. Campaña "Su sitio listo antes del verano": lista de 50 prospectos y 10 maquetas.

### Próximos 3 meses
14. Páginas por servicio y ciudad, y 4 artículos para anfitriones.
15. Agendamiento de videollamadas desde el agente; modo guiado con varios servicios.
16. Talleres piloto de servicio al cliente con testimonio, y luego precio normal.
17. Revisar precios al llegar a 5 casos publicados.

## 5. Qué medir cada mes
| Indicador | Meta inicial |
|---|---|
| Visitas al sitio | Línea base el primer mes |
| Cotizaciones generadas en Vaeru IA | 10% de las visitas |
| Clics a WhatsApp más formularios | 3–5% de las visitas |
| Conversaciones que pasan a propuesta | 30% |
| Propuestas aceptadas | 30–40% |
| Proyectos publicados con testimonio | 100% de los proyectos de lanzamiento |

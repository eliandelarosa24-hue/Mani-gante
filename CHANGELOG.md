# Changelog · MANI-GANTE

## v4.5 · Fluidez, glosario y experiencia completa (catálogo 2026.10.6)
Diseño visual intacto: mismos colores, fuentes, tokens, ilustraciones y estructura de salas. Voz siempre en plural (la familia): los puntos del pedido que nombraban a una persona se resolvieron como "la casa".

**Pedido directo**
- Las 3 rayitas del menú quedan centradas (el botón no centraba su contenido).
- El botón del Consigliere respira: más espacio entre título y subtítulo. Ahora dice "Habla con el Consigliere · El asistente de la casa · 24/7", siempre visible.

**Bloque 1 · Flujo**
1. La puerta sigue solo en la primera visita, pero ahora es un micro-ritual: se abre sola a los 4 s (antes, 8 s).
2. y 8. El salón tiene un solo botón principal, "Ver la Bolsa de hoy" (oro). El secundario es "Descubre tu sabor" y el tercero, un enlace: "o agenda tu entrega en el campus".
3. Navegación: La Receta · La Bolsa · El Maletín · La Cita · La Familia (también en el menú del celular, el pie y el índice de capítulos).
4. El maletín siempre a la vista. En pantallas grandes la barra dice "Tu maletín · 3 bolsas · $3.000"; en el celular, la barra inferior muestra bolsas y cuenta.
5. La Cita en un solo panel, en orden: día → hora → punto → maletín → pago → nombre → ticket → WhatsApp.
6. Sincronización Maletín ↔ Cita: en el ticket de la cita se suma o se quita con +/−, y el maletín cambia al instante (y al revés).
7. Estados de stock: "En circulación · disponible esta semana", "Últimas unidades" (cuando el inventario por lotes del panel dice que quedan 5 o menos) y "Se acabó esta semana", con "Avísame cuando vuelva".
9. Fichas con progressive disclosure: ficha, nombre, estado y precio. El alias, las notas y el maridaje están en la vista rápida.
10. La vista rápida permite sumar, cambiar formato, ver "Va bien con…", leer el tip de la casa, "Agendar una cita con este" y "Mi antojo de hoy".
11. Cuando no estamos en el campus: "Deja tu pedido para cuando volvamos" y "Habla con el Consigliere", en la tarjeta del salón y en el aviso de ausencia.
12. Al sumar: vuelo al maletín, toast corto con voz de la casa ("Maracuyá, al maletín. ¡Chévere!") y vibración breve.

**Bloque 1 · Terminología**
13. El Maletín (pedido) · La Cuenta (total) · El Ticket (reserva), en la web, el Consigliere y los mensajes de WhatsApp.
14. "Pasar el interrogatorio" pasa a "Descubre tu sabor" / "El test de la casa".
15. "Habla con el Consigliere" + "El asistente de la casa · 24/7".
16. "Ficha 01 · Maracuyá": el alias solo en la vista rápida y en la página del sabor.
17. Formatos consistentes: El Clásico ($1.000) y La Reserva ($1.500).
18. "En circulación" con el apoyo "disponible esta semana".
19. La Cita con subtítulo: "Reserva tu entrega en el campus" y "Agendar con la casa".
20. Botones "Sumar al maletín" y "Cerrar el trato por WhatsApp".
21. "La línea japonesa · Del otro lado de la familia".
22. CTA final de la cita: "Enviar el ticket por WhatsApp".
23. Live-pill: "Estamos en el campus" / "Volvemos el miércoles a las 08:00".
24. "La letra chica" pasa a "Cómo funciona el trato".

**Bloque 1 · Sistema**
25. Glosario oficial: `GLOSSARY` en `js/catalog.mjs` (lo lee el Consigliere) y `docs/glosario.md`.
26. Errores y vacíos con voz de la casa: maletín vacío, búsqueda sin resultados, sin señal, Mis pedidos vacío.
27. y 34. Primera vez en la casa: a los 3 s, una invitación no bloqueante a un recorrido de 4 pasos (Bolsa → Maletín → Cita → Trato), que se puede saltar. Aparece una sola vez.
28. El @mani_gant aparece en el ritual, en la tarjeta "Mi antojo de hoy" (con el 10 % por etiquetar) y en el cierre de los Reels.
29. Jerarquía de botones: oro = comprar/reservar, verde = cerrar el trato, borde = explorar. El botón de cita de la tarjeta del salón pasó a oro.
30. Analytics: `funnel_first_add` (ms hasta el primer "Sumar") y `funnel_whatsapp` (llegó a WhatsApp desde el maletín o la cita), además de `share_antojo`, `ritual_show`, `tour`, `feedback` y `qr_scan`.

**Bloque 2 · Experiencia completa**
31. y 40. Ritual post-pedido: después del sobre y el lacre aparece una tarjeta de marfil con el resumen, "Tu antojo ya va camino a la casa", el tip de disfrute del sabor y el cierre "Gracias por confiar en la receta de la familia. Que lo disfrutes. — La Familia". No bloquea la página.
32. Unboxing digital: al abrir el maletín, la tapa se abre y los sabores salen uno a uno (sin movimiento con "reducir movimiento").
33. Maridajes de campus por categoría ("Va bien con: el estudio nocturno, la once de la tarde…") en la vista rápida, en la página del sabor y en el Consigliere.
35. Estado del ticket en vivo en Mis pedidos (Recibido → Preparando → Entregado), según lo que la casa marque en el panel. `GET /api/reserve?code&date` entrega solo el estado, sin datos personales.
36. "Mi antojo de hoy": tarjeta 1080×1920 con la bolsa, la ficha, el alias y @mani_gant, lista para la Story (comparte nativo o descarga).
37. "¿Cómo estuvo el [sabor]?": 24 h después de un pedido, 3 reacciones rápidas. La respuesta le llega a la casa como evento `feedback` en el panel.
38. Ediciones de la semana: insignia "Edición de la semana" + "Solo esta semana · cuando se acabe, se acabó". Se activa poniendo el id en `WEEKLY_EDITION` (`js/catalog.mjs`). Viene vacío para no anunciar algo que no es cierto.
39. Puente físico-digital: `npm run qr` genera `design/qr/etiquetas-qr.html`, una hoja A4 con 33 etiquetas QR. Cada QR abre la ficha del sabor (`/sabor/:id?qr=1`) con bienvenida, tip de la casa y "Va bien con".

**Bloque 3 · Rendimiento y nitidez**
- **Capas compuestas:** de 323 a 100. El 3D de la inclinación de las fichas solo se activa con el puntero encima; antes creaba una capa por cada pieza de cada ficha, también en el celular.
- **Animaciones infinitas** (brillos dorados, pulsos, rosetas): se pausan cuando su sala sale de la pantalla.
- **Medición con CPU 4× más lenta** en celular, en las mismas condiciones que v4.4.5:
  - mediana de cuadro: 16,7 ms (antes, 33 ms);
  - tirones: ~24 (antes, ~38);
  - repintado y armado de capas: −40 %.
- **Fotos con `srcset` (800w/1600w) y `sizes`:** retina y 4K reciben las de 1600 px y las pantallas chicas las de 800 px. Las bolsas son vectoriales y se ven nítidas a cualquier tamaño.
- **CLS:** 0 en celular y ≤ 0,08 en tablet/escritorio. La tarjeta "Parte del día" reserva su alto mientras carga.
- **Táctil:** todos los controles miden ≥ 44 px; solo quedan los enlaces dentro de una frase, que son una excepción válida.
- **Pantallas revisadas:** 375, 390, 414, 768, 1024, 1280×720 (720p), 1440, 1920 y 4K, sin scroll horizontal.
- 70 pruebas Playwright + axe WCAG 2.2 AA. Service worker `mg-v4.5-2026.10.6`.

## v4.4.5 · Adorno centrado
- El adorno de rombos bajo el título de cada sección va centrado en todas las salas, y su animación crece desde el centro.

## v4.4.4 · Revisión a fondo en celular
Recorrido completo en dos teléfonos (iPhone 390 px y Android 360 px), con animaciones encendidas y en los temas Noche y Marfil: secciones, textos cortados, desbordes, imágenes, consola, y todos los flujos (menú, ficha, cuenta, cita, maletín, ruleta, interrogatorio, consigliere, preguntas, galería, pago, telegrama) más las páginas secundarias.
- **Cita:** al confirmar, el ticket queda a la vista (antes la página saltaba al Diario en el celular). Prueba de regresión.
- **Maletín:** "Sorpréndeme" y "Agregar maletín" se apilan en pantallas chicas (el texto se cortaba).
- **Botones en celular:** menos relleno para que ningún texto se corte ("Mis pedidos", "Agregar · $1.000"). El precio de la ficha puede ir en dos líneas.
- **Tarjetas de pago:** en pantallas táctiles el aviso "Copiar datos" queda siempre visible.
- **Páginas secundarias:** el logo y el botón del encabezado ya no se pisan; la 404 no se desborda; "La receta" y la 404 hablan como la familia ("Lo queremos entero y parejo…", "¿Te presentamos a tres?").

## v4.4.3 · Pantalla de carga y tipografía legible
- **Pantalla de carga en cada visita** (antes salía una sola vez por sesión): medalla con anillo grabado que gira, eslogan, contador 0→100 % y un telón de terciopelo que se abre. Dura al menos 1,5 s para leerse y nunca más de 2,6 s. En la primera visita sigue saliendo la puerta.
- **Títulos legibles:** Bodoni Moda usa el tamaño óptico 20 en toda la web. En los títulos grandes, los trazos finos ya no desaparecen: la "t" no se confunde con la "l" ni la "e" con la "c".
- **Sin letras cortadas:** las máscaras de animación del salón y de los títulos dejan espacio para las colas de la g, la y y la p.

## v4.4.2 · Tarjetas de pago visibles y nuevo nombre de ejemplo
- **Arreglo:** las tarjetas de "Así se cierra el trato" quedaban invisibles con animaciones activas, porque dos entradas distintas (revelado + GSAP) se pisaban. Ahora usan una sola animación con destino explícito, y lo mismo vale para el maletín, la invitación y el telegrama.
- **Nombre de ejemplo:** "Ej: Chiqui", un apodo popular en República Dominicana y en Chile, en lugar de un nombre real.

## v4.4.1 · Red Vaeru y días de reserva (catálogo 2026.10.6)
- **Red Vaeru** tiene su descripción real: construye el potencial de los alojamientos turísticos de La Araucanía con una presencia digital que es toda una experiencia, desde la primera mirada hasta el pago y la llegada. La etiqueta pasó de "Fundador también de" a "Creadores también de".
- **Martes y viernes** (08:00–12:30): se aclara que esos días no llevamos maní para venta suelta y que solo entregamos reservas, que se pueden hacer cualquier día. Se ve en la cita, en los puntos de venta, en la letra chica y en el consigliere.
- El formulario de opiniones ya decía el nombre de ejemplo y "Tu telegrama para la casa" desde la v4.4.

## v4.4 · La experiencia de la Casa (2026-10-10)

**La casa habla en plural**
- Toda la web habla como **nosotros, la familia**, y suma a quien compra ("desde la primera bolsa, tú también eres de la familia"). Ya no se nombra a una persona: "Pide tu cita con la casa", "Estamos en el campus", "Escríbenos", "Dónde encontrarnos".
- El Diario de la Casa lo firma **La Familia**. El consigliere (IA), los mensajes del servidor, las alertas de reposición y los links de WhatsApp también hablan en plural.
- El único nombre propio que queda es el del **titular de las cuentas** en "Cómo pagar", porque el banco lo exige.
- Nombre de ejemplo en los formularios (cambiado en la v4.4.2 a **Chiqui**).

**Sin la rayita**
- Se quitó la línea delante de los textos chicos (eyebrows). En el salón, entre "Casa Mani-Gante" y "Confitería de autor", queda un rombo art déco.

**Inmersión de principio a fin** (todo con animación propia; con "reducir movimiento" o en pantallas táctiles la página queda igual de completa)
1. **Desplazamiento suave** (Lenis, alojado en el sitio) en computadores. Medido con rueda real y CPU 4× más lenta: 6–7 tirones contra 19–20 del scroll nativo. Se desactiva solo cuando hay algo abierto encima (la cuenta, un diálogo o la puerta).
2. **Cursor de la casa:** un anillo dorado acompaña al puntero y cambia según lo que hay debajo: "Ver ficha", "Mirar", "Entrar", "Suerte", "Copiar" y "Pruébame".
3. **Profundidad del salón:** la roseta, el halo, la bolsa y el titular se mueven a distintas distancias según el puntero.
4. **Luz del día:** el salón cambia de luz según la hora en Temuco (mañana dorada, tarde ámbar, noche azul profundo).
5. **Bienvenida personal:** "Buenas tardes, *Chiqui*. Qué bueno tenerte de vuelta en la casa." Usa el nombre de la última reserva, solo en este teléfono.
6. **Numerales de capítulo:** un I…IX grabado gigante detrás de cada sala, que viaja más lento que el contenido.
7. **El recorrido** (I Elegir · II La cuenta · III La cita · IV El trato) en la cuenta y en la cita. Avanza solo.
8. **La ceremonia:** al cerrar un pedido o una cita aparece un sobre de marfil, sale la tarjeta "Trato hecho · Ya eres de la familia, Chiqui" y cae el lacre MG.
9. **Sonidos de la casa** (WebAudio, sin archivos): apagados por defecto; se encienden con el parlante del menú. Suenan un tintineo al agregar, el golpe del lacre más un acorde al cerrar el trato y un clic suave en los filtros.
10. **El Diario se lee solo:** la cita del Diario se enciende palabra por palabra mientras bajas.

**Calidad**
- 64 pruebas Playwright pasan (se sumaron voz en plural sin nombres, sin rayita, recorrido, bienvenida y ceremonia). También pasa axe WCAG 2.2 AA en Noche y Marfil.
- Service worker `mg-v4.4-2026.10.10`.

## v4.3 · 10 mejoras hacia la perfección (catálogo 2026.10.5)

**Pedidos de Jorge**
- **Horario:** martes y viernes de **08:00 a 12:30**, solo con reserva. La web pide avisar con anticipación (ideal el día anterior) en "Dónde encontrarme", en la invitación y en las preguntas frecuentes.
- **Red Vaeru** (nombre corregido) con su link y una **ventana en vivo**: el sitio real en un monitor de época que se recorre solo, carga al acercarse y se pausa con el mouse.

**Las 10 mejoras** (todas con animación propia y respetando "reducir movimiento")
1. **Reloj en vivo** en el Parte del día ("Faltan 3 d 16 h", "En el campus · cierra en 45 min"). Los números cambian con animación y el día de hoy queda resaltado en la semana de la casa.
2. **Lo de siempre:** quien ya compró ve su último pedido y lo repite en un toque.
3. **La Ruleta de la Casa:** tragamonedas sobre fieltro para indecisos. Tres rodillos que frenan escalonados en el mismo sabor, que luego se agrega en un toque.
4. **Índice de capítulos** (I…IX) en pantallas anchas, con barra de progreso dorada y nombre al pasar el mouse.
5. **Vista rápida deslizable:** flechas, teclado (←/→) y gestos para recorrer los sabores. En el celular es una hoja inferior que se cierra deslizando hacia abajo.
6. **"Mándaselo a tu pana":** compartir la ficha del sabor (menú nativo de compartir, copiar link o WhatsApp) con su imagen.
7. **Invitación inteligente:**
   - propone la hora con más cupos;
   - recuerda el punto de encuentro;
   - avisa en los días "solo reservas" y en los pedidos de 10 bolsas o más.
8. **En racha:** insignia con brillo en los 3 sabores más agregados o vistos de la semana. Usa datos reales (mínimo 5 interacciones) y no redibuja la tienda.
9. **Búsqueda que perdona:**
   - ignora tildes;
   - tolera errores de tipeo ("pistaco");
   - entiende sinónimos ("fresa", "chinola", "picante");
   - sugiere "¿Quisiste decir…?".
10. **Instalar la casa en el teléfono** (desde la segunda visita o después de pedir; con instrucciones para iPhone) y **aviso de conexión**, que actualiza el stock al volver la señal.

**Calidad**
- 60 pruebas Playwright pasan: se sumaron las de búsqueda, ruleta, vista rápida, reloj y "lo de siempre". También pasa axe WCAG 2.2 AA.
- Se quitó `content-visibility` porque confundía la hit-testing. El scroll sigue a 60 fps; la peor pausa medida es de 117 ms.

## v4.2 · Logo oficial, horario real y velocidad (catálogo 2026.10.4)

**Marca**
- **Logo oficial:** la etiqueta de las bolsas va en cada bolsa ilustrada, sobre la anilla dorada.
- **Íconos nuevos:** versión compacta (elefante + MANI-GANTE) para la app, la navegación y la pantalla de carga.
- **Eslogan igual a la etiqueta:** "Para gente **elegante y gánster**", en la web, el SEO, las imágenes para compartir y el agente.
- **33 alias nuevos con jerga dominicana**, que dicen a qué sabe cada uno. Algunos ejemplos:
  - La Chinola (maracuyá)
  - La Patilla (sandía)
  - Morir Soñando (naranja)
  - La Mamajuana (pasa al ron)
  - El Sancocho (mix)
  - El Mangú (leche con plátano)
  - La Greca (mocaccino)
  - El Amanecío (cappuccino)
  - Tostón de Gala (plátano con chocolate)
  - El Chimi (japonés barbecue)

**Horario y puntos de venta**
- **INACAP:** miércoles 08:00–18:30 y jueves 08:00–17:00 recorriendo el campus. Martes y viernes, solo reservas.
- Las citas solo ofrecen esos días. El estado en vivo dice "Hoy solo con reserva" cuando corresponde.
- **Liceo Bicentenario James Mundell** (lunes a viernes) agregado como punto de venta, en la web, las preguntas frecuentes y el agente.
- Nueva pregunta frecuente sobre pedidos grandes (10 bolsas o más).

**Contenido**
- 8 fotos nuevas del producto real en la galería, "La receta", "El Diario" y la vista rápida. Se quitaron las fotos antiguas que ya no se usaban.
- **Instagram en vivo** (`/api/instagram`): publicaciones e historias con caché de 10 minutos y renovación automática del token. Las destacadas no son posibles por la API de Instagram.
- **Red Vaeru** en "El Jefe" y en el pie. El link queda pendiente, se configura en `BUSINESS.ventures`.

**Rendimiento** (medido con el procesador 4 veces más lento)

| | Antes | Después |
|---|---|---|
| Elementos en la página | 23.800 | 2.090 |
| Cuadros trabados al hacer scroll | 115 | 3 |
| Cuadro p95 | 217 ms | 16,8 ms (60 fps) |
| Carga en escritorio | 7,5 s | 1,8 s |

Qué se cambió:
- Las bolsas, los maníes y la roseta se dibujan una vez y se reutilizan como imagen (`bagImg`, `peanutsImg`, `guillocheImg`).
- Se quitó la capa de grano fija con mezcla de colores.
- El dorado animado quedó solo en el titular.
- El foco de luz ahora se mueve con `transform`.
- Las secciones usan `content-visibility: auto`.
- La barra de la tienda ya no usa blur.

**Movimiento**
- **Pantalla de carga** por sesión: moneda con el logo, barra dorada y telón. Máximo 1,8 s; no aparece si ya se mostró la puerta.
- **Microanimaciones:**
  - totales que ruedan como contador;
  - "+1" dorado al agregar;
  - destello en la ficha agregada;
  - botones dorados magnéticos;
  - entradas escalonadas de pasos, tarjetas y preguntas;
  - filete dorado que se dibuja bajo cada capítulo.

**Calidad**
- 52 pruebas Playwright pasan, incluido axe WCAG 2.2 AA en Noche y Marfil.

## v4.0 · "Para gente elegante y gánster" · catálogo 2026.10.3 (10 de octubre de 2026)

Identidad nueva y única. La investigación está en [`docs/identidad-casa.md`](docs/identidad-casa.md) y las reglas en [`docs/brand-guidelines.md`](docs/brand-guidelines.md). Todo lo funcional de la v3 se mantiene.

**Identidad**
- Eslogan nuevo: **"Para gente elegante y gánster."**
- Tema **Noche** por defecto (noir, terciopelo y champán) y **Marfil** opcional.
- Tokens nuevos y generador sin dependencias (`design/build-tokens.mjs`).
- Tipografías nuevas: **Bodoni Moda**, **Big Shoulders**, **Instrument Sans** y **Pinyon Script**. Se eliminaron Fraunces, Manrope y Caveat.
- Arte generativo nuevo: **anilla de habano** en cada bolsa (con número de ficha), **roseta guilloché** y **monograma MG**.
- **La puerta**: intro de speakeasy accesible, solo en la primera visita.

**Cada sección, una sala**
- **El salón** (hero):
  - titular de tres líneas con cursiva en foil;
  - bolsa Nº 01 sobre la roseta;
  - foco de luz que sigue al puntero;
  - "Parte del día" impreso en papel.
- **La Bolsa de hoy**: el stock en vivo como cotización (▲/▼).
- Los capítulos:
  - Cap. I **La receta**: expediente confidencial en 4 folios.
  - Cap. II **Los más buscados**: fichas tipo rueda de reconocimiento, **33 alias** (`ALIASES` en `catalog.mjs`), búsqueda por alias.
  - Cap. III **El maletín**: cuero, terciopelo capitoné y broches.
  - Cap. IV **La cita**: invitación de marfil con lacre.
  - Cap. V **El Jefe**: "El Diario de la Casa".
  - Cap. VI **Las pruebas**: galería numerada.
  - Cap. VII **El trato**: mesa de fieltro con tarjetas de metal.
  - Cap. VIII **La letra chica**.
  - Cap. IX **La familia habla**: telegrama.
- **Pie**: logotipo gigante en foil.
- **La cuenta de la casa**, **El interrogatorio** (quiz bajo una lámpara) y **El Gigante, tu consigliere** (IA).

**Voz y contenido**
- `voice.mjs`, el prompt del agente, la versión en inglés, el 404, "La receta" y las fichas `/sabor/:id` hablan el idioma de la casa: dominicano-chileno y gánster elegante.
- La voz tiene límites explícitos: nada de armas, violencia ni drogas.
- Formatos renombrados: **El Clásico** y **La Reserva**.
- **35 imágenes para compartir** regeneradas con la identidad nueva (`scripts/og.mjs`): una por sabor, más portada y receta.
- El ticket PNG descargable ahora es una invitación.

**Calidad**
- **52 pruebas** Playwright en escritorio y móvil: se agregaron las de la puerta y la identidad.
- axe WCAG 2.2 AA sin violaciones en Noche y Marfil. Todos los contrastes están documentados.
- El service worker (`mg-v4-2026.10.3`) limpia la caché de la v3, así nadie queda viendo el diseño anterior.

**Pulido v4.1**
- Splash screens de iOS e íconos maskable con roseta y moneda dorada (`scripts/pwa-art.mjs`).
- Página sin conexión con la estética de la casa.
- Panel de Jorge alineado con la identidad: esquinas rectas, cifras en Big Shoulders y rombos dorados.
- Copys revisados: se quitó "armas el combo" y "Arma tu caja" (en clave gánster sonaban a armas). Ahora dicen "completas" y "Llena tu maletín".
- En celular: botones del pie a ancho completo y la cuenta muestra más líneas de pedido.

**Pendiente**
- Jorge revisa los alias, el horario y `NEW_IDS`.
- Foto de Jorge para El Diario (opcional).
- El logo del elefante todavía dice "El gigante de los antojos". Si Jorge quiere, se hace una versión con el eslogan nuevo.

## v3.0 · catálogo 2026.10.2 (octubre 2026)

Leyenda: ✅ implementada · 🟡 parcial (detalle en el plan de pendientes)

**Resumen: 41 ✅ · 9 🟡.** 48 pruebas Playwright pasan en escritorio y móvil (Pixel 7), incluido axe WCAG 2.2 AA en modo claro y oscuro.

### Diseño y percepción premium
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 1 | Micro-interacciones de papel real | ✅ | Tilt 3D con sombra dinámica y brillo de papel (`js/tilt.mjs`, `.paper-sheen`) sobre el grano. Solo con puntero fino y sin "reducir movimiento". |
| 2 | Elevación de 4 niveles con sombra cálida | ✅ | `--primitive-elevation-1…4` → `--elevation-card/raised/overlay/modal` (claro y oscuro) |
| 3 | Tipografía óptica | ✅ | Ejes `opsz`, `SOFT` y `WONK` de Fraunces (fuente completa autoalojada) + tracking por rol |
| 4 | Escala tipográfica y spacing de 8 pt en tokens | ✅ | `design/tokens.json` → `css/tokens.css`; documentado en la guía de marca §7 |
| 5 | Skeletons y estados vacíos con bolsa y voz de Jorge | ✅ | Bolsa en la boleta vacía y en búsquedas sin resultado; skeleton en "Estado en vivo"; textos en `js/voice.mjs` |
| 6 | Entradas cinematográficas GSAP | ✅ | `js/motion.mjs`: palabras que suben desde una máscara, clip-path y stagger de la tienda. Con reduced-motion no se anima nada. |
| 7 | Hero editorial con jerarquía de CTAs | ✅ | Kicker, un CTA principal dorado y un link secundario (`.hero-link`) |
| 8 | Sello "Hecho a mano" contextual | ✅ | `stampMoment()` al completar una caja, una reserva o un pedido |
| 9 | Bolsa generativa más realista | ✅ | `js/art.mjs`: luz, reflejo, fuelle y muesca; celofán con arrugas y doypack con ventana |
| 10 | Dark mode pensado | ✅ | Valores propios (kraft tostado, oro de texto, grano 8 %, sombras más profundas) generados por `build-tokens.py` |
| 11 | 404 memorable | ✅ | `404.html` con 3 sabores sugeridos y el Gigante; `/sabor/inexistente` también responde con la página de marca |
| 12 | Íconos PWA y splash | ✅ | Maskable 192/512, monocromo, splash para iOS y shortcuts en el manifest |

### UX y conversión
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 13 | Carrito persistente y recuperación | ✅ | localStorage + toast "Tu boleta te esperó" + link `?pedido=` para compartir o recuperar por WhatsApp |
| 14 | Promo de viernes gamificada | ✅ | `fridayPromo()` en catalog: cinta superior + barra en la boleta + mensaje de WhatsApp |
| 15 | Quick view completa | ✅ | Foto ↔ ilustración, "va bien con", alérgenos y CTAs para reservar, preguntar y ver la ficha |
| 16 | Reserva en un flujo con ticket en vivo | ✅ | `#rfLive` (aria-live), cupos por bloque y medio de pago |
| 17 | Post-reserva: ticket guardable, .ics y wallet | 🟡 | PNG, .ics y Google Calendar listos. **Falta Apple/Google Wallet.** |
| 18 | Quiz más profundo y guardado | ✅ | 4 preguntas (con intensidad); se guarda en el dispositivo y se puede compartir |
| 19 | Arma tu caja con preview real | ✅ | Bolsas reales en cada espacio + "Sorpréndeme" + sello |
| 20 | Upsell inteligente | ✅ | "Va chévere con lo tuyo" en la boleta; el agente ofrece 1 complemento (`pairs`) por conversación |
| 21 | Checkout híbrido con estado | 🟡 | Transferencia / Mercado Pago / efectivo; estado "ya pagué → recibido" en Mis pedidos. **Falta el cobro verificado de Mercado Pago** (Checkout Pro + webhook). |
| 22 | Avísame cuando vuelva | ✅ | `/api/alerts` + panel con los avisos pendientes (WhatsApp o mail en un toque) |
| 23 | Historial de pedidos | ✅ | `js/history.mjs` + diálogo Mis pedidos (repetir, ya pagué, recibido, borrar) |
| 24 | Filtros sticky | ✅ | `.shop-bar` sticky: Disponibles / Top / Nuevos + buscador |

### Performance y calidad
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 25 | Fuentes locales y critical CSS | 🟡 | Google Fonts eliminado; fuentes autoalojadas con preload y fallbacks métricos. **Falta inline del critical CSS.** |
| 26 | Lazy-load, fetchpriority y decoding async | ✅ | Imágenes bajo el fold con lazy y async; hero con `fetchpriority="high"` |
| 27 | Service Worker y catálogo offline | ✅ | `sw.js` + `offline.html`. Nunca cachea admin, el agente ni las reservas. |
| 28 | Code-splitting | ✅ | `agent.mjs` y `motion.mjs` (y GSAP) se cargan bajo demanda. `art.mjs` queda en el bundle principal porque pinta la primera vista. |
| 29 | Core Web Vitals | ✅ | LCP, CLS, INP, FCP y TTFB → `/api/events` → panel (con ícono y etiqueta) |
| 30 | Tests Playwright | ✅ | `tests/`: tienda (9), API (6), accesibilidad (9), × escritorio y móvil |
| 31 | TypeScript + Zod | 🟡 | Todo el backend de negocio en `.mts` + Zod con mensajes en español. **El frontend sigue en JS** (sin build step). |
| 32 | Toasts unificados con voz de marca | ✅ | `toast()` en `js/ui.mjs` + textos en `js/voice.mjs` |

### Backend, gestión y operaciones
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 33 | Panel admin | ✅ | `/admin.html`: reservas del día, entregas, stock manual, métricas del agente |
| 34 | Stock robusto | ✅ | Webhook `pushStock` → Blobs (60 s) → último conocido → catálogo local |
| 35 | Notificaciones unificadas | 🟡 | WhatsApp Cloud + email (Resend) + Sheets en `notify.mts`. **Faltan las push web** (requiere claves VAPID). |
| 36 | Analytics de negocio y dashboard | ✅ | `/api/events` + gráficos de 14 días en el panel (paleta validada para daltonismo, vista en tabla) |
| 37 | Inventario por lote | ✅ | Lotes y ventas por lote, solo en el panel |
| 38 | Capacidad por slot | ✅ | `slotCapacity: 6` en catalog; los bloques llenos se bloquean y la web muestra "quedan N" |
| 39 | Export CSV | ✅ | `/api/admin/export.csv` (UTF-8 con BOM para Excel) |
| 40 | Toggle "Jorge no está" | ✅ | Frena las reservas y se refleja en la web y en el agente |
| 41 | Versionado de catálogo | ✅ | `CATALOG_VERSION` + `CATALOG_CHANGELOG`; el historial queda en el panel |
| 42 | Rate limiting y anti-abuso | ✅ | Límite por IP y ruta, same-origin, honeypot y token admin con comparación segura |

### SEO y growth
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 43 | Páginas de sabor con schema Product | ✅ | `/sabor/:id` (Product + Offer + Breadcrumb) + sitemap dinámico |
| 44 | "El oficio" como blog | ✅ | `oficio.html` (Article schema). Los textos son borrador para Jorge. |
| 45 | Schema completo | ✅ | FoodEstablishment, ItemList, FAQPage, WebSite, Article y BreadcrumbList (`npm run seo`) |
| 46 | Open Graph dinámico | 🟡 | Una imagen OG por sabor (33), generada desde `design/banners/flavor-og.html`. **No se genera en runtime**: hay que regenerarla al agregar un sabor. |
| 47 | Feed UGC / Instagram | 🟡 | Galería UGC curada desde el panel. **Falta la conexión con la API de Instagram.** |

### Accesibilidad y pulido
| # | Mejora | Estado | Dónde |
|---|---|---|---|
| 48 | WCAG 2.2 AA, focus premium y teclado | ✅ | axe sin violaciones (claro y oscuro, quick view, boleta, páginas secundarias); foco atrapado e `inert`; anillo de foco con token |
| 49 | i18n es-CL + en | 🟡 | Interfaz y navegación en inglés. **El catálogo, el agente y los textos largos siguen en español.** |
| 50 | Design system documentado | 🟡 | `docs/design-system.md` con fichas listas para Storybook o MDX. **Falta montar Storybook.** |

### Otros cambios
- **Voz de marca**: Jorge es dominicano y vive en Chile. Los textos de la web y del agente mezclan con suavidad el dominicano ("chévere", "dímelo", "mi pana") con el chileno ("al tiro", "bacán"). Ver guía de marca §3.
- **Seguridad**: el panel exige un `ADMIN_TOKEN` de al menos 12 caracteres; el webhook de stock exige secreto.
- **Eliminados**:
  - `netlify/functions/reserve.mjs`, `netlify/lib/stock.mjs` y `netlify/lib/notify.mjs`, reemplazados por sus versiones `.mts`;
  - `sitemap.xml` estático, reemplazado por el dinámico.

---

## Plan de pendientes

| Prioridad | Tarea | Qué se necesita |
|---|---|---|
| Alta | Revisar contenido | Jorge: horario real (`SCHEDULE`), textos de "El oficio", notas de sabores, qué sabores son **nuevos** (`NEW_IDS`, hoy vacío) y alérgenos |
| Alta | Configurar Netlify | `ADMIN_TOKEN`, `ANTHROPIC_API_KEY`, `STOCK_WEBHOOK_SECRET` + activador `pushStock` en Apps Script |
| Media | #21 Mercado Pago verificado | Cuenta de MP, Access Token → función `/api/pay` (Checkout Pro) + webhook que marque la reserva como pagada |
| Media | #35 Push web | Claves VAPID, suscripción en `sw.js` y envío en `alerts.mts` (avisos de "volvió tu sabor") |
| Media | #17 Wallet | Certificado de Apple Developer (Pass Type ID) / Google Wallet issuer, más una función que firme el pase |
| Media | #47 Instagram | Cuenta Business + token de Instagram Graph API → función con caché diaria que alimente `.ugc` |
| Baja | #25 Critical CSS | Script que extraiga el CSS del primer pantallazo y lo inserte inline en `index.html` (opcional, sin build obligatorio) |
| Baja | #46 OG en runtime | Netlify Edge Function con `og_edge` o un satori equivalente, si el catálogo crece mucho |
| Baja | #31 Frontend tipado | JSDoc + `// @ts-check` en `js/*.mjs` (tipado sin build) |
| Baja | #49 i18n completa | Nombres y notas en inglés en `catalog.mjs` + idioma en el prompt del agente |
| Baja | #50 Storybook | Seguir los pasos de `docs/design-system.md` → "Llevarlo a Storybook" |

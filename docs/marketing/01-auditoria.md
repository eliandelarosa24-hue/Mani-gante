# Fase 1 · Auditoría del proyecto y del mercado · Red Vaeru

**Fecha de revisión:** miércoles 14 de octubre de 2026 (hora de Chile continental, America/Santiago).

**Qué revisé:**
- El repositorio del sitio (`src/pricing.js`, `src/real.js`, `docs/*`).
- El sitio publicado, https://redvaeru.netlify.app/.
- Búsquedas web sobre las políticas de Meta, los precios del mercado y la demanda turística.

**Qué no pude revisar:**
- Las cuentas de Instagram y Facebook. No tengo acceso a ellas y el sitio no las enlaza.
- La analítica real del sitio.
- Google Maps.
- Las páginas de facebook.com y 2x3.cl: el entorno no pudo abrirlas, así que los datos que vienen de ellas son de búsqueda o de documentos anteriores.

**Cómo leer las etiquetas:**
- **[H]** Hecho verificado en el código o en el sitio.
- **[F]** Dato de una fuente externa, con su fecha y sus límites.
- **[Hip]** Hipótesis para comprobar.
- **[R]** Recomendación.
- **[P]** Pendiente de confirmar contigo.

---

## 1. Qué ofrece realmente Red Vaeru

- **[H] Posicionamiento:** "Estudio digital de hospitalidad". El lema es "Conectando culturas" y el foco es la reserva directa sin comisiones de plataformas. Opera en la Araucanía y en Santo Domingo (República Dominicana). Responsable: Jorge Vásquez, estudiante de Ingeniería en Turismo en INACAP.
- **[H] Servicios publicados:**
  - Webs para alojamientos.
  - Webs para restaurantes.
  - Asesoría turística.
  - Capacitación en servicio al cliente.
  - Agentes de IA y automatización.
  - Gestión de redes sociales.
  - Mantención mensual.
- **[H] Tarifario vigente** (en `src/pricing.js`; el sitio solo muestra el valor "desde"):

| Plan web (alojamiento o restaurante) | Precio de lanzamiento | Precio normal | Plazo |
|---|---|---|---|
| Esencial (una página) | $49.000 – $79.000 | $149.000 – $249.000 | 1 a 2 semanas |
| Completo (varias secciones, reservas por WhatsApp o enlace, ficha de Google) | $149.000 – $249.000 | $390.000 – $690.000 | 3 a 4 semanas |
| Firma (a medida, como las muestras) | $590.000 – $990.000 | $1.200.000 – $2.800.000 | 5 a 8 semanas |
| Mantención Cuidado / Crecimiento | $25.000 / $55.000 al mes | — | mes a mes |

- **[H] Condiciones vigentes:**
  - 5 cupos de lanzamiento, todos libres (`LAUNCH.taken = 0`).
  - Barra de campaña: "confirme su sitio antes del 30 de noviembre".
  - Garantía de portada: si la portada no convence, no paga.
  - Pago: 50% al aprobar y el resto al publicar.
  - Contrato siempre.
  - Logo de regalo si el cliente no tiene.
  - Dominio .com y hosting gratis el primer año.
  - Respuesta en menos de 24 horas hábiles.
- **[H] El precio "$45.000" ya no está vigente.** Hoy el piso público es **$49.000**. No usaré $45.000 en ninguna pieza.
- **[H] Inconsistencia interna:** `docs/propuesta-precios.md` está desactualizado respecto de `pricing.js`:
  - Completo: $89.000 – $149.000 en el documento, contra $149.000 – $249.000 en el código.
  - Mantención: $12.000 – $20.000 en el documento, contra $25.000 / $55.000 en el código.
  - **[R]** Tomar `pricing.js` como única fuente de verdad y corregir o retirar ese documento.

## 2. Qué se puede vender de inmediato

1. **Web Esencial de lanzamiento ($49.000 – $79.000):**
   - Ticket bajo, decisión rápida y entrega en 1 o 2 semanas.
   - Es el gancho principal.
2. **Web Completo de lanzamiento ($149.000 – $249.000):**
   - Es el producto rentable. Conviene usar el Esencial como puerta de entrada y ofrecer el Completo en la llamada.
3. **Diagnóstico gratuito de independencia de plataformas (ya existe en el sitio):**
   - Es la mejor oferta para iniciar conversaciones sin pedir dinero.
4. **Carta digital con QR para restaurantes (dentro de Esencial):**
   - Ciclo de venta corto en Temuco.
5. **[Hip] Para la próxima semana no conviene empujar capacitación, asesoría ni IA:** tienen ciclos de venta más largos. Solo deben aparecer como prueba de especialización.

## 3. Público más rentable y accesible para la próxima semana [Hip]

1. **Prioridad A: cabañas, hostales y glamping pequeños** (2 a 10 unidades) en:
   - Zona lacustre: Pucón, Villarrica, Lican Ray y Coñaripe.
   - Curacautín y Malalcahuello.
   - Alrededores de Temuco.
   - **Perfil:** venden por Booking, Airbnb o Instagram, tienen buenas reseñas y no tienen sitio propio, o tienen uno que no funciona en el celular.
   - **Por qué:**
     - Coinciden con los dos casos reales (Curacautín y Nueva Imperial).
     - Les quedan de 6 a 7 semanas antes de la temporada alta.
     - Su dolor (la comisión) se puede calcular en pesos.
2. **Prioridad B: restaurantes, cafés y cocinas de destino de Temuco** con la carta en PDF o solo en Instagram.
   - **Por qué:** ticket bajo y cercanía, lo que permite la venta presencial.
3. **Fuera de foco esta semana:**
   - Hoteles, termas y viñas (Firma): ciclo de venta largo.
   - Clientes del Caribe: su temporada es distinta y conviene trabajarlos aparte.

## 4. Problemas concretos de ese público

- **Comisiones de plataformas.**
  - **[F, sitio]** El sitio usa un rango de 15% a 25%. Verifiqué que el sitio lo afirma, pero no verifiqué las tarifas actuales de cada plataforma.
  - **[R]** No publicar porcentajes por plataforma sin fuente. En las piezas, hablar de "la comisión que usted paga" y calcularla con los datos del propio negocio.
- **Dependencia del algoritmo y de las políticas de las plataformas.**
- **Reservas desordenadas por WhatsApp.**
- **Fotos desordenadas, sin un lugar propio que mostrar.**
- **No aparecen en Google con su nombre.**
- **No tienen dónde explicar la ubicación, las políticas, el check-in o la guía de la zona** → muchas preguntas repetidas.
- **Poco tiempo para gestionar todo (dueños que operan solos):** la propuesta "yo lo hago por usted, usted manda fotos" responde a esto.

## 5. Diferenciación de Red Vaeru (respaldada)

- **[H] Nicho turístico explícito.**
  - Formación en turismo (INACAP).
  - Casos de alojamiento reales en la Araucanía.
- **[H] Garantía de portada:** se ve antes de pagar. Es poco común y reduce el riesgo.
- **[H] Contrato, todo a nombre del cliente y sin permanencia.**
- **[H] Calculadora de comisiones y Vaeru IA:** cotización inmediata las 24 horas.
- **[H] Atención online y presencial en la Araucanía.**
- **[Hip] Ninguna agencia de Temuco especializada en turismo** apareció en las búsquedas.
  - **Límite:** el buscador disponible está orientado a EE. UU. y rinde poco con resultados locales.
  - **[R]** Hay que confirmarlo revisando Google Maps ("diseño web Temuco") e Instagram.

## 6. Pruebas de capacidad que existen hoy

| Prueba | Estado | Cómo usarla |
|---|---|---|
| Cabañas Miah y Noah (Curacautín) | **[H]** En vivo | Recorrido en video del sitio, en celular. Caso principal |
| Testimonio de Nicole (co-anfitriona de Miah y Noah) | **[H]** En el sitio | Citar textual. **[P]** ¿Hay permiso para usarlo en redes y anuncios? |
| El Rincón de los Poetas (hostal, Almagro) | **[H]** En vivo | Segundo caso |
| 10 muestras de concepto (Termas Rayenko, Cabañas Lago Azul, Domos Cielo Austral, etc.) | **[H]** Concepto, no son clientes | Mostrarlas **siempre con la etiqueta "muestra de concepto"**. Nunca como clientes |
| MANI-GANTE (proyecto propio) | **[H]** En vivo | Prueba de que el estudio diseña y vende, aunque no es turismo |
| Resultados con números | **[H]** No existen. El caso dice "huéspedes reservando directo", sin cifra | **[P]** Pedir a Nicole el número de reservas directas del último mes |

## 7. Materiales de marca reutilizables

- **[H] Emblema:** palmera más araucaria. Archivos en `public/brand/`, de 32 a 512 px.
- **[H] Tipografía:** serif Fraunces.
- **[H] Paleta:** dorado, crema y fondos oscuros.
- **[H] Fondo:** curvas de nivel animadas (el territorio).
- **[H] Video:**
  - Showreel vertical de las 10 muestras.
  - Recorridos en video de cada muestra y de los dos proyectos reales.
  - Formatos MP4 y WebM.
  - Este material ya sirve para Reels sin mostrar el rostro.
- **[H] Imágenes:**
  - Imagen para compartir (`public/og.jpg`).
  - Portadas en escritorio y celular de los casos reales (`public/img/casos/`).
- **[H] Textos de prospección:** ya escritos en `docs/plan-captacion.md` (3 mensajes de WhatsApp).
- **[H] Tono:** "usted" con los clientes.

## 8. Decisiones previas que se respetan

- Primera persona ("soy Jorge"), sin fingir ser una agencia.
- Solo testimonios reales.
- Las muestras no son clientes.
- Trato de "usted".
- Evitar siglas como "OTA".
- Precio fijo por escrito.
- Cupos de lanzamiento a cambio de testimonio, permiso de publicación y un dato de resultados.
- Subir los precios cerca de un 30% después de los 5 cupos.

## 9. Lo que falta para una campaña sólida

Las preguntas concretas para resolver esto están en el chat.

- Enlaces y estado de las cuentas de Instagram y Facebook. El sitio no las enlaza.
- Métricas actuales.
- Presupuesto para anuncios.
- Tiempo disponible.
- Si apareces en cámara.
- Permisos de uso del testimonio y del caso.
- Meta de clientes e ingresos.
- **[H] Infraestructura pendiente** según los documentos previos. No sé qué quedó hecho:
  - Dominio redvaeru.cl (el sitio sigue en netlify.app).
  - Analítica.
  - Registro de leads en Google Sheets.
  - Google Business Profile.
  - WhatsApp Business.

## 10. Obstáculos para convertir publicaciones en ventas

1. **🔴 Facebook Marketplace prohíbe vender servicios.**
   - **[F, consulta del 14-10-2026]** Las pautas de ofertas y las políticas de comercio de Meta indican que en Marketplace no se permiten artículos no físicos, "incluidos, entre otros, servicios, suscripciones, productos digitales o alquileres".
   - **Límite:** no pude abrir la página oficial desde este entorno. El dato viene de la página de ayuda de Meta indexada y de guías de terceros que coinciden.
   - **Riesgo:** retiro de publicaciones y **restricción de la cuenta en Marketplace**.
   - **[R]** No usar Marketplace como canal principal. Alternativas:
     - Publicaciones en grupos locales de Facebook que permitan ofrecer servicios (emprendedores de Temuco, turismo de la Araucanía), revisando las reglas de cada grupo.
     - Yapo.cl, en la categoría de servicios.
     - Google Business Profile.
     - Prospección directa.
   - **[P]** Si aun así quieres usar Marketplace, lo plantearía como prueba de bajo riesgo con un perfil que puedas perder, y no lo recomiendo.
2. **Pocas pruebas con números:** un caso con resultado medible convence mucho más que diez muestras.
3. **El contenido orgánico de una cuenta nueva o pequeña rinde poco en 7 días.**
   - **[R]** La venta de esta semana sale sobre todo de la **prospección directa** (WhatsApp o mensaje privado con la calculadora y una maqueta).
   - Las redes funcionan como **prueba social y vitrina** para quien recibe el mensaje y revisa el perfil.
4. **Capacidad de una sola persona:** 5 proyectos simultáneos más contenido diario puede ser demasiado. **[P]** ¿Cuántos proyectos puedes atender a la vez?
5. **Un precio muy bajo puede restar credibilidad.**
   - **[F]** Según un documento previo, 2x3.cl ubicaba a los diseñadores web chilenos entre $300.000 y $1.000.000. Hoy no pude volver a abrir esa página.
   - **[F]** Un aviso de Yapo ofrece WordPress para pymes a $150.000. El alcance no está claro.
   - **[R]** Presentar siempre el $49.000 como **precio de lanzamiento con cupos**, con el precio normal tachado ($149.000), como ya hace el sitio.
6. **No hay medición:** sin analítica ni planilla de leads, no sabremos qué pieza trajo cada cliente.
   - **[R]** Usar un enlace o una palabra clave distinta por pieza ("escríbame CABAÑA", "escríbame CARTA").

## 11. Señales de demanda

- **[F, Sernatur]** En el verano 2024-2025, Sernatur proyectó más de 2 millones de viajes con pernoctación en La Araucanía (8,6% del total nacional).
  - **Límite:** es la temporada anterior. No encontré proyecciones para 2026-2027, que suelen publicarse cerca de diciembre.
- **[F, Las Noticias de Malleco]** Sernatur mantiene en 2026 sus 4 programas de turismo interno y proyecta mantenerlos en 2027.
  - **Aplicación:** hay demanda estacional estable. Los alojamientos que quieran sitio propio antes de diciembre deben decidir **en octubre y noviembre**.
- **[Hip]** La ventana comercial se cierra en la práctica a fines de noviembre. Después, el dueño está operando y no decide proyectos nuevos hasta marzo.

## 12. Tendencias de contenido aprovechables (éticas) [Hip, por comprobar con datos propios]

- **"¿Cuánto le paga a la plataforma?":** un número personalizado con la calculadora.
- **Antes y después en pantalla de celular:** del Instagram o Booking del negocio a su sitio.
  - Solo con casos reales o maquetas autorizadas.
  - O con una maqueta de un negocio ficticio, etiquetada como tal.
- **Recorrido de pantalla sin rostro:** grabar el celular navegando el sitio de Miah y Noah. El material ya existe.
- **Consejos para anfitriones:** fotos, respuestas rápidas, reseñas, ficha de Google.
- **Cuenta regresiva de temporada y de cupos:** solo con cifras reales de cupos.
- **No puedo verificar** audios en tendencia desde aquí. Hay que elegirlos dentro de Instagram la misma semana de publicación.

## 13. Competidores y referentes a observar [P: necesito tu lista]

- **Ya identificados en documentos previos (generalistas, sin foco turístico):**
  - Bigbuda.
  - ITStudio y LFI (Santiago).
  - W8.cl (Santiago), que usa la palabra clave "diseño web Temuco".
- **Por buscar manualmente:**
  - Diseñadores en Google Maps con "diseño web Temuco".
  - Avisos de Yapo en la Araucanía.
  - Cuentas de Instagram con #diseñowebtemuco y #paginaswebchile.
  - Constructores que venden a alojamientos (sistemas de reservas, sitios de cabañas en plantillas).
- **Referentes de contenido:** las cuentas de hospitalidad internacionales del documento `investigacion-referencias.md` (Kollective, Tambourine), solo como inspiración de formato.

## 14. Oportunidades en Temuco, sus alrededores y Chile

- **[R] Prospección territorial presencial:**
  - Una tarde en Curacautín o Malalcahuello, aprovechando que el caso Miah y Noah está ahí.
  - Una tarde en el centro de Temuco con restaurantes.
- **[R] Alianzas:**
  - Cámaras de turismo de Pucón y Villarrica.
  - Oficinas municipales de turismo.
  - INACAP (vinculación con el medio).
  - Ofrecer una charla gratuita de 30 minutos.
- **[Hip, P] Programas de digitalización de Sercotec y CORFO:** hay que verificar las convocatorias vigentes. No las verifiqué hoy.
- **[R] Referidos:** Nicole y los dueños del Rincón de los Poetas conocen a otros anfitriones.

## 15. Propuestas comerciales diferenciadoras (borrador)

- **"Su sitio listo antes del verano":**
  - Esencial de lanzamiento desde $49.000.
  - Garantía de portada.
  - 5 cupos.
  - Confirmación hasta el 30 de noviembre.
- **"Diagnóstico gratuito: cuánto le cuesta la plataforma y qué mejorar primero"** (15 minutos).
- **"Le muestro su portada antes de que pague"**: una maqueta para los 10 prospectos prioritarios.
- **[P] Un paquete "Temporada"** (Completo de lanzamiento + ficha de Google + 1 mes de mantención Crecimiento). Solo si te da margen.

## 16. Tareas automatizables con agentes de IA

El diseño completo está en `02-sistema-agentes.md`.

- **Automatizable ahora, en esta sesión:**
  - Redacción de piezas.
  - Variantes A/B.
  - Guiones.
  - Prompts visuales.
  - Respuestas comerciales.
  - Plantillas de propuesta.
  - Informes desde datos que me entregues.
- **Automatizable con tu autorización:**
  - Rutinas programadas en la nube que te preparan un informe semanal de tendencias y competencia.
  - Planilla de prospectos y métricas en Google Sheets. El conector está disponible; falta tu autorización.
  - Piezas visuales en Canva o Gamma. Los conectores están disponibles; falta tu autorización.
- **Siempre manual o con tu aprobación:**
  - Publicar.
  - Enviar mensajes a prospectos.
  - Gastar en anuncios.
  - Modificar cuentas.

---

## Fuentes consultadas (14-10-2026)

- Sitio de Red Vaeru: https://redvaeru.netlify.app/ y el código de este repositorio.
- Meta, Offers Policy Guidelines: https://www.facebook.com/business/help/358970040838616. Aparece indexada; no pude abrirla directamente.
- Meta, Commerce Policies: https://www.facebook.com/policies_center/commerce/. No pude abrirla desde este entorno.
- Guías de terceros sobre Marketplace: https://blog.vendoo.co/reseller-guide-to-facebook-marketplace-prohibited-items y https://www.zipsale.co.uk/blog/items-you-cant-sell-on-facebook-marketplace
- Sernatur, proyección del verano en la Araucanía: https://www.sernatur.cl/sernatur-proyecta-mas-de-2-millones-de-viajes-con-pernoctacion-durante-esta-temporada-alta-en-la-araucania/
- Las Noticias de Malleco, programas de Sernatur 2026: https://lasnoticiasdemalleco.cl/politica/sernatur-mantendra-durante-2026-sus-cuatro-programas-de-turismo-interno/
- Yapo, avisos de diseñadores web: https://www.yapo.cl/anuncios-casificados-negocios-servicios-servicios-varios-programadores-y-disenadores-web
- 2x3.cl, Provincia de Cautín: https://www.2x3.cl/servicios/diseno-pagina-web/provincia-cautin. Aparece indexada; no pude abrirla.

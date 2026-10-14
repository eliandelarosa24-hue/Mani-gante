# Sistema de agentes de IA · Red Vaeru

**Fecha:** 14 de octubre de 2026.

## Qué es real hoy y qué no

- **Lo que puedo hacer en esta sesión:** actuar como cada agente, a pedido tuyo.
- **Lo que puedo programar con tu autorización:** **rutinas en la nube** (sesiones de Claude que se ejecutan en el horario que elijas) y conectarlas a Google Sheets, Google Drive, Gmail (solo borradores), Canva o Gamma.
- **Lo que no hago:** no trabajo "de noche" sin una rutina programada. No reviso Instagram ni Facebook por dentro sin acceso, y no tengo conexión a esas cuentas.

## Reglas comunes a todos los agentes

Cada agente:

- Separa los hechos de las hipótesis.
- Cita la fuente y la fecha de cada dato.
- Declara sus límites.
- No inventa clientes, testimonios, cifras ni proyectos.
- Entrega acciones concretas.
- Nunca publica, envía mensajes, gasta ni modifica cuentas sin tu aprobación explícita.

**Formato de salida común:**
1. Objetivo.
2. Datos usados.
3. Hallazgos, con etiquetas [H], [F], [Hip] o [R].
4. Nivel de confianza (alto, medio o bajo).
5. Acciones recomendadas.
6. Riesgos.
7. Pendientes.

## Ficha de cada agente

| # | Agente | Entradas | Salidas | Frecuencia propuesta | Criterio de evaluación |
|---|---|---|---|---|---|
| 1 | **Investigador de mercado** | Búsqueda web, Sernatur, INE, noticias de turismo de la Araucanía y Los Ríos, programas de Sercotec y CORFO | Informe de 1 página: hallazgos, oportunidades y riesgos | Semanal (lunes 08:40) | ¿Produjo al menos 1 acción comercial que usamos? |
| 2 | **Detector de tendencias** | Tus capturas de Reels y del Explorar de Instagram, búsquedas web, preguntas de prospectos | 5 ideas de contenido con formato y gancho, y vigencia comprobada | Semanal (domingo 18:40) | Retención y alcance de las piezas que salen de sus ideas, frente a las demás |
| 3 | **Analista de competidores** | Lista de cuentas y sitios que me des, más Google Maps y Yapo | Tabla: propuesta de valor, precios visibles, formatos, llamadas a la acción, fortalezas, debilidades y cómo diferenciarnos | Quincenal | Solo cuentas revisadas de verdad (cada una con fecha y URL) |
| 4 | **Estratega de crecimiento** | Informes de los agentes 1, 2, 3 y 6 | Plan de la semana siguiente: pruebas, alianzas, cambios al perfil | Semanal (domingo) | Cumplimiento del plan y prospectos generados |
| 5 | **Generador de contenido** | Plan semanal, identidad de marca, tarifario (`src/pricing.js`) | Copys, guiones, historias, carruseles, prompts visuales y variantes A/B listas para pegar | Por pedido o semanal | Tasa de aprobación sin cambios mayores |
| 6 | **Analista de métricas** | Planilla de métricas (Google Sheets) más capturas de Insights | Lectura semanal que separa visibilidad (alcance, reproducciones) de negocio (mensajes, prospectos, presupuestos, ventas) | Viernes 18:15 | Que cada conclusión se apoye en datos |
| 7 | **Optimizador** | Salida del agente 6 | Qué mantener, cambiar, detener, repetir y probar; reparto del tiempo y del presupuesto | Viernes, después del agente 6 | Mejora semana a semana del costo y del tiempo por prospecto calificado |
| 8 | **Asistente comercial** | Planilla de prospectos y conversaciones que pegues | Clasificación (caliente, tibio o frío), siguiente paso, borrador de respuesta, propuesta y seguimiento a 3 y 7 días | Diario (lunes a viernes 09:10, si se automatiza) | Respuestas enviadas a tiempo y propuestas que se cierran |

## Planilla base: "Red Vaeru · Comercial" (Google Sheets)

| Pestaña | Contenido |
|---|---|
| `prospectos` | Negocio, tipo, comuna, unidades, sitio actual, Booking/Airbnb, Instagram, WhatsApp, fuente, prioridad, estado, próximo paso, fecha |
| `metricas` | Fecha, pieza, plataforma, alcance, reproducciones, retención, visitas al perfil, clics, mensajes, palabra clave, prospectos, presupuestos, ventas, monto, gasto |
| `leads` | Lo que ya envía el sitio (ver `docs/google-sheets.md`) |

## Acciones que siempre requieren tu aprobación

- Publicar en cualquier red.
- Enviar mensajes o correos a terceros.
- Gastar dinero.
- Crear o modificar cuentas, anuncios o fichas.
- Cambiar precios en el sitio.
- Usar el nombre, la foto o el testimonio de un cliente.

## Acciones que puedo preparar sin ejecutarlas

- Borradores de piezas y mensajes.
- Borradores de correo en Gmail (sin enviarlos).
- Diseños en Canva.
- Filas de prospectos tomadas de fuentes públicas.
- Informes.

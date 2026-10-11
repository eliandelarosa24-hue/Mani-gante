# Plan paso a paso para conseguir clientes · Red Vaeru

**Objetivo de las primeras 8 semanas:** cerrar los 5 cupos de lanzamiento con negocios turísticos y que cada uno termine con testimonio, permiso de publicación y un dato de resultados.

**Regla de oro:** el sitio es la vitrina, pero los primeros clientes llegan por contacto directo. Dedique al menos **1 hora diaria** a prospectar.

---

## Semana 0 · Preparar el terreno (antes de salir a vender)
- [ ] **Publicar el sitio en Netlify:** conectar el repositorio, agregar `ANTHROPIC_API_KEY` y activar la detección de formularios (Forms → Enable form detection).
- [ ] **Notificaciones:** en Netlify, Forms → Notifications, avisos por correo para `contacto`, `cotizacion` y `diagnostico`.
- [ ] **Dominio:** comprar `redvaeru.cl` en NIC Chile, conectarlo y definir `SITE_URL=https://redvaeru.cl` en Netlify.
- [ ] **Analítica:** crear una cuenta en Plausible (o GA4) y definir `VITE_PLAUSIBLE_DOMAIN` (o `VITE_GA_ID`).
- [ ] **Google Business Profile:** crear "Red Vaeru", categoría "Diseñador de sitios web", área de servicio Araucanía, fotos y la URL.
- [ ] **WhatsApp Business:** perfil con el logo, horario, enlace al sitio, catálogo con los 5 servicios y respuestas rápidas (ver los guiones más abajo).
- [ ] **Datos reales:** pedir a Nicole (Miah y Noah) cuántas reservas directas recibieron el último mes y un video de 20 segundos. Actualizar el caso.
- [ ] **Su foto profesional** para la sección "Sobre mí".
- [ ] **Boleta o factura:** confirmar con un contador o en el SII y ajustar `TAX_NOTE` en `src/pricing.js` si es necesario.

## Semana 1 · Lista de 50 prospectos
Use la plantilla de abajo en Google Sheets.
- **Dónde buscar:**
  - Google Maps ("cabañas", "hostal", "glamping" en Pucón, Villarrica, Curacautín, Malalcahuello, Lican Ray, Coñaripe, Temuco y Nueva Imperial).
  - Booking y Airbnb.
  - Instagram (#cabañaspucon, #turismoaraucania).
- **Qué priorizar:**
  1. Sin sitio web, pero con buenas reseñas: el negocio funciona y le falta el canal propio.
  2. Con un sitio antiguo o que no funciona bien en el celular.
  3. Restaurantes de destino con carta en PDF o solo en Instagram.

| Negocio | Tipo | Comuna | Unidades | Sitio actual | Booking/Airbnb | Instagram | WhatsApp | Prioridad | Estado | Próximo paso |
|---|---|---|---|---|---|---|---|---|---|---|

## Semana 2 · Las 10 maquetas
- Elija los 10 prospectos de prioridad 1.
- Para cada uno, haga **solo la portada** de su futuro sitio: su nombre, una foto de su Instagram o Booking, el titular y el botón de WhatsApp. Publíquela en una URL privada de Netlify. Unos 45 a 60 minutos por maqueta.
- Calcule sus comisiones con la calculadora del sitio (unidades × ocupación estimada × tarifa).

## Semanas 2 a 4 · Contacto directo
**Mensaje 1, primer contacto por WhatsApp o Instagram:**
> Hola [Nombre], soy Jorge, de Red Vaeru. Estudio Ingeniería en Turismo y diseño sitios para alojamientos de la Araucanía. Vi [Negocio] en [Booking/Google] y me gustó mucho [detalle real]. Hice una muestra de cómo se vería su sitio propio, sin compromiso: [enlace]. Con [X] reservas al mes por plataformas, le estarían quedando unos [$monto] al año en comisiones. ¿Le interesa que conversemos 15 minutos?

**Mensaje 2, seguimiento a los 3 días:**
> Hola [Nombre], ¿alcanzó a ver la muestra de [Negocio]? Me quedan [N] cupos con precio de lanzamiento antes de la temporada de verano. Si prefiere, le explico en una llamada de 15 minutos.

**Mensaje 3, último seguimiento a los 7 días:**
> [Nombre], no le escribo más para no molestar 🙂. Si más adelante quiere su sitio o un diagnóstico gratis de cómo vende hoy, me encuentra en redvaeru.cl.

**Meta:** 10 contactos con maqueta y 20 sin maqueta por semana. Registre cada respuesta en la planilla.

## Semanas 3 a 6 · Canales que trabajan solos
- **Instagram y TikTok de Red Vaeru, 3 publicaciones por semana:**
  - Lunes: un reel con la calculadora ("¿Cuánto le paga a Booking?").
  - Miércoles: el antes y después de un sitio o una maqueta.
  - Viernes: un consejo para anfitriones (fotos, respuestas rápidas, reseñas).
- **Alianzas:**
  - Escribir a las cámaras de turismo de Pucón y Villarrica y a las oficinas municipales de turismo, ofreciendo una charla gratuita de 30 minutos: "Cómo vender más directo esta temporada". La charla genera contactos en grupo.
  - Hablar con INACAP (vinculación con el medio): proyectos de digitalización de pymes turísticas.
  - Revisar los programas de digitalización de Sercotec y CORFO vigentes y si puede ser proveedor.
- **Referidos:** cada cliente que recomiende a otro recibe un mes de mantención gratis.

## Semanas 4 a 8 · Cerrar y entregar con excelencia
1. **Llamada de 15 minutos:** escuche más de lo que habla. Use el diagnóstico del sitio como guía.
2. **Propuesta escrita en menos de 24 horas:** alcance, plazos, precio, documento tributario y forma de pago (anticipo y saldo al publicar).
3. **Condiciones del cupo de lanzamiento** en la propuesta: testimonio, permiso de publicación y un dato de resultados a los 60 días.
4. **Al cerrar cada proyecto:** suba `LAUNCH.taken` en `src/pricing.js`. El sitio actualiza solo los cupos restantes.
5. **Al entregar:**
   - Pida la reseña en Google Business Profile.
   - Agregue el caso al portafolio con capturas.
   - Ofrezca la mantención mensual.

## Después de los 5 cupos
- Suba los precios alrededor de un 30% en `src/pricing.js`.
- Cambie la etiqueta "precios de lanzamiento" por "precios vigentes" (texto en `index.html` y en el agente).
- Con 10 casos y testimonios con números, acérquese a los precios de mercado.

## Qué medir cada viernes (15 minutos)
| Indicador | Meta semanal (fase de lanzamiento) |
|---|---|
| Prospectos contactados | 30 |
| Respuestas | 6 a 9 (20–30%) |
| Llamadas de 15 minutos | 3 |
| Propuestas enviadas | 2 |
| Proyectos cerrados | 1 cada 1 o 2 semanas |
| Cotizaciones en Vaeru IA y diagnósticos completados | ver la analítica |

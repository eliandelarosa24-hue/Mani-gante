# Propuesta de tarifario (para aprobar)

Los valores viven en `src/pricing.js`. En el sitio solo se ve el valor **"desde"** de cada servicio; los rangos completos los entrega Vaeru IA según el caso. Todo en CLP, sin IVA.

## Por qué estos valores
- En Chile, un diseñador web cobra entre **$300.000 y $1.000.000** por un sitio, según 2x3.cl. Los planes anteriores ($45.000 y $85.000) estaban muy por debajo del mercado y no se condicen con un portafolio premium.
- Los nuevos rangos quedan en el tramo de entrada y medio del mercado: siguen siendo accesibles para una cabaña o un hostal, pero dejan margen para el trabajo a medida.
- El argumento de venta es el retorno: con 20 reservas al mes por una OTA a $90.000 y 18% de comisión, el negocio paga **$3.888.000 al año** en comisiones (calculadora del sitio).

| Servicio | Opción | Rango |
|---|---|---|
| Web alojamiento | Presencia esencial (1 página) | $220.000 – $320.000 |
| | Sitio completo multi-sección | $450.000 – $750.000 |
| | Experiencia premium | $850.000 – $1.400.000 |
| Web restaurante | Carta digital QR | $150.000 – $250.000 |
| | Sitio completo | $380.000 – $650.000 |
| | Experiencia premium | $750.000 – $1.200.000 |
| Redes | Esencial (8 publicaciones) | $150.000 – $220.000 al mes |
| | Pro (12 publicaciones + historias) | $260.000 – $380.000 al mes |
| Asesoría | Diagnóstico (90 min + informe) | $70.000 – $110.000 |
| | Plan de canal directo y OTAs (4 sesiones) | $280.000 – $450.000 |
| | Acompañamiento mensual | $180.000 – $300.000 al mes |
| | Formulación de proyecto turístico | $450.000 – $900.000 |
| Capacitación | Taller 4 h (hasta 15 personas) | $320.000 – $480.000 |
| | Programa 3 módulos (12 h) | $850.000 – $1.300.000 |
| | Taller online (hasta 25 personas) | $240.000 – $360.000 |
| Mantención | Mensual | $25.000 – $45.000 al mes |

Además hay extras (motor de reservas, check-in online, idiomas, SEO local, manual de estándares, cliente incógnito, entre otros) definidos en el mismo archivo.

**Importante:** son propuestas. Si quiere conservar precios de entrada para sus primeros clientes, baje los mínimos en `src/pricing.js` y todo el sitio se actualiza solo.

**No incluido a propósito:** no se menciona financiamiento SENCE, porque requiere estar registrado como OTEC.

// Videos animados e informativos: datos reales con su fuente en pantalla, y un cierre que lleva a los servicios.
// Cada escena entra cuando la voz dice su palabra "at". Fuentes y nivel de confianza en
// docs/marketing/06-datos-videos-informativos.md: verifique cada enlace antes de publicar.
import { BRAND as B } from '../../lib.mjs';

const CTA = (eyebrow, title, word = 'PORTADA', chips = [`Webs desde ${B.carta}`, 'Carta QR', `Temporada ${B.temporada}`], note) => ({ eyebrow, title, word, chips, note });

export const VIDEOS = {
  A01: {
    file: 'A01_f29-tres-fechas', slug: 'f29', serie: 'Tributario', seed: 11,
    scenes: [
      { type: 'hook', eyebrow: 'Formulario 29 · SII', lines: ['¿Sabía que el F29', 'tiene <em>tres fechas?</em>'] },
      { type: 'cal', at: 'Doce', eyebrow: 'Cada mes', title: 'Tres plazos <em>distintos</em>', days: [
        { d: 12, at: 'Doce', label: 'Plazo general' },
        { d: 20, at: 'Veinte', label: 'Declara y paga por internet, y es facturador electrónico' },
        { d: 28, at: 'Veintiocho', label: 'Declaración sin impuesto que pagar' },
      ], source: 'SII, preguntas frecuentes 001_130_1060 y portal Mipyme' },
      { type: 'list', at: 'fin', eyebrow: 'Ojo', title: 'Si cae en fin de semana <em>o feriado…</em>', items: [
        { icon: 'calendar', text: 'Pasa al día hábil siguiente', d: 0.5 },
        { icon: 'doc', text: 'Información general: confirme su caso con su contador', at: 'Confirme' },
      ], source: 'SII' },
    ],
    cta: CTA('Usted ordena sus números', 'Yo ordeno su <em>vitrina digital</em>'),
  },
  A02: {
    file: 'A02_comision-plataformas', slug: 'comisiones', serie: 'Turismo en cifras', seed: 12,
    scenes: [
      { type: 'hook', eyebrow: 'Booking y Airbnb', lines: ['¿Cuánto se queda', '<em>la plataforma</em>', 'de cada reserva?'] },
      { type: 'bars', at: 'Booking', eyebrow: 'Comisión al anfitrión', title: 'Lo que dicen <em>sus propias páginas</em>', max: 30, items: [
        { label: 'Booking.com', text: '10–25', unit: '%', from: 10, value: 25, at: 'Booking', note: 'Según el contrato de cada alojamiento' },
        { label: 'Airbnb, tarifa dividida', text: '3', unit: '%', value: 3, at: 'Airbnb' },
        { label: 'Airbnb, la paga solo usted', text: '~15', unit: '%', from: 14, value: 16, at: 'quince' },
      ], source: 'Booking.com Partner Hub; Airbnb, Centro de ayuda (tarifas de servicio)' },
      { type: 'stat', at: 'ejemplo', eyebrow: 'Ejemplo: $3.000.000 en ventas al 15 %', value: 450000, suffix: '', label: 'pesos que se van <em>en comisiones</em>', body: 'Las plataformas traen huéspedes. <b>Su web hace que vuelvan directo.</b>', bodyAt: 'plataformas', source: 'Cálculo ilustrativo' },
    ],
    cta: CTA('Reserva directa', 'Su propia web, <em>con WhatsApp</em>'),
  },
  A03: {
    file: 'A03_verano-araucania', slug: 'verano', serie: 'Turismo en cifras', seed: 13,
    scenes: [
      { type: 'hook', eyebrow: 'Araucanía', lines: ['El verano', 'se decide', '<em>antes de diciembre</em>'] },
      { type: 'bars', at: 'enero', eyebrow: 'Pernoctaciones en la región, 2026', title: 'Enero vs. <em>agosto</em>', max: 150000, items: [
        { label: 'Enero', count: 143871, value: 143871, at: 'enero' },
        { label: 'Agosto', count: 62660, value: 62660, at: 'agosto', dim: true, note: 'Ocupación de habitaciones: 25,3 %' },
      ], source: 'INE, Encuesta Mensual de Alojamiento Turístico (enero y agosto de 2026)' },
      { type: 'stat', at: 'bajo', eyebrow: 'Enero 2026 frente a enero 2025', value: 19.9, decimals: 1, suffix: ' %', label: 'menos pernoctaciones: <em>más competencia</em> por cada huésped', body: 'Lo que no está listo en noviembre, <b>se pierde en enero.</b>', bodyAt: 'noviembre', source: 'INE, EMAT enero 2026' },
    ],
    cta: CTA('Paquete Temporada', 'Su web lista <em>antes del verano</em>', 'TEMPORADA', [`Temporada ${B.temporada}`, 'Web + ficha de Google', `Carta QR ${B.carta}`]),
  },
  A04: {
    file: 'A04_turistas-de-lejos', slug: 'larga-distancia', serie: 'Turismo en cifras', seed: 14,
    scenes: [
      { type: 'hook', eyebrow: 'Turismo receptivo', lines: ['Llegan menos turistas…', '<em>pero los de lejos</em>', 'van en aumento'] },
      { type: 'stat', at: 'primer', eyebrow: 'Turistas extranjeros · 1er semestre 2026', value: 2553723, label: 'llegadas a Chile: <em>19,4 % menos</em>', source: 'Subsecretaría de Turismo, Pulso Turismo' },
      { type: 'stat', at: 'Europa', eyebrow: 'Europa, Norteamérica, Asia y Oceanía', value: 529018, label: 'turistas: <em>13,9 % más</em>, lo más alto desde 2013', body: 'Ese viajero lo busca en internet, <b>y en inglés.</b>', bodyAt: 'viajero', source: 'Subsecretaría de Turismo, Pulso Turismo (1er semestre 2026)' },
    ],
    cta: CTA('¿Su negocio aparece?', 'Webs <em>bilingües</em> para su lugar', 'PORTADA', [`Webs desde ${B.carta}`, 'Segundo idioma', 'Precios en USD']),
  },
};

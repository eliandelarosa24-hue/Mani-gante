// Tarifario interno de Red Vaeru.
// Lo usan el cotizador guiado del sitio y el agente de IA (netlify/functions/agent.mjs).
// El sitio solo muestra los valores "desde"; los rangos completos los entrega el agente.
// Todos los montos en pesos chilenos (CLP), valores referenciales. Edite aquí y se actualiza en todas partes.
// Los sitios web se venden en tres productos (Esencial, Completo y Firma) más la mantención mensual.
// Cada producto tiene precio normal (min/max) y precio de lanzamiento (launch) mientras queden cupos.

export const CURRENCY = 'CLP';

// Precios de lanzamiento con cupos. Actualice "taken" cada vez que cierre un proyecto de lanzamiento.
export const LAUNCH = { slots: 5, taken: 0 };
export const launchLeft = () => Math.max(0, LAUNCH.slots - LAUNCH.taken);

// Garantía de portada: el cliente ve el diseño de su portada antes de pagar.
export const GUARANTEE = {
  title: 'Garantía de portada',
  short: 'Primero ve su portada. Si no le convence, no paga nada.',
  text: 'Antes de cobrar, diseñamos la portada de su sitio con sus fotos y su historia. Si no le convence, no paga nada y no queda comprometido. Si le gusta, firmamos el contrato, paga el 50% para continuar y el resto al publicar.',
};

// Precio vigente de una opción: el de lanzamiento mientras queden cupos, si existe.
export const priceOf = (tier) => (tier?.launch && launchLeft() > 0 ? tier.launch : tier);

// Campaña de temporada: la barra superior desaparece sola después de la fecha límite.
export const CAMPAIGN = {
  deadline: '2026-11-30',
  text: 'Temporada de verano: confirme su sitio antes del 30 de noviembre.',
};

// Tipo de cambio referencial para mostrar precios en USD (clientes del Caribe). Actualícelo cuando cambie.
export const USD_RATE = 950;

export const HOSTING_NOTE = 'Todos los sitios incluyen dominio de regalo el primer año (.com u otras extensiones; el .cl se inscribe aparte en NIC Chile) y hosting con certificado de seguridad el primer año, a su nombre. Desde el segundo año, la renovación va en la mantención mensual o se cotiza aparte.';

export const CONTRACT_NOTE = 'Todo trabajo se formaliza con un contrato de prestación de servicios con Red Vaeru: alcance, plazos, precio, forma de pago y propiedad del sitio quedan por escrito.';

export const TAX_NOTE = 'Valores referenciales en pesos chilenos. Emitimos boleta o factura según lo que necesite su negocio; los impuestos que correspondan se detallan en la propuesta.';

// Los tres productos de sitio web y la mantención, como se presentan en la portada.
export const PLANS = [
  { id: 'esencial', name: 'Esencial', for: 'Para el negocio que hoy solo tiene Instagram o un aviso en Booking.', includes: ['Logo de regalo si aún no tiene', 'Una página con fotos, ubicación y contacto', 'Botón de WhatsApp y formulario', 'Carta digital con QR para restaurantes', 'Textos para aparecer en Google', 'Dominio y hosting el primer año', 'Una ronda de revisión'] },
  { id: 'completo', name: 'Completo', featured: true, for: 'Para cabañas, hostales y restaurantes que quieren recibir reservas directas.', includes: ['Todo lo de Esencial', 'Varias secciones: unidades o carta, servicios, entorno', 'Galería por espacios y mapa', 'Reservas por WhatsApp o enlace a su sistema', 'Ficha de Google configurada', 'Guía para editar textos y fotos'] },
  { id: 'firma', name: 'Firma', for: 'Para termas, hoteles boutique, viñas y glamping que quieren una web única.', includes: ['Todo lo de Completo', 'Concepto y diseño a medida, como las muestras', 'Animaciones e interacción propias del lugar', 'Reservas o calendario integrado', 'Segundo idioma y precios en USD', 'Estrategia de lanzamiento'] },
];

export const SERVICES = {
  web_alojamiento: {
    name: 'Sitio web para alojamiento',
    short: 'Web alojamiento',
    for: 'Cabañas, hostales, glamping, lodges y hoteles boutique',
    tiers: {
      esencial: { label: 'Esencial: una página con todo lo necesario', min: 149000, max: 249000, launch: { min: 49000, max: 79000 }, weeks: '1 a 2 semanas' },
      completo: { label: 'Completo: sitio de varias secciones', min: 390000, max: 690000, launch: { min: 149000, max: 249000 }, weeks: '3 a 4 semanas' },
      firma: { label: 'Firma: experiencia a medida como las muestras', min: 1200000, max: 2800000, launch: { min: 590000, max: 990000 }, weeks: '5 a 8 semanas' },
    },
    addons: {
      reservas: { label: 'Integración de motor de reservas o calendario', min: 30000, max: 60000 },
      checkin: { label: 'Check-in en línea para huéspedes', min: 25000, max: 45000 },
      guia: { label: 'Guía local / blog del destino', min: 20000, max: 35000 },
      idioma: { label: 'Idioma adicional (por idioma)', min: 20000, max: 35000, perUnit: true },
      seo: { label: 'Ficha de Google y posicionamiento local (ya incluida en Completo y Firma)', min: 25000, max: 45000 },
      agente: { label: 'Agente de IA 24/7 que responde y cotiza en su sitio', min: 120000, max: 200000 },
      sheets: { label: 'Registro automático de reservas en Google Sheets', min: 40000, max: 70000 },
      dominio_cl: { label: 'Dominio .cl a su nombre (inscripción en NIC Chile, 1 año)', min: 12000, max: 15000 },
    },
  },
  web_restaurante: {
    name: 'Sitio web para restaurante',
    short: 'Web restaurante',
    for: 'Restaurantes, cafeterías, bares y cocinas de destino',
    tiers: {
      esencial: { label: 'Esencial: carta digital con QR y página', min: 149000, max: 249000, launch: { min: 49000, max: 79000 }, weeks: '1 a 2 semanas' },
      completo: { label: 'Completo: sitio de restaurante con carta, historia y reservas', min: 390000, max: 690000, launch: { min: 149000, max: 249000 }, weeks: '3 a 4 semanas' },
      firma: { label: 'Firma: experiencia gastronómica a medida', min: 1200000, max: 2800000, launch: { min: 590000, max: 990000 }, weeks: '5 a 8 semanas' },
    },
    addons: {
      reservas: { label: 'Reservas de mesa en línea', min: 25000, max: 50000 },
      pedidos: { label: 'Pedidos / delivery guiado por WhatsApp', min: 30000, max: 55000 },
      idioma: { label: 'Idioma adicional (por idioma)', min: 15000, max: 30000, perUnit: true },
      seo: { label: 'Ficha de Google y posicionamiento local (ya incluida en Completo y Firma)', min: 25000, max: 45000 },
      dominio_cl: { label: 'Dominio .cl a su nombre (inscripción en NIC Chile, 1 año)', min: 12000, max: 15000 },
    },
  },
  redes: {
    name: 'Gestión de redes sociales',
    short: 'Redes',
    for: 'Instagram y Facebook con foco en reservas directas',
    monthly: true,
    tiers: {
      esencial: { label: 'Esencial: 8 publicaciones al mes', min: 45000, max: 65000, weeks: 'mes a mes' },
      pro: { label: 'Pro: 12 publicaciones, historias y respuestas', min: 75000, max: 110000, weeks: 'mes a mes' },
    },
    addons: {
      ads: { label: 'Gestión de publicidad pagada (sin incluir inversión)', min: 25000, max: 45000, monthly: true },
    },
  },
  asesoria: {
    name: 'Asesoría turística',
    short: 'Asesoría',
    for: 'Diagnóstico, canales de venta, tarifas, producto y experiencia del huésped',
    tiers: {
      diagnostico: { label: 'Diagnóstico digital (sesión de 90 min + informe)', min: 35000, max: 55000, weeks: '1 semana' },
      plan: { label: 'Plan de canal directo y plataformas (4 sesiones)', min: 120000, max: 180000, weeks: '4 semanas' },
      mensual: { label: 'Acompañamiento mensual', min: 80000, max: 120000, weeks: 'mes a mes', monthly: true },
      proyecto: { label: 'Formulación de proyecto o producto turístico', min: 220000, max: 380000, weeks: '4 a 8 semanas' },
    },
    addons: {
      terreno: { label: 'Visita en terreno (Araucanía)', min: 30000, max: 50000 },
    },
  },
  capacitacion: {
    name: 'Capacitación en servicio al cliente',
    short: 'Capacitación',
    for: 'Equipos de recepción, sala, limpieza y atención turística',
    tiers: {
      taller: { label: 'Taller de 4 horas (hasta 15 personas)', min: 150000, max: 220000, weeks: 'a coordinar' },
      programa: { label: 'Programa de 3 módulos (12 horas)', min: 390000, max: 590000, weeks: '3 a 6 semanas' },
      online: { label: 'Taller online en vivo (hasta 25 personas)', min: 110000, max: 160000, weeks: 'a coordinar' },
    },
    addons: {
      manual: { label: 'Manual de estándares de servicio para su negocio', min: 80000, max: 140000 },
      mystery: { label: 'Cliente incógnito (evaluación previa)', min: 50000, max: 90000 },
    },
    // Personas adicionales sobre el cupo base del taller
    extraPerson: { min: 6000, max: 10000, base: { taller: 15, programa: 15, online: 25 } },
  },
  automatizacion: {
    name: 'Automatización e IA para turismo',
    short: 'IA y automatización',
    for: 'Agentes de IA, registro automático de reservas y procesos sin planillas manuales',
    tiers: {
      sheets: { label: 'Registro automático de reservas y consultas en Google Sheets', min: 60000, max: 100000, weeks: '1 semana' },
      agente: { label: 'Agente de IA 24/7 entrenado con su negocio', min: 150000, max: 250000, weeks: '2 a 3 semanas' },
      integral: { label: 'Hospitalidad inteligente: agente de IA + automatizaciones + panel de reservas', min: 290000, max: 450000, weeks: '3 a 5 semanas' },
    },
    addons: {
      operacion: { label: 'Operación mensual del agente (incluye consumo moderado de IA)', min: 25000, max: 45000, monthly: true },
      recordatorios: { label: 'Mensajes automáticos a huéspedes (confirmación, llegada, reseña)', min: 40000, max: 70000 },
      reporte: { label: 'Reporte mensual automático de reservas y consultas', min: 30000, max: 50000 },
    },
  },
  mantencion: {
    name: 'Mantención y soporte web',
    short: 'Mantención',
    for: 'Cambios de contenido, respaldo, monitoreo y soporte',
    monthly: true,
    tiers: {
      cuidado: { label: 'Cuidado: hosting, dominio, respaldo y un cambio al mes', min: 25000, max: 25000, weeks: 'mes a mes' },
      crecimiento: { label: 'Crecimiento: cambios del mes, ficha de Google e informe de visitas y consultas', min: 55000, max: 55000, weeks: 'mes a mes' },
    },
    addons: {},
  },
};

// Precio "desde" que se muestra en el sitio por servicio (mínimo del tier más bajo).
export function fromPrice(serviceId) {
  const s = SERVICES[serviceId];
  if (!s) return null;
  return Math.min(...Object.values(s.tiers).map((t) => priceOf(t).min));
}

export function formatCLP(n) {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

// Redondea a miles para que los rangos se lean limpios.
const round = (n) => Math.round(n / 1000) * 1000;

/**
 * Calcula un presupuesto estimado y determinista.
 * @param {{items: Array<{service: string, tier: string, addons?: Array<string|{id:string, qty:number}>, participants?: number}>, urgent?: boolean}} input
 */
export function estimate(input) {
  const items = Array.isArray(input?.items) ? input.items : [];
  const lines = [];
  const errors = [];
  let oneMin = 0, oneMax = 0, monMin = 0, monMax = 0;

  const add = (label, min, max, monthly) => {
    lines.push({ label, min: round(min), max: round(max), monthly: !!monthly });
    if (monthly) { monMin += min; monMax += max; } else { oneMin += min; oneMax += max; }
  };

  for (const item of items) {
    const s = SERVICES[item?.service];
    if (!s) { errors.push(`Servicio desconocido: ${item?.service}`); continue; }
    const t = s.tiers[item.tier];
    if (!t) { errors.push(`Opción desconocida para ${s.name}: ${item.tier}`); continue; }
    const monthly = !!(s.monthly || t.monthly);
    const p = priceOf(t);
    add(`${s.name}: ${t.label}${p !== t ? ' (precio de lanzamiento)' : ''}`, p.min, p.max, monthly);

    for (const a of item.addons || []) {
      const id = typeof a === 'string' ? a : a?.id;
      const qty = Math.max(1, Math.min(10, Number(typeof a === 'string' ? 1 : a?.qty) || 1));
      const ad = s.addons[id];
      if (!ad) { errors.push(`Extra desconocido para ${s.name}: ${id}`); continue; }
      const q = ad.perUnit ? qty : 1;
      add(ad.perUnit && q > 1 ? `${ad.label} × ${q}` : ad.label, ad.min * q, ad.max * q, !!(monthly || ad.monthly));
    }

    if (item.service === 'capacitacion' && s.extraPerson) {
      const base = s.extraPerson.base[item.tier] ?? 15;
      const p = Math.max(0, Math.min(200, Number(item.participants) || 0));
      if (p > base) {
        const extra = p - base;
        add(`${extra} participantes adicionales`, extra * s.extraPerson.min, extra * s.extraPerson.max, false);
      }
    }
  }

  if (input?.urgent && oneMax > 0) {
    add('Entrega prioritaria (+20%)', oneMin * 0.2, oneMax * 0.2, false);
  }

  const timelines = items
    .map((i) => SERVICES[i?.service]?.tiers?.[i?.tier]?.weeks)
    .filter(Boolean);

  return {
    currency: CURRENCY,
    lines,
    oneTime: { min: round(oneMin), max: round(oneMax) },
    monthly: { min: round(monMin), max: round(monMax) },
    timelines,
    errors,
    notes: [
      TAX_NOTE,
      'El precio final y fijo llega por escrito en la propuesta, antes de pagar nada.',
      HOSTING_NOTE,
      'Capacitaciones fuera de la Araucanía: traslado y viáticos se cotizan aparte.',
      'Proyectos fuera de Chile se cotizan en USD.',
    ],
  };
}

// Resumen compacto del catálogo para el prompt del agente (texto estable para caché).
export function catalogText() {
  const out = [];
  for (const [id, s] of Object.entries(SERVICES)) {
    out.push(`## ${s.name} (service="${id}")${s.monthly ? ' [mensual]' : ''}\nPara: ${s.for}`);
    for (const [tid, t] of Object.entries(s.tiers)) {
      const per = s.monthly || t.monthly ? ' al mes' : '';
      const launch = t.launch && launchLeft() > 0 ? `; precio de lanzamiento vigente: ${formatCLP(t.launch.min)} a ${formatCLP(t.launch.max)}` : '';
      out.push(`- tier="${tid}": ${t.label}: precio normal ${formatCLP(t.min)} a ${formatCLP(t.max)}${per}${launch} (plazo: ${t.weeks})`);
    }
    for (const [aid, a] of Object.entries(s.addons)) {
      out.push(`  - addon="${aid}": ${a.label}: ${formatCLP(a.min)} a ${formatCLP(a.max)}${a.monthly ? ' al mes' : ''}${a.perUnit ? ' (admite qty)' : ''}`);
    }
    if (s.extraPerson) out.push(`  - participantes sobre el cupo: ${formatCLP(s.extraPerson.min)} a ${formatCLP(s.extraPerson.max)} por persona (usar "participants")`);
  }
  return out.join('\n');
}

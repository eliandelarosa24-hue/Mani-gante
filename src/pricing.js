// Tarifario interno de Red Vaeru.
// Lo usan el cotizador guiado del sitio y el agente de IA (netlify/functions/agent.mjs).
// El sitio solo muestra los valores "desde"; los rangos completos los entrega el agente.
// Todos los montos en pesos chilenos (CLP), sin IVA. Edite aquí y se actualiza en todas partes.

export const CURRENCY = 'CLP';

export const SERVICES = {
  web_alojamiento: {
    name: 'Sitio web para alojamiento',
    short: 'Web alojamiento',
    for: 'Cabañas, hostales, glamping, lodges y hoteles boutique',
    tiers: {
      landing: { label: 'Presencia esencial (1 página)', min: 220000, max: 320000, weeks: '1 a 2 semanas' },
      completo: { label: 'Sitio completo multi-sección', min: 450000, max: 750000, weeks: '3 a 4 semanas' },
      premium: { label: 'Experiencia premium a medida', min: 850000, max: 1400000, weeks: '5 a 8 semanas' },
    },
    addons: {
      reservas: { label: 'Integración de motor de reservas o calendario', min: 150000, max: 300000 },
      checkin: { label: 'Check-in online para huéspedes', min: 120000, max: 200000 },
      guia: { label: 'Guía local / blog del destino', min: 80000, max: 150000 },
      idioma: { label: 'Idioma adicional (por idioma)', min: 90000, max: 150000, perUnit: true },
      seo: { label: 'Posicionamiento local (Google Business + SEO inicial)', min: 120000, max: 220000 },
    },
  },
  web_restaurante: {
    name: 'Sitio web para restaurante',
    short: 'Web restaurante',
    for: 'Restaurantes, cafeterías, bares y cocinas de destino',
    tiers: {
      carta: { label: 'Carta digital con QR', min: 150000, max: 250000, weeks: '1 semana' },
      sitio: { label: 'Sitio completo de restaurante', min: 380000, max: 650000, weeks: '2 a 4 semanas' },
      premium: { label: 'Experiencia gastronómica premium', min: 750000, max: 1200000, weeks: '4 a 6 semanas' },
    },
    addons: {
      reservas: { label: 'Reservas de mesa en línea', min: 120000, max: 250000 },
      pedidos: { label: 'Pedidos / delivery guiado por WhatsApp', min: 150000, max: 280000 },
      idioma: { label: 'Idioma adicional (por idioma)', min: 70000, max: 120000, perUnit: true },
      seo: { label: 'Posicionamiento local (Google Business + SEO inicial)', min: 120000, max: 220000 },
    },
  },
  redes: {
    name: 'Gestión de redes sociales',
    short: 'Redes',
    for: 'Instagram y Facebook con foco en reservas directas',
    monthly: true,
    tiers: {
      esencial: { label: 'Esencial: 8 publicaciones al mes', min: 150000, max: 220000, weeks: 'mes a mes' },
      pro: { label: 'Pro: 12 publicaciones, historias y respuestas', min: 260000, max: 380000, weeks: 'mes a mes' },
    },
    addons: {
      ads: { label: 'Gestión de publicidad pagada (sin incluir inversión)', min: 90000, max: 160000, monthly: true },
    },
  },
  asesoria: {
    name: 'Asesoría turística',
    short: 'Asesoría',
    for: 'Diagnóstico, canales de venta, tarifas, producto y experiencia del huésped',
    tiers: {
      diagnostico: { label: 'Diagnóstico digital (sesión de 90 min + informe)', min: 70000, max: 110000, weeks: '1 semana' },
      plan: { label: 'Plan de canal directo y OTAs (4 sesiones)', min: 280000, max: 450000, weeks: '4 semanas' },
      mensual: { label: 'Acompañamiento mensual', min: 180000, max: 300000, weeks: 'mes a mes', monthly: true },
      proyecto: { label: 'Formulación de proyecto o producto turístico', min: 450000, max: 900000, weeks: '4 a 8 semanas' },
    },
    addons: {
      terreno: { label: 'Visita en terreno (Araucanía)', min: 60000, max: 120000 },
    },
  },
  capacitacion: {
    name: 'Capacitación en servicio al cliente',
    short: 'Capacitación',
    for: 'Equipos de recepción, sala, housekeeping y atención turística',
    tiers: {
      taller: { label: 'Taller de 4 horas (hasta 15 personas)', min: 320000, max: 480000, weeks: 'a coordinar' },
      programa: { label: 'Programa de 3 módulos (12 horas)', min: 850000, max: 1300000, weeks: '3 a 6 semanas' },
      online: { label: 'Taller online en vivo (hasta 25 personas)', min: 240000, max: 360000, weeks: 'a coordinar' },
    },
    addons: {
      manual: { label: 'Manual de estándares de servicio para su negocio', min: 180000, max: 320000 },
      mystery: { label: 'Cliente incógnito (evaluación previa)', min: 120000, max: 220000 },
    },
    // Personas adicionales sobre el cupo base del taller
    extraPerson: { min: 15000, max: 25000, base: { taller: 15, programa: 15, online: 25 } },
  },
  mantencion: {
    name: 'Mantención y soporte web',
    short: 'Mantención',
    for: 'Cambios de contenido, respaldo, monitoreo y soporte',
    monthly: true,
    tiers: {
      basica: { label: 'Mantención mensual', min: 25000, max: 45000, weeks: 'mes a mes' },
    },
    addons: {},
  },
};

// Precio "desde" que se muestra en el sitio por servicio (mínimo del tier más bajo).
export function fromPrice(serviceId) {
  const s = SERVICES[serviceId];
  if (!s) return null;
  return Math.min(...Object.values(s.tiers).map((t) => t.min));
}

export function formatCLP(n) {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

// Redondea a miles para que los rangos se lean limpios.
const round = (n) => Math.round(n / 5000) * 5000;

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
    add(`${s.name}: ${t.label}`, t.min, t.max, monthly);

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
      'Valores referenciales en pesos chilenos, sin IVA.',
      'El precio final y fijo llega por escrito en la propuesta, antes de pagar nada.',
      'Dominio y hosting se compran a nombre del cliente; suelen costar entre $15.000 y $40.000 al año.',
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
      out.push(`- tier="${tid}": ${t.label}: ${formatCLP(t.min)} a ${formatCLP(t.max)}${s.monthly || t.monthly ? ' al mes' : ''} (plazo: ${t.weeks})`);
    }
    for (const [aid, a] of Object.entries(s.addons)) {
      out.push(`  - addon="${aid}": ${a.label}: ${formatCLP(a.min)} a ${formatCLP(a.max)}${a.monthly ? ' al mes' : ''}${a.perUnit ? ' (admite qty)' : ''}`);
    }
    if (s.extraPerson) out.push(`  - participantes sobre el cupo: ${formatCLP(s.extraPerson.min)} a ${formatCLP(s.extraPerson.max)} por persona (usar "participants")`);
  }
  return out.join('\n');
}

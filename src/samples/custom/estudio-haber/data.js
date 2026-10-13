// Estudio Haber · datos de la muestra. Negocio, personas y clientes ficticios.
// Las cifras tributarias son referenciales y se revisan cada año.

// Boletas y facturas de la caja de zapatos (hero). tipo F = factura (da crédito fiscal), B = boleta.
export const RECEIPTS = [
  { d: '02-09', who: 'Ferretería El Roble', what: 'Pintura y brochas', t: 'F', total: 48790 },
  { d: '03-09', who: 'Molino Cautín', what: 'Harina 25 kg × 8', t: 'F', total: 186200 },
  { d: '04-09', who: 'Servicentro Labranza', what: 'Diésel camioneta', t: 'B', total: 62000 },
  { d: '05-09', who: 'Imprenta Bulnes', what: 'Bolsas de papel timbradas', t: 'F', total: 94010 },
  { d: '06-09', who: 'Feria Pinto · Don Lucho', what: 'Huevos y mantequilla', t: 'B', total: 38500 },
  { d: '09-09', who: 'Frigorífico Ñielol', what: 'Arriendo cámara de frío', t: 'F', total: 119000 },
  { d: '10-09', who: 'Librería Universitaria', what: 'Talonarios y archivadores', t: 'B', total: 12890 },
  { d: '11-09', who: 'Gasfitería Pedro Quilaqueo', what: 'Reparación horno', t: 'F', total: 71400 },
  { d: '12-09', who: 'Distribuidora Pitrufquén', what: 'Azúcar y levadura', t: 'F', total: 143360 },
  { d: '15-09', who: 'Electricidad del Sur', what: 'Cuenta de luz', t: 'F', total: 212480 },
  { d: '16-09', who: 'Transportes Cholchol', what: 'Despacho a Villarrica', t: 'F', total: 35700 },
  { d: '17-09', who: 'Supermercado La Frontera', what: 'Insumos de aseo', t: 'B', total: 21340 },
  { d: '22-09', who: 'Agrícola Las Encinas', what: 'Frambuesas 10 kg', t: 'F', total: 59500 },
  { d: '23-09', who: 'Telefonía Araucanía', what: 'Plan internet local', t: 'F', total: 29990 },
  { d: '24-09', who: 'Cartonajes Lautaro', what: 'Cajas para tortas', t: 'F', total: 66640 },
  { d: '26-09', who: 'Botillería La Esquina', what: 'Bebidas para la fonda', t: 'B', total: 18900 },
  { d: '29-09', who: 'Prevención Sur Capacitaciones', what: 'Capacitación manipulación', t: 'F', total: 47600 },
  { d: '30-09', who: 'Gas Cautín', what: 'Cilindros 45 kg × 3', t: 'F', total: 154350 },
];

// Feriados nacionales de Chile (para correr los vencimientos al día hábil siguiente).
export const HOLIDAYS = [
  '2026-01-01', '2026-04-03', '2026-04-04', '2026-05-01', '2026-05-21', '2026-06-21', '2026-06-29', '2026-07-16', '2026-08-15', '2026-09-18', '2026-09-19', '2026-10-12', '2026-10-31', '2026-11-01', '2026-12-08', '2026-12-25',
  '2027-01-01', '2027-03-26', '2027-03-27', '2027-05-01', '2027-05-21', '2027-06-21', '2027-06-28', '2027-07-16', '2027-08-15', '2027-09-17', '2027-09-18', '2027-09-19', '2027-10-11', '2027-10-31', '2027-11-01', '2027-12-08', '2027-12-25',
];

export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// El año tributario, mes a mes: lo que vence y lo que hace el estudio por usted.
export const YEAR = [
  { k: 'Patente', t: 'Patente municipal, 1.ª cuota', d: 'Vence el 31 de enero. Revisamos el capital propio declarado para que no pague de más.', h: 1 },
  { k: 'Calma', t: 'Mes de vacaciones', d: 'Cerramos el inventario de diciembre y preparamos los antecedentes de la Renta.', h: 0 },
  { k: 'DJ', t: 'Declaraciones juradas', d: 'Honorarios, sueldos, retiros y dividendos. Las presentamos todas, a tiempo.', h: 2 },
  { k: 'Renta', t: 'Operación Renta (F22)', d: 'Todo abril. La empresa y sus dueños declaran; usted solo firma y revisa con nosotros.', h: 3 },
  { k: 'Devolución', t: 'Llegan las devoluciones', d: 'Seguimos su devolución en el SII y respondemos cualquier observación.', h: 1 },
  { k: 'Balance', t: 'Balance para el banco', d: 'Época de créditos y renovaciones: le dejamos el balance firmado y explicado.', h: 1 },
  { k: 'Patente', t: 'Patente municipal, 2.ª cuota', d: 'Vence el 31 de julio. Además, revisión de mitad de año del PPM.', h: 1 },
  { k: 'Proyección', t: 'Proyección de impuestos', d: 'Calculamos cómo viene su Renta del próximo abril, con tiempo para decidir.', h: 1 },
  { k: 'Fiestas', t: 'Aguinaldos y fondas', d: 'Liquidamos aguinaldos y le avisamos qué gastos de septiembre sí se pueden rebajar.', h: 1 },
  { k: 'Planificación', t: 'Planificación tributaria', d: 'Última ventana para invertir, retirar o reinvertir con cabeza antes del cierre.', h: 2 },
  { k: 'Inventario', t: 'Preparar el inventario', d: 'Le dejamos la planilla y el procedimiento para contar mercadería el 31.', h: 1 },
  { k: 'Cierre', t: 'Cierre del ejercicio', d: 'Ajustes, depreciaciones y aguinaldo de Navidad. Cerramos el año juntos.', h: 2 },
];

// Planes mensuales (valores netos referenciales)
export const PLANS = [
  { id: 'emprende', name: 'Emprende', base: 45000, docs: 30, workers: 0, kicker: 'Recién partiendo', items: ['Inicio de actividades incluido', 'F29 mensual', 'Boletas y facturas electrónicas', 'Operación Renta del dueño'] },
  { id: 'pyme', name: 'Pyme', base: 120000, docs: 150, workers: 2, kicker: 'El más elegido', items: ['Contabilidad completa', 'F29 y Operación Renta', 'Balance anual firmado', 'Hasta 2 trabajadores'] },
  { id: 'pymeplus', name: 'Pyme+', base: 190000, docs: 400, workers: 6, kicker: 'Con equipo', items: ['Todo lo del plan Pyme', 'Remuneraciones y Previred', 'Contratos y finiquitos', 'Reunión mensual de resultados'] },
];
export const EXTRA_WORKER = 9000;
export const EXTRA_DOCS = 12000; // cada 100 documentos adicionales

// Clientes (casos ficticios con fotografía propia)
export const CASES = [
  { slot: 'panaderia', name: 'Panadería Las Encinas', place: 'Padre Las Casas', since: 2017, tab: '#c9a878',
    before: 'Tres años de IVA declarado a destiempo y una caja de zapatos por mes.', after: 'Convenio con Tesorería, multas rebajadas y al día en cuatro meses.',
    stats: [['−62%', 'en multas tras la condonación'], ['4', 'meses para quedar al día']], quote: 'Ahora el día 15 me llega el WhatsApp con el IVA y ya no pierdo el sueño.', who: 'Rosa M., panadera' },
  { slot: 'taller', name: 'Taller Mecánico Quilaqueo', place: 'Temuco, sector Amanecer', since: 2019, tab: '#9fb3a5',
    before: 'Boletas de honorarios a los mecánicos y ningún contrato firmado.', after: 'Cuatro trabajadores con contrato, Previred al día y crédito para un elevador nuevo.',
    stats: [['4', 'trabajadores formalizados'], ['$18 M', 'de crédito aprobado']], quote: 'El banco me pidió el balance y lo tenía al otro día.', who: 'Pedro Q., mecánico' },
  { slot: 'campo', name: 'Agrícola Los Arándanos', place: 'Pitrufquén', since: 2021, tab: '#b9a4c4',
    before: 'Exportaba arándanos y no recuperaba el IVA de sus compras.', after: 'Solicitud de devolución del IVA exportador cada mes y régimen Pro Pyme.',
    stats: [['$7,4 M', 'de IVA recuperado el primer año'], ['14 D', 'régimen Pro Pyme']], quote: 'No sabía que esa plata era mía.', who: 'Familia Henríquez' },
  { slot: 'almacen', name: 'Almacén Doña Elena', place: 'Lautaro', since: 2012, tab: '#d9a38c',
    before: 'Vendía sin boleta electrónica y temía una fiscalización.', after: 'Máquina de boletas, inventario simple y patente al día.',
    stats: [['14', 'años de cliente'], ['0', 'fiscalizaciones con problemas']], quote: 'Me explicaron todo con palabras de almacén.', who: 'Elena S., almacenera' },
];

// Clientes por comuna (para el mapa). Coordenadas aproximadas.
export const COMMUNES = [
  ['Temuco', -38.739, -72.598, 74], ['Padre Las Casas', -38.766, -72.597, 18], ['Villarrica', -39.282, -72.227, 16], ['Pucón', -39.272, -71.977, 11],
  ['Angol', -37.795, -72.716, 7], ['Victoria', -38.232, -72.333, 6], ['Lautaro', -38.531, -72.435, 9], ['Nueva Imperial', -38.744, -72.95, 6],
  ['Pitrufquén', -38.986, -72.643, 8], ['Carahue', -38.712, -73.165, 4], ['Freire', -38.953, -72.623, 5], ['Curacautín', -38.441, -71.889, 4],
  ['Loncoche', -39.367, -72.632, 5], ['Valdivia', -39.814, -73.246, 7],
];

export const TEAM = [
  ['Carolina Painemal', 'Socia fundadora · Contadora auditora', 'Tributación pyme'],
  ['Andrés Riquelme', 'Socio · Contador auditor', 'Regímenes y planificación'],
  ['Valentina Sáez', 'Contadora', 'Remuneraciones'],
  ['Matías Huenchumil', 'Contador', 'Sector agrícola'],
  ['Javiera Toledo', 'Contadora', 'Comercio y turismo'],
  ['Felipe Cayupán', 'Técnico contable', 'IVA y libros'],
  ['Ignacia Ortiz', 'Asistente', 'Agenda y documentos'],
];

export const NOTES = [
  { t: 'Me ordenaron siete años de papeles en un mes. Ahora entiendo mis números.', who: 'Cabañas Río Allipén', place: 'Melipeuco', r: -2.5 },
  { t: 'Contestan el WhatsApp el mismo día, incluso en abril.', who: 'Ferretería Los Boldos', place: 'Victoria', r: 1.8 },
  { t: 'Pasé al régimen Pro Pyme y pagué bastante menos impuesto en la Renta.', who: 'Transportes Ñielol', place: 'Temuco', r: -1.2 },
  { t: 'Mi primera empresa, mi primera factura, y no me sentí perdida nunca.', who: 'Estudio de diseño Kümé', place: 'Pucón', r: 2.6 },
];

export const FAQ = [
  ['¿Qué necesito para el diagnóstico gratuito?', 'Su RUT, la clave del SII si la tiene a mano y, si existe, la famosa caja de zapatos. En 30 minutos le decimos dónde está parado y cuánto costaría ponerse al día.'],
  ['Estoy atrasado con el SII. ¿Me pueden ayudar?', 'Es lo que más hacemos. Declaramos lo pendiente, pedimos condonación de multas e intereses cuando corresponde y gestionamos convenios de pago con la Tesorería.'],
  ['¿Atienden fuera de Temuco?', 'Sí. La mitad de nuestros clientes están en otras comunas de La Araucanía y Los Ríos; trabajamos por videollamada, WhatsApp y correo, y vamos a terreno cuando hace falta.'],
  ['¿Cuánto demora el inicio de actividades?', 'Con los antecedentes completos, 48 horas hábiles. Le entregamos la empresa creada, el inicio de actividades hecho y la facturación electrónica funcionando.'],
  ['¿Qué pasa en abril?', 'Abril es nuestro mes. Preparamos su Operación Renta desde febrero y le citamos a revisar el F22 antes de enviarlo. Atendemos también los sábados.'],
  ['¿Puedo cambiarme de contador a mitad de año?', 'Sí. Pedimos los respaldos a su contador anterior, revisamos lo declarado y tomamos la contabilidad desde el mes siguiente.'],
];

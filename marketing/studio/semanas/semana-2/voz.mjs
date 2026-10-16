// Semana 2: guiones de voz en off (voz F o M, duración máxima y anclas por escena).
export const SCRIPTS = {
  R05: { voice: 'F', max: 15.5, anchors: [[0, 'Cuatro'], [3, 'Conversamos'], [8, 'Diseño'], [12.5, 'Publicamos']], sub: 'Cuatro pasos, cero sorpresas. Conversamos sobre su negocio y le envío precio fijo por escrito. Diseño con su revisión. Publicamos, y usted queda capacitado.' },
  R06: { voice: 'M', max: 13.5, sub: 'Si sus termas tuvieran su propia web, cada pozón tendría su temperatura, y sus huéspedes vivirían la experiencia antes de llegar. Esta es una muestra de concepto. ¿Hacemos la suya?' },
  R07: { voice: 'F', max: 13.5, sub: 'Un café con historia merece más que una foto de la carta: sus kuchen, su familia, su lago, y encargos por WhatsApp. Esta es una muestra de concepto. Escríbame CARTA.' },
  R08: { voice: 'M', max: 13.5, sub: 'Un hotel boutique vende una experiencia. Sus habitaciones, su restaurante y su ciudad, contados como un álbum. Es el plan Firma: diseño a medida para su lugar.' },
};

// Reels rehechos con edición humana y voz fija (del 23 de octubre en adelante).
const VOZ_FIJA = { voice: 'F', voiceId: 'hpp4J3VqNfWAUOO0d1Us', settings: { stability: 0.32, style: 0.5, speed: 1.06 } };
Object.assign(SCRIPTS, {
  R05E: { ...VOZ_FIJA, max: 32, sub: '¿Le da miedo contratar una web y que le salga cualquier cosa? Le muestro exactamente cómo trabajo. Cuatro pasos. Uno: conozco su lugar. Dos: le mando precio fijo, por escrito, con contrato. Tres: diseño con su revisión, y primero ve su portada. Si no le convence, no paga. Cuatro: publicamos, y usted queda capacitado. Cero sorpresas. Escríbame PORTADA.' },
  R06E: { ...VOZ_FIJA, max: 32, sub: 'Siete pozones. Siete temperaturas. ¿Cómo vende eso en una foto de Booking? Mire esta muestra. Una pasarela que recorre la quebrada. Cada pozón con su temperatura, su tamaño y su historia. Y hasta un ritual: calor, frío y descanso, con un reloj para respirar. Es una muestra de concepto para termas del sur. ¿Hacemos la suya? Escríbame PORTADA.' },
  R07E: { ...VOZ_FIJA, max: 32, sub: 'Hay cafés donde el kuchen se acaba antes de las once. ¿Y cómo se entera el cliente? Mire. La historia de la abuela, en la portada. La vitrina de hoy, con lo que acaba de salir del horno. Y cada kuchen con su precio, por porción o entero, para encargar por WhatsApp. Es una muestra de concepto. ¿Su café tiene historia? Escríbame CARTA.' },
  R08E: { ...VOZ_FIJA, max: 34, sub: 'Esta casa sobrevivió al terremoto de mil novecientos sesenta. ¿Su web lo contaría? Un hotel boutique no vende camas: vende una historia. Mire. La fachada de antes y la de hoy, una al lado de la otra. El libro de registro, con cada año de la casa. Y sus vitrales, como si ya estuviera ahí. Es una muestra de concepto: el plan Firma, diseño a medida. ¿Le cuento cómo sería la suya? Escríbame PORTADA.' },
});

// Semana 4: guiones de voz en off (voz F o M, duración máxima y anclas por escena).
export const SCRIPTS = {
  R13: { voice: 'F', max: 15.5, anchors: [[0, 'Quedan'], [3.5, 'Sitios'], [9, 'Cuando']], sub: 'Quedan los últimos cupos de lanzamiento. Sitios desde cuarenta y nueve mil pesos, cuando el precio normal parte en ciento cuarenta y nueve mil. Cuando se completen, rige el precio normal.' },
  R14: { voice: 'M', max: 13.5, sub: 'Una viña no vende botellas: vende una tarde entre barricas. La casona, la cava y las catas, con reserva de visitas. Esta es una muestra de concepto.' },
  R15: { voice: 'F', max: 13.5, sub: 'Del sur de Chile al Caribe. Unas villas frente al mar, cada una con su historia, y precios en dólares. Esta es una muestra de concepto. También trabajo en el Caribe.' },
  R16: { voice: 'M', max: 14.5, sub: 'El Rincón de los Poetas, en Almagro, tiene su propia web: su historia, sus espacios y un canal directo para reservar. Faltan quince días para el treinta de noviembre. ¿Y su lugar?' },
};

// Reels rehechos con edición humana y voz fija (del 23 de octubre en adelante).
const VOZ_FIJA = { voice: 'F', voiceId: 'hpp4J3VqNfWAUOO0d1Us', settings: { stability: 0.32, style: 0.5, speed: 1.06 } };
Object.assign(SCRIPTS, {
  R13E: { ...VOZ_FIJA, max: 32, sub: 'Esto se acaba. Los precios de lanzamiento son solo para mis primeros cinco clientes. Sitios desde cuarenta y nueve mil pesos, cuando el precio normal parte en ciento cuarenta y nueve mil. ¿Por qué tan barato? Porque a cambio le pido tres cosas: un testimonio, permiso para mostrar el trabajo, y que me cuente cómo le fue. Cuando se completen los cupos, rige el precio normal. Escríbame PORTADA.' },
  R14E: { ...VOZ_FIJA, max: 32, sub: 'Una viña no vende botellas. Vende una tarde entre barricas. Mire esta muestra. Tres generaciones, contadas en la portada. Las hectáreas, las etiquetas y las cosechas, en números. Y la enóloga que lo recibe. Todo para reservar una visita o una cata, directo. Es una muestra de concepto: el plan Firma, diseño a medida. ¿Su viña tiene historia? Escríbame PORTADA.' },
  R15E: { ...VOZ_FIJA, max: 30, sub: 'Del sur de Chile… al Caribe. Sí, también trabajo allá. Mire esta muestra, para unas villas en Samaná. Cinco villas, cinco colores, cada una con su historia. Y la temporada de ballenas, del quince de enero al veinticinco de marzo. Precios en dólares y reserva directa. Es una muestra de concepto. ¿Tiene un lugar en el Caribe? Escríbame.' },
  R16E: { ...VOZ_FIJA, max: 32, sub: '¿Un hostal donde la poesía se quedó a vivir? Hoy le muestro qué cambió. El Rincón de los Poetas, en Almagro, ahora tiene su propia web: su historia, sus cinco habitaciones, su nueve coma ocho en Booking, y un canal directo para reservar. Faltan quince días para el treinta de noviembre. Carta QR y Esencial todavía alcanzan. ¿Y su lugar? Escríbame PORTADA.' },
});

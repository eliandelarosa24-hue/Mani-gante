// Semana 3: guiones de voz en off (voz F o M, duración máxima y anclas por escena).
export const SCRIPTS = {
  R09: { voice: 'F', max: 13.5, sub: '¿Cuánto le paga a las apps de delivery? En este ejemplo, ciento veinte pedidos de quince mil pesos, con veinticinco por ciento de comisión: cinco millones cuatrocientos mil al año. Escríbame CARTA.' },
  R10: { voice: 'M', max: 13.5, sub: 'Su cabaña, frente al lago. Cada cabaña con su nombre y sus fotos, y la reserva directo por WhatsApp. Esta es una muestra de concepto. ¿Le muestro la suya?' },
  R11: { voice: 'F', max: 13.5, sub: 'Un tour se vende con la experiencia. Cada salida con su nivel, sus fotos y los guías que la acompañan. Esta es una muestra de concepto. ¿Hacemos la suya?' },
  R12: { voice: 'M', max: 15.5, anchors: [[0, '¿Qué'], [3.5, 'Seis'], [10, 'Recibe']], sub: '¿Qué tan independiente es su negocio de las plataformas? Seis preguntas, un minuto. Recibe su puntaje y las tres mejoras que más le conviene hacer primero. Es gratis.' },
};

// Reels rehechos con edición humana y voz fija (del 23 de octubre en adelante).
const VOZ_FIJA = { voice: 'F', voiceId: 'hpp4J3VqNfWAUOO0d1Us', settings: { stability: 0.32, style: 0.5, speed: 1.06 } };
Object.assign(SCRIPTS, {
  R09E: { ...VOZ_FIJA, max: 34, sub: '¿Cuánto le paga a las apps de delivery? No al mes. Al año. Haga la cuenta conmigo. Ciento veinte pedidos al mes. Dieciocho mil pesos cada uno. Veinticinco por ciento de comisión. Son seis millones cuatrocientos ochenta mil pesos al año. Y si solo un treinta por ciento le pidiera directo, recupera casi dos millones. La calculadora es gratis, en mi web. Escríbame CARTA.' },
  R10E: { ...VOZ_FIJA, max: 32, sub: 'Antes de las nueve, el lago es un espejo. ¿Su web lo muestra… o muestra una lista de precios? Mire esta muestra. Una portada que se siente como despertar en el muelle. El amanecer y los kayaks. Y un mapa del lago, donde cada cabaña tiene su nombre, su capacidad y su precio. Es una muestra de concepto. ¿Le muestro la suya? Escríbame PORTADA.' },
  R11E: { ...VOZ_FIJA, max: 32, sub: '¿Cómo se vende un volcán activo con una foto? Mire esta muestra. Una portada que dice exactamente lo que va a vivir. La ruta al cráter, metro a metro, hasta los dos mil ochocientos cuarenta y siete. Y cada salida con su nivel, su precio y su botón para reservar. Es una muestra de concepto para tours y aventura. ¿Hacemos la suya? Escríbame PORTADA.' },
  R12E: { ...VOZ_FIJA, max: 34, sub: 'Una pregunta incómoda. Si mañana la plataforma le baja el aviso, ¿cuántas reservas le quedan? Hice un diagnóstico para saberlo. Seis preguntas, un minuto. Por dónde le llegan las reservas, si tiene web, sus fotos, cuánto tarda en responder. Y al final, su puntaje y las tres mejoras que más le conviene hacer primero. Es gratis, en mi web. Y si quiere, se lo reviso yo. Escríbame PORTADA.' },
});

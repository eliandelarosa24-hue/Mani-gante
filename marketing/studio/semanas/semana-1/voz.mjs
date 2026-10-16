// Semana 1: guiones de voz en off (say/sub, voz F o M, duración máxima y anclas por escena).
export const SCRIPTS = {
  P02: { voice: 'F', max: 14.5, sub: 'Esta es la web de Cabañas Miah y Noah, en Curacautín. Sus huéspedes ven las cabañas, la galería y la zona, y reservan directo por WhatsApp. ¿Quiere una así? Escríbame PORTADA.' },
  P04: { voice: 'M', max: 25.5, sub: 'Diseñé diez muestras para el turismo del sur: termas, cabañas, domos, una viña, cocina mapuche. No son clientes: son ideas de lo que se puede hacer. ¿Cuál se parece a su negocio? Coménteme el número y le cuento cómo sería la suya.' },
  P06: { voice: 'M', max: 14.5, sub: 'El Rincón de los Poetas, en Almagro, tenía una historia que no se veía en ninguna plataforma. Ahora tiene su propia web, que la cuenta, y un canal directo para reservar. ¿Su lugar también tiene una historia?' },
  R01: { voice: 'F', max: 13.5, sub: '¿Sabe cuánto le dejó a la plataforma este año? Diez reservas al mes, a noventa mil, con quince por ciento de comisión: un millón seiscientos veinte mil al año. Haga la cuenta con sus números.' },
  R02: { voice: 'M', max: 13, sub: 'Su carta puede ser una experiencia: sus platos, su historia y un botón de WhatsApp para pedir. Un QR en cada mesa, y usted cambia los precios cuando quiera. Escríbame CARTA.' },
  R03: { voice: 'F', max: 16.5, anchors: [[0, 'Esto'], [3, 'reservas'], [6.5, 'Su propia'], [10, 'Check-in'], [13.5, 'Y sus']], sub: 'Esto es lo que un aviso en una plataforma no le da: reservas por WhatsApp, directo con usted. Su propia guía de la zona. Check-in en línea. Y sus reseñas, en su propia casa.' },
  R04: { voice: 'M', max: 11.5, sub: 'Si su glamping tuviera su propia web, el cielo sería el protagonista, y sus domos se reservarían directo. Esta es una muestra de concepto. ¿Hacemos la suya?' },
};

// Reediciones con edición humana (voz fija), para publicar del 16 al 22 de octubre.
const VOZ_FIJA = { voice: 'F', settings: { stability: 0.32, style: 0.5, speed: 1.06 } };
Object.assign(SCRIPTS, {
  P02E: { ...VOZ_FIJA, max: 32, sub: 'Esta cabaña de Curacautín ya no depende solo de Booking. Mire. Las fotos, ordenadas por espacio. Una guía con los parques y lagunas de la zona. Y el botón que más importa: reservar directo por WhatsApp. Nicole, coanfitriona de Miah y Noah, lo dice así: ahora nuestros huéspedes nos encuentran y reservan directo. ¿Quiere una así? Escríbame PORTADA.' },
  P04E: { ...VOZ_FIJA, max: 34, sub: 'Nueve negocios del sur. Nueve webs distintas. ¿Cuál se parece al suyo? Uno: termas. Dos: cabañas frente al lago. Tres: domos bajo las estrellas. Cuatro: tours de aventura. Cinco: una viña. Seis: cocina de fuego. Siete: café y pastelería. Ocho: hotel boutique. Nueve: villas en el Caribe. Son muestras de concepto: ideas de lo que se puede hacer. Coménteme el número, y le cuento cómo sería la suya.' },
  P06E: { ...VOZ_FIJA, max: 32, sub: '¿Un hostal donde la poesía se quedó a vivir? Existe. Está en Almagro, Nueva Imperial, donde nació Juvencio Valle, Premio Nacional de Literatura. El Rincón de los Poetas lo cuenta en su propia web: su historia, sus cinco habitaciones, su nota de nueve coma ocho en Booking, y un canal directo para reservar. ¿Su lugar también tiene una historia? Escríbame PORTADA.' },
  R02E: { ...VOZ_FIJA, max: 34, sub: '¿Todavía imprime la carta cada vez que sube un precio? Mire esto. Una carta digital, con sus platos, su historia y un botón para pedir por WhatsApp. Un QR en cada mesa, y usted cambia los precios desde el celular. Y si vende por delivery, haga la cuenta: ciento veinte pedidos al mes, con veinticinco por ciento de comisión… cinco millones cuatrocientos mil pesos al año. Carta QR desde cuarenta y nueve mil pesos. Escríbame CARTA.' },
});

// Reels rehechos con edición humana y voz fija (del 23 de octubre en adelante).
const VOZ_FIJA2 = { voice: 'F', voiceId: 'hpp4J3VqNfWAUOO0d1Us', settings: { stability: 0.32, style: 0.5, speed: 1.06 } };
Object.assign(SCRIPTS, {
  R03E: { ...VOZ_FIJA2, max: 36, sub: '¿Su cabaña está solo en Booking? Entonces hay cuatro cosas que su aviso nunca le va a dar. Uno: que le reserven directo, por WhatsApp. Dos: su propia guía de la zona, con parques y lagunas. Tres: check-in en línea, antes de llegar. Y cuatro: sus reseñas, en su propia casa. Así lo hicieron Cabañas Miah y Noah, en Curacautín. ¿Quiere lo mismo? Escríbame PORTADA.' },
  R04E: { ...VOZ_FIJA2, max: 32, sub: 'En la ciudad se ven unas trescientas estrellas. Lejos de las luces, miles. Eso es lo que vende un glamping… y casi nunca se ve en su aviso. Mire. Una portada que es puro cielo. La luna de esta noche, en vivo. Y cada domo con su techo transparente, listo para reservar directo. Es una muestra de concepto. ¿Hacemos la de su glamping? Escríbame PORTADA.' },
});

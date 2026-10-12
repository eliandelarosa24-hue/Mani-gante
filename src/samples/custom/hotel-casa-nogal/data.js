// Casa Nogal · datos de la casona: doce habitaciones con nombre de lugares del río, la historia
// en el libro de registro, la carta, las postales de Valdivia y la lluvia de cada mes.
export const CATS = {
  clasica: { n: 'Clásica', price: 98000, photo: 'hab-clasica', color: '#3c4a36', cap: 2 },
  rio: { n: 'Superior Río', price: 132000, photo: 'hab-rio', color: '#4d6470', cap: 2 },
  suite: { n: 'Suite', price: 179000, photo: 'hab-suite', color: '#6e1f24', cap: 3 },
  torreon: { n: 'Torreón', price: 159000, photo: 'hab-torreon', color: '#a88444', cap: 2 },
};

export const ROOMS = [
  { no: 1, n: 'Collico', cat: 'clasica', floor: 'Planta baja', m2: 22, bed: 'Queen', view: 'Jardín y nogal', feats: ['Accesible', 'Salida al jardín', 'Escritorio de época'], d: 'La más tranquila de la casa, con una puerta-ventana al jardín y al nogal de 1910.' },
  { no: 2, n: 'Las Ánimas', cat: 'clasica', floor: 'Planta baja · base del torreón', m2: 24, bed: 'King', view: 'Jardín', feats: ['Accesible', 'Muros curvos', 'Ducha a ras de piso'], d: 'Ocupa la base del torreón: sus muros son curvos y la cama mira hacia la ventana redonda.' },
  { no: 3, n: 'Calle-Calle', cat: 'rio', floor: 'Primer piso', m2: 30, bed: 'King', view: 'Río Calle-Calle', feats: ['Chimenea', 'Dos sillones de lectura', 'Ventanal al río'], d: 'Tres ventanas sobre el río y una chimenea encendida desde las cinco de la tarde.' },
  { no: 4, n: 'Cau-Cau', cat: 'rio', floor: 'Primer piso', m2: 31, bed: 'King', view: 'Río y puente Cau-Cau', feats: ['Bow window', 'Tina', 'Cafetera de émbolo'], d: 'Su bow window se asoma al río como un pequeño balcón cerrado. Desde ahí se ven pasar los botes.' },
  { no: 5, n: 'Biblioteca', cat: 'suite', floor: 'Primer piso', m2: 45, bed: 'King + sofá cama', view: 'Río y jardín', feats: ['Tina de patas', '1.200 libros', 'Balcón', 'Living'], d: 'La antigua biblioteca de la familia: estantes de piso a cielo, tina de patas y balcón sobre el río.' },
  { no: 6, n: 'Isla Teja', cat: 'clasica', floor: 'Primer piso', m2: 22, bed: 'Queen', view: 'Jardín', feats: ['Vitral original', 'Escritorio', 'Ropa de cama de algodón egipcio'], d: 'Conserva el único vitral de dormitorio que sobrevivió al terremoto de 1960.' },
  { no: 7, n: 'Cutipay', cat: 'clasica', floor: 'Primer piso · torreón', m2: 21, bed: 'Queen', view: 'Calle de los Robles', feats: ['Muros curvos', 'Ventana redonda', 'Rincón de lectura'], d: 'Pequeña y curva, en el primer piso del torreón. Ideal para quien viaja con un libro.' },
  { no: 8, n: 'Niebla', cat: 'rio', floor: 'Segundo piso', m2: 29, bed: 'King', view: 'Río y cerros', feats: ['Techo inclinado', 'Lucarna', 'Sillón frente al río'], d: 'Bajo el techo inclinado, con una lucarna que deja ver el río de punta a punta.' },
  { no: 9, n: 'Corral', cat: 'rio', floor: 'Segundo piso', m2: 30, bed: 'King', view: 'Río', feats: ['Vigas a la vista', 'Tina', 'Cama mirando al río'], d: 'Vigas de roble pellín a la vista y la cama de frente al agua.' },
  { no: 10, n: 'Mancera', cat: 'suite', floor: 'Segundo piso', m2: 42, bed: 'King', view: 'Río y jardín', feats: ['Tina en la lucarna', 'Living', 'Tocadiscos', 'Vigas originales'], d: 'La suite bajo el techo: una tina en la lucarna, un living y un tocadiscos con jazz de los cincuenta.' },
  { no: 11, n: 'Pichoy', cat: 'clasica', floor: 'Segundo piso · torreón', m2: 20, bed: 'Queen', view: 'Jardín y techos', feats: ['Buhardilla', 'Claraboya', 'La más económica'], d: 'Una buhardilla íntima con claraboya: de noche se escucha la lluvia sobre las tejuelas.' },
  { no: 12, n: 'Torreón', cat: 'torreon', floor: 'Lo alto del torreón', m2: 26, bed: 'King', view: '360° sobre Valdivia', feats: ['Antiguo estanque de agua', 'Rincón de lectura', 'Escalera propia', 'Tres ventanas redondas'], d: 'Aquí estaba el estanque de la casa: el torreón guardaba cuatro mil litros de agua de lluvia. Hoy es un rincón de lectura con escalera propia y toda Valdivia alrededor.' },
];

export const LEDGER = [
  { d: '12.03.1910', t: 'Ernst Schüler, maestro cervecero de Hamburgo, termina la casa frente al Calle-Calle. Roble pellín, alerce, tejuelas y un torreón que guarda el agua de lluvia de la casa.' },
  { d: '04.11.1911', t: 'Llegan los vitrales de la escalera, desde Múnich, en tres cajas de madera. Uno se rompe en el viaje.' },
  { d: '22.05.1960', t: '15:11 h. Terremoto de magnitud 9,5. Cae la chimenea norte y media Valdivia. La casa queda en pie.' },
  { d: '1961–2017', t: 'Pensión, escuela de música y oficinas. Siete capas de pintura sobre el roble.' },
  { d: '02.04.2019', t: 'Empieza la restauración: tres años, 41 artesanos y el 72 % del material original recuperado.' },
  { d: '15.09.2022', t: 'Abre Casa Nogal: doce habitaciones, un restaurante y la misma escalera.' },
];

export const MENU = {
  almuerzo: { t: 'Almuerzo', h: 'Martes a sábado · 13:00 a 15:30', items: [
    ['Ceviche de sierra', 'Leche de tigre de maqui, cebolla morada, cilantro.', 9800, 'merluza'],
    ['Empanaditas de cochayuyo', 'Con pebre de la huerta.', 7200, 'restaurante'],
    ['Merluza austral', 'Puré de papa chilota, beurre blanc de merkén.', 16900, 'merluza'],
    ['Risotto de hongos', 'Hongos de la selva valdiviana, queso de Panguipulli.', 14900, 'restaurante'],
    ['Kuchen de murta', 'Receta de la casa, crema batida.', 5900, 'kuchen'],
  ] },
  cena: { t: 'Cena', h: 'Martes a sábado · 19:30 a 22:30', items: [
    ['Ostras de Quempillén', 'Media docena, limón de Pica.', 12500, 'merluza'],
    ['Cordero al palo', 'Ocho horas de fuego lento, ensalada chilena.', 18900, 'restaurante'],
    ['Merluza austral', 'Puré de papa chilota, beurre blanc de merkén.', 16900, 'merluza'],
    ['Mousse de maqui', 'Crumble de avellana chilena.', 6200, 'kuchen'],
    ['Maridaje de cinco cervezas', 'Cervecerías del valle de Valdivia.', 14000, 'restaurante'],
  ] },
  once: { t: 'Kaffee und Kuchen', h: 'Todos los días · 17:00', items: [
    ['Kuchen de murta', 'La murta se recoge en marzo en la costa de Niebla.', 5900, 'kuchen'],
    ['Strudel de manzana', 'Manzanas del huerto, masa estirada a mano.', 5600, 'kuchen'],
    ['Pan amasado y mermeladas', 'Mosqueta, maqui y frambuesa.', 4200, 'desayuno'],
    ['Café de filtro', 'Tostado en Valdivia.', 2800, 'desayuno'],
  ] },
};

export const POSTCARDS = [
  { id: 'nav', photo: 'navegacion', t: 'Navegación al atardecer', d: 'Zarpa a las 19:00 desde el muelle del hotel. Dos horas por el Calle-Calle y el Cau-Cau, con una copa de espumante.', far: 'Desde el jardín', stamp: 'Río', price: '$32.000 por persona' },
  { id: 'mer', photo: 'mercado', t: 'Mercado fluvial', d: 'Pescado del día, choritos y los lobos marinos esperando su parte bajo el muelle. Mejor antes de las diez.', far: '5 min a pie', stamp: 'Mercado' },
  { id: 'fuerte', draw: 'fort', t: 'Fuerte de Niebla', d: 'Construido por la Corona española en 1671. Los cañones todavía apuntan a la bahía de Corral.', far: '25 min en auto', stamp: '1671' },
  { id: 'cisne', draw: 'swan', t: 'Santuario del río Cruces', d: 'Humedal Ramsar: cisnes de cuello negro, coipos y garzas. Hay paseos en bote con guía.', far: '20 min en auto', stamp: 'Ramsar' },
  { id: 'torreon', draw: 'tower', t: 'Torreón Los Canelos', d: 'Uno de los dos torreones defensivos de 1774 que quedan en pie en la ciudad.', far: '12 min a pie', stamp: '1774' },
  { id: 'rio', photo: 'rio', t: 'La costanera', d: 'Caminar por la orilla hasta el puente Pedro de Valdivia, con el olor a río y a pan recién horneado.', far: '3 min a pie', stamp: 'Valdivia' },
];

// Lluvia media mensual en Valdivia (mm) y temperatura media (°C)
export const RAIN = [52, 55, 90, 160, 296, 312, 289, 226, 148, 98, 78, 66];
export const TEMP = [17, 16.5, 14, 11, 9, 7.5, 7, 7.5, 9, 11, 13, 15.5];
export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const RITUALS = {
  lluvia: [
    ['08:30', 'Desayuno a la cama', 'Bandeja con pan amasado, quesos de la zona y café en tetera de plata.', 'desayuno'],
    ['11:00', 'La biblioteca', 'Chimenea encendida, 1.200 libros y mantas de lana de Chiloé.', 'hab-suite'],
    ['17:00', 'Kaffee und Kuchen', 'La hora más alemana de la casa: kuchen de murta y café de filtro.', 'kuchen'],
    ['19:00', 'Cata en la cava', 'Cinco cervezas del valle de Valdivia en la bodega de piedra de 1910.', 'restaurante'],
    ['23:00', 'Bolsa de agua caliente', 'La dejamos entre las sábanas mientras usted cena.', 'hab-clasica'],
  ],
  sol: [
    ['08:00', 'Mercado fluvial', 'A cinco minutos a pie, cuando llegan los botes y los lobos marinos.', 'mercado'],
    ['10:30', 'Bicicletas por Isla Teja', 'Dos bicicletas inglesas para recorrer la isla y el Jardín Botánico.', 'rio'],
    ['13:00', 'Almuerzo en la terraza', 'Mesa junto al río, bajo el nogal que plantó Ernst Schüler.', 'merluza'],
    ['19:00', 'Navegación al atardecer', 'Dos horas por el río, desde nuestro propio muelle.', 'navegacion'],
    ['21:00', 'Cena junto a la chimenea', 'Aunque haga sol, en Valdivia las noches piden fuego.', 'restaurante'],
  ],
};

export const GUESTBOOK = [
  ['Una casa con alma. Volveremos en invierno, para la lluvia.', 'Andrea y Martín', 'Buenos Aires'],
  ['La Biblioteca es un sueño. Leí tres libros y no salí de la tina.', 'José Ignacio', 'Santiago'],
  ['El cordero, inolvidable. La señora del kuchen, también.', 'Sophie D.', 'Lyon'],
  ['Me llevé la llave por error. La devolví por correo. Perdón.', 'Thomas K.', 'Hamburgo'],
];

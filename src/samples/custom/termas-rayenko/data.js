// Termas Rayenko · datos de la muestra. Negocio, personas y reseñas ficticios.

// Los siete pozones, de la vertiente al río. x, y: posición en el mapa de la quebrada (viewBox 1000 × 620).
export const POOLS = [
  { id: 'fuego', n: 1, name: 'Pozón del Fuego', temp: 42, depth: '0,9 m', cap: 8, x: 168, y: 150, r: 46, slot: 'pozon-piedra', mins: '8 min', best: 'Recién llegado, para soltar el frío del camino', d: 'El más cercano a la vertiente. Piedra volcánica tallada a mano y agua que llega casi sin enfriarse.' },
  { id: 'cascada', n: 2, name: 'Pozón Cascada', temp: 40, depth: '1,1 m', cap: 10, x: 318, y: 214, r: 54, slot: 'pozon-cascada', mins: '15 min', best: 'Masaje natural en cuello y hombros', d: 'Un chorro tibio cae desde las rocas con musgo. Siéntese debajo y deje que el agua haga el trabajo.' },
  { id: 'coigue', n: 3, name: 'Pozón del Coigüe', temp: 39, depth: '1,2 m', cap: 14, x: 470, y: 300, r: 62, slot: 'hero', mins: '20 min', best: 'Conversar sin apuro', d: 'El más grande, bajo un coigüe de trescientos años. Es el corazón de la quebrada.' },
  { id: 'helecho', n: 4, name: 'Pozón Helecho', temp: 38, depth: '0,8 m', cap: 6, x: 590, y: 196, r: 40, slot: 'pasarela', mins: '20 min', best: 'Silencio: es el pozón sin conversación', d: 'Escondido entre helechos gigantes y nalcas. Aquí se habla en voz baja o no se habla.' },
  { id: 'luna', n: 5, name: 'Pozón Luna', temp: 37, depth: '1,0 m', cap: 8, x: 690, y: 368, r: 50, slot: 'pozon-noche', mins: '25 min', best: 'El bloque de la noche, mirando las estrellas', d: 'Sin árboles encima: el único pozón con el cielo completo. Lo encendemos con velas en el bloque nocturno.' },
  { id: 'ninos', n: 6, name: 'Pozón Familiar', temp: 35, depth: '0,6 m', cap: 12, x: 800, y: 248, r: 46, slot: 'llegada', mins: 'Sin límite', best: 'Niñas y niños desde los 4 años', d: 'Poco profundo y templado, con escalones anchos. El pozón de las risas.' },
  { id: 'rio', n: 7, name: 'Poza del Río', temp: 11, depth: '1,4 m', cap: 6, x: 880, y: 450, r: 44, slot: 'poza-rio', mins: '1 min', best: 'El contraste: entrar, contar hasta sesenta y volver', d: 'El estero de deshielo, sin trampa: agua de cordillera a once grados. Valiente quien repite.' },
];

// Bloques horarios con aforo
export const BLOCKS = [
  { id: 'm', name: 'Mañana', from: '09:00', to: '12:30', cap: 60, k: 'Vapor de la mañana', c: '#b7d3cf' },
  { id: 't', name: 'Tarde', from: '13:00', to: '16:30', cap: 70, k: 'La luz entre los coigües', c: '#d9c58e' },
  { id: 'a', name: 'Atardecer', from: '17:00', to: '20:30', cap: 70, k: 'Faroles que se encienden', c: '#e8a35a' },
  { id: 'n', name: 'Noche', from: '21:00', to: '00:00', cap: 40, k: 'Velas y estrellas · solo adultos', c: '#7d8fc9', night: true },
];

// Precios por persona (pesos chilenos)
export const PRICES = { low: 22000, weekend: 26000, high: 28000, night: 4000, child: 0.5, senior: 0.8 };
export const EXTRAS = [
  { id: 'bata', label: 'Toalla y bata', price: 6000, per: true },
  { id: 'locker', label: 'Casillero', price: 2000, per: false },
  { id: 'masaje', label: 'Masaje con piedras volcánicas · 50 min', price: 38000, per: false },
  { id: 'fogon', label: 'Cena en el fogón', price: 19000, per: true },
];

export const CABINS = [
  { name: 'Cabaña Helecho', cap: 2, price: 120000, d: 'Para dos, con ventanal hacia el estero y estufa a leña.' },
  { name: 'Cabaña Coigüe', cap: 2, price: 150000, d: 'Sobre pilotes dentro de la quebrada, con tina privada en la terraza.' },
  { name: 'Cabaña Nalca', cap: 4, price: 165000, d: 'Dos dormitorios y cocina, ideal para familias.' },
];

// Clima promedio de Liquiñe por mes (aire, °C) y temporada alta
export const AIR = [17, 17, 14, 10, 7, 5, 4, 5, 7, 10, 12, 15];
export const HIGH = [0, 1, 6]; // enero, febrero, julio

export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Las cuatro estaciones en la quebrada (hemisferio sur)
export const SEASONS = [
  { id: 'verano', name: 'Verano', months: [11, 0, 1], slot: 'poza-rio', t: 'Días largos y la poza del río más amable que nunca.', air: '15–24 °C' },
  { id: 'otono', name: 'Otoño', months: [2, 3, 4], slot: 'bosque', t: 'Raulíes rojos, niebla baja y menos gente.', air: '6–15 °C' },
  { id: 'invierno', name: 'Invierno', months: [5, 6, 7], slot: 'nieve', t: 'Nieve sobre las pasarelas y el agua a cuarenta grados.', air: '−2–8 °C' },
  { id: 'primavera', name: 'Primavera', months: [8, 9, 10], slot: 'pasarela', t: 'El bosque despierta y el estero baja con el deshielo.', air: '5–16 °C' },
];

export const REVIEWS = [
  ['Llegamos con nieve y nos fuimos sin querer irnos. El bloque de la noche, con las velas, es otro mundo.', 'Camila y Tomás', 'Concepción · invierno'],
  ['Me atreví a la poza del río tres veces. Nunca había dormido tan bien como esa noche.', 'Rodrigo A.', 'Santiago · otoño'],
  ['Reservar el bloque por la web fue facilísimo y no había nadie amontonado. Volveremos con los niños.', 'Familia Catrileo', 'Temuco · verano'],
];

export const FAQ = [
  ['¿Hay que reservar?', 'Sí. Cada bloque tiene aforo limitado para que la quebrada siga siendo tranquila. Si quedan cupos, se puede comprar en la entrada, pero en fines de semana y vacaciones se agotan.'],
  ['¿Se necesitan cadenas para llegar?', 'Entre junio y septiembre, Vialidad puede exigir cadenas en la ruta a Liquiñe cuando nieva. El último tramo es de ripio en buen estado y el estacionamiento está a 80 metros de la recepción.'],
  ['¿Pueden ir niñas y niños?', 'Sí, desde los 4 años en los bloques de mañana, tarde y atardecer, con el Pozón Familiar a 35 °C. El bloque de la noche es solo para adultos.'],
  ['¿Qué tengo que traer?', 'Traje de baño, sandalias y ganas. Arrendamos toalla, bata y casillero. Hay duchas con agua termal y camarines calefaccionados.'],
  ['¿Se puede comer en las termas?', 'La cafetería sirve sopaipillas, empanadas de piñón y té de hierbas todo el día. En el atardecer y la noche, cena en el fogón con reserva.'],
  ['¿Admiten mascotas?', 'No en el área de pozones, para cuidar el agua y la fauna del bosque. En las cabañas, consúltenos.'],
];

// Análisis referencial del agua (muestra de concepto)
export const WATER = [['pH', '8,7', 'alcalina'], ['Temperatura en vertiente', '68 °C', ''], ['Sílice', '92 mg/L', 'piel suave'], ['Bicarbonato', '210 mg/L', ''], ['Sulfato', '64 mg/L', ''], ['Litio', 'trazas', '']];

// ───────── La cocina de la quebrada ─────────
// m: meses de temporada (0 = enero). Si el mes actual está en m, el plato se marca "de temporada".
export const MENU = [
  { id: 'cafe', name: 'Cafetería', when: 'Todo el día · 9:00 a 23:30', slot: 'te', items: [
    { n: 'Huevo de vertiente', d: 'Cocido 30 minutos en el agua de la vertiente a 68 °C. Con pan amasado, merkén y sal de Cáhuil.', p: 4900, tag: 'De la casa' },
    { n: 'Sopaipillas con pebre', d: 'Recién fritas, con pebre cuchareado y chancho en piedra.', p: 3900, tag: 'Vegetariano' },
    { n: 'Empanada de piñón y queso', d: 'Masa de horno de barro, piñones de la cordillera y queso de Panguipulli.', p: 4500, m: [2, 3, 4, 5, 6] },
    { n: 'Kuchen de murta', d: 'Murta silvestre de los cerros de Liquiñe, crumble de avena.', p: 4200, m: [3, 4, 5] },
    { n: 'Té de hierbas del huerto', d: 'Matico, cedrón o menta, endulzado con miel de ulmo.', p: 2800, tag: 'Sin cafeína' },
    { n: 'Chocolate caliente con canela', d: 'Para salir del pozón y entrar en calor otra vez.', p: 3500 },
  ] },
  { id: 'almuerzo', name: 'Almuerzo', when: 'Bloques de mañana y tarde · 13:00 a 16:00', slot: 'cocina', items: [
    { n: 'Digüeñes salteados', d: 'El hongo de la primavera en el coigüe, con cebollín, huevo de campo y ají cacho de cabra.', p: 9800, m: [8, 9, 10], tag: 'Vegetariano' },
    { n: 'Cazuela de cordero de Neltume', d: 'Con zapallo, papa nativa, choclo y chuchoca.', p: 12500 },
    { n: 'Trucha del estero a la mantequilla', d: 'Trucha arcoíris de cultivo local, papas cocidas al vapor termal y ensalada chilena.', p: 13900, tag: 'Sin gluten' },
    { n: 'Charquicán de la casa', d: 'Con huevo frito y pebre. El plato de los que vuelven del río.', p: 8900 },
    { n: 'Ensalada de quinoa y avellana', d: 'Quinoa, avellana chilena tostada, betarraga y queso de cabra.', p: 9200, tag: 'Vegetariano' },
  ] },
  { id: 'fogon', name: 'Cena en el fogón', when: 'Atardecer y noche · con reserva', slot: 'cordero', items: [
    { n: 'Cordero al palo', d: 'Seis horas junto al fuego de ulmo, con papas al rescoldo y chancho en piedra.', p: 19000, tag: 'Para compartir' },
    { n: 'Pan de rescoldo', d: 'Horneado bajo la ceniza del fogón, con mantequilla ahumada.', p: 3500 },
    { n: 'Curanto en olla del sur', d: 'Mariscos, cerdo ahumado, longaniza, milcao y chapalele.', p: 18500, m: [4, 5, 6, 7] },
    { n: 'Piñones al rescoldo', d: 'Con sal de mar y merkén ahumado.', p: 4800, m: [2, 3, 4, 5, 6] },
    { n: 'Sopa de quinoa y hongos', d: 'Para la noche más fría, con hongos del bosque.', p: 8500, tag: 'Vegano' },
    { n: 'Leche asada con miel de ulmo', d: 'Al horno de barro, el postre de las abuelas.', p: 4500 },
  ] },
];
export const DRINKS = [
  ['Cerveza Ámbar del Estero', 'Cervecería artesanal de Panguipulli', 4900],
  ['Vino tinto Pinot Noir', 'Valle de Osorno, por copa', 6500],
  ['Navegado', 'Vino caliente con naranja y canela', 4500],
  ['Mote con huesillo', 'En verano, helado', 3200],
];
// Los vecinos que abastecen la cocina: [producto, productor, lugar, km, ángulo en grados]
export const PRODUCERS = [
  ['Digüeñes y murta', 'Recolectoras de Liquiñe', 'Liquiñe', 18, 210],
  ['Miel de ulmo', 'Apícola Los Chucaos', 'Coñaripe', 48, 300],
  ['Cordero', 'Familia Antilef', 'Neltume', 36, 150],
  ['Queso y mantequilla', 'Lechería El Encanto', 'Panguipulli', 88, 250],
  ['Trucha', 'Piscicultura Río Fuy', 'Choshuenco', 62, 175],
  ['Cerveza', 'Ámbar del Estero', 'Panguipulli', 88, 265],
  ['Piñones', 'Comunidad pehuenche de Curarrehue', 'Curarrehue', 95, 345],
];

// Lo que nos hace distintos
export const WHY = [
  ['7', 'temperaturas', 'De 11 a 42 °C en un solo recorrido: nadie más ofrece el circuito completo en la zona.'],
  ['60', 'personas por bloque, máximo', 'Aforo limitado y visible en la web: nunca un pozón lleno.'],
  ['0', 'comisiones', 'Reserva directa, pago en línea y pulsera al WhatsApp en dos minutos.'],
  ['365', 'días abiertos', 'Con nieve, con lluvia y con luna llena. El agua siempre sale a 68 °C.'],
  ['km 0', 'en la cocina', 'Siete productores vecinos y el agua del volcán como un ingrediente más.'],
  ['4,9', 'en Google', '1.240 reseñas. Respondemos cada una, con nombre y apellido.'],
];

// Guía del visitante (contenido que posiciona en buscadores)
export const GUIDES = [
  { slot: 'nieve', k: 'Invierno', t: 'Qué llevar a unas termas en invierno', min: 4, body: ['Traje de baño, sandalias con suela de goma y un gorro de lana: la cabeza es lo que más siente el frío entre pozón y pozón.', 'Lleve cadenas en el auto entre junio y septiembre y revise el estado de la ruta antes de salir. En recepción arrendamos bata y toalla, y las duchas son de agua termal.', 'Hidrátese: después de un bloque completo en agua caliente se pierde más líquido del que parece. El té de matico de la cafetería está para eso.'] },
  { slot: 'llegada', k: 'Familias', t: 'Termas con niños en Los Ríos: guía rápida', min: 3, body: ['Elija los bloques de mañana o tarde: el de la noche es solo para adultos.', 'El Pozón Familiar está a 35 °C y tiene escalones anchos. Los niños menores de 12 pagan la mitad.', 'Planifique la poza del río como una aventura corta: treinta segundos y de vuelta al agua tibia. Ellos siempre quieren repetir.'] },
  { slot: 'volcan', k: 'Ruta', t: 'Dos días de volcanes y termas en Panguipulli', min: 6, body: ['Día 1: Panguipulli, la costanera del lago Calafquén y Coñaripe. Almuerzo en ruta y llegada a Rayenko para el bloque del atardecer.', 'Noche en una cabaña de la quebrada, con acceso libre a los pozones hasta las 9:00.', 'Día 2: desayuno con huevo de vertiente, sendero al mirador del Mocho-Choshuenco y regreso por Liquiñe con una parada para comprar miel de ulmo.'] },
];

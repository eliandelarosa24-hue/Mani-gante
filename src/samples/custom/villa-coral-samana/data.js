// Villa Coral Samaná · datos: cinco villas con nombre de piedras, árboles y animales de la isla,
// excursiones para el pasaporte, la carta del chef, el clima y las reseñas.
export const VILLAS = [
  { id: 'coral', n: 'Coral', color: '#ff6b57', ink: '#5a1d14', photo: 'villa-coral', price: 890, rooms: 3, pax: 6, pool: 'Infinita · 12 m', sea: '18 pasos', m2: 240,
    why: 'Por los arrecifes que se ven desde la terraza cuando el agua está quieta.',
    lead: 'La villa de la familia: tres suites frente al mar, una piscina que se confunde con el horizonte y la playa a dieciocho pasos.',
    feats: ['Primera línea', 'Piscina infinita', 'Tres suites con baño', 'Terraza con hamacas', 'Kayak y snorkel', 'Chef a pedido'] },
  { id: 'ambar', n: 'Ámbar', color: '#f2a93b', ink: '#5a3a06', photo: 'villa-ambar', price: 620, rooms: 2, pax: 4, pool: 'Con bohío · 8 m', sea: '25 pasos', m2: 160,
    why: 'El ámbar dominicano guarda insectos de veinte millones de años. Esta villa guarda la tarde.',
    lead: 'Maderas tibias, un bohío de cana para la siesta y la mejor luz del atardecer de toda la playa.',
    feats: ['Bohío de cana', 'Dos suites', 'Ducha exterior', 'Cocina abierta', 'Bicicletas', 'Frente al mar'] },
  { id: 'larimar', n: 'Larimar', color: '#4fb6d8', ink: '#0a3a4c', photo: 'villa-larimar', price: 1250, rooms: 4, pax: 8, pool: 'Infinita · 20 m', sea: '12 pasos', m2: 380,
    why: 'La piedra azul que solo existe en esta isla. Del mismo color que el agua de la mañana.',
    lead: 'La más grande frente al mar: cuatro suites, una piscina de veinte metros y una terraza para cenar con los pies en la arena.',
    feats: ['Primera línea', 'Piscina infinita 20 m', 'Cuatro suites', 'Gimnasio', 'Cine al aire libre', 'Mayordomo'] },
  { id: 'mango', n: 'Mango', color: '#e9b729', ink: '#3d3a0a', photo: 'villa-mango', price: 390, rooms: 1, pax: 2, pool: 'Plunge pool', sea: '90 pasos', m2: 85,
    why: 'Entre mangos y plátanos: en junio la fruta cae sola sobre la terraza.',
    lead: 'Para dos: una cama con mosquitero, una piscina pequeña bajo los mangos y el mar a un minuto caminando.',
    feats: ['Luna de miel', 'Plunge pool', 'Cama con dosel', 'Hamaca', 'Desayuno incluido', 'Jardín tropical'] },
  { id: 'ballena', n: 'Ballena', color: '#1f4e79', ink: '#0a2340', photo: 'villa-ballena', price: 1690, rooms: 5, pax: 10, pool: 'Infinita · 18 m', sea: 'Colina, 4 min', m2: 460,
    why: 'En la colina: de enero a marzo, desde la terraza se ven saltar las ballenas.',
    lead: 'La villa mirador: cinco suites en lo alto de la bahía, una terraza enorme y el mejor palco del Caribe para ver ballenas.',
    feats: ['Vista a la bahía', 'Cinco suites', 'Terraza mirador', 'Binoculares', 'Carrito de golf', 'Chef residente'] },
];

export const TRIPS = [
  { id: 'ballenas', n: 'Ballenas jorobadas', price: 75, t: '4 h', when: '15 ene – 25 mar', photo: 'ballena', d: 'Lancha a la bahía de Samaná con biólogo marino. Avistamiento garantizado o repite gratis.', stamp: '#1f4e79' },
  { id: 'limon', n: 'Salto El Limón', price: 60, t: '5 h', when: 'Todo el año', photo: 'limon', d: 'A caballo por la selva hasta una cascada de cuarenta metros. Baño en la poza.', stamp: '#1d5c45' },
  { id: 'rincon', n: 'Playa Rincón', price: 85, t: 'Día completo', when: 'Todo el año', photo: 'rincon', d: 'Lancha privada a una de las playas más lindas del Caribe. Almuerzo de langosta en la arena.', stamp: '#e2572b' },
  { id: 'haitises', n: 'Los Haitises', price: 110, t: '7 h', when: 'Todo el año', photo: 'haitises', d: 'Manglares, mogotes de piedra caliza y cuevas con petroglifos taínos.', stamp: '#3c6e47' },
  { id: 'pueblo', n: 'Pueblo de los Pescadores', price: 0, t: 'A pie', when: 'Al atardecer', photo: 'pescadores', d: 'Casitas de madera pintadas, pescado del día y merengue en vivo. Le reservamos mesa.', stamp: '#c2410c' },
  { id: 'cocina', n: 'Cocina criolla', price: 55, t: '3 h', when: 'En la villa', photo: 'chef', d: 'Pescado con coco, tostones y mangú con nuestra chef samanense, en su cocina.', stamp: '#9a3412' },
];

export const MENU = [
  ['Desayuno', 'Mangú con los tres golpes, frutas del día y café de Barahona.'],
  ['Almuerzo', 'Pescado con coco, arroz blanco y tostones. Como lo hacen en Samaná desde el siglo XIX.'],
  ['Merienda', 'Agua de coco recién abierto y dulce de leche cortada.'],
  ['Cena', 'Langosta a la parrilla, ensalada de aguacate y habichuelas con dulce de postre.'],
];

// Clima medio de Las Terrenas: aire (°C), agua (°C) y lluvia (mm)
export const CLIMATE = {
  air: [27, 27, 28, 28, 29, 30, 30, 31, 31, 30, 29, 28],
  water: [26, 26, 26, 27, 27, 28, 28, 29, 29, 29, 28, 27],
  rain: [95, 70, 75, 110, 170, 110, 105, 120, 125, 160, 190, 140],
  whales: [0.55, 1, 0.65, 0, 0, 0, 0, 0, 0, 0, 0, 0.1],
};
export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const REVIEWS = [
  { q: 'Vimos saltar una ballena desde la piscina de la Ballena. Mi hija todavía no lo cree.', a: 'Familia Ortega', from: 'Madrid', flag: '🇪🇸', v: 'Ballena' },
  { q: 'Paradise. The chef cooked the best lobster of our lives, barefoot on the sand.', a: 'Emily & Jack', from: 'Toronto', flag: '🇨🇦', v: 'Larimar' },
  { q: 'On a réservé en direct, moins cher et le concierge parlait français. Parfait.', a: 'Julien M.', from: 'Montréal', flag: '🇨🇦', v: 'Coral' },
  { q: 'La Mango es para enamorarse otra vez. Desayuno en la hamaca todos los días.', a: 'Valentina y Tomás', from: 'Santiago de Chile', flag: '🇨🇱', v: 'Mango' },
  { q: 'Wir kommen jedes Jahr im Februar wegen der Wale. Diesmal die Ámbar: wunderschön.', a: 'Anke und Peter', from: 'Hamburgo', flag: '🇩🇪', v: 'Ámbar' },
];

export const RATES = { USD: 1, EUR: 0.92, DOP: 60.5 };

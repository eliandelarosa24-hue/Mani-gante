// Ficha comercial de cada muestra: lo que el sitio hace por el negocio, en palabras de dueño.
// service/tier apuntan a src/pricing.js para que el precio "desde" salga siempre del tarifario.
export const PITCH = {
  'domos-cielo-austral': {
    rubro: 'Glamping', service: 'web_alojamiento', tier: 'premium',
    problem: 'Los domos se venden por la experiencia del cielo, pero en Booking o Airbnb se ven iguales a cualquier carpa con cama. Cada reserva por plataforma paga comisión.',
    gains: ['Muestra el cielo de cada noche con datos reales: el visitante reserva por la experiencia, no por el precio.', 'Reserva directa sin comisión, eligiendo la noche con el cielo a la vista.', 'Contenido propio que posiciona en Google como “glamping para ver estrellas”.'],
    features: ['Planetario interactivo y constelaciones para trazar', 'Calendario cósmico con las mejores noches', 'Reserva que muestra cómo estará el cielo esa noche', 'Ficha de cada cápsula'],
  },
  'cabanas-lago-azul': {
    rubro: 'Cabañas', service: 'web_alojamiento', tier: 'premium',
    problem: 'Las cabañas compiten con decenas de avisos iguales. Las familias deciden por la ubicación, el tamaño real y la disponibilidad, y eso no se ve en un aviso.',
    gains: ['Disponibilidad de cada cabaña a la vista: menos mensajes de “¿tiene para tal fecha?”.', 'Comparador de tamaños a escala real y carta náutica del lago: confianza antes de reservar.', 'Reserva directa por WhatsApp con la fecha y la cabaña ya escritas.'],
    features: ['Un día en la orilla: el cielo cambia al bajar', 'Agua animada en la portada', 'Las casas comparadas a la misma escala', 'Disponibilidad de las próximas cuatro semanas'],
  },
  'hotel-casa-nogal': {
    rubro: 'Hotel boutique', service: 'web_alojamiento', tier: 'premium',
    problem: 'Un hotel patrimonial pierde su mayor valor, la historia, cuando se lista como una habitación más. Y las agencias online cobran entre 15 y 20%.',
    gains: ['La historia de la casona vende sola: el huésped llega sabiendo dónde va a dormir.', 'Las 12 habitaciones con su personalidad, para elegir y reservar directo.', 'Carta del restaurante y experiencias que suben el gasto por huésped.'],
    features: ['Vidrio con lluvia que se despeja con el cursor', 'Corte de la casona, piso por piso', 'Llavero de habitaciones', 'Álbum de postales del río'],
  },
  'villa-coral-samana': {
    rubro: 'Villas en el Caribe', service: 'web_alojamiento', tier: 'premium',
    problem: 'El turista extranjero compara villas en diez pestañas. Gana la que transmite el lugar y resuelve dudas en su idioma y su moneda.',
    gains: ['Precios en USD, EUR o pesos dominicanos con un clic.', 'Temporada de ballenas, clima y excursiones: razones para elegir esta villa y no otra.', 'Reserva directa con concierge por WhatsApp, sin comisión de plataforma.'],
    features: ['Mapa de las villas sobre la foto aérea', 'Temporada de ballenas interactiva', 'Moneda seleccionable', 'Identidad dominicana y merengue opcional'],
  },
  'fogon-mapu': {
    rubro: 'Restaurante de autor', service: 'web_restaurante', tier: 'premium',
    problem: 'Un restaurante de autor necesita contar su cocina antes de que el comensal llegue. Instagram muestra platos; no explica el origen ni permite reservar bien.',
    gains: ['La carta con su historia y sus productos: el comensal llega con ganas de pedir el menú de degustación.', 'Reserva de mesa en línea y menos llamadas.', 'Posiciona en Google como cocina mapuche contemporánea en Temuco.'],
    features: ['Carta que gira como el kultrún', 'Menú degustación de ocho tiempos', 'Mezclador de merkén', 'Reserva eligiendo la mesa en el plano'],
  },
  'kuchen-haus-frutillar': {
    rubro: 'Café y pastelería', service: 'web_restaurante', tier: 'premium',
    problem: 'En temporada la vitrina se vacía y en invierno faltan clientes. La pastelería necesita vender tortas por encargo todo el año, no solo atender el mesón.',
    gains: ['Pedidos en línea de kuchen y bandejas para la casa o la oficina.', 'La tradición alemana de Frutillar como argumento frente a la cafetería de al lado.', 'Carta siempre actualizada sin imprimir nada.'],
    features: ['Vitrina del día', 'Arme su kuchen', 'La receta de la abuela', 'Pedidos de bandejas'],
  },
  'pucon-aventura': {
    rubro: 'Tours y aventura', service: 'web_alojamiento', tier: 'premium',
    problem: 'En Pucón hay decenas de operadores con el mismo volcán y el mismo rafting. El turista elige al que le da confianza y cupo claro, en el momento.',
    gains: ['Cupos y salidas por día: el turista reserva desde el celular sin esperar respuesta.', 'Seguridad, equipo y guías visibles: confianza para actividades de riesgo.', 'Combos para armar la semana en Pucón: más actividades por cliente.'],
    features: ['Ruta al cráter animada', 'Test: qué aventura es la suya', 'Clima por día para elegir la salida', 'Certificado de cumbre para compartir'],
  },
  'vina-los-robles': {
    rubro: 'Enoturismo', service: 'web_alojamiento', tier: 'premium',
    problem: 'Las viñas boutique dependen del Tren del Vino y de agencias. La venta de catas y vinos directo al visitante es el margen que se pierde.',
    gains: ['Reserva de catas y almuerzos por horario, con cupos.', 'Las catorce etiquetas presentadas para vender en la visita y después.', 'Calendario de vendimia que llena la temporada alta.'],
    features: ['Recorrido por la finca', 'Enólogo por un día: cree su ensamblaje', 'Maridaje plato a plato', 'Reserva de visitas'],
  },
  'estudio-haber': {
    rubro: 'Estudio contable', service: 'web_alojamiento', tier: 'premium', serviceLabel: 'Sitio premium a medida para servicios profesionales',
    problem: 'Tres de cada cuatro pymes en Chile no tienen sitio web, y los estudios contables dependen del boca a boca. El cliente que busca contador en Google encuentra al que se ve más confiable.',
    gains: ['Calculadoras y calendario tributario útiles: el sitio atrae visitas todos los meses y posiciona al estudio como experto.', 'Diagnóstico de régimen y cotizador que convierten visitas en reuniones agendadas.', 'Confianza: equipo, casos reales y respuesta por WhatsApp.'],
    features: ['Caja de zapatos que se ordena en el libro', 'Calendario tributario vivo', 'Calculadoras de IVA, honorarios y F29', 'Agenda de diagnóstico'],
  },
  'termas-rayenko': {
    rubro: 'Termas', service: 'web_alojamiento', tier: 'premium',
    problem: 'Muchas termas del sur venden por teléfono y en la puerta. Los fines de semana se llenan sin control y en la semana quedan vacías. Y cuando el turista busca termas en Google, aparece primero el que tiene mejor sitio.',
    gains: ['Reserva por bloque con aforo: se reparte la demanda y se cobra antes de que el cliente llegue.', 'Cocina, cabañas y tarjetas de regalo que suben el ticket por visita.', 'Datos estructurados y guías que posicionan en Google frente a las otras termas de la zona.'],
    features: ['Mapa de pozones con recorrido', 'Reserva por bloques con pulsera de acceso', 'Cocina de temporada y kilómetro cero', 'Lunas llenas con fechas reales'],
  },
};

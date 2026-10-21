# Genera el guion de exposición y la matriz de cumplimiento (Word)
import sys
from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUT_DIR = sys.argv[1]
VIOLET = RGBColor(0x6D, 0x28, 0xD9)
BLUE = RGBColor(0x1D, 0x4E, 0xD8)
GREY = RGBColor(0x55, 0x5B, 0x75)
AMBER = RGBColor(0xB4, 0x53, 0x09)


def base_doc():
    d = Document()
    sec = d.sections[0]
    sec.page_width, sec.page_height = Cm(21.59), Cm(27.94)
    for side in ("left_margin", "right_margin"):
        setattr(sec, side, Cm(2.2))
    sec.top_margin = sec.bottom_margin = Cm(2.0)
    st = d.styles["Normal"]
    st.font.name = "Calibri"
    st.font.size = Pt(11)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    st.paragraph_format.space_after = Pt(4)
    for name, size, color in (("Heading 1", 18, VIOLET), ("Heading 2", 14, BLUE), ("Heading 3", 12, VIOLET)):
        h = d.styles[name]
        h.font.name = "Arial"
        h.font.size = Pt(size)
        h.font.color.rgb = color
        h.font.bold = True
        h.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    return d


def shade(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def table(d, header, rows, widths=None, size=9.5, status_col=None):
    t = d.add_table(rows=1, cols=len(header))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(header):
        c = t.rows[0].cells[i]
        c.text = ""
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        r.font.size = Pt(size)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        shade(c, "4C1D95")
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            r = cells[i].paragraphs[0].add_run(str(v))
            r.font.size = Pt(size)
            if status_col is not None and i == status_col:
                r.bold = True
                r.font.color.rgb = {"Cumple": RGBColor(0x04, 0x78, 0x57), "Parcial": AMBER}.get(str(v).split(" ")[0], AMBER)
    if widths:
        t.autofit = False
        grid = t._tbl.tblGrid
        for i, gc in enumerate(grid.findall(qn("w:gridCol"))):
            gc.set(qn("w:w"), str(int(widths[i] * 567)))
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    # repetir encabezado
    trPr = t.rows[0]._tr.get_or_add_trPr()
    th = OxmlElement("w:tblHeader")
    th.set(qn("w:val"), "true")
    trPr.append(th)
    return t


def para(d, text, bold_lead=None, color=None, italic=False, size=None):
    p = d.add_paragraph()
    if bold_lead:
        r = p.add_run(bold_lead)
        r.bold = True
        if color:
            r.font.color.rgb = color
    r = p.add_run(text)
    r.italic = italic
    if size:
        r.font.size = Pt(size)
    return p


def bullet(d, text, lead=None):
    p = d.add_paragraph(style="List Bullet")
    if lead:
        r = p.add_run(lead)
        r.bold = True
    p.add_run(text)
    return p


# ---------------------------------------------------------------------------
# Guion
# ---------------------------------------------------------------------------
SLIDES = [
    # (n, titulo, integrante, duracion_seg, guion, enfasis[list], transicion)
    (1, "Portada", 1, 30,
     "Buenos días, profesora y compañeros. Somos el equipo de Sound Travel y hoy les vamos a presentar el plan de coordinación y operaciones de una agencia que creamos para la asignatura de Coordinación en Operaciones Turísticas. "
     "Quiero aclarar algo desde el principio: Sound Travel es una empresa ficticia. Elegimos la Opción 2 de la guía, que nos pedía crear un servicio turístico pensado para nuestro propio territorio, y por eso todo lo que van a ver está aterrizado en Temuco y La Araucanía.",
     ["Empresa ficticia, Opción 2 de la guía.", "Contexto: Temuco y Región de La Araucanía."],
     "Antes de entrar en materia, les mostramos cómo vamos a ordenar la exposición."),
    (2, "Ruta de la exposición", 1, 30,
     "Dividimos la presentación en cuatro partes que siguen los criterios de evaluación de la unidad. Yo parto con el contexto y la presentación de la empresa; mi compañero o compañera 2 explica la estructura y los procesos, que es el criterio 2.1.1; luego el integrante 3 muestra cómo nos relacionamos con los demás actores, el criterio 2.1.2; y el integrante 4 cierra con los criterios técnicos y el seguimiento, el 2.1.3. "
     "Todo apunta al aprendizaje esperado: organizar la coordinación con distintos actores considerando el producto, el territorio y la normativa.",
     ["Cada parte responde a un criterio.", "El aprendizaje esperado es el hilo conductor."],
     "Y para entender por qué existe Sound Travel, primero hay que mirar el problema."),
    (3, "El problema: llegar, disfrutar y volver seguro", 1, 60,
     "El turismo en Chile se viene recuperando con fuerza. Según la Subsecretaría de Turismo, el país superó los 3,6 millones de visitantes internacionales en 2023, y además hay mucho movimiento de viajeros nacionales que se desplazan entre regiones para ver espectáculos en vivo. "
     "Ahora, ¿qué pasa en concreto en Temuco cuando hay un concierto grande en el Estadio Germán Becker o una fiesta en la Isla Cautín? Pasan tres cosas: la micro deja de pasar temprano, los estacionamientos colapsan y las aplicaciones de transporte suben sus tarifas. El resultado es que mucha gente no sabe cómo volver a casa de forma segura en la noche. "
     "El informe toma como referencia el Festival Internacional de Temuco proyectado para febrero de 2027. Lo usamos como un escenario de planificación, pero queremos ser honestos: no tenemos una confirmación oficial de que ese evento se vaya a realizar.",
     ["El problema es real y se repite cada temporada.", "Tres fallas: transporte público, estacionamientos y tarifas.", "El festival 2027 es un escenario proyectado, no un hecho confirmado."],
     "Frente a ese problema, nace nuestra propuesta."),
    (4, "¿Qué es Sound Travel?", 1, 50,
     "Sound Travel es una agencia de turismo de eventos con casa matriz en Temuco. La justificación es simple: no existe una solución que integre el viaje de ida y vuelta con todo lo demás que necesita un asistente. Por eso diseñamos un servicio integrado que junta el traslado, la entrada, las paradas para comer y la compañía de un guía. "
     "En el mapa pueden ver nuestra localización. Temuco es la base, y desde ahí operamos rutas dentro de la región: Padre Las Casas, Lautaro, Villarrica y Pucón. Las líneas punteadas son viajes especiales a conciertos en Concepción y Santiago. Es un esquema referencial, no un mapa a escala, pero muestra bien hasta dónde llega el servicio.",
     ["Servicio integrado: no solo transporte.", "Base en Temuco, rutas regionales y viajes especiales."],
     "Ahora que sabemos qué hace la empresa, veamos hacia dónde apunta y a quién le habla."),
    (5, "Misión, visión y público objetivo", 1, 40,
     "Nuestra misión es ofrecer traslado y actividades complementarias para asistentes a festivales y conciertos, dentro y fuera de la región, garantizando seguridad, comodidad y un viaje bien planificado. Nuestra visión es ser una agencia reconocida en el sur de Chile en turismo de eventos, justamente por la buena organización. "
     "Tenemos dos perfiles de cliente. El primero son jóvenes de 18 a 35 años, fanáticos de la música, que quieren una experiencia completa y sin complicarse con el transporte. El segundo son turistas de hasta 45 años, grupos de amigos o parejas, que buscan panoramas de fin de semana, como un sunset en Villarrica o Pucón, y que valoran también la comida local.",
     ["Seguridad y comodidad aparecen en misión y en ambos perfiles.", "El perfil 2 explica la importancia de la gastronomía."],
     "Con estos clientes en mente armamos nuestro producto principal."),
    (6, "Propuesta de valor: el Pack Sound Travel", 1, 30,
     "El Pack Sound Travel tiene cuatro componentes: traslado ida y vuelta en minibuses o vans de 15 a 30 pasajeros, entrada asegurada a través de ticketeras oficiales para evitar estafas, la asistencia de un guía y paradas gastronómicas en locales de la zona. Lo resumimos en una frase: llegar puntual, disfrutar con tranquilidad y volver seguro a casa. "
     "Para que todo esto funcione, la agencia necesita una estructura muy clara, y eso lo explica mi compañero.",
     ["Cuatro componentes en un solo pack.", "No inventamos precios: el informe no los define."],
     "Le paso la palabra al Integrante 2."),
    (7, "Estructura organizacional: organigrama jerárquico", 2, 45,
     "Gracias. Yo les voy a mostrar cómo está organizada Sound Travel por dentro. Este es nuestro organigrama jerárquico. Arriba está la Dirección General, a cargo del Gerente General. Debajo hay tres áreas: Operaciones y Logística, Comercial y Atención al Cliente, y Administración y Finanzas. "
     "Un detalle importante es que el Equipo de Terreno, o sea guías y conductores, depende directamente de Operaciones. Eso no es casual: quien planifica las rutas es el mismo que coordina a las personas que están con los pasajeros el día del evento, así la información no se pierde en el camino.",
     ["Estructura simple y vertical.", "Terreno depende de Operaciones: conexión directa oficina–terreno."],
     "Ahora veamos qué hace cada área en detalle."),
    (8, "Áreas de trabajo y recurso humano", 2, 55,
     "Tenemos cinco cargos principales. La Dirección General planifica, busca alianzas con instituciones y productoras, y vela por el cumplimiento de la normativa turística. Operaciones y Logística arma las rutas, calcula los tiempos, revisa que los minibuses tengan sus papeles al día y prepara los planes de contingencia. "
     "El área Comercial responde consultas en redes, gestiona reservas y publica en Instagram y TikTok. Administración y Finanzas lleva la contabilidad, emite boletas y facturas, controla el presupuesto de cada salida y paga a tiempo a transportistas, locales y ticketeras. "
     "Y el Equipo de Terreno es la cara visible: los guías pasan lista, entregan las pulseras y acompañan al grupo hasta la entrada, mientras los conductores aseguran un manejo prudente y puntual.",
     ["Cada cargo actúa antes, durante o después del evento.", "El Equipo de Terreno es el contacto directo con el cliente."],
     "Esto mismo lo podemos mirar de otra forma: por funciones."),
    (9, "Organigrama funcional", 2, 40,
     "Si el organigrama jerárquico responde a quién depende de quién, el funcional responde a qué función cumple cada área. Agrupamos el trabajo en cuatro funciones: directiva, operativa, comercial y administrativa. "
     "Las cuatro convergen en el centro, que es el servicio integrado. Por ejemplo, la función administrativa liquida los convenios con transportistas y restaurantes, y la operativa diseña los puntos de encuentro. Ojo con un punto: el informe menciona convenios con municipios y SERNATUR, pero como somos una empresa ficticia, esos convenios son una propuesta, no acuerdos firmados.",
     ["Diferencia entre organigrama jerárquico y funcional.", "Convenios institucionales = propuesta."],
     "Ahora, estas funciones se traducen en procesos, algunos internos y otros externos."),
    (10, "Procesos operativos internos y externos", 2, 50,
     "A la izquierda están los procesos internos: planificar rutas y puntos de encuentro, revisar documentos y mantención de los minibuses, gestionar reservas y la nómina de pasajeros, controlar pagos y presupuesto, y finalmente ejecutar el embarque y el retorno. "
     "A la derecha están los procesos externos, que se dan en tres frentes: proveedores, alianzas estratégicas y clientes. Las flechas del medio van en ambos sentidos porque lo interno prepara lo que comprometemos afuera, y lo externo nos devuelve información clave, como qué calles estarán cerradas o cuántos pasajeros confirmaron.",
     ["Interno y externo se retroalimentan.", "Tres frentes externos: proveedores, alianzas y clientes."],
     "Todo esto se ordena en un flujo de cinco etapas."),
    (11, "Diagrama de flujo del servicio en cinco etapas", 2, 50,
     "Este es el recorrido completo del servicio. En la etapa 1 difundimos el Pack Evento en Instagram y TikTok. En la etapa 2 el cliente consulta, cotiza y compra por la web o WhatsApp, y recibe su voucher. En la etapa 3, la más crítica, bloqueamos asientos, comidas y entradas con los proveedores. En la etapa 4 se hace el traslado con acompañamiento del guía, y en la etapa 5 volvemos seguros a Temuco y enviamos una encuesta de calidad. "
     "La flecha verde muestra que esa encuesta alimenta las próximas salidas, o sea, hay mejora continua. Un detalle: el informe no dice quién envía la encuesta, por eso lo marcamos con asterisco.",
     ["Etapa 3 es el punto de coordinación con proveedores.", "La encuesta cierra el ciclo y mejora el servicio."],
     "Justamente en la etapa 3 aparecen muchos actores externos. Le paso la palabra al Integrante 3, que explica cómo nos coordinamos con ellos."),
    (12, "Ecosistema de actores turísticos", 3, 40,
     "Gracias. Para que el pack funcione, Sound Travel trabaja con seis tipos de actores. Tenemos proveedores privados, como las empresas de transporte y los locales gastronómicos; un aliado comercial, que son las ticketeras y productoras; actores públicos, como la Municipalidad de Temuco, SERNATUR Araucanía, la seguridad municipal y Carabineros; y por supuesto la demanda, que son nuestros clientes. "
     "La guía también menciona alojamiento y seguros. Siendo honestos, en nuestro servicio no aplican porque son salidas de un día; para los viajes a Santiago o Concepción eso queda pendiente de definir.",
     ["Cuatro grupos: proveedores, aliados, actores públicos y demanda.", "Alojamiento no aplica al servicio actual."],
     "Ahora veamos cómo se relaciona cada uno con la agencia."),
    (13, "Mapa de relaciones funcionales", 3, 60,
     "Este mapa es el corazón de nuestra coordinación. Sound Travel está al centro porque es quien diseña el programa, contrata, coordina horarios y supervisa en terreno. "
     "Las líneas continuas violeta son relaciones contractuales o comerciales: con el transporte tenemos contratación B2B, con las ticketeras una alianza comercial, con los locales un convenio de alimentación y con los clientes una compra directa B2C. Las líneas punteadas celestes son de coordinación y flujo de información: con el municipio, SERNATUR y la seguridad local no compramos nada, pero intercambiamos información y permisos. "
     "Las flechas son dobles porque la información va y vuelve: nosotros entregamos nóminas y horarios, y ellos nos informan apertura de puertas, cierres de calles o dónde podemos estacionar.",
     ["Sound Travel como coordinador central.", "Dos tipos de vínculo: contractual/comercial y coordinación/información.", "La información circula en ambos sentidos."],
     "Bajemos al detalle de qué le corresponde a cada proveedor."),
    (14, "Responsabilidades de los proveedores", 3, 50,
     "Cada proveedor tiene responsabilidades claras. El transporte debe tener máquinas limpias, revisión técnica vigente y choferes profesionales descansados. Las ticketeras emiten y validan los códigos QR o entradas físicas y nos avisan la hora de apertura de puertas. Los locales gastronómicos tienen que tener las mesas y menús listos para no atrasar el itinerario. "
     "Pero la relación es de doble vía: abajo ven lo que cada uno recibe de nosotros. Por ejemplo, el restaurante necesita saber a qué hora llegamos y cuántas personas somos, y recibe el pago de la reserva entre 72 y 24 horas antes. Si nosotros fallamos en eso, ellos tampoco pueden cumplir.",
     ["Obligaciones de cada proveedor.", "Doble vía: la agencia también tiene compromisos."],
     "Además de los proveedores, hay dos frentes más: el institucional y el comercial."),
    (15, "Coordinación institucional y comercial", 3, 45,
     "Con la Municipalidad de Temuco, SERNATUR Araucanía, la seguridad municipal y Carabineros mantenemos una coordinación institucional. ¿Para qué? Para saber qué calles estarán cerradas, dónde se autoriza estacionar los buses, cuáles son las vías de evacuación y para contar con resguardo en las zonas de embarque nocturno. Recalco que es una relación propuesta: no tenemos convenios firmados. "
     "En lo comercial trabajamos con un modelo B2C, o sea venta directa al público, usando Instagram, TikTok, la página web y WhatsApp Business, donde cotizamos, cerramos la venta y enviamos el voucher.",
     ["Lo institucional aporta información y seguridad.", "Lo comercial trae al cliente por canales digitales."],
     "Y todo esto tiene sentido solo si responde a lo que el cliente necesita."),
    (16, "Necesidades de la demanda e interdependencia", 3, 45,
     "En esta tabla cruzamos cada necesidad del cliente con la respuesta del servicio y los actores que intervienen. Por ejemplo, volver seguro de noche se resuelve con el reencuentro 30 minutos después del show, el conteo de pasajeros y la pulsera por bus, y ahí participan el guía, el conductor y la seguridad local. "
     "Abajo está la cadena de interdependencia: si la entrada no se emite, si el bus no llega o si la mesa no está lista, el cliente no queda satisfecho aunque todo lo demás funcione. Por eso no basta con contratar; hay que coordinar.",
     ["Servicio diseñado desde las necesidades del cliente.", "Un solo eslabón que falla afecta a todo el servicio."],
     "La pregunta entonces es: ¿con qué criterios aseguramos que cada eslabón cumpla? Eso lo responde el Integrante 4."),
    (17, "Estándares técnicos y normativos", 4, 50,
     "Gracias. Yo cierro con el criterio 2.1.3. La asignación de tareas en Sound Travel se basa en cuatro criterios; parto por los técnicos y normativos. En lo técnico, antes de cada salida el Jefe de Operaciones aplica un checklist al minibús: neumáticos, cinturones, botiquín y climatización. Los guías usan una nómina digital y entregan pulseras de color según el bus. "
     "En lo normativo, proponemos inscribir la agencia en el Registro Nacional de Prestadores de SERNATUR, que regula la Ley 20.423. Exigimos a los transportistas cumplir el Decreto Supremo 80 de transporte privado remunerado, conductores con licencia profesional A2 o A3 y SOAP vigente. "
     "Al revisar las fuentes hicimos dos ajustes al informe: el registro está en el Título VII de la ley y, para agencias, la inscripción es voluntaria; y las clases de licencia vienen de la Ley de Tránsito 18.290, no del Decreto 80.",
     ["Los estándares definen quién verifica qué.", "Corrección de citas = revisión crítica de fuentes."],
     "Pero operar bien no es solo cumplir la norma; también hay que cuidar el entorno y entender el territorio."),
    (18, "Sustentabilidad y contexto territorial", 4, 40,
     "En sustentabilidad aplicamos la regla Viaje Limpio, con bolsas de reciclaje en cada minibús, usamos solo tickets y credenciales digitales, y priorizamos locales gastronómicos de la zona para que el gasto quede en la región. "
     "En cuanto al territorio, La Araucanía tiene lluvias repentinas, neblina nocturna en la Ruta 5 Sur y mucha congestión en la ruta entre Villarrica y Pucón en verano. Por eso fijamos puntos de encuentro céntricos e iluminados, como el sector de Avenida Alemania o la Plaza Teodoro Schmidt, y salimos con margen para no quedar atrapados en los tacos.",
     ["Sustentabilidad ambiental y económica local.", "El territorio condiciona horarios y puntos de encuentro."],
     "Con estos cuatro criterios armamos la matriz de tareas."),
    (19, "Matriz de asignación de tareas y responsables", 4, 45,
     "La matriz responde quién hace qué, cuándo y con qué criterio. Entre 72 y 24 horas antes, el Jefe de Operaciones y el administrativo revisan documentos, pagan reservas y cierran la nómina. El día del evento, guía y conductor hacen la citación, el control de lista digital y la charla de seguridad. Durante el evento, el guía acompaña y se coordina con seguridad municipal; y en el retorno se reúne al grupo, se cuenta a todos y se regresa a Temuco. "
     "Agregamos una quinta fila, el post-evento, porque la encuesta aparece en el informe pero no tenía responsable en la matriz. La marcamos como complemento y sugerimos que la haga el área Comercial.",
     ["Cada tarea tiene responsable y criterio aplicado.", "La fila post-evento es un complemento declarado."],
     "Asignar tareas no basta: hay que hacer seguimiento."),
    (20, "Comunicación y seguimiento: una línea de tiempo", 4, 40,
     "Esta línea de tiempo muestra cómo seguimos a cada actor. A los proveedores, el Jefe de Operaciones les confirma por correo siete días antes y por WhatsApp 24 horas antes, validando patentes, choferes y horarios. "
     "Al equipo interno lo seguimos el día del evento con un grupo de WhatsApp operativo y radios, porque en el Estadio Germán Becker suele caerse la señal. El guía reporta cuatro hitos: bus en el punto, salida completa, llegada y comienzo del retorno. "
     "Y a los clientes los acompañamos desde la compra, con el comprobante y el canal del bus, hasta el día siguiente, cuando reciben la encuesta.",
     ["Canales distintos según el actor.", "Cuatro hitos de reporte el día del evento."],
     "¿Y si algo sale mal? Para eso está el protocolo de contingencias."),
    (21, "Protocolo de coordinación ante contingencias", 4, 35,
     "En verde están las respuestas que ya vienen en el informe: plan para cortes de tránsito y mal clima, radios si se cae la señal, el guía en un punto de asistencia ante emergencias y la pulsera y la ubicación en tiempo real para quien se desoriente. "
     "En ámbar está lo que nosotros proponemos para completarlo, porque el informe no tenía un protocolo formal: tener un proveedor de respaldo y un procedimiento si un pasajero no llega al reencuentro, con un escalamiento claro desde el guía hasta Carabineros si es necesario.",
     ["Distinguir lo que está en el informe de lo propuesto.", "Escalamiento: guía → jefe de operaciones → dirección → seguridad."],
     "Para terminar, conectamos todo con los criterios de evaluación."),
    (22, "Conclusiones: coordinar es anticipar", 4, 30,
     "En resumen: para el criterio 2.1.1 mostramos una estructura simple y un flujo de cinco etapas que une procesos internos y externos. Para el 2.1.2, Sound Travel actúa como coordinador central entre transporte, ticketeras, gastronomía, instituciones y clientes. Y para el 2.1.3, asignamos tareas con criterios técnicos, normativos, sustentables y territoriales, y las controlamos con seguimiento y contingencias. "
     "Un servicio de eventos funciona solo si cada actor sabe qué hacer, cuándo y a quién informar. Muchas gracias; quedamos atentos a sus preguntas.",
     ["Un mensaje por criterio.", "Cierre con la frase central."],
     "Se deja proyectada la diapositiva 23 (referencias) durante las preguntas."),
]

d = base_doc()
t = d.add_paragraph()
t.alignment = WD_ALIGN_PARAGRAPH.LEFT
r = t.add_run("SOUND TRAVEL")
r.bold = True
r.font.size = Pt(28)
r.font.color.rgb = VIOLET
r.font.name = "Arial"
p = d.add_paragraph()
r = p.add_run("Guion de exposición para cuatro integrantes")
r.font.size = Pt(16)
r.bold = True
para(d, "Coordinación en Operaciones Turísticas (GTD404) · Unidad 2 · INACAP Sede Temuco · Docente: Evelyn Rios Soto", color=GREY)
para(d, "Duración total provisoria: 16 minutos (≈ 4 minutos por integrante). Los tiempos están en la tabla de distribución; para ajustar la duración total, acorten o alarguen la explicación oral de las diapositivas marcadas como «flexibles».", italic=True)

d.add_heading("1. Distribución de diapositivas y tiempos", level=1)
groups = {1: [], 2: [], 3: [], 4: []}
for n, title, who, secs, *_ in SLIDES:
    groups[who].append((n, title, secs))
rows = []
total = 0
for who in (1, 2, 3, 4):
    secs = sum(s for *_, s in groups[who])
    total += secs
    nums = [n for n, *_ in groups[who]]
    rows.append((f"Integrante {who}", f"{nums[0]}–{nums[-1]}", str(len(nums)),
                 {1: "Contexto, Sound Travel, misión, visión, público y propuesta de valor",
                  2: "Organigramas, áreas, RR. HH., procesos y diagrama de flujo",
                  3: "Actores, mapa de relaciones, responsabilidades, coordinación y demanda",
                  4: "Normativa, sustentabilidad, territorio, matriz, seguimiento, contingencias y conclusiones"}[who],
                 {1: "2.1.1 (base)", 2: "2.1.1", 3: "2.1.2", 4: "2.1.3"}[who],
                 f"{secs // 60}:{secs % 60:02d}"))
rows.append(("TOTAL", "1–22 (+23 de apoyo)", "22 + 1", "", "", f"{total // 60}:{total % 60:02d}"))
table(d, ["Expositor", "Diapositivas", "N.°", "Contenido", "Criterio", "Tiempo"], rows, [2.4, 2.4, 1.0, 6.7, 2.0, 1.5])
para(d, "")
para(d, "", bold_lead="Por qué este reparto es equilibrado:")
bullet(d, "El Integrante 1 tiene más diapositivas (6), pero dos de ellas son breves (portada y ruta). Su carga real es comparable.")
bullet(d, "El Integrante 4 tiene la sección más técnica (normativa y matriz); por eso sus diapositivas tienen tiempos acotados y el guion prioriza ideas clave.")
bullet(d, "Los integrantes 2 y 3 tienen cinco diapositivas cada uno con diagramas centrales (flujo y mapa de relaciones), que concentran 50–60 segundos.")
para(d, "Diapositivas flexibles para ajustar la duración: 3, 8, 13, 17 (pueden acortarse 10–15 s cada una) y 2, 6, 22 (pueden alargarse si sobra tiempo).", italic=True)

d.add_heading("2. Guion por diapositiva", level=1)
para(d, "Consejo general: no lean la diapositiva. El guion explica y da ejemplos; la diapositiva solo apoya. Las frases entre comillas de transición pueden decirse con sus propias palabras.", italic=True, color=GREY)
current = None
for n, title, who, secs, text, emph, trans in SLIDES:
    if who != current:
        current = who
        d.add_heading(f"INTEGRANTE {who}", level=2)
    d.add_heading(f"Diapositiva {n} · {title}", level=3)
    para(d, f"Integrante {who}   ·   Duración estimada: {secs // 60}:{secs % 60:02d}", color=GREY, size=10)
    para(d, text, bold_lead="Explicación oral: ")
    p = d.add_paragraph()
    r = p.add_run("Ideas que deben enfatizarse:")
    r.bold = True
    for e in emph:
        bullet(d, e)
    para(d, f"«{trans}»", bold_lead="Transición: ", color=VIOLET)

d.add_heading("3. Recomendaciones para el ensayo", level=1)
for tx in [
    "Ensayen con cronómetro al menos dos veces completas, respetando los cambios de integrante.",
    "En cada cambio de expositor, quien termina nombra a quien sigue y el tema que tratará; quien entra comienza con «Gracias».",
    "Si la profesora pregunta por normativa, recuerden: el registro de SERNATUR es voluntario para agencias (Ley 20.423, art. 33) y obligatorio para alojamiento y turismo aventura; las licencias A2/A3 están en la Ley 18.290.",
    "Si preguntan por el festival 2027 o por convenios: respondan que son escenarios y propuestas de una empresa ficticia, no hechos confirmados.",
    "Completen sus nombres en la portada (diapositiva 1) antes de exponer.",
]:
    bullet(d, tx)
d.save(f"{OUT_DIR}/Sound_Travel_Guion_Exposicion.docx")

# ---------------------------------------------------------------------------
# Matriz de cumplimiento + análisis
# ---------------------------------------------------------------------------
d = base_doc()
p = d.add_paragraph()
r = p.add_run("SOUND TRAVEL · Matriz de cumplimiento académico")
r.bold = True
r.font.size = Pt(20)
r.font.color.rgb = VIOLET
para(d, "GTD404 · Unidad 2 · Relación entre los criterios de la guía, las diapositivas y los expositores", color=GREY)
para(d, "Advertencia: la guía remite a un instrumento de evaluación disponible en AAI que no fue entregado. Esta matriz se construyó con los criterios explícitos de la guía; no es posible garantizar el cumplimiento de indicadores adicionales de esa rúbrica.", italic=True, color=AMBER)

d.add_heading("1. Matriz de verificación", level=1)
M = [
    ("2.1.1", "Selección o creación de la empresa y justificación", "3, 4", "1", "Cumple"),
    ("2.1.1", "Nombre, localización, misión, visión y público objetivo", "4, 5", "1", "Cumple"),
    ("2.1.1", "Propuesta de valor / servicio prestado", "6", "1", "Cumple"),
    ("2.1.1", "Organigrama básico (jerárquico)", "7", "2", "Cumple"),
    ("2.1.1", "Descripción de áreas y funciones", "8", "2", "Cumple"),
    ("2.1.1", "Recurso humano y roles (guía, jefe de operaciones, vendedor, etc.)", "8", "2", "Cumple"),
    ("2.1.1", "Organigrama funcional", "9", "2", "Cumple"),
    ("2.1.1", "Procesos internos", "10", "2", "Cumple"),
    ("2.1.1", "Procesos externos: relación con proveedores (alojamiento, transporte, alimentación, seguros)", "10, 12, 14", "2 y 3", "Parcial: transporte, alimentación y ticketeras desarrollados; alojamiento no aplica (salidas de día); seguros solo SOAP"),
    ("2.1.1", "Procesos externos: alianzas estratégicas (SERNATUR, municipios, organizaciones locales)", "10, 15", "2 y 3", "Cumple (declaradas como propuesta)"),
    ("2.1.1", "Procesos externos: clientes y canales de comercialización", "10, 15", "2 y 3", "Cumple"),
    ("2.1.1", "Diagrama de flujo o mapa de procesos", "11", "2", "Cumple"),
    ("2.1.2", "Identificación de los actores del servicio", "12", "3", "Cumple"),
    ("2.1.2", "Diagrama funcional: empresa al centro, actores alrededor", "13", "3", "Cumple"),
    ("2.1.2", "Líneas o flechas según tipo de relación (coordinación, contratación, información)", "13", "3", "Cumple"),
    ("2.1.2", "Responsabilidades y funciones de cada actor", "12, 14, 15", "3", "Cumple"),
    ("2.1.2", "Relación entre servicio, características y necesidades de la demanda", "5, 16", "1 y 3", "Cumple"),
    ("2.1.2", "Interdependencia operativa entre actores", "13, 14, 16", "3", "Cumple"),
    ("2.1.3", "Criterio de asignación: estándares técnicos", "17", "4", "Cumple"),
    ("2.1.3", "Criterio de asignación: estándares normativos", "17", "4", "Cumple (citas corregidas; verificar texto vigente en bcn.cl)"),
    ("2.1.3", "Criterio de asignación: sustentabilidad", "18", "4", "Cumple"),
    ("2.1.3", "Criterio de asignación: contexto territorial", "4, 18", "1 y 4", "Cumple"),
    ("2.1.3", "Matriz de asignación de tareas y responsables", "19", "4", "Cumple (fila post-evento complementaria)"),
    ("2.1.3", "Seguimiento de proveedores", "20", "4", "Cumple"),
    ("2.1.3", "Seguimiento de operadores", "20", "4", "Cumple"),
    ("2.1.3", "Seguimiento de clientes", "20", "4", "Cumple"),
    ("2.1.3", "Protocolos de coordinación y respuesta ante contingencias (solicitado en el encargo)", "21", "4", "Parcial en el informe; completado en la presentación con propuestas señaladas"),
    ("Forma", "Portada, introducción, desarrollo y conclusión", "1, 2–3, 4–21, 22", "1–4", "Cumple"),
    ("Forma", "Referencias bibliográficas", "23", "4", "Cumple"),
]
table(d, ["Criterio", "Evidencia requerida", "Diapositiva", "Expositor", "Estado"], M, [1.7, 6.4, 2.0, 1.7, 4.2], status_col=4)

d.add_heading("2. Resumen por criterio", level=1)
table(d, ["Criterio", "Evidencia requerida", "Diapositivas", "Expositor", "Estado"], [
    ("2.1.1", "Estructuras y procesos internos/externos", "3–11", "Integrantes 1 y 2", "Cumple (un subrequisito parcial: alojamiento y seguros)"),
    ("2.1.2", "Relaciones funcionales entre actores", "12–16", "Integrante 3", "Cumple"),
    ("2.1.3", "Criterios técnicos, asignación y seguimiento", "17–21", "Integrante 4", "Cumple (contingencias completadas con propuestas)"),
], [1.5, 5.5, 2.2, 3.0, 3.8], status_col=4)

d.add_heading("3. Análisis de los documentos fuente", level=1)
d.add_heading("3.1 Vacíos e inconsistencias detectados", level=2)
gaps = [
    ("Cita normativa (Ley 20.423). ", "El informe atribuye la inscripción en el Registro Nacional de Prestadores al artículo 19. El registro se regula en el Título VII (arts. 30 y siguientes); el art. 33 establece que la inscripción es voluntaria, salvo para alojamiento turístico (art. 34) y turismo aventura. Corregido en la diapositiva 17."),
    ("Cita normativa (licencias). ", "El informe vincula las licencias A2/A3 al D.S. 80/2004. Las clases de licencia están en el art. 12 de la Ley 18.290 de Tránsito (A2: 10 a 17 asientos; A3: sin límite). El D.S. 80 regula el transporte privado remunerado de pasajeros. Corregido en la diapositiva 17."),
    ("Festival Internacional de Temuco 2027. ", "El informe lo presenta como «anunciado». No se encontró confirmación verificable; se presenta como escenario proyectado (diapositiva 3)."),
    ("Proveedores de alojamiento y seguros. ", "La guía los menciona como ejemplos; el informe no los desarrolla. Alojamiento no aplica a salidas de día; para viajes a Santiago o Concepción queda por definir. Seguros: solo SOAP de transportistas; un seguro de asistencia al pasajero no está considerado."),
    ("Matriz de tareas incompleta. ", "El informe cubre cuatro momentos y omite la etapa 5 (encuesta post-evento), sin responsable asignado. Se agregó una fila complementaria (diapositiva 19)."),
    ("Protocolo de contingencias. ", "El informe menciona planes de contingencia y medidas aisladas, pero no un protocolo formal. Se ordenaron en una tabla y se añadieron dos situaciones y un escalamiento marcados como propuesta (diapositiva 21)."),
    ("Responsables de etapas 1 y 2 del flujo. ", "No están explícitos en la figura 2; se dedujeron de la secc. 3.1 y 3.2 (área Comercial)."),
    ("Cantidad de integrantes. ", "La guía indica grupos de 2 o 3 integrantes y el informe registra un solo integrante; la presentación se diseñó para 4 según lo solicitado. Confirmen con la docente si la conformación es válida."),
    ("Formato de entrega. ", "La guía describe un pre-informe escrito y su entrega como «material audiovisual» en AAI; la presentación es una adaptación oral del informe."),
    ("Instrumento de evaluación. ", "La rúbrica de AAI no fue proporcionada (ver advertencia inicial)."),
]
for lead, tx in gaps:
    bullet(d, tx, lead)

d.add_heading("3.2 Clasificación de la información utilizada", level=2)
table(d, ["Tipo", "Ejemplos en la presentación", "Cómo se presenta"], [
    ("Dato verificable externo", "3,6 millones de visitantes internacionales en 2023 (Subsecretaría de Turismo, 2024, citada en la guía); contenido de Ley 20.423, D.S. 80, Ley 18.290 y Ley 18.490", "Con fuente en la diapositiva"),
    ("Propuesta operativa de la empresa ficticia", "Estructura, cargos, rutas, pack, convenios, alianzas institucionales, matriz, canales de seguimiento, sustentabilidad", "Atribuida al informe; convenios e inscripción en registro rotulados como propuesta"),
    ("Escenario proyectado", "Festival Internacional de Temuco 2027", "Etiqueta «Escenario proyectado»"),
    ("Complemento del equipo", "Fila post-evento, dos contingencias, escalamiento, cadena de interdependencia", "Rotulado en ámbar o como «análisis del equipo»"),
    ("Requiere verificación", "Texto vigente de las normas en bcn.cl; condiciones reales de tránsito y permisos municipales para buses turísticos", "Nota en diapositivas 17 y 23"),
], [3.5, 8.0, 4.5])

d.add_heading("3.3 Fuentes consultadas para la verificación normativa", level=2)
for tx in [
    "SERNATUR – Ley 20.423 modificada: https://www.sernatur.cl/transparencia/archivos/marco-normativo/marco-norm-aplic/LEY-20423-modificada.pdf",
    "SERNATUR – Portal de Servicios Turísticos (registro): https://portalserviciosturisticos.sernatur.cl/formalizate/sello-r/",
    "BCN – Ley 20.423: https://www.bcn.cl/leychile/navegar?i=1010960",
    "BCN – D.S. 80/2004 MTT: https://www.bcn.cl/leychile/navegar?i=230180",
    "SUSESO – Ley 18.290, art. 12: https://www.suseso.gob.cl/612/w3-propertyvalue-99407.html",
]:
    bullet(d, tx)
para(d, "Recomendación: antes de la exposición, revisen el texto vigente de cada norma directamente en bcn.cl.", italic=True, color=AMBER)
d.save(f"{OUT_DIR}/Sound_Travel_Matriz_Cumplimiento.docx")
print("ok")

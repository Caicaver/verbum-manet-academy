/* ============================================================================
 * VERBUM MANET ACADEMY · data/glossary.js
 *
 * Glosario académico global. Script clásico (sin type=module) para exponer la
 * variable global `GLOSSARY`, consumida por:
 *
 *   · CourseLoader.initGlossaryTerm()  → tooltips sobre [data-glossary-term]
 *   · pages/glossary.html              → vista completa navegable
 *   · Cualquier fragmento de curso que quiera referenciar términos entre sí
 *
 * Esquema de cada entrada:
 *   {
 *     term:       string     nombre canónico (con tildes y mayúsculas)
 *     definition: string     definición académica parafraseada (1–4 oraciones)
 *     related:    string[]   IDs de otros términos del glosario
 *     courses:    string[]   IDs de cursos (de COURSES_INDEX) donde se trata
 *   }
 *
 * Todos los IDs (llaves del objeto) siguen convención kebab-case con tildes
 * latinizadas (á → a, ñ → n) para facilitar la escritura en atributos HTML.
 * Todas las definiciones son redacciones originales en paráfrasis académica;
 * ninguna reproduce texto de fuentes copyrightadas.
 * ========================================================================= */

(function (global) {
  'use strict';

  const GLOSSARY = {

    // =========================================================================
    //  LAS CINCO SOLAS · los principios formales y materiales de la Reforma
    // =========================================================================

    'sola-scriptura': {
      term: 'Sola Scriptura',
      definition:
        'Principio formal de la Reforma: la Sagrada Escritura es la única regla ' +
        'suficiente, final e infalible de fe y práctica. No niega el valor de la ' +
        'tradición, la razón o los concilios, pero los somete a todos al juicio del ' +
        'texto bíblico. Se distingue de la nuda Scriptura (la Biblia aislada de toda ' +
        'ayuda interpretativa) y se articula en Westminster I.6–10.',
      related: ['sola-fide', 'sola-gratia', 'solus-christus', 'soli-deo-gloria', 'canon', 'perspicuidad', 'confesion-de-westminster'],
      courses: ['introduccion-teologia-reformada', 'bibliologia', 'reforma-protestante']
    },

    'sola-fide': {
      term: 'Sola Fide',
      definition:
        'Principio material de la Reforma: el pecador es justificado únicamente por ' +
        'la fe, apartada de toda obra propia. La fe es el instrumento receptivo que ' +
        'descansa en la justicia imputada de Cristo, no el mérito ni la causa de la ' +
        'justificación. Pablo la articula en Romanos 3:28 y Gálatas 2:15–16.',
      related: ['sola-scriptura', 'sola-gratia', 'justificacion', 'fe-salvadora', 'imputacion-doble'],
      courses: ['introduccion-teologia-reformada', 'cristologia-soteriologia', 'reforma-protestante']
    },

    'sola-gratia': {
      term: 'Sola Gratia',
      definition:
        'La salvación es obra exclusivamente de la gracia divina, desde el decreto ' +
        'eterno de elección hasta la glorificación final. El pecador, muerto en ' +
        'delitos y pecados (Ef 2:1–5), no contribuye con mérito alguno. La gracia ' +
        'sola se opone tanto al pelagianismo como al semipelagianismo.',
      related: ['sola-fide', 'eleccion-incondicional', 'gracia-irresistible', 'ordo-salutis', 'pacto-de-gracia'],
      courses: ['introduccion-teologia-reformada', 'cristologia-soteriologia', 'historia-iglesia-antigua']
    },

    'solus-christus': {
      term: 'Solus Christus',
      definition:
        'Cristo es el único mediador entre Dios y los hombres (1 Ti 2:5), y sólo ' +
        'su persona y su obra consumada bastan para la salvación. Excluye toda ' +
        'mediación sacerdotal humana, la intercesión de los santos y la suficiencia ' +
        'de cualquier obra ajena al sacrificio de la cruz.',
      related: ['sola-fide', 'tres-oficios', 'satisfaccion', 'hipostatica-union'],
      courses: ['introduccion-teologia-reformada', 'cristologia-soteriologia']
    },

    'soli-deo-gloria': {
      term: 'Soli Deo Gloria',
      definition:
        'Principio teleológico de la Reforma: toda la obra de la salvación y toda ' +
        'la vida del creyente existen para la sola gloria de Dios (1 Co 10:31). ' +
        'Articula la cosmovisión reformada como gobierno absoluto de Dios sobre ' +
        'todas las esferas de la realidad, no solo sobre la liturgia.',
      related: ['sola-gratia', 'decretos-divinos', 'providencia'],
      courses: ['introduccion-teologia-reformada', 'etica-biblica-reformada', 'formacion-espiritual-piedad-reformada']
    },


    // =========================================================================
    //  TULIP · los cinco puntos del calvinismo (respuesta a la Remonstrance)
    // =========================================================================

    'tulip': {
      term: 'TULIP',
      definition:
        'Acrónimo mnemotécnico anglosajón que resume los cinco puntos del ' +
        'calvinismo establecidos por los Cánones de Dort (1618–1619): Total ' +
        'depravity, Unconditional election, Limited atonement, Irresistible ' +
        'grace, Perseverance of the saints. Constituyen una respuesta conciliar ' +
        'a los cinco artículos de la Remonstrance arminiana.',
      related: ['depravacion-total', 'eleccion-incondicional', 'expiacion-particular',
                'gracia-irresistible', 'perseverancia-de-los-santos', 'arminianismo', 'canones-de-dort'],
      courses: ['introduccion-teologia-reformada', 'cristologia-soteriologia', 'reforma-protestante']
    },

    'depravacion-total': {
      term: 'Depravación total',
      definition:
        'Doctrina de que la caída corrompió al ser humano en la totalidad de sus ' +
        'facultades (mente, voluntad, afectos, cuerpo), no en la máxima extensión ' +
        'posible. No significa que cada persona sea tan mala como podría serlo, ' +
        'sino que ningún aspecto de la naturaleza humana queda indemne, incluido ' +
        'el libre albedrío respecto a Dios.',
      related: ['pecado-original', 'servo-arbitrio', 'imago-dei', 'tulip'],
      courses: ['antropologia-hamartologia', 'introduccion-teologia-reformada']
    },

    'eleccion-incondicional': {
      term: 'Elección incondicional',
      definition:
        'Dios eligió desde antes de la fundación del mundo a quienes serían ' +
        'salvados, no en vista de fe, mérito o condición alguna prevista en ellos, ' +
        'sino según el puro beneplácito de su voluntad (Ef 1:4–5). Se distingue de ' +
        'la elección condicional arminiana basada en presciencia de fe.',
      related: ['predestinacion', 'decretos-divinos', 'arminianismo', 'tulip', 'pactum-salutis'],
      courses: ['teologia-propia', 'cristologia-soteriologia']
    },

    'expiacion-particular': {
      term: 'Expiación particular',
      definition:
        'También llamada expiación definida o limitada. La obra expiatoria de ' +
        'Cristo fue intencionada específicamente para los elegidos y es eficaz para ' +
        'todos ellos, sin posibilidad de fracasar en su diseño. Argumentada ' +
        'clásicamente por John Owen en *La muerte de la muerte en la muerte de Cristo* (1647).',
      related: ['satisfaccion', 'propiciacion', 'eleccion-incondicional', 'owen', 'tulip'],
      courses: ['cristologia-soteriologia']
    },

    'gracia-irresistible': {
      term: 'Gracia irresistible',
      definition:
        'También llamada gracia eficaz. La obra regenerativa del Espíritu Santo en ' +
        'los elegidos es siempre eficaz: vence la resistencia del corazón carnal y ' +
        'produce infaliblemente la fe salvadora. No anula la voluntad humana; la ' +
        'renueva para que desee libremente lo que antes rechazaba.',
      related: ['regeneracion', 'llamado-eficaz', 'tulip', 'servo-arbitrio'],
      courses: ['cristologia-soteriologia']
    },

    'perseverancia-de-los-santos': {
      term: 'Perseverancia de los santos',
      definition:
        'Quienes han sido verdaderamente regenerados por Dios perseverarán en la fe ' +
        'hasta el fin y no podrán perder definitivamente la salvación. Se distingue ' +
        'del eterno seguro sin fruto, pues la perseverancia reformada exige evidencia ' +
        'de santificación progresiva (He 12:14).',
      related: ['santificacion', 'glorificacion', 'tulip', 'pacto-de-gracia'],
      courses: ['cristologia-soteriologia']
    },

    'arminianismo': {
      term: 'Arminianismo',
      definition:
        'Sistema teológico derivado de Jacobo Arminio (1560–1609) que sostiene la ' +
        'elección condicional basada en presciencia de fe, la gracia universal ' +
        'resistible, la expiación universal en intención y la posibilidad de apostasía ' +
        'definitiva. Fue condenado por el Sínodo de Dort como desviación de la fe reformada.',
      related: ['tulip', 'sinodo-de-dort', 'canones-de-dort'],
      courses: ['historia-iglesia-moderna', 'reforma-protestante']
    },


    // =========================================================================
    //  TÉRMINOS LATINOS Y GRIEGOS TÉCNICOS
    // =========================================================================

    'theopneustos': {
      term: 'Theopneustos (θεόπνευστος)',
      definition:
        'Término griego que Pablo emplea en 2 Timoteo 3:16 para describir la ' +
        'Escritura: literalmente "respirada por Dios" o "exhalada por Dios". Fundamenta ' +
        'la doctrina reformada de la inspiración verbal plenaria: el aliento de Dios ' +
        'no se posa sobre conceptos generales, sino sobre las palabras del texto mismo.',
      related: ['inspiracion-verbal-plenaria', 'inerrancia', 'canon', 'warfield'],
      courses: ['bibliologia']
    },

    'homoousios': {
      term: 'Homoousios (ὁμοούσιος)',
      definition:
        'Término griego central del Credo Niceno (325 d.C.) que confiesa que el Hijo ' +
        'es "de la misma sustancia" que el Padre. Frente al arrianismo, que lo ' +
        'consideraba meramente *homoiousios* (de sustancia semejante), el término ' +
        'garantiza la plena divinidad del Hijo y, por tanto, la validez salvífica de su obra.',
      related: ['credo-niceno', 'trinidad', 'atanasio', 'arrianismo-cristologico'],
      courses: ['historia-iglesia-antigua', 'teologia-propia']
    },

    'ad-fontes': {
      term: 'Ad fontes',
      definition:
        'Expresión latina que significa "a las fuentes". Lema del humanismo renacentista ' +
        'adoptado por los reformadores para reclamar el retorno directo a los textos ' +
        'bíblicos originales (hebreo, arameo, griego) por encima de la Vulgata y las ' +
        'glosas escolásticas. Erasmo encarnó el gesto con su edición del NT griego (1516).',
      related: ['sola-scriptura', 'metodo-historico-gramatical'],
      courses: ['reforma-protestante', 'hermeneutica-biblica', 'historia-iglesia-medieval']
    },

    'ordo-salutis': {
      term: 'Ordo salutis',
      definition:
        'Locución latina para "orden de la salvación": el orden lógico (no necesariamente ' +
        'cronológico) en que Dios aplica la redención de Cristo al elegido. El esquema ' +
        'reformado clásico: elección → llamado eficaz → regeneración → fe y ' +
        'arrepentimiento → justificación → adopción → santificación → glorificación.',
      related: ['regeneracion', 'justificacion', 'llamado-eficaz', 'santificacion', 'adopcion',
                'glorificacion', 'pacto-de-gracia'],
      courses: ['cristologia-soteriologia']
    },

    'pactum-salutis': {
      term: 'Pactum salutis',
      definition:
        'Pacto de Redención: acuerdo eterno intratrinitario, anterior al tiempo y a la ' +
        'creación, en el que el Padre designó al Hijo como mediador de los elegidos y el ' +
        'Hijo aceptó la obra, con el Espíritu como aplicador de sus beneficios. Fundamento ' +
        'eterno del pacto de gracia temporal. Desarrollado por los teólogos federales del siglo XVII.',
      related: ['teologia-federal', 'pacto-de-gracia', 'eleccion-incondicional', 'trinidad'],
      courses: ['teologia-del-pacto', 'cristologia-soteriologia']
    },

    'analogia-fidei': {
      term: 'Analogia fidei',
      definition:
        'Analogía de la fe: principio hermenéutico reformado según el cual la Escritura ' +
        'es el intérprete último de sí misma (Scriptura Scripturam interpretatur). Los ' +
        'pasajes oscuros deben leerse a la luz de los pasajes claros y de la totalidad ' +
        'del mensaje bíblico (Ro 12:6). Se distingue de la alegoría y del concordismo.',
      related: ['perspicuidad', 'metodo-historico-gramatical', 'sola-scriptura'],
      courses: ['hermeneutica-biblica', 'bibliologia']
    },

    'testimonium-spiritus-sancti-internum': {
      term: 'Testimonium Spiritus Sancti internum',
      definition:
        'El testimonio interno del Espíritu Santo. Doctrina calviniana (Institución I.7) ' +
        'según la cual la certeza última de que la Escritura es Palabra de Dios no procede ' +
        'del argumento racional ni del peso de la tradición eclesiástica, sino de la obra ' +
        'iluminadora del Espíritu que persuade el corazón del creyente.',
      related: ['perspicuidad', 'calvino', 'iluminacion'],
      courses: ['bibliologia', 'hermeneutica-biblica']
    },

    'missio-dei': {
      term: 'Missio Dei',
      definition:
        'Locución latina para "la misión de Dios". Expresa la convicción de que la ' +
        'misión no es primordialmente una actividad de la Iglesia sino una propiedad de ' +
        'Dios mismo: el Padre envía al Hijo, el Padre y el Hijo envían al Espíritu, y la ' +
        'Iglesia es enviada al mundo como participación en ese movimiento trinitario.',
      related: ['trinidad', 'pacto-de-gracia'],
      courses: ['misiones-evangelismo-local']
    },

    'fides-quaerens-intellectum': {
      term: 'Fides quaerens intellectum',
      definition:
        'Fórmula de Anselmo de Canterbury (1033–1109): "la fe que busca entender". ' +
        'Expresa la prioridad de la fe como punto de partida del razonamiento teológico: ' +
        'no se cree para entender primero, sino que se cree, y en el creer se busca ' +
        'comprender. Anticipa la crítica reformada al racionalismo ilustrado.',
      related: ['aquino', 'fe-salvadora', 'apologetica'],
      courses: ['historia-iglesia-medieval', 'apologetica-reformada']
    },

    'simul-iustus-et-peccator': {
      term: 'Simul iustus et peccator',
      definition:
        'Fórmula luterana: "al mismo tiempo justo y pecador". Expresa la tensión ' +
        'soteriológica fundamental: el creyente es declarado plenamente justo por la ' +
        'justicia imputada de Cristo (forense), mientras sigue siendo pecador en su ' +
        'condición inherente (la santificación es progresiva, no instantánea).',
      related: ['justificacion', 'santificacion', 'imputacion-doble', 'lutero'],
      courses: ['cristologia-soteriologia', 'reforma-protestante']
    },

    'extra-calvinisticum': {
      term: 'Extra calvinisticum',
      definition:
        'Doctrina cristológica reformada (rechazada por los luteranos que la bautizaron ' +
        'con este nombre): aún durante la encarnación, el Logos divino no quedó totalmente ' +
        'circunscrito al cuerpo de Jesús sino que continuó sosteniendo el universo y ' +
        'ejerciendo su omnipresencia. Preserva la inmutabilidad y la trascendencia del Hijo.',
      related: ['hipostatica-union', 'dos-naturalezas', 'calvino', 'logos'],
      courses: ['cristologia-soteriologia']
    },

    'ecclesia-semper-reformanda': {
      term: 'Ecclesia semper reformanda',
      definition:
        '"La Iglesia siempre debe reformarse". Axioma reformado de origen neerlandés ' +
        'del siglo XVII: la Iglesia no es una institución estática sino un cuerpo que, ' +
        'sometido a la Palabra, debe renovarse continuamente. No autoriza innovación ' +
        'arbitraria; reforma siempre significa *ad normam Verbi Dei*, conforme a la Escritura.',
      related: ['sola-scriptura', 'marcas-de-la-iglesia'],
      courses: ['eclesiologia-sacramentologia', 'reforma-protestante']
    },


    // =========================================================================
    //  DOCTRINA DE DIOS · TRINIDAD · DECRETOS
    // =========================================================================

    'trinidad': {
      term: 'Trinidad',
      definition:
        'Doctrina fundacional del cristianismo: Dios es uno en esencia y tres en ' +
        'personas (Padre, Hijo y Espíritu Santo), distintas pero consustanciales, ' +
        'coeternas y coiguales. Articulada contra el modalismo, el arrianismo y el ' +
        'triteísmo en Nicea (325), Constantinopla (381) y el Credo Atanasiano.',
      related: ['homoousios', 'credo-niceno', 'credo-atanasiano', 'simplicidad-divina', 'pactum-salutis'],
      courses: ['teologia-propia', 'historia-iglesia-antigua']
    },

    'aseidad': {
      term: 'Aseidad',
      definition:
        'Del latín *a se* ("de sí mismo"). Atributo incomunicable por el que Dios ' +
        'existe por sí mismo, sin depender de ninguna causa externa y sin necesitar ' +
        'nada fuera de sí. Es la razón por la cual Dios puede revelarse como "YO SOY" ' +
        '(Éx 3:14). Fundamento metafísico de la distinción Creador–criatura.',
      related: ['atributos-incomunicables', 'simplicidad-divina', 'trinidad'],
      courses: ['teologia-propia']
    },

    'atributos-incomunicables': {
      term: 'Atributos incomunicables',
      definition:
        'Aquellas perfecciones divinas que, por su naturaleza, no tienen análogo ' +
        'alguno en la criatura: aseidad, simplicidad, inmutabilidad, eternidad, ' +
        'omnipresencia, omnisciencia, omnipotencia. Marcan la distinción ontológica ' +
        'absoluta entre Creador y criatura.',
      related: ['aseidad', 'simplicidad-divina', 'atributos-comunicables'],
      courses: ['teologia-propia']
    },

    'atributos-comunicables': {
      term: 'Atributos comunicables',
      definition:
        'Perfecciones divinas de las que la criatura humana participa analógicamente ' +
        'como imagen de Dios: amor, santidad, justicia, misericordia, fidelidad, ' +
        'sabiduría, veracidad. La participación es siempre criatural, derivada y finita, ' +
        'nunca idéntica al atributo divino en grado o modo.',
      related: ['atributos-incomunicables', 'imago-dei'],
      courses: ['teologia-propia', 'antropologia-hamartologia']
    },

    'decretos-divinos': {
      term: 'Decretos divinos',
      definition:
        'El plan eterno, sabio, libre y soberano de Dios por el cual preordena todo ' +
        'cuanto sucede (Ef 1:11). Los decretos son inmutables, absolutamente eficaces y ' +
        'se ejecutan en el tiempo mediante la creación y la providencia. Westminster ' +
        'III articula el debate supra/infralapsario sobre su orden lógico.',
      related: ['predestinacion', 'providencia', 'eleccion-incondicional', 'confesion-de-westminster'],
      courses: ['teologia-propia']
    },

    'predestinacion': {
      term: 'Predestinación',
      definition:
        'Parte de los decretos divinos referida específicamente al destino eterno de ' +
        'las criaturas racionales. Incluye elección (al pueblo destinado a la gracia ' +
        'salvadora) y reprobación (al que Dios, por su justicia soberana, deja en su ' +
        'condición caída). Ro 9:11–13 es el locus clásico.',
      related: ['eleccion-incondicional', 'decretos-divinos'],
      courses: ['teologia-propia', 'cristologia-soteriologia']
    },

    'providencia': {
      term: 'Providencia',
      definition:
        'Obra por la cual Dios preserva, gobierna y conduce a toda criatura y toda ' +
        'acción hacia sus fines soberanamente decretados (Westminster V). Se distingue ' +
        'la providencia ordinaria (mediante causas segundas) y la extraordinaria ' +
        '(milagros). Coexiste sin contradicción con la responsabilidad humana.',
      related: ['decretos-divinos', 'concurrencia'],
      courses: ['teologia-propia']
    },

    'simplicidad-divina': {
      term: 'Simplicidad divina',
      definition:
        'Atributo incomunicable por el que Dios no está compuesto de partes: sus ' +
        'atributos no son componentes yuxtapuestos sino manifestaciones de su única e ' +
        'indivisible esencia. Dios *es* su sabiduría, *es* su amor, *es* su justicia. ' +
        'Fundamental para entender la unidad divina frente al politeísmo y al panteísmo.',
      related: ['aseidad', 'atributos-incomunicables', 'trinidad'],
      courses: ['teologia-propia']
    },


    // =========================================================================
    //  BIBLIOLOGÍA · INSPIRACIÓN · CANON · REVELACIÓN
    // =========================================================================

    'inspiracion-verbal-plenaria': {
      term: 'Inspiración verbal plenaria',
      definition:
        'Doctrina reformada de la inspiración: Dios inspiró no sólo las ideas generales ' +
        'sino las palabras mismas (verbal) en la totalidad de la Escritura (plenaria), ' +
        'utilizando orgánicamente a los autores humanos sin anular su personalidad ni ' +
        'estilo. Base: 2 Ti 3:16 (theopneustos); 2 Pe 1:20–21.',
      related: ['theopneustos', 'inerrancia', 'canon', 'warfield'],
      courses: ['bibliologia']
    },

    'inerrancia': {
      term: 'Inerrancia',
      definition:
        'Propiedad de la Escritura por la cual, en los manuscritos originales, no ' +
        'afirma nada contrario a la verdad en todo lo que enseña. Formalizada en la ' +
        'Declaración de Chicago sobre la Inerrancia Bíblica (1978). Se distingue ' +
        'técnicamente de la infalibilidad (imposibilidad de engañar).',
      related: ['inspiracion-verbal-plenaria', 'canon', 'warfield', 'machen'],
      courses: ['bibliologia']
    },

    'perspicuidad': {
      term: 'Perspicuidad de la Escritura',
      definition:
        'Doctrina reformada según la cual la Escritura es suficientemente clara en ' +
        'lo esencial para que cualquier creyente, usando los medios ordinarios, pueda ' +
        'comprender lo necesario para la salvación y la vida cristiana (Westminster I.7). ' +
        'No afirma que todo texto sea igualmente fácil, sino que el mensaje central lo es.',
      related: ['analogia-fidei', 'sola-scriptura', 'iluminacion', 'testimonium-spiritus-sancti-internum'],
      courses: ['hermeneutica-biblica', 'bibliologia']
    },

    'canon': {
      term: 'Canon',
      definition:
        'Del griego *kanōn* ("regla"). La lista autorizada de libros que constituyen ' +
        'la Sagrada Escritura. La posición reformada reconoce 39 libros del AT ' +
        '(canon hebreo) y 27 del NT, excluyendo los Deuterocanónicos admitidos por ' +
        'Roma en Trento (1546). Westminster I.2 enumera ambos cánones.',
      related: ['sola-scriptura', 'confesion-de-westminster'],
      courses: ['bibliologia', 'introduccion-antiguo-testamento', 'introduccion-nuevo-testamento']
    },

    'revelacion-general': {
      term: 'Revelación general',
      definition:
        'La autocomunicación de Dios a toda la humanidad mediante la creación, la ' +
        'conciencia moral y el gobierno providencial de la historia (Sal 19; Ro 1:18–32). ' +
        'Es suficiente para dejar sin excusa al pagano, pero insuficiente para salvar: ' +
        'manifiesta existencia y atributos de Dios, no el evangelio de Cristo.',
      related: ['revelacion-especial', 'apologetica', 'providencia'],
      courses: ['bibliologia', 'apologetica-reformada']
    },

    'revelacion-especial': {
      term: 'Revelación especial',
      definition:
        'La autocomunicación particular de Dios mediante actos redentores (Éxodo, ' +
        'encarnación), palabras proféticas y, culminantemente, la persona de Cristo ' +
        '(He 1:1–2). La Escritura es el registro inspirado e infalible de la revelación ' +
        'especial; es necesaria para conocer el evangelio de la salvación.',
      related: ['revelacion-general', 'inspiracion-verbal-plenaria', 'logos'],
      courses: ['bibliologia']
    },

    'iluminacion': {
      term: 'Iluminación',
      definition:
        'Obra del Espíritu Santo por la cual abre el entendimiento del creyente para ' +
        'recibir la verdad de la Escritura (1 Co 2:14). Se distingue de la inspiración ' +
        '(obra concluida en la producción del texto) y de la revelación misma: no añade ' +
        'contenido nuevo, sólo capacita subjetivamente para la recepción del contenido dado.',
      related: ['testimonium-spiritus-sancti-internum', 'perspicuidad', 'regeneracion'],
      courses: ['hermeneutica-biblica', 'bibliologia']
    },


    // =========================================================================
    //  HERMENÉUTICA
    // =========================================================================

    'metodo-historico-gramatical': {
      term: 'Método histórico-gramatical',
      definition:
        'Método interpretativo reformado que busca el sentido que el texto tuvo en su ' +
        'contexto histórico original, aplicando rigurosamente las reglas gramaticales, ' +
        'el análisis de género literario y el estudio del contexto socio-cultural del ' +
        'autor y los receptores. Se opone al alegorismo medieval y al historicismo moderno.',
      related: ['ad-fontes', 'analogia-fidei', 'tipologia', 'exegesis'],
      courses: ['hermeneutica-biblica']
    },

    'tipologia': {
      term: 'Tipología',
      definition:
        'Ciencia interpretativa que identifica las correspondencias divinamente ' +
        'establecidas entre personas, instituciones o eventos del AT (tipos) y sus ' +
        'realidades cumplidas en Cristo (antitipos): Adán, Noé, Moisés, David, el ' +
        'templo, el éxodo. Se distingue de la alegoría por requerir inauguración, ' +
        'escalada y cumplimiento canónicamente verificable.',
      related: ['metodo-historico-gramatical', 'teologia-biblica-vos', 'pacto-de-gracia'],
      courses: ['hermeneutica-biblica', 'teologia-biblica']
    },

    'exegesis': {
      term: 'Exégesis',
      definition:
        'Del griego *ex-ēgeomai* ("sacar de"). La práctica disciplinada de extraer el ' +
        'sentido del texto bíblico mediante el análisis lingüístico, contextual y ' +
        'literario. Se distingue de la hermenéutica (teoría) y se contrapone a la ' +
        'eiségesis (introducir en el texto lo que no dice).',
      related: ['eisegesis', 'metodo-historico-gramatical'],
      courses: ['hermeneutica-biblica']
    },

    'eisegesis': {
      term: 'Eiségesis',
      definition:
        'Del griego *eis-ēgeomai* ("meter en"). Error interpretativo consistente en ' +
        'leer en el texto presupuestos, ideas o conclusiones que no se derivan de él. ' +
        'Toda lectura riesga la eiségesis; la disciplina exegética existe precisamente ' +
        'para evitarla mediante controles metodológicos explícitos.',
      related: ['exegesis', 'metodo-historico-gramatical'],
      courses: ['hermeneutica-biblica']
    },


    // =========================================================================
    //  ANTROPOLOGÍA Y HAMARTOLOGÍA
    // =========================================================================

    'imago-dei': {
      term: 'Imago Dei',
      definition:
        'La condición del ser humano como imagen de Dios (Gn 1:26–28), que incluye ' +
        'dimensiones estructurales (racionalidad, moralidad, espiritualidad) y ' +
        'funcionales (dominio cultural, vicerregencia). La caída dañó la imagen pero ' +
        'no la destruyó; es restaurada en el creyente por la conformidad a Cristo ' +
        '(2 Co 3:18), imagen perfecta del Padre.',
      related: ['pacto-de-obras', 'pecado-original', 'atributos-comunicables', 'santificacion'],
      courses: ['antropologia-hamartologia', 'etica-biblica-reformada']
    },

    'pacto-de-obras': {
      term: 'Pacto de obras',
      definition:
        'También llamado pacto de la creación o pacto de vida. Arreglo original entre ' +
        'Dios y Adán como cabeza federal de la humanidad (Os 6:7; Ro 5:12–21): Adán, ' +
        'por obediencia perfecta, habría obtenido vida eterna confirmada; por su ' +
        'transgresión, introdujo muerte y condenación en todos los que representaba.',
      related: ['teologia-federal', 'imputacion', 'pacto-de-gracia', 'pecado-original'],
      courses: ['antropologia-hamartologia', 'teologia-del-pacto']
    },

    'pecado-original': {
      term: 'Pecado original',
      definition:
        'Doctrina que describe dos realidades conectadas: (1) la imputación del primer ' +
        'pecado de Adán a toda su posteridad, quedando toda la humanidad legalmente ' +
        'condenada en su representante federal; (2) la corrupción heredada de la ' +
        'naturaleza humana, de modo que cada descendiente nace en estado de depravación.',
      related: ['imputacion', 'depravacion-total', 'pacto-de-obras'],
      courses: ['antropologia-hamartologia']
    },

    'imputacion': {
      term: 'Imputación',
      definition:
        'Acto legal divino de atribuir a una persona los méritos o deméritos de otra. ' +
        'Opera en tres dimensiones soteriológicas fundamentales: el pecado de Adán ' +
        'imputado a la humanidad (Ro 5:12–19), el pecado del creyente imputado a Cristo ' +
        '(2 Co 5:21a), y la justicia de Cristo imputada al creyente (2 Co 5:21b). ' +
        'Distinta de la infusión.',
      related: ['imputacion-doble', 'justificacion', 'pacto-de-obras', 'satisfaccion'],
      courses: ['cristologia-soteriologia', 'antropologia-hamartologia']
    },

    'imputacion-doble': {
      term: 'Imputación doble',
      definition:
        'El doble movimiento forense central a la justificación reformada: (1) el ' +
        'pecado del creyente imputado a Cristo en la cruz, de modo que allí recibe la ' +
        'condenación que le correspondía; (2) la justicia activa y pasiva de Cristo ' +
        'imputada al creyente, de modo que ante Dios es declarado perfectamente justo.',
      related: ['imputacion', 'justificacion', 'simul-iustus-et-peccator', 'sola-fide'],
      courses: ['cristologia-soteriologia', 'reforma-protestante']
    },

    'servo-arbitrio': {
      term: 'Servo arbitrio',
      definition:
        'Doctrina defendida por Lutero en *De Servo Arbitrio* (1525) contra Erasmo: la ' +
        'voluntad humana caída, aunque libre de coacción externa (libertad natural), ' +
        'no tiene capacidad espiritual (libertad moral) para elegir el bien salvífico. ' +
        'No es libre voluntad sino voluntad esclava al pecado; sólo la gracia la libera.',
      related: ['depravacion-total', 'gracia-irresistible', 'lutero', 'regeneracion'],
      courses: ['antropologia-hamartologia', 'reforma-protestante']
    },


    // =========================================================================
    //  CRISTOLOGÍA
    // =========================================================================

    'calcedonia': {
      term: 'Calcedonia · Concilio y Definición (451)',
      definition:
        'Cuarto concilio ecuménico, que estableció la definición cristológica ' +
        'clásica: Cristo es una sola persona (contra el nestorianismo) en dos ' +
        'naturalezas (contra el eutiquianismo), divina y humana, unidas ' +
        '"sin confusión, sin cambio, sin división, sin separación". Base de toda ' +
        'cristología ortodoxa posterior.',
      related: ['definicion-de-calcedonia', 'hipostatica-union', 'dos-naturalezas', 'logos'],
      courses: ['historia-iglesia-antigua', 'cristologia-soteriologia']
    },

    'hipostatica-union': {
      term: 'Unión hipostática',
      definition:
        'La unión de las dos naturalezas (divina y humana) en la única persona ' +
        '(*hypostasis*) del Hijo eterno de Dios. No hay mezcla de las naturalezas ni ' +
        'división de la persona. El atributo de cada naturaleza puede predicarse de la ' +
        'única persona (communicatio idiomatum), pero no se comunican entre sí.',
      related: ['calcedonia', 'dos-naturalezas', 'extra-calvinisticum', 'logos'],
      courses: ['cristologia-soteriologia']
    },

    'dos-naturalezas': {
      term: 'Doctrina de las dos naturalezas',
      definition:
        'Cristo posee simultáneamente una naturaleza plenamente divina y una ' +
        'naturaleza plenamente humana, cada una con sus atributos propios, unidas ' +
        'en su persona sin mezcla ni confusión. Necesaria soteriológicamente: sólo ' +
        'Dios puede salvar, sólo un hombre puede representar a los hombres (He 2:14–17).',
      related: ['calcedonia', 'hipostatica-union', 'extra-calvinisticum', 'kenosis'],
      courses: ['cristologia-soteriologia']
    },

    'estados-de-cristo': {
      term: 'Estados de Cristo',
      definition:
        'Los dos grandes momentos de la obra mediadora: (1) estado de humillación ' +
        '(encarnación, sufrimiento, muerte, sepultura, descenso), en que el Hijo se ' +
        'despojó voluntariamente del uso pleno de sus prerrogativas divinas; (2) estado ' +
        'de exaltación (resurrección, ascensión, sesión, retorno glorioso).',
      related: ['kenosis', 'hipostatica-union', 'tres-oficios'],
      courses: ['cristologia-soteriologia']
    },

    'tres-oficios': {
      term: 'Tres oficios de Cristo',
      definition:
        'Esquema calviniano para articular la obra mediadora: profético (revela la ' +
        'voluntad de Dios de manera final, Jn 1:18), sacerdotal (ofrece el sacrificio ' +
        'expiatorio y ejerce intercesión perpetua, He 7:25) y real (gobierna a su ' +
        'Iglesia y al cosmos, cabeza del reino mesiánico). Corresponde a los tres ' +
        'oficios del AT ungidos con aceite.',
      related: ['solus-christus', 'satisfaccion', 'calvino', 'estados-de-cristo'],
      courses: ['cristologia-soteriologia']
    },

    'kenosis': {
      term: 'Kénosis',
      definition:
        'Del griego *kenoō* ("vaciarse"), en Filipenses 2:7. La ortodoxia reformada la ' +
        'interpreta no como abandono de atributos divinos (kenoticismo moderno) sino ' +
        'como un velamiento voluntario del uso manifiesto de las prerrogativas divinas ' +
        'durante el estado de humillación. El Hijo nunca dejó de ser plenamente Dios.',
      related: ['estados-de-cristo', 'extra-calvinisticum', 'hipostatica-union'],
      courses: ['cristologia-soteriologia']
    },

    'logos': {
      term: 'Logos (λόγος)',
      definition:
        'Término griego con que Juan designa al Hijo eterno en el prólogo de su ' +
        'evangelio (Jn 1:1–18): "En el principio era el Verbo, y el Verbo era con Dios, ' +
        'y el Verbo era Dios." Afirma simultáneamente la distinción personal del Hijo ' +
        'respecto al Padre y su plena deidad. Raíz joánica de toda cristología trinitaria.',
      related: ['trinidad', 'hipostatica-union', 'dos-naturalezas', 'extra-calvinisticum'],
      courses: ['cristologia-soteriologia', 'introduccion-nuevo-testamento']
    },


    // =========================================================================
    //  OBRA DE CRISTO · EXPIACIÓN
    // =========================================================================

    'satisfaccion': {
      term: 'Satisfacción',
      definition:
        'Doctrina de la expiación según la cual Cristo, en la cruz, satisfizo plenamente ' +
        'las demandas de la justicia divina contra el pecado de los elegidos. La formuló ' +
        'clásicamente Anselmo en *Cur Deus Homo* (1098) y la desarrolló la soteriología ' +
        'reformada como sustitución penal vicaria.',
      related: ['propiciacion', 'redencion', 'reconciliacion', 'expiacion-particular'],
      courses: ['cristologia-soteriologia', 'historia-iglesia-medieval']
    },

    'propiciacion': {
      term: 'Propiciación',
      definition:
        'Una de las cuatro facetas de la expiación: la obra de Cristo aparta la ira ' +
        'santa de Dios contra el pecado (Ro 3:25; 1 Jn 2:2). No es una manipulación ' +
        'mitológica de la deidad, sino el cumplimiento del propio plan amoroso del Padre ' +
        'para que la justicia se satisfaga sin comprometer la misericordia.',
      related: ['satisfaccion', 'redencion', 'reconciliacion'],
      courses: ['cristologia-soteriologia']
    },

    'redencion': {
      term: 'Redención',
      definition:
        'Faceta de la expiación: Cristo, mediante el pago de su sangre, libera al ' +
        'elegido del cautiverio del pecado, de la maldición de la ley y del poder de la ' +
        'muerte (Gl 3:13; Ef 1:7). Imagen tomada del rescate de esclavos y prisioneros ' +
        'en el mundo antiguo.',
      related: ['satisfaccion', 'propiciacion', 'reconciliacion'],
      courses: ['cristologia-soteriologia']
    },

    'reconciliacion': {
      term: 'Reconciliación',
      definition:
        'Cuarta faceta de la expiación: la obra de Cristo restaura la relación ' +
        'quebrantada entre Dios y el pecador, removiendo la enemistad y estableciendo ' +
        'paz (Ro 5:10–11; 2 Co 5:18–21). Objetivamente cumplida en la cruz; ' +
        'subjetivamente aplicada en la justificación.',
      related: ['satisfaccion', 'propiciacion', 'redencion', 'justificacion'],
      courses: ['cristologia-soteriologia']
    },


    // =========================================================================
    //  ORDO SALUTIS · APLICACIÓN DE LA REDENCIÓN
    // =========================================================================

    'llamado-eficaz': {
      term: 'Llamado eficaz',
      definition:
        'Obra sobrenatural del Espíritu Santo por la cual, mediante la predicación del ' +
        'evangelio, conduce infaliblemente al elegido a Cristo (Ro 8:30; Westminster X). ' +
        'Se distingue del llamado externo o general (la oferta del evangelio a todos los ' +
        'oyentes), que puede ser rechazada. El eficaz produce siempre conversión.',
      related: ['gracia-irresistible', 'regeneracion', 'ordo-salutis'],
      courses: ['cristologia-soteriologia']
    },

    'regeneracion': {
      term: 'Regeneración',
      definition:
        'Obra soberana e instantánea del Espíritu Santo por la cual Dios imparte vida ' +
        'espiritual al pecador muerto (Ef 2:4–5; Jn 3:3–8), creando un corazón nuevo ' +
        'capaz de fe y arrepentimiento. En el orden lógico reformado, la regeneración ' +
        'precede a la fe: el muerto no puede creer para vivir; vive para poder creer.',
      related: ['llamado-eficaz', 'gracia-irresistible', 'fe-salvadora', 'ordo-salutis'],
      courses: ['cristologia-soteriologia']
    },

    'fe-salvadora': {
      term: 'Fe salvadora',
      definition:
        'Disposición receptiva producida por el Espíritu en el regenerado, compuesta ' +
        'clásicamente por tres elementos: *notitia* (conocimiento del contenido del ' +
        'evangelio), *assensus* (asentimiento intelectual a su verdad) y *fiducia* ' +
        '(confianza personal en la persona y obra de Cristo). Don de Dios, no mérito humano.',
      related: ['arrepentimiento', 'regeneracion', 'sola-fide', 'justificacion'],
      courses: ['cristologia-soteriologia']
    },

    'arrepentimiento': {
      term: 'Arrepentimiento',
      definition:
        'Gracia evangélica por la cual el pecador, consciente de su pecado en ' +
        'contraste con la santidad de Dios y la misericordia de Cristo, se aflige y ' +
        'aborrece su pecado, volviéndose a Dios con propósito y esfuerzo de una nueva ' +
        'obediencia (Westminster XV). Compañero inseparable de la fe salvadora.',
      related: ['fe-salvadora', 'regeneracion', 'santificacion'],
      courses: ['cristologia-soteriologia']
    },

    'justificacion': {
      term: 'Justificación',
      definition:
        'Acto forense, judicial y puntual de Dios por el cual, sólo por su gracia y ' +
        'mediante la sola fe, declara justo al pecador perdonando sus pecados y ' +
        'aceptándolo como justo en virtud de la justicia imputada de Cristo ' +
        '(Westminster XI). Se distingue radicalmente de la santificación y de la ' +
        'justificación infusa romana.',
      related: ['sola-fide', 'imputacion-doble', 'sola-gratia', 'adopcion',
                'simul-iustus-et-peccator', 'santificacion'],
      courses: ['cristologia-soteriologia', 'reforma-protestante']
    },

    'adopcion': {
      term: 'Adopción',
      definition:
        'Acto por el cual Dios, por la justificación, recibe al creyente en la familia ' +
        'de sus hijos, le da el Espíritu de adopción (Ro 8:15), derechos filiales, ' +
        'acceso al Padre y herencia eterna con Cristo. Aspecto relacional que acompaña ' +
        'al aspecto forense de la justificación.',
      related: ['justificacion', 'ordo-salutis'],
      courses: ['cristologia-soteriologia']
    },

    'santificacion': {
      term: 'Santificación',
      definition:
        'Obra progresiva de Dios en el regenerado por la cual, mediante la Palabra y el ' +
        'Espíritu, muere al pecado y vive para la justicia, siendo transformado más y ' +
        'más a la imagen de Cristo (2 Co 3:18). A diferencia de la justificación, es ' +
        'progresiva, sinérgica en su manifestación y completada sólo en la glorificación.',
      related: ['justificacion', 'glorificacion', 'perseverancia-de-los-santos', 'simul-iustus-et-peccator'],
      courses: ['cristologia-soteriologia', 'formacion-espiritual-piedad-reformada']
    },

    'glorificacion': {
      term: 'Glorificación',
      definition:
        'Consumación final del *ordo salutis*: en la resurrección, el creyente recibe ' +
        'un cuerpo incorruptible (1 Co 15:42–44), es liberado plenamente del pecado y ' +
        'hecho semejante a Cristo (1 Jn 3:2). La santificación alcanza su meta; la ' +
        'adopción, su plenitud manifiesta.',
      related: ['resurreccion', 'santificacion', 'nueva-creacion', 'ordo-salutis'],
      courses: ['cristologia-soteriologia', 'escatologia']
    },

    'pacto-de-gracia': {
      term: 'Pacto de gracia',
      definition:
        'Respuesta de Dios a la ruptura del pacto de obras: alianza por la cual ofrece ' +
        'vida y salvación mediante Cristo al pecador elegido, requiriendo fe en él como ' +
        'única condición instrumental. Revelado progresivamente desde el ' +
        'proto-evangelio (Gn 3:15) y culminado en el Nuevo Pacto. Una sustancia, ' +
        'administraciones distintas.',
      related: ['pactum-salutis', 'nuevo-pacto', 'teologia-federal', 'pacto-de-obras'],
      courses: ['teologia-del-pacto', 'cristologia-soteriologia']
    },


    // =========================================================================
    //  ECLESIOLOGÍA · SACRAMENTOS
    // =========================================================================

    'marcas-de-la-iglesia': {
      term: 'Marcas de la iglesia',
      definition:
        'Las tres *notae ecclesiae* por las cuales la tradición reformada reconoce a ' +
        'una comunidad como iglesia verdadera: predicación pura de la Palabra, ' +
        'administración correcta de los sacramentos, y ejercicio fiel de la disciplina ' +
        'eclesiástica. Articuladas por Calvino (Institución IV.1) y Juan Knox.',
      related: ['sacramento', 'disciplina-eclesiastica', 'presbiterianismo', 'calvino'],
      courses: ['eclesiologia-sacramentologia']
    },

    'presbiterianismo': {
      term: 'Presbiterianismo',
      definition:
        'Forma de gobierno eclesiástico que la tradición reformada considera prescrita ' +
        'en el NT (Hch 15; 1 Ti 3; Tit 1): la iglesia local es gobernada por un ' +
        'consistorio de ancianos (presbíteros), y las iglesias se interconectan en ' +
        'asambleas graduales (presbiterio, sínodo, asamblea general). Se distingue del ' +
        'episcopalismo y del congregacionalismo.',
      related: ['marcas-de-la-iglesia', 'disciplina-eclesiastica', 'knox'],
      courses: ['eclesiologia-sacramentologia']
    },

    'sacramento': {
      term: 'Sacramento',
      definition:
        'Signo y sello visible de la gracia del pacto, instituido por Cristo, por el ' +
        'cual se representa, confirma y aplica a los creyentes lo que Cristo obró por ' +
        'ellos (Westminster XXVII). La tradición reformada reconoce dos: el bautismo y ' +
        'la Cena del Señor. Se distingue del *ex opere operato* romano y del mero ' +
        'memorialismo zuingliano extremo.',
      related: ['bautismo', 'cena-del-senor', 'presencia-espiritual-real', 'marcas-de-la-iglesia'],
      courses: ['eclesiologia-sacramentologia']
    },

    'bautismo': {
      term: 'Bautismo',
      definition:
        'Sacramento del ingreso al pacto, signo y sello de la unión con Cristo, de la ' +
        'remisión de pecados y del lavamiento de regeneración. La tradición ' +
        'presbiteriano-reformada defiende el paedobautismo: continúa la señal de ' +
        'iniciación del pacto abrahámico (circuncisión → bautismo, Col 2:11–12), ' +
        'aplicada también a los hijos de creyentes.',
      related: ['sacramento', 'pacto-de-gracia', 'pacto-abrahamico'],
      courses: ['eclesiologia-sacramentologia']
    },

    'cena-del-senor': {
      term: 'Cena del Señor',
      definition:
        'Sacramento del progreso en el pacto, por el cual el creyente se alimenta ' +
        'espiritualmente del cuerpo y la sangre de Cristo para su nutrición y ' +
        'crecimiento en gracia (1 Co 10:16). La posición reformada (Calvino) sostiene ' +
        'la presencia espiritual real, frente a la transubstanciación romana, la ' +
        'consubstanciación luterana y el memorialismo zuingliano extremo.',
      related: ['sacramento', 'presencia-espiritual-real', 'calvino'],
      courses: ['eclesiologia-sacramentologia']
    },

    'presencia-espiritual-real': {
      term: 'Presencia espiritual real',
      definition:
        'Doctrina calviniana de la Cena del Señor: Cristo se halla verdadera y ' +
        'realmente presente en el sacramento, no en los elementos (pan y vino) sino ' +
        'para el comulgante de fe, que se nutre de él por la obra del Espíritu Santo ' +
        'que eleva al creyente hasta el Cristo glorificado. Vía media entre Roma y Zwinglio.',
      related: ['cena-del-senor', 'sacramento', 'calvino', 'extra-calvinisticum'],
      courses: ['eclesiologia-sacramentologia', 'reforma-protestante']
    },

    'disciplina-eclesiastica': {
      term: 'Disciplina eclesiástica',
      definition:
        'Tercera marca de la iglesia reformada: ejercicio pastoral de corrección, ' +
        'amonestación y, si necesario, excomunión, conforme al procedimiento de ' +
        'Mateo 18:15–20. Sus fines son la restauración del pecador, la pureza de la ' +
        'iglesia y el honor de Cristo. Su debilitamiento es síntoma eclesiológico crítico.',
      related: ['marcas-de-la-iglesia', 'presbiterianismo'],
      courses: ['eclesiologia-sacramentologia']
    },


    // =========================================================================
    //  ESCATOLOGÍA
    // =========================================================================

    'amilenarismo': {
      term: 'Amilenarismo',
      definition:
        'Posición escatológica reformada mayoritaria, defendida por Agustín y ' +
        'sistematizada modernamente por Vos, Berkhof, Hendriksen y Hoekema. Interpreta ' +
        'el milenio de Apocalipsis 20 simbólicamente como la era presente entre la ' +
        'primera y segunda venidas de Cristo, no como un reino terrenal literal futuro.',
      related: ['postmilenarismo', 'premilenarismo', 'nueva-creacion', 'vos'],
      courses: ['escatologia']
    },

    'postmilenarismo': {
      term: 'Postmilenarismo',
      definition:
        'Posición escatológica que sostiene que Cristo volverá después de un período ' +
        'extenso de triunfo progresivo del evangelio sobre la tierra (el "milenio"). ' +
        'Influyente entre los puritanos y en el Princeton del siglo XIX. Se distingue ' +
        'del amilenarismo por su optimismo histórico sobre el éxito del evangelio ' +
        'pre-parusía.',
      related: ['amilenarismo', 'premilenarismo', 'edwards'],
      courses: ['escatologia', 'historia-iglesia-moderna']
    },

    'premilenarismo': {
      term: 'Premilenarismo',
      definition:
        'Posición escatológica que afirma que Cristo volverá antes del milenio, ' +
        'inaugurando personalmente un reino terrenal literal de mil años. Se divide ' +
        'en histórico (clásico) y dispensacional (Darby, Scofield). La forma ' +
        'dispensacional, dominante en el evangelicalismo norteamericano del siglo XX, ' +
        'es criticada desde la escatología reformada.',
      related: ['amilenarismo', 'postmilenarismo'],
      courses: ['escatologia']
    },

    'estado-intermedio': {
      term: 'Estado intermedio',
      definition:
        'Condición del alma humana entre la muerte y la resurrección corporal. La ' +
        'posición reformada afirma la presencia consciente del creyente con Cristo ' +
        '(Fil 1:23; Lc 23:43) y la consciencia del incrédulo bajo juicio, rechazando ' +
        'tanto el purgatorio romano como el "sueño del alma" anabaptista.',
      related: ['resurreccion', 'glorificacion'],
      courses: ['escatologia']
    },

    'resurreccion': {
      term: 'Resurrección corporal',
      definition:
        'Doctrina de que todos los muertos, justos e injustos, resucitarán ' +
        'corporalmente en el último día (Jn 5:28–29; Hch 24:15). La resurrección de ' +
        'Cristo es primicia y garantía (1 Co 15:20–28). El cuerpo resucitado, aunque ' +
        'continuo con el actual, será glorificado: incorruptible, poderoso, espiritual ' +
        '(no inmaterial).',
      related: ['glorificacion', 'nueva-creacion', 'estado-intermedio'],
      courses: ['escatologia', 'cristologia-soteriologia']
    },

    'nueva-creacion': {
      term: 'Nueva creación',
      definition:
        'Meta final de la historia redentora: cielos nuevos y tierra nueva donde mora ' +
        'la justicia (2 Pe 3:13; Ap 21–22). No es aniquilación del cosmos actual sino su ' +
        'renovación gloriosa, liberado de la maldición y habitación eterna del pueblo ' +
        'redimido con Dios. Vos mostró cómo toda la escatología reformada converge aquí.',
      related: ['glorificacion', 'amilenarismo', 'teologia-biblica-vos', 'vos'],
      courses: ['escatologia', 'teologia-biblica']
    },


    // =========================================================================
    //  CONFESIONES Y CREDOS
    // =========================================================================

    'confesion-de-westminster': {
      term: 'Confesión de Fe de Westminster',
      definition:
        'Confesión producida por la Asamblea de Westminster (1643–1648) junto al ' +
        'Catecismo Mayor y el Catecismo Menor. Estándar doctrinal de las iglesias ' +
        'presbiterianas anglófonas, estructurada en 33 capítulos que cubren desde la ' +
        'doctrina de las Escrituras hasta la consumación. Cumbre del teologizar ' +
        'reformado de habla inglesa.',
      related: ['asamblea-de-westminster', 'catecismo-de-heidelberg', 'canones-de-dort'],
      courses: ['introduccion-teologia-reformada', 'reforma-protestante']
    },

    'catecismo-de-heidelberg': {
      term: 'Catecismo de Heidelberg',
      definition:
        'Catecismo producido en 1563 por Zacarías Ursino y Gaspar Oleviano bajo el ' +
        'auspicio del Elector Federico III del Palatinado. Estructurado en 129 ' +
        'preguntas y respuestas organizadas en miseria, redención y gratitud; el ' +
        'estándar confesional continental más cálido y pastoralmente próximo.',
      related: ['confesion-de-westminster', 'canones-de-dort'],
      courses: ['introduccion-teologia-reformada', 'etica-biblica-reformada']
    },

    'canones-de-dort': {
      term: 'Cánones de Dort',
      definition:
        'Documento conciliar producido por el Sínodo de Dort (1618–1619) como ' +
        'respuesta punto por punto a los cinco artículos de la Remonstrance arminiana. ' +
        'De aquí surge históricamente el acrónimo TULIP. Junto con Heidelberg y la ' +
        'Confesión Belga forman las "Tres Formas de Unidad" reformadas continentales.',
      related: ['sinodo-de-dort', 'tulip', 'arminianismo', 'catecismo-de-heidelberg'],
      courses: ['reforma-protestante', 'historia-iglesia-moderna']
    },

    'credo-niceno': {
      term: 'Credo Niceno-Constantinopolitano',
      definition:
        'Confesión trinitaria formulada en Nicea (325 d.C.) y ampliada en Constantinopla ' +
        '(381 d.C.). Confiesa la plena divinidad del Hijo (*homoousios* con el Padre) ' +
        'contra el arrianismo y la plena divinidad del Espíritu Santo contra los ' +
        'pneumatómacos. Credo ecuménico recibido por todas las ramas de la ortodoxia cristiana.',
      related: ['homoousios', 'trinidad', 'atanasio', 'credo-atanasiano'],
      courses: ['historia-iglesia-antigua', 'teologia-propia']
    },

    'definicion-de-calcedonia': {
      term: 'Definición de Calcedonia',
      definition:
        'Formulación cristológica producida en el Concilio de Calcedonia (451 d.C.) ' +
        'que estableció los límites de la ortodoxia: Cristo es una sola persona en dos ' +
        'naturalezas —divina y humana—, unidas sin confusión, sin cambio, sin división ' +
        'y sin separación. Base incontestada de toda cristología ortodoxa posterior.',
      related: ['calcedonia', 'hipostatica-union', 'dos-naturalezas'],
      courses: ['historia-iglesia-antigua', 'cristologia-soteriologia']
    },

    'credo-atanasiano': {
      term: 'Credo Atanasiano',
      definition:
        'Confesión trinitaria y cristológica de fines del siglo IV o principios del V, ' +
        'erróneamente atribuida a Atanasio. Articula con precisión técnica la distinción ' +
        'de las personas sin división de la esencia, y la unión de las dos naturalezas ' +
        'en Cristo. Se recita solemnemente en la liturgia occidental.',
      related: ['trinidad', 'credo-niceno', 'calcedonia'],
      courses: ['historia-iglesia-antigua', 'teologia-propia']
    },


    // =========================================================================
    //  FIGURAS HISTÓRICAS
    // =========================================================================

    'calvino': {
      term: 'Juan Calvino (1509–1564)',
      definition:
        'Reformador francés radicado en Ginebra; figura clave de la segunda generación ' +
        'de la Reforma. Autor de la *Institución de la Religión Cristiana* (1536–1559), ' +
        'comentarios a casi todos los libros de la Biblia y miles de sermones. Modeló ' +
        'la teología, la liturgia, el gobierno eclesiástico y la vida comunitaria ' +
        'reformadas. Su acento distintivo: la soberanía de Dios en todas las esferas.',
      related: ['ginebra', 'solus-christus', 'presencia-espiritual-real', 'knox', 'tres-oficios'],
      courses: ['reforma-protestante', 'introduccion-teologia-reformada']
    },

    'lutero': {
      term: 'Martín Lutero (1483–1546)',
      definition:
        'Monje agustino alemán, detonante de la Reforma con las 95 tesis (1517) y la ' +
        'Dieta de Worms (1521). Redescubrió la justificación por la fe sola en Romanos ' +
        '1:17. Tradujo la Biblia al alemán y escribió los catecismos mayor y menor. ' +
        'Diferenció fuertemente ley y evangelio; su cristología de la ubicuidad lo ' +
        'separó de los reformados en Marburgo (1529).',
      related: ['wittenberg', 'sola-fide', 'simul-iustus-et-peccator', 'servo-arbitrio', 'zwinglio'],
      courses: ['reforma-protestante', 'historia-iglesia-medieval']
    },

    'zwinglio': {
      term: 'Ulrico Zwinglio (1484–1531)',
      definition:
        'Reformador suizo de Zúrich, contemporáneo de Lutero pero de desarrollo ' +
        'independiente. Impulsó una reforma litúrgica más radical y sostuvo una ' +
        'concepción memorialista de la Cena del Señor que chocó con Lutero en ' +
        'Marburgo. Su influencia se extendió por la Segunda Confesión Helvética ' +
        '(Bullinger, 1566).',
      related: ['lutero', 'calvino', 'cena-del-senor'],
      courses: ['reforma-protestante']
    },

    'agustin-de-hipona': {
      term: 'Agustín de Hipona (354–430)',
      definition:
        'Obispo norteafricano, padre de la teología occidental. Su doctrina de la ' +
        'gracia, forjada en la controversia pelagiana, anticipa los ejes del ' +
        'calvinismo: elección soberana, gracia irresistible, perseverancia. Obras ' +
        'principales: *Confesiones*, *La Ciudad de Dios*, *De Gratia et Libero Arbitrio*.',
      related: ['sola-gratia', 'depravacion-total', 'amilenarismo', 'predestinacion'],
      courses: ['historia-iglesia-antigua']
    },

    'atanasio': {
      term: 'Atanasio de Alejandría (c. 296–373)',
      definition:
        'Obispo alejandrino, campeón de la fe nicena frente al arrianismo. Su lema no ' +
        'oficial "*Athanasius contra mundum*" refleja su persistencia durante cinco ' +
        'exilios. *De Incarnatione* es el locus clásico sobre la lógica soteriológica ' +
        'de la encarnación: sólo un Dios encarnado puede deificar al hombre caído.',
      related: ['homoousios', 'credo-niceno', 'trinidad'],
      courses: ['historia-iglesia-antigua']
    },

    'aquino': {
      term: 'Tomás de Aquino (c. 1225–1274)',
      definition:
        'Dominico italiano, el mayor sintetizador escolástico. Su *Summa Theologiae* ' +
        'articula una filosofía tomista-aristotélica del ser y una teología de la ' +
        'analogía. Recibido selectivamente por algunos reformados; rechazado como ' +
        'fundamento por presuposicionalistas como Van Til, quienes critican la ' +
        '*analogia entis*.',
      related: ['fides-quaerens-intellectum', 'presuposicionalismo', 'van-til'],
      courses: ['historia-iglesia-medieval', 'apologetica-reformada']
    },

    'knox': {
      term: 'John Knox (c. 1514–1572)',
      definition:
        'Reformador escocés, formado teológicamente junto a Calvino en Ginebra. De ' +
        'regreso a Escocia (1559) llevó la Reforma a su triunfo nacional. Redactó la ' +
        'Confesión Escocesa (1560). Figura fundadora del presbiterianismo moderno y ' +
        'de la teología política reformada sobre la resistencia a tiranos impíos.',
      related: ['presbiterianismo', 'calvino', 'ginebra'],
      courses: ['reforma-protestante']
    },

    'owen': {
      term: 'John Owen (1616–1683)',
      definition:
        'Teólogo puritano inglés, el más riguroso sistemático reformado del siglo XVII. ' +
        'Sus obras clásicas incluyen *La muerte de la muerte en la muerte de Cristo* ' +
        '(defensa de la expiación particular), *Comunión con Dios* y *La mortificación ' +
        'del pecado*. Sintetiza el rigor doctrinal con la profundidad devocional puritana.',
      related: ['expiacion-particular', 'puritanismo'],
      courses: ['historia-iglesia-moderna', 'cristologia-soteriologia']
    },

    'edwards': {
      term: 'Jonathan Edwards (1703–1758)',
      definition:
        'Pastor y teólogo congregacional norteamericano, figura central del Gran ' +
        'Despertar. Autor de *Las afecciones religiosas*, *Libertad de la voluntad*, ' +
        '*La naturaleza de la verdadera virtud* y del célebre sermón "Pecadores en ' +
        'manos de un Dios airado". Integración sin par de metafísica, soteriología ' +
        'reformada y avivamiento.',
      related: ['postmilenarismo', 'puritanismo'],
      courses: ['historia-iglesia-moderna']
    },

    'warfield': {
      term: 'Benjamin B. Warfield (1851–1921)',
      definition:
        'Teólogo presbiteriano de Princeton, defensor eminente de la inspiración e ' +
        'inerrancia bíblicas contra la crítica liberal alemana. *Inspiration and ' +
        'Authority of the Bible* es obra de referencia. Articuló con precisión técnica ' +
        'la doctrina reformada clásica de la Escritura para el contexto moderno.',
      related: ['inspiracion-verbal-plenaria', 'inerrancia', 'machen', 'liberalismo-teologico'],
      courses: ['historia-iglesia-moderna', 'bibliologia']
    },

    'machen': {
      term: 'J. Gresham Machen (1881–1937)',
      definition:
        'Sucesor intelectual de Warfield en Princeton; autor de *Christianity and ' +
        'Liberalism* (1923), donde argumenta que el liberalismo teológico no es una ' +
        'variante del cristianismo sino una religión distinta. Fundó el Seminario ' +
        'Westminster (1929) y la Iglesia Presbiteriana Ortodoxa (1936) tras su ' +
        'expulsión del presbiterianismo mainline.',
      related: ['warfield', 'inerrancia', 'liberalismo-teologico'],
      courses: ['historia-iglesia-moderna']
    },

    'vos': {
      term: 'Geerhardus Vos (1862–1949)',
      definition:
        'Teólogo neerlandés-estadounidense, catedrático en Princeton, padre fundador ' +
        'de la teología bíblica reformada como disciplina. Obras: *Biblical Theology*, ' +
        '*The Pauline Eschatology*. Mostró cómo la historia redentora culmina en ' +
        'Cristo y cómo la escatología no es mero apéndice sino estructura de toda la ' +
        'revelación bíblica.',
      related: ['teologia-biblica-vos', 'amilenarismo', 'nueva-creacion', 'tipologia'],
      courses: ['teologia-biblica', 'escatologia']
    },

    'van-til': {
      term: 'Cornelius Van Til (1895–1987)',
      definition:
        'Apologeta presbiteriano neerlandés-estadounidense, catedrático en Westminster. ' +
        'Formuló la apologética presuposicional reformada: toda mente parte de ' +
        'presuposiciones últimas, y sólo la cosmovisión cristiana provee las ' +
        'precondiciones para la inteligibilidad de la ciencia, la lógica y la ética. ' +
        'Obras: *The Defense of the Faith*, *A Christian Theory of Knowledge*.',
      related: ['presuposicionalismo', 'argumento-trascendental', 'aquino'],
      courses: ['apologetica-reformada']
    },


    // =========================================================================
    //  LUGARES Y EVENTOS
    // =========================================================================

    'ginebra': {
      term: 'Ginebra',
      definition:
        'Ciudad-estado suiza donde Calvino ejerció ministerio pastoral y pedagógico ' +
        '(1536–1538; 1541–1564). Bajo su influencia se convirtió en centro mundial del ' +
        'protestantismo reformado: modelo de gobierno eclesiástico (cuatro oficios), ' +
        'sede de la Academia (1559) y refugio de protestantes exiliados de toda Europa.',
      related: ['calvino', 'knox'],
      courses: ['reforma-protestante']
    },

    'wittenberg': {
      term: 'Wittenberg',
      definition:
        'Ciudad sajona donde Lutero enseñaba Escritura cuando clavó las 95 tesis en la ' +
        'puerta de la iglesia del castillo el 31 de octubre de 1517. Epicentro ' +
        'simbólico del inicio de la Reforma y de la consolidación de la teología ' +
        'luterana clásica (Melanchthon).',
      related: ['lutero'],
      courses: ['reforma-protestante']
    },

    'sinodo-de-dort': {
      term: 'Sínodo de Dort (1618–1619)',
      definition:
        'Asamblea internacional reformada convocada en los Países Bajos para ' +
        'responder a la Remonstrance arminiana. Con delegados de iglesias reformadas ' +
        'de toda Europa, produjo los Cánones de Dort. Su carácter ecuménico (dentro ' +
        'de la tradición reformada) le da peso catolicidad a su decisión.',
      related: ['canones-de-dort', 'arminianismo', 'tulip'],
      courses: ['reforma-protestante', 'historia-iglesia-moderna']
    },

    'asamblea-de-westminster': {
      term: 'Asamblea de Westminster (1643–1648)',
      definition:
        'Concilio reunido por el Parlamento inglés durante la Guerra Civil con ' +
        'aproximadamente 151 teólogos, para reformar la Iglesia de Inglaterra según ' +
        'la Palabra de Dios y las mejores iglesias reformadas. Produjo la Confesión ' +
        'de Fe, los Catecismos Mayor y Menor, y el Directorio de Culto.',
      related: ['confesion-de-westminster', 'presbiterianismo'],
      courses: ['reforma-protestante']
    },


    // =========================================================================
    //  APOLOGÉTICA · APOLÉGÉTICA CONTEMPORÁNEA
    // =========================================================================

    'presuposicionalismo': {
      term: 'Presuposicionalismo',
      definition:
        'Método apologético reformado desarrollado por Cornelius Van Til. Sostiene ' +
        'que toda argumentación parte de presuposiciones últimas, y que el apologeta ' +
        'cristiano no debe aceptar como neutral el terreno del incrédulo. Expone la ' +
        'incoherencia de la cosmovisión no cristiana y la inevitabilidad epistemológica ' +
        'de Dios para la racionalidad.',
      related: ['argumento-trascendental', 'van-til', 'problema-del-mal'],
      courses: ['apologetica-reformada']
    },

    'argumento-trascendental': {
      term: 'Argumento trascendental (TAG)',
      definition:
        'Estrategia argumentativa presuposicional: demuestra la verdad del teísmo ' +
        'cristiano mostrando que es la precondición necesaria de la inteligibilidad ' +
        '(lógica, ciencia, ética, lenguaje). La alternativa no es una cosmovisión ' +
        'alternativa coherente sino la imposibilidad misma de la razón.',
      related: ['presuposicionalismo', 'van-til'],
      courses: ['apologetica-reformada']
    },

    'problema-del-mal': {
      term: 'Problema del mal',
      definition:
        'Objeción filosófica clásica al teísmo: si Dios es omnipotente, omnisciente y ' +
        'bueno, ¿por qué existe el mal? La respuesta reformada articula una teodicea ' +
        'centrada en el decreto soberano, la cruz como punto de reconciliación de ' +
        'justicia y misericordia, y la distinción entre explicación filosófica y ' +
        'consuelo pastoral.',
      related: ['decretos-divinos', 'providencia', 'presuposicionalismo'],
      courses: ['apologetica-reformada']
    },

    'neo-ortodoxia': {
      term: 'Neo-ortodoxia',
      definition:
        'Movimiento teológico del siglo XX asociado principalmente a Karl Barth ' +
        '(1886–1968) y Emil Brunner. Critica el liberalismo clásico y busca recuperar ' +
        'la trascendencia divina, pero sustituye la inerrancia por una doctrina de la ' +
        'revelación como encuentro-evento. Van Til la criticó severamente en *The New ' +
        'Modernism* como retención del subjetivismo liberal con envoltura ortodoxa.',
      related: ['van-til', 'liberalismo-teologico'],
      courses: ['historia-iglesia-moderna', 'apologetica-reformada']
    },


    // =========================================================================
    //  PACTOS Y TEOLOGÍA FEDERAL
    // =========================================================================

    'teologia-federal': {
      term: 'Teología federal',
      definition:
        'Articulación reformada de la historia redentora bajo la categoría de ' +
        '*foedus* (pacto). Distingue el pacto eterno intratrinitario (*pactum ' +
        'salutis*), el pacto de obras con Adán como cabeza federal de la humanidad, ' +
        'y el pacto de gracia con Cristo como nuevo Adán. Desarrollada por los ' +
        'ortodoxos reformados del siglo XVII (Cocceius, Witsius).',
      related: ['pactum-salutis', 'pacto-de-obras', 'pacto-de-gracia', 'imputacion'],
      courses: ['teologia-del-pacto']
    },

    'pacto-abrahamico': {
      term: 'Pacto abrahámico',
      definition:
        'Alianza establecida por Dios con Abraham (Gn 12, 15, 17), con tres promesas ' +
        'centrales: tierra, descendencia y bendición universal. Su cumplimiento final ' +
        'está en Cristo, descendencia prometida (Gl 3:16), cuya obra extiende la ' +
        'bendición a todas las naciones. Los hijos del pacto reciben la señal en ' +
        'bautismo como continuidad de la circuncisión.',
      related: ['pacto-de-gracia', 'nuevo-pacto', 'bautismo', 'teologia-federal'],
      courses: ['teologia-del-pacto', 'introduccion-antiguo-testamento']
    },

    'nuevo-pacto': {
      term: 'Nuevo Pacto',
      definition:
        'Alianza anunciada en Jeremías 31:31–34 y cumplida por Cristo (Lc 22:20; ' +
        'He 8–10): ley escrita en el corazón, conocimiento directo de Dios, perdón ' +
        'definitivo de pecados. No cancela el pacto de gracia sino que lo lleva a su ' +
        'plenitud escatológica, bajo la mediación del Cristo glorificado.',
      related: ['pacto-de-gracia', 'pacto-abrahamico', 'cena-del-senor', 'teologia-federal'],
      courses: ['teologia-del-pacto', 'introduccion-nuevo-testamento']
    },


    // =========================================================================
    //  EXTRAS · VARIOS
    // =========================================================================

    'arrianismo-cristologico': {
      term: 'Arrianismo',
      definition:
        'Herejía cristológica del siglo IV asociada a Arrio de Alejandría. Negaba la ' +
        'consubstancialidad del Hijo con el Padre, sosteniendo que el Hijo era la ' +
        'primera y más excelsa criatura. Condenado definitivamente en Nicea (325). ' +
        'Sobrevive en modalidades contemporáneas (Testigos de Jehová).',
      related: ['homoousios', 'credo-niceno', 'atanasio', 'trinidad'],
      courses: ['historia-iglesia-antigua']
    },

    'puritanismo': {
      term: 'Puritanismo',
      definition:
        'Movimiento de renovación en la tradición reformada anglófona (siglos ' +
        'XVI–XVII) que buscó purificar la Iglesia de Inglaterra conforme al patrón ' +
        'bíblico más allá de los límites del compromiso isabelino. Combinó rigor ' +
        'doctrinal, intensidad experiencial y ética comunitaria. Produjo figuras ' +
        'como Owen, Baxter, Bunyan, Watson y Edwards.',
      related: ['owen', 'edwards', 'confesion-de-westminster'],
      courses: ['historia-iglesia-moderna', 'formacion-espiritual-piedad-reformada']
    },

    'liberalismo-teologico': {
      term: 'Liberalismo teológico',
      definition:
        'Tradición teológica surgida de Schleiermacher (1768–1834) que, bajo la ' +
        'presión del racionalismo ilustrado y del romanticismo, redefinió el ' +
        'cristianismo en términos de experiencia religiosa subjetiva o de ética del ' +
        'reino. Machen argumentó en 1923 que es religión distinta, no variante ' +
        'dentro del cristianismo ortodoxo.',
      related: ['machen', 'neo-ortodoxia', 'warfield'],
      courses: ['historia-iglesia-moderna']
    },

    'teologia-biblica-vos': {
      term: 'Teología bíblica',
      definition:
        'Disciplina teológica, definida por Geerhardus Vos, que estudia el proceso ' +
        'histórico-redentor de la revelación de Dios conforme se despliega ' +
        'orgánicamente en el tiempo. Complementa a la sistemática: mientras ésta ' +
        'organiza el contenido doctrinal atemporalmente, la bíblica traza su ' +
        'desarrollo progresivo por épocas.',
      related: ['vos', 'tipologia', 'historia-redentora'],
      courses: ['teologia-biblica']
    },

    'historia-redentora': {
      term: 'Historia redentora (Heilsgeschichte)',
      definition:
        'Concepto central de la teología bíblica reformada: la historia narrada por ' +
        'la Escritura no es cronología plana sino trama orgánica en la que Dios va ' +
        'desplegando progresivamente su plan de redención, desde la creación hasta ' +
        'la nueva creación, culminando en Cristo como punto focal.',
      related: ['teologia-biblica-vos', 'tipologia', 'pacto-de-gracia', 'nueva-creacion'],
      courses: ['teologia-biblica']
    },

    'concurrencia': {
      term: 'Concurrencia',
      definition:
        'Aspecto de la providencia divina: Dios coopera con toda causa segunda en ' +
        'cada uno de sus actos. Sin anular la eficacia de la causa segunda ni ' +
        'convertirla en mera apariencia, el decreto divino es simultáneamente la ' +
        'causa última de todo lo que ocurre. Preserva tanto la soberanía divina ' +
        'como la responsabilidad humana.',
      related: ['providencia', 'decretos-divinos'],
      courses: ['teologia-propia']
    },

    'apologetica': {
      term: 'Apologética',
      definition:
        'Del griego *apologia* ("defensa", 1 Pe 3:15). Disciplina teológica que ' +
        'articula la defensa racional de la fe cristiana ante objeciones y cosmovisiones ' +
        'alternativas. Combina tareas defensiva (responder objeciones), ofensiva ' +
        '(exponer inconsistencias de cosmovisiones rivales) y positiva (argumentar ' +
        'la verdad cristiana).',
      related: ['presuposicionalismo', 'argumento-trascendental', 'problema-del-mal'],
      courses: ['apologetica-reformada']
    }

  };


  // --------------------------------------------------------------------------
  //  Exposición · congelamos todo para prevenir mutaciones accidentales
  //  desde fragmentos cacheados por CourseLoader
  // --------------------------------------------------------------------------

  Object.keys(GLOSSARY).forEach(function (id) {
    const entry = GLOSSARY[id];
    if (entry.related) Object.freeze(entry.related);
    if (entry.courses) Object.freeze(entry.courses);
    Object.freeze(entry);
  });
  global.GLOSSARY = Object.freeze(GLOSSARY);

})(window);

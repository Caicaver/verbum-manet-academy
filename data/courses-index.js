/* ============================================================================
 * VERBUM MANET ACADEMY · data/courses-index.js
 *
 * Índice global de la malla curricular. Script clásico (sin type=module)
 * para exponer variables globales accesibles desde los fragmentos HTML
 * inyectados por CourseLoader y desde app.js (construcción de rutas).
 *
 * Expone dos globales:
 *
 *   · SEGMENTS        Array<SegmentMeta>    Los cuatro segmentos ordenados
 *   · COURSES_INDEX   Array<CourseMeta>     Los veinte cursos en orden canónico
 *
 * Fuente autoritativa: "Expansión Curricular Completa" del proyecto base
 * (Building SDG Academy SPA), que organiza la malla en cuatro segmentos:
 *
 *   I.   Fundamentos y Herramientas (Prolegómena) · 5 cursos
 *   II.  Historia de la Iglesia                    · 4 cursos
 *   III. Teología Sistemática                      · 6 cursos
 *   IV.  Teología Aplicada                         · 5 cursos
 *
 * Esquema de CourseMeta:
 *   {
 *     id:          string   // slug kebab-case · hash de navegación #/<id>
 *     title:       string   // título canónico del curso
 *     segment:     string   // "segment-1" | "segment-2" | "segment-3" | "segment-4"
 *     file:        string   // nombre del fragmento HTML dentro de courses/<segment>/
 *     number:      number   // ordinal dentro del plan global (1–20)
 *     description: string   // descripción académica breve para el catálogo
 *     tags:        string[] // descriptores temáticos para filtrado
 *     level:       string   // "Fundacional" | "Intermedio" | "Avanzado" | "Cima"
 *     duration:    string   // duración sugerida para autoestudio serio
 *     lessons:     number   // número aproximado de lecciones · orienta expectativa
 *     flagship:    boolean  // curso ancla del plan (Cristología y Soteriología)
 *   }
 * ========================================================================= */

(function (global) {
  'use strict';

  // --------------------------------------------------------------------------
  //  SEGMENTOS · metadata de agrupación para el catálogo
  // --------------------------------------------------------------------------

  const SEGMENTS = [
    {
      id: 'segment-1',
      number: 'I',
      title: 'Fundamentos y Herramientas',
      subtitle: 'Prolegómena',
      description:
        'El umbral del plan de estudios. Asienta el método teológico reformado, ' +
        'la hermenéutica bíblica, el panorama canónico de ambos Testamentos y la ' +
        'piedad que sustenta toda labor académica ulterior.',
      accent: 'var(--vma-gold)',
      symbol: '◆'
    },
    {
      id: 'segment-2',
      number: 'II',
      title: 'Historia de la Iglesia',
      subtitle: 'Dos mil años bajo la providencia',
      description:
        'Recorrido desde Pentecostés hasta el presente siguiendo las controversias ' +
        'trinitarias y cristológicas, el despliegue medieval, la Reforma del siglo XVI ' +
        'y el itinerario moderno del protestantismo confesional.',
      accent: 'var(--vma-gold)',
      symbol: '◇'
    },
    {
      id: 'segment-3',
      number: 'III',
      title: 'Teología Sistemática',
      subtitle: 'Locus por locus',
      description:
        'El corpus doctrinal reformado articulado por loci: Escritura, Dios, ' +
        'antropología y pecado, Cristo y salvación, Iglesia y sacramentos, ' +
        'consumación. El núcleo extenso del plan.',
      accent: 'var(--vma-gold)',
      symbol: '●'
    },
    {
      id: 'segment-4',
      number: 'IV',
      title: 'Teología Aplicada',
      subtitle: 'Ciencia, vida y misión',
      description:
        'El giro práctico: defensa racional de la fe, ética bíblica, historia ' +
        'redentora, arquitectura pactual y misión de la Iglesia. La teología que ' +
        'vuelve al mundo desde el aula.',
      accent: 'var(--vma-gold)',
      symbol: '○'
    }
  ];


  // --------------------------------------------------------------------------
  //  CURSOS · veinte entradas en orden canónico (1–20)
  // --------------------------------------------------------------------------

  const COURSES_INDEX = [

    /* ------------------------------------------------------------------------
     *  SEGMENTO I · Fundamentos y Herramientas (Prolegómena)
     * --------------------------------------------------------------------- */

    {
      id: 'introduccion-teologia-reformada',
      title: 'Introducción a la Teología Reformada',
      segment: 'segment-1',
      file: 'introduccion-teologia-reformada.html',
      number: 1,
      description:
        'Naturaleza, método e identidad histórica de la teología reformada. ' +
        'Bases epistemológicas, doxológicas y confesionales del plan completo: ' +
        'las cinco Solas, los cinco puntos del calvinismo, la función de las ' +
        'confesiones como síntesis confesional de la Escritura.',
      tags: ['Solas', 'TULIP', 'Confesiones', 'Método teológico'],
      level: 'Fundacional',
      duration: '6–8 semanas',
      lessons: 10,
      flagship: false
    },
    {
      id: 'hermeneutica-biblica',
      title: 'Hermenéutica Bíblica',
      segment: 'segment-1',
      file: 'hermeneutica-biblica.html',
      number: 2,
      description:
        'Principios y métodos para la correcta interpretación de las Escrituras, ' +
        'con énfasis en el método histórico-gramatical-canónico. Perspicuidad, ' +
        'iluminación del Espíritu, géneros literarios y tipología cristológica.',
      tags: ['Método histórico-gramatical', 'Perspicuidad', 'Géneros literarios', 'Tipología'],
      level: 'Fundacional',
      duration: '6–8 semanas',
      lessons: 11,
      flagship: false
    },
    {
      id: 'introduccion-antiguo-testamento',
      title: 'Introducción al Antiguo Testamento',
      segment: 'segment-1',
      file: 'introduccion-antiguo-testamento.html',
      number: 3,
      description:
        'Panorama canónico, histórico, literario y teológico del Antiguo Testamento ' +
        'como primera parte de la revelación progresiva de Dios, unificada en Cristo. ' +
        'Pentateuco, históricos, poesía y sabiduría, profetas mayores y menores.',
      tags: ['Pentateuco', 'Profetas', 'Salmos', 'Canon'],
      level: 'Fundacional',
      duration: '6–8 semanas',
      lessons: 10,
      flagship: false
    },
    {
      id: 'introduccion-nuevo-testamento',
      title: 'Introducción al Nuevo Testamento',
      segment: 'segment-1',
      file: 'introduccion-nuevo-testamento.html',
      number: 4,
      description:
        'Panorama canónico, histórico, literario y teológico del Nuevo Testamento ' +
        'como cumplimiento y consumación de la revelación veterotestamentaria en ' +
        'la persona y obra de Jesucristo. Evangelios, Hechos, Epístolas, Apocalipsis.',
      tags: ['Evangelios', 'Epístolas paulinas', 'Hebreos', 'Apocalipsis'],
      level: 'Fundacional',
      duration: '6–8 semanas',
      lessons: 10,
      flagship: false
    },
    {
      id: 'formacion-espiritual-piedad-reformada',
      title: 'Formación Espiritual y Piedad Reformada',
      segment: 'segment-1',
      file: 'formacion-espiritual-piedad-reformada.html',
      number: 5,
      description:
        'Examina las disciplinas espirituales, la comunión con Dios, la adoración ' +
        'y la formación del carácter a la luz de la cosmovisión reformada. Oración, ' +
        'meditación bíblica, Día del Señor, vida en la iglesia local.',
      tags: ['Disciplinas espirituales', 'Oración', 'Puritanismo', 'Medios de gracia'],
      level: 'Fundacional',
      duration: '6–8 semanas',
      lessons: 6,
      flagship: false
    },


    /* ------------------------------------------------------------------------
     *  SEGMENTO II · Historia de la Iglesia
     * --------------------------------------------------------------------- */

    {
      id: 'historia-iglesia-antigua',
      title: 'Historia de la Iglesia Antigua',
      segment: 'segment-2',
      file: 'historia-iglesia-antigua.html',
      number: 6,
      description:
        'Desde Pentecostés (30 d.C.) hasta Gregorio I (590 d.C.). Expansión de la ' +
        'iglesia primitiva, persecuciones romanas, controversias trinitarias y ' +
        'cristológicas, los concilios ecuménicos, Agustín y la doctrina de la gracia.',
      tags: ['Padres apostólicos', 'Concilios', 'Nicea', 'Agustín', 'Calcedonia'],
      level: 'Intermedio',
      duration: '6–8 semanas',
      lessons: 10,
      flagship: false
    },
    {
      id: 'historia-iglesia-medieval',
      title: 'Historia de la Iglesia Medieval',
      segment: 'segment-2',
      file: 'historia-iglesia-medieval.html',
      number: 7,
      description:
        'De Gregorio I (590) a las puertas de Wittenberg (1517). Consolidación papal, ' +
        'escolasticismo y Aquino, Cruzadas, pre-reformadores (Wycliffe, Hus), ' +
        'humanismo renacentista y las semillas intelectuales de la Reforma.',
      tags: ['Escolasticismo', 'Aquino', 'Cruzadas', 'Pre-reformadores', 'Humanismo'],
      level: 'Intermedio',
      duration: '6–8 semanas',
      lessons: 7,
      flagship: false
    },
    {
      id: 'reforma-protestante',
      title: 'La Reforma Protestante',
      segment: 'segment-2',
      file: 'reforma-protestante.html',
      number: 8,
      description:
        'El siglo de la Reforma (1517–1600): Lutero y la crisis de la justificación, ' +
        'Zwinglio en Zúrich, Calvino en Ginebra y la Institución, Knox y Escocia, ' +
        'el Sínodo de Dort, la Asamblea de Westminster, la contrarreforma tridentina.',
      tags: ['Lutero', 'Calvino', 'Zwinglio', 'Dort', 'Westminster'],
      level: 'Intermedio',
      duration: '6–8 semanas',
      lessons: 10,
      flagship: true
    },
    {
      id: 'historia-iglesia-moderna',
      title: 'Historia de la Iglesia Moderna',
      segment: 'segment-2',
      file: 'historia-iglesia-moderna.html',
      number: 9,
      description:
        'De 1600 al presente: puritanismo inglés, pietismo continental, los ' +
        'Avivamientos, la crisis del liberalismo teológico, la respuesta de ' +
        'Princeton (Hodge, Warfield, Machen), neo-ortodoxia, el siglo XX y los ' +
        'movimientos contemporáneos del calvinismo reformado.',
      tags: ['Puritanismo', 'Avivamientos', 'Liberalismo', 'Princeton', 'Siglo XX'],
      level: 'Intermedio',
      duration: '6–8 semanas',
      lessons: 9,
      flagship: false
    },


    /* ------------------------------------------------------------------------
     *  SEGMENTO III · Teología Sistemática
     * --------------------------------------------------------------------- */

    {
      id: 'bibliologia',
      title: 'Bibliología · Doctrina de la Escritura',
      segment: 'segment-3',
      file: 'bibliologia.html',
      number: 10,
      description:
        'Estudio exhaustivo de la naturaleza, origen, autoridad y propiedades de la ' +
        'Sagrada Escritura como Palabra de Dios escrita. Revelación general y ' +
        'especial, inspiración verbal plenaria, inerrancia, canon y suficiencia.',
      tags: ['Inspiración', 'Inerrancia', 'Canon', 'Sola Scriptura', 'Revelación'],
      level: 'Avanzado',
      duration: '8–10 semanas',
      lessons: 4,
      flagship: false
    },
    {
      id: 'teologia-propia',
      title: 'Teología Propia · Doctrina de Dios',
      segment: 'segment-3',
      file: 'teologia-propia.html',
      number: 11,
      description:
        'Los nombres divinos, los atributos comunicables e incomunicables, el ' +
        'misterio de la Trinidad (generación eterna, procesión, Credo Atanasiano), ' +
        'los decretos divinos, predestinación y el debate supra/infralapsario.',
      tags: ['Trinidad', 'Atributos divinos', 'Decretos', 'Predestinación', 'Aseidad'],
      level: 'Avanzado',
      duration: '8–10 semanas',
      lessons: 4,
      flagship: false
    },
    {
      id: 'antropologia-hamartologia',
      title: 'Antropología, Pacto de Obras y Hamartología',
      segment: 'segment-3',
      file: 'antropologia-hamartologia.html',
      number: 12,
      description:
        'El ser humano como Imago Dei, el Pacto de Obras como clave federal, la ' +
        'Caída y el pecado original, depravación total y esclavitud de la voluntad ' +
        '(Erasmo–Lutero, De Servo Arbitrio). Los cuatro estados del hombre.',
      tags: ['Imago Dei', 'Pacto de Obras', 'Depravación', 'Teología federal'],
      level: 'Avanzado',
      duration: '8–10 semanas',
      lessons: 4,
      flagship: false
    },
    {
      id: 'cristologia-soteriologia',
      title: 'Cristología y Soteriología',
      segment: 'segment-3',
      file: 'cristologia-soteriologia.html',
      number: 13,
      description:
        'El curso ancla del plan. La persona de Cristo (Calcedonia, dos naturalezas), ' +
        'los estados de humillación y exaltación, los tres oficios, la obra expiatoria ' +
        '(satisfacción, propiciación, redención), expiación particular, y el ordo salutis ' +
        'completo: elección, llamado, fe, justificación, adopción, santificación, glorificación.',
      tags: ['Calcedonia', 'Expiación', 'Justificación', 'Ordo salutis', 'Pacto de Gracia'],
      level: 'Cima',
      duration: '10–12 semanas',
      lessons: 10,
      flagship: true
    },
    {
      id: 'eclesiologia-sacramentologia',
      title: 'Eclesiología y Sacramentología',
      segment: 'segment-3',
      file: 'eclesiologia-sacramentologia.html',
      number: 14,
      description:
        'La naturaleza de la Iglesia (visible e invisible), las tres marcas reformadas, ' +
        'el gobierno presbiteriano, la disciplina eclesiástica; los dos sacramentos del ' +
        'Nuevo Pacto: bautismo (paedo vs. credo) y Cena del Señor (las cuatro posiciones).',
      tags: ['Marcas de la iglesia', 'Presbiterianismo', 'Bautismo', 'Cena del Señor'],
      level: 'Avanzado',
      duration: '8–10 semanas',
      lessons: 6,
      flagship: false
    },
    {
      id: 'escatologia',
      title: 'Escatología',
      segment: 'segment-3',
      file: 'escatologia.html',
      number: 15,
      description:
        'La doctrina de las últimas cosas: muerte y estado intermedio, resurrección ' +
        'corporal, retorno de Cristo, juicio final, cielo e infierno; las cuatro posiciones ' +
        'milenarias y la defensa del amilenarismo reformado. La Nueva Creación consumada.',
      tags: ['Estado intermedio', 'Resurrección', 'Milenio', 'Amilenarismo', 'Nueva creación'],
      level: 'Avanzado',
      duration: '8–10 semanas',
      lessons: 4,
      flagship: false
    },


    /* ------------------------------------------------------------------------
     *  SEGMENTO IV · Teología Aplicada
     * --------------------------------------------------------------------- */

    {
      id: 'apologetica-reformada',
      title: 'Apologética Reformada',
      segment: 'segment-4',
      file: 'apologetica-reformada.html',
      number: 16,
      description:
        'La defensa racional de la fe desde la presuposición de la revelación divina. ' +
        'Método presuposicional de Cornelius Van Til, el argumento trascendental, ' +
        'el problema del mal, respuesta al nuevo ateísmo, al relativismo y al Islam.',
      tags: ['Presuposicionalismo', 'Van Til', 'Problema del mal', 'Cosmovisiones'],
      level: 'Avanzado',
      duration: '4–6 semanas',
      lessons: 8,
      flagship: false
    },
    {
      id: 'etica-biblica-reformada',
      title: 'Ética Bíblica Reformada',
      segment: 'segment-4',
      file: 'etica-biblica-reformada.html',
      number: 17,
      description:
        'La ley y el evangelio en la ética reformada, el triple uso de la ley, los Diez ' +
        'Mandamientos como estructura ética (Heidelberg), casos éticos contemporáneos: ' +
        'bioética, sexualidad, matrimonio, trabajo como vocación (Beruf).',
      tags: ['Triple uso de la ley', 'Decálogo', 'Bioética', 'Vocación', 'Matrimonio'],
      level: 'Avanzado',
      duration: '4–6 semanas',
      lessons: 3,
      flagship: false
    },
    {
      id: 'teologia-biblica',
      title: 'Teología Bíblica',
      segment: 'segment-4',
      file: 'teologia-biblica.html',
      number: 18,
      description:
        'La historia progresiva de la redención desde la creación hasta la nueva creación, ' +
        'siguiendo el método histórico-redentor de Geerhardus Vos. Unidad de los Testamentos ' +
        'a través de la tipología cristológica y la promesa cumplida.',
      tags: ['Vos', 'Historia redentora', 'Tipología', 'Unidad bíblica'],
      level: 'Avanzado',
      duration: '4–6 semanas',
      lessons: 3,
      flagship: false
    },
    {
      id: 'teologia-del-pacto',
      title: 'Teología del Pacto',
      segment: 'segment-4',
      file: 'teologia-del-pacto.html',
      number: 19,
      description:
        'La arquitectura pactual de la historia redentora: Pacto de Redención intratrinitario, ' +
        'Pacto Noético, Abrahámico, Mosaico, Davídico y Nuevo Pacto. Continuidad y ' +
        'discontinuidad entre los Testamentos desde la teología federal reformada.',
      tags: ['Pactum salutis', 'Pacto Abrahámico', 'Nuevo Pacto', 'Teología federal'],
      level: 'Avanzado',
      duration: '4–6 semanas',
      lessons: 3,
      flagship: false
    },
    {
      id: 'misiones-evangelismo-local',
      title: 'Misiones y Evangelismo Local',
      segment: 'segment-4',
      file: 'misiones-evangelismo-local.html',
      number: 20,
      description:
        'La Missio Dei y la misión como propósito de Dios (Gn 12 → Ap 7). La compatibilidad ' +
        'de la soberanía divina con el celo evangelístico, la iglesia local como columna y ' +
        'fundamento de la verdad, contextualización sin sincretismo en el contexto latinoamericano.',
      tags: ['Missio Dei', 'Evangelismo', 'Iglesia local', 'Contextualización'],
      level: 'Avanzado',
      duration: '4–6 semanas',
      lessons: 4,
      flagship: false
    }
  ];


  // --------------------------------------------------------------------------
  //  Exposición de variables globales
  //
  //  Ambas se exponen al scope global para que los fragmentos HTML inyectados
  //  por CourseLoader puedan consumirlas sin importaciones adicionales.
  //  Congelamos los objetos para prevenir mutaciones accidentales desde los
  //  fragmentos (cacheados en memoria — una mutación persistiría entre vistas).
  // --------------------------------------------------------------------------

  global.SEGMENTS      = Object.freeze(SEGMENTS.map(function (s) { return Object.freeze(s); }));
  global.COURSES_INDEX = Object.freeze(COURSES_INDEX.map(function (c) {
    // Congelamos también los tags internos
    if (c.tags) Object.freeze(c.tags);
    return Object.freeze(c);
  }));

})(window);

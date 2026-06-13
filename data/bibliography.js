/* ============================================================================
   VERBUM MANET ACADEMY · data/bibliography.js
   ----------------------------------------------------------------------------
   CONT-004a · Bibliografía interactiva con preview (siembra inicial).

   Expone DOS globales congeladas (script CLÁSICO, sin type="module", para que
   los fragmentos y app.js las lean directamente — cf. ARCHITECTURE §5.1 e
   invariante INV-07):

     · window.BIBLIOGRAPHY        → { id: registro }   (esquema STYLE-GUIDE §13.1)
     · window.BIBLIOGRAPHY_MATCH  → [ descriptor, ... ] (auto-enlace runtime)

   ESQUEMA DE REGISTRO (STYLE-GUIDE §13.1) — campos no conocidos van en null,
   NUNCA fabricados. La verificación sistemática de isbn/editorial/edición y de
   `url` (lista blanca §13.3) por curso corresponde a CONT-004b.

   POLÍTICA DE ENLACES (§13.3): `url` solo apunta a es.ligonier.org, ccel.org,
   monergism.com, tgcespanol.org, chapellibrary.org o reformed.org. Si no hay
   enlace legítimo verificado, `url: null`. Jamás YouTube/Wikipedia/blogs.

   ----------------------------------------------------------------------------
   AUTO-ENLACE (Binding C) — sin tocar fragmentos:
   app.js · enhanceBibliographyRefs() recorre `.lesson__source-list li` y enlaza
   por FIRMA, no por id embebido. Cada descriptor de BIBLIOGRAPHY_MATCH declara:
     · id      → entrada de BIBLIOGRAPHY a la que apunta.
     · titles  → frases de título (YA normalizadas: minúsculas, sin tildes) que,
                 halladas en el texto, se envuelven en <... data-bib="id">.
     · guards  → AND-de-ORs de tokens (normalizados) que DEBEN estar presentes en
                 el texto completo del <li> para que el match cuente. Resuelven
                 homónimos: John Owen ≠ Owen Chadwick; Charles Hodge ≠ A. A.
                 Hodge; John Murray ≠ Iain H. Murray; Bavinck "Reformed Dogmatics"
                 ≠ Muller "Post-Reformation Reformed Dogmatics".
   Contrato de normalización (idéntico en app.js):
     norm(s) = lower → NFD → quita diacríticos → colapsa espacios → trim.
   ============================================================================ */

'use strict';

/* ---------------------------------------------------------------------------
   §1 · Registros bibliográficos (STYLE-GUIDE §13.1)
   --------------------------------------------------------------------------- */
const BIBLIOGRAPHY = Object.freeze({

  /* —— Confesiones, catecismos y credos (jerarquía §13.2, nivel 2) —— */

  'confesion-westminster': {
    id: 'confesion-westminster', type: 'confession',
    author: 'Asamblea de Westminster', year: 1646,
    title: 'Confesión de Fe de Westminster',
    originalTitle: 'The Westminster Confession of Faith', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['confesionalismo', 'dogmática-reformada'],
  },
  'catecismo-mayor-westminster': {
    id: 'catecismo-mayor-westminster', type: 'confession',
    author: 'Asamblea de Westminster', year: 1647,
    title: 'Catecismo Mayor de Westminster',
    originalTitle: 'The Westminster Larger Catechism', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['confesionalismo', 'catequesis'],
  },
  'catecismo-menor-westminster': {
    id: 'catecismo-menor-westminster', type: 'confession',
    author: 'Asamblea de Westminster', year: 1647,
    title: 'Catecismo Menor de Westminster',
    originalTitle: 'The Westminster Shorter Catechism', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['confesionalismo', 'catequesis'],
  },
  'catecismo-heidelberg': {
    id: 'catecismo-heidelberg', type: 'confession',
    author: 'Zacarías Ursino y Gaspar Oleviano', year: 1563,
    title: 'Catecismo de Heidelberg',
    originalTitle: 'Heidelberger Katechismus', originalLanguage: 'de',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['confesionalismo', 'catequesis'],
  },
  'confesion-belga': {
    id: 'confesion-belga', type: 'confession',
    author: 'Guido de Brès', year: 1561,
    title: 'Confesión Belga',
    originalTitle: 'Confessio Belgica', originalLanguage: 'fr',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['confesionalismo', 'dogmática-reformada'],
  },
  'canones-dort': {
    id: 'canones-dort', type: 'confession',
    author: 'Sínodo de Dort', year: 1619,
    title: 'Cánones de Dort',
    originalTitle: 'Canones Synodi Dordrechtanae', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['confesionalismo', 'soteriología', 'arminianismo'],
  },
  'confesion-1689': {
    id: 'confesion-1689', type: 'confession',
    author: 'Asamblea Bautista de Londres', year: 1689,
    title: 'Confesión Bautista de Fe de 1689 (de Londres)',
    originalTitle: 'Second London Baptist Confession of Faith', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['confesionalismo', 'bautismo', 'dogmática-reformada'],
  },
  'confesion-helvetica-2': {
    id: 'confesion-helvetica-2', type: 'confession',
    author: 'Heinrich Bullinger', year: 1566,
    title: 'Segunda Confesión Helvética',
    originalTitle: 'Confessio Helvetica Posterior', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['confesionalismo', 'dogmática-reformada'],
  },
  'credo-niceno': {
    id: 'credo-niceno', type: 'creed',
    author: 'Concilios de Nicea (325) y Constantinopla (381)', year: 381,
    title: 'Credo Niceno-Constantinopolitano',
    originalTitle: 'Symbolum Nicaeno-Constantinopolitanum', originalLanguage: 'gr',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['trinidad', 'cristología', 'patrística'],
  },

  /* —— Reformadores del s. XVI (§13.2 nivel 3) —— */

  'calvino-institucion': {
    id: 'calvino-institucion', type: 'book',
    author: 'Calvino, Juan', year: 1559,
    title: 'Institución de la Religión Cristiana',
    originalTitle: 'Institutio Christianae Religionis', originalLanguage: 'la',
    publisher: 'Fundación Editorial de Literatura Reformada (FELiRe)',
    translator: 'Cipriano de Valera (rev. Luis de Usoz y Río)',
    city: 'Rijswijk', editionYear: 1986, isbn: '978-84-86790-08-9',
    url: 'https://www.monergism.com/institutes-christian-religion-ebook',
    language: 'es', level: 'avanzado',
    topics: ['dogmática-reformada', 'soteriología', 'eclesiología'],
  },
  'lutero-esclavitud-voluntad': {
    id: 'lutero-esclavitud-voluntad', type: 'book',
    author: 'Lutero, Martín', year: 1525,
    title: 'La esclavitud de la voluntad',
    originalTitle: 'De Servo Arbitrio', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['soteriología', 'antropología', 'gracia'],
  },

  /* —— Puritanos y ortodoxos reformados del s. XVII (§13.2 nivel 4) —— */

  'owen-muerte-de-la-muerte': {
    id: 'owen-muerte-de-la-muerte', type: 'book',
    author: 'Owen, John', year: 1647,
    title: 'La muerte de la muerte en la muerte de Cristo',
    originalTitle: 'The Death of Death in the Death of Christ', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['soteriología', 'expiación'],
  },
  'owen-comunion-con-dios': {
    id: 'owen-comunion-con-dios', type: 'book',
    author: 'Owen, John', year: 1657,
    title: 'Comunión con Dios',
    originalTitle: 'Communion with God', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['piedad', 'trinidad', 'vida-cristiana'],
  },
  'owen-gloria-de-cristo': {
    id: 'owen-gloria-de-cristo', type: 'book',
    author: 'Owen, John', year: 1684,
    title: 'La gloria de Cristo',
    originalTitle: 'The Glory of Christ', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['cristología', 'piedad'],
  },
  'owen-mortificacion-pecado': {
    id: 'owen-mortificacion-pecado', type: 'book',
    author: 'Owen, John', year: 1656,
    title: 'La mortificación del pecado',
    originalTitle: 'The Mortification of Sin in Believers', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['santificación', 'vida-cristiana'],
  },
  'baxter-pastor-reformado': {
    id: 'baxter-pastor-reformado', type: 'book',
    author: 'Baxter, Richard', year: 1656,
    title: 'El pastor reformado',
    originalTitle: 'The Reformed Pastor', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['pastoral', 'eclesiología'],
  },
  'baxter-reposo-eterno': {
    id: 'baxter-reposo-eterno', type: 'book',
    author: 'Baxter, Richard', year: 1650,
    title: 'El reposo eterno de los santos',
    originalTitle: "The Saints' Everlasting Rest", originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['piedad', 'escatología', 'meditación'],
  },
  'bunyan-progreso-peregrino': {
    id: 'bunyan-progreso-peregrino', type: 'book',
    author: 'Bunyan, John', year: 1678,
    title: 'El Progreso del Peregrino',
    originalTitle: "The Pilgrim's Progress", originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['vida-cristiana', 'piedad', 'alegoría'],
  },
  'turretin-institutio': {
    id: 'turretin-institutio', type: 'book',
    author: 'Turretin, Francisco', year: 1679,
    title: 'Institución de teología elénctica',
    originalTitle: 'Institutio theologiae elencticae', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['dogmática-reformada', 'escolástica-reformada'],
  },
  'witsius-economia-pactos': {
    id: 'witsius-economia-pactos', type: 'book',
    author: 'Witsius, Herman', year: 1677,
    title: 'La economía de los pactos entre Dios y el hombre',
    originalTitle: 'De oeconomia foederum Dei cum hominibus', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['teología-del-pacto', 'soteriología'],
  },

  /* —— Reformados modernos (§13.2 nivel 5) —— */

  'agustin-confesiones': {
    id: 'agustin-confesiones', type: 'book',
    author: 'Agustín de Hipona', year: 397,
    title: 'Confesiones',
    originalTitle: 'Confessiones', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['patrística', 'piedad', 'gracia'],
  },
  'agustin-ciudad-de-dios': {
    id: 'agustin-ciudad-de-dios', type: 'book',
    author: 'Agustín de Hipona', year: 426,
    title: 'La ciudad de Dios',
    originalTitle: 'De Civitate Dei', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['patrística', 'historia-redentora', 'apologética'],
  },
  'agustin-de-doctrina-christiana': {
    id: 'agustin-de-doctrina-christiana', type: 'book',
    author: 'Agustín de Hipona', year: 426,
    title: 'De Doctrina Christiana',
    originalTitle: 'De Doctrina Christiana', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['patrística', 'hermenéutica'],
  },
  'berkhof-introduccion-sistematica': {
    id: 'berkhof-introduccion-sistematica', type: 'book',
    author: 'Berkhof, Louis', year: 1932,
    title: 'Introducción a la teología sistemática',
    originalTitle: 'Introductory Volume to Systematic Theology', originalLanguage: 'en',
    publisher: 'TELL / Libros Desafío', translator: null, city: null,
    editionYear: null, isbn: null, url: null, language: 'es', level: 'intermedio',
    topics: ['prolegómena', 'dogmática-reformada'],
  },
  'berkhof-principios-interpretacion': {
    id: 'berkhof-principios-interpretacion', type: 'book',
    author: 'Berkhof, Louis', year: 1950,
    title: 'Principios de interpretación bíblica',
    originalTitle: 'Principles of Biblical Interpretation', originalLanguage: 'en',
    publisher: 'CLIE', translator: null, city: null,
    editionYear: null, isbn: null, url: null, language: 'es', level: 'intermedio',
    topics: ['hermenéutica'],
  },
  'berkhof-systematic-theology': {
    id: 'berkhof-systematic-theology', type: 'book',
    author: 'Berkhof, Louis', year: 1938,
    title: 'Teología sistemática',
    originalTitle: 'Systematic Theology', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['dogmática-reformada'],
  },
  'hodge-systematic-theology': {
    id: 'hodge-systematic-theology', type: 'book',
    author: 'Hodge, Charles', year: 1872,
    title: 'Teología sistemática',
    originalTitle: 'Systematic Theology', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['dogmática-reformada', 'princeton'],
  },
  'warfield-inspiracion-autoridad': {
    id: 'warfield-inspiracion-autoridad', type: 'book',
    author: 'Warfield, Benjamin B.', year: 1948,
    title: 'La inspiración y autoridad de la Biblia',
    originalTitle: 'The Inspiration and Authority of the Bible', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['bibliología', 'inerrancia', 'princeton'],
  },
  'bavinck-reformed-dogmatics': {
    id: 'bavinck-reformed-dogmatics', type: 'book',
    author: 'Bavinck, Herman', year: 1906,
    title: 'Dogmática Reformada',
    originalTitle: 'Gereformeerde Dogmatiek', originalLanguage: 'nl',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['dogmática-reformada', 'prolegómena'],
  },
  'vos-biblical-theology': {
    id: 'vos-biblical-theology', type: 'book',
    author: 'Vos, Geerhardus', year: 1948,
    title: 'Teología bíblica',
    originalTitle: 'Biblical Theology: Old and New Testaments', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['teología-bíblica', 'historia-redentora'],
  },
  'murray-redencion-consumada': {
    id: 'murray-redencion-consumada', type: 'book',
    author: 'Murray, John', year: 1955,
    title: 'La redención consumada y aplicada',
    originalTitle: 'Redemption Accomplished and Applied', originalLanguage: 'en',
    publisher: 'TELL', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['soteriología', 'ordo-salutis', 'expiación'],
  },

  /* ===================================================================
     CONT-004b · LOTE NÚCLEO (obras de mayor frecuencia en el corpus).
     editorial = la citada por el fragmento (dato autorado del corpus).
     isbn/editionYear sólo cuando verificado por web_search (si no, null).
     url = null salvo verificación en lista blanca §13.3.
     =================================================================== */

  /* —— Historia de la Iglesia —— */
  'gonzalez-historia-cristianismo': {
    id: 'gonzalez-historia-cristianismo', type: 'book',
    author: 'González, Justo L.', year: 1994,
    title: 'Historia del cristianismo',
    originalTitle: null, originalLanguage: 'es',
    publisher: 'Editorial Unilit', translator: null, city: 'Miami',
    editionYear: 2010, isbn: '978-1-56063-476-8',
    url: null, language: 'es', level: 'intermedio',
    topics: ['historia-de-la-iglesia', 'patrística', 'reforma'],
  },
  'gonzalez-historia-pensamiento': {
    id: 'gonzalez-historia-pensamiento', type: 'book',
    author: 'González, Justo L.', year: 1992,
    title: 'Historia del pensamiento cristiano',
    originalTitle: 'A History of Christian Thought', originalLanguage: 'en',
    publisher: 'CLIE', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['historia-de-la-iglesia', 'teología-histórica', 'patrística'],
  },

  /* —— Teología bíblica / del pacto / AT-NT —— */
  'robertson-cristo-de-los-pactos': {
    id: 'robertson-cristo-de-los-pactos', type: 'book',
    author: 'Robertson, O. Palmer', year: 1980,
    title: 'Cristo de los pactos',
    originalTitle: 'The Christ of the Covenants', originalLanguage: 'en',
    publisher: 'Libros Desafío', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['teología-del-pacto', 'teología-bíblica'],
  },
  'robertson-christ-of-prophets': {
    id: 'robertson-christ-of-prophets', type: 'book',
    author: 'Robertson, O. Palmer', year: 2004,
    title: 'The Christ of the Prophets',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['teología-bíblica', 'profetas', 'cristología'],
  },
  'clowney-unfolding-mystery': {
    id: 'clowney-unfolding-mystery', type: 'book',
    author: 'Clowney, Edmund P.', year: 1988,
    title: 'The Unfolding Mystery: Discovering Christ in the Old Testament',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['teología-bíblica', 'tipología', 'cristología'],
  },
  'fee-stuart-lectura-eficaz': {
    id: 'fee-stuart-lectura-eficaz', type: 'book',
    author: 'Fee, Gordon D. y Stuart, Douglas', year: 1981,
    title: 'La lectura eficaz de la Biblia',
    originalTitle: 'How to Read the Bible for All Its Worth', originalLanguage: 'en',
    publisher: 'Editorial Vida', translator: null, city: null,
    editionYear: 2007, isbn: '978-0-8297-4865-9',
    url: null, language: 'es', level: 'fundacional',
    topics: ['hermenéutica', 'estudio-bíblico'],
  },
  'dillard-longman-intro-at': {
    id: 'dillard-longman-intro-at', type: 'book',
    author: 'Dillard, Raymond B. y Longman III, Tremper', year: 1994,
    title: 'Introducción al Antiguo Testamento',
    originalTitle: 'An Introduction to the Old Testament', originalLanguage: 'en',
    publisher: 'CLIE', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['antiguo-testamento', 'introducción-bíblica'],
  },
  'carson-moo-intro-nt': {
    id: 'carson-moo-intro-nt', type: 'book',
    author: 'Carson, D. A. y Moo, Douglas J.', year: 2005,
    title: 'Una introducción al Nuevo Testamento',
    originalTitle: 'An Introduction to the New Testament', originalLanguage: 'en',
    publisher: 'Editorial Vida', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['nuevo-testamento', 'introducción-bíblica'],
  },
  'duvall-hays-hermeneutica': {
    id: 'duvall-hays-hermeneutica', type: 'book',
    author: 'Duvall, J. Scott y Hays, J. Daniel', year: 2005,
    title: 'Hermenéutica: entendiendo la Palabra de Dios',
    originalTitle: 'Grasping God\u2019s Word', originalLanguage: 'en',
    publisher: 'Editorial Vida', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['hermenéutica', 'estudio-bíblico'],
  },
  'beale-nt-biblical-theology': {
    id: 'beale-nt-biblical-theology', type: 'book',
    author: 'Beale, G. K.', year: 2011,
    title: 'A New Testament Biblical Theology',
    originalTitle: 'A New Testament Biblical Theology: The Unfolding of the Old Testament in the New',
    originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['teología-bíblica', 'uso-del-at-en-el-nt'],
  },

  /* —— Cristología / soteriología / vida cristiana —— */
  'ferguson-whole-christ': {
    id: 'ferguson-whole-christ', type: 'book',
    author: 'Ferguson, Sinclair B.', year: 2016,
    title: 'The Whole Christ',
    originalTitle: 'The Whole Christ: Legalism, Antinomianism, and Gospel Assurance',
    originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['soteriología', 'gracia', 'vida-cristiana'],
  },
  'macleod-person-of-christ': {
    id: 'macleod-person-of-christ', type: 'book',
    author: 'Macleod, Donald', year: 1998,
    title: 'The Person of Christ',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['cristología'],
  },
  'letham-work-of-christ': {
    id: 'letham-work-of-christ', type: 'book',
    author: 'Letham, Robert', year: 1993,
    title: 'The Work of Christ',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['cristología', 'expiación', 'munus-triplex'],
  },
  'gaffin-resurrection-redemption': {
    id: 'gaffin-resurrection-redemption', type: 'book',
    author: 'Gaffin Jr., Richard B.', year: 1978,
    title: 'Resurrection and Redemption: A Study in Paul\u2019s Soteriology',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['soteriología', 'escatología', 'teología-bíblica'],
  },
  'sproul-faith-alone': {
    id: 'sproul-faith-alone', type: 'book',
    author: 'Sproul, R. C.', year: 1995,
    title: 'Faith Alone: The Evangelical Doctrine of Justification',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['justificación', 'soteriología', 'sola-fide'],
  },
  'lutero-comentario-galatas': {
    id: 'lutero-comentario-galatas', type: 'book',
    author: 'Lutero, Martín', year: 1535,
    title: 'Comentario a la Epístola a los Gálatas',
    originalTitle: 'In epistolam S. Pauli ad Galatas commentarius', originalLanguage: 'la',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['justificación', 'sola-fide', 'gálatas'],
  },

  /* —— Doctrina de Dios / antropología —— */
  'sproul-santidad-de-dios': {
    id: 'sproul-santidad-de-dios', type: 'book',
    author: 'Sproul, R. C.', year: 1985,
    title: 'La santidad de Dios',
    originalTitle: 'The Holiness of God', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['teología-propia', 'atributos-de-dios'],
  },
  'sproul-escogidos-por-dios': {
    id: 'sproul-escogidos-por-dios', type: 'book',
    author: 'Sproul, R. C.', year: 1986,
    title: 'Escogidos por Dios',
    originalTitle: 'Chosen by God', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['elección', 'predestinación', 'soteriología'],
  },
  'packer-conocimiento-dios-santo': {
    id: 'packer-conocimiento-dios-santo', type: 'book',
    author: 'Packer, J. I.', year: 1973,
    title: 'El conocimiento del Dios santo',
    originalTitle: 'Knowing God', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['teología-propia', 'piedad', 'vida-cristiana'],
  },
  'boston-fourfold-state': {
    id: 'boston-fourfold-state', type: 'book',
    author: 'Boston, Thomas', year: 1720,
    title: 'Human Nature in Its Fourfold State',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['antropología', 'hamartología', 'puritanismo'],
  },
  'edwards-freedom-of-will': {
    id: 'edwards-freedom-of-will', type: 'book',
    author: 'Edwards, Jonathan', year: 1754,
    title: 'La libertad de la voluntad',
    originalTitle: 'Freedom of the Will', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['antropología', 'voluntad', 'soteriología'],
  },
  'kuyper-lectures-calvinism': {
    id: 'kuyper-lectures-calvinism', type: 'book',
    author: 'Kuyper, Abraham', year: 1898,
    title: 'Lectures on Calvinism',
    originalTitle: 'Lectures on Calvinism (Stone Lectures)', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['cosmovisión', 'calvinismo', 'cultura'],
  },

  /* —— Hermenéutica / bibliología / prolegómena —— */
  'sproul-conocer-escritura': {
    id: 'sproul-conocer-escritura', type: 'book',
    author: 'Sproul, R. C.', year: 1977,
    title: 'Cómo estudiar e interpretar la Biblia',
    originalTitle: 'Knowing Scripture', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['hermenéutica', 'bibliología'],
  },
  'plummer-40-preguntas': {
    id: 'plummer-40-preguntas', type: 'book',
    author: 'Plummer, Robert L.', year: 2010,
    title: '40 preguntas sobre la interpretación de la Biblia',
    originalTitle: '40 Questions About Interpreting the Bible', originalLanguage: 'en',
    publisher: 'Portavoz', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['hermenéutica', 'estudio-bíblico'],
  },
  'frame-knowledge-of-god': {
    id: 'frame-knowledge-of-god', type: 'book',
    author: 'Frame, John M.', year: 1987,
    title: 'The Doctrine of the Knowledge of God',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['prolegómena', 'epistemología', 'triperspectivalismo'],
  },
  'frame-doctrine-christian-life': {
    id: 'frame-doctrine-christian-life', type: 'book',
    author: 'Frame, John M.', year: 2008,
    title: 'The Doctrine of the Christian Life',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['ética', 'vida-cristiana'],
  },
  'reeves-ardiente-conviccion': {
    id: 'reeves-ardiente-conviccion', type: 'book',
    author: 'Reeves, Michael', year: 2009,
    title: 'Ardiente convicción',
    originalTitle: 'The Unquenchable Flame', originalLanguage: 'en',
    publisher: 'Poiema', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'fundacional',
    topics: ['reforma', 'historia-de-la-iglesia'],
  },
  'george-teologia-reformadores': {
    id: 'george-teologia-reformadores', type: 'book',
    author: 'George, Timothy', year: 1988,
    title: 'La teología de los reformadores',
    originalTitle: 'Theology of the Reformers', originalLanguage: 'en',
    publisher: 'Casa Bautista de Publicaciones', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['reforma', 'teología-histórica'],
  },

  /* —— Eclesiología —— */
  'clowney-the-church': {
    id: 'clowney-the-church', type: 'book',
    author: 'Clowney, Edmund P.', year: 1995,
    title: 'The Church',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['eclesiología'],
  },
  'dever-nine-marks': {
    id: 'dever-nine-marks', type: 'book',
    author: 'Dever, Mark', year: 2000,
    title: 'Una iglesia saludable: nueve características',
    originalTitle: 'Nine Marks of a Healthy Church', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['eclesiología', 'pastoral'],
  },

  /* —— Apologética —— */
  'vantil-defense-of-faith': {
    id: 'vantil-defense-of-faith', type: 'book',
    author: 'Van Til, Cornelius', year: 1955,
    title: 'The Defense of the Faith',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['apologética', 'presuposicionalismo'],
  },
  'oliphint-covenantal-apologetics': {
    id: 'oliphint-covenantal-apologetics', type: 'book',
    author: 'Oliphint, K. Scott', year: 2013,
    title: 'Covenantal Apologetics',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['apologética', 'presuposicionalismo'],
  },

  /* —— Escatología —— */
  'hoekema-biblia-y-futuro': {
    id: 'hoekema-biblia-y-futuro', type: 'book',
    author: 'Hoekema, Anthony A.', year: 1979,
    title: 'La Biblia y el futuro',
    originalTitle: 'The Bible and the Future', originalLanguage: 'en',
    publisher: 'Libros Desafío', translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['escatología', 'amilenarismo'],
  },
  'vos-pauline-eschatology': {
    id: 'vos-pauline-eschatology', type: 'book',
    author: 'Vos, Geerhardus', year: 1930,
    title: 'The Pauline Eschatology',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['escatología', 'teología-bíblica', 'paulinismo'],
  },
  'venema-promise-future': {
    id: 'venema-promise-future', type: 'book',
    author: 'Venema, Cornelis P.', year: 2000,
    title: 'The Promise of the Future',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['escatología', 'amilenarismo'],
  },
  'storms-kingdom-come': {
    id: 'storms-kingdom-come', type: 'book',
    author: 'Storms, Sam', year: 2013,
    title: 'Kingdom Come: The Amillennial Alternative',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['escatología', 'amilenarismo'],
  },
  'riddlebarger-case-amillennialism': {
    id: 'riddlebarger-case-amillennialism', type: 'book',
    author: 'Riddlebarger, Kim', year: 2003,
    title: 'A Case for Amillennialism',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['escatología', 'amilenarismo'],
  },
  'ridderbos-coming-kingdom': {
    id: 'ridderbos-coming-kingdom', type: 'book',
    author: 'Ridderbos, Herman', year: 1962,
    title: 'El advenimiento del reino',
    originalTitle: 'The Coming of the Kingdom', originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['escatología', 'reino-de-dios', 'teología-bíblica'],
  },

  /* —— Teología del pacto / sistemática —— */
  'horton-god-of-promise': {
    id: 'horton-god-of-promise', type: 'book',
    author: 'Horton, Michael', year: 2006,
    title: 'God of Promise: Introducing Covenant Theology',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'intermedio',
    topics: ['teología-del-pacto', 'dogmática-reformada'],
  },
  'murray-epistle-romans': {
    id: 'murray-epistle-romans', type: 'book',
    author: 'Murray, John', year: 1965,
    title: 'The Epistle to the Romans',
    originalTitle: null, originalLanguage: 'en',
    publisher: null, translator: null, city: null, editionYear: null, isbn: null,
    url: null, language: 'es', level: 'avanzado',
    topics: ['romanos', 'comentario', 'soteriología'],
  },

});

/* ---------------------------------------------------------------------------
   §2 · Descriptores de auto-enlace (firmas)
   titles y guards YA están normalizados (minúsculas, sin tildes). El orden
   importa: app.js prueba los descriptores en este orden y, dentro de un mismo
   nodo de texto, prefiere la frase de título más larga hallada.
   --------------------------------------------------------------------------- */
const BIBLIOGRAPHY_MATCH = Object.freeze([

  /* Confesiones / credos — frases en texto plano (no van en <em>). */
  { id: 'confesion-westminster',
    titles: ['confesion de fe de westminster', 'confesion de westminster', 'wcf'],
    guards: [] },
  { id: 'catecismo-mayor-westminster',
    titles: ['catecismo mayor de westminster', 'catecismo mayor'],
    guards: [['westminster']] },
  { id: 'catecismo-menor-westminster',
    titles: ['catecismo menor de westminster', 'catecismo menor'],
    guards: [['westminster']] },
  { id: 'catecismo-heidelberg',
    titles: ['catecismo de heidelberg', 'heidelberg'], guards: [] },
  { id: 'confesion-belga',
    titles: ['confesion de fe belga', 'confesion belga', 'belga'], guards: [] },
  { id: 'canones-dort',
    titles: ['canones de dort', 'cnones de dort'], guards: [] },
  { id: 'confesion-1689',
    titles: ['confesion bautista de fe de 1689'], guards: [['bautista']] },
  { id: 'confesion-helvetica-2',
    titles: ['segunda confesion helvetica'], guards: [] },
  { id: 'credo-niceno',
    titles: ['credo niceno-constantinopolitano', 'credo de nicea', 'credo niceno'],
    guards: [] },

  /* Libros — títulos que aparecen dentro de <em>; guard de autor resuelve homónimos. */
  { id: 'calvino-institucion',
    titles: ['institucion de la religion cristiana', 'institutio christianae religionis', 'institutio'],
    guards: [['calvino']] },
  { id: 'lutero-esclavitud-voluntad',
    titles: ['de servo arbitrio', 'la esclavitud de la voluntad', 'la esclavitud del albedrio'],
    guards: [['lutero']] },
  { id: 'owen-muerte-de-la-muerte',
    titles: ['death of death in the death of christ', 'death of death'],
    guards: [['owen']] },
  { id: 'owen-comunion-con-dios',
    titles: ['communion with the triune god', 'communion with god', 'comunion con dios'],
    guards: [['owen']] },
  { id: 'owen-gloria-de-cristo',
    titles: ['the glory of christ', 'la gloria de cristo'], guards: [['owen']] },
  { id: 'owen-mortificacion-pecado',
    titles: ['the mortification of sin', 'la mortificacion del pecado'], guards: [['owen']] },
  { id: 'baxter-pastor-reformado',
    titles: ['the reformed pastor', 'el pastor reformado'], guards: [['baxter']] },
  { id: 'baxter-reposo-eterno',
    titles: ["the saints' everlasting rest", 'the saints everlasting rest', 'el reposo eterno de los santos'],
    guards: [['baxter']] },
  { id: 'bunyan-progreso-peregrino',
    titles: ['el progreso del peregrino', "the pilgrim's progress", 'the pilgrims progress'],
    guards: [['bunyan']] },
  { id: 'turretin-institutio',
    titles: ['institutio theologiae elenticae', 'institutio theologiae elencticae'],
    guards: [['turretin']] },
  { id: 'witsius-economia-pactos',
    titles: ['the economy of the covenants', 'de oeconomia foederum'], guards: [['witsius']] },
  { id: 'agustin-confesiones',
    titles: ['confesiones'], guards: [['agustin']] },
  { id: 'agustin-ciudad-de-dios',
    titles: ['la ciudad de dios'], guards: [['agustin']] },
  { id: 'agustin-de-doctrina-christiana',
    titles: ['de doctrina christiana'], guards: [['agustin']] },
  { id: 'berkhof-introduccion-sistematica',
    titles: ['introduccion a la teologia sistematica'], guards: [['berkhof']] },
  { id: 'berkhof-principios-interpretacion',
    titles: ['principios de interpretacion biblica'], guards: [['berkhof']] },
  { id: 'berkhof-systematic-theology',
    titles: ['systematic theology'], guards: [['berkhof']] },
  { id: 'hodge-systematic-theology',
    titles: ['systematic theology'], guards: [['charles hodge']] },
  { id: 'warfield-inspiracion-autoridad',
    titles: ['the inspiration and authority of the bible'], guards: [['warfield']] },
  { id: 'bavinck-reformed-dogmatics',
    titles: ['reformed dogmatics'], guards: [['bavinck']] },
  { id: 'vos-biblical-theology',
    titles: ['biblical theology'], guards: [['vos']] },
  { id: 'murray-redencion-consumada',
    titles: ['redemption accomplished and applied', 'la redencion consumada y aplicada'],
    guards: [['john murray']] },

  /* ===== CONT-004b · LOTE NÚCLEO · firmas (titles/guards normalizados) =====
     Guards de autor/título resuelven homónimos dentro del corpus:
     · Robertson pactos vs profetas · Frame knowledge vs christian life
     · Murray Romans vs Redención · Clowney unfolding vs church
     · Packer (Knowing God) vs Tozer (mismo título español, no incluido aún)
     · Sproul: cuatro obras distintas, todas guard ['sproul']. */

  { id: 'gonzalez-historia-cristianismo',
    titles: ['historia del cristianismo'], guards: [['gonzalez']] },
  { id: 'gonzalez-historia-pensamiento',
    titles: ['historia del pensamiento cristiano'], guards: [['gonzalez']] },

  { id: 'robertson-cristo-de-los-pactos',
    titles: ['the christ of the covenants', 'cristo de los pactos'], guards: [['robertson']] },
  { id: 'robertson-christ-of-prophets',
    titles: ['the christ of the prophets'], guards: [['robertson']] },
  { id: 'clowney-unfolding-mystery',
    titles: ['the unfolding mystery'], guards: [['clowney']] },
  { id: 'fee-stuart-lectura-eficaz',
    titles: ['la lectura eficaz de la biblia', 'how to read the bible for all its worth'],
    guards: [['fee', 'stuart']] },
  { id: 'dillard-longman-intro-at',
    titles: ['introduccion al antiguo testamento'], guards: [['dillard']] },
  { id: 'carson-moo-intro-nt',
    titles: ['una introduccion al nuevo testamento', 'an introduction to the new testament'],
    guards: [['carson']] },
  { id: 'duvall-hays-hermeneutica',
    titles: ['hermeneutica: entendiendo la palabra de dios', 'hermeneutica entendiendo la palabra de dios', 'grasping god'],
    guards: [['duvall']] },
  { id: 'beale-nt-biblical-theology',
    titles: ['a new testament biblical theology'], guards: [['beale']] },

  { id: 'ferguson-whole-christ',
    titles: ['the whole christ'], guards: [['ferguson']] },
  { id: 'macleod-person-of-christ',
    titles: ['the person of christ'], guards: [['macleod']] },
  { id: 'letham-work-of-christ',
    titles: ['the work of christ'], guards: [['letham']] },
  { id: 'gaffin-resurrection-redemption',
    titles: ['resurrection and redemption'], guards: [['gaffin']] },
  { id: 'sproul-faith-alone',
    titles: ['faith alone'], guards: [['sproul']] },
  { id: 'lutero-comentario-galatas',
    titles: ['comentario a galatas', 'comentario a la epistola a los galatas'], guards: [['lutero']] },

  { id: 'sproul-santidad-de-dios',
    titles: ['the holiness of god', 'la santidad de dios'], guards: [['sproul']] },
  { id: 'sproul-escogidos-por-dios',
    titles: ['chosen by god', 'escogidos por dios'], guards: [['sproul']] },
  { id: 'packer-conocimiento-dios-santo',
    titles: ['el conocimiento del dios santo', 'knowing god'], guards: [['packer']] },
  { id: 'boston-fourfold-state',
    titles: ['human nature in its fourfold state'], guards: [['boston']] },
  { id: 'edwards-freedom-of-will',
    titles: ['freedom of the will'], guards: [['edwards']] },
  { id: 'kuyper-lectures-calvinism',
    titles: ['lectures on calvinism'], guards: [['kuyper']] },

  { id: 'sproul-conocer-escritura',
    titles: ['como estudiar e interpretar la biblia', 'knowing scripture'], guards: [['sproul']] },
  { id: 'plummer-40-preguntas',
    titles: ['40 preguntas sobre la interpretacion de la biblia'], guards: [['plummer']] },
  { id: 'frame-knowledge-of-god',
    titles: ['the doctrine of the knowledge of god'], guards: [['frame']] },
  { id: 'frame-doctrine-christian-life',
    titles: ['the doctrine of the christian life'], guards: [['frame']] },
  { id: 'reeves-ardiente-conviccion',
    titles: ['ardiente conviccion', 'the unquenchable flame'], guards: [['reeves']] },
  { id: 'george-teologia-reformadores',
    titles: ['la teologia de los reformadores', 'theology of the reformers'], guards: [['george']] },

  { id: 'clowney-the-church',
    titles: ['the church'], guards: [['clowney']] },
  { id: 'dever-nine-marks',
    titles: ['nine marks of a healthy church', 'una iglesia saludable'], guards: [['dever']] },

  { id: 'vantil-defense-of-faith',
    titles: ['the defense of the faith'], guards: [['van til']] },
  { id: 'oliphint-covenantal-apologetics',
    titles: ['covenantal apologetics'], guards: [['oliphint']] },

  { id: 'hoekema-biblia-y-futuro',
    titles: ['the bible and the future', 'la biblia y el futuro'], guards: [['hoekema']] },
  { id: 'vos-pauline-eschatology',
    titles: ['the pauline eschatology'], guards: [['vos']] },
  { id: 'venema-promise-future',
    titles: ['the promise of the future'], guards: [['venema']] },
  { id: 'storms-kingdom-come',
    titles: ['kingdom come'], guards: [['storms']] },
  { id: 'riddlebarger-case-amillennialism',
    titles: ['a case for amillennialism'], guards: [['riddlebarger']] },
  { id: 'ridderbos-coming-kingdom',
    titles: ['the coming of the kingdom', 'el advenimiento del reino'], guards: [['ridderbos']] },

  { id: 'horton-god-of-promise',
    titles: ['god of promise', 'introducing covenant theology'], guards: [['horton']] },
  { id: 'murray-epistle-romans',
    titles: ['the epistle to the romans'], guards: [['john murray']] },

]);

/* ---------------------------------------------------------------------------
   §3 · Exposición global (script clásico)
   --------------------------------------------------------------------------- */
window.BIBLIOGRAPHY = BIBLIOGRAPHY;
window.BIBLIOGRAPHY_MATCH = BIBLIOGRAPHY_MATCH;

/* ============================================================================
   FIN · data/bibliography.js · Verbum Manet Academy
   "Verbum Domini manet in aeternum."
   ============================================================================ */

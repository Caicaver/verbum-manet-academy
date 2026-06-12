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
    titles: ['institucion de la religion cristiana'], guards: [['calvino']] },
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

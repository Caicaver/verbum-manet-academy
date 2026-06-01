#!/usr/bin/env node
/* ============================================================================
   VERBUM MANET ACADEMY · validar-corpus.js
   ----------------------------------------------------------------------------
   Validador de integridad estructural y de datos para el corpus completo.
   Superconjunto autónomo de validar-fuentes.js (no requiere dependencias).

   Node >= 18. Sin paquetes externos.

   USO:
     node validar-corpus.js                 # valida courses/segment-* completo
     node validar-corpus.js ruta/a/curso.html [otro.html ...]   # archivos sueltos
     node validar-corpus.js --root .        # raíz del proyecto (default: cwd)
     node validar-corpus.js --json          # salida JSON (para CI)
     node validar-corpus.js --no-data       # omite cross-checks de datos
     node validar-corpus.js --quiet         # solo el resumen final

   CÓDIGO DE SALIDA:
     0  sin hallazgos críticos
     1  al menos un hallazgo crítico
     2  error de invocación / no se hallaron cursos

   QUÉ COMPRUEBA, POR CURSO:
     · fragmento puro (sin <!DOCTYPE>/<html>/<head>/<body>)
     · nº de lecciones (<article class="lesson">)
     · cada lección con 1 <aside class="lesson__source"> y >= 3 fuentes (<li>)
     · las CINCO vías por lección, en orden fijo
         Formulación Confesional -> Dimensión Eléntica ->
         Perspectiva de Teología Bíblica -> Aplicación Catequética ->
         Aplicación Doxológica
     · cuestionario por unidad: cada <section class="quiz"> con >= 1 pregunta
       (<details class="question">); modelo por unidad, no "12 por curso"
     · rúbrica final 5x4: tabla .rubric con 4 celdas de cabecera + 6 filas
     · footer de navegación entre cursos (.course-nav) con prev/next
     · cierre doxológico en latín
     · balance de etiquetas (li, ul, ol, aside, article, div, section,
       details, table, tr)
     · ortografía canónica de la 2.a vía: "eléntica" (marca "elenética")
   CROSS-CHECKS DE DATOS (si data/ está disponible):
     · cada id de curso resuelve a un fragmento real (id <-> hash <-> file)
     · cada data-glossary-term del fragmento existe como clave en GLOSSARY
   SALIDA GLOBAL:
     · conteo total de lecciones del corpus (sustituye cifras históricas)
   ============================================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

/* ---------------------------------------------------------------------------
   §0 · Configuración y flags
   --------------------------------------------------------------------------- */

const ARGV = process.argv.slice(2);
const FLAGS = {
  json:    ARGV.includes('--json'),
  quiet:   ARGV.includes('--quiet'),
  noData:  ARGV.includes('--no-data'),
};
let ROOT = process.cwd();
const rootIdx = ARGV.indexOf('--root');
if (rootIdx !== -1 && ARGV[rootIdx + 1]) ROOT = path.resolve(ARGV[rootIdx + 1]);

const EXPLICIT_FILES = ARGV.filter(
  (a) => !a.startsWith('--') && a !== ARGV[rootIdx + 1]
).map((a) => path.resolve(a)).filter((a) => a.endsWith('.html'));

const MIN_SOURCES = 3;

// Las cinco vías en orden canónico (sin acentos para comparar accent-insensitive).
// Cada posición admite uno o más prefijos válidos; el primero es el canónico.
const VIAS = [
  ['formulacion confesional'],
  ['dimension elentica', 'dimension elenetica'],            // elenética: variante ortográfica (ORT-005)
  ['perspectiva de teologia biblica'],
  ['aplicacion catequetica'],
  ['aplicacion doxologica', 'culminacion doxologica'],      // culminación: variante de Segmento II (Historia)
];

// Términos doxológicos latinos esperados al cierre (al menos uno por curso).
// Lista ampliada tras auditar el corpus: los cursos cierran con fórmulas variadas.
const LATIN_CLOSE = [
  'soli deo gloria',
  'coram deo',
  'in saeculum',
  'in saecula',
  'ad maiorem',                 // ad maiorem Dei gloriam
  'verbum domini manet',
  'verbum manet',
  'gloriae dei',
  'gloria dei',
  'deo gratias',
  'laus deo',
  'in aeternum',
];

/* ---------------------------------------------------------------------------
   §1 · Utilidades de texto
   --------------------------------------------------------------------------- */

// Decodifica las entidades HTML españolas más frecuentes y normaliza acentos.
function decodeEntities(s) {
  return (s || '')
    .replace(/&aacute;/g, 'a').replace(/&eacute;/g, 'e')
    .replace(/&iacute;/g, 'i').replace(/&oacute;/g, 'o')
    .replace(/&uacute;/g, 'u').replace(/&ntilde;/g, 'n')
    .replace(/&Aacute;/g, 'A').replace(/&Eacute;/g, 'E')
    .replace(/&Iacute;/g, 'I').replace(/&Oacute;/g, 'O')
    .replace(/&Uacute;/g, 'U').replace(/&Ntilde;/g, 'N')
    .replace(/&uuml;/g, 'u').replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ').replace(/&laquo;|&raquo;/g, '"')
    .replace(/&mdash;|&ndash;/g, '-').replace(/&middot;/g, '·');
}

// Quita acentos Unicode (para comparación accent-insensitive).
function deaccent(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Normaliza a minúsculas, sin acentos, sin etiquetas, espacios colapsados.
function norm(s) {
  return deaccent(decodeEntities(s || '').replace(/<[^>]*>/g, ' '))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Cuenta ocurrencias de un patrón literal.
function countLiteral(hay, needle) {
  let n = 0, i = 0;
  while ((i = hay.indexOf(needle, i)) !== -1) { n++; i += needle.length; }
  return n;
}

// Cuenta matches de una RegExp global.
function countRe(hay, re) {
  const m = hay.match(re);
  return m ? m.length : 0;
}

// Extrae los cuerpos de todos los bloques <tag class="cls"> ... </tag>
// con anidamiento simple equilibrado para el mismo nombre de etiqueta.
function extractBlocks(html, tag, cls) {
  const open = new RegExp(`<${tag}\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'gi');
  const anyOpen = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
  const close = new RegExp(`</${tag}>`, 'gi');
  const blocks = [];
  let m;
  while ((m = open.exec(html)) !== null) {
    const start = m.index;
    const bodyStart = open.lastIndex;
    // Equilibrar etiquetas del mismo nombre desde bodyStart.
    let depth = 1, idx = bodyStart;
    anyOpen.lastIndex = bodyStart;
    close.lastIndex = bodyStart;
    while (depth > 0) {
      anyOpen.lastIndex = idx;
      close.lastIndex = idx;
      const no = anyOpen.exec(html);
      const nc = close.exec(html);
      if (!nc) { idx = html.length; break; }
      if (no && no.index < nc.index) { depth++; idx = anyOpen.lastIndex; }
      else { depth--; idx = close.lastIndex; }
    }
    blocks.push({ outer: html.slice(start, idx), body: html.slice(bodyStart, idx - (`</${tag}>`).length) });
    open.lastIndex = idx;
  }
  return blocks;
}

/* ---------------------------------------------------------------------------
   §2 · Localización de archivos de curso
   --------------------------------------------------------------------------- */

function findCourseFiles() {
  if (EXPLICIT_FILES.length) return EXPLICIT_FILES;

  const coursesDir = path.join(ROOT, 'courses');
  const found = [];
  if (fs.existsSync(coursesDir)) {
    for (const seg of fs.readdirSync(coursesDir)) {
      const segDir = path.join(coursesDir, seg);
      if (!fs.statSync(segDir).isDirectory()) continue;
      for (const f of fs.readdirSync(segDir)) {
        if (f.endsWith('.html')) found.push(path.join(segDir, f));
      }
    }
  }
  return found.sort();
}

/* ---------------------------------------------------------------------------
   §3 · Carga opcional de datos (courses-index.js / glossary.js)
   --------------------------------------------------------------------------- */

function loadData() {
  if (FLAGS.noData) return { courses: null, glossary: null };
  const sandbox = {};
  const read = (rel) => {
    const p = path.join(ROOT, 'data', rel);
    if (!fs.existsSync(p)) return null;
    try {
      // Los módulos de datos son scripts clásicos que declaran globales.
      // Se evalúan en un contexto controlado capturando esas asignaciones.
      const code = fs.readFileSync(p, 'utf8');
      const fn = new Function('window', `${code}\n;return { COURSES_INDEX: typeof COURSES_INDEX!=="undefined"?COURSES_INDEX:(window.COURSES_INDEX||null), GLOSSARY: typeof GLOSSARY!=="undefined"?GLOSSARY:(window.GLOSSARY||null) };`);
      return fn(sandbox);
    } catch (e) {
      return { __error: e.message };
    }
  };
  const ci = read('courses-index.js');
  const gl = read('glossary.js');
  return {
    courses: ci && ci.COURSES_INDEX ? ci.COURSES_INDEX : null,
    glossary: gl && gl.GLOSSARY ? gl.GLOSSARY : null,
    coursesErr: ci && ci.__error ? ci.__error : null,
    glossaryErr: gl && gl.__error ? gl.__error : null,
  };
}

/* ---------------------------------------------------------------------------
   §4 · Validación de un curso
   --------------------------------------------------------------------------- */

function validateCourse(file, data) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  const findings = []; // {sev:'critical'|'warn'|'info', msg}
  const add = (sev, msg) => findings.push({ sev, msg });

  /* -- 4.1 fragmento puro -- */
  if (/<!DOCTYPE|<html\b|<head[\s>]|<body\b/i.test(html)) {
    add('critical', 'Contiene etiquetas raíz (<!DOCTYPE/<html>/<head>/<body>); debe ser fragmento puro.');
  }

  /* -- 4.2 lecciones -- */
  const lessons = extractBlocks(html, 'article', 'lesson');
  const lessonCount = lessons.length;
  if (lessonCount === 0) add('critical', 'No se halló ninguna <article class="lesson">.');

  /* -- 4.3 fuentes por lección -- */
  lessons.forEach((lesson, i) => {
    const sources = extractBlocks(lesson.outer, 'aside', 'lesson__source');
    if (sources.length === 0) {
      add('critical', `Lección ${i + 1}: falta <aside class="lesson__source">.`);
    } else {
      if (sources.length > 1) add('warn', `Lección ${i + 1}: ${sources.length} bloques lesson__source (se esperaba 1).`);
      const liCount = countRe(sources[0].body, /<li\b/gi);
      if (liCount < MIN_SOURCES) {
        add('critical', `Lección ${i + 1}: solo ${liCount} fuentes (mínimo ${MIN_SOURCES}).`);
      }
    }

    /* -- 4.4 cinco vías por lección, en orden -- */
    // El marcado del título de vía varía por curso: unos usan <h4>, otros <p>.
    // Se acepta cualquier etiqueta que lleve class="via__title".
    const titles = [];
    const re = /<([a-z0-9]+)\b[^>]*class="[^"]*\bvia__title\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi;
    let mm;
    while ((mm = re.exec(lesson.outer)) !== null) titles.push(norm(mm[2]));

    if (titles.length !== 5) {
      add('critical', `Lección ${i + 1}: ${titles.length} vías (se esperaban 5).`);
    } else {
      for (let k = 0; k < 5; k++) {
        const accepted = VIAS[k];                 // array: [canónico, ...variantes]
        // Algunos cursos prefijan el título con "Vía N · "; se elimina para comparar.
        const cleaned = titles[k].replace(/^via\s*\d+\s*[·:.\-]?\s*/, '');
        const matchIdx = accepted.findIndex((p) => cleaned.startsWith(p) || cleaned.includes(p));
        if (matchIdx === -1) {
          add('critical', `Lección ${i + 1}: vía ${k + 1} fuera de orden o título inesperado ("${titles[k]}").`);
        } else if (matchIdx > 0) {
          // Coincide con una variante aceptada, no con la forma canónica.
          if (k === 1) {
            add('warn', `Lección ${i + 1}: vía 2 escrita "elenética"; la forma canónica es "eléntica" (ORT-005).`);
          } else if (k === 4) {
            add('info', `Lección ${i + 1}: vía 5 usa "Culminación doxológica" (variante de Segmento II; canónico: "Aplicación doxológica").`);
          } else {
            add('warn', `Lección ${i + 1}: vía ${k + 1} usa una variante aceptada en vez de la forma canónica.`);
          }
        }
      }
    }
  });

  /* -- 4.5 cuestionario por unidad -- */
  const quizzes = extractBlocks(html, 'section', 'quiz');
  let totalQuestions = 0;
  if (quizzes.length === 0) {
    add('critical', 'No se halló ningún <section class="quiz">.');
  } else {
    quizzes.forEach((q, i) => {
      const qn = countRe(q.body, /<details\b[^>]*class="[^"]*\bquestion\b[^"]*"/gi);
      totalQuestions += qn;
      if (qn < 1) add('critical', `Cuestionario ${i + 1}: 0 preguntas (<details class="question">).`);
    });
  }

  /* -- 4.6 rúbrica 5x4 -- */
  const rubricTables = [];
  const tableRe = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
  let tm;
  while ((tm = tableRe.exec(html)) !== null) {
    if (/class="[^"]*\brubric\b[^"]*"/i.test(tm[0]) || /\brubric__/i.test(tm[0])) {
      rubricTables.push(tm[0]);
    }
  }
  // Acepta también <table> dentro de una sección/aside con clase rubric.
  if (rubricTables.length === 0) {
    const rubBlocks = extractBlocks(html, 'section', 'rubric')
      .concat(extractBlocks(html, 'div', 'rubric'))
      .concat(extractBlocks(html, 'aside', 'rubric'));
    rubBlocks.forEach((b) => {
      const t = b.outer.match(/<table\b[^>]*>[\s\S]*?<\/table>/i);
      if (t) rubricTables.push(t[0]);
    });
  }
  if (rubricTables.length === 0) {
    add('warn', 'No se halló tabla de rúbrica (.rubric). Verificar si este curso debe tener actividad final con rúbrica.');
  } else {
    const t = rubricTables[0];
    const rows = countRe(t, /<tr\b/gi);
    const firstRow = (t.match(/<tr\b[\s\S]*?<\/tr>/i) || [''])[0];
    const headerCells = countRe(firstRow, /<t[hd]\b/gi);
    // Rúbrica válida = 5 filas de criterio (cabecera + 5) y 4 ó 5 columnas
    // (criterio + 3 ó 4 niveles de desempeño). Ambos anchos existen en el corpus.
    if (rows !== 6) add('warn', `Rúbrica: ${rows} filas (se esperaban 6 = cabecera + 5 criterios).`);
    if (headerCells < 4 || headerCells > 5) {
      add('warn', `Rúbrica: ${headerCells} columnas de cabecera (se esperaban 4 ó 5 = criterio + 3 ó 4 niveles).`);
    }
  }

  /* -- 4.7 footer de navegación entre cursos -- */
  const hasNav = /class="[^"]*\bcourse-nav\b[^"]*"/i.test(html);
  if (!hasNav) add('critical', 'Falta el footer de navegación entre cursos (.course-nav).');
  else {
    const hasPrev = /course-nav__link--prev|course-nav__direction[^>]*>[\s\S]{0,40}anterior/i.test(html);
    const hasNext = /course-nav__link--next|course-nav__direction[^>]*>[\s\S]{0,40}siguiente/i.test(html);
    if (!hasPrev && !hasNext) add('warn', '.course-nav presente pero sin enlaces prev/next reconocibles.');
  }

  /* -- 4.8 cierre doxológico latino -- */
  // Convención editorial presente en la gran mayoría del corpus. Su ausencia
  // es una laguna a subsanar, no un fallo estructural que rompa la SPA.
  const flat = norm(html);
  if (!LATIN_CLOSE.some((t) => flat.includes(t))) {
    add('warn', 'No se halló cierre doxológico en latín (p. ej. "Soli Deo gloria"). Añadir para uniformidad editorial.');
  }

  /* -- 4.9 balance de etiquetas (PATCH: con conciencia de comentarios) --
     Se descartan los comentarios HTML antes de contar, para no contabilizar
     etiquetas citadas literalmente dentro de <!-- ... --> (p. ej. comentarios
     que documentan el cierre del wrapper raiz). Sin esto, un comentario como
     <!-- ... <div class="course-page"> ... --> infla el conteo de <div>. */
  const htmlNoComments = html.replace(/<!--[\s\S]*?-->/g, ' ');
  ['li', 'ul', 'ol', 'aside', 'article', 'div', 'section', 'details', 'table', 'tr'].forEach((tag) => {
    const o = countRe(htmlNoComments, new RegExp(`<${tag}\\b`, 'gi'));
    const c = countRe(htmlNoComments, new RegExp(`</${tag}>`, 'gi'));
    if (o !== c) add('critical', `Etiquetas <${tag}> desbalanceadas: ${o} abren, ${c} cierran.`);
  });

  /* -- 4.10 sin storage prohibido -- */
  if (/\b(localStorage|sessionStorage)\b/.test(html)) {
    add('critical', 'Uso prohibido de localStorage/sessionStorage.');
  }

  /* -- 4.11 cross-check de datos -- */
  const id = path.basename(file, '.html');
  let glossaryTerms = [];
  const gtRe = /data-glossary-term="([^"]*)"/gi;
  let gm;
  while ((gm = gtRe.exec(html)) !== null) glossaryTerms.push(gm[1]);
  glossaryTerms = [...new Set(glossaryTerms)];

  if (data && data.courses) {
    const entry = data.courses.find((c) => c && c.id === id);
    if (!entry) add('warn', `data/courses-index.js: no hay entrada con id "${id}".`);
    else if (entry.file && path.basename(entry.file) !== path.basename(file)) {
      add('warn', `courses-index: file "${entry.file}" no coincide con "${path.basename(file)}".`);
    }
  }
  if (data && data.glossary) {
    glossaryTerms.forEach((t) => {
      if (!(t in data.glossary)) add('warn', `Glosario: término "${t}" usado en el fragmento no existe en GLOSSARY.`);
    });
  }

  return {
    file: rel,
    id,
    lessonCount,
    quizCount: quizzes.length,
    totalQuestions,
    glossaryTerms,
    findings,
    critical: findings.filter((f) => f.sev === 'critical').length,
    warn: findings.filter((f) => f.sev === 'warn').length,
  };
}

/* ---------------------------------------------------------------------------
   §5 · Orquestación y reporte
   --------------------------------------------------------------------------- */

function main() {
  const files = findCourseFiles();
  if (!files.length) {
    console.error('✗ No se hallaron archivos de curso. Usa --root o pasa archivos .html explícitos.');
    process.exit(2);
  }

  const data = loadData();
  const results = files.map((f) => validateCourse(f, data));

  const totalLessons = results.reduce((s, r) => s + r.lessonCount, 0);
  const totalCritical = results.reduce((s, r) => s + r.critical, 0);
  const totalWarn = results.reduce((s, r) => s + r.warn, 0);

  if (FLAGS.json) {
    console.log(JSON.stringify({
      root: ROOT,
      courses: results,
      totals: { files: files.length, lessons: totalLessons, critical: totalCritical, warn: totalWarn },
      dataAvailable: { courses: !!data.courses, glossary: !!data.glossary },
    }, null, 2));
    process.exit(totalCritical > 0 ? 1 : 0);
  }

  const C = { red: '\x1b[31m', yel: '\x1b[33m', grn: '\x1b[32m', dim: '\x1b[2m', bold: '\x1b[1m', rst: '\x1b[0m' };

  console.log(`\n${C.bold}Verbum Manet Academy · validación de corpus${C.rst}`);
  console.log(`${C.dim}raíz: ${ROOT}${C.rst}`);
  if (data.coursesErr) console.log(`${C.yel}aviso: courses-index.js no evaluable (${data.coursesErr})${C.rst}`);
  if (data.glossaryErr) console.log(`${C.yel}aviso: glossary.js no evaluable (${data.glossaryErr})${C.rst}`);
  if (!data.courses && !FLAGS.noData) console.log(`${C.dim}(cross-check de courses-index omitido: no disponible)${C.rst}`);
  if (!data.glossary && !FLAGS.noData) console.log(`${C.dim}(cross-check de glosario omitido: no disponible)${C.rst}`);
  console.log('');

  for (const r of results) {
    const tag = r.critical ? `${C.red}✗${C.rst}` : (r.warn ? `${C.yel}!${C.rst}` : `${C.grn}✓${C.rst}`);
    console.log(`${tag} ${C.bold}${r.file}${C.rst}  ${C.dim}· ${r.lessonCount} lecciones · ${r.quizCount} cuestionarios (${r.totalQuestions} preguntas)${C.rst}`);
    if (!FLAGS.quiet) {
      for (const f of r.findings) {
        const c = f.sev === 'critical' ? C.red : (f.sev === 'warn' ? C.yel : C.dim);
        const label = f.sev === 'critical' ? 'CRÍTICO' : (f.sev === 'warn' ? 'aviso ' : 'info  ');
        console.log(`    ${c}${label}${C.rst} ${f.msg}`);
      }
    }
  }

  console.log(`\n${C.bold}── Resumen ──${C.rst}`);
  console.log(`Cursos validados:   ${files.length}`);
  console.log(`${C.bold}Lecciones totales:  ${totalLessons}${C.rst}   ${C.dim}(cifra vigente; sustituye a 135 / 67)${C.rst}`);
  console.log(`Hallazgos críticos: ${totalCritical ? C.red + totalCritical + C.rst : C.grn + '0' + C.rst}`);
  console.log(`Avisos:             ${totalWarn ? C.yel + totalWarn + C.rst : '0'}`);
  console.log(`Veredicto:          ${totalCritical ? C.red + 'NO APTO (resolver críticos)' + C.rst : C.grn + 'APTO para despliegue' + C.rst}\n`);

  process.exit(totalCritical > 0 ? 1 : 0);
}

main();

/* ============================================================================
   FIN · validar-corpus.js · Verbum Manet Academy
   ============================================================================ */

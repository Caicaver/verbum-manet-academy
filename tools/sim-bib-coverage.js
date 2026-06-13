#!/usr/bin/env node
/* ============================================================================
   VERBUM MANET ACADEMY · tools/sim-bib-coverage.js  (auxiliar de sesión)
   ----------------------------------------------------------------------------
   Simula enhanceBibliographyRefs() (app.js §9.bis) FUERA del navegador para
   medir cobertura de auto-enlace por curso, sin desplegar.

   Carga BIBLIOGRAPHY / BIBLIOGRAPHY_MATCH REALES desde data/bibliography.js
   (vía shim window) — no se copian a mano. Replica al pie de la letra:
     · bibNormMap : char-a-char lower → NFD → quita diacríticos (con mapa de
                    offsets, aquí innecesario pero se conserva la semántica).
     · liNorm     : normaliza textContent del <li> y colapsa espacios.
     · bibGuardsOk: AND-de-ORs de tokens normalizados sobre liNorm.
     · match      : por NODO DE TEXTO, busca cada `title`; un <li> con >= 1
                    título hallado (con guards OK) cuenta como CUBIERTO.

   USO:
     node tools/sim-bib-coverage.js courses/*.html
     node tools/sim-bib-coverage.js --json courses/*.html
     node tools/sim-bib-coverage.js --misses courses/uno.html   # lista no cubiertos
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ARGV = process.argv.slice(2);
const JSONOUT = ARGV.includes('--json');
const SHOWMISS = ARGV.includes('--misses');
const FILES = ARGV.filter((a) => !a.startsWith('--') && a.endsWith('.html'))
  .map((a) => path.resolve(a));

/* —— Cargar datos reales vía shim window —— */
function loadBibData(bibPath) {
  const src = fs.readFileSync(bibPath, 'utf8');
  const sandbox = { window: {} };
  // El archivo es 'use strict' y asigna a window.*; lo evaluamos con un window falso.
  const fn = new Function('window', src + '\nreturn { B: window.BIBLIOGRAPHY, M: window.BIBLIOGRAPHY_MATCH };');
  return fn(sandbox.window);
}

/* —— Decodificador de entidades (browser textContent) —— */
function decodeEntities(s) {
  return (s || '')
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á').replace(/&Eacute;/g, 'É').replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó').replace(/&Uacute;/g, 'Ú').replace(/&Ntilde;/g, 'Ñ')
    .replace(/&uuml;/g, 'ü').replace(/&Uuml;/g, 'Ü')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&middot;/g, '·').replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ').replace(/&deg;/g, '°')
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/* —— Normalización idéntica a app.js bibNormMap (sólo .out aquí) —— */
function bibNorm(text) {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    out += text[i].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  return out;
}

function bibGuardsOk(liNorm, guards) {
  for (const group of guards) {
    let any = false;
    for (const tok of group) { if (liNorm.indexOf(tok) !== -1) { any = true; break; } }
    if (!any) return false;
  }
  return true;
}

/* —— Extrae <li> de cada <ul class="lesson__source-list"> —— */
function extractSourceLis(html) {
  const lis = [];
  const ulRe = /<ul\b[^>]*class="[^"]*\blesson__source-list\b[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi;
  let um;
  while ((um = ulRe.exec(html)) !== null) {
    const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
    let lm;
    while ((lm = liRe.exec(um[1])) !== null) lis.push(lm[1]);
  }
  return lis;
}

/* —— Texto plano del <li> (textContent) y sus "nodos de texto" —— */
function liTextContent(inner) {
  return decodeEntities(inner.replace(/<[^>]*>/g, ''));
}
// Segmentos de texto entre etiquetas = aproximación a nodos de texto del DOM.
function liTextNodes(inner) {
  return inner.split(/<[^>]*>/g).map(decodeEntities).filter((s) => s.length);
}

/* —— Simula el match para un <li> dado —— */
function matchLi(inner, B, M) {
  const liNorm = bibNorm(liTextContent(inner)).replace(/\s+/g, ' ');
  const active = M.filter((d) => B[d.id] && bibGuardsOk(liNorm, d.guards));
  if (!active.length) return { covered: false, ids: [] };
  const ids = new Set();
  for (const seg of liTextNodes(inner)) {
    const out = bibNorm(seg);
    for (const d of active) {
      for (const title of d.titles) {
        if (out.indexOf(title) !== -1) { ids.add(d.id); break; }
      }
    }
  }
  return { covered: ids.size > 0, ids: [...ids] };
}

/* —— Main —— */
const { B, M } = loadBibData(path.resolve('data/bibliography.js'));
const perCourse = [];
let gTotal = 0, gCovered = 0;
const hitIds = new Set();

for (const f of FILES) {
  const html = fs.readFileSync(f, 'utf8');
  const lis = extractSourceLis(html);
  let covered = 0;
  const misses = [];
  for (const inner of lis) {
    const r = matchLi(inner, B, M);
    if (r.covered) { covered += 1; r.ids.forEach((id) => hitIds.add(id)); }
    else misses.push(liTextContent(inner).replace(/\s+/g, ' ').trim());
  }
  gTotal += lis.length; gCovered += covered;
  perCourse.push({ file: path.basename(f), total: lis.length, covered,
    pct: lis.length ? +(100 * covered / lis.length).toFixed(1) : 0, misses });
}

if (JSONOUT) {
  console.log(JSON.stringify({
    perCourse: perCourse.map(({ misses, ...r }) => r),
    global: { total: gTotal, covered: gCovered,
      pct: gTotal ? +(100 * gCovered / gTotal).toFixed(1) : 0 },
    entriesInBibliography: Object.keys(B).length,
    matchersDeclared: M.length,
    matchersThatHit: hitIds.size,
  }, null, 2));
  process.exit(0);
}

console.log('\nVerbum Manet Academy · simulación de cobertura de auto-enlace bibliográfico');
console.log(`entradas en BIBLIOGRAPHY: ${Object.keys(B).length} · descriptores MATCH: ${M.length}\n`);
for (const r of perCourse) {
  console.log(`  ${r.covered}/${r.total}  (${r.pct}%)  ${r.file}`);
  if (SHOWMISS && r.misses.length) {
    r.misses.forEach((m) => console.log(`        ✗ ${m.slice(0, 110)}${m.length > 110 ? '…' : ''}`));
  }
}
console.log(`\n── Global ──`);
console.log(`Líneas de fuente (<li>): ${gTotal}`);
console.log(`Cubiertas (>=1 enlace):  ${gCovered}`);
console.log(`Cobertura:               ${gTotal ? (100 * gCovered / gTotal).toFixed(1) : 0}%`);
console.log(`Descriptores que casaron: ${hitIds.size}/${M.length}\n`);

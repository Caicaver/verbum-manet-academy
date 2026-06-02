#!/usr/bin/env node
/* ============================================================================
   VERBUM MANET ACADEMY · verify-invariants.js
   ----------------------------------------------------------------------------
   Verificador de INVARIANTES GLOBALES del proyecto.

   No duplica a validar-corpus.js. División de trabajo:

     validar-corpus.js   → estructura INTERNA de cada curso
                           (lecciones, vías, fuentes, cuestionarios, rúbrica,
                            balance de etiquetas, cierre doxológico).

     verify-invariants.js → invariantes GLOBALES del proyecto, que cruzan
                           archivos o verifican los principios de arquitectura
                           (ARCHITECTURE.md §2):
                             · Estática primero
                             · Sin frameworks ni build
                             · Sin almacenamiento de navegador
                             · Contenido como datos / presentación como código

   Node >= 18. Sin paquetes externos.

   USO:
     node verify-invariants.js                 # raíz = cwd
     node verify-invariants.js --root .         # raíz explícita
     node verify-invariants.js --json           # salida JSON (para CI)
     node verify-invariants.js --quiet          # solo el resumen
     node verify-invariants.js --selftest       # corre los autotests internos

   CÓDIGO DE SALIDA:
     0  sin violaciones
     1  al menos una violación
     2  error de invocación / raíz no encontrada

   QUÉ COMPRUEBA (invariantes):
     INV-01  Sin localStorage/sessionStorage en js/ y data/ (Principio 3).
     INV-02  Sin frameworks ni imports de CDN de framework (Principio 2):
             react, vue, svelte, angular, jquery, alpine, htmx.
     INV-03  index.html no usa rutas absolutas de host (http://, //) en
             assets locales; las locales deben ser relativas o de raíz.
     INV-04  Coherencia de rutas de assets locales en index.html: o todas
             relativas (./) o todas de raíz (/), no mezcladas (aviso).
     INV-05  Todo <a target="_blank"> lleva rel con noopener (Sección 6).
     INV-06  Todo <img> lleva alt, width, height y loading (Sección 6).
     INV-07  Los <script> de data/ se cargan como clásicos (sin
             type="module"), pues exponen globales a los fragmentos.
     INV-08  Cross-check: cada src/href local de index.html resuelve a un
             archivo existente en disco (enlaces locales no rotos).
     INV-09  Existe un único manifest enlazado y el archivo existe.
     INV-10  data/courses-index.js declara COURSES_INDEX y data/glossary.js
             declara GLOSSARY (contrato de datos como globales).

   Las rutas tools/ y reports/ se excluyen de los escaneos de código fuente:
   contienen utilidades (este validador busca "localStorage" como literal).
   ============================================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

/* ---------------------------------------------------------------------------
   §0 · Flags y raíz
   --------------------------------------------------------------------------- */

const ARGV = process.argv.slice(2);
const FLAGS = {
  json:     ARGV.includes('--json'),
  quiet:    ARGV.includes('--quiet'),
  selftest: ARGV.includes('--selftest'),
};
let ROOT = process.cwd();
const rootIdx = ARGV.indexOf('--root');
if (rootIdx !== -1 && ARGV[rootIdx + 1]) ROOT = path.resolve(ARGV[rootIdx + 1]);

/* ---------------------------------------------------------------------------
   §1 · Utilidades
   --------------------------------------------------------------------------- */

function read(rel) {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

// Recorre un directorio recursivamente devolviendo archivos con extensión dada.
function walk(relDir, exts) {
  const abs = path.join(ROOT, relDir);
  const out = [];
  if (!fs.existsSync(abs)) return out;
  for (const name of fs.readdirSync(abs)) {
    const rel = path.join(relDir, name);
    const stat = fs.statSync(path.join(ROOT, rel));
    if (stat.isDirectory()) out.push(...walk(rel, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(rel);
  }
  return out;
}

// Quita comentarios HTML y bloques <!-- --> para no contar literales citados.
function stripHtmlComments(s) {
  return (s || '').replace(/<!--[\s\S]*?-->/g, ' ');
}

/* ---------------------------------------------------------------------------
   §2 · Comprobaciones individuales
   Cada función recibe un colector `add(sev, code, msg)` y opera sobre ROOT.
   sev: 'critical' | 'warn'
   --------------------------------------------------------------------------- */

// INV-01 — sin storage de navegador en código de aplicación.
function invStorage(add) {
  // Solo escaneamos código que se sirve al navegador: js/ y data/.
  const files = [...walk('js', ['.js']), ...walk('data', ['.js'])];
  let any = false;
  for (const f of files) {
    const code = read(f);
    if (code && /\b(localStorage|sessionStorage)\b/.test(code)) {
      add('critical', 'INV-01', `${f}: usa localStorage/sessionStorage (Principio 3 lo prohíbe).`);
      any = true;
    }
  }
  return any;
}

// INV-02 — sin frameworks ni librerías de framework.
function invFrameworks(add) {
  const fw = /\b(react|react-dom|vue|svelte|angular|jquery|alpinejs|alpine\.js|htmx)\b/i;
  const files = [...walk('js', ['.js']), 'index.html'].filter(Boolean);
  for (const f of files) {
    const code = read(f);
    if (!code) continue;
    // Buscamos en imports y en URLs de <script src>.
    const scriptSrcs = (code.match(/<script[^>]+src="([^"]+)"/gi) || []).join(' ');
    const imports = (code.match(/\bimport\b[\s\S]{0,120}?from\s+['"][^'"]+['"]/gi) || []).join(' ');
    if (fw.test(scriptSrcs) || fw.test(imports)) {
      add('critical', 'INV-02', `${f}: referencia a un framework/librería prohibida (Principio 2).`);
    }
  }
}

// Extrae todas las rutas locales (no http, no #, no mailto) de href/src de index.html.
function localAssetRefs(html) {
  const refs = [];
  const re = /(?:href|src)="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const v = m[1];
    if (/^(https?:)?\/\//i.test(v)) continue;     // externo (http o //)
    if (v.startsWith('#')) continue;               // ancla / ruta SPA
    if (v.startsWith('mailto:') || v.startsWith('tel:')) continue;
    if (v.startsWith('data:')) continue;
    refs.push(v);
  }
  return refs;
}

// INV-03 / INV-04 — rutas de assets en index.html.
function invIndexPaths(add) {
  const html = read('index.html');
  if (!html) { add('critical', 'INV-03', 'No se encontró index.html en la raíz.'); return; }
  const refs = localAssetRefs(html);

  // INV-04: coherencia relativa (./) vs raíz (/). Mezclar es solo un aviso:
  // en dominio raíz de Cloudflare Pages ambas funcionan, pero conviene unificar.
  const rootAbs = refs.filter((r) => r.startsWith('/'));
  const relDot  = refs.filter((r) => r.startsWith('./') || (!r.startsWith('/') && !r.startsWith('./')));
  if (rootAbs.length && relDot.length) {
    add('warn', 'INV-04',
      `index.html mezcla rutas de raíz (${rootAbs.length}: p.ej. ${rootAbs[0]}) y relativas (${relDot.length}: p.ej. ${relDot[0]}). Unificar para portabilidad fuera del dominio raíz.`);
  }
}

// INV-05 — target="_blank" exige rel con noopener.
function invBlankRel(add) {
  for (const f of ['index.html', ...walk('pages', ['.html']), ...walk('courses', ['.html'])]) {
    const html = read(f);
    if (!html) continue;
    const clean = stripHtmlComments(html);
    const anchors = clean.match(/<a\b[^>]*target="_blank"[^>]*>/gi) || [];
    for (const a of anchors) {
      if (!/rel="[^"]*noopener[^"]*"/i.test(a)) {
        add('critical', 'INV-05', `${f}: <a target="_blank"> sin rel="noopener" (riesgo tabnabbing).`);
        break; // un hallazgo por archivo basta para señalar
      }
    }
  }
}

// INV-06 — <img> debe llevar alt, width, height, loading.
function invImg(add) {
  for (const f of ['index.html', ...walk('pages', ['.html']), ...walk('courses', ['.html'])]) {
    const html = read(f);
    if (!html) continue;
    const imgs = stripHtmlComments(html).match(/<img\b[^>]*>/gi) || [];
    for (const img of imgs) {
      const missing = ['alt', 'width', 'height', 'loading'].filter(
        (attr) => !new RegExp(`\\b${attr}=`, 'i').test(img)
      );
      if (missing.length) {
        add('warn', 'INV-06', `${f}: <img> sin atributo(s) ${missing.join(', ')}.`);
      }
    }
  }
}

// INV-07 — scripts de data/ deben ser clásicos (sin type="module").
function invDataScripts(add) {
  const html = read('index.html');
  if (!html) return;
  const tags = html.match(/<script\b[^>]*src="\.?\/?data\/[^"]+"[^>]*>/gi) || [];
  for (const t of tags) {
    if (/type="module"/i.test(t)) {
      add('critical', 'INV-07', `index.html: script de data/ con type="module" (debe ser clásico para exponer globales).`);
    }
  }
}

// INV-08 — enlaces locales de index.html resuelven a archivos en disco.
function invLocalLinks(add) {
  const html = read('index.html');
  if (!html) return;
  const refs = localAssetRefs(html);
  for (const r of refs) {
    // Normaliza: quita query/fragmento, resuelve ./ y /.
    const clean = r.split('?')[0].split('#')[0];
    const rel = clean.replace(/^\.?\//, '');       // "./css/x" o "/css/x" → "css/x"
    if (!rel) continue;
    if (!exists(rel)) {
      add('critical', 'INV-08', `index.html enlaza "${r}" pero no existe ${rel} en disco.`);
    }
  }
}

// INV-09 — un único manifest enlazado y el archivo existe.
function invManifest(add) {
  const html = read('index.html');
  if (!html) return;
  const links = html.match(/<link\b[^>]*rel="manifest"[^>]*>/gi) || [];
  if (links.length === 0) {
    add('warn', 'INV-09', 'index.html no enlaza ningún manifest PWA.');
    return;
  }
  if (links.length > 1) {
    add('warn', 'INV-09', `index.html enlaza ${links.length} manifests (se esperaba 1).`);
  }
  const m = links[0].match(/href="([^"]+)"/i);
  if (m) {
    const rel = m[1].split('?')[0].replace(/^\.?\//, '');
    if (!exists(rel)) add('critical', 'INV-09', `manifest enlazado "${m[1]}" no existe en disco (${rel}).`);
  }
}

// INV-10 — contrato de datos: globales esperadas declaradas.
function invDataContract(add) {
  const ci = read('data/courses-index.js');
  if (ci === null) add('warn', 'INV-10', 'No se encontró data/courses-index.js.');
  else if (!/\bCOURSES_INDEX\b/.test(ci)) add('critical', 'INV-10', 'data/courses-index.js no declara COURSES_INDEX.');

  const gl = read('data/glossary.js');
  if (gl === null) add('warn', 'INV-10', 'No se encontró data/glossary.js.');
  else if (!/\bGLOSSARY\b/.test(gl)) add('critical', 'INV-10', 'data/glossary.js no declara GLOSSARY.');
}

const CHECKS = [
  invStorage, invFrameworks, invIndexPaths, invBlankRel,
  invImg, invDataScripts, invLocalLinks, invManifest, invDataContract,
];

/* ---------------------------------------------------------------------------
   §3 · Orquestación
   --------------------------------------------------------------------------- */

function run() {
  const findings = [];
  const add = (sev, code, msg) => findings.push({ sev, code, msg });
  for (const check of CHECKS) check(add);
  return findings;
}

function report(findings) {
  const critical = findings.filter((f) => f.sev === 'critical');
  const warn = findings.filter((f) => f.sev === 'warn');

  if (FLAGS.json) {
    console.log(JSON.stringify({
      root: ROOT,
      findings,
      totals: { critical: critical.length, warn: warn.length },
    }, null, 2));
    return critical.length > 0 ? 1 : 0;
  }

  const C = { red: '\x1b[31m', yel: '\x1b[33m', grn: '\x1b[32m', dim: '\x1b[2m', bold: '\x1b[1m', rst: '\x1b[0m' };
  console.log(`\n${C.bold}Verbum Manet Academy · invariantes globales${C.rst}`);
  console.log(`${C.dim}raíz: ${ROOT}${C.rst}\n`);

  if (!findings.length) {
    console.log(`${C.grn}✓ Sin violaciones de invariantes.${C.rst}`);
  } else if (!FLAGS.quiet) {
    for (const f of findings) {
      const c = f.sev === 'critical' ? C.red : C.yel;
      const label = f.sev === 'critical' ? 'CRÍTICO' : 'aviso ';
      console.log(`  ${c}${label}${C.rst} ${C.dim}[${f.code}]${C.rst} ${f.msg}`);
    }
  }

  console.log(`\n${C.bold}── Resumen ──${C.rst}`);
  console.log(`Violaciones críticas: ${critical.length ? C.red + critical.length + C.rst : C.grn + '0' + C.rst}`);
  console.log(`Avisos:               ${warn.length ? C.yel + warn.length + C.rst : '0'}`);
  console.log(`Veredicto:            ${critical.length ? C.red + 'NO APTO' + C.rst : C.grn + 'APTO' + C.rst}\n`);
  return critical.length > 0 ? 1 : 0;
}

/* ---------------------------------------------------------------------------
   §4 · Autotests (--selftest): monta un proyecto sintético en /tmp y verifica
   que cada invariante dispara (y no dispara) cuando debe.
   --------------------------------------------------------------------------- */

function selftest() {
  const os = require('os');
  const assert = require('assert');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vma-inv-'));
  const W = (rel, content) => {
    const p = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  };

  // --- Caso A: proyecto LIMPIO ---
  W('index.html', [
    '<!DOCTYPE html><html><head>',
    '<link rel="manifest" href="/site.webmanifest">',
    '<link rel="stylesheet" href="./css/styles.css">',
    '</head><body>',
    '<a href="https://x.test" target="_blank" rel="noopener noreferrer">x</a>',
    '<script src="./data/courses-index.js"></script>',
    '<script src="./data/glossary.js"></script>',
    '</body></html>',
  ].join('\n'));
  W('site.webmanifest', '{}');
  W('css/styles.css', 'body{}');
  W('data/courses-index.js', 'const COURSES_INDEX = [];');
  W('data/glossary.js', 'const GLOSSARY = {};');
  W('js/app.js', 'const x = 1;');

  let saved = ROOT; ROOT = tmp;
  let f = run(); ROOT = saved;
  const critA = f.filter((x) => x.sev === 'critical');
  assert.strictEqual(critA.length, 0, 'Caso A (limpio) no debe tener críticos: ' + JSON.stringify(critA));

  // --- Caso B: proyecto SUCIO (debe disparar varias invariantes) ---
  W('js/bad.js', 'localStorage.setItem("k","v");');                 // INV-01
  W('js/fw.js', 'import React from "react";');                       // INV-02 (import)
  W('index.html', [
    '<!DOCTYPE html><html><head>',
    '<link rel="manifest" href="/missing.webmanifest">',           // INV-09 archivo ausente
    '<link rel="stylesheet" href="/css/styles.css">',               // raíz...
    '<link rel="stylesheet" href="./css/extra.css">',               // ...y relativa → INV-04 aviso; INV-08 extra.css falta
    '<script src="https://cdn.test/react.js"></script>',            // INV-02 (script src)
    '</head><body>',
    '<a href="https://x.test" target="_blank">sin rel</a>',         // INV-05
    '<img src="./x.png">',                                          // INV-06 faltan attrs
    '<script src="./data/courses-index.js" type="module"></script>',// INV-07
    '<script src="./data/glossary.js"></script>',
    '</body></html>',
  ].join('\n'));
  W('data/courses-index.js', 'const ALGO = [];');                    // INV-10 falta COURSES_INDEX
  // glossary.js sigue con GLOSSARY del caso A (ok)

  saved = ROOT; ROOT = tmp;
  f = run(); ROOT = saved;
  const codesB = new Set(f.map((x) => x.code));
  for (const code of ['INV-01', 'INV-02', 'INV-05', 'INV-06', 'INV-07', 'INV-08', 'INV-09', 'INV-10']) {
    assert.ok(codesB.has(code), `Caso B debía disparar ${code}. Disparó: ${[...codesB].join(',')}`);
  }
  assert.ok(f.some((x) => x.code === 'INV-04' && x.sev === 'warn'), 'Caso B debía avisar INV-04 (rutas mezcladas).');

  // Limpieza
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('\x1b[32m✓ selftest: las 10 invariantes disparan y silencian según lo esperado.\x1b[0m');
  return 0;
}

/* ---------------------------------------------------------------------------
   §5 · main
   --------------------------------------------------------------------------- */

function main() {
  if (FLAGS.selftest) process.exit(selftest());
  if (!fs.existsSync(ROOT)) {
    console.error(`✗ Raíz no encontrada: ${ROOT}`);
    process.exit(2);
  }
  process.exit(report(run()));
}

main();

/* ============================================================================
   FIN · verify-invariants.js · Verbum Manet Academy
   ============================================================================ */

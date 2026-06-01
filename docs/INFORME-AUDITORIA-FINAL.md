# INFORME DE AUDITORÍA FINAL — Verbum Manet Academy

**Corpus de cursos · Etapa 5 (validación + corrección de críticos y avisos)**
**Fecha:** 2026-06-01 · **Alcance:** `courses/segment-1` … `courses/segment-4` (20 fragmentos)
**Herramienta de referencia:** `tools/validar-corpus.js` (Node ≥ 18, sin dependencias)

---

## 1. Resumen ejecutivo

El corpus quedó **validado, corregido e íntegro**: 20 cursos, 135 lecciones, **0 críticos y 0
avisos**. En esta etapa se confirmaron y resolvieron dos hallazgos críticos y, a continuación, se
cerraron los cuatro avisos editoriales pendientes. Las únicas líneas que el validador sigue
emitiendo son de nivel `info` y corresponden a una variante **aceptada por diseño**
(«Culminación doxológica» en el Segmento II).

| Indicador | Antes | Ahora |
|---|---|---|
| Cursos | 20 | 20 |
| Lecciones totales | 135 | 135 |
| Críticos | 2 | **0** |
| Avisos | 9 | **0** |
| `info` (variante aceptada) | 11 | 11 |
| Veredicto | — | **APTO para despliegue** |

---

## 2. Estado del corpus por segmento

| Segmento | Lecciones | Cursos |
|---|---|---|
| I · Fundamentos y Herramientas | 47 | 5 |
| II · Historia de la Iglesia | 36 | 4 |
| III · Teología Sistemática | 32 | 6 |
| IV · Teología Aplicada | 20 | 5 |
| **Total** | **135** | **20** |

---

## 3. Hallazgos críticos (resueltos)

### 3.1 CRÍTICO 1 — `cateque&iacute;tica` → `catequ&eacute;tica`

Error de codificación de entidad en el título de la 4.ª vía («Aplicación catequética»): la
entidad `&iacute;` (í) ocupaba el lugar de `&eacute;` (é). El validador no comprueba la ortografía
del término en sí; el efecto observable era que la cadena `catequeítica` rompía el reconocimiento
del título de la vía 4 y disparaba **38 hallazgos críticos** de «vía 4 fuera de orden o título
inesperado» (uno por lección afectada), originados en **48 instancias de texto** repartidas en 7
cursos.

| Curso | Instancias |
|---|---|
| `historia-iglesia-moderna.html` | 10 |
| `cristologia-soteriologia.html` | 11 |
| `eclesiologia-sacramentologia.html` | 7 |
| `antropologia-hamartologia.html` | 5 |
| `bibliologia.html` | 5 |
| `escatologia.html` | 5 |
| `teologia-propia.html` | 5 |
| **Total** | **48** |

**Estado:** RESUELTO. Reemplazo literal 48/48; los 38 hallazgos críticos quedan en cero.

### 3.2 CRÍTICO 2 — «`<div class="course-page">` sin cerrar» (falso positivo)

El validador reportó `<div>` desbalanceado en `misiones-evangelismo-local.html` (47/46) y
`teologia-del-pacto.html` (26/25). El **DOM real estaba balanceado**; la discrepancia provenía de
un comentario documental de cierre que cita el literal `<div class="course-page" …>`, contado por
la §4.9 al operar sobre HTML crudo. Añadir un `</div>` real habría roto documentos bien formados.

**Estado:** RESUELTO sin tocar el DOM. El literal del comentario se reescribió como selector CSS
(`div.course-page[data-course="…"]`). Adicionalmente se entrega `validar-corpus.PATCH.js`, que
endurece la §4.9 para ignorar comentarios y evitar la reaparición del falso positivo.

---

## 4. Avisos editoriales (resueltos en esta etapa)

### 4.1 ORT-005 · variante `elenética` → `eléntica` (5 instancias)

Normalizadas a la forma canónica **eléntica** (é tras la primera *e*):
`hermeneutica-biblica.html` (L9, L10) e `introduccion-antiguo-testamento.html` (L2, L3, L10).
Además se corrigieron 2 instancias sin acento (`elenctica`) en `teologia-del-pacto.html` que el
auditor no marcaba pero rompían la uniformidad. Total: 7 normalizaciones.

### 4.2 Cierre doxológico en latín ausente (3 cursos)

Se añadió un `<footer class="course-footer">` con `course-footer__doxology`, replicando el patrón
canónico del corpus (cierre con `<strong><i lang="la">…</i></strong>`), temáticamente ajustado a
cada curso:

- `formacion-espiritual-piedad-reformada.html` → *Coram Deo* / *Soli Deo gloria*.
- `historia-iglesia-antigua.html` → *Verbum Domini manet in aeternum*.
- `historia-iglesia-medieval.html` → *Soli Deo gloria*.

### 4.3 Rúbrica a 6 filas (1 curso)

`introduccion-teologia-reformada.html` tenía 5 `<tr>` (cabecera + 4 criterios). Se añadió el quinto
criterio **«Composición escrita»** —coherente con la rúbrica canónica de `hermeneutica-biblica.html`,
cuya 5.ª dimensión es justamente la composición—, alcanzando el modelo de 6 filas (cabecera + 5
criterios) con sus cuatro niveles de desempeño.

### 4.4 Variante «Culminación doxológica» (Segmento II) — sin acción

Aceptada por diseño en Historia de la Iglesia. El validador la emite como `info`, no como aviso.

---

## 5. Verificación final

```
node tools/validar-corpus.js --root .
```

Resultado: **20 cursos · 135 lecciones · 0 críticos · 0 avisos · APTO para despliegue.**
Integridad estructural confirmada con análisis de balance de etiquetas consciente de comentarios:
0/20 archivos con desbalance tras las inserciones.

---

## 6. Entregables de la etapa

- `courses.7z` (y `courses.zip` de respaldo): corpus final corregido, verificado por re-extracción
  y diff byte a byte (0 diferencias).
- `validacion-corpus.json`: reporte JSON sobre el corpus final (0/0).
- `validar-corpus.PATCH.js`: validador con §4.9 consciente de comentarios.
- `.assetsignore`: excluye `docs/`, `reports/`, `tools/` y metadatos del despliegue público.
- Este informe.

*Verbum Domini manet in aeternum.*

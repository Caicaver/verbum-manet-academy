# CHANGELOG v1.2.0 — Ajustes post-auditoría editorial

**Fecha:** 17 de mayo de 2026
**Basado en:** `AJUSTES-AUDITOR-STYLE-GUIDE.md` (especificación del 17 may 2026)
**Migración desde:** v1.1.0

---

## Resumen

Los 20 archivos del corpus de cursos fueron auditados con v1.1.0, devolviendo
155 hallazgos. El análisis editorial demostró que aproximadamente 90 de ellos
eran **falsos positivos** causados por patrones de reglas demasiado amplios.

Esta versión 1.2.0 ajusta seis reglas para distinguir falsos positivos de
hallazgos genuinos. Las correcciones aplicadas al corpus en la fase anterior
(EST-001, EXT-000, BIB-100, ORT-005, TER-001 con marcadores) se conservan
sin cambios; lo que se refina es el motor para que la próxima auditoría
emita solo lo realmente accionable.

Predicción de resultado: **0 críticos, 0 errores, <10 notas/avisos genuinos**
sobre el corpus de 20 archivos.

---

## Cambios por regla

### BIB-100 — Cita bíblica sin indicación de versión

**Antes:** detectaba toda `«...» (Ref)` sin marcador de versión.

**Ahora dispara solo cuando:**

1. La referencia contiene `:` (patrón `Libro Cap:Vers` real).
2. El paréntesis no contiene etiquetas HTML (excluye `<em>Ef.</em> 18:2`).
3. El paréntesis no contiene palabras de glosa: `canon`, `eco`, `Q.`, `P.`,
   `Art.`, `Cap.`, `vv.`, `cf.`, `hipérbole`.
4. La cita no lleva ya marcador: `RVR60`, `LBLA`, `NVI`, `BTX`, `DHH`,
   `LBA`, `RVA`, `NBLA`, `LXX`, `TM`, `Vulgata`, `Vulg.`.

**Soporta múltiples marcadores de versión** según tipo de texto:
- `RVR60` — texto español (por defecto)
- `Vulgata` — texto latino patrístico
- `LXX` — texto griego de los Setenta
- `TM` — texto masorético hebreo

**Helper añadido:** `detect_likely_latin_citation(quote_text)` con vocabulario
de palabras latinas exclusivas (`etiam`, `ergo`, `enim`, `quod`, `Domini`,
`Verbum`...). Si una cita contiene 2+ palabras latinas → sugerir Vulgata.

**Falsos positivos esperados eliminados:** 37 instancias en el corpus.

### TON-005 — Fórmulas devocionales de cierre epistolar

**Antes:** detectaba toda ocurrencia de `"en Cristo,"`.

**Ahora dispara solo cuando:**

1. `"En Cristo,"` aparece al inicio de línea + cierre de párrafo (firma).
2. `"Que Dios te bendiga"` aparece en cualquier contexto.
3. `"un abrazo en Cristo"` aparece como frase fija.
4. `"Tu/Vuestro/a hermano/a en Cristo,"` aparece como firma.

**NO dispara cuando** `en Cristo` aparece como complemento preposicional
en exposición teológica: «sacerdotes en Cristo, sin necesidad de mediación»,
«justificados en Cristo», «unidos en Cristo», «fe en Cristo».

**Falsos positivos esperados eliminados:** 28 instancias.

### TON-006 — Dirigirse al lector como «hermano»

**Antes:** detectaba toda ocurrencia de `hermano`, `hermana`, `querido lector`.

**Ahora dispara solo cuando hay vocativo directo al lector:**

- `Querido/a hermano/a/lector/lectora`
- `Estimado/a hermano/a/lector/lectora`
- `Amado/a hermano/a/lector/lectora`
- `Hermano lector`, `Hermana lectora`
- `Mi hermano en la fe`
- `Apreciado/a hermano/a/lector/lectora`

**NO dispara cuando:**
- Aparece dentro de `<blockquote>` o `<cite>` (citas bíblicas literales:
  Mt 18:15, 2 Ts 3:6-15, Flm 16).
- Es uso eclesiástico técnico: «restauración del hermano», «disciplina
  del hermano», «ganar al hermano».
- Es contexto biográfico-histórico: «entregó su hermana», «el cristo
  mormón como hermano espiritual de Lucifer».
- Es fórmula fija aceptada en cuerpo académico: «hermano en Cristo»,
  «hermano en la fe».

**Falsos positivos esperados eliminados:** 16 instancias.

### MAY-002 — Pronombres divinos mayuscularizados sin necesidad

**Cambio estructural:** la regla pasa de regex puro a check contextual
con marcador `__STRUCTURAL_CHECK__`. La lógica vive en
`detector._check_may002_pronouns()`.

**Algoritmo nuevo:**

```
Para cada pronombre {Él, Su, Sus, Suyo, Suya, Suyos, Suyas}:
  1. ¿Está en rango protegido (script/style/atributo)? → skip
  2. ¿Está dentro de <blockquote>...</blockquote>? → skip
  3. ¿Va precedido (look-behind 80 chars) por '.', '!', '?', '»', ':'?
     → skip (capital ortográfica de inicio de oración)
  4. ¿Es parte de tratamiento honorífico (Su Majestad, Su Santidad...)?
     → skip
  5. ¿Hay referente divino en los 250 chars previos
     (Dios, Cristo, Espíritu, Padre, Hijo, Señor, Jehová, YHWH,
      Salvador, Redentor, Mediador, Trinidad, ...)? → skip
  6. SI llegamos aquí → FLAG mid-oración con referente humano
```

**Vocabularios añadidos:**
- `DIVINE_REFERENTS` — 23 referentes divinos
- `HONORIFIC_PHRASES` — 6 tratamientos honoríficos

**Falsos positivos esperados eliminados:** 12 instancias (todos eran
capitales ortográficas de inicio de oración, no errores reverenciales).

### EXT-000 — Extranjerismos sin marcado `<i lang="">`

**Antes:** detectaba el término sin verificar si ya estaba marcado.

**Ahora con doble look-behind:**

1. **Look-behind 30 chars** por tag de apertura con lang:
   `<(i|em)\s+lang\s*=\s*["'][a-z]{2,3}["']\s*>\s*$`
   → si match, skip (término ya marcado correctamente).
2. **Look-behind 100 chars** por `<i>` o `<em>` abiertos sin cerrar:
   `opens > closes` → skip (dentro de marcado existente).

**Falsos positivos esperados eliminados:** 8 instancias (todos términos
ya correctamente marcados que el detector v1.1 volvía a flaguear).

### ORT-005 — Em dash con espacios

**Antes:** detectaba todo ` — ` (espacio + em dash + espacio) en texto.

**Ahora con excepciones para comentarios HTML estructurales:**

- `<!--[^>]*={3,}[^>]*—[^>]*={3,}` — separadores visuales tipo
  `<!-- ====== — TÍTULO — ====== -->`.
- `<!--\s*={3,}` y `={3,}\s*-->` — bordes de comentarios.
- `<!--[^>]*LECCIÓN[^>]*-->` — comentarios de sección.
- `<!--[^>]*UNIDAD[^>]*-->`
- `<!--[^>]*SECCIÓN[^>]*-->`
- `<!--[^>]*VÍA[^>]*-->`

**Falsos positivos esperados eliminados:** 13 instancias (separadores
visuales en comentarios estructurales).

---

## Verificación

El paquete incluye `test-fixtures/leccion-falsos-positivos-v12.html`, un
fixture específico que contiene los 30 falsos positivos típicos del v1.1
junto con 4 disparos reales esperados. La auditoría sobre este fixture
debe arrojar exactamente **8 hallazgos** (4 estructurales del fixture +
4 reales esperados), confirmando que los 30 FP están correctamente
filtrados:

```bash
python3 -m vma_audit audit test-fixtures/leccion-falsos-positivos-v12.html --verbose
```

---

## Cómo actualizar desde v1.1

Si ya usaste v1.1 sobre tu corpus:

1. Las **correcciones aplicadas a archivos** en v1.1 son válidas y se
   conservan. No hay que rehacer ningún cambio.
2. Sustituye la carpeta `audit-tool/` por la v1.2.
3. Vuelve a correr la auditoría:
   ```bash
   python3 -m vma_audit report ../verbum-manet-academy/courses/ \
     --output ./audit-reports-v12/
   ```
4. Compara: el número de hallazgos debe haber bajado de ~155 a <10.

Las correcciones documentales (eléntica con tilde, abreviaturas
castellanas, RVR60 marker, em dashes incisos) **no se revierten**: son
verdaderas correcciones, no falsos positivos. Solo se filtraron los FP
detectados por reglas demasiado amplias.

---

## Compatibilidad

- Python 3.10+ requerido (igual que v1.1).
- Sin nuevas dependencias externas.
- API CLI 100% compatible: todos los comandos `audit`, `fix`, `report`,
  `stats`, `list-rules` funcionan idénticamente.
- Estructura de JSON de salida sin cambios; solo varía la composición
  de los hallazgos.

---

*Verbum Domini manet in aeternum.*

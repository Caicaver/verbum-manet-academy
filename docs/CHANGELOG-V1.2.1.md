# CHANGELOG v1.2.1 — Hotfix tras auditoría real

**Fecha:** 17 de mayo de 2026
**Basado en:** análisis del reporte audit-report.html v1.2.0 sobre los 20 cursos
**Migración desde:** v1.2.0

---

## Resumen

La auditoría v1.2.0 sobre el corpus real (20 cursos, 21 archivos) reveló dos
familias de falsos positivos residuales: **19 EST-001 críticos** y **9
MAY-002 notas**. Todos ellos resultaron ser bugs del detector, no problemas
del corpus.

Esta v1.2.1 los corrige sin tocar la lógica de las reglas ya validadas.

**Resultado esperado:** 0 críticos, 0 errores, 0-3 notas residuales reales.

---

## Bug #1 — EST-001 disparaba 19 falsos positivos

### Causa raíz

El detector buscaba las cinco vías por dos patrones:
1. Texto exacto: `Formulación confesional`
2. ID exacto: `id="formulacion"`

El corpus real usa el patrón canónico documentado en STYLE-GUIDE §10.4:
```html
<h4 class="via__title">Formulación <em>confesional</em></h4>
```

El `<em>` en medio rompía el regex `\bFormulación\s+confesional\b`, y los
IDs canónicos del corpus son `id="via-3-3-formulacion"` con sufijos, no
`id="formulacion"` directo.

### Corrección

**`VIAS_KEYWORDS` ampliado** (en `detector.py`):
- Patrón con `<em>` intercalado: `\bFormulación\s+<em[^>]*>\s*confesional\s*</em>`
- ID con sufijos numéricos: `id\s*=\s*"[^"]*\bformulacion\b`
- Class con sufijos: `class\s*=\s*"[^"]*\bvia-formulacion\b`

**Check estructural reforzado** (en `_check_structural`):
- Si la página contiene `<ol class="vias">` Y el número de `<li class="via">`
  es exactamente `5 × número de <article class="lesson">`, considerar
  la estructura canónica como válida y NO disparar EST-001.

**Mensaje de hallazgo mejorado:** ahora reporta también los conteos
(`lecciones=N, ol.vias=M, li.via=K`) para diagnóstico inmediato.

---

## Bug #2 — MAY-002 disparaba 9 falsos positivos

### Análisis caso por caso del corpus

| # | Línea | Causa específica |
|---|---|---|
| 1 | 2239 | Cita himnológica «Sublime Gracia» — referente divino lejos |
| 2 | 2241 | Cita himnológica continuación |
| 3 | 713 | `<strong>(a)</strong> Su...` — enumeración no reconocida |
| 4 | 716 | `<strong>(b)</strong> Su...` — enumeración no reconocida |
| 5 | 720 | `<strong>(c)</strong> Su...` — enumeración no reconocida |
| 6 | 1843 | `<strong>(a)</strong> Su...` — enumeración no reconocida |
| 7 | 1850 | `<strong>(b)</strong> Su...` — enumeración no reconocida |
| 8 | 1518 | Tras `&laquo;` — entidad HTML no decodificada |
| 9 | 1780 | "Suárez" — apellido capturado como pronombre "Su" |

### Cinco correcciones aplicadas a `_check_may002_pronouns`

1. **Look-ahead negativo en el patrón del pronombre:**
   ```python
   r"\b(Él|Su|Sus|Suyo|Suya|Suyos|Suyas)"
   r"(?=\s|[.,;:!?»\"'\)\]])"
   ```
   Esto evita capturar "Su" dentro de "Suárez", "Sumario", "Suiza", etc.,
   porque ahora el pronombre debe ir seguido obligatoriamente de espacio
   o puntuación, no de letra.

2. **Decodificación de entidades HTML antes del análisis:**
   ```python
   import html as _html
   lookback_decoded = _html.unescape(lookback_raw)
   ```
   Así `&laquo;` se convierte en `«` y se reconoce como inicio de cita
   en el CHECK A (inicio de oración).

3. **Reconocimiento de marcadores de enumeración:**
   ```python
   enumeration_marker = re.compile(
       r"(?:\([a-z]\)|\([ivxlcdm]+\)|\d+\.|\d+\)|[a-z]\)|[•·])\s*$"
   )
   ```
   Patrones `(a)`, `(b)`, `1.`, `2)`, `(i)`, `(ii)`, bullets — se tratan
   como separadores de oración. La capital tras enumeración es ortográfica.

4. **Ventana de referente divino extendida a 400 chars** (de 250).
   Las citas himnológicas y poéticas tienen estructura que aumenta la
   distancia entre el referente divino explícito y los pronombres
   subsecuentes.

5. **Detección de cita abierta `«...»`:**
   ```python
   def in_quote_context(pos):
       last_open = content.rfind("«", 0, pos)
       last_close = content.rfind("»", 0, pos)
       return last_open > last_close and last_open != -1
   ```
   Si el pronombre está dentro de una cita literal (himno, poesía),
   NO disparar — se respeta el original.

---

## Verificación post-corrección

Sobre el fixture canónico `curso-canonico-v121.html`:
- **EST-001:** 0 hallazgos (correcto: estructura canónica detectada).
- **MAY-002:** 0 hallazgos sobre los 6 casos de FP intencionales.

Sobre el fixture aislado `curso-aislado-may002.html`:
- **MAY-002:** 1 hallazgo correcto sobre el único caso legítimo.

---

## Predicción sobre tu corpus real

Con v1.2.1, sobre los 20 cursos:

| Métrica | v1.2.0 (actual) | v1.2.1 (proyectado) |
|---|---|---|
| EST-001 críticos | 19 | **0** |
| MAY-002 notas | 9 | **0-2** |
| Total | 28 | **0-3** |

Los 0-2 MAY-002 residuales (si los hay) serían casos genuinos que
mereciera la pena revisar a ojo humano, no falsos positivos sistemáticos.

---

## Cómo aplicar

```powershell
# Sustituir audit-tool por v1.2.1
cd C:\Users\Calet\Documents\Proyectos
Remove-Item -Recurse -Force audit-tool
Expand-Archive vma-audit-tool-v1.2.1.zip -DestinationPath .

cd audit-tool
python3 -m vma_audit --version
# Salida: vma_audit 1.2.1

python3 -m vma_audit report ..\verbum-manet-academy\courses\ --output .\audit-reports-v121\
start .\audit-reports-v121\index.html
```

---

*Verbum Domini manet in aeternum.*

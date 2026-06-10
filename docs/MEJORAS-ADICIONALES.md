# MEJORAS-ADICIONALES.md

## Catálogo de mejoras futuras — Verbum Manet Academy

> **Objeto:** documentar las mejoras, refinamientos y extensiones detectadas a lo largo del desarrollo del proyecto pero **no implementadas en v5** por estar fuera del alcance del MVP, por requerir recursos no disponibles, o por necesitar validación previa en producción.
>
> **Versión del documento:** 1.0 · **Estado:** roadmap normativo
> **Fecha:** 17 de mayo de 2026 · **Cierre del plan v5:** este documento marca formalmente el cierre del Paso 10 del plan original.

---

## 0. Cómo leer este documento

Cada propuesta de mejora se documenta con esta ficha estandarizada:

```
ID:           código único (categoría-NNN)
Categoría:    contenido | técnico | diseño | UX | accesibilidad | comunidad | despliegue
Prioridad:    🔴 alta · 🟡 media · 🟢 baja · ⚪ opcional
Esfuerzo:     XS (<1h) · S (1–4h) · M (4–16h) · L (16–40h) · XL (>40h)
Impacto:      crítico · alto · medio · bajo
Dependencias: lo que debe estar resuelto antes
Riesgo:       qué puede romperse si se implementa mal
Estado:       pendiente | en estudio | rechazada (con razón)
```

**Filosofía rectora:** este documento **no es una lista de deseos**. Es un catálogo razonado donde cada entrada debe justificar por qué merece existir, qué problema concreto resuelve, y qué coste tiene implementarla. Las propuestas sin coste/beneficio claro se rechazan explícitamente, no se difieren indefinidamente.

---

## 0.1 Índice por categorías

1. Mejoras de **contenido** académico
2. Mejoras **técnicas** y de rendimiento
3. Mejoras de **diseño** visual
4. Mejoras de **experiencia de usuario** (UX)
5. Mejoras de **accesibilidad** (a11y)
6. Mejoras de **comunidad** y crecimiento
7. Mejoras de **despliegue** y operación
8. Propuestas **rechazadas** explícitamente
9. Roadmap sugerido por fases
10. Cómo proponer una mejora nueva

---

## 1. Mejoras de contenido académico

### CONT-001 — Pista de audio por lección (lectura en voz alta)

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | L (cada lección: ~15 min de grabación + edición + publicación) |
| **Impacto** | alto (accesibilidad, alcance a quienes prefieren audio) |
| **Dependencias** | Curso completo de las 143 lecciones; voz humana o TTS de calidad |
| **Riesgo** | Costo de almacenamiento de audio; mantenimiento ante actualizaciones doctrinales |
| **Estado** | en estudio |

Cada lección podría incluir un reproductor de audio integrado en el header, con la lectura completa del contenido. Beneficios: accesibilidad para invidentes y dislécticos; consumo durante traslados; refuerzo pedagógico audio-visual.

**Opciones técnicas:**
1. **Grabación humana** — calidad superior pero ~200 horas de trabajo para todo el corpus.
2. **TTS de alta calidad** (Eleven Labs, Google Cloud TTS, AWS Polly) — aceptable pero requiere supervisión por pronunciación de términos teológicos en latín/griego/hebreo.
3. **Híbrida** — TTS para versión preliminar, grabación humana progresiva para cursos más visitados.

**Decisión técnica si se implementa:** servir audios desde Cloudflare R2 (storage), no inline. Formato OGG Vorbis o Opus (mejor compresión que MP3, soporte universal). Bitrate 64–96 kbps mono.

### CONT-002 — Catequesis acumulada con repaso espaciado

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | M (banco de preguntas + algoritmo SM-2) |
| **Impacto** | alto (retención real del aprendizaje) |
| **Dependencias** | Sistema de Pomodoro ya en `study-panel.js` |
| **Estado** | pendiente |

Implementar **repaso espaciado** estilo Anki: el estudiante recibe preguntas de lecciones previas distribuidas en intervalos crecientes (1 día, 3 días, 7 días, 14 días, 30 días) según el algoritmo SuperMemo SM-2. Las preguntas vienen ya generadas por curso (cuestionarios existentes).

**Diseño:**
- Nueva sección "Repaso de hoy" en el Panel de Estudio.
- Estado de cada pregunta (intervalo, easiness factor) en memoria + export/import JSON.
- 10 preguntas/día como compromiso sostenible.

### CONT-003 — Variantes pedagógicas por nivel

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XL (rediseño curricular completo) |
| **Impacto** | medio |
| **Estado** | rechazada — razón: la doctrina reformada no admite "versiones simplificadas". Lo que existe ya tiene tres niveles implícitos: Fundacional, Intermedio, Avanzado, indicados en `COURSES_INDEX`. Una segunda capa de simplificación diluiría rigor sin ganancia clara. |

### CONT-004 — Bibliografía interactiva con preview

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | M |
| **Impacto** | medio |
| **Dependencias** | `data/bibliography.js` que aún no existe |
| **Estado** | pendiente |

Crear `data/bibliography.js` con esquema documentado en `STYLE-GUIDE` §13.1, y enriquecer cada referencia bibliográfica del corpus con tooltip al hover mostrando: autor, año, editorial, ISBN si está disponible, enlace a Monergism/CCEL/Ligonier cuando exista versión legítima en línea.

**Estimación de volumen:** ~150–200 entradas bibliográficas únicas en el corpus.

### CONT-005 — Mapa cronológico de la historia de la Iglesia

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | M (SVG interactivo + integración con cursos 6–9) |
| **Impacto** | alto pedagógico |
| **Estado** | pendiente |

Diagrama interactivo (SVG con D3.js o vanilla) que muestre los 2000 años de historia eclesiástica en un eje horizontal: eventos clave, concilios, reformadores, confesiones. Hacer clic en un nodo lleva a la lección correspondiente.

**Restricción técnica:** debe funcionar sin D3 si la dependencia es onerosa; vanilla SVG es preferible.

### CONT-006 — Glosario con audio de pronunciación

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | S (TTS para términos individuales) |
| **Impacto** | medio (latín, griego, hebreo) |
| **Estado** | pendiente |

Cada entrada del glosario podría incluir un botón de audio que pronuncia el término. Implementable con `SpeechSynthesisUtterance` (Web Speech API nativa) o con audios pregrabados servidos desde `audio/glossary/`.

### CONT-007 — Indización temática transversal

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | M |
| **Impacto** | alto (recuperación de información) |
| **Estado** | pendiente |

Generar un índice analítico que permita buscar **conceptos teológicos** a través de los 20 cursos: ej. "justificación" debería listar todas las lecciones donde aparece, con anchor directo. Implementable como:

1. Script Node.js que recorre todos los fragmentos extrayendo términos del glosario y referencias bíblicas.
2. Genera `data/index-tematico.js` con estructura `{ termino: [{lesson, anchor}], ... }`.
3. Nueva página `pages/indice.html` consume el índice.

---

## 2. Mejoras técnicas y de rendimiento

### TEC-001 — Service Worker para soporte offline real

| Campo | Valor |
|---|---|
| **Prioridad** | 🔴 alta |
| **Esfuerzo** | M (workbox o vanilla SW + estrategias de caché) |
| **Impacto** | crítico (PWA completa) |
| **Dependencias** | manifest.json funcional, iconos PWA finalizados |
| **Riesgo** | Bugs de caché que sirvan versiones obsoletas; requiere versionado disciplinado |
| **Estado** | pendiente |

Implementar `service-worker.js` con estrategias diferenciadas:

- **Cache-first** para shell (`index.html`, `css/`, `js/`, `data/`).
- **Network-first con fallback a cache** para cursos y páginas.
- **Cache durante la sesión** para fragmentos recién visitados.
- **Versionado de caché** con bump manual al desplegar.

**Esto convierte VMA en una PWA verdaderamente offline-first**, no solo instalable. Los usuarios podrán estudiar sin conexión cualquier curso visitado previamente.

### TEC-002 — Preload inteligente de cursos en hover

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XS (~30 líneas en `app.js`) |
| **Impacto** | medio (velocidad percibida) |
| **Estado** | pendiente |

Cuando el usuario hace `mouseenter` sobre un enlace de curso, `CourseLoader.preload(path)` carga el fragmento en caché antes del clic. Al hacer clic, la navegación es instantánea.

**Refinamiento:** desactivar preload en conexiones lentas (`navigator.connection.effectiveType === 'slow-2g' || '2g'`).

### TEC-003 — Compresión Brotli explícita en _headers

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XS |
| **Impacto** | medio (10–15% mejor compresión vs gzip) |
| **Estado** | pendiente verificación |

Cloudflare Pages aplica Brotli automáticamente, pero conviene verificar mediante DevTools que los archivos `.html`, `.css`, `.js` se sirven con `Content-Encoding: br`. Si no, configurar explícitamente.

### TEC-004 — Lazy-loading de imágenes con `loading="lazy"`

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XS |
| **Impacto** | bajo (el proyecto tiene pocas imágenes) |
| **Estado** | aplicar al añadir imágenes |

El atributo `loading="lazy"` ya está mandatado en `STYLE-GUIDE` §14.2. Verificar que se cumple en cualquier nueva imagen añadida. Auditable con el script de invariantes (`ARCHITECTURE.md` §18.5).

### TEC-005 — Web Worker para búsqueda en archivos grandes

| Campo | Valor |
|---|---|
| **Prioridad** | ⚪ opcional |
| **Esfuerzo** | M |
| **Impacto** | bajo (la búsqueda actual es ya instantánea con 80 términos) |
| **Estado** | rechazada — razón: el corpus de búsqueda es pequeño; mover a Worker añadiría complejidad sin beneficio medible. Considerar si el glosario supera los 500 términos. |

### TEC-006 — Tipografía precargada como `font-display: swap`

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | XS |
| **Impacto** | medio (FOIT → FOUT, percepción de velocidad) |
| **Estado** | verificar |

Asegurar que las fuentes Cormorant Garamond y Satoshi llevan `font-display: swap` en su carga. Esto evita el "flash of invisible text" (FOIT) sustituyéndolo por "flash of unstyled text" (FOUT), que es más amigable.

### TEC-007 — Validación automática con script de invariantes

| Campo | Valor |
|---|---|
| **Prioridad** | 🔴 alta |
| **Esfuerzo** | S |
| **Impacto** | alto (previene roturas) |
| **Dependencias** | `ARCHITECTURE.md` §18.5 ya tiene esbozo del script |
| **Estado** | pendiente |

Implementar `scripts/verify-invariants.js` según esquema de `ARCHITECTURE.md` §18.5 y conectar al pipeline CI:

```yaml
# .github/workflows/verify.yml
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: node scripts/verify-invariants.js
      - run: |
          python -m pip install --upgrade pip
          python -m vma_audit audit courses/ --strict
```

### TEC-008 — Migración progresiva de `<script>` a `<script type="module">`

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | M (requiere refactor de exposición global) |
| **Impacto** | bajo |
| **Estado** | rechazada — razón: el patrón global `window.COURSES_INDEX` es legible desde fragmentos HTML inyectados. Migrar a módulos ES6 introduciría complicaciones sin beneficio claro. Mantener `<script defer>`. |

### TEC-009 — Test runner mínimo sin dependencias

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | M |
| **Impacto** | medio (regression suite) |
| **Estado** | pendiente |

Crear `tests/` con tests vanilla JS que verifiquen:
- Router resuelve correctamente todas las 26 rutas (6 estáticas + 20 cursos).
- `CourseLoader.load()` maneja errores correctamente.
- Búsqueda accent-insensitive funciona en `COURSES_INDEX` y `GLOSSARY`.
- Export/import de progreso es reversible.

Usar `<script>` simple corriendo en navegador, o Playwright para E2E. **No introducir Jest/Vitest** (violaría el Principio 2).

---

## 3. Mejoras de diseño visual

### DIS-001 — Tema "manuscrito antiguo" como tercera variante

| Campo | Valor |
|---|---|
| **Prioridad** | ⚪ opcional |
| **Esfuerzo** | M |
| **Impacto** | bajo (placer estético) |
| **Estado** | en estudio |

Añadir un tercer tema más allá de claro/oscuro: "Pergamino", con paleta cream profundo, texto en tinta negra y bordes con textura. Para usuarios que prefieren experiencia de manuscrito.

**Implementación:** añadir `data-theme="pergamino"` con su set de tokens en `styles.css` (los aliases ya están abstractos).

### DIS-002 — Ilustraciones de cabecera por segmento

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | M (cuatro ilustraciones SVG editoriales) |
| **Impacto** | medio (identidad visual) |
| **Estado** | pendiente Claude Design |

Cada uno de los cuatro segmentos podría tener una ilustración SVG editorial en la cabecera de su sección en `pages/courses.html`:

- **Segmento I (Fundamentos):** columna jónica con texto abierto.
- **Segmento II (Historia):** línea cronológica con figuras tipográficas.
- **Segmento III (Sistemática):** árbol doctrinal estructurado.
- **Segmento IV (Aplicada):** mano sosteniendo Biblia abierta.

Estilo: monocromáticas en `currentColor`, ~120 KB SVG cada una.

### DIS-003 — Tipografía expresiva en doxologías

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XS |
| **Impacto** | medio (énfasis visual del cierre pastoral) |
| **Estado** | pendiente |

Las doxologías al final de cada lección (`.vma-doxology`) podrían recibir tratamiento tipográfico distintivo: Cormorant Italic 600, alineación centrada, color `--vma-gold-700`, espaciado vertical generoso (`margin-block: var(--space-6)`), pequeño ornamento decorativo (`✦` o filete dorado) antes del cierre latino.

### DIS-004 — Estados visuales de progreso en `pages/courses.html`

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | alto (motivación pedagógica) |
| **Dependencias** | sistema de progreso del Panel de Estudio |
| **Estado** | pendiente |

Cada tarjeta de curso en el catálogo muestra:
- Barra de progreso (0–100%) basada en lecciones marcadas.
- Estado: "Sin iniciar" / "En curso" / "Completado".
- Última lección visitada (si aplicable).

Visualmente: filete gold a la izquierda de la card si está en curso, ✓ gold a la derecha si está completado.

### DIS-005 — Modo lectura sin distracciones

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | medio |
| **Estado** | pendiente |

Atajo `R` o botón en el header que oculta navegación lateral, footer, y maximiza el área de lectura. Tipografía aumenta 1 nivel. Ideal para sesiones largas de estudio.

### DIS-006 — Modo impresión (CSS `@media print`)

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | medio (estudiantes que imprimen para anotar) |
| **Estado** | pendiente |

Definir reglas `@media print` que:
- Oculten header, footer, navegación, tooltips, panel de estudio.
- Conviertan a paleta monocromática.
- Aseguren saltos de página correctos entre vías.
- Incluyan referencias bibliográficas completas como notas al pie automáticas.
- Añadan footer con URL del curso y fecha de impresión.

---

## 4. Mejoras de experiencia de usuario (UX)

### UX-001 — Anotaciones inline en lecciones

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | L |
| **Impacto** | alto |
| **Riesgo** | persistencia compleja sin localStorage |
| **Estado** | pendiente |

Permitir al usuario seleccionar texto y añadir nota lateral. Las notas se almacenan en memoria + export/import JSON. Indicador visual sutil al margen del párrafo con nota.

### UX-002 — Marcadores ("bookmarks") con título personalizado

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | medio |
| **Estado** | pendiente |

El usuario puede marcar cualquier sección con un título descriptivo. Los marcadores se listan en el Panel de Estudio con búsqueda rápida y orden por curso/fecha. Persistencia vía JSON export.

### UX-003 — Notificaciones de progreso ("racha de estudio")

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | S |
| **Impacto** | bajo |
| **Estado** | en estudio |

Mensaje sutil al iniciar sesión: "Llevas X días consecutivos de estudio". Sin gamificación agresiva, solo refuerzo positivo discreto.

**Restricción:** la racha vive en memoria y export JSON. Sin localStorage, requiere que el usuario importe el archivo cada sesión, lo cual reduce el atractivo del feature.

### UX-004 — Discusión teológica asíncrona externa

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | M (integración externa) |
| **Impacto** | medio |
| **Estado** | en estudio |

Enlaces directos a un foro externo (Discourse, Discord, Telegram) donde los estudiantes puedan discutir cada lección. **Mantener fuera del proyecto** para preservar el principio de privacidad y simplicidad arquitectónica. La integración es solo un link en el footer de cada lección.

### UX-005 — Compartir cita destacada

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | S |
| **Impacto** | medio (alcance social) |
| **Estado** | pendiente |

Al seleccionar una cita y pulsar un botón "Compartir", se genera una imagen (canvas API) con la cita, el nombre del curso y el branding de VMA, lista para compartir en redes. Sin tracking, sin pixels.

### UX-006 — Modo "examen" para los cuestionarios

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | medio |
| **Estado** | pendiente |

Los cuestionarios actuales son por `<details>` colapsable. Añadir un modo "examen" que:
- Oculta las respuestas hasta enviar.
- Cronómetro opcional.
- Resultado final con porcentaje de aciertos.
- Botón para revisar respuestas erradas.

### UX-007 — Tour guiado para primer uso

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | M |
| **Impacto** | medio |
| **Estado** | pendiente |

Primera visita al sitio: overlay opcional que explica los elementos clave (búsqueda Ctrl+K, toggle de tema, Panel de Estudio, exportación de progreso). Sin librerías externas; vanilla JS + CSS.

**Limitación:** sin localStorage, el "primer uso" no se puede detectar fiablemente. Se podría mostrar siempre con opción "no volver a mostrar en esta sesión".

### UX-008 — Pomodoro persistente entre páginas

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | medio |
| **Estado** | completado (v8) |

Motor migrado a singleton en `js/study-panel.js` (cómputo por timestamp); persiste entre navegaciones bajo el shell de hash único. Indicador de tiempo restante en el header (`#pomodoro-indicator`, render por `engine.onChange`) y chime Web Audio al cerrar ciclo (§8.bis). A11Y-005 (aria-live al finalizar) queda cubierto por `announcePomo`. Sin `STATE_VERSION` nuevo: el tiempo restante es estado efímero del engine. La no-persistencia tras recargar es por diseño (sin localStorage).

---

## 5. Mejoras de accesibilidad

### A11Y-001 — Auditoría Axe / Lighthouse Accessibility

| Campo | Valor |
|---|---|
| **Prioridad** | 🔴 alta |
| **Esfuerzo** | S |
| **Impacto** | alto |
| **Estado** | pendiente |

Ejecutar **Axe DevTools** y **Lighthouse Accessibility** sobre cada una de las 6 rutas estáticas + 3 cursos representativos. Objetivo: 100% en Lighthouse Accessibility. Documentar resultados en `docs/A11Y-AUDIT.md`.

### A11Y-002 — Navegación por teclado completa en modal de búsqueda

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | alto |
| **Estado** | verificar |

Confirmar que el modal Ctrl+K cumple:
- Foco automático en el input al abrir.
- Esc cierra el modal y devuelve foco al elemento previo.
- Flechas arriba/abajo navegan resultados.
- Enter selecciona resultado activo.
- Tab navega entre secciones del modal sin salirse.

### A11Y-003 — Lectores de pantalla — testing con NVDA y VoiceOver

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | M |
| **Impacto** | alto (usuarios invidentes reales) |
| **Estado** | pendiente |

Probar con **NVDA** (Windows) y **VoiceOver** (macOS/iOS) navegación completa de:
- Página de inicio.
- Una lección completa con sus cinco vías.
- Modal de búsqueda.
- Panel de Estudio.

Documentar issues encontrados y solucionarlos.

### A11Y-004 — Marcado de citas patrísticas con `lang` apropiado

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | medio |
| **Estado** | pendiente (parcialmente cubierto por `vma_audit` EXT-*) |

Auditar el corpus completo para asegurar que **toda cita en latín** lleve `lang="la"`, **toda cita en griego** lleve `lang="grc"`, **toda cita en hebreo** lleve `lang="he"`. Los lectores de pantalla cambian el sintetizador de voz según el `lang`.

### A11Y-005 — Aria live regions para Pomodoro

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XS |
| **Impacto** | medio |
| **Estado** | pendiente |

Al finalizar un periodo Pomodoro, anunciar el cambio con `<div aria-live="polite">` para que el lector de pantalla lo notifique al usuario invidente.

### A11Y-006 — Reduced motion respetado en todas las animaciones

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | XS |
| **Impacto** | alto (vestibular sensitivity) |
| **Estado** | verificar |

Confirmar que `@media (prefers-reduced-motion: reduce)` desactiva:
- Animaciones shimmer del skeleton loader.
- Transiciones de fade en navegación entre fragmentos.
- Hover effects con `transform`.
- Cualquier auto-scroll suave.

---

## 6. Mejoras de comunidad y crecimiento

### COM-001 — Repositorio público en GitHub con CONTRIBUTING.md

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | S |
| **Impacto** | alto (comunidad) |
| **Estado** | pendiente |

Hacer público el repositorio una vez completado. Añadir:
- `CONTRIBUTING.md` con guía clara de cómo proponer mejoras de contenido o código.
- Plantillas de issue: "Sugerir mejora doctrinal", "Reportar error tipográfico", "Proponer feature".
- `CODE_OF_CONDUCT.md` con tono cristiano-reformado claro pero no sectario.
- Restricción explícita: contribuciones doctrinales solo de tradición reformada confesional.

### COM-002 — Hoja de ruta pública (`ROADMAP.md`)

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XS |
| **Impacto** | medio |
| **Estado** | pendiente |

Subconjunto público de este documento (`MEJORAS-ADICIONALES.md`) listando próximos pasos visibles para potenciales colaboradores.

### COM-003 — Boletín por email (newsletter)

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | M |
| **Impacto** | medio |
| **Estado** | en estudio |

Boletín mensual con: nuevos cursos publicados, mejoras destacadas, una lección recomendada del mes. **Sin tracking**. Servicio externo (Buttondown, Listmonk self-hosted). Suscripción double-opt-in.

### COM-004 — Versión imprimible (PDF) del corpus completo

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | M |
| **Impacto** | alto (zonas con conexión limitada) |
| **Estado** | pendiente |

Generar PDF unificado de los 20 cursos (~700 páginas) descargable desde el catálogo. Bondades:
- Estudio offline sin requerir PWA.
- Distribución por USB / WhatsApp.
- Impresión en talleres de imprenta para uso comunitario.

**Implementación:** Pandoc + LaTeX para tipografía editorial. CSS `@media print` aprovechable.

### COM-005 — Versión EPUB para lectores de e-book

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | S |
| **Impacto** | medio |
| **Estado** | pendiente |

Misma generación que PDF, pero formato EPUB. Pandoc lo soporta nativamente. Distribución por Project Gutenberg, archive.org, OpenLibrary.

### COM-006 — Traducción a portugués (PT-BR)

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XL (143 lecciones traducidas) |
| **Impacto** | alto (300M hablantes) |
| **Dependencias** | colaborador bilingüe + revisor doctrinal |
| **Estado** | en estudio |

Brasil tiene una tradición reformada robusta (IPB, Fiel) y carece de recursos formativos gratuitos comparables. Una versión PT-BR multiplicaría el alcance del proyecto.

**Restricción técnica:** la SPA debe soportar `lang` switching. Arquitectura propuesta: subdominio `pt.verbummanet.app` con su propio repositorio de fragmentos. Mantener el shell `index.html` único pero parametrizable.

### COM-007 — Versión en inglés

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XL |
| **Impacto** | bajo |
| **Estado** | rechazada — razón: el inglés tiene abundancia de recursos reformados gratuitos (Reformed.org, Monergism, Ligonier en inglés, Banner of Truth). Nuestro nicho es claramente hispano. Recursos limitados se enfocan en idiomas con escasez. |

---

## 7. Mejoras de despliegue y operación

### OPS-001 — Pipeline CI completo en GitHub Actions

| Campo | Valor |
|---|---|
| **Prioridad** | 🔴 alta |
| **Esfuerzo** | S |
| **Impacto** | alto |
| **Estado** | pendiente |

Workflow que en cada push/PR:
1. Ejecute `vma_audit audit courses/ --strict`.
2. Ejecute `node scripts/verify-invariants.js`.
3. Compruebe HTML válido con `html-validate`.
4. Compruebe enlaces rotos con `lychee`.
5. Ejecute Lighthouse CI sobre preview deploy.

Falla el CI bloquea el merge a `main`.

### OPS-002 — Preview deploys por PR

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | XS |
| **Impacto** | alto (revisión visual de cambios) |
| **Estado** | nativo de Cloudflare Pages |

Cloudflare Pages crea automáticamente un preview deploy por cada PR/branch. Verificar que está activado. Esto permite revisar visualmente cambios doctrinales antes de mergear.

### OPS-003 — Monitorización de uptime sin tracker

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | XS |
| **Impacto** | medio |
| **Estado** | pendiente |

Servicios como **UptimeRobot** o **Better Stack** monitorean disponibilidad cada 5 minutos sin instalar nada en el sitio. Alerta por email si cae más de 2 minutos.

### OPS-004 — Backup periódico del corpus

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | XS |
| **Impacto** | crítico (continuidad) |
| **Estado** | pendiente |

Aunque el repositorio Git ya es backup, configurar:
- Mirror diario a otro proveedor (Codeberg, GitLab).
- Snapshot mensual a archivo ZIP comprimido en almacenamiento personal.

### OPS-005 — Dominio propio + SSL

| Campo | Valor |
|---|---|
| **Prioridad** | 🟡 media |
| **Esfuerzo** | XS |
| **Impacto** | alto (legitimidad y permanencia) |
| **Estado** | pendiente |

Adquirir `verbummanet.org` o `verbummanetacademy.org` y apuntar a Cloudflare Pages. SSL automático. Renovación anual.

**Estimación de costo:** ~10 USD/año por dominio.

### OPS-006 — Métricas privadas con Plausible / Umami (opcional)

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | S |
| **Impacto** | medio (visibilidad de uso) |
| **Estado** | en estudio |

**Si** se decide medir uso (no es obligatorio, viola parcialmente el Principio 1 de privacidad estricta), usar analítica self-hosted respetuosa con la privacidad: **Plausible** (de pago) o **Umami** (open source, self-hosted en Docker).

**Decisión pendiente:** ¿queremos saber cuántas personas usan el sitio? Hay argumentos a favor (validar el esfuerzo, dirigir mejoras) y en contra (compromete el principio de privacidad total).

### OPS-007 — Política de versionado semántico para el corpus

| Campo | Valor |
|---|---|
| **Prioridad** | 🟢 baja |
| **Esfuerzo** | XS |
| **Impacto** | bajo |
| **Estado** | pendiente |

Adoptar SemVer para el corpus:
- **PATCH** (1.0.x): correcciones tipográficas, ortotipográficas, sin cambio doctrinal.
- **MINOR** (1.x.0): nuevas lecciones, glosas, recursos adicionales.
- **MAJOR** (x.0.0): cambios estructurales del corpus, revisiones doctrinales significativas.

Etiquetar releases en Git con `v1.0.0`, `v1.1.0`, etc.

---

## 8. Propuestas rechazadas explícitamente

Para preservar la integridad del proyecto y evitar conversaciones repetidas, se rechazan formalmente las siguientes propuestas:

| ID | Propuesta | Razón del rechazo |
|---|---|---|
| **R-001** | Comentarios bajo cada lección | Violaría el Principio 1 (sin terceros). El diálogo se da en foros externos. |
| **R-002** | Sistema de cuentas de usuario | Violaría el Principio 3 (estado en memoria). El usuario controla sus datos vía JSON export/import. |
| **R-003** | Anuncios o monetización | Contradice la misión (gratuidad como dignidad). |
| **R-004** | Cursos de tradiciones no reformadas | El proyecto es confesional. Otras tradiciones tienen sus propios recursos. |
| **R-005** | Modo "lite" en HTML simplificado | Diluye rigor sin ganar audiencia real. Quien busca contenido serio acepta el formato actual. |
| **R-006** | Versión React/Vue/Svelte | Violaría el Principio 2 (sin frameworks). Discusión cerrada. |
| **R-007** | TypeScript | Requiere build, violaría Principio 2. |
| **R-008** | Migración a Astro / Next | Mismo argumento. |
| **R-009** | Chat con IA integrada | Compromete privacidad, introduce dependencia externa, riesgo doctrinal (modelos pueden generar contenido falso). |
| **R-010** | Sistema de "puntos" gamificado | Trivializa la formación teológica. La motivación debe ser doctrinal, no lúdica. |
| **R-011** | Sincronización entre dispositivos | Requiere servidor; viola el Principio 1. Alternativa: export/import JSON. |
| **R-012** | Versión en inglés | Mercado ya saturado de recursos gratuitos (ver COM-007). |

---

## 9. Roadmap sugerido por fases

Las mejoras se pueden agrupar en cuatro fases ordenadas por prioridad y dependencias:

### Fase 1 — Cierre del MVP (próximos 1–3 meses)

**Objetivo:** estado de producción estable y profesional.

| ID | Tarea | Prioridad |
|---|---|---|
| OPS-001 | Pipeline CI en GitHub Actions | 🔴 |
| OPS-002 | Verificar preview deploys de Cloudflare | 🟡 |
| OPS-003 | Monitorización uptime | 🟡 |
| OPS-005 | Adquirir dominio propio | 🟡 |
| TEC-001 | Service Worker offline-first | 🔴 |
| TEC-007 | Script verify-invariants.js | 🔴 |
| A11Y-001 | Auditoría Lighthouse Accessibility | 🔴 |
| DIS-004 | Estados de progreso en catálogo | 🟡 |

### Fase 2 — Consolidación pedagógica (3–6 meses)

**Objetivo:** experiencia de aprendizaje completa.

| ID | Tarea | Prioridad |
|---|---|---|
| CONT-002 | Repaso espaciado SM-2 | 🟡 |
| CONT-004 | Bibliografía interactiva | 🟡 |
| CONT-005 | Mapa cronológico interactivo | 🟡 |
| CONT-007 | Indización temática transversal | 🟡 |
| UX-001 | Anotaciones inline | 🟡 |
| UX-002 | Marcadores con título | 🟡 |
| UX-006 | Modo examen para cuestionarios | 🟡 |
| UX-008 | Pomodoro persistente | 🟡 |
| DIS-005 | Modo lectura sin distracciones | 🟡 |
| DIS-006 | CSS de impresión | 🟡 |

### Fase 3 — Comunidad y alcance (6–12 meses)

**Objetivo:** abrir el proyecto a colaboración y nuevos formatos.

| ID | Tarea | Prioridad |
|---|---|---|
| COM-001 | Repositorio público + CONTRIBUTING | 🟡 |
| COM-002 | ROADMAP.md público | 🟢 |
| COM-004 | Versión PDF descargable | 🟡 |
| COM-005 | Versión EPUB | 🟢 |
| CONT-001 | Audio por lección (TTS inicial) | 🟡 |
| A11Y-003 | Testing real con NVDA/VoiceOver | 🟡 |

### Fase 4 — Expansión internacional (12+ meses)

**Objetivo:** salto a otros idiomas hispanos / portugueses.

| ID | Tarea | Prioridad |
|---|---|---|
| COM-006 | Traducción a portugués | 🟢 |
| CONT-001 | Audio con grabación humana | 🟡 |

---

## 10. Cómo proponer una mejora nueva

Cualquier nueva mejora propuesta a este catálogo debe pasar por estos cuatro filtros antes de incorporarse:

### Filtro 1 — Coherencia con los principios

¿La mejora respeta los cuatro principios de `ARCHITECTURE.md` §2?
- ✅ Estática primero
- ✅ Sin frameworks ni build
- ✅ Sin almacenamiento de navegador
- ✅ Contenido como datos / presentación como código

Si viola alguno, **rechazar** explícitamente con razón documentada (ver §8).

### Filtro 2 — Coherencia doctrinal

¿La mejora se alinea con la tradición reformada confesional? Si introduce ambigüedad doctrinal o relativiza alguna posición confesional, **rechazar**.

### Filtro 3 — Análisis coste/beneficio

Estimar honestamente:
- **Esfuerzo** (XS / S / M / L / XL).
- **Impacto** (crítico / alto / medio / bajo).
- **Riesgo** (qué puede romperse).
- **Mantenimiento** (¿requiere atención continua?).

Si el esfuerzo es L o XL pero el impacto es bajo, **diferir** o **rechazar**.

### Filtro 4 — Fit con el roadmap

¿Encaja en alguna de las cuatro fases del §9? Si no, **postergar** hasta que su fase llegue.

### Plantilla para nueva propuesta

```markdown
### XXX-NNN — Título descriptivo

| Campo | Valor |
|---|---|
| **Prioridad** | 🔴 / 🟡 / 🟢 / ⚪ |
| **Esfuerzo** | XS / S / M / L / XL |
| **Impacto** | crítico / alto / medio / bajo |
| **Dependencias** | qué debe estar resuelto antes |
| **Riesgo** | qué puede romperse |
| **Estado** | pendiente / en estudio / rechazada (con razón) |

[Descripción del problema que resuelve]

[Diseño propuesto a alto nivel]

[Restricciones técnicas o doctrinales]
```

---

## Cierre

Este documento es la **memoria del proyecto** sobre todo lo que se consideró pero no se hizo en v5. Cada mejora aquí tiene su lugar razonado en el roadmap o su rechazo explícito.

La fortaleza del proyecto no está en lo que añade, sino en **lo que decide no añadir**. La lista de propuestas rechazadas (§8) es tan importante como la lista de pendientes: muestra qué cosas, por buenas que parezcan, no encajan en la visión.

Verbum Manet Academy crecerá no por acumulación de features, sino por refinamiento de las pocas decisiones correctas que ya tomó. Este documento es la guía para que ese crecimiento sea ordenado.

*Verbum Domini manet in aeternum.*

— Fin del documento —

<div align="center">

# Verbum Manet Academy

### Seminario reformado en línea, de acceso libre, en español

*Verbum Domini manet in aeternum* — Isaías 40:8

[![License: CC BY-SA 4.0](https://img.shields.io/badge/Contenido-CC%20BY--SA%204.0-blue.svg)](LICENSE-CONTENT)
[![License: MIT](https://img.shields.io/badge/Código-MIT-green.svg)](LICENSE-CODE)
[![Tradición](https://img.shields.io/badge/Tradici%C3%B3n-Reformada%20confesional-c9a84c)](docs/STYLE-GUIDE-CONTENT.md)
[![Status](https://img.shields.io/badge/Estado-En%20desarrollo-orange)]()

</div>

---

## Qué es esto

**Verbum Manet Academy** es una plataforma de formación teológica reformada en español, distribuida como aplicación web estática instalable (PWA). El proyecto ofrece **20 cursos** estructurados en **135 lecciones**, cubriendo cuatro segmentos:

- **Segmento I** — Fundamentos y herramientas (Prolegómenos) · 5 cursos
- **Segmento II** — Historia de la Iglesia · 4 cursos
- **Segmento III** — Teología sistemática · 6 cursos
- **Segmento IV** — Teología aplicada · 5 cursos

> El conteo de **135 lecciones** está verificado por `validar-corpus.js` sobre los 20 archivos (no es una estimación). Sustituye a cifras históricas previas (143/67/74) que circulaban sin reverificar.

Cada lección sigue la estructura canónica de **las cinco vías pedagógicas**, en orden fijo:

1. **Formulación confesional** — anclaje en Westminster, Heidelberg, Belga, Dort y la Confesión Bautista de 1689.
2. **Dimensión eléntica** — refutación reformada de errores históricos y contemporáneos.
3. **Perspectiva de teología bíblica** — recorrido por la historia de la redención.
4. **Aplicación catequética** — vinculación con catecismos clásicos.
5. **Aplicación doxológica** — cierre en adoración trinitaria.
   *(Los cursos del Segmento II usan la variante «Culminación doxológica» para esta quinta vía.)*

---

## Acceso al sitio

El sitio se sirve desde Cloudflare Pages:

🌐 **[verbummanet.academy](https://verbummanet.academy)** *(próximamente)*

También es **instalable como aplicación** en Android, iOS, Windows y macOS desde el propio navegador. Funciona **offline** una vez visitados los cursos.

---

## Principios del proyecto

1. **Gratuidad como dignidad.** El contenido es libre y siempre lo será. La presentación cuidada no contradice la gratuidad; la encarna.
2. **Privacidad estricta.** Sin tracking, sin cookies de aplicación, sin terceros. Tu progreso vive en tu navegador y puedes exportarlo o importarlo como archivo JSON.
3. **Rigor confesional.** Tradición reformada clásica (Westminster, Heidelberg, Belga, Dort, 1689). Ni interconfesional, ni denominacional sectario.
4. **Permanencia técnica.** HTML/CSS/JS vainilla, sin frameworks, sin build. El código que ves es el código que el navegador ejecuta. Diseñado para durar décadas.

---

## Cómo funciona la SPA

`index.html` es el **único punto de entrada**. Contiene el shell visual (header con logotipo SVG, navegación, footer), los overlays (búsqueda, panel Pomodoro, tooltip de glosario) y el contenedor de render dinámico `<main id="main-content">`.

**Enrutamiento por hash** (`js/app.js`). Combina rutas estáticas y rutas de curso:

- **Nueve rutas estáticas** → fragmentos en `pages/`:
  `#/` · `#/about` · `#/courses` · `#/glossary` · `#/panel` · `#/creed` · `#/library` · `#/languages` · `#/resources`.
- **Rutas de curso**, generadas en arranque desde `COURSES_INDEX`:
  `#/{id}` → `./courses/{segment}/{file}`.

En cada `hashchange`, el router distingue **rutas SPA** (`#/algo`, recargan el fragmento) de **anclas internas** (`#unidad-1`, solo hacen scroll dentro del fragmento actual).

**Orden de carga de scripts** (definido en `index.html`, es deliberado):

1. `data/courses-index.js` y `data/glossary.js` — scripts **clásicos** (sin `type="module"`); exponen `COURSES_INDEX` y `GLOSSARY` como globales accesibles desde los fragmentos.
2. `js/courseLoader.js` → `js/study-panel.js` → `js/app.js` — con `defer`, en ese orden.

**Carga de fragmentos** (`js/courseLoader.js`). Hace `fetch()` del fragmento, lo cachea en un `Map` en memoria (navegación instantánea al revisitar), muestra un *skeleton* con `aria-busy` durante la carga y un estado de error si falla.

**Fragmentos.** Cada archivo en `pages/` y `courses/segment-N/` contiene **solo** el HTML interno de la vista —sin `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` ni `<script>`— y usa entidades HTML para los caracteres en español.

---

## Validadores Node

Scripts de verificación de integridad. No requieren dependencias externas (Node ≥ 18).

- **`validar-fuentes.js`** — verifica los bloques `<aside class="lesson__source">` (presencia y número de fuentes).
- **`validar-corpus.js`** — superconjunto del anterior. Por cada curso comprueba: fragmento puro; nº de lecciones; ≥ 3 fuentes por lección; las cinco vías en orden (tolerando el prefijo «Vía N ·» y las variantes editoriales conocidas); cuestionario(s) por unidad; rúbrica de 5 criterios × 4 ó 5 columnas; navegación entre cursos; cierre latino; balance de etiquetas; y los cross-checks de datos (`id` ↔ hash, `data-glossary-term` ↔ `GLOSSARY`). Emite el **conteo total de lecciones del corpus**.

```bash
# Validar todo el corpus (gate previo al despliegue)
node validar-corpus.js

# Validar un archivo concreto
node validar-corpus.js courses/segment-1/introduccion-antiguo-testamento.html

# Salida JSON para CI
node validar-corpus.js --json
```

El validador devuelve código de salida **1** si hay hallazgos críticos, **0** si no — apto para usarse como *gate* en CI o pre-deploy.

---

## Stack técnico

- **HTML5 + CSS3** con tokens OKLCH (`--vma-*`)
- **JavaScript ES2022 vanilla** (sin frameworks, sin build)
- **Web App Manifest** para instalabilidad PWA
- **Cloudflare Pages** para distribución global

**Sin React, sin Vue, sin Astro, sin Next, sin TypeScript, sin Sass, sin Webpack.** El proyecto cumple [cuatro principios arquitectónicos](docs/ARCHITECTURE.md#2-principios-arquitectónicos) inviolables.

---

## Estructura del repositorio

```
verbum-manet-academy/
├── index.html              Shell único de la SPA
├── manifest.json           Web App Manifest (PWA)
├── 404.html                Página de fallback
├── _headers _redirects     Configuración Cloudflare
├── css/                    Sistema de diseño
├── js/                     Router (app.js), carga (courseLoader.js), estudio (study-panel.js)
├── data/                   Índice de cursos (courses-index.js) + glosario (glossary.js)
├── pages/                  Páginas estáticas (home, about, courses, glossary, panel, creed, library, languages, resources)
├── courses/                20 cursos en 4 segmentos
│   ├── segment-1/   Fundamentos    (5 cursos · 47 lecciones)
│   ├── segment-2/   Historia       (4 cursos · 36 lecciones)
│   ├── segment-3/   Sistemática    (6 cursos · 32 lecciones)
│   └── segment-4/   Aplicada       (5 cursos · 20 lecciones)
├── assets/                 Logotipo
├── icons/                  Set PWA completo
└── docs/                   Documentación técnica
```

Detalle en [`ARCHITECTURE.md`](docs/ARCHITECTURE.md#4-topología-de-archivos).

---

## Uso local

La SPA carga los fragmentos con `fetch()`, de modo que **no funciona abriendo `index.html` con `file://`** (lo bloquea la política CORS del navegador). Hay que servirla por HTTP:

```bash
# Python (incluido en macOS/Linux y disponible en Windows)
python -m http.server 8000

# Node (si lo tienes)
npx serve .
```

Luego visita `http://localhost:8000`. Conviene verificar la navegación entre rutas, el modo claro/oscuro, la búsqueda (Ctrl+K) y el menú móvil a 375 px.

---

## Contribuir

Las contribuciones son bienvenidas dentro del marco confesional del proyecto. Lee [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de proponer cambios. En particular:

- Las contribuciones doctrinales deben alinearse con la tradición reformada confesional clásica.
- Las contribuciones técnicas deben respetar los [cuatro principios arquitectónicos](docs/ARCHITECTURE.md#2-principios-arquitectónicos).
- Toda contribución editorial debe pasar la [auditoría del style guide](docs/STYLE-GUIDE-CONTENT.md) y `node validar-corpus.js` sin hallazgos críticos.

---

## Licencias

Doble licencia explícita:

- **Contenido teológico** (cursos, lecciones, glosario, documentación): [**CC BY-SA 4.0**](LICENSE-CONTENT). Puedes copiarlo, redistribuirlo, traducirlo y adaptarlo, atribuyendo la fuente y manteniendo la misma licencia abierta.
- **Código fuente** (HTML, CSS, JavaScript, herramientas Node): [**MIT**](LICENSE-CODE). Puedes hacer lo que quieras con él.

Ambas licencias preservan el espíritu de gratuidad del proyecto.

---

## Equipo

**Coordinador editorial y arquitectura web**
Hno. Calet Cáceres Vergara — Fundador
[@cicv.94](https://instagram.com/cicv.94)

Estudioso apasionado de la Palabra de Dios, con formación en Administración y Educación. Convencido de que la teología reformada y las nuevas tecnologías pueden converger para llevar instrucción bíblica a toda persona de habla hispana — sin costo, sin barreras, sin fronteras — puestas al servicio de la gloria de Dios.

---

## Cita

Si usas el proyecto académicamente o en publicaciones, considera citarlo así:

```
Cáceres Vergara, C. (2026). Verbum Manet Academy: Seminario reformado en línea.
https://verbummanet.academy
```

---

<div align="center">

*Soli Deo gloria.*

</div>

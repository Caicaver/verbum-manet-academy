# ARCHITECTURE.md

## Arquitectura técnica de Verbum Manet Academy

> **Objeto:** documentar la arquitectura de la plataforma de modo que cualquier persona —el autor en una sesión futura, un colaborador externo, o una herramienta automatizada— pueda comprender el sistema sin tener que reverse-engineering del código.
>
> **Versión:** 1.0 · **Estado:** normativo · **Fecha:** 17 de mayo de 2026.
>
> **Convención:** el documento sigue las decisiones del prompt v4 y del `STYLE-GUIDE-CONTENT.md` v1.1. Si esta arquitectura discrepa de cualquier código presente en el repositorio, **prevalece el código**; este documento debe actualizarse para reflejarlo.

---

## 0. Índice

1. Visión general
2. Principios arquitectónicos
3. Stack tecnológico
4. Topología de archivos
5. Arquitectura de runtime
6. Sistema de routing
7. Carga dinámica de fragmentos
8. Sistema de estado
9. Sistema de datos
10. Sistema de diseño
11. Sistema PWA
12. Pipeline de despliegue
13. Modelo de extensibilidad
14. Restricciones absolutas
15. Diagramas de flujo
16. Glosario de términos arquitectónicos
17. Anexo — convenciones de marcado HTML
18. Anexo — invariantes verificables

---

## 1. Visión general

**Verbum Manet Academy** es una **Single Page Application estática** que sirve un seminario reformado de 20 cursos como aplicación web instalable (PWA). El sistema se distribuye como un conjunto de archivos HTML, CSS, JavaScript y JSON-en-JS, sin servidor de aplicaciones, sin base de datos, sin proceso de build.

### 1.1 Anatomía resumida

```
Navegador del usuario
        │
        ▼
   index.html ─── shell único de la SPA
        │
        ├── css/styles.css ─── tokens y componentes
        ├── data/courses-index.js ─── metadatos de 20 cursos
        ├── data/glossary.js ─── 80+ términos teológicos
        ├── js/app.js ─── router + UI shell
        ├── js/courseLoader.js ─── carga de fragmentos
        ├── js/study-panel.js ─── Pomodoro y herramientas
        │
        ▼
   fetch(...)
        │
        ├── pages/home.html ─── fragmento de portada
        ├── pages/about.html ─── filosofía educativa
        ├── pages/courses.html ─── catálogo dinámico
        ├── pages/glossary.html ─── glosario navegable
        ├── pages/panel-estudio.html ─── herramientas
        │
        └── courses/segment-N/curso-*.html ─── 20 cursos
                │
                └── ~135 lecciones × 5 vías
```

### 1.2 Métricas de tamaño esperado del proyecto completo

| Componente | Peso aprox. | Notas |
|---|---|---|
| `index.html` | 15–25 KB | Shell con meta PWA, header, footer, contenedor |
| `css/styles.css` | 60–90 KB | Tokens OKLCH + componentes + responsivo |
| `js/app.js` | 18–28 KB | Router + tema + drawer + buscador + tooltips |
| `js/courseLoader.js` | 6–10 KB | Fetch + caché + skeleton + ciclo de vida |
| `js/study-panel.js` | 12–18 KB | Pomodoro, notas, marcadores in-memory |
| `data/courses-index.js` | 20–30 KB | Metadatos de 20 cursos |
| `data/glossary.js` | 40–80 KB | 80+ entradas con definición, etimología, refs |
| `pages/*.html` | 5 archivos × ~15 KB = 75 KB | Fragmentos de páginas estáticas |
| `courses/segment-N/*.html` | 20 archivos × ~50–80 KB = ~1.3 MB | Contenido académico |
| `icons/*` (PNG + SVG) | ~250 KB total | Set PWA completo |
| **Subtotal código** | **~150–250 KB** | Carga inicial obligatoria |
| **Total contenido** | **~1.5 MB** | Diferido vía fetch |

> **Implicación clave:** la **carga inicial** es de unos 250 KB; los cursos individuales se cargan sólo cuando el usuario los visita. Sobre Cloudflare CDN con compresión gzip/brotli, la carga inicial real ronda los 60–80 KB transferidos.

---

## 2. Principios arquitectónicos

Cuatro principios gobiernan toda decisión de arquitectura. Cuando esta arquitectura calle, resuelve por jerarquía:

### Principio 1 — Estática primero

El sistema **no tiene servidor de aplicaciones**. Toda la lógica corre en el navegador del usuario. La infraestructura es un CDN servidor de archivos. Esto produce: coste cero de operación, latencia mínima, escalado infinito, instalabilidad offline trivial.

### Principio 2 — Sin frameworks ni dependencias de build

El sistema **no usa** React, Vue, Svelte, Astro, Next, Vite, Webpack, Rollup, Babel ni TypeScript. No hay paso de compilación. El código que el desarrollador escribe es exactamente el código que el navegador ejecuta. Esto produce: cero deuda técnica por upgrade de framework, comprensibilidad total, longevidad arquitectónica medida en décadas.

### Principio 3 — Estado en memoria, no en almacenamiento del navegador

El sistema **no usa** `localStorage`, `sessionStorage`, `IndexedDB`, ni cookies de aplicación. Todo el estado vive en variables JavaScript en memoria. La persistencia, cuando existe, se hace mediante **JSON export/import** explícito controlado por el usuario. Esto produce: privacidad estricta (nada del usuario queda en su dispositivo sin su consentimiento explícito), portabilidad real (el usuario lleva su progreso a otro dispositivo en un archivo), simplicidad de testing.

### Principio 4 — Contenido como datos, presentación como código

El **contenido teológico** (cursos, lecciones, glosario, bibliografía) son **fragmentos HTML** o **objetos JavaScript declarativos**. El **código** (router, carga, render dinámico) son **módulos JavaScript** vanilla. La separación es estricta: ningún módulo `.js` contiene contenido teológico inline; ningún fragmento `.html` contiene lógica de aplicación.

---

## 3. Stack tecnológico

### 3.1 Tecnologías obligatorias

| Capa | Tecnología | Versión mínima | Razón |
|---|---|---|---|
| Markup | HTML5 | Living Standard | Semántico, accesible, indexable |
| Styling | CSS3 con OKLCH | Soporte 2023+ | Gamut amplio, percepción uniforme |
| Scripting | JavaScript ES2022 | Top-level await | Sin transpilación necesaria |
| Tipografía | Cormorant Garamond + Satoshi | – | Display y UI; ver `STYLE-GUIDE` §9 |
| PWA | Service Worker (opcional) | – | Cache offline; no obligatorio para v1 |
| Manifest | Web App Manifest | – | Instalación PWA |

### 3.2 Tecnologías prohibidas

| Tecnología | Razón del veto |
|---|---|
| React, Vue, Svelte, Angular | Violan el Principio 2 (sin frameworks). |
| Next.js, Astro, Gatsby | Requieren build; violan el Principio 2. |
| TypeScript | Requiere compilación; añade fricción sin valor proporcional aquí. |
| jQuery | Anacronismo; vanilla JS moderno cubre todos los usos. |
| Bootstrap, Tailwind, Bulma | El sistema de diseño es propio; un framework CSS introduciría conflicto de tokens. |
| Sass, Less, PostCSS | Build innecesario; CSS3 con variables cubre toda necesidad. |
| `localStorage`, `sessionStorage`, `IndexedDB` | Violan el Principio 3. |
| Cookies de aplicación | Violan el Principio 3. |
| Analítica con scripts externos (Google Analytics, etc.) | Violan privacidad por diseño y el Principio 1 (introducen tercera parte). |
| Fuentes con CDN propietario sin fallback local | Riesgo de privacidad y de disponibilidad. |

### 3.3 Tecnologías de runtime del desarrollador (no del usuario)

| Herramienta | Uso | Obligatoria |
|---|---|---|
| `git` | Control de versiones | Sí |
| Editor de texto (VS Code recomendado) | Edición | Sí |
| Navegador con DevTools | Verificación visual | Sí |
| Python 3.10+ | Herramienta de auditoría `vma_audit` | Recomendada |
| Wrangler CLI | Deploy a Cloudflare Pages | Recomendada |
| Inkscape o Figma | Exportación de iconos PWA | Para `BRANDING` solamente |

---

## 4. Topología de archivos

La topología es la **única fuente de verdad** sobre dónde vive cada cosa. Cualquier archivo nuevo debe encontrar su lugar en este árbol; si no encaja, el árbol está incompleto y debe extenderse.

### 4.1 Árbol normativo

```
verbum-manet-academy/
│
├── index.html                         Shell único de la SPA. Único archivo
│                                      con <!DOCTYPE>, <html>, <head>, <body>.
├── 404.html                           Fallback Cloudflare (Sal 119:105).
├── manifest.json                      Web App Manifest para PWA.
├── robots.txt                         SEO directivas.
├── sitemap.xml                        SEO sitemap.
├── _headers                           Cabeceras HTTP para Cloudflare Pages.
├── _redirects                         /* → /index.html 200 para SPA routing.
│
├── css/
│   └── styles.css                     Tokens OKLCH + componentes + responsivo.
│                                      Único archivo CSS del proyecto.
│
├── js/
│   ├── app.js                         Router SPA + tema + UI shell.
│   ├── courseLoader.js                Fetch + caché + ciclo de vida de fragmentos.
│   └── study-panel.js                 Pomodoro, notas, marcadores in-memory.
│
├── data/
│   ├── courses-index.js               COURSES_INDEX global con 20 cursos.
│   └── glossary.js                    GLOSSARY global con 80+ términos.
│
├── pages/
│   ├── home.html                      Portada (hero, propósito, recorrido).
│   ├── about.html                     Filosofía educativa y misión.
│   ├── courses.html                   Catálogo dinámico (consume COURSES_INDEX).
│   ├── glossary.html                  Glosario navegable (consume GLOSSARY).
│   └── panel-estudio.html             Herramientas del estudiante.
│
├── courses/
│   ├── segment-1/                     Fundamentos y herramientas.
│   │   ├── curso-01-introduccion-teologia-reformada.html
│   │   ├── curso-02-hermeneutica-biblica.html
│   │   ├── curso-03-introduccion-antiguo-testamento.html
│   │   ├── curso-04-introduccion-nuevo-testamento.html
│   │   └── curso-05-formacion-espiritual.html
│   ├── segment-2/                     Historia de la Iglesia.
│   │   ├── curso-06-historia-iglesia-antigua.html
│   │   ├── curso-07-historia-iglesia-medieval.html
│   │   ├── curso-08-reforma-protestante.html
│   │   └── curso-09-historia-iglesia-moderna.html
│   ├── segment-3/                     Teología sistemática.
│   │   ├── curso-10-bibliologia.html
│   │   ├── curso-11-teologia-propia.html
│   │   ├── curso-12-antropologia-hamartologia.html
│   │   ├── curso-13-cristologia-soteriologia.html
│   │   ├── curso-14-eclesiologia-sacramentologia.html
│   │   └── curso-15-escatologia.html
│   └── segment-4/                     Teología aplicada.
│       ├── curso-16-apologetica.html
│       ├── curso-17-etica-biblica.html
│       ├── curso-18-teologia-biblica.html
│       ├── curso-19-teologia-pacto.html
│       └── curso-20-misiones-evangelismo.html
│
├── assets/
│   └── logo-verbum-manet.svg          Master del logotipo (ver BRANDING.md).
│
├── icons/
│   ├── favicon.svg                    Favicon vectorial.
│   ├── favicon-32.png                 Favicon 32×32 raster.
│   ├── apple-touch-icon.png           iOS home-screen 180×180.
│   ├── og-image.png                   Open Graph 1200×630.
│   ├── verbum-manet-192.png           PWA Android 192×192.
│   ├── verbum-manet-512.png           PWA splash 512×512.
│   └── verbum-manet-512-maskable.png  PWA maskable 512×512.
│
└── docs/
    ├── BRANDING-CLAUDE-DESIGN.md      Brief de marca (v1.0).
    ├── STYLE-GUIDE-CONTENT.md         Guía editorial (v1.1).
    ├── ARCHITECTURE.md                Este documento.
    └── DEPLOYMENT.md                  Guía de despliegue (Cloudflare Pages).
```

### 4.2 Reglas de la topología

1. **Cero ambigüedad sobre dónde va un archivo.** Si la topología no tiene lugar para un tipo de archivo nuevo, hay que extender la topología, no improvisar.
2. **Nombres en kebab-case minúscula.** `curso-13-cristologia-soteriologia.html`, no `Curso13.html` ni `cristología.html` (sin tildes en nombres de archivo).
3. **Sin archivos en raíz salvo los enumerados.** No `notas.md`, `borrador.html`, `temp.js` ni nada similar. Si se necesita un scratchpad, vive fuera del repositorio.
4. **Sin carpetas extra.** No `src/`, no `dist/`, no `build/`, no `node_modules/`. La topología es plana y final.

---

## 5. Arquitectura de runtime

### 5.1 Orden de carga del shell

Cuando el navegador solicita la raíz del sitio, ocurre esto en orden estricto:

```
1. Cloudflare CDN sirve index.html
2. Navegador parsea <head>:
   ├── meta tags (charset, viewport, PWA, OG, theme-color)
   ├── <link rel="manifest" href="./manifest.json">
   ├── <link rel="icon" ...>
   ├── <link rel="preconnect" href="https://api.fontshare.com">
   ├── <link rel="preconnect" href="https://fonts.gstatic.com">
   ├── <link rel="stylesheet" href="./css/styles.css">
   ├── <link rel="stylesheet" href="...Cormorant+Garamond...">
   └── <link rel="stylesheet" href="...Satoshi...">
3. Navegador renderiza <body>:
   ├── skip-link (accesibilidad)
   ├── <header> con logo, navegación principal, toggle de tema
   ├── <main id="main-content"> ← contenedor de fragmentos
   └── <footer> con créditos, doxología, enlaces
4. Navegador carga scripts (todos con defer, en este orden):
   ├── <script defer src="./data/courses-index.js"></script>
   │     → expone window.COURSES_INDEX (frozen)
   ├── <script defer src="./data/glossary.js"></script>
   │     → expone window.GLOSSARY (frozen)
   ├── <script defer src="./js/courseLoader.js"></script>
   │     → expone window.CourseLoader
   ├── <script defer src="./js/study-panel.js"></script>
   │     → expone window.StudyPanel
   └── <script defer src="./js/app.js"></script>
         → arranque del router al DOMContentLoaded
5. app.js dispara navigate(location.hash || '#/')
   → CourseLoader.load() inserta el fragmento inicial en #main-content
6. UI lista. El usuario puede navegar.
```

### 5.2 Restricciones del orden

- `courses-index.js` y `glossary.js` **deben** cargar antes que `app.js` y `courseLoader.js`, porque estos los referencian para construir rutas y tooltips.
- `study-panel.js` puede cargar en paralelo a `app.js` porque sus responsabilidades no se solapan, pero por simplicidad va antes (orden alfabético del listado en `index.html`).
- Todos los scripts usan `defer` (no `async`): esto garantiza orden de ejecución y que el DOM esté parseado antes de ejecutarse.

### 5.3 Diagrama de dependencias

```
                  ┌─────────────┐
                  │ index.html  │
                  └──────┬──────┘
                         │ <link rel=stylesheet>
                         ▼
                  ┌─────────────┐
                  │ styles.css  │
                  └─────────────┘

   ┌──────────────────────────────────────────────────┐
   │                  <script defer>                  │
   └──────────────────────────────────────────────────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
   ┌──────────┐    ┌──────────┐    ┌─────────────┐
   │ courses- │    │ glossary │    │ courseLoader│
   │ index.js │    │ .js      │    │ .js         │
   └─────┬────┘    └─────┬────┘    └──────┬──────┘
         │               │                │
         │               │       ┌────────┘
         │               │       │
         ▼               ▼       ▼
   ┌──────────────────────────────────┐
   │             app.js               │
   │  · construye rutas desde         │
   │    COURSES_INDEX                 │
   │  · llama CourseLoader.load()     │
   │  · expone tooltips desde GLOSSARY│
   └──────────────────────────────────┘
                         ▲
                         │
                  ┌──────┴──────┐
                  │study-panel.js│
                  │  (paralelo) │
                  └─────────────┘
```

---

## 6. Sistema de routing

### 6.1 Estrategia: hash-based routing

El proyecto usa **hash routing** (`#/ruta`) y no `history.pushState`. Razones:

1. **Funciona sin configuración de servidor.** Cualquier hosting estático sirve `index.html` para la raíz; el hash no se envía al servidor, así que toda ruta se resuelve en cliente.
2. **Robusto en file://**. Permite abrir el sitio directamente desde el disco para testing, sin servidor local.
3. **Cero dependencia de `_redirects`** aunque mantenemos `_redirects: /* → /index.html 200` como red de seguridad.

### 6.2 Catálogo de rutas

| Hash | Fragmento cargado | Función |
|---|---|---|
| `#/` (vacío) | `pages/home.html` | Portada |
| `#/inicio` | `pages/home.html` | Alias de portada |
| `#/acerca` | `pages/about.html` | Filosofía y misión |
| `#/cursos` | `pages/courses.html` | Catálogo dinámico de 20 cursos |
| `#/glosario` | `pages/glossary.html` | Glosario navegable |
| `#/panel` | `pages/panel-estudio.html` | Herramientas del estudiante |
| `#/curso/{id}` | `courses/segment-N/curso-{id}.html` | Curso específico |

### 6.3 Construcción dinámica de rutas de cursos

Las rutas de los 20 cursos no se hardcodean. Se construyen en runtime desde `COURSES_INDEX`:

```javascript
// js/app.js — pseudocódigo
const STATIC_ROUTES = {
  '#/':         './pages/home.html',
  '#/inicio':   './pages/home.html',
  '#/acerca':   './pages/about.html',
  '#/cursos':   './pages/courses.html',
  '#/glosario': './pages/glossary.html',
  '#/panel':    './pages/panel-estudio.html',
};

const COURSE_ROUTES = {};
COURSES_INDEX.forEach(course => {
  COURSE_ROUTES[`#/curso/${course.id}`] =
    `./courses/${course.segment}/${course.file}`;
});

const ROUTES = { ...STATIC_ROUTES, ...COURSE_ROUTES };
```

> Implicación: para añadir un curso nuevo, basta con añadir una entrada en `COURSES_INDEX` apuntando al archivo en `courses/segment-N/`. No se toca `app.js`.

### 6.4 Ciclo del router

```
Usuario hace clic en <a href="#/curso/cristologia-soteriologia">
        │
        ▼
1. Browser actualiza location.hash → "#/curso/cristologia-soteriologia"
        │
        ▼
2. Event 'hashchange' se dispara
        │
        ▼
3. app.js navigate(location.hash):
   ├── Cierra overlays abiertos (drawer, modal de búsqueda)
   ├── path = ROUTES[hash] || ROUTES['#/'] (fallback a home)
   ├── await CourseLoader.load(path, document.getElementById('main-content'))
   ├── window.scrollTo(0, 0)
   ├── updateActiveNav(hash) → aria-current="page" en el link correspondiente
   └── document.querySelector('main h1')?.focus() → foco accesible
        │
        ▼
4. CourseLoader.load:
   ├── Muestra skeleton loader en el contenedor
   ├── Si fragmento en caché → inyecta cached
   ├── Si no → fetch(path), valida 200, cachea, inyecta
   ├── Si error → muestra error inline
   └── Ejecuta initFragmentComponents() → re-inicializa tooltips, etc.
        │
        ▼
5. Nuevo fragmento listo. UI navegable.
```

### 6.5 404 inline

Cuando una ruta no existe (`#/ruta-inventada`):

- El router resuelve a `ROUTES['#/']` (fallback explícito a portada).
- Alternativamente, `app.js` puede inyectar un mensaje 404 inline en `#main-content` con tono institucional ("La página que buscas no existe; vuelve al inicio o explora el catálogo").

---

## 7. Carga dinámica de fragmentos

### 7.1 Anatomía de `courseLoader.js`

```javascript
// js/courseLoader.js — pseudocódigo
const CourseLoader = (() => {
  const cache = new Map();  // path → htmlString

  async function load(path, container) {
    showSkeleton(container);
    try {
      if (!cache.has(path)) {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        cache.set(path, await res.text());
      }
      container.innerHTML = cache.get(path);
      initFragmentComponents(container);
    } catch (err) {
      showError(container, err);
    }
  }

  function showSkeleton(container) {
    container.innerHTML = `
      <div class="skeleton-wrap" aria-busy="true" aria-label="Cargando…">
        <div class="skeleton skeleton-heading"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width:70%"></div>
      </div>`;
  }

  function showError(container, err) {
    container.innerHTML = `
      <div class="error-state" role="alert">
        <p>No se pudo cargar el contenido. Verifica tu conexión.</p>
      </div>`;
  }

  function initFragmentComponents(container) {
    container.querySelectorAll('[data-glossary-term]')
      .forEach(initGlossaryTooltip);
    container.querySelectorAll('[data-accordion]')
      .forEach(initAccordion);
    container.querySelectorAll('details.question')
      .forEach(initQuizQuestion);
  }

  function clearCache(path = null) {
    if (path) cache.delete(path);
    else cache.clear();
  }

  function preload(path) {
    if (!cache.has(path)) {
      fetch(path).then(r => r.text()).then(html => cache.set(path, html));
    }
  }

  return { load, clearCache, preload };
})();
```

### 7.2 Estrategia de caché

- **Caché en memoria** (`Map` JavaScript) durante la sesión del navegador.
- **Sin caché en `localStorage`** (constraint del Principio 3).
- **Cloudflare CDN** cachea cada archivo independientemente (ver `_headers`).
- Cuando el usuario recarga la pestaña, la caché en memoria se pierde, pero Cloudflare sirve los archivos con `Cache-Control: max-age=31536000, immutable` para los assets estáticos.

### 7.3 Skeleton loaders

Cada fragmento que tarda más de ~50ms en cargar muestra un esqueleto:

```html
<div class="skeleton-wrap" aria-busy="true" aria-label="Cargando contenido…">
  <div class="skeleton skeleton-heading"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text" style="width: 70%"></div>
</div>
```

Con CSS de animación shimmer (gradient en navy/cream). El `aria-busy="true"` lo anuncia a lectores de pantalla.

### 7.4 Manejo de errores

Si `fetch()` falla (red caída, 404, 500):

```html
<div class="error-state" role="alert">
  <p>No se pudo cargar el contenido. Verifica tu conexión e intenta de nuevo.</p>
  <button onclick="location.reload()">Reintentar</button>
</div>
```

No se propaga la excepción a `window.onerror`. La UI siempre queda en estado consistente.

### 7.5 Preload en hover (opcional)

Para mejorar la sensación de velocidad, `app.js` puede llamar a `CourseLoader.preload(path)` cuando el usuario hace `mouseenter` sobre un enlace de curso. El fragmento queda en caché antes del clic, así que la navegación es instantánea.

---

## 8. Sistema de estado

### 8.1 Estado global de la aplicación

El estado vive en **variables JavaScript**, scopeadas en IIFE. No hay store global tipo Redux; el alcance del estado es deliberadamente local a cada módulo.

| Módulo | Estado | Tipo |
|---|---|---|
| `app.js` | `currentHash`, `currentTheme`, `fsScale` | Variables locales en IIFE |
| `courseLoader.js` | `cache` (Map de fragmentos) | Map en clausura |
| `study-panel.js` | `pomodoroState`, `notes`, `bookmarks` | Objetos en clausura |

### 8.2 Persistencia: export/import JSON

El usuario puede en cualquier momento:

1. **Exportar su sesión** desde el Panel de estudio → genera un `verbum-manet-progreso-YYYY-MM-DD.json` con notas, marcadores, lecciones completadas, etc.
2. **Importar un archivo** en una nueva sesión → restaura el estado.

Esto es la única forma de persistencia. **Por diseño**: el usuario es soberano de sus datos; nada queda en su dispositivo sin acción explícita.

### 8.3 Esquema del archivo de progreso

```json
{
  "schema_version": "1.0",
  "exported_at": "2026-05-17T10:30:00Z",
  "user_label": "Calet Cáceres",
  "progress": {
    "courses_completed": ["curso-01-...", "curso-03-..."],
    "lessons_completed": ["1.1", "1.2", "3.1"],
    "current_course": "curso-13-cristologia-soteriologia",
    "current_lesson": "2.1"
  },
  "notes": [
    {
      "id": "note-uuid-1",
      "lesson_ref": "13.2.1",
      "content": "…",
      "created_at": "..."
    }
  ],
  "bookmarks": [
    {
      "lesson_ref": "13.3.3",
      "anchor": "#via-3-3-elentica",
      "label": "Justificación — eléntica"
    }
  ],
  "pomodoro_sessions": 14
}
```

---

## 9. Sistema de datos

### 9.1 `data/courses-index.js`

Define la constante global `COURSES_INDEX` como un array congelado:

```javascript
const COURSES_INDEX = Object.freeze([
  Object.freeze({
    id: "introduccion-teologia-reformada",
    number: 1,
    title: "Introducción a la Teología Reformada",
    segment: "segment-1",
    file: "curso-01-introduccion-teologia-reformada.html",
    description: "Naturaleza, método e identidad histórica de la teología reformada.",
    tags: Object.freeze(["fundamentos", "prolegómenos", "confesional"]),
    level: "Fundacional",
    duration: "6-8 semanas",
    units: 3,
    lessons: 10
  }),
  // ... 19 más
]);
```

**Por qué `Object.freeze`:** previene mutaciones accidentales del catálogo en runtime. Los datos del catálogo son inmutables; cualquier cambio requiere editar el archivo y recargar.

### 9.2 `data/glossary.js`

Define la constante global `GLOSSARY` como un objeto congelado, con ID como clave:

```javascript
const GLOSSARY = Object.freeze({
  "ordo-salutis": Object.freeze({
    id: "ordo-salutis",
    term: "Ordo salutis",
    pronunciation: "/ˈordo saˈlutis/",
    etymology: "Latín: «orden de la salvación».",
    language: "la",
    definition: "Secuencia lógica —no necesariamente cronológica— de los actos de Dios en la aplicación de la redención al creyente individual.",
    scriptural_basis: Object.freeze(["Ro 8:29–30", "Ef 1:3–14"]),
    confessional_basis: Object.freeze(["CFW X–XVIII"]),
    related: Object.freeze(["regeneracion", "justificacion"]),
    used_in_courses: Object.freeze(["curso-13-cristologia-soteriologia"]),
    level: "intermedio"
  }),
  // ... 80+ más
});
```

### 9.3 Por qué JS en lugar de JSON

| Aspecto | JSON puro (`.json`) | JS con `const` (`.js`) |
|---|---|---|
| Carga | `fetch()` + `JSON.parse()` | `<script defer>` directo |
| CORS | Posibles problemas en `file://` | Cero problemas |
| Comentarios | No permitidos | Permitidos (línea y bloque) |
| Sintaxis | Estricta (sin coma final) | Flexible |
| Tooling | Linting JSON | Linting JS estándar |
| Inmutabilidad | No nativa | `Object.freeze()` |

La elección de JS expone los datos como variables globales accesibles desde cualquier fragmento HTML inyectado, sin necesidad de orquestar `fetch + parse + assign` para cada uno.

### 9.4 Búsqueda transversal

El modal de búsqueda (Ctrl+K) busca simultáneamente en `COURSES_INDEX` y `GLOSSARY` con **matching insensible a acentos**:

```javascript
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // remover diacríticos
}

function search(query) {
  const q = normalize(query);
  const courseHits = COURSES_INDEX.filter(c =>
    normalize(c.title).includes(q) ||
    normalize(c.description).includes(q) ||
    c.tags.some(t => normalize(t).includes(q))
  );
  const glossaryHits = Object.values(GLOSSARY).filter(g =>
    normalize(g.term).includes(q) ||
    normalize(g.definition).includes(q)
  );
  return { courses: courseHits, terms: glossaryHits };
}
```

---

## 10. Sistema de diseño

### 10.1 Tokens OKLCH

Todos los colores del sistema se definen en OKLCH con fallback HEX. Catálogo completo en `STYLE-GUIDE-CONTENT.md` §A. Resumen:

| Familia | Hue | Tokens | Uso |
|---|---|---|---|
| Navy | 256° | `--vma-navy-50` a `--vma-navy-900` | Superficie oscura, texto sobre cream |
| Gold | 78° | `--vma-gold-50` a `--vma-gold-900` | Acento, énfasis, filete |
| Cream | 78° | `--vma-cream`, `--vma-cream-dark` | Superficie clara (pergamino) |
| Ink | 256° | `--vma-ink`, `--vma-ink-soft` | Texto principal y secundario |
| Mist | 256° | `--vma-mist`, `--vma-mist-dark` | Bordes y separadores neutros |

### 10.2 Aliases semánticos

Cada par modo claro/oscuro define aliases:

```css
:root {
  --vma-bg:       var(--vma-cream);
  --vma-bg-elev:  #FFFFFF;
  --vma-fg:       var(--vma-ink);
  --vma-fg-soft:  var(--vma-ink-soft);
  --vma-accent:   var(--vma-gold-700);
  --vma-border:   var(--vma-mist);
}

:root[data-theme="dark"] {
  --vma-bg:       var(--vma-navy-900);
  --vma-bg-elev:  var(--vma-navy-800);
  --vma-fg:       var(--vma-cream);
  --vma-fg-soft:  var(--vma-navy-300);
  --vma-accent:   var(--vma-gold-500);
  --vma-border:   var(--vma-navy-700);
}
```

Los componentes referencian aliases (`var(--vma-bg)`), no tokens absolutos. Esto permite cambiar tema mediante `[data-theme]` sin reescribir reglas.

### 10.3 Tipografía

- **Cormorant Garamond** (display, serif) — pesos 400, 500, 600, 700; italics 400 y 600.
- **Satoshi** (UI, sans) — pesos 300, 400, 500, 700, 900; italic 400.

Escala fluida con `clamp()` en 9 tokens: `--text-xs` a `--text-display`. Ver `STYLE-GUIDE` §9.3.

### 10.4 Sistema de espaciado

Escala basada en múltiplos de 4 px (con `clamp()` para fluidez):

| Token | Valor | Uso |
|---|---|---|
| `--space-1` | 4 px | Hairline |
| `--space-2` | 8 px | Compact |
| `--space-3` | 12 px | Default vertical en formularios |
| `--space-4` | 16 px | Default horizontal |
| `--space-5` | 24 px | Sección interna |
| `--space-6` | 32 px | Sección externa |
| `--space-7` | 48 px | Bloque |
| `--space-8` | 64 px | Bloque mayor |
| `--space-9` | 96 px | Hero |

### 10.5 Sistema de elevación (sombras)

```css
--shadow-sm: 0 1px 3px oklch(18% 0.055 256 / 0.08);
--shadow-md: 0 4px 12px oklch(18% 0.055 256 / 0.12);
--shadow-lg: 0 12px 32px oklch(18% 0.055 256 / 0.18);
```

Notar el chroma navy (0.055 256) en lugar de neutro: las sombras son **azuladas**, no grises. Esto es deliberado y forma parte del DNA visual.

### 10.6 Breakpoints

| Nombre | Valor | Uso |
|---|---|---|
| `mobile` | hasta 480 px | Móvil compacto |
| `mobile-lg` | 481–767 px | Móvil grande |
| `tablet` | 768–1023 px | Tablet |
| `desktop` | 1024–1279 px | Desktop estándar |
| `desktop-lg` | 1280–1599 px | Desktop amplio |
| `desktop-xl` | 1600 px+ | Pantallas grandes |

Mobile-first: media queries son `min-width`, no `max-width`.

---

## 11. Sistema PWA

### 11.1 `manifest.json`

```json
{
  "name": "Verbum Manet Academy",
  "short_name": "Verbum Manet",
  "description": "Plataforma académica de formación teológica reformada en español.",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#101B33",
  "theme_color": "#101B33",
  "lang": "es",
  "dir": "ltr",
  "categories": ["education", "books"],
  "icons": [
    { "src": "./icons/verbum-manet-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "./icons/verbum-manet-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "./icons/verbum-manet-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 11.2 Instalabilidad

Con `manifest.json` correctamente enlazado en `index.html` y HTTPS (que Cloudflare Pages provee gratis), el navegador ofrecerá automáticamente "Añadir a pantalla de inicio" en Android y "Instalar" en Chrome desktop.

### 11.3 Service Worker (opcional para v1)

Para soporte offline real, se puede añadir un `service-worker.js` que cachee:

- El shell (`index.html`, CSS, JS, datos).
- Las páginas (`pages/*.html`).
- Los cursos visitados durante la sesión.

Estrategias recomendadas:

- **Cache-first** para shell y assets estáticos.
- **Network-first con fallback a cache** para cursos.
- **Cache durante la sesión** para fragmentos visitados.

> Este componente es **opcional** para la primera versión pública. La instalabilidad y el manifest son suficientes para la PWA básica. El service worker se añade cuando se quiera soporte offline real.

---

## 12. Pipeline de despliegue

### 12.1 Plataforma primaria: Cloudflare Pages

Cloudflare Pages provee:
- Hosting estático sobre CDN global.
- HTTPS automático.
- Despliegues por git push o vía Wrangler CLI.
- Soporte nativo para `_headers` y `_redirects`.
- Custom domains sin coste.

### 12.2 Plataforma alternativa: GitHub Pages

Para fallback o para previews. Limitación: no soporta `_headers` ni `_redirects` con la misma sintaxis; los redirects se gestionan vía meta refresh en `404.html`.

### 12.3 `_headers`

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/icons/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/courses/*
  Cache-Control: public, max-age=3600, must-revalidate

/pages/*
  Cache-Control: public, max-age=3600, must-revalidate

/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=86400
```

### 12.4 `_redirects`

```
/*    /index.html    200
```

Esto es **red de seguridad**: dado que usamos hash routing, técnicamente no es necesario, pero protege contra cualquier escenario donde Cloudflare envíe al servidor una URL desconocida.

### 12.5 Despliegue con Wrangler

```bash
npx wrangler pages deploy . \
  --project-name verbum-manet-academy \
  --branch main
```

El primer despliegue requiere autenticación (`wrangler login`). Subsiguientes despliegues son ~10-30 segundos.

### 12.6 Verificación post-deploy

Lista de chequeo:

1. La portada carga.
2. La navegación entre páginas funciona (cambio de hash).
3. Un curso específico carga al hacer clic.
4. El toggle de tema funciona.
5. El modal de búsqueda (Ctrl+K) abre y encuentra resultados.
6. El glosario muestra tooltips al hover.
7. El sitio es instalable como PWA (icono en barra de URL en Chrome).
8. Funciona en móvil.
9. Lighthouse score: Performance > 90, Accessibility > 95, Best Practices > 95, SEO > 95.

---

## 13. Modelo de extensibilidad

### 13.1 Añadir un curso nuevo

Solo cuatro pasos:

1. Crear `courses/segment-N/curso-XX-nombre.html` con el contenido siguiendo `STYLE-GUIDE` §10 y §19 (las cinco vías).
2. Añadir entrada en `data/courses-index.js`:
   ```javascript
   Object.freeze({
     id: "nombre-del-curso",
     number: 21,
     title: "Nombre del Curso",
     segment: "segment-4",
     file: "curso-21-nombre.html",
     // ... resto de campos
   })
   ```
3. Si el curso introduce términos nuevos, añadirlos a `data/glossary.js`.
4. Auditar con `python -m vma_audit audit courses/segment-N/curso-XX-nombre.html`.

No se toca `app.js`, ni `index.html`, ni `styles.css`. El router descubre la nueva ruta automáticamente.

### 13.2 Añadir una página estática nueva

1. Crear `pages/nueva-pagina.html` (fragmento sin etiquetas raíz).
2. Añadir entrada en `STATIC_ROUTES` de `app.js`:
   ```javascript
   '#/nueva-pagina': './pages/nueva-pagina.html'
   ```
3. Añadir enlace en la navegación de `index.html`.

### 13.3 Añadir un término al glosario

Una sola entrada en `data/glossary.js`. El tooltip se activa automáticamente en cualquier curso que use `<span data-glossary-term="id-del-termino">`.

### 13.4 Añadir un componente CSS

Editar `css/styles.css` siguiendo la convención BEM-modificada del proyecto:

```css
.componente { /* base */ }
.componente__elemento { /* parte */ }
.componente--variante { /* variante */ }
.componente.is-state { /* estado dinámico */ }
```

### 13.5 Lo que **no** se extiende sin discusión

- **No se añaden frameworks.** Si una necesidad parece exigirlo, se reformula la necesidad.
- **No se añade build step.** Si una sintaxis exige transpilación (TypeScript, JSX, Sass), se descarta esa sintaxis.
- **No se añade almacenamiento en navegador.** Cualquier estado nuevo va en memoria o se exporta/importa.

---

## 14. Restricciones absolutas

Las siguientes restricciones son **inmutables**. No se discuten; se cumplen.

### 14.1 Privacidad

- No tracking de ningún tipo. Cero analytics, cero pixels, cero terceras partes.
- No cookies salvo las estrictamente técnicas (no usadas actualmente).
- No `localStorage` ni `sessionStorage`.

### 14.2 Accesibilidad

- WCAG 2.1 AA mínimo en todas las páginas.
- Navegación completa por teclado.
- Lectores de pantalla soportados.
- Contraste 4.5:1 mínimo en texto de cuerpo, 3:1 en texto grande.

### 14.3 Performance

- Carga inicial < 100 KB transferidos.
- Time to Interactive < 2 segundos en 3G.
- Lighthouse Performance > 90 en mobile.

### 14.4 Doctrinal

- Contenido exclusivamente desde tradición reformada confesional.
- Ningún contenido en conflicto con Westminster, Heidelberg, Dort, Belga.
- No se aceptan colaboraciones doctrinalmente ajenas.

### 14.5 Editorial

- Cumplimiento total de `STYLE-GUIDE-CONTENT.md` v1.1.
- Auditoría con `vma_audit` antes de cada publicación.

---

## 15. Diagramas de flujo

### 15.1 Flujo: usuario llega a la portada

```
[Usuario abre vma.app]
        ↓
[Cloudflare CDN sirve index.html]
        ↓
[Browser carga CSS, fuentes, JS en defer]
        ↓
[DOM ready → app.js bootstrap]
        ↓
[Router construye rutas desde COURSES_INDEX]
        ↓
[navigate('#/') → CourseLoader.load('./pages/home.html')]
        ↓
[fetch home.html → inyecta en #main-content]
        ↓
[initFragmentComponents() activa tooltips si los hay]
        ↓
[UI lista; foco en h1 de la portada]
```

### 15.2 Flujo: usuario navega a un curso

```
[Usuario hace clic en "Cristología y Soteriología"]
        ↓
[<a href="#/curso/cristologia-soteriologia"> dispara hashchange]
        ↓
[app.js cierra overlays abiertos]
        ↓
[Resuelve path: ROUTES["#/curso/cristologia-soteriologia"]
 = "./courses/segment-3/curso-13-cristologia-soteriologia.html"]
        ↓
[CourseLoader.load(path, container):
   - showSkeleton(container)
   - cache.has(path)? → reusa : fetch
   - container.innerHTML = html]
        ↓
[initFragmentComponents():
   - Tooltips de glosario en .vias [data-glossary-term]
   - Acordeones en details.question del quiz
   - Renderiza navegación curso-prev/curso-next]
        ↓
[scrollTo(0,0) + focus en h1]
        ↓
[Usuario lee. Navega entre vías. Usa el quiz al final.]
```

### 15.3 Flujo: usuario abre el modal de búsqueda

```
[Usuario presiona Ctrl+K]
        ↓
[app.js intercepta keydown si !defaultPrevented]
        ↓
[Abre <dialog id="search-modal"> con showModal()]
        ↓
[Foco automático en el input]
        ↓
[Usuario teclea "ordo salutis"]
        ↓
[Debounced 150ms → search(query)]
        ↓
[Resultados de COURSES_INDEX y GLOSSARY mostrados en dos columnas]
        ↓
[Usuario hace clic en "Cristología y Soteriología"]
        ↓
[Modal se cierra, location.hash = "#/curso/cristologia-soteriologia"]
        ↓
[hashchange → navegación normal (ver 15.2)]
```

### 15.4 Flujo: usuario exporta su progreso

```
[Usuario en Panel de Estudio → clic "Exportar progreso"]
        ↓
[StudyPanel.exportSession() construye objeto JSON]
        ↓
[Construye blob: new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })]
        ↓
[Genera URL temporal: URL.createObjectURL(blob)]
        ↓
[Crea <a> oculto con href=url, download="verbum-manet-progreso-2026-05-17.json"]
        ↓
[a.click() programático]
        ↓
[Browser descarga el archivo al disco del usuario]
        ↓
[URL.revokeObjectURL() libera memoria]
```

---

## 16. Glosario de términos arquitectónicos

| Término | Definición |
|---|---|
| **Shell** | El archivo `index.html` único que provee la estructura visual permanente (header, footer) y el contenedor (`#main-content`) donde se inyectan los fragmentos. |
| **Fragmento** | Un archivo `.html` sin etiquetas raíz (`<html>`, `<head>`, `<body>`) que representa una vista o un curso. Se carga vía `fetch` y se inyecta en el shell. |
| **Hash routing** | Estrategia donde la ruta de la SPA vive en el fragmento de la URL (`#/curso/...`), no en el path. Permite hospedaje estático puro. |
| **Skeleton loader** | UI placeholder que se muestra mientras un fragmento está cargando, simulando la estructura del contenido final con animación shimmer. |
| **Las cinco vías** | Las cinco secciones canónicas de cada lección: Formulación confesional, Dimensión eléntica, Perspectiva de teología bíblica, Aplicación catequética, Aplicación doxológica. Estructura inmutable del corpus. |
| **OKLCH** | Espacio de color perceptualmente uniforme. Usado para todos los tokens de color del proyecto. Soportado por navegadores modernos; con fallback HEX para legacy. |
| **Token semántico** | Variable CSS que referencia otros tokens según el contexto (modo claro/oscuro). Ejemplo: `--vma-bg` apunta a `--vma-cream` en claro y `--vma-navy-900` en oscuro. |
| **Cierre latino pastoral** | Expresión latina (Soli Deo gloria, Coram Deo, etc.) que sella el final de un curso o lección, parte del DNA editorial del proyecto. |

---

## 17. Anexo — Convenciones de marcado HTML

### 17.1 Atributos `data-*` reservados

| Atributo | Uso | Módulo que lo consume |
|---|---|---|
| `data-course` | ID del curso en el `<article>` raíz | `courseLoader.js` |
| `data-lesson` | ID de la lección dentro del curso | `study-panel.js` (marcado de completado) |
| `data-glossary-term` | ID del término del glosario | `app.js` (tooltips) |
| `data-accordion` | Marca un acordeón colapsable | `courseLoader.js` (initAccordion) |
| `data-nav` | Link de navegación interna | `app.js` (interceptación) |
| `data-theme` | Tema actual (en `<html>`) | `app.js` (toggle) |
| `data-fs-scale` | Escala tipográfica actual | `app.js` (toggle) |

### 17.2 Clases CSS reservadas con significado funcional

| Clase | Significado |
|---|---|
| `.is-active` | Estado activo de un elemento de navegación |
| `.is-open` | Drawer móvil abierto |
| `.is-loading` | Estado de carga; complementa `aria-busy` |
| `.is-visible` | Tooltip o modal visible |
| `.vma-sr-only` | Solo para lectores de pantalla |
| `.skip-link` | Enlace de salto accesible al inicio del main |

### 17.3 IDs canónicos en cada curso

Cada lección contiene IDs siguiendo el patrón:

```
id="leccion-{N.N}"                      en el <article class="lesson">
id="via-{N-N}-formulacion"              en cada <li class="via">
id="via-{N-N}-elentica"                 (sin tilde, por convención HTML)
id="via-{N-N}-biblica"
id="via-{N-N}-catequetica"
id="via-{N-N}-doxologica"
```

Estos IDs son **estables** y deben preservarse al editar cursos, porque pueden ser referenciados desde bookmarks exportados o enlaces externos.

---

## 18. Anexo — Invariantes verificables

Los siguientes invariantes deben cumplirse en todo momento. La herramienta `vma_audit` verifica varios de ellos automáticamente.

### 18.1 Invariantes estructurales

1. **Un solo `<h1>` por fragmento.** Verificable con `vma_audit` (regla EST-002).
2. **Jerarquía de heads sin saltos.** Verificable con `vma_audit` (regla EST-003).
3. **Ningún fragmento contiene `<html>`, `<head>`, `<body>`, `<!DOCTYPE>`.** Verificable con `vma_audit` (regla EST-005).
4. **Cada `<article class="lesson">` contiene exactamente cinco `<li class="via">`.** Verificable con `vma_audit` (regla EST-001).
5. **Los IDs de las vías siguen el patrón `via-{N-N}-{nombre}`.** Verificable con regex.

### 18.2 Invariantes editoriales

1. **Cero ocurrencias de "elenctica" sin tilde** en texto visible. Verificable con `vma_audit` (TER-001).
2. **Cero verbos arminianos** ("aceptar a Cristo", "decisión por Cristo", etc.). Verificable con `vma_audit` (DOC-001 a DOC-004).
3. **Comillas latinas «»** en lugar de comillas rectas `""` en texto visible. Verificable con `vma_audit` (ORT-001).
4. **Abreviaturas bíblicas en castellano** (Gn, no Gen). Verificable con `vma_audit` (BIB-*).
5. **Extranjerismos con `<i lang="…">`**. Verificable con `vma_audit` (EXT-*).

### 18.3 Invariantes de datos

1. **`COURSES_INDEX.length === 20`**.
2. **Todo `course.file` referenciado existe físicamente** en el directorio `courses/{course.segment}/`.
3. **Todo `course.id` es único** en el array.
4. **`Object.isFrozen(COURSES_INDEX) === true`**.
5. **`Object.isFrozen(GLOSSARY) === true`**.
6. **Toda referencia `data-glossary-term="X"` en cualquier fragmento** corresponde a una clave existente en `GLOSSARY`.

### 18.4 Invariantes de despliegue

1. **`index.html`, `manifest.json`, `_headers`, `_redirects` están en la raíz.**
2. **Los iconos PWA `verbum-manet-192.png`, `verbum-manet-512.png`, `verbum-manet-512-maskable.png` existen en `icons/`.**
3. **HTTPS habilitado** (Cloudflare automático).
4. **`manifest.json` se sirve con `Content-Type: application/manifest+json`** (configurado en `_headers`).

### 18.5 Script de verificación de invariantes

Borrador del script Node que verifica los invariantes 18.3 (datos), pensado para correrse en CI:

```javascript
// scripts/verify-invariants.js
const fs = require('fs');
const path = require('path');

require('../data/courses-index.js');
require('../data/glossary.js');

const errors = [];

// 1. Longitud
if (COURSES_INDEX.length !== 20) {
  errors.push(`COURSES_INDEX tiene ${COURSES_INDEX.length} cursos, esperados 20`);
}

// 2. IDs únicos
const ids = COURSES_INDEX.map(c => c.id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) {
  errors.push(`IDs duplicados en COURSES_INDEX`);
}

// 3. Archivos físicos existen
for (const c of COURSES_INDEX) {
  const filePath = path.join(__dirname, '..', 'courses', c.segment, c.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Falta archivo físico: ${filePath}`);
  }
}

// 4. Frozen
if (!Object.isFrozen(COURSES_INDEX)) {
  errors.push(`COURSES_INDEX no está congelado`);
}
if (!Object.isFrozen(GLOSSARY)) {
  errors.push(`GLOSSARY no está congelado`);
}

// 5. Referencias data-glossary-term válidas
const coursesDir = path.join(__dirname, '..', 'courses');
const allHtml = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) allHtml.push(p);
  }
}
walk(coursesDir);

const refPattern = /data-glossary-term="([^"]+)"/g;
for (const file of allHtml) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = refPattern.exec(content)) !== null) {
    if (!GLOSSARY[match[1]]) {
      errors.push(`${file}: referencia rota a glosario "${match[1]}"`);
    }
  }
}

if (errors.length) {
  console.error('❌ Invariantes violados:');
  errors.forEach(e => console.error('  -', e));
  process.exit(1);
}
console.log('✅ Todos los invariantes se cumplen.');
```

---

## Cierre

Esta arquitectura es **deliberadamente simple**. Cada decisión refleja una convicción: que el contenido teológico merece infraestructura técnica que no envejezca, que no dependa de terceros, y que sea comprensible en su totalidad por una sola persona en una sola tarde.

Si dentro de diez años alguien quiere extender Verbum Manet Academy, encontrará que el código sigue siendo legible, ejecutable y mantenible. Esa es la apuesta arquitectónica: **longevidad por simplicidad**.

*Verbum Domini manet in aeternum.*

— Fin del documento —

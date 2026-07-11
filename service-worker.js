/* ============================================================================
   VERBUM MANET ACADEMY · service-worker.js
   ----------------------------------------------------------------------------
   PWA offline-first con estrategias diferenciadas (TEC-001).

   ALCANCE (elección "equilibrada"):
     · El SHELL (cascarón + CSS/JS/data) queda disponible offline desde la
       primera visita: se precachea en la instalación.
     · Los CURSOS y PÁGINAS visitados quedan offline DESPUÉS de verlos:
       se guardan en una caché de runtime al vuelo (stale-while-revalidate).
     · Los cursos NO visitados no se precachean (no inflamos la instalación).

   ACTUALIZACIÓN: silenciosa. Un SW nuevo toma el control en segundo plano
     (skipWaiting + clients.claim). El usuario recibe la versión nueva en su
     siguiente navegación sin avisos ni recargas forzadas.

   ----------------------------------------------------------------------------
   ⚠️  PROTOCOLO ANTI-OBSOLESCENCIA — LÉASE ANTES DE DESPLEGAR ⚠️

   El riesgo número uno de un Service Worker es servir versiones viejas y
   cacheadas que se niegan a actualizarse. Para evitarlo, este SW se apoya en
   UNA disciplina simple e innegociable:

     >>> CADA VEZ QUE DESPLIEGUES CAMBIOS, SUBE EL NÚMERO DE `CACHE_VERSION`. <<<

   Al cambiar CACHE_VERSION, los nombres de caché cambian, el evento `activate`
   borra TODAS las cachés viejas, y el shell se re-precachea fresco. Si olvidas
   subir la versión, los clientes pueden seguir viendo archivos antiguos del
   shell hasta que su caché expire por otras vías.

   Regla mnemónica: "tocaste css/, js/, data/, index.html o un curso → bump".
   ----------------------------------------------------------------------------

   ESTRATEGIAS POR TIPO DE PETICIÓN:
     · Navegación (request.mode === 'navigate', i.e. el documento HTML):
         NETWORK-FIRST con fallback a la copia cacheada de index.html.
         Motivo: el HTML es el punto de entrada; si cacheáramos cache-first,
         un deploy nuevo no se vería hasta purgar. Network-first da frescura
         y, sin red, cae al shell cacheado (la SPA resuelve la ruta por hash).
     · Shell estático precacheado (css/, js/, data/, manifest, iconos):
         CACHE-FIRST. Cambian de versión vía CACHE_VERSION, así que servir
         desde caché es seguro y rápido.
     · Fragmentos de curso/página (courses/*.html, pages/*.html):
         STALE-WHILE-REVALIDATE. Sirve la copia cacheada al instante (offline
         tras la 1ª visita) y en paralelo refresca desde la red para la próxima.
     · Todo lo demás same-origin (GET): network con fallback a caché.
     · Cross-origin (fuentes de Google/Fontshare, etc.):
         NO se intercepta. Pasa directo a la red. (El navegador ya las cachea
         por HTTP; gestionarlas aquí añade riesgo sin beneficio claro.)

   NOTA: las rutas del shell se listan en sus DOS formas posibles porque el
   index.html mezcla rutas de raíz (/icons/…, /site.webmanifest) y relativas
   (./css/…). Precachear ambas evita fallos de coincidencia (cf. aviso INV-04).
   ============================================================================ */

'use strict';

/* ---------------------------------------------------------------------------
   §1 · Versión y nombres de caché
   SUBE ESTE NÚMERO EN CADA DESPLIEGUE QUE TOQUE ARCHIVOS DEL SHELL O CURSOS.
   --------------------------------------------------------------------------- */
const CACHE_VERSION = 'v24';
const SHELL_CACHE   = `vma-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `vma-runtime-${CACHE_VERSION}`;

// Todas las cachés que ESTE SW considera suyas en esta versión.
const OWN_CACHES = new Set([SHELL_CACHE, RUNTIME_CACHE]);

/* ---------------------------------------------------------------------------
   §2 · Precaché del shell
   Solo lo imprescindible para arrancar offline. Los cursos NO van aquí.
   Se listan rutas relativas (./) que es como el index referencia css/js/data.
   --------------------------------------------------------------------------- */
const SHELL_ASSETS = [
  './',                       // raíz (resuelve a index.html en Pages)
  './index.html',
  './css/styles.css',
  './js/courseLoader.js',
  './js/study-panel.js',
  './js/app.js',
  './data/courses-index.js',
  './data/glossary.js',
  './data/bibliography.js',
  // Páginas estáticas base de la SPA (ligeras; mejoran el primer offline).
  './pages/home.html',
  './pages/about.html',
  './pages/courses.html',
  './pages/glossary.html',
];

// Iconos/manifest: el index los referencia con ruta de RAÍZ (/…). Se intentan
// aparte y de forma tolerante: si alguno falta, no debe abortar la instalación.
const SHELL_ROOT_ASSETS = [
  '/site.webmanifest',
  '/icons/favicon.svg',
  '/icons/favicon-32.png',
  '/icons/apple-touch-icon.png',
];

/* ---------------------------------------------------------------------------
   §3 · INSTALL — precachear el shell
   addAll es atómico: si una URL falla, falla todo. Por eso el shell crítico
   (SHELL_ASSETS) va con addAll, y los iconos opcionales van uno a uno con
   tolerancia a fallos para no romper la instalación por un icono ausente.
   --------------------------------------------------------------------------- */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Crítico: si esto falla, queremos saberlo (la instalación falla).
    await cache.addAll(SHELL_ASSETS);
    // Opcional/tolerante: iconos y manifest.
    await Promise.allSettled(
      SHELL_ROOT_ASSETS.map((url) => cache.add(url))
    );
    // Actualización silenciosa: el SW nuevo no espera a que cierren pestañas.
    await self.skipWaiting();
  })());
});

/* ---------------------------------------------------------------------------
   §4 · ACTIVATE — borrar cachés de versiones anteriores y tomar control
   Aquí es donde el bump de CACHE_VERSION limpia lo viejo.
   --------------------------------------------------------------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.map((name) => {
        // Borra cualquier caché "vma-*" que no sea de la versión actual.
        if (name.startsWith('vma-') && !OWN_CACHES.has(name)) {
          return caches.delete(name);
        }
        return undefined;
      })
    );
    // Toma control de las páginas ya abiertas sin requerir recarga.
    await self.clients.claim();
  })());
});

/* ---------------------------------------------------------------------------
   §5 · Utilidades de clasificación de peticiones
   --------------------------------------------------------------------------- */
function isHtmlFragment(url) {
  // Fragmentos inyectados por CourseLoader: courses/**.html y pages/**.html
  return /\/(courses|pages)\/.+\.html$/.test(url.pathname);
}

function isShellAsset(url) {
  // css/, js/, data/ same-origin → shell estático cacheable cache-first.
  return /\/(css|js|data)\/.+/.test(url.pathname);
}

/* ---------------------------------------------------------------------------
   §6 · Estrategias
   --------------------------------------------------------------------------- */

// NETWORK-FIRST con fallback a caché (para el documento de navegación).
async function networkFirstDoc(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const fresh = await fetch(request);
    // Guarda copia del index para servir offline en navegaciones futuras.
    cache.put('./index.html', fresh.clone());
    return fresh;
  } catch (err) {
    // Sin red: intenta la copia exacta y, si no, el index del shell.
    const cached = (await cache.match(request)) || (await cache.match('./index.html')) || (await cache.match('./'));
    if (cached) return cached;
    throw err;
  }
}

// CACHE-FIRST (para shell estático versionado).
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  const cache = await caches.open(SHELL_CACHE);
  cache.put(request, fresh.clone());
  return fresh;
}

// STALE-WHILE-REVALIDATE (para fragmentos de curso/página visitados).
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((fresh) => {
      // Solo cachea respuestas válidas y básicas (no opaques con error).
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })
    .catch(() => null);
  // Sirve lo cacheado al instante si existe; si no, espera a la red.
  return cached || (await network) || cache.match(request);
}

/* ---------------------------------------------------------------------------
   §7 · FETCH — enrutador de estrategias
   --------------------------------------------------------------------------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1) Solo GET. POST/PUT/etc. pasan directo (no se cachean).
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 2) Cross-origin (fuentes, CDNs): no interceptar. Deja pasar a la red.
  if (url.origin !== self.location.origin) return;

  // 3) Navegación de documento → network-first con fallback a shell.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstDoc(request));
    return;
  }

  // 4) Fragmentos de curso/página → stale-while-revalidate (offline tras ver).
  if (isHtmlFragment(url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 5) Shell estático (css/js/data) → cache-first.
  if (isShellAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 6) Resto same-origin (iconos, manifest, etc.) → cache-first tolerante.
  event.respondWith(
    cacheFirst(request).catch(() => fetch(request))
  );
});

/* ---------------------------------------------------------------------------
   §8 · Mensajes (gancho opcional)
   Permite que la página fuerce la activación inmediata si algún día se quiere
   pasar a "actualización con aviso". Hoy, con skipWaiting en install, no es
   imprescindible, pero el gancho queda disponible sin coste.
   --------------------------------------------------------------------------- */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/* ============================================================================
   FIN · service-worker.js · Verbum Manet Academy
   "Verbum Domini manet in aeternum."
   ============================================================================ */

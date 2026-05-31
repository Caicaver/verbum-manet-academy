/* ============================================================================
   VERBUM MANET ACADEMY · js/app.js · v5 · Paso 4
   ----------------------------------------------------------------------------
   Shell SPA · router por hash · gestión de tema, escala tipográfica, buscador
   transversal (cursos + glosario), drawer móvil, toggle del Pomodoro,
   tooltips del glosario por delegación, rotador de citas y atajos de teclado.

   Secciones:
     §1   Estado, selectores cacheados y construcción de rutas
     §2   Bootstrap · puente con CourseLoader y mensajería de navegación
     §3   Router · navigate(), updateActiveNav(), hashchange
     §4   Tema · light/dark, prefers-color-scheme, meta theme-color dinámico
     §5   Escala tipográfica · ciclo --fs-scale 1 → 2 → 3 → 1
     §6   Drawer móvil
     §7   Pomodoro · toggle de visibilidad (la lógica vive en study-panel.js)
     §8   Modal de búsqueda · Ctrl+K · cursos + glosario
     §9   Tooltip del glosario · delegación · hover, focus y tap-to-toggle
     §10  Rotador de citas alternantes
     §11  Overlay de atajos de teclado (?)
     §12  Atajos globales · Ctrl+K, P, ?, Esc
     §13  Pipeline post-navegación · hooks por fragmento
     §14  Init

   Convenciones:
     · IIFE para evitar contaminación del global salvo donde otros módulos
       (courseLoader, study-panel) necesitan acceso explícito.
     · Sin localStorage ni sessionStorage (constraint v4). Todo en memoria.
     · El módulo expone, por compatibilidad con courseLoader, las funciones
       initAccordion / initTabs / initGlossaryTooltip como shims no-op.
       (La lógica del glosario va por delegación en §9; los acordeones y
       tabs no se usan aún en los fragmentos v5.)
   ============================================================================ */

(function () {
  'use strict';

  /* ==========================================================================
     §1 · ESTADO Y SELECTORES
     ========================================================================== */

  /** Rutas estáticas (páginas no-curso) */
  const STATIC_ROUTES = {
    '#/':          './pages/home.html',
    '#/about':     './pages/about.html',
    '#/courses':   './pages/courses.html',
    '#/glossary':  './pages/glossary.html',
    '#/panel':     './pages/panel-estudio.html',
    '#/creed':     './pages/creed.html',
    '#/library':   './pages/library.html',
    '#/languages': './pages/languages.html',
    '#/resources': './pages/resources.html',
  };

  /** Rutas de curso construidas desde COURSES_INDEX al iniciar */
  const COURSE_ROUTES = {};

  /** Tabla unificada · se llena en §1.B */
  const ROUTES = {};

  /** Hex de la barra del navegador por tema (sincronizado con --color-bg) */
  const THEME_COLORS = {
    light: '#F4EFE4',
    dark:  '#0F1623',
  };

  /** Etiquetas accesibles para los tres niveles de escala tipográfica */
  const FS_LABELS = {
    1: 'normal',
    2: 'aumentado al 112 por ciento',
    3: 'aumentado al 125 por ciento',
  };

  /** Tooltips compactos para el botón de escala tipográfica */
  const FS_TOOLTIPS = { 1: 'Tamaño · normal', 2: 'Tamaño · +12%', 3: 'Tamaño · +25%' };

  /** ¿El usuario ha conmutado tema manualmente en esta sesión? */
  let userToggledTheme = false;

  /** Intervalo del rotador de citas · se limpia entre fragmentos */
  let quoteRotatorInterval = null;

  /** Índice del término del glosario actualmente con tooltip visible */
  let activeTooltipKey = null;

  /* ---- Selectores cacheados (rellenados en init) ---- */
  let htmlEl, mainEl, searchModal, searchInput, searchResults,
      pomodoroPanel, pomodoroOpenBtn, primaryNav, navToggle,
      themeToggle, fsCycle, searchOpen, pomodoroClose,
      glossaryTooltip;


  /* --------------------------------------------------------------------------
     §1.B · Construcción de rutas
     -------------------------------------------------------------------------- */
  function buildRoutes() {
    Object.assign(ROUTES, STATIC_ROUTES);

    if (Array.isArray(window.COURSES_INDEX)) {
      window.COURSES_INDEX.forEach((course) => {
        if (!course || !course.id || !course.segment || !course.file) return;
        const hash = `#/${course.id}`;
        const path = `./courses/${course.segment}/${course.file}`;
        COURSE_ROUTES[hash] = path;
        ROUTES[hash] = path;
      });
    }
  }


  /* ==========================================================================
     §2 · BOOTSTRAP · puentes con CourseLoader
     ========================================================================== */

  /**
   * Comprueba que CourseLoader exista. En caso contrario, define un fallback
   * mínimo para que la app no muera silenciosa.
   */
  function ensureCourseLoader() {
    if (window.CourseLoader && typeof window.CourseLoader.load === 'function') return;
    console.warn('[vma] CourseLoader no disponible — se usa fallback de fetch directo.');
    window.CourseLoader = {
      async load(path, container) {
        try {
          const res = await fetch(path);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          container.innerHTML = await res.text();
        } catch (err) {
          container.innerHTML =
            '<div class="error-state" role="alert" style="padding:var(--sp-2xl) var(--sp-md);text-align:center;color:var(--color-text-muted);">' +
            '<p>No se pudo cargar este fragmento.</p></div>';
        }
      },
    };
  }

  /**
   * Shims para que initFragmentComponents() de courseLoader.js no rompa si
   * llama por nombre a funciones que no existen aún.
   */
  function installFragmentShims() {
    if (typeof window.initAccordion !== 'function') window.initAccordion = function () {};
    if (typeof window.initTabs !== 'function') window.initTabs = function () {};
    if (typeof window.initGlossaryTooltip !== 'function') {
      // La delegación en §9 cubre toda la página; el shim queda como
      // contrato vacío con courseLoader.
      window.initGlossaryTooltip = function () {};
    }
  }


  /* ==========================================================================
     §3 · ROUTER
     ========================================================================== */

  /**
   * Navega a un hash, carga el fragmento correspondiente, sube scroll y
   * dispara los hooks post-fragmento.
   */
  async function navigate(hash) {
    const normalizedHash = hash && hash.startsWith('#/') ? hash : '#/';
    const path = ROUTES[normalizedHash] || ROUTES['#/'];

    await window.CourseLoader.load(path, mainEl);

    // Restablecer scroll al inicio del nuevo fragmento (sin smooth para que
    // no se peleé con prefers-reduced-motion).
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    updateActiveNav(normalizedHash);
    runFragmentHooks(normalizedHash);

    // Cualquier módulo externo puede engancharse aquí (study-panel.js
    // inicializa el dashboard del Panel cuando hash === '#/panel')
    window.dispatchEvent(
      new CustomEvent('vma:navigated', { detail: { hash: normalizedHash, path } })
    );
  }

  /**
   * Marca el enlace activo en navegación según el hash actual.
   * Caso especial: el enlace de "Cursos" queda activo también cuando se está
   * dentro de un curso individual.
   */
  function updateActiveNav(hash) {
    const isCourseHash = !!COURSE_ROUTES[hash];

    document.querySelectorAll('[data-nav]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      let active = href === hash;

      // Cursos activo también si estamos en un curso individual
      if (href === '#/courses' && isCourseHash) active = true;

      link.classList.toggle('is-active', active);
    });
  }


  /* ==========================================================================
     §4 · TEMA · light / dark
     ========================================================================== */

  /**
   * Aplica un tema y sincroniza meta theme-color, aria-label del toggle.
   * Si origin === 'user', registra que el usuario tocó el toggle.
   */
  function applyTheme(theme, origin) {
    htmlEl.setAttribute('data-theme', theme);
    syncMetaThemeColor(theme);
    syncThemeToggleA11y(theme);
    if (origin === 'user') userToggledTheme = true;
  }

  function toggleTheme() {
    const current = htmlEl.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, 'user');
  }

  /**
   * Actualiza el meta theme-color para que la barra del navegador móvil
   * acompañe el tema. Quita las restricciones de media para que el valor
   * actual prevalezca con independencia de la preferencia del sistema.
   */
  function syncMetaThemeColor(theme) {
    const color = THEME_COLORS[theme] || THEME_COLORS.light;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.removeAttribute('media');
      meta.setAttribute('content', color);
    });
  }

  function syncThemeToggleA11y(theme) {
    if (!themeToggle) return;
    const target = theme === 'dark' ? 'claro' : 'oscuro';
    themeToggle.setAttribute('aria-label', `Cambiar a modo ${target}`);
    themeToggle.setAttribute('data-tooltip', `Tema · modo ${theme === 'dark' ? 'oscuro' : 'claro'}`);
  }

  /**
   * Tema inicial:
   *  · El HTML siempre arranca con data-theme="light" (v5.A.1) para evitar
   *    parpadeo de tema durante el render previo a JS.
   *  · Si el usuario tiene prefers-color-scheme: dark y aún no ha pulsado
   *    el toggle, se respeta y se conmuta a oscuro.
   */
  function initThemeFromPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light', 'system');

    // Si las preferencias del sistema cambian en plena sesión y el usuario
    // no ha tocado el toggle, seguimos la preferencia.
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!userToggledTheme) applyTheme(e.matches ? 'dark' : 'light', 'system');
      });
    } catch (_) { /* Safari < 14 sin addEventListener · sin acción */ }
  }


  /* ==========================================================================
     §5 · ESCALA TIPOGRÁFICA · ciclo 1 → 2 → 3 → 1
     ========================================================================== */

  function getFsLevel() {
    const v = parseInt(htmlEl.getAttribute('data-fs') || '1', 10);
    return v >= 1 && v <= 3 ? v : 1;
  }

  function setFsLevel(level) {
    const safe = level >= 1 && level <= 3 ? level : 1;
    htmlEl.setAttribute('data-fs', String(safe));
    syncFsCycleA11y(safe);
  }

  function cycleFsLevel() {
    const current = getFsLevel();
    const next = current === 3 ? 1 : current + 1;
    setFsLevel(next);
  }

  function syncFsCycleA11y(level) {
    if (!fsCycle) return;
    const next = level === 3 ? 1 : level + 1;
    const label = FS_LABELS[level];
    const nextLabel = FS_LABELS[next];
    fsCycle.setAttribute(
      'aria-label',
      `Tamaño del texto: ${label}. Pulsar para cambiar a ${nextLabel}.`
    );
    fsCycle.setAttribute('data-tooltip', FS_TOOLTIPS[level]);
  }


  /* ==========================================================================
     §6 · DRAWER MÓVIL
     ========================================================================== */

  function setNavOpen(open) {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  }

  function toggleNav() {
    const open = !primaryNav.classList.contains('is-open');
    setNavOpen(open);
  }


  /* ==========================================================================
     §7 · POMODORO · toggle de visibilidad
     · La lógica del temporizador vive en js/study-panel.js (Paso 5).
     · Aquí solo gestionamos la apertura/cierre del panel flotante.
     ========================================================================== */

  function setPomodoroOpen(open) {
    if (!pomodoroPanel || !pomodoroOpenBtn) return;
    pomodoroPanel.hidden = !open;
    pomodoroOpenBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      // Notificar a study-panel.js para que (re)pinte estado y, si
      // procede, ponga foco en el botón principal del temporizador.
      window.dispatchEvent(new CustomEvent('vma:pomodoro:opened'));
    }
  }

  function togglePomodoro() {
    setPomodoroOpen(!!pomodoroPanel?.hidden);
  }


  /* ==========================================================================
     §8 · MODAL DE BÚSQUEDA · cursos + glosario
     ========================================================================== */

  /**
   * Normaliza un texto para comparación accent-insensitive y minúsculas.
   */
  function normalize(s) {
    return (s || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function escapeHtml(s) {
    return (s || '').toString().replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));
  }

  /**
   * Resalta ocurrencias case-insensitive del query en el texto.
   * Trabaja sobre el texto original (sin normalizar acentos) para preservar
   * la tipografía visual del resultado.
   */
  function highlight(text, query) {
    if (!text) return '';
    if (!query) return escapeHtml(text);
    const escQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escQ, 'gi');
    let out = '';
    let lastIdx = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      out += escapeHtml(text.substring(lastIdx, m.index));
      out += '<mark>' + escapeHtml(m[0]) + '</mark>';
      lastIdx = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++; // protección contra match vacío
    }
    out += escapeHtml(text.substring(lastIdx));
    return out;
  }

  /**
   * Construye un array unificado de elementos buscables a partir de
   * COURSES_INDEX y GLOSSARY.
   */
  function buildSearchIndex() {
    const items = [];

    if (Array.isArray(window.COURSES_INDEX)) {
      window.COURSES_INDEX.forEach((course) => {
        if (!course || !course.id || !course.title) return;
        items.push({
          kind: 'course',
          hash: `#/${course.id}`,
          title: course.title,
          excerpt: course.description || '',
          kindLabel: course.segment
            ? `Curso · ${prettySegmentLabel(course.segment)}`
            : 'Curso',
          searchable: [
            course.title,
            course.description,
            Array.isArray(course.tags) ? course.tags.join(' ') : '',
            course.level,
            course.duration,
          ].filter(Boolean).join(' · '),
        });
      });
    }

    if (window.GLOSSARY && typeof window.GLOSSARY === 'object') {
      Object.keys(window.GLOSSARY).forEach((key) => {
        const entry = window.GLOSSARY[key];
        if (!entry) return;
        items.push({
          kind: 'glossary',
          hash: `#/glossary`,
          termKey: key,
          title: entry.term || key,
          excerpt: entry.definition || '',
          kindLabel: 'Glosario',
          searchable: [entry.term, key, entry.definition].filter(Boolean).join(' · '),
        });
      });
    }

    return items;
  }

  function prettySegmentLabel(segment) {
    // segment-1 → Segmento I
    const m = /^segment-(\d+)$/.exec(segment || '');
    if (!m) return segment;
    const n = parseInt(m[1], 10);
    const romans = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
    return `Segmento ${romans[n] || n}`;
  }

  /**
   * Ejecuta la búsqueda y devuelve hasta 10 resultados ordenados por
   * relevancia simple (match en título > tags > descripción).
   */
  function runSearch(query) {
    const q = normalize(query).trim();
    if (q.length < 2) return [];

    const index = buildSearchIndex();
    const results = [];

    for (const item of index) {
      const normTitle = normalize(item.title);
      const normSearchable = normalize(item.searchable);

      let score = 0;
      if (normTitle === q) score += 100;
      else if (normTitle.startsWith(q)) score += 60;
      else if (normTitle.includes(q)) score += 40;
      if (normSearchable.includes(q)) score += 10;

      if (score > 0) {
        results.push({ item, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10).map((r) => r.item);
  }

  function renderSearchResults(query, results) {
    if (!searchResults) return;

    if (!query || query.trim().length < 2) {
      searchResults.innerHTML =
        '<p class="search-modal__hint">Comience a escribir para buscar en cursos y glosario.</p>';
      return;
    }

    if (results.length === 0) {
      searchResults.innerHTML =
        '<p class="search-modal__hint">No se encontraron resultados para «' +
        escapeHtml(query) +
        '».</p>';
      return;
    }

    const html = results.map((item) => {
      const href = item.hash;
      const dataAttrs = item.kind === 'glossary'
        ? ` data-search-term="${escapeHtml(item.termKey || '')}"`
        : '';
      return `
        <a class="search-result" href="${escapeHtml(href)}" data-nav data-search-result${dataAttrs}>
          <p class="search-result__kind">${escapeHtml(item.kindLabel)}</p>
          <h3 class="search-result__title">${highlight(item.title, query)}</h3>
          <p class="search-result__excerpt">${highlight(truncate(item.excerpt, 180), query)}</p>
        </a>
      `;
    }).join('');

    searchResults.innerHTML = html;
  }

  function truncate(text, max) {
    if (!text) return '';
    if (text.length <= max) return text;
    return text.substring(0, max - 1).trimEnd() + '…';
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      if (searchInput) {
        searchInput.value = '';
        renderSearchResults('', []);
        searchInput.focus();
      }
    });
  }

  function closeSearch() {
    if (!searchModal || searchModal.hidden) return;
    searchModal.hidden = true;
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
  }

  function handleSearchInput() {
    const q = searchInput.value;
    const results = runSearch(q);
    renderSearchResults(q, results);
  }

  /**
   * Click en un resultado: navega y cierra modal.
   * Para resultados de glosario, además se guarda el término objetivo para
   * que el fragmento de glossary pueda hacer scroll al término concreto si
   * lo implementa.
   */
  function handleSearchResultClick(event) {
    const result = event.target.closest('[data-search-result]');
    if (!result) return;
    const termKey = result.getAttribute('data-search-term');
    if (termKey) {
      window.__vmaPendingGlossaryTerm = termKey; // pickup desde glossary.html
    }
    closeSearch();
    // El click natural sigue su curso y cambia el hash, disparando navigate().
  }


  /* ==========================================================================
     §9 · TOOLTIP DEL GLOSARIO · delegación
     · Maneja hover (desktop), focus (teclado) y tap-to-toggle (touch).
     · Cierra al pulsar fuera (audit §4.3).
     ========================================================================== */

  function getGlossaryEntryForKey(key) {
    if (!window.GLOSSARY || typeof window.GLOSSARY !== 'object') return null;
    return window.GLOSSARY[key] || null;
  }

  function positionTooltip(termEl) {
    if (!glossaryTooltip) return;
    const rect = termEl.getBoundingClientRect();
    const ttRect = glossaryTooltip.getBoundingClientRect();
    const margin = 8;

    let top = window.scrollY + rect.bottom + margin;
    let left =
      window.scrollX + rect.left + rect.width / 2 - ttRect.width / 2;

    // Si se sale por arriba, lo colocamos arriba del término
    if (top + ttRect.height > window.scrollY + window.innerHeight - margin) {
      top = window.scrollY + rect.top - ttRect.height - margin;
    }

    // Clamp horizontal al viewport
    const minLeft = window.scrollX + margin;
    const maxLeft = window.scrollX + window.innerWidth - ttRect.width - margin;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    glossaryTooltip.style.top = `${top}px`;
    glossaryTooltip.style.left = `${left}px`;
  }

  function showGlossaryTooltip(termEl) {
    if (!glossaryTooltip || !termEl) return;
    const key = termEl.getAttribute('data-glossary-term');
    const entry = getGlossaryEntryForKey(key);
    if (!entry) return;

    glossaryTooltip.innerHTML =
      `<span class="glossary-tooltip__term">${escapeHtml(entry.term || key)}</span>` +
      `<span class="glossary-tooltip__def">${escapeHtml(entry.definition || '')}</span>`;

    glossaryTooltip.hidden = false;
    activeTooltipKey = key;
    positionTooltip(termEl);
  }

  function hideGlossaryTooltip() {
    if (!glossaryTooltip) return;
    glossaryTooltip.hidden = true;
    activeTooltipKey = null;
  }

  function bindGlossaryDelegation() {
    if (!glossaryTooltip) return;

    document.addEventListener('mouseover', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) showGlossaryTooltip(term);
    });

    document.addEventListener('mouseout', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term && !e.relatedTarget?.closest('[data-glossary-term]')) {
        hideGlossaryTooltip();
      }
    });

    document.addEventListener('focusin', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) showGlossaryTooltip(term);
    });

    document.addEventListener('focusout', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) hideGlossaryTooltip();
    });

    // Tap-to-toggle en touch · cerrar también al pulsar fuera
    document.addEventListener('click', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) {
        const key = term.getAttribute('data-glossary-term');
        if (activeTooltipKey === key) {
          hideGlossaryTooltip();
        } else {
          showGlossaryTooltip(term);
        }
        return;
      }
      // Click fuera de un término y fuera del tooltip → cerrar
      if (!e.target.closest('.glossary-tooltip')) {
        hideGlossaryTooltip();
      }
    });

    // Reajustar posición si la ventana se redimensiona con tooltip abierto
    window.addEventListener('resize', () => {
      if (!activeTooltipKey) return;
      const active = document.querySelector(
        `[data-glossary-term="${activeTooltipKey}"]`
      );
      if (active) positionTooltip(active);
      else hideGlossaryTooltip();
    });
  }


  /* ==========================================================================
     §10 · ROTADOR DE CITAS ALTERNANTES
     · Se invoca en cada navegación; si no hay .quote-item se vuelve no-op.
     · Respeta prefers-reduced-motion (la CSS además ya lo gestiona).
     ========================================================================== */

  function initQuoteRotator() {
    if (quoteRotatorInterval) {
      clearInterval(quoteRotatorInterval);
      quoteRotatorInterval = null;
    }

    const items = document.querySelectorAll('.quote-item');
    if (items.length < 2) return;

    // Si reduced-motion, la CSS muestra todas en pila estática · sin JS.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let idx = Array.from(items).findIndex((el) => el.classList.contains('is-active'));
    if (idx < 0) idx = 0;
    items[idx].classList.add('is-active');

    quoteRotatorInterval = setInterval(() => {
      items[idx].classList.remove('is-active');
      idx = (idx + 1) % items.length;
      items[idx].classList.add('is-active');
    }, 8000);
  }


  /* ==========================================================================
     §11 · OVERLAY DE ATAJOS · ?
     ========================================================================== */

  function showShortcutsHelp() {
    if (document.getElementById('shortcuts-modal')) return;

    const kbd = (k) =>
      `<kbd style="font-family:var(--font-mono);font-size:0.78rem;padding:0.25rem 0.55rem;background:var(--color-bg-sunken);border:var(--border-thin) solid var(--color-border);border-radius:var(--radius-xs);color:var(--color-text);">${k}</kbd>`;

    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.className = 'search-modal'; // reaprovecha el frame del search-modal
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'shortcuts-modal-title');

    modal.innerHTML = `
      <div class="search-modal__backdrop" data-shortcuts-dismiss></div>
      <div class="search-modal__panel" style="max-width:32rem;">
        <header class="search-modal__header">
          <h2 class="search-modal__title" id="shortcuts-modal-title">Atajos de teclado</h2>
          <button type="button" class="search-modal__close" data-shortcuts-dismiss aria-label="Cerrar atajos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
        </header>
        <dl style="display:grid;grid-template-columns:auto 1fr;gap:0.9rem 1.4rem;align-items:baseline;padding:1.25rem 1.5rem 1.75rem;font-family:var(--font-body);font-size:var(--text-sm);color:var(--color-text);margin:0;">
          <dt style="margin:0;">${kbd('Ctrl K')}</dt>
          <dd style="margin:0;">Abrir el buscador</dd>
          <dt style="margin:0;">${kbd('P')}</dt>
          <dd style="margin:0;">Sesión de estudio (Pomodoro)</dd>
          <dt style="margin:0;">${kbd('?')}</dt>
          <dd style="margin:0;">Mostrar esta lista de atajos</dd>
          <dt style="margin:0;">${kbd('Esc')}</dt>
          <dd style="margin:0;">Cerrar el diálogo activo</dd>
        </dl>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const close = () => {
      modal.remove();
      // Solo desbloqueamos scroll si no hay otro modal abierto
      if (searchModal && !searchModal.hidden) return;
      document.body.style.overflow = '';
    };

    modal.querySelectorAll('[data-shortcuts-dismiss]').forEach((el) =>
      el.addEventListener('click', close)
    );

    // Foco en el botón de cerrar para que Tab y Esc funcionen de inmediato
    requestAnimationFrame(() => {
      const closeBtn = modal.querySelector('.search-modal__close');
      if (closeBtn) closeBtn.focus();
    });

    // El handler global de Esc en §12 también lo cierra (revisa primero
    // shortcuts-modal). Pero dejamos una salida local por robustez:
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }


  /* ==========================================================================
     §12 · ATAJOS GLOBALES · Ctrl+K · P · ? · Esc
     ========================================================================== */

  function isTypingTarget(target) {
    if (!target) return false;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (target.isContentEditable) return true;
    return false;
  }

  function handleGlobalKeydown(e) {
    // Ctrl/Cmd + K → buscar (siempre, incluso desde inputs)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openSearch();
      return;
    }

    // Esc → cerrar el overlay más superficial primero
    if (e.key === 'Escape') {
      const shortcutsModal = document.getElementById('shortcuts-modal');
      if (shortcutsModal) {
        shortcutsModal.remove();
        // Si search está abierto debajo, mantenemos overflow bloqueado
        if (!searchModal || searchModal.hidden) document.body.style.overflow = '';
        return;
      }
      if (searchModal && !searchModal.hidden) {
        closeSearch();
        return;
      }
      if (pomodoroPanel && !pomodoroPanel.hidden) {
        setPomodoroOpen(false);
        return;
      }
      if (primaryNav && primaryNav.classList.contains('is-open')) {
        setNavOpen(false);
        return;
      }
      hideGlossaryTooltip();
      return;
    }

    // Atajos de una sola tecla — solo fuera de inputs y sin modificadores
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (isTypingTarget(e.target)) return;

    if (e.key === 'p' || e.key === 'P') {
      // Evitar conflicto con Ctrl+P (impresión) ya filtrado arriba
      e.preventDefault();
      togglePomodoro();
      return;
    }

    if (e.key === '?') {
      e.preventDefault();
      showShortcutsHelp();
      return;
    }
  }


  /* ==========================================================================
     §13 · PIPELINE POST-FRAGMENTO
     · Hooks que se ejecutan después de cada navigate().
     · El rotador de citas se reinicia limpio en cada fragmento.
     · Cualquier módulo externo puede escuchar 'vma:navigated' (ver §3).
     ========================================================================== */

  function runFragmentHooks(_hash) {
    initQuoteRotator();
    enhanceUnitAccordions();
  }


  /* ==========================================================================
     §13.bis · ACORDEÓN DE UNIDADES (divulgación progresiva)
     · Realza, tras la inyección del fragmento, cada <section class="unit">
       de los cursos convirtiendo su <header class="unit__header"> en un
       disparador accesible y plegando el resto del contenido de la unidad
       (lecciones + cuestionario) en un panel colapsable.
     · No requiere tocar el HTML de los cursos ni insertar <script> en los
       fragmentos: todo el realce ocurre aquí, sobre el DOM ya inyectado.
     · Comportamiento: todas las unidades CERRADAS al entrar; acordeón
       INDEPENDIENTE (varias pueden abrirse a la vez).
     · Si el hash o un enlace interno apunta a un id dentro de una unidad
       cerrada, esa unidad se abre antes de desplazarse.
     ========================================================================== */

  function enhanceUnitAccordions() {
    if (!mainEl) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Bloques plegables: las unidades del curso y, además, la actividad
    // final integradora (que vive fuera de las unidades, al cierre). Cada
    // entrada define el selector del bloque y el de su encabezado-disparador.
    const blocks = [];
    mainEl.querySelectorAll('.unit').forEach((el) =>
      blocks.push({ el: el, headerSel: ':scope > .unit__header' })
    );
    mainEl.querySelectorAll('.activity--final').forEach((el) =>
      blocks.push({ el: el, headerSel: ':scope > .activity__head, :scope > .activity__header' })
    );
    // Algunos cursos (hermenéutica, intro a la teología) cierran con una
    // <section class="rubric"> independiente en lugar de .activity--final.
    // Se pliega igual, usando su .rubric__title como disparador. Se excluyen
    // las rúbricas que viven dentro de una actividad (esas ya van con ella).
    mainEl.querySelectorAll('section.rubric').forEach((el) => {
      if (el.closest('.activity')) return;
      blocks.push({ el: el, headerSel: ':scope > .rubric__title' });
    });
    if (!blocks.length) return;

    blocks.forEach((entry, idx) => {
      const unit = entry.el;
      // Evitar doble realce si el hook corre más de una vez sobre el mismo DOM.
      if (unit.dataset.accordion === 'ready') return;

      const header = unit.querySelector(entry.headerSel);
      if (!header) return;

      // Recoger todo lo que va DESPUÉS del header dentro del bloque
      // (lecciones, cuestionario, rúbrica, etc.) para envolverlo en un panel.
      const panelNodes = [];
      let node = header.nextSibling;
      while (node) {
        panelNodes.push(node);
        node = node.nextSibling;
      }
      if (!panelNodes.length) return;

      const panel = document.createElement('div');
      panel.className = 'unit__panel';
      const panelId = (unit.id || 'unit-' + idx) + '-panel';
      panel.id = panelId;
      panelNodes.forEach((n) => panel.appendChild(n));
      unit.appendChild(panel);

      // Convertir el header en disparador accesible.
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'unit__toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', panelId);
      // Mover el contenido del header dentro del botón para que todo sea clicable.
      while (header.firstChild) btn.appendChild(header.firstChild);
      // Indicador visual (chevron).
      const chevron = document.createElement('span');
      chevron.className = 'unit__chevron';
      chevron.setAttribute('aria-hidden', 'true');
      btn.appendChild(chevron);
      header.appendChild(btn);

      // Estado inicial: cerrado.
      unit.classList.add('unit--collapsible');
      panel.hidden = true;
      panel.style.maxHeight = '0px';

      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeUnit(unit, btn, panel, reduce);
        else openUnit(unit, btn, panel, reduce);
      });

      unit.dataset.accordion = 'ready';
    });

    // Si hay un ancla pendiente (hash interno) que cae dentro de una unidad
    // cerrada, abrir esa unidad y desplazarse.
    revealHashTarget(reduce);
  }

  function openUnit(unit, btn, panel, reduce) {
    btn.setAttribute('aria-expanded', 'true');
    unit.classList.add('unit--open');
    panel.hidden = false;
    if (reduce) {
      panel.style.maxHeight = 'none';
      return;
    }
    // Animación max-height: medir el alto real y animar hacia él.
    panel.style.maxHeight = panel.scrollHeight + 'px';
    // Tras la transición, soltar el límite para permitir contenido dinámico.
    const onEnd = (e) => {
      if (e.propertyName !== 'max-height') return;
      if (btn.getAttribute('aria-expanded') === 'true') panel.style.maxHeight = 'none';
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
  }

  function closeUnit(unit, btn, panel, reduce) {
    btn.setAttribute('aria-expanded', 'false');
    unit.classList.remove('unit--open');
    if (reduce) {
      panel.style.maxHeight = '0px';
      panel.hidden = true;
      return;
    }
    // Fijar el alto actual antes de animar a 0 (si estaba en 'none').
    panel.style.maxHeight = panel.scrollHeight + 'px';
    // Forzar reflujo para que la transición arranque desde el alto medido.
    void panel.offsetHeight;
    panel.style.maxHeight = '0px';
    const onEnd = (e) => {
      if (e.propertyName !== 'max-height') return;
      if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true;
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
  }

  // Abre la unidad que contenga el id objetivo (del hash interno) y se desplaza.
  function revealHashTarget(reduce) {
    const hash = location.hash;
    if (!hash || hash.startsWith('#/') || hash.length < 2) return;
    const target = mainEl.querySelector(hash.replace(/[^#\w:.\-]/g, ''));
    if (!target) return;
    const unit = target.closest('.unit');
    if (unit && unit.classList.contains('unit--collapsible') && !unit.classList.contains('unit--open')) {
      const btn = unit.querySelector(':scope > .unit__header > .unit__toggle');
      const panel = unit.querySelector(':scope > .unit__panel');
      if (btn && panel) openUnit(unit, btn, panel, reduce);
    }
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }


  /* ==========================================================================
     §14 · INIT
     ========================================================================== */

  function cacheDom() {
    htmlEl          = document.documentElement;
    mainEl          = document.getElementById('main-content');
    searchModal     = document.getElementById('search-modal');
    searchInput     = document.getElementById('search-input');
    searchResults   = document.getElementById('search-results');
    pomodoroPanel   = document.getElementById('pomodoro-panel');
    pomodoroOpenBtn = document.getElementById('pomodoro-open');
    pomodoroClose   = document.getElementById('pomodoro-close');
    primaryNav      = document.getElementById('primary-nav');
    navToggle       = document.getElementById('nav-toggle');
    themeToggle     = document.getElementById('theme-toggle');
    fsCycle         = document.getElementById('fs-cycle');
    searchOpen      = document.getElementById('search-open');
    glossaryTooltip = document.getElementById('glossary-tooltip');
  }

  function bindShellEvents() {
    // Tema
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // Escala tipográfica
    if (fsCycle) {
      fsCycle.addEventListener('click', cycleFsLevel);
    }

    // Drawer
    if (navToggle) {
      navToggle.addEventListener('click', toggleNav);
    }

    // Pomodoro · toggle de visibilidad (la lógica vive en study-panel.js)
    if (pomodoroOpenBtn) {
      pomodoroOpenBtn.addEventListener('click', () => setPomodoroOpen(true));
    }
    if (pomodoroClose) {
      pomodoroClose.addEventListener('click', () => setPomodoroOpen(false));
    }

    // Búsqueda
    if (searchOpen) {
      searchOpen.addEventListener('click', openSearch);
    }
    if (searchInput) {
      searchInput.addEventListener('input', handleSearchInput);
    }
    if (searchModal) {
      // Dismiss en backdrop + botón de cierre
      searchModal.querySelectorAll('[data-search-dismiss]').forEach((el) =>
        el.addEventListener('click', closeSearch)
      );
      // Click en resultado · captura previa al hashchange para flag de glosario
      searchResults?.addEventListener('click', handleSearchResultClick);
    }
  }

  function bindNavCloseOnRoute() {
    // Cualquier click en un enlace de navegación dentro del drawer lo cierra.
    // (Es defensivo: hashchange también lo dispararía abajo.)
    if (primaryNav) {
      primaryNav.addEventListener('click', (e) => {
        if (e.target.closest('a[data-nav]')) setNavOpen(false);
      });
    }
  }

  function bindHashRouting() {
    window.addEventListener('hashchange', () => {
      const hash = location.hash;

      // Distinguir rutas SPA (#/algo) de anclas internas dentro del
      // fragmento actual (#letter-A, #term-x, #unidad-1...). Solo las
      // rutas recargan contenido; las anclas internas hacen scroll al
      // elemento sin tocar el fragmento (de lo contrario el router las
      // forzaría a '#/' y devolvería al inicio).
      const isRoute = !hash || hash.startsWith('#/');

      if (isRoute) {
        navigate(hash);
      } else {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          // Si el destino vive dentro de una unidad colapsada, abrirla antes
          // de desplazarse (de lo contrario el scroll iría a algo oculto).
          const unit = target.closest('.unit');
          if (unit && unit.classList.contains('unit--collapsible') && !unit.classList.contains('unit--open')) {
            const btn = unit.querySelector(':scope > .unit__header > .unit__toggle');
            const panel = unit.querySelector(':scope > .unit__panel');
            if (btn && panel) openUnit(unit, btn, panel, reduce);
          }
          target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }
      }

      // Cerrar overlays al navegar
      setNavOpen(false);
      closeSearch();
      hideGlossaryTooltip();
    });
  }

  async function bootstrap() {
    cacheDom();
    buildRoutes();
    installFragmentShims();
    ensureCourseLoader();

    // Estado visual de la toolbar antes de cualquier interacción
    initThemeFromPreference();
    syncFsCycleA11y(getFsLevel());
    syncThemeToggleA11y(htmlEl.getAttribute('data-theme') || 'light');
    setNavOpen(false);
    setPomodoroOpen(false);

    bindShellEvents();
    bindNavCloseOnRoute();
    bindGlossaryDelegation();
    bindHashRouting();
    document.addEventListener('keydown', handleGlobalKeydown);

    // Primera navegación
    await navigate(location.hash || '#/');
  }

  // El propio script lleva defer · DOM ya parseado al ejecutarse.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }


  /* ==========================================================================
     EXPORTS · puente con otros módulos
     ========================================================================== */
  window.VMA = window.VMA || {};
  Object.assign(window.VMA, {
    navigate,                  // permite a study-panel.js redirigir si lo necesita
    openSearch,
    closeSearch,
    togglePomodoro,
    setPomodoroOpen,
    showShortcutsHelp,
    applyTheme,
    setFsLevel,
    getFsLevel,
    hideGlossaryTooltip,
    showGlossaryTooltip,
    // Búsqueda accesible por programa (útil para tests o paneles)
    runSearch,
  });

})();

/* ============================================================================
   FIN DE js/app.js · Verbum Manet Academy · v5 · Paso 4
   ============================================================================ */

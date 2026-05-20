/* ============================================================================
 * VERBUM MANET ACADEMY · courseLoader.js
 *
 * Módulo encapsulado (IIFE) responsable de la carga de fragmentos HTML
 * (páginas y cursos) dentro del contenedor principal de la SPA.
 *
 * Responsabilidades:
 *   · fetch de fragmentos .html con deduplicación de peticiones concurrentes
 *   · caché en memoria (Map) para navegación instantánea a recursos ya vistos
 *   · esqueleto (skeleton) durante la carga · estado de error si falla
 *   · inyección del HTML, actualización de <title>, control de aria-busy
 *   · re-inicialización de componentes interactivos tras cada inyección:
 *       - acordeones basados en <button> (los <details> son nativos)
 *       - tabs con patrón ARIA completo (flechas ← → para navegación)
 *       - tooltips de glosario con posicionamiento viewport-safe
 *
 * Se expone como `window.CourseLoader = { load, preload, clearCache }`.
 * Depende opcionalmente de `window.GLOSSARY` para los tooltips.
 * ========================================================================= */

/* global GLOSSARY */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------------
   *  Estado interno
   * --------------------------------------------------------------------- */
  const cache = new Map();        // path → html string
  const pending = new Map();      // path → Promise<string> (deduplicación)

  const ERROR_TITLE = 'No pudimos cargar esta sección';
  const ERROR_BODY  = 'Verifica tu conexión a internet e intenta de nuevo. ' +
                      'Si el problema persiste, recarga la página completa.';


  /* ------------------------------------------------------------------------
   *  API pública — load()
   *
   *  @param {string} path       Ruta relativa al fragmento HTML a cargar
   *  @param {Element} container Contenedor donde inyectar el contenido
   *  @param {Object} options
   *    @param {boolean} [options.skipSkeleton=false] Omitir el skeleton loader
   *    @param {Function} [options.onSuccess]         Callback(container) tras éxito
   *    @param {Function} [options.onError]           Callback(error) tras fallo
   *    @param {AbortSignal} [options.signal]         Señal de aborto opcional
   * --------------------------------------------------------------------- */
  async function load(path, container, options) {
    options = options || {};
    if (!container) {
      throw new Error('CourseLoader.load: el contenedor es obligatorio');
    }

    container.setAttribute('aria-busy', 'true');
    if (!options.skipSkeleton) showSkeleton(container);

    try {
      const html = await fetchHtml(path, options.signal);
      container.innerHTML = html;
      container.setAttribute('aria-busy', 'false');

      updateDocumentTitle(container);
      initFragmentComponents(container);

      // Evento para extensiones futuras (analítica, deeplinks, etc.)
      container.dispatchEvent(new CustomEvent('vma:fragment-loaded', {
        bubbles: true,
        detail: { path, fromCache: cache.has(path) }
      }));

      if (typeof options.onSuccess === 'function') {
        options.onSuccess(container);
      }
    } catch (err) {
      container.setAttribute('aria-busy', 'false');
      showError(container, err);
      if (typeof options.onError === 'function') options.onError(err);
      // Log silenciado en producción pero visible en devtools
      if (global.console) console.error('[CourseLoader]', err);
    }
  }


  /* ------------------------------------------------------------------------
   *  API pública — preload()
   *  Solicita un fragmento sin renderizarlo, para calentar la caché
   * --------------------------------------------------------------------- */
  function preload(path) {
    if (!path || cache.has(path) || pending.has(path)) return;
    fetchHtml(path).catch(function () { /* silencioso */ });
  }


  /* ------------------------------------------------------------------------
   *  API pública — clearCache()
   *  Invalida la caché de un path específico o completa (sin argumentos)
   * --------------------------------------------------------------------- */
  function clearCache(path) {
    if (path) cache.delete(path);
    else cache.clear();
  }


  /* ------------------------------------------------------------------------
   *  Fetch con caché + deduplicación
   * --------------------------------------------------------------------- */
  async function fetchHtml(path, signal) {
    if (cache.has(path)) return cache.get(path);
    if (pending.has(path)) return pending.get(path);

    const promise = (async function () {
      const res = await fetch(path, {
        credentials: 'same-origin',
        headers: { 'Accept': 'text/html, */*;q=0.8' },
        signal: signal
      });
      if (!res.ok) {
        throw new Error('HTTP ' + res.status + ' al cargar ' + path);
      }
      const text = await res.text();
      cache.set(path, text);
      return text;
    })();

    pending.set(path, promise);
    try {
      return await promise;
    } finally {
      pending.delete(path);
    }
  }


  /* ------------------------------------------------------------------------
   *  Renderizado de estados: skeleton, error
   * --------------------------------------------------------------------- */
  function showSkeleton(container) {
    container.innerHTML =
      '<div class="skeleton-wrap" aria-label="Cargando contenido…">' +
        '<div class="skeleton skeleton--heading"></div>' +
        '<div class="skeleton skeleton--text"></div>' +
        '<div class="skeleton skeleton--text"></div>' +
        '<div class="skeleton skeleton--text" style="width:68%"></div>' +
        '<div class="skeleton skeleton--block" style="margin-top:var(--space-lg);"></div>' +
      '</div>';
  }

  function showError(container, err) {
    const detail = escapeHtml((err && err.message) ? err.message : 'desconocido');
    container.innerHTML =
      '<section class="error-state container container--narrow" role="alert">' +
        '<p class="card__eyebrow">Error de carga</p>' +
        '<h1 class="error-state__title">' + ERROR_TITLE + '</h1>' +
        '<p class="error-state__body">' + ERROR_BODY + '</p>' +
        '<p class="error-state__body" style="font-size: var(--text-xs); color: var(--text-faint);">' +
          'Detalle técnico: <code>' + detail + '</code>' +
        '</p>' +
        '<div style="display:flex; gap:var(--space-sm); flex-wrap:wrap;">' +
          '<button class="btn btn--primary" type="button" data-vma-reload>Recargar página</button>' +
          '<a class="btn btn--secondary" href="#/">Volver al inicio</a>' +
        '</div>' +
      '</section>';

    const reloadBtn = container.querySelector('[data-vma-reload]');
    if (reloadBtn) reloadBtn.addEventListener('click', function () { location.reload(); });
  }


  /* ------------------------------------------------------------------------
   *  Actualización del <title> a partir del <h1> del fragmento
   * --------------------------------------------------------------------- */
  function updateDocumentTitle(container) {
    const h1 = container.querySelector('h1');
    const siteName = 'Verbum Manet Academy';
    if (h1 && h1.textContent.trim()) {
      document.title = h1.textContent.trim() + ' · ' + siteName;
    } else {
      document.title = siteName + ' · Formación teológica reformada';
    }
  }


  /* ------------------------------------------------------------------------
   *  Inicialización de componentes interactivos post-inyección
   * --------------------------------------------------------------------- */
  function initFragmentComponents(container) {
    container.querySelectorAll('[data-accordion]').forEach(initAccordion);
    container.querySelectorAll('[data-tabs]').forEach(initTabs);
    container.querySelectorAll('[data-glossary-term]').forEach(initGlossaryTerm);
  }


  /* ------------------------------------------------------------------------
   *  Acordeón · soporta <details> nativo (no requiere JS) y <button> manual
   * --------------------------------------------------------------------- */
  function initAccordion(el) {
    if (el.tagName.toLowerCase() === 'details') return; // nativo

    const btn = el.querySelector('button[data-accordion-toggle], button');
    const panel = el.querySelector('[data-accordion-panel]');
    if (!btn || !panel) return;
    if (btn.dataset.vmaInit === '1') return;
    btn.dataset.vmaInit = '1';

    if (!btn.hasAttribute('aria-expanded')) {
      btn.setAttribute('aria-expanded', 'false');
    }
    const initiallyOpen = btn.getAttribute('aria-expanded') === 'true';
    panel.hidden = !initiallyOpen;
    el.setAttribute('data-open', String(initiallyOpen));

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const next = !isOpen;
      btn.setAttribute('aria-expanded', String(next));
      el.setAttribute('data-open', String(next));
      panel.hidden = !next;
    });
  }


  /* ------------------------------------------------------------------------
   *  Tabs · patrón ARIA completo con navegación por teclado
   * --------------------------------------------------------------------- */
  function initTabs(container) {
    const tabs = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
    const panels = Array.prototype.slice.call(container.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length) return;
    if (container.dataset.vmaInit === '1') return;
    container.dataset.vmaInit = '1';

    function activate(selectedTab, focusIt) {
      tabs.forEach(function (t) {
        const isSel = t === selectedTab;
        t.setAttribute('aria-selected', String(isSel));
        t.setAttribute('tabindex', isSel ? '0' : '-1');
      });
      panels.forEach(function (p) {
        p.hidden = p.id !== selectedTab.getAttribute('aria-controls');
      });
      if (focusIt) selectedTab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          activate(tabs[(i + 1) % tabs.length], true);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          activate(tabs[(i - 1 + tabs.length) % tabs.length], true);
        } else if (e.key === 'Home') {
          e.preventDefault(); activate(tabs[0], true);
        } else if (e.key === 'End') {
          e.preventDefault(); activate(tabs[tabs.length - 1], true);
        }
      });
    });

    // Estado inicial: primer tab con aria-selected="true", o el primero
    const initial = tabs.find(function (t) {
      return t.getAttribute('aria-selected') === 'true';
    }) || tabs[0];
    activate(initial, false);
  }


  /* ------------------------------------------------------------------------
   *  Tooltips de glosario · elemento flotante reutilizable
   * --------------------------------------------------------------------- */
  let tipEl = null;

  function ensureTipEl() {
    if (tipEl) return tipEl;
    injectGlossaryStyles();
    tipEl = document.createElement('div');
    tipEl.id = 'vma-glossary-tip';
    tipEl.className = 'glossary-tip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.hidden = true;
    tipEl.innerHTML =
      '<p class="glossary-tip__term"></p>' +
      '<p class="glossary-tip__def"></p>';
    document.body.appendChild(tipEl);
    return tipEl;
  }

  function injectGlossaryStyles() {
    if (document.getElementById('vma-glossary-styles')) return;
    const style = document.createElement('style');
    style.id = 'vma-glossary-styles';
    style.textContent = [
      '.glossary-tip {',
      '  position: fixed;',
      '  z-index: 100;',
      '  max-width: 22rem;',
      '  padding: 0.75rem 1rem;',
      '  background-color: var(--bg-raised);',
      '  color: var(--text-primary);',
      '  border: 1px solid var(--border-strong);',
      '  border-radius: var(--radius-md);',
      '  box-shadow: var(--shadow-lg);',
      '  opacity: 0;',
      '  transform: translateY(-4px);',
      '  transition: opacity 0.15s ease, transform 0.15s ease;',
      '  pointer-events: none;',
      '}',
      '.glossary-tip.is-visible {',
      '  opacity: 1;',
      '  transform: translateY(0);',
      '}',
      '.glossary-tip__term {',
      '  font-family: var(--font-display);',
      '  font-size: 0.95rem;',
      '  color: var(--text-heading);',
      '  margin: 0 0 0.25rem;',
      '  max-width: none;',
      '}',
      '.glossary-tip__def {',
      '  font-size: 0.875rem;',
      '  color: var(--text-secondary);',
      '  margin: 0;',
      '  line-height: 1.5;',
      '  max-width: none;',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .glossary-tip { transition: none; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function initGlossaryTerm(el) {
    if (el.dataset.vmaInit === '1') return;
    el.dataset.vmaInit = '1';

    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-describedby', 'vma-glossary-tip');

    el.addEventListener('mouseenter', function () { showTip(el); });
    el.addEventListener('focus',      function () { showTip(el); });
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('blur',       hideTip);
    // Escape cierra incluso si sigue con hover
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { hideTip(); el.blur(); }
    });
  }

  function showTip(el) {
    const termId = el.getAttribute('data-glossary-term');
    const entry = (global.GLOSSARY && global.GLOSSARY[termId]) || null;
    if (!entry) return;

    const tip = ensureTipEl();
    tip.querySelector('.glossary-tip__term').textContent = entry.term || termId;
    tip.querySelector('.glossary-tip__def').textContent = entry.definition || '';
    tip.hidden = false;

    // Posicionamiento viewport-safe
    positionTip(tip, el);
    // Animación tras un frame para que el hidden=false se aplique
    requestAnimationFrame(function () { tip.classList.add('is-visible'); });
  }

  function positionTip(tip, anchor) {
    // Medición preliminar: mover fuera de pantalla para medir sin flash
    tip.style.top = '-9999px';
    tip.style.left = '-9999px';
    const rect = anchor.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const margin = 12;

    let top = rect.bottom + 8;
    let left = rect.left;

    if (left + tipRect.width > window.innerWidth - margin) {
      left = window.innerWidth - tipRect.width - margin;
    }
    if (left < margin) left = margin;

    if (top + tipRect.height > window.innerHeight - margin) {
      top = rect.top - tipRect.height - 8; // invertir hacia arriba
    }
    if (top < margin) top = margin;

    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  }

  function hideTip() {
    if (!tipEl) return;
    tipEl.classList.remove('is-visible');
    // Ocultar tras la animación para no interferir con tab-index
    window.setTimeout(function () {
      if (tipEl && !tipEl.classList.contains('is-visible')) {
        tipEl.hidden = true;
      }
    }, 180);
  }


  /* ------------------------------------------------------------------------
   *  Utilidades
   * --------------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }


  /* ------------------------------------------------------------------------
   *  Exposición del API público
   * --------------------------------------------------------------------- */
  global.CourseLoader = {
    load: load,
    preload: preload,
    clearCache: clearCache
  };

})(window);

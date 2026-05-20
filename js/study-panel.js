/* ============================================================================
   VERBUM MANET ACADEMY · js/study-panel.js · v5 · Paso 5
   ----------------------------------------------------------------------------
   Módulo único responsable de:
     · Estado StudyState (en memoria · sin localStorage · constraint v4)
     · Motor Pomodoro con cómputo por timestamp (resistente a drift y tab
       throttling)
     · Montaje del Pomodoro en dos contextos: el panel flotante del shell
       y un host embebido dentro del Panel de Estudio
     · Render del dashboard: métricas, logros (medallones), notas, aviso de
       no-persistencia, estado vacío editorial
     · Export · Import del progreso como archivo JSON descargable
     · Tracking automático: ciclos de pomodoro, consulta del glosario, racha
       de días consecutivos
     · API pública en window.VMA.study para que las páginas de curso y
       lección registren progreso (lecciones leídas, cursos completados,
       cuestionarios aprobados, segmentos completados)

   Suscripciones a eventos del shell (app.js):
     · 'vma:navigated' { hash } → si hash === '#/panel', monta el dashboard
       y ancla el Pomodoro embebido (oculta el flotante)
     · 'vma:pomodoro:opened' → repinta el panel flotante y enfoca el botón
       principal

   Convención: ninguna escritura en localStorage, sessionStorage, cookies o
   IndexedDB. Toda persistencia pasa por export/import explícito.
   ============================================================================ */

(function () {
  'use strict';

  /* ==========================================================================
     §1 · CONSTANTES
     ========================================================================== */

  /** Duraciones (en segundos) por modo Pomodoro */
  const MODE_DURATIONS = {
    focus: 25 * 60,
    short: 5  * 60,
    long:  15 * 60,
  };

  const MODE_LABELS = {
    focus: 'Enfoque',
    short: 'Pausa corta',
    long:  'Pausa larga',
  };

  /** Tras cuántos ciclos de enfoque toca pausa larga */
  const CYCLES_TO_LONG_BREAK = 4;

  /** Versión actual del schema de StudyState (para validar importaciones) */
  const STATE_VERSION = 1;

  /** Tick del Pomodoro · 1 s · el cómputo real va por timestamp */
  const TICK_MS = 1000;

  /** Estado inicial · usado para reset y como referencia de schema */
  function freshState() {
    return {
      version: STATE_VERSION,
      pomodoro: {
        totalSeconds:    0,   // segundos totales en modo focus completados
        cyclesCompleted: 0,   // ciclos de focus acumulados (no sesión-scoped)
        sessionsByDay:   {},  // { 'YYYY-MM-DD': cyclesEseDia }
      },
      reading: {
        lessonsRead:       [], // ids de lecciones leídas
        coursesStarted:    [], // ids de cursos iniciados
        coursesCompleted:  [], // ids de cursos completados
        segmentsCompleted: [], // [1..4] segmentos completados
      },
      quizzes: {
        passed: [],   // [{ lessonId, score, date }]
      },
      glossary: {
        termsConsulted: [],   // claves únicas consultadas
      },
      notes: [],     // [{ id, text, createdAt, updatedAt, courseId?, lessonId? }]
      achievements: {},  // { achievementId: unlockedAt(ISO) }
      meta: {
        firstSessionAt: null,
        lastSessionAt:  null,
      },
    };
  }


  /* ==========================================================================
     §2 · STUDYSTATE · singleton en memoria
     ========================================================================== */

  let state = freshState();

  /** Notifica a todos los suscriptores que el estado cambió */
  function notify() {
    state.meta.lastSessionAt = nowIso();
    if (!state.meta.firstSessionAt) state.meta.firstSessionAt = nowIso();
    subscribers.forEach((fn) => {
      try { fn(state); } catch (err) { console.error('[vma.study]', err); }
    });
  }

  /** ¿El estado está completamente sin actividad? */
  function isStateEmpty(s) {
    return s.pomodoro.cyclesCompleted === 0 &&
           s.pomodoro.totalSeconds === 0 &&
           s.reading.lessonsRead.length === 0 &&
           s.reading.coursesStarted.length === 0 &&
           s.reading.coursesCompleted.length === 0 &&
           s.reading.segmentsCompleted.length === 0 &&
           s.quizzes.passed.length === 0 &&
           s.glossary.termsConsulted.length === 0 &&
           s.notes.length === 0;
  }


  /* ==========================================================================
     §3 · SUBSCRIBERS · pattern observer simple
     ========================================================================== */

  const subscribers = new Set();

  function subscribe(fn) {
    if (typeof fn !== 'function') return () => {};
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }


  /* ==========================================================================
     §4 · UTILIDADES
     ========================================================================== */

  function nowIso() {
    return new Date().toISOString();
  }

  /** YYYY-MM-DD en hora local del navegador */
  function ymdLocal(date) {
    const d = date instanceof Date ? date : new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  function ymdMinusDays(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return ymdLocal(d);
  }

  function formatMmSs(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function formatHoursMinutes(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${String(m).padStart(2, '0')}m`;
  }

  function escapeHtml(s) {
    return (s || '').toString().replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function uid() {
    return 'n_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  /** Cierre defensivo de claves desconocidas y rellenado de defaults */
  function reconcileState(imported) {
    const fresh = freshState();
    const merged = JSON.parse(JSON.stringify(fresh));

    if (!imported || typeof imported !== 'object') return merged;
    if (imported.version !== STATE_VERSION) {
      throw new Error('La versión del archivo no es compatible con esta academia.');
    }

    // Pomodoro
    if (imported.pomodoro) {
      merged.pomodoro.totalSeconds    = Number(imported.pomodoro.totalSeconds)    || 0;
      merged.pomodoro.cyclesCompleted = Number(imported.pomodoro.cyclesCompleted) || 0;
      if (imported.pomodoro.sessionsByDay && typeof imported.pomodoro.sessionsByDay === 'object') {
        Object.keys(imported.pomodoro.sessionsByDay).forEach((k) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(k)) {
            merged.pomodoro.sessionsByDay[k] = Number(imported.pomodoro.sessionsByDay[k]) || 0;
          }
        });
      }
    }

    // Reading
    if (imported.reading) {
      ['lessonsRead', 'coursesStarted', 'coursesCompleted', 'segmentsCompleted'].forEach((k) => {
        if (Array.isArray(imported.reading[k])) {
          merged.reading[k] = imported.reading[k].slice();
        }
      });
    }

    // Quizzes
    if (imported.quizzes && Array.isArray(imported.quizzes.passed)) {
      merged.quizzes.passed = imported.quizzes.passed
        .filter((q) => q && typeof q === 'object' && q.lessonId)
        .map((q) => ({
          lessonId: String(q.lessonId),
          score: Number(q.score) || 0,
          date: q.date || nowIso(),
        }));
    }

    // Glossary
    if (imported.glossary && Array.isArray(imported.glossary.termsConsulted)) {
      merged.glossary.termsConsulted = imported.glossary.termsConsulted
        .filter((t) => typeof t === 'string');
    }

    // Notes
    if (Array.isArray(imported.notes)) {
      merged.notes = imported.notes
        .filter((n) => n && typeof n === 'object' && typeof n.text === 'string')
        .map((n) => ({
          id:        n.id || uid(),
          text:      String(n.text),
          createdAt: n.createdAt || nowIso(),
          updatedAt: n.updatedAt || n.createdAt || nowIso(),
          courseId:  n.courseId || null,
          lessonId:  n.lessonId || null,
        }));
    }

    // Achievements
    if (imported.achievements && typeof imported.achievements === 'object') {
      Object.keys(imported.achievements).forEach((k) => {
        if (ACHIEVEMENT_IDS.has(k)) merged.achievements[k] = imported.achievements[k];
      });
    }

    // Meta
    if (imported.meta) {
      merged.meta.firstSessionAt = imported.meta.firstSessionAt || merged.meta.firstSessionAt;
      merged.meta.lastSessionAt  = imported.meta.lastSessionAt  || merged.meta.lastSessionAt;
    }

    return merged;
  }


  /* ==========================================================================
     §5 · MÉTRICAS DERIVADAS · streak, totales
     ========================================================================== */

  function computeStreak(s) {
    const days = Object.keys(s.pomodoro.sessionsByDay).sort();
    if (days.length === 0) return 0;

    const latest = days[days.length - 1];
    const today = ymdLocal(new Date());
    const yesterday = ymdMinusDays(1);

    // El streak solo es vivo si el último día es hoy o ayer
    if (latest !== today && latest !== yesterday) return 0;

    // Cuento hacia atrás desde latest mientras sean consecutivos
    const set = new Set(days);
    let streak = 0;
    const cursor = new Date(latest + 'T00:00:00');
    while (set.has(ymdLocal(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }


  /* ==========================================================================
     §6 · LOGROS · medallones académicos
     ========================================================================== */

  /** Cada logro es un objeto con id, título, descripción, icono SVG y test */
  const ACHIEVEMENTS = [
    {
      id: 'first-lesson',
      name: 'Primera lección leída',
      hint: 'Lectura inaugural en la academia.',
      icon: 'book',
      test: (s) => s.reading.lessonsRead.length >= 1,
    },
    {
      id: 'first-course',
      name: 'Primer curso iniciado',
      hint: 'Apertura formal de un curso del currículo.',
      icon: 'pen',
      test: (s) => s.reading.coursesStarted.length >= 1,
    },
    {
      id: 'first-quiz',
      name: 'Primer cuestionario aprobado',
      hint: 'Comprobación catequética superada.',
      icon: 'check',
      test: (s) => s.quizzes.passed.length >= 1,
    },
    {
      id: 'first-segment',
      name: 'Primer segmento completado',
      hint: 'Una de las cuatro partes del currículo finalizada.',
      icon: 'segment',
      test: (s) => s.reading.segmentsCompleted.length >= 1,
    },
    {
      id: 'three-day-streak',
      name: 'Tres días consecutivos de estudio',
      hint: 'Constancia · tres jornadas seguidas con ciclos completados.',
      icon: 'laurel',
      test: (s) => computeStreak(s) >= 3,
    },
    {
      id: 'ten-hours',
      name: 'Diez horas acumuladas',
      hint: 'Treinta y seis mil segundos en modo enfoque.',
      icon: 'clock',
      test: (s) => s.pomodoro.totalSeconds >= 36000,
    },
    {
      id: 'twenty-terms',
      name: 'Veinte términos consultados',
      hint: 'Disciplina lexicográfica · veinte voces del glosario.',
      icon: 'glossary',
      test: (s) => s.glossary.termsConsulted.length >= 20,
    },
  ];

  const ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map((a) => a.id));

  /** Iconografía SVG inline · monocromáticos · currentColor */
  const ACHIEVEMENT_ICONS = {
    book:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6 Q9 5 4 5.5 L4 19 Q9 18.5 12 19"/><path d="M12 6 Q15 5 20 5.5 L20 19 Q15 18.5 12 19"/><path d="M12 6 L12 19"/></svg>',
    pen:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 L8 18 L19 7 L17 5 L6 16 Z"/><path d="M14 8 L16 10"/></svg>',
    check:    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5 L11 15.5 L16.5 9.5"/></svg>',
    segment:  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12"/><path d="M11 9 L11 15"/></svg>',
    laurel:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19 Q3 13 6 6"/><path d="M17 19 Q21 13 18 6"/><path d="M9 8 Q7 8 6.5 10"/><path d="M9 12 Q7 12 6.5 14"/><path d="M15 8 Q17 8 17.5 10"/><path d="M15 12 Q17 12 17.5 14"/><path d="M9 19 L15 19"/></svg>',
    clock:    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9 L12 13 L14.5 14.5"/><path d="M9 3 L15 3"/></svg>',
    glossary: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5 L5 19 L19 19 L19 5 Z"/><path d="M9 9 L15 9"/><path d="M9 13 L15 13"/><path d="M9 17 L13 17"/></svg>',
  };

  /** Comprueba qué logros se acaban de desbloquear · devuelve array de ids nuevos */
  function refreshAchievements() {
    const unlocked = [];
    ACHIEVEMENTS.forEach((a) => {
      const alreadyUnlocked = !!state.achievements[a.id];
      if (!alreadyUnlocked && a.test(state)) {
        state.achievements[a.id] = nowIso();
        unlocked.push(a.id);
      }
    });
    return unlocked;
  }


  /* ==========================================================================
     §7 · API DE TRACKING · pública en window.VMA.study
     ========================================================================== */

  function markLessonRead(lessonId) {
    if (!lessonId) return;
    const key = String(lessonId);
    if (!state.reading.lessonsRead.includes(key)) {
      state.reading.lessonsRead.push(key);
      refreshAchievements();
      notify();
    }
  }

  function markCourseStarted(courseId) {
    if (!courseId) return;
    const key = String(courseId);
    if (!state.reading.coursesStarted.includes(key)) {
      state.reading.coursesStarted.push(key);
      refreshAchievements();
      notify();
    }
  }

  function markCourseCompleted(courseId) {
    if (!courseId) return;
    const key = String(courseId);
    if (!state.reading.coursesCompleted.includes(key)) {
      state.reading.coursesCompleted.push(key);
      if (!state.reading.coursesStarted.includes(key)) {
        state.reading.coursesStarted.push(key);
      }
      refreshAchievements();
      notify();
    }
  }

  function markSegmentCompleted(segmentNum) {
    const n = parseInt(segmentNum, 10);
    if (!n || n < 1 || n > 4) return;
    if (!state.reading.segmentsCompleted.includes(n)) {
      state.reading.segmentsCompleted.push(n);
      refreshAchievements();
      notify();
    }
  }

  function markQuizPassed({ lessonId, score }) {
    if (!lessonId) return;
    state.quizzes.passed.push({
      lessonId: String(lessonId),
      score: Number(score) || 0,
      date: nowIso(),
    });
    refreshAchievements();
    notify();
  }

  function markTermConsulted(termKey) {
    if (!termKey) return;
    const key = String(termKey);
    if (!state.glossary.termsConsulted.includes(key)) {
      state.glossary.termsConsulted.push(key);
      refreshAchievements();
      notify();
    }
  }

  /* ---- Tracking automático del glosario ------------------------------ */

  function bindGlossaryTracking() {
    // El shell ya muestra el tooltip; aquí solo contabilizamos consultas.
    // Tap o focus durante > 600 ms cuentan como consulta deliberada.
    const TIMEOUT_MS = 600;
    let pendingTimer = null;
    let pendingKey = null;

    function startPending(termEl) {
      cancelPending();
      pendingKey = termEl.getAttribute('data-glossary-term');
      pendingTimer = setTimeout(() => {
        if (pendingKey) markTermConsulted(pendingKey);
        pendingTimer = null;
      }, TIMEOUT_MS);
    }

    function cancelPending() {
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingTimer = null;
        pendingKey = null;
      }
    }

    document.addEventListener('mouseover', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) startPending(term);
    });
    document.addEventListener('mouseout', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term && !e.relatedTarget?.closest('[data-glossary-term]')) cancelPending();
    });
    document.addEventListener('focusin', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) startPending(term);
    });
    document.addEventListener('focusout', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) cancelPending();
    });
    // Tap inmediato cuenta sin esperar
    document.addEventListener('click', (e) => {
      const term = e.target.closest('[data-glossary-term]');
      if (term) {
        cancelPending();
        const key = term.getAttribute('data-glossary-term');
        if (key) markTermConsulted(key);
      }
    });
  }


  /* ==========================================================================
     §8 · MOTOR POMODORO · cómputo por timestamp
     ========================================================================== */

  const engine = {
    mode: 'focus',                  // 'focus' | 'short' | 'long'
    durationSec: MODE_DURATIONS.focus,
    remainingSec: MODE_DURATIONS.focus,
    isRunning: false,
    intervalId: null,
    startTimestamp: null,           // ms al pulsar start (o reanudar)
    baseRemainingSec: MODE_DURATIONS.focus,  // remaining al iniciar/reanudar
    sessionCycles: 0,               // ciclos de focus completados en esta sesión
    focusSinceLongBreak: 0,         // contador para decidir long break

    listeners: new Set(),

    onChange(fn) {
      if (typeof fn !== 'function') return () => {};
      engine.listeners.add(fn);
      return () => engine.listeners.delete(fn);
    },

    emit() {
      engine.listeners.forEach((fn) => {
        try { fn(engine.getSnapshot()); } catch (err) { console.error('[vma.pomo]', err); }
      });
    },

    getSnapshot() {
      return {
        mode: engine.mode,
        modeLabel: MODE_LABELS[engine.mode],
        durationSec: engine.durationSec,
        remainingSec: engine.remainingSec,
        isRunning: engine.isRunning,
        sessionCycles: engine.sessionCycles,
      };
    },

    setMode(mode) {
      if (!MODE_DURATIONS[mode]) return;
      engine.stop();
      engine.mode = mode;
      engine.durationSec = MODE_DURATIONS[mode];
      engine.remainingSec = engine.durationSec;
      engine.baseRemainingSec = engine.durationSec;
      engine.emit();
    },

    start() {
      if (engine.isRunning) return;
      if (engine.remainingSec <= 0) {
        // Si el modo actual ya está consumido, recargar al duration completo
        engine.remainingSec = engine.durationSec;
      }
      engine.baseRemainingSec = engine.remainingSec;
      engine.startTimestamp = Date.now();
      engine.isRunning = true;
      engine.intervalId = setInterval(engine.tick, TICK_MS);
      engine.tick(); // primer pintado inmediato
    },

    pause() {
      if (!engine.isRunning) return;
      engine.tick(); // congela el remainingSec con el valor más fresco
      engine.stop();
    },

    stop() {
      if (engine.intervalId) {
        clearInterval(engine.intervalId);
        engine.intervalId = null;
      }
      engine.isRunning = false;
      engine.startTimestamp = null;
      engine.emit();
    },

    reset() {
      engine.stop();
      engine.remainingSec = engine.durationSec;
      engine.baseRemainingSec = engine.durationSec;
      engine.emit();
    },

    tick() {
      if (!engine.isRunning) return;
      const elapsed = (Date.now() - engine.startTimestamp) / 1000;
      const newRemaining = Math.max(0, engine.baseRemainingSec - elapsed);
      engine.remainingSec = newRemaining;

      if (newRemaining <= 0) {
        engine.onComplete();
        return;
      }
      engine.emit();
    },

    onComplete() {
      const finishedMode = engine.mode;
      engine.stop();
      engine.remainingSec = 0;

      if (finishedMode === 'focus') {
        // Acreditar el ciclo en la sesión y en el StudyState
        engine.sessionCycles += 1;
        engine.focusSinceLongBreak += 1;

        state.pomodoro.cyclesCompleted += 1;
        state.pomodoro.totalSeconds += MODE_DURATIONS.focus;
        const today = ymdLocal(new Date());
        state.pomodoro.sessionsByDay[today] =
          (state.pomodoro.sessionsByDay[today] || 0) + 1;

        refreshAchievements();
        notify();

        // Auto-cambio a pausa (sin auto-start)
        const nextMode =
          engine.focusSinceLongBreak >= CYCLES_TO_LONG_BREAK ? 'long' : 'short';
        if (nextMode === 'long') engine.focusSinceLongBreak = 0;

        engine.mode = nextMode;
        engine.durationSec = MODE_DURATIONS[nextMode];
        engine.remainingSec = engine.durationSec;
        engine.baseRemainingSec = engine.durationSec;
        announcePomo(`Enfoque completado. Toca ${MODE_LABELS[nextMode]}.`);
      } else {
        // Tras una pausa, volver a focus
        engine.mode = 'focus';
        engine.durationSec = MODE_DURATIONS.focus;
        engine.remainingSec = engine.durationSec;
        engine.baseRemainingSec = engine.durationSec;
        announcePomo('Pausa completada. Listo para el siguiente enfoque.');
      }

      engine.emit();
    },
  };

  /** Anuncio accesible (aria-live) sin saturar al usuario */
  let liveRegion = null;
  function ensureLiveRegion() {
    if (liveRegion) return liveRegion;
    liveRegion = document.createElement('div');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
    return liveRegion;
  }
  function announcePomo(msg) {
    const r = ensureLiveRegion();
    r.textContent = '';
    requestAnimationFrame(() => { r.textContent = msg; });
  }


  /* ==========================================================================
     §9 · MOUNT DE POMODORO · floating + embebido
     · Acepta un descriptor de DOM y suscribe el render del engine.
     · Devuelve un unmount() que libera listeners.
     ========================================================================== */

  function mountPomodoro(els) {
    if (!els || !els.timeEl) return () => {};

    function render(snap) {
      els.timeEl.textContent = formatMmSs(snap.remainingSec);
      if (els.phaseEl) els.phaseEl.textContent = snap.modeLabel;
      if (els.cyclesEl) els.cyclesEl.textContent = String(snap.sessionCycles);

      if (els.startBtn) {
        if (snap.isRunning) {
          els.startBtn.textContent = 'Pausar';
        } else if (snap.remainingSec < snap.durationSec && snap.remainingSec > 0) {
          els.startBtn.textContent = 'Reanudar';
        } else {
          els.startBtn.textContent = 'Iniciar';
        }
      }

      if (els.modeBtns) {
        els.modeBtns.forEach((btn) => {
          btn.classList.toggle('is-active', btn.dataset.mode === snap.mode);
        });
      }
    }

    function handleStartClick() {
      if (engine.isRunning) engine.pause();
      else engine.start();
    }

    function handleResetClick() {
      engine.reset();
    }

    function handleModeClick(e) {
      const btn = e.currentTarget;
      const mode = btn.dataset.mode;
      if (mode) engine.setMode(mode);
    }

    if (els.startBtn) els.startBtn.addEventListener('click', handleStartClick);
    if (els.resetBtn) els.resetBtn.addEventListener('click', handleResetClick);
    if (els.modeBtns) els.modeBtns.forEach((b) => b.addEventListener('click', handleModeClick));

    const unsubscribe = engine.onChange(render);
    render(engine.getSnapshot()); // primer pintado

    return function unmount() {
      unsubscribe();
      if (els.startBtn) els.startBtn.removeEventListener('click', handleStartClick);
      if (els.resetBtn) els.resetBtn.removeEventListener('click', handleResetClick);
      if (els.modeBtns) els.modeBtns.forEach((b) => b.removeEventListener('click', handleModeClick));
    };
  }

  /** Monta el Pomodoro flotante usando los IDs declarados en index.html */
  let floatingUnmount = null;
  function mountFloatingPomodoro() {
    if (floatingUnmount) return;
    const panel = document.getElementById('pomodoro-panel');
    if (!panel) return;
    floatingUnmount = mountPomodoro({
      timeEl:   document.getElementById('pomodoro-time'),
      phaseEl:  document.getElementById('pomodoro-phase'),
      startBtn: document.getElementById('pomodoro-start'),
      resetBtn: document.getElementById('pomodoro-reset'),
      cyclesEl: document.getElementById('pomodoro-cycles'),
      modeBtns: panel.querySelectorAll('.mode-btn'),
    });
  }
  function unmountFloatingPomodoro() {
    if (floatingUnmount) {
      floatingUnmount();
      floatingUnmount = null;
    }
  }

  /** Monta el Pomodoro embebido en el panel de estudio (si existe en el DOM) */
  let embeddedUnmount = null;
  function mountEmbeddedPomodoro(root) {
    if (embeddedUnmount) { embeddedUnmount(); embeddedUnmount = null; }
    if (!root) return;
    embeddedUnmount = mountPomodoro({
      timeEl:   root.querySelector('.pomo-time'),
      phaseEl:  root.querySelector('.pomo-phase'),
      startBtn: root.querySelector('.pomo-start'),
      resetBtn: root.querySelector('.pomo-reset'),
      cyclesEl: root.querySelector('.pomo-cycles'),
      modeBtns: root.querySelectorAll('.mode-btn'),
    });
  }


  /* ==========================================================================
     §10 · RENDER DEL DASHBOARD · panel de estudio
     ========================================================================== */

  function renderDashboard(root) {
    if (!root) return;

    // Estado vacío editorial (audit §K.5)
    const empty = root.querySelector('[data-panel-empty]');
    const grid  = root.querySelector('[data-panel-grid]');

    if (isStateEmpty(state)) {
      if (empty) empty.hidden = false;
      if (grid)  grid.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (grid)  grid.hidden = false;

    renderMetrics(root);
    renderAchievements(root);
    renderNotes(root);
  }

  /* ---- Métricas ----------------------------------------------------- */

  function renderMetrics(root) {
    const mFocus  = root.querySelector('[data-metric="focus-hours"] .metric__value');
    const mCycles = root.querySelector('[data-metric="cycles"] .metric__value');
    const mStreak = root.querySelector('[data-metric="streak"] .metric__value');
    const mTerms  = root.querySelector('[data-metric="terms"] .metric__value');

    if (mFocus)  mFocus.textContent  = formatHoursMinutes(state.pomodoro.totalSeconds);
    if (mCycles) mCycles.textContent = String(state.pomodoro.cyclesCompleted);
    if (mStreak) mStreak.textContent = String(computeStreak(state));
    if (mTerms)  mTerms.textContent  = String(state.glossary.termsConsulted.length);
  }

  /* ---- Logros ------------------------------------------------------- */

  function renderAchievements(root) {
    const list = root.querySelector('[data-achievement-list]');
    if (!list) return;

    const html = ACHIEVEMENTS.map((a) => {
      const unlocked = !!state.achievements[a.id];
      const stateClass = unlocked ? 'is-unlocked' : 'is-locked';
      const aria = unlocked
        ? `${a.name}. Logro obtenido.`
        : `${a.name}. Aún no obtenido. ${a.hint}`;
      const icon = ACHIEVEMENT_ICONS[a.icon] || ACHIEVEMENT_ICONS.book;
      return `
        <li class="achievement ${stateClass}"
            role="listitem"
            aria-label="${escapeHtml(aria)}"
            title="${escapeHtml(a.hint)}">
          <div class="achievement__medal" aria-hidden="true">${icon}</div>
          <p class="achievement__name">${escapeHtml(a.name)}</p>
        </li>
      `;
    }).join('');

    list.innerHTML = html;
  }

  /* ---- Notas -------------------------------------------------------- */

  function renderNotes(root) {
    const list = root.querySelector('[data-note-list]');
    if (!list) return;

    if (state.notes.length === 0) {
      list.innerHTML = `
        <li class="note-empty" style="
          padding: var(--sp-md);
          font-family: var(--font-display);
          font-style: italic;
          color: var(--color-text-muted);
          font-size: var(--text-sm);
          text-align: center;
          border: 1px dashed var(--color-border-soft);
          border-radius: var(--radius-sm);
          list-style: none;
        ">
          Aún no hay notas. Pulse <em>Nueva nota</em> para empezar.
        </li>`;
      return;
    }

    const html = state.notes
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((n) => noteItemHtml(n))
      .join('');

    list.innerHTML = html;
    bindNoteItemEvents(list);
  }

  function noteItemHtml(n) {
    const stamp = new Date(n.updatedAt);
    const fmt = stamp.toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    return `
      <li class="note-item" data-note-id="${escapeHtml(n.id)}">
        <div class="note-item__meta">
          <span>${escapeHtml(fmt)}</span>
          <span class="note-item__actions">
            <button type="button" class="btn btn--link" data-note-edit
                    style="font-size: 0.78rem; letter-spacing: var(--ls-wide);">Editar</button>
            <button type="button" class="btn btn--link" data-note-delete
                    style="font-size: 0.78rem; letter-spacing: var(--ls-wide); margin-left: 0.5rem;">Eliminar</button>
          </span>
        </div>
        <p class="note-item__body">${escapeHtml(n.text).replace(/\n/g, '<br>')}</p>
      </li>
    `;
  }

  function bindNoteItemEvents(list) {
    list.querySelectorAll('[data-note-edit]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.note-item');
        const id = item?.dataset.noteId;
        if (id) openNoteEditor(id);
      });
    });
    list.querySelectorAll('[data-note-delete]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.note-item');
        const id = item?.dataset.noteId;
        if (id && confirm('¿Eliminar esta nota? La acción no se puede deshacer.')) {
          deleteNote(id);
        }
      });
    });
  }


  /* ==========================================================================
     §11 · CRUD DE NOTAS · add, edit, delete
     ========================================================================== */

  function addNote(text, ctx) {
    const cleanText = (text || '').toString().trim();
    if (!cleanText) return;
    const note = {
      id: uid(),
      text: cleanText,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      courseId: ctx?.courseId || null,
      lessonId: ctx?.lessonId || null,
    };
    state.notes.unshift(note);
    notify();
  }

  function updateNote(id, newText) {
    const idx = state.notes.findIndex((n) => n.id === id);
    if (idx < 0) return;
    const cleanText = (newText || '').toString().trim();
    if (!cleanText) return;
    state.notes[idx] = {
      ...state.notes[idx],
      text: cleanText,
      updatedAt: nowIso(),
    };
    notify();
  }

  function deleteNote(id) {
    const idx = state.notes.findIndex((n) => n.id === id);
    if (idx < 0) return;
    state.notes.splice(idx, 1);
    notify();
  }

  /** Editor inline: reemplaza la note-item con un textarea + guardar/cancelar */
  function openNoteEditor(id) {
    const item = document.querySelector(`.note-item[data-note-id="${id}"]`);
    const note = state.notes.find((n) => n.id === id);
    if (!item || !note) return;

    item.innerHTML = `
      <div class="note-item__meta">
        <span>Editando</span>
      </div>
      <textarea class="note-editor"
                rows="4"
                style="
                  width: 100%;
                  font-family: var(--font-display);
                  font-style: italic;
                  font-size: 0.95rem;
                  line-height: var(--lh-snug);
                  color: var(--color-text);
                  background-color: var(--color-bg);
                  border: var(--border-thin) solid var(--color-border);
                  border-radius: var(--radius-xs);
                  padding: 0.6rem 0.75rem;
                  resize: vertical;
                ">${escapeHtml(note.text)}</textarea>
      <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button type="button" class="btn btn--ghost btn--sm" data-note-cancel>Cancelar</button>
        <button type="button" class="btn btn--primary btn--sm" data-note-save>Guardar</button>
      </div>
    `;

    const ta = item.querySelector('.note-editor');
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);

    item.querySelector('[data-note-save]').addEventListener('click', () => {
      updateNote(id, ta.value);
    });
    item.querySelector('[data-note-cancel]').addEventListener('click', () => {
      // Re-render del listado para restaurar el note-item original
      const root = document.querySelector('.panel-page');
      if (root) renderNotes(root);
    });
  }

  /** Inserta editor inline al inicio de la lista para nueva nota */
  function openNewNoteEditor(root) {
    const list = root.querySelector('[data-note-list]');
    if (!list) return;

    // Si ya hay un editor en curso, no abrir otro
    if (list.querySelector('.note-editor')) {
      list.querySelector('.note-editor').focus();
      return;
    }

    // Vaciar placeholder de note-empty si existe
    const placeholder = list.querySelector('.note-empty');
    if (placeholder) placeholder.remove();

    const li = document.createElement('li');
    li.className = 'note-item';
    li.innerHTML = `
      <div class="note-item__meta">
        <span>Nueva nota</span>
      </div>
      <textarea class="note-editor"
                rows="4"
                placeholder="Escriba aquí…"
                style="
                  width: 100%;
                  font-family: var(--font-display);
                  font-style: italic;
                  font-size: 0.95rem;
                  line-height: var(--lh-snug);
                  color: var(--color-text);
                  background-color: var(--color-bg);
                  border: var(--border-thin) solid var(--color-border);
                  border-radius: var(--radius-xs);
                  padding: 0.6rem 0.75rem;
                  resize: vertical;
                "></textarea>
      <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button type="button" class="btn btn--ghost btn--sm" data-note-cancel>Cancelar</button>
        <button type="button" class="btn btn--primary btn--sm" data-note-save>Guardar</button>
      </div>
    `;
    list.prepend(li);

    const ta = li.querySelector('.note-editor');
    ta.focus();

    li.querySelector('[data-note-save]').addEventListener('click', () => {
      addNote(ta.value);
    });
    li.querySelector('[data-note-cancel]').addEventListener('click', () => {
      const r = document.querySelector('.panel-page');
      if (r) renderNotes(r);
    });
  }


  /* ==========================================================================
     §12 · EXPORT · IMPORT JSON
     ========================================================================== */

  function exportProgress() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const today = ymdLocal(new Date());
    const filename = `verbum-manet-progreso-${today}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function importProgressFromFile(file) {
    if (!file) return;

    if (!confirm(
      'Esto reemplazará el progreso actual con el archivo importado.\n' +
      '¿Desea continuar?'
    )) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const reconciled = reconcileState(parsed);
        state = reconciled;
        refreshAchievements();
        notify();
        announcePomo('Progreso importado correctamente.');
      } catch (err) {
        alert('No se pudo importar el archivo: ' + err.message);
      }
    };
    reader.onerror = () => {
      alert('Error al leer el archivo.');
    };
    reader.readAsText(file, 'utf-8');
  }


  /* ==========================================================================
     §13 · COORDINACIÓN CON EL SHELL (app.js)
     ========================================================================== */

  /** Cuando se navega, decide si montar/desmontar el dashboard */
  function handleNavigated(e) {
    const hash = e?.detail?.hash || location.hash || '#/';

    if (hash === '#/panel') {
      // Anclar Pomodoro en el panel · ocultar flotante
      hideFloatingButton();
      unmountFloatingPomodoro();
      const root = document.querySelector('.panel-page');
      if (root) {
        mountPanelHooks(root);
        renderDashboard(root);
        // Embebido Pomodoro (si la página lo provee)
        const embed = root.querySelector('[data-pomodoro-mount]');
        if (embed) mountEmbeddedPomodoro(embed);
      }
    } else {
      // Fuera del panel: liberar embebido, mostrar flotante
      if (embeddedUnmount) { embeddedUnmount(); embeddedUnmount = null; }
      showFloatingButton();
      mountFloatingPomodoro();
    }
  }

  function handlePomodoroOpened() {
    // El panel flotante ya está montado en bootstrap; solo movemos el foco
    const start = document.getElementById('pomodoro-start');
    if (start) requestAnimationFrame(() => start.focus());
  }

  function hideFloatingButton() {
    const btn = document.getElementById('pomodoro-open');
    if (btn) btn.style.display = 'none';
    const panel = document.getElementById('pomodoro-panel');
    if (panel && !panel.hidden) {
      panel.hidden = true;
      btn?.setAttribute('aria-expanded', 'false');
    }
  }
  function showFloatingButton() {
    const btn = document.getElementById('pomodoro-open');
    if (btn) btn.style.display = '';
  }

  /** Engancha botones del panel (export, import, nueva nota) */
  function mountPanelHooks(root) {
    const exportBtn = root.querySelector('[data-export]');
    const importBtn = root.querySelector('[data-import]');
    const importFile = root.querySelector('[data-import-file]');
    const addNoteBtn = root.querySelector('[data-note-add]');

    if (exportBtn && !exportBtn.__vmaBound) {
      exportBtn.addEventListener('click', exportProgress);
      exportBtn.__vmaBound = true;
    }
    if (importBtn && importFile && !importBtn.__vmaBound) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) importProgressFromFile(file);
        e.target.value = ''; // permitir re-importar el mismo archivo
      });
      importBtn.__vmaBound = true;
    }
    if (addNoteBtn && !addNoteBtn.__vmaBound) {
      addNoteBtn.addEventListener('click', () => openNewNoteEditor(root));
      addNoteBtn.__vmaBound = true;
    }

    // Si StudyState cambia (nueva nota, ciclo completado, etc.) y aún
    // estamos en panel, re-renderizar el dashboard.
    subscribe(() => {
      if (location.hash === '#/panel') {
        renderDashboard(root);
      }
    });
  }


  /* ==========================================================================
     §14 · INIT
     ========================================================================== */

  function bootstrap() {
    // Montaje del flotante (si el DOM ya lo provee, lo cual ocurre en
    // index.html)
    mountFloatingPomodoro();

    // Tracking automático del glosario
    bindGlossaryTracking();

    // Suscripciones a eventos del shell
    window.addEventListener('vma:navigated', handleNavigated);
    window.addEventListener('vma:pomodoro:opened', handlePomodoroOpened);

    // Si ya estamos en el panel cuando arranca este script (race condition
    // posible si study-panel.js carga después de la primera navegación),
    // gatillamos manualmente.
    if (location.hash === '#/panel') {
      // Esperar a que app.js inyecte la página; reintentamos cortamente.
      setTimeout(() => handleNavigated({ detail: { hash: '#/panel' } }), 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }


  /* ==========================================================================
     §15 · EXPORTS · puente con app.js y páginas externas
     ========================================================================== */

  window.VMA = window.VMA || {};
  window.VMA.study = {
    // Lectura del estado (clon de seguridad)
    getState:  () => JSON.parse(JSON.stringify(state)),
    isEmpty:   () => isStateEmpty(state),

    // API de tracking pública para páginas de lección/curso
    markLessonRead,
    markCourseStarted,
    markCourseCompleted,
    markSegmentCompleted,
    markQuizPassed,
    markTermConsulted,

    // Notas
    addNote,
    updateNote,
    deleteNote,

    // Persistencia
    exportProgress,
    importProgressFromFile,

    // Pomodoro · control programático
    pomodoro: {
      start:   () => engine.start(),
      pause:   () => engine.pause(),
      reset:   () => engine.reset(),
      setMode: (m) => engine.setMode(m),
      snapshot:() => engine.getSnapshot(),
      onChange:(fn) => engine.onChange(fn),
    },

    // Catálogo de logros (read-only)
    achievements: ACHIEVEMENTS.map((a) => ({
      id: a.id, name: a.name, hint: a.hint,
    })),

    // Reset completo (con confirmación cliente-side)
    resetAll: () => {
      if (confirm('Esto borrará todo el progreso actual. ¿Continuar?')) {
        state = freshState();
        engine.reset();
        engine.sessionCycles = 0;
        engine.focusSinceLongBreak = 0;
        engine.emit();
        notify();
      }
    },
  };

})();

/* ============================================================================
   FIN DE js/study-panel.js · Verbum Manet Academy · v5 · Paso 5
   ============================================================================ */

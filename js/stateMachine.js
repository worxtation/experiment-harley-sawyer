/* =============================================
   STATEMACHINE.JS — Máquina de estados, transições, timers
   ============================================= */

'use strict';

const StateMachine = (() => {
  let currentState = 'idle';
  let previousState = null;
  let stateTimer = null;
  let idleTimer = null;
  let narrowedTimer = null;

  // Rastreamento de interação
  let clickCount = 0;
  let clickTimer = null;
  let lastMouseMoveTime = Date.now();
  let mouseMoveSpeed = 0;
  let lastMousePos = { x: 0, y: 0 };
  let mouseMoveTimer = null;
  let idleStartTime = Date.now();
  let lastActionTime = Date.now();
  let actionRepeatCount = 0;

  // Easter egg — sequência para BARED
  // Clicar 3x no olho + esperar 2s + mover mouse em círculo
  let easterEggStep = 0;
  let easterEggTimer = null;
  let circleTracker = { points: [], active: false };

  const TRANSITION_DURATION = 350; // ms da transição via CLOSED

  // Callbacks externos
  let onStateChange = null;

  function init(callback) {
    onStateChange = callback;

    // Event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Inicia sequência de boot
    transitionTo('returns');
    setTimeout(() => {
      transitionTo('idle');
    }, 2500);

    // Timer de inatividade (narrowed)
    resetIdleTimer();
  }

  // =============================================
  // Transição de estado
  // =============================================

  function transitionTo(newState, skipClosed = false) {
    if (newState === currentState) return;

    const prevState = currentState;

    // Estados que não usam transição CLOSED
    const skipClosedStates = ['closed', 'returns', 'shutdown', 'ethereal'];
    const useClosedTransition = !skipClosed && !skipClosedStates.includes(newState) && !skipClosedStates.includes(currentState);

    if (useClosedTransition) {
      // Passa pelo estado CLOSED brevemente
      setState('closed');
      clearTimeout(stateTimer);
      stateTimer = setTimeout(() => {
        setState(newState);
      }, TRANSITION_DURATION);
    } else {
      setState(newState);
    }
  }

  function setState(state) {
    previousState = currentState;
    currentState = state;

    document.body.dataset.state = state;

    // Remove todas as classes de estado do body
    document.body.className = document.body.className
      .replace(/\bstate-\S+/g, '')
      .trim();
    document.body.classList.add(`state-${state}`);

    if (onStateChange) onStateChange(state, previousState);
  }

  // =============================================
  // Timers de inatividade
  // =============================================

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    clearTimeout(narrowedTimer);
    lastActionTime = Date.now();

    // NARROWED após 30s de inatividade
    narrowedTimer = setTimeout(() => {
      if (currentState === 'idle') {
        transitionTo('narrowed');
      }
    }, 30000);

    // AMUSED após 60s sem interação
    idleTimer = setTimeout(() => {
      if (['idle', 'narrowed'].includes(currentState)) {
        transitionTo('amused');
        setTimeout(() => transitionTo('idle'), 5000);
      }
    }, 60000);
  }

  function resetActivityTimers() {
    if (!['aggressive', 'bared', 'many', 'shutdown'].includes(currentState)) {
      resetIdleTimer();
    }
  }

  // =============================================
  // Handler: clique
  // =============================================

  function handleClick(e) {
    clickCount++;
    lastActionTime = Date.now();
    resetActivityTimers();

    // Easter egg tracking — step 1: 3 clicks no olho
    const eyeSvg = document.getElementById('eye-svg');
    if (eyeSvg) {
      const rect = eyeSvg.getBoundingClientRect();
      const inEye = e.clientX >= rect.left && e.clientX <= rect.right
                 && e.clientY >= rect.top  && e.clientY <= rect.bottom;

      if (inEye) {
        easterEggStep = (easterEggStep || 0) + 1;
        clearTimeout(easterEggTimer);

        if (easterEggStep >= 3) {
          easterEggStep = 0;
          // Aguarda 2s e ativa tracking de círculo
          easterEggTimer = setTimeout(() => {
            circleTracker.active = true;
            circleTracker.points = [];
            setTimeout(() => {
              circleTracker.active = false;
              // Verifica se foi círculo
              if (isCircularMovement(circleTracker.points)) {
                transitionTo('bared', true);
                setTimeout(() => transitionTo('many'), 4000);
                setTimeout(() => transitionTo('idle'), 8000);
              }
            }, 3000);
          }, 2000);
        } else {
          easterEggTimer = setTimeout(() => { easterEggStep = 0; }, 2500);
        }
      } else {
        easterEggStep = 0;
      }
    }

    // Lógica normal de cliques
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 800);

    // Estado baseado em contagem de cliques
    if (clickCount === 1) {
      if (!['aggressive', 'bared', 'many', 'shutdown'].includes(currentState)) {
        transitionTo('squinting');
        stateTimer = setTimeout(() => transitionTo('idle'), 2000);
      }
    } else if (clickCount >= 3 && clickCount < 5) {
      clearTimeout(stateTimer);
      transitionTo('crimson', true);
      stateTimer = setTimeout(() => transitionTo('idle'), 5000);
    } else if (clickCount >= 5) {
      clearTimeout(stateTimer);
      transitionTo('aggressive', true);
      stateTimer = setTimeout(() => {
        transitionTo('crimson', true);
        setTimeout(() => transitionTo('idle'), 4000);
      }, 3000);
    }
  }

  // =============================================
  // Handler: movimento do mouse
  // =============================================

  function handleMouseMove(e) {
    const now = Date.now();
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = now - lastMouseMoveTime;

    if (dt > 0) {
      mouseMoveSpeed = dist / dt * 1000; // px/s
    }

    lastMousePos = { x: e.clientX, y: e.clientY };
    lastMouseMoveTime = now;
    resetActivityTimers();

    // Easter egg — rastreia pontos para detecção de círculo
    if (circleTracker.active) {
      circleTracker.points.push({ x: e.clientX, y: e.clientY, t: now });
    }

    // PATROL: mouse se movendo rapidamente (> 800 px/s)
    if (mouseMoveSpeed > 800) {
      if (!['aggressive', 'bared', 'many', 'shutdown', 'squinting', 'crimson'].includes(currentState)) {
        clearTimeout(mouseMoveTimer);
        if (currentState !== 'patrol') {
          transitionTo('patrol');
        }
        // Volta ao IDLE 3s após parar de mover
        mouseMoveTimer = setTimeout(() => {
          if (currentState === 'patrol') {
            transitionTo('idle');
          }
        }, 3000);
      }
    }

    // WATCHING: mouse parado no centro por 3s
    const screenCX = window.innerWidth / 2;
    const screenCY = window.innerHeight / 2;
    const centerDist = Math.sqrt(
      (e.clientX - screenCX) ** 2 + (e.clientY - screenCY) ** 2
    );
    const centerThreshold = Math.min(window.innerWidth, window.innerHeight) * 0.15;

    if (centerDist < centerThreshold) {
      if (!['aggressive', 'bared', 'many', 'shutdown', 'patrol'].includes(currentState)) {
        clearTimeout(stateTimer);
        stateTimer = setTimeout(() => {
          if (!['aggressive', 'bared', 'many', 'shutdown'].includes(currentState)) {
            transitionTo('watching');
          }
        }, 3000);
      }
    }
  }

  // =============================================
  // Handler: visibilidade / foco
  // =============================================

  function handleVisibility() {
    if (document.hidden) {
      transitionTo('shutdown', true);
    } else {
      transitionTo('ethereal', true);
      setTimeout(() => transitionTo('idle'), 2500);
    }
  }

  function handleFocus() {
    if (currentState === 'shutdown') {
      transitionTo('ethereal', true);
      setTimeout(() => transitionTo('idle'), 2500);
    }
  }

  function handleBlur() {
    transitionTo('shutdown', true);
  }

  // =============================================
  // Detecção de movimento circular (easter egg)
  // =============================================

  function isCircularMovement(points) {
    if (points.length < 20) return false;

    // Calcula centroide
    const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const cy = points.reduce((s, p) => s + p.y, 0) / points.length;

    // Calcula raio médio e variação
    const radii = points.map(p => Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2));
    const avgRadius = radii.reduce((s, r) => s + r, 0) / radii.length;
    const variance = radii.reduce((s, r) => s + (r - avgRadius) ** 2, 0) / radii.length;
    const stdDev = Math.sqrt(variance);

    // Verifica se ângulos cobrem 360°
    const angles = points.map(p => Math.atan2(p.y - cy, p.x - cx) * 180 / Math.PI);
    const minAngle = Math.min(...angles);
    const maxAngle = Math.max(...angles);
    const coverage = maxAngle - minAngle;

    // É circular se: raio consistente (baixo desvio) e cobertura > 270°
    return stdDev / avgRadius < 0.4 && coverage > 270 && avgRadius > 50;
  }

  // =============================================
  // API pública
  // =============================================

  function getState() { return currentState; }
  function getPreviousState() { return previousState; }

  function forceState(state) {
    clearTimeout(stateTimer);
    transitionTo(state, true);
  }

  return { init, getState, getPreviousState, forceState, transitionTo };
})();

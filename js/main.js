/* =============================================
   MAIN.JS — Entry point: inicialização e event listeners globais
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // Elementos da DOM
  // =============================================
  const eyeSvg         = document.getElementById('eye-svg');
  const noiseCanvas    = document.getElementById('noise-canvas');
  const glitchCanvas   = document.getElementById('glitch-canvas');
  const terminalOut    = document.getElementById('terminal-text');
  const terminalCursor = document.getElementById('terminal-cursor');
  const crtScreen      = document.querySelector('.crt-screen');
  const cursorEl       = document.getElementById('cursor');

  // Janelas do CRT OS
  const eyeWindow      = document.getElementById('eye-window');
  const eyeBadge       = document.getElementById('eye-window-badge');

  // Launch screen
  const launchScreen   = document.getElementById('launch-screen');
  const launchBtn      = document.getElementById('launch-btn');

  // Labels de estado para o badge da janela do olho
  const EYE_STATE_LABELS = {
    idle:      'IDLE',
    watching:  'ACTIVE',
    amused:    'ACTIVE',
    squinting: 'WARN',
    crimson:   'ALERT',
    aggressive:'ALERT',
    patrol:    'SCAN',
    narrowed:  'SCAN',
    many:      'ERR',
    ethereal:  'DEEP',
    bared:     'ERR',
    returns:   'BOOT',
    shutdown:  'OFF',
    closed:    'SYS',
  };

  // Estados em que a janela do olho é considerada "ativa" (em ação)
  const EYE_ACTIVE_STATES = new Set([
    'watching', 'amused', 'squinting', 'crimson', 'aggressive',
    'patrol', 'narrowed', 'many', 'ethereal', 'bared',
  ]);

  // =============================================
  // Cursor customizado — crosshair segue o mouse
  // =============================================

  if (cursorEl) {
    let cursorX = -100, cursorY = -100;
    let targetX = -100, targetY = -100;
    let cursorFrame;
    let cursorHideTimer = null;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Mostra cursor se estava oculto
      cursorEl.classList.remove('cursor-hidden');

      // Oculta após 10s sem movimento
      clearTimeout(cursorHideTimer);
      cursorHideTimer = setTimeout(() => {
        cursorEl.classList.add('cursor-hidden');
      }, 10000);
    });

    document.addEventListener('mouseleave', () => {
      targetX = -200;
      targetY = -200;
      clearTimeout(cursorHideTimer);
      cursorEl.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
      cursorEl.classList.remove('cursor-hidden');
    });

    // Suavização leve do cursor para ter um "lag" orgânico
    function animateCursor() {
      cursorX += (targetX - cursorX) * 0.35;
      cursorY += (targetY - cursorY) * 0.35;
      cursorEl.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      cursorFrame = requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // =============================================
  // Inicializa módulos
  // =============================================

  try { Effects.initNoise(noiseCanvas); } catch(e) { console.error('[Effects.initNoise]', e); }
  try { Effects.initGlitch(glitchCanvas); } catch(e) { console.error('[Effects.initGlitch]', e); }
  try { Effects.startLoop(); } catch(e) { console.error('[Effects.startLoop]', e); }

  Dialogue.init(terminalOut, terminalCursor);

  // =============================================
  // Botão de entrada — inicia tudo no click
  // =============================================

  launchBtn?.addEventListener('click', () => {
    launchScreen?.classList.add('hidden');
    setTimeout(() => launchScreen?.remove(), 750);
    document.body.classList.add('program-active');

    try { Eye.init(eyeSvg); } catch(e) { console.error('[Eye.init]', e); }
    Audio.init();
    Voice.init();

    startProgram();
  });

  // =============================================
  // Diálogos por estado
  // =============================================

  let dialogueTimer = null;

  function startProgram() {

  // ── Restore link — clique provoca raiva máxima ───────────────────────────
  const restoreLink = document.getElementById('restore-link');
  restoreLink?.addEventListener('click', (e) => {
    e.preventDefault();
    StateMachine.forceState('aggressive');
    Audio.playRage();
    new window.Audio('assets/audio/whoisthat_AshSmKfJ.mp3').play().catch(() => {});
    Effects.triggerGlitch(2500, 1.8);
    setTimeout(() => {
      if (StateMachine.getState() === 'aggressive') {
        StateMachine.transitionTo('crimson', true);
        setTimeout(() => StateMachine.transitionTo('idle'), 3500);
      }
    }, 2600);
  });

  // =============================================
  // Inicializa state machine com callback
  // =============================================

  StateMachine.init((newState, prevState) => {
    // Aplica estado no olho SVG
    Eye.applyState(newState);

    // Efeitos de áudio
    Audio.onStateChange(newState);

    // Glitch em estados caóticos
    if (['aggressive', 'many', 'bared'].includes(newState)) {
      Effects.triggerGlitch(
        newState === 'aggressive' ? 500 : 700,
        newState === 'aggressive' ? 1.3 : 1.0
      );
    } else if (newState === 'crimson') {
      Effects.triggerGlitch(220, 0.55);
    } else if (newState === 'shutdown') {
      Effects.triggerGlitch(900, 0.75);
    } else if (newState === 'squinting') {
      Effects.triggerGlitch(120, 0.4);
    }

    // Diálogo
    handleDialogue(newState, prevState);

    // Flicker no CRT
    if (['idle', 'watching', 'narrowed'].includes(newState)) {
      crtScreen?.classList.add('crt-flicker');
    } else {
      crtScreen?.classList.remove('crt-flicker');
    }

    // Glow dinâmico no olho
    crtScreen?.classList.toggle('eye-glow-active',
      ['watching', 'ethereal', 'aggressive', 'patrol', 'returns'].includes(newState)
    );

    // ── Foco das janelas ──────────────────────────────────────────
    // Eye window: ativa nos estados de ação intencional do olho
    eyeWindow?.classList.toggle('window-active', EYE_ACTIVE_STATES.has(newState));
    if (eyeBadge) eyeBadge.textContent = EYE_STATE_LABELS[newState] ?? newState.toUpperCase();

    // Noise intensity por estado
    const noiseIntensity =
      newState === 'aggressive' ? 0.65
      : newState === 'many'     ? 0.55
      : newState === 'bared'    ? 0.50
      : newState === 'narrowed' ? 0.25
      : newState === 'shutdown' ? 0.15
      : 0.38;

    // Atualiza intensidade do noise loop
    Effects.setNoiseIntensity(noiseIntensity);
  });

  function handleDialogue(state, prev) {
    clearTimeout(dialogueTimer);

    if (state === 'closed') return;
    if (Voice.isPlaying()) return;

    if (state === 'returns') {
      dialogueTimer = setTimeout(() => {
        Dialogue.sayForState('returns');
      }, 900);
      return;
    }

    // Delay antes de falar — personagem não responde imediatamente
    const delay =
        state === 'idle'       ? 3500 + Math.random() * 5000
      : state === 'narrowed'   ? 6000 + Math.random() * 6000
      : state === 'watching'   ? 900  + Math.random() * 1200
      : state === 'amused'     ? 500  + Math.random() * 400
      : state === 'squinting'  ? 280  + Math.random() * 180
      : state === 'crimson'    ? 450  + Math.random() * 450
      : state === 'aggressive' ? 80   + Math.random() * 80
      : state === 'many'       ? 180
      : state === 'bared'      ? 1800
      : state === 'patrol'     ? 1100 + Math.random() * 700
      : state === 'ethereal'   ? 900  + Math.random() * 500
      : state === 'shutdown'   ? 180
      : 2200;

    dialogueTimer = setTimeout(() => {
      if (StateMachine.getState() === state) {
        Dialogue.sayForState(state);
      }
    }, delay);
  }

  // =============================================
  // Glitch espontâneo — monitor falhando
  // Aparece aleatoriamente a cada 20–30s independente de interação
  // =============================================

  function scheduleRandomGlitch() {
    const delay = 20000 + Math.random() * 10000;
    setTimeout(() => {
      const state = StateMachine.getState();
      // Mais dramático em estados calmos — o monitor falha sozinho
      if (!['aggressive', 'many', 'bared', 'shutdown'].includes(state)) {
        Effects.triggerGlitch(
          60 + Math.random() * 140,
          0.25 + Math.random() * 0.30
        );
      }
      scheduleRandomGlitch();
    }, delay);
  }
  scheduleRandomGlitch();

  // =============================================
  // Frase aleatória periódica no IDLE
  // =============================================

  function scheduleIdleDialogue() {
    const delay = 14000 + Math.random() * 12000;
    setTimeout(() => {
      if (StateMachine.getState() === 'idle' && !Voice.isPlaying()) {
        Dialogue.sayForState('idle');
      }
      scheduleIdleDialogue();
    }, delay);
  }
  scheduleIdleDialogue();

  // =============================================
  // Boot animation
  // =============================================

  crtScreen?.classList.add('crt-boot');

  setTimeout(() => {
    crtScreen?.classList.remove('crt-boot');
  }, 2000);

  } // end startProgram

});

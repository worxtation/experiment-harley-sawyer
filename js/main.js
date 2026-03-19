/* =============================================
   MAIN.JS — Entry point: inicialização e event listeners globais
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // Elementos da DOM
  // =============================================
  const eyeSvg        = document.getElementById('eye-svg');
  const noiseCanvas   = document.getElementById('noise-canvas');
  const glitchCanvas  = document.getElementById('glitch-canvas');
  const terminalOut   = document.getElementById('terminal-text');
  const terminalCursor = document.getElementById('terminal-cursor');
  const crtScreen     = document.querySelector('.crt-screen');
  const cursorEl      = document.getElementById('cursor');

  // =============================================
  // Cursor customizado — crosshair segue o mouse
  // =============================================

  if (cursorEl) {
    let cursorX = -100, cursorY = -100;
    let targetX = -100, targetY = -100;
    let cursorFrame;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      targetX = -200;
      targetY = -200;
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

  try { Eye.init(eyeSvg); } catch(e) { console.error('[Eye.init]', e); }

  Dialogue.init(terminalOut, terminalCursor);

  // Inicializa áudio após primeiro clique (política de autoplay)
  let audioInitialized = false;
  document.addEventListener('click', () => {
    if (!audioInitialized) {
      Audio.init();
      audioInitialized = true;
    }
  }, { once: false });

  // =============================================
  // Diálogos por estado
  // =============================================

  let dialogueTimer = null;

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
        if (['many', 'bared'].includes(state)) {
          Dialogue.typeGlitched(getRandomPhrase(state));
        } else {
          Dialogue.sayForState(state);
        }
      }
    }, delay);
  }

  function getRandomPhrase(state) {
    const phrases = {
      many:  ['S̷I̴N̵A̷L̸ ̸P̷E̴R̸D̵I̷D̴O̸', '[ERRO: ESTADO INVÁLIDO]', 'E̷R̸R̷O̸ ̷D̸E̸ ̷C̵O̷N̸E̷X̷Ã̷O̸', '//KERNEL_FAULT//'],
      bared: ['...', 'Você encontrou algo que não deveria existir.'],
    };
    const list = phrases[state] || ['...'];
    return list[Math.floor(Math.random() * list.length)];
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
      if (StateMachine.getState() === 'idle') {
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

});

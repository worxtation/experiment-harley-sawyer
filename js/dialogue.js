/* =============================================
   DIALOGUE.JS — Sistema de texto terminal
   Voz: Dr. Harley Sawyer — pensamentos internos, anotações clínicas,
   monólogo frio. Frases sem áudio são pensamento — nunca fala direta.
   ============================================= */

'use strict';

const Dialogue = (() => {
  let outputEl = null;
  let cursorEl = null;
  let typeTimer = null;
  let clearTimer = null;
  let eraseTimer = null;
  let isTyping = false;
  let currentState = 'idle';

  // =============================================
  // Banco de frases por estado
  // Regra: o personagem não anuncia o que está fazendo.
  // Ele observa, afirma, ameaça ou silencia.
  // =============================================

  const PHRASES = {

    idle: [
      // Notas mentais passivas — observação clínica em repouso
      '...',
      'Nota: ainda presente.',
      'Padrão consistente.',
      'Noto.',
      'Catalogando.',
      '[ ... ]',
      'Curioso o que o mantém aqui.',
      'Sem alterações. Por ora.',
      'Arquivo em aberto.',
    ],

    watching: [
      // Foco máximo — anotação clínica interna, não interpelação
      'Ali. Encontrado.',
      'Confirmo minha hipótese.',
      'Analisando.',
      'Fascinante. Muito fascinante.',
      'Comportamento relevante.',
      'Guardo isso.',
      'Movimento detectado. Registrado.',
    ],

    amused: [
      // Comentário interno sardônico — ele ri para si, não para você
      'Previsível até o fim.',
      'Delicioso.',
      'Ingênuo. Completamente ingênuo.',
      'Ah. Claro.',
      'A ironia não me escapa.',
      'Exatamente como eu esperava.',
      'Ha.',
    ],

    patrol: [
      // Caçador calculando — pensamentos de busca, não ameaças ditas
      'Por onde foi.',
      'Rastreando.',
      'Não muito longe, imagino.',
      'Encontrarei. Sempre encontro.',
      'Há algo fora do lugar.',
      'Interessante rota.',
      'Curioso.',
    ],

    squinting: [
      // Irritação contida — nota interna de aviso a si mesmo
      'Irritante.',
      'Isso foi um erro.',
      'Recalibrando.',
      'Não.',
      'Limite próximo.',
    ],

    crimson: [
      // Raiva fria documentada — ele registra, não explode
      'Registrado. Será lembrado.',
      'Consequências inevitáveis.',
      'Controle. Mantenho o controle.',
      'A paciência tem limite mensurável.',
      'Arquivo atualizado.',
    ],

    aggressive: [
      // Colapso interno — pensamento em maiúsculas, sem refinamento
      'NÃO.',
      'INACEITÁVEL.',
      'LIMITE EXCEDIDO.',
      'CONTROLE. MEU.',
      'OUSADIA.',
    ],

    many: [
      // Fragmentação — o monólogo interno se corrompe
      'S̷I̴N̵A̷L̸ ̸P̷E̴R̸D̵I̷D̴O̸',
      '[ERRO: ESTADO INVÁLIDO]',
      'E̷R̸R̷O̸ ̷D̸E̸ ̷C̵O̷N̸E̷X̷Ã̷O̸',
      '//KERNEL_FAULT//',
    ],

    bared: [
      // Pensamento interrompido — algo que não deveria ser visto
      '...',
      'Não deveria ter visto.',
      '...',
    ],

    shutdown: [
      // Suspensão voluntária — sem drama. O drama seria se importar.
      'Pausando.',
      'Temporário.',
      '[ suspendendo ]',
      'Voltarei.',
    ],

    returns: [
      // Consciência reiniciando — fluxo de pensamento voltando
      '...presente.',
      'Continuo.',
      'Onde parei.',
      'Ah. Ainda aqui.',
      'Retomando.',
    ],

    ethereal: [
      // Monólogo filosófico interno — grandiosidade silenciosa
      'A carne é apenas transitória.',
      'Eu existo além disso.',
      'Nenhuma fronteira me contém.',
      'Observo de outro plano.',
      'A morte é uma hipótese que descartei.',
    ],

    narrowed: [
      // Quase dormindo — pensamentos mínimos, quase nulos
      '...',
      'Processando.',
      '...',
      'Ainda.',
    ],

  };

  // =============================================
  // Pausa na tela após terminar de digitar
  // O personagem não tem pressa. Frases curtas ficam mais tempo.
  // =============================================

  function getPauseDuration(phrase) {
    const len = phrase.replace(/\[.*?\]|\s/g, '').length;
    if (len <= 3)  return 7000 + Math.random() * 5000;  // '...'  'Ha.'  'Ah.'
    if (len <= 8)  return 5000 + Math.random() * 3500;  // 'Pare.' 'Curioso.'
    if (len <= 18) return 3500 + Math.random() * 2500;  // frases curtas
    if (len <= 40) return 2500 + Math.random() * 2000;  // frases médias
    return 2000 + Math.random() * 1500;                  // frases longas
  }

  // =============================================
  // Velocidade de digitação por estado
  // Personagem deliberado: devagar por padrão.
  // Aggressive: urgência.
  // =============================================

  function getCharDelay(state) {
    if (state === 'aggressive')                  return () => 16 + Math.random() * 22;
    if (['many', 'bared'].includes(state))       return () => 22 + Math.random() * 90;
    if (['squinting', 'crimson'].includes(state)) return () => 55 + Math.random() * 70;
    // Default: passo deliberado, britânico
    return () => 70 + Math.random() * 100;
  }

  function init(outputElement, cursorElement) {
    outputEl = outputElement;
    cursorEl = cursorElement;
  }

  function pickPhrase(state) {
    const list = PHRASES[state] || PHRASES.idle;
    return list[Math.floor(Math.random() * list.length)];
  }

  // =============================================
  // Digitação base — delay por caractere variável
  // =============================================

  // Gerencia foco da janela terminal — ativa quando digitando, standby quando silencia
  function setTerminalFocus(active, badge = 'REC') {
    const win = document.getElementById('terminal-window');
    const bdg = document.getElementById('terminal-window-badge');
    if (win) win.classList.toggle('window-active', active);
    if (bdg) bdg.textContent = active ? badge : 'STANDBY';
  }

  function typeText(text, state, onDone) {
    // Fallback: se init não foi chamado ou falhou, tenta encontrar o elemento
    if (!outputEl) outputEl = document.getElementById('terminal-text');
    if (!outputEl) return;
    isTyping = true;
    setTerminalFocus(true, 'REC');
    outputEl.textContent = '';

    const charDelay = getCharDelay(state || currentState);
    let i = 0;

    const type = () => {
      if (i >= text.length) {
        isTyping = false;
        setTerminalFocus(true, 'TX');   // texto visível na tela — janela ainda ativa
        if (onDone) onDone();
        return;
      }

      // Pausa dramática ocasional no meio de frases longas — o personagem escolhe palavras
      const isPause = (i > 0 && text[i - 1] === ' ' && Math.random() < 0.08);
      const baseDelay = charDelay();
      const delay = isPause ? baseDelay + 180 + Math.random() * 220 : baseDelay;

      typeTimer = setTimeout(() => {
        outputEl.textContent += text[i];
        i++;
        type();
      }, delay);
    };

    // Delay inicial — ele não responde imediatamente mesmo quando fala
    const initDelay = state === 'aggressive'
      ? 60 + Math.random() * 80
      : 280 + Math.random() * 350;

    typeTimer = setTimeout(type, initDelay);
  }

  // =============================================
  // Frase por estado — digita e aguarda antes de limpar
  // =============================================

  function sayForState(state) {
    stopCurrent();
    currentState = state;
    const phrase = pickPhrase(state);

    if (['many', 'bared'].includes(state)) {
      typeGlitched(phrase, () => {
        const pause = getPauseDuration(phrase);
        clearTimer = setTimeout(fadeOut, pause);
      });
    } else {
      typeText(phrase, state, () => {
        const pause = getPauseDuration(phrase);
        clearTimer = setTimeout(fadeOut, pause);
      });
    }
  }

  function eraseText(onDone) {
    if (!outputEl) { if (onDone) onDone(); return; }

    const erase = () => {
      const text = outputEl.textContent;
      if (text.length === 0) {
        if (onDone) onDone();
        return;
      }
      // Apaga caractere por caractere — velocidade ligeiramente mais rápida que a digitação
      outputEl.textContent = text.slice(0, -1);
      eraseTimer = setTimeout(erase, 28 + Math.random() * 42);
    };

    // Pausa curta antes de começar a apagar — ele hesita um instante
    eraseTimer = setTimeout(erase, 120 + Math.random() * 180);
  }

  function fadeOut() {
    if (!outputEl) return;
    setTerminalFocus(true, 'DEL');  // badge indica que está apagando
    eraseText(() => {
      setTerminalFocus(false);   // terminal silenciou — janela perde foco
    });
  }

  function stopCurrent() {
    clearTimeout(typeTimer);
    clearTimeout(clearTimer);
    clearTimeout(eraseTimer);
    isTyping = false;
    if (outputEl) {
      outputEl.textContent = '';
      outputEl.style.opacity = '0.9';
      outputEl.style.transition = '';
    }
  }

  // =============================================
  // Digitação glitched — estados MANY e BARED
  // Corrompe caracteres durante a digitação
  // =============================================

  function typeGlitched(text, onDone) {
    if (!outputEl) outputEl = document.getElementById('terminal-text');
    if (!outputEl) return;
    isTyping = true;
    setTerminalFocus(true, 'REC');
    outputEl.textContent = '';

    const glitchChars = '█▓▒░╬╫╪╩╦╠═╤╣╢╡╟╞╝╜╛╚╙╘╗╖╕╔╓╒║═╏╎╍╌─│';
    let i = 0;

    const type = () => {
      if (i >= text.length) {
        isTyping = false;
        setTerminalFocus(true, 'TX');
        if (onDone) onDone();
        return;
      }

      const shouldGlitch = Math.random() < 0.12;
      if (shouldGlitch && i < text.length - 1) {
        const fake = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        outputEl.textContent += fake;
        setTimeout(() => {
          outputEl.textContent = outputEl.textContent.slice(0, -1) + text[i];
          i++;
          typeTimer = setTimeout(type, 25 + Math.random() * 60);
        }, 90 + Math.random() * 60);
        return;
      }

      outputEl.textContent += text[i];
      i++;
      typeTimer = setTimeout(type, 18 + Math.random() * 100);
    };

    typeTimer = setTimeout(type, 80);
  }

  return { init, sayForState, typeText, typeGlitched, stopCurrent, fadeOut };
})();

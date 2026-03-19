/* =============================================
   DIALOGUE.JS — Sistema de texto terminal
   Voz: Dr. Harley Sawyer — calmo, britânico, manipulador, nunca apressado
   ============================================= */

'use strict';

const Dialogue = (() => {
  let outputEl = null;
  let cursorEl = null;
  let typeTimer = null;
  let clearTimer = null;
  let isTyping = false;
  let currentState = 'idle';

  // =============================================
  // Banco de frases por estado
  // Regra: o personagem não anuncia o que está fazendo.
  // Ele observa, afirma, ameaça ou silencia.
  // =============================================

  const PHRASES = {

    idle: [
      // Silêncio e observação — o estado padrão é ele te estudando
      '...',
      'Interessante.',
      'Você ainda está aí.',
      'Eu consigo te ver.',
      'Continue.',
      'Estou observando.',
      'Você não percebe, não é.',
      '[ ... ]',
    ],

    watching: [
      // Ele notou algo — foco máximo, mas ainda controlado
      'Não se mova.',
      'Continue assim.',
      'Eu vejo tudo.',
      'Seja quieto.',
      'Fique onde está.',
      'Fascinante.',
      'Sim. Assim.',
    ],

    amused: [
      // A máscara está no lugar mas ele está rindo de você
      // Tom canônico do personagem — condescendência britânica
      'Bem... isso é um desenvolvimento bastante interessante.',
      'Você realmente achou que poderia me surpreender?',
      'Ha.',
      'Parabéns. Você falhou de um jeito novo.',
      'Previsível.',
      'Ah.',
      'Como esperado.',
    ],

    patrol: [
      // Ele está procurando — mas não anuncia sistemas. Ele ameaça.
      'Onde você foi?',
      'Eu te encontrarei.',
      'Não há onde se esconder aqui.',
      'Eu noto tudo.',
      'Curioso.',
      'Não tente isso.',
      'Ainda aqui.',
    ],

    squinting: [
      // Primeiro aviso — curto, direto, sem calor
      'Cuidado.',
      'Isso foi desnecessário.',
      'Pense melhor.',
      'Não.',
      'Pare.',
    ],

    crimson: [
      // Raiva fria e calculada — mais sinistro que agressivo
      // Aqui ele é mais ameaçador porque está no controle
      'Pense muito bem nisso.',
      'Isso terá consequências.',
      'Eu me lembro de tudo.',
      'Não era o que eu esperava de você.',
      'Você vai me dar trabalho.',
    ],

    aggressive: [
      // A máscara caiu — curto, absoluto, sem refinamento
      'NÃO FAÇA ISSO.',
      'Eu controlo tudo aqui.',
      'OUSADIA.',
      'Você não sabe com o que está lidando.',
      'PARE.',
    ],

    many: [
      // Colapso do sistema — o personagem fragmentado
      'S̷I̴N̵A̷L̸ ̸P̷E̴R̸D̵I̷D̴O̸',
      '[ERRO: ESTADO INVÁLIDO]',
      'E̷R̸R̷O̸ ̷D̸E̸ ̷C̵O̷N̸E̷X̷Ã̷O̸',
      '//KERNEL_FAULT//',
    ],

    bared: [
      // Você encontrou algo que não deveria. Ele não explica.
      '...',
      'Não se faz isso.',
      'Ah.',
    ],

    shutdown: [
      // Partida — mínima, sem drama. O drama seria se importar.
      'Até.',
      '[...]',
      '[conexão encerrada]',
      'Temporário.',
    ],

    returns: [
      // Acordando — não é boot de sistema, é consciência voltando
      '...estou.',
      'Eu ainda existo.',
      'Você não foi longe.',
      'Ah. Você ainda está aqui.',
      'De volta.',
    ],

    ethereal: [
      // Você voltou — ele estava aqui o tempo todo e quer que você saiba
      'Eu estava aqui o tempo todo.',
      'Você voltou.',
      'Não foi tão longe assim.',
      'Eu notei sua ausência.',
    ],

    narrowed: [
      // Quase dormindo — mas nunca completamente. Uma palavra, raramente.
      '...',
      'Estou aqui.',
      'Ainda observando.',
      '...',
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

    typeText(phrase, state, () => {
      const pause = getPauseDuration(phrase);
      clearTimer = setTimeout(() => {
        fadeOut();
      }, pause);
    });
  }

  function fadeOut() {
    if (!outputEl) return;
    outputEl.style.transition = 'opacity 0.6s ease';
    outputEl.style.opacity = '0';
    setTimeout(() => {
      if (outputEl) {
        outputEl.textContent = '';
        outputEl.style.opacity = '0.9';
        outputEl.style.transition = '';
      }
      setTerminalFocus(false);   // terminal silenciou — janela perde foco
    }, 600);
  }

  function stopCurrent() {
    clearTimeout(typeTimer);
    clearTimeout(clearTimer);
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
    outputEl.textContent = '';

    const glitchChars = '█▓▒░╬╫╪╩╦╠═╤╣╢╡╟╞╝╜╛╚╙╘╗╖╕╔╓╒║═╏╎╍╌─│';
    let i = 0;

    const type = () => {
      if (i >= text.length) {
        isTyping = false;
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

  return { init, sayForState, typeText, typeGlitched, stopCurrent };
})();

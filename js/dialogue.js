/* =============================================
   DIALOGUE.JS — Sistema de texto terminal
   ============================================= */

'use strict';

const Dialogue = (() => {
  let outputEl = null;
  let cursorEl = null;
  let typeTimer = null;
  let clearTimer = null;
  let currentQueue = [];
  let isTyping = false;

  // Frases por estado
  const PHRASES = {
    idle: [
      '...',
      'Interessante.',
      'Você ainda está aí.',
      'Eu consigo te ver.',
      'Continue.',
      '[ ... ]',
    ],
    watching: [
      'Não se mova.',
      'Continue assim.',
      'Eu vejo tudo.',
      'Você é fascinante.',
      'Fique onde está.',
    ],
    amused: [
      'Bem... isso é um desenvolvimento bastante interessante.',
      'Você realmente achou que poderia me surpreender?',
      'Ha.',
      'Parabéns. Você falhou de um jeito novo.',
      'Previsível.',
    ],
    patrol: [
      'Onde você foi?',
      'Eu te encontrarei.',
      'Não há onde se esconder aqui.',
      'Escaneando...',
      '[ rastreando ]',
    ],
    squinting: [
      'Cuidado.',
      'Isso foi desnecessário.',
      'Pense melhor.',
    ],
    crimson: [
      'Você não deveria ter feito isso.',
      'Interessante escolha.',
      '[ processando ]',
    ],
    aggressive: [
      'NÃO FAÇA ISSO.',
      'Eu controlo tudo aqui.',
      'Você vai se arrepender.',
      'OUSADIA.',
    ],
    many: [
      'S̷I̴N̵A̷L̸ ̸P̷E̴R̸D̵I̷D̴O̸',
      '[ERRO: ESTADO INVÁLIDO]',
      'E̷R̸R̷O̸ ̷D̸E̸ ̷C̵O̷N̸E̷X̷Ã̷O̸',
      '//KERNEL_FAULT//',
    ],
    bared: [
      '...',
      'Você encontrou algo que não deveria existir.',
    ],
    shutdown: [
      'Até.',
      '[...]',
      '[conexão encerrada]',
    ],
    returns: [
      'Inicializando...',
      'Sistema online.',
      'Eu ainda estou aqui.',
    ],
    ethereal: [
      'Eu estava observando.',
      'Você voltou.',
      'Bem-vindo de volta.',
    ],
    narrowed: [
      '...',
      '[ aguardando ]',
      '...',
    ],
  };

  function init(outputElement, cursorElement) {
    outputEl = outputElement;
    cursorEl = cursorElement;
  }

  // Seleciona frase aleatória para o estado
  function pickPhrase(state) {
    const list = PHRASES[state] || PHRASES.idle;
    return list[Math.floor(Math.random() * list.length)];
  }

  // Digita texto caractere a caractere com delay variável
  function typeText(text, onDone) {
    if (!outputEl) return;
    isTyping = true;
    outputEl.textContent = '';

    let i = 0;
    const type = () => {
      if (i >= text.length) {
        isTyping = false;
        if (onDone) onDone();
        return;
      }

      outputEl.textContent += text[i];
      i++;

      // Delay não-determinístico por caractere
      const delay = 40 + Math.random() * 80;
      typeTimer = setTimeout(type, delay);
    };

    typeTimer = setTimeout(type, 200 + Math.random() * 300); // delay inicial
  }

  // Exibe frase para o estado atual, depois limpa após pausa
  function sayForState(state) {
    stopCurrent();

    const phrase = pickPhrase(state);
    typeText(phrase, () => {
      // Aguarda antes de limpar
      const pauseDuration = 2000 + Math.random() * 3000;
      clearTimer = setTimeout(() => {
        fadeOut();
      }, pauseDuration);
    });
  }

  function fadeOut() {
    if (!outputEl) return;
    outputEl.style.transition = 'opacity 0.5s ease';
    outputEl.style.opacity = '0';
    setTimeout(() => {
      if (outputEl) {
        outputEl.textContent = '';
        outputEl.style.opacity = '0.85';
        outputEl.style.transition = '';
      }
    }, 500);
  }

  function stopCurrent() {
    clearTimeout(typeTimer);
    clearTimeout(clearTimer);
    isTyping = false;
    if (outputEl) {
      outputEl.textContent = '';
      outputEl.style.opacity = '0.85';
      outputEl.style.transition = '';
    }
  }

  // Digita com efeito "warble" (varia velocidade)
  function typeGlitched(text, onDone) {
    if (!outputEl) return;
    isTyping = true;
    outputEl.textContent = '';

    let i = 0;
    const type = () => {
      if (i >= text.length) {
        isTyping = false;
        if (onDone) onDone();
        return;
      }

      // Ocasionalmente insere caractere errado e corrige (glitch)
      const shouldGlitch = Math.random() < 0.1;
      if (shouldGlitch && i < text.length - 1) {
        const glitchChars = '█▓▒░╬╫╪╩╦╠═╤╣╢╡╟╞╝╜╛╚╙╘╗╖╕╔╓╒║═╏╎╍╌─│';
        outputEl.textContent += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        setTimeout(() => {
          outputEl.textContent = outputEl.textContent.slice(0, -1) + text[i];
          i++;
          typeTimer = setTimeout(type, 30 + Math.random() * 50);
        }, 80);
        return;
      }

      outputEl.textContent += text[i];
      i++;

      const delay = 20 + Math.random() * 120;
      typeTimer = setTimeout(type, delay);
    };

    typeTimer = setTimeout(type, 100);
  }

  return { init, sayForState, typeText, typeGlitched, stopCurrent };
})();

/* =============================================
   VOICE.JS — Reprodução de falas originais do personagem
   Áudios do jogo Poppy Playtime Chapter 4
   Fonte: poppy-playtime.fandom.com/wiki/Harley_Sawyer/Audio
   Arquivos locais: assets/audio/
   ============================================= */

'use strict';

const Voice = (() => {
  const AUDIO = 'assets/audio';

  /*
   * VOICE_LINES — banco de falas originais do personagem
   *
   * Campos:
   *   id      — identificador único (para controle de repetição)
   *   url     — caminho local do arquivo de áudio (assets/audio/)
   *   text    — transcrição da fala (exibida no terminal enquanto o áudio toca)
   *   state   — estado da máquina de estados disparado durante esta fala
   *   weight  — probabilidade relativa de seleção (default: 1)
   *
   * Estados emocionais mapeados:
   *   watching   — observação clínica, foco analítico, curiosidade predatória
   *   patrol     — vigilância ativa, sondagem psicológica, procurando fraqueza
   *   amused     — ironia britânica, condescendência, satisfação calculada
   *   squinting  — desprezo, irritação contida, julgamento
   *   crimson    — ameaça fria, manipulação intensa, raiva calculada
   *   aggressive — explosão, perda de controle, raiva sem máscara
   *   ethereal   — monólogo filosófico, grandiosidade, transcendência
   *   narrowed   — retirada calculada, introspecção amarga
   *   idle       — presença calma, observação passiva, descarte
   *   returns    — auto-apresentação, consciência reiniciando
   */
  const VOICE_LINES = [

    // ── Presença / Observação ───────────────────────────────────────────
    {
      id: 'here-you-are',
      url: `${AUDIO}/TheDoctor-NoMansLand_(1).mp3`,
      text: 'Ah, and here you are. Just as I expected.',
      state: 'watching',
    },
    {
      id: 'every-bit',
      url: `${AUDIO}/TheDoctor-NoMansLand_(2).mp3`,
      text: 'It appears you are every bit what the Prototype fears.',
      state: 'watching',
    },
    {
      id: 'rare-quality',
      url: `${AUDIO}/TheDoctor-NoMansLand_(3).mp3`,
      text: 'And to think Playtime had someone of such rare quality, and never noticed. Funny.',
      state: 'amused',
    },
    {
      id: 'why-come-back',
      url: `${AUDIO}/TheDoctor-SecondOption.mp3`,
      text: "I can't say I remember seeing your face before. But I'm curious. Why come back? It can't be that a vague letter was your only reason.",
      state: 'watching',
    },
    {
      id: 'loved-here',
      url: `${AUDIO}/TheDoctor-NoMansLand_(5).mp3`,
      text: "Was there someone you loved here? Someone you'd lost? Was it the pain of not knowing for sure that brought you here?",
      state: 'patrol',
    },

    // ── Observação Clínica ──────────────────────────────────────────────
    {
      id: 'subject-scrambles',
      url: `${AUDIO}/SW_DIA_Doctor_S03_L03_Line02.wav`,
      text: 'The subject scrambles for an advantage. They appear lost and disoriented. Heavy breathing is indicative of fear, and rightly so.',
      state: 'patrol',
    },
    {
      id: 'test-response',
      url: `${AUDIO}/SW_DIA_Doctor_S03_L03_Line03.wav`,
      text: "Let's test the response to said fear when pushed into action.",
      state: 'patrol',
    },
    {
      id: 'seen-enough',
      url: `${AUDIO}/SW_DIA_Doctor_S03_L03_Line04.wav`,
      text: 'I have seen enough. Thank you. You may proceed.',
      state: 'idle',
    },
    {
      id: 'keep-enjoyable',
      url: `${AUDIO}/SW_DIA_Doctor_S04_L04_Line03.wav`,
      text: "Please, do keep making this enjoyable for me. I'll be taking notes.",
      state: 'amused',
    },
    {
      id: 'never-thought',
      url: `${AUDIO}/SW_DIA_Doctor_S04_L04_Line01.wav`,
      text: "You know, I never thought I'd see another like you. A human. Something makes you different... I can tell that much. Though I can't say what exactly that something is. Not yet.",
      state: 'watching',
      weight: 2,
    },

    // ── Ameaça / Frio ────────────────────────────────────────────────────
    {
      id: 'dont-fight',
      url: `${AUDIO}/SW_DIA_Doctor_S03_L03_Line05.wav`,
      text: "Don't fight. Fighting only makes it work quicker.",
      state: 'crimson',
    },
    {
      id: 'experiments-killed',
      url: `${AUDIO}/TheDoctor-ColdStorage_(1).mp3`,
      text: 'The experiments killed everyone, including whoever you came back for. You know that by now, yes?',
      state: 'crimson',
    },
    {
      id: 'futility',
      url: `${AUDIO}/TheDoctor-SecondaryLab_(1).mp3`,
      text: "You realize the futility of this, don't you?",
      state: 'squinting',
    },
    {
      id: 'meat-rots',
      url: `${AUDIO}/TheDoctor-SecondaryLab_(2).mp3`,
      text: "Meat rots and loses its function, it's as replaceable as anything else. You're accomplishing nothing.",
      state: 'crimson',
    },
    {
      id: 'not-even-ground',
      url: `${AUDIO}/SW_DIA_Doctor_S13_L13_Line02_Not_Even_The_Ground.wav`,
      text: 'Not even the ground beneath your feet.',
      state: 'patrol',
    },
    {
      id: 'strange-expected-more',
      url: `${AUDIO}/TheDoctorJumpscareVoiceline.mp3`,
      text: "Strange... I'd expected more.",
      state: 'idle',
    },
    {
      id: 'blind-rat',
      url: `${AUDIO}/SW_DIA_Doctor_S12_L12_Line05.wav`,
      text: "Just like them. A blind, scurrying little rat. You think poor Yarnaby was my only pet? You know far less than you believe.",
      state: 'squinting',
    },
    {
      id: 'something-i-can-use',
      url: `${AUDIO}/SW_DIA_Doctor_S12_L12_Line06.wav`,
      text: "Please see that he doesn't eat ALL of you. I'd like there to be SOMETHING I can still use.",
      state: 'amused',
    },

    // ── Manipulação / Psicológico ────────────────────────────────────────
    {
      id: 'poppys-story',
      url: `${AUDIO}/TheDoctor-ColdStorage_(2).mp3`,
      text: "Poppy's sold you her story, of course. Innocence is bliss. And she is OH so innocent.",
      state: 'amused',
    },
    {
      id: 'hour-of-joy',
      url: `${AUDIO}/TheDoctor-ColdStorage_(3).mp3`,
      text: "Did she tell you her part in the Hour of Joy? That she knew it was coming? Or did she leave out that crucial detail? Yes, that wouldn't surprise me.",
      state: 'patrol',
    },
    {
      id: 'strung-you-along',
      url: `${AUDIO}/TheDoctor-ColdStorage_(4).mp3`,
      text: "Has she not strung you along, betrayed you, and told you only what you needed to know to do exactly as she asked?",
      state: 'crimson',
    },
    {
      id: 'submit-to-whims',
      url: `${AUDIO}/TheDoctor-SecondaryLab_(3).mp3`,
      text: 'Why do you submit to their whims? Playtime hurt us. My experiments hurt us.',
      state: 'crimson',
    },
    {
      id: 'poppy-sacrifice',
      url: `${AUDIO}/TheDoctor-SecondaryLab_(4).mp3`,
      text: "Do you think Poppy cares about you? She'd sacrifice you in an INSTANT if she believed it meant getting what she wants.",
      state: 'aggressive',
    },
    {
      id: 'moral-high-road',
      url: `${AUDIO}/SW_DIA_Doctor_S12_L12_Line07.wav`,
      text: "Do you believe you're taking the moral high road? Dear friend, let me illuminate for you an obvious truth: survival necessitates choices. Difficult choices... this one is yours.",
      state: 'watching',
    },

    // ── Raiva / Explosão ─────────────────────────────────────────────────
    {
      id: 'only-difference',
      url: `${AUDIO}/TheDoctor-SecondaryLab_(5).mp3`,
      text: "The only difference between her and I... The ONLY difference, is that what I fight for actually gains humanity SOMETHING. Otherwise, what was ANY of this worth? Would you simply make all that sacrifice meaningless?",
      state: 'aggressive',
      weight: 2,
    },
    {
      id: 'who-is-that',
      url: `${AUDIO}/WhoIsThat.mp3`,
      text: 'WHO IS THAT? TURN OFF THAT CAMERA NOW!',
      state: 'aggressive',
    },
    {
      id: 'elliots-machines',
      url: `${AUDIO}/SW_DIA_Doctor_S13_L13_Line02.wav`,
      text: "Elliot's machines are nothing to me. The childish fantasy of a naive, broken man. They won't serve you here. NOTHING can.",
      state: 'aggressive',
    },

    // ── Filosófico / Ethereal ────────────────────────────────────────────
    {
      id: 'mortality-curse',
      url: `${AUDIO}/SawyerPH2ILT_(1).mp3`,
      text: 'Mortality is the curse of the weak.',
      state: 'ethereal',
    },
    {
      id: 'escape-incineration',
      url: `${AUDIO}/SawyerPH2ILT_(4).mp3`,
      text: 'Call me a monster, but I am simply a man who will escape incineration, and embrace the infinite!',
      state: 'ethereal',
    },
    {
      id: 'for-whom-the-bell',
      url: `${AUDIO}/SW_DIA_Doctor_S13_L13_Line01.wav`,
      text: "Do you hear it... like I do? Off somewhere. Somewhere... far. Beyond this place. A bell. For whom does it toll, you think?",
      state: 'ethereal',
      weight: 2,
    },
    {
      id: 'once-they-had-choice',
      url: `${AUDIO}/TheDoctor-ColdStorage_(5).mp3`,
      text: "Once they had a choice, once they were 'free', THIS was their creation. They've made hell real and trapped us BOTH there.",
      state: 'ethereal',
    },
    {
      id: 'secret-inside-you',
      url: `${AUDIO}/HarleyPPTDS5.mp3`,
      text: "There is a secret inside you. Valuable beyond all measure. I cut and prod and burn at it, and I get closer with each session... So speak, or don't. Fight, or give in. Regardless, I learn something new about you every day.",
      state: 'ethereal',
      weight: 2,
    },

    // ── Introspecção / Amargo ────────────────────────────────────────────
    {
      id: 'bury-myself',
      url: `${AUDIO}/SW_DIA_Doctor_S13_L13_Line03.wav`,
      text: "I'll bury myself so far down that no one will ever find me. Not you. Not The Prototype. Not anyone.",
      state: 'narrowed',
    },
    {
      id: 'was-going-to-be-mine',
      url: `${AUDIO}/SW_DIA_Doctor_S13_L13_Line04.wav`,
      text: 'It was going to be mine. It was all going to be mine. My discovery. My recognition. I was the one who paved the golden path.',
      state: 'crimson',
    },

    // ── Apresentação / Introdução ─────────────────────────────────────────
    {
      id: 'my-name',
      url: `${AUDIO}/NameHarleySawyer.mp3`,
      text: 'My name is Harley Sawyer. I\'m called "The Doctor". When I look at this company we\'ve built, I do not feel proud.',
      state: 'returns',
    },
    {
      id: 'declining-profits',
      url: `${AUDIO}/DecliningProfits.mp3`,
      text: "Declining profits, failed experiments, people are constantly seeing things they shouldn't. How is that anything less than complete failure on our part? It's pathetic.",
      state: 'crimson',
    },

    // ── Derrota Final ────────────────────────────────────────────────────
    {
      id: 'saved-no-one',
      url: `${AUDIO}/SW_DIA_Doctor_S13_L13_Line07.wav`,
      text: 'You... saved... no one...',
      state: 'shutdown',
      weight: 0.3,
    },

  ];

  // ── Estado interno ──────────────────────────────────────────────────

  let _isPlaying = false;
  let _audio = null;
  let _recentIds = [];
  let _initialized = false;

  // ── Seleção aleatória com peso e anti-repetição ─────────────────────

  function _pickLine() {
    const available = VOICE_LINES.filter(l => !_recentIds.includes(l.id));

    if (available.length === 0) {
      _recentIds = [];
      return _pickLine();
    }

    // Seleção ponderada pelo campo weight (default 1)
    const totalWeight = available.reduce((s, l) => s + (l.weight || 1), 0);
    let rand = Math.random() * totalWeight;

    for (const line of available) {
      rand -= (line.weight || 1);
      if (rand <= 0) return line;
    }

    return available[available.length - 1];
  }

  // ── Reprodução ──────────────────────────────────────────────────────

  function play(line) {
    if (_isPlaying) return;

    _isPlaying = true;
    _recentIds.push(line.id);
    if (_recentIds.length > Math.floor(VOICE_LINES.length * 0.4)) {
      _recentIds.shift();
    }

    // Para qualquer texto atual e muda o estado do olho
    Dialogue.stopCurrent();
    StateMachine.transitionTo(line.state, false);

    // Exibe o texto do diálogo enquanto o áudio toca
    Dialogue.typeText(line.text, line.state);

    // Reproduz o áudio
    const audio = new window.Audio(line.url);
    _audio = audio;

    audio.addEventListener('ended', () => {
      _isPlaying = false;
      _audio = null;
      // Fade do texto 1.5s após o áudio terminar
      setTimeout(() => Dialogue.fadeOut(), 1500);
      // Retorna ao idle 2.5s após o áudio terminar
      setTimeout(() => {
        if (['aggressive', 'crimson', 'squinting', 'patrol',
             'watching', 'amused', 'ethereal', 'narrowed',
             'returns', 'shutdown'].includes(StateMachine.getState())) {
          StateMachine.transitionTo('idle');
        }
      }, 2500);
    });

    audio.addEventListener('error', () => {
      _isPlaying = false;
      _audio = null;
      setTimeout(() => Dialogue.fadeOut(), 800);
    });

    audio.play().catch(() => {
      _isPlaying = false;
      _audio = null;
    });
  }

  function playRandom() {
    if (_isPlaying) return;
    const line = _pickLine();
    if (line) play(line);
  }

  function isPlaying() {
    return _isPlaying;
  }

  // ── Agendamento periódico ───────────────────────────────────────────

  function scheduleRandom() {
    // Intervalo entre falas: 40–90 segundos
    const delay = 40000 + Math.random() * 50000;

    setTimeout(() => {
      const state = StateMachine.getState();
      // Não interrompe estados já intensos ou audio em progresso
      const blockedStates = ['aggressive', 'many', 'bared', 'shutdown', 'closed', 'returns'];
      if (!_isPlaying && !blockedStates.includes(state)) {
        playRandom();
      }
      scheduleRandom();
    }, delay);
  }

  function init() {
    if (_initialized) return;
    _initialized = true;
    // Primeira fala após 8–15s (personagem já presente antes de falar)
    const firstDelay = 8000 + Math.random() * 7000;
    setTimeout(() => {
      if (!_isPlaying) playRandom();
      scheduleRandom();
    }, firstDelay);
  }

  return { init, play, playRandom, isPlaying };

})();

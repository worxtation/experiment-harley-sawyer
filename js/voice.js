/* =============================================
   VOICE.JS — Reprodução de falas originais do personagem
   Áudios do jogo Poppy Playtime Chapter 4
   Fonte: poppy-playtime.fandom.com/wiki/Harley_Sawyer/Audio
   ============================================= */

'use strict';

const Voice = (() => {
  const CDN = 'https://static.wikia.nocookie.net/pplaytime/images';

  /*
   * VOICE_LINES — banco de falas originais do personagem
   *
   * Campos:
   *   id      — identificador único (para controle de repetição)
   *   url     — URL do arquivo de áudio no CDN do fandom wiki
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
      url: `${CDN}/8/8f/TheDoctor-NoMansLand_%281%29.mp3/revision/latest?cb=20260216125824`,
      text: 'Ah, and here you are. Just as I expected.',
      state: 'watching',
    },
    {
      id: 'every-bit',
      url: `${CDN}/d/d0/TheDoctor-NoMansLand_%282%29.mp3/revision/latest?cb=20260216125836`,
      text: 'It appears you are every bit what the Prototype fears.',
      state: 'watching',
    },
    {
      id: 'rare-quality',
      url: `${CDN}/d/da/TheDoctor-NoMansLand_%283%29.mp3/revision/latest?cb=20260216125850`,
      text: 'And to think Playtime had someone of such rare quality, and never noticed. Funny.',
      state: 'amused',
    },
    {
      id: 'why-come-back',
      url: `${CDN}/1/12/TheDoctor-SecondOption.mp3/revision/latest?cb=20260215173831`,
      text: "I can't say I remember seeing your face before. But I'm curious. Why come back? It can't be that a vague letter was your only reason.",
      state: 'watching',
    },
    {
      id: 'loved-here',
      url: `${CDN}/f/f0/TheDoctor-NoMansLand_%285%29.mp3/revision/latest?cb=20260216125903`,
      text: "Was there someone you loved here? Someone you'd lost? Was it the pain of not knowing for sure that brought you here?",
      state: 'patrol',
    },

    // ── Observação Clínica ──────────────────────────────────────────────
    {
      id: 'subject-scrambles',
      url: `${CDN}/9/95/SW_DIA_Doctor_S03_L03_Line02.wav/revision/latest?cb=20250201000600`,
      text: 'The subject scrambles for an advantage. They appear lost and disoriented. Heavy breathing is indicative of fear, and rightly so.',
      state: 'patrol',
    },
    {
      id: 'test-response',
      url: `${CDN}/b/bd/SW_DIA_Doctor_S03_L03_Line03.wav/revision/latest?cb=20250201000625`,
      text: "Let's test the response to said fear when pushed into action.",
      state: 'patrol',
    },
    {
      id: 'seen-enough',
      url: `${CDN}/7/7d/SW_DIA_Doctor_S03_L03_Line04.wav/revision/latest?cb=20250201000643`,
      text: 'I have seen enough. Thank you. You may proceed.',
      state: 'idle',
    },
    {
      id: 'keep-enjoyable',
      url: `${CDN}/6/68/SW_DIA_Doctor_S04_L04_Line03.wav/revision/latest?cb=20250201003147`,
      text: "Please, do keep making this enjoyable for me. I'll be taking notes.",
      state: 'amused',
    },
    {
      id: 'never-thought',
      url: `${CDN}/d/dc/SW_DIA_Doctor_S04_L04_Line01.wav/revision/latest?cb=20250201001218`,
      text: "You know, I never thought I'd see another like you. A human. Something makes you different... I can tell that much. Though I can't say what exactly that something is. Not yet.",
      state: 'watching',
      weight: 2,
    },

    // ── Ameaça / Frio ────────────────────────────────────────────────────
    {
      id: 'dont-fight',
      url: `${CDN}/c/c4/SW_DIA_Doctor_S03_L03_Line05.wav/revision/latest?cb=20250201000802`,
      text: "Don't fight. Fighting only makes it work quicker.",
      state: 'crimson',
    },
    {
      id: 'experiments-killed',
      url: `${CDN}/4/43/TheDoctor-ColdStorage_%281%29.mp3/revision/latest?cb=20260216133345`,
      text: 'The experiments killed everyone, including whoever you came back for. You know that by now, yes?',
      state: 'crimson',
    },
    {
      id: 'futility',
      url: `${CDN}/5/50/TheDoctor-SecondaryLab_%281%29.mp3/revision/latest?cb=20260217200252`,
      text: "You realize the futility of this, don't you?",
      state: 'squinting',
    },
    {
      id: 'meat-rots',
      url: `${CDN}/d/d9/TheDoctor-SecondaryLab_%282%29.mp3/revision/latest?cb=20260217200304`,
      text: "Meat rots and loses its function, it's as replaceable as anything else. You're accomplishing nothing.",
      state: 'crimson',
    },
    {
      id: 'not-even-ground',
      url: `${CDN}/8/82/SW_DIA_Doctor_S13_L13_Line02_Not_Even_The_Ground.wav/revision/latest?cb=20250201025319`,
      text: 'Not even the ground beneath your feet.',
      state: 'patrol',
    },
    {
      id: 'strange-expected-more',
      url: `${CDN}/c/ca/TheDoctorJumpscareVoiceline.mp3/revision/latest?cb=20250503031816`,
      text: "Strange... I'd expected more.",
      state: 'idle',
    },
    {
      id: 'blind-rat',
      url: `${CDN}/5/52/SW_DIA_Doctor_S12_L12_Line05.wav/revision/latest?cb=20250201024044`,
      text: "Just like them. A blind, scurrying little rat. You think poor Yarnaby was my only pet? You know far less than you believe.",
      state: 'squinting',
    },
    {
      id: 'something-i-can-use',
      url: `${CDN}/b/be/SW_DIA_Doctor_S12_L12_Line06.wav/revision/latest?cb=20250201024211`,
      text: "Please see that he doesn't eat ALL of you. I'd like there to be SOMETHING I can still use.",
      state: 'amused',
    },

    // ── Manipulação / Psicológico ────────────────────────────────────────
    {
      id: 'poppys-story',
      url: `${CDN}/6/60/TheDoctor-ColdStorage_%282%29.mp3/revision/latest?cb=20260216133402`,
      text: "Poppy's sold you her story, of course. Innocence is bliss. And she is OH so innocent.",
      state: 'amused',
    },
    {
      id: 'hour-of-joy',
      url: `${CDN}/0/09/TheDoctor-ColdStorage_%283%29.mp3/revision/latest?cb=20260216133411`,
      text: "Did she tell you her part in the Hour of Joy? That she knew it was coming? Or did she leave out that crucial detail? Yes, that wouldn't surprise me.",
      state: 'patrol',
    },
    {
      id: 'strung-you-along',
      url: `${CDN}/6/67/TheDoctor-ColdStorage_%284%29.mp3/revision/latest?cb=20260216133426`,
      text: "Has she not strung you along, betrayed you, and told you only what you needed to know to do exactly as she asked?",
      state: 'crimson',
    },
    {
      id: 'submit-to-whims',
      url: `${CDN}/9/93/TheDoctor-SecondaryLab_%283%29.mp3/revision/latest?cb=20260217200320`,
      text: 'Why do you submit to their whims? Playtime hurt us. My experiments hurt us.',
      state: 'crimson',
    },
    {
      id: 'poppy-sacrifice',
      url: `${CDN}/e/e9/TheDoctor-SecondaryLab_%284%29.mp3/revision/latest?cb=20260217200337`,
      text: "Do you think Poppy cares about you? She'd sacrifice you in an INSTANT if she believed it meant getting what she wants.",
      state: 'aggressive',
    },
    {
      id: 'moral-high-road',
      url: `${CDN}/e/e2/SW_DIA_Doctor_S12_L12_Line07.wav/revision/latest?cb=20250201024540`,
      text: "Do you believe you're taking the moral high road? Dear friend, let me illuminate for you an obvious truth: survival necessitates choices. Difficult choices... this one is yours.",
      state: 'watching',
    },

    // ── Raiva / Explosão ─────────────────────────────────────────────────
    {
      id: 'only-difference',
      url: `${CDN}/5/50/TheDoctor-SecondaryLab_%285%29.mp3/revision/latest?cb=20260217200506`,
      text: "The only difference between her and I... The ONLY difference, is that what I fight for actually gains humanity SOMETHING. Otherwise, what was ANY of this worth? Would you simply make all that sacrifice meaningless?",
      state: 'aggressive',
      weight: 2,
    },
    {
      id: 'who-is-that',
      url: `${CDN}/e/e3/WhoIsThat.mp3/revision/latest?cb=20260219232954`,
      text: 'WHO IS THAT? TURN OFF THAT CAMERA NOW!',
      state: 'aggressive',
    },
    {
      id: 'elliots-machines',
      url: `${CDN}/8/80/SW_DIA_Doctor_S13_L13_Line02.wav/revision/latest?cb=20250201025424`,
      text: "Elliot's machines are nothing to me. The childish fantasy of a naive, broken man. They won't serve you here. NOTHING can.",
      state: 'aggressive',
    },

    // ── Filosófico / Ethereal ────────────────────────────────────────────
    {
      id: 'mortality-curse',
      url: `${CDN}/2/2d/SawyerPH2ILT_%281%29.mp3/revision/latest?cb=20250827174648`,
      text: 'Mortality is the curse of the weak.',
      state: 'ethereal',
    },
    {
      id: 'escape-incineration',
      url: `${CDN}/f/fc/SawyerPH2ILT_%284%29.mp3/revision/latest?cb=20250827174719`,
      text: 'Call me a monster, but I am simply a man who will escape incineration, and embrace the infinite!',
      state: 'ethereal',
    },
    {
      id: 'for-whom-the-bell',
      url: `${CDN}/d/db/SW_DIA_Doctor_S13_L13_Line01.wav/revision/latest?cb=20250201025242`,
      text: "Do you hear it... like I do? Off somewhere. Somewhere... far. Beyond this place. A bell. For whom does it toll, you think?",
      state: 'ethereal',
      weight: 2,
    },
    {
      id: 'once-they-had-choice',
      url: `${CDN}/f/f0/TheDoctor-ColdStorage_%285%29.mp3/revision/latest?cb=20260216133437`,
      text: "Once they had a choice, once they were 'free', THIS was their creation. They've made hell real and trapped us BOTH there.",
      state: 'ethereal',
    },
    {
      id: 'secret-inside-you',
      url: `${CDN}/8/84/HarleyPPTDS5.mp3/revision/latest?cb=20240408123748`,
      text: "There is a secret inside you. Valuable beyond all measure. I cut and prod and burn at it, and I get closer with each session... So speak, or don't. Fight, or give in. Regardless, I learn something new about you every day.",
      state: 'ethereal',
      weight: 2,
    },

    // ── Introspecção / Amargo ────────────────────────────────────────────
    {
      id: 'bury-myself',
      url: `${CDN}/a/ac/SW_DIA_Doctor_S13_L13_Line03.wav/revision/latest?cb=20250201025457`,
      text: "I'll bury myself so far down that no one will ever find me. Not you. Not The Prototype. Not anyone.",
      state: 'narrowed',
    },
    {
      id: 'was-going-to-be-mine',
      url: `${CDN}/4/42/SW_DIA_Doctor_S13_L13_Line04.wav/revision/latest?cb=20250201025522`,
      text: 'It was going to be mine. It was all going to be mine. My discovery. My recognition. I was the one who paved the golden path.',
      state: 'crimson',
    },

    // ── Apresentação / Introdução ─────────────────────────────────────────
    {
      id: 'my-name',
      url: `${CDN}/7/72/NameHarleySawyer.mp3/revision/latest?cb=20260219011904`,
      text: 'My name is Harley Sawyer. I\'m called "The Doctor". When I look at this company we\'ve built, I do not feel proud.',
      state: 'returns',
    },
    {
      id: 'declining-profits',
      url: `${CDN}/a/ac/DecliningProfits.mp3/revision/latest?cb=20260219012139`,
      text: "Declining profits, failed experiments, people are constantly seeing things they shouldn't. How is that anything less than complete failure on our part? It's pathetic.",
      state: 'crimson',
    },

    // ── Derrota Final ────────────────────────────────────────────────────
    {
      id: 'saved-no-one',
      url: `${CDN}/3/30/SW_DIA_Doctor_S13_L13_Line07.wav/revision/latest?cb=20250201025749`,
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

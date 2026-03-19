/* =============================================
   AUDIO.JS — Web Audio API: static noise e efeitos por estado
   ============================================= */

'use strict';

const Audio = (() => {
  let ctx = null;
  let masterGain = null;
  let staticSource = null;
  let staticGain = null;
  let initialized = false;
  let talkingOsc = null;
  let talkingLFO = null;

  // Inicializa o AudioContext — chamado após primeiro clique do usuário
  function init() {
    if (initialized) return;

    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);

    startStaticNoise();
    initialized = true;
  }

  function isReady() {
    return initialized && ctx && ctx.state === 'running';
  }

  // =============================================
  // Static noise de fundo — sempre rodando
  // =============================================

  function startStaticNoise() {
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }

    staticSource = ctx.createBufferSource();
    staticSource.buffer = buffer;
    staticSource.loop = true;

    // Filtro passa-baixa para suavizar o ruído — sound analógico
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;

    staticGain = ctx.createGain();
    staticGain.gain.setValueAtTime(0.15, ctx.currentTime);

    staticSource.connect(filter);
    filter.connect(staticGain);
    staticGain.connect(masterGain);
    staticSource.start();
  }

  // =============================================
  // Click elétrico — transição de estado
  // =============================================

  function playClick() {
    if (!isReady()) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const shaper = ctx.createWaveShaper();

    // Curva de distorção leve
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (3 + 20) * x * 20 * (Math.PI / 180) / (Math.PI + 20 * Math.abs(x));
    }
    shaper.curve = curve;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(shaper);
    shaper.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  // =============================================
  // Distorção pesada — AGGRESSIVE
  // =============================================

  function playAggressive() {
    if (!isReady()) return;

    const bufSize = ctx.sampleRate * 0.5;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = x < 0 ? -1 : 1; // hard clip
    }
    shaper.curve = curve;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 2;

    src.connect(shaper);
    shaper.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start();
  }

  // =============================================
  // Chirp caótico — GLITCH / MANY
  // =============================================

  function playGlitch() {
    if (!isReady()) return;

    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + i * 0.05;
      const freq = 200 + Math.random() * 2000;

      osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(
        freq * (Math.random() > 0.5 ? 4 : 0.25),
        startTime + 0.1
      );

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    }
  }

  // =============================================
  // Tom descendente — SHUTDOWN
  // =============================================

  function playShutdown() {
    if (!isReady()) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.6);
  }

  // =============================================
  // Warble eletrônico — TALKING (enquanto texto aparece)
  // =============================================

  function startTalking() {
    if (!isReady() || talkingOsc) return;

    talkingOsc = ctx.createOscillator();
    const gain = ctx.createGain();
    talkingLFO = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    talkingOsc.type = 'sine';
    talkingOsc.frequency.value = 280;

    talkingLFO.type = 'triangle';
    talkingLFO.frequency.value = 8;
    lfoGain.gain.value = 0.05;

    talkingLFO.connect(lfoGain);
    lfoGain.connect(gain.gain);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);

    talkingOsc.connect(gain);
    gain.connect(masterGain);

    talkingOsc.start();
    talkingLFO.start();
  }

  function stopTalking() {
    if (talkingOsc) {
      try { talkingOsc.stop(); } catch(e) {}
      talkingOsc = null;
    }
    if (talkingLFO) {
      try { talkingLFO.stop(); } catch(e) {}
      talkingLFO = null;
    }
  }

  // =============================================
  // Sub-grave — BARED
  // =============================================

  function playBared() {
    if (!isReady()) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 50;

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.9);
  }

  // =============================================
  // Volume global
  // =============================================

  function setVolume(v) {
    if (!masterGain) return;
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, v)), ctx.currentTime);
  }

  function onStateChange(newState) {
    if (!isReady()) return;

    switch (newState) {
      case 'idle':
      case 'narrowed':
      case 'closed':
        playClick();
        break;
      case 'watching':
        playClick();
        break;
      case 'squinting':
        playClick();
        break;
      case 'crimson':
        playClick();
        break;
      case 'aggressive':
        playAggressive();
        break;
      case 'many':
        playGlitch();
        break;
      case 'bared':
        playBared();
        break;
      case 'shutdown':
        playShutdown();
        break;
      case 'patrol':
        playClick();
        break;
    }
  }

  return {
    init,
    onStateChange,
    playClick,
    playAggressive,
    playGlitch,
    playShutdown,
    playBared,
    startTalking,
    stopTalking,
    setVolume,
  };
})();

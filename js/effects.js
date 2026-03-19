/* =============================================
   EFFECTS.JS — Canvas noise, glitch slices, chromatic aberration
   ============================================= */

'use strict';

const Effects = (() => {
  // Noise canvas
  let noiseCanvas, noiseCtx;
  let glitchCanvas, glitchCtx;
  let noiseFrameCount = 0;
  let glitchActive = false;
  let glitchTimer = null;
  let animFrame;
  let currentNoiseIntensity = 0.30;

  function initNoise(canvasEl) {
    if (!canvasEl) return;
    noiseCanvas = canvasEl;
    noiseCtx = canvasEl.getContext('2d');
    resizeNoise();
    window.addEventListener('resize', resizeNoise);
  }

  function resizeNoise() {
    if (!noiseCanvas) return;
    // Resolução reduzida (1/3) — CSS escala, noise não precisa de full-res
    noiseCanvas.width  = Math.floor(noiseCanvas.offsetWidth  / 3);
    noiseCanvas.height = Math.floor(noiseCanvas.offsetHeight / 3);
  }

  function initGlitch(canvasEl) {
    if (!canvasEl) return;
    glitchCanvas = canvasEl;
    glitchCtx = canvasEl.getContext('2d');
    resizeGlitch();
    window.addEventListener('resize', resizeGlitch);
  }

  function resizeGlitch() {
    if (!glitchCanvas) return;
    glitchCanvas.width = glitchCanvas.offsetWidth;
    glitchCanvas.height = glitchCanvas.offsetHeight;
  }

  function setNoiseIntensity(v) {
    currentNoiseIntensity = Math.max(0.1, Math.min(0.8, v));
  }

  // Gera um frame de grain com paleta purple-blue do fósforo CRT
  // Usa Uint32Array — 4x mais rápido que escrever RGBA individualmente
  // Paleta segue prompt-aprimoraments.md: R baixo, G mínimo, B dominante
  function renderNoise(intensity = 0.35) {
    if (!noiseCtx) return;
    const w = noiseCanvas.width;
    const h = noiseCanvas.height;
    if (w === 0 || h === 0) { resizeNoise(); return; }
    const imageData = noiseCtx.createImageData(w, h);
    const buf = new Uint32Array(imageData.data.buffer);
    const len = buf.length;

    for (let i = 0; i < len; i++) {
      const v = (Math.random() * 255 * intensity) | 0;
      const a = (Math.random() * 160)             | 0;
      // Purple-blue: R leve, G mínimo, B dominante
      // Aproxima paleta: (5-15, 0-10, 20-40) do fósforo real
      const r = (v * 0.28) | 0;
      const g = (v * 0.12) | 0;
      // little-endian: uint32 → bytes [R, G, B, A]
      buf[i] = (a << 24) | (v << 16) | (g << 8) | r;
    }

    noiseCtx.putImageData(imageData, 0, 0);
  }

  // Renderiza slices de glitch horizontal no canvas de glitch
  function renderGlitchSlices(intensity = 1.0) {
    if (!glitchCtx || !glitchCanvas) return;
    const w = glitchCanvas.width;
    const h = glitchCanvas.height;

    glitchCtx.clearRect(0, 0, w, h);

    const numSlices = Math.floor(3 + Math.random() * 6 * intensity);

    for (let i = 0; i < numSlices; i++) {
      const y = Math.random() * h;
      const sliceH = 2 + Math.random() * (8 * intensity);
      const offsetX = (Math.random() - 0.5) * 40 * intensity;

      // Cor do slice — cyan ou magenta
      const isCyan = Math.random() > 0.5;
      glitchCtx.fillStyle = isCyan
        ? `rgba(0,255,255,${0.3 + Math.random() * 0.5 * intensity})`
        : `rgba(255,0,255,${0.2 + Math.random() * 0.4 * intensity})`;

      glitchCtx.fillRect(offsetX, y, w, sliceH);

      // Linha de ruído na borda do slice
      glitchCtx.fillStyle = `rgba(255,255,255,${0.1 * intensity})`;
      glitchCtx.fillRect(0, y, w, 1);
    }

    // Pixel noise aleatório em estado AGGRESSIVE
    if (intensity > 0.8) {
      const pixelCount = Math.floor(w * h * 0.005 * intensity);
      for (let i = 0; i < pixelCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        glitchCtx.fillStyle = `rgb(${r},${g},${b})`;
        glitchCtx.fillRect(x, y, 2, 2);
      }
    }
  }

  function clearGlitch() {
    if (!glitchCtx || !glitchCanvas) return;
    glitchCtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);
  }

  // Trigger de glitch: dura `duration`ms com `intensity`
  function triggerGlitch(duration = 300, intensity = 1.0) {
    if (glitchTimer) clearTimeout(glitchTimer);
    glitchActive = true;

    if (glitchCanvas) {
      glitchCanvas.style.opacity = '1';
    }

    glitchTimer = setTimeout(() => {
      glitchActive = false;
      clearGlitch();
      if (glitchCanvas) glitchCanvas.style.opacity = '0';
    }, duration);
  }

  // Loop principal de animação
  function startLoop() {
    const loop = () => {
      noiseFrameCount++;

      // Atualiza noise a cada 3 frames (~20fps) para não sobrecarregar
      if (noiseFrameCount % 3 === 0) {
        renderNoise(currentNoiseIntensity);
      }

      // Glitch slices atualizam a cada frame quando ativo
      if (glitchActive) {
        const state = document.body.dataset.state || 'idle';
        const intensity = state === 'aggressive' ? 1.2
          : state === 'many' ? 1.0
          : 0.6;
        renderGlitchSlices(intensity);
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
  }

  function stopLoop() {
    cancelAnimationFrame(animFrame);
  }

  return { initNoise, initGlitch, startLoop, stopLoop, triggerGlitch, renderNoise, setNoiseIntensity };
})();

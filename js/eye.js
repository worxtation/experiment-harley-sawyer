/* =============================================
   EYE.JS — SVG do olho: anatomia, animação, pupil tracking
   ============================================= */

'use strict';

const Eye = (() => {
  // Elementos SVG
  let svg, eyelidTop, eyelidBottom, eyelidTopFill, eyelidBottomFill;
  let sclera, iris, pupil, pupilSecondary, highlightCyan, highlightRed;
  let eyeShape, eyeClip;
  let ringsGroup, marksGroup;
  let manyGroup, aggressiveCorona, baredTeeth, patrolClaws;

  let currentState = 'idle';

  // Mouse tracking
  let mouseTarget = { x: 0.5, y: 0.5 };
  let pupilPos    = { x: 0.5, y: 0.5 };

  // Piscada
  let blinkTimer = null;

  // Dimensões SVG
  const SVG_W = 400;
  const SVG_H = 300;
  const CX    = SVG_W / 2; // 200
  const CY    = SVG_H / 2; // 150

  // Parâmetros do olho por estado
  const STATE_PARAMS = {
    idle:       { topY: 80,   botY: 220, irisR: 60, pupilR: 28, irisColor: '#1A1A3E', glowColor: '#00E5FF', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    watching:   { topY: 28,   botY: 272, irisR: 54, pupilR: 19, irisColor: '#1A1A3E', glowColor: '#00E5FF', rings: true,  marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    amused:     { topY: 178,  botY: 236, irisR: 60, pupilR: 25, irisColor: '#1A1A3E', glowColor: '#00AACC', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    squinting:  { topY: 118,  botY: 196, irisR: 60, pupilR: 22, irisColor: '#1A1A3E', glowColor: '#CC0044', rings: false, marks: true,  dualPupil: false, showCorona: false, showTeeth: false },
    crimson:    { topY: 158,  botY: 242, irisR: 67, pupilR: 19, irisColor: '#8B0000', glowColor: '#8B0000', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    aggressive: { topY: -30,  botY: 330, irisR: 92, pupilR:  8, irisColor: '#CC0000', glowColor: '#CC0000', rings: false, marks: false, dualPupil: false, showCorona: true,  showTeeth: false },
    patrol:     { topY: 68,   botY: 232, irisR: 64, pupilR: 14, irisColor: '#F5C518', glowColor: '#F5C518', rings: false, marks: false, dualPupil: true,  showCorona: false, showTeeth: false },
    narrowed:   { topY: 134,  botY: 174, irisR: 53, pupilR: 17, irisColor: '#1A1A3E', glowColor: '#00E5FF', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    many:       { topY: 68,   botY: 232, irisR: 62, pupilR: 24, irisColor: '#6600BB', glowColor: '#6600BB', rings: true,  marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    closed:     { topY: 148,  botY: 152, irisR: 60, pupilR: 24, irisColor: '#1A1A3E', glowColor: '#00E5FF', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    ethereal:   { topY: 38,   botY: 262, irisR: 60, pupilR: 40, irisColor: '#0A0A22', glowColor: '#00E5FF', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    returns:    { topY: 300,  botY: 220, irisR: 60, pupilR: 30, irisColor: '#0D1A0D', glowColor: '#00C864', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
    bared:      { topY: 92,   botY: 220, irisR: 60, pupilR: 46, irisColor: '#1A0005', glowColor: '#CC0044', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: true  },
    shutdown:   { topY: 300,  botY:   0, irisR: 60, pupilR: 24, irisColor: '#050518', glowColor: '#000000', rings: false, marks: false, dualPupil: false, showCorona: false, showTeeth: false },
  };

  // Constrói path de uma pálpebra
  function eyelidPath(controlY) {
    return `M 30,${CY} Q ${CX},${controlY} ${SVG_W - 30},${CY}`;
  }

  // Gera path do contorno do olho (amêndoa)
  function eyeShapePath(topY, botY) {
    return `M 30,${CY} Q ${CX},${topY} ${SVG_W - 30},${CY} Q ${CX},${botY} 30,${CY} Z`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function init(svgEl) {
    svg = svgEl;

    eyelidTop        = svg.querySelector('#eyelid-top');
    eyelidBottom     = svg.querySelector('#eyelid-bottom');
    eyelidTopFill    = svg.querySelector('#eyelid-top-fill');
    eyelidBottomFill = svg.querySelector('#eyelid-bottom-fill');
    eyeShape         = svg.querySelector('#eye-shape');
    eyeClip          = svg.querySelector('#eye-clip-path');
    sclera           = svg.querySelector('#sclera');
    iris             = svg.querySelector('#iris');
    pupil            = svg.querySelector('#pupil');
    pupilSecondary   = svg.querySelector('#pupil-secondary');
    highlightCyan    = svg.querySelector('#highlight-cyan');
    highlightRed     = svg.querySelector('#highlight-red');
    ringsGroup       = svg.querySelector('#rings');
    marksGroup       = svg.querySelector('#eyelid-marks');
    manyGroup        = svg.querySelector('#many-eyes');
    aggressiveCorona = svg.querySelector('#aggressive-corona');
    baredTeeth       = svg.querySelector('#bared-teeth');
    patrolClaws      = svg.querySelector('#patrol-claws');

    document.addEventListener('mousemove', onMouseMove);

    scheduleBlink();
    requestAnimationFrame(updatePupil);
  }

  function onMouseMove(e) {
    const rect = svg.getBoundingClientRect();
    mouseTarget.x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mouseTarget.y = Math.max(0, Math.min(1, (e.clientY - rect.top)  / rect.height));
  }

  function updatePupil() {
    // Spring feel — lerp mais lento para movimento orgânico
    const speed = currentState === 'patrol' ? 0.12 : 0.07;
    pupilPos.x = lerp(pupilPos.x, mouseTarget.x, speed);
    pupilPos.y = lerp(pupilPos.y, mouseTarget.y, speed);

    if (!pupil) {
      requestAnimationFrame(updatePupil);
      return;
    }

    const params    = STATE_PARAMS[currentState] || STATE_PARAMS.idle;
    const maxOffset = currentState === 'watching' ? 22 : 18;

    const ox = (pupilPos.x - 0.5) * 2 * maxOffset;
    const oy = (pupilPos.y - 0.5) * 2 * maxOffset;
    const px = CX + ox;
    const py = CY + oy;

    pupil.setAttribute('cx', px);
    pupil.setAttribute('cy', py);

    // Highlights seguem a pupila
    if (highlightCyan) {
      highlightCyan.setAttribute('cx', px - 8);
      highlightCyan.setAttribute('cy', py - 10);
    }
    if (highlightRed) {
      highlightRed.setAttribute('cx', px - 4);
      highlightRed.setAttribute('cy', py - 7);
    }

    // Pupila dupla (PATROL) — acompanha junto
    if (pupilSecondary && pupilSecondary.style.display !== 'none') {
      pupilSecondary.setAttribute('cx', px + 16);
      pupilSecondary.setAttribute('cy', py);
    }

    requestAnimationFrame(updatePupil);
  }

  function applyState(stateName) {
    currentState = stateName;
    const p = STATE_PARAMS[stateName] || STATE_PARAMS.idle;

    // Paths de pálpebras
    const topPath  = eyelidPath(p.topY);
    const botPath  = eyelidPath(p.botY);
    const shapePath = eyeShapePath(p.topY, p.botY);

    if (eyelidTop)    eyelidTop.setAttribute('d', topPath);
    if (eyelidBottom) eyelidBottom.setAttribute('d', botPath);

    if (eyelidTopFill) {
      const fillTop = `M 0,0 L ${SVG_W},0 L ${SVG_W},${CY} Q ${CX},${p.topY} 30,${CY} L 0,${CY} Z`;
      eyelidTopFill.setAttribute('d', fillTop);
    }
    if (eyelidBottomFill) {
      const fillBot = `M 0,${SVG_H} L ${SVG_W},${SVG_H} L ${SVG_W},${CY} Q ${CX},${p.botY} 30,${CY} L 0,${CY} Z`;
      eyelidBottomFill.setAttribute('d', fillBot);
    }

    // Atualiza clip do olho
    if (eyeClip) eyeClip.setAttribute('d', shapePath);

    // Iris — cor e tamanho
    if (iris) {
      iris.setAttribute('r', p.irisR);
      // Usa gradiente correto baseado na cor
      if (p.irisColor === '#8B0000' || p.irisColor === '#CC0000') {
        iris.setAttribute('fill', 'url(#iris-grad-crimson)');
      } else if (p.irisColor === '#F5C518') {
        iris.setAttribute('fill', 'url(#iris-grad-patrol)');
      } else {
        iris.setAttribute('fill', 'url(#iris-grad-neutral)');
      }
    }

    // Pupila
    if (pupil) pupil.setAttribute('r', p.pupilR);

    // Pupila dupla (PATROL)
    if (pupilSecondary) {
      if (p.dualPupil) {
        pupilSecondary.style.display = 'block';
        pupilSecondary.style.opacity = '0.9';
        pupilSecondary.setAttribute('r', Math.floor(p.pupilR * 0.58));
      } else {
        pupilSecondary.style.display = 'none';
        pupilSecondary.style.opacity = '0';
      }
    }

    // Rings e marks
    if (ringsGroup) ringsGroup.style.opacity = p.rings  ? '0.7' : '0';
    if (marksGroup) marksGroup.style.opacity = p.marks  ? '1'   : '0';

    // MANY — olhos múltiplos
    if (manyGroup) {
      manyGroup.style.display = stateName === 'many' ? 'block' : 'none';
    }

    // AGGRESSIVE — corona explosiva
    if (aggressiveCorona) {
      if (p.showCorona) {
        aggressiveCorona.style.display = 'block';
        // Pequena animação de aparição
        aggressiveCorona.style.opacity = '0';
        setTimeout(() => {
          if (aggressiveCorona) aggressiveCorona.style.opacity = '1';
        }, 30);
      } else {
        aggressiveCorona.style.display = 'none';
      }
    }

    // BARED — dentes
    if (baredTeeth) {
      if (p.showTeeth) {
        baredTeeth.style.display = 'block';
        baredTeeth.style.opacity = '0';
        setTimeout(() => {
          if (baredTeeth) baredTeeth.style.opacity = '1';
        }, 80);
      } else {
        baredTeeth.style.display = 'none';
        baredTeeth.style.opacity = '0';
      }
    }

    // PATROL — garras
    if (patrolClaws) {
      patrolClaws.style.opacity = stateName === 'patrol' ? '1' : '0';
    }

    // Glow phosphor dinâmico no SVG
    if (svg) {
      const gc = p.glowColor;
      const baseAlpha = '88';
      const wideAlpha = '33';
      svg.style.filter =
        `drop-shadow(0 0 7px ${gc}${baseAlpha}) ` +
        `drop-shadow(0 0 22px ${gc}${wideAlpha})`;
    }
  }

  // Piscada — fecha e abre rapidamente
  function blink() {
    if (!eyelidTop || !eyelidBottom) return;

    const blinkableStates = ['idle', 'watching', 'patrol', 'ethereal'];
    if (!blinkableStates.includes(currentState)) {
      scheduleBlink();
      return;
    }

    const p = STATE_PARAMS[currentState] || STATE_PARAMS.idle;

    // Fecha — pálpebra superior desce até CY
    const closedPath = eyelidPath(CY + 4);
    eyelidTop.setAttribute('d', closedPath);
    if (eyelidTopFill) {
      const fillClosed = `M 0,0 L ${SVG_W},0 L ${SVG_W},${CY} Q ${CX},${CY + 4} 30,${CY} L 0,${CY} Z`;
      eyelidTopFill.setAttribute('d', fillClosed);
    }
    if (eyeClip) {
      eyeClip.setAttribute('d', eyeShapePath(CY + 4, p.botY));
    }

    // Abre após 110–170ms
    setTimeout(() => {
      applyState(currentState);
      scheduleBlink();
    }, 110 + Math.random() * 60);
  }

  function scheduleBlink() {
    clearTimeout(blinkTimer);
    const delay = 3500 + Math.random() * 3500;
    blinkTimer = setTimeout(blink, delay);
  }

  function cancelBlink() {
    clearTimeout(blinkTimer);
  }

  return { init, applyState, blink, scheduleBlink, cancelBlink };
})();

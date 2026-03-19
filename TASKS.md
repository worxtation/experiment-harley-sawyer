# Harley Sawyer Interface — Controle de Implementação

## Status Geral
Última atualização: 2026-03-18

---

## Fase 1 — Tela Viva
- [x] HTML base (`index.html`) — estrutura mínima com monitor CRT
- [x] CSS CRT (`css/crt.css`) — borda/bezel, vignette, curvatura, scanlines, phosphor glow
- [x] CSS Glitch (`css/glitch.css`) — animações de glitch, color shift, horizontal tears
- [x] CSS States (`css/states.css`) — classes de estado (.state-idle, .state-aggressive, etc.)
- [x] Noise Canvas estático (`js/effects.js` — parcial: só grain/noise)
- [x] SVG do olho — anatomia base, IDLE state
- [x] Piscada básica (blink animation)

## Fase 2 — O Olho Segue
- [x] Mouse tracking — pupila segue cursor em tempo real (`js/eye.js`)
- [x] Transição suave da pupila (lerp / spring physics)
- [x] Glow CRT dinâmico ao redor do olho

## Fase 3 — Estados e Reações
- [x] State machine completa (`js/stateMachine.js`)
  - [x] Estado RETURNS (boot/intro)
  - [x] Estado IDLE
  - [x] Estado NARROWED (idle > 30s)
  - [x] Estado WATCHING (mouse parado no centro)
  - [x] Estado PATROL (mouse movendo rápido)
  - [x] Estado AMUSED (repetição / parado > 60s)
  - [x] Estado SQUINTING (click único)
  - [x] Estado CRIMSON (3+ clicks)
  - [x] Estado AGGRESSIVE (5+ clicks rápidos)
  - [x] Estado BARED (easter egg)
  - [x] Estado MANY (glitch prolongado)
  - [x] Estado CLOSED (transição)
  - [x] Estado ETHEREAL (página ganha foco)
  - [x] Estado SHUTDOWN (página perde foco)
- [x] Transições visuais via CSS classes + SVG morph
- [x] Timers de estado (idle, inatividade, sequências)

## Fase 4 — Voz e Som
- [x] Web Audio static noise (loop)
- [x] Efeitos sonoros por evento de estado
  - [x] Transição de estado — click elétrico
  - [x] AGGRESSIVE — distorção pesada
  - [x] GLITCH — chirp caótico
  - [x] SHUTDOWN — tom descendente
  - [x] TALKING — warble eletrônico
  - [x] BARED — sub-grave
- [x] Sistema de diálogo terminal (`js/dialogue.js`)
  - [x] Digitação caractere a caractere com delay variável
  - [x] Fila de mensagens por estado
  - [x] Delays não-determinísticos

## Fase 5 — Atmosfera e Polish
- [x] Glitch horizontal slices em Canvas (effects.js — completo)
- [x] Chromatic aberration via SVG filter
- [x] Delays não-determinísticos em tudo
- [x] Easter egg: sequência que ativa estado BARED
  - Sequência: clicar 3x no olho + esperar 2s + mover mouse em círculo
- [x] Refinamento visual de todos os estados — redesign completo (2026-03-18)
  - [x] Monitor CRT com bezel físico bege envelhecido + botões + label
  - [x] Ambient glow roxo/violeta irradiando para o fundo da página
  - [x] Boot animation: linha se expandindo do centro (CRT real)
  - [x] Barrel distortion simulada + vignette forte nos cantos
  - [x] Reflexo/glare de vidro no topo da tela
  - [x] Olho SVG com sclera texturizada, veias, iris com filamentos
  - [x] Aberração cromática +3px com offset Y
  - [x] Pupila com gradiente de profundidade
  - [x] AGGRESSIVE: corona explosiva circular com 12 spikes irradiando
  - [x] BARED: dentes/círculos vermelhos como pálpebras + glitch lines
  - [x] PATROL: garras zigzag proeminentes + pupila dupla (câmera)
  - [x] Cursor customizado crosshair cyan com mix-blend-mode:difference
  - [x] Terminal com caixa semi-transparente + scanline integrada
  - [x] Phosphor glow multicamada no olho SVG
  - [x] Noise intensity varia por estado
- [ ] Testes de responsividade em diferentes resoluções

---

## Notas
- Assets de referência disponíveis em `assets/expressions/`
- Alguns eye-forms não têm arquivo correspondente (Aggressive, Bared, Many, Patrol, Narrowed) — implementar via SVG/CSS puro
- Áudio inicializa apenas após primeiro clique do usuário (política de autoplay)

---
name: Decisões visuais CRT — Harley Sawyer Interface
description: Paleta, intensidades e escolhas de design do projeto CRT do Dr. Harley Sawyer
type: project
---

Projeto: interface CRT fullscreen com olho digital (Dr. Harley Sawyer). HTML/CSS/JS puro, sem build step.

**Why:** A primeira rodada de refatoração usou valores muito suaves — os efeitos não eram perceptíveis visualmente.

**How to apply:** Sempre usar valores agressivos para efeitos CRT neste projeto. "Sutil" aqui é inimigo do realismo.

## Paleta de fósforo

- Fundo base: `#05030e` / `#030209` — violeta-negro, NUNCA preto puro
- Background como radial-gradient: centro `rgba(18,8,48,1)` → bordas `rgba(3,1,9,1)`
- Eyelids SVG: `#06041a` — violeta contaminado, não azul nem preto
- Phosphor glow: cyan-blue `rgba(0,180,255,0.42)` + violet ambient `rgba(60,20,130,0.38)`
- Noise canvas: paleta blue dominante (B canal), R ~22%, G ~10%, spike violeta 5%

## Intensidades aprovadas (pós-revisão v0.2)

| Efeito | Valor anterior | Valor aprovado |
|---|---|---|
| Scanlines opacity | 0.35 | 0.55 |
| Noise canvas CSS opacity | 0.26 | 0.45 |
| Noise JS intensity | 0.30 | 0.48 |
| Phosphor glow central | rgba(0,160,220,0.18) | rgba(0,180,255,0.42) |
| Vignette borda | rgba(4,2,12,0.92) | rgba(3,1,10,0.98) com 2 gradientes |
| Rim glow (box-shadow) | inset 50px 0.22 | inset 40px 0.55 + 3 camadas |
| Chroma aberration offset | dx=4 | dx=10 |
| Sclera blur wide | stdDeviation="14 4" | stdDeviation="28 6" |
| Drop-shadow eye-svg | nenhum | 3 camadas drop-shadow |

## Efeitos aprovados

- Scanlines com duas camadas (banda escura + micro-brilho do fósforo entre linhas)
- Vignette com dois gradientes radiais sobrepostos (radial elíptico 85% + lateral 55%)
- Phosphor glow com 3 camadas: bloom central, violet ambient, pulse breath
- Animação `phosphor-breathe` (4s) na `.phosphor-glow` — respiro de fósforo
- Drop-shadow CSS no `#eye-svg` assimétrico: horizontal > vertical
- Blur sclera SVG com colorização azul-branco na camada difusa (`feColorMatrix`)
- Noise canvas com spike violeta 5% + alpha 60-240 (mais presente)

## Efeitos rejeitados/descartados

- Nenhum rejeitado ainda — primeira rodada de ajustes

## Referência visual principal

`/assets/expressions/TheDoctor_Trailer.webp` — monitor CRT físico com:
- Fundo deep purple-black
- Phosphor glow muito intenso (parece vir de dentro do vidro)
- Scanlines claramente visíveis
- Vignette forte (cantos quase pretos)
- Bloom horizontal intenso na sclera
- Aberração cromática pronunciada (franja vermelha + ciano)
- Predominância de azul-elétrico/cyan com toques de violeta

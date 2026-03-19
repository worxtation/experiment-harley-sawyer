---
name: Arquitetura de camadas do CRT monitor
description: Hierarquia DOM estabelecida, regras de posicionamento e responsabilidades de cada camada
type: project
---

## Hierarquia DOM canônica

```
main.crt-scanlines          → hardware: scanlines, scan beam, jitter
  └── .crt-screen           → superfície física: filtros de cor/brilho (hue-rotate, saturate, brightness),
                               aberração cromática (#screen-chroma via CSS filter url()),
                               vignette (::before), rim glow (::after),
                               phosphor-glow div, noise/glitch canvas, glitch layers
        ├── #eye-window (div.crt-window)    → janela flutuante 1
        │     ├── .crt-window-titlebar      → chrome da janela (título, badge, dots)
        │     └── .eye-container            → corpo da janela: flex centering do SVG
        │           └── #eye-svg            → conteúdo: renderização do olho
        └── #terminal-window (div.terminal-output.crt-window)  → janela flutuante 2
              ├── .crt-window-titlebar      → chrome da janela
              └── .terminal-inner           → conteúdo: texto do terminal
```

**Why:** Terminal foi movido para dentro do crt-screen para que sofra os filtros de estado junto com toda a tela — comportamento desejável para consistência visual. eye-container foi separado de eye-window para permitir que a janela tenha titlebar como primeiro filho direto (flex-column) e eye-container como corpo flex.

## Regras arquiteturais críticas

- Efeitos de tela (aberração cromática, scanlines, phosphor, vignette) ficam no `crt-screen` e afetam TUDO dentro, incluindo as janelas — isso é correto para um CRT
- NÃO colocar `drop-shadow` CSS no `#eye-svg`. O drop shadow das janelas vem do `.crt-window.window-active` em `windows.css`
- `phosphor-glow` fica dentro do `crt-screen` mas fora do `eye-window` — é efeito do monitor, não da janela
- `#screen-filters` SVG (aberração cromática de tela) fica fora do `main.crt-scanlines`, mas é referenciado via CSS `filter: url(#screen-chroma)` no `.crt-screen`

## Posicionamento das janelas

- `#eye-window`: `position: absolute; inset: 8px` — cobre quase todo o crt-screen com margem para border visível
- `#terminal-window`: `position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); width: 72%`
- Posicionamento das janelas vive em `windows.css` (seletores de ID), não em `crt.css`

## Responsabilidade dos arquivos CSS

- `crt.css`: monitor físico (scanlines, screen, noise canvas, phosphor-glow, eye-svg sizing, terminal-inner styling)
- `windows.css`: chrome das janelas (border, titlebar, badge, dots) + posicionamento dos IDs (#eye-window, #terminal-window)
- `glitch.css`: animações de glitch, color shift por estado, boot/shutdown
- `states.css`: variáveis CSS por estado, animações de expressão do olho
- `terminal-matrix.css`: variáveis do tema terminal.css escopadas por ID; tema Matrix (#000 / #4EEE85) em #terminal-window, tema Cyan em #eye-window; overrides de cor por estado da state machine

## Integração terminal.css

A biblioteca terminal.css (github.com/panr/terminal-css) é classless — sem pacote npm publicado.
Integração via variáveis CSS customizadas (--background, --foreground, --accent, --font-size, --line-height, --radius).
O `terminal-matrix.css` injeta essas variáveis nos IDs das janelas, e `crt.css` consome via `var(--foreground)` etc.
Escopar por ID garante que os estilos da biblioteca não vazem para body/html ou outros elementos.
Overrides de estado (aggressive/patrol/many) redefinem --accent/--foreground/--background por seletor de classe no body.

## eye-container

Antes era o mesmo elemento que eye-window (`div.eye-container.crt-window#eye-window`).
Agora é filho de eye-window, responsável apenas pelo centering interno do SVG.
CSS: `flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden`

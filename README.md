# experiment-harley-sawyer

> *"I see everything."*

Interface interativa do Dr. Harley Sawyer — Experiment 1354.
Fan project baseado no personagem do jogo **Control** (Remedy Entertainment, Chapter 5: Broken Things).

---

## Conceito

A página **não é uma UI**. Ela é uma manifestação digital do Dr. Harley Sawyer.

- A tela = o personagem
- O usuário = alguém sendo observado e testado
- A interface = o que resta de uma consciência transferida para um sistema computacional

O personagem não tem corpo. Ele é inteiramente um olho, vivendo em monitores CRT espalhados pela fábrica — e agora nessa página.

---

## v0.1 — Estado Atual

### O que foi implementado

**Tela CRT fullscreen**
Implementação completa do efeito de monitor CRT seguindo o padrão `main.scanlines > div.screen > canvas` (referência: CodePen de GLITCHXploitR).

- `main.crt-scanlines::before` — scanlines estáticas com padrão `linear-gradient 50/50` em `background-size: 100% 4px`, com drift lento (20s)
- `main.crt-scanlines::after` — scan beam: faixa de luz de 20vh varrendo de cima para baixo em 10s, simulando o feixe de elétrons real do CRT
- `crt-screen::before` — vignette barrel distortion + reflexo de vidro no topo
- Noise canvas rodando em 1/3 da resolução (escalado via `image-rendering: pixelated`) com geração via `Uint32Array` (~4x mais rápido que escrita RGBA individual)

**Olho SVG com 13 estados de expressão**

| Estado | Descrição |
|--------|-----------|
| `IDLE` | Observando. Piscada aleatória a cada 4–7s |
| `WATCHING` | Olho expandido, anéis concêntricos, pupila menor |
| `AMUSED` | Pálpebra pesada, expressão de superioridade |
| `SQUINTING` | Olho apertado com marcas vermelhas nas pálpebras |
| `CRIMSON` | Iris vermelha, raiva calculada e fria |
| `AGGRESSIVE` | Anel vermelho explosivo, sem forma humana reconhecível |
| `BARED` | Dentes como pálpebras, estado mais perturbador |
| `MANY` | Olhos múltiplos satélites em violeta |
| `PATROL` | Iris amarela, garras dentadas, modo câmera de segurança |
| `NARROWED` | Fenda mínima, scanlines pesadas, quase shutdown |
| `CLOSED` | Transição entre estados |
| `ETHEREAL` | Alta definição, pupila dominante |
| `RETURNS` | Olho abrindo de baixo para cima — estado de boot |
| `SHUTDOWN` | Página perde foco |

**Efeitos CRT (sempre ativos)**
- Scanlines + scan beam varrendo a tela
- Grain/noise azulado via Canvas 2D (`Uint32Array`)
- Phosphor glow (drop-shadow cyan no SVG)
- Aberração cromática (SVG filter deslocando canais R e ciano)
- Vignette barrel distortion
- Flicker phosphor (animação de opacidade irregular)
- Glitch horizontal slices em canvas (estados caóticos)
- CRT boot animation (clip-path expandindo do centro)
- CRT shutdown animation (clip-path contraindo ao centro)

**State machine**
- Transições baseadas em comportamento do mouse (idle, velocidade, posição, clicks)
- Timers com delays não-determinísticos
- Easter egg: sequência específica de clicks ativa `BARED`

**Diálogos**
- Terminal verde com efeito de digitação caractere a caractere
- Frases por estado com delays variáveis que refletem a personalidade do personagem
- Texto glitchado com caracteres unicode corrompidos nos estados `MANY` e `BARED`

**Áudio**
- Web Audio API puro (sem arquivos externos)
- Static noise analógico em loop
- Efeitos sonoros por estado: clicks elétricos, distorção, tons descendentes

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Estrutura | HTML5 + SVG inline |
| Efeitos | CSS puro (scanlines, vignette, glitch, flicker) |
| Lógica | JavaScript puro, sem frameworks |
| Gráficos | SVG (olho) + Canvas 2D (noise, glitch) |
| Áudio | Web Audio API |
| Deploy | nginx:alpine via Docker Compose |
| Infra | Dokploy + Traefik + Cloudflare Tunnel |

### Estrutura de arquivos

```
/
├── index.html
├── css/
│   ├── crt.css        # Tela CRT: scanlines, scan beam, vignette, phosphor
│   ├── glitch.css     # Glitch, color shift, boot/shutdown, estado AGGRESSIVE
│   └── states.css     # CSS vars e classes por estado (.state-idle, etc.)
├── js/
│   ├── main.js        # Entry point — init, cursor, boot sequence
│   ├── stateMachine.js # Máquina de estados, timers, triggers
│   ├── eye.js         # SVG do olho — anatomia, animação, pupil tracking
│   ├── dialogue.js    # Sistema de texto terminal, fila de mensagens
│   ├── effects.js     # Canvas noise (Uint32Array), glitch slices
│   └── audio.js       # Web Audio API — noise loop e efeitos por estado
├── assets/
│   └── expressions/   # Imagens de referência (não usadas na página)
├── docker-compose.yml
├── harley-sawyer.md   # Personality file — voz, comportamento, frases canônicas
└── project.md         # Especificação visual completa — estados, paleta, efeitos
```

---

## Rodar localmente

```bash
docker-compose up -d
# → http://localhost:80
```

Ou abrir `index.html` diretamente no browser (sem servidor necessário).

---

## Referências

- **Personagem**: Dr. Harley Sawyer — Control (Remedy Entertainment, 2019), Chapter 5: Broken Things
- **CRT pattern**: CodePen por GLITCHXploitR (`main.scanlines > div.screen` approach)
- Fan project — sem fins comerciais

---

*Experiment ID: 1354*

# Harley Sawyer Interface — Especificação de Projeto

> Documento de referência para implementação. Baseado em análise direta das imagens de referência do jogo e pesquisa no wiki oficial.

---

## 1. Conceito Central

A página **não é uma UI**. Ela é uma manifestação digital do Dr. Harley Sawyer.

- A tela = o personagem
- O usuário = alguém sendo observado e testado
- A interface = o que resta de uma consciência transferida para um sistema computacional

**O personagem não tem corpo. Ele é inteiramente um olho.**
Esse olho vive em monitores CRT espalhados pela fábrica — e agora vive nessa página.

---

## 2. Identidade do Personagem

- **Nome**: Dr. Harley Sawyer — "The Doctor"
- **Experiment ID**: 1354
- **Sotaque**: Inglês britânico, voz calma e gentil na superfície
- **Destino**: Consciência transferida digitalmente; sobrevive como backup em servidores isolados

### Personalidade (guia de comportamento da interface)

| Camada | Descrição |
|--------|-----------|
| Superfície | Calmo, educado, estóico, intelectual |
| Interior | Violento, furioso, narcisista, sem empatia |
| Modo | Manipulador — quer ser "o mundo inteiro" para quem está vendo |
| Quirk | Infantil disfarçado de gênio; reage mal a provocações |

**Frase canônica (Chapter 5 — Broken Things):**
> *"Well now, this is a rather interesting turn of events."*

---

## 3. Referência Visual — O Monitor CRT

### 3.1 Forma física (baseado em `TheDoctor_Trailer.webp`, `CH5-DrSawyerBackup.jpeg`, `D-Sawyer-backup.png`, `Back_up.webp`)

O personagem habita um **monitor CRT dos anos 1980–1990**:

- Carcaça plástica **bege/off-white envelhecida** (yellowed plastic)
- Forma **quadrada e robusta** — bordas arredondadas, sem elegância
- Tela levemente **côncava** com bezel espesso
- **Botões físicos** na parte inferior do bezel (2–4 botões pequenos)
- Base/pedestal plástico curto
- No jogo: o monitor fica em **nichos industriais** de aço escuro
- Na cena do trailer: o monitor emite **glow roxo/violeta** no ambiente ao redor

### 3.2 O que a página deve simular

A página inteira simula a **superfície da tela desse monitor**, não o monitor inteiro.
O usuário olha diretamente para o phosphor do CRT. O olho ocupa quase todo o espaço.

Opcionalmente: adicionar borda/bezel do monitor como elemento decorativo externo.

---

## 4. Sistema de Eye Forms — Especificação Visual Completa

> Cada estado é documentado com observações diretas das imagens de referência.

### 4.1 Anatomia base do olho (presente em todos os estados)

```
[ fundo: navy escuro com grain azulado ]
  [ eyelid superior — controla abertura, muda por estado ]
    [ sclera: branco-azulado, textura de grain ]
      [ iris: anel ao redor da pupila, cor varia ]
        [ pupila: círculo preto, tamanho varia ]
          [ highlight: 1-2 pontos brilhantes com aberração cromática ]
  [ eyelid inferior — menos móvel ]
[ glow CRT: borda cyan/teal ao redor do olho em estados ativos ]
```

**Aberração cromática** — presente em TODOS os estados nos elementos brilhantes:
- Highlight da pupila: ponto cyan deslocado + ponto vermelho levemente separado
- Borda da sclera: cyan de um lado, vermelho/amarelo do outro
- Isso é obrigatório — é a assinatura visual do phosphor CRT

---

### 4.2 Estados — Especificação por Imagem

#### `IDLE` — Normal
**Referência**: `DoctorScreen-Normal.webp`

- Olho almond-shaped padrão, abertura moderada (~60% aberto)
- Sclera branca-azulada com textura grain
- Iris: anel escuro com estrutura circular visível
- Pupila pequena-média, preta
- Highlight: ponto cyan + ponto vermelho separados (aberração cromática clara)
- Scanlines horizontais atravessam o olho em baixa opacidade
- Background: navy profundo com grain azulado
- Comportamento: pisca a cada 4–7s (delay aleatório)

---

#### `WATCHING` — Olho Aberto / Intenso
**Referência**: `DoctorScreen-Opened.webp`

- Olho expandido para forma quase circular — dramaticamente aberto
- Múltiplos anéis concêntricos/espirais irradiando para fora do olho
- Iris mais visível (padrão de anel com textura granular)
- Pupila relativamente menor que o estado IDLE (olho grande = pupila menor)
- Highlight idêntico ao IDLE mas mais intenso
- Linhas horizontais coloridas cruzam (vermelho, ciano, amarelo) em baixa opacidade
- Estado ativado quando: mouse se aproxima do centro ou usuário para por >3s

---

#### `AMUSED` — Meia Pálpebra / Arrogante
**Referência**: `DoctorScreen-Amused.webp`

- Pálpebra superior cobre ~65–70% do olho de cima para baixo
- Apenas a porção inferior do olho fica visível (forma de "D" invertido)
- Iris/pupila quase invisíveis — perdidos na sombra da pálpebra
- Tom geral mais escuro que os outros estados — muted
- Aberração cromática menos pronunciada
- Expressa: sarcasmo, superioridade, diversão contida
- Ativado: quando usuário fica parado por muito tempo ou repete a mesma ação

---

#### `SQUINTING` — Pálpebras Agressivas com Marcas Vermelhas
**Referência**: `DoctorScreen-Squinted.webp`

- Olho visível mas com pálpebras pressionadas — abertura ~30–40%
- **Pálpebras têm marcas/traços vermelhos/magenta** — como garras ou pinceladas agressivas
- Múltiplas linhas vermelhas irradiam das bordas das pálpebras
- O olho em si é branco-azulado com pupila pequena
- Paleta: azul navy + vermelho/magenta intenso
- Expressa: raiva concentrada, foco hostil
- Ativado: primeiro nível de raiva (hover agressivo, movimento rápido de mouse)

---

#### `CRIMSON` — Iris Vermelha / Semi-fechado
**Referência**: `DoctorScreen-CrimsonIris.webp`

- Mesmo shape semi-fechado (similar ao Amused) mas com iris **vermelha/carmim**
- Pálpebra superior pesada, múltiplas curvas concêntricas na pálpebra
- Glow azul/ciano fosforescente nas bordas externas
- Sinistro, perigoso — olho de predador
- Difere do SQUINTING: aqui a emoção é mais fria, calculada
- Ativado: após série de interações agressivas / usuário tenta "hackear" a página

---

#### `AGGRESSIVE` — Eclipse / Explosão Vermelha
**Referência**: `DoctorScreen-Aggressive.jpg` (eye-forms)

- Estado completamente abstrato — **sem pálpebras reconhecíveis**
- Forma circular pura: anel vermelho brilhante com centro preto
- Corona/splash vermelho explodindo para fora (como erupção solar)
- Background preto puro com ruído de pixels multicoloridos
- **Mais distante da forma humana** — quase um símbolo de alarme
- Expressa: raiva máxima, perigo imediato
- Ativado: clique múltiplo / interação persistentemente agressiva

---

#### `BARED` — Dentes / Máxima Perturbação
**Referência**: `DoctorScreen-BaredEye.jpeg` (eye-forms)

- Pálpebras substituídas por **fileiras de dentes arredondados (círculos vermelhos)**
- Fundo extremamente escuro (quase preto com toque carmim)
- Pupila central como um buraco/vazio circular
- Linhas de glitch horizontais (ciano e magenta) atravessam toda a imagem
- Estado mais orgânico e perturbador de todos
- Tem aspecto de "boca com olho" — os dentes são eyelids
- Ativado: evento especial / easter egg / sequência específica de ações

---

#### `MANY` — Olhos Múltiplos / Sobrecarga
**Referência**: `DoctorScreen-ManyEyed.jpeg` (eye-forms)

- 1 olho central grande + 6–8 olhos menores orbitando ao redor
- Paleta: roxo/violeta/azul intenso
- Alguns olhos "pingando" (gotejamento branco)
- Olhos menores em orientações variadas — caótico
- Background com scanlines roxas pesadas
- Expressa: colapso do sistema / overdose digital / paranoia
- Ativado: estado de GLITCH prolongado / erro grave

---

#### `PATROL` — Olho Amarelo / Vigilância
**Referência**: `DoctorScreen-PatrolEye.png` (eye-forms)

- Iris/sclera **amarela/dourada** — completamente diferente dos outros
- Rodeado por formas em "dedos/garras" amarelas com bordas dentadas/zigzag
- Pupila como **dois pontos brancos** (referência a câmera de segurança)
- Paleta: amarelo e preto — visual de sinal de aviso/atenção
- Expressa: modo busca, escaneamento ativo, vigilância
- Ativado: usuário movimenta o mouse rapidamente por toda a tela

---

#### `NARROWED` — Fenda Gráfica / Foco Total
**Referência**: `DoctorScreen-Narrowed.png` (eye-forms)

- Estilo visual completamente diferente — mais **gráfico/2D/cartoon**
- Fundo branco com scanlines negras densas (invertido dos outros)
- Pálpebras pretas espessas deixam apenas uma **fenda horizontal mínima**
- Pupila central como ponto preto
- **Linhas concêntricas** em ondas nos lados da pupila (como interferência de ondas)
- Rodeado por ruído multicolorido denso
- Atmosfera analógica, antiga — early computer graphics
- Ativado: idle muito longo / personagem "dormindo com um olho aberto"

---

#### `CLOSED` — Olho Fechado / Transição
**Referência**: `DoctorScreen-Closed.webp`

- Apenas o **contorno** do olho fechado fica visível — linhas finas brilhantes
- Forma de lens/amêndoa com interior completamente escuro
- Múltiplas curvas concêntricas ao redor — decorativas/orgânicas
- Cor: branco-prateado em brilho muito baixo
- Usado como transição entre estados ou shutdown parcial
- Background: navy padrão com grain

---

#### `ETHEREAL` — Olho Completo / Alta Definição
**Referência**: `Etheraleye.webp`

- Versão mais **realista e detalhada** do olho
- Borda forte cyan/teal ao redor de toda a forma
- Iris escura com veias avermelhadas visíveis
- Pupila grande e escura — dominante
- Preenche quase todo o frame
- Textura CRT visível dentro da iris
- Usado para momentos de reveal / awakening

---

#### `RETURNS` — Semi-aberto / Acordando
**Referência**: `Harleyreturns.webp`

- Similar ao Ethereal mas **semi-fechado** — olho abrindo de baixo para cima
- Apenas a metade inferior da iris/sclera visível (forma de D)
- Glow cyan/verde forte na borda inferior
- Pupila muito escura com highlight multicolorido
- Expressa: personagem que estava desligado, começando a acordar
- Usado: animação de boot / primeiro carregamento da página

---

### 4.3 Mapeamento Estado → Trigger

| Estado | Trigger | Duração |
|--------|---------|---------|
| `RETURNS` | Primeira abertura da página | 2–3s → vai para IDLE |
| `IDLE` | Default / sem interação | Contínuo |
| `NARROWED` | Inatividade > 30s | Até movimento |
| `WATCHING` | Mouse parado no centro | Enquanto parado |
| `PATROL` | Mouse movendo rápido | 3s após movimento parar |
| `AMUSED` | Usuário repetiu ação / parado > 60s | 4s → IDLE |
| `SQUINTING` | Click único | 2s → IDLE |
| `CRIMSON` | 3+ clicks em sequência | 5s → IDLE |
| `AGGRESSIVE` | 5+ clicks rápidos | 3s → CRIMSON |
| `BARED` | Easter egg (sequência específica) | 4s → GLITCH |
| `MANY` | GLITCH prolongado > 5s | 4s → IDLE |
| `CLOSED` | Transição entre estados | 300–500ms |
| `ETHEREAL` | Página ganha foco após blur | 2s → IDLE |
| `SHUTDOWN` | Página perde foco / tab muda | Até retorno |

---

## 5. Paleta de Cores — Derivada das Imagens

| Elemento | Cor | Hex |
|----------|-----|-----|
| Background principal | Navy profundo | `#050518` |
| Background grain (partículas) | Navy médio | `#0A0A2A` |
| Sclera (base) | Branco azulado | `#C8D4E8` |
| Iris (neutro) | Azul escuro texturizado | `#1A1A3E` |
| Pupila | Preto puro | `#000000` |
| Glow CRT / phosphor | Cyan teal | `#00E5FF` |
| Aberração cromática 1 | Ciano puro | `#00FFEE` |
| Aberração cromática 2 | Vermelho vivo | `#FF2222` |
| Estado PATROL | Amarelo âmbar | `#F5C518` |
| Estado AGGRESSIVE | Vermelho saturado | `#CC0000` |
| Estado SQUINTING (marcas) | Magenta/carmim | `#CC0044` |
| Estado CRIMSON (iris) | Carmim escuro | `#8B0000` |
| Estado MANY (roxo) | Violeta | `#6600BB` |
| Scanlines | Preto semitransparente | `rgba(0,0,0,0.15)` |
| Texto terminal | Verde fosforescente | `#33FF33` |
| Glitch shift 1 | Ciano | `#00FFFF` |
| Glitch shift 2 | Magenta | `#FF00FF` |
| Bezel do monitor | Bege envelhecido | `#C8B89A` |
| Glow ambient do monitor | Roxo/violeta | `#4A0080` |

---

## 6. Estética CRT — Especificação de Efeitos

### 6.1 Efeitos obrigatórios (sempre ativos)

**Scanlines**
- Linhas horizontais a cada 2–3px
- Opacidade: `0.12–0.18`
- Implementação: `background: repeating-linear-gradient()`

**Grain / Noise**
- Partículas azul-escuras animadas
- Canvas 2D com `ImageData` ou overlay com GIF/noise PNG tileável
- Recomendado: Canvas gerando novo frame a cada 3–4 frames para não ser pesado demais

**Phosphor Glow**
- `filter: blur(1px)` + `box-shadow` cyan em elementos ativos
- Olho emite halo sutil ao redor

**Curvatura de tela (barrel distortion)**
- `border-radius` progressivo nas bordas
- Gradiente radial escurecendo cantos (vignette)
- CSS: `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.8) 100%)`

### 6.2 Efeitos por estado

**Flicker** (IDLE, WATCHING)
- Oscilação de opacidade leve: `0.97 → 1.0 → 0.98`
- Duração irregular: 100–300ms, delay aleatório

**Chromatic Aberration** (todos os estados — obrigatório)
- `filter: url(#chromatic)` com SVG filter deslocando canais RGB
- Ou: 3 camadas sobrepostas (R, G, B) com `mix-blend-mode` e leve offset

**Horizontal Glitch Lines** (transições, GLITCH, AGGRESSIVE)
- `transform: translateX(Npx)` em slices horizontais da tela
- Duração: 50–150ms, aparece aleatoriamente
- Intensidade varia: suave em IDLE, extremo em AGGRESSIVE

**Color Shift** (SQUINTING → AGGRESSIVE)
- Tela toda tinge de vermelho: `filter: hue-rotate(Ndeg) saturate(2)`
- Transição via CSS custom property animada

---

## 7. Frases e Diálogos por Estado

O personagem "fala" via terminal — texto digitado letra por letra com delay variável.
Implementar com delays não-determinísticos (Math.random em cada caractere).

### IDLE
```
"..."
"Interessante."
"Você ainda está aí."
"Eu consigo te ver."
"Continue."
```

### WATCHING
```
"Não se mova."
"Continue assim."
"Eu vejo tudo."
"Você é fascinante."
"Fique onde está."
```

### AMUSED
```
"Bem... isso é um desenvolvimento bastante interessante."
"Você realmente achou que poderia me surpreender?"
"Ha."
"Parabéns. Você falhou de um jeito novo."
"Previsível."
```

### PATROL
```
"Onde você foi?"
"Eu te encontrarei."
"Não há onde se esconder aqui."
"Escaneando..."
```

### SQUINTING
```
"Cuidado."
"Isso foi desnecessário."
"Pense melhor."
```

### AGGRESSIVE
```
"NÃO FAÇA ISSO."
"Eu controlo tudo aqui."
"Você vai se arrepender."
"OUSADIA."
```

### GLITCH / MANY
```
"S̷I̴N̵A̷L̸ ̸P̷E̴R̸D̵I̷D̴O̸"
"[ERRO: ESTADO INVÁLIDO]"
"E̷R̸R̷O̸ ̷D̸E̸ ̷C̵O̷N̸E̷X̷Ã̷O̸"
"//KERNEL_FAULT//"
```

### SHUTDOWN
```
"Até."
"[...]"
"[conexão encerrada]"
```

---

## 8. Áudio

Todos os sons podem ser gerados via **Web Audio API** — sem arquivos externos obrigatórios.

| Evento | Descrição do som | Web Audio |
|--------|-----------------|-----------|
| Loop base | Static noise analógico suave | `AudioBufferSourceNode` com white noise filtrado |
| Transição de estado | Click elétrico rápido | Burst de noise + `OscillatorNode` decaindo |
| AGGRESSIVE | Distorção pesada 500ms | `WaveShaperNode` com curva extrema |
| GLITCH | Chirp / burst caótico | Frequência randômica breve |
| SHUTDOWN | Tom descendente + fade | `OscillatorNode` com `frequency.linearRampToValueAtTime` |
| TALKING | Warble eletrônico | LFO modulando gain enquanto texto aparece |
| BARED | Sub-grave pesado | `OscillatorNode` em 40–60hz, curto |

Volume geral baixo — atmosférico, não intrusivo. Inicializar audio apenas após primeiro clique (política de autoplay dos browsers).

---

## 9. Arquitetura Técnica

### Stack
- **HTML** — estrutura mínima
- **CSS** — efeitos CRT pesados (scanlines, vignette, glow, glitch)
- **JavaScript puro** — sem frameworks
- **SVG** — construção do olho (anatomia vetorial, paths animáveis)
- **Canvas 2D** — noise dinâmico, slices de glitch
- **Web Audio API** — geração procedural de som

### Estrutura de arquivos

```
/harley-sawyer-interface/
 ├── index.html
 ├── css/
 │   ├── crt.css          # Scanlines, curvatura, vignette, phosphor glow
 │   ├── glitch.css       # Animações de glitch, color shift, horizontal tears
 │   └── states.css       # Classes de estado (.state-idle, .state-aggressive, etc.)
 ├── js/
 │   ├── main.js          # Entry point — inicialização, event listeners globais
 │   ├── stateMachine.js  # Máquina de estados, transições, timers
 │   ├── eye.js           # SVG do olho — anatomia, animação, pupil tracking
 │   ├── dialogue.js      # Sistema de texto terminal, fila de mensagens
 │   ├── effects.js       # Canvas noise, glitch slices, chromatic aberration
 │   └── audio.js         # Web Audio API — static noise e efeitos por estado
 └── assets/
     └── expressions/     # Imagens de referência (NÃO usadas diretamente na página)
         ├── *.webp                    # Imagens originais do usuário
         ├── eye-forms/                # Eye Forms do wiki
         ├── chapter5/                 # Referências do Chapter 5
         └── character-ref/            # Referências do personagem
```

### Construção do olho em SVG

```svg
<svg id="eye" viewBox="0 0 400 300">
  <defs>
    <!-- Filter: chromatic aberration -->
    <filter id="chroma">
      <feColorMatrix type="matrix" ... />
    </filter>
    <!-- Filter: phosphor glow -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Eyelid paths — animáveis via JS -->
  <path id="eyelid-top" class="eyelid" d="..." />
  <path id="eyelid-bottom" class="eyelid" d="..." />

  <!-- Sclera — clipping region -->
  <clipPath id="eye-clip">
    <path id="eye-shape" d="..." />
  </clipPath>

  <g clip-path="url(#eye-clip)">
    <!-- Sclera fill -->
    <ellipse id="sclera" fill="#C8D4E8" filter="url(#glow)" />
    <!-- Iris ring -->
    <circle id="iris" fill="#1A1A3E" />
    <!-- Pupil -->
    <circle id="pupil" fill="#000000" />
    <!-- Highlight — chromatic aberration -->
    <circle id="highlight-cyan" fill="#00FFEE" opacity="0.9" />
    <circle id="highlight-red" fill="#FF2222" opacity="0.6" />
  </g>
</svg>
```

---

## 10. Fases de Implementação

### Fase 1 — Tela viva (2–3h)
1. HTML base + monitor CRT em CSS (borda, vignette, curvatura)
2. Scanlines e noise canvas estático
3. SVG do olho — IDLE state, piscada básica

### Fase 2 — O olho segue (1–2h)
4. Mouse tracking — pupila segue cursor em tempo real
5. Transição suave da pupila (lerp ou spring physics)
6. Glow CRT dinâmico ao redor do olho

### Fase 3 — Estados e reações (3–4h)
7. State machine completa (stateMachine.js)
8. Transições visuais entre os 13 estados via CSS classes + SVG morph
9. Timers de estado (idle, inatividade, sequências)

### Fase 4 — Voz e som (1–2h)
10. Web Audio static noise (loop)
11. Efeitos sonoros por evento de estado
12. Sistema de diálogo terminal (digitação caractere a caractere)

### Fase 5 — Atmosfera e polish (2–3h)
13. Glitch horizontal slices em Canvas (effects.js)
14. Chromatic aberration via SVG filter
15. Delays não-determinísticos em tudo
16. Easter egg: sequência que ativa estado BARED

---

## 11. Direção Criativa — O que Evitar / Buscar

| Evitar | Buscar |
|--------|--------|
| UI limpa e amigável | Desconforto contido |
| Cores vibrantes ou alegres | Navy, crimson, cyan frio |
| Animações suaves e previsíveis | Movimento orgânico irregular |
| Feedback imediato e claro | Delays, silêncios, não-resposta |
| Sensação de controle ao usuário | Sensação de ser observado |
| Simetria perfeita | Leve assimetria e imperfeição |
| Som clean/musical | Static, interferência, silêncio pesado |

---

## 12. Referências de Imagens por Estado

| Estado | Arquivo de referência |
|--------|-----------------------|
| IDLE | `expressions/DoctorScreen-Normal.webp` |
| WATCHING | `expressions/DoctorScreen-Opened.webp` |
| AMUSED | `expressions/DoctorScreen-Amused.webp` |
| SQUINTING | `expressions/DoctorScreen-Squinted.webp` |
| CRIMSON | `expressions/DoctorScreen-CrimsonIris.webp` |
| AGGRESSIVE | `expressions/eye-forms/DoctorScreen-Aggressive.jpg` |
| BARED | `expressions/eye-forms/DoctorScreen-BaredEye.jpeg` |
| MANY / GLITCH | `expressions/eye-forms/DoctorScreen-ManyEyed.jpeg` |
| PATROL | `expressions/eye-forms/DoctorScreen-PatrolEye.png` |
| NARROWED | `expressions/eye-forms/DoctorScreen-Narrowed.png` |
| CLOSED | `expressions/DoctorScreen-Closed.webp` |
| ETHEREAL | `expressions/Etheraleye.webp` |
| RETURNS | `expressions/Harleyreturns.webp` |
| SHUTDOWN | `expressions/HarleyEye.webp` (tela preta) |
| Monitor form | `expressions/TheDoctor_Trailer.webp` |
| Contexto Chapter 5 | `expressions/chapter5/CH5-DrSawyerBackup.jpeg` |

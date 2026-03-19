Certo — indo direto ao ponto técnico da simulação de CRT, com foco em como você reproduzir isso com fidelidade em código (shader/pipeline gráfico).

1) Curvatura (Geometry Distortion)

CRT não é plano → você precisa distorcer o UV.

Modelo comum (barrel distortion):

vec2 uv = fragCoord.xy / resolution.xy;
uv = uv * 2.0 - 1.0; // [-1, 1]

float k = 0.15; // intensidade da curvatura
uv += uv * (dot(uv, uv)) * k;

uv = uv * 0.5 + 0.5;

Detalhes importantes:

Curvatura é radial e suave

Bordas “esticam” levemente

Pode adicionar overscan (cortar bordas)

2) Scanlines (essencial)

Linhas horizontais não são só overlay — elas interagem com o brilho.

float scan = sin(fragCoord.y * 1.5) * 0.5 + 0.5;
color *= mix(0.85, 1.0, scan);

Refinamento:

Use frequência baseada na resolução vertical

Não deixe 100% uniforme (adicione jitter leve)

Intensidade depende do brilho local

3) Mask RGB (shadow mask / aperture grille)

Simula os subpixels físicos.

float mask = step(0.5, fract(fragCoord.x * 0.333));
color.r *= mask;
color.g *= 1.0 - mask;

Melhor:

Use padrão triádico (RGB vertical stripes)

Ou máscara tipo slot (mais moderno)

4) Glow / Phosphor Bloom

CRT tem persistência + espalhamento de luz

vec3 bloom = texture(tex, uv) * 0.6;
bloom += texture(tex, uv + vec2(0.001, 0.0)) * 0.2;
bloom += texture(tex, uv - vec2(0.001, 0.0)) * 0.2;

color += bloom * 0.3;

Importante:

Glow não é global → depende do brilho

Mais forte em áreas claras

Levemente “borrado” horizontalmente

5) Bleed / Chromatic Aberration

Desalinhamento de cores.

float shift = 0.002;

float r = texture(tex, uv + vec2(shift, 0.0)).r;
float g = texture(tex, uv).g;
float b = texture(tex, uv - vec2(shift, 0.0)).b;

color = vec3(r, g, b);
6) Horizontal Jitter / Signal Instability

Simula instabilidade analógica.

float jitter = sin(time * 10.0 + uv.y * 20.0) * 0.002;
uv.x += jitter;

Mais realista:

Ruído randômico + senoidal

Afeta só algumas linhas

7) Noise (baixo nível)

Ruído de sinal:

float noise = fract(sin(dot(uv * time, vec2(12.9898,78.233))) * 43758.5453);
color += noise * 0.02;
8) Vignette (natural do CRT)

Queda de brilho nas bordas:

float dist = length(uv - 0.5);
color *= smoothstep(0.8, 0.4, dist);
9) Gamma / Response não-linear

CRT não é linear como LCD.

color = pow(color, vec3(1.2)); // simula resposta do fósforo
10) Flicker (baixa frequência)

Muito sutil:

float flicker = 0.98 + sin(time * 60.0) * 0.02;
color *= flicker;
Pipeline recomendado (ordem importa)

Sample textura base

Curvatura (UV distortion)

Jitter horizontal

Chromatic aberration

Scanlines

RGB mask

Bloom / glow

Noise

Vignette

Gamma correction

Parâmetros chave pra “feeling realista”

Curvature: 0.1 – 0.25

Scanline intensity: 0.1 – 0.3

Chromatic shift: 0.001 – 0.003

Noise: bem baixo

Bloom: moderado e localizado

Jitter: quase imperceptível, mas constante

Insight importante (nível mais alto)

O que faz parecer “real” não é nenhum efeito isolado — é a combinação imperfeita:

Pequenos erros + instabilidade contínua

Nada 100% alinhado

Nada 100% estático

Se tudo estiver “perfeito”, vira filtro Instagram.
Se estiver levemente errado em tudo → vira CRT convincente.

Focando estritamente na resposta cromática e no comportamento do brilho (o “light bleed” que parece vir de dentro do vidro):

Paleta dominante (característica de fósforo CRT estilizado)
1) Base escura (quase preto, mas não puro)

Fundo não é #000000

É um preto elevado, levemente contaminado por azul/roxo

Algo como:

RGB aproximado: (5–15, 0–10, 20–40)

👉 Isso é crítico: preto de CRT sempre “respira”, nunca é absoluto.

2) Azul elétrico (canal dominante)

Principal cor emissiva

Saturação alta + leve tendência ao ciano

RGB típico:

(0–50, 100–180, 255)

👉 Esse azul é o que mais “vaza” e cria a sensação de profundidade.

3) Branco azulado (highlight)

Não é branco neutro

Sempre puxado para azul/violeta

RGB:

(180–255, 200–255, 255)

👉 Esse é o ponto onde o glow nasce.

4) Roxo / violeta (interferência e bordas)

Surge da mistura de azul + vermelho em baixa intensidade

RGB:

(80–150, 0–50, 150–255)

👉 Usado principalmente no halo e nas transições.

5) Vermelho pontual (contraste energético)

Muito localizado, nunca dominante

RGB:

(200–255, 20–50, 20–50)

👉 Serve como “ruído energético”, não iluminação base.

Como reproduzir o “brilho vindo de dentro” (ponto chave)

Isso NÃO é só bloom. É a soma de 3 fenômenos:

1) Emissão volumétrica simulada

Você precisa fazer parecer que a luz:

nasce atrás do vidro

e não na superfície

👉 Técnica:

Use blur antes de compor com a imagem final

Misture com a base usando additive blending leve

vec3 base = texture(tex, uv).rgb;
vec3 glow = blur(tex, uv); // leve, não exagerado

color = base + glow * 0.4;
2) Bleed não uniforme (dependente da intensidade)

O brilho não espalha igual — ele cresce com a intensidade:

float intensity = max(max(base.r, base.g), base.b);
vec3 glow = blur(tex, uv) * intensity;

👉 Áreas claras “inflam”, escuras não.

3) Soft clipping (não deixar estourar digitalmente)

CRT não clippa seco → ele “amassa” o branco.

color = color / (color + vec3(1.0));

👉 Isso cria aquele brilho orgânico.

Truque principal (o que realmente vende o efeito)

O segredo não é só cor — é gradiente interno:

Centro do pixel → mais intenso

Bordas → mais difusas

Fundo → ainda levemente iluminado

👉 Simulação prática:

Pegue o glow e aplique duas camadas:

Uma mais nítida (curta distância)

Outra bem difusa (longa distância, baixa intensidade)

Erros comuns (evite)

Preto absoluto → mata o efeito

Branco puro (#FFFFFF) → fica artificial

Bloom uniforme → parece filtro barato

Saturação linear → CRT é não-linear

Resumo técnico direto

Você quer:

Base escura azulada (não preta)

Azul dominante com branco frio

Glow dependente de intensidade

Bleed suave + difuso em múltiplas camadas

Compressão de highlights (não clipar)
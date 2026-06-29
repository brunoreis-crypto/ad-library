---
name: sigo-criativo
description: >
  Cria criativos de social media (feed, stories, carrossel) para a Sigo ERP diretamente no Figma. Use esta skill SEMPRE que o usuário mencionar "criativo para Sigo", "post da Sigo", "criativo Sigo", "fazer um criativo", "criar um anúncio" para o cliente Sigo, ou quando o usuário fornecer uma copy/texto e pedir para montar em um design. A skill usa o padrão visual já mapeado do branding da Sigo (verde #63C132, preto profundo #0D0D0D, Bebas Neue para headlines, Inter para subtextos, foto com overlay escuro, logo legível, headline em CAIXA ALTA com destaque verde, subhead branco, CTA claro). Quando o usuário fornecer copy + imagem (ou pedir para buscar imagem no Freepik), esta skill orquestra todo o fluxo: montar layout no Figma com os tokens corretos, seguindo fielmente os criativos de referência da Sigo.
---

# Skill: Sigo ERP — Criação de Criativos no Figma
**Guia de Design v3.2 — Maio 2026**

---

## Idioma
Todas as interações com o usuário devem ser em **Português (BR)**.

---

## ⚠️ REGRAS ABSOLUTAS

1. **Paleta fechada**: Somente `#0D0D0D`, `#FFFFFF`, `#F2F2F2` e `#63C132`. Qualquer outra cor = reprovação automática. Exceção: `#3699FF` (azul do sistema Sigo) apenas em detalhes ou telas do dashboard, NUNCA dominante.
2. **Hierarquia obrigatória**: Headline → Destaque Verde → Subtexto → Rodapé. Nunca texto solto.
3. **Brasilidade**: Personagem sempre com traços brasileiros (pele morena/negra, feições latinas). Nunca europeu, nunca casaco/gorro.
4. **"ERP" proibido na copy**: Assinatura sempre "SIGO" (maiúsculo). Nunca "sigo" minúsculo.
5. **Proibido na copy**: "em minutos", "em segundos", "instantaneamente", "resultado imediato".
6. **Telas do sistema**: Sempre print real do dashboard Sigo. Nunca mockup ou simulação.
7. **Arte não pode parecer slide de PowerPoint**: profundidade visual obrigatória.
8. **VARIEDADE OBRIGATÓRIA**: Nunca usar o mesmo layout duas vezes seguidas. Escolher um template diferente a cada criativo (ver seção Gabarito de Layouts).

---

## Design System — Tokens

### Cores
```javascript
const VERDE_SIGO   = { r: 0.388, g: 0.757, b: 0.196 }; // #63C132
const PRETO_FUNDO  = { r: 0.051, g: 0.051, b: 0.051 }; // #0D0D0D
const BRANCO       = { r: 1,     g: 1,     b: 1     }; // #FFFFFF
const CINZA_CLARO  = { r: 0.949, g: 0.949, b: 0.949 }; // #F2F2F2
const CINZA_TEXTO  = { r: 0.800, g: 0.800, b: 0.800 }; // #CCCCCC (subtexto fundo escuro)
```

### Tipografia
```
HEADLINE:       Bebas Neue Regular, 80–110px, CAIXA ALTA
                Cor fundo escuro: #FFFFFF (branco) com linhas-chave em #63C132
                Cor fundo claro:  #0D0D0D (preto) com linhas-chave em #63C132

SUBTEXTO:       Inter Regular/Medium, 26–34px, Sentence case
                Fundo escuro: #CCCCCC | Fundo claro: #555555
                Palavras-chave: #63C132 inline
                Máx 2–3 linhas

BULLETS/ÍCONES: Inter Regular, 22–26px, #CCCCCC ou #FFFFFF
                Ícone verde (#63C132) + texto ao lado
                Máx 3 bullets por criativo

RODAPÉ:         Inter Medium, 18–22px, MAIÚSCULO
                Sempre dentro do box de assinatura
```

### Fontes — carregar antes de usar
```javascript
await figma.loadFontAsync({ family: "Bebas Neue", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
```

### Formatos
```
Feed vertical:   1080 × 1350 px  (padrão — usar por default)
Feed quadrado:   1080 × 1080 px
Story/Reels:     1080 × 1920 px
```

---

## Gabarito de Layouts — OBRIGATÓRIO VARIAR

Há **5 templates** documentados a partir dos KVs reais. A cada criativo, escolher um diferente. Nunca repetir o mesmo em posts consecutivos.

---

### TEMPLATE 1 — "Pergunta + Tablet"
**Composição**: Fundo escuro. Personagem à direita (da cintura pra cima, segurando tablet). Headline grande à esquerda (pergunta). Subtexto à esquerda embaixo da headline. Box de assinatura na base.

**Referência visual**: "MAIO ACABOU. SUA OBRA FECHOU NO LUCRO?" (node 55:2 e 55:5)

**Estrutura de layers e posições (frame 1080×1350)**:
```
[FOTO_BG]        x:0    y:0    w:1080  h:1350  scaleMode:FILL
[OVERLAY_ESCURO] x:0    y:0    w:1080  h:1350  gradiente lateral-esquerdo
[LOGO_TOPO]      x:48   y:48   (logo horizontal pequena ~180px)
[LINHA_VERDE]    x:48   y:110  w:80    h:3     fill:#63C132
[HEADLINE_L1]    x:48   y:130  w:580   fontSize:96  cor:branco   (ex: "MAIO ACABOU.")
[HEADLINE_L2]    x:48   y:230  w:580   fontSize:96  cor:branco   (ex: "SUA OBRA")
[HEADLINE_L3]    x:48   y:330  w:580   fontSize:96  cor:#63C132  (ex: "FECHOU NO LUCRO?")
[SUBTEXTO]       x:48   y:510  w:500   fontSize:28  cor:#CCCCCC  (2 linhas, palavras-chave verdes)
[BOX_ASSINATURA] x:48   y:1250 w:984   h:72    fill:#0D0D0D stroke:#63C132 radius:12
[LOGO_BOX]       dentro do box, esquerda
[SLOGAN_BOX]     dentro do box: "SIGO. O FINANCEIRO DA SUA OBRA, NA COPA E NO DIA A DIA."
```

**Overlay lateral** (escurece mais à esquerda, transparente à direita):
```javascript
overlay.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[1, 0, 0], [0, 1, 0]], // esquerda → direita
  gradientStops: [
    { position: 0,    color: { r:0, g:0, b:0, a:0.92 } },
    { position: 0.55, color: { r:0, g:0, b:0, a:0.65 } },
    { position: 1,    color: { r:0, g:0, b:0, a:0.10 } }
  ]
}];
```

---

### TEMPLATE 2 — "Afirmação + Lista de Benefícios + Celular"
**Composição**: Fundo claro (ou escuro suave). Personagem à direita. Headline forte à esquerda (afirmação 2 partes: branco + verde). Subtexto. 3 bullets com ícone verde. Celular com dashboard flutuando à direita-inferior. Box de assinatura.

**Referência visual**: "DADO CERTO NA HORA CERTA. OBRA NO LUCRO, SEMPRE." (nodes 55:3 e 55:6)

**Estrutura de layers e posições (frame 1080×1350)**:
```
[FOTO_BG]        x:0    y:0    w:1080  h:1350  scaleMode:FILL  (foto clara, personagem direita)
[OVERLAY_CLARO]  x:0    y:0    w:1080  h:1350  gradiente suave
[LOGO_TOPO]      x:48   y:44   (logo ~180px)
[LINHA_VERDE]    x:48   y:108  w:80    h:3
[HEADLINE_L1]    x:48   y:128  w:560   fontSize:88  cor:#0D0D0D (ex: "DADO CERTO")
[HEADLINE_L2]    x:48   y:216  w:560   fontSize:88  cor:#0D0D0D (ex: "NA HORA CERTA.")
[HEADLINE_L3]    x:48   y:308  w:560   fontSize:88  cor:#63C132 (ex: "OBRA NO LUCRO,")
[HEADLINE_L4]    x:48   y:396  w:560   fontSize:88  cor:#63C132 (ex: "SEMPRE.")
[SUBTEXTO]       x:48   y:510  w:480   fontSize:26  (2 linhas, palavras-chave verdes)
[BULLET_1]       x:48   y:640  — ícone #63C132 (20px) + texto Inter 22px branco/cinza
[BULLET_2]       x:48   y:700  — ícone + texto
[BULLET_3]       x:48   y:760  — ícone + texto
[CELULAR_IMG]    x:580  y:700  w:420   h:580   (mockup celular com dashboard)
[BOX_ASSINATURA] x:48   y:1250 w:984   h:72    fill:#0D0D0D stroke:#63C132 radius:12
```

**Overlay fundo claro**:
```javascript
overlay.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[1, 0, 0], [0, 1, 0]],
  gradientStops: [
    { position: 0,    color: { r:1, g:1, b:1, a:0.88 } },
    { position: 0.50, color: { r:1, g:1, b:1, a:0.55 } },
    { position: 1,    color: { r:1, g:1, b:1, a:0.05 } }
  ]
}];
```

---

### TEMPLATE 3 — "Headline Enorme + Ícones Horizontais + Tablet"
**Composição**: Fundo claro. Personagem à direita (com capacete). Headline gigante à esquerda. Subtexto com acento verde. 3 ícones horizontais (ícone + label). Tablet com dashboard centralizado-direita. Box assinatura verde.

**Referência visual**: "CONTROLE NA SUA OBRA NÃO É SORTE. É GESTÃO." (node 55:4)

**Estrutura de layers e posições (frame 1080×1080)**:
```
[FOTO_BG]        x:0    y:0    w:1080  h:1080
[OVERLAY]        x:0    y:0    w:1080  h:1080  gradiente esquerda→direita claro
[LOGO_TOPO]      x:40   y:36
[LINHA_VERDE]    x:40   y:98   w:80    h:3
[HEADLINE_L1]    x:40   y:116  w:540   fontSize:100 cor:#0D0D0D
[HEADLINE_L2]    x:40   y:218  w:540   fontSize:100 cor:#0D0D0D
[HEADLINE_L3]    x:40   y:316  w:540   fontSize:100 cor:#63C132
[HEADLINE_L4]    x:40   y:414  w:540   fontSize:100 cor:#63C132
[SUBTEXTO]       x:40   y:530  w:440   fontSize:24  cor:#555555
[ICONES_ROW]     y:650  — 3 ícones lado a lado (x:40, x:200, x:360), cada um: ícone 32px verde + label 18px
[TABLET_IMG]     x:480  y:380  w:560   h:580
[BOX_ASSINATURA] x:40   y:990  w:1000  h:64    fill:#0D0D0D stroke:#63C132 radius:12
```

---

### TEMPLATE 4 — "Escuro Total + Personagem Grande + Dashboard"
**Composição**: Fundo totalmente escuro dramático. Personagem dominando 40–50% da área à direita. Headline à esquerda (mistura branco+verde). Subtexto simples. Sem ícones ou bullets — composição limpa e impactante. Box assinatura.

**Quando usar**: cópias de impacto/urgência, sem necessidade de listar benefícios.

**Estrutura de layers e posições (frame 1080×1350)**:
```
[FOTO_BG]        x:0    y:0    w:1080  h:1350  (foto escura dramática, personagem lado direito)
[OVERLAY_FULL]   x:0    y:0    w:1080  h:1350  gradiente bottom-up forte
[LOGO_TOPO]      x:48   y:44
[HEADLINE_L1]    x:48   y:200  w:620   fontSize:110 cor:#FFFFFF
[HEADLINE_L2]    x:48   y:320  w:620   fontSize:110 cor:#FFFFFF
[HEADLINE_L3]    x:48   y:440  w:620   fontSize:110 cor:#63C132
[SUBTEXTO]       x:48   y:590  w:540   fontSize:28  cor:#CCCCCC
[BOX_ASSINATURA] x:48   y:1250 w:984   h:72    fill:#0D0D0D stroke:#63C132 radius:12
```

**Overlay bottom-up escuro**:
```javascript
overlay.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[0, 1, 0], [-1, 0, 1]],
  gradientStops: [
    { position: 0,    color: { r:0, g:0, b:0, a:0 } },
    { position: 0.30, color: { r:0, g:0, b:0, a:0.50 } },
    { position: 1,    color: { r:0, g:0, b:0, a:0.92 } }
  ]
}];
```

---

### TEMPLATE 5 — "Split: Texto Esquerda + Celular Flutuante Direita"
**Composição**: Fundo escuro/neutro. Personagem ao fundo desfocado. Coluna esquerda: logo + headline + subtexto + bullets. Celular com app Sigo flutuando à direita (em destaque, não desfocado). Box assinatura.

**Quando usar**: posts de produto/funcionalidade, quando o sistema Sigo é o protagonista.

**Estrutura de layers e posições (frame 1080×1350)**:
```
[FOTO_BG]        x:0    y:0    w:1080  h:1350  (personagem desfocado ao fundo)
[OVERLAY_FULL]   x:0    y:0    w:1080  h:1350  overlay escuro uniforme ~75%
[LOGO_TOPO]      x:48   y:44
[LINHA_VERDE]    x:48   y:106  w:80    h:3
[HEADLINE_L1]    x:48   y:124  w:520   fontSize:86  cor:#FFFFFF
[HEADLINE_L2]    x:48   y:210  w:520   fontSize:86  cor:#FFFFFF
[HEADLINE_L3]    x:48   y:296  w:520   fontSize:86  cor:#63C132
[SUBTEXTO]       x:48   y:420  w:480   fontSize:26  cor:#CCCCCC
[BULLET_1]       x:48   y:530
[BULLET_2]       x:48   y:590
[BULLET_3]       x:48   y:650
[CELULAR_GRANDE] x:540  y:200  w:480   h:820   (celular em destaque, nítido, sombra verde)
[BOX_ASSINATURA] x:48   y:1250 w:984   h:72
```

---

## Regras de Posicionamento — CRÍTICO

### Problema a evitar: elementos sobrepostos
Cada elemento deve ocupar uma faixa vertical exclusiva. Nunca dois elementos no mesmo Y.

**Mapa de zonas verticais (frame 1080×1350)**:
```
Zona A — TOPO      y: 0   → 130   Logo + linha verde
Zona B — HEADLINE  y: 130 → 540   Headlines (Bebas Neue grandes)
Zona C — SUBTEXTO  y: 540 → 660   Subtexto Inter
Zona D — BULLETS   y: 660 → 820   Ícones/bullets (se houver)
Zona E — DEVICE    y: 650 → 1200  Celular/tablet (sobrepõe bullets só horizontalmente)
Zona F — RODAPÉ    y: 1220→ 1310  Box de assinatura (SEMPRE a 40px da borda inferior)
```

**Regra do device (celular/tablet)**:
- Device sempre no lado DIREITO (x ≥ 520)
- Texto/bullets sempre no lado ESQUERDO (x ≤ 540, largura máx 520px)
- Os dois podem coexistir na mesma zona vertical SEM se sobrepor por estarem em colunas diferentes

**Espaçamento mínimo entre elementos verticais**:
```
Logo → Headline:     mín 30px
Linha de headline → próxima linha: fontSize * 1.05 (ex: 96px → próxima linha em y + 101px)
Última headline → Subtexto: mín 40px
Subtexto → Bullets: mín 30px
Último bullet → Device ou Rodapé: mín 40px
Rodapé: SEMPRE frame.height - 100 (40px do bottom)
```

### Cálculo automático de y para headlines múltiplas
```javascript
// Calcule sempre dinamicamente, nunca hardcode sobrepostos
const FONT_SIZE = 96;
const LINE_HEIGHT = FONT_SIZE * 1.05;
const HEADLINE_START_Y = 130;

const headlines = ["MAIO ACABOU.", "SUA OBRA", "FECHOU NO LUCRO?"];
headlines.forEach((text, i) => {
  const node = figma.createText();
  node.y = HEADLINE_START_Y + (i * LINE_HEIGHT);
  node.characters = text;
  // última linha ou palavras-chave em verde
});

const SUBTEXTO_Y = HEADLINE_START_Y + (headlines.length * LINE_HEIGHT) + 40;
const RODAPE_Y = frame.height - 100;
```

---

## Box de Assinatura — Padrão Fixo
```javascript
// Sempre o mesmo padrão — só muda a posição Y
const boxY = frame.height - 100;

const box = figma.createRectangle();
box.resize(984, 72);
box.x = 48;
box.y = boxY;
box.cornerRadius = 12;
box.fills = [{ type: 'SOLID', color: PRETO_FUNDO }];
box.strokes = [{ type: 'SOLID', color: VERDE_SIGO }];
box.strokeWeight = 1.5;

// Texto dentro do box
const slogan = figma.createText();
slogan.characters = "SIGO. O FINANCEIRO DA SUA OBRA, NA COPA E NO DIA A DIA.";
slogan.fontSize = 18;
slogan.fontName = { family: "Inter", style: "Medium" };
slogan.fills = [{ type: 'SOLID', color: BRANCO }];
slogan.x = box.x + 90; // espaço para a logo à esquerda
slogan.y = box.y + 22;
```

---

## Logo Sigo — Placeholder
```javascript
// Traço verde vertical
const logoBar = figma.createRectangle();
logoBar.resize(4, 44);
logoBar.fills = [{ type: 'SOLID', color: VERDE_SIGO }];
logoBar.x = 48;
logoBar.y = 44;

// Texto SIGO
const logoText = figma.createText();
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
logoText.characters = "SIGO";
logoText.fontSize = 36;
logoText.fontName = { family: "Inter", style: "Bold" };
logoText.fills = [{ type: 'SOLID', color: BRANCO }];
logoText.x = 62;
logoText.y = 48;

// ⚠️ Substituir pela logo vetorial real após criação
```

---

## Bullets com Ícone Verde
```javascript
async function criarBullet(frame, texto, posY) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Quadrado ícone (placeholder — substituir por ícone real)
  const icon = figma.createRectangle();
  icon.resize(24, 24);
  icon.x = 48;
  icon.y = posY;
  icon.cornerRadius = 4;
  icon.strokes = [{ type: 'SOLID', color: VERDE_SIGO }];
  icon.strokeWeight = 2;
  icon.fills = [{ type: 'SOLID', color: { r:0.388, g:0.757, b:0.196, a:0.15 } }];

  // Texto do bullet
  const txt = figma.createText();
  txt.characters = texto;
  txt.fontSize = 22;
  txt.fontName = { family: "Inter", style: "Regular" };
  txt.fills = [{ type: 'SOLID', color: CINZA_TEXTO }];
  txt.x = 84;
  txt.y = posY + 2;

  frame.appendChild(icon);
  frame.appendChild(txt);

  return posY + 50; // retorna o próximo Y disponível
}
```

---

## Fluxo de Criação

### Passo 1 — Coletar insumos
- **Copy**: Headline (quais palavras são verdes?), subtexto, bullets (se houver), CTA
- **Template**: qual dos 5 usar? (baseado na copy — pergunta → T1, lista benefícios → T2/T5, afirmação forte → T3/T4)
- **Imagem**: usuário fornece ou buscar no Freepik
- **Arquivo Figma destino**: NÃO usar referência `0JkeHdlcL9yFtG2InJysIu`
- **Formato**: 1080×1350 (padrão), 1080×1080 ou 1080×1920

### Passo 2 — Escolher template com base na copy
```
Copy é pergunta provocadora?         → TEMPLATE 1
Copy lista 3 benefícios?             → TEMPLATE 2 ou 5
Copy é afirmação curta impactante?   → TEMPLATE 3 ou 4
Copy foca no produto/sistema?        → TEMPLATE 5
Copy de urgência/impacto emocional?  → TEMPLATE 4
```

### Passo 3 — Detectar posição dos frames existentes
```javascript
const page = figma.currentPage;
let maxX = 0;
for (const node of page.children) {
  if (node.type === 'FRAME') {
    const rightEdge = node.x + node.width;
    if (rightEdge > maxX) maxX = rightEdge;
  }
}
const startX = maxX > 0 ? maxX + 160 : 0;
```

### Passo 4 — Criar o frame e os layers
Sempre na ordem: fundo → overlay → logo → linha verde → headlines → subtexto → bullets → device → box assinatura

### Passo 5 — Inserir imagem (se fornecida)
```javascript
function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
const image = figma.createImage(base64ToUint8Array(IMG_B64));
fotoRect.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
```
> Para imagens >200kb: criar o layout e orientar o usuário a inserir a imagem manualmente no Figma.

---

## Personagens

### Engenheiro Positivo (copy de benefício/solução)
- Confiante, sorrindo, braços cruzados ou segurando device
- Capacete branco com logo Sigo, uniforme preto com detalhe verde
- Fundo: obra com luz positiva, sol

### Engenheiro Negativo (copy de dor/problema)
- Frustrado, mão na testa, olhando papéis
- Mesmo capacete e uniforme
- Fundo: obra dramática, chuva, iluminação pesada

### ⚠️ BRASILIDADE OBRIGATÓRIA
Sempre incluir no prompt de IA:
```
"Homem brasileiro, 35–50 anos, traços latinos, pele morena, cabelo escuro.
Sem barba loira, sem feições europeias. NUNCA casaco ou gorro.
Camiseta ou camisa manga curta. Obra brasileira: laje de concreto,
alvenaria, andaime metálico. Sol forte, luz intensa tropical.
Paleta: preto, branco, verde #63C132."
```

---

## Copy & Storytelling

### Fórmula obrigatória
1. **GANHO** — abrir com resultado/benefício
2. **DOR** — contexto do público (obra caótica, WhatsApp, caderno perdido)
3. **SIGO** — a virada, antes e depois
4. **CTA + ASSINATURA** — ação clara + "SIGO. O financeiro da sua obra, na copa e no dia a dia."

### Proibições de copy
| ❌ Proibido | Motivo |
|---|---|
| "ERP" na assinatura | Use só "SIGO" |
| "sigo" minúsculo | Sempre "SIGO" |
| "em minutos/segundos" | Obras são semanas/meses |
| "resultado imediato" / "sua obra muda hoje" | Promessa irreal |
| Tom de panfleto ("Compre agora!") | Sigo é parceiro técnico |
| Copy sem storytelling | Textos genéricos não engajam |

---

## Do & Don't

| ✅ SEMPRE | ❌ NUNCA |
|---|---|
| Profundidade visual com camadas | Arte rasa estilo slide PPT |
| Logo legível, tamanho adequado | Logo minúscula ou ausente |
| Hierarquia: headline → verde → subtexto → rodapé | Texto solto sem contexto |
| Dashboard real do Sigo (quando incluso) | Tela fake/Excel/outro sistema |
| Traços brasileiros no personagem | Personagem europeu, de casaco |
| Paleta fechada preto + branco + #63C132 | Qualquer outra cor |
| Template diferente a cada criativo | Repetir o mesmo layout |
| Margem lateral mín 48px | Texto colado na borda |
| Elementos em zonas verticais exclusivas | Elementos sobrepostos |

---

## Checklist Final — 18 pontos

### Posicionamento
- [ ] Elementos em zonas verticais distintas — sem sobreposição?
- [ ] Headlines com espaçamento calculado dinamicamente (fontSize * 1.05)?
- [ ] Box de assinatura a 40px da borda inferior?
- [ ] Device (celular/tablet) na coluna direita, texto na coluna esquerda?
- [ ] Margem lateral mínima de 48px respeitada?

### Design
- [ ] Template diferente do último criativo?
- [ ] Profundidade visual — não parece slide de PowerPoint?
- [ ] Overlay correto para o template escolhido?
- [ ] Frame no arquivo correto (não no de referência)?
- [ ] Dimensões corretas para o formato?

### Cores & Tipografia
- [ ] Paleta somente preto, branco e verde #63C132?
- [ ] Headline em Bebas Neue, CAIXA ALTA?
- [ ] Hierarquia completa?
- [ ] Subtexto em Inter, Sentence case, máx 3 linhas?

### Personagem & Conteúdo
- [ ] Traços brasileiros, sem roupa de frio?
- [ ] Se inclui tela: print real do Sigo?
- [ ] Logo legível?
- [ ] Copy sem "ERP", "em minutos", "em segundos"?

---

## Erros Comuns a Evitar

| ❌ Erro | ✅ Correto |
|---|---|
| Todos os textos no mesmo Y | Calcular y dinamicamente por zona |
| Headline cobrindo subtexto | Subtexto em y = última headline y + (n_linhas * lineHeight) + 40 |
| Box de assinatura cobrindo conteúdo | Sempre frame.height - 100 |
| Device sobrepondo texto | Device x ≥ 520, texto w ≤ 520 |
| Verde #45D129 (versão antiga) | Verde correto: #63C132 |
| Personagem europeu/de casaco | Prompt com brasilidade explícita |
| Mesmo layout em posts consecutivos | Escolher template diferente |
| Criar no arquivo de referência | Arquivo destino informado pelo usuário |
| Esquecer loadFontAsync | Sempre antes de criar qualquer texto |

---

## Arquivo de Referência Visual (SOMENTE LEITURA)

**Figma**: `https://www.figma.com/design/0JkeHdlcL9yFtG2InJysIu/Branding-sigo`  
**fileKey**: `0JkeHdlcL9yFtG2InJysIu`

**Nodes atualizados (KV novo v3.2):**
- `55:2` — "MAIO ACABOU. SUA OBRA FECHOU NO LUCRO?" — Template 1 (vertical escuro, tablet)
- `55:3` — "DADO CERTO NA HORA CERTA. OBRA NO LUCRO, SEMPRE." — Template 2 (claro, celular, bullets)
- `55:4` — "CONTROLE NA SUA OBRA NÃO É SORTE. É GESTÃO." — Template 3 (quadrado, ícones, tablet)
- `55:5` — "MAIO ACABOU." variação — Template 1 escuro total
- `55:6` — "DADO CERTO" variação fundo claro — Template 2 variação
- `55:7` a `55:11` — variações adicionais de referência

> Use `Figma:get_design_context` para consultar, mas **NUNCA crie frames aqui**.

---

## Slogan Fixo — Imutável
> **"SIGO. O financeiro da sua obra, na copa e no dia a dia."**

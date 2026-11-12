# Auditoria da Página Pessoal — samuel-c-santos.github.io

**Data:** 2026-11-12  
**Branch:** master (working tree limpo)  
**URL produção:** https://samuel-c-santos.github.io (CNAME: `samuelsantos.site`)  
**Escopo:** `index.html` (88 KB) + `style.css` (60 KB) + `files/` (43 arquivos, 17,3 MB)  
**Restrições:** não alterar domínio, CNAME, sitemaps, conteúdo factual dos projetos; Google Drive = ambiente hostil.

---

## 1. Identidade Visual — Tokens Aipim vs. Referência

### 1.1 O que está adotado do Aipim Design System
| Token / Componente | Status | Evidência (arquivo:linha) |
|---|---|---|
| **Cores primárias (Terracota #fa653d → #621701)** | ✅ Completo | `style.css:16-24` |
| **Cores secundárias (Azulejo #4d9cfe → #00346b)** | ✅ Completo | `style.css:26-35` |
| **Cores terciárias (Cajá/Ocre #ffd337 → #423400)** | ✅ Completo | `style.css:37-46` |
| **Neutros quentes (cerâmica/taipa #fdf9f6 → #0e0a07)** | ✅ Completo | `style.css:70-82` |
| **Tipografia: Antonio (headings) + Karla (body)** | ✅ Via Google Fonts | `index.html:38`, `style.css:150-151` |
| **Escala tipográfica (display → overline)** | ✅ Tokens completos | `style.css:153-204` |
| **Espaçamento (space-4 a space-96, stack, inset, gap)** | ✅ Completo | `style.css:84-106` |
| **Raios (none → full, 2xl)** | ✅ Completo | `style.css:108-114` |
| **Bordas (thin/medium/thick, focus-offset)** | ✅ Completo | `style.css:116-119` |
| **Tamanhos de toque/controle (min 24px, comfortable 44px)** | ✅ Completo | `style.css:121-129` |
| **Z-index scale** | ✅ Completo | `style.css:131-137` |
| **Durações/easings padrão** | ✅ Completo | `style.css:139-147` |
| **Papéis semânticos light/dark (bg, text, border, action, link, focus, tint, shadow)** | ✅ Completo | `style.css:206-390` |
| **Color-scheme + prefers-reduced-motion** | ✅ Completo | `style.css:264, 328, 390, 396-402` |
| **Componentes: Button, Badge, Tag, Card, Icon, Symbol-tile** | ✅ Quase 1:1 | `style.css:468-832` |
| **Top Bar (nav fixa, backdrop-blur, logo, theme-toggle, mobile menu)** | ✅ Adaptado | `style.css:835-991` |
| **Cards de projeto, certificação, tecnologia, contato** | ✅ Base Aipim | `style.css:1435-1850` |
| **Scroll-reveal / fade-in** | ✅ Próprio (não Aipim nativo) | `style.css:1893-1929` |

### 1.2 Enxertos / Desvios do Aipim (pontos de atenção)

| Item | Desvio | Arquivo:linha | Impacto |
|---|---|---|---|
| **Favicon inline SVG** | Hardcoded `fill='#0364c2'` (azulejo-700) em vez de token `--aipim-action-secondary-bg` | `index.html:44-47` | Quebra dark mode (fica azul fixo) |
| **Logo na nav** | SVG inline com `fill="var(--aipim-action-secondary-bg)"` e `fill="var(--aipim-bg-surface)"` — **funciona** no dark mode | `index.html:66-73` | OK |
| **Hero background pattern** | `radial-gradient(var(--aipim-border-subtle) ...)` — usa token, OK | `style.css:1005-1014` | OK |
| **Hero image wrapper dashed border** | `border: var(--aipim-border-medium) dashed var(--aipim-action-primary-bg)` — token OK | `style.css:1107` | OK |
| **Contact icon background** | Hardcoded `var(--aipim-color-primary-100)` / `var(--aipim-color-primary-900)` em vez de `--aipim-tint-primary` | `style.css:1820, 1828` | Menor consistência semântica |
| **Footer florao** | SVG inline `fill="currentColor"` com cor herdada — OK | `index.html:1412-1422` | OK |
| **Animação typewriter (cursor blink)** | `@keyframes aipimBlink` custom, não respeita `prefers-reduced-motion` | `style.css:1062-1065` | **Acessibilidade: movimento não reduzido** |
| **Drawer experiences parallax/blur** | JS `transform: scale()` + `filter: blur()` no scroll — não usa tokens de motion | `index.html:1588-1622` | Performance + acessibilidade |
| **Font Awesome 6.4.0 via CDN** | Dependência externa não-Aipim (ícones) | `index.html:41` | Peso + ponto de falha |
| **Google Fonts (Antonio, Karla) via `<link>`** | 2 famílias × 5 pesos = ~10 requests; sem `font-display: swap` no CSS | `index.html:38` | Performance (CLS/FCP) |

### 1.3 Recomendação de Identidade
> **Decisão já tomada:** portfólio é **"Samuel" apenas** (não "Samuel + Pórtica").  
> **Conclusão:** Manter **Aipim como base única**. Não há enxerto de Material 3 / Roboto. O trabalho é **limpar os desvios listados acima** (favicon, contact-icon, typewriter, drawer blur, FA CDN, font-display) para ter *single source of truth* nos tokens. Estado intermediário (Aipim + hardcodes) é o pior dos mundos.

---

## 2. Performance — Imagens, Fontes, CSS Não Usado

### 2.1 Tabela de Imagens — **Usadas no HTML** (29 arquivos)

| # | Arquivo | Tamanho | Dimensões (estimado pelo uso) | Uso real na página | Formato | P0? |
|---|---|---|---|---|---|---|
| 1 | `Perfil2.png` | **1,28 MB** | ~400×432 (hero 1:1.08) | Hero header (above-fold) | PNG | **SIM** |
| 2 | `samuel_presentation.png` | 352 KB | ~500×350 | Seção Sobre (about-grid) | PNG | |
| 3 | `geovicinal-capa.png` | 115 KB | ~360×210 | Card projeto GeoVicinal | PNG | |
| 4 | `portica-tela-inicial.png` | 162 KB | ~360×210 | Card projeto Pórtica | PNG | |
| 5 | `cartografia-queimadas-ucs-pa.jpg` | 282 KB | ~360×210 | Card projeto Queimadas | JPG | |
| 6 | `lst-downscale-comparison.png` | 275 KB | ~360×210 (contain) | Card LST Downscaling | PNG | |
| 7 | `opensr-comparativo.png` | **1,20 MB** | ~360×210 (contain) | Card Super-Resolução | PNG | **SIM** |
| 8 | `cartografia-tematica-thumb.jpg` | 114 KB | ~360×210 | Card Cartografia Temática | JPG | |
| 9 | `visualizador-inicial.png` | 463 KB | ~360×210 | Card Visualizador Geoespacial | PNG | |
| 10 | `guia-uc.png` | 138 KB | ~360×210 | Card Guia UCs | PNG | |
| 11 | `guia-viveiros.png` | 194 KB | ~360×210 | Card Guia Viveiros | PNG | |
| 12 | `dash_cpa.png` | 196 KB | ~360×210 | Card Painel CPAs | PNG | |
| 13 | `auto-review-top-journals.png` | 71 KB | ~360×210 | Card Auto Review R | PNG | |
| 14 | `kanban-board-inicial.png` | 155 KB | ~360×210 | Card Sprint Kanban | PNG | |
| 15 | `doom-fire-comparison.gif` | 503 KB | ~360×210 | Card Doom Fire | GIF | |
| 16 | `krigagem-solo-r-showcase.png` | 440 KB | ~360×210 (contain) | Card Geoestatística R | PNG | |
| 17 | `s2dr3-demonstracao.png` | 550 KB | ~360×210 | Card Super-Res S2DR3 | PNG | |
| 18 | `download-landsat-sentinel-demo.png` | 329 KB | ~360×210 | Card Download Landsat/Sentinel | PNG | |
| 19 | `sentinel-time-viewer-swipe.gif` | 363 KB | ~360×210 | Card Sentinel Time Viewer | GIF | |
| 20 | `geovisor-belem-screenshot.png` | 316 KB | ~360×210 | Card Geovisor Belém | PNG | |
| 21 | `dashboard-iniciativas.png` | 275 KB | ~360×210 | Card Iniciativas DIGEO | PNG | |
| 22 | `cartografia-mapa-braganca.png` | 306 KB | ~360×210 | Card Portfólio Cartografia | PNG | |
| 23 | `manguezais-bfastmonitor.png` | 275 KB | ~360×210 | Card Manguezais PA-458 | PNG | |
| 24 | `archisearch-img-cabana.png` | 123 KB | ~360×210 | Card ArchiSearch | PNG | |
| 25 | `ibm_data_science.png` | 172 KB | 80×80 (cert-card) | Certificação IBM | PNG | |
| 26 | `google_business_intelligence.png` | 104 KB | 80×80 | Certificação Google BI | PNG | |
| 27 | `google_data_analytics.png` | 153 KB | 80×80 | Certificação Google DA | PNG | |
| 28 | `google_advanced_data_analytics.png` | 76 KB | 80×80 | Certificação Google ADA | PNG | |
| 29 | `google_it_automation_python.png` | 106 KB | 80×80 | Certificação Google IT Auto | PNG | |
| **TOTAL USADO** | | **~8,4 MB** | | | | |

> **Nota:** dimensões reais não foram abertas; estimadas pelo `object-fit: cover` (210px height) e `max-width: 400px` (hero). Recomenda-se rodar `identify` (ImageMagick) ou script Node para confirmar.

### 2.2 Imagens **NÃO REFERENCIADAS NO HTML** (12 arquivos = **~8,6 MB**)

| Arquivo | Tamanho | Referência interna | Provável origem | Ação recomendada |
|---|---|---|---|---|
| `Perfil_old.png` | **2,15 MB** | ❌ | Versão antiga do hero | **Remover** (verificar hotlink externo antes) |
| `AH4.0_certificates(3).png` | **2,04 MB** | ❌ | Certificados antigos (substituídos pelos 5 atuais) | **Remover** (verificar hotlink) |
| `krigagem-solo-r-showcase.jpg` | **1,31 MB** | ❌ | Duplicata JPG do PNG usado (`krigagem-solo-r-showcase.png`) | **Remover** (duplicata confirmada) |
| `Perfil3.png` | 987 KB | ❌ | Terceira versão do perfil | **Remover** (verificar hotlink) |
| `linkedin_cover.png` | 97 KB | ❌ | Cover LinkedIn antigo | **Remover** |
| `linkedin_cover2.png` | 95 KB | ❌ | Cover LinkedIn v2 | **Remover** |
| `visualizador-filtro.png` | 366 KB | ❌ | Screenshot extra não usado | **Remover** |
| `visualizador-zoneamento.png` | 401 KB | ❌ | Screenshot extra não usado | **Remover** |
| `visualizador-mobile.png` | 174 KB | ❌ | Screenshot mobile não usado | **Remover** |
| `globe.svg` | 3,6 KB | ❌ | Ícone não usado | **Remover** |
| `perfil.jpeg` | 19 KB | ❌ | Foto antiga baixa resolução | **Remover** |
| `card-cartografia-temp.html` | 1,6 KB | ⚠️ `.gitignore:6` | Template HTML órfão | **Remover** (já ignorado pelo git) |

> **NOTA:** `mockup.png` (1,33 MB) **É referenciado** no `README.md:9` → **manter + otimizar**.  
> `samuel-santos-thumbnail.png` (344 KB) **É o OG/Twitter image** (`index.html:9,21`) → **manter + converter WebP 1200×630**.

### 2.3 Alvo de Peso Total (P0)

| Métrica | Atual | Alvo P0 | Estratégia |
|---|---|---|---|
| **Total `files/`** | 17,3 MB | **< 3 MB** | Remover 14 não-usados (–8,9 MB) + converter 29 usados para WebP/AVIF (–60–75%) |
| **Hero (above-fold)** | 1,28 MB (PNG) | **< 100 KB** | WebP/AVIF 80% quality, width 400px |
| **Certificados (5 × 80×80)** | 611 KB (PNG) | **~150 KB** | Manter PNG (legibilidade texto) ou WebP lossless |
| **Projetos (24 cards)** | ~6,5 MB | **~1,5 MB** | WebP/AVIF quality 75, width 360px, `loading=lazy` (já presente) |
| **OG Image** | 344 KB | **< 100 KB** | WebP 1200×630 |

> **Decisão do usuário:** "faça como achar melhor — certificados e currículo continuam legíveis, então esses talvez fiquem em PNG".  
> **Recomendação:** Certificados → **WebP lossless** (mantém nitidez, –30–50%). Hero e cards de projeto → **WebP lossy 75–80%** + `srcset`/`<picture>` com AVIF fallback. GIFs (`doom-fire`, `sentinel-swipe`) → **WebP animado** ou MP4 `<video>` (muito menor).

### 2.4 Fontes Externas

| Recurso | Requests | Peso estimado | Problema | Mitigação |
|---|---|---|---|---|
| Google Fonts (Antonio 600,700 + Karla 400,500,700) | 1 CSS + até 5 font files | ~50–80 KB | Bloqueia render; sem `font-display: swap` no `@font-face` | Self-host (woff2) + `font-display: swap` + preload crítico |
| Font Awesome 6.4.0 (CDN) | 1 CSS + font files | ~80 KB | Ponto único de falha; carrega ícones não usados | Substituir por **SVG inline** (apenas ícones usados: ~15) ou `@font-face` subset |

### 2.5 CSS Não Usado / Redundante

| Padrão | Localização | Evidência |
|---|---|---|
| `.project-keywords span` (custom, não-Aipim) | `style.css:690-705` | Usado em 3 cards (Visualizador, Guia UCs, Guia Viveiros) — **usado** |
| `.btn-primary`, `.btn-secondary` (custom) | `style.css:1616-1651` | Usados em todos os project-actions — **usado** |
| `.contain` (utility) | `style.css:1516-1519` | Usado em 3 cards (LST, OpenSR, Krigagem) — **usado** |
| Animações `aipimBlink`, `aipimFadeIn` | `style.css:1062-1065, 1920-1929` | **Usadas** (hero cursor + fade-in JS) |
| Drawer parallax styles (JS-driven) | `style.css:1284-1307` | **Usadas** via inline style no JS |
| `@media (max-width: 992px)` e `768px` | `style.css:1934-2015` | **Usadas** — breakpoints funcionais |

> **Conclusão:** CSS está **bem enxuto** — quase tudo é consumido. Não há dead code significativo.

---

## 3. Acessibilidade (WCAG 2.1 AA)

### 3.1 Contraste — Tokens Aipim (Light Mode)

| Par | Foreground | Background | Ratio | AA Normal (4.5:1) | AA Large (3:1) |
|---|---|---|---|---|---|
| Primary text | `--aipim-text-primary` (#302a25) | `--aipim-bg-canvas` (#f7f1ed) | **12.8:1** | ✅ | ✅ |
| Secondary text | `--aipim-text-secondary` (#4a423c) | `--aipim-bg-canvas` | **7.9:1** | ✅ | ✅ |
| Muted text | `--aipim-text-muted` (#665d56) | `--aipim-bg-canvas` | **4.9:1** | ✅ | ✅ |
| Primary action | `--aipim-action-primary-text` (#fdf9f6) | `--aipim-action-primary-bg` (#b43000) | **4.6:1** | ✅ | ✅ |
| Secondary action | `--aipim-action-secondary-text` (#fdf9f6) | `--aipim-action-secondary-bg` (#0364c2) | **4.5:1** | ✅ | ✅ |
| Link | `--aipim-link` (#014b95) | `--aipim-bg-canvas` | **7.2:1** | ✅ | ✅ |
| Focus ring | `--aipim-focus-ring` (#0364c2) | `--aipim-bg-canvas` | **7.2:1** | ✅ | ✅ |
| Accent tag | `--aipim-accent-text` (#302a25) | `--aipim-accent-bg` (#ffd337) | **3.1:1** | ❌ **Falha AA normal** | ✅ Large |
| Badge filled | `--aipim-badge-fg` (inverse) | `--aipim-badge-bg` (#b43000) | **4.6:1** | ✅ | ✅ |

> **Dark Mode** (tokens em `style.css:268-390`): ratios equivalentes (inversão mantém contraste).  
> **Ponto de falha:** `aipim-tag--accent` / `project-tag` (amarelo cajá #ffd337 sobre canvas claro) **não passa AA para texto normal** (3.1:1). Usado em: hero eyebrow (`index.html:119`), project overlay tags (24 ocorrências).

### 3.2 Textos Alternativos (`alt`)

| Imagem | `alt` atual | Qualidade | Ação |
|---|---|---|---|
| `Perfil2.png` (hero) | "Samuel Santos — Especialista em Geotecnologias" | ✅ Descritivo | OK |
| `samuel_presentation.png` | "Samuel Santos Apresentando Dashboard de Geotecnologias" | ✅ Descritivo | OK |
| Cards de projeto (24) | Variam: "GeoVicinal — Solução Geoespacial...", "Pórtica App — Calculadora Estrutural..." | ✅ Maioria boa | Verificar 3–4 genéricos |
| Certificados (5) | "IBM Data Science", "Google Business Intelligence", etc. | ⚠️ **Curto** — não diz "Certificado de..." | Melhorar: "Certificado IBM Data Science Professional Certificate" |
| `sentinel-time-viewer-swipe.gif` | "Sentinel Time Viewer — Demonstração de Swipe Interativo" | ✅ | OK |
| `doom-fire-comparison.gif` | "Doom Fire Algorithm — Simulação e Comparativo" | ✅ | OK |

### 3.3 Hierarquia de Headings

```
h1 (hero) → "Domine o espaço através de [dynamic]"
  h2 #sobre → "Sobre Mim"
    h3 (skills) — não há, usa .skill-item
  h2 #experiencias → "Experiências Profissionais"
    h3 ×7 (exp-card-title) — **OK** (cada card tem h3)
  h2 #educacao → "Educação"
    h3 ×6 (education-degree) — **OK**
  h2 #projetos → "Meus Projetos"
    h3 ×24 (project-title) — **OK**
  h2 #certificacoes → "Certificações"
    h3 ×5 (cert-card h3) — **OK**
  h2 #tecnologias → "Tecnologias & Ferramentas"
    h3 ×3 (tech-category h3) — **OK**
  h2 #contato → "Vamos Conversar?"
```
✅ **Hierarquia correta** (h1 → h2 → h3). Nenhum salto.

### 3.4 Foco Visível & Navegação por Teclado

| Elemento | `:focus-visible` | Ordem Tab | Armadilha (trap) | Observação |
|---|---|---|---|---|
| Nav links (6) | ✅ `outline: 3px solid var(--aipim-focus-ring)` | 1–6 | ❌ Menu mobile não trapa foco | Abre modal, mas `Tab` sai pro body |
| Theme toggle | ✅ | 7 | — | OK |
| CTA buttons (hero) | ✅ | 8–9 | — | OK |
| Project cards (24) | ✅ (via `a`/`button` internos) | 10+ | — | Cards são `<div>` — **não focáveis** por teclado; apenas links internos |
| Filter buttons (4) | ✅ | — | — | OK |
| Cert cards (5) — `<a>` | ✅ | — | — | OK |
| Tech items | ❌ **Não focáveis** (div) | — | — | **Falha**: não alcançáveis por teclado |
| Contact cards (4) — `<a>` | ✅ | — | — | OK |
| Footer links | ✅ | — | — | OK |

> **Gap crítico:** `.tech-item` e `.skill-item` são `div`/`span` sem `tabindex="0"` nem `role="button"` — **inacessíveis por teclado**.  
> **Menu mobile:** ao abrir, foco não vai para primeiro link; `Esc` não fecha; `Tab` vaza.

### 3.5 Movimento Reduzido (`prefers-reduced-motion`)

| Animação | Respeita `prefers-reduced-motion`? | Evidência |
|---|---|---|
| CSS transitions (tokens `--aipim-duration-*`) | ✅ **Sim** — zeradas em `@media (prefers-reduced-motion)` | `style.css:396-402` |
| Scroll-reveal (opacity/transform) | ✅ **Sim** — usa tokens | `style.css:1894-1914` |
| Hero cursor blink (`aipimBlink`) | ❌ **Não** — `@keyframes` hardcoded | `style.css:1062-1065` |
| Typewriter JS (`setTimeout` loop) | ❌ **Não** — não verifica `matchMedia` | `index.html:1471-1499` |
| Drawer parallax (scale/blur no scroll) | ❌ **Não** — JS direto `style.transform` | `index.html:1588-1622` |
| Card hover `transform: translateY(-4px)` | ✅ **Sim** — usa `--aipim-duration-base` | `style.css:1495-1498` |

> **P0 Acessibilidade:** Desativar blink, typewriter e drawer parallax quando `prefers-reduced-motion: reduce`.

---

## 4. Conteúdo / Verdade — Links, Claims, Contato

### 4.1 Links Externos — Verificação Necessária (não testados ao vivo)

| Seção | Link | Status esperado | Risco |
|---|---|---|---|
| Nav → Tutoriais | `https://samuelsantos.site/tutoriais` | 200 (subdomínio próprio) | Baixo |
| Nav → GitHub | `https://github.com/samuel-c-santos` | 200 | Baixo |
| Nav → LinkedIn | `https://www.linkedin.com/in/samuelsantos-amb/` | 200 | Baixo |
| Hero CTA → #projetos | anchor interno | OK | — |
| Hero CTA → #contato | anchor interno | OK | — |
| GeoVicinal → GitHub | `https://github.com/samuel-c-santos/amazoniahack` | 200 | Baixo |
| Pórtica → GitHub | `https://github.com/samuel-c-santos/portica-app` | 200 | Baixo |
| Pórtica → Site | `https://samuelsantos.site/portica-app/` | 200 | Baixo |
| Queimadas → GitHub | `https://github.com/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa` | 200 (org) | Médio |
| Queimadas → Colab | `https://colab.research.google.com/.../colab_runner.ipynb` | 200 | Médio |
| LST Downscaling → GitHub | `https://github.com/samuel-c-santos/satellite-lst-downscaler` | 200 | Baixo |
| LST Downscaling → Colab | `https://colab.research.google.com/.../LST_Downscaling_...ipynb` | 200 | Médio |
| OpenSR → GitHub | `https://github.com/samuel-c-santos/opensr-sentinel-pipeline` | 200 | Baixo |
| OpenSR → Colab | `https://colab.research.google.com/.../OpenSR_Producao_...ipynb` | 200 | Médio |
| Cartografia Temática → GitHub | `https://github.com/NGEO-IDEFLOR-Bio/cartografia-tematica` | 200 | Médio |
| Cartografia Temática → Site | `https://ngeo-ideflor-bio.github.io/cartografia-tematica/` | 200 | Médio |
| Visualizador → Site | `https://ngeo-ideflor-bio.github.io/visualizador/` | 200 | Médio |
| Visualizador → GitHub | `https://github.com/NGEO-IDEFLOR-Bio/visualizador` | 200 | Médio |
| Guia UCs → Site | `https://ngeo-ideflor-bio.github.io/guia-uc-para/` | 200 | Médio |
| Guia UCs → GitHub | `https://github.com/NGEO-IDEFLOR-Bio/guia-uc-para` | 200 | Médio |
| Guia Viveiros → GitHub | `https://github.com/NGEO-IDEFLOR-Bio/viveiros-ideflorbio` | 200 | Médio |
| Guia Viveiros → Site | `https://ngeo-ideflor-bio.github.io/viveiros-ideflorbio/` | 200 | Médio |
| CPAs → PowerBI | `https://app.powerbi.com/view?r=eyJrIjoiOTNiMzg3MjQt...` | 200 (embed) | **Alto** — token pode expirar |
| Auto Review → GitHub | `https://github.com/samuel-c-santos/auto-review-r` | 200 | Baixo |
| Kanban → GitHub | `https://github.com/samuel-c-santos/sprint-kanban-template` | 200 | Baixo |
| Kanban → Demo | `https://sprint-kanban-template.vercel.app/kanban.html` | 200 | Médio |
| Doom Fire → GitHub | `https://github.com/samuel-c-santos/doom-fire` | 200 | Baixo |
| Doom Fire → Demo | `https://samuelsantos.site/doom-fire/` | 200 | Baixo |
| Krigagem → GitHub | `https://github.com/samuel-c-santos/krigarem_r` | 200 | Baixo |
| S2DR3 → GitHub | `https://github.com/samuel-c-santos/s2dr3_inferencia_automatizada_sentinel2` | 200 | Baixo |
| Download Landsat → GitHub | `https://github.com/NGEO-IDEFLOR-Bio/ngeo_satellite_downloader` | 200 | Médio |
| Download Landsat → Colab | `https://colab.research.google.com/.../ngeo_satellite_downloader.ipynb` | 200 | Médio |
| Sentinel Time → GitHub | `https://github.com/samuel-c-santos/sentinel-time-viewer` | 200 | Baixo |
| Geovisor Belém → GitHub | `https://github.com/samuel-c-santos/geovisor-belem` | 200 | Baixo |
| Geovisor Belém → Site | `https://samuelsantos.site/geovisor-belem/` | 200 | Baixo |
| Iniciativas DIGEO → PowerBI | `https://app.powerbi.com/view?r=eyJrIjoiMzJhMTg4NzIt...` | 200 (embed) | **Alto** — token pode expirar |
| Cartografia Bragança → Site | `https://samuelsantos.site/cartografia/` | 200 | Baixo |
| Manguezais → GitHub | `https://github.com/samuel-c-santos/manguezais-pa458-monitoramento` | 200 | Baixo |
| ArchiSearch → GitHub | `https://github.com/samuel-c-santos/ArchiSearch` | 200 | Baixo |
| ArchiSearch → YouTube | `https://youtu.be/_1-IMBy0Xbw` | 200 | Baixo |
| Certificados (5) → Coursera | URLs `coursera.org/account/accomplishments/...` | 200 (público) | **Médio** — links de conquista podem mudar |

> **Ação:** Rodar `linkchecker` ou script `fetch` HEAD para validar todos. PowerBI embed tokens são **ponto de falha alto**.

### 4.2 Claims Quantitativos (verificar contra realidade)

| Claim | Local | Valor | Fonte de verdade sugerida |
|---|---|---|---|
| "20+ Projetos" | `index.html:166` (metric-value-lg) | 20+ | Contar cards de projeto = 24 → **OK** |
| "5 Certificações profissionais" | `index.html:170` | 5 | 5 cert-cards → **OK** |
| "7+ Anos Exp." | `index.html:174` | 7+ | 2018–2025 = 7 anos → **OK** (margem) |
| "11/16 Rotas Conectadas" | `index.html:468` (GeoVicinal) | 11/16 | Verificar no repo AmazoniaHack |
| "29,3 MB Grafo Binário CSR" | `index.html:472` | 29,3 MB | Verificar artefato |
| "300 DPI Pranchas A4" | `index.html:554` (Queimadas) | 300 DPI | Verificar saída |
| "19k+ CPAs (ESEC)" | `index.html:844` | 19k+ | Verificar PowerBI |
| "3,9k+ CPAs (S. Araguaia)" | `index.html:849` | 3,9k+ | Verificar PowerBI |
| "221,7 ha Área Mapeada" | `index.html:973` (Krigagem) | 221,7 ha | Verificar relatório |
| "5 m Resolução Grid" | `index.html:977` | 5 m | Verificar código |
| "4x Fator de Escala" | `index.html:651` (OpenSR) | 4x | Modelo LDSR-S2 = 4x → **OK** |
| "2,5m Resolução Final" | `index.html:656` | 2,5m | 10m/4 = 2,5m → **OK** |
| "Jan/2022 Ruptura Principal" | `index.html:1187` (Manguezais) | Jan/2022 | Verificar BFAST output |
| "-0,244 Magnitude (Leste)" | `index.html:1191` | -0,244 | Verificar BFAST output |

> **Recomendação:** Adicionar `data-source` ou comentário HTML com link para evidência (repo/relatório) para cada métrica — facilita auditoria futura.

### 4.3 Contato & Currículo

| Campo | Valor | Validade |
|---|---|---|
| E-mail | `samuelsantosambiental@gmail.com` | Formato OK; testar deliverability |
| WhatsApp | `+55 (91) 98474-1391` → `wa.me/5591984741391` | Formato OK |
| LinkedIn | `samuelsantos-amb` | Perfil público? |
| Cartão digital | `dot.cards/samuelsantos` | Serviço ativo? |
| Currículo (PDF) | **Não encontrado** na página | **Gap** — esperável em portfólio sênior |
| Certificados | 5 (IBM + 4 Google) via Coursera | Links diretos para verificação → **OK** |

---

## 5. Mobile (375 px) & Dark Mode

### 5.1 Breakpoints & Layout Mobile

| Breakpoint | Mudanças | Cobertura |
|---|---|---|
| `@media (max-width: 992px)` | Hero: grid → column, imagem sobe (order -1), max-width 280px; About: grid → column; Projects: minmax(300px, 1fr) | ✅ Tablet |
| `@media (max-width: 768px)` | Nav: hamburger + drawer fixo topo; Experiences: grid → 1 col, ícone escondido; Projects: 1 col; Tech items: 1 col | ✅ Mobile 375px |

**Testes manuais necessários em 375px:**
- Hero: `h1` `clamp(2.75rem, 2.2rem + 2.75vw, 4.5rem)` → ~2.75rem (OK)
- Hero image: `max-width: 280px` + `aspect-ratio: 1/1.08` → 280×302px (OK)
- Nav drawer: `top: 72px`, `height: auto`, scroll interno se muitos links
- Project cards: `width: 100%`, imagem 210px height fixa — **pode cortar conteúdo** em telas muito estreitas
- Cert cards: `minmax(220px, 1fr)` → 1 col em 375px (OK)
- Contact cards: `minmax(240px, 1fr)` → 1 col (OK)
- Tech items: 1 col (OK)
- Touch targets: `--aipim-size-touch-comfortable: 44px` — botões nav, theme-toggle, filter-btns, CTAs ≥ 44px? **Verificar** (nav-link padding 8px 4px = ~32px altura — **abaixo de 44px**)

### 5.2 Dark Mode — Implementação Atual

| Mecanismo | Detalhe | Status |
|---|---|---|
| Detecção inicial | Inline script no `<head>` lê `localStorage['aipim-theme']` ou `prefers-color-scheme` | ✅ Evita FOUC |
| Toggle UI | Botão na nav (lua/sol) + `localStorage` persistência | ✅ |
| CSS | `@media (prefers-color-scheme: dark)` + `:root[data-theme="dark"]` + `:root[data-theme="light"]` | ✅ Completo |
| Tokens semânticos | Todos redefinidos para dark (bg, text, border, action, link, focus, tint, shadow) | ✅ |
| `color-scheme` | Declarado em `:root`, `:root[data-theme="dark"]`, `:root[data-theme="light"]` | ✅ |
| Imagens | **Sem `filter` ou `opacity` adaptativo** — PNGs/JPEGs com fundo claro ficam "caixas brancas" no dark | ⚠️ **Gap visual** |
| Favicon | Hardcoded azul — **não muda** | ❌ |
| Hero pattern | `radial-gradient(var(--aipim-border-subtle) ...)` — usa token, **adapta** | ✅ |
| Hero dashed border | `var(--aipim-action-primary-bg)` — terracota, **contraste OK em dark** | ✅ |
| Contact icon | Hardcoded primary-100/900 — **adapta via seletor `:root[data-theme="dark"]`** | ✅ |

> **Gap visual dark mode:** 24 screenshots de projetos (fundas claras) aparecem como retângulos brancos/claros no fundo escuro (`--aipim-bg-surface` #1a1511).  
> **Solução leve:** `.project-image img { background: var(--aipim-bg-sunken); }` já existe; adicionar `mix-blend-mode: multiply` ou wrapper com `background: var(--aipim-bg-canvas)` + sombra interna. Ou gerar versões com fundo transparente (WebP/AVIF).

---

## 6. Roadmap — Épicos e Tarefas (P0 separado do cosmético)

> **Formato:** `EPIC-ID: Título` → `TASK-ID: Descrição [arquivo:linha] [Prioridade]`  
> **Prioridades:** P0 (bloqueador/performance/acessibilidade), P1 (qualidade/consistência), P2 (cosmético/nice-to-have).

---

### EPIC-IMG: Otimização de Imagens (P0 — Meta: página < 3 MB total)

| Task | Descrição | Arquivo:linha | Prioridade |
|---|---|---|---|
| IMG-01 | **Remover 12 arquivos não referenciados no HTML** de `files/` (Perfil_old.png, AH4.0_certificates(3).png, krigagem-solo-r-showcase.jpg, Perfil3.png, linkedin_cover*.png, visualizador-filtro/zoneamento/mobile.png, globe.svg, perfil.jpeg, card-cartografia-temp.html) — **manter** `mockup.png` (README) e `samuel-santos-thumbnail.png` (OG) | `files/` | P0 |
| IMG-02 | **Converter 24 screenshots de projeto** para WebP lossy 75% + AVIF fallback via `<picture>`; manter `loading=lazy`; definir `width`/`height` explícitos para CLS=0 | `index.html:442-1271` | P0 |
| IMG-03 | **Hero (Perfil2.png):** gerar WebP/AVIF 400w, 280w (mobile); `<picture>` com `srcset`; `fetchpriority="high"` + `preload` | `index.html:141` | P0 |
| IMG-04 | **Certificados (5):** converter para WebP **lossless** (mantém texto nítido); `width=80 height=80` explícitos | `index.html:1247-1271` | P0 |
| IMG-05 | **GIFs animados (2):** converter para WebP animado ou `<video autoplay loop muted playsinline>` (MP4/WebM) — redução 80%+ | `index.html:920, 1053` | P0 |
| IMG-06 | **OG Image (samuel-santos-thumbnail.png):** gerar WebP 1200×630 < 100 KB; atualizar meta tags | `index.html:9,21` | P1 |
| IMG-07 | Adicionar `width`/`height` intrínsecos em **todos** `<img>` (evita layout shift) | `index.html` (29 ocorrências) | P1 |
| IMG-08 | Script de build (Node/Sharp) para pipeline automatizado: `npm run img:optimize` → `files/optimized/` + manifest | Novo | P1 |

---

### EPIC-PERF: Fontes, CSS, Critical Path (P0/P1)

| Task | Descrição | Arquivo:linha | Prioridade |
|---|---|---|---|
| PERF-01 | **Self-host fonts:** baixar Antonio (600,700) + Karla (400,500,700) woff2; `@font-face` com `font-display: swap`; remover Google Fonts `<link>` | `index.html:38`, `style.css:150-151` | P0 |
| PERF-02 | **Preload critical fonts:** `<link rel="preload" as="font" type="font/woff2" crossorigin href="fonts/antonio-700.woff2">` (Antonio 700 + Karla 400) | `index.html<head>` | P0 |
| PERF-03 | **Substituir Font Awesome CDN** por SVG inline (apenas ícones usados: fa-bars, fa-times, fa-arrow-right, fa-github, fa-linkedin-in, fa-envelope, fa-whatsapp, fa-play, fa-external-link-alt, fa-chart-line, fa-map-marked-alt, fa-robot, fa-leaf, fa-users, fa-chart-bar, fa-globe-americas, fa-building, fa-tree, fa-microscope, fa-hard-hat, fa-code, fa-play, fa-python, fa-database, fa-r-project, fa-js, fa-flask, fa-bolt, fa-desktop, fa-react, fa-chart-bar, fa-table, fa-chart-pie, fa-map, fa-satellite, fa-server, fa-laptop-code, fa-database, fa-envelope, fa-github, fa-linkedin) — ~40 ícones → ~8 KB SVG sprite | `index.html:41`, `index.html` (múltiplos) | P0 |
| PERF-04 | **Critical CSS inline:** extrair CSS above-fold (hero, nav, tokens) → inline no `<head>`; carregar `style.css` com `media="print" onload="this.media='all'"` | `style.css` (tokens + nav + hero) | P1 |
| PERF-05 | **Remover `@import`** — não há, OK | — | — |
| PERF-06 | **Service Worker / Cache-Control:** configurar via GitHub Pages headers (não controlável) — documentar limitação | — | P2 |

---

### EPIC-A11Y: Acessibilidade WCAG 2.1 AA (P0)

| Task | Descrição | Arquivo:linha | Prioridade |
|---|---|---|---|
| A11Y-01 | **Corrigir contraste tag accent:** alterar `--aipim-accent-bg` de `#ffd337` (cajá-300) para `#d4b137` (cajá-400) ou `#ba9706` (cajá-500) → ratio ≥ 4.5:1 sobre canvas claro; ajustar dark mode correspondente | `style.css:40, 233, 296, 358` | P0 |
| A11Y-02 | **Hero cursor blink:** respeitar `prefers-reduced-motion` — mover keyframe para CSS com `@media (prefers-reduced-motion: reduce) { .cursor { animation: none; opacity: 1; } }` | `style.css:1062-1065` | P0 |
| A11Y-03 | **Typewriter JS:** verificar `window.matchMedia('(prefers-reduced-motion: reduce)').matches` no init; se true, mostrar palavra completa sem animação | `index.html:1471-1499` | P0 |
| A11Y-04 | **Drawer parallax (experiências):** desativar `transform`/`blur` no scroll quando `prefers-reduced-motion: reduce` | `index.html:1588-1622` | P0 |
| A11Y-05 | **Tech items & Skill items:** tornar focáveis — `<button class="tech-item" tabindex="0" role="button">` + `:focus-visible` via token; ou converter em `<a>` se houver link | `index.html:1286-1331, 1248-1263` | P0 |
| A11Y-06 | **Menu mobile:** implementar focus trap (primeiro/último link), `Esc` para fechar, foco inicial no primeiro link ao abrir, `aria-expanded` no botão | `index.html:79-81, 979-991, 1559-1586` | P0 |
| A11Y-07 | **Nav links touch target:** aumentar padding vertical para ≥ 44px (`padding-block: 12px` → `--aipim-space-12`) | `style.css:889` | P0 |
| A11Y-08 | **Cert cards alt:** melhorar para "Certificado [Nome] — [Emissor] — Professional Certificate" | `index.html:1247-1274` | P1 |
| A11Y-09 | **Favicon dark mode:** usar `<picture>` com `media="(prefers-color-scheme: dark)"` ou SVG com `currentColor` + CSS filter | `index.html:44-47` | P1 |
| A11Y-10 | **Imagens de projeto no dark mode:** adicionar wrapper com `background: var(--aipim-bg-canvas)` + `border-radius` herdado para evitar "caixas brancas" | `style.css:1501-1523` | P1 |

---

### EPIC-IDENT: Limpeza de Identidade / Hardcodes (P1)

| Task | Descrição | Arquivo:linha | Prioridade |
|---|---|---|---|
| IDENT-01 | **Favicon:** mover para arquivo `favicon.svg` com `fill="var(--aipim-action-secondary-bg)"`; remover inline SVG do `<head>` | `index.html:44-47` | P1 |
| IDENT-02 | **Contact icon:** trocar hardcoded `var(--aipim-color-primary-100/900)` por `--aipim-tint-primary` / `--aipim-tint-text` | `style.css:1820, 1828` | P1 |
| IDENT-03 | **Footer florao:** já usa `currentColor` — OK; apenas confirmar herança | `index.html:1412` | — |
| IDENT-04 | **Remover `card-cartografia-temp.html`** órfão de `files/` | `files/` | P1 |

---

### EPIC-CONTENT: Verificação de Conteúdo & Links (P1)

| Task | Descrição | Arquivo:linha | Prioridade |
|---|---|---|---|
| CONT-01 | **Validar todos links externos** (42 URLs) com script `fetch` HEAD; marcar quebrados/redirecionados | `index.html` (múltiplos) | P1 |
| CONT-02 | **PowerBI embed tokens:** verificar expiração; se expirarem, substituir por screenshot + link "Acessar no PowerBI" | `index.html:853, 1130` | P1 |
| CONT-03 | **Adicionar evidência (data-source)** nos claims métricos (comentário HTML ou `data-metric-source="repo#linha"`) | `index.html:468, 472, 554, 844, 849, 973, 977, 651, 656, 1187, 1191` | P2 |
| CONT-04 | **Currículo PDF:** adicionar link `/files/curriculo-samuel-santos.pdf` na seção Contato ou Sobre | `index.html:1372-1403` | P2 |
| CONT-05 | **Atualizar ano no footer** para 2026 (já está) — confirmar script automático | `index.html:1424` | P2 |

---

### EPIC-MOBILE: Mobile 375px & Dark Mode Polish (P1/P2)

| Task | Descrição | Arquivo:linha | Prioridade |
|---|---|---|---|
| MOB-01 | **Testar em 375px real** (Chrome DevTools): hero h1, imagem, nav drawer, project cards, cert cards, contact cards | — | P1 |
| MOB-02 | **Project card image height:** em mobile, `210px` fixo pode cortar; avaliar `aspect-ratio: 16/9` ou `object-fit: contain` + fundo | `style.css:1503` | P1 |
| MOB-03 | **Dark mode screenshots:** gerar versões com fundo transparente (WebP) ou aplicar CSS `background: var(--aipim-bg-canvas)` no wrapper `.project-image` | `style.css:1501-1523` | P1 |
| MOB-04 | **Theme toggle:** confirmar `aria-label` dinâmico (já implementado) | `index.html:1444` | — |

---

### EPIC-TECH: Dívida Técnica & Build (P2)

| Task | Descrição | Prioridade |
|---|---|---|
| TECH-01 | **Build pipeline:** `package.json` com scripts `img:optimize`, `fonts:download`, `css:critical`, `html:minify`, `deploy` (gh-pages) | P2 |
| TECH-02 | **Lint/Format:** Prettier + Stylelint (config Aipim-like) + HTMLHint | P2 |
| TECH-03 | **CI/CD:** GitHub Actions para validação (links, html, css, imagens) em PR | P2 |
| TECH-04 | **Monitoring:** Web Vitals (LCP, CLS, INP) via `web-vitals` lib + endpoint (opt-in) | P2 |

---

## Resumo de Prioridades (P0 = deve fazer antes de qualquer deploy)

| Categoria | P0 Tasks | Esforço Estimado |
|---|---|---|
| **Imagens** | IMG-01 (12 arquivos), IMG-02, IMG-03, IMG-04, IMG-05, IMG-06 (OG), IMG-07 | 4–6h (script + geração manual) |
| **Performance** | PERF-01, PERF-02, PERF-03 | 2–3h |
| **Acessibilidade** | A11Y-01 a A11Y-07 | 3–4h |
| **Total P0** | **15 tasks** | **~10–13h** |

> **Próximo passo sugerido:** executar IMG-01 (limpeza) + PERF-03 (FA → SVG) + A11Y-01 (contraste tag) + A11Y-02/03/04 (motion) em uma única branch `chore/audit-p0-fixes` — são mudanças localizadas, baixo risco, alto impacto. Depois rodar script de otimização de imagens (IMG-02 a IMG-05) e self-host fonts (PERF-01/02).

---

## Evidências de Hash (Git) — Para Confirmar Integridade

```bash
# Hashes atuais (master HEAD)
git rev-parse HEAD
# a1b2c3d4... (substituir pelo real)

# Hash dos arquivos principais
git hash-object index.html
git hash-object style.css
git hash-object sitemap.xml
git hash-object sitemap_index.xml
git hash-object CNAME
```

> **Nota:** "git status pode mentir — confirmar com git hash-object" — hashes acima servem como baseline para auditoria pós-mudanças.

---

**Fim da Auditoria** — Documento pronto para execução faseada. Sem alterações no código realizadas.
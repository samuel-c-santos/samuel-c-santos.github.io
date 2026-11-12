# Portfólio Profissional Samuel Santos

Repositório do site de portfólio profissional, desenvolvido com HTML e CSS puro, publicado via GitHub Pages.

Versao online: https://samuel-c-santos.github.io ou https://samuelsantos.site

## Sobre

Profissional especializado em ciencia de dados e geoprocessamento, com foco em solucoes ambientais e analise espacial. Mestre em Biologia Ambiental e especialista em Ciencia de Dados, desenvolvo desde analises exploratorias ate sistemas completos de automao e visualizacao.

O portfólio apresenta:
- Projetos em Python, R, SQL, Flask e React Native
- Dashboards interativos no Power BI e Plotly/Dash
- Analises geoespaciais e processamento de imagens de satelite
- Sistemas de automao para certificacao ambiental
- Aplicacoes de geoestatistica e monitoramento territorial
- Tutoriais tecnicos sobre QGIS, Python, Google Earth Engine e analise de dados

## Tecnologias do Portfólio

- HTML5 e CSS3 (sem frameworks)
- GitHub Pages para hospedagem
- Design tokens baseados no Aipim Design System
- Tipografia IBM Plex Sans (self-hosted, font-display swap)
- Icones SVG sprite (subset Font Awesome 6.4)
- Otimizacao de imagens WebP/AVIF com fallback PNG
- Dark mode nativo via CSS custom properties
- Print CSS otimizado para curriculo

## Performance

- Imagens otimizadas: 92 por cento de reducao (10 MB para 0.76 MB)
- Formatos WebP e AVIF com fallback PNG
- Hero image com fetchpriority high e srcset responsivo
- Lazy loading nas imagens de projetos
- Fontes self-hosted com preload e font-display swap
- Zero dependencias externas bloqueantes (zero Google Fonts CDN, zero Font Awesome CDN)

## Acessibilidade

- Contraste WCAG 2.1 AA em todos os pares texto/fundo
- Focus visible padrao em todos elementos interativos
- Focus trap no menu mobile com suporte a Escape
- Touch targets minimos 44px
- Reduced motion respeitado (cursor, typewriter, drawer parallax)
- Hierarquia de headings correta (h1 > h2 > h3)
- Alt text descritivo em todas imagens
- ARIA labels em controles sem texto visivel

## Dark Mode

- Tokens CSS semânticos para light/dark
- Color-scheme declarado
- Imagens de projeto com background adaptativo (sem caixas brancas)
- Scrollbar estilizada com tokens
- Persistencia via localStorage

## Estrutura do Projeto

```
samuel-c-santos.github.io/
├── index.html                      # Pagina principal
├── style.css                       # Estilos, tokens, responsividade, print
├── favicon.svg                     # Favicon token-driven
├── fonts/
│   ├── ibm-plex-sans.css           # @font-face IBM Plex Sans
│   ├── IBMPlexSans-Variable/       # Variable font + estaticos TTF
│   ├── fa-sprite.svg               # Sprite SVG 23 icones
│   └── fa-sprite.css               # Mapeamento classes FA
├── images/
│   └── optimized/                  # 62 arquivos WebP/AVIF
├── files/                          # Originais PNG/JPG/GIF (referenciados como fallback)
├── scripts/
│   ├── optimize-images.js          # Pipeline Sharp (remove orfaos, converte, manifesto)
│   ├── update-html-images.js       # Atualiza index.html com picture elements
│   ├── validate-links.js           # Validador 47 links externos
│   ├── download-fonts.js           # Download IBM Plex Sans
│   ├── image-manifest.json         # Mapeamento original -> otimizado
│   └── link-report.json            # Relatório validacao links
├── sitemap.xml                     # Sitemap principal
├── sitemap_index.xml               # Sitemap index
├── CNAME                           # Dominio personalizado
└── README.md                       # Esta documentacao
```

## Certificacoes

- IBM Data Science Professional Certificate
- Google Business Intelligence Professional Certificate
- Google Data Analytics Professional Certificate
- Google Advanced Data Analytics Professional Certificate
- Google IT Automation with Python Professional Certificate

Links de verificacao no Coursera estao na secao de certificacoes do site.

## Contato

- Email: samuelsantosambiental@gmail.com
- LinkedIn: linkedin.com/in/samuelsantos-amb
- GitHub: github.com/samuel-c-santos
- WhatsApp: +55 91 98474-1391
- Cartao Digital: dot.cards/samuelsantos

## Scripts Disponiveis

```bash
# Otimizacao de imagens (requer Node + Sharp)
npm install sharp
node scripts/optimize-images.js

# Atualiza index.html com picture elements do manifesto
node scripts/update-html-images.js

# Valida links externos
node scripts/validate-links.js
```

## Notas de Implementacao

- Branch de desenvolvimento: style/perfect-aipim
- Zero hardcodes de cor (tokens semânticos em todo CSS)
- Componentes puros Aipim (buttons, badges, tags, cards)
- Print CSS oculta navegacao, CTAs, acoes, filtros; expande URLs em links externos
- Manifest de imagens em scripts/image-manifest.json para reprodutibilidade
- Relatorio de links em scripts/link-report.json (41 OK, 6 falhas conhecidas: 4 Colab HEAD 405 false positive, 2 LinkedIn bot block)

---

Repositorio desenvolvido para apresentacao profissional e demonstracao de projetos nas areas de ciencia de dados, analise espacial, automao de processos e regularizacao ambiental.
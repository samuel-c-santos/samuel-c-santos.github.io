# Portfólio Profissional - Samuel Santos

Portfólio profissional + tutoriais de geotecnologias, desenvolvido com Astro e publicado via GitHub Pages.

Site: https://samuelsantos.site

## Estrutura do Projeto

```
/
├── public/              # Assets estáticos (imagens, fontes, CSS)
│   ├── fonts/           # IBM Plex Sans + sprite Font Awesome
│   ├── images/          # Imagens otimizadas (WebP/AVIF)
│   ├── files/           # Originais de fallback
│   ├── styles/          # style.css (tokens Aipim)
│   └── tutoriais/       # Imagens dos tutoriais
├── src/
│   ├── content/
│   │   └── tutoriais/   # Tutoriais em Markdown
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro  # Home (portfólio)
│       └── tutoriais/
│           ├── index.astro      # Listagem
│           └── [slug].astro     # Detalhe
├── astro.config.mjs
├── package.json
└── ROADMAP.md
```

## Comandos

Todos os comandos são executados na raiz do projeto, em um terminal:

| Comando | Ação |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Inicia o servidor local em localhost:4321 |
| `npm run build` | Gera o site de produção em ./dist/ |
| `npm run preview` | Pré-visualiza o build localmente |
| `npm run astro -- --help` | Ajuda da CLI do Astro |

## Deploy

O deploy é feito via GitHub Actions (`.github/workflows/deploy.yml`), publicando no GitHub Pages com domínio customizado `samuelsantos.site`.

## Tutoriais

Os tutoriais são gerenciados via Content Collections do Astro. Cada tutorial é um arquivo `.md` em `src/content/tutoriais/` com frontmatter (title, description, date, tags, level, thumbnail).

Para adicionar um novo tutorial:
1. Crie um arquivo `.md` em `src/content/tutoriais/`.
2. Adicione o frontmatter com os campos obrigatórios.
3. Coloque as imagens em `public/tutoriais/<slug>/`.
4. O build gera automaticamente a rota `/tutoriais/<slug>`.

## Contato

- Email: samuelsantosambiental@gmail.com
- LinkedIn: https://www.linkedin.com/in/samuelsantos-amb/
- GitHub: https://github.com/samuel-c-santos
- Site: https://samuelsantos.site

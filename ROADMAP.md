# Roadmap — Migração do Portfólio para Astro

## Objetivo
Consolidar o portfólio profissional + tutoriais em um único repositório Astro, eliminando páginas soltas em GitHub Pages.

## Etapas

### 1. Remodelar a landing page (home)
- [ ] Migrar `index.html` atual (Aipim) para `src/pages/index.astro`
- [ ] Componentizar: Header, Hero, Sobre, Projetos, Stack, Contato, Footer
- [ ] Manter dark mode, scroll-reveal, typewriter
- [ ] Mover assets (imagens, fontes) para `public/`

### 2. Modelar a nova página de tutoriais (padrão novo)
- [ ] Definir layout visual (cards com thumbnail, tag, nível, data)
- [ ] Filtros por tecnologia (QGIS, Python, GEE, JS, Power BI) e nível
- [ ] Busca por texto
- [ ] Ordenação (mais recentes / mais acessados)
- [ ] Página de detalhe com TOC, syntax highlight, dark mode
- [ ] Responsivo (mobile-first)
- [ ] Componentes reutilizáveis: TutorialCard, TagBadge, LevelBadge

### 3. Adicionar tutoriais (content collection)
- [ ] Converter **todos** os tutoriais/artigos para `.mdx` em `src/content/tutoriais/`
- [ ] Adicionar frontmatter (title, description, date, tags, level, thumbnail)
- [ ] Migrar imagens de cada tutorial para `public/tutoriais/<slug>/`
- [ ] Criar página de listagem com filtros por tag/nível
- [ ] Criar rota dinâmica `/tutoriais/[slug]`

### 4. Tutoriais a migrar (todos)
- [ ] pyqgis-location-map-tutorial
- [ ] pyqgis_style_mapbiomas
- [ ] layout_com_variaveis_qgis
- [ ] tutorial-configuração-gee
- [ ] aula-qgis
- [ ] tutorial-pyqgis-mapbiomas
- [ ] artigo_indice_espacial
- [ ] template-tutoriais (como referência)

### 5. Limpeza dos repositórios legados (após migração):
- [ ] Remover HTML/GitHub Pages de cada repo de tutorial
- [ ] Manter apenas README + código/fonte
- [ ] Desativar GitHub Pages em cada repo
- [ ] Arquivar repos obsoletos (opcional)

### 6. Retirada do portfólio antigo (após migração completa):
- [ ] Após migração completa e validação, remover `H:\Meu Drive\DEV\Portfólio GitHub\samuel-c-santos.github.io`
- [ ] Apontar domínio `samuelsantos.site` para o novo repo Astro
- [ ] Configurar GitHub Actions para build/deploy no novo repo
- [ ] Validar links, SEO e performance (Lighthouse)

### 7. Publicação
- [ ] Criar repo `samuel-c-santos.github.io` (ou manter nome) com o projeto Astro
- [ ] Push e ativar GitHub Pages (Actions)
- [ ] Verificar domínio customizado

---
Criado em: 2026-11-13
Status: Planejamento
EOF
echo "Roadmap criado"
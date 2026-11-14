---
title: "Google Colab + GitHub: Análises Reprodutíveis sem Configurar Ambiente"
description: "Como usar o Google Colab como interface para compartilhabilidade e reprodutibilidade de análises geoespaciais, sem que o usuário precise configurar ambiente local. Estudo de caso: Cartografia de Queimadas em UCs do Pará."
tags: ["Google Colab", "GitHub", "Reprodutibilidade", "Python", "Geoprocessamento"]
level: "Iniciante"
thumbnail: "/tutoriais/colab-github-integration/thumbnail.png"
---

# Google Colab + GitHub: Análises Reprodutíveis sem Configurar Ambiente

## O problema

Análises geoespaciais costumam exigir instalação de bibliotecas (GDAL, GeoPandas, Rasterio, Earth Engine), configuração de credenciais e ambientes virtuais. Para um usuário não avançado, isso é uma barreira enorme. O resultado: análises que não são reproduzidas, dependência de um único técnico e perda de conhecimento.

## A solução: Colab + GitHub

O **Google Colab** é um ambiente Jupyter na nuvem, gratuito, com bibliotecas geoespaciais pré-instaladas e acesso a GPU/TPU. O **GitHub** hospeda o código. A integração entre os dois permite:

- **Zero instalação local:** o usuário só precisa de um navegador.
- **Reprodutibilidade:** qualquer pessoa pode abrir o notebook e rodar a mesma análise.
- **Compartilhabilidade:** link direto "Open in Colab" no README do repositório.
- **Versionamento:** o código vive no GitHub, com histórico e colaboração.

## Fluxo de trabalho

1. **Desenvolva** o notebook localmente (ou no Colab).
2. **Salve** o `.ipynb` no repositório GitHub.
3. **Adicione** o badge "Open in Colab" no README:
   ```markdown
   [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/SEU_USUARIO/SEU_REPO/blob/main/notebook.ipynb)
   ```
4. **O usuário final** clica no badge, o notebook abre no Colab, e executa as células.

## Estudo de caso: Cartografia de Queimadas em UCs do Pará

O projeto [cartografia-queimadas-ucs-pa](https://github.com/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa) usa exatamente esse padrão:

| Fluxo Operacional | Atalho Google Colab | Finalidade |
|---|---|---|
| **1. Triagem e Alerta de Queimadas** | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa/blob/main/notebooks/triagem_focos_ucs.ipynb) | Varre as 29 UCs estaduais em segundos (sem GEE), ranqueia focos ativos, gera mapa interativo, KML e Excel |
| **2. Gerador Cartográfico Oficial** | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa/blob/main/notebooks/colab_runner.ipynb) | Produz as 3 pranchas A4 (300 DPI), dNBR / MapBiomas, Relatório Técnico (.docx), KML e ZIP |

### Por que isso funciona para usuários não avançados

- **Código oculto:** as células de código são colapsadas; o usuário vê apenas formulários e botões.
- **Painel reativo:** parâmetros (UC, período, sensor) são selecionados via dropdowns.
- **Saída automática:** mapas, tabelas e relatórios são gerados e baixados automaticamente.
- **Sem instalação:** tudo roda na nuvem do Google.

## Boas práticas

1. **Mantenha o código oculto** (`# @title` ou células colapsadas) para não assustar o usuário.
2. **Use formulários nativos do Colab** (`#@param` ou `ipywidgets`) para inputs.
3. **Documente cada célula** com markdown explicativo.
4. **Teste o notebook do zero** (Runtime → Restart and run all) antes de compartilhar.
5. **Versione no GitHub** para rastreabilidade.

## Conclusão

A combinação Colab + GitHub é uma das formas mais eficazes de democratizar análises geoespaciais. Usuários não avançados conseguem rodar análises complexas sem configurar nada, e a reprodutibilidade é garantida. O projeto de Cartografia de Queimadas em UCs do Pará é um exemplo real de sucesso dessa abordagem.

## Referências

- Google Colab: https://colab.research.google.com
- Projeto cartografia-queimadas-ucs-pa: https://github.com/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa
- Badge "Open in Colab": https://colab.research.google.com/github

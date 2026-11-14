---
title: "Cartograma de Dorling: Visualizando Criminalidade Urbana em Belém (PA)"
description: "Pipeline em Python e R para extração de dados do SIAC/SEGUP-PA, tratamento geoespacial e renderização de cartograma animado de Dorling com morfing polígono-círculo, eliminando a distorção territorial de mapas coropléticos."
tags: ["Cartograma", "Dorling", "Python", "R", "Geoprocessamento", "Visualização", "Colab"]
level: "Avançado"
thumbnail: "/tutoriais/belem-crime-dorling-cartogram/thumbnail.gif"
---

# Cartograma de Dorling para Análise de Criminalidade Urbana em Belém (PA)

## Motivação

Topei esses dias com uma visualização sobre resultados das eleições que transformava polígonos de mapa em círculos proporcionais e enxames de bolhas. Fiquei impressionado com aquela visualização e me vi obrigado a reproduzir essa mecânica.

Como não aguento mais dados ambientais na minha frente o dia todo, resolvi aplicar isso aos dados de segurança pública de Belém (PA).

## O problema da distorção territorial

A representação coroplética convencional baseada em limites político-administrativos introduz distorção perceptiva em análises de fenômenos socioespaciais. Bairros com grande extensão territorial e baixa densidade demográfica, como as ilhas e zonas rurais de Belém (Mosqueiro, Outeiro e Cotijuba), ocupam visualmente a maior parte da superfície cartográfica, enquanto áreas densamente urbanizadas de alta concentração de ocorrências (como Marco, Pedreira e Umarizal) são sub-representadas.

A ideia foi retirar o efeito de distorção dado pela extensão territorial em mapas coropléticos, uma vez que a área do polígono atua como um peso visual espúrio — quanto maior for o bairro, maior o destaque óptico que ele recebe, mesmo que na concentração real de ocorrências ele não se destaque.

## Como fiz

### Python: Extração dos dados

Usei um script para extrair os dados do portal da SEGUP/SIAC, gerenciando a sessão HTTP e capturando o token CSRF para disparar o download consolidado dos últimos 365 dias para todos os bairros de Belém.

O script `01_extrair_siac.py` automatiza:
1. Requisição inicial GET para instanciar sessão persistente e capturar cookie `csrftoken`.
2. Consulta à API interna `/api/bairros` para obter identificadores nominais dos bairros vinculados à 1ª Região de Integração de Segurança Pública (RISP).
3. Envio de requisição POST estruturada com parâmetros de período temporal, lista de bairros e classes de crimes consolidados.
4. Download do recorte em formato de planilha eletrônica via endpoint `/download_recorte`.
5. Tratamento de coordenadas geográficas (LATITUDE e LONGITUDE), conversão para ponto flutuante de precisão dupla e aplicação de tabela de equivalência nominal (de-para) para compatibilização com a malha vetorial do município.

### R: Correção topológica e centroides

Correção topológica da malha vetorial, reprojeção e cálculo de centroides na superfície para cruzamento espacial dos atributos.

O módulo `01_geometrias_bairros.R` opera sobre a biblioteca `sf`:
1. Conversão do sistema de referência de coordenadas geográficas para o sistema cartográfico plano projetado SIRGAS 2000 / UTM zone 22S (EPSG:31982). Essa etapa é obrigatória para assegurar que operações de distância, raios e forças físicas sejam computadas em metros lineares.
2. Identificação de pontos internos de ancoragem utilizando a função `st_point_on_surface`, garantindo que o ponto de gravidade esteja contido na superfície do polígono correspondente, mesmo em geometrias côncavas ou multipartes.
3. Junção relacional entre a malha vetorial e o arquivo tabular consolidado de delitos.

### Física: Simulação de partículas

Usei um motor de física de partículas simulando forças elásticas de atração ao centroide e colisão de raio para organizar as bolhas de modo que não se sobrepusessem.

O módulo `02_dorling_fisica.R` utiliza os pacotes `particles` e `tidygraph`:
1. Definição do raio nominal $R_i$ de cada feição a partir da raiz quadrada da métrica de ocorrências:
   $$R_i = k \cdot \sqrt{\text{Crimes}_i}$$
2. Configuração de força de atração direcional em relação às coordenadas métricas originais do centroide do bairro.
3. Configuração de força de exclusão mútua baseada em colisão circular com distância mínima de resguardo (`padding`).
4. Iteração do sistema dinâmico até convergência estática das posições.

### Animação (R)

Fiz uma interpolação contínua dos quatro estágios:
1. **Mapa territorial:** limites territoriais oficiais em projeção cartográfica real.
2. **Grade ordenada por área:** ordenamento dos 72 bairros em grade regular segundo a extensão territorial decrescente.
3. **Tamanho proporcional ao volume de crimes:** transmutação dos polígonos em círculos dimensionados na grade, desfazendo a dominância visual das grandes áreas insulares.
4. **Agrupamento em dois enxames por severidade:** reagrupamento das bolhas em dois enxames densos (bubble clusters) classificados por **Severidade Estatística** em relação à média municipal de ocorrências (Alta Severidade vs Baixa Severidade).

Dois motores de animação complementares:
- **`03_animacao_morphing.R` (Abordagem Karim Douieb):** Deformação in-situ contínua dos polígonos oficiais em direção aos seus respectivos centroides, convertendo-se em círculos dimensionados pelo volume de ocorrências em layout editorial claro.
- **`04_animacao_narrativa_estagios.R` (Abordagem David Zumbach / votemapswitzerland2.R):** Narrativa em quatro fases encadeadas.

### Google Colab

Usei o Colab como plataforma de execução. Ele clona o repositório e instala as dependências e agrega acessibilidade e reprodutibilidade sem exigir usuário avançado e nem mesmo R ou RStudio instalados localmente na máquina.

O processamento computacional intensivo de partículas e a renderização quadro a quadro são estruturados para execução no Google Colab sob ambiente Linux (Ubuntu) com kernel R nativo.

## Requisitos e Execução

### Ambiente Local (Extração)
Requisitos: Python 3.10 ou superior, `requests`, `pandas`, `openpyxl`.

```bash
python scripts/01_extrair_siac.py
```

Ou com delimitação manual de datas:
```bash
python scripts/01_extrair_siac.py "2023-01-01" "2023-12-31" "data"
```

### Ambiente de Nuvem (Google Colab)
1. Abrir o caderno: [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/samuel-c-santos/belem-crime-dorling-cartogram/blob/main/notebooks/colab_runner.ipynb)
2. Executar a célula de configuração para instalação dos pacotes de sistema (`libgdal-dev`, `libgeos-dev`, `libproj-dev`, `libudunits2-dev`) e bibliotecas R correspondentes.
3. Executar o fluxo sequencial de cálculo e renderização.

## Referências

1. **Dorling, D. (1996).** *Area Cartograms: Their Use and Creation.* Concepts and Techniques in Modern Geography (CATMOG), No. 59.
2. **Zumbach, D. (2020).** *votemapswitzerland: A Swiss version of the famous visualization "Land doesn't vote, people do".* SRF Data / GitHub.
3. **SEGUP/PA.** *Sistema Integrado de Segurança Pública (SIAC).* Coordenadoria de Estatística e Análise Criminal (CODEC).
4. **Pedersen, T. L. (2020).** *transformr, particles, gganimate.* R packages.
5. **Prefeitura Municipal de Belém / CODEM.** *Malha de Bairros Oficiais do Município de Belém.*

## Download

Repositório: https://github.com/samuel-c-santos/belem-crime-dorling-cartogram

## Contato

- Email: samuelsantosambiental@gmail.com
- LinkedIn: https://www.linkedin.com/in/samuel-c-santos/
- GitHub: https://github.com/samuel-c-santos

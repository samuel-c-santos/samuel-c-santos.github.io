---
title: "NGEO Satellite Downloader: Download Automatizado de Imagens de Satélite"
description: "Ambiente operacional no Google Colab para aquisição automatizada de imagens Sentinel-2, Landsat, CBERS-4A e SPOT sobre limites territoriais, com máscaras de nuvens, composição por mediana e exportação em GeoTIFF."
tags: ["Google Earth Engine", "Sentinel-2", "Landsat", "CBERS-4A", "Python", "Colab"]
level: "Intermediário"
thumbnail: "/tutoriais/ngeo-satellite-downloader/thumbnail.png"
---

# NGEO Satellite Downloader

Ambiente operacional automatizado para o Google Colab desenvolvido pelo Núcleo de Geotecnologias (NGEO) do IDEFLOR-Bio. O sistema executa a aquisição de imagens orbitais dos programas Sentinel-2, Landsat, CBERS-4A e SPOT 2008 sobre limites territoriais fornecidos em formato shapefile, aplicando máscaras de nuvens, composição por mediana estatística, particionamento em grade de tiles e exportação em GeoTIFF para o Google Drive.

A interface do notebook utiliza formulários nativos do Google Colab com código oculto por padrão e painel reativo condicional, disponibilizando campos de seleção paramétrica fechada para operação direta por técnicos e analistas ambientais.

## Sensores Orbitais e Especificações

| Sensor | Resolução Espacial | Coleção e Catálogo | Características Técnicas |
|---|---:|---|---|
| Sentinel-2 MSI | 10 m | COPERNICUS/S2_SR_HARMONIZED | Composição semestral ou mensal com máscara de nuvens via banda SCL. |
| Landsat 5, 7, 8 e 9 | 30 m | LANDSAT/Collection 2/Tier 1/Level 2 | Séries temporais calibradas em reflectância de superfície com máscara QA_PIXEL. |
| CBERS-4A (WPM e MUX) | 2 m | Catálogo INPE (API Cbers4a) | Aquisição de alta resolução espacial com composição multiespectral RGBN. |
| SPOT 2008 | 5 m | GOOGLE/BRAZIL_FOREST_2008/V1/VISUAL | Mosaico de cobertura florestal histórica de referência do Código Florestal. |

## Roteiro de Execução

1. **Acesso ao notebook:** abra o arquivo `ngeo_satellite_downloader.ipynb` no ambiente Google Colab por meio do link institucional.
2. **Etapa 1 (Instalação):** execute a célula de preparação para instalação silenciosa das bibliotecas geoespaciais e sincronização automática do núcleo de processamento.
3. **Etapa 2 (Autenticação):** informe o identificador do projeto no Google Earth Engine e autorize a integração com o Google Drive.
4. **Etapa 3 (Entrada vetorial):** envie o arquivo ZIP contendo os componentes do shapefile (.shp, .shx, .dbf, .prj). O fluxo executa a reprojeção automática para WGS-84 (EPSG:4326), a higienização de geometrias bidimensionais e o cálculo de métricas espaciais.
5. **Etapa 4 (Painel integrado):** selecione o sensor orbital no painel reativo, ajuste os parâmetros condicionais de período e buffer, e clique no botão **INICIAR DOWNLOAD** integrado para iniciar o processamento e acompanhar a exportação dos arquivos GeoTIFF.

## Estrutura do Repositório

```
ngeo_satellite_downloader/
├── src/                          # Módulos do motor de processamento
│   ├── __init__.py               # Definições do pacote e exportações
│   ├── config.py                 # Constantes de sensores e limites operacionais
│   ├── vector_ops.py             # Leitura, conversão 2D e particionamento em tiles
│   ├── sensors.py                # Consultas ao Earth Engine e máscaras de nuvens
│   ├── cbers.py                  # Integração com a API e catálogo CBERS (INPE)
│   ├── exporter.py               # Orquestrador de tarefas e gravação no Drive
│   └── ui_helpers.py             # Painel reativo condicional e relatórios
├── ngeo_satellite_downloader.ipynb # Notebook com interface de formulário
├── requirements.txt              # Relação de dependências técnicas
├── LICENSE                       # Termos da Licença MIT
└── README.md                     # Documentação técnica
```

## Controle de Qualidade

1. **Sistema de referência:** os produtos gerados adotam coordenadas geográficas no datum WGS-84 / SIRGAS 2000 (EPSG:4326).
2. **Sazonalidade de nebulosidade:** para áreas localizadas na Amazônia durante o período chuvoso (janeiro a maio), recomenda-se utilizar a análise anual com seleção específica dos meses secos (julho a outubro).
3. **Particionamento espacial:** áreas com extensão superior a 5 milhões de pixels são subdivididas automaticamente em grade regular para assegurar a preservação da resolução nativa do sensor.

## Download

Acesse o notebook no Google Colab: [Open in Colab](https://colab.research.google.com/github/NGEO-IDEFLOR-Bio/ngeo_satellite_downloader/blob/main/ngeo_satellite_downloader.ipynb)

Repositório: https://github.com/NGEO-IDEFLOR-Bio/ngeo_satellite_downloader

## Créditos

Desenvolvimento e coordenação: Samuel da Costa dos Santos (samuelsantos.site).

Núcleo de Geotecnologias (NGEO), Instituto de Desenvolvimento Florestal e da Biodiversidade do Estado do Pará (IDEFLOR-Bio).

## Licença

Este projeto é disponibilizado sob os termos da Licença MIT.

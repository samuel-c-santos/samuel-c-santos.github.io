---
title: "Google Colab como Front-end: Rodando Repositórios GitHub na Nuvem"
description: "Guia prático de como usar o Google Colab como interface para executar scripts e notebooks hospedados no GitHub, preparando o ambiente automaticamente, interagindo com o código e entregando resultados — sem configuração local."
tags: ["Google Colab", "GitHub", "Python", "Reprodutibilidade", "Automação"]
level: "Iniciante"
thumbnail: "/tutoriais/colab-github-integration/thumbnail.png"
---

# Google Colab como Front-end: Rodando Repositórios GitHub na Nuvem

## O problema

Análises geoespaciais costumam exigir instalação de bibliotecas (GDAL, GeoPandas, Rasterio, Earth Engine), configuração de credenciais e ambientes virtuais. Para um usuário não avançado, isso é uma barreira enorme. O resultado: análises que não são reproduzidas, dependência de um único técnico e perda de conhecimento.

## A solução

Usar o **Google Colab** como **front-end** para um repositório do **GitHub**: o usuário abre o notebook no Colab, o ambiente é preparado automaticamente (clone do repo + instalação de dependências), e ele interage com os scripts por formulários ou células, recebendo os resultados (mapas, tabelas, relatórios) sem precisar configurar nada localmente.

## Fluxo completo

### 1. Clonar o repositório no Colab

A primeira célula do notebook clona o repo e entra na pasta:

```python
!git clone https://github.com/SEU_USUARIO/SEU_REPO.git
%cd SEU_REPO
```

### 2. Preparar o ambiente automaticamente

Instale as dependências declaradas no `requirements.txt` do repo:

```python
!pip install -q -r requirements.txt
```

Se o repo usa pacotes do sistema (GDAL, etc.), instale via apt:

```python
!apt-get install -y -q gdal-bin libgdal-dev
```

### 3. Montar o Google Drive (para salvar resultados)

```python
from google.colab import drive
drive.mount('/content/drive')
```

Isso permite salvar outputs (GeoTIFF, PDF, Excel) diretamente no Drive do usuário.

### 4. Interagir com os scripts

O notebook pode expor formulários nativos do Colab (`#@param`) para o usuário escolher parâmetros (área, período, sensor) sem tocar no código:

```python
#@title Parâmetros da análise
area = "Belém" #@param {type:"string"}
periodo = "2024" #@param {type:"string"}
sensor = "Sentinel-2" #@param ["Sentinel-2", "Landsat", "CBERS-4A"]
```

Ou usar `ipywidgets` para dropdowns, sliders e botões.

### 5. Executar os scripts do repositório

Importe e execute os módulos do repo clonado:

```python
import sys
sys.path.insert(0, '/content/SEU_REPO/src')
from sensors import download_sentinel
from exporter import export_geotiff

resultado = download_sentinel(area, periodo, sensor)
export_geotiff(resultado, '/content/drive/MyDrive/outputs/')
```

### 6. Entregar os resultados

- **Download direto:** `files.download('resultado.tif')`
- **Salvar no Drive:** já montado na etapa 3.
- **Visualização no notebook:** `IPython.display.Image`, `folium`, `geemap`.
- **Relatório PDF:** gerar e disponibilizar para download.

## Exemplo real: Cartografia de Queimadas em UCs do Pará

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
6. **Use `requirements.txt`** para declarar dependências.
7. **Monte o Drive** para persistir resultados.

## Conclusão

A combinação Colab + GitHub, com o Colab atuando como front-end, é uma das formas mais eficazes de democratizar análises geoespaciais. Usuários não avançados conseguem rodar análises complexas sem configurar nada, e a reprodutibilidade é garantida. O projeto de Cartografia de Queimadas em UCs do Pará é um exemplo real de sucesso dessa abordagem.

## Referências

- Google Colab: https://colab.research.google.com
- Projeto cartografia-queimadas-ucs-pa: https://github.com/NGEO-IDEFLOR-Bio/cartografia-queimadas-ucs-pa
- Badge "Open in Colab": https://colab.research.google.com/github
- NGEO Satellite Downloader: https://github.com/NGEO-IDEFLOR-Bio/ngeo_satellite_downloader

---
title: "Automação de Layout no QGIS com PyQGIS"
description: "Automatize a criação de layouts cartográficos dinâmicos no QGIS usando variáveis calculadas em Python (PyQGIS)."
tags: ["QGIS", "PyQGIS", "Python", "Layout", "Cartografia"]
level: "Intermediário"
thumbnail: "/tutoriais/layout-com-variaveis-qgis/thumbnail.png"
---

# Automação de Layout no QGIS: Do Python ao Papel

Transforme dados brutos em layouts cartográficos dinâmicos usando variáveis calculadas via PyQGIS. O objetivo não é desenhar com código, mas usar o Python como uma calculadora de precisão para o Layout.

## Demonstração em Vídeo

[![Tutorial: Automação de Layout no QGIS](https://img.youtube.com/vi/CT42TfrCC8Y/0.jpg)](https://www.youtube.com/watch?v=CT42TfrCC8Y)

## Introdução

Este tutorial mostra como usar **PyQGIS** para automatizar a criação de layouts cartográficos dinâmicos. Em vez de ajustar manualmente zoom, escala e títulos para cada município, você criará um sistema onde o Python calcula os valores matemáticos precisos e o QGIS renderiza automaticamente.

A abordagem se baseia em variáveis de projeto: o script Python processa a geometria do município e gera variáveis globais com coordenadas, escala e segmento da barra de escala. No Layout, você vincula esses valores aos elementos do mapa, criando um sistema totalmente automático e reutilizável.

**O que você vai aprender:**
- Como usar o script Python para gerar variáveis de projeto no QGIS automaticamente
- Como vincular elementos do Layout (mapa, título, escala) a variáveis dinâmicas
- Como o script calcula escalas e segmentos ideais automaticamente
- Como criar layouts reutilizáveis que se adaptam a diferentes municípios

## Pré-requisitos

- **QGIS 3.x:** Versão com suporte a PyQGIS (console Python integrado)
- **Python 3:** Biblioteca `geobr` instalada (`pip install geobr`)
- Conhecimento básico de QGIS e layouts de impressão
- Compreensão básica de Python (funções, variáveis)

## Passo a Passo

### 1. O Backend: Variáveis Geradas

Ao executar o script de configuração, o Python não desenha o mapa imediatamente. Ele processa a geometria do município e cria **Variáveis de Projeto** globais com os valores matemáticos exatos para o formato de papel definido (A4).

**Variáveis principais geradas:**
- `@municipio`: Nome do município selecionado
- `@escala`: O denominador da escala arredondado (ex: 250000)
- `@xmin`, `@ymin`, `@xmax`, `@ymax`: Coordenadas exatas de enquadramento
- `@segmento`: Tamanho ideal (em metros) para um bloco da barra de escala

```python
# Função que calcula a escala ideal
def calculate_smart_scale(extent, map_w_mm, map_h_mm, layer):
    d = QgsDistanceArea()
    d.setSourceCrs(layer.crs(), QgsProject.instance().transformContext())
    d.setEllipsoid('WGS84')
    
    # Calcula dimensões geográficas com margem de segurança de 5%
    geo_w_m = d.measureLine(p_min, p_max_x) * 1.05
    geo_h_m = d.measureLine(p_min, p_max_y) * 1.05
    
    # Converte dimensões do papel para metros
    map_w_m = map_w_mm / 1000.0
    map_h_m = map_h_mm / 1000.0
    
    # Calcula escala e arredonda para valores padrão
    scale = max(geo_w_m / map_w_m, geo_h_m / map_h_m)
    return int(mult * ordem)
```

> **Resultado esperado:** As variáveis são criadas no projeto QGIS e ficam disponíveis para uso em expressões em qualquer elemento do Layout.

### 2. Travando o Mapa (Coordenadas X e Y)

Para garantir que o mapa esteja sempre centralizado e com a escala correta, não usamos o mouse para ajustar o zoom. Vinculamos as propriedades do item **Mapa** às variáveis calculadas no passo anterior.

**Como fazer:**
1. Selecione o **Mapa** no Layout
2. Vá em **Propriedades do Item > Extensões** (Extents)
3. Em cada campo (X min, Y min, X max, Y max), clique no ícone de *Substituição por Dados* (ε) e insira a expressão correspondente

| Campo | Expressão |
|---|---|
| X Mín | `var('xmin')` |
| Y Mín | `var('ymin')` |
| X Máx | `var('xmax')` |
| Y Máx | `var('ymax')` |

> **Resultado:** O mapa "trava" na posição calculada matematicamente. Sempre que você executar o script para outro município, o mapa se ajustará automaticamente.

### 3. Título Dinâmico (Concatenação)

O título deve mudar automaticamente conforme o município escolhido. Para isso, usamos uma expressão que mistura texto fixo com a variável dinâmica.

**Como fazer:**
1. Selecione o elemento de **Texto** (título) no Layout
2. Em **Propriedades do Item**, clique em **Inserir ou Editar Expressão**
3. Digite a expressão abaixo

```
'Mapa do Município de ' || var('municipio')
```

> **Entenda a expressão:**
> - `'Mapa do Município de '` - Texto fixo entre aspas simples
> - `||` - Operador de concatenação (junta textos)
> - `var('municipio')` - Busca o valor da variável `@municipio`
>
> Se `@municipio` = "Belém", o título será: **"Mapa do Município de Belém"**

### 4. Barra de Escala Dinâmica

A barra de escala também pode ser configurada dinamicamente usando a variável `@segmento`. Essa variável contém o tamanho ideal (em metros) para cada bloco da barra.

**Como fazer:**
1. Selecione a **Barra de Escala** no Layout
2. Em **Propriedades do Item**, localize **Estilo de Segmento**
3. No campo **Tamanho do Segmento** (ou *Segment Size*), clique no ícone de *Substituição por Dados*
4. Digite a expressão: `var('segmento')`

```python
# Função que calcula o tamanho ideal do segmento
def calculate_segment_size(scale, map_width_mm):
    largura_mundo_m = (map_width_mm / 1000.0) * scale
    alvo_segmento = largura_mundo_m / 5.0  # Divide a largura em 5 segmentos
    
    # Arredonda para valores padrão (1, 2, 5, 10...)
    ordem = 10 ** math.floor(math.log10(alvo_segmento))
    base = alvo_segmento / ordem
    
    if base < 1.5: mult = 1
    elif base < 3.5: mult = 2
    elif base < 7.5: mult = 5
    else: mult = 10
    
    return int(mult * ordem)
```

> **Como funciona:** O script calcula um valor como `50000` (50 km) ou `25000` (25 km) para que a barra de escala tenha um tamanho visualmente agradável e legível, independentemente da escala do mapa.

## Vantagens desta Abordagem

- **Automação Completa:** Gere mapas para múltiplos municípios com um clique, sem ajustes manuais.
- **Consistência Visual:** Todos os mapas seguem o mesmo padrão de escala, enquadramento e elementos.
- **Reutilização:** O template de layout e o script podem ser usados em diversos projetos.
- **Precisão Geográfica:** O enquadramento e a escala são calculados matematicamente com base na geometria.

## Download dos Arquivos

Acesse o repositório no GitHub para baixar o script Python, o template de layout do QGIS e os dados de exemplo: [Ver no GitHub](https://github.com/samuel-c-santos/qgis-layout-automation-tutorial).

## Conclusão

A automação de layouts no QGIS com PyQGIS e variáveis de projeto é uma ferramenta poderosa para profissionais de geoprocessamento. Ela não apenas economiza um tempo valioso, mas também garante a consistência e a precisão dos seus produtos cartográficos.

Ao dominar essa técnica, você estará apto a criar fluxos de trabalho mais eficientes, gerar mapas em larga escala e focar na análise espacial, deixando as tarefas repetitivas para o QGIS. Experimente e veja como essa abordagem pode transformar sua rotina de trabalho!

## Contato

Tem dúvidas ou sugestões? Entre em contato:
- Email: samuelsantosambiental@gmail.com
- LinkedIn: https://www.linkedin.com/in/samuel-c-santos/
- GitHub: https://github.com/samuel-c-santos

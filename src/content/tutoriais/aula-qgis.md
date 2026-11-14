---
title: "Fundamentos de Cartografia e Geoprocessamento para QGIS"
description: "Conceitos essenciais de Sistemas de Informação Geográfica, cartografia e geoprocessamento aplicados ao QGIS."
tags: ["QGIS", "Cartografia", "GIS", "Geoprocessamento"]
level: "Iniciante"
---

## O que é um Sistema de Informação Geográfica (SIG/GIS)

Um SIG é um sistema computacional capaz de capturar, armazenar, consultar, analisar e exibir dados referenciados espacialmente. Em outras palavras: é o conjunto de ferramentas que permite responder perguntas do tipo "onde?", "quanto?", "o que mudou?".

Componentes de um SIG:
- **Dados** (vetoriais, raster, tabelas)
- **Software** (QGIS, ArcGIS, PostGIS, etc.)
- **Hardware** (computador, GPS, sensoriamento remoto)
- **Pessoas** (analistas, cartógrafos)
- **Métodos** (fluxos de análise, normas técnicas)

## Dados vetoriais

Representam feições discretas do mundo real através de geometrias:

- **Ponto**: uma coordenada (X, Y) — ex.: localização de uma árvore, um poço, uma cidade.
- **Linha**: sequência de pontos conectados — ex.: estradas, rios, redes elétricas.
- **Polígono**: área fechada — ex.: municípios, propriedades rurais, unidades de conservação.

Cada feição possui **atributos** (tabela) que descrevem suas características (nome, área, população, data, etc.). A geometria + atributos formam a camada vetorial.

Formatos comuns: Shapefile (.shp), GeoJSON, GeoPackage (.gpkg), KML.

## Dados raster

Representam o espaço como uma grade de células (pixels), cada uma com um valor. São usados para:
- Imagens de satélite (Sentinel-2, Landsat)
- Modelos digitais de elevação (MDE/DEM)
- Mapas de uso e cobertura do solo
- Rasters de temperatura, precipitação, etc.

Propriedades importantes: **resolução espacial** (tamanho do pixel), **resolução radiométrica** (bits por pixel), **resolução temporal** (frequência de revisita) e **resolução espectral** (número de bandas).

Formatos comuns: GeoTIFF, COG (Cloud Optimized GeoTIFF), HDF, NetCDF.

## Sistemas de coordenadas e projeções

A Terra é um esferoide. Para representá-la em 2D, precisamos de uma **projeção cartográfica**, que sempre distorce alguma propriedade (área, forma, distância ou direção).

- **Sistema de coordenadas geográficas**: lat/long em graus (EPSG:4326 / WGS84). Usado em GPS e web maps.
- **Sistema de coordenadas projetadas**: coordenadas em metros (ex.: UTM). Ideal para medições e análises.

No Brasil, o datum oficial é o **SIRGAS 2000** (EPSG:4674). As projeções UTM (EPSG:31981 a 31985, uma por fuso) são as mais usadas em análises locais.

> Regra de ouro: nunca misture camadas com CRS diferentes sem reprojetar. No QGIS, use "Reprojetar camada" ou defina o CRS do projeto corretamente.

## Topologia

A topologia descreve as relações espaciais entre feições: adjacência, conectividade, contenção. É essencial para:
- Detectar erros (gaps, overlaps, linhas não conectadas)
- Realizar análises de rede (caminho mais curto)
- Garantir a qualidade dos dados

No QGIS, use a ferramenta "Verificador de topologia" e "Snapping" para manter a consistência.

## Operações espaciais básicas

| Operação | Descrição |
|---|---|
| **Buffer** | Cria área de influência ao redor de uma feição |
| **Intersect** | Mantém apenas a área comum entre camadas |
| **Union** | Combina camadas preservando todas as geometrias |
| **Clip** | Recorta uma camada usando outra como máscara |
| **Dissolve** | Une feições com mesmo atributo |
| **Centroid** | Calcula o centro de uma feição |
| **Convex Hull** | Menor polígono convexo que engloba um conjunto de pontos |

## Boas práticas

1. **Sempre defina o CRS** do projeto e das camadas.
2. **Use GeoPackage** em vez de Shapefile (evita problemas de encoding e limite de 10 caracteres no nome de campo).
3. **Valide a topologia** antes de análises.
4. **Documente a fonte** e a data dos dados.
5. **Faça backup** dos dados originais.
6. **Use nomes de campo descritivos** (sem espaços, acentos ou caracteres especiais).

## Referências

- QGIS Documentation: https://docs.qgis.org
- IBGE - Bases Cartográficas: https://www.ibge.gov.br
- SIRGAS 2000: https://www.sirgas.org
- EPSG Registry: https://epsg.org

> Este material é uma introdução. Para aprofundar, consulte os tutoriais específicos do portfólio em https://samuelsantos.site/tutoriais.

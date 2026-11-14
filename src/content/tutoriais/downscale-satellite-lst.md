---
title: "Downscaling Térmico de LST: Desagregação Espacial de Temperatura de Superfície"
description: "Fluxo reprodutível de Thermal Sharpening (downscaling) da Temperatura da Superfície Terrestre (LST) de 1 km para escala de paisagem, usando Random Forest e preditores multiespectrais do Sentinel-2/Landsat. IDEFLOR-Bio."
tags: ["Downscaling", "LST", "Temperatura de Superfície", "Random Forest", "Sentinel-2", "Google Colab"]
level: "Avançado"
thumbnail: "/tutoriais/downscale-satellite-lst/thumbnail.png"
---

# Downscaling Térmico de LST: Desagregação Espacial de Temperatura de Superfície

## Demonstração Visual

![Comparação do Downscaling Térmico - RDS Vitória de Souzel](/tutoriais/downscale-satellite-lst/demo/lst_downscale_comparison.png)

> **Figura:** Desagregação térmica na **Reserva de Desenvolvimento Sustentável (RDS) Vitória de Souzel / PA**:
> 1. **Esquerda (LST Bruta 1 km - MODIS):** Bloco térmico quilométrico original, pixelado e incapaz de captar heterogeneidades locais.
> 2. **Centro (Preditor de Biomassa NDVI - Sentinel-2):** Detalhamento espectral a 10-30 metros, mapeando o contraste entre a matriz florestal, ilhas fluviais e áreas antrópicas.
> 3. **Direita (LST Desagregada - Downscaled):** Temperatura de superfície refinada na escala de paisagem, evidenciando o amortecimento térmico em matas ciliares e o aquecimento em zonas de borda e solo exposto, com conservação estrita da energia radiativa original.

## 1. Visão Geral

Sensores termais orbitais de alta frequência temporal, como MODIS e Sentinel-3 SLSTR, fornecem observações diárias de Temperatura da Superfície Terrestre (LST), porém em resolução espacial quilométrica (1.000 metros por pixel). Essa escala é insuficiente para a caracterização de heterogeneidades na vegetação, zonas de borda de florestas e estresse hídrico local.

Este projeto disponibiliza um fluxo reprodutível de **Thermal Sharpening** baseado no trabalho de Panagiotis Sismanidis (*downscale-satelliteLST*). O método correlaciona os dados térmicos de baixa resolução com preditores multiespectrais de alta resolução espacial (índices de vegetação como NDVI e bandas de reflectância do Sentinel-2 ou Landsat), aplicando ajuste por **Random Forest** e preservação do balanço de resíduos espaciais.

## 2. O Problema

A LST é uma variável crítica para:
- Caracterização de microclima em UCs
- Análise de gradiente térmico de paisagem
- Avaliação de resiliência florestal
- Identificação de ilhas de calor

Mas a resolução de 1 km (MODIS) não captura variações locais. O downscaling resolve isso refinando a LST para 10-30 m, usando preditores de alta resolução.

## 3. Metodologia

### 3.1 Preditor multiespectral
Usa índices de vegetação (NDVI) e bandas de reflectância do Sentinel-2/Landsat como preditores de alta resolução espacial.

### 3.2 Ajuste por Random Forest
Treina um modelo Random Forest que relaciona LST (baixa resolução) com preditores (alta resolução).

### 3.3 Preservação do balanço de resíduos
Garante que a energia radiativa original seja conservada: a LST desagregada, ao ser reagregada para 1 km, deve coincidir com a LST original.

## 4. Fluxo de Trabalho

1. **Seleção da Área de Interesse:** Unidades de Conservação IDEFLOR-Bio
2. **Coleta de LST de baixa resolução:** MODIS (1 km) ou Sentinel-3 SLSTR
3. **Coleta de preditores de alta resolução:** Sentinel-2 NDVI, bandas de reflectância
4. **Treinamento do modelo Random Forest**
5. **Predição da LST em alta resolução**
6. **Correção de resíduos** (preservação do balanço energético)
7. **Validação e exportação** dos resultados

## 5. Aplicações

- Análise de microclima em UCs
- Gradiente térmico de paisagem
- Resiliência florestal
- Monitoramento de ilhas de calor urbanas
- Avaliação de estresse hídrico

## Download

Acesse o notebook no Google Colab: [Abrir no Google Colab](https://colab.research.google.com/github/samuel-c-santos/satellite-lst-downscaler/blob/main/LST_Downscaling_IDEFLORBio_Colab.ipynb)

Repositório: https://github.com/samuel-c-santos/satellite-lst-downscaler

## Créditos

Desenvolvido por Samuel da Costa dos Santos (samuelsantos.site) para o IDEFLOR-Bio.

Baseado no trabalho de Panagiotis Sismanidis (*downscale-satelliteLST*).

## Licença

MIT

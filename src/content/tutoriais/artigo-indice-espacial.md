---
title: "O que acontece quando você roda uma consulta espacial sem índice"
description: "Explicação prática sobre índices espaciais (R-Tree/GiST) e impacto em performance."
tags: ["PostGIS", "SQL", "Índice Espacial", "Performance"]
level: "Intermediário"
thumbnail: "/tutoriais/artigo-indice-espacial/thumbnail.png"
---

![Capa do artigo: Por que sua consulta espacial trava o computador?](/tutoriais/artigo-indice-espacial/capa_artigo.png)

# O que realmente acontece quando você roda uma consulta espacial sem índice

Um banco de dados guarda geometria no disco exatamente como guarda qualquer outro dado: gravando uma linha atrás da outra, na sequência em que elas chegam.

O software não tem noção de mapa, de vizinhança ou de proximidade territorial. Para o PostGIS, para o SQLite ou para o QGIS, uma tabela com cinco milhões de propriedades rurais é apenas um arquivo com cinco milhões de linhas desordenadas.

Quando você pede para cruzar essa camada com outra, ou tenta descobrir quais feições encostam em uma determinada coordenada, o programa se depara com um problema físico. Ele precisa ler o arquivo do início ao fim.

## O custo real da geometria

Em tabelas convencionais de texto ou números, comparar um valor é uma operação simples de igualdade. Na geometria não funciona assim.

Para saber se um ponto está dentro de um polígono, o computador precisa rodar algoritmos como o traçado de raios (ray casting). Ele traça uma semirreta imaginária a partir do ponto e conta quantas vezes essa linha cruza as bordas do polígono.

Se o polígono é um retângulo de 4 vértices, a conta é rápida. Se é um imóvel rural delimitado por curva de rio com 3.000 vértices, cada teste exige centenas de cálculos de produto vetorial e ponto em segmento.

Multiplique esse esforço por milhões de registros espalhados pelo arquivo. O programa é obrigado a buscar cada registro no disco, carregar a lista de coordenadas para a memória e executar essa matemática repetidamente, inclusive para feições que estão a milhares de quilômetros da sua área de interesse.

O computador não trava porque o arquivo é grande. Ele trava porque foi instruído a calcular trigonometria em cinco milhões de geometrias que não tinham a menor chance de encostar no seu alvo.

![Varredura sequencial lendo linha por linha no disco](/tutoriais/artigo-indice-espacial/full_scan.png)

## A simplificação geométrica

> Continue no repositório original para o conteúdo completo.

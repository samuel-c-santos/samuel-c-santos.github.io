---
title: "Automação de Mapas de Localização no QGIS com PyQGIS"
description: "Tutorial completo para criar mapas de localização padronizados automaticamente usando Python no QGIS, com três níveis de recorte geográfico: nacional, estadual e municipal."
date: 2026-01-12
tags: ["QGIS", "PyQGIS", "Python", "Automação", "Cartografia"]
level: "Intermediário"
thumbnail: "/tutoriais/pyqgis-location-map-tutorial/thumbnail.png"
---

# Automação de Mapas de Localização no QGIS

Aprenda a criar mapas de localização padronizados automaticamente usando Python no QGIS. Gere mapas com recortes municipal, estadual e nacional de forma rápida e profissional.

## Demonstração em Vídeo

Assista a uma demonstração completa do processo de automação:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px; margin: 1.5rem 0;">
  <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/mlcSLiDJbI4" title="Demonstração: Automação de Mapas no QGIS" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Introdução

Este tutorial apresenta um fluxo de trabalho completo para automatizar a criação de mapas de localização no QGIS. Utilizando scripts Python, você será capaz de gerar mapas padronizados com três níveis de recorte geográfico: nacional (América do Sul), estadual e municipal.

A automação elimina tarefas repetitivas e garante consistência visual em todos os mapas produzidos, sendo ideal para projetos que necessitam de múltiplos mapas de localização com layout padronizado.

**O que você vai aprender:**
- Configurar e executar scripts Python no Console do QGIS
- Carregar e filtrar camadas geográficas automaticamente
- Utilizar variáveis de projeto para parametrizar layouts
- Gerar layouts de impressão automatizados a partir de templates

## Pré-requisitos

- **QGIS:** Versão 3.x instalada e configurada
- Conhecimentos básicos de QGIS e navegação de interface
- Arquivos de dados geográficos (Shapefiles de América do Sul, Estados, Municípios e Hidrografia)
- Logo da instituição em formato de imagem (PNG, JPG ou SVG)

> **Atenção:** Certifique-se de baixar o pacote completo de arquivos antes de iniciar. O link para download está disponível no primeiro passo do tutorial.

## 1. Preparação dos Arquivos

### Download dos Arquivos

Antes de iniciar, certifique-se de ter baixado o pacote de dados e scripts.

**Download Necessário:** Acesse o link do Google Drive e baixe o pacote completo: [Link para Download](https://drive.google.com/drive/folders/1gqdf-Fn3dCYARfCbP6__PsESfXvsYGzq?usp=sharing). Descompacte a pasta em um local de fácil acesso no seu computador.

## 2. Executando a Automação no QGIS

### Abrir o Terminal Python

Com um projeto novo em branco no QGIS, acesse o menu superior **Complementos** e clique em **Terminal Python**.

![Abrindo o Terminal Python no QGIS](/tutoriais/pyqgis-location-map-tutorial/img/2.em_um_novo_projeto_abra_o_terminal_python.png)

### Expandir o Editor

O terminal abrirá na parte inferior ou lateral. Clique no ícone **Mostrar Editor** (papel com lápis) para expandir a área de código.

![Expandindo o editor do Terminal Python](/tutoriais/pyqgis-location-map-tutorial/img/3.clique_em_mostrar_editor.png)

### Abrir o Script

Na barra de ferramentas do editor, clique no ícone da **Pasta (Abrir Script)**.

![Botão para abrir script Python](/tutoriais/pyqgis-location-map-tutorial/img/4.clique_em_abrir_script.png)

### Selecionar o Arquivo do Script

Navegue até a pasta onde você salvou os arquivos (Passo 1), selecione o arquivo do script principal ([Setup_Mapas_Municipais.py](/tutoriais/pyqgis-location-map-tutorial/Setup_Mapas_Municipais.py)) e clique em Abrir.

![Selecionando o script de configuração](/tutoriais/pyqgis-location-map-tutorial/img/5.navegue_ate_o_arquivo_de_configuracao.png)

### Executar o Script

O código aparecerá no editor. Clique no botão **Executar Script** (o ícone de "Play" verde) na barra de ferramentas do terminal.

![Executando o script Python](/tutoriais/pyqgis-location-map-tutorial/img/6.clique_em_executar.png)

### Configuração Inicial

A janela **"1. Configuração Inicial"** será aberta. Clique nos botões **"..."** para selecionar os arquivos Shapefile correspondentes (América do Sul, Estados/UFs, Municípios e Hidrografia) que estão na pasta de dados.

![Interface de configuração inicial](/tutoriais/pyqgis-location-map-tutorial/img/7.carregue_as_camadas.png)

### Carregar Logo da Instituição

É fundamental selecionar também o arquivo de imagem para a **Logo da Instituição** (suporta .png, .jpg, .svg). Após preencher todos os campos, clique em **Carregar Camadas e Logo**.

![Selecionando a logo da instituição](/tutoriais/pyqgis-location-map-tutorial/img/8.carregue_inclusive_a_logomarca_da_instituicao.png)

### Filtrar Estado e Município

O script carregará as camadas e abrirá automaticamente a janela **"2. Filtro e Layout"**. Selecione o **Estado** e o **Município** desejado para o mapa. O script calculará automaticamente as escalas e enquadramentos ideais. Clique em **Aplicar e Gerar Variáveis**.

![Interface de filtro de estado e município](/tutoriais/pyqgis-location-map-tutorial/img/9.depois_de_clicar_em_carregar_filtre_estado_e_municipio.png)

### Verificar Resultado

Pronto! Observe que as camadas foram carregadas, organizadas na ordem correta, estilizadas (cores padronizadas) e o zoom foi centralizado no município escolhido. Além disso, as **Variáveis de Projeto** já foram gravadas na memória do QGIS.

![Camadas carregadas e configuradas](/tutoriais/pyqgis-location-map-tutorial/img/10.perceba_que_carregaram_corretamente.png)

**Resultado Esperado:**
- Camadas geográficas carregadas no painel de camadas
- Mapa centralizado no município selecionado
- Estilos aplicados automaticamente às camadas

> **Dica:** Se o mapa aparecer em branco ou desatualizado, pressione a tecla **F5** para forçar a atualização.

## 3. Gerando o Layout Automático

Com as variáveis calculadas e as camadas configuradas, agora vamos aplicar o modelo de impressão (Layout) que lerá essas informações automaticamente.

### Abrir Gerenciador de Layout

No menu superior do QGIS, vá em **Projeto** e clique em **Gerenciador de Layout...**.

![Acessando o gerenciador de layout](/tutoriais/pyqgis-location-map-tutorial/img/11.abra_gerenciador_de_layout.png)

### Selecionar Modelo

Na janela que abrir, localize a seção inferior chamada "Novo a partir do modelo". No menu suspenso, escolha a opção **Específico** e clique no botão de **três pontos (...)** para buscar o arquivo.

![Selecionando modelo específico](/tutoriais/pyqgis-location-map-tutorial/img/12.selecione_novo_a_partir_do_modelo-especifico.png)

### Carregar Template

Navegue até a pasta onde você salvou o kit e selecione o arquivo de modelo (ex: `Layout.qpt`). Clique em **Abrir**.

![Selecionando o arquivo de template](/tutoriais/pyqgis-location-map-tutorial/img/13.selecione_o_layout_e_confirme_em_criar.png)

### Criar Layout

Certifique-se de que o caminho está correto e clique no botão **Criar...** (Create). Dê um nome para o seu mapa (ex: "Mapa de Localização") na caixa que aparecerá e confirme.

![Confirmando a criação do layout](/tutoriais/pyqgis-location-map-tutorial/img/14.confirme.png)

### Verificar Mapa Gerado

O layout abrirá automaticamente preenchido!

Observe que:
- Os 3 mapas (Brasil, Estado, Município) estão centralizados corretamente
- O título mudou sozinho para o nome da cidade escolhida
- A barra de escala está ajustada
- A logo da instituição foi inserida

![Layout de mapa completo e pronto](/tutoriais/pyqgis-location-map-tutorial/img/15.mapa_pronto.png)

> **Dica:** Se o mapa aparecer em branco ou desatualizado, pressione a tecla **F5** para forçar a atualização.

### Exportar o Mapa

Finalize seu trabalho clicando nos ícones da barra superior para **Exportar como Imagem** (JPG/PNG) ou **Exportar como PDF**.

![Opções de exportação do mapa](/tutoriais/pyqgis-location-map-tutorial/img/16.podemos_exportar_como_imagem_ou_pdf.png)

## Vantagens desta Abordagem

- **Eficiência:** Gere múltiplos mapas em poucos minutos, sem configurações manuais repetitivas.
- **Padronização:** Todos os mapas seguem o mesmo estilo visual e estrutura, garantindo qualidade profissional.
- **Escalabilidade:** Facilmente adaptável para diferentes municípios, estados ou até outros países.
- **Reutilização:** O template de layout pode ser reaproveitado em projetos futuros com pequenos ajustes.

## Download dos Arquivos

Acesse o repositório no GitHub com todos os scripts, dados de exemplo e templates necessários: [Ver no GitHub](https://github.com/samuel-c-santos/pyqgis-location-map-tutorial).

## Conclusão

Neste tutorial, você aprendeu a automatizar completamente a criação de mapas de localização no QGIS usando Python. Essa técnica economiza tempo valioso e garante que todos os seus mapas tenham a mesma qualidade profissional.

A automação de tarefas no QGIS através do PyQGIS é uma habilidade poderosa que pode ser aplicada a diversos outros fluxos de trabalho geoespaciais. Continue explorando e experimentando para otimizar seus projetos!

## Contato

Tem dúvidas ou sugestões? Entre em contato:
- Email: samuelsantosambiental@gmail.com
- LinkedIn: https://www.linkedin.com/in/samuel-c-santos/
- GitHub: https://github.com/samuel-c-santos

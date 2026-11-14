from qgis.core import (
    QgsProject,
    QgsCategorizedSymbolRenderer,
    QgsRendererCategory,
    QgsSymbol,
)
from qgis.utils import iface
from qgis.PyQt.QtGui import QColor # Compatibilidade para versões antigas do QGIS
from qgis.PyQt.QtCore import QVariant

# --- Parâmetros ---
LAYER_NAMES = [
    "mapbiomas-brazil-collection-100-braganca-2024" #liste todas as camadas vetoriais mapbiomas que desejar aplicar
]

# Campos do Join
CLASSIFICATION_FIELD = 'COLEÇÃO'      # Nome da classe (Português)
HEXACODE_FIELD = 'Hexacode N'         # Cor hexadecimal

# --- Função Principal ---
def apply_mapbiomas_symbology(layer_names, class_field, hex_field):
    project = QgsProject.instance()
    
    # 1. Obter a camada de referência
    first_layer = project.mapLayersByName(layer_names[0])
    if not first_layer:
        print("ERRO: A camada de referência não foi encontrada no projeto.")
        return
    first_layer = first_layer[0]
    
    # 2. Mapear a Classificação para a Cor
    classification_map = {}
    
    try:
        print(f"Buscando valores de classificação e cor na camada: {first_layer.name()}...")
        
        for feature in first_layer.getFeatures():
            try:
                # Nota: Os valores dos campos virão como strings após o join
                class_name = feature[class_field]
                hex_code = feature[hex_field]
                
                if class_name and hex_code and class_name not in classification_map:
                    # Remove espaços desnecessários (Trim) e garante que o hash está presente
                    class_name = str(class_name).strip()
                    hex_code = str(hex_code).strip()
                    if not hex_code.startswith('#'):
                        hex_code = '#' + hex_code
                        
                    classification_map[class_name] = hex_code
                
            except KeyError:
                print(f"ERRO: Campos ('{class_field}' ou '{hex_field}') não encontrados. Verifique o nome exato dos campos após o join.")
                return
            
        print(f"Classes únicas encontradas: {len(classification_map)}.")

    except Exception as e:
        print(f"ERRO ao processar feições: {e}")
        return

    if not classification_map:
        print("Nenhuma classificação válida encontrada.")
        return

    # 3. Criar as Categorias de Simbologia
    categories = []
    for class_name, hex_code in classification_map.items():
        
        # Cria o símbolo (preenchimento padrão da geometria da camada)
        symbol = QgsSymbol.defaultSymbol(first_layer.geometryType())
        
        # Define a cor do preenchimento e da borda
        color = QColor(hex_code)
        symbol.setColor(color)
        
        # CORREÇÃO: Ordem posicional de argumentos para QgsRendererCategory (valor, símbolo, rótulo)
        category = QgsRendererCategory(
            class_name,    # Valor (key for categorization)
            symbol,        # Símbolo
            class_name     # Rótulo (label)
        )
        categories.append(category)

    # 4. Aplicar o Renderer em todas as camadas de destino
    for layer_name in layer_names:
        layers = project.mapLayersByName(layer_name)
        if layers:
            layer = layers[0]
            
            # Cria o Renderer Categorizado, usando o campo 'COLEÇÃO' como a chave de classificação
            renderer = QgsCategorizedSymbolRenderer(class_field, categories)
            layer.setRenderer(renderer)
            
            # Atualiza a legenda e a visualização do mapa
            layer.triggerRepaint()
            print(f"Simbologia aplicada com sucesso na camada: {layer.name()}")
        else:
            print(f"AVISO: Camada '{layer_name}' não encontrada para aplicar a simbologia.")

    # Atualiza a interface do QGIS
    iface.mapCanvas().refresh()
    print("\nProcesso de Simbologia Concluído.")


# --- Execução ---
apply_mapbiomas_symbology(LAYER_NAMES, CLASSIFICATION_FIELD, HEXACODE_FIELD)
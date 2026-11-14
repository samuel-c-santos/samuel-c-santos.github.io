import math
from qgis.core import (
    QgsProject, QgsVectorLayer, QgsDistanceArea, QgsPointXY,
    QgsExpressionContextUtils, QgsSingleSymbolRenderer, QgsSymbol
)
from qgis.PyQt.QtWidgets import QInputDialog
from qgis.PyQt.QtGui import QColor

# ==============================================================================
# BLOCO DE LIMPEZA (REMOVE TODAS AS CAMADAS DO PROJETO)
# ==============================================================================
def limpar_tudo():
    project = QgsProject.instance()
    
    # 1. REMOVE TODAS AS CAMADAS
    project.removeAllMapLayers()
    
    # 2. LIMPA VARIÁVEIS ANTIGAS
    escopo = QgsExpressionContextUtils.projectScope(project)
    vars_alvo = ["municipio", "escala", "segmento", "xmin", "xmax", "ymin", "ymax"]
    for v in vars_alvo:
        if escopo.hasVariable(v):
            QgsExpressionContextUtils.removeProjectVariable(project, v)

# Executa a limpeza
limpar_tudo()
# ==============================================================================


# --- CONFIGURAÇÕES ATUALIZADAS ---
CONFIG = {
    'UF_ALVO': 'PA',
    # Novas dimensões que você definiu para caber o título
    'FRAME_WIDTH_MM': 276.550,
    'FRAME_HEIGHT_MM': 178.985
}

# --- FUNÇÕES MATEMÁTICAS ---
def calculate_smart_scale(extent, map_w_mm, map_h_mm, layer):
    d = QgsDistanceArea()
    d.setSourceCrs(layer.crs(), QgsProject.instance().transformContext())
    d.setEllipsoid('WGS84')
    p_min = QgsPointXY(extent.xMinimum(), extent.yMinimum())
    p_max_x = QgsPointXY(extent.xMaximum(), extent.yMinimum())
    p_max_y = QgsPointXY(extent.xMinimum(), extent.yMaximum())
    
    # Margem de segurança de 5%
    geo_w_m = d.measureLine(p_min, p_max_x) * 1.05
    geo_h_m = d.measureLine(p_min, p_max_y) * 1.05
    
    map_w_m = map_w_mm / 1000.0
    map_h_m = map_h_mm / 1000.0
    
    scale = max(geo_w_m / map_w_m, geo_h_m / map_h_m)
    
    ordem = 10 ** math.floor(math.log10(scale))
    base = scale / ordem
    degraus = [1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.5, 8.0, 10.0]
    mult = 10.0
    for degrau in degraus:
        if degrau >= base: mult = degrau; break
    return int(mult * ordem)

def calculate_segment_size(scale, map_width_mm):
    largura_mundo_m = (map_width_mm / 1000.0) * scale
    alvo_segmento = largura_mundo_m / 5.0 
    ordem = 10 ** math.floor(math.log10(alvo_segmento))
    base = alvo_segmento / ordem
    if base < 1.5: mult = 1
    elif base < 3.5: mult = 2
    elif base < 7.5: mult = 5
    else: mult = 10
    return int(mult * ordem)

def calculate_map_extents(center, scale, map_w_mm, map_h_mm, layer_crs):
    world_w = (map_w_mm / 1000.0) * scale
    world_h = (map_h_mm / 1000.0) * scale
    half_w, half_h = world_w / 2, world_h / 2
    if layer_crs.isGeographic():
        half_w /= 111132.0; half_h /= 111132.0 
    return {
        "xmin": center.x() - half_w, "xmax": center.x() + half_w,
        "ymin": center.y() - half_h, "ymax": center.y() + half_h
    }

# --- MAIN ---
def main():
    import geobr
    print(f"Baixando lista ({CONFIG['UF_ALVO']})...")
    gdf = geobr.read_municipality(code_muni=CONFIG['UF_ALVO'], year=2020, verbose=False)
    
    nomes = sorted(gdf['name_muni'].unique().tolist())
    item, ok = QInputDialog.getItem(None, "Tutorial", "Escolha:", nomes, 0, False)
    if not (ok and item): return

    # Filtra e Cria Layer
    gdf_sel = gdf[gdf['name_muni'] == item]
    json_data = gdf_sel.to_json()
    layer = QgsVectorLayer(json_data, f"{item}", "ogr")
    
    if not layer.isValid(): return

    # Estilo
    symbol = QgsSymbol.defaultSymbol(layer.geometryType())
    symbol.setColor(QColor("white"))
    symbol.symbolLayer(0).setStrokeColor(QColor("black"))
    layer.setRenderer(QgsSingleSymbolRenderer(symbol))
    
    QgsProject.instance().addMapLayer(layer)
    
    # Cálculos
    extent = layer.extent()
    scale = calculate_smart_scale(extent, CONFIG['FRAME_WIDTH_MM'], CONFIG['FRAME_HEIGHT_MM'], layer)
    seg_size = calculate_segment_size(scale, CONFIG['FRAME_WIDTH_MM'])
    bbox = calculate_map_extents(extent.center(), scale, CONFIG['FRAME_WIDTH_MM'], CONFIG['FRAME_HEIGHT_MM'], layer.crs())
    
    # Grava Variáveis
    p = QgsProject.instance()
    u = QgsExpressionContextUtils
    u.setProjectVariable(p, 'municipio', item)
    u.setProjectVariable(p, 'escala', str(scale))
    u.setProjectVariable(p, 'segmento', str(seg_size))
    u.setProjectVariable(p, 'xmin', str(bbox['xmin']))
    u.setProjectVariable(p, 'xmax', str(bbox['xmax']))
    u.setProjectVariable(p, 'ymin', str(bbox['ymin']))
    u.setProjectVariable(p, 'ymax', str(bbox['ymax']))
    
    print(f"Limpo e carregado: {item}")
    print(f"Dimensões consideradas: {CONFIG['FRAME_WIDTH_MM']} x {CONFIG['FRAME_HEIGHT_MM']} mm")

main()
import math
from qgis.core import (QgsProject, QgsVectorLayer, QgsSymbol, 
                       QgsSingleSymbolRenderer, QgsFillSymbol, QgsFeatureRequest,
                       QgsMapThemeCollection, QgsExpressionContextUtils, 
                       QgsDistanceArea, QgsPointXY, QgsRectangle, QgsCoordinateReferenceSystem)
from qgis.utils import iface
from PyQt5.QtWidgets import (QDialog, QVBoxLayout, QPushButton, QLabel, 
                             QFileDialog, QComboBox, QLineEdit, QHBoxLayout, QMessageBox, QGroupBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QColor

# --- DIMENSÕES FIXAS DO LAYOUT (em milímetros) ---
DIM_MAPA_1_2 = {"w": 65.0, "h": 45.0}  # Brasil e Estado
DIM_MAPA_3   = {"w": 139.266, "h": 73.287} # Município

# --- CONFIGURAÇÃO DE ESTILOS ---
STYLES = {
    "america_sul": {"color": "#e0e0e0", "outline": "black"},
    "unidades_federativas": {"color": "#ffffff", "outline": "black"}, 
    "estado_destaque": {"color": "#ffbdbe", "outline": "black"},      
    "municipio_destaque": {"color": "#fdbf6f", "outline": "black"},   
    "hidrografia": {"color": "#01c4ff", "outline": "transparent"}     
}

# --- FUNÇÕES MATEMÁTICAS ---

def get_geometry_data(layer, filter_expression=None):
    """Retorna extent e centro da geometria filtrada"""
    if filter_expression:
        req = QgsFeatureRequest().setFilterExpression(filter_expression)
        feats = [f for f in layer.getFeatures(req)]
        if feats:
            extent = feats[0].geometry().boundingBox()
            for f in feats[1:]:
                extent.combineExtentWith(f.geometry().boundingBox())
        else:
            extent = layer.extent()
    else:
        extent = layer.extent()
    
    return extent, extent.center()

def calculate_smart_scale(extent, map_w_mm, map_h_mm, layer):
    """Calcula escala redonda com passos intermediários."""
    d = QgsDistanceArea()
    d.setSourceCrs(layer.crs(), QgsProject.instance().transformContext())
    d.setEllipsoid('WGS84')
    
    p_min = QgsPointXY(extent.xMinimum(), extent.yMinimum())
    p_max_x = QgsPointXY(extent.xMaximum(), extent.yMinimum())
    p_max_y = QgsPointXY(extent.xMinimum(), extent.yMaximum())
    
    geo_w_m = d.measureLine(p_min, p_max_x)
    geo_h_m = d.measureLine(p_min, p_max_y)
    
    map_w_m = map_w_mm / 1000.0
    map_h_m = map_h_mm / 1000.0
    
    # Margem de segurança (5%)
    geo_w_m *= 1.05
    geo_h_m *= 1.05
    
    scale_x = geo_w_m / map_w_m
    scale_y = geo_h_m / map_h_m
    raw_scale = max(scale_x, scale_y)
    
    # Arredondamento com degraus
    ordem = 10 ** math.floor(math.log10(raw_scale))
    base = raw_scale / ordem
    
    degraus = [1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 7.5, 8.0, 10.0]
    mult = 10.0
    for degrau in degraus:
        if degrau >= base:
            mult = degrau
            break
            
    final_scale = int(mult * ordem)
    return final_scale

def calculate_map_extents(center_point, scale, map_w_mm, map_h_mm, layer_crs):
    """Calcula os limites (xmin, xmax...) para centralizar o mapa."""
    world_w_meters = (map_w_mm / 1000.0) * scale
    world_h_meters = (map_h_mm / 1000.0) * scale
    
    half_w = 0; half_h = 0
    
    if layer_crs.isGeographic():
        meters_per_deg_lat = 111132.0
        lat_rad = math.radians(center_point.y())
        meters_per_deg_lon = 111132.0 * math.cos(lat_rad)
        if meters_per_deg_lon < 1.0: meters_per_deg_lon = 1.0
        
        deg_w = world_w_meters / meters_per_deg_lon
        deg_h = world_h_meters / meters_per_deg_lat
        half_w = deg_w / 2; half_h = deg_h / 2
    else:
        half_w = world_w_meters / 2; half_h = world_h_meters / 2

    return {
        "xmin": center_point.x() - half_w,
        "xmax": center_point.x() + half_w,
        "ymin": center_point.y() - half_h,
        "ymax": center_point.y() + half_h
    }

def calcular_unidade_escala_barra(width_m):
    alvo = width_m / 4
    if alvo <= 0: return 1000
    ordem = 10 ** math.floor(math.log10(alvo))
    base = alvo / ordem
    if base < 1.5: mult = 1
    elif base < 3.5: mult = 2
    elif base < 7.5: mult = 5
    else: mult = 10
    return int(mult * ordem)

# --- INTERFACE ---
class ImportDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("1. Configuração Inicial")
        self.resize(500, 300)
        self.layout = QVBoxLayout()
        self.inputs = {}
        
        self.layers_config = [
            ("América do Sul", "america_sul", "Shapefiles (*.shp)"),
            ("Estados / UFs (Brasil)", "estados_br", "Shapefiles (*.shp)"), 
            ("Municípios", "municipios", "Shapefiles (*.shp)"),
            ("Corpos D'água", "hidrografia", "Shapefiles (*.shp)"),
            ("Logo da Instituição", "logo_path", "Imagens (*.png *.jpg *.jpeg *.svg)")
        ]

        for label_text, key, file_filter in self.layers_config:
            h_layout = QHBoxLayout()
            lbl = QLabel(label_text)
            line_edit = QLineEdit()
            btn = QPushButton("...")
            btn.clicked.connect(lambda checked, le=line_edit, ff=file_filter: self.select_file(le, ff))
            h_layout.addWidget(lbl)
            h_layout.addWidget(line_edit)
            h_layout.addWidget(btn)
            self.layout.addLayout(h_layout)
            self.inputs[key] = line_edit

        self.btn_run = QPushButton("Carregar Camadas e Logo")
        self.btn_run.clicked.connect(self.accept)
        self.layout.addWidget(self.btn_run)
        self.setLayout(self.layout)

    def select_file(self, line_edit, file_filter):
        file_path, _ = QFileDialog.getOpenFileName(self, "Selecione o Arquivo", "", file_filter)
        if file_path: line_edit.setText(file_path)

    def get_paths(self):
        return {key: widget.text() for key, widget in self.inputs.items() if widget.text()}

class FilterDialog(QDialog):
    def __init__(self, layer_brasil, layer_estado_destaque, layer_mun):
        super().__init__()
        self.setWindowTitle("2. Filtro e Layout")
        self.resize(400, 250)
        self.layer_br = layer_brasil
        self.layer_est = layer_estado_destaque
        self.layer_mun = layer_mun
        self.layout = QVBoxLayout()
        
        group_sel = QGroupBox("Seleção")
        l_sel = QVBoxLayout()
        l_sel.addWidget(QLabel("Estado:"))
        self.combo_uf = QComboBox()
        self.populate_ufs()
        self.combo_uf.currentTextChanged.connect(self.update_municipios)
        l_sel.addWidget(self.combo_uf)
        l_sel.addWidget(QLabel("Município:"))
        self.combo_mun = QComboBox()
        l_sel.addWidget(self.combo_mun)
        group_sel.setLayout(l_sel)
        self.layout.addWidget(group_sel)
        
        self.btn_apply = QPushButton("Aplicar e Gerar Variáveis")
        self.btn_apply.clicked.connect(self.apply_filter)
        self.layout.addWidget(self.btn_apply)
        self.setLayout(self.layout)
        
        if self.combo_uf.count() > 0: self.update_municipios(self.combo_uf.currentText())

    def populate_ufs(self):
        idx = self.layer_est.fields().indexOf('NM_UF')
        if idx == -1: idx = self.layer_est.fields().indexOf('SIGLA')
        if idx != -1:
            values = self.layer_est.uniqueValues(idx)
            self.combo_uf.addItems(sorted([str(v) for v in values]))

    def update_municipios(self, uf_selecionada):
        self.combo_mun.clear()
        field_uf_mun = 'NM_UF' if self.layer_mun.fields().indexOf('NM_UF') != -1 else 'SIGLA_UF'
        req = QgsFeatureRequest()
        if self.layer_mun.fields().indexOf(field_uf_mun) != -1:
             req.setFilterExpression(f"\"{field_uf_mun}\" = '{uf_selecionada}'")
        
        municipios = []
        possibles = ['NM_MUN', 'NM_MUNICIP', 'NOME', 'name', 'MUNICIPIO']
        name_field = next((f for f in possibles if self.layer_mun.fields().indexOf(f) != -1), None)
        if not name_field: return
        for feat in self.layer_mun.getFeatures(req): municipios.append(feat[name_field])
        self.combo_mun.addItems(sorted(municipios))

    def apply_filter(self):
        uf = self.combo_uf.currentText()
        mun = self.combo_mun.currentText()
        
        # 1. Filtro do Estado (Simples)
        field_uf_est = 'NM_UF' if self.layer_est.fields().indexOf('NM_UF') != -1 else 'SIGLA'
        self.layer_est.setSubsetString(f"\"{field_uf_est}\" = '{uf}'")
        self.layer_est.setName(uf)
        
        # 2. Filtro do Município (COMPOSTO: Nome E Estado)
        possibles = ['NM_MUN', 'NM_MUNICIP', 'NOME', 'name', 'MUNICIPIO']
        name_field = next((f for f in possibles if self.layer_mun.fields().indexOf(f) != -1), None)
        
        # Tenta achar o campo de UF no município também
        field_uf_mun = 'NM_UF' if self.layer_mun.fields().indexOf('NM_UF') != -1 else 'SIGLA_UF'
        
        if name_field:
            # CORREÇÃO AQUI: Filtra pelo nome do município E pelo nome do estado para evitar homônimos
            if self.layer_mun.fields().indexOf(field_uf_mun) != -1:
                expr_mun = f"\"{name_field}\" = '{mun}' AND \"{field_uf_mun}\" = '{uf}'"
            else:
                # Se não achar campo de UF no município, vai só pelo nome (risco, mas fallback necessário)
                expr_mun = f"\"{name_field}\" = '{mun}'"
                
            self.layer_mun.setSubsetString(expr_mun)
            self.layer_mun.setName(mun)
            
            # --- CÁLCULO GERAL (Usando a expressão composta) ---
            
            # 1. MUNICÍPIO
            ext_mun, center_mun = get_geometry_data(self.layer_mun, expr_mun)
            scale_mun = calculate_smart_scale(ext_mun, DIM_MAPA_3['w'], DIM_MAPA_3['h'], self.layer_mun)
            bbox_mun = calculate_map_extents(center_mun, scale_mun, DIM_MAPA_3['w'], DIM_MAPA_3['h'], self.layer_mun.crs())
            
            # 2. ESTADO
            ext_est, center_est = get_geometry_data(self.layer_est, f"\"{field_uf_est}\" = '{uf}'")
            scale_est = calculate_smart_scale(ext_est, DIM_MAPA_1_2['w'], DIM_MAPA_1_2['h'], self.layer_est)
            bbox_est = calculate_map_extents(center_est, scale_est, DIM_MAPA_1_2['w'], DIM_MAPA_1_2['h'], self.layer_est.crs())

            # 3. BRASIL
            ext_br, center_br = get_geometry_data(self.layer_br)
            scale_br = calculate_smart_scale(ext_br, DIM_MAPA_1_2['w'], DIM_MAPA_1_2['h'], self.layer_br)
            if scale_br > 150000000: scale_br = 100000000
            bbox_br = calculate_map_extents(center_br, scale_br, DIM_MAPA_1_2['w'], DIM_MAPA_1_2['h'], self.layer_br.crs())
            
            # Barra
            d = QgsDistanceArea(); d.setEllipsoid('WGS84'); d.setSourceCrs(self.layer_mun.crs(), QgsProject.instance().transformContext())
            p1 = QgsPointXY(ext_mun.xMinimum(), ext_mun.yMinimum()); p2 = QgsPointXY(ext_mun.xMaximum(), ext_mun.yMinimum())
            w_mun_m = d.measureLine(p1, p2)
            escala_barra = calcular_unidade_escala_barra(w_mun_m)

            # SALVAR VARIÁVEIS
            utils = QgsExpressionContextUtils; proj = QgsProject.instance()
            
            utils.setProjectVariable(proj, 'meu_municipio', mun)
            utils.setProjectVariable(proj, 'meu_estado', uf)
            utils.setProjectVariable(proj, 'zoom_municipio', str(scale_mun))
            utils.setProjectVariable(proj, 'zoom_estado', str(scale_est))
            utils.setProjectVariable(proj, 'zoom_brasil', str(scale_br))
            utils.setProjectVariable(proj, 'escala_tamanho', str(escala_barra))
            
            utils.setProjectVariable(proj, 'mapa1_xmin', str(bbox_br['xmin'])); utils.setProjectVariable(proj, 'mapa1_xmax', str(bbox_br['xmax']))
            utils.setProjectVariable(proj, 'mapa1_ymin', str(bbox_br['ymin'])); utils.setProjectVariable(proj, 'mapa1_ymax', str(bbox_br['ymax']))
            utils.setProjectVariable(proj, 'mapa2_xmin', str(bbox_est['xmin'])); utils.setProjectVariable(proj, 'mapa2_xmax', str(bbox_est['xmax']))
            utils.setProjectVariable(proj, 'mapa2_ymin', str(bbox_est['ymin'])); utils.setProjectVariable(proj, 'mapa2_ymax', str(bbox_est['ymax']))
            utils.setProjectVariable(proj, 'mapa3_xmin', str(bbox_mun['xmin'])); utils.setProjectVariable(proj, 'mapa3_xmax', str(bbox_mun['xmax']))
            utils.setProjectVariable(proj, 'mapa3_ymin', str(bbox_mun['ymin'])); utils.setProjectVariable(proj, 'mapa3_ymax', str(bbox_mun['ymax']))
            
            self.layer_mun.updateExtents()
            iface.mapCanvas().setExtent(ext_mun)
            iface.mapCanvas().refresh()

            print(f"VARIÁVEIS GERADAS!")

        self.accept()

# --- MAIN ---
def apply_symbology(layer, style_key):
    config = STYLES[style_key]
    symbol = QgsFillSymbol.createSimple({'color': config["color"]})
    if config["outline"] == "transparent": symbol.symbolLayer(0).setStrokeStyle(Qt.NoPen)
    else: 
        symbol.symbolLayer(0).setStrokeColor(QColor(config["outline"]))
        symbol.symbolLayer(0).setStrokeWidth(0.2)
    layer.setRenderer(QgsSingleSymbolRenderer(symbol))
    layer.triggerRepaint()

def create_map_themes(loaded_layers):
    project = QgsProject.instance()
    tc = project.mapThemeCollection()
    for t in ["Localização", "Destaque"]:
        if tc.hasMapTheme(t): tc.removeMapTheme(t)
    rec_loc = QgsMapThemeCollection.MapThemeRecord()
    for k in ["america_sul", "unidades_federativas", "estado_destaque"]:
        if k in loaded_layers: rec_loc.addLayerRecord(QgsMapThemeCollection.MapThemeLayerRecord(loaded_layers[k]))
    tc.insert("Localização", rec_loc)
    rec_dest = QgsMapThemeCollection.MapThemeRecord()
    for k in ["america_sul", "unidades_federativas", "hidrografia", "municipios"]:
        if k in loaded_layers: rec_dest.addLayerRecord(QgsMapThemeCollection.MapThemeLayerRecord(loaded_layers[k]))
    tc.insert("Destaque", rec_dest)

def main():
    dialog = ImportDialog()
    if not dialog.exec_(): return
    paths = dialog.get_paths()
    loaded = {}
    
    if "logo_path" in paths and paths["logo_path"]:
        QgsExpressionContextUtils.setProjectVariable(QgsProject.instance(), 'logo_instituicao', paths["logo_path"])
        print(f"Logo salva: {paths['logo_path']}")
    
    if "america_sul" in paths:
        l = QgsVectorLayer(paths["america_sul"], "América do Sul", "ogr")
        if l.isValid(): QgsProject.instance().addMapLayer(l); apply_symbology(l, "america_sul"); loaded["america_sul"] = l
    if "estados_br" in paths:
        l_br = QgsVectorLayer(paths["estados_br"], "Unidades Federativas", "ogr")
        if l_br.isValid(): QgsProject.instance().addMapLayer(l_br); apply_symbology(l_br, "unidades_federativas"); loaded["unidades_federativas"] = l_br
        l_est = QgsVectorLayer(paths["estados_br"], "Estado Selecionado", "ogr")
        if l_est.isValid(): QgsProject.instance().addMapLayer(l_est); apply_symbology(l_est, "estado_destaque"); loaded["estado_destaque"] = l_est
    if "municipios" in paths:
        l_mun = QgsVectorLayer(paths["municipios"], "Município Destaque", "ogr") 
        if l_mun.isValid(): QgsProject.instance().addMapLayer(l_mun); apply_symbology(l_mun, "municipio_destaque"); loaded["municipios"] = l_mun
    if "hidrografia" in paths:
        l_hid = QgsVectorLayer(paths["hidrografia"], "Hidrografia", "ogr")
        if l_hid.isValid(): QgsProject.instance().addMapLayer(l_hid); apply_symbology(l_hid, "hidrografia"); loaded["hidrografia"] = l_hid
    if "estado_destaque" in loaded and "municipios" in loaded:
        filter_dlg = FilterDialog(loaded["unidades_federativas"], loaded["estado_destaque"], loaded["municipios"])
        if filter_dlg.exec_():
            create_map_themes(loaded)
main()
#!/bin/bash

# 🔍 SCRIPT DE VERIFICACIÓN COMPLETA PARA PROBLEMAS DE IMÁGENES EN MÓVILES
# Este script verifica todos los componentes del sistema paso a paso

echo "🚀 INICIANDO VERIFICACIÓN COMPLETA DEL SISTEMA"
echo "==============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_step() {
    echo -e "${BLUE}🔍 $1${NC}"
}

# 1. VERIFICAR ESTRUCTURA DE ARCHIVOS
log_step "Verificando estructura de archivos..."

if [ -f "front/.env.local" ]; then
    log_info "Archivo .env.local encontrado"
    echo "Contenido:"
    cat front/.env.local
else
    log_error "Archivo .env.local no encontrado"
fi

echo ""

if [ -f "front/.env.production" ]; then
    log_info "Archivo .env.production encontrado"
    echo "Contenido:"
    cat front/.env.production
else
    log_error "Archivo .env.production no encontrado"
fi

echo ""

# 2. VERIFICAR CONFIGURACIÓN DEL BACKEND
log_step "Verificando configuración del backend..."

if [ -f "server/index.js" ]; then
    log_info "Servidor encontrado"
    
    # Verificar configuración CORS
    if grep -q "Access-Control-Allow-Origin" server/index.js; then
        log_info "Configuración CORS encontrada"
    else
        log_error "Configuración CORS no encontrada"
    fi
    
    # Verificar ruta de uploads
    if grep -q "/uploads" server/index.js; then
        log_info "Ruta /uploads configurada"
    else
        log_error "Ruta /uploads no configurada"
    fi
    
    # Verificar puerto
    if grep -q "10000" server/index.js; then
        log_info "Puerto 10000 configurado"
    else
        log_warning "Puerto 10000 no encontrado - verificar configuración"
    fi
else
    log_error "Archivo server/index.js no encontrado"
fi

echo ""

# 3. VERIFICAR UPLOADS DIRECTORY
log_step "Verificando directorio de uploads..."

if [ -d "server/uploads" ]; then
    log_info "Directorio uploads existe"
    upload_count=$(ls -1 server/uploads 2>/dev/null | wc -l)
    log_info "Archivos en uploads: $upload_count"
    
    if [ $upload_count -gt 0 ]; then
        echo "Archivos encontrados:"
        ls -la server/uploads/
    fi
else
    log_error "Directorio uploads no existe"
fi

echo ""

# 4. VERIFICAR FUNCIONES DE IMAGEUTILS
log_step "Verificando funciones en imageUtils.js..."

if [ -f "front/src/utils/imageUtils.js" ]; then
    log_info "imageUtils.js encontrado"
    
    # Verificar funciones específicas
    functions=("isMobileDevice" "getImageUrl" "downloadImage" "preloadImage" "getOptimizedImageUrl")
    
    for func in "${functions[@]}"; do
        if grep -q "$func" front/src/utils/imageUtils.js; then
            log_info "Función $func encontrada"
        else
            log_error "Función $func no encontrada"
        fi
    done
else
    log_error "imageUtils.js no encontrado"
fi

echo ""

# 5. VERIFICAR COMPONENTES REACT
log_step "Verificando componentes React..."

# MostrarLibro.jsx
if [ -f "front/src/pages/MostrarLibro/MostrarLibro.jsx" ]; then
    log_info "MostrarLibro.jsx encontrado"
    
    if grep -q "preloadImage" front/src/pages/MostrarLibro/MostrarLibro.jsx; then
        log_info "Funcionalidad de preload implementada"
    else
        log_warning "Funcionalidad de preload no encontrada"
    fi
    
    if grep -q "isMobile" front/src/pages/MostrarLibro/MostrarLibro.jsx; then
        log_info "Detección móvil implementada"
    else
        log_warning "Detección móvil no encontrada"
    fi
else
    log_error "MostrarLibro.jsx no encontrado"
fi

# busquedas.jsx
if [ -f "front/src/pages/busquedas/busquedas.jsx" ]; then
    log_info "busquedas.jsx encontrado"
    
    if grep -q "getOptimizedImageUrl" front/src/pages/busquedas/busquedas.jsx; then
        log_info "URLs optimizadas implementadas"
    else
        log_warning "URLs optimizadas no encontradas"
    fi
else
    log_error "busquedas.jsx no encontrado"
fi

echo ""

# 6. VERIFICAR ESTILOS CSS
log_step "Verificando estilos CSS móviles..."

if [ -f "front/src/index.css" ]; then
    log_info "index.css encontrado"
    
    mobile_classes=("pinch-zoom-image" "image-action-button" "mobile-image-grid" "image-loading")
    
    for class in "${mobile_classes[@]}"; do
        if grep -q "$class" front/src/index.css; then
            log_info "Clase CSS $class encontrada"
        else
            log_warning "Clase CSS $class no encontrada"
        fi
    done
else
    log_error "index.css no encontrado"
fi

echo ""

# 7. TEST DE CONECTIVIDAD BÁSICA
log_step "Realizando test de conectividad básica..."

# Verificar si los puertos están disponibles
if command -v netstat >/dev/null 2>&1; then
    if netstat -an | grep -q ":10000"; then
        log_info "Puerto 10000 en uso (servidor backend)"
    else
        log_warning "Puerto 10000 no está en uso"
    fi
    
    if netstat -an | grep -q ":5173\|:3000\|:5174"; then
        log_info "Puerto frontend en uso"
    else
        log_warning "Puerto frontend no está en uso"
    fi
else
    log_warning "netstat no disponible para verificar puertos"
fi

echo ""

# 8. GENERAR REPORTE DE PROBLEMAS DETECTADOS
log_step "Generando reporte de problemas..."

echo ""
echo "🎯 POSIBLES CAUSAS DEL PROBLEMA DE IMÁGENES EN MÓVILES:"
echo "======================================================"

echo ""
echo "1. 🔗 CONECTIVIDAD:"
echo "   - Verificar que el backend esté corriendo en puerto 10000"
echo "   - Probar acceso directo: http://localhost:10000/render-health"
echo "   - Verificar URL de producción: https://libro-resoluciones-backend.onrender.com"

echo ""
echo "2. 📱 CONFIGURACIÓN MÓVIL:"
echo "   - Verificar que el móvil esté en la misma red WiFi"
echo "   - Usar IP local del PC: http://[IP-LOCAL]:5173"
echo "   - Ejecutar: ipconfig | grep 'IPv4'"

echo ""
echo "3. 🌐 CORS Y HEADERS:"
echo "   - Verificar headers Access-Control-Allow-Origin"
echo "   - Comprobar que /uploads esté accesible"
echo "   - Probar: curl -I http://localhost:10000/uploads/1746055049685-diagrama_ep.png"

echo ""
echo "4. 🖼️ IMÁGENES:"
echo "   - Verificar que las imágenes existan en server/uploads/"
echo "   - Comprobar permisos de lectura"
echo "   - Probar URLs completas en navegador"

echo ""
echo "🚀 PRÓXIMOS PASOS RECOMENDADOS:"
echo "==============================="
echo "1. Ejecutar backend: cd server && npm start"
echo "2. Ejecutar frontend: cd front && npm run dev"
echo "3. Obtener IP local: ipconfig"
echo "4. Probar en móvil: http://[TU-IP]:5173"
echo "5. Abrir consola del navegador móvil y ejecutar diagnostico-avanzado.js"

echo ""
echo "✅ Verificación completa finalizada"

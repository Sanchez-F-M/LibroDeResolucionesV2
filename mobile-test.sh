#!/bin/bash

# Script para probar las mejoras de visualización móvil
# mobile-test.sh

echo "🔧 Probando mejoras de visualización móvil..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "📱 Iniciando pruebas de funcionalidad móvil..."

# 1. Verificar que los archivos modificados existen
echo ""
echo "🔍 Verificando archivos modificados..."

files_to_check=(
    "front/src/utils/imageUtils.js"
    "front/src/pages/MostrarLibro/MostrarLibro.jsx"
    "front/src/pages/busquedas/busquedas.jsx"
    "front/src/index.css"
    "front/index.html"
    "server/index.js"
    "front/.env.example"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        log_info "Archivo existe: $file"
    else
        log_error "Archivo no encontrado: $file"
    fi
done

# 2. Verificar funciones móviles en imageUtils.js
echo ""
echo "🔍 Verificando funciones móviles en imageUtils.js..."

if grep -q "isMobileDevice" front/src/utils/imageUtils.js; then
    log_info "Función isMobileDevice() añadida"
else
    log_error "Función isMobileDevice() no encontrada"
fi

if grep -q "preloadImage" front/src/utils/imageUtils.js; then
    log_info "Función preloadImage() añadida"
else
    log_error "Función preloadImage() no encontrada"
fi

if grep -q "getOptimizedImageUrl" front/src/utils/imageUtils.js; then
    log_info "Función getOptimizedImageUrl() añadida"
else
    log_error "Función getOptimizedImageUrl() no encontrada"
fi

# 3. Verificar meta tags móviles en index.html
echo ""
echo "🔍 Verificando meta tags móviles en index.html..."

if grep -q "mobile-web-app-capable" front/index.html; then
    log_info "Meta tag mobile-web-app-capable encontrado"
else
    log_error "Meta tag mobile-web-app-capable no encontrado"
fi

if grep -q "viewport-fit=cover" front/index.html; then
    log_info "Meta viewport con viewport-fit=cover encontrado"
else
    log_error "Meta viewport optimizado no encontrado"
fi

# 4. Verificar estilos CSS móviles
echo ""
echo "🔍 Verificando estilos CSS móviles..."

if grep -q "pinch-zoom-image" front/src/index.css; then
    log_info "Clase pinch-zoom-image añadida"
else
    log_error "Clase pinch-zoom-image no encontrada"
fi

if grep -q "image-action-button" front/src/index.css; then
    log_info "Clase image-action-button añadida"
else
    log_error "Clase image-action-button no encontrada"
fi

if grep -q "touch-action: manipulation" front/src/index.css; then
    log_info "Optimización touch-action añadida"
else
    log_error "Optimización touch-action no encontrada"
fi

# 5. Verificar configuración CORS móvil en server
echo ""
echo "🔍 Verificando configuración CORS móvil en server..."

if grep -q "isMobile.*Android" server/index.js; then
    log_info "Detección de móviles en CORS añadida"
else
    log_error "Detección de móviles en CORS no encontrada"
fi

if grep -q "192.168." server/index.js; then
    log_info "Soporte para IP local/móvil añadido"
else
    log_error "Soporte para IP local/móvil no encontrado"
fi

# 6. Verificar importaciones actualizadas
echo ""
echo "🔍 Verificando importaciones actualizadas..."

if grep -q "preloadImage.*getOptimizedImageUrl" front/src/pages/MostrarLibro/MostrarLibro.jsx; then
    log_info "Importaciones actualizadas en MostrarLibro.jsx"
else
    log_error "Importaciones no actualizadas en MostrarLibro.jsx"
fi

if grep -q "getOptimizedImageUrl" front/src/pages/busquedas/busquedas.jsx; then
    log_info "Importaciones actualizadas en busquedas.jsx"
else
    log_error "Importaciones no actualizadas en busquedas.jsx"
fi

echo ""
echo "📱 Pruebas completadas!"
echo ""
echo "🔧 Próximos pasos para pruebas en dispositivos reales:"
echo "1. Compilar el frontend: npm run build"
echo "2. Servir el build: npm run preview"
echo "3. Probar en móvil usando la IP local"
echo "4. Verificar que las imágenes cargan correctamente"
echo "5. Probar funcionalidad de zoom y descarga"
echo ""
echo "📝 Para desarrollo móvil local:"
echo "1. Encontrar IP local: ipconfig (Windows) o ifconfig (Mac/Linux)"
echo "2. Usar http://[TU-IP]:5173 en el móvil"
echo "3. Asegurar que el servidor backend esté corriendo"
echo ""
echo "🚀 ¡Mejoras móviles implementadas!"

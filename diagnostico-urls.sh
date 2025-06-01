#!/bin/bash

# 🎯 DIAGNÓSTICO ESPECÍFICO DE URLS DE IMÁGENES
# Script para identificar problemas exactos en la generación de URLs

echo "🎯 DIAGNÓSTICO ESPECÍFICO DE URLS DE IMÁGENES"
echo "=============================================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Verificando URLs generadas por imageUtils.js${NC}"

# 1. Test directo de URLs conocidas
echo ""
echo "📋 TEST 1: URLs DIRECTAS CONOCIDAS"
echo "================================="

test_urls=(
    "http://localhost:10000/uploads/1746055049685-diagrama_ep.png"
    "https://libro-resoluciones-backend.onrender.com/uploads/1746055049685-diagrama_ep.png"
    "http://localhost:10000/render-health"
    "https://libro-resoluciones-backend.onrender.com/render-health"
)

for url in "${test_urls[@]}"; do
    echo -n "Testing: $url ... "
    if curl -s --head "$url" | head -n 1 | grep -q "200\|302"; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response headers:"
        curl -s --head "$url" | head -n 5
    fi
    echo ""
done

# 2. Verificar servidor backend está corriendo
echo ""
echo "📋 TEST 2: VERIFICAR SERVIDOR BACKEND"
echo "====================================="

if netstat -an 2>/dev/null | grep -q ":10000"; then
    echo -e "${GREEN}✅ Puerto 10000 en uso${NC}"
else
    echo -e "${RED}❌ Puerto 10000 no está en uso${NC}"
    echo "   Ejecutar: cd server && npm start"
fi

# 3. Verificar archivos físicos
echo ""
echo "📋 TEST 3: VERIFICAR ARCHIVOS FÍSICOS"
echo "====================================="

if [ -f "server/uploads/1746055049685-diagrama_ep.png" ]; then
    echo -e "${GREEN}✅ Archivo imagen existe${NC}"
    file_size=$(stat -f%z "server/uploads/1746055049685-diagrama_ep.png" 2>/dev/null || stat -c%s "server/uploads/1746055049685-diagrama_ep.png" 2>/dev/null)
    echo "   Tamaño: $file_size bytes"
else
    echo -e "${RED}❌ Archivo imagen no existe${NC}"
fi

# 4. Test de IP local para móviles
echo ""
echo "📋 TEST 4: IP LOCAL PARA MÓVILES"
echo "================================"

# Obtener IP local (funciona en Windows y Linux)
if command -v ipconfig >/dev/null 2>&1; then
    # Windows
    local_ip=$(ipconfig | grep "IPv4" | head -n 1 | awk '{print $NF}')
elif command -v hostname >/dev/null 2>&1; then
    # Linux/Mac
    local_ip=$(hostname -I | awk '{print $1}')
else
    local_ip="No detectada"
fi

if [ "$local_ip" != "No detectada" ]; then
    echo -e "${GREEN}✅ IP Local detectada: $local_ip${NC}"
    echo "   URL para móvil: http://$local_ip:5173"
    echo "   URL de imagen: http://$local_ip:10000/uploads/1746055049685-diagrama_ep.png"
    
    # Test de la IP local si está disponible
    if ping -c 1 -W 1000 "$local_ip" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ IP local accesible${NC}"
    else
        echo -e "${YELLOW}⚠️ IP local no responde a ping${NC}"
    fi
else
    echo -e "${RED}❌ No se pudo detectar IP local${NC}"
fi

# 5. Generar comandos específicos para debug
echo ""
echo "📋 TEST 5: COMANDOS PARA DEBUG MANUAL"
echo "===================================="

echo ""
echo "🔧 Para probar manualmente:"
echo "-------------------------"
echo "1. Backend:"
echo "   curl -I http://localhost:10000/render-health"
echo "   curl -I http://localhost:10000/uploads/1746055049685-diagrama_ep.png"
echo ""
echo "2. Producción:"
echo "   curl -I https://libro-resoluciones-backend.onrender.com/render-health"
echo "   curl -I https://libro-resoluciones-backend.onrender.com/uploads/1746055049685-diagrama_ep.png"
echo ""
echo "3. Móvil (usando IP local):"
if [ "$local_ip" != "No detectada" ]; then
    echo "   curl -I http://$local_ip:10000/render-health"
    echo "   curl -I http://$local_ip:10000/uploads/1746055049685-diagrama_ep.png"
fi

# 6. Verificar configuración CORS específica
echo ""
echo "📋 TEST 6: VERIFICAR CONFIGURACIÓN CORS"
echo "======================================="

if grep -q "Access-Control-Allow-Origin" server/index.js; then
    echo -e "${GREEN}✅ CORS configurado en server/index.js${NC}"
    
    # Mostrar líneas relevantes de CORS
    echo "Configuraciones CORS encontradas:"
    grep -n "Access-Control\|allowedOrigins\|origin" server/index.js | head -n 10
else
    echo -e "${RED}❌ CORS no encontrado en server/index.js${NC}"
fi

# 7. Problema más probable identificado
echo ""
echo "🎯 ANÁLISIS DEL PROBLEMA MÁS PROBABLE"
echo "===================================="

echo ""
echo -e "${YELLOW}🔍 CAUSAS POSIBLES DEL PROBLEMA:${NC}"
echo ""
echo "1. 🌐 CONECTIVIDAD:"
echo "   - Backend no está corriendo (puerto 10000)"
echo "   - Firewall bloqueando conexiones"
echo "   - Móvil no está en la misma red WiFi"
echo ""
echo "2. 📱 CONFIGURACIÓN MÓVIL:"
echo "   - URL base incorrecta en variables de entorno"
echo "   - Protocolo HTTP vs HTTPS en móvil"
echo "   - Navegador móvil bloqueando contenido mixto"
echo ""
echo "3. 🔒 CORS:"
echo "   - Headers CORS no permiten el origen móvil"
echo "   - Preflight requests fallando"
echo "   - User-Agent móvil no reconocido"
echo ""
echo "4. 🖼️ CONFIGURACIÓN DE IMÁGENES:"
echo "   - Ruta /uploads no accessible"
echo "   - Permisos de archivos incorrectos"
echo "   - Content-Type headers incorrectos"

echo ""
echo -e "${GREEN}✅ Para resolver, ejecutar en orden:${NC}"
echo "1. cd server && npm start"
echo "2. cd front && npm run dev"
echo "3. Usar IP local en móvil: http://$local_ip:5173"
echo "4. Abrir mobile-diagnostic.html en móvil"
echo "5. Ejecutar todos los tests de diagnóstico"

echo ""
echo "🚀 Diagnóstico específico completado"

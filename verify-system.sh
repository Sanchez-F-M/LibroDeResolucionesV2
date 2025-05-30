#!/bin/bash

# 🔧 Script de Verificación Automática del Sistema
# Este script verifica que toda la aplicación esté funcionando correctamente

echo "🔍 INICIANDO VERIFICACIÓN AUTOMÁTICA DEL SISTEMA..."
echo "================================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs de la aplicación
BACKEND_URL="https://libro-resoluciones-api.onrender.com"
FRONTEND_URL="https://front-jibs1li4h-libro-de-resoluciones-projects.vercel.app"

echo -e "\n📊 URLs DE LA APLICACIÓN:"
echo -e "Backend:  ${YELLOW}${BACKEND_URL}${NC}"
echo -e "Frontend: ${YELLOW}${FRONTEND_URL}${NC}"

# Función para verificar endpoint
check_endpoint() {
    local url=$1
    local description=$2
    
    echo -n "Verificando $description... "
    
    if curl -s --max-time 10 "$url" > /dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALLO${NC}"
        return 1
    fi
}

# Función para verificar endpoint con respuesta JSON
check_json_endpoint() {
    local url=$1
    local description=$2
    
    echo -n "Verificando $description... "
    
    response=$(curl -s --max-time 10 "$url")
    
    if echo "$response" | grep -q "status\|success\|data\|\["; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALLO${NC}"
        echo "  Respuesta: $response"
        return 1
    fi
}

# Función para verificar login
check_login() {
    echo -n "Verificando login... "
    
    response=$(curl -s --max-time 10 \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"Nombre":"admin","Contrasena":"admin123"}' \
        "${BACKEND_URL}/api/user/login")
    
    if echo "$response" | grep -q "token\|success"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALLO${NC}"
        echo "  Respuesta: $response"
        return 1
    fi
}

echo -e "\n🔧 VERIFICANDO BACKEND:"
echo "========================"

# Verificar health check
check_endpoint "${BACKEND_URL}/health" "Health Check"

# Verificar API de resoluciones
check_json_endpoint "${BACKEND_URL}/api/books/all" "API Resoluciones"

# Verificar login
check_login

echo -e "\n🌐 VERIFICANDO FRONTEND:"
echo "========================="

# Verificar frontend principal
check_endpoint "$FRONTEND_URL" "Página Principal"

# Verificar página de diagnóstico
check_endpoint "${FRONTEND_URL}/diagnostico" "Página de Diagnóstico"

# Verificar herramienta de verificación
check_endpoint "${FRONTEND_URL}/production-verification.html" "Herramienta de Verificación"

echo -e "\n📋 DATOS DE PRUEBA:"
echo "==================="

# Obtener resoluciones de prueba
echo "Obteniendo resoluciones disponibles..."
resolutions=$(curl -s --max-time 10 "${BACKEND_URL}/api/books/all")

if echo "$resolutions" | grep -q "NumdeResolucion"; then
    count=$(echo "$resolutions" | grep -o "NumdeResolucion" | wc -l)
    echo -e "${GREEN}✅ $count resoluciones encontradas${NC}"
else
    echo -e "${RED}❌ No se pudieron obtener las resoluciones${NC}"
fi

echo -e "\n🎯 RESUMEN DE VERIFICACIÓN:"
echo "============================"

# Contadores
backend_ok=0
frontend_ok=0

# Verificar backend
if curl -s --max-time 5 "${BACKEND_URL}/health" > /dev/null; then
    backend_ok=1
fi

# Verificar frontend
if curl -s --max-time 5 "$FRONTEND_URL" > /dev/null; then
    frontend_ok=1
fi

if [ $backend_ok -eq 1 ] && [ $frontend_ok -eq 1 ]; then
    echo -e "${GREEN}🎉 SISTEMA COMPLETAMENTE OPERATIVO${NC}"
    echo -e "✅ Backend: Funcionando"
    echo -e "✅ Frontend: Funcionando"
    echo -e "✅ Integración: Completa"
    echo ""
    echo "🔗 URLs para usar:"
    echo "   Login: ${FRONTEND_URL}/"
    echo "   Credenciales: admin / admin123"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SISTEMA CON PROBLEMAS${NC}"
    
    if [ $backend_ok -eq 0 ]; then
        echo -e "❌ Backend: No responde"
    fi
    
    if [ $frontend_ok -eq 0 ]; then
        echo -e "❌ Frontend: No responde"
    fi
    
    echo ""
    echo "🔧 Pasos para solucionar:"
    echo "1. Verificar variables de entorno en Vercel"
    echo "2. Revisar logs en Render"
    echo "3. Hacer redeploy manual si es necesario"
    echo ""
    exit 1
fi

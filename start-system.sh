#!/bin/bash

# 🚀 INICIO RÁPIDO DEL SISTEMA COMPLETO
# Script para iniciar backend y frontend simultáneamente

echo "🚀 INICIANDO SISTEMA LIBRO DE RESOLUCIONES"
echo "=========================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📋 Verificando estructura del proyecto...${NC}"

# Verificar directorios
if [ ! -d "server" ]; then
    echo "❌ Directorio server no encontrado"
    exit 1
fi

if [ ! -d "front" ]; then
    echo "❌ Directorio front no encontrado"
    exit 1
fi

echo -e "${GREEN}✅ Estructura del proyecto verificada${NC}"

# Función para obtener IP local
get_local_ip() {
    if command -v ipconfig >/dev/null 2>&1; then
        # Windows
        ipconfig | grep "IPv4" | head -n 1 | awk '{print $NF}' | tr -d '\r'
    elif command -v hostname >/dev/null 2>&1; then
        # Linux/Mac
        hostname -I | awk '{print $1}'
    else
        echo "localhost"
    fi
}

LOCAL_IP=$(get_local_ip)

echo ""
echo -e "${BLUE}🌐 Configuración de red:${NC}"
echo "IP Local: $LOCAL_IP"
echo "Frontend: http://$LOCAL_IP:5173"
echo "Backend: http://$LOCAL_IP:10000"
echo ""

# Matar procesos previos en los puertos
echo -e "${BLUE}🧹 Limpiando puertos previos...${NC}"

# Windows
if command -v taskkill >/dev/null 2>&1; then
    for port in 5173 10000; do
        netstat -ano | findstr :$port | awk '{print $5}' | xargs -r taskkill //PID //F 2>/dev/null || true
    done
fi

# Linux/Mac  
if command -v lsof >/dev/null 2>&1; then
    lsof -ti:5173 | xargs -r kill -9 2>/dev/null || true
    lsof -ti:10000 | xargs -r kill -9 2>/dev/null || true
fi

echo ""
echo -e "${BLUE}🚀 Iniciando servicios...${NC}"

# Función para iniciar backend
start_backend() {
    echo "📦 Iniciando Backend..."
    cd server
    
    # Instalar dependencias si es necesario
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias del backend..."
        npm install
    fi
    
    # Iniciar servidor
    npm start &
    BACKEND_PID=$!
    cd ..
    
    echo "✅ Backend iniciado (PID: $BACKEND_PID)"
    echo "🔗 Health check: http://$LOCAL_IP:10000/render-health"
}

# Función para iniciar frontend
start_frontend() {
    echo "🌐 Iniciando Frontend..."
    cd front
    
    # Instalar dependencias si es necesario
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias del frontend..."
        npm install
    fi
    
    # Iniciar desarrollo
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
    echo "🔗 URL local: http://$LOCAL_IP:5173"
}

# Iniciar ambos servicios
start_backend
sleep 3
start_frontend

echo ""
echo -e "${GREEN}🎉 SISTEMA INICIADO CORRECTAMENTE${NC}"
echo "=================================="
echo ""
echo "📱 Para acceso móvil:"
echo "   1. Conectar móvil a la misma red WiFi"
echo "   2. Abrir navegador móvil"
echo "   3. Ir a: http://$LOCAL_IP:5173"
echo ""
echo "🔧 Para diagnóstico móvil:"
echo "   Ir a: http://$LOCAL_IP:5173/mobile-diagnostic.html"
echo ""
echo "🛑 Para detener los servicios:"
echo "   Ctrl+C o cerrar esta terminal"
echo ""

# Función de limpieza al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    
    # Matar procesos hijos
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Limpiar puertos en Windows
    if command -v taskkill >/dev/null 2>&1; then
        for port in 5173 10000; do
            netstat -ano | findstr :$port | awk '{print $5}' | xargs -r taskkill //PID //F 2>/dev/null || true
        done
    fi
    
    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT TERM

# Mantener el script corriendo
echo "⏳ Servicios corriendo... Presiona Ctrl+C para detener"
wait

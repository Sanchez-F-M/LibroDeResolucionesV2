#!/bin/bash

# 🚀 INICIO RÁPIDO DEL SISTEMA COMPLETO
# Script mejorado para Windows/WSL/Linux
# Compatible con bash.exe en Windows

echo "🚀 INICIANDO SISTEMA LIBRO DE RESOLUCIONES"
echo "=========================================="

# Colores para Windows/WSL
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WSL_DISTRO_NAME" ]] || [[ -n "$WSLENV" ]]; then
    GREEN='\033[0;32m'
    BLUE='\033[0;34m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    NC='\033[0m'
    IS_WINDOWS=true
else
    GREEN='\033[0;32m'
    BLUE='\033[0;34m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    NC='\033[0m'
    IS_WINDOWS=false
fi

echo -e "${BLUE}🖥️  Sistema detectado: $OSTYPE${NC}"
if [[ "$IS_WINDOWS" == true ]]; then
    echo -e "${YELLOW}⚠️  Ejecutando en entorno Windows${NC}"
fi

echo -e "${BLUE}📋 Verificando estructura del proyecto...${NC}"

# Verificar directorios
if [ ! -d "server" ]; then
    echo -e "${RED}❌ Directorio server no encontrado${NC}"
    echo "Asegúrate de ejecutar el script desde la raíz del proyecto"
    exit 1
fi

if [ ! -d "front" ]; then
    echo -e "${RED}❌ Directorio front no encontrado${NC}"
    echo "Asegúrate de ejecutar el script desde la raíz del proyecto"
    exit 1
fi

echo -e "${GREEN}✅ Estructura del proyecto verificada${NC}"

# Función para obtener IP local mejorada para Windows
get_local_ip() {
    local ip=""
    
    if [[ "$IS_WINDOWS" == true ]]; then
        # Para Windows/WSL - múltiples métodos
        if command -v ipconfig.exe >/dev/null 2>&1; then
            # Método 1: ipconfig.exe
            ip=$(ipconfig.exe | grep -A 4 "Wireless LAN adapter Wi-Fi" | grep "IPv4" | head -n 1 | sed 's/.*: //' | tr -d '\r\n ')
            if [[ -z "$ip" ]]; then
                # Método 2: Ethernet adapter
                ip=$(ipconfig.exe | grep -A 4 "Ethernet adapter" | grep "IPv4" | head -n 1 | sed 's/.*: //' | tr -d '\r\n ')
            fi
        fi
        
        if [[ -z "$ip" ]] && command -v hostname >/dev/null 2>&1; then
            # Método 3: hostname
            ip=$(hostname -I 2>/dev/null | awk '{print $1}' | tr -d '\r\n ')
        fi
        
        if [[ -z "$ip" ]]; then
            # Método 4: WSL specific
            ip=$(cat /etc/resolv.conf 2>/dev/null | grep nameserver | awk '{print $2}' | head -n 1)
        fi
    else
        # Para Linux/Mac
        if command -v hostname >/dev/null 2>&1; then
            ip=$(hostname -I | awk '{print $1}')
        elif command -v ip >/dev/null 2>&1; then
            ip=$(ip route get 1 | awk '{print $7; exit}')
        fi
    fi
    
    # Fallback
    if [[ -z "$ip" ]] || [[ "$ip" == "127.0.0.1" ]]; then
        ip="localhost"
    fi
    
    echo "$ip"
}

LOCAL_IP=$(get_local_ip)

echo ""
echo -e "${BLUE}🌐 Configuración de red:${NC}"
echo "IP Local: $LOCAL_IP"
echo "Frontend: http://$LOCAL_IP:5173"
echo "Backend: http://$LOCAL_IP:10000"
echo ""

# Función mejorada para limpiar puertos
cleanup_ports() {
    echo -e "${BLUE}🧹 Limpiando puertos previos...${NC}"
    
    if [[ "$IS_WINDOWS" == true ]]; then
        # Windows - usar netstat y taskkill
        for port in 5173 10000; do
            if command -v netstat.exe >/dev/null 2>&1; then
                pids=$(netstat.exe -ano 2>/dev/null | grep ":$port " | awk '{print $5}' | sort -u)
                for pid in $pids; do
                    if [[ "$pid" =~ ^[0-9]+$ ]] && [[ "$pid" != "0" ]]; then
                        taskkill.exe //PID "$pid" //F >/dev/null 2>&1 || true
                        echo "  Terminado proceso en puerto $port (PID: $pid)"
                    fi
                done
            fi
        done
    else
        # Linux/Mac - usar lsof
        if command -v lsof >/dev/null 2>&1; then
            for port in 5173 10000; do
                pids=$(lsof -ti:$port 2>/dev/null)
                for pid in $pids; do
                    kill -9 "$pid" 2>/dev/null || true
                    echo "  Terminado proceso en puerto $port (PID: $pid)"
                done
            done
        fi
    fi
    
    sleep 1
}

# Función para verificar si Node.js está instalado
check_node() {
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        echo "Por favor instala Node.js desde: https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        echo -e "${RED}❌ npm no está instalado${NC}"
        echo "npm debería venir con Node.js"
        exit 1
    fi
    
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION y npm $NPM_VERSION detectados${NC}"
}

# Función para iniciar backend con manejo de errores
start_backend() {
    echo -e "${BLUE}📦 Iniciando Backend...${NC}"
    cd server || exit 1
    
    # Verificar package.json
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json no encontrado en server/${NC}"
        cd ..
        exit 1
    fi
    
    # Instalar dependencias si es necesario
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Error instalando dependencias del backend${NC}"
            cd ..
            exit 1
        fi
    fi
    
    # Verificar si el script start existe
    if ! npm run start --silent 2>/dev/null | grep -q "start"; then
        echo -e "${YELLOW}⚠️  Script 'start' no encontrado, usando 'npm start'${NC}"
    fi
    
    # Iniciar servidor en background
    echo "  Ejecutando: npm start"
    npm start &
    BACKEND_PID=$!
    cd ..
    
    echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
    echo "🔗 Health check: http://$LOCAL_IP:10000/render-health"
    
    # Verificar que el backend se inició correctamente
    sleep 3
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo -e "${RED}❌ El backend no se pudo iniciar correctamente${NC}"
        exit 1
    fi
}

# Función para iniciar frontend con manejo de errores
start_frontend() {
    echo -e "${BLUE}🌐 Iniciando Frontend...${NC}"
    cd front || exit 1
    
    # Verificar package.json
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json no encontrado en front/${NC}"
        cd ..
        exit 1
    fi
    
    # Instalar dependencias si es necesario
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Error instalando dependencias del frontend${NC}"
            cd ..
            exit 1
        fi
    fi
    
    # Verificar si el script dev existe
    if ! npm run dev --silent 2>/dev/null | grep -q "dev"; then
        echo -e "${YELLOW}⚠️  Script 'dev' no encontrado, verificando alternativas...${NC}"
        if npm run start --silent 2>/dev/null | grep -q "start"; then
            echo "  Usando 'npm run start' en su lugar"
            npm run start &
        else
            echo -e "${RED}❌ No se encontró script de desarrollo${NC}"
            cd ..
            exit 1
        fi
    else
        # Iniciar desarrollo
        echo "  Ejecutando: npm run dev"
        npm run dev &
    fi
    
    FRONTEND_PID=$!
    cd ..
    
    echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
    echo "🔗 URL local: http://$LOCAL_IP:5173"
    
    # Verificar que el frontend se inició correctamente
    sleep 3
    if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo -e "${RED}❌ El frontend no se pudo iniciar correctamente${NC}"
        exit 1
    fi
}

# Función de limpieza mejorada
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    
    # Matar procesos hijos
    if [ ! -z "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo "  Deteniendo backend (PID: $BACKEND_PID)"
        kill "$BACKEND_PID" 2>/dev/null || true
        sleep 1
        kill -9 "$BACKEND_PID" 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo "  Deteniendo frontend (PID: $FRONTEND_PID)"
        kill "$FRONTEND_PID" 2>/dev/null || true
        sleep 1
        kill -9 "$FRONTEND_PID" 2>/dev/null || true
    fi
    
    # Limpiar puertos
    cleanup_ports
    
    echo -e "${GREEN}✅ Servicios detenidos correctamente${NC}"
    exit 0
}

# EJECUCIÓN PRINCIPAL
echo -e "${BLUE}🔍 Verificando requisitos...${NC}"
check_node

echo -e "${BLUE}🧹 Preparando entorno...${NC}"
cleanup_ports

echo ""
echo -e "${BLUE}🚀 Iniciando servicios...${NC}"

# Iniciar servicios
start_backend
echo ""
start_frontend

echo ""
echo -e "${GREEN}🎉 SISTEMA INICIADO CORRECTAMENTE${NC}"
echo "=================================="
echo ""
echo -e "${BLUE}📱 Para acceso desde otros dispositivos:${NC}"
echo "   1. Conectar dispositivo a la misma red WiFi"
echo "   2. Abrir navegador"
echo "   3. Ir a: http://$LOCAL_IP:5173"
echo ""
echo -e "${BLUE}🔧 URLs útiles:${NC}"
echo "   Frontend: http://$LOCAL_IP:5173"
echo "   Backend:  http://$LOCAL_IP:10000"
echo "   Health:   http://$LOCAL_IP:10000/render-health"
echo ""
echo -e "${BLUE}🛑 Para detener los servicios:${NC}"
echo "   Presiona Ctrl+C en esta terminal"
echo ""

# Capturar señales de interrupción
trap cleanup INT TERM EXIT

# Mantener el script corriendo y mostrar logs
echo -e "${YELLOW}⏳ Servicios activos... Presiona Ctrl+C para detener${NC}"
echo "📊 Monitoreando procesos (PIDs: Backend=$BACKEND_PID, Frontend=$FRONTEND_PID)"

# Loop para mantener el script activo y verificar procesos
while true; do
    sleep 5
    
    # Verificar si los procesos siguen activos
    if [ ! -z "$BACKEND_PID" ] && ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo -e "${RED}⚠️  Backend process has stopped unexpectedly${NC}"
        BACKEND_PID=""
    fi
    
    if [ ! -z "$FRONTEND_PID" ] && ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo -e "${RED}⚠️  Frontend process has stopped unexpectedly${NC}"
        FRONTEND_PID=""
    fi
    
    # Si ambos procesos han terminado, salir
    if [ -z "$BACKEND_PID" ] && [ -z "$FRONTEND_PID" ]; then
        echo -e "${RED}❌ Todos los servicios han terminado${NC}"
        break
    fi
done
